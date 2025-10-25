import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import HttpService from '../services/httpService';
import { UseCommentsProps } from '../types';

export function useComments({ projectId, sortBy, initialComments = [] }: UseCommentsProps) {
  const queryClient = useQueryClient();

  // Validar que projectId sea un UUID válido
  if (!projectId || projectId === 'null' || projectId === 'undefined') {
    throw new Error('ProjectId is required and must be a valid UUID');
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteQuery({
    queryKey: ['comments', projectId, sortBy],
    queryFn: async ({ pageParam = 0 }) => {
      // Convertir pageParam de 0-based a 1-based para el backend
      const page = pageParam + 1;
      const endpoint = `/comments/project/${projectId}?page=${page}&limit=10&sort=${sortBy}`;
      
      const response = await HttpService.get(endpoint);
      return {
        data: response.data.comments,
        has_more: response.data.has_more,
        total: response.data.total
      };
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.has_more ? pages.length : undefined;
    },
    initialData: initialComments.length > 0 ? {
      pages: [{ data: initialComments, has_more: false, total: initialComments.length }],
      pageParams: [0]
    } : undefined,
    staleTime: 15 * 60 * 1000, // 15 minutos - evita refetch automático
    gcTime: 60 * 60 * 1000, // 1 hora - mantiene cache más tiempo
    refetchOnWindowFocus: false, // No refetch al cambiar de ventana
    refetchOnMount: false, // No refetch al montar componente
    refetchOnReconnect: false, // No refetch al reconectar
    retry: (failureCount, error: any) => {
      // Solo reintentar en errores de red, no en errores 4xx
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    initialPageParam: 0
  });

  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await HttpService.post(`/comments/project/${projectId}`, { content });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', projectId] });
    }
  });

  const toggleLikeMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const response = await HttpService.post(`/comments/${commentId}/like`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', projectId] });
    }
  });

  const items = data?.pages.flatMap(page => page.data) || [];
  const total = data?.pages[0]?.total || 0;

  // Función para refrescar manualmente
  const refreshComments = () => {
    queryClient.invalidateQueries({ queryKey: ['comments', projectId] });
  };

  return {
    items,
    total,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    createComment: createCommentMutation.mutate,
    toggleLike: toggleLikeMutation.mutate,
    isCreatingComment: createCommentMutation.isPending,
    refreshComments // Nueva función para refresh manual
  };
}
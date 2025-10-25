import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  created_at: string;
  updated_at: string;
  replies_count: number;
  likes_count: number;
  is_liked: boolean;
}

interface UseCommentsProps {
  projectId: string;
  sortBy: 'newest' | 'oldest' | 'popular';
  initialComments?: Comment[];
}

export function useComments({ projectId, sortBy, initialComments = [] }: UseCommentsProps) {
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch
  } = useInfiniteQuery({
    queryKey: ['comments', projectId, sortBy],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(
        `/api/projects/${projectId}/comments?page=${pageParam}&limit=10&sort=${sortBy}`
      );
      const data = await response.json();
      return {
        data: data.comments,
        has_more: data.has_more,
        total: data.total
      };
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.has_more ? pages.length : undefined;
    },
    initialData: initialComments.length > 0 ? {
      pages: [{ data: initialComments, has_more: false, total: initialComments.length }],
      pageParams: [0]
    } : undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    initialPageParam: 0
  });

  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch(`/api/projects/${projectId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      if (!response.ok) throw new Error('Error al crear comentario');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', projectId] });
    }
  });

  const toggleLikeMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Error al dar like');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', projectId] });
    }
  });

  const items = data?.pages.flatMap(page => page.data) || [];
  const total = data?.pages[0]?.total || 0;

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
    isCreatingComment: createCommentMutation.isPending
  };
}
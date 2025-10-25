import { useMutation, useQueryClient } from '@tanstack/react-query';

interface OptimisticUpdateConfig<T> {
  queryKey: (string | number)[];
  mutationFn: (variables: any) => Promise<T>;
  onMutate?: (variables: any, context?: any) => any;
  onSuccess?: (data: T, variables: any, context?: any) => void;
  onError?: (error: any, variables: any, context?: any) => void;
  onSettled?: (data?: T, error?: any, variables?: any, context?: any) => void;
}

export function useOptimisticUpdate<T>({
  queryKey,
  mutationFn,
  onMutate,
  onSuccess,
  onError,
  onSettled
}: OptimisticUpdateConfig<T>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey });

      // Snapshot del cache anterior
      const previousData = queryClient.getQueryData(queryKey);

      // Ejecutar función de mutación optimista
      const context = onMutate?.(variables, { previousData });

      return { previousData, context };
    },
    onError: (error, variables, context) => {
      // Revertir cambios en caso de error
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      onError?.(error, variables, context);
    },
    onSuccess: (data, variables, context) => {
      onSuccess?.(data, variables, context);
    },
    onSettled: (data, error, variables, context) => {
      // Invalidar queries para refrescar datos
      queryClient.invalidateQueries({ queryKey });
      onSettled?.(data, error, variables, context);
    }
  });
}

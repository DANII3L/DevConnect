import { useInfiniteQuery } from '@tanstack/react-query';

interface InfiniteScrollConfig<T> {
  queryKey: (string | number)[];
  queryFn: (pageParam: number) => Promise<{
    data: T[];
    has_more: boolean;
    total?: number;
  }>;
  initialData?: T[];
  staleTime?: number;
  gcTime?: number;
}

export function useInfiniteScroll<T>({
  queryKey,
  queryFn,
  initialData = [],
  staleTime = 5 * 60 * 1000,
  gcTime = 10 * 60 * 1000
}: InfiniteScrollConfig<T>) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      return await queryFn(pageParam);
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.has_more ? pages.length : undefined;
    },
    initialData: initialData.length > 0 ? {
      pages: [{ data: initialData, has_more: false }],
      pageParams: [0]
    } : undefined,
    staleTime,
    gcTime,
    initialPageParam: 0
  });

  const allItems = data?.pages.flatMap(page => page.data) || [];
  const total = data?.pages[0]?.total || 0;

  return {
    items: allItems,
    total,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch
  };
}

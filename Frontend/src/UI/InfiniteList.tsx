import React, { ReactNode } from 'react';

interface InfiniteListProps<T> {
  items: T[];
  total: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  renderItem: (item: T, index: number) => ReactNode;
  renderEmpty?: () => ReactNode;
  renderError?: (error: any) => ReactNode;
  isLoading?: boolean;
  error?: any;
  className?: string;
  loadMoreText?: string;
  loadingText?: string;
}

export function InfiniteList<T>({
  items,
  total,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  renderItem,
  renderEmpty,
  renderError,
  isLoading,
  error,
  className = "space-y-4",
  loadMoreText = "Cargar más",
  loadingText = "Cargando..."
}: InfiniteListProps<T>) {
  if (isLoading) return <div>{loadingText}</div>;
  
  if (error) {
    return renderError ? renderError(error) : (
      <div className="text-center text-red-500">
        Error al cargar los datos
      </div>
    );
  }

  if (items.length === 0) {
    return renderEmpty ? renderEmpty() : (
      <div className="text-center text-gray-500">
        No hay elementos para mostrar
      </div>
    );
  }

  return (
    <div className={className}>
      {items.map((item, index) => (
        <div key={index}>
          {renderItem(item, index)}
        </div>
      ))}

      {hasNextPage && (
        <div className="text-center mt-6">
          <button
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isFetchingNextPage ? loadingText : loadMoreText}
          </button>
        </div>
      )}
    </div>
  );
}
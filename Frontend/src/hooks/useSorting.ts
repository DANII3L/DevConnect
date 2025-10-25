import { useState, useCallback } from 'react';

type SortOption<T> = {
  value: T;
  label: string;
  icon?: string;
};

interface UseSortingProps<T> {
  initialSort: T;
  options: SortOption<T>[];
  onSortChange?: (sort: T) => void;
}

export function useSorting<T>({
  initialSort,
  options,
  onSortChange
}: UseSortingProps<T>) {
  const [currentSort, setCurrentSort] = useState<T>(initialSort);

  const handleSortChange = useCallback((newSort: T) => {
    setCurrentSort(newSort);
    onSortChange?.(newSort);
  }, [onSortChange]);

  const getCurrentOption = useCallback(() => {
    return options.find(option => option.value === currentSort);
  }, [options, currentSort]);

  return {
    currentSort,
    setSort: handleSortChange,
    options,
    currentOption: getCurrentOption()
  };
}

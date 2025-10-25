import React from 'react';

interface SortOption<T> {
  value: T;
  label: string;
  icon?: string;
}

interface SortSelectorProps<T> {
  options: SortOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  disabled?: boolean;
}

export function SortSelector<T>({
  options,
  value,
  onChange,
  className = "",
  disabled = false
}: SortSelectorProps<T>) {
  return (
    <select
      value={value as string}
      onChange={(e) => onChange(e.target.value as T)}
      disabled={disabled}
      className={`px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${className}`}
    >
      {options.map((option) => (
        <option key={String(option.value)} value={String(option.value)}>
          {option.icon && <span>{option.icon} </span>}
          {option.label}
        </option>
      ))}
    </select>
  );
}

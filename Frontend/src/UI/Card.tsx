import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function Card({ 
  children, 
  className = "", 
  hover = false, 
  clickable = false,
  onClick,
  loading = false,
  disabled = false
}: CardProps) {
  const baseClasses = "border rounded-lg p-4 transition-all duration-200";
  const hoverClasses = hover ? "hover:shadow-md hover:border-gray-300" : "";
  const clickableClasses = clickable ? "cursor-pointer" : "";
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
  const loadingClasses = loading ? "animate-pulse" : "";

  const combinedClasses = [
    baseClasses,
    hoverClasses,
    clickableClasses,
    disabledClasses,
    loadingClasses,
    className
  ].filter(Boolean).join(" ");

  return (
    <div 
      className={combinedClasses}
      onClick={disabled || loading ? undefined : onClick}
    >
      {children}
    </div>
  );
}

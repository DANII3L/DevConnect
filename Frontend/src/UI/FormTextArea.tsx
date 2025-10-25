import React, { useState } from 'react';

interface FormTextAreaProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  disabled?: boolean;
  submitText?: string;
  className?: string;
}

export function FormTextArea({
  onSubmit,
  placeholder = "Escribe tu comentario...",
  maxLength = 1000,
  minLength = 1,
  disabled = false,
  submitText = "Enviar",
  className = ""
}: FormTextAreaProps) {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim().length >= minLength && content.length <= maxLength) {
      onSubmit(content.trim());
      setContent('');
    }
  };

  // Determinar si estamos en modo oscuro basado en las clases
  const isDarkMode = className.includes('bg-slate-800') || className.includes('bg-slate-700');
  
  const textareaClasses = isDarkMode 
    ? "w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 text-white placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none transition-all duration-200"
    : "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all duration-200";

  const buttonClasses = isDarkMode
    ? "px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
    : "px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl";

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={3}
        disabled={disabled}
        className={textareaClasses}
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={disabled || content.trim().length < minLength || content.length > maxLength}
          className={buttonClasses}
        >
          {submitText}
        </button>
      </div>
    </form>
  );
}
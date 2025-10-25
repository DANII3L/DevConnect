import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ReplyCard } from './ReplyCard';
import { ReplyForm } from './ReplyForm';

interface Reply {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  created_at: string;
  likes_count: number;
  is_liked: boolean;
}

interface ReplySectionProps {
  commentId: string;
  projectId: string;
}

export const ReplySection: React.FC<ReplySectionProps> = ({ 
  commentId, 
  projectId 
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  // TODO: Implementar replies cuando esté disponible en el backend
  const replies = [];
  const isLoading = false;
  const refetch = () => {};

  const handleReplySubmit = async (content: string) => {
    // TODO: Implementar cuando esté disponible en el backend
    setShowReplyForm(false);
  };

  return (
    <div className="space-y-3">
      {/* Botón para responder */}
      <button
        onClick={() => setShowReplyForm(!showReplyForm)}
        className="text-sm text-blue-600 hover:text-blue-800"
      >
        {showReplyForm ? 'Cancelar' : 'Responder'}
      </button>

      {/* Formulario de respuesta */}
      {showReplyForm && (
        <ReplyForm
          onSubmit={handleReplySubmit}
          onCancel={() => setShowReplyForm(false)}
        />
      )}

      {/* Lista de respuestas */}
      {isLoading ? (
        <div className="text-sm text-gray-500">Cargando respuestas...</div>
      ) : (
        <div className="space-y-2">
          {replies?.map((reply: Reply) => (
            <ReplyCard
              key={reply.id}
              reply={reply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

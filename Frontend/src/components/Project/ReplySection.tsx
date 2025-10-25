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

  const {
    data: replies,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['replies', commentId],
    queryFn: async () => {
      const response = await fetch(`/api/comments/${commentId}/replies`);
      return response.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  const handleReplySubmit = async (content: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });

      if (!response.ok) throw new Error('Error al crear respuesta');
      
      setShowReplyForm(false);
      refetch();
    } catch (error) {
      console.error('Error:', error);
    }
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

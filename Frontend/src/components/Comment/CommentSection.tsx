import React, { useState, useCallback } from 'react';
import { useComments } from '../../hooks/useComments';
import { CommentCard } from './CommentCard';
import { FormTextArea } from '../../UI/FormTextArea';
import { InfiniteList } from '../../UI/InfiniteList';

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

interface CommentSectionProps {
  projectId: string;
  initialComments?: Comment[];
}

export const CommentSection: React.FC<CommentSectionProps> = ({ 
  projectId, 
  initialComments = [] 
}) => {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [showReplies, setShowReplies] = useState<Set<string>>(new Set());

  // Hook personalizado para comentarios
  const {
    items: comments,
    total,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    createComment,
    toggleLike,
    isCreatingComment
  } = useComments({
    projectId,
    sortBy,
    initialComments
  });

  const toggleReplies = useCallback((commentId: string) => {
    setShowReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  }, []);

  const handleCommentSubmit = useCallback((content: string) => {
    createComment(content);
  }, [createComment]);

  const renderComment = useCallback((comment: Comment) => (
    <CommentCard
      key={comment.id}
      comment={comment}
      showReplies={showReplies.has(comment.id)}
      onToggleReplies={() => toggleReplies(comment.id)}
      onLike={() => toggleLike(comment.id)}
      projectId={projectId}
    />
  ), [showReplies, toggleReplies, toggleLike, projectId]);

  const renderEmpty = () => (
    <div className="text-center py-8 text-slate-400">
      <p>No hay comentarios aún.</p>
      <p className="text-sm">¡Sé el primero en comentar!</p>
    </div>
  );

  const renderError = (error: any) => (
    <div className="text-center py-8 text-red-400">
      <p>Error al cargar comentarios</p>
      <p className="text-sm">{error?.message || 'Intenta recargar la página'}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">
          Comentarios ({total})
        </h3>
        
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguos</option>
            <option value="popular">Más populares</option>
          </select>
        </div>
      </div>

      {/* Lista infinita de comentarios - ARRIBA */}
      <InfiniteList
        items={comments}
        total={total}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={fetchNextPage}
        renderItem={renderComment}
        renderEmpty={renderEmpty}
        renderError={renderError}
        isLoading={isLoading}
        error={error}
        loadMoreText="Cargar más comentarios"
        loadingText="Cargando comentarios..."
        className="space-y-4"
      />

      {/* Formulario de comentario - ABAJO */}
      <div className="border-t border-slate-700 pt-6">
        <FormTextArea
          onSubmit={handleCommentSubmit}
          placeholder="Escribe tu comentario..."
          maxLength={1000}
          minLength={1}
          disabled={isCreatingComment}
          submitText={isCreatingComment ? "Enviando..." : "Comentar"}
          className="bg-slate-800 p-4 rounded-lg border border-slate-600"
        />
      </div>
    </div>
  );
};
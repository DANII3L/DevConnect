import React from 'react';

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

interface CommentCardProps {
  comment: Comment;
  showReplies: boolean;
  onToggleReplies: () => void;
  onLike: () => void;
  projectId: string;
}

export const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  showReplies,
  onToggleReplies,
  onLike,
  projectId
}) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start gap-3">
        <img
          src={comment.author.avatar_url || '/default-avatar.png'}
          alt={comment.author.username}
          className="w-8 h-8 rounded-full"
        />
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{comment.author.username}</span>
            <span className="text-xs text-gray-500">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
          
          <p className="mt-1 text-gray-700 whitespace-pre-wrap">
            {comment.content}
          </p>
          
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={onLike}
              className={`flex items-center gap-1 text-sm hover:text-blue-600 ${
                comment.is_liked ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <span>👍</span>
              <span>{comment.likes_count}</span>
            </button>
            
            <button
              onClick={onToggleReplies}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600"
            >
              <span>💬</span>
              <span>{comment.replies_count}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
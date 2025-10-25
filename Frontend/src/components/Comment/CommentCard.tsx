import React from 'react';
import { CommentCardProps } from '../../types';

export const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  onToggleReplies,
  onLike
}) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 mb-4 transition-all duration-200 hover:bg-slate-800/70">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
          {(comment.author.full_name || comment.author.username).charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-sm text-white">
              {comment.author.full_name || comment.author.username}
            </span>
            <span className="text-xs text-slate-400">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
          
          <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
            {comment.content}
          </p>
          
          <div className="flex items-center gap-6 mt-3">
            <button
              onClick={onLike}
              className={`flex items-center gap-1 text-sm transition-colors duration-200 ${
                comment.is_liked 
                  ? 'text-yellow-400 hover:text-yellow-300' 
                  : 'text-slate-400 hover:text-yellow-400'
              }`}
            >
              <span className="text-lg">👍</span>
              <span className="font-medium">{comment.likes_count}</span>
            </button>
            
            <button
              onClick={onToggleReplies}
              className="flex items-center gap-1 text-sm text-slate-400 hover:text-purple-400 transition-colors duration-200"
            >
              <span className="text-lg">💬</span>
              <span className="font-medium">{comment.replies_count}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
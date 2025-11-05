import { User as UserIcon, Edit, Shield } from 'lucide-react';
import { User } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UserCardProps {
  user: User;
  onViewDetails?: (user: User) => void;
}

export function UserCard({ user, onViewDetails }: UserCardProps) {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const getRoleBadge = (role: string | undefined) => {
    // Normalizar el rol a minúsculas para comparar
    const normalizedRole = role?.toLowerCase()?.trim();
    if (normalizedRole === "admin") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full">
          <Shield className="w-3 h-3" />
          Administrador
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/30">
        <UserIcon className="w-3 h-3" />
        Usuario
      </span>
    );
  };

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(user);
    }
  };

  return (
    <div 
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 p-6 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.full_name || "Avatar"}
              className="w-16 h-16 rounded-full object-cover border-2 border-slate-700"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white truncate">
                {user.username ? `@${user.username}` : "Desarrollador"}
              </h3>
              {user.full_name && (
                <p className="text-slate-400 text-sm truncate">
                  {user.full_name}
                </p>
              )}
            </div>
            {getRoleBadge(user?.role)}
          </div>

          {/* Botón de editar - solo visible para admin */}
          {currentUser?.role === "admin" && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Evitar que se abra el modal
                navigate(`/admin/user/${user.id}`);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Edit className="w-4 h-4" />
              Editar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


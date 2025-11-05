import { X, Mail, Calendar, Globe, User as UserIcon, Shield, Edit, Github, Linkedin, Clock } from 'lucide-react';
import { User } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UserModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export function UserModal({ user, isOpen, onClose }: UserModalProps) {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleBadge = (role: string | undefined) => {
    const normalizedRole = role?.toLowerCase()?.trim();
    if (normalizedRole === "admin") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold rounded-full">
          <Shield className="w-4 h-4" />
          Administrador
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-semibold rounded-full border border-blue-500/30">
        <UserIcon className="w-4 h-4" />
        Usuario
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-slate-800 rounded-2xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">Información del Usuario</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Avatar y nombre */}
            <div className="flex flex-col items-center text-center space-y-4 pb-6 border-b border-slate-700">
              <div className="flex-shrink-0">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name || "Avatar"}
                    className="w-32 h-32 rounded-full object-cover border-4 border-slate-700"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <UserIcon className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">
                  {user.full_name || "Sin nombre"}
                </h3>
                {getRoleBadge(user?.role)}
                {user.username && (
                  <p className="text-slate-400 text-lg">
                    @{user.username}
                  </p>
                )}
              </div>
            </div>

            {/* Información de contacto */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Información de Contacto</h3>

              <div className="space-y-3">
                {user.username && (
                  <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                    <UserIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-400 mb-1">Username</p>
                      <p className="text-white">@{user.username}</p>
                    </div>
                  </div>
                )}

                {user.email && (
                  <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                    <Mail className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-400 mb-1">Email</p>
                      <p className="text-white break-all">{user.email}</p>
                    </div>
                  </div>
                )}

                {/* Enlaces como botones representativos */}
                <div className="flex flex-wrap gap-3">
                  {user.website && (
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg border border-slate-600 transition-colors"
                    >
                      <Globe className="w-4 h-4 text-blue-400" />
                      <span className="text-white text-sm font-medium">Sitio Web</span>
                    </a>
                  )}

                  {user.github_url && (
                    <a
                      href={user.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg border border-slate-600 transition-colors"
                    >
                      <Github className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-medium">GitHub</span>
                    </a>
                  )}

                  {user.linkedin_url && (
                    <a
                      href={user.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg border border-slate-600 transition-colors"
                    >
                      <Linkedin className="w-4 h-4 text-blue-400" />
                      <span className="text-white text-sm font-medium">LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Información de cuenta */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Información de Cuenta</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                  <Calendar className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-400 mb-1">Miembro desde</p>
                    <p className="text-white">{formatDate(user.created_at)}</p>
                  </div>
                </div>

                {user.updated_at && user.updated_at !== user.created_at && (
                  <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                    <Clock className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-400 mb-1">Última actualización</p>
                      <p className="text-white">{formatDate(user.updated_at)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Biografía */}
            {user.bio && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Biografía</h3>
                <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                  <p className="text-slate-300 leading-relaxed">{user.bio}</p>
                </div>
              </div>
            )}

            {/* Botón de editar - solo visible para admin */}
            {currentUser?.role === "admin" && (
              <div className="pt-4 border-t border-slate-700">
                <button
                  onClick={() => {
                    navigate(`/admin/user/${user.id}`);
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  <Edit className="w-5 h-5" />
                  Editar Usuario
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


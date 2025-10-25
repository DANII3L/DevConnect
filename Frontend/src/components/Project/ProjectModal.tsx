import { X, ExternalLink, Github, Calendar } from 'lucide-react';
import { Project } from '../../types';
import { CommentSection } from '../Comment/CommentSection';

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-slate-800 rounded-2xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">{project.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Image */}
          {project.image_url && (
            <div className="h-64 overflow-hidden bg-slate-900">
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Descripción</h3>
              <p className="text-slate-300 leading-relaxed">{project.description}</p>
            </div>

            {/* Tech Stack */}
            {project.tech_stack && project.tech_stack.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Tecnologías</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-500/10 text-blue-400 text-sm font-medium rounded-full border border-blue-500/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Autor del Proyecto</h3>
              <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {project.user?.full_name?.charAt(0) || 'D'}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">
                    {project.user?.full_name || 'Desarrollador'}
                  </p>
                  <p className="text-slate-400 text-sm">
                    Miembro de la comunidad
                  </p>
                </div>
              </div>
            </div>

            {/* Project Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-slate-300">
                <Calendar className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-400">Fecha de creación</p>
                  <p className="font-medium">{formatDate(project.created_at)}</p>
                </div>
              </div>

              {project.updated_at !== project.created_at && (
                <div className="flex items-center gap-3 text-slate-300">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-400">Última actualización</p>
                    <p className="font-medium">{formatDate(project.updated_at)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Links */}
            <div className="flex flex-col sm:flex-row gap-3">
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  <ExternalLink className="w-5 h-5" />
                  Ver Demo
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
                >
                  <Github className="w-5 h-5" />
                  Ver Código
                </a>
              )}
            </div>

            {/* Sección de comentarios */}
            <div className="border-t border-slate-700 pt-6">
              <CommentSection projectId={project.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

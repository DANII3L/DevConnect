import { ExternalLink, Github, Calendar, Eye, Edit, Trash2 } from 'lucide-react';
import { Project } from '../../types';
import { cn } from '../../utils/cn';
import { useAuth } from '../../contexts/AuthContext';

export interface ProjectCardStyles {
  container?: string;
  image?: string;
  content?: string;
  title?: string;
  description?: string;
  techStack?: string;
  techItem?: string;
  date?: string;
  buttons?: string;
  buttonPrimary?: string;
  buttonSecondary?: string;
  buttonTertiary?: string;
}

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  styles?: ProjectCardStyles;
}

const defaultStyles: ProjectCardStyles = {
  container: 'group bg-gradient-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1',
  image: 'h-52 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 relative',
  content: 'p-6',
  title: 'text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300',
  description: 'text-slate-300 mb-4 line-clamp-3 leading-relaxed',
  techStack: 'flex flex-wrap gap-2 mb-4',
  techItem: 'px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 text-xs font-semibold rounded-lg border border-blue-500/30 backdrop-blur-sm hover:from-blue-500/30 hover:to-cyan-500/30 hover:border-blue-400/50 transition-all duration-300',
  date: 'flex items-center gap-2 text-sm text-slate-400 mb-5',
  buttons: 'flex gap-2 flex-wrap',
  buttonPrimary: 'flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white rounded-lg transition-all duration-300 text-sm font-medium shadow-lg shadow-slate-900/50 hover:shadow-xl hover:shadow-slate-700/50',
  buttonSecondary: 'flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg transition-all duration-300 text-sm font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50',
  buttonTertiary: 'flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white rounded-lg transition-all duration-300 text-sm font-medium shadow-lg shadow-slate-900/50 hover:shadow-xl hover:shadow-slate-700/50',
};

export function ProjectCard({ project, onViewDetails, onEdit, onDelete, styles = {} }: ProjectCardProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isOwner = user?.id === project.user_id;
  const canEdit = isAdmin || isOwner;
  const cardStyles = { ...defaultStyles, ...styles };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(project);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(project);
  };

  return (
    <div className={cn(cardStyles.container)}>
      {/* Imagen del proyecto con overlay */}
      {project.image_url ? (
        <div className={cn(cardStyles.image, 'relative')}>
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Botones de editar/eliminar sobre la imagen (admin o creador) */}
          {canEdit && (onEdit || onDelete) && (
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              {onEdit && (
                <button
                  onClick={handleEdit}
                  className="p-2.5 bg-blue-600/90 hover:bg-blue-500 backdrop-blur-sm rounded-lg transition-all duration-300 text-white hover:scale-110 shadow-lg shadow-blue-500/50"
                  title="Editar proyecto"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="p-2.5 bg-red-600/90 hover:bg-red-500 backdrop-blur-sm rounded-lg transition-all duration-300 text-white hover:scale-110 shadow-lg shadow-red-500/50"
                  title="Eliminar proyecto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className={cn(cardStyles.image, 'relative flex items-center justify-center')}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-cyan-600/20 to-purple-600/20" />
          <div className="relative z-10 text-center p-6">
            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50">
              <Github className="w-8 h-8 text-white" />
            </div>
            <p className="text-slate-400 text-sm font-medium">Sin imagen</p>
          </div>
          {canEdit && (onEdit || onDelete) && (
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              {onEdit && (
                <button
                  onClick={handleEdit}
                  className="p-2.5 bg-blue-600/90 hover:bg-blue-500 backdrop-blur-sm rounded-lg transition-all duration-300 text-white hover:scale-110 shadow-lg shadow-blue-500/50"
                  title="Editar proyecto"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="p-2.5 bg-red-600/90 hover:bg-red-500 backdrop-blur-sm rounded-lg transition-all duration-300 text-white hover:scale-110 shadow-lg shadow-red-500/50"
                  title="Eliminar proyecto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <div className={cn(cardStyles.content)}>
        {/* Header con título */}
        <div className="flex items-start justify-between mb-3">
          <h3 className={cn(cardStyles.title, 'flex-1 pr-4')}>{project.title}</h3>
        </div>

        {/* Descripción */}
        <p className={cn(cardStyles.description)}>{project.description}</p>

        {/* Tech Stack */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className={cn(cardStyles.techStack)}>
            {project.tech_stack.slice(0, 5).map((tech, index) => (
              <span
                key={index}
                className={cn(cardStyles.techItem)}
              >
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 5 && (
              <span className="px-3 py-1.5 bg-slate-700/50 text-slate-400 text-xs font-medium rounded-lg border border-slate-600/50">
                +{project.tech_stack.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Fecha y autor */}
        <div className="flex items-center justify-between mb-5">
          <div className={cn(cardStyles.date)}>
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>{formatDate(project.created_at)}</span>
          </div>
          {project.author && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-1 h-1 rounded-full bg-slate-500" />
              <span className="truncate max-w-[100px]">
                {project.author.username || project.author.full_name || 'Usuario'}
              </span>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className={cn(cardStyles.buttons)}>
          <button
            onClick={() => onViewDetails(project)}
            className={cn(cardStyles.buttonPrimary)}
          >
            <Eye className="w-4 h-4" />
            Ver Detalles
          </button>
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(cardStyles.buttonSecondary)}
            >
              <ExternalLink className="w-4 h-4" />
              Live Demo
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(cardStyles.buttonTertiary)}
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Code2, Plus } from 'lucide-react';
import { Project } from '../../types';
import { ProjectCard } from './ProjectCard';
import { ProjectForm } from './ProjectForm';
import { ProjectModal } from './ProjectModal';
import { PaginatedList } from '../../components/UI/PaginatedList';
import ApiService from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';

interface ProjectListProps {
  showForm?: boolean;
  onCloseForm?: () => void;
}

export function ProjectList({ showForm = false, onCloseForm }: ProjectListProps) {
  const [localShowForm, setLocalShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  // Función de fetch para proyectos
  const fetchProjects = async (params: {
    page: number;
    limit: number;
    search?: string;
  }) => {
    try {
      const response = await ApiService.getAllProjects({
        page: params.page,
        limit: params.limit,
        search: params.search,
      });

      if (response.success) {
        return {
          items: response.projects || [],
          total: response.total || 0,
          success: true,
        };
      } else {
        return {
          items: [],
          total: 0,
          success: false,
          error: response.error || 'Error al cargar proyectos',
        };
      }
    } catch (err) {
      return {
        items: [],
        total: 0,
        success: false,
        error: err instanceof Error ? err.message : 'Error al cargar proyectos',
      };
    }
  };

  const { user, session } = useAuth();
  const isAdmin = user?.role === 'admin';

  const handleRefetch = () => {
    // Forzar refetch incrementando la key
    setRefetchKey(prev => prev + 1);
  };

  const handleNewProject = () => {
    if (onCloseForm) {
      // Si hay un handler de cierre, usar el estado showForm desde HomePage
      // Esto se comunica con HomePage que maneja el estado
      window.dispatchEvent(new CustomEvent("openNewProjectForm"));
    } else {
      // Si no, abrir directamente el formulario con estado local
      setLocalShowForm(true);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setLocalShowForm(true);
  };

  const handleDeleteProject = async (project: Project) => {
    if (!session?.access_token) return;
    
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar el proyecto "${project.title}"? Esta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    try {
      const response = await ApiService.deleteProject(project.id, session.access_token);
      
      if (response.success) {
        handleRefetch();
      } else {
        alert(`Error al eliminar proyecto: ${response.error || 'Error desconocido'}`);
      }
    } catch (error) {
      alert(`Error al eliminar proyecto: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  const handleCloseEditForm = () => {
    setEditingProject(null);
    setLocalShowForm(false);
    onCloseForm?.();
  };

  // Determinar qué formulario mostrar: el prop showForm (de HomePage) o el local
  const shouldShowForm = showForm || localShowForm;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Botón Nuevo Proyecto */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleNewProject}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
        >
          <Plus className="w-4 h-4" />
          Nuevo Proyecto
        </button>
      </div>

      <PaginatedList<Project>
        fetchFunction={fetchProjects}
        renderItem={(project) => {
          // Verificar si el usuario actual es el creador del proyecto
          const isOwner = user?.id === project.user_id;
          const canEdit = isAdmin || isOwner;
          
          return (
            <ProjectCard
              project={project}
              onViewDetails={handleViewDetails}
              onEdit={canEdit ? handleEditProject : undefined}
              onDelete={canEdit ? handleDeleteProject : undefined}
            />
          );
        }}
        emptyState={{
          icon: <Code2 className="w-10 h-10 text-slate-500" />,
          title: 'No projects yet',
          description: 'Be the first to share a project with the community!',
          action: (
            <button
              onClick={() => onCloseForm?.()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg shadow-blue-500/30"
            >
              <Code2 className="w-5 h-5" />
              Share Your First Project
            </button>
          ),
        }}
        searchPlaceholder="Buscar por título o descripción..."
        itemLabel="proyectos"
        refetchKey={refetchKey}
      />

      {shouldShowForm && (
        <ProjectForm
          project={editingProject}
          onClose={handleCloseEditForm}
          onSuccess={handleRefetch}
        />
      )}

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

import { useState } from 'react';
import { Code2 } from 'lucide-react';
import { Project } from '../../types';
import { ProjectCard } from './ProjectCard';
import { ProjectForm } from './ProjectForm';
import { ProjectModal } from './ProjectModal';
import { useProjects } from '../../hooks/useProjects';
import { LoadingSpinner } from '../../UI/LoadingSpinner';

interface ProjectListProps {
  showForm?: boolean;
  onCloseForm?: () => void;
}

export function ProjectList({ showForm = false, onCloseForm }: ProjectListProps) {
  const { projects, loading, refetch } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {loading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : projects.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-800 rounded-full mb-4">
            <Code2 className="w-10 h-10 text-slate-500" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">No projects yet</h2>
          <p className="text-slate-400 mb-6">Be the first to share a project with the community!</p>
          <button
            onClick={() => onCloseForm?.()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg shadow-blue-500/30"
          >
            <Code2 className="w-5 h-5" />
            Share Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {showForm && (
        <ProjectForm
          onClose={() => onCloseForm?.()}
          onSuccess={refetch}
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

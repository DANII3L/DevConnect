import { useState, useEffect } from 'react';
import ApiService from '../services/apiService';
import { cacheService } from '../services/cacheService';
import { Project } from '../types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchProjects = async (params?: {
    limit?: number;
    offset?: number;
    search?: string;
  }) => {
    const cacheKey = `projects-${JSON.stringify(params || {})}`;
    
    // Verificar cache primero
    const cachedData = cacheService.get<{projects: Project[], total: number}>(cacheKey);
    if (cachedData) {
      setProjects(cachedData.projects);
      setTotal(cachedData.total);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiService.getAllProjects(params);

      if (response.success) {
        const projectsData = response.projects || [];
        setProjects(projectsData);
        setTotal(response.total || 0);
        
        // Guardar en cache
        cacheService.set(cacheKey, {
          projects: projectsData,
          total: response.total || 0
        });
      } else {
        throw new Error(response.error || 'Error al cargar proyectos');
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar proyectos');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: {
    title: string;
    description: string;
    demo_url?: string;
    github_url?: string;
    tech_stack: string[];
    image_url?: string;
  }, token: string) => {
    try {
      const response = await ApiService.createProject(projectData, token);
      
      if (response.success) {
        // Limpiar cache y recargar
        cacheService.clear();
        await fetchProjects();
        return response.project;
      } else {
        throw new Error(response.error || 'Error al crear proyecto');
      }
    } catch (err) {
      console.error('Error creating project:', err);
      throw err;
    }
  };

  const updateProject = async (id: string, projectData: {
    title?: string;
    description?: string;
    demo_url?: string;
    github_url?: string;
    tech_stack?: string[];
    image_url?: string;
  }, token: string) => {
    try {
      const response = await ApiService.updateProject(id, projectData, token);
      
      if (response.success) {
        // Limpiar cache y actualizar localmente
        cacheService.clear();
        setProjects(prevProjects => 
          prevProjects.map(project => 
            project.id === id ? response.project : project
          )
        );
        return response.project;
      } else {
        throw new Error(response.error || 'Error al actualizar proyecto');
      }
    } catch (err) {
      console.error('Error updating project:', err);
      throw err;
    }
  };

  const deleteProject = async (id: string, token: string) => {
    try {
      const response = await ApiService.deleteProject(id, token);
      
      if (response.success) {
        // Limpiar cache y actualizar localmente
        cacheService.clear();
        setProjects(prevProjects => 
          prevProjects.filter(project => project.id !== id)
        );
        setTotal(prevTotal => prevTotal - 1);
      } else {
        throw new Error(response.error || 'Error al eliminar proyecto');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    total,
    refetch: fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
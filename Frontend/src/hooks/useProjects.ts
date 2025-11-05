import { useState, useEffect } from 'react';
import ApiService from '../services/apiService';
import { cacheService } from '../services/cacheService';
import { Project } from '../types';
import { PAGINATION } from '../utils/constants';

export interface UseProjectsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  total: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  fetchProjects: (params?: UseProjectsParams) => Promise<void>;
  createProject: (projectData: any, token: string) => Promise<any>;
  updateProject: (id: string, projectData: any, token: string) => Promise<any>;
  deleteProject: (id: string, token: string) => Promise<void>;
}

export function useProjects(initialParams?: UseProjectsParams): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null>(null);
  const [currentParams, setCurrentParams] = useState<UseProjectsParams>(
    initialParams || { page: 1, limit: PAGINATION.DEFAULT_LIMIT }
  );

  const fetchProjects = async (params?: UseProjectsParams) => {
    const queryParams = { ...currentParams, ...params };
    const cacheKey = `projects-${JSON.stringify(queryParams)}`;
    
    // No usar cache para búsquedas o paginación
    const useCache = !queryParams.search && queryParams.page === 1;
    
    if (useCache) {
      const cachedData = cacheService.get<{projects: Project[], total: number}>(cacheKey);
      if (cachedData) {
        setProjects(cachedData.projects);
        setTotal(cachedData.total);
        setLoading(false);
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiService.getAllProjects({
        page: queryParams.page || 1,
        limit: queryParams.limit || PAGINATION.DEFAULT_LIMIT,
        search: queryParams.search,
      });

      if (response.success) {
        const projectsData = response.projects || [];
        setProjects(projectsData);
        setTotal(response.total || 0);
        
        // Actualizar información de paginación
        if (response.pagination) {
          setPagination({
            page: response.pagination.page || queryParams.page || 1,
            limit: response.pagination.limit || queryParams.limit || PAGINATION.DEFAULT_LIMIT,
            totalPages: response.pagination.totalPages || Math.ceil((response.total || 0) / (queryParams.limit || PAGINATION.DEFAULT_LIMIT)),
            hasNext: response.pagination.hasNext || false,
            hasPrev: response.pagination.hasPrev || false,
          });
        }
        
        setCurrentParams(queryParams);
        
        // Solo cachear primera página sin búsqueda
        if (useCache) {
          cacheService.set(cacheKey, {
            projects: projectsData,
            total: response.total || 0
          });
        }
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
    fetchProjects(initialParams);
  }, []);

  return {
    projects,
    loading,
    error,
    total,
    pagination,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
import ApiService from './apiService';

export interface CreateProjectData {
  title: string;
  description: string;
  demo_url?: string;
  github_url?: string;
  tech_stack: string[];
  image_url?: string;
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  id: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  demo_url?: string;
  github_url?: string;
  tech_stack: string[];
  image_url?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

export class ProjectService {
  static async getAll(params?: {
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<Project[]> {
    const response = await ApiService.getAllProjects(params);
    
    if (response.success) {
      return response.projects || [];
    } else {
      throw new Error(response.error || 'Error fetching projects');
    }
  }

  static async getById(id: string): Promise<Project | null> {
    const response = await ApiService.getProjectById(id);
    
    if (response.success) {
      return response.project;
    } else {
      throw new Error(response.error || 'Error fetching project');
    }
  }

  static async create(projectData: CreateProjectData, token: string): Promise<Project> {
    const response = await ApiService.createProject(projectData, token);
    
    if (response.success) {
      return response.project;
    } else {
      throw new Error(response.error || 'Error creating project');
    }
  }

  static async update(projectData: UpdateProjectData, token: string): Promise<Project> {
    const { id, ...updateData } = projectData;
    
    const response = await ApiService.updateProject(id, updateData, token);
    
    if (response.success) {
      return response.project;
    } else {
      throw new Error(response.error || 'Error updating project');
    }
  }

  static async delete(id: string, token: string): Promise<void> {
    const response = await ApiService.deleteProject(id, token);
    
    if (!response.success) {
      throw new Error(response.error || 'Error deleting project');
    }
  }

  static async getByUser(userId: string): Promise<Project[]> {
    const response = await ApiService.getUserProjects(userId);
    
    if (response.success) {
      return response.projects || [];
    } else {
      throw new Error(response.error || 'Error fetching user projects');
    }
  }
}
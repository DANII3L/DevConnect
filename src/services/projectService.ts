import { supabase, Project } from '../lib/supabase';

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

export class ProjectService {
  static async getAll(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching projects: ${error.message}`);
    }

    return data || [];
  }

  static async getById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Error fetching project: ${error.message}`);
    }

    return data;
  }

  static async create(projectData: CreateProjectData): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating project: ${error.message}`);
    }

    return data;
  }

  static async update(projectData: UpdateProjectData): Promise<Project> {
    const { id, ...updateData } = projectData;
    
    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating project: ${error.message}`);
    }

    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting project: ${error.message}`);
    }
  }
}

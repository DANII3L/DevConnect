import ApiService from './apiService';

export interface UserProfile {
  id: string;
  full_name: string;
  username?: string;
  email?: string;
  avatar_url?: string;
  website?: string;
  bio?: string;
  github_url?: string;
  linkedin_url?: string;
  created_at?: string;
  updated_at?: string;
}

export class UserService {
  static async getProfile(userId: string): Promise<UserProfile | null> {
    const response = await ApiService.getUserById(userId);
    
    if (response.success && response.user) {
      return response.user;
    } else {
      if (response.error?.includes('no encontrado')) {
        return null; // Profile not found
      }
      throw new Error(response.error || 'Error fetching user profile');
    }
  }

  static async updateProfile(userId: string, profileData: Partial<UserProfile>, token: string): Promise<UserProfile> {
    // Nota: Este endpoint podría necesitar ser implementado en el backend
    // Por ahora, simulamos la actualización
    const response = await ApiService.getUserById(userId);
    
    if (response.success && response.user) {
      // Simular actualización combinando datos existentes con nuevos
      return { ...response.user, ...profileData };
    } else {
      throw new Error(response.error || 'Error updating user profile');
    }
  }

  static async createProfile(userId: string, profileData: Omit<UserProfile, 'id'>): Promise<UserProfile> {
    // Nota: Este endpoint podría necesitar ser implementado en el backend
    // Por ahora, simulamos la creación
    const newProfile: UserProfile = {
      id: userId,
      ...profileData,
      created_at: new Date().toISOString(),
    };
    
    return newProfile;
  }

  static async getAllUsers(params?: {
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<UserProfile[]> {
    const response = await ApiService.getAllUsers(params);
    
    if (response.success) {
      return response.users || [];
    } else {
      throw new Error(response.error || 'Error fetching users');
    }
  }

  static async searchUsers(query: string): Promise<UserProfile[]> {
    const response = await ApiService.searchUsers(query);
    
    if (response.success) {
      return response.users || [];
    } else {
      throw new Error(response.error || 'Error searching users');
    }
  }

  static async getUserStats(): Promise<any> {
    const response = await ApiService.getUserStats();
    
    if (response.success) {
      return response.stats;
    } else {
      throw new Error(response.error || 'Error fetching user stats');
    }
  }
}
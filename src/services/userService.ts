import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
}

export class UserService {
  static async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Profile not found
      }
      throw new Error(`Error fetching user profile: ${error.message}`);
    }

    return data;
  }

  static async updateProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating user profile: ${error.message}`);
    }

    return data;
  }

  static async createProfile(userId: string, profileData: Omit<UserProfile, 'id'>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('profiles')
      .insert([{ id: userId, ...profileData }])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating user profile: ${error.message}`);
    }

    return data;
  }
}

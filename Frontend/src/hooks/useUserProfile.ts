import { useState } from 'react';
import ApiService from '../services/apiService';

interface UserProfile {
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

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiService.getUserById(userId);

      if (response.success && response.user) {
        setUserProfile(response.user);
      } else {
        throw new Error(response.error || 'Error al cargar perfil');
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar perfil');
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>, token: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Nota: Este endpoint podría necesitar ser implementado en el backend
      // Por ahora, simulamos la actualización
      const response = await ApiService.getUserById(userId);
      
      if (response.success) {
        // Actualizar el perfil local
        setUserProfile(prev => prev ? { ...prev, ...profileData } : null);
        return response.user;
      } else {
        throw new Error(response.error || 'Error al actualizar perfil');
      }
    } catch (err) {
      console.error('Error updating user profile:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearProfile = () => {
    setUserProfile(null);
    setError(null);
  };

  return {
    userProfile,
    loading,
    error,
    fetchUserProfile,
    updateUserProfile,
    clearProfile,
  };
}
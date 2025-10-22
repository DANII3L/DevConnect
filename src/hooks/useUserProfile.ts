import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
}

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      setUserProfile(data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar perfil');
      setUserProfile(null);
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
    clearProfile,
  };
}

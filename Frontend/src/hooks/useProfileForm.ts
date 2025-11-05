import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import ApiService from "../services/apiService";
import { User } from "../types";

export interface UseProfileFormOptions {
  userId?: string; // Para admin, permite editar otros usuarios
  onSuccess?: () => void;
}

export interface UseProfileFormReturn {
  // Estados del perfil
  profileData: User | null;
  loading: boolean;
  error: string;
  
  // Estados del formulario
  fullName: string;
  setFullName: (value: string) => void;
  username: string;
  setUsername: (value: string) => void;
  bio: string;
  setBio: (value: string) => void;
  avatarUrl: string;
  setAvatarUrl: (value: string) => void;
  website: string;
  setWebsite: (value: string) => void;
  githubUrl: string;
  setGithubUrl: (value: string) => void;
  linkedinUrl: string;
  setLinkedinUrl: (value: string) => void;
  
  // Estados de edición
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  saving: boolean;
  message: string;
  
  // Funciones
  handleEdit: () => void;
  handleCancel: () => void;
  handleSave: (e: React.FormEvent) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export function useProfileForm(options: UseProfileFormOptions = {}): UseProfileFormReturn {
  const { user, session } = useAuth();
  const { userId, onSuccess } = options;
  
  const [profileData, setProfileData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  
  // Estados del formulario
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [website, setWebsite] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Cargar perfil
  const fetchProfile = async () => {
    if (!session?.access_token) return;

    setLoading(true);
    setError("");
    try {
      let response;
      
      if (userId && userId !== user?.id) {
        // Si hay userId y es diferente al usuario actual, usar getUserById (admin)
        response = await ApiService.getUserById(userId, session.access_token);
      } else {
        // Si no, usar getProfile (perfil propio)
        response = await ApiService.getProfile(session.access_token);
      }

      if (response.success && response.data) {
        const data = response.data;
        setProfileData(data);
        // Inicializar los campos del formulario
        setFullName(data.full_name || "");
        setUsername(data.username || "");
        setBio(data.bio || "");
        setAvatarUrl(data.avatar_url || "");
        setWebsite(data.website || "");
        setGithubUrl(data.github_url || "");
        setLinkedinUrl(data.linkedin_url || "");
      } else {
        setError("No se pudo cargar el perfil");
      }
    } catch (err) {
      console.error("Error al cargar perfil:", err);
      setError("Error al cargar la información");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [session, userId]);

  const handleEdit = () => {
    setIsEditing(true);
    setMessage("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage("");
    // Restaurar valores originales
    if (profileData) {
      setFullName(profileData.full_name || "");
      setUsername(profileData.username || "");
      setBio(profileData.bio || "");
      setAvatarUrl(profileData.avatar_url || "");
      setWebsite(profileData.website || "");
      setGithubUrl(profileData.github_url || "");
      setLinkedinUrl(profileData.linkedin_url || "");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.access_token) return;

    setSaving(true);
    setMessage("");

    try {
      let response;
      
      if (userId && userId !== user?.id) {
        // Si hay userId y es diferente, usar updateUserProfile (admin)
        // Nota: updateUserProfile no acepta github_url ni linkedin_url
        response = await ApiService.updateUserProfile(userId, {
          full_name: fullName,
          username,
          bio,
          avatar_url: avatarUrl,
          website,
          github_url: githubUrl,
          linkedin_url: linkedinUrl,
        }, session.access_token);
      } else {
        // Si no, usar updateProfile (perfil propio)
        response = await ApiService.updateProfile(session.access_token, {
          full_name: fullName,
          username,
          bio,
          avatar_url: avatarUrl,
          website,
          github_url: githubUrl,
          linkedin_url: linkedinUrl,
        });
      }

      if (response && (response.success || response.id || response.data)) {
        setMessage("Perfil actualizado correctamente");
        
        // Actualizar profileData con la respuesta
        if (response.data) {
          const updatedData = {
            ...profileData!,
            ...response.data,
          };
          setProfileData(updatedData);
        }

        setIsEditing(false);
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => setMessage(""), 3000);
        
        // Ejecutar callback de éxito si existe
        if (onSuccess) {
          setTimeout(() => onSuccess(), 1500);
        }
      } else {
        setMessage("Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      setMessage("Error al actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  return {
    profileData,
    loading,
    error,
    fullName,
    setFullName,
    username,
    setUsername,
    bio,
    setBio,
    avatarUrl,
    setAvatarUrl,
    website,
    setWebsite,
    githubUrl,
    setGithubUrl,
    linkedinUrl,
    setLinkedinUrl,
    isEditing,
    setIsEditing,
    saving,
    message,
    handleEdit,
    handleCancel,
    handleSave,
    refreshProfile,
  };
}


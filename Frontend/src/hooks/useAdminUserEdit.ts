import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import ApiService from "../services/apiService";
import { User } from "../types";

export interface UseAdminUserEditOptions {
  userId: string;
}

export interface UseAdminUserEditReturn {
  userData: User | null;
  loading: boolean;
  saving: boolean;
  message: string;
  
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
  role: "user" | "admin";
  setRole: (value: "user" | "admin") => void;
  
  // Funciones
  handleUpdate: (e: React.FormEvent) => Promise<boolean>;
  handleDelete: () => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

export function useAdminUserEdit(options: UseAdminUserEditOptions): UseAdminUserEditReturn {
  const { userId } = options;
  const { session } = useAuth();
  
  const [userData, setUserData] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [website, setWebsite] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchUser = async () => {
    if (!session?.access_token || !userId) return;

    setLoading(true);
    try {
      const response = await ApiService.getUserById(
        userId,
        session.access_token
      );

      if (response.success && response.data) {
        const data = response.data;
        setUserData(data);
        setFullName(data.full_name || "");
        setUsername(data.username || "");
        setBio(data.bio || "");
        setAvatarUrl(data.avatar_url || "");
        setWebsite(data.website || "");
        setGithubUrl(data.github_url || "");
        setLinkedinUrl(data.linkedin_url || "");
        setRole(data.role || "user");
      } else {
        setMessage("No se pudo cargar el usuario");
      }
    } catch (error) {
      console.error("Error al cargar usuario:", error);
      setMessage("Error al cargar el usuario");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [session, userId]);

  const handleUpdate = async (e: React.FormEvent): Promise<boolean> => {
    e.preventDefault();
    if (!session?.access_token || !userId) return false;

    setSaving(true);
    setMessage("");

    try {
      const response = await ApiService.updateUserProfile(
        userId,
        {
          full_name: fullName,
          username,
          bio,
          avatar_url: avatarUrl,
          website,
          github_url: githubUrl,
          linkedin_url: linkedinUrl,
          role,
        },
        session.access_token
      );

      if (response && (response.success || response.id || response.data)) {
        setMessage("Usuario actualizado correctamente");

        // Actualizar userData con la respuesta
        if (response.data) {
          const updatedData = {
            ...userData!,
            ...response.data,
          };
          setUserData(updatedData);
        }

        // Limpiar mensaje después de 3 segundos
        setTimeout(() => setMessage(""), 3000);
        
        return true; // Indicar éxito
      } else {
        setMessage("Error al actualizar el usuario");
        return false;
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      setMessage("Error al actualizar el usuario");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (): Promise<boolean> => {
    if (!session?.access_token || !userId) return false;
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) return false;

    setSaving(true);
    setMessage("");

    try {
      const response = await ApiService.deleteUser(userId, session.access_token);

      if (response && response.success) {
        setMessage("Usuario eliminado correctamente");
        return true; // Indicar éxito
      } else {
        setMessage("Error al eliminar el usuario");
        return false;
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      setMessage("Error al eliminar el usuario");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  return {
    userData,
    loading,
    saving,
    message,
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
    role,
    setRole,
    handleUpdate,
    handleDelete,
    refreshUser,
  };
}


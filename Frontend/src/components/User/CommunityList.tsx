import { useState } from 'react';
import { Users } from 'lucide-react';
import { User } from '../../types';
import { UserCard } from './UserCard';
import { UserModal } from './UserModal';
import { PaginatedList } from '../UI/PaginatedList';
import ApiService from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';

export function CommunityList() {
  const { user, session } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función de fetch para usuarios/perfiles
  const fetchUsers = async (params: {
    page: number;
    limit: number;
    search?: string;
  }) => {
    try {
      // Si es admin, usar getAllUsers (incluye más información)
      if (user?.role === "admin" && session?.access_token) {
        const offset = (params.page - 1) * params.limit;
        const usersResponse = await ApiService.getAllUsers(session.access_token, {
          limit: params.limit,
          offset,
          search: params.search,
        });

        if (usersResponse.success) {
          return {
            items: usersResponse.data || [],
            total: usersResponse.total || 0,
            success: true,
          };
        } else {
          return {
            items: [],
            total: 0,
            success: false,
            error: usersResponse.error || 'Error al cargar usuarios',
          };
        }
      } else {
        // Si es usuario normal, usar getAllProfiles (público)
        const offset = (params.page - 1) * params.limit;
        const profilesResponse = await ApiService.getAllProfiles({
          limit: params.limit,
          offset,
          search: params.search,
        });

        if (profilesResponse.success) {
          // Transformar perfiles a formato User
          const users = (profilesResponse.data || []).map((profile: any) => ({
            id: profile.id,
            full_name: profile.full_name,
            username: profile.username,
            avatar_url: profile.avatar_url,
            bio: profile.bio,
            website: profile.website,
            github_url: profile.github_url,
            linkedin_url: profile.linkedin_url,
            role: profile.role || 'user', // Asegurar que el rol se mapee correctamente
            email: '', // Los perfiles públicos no incluyen email
            created_at: profile.created_at,
            updated_at: profile.updated_at,
          }));

          return {
            items: users,
            total: profilesResponse.total || 0,
            success: true,
          };
        } else {
          return {
            items: [],
            total: 0,
            success: false,
            error: profilesResponse.error || 'Error al cargar perfiles',
          };
        }
      }
    } catch (err) {
      return {
        items: [],
        total: 0,
        success: false,
        error: err instanceof Error ? err.message : 'Error al cargar usuarios',
      };
    }
  };

  const handleViewDetails = (userItem: User) => {
    setSelectedUser(userItem);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <PaginatedList<User>
        fetchFunction={fetchUsers}
        renderItem={(userItem) => (
          <UserCard 
            user={userItem} 
            onViewDetails={handleViewDetails}
          />
        )}
        emptyState={{
          icon: <Users className="w-10 h-10 text-slate-500" />,
          title: "No hay usuarios registrados",
          description: "Aún no hay usuarios en la plataforma.",
        }}
        searchPlaceholder="Buscar por correo o username..."
        itemLabel="usuarios"
        gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      />

      {selectedUser && (
        <UserModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}


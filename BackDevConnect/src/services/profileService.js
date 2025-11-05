const { supabase, createAuthenticatedClient } = require('../lib/supabase');

class ProfileService {
    static async getAllProfiles(params = {}) {
        try {
            let query = supabase
                .from('profiles')
                .select(`
                    id,
                    full_name,
                    username,
                    avatar_url,
                    website,
                    bio,
                    linkedin_url,
                    github_url,
                    role,
                    created_at,
                    updated_at
                `, { count: 'exact' });

            // Búsqueda
            if (params.search) {
                query = query.or(`full_name.ilike.%${params.search}%,username.ilike.%${params.search}%`);
            }

            // Ordenar
            query = query.order('created_at', { ascending: false });

            // Paginación
            if (params.limit) {
                query = query.limit(params.limit);
            }
            if (params.offset !== undefined) {
                query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
            }

            const { data, error, count } = await query;

            if (error) throw error;

            return {
                success: true,
                data: data || [],
                total: count || 0
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    static async getProfileById(profileId) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select(`
                    id,
                    full_name,
                    username,
                    avatar_url,
                    website,
                    bio,
                    github_url,
                    linkedin_url,
                    role,
                    created_at,
                    updated_at
                `)
                .eq('id', profileId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return {
                        success: false,
                        error: 'Perfil no encontrado'
                    };
                }
                throw error;
            }

            return {
                success: true,
                data: data
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    static async searchProfiles(query) {
        try {
            const { data, error, count } = await supabase
                .from('profiles')
                .select(`
                    id,
                    full_name,
                    username,
                    avatar_url,
                    website,
                    bio,
                    github_url,
                    linkedin_url,
                    role,
                    created_at,
                    updated_at
                `, { count: 'exact' })
                .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return {
                success: true,
                data: data || [],
                total: count || 0
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    static async getProfileStats() {
        try {
            // Obtener total de perfiles
            const { count: totalProfiles, error: totalError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            if (totalError) throw totalError;

            // Obtener perfiles activos (con actividad reciente)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const { count: activeProfiles, error: activeError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .gte('updated_at', thirtyDaysAgo.toISOString());

            if (activeError) throw activeError;

            // Obtener nuevos perfiles este mes
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            const { count: newProfilesThisMonth, error: newError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', startOfMonth.toISOString());

            if (newError) throw newError;

            return {
                success: true,
                data: {
                    total_profiles: totalProfiles || 0,
                    active_profiles: activeProfiles || 0,
                    new_profiles_this_month: newProfilesThisMonth || 0
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    static async updateProfile(userId, profileData, userToken) {
        try {
            // Verificar que userId es válido
            if (!userId || typeof userId !== 'string') {
                return {
                    success: false,
                    error: 'ID de usuario inválido'
                };
            }

            // Usar cliente autenticado para pasar las políticas RLS
            const supabaseClient = userToken ? createAuthenticatedClient(userToken) : supabase;

            // Preparar el objeto de actualización, solo incluyendo campos que no sean undefined
            const updateData = {
                updated_at: new Date().toISOString()
            };

            if (profileData.full_name !== undefined) updateData.full_name = profileData.full_name;
            if (profileData.username !== undefined) updateData.username = profileData.username;
            if (profileData.bio !== undefined) updateData.bio = profileData.bio;
            if (profileData.avatar_url !== undefined) updateData.avatar_url = profileData.avatar_url;
            if (profileData.website !== undefined) updateData.website = profileData.website;
            if (profileData.github_url !== undefined) updateData.github_url = profileData.github_url;
            if (profileData.linkedin_url !== undefined) updateData.linkedin_url = profileData.linkedin_url;

            const { data, error } = await supabaseClient
                .from('profiles')
                .update(updateData)
                .eq('id', userId)
                .select('id, full_name, username, avatar_url, website, bio, github_url, linkedin_url, role, created_at, updated_at');

            if (error) {
                throw error;
            }

            if (!data || data.length === 0) {
                return {
                    success: false,
                    error: 'Perfil no encontrado o no se pudo actualizar'
                };
            }
            const updatedProfile = data.length === 1 ? data[0] : data[0];

            return {
                success: true,
                data: updatedProfile
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Error al actualizar perfil'
            };
        }
    }
}

module.exports = ProfileService;

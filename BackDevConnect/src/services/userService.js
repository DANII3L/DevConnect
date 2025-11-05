const { supabase } = require('../lib/supabase');

class UserService {
    static async getAllUsers(params = {}) {
        try {
            let query = supabase
                .from('profiles')
                .select('id, full_name, username, avatar_url, bio, website, github_url, linkedin_url, role, created_at, updated_at', { count: 'exact' });

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
            if (params.offset) {
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
            console.error('Error al obtener usuarios:', error);
            return {
                success: false,
                error: error.message || 'Error al obtener usuarios'
            };
        }
    }

    static async getUserById(id) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name, username, avatar_url, bio, website, github_url, linkedin_url, role, created_at, updated_at')
                .eq('id', id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return {
                        success: false,
                        error: 'Usuario no encontrado'
                    };
                }
                throw error;
            }

            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            return {
                success: false,
                error: error.message || 'Error al obtener usuario'
            };
        }
    }

    static async updateUser(userId, userData, adminToken) {
        try {
            const { createClient } = require('@supabase/supabase-js');
            
            // Crear cliente con el token del admin para bypassear RLS
            const supabaseAdmin = createClient(
                process.env.SUPABASE_URL || 'https://zqacwsvziholbkypzwap.supabase.co',
                process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxYWN3c3Z6aWhvbGJreXB6d2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNDA1NDcsImV4cCI6MjA3NjcxNjU0N30.1tYjvfg0aiZlFQXbGt-RyzHQVtzuySW7i5sscCeontU',
                {
                    global: {
                        headers: {
                            Authorization: `Bearer ${adminToken}`
                        }
                    }
                }
            );

            const updateData = {
                updated_at: new Date().toISOString()
            };

            // Solo actualizar campos que vienen en el body
            if (userData.full_name !== undefined) updateData.full_name = userData.full_name;
            if (userData.username !== undefined) updateData.username = userData.username;
            if (userData.bio !== undefined) updateData.bio = userData.bio;
            if (userData.avatar_url !== undefined) updateData.avatar_url = userData.avatar_url;
            if (userData.website !== undefined) updateData.website = userData.website;
            if (userData.github_url !== undefined) updateData.github_url = userData.github_url;
            if (userData.linkedin_url !== undefined) updateData.linkedin_url = userData.linkedin_url;
            if (userData.role !== undefined) updateData.role = userData.role;

            const { data, error } = await supabaseAdmin
                .from('profiles')
                .update(updateData)
                .eq('id', userId)
                .select('id, full_name, username, avatar_url, bio, website, github_url, linkedin_url, role, created_at, updated_at, github_url, linkedin_url')
                .single();

            if (error) throw error;

            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            return {
                success: false,
                error: error.message || 'Error al actualizar usuario'
            };
        }
    }

    static async updateUserRole(userId, role) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update({
                    role,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)
                .select('id, full_name, username, role')
                .single();

            if (error) throw error;

            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Error al actualizar rol:', error);
            return {
                success: false,
                error: error.message || 'Error al actualizar rol'
            };
        }
    }

    static async deleteUser(userId) {
        try {
            // Primero eliminar el perfil
            const { error: profileError } = await supabase
                .from('profiles')
                .delete()
                .eq('id', userId);

            if (profileError) throw profileError;

            return {
                success: true
            };
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            return {
                success: false,
                error: error.message || 'Error al eliminar usuario'
            };
        }
    }
}

module.exports = UserService;
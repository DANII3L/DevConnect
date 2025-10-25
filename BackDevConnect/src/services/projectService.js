const { supabase } = require('../lib/supabase');
const { mockProjects } = require('./mockData');
const { createAuthenticatedClient } = require('../lib/supabase');

class ProjectService {
    static async getAllProjects(page = 1, limit = 10, search = '') {
        try {
            // Validaciones de entrada
            if (page < 1 || limit < 1 || limit > 100) {
                throw new Error('Parámetros de paginación inválidos');
            }
            
            const offset = (page - 1) * limit;
            
            // Query base
            let query = supabase
                .from('projects')
                .select(`
                    id,
                    title,
                    description,
                    demo_url,
                    github_url,
                    tech_stack,
                    image_url,
                    created_at,
                    updated_at,
                    user_id,
                    profiles!projects_user_id_fkey(
                        username,
                        avatar_url,
                        full_name
                    )
                `, { count: 'exact' });
            
            // Aplicar filtro de búsqueda si existe
            if (search && search.trim()) {
                query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,tech_stack.ilike.%${search}%`);
            }
            
            // Aplicar paginación y ordenamiento
            const { data, error, count } = await query
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);

            if (error) throw error;

            // Procesar datos para incluir información del autor
            const processedData = (data || []).map(project => {
                const { profiles, ...projectData } = project;
                return {
                    ...projectData,
                    author: {
                        id: project.user_id,
                        username: profiles?.username || 'Usuario',
                        avatar_url: profiles?.avatar_url || null,
                        full_name: profiles?.full_name || null
                    }
                };
            });

            return {
                success: true,
                data: processedData,
                total: count || 0,
                page,
                limit,
                hasMore: (offset + limit) < (count || 0)
            };
        } catch (error) {
            console.warn('⚠️  Supabase connection failed, using mock data');
            return {
                success: true,
                data: mockProjects,
                total: mockProjects.length,
                mock: true
            };
        }
    }

    static async getProjectById(projectId) {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select(`
                    id,
                    title,
                    description,
                    demo_url,
                    github_url,
                    tech_stack,
                    image_url,
                    created_at,
                    updated_at,
                    user_id,
                    profiles!projects_user_id_fkey(
                        username,
                        avatar_url,
                        full_name
                    )
                `)
                .eq('id', projectId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return {
                        success: false,
                        error: 'Proyecto no encontrado'
                    };
                }
                throw error;
            }

            // Procesar datos para incluir información del autor
            const { profiles, ...projectData } = data;
            const processedData = {
                ...projectData,
                author: {
                    id: data.user_id,
                    username: profiles?.username || 'Usuario',
                    avatar_url: profiles?.avatar_url || null,
                    full_name: profiles?.full_name || null
                }
            };

            return {
                success: true,
                data: processedData
            };
        } catch (error) {
            console.error('ProjectService.getProjectById error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    static async createProject(projectData, userToken) {
        try {
            // Crear cliente autenticado
            const supabaseClient = createAuthenticatedClient(userToken);
            
            const { data, error } = await supabaseClient
                .from('projects')
                .insert([projectData])
                .select(`
                    id,
                    title,
                    description,
                    demo_url,
                    github_url,
                    tech_stack,
                    image_url,
                    created_at,
                    updated_at
                `)
                .single();

            if (error) throw error;

            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('ProjectService.createProject error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    static async updateProject(projectId, updateData, userToken) {
        try {
            // Crear cliente autenticado
            const supabaseClient = createAuthenticatedClient(userToken);
            
            const { data, error } = await supabaseClient
                .from('projects')
                .update(updateData)
                .eq('id', projectId)
                .select(`
                    id,
                    title,
                    description,
                    demo_url,
                    github_url,
                    tech_stack,
                    image_url,
                    created_at,
                    updated_at
                `)
                .single();

            if (error) throw error;

            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('ProjectService.updateProject error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    static async deleteProject(projectId, userToken) {
        try {
            // Crear cliente autenticado
            const supabaseClient = createAuthenticatedClient(userToken);
            
            const { error } = await supabaseClient
                .from('projects')
                .delete()
                .eq('id', projectId);

            if (error) throw error;

            return {
                success: true,
                message: 'Proyecto eliminado correctamente'
            };
        } catch (error) {
            console.error('ProjectService.deleteProject error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Obtener proyectos por usuario
    static async getProjectsByUser(userId) {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select(`
                    id,
                    title,
                    description,
                    demo_url,
                    github_url,
                    tech_stack,
                    image_url,
                    created_at,
                    updated_at
                `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            return {
                success: true,
                data: data,
                total: data.length
            };
        } catch (error) {
            console.error('Error al obtener proyectos del usuario:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Buscar proyectos
    static async searchProjects(query, limit = 10, offset = 0) {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select(`
                    id,
                    title,
                    description,
                    demo_url,
                    github_url,
                    tech_stack,
                    image_url,
                    created_at,
                    updated_at,
                    user_id
                `)
                .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);

            if (error) {
                throw error;
            }

            return {
                success: true,
                data: data,
                total: data.length
            };
        } catch (error) {
            console.error('Error buscando proyectos:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Obtener proyectos con paginación
    static async getProjectsPaginated(limit = 10, offset = 0, search = null) {
        try {
            // Query para obtener proyectos
            let query = supabase
                .from('projects')
                .select(`
                    id,
                    title,
                    description,
                    demo_url,
                    github_url,
                    tech_stack,
                    image_url,
                    created_at,
                    updated_at,
                    user_id
                `, { count: 'exact' })
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);

            // Aplicar filtro de búsqueda si existe
            if (search) {
                query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
            }

            const { data: projects, error, count } = await query;

            if (error) {
                throw error;
            }

            if (!projects || projects.length === 0) {
                return {
                    success: true,
                    data: [],
                    total: 0,
                    pagination: {
                        limit,
                        offset,
                        hasMore: false
                    }
                };
            }

            // Obtener información de los usuarios
            const userIds = projects.map(p => p.user_id);
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('id, username, avatar_url, full_name')
                .in('id', userIds);

            if (profilesError) {
                throw profilesError;
            }

            // Crear un mapa de perfiles por ID
            const profilesMap = {};
            (profiles || []).forEach(profile => {
                profilesMap[profile.id] = profile;
            });

            // Procesar datos para incluir información del autor
            const processedData = projects.map(project => {
                const profile = profilesMap[project.user_id];
                return {
                    ...project,
                    author: {
                        id: project.user_id,
                        username: profile?.username || 'Usuario',
                        avatar_url: profile?.avatar_url || null,
                        full_name: profile?.full_name || null
                    }
                };
            });

            return {
                success: true,
                data: processedData,
                total: count || 0,
                pagination: {
                    limit,
                    offset,
                    hasMore: (offset + limit) < (count || 0)
                }
            };
        } catch (error) {
            console.error('Error obteniendo proyectos paginados:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Verificar si un usuario es propietario de un proyecto
    static async checkProjectOwnership(projectId, userId) {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('user_id')
                .eq('id', projectId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return {
                        success: false,
                        error: 'Proyecto no encontrado'
                    };
                }
                throw error;
            }

            const isOwner = data.user_id === userId;
            return {
                success: true,
                isOwner: isOwner,
                ownerId: data.user_id
            };
        } catch (error) {
            console.error('Error verificando propiedad del proyecto:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Obtener proyectos de un usuario específico
    static async getUserProjects(userId, limit = 10, offset = 0) {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select(`
                    id,
                    title,
                    description,
                    demo_url,
                    github_url,
                    tech_stack,
                    image_url,
                    created_at,
                    updated_at,
                    user_id
                `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);

            if (error) throw error;

            // Obtener el total de proyectos del usuario
            const { count, error: countError } = await supabase
                .from('projects')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId);

            if (countError) throw countError;

            return {
                success: true,
                data: data,
                total: count || 0,
                pagination: {
                    limit,
                    offset,
                    hasMore: data.length === limit
                }
            };
        } catch (error) {
            console.error('Error obteniendo proyectos del usuario:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = ProjectService;

const { supabase, createAuthenticatedClient } = require('../lib/supabase');

class CommentService {
    // Función utilitaria para generar nombre de usuario inteligente
    static generateUsername(profiles) {
        if (profiles?.username) return profiles.username;
        if (profiles?.full_name && !profiles.full_name.includes('@')) {
            return profiles.full_name.split(' ')[0];
        }
        return 'Usuario';
    }
    // Obtener comentarios con paginación y optimizaciones
    static async getProjectComments(projectId, page = 1, limit = 10, sort = 'newest') {
        try {
            // Validaciones de entrada
            if (!projectId || typeof projectId !== 'string') {
                throw new Error('Project ID es requerido y debe ser un string válido');
            }
            
            if (page < 1 || limit < 1 || limit > 100) {
                throw new Error('Parámetros de paginación inválidos');
            }
            
            const offset = (page - 1) * limit;
            
            // Configuración de ordenamiento con validación
            const sortConfig = {
                newest: { orderBy: 'created_at', ascending: false },
                oldest: { orderBy: 'created_at', ascending: true },
                popular: { orderBy: 'likes_count', ascending: false }
            };
            
            const { orderBy, ascending } = sortConfig[sort] || sortConfig.newest;

            // Query optimizada con información del autor usando INNER JOIN
            const { data, error } = await supabase
                .from('comments')
                .select(`
                    id,
                    content,
                    created_at,
                    updated_at,
                    likes_count,
                    replies_count,
                    author_id,
                    profiles!comments_author_id_fkey(
                        username,
                        avatar_url,
                        full_name
                    )
                `)
                .eq('project_id', projectId)
                .order(orderBy, { ascending })
                .range(offset, offset + limit - 1);

            // Query optimizada para conteo (solo cuenta, sin datos)
            const { count, error: countError } = await supabase
                .from('comments')
                .select('id', { count: 'exact', head: true })
                .eq('project_id', projectId);

            if (error) throw error;
            if (countError) throw countError;

            // Procesar datos con estructura consistente
            const processedData = (data || []).map(comment => {
                // Limpiar datos del objeto profiles
                const { profiles, ...commentData } = comment;
                
                return {
                    ...commentData,
                    author: {
                        id: comment.author_id,
                        username: CommentService.generateUsername(comment.profiles),
                        avatar_url: comment.profiles?.avatar_url || null,
                        full_name: comment.profiles?.full_name || null
                    },
                    is_liked: false
                };
            });

            return {
                success: true,
                data: processedData,
                total: count || 0,
                hasMore: (offset + limit) < (count || 0)
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Error interno del servidor'
            };
        }
    }

    // Crear comentario con validaciones
    static async createComment({ projectId, userId, content, userToken }) {
        try {
            // Validaciones de entrada
            if (!projectId || typeof projectId !== 'string') {
                throw new Error('Project ID es requerido y debe ser un string válido');
            }
            
            if (!userId || typeof userId !== 'string') {
                throw new Error('User ID es requerido y debe ser un string válido');
            }
            
            if (!content || typeof content !== 'string' || content.trim().length === 0) {
                throw new Error('Contenido del comentario es requerido');
            }
            
            if (content.trim().length > 2000) {
                throw new Error('El comentario no puede exceder 2000 caracteres');
            }
            
            if (!userToken || typeof userToken !== 'string') {
                throw new Error('Token de usuario es requerido');
            }
            
            // Crear cliente autenticado
            const supabaseClient = createAuthenticatedClient(userToken);
            
            // Verificar que el proyecto existe
            const { data: project, error: projectError } = await supabaseClient
                .from('projects')
                .select('id')
                .eq('id', projectId)
                .single();

            if (projectError || !project) {
                return {
                    success: false,
                    error: 'Proyecto no encontrado'
                };
            }

            // Crear comentario
            const { data, error } = await supabaseClient
                .from('comments')
                .insert({
                    project_id: projectId,
                    author_id: userId,
                    content: content.trim(),
                    created_at: new Date().toISOString()
                })
                .select(`
                    id,
                    content,
                    created_at,
                    updated_at,
                    likes_count,
                    replies_count,
                    author_id,
                    profiles!inner(
                        username,
                        avatar_url,
                        full_name
                    )
                `)
                .single();

            if (error) throw error;

            // Formatear datos con información del autor
            const { profiles, ...commentData } = data;
            
            const formattedData = {
                ...commentData,
                author: {
                    id: data.author_id,
                    username: CommentService.generateUsername(data.profiles),
                    avatar_url: data.profiles?.avatar_url || null,
                    full_name: data.profiles?.full_name || null
                }
            };

            return {
                success: true,
                data: formattedData
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Toggle like con optimización
    static async toggleLike(commentId, userId, userToken) {
        try {
            // Crear cliente autenticado
            const supabaseClient = createAuthenticatedClient(userToken);
            
            // Verificar si ya existe el like
            const { data: existingLike, error: checkError } = await supabaseClient
                .from('comment_likes')
                .select('id')
                .eq('comment_id', commentId)
                .eq('user_id', userId)
                .single();

            if (checkError && checkError.code !== 'PGRST116') {
                throw checkError;
            }

            let isLiked;
            let likesCount;

            if (existingLike) {
                // Quitar like
                const { error: deleteError } = await supabaseClient
                    .from('comment_likes')
                    .delete()
                    .eq('comment_id', commentId)
                    .eq('user_id', userId);

                if (deleteError) throw deleteError;

                // Decrementar contador
                const { error: decrementError } = await supabaseClient
                    .from('comments')
                    .update({ 
                        likes_count: supabaseClient.raw('likes_count - 1') 
                    })
                    .eq('id', commentId);

                if (decrementError) throw decrementError;

                isLiked = false;
            } else {
                // Añadir like
                const { error: insertError } = await supabaseClient
                    .from('comment_likes')
                    .insert({
                        comment_id: commentId,
                        user_id: userId
                    });

                if (insertError) throw insertError;

                // Incrementar contador
                const { error: incrementError } = await supabaseClient
                    .from('comments')
                    .update({ 
                        likes_count: supabaseClient.raw('likes_count + 1') 
                    })
                    .eq('id', commentId);

                if (incrementError) throw incrementError;

                isLiked = true;
            }

            // Obtener contador actualizado
            const { data: comment, error: fetchError } = await supabaseClient
                .from('comments')
                .select('likes_count')
                .eq('id', commentId)
                .single();

            if (fetchError) throw fetchError;

            return {
                success: true,
                likesCount: comment.likes_count,
                isLiked: isLiked
            };
        } catch (error) {
            console.error('CommentService.toggleLike error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Obtener respuestas de un comentario
    static async getCommentReplies(commentId, page = 1, limit = 5, userToken = null) {
        try {
            const offset = (page - 1) * limit;
            
            // Usar cliente autenticado si se proporciona token, sino cliente anónimo
            const supabaseClient = userToken ? createAuthenticatedClient(userToken) : supabase;

            const { data, error } = await supabaseClient
                .from('comments')
                .select(`
                    id,
                    content,
                    created_at,
                    likes_count,
                    author_id
                `)
                .eq('parent_id', commentId)
                .order('created_at', { ascending: true })
                .range(offset, offset + limit - 1);

            if (error) throw error;

            // Formatear datos con estructura consistente
            const processedData = (data || []).map(reply => ({
                ...reply,
                author: {
                    id: reply.author_id,
                    username: 'Usuario',
                    avatar_url: null
                },
                is_liked: false
            }));

            return {
                success: true,
                data: processedData
            };
        } catch (error) {
            console.error('CommentService.getCommentReplies error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Crear respuesta a comentario
    static async createReply({ commentId, userId, content, userToken }) {
        try {
            // Crear cliente autenticado
            const supabaseClient = createAuthenticatedClient(userToken);
            
            // Obtener el proyecto del comentario padre
            const { data: parentComment, error: parentError } = await supabaseClient
                .from('comments')
                .select('project_id')
                .eq('id', commentId)
                .single();

            if (parentError || !parentComment) {
                return {
                    success: false,
                    error: 'Comentario padre no encontrado'
                };
            }

            // Crear respuesta
            const { data, error } = await supabaseClient
                .from('comments')
                .insert({
                    project_id: parentComment.project_id,
                    parent_id: commentId,
                    author_id: userId,
                    content: content.trim(),
                    created_at: new Date().toISOString()
                })
                .select(`
                    id,
                    content,
                    created_at,
                    likes_count,
                    author_id
                `)
                .single();

            if (error) throw error;

            // Incrementar contador de respuestas del comentario padre
            await supabaseClient
                .from('comments')
                .update({ 
                    replies_count: supabaseClient.raw('replies_count + 1') 
                })
                .eq('id', commentId);

            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('CommentService.createReply error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = CommentService;

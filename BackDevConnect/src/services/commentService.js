const supabase = require('../lib/supabase');

class CommentService {
    // Obtener comentarios con paginación y optimizaciones
    static async getProjectComments(projectId, page = 1, limit = 10, sort = 'newest') {
        try {
            const offset = (page - 1) * limit;
            
            // Construir ordenamiento
            let orderBy = 'created_at';
            let ascending = false;
            
            switch (sort) {
                case 'oldest':
                    ascending = true;
                    break;
                case 'popular':
                    orderBy = 'likes_count';
                    break;
                default:
                    orderBy = 'created_at';
                    ascending = false;
            }

            // Query optimizada con JOIN para evitar N+1
            const { data, error } = await supabase
                .from('comments')
                .select(`
                    id,
                    content,
                    created_at,
                    updated_at,
                    likes_count,
                    replies_count,
                    author:profiles!comments_author_id_fkey(
                        id,
                        username,
                        avatar_url
                    ),
                    comment_likes!inner(
                        user_id
                    )
                `)
                .eq('project_id', projectId)
                .eq('parent_id', null) // Solo comentarios principales
                .order(orderBy, { ascending })
                .range(offset, offset + limit - 1);

            if (error) throw error;

            // Obtener total de comentarios
            const { count, error: countError } = await supabase
                .from('comments')
                .select('*', { count: 'exact', head: true })
                .eq('project_id', projectId)
                .eq('parent_id', null);

            if (countError) throw countError;

            return {
                success: true,
                data: data || [],
                total: count || 0,
                hasMore: (offset + limit) < (count || 0)
            };
        } catch (error) {
            console.error('CommentService.getProjectComments error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Crear comentario con validaciones
    static async createComment({ projectId, userId, content }) {
        try {
            // Verificar que el proyecto existe
            const { data: project, error: projectError } = await supabase
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
            const { data, error } = await supabase
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
                    author:profiles!comments_author_id_fkey(
                        id,
                        username,
                        avatar_url
                    )
                `)
                .single();

            if (error) throw error;

            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('CommentService.createComment error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Toggle like con optimización
    static async toggleLike(commentId, userId) {
        try {
            // Verificar si ya existe el like
            const { data: existingLike, error: checkError } = await supabase
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
                const { error: deleteError } = await supabase
                    .from('comment_likes')
                    .delete()
                    .eq('comment_id', commentId)
                    .eq('user_id', userId);

                if (deleteError) throw deleteError;

                // Decrementar contador
                const { error: decrementError } = await supabase
                    .from('comments')
                    .update({ 
                        likes_count: supabase.raw('likes_count - 1') 
                    })
                    .eq('id', commentId);

                if (decrementError) throw decrementError;

                isLiked = false;
            } else {
                // Añadir like
                const { error: insertError } = await supabase
                    .from('comment_likes')
                    .insert({
                        comment_id: commentId,
                        user_id: userId
                    });

                if (insertError) throw insertError;

                // Incrementar contador
                const { error: incrementError } = await supabase
                    .from('comments')
                    .update({ 
                        likes_count: supabase.raw('likes_count + 1') 
                    })
                    .eq('id', commentId);

                if (incrementError) throw incrementError;

                isLiked = true;
            }

            // Obtener contador actualizado
            const { data: comment, error: fetchError } = await supabase
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
    static async getCommentReplies(commentId, page = 1, limit = 5) {
        try {
            const offset = (page - 1) * limit;

            const { data, error } = await supabase
                .from('comments')
                .select(`
                    id,
                    content,
                    created_at,
                    likes_count,
                    author:profiles!comments_author_id_fkey(
                        id,
                        username,
                        avatar_url
                    )
                `)
                .eq('parent_id', commentId)
                .order('created_at', { ascending: true })
                .range(offset, offset + limit - 1);

            if (error) throw error;

            return {
                success: true,
                data: data || []
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
    static async createReply({ commentId, userId, content }) {
        try {
            // Obtener el proyecto del comentario padre
            const { data: parentComment, error: parentError } = await supabase
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
            const { data, error } = await supabase
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
                    author:profiles!comments_author_id_fkey(
                        id,
                        username,
                        avatar_url
                    )
                `)
                .single();

            if (error) throw error;

            // Incrementar contador de respuestas del comentario padre
            await supabase
                .from('comments')
                .update({ 
                    replies_count: supabase.raw('replies_count + 1') 
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

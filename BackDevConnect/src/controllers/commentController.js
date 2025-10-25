const CommentService = require('../services/commentService');
const response = require('../utils/response');
const validation = require('../utils/validation');

class CommentController {
    /**
     * @swagger
     * /api/projects/{projectId}/comments:
     *   get:
     *     tags: [Comentarios]
     *     summary: Obtener comentarios de un proyecto
     *     description: Devuelve una lista paginada de comentarios con respuestas
     *     parameters:
     *       - $ref: '#/components/parameters/IdParam'
     *       - $ref: '#/components/parameters/PageParam'
     *       - $ref: '#/components/parameters/LimitParam'
     *       - name: sort
     *         in: query
     *         description: Orden de los comentarios
     *         schema:
     *           type: string
     *           enum: [newest, oldest, popular]
     *           default: newest
     *     responses:
     *       200:
     *         description: Lista de comentarios
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/BaseResponse'
     *                 - $ref: '#/components/schemas/PaginationResponse'
     *                 - type: object
     *                   properties:
     *                     comments:
     *                       type: array
     *                       items:
     *                         $ref: '#/components/schemas/Comment'
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       404:
     *         $ref: '#/components/responses/NotFound'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    static async getProjectComments(req, res) {
        try {
            const { projectId } = req.params;
            const { page = 1, limit = 10, sort = 'newest' } = req.query;
            
            validation.required(projectId, 'Project ID');
            validation.required(page, 'Page');
            validation.required(limit, 'Limit');

            const result = await CommentService.getProjectComments(
                projectId, 
                parseInt(page), 
                parseInt(limit), 
                sort
            );
            
            if (result.success) {
                res.json({
                    success: true,
                    comments: result.data,
                    total: result.total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    has_more: result.hasMore
                });
            } else {
                const statusCode = result.error.includes('no encontrado') ? 404 : 500;
                res.status(statusCode).json(response.error(result.error, statusCode));
            }
        } catch (error) {
            res.status(400).json(response.validation([error.message]));
        }
    }

    /**
     * @swagger
     * /api/projects/{projectId}/comments:
     *   post:
     *     tags: [Comentarios]
     *     summary: Crear comentario en proyecto
     *     description: Añade un nuevo comentario a un proyecto
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - $ref: '#/components/parameters/IdParam'
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateCommentRequest'
     *     responses:
     *       201:
     *         description: Comentario creado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/BaseResponse'
     *                 - type: object
     *                   properties:
     *                     comment:
     *                       $ref: '#/components/schemas/Comment'
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       401:
     *         $ref: '#/components/responses/Unauthorized'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    static async createComment(req, res) {
        try {
            const { projectId } = req.params;
            const { content } = req.body;
            const userId = req.user?.id;
            
            validation.required(projectId, 'Project ID');
            validation.required(content, 'Content');
            validation.required(userId, 'User ID');
            validation.minLength(content, 1, 'Content');
            validation.maxLength(content, 1000, 'Content');

            const result = await CommentService.createComment({
                projectId,
                userId,
                content
            });
            
            if (result.success) {
                res.status(201).json({
                    success: true,
                    message: 'Comentario creado exitosamente',
                    comment: result.data
                });
            } else {
                const statusCode = result.error.includes('no encontrado') ? 404 : 500;
                res.status(statusCode).json(response.error(result.error, statusCode));
            }
        } catch (error) {
            res.status(400).json(response.validation([error.message]));
        }
    }

    /**
     * @swagger
     * /api/comments/{commentId}/like:
     *   post:
     *     tags: [Comentarios]
     *     summary: Dar like a comentario
     *     description: Añade o quita un like a un comentario
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: commentId
     *         in: path
     *         required: true
     *         description: ID del comentario
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Like procesado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/BaseResponse'
     *                 - type: object
     *                   properties:
     *                     likes_count:
     *                       type: integer
     *                     is_liked:
     *                       type: boolean
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       401:
     *         $ref: '#/components/responses/Unauthorized'
     *       404:
     *         $ref: '#/components/responses/NotFound'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    static async toggleLike(req, res) {
        try {
            const { commentId } = req.params;
            const userId = req.user?.id;
            
            validation.required(commentId, 'Comment ID');
            validation.required(userId, 'User ID');

            const result = await CommentService.toggleLike(commentId, userId);
            
            if (result.success) {
                res.json({
                    success: true,
                    likes_count: result.likesCount,
                    is_liked: result.isLiked
                });
            } else {
                const statusCode = result.error.includes('no encontrado') ? 404 : 500;
                res.status(statusCode).json(response.error(result.error, statusCode));
            }
        } catch (error) {
            res.status(400).json(response.validation([error.message]));
        }
    }
}

module.exports = CommentController;

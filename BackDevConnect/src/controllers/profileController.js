const ProfileService = require('../services/profileService');

class ProfileController {
    /**
     * @swagger
     * /api/profiles:
     *   get:
     *     tags: [Perfiles]
     *     summary: Obtener lista de perfiles
     *     description: Devuelve una lista de perfiles de desarrolladores registrados
     *     parameters:
     *       - $ref: '#/components/parameters/PageParam'
     *       - $ref: '#/components/parameters/LimitParam'
     *       - $ref: '#/components/parameters/SearchParam'
     *     responses:
     *       200:
     *         description: Lista de perfiles obtenida exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/BaseResponse'
     *                 - $ref: '#/components/schemas/PaginationResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: array
     *                       items:
     *                         $ref: '#/components/schemas/User'
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    static async getAllProfiles(req, res) {
        try {
            const result = await ProfileService.getAllProfiles();
            
            if (result.success) {
                res.json({
                    success: true,
                    total: result.total,
                    profiles: result.data
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }

    /**
     * @swagger
     * /api/profiles/{id}:
     *   get:
     *     tags: [Perfiles]
     *     summary: Obtener perfil por ID
     *     description: Devuelve la información de un perfil específico
     *     parameters:
     *       - $ref: '#/components/parameters/IdParam'
     *     responses:
     *       200:
     *         description: Perfil encontrado
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/BaseResponse'
     *                 - type: object
     *                   properties:
     *                     profile:
     *                       $ref: '#/components/schemas/User'
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       404:
     *         $ref: '#/components/responses/NotFound'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    static async getProfileById(req, res) {
        try {
            const { id } = req.params;
            const result = await ProfileService.getProfileById(id);
            
            if (result.success) {
                res.json({
                    success: true,
                    profile: result.data
                });
            } else {
                const statusCode = result.error.includes('no encontrado') ? 404 : 500;
                res.status(statusCode).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }

    /**
     * @swagger
     * /api/profiles/search/{query}:
     *   get:
     *     tags: [Perfiles]
     *     summary: Buscar perfiles
     *     description: Busca perfiles por nombre o username
     *     parameters:
     *       - name: query
     *         in: path
     *         required: true
     *         description: Término de búsqueda
     *         schema:
     *           type: string
     *           minLength: 2
     *           maxLength: 50
     *     responses:
     *       200:
     *         description: Resultados de búsqueda
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/BaseResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: array
     *                       items:
     *                         $ref: '#/components/schemas/User'
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    static async searchProfiles(req, res) {
        try {
            const { query } = req.params;
            const result = await ProfileService.searchProfiles(query);
            
            if (result.success) {
                res.json({
                    success: true,
                    total: result.total,
                    profiles: result.data
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }

    /**
     * @swagger
     * /api/profiles/stats:
     *   get:
     *     tags: [Perfiles]
     *     summary: Obtener estadísticas de perfiles
     *     description: Retorna estadísticas generales de perfiles
     *     responses:
     *       200:
     *         description: Estadísticas de perfiles
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/BaseResponse'
     *                 - type: object
     *                   properties:
     *                     stats:
     *                       type: object
     *                       properties:
     *                         total_profiles:
     *                           type: integer
     *                           description: Total de perfiles registrados
     *                         active_profiles:
     *                           type: integer
     *                           description: Perfiles activos
     *                         new_profiles_this_month:
     *                           type: integer
     *                           description: Nuevos perfiles este mes
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    static async getProfileStats(req, res) {
        try {
            const result = await ProfileService.getProfileStats();
            
            if (result.success) {
                res.json({
                    success: true,
                    stats: result.data
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }
}

module.exports = ProfileController;

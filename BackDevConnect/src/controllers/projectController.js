const ProjectService = require('../services/projectService');
const AuthService = require('../services/authService');

class ProjectController {
    /**
     * @swagger
     * /api/projects:
     *   get:
     *     tags: [Proyectos]
     *     summary: Obtener lista de proyectos
     *     description: Devuelve una lista paginada de proyectos públicos
     *     parameters:
     *       - $ref: '#/components/parameters/PageParam'
     *       - $ref: '#/components/parameters/LimitParam'
     *       - $ref: '#/components/parameters/SearchParam'
     *     responses:
     *       200:
     *         description: Lista de proyectos obtenida exitosamente
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
     *                         $ref: '#/components/schemas/Project'
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    static async getAllProjects(req, res) {
        const { limit = 10, offset = 0, search } = req.query;
        const result = await ProjectService.getProjectsPaginated(
            parseInt(limit), 
            parseInt(offset), 
            search
        );
        
        if (result.success) {
            res.json({
                success: true,
                total: result.total,
                projects: result.data,
                pagination: result.pagination
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    }

    /**
     * @swagger
     * /api/projects/{id}:
     *   get:
     *     tags: [Proyectos]
     *     summary: Obtener proyecto por ID
     *     description: Devuelve la información de un proyecto específico
     *     parameters:
     *       - $ref: '#/components/parameters/IdParam'
     *     responses:
     *       200:
     *         description: Proyecto encontrado
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/BaseResponse'
     *                 - type: object
     *                   properties:
     *                     project:
     *                       $ref: '#/components/schemas/Project'
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       404:
     *         $ref: '#/components/responses/NotFound'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    static async getProjectById(req, res) {
        const { id } = req.params;
        const result = await ProjectService.getProjectById(id);
        
        if (result.success) {
            res.json({
                success: true,
                project: result.data
            });
        } else {
            const statusCode = result.error.includes('no encontrado') ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                error: result.error
            });
        }
    }

    /**
     * @swagger
     * /api/projects:
     *   post:
     *     tags: [Proyectos]
     *     summary: Crear nuevo proyecto
     *     description: Crea un nuevo proyecto en el portafolio del usuario
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [title, description, tech_stack]
     *             properties:
     *               title:
     *                 type: string
     *                 minLength: 3
     *                 maxLength: 100
     *                 example: "E-commerce con React"
     *               description:
     *                 type: string
     *                 minLength: 10
     *                 maxLength: 1000
     *                 example: "Plataforma de comercio electrónico desarrollada con React, Node.js y PostgreSQL"
     *               demo_url:
     *                 type: string
     *                 format: uri
     *                 example: "https://mi-proyecto-demo.vercel.app"
     *               github_url:
     *                 type: string
     *                 format: uri
     *                 example: "https://github.com/usuario/mi-proyecto"
     *               tech_stack:
     *                 type: array
     *                 items:
     *                   type: string
     *                 minItems: 1
     *                 example: ["React", "Node.js", "PostgreSQL", "Tailwind CSS"]
     *               image_url:
     *                 type: string
     *                 format: uri
     *                 example: "https://ejemplo.com/imagen-proyecto.jpg"
     *     responses:
     *       201:
     *         description: Proyecto creado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/BaseResponse'
     *                 - type: object
     *                   properties:
     *                     project:
     *                       $ref: '#/components/schemas/Project'
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       401:
     *         $ref: '#/components/responses/Unauthorized'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    static async createProject(req, res) {
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Usuario no autenticado'
            });
        }

        const projectData = {
            ...req.body,
            author_id: userId
        };

        const result = await ProjectService.createProject(projectData);
        
        if (result.success) {
            res.status(201).json({
                success: true,
                message: 'Proyecto creado exitosamente',
                project: result.data
            });
        } else {
            const statusCode = result.error.includes('requeridos') ? 400 : 500;
            res.status(statusCode).json({
                success: false,
                error: result.error
            });
        }
    }

    /**
     * @swagger
     * /api/projects/{id}:
     *   put:
     *     tags: [Proyectos]
     *     summary: Actualizar proyecto
     *     description: Actualiza la información de un proyecto existente
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - $ref: '#/components/parameters/IdParam'
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *                 minLength: 3
     *                 maxLength: 100
     *                 example: "E-commerce con React"
     *               description:
     *                 type: string
     *                 minLength: 10
     *                 maxLength: 1000
     *                 example: "Plataforma de comercio electrónico desarrollada con React, Node.js y PostgreSQL"
     *               demo_url:
     *                 type: string
     *                 format: uri
     *                 example: "https://mi-proyecto-demo.vercel.app"
     *               github_url:
     *                 type: string
     *                 format: uri
     *                 example: "https://github.com/usuario/mi-proyecto"
     *               tech_stack:
     *                 type: array
     *                 items:
     *                   type: string
     *                 minItems: 1
     *                 example: ["React", "Node.js", "PostgreSQL", "Tailwind CSS"]
     *               image_url:
     *                 type: string
     *                 format: uri
     *                 example: "https://ejemplo.com/imagen-proyecto.jpg"
     *     responses:
     *       200:
     *         description: Proyecto actualizado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/BaseResponse'
     *                 - type: object
     *                   properties:
     *                     project:
     *                       $ref: '#/components/schemas/Project'
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       401:
     *         $ref: '#/components/responses/Unauthorized'
     *       403:
     *         $ref: '#/components/responses/Forbidden'
     *       404:
     *         $ref: '#/components/responses/NotFound'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    static async updateProject(req, res) {
        const { id } = req.params;
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Usuario no autenticado'
            });
        }

        const result = await ProjectService.updateProject(id, req.body, userId);
        
        if (result.success) {
            res.json({
                success: true,
                message: 'Proyecto actualizado exitosamente',
                project: result.data
            });
        } else {
            const statusCode = result.error.includes('no encontrado') ? 404 : 
                             result.error.includes('no autorizado') ? 403 :
                             result.error.includes('requeridos') ? 400 : 500;
            res.status(statusCode).json({
                success: false,
                error: result.error
            });
        }
    }

    /**
     * @swagger
     * /api/projects/{id}:
     *   delete:
     *     tags: [Proyectos]
     *     summary: Eliminar proyecto
     *     description: Elimina un proyecto del portafolio
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - $ref: '#/components/parameters/IdParam'
     *     responses:
     *       200:
     *         description: Proyecto eliminado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/BaseResponse'
     *       401:
     *         $ref: '#/components/responses/Unauthorized'
     *       403:
     *         $ref: '#/components/responses/Forbidden'
     *       404:
     *         $ref: '#/components/responses/NotFound'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    static async deleteProject(req, res) {
        const { id } = req.params;
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Usuario no autenticado'
            });
        }

        const result = await ProjectService.deleteProject(id, userId);
        
        if (result.success) {
            res.json({
                success: true,
                message: 'Proyecto eliminado exitosamente'
            });
        } else {
            const statusCode = result.error.includes('no encontrado') ? 404 : 
                             result.error.includes('no autorizado') ? 403 : 500;
            res.status(statusCode).json({
                success: false,
                error: result.error
            });
        }
    }

    /**
     * @swagger
     * /api/projects/user/{userId}:
     *   get:
     *     tags: [Proyectos]
     *     summary: Obtener proyectos de un usuario
     *     description: Devuelve una lista paginada de proyectos de un usuario específico
     *     parameters:
     *       - name: userId
     *         in: path
     *         required: true
     *         description: ID del usuario
     *         schema:
     *           type: string
     *           format: uuid
     *       - $ref: '#/components/parameters/PageParam'
     *       - $ref: '#/components/parameters/LimitParam'
     *     responses:
     *       200:
     *         description: Lista de proyectos del usuario obtenida exitosamente
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
     *                         $ref: '#/components/schemas/Project'
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       404:
     *         $ref: '#/components/responses/NotFound'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    static async getUserProjects(req, res) {
        const { userId } = req.params;
        const { limit = 10, offset = 0 } = req.query;
        
        const result = await ProjectService.getUserProjects(
            userId, 
            parseInt(limit), 
            parseInt(offset)
        );
        
        if (result.success) {
            res.json({
                success: true,
                total: result.total,
                projects: result.data,
                pagination: result.pagination
            });
        } else {
            const statusCode = result.error.includes('no encontrado') ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                error: result.error
            });
        }
    }
}

module.exports = ProjectController;
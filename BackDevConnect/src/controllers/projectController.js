const ProjectService = require('../services/projectService');
const AuthService = require('../services/authService');

class ProjectController {
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

    static async createProject(req, res) {
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Usuario no autenticado'
            });
        }

        const { title, description, tech_stack } = req.body;
        if (!title || !description || !tech_stack) {
            return res.status(400).json({
                success: false,
                error: 'Título, descripción y tecnologías son requeridos'
            });
        }

        if (!Array.isArray(tech_stack)) {
            return res.status(400).json({
                success: false,
                error: 'Tech stack debe ser un array'
            });
        }

        const projectData = {
            user_id: userId,
            ...req.body
        };

        const result = await ProjectService.createProject(projectData);
        
        if (result.success) {
            res.status(201).json({
                success: true,
                message: 'Proyecto creado exitosamente',
                project: result.data
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    }

    static async updateProject(req, res) {
        const { id } = req.params;
        const userId = req.user?.id;
        const updateData = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Usuario no autenticado'
            });
        }

        const ownershipResult = await ProjectService.checkProjectOwnership(id, userId);
        if (!ownershipResult.success) {
            const statusCode = ownershipResult.error.includes('no encontrado') ? 404 : 500;
            return res.status(statusCode).json({
                success: false,
                error: ownershipResult.error
            });
        }

        if (!ownershipResult.isOwner) {
            return res.status(403).json({
                success: false,
                error: 'No tienes permisos para editar este proyecto'
            });
        }

        const result = await ProjectService.updateProject(id, updateData);
        
        if (result.success) {
            res.json({
                success: true,
                message: 'Proyecto actualizado exitosamente',
                project: result.data
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    }

    static async deleteProject(req, res) {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Usuario no autenticado'
            });
        }

        const ownershipResult = await ProjectService.checkProjectOwnership(id, userId);
        if (!ownershipResult.success) {
            const statusCode = ownershipResult.error.includes('no encontrado') ? 404 : 500;
            return res.status(statusCode).json({
                success: false,
                error: ownershipResult.error
            });
        }

        if (!ownershipResult.isOwner) {
            return res.status(403).json({
                success: false,
                error: 'No tienes permisos para eliminar este proyecto'
            });
        }

        const result = await ProjectService.deleteProject(id);
        
        if (result.success) {
            res.json({
                success: true,
                message: 'Proyecto eliminado exitosamente'
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    }

    static async getUserProjects(req, res) {
        const { userId } = req.params;
        const result = await ProjectService.getProjectsByUser(userId);
        
        if (result.success) {
            res.json({
                success: true,
                total: result.total,
                projects: result.data
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    }
}

module.exports = ProjectController;

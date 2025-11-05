const UserService = require('../services/userService');

class UserController {
    // Obtener todos los usuarios (solo admin)
    static async getAllUsers(req, res) {
        try {
            const { limit, offset, search } = req.query;
            
            const result = await UserService.getAllUsers({
                limit: limit ? parseInt(limit) : undefined,
                offset: offset ? parseInt(offset) : undefined,
                search
            });
            
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data,
                    total: result.total
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Error en getAllUsers:', error);
            res.status(500).json({
                success: false,
                error: 'Error al obtener usuarios'
            });
        }
    }

    // Obtener usuario por ID (solo admin)
    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            const result = await UserService.getUserById(id);
            
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data
                });
            } else {
                const statusCode = result.error.includes('no encontrado') ? 404 : 500;
                res.status(statusCode).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Error en getUserById:', error);
            res.status(500).json({
                success: false,
                error: 'Error al obtener usuario'
            });
        }
    }

    // Actualizar usuario completo (solo admin)
    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { full_name, username, bio, avatar_url, website, github_url, linkedin_url, role } = req.body;
            const token = req.headers.authorization?.replace('Bearer ', '');
            
            const result = await UserService.updateUser(id, {
                full_name,
                username,
                bio,
                avatar_url,
                website,
                github_url,
                linkedin_url,
                role
            }, token);
            
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data,
                    message: 'Usuario actualizado correctamente'
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Error en updateUser:', error);
            res.status(500).json({
                success: false,
                error: 'Error al actualizar usuario'
            });
        }
    }

    // Actualizar solo el rol (solo admin)
    static async updateUserRole(req, res) {
        try {
            const { id } = req.params;
            const { role } = req.body;
            
            if (!role || !['user', 'admin'].includes(role)) {
                return res.status(400).json({
                    success: false,
                    error: 'Rol inválido. Debe ser "user" o "admin"'
                });
            }
            
            const result = await UserService.updateUserRole(id, role);
            
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data,
                    message: 'Rol actualizado correctamente'
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Error en updateUserRole:', error);
            res.status(500).json({
                success: false,
                error: 'Error al actualizar rol'
            });
        }
    }

    // Eliminar usuario (solo admin)
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            
            // Prevenir que el admin se elimine a sí mismo
            if (id === req.user.id) {
                return res.status(400).json({
                    success: false,
                    error: 'No puedes eliminar tu propia cuenta'
                });
            }
            
            const result = await UserService.deleteUser(id);
            
            if (result.success) {
                res.json({
                    success: true,
                    message: 'Usuario eliminado correctamente'
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Error en deleteUser:', error);
            res.status(500).json({
                success: false,
                error: 'Error al eliminar usuario'
            });
        }
    }
}

module.exports = UserController;
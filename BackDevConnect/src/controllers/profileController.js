const ProfileService = require('../services/profileService');

class ProfileController {
    static async getAllProfiles(req, res) {
        try {
            const { limit, offset, search } = req.query;
            
            const params = {};
            if (limit) params.limit = parseInt(limit);
            if (offset) params.offset = parseInt(offset);
            if (search) params.search = search;
            
            const result = await ProfileService.getAllProfiles(params);
            
            if (result.success) {
                res.json({
                    success: true,
                    total: result.total,
                    data: result.data
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

    static async getProfileById(req, res) {
        try {
            const { id } = req.params;
            const result = await ProfileService.getProfileById(id);
            
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
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }

    static async searchProfiles(req, res) {
        try {
            const { query } = req.params;
            const result = await ProfileService.searchProfiles(query);
            
            if (result.success) {
                res.json({
                    success: true,
                    total: result.total,
                    data: result.data
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

    static async getProfileStats(req, res) {
        try {
            const result = await ProfileService.getProfileStats();
            
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data
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

    // 🆕 NUEVO: Obtener mi perfil
    static async getMyProfile(req, res) {
        try {
            const userId = req.user.id;
            const result = await ProfileService.getProfileById(userId);
            
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Error en getMyProfile:', error);
            res.status(500).json({
                success: false,
                error: 'Error al obtener perfil'
            });
        }
    }

    // 🆕 NUEVO: Actualizar mi perfil
    static async updateProfile(req, res) {
        try {
            const userId = req.user?.id;
            
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'Usuario no autenticado'
                });
            }

            // Obtener el token del header Authorization
            const authHeader = req.headers.authorization;
            const userToken = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
            
            const { full_name, username, bio, avatar_url, website, github_url, linkedin_url } = req.body;
            
            const result = await ProfileService.updateProfile(userId, {
                full_name,
                username,
                bio,
                avatar_url,
                website,
                github_url,
                linkedin_url
            }, userToken);
            
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data,
                    message: 'Perfil actualizado correctamente'
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
                error: 'Error al actualizar perfil'
            });
        }
    }
}

module.exports = ProfileController;
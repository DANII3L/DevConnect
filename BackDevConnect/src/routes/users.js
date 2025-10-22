// BackDevConnect/src/routes/users.js
// Rutas de usuarios/desarrolladores

const express = require('express');
const UserService = require('../services/userService');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Retorna la lista completa de usuarios/desarrolladores
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 total:
 *                   type: number
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get('/', async (req, res) => {
    try {
        const result = await UserService.getAllUsers();
        
        if (result.success) {
            res.json({
                success: true,
                total: result.total,
                users: result.data
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
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     description: Retorna información de un usuario específico
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await UserService.getUserById(id);
        
        if (result.success) {
            res.json({
                success: true,
                user: result.data
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

/**
 * @swagger
 * /api/users/search/{query}:
 *   get:
 *     summary: Buscar usuarios
 *     description: Busca usuarios por nombre o username
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Término de búsqueda
 *     responses:
 *       200:
 *         description: Resultados de búsqueda
 */
router.get('/search/:query', async (req, res) => {
    try {
        const { query } = req.params;
        const result = await UserService.searchUsers(query);
        
        if (result.success) {
            res.json({
                success: true,
                total: result.total,
                users: result.data
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
});

/**
 * @swagger
 * /api/users/stats:
 *   get:
 *     summary: Obtener estadísticas de usuarios
 *     description: Retorna estadísticas generales de usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Estadísticas de usuarios
 */
router.get('/stats', async (req, res) => {
    try {
        const result = await UserService.getUserStats();
        
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
});

module.exports = router;

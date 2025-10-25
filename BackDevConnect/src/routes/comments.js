const express = require('express');
const CommentController = require('../controllers/commentController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Rutas de comentarios - Reorganizadas para evitar conflictos
router.get('/project/:projectId', CommentController.getProjectComments);
router.post('/project/:projectId', authenticateToken, CommentController.createComment);
router.post('/:commentId/like', authenticateToken, CommentController.toggleLike);

module.exports = router;

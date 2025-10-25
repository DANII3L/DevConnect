const express = require('express');
const ProjectController = require('../controllers/projectController');
const { authenticateToken, requireOwnership } = require('../middleware/auth');

const router = express.Router();

// Rutas de proyectos
router.get('/', ProjectController.getAllProjects);
router.get('/:id', ProjectController.getProjectById);
router.post('/', authenticateToken, ProjectController.createProject);
router.put('/:id', authenticateToken, requireOwnership('project'), ProjectController.updateProject);
router.delete('/:id', authenticateToken, requireOwnership('project'), ProjectController.deleteProject);
router.get('/user/:userId', ProjectController.getUserProjects);

module.exports = router;

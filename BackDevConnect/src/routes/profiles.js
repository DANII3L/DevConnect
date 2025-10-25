// BackDevConnect/src/routes/profiles.js
// Rutas de perfiles de desarrolladores

const express = require('express');
const ProfileController = require('../controllers/profileController');

const router = express.Router();

// Rutas de perfiles
router.get('/', ProfileController.getAllProfiles);
router.get('/search/:query', ProfileController.searchProfiles);
router.get('/stats', ProfileController.getProfileStats);
router.get('/:id', ProfileController.getProfileById);

module.exports = router;

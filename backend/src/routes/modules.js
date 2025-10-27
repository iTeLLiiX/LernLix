const express = require('express');
const { getAllModules, getModuleById, completeModule, startModule, getUserModuleProgress } = require('../controllers/moduleController');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllModules);
router.get('/:moduleId', getModuleById);

// Protected routes
router.post('/:moduleId/start', authenticateJWT, startModule);
router.post('/:moduleId/complete', authenticateJWT, completeModule);
router.get('/user/progress', authenticateJWT, getUserModuleProgress);

module.exports = router;


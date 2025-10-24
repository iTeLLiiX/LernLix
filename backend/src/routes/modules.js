const express = require('express');
const router = express.Router();
const { getAllModules, getModule, createModule, updateModule, deleteModule, getModulesByCategory } = require('../controllers/moduleController');
const { authenticateJWT } = require('../middleware/auth');

// Get all modules
router.get('/', getAllModules);

// Get modules by category
router.get('/category/:category', getModulesByCategory);

// Get single module
router.get('/:id', getModule);

// Create module (Admin only)
router.post('/', authenticateJWT, createModule);

// Update module (Admin only)
router.put('/:id', authenticateJWT, updateModule);

// Delete module (Admin only)
router.delete('/:id', authenticateJWT, deleteModule);

module.exports = router;


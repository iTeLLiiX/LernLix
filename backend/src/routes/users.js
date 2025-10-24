const express = require('express');
const router = express.Router();
const { getAllUsers, getUser, updateProfile, deleteUser, getUserStats } = require('../controllers/userController');
const { authenticateJWT } = require('../middleware/auth');

// Get all users (Admin only)
router.get('/', authenticateJWT, getAllUsers);

// Get single user
router.get('/:id', authenticateJWT, getUser);

// Get user stats
router.get('/:id/stats', authenticateJWT, getUserStats);

// Update profile
router.put('/:id', authenticateJWT, updateProfile);

// Delete user
router.delete('/:id', authenticateJWT, deleteUser);

module.exports = router;

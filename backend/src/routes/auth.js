const express = require('express');
const router = express.Router();
const { register, login, refreshToken, getCurrentUser, logout } = require('../controllers/authController');
const { authenticateJWT } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);

// Protected routes
router.get('/me', authenticateJWT, getCurrentUser);
router.post('/logout', authenticateJWT, logout);

module.exports = router;


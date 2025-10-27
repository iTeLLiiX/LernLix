const express = require('express');
const { register, login, refreshToken, getMe } = require('../controllers/authController');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);

// Protected routes
router.get('/me', authenticateJWT, getMe);

module.exports = router;


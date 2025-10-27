const express = require('express');
const { getUserStats, getUserAchievements, getLeaderboard, updateStreak } = require('../controllers/statsController');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();

// Get user stats
router.get('/me', authenticateJWT, getUserStats);

// Get user achievements
router.get('/me/achievements', authenticateJWT, getUserAchievements);

// Get leaderboard
router.get('/leaderboard', authenticateJWT, getLeaderboard);

// Update daily streak
router.post('/me/streak/update', authenticateJWT, updateStreak);

module.exports = router;

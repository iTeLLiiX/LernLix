const express = require('express');
const { getQuests, getUserQuests, startQuest, completeQuest } = require('../controllers/questController');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();

// Get all active quests
router.get('/', authenticateJWT, getQuests);

// Get user's quest progress
router.get('/user/progress', authenticateJWT, getUserQuests);

// Start a quest
router.post('/:questId/start', authenticateJWT, startQuest);

// Complete a quest
router.post('/:questId/complete', authenticateJWT, completeQuest);

module.exports = router;

const express = require('express');
const { getSkillTree, getSkillById, unlockSkill } = require('../controllers/skillController');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();

// Get all skills (Skill Tree)
router.get('/tree', authenticateJWT, getSkillTree);

// Get skill by ID
router.get('/:skillId', authenticateJWT, getSkillById);

// Unlock skill
router.post('/:skillId/unlock', authenticateJWT, unlockSkill);

module.exports = router;

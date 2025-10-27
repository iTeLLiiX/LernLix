const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getAllChallenges,
  getChallengeById,
  startChallenge,
  submitSolution,
  getUserChallenges
} = require('../controllers/challengeController');

// Public routes
router.get('/', getAllChallenges);
router.get('/:id', getChallengeById);

// Protected routes
router.post('/start', authenticateToken, startChallenge);
router.post('/submit', authenticateToken, submitSolution);
router.get('/user/progress', authenticateToken, getUserChallenges);

module.exports = router;

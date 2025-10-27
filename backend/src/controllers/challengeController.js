const { CodeChallenge, UserChallenge, User, UserStats } = require('../models');
const { Op } = require('sequelize');

// Get all challenges
const getAllChallenges = async (req, res) => {
  try {
    const { difficulty, category, language } = req.query;
    
    const where = { isPublished: true, isActive: true };
    
    if (difficulty) where.difficulty = difficulty;
    if (category) where.category = category;
    if (language) where.language = language;
    
    const challenges = await CodeChallenge.findAll({
      where,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'title', 'description', 'difficulty', 'category', 'language', 'xpReward', 'coinReward', 'timeLimit']
    });
    
    res.json(challenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
};

// Get challenge by ID
const getChallengeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const challenge = await CodeChallenge.findOne({
      where: { id, isPublished: true, isActive: true }
    });
    
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    res.json(challenge);
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({ error: 'Failed to fetch challenge' });
  }
};

// Start challenge
const startChallenge = async (req, res) => {
  try {
    const { challengeId } = req.body;
    const userId = req.user.id;
    
    // Check if challenge exists
    const challenge = await CodeChallenge.findOne({
      where: { id: challengeId, isPublished: true, isActive: true }
    });
    
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    // Check if user already has progress
    let userChallenge = await UserChallenge.findOne({
      where: { userId, challengeId }
    });
    
    if (!userChallenge) {
      // Create new user challenge
      userChallenge = await UserChallenge.create({
        userId,
        challengeId,
        status: 'in_progress',
        code: challenge.starterCode
      });
    } else if (userChallenge.status === 'completed') {
      return res.status(400).json({ error: 'Challenge already completed' });
    } else {
      // Update status to in_progress
      userChallenge.status = 'in_progress';
      await userChallenge.save();
    }
    
    res.json({
      challenge: {
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        difficulty: challenge.difficulty,
        category: challenge.category,
        language: challenge.language,
        starterCode: challenge.starterCode,
        hints: challenge.hints,
        timeLimit: challenge.timeLimit
      },
      userChallenge: {
        id: userChallenge.id,
        status: userChallenge.status,
        code: userChallenge.code,
        attempts: userChallenge.attempts,
        timeSpent: userChallenge.timeSpent
      }
    });
  } catch (error) {
    console.error('Error starting challenge:', error);
    res.status(500).json({ error: 'Failed to start challenge' });
  }
};

// Submit code solution
const submitSolution = async (req, res) => {
  try {
    const { challengeId, code, timeSpent } = req.body;
    const userId = req.user.id;
    
    // Get challenge
    const challenge = await CodeChallenge.findOne({
      where: { id: challengeId, isPublished: true, isActive: true }
    });
    
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    // Get or create user challenge
    let userChallenge = await UserChallenge.findOne({
      where: { userId, challengeId }
    });
    
    if (!userChallenge) {
      userChallenge = await UserChallenge.create({
        userId,
        challengeId,
        status: 'in_progress'
      });
    }
    
    // Update user challenge
    userChallenge.code = code;
    userChallenge.attempts += 1;
    userChallenge.timeSpent = timeSpent || userChallenge.timeSpent;
    
    // Simple code validation (in real app, you'd use a proper code runner)
    const testResults = await runCodeTests(code, challenge.testCases);
    
    userChallenge.testResults = testResults;
    
    // Check if all tests passed
    const allTestsPassed = testResults.every(test => test.passed);
    
    if (allTestsPassed) {
      userChallenge.status = 'completed';
      userChallenge.completedAt = new Date();
      userChallenge.xpEarned = challenge.xpReward;
      userChallenge.coinsEarned = challenge.coinReward;
      
      // Update user stats
      await updateUserStats(userId, challenge.xpReward, challenge.coinReward);
    } else {
      userChallenge.status = 'failed';
    }
    
    await userChallenge.save();
    
    res.json({
      success: allTestsPassed,
      testResults,
      xpEarned: userChallenge.xpEarned,
      coinsEarned: userChallenge.coinsEarned,
      status: userChallenge.status
    });
  } catch (error) {
    console.error('Error submitting solution:', error);
    res.status(500).json({ error: 'Failed to submit solution' });
  }
};

// Get user's challenge progress
const getUserChallenges = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;
    
    const where = { userId };
    if (status) where.status = status;
    
    const userChallenges = await UserChallenge.findAll({
      where,
      include: [{
        model: CodeChallenge,
        attributes: ['id', 'title', 'description', 'difficulty', 'category', 'language', 'xpReward', 'coinReward']
      }],
      order: [['updatedAt', 'DESC']]
    });
    
    res.json(userChallenges);
  } catch (error) {
    console.error('Error fetching user challenges:', error);
    res.status(500).json({ error: 'Failed to fetch user challenges' });
  }
};

// Helper function to run code tests (simplified)
const runCodeTests = async (code, testCases) => {
  // This is a simplified version - in production you'd use a proper code runner
  const results = [];
  
  for (const testCase of testCases) {
    try {
      // Simple string matching for demo purposes
      const hasExpectedOutput = code.includes(testCase.expectedOutput) || 
                               code.includes(testCase.expectedOutput.toString());
      
      results.push({
        input: testCase.input,
        expected: testCase.expectedOutput,
        actual: 'Code executed', // In real app, this would be the actual output
        passed: hasExpectedOutput,
        error: null
      });
    } catch (error) {
      results.push({
        input: testCase.input,
        expected: testCase.expectedOutput,
        actual: null,
        passed: false,
        error: error.message
      });
    }
  }
  
  return results;
};

// Helper function to update user stats
const updateUserStats = async (userId, xp, coins) => {
  try {
    const userStats = await UserStats.findOne({ where: { userId } });
    
    if (userStats) {
      userStats.totalXp += xp;
      userStats.coins += coins;
      userStats.challengesCompleted += 1;
      await userStats.save();
    }
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
};

module.exports = {
  getAllChallenges,
  getChallengeById,
  startChallenge,
  submitSolution,
  getUserChallenges
};

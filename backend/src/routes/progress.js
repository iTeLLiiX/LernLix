const express = require('express');
const { UserProgress } = require('../models/UserProgress.js');
const { Module } = require('../models/Module.js');
const logger = require('../config/logger.js');

const router = express.Router();

// Nutzer-Fortschritt abrufen
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const progress = await UserProgress.findAll({
      where: { userId },
      include: [{ model: Module }]
    });
    res.json(progress);
  } catch (err) {
    logger.error('Fetch progress error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Fortschritt aktualisieren/erstellen
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { moduleId, score, timeSpentMinutes, isCompleted } = req.body;

    const [progress, created] = await UserProgress.findOrCreate({
      where: { userId, moduleId },
      defaults: { userId, moduleId, score, timeSpentMinutes, isCompleted, startedAt: new Date() }
    });

    if (!created) {
      progress.score = score || progress.score;
      progress.timeSpentMinutes = timeSpentMinutes || progress.timeSpentMinutes;
      progress.isCompleted = isCompleted ?? progress.isCompleted;
      if (isCompleted) progress.completedAt = new Date();
      await progress.save();
    }

    res.json(progress);
  } catch (err) {
    logger.error('Update progress error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


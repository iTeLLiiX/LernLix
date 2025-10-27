const logger = require('../config/logger');

const getAllModules = async (req, res) => {
  try {
    const modules = await req.app.get('db').models.LearningModule.findAll({
      where: { isPublished: true, isActive: true },
      order: [['difficulty', 'ASC'], ['createdAt', 'DESC']],
    });

    res.json({
      data: modules,
      count: modules.length,
    });
  } catch (error) {
    logger.error('Get modules error:', error.message);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
};

const getModuleById = async (req, res) => {
  try {
    const module = await req.app.get('db').models.LearningModule.findByPk(req.params.moduleId);

    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    res.json(module);
  } catch (error) {
    logger.error('Get module error:', error.message);
    res.status(500).json({ error: 'Failed to fetch module' });
  }
};

const completeModule = async (req, res) => {
  try {
    const module = await req.app.get('db').models.LearningModule.findByPk(req.params.moduleId);

    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    // Check if user already completed this module
    const existingProgress = await req.app.get('db').models.UserProgress.findOne({
      where: {
        userId: req.user.id,
        moduleId: req.params.moduleId,
      },
    });

    if (existingProgress && existingProgress.status === 'completed') {
      return res.status(400).json({ error: 'Module already completed' });
    }

    // Update or create progress
    if (existingProgress) {
      await existingProgress.update({
        status: 'completed',
        progress: 100,
        completedAt: new Date(),
      });
    } else {
      await req.app.get('db').models.UserProgress.create({
        userId: req.user.id,
        moduleId: req.params.moduleId,
        status: 'completed',
        progress: 100,
        completedAt: new Date(),
      });
    }

    // Update user stats
    const userStats = await req.app.get('db').models.UserStats.findOne({
      where: { userId: req.user.id },
    });

    if (userStats) {
      await userStats.increment('totalXP', { by: module.xpReward });
      await userStats.increment('coins', { by: module.coinReward });
      await userStats.increment('modulesCompleted');
    }

    // Create certificate if module completed
    const certificateNumber = `CERT-${req.user.id.substring(0, 8)}-${module.id.substring(0, 8)}-${Date.now()}`;
    await req.app.get('db').models.Certificate.create({
      userId: req.user.id,
      moduleId: req.params.moduleId,
      certificateNumber,
      issuedAt: new Date(),
    });

    res.json({
      message: 'Module completed successfully',
      rewards: {
        xp: module.xpReward,
        coins: module.coinReward,
      },
      certificateNumber,
    });
  } catch (error) {
    logger.error('Complete module error:', error.message);
    res.status(500).json({ error: 'Failed to complete module' });
  }
};

const startModule = async (req, res) => {
  try {
    const module = await req.app.get('db').models.LearningModule.findByPk(req.params.moduleId);

    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    const [progress, created] = await req.app.get('db').models.UserProgress.findOrCreate({
      where: {
        userId: req.user.id,
        moduleId: req.params.moduleId,
      },
      defaults: {
        userId: req.user.id,
        moduleId: req.params.moduleId,
        status: 'in_progress',
        progress: 0,
      },
    });

    res.json({
      message: created ? 'Module started' : 'Module already started',
      data: progress,
    });
  } catch (error) {
    logger.error('Start module error:', error.message);
    res.status(500).json({ error: 'Failed to start module' });
  }
};

const getUserModuleProgress = async (req, res) => {
  try {
    const userProgress = await req.app.get('db').models.UserProgress.findAll({
      where: { userId: req.user.id },
    });

    res.json({
      data: userProgress,
      count: userProgress.length,
    });
  } catch (error) {
    logger.error('Get user progress error:', error.message);
    res.status(500).json({ error: 'Failed to fetch user progress' });
  }
};

module.exports = {
  getAllModules,
  getModuleById,
  completeModule,
  startModule,
  getUserModuleProgress,
};

const logger = require('../config/logger');

const getQuests = async (req, res) => {
  try {
    const quests = await req.app.get('db').models.Quest.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']],
    });

    res.json({
      data: quests,
      count: quests.length,
    });
  } catch (error) {
    logger.error('Get quests error:', error.message);
    res.status(500).json({ error: 'Failed to fetch quests' });
  }
};

const getUserQuests = async (req, res) => {
  try {
    const userQuests = await req.app.get('db').models.UserQuest.findAll({
      where: { userId: req.user.id },
    });

    res.json({
      data: userQuests,
      count: userQuests.length,
    });
  } catch (error) {
    logger.error('Get user quests error:', error.message);
    res.status(500).json({ error: 'Failed to fetch user quests' });
  }
};

const startQuest = async (req, res) => {
  try {
    const quest = await req.app.get('db').models.Quest.findByPk(req.params.questId);
    if (!quest) {
      return res.status(404).json({ error: 'Quest not found' });
    }

    const [userQuest, created] = await req.app.get('db').models.UserQuest.findOrCreate({
      where: {
        userId: req.user.id,
        questId: req.params.questId,
      },
      defaults: {
        userId: req.user.id,
        questId: req.params.questId,
        status: 'in_progress',
        startedAt: new Date(),
      },
    });

    res.json({
      message: created ? 'Quest started' : 'Quest already started',
      data: userQuest,
    });
  } catch (error) {
    logger.error('Start quest error:', error.message);
    res.status(500).json({ error: 'Failed to start quest' });
  }
};

const completeQuest = async (req, res) => {
  try {
    const userQuest = await req.app.get('db').models.UserQuest.findOne({
      where: {
        userId: req.user.id,
        questId: req.params.questId,
      },
    });

    if (!userQuest) {
      return res.status(404).json({ error: 'Quest progress not found' });
    }

    const quest = await req.app.get('db').models.Quest.findByPk(req.params.questId);

    await userQuest.update({
      status: 'completed',
      progress: 100,
      completedAt: new Date(),
    });

    // Update user stats
    const userStats = await req.app.get('db').models.UserStats.findOne({
      where: { userId: req.user.id },
    });

    if (userStats) {
      await userStats.increment('totalXP', { by: quest.xpReward });
      await userStats.increment('coins', { by: quest.coinReward });
      await userStats.increment('questsCompleted');
    }

    res.json({
      message: 'Quest completed',
      data: userQuest,
      rewards: {
        xp: quest.xpReward,
        coins: quest.coinReward,
      },
    });
  } catch (error) {
    logger.error('Complete quest error:', error.message);
    res.status(500).json({ error: 'Failed to complete quest' });
  }
};

module.exports = {
  getQuests,
  getUserQuests,
  startQuest,
  completeQuest,
};

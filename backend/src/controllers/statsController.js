const logger = require('../config/logger');

const getUserStats = async (req, res) => {
  try {
    let userStats = await req.app.get('db').models.UserStats.findOne({
      where: { userId: req.user.id },
    });

    // Create stats if don't exist
    if (!userStats) {
      userStats = await req.app.get('db').models.UserStats.create({
        userId: req.user.id,
      });
    }

    const user = await req.app.get('db').models.User.findByPk(req.user.id);

    res.json({
      user: user.toJSON(),
      stats: userStats,
    });
  } catch (error) {
    logger.error('Get user stats error:', error.message);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
};

const getUserAchievements = async (req, res) => {
  try {
    const userStats = await req.app.get('db').models.UserStats.findOne({
      where: { userId: req.user.id },
    });

    const allAchievements = await req.app.get('db').models.Achievement.findAll({
      where: { isActive: true },
    });

    // Simple logic to check which achievements are unlocked
    const unlockedAchievements = allAchievements.filter(achievement => {
      const condition = achievement.condition;
      
      if (achievement.type === 'milestone') {
        if (condition.level) return userStats.level >= condition.level;
        if (condition.xp) return userStats.totalXP >= condition.xp;
        if (condition.quests) return userStats.questsCompleted >= condition.quests;
      }
      
      if (achievement.type === 'streak') {
        if (condition.days) return userStats.maxStreak >= condition.days;
      }
      
      return false;
    });

    res.json({
      data: unlockedAchievements,
      count: unlockedAchievements.length,
    });
  } catch (error) {
    logger.error('Get achievements error:', error.message);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const leaderboard = await req.app.get('db').models.UserStats.findAll({
      order: [['totalXP', 'DESC']],
      limit,
      offset,
    });

    const total = await req.app.get('db').models.UserStats.count();

    res.json({
      data: leaderboard,
      total,
      limit,
      offset,
    });
  } catch (error) {
    logger.error('Get leaderboard error:', error.message);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};

const updateStreak = async (req, res) => {
  try {
    let userStats = await req.app.get('db').models.UserStats.findOne({
      where: { userId: req.user.id },
    });

    if (!userStats) {
      userStats = await req.app.get('db').models.UserStats.create({
        userId: req.user.id,
      });
    }

    const today = new Date().toDateString();
    const lastActivity = userStats.lastActivityDate?.toDateString();

    let newStreak = userStats.streak;

    if (lastActivity !== today) {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      
      if (lastActivity === yesterday) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }

      if (newStreak > userStats.maxStreak) {
        await userStats.update({
          streak: newStreak,
          maxStreak: newStreak,
          lastActivityDate: new Date(),
        });
      } else {
        await userStats.update({
          streak: newStreak,
          lastActivityDate: new Date(),
        });
      }
    }

    res.json({
      message: 'Streak updated',
      streak: newStreak,
      maxStreak: userStats.maxStreak,
    });
  } catch (error) {
    logger.error('Update streak error:', error.message);
    res.status(500).json({ error: 'Failed to update streak' });
  }
};

module.exports = {
  getUserStats,
  getUserAchievements,
  getLeaderboard,
  updateStreak,
};

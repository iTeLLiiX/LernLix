const { User, Module, UserProgress, Certificate } = require('../models');
const logger = require('../config/logger');

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const totalUsers = await User.count();
    const totalModules = await Module.count();
    const totalProgress = await UserProgress.count();
    const completedProgress = await UserProgress.count({ where: { completed: true } });
    const totalCertificates = await Certificate.count();

    const completionRate = totalProgress > 0 
      ? Math.round((completedProgress / totalProgress) * 100) 
      : 0;

    const topUsers = await User.findAll({
      attributes: ['id', 'name', 'email', 'points', 'level'],
      order: [['points', 'DESC']],
      limit: 5
    });

    res.json({
      stats: {
        totalUsers,
        totalModules,
        totalProgress,
        completedProgress,
        completionRate,
        totalCertificates,
        topUsers
      }
    });
  } catch (error) {
    logger.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

// Get all users with stats
exports.getAllUsersWithStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'points', 'level', 'isActive', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    // Add progress stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const progressCount = await UserProgress.count({
          where: { userId: user.id }
        });
        const certificateCount = await Certificate.count({
          where: { userId: user.id }
        });
        return {
          ...user.toJSON(),
          coursesStarted: progressCount,
          certificatesEarned: certificateCount
        };
      })
    );

    res.json({ users: usersWithStats });
  } catch (error) {
    logger.error('Get all users with stats error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user detail report
exports.getUserReport = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'role', 'points', 'level', 'isActive', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const progress = await UserProgress.findAll({
      where: { userId },
      include: [{ model: Module, attributes: ['title', 'category', 'difficulty'] }]
    });

    const certificates = await Certificate.findAll({
      where: { userId }
    });

    res.json({
      user: user.toJSON(),
      progress,
      certificates,
      stats: {
        coursesStarted: progress.length,
        coursesCompleted: progress.filter(p => p.completed).length,
        certificatesEarned: certificates.length,
        totalTimeSpent: progress.reduce((sum, p) => sum + p.timeSpent, 0)
      }
    });
  } catch (error) {
    logger.error('Get user report error:', error);
    res.status(500).json({ error: 'Failed to fetch user report' });
  }
};

// Deactivate user
exports.deactivateUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({ isActive: false });

    logger.info(`User deactivated: ${userId}`);

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    logger.error('Deactivate user error:', error);
    res.status(500).json({ error: 'Failed to deactivate user' });
  }
};

// Reactivate user
exports.reactivateUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({ isActive: true });

    logger.info(`User reactivated: ${userId}`);

    res.json({ message: 'User reactivated successfully' });
  } catch (error) {
    logger.error('Reactivate user error:', error);
    res.status(500).json({ error: 'Failed to reactivate user' });
  }
};

// Get module analytics
exports.getModuleAnalytics = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const modules = await Module.findAll();

    const modulesWithStats = await Promise.all(
      modules.map(async (module) => {
        const progress = await UserProgress.findAll({
          where: { moduleId: module.id }
        });
        const avgScore = progress.length > 0
          ? Math.round(progress.reduce((sum, p) => sum + p.score, 0) / progress.length)
          : 0;
        const completionRate = progress.length > 0
          ? Math.round((progress.filter(p => p.completed).length / progress.length) * 100)
          : 0;

        return {
          ...module.toJSON(),
          startedBy: progress.length,
          completedBy: progress.filter(p => p.completed).length,
          averageScore: avgScore,
          completionRate
        };
      })
    );

    res.json({ modules: modulesWithStats });
  } catch (error) {
    logger.error('Get module analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch module analytics' });
  }
};

// Reset user progress
exports.resetUserProgress = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete all progress for the user
    await UserProgress.destroy({ where: { userId } });

    // Reset points and level
    await user.update({ points: 0, level: 1 });

    logger.info(`User progress reset: ${userId}`);

    res.json({ message: 'User progress reset successfully' });
  } catch (error) {
    logger.error('Reset user progress error:', error);
    res.status(500).json({ error: 'Failed to reset user progress' });
  }
};

// Get system logs (simplified)
exports.getSystemInfo = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { isActive: true } });
    const totalModules = await Module.count();
    const totalProgress = await UserProgress.count();
    const totalCertificates = await Certificate.count();

    res.json({
      systemInfo: {
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: {
          totalUsers,
          activeUsers,
          totalModules,
          totalProgress,
          totalCertificates
        }
      }
    });
  } catch (error) {
    logger.error('Get system info error:', error);
    res.status(500).json({ error: 'Failed to fetch system info' });
  }
};

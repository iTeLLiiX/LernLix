const logger = require('../config/logger');

const getSkillTree = async (req, res) => {
  try {
    const skills = await req.app.get('db').models.Skill.findAll({
      where: { isActive: true },
      order: [['tier', 'ASC'], ['category', 'ASC']],
    });

    const userStats = await req.app.get('db').models.UserStats.findOne({
      where: { userId: req.user.id },
    });

    const unlockedSkills = userStats?.skillsUnlocked || [];

    const skillsWithStatus = skills.map(skill => ({
      ...skill.dataValues,
      unlocked: unlockedSkills.includes(skill.id),
    }));

    res.json({
      data: skillsWithStatus,
      userLevel: userStats?.level || 1,
      userXP: userStats?.totalXP || 0,
    });
  } catch (error) {
    logger.error('Get skills error:', error.message);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
};

const getSkillById = async (req, res) => {
  try {
    const skill = await req.app.get('db').models.Skill.findByPk(req.params.skillId);

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    const userStats = await req.app.get('db').models.UserStats.findOne({
      where: { userId: req.user.id },
    });

    const unlocked = userStats?.skillsUnlocked?.includes(skill.id) || false;

    res.json({
      ...skill.dataValues,
      unlocked,
      userXP: userStats?.totalXP || 0,
    });
  } catch (error) {
    logger.error('Get skill error:', error.message);
    res.status(500).json({ error: 'Failed to fetch skill' });
  }
};

const unlockSkill = async (req, res) => {
  try {
    const skill = await req.app.get('db').models.Skill.findByPk(req.params.skillId);

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    const userStats = await req.app.get('db').models.UserStats.findOne({
      where: { userId: req.user.id },
    });

    if (!userStats) {
      return res.status(404).json({ error: 'User stats not found' });
    }

    // Check if already unlocked
    if (userStats.skillsUnlocked.includes(skill.id)) {
      return res.status(400).json({ error: 'Skill already unlocked' });
    }

    // Check if user has enough XP
    if (userStats.totalXP < skill.requiredXP) {
      return res.status(400).json({
        error: 'Not enough XP',
        required: skill.requiredXP,
        current: userStats.totalXP,
      });
    }

    // Update user stats
    const updatedSkills = [...userStats.skillsUnlocked, skill.id];
    await userStats.update({
      skillsUnlocked: updatedSkills,
    });

    res.json({
      message: 'Skill unlocked',
      skill: skill.dataValues,
      userStats: {
        level: userStats.level,
        totalXP: userStats.totalXP,
        skillsUnlocked: updatedSkills.length,
      },
    });
  } catch (error) {
    logger.error('Unlock skill error:', error.message);
    res.status(500).json({ error: 'Failed to unlock skill' });
  }
};

module.exports = {
  getSkillTree,
  getSkillById,
  unlockSkill,
};

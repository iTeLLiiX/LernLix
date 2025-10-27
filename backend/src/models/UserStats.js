const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserStats = sequelize.define('UserStats', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: { min: 1, max: 100 },
    },
    totalXP: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { min: 0 },
    },
    currentXP: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { min: 0 },
    },
    coins: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { min: 0 },
    },
    streak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { min: 0 },
    },
    maxStreak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { min: 0 },
    },
    lastActivityDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    questsCompleted: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { min: 0 },
    },
    modulesCompleted: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { min: 0 },
    },
    skillsUnlocked: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  }, {
    timestamps: true,
  });

  return UserStats;
};

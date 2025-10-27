const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Quest = sequelize.define('Quest', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { len: [3, 255] },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM('daily', 'weekly', 'challenge'),
      defaultValue: 'daily',
    },
    difficulty: {
      type: DataTypes.ENUM('easy', 'medium', 'hard'),
      defaultValue: 'medium',
    },
    xpReward: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
      validate: { min: 0 },
    },
    coinReward: {
      type: DataTypes.INTEGER,
      defaultValue: 50,
      validate: { min: 0 },
    },
    requirements: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    timestamps: true,
  });

  return Quest;
};

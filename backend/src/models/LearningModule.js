const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const LearningModule = sequelize.define('LearningModule', {
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
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    difficulty: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
      defaultValue: 'beginner',
    },
    duration: {
      type: DataTypes.INTEGER,
      defaultValue: 60,
      validate: { min: 1 },
    },
    content: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    lessons: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    challenges: {
      type: DataTypes.JSON,
      defaultValue: [],
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
    certificateTemplate: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    timestamps: true,
  });

  return LearningModule;
};

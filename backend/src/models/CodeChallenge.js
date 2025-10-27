const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CodeChallenge = sequelize.define('CodeChallenge', {
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
      allowNull: false,
    },
    difficulty: {
      type: DataTypes.ENUM('easy', 'medium', 'hard', 'expert'),
      defaultValue: 'easy',
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'javascript',
    },
    starterCode: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    solution: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    testCases: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    hints: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    xpReward: {
      type: DataTypes.INTEGER,
      defaultValue: 50,
      validate: { min: 0 },
    },
    coinReward: {
      type: DataTypes.INTEGER,
      defaultValue: 25,
      validate: { min: 0 },
    },
    timeLimit: {
      type: DataTypes.INTEGER,
      defaultValue: 30, // minutes
      validate: { min: 1 },
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

  return CodeChallenge;
};

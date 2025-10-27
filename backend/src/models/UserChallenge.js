const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserChallenge = sequelize.define('UserChallenge', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    challengeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'CodeChallenges',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('not_started', 'in_progress', 'completed', 'failed'),
      defaultValue: 'not_started',
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    testResults: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
    attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    timeSpent: {
      type: DataTypes.INTEGER, // seconds
      defaultValue: 0,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    xpEarned: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    coinsEarned: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    timestamps: true,
  });

  return UserChallenge;
};

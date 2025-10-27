const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserProgress = sequelize.define('UserProgress', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    moduleId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { min: 0, max: 100 },
    },
    status: {
      type: DataTypes.ENUM('not_started', 'in_progress', 'completed'),
      defaultValue: 'not_started',
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    timestamps: true,
    indexes: [
      { fields: ['userId', 'moduleId'], unique: true },
    ],
  });

  return UserProgress;
};

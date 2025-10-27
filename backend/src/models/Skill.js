const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Skill = sequelize.define('Skill', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { len: [3, 255] },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    icon: {
      type: DataTypes.STRING(255),
      defaultValue: '⭐',
    },
    tier: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: { min: 1, max: 10 },
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    requiredXP: {
      type: DataTypes.INTEGER,
      defaultValue: 1000,
      validate: { min: 0 },
    },
    prerequisites: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    timestamps: true,
  });

  return Skill;
};

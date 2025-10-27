const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Module = sequelize.define('Module', {
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
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    timestamps: true,
  });

  return Module;
};

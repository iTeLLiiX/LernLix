const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Certificate = sequelize.define('Certificate', {
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
    certificateNumber: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    issuedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    timestamps: true,
  });

  return Certificate;
};

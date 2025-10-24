import { DataTypes } from 'sequelize';
import bcryptjs from 'bcryptjs';
import { db } from '../config/database.js';

export const User = db.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING(255), unique: true, allowNull: false },
  password: { type: DataTypes.STRING(255), allowNull: false },
  firstName: { type: DataTypes.STRING(100), field: 'first_name' },
  lastName: { type: DataTypes.STRING(100), field: 'last_name' },
  registrationDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'registration_date' },
  lastLogin: { type: DataTypes.DATE, field: 'last_login' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
  role: { type: DataTypes.ENUM('student', 'instructor', 'admin'), defaultValue: 'student' }
}, { timestamps: false, tableName: 'users' });

User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(user.password, salt);
  }
});

User.prototype.comparePassword = async function(password) {
  return await bcryptjs.compare(password, this.password);
};

User.prototype.getPublicData = function() {
  return {
    id: this.id,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    role: this.role
  };
};

export default User;

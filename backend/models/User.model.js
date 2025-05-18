const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  birthday: {
    type: DataTypes.DATE,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'banned'),
    defaultValue: 'active'
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  verificationToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetTokenExpiry: {
    type: DataTypes.DATE,
    allowNull: true
  },// If you had this in User.model.js:
otpCode: {
  type: DataTypes.STRING,
  allowNull: true,
  // unique: true, // <-- REMOVE THIS if present
},
otpExpiry: {
  type: DataTypes.DATE,
  allowNull: true,
}
}, {
  timestamps: true
});

module.exports = User;

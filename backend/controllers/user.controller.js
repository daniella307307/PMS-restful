const { Op } = require("sequelize");
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerUserSchema } = require("../schema/user.schema");
const generateToken = require("../utils/jwt.util");
const sendEmail =require("../utils/emailVerification");
require('dotenv').config();
// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Find user by email
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken(user);

    // Omit password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      data: userResponse,
      token,
      message:"login successful."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    // Only admin can access all users
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res) => {
  try {
    // Only admin can access any user profile
    if (req.user.role !== "admin" && req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = registerUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map(d => d.message),
      });
    }

    const { username, email, password, birthday, role: reqRole } = value;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { username }] },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email or username already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      birthday,
      role: reqRole || "user", // Use validated role, or default if not in schema/value
      emailVerified: false, // Explicitly set to false on registration
    });

    // Generate token
    const token = generateToken(user);

    // Omit password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    // Optionally, trigger sending a verification email here, or let user request it
    // await exports.sendVerificationEmail({ body: { email: user.email } }, res, true); // Internal call, handle response differently

    res.status(201).json({
      success: true,
      data: userResponse,
      token,
      message: "User registered successfully. Please verify your email.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error registering user: " + error.message,
    });
  }
};

// ... (loginUser, getMe, getUsers, getUser - keep as is) ...

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res) => {
  try {
    // Ensure the ID is properly parsed as an integer
    const targetUserId = parseInt(req.params.id);
    
    // Check if the ID is valid
    if (isNaN(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Rest of your existing code...
    const loggedInUserId = parseInt(req.user.id);
    const loggedInUserRole = req.user.role;

    // Authorization check
    if (loggedInUserRole !== "admin" && loggedInUserId !== targetUserId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this user",
      });
    }

    // Continue with your existing logic...
  } catch (error) {
    console.error("Update User Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "An unexpected error occurred during user update",
    });
  }
};

// ... (deleteUser, updatePassword, forgotPassword, resetPassword - keep as is) ...

// @desc    Request email verification OTP
// @route   POST /api/users/send-verification-email
// @access  Public (or Private if only logged-in users can request for their own email)
exports.sendVerificationEmail = async (req, res, internalCall = false) => {
  try {
    const { email } = req.body;
    if (!email) {
      if (internalCall) throw new Error("Email is required for internal call to sendVerificationEmail");
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      if (internalCall) throw new Error(`User not found with email ${email} for internal call`);
      return res.status(404).json({ success: false, message: "User not found with this email" });
    }

    if (user.emailVerified) {
      if (internalCall) return; // Silently succeed if already verified during an internal call
      return res.status(400).json({ success: false, message: "Email is already verified" });
    }

    // Generate OTP (6 digits)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    user.otpCode = otpCode;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send email
    const emailSubject = "Verify Your Email Address";
    const emailHtml = `<p>Hello ${user.username},</p>
                       <p>Your OTP for email verification is: <strong>${otpCode}</strong></p>
                       <p>This code will expire in 10 minutes.</p>
                       <p>If you did not request this, please ignore this email.</p>`;

    await sendEmail(user.email, emailSubject, emailHtml); 

    if (internalCall) return { success: true, message: "Verification OTP sent." }; // For internal calls

    res.status(200).json({
      success: true,
      message: "Verification OTP sent to your email. Please check your inbox.",
    });

  } catch (error) {
    console.error("Send Verification Email Error:", error);
    if (internalCall) throw error; // Re-throw for internal call error handling
    res.status(500).json({
      success: false,
      message: error.message || "Failed to send verification email",
    });
  }
};


// @desc    Verify email with OTP
// @route   POST /api/users/verify-email
// @access  Public
exports.verifyEmailWithOTP = async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP code are required",
      });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if already verified
    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // Check OTP match and expiry
    if (user.otpCode !== otpCode) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP code",
      });
    }

    if (!user.otpExpiry || user.otpExpiry < new Date()) { // Added !user.otpExpiry check
      return res.status(400).json({
        success: false,
        message: "OTP code has expired or was never set. Please request a new one.",
      });
    }

    // Mark email as verified and clear OTP fields
    user.emailVerified = true;
    user.otpCode = null;
    user.otpExpiry = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error verifying email: " + error.message,
    });
  }
};
// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    // Only admin can delete users
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete users",
      });
    }

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update password
// @route   PUT /api/users/update-password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Check if passwords are provided
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both current and new passwords are required",
      });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update password",
    });
  }
};

// @desc    Forgot password - generate reset token
// @route   POST /api/users/forgot-password
// @access  Public
// Enhanced forgotPassword controller
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account exists with this email, a reset link has been sent",
      });
    }

    // Generate secure reset token using crypto
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    await user.update({
      resetToken,
      resetTokenExpiry,
    });

    // Send email with reset link
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const emailSubject = "Password Reset Request";
    const emailHtml = `
      <p>You requested a password reset for your account.</p>
      <p>Click this link to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    await sendEmail(user.email, emailSubject, emailHtml);

    res.status(200).json({
      success: true,
      message: "If an account exists with this email, a reset link has been sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing password reset request",
    });
  }
};

// Enhanced resetPassword controller
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const user = await User.findOne({
      where: {
        resetToken,
        resetTokenExpiry: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });

    // Send confirmation email
    const emailSubject = "Password Changed Successfully";
    const emailHtml = `
      <p>Your password has been successfully changed.</p>
      <p>If you didn't make this change, please contact us immediately.</p>
    `;

    await sendEmail(user.email, emailSubject, emailHtml);

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Error resetting password",
    });
  }
};

// @desc    Reset password
// @route   PUT /api/users/reset-password/:resetToken
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      where: {
        resetToken,
        resetTokenExpiry: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// In user.controller.js


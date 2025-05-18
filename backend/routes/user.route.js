// ../routes/user.routes.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updatePassword,
  forgotPassword,
  resetPassword,
  sendVerificationEmail, 
  verifyEmailWithOTP
} = require("../controllers/user.controller");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);
router.post("/send-verification-email", sendVerificationEmail); // New route
router.post("/verify-email", verifyEmailWithOTP); // This was already there, just ensuring it's clear

router.use(protect); // Middleware applied to routes below

router.get("/me", getMe);
router.put("/update-password", updatePassword);
router.put("/update/:id", updateUser); // User can update self, admin can update any

// Admin only routes
router.use(authorize("admin"));
router.get("/", getUsers);
router.get("/:id", getUser); // Admin can get any user by ID
router.delete("/:id", deleteUser);

module.exports = router;
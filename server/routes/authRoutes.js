// routes/authRoutes.js

const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");
const loginController = require("../controllers/loginController");
const forgotPasswordController = require("../controllers/forgotPasswordController");
const verifyToken = require("../middleware/authenticateToken");
const otpController = require("../controllers/otpController");

router.get("/verify-token", verifyToken);

// Define routes for user registration and login
router.post("/register", registerController.register);
router.post("/login", loginController.login);

// sent OTP to user email and verify OTP
router.post("/user/verify-otp", otpController.verifyOTP);

// Define routes for initiating password reset, resetting password, and verifying OTP
router.post("/forgot-password", forgotPasswordController.forgotPassword);
router.post("/reset-pass-verify-otp", forgotPasswordController.resetVerifyOTP);
router.post("/reset-password", forgotPasswordController.resetPassword);

module.exports = router;

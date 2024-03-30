// routes/authRoutes.js

const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");
const loginController = require("../controllers/loginController");
const forgotPasswordController = require("../controllers/forgotPasswordController");
const { verifyOTP } = require("../controllers/otpController");
const verifyToken = require("../middleware/authenticateToken");
const userController = require("../controllers/userController");

// Define routes for user registration and login
router.post("/register", registerController.register);
router.post("/login", loginController.login);

// sent OTP
router.post("/user/verify-otp", verifyOTP);

// Define routes for initiating password reset, resetting password, and verifying OTP
router.post("/forgot-password", forgotPasswordController.forgotPassword);
router.post("/reset-pass-verify-otp", forgotPasswordController.resetVerifyOTP);
router.post("/reset-password", forgotPasswordController.resetPassword);


router.get("/user-data/:id", verifyToken, userController.getUser);
router.put("/user/:id",verifyToken, userController.updateUser);
router.delete("/user/:id",verifyToken, userController.deleteUser);

module.exports = router;

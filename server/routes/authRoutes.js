// routes/authRoutes.js

const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");
const loginController = require("../controllers/loginController");
const forgotPasswordController = require("../controllers/forgotPasswordController");
const userController = require("../controllers/userController");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");
const verifyToken = require("../middleware/authenticateToken");
const otpController = require("../controllers/otpController");

router.get(
  "/verify-token",
  verifyToken,
);

// Define routes for user registration and login
router.post("/register", registerController.register);
router.post("/login", loginController.login);

// sent OTP
router.post("/user/verify-otp", otpController.verifyOTP);

// Define routes for initiating password reset, resetting password, and verifying OTP
router.post("/forgot-password", forgotPasswordController.forgotPassword);
router.post("/reset-pass-verify-otp", forgotPasswordController.resetVerifyOTP);
router.post("/reset-password", forgotPasswordController.resetPassword);

/** user routes ====================================== */
// update user
router.put(
  "/user/update/:id",
  verifyToken,
  checkRoleMiddleware(["user", "admin"]),
  userController.updateUser
);

/** user and admin routes ====================================== */
// get user data
router.get(
  "/user-data/:id",
  verifyToken,
  checkRoleMiddleware(["user", "admin"]),
  userController.getUser
);

/**  admin routes ====================================== */
// get user count
router.get(
  "/users",
  verifyToken,
  checkRoleMiddleware("admin"),
  userController.getUsersCount
);
// get all user
router.get(
  "/users/all",
  verifyToken,
  checkRoleMiddleware("admin"),
  userController.getAllUsers
);
// delete user
router.delete(
  "/delete/user/:id",
  verifyToken,
  checkRoleMiddleware("admin"),
  userController.deleteUser
);

module.exports = router;

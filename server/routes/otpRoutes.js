// routes/emailRoutes.js
const express = require("express");
const router = express.Router();
const { sendOTP } = require("../controllers/otpController");

// Define routes
router.post("/user/verify-otp", sendOTP); // Corrected to use the verifyOTP method

module.exports = router;

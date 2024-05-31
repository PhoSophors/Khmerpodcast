const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const otpController = require("./otpController");

const registerController = {};

registerController.register = async (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;

  try {
    // Check if all required fields are provided
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate username length
    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({ error: "Username must be between 3 and 20 characters long" });
    }

    // Validate password length
    if (password.length < 6 || password.length > 20) {
      return res.status(400).json({ error: "Password must be between 6 and 20 characters long" });
    }

    // Check if password contains both text and numbers
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ error: "Password must contain both text and numbers" });
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Check if email is already registered
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.emailVerified) {
        return res.status(400).json({ error: "Email is already registered and verified" });
      } else {
        // Resend OTP if email is not verified
        await otpController.sendOTP(existingUser.email);
        return res.status(200).json({ message: "OTP has been sent to your email. Please verify your account." });
      }
    }

    // Generate OTP and hash password
    const otp = Math.floor(100000 + Math.random() * 900000);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpires: Date.now() + 1 * 60 * 1000, // OTP valid for 1 minute
    });

    await newUser.save();
    await otpController.sendOTP(email, otp);

    return res.status(200).json({ message: "OTP has been sent to your email. Please verify your account." });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "An error occurred while registering user" });
  }
};

module.exports = registerController;

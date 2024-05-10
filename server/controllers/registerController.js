const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const otpController = require("./otpController");

const registerController = {};

registerController.register = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Check if all required fields are provided
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Add more specific checks for username length
    if (username.length < 3 || username.length > 20) {
      return res
        .status(400)
        .json({ error: "Username must be between 3 and 20 characters long" });
    }

    // Add additional checks for password length and match
    if (password.length < 6 || password.length > 20) {
      return res
        .status(400)
        .json({ error: "Password must be between 6 and 20 characters long" });
    }

    // Check if password contains both text and numbers
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/;
    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .json({ error: "Password must contain both text and numbers" });
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Check if the email is already registered
    let existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.emailVerified) {
        // Return error or handle the case where the user is already verified
      } else {
        // Update the OTP and extend its validity
        existingUser.otp = otp;
        existingUser.otpExpires = Date.now() + 20 * 60 * 1000; // OTP valid for 20 minutes

        try {
          // Save the existing user sequentially
          await existingUser.save();

          // Send OTP
          const emailResult = await otpController.sendOTP(email, otp); // Send OTP to email
          if (!emailResult) {
            throw new Error("Error sending OTP");
          }

          return res.status(200).json({
            message:
              "OTP has been sent to your email. Please verify your account.",
          });
        } catch (error) {
          console.error("Error updating existing user:", error);
          return res
            .status(500)
            .json({ error: "Error updating existing user" });
        }
      }
    }

    // Send OTP
    const emailResult = await otpController.sendOTP(email, otp); // Send OTP to email

    if (!emailResult) {
      throw new Error("Error sending OTP");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    res.status(200).json({
      message:
        "Registration successful. Please check your email " +
        email +
        " to activate your account",
      id: savedUser._id,
    });
  } catch (err) {
    console.error("Error registering user:", err);
    return res
      .status(500)
      .json({ error: err.message || "Error registering user" });
  }
};

module.exports = registerController;

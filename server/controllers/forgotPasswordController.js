const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const ResetPasswordOTP = require("../models/resetPasswordOTPModel");
const mongoose = require("mongoose");

const forgotPasswordController = {
  forgotPassword: async (req, res) => {
    const { email } = req.body;

    try {
      // Find user by email
      const user = await User.findOne({ email });

      // If user not found, return error
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Generate a random OTP
      const otp = Math.floor(100000 + Math.random() * 900000);

      // Find existing OTP document for the user's email, if any
      let resetPasswordOTP = await ResetPasswordOTP.findOne({ email });

      // If an OTP document already exists, update it with the new OTP and expiration time
      if (resetPasswordOTP) {
        resetPasswordOTP.otp = otp;
        resetPasswordOTP.expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
      } else {
        // Otherwise, create a new OTP document
        resetPasswordOTP = new ResetPasswordOTP({
          email,
          otp,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP expires in 10 minutes
        });
      }

      // Save or update the OTP document
      await resetPasswordOTP.save();

      // Send OTP via email
      await sendOTPByEmail(email, otp);

      return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred while sending OTP" });
    }
  },

  resetVerifyOTP: async (req, res) => {
    const { email, otp } = req.body;

    try {
      // Find resetPasswordOTP document by email and OTP
      const resetPasswordOTP = await ResetPasswordOTP.findOne({ email, otp });

      // If resetPasswordOTP not found or OTP is expired, return error
      if (!resetPasswordOTP || resetPasswordOTP.expiresAt < new Date()) {
        return res.status(400).json({ error: "Invalid or expired OTP" });
      }

      // Delete the OTP document
      await ResetPasswordOTP.deleteOne({ _id: resetPasswordOTP._id });

      return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
      console.error("Error details:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while verifying OTP" });
    }
  },

  resetPassword: async (req, res) => {
    const { email, newPassword } = req.body;

    try {
      // Find user by email
      const user = await User.findOne({ email });

      // If user not found, return error
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update user's password
      user.password = await bcrypt.hash(newPassword, 10);

      // Save the updated user document
      await user.save();

      return res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred while resetting the password" });
    }
  },
};

// Function to send OTP via email
const sendOTPByEmail = async (email, otp) => {
  try {
    // Create a transport object for sending emails
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Define email options
    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "OTP for your request",
      html: `
        <div style="text-align: center; padding: 20px; color: #444;">
          <h1 style="font-size: 24px; color: #444;">Your One-Time Password</h1>
          <p style="font-size: 18px; color: #666;">
            Please use the following OTP to continue your reset password:
          </p>
          <div style="font-size: 32px; background-color: #f9f9f9; padding: 10px; border-radius: 5px; color: #333;">
            ${otp}
          </div>
          <p style="font-size: 18px; color: #666;">
            This OTP is valid for 1 minute. Do not share it with anyone.
          </p>
        </div>
    `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending OTP via email:", error);
    throw error;
  }
};

module.exports = forgotPasswordController;

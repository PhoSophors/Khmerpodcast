const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const ResetPasswordOTP = require("../models/resetPasswordOTPModel");

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
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      // Handle case where user is not found
      console.error("User not found for email:", email);
      return false;
    }

    // Extract the username from the user object
    const username = user.username;

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
          <img src="https://lh3.googleusercontent.com/pw/AP1GczNHeRF3ySUSmRgVwGp39OkQuuvvmO_jfbfxumroWnlT9o0mnvsYJISH1zT9QP5qtXWr9UBGGq5ghJ3_fr3zyw7sENTgwFTch9qZkuLMCYIhJdO5K54VHtnRWfrS_2Gb_0Ou8DFZDzffisTjj1U-42f1H7_6DhBnfnmbnDNahfDVdmjCmcGCF-CP073PNRRW0dgbGtDkPD_a8ZelfW8B-0sL5fr0rMaBY4Qm4uAkXOotapbVo_ypNAparwR5isHI2N0muqaIgTolDKEnZJ4V0_AaOKh4NDhDWaGAMx4ypwAOrgiEzCaF9reN6VUnV5qN0POzFN476PTF5QmBou0rKSRhGPUbFG4FNqpxABGkxvU1vlrgPe1729RSW23BseeRSIf0lzS4oYNQ-lxuZNOW7iNZc59MiXAyMalPPhdMQXQhXvZHPI-3o1qzTNAEL_JbN0BNYQXgE9KwB0rAYqjkrB0ICp1YXWKh_0_yre_pnjnLfPnInxWAJVR6aYcjhMDI7g76UfJSMZSDIiuk2GcmpmLEBmRBJizOIM6dp-VkNMS9L_wx-Jl-2QQLynGRFkTJRtNNQ_Zk6T1QSTpUjKgG9OY8my4YUnxZLhK10gZ6MZMe61jmnyryBL8fHfNEHlOHIIz3NI9NchYIyETuthUWs1PbhNCbFZFOARSP8IV669glj7UBdhWfvaPT6REd9aDzJCUUZAIRjB96g67nIBfE01zWVRvrLkJfVm6NrD0paUYNrZWwP7IlDJuOcDWeAWC2stkmb-FKtuikrvkjR_hv6OgIjmwfYeE53EqaM2qbi-Cx33YOqe-9c2pohOCdpW-wsOt7LKp5puqN7IuH94uqTJobnvNiBGkXkFbM1vwlr1swKM1CWyXZqsvdylC2TXKQMKS_CumgnPS3aIDb_jZfDnGgamO_7UAhzinjGAat9lRc-amO6HLtuFku5g9et1Z2Bim8qrpNJR1Fi9a-9yyP4Qgn1GDpFT4=w500-h500-s-no-gm?authuser=1" 
            alt="Your Logo" style="max-width: 100px;">
            <h1 style="font-size: 24px; color: #444;">Hello <span style="text-transform: capitalize;">${username}! 👏</span></h1>
          <p style="font-size: 14px; color: #666;">
            You are receiving this message because you have requested to reset your password of Khmer Podcast Account      
          </p>
          <p style="font-size: 14px; color: #666;">
          Use the following one-time password(OTP).
          </p>
          <div style="font-size: 32px; background-color: #f9f9f9; padding: 10px; border-radius: 5px; color: #333;">
            ${otp}
          </div>
          <p style="font-size: 14px; color: #666;">
            This OTP is valid for 1 minute. Do not share it with anyone.
          </p>
          <p style="font-size: 16px; color: #888; margin-top: 20px;">
          &#169;khmerpodcast.vercel.app
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

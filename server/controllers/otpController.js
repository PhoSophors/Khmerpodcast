const nodemailer = require("nodemailer");
const EmailOTP = require("../models/otpModel");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const otpController = {};

otpController.sendOTP = async (email) => {
  try {
    // Check if an OTP already exists for the given email
    const existingOTP = await EmailOTP.findOne({ email });

    // If an OTP exists, delete it
    if (existingOTP) {
      await EmailOTP.deleteOne({ email });
    }

    // Generate a new OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    const emailOTP = new EmailOTP({
      email,
      otp,
      expiresAt: new Date(Date.now() + 1 * 60 * 1000),
      count: 60,
    });

    await emailOTP.save();

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      // Handle case where user is not found
      console.error("User not found for email:", email);
      return false;
    }

    // Extract the username from the user object
    const username = user.username;

    // Step 2: Create a transport object
    const transporter = nodemailer.createTransport({
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

    // Step 3: Define the email options
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "OTP for your request",
      html: `
        <div style="text-align: center; padding: 20px; color: #444;">
          <img src="https://lh3.googleusercontent.com/pw/AP1GczNHeRF3ySUSmRgVwGp39OkQuuvvmO_jfbfxumroWnlT9o0mnvsYJISH1zT9QP5qtXWr9UBGGq5ghJ3_fr3zyw7sENTgwFTch9qZkuLMCYIhJdO5K54VHtnRWfrS_2Gb_0Ou8DFZDzffisTjj1U-42f1H7_6DhBnfnmbnDNahfDVdmjCmcGCF-CP073PNRRW0dgbGtDkPD_a8ZelfW8B-0sL5fr0rMaBY4Qm4uAkXOotapbVo_ypNAparwR5isHI2N0muqaIgTolDKEnZJ4V0_AaOKh4NDhDWaGAMx4ypwAOrgiEzCaF9reN6VUnV5qN0POzFN476PTF5QmBou0rKSRhGPUbFG4FNqpxABGkxvU1vlrgPe1729RSW23BseeRSIf0lzS4oYNQ-lxuZNOW7iNZc59MiXAyMalPPhdMQXQhXvZHPI-3o1qzTNAEL_JbN0BNYQXgE9KwB0rAYqjkrB0ICp1YXWKh_0_yre_pnjnLfPnInxWAJVR6aYcjhMDI7g76UfJSMZSDIiuk2GcmpmLEBmRBJizOIM6dp-VkNMS9L_wx-Jl-2QQLynGRFkTJRtNNQ_Zk6T1QSTpUjKgG9OY8my4YUnxZLhK10gZ6MZMe61jmnyryBL8fHfNEHlOHIIz3NI9NchYIyETuthUWs1PbhNCbFZFOARSP8IV669glj7UBdhWfvaPT6REd9aDzJCUUZAIRjB96g67nIBfE01zWVRvrLkJfVm6NrD0paUYNrZWwP7IlDJuOcDWeAWC2stkmb-FKtuikrvkjR_hv6OgIjmwfYeE53EqaM2qbi-Cx33YOqe-9c2pohOCdpW-wsOt7LKp5puqN7IuH94uqTJobnvNiBGkXkFbM1vwlr1swKM1CWyXZqsvdylC2TXKQMKS_CumgnPS3aIDb_jZfDnGgamO_7UAhzinjGAat9lRc-amO6HLtuFku5g9et1Z2Bim8qrpNJR1Fi9a-9yyP4Qgn1GDpFT4=w500-h500-s-no-gm?authuser=1" 
            alt="Your Logo" style="max-width: 100px;">
            <h1 style="font-size: 24px; color: #444;">Hello <span style="text-transform: capitalize;">${username}! 👏</span></h1>
          <p style="font-size: 14px; color: #666;">
            Please use the following OTP to complete your authentication process to comtinue KhmerPodcast Website:
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

    // Step 4: Send the email
    await transporter.sendMail(mailOptions);

    return true;
  } catch (err) {
    console.error("Error sending OTP:", err);
    throw err;
  }
};

otpController.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find the emailOTP document by email
    const emailOTP = await EmailOTP.findOne({ email });

    if (!emailOTP) {
      return res.status(400).json({ error: "OTP not found" });
    }

    // Check if the OTP has expired
    if (emailOTP.expiresAt < new Date()) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    // Check if the provided OTP matches the OTP stored in the document
    if (emailOTP.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // If the OTP is valid, delete it from the database and continue with the verification process
    await EmailOTP.deleteOne({ email });

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Change the emailVerified status to true
    user.emailVerified = true;

    // Save the user
    await user.save();

    // Sign the payload and create a JWT token
    const payload = {
      id: user._id,
      email: user.email,
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    // Save the authToken to the user
    user.authToken = token;
    await user.save(); // Save the user with the authToken

    // Set the JWT token in an HTTPOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
    });

    // If the OTPs match and the OTP has not expired, the verification is successful
    return res.status(200).json({
      message: "OTP verified successfully",
      authToken: token, 
      id: user._id, 
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while verifying the OTP" });
  }
};

module.exports = otpController;

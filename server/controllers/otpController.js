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
          <h1 style="font-size: 24px; color: #444;">Hi ${user.username}</h1>
          <p style="font-size: 18px; color: #666;">
            Please use the following OTP to complete your authentication process:
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

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Create a SHA-256 hash of the authToken
    const hash = crypto.createHash("sha256");
    hash.update(token);
    const hashedAuthToken = hash.digest("hex");

    // Save the authToken to the user
    user.authToken = hashedAuthToken;

    await user.save();

    // Set the JWT token in an HTTPOnly cookie
    res.cookie("token", hashedAuthToken, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // If the OTPs match and the OTP has not expired, the verification is successful
    return res.status(200).json({
      message: "OTP verified successfully",
      authToken: token,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while verifying the OTP" });
  }
};

module.exports = otpController;

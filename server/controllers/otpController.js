const nodemailer = require("nodemailer");
const EmailOTP = require("../models/otpModel");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const otpController = {};

otpController.sendOTP = async (email, otp) => {
  try {
    // Step 2: Create a transport object
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

    // Step 3: Define the email options
    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "OTP for your request",
      html: `
        <div style="text-align: center; padding: 20px; color: #444;">
          <h1 style="font-size: 24px; color: #444;">Your One-Time Password</h1>
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

    // Step 5: Save the OTP to the database with a 1-minute expiry and count
    const emailOTP = new EmailOTP({
      // userId: new mongoose.Types.ObjectId(),
      email,
      otp,
      expiresAt: new Date(Date.now() + 1 * 60 * 1000),
      count: 60,
    });

    await emailOTP.save();

    // Start a countdown timer to decrement the count every second
    const timer = setInterval(async () => {
      emailOTP.count--;
      await emailOTP.save();

      // If the count reaches 0, clear the timer
      if (emailOTP.count === 0) {
        clearInterval(timer);
        emailOTP.expired = true;
        await emailOTP.save();
      }
    }, 1000);

    return true; // Return true to indicate OTP sent successfully
  } catch (err) {
    console.error("Error sending OTP:", err);
    throw err;
  }
};

otpController.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find the OTP document
    const emailOTP = await EmailOTP.findOne({ email });
    if (!emailOTP) {
      return res.status(404).json({ error: "OTP not found" });
    }

    // Check if the OTP has expired
    const currentTime = new Date();
    if (currentTime > emailOTP.expiry) {
      return res.status(401).json({ error: "OTP has expired" });
    }

    // Check if the provided OTP matches the OTP stored in the document
    if (emailOTP.otp !== otp) {
      return res.status(401).json({ error: "Invalid OTP" });
    }

    // Find the user and change the emailVerified status to true
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.emailVerified = true;

    // Sign the payload and create a JWT token
    const payload = {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Save the authToken to the user
    user.authToken = token;

    const savedUser = await user.save();
    if (!savedUser) {
      return res.status(500).json({ error: "Error saving user" });
    }

    // Set the JWT token in an HTTPOnly cookie
    res.cookie("token", token, {
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

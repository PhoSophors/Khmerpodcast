const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const emailOTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60, // Automatically delete documents after 1 minutes
  },
});

const EmailOTP = mongoose.model("EmailOTP", emailOTPSchema);

module.exports = EmailOTP;

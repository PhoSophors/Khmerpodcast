const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resetPasswordOTPModel = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  passwordVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ResetPasswordOTP", resetPasswordOTPModel);

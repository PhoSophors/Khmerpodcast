const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const emailOTPSchema = new mongoose.Schema({
  // userId: {
  //   type: Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true,
  // },
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
    expires: 600, // Automatically delete documents after 10 minutes
  },
});

const EmailOTP = mongoose.model("EmailOTP", emailOTPSchema);

module.exports = EmailOTP;

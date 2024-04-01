const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: false,
  },
  password: {
    type: String,
    required: true,
  },
  // profileImage: {
  //   type: String,
  // },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  authToken: String, // Add a field to store the authentication token
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }

});


module.exports = mongoose.model("User", userSchema);

// models/authModel.js

const mongoose = require("mongoose");

const authGoogleSchema = new mongoose.Schema({
  googleId: String,
  displayName: String,
  email: String,
  image: String,
});

module.exports = mongoose.model("AuthUser", authGoogleSchema);

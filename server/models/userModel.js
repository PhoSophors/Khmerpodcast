const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  profileImage: {
    type: String,
    required: false,
  },
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
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  files: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
  ],
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
  ],
  emailVerified: {
    type: Boolean,
    default: false,
  },
  bio: {
    type: String,
    required: false,
  },
  facebook: {
    type: String,
    required: false,
  },
  website: {
    type: String,
    required: false,
  },
  twitter: {
    type: String,
    required: false,
  },
  instagram: {
    type: String,
    required: false,
  },
  youtube: {
    type: String,
    required: false,
  },
  tiktok: {
    type: String,
    required: false,
  },
  emailVerificationToken: String,
  authToken: String,
  createdAt: {
    type: Date,
    default: () => {
      const date = new Date();
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    },
  },
});

module.exports = mongoose.model("User", userSchema);

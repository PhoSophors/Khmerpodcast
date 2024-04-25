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
    enum: ['user', 'admin'],
    default: 'user'
  },
  files: [{ type: Schema.Types.ObjectId, ref: "File" }],
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
  emailVerificationToken: String,
  authToken: String,
  createdAt: {
    type: Date,
    // default: Date.now,
    default: () => {
      const date = new Date();
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    },
  },

});

module.exports = mongoose.model("User", userSchema);

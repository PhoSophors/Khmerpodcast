const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // Import bcrypt module
const crypto = require('crypto');
const User = require('../models/userModel');

async function createDefaultAdmin() {
  const adminExists = await User.findOne({ role: "admin" });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    // Create a JWT token
    const payload = {
      username: "admin",
      email: process.env.ADMIN_EMAIL,
      role: "admin",
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    // Hash the token
    const hash = crypto.createHash("sha256");
    hash.update(token);

    const admin = new User({
      username: "admin",
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
      emailVerified: true,
      authToken: token, // Set the hashed authToken
    });

    await admin.save();
  }
}

module.exports = createDefaultAdmin;


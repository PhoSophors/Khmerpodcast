// middleware/createDefaultAdminMiddleware.js

const User = require("../models/userModel");
const bcrypt = require("bcrypt");

async function createDefaultAdmin() {
  const adminExists = await User.findOne({ role: "admin" });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    const admin = new User({
      username: "admin",
      email: "khmerpodcast209@gmail.com",
      password: hashedPassword,
      role: "admin",
      emailVerified: true,
    });

    await admin.save();
  }
}

module.exports = createDefaultAdmin;

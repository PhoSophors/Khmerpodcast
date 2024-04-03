// middleware/createDefaultAdminMiddleware.js

const User = require('../models/userModel');
const bcrypt = require('bcrypt');

async function createDefaultAdmin() {
  const adminExists = await User.findOne({ role: 'admin' });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('defaultAdminPassword', 10);
    const admin = new User({
      username: 'admins',
      email: 'admins@example.com',
      password: hashedPassword,
      role: 'admin',
      emailVerified: true
    });

    await admin.save();
    console.log('Default admin account created');
  }
}

module.exports = createDefaultAdmin;
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const loginController = {};

loginController.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if all required fields are provided
  if (!email) {
    return res.status(400).json({ error: "Email field is required" });
  } else if (!password) {
    return res.status(400).json({ error: "Password field is required" });
  }

  try {
    // Find the user by email in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.emailVerified === false) {
      return res.status(401).json({ error: "Email not verified" });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Setup JWT payload
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    // Generate a token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Save the token to the database
    user.authToken = token;
    await user.save();

    // Respond with a message indicating successful login
    res.json({
      message: "Login successful",
      authToken: token,
    });
  } catch (err) {
    console.error("Error logging in:", err);
    return res.status(500).json({ error: "Error logging in" });
  }
};

module.exports = loginController;

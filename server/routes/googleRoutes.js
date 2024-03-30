// // routes/googleRoutes.js

const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

// Middleware to verify user authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "User not authenticated" });
}

// Route to fetch user data
router.get("/user", ensureAuthenticated, async (req, res) => {
  try {
    const userData = req.user; // Assuming user data is available in the request object
    res.json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route for initiating Google authentication
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Route for handling Google OAuth2 callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/", // Redirect to the home page after successful authentication
    failureRedirect: "http://localhost:3000", // Redirect to the login page if authentication fails
  })
);

// Route for logging out the user
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;

// controllers/authController.js

const passport = require('passport');

const authController = {
  googleAuth: passport.authenticate("google", { scope: ["profile", "email"] }),

  googleAuthCallback: passport.authenticate("google", {
    successRedirect: '/', // Redirect to the home page after successful authentication
    failureRedirect: '/login', // Redirect to the login page if authentication fails
  }),

  logout: function (req, res) {
    req.logout();
    res.redirect("/");
  },
};

module.exports = authController;
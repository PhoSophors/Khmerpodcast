// // controllers/authController.js

// const passport = require('passport');

// const authController = {
//   googleAuth: passport.authenticate("google", { scope: ["profile", "email"] }),

//   googleAuthCallback: passport.authenticate("google", {
//     successRedirect: '/', 
//     failureRedirect: '/login', 
//   }),

//   logout: function (req, res) {
//     req.logout();
//     res.redirect("/");
//   },
// };

// module.exports = authController;
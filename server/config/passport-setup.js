// config/passport-setup.js

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const AuthUser = require("../models/authModel");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8085/auth/google/callback",
      scope: ["profile", "email"], // Add the "email" scope to access the user's email
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await AuthUser.findOne({ googleId: profile.id });
        
        if (!user) {
          user = await AuthUser.create({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
            accessToken: accessToken, // Store access token
            refreshToken: refreshToken, // Store refresh token
          });

          await user.save();
        }
      
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize user object to store in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user object from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await AuthUser.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;

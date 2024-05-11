require("dotenv").config();
const express = require("express");
const session = require("express-session");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
// const passport = require("./config/passport-setup");
const authRoutes = require("./routes/authRoutes");
const fileUploadRoutes = require("./routes/fileUploadRoutes");
const searchRoutes = require("./routes/searchRoutes");
const storageRoutes = require("./routes/storageRoutes");
const authenticateToken = require("./middleware/authenticateToken");
const createDefaultAdmin = require("./middleware/createDefaultAdminMiddleware");
const allowedOrigins = ['http://localhost:3000', 'https://khmerpodcast.vercel.app'];

const crypto = require("crypto");
// const googleRoutes = require("./routes/googleRoutes");

// Initialize express app
const app = express();
const port = process.env.PORT || 4000; // Set up port


// Generate a random secret for session
function generateRandomSecret(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

// Set up CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Set up middleware
app.use(bodyParser.json());
app.use(
  session({
    secret: generateRandomSecret(),
    resave: false,
    saveUninitialized: false, // Set to false to comply with GDPR laws
    cookie: {
      secure: process.env.NODE_ENV === "production", // Set secure to true in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Set sameSite to none in production
    },
  })
);

// Initialize passport
// app.use(passport.initialize());
// app.use(passport.session());
// Middleware to parse JSON requests
app.use(express.json());

// and fetch cookies credentials requirement
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to database
connectDB();

// Create default admin account
createDefaultAdmin().then(() => {
  console.log("Default admin account checked/created");
});

// Mount routes
// app.use("/auth", googleRoutes); // google auth routes
app.use("/files", fileUploadRoutes); // Mount fileUploadRoutes at /api/upload endpoint
// app.use("/api", googleRoutes); // Mount userRoutes at /api/user endpoint
// login and register routes
app.use("/auths", authRoutes);
app.use("/search", searchRoutes);
// get bucket size
// app.use("/getbucket", storageRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = {
  authenticateToken,
};

console.log(`Listening on port: ${port}`);
// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // Print to console
});

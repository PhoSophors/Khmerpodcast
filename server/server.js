require("dotenv").config();
const express = require("express");
const session = require("express-session");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const fileUploadRoutes = require("./routes/fileUploadRoutes");
const searchRoutes = require("./routes/searchRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authenticateToken = require("./middleware/authenticateToken");
const createDefaultAdmin = require("./middleware/createDefaultAdminMiddleware");
const crypto = require("crypto");

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://khmerpodcast.vercel.app",
];

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
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Set up middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(express.json());

app.use(
  session({
    secret: generateRandomSecret(),
    resave: false,
    saveUninitialized: false, // Set to false to comply with GDPR laws
    cookie: {
      secure: process.env.NODE_ENV === "production", // Set secure to true in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Set sameSite to none in production
      httpOnly: true, // Ensures the cookie is sent only over HTTP(S), not client JavaScript
    },
  })
);

// Connect to database
connectDB();

// Create default admin account
createDefaultAdmin().then(() => {
  console.log("Default admin account checked/created");
});

// Set up routes
app.use("/files", fileUploadRoutes);
app.use("/auths", authRoutes);
app.use("/search", searchRoutes);

// Route for fetching storage information
app.use("/admin", adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = {
  authenticateToken,
};

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // Print to console
});

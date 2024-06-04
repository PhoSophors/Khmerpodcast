// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/authenticateToken");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

/** user and admin routes  */
router.get(
  "/user-data/:id",
  verifyToken,
  checkRoleMiddleware(["user", "admin"]),
  userController.getUser
);

// update user
router.put(
  "/user/update/:id",
  verifyToken,
  checkRoleMiddleware(["user", "admin"]),
  userController.updateUser
);

/**  Public profile route */
router.get("/public-profile/:id", userController.getPublicProfile);

module.exports = router;

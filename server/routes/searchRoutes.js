// routes/searchRoutes.js

const express = require("express");
const {
  searchPodcasts,
  searchUsers,
} = require("../controllers/searchController");
const verifyToken = require("../middleware/authenticateToken");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

const router = express.Router();

router.get("/podcasts", searchPodcasts);
router.get("/users", searchUsers);

module.exports = router;

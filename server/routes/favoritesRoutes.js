// routes/favoriteController.js

const express = require("express");
const router = express.Router();
const favoritesController = require("../controllers/favoritesController");
const verifyToken = require("../middleware/authenticateToken");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");


// POST route to add a Podcast to favorites
router.post(
  "/add-favorite/:id",
  verifyToken,
  checkRoleMiddleware(["admin", "user"]),
  favoritesController.addPodcastToFavorites
);

// POST route to remove a Podcast from favorites
router.post(
  "/remove-favorite/:id",
  verifyToken,
  checkRoleMiddleware(["admin", "user"]),
  favoritesController.removePodcastFromFavorites
);

// GET route to retrieve all Podcasts from favorites
router.get(
  "/get-all-favorite",
  verifyToken,
  checkRoleMiddleware(["admin", "user"]),
  favoritesController.getPodcastFavorites
);

module.exports = router;

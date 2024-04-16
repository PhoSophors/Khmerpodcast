// routes/searchRoutes.js

const express = require("express");
const { searchPodcasts, searchUsers } = require("../controllers/searchController");

const router = express.Router();

router.get('/podcasts',  searchPodcasts);
router.get('/users',  searchUsers);

module.exports = router;


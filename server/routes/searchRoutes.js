// routes/searchRoutes.js

const express = require("express");
const { searchPodcasts } = require("../controllers/searchController");


const router = express.Router();

router.get('/podcasts', searchPodcasts);

module.exports = router;


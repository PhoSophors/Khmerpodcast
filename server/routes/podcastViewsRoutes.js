const express = require('express');
const router = express.Router();
const podcastViewController = require('../controllers/podcastViewController');

router.patch('/incrementViewCount/:id', podcastViewController.incrementViewCount);
router.patch('/incrementPlayCount/:id', podcastViewController.incrementPlayCount);

module.exports = router;
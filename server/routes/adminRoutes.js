const express = require('express');
const router = express.Router();

// GET /admin
router.get('/', (req, res) => {
    res.send('GET request to /admin');
});

// POST /admin
router.post('/', (req, res) => {
    res.send('POST request to /admin');
});

// Other routes and handlers as needed

module.exports = router;

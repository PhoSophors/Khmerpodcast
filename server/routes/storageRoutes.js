const express = require("express");
const router = express.Router();

const { getBucketSizeWithRetry, formatBytes } = require("../controllers/storageController");

router.get('/size', async (req, res) => {
  try {
    const size = await getBucketSizeWithRetry();
    const formattedSize = formatBytes(size);
    res.send(`Bucket size: ${formattedSize}`);
  } catch (error) {
    console.error("Error getting bucket size:", error);
    res.status(500).send("Error getting bucket size");
  }
});

module.exports = router;

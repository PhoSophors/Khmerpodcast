// routes/searchRoutes.js

const express = require("express");
const { getStorageInfoFromS3 } = require("../controllers/getStorageInfo");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");
const verifyToken = require("../middleware/authenticateToken");

const router = express.Router();

router.get(
  "/storage-info",
  verifyToken,
  checkRoleMiddleware("admin"),

  async (req, res, next) => {
    try {
      const storageInfo = await getStorageInfoFromS3();
      res.json(storageInfo);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

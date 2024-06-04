// routes/searchRoutes.js

const express = require("express");
const { getPodcastStorageInfoFromS3 } = require("../controllers/adminController");
const userController = require("../controllers/userController");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");
const verifyToken = require("../middleware/authenticateToken");
const router = express.Router();

router.get(
  "/storage-info",
  verifyToken,
  checkRoleMiddleware("admin"),

  async (req, res, next) => {
    try {
      const storageInfo = await getPodcastStorageInfoFromS3();
      res.json(storageInfo);
    } catch (error) {
      next(error);
    }
  }
);

// get user count
router.get(
  "/users-count",
  verifyToken,
  checkRoleMiddleware("admin"),
  userController.getUsersCount
);
// get all user
router.get(
  "/all-users",
  verifyToken,
  checkRoleMiddleware("admin"),
  userController.getAllUsers
);
// delete user
router.delete(
  "/delete/user/:id",
  verifyToken,
  checkRoleMiddleware("admin"),
  userController.deleteUser
);

module.exports = router;

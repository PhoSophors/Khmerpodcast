// routes/podcastRoutes.js

const express = require("express");
const router = express.Router();
const podcastsController = require("../controllers/podcastsController");
const { uploadPodcast2S3, handleUploadError } = require("../middleware/podcastMiddleware");
const verifyToken = require("../middleware/authenticateToken");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

// POST route to handle Podcast uploads
router.post(
  "/upload",
  verifyToken,
  checkRoleMiddleware(["admin", "user"]),
  (req, res, next) => {
    uploadPodcast2S3(req, res, (err) => {
      if (err) {
        return handleUploadError(err, req, res);
      }
      next();
    });
  },
  podcastsController.uploadPodcast
);

router.put(
  "/update/:id",
  verifyToken,
  checkRoleMiddleware(["admin", "user"]),
  (req, res, next) => {
    uploadPodcast2S3(req, res, (err) => {
      if (err) {
        return handleUploadError(err, req, res);
      }
      next();
    });
  },
  podcastsController.updatePodcast
);


// GET route to retrieve all Podcast
router.get("/get-all-file", podcastsController.getAllPodcast);
router.get("/get-random-file", podcastsController.getRandomFilesHomePage);
router.get("/get-file-by-user/:id", podcastsController.getFilesByUserId);

// GET route to handle Podcast count
router.get(
  "/count",
  verifyToken,
  checkRoleMiddleware("admin"),
  podcastsController.getFileCount
);

// GET route to retrieve details of a Podcast by ID
router.get("/get-file/:id", podcastsController.getFileById);

// DELETE route to delete a Podcast by ID
router.delete(
  "/delete/:id",
  verifyToken,
  checkRoleMiddleware(["admin", "user"]),
  podcastsController.deletePodcast
);

//
router.get(
  "/get-file-by-user/:id",
  verifyToken,
  checkRoleMiddleware(["admin", "user"]),
  podcastsController.getFilesByUserId
);

module.exports = router;

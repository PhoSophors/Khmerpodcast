// routes/fileUploadRoutes.js

const express = require("express");
const router = express.Router();
const fileUploadController = require("../controllers/fileUploadController");
const {
  upload2S3,
  handleUploadError,
} = require("../middleware/fileUploadMiddleware");
const verifyToken = require("../middleware/authenticateToken");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

// POST route to handle Podcast uploads
router.post(
  "/upload",
  verifyToken,
  checkRoleMiddleware(["admin", "user"]),
  upload2S3,
  handleUploadError,
  fileUploadController.uploadPodcast
);

router.post(
  "/test-upload",
  verifyToken,
  checkRoleMiddleware(["admin", "user"]),
  upload2S3,
  (req, res) => {
    console.log("Uploaded files after upload2S3:", req.files);
    res.json({ message: "Upload successful (for testing)" });
  }
);

// PUT route to update a Podcast by ID
router.put(
  "/update/:id",
  verifyToken,
  checkRoleMiddleware(["admin", "user"]),
  upload2S3,
  fileUploadController.updateFile
);

// GET route to retrieve all Podcast
router.get("/get-all-file", fileUploadController.getAllFiles);
router.get("/get-random-file", fileUploadController.getRandomFilesHomePage);
router.get("/get-file-by-user/:id", fileUploadController.getFilesByUserId);

// GET route to handle Podcast count
router.get(
  "/count",
  verifyToken,
  checkRoleMiddleware("admin"),
  fileUploadController.getFileCount
);

// GET route to retrieve details of a Podcast by ID
router.get("/get-file/:id", fileUploadController.getFileById);

// DELETE route to delete a Podcast by ID
router.delete(
  "/delete/:id",
  verifyToken,
  checkRoleMiddleware(["admin", "user"]),
  fileUploadController.deleteFile
);

// POST route to add a Podcast to favorites
router.post(
  "/add-favorite/:id",
  verifyToken,
  checkRoleMiddleware(["admin", "user"]),
  fileUploadController.addPodcastToPlaylist
);

// POST route to remove a Podcast from favorites
router.post(
  "/remove-favorite/:id",
  verifyToken,
  checkRoleMiddleware(["admin", "user"]),
  fileUploadController.removePodcastFromPlaylist
);
// GET route to retrieve all Podcasts from favorites
router.get(
  "/get-all-favorite",
  verifyToken,
  checkRoleMiddleware(["admin", "user"]),
  fileUploadController.getPodcastPlaylist
);

//
router.get(
  "/get-file-by-user/:id",
  verifyToken,
  checkRoleMiddleware(["admin", "user"]),
  fileUploadController.getFilesByUserId
);

module.exports = router;

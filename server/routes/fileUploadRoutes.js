// routes/fileUploadRoutes.js

const express = require("express");
const router = express.Router();
const fileUploadController = require("../controllers/fileUploadController");
const {
  upload2S3,
  deleteFileFromS3,
} = require("../middleware/fileUploadMiddleware");
const compressImageMiddleware = require("../middleware/compressImageMiddleware");
const compressAudioMiddleware = require("../middleware/compressAudioMiddleware");
const verifyToken = require("../middleware/authenticateToken");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");
const File = require("../models/fileUploadModel");

// POST route to handle file uploads
router.post(
  "/upload",
  verifyToken,
  checkRoleMiddleware(["admin", "user"]),
  upload2S3,
  compressImageMiddleware,
  compressAudioMiddleware,
  fileUploadController.uploadPodcast
);

// GET route to retrieve all files
router.get("/get-all-file", fileUploadController.getAllFiles);
router.get("/get-file-by-user/:id", fileUploadController.getFilesByUserId);

// GET route to handle file count
router.get(
  "/count",
  verifyToken,
  checkRoleMiddleware("admin"),
  fileUploadController.getFileCount
);

// GET route to retrieve details of a file by ID
router.get("/get-file/:id", fileUploadController.getFileById);

// PUT route to update a file by ID
router.put(
  "/:id",
  verifyToken,
  checkRoleMiddleware(["admin", "user"]),
  fileUploadController.updateFile
);

// DELETE route to delete a file by ID
router.delete(
  "/:id",
  verifyToken,
  checkRoleMiddleware(["admin", "user"]),
  fileUploadController.deleteFile
);

module.exports = router;
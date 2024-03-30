// routes/fileUploadRoutes.js

const express = require('express');
const router = express.Router();
const fileUploadController = require('../controllers/fileUploadController');
const { upload, handleUploadError } = require('../middleware/fileUploadMiddleware');
const compressImageMiddleware = require('../middleware/compressImageMiddleware');
const compressAudioMiddleware = require('../middleware/compressAudioMiddleware');

// POST route to handle file uploads
router.post('/', upload, compressImageMiddleware,compressAudioMiddleware, fileUploadController.uploadFile);

// GET route to retrieve all files
router.get('/', fileUploadController.getAllFiles);

// GET route to retrieve details of a file by ID
router.get('/:id', fileUploadController.getFileById);

// PUT route to update a file by ID
router.put('/:id', fileUploadController.updateFile);

// DELETE route to delete a file by ID
router.delete('/:id', fileUploadController.deleteFile);

module.exports = router;

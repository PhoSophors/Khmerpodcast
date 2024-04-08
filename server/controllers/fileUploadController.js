// controller/fileUploadController.js

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const File = require("../models/fileUploadModel");

// Function to upload a file ================================================================
const uploadPodcast = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const { title, description } = req.body;
    const { audioFile, imageFile } = req.files;

    if (!title || !description || !audioFile || !imageFile) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const id = req.user.id;

    // Calculate the size of the compressed image
    const compressedImageSize = imageFile[0].buffer
      ? imageFile[0].buffer.length
      : 0;

    // auido file size
    const compressedAudioSize = audioFile[0].buffer
      ? audioFile[0].buffer.length
      : 0;
    // Create a single document for both audio and image
    const file = new File({
      title: title,
      description: description,
      user: id,
      audio: {
        filename: `audio_/${req.files.audioFile[0].key}`,
        url: req.files.audioFile[0].location,
        // size: req.files.audioFile[0].size,
        compressedSize: compressedAudioSize,
        mimetype: req.files.audioFile[0].mimetype,
      },
      image: {
        filename: `image_/${req.files.imageFile[0].key}`,
        url: req.files.imageFile[0].location,
        // size: req.files.imageFile[0].size,
        compressedSize: compressedImageSize,
        mimetype: req.files.imageFile[0].mimetype,
      },
    });

    // Save the file document
    await file.save();

    res
      .status(201)
      .json({ message: "File uploaded successfully", fileId: file._id });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to get all files
const getAllFiles = async (req, res) => {
  try {
    const files = await File.find();
    res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to get file count ================================================================
const getFileCount = async (req, res) => {
  try {
    const count = await File.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error getting file count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to update a file ================================================================
const updateFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updatedFile = await File.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!updatedFile) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json({ message: "File updated successfully", file: updatedFile });
  } catch (error) {
    console.error("Error updating file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to delete a file ================================================================
const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing file ID" });
    }

    const deletedFile = await File.findByIdAndDelete(id);

    if (!deletedFile) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to get details of a file by ID ================================================================
const getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id).populate("user");
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    // Fetch the user who uploaded the file
    const user = await User.findById(file.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Function to get file count ================================================================
exports.getFileCount = async (req, res) => {
  try {
    const count = await File.countDocuments();
    res.json({ fileCount: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to get files by user ID ================================================================
const getFilesByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    // Find files uploaded by the user
    const files = await File.find({ user: id });

    // If no files found, return a message
    if (!files || files.length === 0) {
      return res.status(404).json({ message: "No files found for this user" });
    }

    // Return the files
    res.json(files);
  } catch (err) {
    // Handle any errors
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================================================================
module.exports = {
  uploadPodcast,
  getAllFiles,
  updateFile,
  deleteFile,
  getFileById,
  getFileCount,
  getFilesByUserId
};

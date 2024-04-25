// controller/fileUploadController.js

// const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const File = require("../models/fileUploadModel");
const mongoose = require("mongoose");
// const { deleteFileFromS3 } = require("../middleware/fileUploadMiddleware");

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

    // set user id from token
    const userId = req.user.id;

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
      user: userId, // set user id
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

// Function to get all files ================================================================
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
    const user = req.user;

    if (!id) {
      return res.status(400).json({ message: "Missing file ID" });
    }

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Check if the user who uploaded the file is the same user who is trying to delete it
    // or if the user is an admin
    if (file.user.toString() !== user.id && user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this file" });
    }
    // Remove the file from the database
    await File.deleteOne({ _id: id });

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

// Function to get files by user ID that user upload ================================================================
const getFilesByUserId = async (req, res) => {
  try {
    const { id } = req.params; // ID of the user

    // Find files id uploaded by the user
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

// Function to add podcast to playlist ================================================================
const addPodcastToPlaylist = async (req, res) => {
  try {
    const { id } = req.params; // ID of the file to add to favorites
    const userId = req.user.id; // ID of the user making the request

    console.log('id:', id); // Debugging line
    console.log('userId:', userId); // Debugging line

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Find the file by ID
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Check if the file is already in the user's favorites
    if (user.favorites.includes(id)) {
      return res.status(400).json({ message: "File already in favorites" });
    }

    // Add the file to the user's favorites
    user.favorites.push(id);
    await user.save();

    res.json({ message: "File added to favorites successfully" });
  } catch (error) {
    console.error("Error adding file to favorites:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to remove podcast playlist from user favorites ================================================================
const removePodcastFromPlaylist = async (req, res) => {
  try {
    const { id } = req.params; // ID of the file to remove from favorites
    const userId = req.user.id; // ID of the user making the request

    // Check if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the file is in the user's favorites
    const index = user.favorites.indexOf(id);
    if (index === -1) {
      return res.status(400).json({ message: "Podcast not in favorites" });
    }

    // Remove the file from the user's favorites
    user.favorites.splice(index, 1);
    await user.save();

    res.json({ message: "Podcast removed from favorites successfully" });
  } catch (error) {
    console.error("Error removing Podcast from favorites:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to get all podcast playlist from user add to favorites ================================================================
const getPodcastPlaylist = async (req, res) => {
  try {
    const id = req.user.id; // ID of the user making the request

    // Find the user by ID and populate the 'favorites' field
    const user = await User.findById(id).populate("favorites");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user's favorites
    res.json(user.favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Internal server error" });
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
  getFilesByUserId,
  addPodcastToPlaylist,
  removePodcastFromPlaylist,
  getPodcastPlaylist,
};

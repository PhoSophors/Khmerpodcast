// controller/podcastsController.js

const File = require("../models/fileUploadModel");
const {
  downloadFromS3,
  compressAudio,
  compressImage,
  uploadCompressToS3,
  deleteFromS3,
} = require("../config/s3Helpers");

// Function to upload a Podcast ================================================================
const uploadPodcast = async (req, res) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      console.error("No audio or image file uploaded");
      return res
        .status(400)
        .json({ message: "No audio or image file uploaded" });
    }

    const title = req.body.title;
    const description = req.body.description;
    const audioFile = req.files.audioFile[0];
    const imageFile = req.files.imageFile[0];

    if (!title || !description || !audioFile || !imageFile) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Download audio and image file from S3
    const audioBuffer = await downloadFromS3(audioFile.key);
    const imageBuffer = await downloadFromS3(imageFile.key);

    // Compress audio and image files
    const compressedAudioBuffer = await compressAudio(audioBuffer);
    const compressedImageBuffer = await compressImage(imageBuffer);

    // Delete original files from S3
    await deleteFromS3(audioFile.key);
    await deleteFromS3(imageFile.key);

    // Upload the compressed files to S3 and get their URLs
    const compressedAudioFileUrl = await uploadCompressToS3(
      compressedAudioBuffer,
      "audio/mpeg",
      ".mp3"
    );
    const compressedImageFileUrl = await uploadCompressToS3(
      compressedImageBuffer,
      "image/jpeg",
      ".jpg"
    );

    const file = new File({
      title: title,
      description: description,
      user: req.user.id,
      audio: {
        filename: compressedAudioFileUrl.split("/").pop(),
        url: compressedAudioFileUrl,
        size: compressedAudioBuffer.length,
        mimetype: "audio/mpeg",
      },
      image: {
        filename: compressedImageFileUrl.split("/").pop(),
        url: compressedImageFileUrl,
        size: compressedImageBuffer.length,
        mimetype: "image/jpeg",
      },
    });

    const savedFile = await file.save();

    res.status(201).json({
      message: "File uploaded successfully",
      fileId: file._id,
      file: savedFile,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    // Rollback by deleting original files from S3
    if (audioBuffer) {
      await deleteFromS3(audioFile.key);
    }
    if (imageBuffer) {
      await deleteFromS3(imageFile.key);
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to update a Podcast ================================================================
const updatePodcast = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { id } = req.params;

    // set user id from token
    const user = req.user.id;

    // Find the file in the database
    let file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Check if the user is the uploader of the file
    if (file.user.toString() !== user) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this podcast" });
    }

    // Update the file's properties
    file.title = title || file.title;
    file.description = description || file.description;

    // Check if audio file is updated
    if (req.files && req.files.audioFile) {
      const { audioFile } = req.files;

      // Delete the old audio file from S3
      await deleteFromS3(file.audio.filename);

      // Download audio file from S3
      const audioBuffer = await downloadFromS3(audioFile[0].key);

      // Compress audio
      const compressedAudioBuffer = await compressAudio(audioBuffer);

      // Upload compressed audio to S3 again
      const compressedAudioFileUrl = await uploadCompressToS3(
        compressedAudioBuffer,
        "audio/mpeg",
        ".mp3"
      );

      file.audio.filename = compressedAudioFileUrl.split("/").pop();
      file.audio.url = compressedAudioFileUrl;
      file.audio.size = compressedAudioBuffer.length;
      file.audio.mimetype = "audio/mpeg";
    }

    // Check if image file is updated
    if (req.files && req.files.imageFile) {
      const { imageFile } = req.files;

      // Delete the old image file from S3
      await deleteFromS3(file.image.filename);

      // Download image file from S3
      const imageBuffer = await downloadFromS3(imageFile[0].key);

      // Compress image
      const compressedImageBuffer = await compressImage(imageBuffer);

      // Upload compressed image to S3 again
      const compressedImageFileUrl = await uploadCompressToS3(
        compressedImageBuffer,
        "image/jpeg",
        ".jpg"
      );

      file.image.filename = compressedImageFileUrl.split("/").pop();
      file.image.url = compressedImageFileUrl;
      file.image.size = compressedImageBuffer.length;
      file.image.mimetype = "image/jpeg";
    }

    // Save the updated file
    const updatedFile = await file.save();

    res.json({ message: "File updated successfully", file: updatedFile });
  } catch (error) {
    console.error("Error updating file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to get all Podcast ================================================================
const getAllPodcast = async (req, res) => {
  const { date } = req.query;
  try {
    let files;
    if (date) {
      files = await File.find({ createdAt: { $gte: new Date(date) } });
    } else {
      files = await File.find();
    }
    res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to get a random file
const getRandomFilesHomePage = async (req, res) => {
  try {
    const count = await File.countDocuments();
    let file;

    // Retry until a unique file is found
    while (!file) {
      const random = Math.floor(Math.random() * count);
      file = await File.findOne().skip(random);
    }

    res.status(200).json(file);
  } catch (error) {
    console.error("Error fetching random file:", error);
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

// Function to delete a file ================================================================
const deletePodcast = async (req, res) => {
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

    // await deleteFromS3(file.audio.key);
    // await deleteFromS3(file.image.key);

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

// ================================================================
module.exports = {
  uploadPodcast,
  updatePodcast,
  getAllPodcast,
  deletePodcast,
  getFileById,
  getFileCount,
  getFilesByUserId,
  getRandomFilesHomePage,
};

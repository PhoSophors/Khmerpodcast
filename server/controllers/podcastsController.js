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
  let audioFileKey, imageFileKey, compressedAudioFileUrl, compressedImageFileUrl;
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      console.error("No audio or image file uploaded");
      return res.status(400).json({ message: "No audio or image file uploaded" });
    }

    const title = req.body.title;
    const description = req.body.description;
    const audioFile = req.files.audioFile[0];
    const imageFile = req.files.imageFile[0];

    if (!title || !description || !audioFile || !imageFile) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Track the original files' keys
    audioFileKey = audioFile.key;
    imageFileKey = imageFile.key;

    // Download audio and image file from S3
    const audioBuffer = await downloadFromS3(audioFile.key);
    const imageBuffer = await downloadFromS3(imageFile.key);

    // Compress audio and image files
    const compressedAudioBuffer = await compressAudio(audioBuffer);
    const compressedImageBuffer = await compressImage(imageBuffer);

    try {
      // Delete original files from S3
      await deleteFromS3(audioFile.key);
      await deleteFromS3(imageFile.key);

      // Upload the compressed files to S3 and get their URLs
      compressedAudioFileUrl = await uploadCompressToS3(
        compressedAudioBuffer,
        "audio/mpeg",
        ".mp3"
      );
      compressedImageFileUrl = await uploadCompressToS3(
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
      console.error("Error uploading compressed files to S3:", error);

      // Delete compressed files from S3 if they exist
      if (compressedAudioFileUrl) {
        await deleteFromS3(compressedAudioFileUrl.split('/').pop());
      }
      if (compressedImageFileUrl) {
        await deleteFromS3(compressedImageFileUrl.split('/').pop());
      }

      return res.status(500).json({ message: "Error during compression or upload" });
    }
  } catch (error) {
    console.error("Error uploading file:", error);

    // Rollback by deleting original files from S3 if they exist
    if (audioFileKey) {
      await deleteFromS3(audioFileKey);
    }
    if (imageFileKey) {
      await deleteFromS3(imageFileKey);
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to update a Podcast ================================================================
const updatePodcast = async (req, res) => {
  let oldAudioKey, oldImageKey, newAudioKey, newImageKey, compressedAudioFileUrl, compressedImageFileUrl;
  
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

    // Track the old files' keys
    oldAudioKey = file.audio.url.replace(
      `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`,
      ""
    );
    oldImageKey = file.image.url.replace(
      `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`,
      ""
    );

    // Update the file's properties
    file.title = title || file.title;
    file.description = description || file.description;

    // Check if audio file is updated
    if (req.files && req.files.audioFile) {
      const { audioFile } = req.files;

      // Track the new audio file key
      newAudioKey = audioFile[0].key;

      // Download new audio file from S3
      const audioBuffer = await downloadFromS3(audioFile[0].key);

      // Compress audio
      const compressedAudioBuffer = await compressAudio(audioBuffer);

      // Upload compressed audio to S3
      compressedAudioFileUrl = await uploadCompressToS3(
        compressedAudioBuffer,
        "audio/mpeg",
        ".mp3"
      );

      // Update file object with new audio data
      file.audio.filename = compressedAudioFileUrl.split("/").pop();
      file.audio.url = compressedAudioFileUrl;
      file.audio.size = compressedAudioBuffer.length;
      file.audio.mimetype = "audio/mpeg";
    }

    // Check if image file is updated
    if (req.files && req.files.imageFile) {
      const { imageFile } = req.files;

      // Track the new image file key
      newImageKey = imageFile[0].key;

      // Download new image file from S3
      const imageBuffer = await downloadFromS3(imageFile[0].key);

      // Compress image
      const compressedImageBuffer = await compressImage(imageBuffer);

      // Upload compressed new image to S3
      compressedImageFileUrl = await uploadCompressToS3(
        compressedImageBuffer,
        "image/jpeg",
        ".jpg"
      );

      // Update file object with new image data
      file.image.filename = compressedImageFileUrl.split("/").pop();
      file.image.url = compressedImageFileUrl;
      file.image.size = compressedImageBuffer.length;
      file.image.mimetype = "image/jpeg";
    }

    // Save the updated file
    const updatedFile = await file.save();

    // If update is successful, delete the old files and new uncompressed files from S3
    if (newAudioKey) {
      await deleteFromS3(oldAudioKey);
      await deleteFromS3(newAudioKey); // Delete the original new audio file
    }
    if (newImageKey) {
      await deleteFromS3(oldImageKey);
      await deleteFromS3(newImageKey); // Delete the original new image file
    }

    res.json({ message: "File updated successfully", file: updatedFile });
  } catch (error) {
    console.error("Error updating file:", error);

    // Rollback: delete new compressed files if they exist
    if (compressedAudioFileUrl) {
      await deleteFromS3(compressedAudioFileUrl.split('/').pop());
    }
    if (compressedImageFileUrl) {
      await deleteFromS3(compressedImageFileUrl.split('/').pop());
    }

    // Delete the new uncompressed files if they were uploaded
    if (newAudioKey) {
      await deleteFromS3(newAudioKey);
    }
    if (newImageKey) {
      await deleteFromS3(newImageKey);
    }

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
    // Fetch the total count of files
    const count = await File.countDocuments();
    
    // Fetch all files in random order using aggregation with $sample
    const randomFiles = await File.aggregate([{ $sample: { size: count } }]);

    res.status(200).json(randomFiles);
  } catch (error) {
    console.error("Error fetching random files:", error);
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

    // Extract keys for audio and image files
    const audioKey = file.audio.url.replace(
      `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`,
      ""
    );
    const imageKey = file.image.url.replace(
      `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`,
      ""
    );

    // Delete audio and image files from S3
    await deleteFromS3(audioKey);
    await deleteFromS3(imageKey);

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

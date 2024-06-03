const User = require("../models/userModel");
const File = require("../models/fileUploadModel");
const ffmpeg = require("fluent-ffmpeg");
const sharp = require("sharp");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const stream = require("stream");
const { promisify } = require("util");

// Configure AWS S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const pipeline = promisify(stream.pipeline);


// Function to upload a podcast ================================================================
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
    const compressedAudioFileUrl = await uploadToS3(
      compressedAudioBuffer,
      "audio/mpeg",
      ".mp3"
    );
    const compressedImageFileUrl = await uploadToS3(
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


// Download file from S3
const downloadFromS3 = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });

  const response = await s3Client.send(command);
  return new Promise((resolve, reject) => {
    const chunks = [];
    response.Body.on("data", (chunk) => chunks.push(chunk));
    response.Body.on("end", () => resolve(Buffer.concat(chunks)));
    response.Body.on("error", reject);
  });
};

// Function to compress audio
const compressAudio = async (audioBuffer) => {
  return new Promise((resolve, reject) => {
    const audioStream = new stream.PassThrough();
    audioStream.end(audioBuffer);

    const outputStream = new stream.PassThrough();
    const chunks = [];
    outputStream.on("data", (chunk) => chunks.push(chunk));
    outputStream.on("end", () => resolve(Buffer.concat(chunks)));
    outputStream.on("error", reject);

    ffmpeg(audioStream)
      .audioBitrate("64k")
      .format("mp3")
      .on("error", reject)
      .pipe(outputStream);
  });
};

// Function to compress image
const compressImage = async (imageBuffer) => {
  return sharp(imageBuffer)
    .resize({ width: 800 })
    .jpeg({ quality: 80 })
    .toBuffer();
};

// Function to upload compressed files to S3
const uploadToS3 = async (fileBuffer, mimeType, fileExtension) => {
  const uniqueKey = `${Date.now().toString()}${fileExtension}`;

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: uniqueKey,
    Body: fileBuffer,
    ContentType: mimeType,
    ACL: "private",
  };

  await s3Client.send(new PutObjectCommand(uploadParams));
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueKey}`;
};

// Function to delete file from S3
const deleteFromS3 = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
};

// Function to update a file ================================================================
const updateFile = async (req, res) => {
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
      // Upload compressed audio to S3
      const compressedAudioFileUrl = await uploadToS3(
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
      // Upload compressed image to S3
      const compressedImageFileUrl = await uploadToS3(
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

// Function to get all files ================================================================
const getAllFiles = async (req, res) => {
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

    await deleteFromS3(file.audio.key);
    await deleteFromS3(file.image.key);
    
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

// Function to add podcast to playlist ================================================================
const addPodcastToPlaylist = async (req, res) => {
  try {
    const { id } = req.params; // ID of the file to add to favorites
    const userId = req.user.id; // ID of the user making the request

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
  getRandomFilesHomePage,
};

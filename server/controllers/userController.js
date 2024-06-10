const User = require("../models/userModel");
const multer = require("multer");
const multerS3 = require("multer-s3");
const File = require("../models/podcastModel");
const { s3Client } = require("../config/s3Helpers");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
let tokenBlacklist = [];

// Multer configuration for handling file uploads
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME_PROFILE,
    key: function (req, file, cb) {
      const fileExtension = file.mimetype.split("/")[1];
      const uniqueKey = `${Date.now().toString()}.${fileExtension}`;
      cb(null, uniqueKey);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
  }),
}).single("profileImage");

const deleteFromS3 = async (key) => {
  const deleteParams = {
    Bucket: process.env.AWS_BUCKET_NAME_PROFILE,
    Key: key,
  };

  await s3Client.send(new DeleteObjectCommand(deleteParams));
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    username,
    bio,
    twitter,
    instagram,
    youtube,
    tiktok,
    facebook,
    website,
  } = req.body;

  try {
    let user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Handle file upload using multers
    upload(req, res, async (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: `Error uploading image: ${err.message}` });
      }

      if (username) user.username = username;
      if (bio) user.bio = bio;
      if (facebook) user.facebook = facebook;
      if (website) user.website = website;
      if (twitter) user.twitter = twitter;
      if (instagram) user.instagram = instagram;
      if (youtube) user.youtube = youtube;
      if (tiktok) user.tiktok = tiktok;

      // If file upload was successful, delete the old image from S3 and update the user object with the new S3 URL
      if (req.file) {
        // Get the key of the old image from the File document
        const oldImageKey = user.profileImage.replace(
          `https://${process.env.AWS_BUCKET_NAME_PROFILE}.s3.${process.env.AWS_REGION}.amazonaws.com/`,
          ""
        );

        // Delete the old image from S3
        await deleteFromS3(oldImageKey);

        // Update the user object with the new S3 URL
        user.profileImage = req.file.location;
      }

      // Save the updated user object
      try {
        await user.save();
        res.status(200).json({ user });
      } catch (error) {
        res
          .status(500)
          .json({ error: `Error updating user: ${error.message}` });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPublicProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Fetch the user's files from the database
    const files = await File.find({ user: id });

    if (!files) {
      return res.status(200).json({ user });
    }

    const publicProfile = {
      username: user.username,
      bio: user.bio,
      profileImage: user.profileImage,
      role: user.role,
      twitter: user.twitter,
      instagram: user.instagram,
      youtube: user.youtube,
      tiktok: user.tiktok,
      facebook: user.facebook,
      website: user.website,
      files,
    };
    res.status(200).json({
      user: publicProfile,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUsersCount = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.status(200).json({ user: userCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  const { date } = req.query; // Get the date from the query parameters
  try {
    let users;
    if (date) {
      users = await User.find({ createdAt: { $gte: new Date(date) } });
    } else {
      users = await User.find();
    }
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res
        .status(400)
        .json({ error: "ID parameter is missing or invalid" });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error); // Log the error to the console
    res.status(500).json({ error: error.message }); // Return the specific error message
  }
};

module.exports = {
  updateUser,
  getUser,
  getPublicProfile,
  getUsersCount,
  getAllUsers,
  deleteUser,
};

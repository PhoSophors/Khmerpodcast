const User = require("../models/userModel");
const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const File = require("../models/fileUploadModel");
let tokenBlacklist = [];

const s3Client = new S3Client({
  region: process.env.AWS_REGION_PROFILE,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

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

const updateUser = async (req, res) => {
  const { id } = req.params;

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

      // Update the username if provided
      const { username, bio } = req.body;
      if (username) {
        user.username = username;
      }
      
      // Update the bio if provided
      if (bio) {
        user.bio = bio;
      }

      // If file upload was successful, update the user object with the S3 URL
      if (req.file) {
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

    // Remove the user's token from the blacklist
    const userToken = req.headers.authorization.split(" ")[1];
    const tokenIndex = tokenBlacklist.indexOf(userToken);
    if (tokenIndex !== -1) {
      tokenBlacklist.splice(tokenIndex, 1);
    }

    res
      .status(200)
      .json({ message: "User deleted successfully", deleteToken: true });
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

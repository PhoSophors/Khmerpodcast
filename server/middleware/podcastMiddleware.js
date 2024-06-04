// middleware for uploading podcast files to AWS S3

const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const { s3Client } = require("../config/s3Helpers");

// Set up Multer to upload files to AWS S3
const uploadPodcast2S3 = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME,
    key: function (req, file, cb) {
      const fileExtension = path.extname(file.originalname);
      const uniqueKey = `${Date.now().toString()}${fileExtension}`;
      cb(null, uniqueKey);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
  }),
}).fields([
  { name: "audioFile", maxCount: 1 },
  { name: "imageFile", maxCount: 1 },
]);

// Handle upload errors
const handleUploadError = (err, req, res, next) => {
  console.error("Upload error:", err);
  res.status(500).json({ message: "Internal server error" });
};

module.exports = { uploadPodcast2S3, handleUploadError };

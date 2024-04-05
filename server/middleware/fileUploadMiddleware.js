// middleware/fileUploadMiddleware.js


const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { Readable } = require("stream");
const compressImageMiddleware = require("./compressImageMiddleware");
const compressAudioMiddleware = require("./compressAudioMiddleware");

// Configure AWS S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const upload2S3 = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME,
    key: function (req, file, cb) {
      // Set the file extension based on the MIME type
      const fileExtension = file.mimetype.split("/")[1];
      const uniqueKey = `${Date.now().toString()}.${fileExtension}`;
      cb(null, uniqueKey);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE, // Automatically set the content type based on file extension
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    }
  })
}).fields([
  { name: "audioFile" },
  { name: "imageFile" },
  { name: "title" },
  { name: "description" },
]);


const handleUploadError = (err, req, res, next) => {
  console.error("Upload error:", err);
  res.status(500).json({ message: "Internal server error" });
};

module.exports = { upload2S3, handleUploadError, compressImageMiddleware, compressAudioMiddleware };

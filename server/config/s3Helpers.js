// config/s3Helpers.js

const stream = require("stream");
const { promisify } = require("util");
const ffmpeg = require("fluent-ffmpeg");
const sharp = require("sharp");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

// Promisify the pipeline function from the stream module
const pipeline = promisify(stream.pipeline);

// Create an S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

// Helper functions ================================================================
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
const uploadCompressToS3 = async (fileBuffer, mimeType, fileExtension) => {
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
async function deleteFromS3(key) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key
  };

  try {
    await s3Client.send(new DeleteObjectCommand(params));
    console.log(`File deleted successfully ${key}`);
  } catch (error) {
    console.error(`Failed to delete file ${key}: `, error);
  }
}

module.exports = {
  s3Client,
  downloadFromS3,
  compressAudio,
  compressImage,
  uploadCompressToS3,
  deleteFromS3,
};

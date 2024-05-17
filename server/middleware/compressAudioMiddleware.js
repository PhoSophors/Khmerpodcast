// middleware/compressAudioMiddleware.js

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const ffmpeg = require("fluent-ffmpeg");
const { PassThrough } = require("stream");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const compressAudioMiddleware = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile) {
      return res.status(400).json({ message: "No audio file uploaded" });
    }

    const audioFile = req.files.audioFile[0];
    const getParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: audioFile.key,
    };

    const { Body: audioStream } = await s3Client.send(
      new GetObjectCommand(getParams)
    );

    const compressedStream = new PassThrough();

    // Compress the audio file
    ffmpeg(audioStream)
      .audioCodec("libmp3lame")
      .format("mp3")
      .on("error", (err) => {
        console.error("Error compressing audio:", err);
        return res.status(500).json({ message: "Error compressing audio" });
      })
      .on("end", () => {
        console.log("Compression completed successfully");
      })
      .pipe(compressedStream);

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `compressed/${audioFile.key}`, // Store in a 'compressed' folder
      Body: compressedStream,
      ContentType: "audio/mpeg",
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    req.files.audioFile[0].compressedS3Key = `compressed/${audioFile.key}`;
    req.files.audioFile[0].mimetype = "audio/mpeg";

    next();
  } catch (err) {
    console.error("Error in compressAudioMiddleware:", err);
    next(err);
  }
};

module.exports = { compressAudioMiddleware };

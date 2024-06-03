const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const ffmpeg = require("fluent-ffmpeg");
const { PassThrough } = require("stream");
const streamifier = require("streamifier");

const s3 = new S3Client({ region: process.env.AWS_REGION });


const compressAudio = async (req, res, next) => {
  try {
    const audioFile = req.file;
    // const audioFile = req.files.audioFile ? req.files.audioFile[0] : null;

    if (!audioFile) {
      console.error("Audio file not found in request");
      return res.status(400).json({ message: "No audio file uploaded" });
    }

    // Get the audio file data
    const audioData = audioFile.buffer;

    // Before writing to a stream, check if the data is defined
    if (audioData) {
      writableStream.write(audioData);
    } else {
      console.error("audioData is undefined");
      return res.status(400).json({ message: "No audio data available" });
    }

    const allowedMimeTypes = [
      "audio/mpeg",
      "audio/wav",
      "audio/aac",
      "audio/ogg",
      "audio/mp3",
    ];
    if (!allowedMimeTypes.includes(audioFile.mimetype)) {
      return res.status(400).json({ message: "Unsupported audio file format" });
    }

    const audioFileBuffer = audioFile.buffer;
    const readableStream = streamifier.createReadStream(audioFileBuffer);

    // Compress the audio file using ffmpeg
    let compressedAudioBuffer;
    try {
      compressedAudioBuffer = await new Promise((resolve, reject) => {
        const buffers = [];
        const passThrough = new PassThrough();
        readableStream.pipe(passThrough);

        ffmpeg(passThrough)
          .inputFormat(audioFile.mimetype.split("/")[1]) // Use the correct input format
          .outputOptions("-vn", "-ar", "44100", "-ac", "2", "-b:a", "192k")
          .on("end", function () {
            console.log("Compression finished");
            resolve(Buffer.concat(buffers));
          })
          .on("error", function (err) {
            console.error("Error during compression:", err);
            reject(new Error("Error compressing audio file"));
          })
          .toFormat("mp3") // Convert to MP3 format
          .pipe(new PassThrough())
          .on("data", (chunk) => buffers.push(chunk));
      });
    } catch (err) {
      console.error("Error during compression:", err);
      return res.status(400).json({ message: err.message });
    }

    // Upload the compressed audio file back to S3
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `compressed-${audioFile.originalname.replace(/\.[^/.]+$/, ".mp3")}`, // Change the extension to mp3
      Body: compressedAudioBuffer,
      ContentType: "audio/mpeg",
    };

    try {
      await s3.send(new PutObjectCommand(uploadParams));
      console.log("File uploaded successfully");
      next();
    } catch (err) {
      console.error("Error uploading the compressed audio file to S3:", err);
      res
        .status(500)
        .json({ message: "Error uploading the compressed audio file to S3" });
    }
  } catch (error) {
    console.error("Error during compression or upload:", error);
    return res.status(400).json({ message: error.message }); // Fix typo here: err -> error
  }
};

module.exports = compressAudio;

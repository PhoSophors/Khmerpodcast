// middleware/compressAudioMiddleware.js
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");

const compressAudioMiddleware = (req, res, next) => {
  console.log("Files received:", req.files); // Log received files

  // Check if audioFile exists in req.files and if buffer is not empty
  if (!req.files || !req.files.audioFile || !req.files.audioFile[0].buffer) {
    console.error("No audio file found or empty buffer.");
    return res
      .status(400)
      .json({ message: "Bad request: audio file is required" });
  }

  const audioFile = req.files.audioFile[0];

  try {
    const originalPath = path.join(os.tmpdir(), audioFile.originalname);
    const compressedPath = path.join(
      os.tmpdir(),
      `compressed_${audioFile.originalname}`
    );

    console.log("Original path:", originalPath); // Log original path
    console.log("Compressed path:", compressedPath); // Log compressed path

    fs.writeFileSync(originalPath, audioFile.buffer);

    ffmpeg(originalPath)
      .audioCodec("libopus")
      .audioBitrate(64)
      .format("ogg")
      .on("end", () => {
        const compressedBuffer = fs.readFileSync(compressedPath);
        audioFile.buffer = compressedBuffer;
        audioFile.compressedSize = compressedBuffer.length; // Set the compressedSize property
        fs.unlinkSync(originalPath);
        fs.unlinkSync(compressedPath);
        next();
      })
      .on("error", (err) => {
        console.error(`Error compressing audio file: ${err.message}`);
        audioFile.compressedSize = audioFile.buffer.length; // Set compressedSize to original size in case of error
        next();
      })
      .save(compressedPath);
  } catch (error) {
    console.error("Error processing audio file:", error);
    return res
      .status(500)
      .json({ message: "Internal server error while processing audio file" });
  }
};

module.exports = { compressAudioMiddleware };

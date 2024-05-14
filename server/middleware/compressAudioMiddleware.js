const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");

const compressAudioMiddleware = async (req, res, next) => {
  try {
    // Check if audio file exists and has data
    if (!req.files || !req.files.audioFile || !req.files.audioFile[0].buffer) {
      return next();
    }

    const audioFile = req.files.audioFile[0];
    const audioBuffer = audioFile.buffer;
    const audioPath = path.join(__dirname, audioFile.originalname);

    fs.writeFileSync(audioPath, audioBuffer);

    ffmpeg(audioPath)
      .audioCodec("libopus") // Set the audio codec to Opus
      .audioBitrate("64k") // Set the audio bitrate to 64 kbps (kilobits per second)
      .format("ogg") // Set the output format to OGG (Opus files are often put in an OGG container)
      .on("end", () => {

        // Read the compressed audio file and update the buffer in req.files.audioFile
        const compressedAudioBuffer = fs.readFileSync(audioPath);
        req.files.audioFile[0].buffer = compressedAudioBuffer; // Update the buffer in req.files.audioFile

        // Delete the temporary audio file
        fs.unlinkSync(audioPath);

        next();
      })
      .on("error", (err) => {
        console.error("Error compressing audio:", err);
        res
          .status(500)
          .json({
            message: "Error compressing audio. Please try again later.",
          });
      })
      .save(audioPath);
  } catch (err) {
    console.error("Error in compressAudioMiddleware:", err);
    res
      .status(500)
      .json({
        message: "Error in compressAudioMiddleware. Please try again later.",
      });
  }
};

module.exports = compressAudioMiddleware;

// const ffmpeg = require("fluent-ffmpeg");

// const compressAudioMiddleware = async (req, res, next) => {
//   if (!req.files || Object.keys(req.files).length === 0) {
//     return res.status(400).json({ message: "No files uploaded" });
//   }

//   try {
//     const { audioFile } = req.files;

//     if (!audioFile) {
//       return res.status(400).json({ message: "No audio file found" });
//     }
//   } catch (error) {
//     console.error("Error compressing audio:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// module.exports = { compressAudioMiddleware };

// // middleware/compressAudioMiddleware.js

// const fs = require("fs");
// const { Lame } = require("node-lame");

// const compressAudioMiddleware = async (req, res, next) => {
//   try {
//     if (!req.files || !req.files.length) { // Check if files are present
//       console.error("No audio file uploaded");
//       return res.status(400).json({ message: "No audio file uploaded" });
//     } 

//     const audioFile = req.files[0]; // Access the first file in the array

//     if (!audioFile || !audioFile.path) {
//       console.error("Invalid audio file");
//       return res.status(400).json({ message: "Invalid audio file" });
//     }

//     const audioFilePath = audioFile.path;
//     const compressedAudioFilePath = audioFilePath.replace(".mp3", "-compressed.mp3");

//     const encoder = new Lame({
//       output: compressedAudioFilePath,
//       bitrate: 128,
//     }).setFile(audioFilePath);

//     await encoder.encode();

//     console.log("Audio compression complete");

//     // Update the path and size of the audio file
//     audioFile.path = compressedAudioFilePath;
//     audioFile.size = fs.statSync(compressedAudioFilePath).size;
    
//     next();
//   } catch (error) {
//     console.error("Error compressing audio:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// module.exports = compressAudioMiddleware;

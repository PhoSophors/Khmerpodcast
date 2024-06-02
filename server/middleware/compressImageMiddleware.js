// const { Readable } = require("stream");
// const sharp = require("sharp");

// const compressImageMiddleware = async (req, res, next) => {
//   try {
//     // Check if image file exists and has data
//     if (!req.files || !req.files.imageFile || !req.files.imageFile[0].buffer) {
//       return next(); // Skip compression if no image uploaded
//     }

//     const imageBuffer = req.files.imageFile[0].buffer;

//     // Compress the image using Sharp for both JPEG, PNG and WEB formats
//     const compressedJpegBuffer = await sharp(imageBuffer)
//       .resize(5000, 5000) // Resize the image to a maximum of 5000x5000 pixels
//       .jpeg({ quality: 80 })  // Set the quality to 80%
//       .toBuffer();

//     const compressedPngBuffer = await sharp(imageBuffer)
//       .resize(1000, 1000)  // Resize the image to a maximum of 1000x1000 pixels
//       .png({ compressionLevel: 8 }) // Set the compression level to 8
//       .toBuffer();
      
//     const compressedWebBuffer = await sharp(imageBuffer)
//       .resize(1000, 1000)  // Resize the image to a maximum of 1000x1000 pixels
//       .webp({ quality: 80 }) // Set the quality to 80%
//       .toBuffer();

//     // Choose the appropriate buffer based on your selection
//     let compressedImageBuffer;
//     if (
//       compressedJpegBuffer.length < compressedPngBuffer.length &&
//       compressedJpegBuffer.length < compressedWebBuffer.length
//     ) {
//       compressedImageBuffer = compressedJpegBuffer;
//     } else if (compressedPngBuffer.length < compressedWebBuffer.length) {
//       compressedImageBuffer = compressedPngBuffer;
//     } else {
//       compressedImageBuffer = compressedWebBuffer;
//     }

//     // Create a readable stream from the compressed buffer (for multerS3)
//     const compressedImageStream = new Readable({
//       read() {
//         this.push(compressedImageBuffer);
//         this.push(null);
//       },
//     });

//     req.files.imageFile[0].buffer = compressedImageStream;
//     req.files.imageFile[0].size = compressedImageBuffer.length; // Update file size

//     next();
//   } catch (error) {
//     console.error("Error compressing image:", error);
//     res
//       .status(500)
//       .json({ message: "Error compressing image. Please try again later." });
//   }
// };

// module.exports = { compressImageMiddleware };

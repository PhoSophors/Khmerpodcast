const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

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

    // Compress the audio using fluent-ffmpeg
    ffmpeg(audioPath)
      .audioBitrate('32k')
      .on('end', () => {
        console.log('Audio compression finished');

        const compressedAudioBuffer = fs.readFileSync(audioPath);
        req.files.audioFile[0].buffer = compressedAudioBuffer;

        // Delete the temporary audio file
        fs.unlinkSync(audioPath);

        next();
      })
      .on('error', (err) => {
        console.error('Error compressing audio:', err);
        res.status(500).json({ message: 'Error compressing audio. Please try again later.' });
      })
      .save(audioPath);
  } catch (err) {
    console.error('Error in compressAudioMiddleware:', err);
    res.status(500).json({ message: 'Error in compressAudioMiddleware. Please try again later.' });
  }
};

module.exports = compressAudioMiddleware;
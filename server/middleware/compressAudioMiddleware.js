//  middleware/compressionAuidoMiddleware.js

const ffmpeg = require('fluent-ffmpeg');
const stream = require('stream');
const util = require('util');

ffmpeg.setFfmpegPath('/opt/homebrew/bin/ffmpeg');
ffmpeg.setFfprobePath('/opt/homebrew/bin/ffprobe');

const { promisify } = util;
const pipeline = util.promisify(stream.pipeline);

const compressAudioMiddleware = async (req, res, next) => {
  if (!req.files || !req.files.audioFile) {
    return next();
  }

  try {
    const audioFile = req.files.audioFile[0];
    const audioBuffer = audioFile.buffer;
    const tempAudioBuffer = [];

    const audioStream = new stream.PassThrough();
    audioStream.end(audioBuffer);

    const ffmpegCommand = ffmpeg(audioStream)
      .audioCodec('libmp3lame')
      .format('mp3')
      .on('data', chunk => {
        // Push chunks into the tempAudioBuffer array
        tempAudioBuffer.push(chunk);
      })
      .on('end', async () => {
        console.log('Audio compression completed');
        // Concatenate the chunks into a single compressed audio buffer
        const compressedAudioBuffer = Buffer.concat(tempAudioBuffer);
        // Update the request's audio file buffer and mimetype
        req.files.audioFile[0].buffer = compressedAudioBuffer;
        req.files.audioFile[0].mimetype = 'audio/mpeg'; // Update mimetype to audio/mpeg

        // Call the next middleware in the chain
        next();
      })
      .on('error', err => {
        console.error('FFmpeg error:', err);
        res.status(500).json({ message: 'Internal server error during audio compression' });
      });

    // Run the ffmpeg command
    ffmpegCommand.run();
  } catch (error) {
    console.error('Error compressing audio:', error);
    res.status(500).json({ message: 'Internal server error during audio compression' });
  }
};

module.exports = { compressAudioMiddleware };

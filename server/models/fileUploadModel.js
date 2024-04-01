
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  audio: {
    filename: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    compressedSize: {
      type: Number,
      required: true
    },
    mimetype: {
      type: String,
      required: true
    }
  },
  image: {
    filename: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    compressedSize: {
      type: Number,
      required: true
    },
    mimetype: {
      type: String,
      required: true
    }
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
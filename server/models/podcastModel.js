const mongoose = require("mongoose");

const podcastSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      // Add this line
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    audio: {
      filename: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      size: {
        type: Number,
        required: true,
      },
      mimetype: {
        type: String,
        required: true,
      },
    },
    image: {
      filename: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      size: {
        type: Number,
        required: true,
      },
      mimetype: {
        type: String,
        required: true,
      },
    },
    playCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    verifyPodcast: {
      type: Boolean,
      default: false,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timeseries: true }
);

// search index
podcastSchema.index({ title: "text", description: "text" });
const File = mongoose.model("File", podcastSchema);

module.exports = File;

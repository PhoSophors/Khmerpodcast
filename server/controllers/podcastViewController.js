const Podcast = require('../models/podcastModel');

exports.incrementViewCount = async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }

    podcast.viewCount += 1;
    await podcast.save();

    res.json(podcast);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.incrementPlayCount = async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }

    podcast.playCount += 1;
    await podcast.save();

    res.json(podcast);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

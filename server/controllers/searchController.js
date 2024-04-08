// controller/searchContrller.js

const File = require("../models/fileUploadModel");

const searchPodcasts = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({ message: "Search query parameter is required" });
    }

    console.log(`Searching for podcasts with term: ${search}`);

    // Split the search string into words and create a regular expression that matches any part of the words
    const searchWords = search.split(' ').map(word => `.*${word}.*`);
    const searchRegex = new RegExp(searchWords.join('|'), 'i');

   
    const podcasts = await File.find({
      $or: [
        { "title": { $regex: searchRegex } },
        { "description": { $regex: searchRegex } }
      ]
    });

    console.log(`Found ${podcasts.length} podcasts`);

    res.json(podcasts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { searchPodcasts };
// controller/searchContrller.js

const File = require("../models/podcastModel");
const User = require("../models/userModel");

const searchPodcasts = async (req, res) => {
  try {
    const { search } = req.query;
    const { use } = req;

    if (!search) {
      return res
        .status(400)
        .json({ message: "Search query parameter is required" });
    }

    // Split the search string into words and create a regular expression that matches any part of the words
    const searchWords = search.split(" ").map((word) => `.*${word}.*`);
    const searchRegex = new RegExp(searchWords.join("|"), "i");

    let query = {
      $or: [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
      ],
    };

    // If the user is not an admin, only return podcasts that have been verified
    if (req.user !== "admin") {
      query.verifyPodcast = true;
    }

    const podcasts = await File.find(query);

    res.json(podcasts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res
        .status(400)
        .json({ message: "Search query parameter is required" });
    }

    // Split the search string into words and create a regular expression that matches any part of the words
    const searchWords = search.split(" ").map((word) => `.*${word}.*`);
    const searchRegex = new RegExp(searchWords.join("|"), "i");

    const users = await User.find({
      $or: [
        { username: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
      ],
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = { searchPodcasts, searchUsers };

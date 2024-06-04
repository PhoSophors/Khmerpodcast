const User = require("../models/userModel");
const File = require("../models/fileUploadModel");

// Function to add podcast to playlist ================================================================
const addPodcastToFavorites = async (req, res) => {
  try {
    const { id } = req.params; // ID of the file to add to favorites
    const userId = req.user.id; // ID of the user making the request

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the file by ID
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Check if the file is already in the user's favorites
    if (user.favorites.includes(id)) {
      return res.status(400).json({ message: "File already in favorites" });
    }

    // Add the file to the user's favorites
    user.favorites.push(id);
    await user.save();

    res.json({ message: "File added to favorites successfully" });
  } catch (error) {
    console.error("Error adding file to favorites:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to remove podcast playlist from user favorites ================================================================
const removePodcastFromFavorites = async (req, res) => {
  try {
    const { id } = req.params; // ID of the file to remove from favorites
    const userId = req.user.id; // ID of the user making the request

    // Check if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the file is in the user's favorites
    const index = user.favorites.indexOf(id);
    if (index === -1) {
      return res.status(400).json({ message: "Podcast not in favorites" });
    }

    // Remove the file from the user's favorites
    user.favorites.splice(index, 1);
    await user.save();

    res.json({ message: "Podcast removed from favorites successfully" });
  } catch (error) {
    console.error("Error removing Podcast from favorites:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to get all podcast playlist from user add to favorites ================================================================
const getPodcastFavorites = async (req, res) => {
  try {
    const id = req.user.id; // ID of the user making the request

    // Find the user by ID and populate the 'favorites' field
    const user = await User.findById(id).populate("favorites");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user's favorites
    res.json(user.favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addPodcastToFavorites,
  removePodcastFromFavorites,
  getPodcastFavorites,
};

const mongoose = require("mongoose");
const User = require("../models/userModel");
const connectDB =
  "mongodb+srv://phosophors097:wRhPlwq5O0aRcR9j@cluster2.w13p7um.mongodb.net/?retryWrites=true&w=majority";

const updateUserField = async () => {
  try {
    await mongoose.connect(connectDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const users = await User.find({});
    for (let user of users) {
      let isUpdated = false;

      // if (!user.bio) {
      //   user.bio = "";
      //   isUpdated = true;
      // }
      
      if (!user.facebook) {
        user.facebook = "";
        isUpdated = true;
      }

      // if (!user.website) {
      //   user.website = "";
      //   isUpdated = true;
      // }

      // if (!user.twitter) {
      //   user.twitter = "";
      //   isUpdated = true;
      // }
      // if (!user.instagram) {
      //   user.instagram = "";
      //   isUpdated = true;
      // }
      // if (!user.youtube) {
      //   user.youtube = "";
      //   isUpdated = true;
      // }
      // if (!user.tiktok) {
      //   user.tiktok = "";
      //   isUpdated = true;
      // }

      if (isUpdated) {
        await user.save();
      }
    }

    console.log("All users updated");
    process.exit(0);
  } catch (error) {
    console.error("Error updating users:", error);
    process.exit(1);
  }
};

updateUserField();

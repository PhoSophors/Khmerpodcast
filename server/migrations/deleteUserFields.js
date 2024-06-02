const mongoose = require("mongoose");
const User = require("../models/userModel");
const connectDB =
  "mongodb+srv://phosophors097:wRhPlwq5O0aRcR9j@cluster2.w13p7um.mongodb.net/?retryWrites=true&w=majority";

const deleteUserFields = async () => {
  try {
    await mongoose.connect(connectDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await User.updateMany(
      {},
      {
        $unset: {
          // bio: "",
          // twitter: "",
          // instagram: "",
          // youtube: "",
          // tiktok: "",
          location: "",
          // website: "",
        },
      }
    );

    console.log("All users updated");
    process.exit(0);
  } catch (error) {
    console.error("Error updating users:", error);
    process.exit(1);
  }
};

deleteUserFields();

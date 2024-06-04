// controllers/getStorageInfo.js

const { ListObjectsCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../config/s3Helpers");

// Function to fetch storage information
const getPodcastStorageInfoFromS3 = async () => {
  try {
    // Send a request to list objects in the bucket
    const command = new ListObjectsCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
    });
    const response = await s3Client.send(command);

    // Calculate total size of all objects
    const totalSize = response.Contents.reduce((acc, obj) => acc + obj.Size, 0);

    // Calculate total number of objects
    const totalObjects = response.Contents.length;

    return { totalSize, totalObjects };
  } catch (error) {
    console.error("Error fetching storage information:", error);
    throw error;
  }
};

const getUserProfileStorageFromS3 = async () => {
  try {
    // Send a request to list objects in the bucket
    const command = new ListObjectsCommand({
      Bucket: process.env.AWS_BUCKET_NAME_PROFILE,
    });
    const response = await s3Client.send(command);

    // Calculate total size of all objects
    const totalSize = response.Contents.reduce((acc, obj) => acc + obj.Size, 0);

    // Calculate total number of objects
    const totalObjects = response.Contents.length;

    return { totalSize, totalObjects };
  } catch (error) {
    console.error("Error fetching storage information:", error);
    throw error;
  }
};

module.exports = { getPodcastStorageInfoFromS3, getUserProfileStorageFromS3 };

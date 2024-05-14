// controllers/getStorageInfo.js

const { S3Client, ListObjectsCommand } = require("@aws-sdk/client-s3");

// Create an S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
});

// Function to fetch storage information
const getStorageInfoFromS3 = async () => {
  try {
    // Send a request to list objects in the bucket
    const command = new ListObjectsCommand({
      Bucket: process.env.AWS_BUCKET_NAME
    });
    const response = await s3Client.send(command);

    // Calculate total size of all objects
    const totalSize = response.Contents.reduce((acc, obj) => acc + obj.Size, 0);

    // Calculate total number of objects
    const totalObjects = response.Contents.length;

    return { totalSize, totalObjects };
  } catch (error) {
    console.error('Error fetching storage information:', error);
    throw error;
  }
};

module.exports = { getStorageInfoFromS3 };

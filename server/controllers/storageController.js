// const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");

// const s3Client = new S3Client({ region: process.env.AWS_REGION });

// const getBucketSize = async () => {
//   try {
//     const command = new ListObjectsV2Command({ Bucket: process.env.AWS_BUCKET_NAME });
//     const response = await s3Client.send(command);

//     let totalSize = 0;
//     for (let object of response.Contents) {
//       totalSize += object.Size;
//     }

//     // Convert totalSize to a human-readable format (e.g., MB or GB)
//     const formattedSize = formatBytes(totalSize);

//     return formattedSize;
//   } catch (error) {
//     console.error("Error:", error);
//     throw error;
//   }
// };

// // Helper function to format bytes into a human-readable format
// const formatBytes = (bytes) => {
//   if (bytes === 0) return '0 Bytes';
//   const k = 1024;
//   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// };

// const MAX_RETRIES = 3;
// let retries = 0;

// const getBucketSizeWithRetry = async () => {
//   try {
//     const size = await getBucketSize();
//     return size;
//   } catch (error) {
//     if (retries < MAX_RETRIES) {
//       retries++;
//       console.error(`Retrying (${retries}/${MAX_RETRIES})...`);
//       await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
//       return getBucketSizeWithRetry();
//     } else {
//       throw new Error(`Max retries (${MAX_RETRIES}) reached. Unable to get bucket size.`);
//     }
//   }
// };

// getBucketSizeWithRetry()
//   .then((size) => console.log("Bucket size:", formatBytes(size)))
//   .catch((error) => console.error("Error getting bucket size:", error));

// module.exports = { getBucketSizeWithRetry, formatBytes };

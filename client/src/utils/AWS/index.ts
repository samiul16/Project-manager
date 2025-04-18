import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
});

const s3 = new AWS.S3();

export const getSignedUrl = (key: string | undefined) => {
  if (!key) return undefined;
  const params = {
    Bucket: "aimsbay-project-manager",
    Key: key,
    Expires: 3600, // URL expires in 1 hour
  };

  try {
    const url = s3.getSignedUrl("getObject", params);
    return url;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw error;
  }
};

export const uploadToS3 = async (file: File, context: string) => {
  try {
    const params = {
      Bucket: "aimsbay-project-manager",
      Key: `uploads/${context}/${file.name}`,
      Body: file,
      ContentType: file.type,
    };

    const uploadResponse = await s3.upload(params).promise();
    return uploadResponse.Location;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
};

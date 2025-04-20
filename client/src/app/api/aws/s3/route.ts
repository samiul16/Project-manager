import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

console.log("s3Client", s3Client);
console.log("process.env.AWS_REGION", process.env.AWS_REGION);
console.log("process.env.AWS_ACCESS_KEY", process.env.AWS_ACCESS_KEY_ID);
console.log("process.env.AWS_SECRET_KEY", process.env.AWS_SECRET_ACCESS_KEY);
console.log("process.env.AWS_S3_BUCKET_NAME", process.env.AWS_S3_BUCKET_NAME);
export async function POST(
  request: Request,
  { params }: { params: { context: string } }
) {
  try {
    console.log("params", params);
    const { filename, filetype } = await request.json();
    console.log("filename", filename);
    console.log("filetype", filetype);

    if (!filetype.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // const key = `${params.context}/${filename}`;
    console.log(
      "process.env.AWS_S3_BUCKET_NAME",
      process.env.AWS_S3_BUCKET_NAME
    );
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: filename,
      ContentType: filetype,
    });
    console.log("command", command);

    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    return NextResponse.json({ url, key: filename });
  } catch (error) {
    console.error("S3 Pre-Signed URL Error:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}

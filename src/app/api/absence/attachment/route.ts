import { NextRequest, NextResponse } from "next/server";

import mime from "mime";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const authorization = req.headers.get("Authorization");
  const token = authorization?.split(" ")[1];

  const file = data.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "File is required." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    jwt.verify(token!, process.env.SECRET_KEY as string) as User;
  } catch (e) {
    return NextResponse.json(
      { ok: false, message: "Invalid Token" },
      { status: 401 }
    );
  }

  try {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${file.name.replace(
      /\.[^/.]+$/,
      ""
    )}-${uniqueSuffix}.${mime.getExtension(file.type)}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: "gri-apps",
        Key: `absence/${filename}`,
        Body: buffer,
        ACL: "public-read",
      })
    );

    return NextResponse.json({ fileUrl: filename });
  } catch (e) {
    console.error("Error while trying to upload a file\n", e);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

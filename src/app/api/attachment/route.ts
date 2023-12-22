import { NextRequest, NextResponse } from "next/server";

import mime from "mime";
import { join } from "path";
import { stat, mkdir, writeFile } from "fs/promises";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const authorization = req.headers.get("Authorization");
  const token = authorization?.split(" ")[1];

  const file = data.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "File is required." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const relativeUploadDir = `/uploads`;
  const uploadDir = join(process.cwd(), "public", relativeUploadDir);

  try {
    jwt.verify(token!, process.env.SECRET_KEY as string) as User;
  } catch (e) {
    return NextResponse.json(
      { ok: false, message: "Invalid Token" },
      { status: 401 }
    );
  }

  try {
    await stat(uploadDir);
  } catch (e: any) {
    if (e.code === "ENOENT") {
      await mkdir(uploadDir, { recursive: true });
    } else {
      console.error(
        "Error while trying to create directory when uploading a file\n",
        e
      );
      return NextResponse.json(
        { error: "Something went wrong." },
        { status: 500 }
      );
    }
  }

  try {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${file.name.replace(
      /\.[^/.]+$/,
      ""
    )}-${uniqueSuffix}.${mime.getExtension(file.type)}`;
    await writeFile(`${uploadDir}/${filename}`, buffer);
    return NextResponse.json({ fileUrl: `${relativeUploadDir}/${filename}` });
  } catch (e) {
    console.error("Error while trying to upload a file\n", e);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

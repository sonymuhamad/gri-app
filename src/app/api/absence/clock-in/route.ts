import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { getTodayAndTomorrow, generateRandomNumber } from "@/lib/utils";
import prisma from "@/db/db";
import { User } from "@prisma/client";

type ReqBody = {
  file_url?: string;
  pose?: number;
};

export async function POST(req: NextRequest) {
  const authorization = req.headers.get("Authorization");
  const token = authorization?.split(" ")[1];
  const data = (await req.json()) as ReqBody;

  const [today, tomorrow] = getTodayAndTomorrow();

  let userId: number;
  try {
    const credentials = jwt.verify(
      token!,
      process.env.SECRET_KEY as string
    ) as User;
    userId = credentials.id;
  } catch (e) {
    return NextResponse.json(
      { ok: false, message: "Invalid Token" },
      { status: 401 }
    );
  }

  const absense = await prisma.absence.findFirst({
    where: {
      created_at: {
        gte: today.toISOString(),
        lt: tomorrow.toISOString(),
      },
      id_user: userId,
    },
  });

  if (!!absense) {
    return NextResponse.json(
      {
        ok: false,
        message: "Anda sudah absen hari ini",
      },
      {
        status: 409,
      }
    );
  }

  if (!data.file_url) {
    return NextResponse.json({
      ok: false,
      message: "File url is required",
    });
  }

  if (!data.pose) {
    return NextResponse.json({
      ok: false,
      message: "Pose is required",
    });
  }

  await prisma.absence.create({
    data: {
      clock_in_file_url: data.file_url,
      id_user: userId,
      pose: data.pose,
    },
  });

  return NextResponse.json({
    ok: true,
    message: "Absen masuk berhasil",
  });
}

export async function GET(req: NextRequest) {
  const authorization = req.headers.get("Authorization");
  const token = authorization?.split(" ")[1];

  const [today, tomorrow] = getTodayAndTomorrow();

  let userId: number;
  try {
    const credentials = jwt.verify(
      token!,
      process.env.SECRET_KEY as string
    ) as User;
    userId = credentials.id;
  } catch (e) {
    return NextResponse.json(
      { ok: false, message: "Invalid Token" },
      { status: 401 }
    );
  }

  const absense = await prisma.absence.findFirst({
    where: {
      created_at: {
        gte: today.toISOString(),
        lt: tomorrow.toISOString(),
      },
      id_user: userId,
    },
  });

  if (!absense) {
    return NextResponse.json(
      {
        ok: false,
        message: "Anda belum absen hari ini",
        clock_in: false,
        clock_out: false,
        clock_in_at: null,
        clock_out_at: null,
        pose: generateRandomNumber(),
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Anda sudah absen hari ini",
    clock_in: true,
    clock_out: !!absense.clock_out_file_url,
    clock_in_at: absense.created_at,
    clock_out_at: absense.clock_out_at,
    pose: absense.pose,
  });
}

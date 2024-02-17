import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import prisma from "@/db/db";
import { User } from "@prisma/client";
import { getTodayAndTomorrow } from "@/lib/utils";

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
    select: {
      user: true,
      id: true,
      clock_out_file_url: true,
      pose: true,
    },
  });

  if (!absense) {
    return NextResponse.json(
      {
        ok: false,
        message: "Anda belum absen hari ini",
      },
      {
        status: 404,
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
    return NextResponse.json(
      {
        ok: false,
        message: "Pose is required",
      },
      {
        status: 400,
      }
    );
  }

  if (absense.clock_out_file_url) {
    return NextResponse.json(
      {
        ok: false,
        message: "Anda sudah absen keluar",
      },
      {
        status: 409,
      }
    );
  }

  if (Number(data.pose) !== absense.pose) {
    return NextResponse.json(
      {
        ok: false,
        message: "Pose tidak sama",
      },
      {
        status: 422,
      }
    );
  }

  await prisma.absence.update({
    where: {
      id: absense.id,
    },
    data: {
      clock_out_file_url: data.file_url,
      clock_out_at: new Date(),
    },
  });

  return NextResponse.json({
    ok: true,
    message: "Absen keluar berhasil",
  });
}

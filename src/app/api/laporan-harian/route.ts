import { NextRequest, NextResponse } from "next/server";

import prisma from "@/db/db";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

type ReqBody = {
  id_bidang_pekerjaan: number;
  notes: string;
  pekerjaan: {
    id_sub_pekerjaan: number;
    notes: string;
    volume: number;
    file_url: string;
  }[];
};

export async function POST(req: NextRequest) {
  const authorization = req.headers.get("Authorization");
  const token = authorization?.split(" ")[1];
  const data = (await req.json()) as ReqBody;

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

  try {
    await prisma.$transaction(async (tx) => {
      const { id_bidang_pekerjaan, notes, pekerjaan } = data;

      if (!id_bidang_pekerjaan) {
        throw new PrismaClientKnownRequestError(
          "id_bidang_pekerjaan is Required",
          {
            clientVersion: "2.19.0",
            code: "p2002",
          }
        );
      }

      const laporan = await tx.laporan.create({
        data: {
          id_bidang_pekerjaan,
          notes: notes,
          id_user: userId,
        },
      });
      await tx.laporan_Harian.createMany({
        data: pekerjaan.map((data) => ({ ...data, id_laporan: laporan.id })),
      });
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          ok: false,
          message: e.message,
        },
        { status: 400 }
      );
    }
  }
}

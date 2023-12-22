import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/db/db";
import { User } from "@prisma/client";

export async function GET(req: Request) {
  const authorization = req.headers.get("Authorization");
  const token = authorization?.split(" ")[1];

  try {
    const credentials = jwt.verify(
      token!,
      process.env.SECRET_KEY as string
    ) as User;

    const user = await prisma.user.findUnique({
      where: {
        id: credentials.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        proyek: {
          select: {
            id: true,
            nama: true,
            kode: true,
            tanggal: true,
            lokasi: true,
            notes: true,
            bidang_pekerjaan: {
              select: {
                id: true,
                nama: true,
                kode: true,
                notes: true,
                pekerjaan: {
                  select: {
                    id: true,
                    nama: true,
                    notes: true,
                    sub_pekerjaan: {
                      select: {
                        id: true,
                        nama: true,
                        notes: true,
                        target_volume: true,
                        satuan: {
                          select: {
                            id: true,
                            nama: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    return NextResponse.json({ ok: true, data: user?.proyek });
  } catch (e) {
    return NextResponse.json({ message: "Invalid Token" }, { status: 401 });
  }
}

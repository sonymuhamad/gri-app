import { NextRequest, NextResponse } from "next/server";

import prisma from "@/db/db";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { isValidDate } from "@/lib/utils";

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

export async function GET(req: NextRequest) {
  const authorization = req.headers.get("Authorization");
  const token = authorization?.split(" ")[1];
  const searchParams = req.nextUrl.searchParams;
  const tgl_query = searchParams.get("tanggal");

  if (!tgl_query) {
    return NextResponse.json(
      {
        ok: false,
        message: "Tanggal in query params is required",
      },
      { status: 400 }
    );
  }

  if (!isValidDate(tgl_query)) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid date format, it must be dd/mm/yyyy",
      },
      {
        status: 400,
      }
    );
  }

  const [day, month, years] = tgl_query.split("/");
  const queryDate = new Date(Number(years), Number(month) - 1, Number(day));
  const queryDatePlusOne = new Date(
    Number(years),
    Number(month) - 1,
    Number(day) + 1
  );

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

  const pekerjaan = await prisma.pekerjaan.findMany({
    where: {
      sub_pekerjaan: {
        some: {
          laporan_harian: {
            some: {
              created_at: {
                gte: queryDate.toISOString(),
                lt: queryDatePlusOne.toISOString(),
              },
              laporan: {
                id_user: userId,
              },
            },
          },
        },
      },
    },
    select: {
      id: true,
      nama: true,
      sub_pekerjaan: {
        where: {
          laporan_harian: {
            some: {
              created_at: {
                gte: queryDate.toISOString(),
                lt: queryDatePlusOne.toISOString(),
              },
              laporan: {
                id_user: userId,
              },
            },
          },
        },
        select: {
          id: true,
          nama: true,
          target_volume: true,
          satuan: true,
          laporan_harian: {
            where: {
              created_at: {
                gte: queryDate.toISOString(),
                lt: queryDatePlusOne.toISOString(),
              },
              laporan: {
                id_user: userId,
              },
            },
            include: {
              laporan: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const pekerjaans = pekerjaan.map(({ id, nama, sub_pekerjaan }) => {
    const laporans: any[] = [];

    sub_pekerjaan.forEach(({ nama, target_volume, satuan, laporan_harian }) => {
      laporan_harian.forEach(
        ({ volume, notes, id, file_url, created_at, laporan: { user } }) => {
          laporans.push({
            id_laporan: id,
            actual: volume,
            file_url,
            nama_sub_pekerjaan: nama,
            target_volume,
            satuan: satuan.nama,
            pic: user.name,
            created_at,
            notes,
          });
        }
      );
    });

    return {
      id,
      nama_pekerjaan: nama,
      laporan_harian: laporans,
    };
  });

  return NextResponse.json({
    ok: true,
    data: pekerjaans,
  });
}

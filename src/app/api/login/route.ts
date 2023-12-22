import { NextResponse } from "next/server";
import prisma from "@/db/db";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { email, password } = (await req.json()) as {
    email: string;
    password: string;
  };

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: {
      proyek: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid Email",
      },
      { status: 400 }
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid Password",
      },
      {
        status: 400,
      }
    );
  }

  if (!user.proyek) {
    return NextResponse.json(
      {
        ok: false,
        message: "Mohon maaf, Anda belum memiliki proyek.",
      },
      {
        status: 400,
      }
    );
  }

  if (!user.proyek.is_active) {
    return NextResponse.json(
      {
        ok: false,
        message: "Mohon maaf, Proyek anda tidak aktif",
      },
      {
        status: 400,
      }
    );
  }

  if (!user.is_active) {
    return NextResponse.json(
      {
        ok: false,
        message: "Mohon maaf, Akun anda tidak aktif",
      },
      {
        status: 400,
      }
    );
  }

  const token = jwt.sign(
    { name: user.name, id: user.id, email: user.email },
    process.env.SECRET_KEY as string,
    {
      expiresIn: "365d",
    }
  );

  return NextResponse.json({
    ok: true,
    access_token: token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      proyek: {
        id_proyek: user.proyek?.id,
        nama_proyek: user.proyek?.nama,
      },
    },
  });
}

"use server";

import { RedirectType, redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";

import { USER_DATA } from "@/const/project";
import prisma from "@/db/db";
import { AuthForm } from "@/schema/auth";

export default async function Login(credentials: AuthForm) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: credentials.email,
      },
    });

    if (!user) {
      throw new Prisma.PrismaClientKnownRequestError("Invalid Email", {
        clientVersion: "2.19.0",
        code: "p2002",
      });
    }

    const userExists = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!userExists) {
      throw new Prisma.PrismaClientKnownRequestError("Invalid Password", {
        clientVersion: "2.19.0",
        code: "p2002",
      });
    }

    cookies().set(USER_DATA, JSON.stringify({ id: user.id, nama: user.name }));
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        error: true,
        message: e.message,
      };
    }
  }
}

export async function Logout() {
  cookies().delete(USER_DATA);
  redirect("/", RedirectType.replace);
}

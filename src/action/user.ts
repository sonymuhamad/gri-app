"use server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

import prisma from "@/db/db";
import { EditUserForm, RegisterUserForm } from "@/schema/user";

export async function CreateUser(credentials: RegisterUserForm) {
  try {
    await prisma.user.create({
      data: credentials,
    });
    revalidatePath("/admin/user", "page");
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        error: true,
        message: e.message,
      };
    }
  }
}

export async function EditUser(credentials: EditUserForm, idUser: number) {
  try {
    await prisma.user.update({
      where: {
        id: idUser,
      },
      data: {
        ...credentials,
      },
    });
    revalidatePath("/admin/user", "page");
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        error: true,
        message: e.message,
      };
    }
  }
}

export async function ChangeStatusUser(status: boolean, idUser: number) {
  await prisma.user.update({
    where: {
      id: idUser,
    },
    data: {
      is_active: status,
    },
  });
  revalidatePath("/admin/user", "page");
}

export async function SetUserProyek(idProyek: number, idUser: number) {
  await prisma.user.update({
    where: {
      id: idUser,
    },
    data: {
      id_proyek: idProyek,
    },
  });
  revalidatePath("/admin/user", "page");
}

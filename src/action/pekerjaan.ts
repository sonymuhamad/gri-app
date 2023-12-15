"use server";

import { RegisterPekerjaanForm } from "@/schema/pekerjaan";
import prisma from "@/db/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function RegisterPekerjaan(credentials: RegisterPekerjaanForm) {
  try {
    await prisma.pekerjaan.create({
      data: credentials,
    });
    revalidatePath(
      "/admin/proyek/[id]/pekerjaan/[id-bidang-pekerjaan]",
      "page"
    );
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        error: true,
        message: e.message,
      };
    }
  }
}

export async function EditPekerjaan(
  credentials: RegisterPekerjaanForm,
  idPekerjaan: number
) {
  try {
    await prisma.pekerjaan.update({
      where: {
        id: idPekerjaan,
      },
      data: {
        ...credentials,
      },
    });
    revalidatePath(
      "/admin/proyek/[id]/pekerjaan/[id-bidang-pekerjaan]",
      "page"
    );
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        error: true,
        message: e.message,
      };
    }
  }
}

export async function ChangeStatusPekerjaan(
  status: boolean,
  idPekerjaan: number
) {
  await prisma.pekerjaan.update({
    where: {
      id: idPekerjaan,
    },
    data: {
      is_active: status,
    },
  });
  revalidatePath("/admin/proyek/[id]/pekerjaan/[id-bidang-pekerjaan]", "page");
}

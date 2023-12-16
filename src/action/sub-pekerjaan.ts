"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import prisma from "@/db/db";

import {
  RegisterSubPekerjaanForm,
  SubPekerjaanForm,
} from "@/schema/sub-pekerjaan";

export async function RegisterSubPekerjaan(credentials: SubPekerjaanForm) {
  try {
    await prisma.sub_Pekerjaan.create({
      data: credentials as unknown as RegisterSubPekerjaanForm,
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

export async function UpdateSubPekerjaan(
  credentials: SubPekerjaanForm,
  idSubPekerjaan: number
) {
  try {
    await prisma.sub_Pekerjaan.update({
      where: {
        id: idSubPekerjaan,
      },
      data: {
        ...(credentials as unknown as RegisterSubPekerjaanForm),
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

export async function ChangeStatusSubPekerjaan(
  status: boolean,
  idSubPekerjaan: number
) {
  await prisma.sub_Pekerjaan.update({
    where: {
      id: idSubPekerjaan,
    },
    data: {
      is_active: status,
    },
  });
  revalidatePath("/admin/proyek/[id]/pekerjaan/[id-bidang-pekerjaan]", "page");
}

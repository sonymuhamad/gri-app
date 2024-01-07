"use server";

import prisma from "@/db/db";
import { RegisterBidangPekerjaanForm } from "@/schema/bidang-pekerjaan";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function RegisterBidangPekerjaan(
  data: RegisterBidangPekerjaanForm
) {
  try {
    await prisma.bidang_Pekerjaan.create({
      data: data,
    });
    revalidatePath("/admin/proyek/[id]", "page");
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        error: true,
        message: e.message,
      };
    }
  }
}

export async function UpdateBidangPekerjaan(
  data: RegisterBidangPekerjaanForm,
  idBidangPekerjaan: number
) {
  try {
    await prisma.bidang_Pekerjaan.update({
      where: {
        id: idBidangPekerjaan,
      },
      data: {
        ...data,
      },
    });
    revalidatePath("/admin/proyek/[id]", "page");
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        error: true,
        message: e.message,
      };
    }
  }
}

export async function ChangeStatusBidangPekerjaan(
  status: boolean,
  idBidangPekerjaan: number
) {
  await prisma.bidang_Pekerjaan.update({
    where: {
      id: idBidangPekerjaan,
    },
    data: {
      is_active: status,
    },
  });
  revalidatePath("/admin/proyek/[id]", "page");
}

export async function GetBidangPekerjaan(idProyek?: number) {
  return await prisma.bidang_Pekerjaan.findMany({
    where: {
      id_proyek: idProyek,
    },
  });
}

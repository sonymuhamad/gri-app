"use server";

import { RegisterBidangPekerjaanForm } from "@/schema/bidang-pekerjaan";
import { PrismaClient, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function RegisterBidangPekerjaan(
  data: RegisterBidangPekerjaanForm
) {
  const prisma = new PrismaClient();

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
  const prisma = new PrismaClient();

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
  const prisma = new PrismaClient();

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

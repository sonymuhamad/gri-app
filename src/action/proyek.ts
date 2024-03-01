"use server";

import prisma from "@/db/db";
import { RegisterProyekForm } from "@/schema/proyek";
import { PrismaClient, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function RegisterProyek(data: RegisterProyekForm) {
  try {
    await prisma.proyek.create({
      data: data,
    });
    revalidatePath("/admin/proyek");
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        error: true,
        message: e.message,
      };
    }
  }
}

export async function ChangeStatusProyek(status: boolean, idProyek: number) {
  await prisma.proyek.update({
    where: {
      id: idProyek,
    },
    data: {
      is_active: status,
    },
  });
  revalidatePath("/admin/proyek");
}

export async function EditProyek(data: RegisterProyekForm, idProyek: number) {
  try {
    await prisma.proyek.update({
      where: {
        id: idProyek,
      },
      data: {
        ...data,
      },
    });
    revalidatePath("/admin/proyek");
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        error: true,
        message: e.message,
      };
    }
  }
}

export async function GetProyek() {
  return await prisma.proyek.findMany();
}

export async function GetDetailProyek(id?: number) {
  return await prisma.proyek.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      bidang_pekerjaan: {
        include: {
          pekerjaan: {
            include: {
              sub_pekerjaan: {
                include: {
                  satuan: true,
                  laporan_harian: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function GetDetailProyekWithDateFilter(
  id?: number,
  startTime?: Date,
  endTime?: Date
) {
  return await prisma.proyek.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      bidang_pekerjaan: {
        include: {
          pekerjaan: {
            include: {
              sub_pekerjaan: {
                include: {
                  satuan: true,
                  laporan_harian: {
                    where: {
                      created_at: {
                        lte: endTime,
                        gte: startTime,
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
}

"use server";

import prisma from "@/db/db";

export async function CreateSatuan(nama: string) {
  return await prisma.satuan.create({
    data: {
      nama,
    },
  });
}

export async function GetSatuan() {
  return await prisma.satuan.findMany();
}

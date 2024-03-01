"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import prisma from "@/db/db";

import {
  RegisterSubPekerjaanForm,
  SubPekerjaanForm,
} from "@/schema/sub-pekerjaan";

export async function RegisterSubPekerjaan(
  credentials: SubPekerjaanForm,
  idProyek: number
) {
  const subPekerjaan = await GetSubPekerjaanByProyekID(idProyek);

  const currentTotalBobot = subPekerjaan.reduce((prev, current) => {
    return prev + (current.bobot ?? 0);
  }, 0);

  if (currentTotalBobot + credentials.bobot > 100) {
    return {
      error: true,
      message: "Bobot pekerjaan di Proyek ini sudah melebihi 100%",
    };
  }

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
  idSubPekerjaan: number,
  idProyek: number
) {
  const subPekerjaan = await prisma.sub_Pekerjaan.findUnique({
    where: {
      id: idSubPekerjaan,
    },
  });

  if (!subPekerjaan) {
    return {
      error: true,
      message: "Pekerjaan not found",
    };
  }

  const subPekerjaans = await GetSubPekerjaanByProyekID(idProyek);

  const currentTotalBobot = subPekerjaans.reduce((prev, current) => {
    return prev + (current.bobot ?? 0);
  }, 0);

  if (currentTotalBobot - (subPekerjaan.bobot ?? 0) + credentials.bobot > 100) {
    return {
      error: true,
      message: "Bobot pekerjaan di Proyek ini sudah melebihi 100%",
    };
  }

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

export async function GetSubPekerjaanByProyekID(idProyek: number) {
  return await prisma.sub_Pekerjaan.findMany({
    where: {
      pekerjaan: {
        bidang_pekerjaan: {
          proyek: {
            id: idProyek,
          },
        },
      },
    },
    include: {
      pekerjaan: {
        include: {
          bidang_pekerjaan: {
            include: {
              proyek: true,
            },
          },
        },
      },
      laporan_harian: true,
    },
  });
}

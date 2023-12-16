import { Badge } from "@mantine/core";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import PekerjaanSection from "./_components/pekerjaan-section";

export default async function DetailBidangPekerjaanPage({
  params,
}: {
  params: { "id-bidang-pekerjaan": string };
}) {
  const prisma = new PrismaClient();

  const bidangPekerjaan = await prisma.bidang_Pekerjaan.findUnique({
    where: {
      id: Number(params["id-bidang-pekerjaan"]),
    },
    include: {
      proyek: true,
      pekerjaan: {
        include: {
          sub_pekerjaan: {
            include: {
              satuan: true,
            },
          },
        },
      },
    },
  });

  if (!bidangPekerjaan) {
    notFound();
  }

  const { nama, pekerjaan, proyek, kode, is_active, notes } = bidangPekerjaan;

  return (
    <div className="flex flex-col space-y-12 h-full">
      <section className="bg-white rounded-lg shadow-md p-8 space-y-6  w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{proyek.nama}</h1>
        <div className="flex flex-col">
          <div className="space-x-6 flex flex-row items-center">
            <label className="text-gray-400 font-semibold">
              Bidang Pekerjaan
            </label>
            <Badge color={is_active ? "green" : "red"} size="sm">
              {is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <span className="text-gray-700">{nama}</span>
        </div>
        <div className="grid grid-cols-2 text-sm w-[50%] gap-12 mb-4">
          <div className="flex flex-col">
            <label className="text-gray-400 font-semibold">
              Kode Bidang Pekerjaan
            </label>
            <span className="text-gray-700">{kode}</span>
          </div>
          <div className="flex flex-col">
            <label className="text-gray-400 font-semibold">
              Catatan Bidang Pekerjaan
            </label>
            <span className="text-gray-700">{notes}</span>
          </div>
        </div>
      </section>

      <PekerjaanSection pekerjaan={pekerjaan} />
    </div>
  );
}

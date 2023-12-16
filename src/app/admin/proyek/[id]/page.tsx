import { notFound } from "next/navigation";
import dayjs from "dayjs";
import { Badge } from "@mantine/core";

import prisma from "@/db/db";
import TambahBidangPekerjaanButton from "./_components/add-button";
import TableBidangPekerjaan from "./_components/table-bidang-pekerjaan";

export default async function DetailProyekPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const proyek = await prisma.proyek.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      bidang_pekerjaan: true,
    },
  });

  if (!proyek) {
    notFound();
  }

  const { nama, kode, tanggal, lokasi, notes, is_active } = proyek;
  const data = [
    {
      label: "Kode",
      value: kode,
    },
    {
      label: "Tanggal",
      value: dayjs(tanggal).format("DD MMMM YYYY"),
    },
    {
      label: "Lokasi",
      value: lokasi,
    },
    {
      label: "Catatan",
      value: notes,
    },
  ];

  return (
    <div className="flex flex-col space-y-12">
      <section className="bg-white rounded-lg shadow-md p-8  w-full">
        <div className="space-x-6 flex flex-row items-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{nama}</h1>

          <Badge color={is_active ? "green" : "red"} className="mb-2.5">
            {is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-12 mb-4">
          {data.map(({ value, label }) => (
            <div className="flex flex-col" key={`${value}-${label}`}>
              <label className="text-gray-400 font-semibold">{label}</label>
              <span className="text-gray-700">{value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col space-y-6">
        <div className="justify-between flex">
          <h2 className="text-xl font-bold ">Bidang Pekerjaan</h2>
          <TambahBidangPekerjaanButton idProyek={Number(id)} />
        </div>

        <TableBidangPekerjaan data={proyek.bidang_pekerjaan} />
      </section>
    </div>
  );
}

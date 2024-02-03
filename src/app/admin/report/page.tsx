import prisma from "@/db/db";
import ProyekFilter from "./_components/proyek-filter";
import { decompressFromEncodedURIComponent } from "lz-string";
import { Bidang_Pekerjaan, Proyek } from "@prisma/client";
import BidangPekerjaanFilter from "./_components/bidang-pekerjaan-filter";
import TableReport from "./_components/table-report";
import DownloadExcelSection from "./_components/download-excel";

export default async function ReportPage({
  searchParams: { p, b },
}: {
  searchParams: {
    p?: string;
    b?: string;
  };
}) {
  let idProyek: number | undefined;
  let idBidangPekerjaan: number | undefined;
  try {
    if (p) {
      const proyek = JSON.parse(decompressFromEncodedURIComponent(p)) as Proyek;
      idProyek = proyek.id;
    } else {
      idProyek = undefined;
    }
  } catch (e) {
    idProyek = undefined;
  }

  try {
    if (b) {
      const bidangPekerjaan = JSON.parse(
        decompressFromEncodedURIComponent(b)
      ) as Bidang_Pekerjaan;
      idBidangPekerjaan = bidangPekerjaan.id;
    } else {
      idBidangPekerjaan = undefined;
    }
  } catch (e) {
    idBidangPekerjaan = undefined;
  }

  const laporan = await prisma.laporan.findMany({
    where: {
      bidang_pekerjaan: {
        id_proyek: idProyek,
      },
      id_bidang_pekerjaan: idBidangPekerjaan,
    },
    include: {
      bidang_pekerjaan: true,
      user: true,
    },
  });

  return (
    <div className="flex flex-col space-y-6">
      <h1 className="text-2xl font-bold">Halaman Laporan Harian</h1>

      <div className="space-x-12 flex flex-row">
        <ProyekFilter />
        <BidangPekerjaanFilter />
        <DownloadExcelSection />
      </div>

      <TableReport laporan={laporan} />
    </div>
  );
}

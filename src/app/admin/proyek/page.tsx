import { PrismaClient } from "@prisma/client";

import TableProyek from "@/app/admin/proyek/_components/table-proyek";
import AddProyekModal from "@/app/admin/proyek/_components/modal";
export default async function ProyekPage() {
  const prisma = new PrismaClient();
  const proyek = await prisma.proyek.findMany();

  return (
    <div className={"flex flex-col space-y-6"}>
      <div className={"flex items-center justify-between"}>
        <h4>Halaman Proyek</h4>

        <AddProyekModal />
      </div>
      <TableProyek proyek={proyek} />
    </div>
  );
}

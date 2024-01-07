import prisma from "@/db/db";

import TambahUser from "./_components/add-user";
import TableUser from "./_components/table-user";

export default async function UserPage() {
  const users = await prisma.user.findMany({
    include: {
      proyek: true,
    },
  });

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Halaman User</h1>
        <TambahUser />
      </div>

      <TableUser users={users} />
    </div>
  );
}

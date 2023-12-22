import prisma from "@/db/db";

import jwt from "jsonwebtoken";

import TambahUser from "./_components/add-user";
import TableUser from "./_components/table-user";

export default async function UserPage() {
  const users = await prisma.user.findMany({
    include: {
      proyek: true,
    },
  });
  console.log(process.env.SECRET_KEY);
  const token = jwt.sign(
    { ok: true, name: "Sony" },
    process.env.SECRET_KEY as string
  );
  const verify = jwt.verify(token, process.env.SECRET_KEY as string);

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Halaman User</h1>
        <TambahUser />
      </div>

      <TableUser users={users} />
    </div>
  );
}

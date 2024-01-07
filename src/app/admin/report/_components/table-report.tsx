"use client";

import usePagination from "@/hooks/usePagination";
import { Pagination, Table } from "@mantine/core";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { useMemo } from "react";

type Laporan = Prisma.LaporanGetPayload<{
  include: {
    user: true;
    bidang_pekerjaan: true;
  };
}>;

export default function TableReport({ laporan }: { laporan: Laporan[] }) {
  const { data, goToPage, totalPages, currentPage } = usePagination(laporan);

  const rows = useMemo(
    () =>
      data.map((laporan) => (
        <Table.Tr key={laporan.id}>
          <Table.Td>{laporan.user.name}</Table.Td>
          <Table.Td>{laporan.bidang_pekerjaan.nama}</Table.Td>
          <Table.Td>
            {dayjs(new Date(laporan.created_at)).format("MMMM D, YYYY")}
          </Table.Td>
          <Table.Td>{laporan.notes}</Table.Td>
        </Table.Tr>
      )),
    [data]
  );

  return (
    <div className="flex flex-col space-y-6">
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead className={"w-full"}>
          <Table.Tr className={"w-full"}>
            <Table.Th>PIC</Table.Th>
            <Table.Th>Bidang Pekerjaan</Table.Th>
            <Table.Th>Tanggal</Table.Th>
            <Table.Th>Notes</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Pagination total={totalPages} value={currentPage} onChange={goToPage} />
    </div>
  );
}

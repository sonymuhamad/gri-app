"use client";

import { useState } from "react";
import Link from "next/link";
import type { Proyek } from "@prisma/client";
import { Table } from "@mantine/core";
import dayjs from "dayjs";
import {
  Menu,
  ActionIcon,
  Badge,
  TextInput,
  Pagination,
  Drawer,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import { ChangeStatusProyek } from "@/action/proyek";
import { notifications } from "@mantine/notifications";
import usePagination from "@/hooks/usePagination";
import EditProyekForm from "./edit-proyek-form";

export default function TableProyek(props: { proyek: Proyek[] }) {
  const { proyek } = props;

  const { data, goToPage, totalPages, currentPage, query, setQuery } =
    usePagination(proyek);

  const [selectedProyek, setSelectedProyek] = useState<Proyek | undefined>();
  const [opened, { open, close }] = useDisclosure(false);

  const rows = data.map((item) => {
    const { id, nama, kode, tanggal, lokasi, is_active } = item;

    return (
      <Table.Tr key={id} className={"w-full"}>
        <Table.Td>
          <Link href={`/admin/proyek/${id}`} className={"hover:underline"}>
            {nama}
          </Link>
        </Table.Td>
        <Table.Td>{kode}</Table.Td>
        <Table.Td>{lokasi}</Table.Td>
        <Table.Td>
          <Badge color={is_active ? "green" : "red"}>
            {is_active ? "Active" : "Inactive"}
          </Badge>
        </Table.Td>
        <Table.Td>{dayjs(tanggal).format("YYYY-MM-DD")}</Table.Td>
        <Table.Td>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant={"default"}>
                <EllipsisVerticalIcon className={"h-5 w-5"} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={<PencilSquareIcon className={"h-4 w-4"} />}
                onClick={() => {
                  setSelectedProyek(item);
                  open();
                }}
              >
                Edit
              </Menu.Item>
              {is_active ? (
                <Menu.Item
                  color={"red"}
                  leftSection={<XMarkIcon className={"h-4 w-4"} />}
                  onClick={async () => {
                    await ChangeStatusProyek(false, id);
                    notifications.show({
                      title: "Action Success",
                      message: "Proyek status changed",
                    });
                  }}
                >
                  {" "}
                  Inactive
                </Menu.Item>
              ) : (
                <Menu.Item
                  color={"green"}
                  leftSection={<CheckIcon className={"h-4 w-4"} />}
                  onClick={async () => {
                    await ChangeStatusProyek(true, id);
                    notifications.show({
                      title: "Action Success",
                      message: "Proyek status changed",
                    });
                  }}
                >
                  Activate
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <div className={"flex flex-col space-y-6"}>
      <Drawer
        position="right"
        opened={opened}
        onClose={close}
        title="Edit Proyek"
      >
        <EditProyekForm data={selectedProyek} onSuccess={() => close()} />
      </Drawer>

      <div className={"w-96"}>
        <TextInput
          leftSection={<MagnifyingGlassIcon className={"w-5 h-5"} />}
          placeholder={"Search Proyek"}
          onChange={(e) => setQuery(e.currentTarget.value)}
          value={query}
        />
      </div>
      <Table>
        <Table.Thead className={"w-full"}>
          <Table.Tr className={"w-full"}>
            <Table.Th>Nama</Table.Th>
            <Table.Th>Kode</Table.Th>
            <Table.Th>Lokasi</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Tanggal</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Pagination total={totalPages} value={currentPage} onChange={goToPage} />
    </div>
  );
}

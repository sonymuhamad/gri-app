"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  Table,
  Badge,
  Menu,
  ActionIcon,
  Pagination,
  Drawer,
} from "@mantine/core";
import { Bidang_Pekerjaan } from "@prisma/client";
import { useMemo } from "react";
import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";

import usePagination from "@/hooks/usePagination";
import { ChangeStatusBidangPekerjaan } from "@/action/bidang-pekerjaan";
import EditBidangPekerjaanForm from "./edit-bidang-pekerjaan-form";

export default function TableBidangPekerjaan({
  data: dataBidangPekerjaan,
}: {
  data: Bidang_Pekerjaan[];
}) {
  const [selectedBidangPekerjaan, setSelectedBidangPekerjaan] =
    useState<Bidang_Pekerjaan>();
  const [opened, { open, close }] = useDisclosure(false);
  const { data, goToPage, totalPages, currentPage } =
    usePagination(dataBidangPekerjaan);
  const pathname = usePathname();

  const rows = useMemo(
    () =>
      data.map((item) => {
        const { id, nama, kode, is_active } = item;

        return (
          <Table.Tr key={id} className={"w-full"}>
            <Table.Td>
              <Link
                href={`${pathname}/pekerjaan/${id}`}
                className={"hover:underline"}
              >
                {nama}
              </Link>
            </Table.Td>
            <Table.Td>{kode}</Table.Td>
            <Table.Td>
              <Badge color={is_active ? "green" : "red"}>
                {is_active ? "Active" : "Inactive"}
              </Badge>
            </Table.Td>
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
                      setSelectedBidangPekerjaan(item);
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
                        await ChangeStatusBidangPekerjaan(false, id);
                        notifications.show({
                          title: "Action Success",
                          message: "Status Bidang Pekerjaan Berhasil Diubah",
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
                        await ChangeStatusBidangPekerjaan(true, id);
                        notifications.show({
                          title: "Action Success",
                          message: "Status Bidang Pekerjaan Berhasil Diubah",
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
      }),
    [data, open, pathname]
  );

  return (
    <div className="space-y-6">
      <Drawer
        position="right"
        opened={opened}
        onClose={close}
        title="Edit Bidang Pekerjaan"
      >
        <EditBidangPekerjaanForm
          bidangPekerjaan={selectedBidangPekerjaan}
          onSuccess={() => close()}
        />
      </Drawer>

      <Table>
        <Table.Thead className={"w-full"}>
          <Table.Tr className={"w-full"}>
            <Table.Th>Nama</Table.Th>
            <Table.Th>Kode</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Pagination total={totalPages} value={currentPage} onChange={goToPage} />
    </div>
  );
}

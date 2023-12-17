"use client";

import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { useMemo } from "react";
import Link from "next/link";
import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  XMarkIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentCheckIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import {
  Table,
  ActionIcon,
  Pagination,
  Menu,
  Badge,
  TextInput,
  Drawer,
  Modal,
} from "@mantine/core";
import { Prisma } from "@prisma/client";

import usePagination from "@/hooks/usePagination";
import { ChangeStatusUser } from "@/action/user";
import FormEditUser from "./edit-user-form";
import ProyekSelectForm from "./user-proyek-form";

type User = Prisma.UserGetPayload<{
  include: {
    proyek: true;
  };
}>;

export default function TableUser({ users }: { users: User[] }) {
  const { data, goToPage, totalPages, currentPage, query, setQuery } =
    usePagination(users);
  const [opened, { open, close }] = useDisclosure(false);
  const [openedModal, { open: openModal, close: closeModal }] =
    useDisclosure(false);

  const [selectedUser, setSelectedUser] = useState<User>();

  const rows = useMemo(
    () =>
      data.map((item) => {
        const { id, name, is_active, email, role, proyek } = item;

        return (
          <Table.Tr key={id} className={"w-full"}>
            <Table.Td>
              <Link href={`/admin/user/${id}`} className={"hover:underline"}>
                {name}
              </Link>
            </Table.Td>
            <Table.Td>{email}</Table.Td>
            <Table.Td>{role}</Table.Td>
            <Table.Td>
              <Badge color={is_active ? "green" : "red"}>
                {is_active ? "Active" : "Inactive"}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Link href={`/admin/proyek/${id}`} className={"hover:underline"}>
                {proyek?.nama}
              </Link>
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
                      setSelectedUser(item);
                      open();
                    }}
                  >
                    Edit
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <ClipboardDocumentCheckIcon className="h-4 w-4" />
                    }
                    onClick={() => {
                      setSelectedUser(item);
                      openModal();
                    }}
                  >
                    Project
                  </Menu.Item>
                  <Menu.Item
                    disabled
                    leftSection={<ArrowPathIcon className="h-4 w-4" />}
                  >
                    Reset Password
                  </Menu.Item>
                  {is_active ? (
                    <Menu.Item
                      color={"red"}
                      leftSection={<XMarkIcon className={"h-4 w-4"} />}
                      onClick={async () => {
                        await ChangeStatusUser(false, id);
                        notifications.show({
                          title: "Action Success",
                          message: "User status changed",
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
                        await ChangeStatusUser(true, id);
                        notifications.show({
                          title: "Action Success",
                          message: "User status changed",
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
    [data, open, openModal]
  );

  return (
    <div className="flex flex-col space-y-6">
      <Drawer
        position="right"
        opened={opened}
        onClose={close}
        title="Edit Proyek"
      >
        <FormEditUser user={selectedUser} onSuccess={() => close()} />
      </Drawer>

      <Modal opened={openedModal} onClose={closeModal} title="Edit Proyek">
        <ProyekSelectForm user={selectedUser} onSuccess={closeModal} />
      </Modal>

      <div className={"w-96"}>
        <TextInput
          leftSection={<MagnifyingGlassIcon className={"w-5 h-5"} />}
          placeholder={"Search User"}
          onChange={(e) => setQuery(e.currentTarget.value)}
          value={query}
        />
      </div>

      <Table>
        <Table.Thead className={"w-full"}>
          <Table.Tr className={"w-full"}>
            <Table.Th>Nama</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Proyek</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Pagination total={totalPages} value={currentPage} onChange={goToPage} />
    </div>
  );
}

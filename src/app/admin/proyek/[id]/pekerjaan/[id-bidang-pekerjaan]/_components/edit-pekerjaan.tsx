"use client";

import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { Drawer, Menu, ActionIcon } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import dynamic from "next/dynamic";
import { Pekerjaan } from "@prisma/client";
import { notifications } from "@mantine/notifications";

import { ChangeStatusPekerjaan } from "@/action/pekerjaan";

const FormEditPekerjaan = dynamic(() => import("./edit-pekerjaan-form"), {
  ssr: false,
});

export default function EditPekerjaan({ pekerjaan }: { pekerjaan: Pekerjaan }) {
  const [opened, { open, close }] = useDisclosure(false);

  const { id, is_active } = pekerjaan;

  return (
    <>
      <Drawer
        position="right"
        opened={opened}
        onClose={close}
        title="Tambah Kategori Pekerjaan"
      >
        <FormEditPekerjaan pekerjaan={pekerjaan} onSuccess={close} />
      </Drawer>

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
                await ChangeStatusPekerjaan(false, id);
                notifications.show({
                  title: "Action Success",
                  message: "Status Kategori Pekerjaan Berhasil Diubah",
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
                await ChangeStatusPekerjaan(true, id);
                notifications.show({
                  title: "Action Success",
                  message: "Status Kategori Pekerjaan Berhasil Diubah",
                });
              }}
            >
              Activate
            </Menu.Item>
          )}
        </Menu.Dropdown>
      </Menu>
    </>
  );
}

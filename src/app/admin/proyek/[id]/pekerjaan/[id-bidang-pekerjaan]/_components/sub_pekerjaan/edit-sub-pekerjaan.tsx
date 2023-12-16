import { Drawer, Menu, ActionIcon } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  PencilSquareIcon,
  XMarkIcon,
  EllipsisVerticalIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { notifications } from "@mantine/notifications";
import { Prisma } from "@prisma/client";

import { ChangeStatusSubPekerjaan } from "@/action/sub-pekerjaan";

import EditSubPekerjaanForm from "./edit-sub-pekerjaan-form";

type SubPekerjaan = Prisma.Sub_PekerjaanGetPayload<{
  include: {
    satuan: true;
  };
}>;

export default function EditSubPekerjaan({
  subPekerjaan,
}: {
  subPekerjaan: SubPekerjaan;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  const { is_active, id } = subPekerjaan;

  return (
    <>
      <Drawer
        position="right"
        opened={opened}
        onClose={close}
        title="Tambah Kategori Pekerjaan"
      >
        <EditSubPekerjaanForm onSuccess={close} subPekerjaan={subPekerjaan} />
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
                await ChangeStatusSubPekerjaan(false, id);
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
                await ChangeStatusSubPekerjaan(true, id);
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

"use client";

import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Badge, Button, ActionIcon } from "@mantine/core";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Prisma } from "@prisma/client";

import AddSubPekerjaanForm from "./add-sub-pekerjaan-form";
import EditSubPekerjaan from "./edit-sub-pekerjaan";

type Pekerjaan = Prisma.PekerjaanGetPayload<{
  include: {
    sub_pekerjaan: {
      include: {
        satuan: true;
      };
    };
  };
}>;

export default function SubPekerjaan({ pekerjaan }: { pekerjaan?: Pekerjaan }) {
  const [opened, { open, close }] = useDisclosure(false);

  if (!pekerjaan) {
    return <></>;
  }

  return (
    <div className="h-full pb-12">
      <Modal opened={opened} onClose={close} title="Tambah Pekerjaan">
        <AddSubPekerjaanForm id_pekerjaan={pekerjaan.id} onSuccess={close} />
      </Modal>

      <div className="flex flex-col space-y-6">
        <div className="flex-col flex space-y-3">
          <h3 className="font-bold text-md">Kategori Pekerjaan</h3>
          <div className="grid grid-cols-2 text-sm gap-6">
            <div className="flex flex-col">
              <label className="text-gray-400 font-semibold">
                Nama Kategori Pekerjaan
              </label>
              <span className="text-gray-700">{pekerjaan.nama}</span>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-400 font-semibold">
                Catatan Kategori Pekerjaan
              </label>
              <span className="text-gray-700">{pekerjaan.notes}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <h3 className="font-bold text-md">Pekerjaan</h3>

          <Button onClick={open} variant="outline">
            Tambah
          </Button>
        </div>

        <ul className="space-y-6">
          {pekerjaan.sub_pekerjaan.map((subPekerjaan) => (
            <EachSubPekerjaan
              subPekerjaan={subPekerjaan}
              key={subPekerjaan.id}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

function EachSubPekerjaan({
  subPekerjaan,
}: {
  subPekerjaan: Pekerjaan["sub_pekerjaan"][0];
}) {
  const { nama, satuan, is_active, target_volume, notes, bobot } = subPekerjaan;

  return (
    <div className="flex text-sm flex-col space-y-3 shadow-md p-3">
      <div className="flex flex-row justify-between">
        <div className="space-x-6">
          <span className="font-semibold">{nama}</span>
          <Badge color={is_active ? "green" : "red"} size="xs">
            {is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
        <EditSubPekerjaan subPekerjaan={subPekerjaan} />
      </div>
      <div className="flex flex-row space-x-12">
        <div className="flex flex-col">
          <label className="text-gray-400 font-semibold">Target Volume</label>
          <span className="text-gray-700">
            {target_volume} {satuan.nama}
          </span>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-400 font-semibold">Bobot Pekerjaan</label>
          <span className="text-gray-700">{bobot ?? 0} %</span>
        </div>
      </div>
      <div className="flex flex-col">
        <label className="text-gray-400 font-semibold">Catatan</label>
        <span className="text-gray-700">{notes ? notes : "---"}</span>
      </div>
    </div>
  );
}

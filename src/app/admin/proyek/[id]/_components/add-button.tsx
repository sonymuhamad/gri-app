"use client";
import { Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import TambahBidangPekerjaanForm from "./add-bidang-pekerjaan-form";

export default function TambahBidangPekerjaanButton({
  idProyek,
}: {
  idProyek: number;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button variant="outline" onClick={open}>
        Tambah Bidang Pekerjaan
      </Button>

      <Drawer
        title="Tambah Bidang Pekerjaan"
        opened={opened}
        onClose={close}
        position="right"
      >
        <TambahBidangPekerjaanForm onSuccess={close} idProyek={idProyek} />
      </Drawer>
    </>
  );
}

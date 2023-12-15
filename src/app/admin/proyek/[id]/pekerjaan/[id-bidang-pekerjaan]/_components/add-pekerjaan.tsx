"use client";

import { Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import dynamic from "next/dynamic";

const FormTambahPekerjaan = dynamic(() => import("./add-pekerjaan-form"), {
  ssr: false,
});

export default function TambahPekerjaan() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer
        position="right"
        opened={opened}
        onClose={close}
        title="Tambah Kategori Pekerjaan"
      >
        <FormTambahPekerjaan onSuccess={close} />
      </Drawer>
      <Button onClick={open} variant="outline" size="sm">
        Tambah Kategori
      </Button>
    </>
  );
}

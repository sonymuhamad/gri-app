"use client";

import { Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import FormTambahUser from "./add-user-form";

export default function TambahUser() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer
        position="right"
        opened={opened}
        onClose={close}
        title="Tambah User"
      >
        <FormTambahUser onSuccess={close} />
      </Drawer>

      <Button onClick={open} variant="outline">
        Tambah User
      </Button>
    </>
  );
}

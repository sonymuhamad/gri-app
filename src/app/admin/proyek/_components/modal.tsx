"use client";

import AddProyekForm from "@/app/admin/proyek/_components/add-proyek-form";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@mantine/core";

export default function AddProyekModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <Button variant={"outline"} onClick={() => setOpen(true)} size={"sm"}>
            Tambah Proyek
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay
            className={
              "fixed z-50 inset-0 bg-gray-100 opacity-50 animate-overlayShow"
            }
          />
          <Dialog.Content
            className={
              "max-w-[90vw] w-[600px] rounded-md space-y-6 bg-white z-50 justify-self-center max-h-[90vh] outline-none overflow-y-auto top-[15%] bottom-[15%] left-[30%] p-[25px] fixed "
            }
          >
            <Dialog.Title className={"font-bold"}>Tambah Proyek</Dialog.Title>
            <Dialog.Close
              asChild
              className={
                "absolute rounded-full p-1.5 right-5 top-0 hover:bg-gray-300"
              }
            >
              <button className="IconButton" aria-label="Close">
                <XMarkIcon className={"h-5 w-5 shrink-0"} />
              </button>
            </Dialog.Close>

            <AddProyekForm onSuccess={() => setOpen(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

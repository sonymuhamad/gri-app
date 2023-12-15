"use client";

import { Controller, useForm } from "react-hook-form";
import { Textarea, TextInput, Button } from "@mantine/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";

import {
  RegisterPekerjaanForm,
  RegisterPekerjaanSchema,
} from "@/schema/pekerjaan";
import { EditPekerjaan } from "@/action/pekerjaan";
import { Pekerjaan } from "@prisma/client";

export default function FormEditPekerjaan({
  onSuccess,
  pekerjaan,
}: {
  onSuccess: () => void;
  pekerjaan: Pekerjaan;
}) {
  const { handleSubmit, control } = useForm<RegisterPekerjaanForm>({
    resolver: zodResolver(RegisterPekerjaanSchema),
    defaultValues: {
      nama: pekerjaan.nama,
      notes: pekerjaan.notes,
      id_bidang_pekerjaan: pekerjaan.id_bidang_pekerjaan,
    },
  });

  const handleOnSubmit = async (data: RegisterPekerjaanForm) => {
    const res = await EditPekerjaan(data, pekerjaan.id);

    if (res) {
      return notifications.show({
        title: "Action Failed",
        message: res.message,
        color: "red",
      });
    }

    notifications.show({
      title: "Action Success",
      message: "Berhasil mengubah Kategori Pekerjaan",
    });
    onSuccess();
  };

  return (
    <form
      onSubmit={handleSubmit(handleOnSubmit)}
      className="flex flex-col space-y-6"
    >
      <Controller
        render={({ field, fieldState: { error } }) => (
          <TextInput
            {...field}
            label={"Nama"}
            placeholder={"Nama Kategori Pekerjaan"}
            error={!!error}
            description={error?.message}
          />
        )}
        name={"nama"}
        control={control}
      />

      <Controller
        render={({ field, fieldState: { error } }) => (
          <Textarea
            label={"Notes"}
            placeholder={"Catatan"}
            {...field}
            error={!!error}
            description={error?.message}
          />
        )}
        name={"notes"}
        control={control}
      />

      <Button type="submit" fullWidth>
        Submit
      </Button>
    </form>
  );
}

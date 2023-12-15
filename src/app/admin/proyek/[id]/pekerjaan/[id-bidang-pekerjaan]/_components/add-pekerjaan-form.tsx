"use client";

import { useParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Textarea, TextInput, Button } from "@mantine/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";

import {
  RegisterPekerjaanForm,
  RegisterPekerjaanSchema,
} from "@/schema/pekerjaan";
import { RegisterPekerjaan } from "@/action/pekerjaan";

export default function FormTambahPekerjaan({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const params = useParams() as { "id-bidang-pekerjaan": string };
  const idBidangPekerjaan = params["id-bidang-pekerjaan"];

  const { handleSubmit, control } = useForm<RegisterPekerjaanForm>({
    resolver: zodResolver(RegisterPekerjaanSchema),
    defaultValues: {
      nama: "",
      notes: "",
      id_bidang_pekerjaan: Number(idBidangPekerjaan),
    },
  });

  const handleOnSubmit = async (data: RegisterPekerjaanForm) => {
    const res = await RegisterPekerjaan(data);

    if (res) {
      return notifications.show({
        title: "Action Failed",
        message: res.message,
        color: "red",
      });
    }

    notifications.show({
      title: "Action Success",
      message: "Berhasil menambahkan Kategori Pekerjaan",
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

"use client";

import { useForm, Controller } from "react-hook-form";
import { TextInput, Textarea, Button } from "@mantine/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";
import type { Bidang_Pekerjaan } from "@prisma/client";

import { UpdateBidangPekerjaan } from "@/action/bidang-pekerjaan";
import {
  RegisterBidangPekerjaanForm,
  RegisterBidangPekerjaanSchema,
} from "@/schema/bidang-pekerjaan";

export default function EditBidangPekerjaanForm({
  bidangPekerjaan,
  onSuccess,
}: {
  onSuccess: () => void;
  bidangPekerjaan?: Bidang_Pekerjaan;
}) {
  const { handleSubmit, control } = useForm<RegisterBidangPekerjaanForm>({
    resolver: zodResolver(RegisterBidangPekerjaanSchema),
    defaultValues: {
      nama: bidangPekerjaan?.nama,
      kode: bidangPekerjaan?.kode,
      notes: bidangPekerjaan?.notes,
      id_proyek: bidangPekerjaan?.id_proyek,
    },
  });

  const handleOnSubmit = async (data: RegisterBidangPekerjaanForm) => {
    if (!bidangPekerjaan) return;

    const res = await UpdateBidangPekerjaan(data, bidangPekerjaan.id);

    if (res) {
      return notifications.show({
        title: "Action Failed",
        message: res.message,
        color: "red",
      });
    }

    notifications.show({
      title: "Action Success",
      message: "Edit Bidang Pekerjaan Berhasil",
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
            placeholder={"Nama Bidang Pekerjaan"}
            error={!!error}
            description={error?.message}
          />
        )}
        name={"nama"}
        control={control}
      />

      <Controller
        render={({ field, fieldState: { error } }) => (
          <TextInput
            {...field}
            label={"Kode"}
            placeholder={"Kode Bidang Pekerjaan"}
            error={!!error}
            description={error?.message}
          />
        )}
        name={"kode"}
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

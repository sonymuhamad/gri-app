"use client";
import { TextInput, Textarea, Button } from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  RegisterBidangPekerjaanForm,
  RegisterBidangPekerjaanSchema,
} from "@/schema/bidang-pekerjaan";
import { RegisterBidangPekerjaan } from "@/action/bidang-pekerjaan";
import { notifications } from "@mantine/notifications";

export default function TambahBidangPekerjaanForm({
  onSuccess,
  idProyek,
}: {
  onSuccess: () => void;
  idProyek: number;
}) {
  const { handleSubmit, control } = useForm<RegisterBidangPekerjaanForm>({
    resolver: zodResolver(RegisterBidangPekerjaanSchema),
    defaultValues: {
      nama: "",
      kode: "",
      notes: "",
      id_proyek: idProyek,
    },
  });

  const handleOnSubmit = async (data: RegisterBidangPekerjaanForm) => {
    const res = await RegisterBidangPekerjaan(data);

    if (res) {
      return notifications.show({
        title: "Action Failed",
        message: res.message,
        color: "red",
      });
    }

    notifications.show({
      title: "Action Success",
      message: "Berhasil menambahkan Bidang Pekerjaan",
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

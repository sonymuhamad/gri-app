"use client";

import { TextInput, Textarea, Button } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Controller, useForm } from "react-hook-form";
import { Proyek } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";

import { RegisterProyekForm, RegisterProyekSchema } from "@/schema/proyek";
import { EditProyek } from "@/action/proyek";

export default function EditProyekForm({
  data,
  onSuccess,
}: {
  data?: Proyek;
  onSuccess?: () => void;
}) {
  const { control, handleSubmit } = useForm<RegisterProyekForm>({
    defaultValues: data,
    resolver: zodResolver(RegisterProyekSchema),
  });

  const handleOnSubmit = async (credentials: RegisterProyekForm) => {
    if (data) {
      const res = await EditProyek(credentials, data.id);
      if (res) {
        return notifications.show({
          title: "Action Failed",
          message: res?.message,
          color: "red",
        });
      }

      notifications.show({
        title: "Action Success",
        message: "Edit Proyek Berhasil",
      });
      onSuccess && onSuccess();
    }
  };

  return (
    <form
      className="flex flex-col space-y-6"
      onSubmit={handleSubmit(handleOnSubmit)}
    >
      <Controller
        render={({ field, fieldState: { error } }) => (
          <TextInput
            {...field}
            label={"Nama"}
            placeholder={"Nama Proyek"}
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
            placeholder={"Kode Proyek"}
            error={!!error}
            description={error?.message}
          />
        )}
        name={"kode"}
        control={control}
      />
      <Controller
        render={({ field: { ...field } }) => (
          <DateInput {...field} placeholder="Pilih Tanggal" label={"Tanggal"} />
        )}
        name={"tanggal"}
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

      <Controller
        render={({ field, fieldState: { error } }) => (
          <Textarea
            label={"Lokasi"}
            placeholder={"Lokasi Proyek"}
            {...field}
            error={!!error}
            description={error?.message}
          />
        )}
        name={"lokasi"}
        control={control}
      />
      <Button type={"submit"} fullWidth>
        Submit
      </Button>
    </form>
  );
}

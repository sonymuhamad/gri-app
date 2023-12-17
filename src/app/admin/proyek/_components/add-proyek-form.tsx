"use client";
import { TextInput, Textarea, Button } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { Controller, useForm } from "react-hook-form";
import { RegisterProyekForm, RegisterProyekSchema } from "@/schema/proyek";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterProyek } from "@/action/proyek";
import { notifications } from "@mantine/notifications";

export default function AddProyekForm(props: { onSuccess?: () => void }) {
  const { control, handleSubmit } = useForm<RegisterProyekForm>({
    resolver: zodResolver(RegisterProyekSchema),
    defaultValues: {
      nama: "",
      kode: "",
      notes: "",
      lokasi: "",
    },
  });

  const handleOnSubmit = async (data: RegisterProyekForm) => {
    const res = await RegisterProyek(data);

    if (res) {
      return notifications.show({
        title: "Action Failed",
        message: res.message,
        color: "red",
      });
    }

    props.onSuccess && props.onSuccess();
    notifications.show({
      title: "Action Success",
      message: "Tambah Proyek Berhasil",
    });
  };

  return (
    <form
      className={"flex flex-col space-y-6"}
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
      <div className={"w-full font-semibold"}>
        <label className={"text-sm"}>Tanggal</label>
        <Controller
          render={({ field: { ...field } }) => <DatePicker {...field} />}
          name={"tanggal"}
          control={control}
        />
      </div>

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

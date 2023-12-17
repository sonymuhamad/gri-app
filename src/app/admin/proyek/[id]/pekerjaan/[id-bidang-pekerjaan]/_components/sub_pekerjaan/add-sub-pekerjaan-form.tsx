"use client";

import { TextInput, NumberInput, Textarea, Button } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";

import { SubPekerjaanForm, SubPekerjaanSchema } from "@/schema/sub-pekerjaan";
import SelectSatuan from "@/components/select-satuan";
import { RegisterSubPekerjaan } from "@/action/sub-pekerjaan";

export default function AddSubPekerjaanForm({
  id_pekerjaan,
  onSuccess,
}: {
  id_pekerjaan: number;
  onSuccess: () => void;
}) {
  const { handleSubmit, control } = useForm<SubPekerjaanForm>({
    resolver: zodResolver(SubPekerjaanSchema),
    defaultValues: {
      id_pekerjaan,
      nama: "",
      notes: "",
    },
  });

  const handleOnSubmit = async (data: SubPekerjaanForm) => {
    const res = await RegisterSubPekerjaan(data);

    if (res) {
      return notifications.show({
        title: "Action Failed",
        message: res.message,
        color: "red",
      });
    }

    notifications.show({
      title: "Action Success",
      message: "Berhasil menambahkan Pekerjaan",
    });
    onSuccess();
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
            placeholder={"Nama Pekerjaan"}
            error={!!error}
            description={error?.message}
          />
        )}
        name={"nama"}
        control={control}
      />

      <Controller
        render={({ field, fieldState: { error } }) => (
          <NumberInput
            {...field}
            hideControls
            label={"Target"}
            placeholder={"Target Volume"}
            error={!!error}
            description={error?.message}
          />
        )}
        name={"target_volume"}
        control={control}
      />

      <Controller
        render={({ field: { onChange, value }, formState }) => (
          <SelectSatuan onChange={onChange} value={value} />
        )}
        control={control}
        name="id_satuan"
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

"use client";

import { TextInput, NumberInput, Textarea, Button } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";
import { Prisma } from "@prisma/client";

import { SubPekerjaanForm, SubPekerjaanSchema } from "@/schema/sub-pekerjaan";
import SelectSatuan from "@/components/select-satuan";
import { UpdateSubPekerjaan } from "@/action/sub-pekerjaan";
import { useParams } from "next/navigation";

type SubPekerjaan = Prisma.Sub_PekerjaanGetPayload<{
  include: {
    satuan: true;
  };
}>;

export default function EditSubPekerjaanForm({
  onSuccess,
  subPekerjaan,
}: {
  subPekerjaan: SubPekerjaan;
  onSuccess: () => void;
}) {
  const { handleSubmit, control } = useForm<SubPekerjaanForm>({
    resolver: zodResolver(SubPekerjaanSchema),
    defaultValues: {
      id_pekerjaan: subPekerjaan.id_pekerjaan,
      nama: subPekerjaan.nama,
      notes: subPekerjaan.notes,
      target_volume: subPekerjaan.target_volume,
      id_satuan: subPekerjaan.satuan,
      bobot: subPekerjaan.bobot ?? 0,
    },
  });

  const params = useParams<{ id: string }>();

  const handleOnSubmit = async (data: SubPekerjaanForm) => {
    const res = await UpdateSubPekerjaan(
      data,
      subPekerjaan.id,
      Number(params.id)
    );

    if (res) {
      return notifications.show({
        title: "Action Failed",
        message: res.message,
        color: "red",
      });
    }

    notifications.show({
      title: "Action Success",
      message: "Berhasil mengubah Pekerjaan",
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
            inputWrapperOrder={["label", "input", "description", "error"]}
          />
        )}
        name={"target_volume"}
        control={control}
      />

      <Controller
        render={({ field, fieldState: { error } }) => (
          <NumberInput
            {...field}
            hideControls
            label={"Bobot"}
            placeholder={"Bobot Pekerjaan"}
            error={!!error}
            description={error?.message}
            suffix="%"
            inputWrapperOrder={["label", "input", "description", "error"]}
          />
        )}
        name={"bobot"}
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

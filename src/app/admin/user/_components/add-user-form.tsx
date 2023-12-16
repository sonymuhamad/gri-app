"use client";

import { TextInput, PasswordInput, Select, Button } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@prisma/client";
import { notifications } from "@mantine/notifications";

import { CreateUser } from "@/action/user";
import { RegisterUserSchema, RegisterUserForm } from "@/schema/user";

export default function FormTambahUser({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const { handleSubmit, control } = useForm<RegisterUserForm>({
    resolver: zodResolver(RegisterUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmedPassword: "",
      role: Role.ADMIN,
    },
  });

  const handleOnSubmit = async (data: RegisterUserForm) => {
    const res = await CreateUser(data);

    if (res) {
      return notifications.show({
        title: "Action Failed",
        message: res.message,
        color: "red",
      });
    }

    onSuccess && onSuccess();
    notifications.show({
      title: "Action Success",
      message: "Tambah User Berhasil",
    });
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
            placeholder={"Nama User"}
            error={!!error}
            description={error?.message}
          />
        )}
        name={"name"}
        control={control}
      />

      <Controller
        render={({ field, fieldState: { error } }) => (
          <TextInput
            {...field}
            label={"Email"}
            placeholder={"Email User"}
            error={!!error}
            description={error?.message}
          />
        )}
        name={"email"}
        control={control}
      />

      <Controller
        render={({ field, fieldState: { error } }) => (
          <Select
            {...field}
            label={"Role"}
            placeholder={"Role User"}
            error={!!error}
            description={error?.message}
            data={Object.values(Role)}
            allowDeselect={false}
          />
        )}
        name={"role"}
        control={control}
      />

      <Controller
        render={({ field, fieldState: { error } }) => (
          <PasswordInput
            {...field}
            label={"Password"}
            placeholder={"Password "}
            error={!!error}
            description={error?.message}
          />
        )}
        name={"password"}
        control={control}
      />

      <Controller
        render={({ field, fieldState: { error } }) => (
          <PasswordInput
            {...field}
            label={"Konfirmasi Password"}
            placeholder={"Konfirmasi Password"}
            error={!!error}
            description={error?.message}
          />
        )}
        name={"confirmedPassword"}
        control={control}
      />

      <Button fullWidth type="submit">
        Submit
      </Button>
    </form>
  );
}

"use client";

import { TextInput, PasswordInput, Select, Button } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role, User } from "@prisma/client";
import { notifications } from "@mantine/notifications";

import { EditUser } from "@/action/user";
import { EditUserSchema, EditUserForm } from "@/schema/user";

export default function FormEditUser({
  onSuccess,
  user,
}: {
  onSuccess: () => void;
  user?: User;
}) {
  const { handleSubmit, control } = useForm<EditUserForm>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      role: user?.role,
    },
  });

  const handleOnSubmit = async (data: EditUserForm) => {
    if (!user) return;
    const res = await EditUser(data, user.id);

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
      message: "Update User Berhasil",
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

      <Button fullWidth type="submit">
        Submit
      </Button>
    </form>
  );
}

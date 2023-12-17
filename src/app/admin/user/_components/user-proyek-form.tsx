"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@mantine/core";
import Select from "react-select";

import { Prisma, Proyek } from "@prisma/client";
import { GetProyek } from "@/action/proyek";
import { SetUserProyek } from "@/action/user";
import { notifications } from "@mantine/notifications";

type User = Prisma.UserGetPayload<{
  include: {
    proyek: true;
  };
}>;

export default function ProyekSelectForm({
  user,
  onSuccess,
}: {
  user?: User;
  onSuccess: () => void;
}) {
  const [selectedProyek, setSelectedProyek] = useState<Proyek>();
  const [proyekList, setProyekList] = useState<Proyek[]>([]);

  useEffect(() => {
    setSelectedProyek(user?.proyek ?? undefined);
    const fetch = async () => {
      const proyek = await GetProyek();
      setProyekList(proyek);
    };
    fetch();
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !selectedProyek) return;

    await SetUserProyek(selectedProyek.id, user.id);
    notifications.show({
      title: "Action Success",
      message: "User Proyek Changed",
    });
    onSuccess();
  };

  return (
    <form
      className="flex flex-col space-y-6 h-[60vh] justify-between"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col space-y-1.5">
        <label className="text-sm font-semibold">Proyek</label>
        <Select
          options={proyekList}
          onChange={(v) => {
            setSelectedProyek(v as Proyek);
          }}
          getOptionLabel={(option) => `${option.nama} - ${option.kode}`}
          getOptionValue={(option) => option.id.toString()}
          value={selectedProyek}
        />
      </div>

      <Button type="submit">Submit</Button>
    </form>
  );
}

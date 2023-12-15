"use client";

import { useState } from "react";
import { Badge, ScrollArea } from "@mantine/core";
import { Pekerjaan } from "@prisma/client";

import EditPekerjaan from "./edit-pekerjaan";
import TambahPekerjaan from "./add-pekerjaan";

export default function PekerjaanSection({
  pekerjaan,
}: {
  pekerjaan: Pekerjaan[];
}) {
  return (
    <section className="grid grid-cols-2 gap-x-16">
      <div className="border-r space-y-6 border-slate-300 pr-6">
        <div className="flex flex-row justify-between">
          <h2 className="text-xl font-semibold">Kategori Pekerjaan</h2>
          <TambahPekerjaan />
        </div>
        <ScrollArea h={350} className="px-6 pb-6" scrollbars={"y"}>
          <ul className="space-y-6 divide-gray-200 dark:divide-gray-700">
            {pekerjaan.map((pekerjaan) => {
              const { id, notes, is_active, nama } = pekerjaan;
              return (
                <li
                  key={id}
                  className="justify-between flex items-start shadow-md p-4 rounded-md"
                >
                  <div className="flex flex-col space-y-1.5 cursor-pointer">
                    <div className="flex space-x-3 items-center">
                      <label className="text-sm truncate max-w-xs">
                        {nama}
                      </label>
                      <Badge color={is_active ? "green" : "red"} size="xs">
                        {is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <small className="text-gray-700 text-xs">{notes}</small>
                  </div>
                  <EditPekerjaan pekerjaan={pekerjaan} />
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </div>
      <div>{/* TODO: detail pekerjaannya disini nanti kalo diklik */}</div>
    </section>
  );
}

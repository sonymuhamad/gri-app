"use client";

import { useEffect, useMemo } from "react";
import { Badge, ScrollArea } from "@mantine/core";
import { Prisma } from "@prisma/client";
import { cn } from "@/const/project";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import EditPekerjaan from "./edit-pekerjaan";
import TambahPekerjaan from "./add-pekerjaan";
import SubPekerjaan from "./sub_pekerjaan/sub-pekerjaan";

type Pekerjaan = Prisma.PekerjaanGetPayload<{
  include: {
    sub_pekerjaan: {
      include: {
        satuan: true;
      };
    };
  };
}>;

export default function PekerjaanSection({
  pekerjaan,
}: {
  pekerjaan: Pekerjaan[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const currentParams = params.get("i");

  const currentPekerjaan = useMemo(() => {
    if (!currentParams) return;
    return pekerjaan[Number(currentParams)];
  }, [pekerjaan, currentParams]);

  useEffect(() => {
    if (pekerjaan.length > 0 && currentParams === null) {
      router.replace(`${pathname}?i=${0}`);
    }
  }, [pekerjaan, router, currentParams, pathname]);

  return (
    <section className="grid grid-cols-2 gap-x-16">
      <div className="border-r space-y-6 border-slate-300 pr-6">
        <div className="flex flex-row justify-between">
          <h2 className="text-xl font-semibold">Kategori Pekerjaan</h2>
          <TambahPekerjaan />
        </div>
        <ScrollArea h={350} className="px-6 pb-6" scrollbars={"y"}>
          <ul className="space-y-6 divide-gray-200 dark:divide-gray-700">
            {pekerjaan.map((pekerjaan, index) => {
              const { id, notes, is_active, nama } = pekerjaan;
              return (
                <li
                  key={id}
                  onClick={() => {
                    router.replace(`${pathname}?i=${index}`);
                    // setSelectedPekerjaan(pekerjaan);
                  }}
                  className={cn(
                    "justify-between flex items-start cursor-pointer shadow-md p-4 rounded-md",
                    currentPekerjaan?.id === id && "bg-gray-100"
                  )}
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
      <div>
        <SubPekerjaan pekerjaan={currentPekerjaan} />
      </div>
    </section>
  );
}

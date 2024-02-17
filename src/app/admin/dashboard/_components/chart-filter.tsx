"use client";

import { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import {
  decompressFromEncodedURIComponent,
  compressToEncodedURIComponent,
} from "lz-string";

import { GetProyek } from "@/action/proyek";
import { Proyek } from "@prisma/client";
import { createUrlWithQueryParams } from "@/lib/utils";

export default function ChartProyekFilter() {
  const [proyeks, setProyeks] = useState<Proyek[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams(); // as proyek
  const p = searchParams.get("p");

  const restParams = useMemo(() => {
    const params: { [_: string]: string } = {};

    searchParams.forEach((value, key) => {
      if (key === "p") return;
      params[key] = value;
    });

    return params;
  }, [searchParams]);

  const value = useMemo(() => {
    if (!p) return;

    try {
      return JSON.parse(decompressFromEncodedURIComponent(p)) as Proyek;
    } catch (e) {
      return;
    }
  }, [p]);

  useEffect(() => {
    const fetch = async () => {
      const proyek = await GetProyek();
      setProyeks(proyek);
    };

    fetch();
  }, []);

  return (
    <Select
      className="w-96"
      placeholder="Search Proyek"
      isClearable
      value={value}
      onChange={(v) => {
        if (!v) {
          return router.replace(
            createUrlWithQueryParams("/admin/dashboard", {
              p: undefined,
              ...restParams,
            })
          );
        }

        const { id, nama, tanggal } = v;
        const compressedProyek = compressToEncodedURIComponent(
          JSON.stringify({ id, nama, tanggal })
        );
        router.replace(
          createUrlWithQueryParams("/admin/dashboard", {
            p: compressedProyek,
            ...restParams,
          })
        );
      }}
      options={proyeks}
      getOptionValue={(option) => option.id.toString()}
      getOptionLabel={(option) =>
        `${option.nama} - ${dayjs(new Date(option.tanggal)).format(
          "MMMM D, YYYY"
        )}`
      }
    />
  );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import { useRouter, useSearchParams } from "next/navigation";
import {
  decompressFromEncodedURIComponent,
  compressToEncodedURIComponent,
} from "lz-string";

import { Bidang_Pekerjaan, Proyek } from "@prisma/client";
import { createUrlWithQueryParams } from "@/lib/utils";
import { GetBidangPekerjaan } from "@/action/bidang-pekerjaan";

export default function BidangPekerjaanFilter() {
  const [proyeks, setProyeks] = useState<Bidang_Pekerjaan[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams(); // as Bidang Pekerjaan
  const b = searchParams.get("b"); // as bidangPekerjaan
  const p = searchParams.get("p"); // as proyek

  const restParams = useMemo(() => {
    const params: { [_: string]: string } = {};

    searchParams.forEach((value, key) => {
      if (key === "b") return;
      params[key] = value;
    });

    return params;
  }, [searchParams]);

  const value = useMemo(() => {
    if (!b) return;

    try {
      return JSON.parse(
        decompressFromEncodedURIComponent(b)
      ) as Bidang_Pekerjaan;
    } catch (e) {
      return;
    }
  }, [b]);

  const proyek = useMemo(() => {
    if (!p) return;

    try {
      return JSON.parse(decompressFromEncodedURIComponent(p)) as Proyek;
    } catch (e) {
      return;
    }
  }, [p]);

  useEffect(() => {
    const fetch = async () => {
      const bidangPekerjaan = await GetBidangPekerjaan(proyek?.id);
      setProyeks(bidangPekerjaan);
    };

    fetch();
  }, [proyek?.id]);

  return (
    <Select
      className="w-72"
      isDisabled={!proyek}
      placeholder="Search Bidang Pekerjaan"
      isClearable
      value={value}
      onChange={(v) => {
        if (!v) {
          return router.replace(
            createUrlWithQueryParams("/admin/report", {
              b: undefined,
              ...restParams,
            })
          );
        }

        const { id, nama } = v;
        const compressedProyek = compressToEncodedURIComponent(
          JSON.stringify({ id, nama })
        );
        router.replace(
          createUrlWithQueryParams("/admin/report", {
            b: compressedProyek,
            ...restParams,
          })
        );
      }}
      options={proyeks}
      getOptionValue={(option) => option.id.toString()}
      getOptionLabel={(option) => option.nama}
    />
  );
}

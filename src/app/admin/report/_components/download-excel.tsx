"use client";

import { GetDetailProyekWithDateFilter } from "@/action/proyek";
import { Prisma } from "@prisma/client";
import { decompressFromEncodedURIComponent } from "lz-string";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@mantine/core";
import { DownloadExcel } from "@/action/excel";
import { addOneDay, substractOneDay } from "@/lib/utils";

type Proyek = Prisma.ProyekGetPayload<{
  include: {
    bidang_pekerjaan: {
      include: {
        pekerjaan: {
          include: {
            sub_pekerjaan: {
              include: {
                laporan_harian: true;
                satuan: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export default function DownloadExcelSection() {
  const [proyek, setProyek] = useState<Proyek | null>(null);

  const searchParams = useSearchParams(); // as proyek
  const p = searchParams.get("p");
  const s = searchParams.get("s");
  const e = searchParams.get("e");

  const value = useMemo(() => {
    if (!p) return;

    try {
      return JSON.parse(decompressFromEncodedURIComponent(p)) as Proyek;
    } catch (e) {
      return;
    }
  }, [p]);

  const startTime = useMemo(() => {
    if (!s) return;

    try {
      return new Date(s);
    } catch (e) {
      return;
    }
  }, [s]);

  const endTime = useMemo(() => {
    if (!e) return;

    try {
      return new Date(e);
    } catch (e) {
      return;
    }
  }, [e]);

  useEffect(() => {
    if (!value?.id) {
      setProyek(null);
    }
    const fetch = async () => {
      if (value?.id) {
        const proyek = await GetDetailProyekWithDateFilter(
          value?.id,
          substractOneDay(startTime),
          addOneDay(endTime)
        );
        setProyek(proyek);
      }
    };
    fetch();
  }, [value?.id, startTime, endTime]);

  return (
    <Button
      onClick={() => {
        DownloadExcel({ proyek });
      }}
      disabled={!proyek}
    >
      Download excel
    </Button>
  );
}

"use client";

import { GetDetailProyek } from "@/action/proyek";
import { Prisma } from "@prisma/client";
import { decompressFromEncodedURIComponent } from "lz-string";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@mantine/core";
import { DownloadExcel } from "@/action/excel";

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

  const value = useMemo(() => {
    if (!p) return;

    try {
      return JSON.parse(decompressFromEncodedURIComponent(p)) as Proyek;
    } catch (e) {
      return;
    }
  }, [p]);

  useEffect(() => {
    if (!value?.id) {
      setProyek(null);
    }
    const fetch = async () => {
      if (value?.id) {
        const proyek = await GetDetailProyek(value?.id);
        setProyek(proyek);
      }
    };
    fetch();
  }, [value?.id]);

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

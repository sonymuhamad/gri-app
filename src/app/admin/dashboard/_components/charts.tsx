"use client";

import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useState, useEffect, useMemo } from "react";
import { Prisma, Proyek } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { decompressFromEncodedURIComponent } from "lz-string";
import { GetSubPekerjaanByProyekID } from "@/action/sub-pekerjaan";

type SubPekerjaan = Prisma.Sub_PekerjaanGetPayload<{
  include: {
    pekerjaan: {
      include: {
        bidang_pekerjaan: {
          include: {
            proyek: true;
          };
        };
      };
    };
    laporan_harian: true;
  };
}>;

export default function Charts() {
  const [subPekerjaan, setSubPekerjaan] = useState<SubPekerjaan[]>([]);

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
      setSubPekerjaan([]);
    }

    const fetch = async () => {
      if (value?.id) {
        const pekerjaans = await GetSubPekerjaanByProyekID(value.id);
        setSubPekerjaan(pekerjaans);
      }
    };
    fetch();
  }, [value?.id]);

  const dataSubPekerjaanForChart = useMemo(() => {
    return subPekerjaan.map((sub) => {
      const totalVolume = sub.laporan_harian.reduce((prev, current) => {
        return prev + current.volume;
      }, 0);
      const percentage = (totalVolume / sub.target_volume) * 100;

      return {
        ...sub,
        percentage: percentage > 100 ? 100 : percentage.toFixed(2),
      };
    });
  }, [subPekerjaan]);

  return (
    <div className="w-full p">
      <BarChart
        width={950}
        height={300}
        data={dataSubPekerjaanForChart}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="nama" display={""} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="percentage"
          fill="#8884d8"
          name={"Pekerjaan"}
          activeBar={<Rectangle fill="pink" stroke="blue" />}
        />
      </BarChart>
    </div>
  );
}

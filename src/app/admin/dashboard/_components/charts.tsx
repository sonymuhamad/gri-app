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
  ResponsiveContainer,
  Text,
  Brush,
  ReferenceLine,
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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label} : ${payload[0].value}%`}</p>
      </div>
    );
  }

  return null;
};

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
    <ResponsiveContainer width={"100%"} height={500}>
      <BarChart
        data={dataSubPekerjaanForChart}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 50,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="nama"
          interval={0}
          padding={{ left: 30, right: 30 }}
          tick={<CustomXAxisTick />}
        />
        <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
        <Tooltip content={<CustomTooltip />} />

        <Legend verticalAlign="top" wrapperStyle={{ lineHeight: "40px" }} />
        <ReferenceLine y={0} stroke="#000" />
        <Brush
          dataKey="nama"
          padding={{ top: 100 }}
          height={30}
          stroke="#8884d8"
          y={460}
        />

        <Bar
          dataKey="percentage"
          fill="#8884d8"
          name={"Progress Pekerjaan"}
          activeBar={<Rectangle fill="pink" stroke="blue" />}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

function CustomXAxisTick({ x, y, payload }: any) {
  if (payload && payload.value) {
    return (
      <Text
        fontSize={"12px"}
        width={"12px"}
        x={x}
        y={y}
        textAnchor="middle"
        verticalAnchor="start"
      >
        {payload.value}
      </Text>
    );
  }
  return null;
}

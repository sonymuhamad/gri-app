"use client";

import { Prisma } from "@prisma/client";
import { useMemo } from "react";
import { Pie, PieChart, ResponsiveContainer, Sector } from "recharts";

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

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
    name,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >
        {name}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Progress ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export default function PieChartProyek({ proyek }: { proyek: Proyek }) {
  const percentageProyek = useMemo(() => {
    let totalPekerjaanProyek = 0;
    let totalPercentageProyek = 0;

    proyek.bidang_pekerjaan.forEach((bidangPekerjaan) => {
      bidangPekerjaan.pekerjaan.forEach((pekerjaan) => {
        pekerjaan.sub_pekerjaan.forEach((subPekerjaan) => {
          const totalVolume = subPekerjaan.laporan_harian.reduce(
            (prev, current) => {
              return current.volume + prev;
            },
            0
          );

          const percentage = (totalVolume / subPekerjaan.target_volume) * 100;
          const fixedPercentage = percentage > 100 ? 100 : percentage;
          totalPercentageProyek += fixedPercentage;
          totalPekerjaanProyek++;
        });
      });
    });

    return totalPercentageProyek / totalPekerjaanProyek;
  }, [proyek]);

  const data = [
    {
      name: proyek.nama,
      value: percentageProyek,
    },
    {
      name: proyek.nama,
      value: 100 - percentageProyek,
    },
  ];

  return (
    <ResponsiveContainer width={"70%"} height={300}>
      <PieChart>
        <Pie
          activeIndex={0}
          activeShape={renderActiveShape}
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        ></Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

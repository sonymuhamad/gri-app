"use client";

import { createUrlWithQueryParams } from "@/lib/utils";
import { DatePickerInput, DateValue } from "@mantine/dates";
import { useSearchParams, useRouter } from "next/navigation";

import { useMemo, useState } from "react";

export default function ReportProyekDateFilter() {
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);
  const router = useRouter();

  const searchParams = useSearchParams(); // as proyek
  const s = searchParams.get("s");
  const e = searchParams.get("e");

  const restParams = useMemo(() => {
    const params: { [_: string]: string } = {};

    searchParams.forEach((value, key) => {
      if (key === "s") return;
      if (key === "e") return;
      params[key] = value;
    });

    return params;
  }, [searchParams]);

  const startTime = useMemo(() => {
    if (!s) return null;

    try {
      return new Date(s);
    } catch (e) {
      return null;
    }
  }, [s]);

  const endTime = useMemo(() => {
    if (!e) return null;

    try {
      return new Date(e);
    } catch (e) {
      return null;
    }
  }, [e]);

  const fixedValue = useMemo(() => {
    if (!startTime || !endTime) {
      return value;
    } else {
      return [startTime, endTime] as [DateValue, DateValue];
    }
  }, [value, startTime, endTime]);

  return (
    <DatePickerInput
      type="range"
      clearable
      value={fixedValue}
      onChange={(value) => {
        setValue(value);
        if (!value[0]) {
          return router.replace(
            createUrlWithQueryParams("/admin/report", {
              s: undefined,
              ...restParams,
            })
          );
        }

        if (!value[1]) {
          return router.replace(
            createUrlWithQueryParams("/admin/report", {
              e: undefined,
              ...restParams,
            })
          );
        }

        router.replace(
          createUrlWithQueryParams("/admin/report", {
            s: new Date(value[0]).toISOString(),
            e: new Date(value[1]).toISOString(),
            ...restParams,
          })
        );
      }}
    />
  );
}

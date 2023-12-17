"use client";

import React, { useEffect, useState, useId } from "react";

import { CreateSatuan, GetSatuan } from "@/action/satuan";
import CreatableSelect from "react-select/creatable";
import { Satuan } from "@prisma/client";

type SelectSatuanType = {
  onChange: (v: Satuan) => void;
  value?: Omit<Satuan, "created_at">;
};

const SelectSatuan = ({ onChange, value }: SelectSatuanType) => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<Satuan[]>([]);
  const id = useId();
  useEffect(() => {
    const getData = async () => {
      const satuan = await GetSatuan();
      setOptions(satuan);
    };

    getData();
  }, []);

  const handleCreate = async (inputValue: string) => {
    setIsLoading(true);
    setTimeout(async () => {
      const newSatuan = await CreateSatuan(inputValue);

      setIsLoading(false);
      setOptions((prev) => [...prev, newSatuan]);
      onChange(newSatuan);
    }, 1000);
  };

  return (
    <div className="flex flex-col space-y-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        Satuan
      </label>
      <CreatableSelect
        id={id}
        placeholder="Pilih Satuan"
        createOptionPosition="last"
        formatCreateLabel={(value) => `Create ${value}`}
        isDisabled={isLoading}
        getOptionLabel={(option: {
          nama: string;
          label?: string;
          id: number;
        }) => {
          if (!option.nama) return option.label ?? "";
          return option.nama;
        }}
        getOptionValue={(option) => option?.id?.toString()}
        isLoading={isLoading}
        onChange={(newValue) => onChange(newValue as Satuan)}
        onCreateOption={handleCreate}
        options={options}
        value={value}
      />
    </div>
  );
};

export default SelectSatuan;

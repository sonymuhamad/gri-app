import { useMemo, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
export default function useSearch<T extends Object>(data: T[]) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);

  const values = useMemo(() => {
    return data.filter((dt) => {
      return Object.values(dt).some((value) =>
        value.toString().toLowerCase().includes(debouncedQuery.toLowerCase()),
      );
    });
  }, [data, debouncedQuery]);

  return {
    values,
    setQuery,
    query,
    debouncedQuery,
  };
}

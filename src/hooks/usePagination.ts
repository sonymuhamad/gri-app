import { useEffect, useState } from "react";
import useSearch from "@/hooks/useSearch";

interface PaginatedData<T> {
  data: T[];
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  query: string;
  setQuery: (value: string) => void;
}

function usePagination<T extends Object>(
  items: T[],
  itemsPerPage: number = 10,
): PaginatedData<T> {
  const { values, setQuery, query, debouncedQuery } = useSearch(items);

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(values.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery]);

  const goToPage = (page: number) => {
    const validPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(validPage);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedItems = values.slice(startIndex, endIndex);

  return {
    data: paginatedItems,
    currentPage,
    itemsPerPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    query,
    setQuery,
  };
}

export default usePagination;

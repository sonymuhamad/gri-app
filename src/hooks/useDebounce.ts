import { useState, useEffect } from "react";

const useDebouncedQuery = (
  searchQuery: string,
  delay: number = 400,
): string => {
  const [debouncedQuery, setDebouncedQuery] = useState<string>(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, delay);

    // Clear the timeout if the searchQuery changes before the delay time
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, delay]);

  return debouncedQuery;
};

export default useDebouncedQuery;

import { useState, useMemo } from "react";

export function usePagination<T>(data: T[]) {
  const ENTRIES_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.ceil(data.length / ENTRIES_PER_PAGE);
  }, [data]);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * ENTRIES_PER_PAGE;
    const end = start + ENTRIES_PER_PAGE;
    return data.slice(start, end);
  }, [data, currentPage]);

  const goLeft = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goRight = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return {
    currentPage,
    totalPages,
    currentData,
    goLeft,
    goRight,
  };
}

import { useState, useEffect } from 'react';

interface PaginationResponse<T> {
  totalPage: number;
  data: T[];
}

function usePagination<T>(
  callApi: (page: number, size: number) => Promise<PaginationResponse<T>>,
  initialPage = 0,
  itemsPerPage = 10,
) {
  const [data, setData] = useState<T[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPageData = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await callApi(page, 10);

      setData(response.data);
      setTotalPages(response.totalPage);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage === 0 || (currentPage > 0 && currentPage < totalPages)) {
      fetchPageData(currentPage);
    }
  }, [currentPage]);

  const nextPage = () => {
    if (currentPage === 0 || currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return {
    data,
    totalPages,
    currentPage,
    loading,
    error,
    nextPage,
    prevPage,
    setCurrentPage,
  };
}

export default usePagination;

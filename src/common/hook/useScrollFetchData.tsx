import { useEffect, useState } from 'react';
import { PageEntity } from '../../domain/entity/common.entity';

function useScrollFetchData<T>(
  fetchData: (page: number) => Promise<any>,
  elementRef: React.RefObject<any>,
  initialPage: number = 1,
  pageSize: number = 10,
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageEntity, setPageEntity] = useState<PageEntity>({
    currentPage: initialPage,
    pageSize: pageSize,
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchData(pageEntity.currentPage);
        setData((prevData) => [...prevData, ...result]);
      } catch (err) {
        setError('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchData]);

  useEffect(() => {
    const handleScroll = async () => {
      const { scrollTop, clientHeight, scrollHeight } = elementRef.current;

      if (scrollTop + clientHeight >= scrollHeight - 1) {
        const data = await fetchData(pageEntity.currentPage);
        if (data) {
          setPageEntity((prev) => ({
            ...prev,
            currentPage: prev.currentPage! + 1,
            totalPage: data.totalPage,
          }));
          setData((prev) => {
            return [...prev, ...data.data];
          });
        }
      }
    };

    const element = elementRef.current;

    if (element) {
      element.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loading, elementRef]);

  return { data, loading, error, pageEntity };
}

export default useScrollFetchData;

import { useState, useCallback } from 'react';
import { handleException } from '../exception/api.exeption';
import { toastNotification } from '../util/notification.util';

export const useCallApi = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const callApi = useCallback(async (apiFunction: () => Promise<any> | any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      handleException(err);
      //   setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);
  return { data, loading, error, callApi };
};

import { useEffect, useState } from 'react';

interface IParams<T = any> {
  queryFn: () => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  status?: boolean;
}

export const useHttp = (
  { queryFn, onSuccess, onError }: IParams,
  deps = []
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState({
    data: null,
  });
  const [error, setError] = useState(null);

  const callAPI = async () => {
    try {
      setIsLoading(true);
      const res = await queryFn();
      setResponse(res);

      setIsLoading(false);
      if (onSuccess) {
        onSuccess(res.data);
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(error);
      if (onError) {
        onError(error);
      }
    }
  };

  useEffect(() => {
    callAPI();
  }, [...deps]);

  const onRefetch = () => {
    callAPI();
  };

  return { response, isLoading, refetch: onRefetch, error };
};

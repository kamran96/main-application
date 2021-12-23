import { useEffect, useState } from 'react';
import { setLogger } from 'react-query';
import http from '../../utils/http';

interface IAPIOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  payload?: any;
}
interface IParams<T = any> {
  apiOption: IAPIOptions;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  status?: boolean;
  enabled?: boolean;
  retryLimit?: number;
}

export const useHttp = (
  { apiOption, onSuccess, onError, enabled = true, retryLimit = 3 }: IParams,
  deps = []
) => {
  const { method, url, payload } = apiOption;
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState({
    data: null,
  });
  const [error, setError] = useState(null);
  const [refetching, setRefetching] = useState(false);

  let retryCount = 0;

  const callAPI = async () => {
    await http({
      method,
      url,
      data: payload,
    })
      .then((res) => {
        setResponse(res?.data);
        if (onSuccess) {
          onSuccess(res.data);
        }
      })
      .catch(async (err) => {
        if (retryCount < retryLimit) {
          retryCount++;
          await callAPI();
        } else {
          setError(err);
          if (onError) {
            onError(err);
          }
        }
      });
  };

  const handleRequest = async (target?: 'refetch') => {
    if (enabled && enabled === true) {
      target === 'refetch' ? setRefetching(true) : setIsLoading(true);
      await callAPI();
      target === 'refetch' ? setRefetching(false) : setIsLoading(false);
    }
  };

  useEffect(() => {
    handleRequest();
  }, [...deps]);

  const onRefetch = () => {
    handleRequest('refetch');
  };

  return { response, isLoading, refetch: onRefetch, error, refetching };
};

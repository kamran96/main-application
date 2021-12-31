import { useEffect, useState } from 'react';

export const useEffectLoading = (effectValue) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(effectValue);
    setTimeout(() => {
      setLoading(false);
    }, 400);
  }, [effectValue]);
  return {
    loading,
  };
};

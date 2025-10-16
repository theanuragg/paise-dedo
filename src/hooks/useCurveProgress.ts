import { getPoolCurveProgress } from '@/utils/httpClient';
import React from 'react';

export const useCurveProgress = (poolAddress: string) => {
  const [progress, setProgress] = React.useState<number | null>(null);
  const [baseReserve, setBaseReserve] = React.useState<number | null>(null);
  const [percentageSold, setPercentageSold] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchProgress = async () => {
      if (!poolAddress) {
        setError('Pool address is required');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const { progress: progressValue, baseReserve: baseReserveValue, percentageSold: percentageSoldValue } = await getPoolCurveProgress(poolAddress);
        setProgress(progressValue);
        setBaseReserve(baseReserveValue);
        setPercentageSold(percentageSoldValue);
      } catch (err) {
        console.error('Failed to fetch curve progress:', err);
        setError('Failed to fetch curve progress');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();

    return () => {
      setProgress(null);
      setBaseReserve(null);
      setPercentageSold(null);
      setLoading(true);
      setError(null);
    };
  }, [poolAddress]);

  return { progress, baseReserve, percentageSold, loading, error };
};

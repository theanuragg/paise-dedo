import { useState, useEffect, useCallback, useRef } from 'react';
import { getRecentTrades } from '@/utils/httpClient';
import { SignalingManager } from '@/utils/SignalingManager';
import { Trade } from '@/utils/types';

interface UseTradesOptions {
  tokenMint: string;
  limit?: number;
  enableRealtime?: boolean;
}

interface UseTradesReturn {
  trades: Trade[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getTimeRange: () => { earliest: Date | null; latest: Date | null };
}

export function useTrades({
  tokenMint,
  limit = 100,
  enableRealtime = false,
}: UseTradesOptions): UseTradesReturn {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const signalingManagerRef = useRef<SignalingManager | null>(null);

  const fetchTrades = useCallback(async () => {
    if (!tokenMint) return;

    try {
      setIsLoading(true);
      setError(null);
      const tradesData = await getRecentTrades(tokenMint, limit);

      // Sort trades by time (newest first)
      const sortedTrades = tradesData.sort((a, b) => {
        return new Date(b.time).getTime() - new Date(a.time).getTime();
      });

      setTrades(sortedTrades);

      console.log('Trades fetched:', {
        count: sortedTrades.length,
        earliest: sortedTrades[sortedTrades.length - 1]?.time,
        latest: sortedTrades[0]?.time,
      });
    } catch (err) {
      console.error('Error fetching trades:', err);
      setError('Failed to load trades');
    } finally {
      setIsLoading(false);
    }
  }, [tokenMint, limit]);

  const getTimeRange = useCallback(() => {
    if (trades.length === 0) {
      return { earliest: null, latest: null };
    }

    const times = trades.map(t => new Date(t.time).getTime());
    const earliest = new Date(Math.min(...times));
    const latest = new Date(Math.max(...times));

    return { earliest, latest };
  }, [trades]);

  // Initial fetch
  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  // Setup realtime updates
  useEffect(() => {
    if (!enableRealtime || !tokenMint) return;

    const initializeRealtime = async () => {
      try {
        const signalingManager = SignalingManager.getInstance();
        signalingManagerRef.current = signalingManager;

        const handleTradeUpdate = (data: unknown) => {
          try {
            if (data && typeof data === 'object') {
              let tradeData: Trade | null = null;

              if (
                'type' in data &&
                (data as { type?: string }).type === 'TRADE' &&
                'data' in data
              ) {
                tradeData = (data as { data: Trade }).data;
              }

              if (tradeData) {
                setTrades((prev: Trade[]) => {
                  // Check for duplicates
                  const existingIndex = prev.findIndex(
                    tx =>
                      tx.time === tradeData!.time &&
                      tx.traderAddress === tradeData!.traderAddress
                  );

                  if (existingIndex !== -1) {
                    return prev;
                  }

                  // Add new trade and maintain limit
                  return [tradeData!, ...prev.slice(0, limit - 1)];
                });
              }
            }
          } catch (error) {
            console.error('Error processing trade update:', error);
          }
        };

        await signalingManager.registerCallback(
          'TRADE',
          handleTradeUpdate,
          `useTrades-${tokenMint}`
        );

        // signalingManager.sendMessage({
        //   type: 'SUBSCRIBE',
        //   room: `${tokenMint}`,
        // });

        console.log('Realtime trades subscription active for:', tokenMint);
      } catch (err) {
        console.error('Failed to setup realtime trades:', err);
      }
    };

    initializeRealtime();

    return () => {
      if (signalingManagerRef.current) {
        signalingManagerRef.current.deRegisterCallback(
          'TRADE',
          `useTrades-${tokenMint}`
        );
      }
    };
  }, [enableRealtime, tokenMint, limit]);

  return {
    trades,
    isLoading,
    error,
    refresh: fetchTrades,
    getTimeRange,
  };
}
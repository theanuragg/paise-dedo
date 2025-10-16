'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ChartManager } from '@/utils/ChartManager';
import { getKlines } from '@/utils/httpClient';
import { ChartControl, TimeInterval } from './ChartControl';
import { useTrades } from '@/hooks/useTrades';

interface ChartProps {
  tokenMint?: string;
}

export default function Chart({ tokenMint }: ChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartManagerRef = useRef<ChartManager | null>(null);
  const [selectedInterval, setSelectedInterval] = useState<TimeInterval>('1h');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    trades,
    isLoading: tradesLoading,
    getTimeRange: getTradeTimeRange,
  } = useTrades({
    tokenMint: tokenMint || '',
    limit: 200,
    enableRealtime: false,
  });

  const init = useCallback(async () => {
    if (!tokenMint || !chartRef.current || tradesLoading) return;

    setLoading(true);
    setError(null);

    try {
      const klineData = await getKlines(tokenMint, selectedInterval);

      const tradeTimeRange = getTradeTimeRange();
      console.log('Trade time range:', tradeTimeRange);
      console.log('Total trades:', trades.length);

      if (chartManagerRef.current) {
        chartManagerRef.current.destroy();
        chartManagerRef.current = null;
      }

      const processedData = klineData
        .map((x, index) => {
          const close = parseFloat(x.close) || 0;
          const high = parseFloat(x.high) || 0;
          const low = parseFloat(x.low) || 0;
          const open = parseFloat(x.open) || 0;

          let scale = 1;
          if (close > 0 && close < 0.001) {
            scale = 1000000;
          } else if (close > 0 && close < 0.01) {
            scale = 100000;
          } else if (close > 0 && close < 0.1) {
            scale = 10000;
          }

          let timestamp: number;
          const endValue = parseInt(x.end);

          if (
            trades.length > 0 &&
            tradeTimeRange.earliest &&
            tradeTimeRange.latest
          ) {
            const tradeRangeMs =
              tradeTimeRange.latest.getTime() -
              tradeTimeRange.earliest.getTime();
            const klineCount = klineData.length;

            if (endValue < 1e10) {
              const intervalMs = tradeRangeMs / klineCount;
              timestamp =
                tradeTimeRange.earliest.getTime() + index * intervalMs;
            } else if (endValue > 1e12) {
              timestamp = endValue;
            } else {
              timestamp = endValue * 1000;
            }
          } else {
            timestamp = endValue > 1e12 ? endValue : endValue * 1000;
          }

          return {
            close: close * scale,
            high: high * scale,
            low: low * scale,
            open: open * scale,
            volume: parseFloat(x.volume) || 0,
            timestamp: timestamp,
          };
        })
        .sort((a, b) => a.timestamp - b.timestamp);

      const chartManager = new ChartManager(chartRef.current, processedData, {
        background: '#0a0a0a',
        color: '#ffffff',
      });

      chartManagerRef.current = chartManager;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load chart data');
    } finally {
      setLoading(false);
    }
  }, [tokenMint, selectedInterval, trades, tradesLoading, getTradeTimeRange]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    return () => {
      if (chartManagerRef.current) {
        chartManagerRef.current.destroy();
        chartManagerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="bg-bg-black/5 border border-white/5 rounded-2xl overflow-hidden">
      <ChartControl
        selectedInterval={selectedInterval}
        onIntervalChange={setSelectedInterval}
      />
      <div className="p-3 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00ffff]"></div>
              <span className="text-sm text-neutral-300">
                Loading chart data...
              </span>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 backdrop-blur-sm z-10">
            <div className="text-center">
              <div className="text-red-400 text-sm mb-2">
                Failed to load chart
              </div>
              <div className="text-red-300 text-xs mb-2">{error}</div>
              <button
                onClick={init}
                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        <div
          ref={chartRef}
          style={{
            height: '450px',
            width: '100%',
            position: 'relative',
            overflow: 'visible',
          }}
          className={`rounded-lg overflow-hidden ${loading || error ? 'opacity-50' : ''}`}
        />
      </div>
    </div>
  );
}

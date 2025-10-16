'use client';

import React from 'react';
import { Coin } from '@/utils/types';
import { useCurveProgress } from '@/hooks/useCurveProgress';
import { toast } from 'sonner';
import { useMarketCap } from '@/hooks/useMarketCap';

interface TokenStatisticsProps {
  coin: Coin;
}

export function TokenStatistics({ coin }: TokenStatisticsProps) {
  const { progress, baseReserve, percentageSold } = useCurveProgress(
    coin?.bonding_curve ?? ''
  );
  const { marketCap } = useMarketCap(coin?.bonding_curve ?? '');

  const graduationTarget = 75;
  const progressPercentage = `${(Number(progress) * 100).toFixed(2)}%`;
  const tokensInCurve = baseReserve || 0;
  const tokensSold = percentageSold;

  return (
    <>
      <div className="bg-[#0C1014] border border-white/5 rounded-2xl p-4 sm:p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium text-lg">
              {coin.name} ({coin.symbol})
            </h3>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${coin.complete ? 'bg-green-500' : 'bg-orange-500'}`}
              ></div>
              <span className="text-sm text-neutral-400">
                {coin.complete ? 'graduated' : 'Active'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-neutral-400 text-sm mb-1">Market Cap</div>
              <div className="text-white font-bold text-xl">
                {`$${marketCap.toFixed(2)}`}
              </div>
            </div>
            <div>
              <div className="text-neutral-400 text-sm mb-1">
                Virtual token reserves
              </div>
              <div className="text-white font-bold text-xl">
                {tokensInCurve.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-400">
                  Bonding curve progress:
                </span>
                <span className="text-white font-medium">
                  {progressPercentage}
                </span>
              </div>
              <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00b8b8] to-[#65e7fc] rounded-full transition-all duration-500"
                  style={{ width: progressPercentage }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center text-sm pt-2">
              <div>
                <div className="text-neutral-400 mb-1">Status</div>
                <div
                  className={`font-medium ${coin.complete ? 'text-[#00ffff]' : 'text-orange-400'}`}
                >
                  {coin.complete ? 'Graduated' : 'Active'}
                </div>
              </div>
              <div>
                <div className="text-neutral-400 mb-1">Created</div>
                <div className="text-white font-medium">
                  {new Date(coin.created_timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center text-sm pt-2 border-t border-neutral-700">
              <div className="pt-3">
                <div className="text-white font-bold text-lg">
                  {`$${graduationTarget}K`}
                </div>
                <div className="text-neutral-400 text-xs mt-1">
                  Graduation target
                </div>
              </div>
              <div className="pt-3">
                <div className="text-white font-bold text-lg">
                  {tokensSold?.toFixed(2)}%
                </div>
                <div className="text-neutral-400 text-xs mt-1">Tokens sold</div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-700">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-neutral-400 text-sm">Token address:</div>
                <div className="flex items-center gap-2">
                  <div className="text-[#00ffff] font-mono text-sm">
                    {`${coin.mint.slice(0, 4)}...${coin.mint.slice(-4)}`}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(coin.mint);
                      toast.success('Mint address copied to clipboard!');
                    }}
                    className=""
                    title="Copy mint address"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-neutral-400"
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div className="text-neutral-400 text-sm">Pool Address:</div>
                <div className="flex items-center gap-2 justify-end">
                  <div className="text-white text-sm font-mono">
                    {coin.bonding_curve
                      ? `${coin.bonding_curve.slice(0, 4)}...${coin.bonding_curve.slice(-4)}`
                      : 'N/A'}
                  </div>
                  {coin.bonding_curve && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(coin.bonding_curve);
                        toast.success('Pool address copied to clipboard!');
                      }}
                      className="hover:opacity-75 transition-opacity"
                      title="Copy pool address"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-neutral-400"
                      >
                        <rect
                          width="14"
                          height="14"
                          x="8"
                          y="8"
                          rx="2"
                          ry="2"
                        />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-2">
              {/* <div>
                <div className="text-neutral-400 text-sm">SOL Reserves:</div>
                <div className="text-white text-sm">
                  {(coin.virtual_sol_reserves || 0).toFixed(4)} SOL
                </div>
              </div> */}
              <div className="text-">
                <div className="text-neutral-400 text-sm mb-1">Platform:</div>
                <div className="text-orange-400 text-sm font-medium">
                  onlyfounder.fun
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0a0a0a] rounded-xl p-4 mt-4">
          <div className="flex justify-between items-center mb-3">
            <div>
              <div className="text-neutral-400 text-sm">Creator:</div>
              <div className="flex items-center gap-2">
                <div className="text-yellow-400 font-medium font-mono">
                  {`${coin.creator.slice(0, 4)}...${coin.creator.slice(-4)}`}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(coin.creator);
                    toast.success('Creator address copied to clipboard!');
                  }}
                  className="hover:opacity-75 transition-opacity"
                  title="Copy creator address"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-neutral-400"
                  >
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="text-right">
              <div className="text-neutral-400 text-sm">Total Supply</div>
              <div className="text-white">
                {(coin.total_supply / 1000000000).toFixed(2)}B
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TokenStatistics;

'use client';

import React from 'react';

interface TokenData {
  bondingCurveProgress: number;
  currentRaise: number;
  targetRaise: number;
  marketCap: number;
}

interface TokenStatsProps {
  tokenData: TokenData;
}

export function TokenStats({ tokenData }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Bonding Curve',
            value: `${tokenData.bondingCurveProgress}%`,
          },
          {
            label: 'Current Raise',
            value: `${tokenData.currentRaise.toFixed(3)} USDC`,
          },
          { label: 'Target Raise', value: `${tokenData.targetRaise}K USDC` },
          {
            label: 'Market Cap',
            value: `$${tokenData.marketCap.toLocaleString()}K`,
          },
        ].map(stat => (
          <div
            key={stat.label}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 backdrop-blur-xl"
          >
            <div className="text-sm text-muted-foreground">{stat.label}</div>
            <div className="text-xl font-semibold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 backdrop-blur-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#e5e7eb]">
            Bonding Curve Progress
          </h3>
          <span className="text-[#00ffff] font-semibold">
            {tokenData.bondingCurveProgress}%
          </span>
        </div>
        <div className="w-full bg-neutral-700 rounded-full h-3 mb-4">
          <div
            className="bg-gradient-to-r from-[#00ffff] to-[#00ffff]/70 h-3 rounded-full transition-all duration-500"
            style={{ width: `${tokenData.bondingCurveProgress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Pool 1</span>
          <span>2 Graduated</span>
        </div>
      </div>
    </div>
  );
}

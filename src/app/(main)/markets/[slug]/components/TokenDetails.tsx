'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Coin } from '@/utils/types';
import { getSolscanTokenUrl, formatCurrency } from '@/lib/utils';
import { useCurveProgress } from '@/hooks/useCurveProgress';

import { useMarketCap } from '@/hooks/useMarketCap';
interface TokenDetailsProps {
  tokenMint?: string;
  coin?: Coin;
}
export function TokenDetails({ tokenMint, coin }: TokenDetailsProps) {
  const { progress } = useCurveProgress(coin?.bonding_curve || '');
  const { marketCap, error, isLoading } = useMarketCap(coin?.bonding_curve ?? '');
  const [copied, setCopied] = useState(false);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffMs = now.getTime() - created.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes}m ago`;
    }
  };
  
  const handleShare = (mintAddress?: string) => {
    if (mintAddress) {
      const solscanUrl = getSolscanTokenUrl(mintAddress, 'devnet');
      window.open(solscanUrl, '_blank');
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleCopyAddress = async () => {
    if (coin?.mint) {
      await navigator.clipboard.writeText(coin.mint);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }
  };
  if (isLoading) {
    return (
      <div className="w-full bg-bg-black/5 border border-white/5 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="flex items-start gap-4">
            <div className="size-16 rounded-xl bg-neutral-700"></div>
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-neutral-700 rounded w-1/3"></div>
              <div className="h-4 bg-neutral-700 rounded w-2/3"></div>
              <div className="h-3 bg-neutral-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (error || !coin) {
    return (
      <div className="w-full bg-bg-black/5 border border-white/5 rounded-2xl p-6">
        <div className="text-center py-8">
          <div className="text-red-400 text-4xl mb-2">:warning:</div>
          <p className="text-neutral-400">
            {error || 'Token data not available'}
          </p>
        </div>
      </div>
    );
  }

  const graduationTarget = 75000;

  return (
    <div className="w-full bg-bg-black/5 border border-white/5 rounded-2xl p-6">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
        <div className="flex items-start gap-4 flex-1">
          <div className="relative size-16 rounded-xl overflow-hidden border border-[#00ffff]/20 flex-shrink-0">
            {coin.image_uri && !coin.image_uri.includes('.json') ? (
              <Image
                src={coin.image_uri}
                alt={`${coin.name} Logo`}
                className="object-cover w-full h-full"
                width={64}
                height={64}
                onError={e => {
                  (e.target as HTMLImageElement).src = '/only-founder.png';
                }}
              />
            ) : (
              <Image
                src="/only-founder.png"
                alt={`${coin.name} Logo`}
                width={64}
                height={64}
                className="object-cover"
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 mb-2">
              <h1 className="font-semibold text-xl text-white">
                {coin.name}
                <span className="text-[#00ffff] text-sm ml-1 font-medium">
                  ({coin.symbol})
                </span>
              </h1>
              <p className="text-sm text-neutral-300">{coin.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-neutral-400">Market cap:</span>
                <span className="text-white font-medium">
                  ${marketCap.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-400">created</span>
                <span className="text-white">
                  {formatTimeAgo(coin.created_at.toString())}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-neutral-400 text-sm">Token address:</span>
              <span className="text-[#00ffff] font-mono text-sm">
                <span
                  className="cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1"
                  onClick={handleCopyAddress}
                >
                  {`${coin.mint.slice(0, 4)}...${coin.mint.slice(-4)}`}
                  {copied ? (
                    <svg
                      className="w-3 h-3 text-green-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg
                      className="w-3 h-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M8 4v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.242a2 2 0 0 0-.602-1.43L16.083 2.57A2 2 0 0 0 14.685 2H10a2 2 0 0 0-2 2z" />
                      <path d="M16 18v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2" />
                    </svg>
                  )}
                </span>
              </span>
              <Button
                onClick={() => handleShare(coin.mint)}
                size="sm"
                variant="ghost"
                aria-label="Share project"
                className="h-6 w-6 p-0 rounded bg-white/10 hover:bg-white/20 text-white hover:text-[#00ffff] transition-all duration-200"
              >
                <Share2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-80 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Bonding curve progress:</span>
            <span className="text-white font-medium">
              {(Number(progress) * 100).toFixed(2)}%
            </span>
          </div>
          <div className="h-4 bg-[#0a0f12] rounded-full overflow-hidden border border-[#65e7fc]/10 relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${(Number(progress) * 100).toFixed(2)}%`,
              }}
              transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="h-full rounded-full bg-gradient-to-r from-[#00b8b8] to-[#65e7fc] shadow-[0_0_20px_rgba(0,255,255,0.3)] relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </motion.div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-neutral-400">Status</div>
              <div className="text-[#00ffff] font-medium">
                {coin.complete ? 'Graduated :tada:' : 'Active :fire:'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-neutral-400">Graduation at</div>
              <div className="text-white font-medium">
                {(graduationTarget / 1000).toFixed(0)}k
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

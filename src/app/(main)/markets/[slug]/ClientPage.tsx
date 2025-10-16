'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Footer from '@/components/landing/footer';
import Chart from './components/Chart';
import RealtimeTransactions from './components/RealtimeTransactions';
import { getCoinByMint } from '@/utils/httpClient';
import { Coin } from '@/utils/types';
import { TokenDetails } from './components/TokenDetails';
import { SwapModal } from './components/SwapModal';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { TokenStatistics } from './components/AboutToken';
import { LoaderThree } from '@/components/ui/loader';
import { SignalingManager } from '@/utils/SignalingManager';
import SwapComponent from './components/Swap';

export default function ClientPage() {
  const params = useParams<{ slug: string }>();
  const tokenMint = params?.slug;
  const [coin, setCoin] = useState<Coin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (tokenMint) {
      getCoinByMint(tokenMint)
        .then(coinData => {
          setCoin(coinData);
        })
        .catch(err => {
          setError(err.message || 'Failed to fetch token data');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [tokenMint]);

  useEffect(() => {
    if (tokenMint) {
      const signalingManager = SignalingManager.getInstance();
      signalingManager.subscribeToToken(tokenMint);
      return () => {
        signalingManager.unsubscribeFromToken(tokenMint);
      };
    }
  }, [tokenMint]);

  const isGraduated = coin?.bonding_curve_stats.is_graduated;

  const handleOpenModal = () => {
    console.log('Opening swap modal for token:', tokenMint);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('Closing swap modal');
    setIsModalOpen(false);
  };

  if (loading || !coin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0a]/40 via-[#0a0a0a]/40">
        <div className="flex items-center gap-2">
          <LoaderThree />
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a]/30 via-[#0a0a0a]/20 mb-30 rounded-4xl text-white relative overflow-hidden">
        <div className="px-4 py-8">
          <Link
            className="text-sm mb-6 text-neutral-300 hover:text-white cursor-pointer flex items-center gap-2 w-fit"
            href={'/markets'}
          >
            <ArrowLeft className="size-4" /> Back
          </Link>

          {isGraduated && (
            <div className="mb-4 p-3 bg-gradient-to-r from-yellow-500/10 to-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-400 text-sm text-center font-medium">
                {coin.name} is now graduated on OnlyFounders! 🎉 You can swap
                this token on OnlyFounders with any available token.
              </p>
            </div>
          )}

          <div className="mb-4">
            <TokenDetails tokenMint={tokenMint} coin={coin} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div className="col-span-1 lg:col-span-2 space-y-4">
              <Chart tokenMint={tokenMint} />
              <RealtimeTransactions
                tokenSymbol={coin.symbol}
                tokenMint={tokenMint}
              />
            </div>
            <div className="col-span-1 space-y-4">
             <SwapComponent mintAddress={tokenMint}/>
              <TokenStatistics coin={coin} />
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden">
        <div className="bg-neutral-950 border-t border-[#65e7fc]/20 p-4">
          <button
            onClick={handleOpenModal}
            className="w-full py-2 rounded-2xl font-funnel-display font-semibold text-lg bg-[#65e7fc] text-white hover:bg-[#65e7fc]/90 transition-all duration-200"
          >
            Swap {coin.symbol}
          </button>
        </div>
      </div>

      <SwapModal
        poolAddress={coin.bonding_curve}
        tokenName={coin.name}
        tokenSymbol={coin.symbol}
        tokenImage={coin.image_uri}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mintAddress={tokenMint}
      />
      <Footer />
    </>
  );
}
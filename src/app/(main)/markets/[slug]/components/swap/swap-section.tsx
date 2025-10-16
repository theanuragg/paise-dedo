'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  DynamicBondingCurveClient,
  SwapParam,
} from '@meteora-ag/dynamic-bonding-curve-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import BN from 'bn.js';
import { toast } from 'sonner';
import ConnectWalletButton from '@/components/wallet/ConnectWalletButton';

interface SwapSectionProps {
  tokenMint: string;
  tokenSymbol: string;
  poolAddress: string;
  connection: Connection;
  tokenImage?: string;
  tokenName?: string;
}

export function SwapSection({
  tokenSymbol,
  poolAddress,
  connection,
  tokenImage,
}: SwapSectionProps) {
  console.log('SwapSection');
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const POOL_ADDRESS = poolAddress;

  const TOKEN_SYMBOL = tokenSymbol;
  const TOKEN_BALANCE = 0;
  const PRICE_PER_TOKEN = 0.0012;
  const SLIPPAGE_BPS = 100; // 1% slippage in basis points
  const wallet = useWallet();
  const getSwapQuote = async (amount: number, isBuy: boolean) => {
    try {
      const client = new DynamicBondingCurveClient(connection, 'confirmed');
      const virtualPoolState = await client.state.getPool(POOL_ADDRESS);
      if (!virtualPoolState) {
        throw new Error('Pool not found');
      }

      const poolConfigState = await client.state.getPoolConfig(
        virtualPoolState.config
      );

      const currentPoint = new BN(0);
      const decimals = 9;
      const amountIn = new BN(Math.floor(amount * Math.pow(10, decimals)));

      const quote = await client.pool.swapQuote({
        virtualPool: virtualPoolState,
        config: poolConfigState,
        swapBaseForQuote: isBuy ? false : true,
        amountIn,
        slippageBps: SLIPPAGE_BPS,
        hasReferral: false,
        currentPoint,
      });

      return quote;
    } catch (error) {
      console.error('Failed to get swap quote:', error);
      throw error;
    }
  };
  const handleBuy = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }
    if (!buyAmount || parseFloat(buyAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setIsLoading(true);
    const toastId = toast.loading('Preparing swap...');
    try {
      const client = new DynamicBondingCurveClient(connection, 'confirmed');

      // Get pool states
      const poolState = await client.state.getPool(POOL_ADDRESS);
      const poolConfig = await client.state.getPoolConfig(poolState.config);

      // Calculate amount with proper decimals (9 for SOL, 6 for USDC)
      const quoteDecimals = 9; // Adjust based on your quote token
      const amountIn = new BN(
        Math.floor(parseFloat(buyAmount) * Math.pow(10, quoteDecimals))
      );

      // Get quote
      const quote = await client.pool.swapQuote({
        virtualPool: poolState,
        config: poolConfig,
        swapBaseForQuote: false, // false = buying base token
        amountIn,
        slippageBps: 100, // 1% slippage
        hasReferral: false,
        currentPoint: new BN(0),
      });
      const swapParam = {
        amountIn,
        minimumAmountOut: quote.minimumAmountOut,
        swapBaseForQuote: false,
        owner: wallet.publicKey,
        pool: new PublicKey(POOL_ADDRESS),
        referralTokenAccount: null,
      };
      const swapTx = await client.pool.swap(swapParam);

      if (!wallet.signTransaction) {
        throw new Error('Wallet does not support transaction signing');
      }

      const { blockhash } = await connection.getLatestBlockhash();
      swapTx.recentBlockhash = blockhash;
      swapTx.feePayer = wallet.publicKey;
      const signedTx = await wallet.signTransaction(swapTx!);
      const signature = await connection.sendRawTransaction(
        signedTx.serialize(),
        {
          skipPreflight: false,
          maxRetries: 3,
        }
      );
      await connection.confirmTransaction(signature, 'confirmed');

      toast.success('Swap successful!', { id: toastId });
      setBuyAmount('');
    } catch (error: any) {
      console.error('Swap failed:', error);
      toast.error(error?.message || 'Swap failed', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSell = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!sellAmount || parseFloat(sellAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsLoading(true);

    try {
      const client = new DynamicBondingCurveClient(connection, 'confirmed');
      const quote = await getSwapQuote(parseFloat(sellAmount), false);
      const swapParam = {
        amountIn: new BN(parseFloat(sellAmount) * LAMPORTS_PER_SOL),
        minimumAmountOut: quote.minimumAmountOut,
        swapBaseForQuote: true,
        owner: wallet.publicKey,
        pool: new PublicKey(POOL_ADDRESS),
        referralTokenAccount: null,
      };
      const swapTransaction = await client.pool.swap(swapParam);

      const { blockhash } = await connection.getLatestBlockhash();
      swapTransaction.recentBlockhash = blockhash;
      swapTransaction.feePayer = wallet.publicKey;

      if (!wallet.signTransaction) {
        throw new Error('Wallet does not support transaction signing');
      }

      const signedTx = await wallet.signTransaction(swapTransaction);
      const signature = await connection.sendRawTransaction(
        signedTx.serialize(),
        {
          skipPreflight: false,
          maxRetries: 5,
        }
      );

      await connection.confirmTransaction(signature, 'confirmed');

      toast.success(`Sell successful! Transaction: ${signature}`);

      setSellAmount('');
    } catch (error: any) {
      console.error('Swap failed:', error);
      toast.error(error?.message || 'Failed to execute swap');
    } finally {
      setIsLoading(false);
    }
  };

  const currentAmount = activeTab === 'buy' ? buyAmount : sellAmount;
  const setCurrentAmount = activeTab === 'buy' ? setBuyAmount : setSellAmount;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#1a1f2eb5]/30 border border-[#2a3441]/50 rounded-[28px] p-3 space-y-4">
        <div className="flex bg-[#2a3441] rounded-[20px] p-1">
          <button
            onClick={() => setActiveTab('buy')}
            className={`flex-1 py-4 px-4 rounded-2xl font-medium transition-all ${
              activeTab === 'buy'
                ? 'bg-cyan-400 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`flex-1 py-4 px-4 rounded-2xl font-medium transition-all ${
              activeTab === 'sell'
                ? 'bg-red-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sell
          </button>
        </div>

        <div className="space-y-2">
          <div className="bg-[#2a3441] rounded-2xl p-4">
            <div className="relative flex items-center justify-between">
              <input
                type="number"
                placeholder="0.00"
                value={currentAmount}
                onChange={e => setCurrentAmount(e.target.value)}
                className="bg-transparent text-left text-xl font-medium text-white placeholder-slate-500 border-none outline-none flex-1"
              />
              <div className="absolute -right-2.5 flex items-center gap-2 bg-[#1a1f2e] rounded-[14px] px-3 py-3">
                {activeTab === 'buy' ? (
                  <>
                    <Image
                      src="/solana.png"
                      alt="SOL"
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <span className="text-white font-medium">SOL</span>
                  </>
                ) : (
                  <>
                    {tokenImage ? (
                      <Image
                        src={tokenImage}
                        alt={TOKEN_SYMBOL}
                        width={20}
                        height={20}
                        className="rounded-full size-7 object-cover"
                      />
                    ) : (
                      <div className="w-5 h-5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
                    )}
                    <span className="text-white font-medium">
                      {TOKEN_SYMBOL}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-1 font-mono">
          <button
            onClick={() => setCurrentAmount('')}
            className="px-3 py-1 bg-[#2a3441] text-slate-300 text-xs rounded-lg border border-slate-700 hover:bg-[#3a4451] transition-colors"
          >
            Reset
          </button>
          {activeTab === 'buy' ? (
            <>
              <button
                onClick={() => setBuyAmount('0.1')}
                className="px-3 py-1 bg-[#2a3441] text-slate-300 text-xs rounded-lg border border-slate-700 hover:bg-[#3a4451] transition-colors"
              >
                0.1
              </button>
              <button
                onClick={() => setBuyAmount('0.5')}
                className="px-3 py-1 bg-[#2a3441] text-slate-300 text-xs rounded-lg border border-slate-700 hover:bg-[#3a4451] transition-colors"
              >
                0.5
              </button>
              <button
                onClick={() => setBuyAmount('1')}
                className="px-3 py-1 bg-[#2a3441] text-slate-300 text-xs rounded-lg border border-slate-700 hover:bg-[#3a4451] transition-colors"
              >
                1
              </button>
              <button
                onClick={async () => {
                  if (wallet.publicKey) {
                    const balance = await connection.getBalance(
                      wallet.publicKey
                    );
                    setBuyAmount(
                      (balance / LAMPORTS_PER_SOL - 0.000105).toString()
                    );
                  }
                }}
                className="px-3 py-1 bg-[#2a3441] text-slate-300 text-xs rounded-lg border border-slate-700 hover:bg-[#3a4451] transition-colors"
              >
                MAX
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() =>
                  setSellAmount(((TOKEN_BALANCE || 0) * 0.25).toString())
                }
                className="px-3 py-1 bg-[#2a3441] text-slate-300 text-xs rounded-lg border border-slate-700 hover:bg-[#3a4451] transition-colors"
              >
                25%
              </button>
              <button
                onClick={() =>
                  setSellAmount(((TOKEN_BALANCE || 0) * 0.5).toString())
                }
                className="px-3 py-1 bg-[#2a3441] text-slate-300 text-xs rounded-lg border border-slate-700 hover:bg-[#3a4451] transition-colors"
              >
                50%
              </button>
              <button
                onClick={() =>
                  setSellAmount(((TOKEN_BALANCE || 0) * 0.75).toString())
                }
                className="px-3 py-1 bg-[#2a3441] text-slate-300 text-xs rounded-lg border border-slate-700 hover:bg-[#3a4451] transition-colors"
              >
                75%
              </button>
              <button
                onClick={() => setSellAmount((TOKEN_BALANCE || 0).toString())}
                className="px-3 py-1 bg-[#2a3441] text-slate-300 text-xs rounded-lg border border-slate-700 hover:bg-[#3a4451] transition-colors"
              >
                100%
              </button>
            </>
          )}
        </div>

        <div className="bg-[#2a3441] rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">You will receive:</span>
            <div className="text-right">
              <div className="text-white font-medium">
                {activeTab === 'buy'
                  ? buyAmount
                    ? (parseFloat(buyAmount) * 833.33).toFixed(2)
                    : '0.00'
                  : sellAmount
                    ? (parseFloat(sellAmount) / 833.33).toFixed(4)
                    : '0.00'}
              </div>
              <div className="text-xs text-slate-400">
                {activeTab === 'buy' ? TOKEN_SYMBOL : 'SOL'}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Price per token:</span>
            <span className="text-white font-medium">${PRICE_PER_TOKEN}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Slippage Tolerance:</span>
            <span className="text-white font-medium">
              {(SLIPPAGE_BPS / 100).toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="pt-2">
          {wallet.connected ? (
            <Button
              onClick={activeTab === 'buy' ? handleBuy : handleSell}
              disabled={
                isLoading || !currentAmount || parseFloat(currentAmount) <= 0
              }
              className={`w-full py-6 text-base font-medium rounded-xl transition-all duration-200 ${
                activeTab === 'buy'
                  ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {isLoading
                ? 'Processing...'
                : !currentAmount || parseFloat(currentAmount) <= 0
                  ? 'Enter amount'
                  : activeTab === 'buy'
                    ? 'Buy Token'
                    : 'Sell Token'}
            </Button>
          ) : (
            <div className="w-full flex items-center justify-end">
              <ConnectWalletButton className="w-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

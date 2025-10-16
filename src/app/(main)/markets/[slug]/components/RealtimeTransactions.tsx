'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getTopHolders } from '@/utils/httpClient';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useTrades } from '@/hooks/useTrades';

interface TopHolderData {
  holder_address: string;
  amount: string;
  sol_balance: string;
}

interface TopHoldersResponse {
  top_holders: TopHolderData[];
  total_holders: number;
}

interface TopHolder {
  id: string;
  address: string;
  balance: string;
  percentage: string;
  sol_balance: string;
  rank: number;
}

export function RealtimeTransactions({
  tokenMint,
  tokenSymbol,
}: {
  tokenMint: string;
  tokenSymbol: string;
}) {
  const { trades, isLoading, error } = useTrades({
    tokenMint,
    limit: 50,
    enableRealtime: true,
  });

  const [topHolders, setTopHolders] = useState<TopHolder[]>([]);
  const [activeTab, setActiveTab] = useState<'trades' | 'holders'>('trades');

  const fetchTopHolders = useCallback(async () => {
    if (!tokenMint) return;

    try {
      const data: TopHoldersResponse = await getTopHolders(tokenMint);

      if (
        data &&
        data.top_holders &&
        Array.isArray(data.top_holders) &&
        data.top_holders.length > 0
      ) {
        const totalSupply = data.top_holders.reduce(
          (sum, holder) => sum + parseFloat(holder.amount),
          0
        );

        const formattedHolders: TopHolder[] = data.top_holders
          .slice(0, 10)
          .map((holder: TopHolderData, index: number) => {
            const amount = parseFloat(holder.amount);
            const percentage =
              totalSupply > 0 ? (amount / totalSupply) * 100 : 0;

            return {
              id: holder.holder_address,
              address: `${holder.holder_address.slice(0, 4)}...${holder.holder_address.slice(-4)}`,
              balance: amount.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              }),
              sol_balance: holder.sol_balance.toLocaleString(),
              percentage: percentage.toFixed(2),
              rank: index + 1,
            };
          });

        setTopHolders(formattedHolders);
      } else {
        setTopHolders([]);
      }
    } catch (error) {
      console.error('Failed to fetch top holders:', error);
      setTopHolders([]);
    }
  }, [tokenMint]);

  useEffect(() => {
    fetchTopHolders();
  }, [fetchTopHolders]);

  return (
    <div className="bg-black/30 border border-white/5 font-mono rounded-2xl w-full">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('trades')}
              className={`text-sm font-medium transition-colors duration-200 ${
                activeTab === 'trades'
                  ? 'text-[#26e1fd] border-b-2 border-[#26e1fd] pb-1'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Trades
            </button>
            <button
              onClick={() => setActiveTab('holders')}
              className={`text-sm font-medium transition-colors duration-200 ${
                activeTab === 'holders'
                  ? 'text-[#26e1fd] border-b-2 border-[#26e1fd] pb-1'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Top Holders
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="text-xs text-neutral-400 p-2">Loading...</div>
        )}
        {error && <div className="text-xs text-red-400 p-2">{error}</div>}
        <div className="max-h-[470px] hide-scrollbar overflow-y-auto">
          <Table>
            <TableHeader className="">
              <TableRow className="border-[#333]/50">
                {activeTab === 'trades' ? (
                  <>
                    <TableHead className="text-neutral-400 text-left font-medium tracking-wider">
                      Account
                    </TableHead>
                    <TableHead className="text-neutral-400 text-left font-medium tracking-wider">
                      Type
                    </TableHead>
                    <TableHead className="text-neutral-400 text-left font-medium tracking-wider">
                      Amount(SOL)
                    </TableHead>
                    <TableHead className="text-neutral-400 text-left font-medium tracking-wider">
                      Amount({tokenSymbol})
                    </TableHead>
                    <TableHead className="text-neutral-400 text-left font-medium tracking-wider">
                      Time
                    </TableHead>
                    {/* <TableHead className="text-neutral-400 text-left font-medium tracking-wider">
                      Tx Link
                    </TableHead> */}
                  </>
                ) : (
                  <>
                    <TableHead className="text-neutral-400 text-left font-medium tracking-wider">
                      Rank
                    </TableHead>
                    <TableHead className="text-neutral-400 text-left font-medium tracking-wider">
                      Address
                    </TableHead>
                    <TableHead className="text-neutral-400 text-left font-medium tracking-wider">
                      Balance
                    </TableHead>
                    <TableHead className="text-neutral-400 text-left font-medium tracking-wider">
                      Amount
                    </TableHead>
                    <TableHead className="text-neutral-400 text-left font-medium tracking-wider">
                      Percentage
                    </TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeTab === 'trades'
                ? trades.map((tx, idx: number) => (
                    <TableRow
                      key={tx.time || idx}
                      className={`border-[#333]/50 ${
                        idx % 2 === 0 ? 'bg-[#333]/20' : ''
                      } hover:bg-[#333]/20 transition-colors duration-200`}
                    >
                      <TableCell>
                        <span className="text-xs font-mono text-neutral-300">
                          {tx.traderAddress.slice(0, 4) +
                            '...' +
                            tx.traderAddress.slice(-4)}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            tx.type === 'buy'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {tx.type.toUpperCase()}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="text-white">
                          {/* Units: buy uses SOL in lamports (9 dp), sell uses base token units (assumes 6 dp) */}
                          {tx.type === 'buy'
                            ? tx.amountIn / LAMPORTS_PER_SOL
                            : tx.amountIn / 1e6}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="text-white">
                          {/* amountOut mirrors the opposite leg units (token units for buy, lamports for sell) */}
                          {tx.amountOut}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="text-neutral-400 text-xs">
                          {new Date(tx.time).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </span>
                      </TableCell>
                      {/* 
                      <TableCell>
                        <button className="p-1 hover:bg-[#333] rounded transition-colors duration-200">
                          <ExternalLink className="w-4 h-4 text-[#00ffff]" />
                        </button>
                      </TableCell> */}
                    </TableRow>
                  ))
                : topHolders.map((holder, idx) => (
                    <TableRow
                      key={holder.id}
                      className={`border-[#333]/50 ${
                        idx % 2 === 0 ? 'bg-[#333]/20' : ''
                      } hover:bg-[#333]/20 transition-colors duration-200`}
                    >
                      <TableCell>
                        <span className="text-white font-medium">
                          #{holder.rank}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="text-xs font-mono text-neutral-300">
                          {holder.address}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="text-white">{holder.balance}</span>
                      </TableCell>

                      <TableCell>
                        <span className="text-white">{holder.sol_balance}</span>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="text-[#26e1fd] font-medium">
                            {holder.percentage}%
                          </span>
                          <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#00ffff] to-[#26e1fd] rounded-full"
                              style={{
                                width: `${Math.min(parseFloat(holder.percentage) * 5, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default RealtimeTransactions;

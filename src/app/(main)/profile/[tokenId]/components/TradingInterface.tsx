'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { LoaderThree } from '@/components/ui/loader';

interface TokenData {
  mint: string;
  symbol: string;
  price: number;
}

interface TradeProps {
  type: 'buy' | 'sell';
  tokenData: TokenData;
  onTrade: (amount: number, type: 'buy' | 'sell') => void;
}

export function TradingInterface({ type, tokenData, onTrade }: TradeProps) {
  const [amount, setAmount] = useState('');
  const [estimatedTokens, setEstimatedTokens] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (amount && !isNaN(Number(amount))) {
      const tokens =
        type === 'buy' ? Number(amount) / tokenData.price : Number(amount);
      setEstimatedTokens(tokens);
    } else {
      setEstimatedTokens(0);
    }
  }, [amount, tokenData.price, type]);

  const handleTrade = async () => {
    if (!amount || isNaN(Number(amount))) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    try {
      await onTrade(Number(amount), type);
      setAmount('');
      toast.success(
        `${type === 'buy' ? 'Purchase' : 'Sale'} completed successfully!`
      );
    } catch (error) {
      toast.error(`Failed to ${type}: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#e5e7eb] capitalize">
          {type}ing
        </h3>
        <div className="text-sm text-[#9ca3af]">
          Balance: ${type === 'buy' ? '0.00' : '0'}{' '}
          {type === 'buy' ? 'USDC' : tokenData.symbol}
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor={`${type}-amount`} className="text-[#e5e7eb]">
            {type === 'buy' ? 'Amount (USDC)' : `Amount (${tokenData.symbol})`}
          </Label>
          <Input
            id={`${type}-amount`}
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Enter an amount"
            className="text-lg"
            min="0"
            step={type === 'buy' ? '0.01' : '1'}
          />
        </div>

        <div className="flex gap-2">
          {[10, 50, 100, 'MAX'].map(val => (
            <Button
              key={val}
              variant="secondary"
              size="sm"
              onClick={() => setAmount(val === 'MAX' ? '1000' : val.toString())}
              className="flex-1 text-xs"
            >
              ${val}
            </Button>
          ))}
        </div>

        {estimatedTokens > 0 && (
          <div className="p-3 bg-neutral-800 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">
              {type === 'buy' ? 'You will receive' : 'You will get'}
            </div>
            <div className="text-[#e5e7eb] font-semibold">
              {estimatedTokens.toLocaleString()}{' '}
              {type === 'buy' ? tokenData.symbol : 'USDC'}
            </div>
          </div>
        )}

        <Button
          onClick={handleTrade}
          disabled={!amount || isLoading}
          className={`w-full h-12 text-lg font-semibold transition-all duration-300 ${
            type === 'buy'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <LoaderThree />
              <span>{type === 'buy' ? 'Buying...' : 'Selling...'}</span>
            </div>
          ) : (
            `${type === 'buy' ? 'Buy' : 'Sell'} ${tokenData.symbol}`
          )}
        </Button>
      </div>
    </div>
  );
}

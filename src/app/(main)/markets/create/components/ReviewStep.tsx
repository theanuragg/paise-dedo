'use client';

import React, { useState, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { BasicTokenForm } from './BasicInfoStep';
import { useWallet } from '@solana/wallet-adapter-react';
import { Globe, Twitter, MessageCircle, Link, Send } from 'lucide-react';
import { TokenCard } from '@/components/token/TokenCard';
import { Coin } from '@/types/types';

export type ReviewForm = {
  description: string;
  twitter?: string;
  website?: string;
  telegram?: string;
};

interface ReviewStepProps {
  basicForm: UseFormReturn<BasicTokenForm>;
  reviewForm: UseFormReturn<ReviewForm>;
  onBack: () => void;
  onCustomize: () => void;
  onLaunch: (socialData: string) => void;
  isLaunching?: boolean;
  walletConnected?: boolean;
}

export function ReviewStep({
  basicForm,
  onBack,
  onLaunch,
  isLaunching = false,
  walletConnected = false,
}: ReviewStepProps) {
  const [isCreatingPool, setIsCreatingPool] = useState(false);
  const [showSocials, setShowSocials] = useState(false);
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [twitter, setTwitter] = useState('');
  const [telegram, setTelegram] = useState('');

  const { publicKey, connected } = useWallet();
  const basicData = basicForm.getValues();

  const tokenPreviewData: Coin = useMemo(() => ({
    id: 1,
    mint: '',
    name: basicData.name || 'Token Name',
    symbol: basicData.ticker || 'SYM',
    description: description || null,
    image_uri: basicData.image
      ? URL.createObjectURL(basicData.image)
      : undefined,
    metadata_uri: undefined,
    twitter: twitter || undefined,
    telegram: telegram || undefined,
    website: website || undefined,
    bonding_curve: '',
    associated_bonding_curve: null,
    creator: publicKey?.toString() || '',
    created_timestamp: Date.now(),
    raydium_pool: null,
    complete: false,
    virtual_sol_reserves: 0,
    virtual_token_reserves: 0,
    hidden: null,
    total_supply: 1000000000,
    show_name: true,
    last_trade_timestamp: null,
    king_of_the_hill_timestamp: null,
    market_cap: null,
    nsfw: false,
    market_id: null,
    reply_count: 0,
    is_banned: false,
    is_currently_live: false,
    usd_market_cap: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    price_per_token: null,
    bonding_curve_progress: '0.00%',
    bonding_curve_stats: {
      progress_percentage: 0,
      sol_in_curve: 0,
      graduation_target: 85,
      is_graduated: false,
    },
  }), [basicData.name, basicData.ticker, basicData.image, description, twitter, telegram, website, publicKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsCreatingPool(true);

      if (!connected || !publicKey) {
        toast.error('Wallet not connected');
        return;
      }

      if (!basicData.name || !basicData.ticker || !basicData.image) {
        toast.error(
          'Missing required token information: name, symbol, or image'
        );
        return;
      }

      const socialData = {
        description: description || '',
        twitter: twitter || '',
        website: website || '',
        telegram: telegram || '',
      };

      onLaunch(JSON.stringify(socialData));
    } catch (error) {
      console.error('DBC pool creation failed:', error);
      toast.error(
        `Failed to create DBC pool: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsCreatingPool(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="gap-8">
        <div className="space-y-4 max-w-xl mx-auto">
          <h3 className="text-md font-medium text-slate-400">
            Review Token Details
          </h3>

          <div className="space-y-4">
            <div className="flex justify-center items-center w-full pointer-events-none">
              <div className="w-full">
                <TokenCard project={tokenPreviewData} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">
                Description (Optional)
              </Label>
              <textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe your token..."
                className="w-full min-h-[100px] px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-y"
              />
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setShowSocials(!showSocials)}
                className="w-full text-xs text-left justify-start cursor-pointer flex items-center gap-1"
              >
                <Link className="size-4" />
                Add Social Links (Optional)
              </button>

              {showSocials && (
                <div className="space-y-3 pl-4 border-l-2 border-slate-600">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <Input
                      type="url"
                      value={website}
                      onChange={e => setWebsite(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <Twitter className="w-4 h-4 text-slate-400" />
                    <Input
                      type="url"
                      value={twitter}
                      onChange={e => setTwitter(e.target.value)}
                      placeholder="https://twitter.com/username"
                      className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <Send className="w-4 h-4 text-slate-400" />
                    <Input
                      type="url"
                      value={telegram}
                      onChange={e => setTelegram(e.target.value)}
                      placeholder="https://t.me/username"
                      className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-end gap-3 pt-6">
          <Button
            className="text-black"
            type="button"
            variant="outline"
            onClick={onBack}
          >
            Back
          </Button>

          <Button
            type="submit"
            className="flex items-center space-x-2"
            disabled={!walletConnected || isLaunching || isCreatingPool}
          >
            {isCreatingPool ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Creating DBC Pool...</span>
              </>
            ) : isLaunching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Launching...</span>
              </>
            ) : !walletConnected ? (
              <>
                <span>🔗 Connect Wallet</span>
              </>
            ) : (
              <>
                <span>Launch Token</span>
              </>
            )}
          </Button>
        </div>

        {!walletConnected && (
          <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-500 text-sm text-center">
              You must connect your wallet to launch tokens on Solana
            </p>
          </div>
        )}
      </form>
    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Wallet, User, AlertCircle, Rocket, Users, Loader2 } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';
import { TokenCard } from '@/components/token/TokenCard';
import { Coin } from '@/types/types';
import axios from 'axios';

export default function ProfilePage() {
  const { connected, publicKey } = useWallet();
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [userCreatedTokens, setUserCreatedTokens] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (connected && publicKey) {
      setWalletAddress(publicKey.toString());
    } else {
      setWalletAddress('');
      setUserCreatedTokens([]);
    }
  }, [connected, publicKey]);


  useEffect(() => {
    if (!connected || !walletAddress) {
      setUserCreatedTokens([]);
      return;
    }

    const fetchUserTokens = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`/api/proxy/coins/creator`, {
          params: {
            creator: walletAddress,
            limit: 50
          }
        });

        const data = response.data;
        
  
        // Use data directly as it already matches the Coin interface
        const transformedTokens: Coin[] = data.map((coin: any) => ({
          ...coin,
          // Ensure required fields have default values if missing
          id: coin.id || Math.floor(Math.random() * 1000000),
          mint: coin.mint || '',
          name: coin.name || 'Unknown Token',
          symbol: coin.symbol || 'UNK',
          bonding_curve: coin.bonding_curve || '',
          creator: coin.creator || walletAddress,
          created_timestamp: coin.created_timestamp || Date.now(),
          complete: coin.complete || false,
          virtual_sol_reserves: coin.virtual_sol_reserves || 0,
          virtual_token_reserves: coin.virtual_token_reserves || 0,
          total_supply: coin.total_supply || 0,
          show_name: coin.show_name !== false,
          nsfw: coin.nsfw || false,
          reply_count: coin.reply_count || 0,
          is_banned: coin.is_banned || false,
          is_currently_live: coin.is_currently_live || false,
          created_at: coin.created_at || new Date().toISOString(),
          updated_at: coin.updated_at || new Date().toISOString(),
          bonding_curve_progress: coin.bonding_curve_progress || '0',
          bonding_curve_stats: coin.bonding_curve_stats || {
            progress_percentage: 0,
            sol_in_curve: 0,
            graduation_target: 85,
            is_graduated: coin.complete || false,
          }
        }));

        setUserCreatedTokens(transformedTokens);
      } catch (err) {
        console.error('Error fetching user tokens:', err);
        
        let errorMessage = 'Unable to load your tokens';
        
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 500) {
            errorMessage = 'Server is temporarily unavailable. Please try again later.';
          } else if (err.response?.status === 404) {
            errorMessage = 'No tokens found for this wallet address.';
          } else if (err.response?.status === 403) {
            errorMessage = 'Access denied. Please check your wallet connection.';
          } else if (err.code === 'ERR_NETWORK' || !err.response) {
            errorMessage = 'Network connection issue. Please check your internet connection.';
          }
        } else if (err instanceof Error && err.message.includes('network')) {
          errorMessage = 'Network connection issue. Please check your internet connection.';
        }
        
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserTokens();
  }, [connected, walletAddress]);

    const totalMarketCap = userCreatedTokens.reduce((sum, token) => sum + (token.market_cap || 0), 0);
  const totalPortfolioValue = `$${totalMarketCap.toLocaleString()}`;
  const totalTokensCreated = userCreatedTokens.length;
  const totalVolume = userCreatedTokens.reduce((sum, token) => sum + (token.virtual_sol_reserves || 0), 0);
  const totalHolders = Math.floor(totalVolume * 5); 

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="bg-black/20 backdrop-blur-md border border-white/10 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">
                  User Wallet
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-gray-300" />
              <span className="text-gray-300">Total Portfolio Value:</span>
              <span className="text-2xl font-bold text-white">
                {totalPortfolioValue}
              </span>
            </div>

            <div className="flex items-center justify-between bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-lg p-3">
              {connected && walletAddress ? (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-300 text-sm">
                      Wallet Address:
                    </span>
                    <code className="text-white font-mono text-sm">
                      {`${walletAddress.slice(0, 8)}...${walletAddress.slice(-8)}`}
                    </code>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20"
                    onClick={() => {
                      navigator.clipboard.writeText(walletAddress);
                      toast.success('Address copied to clipboard!');
                    }}
                  >
                    Copy
                  </Button>
                </>
              ) : (
                <div className="flex items-center space-x-2 w-full justify-center">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 text-sm">
                    Wallet not connected
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-black/20 backdrop-blur-md border border-white/10 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Rocket className="w-8 h-8 text-cyan-400" />
                <div>
                  <p className="text-gray-300 text-sm">Tokens Created</p>
                  <p className="text-2xl font-bold text-white">
                    {totalTokensCreated}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-md border border-white/10 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-cyan-400" />
                <div>
                  <p className="text-gray-300 text-sm">Total Holders</p>
                  <p className="text-2xl font-bold text-white">
                    {totalHolders}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-md border border-white/10 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Wallet className="w-8 h-8 text-cyan-400" />
                <div>
                  <p className="text-gray-300 text-sm">Founder Earnings</p>
                  <p className="text-2xl font-bold text-white">
                    {totalPortfolioValue}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-black/20 backdrop-blur-md border border-white/10 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-white flex items-center space-x-2">
                <Rocket className="w-6 h-6 text-cyan-400" />
                <span>Your Created Tokens ({userCreatedTokens.length})</span>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
                  <span className="text-gray-300">Loading your tokens...</span>
                </div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="w-12 h-12 text-cyan-400 mb-4" />
                <p className="text-cyan-400 text-lg mb-2">Oops! Something went wrong</p>
                <p className="text-gray-400 mb-4">{error}</p>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                  className="border-cyan-400 bg-cyan-500 text-white hover:bg-cyan-400/10 hover:text-cyan-300"
                >
                  Try Again
                </Button>
              </div>
            ) : userCreatedTokens.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Rocket className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-300 text-lg mb-2">No tokens created yet</p>
                <p className="text-gray-500 mb-4">Start your journey by creating your first token</p>
                <Link href="/markets/create">
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                    Create Token
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userCreatedTokens.map((token) => (
                  <div key={token.id} className="relative">
                    <Link href={`/profile/${token.mint}`} className="absolute inset-0 z-10">
                      <span className="sr-only">View {token.name} details</span>
                    </Link>
                    <div className="pointer-events-none">
                      <TokenCard project={token} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

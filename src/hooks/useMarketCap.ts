import { useCallback, useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import {
  DynamicBondingCurveClient,
  getPriceFromSqrtPrice,
} from '@meteora-ag/dynamic-bonding-curve-sdk';
import { BN } from 'bn.js';

export const useMarketCap = (poolAddress: string) => {
  const [marketCap, setMarketCap] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const connection = new Connection(
    process.env.NEXT_PUBLIC_RPC_URL!,
    'confirmed'
  );
  const client = new DynamicBondingCurveClient(connection, 'confirmed');
  const calculateMarketCap = useCallback(async (poolAddress: string) => {
    try {
      const poolAddressPubkey = new PublicKey(poolAddress);
      const poolState = await client.state.getPool(poolAddressPubkey);
      const poolConfigState = await client.state.getPoolConfig(
        poolState.config
      );
      const currentPrice = getPriceFromSqrtPrice(
        poolState.sqrtPrice,
        poolConfigState.tokenDecimal,
        6
      );

      const tokenDecimalBN = new BN(10).pow(
        new BN(poolConfigState.tokenDecimal)
      );
      const totalSupplyTokens =
        poolConfigState.preMigrationTokenSupply.div(tokenDecimalBN);

      const marketCap =
        parseFloat(currentPrice.toString()) * totalSupplyTokens.toNumber();
      setMarketCap(marketCap);
      setIsLoading(false);
    } catch (error) {
      setError('Failed to calculate market cap');
      setIsLoading(false);
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (poolAddress) {
      calculateMarketCap(poolAddress);
    }
  }, [poolAddress, calculateMarketCap]);

  return { marketCap, isLoading, error };
};

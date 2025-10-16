import axios from 'axios';
import { KLine, Coin, Trade } from './types';
import { API_BASE_URL } from '@/config/config';

const BASE_URL = API_BASE_URL;

export async function getKlines(
  market: string,
  interval: string
): Promise<KLine[]> {
  const response = await axios.get(`${BASE_URL}/klines/${market}`, {
    params: {
      interval,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
  return response.data;
}

export async function getTrendingCoins(limit?: number): Promise<Coin[]> {
  const response = await axios.get(`${BASE_URL}/coins/trending`, {
    params: { limit },
  });
  return response.data;
}

export async function getRecentCoins(limit?: number): Promise<Coin[]> {
  const response = await axios.get(`${BASE_URL}/coins/recent`, {
    params: { limit },
  });
  return response.data;
}

export async function searchCoins(
  query: string,
  limit?: number
): Promise<Coin[]> {
  const response = await axios.get(`${BASE_URL}/coins/search`, {
    params: { q: query, limit },
  });
  return response.data;
}

export async function getCoinsByCreator(
  creator: string,
  limit?: number
): Promise<Coin[]> {
  const response = await axios.get(`${BASE_URL}/coins/creator`, {
    params: { creator, limit },
  });
  return response.data;
}

export async function getCoinByMint(mint: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = `${base}/api/proxy/coins/mint/${mint}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to fetch coin data');
  return res.json();
}

export async function getCoinByPoolId(poolId: string): Promise<Coin | null> {
  const response = await axios.get(`${BASE_URL}/coins/pool/${poolId}`);
  return response.data;
}

export async function getAllCoins(
  limit?: number,
  page?: number
): Promise<Coin[]> {
  const response = await axios.get(`${BASE_URL}/coins`, {
    params: { limit, page },
  });
  return response.data;
}

export async function getTopHolders(mint: string): Promise<any> {
  const response = await axios.get(`${BASE_URL}/coins/${mint}/holders`);
  return response.data;
}

export async function getBondingCurveStats(mint: string): Promise<any> {
  const response = await axios.get(`${BASE_URL}/coins/${mint}/bonding-curve`);
  return response.data;
}

export async function getRecentTrades(
  mint: string,
  limit?: number,
  offset?: number,
  startTime?: string,
  endTime?: string
): Promise<Trade[]> {
  const response = await axios.get(`${BASE_URL}/trades/${mint}`, {
    params: { limit, offset, start_time: startTime, end_time: endTime },
  });
  return response.data;
}

export async function getTradeById(id: number): Promise<Trade | null> {
  const response = await axios.get(`${BASE_URL}/trades/id/${id}`);
  return response.data;
}

export async function updateCoin(
  mint: string,
  data: Partial<Coin>
): Promise<Coin | null> {
  const response = await axios.put(`${BASE_URL}/coins/mint/${mint}`, data);
  return response.data;
}

export async function getPoolCurveProgress(poolAddress: string): Promise<{
  progress: number | null;
  baseReserve: number | null;
  percentageSold: number | null;
}> {
  try {
    const response = await axios.get(`/api/progress/${poolAddress}`);
    return {
      progress: response.data.progress,
      baseReserve: response.data.baseReserve,
      percentageSold: response.data.percentageSold,
    };
  } catch (error) {
    console.error('Error fetching pool curve progress:', error);
    return { progress: null, baseReserve: null, percentageSold: null };
  }
}

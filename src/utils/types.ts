export interface KLine {
  close: string;
  end: string;
  high: string;
  low: string;
  open: string;
  quote_volume: string;
  start: string;
  trades: string;
  volume: string;
}

export interface Trade {
  traderAddress: string;
  time: string;
  poolAddress: string;
  amountIn: number;
  amountOut: number;
  baseMint: string;
  quoteMint: string;
  type: 'sell' | 'buy';
}

export type { Coin, IToken, TokenDisplay } from '../types/types';

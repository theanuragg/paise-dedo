// Main Coin interface matching API data structure
export interface Coin {
  id: number;
  mint: string;
  name: string;
  symbol: string;
  description?: string | null;
  image_uri?: string;
  metadata_uri?: string;
  twitter?: string | null;
  telegram?: string | null;
  website?: string | null;
  bonding_curve: string;
  associated_bonding_curve?: string | null;
  creator: string;
  created_timestamp: number;
  raydium_pool?: string | null;
  complete: boolean;
  virtual_sol_reserves: number;
  virtual_token_reserves: number;
  hidden?: boolean | null;
  total_supply: number;
  show_name: boolean;
  last_trade_timestamp?: number | null;
  king_of_the_hill_timestamp?: number | null;
  market_cap?: number | null;
  nsfw: boolean;
  market_id?: string | null;
  reply_count: number;
  is_banned: boolean;
  is_currently_live: boolean;
  usd_market_cap?: number | null;
  created_at: string;
  updated_at: string;
  price_per_token?: number | null;
  bonding_curve_progress: string;
  bonding_curve_stats: {
    progress_percentage: number;
    sol_in_curve: number;
    graduation_target: number;
    is_graduated: boolean;
  };
}

// Legacy type alias for backward compatibility
export type IToken = Coin;

// Helper interface for UI display properties
export interface TokenDisplay extends Coin {
  // Computed properties for UI
  mcap?: number; // alias for market_cap
  volume?: number; // computed or fetched separately
  img_url?: string; // alias for image_uri
  createdAt?: string | number; // formatted created_at
  status?: string; // computed from complete status
  foundedBy?: string; // alias for creator
  percentChange?: number; // computed price change
  isGraduated?: boolean; // alias for complete
  graduationGoal?: number; // alias for graduation_target
}

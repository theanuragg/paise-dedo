export interface Pool {
  id: string;
  name: string;
  token0: {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
  };
  token1: {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
  };
  creator: string;
  totalValueLocked: number;
  volume24h: number;
  volume7d: number;
  fees24h: number;
  fees7d: number;
  feesTotal: number;
  feeRate: number;
  status: 'active' | 'paused' | 'closed' | 'migrated' | 'graduated';
  chain: string;
  participants: number;
  transactions24h: number;
  createdAt: Date;
  
  // Additional fields for compatibility
  publicKey: string;
  symbol: string;
  decimals?: number;
  feeClaimer?: string;
  creatorTradingFeePercentage?: number;
  tvl: number;
  volumeLifetime?: number;
  feesCollectedCreator?: number;
  feesCollectedPlatform?: number;
  pendingClaimableCreator?: number;
  pendingClaimablePlatform: number;
  liquidity?: number;
  migratedAt?: Date;
  lastTradeAt?: Date;
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
  totalSupply: number;
  decimals: number;
  logoUrl?: string;
  website?: string;
  description?: string;
  isVerified: boolean;
  isTrusted: boolean;
  hasWarning: boolean;
  priceUsd?: number;
  marketCap?: number;
  liquidity?: number;
  volume24h?: number;
}

export interface Claim {
  id: string;
  poolId: string;
  poolName: string;
  amount: number;
  claimedBy: string;
  claimedAt: Date;
  transactionId: string;
  type: 'creator' | 'platform';
  status: 'pending' | 'completed' | 'failed';
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  address?: string;
  role: 'super_admin' | 'pool_manager' | 'viewer' | 'admin' | 'finance' | 'support';
  status: 'active' | 'suspended' | 'pending';
  permissions: string[];
  lastLogin?: Date;
  createdAt: Date;
  lastActiveAt?: Date;
  isMultisig?: boolean;
  requiredSigners?: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  userAddress?: string;
  action: string;
  resource: string | null;
  resourceType?: 'pool' | 'claim' | 'user' | 'settings';
  resourceId?: string;
  details: Record<string, unknown>;
  oldValue?: unknown;
  newValue?: unknown;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface PlatformSettings {
  // Fee settings
  platformFeeRate: number;
  creatorFeeShare: number;
  platformFeeShare: number;
  autoClaimThreshold: number;
  autoClaimEnabled?: boolean;
  
  // Pool settings
  minimumPoolSize: number;
  maxPoolsPerCreator: number;
  allowNewPools: boolean;
  requireKYC: boolean;
  maxTransactionSize: number;
  
  // Platform controls
  maintenanceMode: boolean;
  supportedChains: string[];
  
  // Notifications
  enableNotifications: boolean;
  enableEmailAlerts: boolean;
  notificationEmail?: string;
  
  // Security & API
  sessionTimeout: number;
  apiRateLimit: number;
  webhookUrl?: string;
  
  // Legacy fields for backward compatibility
  feeClaimerAddress?: string;
  defaultCreatorFeePercentage?: number;
  minClaimAmount?: number;
  multiChainSettings?: {
    [chainId: string]: {
      enabled: boolean;
      rpcUrl: string;
      deployedContracts: string[];
    };
  };
}

export interface DashboardStats {
  totalTokens: number;
  totalVolume: number;
  totalTvl: number;
  totalFeesCollected: number;
  totalClaimableFees: number;
  tokensByStatus: {
    active: number;
    paused: number;
    migrated: number;
    graduated: number;
  };
  volumeTrends: {
    daily: Array<{ date: string; volume: number; fees: number }>;
    weekly: Array<{ date: string; volume: number; fees: number }>;
    monthly: Array<{ date: string; volume: number; fees: number }>;
  };
}

export interface Analytics {
  feeShareRatio: {
    creator: number;
    onlyFoundersTreasury: number;
    communityTreasury: number;
  };
  userEngagement: {
    activeCreators: number;
    claimingCreators: number;
    avgClaimFrequency: number;
  };
  chainMetrics: {
    [chainId: string]: {
      tokens: number;
      volume: number;
      fees: number;
      gasCosts: number;
    };
  };
}

export interface Transaction {
  id: string;
  poolId: string;
  type: 'swap' | 'add_liquidity' | 'remove_liquidity';
  user: string;
  amount0: number;
  amount1: number;
  fee: number;
  timestamp: Date;
  txHash: string;
}

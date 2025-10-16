export const environment = {
  // Solana Configuration
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,

  // Network Configuration
  network: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet',

  // DBC Configuration
  dbcPoolConfigKey: process.env.NEXT_PUBLIC_DBC_POOL_CONFIG_KEY,

  // Digital Ocean Spaces Storage Configuration (for frontend reference)
  doSpacesPublicUrl: process.env.NEXT_PUBLIC_DO_SPACES_PUBLIC_URL,

  // Feature Flags
  enableDBCLaunch: process.env.NEXT_PUBLIC_ENABLE_DBC_LAUNCH === 'true',
  enableTestnet: process.env.NEXT_PUBLIC_ENABLE_TESTNET === 'true',
};

import {
  DAMM_V2_MIGRATION_FEE_ADDRESS,
  deriveDammV2PoolAddress,
  DynamicBondingCurveClient,
} from '@meteora-ag/dynamic-bonding-curve-sdk';
import { Connection, PublicKey } from '@solana/web3.js';

export const getGraduationAddress = async ({
  connection,
  poolAddress,
  mintAddress,
}: {
  connection: Connection;
  poolAddress: PublicKey;
  mintAddress: PublicKey;
}) => {
  const client = new DynamicBondingCurveClient(connection, 'confirmed');
  const POOL_ADDRESS = new PublicKey(poolAddress);
  const poolState = await client.state.getPool(POOL_ADDRESS);
  poolState.migrationProgress
  if (!poolState) {
    console.error("Pool doesn't exist yet!");
  }

  const virtualPoolState = await client.state.getPool(POOL_ADDRESS);
  if (!virtualPoolState) {
    throw new Error('Pool not found');
  }

  const poolConfigState = await client.state.getPoolConfig(
    virtualPoolState.config
  );
  const dammV2PoolAddress = deriveDammV2PoolAddress(
    DAMM_V2_MIGRATION_FEE_ADDRESS[poolConfigState.migrationFeeOption],
    mintAddress,
    new PublicKey('So11111111111111111111111111111111111111112') // token program
  );
  console.log('Damm V2 Pool Address:', dammV2PoolAddress.toString());
  return dammV2PoolAddress;
  const dammV2PoolState = await client.state.getPool(dammV2PoolAddress);
  if (!dammV2PoolState) {
    console.error("Damm V2 Pool doesn't exist yet!");
  } else {
    console.log('Damm V2 Pool State:', dammV2PoolState);
  }
};

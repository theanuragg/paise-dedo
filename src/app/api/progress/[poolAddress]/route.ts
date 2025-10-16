import { NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';
import { DynamicBondingCurveClient } from '@meteora-ag/dynamic-bonding-curve-sdk';
import { BN } from 'bn.js';

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      poolAddress: string;
    }>;
  }
) {
  try {
    const param = await params;
    const poolAddress = new PublicKey(param.poolAddress);
    if (!process.env.NEXT_PUBLIC_RPC_URL) {
      return NextResponse.json(
        { error: 'RPC URL not configured' },
        { status: 500 }
      );
    }
    const connection = new Connection(
      process.env.NEXT_PUBLIC_RPC_URL!,
      'confirmed'
    );
    if (!connection) {
      return NextResponse.json(
        { error: 'Failed to create connection' },
        { status: 500 }
      );
    }
    const dbcClient = new DynamicBondingCurveClient(connection, 'confirmed');
    const poolState = await dbcClient.state.getPool(poolAddress);
    const progress = await dbcClient.state.getPoolCurveProgress(poolAddress);
  
    const poolConfigState = await dbcClient.state.getPoolConfig(
      poolState.config
    );
    const baseReserve = poolState.baseReserve.div(new BN(1e9)).toNumber();
    const totalSupply = poolConfigState.preMigrationTokenSupply.div(new BN(1e9)).toNumber();
    const tokensSold = totalSupply - baseReserve;
    const percentageSold = (tokensSold / totalSupply) * 100;
    return NextResponse.json({
      progress,
      baseReserve,
      percentageSold,
    });
  } catch (error) {
    console.log('Error in GET:', error);
    return NextResponse.json(
      { error: 'Failed to fetch graduation address' },
      { status: 500 }
    );
  }
}
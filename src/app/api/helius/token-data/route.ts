/**
 * Helius Token Data API
 *
 * Provides comprehensive token data using Helius indexing services
 */

import { NextResponse } from 'next/server';
import { initializeHelius, getHeliusInstance } from '@/lib/helius/indexing';

interface TokenDataRequest {
  mintAddress: string;
  includeTransactions?: boolean;
  includeBalances?: boolean;
  transactionLimit?: number;
}

interface TokenDataResponse {
  success: boolean;
  data?: {
    metadata: any;
    transactions?: any[];
    balances?: any[];
    comprehensive?: any;
  };
  error?: string;
}

export async function POST(req: Request) {
  try {
    const {
      mintAddress,
      includeTransactions = true,
      includeBalances = true,
      transactionLimit = 10,
    }: TokenDataRequest = await req.json();

    // Validate required fields
    if (!mintAddress) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: mintAddress',
        },
        { status: 400 }
      );
    }

    // Get Helius API key from environment
    const heliusApiKey = process.env.HELIUS_API_KEY;
    if (!heliusApiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Helius API key not configured',
        },
        { status: 500 }
      );
    }

    // Initialize Helius instance
    const helius = initializeHelius(heliusApiKey);

    console.log(`🔍 Fetching Helius data for token: ${mintAddress}`);

    // Fetch token metadata
    const metadata = await helius.tokens.getTokenMetadata(mintAddress);

    // If metadata not found, keep response success with minimal structure
    if (!metadata) {
      return NextResponse.json({
        success: true,
        data: {
          metadata: null,
        },
      });
    }

    const response: TokenDataResponse = {
      success: true,
      data: {
        metadata,
      },
    };

    // Fetch additional data based on request parameters
    if (includeTransactions) {
      console.log(
        `📊 Fetching transaction history (limit: ${transactionLimit})`
      );
      const transactions = await helius.transactions.getAddressHistory(
        mintAddress,
        transactionLimit
      );
      response.data!.transactions = transactions;
    }

    if (includeBalances) {
      console.log('💰 Fetching token balances');
      const balances = await helius.addresses.getTokenBalances(mintAddress);
      response.data!.balances = balances;
    }

    // Get comprehensive data if all options are enabled
    if (includeTransactions && includeBalances) {
      console.log('🎯 Fetching comprehensive token data');
      const comprehensive = await helius.getComprehensiveTokenData(mintAddress);
      response.data!.comprehensive = comprehensive;
    }

    console.log(`✅ Successfully fetched Helius data for ${mintAddress}`);

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Error fetching Helius token data:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      {
        success: false,
        error: `Failed to fetch token data: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}

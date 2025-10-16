/**
 * Helius Webhook Setup API
 *
 * Manages real-time webhook subscriptions using Helius indexing services
 */

import { NextRequest, NextResponse } from 'next/server';
import { initializeHelius } from '@/lib/helius/indexing';

interface WebhookSetupRequest {
  webhookUrl: string;
  transactionTypes: string[];
  accountFilters?: string[];
  accountExcludeFilters?: string[];
  webhookName?: string;
}

interface WebhookSetupResponse {
  success: boolean;
  data?: {
    webhookID: string;
    webhookUrl: string;
    status: string;
  };
  error?: string;
}

interface WebhookListResponse {
  success: boolean;
  data?: {
    webhooks: any[];
    total: number;
  };
  error?: string;
}

// Get Helius API key from environment
const heliusApiKey = process.env.HELIUS_API_KEY;

// Initialize Helius instance (only once if key is available)
let helius: any = null;
if (heliusApiKey) {
  helius = initializeHelius(heliusApiKey);
}

export async function GET(req: NextRequest) {
  if (!heliusApiKey || !helius) {
    return NextResponse.json(
      {
        success: false,
        error: 'Helius API key not configured or Helius client not initialized',
      },
      { status: 500 }
    );
  }

  try {
    console.log('📋 Fetching webhook list...');

    const webhooks = await helius.webhooks.getWebhooks();

    const response: WebhookListResponse = {
      success: true,
      data: {
        webhooks,
        total: webhooks.length,
      },
    };

    console.log(`✅ Found ${webhooks.length} webhooks`);
    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Error fetching webhooks:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      {
        success: false,
        error: `Failed to fetch webhooks: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!heliusApiKey || !helius) {
    return NextResponse.json(
      {
        success: false,
        error: 'Helius API key not configured or Helius client not initialized',
      },
      { status: 500 }
    );
  }

  try {
    const {
      webhookUrl,
      transactionTypes,
      accountFilters,
      accountExcludeFilters,
      webhookName,
    }: WebhookSetupRequest = await req.json();

    if (!webhookUrl || !transactionTypes || transactionTypes.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: webhookUrl and transactionTypes',
        },
        { status: 400 }
      );
    }

    console.log(`🔗 Setting up webhook: ${webhookName || 'Unnamed'}`);

    const webhookConfig = {
      webhookURL: webhookUrl,
      transactionTypes,
      accountIncludeFilters: accountFilters,
      accountExcludeFilters,
    };

    const result = await helius.webhooks.createWebhook(webhookConfig);

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create webhook',
        },
        { status: 500 }
      );
    }

    const response: WebhookSetupResponse = {
      success: true,
      data: {
        webhookID: result.webhookID,
        webhookUrl,
        status: 'active',
      },
    };

    console.log(`✅ Webhook created successfully: ${result.webhookID}`);
    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Error creating webhook:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      {
        success: false,
        error: `Failed to create webhook: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!heliusApiKey || !helius) {
    return NextResponse.json(
      {
        success: false,
        error: 'Helius API key not configured or Helius client not initialized',
      },
      { status: 500 }
    );
  }

  try {
    const { webhookID } = await req.json();

    if (!webhookID) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: webhookID',
        },
        { status: 400 }
      );
    }

    console.log(`🗑️ Deleting webhook: ${webhookID}`);

    const success = await helius.webhooks.deleteWebhook(webhookID);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to delete webhook',
        },
        { status: 500 }
      );
    }

    console.log(`✅ Webhook deleted successfully: ${webhookID}`);
    return NextResponse.json({
      success: true,
      data: {
        webhookID,
        webhookUrl: '',
        status: 'deleted',
      },
    });
  } catch (error) {
    console.error('❌ Error deleting webhook:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      {
        success: false,
        error: `Failed to delete webhook: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}

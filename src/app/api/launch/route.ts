import { NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';
import { DynamicBondingCurveClient } from '@meteora-ag/dynamic-bonding-curve-sdk';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL as string;
const POOL_CONFIG_KEY = process.env.POOL_CONFIG_KEY;

const DO_SPACES_ACCESS_KEY_ID = process.env.DO_SPACES_ACCESS_KEY_ID as string;
const DO_SPACES_SECRET_ACCESS_KEY = process.env
  .DO_SPACES_SECRET_ACCESS_KEY as string;
const DO_SPACES_ENDPOINT = process.env.DO_SPACES_ENDPOINT as string;
const DO_SPACES_BUCKET = process.env.DO_SPACES_BUCKET as string;
const DO_SPACES_PUBLIC_URL = process.env.DO_SPACES_PUBLIC_URL as string;

const s3Client = new S3Client({
  endpoint: DO_SPACES_ENDPOINT,
  region: 'auto',
  credentials: {
    accessKeyId: DO_SPACES_ACCESS_KEY_ID,
    secretAccessKey: DO_SPACES_SECRET_ACCESS_KEY,
  },
});

interface LaunchTokenRequest {
  tokenName: string;
  tokenTicker: string;
  tokenDescription?: string;
  tokenImage?: string; // Base64 encoded image
  initialSupply?: number; // Default 1B tokens
  initialMarketCap?: number; // Default $5K
  migrationMarketCap?: number; // Default $75K
  userWallet: string;
  network?: 'mainnet';
  quoteToken?: 'USDC' | 'SOL' | 'JUP';
}

interface LaunchTokenResponse {
  success: boolean;
  tokenMint?: string;
  poolAddress?: string;
  poolTx?: string;
  metadataUrl?: string;
  imageUrl?: string;
  message?: string;
  error?: string;
}

export async function POST(req: Request) {
  try {
    const {
      tokenName,
      tokenTicker,
      tokenDescription,
      tokenImage,
      initialSupply = 1000000000, // 1B tokens
      initialMarketCap = 5000, // $5K virtual curve baseline
      migrationMarketCap = 75000, // $75K
      userWallet,
      network = 'mainnet',
      quoteToken = 'USDC',
    } = (await req.json()) as LaunchTokenRequest;
    console.log(tokenName, tokenTicker, userWallet);
    // Validate required fields
    if (!tokenName || !tokenTicker || !userWallet) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: tokenName, tokenTicker, userWallet',
        },
        { status: 400 }
      );
    }

    console.log('🚀 Starting DBC token launch for:', {
      tokenName,
      tokenTicker,
      initialMarketCap,
      migrationMarketCap,
      network,
      quoteToken,
    });

    const connection = new Connection(RPC_URL, 'confirmed');
    const userPublicKey = new PublicKey(userWallet);

    // Step 1: Upload Metadata (if provided)
    let metadataUrl = '';
    let imageUrl = '';

    // Create dynamic name with timestamp and token name
    const timestamp = Date.now();
    const sanitizedTokenName = tokenName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const dynamicName = `${timestamp}-${sanitizedTokenName}`;

    if (tokenImage) {
      console.log('🖼️ Step 1: Uploading token image...');

      // Log environment variables for debugging
      console.log('🔍 Digital Ocean Spaces Environment Variables:');
      console.log(
        'DO_SPACES_ACCESS_KEY_ID:',
        DO_SPACES_ACCESS_KEY_ID
          ? `${DO_SPACES_ACCESS_KEY_ID.substring(0, 8)}...`
          : 'undefined'
      );
      console.log(
        'DO_SPACES_SECRET_ACCESS_KEY:',
        DO_SPACES_SECRET_ACCESS_KEY
          ? `${DO_SPACES_SECRET_ACCESS_KEY.substring(0, 8)}...`
          : 'undefined'
      );
      console.log('DO_SPACES_ENDPOINT:', DO_SPACES_ENDPOINT);
      console.log('DO_SPACES_BUCKET:', DO_SPACES_BUCKET);
      console.log('DO_SPACES_PUBLIC_URL:', DO_SPACES_PUBLIC_URL);

      const uploadedImageUrl = await uploadTokenImage(tokenImage, dynamicName);
      if (!uploadedImageUrl) {
        return NextResponse.json(
          {
            success: false,
            error: 'Failed to upload token image',
          },
          { status: 400 }
        );
      }
      imageUrl = uploadedImageUrl;
      console.log('✅ Token image uploaded:', imageUrl);
    }

    if (tokenName || tokenTicker || tokenDescription || imageUrl) {
      console.log('📝 Step 2: Uploading token metadata...');
      const uploadedMetadataUrl = await uploadTokenMetadata({
        tokenName,
        tokenTicker,
        tokenDescription,
        imageUrl,
        mint: dynamicName,
      
      });
      if (!uploadedMetadataUrl) {
        return NextResponse.json(
          {
            success: false,
            error: 'Failed to upload token metadata',
          },
          { status: 400 }
        );
      }
      metadataUrl = uploadedMetadataUrl;
      console.log('✅ Token metadata uploaded:', metadataUrl);
    }

    // Step 3: Create DBC Pool (DBC will create token mint automatically)
    console.log('🏊 Step 3: Creating DBC pool with token...');
    const dbcClient = new DynamicBondingCurveClient(connection, 'confirmed');

    // IMPORTANT: Generate the keypair in the DBC API, not in the frontend
    // This ensures the keypair is available for signing the transaction
    const { Keypair } = await import('@solana/web3.js');
    const generatedKeypair = Keypair.generate();
    const mintPublicKey = generatedKeypair.publicKey;

    console.log(
      '🔑 Generated new keypair for DBC pool creation:',
      mintPublicKey.toString()
    );
    console.log(
      '⚠️  This is the PREDICTED token mint address - the actual address may differ after transaction execution'
    );

    const poolTx = await dbcClient.pool.createPool({
      config: new PublicKey(POOL_CONFIG_KEY as string),
      baseMint: mintPublicKey, // Use the generated mint key
      name: tokenName,
      symbol: tokenTicker,
      uri: metadataUrl || '',
      payer: userPublicKey,
      poolCreator: userPublicKey,
    });

    // Prepare transaction
    const { blockhash } = await connection.getLatestBlockhash();
    poolTx.feePayer = userPublicKey;
    poolTx.recentBlockhash = blockhash;

    // Sign the transaction with the generated keypair first
    console.log('🔑 Signing transaction with generated keypair...');
    poolTx.sign(generatedKeypair);

    console.log('✅ DBC pool transaction created with token');

    // Step 4: Use the generated mint key and extract pool address
    console.log(
      '📍 Step 4: Using generated mint key and extracting pool address...'
    );
    const tokenMint = mintPublicKey.toString(); // Use the generated mint key

    let poolAddress = '';
    try {
      // Look for newly created accounts in the transaction
      const accountKeys = poolTx.instructions.flatMap(ix => ix.keys || []);
      const newAccounts = accountKeys.filter((key: any) => {
        // Look for new accounts created by the transaction
        return key && typeof key.pubkey === 'object' && key.isSigner === false;
      });

      if (newAccounts.length >= 1) {
        // First account is typically the pool
        poolAddress = newAccounts[0]?.pubkey?.toString() || 'TBD';
        console.log('✅ Pool address extracted:', poolAddress);
      } else {
        // Fallback: pool address will be available after transaction confirmation
        poolAddress = 'TBD';
        console.log(
          '⚠️ Pool address not found in transaction, will be available after confirmation'
        );
      }
    } catch (error) {
      console.warn('Failed to extract pool address from transaction:', error);
      poolAddress = 'TBD';
    }

    const response: LaunchTokenResponse = {
      success: true,
      tokenMint: tokenMint,
      poolAddress: poolAddress,
      poolTx: poolTx
        .serialize({
          requireAllSignatures: false,
          verifySignatures: false,
        })
        .toString('base64'),
      metadataUrl,
      imageUrl,
      message: `✅ DBC token launch ready! ${tokenName} (${tokenTicker}) will start with $${initialMarketCap.toLocaleString()} market cap and migrate at $${migrationMarketCap.toLocaleString()}. DBC will create the token mint automatically.`,
    };

    console.log('🎉 DBC token launch completed successfully!');
    console.log('📋 Launch Summary:', {
      tokenMint: tokenMint,
      poolAddress: poolAddress,
      initialMarketCap: `$${initialMarketCap.toLocaleString()}`,
      migrationMarketCap: `$${migrationMarketCap.toLocaleString()}`,
      totalSupply: `${(initialSupply / 1e9).toLocaleString()}B tokens`,
      network,
      quoteToken,
    });
    console.log(
      '🔍 IMPORTANT: The tokenMint above is PREDICTED - the actual mint address will be determined after transaction execution'
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('DBC token launch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Helper function to upload token image to Digital Ocean Spaces
async function uploadTokenImage(
  base64Image: string,
  mint: string
): Promise<string | false> {
  try {
    const matches = base64Image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      console.error('Invalid base64 format');
      return false;
    }

    const [, contentType, base64Data] = matches;
    if (!contentType || !base64Data) {
      console.error('Missing contentType or base64Data');
      return false;
    }

    const fileBuffer = Buffer.from(base64Data, 'base64');
    const fileName = `tokens/${mint}.${contentType.split('/')[1]}`;

    await uploadToSpaces(fileBuffer, contentType, fileName);
    console.log(
      '✅ Image uploaded to Digital Ocean Spaces:',
      `${DO_SPACES_PUBLIC_URL}/${fileName}`
    );
    return `${DO_SPACES_PUBLIC_URL}/${fileName}`;
  } catch (error) {
    console.error('Error uploading image:', error);
    return false;
  }
}

// Helper function to upload token metadata to Digital Ocean Spaces
async function uploadTokenMetadata(params: {
  tokenName: string;
  tokenTicker: string;
  tokenDescription?: string;
  imageUrl?: string;
  mint: string;
}): Promise<string | false> {
  try {
    const metadata = {
      name: params.tokenName,
      symbol: params.tokenTicker,
      description: params.tokenDescription || '',
      image: params.imageUrl || '',
      attributes: [
        {
          trait_type: 'Platform',
          value: 'OnlyFounder',
        },
        {
          trait_type: 'DEX',
          value: 'onlyfounders.fun',
        },

      ],
      "tags" : ["OnlyFounders.fun", "MEME", "#ONLY"],
    };

    const fileName = `metadata/${params.mint}.json`;

    console.log('📝 Uploading metadata to Digital Ocean Spaces...');
    console.log('📄 Metadata content:', JSON.stringify(metadata, null, 2));
    console.log('📂 File name:', fileName);
    console.log('🔗 Expected URL:', `${DO_SPACES_PUBLIC_URL}/${fileName}`);

    const uploadResult = await uploadToSpaces(
      Buffer.from(JSON.stringify(metadata, null, 2)),
      'application/json',
      fileName
    );

    console.log('✅ Digital Ocean Spaces upload result:', uploadResult);
    console.log(
      '🎯 Metadata should be accessible at:',
      `${DO_SPACES_PUBLIC_URL}/${fileName}`
    );

    return `${DO_SPACES_PUBLIC_URL}/${fileName}`;
  } catch (error) {
    console.error(
      '❌ Error uploading metadata to Digital Ocean Spaces:',
      error
    );
    console.error('📋 Upload details:', {
      fileName: `metadata/${params.mint}.json`,
      metadataSize: JSON.stringify(params).length,
      bucket: DO_SPACES_BUCKET,
      publicUrl: DO_SPACES_PUBLIC_URL,
    });
    return false;
  }
}

// Helper function to upload files to Digital Ocean Spaces
async function uploadToSpaces(
  fileBuffer: Buffer,
  contentType: string,
  fileName: string
) {
  return new Promise((resolve, reject) => {
    const command = new PutObjectCommand({
      Bucket: DO_SPACES_BUCKET!,
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType,
      ACL: 'public-read', // Make the file publicly readable
    });

    s3Client
      .send(command)
      .then(data => resolve(data))
      .catch(err => {
        console.error('Digital Ocean Spaces upload error:', err);
        reject(err);
      });
  });
}

// Increase body size limit for base64 images
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
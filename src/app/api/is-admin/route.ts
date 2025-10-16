import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

// Store admin keys in environment variables
const ADMIN_KEYS = {
  primary: process.env.PRIMARY_ADMIN_KEY || '',
  secondary: process.env.SECONDARY_ADMIN_KEY || ''
};

const TOKEN_EXPIRY = 5 * 60 * 1000; // 5 minutes in milliseconds

function generateAuthToken(publicKey: string): string {
  const timestamp = Date.now();
  const secret = process.env.AUTH_SECRET || 'fallback-secret';
  return createHash('sha256')
    .update(`${publicKey}:${timestamp}:${secret}`)
    .digest('hex');
}

function verifyAuthToken(token: string, publicKey: string): boolean {
  const currentTime = Date.now();
  // Check last 5 minutes of possible tokens
  for (let timestamp = currentTime; timestamp > currentTime - TOKEN_EXPIRY; timestamp -= 1000) {
    const expectedToken = createHash('sha256')
      .update(`${publicKey}:${timestamp}:${process.env.AUTH_SECRET}`)
      .digest('hex');
    if (token === expectedToken) return true;
  }
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const { publicKey, authToken } = await req.json();
    
    // First check if the public key is an admin key
    const isValidKey = publicKey === ADMIN_KEYS.primary || 
                      publicKey === ADMIN_KEYS.secondary;
    
    if (!isValidKey) {
      return NextResponse.json({ isAdmin: false });
    }

    // Then verify the auth token
    const isValidToken = verifyAuthToken(authToken, publicKey);
    
    if (!isValidToken) {
      return NextResponse.json({ isAdmin: false }, { status: 401 });
    }

    return NextResponse.json({ isAdmin: true });
  } catch (error) {
    return NextResponse.json({ isAdmin: false }, { status: 400 });
  }
}
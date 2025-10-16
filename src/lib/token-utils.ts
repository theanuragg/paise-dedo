import { Connection, PublicKey } from '@solana/web3.js';
import { getMint, getAccount } from '@solana/spl-token';

export interface TokenValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface TokenAcceptanceCheck {
  mintExists: boolean;
  correctDecimals: boolean;
  authorityStatus: 'burned' | 'transferred' | 'retained' | 'unknown';
  recipientBalanceIncreased: boolean;
  initialSupplyTx: string | null;
}

/**
 * Sanitize and validate string inputs
 */
function sanitizeString(input: string, maxLength: number = 100): string {
  if (!input || typeof input !== 'string') {
    throw new Error('Input must be a non-empty string');
  }

  // Remove potential XSS vectors
  const sanitized = input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .slice(0, maxLength); // Limit length

  if (sanitized.length === 0) {
    throw new Error('Input cannot be empty after sanitization');
  }

  return sanitized;
}

/**
 * Validate Solana address format
 */
function validateSolanaAddress(address: string): boolean {
  try {
    if (!address || typeof address !== 'string') {
      return false;
    }

    // Check length (Solana addresses are 32-44 characters)
    if (address.length < 32 || address.length > 44) {
      return false;
    }

    // Check if it's a valid PublicKey
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates token creation parameters with enhanced security
 */
export function validateTokenParams(params: {
  decimals: number;
  symbol: string;
  name: string;
  initialSupply: string;
  recipient?: string;
  mintAuthorityPolicy: {
    mode: 'burn' | 'transfer';
    to?: string;
  };
}): TokenValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Validate decimals with strict bounds
    if (
      !Number.isInteger(params.decimals) ||
      params.decimals < 0 ||
      params.decimals > 9
    ) {
      errors.push('Decimals must be an integer between 0 and 9');
    }

    // Sanitize and validate symbol
    try {
      const sanitizedSymbol = sanitizeString(params.symbol, 10);
      if (sanitizedSymbol.length === 0) {
        errors.push('Token symbol is required and cannot be empty');
      } else if (!/^[a-zA-Z0-9]+$/.test(sanitizedSymbol)) {
        errors.push('Token symbol must contain only alphanumeric characters');
      }
    } catch (error) {
      errors.push(
        `Symbol validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }

    // Sanitize and validate name
    try {
      const sanitizedName = sanitizeString(params.name, 32);
      if (sanitizedName.length === 0) {
        errors.push('Token name is required and cannot be empty');
      }
    } catch (error) {
      errors.push(
        `Name validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }

    // Validate initial supply with strict parsing
    try {
      if (!params.initialSupply || typeof params.initialSupply !== 'string') {
        errors.push('Initial supply must be a non-empty string');
      } else {
        const supply = BigInt(params.initialSupply);
        if (supply < 0n) {
          errors.push('Initial supply must be non-negative');
        }
        if (supply === 0n) {
          warnings.push(
            'Initial supply is 0 - no tokens will be minted initially'
          );
        }
        if (supply > BigInt(2 ** 64 - 1)) {
          errors.push('Initial supply exceeds maximum allowed value');
        }
      }
    } catch (error) {
      errors.push('Invalid initial supply format - must be a valid integer');
    }

    // Validate mint authority policy
    if (!['burn', 'transfer'].includes(params.mintAuthorityPolicy.mode)) {
      errors.push('Invalid mint authority policy mode');
    }

    if (params.mintAuthorityPolicy.mode === 'transfer') {
      if (!params.mintAuthorityPolicy.to) {
        errors.push('Transfer mode requires destination address');
      } else if (!validateSolanaAddress(params.mintAuthorityPolicy.to)) {
        errors.push('Invalid destination address for mint authority transfer');
      }
    }

    // Validate recipient address if provided
    if (params.recipient && !validateSolanaAddress(params.recipient)) {
      errors.push('Invalid recipient address format');
    }
  } catch (error) {
    errors.push(
      `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Performs acceptance checks on a created token with enhanced security
 */
export async function performTokenAcceptanceChecks(
  connection: Connection,
  mintAddress: string,
  expectedDecimals: number,
  initialSupply: string,
  recipientAddress?: string
): Promise<TokenAcceptanceCheck> {
  const result: TokenAcceptanceCheck = {
    mintExists: false,
    correctDecimals: false,
    authorityStatus: 'unknown',
    recipientBalanceIncreased: false,
    initialSupplyTx: null,
  };

  try {
    // Validate mint address
    if (!validateSolanaAddress(mintAddress)) {
      throw new Error('Invalid mint address format');
    }

    const mint = new PublicKey(mintAddress);

    // Check if mint exists
    const mintInfo = await getMint(connection, mint);
    result.mintExists = true;

    // Validate decimals
    if (
      typeof expectedDecimals !== 'number' ||
      !Number.isInteger(expectedDecimals)
    ) {
      throw new Error('Expected decimals must be a valid integer');
    }
    result.correctDecimals = mintInfo.decimals === expectedDecimals;

    // Check authority status
    if (mintInfo.mintAuthority === null) {
      result.authorityStatus = 'burned';
    } else {
      result.authorityStatus = 'retained';
    }

    // Check recipient balance if initial supply > 0 and recipient is provided
    if (BigInt(initialSupply) > 0n && recipientAddress) {
      if (!validateSolanaAddress(recipientAddress)) {
        throw new Error('Invalid recipient address format');
      }

      try {
        const recipient = new PublicKey(recipientAddress);
        const tokenAccount = await getAccount(connection, recipient);

        if (tokenAccount) {
          // Check if balance matches expected initial supply
          const balance = tokenAccount.amount;
          result.recipientBalanceIncreased = balance >= BigInt(initialSupply);
        }
      } catch (error) {
        // Token account might not exist yet
        result.recipientBalanceIncreased = false;
        console.warn('Could not verify recipient balance:', error);
      }
    }
  } catch (error) {
    console.error('Error performing acceptance checks:', error);
    throw new Error(
      `Token acceptance check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  return result;
}

/**
 * Formats token amount based on decimals with validation
 */
export function formatTokenAmount(
  amount: string | bigint,
  decimals: number
): string {
  try {
    // Validate inputs
    if (
      typeof decimals !== 'number' ||
      !Number.isInteger(decimals) ||
      decimals < 0 ||
      decimals > 9
    ) {
      throw new Error('Invalid decimals parameter');
    }

    const bigIntAmount = typeof amount === 'string' ? BigInt(amount) : amount;

    if (bigIntAmount < 0n) {
      throw new Error('Amount cannot be negative');
    }

    const divisor = BigInt(10 ** decimals);

    const whole = bigIntAmount / divisor;
    const fraction = bigIntAmount % divisor;

    if (fraction === 0n) {
      return whole.toString();
    }

    const fractionStr = fraction.toString().padStart(decimals, '0');
    return `${whole}.${fractionStr}`;
  } catch (error) {
    throw new Error(
      `Failed to format token amount: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Converts human-readable amount to base units with validation
 */
export function parseTokenAmount(amount: string, decimals: number): bigint {
  try {
    // Validate inputs
    if (!amount || typeof amount !== 'string') {
      throw new Error('Amount must be a non-empty string');
    }

    if (
      typeof decimals !== 'number' ||
      !Number.isInteger(decimals) ||
      decimals < 0 ||
      decimals > 9
    ) {
      throw new Error('Invalid decimals parameter');
    }

    // Sanitize input
    const sanitizedAmount = amount.trim();
    if (sanitizedAmount.length === 0) {
      throw new Error('Amount cannot be empty');
    }

    const [whole, fraction = ''] = sanitizedAmount.split('.');

    // Validate whole part
    if (whole && !/^\d+$/.test(whole)) {
      throw new Error('Invalid whole number format');
    }

    // Validate fraction part
    if (fraction && !/^\d+$/.test(fraction)) {
      throw new Error('Invalid fraction format');
    }

    const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);

    const wholePart = BigInt(whole || '0');
    const fractionPart = BigInt(paddedFraction || '0');

    const result = wholePart * BigInt(10 ** decimals) + fractionPart;

    // Check for overflow
    if (result > BigInt(2 ** 64 - 1)) {
      throw new Error('Amount exceeds maximum allowed value');
    }

    return result;
  } catch (error) {
    throw new Error(
      `Failed to parse token amount: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generates a token creation summary with sanitized output
 */
export function generateTokenSummary(params: {
  decimals: number;
  symbol: string;
  name: string;
  initialSupply: string;
  mintAuthorityPolicy: {
    mode: 'burn' | 'transfer';
    to?: string;
  };
}): string {
  try {
    // Validate inputs first
    const validation = validateTokenParams(params);
    if (!validation.isValid) {
      throw new Error(`Invalid parameters: ${validation.errors.join(', ')}`);
    }

    const formattedSupply = formatTokenAmount(
      params.initialSupply,
      params.decimals
    );
    const policyText =
      params.mintAuthorityPolicy.mode === 'burn'
        ? 'Mint authority will be burned (fixed supply)'
        : `Mint authority will be transferred to ${params.mintAuthorityPolicy.to}`;

    return `
Token Creation Summary:
- Name: ${params.name}
- Symbol: ${params.symbol}
- Decimals: ${params.decimals}
- Initial Supply: ${formattedSupply} ${params.symbol}
- Policy: ${policyText}
  `.trim();
  } catch (error) {
    throw new Error(
      `Failed to generate token summary: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names with Tailwind CSS conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  try {
    return twMerge(clsx(inputs));
  } catch (error) {
    console.warn('Error merging class names:', error);
    return inputs.filter(Boolean).join(' ');
  }
}

/**
 * Truncate string with ellipsis
 */
export function ellipsify(str = '', len = 4, delimiter = '..') {
  try {
    if (typeof str !== 'string') {
      str = String(str);
    }

    const strLen = str.length;
    const limit = len * 2 + delimiter.length;

    return strLen >= limit
      ? str.substring(0, len) + delimiter + str.substring(strLen - len, strLen)
      : str;
  } catch (error) {
    console.warn('Error ellipsifying string:', error);
    return str;
  }
}

/**
 * Format number with locale and options
 */
export function formatNumber(
  value: number,
  locale: string = 'en-US',
  options: Intl.NumberFormatOptions = {}
): string {
  try {
    if (typeof value !== 'number' || isNaN(value)) {
      return '0';
    }

    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      ...options,
    }).format(value);
  } catch (error) {
    console.warn('Error formatting number:', error);
    return value.toString();
  }
}

/**
 * Format currency with locale and options
 */
export function formatCurrency(
  value: number,
  currency: string = 'USD',
  locale: string = 'en-US',
  options: Intl.NumberFormatOptions = {}
): string {
  try {
    if (typeof value !== 'number' || isNaN(value)) {
      return '$0.00';
    }

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options,
    }).format(value);
  } catch (error) {
    console.warn('Error formatting currency:', error);
    return `$${value.toFixed(2)}`;
  }
}

/**
 * Debounce function execution
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function execution
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Generate random string
 */
export function generateRandomString(length: number = 8): string {
  try {
    if (typeof length !== 'number' || length < 1) {
      length = 8;
    }

    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
  } catch (error) {
    console.warn('Error generating random string:', error);
    return Math.random().toString(36).substring(2, 10);
  }
}

/**
 * Deep clone object (handles basic types)
 */
export function deepClone<T>(obj: T): T {
  try {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime()) as T;
    }

    if (obj instanceof Array) {
      return obj.map(item => deepClone(item)) as T;
    }

    if (typeof obj === 'object') {
      const cloned = {} as T;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloned[key] = deepClone(obj[key]);
        }
      }
      return cloned;
    }

    return obj;
  } catch (error) {
    console.warn('Error deep cloning object:', error);
    return obj;
  }
}

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 */
export function isEmpty(value: any): boolean {
  try {
    if (value === null || value === undefined) {
      return true;
    }

    if (typeof value === 'string') {
      return value.trim().length === 0;
    }

    if (Array.isArray(value)) {
      return value.length === 0;
    }

    if (typeof value === 'object') {
      return Object.keys(value).length === 0;
    }

    return false;
  } catch (error) {
    console.warn('Error checking if value is empty:', error);
    return true;
  }
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    if (typeof json !== 'string') {
      return fallback;
    }

    const parsed = JSON.parse(json);
    return parsed !== null ? parsed : fallback;
  } catch (error) {
    console.warn('Error parsing JSON:', error);
    return fallback;
  }
}

/**
 * Safe JSON stringify with fallback
 */
export function safeJsonStringify(value: any, fallback: string = ''): string {
  try {
    if (value === null || value === undefined) {
      return fallback;
    }

    return JSON.stringify(value);
  } catch (error) {
    console.warn('Error stringifying JSON:', error);
    return fallback;
  }
}

/**
 * Generate Solscan URL for token address
 */
export function getSolscanTokenUrl(
  tokenAddress: string,
  network: 'mainnet' | 'devnet' = 'devnet'
): string {
  try {
    if (!tokenAddress || typeof tokenAddress !== 'string') {
      throw new Error('Invalid token address');
    }

    const baseUrl = 'https://jup.ag';
    
    return `${baseUrl}/tokens/${tokenAddress}`;
  } catch (error) {
    console.warn('Error generating Solscan token URL:', error);
    return 'https://jup.ag';
  }
}

/**
 * Generate Solscan URL for transaction signature
 */
export function getSolscanTransactionUrl(
  signature: string,
  network: 'mainnet' | 'devnet' = 'devnet'
): string {
  try {
    if (!signature || typeof signature !== 'string') {
      throw new Error('Invalid transaction signature');
    }

    const baseUrl = 'https://solscan.io';
    const cluster = network === 'devnet' ? 'devnet' : 'devnet';
    
    return `${baseUrl}/tx/${signature}?cluster=${cluster}`;
  } catch (error) {
    console.warn('Error generating Solscan transaction URL:', error);
    return 'https://solscan.io';
  }
}

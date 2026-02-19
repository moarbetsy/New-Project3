/**
 * cyrb53 - A simple but high-quality 53-bit hash function
 * @param str - String to hash
 * @param seed - Optional seed value
 * @returns 53-bit hash as number
 */
export function cyrb53(str: string, seed: number = 0): number {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

/**
 * Generate a unique device fingerprint ID from multiple entropy sources
 * @param sources - Array of entropy sources (canvas, audio, gpu, etc.)
 * @returns Hexadecimal fingerprint ID
 */
export function generateFingerprintId(...sources: Array<string | number>): string {
  const combined = sources.join('-');
  return cyrb53(combined).toString(16).toUpperCase();
}

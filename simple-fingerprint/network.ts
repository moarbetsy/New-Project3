import axios from 'axios';
import { z } from 'zod';
import type { NetworkInfo } from './src/types';

// Zod schemas for API response validation
const IPWhoSchema = z.object({
  success: z.boolean().optional(),
  ip: z.string(),
  city: z.string(),
  region: z.string(),
  country: z.string(),
  connection: z.object({
    isp: z.string(),
  }),
});

const DBIPSchema = z.object({
  ipAddress: z.string(),
  city: z.string(),
  regionName: z.string(),
  countryName: z.string(),
  isp: z.string().optional(),
});

/**
 * API provider configuration
 */
interface APIProvider {
  url: string;
  type: 'json' | 'text';
  fields?: {
    ip: string;
    city: string;
    region: string;
    country: string;
    isp: string;
  };
  schema?: z.ZodSchema;
}

const providers: APIProvider[] = [
  {
    url: 'https://ipwho.is/',
    type: 'json',
    fields: {
      ip: 'ip',
      city: 'city',
      region: 'region',
      country: 'country',
      isp: 'connection.isp',
    },
    schema: IPWhoSchema,
  },
  {
    url: 'https://api.db-ip.com/v2/free/self',
    type: 'json',
    fields: {
      ip: 'ipAddress',
      city: 'city',
      region: 'regionName',
      country: 'countryName',
      isp: 'isp',
    },
    schema: DBIPSchema,
  },
  {
    url: 'https://www.cloudflare.com/cdn-cgi/trace',
    type: 'text',
  },
];

/**
 * Resolve nested object property by dot notation path
 * @param path - Dot notation path (e.g., "connection.isp")
 * @param obj - Object to traverse
 * @returns Resolved value or null
 */
function resolvePath(path: string, obj: any): string | null {
  return path.split('.').reduce((prev, curr) => {
    return prev?.[curr] ?? null;
  }, obj);
}

/**
 * Scan network information using multiple API providers with fallback
 * Tries multiple providers in sequence until one succeeds
 * @returns Promise resolving to NetworkInfo
 */
export async function scanNetwork(): Promise<NetworkInfo> {
  // Try each provider in sequence
  for (const provider of providers) {
    try {
      const response = await axios.get(provider.url, {
        timeout: 3000,
        headers: {
          'Accept': provider.type === 'json' ? 'application/json' : 'text/plain',
        },
      });

      if (provider.type === 'json') {
        const data = response.data;

        // Check for provider-specific error indicators
        if (provider.url.includes('ipwho') && data.success === false) {
          console.warn('IPWho API returned error:', data);
          continue;
        }

        // Validate response with Zod schema if available
        if (provider.schema) {
          const validationResult = provider.schema.safeParse(data);
          if (!validationResult.success) {
            console.warn('API response validation failed:', validationResult.error);
            continue;
          }
        }

        // Extract fields based on provider mapping
        if (!provider.fields) continue;

        return {
          ip: resolvePath(provider.fields.ip, data) || 'Unknown',
          city: resolvePath(provider.fields.city, data) || 'Unknown',
          region: resolvePath(provider.fields.region, data) || '',
          country: resolvePath(provider.fields.country, data) || 'Unknown',
          isp: resolvePath(provider.fields.isp, data) || 'Unknown',
          status: 'Verified',
          source: new URL(provider.url).hostname,
        };
      } else {
        // Text parsing for Cloudflare trace
        const text = response.data as string;
        const ipMatch = text.match(/ip=(.+)/);
        const locMatch = text.match(/loc=(.+)/);

        return {
          ip: ipMatch?.[1] || 'Unknown',
          city: 'Cloudflare Node',
          region: locMatch?.[1] || 'Unknown',
          country: locMatch?.[1] || 'Unknown',
          isp: 'Cloudflare',
          status: 'Partial (Fallback)',
          source: 'cloudflare.com',
        };
      }
    } catch (error) {
      console.warn(`Provider ${provider.url} failed:`, error);
      // Continue to next provider
    }
  }

  // If all providers fail, use timezone-based inference
  return getLocalFallback();
}

/**
 * Get network information from local browser data when all APIs fail
 * @returns NetworkInfo based on timezone and local data
 */
function getLocalFallback(): NetworkInfo {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const parts = timezone.split('/');

  return {
    ip: 'Blocked / Hidden',
    city: parts[1]?.replace('_', ' ') || 'Localhost',
    region: parts[0] || 'System',
    country: 'Unknown',
    isp: 'Firewall Detected',
    status: 'Restricted',
    source: 'Local Inference',
  };
}

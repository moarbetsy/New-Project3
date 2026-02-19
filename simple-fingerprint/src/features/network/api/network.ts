import axios from 'axios';
import { z } from 'zod';
import type { NetworkInfo } from '@/types';

// Zod schemas for API response validation
const IPApiSchema = z.object({
  status: z.string(),
  query: z.string().optional(),
  country: z.string().optional(),
  regionName: z.string().optional(),
  city: z.string().optional(),
  isp: z.string().optional(),
});

const IPWhoSchema = z.object({
  success: z.boolean().optional(),
  ip: z.string(),
  city: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  connection: z
    .object({
      isp: z.string().optional(),
    })
    .optional(),
});

const DBIPSchema = z.object({
  ipAddress: z.string().optional(),
  city: z.string().optional(),
  regionName: z.string().optional(),
  countryName: z.string().optional(),
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
    url: 'http://ip-api.com/json/?fields=status,query,country,regionName,city,isp',
    type: 'json',
    fields: {
      ip: 'query',
      city: 'city',
      region: 'regionName',
      country: 'country',
      isp: 'isp',
    },
    schema: IPApiSchema,
  },
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

const DEBUG_LOG = (payload: Record<string, unknown>) => {
  fetch('http://127.0.0.1:7243/ingest/ab3a6014-20e2-4cea-887a-6decfbf1c9cd', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, timestamp: Date.now() }),
  }).catch(() => {});
};

/**
 * Scan network information using multiple API providers with fallback
 * Tries multiple providers in sequence until one succeeds
 * @returns Promise resolving to NetworkInfo
 */
export async function scanNetwork(): Promise<NetworkInfo> {
  // Try each provider in sequence
  for (const provider of providers) {
    try {
      // #region agent log
      DEBUG_LOG({
        hypothesisId: 'H1',
        location: 'network.ts:scanNetwork',
        message: 'Provider attempt',
        data: { url: provider.url, type: provider.type },
      });
      // #endregion
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
          // #region agent log
          DEBUG_LOG({
            hypothesisId: 'H2',
            location: 'network.ts:ipwho-fail',
            message: 'IPWho success=false',
            data: { success: data.success },
          });
          // #endregion
          continue;
        }
        if (provider.url.includes('ip-api') && data.status === 'fail') {
          continue;
        }

        // Validate response with Zod schema if available
        if (provider.schema) {
          const validationResult = provider.schema.safeParse(data);
          if (!validationResult.success) {
            console.warn('API response validation failed:', validationResult.error);
            // #region agent log
            DEBUG_LOG({
              hypothesisId: 'H3',
              location: 'network.ts:schema-fail',
              message: 'Schema validation failed',
              data: {
                url: provider.url,
                errorMessage: validationResult.error.message,
                rawKeys: data ? Object.keys(data) : [],
              },
            });
            // #endregion
            continue;
          }
        }

        // Extract fields based on provider mapping
        if (!provider.fields) continue;

        const rawCity = resolvePath(provider.fields.city, data);
        const rawRegion = resolvePath(provider.fields.region, data);
        const rawCountry = resolvePath(provider.fields.country, data);
        const rawIsp = resolvePath(provider.fields.isp, data);
        const city = (typeof rawCity === 'string' && rawCity.trim()) ? rawCity.trim() : 'Unknown';
        const region = (typeof rawRegion === 'string' && rawRegion.trim()) ? rawRegion.trim() : '';
        const country = (typeof rawCountry === 'string' && rawCountry.trim()) ? rawCountry.trim() : 'Unknown';
        const isp = (typeof rawIsp === 'string' && rawIsp.trim()) ? rawIsp.trim() : 'Unknown';
        const allGeoEmpty = city === 'Unknown' && !region && country === 'Unknown' && isp === 'Unknown';
        if (allGeoEmpty) {
          continue;
        }
        // #region agent log
        DEBUG_LOG({
          hypothesisId: 'H4',
          location: 'network.ts:resolved',
          message: 'Resolved fields from provider',
          data: {
            url: provider.url,
            city,
            region,
            country,
            isp,
            hasConnection: !!data?.connection,
            countryType: typeof data?.country,
          },
        });
        // #endregion
        return {
          ip: resolvePath(provider.fields.ip, data) || 'Unknown',
          city,
          region,
          country,
          isp,
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
      // #region agent log
      DEBUG_LOG({
        hypothesisId: 'H5',
        location: 'network.ts:provider-error',
        message: 'Provider request failed',
        data: { url: provider.url, err: String(error) },
      });
      // #endregion
      // Continue to next provider
    }
  }

  // If all providers fail, use timezone-based inference
  const fallback = getLocalFallback();
  // #region agent log
  DEBUG_LOG({
    hypothesisId: 'H6',
    location: 'network.ts:fallback',
    message: 'Using local fallback',
    data: {
      city: fallback.city,
      region: fallback.region,
      country: fallback.country,
      isp: fallback.isp,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });
  // #endregion
  return fallback;
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

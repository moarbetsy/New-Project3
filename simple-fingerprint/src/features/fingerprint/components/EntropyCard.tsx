import {
  getPlatform,
  getTimezone,
  areCookiesEnabled,
} from '@/features/fingerprint/api/fingerprint';
import type { FingerprintData } from '@/types';

interface EntropyCardProps {
  data: FingerprintData | null;
  loading: boolean;
}

/**
 * EntropyCard component
 * Displays entropy sources used for fingerprinting
 */
export function EntropyCard({ data, loading }: EntropyCardProps) {
  if (loading) {
    return (
      <div className="text-base font-mono text-text">
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-base font-mono text-text">
        No entropy data available
      </div>
    );
  }

  return (
    <div className="space-y-1 text-base font-mono text-text">
      <div><span className="uppercase font-bold">Canvas</span> {data.canvasId}</div>
      <div><span className="uppercase font-bold">Audio</span> {data.audioId}</div>
      <div><span className="uppercase font-bold">Platform</span> {getPlatform()}</div>
      <div><span className="uppercase font-bold">Timezone</span> {getTimezone()}</div>
      <div><span className="uppercase font-bold">Cookies</span> {areCookiesEnabled() ? 'Yes' : 'No'}</div>
    </div>
  );
}

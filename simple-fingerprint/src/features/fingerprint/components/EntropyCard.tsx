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
    <div className="space-y-2 text-sm font-mono">
      <div>
        <span className="text-subtext">Canvas:</span> {data.canvasId}
      </div>
      <div>
        <span className="text-subtext">Audio:</span> {data.audioId}
      </div>
      <div>
        <span className="text-subtext">Platform:</span> {getPlatform()}
      </div>
      <div>
        <span className="text-subtext">Timezone:</span> {getTimezone()}
      </div>
      <div>
        <span className="text-subtext">Cookies:</span> {areCookiesEnabled() ? 'Yes' : 'No'}
      </div>
    </div>
  );
}

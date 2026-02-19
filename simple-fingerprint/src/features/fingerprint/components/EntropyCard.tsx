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

export function EntropyCard({ data, loading }: EntropyCardProps) {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No entropy data available</div>;
  }

  return (
    <div>
      <div><span>Canvas:</span> {data.canvasId}</div>
      <div><span>Audio:</span> {data.audioId}</div>
      <div><span>Platform:</span> {getPlatform()}</div>
      <div><span>Timezone:</span> {getTimezone()}</div>
      <div><span>Cookies:</span> {areCookiesEnabled() ? 'Yes' : 'No'}</div>
    </div>
  );
}

import { Card, Row, Skeleton } from '@/components/ui';
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
  return (
    <Card title="Entropy Sources">
      {loading ? (
        <Skeleton />
      ) : data ? (
        <>
          <Row label="Canvas Hash" value={data.canvasId} mono />
          <Row label="Audio Hash" value={data.audioId} mono />
          <Row label="Platform" value={getPlatform()} />
          <Row label="Timezone" value={getTimezone()} />
          <Row label="Cookies" value={areCookiesEnabled() ? 'Yes' : 'No'} />
        </>
      ) : (
        <div className="text-center text-subtext text-sm">
          No entropy data available
        </div>
      )}
    </Card>
  );
}

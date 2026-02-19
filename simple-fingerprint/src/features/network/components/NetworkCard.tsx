import { Network } from 'lucide-react';
import { Card, Row, Skeleton } from '@/components/ui';
import type { NetworkInfo } from '@/types';

interface NetworkCardProps {
  data: NetworkInfo | null;
  loading: boolean;
}

/**
 * NetworkCard component
 * Displays network intelligence information
 */
export function NetworkCard({ data, loading }: NetworkCardProps) {
  return (
    <Card
      title="Network Intelligence"
      icon={<Network className="w-6 h-6 text-violet-400" />}
      variant="primary"
    >
      {loading ? (
        <Skeleton />
      ) : data ? (
        <>
          <Row
            label="Public IP"
            value={data.ip}
            highlight
            blur={data.status === 'Restricted'}
          />
          <Row
            label="Location"
            value={[data.city, data.region].filter(Boolean).join(', ') || 'Unknown'}
          />
          <Row label="Country" value={data.country} />
          <Row label="ISP" value={data.isp} />
          <Row label="Source" value={data.source} small />
        </>
      ) : (
        <div className="text-center text-subtext text-sm">
          No network data available
        </div>
      )}
    </Card>
  );
}

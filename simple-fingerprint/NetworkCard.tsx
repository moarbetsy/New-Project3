import React from 'react';
import { Card, Row, Skeleton } from './src/components/ui';
import type { NetworkInfo } from './src/types';

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
    <Card title="Network Intelligence">
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
          <Row label="Location" value={`${data.city}, ${data.region}`} />
          <Row label="Country" value={data.country} />
          <Row label="ISP" value={data.isp} />
          <Row label="Source" value={data.source} small />

          {data.status === 'Restricted' && (
            <div
              className="mt-3 p-2 bg-warn/10 border border-warn/20 rounded text-xs text-warn text-center"
              role="alert"
            >
              ⚠ AdBlock/Firewall prevented remote lookup. Using local fallbacks.
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-subtext text-sm">
          No network data available
        </div>
      )}
    </Card>
  );
}

import React from 'react';
import { Card, Row, Skeleton } from './src/components/ui';
import {
  getScreenResolution,
  getPixelRatio,
} from './src/features/fingerprint/api/fingerprint';
import type { FingerprintData } from './src/types';

interface HardwareCardProps {
  data: FingerprintData | null;
  loading: boolean;
}

/**
 * HardwareCard component
 * Displays hardware signature information
 */
export function HardwareCard({ data, loading }: HardwareCardProps) {
  return (
    <Card title="Hardware Signature">
      {loading ? (
        <Skeleton />
      ) : data ? (
        <>
          <Row label="GPU Model" value={data.gpu} small />
          <Row label="CPU Threads" value={data.cores} />
          <Row
            label="Memory"
            value={typeof data.memory === 'number' ? `~${data.memory} GB` : data.memory}
          />
          <Row label="Screen" value={getScreenResolution()} />
          <Row label="PixelRatio" value={getPixelRatio()} />
        </>
      ) : (
        <div className="text-center text-subtext text-sm">
          No hardware data available
        </div>
      )}
    </Card>
  );
}

import { Cpu } from 'lucide-react';
import { Card, Row, Skeleton } from '@/components/ui';
import { getScreenResolution, getPixelRatio } from '@/features/fingerprint/api/fingerprint';
import type { FingerprintData } from '@/types';

interface HardwareCardProps {
  data: FingerprintData | null;
  loading: boolean;
}

/**
 * HardwareCard component
 * Displays hardware and device information from the fingerprint
 */
export function HardwareCard({ data, loading }: HardwareCardProps) {
  return (
    <Card
      title="Hardware"
      icon={<Cpu className="w-6 h-6 text-violet-400" />}
    >
      {loading ? (
        <Skeleton />
      ) : data ? (
        <>
          <Row label="GPU" value={data.gpu} />
          <Row label="Threads" value={data.cores} />
          <Row label="Memory" value={typeof data.memory === 'number' ? `~${data.memory} GB` : data.memory} />
          <Row label="Resolution" value={getScreenResolution()} />
          <Row label="Pixel Ratio" value={getPixelRatio()} small />
        </>
      ) : (
        <div className="text-center text-subtext text-sm">
          No hardware data available
        </div>
      )}
    </Card>
  );
}

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
  if (loading) {
    return (
      <div className="text-base text-text">
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-base text-text">
        No hardware data available
      </div>
    );
  }

  const memory = typeof data.memory === 'number' ? `~${data.memory} GB` : data.memory;
  const resolution = getScreenResolution();
  const pixelRatio = getPixelRatio();

  return (
    <div className="space-y-1 text-base text-text">
      <div><span className="uppercase font-bold">GPU</span> {data.gpu}</div>
      <div><span className="uppercase font-bold">Threads</span> {data.cores}</div>
      <div><span className="uppercase font-bold">Memory</span> {memory}</div>
      <div><span className="uppercase font-bold">Resolution</span> {resolution.replace('x', '×')}</div>
      <div><span className="uppercase font-bold">Pixel Ratio</span> {pixelRatio}</div>
    </div>
  );
}

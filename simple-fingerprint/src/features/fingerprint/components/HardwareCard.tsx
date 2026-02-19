import { getScreenResolution, getPixelRatio } from '@/features/fingerprint/api/fingerprint';
import type { FingerprintData } from '@/types';

interface HardwareCardProps {
  data: FingerprintData | null;
  loading: boolean;
}

export function HardwareCard({ data, loading }: HardwareCardProps) {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No hardware data available</div>;
  }

  const memory = typeof data.memory === 'number' ? `~${data.memory} GB` : data.memory;
  const resolution = getScreenResolution();
  const pixelRatio = getPixelRatio();

  return (
    <div>
      <div><span>GPU:</span> {data.gpu}</div>
      <div><span>Threads:</span> {data.cores}</div>
      <div><span>Memory:</span> {memory}</div>
      <div><span>Resolution:</span> {resolution.replace('x', '×')}</div>
      <div><span>Pixel Ratio:</span> {pixelRatio}</div>
    </div>
  );
}

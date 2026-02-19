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
        No network data available
      </div>
    );
  }

  const location = [data.city, data.region].filter(Boolean).join(', ') || 'Unknown';

  return (
    <div className="space-y-1 text-base text-text">
      <div><span className="uppercase font-bold">IP</span> {data.ip}</div>
      <div><span className="uppercase font-bold">Location</span> {location}</div>
      <div><span className="uppercase font-bold">Country</span> {data.country}</div>
      <div><span className="uppercase font-bold">ISP</span> {data.isp}</div>
    </div>
  );
}

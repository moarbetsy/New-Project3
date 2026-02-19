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
    <div className="space-y-2 text-sm">
      <div>
        <span className="text-subtext">Public IP:</span>{' '}
        <span className="text-primary">{data.ip}</span>
      </div>
      <div>
        <span className="text-subtext">Location:</span> {location}
      </div>
      <div>
        <span className="text-subtext">Country:</span> {data.country}
      </div>
      <div>
        <span className="text-subtext">ISP:</span> {data.isp}
      </div>
      {data.source && (
        <div>
          <span className="text-subtext">Source:</span> {data.source}
        </div>
      )}
    </div>
  );
}

import type { NetworkInfo } from '@/types';

interface NetworkCardProps {
  data: NetworkInfo | null;
  loading: boolean;
}

export function NetworkCard({ data, loading }: NetworkCardProps) {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No network data available</div>;
  }

  const location = [data.city, data.region].filter(Boolean).join(', ') || 'Unknown';

  return (
    <div>
      <div><span>Public IP:</span> {data.ip}</div>
      <div><span>Location:</span> {location}</div>
      <div><span>Country:</span> {data.country}</div>
      <div><span>ISP:</span> {data.isp}</div>
    </div>
  );
}

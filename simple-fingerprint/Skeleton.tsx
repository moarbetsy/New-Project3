/**
 * Skeleton component
 * Loading placeholder animation
 */
export function Skeleton() {
  return (
    <div className="space-y-3 animate-pulse" role="status" aria-label="Loading">
      <div className="h-4 bg-border/50 rounded w-full" />
      <div className="h-4 bg-border/50 rounded w-3/4" />
      <div className="h-4 bg-border/50 rounded w-5/6" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

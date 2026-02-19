/**
 * Skeleton component
 * Loading placeholder animation
 */
export function Skeleton() {
  return (
    <div className="space-y-3 animate-pulse flex flex-col items-center" role="status" aria-label="Loading">
      <div className="h-4 bg-border/50 rounded w-3/4 max-w-[200px]" />
      <div className="h-4 bg-border/50 rounded w-2/3 max-w-[160px]" />
      <div className="h-4 bg-border/50 rounded w-5/6 max-w-[180px]" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

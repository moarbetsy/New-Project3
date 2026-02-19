import type { BoxProps } from '@/types';

/**
 * Box component
 * Displays a label-value pair, optionally with custom color
 */
export function Box({ label, value, color }: BoxProps) {
  return (
    <div className="flex flex-col items-center gap-0.5 min-w-0">
      <span className="text-xs text-subtext font-medium">{label}</span>
      <span className={color ?? 'text-white'}>{String(value)}</span>
    </div>
  );
}

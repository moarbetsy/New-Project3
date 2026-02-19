import { clsx } from 'clsx';
import type { RowProps } from '@/types';

/**
 * Row component
 * Displays a label-value pair in a horizontal layout
 */
export function Row({
  label,
  value,
  highlight = false,
  mono = false,
  small = false,
  blur = false,
}: RowProps) {
  return (
    <div className="flex flex-col items-center text-center gap-0.5 min-w-0 w-full">
      <span className="text-sm text-subtext font-medium">{label}</span>
      <span
        className={clsx(
          'font-medium transition-all min-w-0 break-all',
          {
            'font-mono text-xs': mono,
            'text-sm': !mono,
            'text-primary': highlight,
            'text-text': !highlight,
            'text-xs max-w-[180px]': small,
            'blur-[2px] hover:blur-0 cursor-help': blur,
          }
        )}
        title={blur ? 'Hover to reveal' : typeof value === 'string' ? value : undefined}
      >
        {value}
      </span>
    </div>
  );
}

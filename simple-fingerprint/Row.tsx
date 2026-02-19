import React from 'react';
import { clsx } from 'clsx';
import type { RowProps } from './src/types';

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
    <div className="flex justify-between items-start gap-4">
      <span className="text-sm text-subtext font-medium">{label}</span>
      <span
        className={clsx(
          'text-right font-medium transition-all',
          {
            'font-mono text-xs': mono,
            'text-sm': !mono,
            'text-accent': highlight,
            'text-text': !highlight,
            'text-xs max-w-[160px] truncate': small,
            'blur-[2px] hover:blur-0 cursor-help': blur,
          }
        )}
        title={blur ? 'Hover to reveal' : undefined}
      >
        {value}
      </span>
    </div>
  );
}

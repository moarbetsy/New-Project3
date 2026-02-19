import React from 'react';
import { clsx } from 'clsx';
import type { StatusBadgeProps } from './src/types';

/**
 * StatusBadge component
 * Displays a status indicator with label and animated dot
 */
export function StatusBadge({ label, active = false, warning = false }: StatusBadgeProps) {
  return (
    <div
      className={clsx(
        'px-3 py-1 rounded border text-xs font-bold flex items-center gap-2',
        {
          'bg-warn/10 border-warn/30 text-warn': warning,
          'bg-success/10 border-success/30 text-success': active && !warning,
          'bg-card border-border text-subtext': !active && !warning,
        }
      )}
      role="status"
      aria-label={`${label} status: ${warning ? 'warning' : active ? 'active' : 'inactive'}`}
    >
      <div
        className={clsx('w-1.5 h-1.5 rounded-full animate-pulse', {
          'bg-warn': warning,
          'bg-success': active && !warning,
          'bg-subtext': !active && !warning,
        })}
        aria-hidden="true"
      />
      {label}
    </div>
  );
}

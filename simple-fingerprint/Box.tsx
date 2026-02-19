import React from 'react';
import type { BoxProps } from './src/types';

/**
 * Box component
 * Displays a labeled value in a bordered container
 */
export function Box({ label, value, color = 'text-white' }: BoxProps) {
  return (
    <div className="bg-bg border border-border p-3 rounded text-center min-w-[100px]">
      <div className="text-[10px] text-subtext font-bold uppercase mb-1">
        {label}
      </div>
      <div className={`text-lg font-bold ${color}`}>{value}</div>
    </div>
  );
}

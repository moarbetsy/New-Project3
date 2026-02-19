import React from 'react';
import type { CardProps } from './src/types';

/**
 * Card component
 * Container for grouped information with title and optional icon
 */
export function Card({ title, children }: CardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:border-accent/30 transition-colors h-full">
      <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
        <span className="text-accent" aria-hidden="true">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </span>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

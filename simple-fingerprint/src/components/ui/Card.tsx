import { Info } from 'lucide-react';
import type { CardProps } from '@/types';

/**
 * Card component
 * Container for grouped information with title and semantic icon.
 * Use variant="primary" for the main card in the layout.
 * Icons should be semantic (e.g. Network, Cpu, Fingerprint) with per-card accent classes.
 */
export function Card({ title, icon, variant = 'default', children }: CardProps) {
  const isPrimary = variant === 'primary';
  return (
    <div
      className={
        'group rounded-xl p-5 sm:p-6 shadow-sm transition-all duration-200 h-full flex flex-col min-h-[200px] ' +
        'hover:-translate-y-0.5 hover:shadow-lg ' +
        (isPrimary
          ? 'bg-card-primary shadow-glow-card'
          : 'bg-card')
      }
    >
      <div className="flex items-center justify-center gap-2 pb-3 mb-6 flex-shrink-0">
        <span
          className="inline-flex transition-transform duration-200 group-hover:scale-110"
          aria-hidden="true"
        >
          {icon ?? <Info className="w-5 h-5 text-subtext" />}
        </span>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="space-y-5 flex-1 min-h-0 flex flex-col items-center text-center">{children}</div>
    </div>
  );
}

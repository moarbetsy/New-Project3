/**
 * Global TypeScript type definitions for the Precision Scanner application
 */

import type { ReactNode } from 'react';

// Network Intelligence Types
export interface NetworkInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  isp: string;
  status: 'Verified' | 'Partial (Fallback)' | 'Restricted';
  source: string;
}

// Fingerprint Types
export interface FingerprintData {
  visitorId: string;
  canvasId: string | number;
  audioId: string | number;
  gpu: string;
  cores: number | string;
  memory: number | string;
  confidence: number;
  isBotDetected: boolean;
}

// Combined Application State
export interface AppState {
  network: NetworkInfo | null;
  fingerprint: FingerprintData | null;
  loading: boolean;
  error: string | null;
}

// API Response Types
export interface IPWhoResponse {
  success: boolean;
  ip: string;
  city: string;
  region: string;
  country: string;
  connection: {
    isp: string;
  };
}

export interface DBIPResponse {
  ipAddress: string;
  city: string;
  regionName: string;
  countryName: string;
  isp: string;
}

// Component Props Types
export interface StatusBadgeProps {
  label: string;
  active?: boolean;
  warning?: boolean;
}

export interface BoxProps {
  label: string;
  value: string | number;
  color?: string;
}

export interface CardProps {
  title: string;
  /** Semantic icon (ReactNode) for the card header, e.g. globe for network, chip for hardware */
  icon?: ReactNode;
  /** Visual hierarchy: 'primary' stands out, default is support/secondary */
  variant?: 'primary' | 'default';
  children: ReactNode;
}

export interface RowProps {
  label: string;
  value: string | number;
  highlight?: boolean;
  mono?: boolean;
  small?: boolean;
  blur?: boolean;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  status: LoadingState;
  error: string | null;
}

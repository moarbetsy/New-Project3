import { useCallback } from 'react';
import { useInitialize } from '@/hooks/useInitialize';
import { useAppStore } from './store';
import { NetworkCard } from '@/features/network/components/NetworkCard';
import { HardwareCard } from '@/features/fingerprint/components/HardwareCard';
import { EntropyCard } from '@/features/fingerprint/components/EntropyCard';

/**
 * Main App component
 * Root component for the Precision Scanner application
 */
export function App() {
  const { network, fingerprint, loading, error, initializeScan } = useAppStore();

  const initialize = useCallback(() => {
    initializeScan();
  }, [initializeScan]);

  useInitialize(initialize);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 space-y-1">
      {/* Error banner with retry */}
      {error && (
        <section
          className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 text-center"
          role="alert"
          aria-live="assertive"
        >
          <p className="text-danger font-medium text-sm sm:text-base">{error}</p>
          <button
            type="button"
            onClick={() => initializeScan()}
            className="flex-shrink-0 px-4 py-2 rounded-lg bg-danger/20 border border-danger/40 text-danger font-semibold text-sm hover:bg-danger/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Retry scan
          </button>
        </section>
      )}

      {/* Device Fingerprint */}
      <div className="text-base text-text">
        <span className="uppercase font-bold">Device Fingerprint</span> <span className="font-mono">{loading ? 'CALCULATING...' : fingerprint?.visitorId || 'N/A'}</span>
      </div>

      {/* HASH */}
      <div className="text-base font-mono break-all">
        <span className="uppercase font-bold">HASH</span> {fingerprint
          ? `${fingerprint.canvasId}.${fingerprint.audioId}`
          : loading ? '...' : 'N/A'}
      </div>

      {/* Confidence */}
      <div className="text-base text-text">
        <span className="uppercase font-bold">Confidence</span> 99.9%
      </div>

      {/* Bot Check */}
      {!loading && fingerprint && (
        <div className={`text-base ${fingerprint.isBotDetected ? 'text-danger' : 'text-success'}`}>
          <span className="uppercase font-bold">Bot Check</span> <span className="font-bold">{fingerprint.isBotDetected ? 'FAILED' : 'PASSED'}</span>
        </div>
      )}

      {/* Spacing after 4 items */}
      <div className="h-8" />

      {/* Network Information */}
      <NetworkCard data={network} loading={loading} />

      {/* Spacing after 4 items */}
      <div className="h-8" />

      {/* Hardware Information */}
      <HardwareCard data={fingerprint} loading={loading} />

      {/* Spacing after 4 items */}
      <div className="h-8" />

      {/* Entropy Information */}
      <EntropyCard data={fingerprint} loading={loading} />
    </main>
  );
}

import { useCallback } from 'react';
import { useInitialize } from '@/hooks/useInitialize';
import { useAppStore } from './store';
import { Box } from '@/components/ui';
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
    <div className="min-h-screen bg-canvas font-sans text-text flex flex-col items-center justify-center px-4 py-8 sm:px-6 md:py-12 lg:px-8">
      <div className="w-full max-w-6xl flex flex-col items-center gap-16 sm:gap-20">
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
        {/* Header */}
        <header className="text-center mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Device Fingerprint
          </h1>
        </header>

        {/* Hero: Device ID */}
        <section
          className="bg-card rounded-2xl px-6 py-10 sm:p-10 md:py-12 md:px-12"
          aria-labelledby="device-id-heading"
        >
          <div className="flex flex-col lg:flex-row lg:justify-center lg:items-center gap-10">
            <div className="min-w-0 text-center flex flex-col gap-6">
              <div>
                <div
                  className="text-primary text-xs font-bold uppercase tracking-widest mb-2"
                  id="device-id-heading"
                >
                  Unique Device ID
                </div>
                <div
                  className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-mono font-bold text-white tracking-tighter break-all"
                  title={fingerprint?.visitorId}
                >
                  {loading ? 'CALCULATING...' : fingerprint?.visitorId || 'N/A'}
                </div>
              </div>
              <div className="text-subtext text-xs font-mono break-all">
                HASH:{' '}
                {fingerprint
                  ? `${fingerprint.canvasId}.${fingerprint.audioId}`
                  : '...'}
              </div>
            </div>
            {!loading && fingerprint && (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 flex-shrink-0 justify-items-center lg:mt-0">
                <Box label="Confidence" value="99.9%" />
                <Box
                  label="Bot Check"
                  value={fingerprint.isBotDetected ? 'FAILED' : 'PASSED'}
                  color={fingerprint.isBotDetected ? 'text-danger' : 'text-success'}
                />
              </div>
            )}
          </div>
        </section>

        {/* Cards: responsive grid with clear hierarchy */}
        <main className="flex flex-wrap justify-center gap-12 lg:gap-16 w-full">
          <div className="w-full max-w-sm md:max-w-[360px]">
            <NetworkCard data={network} loading={loading} />
          </div>
          <div className="w-full max-w-sm md:max-w-[360px]">
            <HardwareCard data={fingerprint} loading={loading} />
          </div>
          <div className="w-full max-w-sm md:max-w-[360px]">
            <EntropyCard data={fingerprint} loading={loading} />
          </div>
        </main>

      </div>
    </div>
  );
}

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

   const deviceId = loading ? 'CALCULATING...' : fingerprint?.visitorId || 'N/A';
   const hash = fingerprint
     ? `${fingerprint.canvasId}.${fingerprint.audioId}`
     : loading
       ? '...'
       : 'N/A';
   const isBotDetected = fingerprint?.isBotDetected;
   const botText = isBotDetected ? 'FAILED' : 'PASSED';
   const botClassName = isBotDetected ? 'text-danger' : 'text-success';

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 space-y-16">
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
      <header className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Device Fingerprint
        </h1>
      </header>

      {/* Device ID */}
      <section className="bg-card rounded-2xl p-8 md:p-12 text-center space-y-6">
        <div>
          <div className="text-primary text-xs font-bold uppercase tracking-widest">
            Unique Device ID
          </div>
          <div className="font-mono font-bold text-3xl sm:text-4xl md:text-5xl break-all">
            {deviceId}
          </div>
        </div>

        <div className="text-subtext text-xs font-mono break-all">
          <span className="mr-1">HASH:</span>
          {hash}
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          <div className="bg-bg/80 p-4 rounded-xl">
            <div className="text-[10px] uppercase text-subtext">Confidence</div>
            <div className="font-bold text-white">99.9%</div>
          </div>
          <div className="bg-bg/80 p-4 rounded-xl">
            <div className="text-[10px] uppercase text-subtext">Bot Check</div>
            <div className={`font-bold ${botClassName}`}>
              {loading || !fingerprint ? '...' : botText}
            </div>
          </div>
        </div>
      </section>

      {/* Data Cards */}
      <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {/* Network */}
        <div className="bg-card rounded-xl p-6 text-center space-y-5 hover:-translate-y-1 transition">
          <h3 className="uppercase text-sm tracking-wider font-bold">Network Intelligence</h3>
          <NetworkCard data={network} loading={loading} />
        </div>

        {/* Hardware */}
        <div className="bg-card rounded-xl p-6 text-center space-y-5 hover:-translate-y-1 transition">
          <h3 className="uppercase text-sm tracking-wider font-bold">Hardware Signature</h3>
          <HardwareCard data={fingerprint} loading={loading} />
        </div>

        {/* Entropy */}
        <div className="bg-card rounded-xl p-6 text-center space-y-5 hover:-translate-y-1 transition">
          <h3 className="uppercase text-sm tracking-wider font-bold">Entropy Sources</h3>
          <EntropyCard data={fingerprint} loading={loading} />
        </div>
      </section>
    </main>
  );
}

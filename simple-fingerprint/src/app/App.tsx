import { useCallback } from 'react';
import { useInitialize } from '@/hooks/useInitialize';
import { useAppStore } from './store';
import { NetworkCard } from '@/features/network/components/NetworkCard';
import { HardwareCard } from '@/features/fingerprint/components/HardwareCard';
import { EntropyCard } from '@/features/fingerprint/components/EntropyCard';

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
  const botLabel = loading || !fingerprint ? '...' : isBotDetected ? 'True' : 'False';

  return (
    <main>
      {error && (
        <section role="alert" aria-live="assertive">
          <p>{error}</p>
          <button type="button" onClick={() => initializeScan()}>
            Retry scan
          </button>
        </section>
      )}

      <header>
        <h1>Device Fingerprint</h1>
      </header>

      <section>
        <div>Unique ID: {deviceId}</div>

        <div>Hash: {hash}</div>

        <div>Bot: {botLabel}</div>
      </section>

      <section>
        <div>
          <h3>Network Intelligence</h3>
          <NetworkCard data={network} loading={loading} />
        </div>

        <div>
          <h3>Hardware Signature</h3>
          <HardwareCard data={fingerprint} loading={loading} />
        </div>

        <div>
          <h3>Entropy Sources</h3>
          <EntropyCard data={fingerprint} loading={loading} />
        </div>
      </section>
    </main>
  );
}

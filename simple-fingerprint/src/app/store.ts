import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { env } from '@/lib/env';
import type { AppState, FingerprintData } from '@/types';
import { scanNetwork } from '@/features/network/api/network';
import {
  getCanvasHash,
  getAudioHash,
  getGPU,
  getCPUCores,
  getDeviceMemory,
  isBotDetected,
} from '@/features/fingerprint/api/fingerprint';
import { generateFingerprintId } from '@/utils/hash';

interface AppStore extends AppState {
  // Actions
  initializeScan: () => Promise<void>;
  reset: () => void;
}

const initialState: AppState = {
  network: null,
  fingerprint: null,
  loading: true,
  error: null,
};

/**
 * Global application store using Zustand
 * Manages network information and fingerprint data
 */
export const useAppStore = create<AppStore>()(
  devtools(
    (set) => ({
      ...initialState,

      /**
       * Initialize the scanning process
       * Fetches network information and generates device fingerprint
       */
      initializeScan: async () => {
        set({ loading: true, error: null });

        try {
          // Fetch network information and audio hash in parallel
          const [networkInfo, audioId] = await Promise.all([
            scanNetwork(),
            getAudioHash(),
          ]);

          // Get synchronous fingerprint data
          const canvasId = getCanvasHash();
          const gpu = getGPU();
          const cores = getCPUCores();
          const memory = getDeviceMemory();
          const botDetected = isBotDetected();

          // Generate unique visitor ID from all entropy sources
          const visitorId = generateFingerprintId(
            canvasId,
            audioId,
            gpu,
            cores,
            memory
          );

          const fingerprintData: FingerprintData = {
            visitorId,
            canvasId,
            audioId,
            gpu,
            cores,
            memory,
            confidence: 99.9,
            isBotDetected: botDetected,
          };

          set({
            network: networkInfo,
            fingerprint: fingerprintData,
            loading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          
          set({
            loading: false,
            error: errorMessage,
          });

          console.error('Scan initialization failed:', error);
        }
      },

      /**
       * Reset the store to initial state
       */
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'precision-scanner-store',
      enabled: env.enableDevTools,
    }
  )
);

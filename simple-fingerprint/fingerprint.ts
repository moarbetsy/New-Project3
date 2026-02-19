import { cyrb53 } from './src/utils/hash';

/**
 * Generate a canvas fingerprint hash
 * Uses canvas rendering to create a unique identifier based on GPU/driver characteristics
 * @returns Canvas hash or "Blocked" if unavailable
 */
export function getCanvasHash(): string | number {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return 'Blocked';
    
    canvas.width = 200;
    canvas.height = 50;
    
    // Draw complex shapes and text to maximize entropy
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.font = '11pt no-real-font-123';
    ctx.fillText('Cwm fjordbank glyphs vext quiz, 😃', 2, 15);
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgb(255,0,255)';
    ctx.beginPath();
    ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    
    return cyrb53(canvas.toDataURL());
  } catch (error) {
    console.warn('Canvas fingerprinting blocked:', error);
    return 'Blocked';
  }
}

/**
 * Generate an audio context fingerprint hash
 * Uses Web Audio API to create a unique identifier based on audio processing characteristics
 * @returns Promise resolving to audio hash or "Blocked"/"N/A"
 */
export async function getAudioHash(): Promise<string | number> {
  try {
    const AudioContext = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
    
    if (!AudioContext) return 'N/A';
    
    const context = new AudioContext(1, 44100, 44100);
    const oscillator = context.createOscillator();
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(1000, context.currentTime);
    
    const compressor = context.createDynamicsCompressor();
    oscillator.connect(compressor);
    compressor.connect(context.destination);
    oscillator.start(0);
    
    const buffer = await context.startRendering();
    let sum = 0;
    
    for (let i = 0; i < buffer.length; i++) {
      sum += Math.abs(buffer.getChannelData(0)[i] ?? 0);
    }
    
    return cyrb53(sum.toString());
  } catch (error) {
    console.warn('Audio fingerprinting blocked:', error);
    return 'Blocked';
  }
}

/**
 * Get GPU renderer information
 * @returns GPU model string or fallback message
 */
export function getGPU(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return 'Generic / Virtual';
    
    const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
    
    if (debugInfo) {
      const renderer = (gl as WebGLRenderingContext).getParameter(
        debugInfo.UNMASKED_RENDERER_WEBGL
      );
      return renderer || 'Generic / Virtual';
    }
    
    return 'Generic / Virtual';
  } catch (error) {
    console.warn('GPU detection blocked:', error);
    return 'Blocked';
  }
}

/**
 * Get hardware concurrency (CPU thread count)
 * @returns Number of logical processors or "N/A"
 */
export function getCPUCores(): number | string {
  return navigator.hardwareConcurrency || 'N/A';
}

/**
 * Get device memory in GB
 * @returns Approximate device memory or "N/A"
 */
export function getDeviceMemory(): number | string {
  return (navigator as any).deviceMemory || 'N/A';
}

/**
 * Check if the browser is being controlled by automation (bot detection)
 * @returns True if bot detected, false otherwise
 */
export function isBotDetected(): boolean {
  return !!(navigator as any).webdriver;
}

/**
 * Get screen resolution
 * @returns Screen resolution string
 */
export function getScreenResolution(): string {
  return `${window.screen.width}x${window.screen.height}`;
}

/**
 * Get device pixel ratio
 * @returns Device pixel ratio
 */
export function getPixelRatio(): number {
  return window.devicePixelRatio || 1;
}

/**
 * Get platform information
 * @returns Platform string
 */
export function getPlatform(): string {
  return navigator.platform || 'Unknown';
}

/**
 * Get timezone
 * @returns Timezone string
 */
export function getTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Check if cookies are enabled
 * @returns True if cookies enabled, false otherwise
 */
export function areCookiesEnabled(): boolean {
  return navigator.cookieEnabled;
}

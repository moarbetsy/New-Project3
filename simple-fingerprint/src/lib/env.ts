/**
 * Environment configuration
 * Provides type-safe access to environment variables
 */

interface EnvironmentConfig {
  apiTimeout: number;
  enableDevTools: boolean;
  isDevelopment: boolean;
  isProduction: boolean;
}

function getEnvNumber(key: string, defaultValue: number): number {
  const value = import.meta.env[key];
  return value ? parseInt(value, 10) : defaultValue;
}

function getEnvBoolean(key: string, defaultValue: boolean): boolean {
  const value = import.meta.env[key];
  return value ? value === 'true' : defaultValue;
}

export const env: EnvironmentConfig = {
  apiTimeout: getEnvNumber('VITE_API_TIMEOUT', 3000),
  enableDevTools: getEnvBoolean(
    'VITE_ENABLE_DEVTOOLS',
    import.meta.env.MODE === 'development'
  ),
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',
};

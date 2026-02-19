import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES_BASE || '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    tailwindcss(),
  ],
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    allowedHosts: true,
  },
  preview: {
    allowedHosts: true,
  },
})

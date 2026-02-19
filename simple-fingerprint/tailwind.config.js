/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        canvas: 'var(--color-bg)',
        card: 'var(--color-card)',
        'card-primary': 'var(--color-card-primary)',
        border: 'var(--color-border)',
        text: 'var(--color-text)',
        subtext: 'var(--color-subtext)',
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        success: 'var(--color-success)',
        danger: 'var(--color-danger)',
        warn: 'var(--color-warn)',
      },
      fontFamily: {
        sans: ['Sora', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

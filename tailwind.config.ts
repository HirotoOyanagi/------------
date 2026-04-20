import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0A0A0F',
        'bg-secondary': '#111118',
        'bg-card': '#16161E',
        'accent-purple': '#7C3AED',
        'accent-pink': '#EC4899',
        'accent-orange': '#F97316',
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'sans-serif'],
        heading: ['var(--font-syne)', 'sans-serif'],
        body: ['var(--font-dm)', 'sans-serif'],
      },
      animation: {
        'gradient-shift': 'gradient-shift 4s ease infinite',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'film-roll': 'film-roll 12s linear infinite',
        'scan': 'scan 3s linear infinite',
        'border-spin': 'border-spin 4s linear infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'film-roll': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(200%)' },
        },
        'border-spin': {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '400% 0%' },
        },
      },
    },
  },
  plugins: [],
}

export default config

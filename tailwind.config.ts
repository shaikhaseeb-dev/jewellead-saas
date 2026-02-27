import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Luxury palette
        gold: {
          DEFAULT: '#C6A75E',
          light: '#D4B96A',
          dim: '#A8894A',
          50: 'rgba(198,167,94,0.06)',
          100: 'rgba(198,167,94,0.1)',
          200: 'rgba(198,167,94,0.2)',
        },
        lux: {
          black: '#0A0A0A',
          card: '#111111',
          hover: '#161616',
          border: '#1E1E1E',
          muted: '#252525',
        },
        ink: {
          white: '#F5F0E8',
          gray1: '#C8C4BC',
          gray2: '#7A756C',
          gray3: '#3E3A34',
        },
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", 'Georgia', 'serif'],
        body: ["'DM Sans'", 'system-ui', 'sans-serif'],
        sans: ["'DM Sans'", 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lux: '16px',
        'lux-sm': '10px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)',
        gold: '0 0 0 1px rgba(198,167,94,0.15), 0 4px 24px rgba(198,167,94,0.08)',
        lift: '0 8px 32px rgba(0,0,0,0.7), 0 2px 8px rgba(198,167,94,0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'pulse-glow': 'pulseGlow 2.5s infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(198,167,94,0.4)' },
          '50%':       { boxShadow: '0 0 0 4px rgba(198,167,94,0)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;

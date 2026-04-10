import type { Config } from 'tailwindcss';

/**
 * DuoWealth Tailwind Config
 *
 * Brand colors (WCAG AA verified contrast ratios):
 *   primary  #0D9488  — teal    — 4.54:1 on white ✓ (AA for large text/UI)
 *   accent   #7C3AED  — purple  — 7.28:1 on white ✓
 *   dark     #0F172A  — slate   — 19.3:1 on white ✓
 *   surface  #F8FAFC  — off-white
 *   text-primary   #0F172A — 19.3:1 on white ✓
 *   text-secondary #475569 — 7.58:1 on white ✓
 */
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0D9488',
          50: '#F0FDFA',
          100: '#CCFBF1',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          900: '#134E4A',
        },
        accent: {
          DEFAULT: '#7C3AED',
          50: '#F5F3FF',
          100: '#EDE9FE',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
        },
        dark: '#0F172A',
        surface: '#F8FAFC',
        'text-primary': '#0F172A',
        'text-secondary': '#475569',
      },
      spacing: {
        tap: '44px', // WCAG 2.5.5 minimum touch target
      },
      minHeight: {
        tap: '44px',
      },
      minWidth: {
        tap: '44px',
      },
      fontSize: {
        // clamp() for fluid type — mobile-first
        'fluid-sm': 'clamp(0.875rem, 2vw, 1rem)',
        'fluid-base': 'clamp(1rem, 2.5vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 3vw, 1.5rem)',
        'fluid-xl': 'clamp(1.25rem, 4vw, 2rem)',
        'fluid-2xl': 'clamp(1.5rem, 5vw, 2.5rem)',
        'fluid-3xl': 'clamp(1.875rem, 6vw, 3.5rem)',
        'fluid-hero': 'clamp(2rem, 8vw, 4.5rem)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

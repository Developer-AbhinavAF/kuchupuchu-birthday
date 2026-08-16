/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        background: { DEFAULT: 'var(--background)' },
        foreground: { DEFAULT: 'var(--foreground)' },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        border: { DEFAULT: 'var(--border)' },
        input: { DEFAULT: 'var(--input)' },
        ring: { DEFAULT: 'var(--ring)' },
        blush: { DEFAULT: 'var(--blush)' },
        ivory: { DEFAULT: 'var(--ivory)' },
        wine: { DEFAULT: 'var(--wine)' },
        lavender: { DEFAULT: 'var(--lavender)' },
        moss: { DEFAULT: 'var(--moss)' },
        navy: { DEFAULT: 'var(--navy)' },
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'calc(var(--radius) - 0.25rem)',
        md: 'var(--radius)',
        lg: 'calc(var(--radius) + 0.25rem)',
        xl: 'calc(var(--radius) + 0.5rem)',
        '2xl': 'calc(var(--radius) + 1rem)',
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'Fraunces', 'serif'],
      },
      animation: {
        'petal-fall': 'petal-fall linear infinite',
        'sparkle-float': 'sparkle-float 3s ease-in-out infinite',
        'flame-flicker': 'flame-flicker 0.4s ease-in-out infinite alternate',
        'label-pulse': 'label-pulse 2s ease-in-out infinite',
        'music-pulse': 'music-pulse-anim 1.5s ease-in-out infinite',
      },
      backgroundImage: {
        'garden-gradient': 'linear-gradient(to bottom, #0A0D1A 0%, #0D1A0D 40%, #0A1A0A 70%, #0D1A0D 100%)',
        'night-gradient': 'radial-gradient(ellipse at 50% 60%, #2A1F3D 0%, #1A0E2E 40%, #0A0D1A 100%)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
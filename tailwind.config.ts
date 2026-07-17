import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        maroon: { DEFAULT: '#4B262D', deep: '#33191E' },
        ivory: { DEFAULT: '#EFEAE4', 2: '#F7F4F0' },
        magenta: '#C6178F',
        amber: '#E08A00',
        gold: '#B8934F',
        ink: '#1C1416',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Fraunces', 'serif'],
        body: ['var(--font-body)', 'Lora', 'serif'],
      },
      borderRadius: { sm: '2px', md: '4px', pill: '999px' },
      spacing: {
        xs: '4px', sm: '8px', md: '16px', lg: '24px',
        xl: '32px', '2xl': '48px', '3xl': '64px',
      },
      backgroundImage: {
        'heng-gradient':
          'linear-gradient(115deg, #C6178F 0%, #E08A00 55%, #B8934F 100%)',
      },
      letterSpacing: { eyebrow: '0.18em' },
      transitionTimingFunction: { heng: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};
export default config;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FAF7F2',
        cream: '#F1E8DA',
        sand: '#E5D8C5',
        olive: { DEFAULT: '#667255', dark: '#566146' },
        ink: '#292923',
      },
      fontFamily: {
        display: ['"Young Serif"', 'Georgia', 'serif'],
        sans: ['Figtree', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 6px 24px -10px rgba(41,41,35,0.22)',
        lift: '0 18px 40px -22px rgba(41,41,35,0.35)',
      },
      keyframes: {
        fadeUp: { '0%': { opacity: 0, transform: 'translateY(22px)' }, '100%': { opacity: 1, transform: 'none' } },
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        pageIn: { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'none' } },
        drift: { '0%': { transform: 'scale(1.04) translate3d(0,0,0)' }, '100%': { transform: 'scale(1.12) translate3d(-1.5%,-1.5%,0)' } },
        floatLeaf: {
          '0%,100%': { transform: 'translateY(0) rotate(var(--r,0deg))' },
          '50%': { transform: 'translateY(-14px) rotate(calc(var(--r,0deg) + 6deg))' },
        },
        pop: { '0%': { transform: 'scale(1)' }, '40%': { transform: 'scale(1.3)' }, '100%': { transform: 'scale(1)' } },
        slideIn: { '0%': { opacity: 0, transform: 'translateX(24px)' }, '100%': { opacity: 1, transform: 'none' } },
        grow: { '0%': { strokeDashoffset: 120 }, '100%': { strokeDashoffset: 0 } },
        breathe: { '0%,100%': { opacity: 0.55, transform: 'scale(0.96)' }, '50%': { opacity: 1, transform: 'scale(1)' } },
      },
      animation: {
        'fade-up': 'fadeUp .8s cubic-bezier(.2,.7,.2,1) both',
        'fade-in': 'fadeIn .6s ease-out both',
        'page-in': 'pageIn .45s ease-out both',
        drift: 'drift 22s ease-in-out infinite alternate',
        'float-leaf': 'floatLeaf 9s ease-in-out infinite',
        pop: 'pop .45s ease-out',
        'slide-in': 'slideIn .35s ease-out both',
        breathe: 'breathe 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

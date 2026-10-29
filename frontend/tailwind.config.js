const t = (n) => `rgb(var(--${n}) / <alpha-value>)`;
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      colors: {
        canvas: t('canvas'), surface: t('surface'), sunken: t('sunken'), line: t('line'), 'line-strong': t('line-strong'),
        fg: t('fg'), 'fg-muted': t('fg-muted'), 'fg-subtle': t('fg-subtle'),
        brand: { DEFAULT: t('brand'), hover: t('brand-hover'), fg: t('brand-fg') },
        ok: t('ok'), warn: t('warn'), bad: t('bad'), info: t('info'),
        lime: t('lime'), snow: t('snow'), ink: t('ink'), cobalt: t('cobalt'), deep: t('deep'),
      },
      boxShadow: {
        card: '0 0 0 1.5px rgb(var(--ink)), 6px 6px 0 0 rgb(var(--deep))',
        pop: '0 0 0 1.5px rgb(var(--ink)), 10px 10px 0 0 rgb(var(--deep))',
        focus: '0 0 0 3px rgb(var(--lime) / 0.6)',
      },
      borderRadius: { lg: '0.25rem', xl: '0.375rem', '2xl': '0.5rem' },
      keyframes: { 'fade-up': { '0%': { opacity: 0, transform: 'translateY(10px)' }, '100%': { opacity: 1, transform: 'none' } } },
      animation: { 'fade-up': 'fade-up .5s ease-out both' },
    },
  },
  plugins: [],
};

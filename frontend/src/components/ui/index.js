import React from 'react';

/* ------------------------------------------------------------------ */
/* Tone maps — every status color in the app flows through these.      */
/* ------------------------------------------------------------------ */
const TONES = {
  neutral: 'bg-sunken text-fg-muted border-line',
  brand: 'bg-brand/10 text-brand border-brand/20',
  ok: 'bg-lime text-ink border-ink/20',
  warn: 'bg-sunken text-fg-muted border-line-strong',
  bad: 'bg-ink text-snow border-ink',
  info: 'bg-info/10 text-info border-info/25',
};
const DOT = {
  neutral: 'bg-fg-subtle', brand: 'bg-brand', ok: 'bg-ink', warn: 'bg-fg-muted', bad: 'bg-snow', info: 'bg-info',
};
const BAR = {
  neutral: 'bg-fg-subtle', brand: 'bg-brand', ok: 'bg-ok', warn: 'bg-warn', bad: 'bg-bad', info: 'bg-info',
};
const TEXT = {
  neutral: 'text-fg-subtle', brand: 'text-brand', ok: 'text-ok', warn: 'text-warn', bad: 'text-bad', info: 'text-info',
};
const STROKE = {
  brand: 'rgb(var(--brand))', ok: 'rgb(var(--brand))', warn: 'rgb(var(--brand))', bad: 'rgb(var(--ink))', info: 'rgb(var(--brand))',
};

export const cx = (...a) => a.filter(Boolean).join(' ');

/* Buttons ---------------------------------------------------------- */
export const buttonClass = (variant = 'secondary', size = 'md', extra = '') => {
  const base =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';
  const sizes = { sm: 'h-8 px-3 text-xs', md: 'h-9 px-3.5 text-sm', lg: 'h-11 px-5 text-sm' };
  const variants = {
    primary: 'bg-brand text-brand-fg hover:bg-brand-hover',
    lime: 'bg-lime text-ink font-semibold hover:-translate-y-0.5 hover:bg-snow',
    outline: 'border border-snow/50 text-snow hover:bg-snow hover:text-ink',
    secondary: 'bg-surface text-fg border border-line hover:bg-sunken hover:border-line-strong',
    ghost: 'text-fg-muted hover:text-fg hover:bg-sunken',
    danger: 'bg-bad/10 text-bad border border-bad/25 hover:bg-bad/15',
  };
  return cx(base, sizes[size], variants[variant], extra);
};

/* Surfaces --------------------------------------------------------- */
export function Card({ className = '', children, ...rest }) {
  return (
    <div className={cx('rounded-xl bg-surface shadow-card', className)} {...rest}>
      {children}
    </div>
  );
}

export function CardHeader({ title, description, action, icon: Icon, className = '' }) {
  return (
    <div className={cx('flex items-start justify-between gap-4 px-5 pt-5', className)}>
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sunken text-fg-muted">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-fg">{title}</h3>
          {description && <p className="mt-0.5 text-xs leading-relaxed text-fg-muted">{description}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, actions, children }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <div className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-lime">● {eyebrow}</div>}
        <h1 className="font-display text-[clamp(2.4rem,5vw,4rem)] font-extrabold leading-[0.95] tracking-tighter text-snow">{title}</h1>
        {description && <p className="mt-4 max-w-2xl font-serif text-xl italic leading-snug text-snow/85">{description}</p>}
        {children}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/* Small atoms ------------------------------------------------------ */
export function Badge({ tone = 'neutral', mono = false, dot = false, className = '', children }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium leading-5',
        mono && 'font-mono',
        TONES[tone],
        className
      )}
    >
      {dot && <span className={cx('h-1.5 w-1.5 rounded-full', DOT[tone])} />}
      {children}
    </span>

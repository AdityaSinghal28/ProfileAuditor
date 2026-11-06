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
  );
}

export function Chip({ tone = 'neutral', children }) {
  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium', TONES[tone])}>
      <span className={cx('h-1.5 w-1.5 rounded-full', DOT[tone])} />
      {children}
    </span>
  );
}

export function Spinner({ className = 'h-4 w-4' }) {
  return (
    <svg className={cx('animate-spin', className)} fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export function ProgressBar({ value = 0, tone = 'brand', className = '' }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className={cx('h-1.5 w-full overflow-hidden rounded-full bg-sunken', className)} role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
      <div className={cx('h-full rounded-full transition-all duration-700 ease-out', BAR[tone])} style={{ width: `${v}%` }} />
    </div>
  );
}

export function ScoreRing({ value = 0, size = 144, stroke = 10, tone = 'brand', label = '/ 100', className = '' }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className={cx('relative shrink-0', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(var(--line))" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={STROKE[tone]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v / 100)}
          style={{ transition: 'stroke-dashoffset .9s cubic-bezier(.2,.8,.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-semibold leading-none tracking-tight text-fg" style={{ fontSize: size * 0.28 }}>
          {Math.round(v)}
        </span>
        {label && <span className="mt-1 font-mono text-[10px] text-fg-subtle">{label}</span>}
      </div>
    </div>
  );
}

export function Stat({ label, value, hint, icon: Icon, tone }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-fg-muted">{label}</span>
        {Icon && <Icon className={cx('h-4 w-4', TEXT[tone || 'neutral'])} />}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-fg">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-fg-subtle">{hint}</div>}
    </Card>
  );
}

export function KeyValue({ label, value, mono = true }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-2.5 text-xs last:border-0">
      <span className="text-fg-muted">{label}</span>
      <span className={cx('font-medium text-fg', mono && 'font-mono')}>{value}</span>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
      {Icon && (
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-sunken text-fg-subtle">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <p className="text-sm font-medium text-fg">{title}</p>
      {description && <p className="mt-1 max-w-sm text-xs leading-relaxed text-fg-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Notice({ tone = 'bad', children }) {
  return <div className={cx('flex items-start gap-2 rounded-lg border px-3.5 py-3 text-xs leading-relaxed', TONES[tone])}>{children}</div>;
}

export function Kbd({ children }) {
  return (
    <kbd className="rounded border border-line bg-sunken px-1.5 py-0.5 font-mono text-[10px] font-medium text-fg-muted">{children}</kbd>
  );
}

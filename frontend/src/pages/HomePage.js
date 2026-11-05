import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { clearRecentAudits, getRecentAudits, timeAgo } from '../utils/recentAudits';
import { buttonClass } from '../components/ui';
import { CountUp, Reveal } from '../components/motion';

const METHOD = [
  ['Extract', 'Text, contacts, handles, skills and projects pulled from your PDF or DOCX.', 'PDF · DOCX'],
  ['Audit the code', 'Forks filtered out. Commit authorship, stars and language share inspected.', 'GitHub'],
  ['Check the grind', 'Solved counts, contest rating and global rank read straight from LeetCode.', 'LeetCode'],
  ['Score reality', 'One number from 0 to 100 for how much of the story the evidence supports.', '0–100'],
];
const LEDGER = [['Go · 5 yrs', '14 original repos', true], ['TypeScript', '9 original repos', true], ['Kafka pipeline', 'StreamKit · matched', true], ['Kubernetes', 'no trace in public code', false]];
const Tape = () => (
  <span className="flex shrink-0 items-center gap-8 pr-8 font-display text-2xl font-extrabold uppercase tracking-tight">
    {['Claimed', 'Checked', 'Proven'].map((w) => (<span key={w} className="flex items-center gap-8">{w}<span className="text-lime">→</span></span>))}
  </span>
);

function HomePage() {
  const [recents, setRecents] = useState(getRecentAudits);

  return (
    <div className="text-snow">
      {/* HERO */}
      <section className="mx-auto grid max-w-[1320px] items-center gap-14 px-4 pb-24 pt-16 sm:px-8 lg:grid-cols-12 lg:pt-24">
        <div className="lg:col-span-7">
          <p style={{ '--d': '.05s' }} className="rise font-mono text-[11px] uppercase tracking-[0.18em] text-snow/70">Resume verification · GitHub × LeetCode</p>
          <h1 style={{ '--d': '.15s' }} className="rise mt-6 font-display text-[clamp(3.4rem,9.5vw,8.5rem)] font-extrabold leading-[0.86] tracking-tighter">
            Resumes <span className="strike-line">claim</span>.<br />
            Code <span className="mark">proves</span>.
          </h1>
          <p style={{ '--d': '.35s' }} className="rise mt-8 max-w-lg font-serif text-2xl italic leading-snug text-snow/85">
            We read the resume, then we read the repos. Whatever survives gets a Reality Score.
          </p>
          <div style={{ '--d': '.5s' }} className="rise mt-10 flex flex-wrap items-center gap-4">
            <Link to="/upload" className={buttonClass('lime', 'lg', 'px-7')}>Audit a resume →</Link>
            <a href="#method" className="font-mono text-xs uppercase tracking-[0.14em] text-snow/80 underline-offset-4 hover:text-lime hover:underline">How it works</a>
          </div>
        </div>

        {/* Specimen */}
        <div style={{ '--d': '.3s' }} className="rise relative mx-auto w-full max-w-md lg:col-span-5">
          <div className="-rotate-3 bg-snow p-6 text-ink shadow-pop">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-fg-muted">
              <span>Specimen · illustrative</span><span>AUD-0000</span>
            </div>
            <div className="mt-3 font-display text-3xl font-extrabold tracking-tighter">Alex Chen</div>
            <ul className="mt-5 divide-y divide-line border-y border-line">
              {LEDGER.map(([claim, ev, ok], i) => (
                <li key={claim} style={{ '--d': `${0.7 + i * 0.12}s` }} className="rise flex items-center justify-between gap-3 py-3 text-sm">
                  <span className={ok ? 'font-semibold' : 'font-semibold text-fg-subtle line-through decoration-2'}>{claim}</span>
                  <span className={ok ? 'bg-lime px-1.5 font-mono text-[11px]' : 'font-mono text-[11px] text-fg-subtle'}>{ev}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-end justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-muted">Reality score</span>
              <CountUp value={78} ms={1500} className="font-display text-7xl font-extrabold leading-none tracking-tighter" />
            </div>
          </div>
          <div className="absolute -right-4 -top-10 h-32 w-32 sm:-right-8">
            <svg viewBox="0 0 120 120" className="spin-slow h-full w-full rounded-full bg-lime text-ink">
              <defs><path id="c" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" /></defs>
              <text fontFamily="JetBrains Mono, monospace" fontSize="10.5" fontWeight="600" letterSpacing="2.4" fill="currentColor">
                <textPath href="#c">VERIFIED BY CODE • VERIFIED BY CODE •</textPath>
              </text>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-display text-3xl font-extrabold text-ink">✓</span>
          </div>
        </div>
      </section>

      {/* TAPE */}
      <div className="overflow-hidden border-y border-snow/25 py-4" aria-hidden="true">
        <div className="marquee"><Tape /><Tape /><Tape /><Tape /></div>
      </div>

      {/* METHOD (snow) */}
      <section id="method" className="bg-snow text-ink">
        <div className="mx-auto max-w-[1320px] px-4 py-24 sm:px-8">
          <h2 className="max-w-3xl font-display text-[clamp(2.4rem,6vw,5rem)] font-extrabold leading-[0.92] tracking-tighter">
            Four checks. <span className="font-serif font-normal italic text-brand">Zero vibes.</span>
          </h2>
          <ol className="mt-14 border-b border-ink/20">
            {METHOD.map(([t, d, tag], i) => (
              <Reveal as="li" delay={i * 90} key={t} className="group grid items-center gap-4 border-t border-ink/20 px-2 py-8 transition-colors hover:bg-brand hover:text-snow sm:grid-cols-12">
                <span className="outline-num font-display text-6xl font-extrabold leading-none text-brand group-hover:text-lime sm:col-span-2">0{i + 1}</span>
                <h3 className="font-display text-3xl font-bold tracking-tight sm:col-span-4">{t}</h3>
                <p className="max-w-md text-base leading-relaxed text-fg-muted group-hover:text-snow/85 sm:col-span-5">{d}</p>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] sm:col-span-1 sm:text-right">{tag}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* LEDGER */}
      <section className="mx-auto max-w-[1320px] px-4 py-24 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-extrabold leading-none tracking-tighter">The ledger</h2>
          {recents.length > 0 && (
            <button onClick={() => { clearRecentAudits(); setRecents([]); }} className="font-mono text-[11px] uppercase tracking-[0.14em] text-snow/70 hover:text-lime">Clear</button>
          )}
        </div>
        {recents.length === 0 ? (
          <div className="mt-10 border-y border-snow/25 py-16">
            <p className="font-serif text-4xl italic text-snow/90">Nothing audited yet.</p>
            <Link to="/upload" className={buttonClass('lime', 'lg', 'mt-8 px-7')}>Run the first audit →</Link>
          </div>
        ) : (
          <ul className="mt-10 border-t border-snow/25">
            {recents.slice(0, 8).map((r, i) => (
              <Reveal as="li" delay={i * 80} key={r.id}>
                <Link to={`/results/${r.id}`} className="group grid items-center gap-4 border-b border-snow/25 px-2 py-5 transition hover:bg-snow/10 sm:grid-cols-12">
                  <span className="font-mono text-xs text-snow/60 sm:col-span-1">{String(i + 1).padStart(2, '0')}</span>
                  <span className="truncate font-display text-3xl font-bold tracking-tight sm:col-span-5">{r.name || 'Unnamed candidate'}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-snow/60 sm:col-span-3">AUD-{r.id.slice(0, 8)} · {timeAgo(r.at)}</span>
                  <span className="flex items-baseline justify-end gap-3 sm:col-span-3">
                    <span className={`font-display text-5xl font-extrabold leading-none tracking-tighter ${r.score >= 80 ? 'bg-lime px-2 text-ink' : ''}`}>{r.score}</span>
                    <span className="font-mono text-xs text-snow/60 transition group-hover:translate-x-1 group-hover:text-lime">→</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default HomePage;

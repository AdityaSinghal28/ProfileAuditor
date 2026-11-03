import React, { useEffect, useRef, useState } from 'react';

const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Returns [ref, seen] — flips true once, the first time the element is in view. */
export function useInView(threshold = 0.35) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined' || reduced()) { setOn(true); return undefined; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, on];
}

/** Fade/slide in on scroll. Child .hl / .st marks animate off data-in. */
export function Reveal({ as: Tag = 'div', children, className = '', delay = 0, threshold = 0.35 }) {
  const [ref, on] = useInView(threshold);
  return (
    <Tag ref={ref} data-in={on} className={`rv ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  );
}

/** Eased integer count-up. */
export function CountUp({ value = 0, ms = 1100, run = true, className = '' }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return undefined;
    if (reduced()) { setN(value); return undefined; }
    const t0 = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min((t - t0) / ms, 1);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, ms, run]);
  return <span className={className}>{n}</span>;
}

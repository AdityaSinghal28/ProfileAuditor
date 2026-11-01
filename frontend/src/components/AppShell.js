import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import CommandPaletteModal from './CommandPaletteModal';
import { cx } from './ui';

function AppShell({ children }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [rid, setRid] = useState(null);

  useEffect(() => { document.documentElement.classList.remove('dark'); }, []);
  useEffect(() => { setRid(sessionStorage.getItem('profileauditor_last_resume_id')); }, [pathname]);
  useEffect(() => {
    const k = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((p) => !p); }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);

  const nav = [
    ['01', 'Overview', '/', true],
    ['02', 'Audit', '/upload'],
    ...(rid ? [['03', 'Report', `/results/${rid}`]] : []),
    ['04', 'Editor', rid ? `/editor/${rid}` : '/editor'],
  ];
  const isHome = pathname === '/';
  const wide = pathname.startsWith('/editor');

  return (
    <div className="min-h-screen bg-canvas text-snow">
      <header data-app-topbar className="sticky top-0 z-30 border-b border-snow/20 bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1320px] items-center gap-6 px-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5" aria-label="ProfileAuditor home">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lime font-display text-lg font-extrabold leading-none text-ink">✓</span>
            <span className="font-display text-lg font-extrabold tracking-tighter">Profile<span className="text-lime">/</span>Auditor</span>
          </Link>
          <nav className="ml-auto flex items-center gap-1 overflow-x-auto font-mono text-[11px] uppercase tracking-[0.14em]" aria-label="Main">
            {nav.map(([n, label, to, end]) => (
              <NavLink key={to} to={to} end={end}
                className={({ isActive }) => cx('nav-u flex items-center gap-1.5 whitespace-nowrap px-3 py-2 transition', isActive ? 'active text-lime' : 'text-snow/75 hover:text-snow')}>
                <span className="opacity-60">{n}</span>{label}
              </NavLink>
            ))}
          </nav>
          <button onClick={() => setOpen(true)} aria-label="Search"
            className="hidden items-center gap-2 border border-snow/40 px-3 py-1.5 font-mono text-[11px] text-snow/80 transition hover:bg-snow hover:text-ink sm:flex">
            <MagnifyingGlassIcon className="h-3.5 w-3.5" /> ⌘K
          </button>
        </div>
      </header>

      <main className={isHome ? '' : cx('mx-auto px-4 py-10 sm:px-8', wide ? 'max-w-none' : 'max-w-[1240px]')}><div key={pathname} className="rise">{children}</div></main>

      <footer data-no-print className="bg-deep">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-snow/60">Public GitHub &amp; LeetCode data only</p>
          <div className="flex gap-6 font-mono text-[11px] uppercase tracking-[0.14em] text-snow/80">
            {[['/privacy', 'Privacy'], ['/terms', 'Terms'], ['/cookies', 'Cookies'], ['/refund', 'Refunds']].map(([to, l]) => (
              <Link key={to} to={to} className="hover:text-lime">{l}</Link>
            ))}
          </div>
        </div>
      </footer>
      <CommandPaletteModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
}

export default AppShell;

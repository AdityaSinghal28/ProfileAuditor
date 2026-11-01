import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Kbd } from './ui';

function CommandPaletteModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const lastResumeId = sessionStorage.getItem('profileauditor_last_resume_id');

  const allItems = useMemo(
    () => [
      { id: 'dashboard', title: 'Overview', category: 'Navigation', path: '/', description: 'Dashboard, recent audits and pipeline summary' },
      { id: 'upload', title: 'New audit', category: 'Pipeline', path: '/upload', description: 'Upload a PDF or DOCX resume to start verification' },
      {
        id: 'editor',
        title: 'ATS editor',
        category: 'Pipeline',
        path: lastResumeId ? `/editor/${lastResumeId}` : '/editor',
        description: 'Exact-layout document editor with real-time ATS scoring',
      },
      ...(lastResumeId
        ? [
            {
              id: 'report',
              title: `Active report (AUD-${lastResumeId.slice(0, 6)})`,
              category: 'Session',
              path: `/results/${lastResumeId}`,
              description: 'Reality Score, GitHub proofs and LeetCode metrics',
            },
          ]
        : []),
      { id: 'privacy', title: 'Privacy policy', category: 'Legal', path: '/privacy', description: 'Data minimisation and GDPR compliance' },
      { id: 'terms', title: 'Terms of service', category: 'Legal', path: '/terms', description: 'Service availability and liability terms' },
      { id: 'cookies', title: 'Cookie policy', category: 'Legal', path: '/cookies', description: 'Strictly necessary local storage disclosure' },
      { id: 'refund', title: 'Refund policy', category: 'Legal', path: '/refund', description: '14-day guarantee and cancellation information' },
    ],
    [lastResumeId]
  );

  const q = query.toLowerCase();
  const filteredItems = allItems.filter(
    (i) => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => setSelectedIndex(0), [query]);

  const handleSelect = (item) => {
    navigate(item.path);
    onClose();
  };

  const handleKeyDown = (e) => {
    const n = filteredItems.length || 1;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((p) => (p + 1) % n);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((p) => (p - 1 + n) % n);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) handleSelect(filteredItems[selectedIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[14vh]">
      <div className="fixed inset-0 bg-fg/30 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative z-50 w-full max-w-xl animate-fade-up overflow-hidden rounded-2xl bg-surface shadow-pop"
      >
        <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
          <MagnifyingGlassIcon className="h-5 w-5 text-fg-subtle" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages and actions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm text-fg placeholder:text-fg-subtle focus:outline-none"
          />
          <Kbd>ESC</Kbd>
        </div>

        <div className="max-h-80 space-y-0.5 overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-fg-muted">No matching pages or actions.</div>
          ) : (
            filteredItems.map((item, idx) => {
              const active = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition ${
                    active ? 'bg-sunken' : ''
                  }`}
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-fg">{item.title}</span>
                      <span className="rounded border border-line px-1.5 py-px text-[10px] font-medium text-fg-subtle">{item.category}</span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-fg-muted">{item.description}</p>
                  </div>
                  <ChevronRightIcon className={`h-4 w-4 shrink-0 ${active ? 'text-fg' : 'text-fg-subtle'}`} />
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-line bg-sunken/60 px-4 py-2 text-[11px] text-fg-subtle">
          <span className="flex items-center gap-1.5"><Kbd>↑</Kbd><Kbd>↓</Kbd> navigate</span>
          <span className="flex items-center gap-1.5"><Kbd>↵</Kbd> open</span>
        </div>
      </div>
    </div>
  );
}

export default CommandPaletteModal;

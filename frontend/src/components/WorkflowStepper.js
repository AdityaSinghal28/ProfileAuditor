import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { CheckIcon } from '@heroicons/react/24/solid';
import { cx } from './ui';

/** Horizontal 3-step pipeline: Ingest → Footprint audit → ATS editor. */
function WorkflowStepper({ activeResumeId: propResumeId }) {
  const location = useLocation();
  const params = useParams();

  const resumeId = propResumeId || params.resumeId || sessionStorage.getItem('profileauditor_last_resume_id');
  const pathname = location.pathname;

  const isUpload = pathname === '/upload';
  const isResults = pathname.startsWith('/results');
  const isEditor = pathname.startsWith('/editor');
  if (!(isUpload || isResults || isEditor)) return null;

  const getStatus = (i) => {
    if (i === 1) return isUpload ? 'current' : 'completed';
    if (i === 2) {
      if (isResults) return 'current';
      if (isEditor) return 'completed';
      return resumeId ? 'accessible' : 'disabled';
    }
    return isEditor ? 'current' : 'accessible';
  };

  const steps = [
    { id: 1, title: 'Ingest resume', desc: 'PDF / DOCX parsing', to: '/upload' },
    { id: 2, title: 'Footprint audit', desc: 'Code reality check', to: resumeId ? `/results/${resumeId}` : '/upload' },
    { id: 3, title: 'ATS editor', desc: 'Optimise & export', to: resumeId ? `/editor/${resumeId}` : '/editor' },
  ].map((s) => ({ ...s, status: getStatus(s.id) }));

  return (
    <nav className="mb-6" aria-label="Audit pipeline" data-no-print>
      <ol className="flex items-center gap-2 rounded-xl bg-surface p-1.5 shadow-card">
        {steps.map((step, idx) => {
          const current = step.status === 'current';
          const done = step.status === 'completed';
          const disabled = step.status === 'disabled';
          const inner = (
            <>
              <span
                className={cx(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
                  current && 'bg-brand text-brand-fg',
                  done && 'bg-ok/15 text-ok',
                  !current && !done && 'bg-sunken text-fg-subtle'
                )}
              >
                {done ? <CheckIcon className="h-3.5 w-3.5" /> : step.id}
              </span>
              <span className="min-w-0 text-left">
                <span className={cx('block truncate text-[13px] font-medium', current ? 'text-fg' : 'text-fg-muted')}>{step.title}</span>
                <span className="hidden truncate text-[11px] text-fg-subtle sm:block">{step.desc}</span>
              </span>
            </>
          );
          const cls = cx(
            'flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-3 py-2 transition',
            current ? 'bg-sunken' : 'hover:bg-sunken/60',
            disabled && 'pointer-events-none opacity-50'
          );
          return (
            <li key={step.id} className="flex min-w-0 flex-1 items-center gap-2">
              {disabled ? (
                <div className={cls} aria-disabled="true">{inner}</div>
              ) : (
                <Link to={step.to} className={cls} aria-current={current ? 'step' : undefined}>{inner}</Link>
              )}
              {idx < steps.length - 1 && <span className="hidden h-px w-4 shrink-0 bg-line sm:block" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default WorkflowStepper;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { buttonClass } from './ui';

function CookieConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('profileauditor_cookie_consent')) setShow(true);
  }, []);

  const choose = (value) => {
    localStorage.setItem('profileauditor_cookie_consent', value);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      data-no-print
      className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-2xl animate-fade-up rounded-xl bg-surface p-4 shadow-pop sm:left-auto sm:right-4 sm:mx-0"
    >
      <p className="text-xs leading-relaxed text-fg-muted">
        <span className="font-semibold text-fg">Cookies &amp; privacy.</span> We only use essential local storage for
        editor settings and audit session state — no advertising or cross-site tracking. See the{' '}
        <Link to="/cookies" className="font-medium text-brand hover:underline">Cookie Policy</Link> and{' '}
        <Link to="/privacy" className="font-medium text-brand hover:underline">Privacy Policy</Link>.
      </p>
      <div className="mt-3 flex items-center justify-end gap-2">
        <button type="button" onClick={() => choose('essential_only')} className={buttonClass('secondary', 'sm')}>
          Essential only
        </button>
        <button type="button" onClick={() => choose('accepted')} className={buttonClass('primary', 'sm')}>
          Accept all
        </button>
      </div>
    </div>
  );
}

export default CookieConsentBanner;

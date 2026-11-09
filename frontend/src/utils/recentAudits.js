/**
 * Lightweight client-side history of audits run in this browser.
 * (The backend exposes per-ID endpoints only, so the dashboard keeps its own index.)
 */
const KEY = 'profileauditor_recent_audits';
const MAX = 25;

export const getRecentAudits = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch (_) {
    return [];
  }
};

export const saveRecentAudit = (entry) => {
  try {
    const list = getRecentAudits().filter((e) => e.id !== entry.id);
    list.unshift({ ...entry, at: Date.now() });
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch (_) {
    /* storage unavailable — dashboard simply stays empty */
  }
};

export const clearRecentAudits = () => {
  try {
    localStorage.removeItem(KEY);
  } catch (_) {}
};

export const timeAgo = (ts) => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

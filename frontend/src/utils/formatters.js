/**
 * General UI utility helpers for formatting and normalization.
 */

export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const cleanHandle = (handle) => {
  if (!handle) return '';
  return handle
    .replace(/^https?:\/\/(?:www\.)?(?:github\.com|leetcode\.com\/(?:u\/)?)/i, '')
    .replace(/^@/, '')
    .replace(/\/$/, '')
    .trim();
};

export const sanitizeFileName = (name, ext = 'docx') => {
  const clean = (name || 'Resume').replace(/[^a-zA-Z0-9_\-]/g, '_');
  return `${clean}.${ext}`;
};


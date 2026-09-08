/**
 * Derive initials from a full name, e.g. "John Doe" -> "JD".
 */
export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || '?';
}

/**
 * Human friendly relative time, e.g. "just now", "5m", "2h", "3d".
 */
export function timeAgo(dateString) {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 45) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  });
}

/**
 * Format a number compactly, e.g. 1234 -> "1.2k".
 */
export function formatCount(n) {
  if (!n) return 0;
  if (n < 1000) return n;
  return `${(n / 1000).toFixed(1)}k`;
}
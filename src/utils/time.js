/**
 * Formats a timestamp into a relative time string (e.g., "Just now", "2m ago", "3h ago").
 * Supports ISO strings, numeric timestamps, and fallback strings.
 */
export function formatTime(timestamp) {
  if (!timestamp) return 'Just now';
  
  // Try to parse the timestamp
  const date = new Date(timestamp);
  
  // If parsing fails (e.g. if it's already a string like "2h ago"), return it as is
  if (isNaN(date.getTime()) || typeof timestamp === 'string' && !timestamp.includes('T') && isNaN(Number(timestamp))) {
    return timestamp;
  }
  
  const diffMs = new Date() - date;
  if (diffMs < 0) return 'Just now';
  
  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return 'Just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  
  // If it's older than 30 days, show formatted date
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

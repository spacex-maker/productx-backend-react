import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Backend LocalDateTime is stored as UTC wall clock (JDBC serverTimezone=UTC).
 * Display converts to the admin browser timezone.
 */
export const getAdminTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Shanghai';
  } catch (e) {
    return 'Asia/Shanghai';
  }
};

export const parseBackendUtc = (date) => {
  if (!date) return null;
  if (typeof date === 'number') {
    return dayjs.utc(date);
  }
  const raw = String(date).trim();
  if (!raw) return null;
  // Already has Z / offset: parse as absolute instant
  if (/[zZ]$/.test(raw) || /[+-]\d{2}:?\d{2}$/.test(raw)) {
    return dayjs(raw);
  }
  // Naive string treated as UTC
  const normalized = raw.includes('T') ? raw : raw.replace(' ', 'T');
  return dayjs.utc(normalized);
};

/**
 * Format date (UTC -> admin timezone)
 */
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  const parsed = parseBackendUtc(date);
  if (!parsed || !parsed.isValid()) return '-';
  return parsed.tz(getAdminTimezone()).format(format);
};

export const formatRelativeTime = (date) => {
  const parsed = parseBackendUtc(date);
  if (!parsed || !parsed.isValid()) return '-';
  const now = dayjs();
  const target = parsed.tz(getAdminTimezone());
  const diffMinutes = now.diff(target, 'minute');

  if (diffMinutes < 1) return '\u521a\u521a';
  if (diffMinutes < 60) return `${diffMinutes}\u5206\u949f\u524d`;

  const diffHours = now.diff(target, 'hour');
  if (diffHours < 24) return `${diffHours}\u5c0f\u65f6\u524d`;

  const diffDays = now.diff(target, 'day');
  if (diffDays < 30) return `${diffDays}\u5929\u524d`;

  const diffMonths = now.diff(target, 'month');
  if (diffMonths < 12) return `${diffMonths}\u4e2a\u6708\u524d`;

  const diffYears = now.diff(target, 'year');
  return `${diffYears}\u5e74\u524d`;
};

export const formatTimestamp = (timestamp, format = 'YYYY-MM-DD HH:mm:ss') => {
  return formatDate(timestamp, format);
};
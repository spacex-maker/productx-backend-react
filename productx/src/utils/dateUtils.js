import dayjs from 'dayjs';

/**
 * 格式化日期
 * @param {string|Date} date - 要格式化的日期
 * @param {string} format - 格式化模式，默认为 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return '-';
  return dayjs(date).format(format);
};

/**
 * 格式化日期为相对时间
 * @param {string|Date} date - 要格式化的日期
 * @returns {string} 相对时间字符串
 */
export const formatRelativeTime = (date) => {
  if (!date) return '-';
  const now = dayjs();
  const target = dayjs(date);
  const diffMinutes = now.diff(target, 'minute');
  
  if (diffMinutes < 1) return '刚刚';
  if (diffMinutes < 60) return `${diffMinutes}分钟前`;
  
  const diffHours = now.diff(target, 'hour');
  if (diffHours < 24) return `${diffHours}小时前`;
  
  const diffDays = now.diff(target, 'day');
  if (diffDays < 30) return `${diffDays}天前`;
  
  const diffMonths = now.diff(target, 'month');
  if (diffMonths < 12) return `${diffMonths}个月前`;
  
  const diffYears = now.diff(target, 'year');
  return `${diffYears}年前`;
};

/**
 * 格式化时间戳
 * @param {number} timestamp - 时间戳（毫秒）
 * @param {string} format - 格式化模式，默认为 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的日期字符串
 */
export const formatTimestamp = (timestamp, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!timestamp) return '-';
  return dayjs(timestamp).format(format);
}; 
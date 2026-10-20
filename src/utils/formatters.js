// Formatting utilities for Aramya Foods Corporate Catering ERP

export const formatINR = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const num = Math.round(amount);
  return '₹' + num.toLocaleString('en-IN');
};

export const formatNumber = (num, decimals = 0) => {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return Number(num).toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const formatPercent = (val, decimals = 1) => {
  if (val === undefined || val === null || isNaN(val)) return '0%';
  return `${Number(val).toFixed(decimals)}%`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  return timeStr;
};

import React from 'react';

export const Badge = ({ variant = 'neutral', children, className = '' }) => {
  const styles = {
    positive: 'bg-[#dcfae5] text-[#04250e]',
    negative: 'bg-[#ffedea] text-[#831c1e]',
    warning: 'bg-[#fffbeb] text-[#92400e]',
    neutral: 'bg-[#ebedee] text-[#353736]',
    accent: 'bg-[#e6f3f6] text-[#1b6c80]',
  };

  const styleClass = styles[variant] || styles.neutral;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium tracking-tight ${styleClass} ${className}`}
    >
      {children}
    </span>
  );
};

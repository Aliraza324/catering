import React from 'react';

export const CodesincBadge = ({ variant = 'default', className = '' }) => {
  if (variant === 'sidebar') {
    return (
      <a
        href="https://www.codes-inc.com/"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center p-2 rounded-lg bg-white border border-[#e8eaec] hover:border-[#0080FF] transition-colors group ${className}`}
        title="Designed and hosted by Codesinc. - Visit www.codes-inc.com"
      >
        <img
          src="/codesinc-brand.png"
          alt="Designed and hosted by Codesinc."
          className="h-8.5 w-auto max-w-full object-contain"
        />
      </a>
    );
  }

  if (variant === 'footer') {
    return (
      <a
        href="https://www.codes-inc.com/"
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center hover:opacity-80 transition-opacity group ${className}`}
        title="Designed and hosted by Codesinc. - Visit www.codes-inc.com"
      >
        <img
          src="/codesinc-brand.png"
          alt="Designed and hosted by Codesinc."
          className="h-8 sm:h-9 w-auto object-contain"
        />
      </a>
    );
  }

  return (
    <a
      href="https://www.codes-inc.com/"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center hover:opacity-80 transition-opacity ${className}`}
      title="Designed and hosted by Codesinc. - Visit www.codes-inc.com"
    >
      <img
        src="/codesinc-brand.png"
        alt="Designed and hosted by Codesinc."
        className="h-8 sm:h-9 w-auto object-contain"
      />
    </a>
  );
};

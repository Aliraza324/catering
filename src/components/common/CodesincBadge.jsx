import React from 'react';

export const CodesincBadge = ({ variant = 'default', className = '' }) => {
  if (variant === 'sidebar') {
    return (
      <a
        href="https://www.codes-inc.com/"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-2.5 p-2 rounded-md bg-white border border-[#e8eaec] hover:border-[#0080FF] transition-colors group ${className}`}
        title="Designed and hosted by Codesinc. - Visit www.codes-inc.com"
      >
        <img
          src="/codesinc-brand.png"
          alt="Designed and hosted by Codesinc."
          className="h-8 w-auto object-contain shrink-0"
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
        className={`inline-flex items-center gap-2 p-1.5 px-3 rounded-md bg-white border border-[#e8eaec] hover:border-[#0080FF] transition-colors group ${className}`}
        title="Designed and hosted by Codesinc. - Visit www.codes-inc.com"
      >
        <img
          src="/codesinc-brand.png"
          alt="Designed and hosted by Codesinc."
          className="h-7 w-auto object-contain shrink-0"
        />
      </a>
    );
  }

  return (
    <a
      href="https://www.codes-inc.com/"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center transition-opacity hover:opacity-85 ${className}`}
      title="Designed and hosted by Codesinc. — Visit www.codes-inc.com"
    >
      <img
        src="/codesinc-brand.png"
        alt="Designed and hosted by Codesinc."
        className="h-8 w-auto object-contain"
      />
    </a>
  );
};

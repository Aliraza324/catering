import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-2xl' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative z-10 w-full ${maxWidth} bg-white rounded-lg border border-[#e8eaec] overflow-hidden flex flex-col max-h-[92vh]`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 min-[360px]:px-4 sm:px-6 py-3 sm:py-4 border-b border-[#e8eaec] bg-[#f9fbfc]">
          <div>
            <h2 className="text-[15px] sm:text-[17px] font-semibold text-[#131416] leading-tight">{title}</h2>
            {subtitle && <p className="text-[12px] sm:text-[13px] text-[#5d5f60] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#5d5f60] hover:text-[#131416] hover:bg-[#ebedee] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="px-3.5 min-[360px]:px-4 sm:px-6 py-3.5 sm:py-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

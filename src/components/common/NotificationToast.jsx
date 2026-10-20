import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const NotificationToast = () => {
  const { notification } = useApp();

  if (!notification) return null;

  const isSuccess = notification.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#131416] text-white text-[13px] font-medium rounded-md border border-[#333] transition-opacity">
      {isSuccess ? (
        <CheckCircle2 className="w-4 h-4 text-[#1e7b4f] shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 text-[#c4242a] shrink-0" />
      )}
      <span>{notification.message}</span>
    </div>
  );
};

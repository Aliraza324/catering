import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { NotificationToast } from '../common/NotificationToast';
import { UserProfileModal } from '../modals/UserProfileModal';
import { KitchenLoader } from '../common/KitchenLoader';
import { useApp } from '../../context/AppContext';

export const AppShell = ({ children }) => {
  const { isGlobalLoading, setIsGlobalLoading, loadingMessage } = useApp();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f9fbfc] text-[#131416] flex flex-col">
      {/* Global Simulated Telemetry & Sync Loader */}
      {isGlobalLoading && (
        <KitchenLoader
          variant="fullscreen"
          label={loadingMessage}
          onComplete={() => setIsGlobalLoading(false)}
        />
      )}
      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:pl-[252px]">
        <TopBar
          onOpenMobile={() => setIsMobileOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        {/* Framed white sheet container */}
        <main className="flex-1 p-1.5 min-[380px]:p-2.5 sm:p-3 bg-[#f9fbfc] min-w-0">
          <div className="bg-white border border-[#e8eaec] rounded-lg sm:rounded-2xl p-2.5 min-[360px]:p-3.5 sm:p-6 md:p-8 min-h-[calc(100vh-4.5rem)] min-w-0 overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>

      <NotificationToast />

      {/* User Profile Console Dialog */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
};

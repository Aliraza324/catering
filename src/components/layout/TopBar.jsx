import React from 'react';
import { Menu, MapPin, Calendar, RotateCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TopBar = ({ onOpenMobile, onOpenProfile }) => {
  const { locations, selectedLocationId, setSelectedLocationId, triggerKitchenSync } = useApp();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-12 px-2.5 sm:px-4 md:px-6 bg-[#f9fbfc] border-b border-[#e8eaec]">
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
        <button
          onClick={onOpenMobile}
          className="p-1.5 rounded text-[#5d5f60] hover:text-[#131416] hover:bg-[#ebedee] lg:hidden shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Location selector */}
        <div className="flex items-center gap-1 sm:gap-1.5 text-[12px] sm:text-[13px] bg-white border border-[#e8eaec] rounded px-2 sm:px-2.5 py-1 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-[#1b6c80] shrink-0" />
          <span className="text-[#5d5f60] hidden sm:inline shrink-0">Facility:</span>
          <select
            value={selectedLocationId}
            onChange={(e) => setSelectedLocationId(e.target.value)}
            className="bg-transparent text-[#131416] font-medium focus:outline-none cursor-pointer text-[11px] min-[360px]:text-[12px] sm:text-[13px] max-w-[140px] min-[380px]:max-w-[200px] sm:max-w-none truncate"
          >
            <option value="all">All Kitchen Facilities (Central + Satellite)</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-2 sm:gap-3 text-[12px] sm:text-[13px]">
        <button
          type="button"
          onClick={() => triggerKitchenSync('Synchronizing multi-location commissary telemetry...')}
          className="hidden min-[520px]:flex items-center gap-1.5 text-[#5d5f60] hover:text-[#1b6c80] bg-white border border-[#e8eaec] hover:border-[#1b6c80] rounded px-2.5 py-1 transition-colors cursor-pointer text-[12px]"
          title="Trigger Live Kitchen Sync & Telemetry Loader"
        >
          <RotateCw className="w-3.5 h-3.5 text-[#1b6c80]" />
          <span>Sync Kitchens</span>
        </button>

        <div className="hidden md:flex items-center gap-1.5 text-[#5d5f60] bg-white border border-[#e8eaec] rounded px-2.5 py-1">
          <Calendar className="w-3.5 h-3.5 text-[#737678]" />
          <span>Tue, 20 Oct 2026</span>
          <span className="text-[#1e7b4f] font-semibold text-[11px]">• Live Shift</span>
        </div>

        <button
          type="button"
          onClick={onOpenProfile}
          className="flex items-center gap-2 pl-2 border-l border-[#e8eaec] hover:opacity-85 transition-opacity text-left cursor-pointer group rounded p-1 -mr-1"
          title="Open Officer Profile & Operations Console"
          aria-label="Open User Profile"
        >
          <div className="relative shrink-0">
            <div className="w-6.5 h-6.5 rounded-full bg-[#1b6c80] text-white flex items-center justify-center text-[10px] font-bold group-hover:ring-2 group-hover:ring-[#1b6c80]/30 transition-[box-shadow]">
              OP
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#1e7b4f] border border-white"
              title="Active Duty Shift"
            />
          </div>
          <div className="hidden sm:block text-left leading-tight">
            <span className="block font-medium text-[#131416] text-[12px] group-hover:text-[#1b6c80] transition-colors">
              Ops Control Room
            </span>
            <span className="block text-[11px] text-[#5d5f60]">New Delhi Base</span>
          </div>
        </button>
      </div>
    </header>
  );
};

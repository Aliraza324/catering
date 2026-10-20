import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  UtensilsCrossed,
  UserCheck,
  Flame,
  Boxes,
  ShoppingBag,
  ChefHat,
  Users,
  Receipt,
  Trash2,
  MapPin,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CodesincBadge } from '../common/CodesincBadge';

export const Sidebar = ({ isMobileOpen, onCloseMobile, onOpenProfile }) => {
  const { lowStockCount, resetDemoData } = useApp();

  const navGroups = [
    {
      group: 'Overview & Core',
      items: [
        { to: '/', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/kitchens', label: 'Kitchen Operations', icon: Flame },
        { to: '/locations', label: 'Multi-Location Hub', icon: MapPin },
      ],
    },
    {
      group: 'Corporate Dining',
      items: [
        { to: '/clients', label: 'Corporate Clients', icon: Building2 },
        { to: '/attendance', label: 'Meal Attendance', icon: UserCheck },
        { to: '/menus', label: 'Menu Planning', icon: UtensilsCrossed },
        { to: '/recipes', label: 'Recipes & Food Costing', icon: ChefHat },
      ],
    },
    {
      group: 'Supply & Controls',
      items: [
        {
          to: '/inventory',
          label: 'Inventory & Stock',
          icon: Boxes,
          badge: lowStockCount > 0 ? `${lowStockCount} low` : null,
          badgeVariant: 'warning',
        },
        { to: '/purchasing', label: 'Purchasing & Vendors', icon: ShoppingBag },
        { to: '/wastage', label: 'Wastage Monitoring', icon: Trash2 },
      ],
    },
    {
      group: 'Finance & Intelligence',
      items: [
        { to: '/billing', label: 'Sales & Client Billing', icon: Receipt },
        { to: '/staff', label: 'Staff & HR Payroll', icon: Users },
        {
          to: '/forecasting',
          label: 'AI Demand Forecast',
          icon: Sparkles,
          highlight: true,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-[252px] bg-[#f9fbfc] border-r border-[#e8eaec] transition-transform lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex flex-col px-5 py-4 border-b border-[#e8eaec]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#1b6c80] flex items-center justify-center text-white font-bold text-[14px] shrink-0 tracking-wider">
              AF
            </div>
            <div className="min-w-0">
              <span className="text-[14px] font-semibold text-[#131416] tracking-tight truncate block">
                ARAMYA FOODS
              </span>
              <span className="text-[11px] text-[#5d5f60] truncate block">
                Corporate Catering ERP
              </span>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#5d5f60] bg-[#f1f5f9] px-2.5 py-1 rounded">
            <span>FSSAI: 13320005000412</span>
            <span className="font-mono text-[10px] text-[#1b6c80]">v2.6</span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {navGroups.map((grp) => (
            <div key={grp.group}>
              <div className="px-2.5 mb-1.5 text-[11px] font-medium text-[#737678] tracking-wider uppercase">
                {grp.group}
              </div>
              <div className="space-y-0.5">
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors ${
                          isActive
                            ? 'bg-[#ebedee] text-[#131416] font-semibold'
                            : 'text-[#5d5f60] hover:text-[#131416] hover:bg-[#f4f6f8]'
                        } ${item.highlight ? 'border border-[#1b6c80]/20' : ''}`
                      }
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            item.highlight ? 'text-[#1b6c80]' : 'currentColor'
                          }`}
                          strokeWidth={1.75}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#fffbeb] text-[#92400e] border border-[#fef3c7]">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info & demo control */}
        <div className="p-3 border-t border-[#e8eaec] bg-[#f9fbfc] space-y-2">
          {/* Profile Card Trigger */}
          <button
            type="button"
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              if (onOpenProfile) onOpenProfile();
            }}
            className="w-full flex items-center gap-2.5 p-1.5 rounded-md hover:bg-[#ebedee] transition-colors text-left group cursor-pointer"
            title="Open Officer Profile"
          >
            <div className="relative shrink-0">
              <div className="w-7 h-7 rounded-full bg-[#1b6c80] text-white flex items-center justify-center text-[11px] font-bold group-hover:ring-2 group-hover:ring-[#1b6c80]/30 transition-[box-shadow]">
                OP
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#1e7b4f] border border-white" />
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <span className="block font-medium text-[#131416] text-[12px] truncate group-hover:text-[#1b6c80] transition-colors">
                Vikramaditya Sen
              </span>
              <span className="block text-[11px] text-[#5d5f60] truncate">
                Ops Control Room
              </span>
            </div>
          </button>

          <div className="px-2 py-1.5 bg-[#ffffff] border border-[#e8eaec] rounded text-[11px] text-[#5d5f60] flex items-center justify-between">
            <span>Demo Mode: Offline Mock</span>
            <span className="w-2 h-2 rounded-full bg-[#1e7b4f]" title="Active State Store" />
          </div>
          <button
            onClick={() => {
              if (window.confirm('Reset all demo records back to baseline specifications?')) {
                resetDemoData();
              }
            }}
            className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-[12px] text-[#5d5f60] hover:text-[#131416] hover:bg-[#ebedee] rounded border border-transparent hover:border-[#cdced1] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Records</span>
          </button>

          {/* Agency & Hosting Attribution */}
          <div className="pt-2 border-t border-[#e8eaec]">
            <CodesincBadge variant="sidebar" />
          </div>
        </div>
      </aside>
    </>
  );
};

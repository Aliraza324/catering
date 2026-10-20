import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { CodesincBadge } from '../common/CodesincBadge';
import {
  User,
  ShieldCheck,
  Clock,
  MapPin,
  Bell,
  Key,
  LogOut,
  Award,
  Building,
  Phone,
  Mail,
  FileCheck2,
  Check,
} from 'lucide-react';

export const UserProfileModal = ({ isOpen, onClose }) => {
  const { locations, notify } = useApp();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'shift', 'alerts', 'security'
  const [dutyStatus, setDutyStatus] = useState('On Active Duty');
  const [alerts, setAlerts] = useState({
    stockAlerts: true,
    wastageThresholds: true,
    clientHeadcountSurges: true,
    poDeliveries: false,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggleAlert = (key) => {
    setAlerts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSavedSuccess(true);
    notify({
      title: 'Profile Updated',
      message: 'Duty status and notification preferences updated successfully.',
      type: 'success',
    });
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const handleSimulateSignOut = () => {
    notify({
      title: 'Session Maintained (Demo Mode)',
      message: 'Profile sign-out simulated. Demo state remains preserved in local storage.',
      type: 'info',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Profile & Operations Console"
      subtitle="Officer credentials, kitchen access permissions and active duty station"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 text-[13px]">
        {/* User Card Hero */}
        <div className="flex flex-col min-[420px]:flex-row items-start min-[420px]:items-center gap-3.5 p-3.5 bg-[#f9fbfc] border border-[#e8eaec] rounded-lg">
          <div className="relative">
            <div className="w-13 h-13 rounded-full bg-[#1b6c80] text-white flex items-center justify-center text-[17px] font-bold tracking-wider shrink-0">
              OP
            </div>
            <span
              className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                dutyStatus === 'On Active Duty'
                  ? 'bg-[#1e7b4f]'
                  : dutyStatus === 'Quality Inspection'
                  ? 'bg-[#b45309]'
                  : 'bg-[#5d5f60]'
              }`}
              title={dutyStatus}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[16px] font-bold text-[#131416] tracking-tight">Vikramaditya Sen</h3>
              <Badge variant="positive">Active Duty</Badge>
              <Badge variant="neutral">Level 4 Admin</Badge>
            </div>
            <p className="text-[12px] text-[#5d5f60] mt-0.5">
              Chief Operations Controller & Institutional Catering Director
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] text-[#737678]">
              <span className="flex items-center gap-1">
                <Building className="w-3 h-3 text-[#1b6c80]" />
                Aramya Foods Pvt. Ltd.
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#1b6c80]" />
                New Delhi Commissary (Okhla Phase-II)
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap border-b border-[#e8eaec] gap-1 text-[12px] font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-[#1b6c80] text-[#1b6c80] font-semibold'
                : 'border-transparent text-[#5d5f60] hover:text-[#131416]'
            }`}
          >
            Overview & Credentials
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shift')}
            className={`px-3 py-2 border-b-2 transition-colors ${
              activeTab === 'shift'
                ? 'border-[#1b6c80] text-[#1b6c80] font-semibold'
                : 'border-transparent text-[#5d5f60] hover:text-[#131416]'
            }`}
          >
            Duty Shift & Facilities
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('alerts')}
            className={`px-3 py-2 border-b-2 transition-colors ${
              activeTab === 'alerts'
                ? 'border-[#1b6c80] text-[#1b6c80] font-semibold'
                : 'border-transparent text-[#5d5f60] hover:text-[#131416]'
            }`}
          >
            Alert Preferences
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-3 py-2 border-b-2 transition-colors ${
              activeTab === 'security'
                ? 'border-[#1b6c80] text-[#1b6c80] font-semibold'
                : 'border-transparent text-[#5d5f60] hover:text-[#131416]'
            }`}
          >
            Security & Session
          </button>
        </div>

        {/* Tab 1: Overview & Credentials */}
        {activeTab === 'overview' && (
          <div className="space-y-3.5 pt-1">
            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3 bg-[#f9fbfc] p-3 border border-[#e8eaec] rounded text-[12px]">
              <div>
                <span className="text-[#737678] block text-[11px]">Employee Identity Code</span>
                <span className="font-mono font-semibold text-[#131416]">AF-OPS-2024-001</span>
              </div>
              <div>
                <span className="text-[#737678] block text-[11px]">Official Work Email</span>
                <span className="font-mono text-[#131416] flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#1b6c80]" />
                  v.sen@aramyafoods.com
                </span>
              </div>
              <div>
                <span className="text-[#737678] block text-[11px]">Direct Operational Desk</span>
                <span className="font-mono text-[#131416] flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#1b6c80]" />
                  +91 11 4981 7700 (Ext 104)
                </span>
              </div>
              <div>
                <span className="text-[#737678] block text-[11px]">Reporting Executive</span>
                <span className="font-medium text-[#131416]">Anuradha Bose (VP Operations)</span>
              </div>
            </div>

            <div>
              <h4 className="text-[12px] font-semibold text-[#131416] mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#1b6c80]" />
                Food Safety & Industry Certifications
              </h4>
              <div className="space-y-2">
                <div className="p-2.5 bg-white border border-[#e8eaec] rounded flex items-start justify-between gap-2 text-[12px]">
                  <div>
                    <div className="font-medium text-[#131416]">FSSAI Food Safety Supervisor Certification</div>
                    <div className="text-[11px] text-[#5d5f60]">Lic No: FSSAI-DEL-13320005-SUP · Valid through Nov 2028</div>
                  </div>
                  <Badge variant="positive">Verified</Badge>
                </div>
                <div className="p-2.5 bg-white border border-[#e8eaec] rounded flex items-start justify-between gap-2 text-[12px]">
                  <div>
                    <div className="font-medium text-[#131416]">HACCP Level 3 Commercial Commissary Hygiene</div>
                    <div className="text-[11px] text-[#5d5f60]">Certified by Food Safety Standards Authority · High-Risk Catering</div>
                  </div>
                  <Badge variant="positive">Active</Badge>
                </div>
                <div className="p-2.5 bg-white border border-[#e8eaec] rounded flex items-start justify-between gap-2 text-[12px]">
                  <div>
                    <div className="font-medium text-[#131416]">Staff Health & Hygiene Annual Clearance</div>
                    <div className="text-[11px] text-[#5d5f60]">Mandatory FSSAI Form IX Medical Certificate on file</div>
                  </div>
                  <Badge variant="positive">Compliant</Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Duty Shift & Facilities */}
        {activeTab === 'shift' && (
          <div className="space-y-3.5 pt-1">
            <div className="p-3 bg-[#f9fbfc] border border-[#e8eaec] rounded space-y-2 text-[12px]">
              <div className="flex flex-col min-[380px]:flex-row min-[380px]:items-center justify-between gap-2">
                <div>
                  <span className="text-[#737678] block text-[11px]">Current Shift Status</span>
                  <span className="font-semibold text-[#131416]">{dutyStatus}</span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDutyStatus('On Active Duty')}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                      dutyStatus === 'On Active Duty'
                        ? 'bg-[#1e7b4f] text-white'
                        : 'bg-white border border-[#cdced1] text-[#5d5f60]'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setDutyStatus('Quality Inspection')}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                      dutyStatus === 'Quality Inspection'
                        ? 'bg-[#b45309] text-white'
                        : 'bg-white border border-[#cdced1] text-[#5d5f60]'
                    }`}
                  >
                    Auditing
                  </button>
                  <button
                    type="button"
                    onClick={() => setDutyStatus('Off Duty / Handover')}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                      dutyStatus === 'Off Duty / Handover'
                        ? 'bg-[#131416] text-white'
                        : 'bg-white border border-[#cdced1] text-[#5d5f60]'
                    }`}
                  >
                    Handover
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-[#e8eaec] flex items-center justify-between text-[11px] text-[#5d5f60]">
                <span>Active Shift Window:</span>
                <span className="font-mono font-medium text-[#131416]">
                  05:30 AM – 03:30 PM IST (Commissary Morning Run)
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-[12px] font-semibold text-[#131416] mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#1b6c80]" />
                Authorized Facility Nodes & Permissions
              </h4>
              <div className="space-y-1.5 text-[12px]">
                {locations.map((loc) => (
                  <div
                    key={loc.id}
                    className="p-2.5 bg-white border border-[#e8eaec] rounded flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-[#131416]">{loc.name}</div>
                      <div className="text-[11px] text-[#5d5f60]">
                        {loc.type} · Capacity: {loc.capacity.toLocaleString('en-IN')} portions/day
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-medium text-[#1e7b4f] px-2 py-0.5 bg-[#e8f5e9] rounded">
                      Full Dispatch
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Alert Preferences */}
        {activeTab === 'alerts' && (
          <div className="space-y-3 pt-1 text-[12px]">
            <p className="text-[12px] text-[#5d5f60]">
              Configure automated operational thresholds and supervisory alerts dispatched to your console.
            </p>

            <div className="space-y-2">
              <label
                onClick={() => handleToggleAlert('stockAlerts')}
                className="flex items-center justify-between p-3 bg-white border border-[#e8eaec] rounded cursor-pointer hover:bg-[#f9fbfc] transition-colors"
              >
                <div>
                  <div className="font-medium text-[#131416]">Low Inventory Thresholds</div>
                  <div className="text-[11px] text-[#5d5f60]">
                    Notify when central commissary ingredients dip below 2 days buffer
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={alerts.stockAlerts}
                  onChange={() => {}}
                  className="w-4 h-4 accent-[#1b6c80] cursor-pointer"
                />
              </label>

              <label
                onClick={() => handleToggleAlert('wastageThresholds')}
                className="flex items-center justify-between p-3 bg-white border border-[#e8eaec] rounded cursor-pointer hover:bg-[#f9fbfc] transition-colors"
              >
                <div>
                  <div className="font-medium text-[#131416]">Daily Food Wastage Breaches</div>
                  <div className="text-[11px] text-[#5d5f60]">
                    Flag any facility logging &gt; 25 kg or ₹1,000 unserved residuals
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={alerts.wastageThresholds}
                  onChange={() => {}}
                  className="w-4 h-4 accent-[#1b6c80] cursor-pointer"
                />
              </label>

              <label
                onClick={() => handleToggleAlert('clientHeadcountSurges')}
                className="flex items-center justify-between p-3 bg-white border border-[#e8eaec] rounded cursor-pointer hover:bg-[#f9fbfc] transition-colors"
              >
                <div>
                  <div className="font-medium text-[#131416]">Client Contract Meal Variances</div>
                  <div className="text-[11px] text-[#5d5f60]">
                    Alert when client attendance exceeds contracted count by &gt; 10%
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={alerts.clientHeadcountSurges}
                  onChange={() => {}}
                  className="w-4 h-4 accent-[#1b6c80] cursor-pointer"
                />
              </label>

              <label
                onClick={() => handleToggleAlert('poDeliveries')}
                className="flex items-center justify-between p-3 bg-white border border-[#e8eaec] rounded cursor-pointer hover:bg-[#f9fbfc] transition-colors"
              >
                <div>
                  <div className="font-medium text-[#131416]">Vendor Inward Dock Gate Passes</div>
                  <div className="text-[11px] text-[#5d5f60]">
                    Push dispatch alerts on PO shipments arriving at dock doors
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={alerts.poDeliveries}
                  onChange={() => {}}
                  className="w-4 h-4 accent-[#1b6c80] cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}

        {/* Tab 4: Security & Session */}
        {activeTab === 'security' && (
          <div className="space-y-3 pt-1 text-[12px]">
            <div className="p-3 bg-[#f9fbfc] border border-[#e8eaec] rounded space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[#5d5f60]">Single Sign-On Authority:</span>
                <span className="font-medium text-[#131416]">Aramya Foods Corporate Google SSO</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#5d5f60]">Two-Factor Authentication:</span>
                <span className="font-mono text-[#1e7b4f] font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Hardware Security Key (Enforced)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#5d5f60]">Session Origin IP:</span>
                <span className="font-mono text-[#131416]">103.21.144.18 (Okhla Leased Fiber)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#5d5f60]">Role Security Level:</span>
                <span className="font-medium text-[#131416]">Enterprise Operations Director (Tier 1)</span>
              </div>
            </div>

            {/* Platform Engineering & Hosting Attribution */}
            <div className="p-3 bg-white border border-[#e8eaec] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-semibold text-[#131416] block">Platform Infrastructure & Web Engineering</span>
                <span className="text-[11px] text-[#5d5f60]">Designed, deployed & hosted on high-availability cloud infrastructure.</span>
              </div>
              <CodesincBadge variant="footer" />
            </div>

            <div className="p-3 bg-[#fef2f2] border border-[#fecaca] rounded flex flex-col min-[400px]:flex-row min-[400px]:items-center justify-between gap-2.5">
              <div>
                <div className="font-semibold text-[#991b1b]">End Duty Session</div>
                <div className="text-[11px] text-[#7f1d1d]">
                  Release active shift locks and log out of the Operations Room console.
                </div>
              </div>
              <button
                type="button"
                onClick={handleSimulateSignOut}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#991b1b] text-white font-medium hover:bg-[#7f1d1d] transition-colors text-[12px] shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Simulate Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#e8eaec]">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded border border-[#cdced1] text-[#5d5f60] hover:text-[#131416] hover:bg-[#ebedee] transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleSave}
            style={{ color: '#ffffff', backgroundColor: '#131416' }}
            className="px-4 py-1.5 rounded bg-[#131416] text-white font-medium hover:bg-[#222] transition-colors"
          >
            <span style={{ color: '#ffffff' }} className="text-white">
              {savedSuccess ? 'Saved!' : 'Save Preferences'}
            </span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

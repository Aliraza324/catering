import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatINR, formatNumber } from '../utils/formatters';
import { Building2, Plus, Phone, Mail, MapPin, Download, Check, FileText } from 'lucide-react';
import { AddClientModal } from '../components/modals/AddClientModal';
import { Badge } from '../components/common/Badge';

export const ClientsPage = () => {
  const { clients } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(clients[0] || null);

  const handleDownloadContract = (client) => {
    const textContent = `ARAMYA FOODS PVT LTD - CORPORATE DINING SERVICE CONTRACT AGREEMENT\n\n` +
      `CLIENT: ${client.name} (${client.code})\n` +
      `SEGMENT: ${client.segment}\n` +
      `SITE ADDRESS: ${client.address}\n` +
      `SPOC: ${client.spoc} (${client.email} | ${client.phone})\n` +
      `GSTIN: ${client.gstin}\n` +
      `SERVICING FACILITY: ${client.assignedKitchenName}\n` +
      `CONTRACT TYPE: ${client.contractType}\n` +
      `BILLING CYCLE: ${client.billingCycle}\n\n` +
      `NEGOTIATED MEAL ALLOWANCES & RATES:\n` +
      `- Breakfast: ${client.mealLimits.breakfast} max pax @ ₹${client.mealRates.breakfast}/pax\n` +
      `- Lunch: ${client.mealLimits.lunch} max pax @ ₹${client.mealRates.lunch}/pax\n` +
      `- Dinner: ${client.mealLimits.dinner} max pax @ ₹${client.mealRates.dinner}/pax\n` +
      `- Snacks: ${client.mealLimits.snacks} max pax @ ₹${client.mealRates.snacks}/pax\n\n` +
      `MONTHLY SPEND CAP: ₹${client.monthlyBudgetCap.toLocaleString('en-IN')}\n\n` +
      `SIGNED ON BEHALF OF ARAMYA FOODS PVT LTD: Chef Rajesh Rawat, Director Culinary Ops\n`;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Contract_${client.code}_AramyaFoods.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#e8eaec]">
        <div>
          <h1 className="text-[22px] font-semibold text-[#131416] tracking-tight leading-tight">
            Corporate Client Accounts & Contracts
          </h1>
          <p className="text-[13.5px] text-[#5d5f60] mt-1">
            Contract terms, designated meal quotas, billing intervals and facility kitchen assignments
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 text-[12px] font-medium bg-[#131416] hover:bg-[#242629] text-white rounded transition-colors w-full sm:w-auto"
          style={{ color: '#ffffff' }}
        >
          <Plus className="w-4 h-4 text-white shrink-0" style={{ color: '#ffffff', stroke: '#ffffff' }} />
          <span className="text-white font-medium" style={{ color: '#ffffff' }}>Add Corporate Client</span>
        </button>
      </div>

      {/* Main Client Grid / Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Client Cards List */}
        <div className="space-y-3">
          <h2 className="text-[14px] font-semibold text-[#131416]">Active Client Portfolios ({clients.length})</h2>
          {clients.map((client) => {
            const isSelected = selectedClient?.id === client.id;
            return (
              <div
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  isSelected
                    ? 'border-[#1b6c80] bg-[#f9fbfc]'
                    : 'border-[#e8eaec] bg-white hover:border-[#cdced1]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono font-medium text-[#1b6c80]">{client.code}</span>
                    <h3 className="text-[15px] font-semibold text-[#131416] mt-0.5">{client.name}</h3>
                    <p className="text-[12px] text-[#5d5f60]">{client.segment}</p>
                  </div>
                  <Badge variant="positive">{client.status}</Badge>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#f0f1f2] grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[#5d5f60]">Headcount:</span>
                    <span className="font-mono font-semibold text-[#131416] ml-1">{client.headcount} pax</span>
                  </div>
                  <div>
                    <span className="text-[#5d5f60]">Billing:</span>
                    <span className="text-[#131416] ml-1">{client.billingCycle}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column: Selected Client In-Depth Contract Overview (2 Columns) */}
        {selectedClient && (
          <div className="lg:col-span-2 bg-white border border-[#e8eaec] rounded-lg p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 pb-4 border-b border-[#e8eaec]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-mono px-2 py-0.5 rounded bg-[#e6f3f6] text-[#1b6c80] font-medium">
                    {selectedClient.code}
                  </span>
                  <h2 className="text-[18px] font-bold text-[#131416]">{selectedClient.name}</h2>
                </div>
                <p className="text-[13px] text-[#5d5f60] mt-1">{selectedClient.address}</p>
              </div>

              <button
                onClick={() => handleDownloadContract(selectedClient)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium border border-[#cdced1] hover:bg-[#ebedee] text-[#131416] rounded transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-[#5d5f60]" />
                <span>Export Contract Terms</span>
              </button>
            </div>

            {/* Key Contact & Kitchen Assignment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#f9fbfc] p-4 border border-[#e8eaec] rounded-lg text-[13px]">
              <div>
                <span className="text-[11px] font-semibold text-[#737678] uppercase tracking-wider block mb-2">
                  Corporate SPOC & Details
                </span>
                <div className="space-y-1.5 text-[12px]">
                  <div className="font-semibold text-[#131416]">{selectedClient.spoc}</div>
                  <div className="flex items-center gap-2 text-[#5d5f60]">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{selectedClient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#5d5f60]">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{selectedClient.email}</span>
                  </div>
                  <div className="text-[11px] text-[#5d5f60] font-mono pt-1">
                    GSTIN: {selectedClient.gstin}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#737678] uppercase tracking-wider block mb-2">
                  Kitchen Node & Service Level
                </span>
                <div className="space-y-1.5 text-[12px]">
                  <div className="flex items-center gap-2 font-medium text-[#131416]">
                    <MapPin className="w-3.5 h-3.5 text-[#1b6c80]" />
                    <span>{selectedClient.assignedKitchenName}</span>
                  </div>
                  <div className="text-[#5d5f60]">Contract Format: <strong className="text-[#131416]">{selectedClient.contractType}</strong></div>
                  <div className="text-[#5d5f60]">Invoicing Terms: <strong className="text-[#131416]">{selectedClient.billingCycle}</strong></div>
                </div>
              </div>
            </div>

            {/* Negotiated Meal Caps & Tariff Table */}
            <div>
              <h3 className="text-[14px] font-semibold text-[#131416] mb-3">
                Daily Meal Entitlements & Unit Tariffs
              </h3>
              <div className="border border-[#e8eaec] rounded overflow-hidden">
                <table className="w-full text-left border-collapse text-[12px]">
                  <thead>
                    <tr className="bg-[#f9fbfc] border-b border-[#e8eaec] text-[#5d5f60] font-medium">
                      <th className="py-2.5 px-3">Meal Slot</th>
                      <th className="py-2.5 px-3 text-right">Daily Limit (Pax)</th>
                      <th className="py-2.5 px-3 text-right">Negotiated Rate / Pax</th>
                      <th className="py-2.5 px-3 text-right">Max Daily Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f1f2]">
                    <tr>
                      <td className="py-2.5 px-3 font-medium text-[#131416]">Morning Breakfast</td>
                      <td className="py-2.5 px-3 text-right font-mono">{selectedClient.mealLimits.breakfast}</td>
                      <td className="py-2.5 px-3 text-right font-mono">₹{selectedClient.mealRates.breakfast}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium">
                        {formatINR(selectedClient.mealLimits.breakfast * selectedClient.mealRates.breakfast)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-medium text-[#131416]">Lunch Executive Thali</td>
                      <td className="py-2.5 px-3 text-right font-mono">{selectedClient.mealLimits.lunch}</td>
                      <td className="py-2.5 px-3 text-right font-mono">₹{selectedClient.mealRates.lunch}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium">
                        {formatINR(selectedClient.mealLimits.lunch * selectedClient.mealRates.lunch)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-medium text-[#131416]">Evening High-Tea & Snacks</td>
                      <td className="py-2.5 px-3 text-right font-mono">{selectedClient.mealLimits.snacks}</td>
                      <td className="py-2.5 px-3 text-right font-mono">₹{selectedClient.mealRates.snacks}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium">
                        {formatINR(selectedClient.mealLimits.snacks * selectedClient.mealRates.snacks)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-medium text-[#131416]">Night Shift / Dinner</td>
                      <td className="py-2.5 px-3 text-right font-mono">{selectedClient.mealLimits.dinner}</td>
                      <td className="py-2.5 px-3 text-right font-mono">₹{selectedClient.mealRates.dinner}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium">
                        {formatINR(selectedClient.mealLimits.dinner * selectedClient.mealRates.dinner)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Monthly Budget Consumption Progress */}
            <div className="p-4 bg-[#f4f6f8] border border-[#e8eaec] rounded-lg">
              <div className="flex justify-between items-center text-[13px] mb-2">
                <span className="font-semibold text-[#131416]">Current Month Billing Progress</span>
                <span className="font-mono font-bold text-[#1b6c80]">
                  {formatINR(selectedClient.currentMonthConsumption)} / {formatINR(selectedClient.monthlyBudgetCap)}
                </span>
              </div>
              <div className="w-full bg-[#cdced1] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#1b6c80] h-full rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (selectedClient.currentMonthConsumption / selectedClient.monthlyBudgetCap) * 100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-[#5d5f60] mt-2">
                Budget adherence: {((selectedClient.currentMonthConsumption / selectedClient.monthlyBudgetCap) * 100).toFixed(1)}% of contracted cap consumed.
              </p>
            </div>
          </div>
        )}
      </div>

      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

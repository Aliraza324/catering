import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/formatters';

export const SalaryCalcModal = ({ isOpen, onClose, selectedStaff = null }) => {
  const { staff } = useApp();

  const [staffId, setStaffId] = useState(selectedStaff?.id || staff[0]?.id || '');
  const activeStaff = staff.find((s) => s.id === staffId) || staff[0];

  const [baseSalary, setBaseSalary] = useState(activeStaff ? activeStaff.baseSalary : 45000);
  const [allowances, setAllowances] = useState(activeStaff ? activeStaff.allowances : 5000);
  const [overtimeHours, setOvertimeHours] = useState(activeStaff ? activeStaff.overtimeHours : 10);
  const [overtimeRate, setOvertimeRate] = useState(activeStaff ? activeStaff.overtimeRate : 250);
  const [deductions, setDeductions] = useState(activeStaff ? activeStaff.deductions : 3200);

  const overtimePay = Number(overtimeHours) * Number(overtimeRate);
  const grossSalary = Number(baseSalary) + Number(allowances) + overtimePay;
  const netEstimatedSalary = Math.max(0, grossSalary - Number(deductions));

  const handleStaffChange = (id) => {
    setStaffId(id);
    const s = staff.find((m) => m.id === id);
    if (s) {
      setBaseSalary(s.baseSalary);
      setAllowances(s.allowances);
      setOvertimeHours(s.overtimeHours);
      setOvertimeRate(s.overtimeRate);
      setDeductions(s.deductions);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Staff Compensation & Net Salary Calculator"
      subtitle="Interactive browser-side calculation of earnings, overtime pay, deductions and net disbursals"
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-[13px]">
        <div>
          <label className="block text-[#5d5f60] mb-1 font-medium">Select Staff Member</label>
          <select
            value={staffId}
            onChange={(e) => handleStaffChange(e.target.value)}
            className="w-full px-3 py-1.5 border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none bg-white text-[12px]"
          >
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.role} ({s.locationName})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3">
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Base Salary (₹)</label>
            <input
              type="number"
              min="0"
              value={baseSalary}
              onChange={(e) => setBaseSalary(Number(e.target.value))}
              className="w-full px-3 py-1.5 border border-[#cdced1] rounded font-mono"
            />
          </div>
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Monthly Allowances (₹)</label>
            <input
              type="number"
              min="0"
              value={allowances}
              onChange={(e) => setAllowances(Number(e.target.value))}
              className="w-full px-3 py-1.5 border border-[#cdced1] rounded font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3 bg-[#f9fbfc] p-3 border border-[#e8eaec] rounded">
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Overtime Hours</label>
            <input
              type="number"
              min="0"
              value={overtimeHours}
              onChange={(e) => setOvertimeHours(Number(e.target.value))}
              className="w-full px-2 py-1 border border-[#cdced1] rounded font-mono"
            />
          </div>
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Overtime Rate / Hr (₹)</label>
            <input
              type="number"
              min="0"
              value={overtimeRate}
              onChange={(e) => setOvertimeRate(Number(e.target.value))}
              className="w-full px-2 py-1 border border-[#cdced1] rounded font-mono"
            />
          </div>
          <div className="min-[360px]:col-span-2 flex flex-col min-[360px]:flex-row justify-between gap-1 text-[11px] text-[#5d5f60] pt-1">
            <span>Computed Overtime Earnings:</span>
            <span className="font-mono font-medium text-[#131416]">{formatINR(overtimePay)}</span>
          </div>
        </div>

        <div>
          <label className="block text-[#5d5f60] mb-1 font-medium">
            Total Deductions (PF, ESI & Statutory TDS) (₹)
          </label>
          <input
            type="number"
            min="0"
            value={deductions}
            onChange={(e) => setDeductions(Number(e.target.value))}
            className="w-full px-3 py-1.5 border border-[#cdced1] rounded font-mono"
          />
        </div>

        {/* Calculation Result Breakdown */}
        <div className="p-3 bg-[#f4f6f8] border border-[#e8eaec] rounded space-y-1.5 text-[12px]">
          <div className="flex justify-between">
            <span className="text-[#5d5f60]">Gross Earnings:</span>
            <span className="font-mono font-medium text-[#131416]">{formatINR(grossSalary)}</span>
          </div>
          <div className="flex justify-between text-[#c4242a]">
            <span>Statutory Deductions:</span>
            <span className="font-mono">- {formatINR(deductions)}</span>
          </div>
          <div className="flex justify-between pt-1.5 border-t border-[#e8eaec] font-bold text-[14px]">
            <span className="text-[#131416]">Net Estimated Disbursal:</span>
            <span className="font-mono text-[#1b6c80]">{formatINR(netEstimatedSalary)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#e8eaec]">
          <button
            type="button"
            onClick={onClose}
            style={{ color: '#ffffff', backgroundColor: '#131416' }}
            className="px-4 py-1.5 rounded bg-[#131416] text-white font-medium hover:bg-[#222] transition-colors"
          >
            <span style={{ color: '#ffffff' }} className="text-white">Done</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

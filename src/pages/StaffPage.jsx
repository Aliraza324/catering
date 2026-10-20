import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/formatters';
import { Users, Calculator, CheckCircle2, Clock, Award, ShieldCheck } from 'lucide-react';
import { SalaryCalcModal } from '../components/modals/SalaryCalcModal';
import { Badge } from '../components/common/Badge';

export const StaffPage = () => {
  const { staff } = useApp();
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);

  const handleOpenSalaryCalc = (member) => {
    setSelectedStaff(member);
    setIsSalaryModalOpen(true);
  };

  const totalPayrollEst = staff.reduce((acc, s) => {
    const overtime = (s.overtimeHours || 0) * (s.overtimeRate || 0);
    const gross = (s.baseSalary || 0) + (s.allowances || 0) + overtime;
    const net = gross - (s.deductions || 0);
    return acc + net;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#e8eaec]">
        <div>
          <h1 className="text-[22px] font-semibold text-[#131416] tracking-tight leading-tight">
            Kitchen Staff, Culinary Personnel & HR Payroll
          </h1>
          <p className="text-[13.5px] text-[#5d5f60] mt-1">
            Executive culinary brigade, HACCP hygiene compliance records, overtime computations and compensation disbursals
          </p>
        </div>

        <button
          onClick={() => handleOpenSalaryCalc(staff[0])}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 text-[12px] font-medium bg-[#131416] hover:bg-[#242629] text-white rounded transition-colors w-full sm:w-auto"
          style={{ color: '#ffffff' }}
        >
          <Calculator className="w-4 h-4 text-white shrink-0" style={{ color: '#ffffff', stroke: '#ffffff' }} />
          <span className="text-white font-medium" style={{ color: '#ffffff' }}>Open Salary & Overtime Calculator</span>
        </button>
      </div>

      {/* Staff Payroll KPI Strip */}
      <div className="grid grid-cols-1 min-[360px]:grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-white border border-[#e8eaec] rounded p-3.5">
          <span className="text-[11px] font-medium text-[#5d5f60]">Active Staff Brigade</span>
          <div className="text-[22px] font-bold text-[#131416] font-mono mt-1">
            {staff.length} Members
          </div>
          <span className="text-[11px] text-[#1e7b4f]">100% on duty today</span>
        </div>

        <div className="bg-white border border-[#e8eaec] rounded p-3.5">
          <span className="text-[11px] font-medium text-[#5d5f60]">Est. Monthly Payroll Net</span>
          <div className="text-[22px] font-bold text-[#1b6c80] font-mono mt-1">
            {formatINR(totalPayrollEst)}
          </div>
          <span className="text-[11px] text-[#5d5f60]">Includes overtime & statutory PF</span>
        </div>

        <div className="bg-white border border-[#e8eaec] rounded p-3.5">
          <span className="text-[11px] font-medium text-[#5d5f60]">HACCP Hygiene Index</span>
          <div className="text-[22px] font-bold text-[#1e7b4f] font-mono mt-1">
            97.8%
          </div>
          <span className="text-[11px] text-[#5d5f60]">FSSAI medical clearance verified</span>
        </div>

        <div className="bg-white border border-[#e8eaec] rounded p-3.5">
          <span className="text-[11px] font-medium text-[#5d5f60]">Overtime Hours (MTD)</span>
          <div className="text-[22px] font-bold text-[#131416] font-mono mt-1">
            88.0 Hrs
          </div>
          <span className="text-[11px] text-[#5d5f60]">Shift peak support</span>
        </div>
      </div>

      {/* Staff Roster Table */}
      <div className="bg-white border border-[#e8eaec] rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-[#e8eaec] bg-[#f9fbfc] flex items-center justify-between">
          <h2 className="text-[14px] font-semibold text-[#131416]">
            Culinary Brigade & Operations Directory ({staff.length})
          </h2>
          <span className="text-[11px] text-[#5d5f60]">Click "Calc Salary" to launch interactive earnings sandbox</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="bg-[#f9fbfc] border-b border-[#e8eaec] text-[#5d5f60] font-medium">
                <th className="py-2.5 px-3">Staff Name</th>
                <th className="py-2.5 px-3">Role & Title</th>
                <th className="py-2.5 px-3">Station Facility</th>
                <th className="py-2.5 px-3">Assigned Shift</th>
                <th className="py-2.5 px-3 text-right">Base Salary (₹)</th>
                <th className="py-2.5 px-3 text-right">Overtime Hrs</th>
                <th className="py-2.5 px-3 text-right">Net Estimated (₹)</th>
                <th className="py-2.5 px-3">Hygiene Score</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f1f2]">
              {staff.map((member) => {
                const overtime = member.overtimeHours * member.overtimeRate;
                const net = member.baseSalary + member.allowances + overtime - member.deductions;

                return (
                  <tr key={member.id} className="hover:bg-[#f9fbfc]">
                    <td className="py-3 px-3 font-semibold text-[#131416]">
                      {member.name}
                      <span className="block text-[11px] text-[#5d5f60] font-normal font-mono">
                        {member.attendanceToday}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-[#131416]">{member.role}</td>
                    <td className="py-3 px-3 text-[#5d5f60]">{member.locationName}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#5d5f60]">{member.shift}</td>
                    <td className="py-3 px-3 text-right font-mono font-medium text-[#131416]">
                      {formatINR(member.baseSalary)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-[#5d5f60]">
                      {member.overtimeHours} hrs
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#1b6c80]">
                      {formatINR(net)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#1e7b4f]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{member.complianceScore}%</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleOpenSalaryCalc(member)}
                        className="px-2.5 py-1 text-[11px] font-medium border border-[#cdced1] hover:bg-[#ebedee] text-[#131416] rounded transition-colors"
                      >
                        Calc Salary
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <SalaryCalcModal
        isOpen={isSalaryModalOpen}
        onClose={() => {
          setIsSalaryModalOpen(false);
          setSelectedStaff(null);
        }}
        selectedStaff={selectedStaff}
      />
    </div>
  );
};

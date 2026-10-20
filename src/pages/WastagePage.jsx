import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatINR, formatDate } from '../utils/formatters';
import { Trash2, Plus, AlertTriangle, Lightbulb, PieChart, TrendingDown } from 'lucide-react';
import { LogWastageModal } from '../components/modals/LogWastageModal';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const WastagePage = () => {
  const { wastageLogs, totalWastageCostToday, totalWastageKgToday } = useApp();
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Group wastage by reason
  const reasonSummary = wastageLogs.reduce((acc, log) => {
    const reason = log.reason.split('(')[0].trim();
    acc[reason] = (acc[reason] || 0) + log.quantityKg;
    return acc;
  }, {});

  const reasonChartData = Object.entries(reasonSummary).map(([reason, kg]) => ({
    reason,
    kg: Number(kg.toFixed(1)),
  }));

  const totalAllTimeKg = wastageLogs.reduce((acc, l) => acc + l.quantityKg, 0);
  const totalAllTimeCost = wastageLogs.reduce((acc, l) => acc + l.totalCost, 0);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#e8eaec]">
        <div>
          <h1 className="text-[22px] font-semibold text-[#131416] tracking-tight leading-tight">
            Food Wastage Monitoring & Yield Loss Auditing
          </h1>
          <p className="text-[13.5px] text-[#5d5f60] mt-1">
            Tracking prep trimmings, cafeteria surplus, composting diversions and smart batch buffer recommendations
          </p>
        </div>

        <button
          onClick={() => setIsLogModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 text-[12px] font-medium bg-[#131416] hover:bg-[#242629] text-white rounded transition-colors w-full sm:w-auto"
          style={{ color: '#ffffff' }}
        >
          <Plus className="w-4 h-4 text-white shrink-0" style={{ color: '#ffffff', stroke: '#ffffff' }} />
          <span className="text-white font-medium" style={{ color: '#ffffff' }}>Log Food Wastage Entry</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 min-[360px]:grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-white border border-[#e8eaec] rounded p-3.5">
          <span className="text-[11px] font-medium text-[#5d5f60]">Today's Recorded Wastage</span>
          <div className="text-[22px] font-bold text-[#c4242a] font-mono mt-1">
            {totalWastageKgToday.toFixed(1)} kg
          </div>
          <span className="text-[11px] text-[#5d5f60]">Est. Cost: {formatINR(totalWastageCostToday)}</span>
        </div>

        <div className="bg-white border border-[#e8eaec] rounded p-3.5">
          <span className="text-[11px] font-medium text-[#5d5f60]">Benchmark Wastage Ratio</span>
          <div className="text-[22px] font-bold text-[#1e7b4f] font-mono mt-1">
            1.4%
          </div>
          <span className="text-[11px] text-[#1e7b4f]">Industry average: 3.8%</span>
        </div>

        <div className="bg-white border border-[#e8eaec] rounded p-3.5">
          <span className="text-[11px] font-medium text-[#5d5f60]">Total Cycle Loss Logged</span>
          <div className="text-[22px] font-bold text-[#131416] font-mono mt-1">
            {totalAllTimeKg.toFixed(1)} kg
          </div>
          <span className="text-[11px] text-[#5d5f60]">Total Value: {formatINR(totalAllTimeCost)}</span>
        </div>

        <div className="bg-white border border-[#e8eaec] rounded p-3.5">
          <span className="text-[11px] font-medium text-[#5d5f60]">Composting & NGO Diversion</span>
          <div className="text-[22px] font-bold text-[#1b6c80] font-mono mt-1">
            94.0%
          </div>
          <span className="text-[11px] text-[#5d5f60]">Zero direct landfill disposal</span>
        </div>
      </div>

      {/* Chart and AI Recommendation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Wastage by Cause Chart */}
        <div className="lg:col-span-2 bg-white border border-[#e8eaec] rounded-lg p-5">
          <div className="pb-3 mb-4 border-b border-[#e8eaec]">
            <h2 className="text-[15px] font-semibold text-[#131416]">Wastage Decomposition by Primary Root Cause</h2>
            <p className="text-[12px] text-[#5d5f60]">Weight in kg recorded across production and cafeteria plate clearance</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reasonChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f1f2" />
                <XAxis dataKey="reason" tick={{ fontSize: 11, fill: '#5d5f60' }} axisLine={{ stroke: '#e8eaec' }} />
                <YAxis tick={{ fontSize: 11, fill: '#5d5f60' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#131416', color: '#fff', borderRadius: '4px', border: 'none', fontSize: '12px' }}
                  formatter={(val) => [`${val} kg`, 'Wastage Recorded']}
                />
                <Bar dataKey="kg" fill="#c4242a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Rule-Based Recommendations */}
        <div className="bg-white border border-[#e8eaec] rounded-lg p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#e8eaec]">
              <Lightbulb className="w-4 h-4 text-[#a86f0c]" />
              <h2 className="text-[14px] font-semibold text-[#131416]">Culinary Waste Reduction Protocols</h2>
            </div>

            <div className="space-y-3 text-[12px]">
              <div className="p-3 bg-[#fffbeb] border border-[#fef3c7] rounded">
                <span className="font-semibold text-[#92400e] block mb-1">
                  1. Friday Lunch Buffer Trimming (-12%)
                </span>
                <p className="text-[#78350f]">
                  Remote WFH attendance drops cafeteria headcounts by 21% on Fridays. Trim rice & dal prep batches by 12% to prevent afternoon surplus.
                </p>
              </div>

              <div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded">
                <span className="font-semibold text-[#166534] block mb-1">
                  2. Onion & Root Vegetable Peeling Yield
                </span>
                <p className="text-[#14532d]">
                  Automated potato peeler blade re-calibration completed at Central Commissary. Expected peeling trim recovery +4.2 kg daily.
                </p>
              </div>

              <div className="p-3 bg-[#f9fbfc] border border-[#e8eaec] rounded">
                <span className="font-semibold text-[#131416] block mb-1">
                  3. FeedIndia NGO Food Donation
                </span>
                <p className="text-[#5d5f60]">
                  Clean untouched hot dishes dispatched to licensed partner charity within 90 minutes of cafeteria closing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wastage Logs Table */}
      <div className="bg-white border border-[#e8eaec] rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-[#e8eaec] bg-[#f9fbfc]">
          <h2 className="text-[14px] font-semibold text-[#131416]">Logged Food Wastage Events</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="bg-[#f9fbfc] border-b border-[#e8eaec] text-[#5d5f60] font-medium">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Kitchen Facility</th>
                <th className="py-2.5 px-3">Meal Slot</th>
                <th className="py-2.5 px-3">Food Item / Surplus</th>
                <th className="py-2.5 px-3 text-right">Weight (kg)</th>
                <th className="py-2.5 px-3 text-right">Est. Loss (₹)</th>
                <th className="py-2.5 px-3">Root Cause</th>
                <th className="py-2.5 px-3">Diversion Channel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f1f2]">
              {wastageLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#f9fbfc]">
                  <td className="py-2.5 px-3 font-mono text-[#5d5f60]">{formatDate(log.date)}</td>
                  <td className="py-2.5 px-3 text-[#5d5f60]">{log.kitchenName}</td>
                  <td className="py-2.5 px-3 font-medium text-[#131416]">{log.mealType}</td>
                  <td className="py-2.5 px-3 font-semibold text-[#131416]">{log.foodItem}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-[#c4242a]">
                    {log.quantityKg.toFixed(1)} kg
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-[#131416]">
                    {formatINR(log.totalCost)}
                  </td>
                  <td className="py-2.5 px-3 text-[#5d5f60]">{log.reason}</td>
                  <td className="py-2.5 px-3 text-[11px] text-[#1e7b4f]">{log.disposalMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <LogWastageModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatINR, formatNumber, formatPercent } from '../utils/formatters';
import {
  Utensils,
  Building2,
  TrendingUp,
  AlertTriangle,
  Receipt,
  Trash2,
  Plus,
  ArrowUpRight,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { StockTransactionModal } from '../components/modals/StockTransactionModal';
import { LogWastageModal } from '../components/modals/LogWastageModal';
import { RecordPaymentModal } from '../components/modals/RecordPaymentModal';
import { Badge } from '../components/common/Badge';

export const DashboardPage = () => {
  const {
    clients,
    locations,
    selectedLocationId,
    kitchenBatches,
    ingredients,
    invoices,
    wastageLogs,
    dailyTrends,
    totalMealsServedToday,
    totalMealsPlannedToday,
    totalOutstandingBalance,
    totalWastageCostToday,
    totalWastageKgToday,
    lowStockCount,
  } = useApp();

  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isWastageModalOpen, setIsWastageModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState('meals'); // 'meals', 'financials', 'wastage'

  // Filter batches by selected facility
  const filteredBatches =
    selectedLocationId === 'all'
      ? kitchenBatches
      : kitchenBatches.filter((b) => b.kitchenId === selectedLocationId);

  // Financial aggregates today (from latest day in dailyTrends: Oct 20)
  const todayTrend = dailyTrends[dailyTrends.length - 1] || {
    sales: 284500,
    foodCost: 88200,
    profit: 89400,
  };

  const estimatedGrossProfit = todayTrend.sales - todayTrend.foodCost;
  const grossMargin = ((estimatedGrossProfit / todayTrend.sales) * 100).toFixed(1);

  // Filter low stock items
  const lowStockIngredients = ingredients.filter((i) => i.currentStock <= i.minThreshold);

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#e8eaec]">
        <div>
          <h1 className="text-[22px] font-semibold text-[#131416] tracking-tight leading-tight">
            Corporate Operations Overview
          </h1>
          <p className="text-[13.5px] text-[#5d5f60] mt-1">
            Real-time meal fulfillment, central commissary batching, inventory health and financial metrics
          </p>
        </div>

        {/* Quick actions: responsive grid on small screens, flex on larger screens */}
        <div className="grid grid-cols-1 min-[420px]:grid-cols-3 sm:flex sm:items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsStockModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 text-[12px] font-medium border border-[#cdced1] hover:bg-[#ebedee] text-[#131416] rounded transition-colors w-full sm:w-auto"
          >
            <Plus className="w-3.5 h-3.5 text-[#5d5f60] shrink-0" />
            <span>Inward / Issue Stock</span>
          </button>
          <button
            onClick={() => setIsWastageModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 text-[12px] font-medium border border-[#cdced1] hover:bg-[#ebedee] text-[#131416] rounded transition-colors w-full sm:w-auto"
          >
            <Trash2 className="w-3.5 h-3.5 text-[#737678] shrink-0" />
            <span>Log Wastage</span>
          </button>
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 text-[12px] font-medium bg-[#131416] hover:bg-[#242629] text-white rounded transition-colors w-full sm:w-auto"
            style={{ color: '#ffffff' }}
          >
            <Receipt className="w-3.5 h-3.5 text-white shrink-0" style={{ color: '#ffffff', stroke: '#ffffff' }} />
            <span className="text-white font-medium" style={{ color: '#ffffff' }}>Record Payment</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid: 1 col on 320px, 2 col on >=360px, 3 col on md, 6 col on lg */}
      <div className="grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {/* KPI 1: Meals Served Today */}
        <div className="bg-white border border-[#e8eaec] rounded p-3.5 flex flex-col justify-between">
          <span className="text-[12px] font-medium text-[#5d5f60]">Meals Served Today</span>
          <div className="my-1.5">
            <span className="text-[24px] font-bold text-[#131416] font-mono tracking-tight">
              {formatNumber(totalMealsServedToday)}
            </span>
            <span className="text-[11px] text-[#5d5f60] ml-1">/ {formatNumber(totalMealsPlannedToday)}</span>
          </div>
          <div className="text-[11px] text-[#1e7b4f] font-medium">
            {formatPercent((totalMealsServedToday / totalMealsPlannedToday) * 100, 0)} fulfilled
          </div>
        </div>

        {/* KPI 2: Active Clients & Hubs */}
        <div className="bg-white border border-[#e8eaec] rounded p-3.5 flex flex-col justify-between">
          <span className="text-[12px] font-medium text-[#5d5f60]">Corporate Clients</span>
          <div className="my-1.5">
            <span className="text-[24px] font-bold text-[#131416] font-mono tracking-tight">
              {clients.length}
            </span>
            <span className="text-[11px] text-[#5d5f60] ml-1">({locations.length} Kitchens)</span>
          </div>
          <Link to="/clients" className="text-[11px] text-[#1b6c80] hover:underline font-medium">
            View contract limits →
          </Link>
        </div>

        {/* KPI 3: Daily Sales Revenue */}
        <div className="bg-white border border-[#e8eaec] rounded p-3.5 flex flex-col justify-between">
          <span className="text-[12px] font-medium text-[#5d5f60]">Est. Daily Revenue</span>
          <div className="my-1.5">
            <span className="text-[22px] font-bold text-[#131416] font-mono tracking-tight">
              {formatINR(todayTrend.sales)}
            </span>
          </div>
          <div className="text-[11px] text-[#1e7b4f] font-medium">
            Food Cost: {formatINR(todayTrend.foodCost)}
          </div>
        </div>

        {/* KPI 4: Estimated Profit & Margin */}
        <div className="bg-white border border-[#e8eaec] rounded p-3.5 flex flex-col justify-between">
          <span className="text-[12px] font-medium text-[#5d5f60]">Estimated Gross Profit</span>
          <div className="my-1.5">
            <span className="text-[22px] font-bold text-[#1b6c80] font-mono tracking-tight">
              {formatINR(estimatedGrossProfit)}
            </span>
          </div>
          <div className="text-[11px] text-[#1e7b4f] font-medium">
            Margin: {grossMargin}% (Target: &gt;28%)
          </div>
        </div>

        {/* KPI 5: Stock Low Alerts */}
        <div className="bg-white border border-[#e8eaec] rounded p-3.5 flex flex-col justify-between">
          <span className="text-[12px] font-medium text-[#5d5f60]">Inventory Stock Alerts</span>
          <div className="my-1.5">
            <span className={`text-[24px] font-bold font-mono tracking-tight ${lowStockCount > 0 ? 'text-[#c4242a]' : 'text-[#131416]'}`}>
              {lowStockCount}
            </span>
            <span className="text-[11px] text-[#5d5f60] ml-1">items critical</span>
          </div>
          <Link to="/inventory" className="text-[11px] text-[#c4242a] hover:underline font-medium">
            Reorder thresholds →
          </Link>
        </div>

        {/* KPI 6: Food Wastage Today */}
        <div className="bg-white border border-[#e8eaec] rounded p-3.5 flex flex-col justify-between">
          <span className="text-[12px] font-medium text-[#5d5f60]">Food Wastage Today</span>
          <div className="my-1.5">
            <span className="text-[24px] font-bold text-[#131416] font-mono tracking-tight">
              {totalWastageKgToday.toFixed(1)}
            </span>
            <span className="text-[11px] text-[#5d5f60] ml-1">kg ({formatINR(totalWastageCostToday)})</span>
          </div>
          <div className="text-[11px] text-[#737678]">
            1.4% of total daily prep
          </div>
        </div>
      </div>

      {/* Main Trends Chart & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Card (2 Columns) */}
        <div className="lg:col-span-2 bg-white border border-[#e8eaec] rounded-lg p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-[#e8eaec] gap-2">
            <div>
              <h2 className="text-[15px] font-semibold text-[#131416]">7-Day Operational Trends</h2>
              <p className="text-[12px] text-[#5d5f60]">Historical meal volume, sales revenue, and food wastage across both facilities</p>
            </div>

            {/* Segmented Chart Series Tabs */}
            <div className="flex bg-[#f4f6f8] p-0.5 rounded border border-[#cdced1] self-start sm:self-auto text-[11px]">
              <button
                onClick={() => setActiveChartTab('meals')}
                className={`px-3 py-1 font-medium rounded transition-colors ${
                  activeChartTab === 'meals' ? 'bg-white text-[#131416]' : 'text-[#5d5f60] hover:text-[#131416]'
                }`}
              >
                Meal Count
              </button>
              <button
                onClick={() => setActiveChartTab('financials')}
                className={`px-3 py-1 font-medium rounded transition-colors ${
                  activeChartTab === 'financials' ? 'bg-white text-[#131416]' : 'text-[#5d5f60] hover:text-[#131416]'
                }`}
              >
                Sales & Profit (₹)
              </button>
              <button
                onClick={() => setActiveChartTab('wastage')}
                className={`px-3 py-1 font-medium rounded transition-colors ${
                  activeChartTab === 'wastage' ? 'bg-white text-[#131416]' : 'text-[#5d5f60] hover:text-[#131416]'
                }`}
              >
                Wastage (kg)
              </button>
            </div>
          </div>

          {/* Chart Canvas */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {activeChartTab === 'meals' ? (
                <BarChart data={dailyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f1f2" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#5d5f60' }} axisLine={{ stroke: '#e8eaec' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#5d5f60' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#131416', color: '#fff', borderRadius: '4px', border: 'none', fontSize: '12px' }}
                    formatter={(val) => [`${val.toLocaleString()} meals`, 'Served']}
                  />
                  <Bar dataKey="mealsServed" fill="#1b6c80" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : activeChartTab === 'financials' ? (
                <LineChart data={dailyTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f1f2" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#5d5f60' }} axisLine={{ stroke: '#e8eaec' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#5d5f60' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#131416', color: '#fff', borderRadius: '4px', border: 'none', fontSize: '12px' }}
                    formatter={(val, name) => [formatINR(val), name === 'sales' ? 'Daily Sales' : 'Gross Profit']}
                  />
                  <Line type="monotone" dataKey="sales" stroke="#1b6c80" strokeWidth={2} dot={{ r: 3 }} name="sales" />
                  <Line type="monotone" dataKey="profit" stroke="#1e7b4f" strokeWidth={2} dot={{ r: 3 }} name="profit" />
                </LineChart>
              ) : (
                <BarChart data={dailyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f1f2" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#5d5f60' }} axisLine={{ stroke: '#e8eaec' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#5d5f60' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#131416', color: '#fff', borderRadius: '4px', border: 'none', fontSize: '12px' }}
                    formatter={(val) => [`${val} kg`, 'Wastage']}
                  />
                  <Bar dataKey="wastageKg" fill="#c4242a" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#5d5f60] pt-3 border-t border-[#e8eaec] mt-2">
            <span>Peak Day: Wednesday (2,620 meals)</span>
            <span>Remote WFH Dip: Friday (2,040 meals)</span>
            <span>Avg Plate Cost: ₹34.80</span>
          </div>
        </div>

        {/* Side Panel: Urgent Alerts & Invoices Due */}
        <div className="bg-white border border-[#e8eaec] rounded-lg p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#e8eaec]">
              <h2 className="text-[14px] font-semibold text-[#131416]">Critical Stock & Supply Alerts</h2>
              <span className="text-[11px] font-mono text-[#c4242a]">{lowStockIngredients.length} Items</span>
            </div>

            <div className="space-y-2.5">
              {lowStockIngredients.length > 0 ? (
                lowStockIngredients.map((ing) => (
                  <div key={ing.id} className="p-2.5 bg-[#fef2f2] border border-[#fecaca] rounded flex items-center justify-between text-[12px]">
                    <div>
                      <span className="font-semibold text-[#991b1b] block">{ing.name}</span>
                      <span className="text-[11px] text-[#7f1d1d]">
                        In Stock: <strong className="font-mono">{ing.currentStock} {ing.unit}</strong> (Min: {ing.minThreshold} {ing.unit})
                      </span>
                    </div>
                    <button
                      onClick={() => setIsStockModalOpen(true)}
                      className="px-2 py-1 text-[11px] font-medium bg-white text-[#991b1b] border border-[#fecaca] rounded hover:bg-[#fee2e2]"
                    >
                      Inward
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-[12px] text-[#1e7b4f] p-3 bg-[#f0fdf4] rounded border border-[#bbf7d0]">
                  All inventory items are currently above safety threshold levels.
                </div>
              )}
            </div>
          </div>

          {/* Pending Invoices Strip */}
          <div className="pt-3 border-t border-[#e8eaec]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-semibold text-[#131416]">Pending Corporate Receivables</span>
              <span className="font-mono text-[13px] font-bold text-[#c4242a]">
                {formatINR(totalOutstandingBalance)}
              </span>
            </div>
            <p className="text-[11px] text-[#5d5f60] mb-2.5">
              2 corporate invoices awaiting end-of-cycle bank reconciliation.
            </p>
            <Link
              to="/billing"
              className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 text-[12px] font-medium border border-[#cdced1] hover:bg-[#f4f6f8] text-[#131416] rounded transition-colors"
            >
              <span>Manage Invoices & Remittances</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#5d5f60]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Live Kitchen Production Batches Today */}
      <div className="bg-white border border-[#e8eaec] rounded-lg p-5">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e8eaec]">
          <div>
            <h2 className="text-[15px] font-semibold text-[#131416]">Active Kitchen Batches Today</h2>
            <p className="text-[12px] text-[#5d5f60]">Cooking stages, temperature probes, and dispatch schedules</p>
          </div>
          <Link to="/kitchens" className="text-[12px] text-[#1b6c80] hover:underline font-medium">
            View full kitchen line →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-[#e8eaec] text-[#5d5f60] font-medium">
                <th className="py-2 px-2.5">Recipe Dish</th>
                <th className="py-2 px-2.5">Kitchen Facility</th>
                <th className="py-2 px-2.5">Target Client</th>
                <th className="py-2 px-2.5">Meal Slot</th>
                <th className="py-2 px-2.5 text-right">Planned Pax</th>
                <th className="py-2 px-2.5 text-right">Cooked Pax</th>
                <th className="py-2 px-2.5">FSSAI Temp Check</th>
                <th className="py-2 px-2.5 text-right">Batch Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f1f2]">
              {filteredBatches.map((batch) => (
                <tr key={batch.id} className="hover:bg-[#f9fbfc]">
                  <td className="py-2.5 px-2.5 font-medium text-[#131416]">{batch.recipeName}</td>
                  <td className="py-2.5 px-2.5 text-[#5d5f60]">{batch.kitchenName}</td>
                  <td className="py-2.5 px-2.5 text-[#131416]">{batch.clientName}</td>
                  <td className="py-2.5 px-2.5 text-[#5d5f60]">{batch.mealType}</td>
                  <td className="py-2.5 px-2.5 text-right font-mono text-[#5d5f60]">{batch.plannedQty}</td>
                  <td className="py-2.5 px-2.5 text-right font-mono font-semibold text-[#131416]">
                    {batch.actualQty}
                  </td>
                  <td className="py-2.5 px-2.5">
                    <span className="text-[11px] text-[#1e7b4f] bg-[#f0fdf4] px-1.5 py-0.5 rounded border border-[#bbf7d0]">
                      {batch.tempCheck}
                    </span>
                  </td>
                  <td className="py-2.5 px-2.5 text-right">
                    <Badge
                      variant={
                        batch.status.includes('Dispatched')
                          ? 'positive'
                          : batch.status.includes('Ready')
                          ? 'accent'
                          : 'warning'
                      }
                    >
                      {batch.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <StockTransactionModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
      />
      <LogWastageModal
        isOpen={isWastageModalOpen}
        onClose={() => setIsWastageModalOpen(false)}
      />
      <RecordPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatINR, formatNumber } from '../utils/formatters';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Play, RefreshCw, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import { KitchenLoader } from '../components/common/KitchenLoader';

export const ForecastingPage = () => {
  const { clients, ingredients } = useApp();

  // Interactive Forecasting Parameters
  const [targetDay, setTargetDay] = useState('Wednesday');
  const [expectedAttendancePct, setExpectedAttendancePct] = useState(92);
  const [weatherCondition, setWeatherCondition] = useState('Clear / Normal');
  const [isSimulated, setIsSimulated] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);

  // Weather impact multiplier
  const weatherMultiplier =
    weatherCondition === 'Heavy Rain / Monsoon' ? 0.82 : weatherCondition === 'Moderate Drizzle' ? 0.90 : 1.0;

  // Day factor multiplier (Mondays 88%, Wed 96%, Fri 68%)
  const dayMultiplier =
    targetDay === 'Friday' ? 0.72 : targetDay === 'Monday' ? 0.88 : targetDay === 'Wednesday' ? 0.98 : 0.94;

  const combinedFactor = (expectedAttendancePct / 100) * weatherMultiplier * (dayMultiplier / 0.95);

  // Client-wise predicted headcount & meals
  const predictedForecasts = clients.map((client) => {
    const predictedPax = Math.round(client.headcount * combinedFactor);
    const predictedBreakfast = Math.round(client.mealLimits.breakfast * combinedFactor);
    const predictedLunch = Math.round(client.mealLimits.lunch * combinedFactor);
    const predictedDinner = Math.round(client.mealLimits.dinner * combinedFactor);
    const predictedSnacks = Math.round(client.mealLimits.snacks * combinedFactor);
    const totalPredictedMeals = predictedBreakfast + predictedLunch + predictedDinner + predictedSnacks;

    return {
      client,
      predictedPax,
      predictedBreakfast,
      predictedLunch,
      predictedDinner,
      predictedSnacks,
      totalPredictedMeals,
    };
  });

  const grandTotalPredictedMeals = predictedForecasts.reduce(
    (acc, f) => acc + f.totalPredictedMeals,
    0
  );

  // Raw Material Forecast Requirements (Rule-based culinary yields)
  const requiredBasmatiKg = Math.round(grandTotalPredictedMeals * 0.11); // 110g raw rice / pax
  const requiredPaneerKg = Math.round(grandTotalPredictedMeals * 0.045); // 45g paneer / pax
  const requiredDalKg = Math.round(grandTotalPredictedMeals * 0.05); // 50g dal / pax
  const requiredOilL = Math.round(grandTotalPredictedMeals * 0.025); // 25ml oil / pax
  const requiredVegetablesKg = Math.round(grandTotalPredictedMeals * 0.14); // 140g veg / pax

  // Simulated chart data across shifts
  const shiftChartData = [
    { shift: 'Breakfast (07:30 - 10:00)', forecast: predictedForecasts.reduce((a, f) => a + f.predictedBreakfast, 0) },
    { shift: 'Lunch (12:00 - 14:30)', forecast: predictedForecasts.reduce((a, f) => a + f.predictedLunch, 0) },
    { shift: 'High-Tea (16:00 - 17:30)', forecast: predictedForecasts.reduce((a, f) => a + f.predictedSnacks, 0) },
    { shift: 'Dinner (19:30 - 22:00)', forecast: predictedForecasts.reduce((a, f) => a + f.predictedDinner, 0) },
  ];

  // Stock sufficiency alerts
  const basmatiStock = ingredients.find((i) => i.sku === 'GRN-BAS-01')?.currentStock || 420;
  const paneerStock = ingredients.find((i) => i.sku === 'DAI-PAN-02')?.currentStock || 24;

  const isBasmatiShort = basmatiStock < requiredBasmatiKg;
  const isPaneerShort = paneerStock < requiredPaneerKg;

  // Estimated financial optimization savings
  const estSavings = Math.round((1 - combinedFactor) * 28400);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#e8eaec]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#e6f3f6] text-[#1b6c80]">
              <Sparkles className="w-4 h-4" />
            </span>
            <h1 className="text-[22px] font-semibold text-[#131416] tracking-tight leading-tight">
              Simulated AI Demand & Raw Material Forecasting
            </h1>
          </div>
          <p className="text-[13.5px] text-[#5d5f60] mt-1">
            Browser-side predictive engine modeling hybrid WFH patterns, seasonal weather adjustments and ingredient prep sheets
          </p>
        </div>
      </div>

      {/* Simulator Control Sandbox */}
      <div className="bg-[#f9fbfc] border border-[#e8eaec] rounded-lg p-5 space-y-4">
        <div className="flex flex-col min-[480px]:flex-row min-[480px]:items-center justify-between gap-2">
          <span className="text-[13px] font-bold text-[#131416] uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#1b6c80]" />
            Simulation Parameters & Prediction Variables
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsSimulating(true);
                setTimeout(() => setIsSimulating(false), 1200);
              }}
              style={{ color: '#ffffff', backgroundColor: '#131416' }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#131416] text-white text-[12px] font-medium hover:bg-[#222] transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-white ${isSimulating ? 'animate-spin' : ''}`} style={{ stroke: '#ffffff' }} />
              <span style={{ color: '#ffffff' }} className="text-white">Run AI Forecast</span>
            </button>
            <span className="hidden sm:inline text-[11px] text-[#737678] font-mono">Offline Model</span>
          </div>
        </div>

        {isSimulating ? (
          <div className="bg-white border border-[#e8eaec] rounded p-6">
            <KitchenLoader
              variant="card"
              label="Recomputing Headcount Variances & Batch Prep Yields..."
              autoCompleteDuration={1100}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[13px]">
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Forecast Target Day</label>
            <select
              value={targetDay}
              onChange={(e) => setTargetDay(e.target.value)}
              className="w-full px-3 py-1.5 border border-[#cdced1] rounded bg-white text-[12px] font-medium"
            >
              <option value="Monday">Monday (Attendance: ~88%)</option>
              <option value="Tuesday">Tuesday (Attendance: ~94%)</option>
              <option value="Wednesday">Wednesday (Peak Day: ~98%)</option>
              <option value="Thursday">Thursday (Attendance: ~92%)</option>
              <option value="Friday">Friday (WFH Remote Drop: ~70%)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[#5d5f60] font-medium">Expected Headcount Attendance</label>
              <span className="font-mono font-bold text-[#1b6c80]">{expectedAttendancePct}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              value={expectedAttendancePct}
              onChange={(e) => setExpectedAttendancePct(Number(e.target.value))}
              className="w-full accent-[#1b6c80] cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Weather / Metro Rain Factor</label>
            <select
              value={weatherCondition}
              onChange={(e) => setWeatherCondition(e.target.value)}
              className="w-full px-3 py-1.5 border border-[#cdced1] rounded bg-white text-[12px] font-medium"
            >
              <option value="Clear / Normal">Clear / Normal Weather (100% baseline)</option>
              <option value="Moderate Drizzle">Moderate Drizzle (-10% attendance buffer)</option>
              <option value="Heavy Rain / Monsoon">Heavy Rain / Monsoon (-18% attendance buffer)</option>
            </select>
          </div>
        </div>
        )}
      </div>

      {/* Output Predictions KPI Row */}
      <div className="grid grid-cols-1 min-[360px]:grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-white border border-[#e8eaec] rounded p-3.5">
          <span className="text-[11px] font-medium text-[#5d5f60]">Predicted Meal Demand</span>
          <div className="text-[24px] font-bold text-[#1b6c80] font-mono mt-1">
            {formatNumber(grandTotalPredictedMeals)}
          </div>
          <span className="text-[11px] text-[#5d5f60]">Meals across all 3 client hubs</span>
        </div>

        <div className="bg-white border border-[#e8eaec] rounded p-3.5">
          <span className="text-[11px] font-medium text-[#5d5f60]">Raw Basmati Rice Req.</span>
          <div className="text-[24px] font-bold text-[#131416] font-mono mt-1">
            {requiredBasmatiKg} kg
          </div>
          <span className={`text-[11px] ${isBasmatiShort ? 'text-[#c4242a] font-bold' : 'text-[#1e7b4f]'}`}>
            {isBasmatiShort ? `Shortage! Current stock: ${basmatiStock}kg` : `Sufficient (Stock: ${basmatiStock}kg)`}
          </span>
        </div>

        <div className="bg-white border border-[#e8eaec] rounded p-3.5">
          <span className="text-[11px] font-medium text-[#5d5f60]">Fresh Paneer Req.</span>
          <div className="text-[24px] font-bold text-[#131416] font-mono mt-1">
            {requiredPaneerKg} kg
          </div>
          <span className={`text-[11px] ${isPaneerShort ? 'text-[#c4242a] font-bold' : 'text-[#1e7b4f]'}`}>
            {isPaneerShort ? `Urgent Inward! Stock: ${paneerStock}kg` : `Stock: ${paneerStock}kg`}
          </span>
        </div>

        <div className="bg-white border border-[#e8eaec] rounded p-3.5">
          <span className="text-[11px] font-medium text-[#5d5f60]">Est. Wastage Cost Saved</span>
          <div className="text-[24px] font-bold text-[#1e7b4f] font-mono mt-1">
            {formatINR(estSavings)}
          </div>
          <span className="text-[11px] text-[#5d5f60]">Via smart buffer batch trimming</span>
        </div>
      </div>

      {/* Chart & Client Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shift Prediction Chart */}
        <div className="bg-white border border-[#e8eaec] rounded-lg p-5">
          <div className="pb-3 mb-4 border-b border-[#e8eaec]">
            <h2 className="text-[14px] font-semibold text-[#131416]">Forecasted Meal Volume by Shift</h2>
            <p className="text-[11px] text-[#5d5f60]">Target Date: {targetDay} ({expectedAttendancePct}% Headcount Factor)</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shiftChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f1f2" />
                <XAxis dataKey="shift" tick={{ fontSize: 10, fill: '#5d5f60' }} axisLine={{ stroke: '#e8eaec' }} />
                <YAxis tick={{ fontSize: 11, fill: '#5d5f60' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#131416', color: '#fff', borderRadius: '4px', border: 'none', fontSize: '12px' }}
                  formatter={(val) => [`${val} meals`, 'Forecasted Volume']}
                />
                <Bar dataKey="forecast" fill="#1b6c80" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Client-wise Predicted Headcounts (2 Columns) */}
        <div className="lg:col-span-2 bg-white border border-[#e8eaec] rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-[#e8eaec] bg-[#f9fbfc]">
            <h2 className="text-[14px] font-semibold text-[#131416]">Client Campus Predicted Fulfillments</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-[#f9fbfc] border-b border-[#e8eaec] text-[#5d5f60] font-medium">
                  <th className="py-2.5 px-3">Corporate Client</th>
                  <th className="py-2.5 px-3 text-right">Headcount</th>
                  <th className="py-2.5 px-3 text-right">Forecast Pax</th>
                  <th className="py-2.5 px-3 text-right">Breakfast</th>
                  <th className="py-2.5 px-3 text-right">Lunch</th>
                  <th className="py-2.5 px-3 text-right">Snacks</th>
                  <th className="py-2.5 px-3 text-right">Dinner</th>
                  <th className="py-2.5 px-3 text-right">Total Meals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f1f2]">
                {predictedForecasts.map((f) => (
                  <tr key={f.client.id} className="hover:bg-[#f9fbfc]">
                    <td className="py-2.5 px-3 font-semibold text-[#131416]">
                      {f.client.name}
                      <span className="block text-[11px] text-[#5d5f60] font-normal">{f.client.code}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#5d5f60]">{f.client.headcount}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#1b6c80]">{f.predictedPax}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#5d5f60]">{f.predictedBreakfast}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#131416]">{f.predictedLunch}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#5d5f60]">{f.predictedSnacks}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#5d5f60]">{f.predictedDinner}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#1e7b4f]">
                      {f.totalPredictedMeals}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Automated Daily Operational Sheet Recommendations */}
      <div className="bg-white border border-[#e8eaec] rounded-lg p-5 space-y-3">
        <h2 className="text-[14px] font-semibold text-[#131416] flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-[#a86f0c]" />
          <span>Automated Daily Kitchen Sheet Directives</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[12px]">
          <div className="p-3 bg-[#f9fbfc] border border-[#e8eaec] rounded">
            <span className="font-semibold text-[#131416] block mb-1">Boiler Steam Kettle Batching</span>
            <p className="text-[#5d5f60]">
              Batch Yellow Dal Tadka to 600 portions at 07:45 AM, followed by second batch of 450 portions at 11:15 AM to ensure temperature freshness and avoid holding degradation.
            </p>
          </div>

          <div className="p-3 bg-[#f9fbfc] border border-[#e8eaec] rounded">
            <span className="font-semibold text-[#131416] block mb-1">Cold-Chain Dispatch Route</span>
            <p className="text-[#5d5f60]">
              Fleet Van 1 departs Okhla Base at 11:10 AM for Nexus SEZ Noida Expressway. Satellite Pantry Gurugram begins live tandoori naan baking at 12:15 PM.
            </p>
          </div>

          <div className="p-3 bg-[#f9fbfc] border border-[#e8eaec] rounded">
            <span className="font-semibold text-[#131416] block mb-1">Raw Material Inward Trigger</span>
            <p className="text-[#5d5f60]">
              {isPaneerShort
                ? 'CRITICAL: Place urgent PO for 30kg Malai Paneer to Mother Dairy Institutional Supply before 14:00 PM.'
                : 'Current warehouse ingredients sufficient for next 48 hours production cycle.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

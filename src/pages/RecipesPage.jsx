import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatINR, formatPercent } from '../utils/formatters';
import { ChefHat, Plus, Trash2, Calculator, ArrowRight } from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const RecipesPage = () => {
  const { recipes } = useApp();
  const [selectedRecipe, setSelectedRecipe] = useState(recipes[0] || null);

  // Interactive Recipe Sandbox State (initialized with selectedRecipe)
  const [servingsYield, setServingsYield] = useState(selectedRecipe?.servingsYield || 100);
  const [sellingPricePerPortion, setSellingPricePerPortion] = useState(
    selectedRecipe?.sellingPricePerPortion || 140
  );
  const [ingredientsList, setIngredientsList] = useState(
    selectedRecipe?.ingredients || []
  );

  // Sync sandbox when selecting another recipe
  const handleSelectRecipe = (rec) => {
    setSelectedRecipe(rec);
    setServingsYield(rec.servingsYield);
    setSellingPricePerPortion(rec.sellingPricePerPortion);
    setIngredientsList([...rec.ingredients]);
  };

  // Ingredient row change
  const handleUpdateIngredient = (index, field, value) => {
    setIngredientsList((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const updated = { ...item, [field]: Number(value) };
          updated.totalCost = (updated.qty || 0) * (updated.unitCost || 0);
          return updated;
        }
        return item;
      })
    );
  };

  // Add custom ingredient row
  const handleAddIngredientRow = () => {
    setIngredientsList((prev) => [
      ...prev,
      {
        ingredientId: `custom-${Date.now()}`,
        name: 'Additional Culinary Ingredient',
        qty: 2,
        unit: 'kg',
        unitCost: 150,
        totalCost: 300,
      },
    ]);
  };

  const handleRemoveIngredientRow = (index) => {
    setIngredientsList((prev) => prev.filter((_, i) => i !== index));
  };

  // Live Browser-Side Calculations
  const totalBatchCost = ingredientsList.reduce((acc, it) => acc + (it.totalCost || 0), 0);
  const costPerServing = servingsYield > 0 ? totalBatchCost / servingsYield : 0;
  const totalRevenueBatch = servingsYield * sellingPricePerPortion;
  const grossProfitBatch = totalRevenueBatch - totalBatchCost;
  const grossMargin = totalRevenueBatch > 0 ? (grossProfitBatch / totalRevenueBatch) * 100 : 0;
  const foodCostPercentage = sellingPricePerPortion > 0 ? (costPerServing / sellingPricePerPortion) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#e8eaec]">
        <div>
          <h1 className="text-[22px] font-semibold text-[#131416] tracking-tight leading-tight">
            Recipe Formulation & Food Costing Calculator
          </h1>
          <p className="text-[13.5px] text-[#5d5f60] mt-1">
            Ingredient yield decomposition, portion unit economics, gross margins, and live food cost target modeling
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Preset Recipe Selection */}
        <div className="space-y-3">
          <h2 className="text-[14px] font-semibold text-[#131416]">Master Recipe Catalog</h2>
          {recipes.map((rec) => {
            const isSelected = selectedRecipe?.id === rec.id;
            return (
              <div
                key={rec.id}
                onClick={() => handleSelectRecipe(rec)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  isSelected
                    ? 'border-[#1b6c80] bg-[#f9fbfc]'
                    : 'border-[#e8eaec] bg-white hover:border-[#cdced1]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-medium text-[#1b6c80] uppercase tracking-wider">
                      {rec.category}
                    </span>
                    <h3 className="text-[14px] font-semibold text-[#131416] mt-0.5">{rec.name}</h3>
                    <p className="text-[11px] text-[#5d5f60]">Lead: {rec.chef}</p>
                  </div>
                  <span className="text-[12px] font-mono font-bold text-[#131416]">
                    ₹{rec.sellingPricePerPortion} / pax
                  </span>
                </div>

                <div className="mt-3 pt-2 border-t border-[#f0f1f2] flex justify-between text-[11px] text-[#5d5f60]">
                  <span>Batch Yield: {rec.servingsYield} Portions</span>
                  <span>Prep: {rec.prepTimeMins} mins</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column: Interactive Recipe Costing Sandbox (2 Columns) */}
        <div className="lg:col-span-2 bg-white border border-[#e8eaec] rounded-lg p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-[#e8eaec] gap-2">
            <div>
              <span className="text-[11px] text-[#1b6c80] font-semibold uppercase tracking-wider">
                Live Cost Simulator
              </span>
              <h2 className="text-[17px] font-bold text-[#131416] mt-0.5">
                {selectedRecipe?.name || 'Custom Recipe Sandbox'}
              </h2>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#f4f6f8] text-[#131416] text-[11px] font-mono">
              Formula: (Batch Cost ÷ Yield) ÷ Selling Price
            </span>
          </div>

          {/* Top Parameters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#f9fbfc] p-4 border border-[#e8eaec] rounded-lg">
            <div>
              <label className="block text-[#5d5f60] mb-1 font-medium text-[12px]">
                Batch Servings Yield (Portions)
              </label>
              <input
                type="number"
                min="1"
                value={servingsYield}
                onChange={(e) => setServingsYield(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-[#cdced1] rounded font-mono text-[14px]"
              />
            </div>
            <div>
              <label className="block text-[#5d5f60] mb-1 font-medium text-[12px]">
                Selling Tariff per Portion (₹)
              </label>
              <input
                type="number"
                min="1"
                value={sellingPricePerPortion}
                onChange={(e) => setSellingPricePerPortion(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-[#cdced1] rounded font-mono text-[14px]"
              />
            </div>
          </div>

          {/* Key Financial KPIs Calculated in Browser */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#f4f6f8] border border-[#e8eaec] rounded">
              <span className="text-[11px] text-[#5d5f60] block font-medium">Total Batch Cost</span>
              <div className="text-[18px] font-bold text-[#131416] font-mono mt-0.5">
                {formatINR(totalBatchCost)}
              </div>
            </div>

            <div className="p-3 bg-[#f4f6f8] border border-[#e8eaec] rounded">
              <span className="text-[11px] text-[#5d5f60] block font-medium">Cost per Serving</span>
              <div className="text-[18px] font-bold text-[#1b6c80] font-mono mt-0.5">
                ₹{costPerServing.toFixed(2)}
              </div>
            </div>

            <div className="p-3 bg-[#f4f6f8] border border-[#e8eaec] rounded">
              <span className="text-[11px] text-[#5d5f60] block font-medium">Food Cost %</span>
              <div
                className={`text-[18px] font-bold font-mono mt-0.5 ${
                  foodCostPercentage > 35 ? 'text-[#c4242a]' : 'text-[#1e7b4f]'
                }`}
              >
                {foodCostPercentage.toFixed(1)}%
              </div>
              <span className="text-[10px] text-[#737678]">Target: &lt; 32%</span>
            </div>

            <div className="p-3 bg-[#f4f6f8] border border-[#e8eaec] rounded">
              <span className="text-[11px] text-[#5d5f60] block font-medium">Gross Margin</span>
              <div className="text-[18px] font-bold text-[#1e7b4f] font-mono mt-0.5">
                {grossMargin.toFixed(1)}%
              </div>
              <span className="text-[10px] text-[#737678]">Batch Profit: {formatINR(grossProfitBatch)}</span>
            </div>
          </div>

          {/* Ingredient Breakdown Table */}
          <div className="border border-[#e8eaec] rounded overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-[#f9fbfc] border-b border-[#e8eaec]">
              <span className="font-semibold text-[#131416] text-[12px]">
                Batch Raw Material Inputs ({ingredientsList.length})
              </span>
              <button
                type="button"
                onClick={handleAddIngredientRow}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1b6c80] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Ingredient</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[12px]">
                <thead>
                  <tr className="bg-[#f9fbfc] border-b border-[#e8eaec] text-[#5d5f60] font-medium">
                    <th className="py-2 px-3">Ingredient</th>
                    <th className="py-2 px-3 text-right">Batch Qty</th>
                    <th className="py-2 px-3">Unit</th>
                    <th className="py-2 px-3 text-right">Unit Rate (₹)</th>
                    <th className="py-2 px-3 text-right">Line Total (₹)</th>
                    <th className="py-2 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f1f2]">
                  {ingredientsList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#f9fbfc]">
                      <td className="py-2 px-3 font-medium text-[#131416]">{item.name}</td>
                      <td className="py-2 px-3 text-right">
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          value={item.qty}
                          onChange={(e) => handleUpdateIngredient(idx, 'qty', e.target.value)}
                          className="w-20 px-1.5 py-0.5 text-right font-mono border border-[#cdced1] rounded"
                        />
                      </td>
                      <td className="py-2 px-3 text-[#5d5f60]">{item.unit}</td>
                      <td className="py-2 px-3 text-right">
                        <input
                          type="number"
                          min="1"
                          value={item.unitCost}
                          onChange={(e) => handleUpdateIngredient(idx, 'unitCost', e.target.value)}
                          className="w-20 px-1.5 py-0.5 text-right font-mono border border-[#cdced1] rounded"
                        />
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-[#131416]">
                        {formatINR(item.totalCost)}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredientRow(idx)}
                          className="p-1 text-[#737678] hover:text-[#c4242a]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

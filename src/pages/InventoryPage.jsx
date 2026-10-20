import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatINR, formatNumber, formatDate } from '../utils/formatters';
import { Boxes, Plus, ArrowRightLeft, AlertTriangle, Search, Filter } from 'lucide-react';
import { StockTransactionModal } from '../components/modals/StockTransactionModal';
import { Badge } from '../components/common/Badge';

export const InventoryPage = () => {
  const { ingredients, totalStockValue, lowStockCount, locations } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState(null);

  const categories = ['All', 'Grains & Rice', 'Dairy', 'Vegetables', 'Poultry & Meat', 'Oils & Fats', 'Pulses', 'Spices & Seasoning'];

  const filteredIngredients = ingredients.filter((ing) => {
    const matchesCategory = categoryFilter === 'All' || ing.category === categoryFilter;
    const matchesSearch =
      ing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ing.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenTransaction = (ingId = null) => {
    setSelectedIngredientId(ingId);
    setIsStockModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#e8eaec]">
        <div>
          <h1 className="text-[22px] font-semibold text-[#131416] tracking-tight leading-tight">
            Inventory & Raw Materials Stock
          </h1>
          <p className="text-[13.5px] text-[#5d5f60] mt-1">
            Cold storage inventory balances, minimum reorder thresholds, expiry tracking and kitchen dispatching
          </p>
        </div>

        <button
          onClick={() => handleOpenTransaction(null)}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 text-[12px] font-medium bg-[#131416] hover:bg-[#242629] text-white rounded transition-colors w-full sm:w-auto"
          style={{ color: '#ffffff' }}
        >
          <Plus className="w-4 h-4 text-white shrink-0" style={{ color: '#ffffff', stroke: '#ffffff' }} />
          <span className="text-white font-medium" style={{ color: '#ffffff' }}>New Stock Movement / Transfer</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 min-[360px]:grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-white border border-[#e8eaec] rounded p-3.5">
          <span className="text-[11px] font-medium text-[#5d5f60]">Total Inventory Valuation</span>
          <div className="text-[22px] font-bold text-[#131416] font-mono mt-1">
            {formatINR(totalStockValue)}
          </div>
          <span className="text-[11px] text-[#5d5f60]">{ingredients.length} active SKUs across warehouses</span>
        </div>

        <div className="bg-white border border-[#e8eaec] rounded p-3.5">
          <span className="text-[11px] font-medium text-[#5d5f60]">Low Stock Alerts</span>
          <div className={`text-[22px] font-bold font-mono mt-1 ${lowStockCount > 0 ? 'text-[#c4242a]' : 'text-[#1e7b4f]'}`}>
            {lowStockCount} SKUs
          </div>
          <span className="text-[11px] text-[#5d5f60]">Below minimum kitchen safety threshold</span>
        </div>

        <div className="bg-white border border-[#e8eaec] rounded p-3.5">
          <span className="text-[11px] font-medium text-[#5d5f60]">Primary Commissary Share</span>
          <div className="text-[22px] font-bold text-[#1b6c80] font-mono mt-1">
            74.3%
          </div>
          <span className="text-[11px] text-[#5d5f60]">Central Commissary Okhla Base</span>
        </div>

        <div className="bg-white border border-[#e8eaec] rounded p-3.5">
          <span className="text-[11px] font-medium text-[#5d5f60]">Avg Stock Turnover</span>
          <div className="text-[22px] font-bold text-[#131416] font-mono mt-1">
            4.8 Days
          </div>
          <span className="text-[11px] text-[#1e7b4f]">Perishables daily restocked</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 border border-[#e8eaec] rounded-lg">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Search className="w-4 h-4 text-[#737678]" />
          <input
            type="text"
            placeholder="Search raw material name, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-2 py-1 text-[13px] border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none w-full sm:w-64"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[12px] text-[#5d5f60] whitespace-nowrap">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1 text-[12px] border border-[#cdced1] rounded bg-white w-full sm:w-auto"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table of Ingredients */}
      <div className="bg-white border border-[#e8eaec] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="bg-[#f9fbfc] border-b border-[#e8eaec] text-[#5d5f60] font-medium">
                <th className="py-2.5 px-3">SKU</th>
                <th className="py-2.5 px-3">Raw Ingredient Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">In Stock Balance</th>
                <th className="py-2.5 px-3 text-right">Safety Min</th>
                <th className="py-2.5 px-3 text-right">Unit Rate</th>
                <th className="py-2.5 px-3 text-right">Stock Valuation</th>
                <th className="py-2.5 px-3">Expiry Date</th>
                <th className="py-2.5 px-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f1f2]">
              {filteredIngredients.map((ing) => {
                const isLow = ing.currentStock <= ing.minThreshold;
                const totalVal = ing.currentStock * ing.unitPrice;

                return (
                  <tr key={ing.id} className="hover:bg-[#f9fbfc]">
                    <td className="py-2.5 px-3 font-mono text-[#5d5f60]">{ing.sku}</td>
                    <td className="py-2.5 px-3 font-semibold text-[#131416]">
                      {ing.name}
                      {isLow && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#fee2e2] text-[#991b1b]">
                          LOW STOCK
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-[#5d5f60]">{ing.category}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#131416]">
                      {ing.currentStock} {ing.unit}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#5d5f60]">
                      {ing.minThreshold} {ing.unit}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#131416]">
                      ₹{ing.unitPrice}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium text-[#131416]">
                      {formatINR(totalVal)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-[#5d5f60]">
                      {formatDate(ing.expiryDate)}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleOpenTransaction(ing.id)}
                        className="px-2 py-1 text-[11px] font-medium border border-[#cdced1] hover:bg-[#ebedee] text-[#131416] rounded"
                      >
                        Stock Move
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <StockTransactionModal
        isOpen={isStockModalOpen}
        onClose={() => {
          setIsStockModalOpen(false);
          setSelectedIngredientId(null);
        }}
        defaultIngredientId={selectedIngredientId}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/formatters';
import { UtensilsCrossed, Plus, Printer, Calendar, Clock, Scale } from 'lucide-react';
import { AddMenuItemModal } from '../components/modals/AddMenuItemModal';
import { Badge } from '../components/common/Badge';

export const MenusPage = () => {
  const { menuItems, kitchenBatches } = useApp();
  const [activeSlot, setActiveSlot] = useState('All'); // 'All', 'Breakfast', 'Lunch', 'Snacks', 'Dinner'
  const [selectedDate, setSelectedDate] = useState('2026-10-20');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('catalog'); // 'catalog', 'productionSheet'

  const filteredItems =
    activeSlot === 'All' ? menuItems : menuItems.filter((item) => item.category === activeSlot);

  // Print meal production sheet
  const handlePrintSheet = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#e8eaec]">
        <div>
          <h1 className="text-[22px] font-semibold text-[#131416] tracking-tight leading-tight">
            Menu Planning & Kitchen Production Sheets
          </h1>
          <p className="text-[13.5px] text-[#5d5f60] mt-1">
            Slot-wise nutritional thali recipes, portion weights, batch yields and commissary kitchen sheets
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="flex bg-[#f4f6f8] p-0.5 rounded border border-[#cdced1] text-[12px]">
            <button
              onClick={() => setViewMode('catalog')}
              className={`flex-1 sm:flex-initial text-center px-3 py-1 font-medium rounded transition-colors ${
                viewMode === 'catalog' ? 'bg-white text-[#131416]' : 'text-[#5d5f60] hover:text-[#131416]'
              }`}
            >
              Recipe Catalog
            </button>
            <button
              onClick={() => setViewMode('productionSheet')}
              className={`flex-1 sm:flex-initial text-center px-3 py-1 font-medium rounded transition-colors ${
                viewMode === 'productionSheet' ? 'bg-white text-[#131416]' : 'text-[#5d5f60] hover:text-[#131416]'
              }`}
            >
              Daily Production Sheet
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 text-[12px] font-medium bg-[#131416] hover:bg-[#242629] text-white rounded transition-colors w-full sm:w-auto"
            style={{ color: '#ffffff' }}
          >
            <Plus className="w-4 h-4 text-white shrink-0" style={{ color: '#ffffff', stroke: '#ffffff' }} />
            <span className="text-white font-medium" style={{ color: '#ffffff' }}>Add Menu Item</span>
          </button>
        </div>
      </div>

      {viewMode === 'catalog' ? (
        <div className="space-y-4">
          {/* Meal Slot Filter Tabs */}
          <div className="flex items-center gap-2 border-b border-[#e8eaec] pb-3 overflow-x-auto text-[13px]">
            {['All', 'Breakfast', 'Lunch', 'Snacks', 'Dinner'].map((slot) => (
              <button
                key={slot}
                onClick={() => setActiveSlot(slot)}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  activeSlot === slot
                    ? 'bg-[#131416] text-white'
                    : 'text-[#5d5f60] hover:text-[#131416] hover:bg-[#f4f6f8]'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>

          {/* Menu Items Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const grossMargin = item.price > 0 ? (((item.price - item.costPerPortion) / item.price) * 100).toFixed(0) : 0;
              const foodCostPct = item.price > 0 ? ((item.costPerPortion / item.price) * 100).toFixed(0) : 0;

              return (
                <div key={item.id} className="bg-white border border-[#e8eaec] rounded-lg p-4 flex flex-col justify-between hover:border-[#cdced1] transition-colors">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[11px] font-medium text-[#1b6c80] uppercase tracking-wider">
                        {item.category} • {item.cuisine}
                      </span>
                      <Badge
                        variant={
                          item.dietary.includes('Veg') && !item.dietary.includes('Non')
                            ? 'positive'
                            : item.dietary.includes('Non')
                            ? 'negative'
                            : 'accent'
                        }
                      >
                        {item.dietary}
                      </Badge>
                    </div>

                    <h3 className="text-[15px] font-semibold text-[#131416] mb-1">{item.name}</h3>
                    <p className="text-[12px] text-[#5d5f60] line-clamp-2 mb-3">{item.description}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#f0f1f2]">
                    <div className="flex items-center justify-between text-[11px] text-[#5d5f60]">
                      <span className="flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5" />
                        <span>Portion: {item.portionGrams}g</span>
                      </span>
                      <span>{item.calories} kcal</span>
                    </div>

                    <div className="flex items-center justify-between bg-[#f9fbfc] p-2 rounded border border-[#e8eaec] text-[12px]">
                      <div>
                        <span className="text-[#5d5f60] block text-[10px]">Selling Price</span>
                        <span className="font-mono font-bold text-[#131416] text-[14px]">{formatINR(item.price)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[#5d5f60] block text-[10px]">Food Cost</span>
                        <span className="font-mono font-medium text-[#1e7b4f]">{formatINR(item.costPerPortion)} ({foodCostPct}%)</span>
                      </div>
                    </div>

                    {item.allergens && item.allergens.length > 0 && (
                      <div className="text-[10px] text-[#737678] truncate">
                        Allergens: {item.allergens.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Daily Production Sheet (Kitchen Batching format) */
        <div className="bg-white border border-[#e8eaec] rounded-lg p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-[#e8eaec] gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-mono font-medium px-2 py-0.5 rounded bg-[#f4f6f8] text-[#131416]">
                  PROD-BATCH-SHEET
                </span>
                <h2 className="text-[17px] font-bold text-[#131416]">
                  Kitchen Batch Production Sheet — 20 Oct 2026
                </h2>
              </div>
              <p className="text-[12px] text-[#5d5f60] mt-0.5">
                Central Base Commissary (Okhla) & Cyber Gateway Satellite Pantry
              </p>
            </div>

            <button
              onClick={handlePrintSheet}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium border border-[#cdced1] hover:bg-[#ebedee] text-[#131416] rounded transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Production Sheet</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-[#f9fbfc] border-b border-[#e8eaec] text-[#5d5f60] font-medium">
                  <th className="py-2.5 px-3">Batch ID</th>
                  <th className="py-2.5 px-3">Menu Recipe Item</th>
                  <th className="py-2.5 px-3">Serviced Client</th>
                  <th className="py-2.5 px-3">Slot</th>
                  <th className="py-2.5 px-3 text-right">Planned (Pax)</th>
                  <th className="py-2.5 px-3 text-right">Actual (Pax)</th>
                  <th className="py-2.5 px-3">Prep Window</th>
                  <th className="py-2.5 px-3">Safety / Temp</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f1f2]">
                {kitchenBatches.map((b) => (
                  <tr key={b.id} className="hover:bg-[#f9fbfc]">
                    <td className="py-2.5 px-3 font-mono text-[#5d5f60]">{b.id}</td>
                    <td className="py-2.5 px-3 font-semibold text-[#131416]">{b.recipeName}</td>
                    <td className="py-2.5 px-3 text-[#5d5f60]">{b.clientName}</td>
                    <td className="py-2.5 px-3 text-[#131416]">{b.mealType}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#5d5f60]">{b.plannedQty}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#131416]">{b.actualQty}</td>
                    <td className="py-2.5 px-3 text-[#5d5f60] font-mono">{b.startTime} - {b.readyTime}</td>
                    <td className="py-2.5 px-3 text-[#1e7b4f] font-mono text-[11px]">{b.tempCheck}</td>
                    <td className="py-2.5 px-3 text-right">
                      <Badge variant="positive">{b.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-[#f9fbfc] border border-[#e8eaec] rounded text-[12px] text-[#5d5f60] flex items-center justify-between">
            <span>FSSAI Cold Chain Dispatch Standard: Cooked meals maintained &gt;65°C during hot holding transfer.</span>
            <span className="font-semibold text-[#131416]">Signed: Chef Rajesh Rawat, Executive Chef</span>
          </div>
        </div>
      )}

      <AddMenuItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

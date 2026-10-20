import React from 'react';
import { useApp } from '../context/AppContext';
import { formatINR, formatNumber } from '../utils/formatters';
import { MapPin, ChefHat, Truck, CheckCircle2, Building2, Flame, Boxes } from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const LocationsPage = () => {
  const { locations, clients, ingredients, kitchenBatches, setSelectedLocationId } = useApp();

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#e8eaec]">
        <div>
          <h1 className="text-[22px] font-semibold text-[#131416] tracking-tight leading-tight">
            Multi-Location Kitchen Commissary & Pantry Network
          </h1>
          <p className="text-[13.5px] text-[#5d5f60] mt-1">
            Central heavy prep production, satellite cafeteria steam regeneration, and cold-chain dispatch logistics
          </p>
        </div>
      </div>

      {/* Facilities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {locations.map((loc) => {
          const clientAssignments = clients.filter((c) => c.assignedKitchenId === loc.id);
          const locationBatches = kitchenBatches.filter((b) => b.kitchenId === loc.id);
          const locationIngredients = ingredients.filter((i) => i.locationId === loc.id);
          const localStockValue = locationIngredients.reduce(
            (acc, i) => acc + i.currentStock * i.unitPrice,
            0
          );
          const localMealsPlanned = locationBatches.reduce((acc, b) => acc + b.plannedQty, 0);
          const localMealsActual = locationBatches.reduce((acc, b) => acc + b.actualQty, 0);

          return (
            <div key={loc.id} className="bg-white border border-[#e8eaec] rounded-lg p-6 space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2 pb-3 border-b border-[#e8eaec]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#e6f3f6] text-[#1b6c80] font-semibold">
                      {loc.code}
                    </span>
                    <Badge variant="positive">Operational</Badge>
                  </div>
                  <h2 className="text-[16px] sm:text-[17px] font-bold text-[#131416] mt-1">{loc.name}</h2>
                  <p className="text-[12px] text-[#5d5f60] mt-0.5">{loc.address}</p>
                </div>

                <button
                  onClick={() => setSelectedLocationId(loc.id)}
                  className="px-2.5 py-1 text-[11px] font-medium border border-[#cdced1] hover:bg-[#ebedee] text-[#131416] rounded transition-colors self-start sm:self-auto"
                >
                  Filter System to Node
                </button>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2.5 sm:gap-3 text-[12px]">
                <div className="p-3 bg-[#f9fbfc] border border-[#e8eaec] rounded">
                  <span className="text-[#5d5f60] block text-[11px]">Daily Rated Capacity</span>
                  <span className="font-mono font-bold text-[#131416] text-[16px]">
                    {formatNumber(loc.dailyCapacity)} meals
                  </span>
                </div>
                <div className="p-3 bg-[#f9fbfc] border border-[#e8eaec] rounded">
                  <span className="text-[#5d5f60] block text-[11px]">Warehouse Stock Valuation</span>
                  <span className="font-mono font-bold text-[#1b6c80] text-[16px]">
                    {formatINR(localStockValue)}
                  </span>
                </div>
                <div className="p-3 bg-[#f9fbfc] border border-[#e8eaec] rounded">
                  <span className="text-[#5d5f60] block text-[11px]">Meals Fulfilled Today</span>
                  <span className="font-mono font-bold text-[#1e7b4f] text-[16px]">
                    {localMealsActual} / {localMealsPlanned}
                  </span>
                </div>
                <div className="p-3 bg-[#f9fbfc] border border-[#e8eaec] rounded">
                  <span className="text-[#5d5f60] block text-[11px]">Active Production Batches</span>
                  <span className="font-mono font-bold text-[#131416] text-[16px]">
                    {locationBatches.length} Batches
                  </span>
                </div>
              </div>

              {/* Station Leadership */}
              <div className="text-[12px] space-y-1">
                <div>Culinary Brigade Lead: <strong className="text-[#131416]">{loc.headChef}</strong></div>
                <div>FSSAI Food Safety Audit: <strong className="text-[#1e7b4f]">{loc.fssaiStatus}</strong></div>
                <div>Fleet Logistics: <strong className="text-[#131416]">{loc.dispatchBays} Insulated Cold-Chain Bays</strong></div>
              </div>

              {/* Serviced Corporate Clients */}
              <div className="pt-3 border-t border-[#f0f1f2]">
                <span className="text-[11px] font-semibold text-[#737678] uppercase tracking-wider block mb-2">
                  Designated Corporate Client Portfolios ({clientAssignments.length})
                </span>
                <div className="space-y-1.5">
                  {clientAssignments.map((client) => (
                    <div
                      key={client.id}
                      className="flex items-center justify-between p-2 bg-[#f9fbfc] border border-[#e8eaec] rounded text-[12px]"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-[#1b6c80]" />
                        <span className="font-medium text-[#131416]">{client.name}</span>
                      </div>
                      <span className="font-mono text-[#5d5f60] text-[11px]">
                        {client.headcount} pax • {client.billingCycle}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

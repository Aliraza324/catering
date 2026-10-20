import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatNumber } from '../utils/formatters';
import { Flame, CheckCircle2, Clock, AlertCircle, Plus, Send } from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const KitchensPage = () => {
  const { locations, kitchenBatches, updateBatchStatus } = useApp();
  const [selectedKitchenId, setSelectedKitchenId] = useState(locations[0]?.id || 'loc-1');
  const [operationalNotes, setOperationalNotes] = useState([
    { id: 1, time: '05:30 AM', author: 'Chef Rajesh Rawat', text: 'Morning prep shift started. Boiler steam pressure optimal at 4.2 bar. Basmati soaking completed for 850 thalis.' },
    { id: 2, time: '09:15 AM', author: 'Pooja Verma (QA)', text: 'HACCP core temperature audit passed. Chicken internal probe measured 76.4°C. Hot holding containers sanitized and sealed.' },
    { id: 3, time: '11:20 AM', author: 'Dinesh Yadav (Fleet)', text: 'Dispatched 4 insulated vans to Nexus SEZ Noida Expressway. ETA 11:55 AM.' },
  ]);
  const [newNote, setNewNote] = useState('');

  const activeKitchen = locations.find((l) => l.id === selectedKitchenId) || locations[0];

  const batches = kitchenBatches.filter((b) => b.kitchenId === selectedKitchenId);

  const totalPlanned = batches.reduce((acc, b) => acc + (b.plannedQty || 0), 0);
  const totalActual = batches.reduce((acc, b) => acc + (b.actualQty || 0), 0);
  const fulfillmentRate = totalPlanned > 0 ? ((totalActual / totalPlanned) * 100).toFixed(1) : 0;

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setOperationalNotes((prev) => [
      { id: Date.now(), time: nowTime, author: 'Kitchen Supervisor Desk', text: newNote.trim() },
      ...prev,
    ]);
    setNewNote('');
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#e8eaec]">
        <div>
          <h1 className="text-[22px] font-semibold text-[#131416] tracking-tight leading-tight">
            Kitchen Operations & Batch Live Production
          </h1>
          <p className="text-[13.5px] text-[#5d5f60] mt-1">
            Real-time batch tracking, HACCP temperature probe compliance, and kitchen supervisor shift handovers
          </p>
        </div>

        {/* Facility selector tabs */}
        <div className="flex bg-[#f4f6f8] p-0.5 rounded border border-[#cdced1] text-[12px] w-full sm:w-auto overflow-x-auto">
          {locations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setSelectedKitchenId(loc.id)}
              className={`flex-1 sm:flex-initial text-center px-3 py-1 font-medium rounded transition-colors whitespace-nowrap ${
                selectedKitchenId === loc.id
                  ? 'bg-white text-[#131416]'
                  : 'text-[#5d5f60] hover:text-[#131416]'
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>
      </div>

      {/* Facility Highlights Banner */}
      <div className="grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 bg-[#f9fbfc] p-3.5 sm:p-4 border border-[#e8eaec] rounded-lg text-[13px]">
        <div>
          <span className="text-[11px] text-[#5d5f60] block font-medium">Facility Type</span>
          <span className="font-semibold text-[#131416]">{activeKitchen.type}</span>
          <span className="text-[11px] text-[#5d5f60] block font-mono">{activeKitchen.code}</span>
        </div>
        <div>
          <span className="text-[11px] text-[#5d5f60] block font-medium">Culinary Lead</span>
          <span className="font-semibold text-[#131416]">{activeKitchen.headChef}</span>
          <span className="text-[11px] text-[#1e7b4f] block">{activeKitchen.fssaiStatus}</span>
        </div>
        <div>
          <span className="text-[11px] text-[#5d5f60] block font-medium">Daily Installed Capacity</span>
          <span className="font-semibold text-[#131416] font-mono">{formatNumber(activeKitchen.dailyCapacity)} meals / day</span>
          <span className="text-[11px] text-[#5d5f60] block">{activeKitchen.dispatchBays} temperature-controlled bays</span>
        </div>
        <div>
          <span className="text-[11px] text-[#5d5f60] block font-medium">Fulfillment Today</span>
          <span className="font-semibold text-[#1b6c80] font-mono">{totalActual} / {totalPlanned} meals</span>
          <span className="text-[11px] text-[#1e7b4f] block">{fulfillmentRate}% efficiency rate</span>
        </div>
      </div>

      {/* Batches Table with interactive Status Change */}
      <div className="bg-white border border-[#e8eaec] rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-[#e8eaec] flex items-center justify-between bg-[#f9fbfc]">
          <div>
            <h2 className="text-[14px] font-semibold text-[#131416]">Active Kitchen Batches ({batches.length})</h2>
            <p className="text-[11px] text-[#5d5f60]">Click status badge to update cooking & dispatch milestones</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="bg-[#f9fbfc] border-b border-[#e8eaec] text-[#5d5f60] font-medium">
                <th className="py-2.5 px-3">Batch Code</th>
                <th className="py-2.5 px-3">Recipe Item</th>
                <th className="py-2.5 px-3">Target Corporate Client</th>
                <th className="py-2.5 px-3">Slot</th>
                <th className="py-2.5 px-3 text-right">Planned (Pax)</th>
                <th className="py-2.5 px-3 text-right">Actual Cooked</th>
                <th className="py-2.5 px-3">HACCP Temp Probe</th>
                <th className="py-2.5 px-3 text-right">Production Phase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f1f2]">
              {batches.map((batch) => (
                <tr key={batch.id} className="hover:bg-[#f9fbfc]">
                  <td className="py-3 px-3 font-mono text-[#5d5f60]">{batch.id}</td>
                  <td className="py-3 px-3 font-semibold text-[#131416]">
                    {batch.recipeName}
                    <span className="block text-[11px] text-[#737678] font-mono">
                      Lead: {batch.headChef}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#131416]">{batch.clientName}</td>
                  <td className="py-3 px-3 text-[#5d5f60]">{batch.mealType}</td>
                  <td className="py-3 px-3 text-right font-mono text-[#5d5f60]">{batch.plannedQty}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-[#131416]">
                    {batch.actualQty}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[11px] text-[#1e7b4f] bg-[#f0fdf4] px-1.5 py-0.5 rounded border border-[#bbf7d0] font-mono">
                      {batch.tempCheck}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <select
                      value={batch.status}
                      onChange={(e) => updateBatchStatus(batch.id, e.target.value)}
                      className="px-2 py-1 text-[11px] font-medium border border-[#cdced1] rounded bg-white focus:outline-none"
                    >
                      <option value="Prepped & Simmering">Prepped & Simmering</option>
                      <option value="In Cooking / Assembly">In Cooking / Assembly</option>
                      <option value="Ready to Serve">Ready to Serve</option>
                      <option value="Dispatched & Delivered">Dispatched & Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Operational Shift Notes & Handover Log */}
      <div className="bg-white border border-[#e8eaec] rounded-lg p-5 space-y-4">
        <h2 className="text-[14px] font-semibold text-[#131416]">
          Daily Shift Handover & Operational Log
        </h2>

        {/* New Note Form */}
        <form onSubmit={handleAddNote} className="flex gap-2">
          <input
            type="text"
            placeholder="Add operational update, temperature exception or dispatch note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="flex-1 px-3 py-1.5 text-[13px] border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-[12px] font-medium bg-[#131416] hover:bg-[#222] text-white rounded shrink-0 transition-colors"
            style={{ color: '#ffffff' }}
          >
            <Send className="w-3.5 h-3.5 text-white" style={{ color: '#ffffff', stroke: '#ffffff' }} />
            <span className="text-white font-medium" style={{ color: '#ffffff' }}>Add Log</span>
          </button>
        </form>

        {/* Existing notes list */}
        <div className="space-y-2 pt-2 border-t border-[#f0f1f2]">
          {operationalNotes.map((note) => (
            <div
              key={note.id}
              className="p-3 bg-[#f9fbfc] border border-[#e8eaec] rounded text-[12px] flex items-start gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-[#1b6c80] mt-1.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#131416]">{note.author}</span>
                  <span className="text-[11px] text-[#737678] font-mono">{note.time}</span>
                </div>
                <p className="text-[#5d5f60]">{note.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

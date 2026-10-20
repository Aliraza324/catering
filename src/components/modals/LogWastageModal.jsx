import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/formatters';

export const LogWastageModal = ({ isOpen, onClose }) => {
  const { locations, logWastage } = useApp();

  const [formData, setFormData] = useState({
    kitchenId: locations[0]?.id || 'loc-1',
    mealType: 'Lunch',
    foodItem: '',
    quantityKg: 5.0,
    unitCost: 55,
    reason: 'Unserved Surplus (Client Headcount Drop)',
    disposalMethod: 'Commercial Composting Facility',
    actionTaken: 'Buffer trimmed for following cycle',
  });

  const estimatedLoss = Number(formData.quantityKg) * Number(formData.unitCost);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.foodItem || formData.quantityKg <= 0) return;

    const kitchenName = locations.find((l) => l.id === formData.kitchenId)?.name || 'Central Commissary';

    logWastage({
      kitchenId: formData.kitchenId,
      kitchenName,
      mealType: formData.mealType,
      foodItem: formData.foodItem,
      quantityKg: Number(formData.quantityKg),
      unitCost: Number(formData.unitCost),
      reason: formData.reason,
      disposalMethod: formData.disposalMethod,
      actionTaken: formData.actionTaken,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Daily Food Wastage & Residuals"
      subtitle="Track kitchen trim, overproduction or unserved cafeteria surplus with financial cost estimation"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3">
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Kitchen Facility</label>
            <select
              value={formData.kitchenId}
              onChange={(e) => setFormData({ ...formData, kitchenId: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-[#cdced1] rounded bg-white text-[12px]"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Meal Slot / Shift</label>
            <select
              value={formData.mealType}
              onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-[#cdced1] rounded bg-white text-[12px]"
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Snacks">Snacks / High-Tea</option>
              <option value="Dinner">Dinner</option>
              <option value="Prep Shift">Prep Shift Trimmings</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[#5d5f60] mb-1 font-medium">Food Item / Prepared Dish Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Steamed Basmati Rice / Dal Makhani"
            value={formData.foodItem}
            onChange={(e) => setFormData({ ...formData, foodItem: e.target.value })}
            className="w-full px-3 py-1.5 border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3">
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Wastage Weight (kg)</label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              required
              value={formData.quantityKg}
              onChange={(e) => setFormData({ ...formData, quantityKg: e.target.value })}
              className="w-full px-3 py-1.5 border border-[#cdced1] rounded font-mono"
            />
          </div>
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Cost / kg (₹)</label>
            <input
              type="number"
              min="1"
              required
              value={formData.unitCost}
              onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
              className="w-full px-3 py-1.5 border border-[#cdced1] rounded font-mono"
            />
          </div>
        </div>

        <div className="p-2.5 bg-[#fef2f2] border border-[#fecaca] rounded flex flex-col min-[360px]:flex-row min-[360px]:items-center justify-between gap-1 text-[12px]">
          <span className="text-[#991b1b] font-medium">Estimated Financial Loss:</span>
          <span className="font-mono font-bold text-[#991b1b] text-[14px]">
            {formatINR(estimatedLoss)}
          </span>
        </div>

        <div>
          <label className="block text-[#5d5f60] mb-1 font-medium">Primary Root Cause</label>
          <select
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className="w-full px-3 py-1.5 border border-[#cdced1] rounded bg-white text-[12px]"
          >
            <option value="Unserved Surplus (Client Headcount Drop)">
              Unserved Surplus (Client Headcount Drop)
            </option>
            <option value="Preparation Trim & Peeling Loss">
              Preparation Trim & Peeling Loss
            </option>
            <option value="Overproduction (Buffer Miscalculation)">
              Overproduction (Buffer Miscalculation)
            </option>
            <option value="Cold Storage / Holding Spoilage">
              Cold Storage / Holding Spoilage
            </option>
            <option value="Plate Return Leftovers">
              Plate Return Leftovers
            </option>
          </select>
        </div>

        <div>
          <label className="block text-[#5d5f60] mb-1 font-medium">Disposal / Diversion Method</label>
          <select
            value={formData.disposalMethod}
            onChange={(e) => setFormData({ ...formData, disposalMethod: e.target.value })}
            className="w-full px-3 py-1.5 border border-[#cdced1] rounded bg-white text-[12px]"
          >
            <option value="Commercial Composting Facility">Commercial Composting Facility</option>
            <option value="Certified NGO Partner (FeedIndia Feed)">Certified NGO Partner (FeedIndia Feed)</option>
            <option value="Bio-Gas Digestor (In-house)">Bio-Gas Digestor (In-house)</option>
            <option value="Municipal Waste Segregation">Municipal Waste Segregation</option>
          </select>
        </div>

        <div>
          <label className="block text-[#5d5f60] mb-1 font-medium">Corrective Action Taken</label>
          <input
            type="text"
            value={formData.actionTaken}
            onChange={(e) => setFormData({ ...formData, actionTaken: e.target.value })}
            placeholder="Action note for chef and dispatch supervisor"
            className="w-full px-3 py-1.5 border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#e8eaec]">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded border border-[#cdced1] text-[#5d5f60] hover:text-[#131416] hover:bg-[#ebedee] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{ color: '#ffffff', backgroundColor: '#131416' }}
            className="px-4 py-1.5 rounded bg-[#131416] text-white font-medium hover:bg-[#222] transition-colors"
          >
            <span style={{ color: '#ffffff' }} className="text-white">Log Wastage Record</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

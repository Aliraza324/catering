import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

export const StockTransactionModal = ({ isOpen, onClose, defaultIngredientId = null }) => {
  const { ingredients, updateStock, transferStock, locations } = useApp();

  const [mode, setMode] = useState('in'); // 'in', 'out', 'transfer'
  const [ingredientId, setIngredientId] = useState(defaultIngredientId || ingredients[0]?.id || '');
  const [quantity, setQuantity] = useState(25);
  const [reason, setReason] = useState('Fresh Inward Goods');
  const [fromLocation, setFromLocation] = useState(locations[0]?.id || 'loc-1');
  const [toLocation, setToLocation] = useState(locations[1]?.id || 'loc-2');

  const selectedIngredient = ingredients.find((i) => i.id === ingredientId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ingredientId || quantity <= 0) return;

    if (mode === 'in') {
      updateStock(ingredientId, Number(quantity), reason || 'Store Inward');
    } else if (mode === 'out') {
      updateStock(ingredientId, -Number(quantity), reason || 'Kitchen Batch Issue');
    } else if (mode === 'transfer') {
      transferStock(ingredientId, fromLocation, toLocation, Number(quantity));
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Inventory Stock Movement"
      subtitle="Record raw material inward receipts, kitchen production issues, or inter-facility transfers"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
        {/* Transaction Type Segmented Toggle */}
        <div className="grid grid-cols-1 min-[380px]:grid-cols-3 gap-0.5 rounded border border-[#cdced1] p-0.5 bg-[#f4f6f8]">
          <button
            type="button"
            onClick={() => {
              setMode('in');
              setReason('Store Inward / Supplier Delivery');
            }}
            className={`py-1 text-center font-medium rounded text-[12px] transition-colors ${
              mode === 'in' ? 'bg-white text-[#131416] shadow-none' : 'text-[#5d5f60] hover:text-[#131416]'
            }`}
          >
            Stock In (+ Inward)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('out');
              setReason('Daily Kitchen Batch Issue');
            }}
            className={`py-1 text-center font-medium rounded text-[12px] transition-colors ${
              mode === 'out' ? 'bg-white text-[#131416] shadow-none' : 'text-[#5d5f60] hover:text-[#131416]'
            }`}
          >
            Stock Out (- Kitchen)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('transfer');
              setReason('Inter-facility Pantry replenishment');
            }}
            className={`py-1 text-center font-medium rounded text-[12px] transition-colors ${
              mode === 'transfer' ? 'bg-white text-[#131416] shadow-none' : 'text-[#5d5f60] hover:text-[#131416]'
            }`}
          >
            Transfer (Hub/Pantry)
          </button>
        </div>

        <div>
          <label className="block text-[#5d5f60] mb-1 font-medium">Select Raw Ingredient</label>
          <select
            value={ingredientId}
            onChange={(e) => setIngredientId(e.target.value)}
            className="w-full px-3 py-1.5 border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none bg-white"
          >
            {ingredients.map((ing) => (
              <option key={ing.id} value={ing.id}>
                {ing.name} ({ing.sku}) — Current: {ing.currentStock} {ing.unit}
              </option>
            ))}
          </select>
        </div>

        {selectedIngredient && (
          <div className="flex flex-col min-[380px]:flex-row min-[380px]:items-center justify-between gap-1 p-2.5 bg-[#f9fbfc] border border-[#e8eaec] rounded text-[12px]">
            <div>
              <span className="text-[#5d5f60]">Current Balance: </span>
              <span className="font-semibold text-[#131416] font-mono">
                {selectedIngredient.currentStock} {selectedIngredient.unit}
              </span>
            </div>
            <div>
              <span className="text-[#5d5f60]">Unit Price: </span>
              <span className="font-semibold text-[#131416] font-mono">
                ₹{selectedIngredient.unitPrice} / {selectedIngredient.unit}
              </span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-[#5d5f60] mb-1 font-medium">
            Quantity ({selectedIngredient?.unit || 'units'})
          </label>
          <input
            type="number"
            min="0.5"
            step="0.5"
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-3 py-1.5 border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none font-mono"
          />
        </div>

        {mode === 'transfer' ? (
          <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2.5 pt-1">
            <div>
              <label className="block text-[#5d5f60] mb-1 font-medium">Source Facility</label>
              <select
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#cdced1] rounded bg-white text-[12px]"
              >
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#5d5f60] mb-1 font-medium">Target Facility</label>
              <select
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#cdced1] rounded bg-white text-[12px]"
              >
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Reason / Reference Note</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Inward PO / Lunch Prep Batch #4"
              className="w-full px-3 py-1.5 border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none"
            />
          </div>
        )}

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
            <span style={{ color: '#ffffff' }} className="text-white">
              {mode === 'in' ? 'Record Stock In' : mode === 'out' ? 'Issue to Kitchen' : 'Complete Transfer'}
            </span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

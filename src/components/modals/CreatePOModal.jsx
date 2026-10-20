import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Plus, Trash2 } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

export const CreatePOModal = ({ isOpen, onClose }) => {
  const { vendors, ingredients, addPurchaseOrder, locations } = useApp();

  const [vendorId, setVendorId] = useState(vendors[0]?.id || '');
  const [destinationKitchen, setDestinationKitchen] = useState(locations[0]?.name || 'Central Commissary & Base Kitchen');
  const [expectedDays, setExpectedDays] = useState(2);
  const [items, setItems] = useState([
    { ingredientId: ingredients[0]?.id || '', qty: 100, rate: ingredients[0]?.unitPrice || 78 },
  ]);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { ingredientId: ingredients[0]?.id || '', qty: 50, rate: ingredients[0]?.unitPrice || 50 },
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          if (field === 'ingredientId') {
            const matched = ingredients.find((ing) => ing.id === value);
            return {
              ...item,
              ingredientId: value,
              rate: matched ? matched.unitPrice : item.rate,
            };
          }
          return { ...item, [field]: Number(value) };
        }
        return item;
      })
    );
  };

  const subtotal = items.reduce((acc, it) => acc + (it.qty || 0) * (it.rate || 0), 0);
  const gst = Math.round(subtotal * 0.05); // 5% GST on food procurement
  const totalAmount = subtotal + gst;

  const handleSubmit = (e) => {
    e.preventDefault();
    const vendor = vendors.find((v) => v.id === vendorId);
    if (!vendor || items.length === 0) return;

    const formattedItems = items.map((it) => {
      const ing = ingredients.find((i) => i.id === it.ingredientId);
      return {
        ingredientId: it.ingredientId,
        name: ing ? ing.name : 'Raw Material',
        qty: it.qty,
        unit: ing ? ing.unit : 'kg',
        rate: it.rate,
        total: it.qty * it.rate,
      };
    });

    const expDate = new Date();
    expDate.setDate(expDate.getDate() + Number(expectedDays));

    addPurchaseOrder({
      vendorId: vendor.id,
      vendorName: vendor.name,
      destinationKitchen,
      expectedDate: expDate.toISOString().split('T')[0],
      items: formattedItems,
      subtotal,
      gst,
      totalAmount,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Institutional Purchase Order"
      subtitle="Issue formal purchase order with contracted supplier rates and automated receiving logs"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Select Approved Supplier *</label>
            <select
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              className="w-full px-3 py-1.5 border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none bg-white"
            >
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.category})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Delivery Destination Facility</label>
            <select
              value={destinationKitchen}
              onChange={(e) => setDestinationKitchen(e.target.value)}
              className="w-full px-3 py-1.5 border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none bg-white"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PO Line Items Table */}
        <div className="border border-[#e8eaec] rounded overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-[#f9fbfc] border-b border-[#e8eaec]">
            <span className="font-semibold text-[#131416] text-[12px]">Procurement Line Items</span>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1b6c80] hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="p-3 space-y-2">
            {items.map((item, idx) => {
              const ing = ingredients.find((i) => i.id === item.ingredientId);
              const lineTotal = (item.qty || 0) * (item.rate || 0);

              return (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 p-2 sm:p-0 bg-[#f4f6f8]/60 sm:bg-transparent rounded sm:rounded-none border border-[#e8eaec] sm:border-0">
                  <div className="flex-1">
                    <select
                      value={item.ingredientId}
                      onChange={(e) => handleItemChange(idx, 'ingredientId', e.target.value)}
                      className="w-full px-2 py-1 text-[12px] border border-[#cdced1] rounded bg-white"
                    >
                      {ingredients.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.name} ({i.unit})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 sm:w-24">
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={item.qty}
                        onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                        className="w-full px-2 py-1 text-[12px] border border-[#cdced1] rounded font-mono text-right"
                      />
                    </div>
                    <div className="w-20 sm:w-24">
                      <input
                        type="number"
                        min="1"
                        placeholder="Rate ₹"
                        value={item.rate}
                        onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                        className="w-full px-2 py-1 text-[12px] border border-[#cdced1] rounded font-mono text-right"
                      />
                    </div>
                    <div className="flex-1 sm:w-28 text-right font-mono text-[12px] font-semibold text-[#131416]">
                      {formatINR(lineTotal)}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1 text-[#737678] hover:text-[#c4242a]"
                      disabled={items.length === 1}
                      aria-label="Remove line item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cost Summary Footprint */}
          <div className="bg-[#f9fbfc] border-t border-[#e8eaec] px-4 py-3 flex flex-col sm:items-end space-y-1 text-[12px]">
            <div className="flex justify-between w-full sm:w-60">
              <span className="text-[#5d5f60]">Subtotal:</span>
              <span className="font-mono font-medium text-[#131416]">{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between w-full sm:w-60">
              <span className="text-[#5d5f60]">GST (5% Institutional):</span>
              <span className="font-mono font-medium text-[#131416]">{formatINR(gst)}</span>
            </div>
            <div className="flex justify-between w-full sm:w-60 pt-1 border-t border-[#e8eaec] font-semibold">
              <span className="text-[#131416]">Grand Total:</span>
              <span className="font-mono text-[#1b6c80] text-[14px]">{formatINR(totalAmount)}</span>
            </div>
          </div>
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
            <span style={{ color: '#ffffff' }} className="text-white">Generate & Dispatch PO</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

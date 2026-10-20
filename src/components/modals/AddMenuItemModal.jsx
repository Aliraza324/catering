import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

export const AddMenuItemModal = ({ isOpen, onClose }) => {
  const { addMenuItem, locations } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Lunch',
    dietary: 'Veg',
    cuisine: 'North Indian',
    price: 140,
    costPerPortion: 45,
    portionGrams: 400,
    calories: 620,
    description: '',
    locationId: locations[0]?.id || 'loc-1',
    allergens: 'Dairy',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    addMenuItem({
      name: formData.name,
      category: formData.category,
      dietary: formData.dietary,
      cuisine: formData.cuisine,
      price: Number(formData.price),
      costPerPortion: Number(formData.costPerPortion),
      portionGrams: Number(formData.portionGrams),
      calories: Number(formData.calories),
      description: formData.description || 'Prepared fresh by Aramya Foods culinary team.',
      locationId: formData.locationId,
      allergens: formData.allergens.split(',').map((a) => a.trim()).filter(Boolean),
    });

    onClose();
  };

  const margin = formData.price > 0 ? (((formData.price - formData.costPerPortion) / formData.price) * 100).toFixed(1) : 0;
  const foodCostPct = formData.price > 0 ? ((formData.costPerPortion / formData.price) * 100).toFixed(1) : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Menu Item / Thali"
      subtitle="Define recipe parameters, portion sizes and food cost targets"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
        <div>
          <label className="block text-[#5d5f60] mb-1 font-medium">Item / Thali Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Kashmiri Dum Aloo with Jeera Rice"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-1.5 border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Meal Slot</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-1.5 border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none bg-white"
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Snacks">Snacks / High-Tea</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Dietary Type</label>
            <select
              value={formData.dietary}
              onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
              className="w-full px-3 py-1.5 border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none bg-white"
            >
              <option value="Veg">Vegetarian</option>
              <option value="Non-Veg">Non-Vegetarian</option>
              <option value="Vegan / Jain Friendly">Vegan / Jain Friendly</option>
            </select>
          </div>
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Cuisine Style</label>
            <input
              type="text"
              placeholder="e.g. North Indian"
              value={formData.cuisine}
              onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
              className="w-full px-3 py-1.5 border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f9fbfc] p-3 border border-[#e8eaec] rounded">
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Selling Price (₹)</label>
            <input
              type="number"
              min="1"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-2 py-1 border border-[#cdced1] rounded font-mono"
            />
          </div>
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Cost / Portion (₹)</label>
            <input
              type="number"
              min="1"
              value={formData.costPerPortion}
              onChange={(e) => setFormData({ ...formData, costPerPortion: e.target.value })}
              className="w-full px-2 py-1 border border-[#cdced1] rounded font-mono"
            />
          </div>
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Portion (Grams)</label>
            <input
              type="number"
              min="50"
              value={formData.portionGrams}
              onChange={(e) => setFormData({ ...formData, portionGrams: e.target.value })}
              className="w-full px-2 py-1 border border-[#cdced1] rounded font-mono"
            />
          </div>
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Calories (kcal)</label>
            <input
              type="number"
              min="50"
              value={formData.calories}
              onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
              className="w-full px-2 py-1 border border-[#cdced1] rounded font-mono"
            />
          </div>
        </div>

        {/* Live economics preview */}
        <div className="flex flex-col min-[380px]:flex-row min-[380px]:items-center justify-between gap-1 text-[12px] px-3 py-2 bg-[#f4f6f8] rounded border border-[#e8eaec]">
          <div>
            <span className="text-[#5d5f60]">Gross Profit Margin: </span>
            <span className="font-semibold text-[#1e7b4f] font-mono">{margin}%</span>
          </div>
          <div>
            <span className="text-[#5d5f60]">Food Cost Ratio: </span>
            <span className={`font-semibold font-mono ${Number(foodCostPct) > 35 ? 'text-[#c4242a]' : 'text-[#131416]'}`}>
              {foodCostPct}% (Target: &lt;32%)
            </span>
          </div>
        </div>

        <div>
          <label className="block text-[#5d5f60] mb-1 font-medium">Recipe Dish Description</label>
          <textarea
            rows="2"
            placeholder="Details of curry, dal, bread count, accompaniment and sides..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-1.5 border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Allergen Declarations</label>
            <input
              type="text"
              placeholder="e.g. Dairy, Gluten, Peanuts"
              value={formData.allergens}
              onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
              className="w-full px-3 py-1.5 border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Production Facility</label>
            <select
              value={formData.locationId}
              onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
              className="w-full px-3 py-1.5 border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none bg-white"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
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
            <span style={{ color: '#ffffff' }} className="text-white">Add to Menu Catalog</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

export const AddClientModal = ({ isOpen, onClose }) => {
  const { addClient, locations } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    segment: 'IT / Software Campus',
    address: '',
    spoc: '',
    phone: '',
    email: '',
    gstin: '',
    headcount: 500,
    assignedKitchenId: locations[0]?.id || 'loc-1',
    contractType: 'Full 3-Meal Daily Service',
    billingCycle: 'Monthly (Net 30)',
    breakfastLimit: 200,
    lunchLimit: 450,
    dinnerLimit: 150,
    snacksLimit: 300,
    breakfastRate: 75,
    lunchRate: 140,
    dinnerRate: 130,
    snacksRate: 50,
    monthlyBudgetCap: 2500000,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const assignedKitchenName =
      locations.find((l) => l.id === formData.assignedKitchenId)?.name || 'Central Kitchen';

    addClient({
      name: formData.name,
      segment: formData.segment,
      address: formData.address,
      spoc: formData.spoc,
      phone: formData.phone,
      email: formData.email,
      gstin: formData.gstin || '07AAAAA0000A1Z5',
      headcount: Number(formData.headcount),
      assignedKitchenId: formData.assignedKitchenId,
      assignedKitchenName,
      contractType: formData.contractType,
      billingCycle: formData.billingCycle,
      mealLimits: {
        breakfast: Number(formData.breakfastLimit),
        lunch: Number(formData.lunchLimit),
        dinner: Number(formData.dinnerLimit),
        snacks: Number(formData.snacksLimit),
      },
      mealRates: {
        breakfast: Number(formData.breakfastRate),
        lunch: Number(formData.lunchRate),
        dinner: Number(formData.dinnerRate),
        snacks: Number(formData.snacksRate),
      },
      monthlyBudgetCap: Number(formData.monthlyBudgetCap),
      currentMonthConsumption: 0,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register Corporate Client"
      subtitle="Establish new catering contract terms, daily meal quota and service kitchen"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Company / Client Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Innovate Global Hub"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-1.5 border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Industry Segment</label>
            <select
              value={formData.segment}
              onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
              className="w-full px-3 py-1.5 border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none bg-white"
            >
              <option value="IT / Software Campus">IT / Software Campus</option>
              <option value="Pharmaceutical & R&D Hub">Pharmaceutical & R&D Hub</option>
              <option value="Investment Banking & Financial">Investment Banking & Financial</option>
              <option value="Manufacturing & Plant Canteen">Manufacturing & Plant Canteen</option>
              <option value="Hospitality & Coworking">Hospitality & Coworking</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[#5d5f60] mb-1 font-medium">Corporate Site Address</label>
          <input
            type="text"
            placeholder="Tower, Plot, SEZ Zone, City"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-3 py-1.5 border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Contact SPOC Person</label>
            <input
              type="text"
              placeholder="Full name & title"
              value={formData.spoc}
              onChange={(e) => setFormData({ ...formData, spoc: e.target.value })}
              className="w-full px-3 py-1.5 border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Phone</label>
            <input
              type="text"
              placeholder="+91 98111..."
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-1.5 border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Official Email</label>
            <input
              type="email"
              placeholder="admin@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-1.5 border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#f0f1f2]">
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Staff Headcount</label>
            <input
              type="number"
              min="10"
              value={formData.headcount}
              onChange={(e) => setFormData({ ...formData, headcount: e.target.value })}
              className="w-full px-3 py-1.5 border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none font-mono"
            />
          </div>
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Assigned Production Kitchen</label>
            <select
              value={formData.assignedKitchenId}
              onChange={(e) => setFormData({ ...formData, assignedKitchenId: e.target.value })}
              className="w-full px-3 py-1.5 border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none bg-white"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Billing Cycle</label>
            <select
              value={formData.billingCycle}
              onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
              className="w-full px-3 py-1.5 border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none bg-white"
            >
              <option value="Monthly (Net 30)">Monthly (Net 30)</option>
              <option value="Monthly (Net 15)">Monthly (Net 15)</option>
              <option value="Fortnightly (Net 15)">Fortnightly (Net 15)</option>
              <option value="Weekly Cycle">Weekly Cycle</option>
            </select>
          </div>
        </div>

        {/* Meal Limits & Rates */}
        <div className="pt-2 border-t border-[#f0f1f2]">
          <h3 className="font-semibold text-[#131416] mb-2 text-[13px]">Daily Meal Caps & Negotiated Rates (₹)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-[#f9fbfc] p-2 border border-[#e8eaec] rounded">
              <span className="font-medium text-[#131416] block text-[12px]">Breakfast</span>
              <input
                type="number"
                placeholder="Cap"
                value={formData.breakfastLimit}
                onChange={(e) => setFormData({ ...formData, breakfastLimit: e.target.value })}
                className="w-full mt-1 px-2 py-1 text-[12px] border border-[#cdced1] rounded font-mono"
              />
              <span className="text-[11px] text-[#737678] mt-1 block">Rate: ₹{formData.breakfastRate}</span>
            </div>
            <div className="bg-[#f9fbfc] p-2 border border-[#e8eaec] rounded">
              <span className="font-medium text-[#131416] block text-[12px]">Lunch</span>
              <input
                type="number"
                placeholder="Cap"
                value={formData.lunchLimit}
                onChange={(e) => setFormData({ ...formData, lunchLimit: e.target.value })}
                className="w-full mt-1 px-2 py-1 text-[12px] border border-[#cdced1] rounded font-mono"
              />
              <span className="text-[11px] text-[#737678] mt-1 block">Rate: ₹{formData.lunchRate}</span>
            </div>
            <div className="bg-[#f9fbfc] p-2 border border-[#e8eaec] rounded">
              <span className="font-medium text-[#131416] block text-[12px]">Evening Snacks</span>
              <input
                type="number"
                placeholder="Cap"
                value={formData.snacksLimit}
                onChange={(e) => setFormData({ ...formData, snacksLimit: e.target.value })}
                className="w-full mt-1 px-2 py-1 text-[12px] border border-[#cdced1] rounded font-mono"
              />
              <span className="text-[11px] text-[#737678] mt-1 block">Rate: ₹{formData.snacksRate}</span>
            </div>
            <div className="bg-[#f9fbfc] p-2 border border-[#e8eaec] rounded">
              <span className="font-medium text-[#131416] block text-[12px]">Dinner</span>
              <input
                type="number"
                placeholder="Cap"
                value={formData.dinnerLimit}
                onChange={(e) => setFormData({ ...formData, dinnerLimit: e.target.value })}
                className="w-full mt-1 px-2 py-1 text-[12px] border border-[#cdced1] rounded font-mono"
              />
              <span className="text-[11px] text-[#737678] mt-1 block">Rate: ₹{formData.dinnerRate}</span>
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
            className="px-4 py-1.5 rounded bg-[#131416] hover:bg-[#222] text-white font-medium transition-colors"
            style={{ color: '#ffffff' }}
          >
            <span className="text-white" style={{ color: '#ffffff' }}>Register Client Contract</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

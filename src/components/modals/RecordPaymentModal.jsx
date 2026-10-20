import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/formatters';

export const RecordPaymentModal = ({ isOpen, onClose, selectedInvoice = null }) => {
  const { invoices, recordInvoicePayment } = useApp();

  const [invoiceId, setInvoiceId] = useState(selectedInvoice?.id || invoices[0]?.id || '');
  const activeInvoice = invoices.find((inv) => inv.id === invoiceId) || invoices[0];

  const balanceDue = activeInvoice ? Math.max(0, activeInvoice.totalAmount - (activeInvoice.paidAmount || 0)) : 0;
  const [amount, setAmount] = useState(balanceDue || 100000);
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentMode, setPaymentMode] = useState('NEFT / RTGS Corporate Transfer');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!activeInvoice || amount <= 0) return;

    recordInvoicePayment(
      activeInvoice.id,
      Number(amount),
      paymentRef || `BANK-UTR-${Date.now().toString().slice(-6)}`
    );

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Client Payment"
      subtitle="Reconcile incoming corporate bank remittances against outstanding catering tax invoices"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
        <div>
          <label className="block text-[#5d5f60] mb-1 font-medium">Select Tax Invoice</label>
          <select
            value={invoiceId}
            onChange={(e) => {
              const id = e.target.value;
              setInvoiceId(id);
              const inv = invoices.find((i) => i.id === id);
              if (inv) {
                setAmount(Math.max(0, inv.totalAmount - (inv.paidAmount || 0)));
              }
            }}
            className="w-full px-3 py-1.5 border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none bg-white font-mono text-[12px]"
          >
            {invoices.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.invoiceNumber} — {inv.clientName} (Due: {formatINR(inv.totalAmount - (inv.paidAmount || 0))})
              </option>
            ))}
          </select>
        </div>

        {activeInvoice && (
          <div className="p-3 bg-[#f9fbfc] border border-[#e8eaec] rounded space-y-1.5 text-[12px]">
            <div className="flex justify-between">
              <span className="text-[#5d5f60]">Billed Client:</span>
              <span className="font-semibold text-[#131416]">{activeInvoice.clientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5d5f60]">Billing Cycle:</span>
              <span className="text-[#131416]">{activeInvoice.period}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5d5f60]">Total Invoice Value:</span>
              <span className="font-mono font-medium text-[#131416]">{formatINR(activeInvoice.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5d5f60]">Already Remitted:</span>
              <span className="font-mono text-[#1e7b4f]">{formatINR(activeInvoice.paidAmount || 0)}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-[#e8eaec] font-semibold">
              <span className="text-[#131416]">Outstanding Balance:</span>
              <span className="font-mono text-[#c4242a]">{formatINR(balanceDue)}</span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-[#5d5f60] mb-1 font-medium">Payment Amount (₹) *</label>
          <input
            type="number"
            min="1"
            max={balanceDue > 0 ? balanceDue : undefined}
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-1.5 border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none font-mono text-[14px]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Payment Mode</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-[#cdced1] rounded bg-white text-[12px]"
            >
              <option value="NEFT / RTGS Corporate Transfer">NEFT / RTGS Transfer</option>
              <option value="Direct Corporate ACH Clearing">Direct Corporate ACH</option>
              <option value="Company Cheque Deposit">Company Cheque Deposit</option>
            </select>
          </div>
          <div>
            <label className="block text-[#5d5f60] mb-1 font-medium">Bank UTR / Transaction Ref</label>
            <input
              type="text"
              placeholder="e.g. HDFC-RTGS-991823"
              value={paymentRef}
              onChange={(e) => setPaymentRef(e.target.value)}
              className="w-full px-3 py-1.5 border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none font-mono text-[12px]"
            />
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
            <span style={{ color: '#ffffff' }} className="text-white">Record & Reconcile Payment</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatINR, formatDate } from '../utils/formatters';
import { Receipt, Plus, FileText, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { InvoicePreviewModal } from '../components/modals/InvoicePreviewModal';
import { RecordPaymentModal } from '../components/modals/RecordPaymentModal';
import { Badge } from '../components/common/Badge';

export const BillingPage = () => {
  const { invoices, totalOutstandingBalance } = useApp();
  const [selectedInvoiceForPreview, setSelectedInvoiceForPreview] = useState(null);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredInvoices =
    statusFilter === 'All'
      ? invoices
      : invoices.filter((inv) => inv.status === statusFilter);

  const totalInvoiced = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalCollected = invoices.reduce((acc, inv) => acc + (inv.paidAmount || 0), 0);

  const handleExportCSV = () => {
    let csv = 'Invoice Number,Corporate Client,Period,Total Meals,Subtotal,GST,Total Amount,Paid Amount,Balance Due,Status\n';
    invoices.forEach((inv) => {
      const bal = inv.totalAmount - (inv.paidAmount || 0);
      csv += `"${inv.invoiceNumber}","${inv.clientName}","${inv.period}",${inv.totalMeals},${inv.subtotal},${inv.gst},${inv.totalAmount},${inv.paidAmount || 0},${bal},"${inv.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AramyaFoods_Billing_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#e8eaec]">
        <div>
          <h1 className="text-[22px] font-semibold text-[#131416] tracking-tight leading-tight">
            Corporate Sales, Invoicing & Accounts Receivable
          </h1>
          <p className="text-[13.5px] text-[#5d5f60] mt-1">
            Fortnightly and monthly institutional catering statements, GST compliance breakdowns and payment reconciliation
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 text-[12px] font-medium border border-[#cdced1] hover:bg-[#ebedee] text-[#131416] rounded transition-colors w-full sm:w-auto"
          >
            <Download className="w-3.5 h-3.5 text-[#5d5f60] shrink-0" />
            <span>Export Billing CSV</span>
          </button>
          <button
            onClick={() => setSelectedInvoiceForPayment(invoices[0])}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 text-[12px] font-medium bg-[#131416] hover:bg-[#242629] text-white rounded transition-colors w-full sm:w-auto"
            style={{ color: '#ffffff' }}
          >
            <Plus className="w-4 h-4 text-white shrink-0" style={{ color: '#ffffff', stroke: '#ffffff' }} />
            <span className="text-white font-medium" style={{ color: '#ffffff' }}>Record Payment</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 min-[440px]:grid-cols-3 gap-2.5 sm:gap-3">
        <div className="bg-white border border-[#e8eaec] rounded p-4">
          <span className="text-[11px] font-medium text-[#5d5f60]">Total Billed (Active Cycle)</span>
          <div className="text-[24px] font-bold text-[#131416] font-mono mt-1">
            {formatINR(totalInvoiced)}
          </div>
          <span className="text-[11px] text-[#5d5f60]">Across 3 corporate client campuses</span>
        </div>

        <div className="bg-white border border-[#e8eaec] rounded p-4">
          <span className="text-[11px] font-medium text-[#5d5f60]">Total Remitted Collections</span>
          <div className="text-[24px] font-bold text-[#1e7b4f] font-mono mt-1">
            {formatINR(totalCollected)}
          </div>
          <span className="text-[11px] text-[#1e7b4f]">
            {((totalCollected / totalInvoiced) * 100).toFixed(1)}% recovery rate
          </span>
        </div>

        <div className="bg-white border border-[#e8eaec] rounded p-4">
          <span className="text-[11px] font-medium text-[#5d5f60]">Outstanding Receivables Due</span>
          <div className="text-[24px] font-bold text-[#c4242a] font-mono mt-1">
            {formatINR(totalOutstandingBalance)}
          </div>
          <span className="text-[11px] text-[#c4242a]">Net 15/30 grace period active</span>
        </div>
      </div>

      {/* Invoices List with Filters */}
      <div className="bg-white border border-[#e8eaec] rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-[#e8eaec] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f9fbfc]">
          <h2 className="text-[14px] font-semibold text-[#131416]">
            Tax Invoices & Billing Records ({invoices.length})
          </h2>

          <div className="flex items-center gap-1.5 text-[12px]">
            <span className="text-[#5d5f60]">Status:</span>
            {['All', 'Paid', 'Partially Paid', 'Unpaid'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-0.5 rounded font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-[#131416] text-white'
                    : 'text-[#5d5f60] hover:bg-[#ebedee]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="bg-[#f9fbfc] border-b border-[#e8eaec] text-[#5d5f60] font-medium">
                <th className="py-2.5 px-3">Invoice No</th>
                <th className="py-2.5 px-3">Corporate Client</th>
                <th className="py-2.5 px-3">Billing Span</th>
                <th className="py-2.5 px-3 text-right">Meals Billed</th>
                <th className="py-2.5 px-3 text-right">Invoice Value (₹)</th>
                <th className="py-2.5 px-3 text-right">Received (₹)</th>
                <th className="py-2.5 px-3 text-right">Balance Due (₹)</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f1f2]">
              {filteredInvoices.map((inv) => {
                const bal = Math.max(0, inv.totalAmount - (inv.paidAmount || 0));

                return (
                  <tr key={inv.id} className="hover:bg-[#f9fbfc]">
                    <td className="py-3 px-3 font-mono font-medium text-[#131416]">{inv.invoiceNumber}</td>
                    <td className="py-3 px-3 font-semibold text-[#131416]">{inv.clientName}</td>
                    <td className="py-3 px-3 text-[#5d5f60] font-mono text-[11px]">{inv.period}</td>
                    <td className="py-3 px-3 text-right font-mono text-[#5d5f60]">{inv.totalMeals.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#131416]">
                      {formatINR(inv.totalAmount)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-medium text-[#1e7b4f]">
                      {formatINR(inv.paidAmount || 0)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#c4242a]">
                      {formatINR(bal)}
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={
                          inv.status === 'Paid'
                            ? 'positive'
                            : inv.status === 'Partially Paid'
                            ? 'warning'
                            : 'negative'
                        }
                      >
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedInvoiceForPreview(inv)}
                          className="px-2 py-1 text-[11px] font-medium border border-[#cdced1] hover:bg-[#ebedee] text-[#131416] rounded"
                          title="View / Print Tax Invoice"
                        >
                          View Invoice
                        </button>
                        {bal > 0 && (
                          <button
                            onClick={() => setSelectedInvoiceForPayment(inv)}
                            className="px-2.5 py-1 text-[11px] font-medium bg-[#131416] hover:bg-[#222] text-white rounded transition-colors whitespace-nowrap"
                            style={{ color: '#ffffff' }}
                            title="Record incoming payment"
                          >
                            <span className="text-white" style={{ color: '#ffffff' }}>Pay</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <InvoicePreviewModal
        isOpen={Boolean(selectedInvoiceForPreview)}
        onClose={() => setSelectedInvoiceForPreview(null)}
        invoice={selectedInvoiceForPreview}
      />
      <RecordPaymentModal
        isOpen={Boolean(selectedInvoiceForPayment)}
        onClose={() => setSelectedInvoiceForPayment(null)}
        selectedInvoice={selectedInvoiceForPayment}
      />
    </div>
  );
};

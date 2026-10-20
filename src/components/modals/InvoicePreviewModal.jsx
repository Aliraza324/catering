import React from 'react';
import { Modal } from '../common/Modal';
import { COMPANY_INFO } from '../../data/mockData';
import { formatINR, formatDate } from '../../utils/formatters';
import { Printer } from 'lucide-react';
import { Badge } from '../common/Badge';

export const InvoicePreviewModal = ({ isOpen, onClose, invoice }) => {
  if (!invoice) return null;

  const balanceDue = Math.max(0, invoice.totalAmount - (invoice.paidAmount || 0));

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Tax Invoice: ${invoice.invoiceNumber}`}
      subtitle="Corporate catering billing statement and GST breakdown"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6 text-[13px] print:text-black">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start pb-4 border-b border-[#e8eaec] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded bg-[#1b6c80] flex items-center justify-center text-white font-bold text-[13px]">
                AF
              </div>
              <h2 className="text-[17px] font-bold text-[#131416] tracking-tight">{COMPANY_INFO.name}</h2>
            </div>
            <p className="text-[11px] text-[#5d5f60] max-w-sm">{COMPANY_INFO.headquarters}</p>
            <div className="mt-2 text-[11px] text-[#5d5f60] space-y-0.5">
              <div><strong className="text-[#131416]">GSTIN:</strong> {COMPANY_INFO.gstin}</div>
              <div><strong className="text-[#131416]">FSSAI Lic:</strong> {COMPANY_INFO.fssaiLicense}</div>
              <div><strong className="text-[#131416]">CIN:</strong> {COMPANY_INFO.regNo}</div>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="inline-block text-[18px] font-bold text-[#131416] tracking-tight font-mono">
              TAX INVOICE
            </span>
            <div className="mt-1 text-[12px] space-y-1">
              <div><span className="text-[#5d5f60]">Invoice No: </span><span className="font-mono font-semibold">{invoice.invoiceNumber}</span></div>
              <div><span className="text-[#5d5f60]">Issue Date: </span><span>{formatDate(invoice.issueDate)}</span></div>
              <div><span className="text-[#5d5f60]">Due Date: </span><span>{formatDate(invoice.dueDate)}</span></div>
              <div className="pt-1">
                <Badge
                  variant={
                    invoice.status === 'Paid'
                      ? 'positive'
                      : invoice.status === 'Partially Paid'
                      ? 'warning'
                      : 'negative'
                  }
                >
                  {invoice.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#f9fbfc] p-3.5 border border-[#e8eaec] rounded">
          <div>
            <span className="text-[11px] font-semibold text-[#737678] uppercase tracking-wider block mb-1">
              Billed To Corporate Client
            </span>
            <h3 className="font-semibold text-[#131416] text-[14px]">{invoice.clientName}</h3>
            <p className="text-[12px] text-[#5d5f60] mt-0.5">Corporate Headquarters / Main Facility</p>
            <p className="text-[11px] text-[#5d5f60] mt-1 font-mono">Billing Cycle: {invoice.period}</p>
          </div>
          <div className="sm:text-right text-[12px] text-[#5d5f60]">
            <div>Payment Terms: <strong>Net 30 Days</strong></div>
            <div>Facility Node: <strong>Central Hub & Finishing Pantry</strong></div>
            {invoice.paymentRef && (
              <div className="mt-2 text-[11px] text-[#1e7b4f] font-mono">
                Settlement Ref: {invoice.paymentRef}
              </div>
            )}
          </div>
        </div>

        {/* Itemized Table */}
        <div className="border border-[#e8eaec] rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] sm:min-w-0 text-left border-collapse">
              <thead>
                <tr className="bg-[#f9fbfc] border-b border-[#e8eaec] text-[11px] font-semibold text-[#5d5f60] uppercase">
                  <th className="py-2.5 px-3">Description of Catering Service</th>
                  <th className="py-2.5 px-3 text-right">HSN/SAC</th>
                  <th className="py-2.5 px-3 text-right">Meals Served</th>
                  <th className="py-2.5 px-3 text-right">Rate / Meal</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f1f2] text-[12px]">
                <tr>
                  <td className="py-2 px-3 font-medium text-[#131416]">
                    Executive Lunch Thali Service
                    <span className="block text-[11px] text-[#5d5f60]">Standard rotational menu with dessert & curd</span>
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-[#5d5f60]">996331</td>
                  <td className="py-2 px-3 text-right font-mono">{Math.round(invoice.totalMeals * 0.55).toLocaleString('en-IN')}</td>
                  <td className="py-2 px-3 text-right font-mono">₹140.00</td>
                  <td className="py-2 px-3 text-right font-mono font-medium">
                    {formatINR(Math.round(invoice.totalMeals * 0.55 * 140))}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-[#131416]">
                    Morning Breakfast & Continental Buffet
                    <span className="block text-[11px] text-[#5d5f60]">Idli, Vada, Poha, Tea & Coffee counter</span>
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-[#5d5f60]">996331</td>
                  <td className="py-2 px-3 text-right font-mono">{Math.round(invoice.totalMeals * 0.25).toLocaleString('en-IN')}</td>
                  <td className="py-2 px-3 text-right font-mono">₹75.00</td>
                  <td className="py-2 px-3 text-right font-mono font-medium">
                    {formatINR(Math.round(invoice.totalMeals * 0.25 * 75))}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-[#131416]">
                    Evening High-Tea, Samosas & Snacks
                    <span className="block text-[11px] text-[#5d5f60]">Fresh snacks & chai service for shifts</span>
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-[#5d5f60]">996331</td>
                  <td className="py-2 px-3 text-right font-mono">{Math.round(invoice.totalMeals * 0.20).toLocaleString('en-IN')}</td>
                  <td className="py-2 px-3 text-right font-mono">₹50.00</td>
                  <td className="py-2 px-3 text-right font-mono font-medium">
                    {formatINR(Math.round(invoice.totalMeals * 0.20 * 50))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="bg-[#f9fbfc] border-t border-[#e8eaec] p-3 flex flex-col sm:items-end space-y-1.5 text-[12px]">
            <div className="flex justify-between w-full sm:w-64">
              <span className="text-[#5d5f60]">Subtotal:</span>
              <span className="font-mono font-medium text-[#131416]">{formatINR(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between w-full sm:w-64">
              <span className="text-[#5d5f60]">CGST (2.5%):</span>
              <span className="font-mono font-medium text-[#131416]">{formatINR(invoice.gst / 2)}</span>
            </div>
            <div className="flex justify-between w-full sm:w-64">
              <span className="text-[#5d5f60]">SGST (2.5%):</span>
              <span className="font-mono font-medium text-[#131416]">{formatINR(invoice.gst / 2)}</span>
            </div>
            <div className="flex justify-between w-full sm:w-64 pt-1.5 border-t border-[#e8eaec] font-bold text-[13px]">
              <span className="text-[#131416]">Total Invoice Value:</span>
              <span className="font-mono text-[#1b6c80]">{formatINR(invoice.totalAmount)}</span>
            </div>
            <div className="flex justify-between w-full sm:w-64 text-[#1e7b4f]">
              <span>Amount Received:</span>
              <span className="font-mono font-medium">{formatINR(invoice.paidAmount || 0)}</span>
            </div>
            <div className="flex justify-between w-full sm:w-64 pt-1 border-t border-[#e8eaec] font-bold text-[#c4242a]">
              <span>Balance Outstanding:</span>
              <span className="font-mono">{formatINR(balanceDue)}</span>
            </div>
          </div>
        </div>

        {/* Banking and Terms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] text-[#5d5f60] pt-2 border-t border-[#e8eaec]">
          <div>
            <span className="font-semibold text-[#131416] block mb-1">Corporate Bank Remittance Details:</span>
            <div>Bank: HDFC Bank Ltd (Okhla Industrial Area)</div>
            <div>A/C Name: ARAMYA FOODS PRIVATE LIMITED</div>
            <div>Current A/C No: 50200039182310</div>
            <div>IFSC Code: HDFC0000043</div>
          </div>
          <div className="sm:text-right">
            <span className="font-semibold text-[#131416] block mb-1">Authorised Signatory:</span>
            <div className="mt-4 font-mono font-medium text-[#131416]">For ARAMYA FOODS PVT LTD</div>
            <div>Accounts & Institutional Finance Desk</div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#e8eaec]">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded border border-[#cdced1] text-[#5d5f60] hover:text-[#131416] hover:bg-[#ebedee] transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            style={{ color: '#ffffff', backgroundColor: '#131416' }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded bg-[#131416] text-white font-medium hover:bg-[#222] transition-colors"
          >
            <Printer className="w-4 h-4 text-white" style={{ stroke: '#ffffff' }} />
            <span style={{ color: '#ffffff' }} className="text-white">Print Invoice</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

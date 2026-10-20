import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatINR, formatDate } from '../utils/formatters';
import { ShoppingBag, Plus, CheckCircle, Clock, Truck, Building, Phone, Mail } from 'lucide-react';
import { CreatePOModal } from '../components/modals/CreatePOModal';
import { Badge } from '../components/common/Badge';

export const PurchasingPage = () => {
  const { vendors, purchaseOrders, receivePurchaseOrder } = useApp();
  const [isCreatePOOpen, setIsCreatePOOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'vendors'

  const totalProcurementSpend = purchaseOrders.reduce((acc, po) => acc + po.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#e8eaec]">
        <div>
          <h1 className="text-[22px] font-semibold text-[#131416] tracking-tight leading-tight">
            Purchasing & Institutional Vendor Procurement
          </h1>
          <p className="text-[13.5px] text-[#5d5f60] mt-1">
            Contracted agricultural grain mills, APMC cold-chain vegetables, dairy bulk supply and delivery receipt tracking
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="flex bg-[#f4f6f8] p-0.5 rounded border border-[#cdced1] text-[12px]">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 sm:flex-initial text-center px-3 py-1 font-medium rounded transition-colors ${
                activeTab === 'orders' ? 'bg-white text-[#131416]' : 'text-[#5d5f60] hover:text-[#131416]'
              }`}
            >
              Purchase Orders
            </button>
            <button
              onClick={() => setActiveTab('vendors')}
              className={`flex-1 sm:flex-initial text-center px-3 py-1 font-medium rounded transition-colors ${
                activeTab === 'vendors' ? 'bg-white text-[#131416]' : 'text-[#5d5f60] hover:text-[#131416]'
              }`}
            >
              Approved Suppliers
            </button>
          </div>

          <button
            onClick={() => setIsCreatePOOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 text-[12px] font-medium bg-[#131416] hover:bg-[#242629] text-white rounded transition-colors w-full sm:w-auto"
            style={{ color: '#ffffff' }}
          >
            <Plus className="w-4 h-4 text-white shrink-0" style={{ color: '#ffffff', stroke: '#ffffff' }} />
            <span className="text-white font-medium" style={{ color: '#ffffff' }}>Generate Purchase Order</span>
          </button>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <div className="space-y-4">
          {/* Purchase Orders Table */}
          <div className="bg-white border border-[#e8eaec] rounded-lg overflow-hidden">
            <div className="px-5 py-3 border-b border-[#e8eaec] flex items-center justify-between bg-[#f9fbfc]">
              <h2 className="text-[14px] font-semibold text-[#131416]">
                Institutional Procurement Orders ({purchaseOrders.length})
              </h2>
              <span className="text-[12px] text-[#5d5f60]">
                Total PO Commitments: <strong className="font-mono text-[#131416]">{formatINR(totalProcurementSpend)}</strong>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[12px]">
                <thead>
                  <tr className="bg-[#f9fbfc] border-b border-[#e8eaec] text-[#5d5f60] font-medium">
                    <th className="py-2.5 px-3">PO Number</th>
                    <th className="py-2.5 px-3">Vendor / Supplier</th>
                    <th className="py-2.5 px-3">Delivery Kitchen</th>
                    <th className="py-2.5 px-3">PO Date</th>
                    <th className="py-2.5 px-3">Expected Inward</th>
                    <th className="py-2.5 px-3 text-right">Items Count</th>
                    <th className="py-2.5 px-3 text-right">PO Total (₹)</th>
                    <th className="py-2.5 px-3">Delivery Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f1f2]">
                  {purchaseOrders.map((po) => {
                    const isDelivered = po.status === 'Delivered';

                    return (
                      <tr key={po.id} className="hover:bg-[#f9fbfc]">
                        <td className="py-3 px-3 font-mono font-medium text-[#131416]">{po.poNumber}</td>
                        <td className="py-3 px-3 font-semibold text-[#131416]">{po.vendorName}</td>
                        <td className="py-3 px-3 text-[#5d5f60]">{po.destinationKitchen}</td>
                        <td className="py-3 px-3 font-mono text-[#5d5f60]">{formatDate(po.date)}</td>
                        <td className="py-3 px-3 font-mono text-[#5d5f60]">{formatDate(po.expectedDate)}</td>
                        <td className="py-3 px-3 text-right font-mono text-[#5d5f60]">{po.items?.length || 0}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-[#131416]">
                          {formatINR(po.totalAmount)}
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant={isDelivered ? 'positive' : 'warning'}>
                            {po.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {!isDelivered ? (
                            <button
                              onClick={() => receivePurchaseOrder(po.id)}
                              className="px-2.5 py-1 text-[11px] font-medium bg-[#131416] hover:bg-[#222] text-white rounded transition-colors whitespace-nowrap"
                              style={{ color: '#ffffff' }}
                            >
                              <span className="text-white" style={{ color: '#ffffff' }}>Receive Delivery</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-[#1e7b4f] font-medium inline-flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Inwarded</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Vendors Directory */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="bg-white border border-[#e8eaec] rounded-lg p-5 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-medium text-[#1b6c80] uppercase tracking-wider block">
                    {vendor.category}
                  </span>
                  <h3 className="text-[16px] font-semibold text-[#131416] mt-0.5">{vendor.name}</h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#f4f6f8] text-[#131416] text-[11px] font-mono font-semibold">
                  Rating: {vendor.rating} / 5.0
                </span>
              </div>

              <div className="p-3 bg-[#f9fbfc] border border-[#e8eaec] rounded space-y-1 text-[12px] text-[#5d5f60]">
                <div>Contact SPOC: <strong className="text-[#131416]">{vendor.contactPerson}</strong></div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{vendor.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{vendor.email}</span>
                </div>
                <div className="font-mono text-[11px] pt-1">GSTIN: {vendor.gstin}</div>
              </div>

              <div className="flex justify-between items-center text-[12px] pt-2 border-t border-[#f0f1f2]">
                <div>
                  <span className="text-[#5d5f60]">Terms: </span>
                  <span className="font-medium text-[#131416]">{vendor.paymentTerms}</span>
                </div>
                <div>
                  <span className="text-[#5d5f60]">FY Spend: </span>
                  <span className="font-mono font-bold text-[#131416]">{formatINR(vendor.totalSpendFY)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreatePOModal
        isOpen={isCreatePOOpen}
        onClose={() => setIsCreatePOOpen(false)}
      />
    </div>
  );
};

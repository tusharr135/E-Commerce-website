import { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import {
  Search, SlidersHorizontal, ShoppingBag, Eye, Calendar,
  TrendingUp, CheckCircle, Package, Truck, Smile, X, CircleAlert, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Order } from '../../types';

export default function Orders() {
  const { orders, updateOrderStatus, deleteOrder, clearAllOrders, addToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Detail Modal control states
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    addToast(`Order #${orderId} status updated to: ${newStatus.toUpperCase()}`, 'success');
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'confirmed': return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'packed': return 'bg-indigo-100 text-indigo-900 border-indigo-200';
      case 'shipped': return 'bg-purple-100 text-purple-950 border-purple-200';
      case 'delivered': return 'bg-emerald-100 text-emerald-850 border-emerald-200';
      case 'cancelled': return 'bg-rose-100 text-rose-900 border-rose-200';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  // Filter List
  const filteredList = orders.filter((o) => {
    const matchesSearch = o.shipping_address.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div id="admin-orders-board" className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 font-sans text-slate-805 bg-slate-50/20">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-emerald-950 tracking-tight">
            Buyer Invoices & Dispatches
          </h2>
          <p className="text-xs text-slate-450 mt-1">
            Monitor incoming orders, edit logistical statuses, and update tracking timelines for rural dispatches.
          </p>
        </div>
        {orders.length > 0 && (
          <button
            id="admin-clear-all-orders-btn"
            onClick={() => {
              if (window.confirm('Are you absolutely sure you want to delete ALL order data? This will set active orders to 0.')) {
                clearAllOrders();
              }
            }}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 hover:border-rose-300 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete All Order Data (0)</span>
          </button>
        )}
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
        
        {/* Search */}
        <div className="relative w-full sm:flex-1 text-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="admin-order-search"
            type="text"
            placeholder="Search by Order ID or Buyer Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 focus:bg-white text-xs sm:text-sm"
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm">
          <SlidersHorizontal className="h-4 w-4 text-slate-400 shrink-0 hidden sm:block" />
          <select
            id="admin-status-dropdown"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-44 p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 text-xs text-slate-650"
          >
            <option value="all">All Dispatches</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden text-xs sm:text-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] sm:text-xs font-extrabold text-slate-400 uppercase tracking-widest bg-slate-50">
                <th className="py-3 px-4">Invoice ID</th>
                <th className="py-3 px-4">Buyer Coordinates</th>
                <th className="py-3 px-4">Order Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Logistics Status</th>
                <th className="py-3 px-4 text-right">View details</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-12 text-slate-400 italic">
                    No orders found matched with the parameters specified.
                  </td>
                </tr>
              ) : (
                filteredList.map((o) => (
                  <tr key={o.id} className="border-b border-slate-100/60 last:border-0 hover:bg-slate-50/40">
                    
                    {/* Invoice ID */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-emerald-850 font-bold block">
                        #{o.id}
                      </span>
                      <span className="text-[10px] text-slate-400 capitalize">via {o.payment_method}</span>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4 pr-2">
                      <p className="font-bold text-slate-800">{o.shipping_address.fullName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{o.shipping_address.phone}</p>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 pr-2">
                      <p className="font-medium text-slate-700 capitalize">
                        {new Date(o.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      ₹{o.total_amount}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        id={`status-select-${o.id}`}
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value as Order['status'])}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1 border focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white ${getStatusBadgeStyle(o.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Actions view */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          id={`view-order-details-${o.id}`}
                          onClick={() => setSelectedOrder(o)}
                          className="px-3.5 py-1.5 text-xs text-emerald-800 font-semibold bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 hover:border-emerald-200 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1 leading-none"
                        >
                          <Eye className="h-4 w-4 shrink-0" />
                          <span>Inspect</span>
                        </button>
                        <button
                          id={`delete-order-${o.id}`}
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete order #${o.id}?`)) {
                              deleteOrder(o.id);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg transition-all cursor-pointer inline-flex items-center"
                          title="Delete Order"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail overlay inspection dialog */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-slate-900/60 z-30"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-24 sm:w-full sm:max-w-lg bg-white rounded-3xl p-6 sm:p-8 z-40 shadow-2xl overflow-y-auto max-h-[80vh] font-sans text-slate-800"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h3 className="font-display font-bold text-lg text-emerald-950 flex items-center gap-1.5">
                  <ShoppingBag className="h-5 w-5 text-emerald-700" />
                  Inspect Order Invoicing
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-450 cursor-pointer shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col gap-5 mt-5 text-xs sm:text-sm font-sans">
                
                {/* Meta details */}
                <div className="flex justify-between border-b border-slate-50 pb-3">
                  <div>
                    <p className="font-bold text-slate-800">Order Ref: <span className="text-emerald-850 font-mono font-black border-b border-emerald-100">#{selectedOrder.id}</span></p>
                    <p className="text-[10px] text-slate-455 font-mono mt-1 flex items-center gap-1 capitalize">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      Created at {new Date(selectedOrder.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-extrabold text-lg text-emerald-850">₹{selectedOrder.total_amount}</p>
                    <span className="text-[9px] uppercase text-slate-400 font-extrabold tracking-widest">{selectedOrder.payment_method} Authorized</span>
                  </div>
                </div>

                {/* Receiver Info */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-slate-750 uppercase tracking-widest text-[10px] mb-2 leading-none">Delivered to:</h4>
                  <p className="font-bold text-slate-900 leading-tight">{selectedOrder.shipping_address.fullName}</p>
                  <p className="text-slate-500 mt-1 leading-snug">{selectedOrder.shipping_address.addressLine}, {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} - {selectedOrder.shipping_address.pincode}</p>
                  <p className="text-slate-450 mt-1 font-mono leading-none">WhatsApp Number: {selectedOrder.shipping_address.phone}</p>
                </div>

                {/* Items detail list */}
                <div>
                  <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-3 leading-none">Items summary:</h4>
                  <div className="flex flex-col gap-3 max-h-44 overflow-y-auto">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex gap-3.5 items-center text-xs">
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="h-10 w-10 rounded-lg object-cover border border-slate-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0 pr-1">
                          <p className="font-bold text-slate-800 truncate leading-tight">{item.product_name}</p>
                          <p className="text-[10px] text-slate-400 leading-none mt-0.5">Quantity: {item.quantity} x Price: ₹{item.price}</p>
                        </div>
                        <span className="font-bold text-slate-800 shrink-0 font-mono">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct logistics modifier quick button */}
                <div className="border-t border-slate-100 pt-4 flex justify-between items-center gap-3">
                  <div>
                    <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px] leading-none block">System override status:</span>
                    <span className={`text-[10px] font-black uppercase tracking-wider block mt-1 px-2.5 py-0.5 rounded-full border ${getStatusBadgeStyle(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {selectedOrder.status === 'pending' && (
                      <button
                        onClick={() => {
                          handleStatusChange(selectedOrder.id, 'confirmed');
                          setSelectedOrder(prev => prev ? { ...prev, status: 'confirmed' } : null);
                        }}
                        className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow cursor-pointer border-none"
                      >
                        Confirm Order
                      </button>
                    )}
                    {selectedOrder.status === 'confirmed' && (
                      <button
                        onClick={() => {
                          handleStatusChange(selectedOrder.id, 'packed');
                          setSelectedOrder(prev => prev ? { ...prev, status: 'packed' } : null);
                        }}
                        className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow cursor-pointer border-none"
                      >
                        Mark Packed
                      </button>
                    )}
                    {selectedOrder.status === 'packed' && (
                      <button
                        onClick={() => {
                          handleStatusChange(selectedOrder.id, 'shipped');
                          setSelectedOrder(prev => prev ? { ...prev, status: 'shipped' } : null);
                        }}
                        className="py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-xs shadow cursor-pointer border-none"
                      >
                        Dispatch Shipped
                      </button>
                    )}
                    {selectedOrder.status === 'shipped' && (
                      <button
                        onClick={() => {
                          handleStatusChange(selectedOrder.id, 'delivered');
                          setSelectedOrder(prev => prev ? { ...prev, status: 'delivered' } : null);
                        }}
                        className="py-2 px-3 bg-emerald-800 hover:bg-emerald-950 text-white rounded-lg font-bold text-xs shadow cursor-pointer border-none flex items-center gap-1"
                      >
                        <CheckCircle className="h-4 w-4" /> Delivered!
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

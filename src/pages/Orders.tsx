import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ShoppingBag, Calendar, PackageCheck, AlertCircle, RefreshCw, Milestone, Box, Truck, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Orders() {
  const { orders, user, loadOrders, deleteOrder, isOrdersLoading, addToast } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect unauthenticated visitors
    if (!user) {
      addToast('Please login to monitor your order statuses', 'info');
      navigate('/login');
    } else {
      loadOrders();
    }
    window.scrollTo(0, 0);
  }, [user, navigate, loadOrders, addToast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'confirmed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'packed': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'shipped': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-emerald-50 text-emerald-850 border-emerald-200';
      case 'cancelled': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-500';
    }
  };

  const getTimelineStepIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Milestone className="h-4.5 w-4.5" />;
      case 'confirmed': return <CheckCircle2 className="h-4.5 w-4.5" />;
      case 'packed': return <Box className="h-4.5 w-4.5" />;
      case 'shipped': return <Truck className="h-4.5 w-4.5" />;
      case 'delivered': return <PackageCheck className="h-4.5 w-4.5" />;
      default: return <AlertCircle className="h-4.5 w-4.5" />;
    }
  };

  return (
    <div id="orders-dashboard-page" className="pt-24 pb-16 min-h-screen bg-slate-50/50 font-sans text-slate-805">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-medium text-3xl text-emerald-950 tracking-tight">
              My Orders history
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Active tracking timelines and historical purchase invoices.
            </p>
          </div>
          <button
            id="orders-reload-btn"
            onClick={() => {
              loadOrders();
              addToast('Loaded latest logistics updates', 'success');
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 transition-all self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Status</span>
          </button>
        </div>

        {/* Loading display */}
        {isOrdersLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-800" />
          </div>
        ) : orders.length === 0 ? (
          /* Empty list */
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm flex flex-col items-center gap-4">
            <div className="p-4 bg-emerald-50 rounded-full animate-pulse text-emerald-800">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-emerald-950">
                No orders placed yet
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm">
                You haven't ordered any country recipes or fresh staples yet. Browse our list to experience rich rural taste!
              </p>
            </div>
            <Link
              id="empty-orders-browse-btn"
              to="/products"
              className="px-6 py-3 bg-emerald-850 hover:bg-emerald-900 text-white font-bold rounded-xl transition-all text-sm cursor-pointer"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          /* Render order timeline row cards list */
          <div className="flex flex-col gap-8">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-100 shadow-sm flex flex-col gap-6"
              >
                
                {/* Order Top Panel */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-50 pb-5 text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 bg-emerald-50 text-emerald-800 rounded-xl">
                      <ShoppingBag className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-bold text-slate-800">Order ID: <span className="font-mono text-emerald-850">#{order.id}</span></p>
                      <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3" /> Ordered on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Badge */}
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    {/* Total */}
                    <span className="font-display font-bold text-base text-slate-900">
                      ₹{order.total_amount}
                    </span>
                  </div>
                </div>

                {/* Items Ordered List summary */}
                <div className="flex flex-col gap-3.5 pb-4 border-b border-slate-50">
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-1">
                    Ordered Recipe Batches
                  </h4>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-3.5 items-center text-xs">
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="h-10 w-10 rounded-lg object-cover border border-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-850 truncate leading-tight">{item.product_name}</p>
                        <p className="text-[10px] text-slate-400 leading-none mt-0.5">Quantity: {item.quantity} x Price: ₹{item.price}</p>
                      </div>
                      <span className="font-bold text-slate-800 shrink-0">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Logistics Timeline */}
                <div className="flex flex-col gap-1">
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-4">
                    Active Delivery Timelines
                  </h4>

                  {/* Vertically stitched timeline list */}
                  <div className="flex flex-col pl-2 border-l-2 border-slate-100 relative text-xs">
                    {order.tracking_updates && order.tracking_updates.map((update, idx) => (
                      <div key={idx} className="mb-6 last:mb-0 relative pl-6">
                        
                        {/* Timeline Point icon */}
                        <div className={`absolute -left-[14px] top-0 p-1 rounded-full border text-white ${
                          update.status === order.status ? 'bg-emerald-600 border-emerald-400 ring-4 ring-emerald-100' : 'bg-slate-350 border-slate-200'
                        }`}>
                          {getTimelineStepIcon(update.status)}
                        </div>

                        {/* Timeline Body */}
                        <div>
                          <p className={`font-bold capitalize ${
                            update.status === order.status ? 'text-emerald-850 text-sm' : 'text-slate-500'
                          }`}>
                            {update.status}
                          </p>
                          <p className="text-slate-400 font-mono text-[9px] mt-0.5">
                            {new Date(update.timestamp).toLocaleString()}
                          </p>
                          <p className="text-slate-500 mt-1 max-w-lg font-sans text-xs">
                            {update.note}
                          </p>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery coordinates summary */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs sm:text-xs">
                  <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-2 text-slate-450">Delivery Address:</h5>
                  <p className="font-bold text-slate-800">{order.shipping_address.fullName}</p>
                  <p className="text-slate-500 mt-0.5">{order.shipping_address.addressLine}, {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}</p>
                  <p className="text-slate-500 mt-0.5 font-mono">Mobile Contact: {order.shipping_address.phone}</p>
                </div>

                {/* Cancel & Delete Order action option */}
                <div className="flex justify-end pt-1">
                  <button
                    id={`client-delete-order-${order.id}`}
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to cancel and delete order #${order.id}?`)) {
                        deleteOrder(order.id);
                      }
                    }}
                    className="text-xs font-bold text-rose-750 hover:text-rose-800 bg-rose-50/70 hover:bg-rose-100 border border-rose-200/50 hover:border-rose-300 rounded-xl px-4 py-2 transition-all cursor-pointer"
                  >
                    Cancel & Delete Order Record
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

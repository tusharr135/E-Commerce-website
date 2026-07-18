import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ShoppingBag, Trash2, ArrowRight, Minus, Plus, ShieldCheck, HeartPulse } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Cart() {
  const { cart, user, updateCartQuantity, removeFromCart, addToast, settings, loadSettings } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    loadSettings();
  }, [loadSettings]);

  const totalAmount = cart.reduce((sum, item) => {
    const itemPrice = item.product.sale_price !== undefined ? item.product.sale_price : item.product.price;
    return sum + (itemPrice * item.quantity);
  }, 0);

  const totalOriginalAmount = cart.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);

  const savings = totalOriginalAmount - totalAmount;
  
  // Free delivery check based on DB/settings configuration
  const freeDeliveryThreshold = settings?.free_delivery_threshold ?? 599;
  const isFreeDelivery = true; // Always free delivery as requested
  const shippingCharge = 0; // Free Home Delivery is globally active and not added

  const remainingForFree = 0;
  const progressPercent = 100;

  const handleCheckoutClick = () => {
    if (cart.length === 0) return;
    if (!user) {
      addToast('Please login to continue with checkout', 'info');
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div id="shopping-cart-page" className="pt-24 pb-16 min-h-screen bg-slate-50/50 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-emerald-950 tracking-tight">
            Your Cart
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review your carefully selected, stone-ground and hand-chopped village choices.
          </p>
        </div>

        {cart.length === 0 ? (
          /* Empty shopping cart layout */
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm flex flex-col items-center gap-4 max-w-xl mx-auto">
            <div className="p-4 bg-emerald-50 rounded-full text-emerald-800 animate-bounce">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-emerald-950">
                Your basket is entirely empty
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                You haven’t added any traditional products yet. Explore our nutritious grains, sweet fruit leathers, and sun-dried pickles!
              </p>
            </div>
            <Link
              id="empty-cart-shop-link"
              to="/products"
              className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl transition-all text-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Explore Village Products</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          /* Two-column layout (Items list + Summary) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Cart Elements Section */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm flex flex-col gap-5">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest pb-3 border-b border-slate-50">
                  Cart Items ({cart.length})
                </h3>

                <div className="flex flex-col gap-5">
                  <AnimatePresence mode="popLayout">
                    {cart.map((item) => {
                      const hasSale = item.product.sale_price !== undefined;
                      const activePrice = hasSale ? item.product.sale_price : item.product.price;

                      return (
                        <motion.div
                          id={`cart-row-${item.product.id}`}
                          key={item.product.id}
                          initial={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50, scale: 0.95, transition: { duration: 0.3 } }}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 last:border-b-0 last:pb-0"
                        >
                          {/* Image & Title group */}
                          <div className="flex gap-4 items-center flex-1">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              className="h-16 w-16 rounded-xl object-cover border border-slate-100"
                            />
                            <div>
                              <Link
                                to={`/product/${item.product.id}`}
                                className="font-display font-bold text-sm sm:text-base text-slate-800 hover:text-emerald-800 line-clamp-1"
                              >
                                {item.product.name}
                              </Link>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] bg-slate-150 text-slate-500 font-bold px-1.5 py-0.5 rounded-full uppercase">
                                  {item.product.category}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  Weight: {item.product.weight}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Controls & Prices row */}
                          <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                            {/* Quantity */}
                            <div className="flex items-center border border-slate-150 bg-slate-50 rounded-xl px-1.5 py-0.5">
                              <button
                                id={`dec-qty-${item.product.id}`}
                                onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                                className="p-1 rounded-md text-slate-400 hover:bg-slate-100 cursor-pointer"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="font-mono text-xs font-bold text-slate-800 px-3 w-8 text-center select-none">
                                {item.quantity}
                              </span>
                              <button
                                id={`inc-qty-${item.product.id}`}
                                onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                                className="p-1 rounded-md text-slate-400 hover:bg-slate-100 cursor-pointer"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            {/* Total calculated price */}
                            <div className="text-right min-w-[70px]">
                              <p className="text-sm font-bold text-emerald-850">
                                ₹{activePrice * item.quantity}
                              </p>
                              {hasSale && (
                                <p className="text-[10px] text-slate-400 line-through">
                                  ₹{item.product.price * item.quantity}
                                </p>
                              )}
                            </div>

                            {/* Deletion button */}
                            <button
                              id={`remove-item-${item.product.id}`}
                              onClick={() => removeFromCart(item.product.id)}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>

                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>

              {/* Extra reassurance banners */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-800 shrink-0 h-max">
                    <HeartPulse className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">Fresh Packing Guarantee</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">Every packet is sealed only upon placing the order, ensuring maximum taste values.</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-800 shrink-0 h-max">
                    <ShieldCheck className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">Safe Logistics Systems</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">Dispatched in clean recycled nature boxes with full active location tracking.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Sticky Order Summary Card */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 flex flex-col gap-4">
                       <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                
                {/* Dynamic Free Delivery Progress Bar Card */}
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/60 font-sans">
                  {isFreeDelivery ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-emerald-850 font-black text-xs sm:text-sm">
                        <span>🎉 Free Delivery Applied</span>
                      </div>
                      <p className="text-[11px] text-emerald-700 leading-snug">
                        Your village basket is worth ₹{totalAmount}! You've unlocked 100% free home delivery.
                      </p>
                      <div className="w-full h-2 bg-emerald-200 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-emerald-600 rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs text-slate-600">
                        <span className="font-bold">Free Delivery Progress</span>
                        <span className="font-extrabold text-xs text-emerald-800 font-mono">
                          ₹{totalAmount}/₹{freeDeliveryThreshold}
                        </span>
                      </div>
                      
                      {/* Bar */}
                      <div className="w-full h-2.5 bg-slate-150 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500" 
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>

                      <div className="text-[11px] text-slate-500 font-bold leading-relaxed">
                        Add <span className="text-[#15803D] font-extrabold font-mono">₹{remainingForFree}</span> more to unlock <span className="text-[#15803D] font-extrabold">FREE Delivery</span>.
                      </div>
                    </div>
                  )}
                </div>

                <h3 className="text-xs font-extrabold text-slate-450 uppercase tracking-widest pb-3 border-b border-slate-55 mb-4">
                  Order Summary
                </h3>

                <div className="flex flex-col gap-3 text-xs sm:text-sm font-sans pb-4 border-b border-slate-100">
                  <div className="flex justify-between text-slate-500">
                    <span>Base Fare ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
                    <span className="font-bold font-mono">₹{totalOriginalAmount}</span>
                  </div>
                  
                  {savings > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-100/40">
                      <span>Heritage Sale Savings</span>
                      <span className="font-bold font-mono">-₹{savings}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-500">
                    <span>Est. Delivery Charge</span>
                    <span className="font-bold text-slate-800 font-mono">
                      {isFreeDelivery ? (
                        <span className="text-[#15803D] font-black uppercase bg-emerald-100 px-2 py-0.5 rounded-md text-[10px]">Free</span>
                      ) : (
                        `₹${shippingCharge}`
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm font-bold text-slate-900 py-4 font-sans">
                  <span>Grand Total</span>
                  <span className="text-base sm:text-lg font-extrabold text-[#15803D] font-mono">
                    ₹{totalAmount + shippingCharge}
                  </span>
                </div>

                {/* Proceed button */}
                <button
                  id="checkout-proceed-btn"
                  onClick={handleCheckoutClick}
                  className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 border-none text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 group shadow-lg shadow-emerald-800/10 hover:shadow-xl hover:scale-101 active:scale-99 transition-all cursor-pointer"
                >
                  <span>Proceed to Delivery Checkout</span>
                  <ArrowRight className="h-4.5 w-4.5 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="mt-4 text-center">
                  <Link
                    to="/products"
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-600 hover:underline"
                  >
                    Continue shopping
                  </Link>
                </div>

              </div>
              
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

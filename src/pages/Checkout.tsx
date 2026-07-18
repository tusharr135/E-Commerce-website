import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useAuth } from '../App';
import { MapPin, Phone, User, CheckCircle2, QrCode, CreditCard, ShieldAlert, ChevronLeft, Loader2, Banknote, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getDistanceForPincode, calculateDelivery } from '../utils/delivery';
import DeliveryMap from '../components/DeliveryMap';

export default function Checkout() {
  const { cart, user, placeNewOrder, settings, loadSettings, addToast } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Redirect if user is not logged in or cart is empty
  useEffect(() => {
    if (!user) {
      addToast('Please login to continue with checkout', 'info');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    if (cart.length === 0) {
      addToast('Your cart is empty', 'error');
      navigate('/products');
    }
    window.scrollTo(0, 0);
  }, [user, cart, navigate, addToast]);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // Prefill form when user state loads
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setPhone(user.phone || '');
    }
  }, [user]);
  
  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'UPI_QR' | 'COD'>('UPI_QR');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrCountdown, setQrCountdown] = useState(180); // 3 minutes deadline
  const [txnRef, setTxnRef] = useState('');

  // Prefill address if logged in and has saved addresses
  const savedAddress = user?.saved_addresses?.[0];
  const handleUseSavedAddress = () => {
    if (savedAddress) {
      setFullName(savedAddress.fullName);
      setPhone(savedAddress.phone);
      setAddressLine(savedAddress.addressLine);
      setCity(savedAddress.city);
      setState(savedAddress.state);
      setPincode(savedAddress.pincode);
      addToast('Prefilled with saved delivery coordinates', 'success');
    }
  };

  const totalAmount = cart.reduce((sums, item) => {
    const itemPrice = item.product.sale_price !== undefined ? item.product.sale_price : item.product.price;
    return sums + (itemPrice * item.quantity);
  }, 0);

  const [mapDistance, setMapDistance] = useState<number | null>(null);
  const [mapInfo, setMapInfo] = useState<any>(null);

  // Clear map calculations when inputs change to re-trigger calculations
  useEffect(() => {
    setMapDistance(null);
    setMapInfo(null);
  }, [pincode, addressLine]);

  // Dynamic distance lookup & price check based on customer's typed PIN
  const hasValidPincode = pincode.trim().length === 6;
  const deliveryDistance = mapDistance !== null ? mapDistance : (hasValidPincode ? getDistanceForPincode(pincode) : null);
  const deliveryInfo = deliveryDistance !== null ? calculateDelivery({
    distance: deliveryDistance,
    subtotal: totalAmount,
    settings: settings || {
      delivery_0_5_cost: 20,
      delivery_5_10_cost: 40,
      delivery_10_15_cost: 60,
      delivery_15_20_cost: 100,
      free_delivery_threshold: 599,
      max_delivery_distance: 20,
      store_latitude: 16.6618,
      store_longitude: 73.5186
    }
  }) : null;

  // Derive final checkout parameters
  const activeDeliveryCharge = 0; // Free delivery (not added to total)
  const isAvailable = deliveryInfo ? deliveryInfo.available : (deliveryDistance !== null ? deliveryDistance <= 20 : true);
  const deliveryMsg = !isAvailable ? "Delivery Not Available. More than 20 km is outside our service region." : (deliveryInfo?.message || '');
  const grandTotal = totalAmount; // No delivery charges added

  // QR code active timer
  useEffect(() => {
    let timer: any;
    if (showQrModal && qrCountdown > 0) {
      timer = setInterval(() => {
        setQrCountdown(prev => prev - 1);
      }, 1000);
    } else if (qrCountdown === 0 && showQrModal) {
      addToast('QR Code expired. Please try placing your order again', 'error');
      setShowQrModal(false);
      setIsProcessing(false);
    }
    return () => clearInterval(timer);
  }, [showQrModal, qrCountdown, addToast]);

  const generateTxnRef = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let ref = 'TXN_VILL_';
    for (let i = 0; i < 10; i++) {
      ref += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTxnRef(ref);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !addressLine || !city || !state || !pincode) {
      addToast('Please complete all delivery fields', 'error');
      return;
    }

    if (!isAvailable) {
      addToast(deliveryMsg || 'We currently deliver within 20 km only. This pincode is unavailable.', 'error');
      return;
    }

    setIsProcessing(true);

    const targetAddress = {
      fullName,
      phone,
      addressLine,
      city,
      state,
      pincode
    };

    if (paymentMethod === 'UPI_QR') {
      // Open the interactive QR screen
      generateTxnRef();
      setQrCountdown(180);
      setShowQrModal(true);
    } else if (paymentMethod === 'COD') {
      // Simulate COD order processing
      setTimeout(async () => {
        try {
          const order = await placeNewOrder('COD', targetAddress);
          addToast(`Cash on Delivery confirmed! Order #${order.id} is now placed!`, 'success');
          setIsProcessing(false);
          navigate('/orders');
        } catch (e) {
          addToast('Error placing Cash on Delivery order', 'error');
          setIsProcessing(false);
        }
      }, 1500);
    } else {
      // Simulate direct Razorpay payments
      setTimeout(async () => {
        try {
          const order = await placeNewOrder('Razorpay', targetAddress);
          addToast(`Payment Authorized via Razorpay. Order #${order.id} placed!`, 'success');
          setIsProcessing(false);
          navigate('/orders');
        } catch (e) {
          addToast('Error placing order', 'error');
          setIsProcessing(false);
        }
      }, 2000);
    }
  };

  // Simulate user scanning and clicking verification on the UPI dialog
  const handleVerifyUpiPayment = async () => {
    try {
      const targetAddress = {
        fullName,
        phone,
        addressLine,
        city,
        state,
        pincode
      };
      
      const order = await placeNewOrder('UPI_QR', targetAddress);
      addToast(`UPI Payment Verified successfully! Order #${order.id} placed!`, 'success');
      setShowQrModal(false);
      setIsProcessing(false);
      navigate('/orders');
    } catch (e) {
      addToast('Verification failed. Try again.', 'error');
    }
  };

  const renderOrderSummaryContent = () => {
    return (
      <div className="flex flex-col gap-4">
        {/* Element list row summary */}
        <div className="flex flex-col gap-4 pb-4 border-b border-slate-150 max-h-56 overflow-y-auto">
          {cart.map((item) => (
            <div key={item.product.id} className="flex gap-3 items-center text-xs">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="h-10 w-10 rounded-lg object-cover border border-slate-100 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0 pr-1">
                <h4 className="font-bold text-slate-800 truncate leading-tight">{item.product.name}</h4>
                <p className="text-[10px] text-slate-450 leading-tight">Qty: {item.quantity} x ₹{item.product.sale_price !== undefined ? item.product.sale_price : item.product.price}</p>
              </div>
              <span className="font-bold text-slate-800 shrink-0">₹{(item.product.sale_price !== undefined ? item.product.sale_price : item.product.price) * item.quantity}</span>
            </div>
          ))}
        </div>

        {/* Calculations lines */}
        <div className="flex flex-col gap-2.5 text-xs font-sans py-4 border-b border-slate-100">
          <div className="flex justify-between text-slate-500">
            <span>Total Items Weight</span>
            <span className="font-bold text-slate-850 font-mono">
              {cart.length > 0 ? `${cart.reduce((a, b) => {
                const value = parseFloat(b.product.weight);
                const unit = b.product.weight.replace(/[0-9.]/g, '').toLowerCase();
                const multiplier = unit === 'kg' ? 1000 : 1;
                return a + (value * multiplier * b.quantity);
              }, 0) / 1000} kg` : '0 kg'}
            </span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span className="font-bold text-slate-800 font-mono">₹{totalAmount}</span>
          </div>
          <div className="flex justify-between text-slate-500 items-center">
            <span>Delivery Charge</span>
            <span className="font-bold text-[#15803D] font-mono flex items-center gap-1.5 flex-wrap justify-end">
              {deliveryDistance !== null && (
                <span className="text-[10px] text-slate-500">({deliveryDistance} km)</span>
              )}
              <span className="bg-[#DCFCE7] text-[#15803D] px-2.5 py-0.5 rounded-md text-xs font-sans font-extrabold border border-emerald-200 uppercase">Free</span>
            </span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Discount</span>
            <span className="font-bold text-[#15803D] font-mono">₹0</span>
          </div>
        </div>

        <div className="flex justify-between text-sm font-bold text-slate-900 pt-4 font-sans">
          <span>Grand Total</span>
          <span className="text-lg font-extrabold text-[#15803D] font-mono">₹{grandTotal}</span>
        </div>

        {/* Delivery Rate Guide Reference Card for User layout clarity */}
        <div className="mt-6 bg-slate-50 p-4 rounded-2xl border border-slate-150 text-[11px] text-slate-600">
          <h4 className="font-extrabold text-slate-800 mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-emerald-700" /> Delivery Rates Chart
          </h4>
          <div className="flex flex-col gap-1.5 font-sans leading-relaxed">
            <div className="flex justify-between border-b border-slate-200/50 pb-1">
              <span>🏡 Local Area in the Village</span>
              <span className="font-bold text-slate-900">₹10</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/50 pb-1">
              <span>🛵 5 km to 10 km</span>
              <span className="font-bold text-slate-900">₹30</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/50 pb-1">
              <span>🚛 11 km to 15 km</span>
              <span className="font-bold text-slate-900">₹60</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/50 pb-1">
              <span>🚛 15 km to 20 km</span>
              <span className="font-bold text-slate-900">₹80</span>
            </div>
            <div className="flex justify-between text-rose-700 font-semibold">
              <span>❌ More than 20 km</span>
              <span>Not Available</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="checkout-root" className="pt-24 pb-16 min-h-screen bg-slate-50/50 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <Link to="/cart" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:underline mb-2">
            <ChevronLeft className="h-3.5 w-3.5" /> Back to Cart
          </Link>
          <h1 className="font-display font-bold text-3xl text-emerald-950 tracking-tight">
            Checkout Delieveries
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* A. Delivery Address and Payment settings Form */}
          <form onSubmit={handleSubmitOrder} className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Delivery address details card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-50 pb-4">
                <h3 className="font-display font-bold text-sm text-emerald-950 uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="h-4.5 w-4.5 text-emerald-700" /> Delivery Address
                </h3>
                {savedAddress && (
                  <button
                    type="button"
                    onClick={handleUseSavedAddress}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-100 transition-colors self-start sm:self-auto cursor-pointer"
                  >
                    Use Saved Address
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                
                {/* Full name */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-600 flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-slate-400" /> Recipient Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tushar Raut"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-600 flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-slate-400" /> Contact Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                  />
                </div>

                {/* Local Area Address */}
                <div className="sm:col-span-2 flex flex-col gap-1">
                  <label className="font-bold text-slate-600">Full Shipping Address</label>
                  <input
                    type="text"
                    required
                    placeholder="Flat/House no., Floor, Street name, Village layout coordinates"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                  />
                </div>

                {/* City */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-600">City / District</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pune"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                  />
                </div>

                {/* State */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-600">State</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maharashtra"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                  />
                </div>

                {/* Pincode */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-600">Pincode</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 411001"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                  />
                </div>

                {/* Live Delivery Status feedback on Checkout Address section */}
                {pincode.length === 6 && (
                  <div className="sm:col-span-2 flex flex-col gap-3 mt-1">
                    <div id="checkout-delivery-feedback" className={`p-4 rounded-2xl border text-xs leading-normal ${
                      isAvailable 
                        ? 'bg-emerald-50/50 border-emerald-600/10 text-slate-800' 
                        : 'bg-rose-50/70 border-rose-250 text-slate-800'
                    }`}>
                      {isAvailable ? (
                        <div className="flex flex-col gap-1">
                          <span className="font-extrabold text-[#15803D] flex items-center gap-1.5 text-xs">
                            ✓ Delivery Available
                          </span>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-slate-600 mt-1 pt-1.5 border-t border-emerald-100">
                            <span>Distance: <b className="text-slate-900 font-sans">{deliveryDistance !== null ? `${deliveryDistance} km` : 'Computing...'}</b></span>
                            <span>•</span>
                            <span>
                              Delivery Fee: <b className="text-[#15803D] font-sans font-extrabold bg-[#DCFCE7] px-2 py-0.5 rounded-md text-[10px]">FREE</b>
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1.5">
                            {deliveryDistance !== null && deliveryDistance <= 5 
                              ? "🏡 Local Area in the Village tariff applied." 
                              : "🛵 Out of Village Distance-Based tariff applied."}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <span className="font-black text-rose-800 flex items-center gap-1.5">
                            ❌ Delivery Not Available
                          </span>
                          <p className="text-[11px] text-rose-700 leading-snug font-bold mt-1">
                            {deliveryMsg || `The calculated distance is ${deliveryDistance} km, which exceeds our maximum service limit of 20 km.`}
                          </p>
                        </div>
                      )}
                    </div>

                    <DeliveryMap
                      customerAddress={addressLine}
                      customerPincode={pincode}
                      storeLat={settings?.store_latitude ?? 16.6618}
                      storeLng={settings?.store_longitude ?? 73.5186}
                      onDistanceCalculated={(dist, details) => {
                        setMapDistance(dist);
                        setMapInfo(details);
                      }}
                    />
                  </div>
                )}

              </div>
            </div>

            {/* Mobile-only Order summary invoice block */}
            <div className="block lg:hidden bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest pb-3 border-b border-slate-50 mb-4">
                Your Village Order Info
              </h3>
              {renderOrderSummaryContent()}
            </div>

            {/* Payment Method selector card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
              <h3 className="font-display font-bold text-sm text-emerald-950 uppercase tracking-widest pb-3 border-b border-slate-50 flex items-center gap-2">
                <CreditCard className="h-4.5 w-4.5 text-emerald-700" /> Choose Payment Option
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                
                {/* Method 1: UPI QR (PREFFERED / RECOMMENDED) */}
                <div
                  onClick={() => setPaymentMethod('UPI_QR')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 select-none ${
                    paymentMethod === 'UPI_QR'
                      ? 'border-emerald-600 bg-emerald-50/30 font-medium'
                      : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg shrink-0">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <div className="flex-1 font-sans text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-bold text-slate-800">Scan UPI QR</h4>
                      <span className="bg-emerald-600 text-white text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full tracking-wider leading-none">Recommended</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal mt-1">Generate dynamic QR for instant secure payment. Works on PhonePe, GPay, Paytm, BHIM.</p>
                  </div>
                </div>
 
                {/* Method 2: Razorpay simulation */}
                <div
                  onClick={() => setPaymentMethod('Razorpay')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 select-none ${
                    paymentMethod === 'Razorpay'
                      ? 'border-emerald-600 bg-emerald-50/30 font-medium'
                      : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg shrink-0">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div className="flex-1 font-sans text-xs sm:text-sm">
                    <h4 className="font-bold text-slate-800">Card / Netbanking</h4>
                    <p className="text-[11px] text-slate-400 leading-normal mt-1">Debit/Credit cards, Netbanking, secure Razorpay sandbox gateway simulations.</p>
                  </div>
                </div>

                {/* Method 3: Cash on Delivery (COD) */}
                <div
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 select-none ${
                    paymentMethod === 'COD'
                      ? 'border-emerald-600 bg-emerald-50/30'
                      : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0">
                    <Banknote className="h-5 w-5" />
                  </div>
                  <div className="flex-1 font-sans text-xs sm:text-sm">
                    <h4 className="font-bold text-slate-800">Cash on Delivery</h4>
                    <p className="text-[11px] text-slate-400 leading-normal mt-1">Pay with actual cash or secure local UPI when our delivery executive reaches your door.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Submit checkout billing trigger */}
            <button
              id="checkout-submit-btn"
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-emerald-800 hover:bg-emerald-950 border-none text-white rounded-2xl font-bold text-sm tracking-wider uppercase shadow-xl hover:scale-101 active:scale-99 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span>Processing Secure Checkout...</span>
                </>
              ) : (
                <span>Pay & Confirm Order (₹{grandTotal})</span>
              )}
            </button>

          </form>

          {/* B. Order summary invoice block (Desktop-only) */}
          <aside className="hidden lg:block lg:col-span-4 lg:sticky lg:top-24 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest pb-3 border-b border-slate-50 mb-4">
              Your Village Order
            </h3>
            {renderOrderSummaryContent()}
          </aside>

        </div>
      </div>

      {/* C. Complete UPI QR Verification overlay modal */}
      <AnimatePresence>
        {showQrModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 z-50 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-40 sm:w-full sm:max-w-md bg-white rounded-3xl p-6 sm:p-8 z-50 shadow-2xl border border-slate-100 font-sans text-slate-800 text-center"
            >
              <div className="flex flex-col items-center gap-4">
                
                {/* Header indicators */}
                <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3" /> Secure UPI QR Sandbox
                </span>

                <h3 className="font-display font-bold text-lg text-emerald-950">
                  Scan to Complete Payment
                </h3>
                
                <p className="text-[11px] text-slate-400 -mt-1 leading-normal max-w-sm">
                  Generate transaction code for <b>₹{grandTotal}</b>. Open GooglePay, PhonePe, Bhim, or Paytm, and scan to transfer securely.
                </p>

                {/* QR Display Stage */}
                <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl relative my-2">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${settings?.upi_id || "villageproduct@okaxis"}%26pn=Village%20Product%20Stores%26am=${grandTotal}%26cu=INR%26tr=${txnRef}`}
                    alt="Payment QR"
                    className="h-44 w-44 object-contain mx-auto"
                  />
                  <div className="absolute top-2 left-2 text-[8px] bg-emerald-600 text-white font-mono rounded px-1 selection:none">
                    Verified ID
                  </div>
                </div>

                {/* Account details */}
                <p className="text-xs text-slate-600 font-medium">
                  UPI ID: <b className="text-emerald-800">{settings?.upi_id || "villageproduct@okaxis"}</b>
                </p>
                
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-500 font-mono text-center w-full break-all">
                  Txn Ref: <b className="text-slate-700">{txnRef}</b>
                </div>

                {/* Countdown display */}
                <p className="text-xs font-semibold text-slate-450 mt-1">
                  QR Code expires in <b className="text-rose-600 font-mono">{Math.floor(qrCountdown / 60)}:{(qrCountdown % 60).toString().padStart(2, '0')}</b> minutes
                </p>

                {/* Simulating QR scanners verification triggers */}
                <div className="flex gap-3 w-full border-t border-slate-100 pt-5 mt-2">
                  <button
                    id="cancel-upi-payment"
                    type="button"
                    onClick={() => {
                      setShowQrModal(false);
                      setIsProcessing(false);
                    }}
                    className="flex-1 py-3 text-rose-500 border border-slate-200 font-bold text-xs rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Cancel Billing
                  </button>
                  <button
                    id="verify-upi-payment"
                    type="button"
                    onClick={handleVerifyUpiPayment}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex justify-center items-center gap-1"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0" /> I Have Paid
                  </button>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

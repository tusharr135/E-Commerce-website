import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { Settings as SettingsIcon, Save, HeartPulse, Store, ShieldCheck, Mail, MapPin, Phone } from 'lucide-react';

export default function Settings() {
  const { settings, updateSettings, addToast } = useStore();
  
  // Local inputs
  const [upiId, setUpiId] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [isStoreClosed, setIsStoreClosed] = useState(false);
  const [taxPercent, setTaxPercent] = useState('0');
  const [shippingCost, setShippingCost] = useState('0');

  // Delivery logistics inputs
  const [delivery0_5Cost, setDelivery0_5Cost] = useState('20');
  const [delivery5_10Cost, setDelivery5_10Cost] = useState('40');
  const [delivery10_15Cost, setDelivery10_15Cost] = useState('60');
  const [delivery15_20Cost, setDelivery15_20Cost] = useState('100');
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState('599');
  const [maxDeliveryDistance, setMaxDeliveryDistance] = useState('20');
  const [storeLatitude, setStoreLatitude] = useState('19.0760');
  const [storeLongitude, setStoreLongitude] = useState('72.8777');

  useEffect(() => {
    if (settings) {
      setUpiId(settings.upi_id);
      setWhatsappNumber(settings.whatsapp_number);
      setContactNumber(settings.contact_number || '');
      setEmail(settings.email || '');
      setAddress(settings.address || '');
      setIsStoreClosed(settings.is_store_closed);
      setTaxPercent(settings.tax_percent !== undefined ? settings.tax_percent.toString() : '0');
      setShippingCost(settings.shipping_cost !== undefined ? settings.shipping_cost.toString() : '60');

      // Prefill coordinates Logistics state parameters
      setDelivery0_5Cost(settings.delivery_0_5_cost !== undefined ? settings.delivery_0_5_cost.toString() : '20');
      setDelivery5_10Cost(settings.delivery_5_10_cost !== undefined ? settings.delivery_5_10_cost.toString() : '40');
      setDelivery10_15Cost(settings.delivery_10_15_cost !== undefined ? settings.delivery_10_15_cost.toString() : '60');
      setDelivery15_20Cost(settings.delivery_15_20_cost !== undefined ? settings.delivery_15_20_cost.toString() : '100');
      setFreeDeliveryThreshold(settings.free_delivery_threshold !== undefined ? settings.free_delivery_threshold.toString() : '599');
      setMaxDeliveryDistance(settings.max_delivery_distance !== undefined ? settings.max_delivery_distance.toString() : '20');
      setStoreLatitude(settings.store_latitude !== undefined ? settings.store_latitude.toString() : '19.0760');
      setStoreLongitude(settings.store_longitude !== undefined ? settings.store_longitude.toString() : '72.8777');
    }
    window.scrollTo(0, 0);
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      upi_id: upiId,
      whatsapp_number: whatsappNumber,
      contact_number: contactNumber,
      email,
      address,
      is_store_closed: isStoreClosed,
      tax_percent: parseFloat(taxPercent),
      shipping_cost: parseFloat(shippingCost),
      delivery_0_5_cost: parseFloat(delivery0_5Cost),
      delivery_5_10_cost: parseFloat(delivery5_10Cost),
      delivery_10_15_cost: parseFloat(delivery10_15Cost),
      delivery_15_20_cost: parseFloat(delivery15_20Cost),
      free_delivery_threshold: parseFloat(freeDeliveryThreshold),
      max_delivery_distance: parseFloat(maxDeliveryDistance),
      store_latitude: parseFloat(storeLatitude),
      store_longitude: parseFloat(storeLongitude)
    });
    addToast('Global Store Settings updated successfully', 'success');
  };

  return (
    <div id="admin-settings-page" className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 font-sans text-slate-805 bg-slate-50/20">
      
      {/* Title */}
      <div>
        <h2 className="font-display font-bold text-2xl text-emerald-950 tracking-tight">
          Global Store Settings
        </h2>
        <p className="text-xs text-slate-450 mt-1">
          Adjust secure billing IDs, crop logistics charges, support contact numbers, or lock the storefront for maintenance.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column Form inputs */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-6">
          <h3 className="font-display font-bold text-sm text-emerald-950 uppercase tracking-widest pb-3 border-b border-slate-50 flex items-center gap-1.5 leading-none">
            <SettingsIcon className="h-4.5 w-4.5 text-emerald-700" /> Operational Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs sm:text-sm font-sans">
            
            {/* UPI ID */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-600">Active Payments Merchant UPI ID</label>
              <input
                type="text"
                required
                placeholder="e.g. villageproduct@okaxis"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
              />
            </div>

            {/* WhatsApp Contact */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-600">WhatsApp Support Hotline</label>
              <input
                type="tel"
                required
                placeholder="e.g. +91 89561 40868"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Support Mobile Number */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-650 flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-slate-400" /> Dial-in Support Mobile
              </label>
              <input
                type="tel"
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="p-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Support Email */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-650 flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-slate-400" /> Store Helpdesk Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2 flex flex-col gap-1">
              <label className="font-bold text-slate-650 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" /> Physical Kitchen HQ Address
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="p-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Tax and Shipping details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:col-span-2 border-t border-slate-50 pt-4">
              
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-600">Standard Goods GST (%)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(e.target.value)}
                  className="p-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-600">Flat Base Shipping cost (₹)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={shippingCost}
                  onChange={(e) => setShippingCost(e.target.value)}
                  className="p-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-50 focus:bg-white"
                />
              </div>

            </div>

          </div>

          {/* Delivery & Logistics parameters card */}
          <div className="border-t border-slate-100 pt-6 mt-6 flex flex-col gap-5">
            <h3 className="font-display font-bold text-sm text-emerald-950 uppercase tracking-widest pb-3 border-b border-slate-50 flex items-center gap-1.5 leading-none">
              <MapPin className="h-4.5 w-4.5 text-emerald-700 shrink-0" /> Coordinate Logistics & Distance Rates
            </h3>
            
            <p className="text-[10px] text-slate-500 leading-normal mb-1">
              Configure tiered pricing rules based on customer coordinate offsets (calculated via deterministic pincodes) and set total value free delivery boundaries.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs sm:text-sm font-sans pt-1">
              
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-650">0 to 5 km Logistics Tariff (₹)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={delivery0_5Cost}
                  onChange={(e) => setDelivery0_5Cost(e.target.value)}
                  className="p-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-650">5 to 10 km Logistics Tariff (₹)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={delivery5_10Cost}
                  onChange={(e) => setDelivery5_10Cost(e.target.value)}
                  className="p-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-650">10 to 15 km Logistics Tariff (₹)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={delivery10_15Cost}
                  onChange={(e) => setDelivery10_15Cost(e.target.value)}
                  className="p-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-650">15 to 20 km Logistics Tariff (₹)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={delivery15_20Cost}
                  onChange={(e) => setDelivery15_20Cost(e.target.value)}
                  className="p-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-50 focus:bg-white animate-pulse-once"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-650 font-black text-emerald-950">Free Delivery Cart Threshold (₹)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={freeDeliveryThreshold}
                  onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
                  className="p-3 border border-[#0F766E]/20 text-[#0F766E] rounded-xl focus:outline-none bg-emerald-50/20 focus:bg-white font-extrabold"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-650">Absolute Maximum Deliverable Limit (km)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={maxDeliveryDistance}
                  onChange={(e) => setMaxDeliveryDistance(e.target.value)}
                  className="p-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-650">Store GPS Latitude Degrees</label>
                <input
                  type="text"
                  required
                  value={storeLatitude}
                  onChange={(e) => setStoreLatitude(e.target.value)}
                  className="p-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-50 focus:bg-white font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-650">Store GPS Longitude Degrees</label>
                <input
                  type="text"
                  required
                  value={storeLongitude}
                  onChange={(e) => setStoreLongitude(e.target.value)}
                  className="p-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-50 focus:bg-white font-mono"
                />
              </div>

            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-950 border-none text-white rounded-2xl font-bold font-sans text-xs uppercase tracking-wider block shadow cursor-pointer transition-colors mt-2"
          >
            Commit Global Settings
          </button>
        </div>

        {/* Right Column Operational toggles */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          
          {/* Store closure switcher */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <h4 className="font-display font-extrabold text-slate-450 uppercase tracking-widest text-[10px] pb-3 border-b border-slate-55 flex items-center gap-1 mb-2">
              <Store className="h-4.5 w-4.5 text-emerald-800" /> Operational Status
            </h4>

            {/* Closure Toggle */}
            <div className="flex items-center justify-between gap-4 py-1 select-none font-sans text-xs">
              <div>
                <b className="text-slate-805 block">Force Temporary closure</b>
                <span className="text-slate-450 text-[10px] mt-0.5 inline-block">Block checkouts until toggled back open.</span>
              </div>
              
              <input
                id="store-closed-checkbox"
                type="checkbox"
                checked={isStoreClosed}
                onChange={() => setIsStoreClosed(!isStoreClosed)}
                className="accent-rose-600 h-5 w-5 rounded cursor-pointer shrink-0"
              />
            </div>

            {isStoreClosed ? (
              <div className="p-3 bg-red-50 text-rose-955 rounded-xl border border-red-100/50 text-[10px] leading-relaxed font-sans">
                💡 <b>Store Lock Active:</b> Customers visiting the storefront will face an interactive overlay informing them grocery deliveries are paused temporarily. Click checklist above to verify.
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 text-emerald-850 rounded-xl border border-emerald-100/50 text-[10px] leading-relaxed font-sans flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span><b>Live on Site:</b> Checkout systems are running cleanly.</span>
              </div>
            )}
          </div>

        </div>

      </form>

    </div>
  );
}

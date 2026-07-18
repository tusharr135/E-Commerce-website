import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { User, Phone, Mail, MapPin, Edit3, Trash2, Plus, X, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Profile() {
  const { user, updateProfile, addToast } = useStore();
  const navigate = useNavigate();

  // Local user updates state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [submittingUser, setSubmittingUser] = useState(false);

  // Address inputs state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [fullNameAddr, setFullNameAddr] = useState('');
  const [phoneAddr, setPhoneAddr] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  useEffect(() => {
    if (!user) {
      addToast('Please login to adjust profile configurations', 'info');
      navigate('/login');
    } else {
      setFullName(user.full_name);
      setPhone(user.phone || '');
    }
    window.scrollTo(0, 0);
  }, [user, navigate, addToast]);

  if (!user) return null;

  const handleUpdateProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      addToast('Email, Full name, and Phone are required parameters', 'error');
      return;
    }
    setSubmittingUser(true);
    try {
      await updateProfile(fullName, phone);
    } catch(e) {
      addToast('Error saving profile changes', 'error');
    } finally {
      setSubmittingUser(false);
    }
  };

  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullNameAddr || !phoneAddr || !addressLine || !city || !state || !pincode) {
      addToast('Complete all coordinates', 'error');
      return;
    }

    const currentAddresses = user.saved_addresses ? [...user.saved_addresses] : [];
    const newAddress = {
      id: `addr-${Date.now()}`,
      fullName: fullNameAddr,
      phone: phoneAddr,
      addressLine,
      city,
      state,
      pincode
    };

    currentAddresses.push(newAddress);
    try {
      await updateProfile(user.full_name, user.phone, currentAddresses);
      addToast('New delivery coordinate saved successfully', 'success');
      // Clear address inputs
      setFullNameAddr('');
      setPhoneAddr('');
      setAddressLine('');
      setCity('');
      setState('');
      setPincode('');
      setShowAddressForm(false);
    } catch(err) {
      addToast('Error saving address details', 'error');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    const freshAddresses = user.saved_addresses.filter(addr => addr.id !== id);
    try {
      await updateProfile(user.full_name, user.phone, freshAddresses);
      addToast('Address reference removed successfully', 'info');
    } catch(e) {
      addToast('Error removing address', 'error');
    }
  };

  return (
    <div id="profile-management-page" className="pt-24 pb-16 min-h-screen bg-slate-50/50 font-sans text-slate-805">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="font-display font-medium text-3xl text-emerald-950 tracking-tight">
            Account Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Update personal coordinates and configure home grocery destination addresses.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Section 1: Edit Profile details input */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-5">
            <h3 className="font-display font-bold text-sm text-emerald-950 uppercase tracking-widest pb-3 border-b border-slate-50 flex items-center gap-1.5">
              <User className="h-4.5 w-4.5 text-emerald-700" /> Member Details
            </h3>

            <form onSubmit={handleUpdateProfileSubmit} className="flex flex-col gap-4 text-xs sm:text-sm font-sans">
              
              {/* Name */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-600">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Email (Readonly) */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-400">Mail Address (Linked Username)</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-350" />
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-100 rounded-xl bg-slate-100 text-slate-400 select-none cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-650">Mobile Contacts</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Role badge info */}
              <div className="flex items-center gap-1.5 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <ShieldAlert className="h-4.5 w-4.5 text-emerald-800 shrink-0" />
                <span className="text-[11px] font-medium text-slate-500 capitalize">
                  Account Access Category: <b className="text-emerald-900 font-bold">{user.role} Privilege</b>
                </span>
              </div>

              <button
                type="submit"
                disabled={submittingUser}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 border-none text-white rounded-xl shadow font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                {submittingUser ? 'Syncing...' : 'Save Member updates'}
              </button>

            </form>
          </div>

          {/* Section 2: Saved Address coordinates */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <h3 className="font-display font-bold text-sm text-emerald-950 uppercase tracking-widest flex items-center gap-1.5">
                <MapPin className="h-4.5 w-4.5 text-emerald-700" /> Saved Delivery Addresses
              </h3>
              <button
                id="toggle-address-form"
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
              >
                {showAddressForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                <span>{showAddressForm ? 'Cancel Form' : 'Add New'}</span>
              </button>
            </div>

            {/* Address submission form panel */}
            <AnimatePresence>
              {showAddressForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-emerald-50/20 p-4 rounded-2xl border border-emerald-100/30 overflow-hidden text-xs sm:text-xs"
                >
                  <form onSubmit={handleAddNewAddress} className="flex flex-col gap-3 font-sans">
                    <h4 className="font-bold text-slate-800 text-sm">New Delivery Destination:</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                      
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-slate-500">FullName Address</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Tushar Raut Address"
                          value={fullNameAddr}
                          onChange={(e) => setFullNameAddr(e.target.value)}
                          className="p-2.5 border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-slate-500">Delivery Mobile</label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +91 98765 43210"
                          value={phoneAddr}
                          onChange={(e) => setPhoneAddr(e.target.value)}
                          className="p-2.5 border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>

                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-slate-500">Address line parameters</label>
                      <input
                        type="text"
                        required
                        placeholder="House / Plot coordinates, Street or Agro Farms Road"
                        value={addressLine}
                        onChange={(e) => setAddressLine(e.target.value)}
                        className="p-2.5 border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-slate-500">City</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Pune"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="p-2.5 border border-slate-200 bg-white rounded-lg focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-slate-500">State</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Maharashtra"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="p-2.5 border border-slate-200 bg-white rounded-lg focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-slate-500">Pincode</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          placeholder="e.g. 411001"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                          className="p-2.5 border border-slate-200 bg-white rounded-lg focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="py-2.5 bg-emerald-800 hover:bg-emerald-900 border-none text-white rounded-lg font-bold shadow text-[10px] sm:text-xs uppercase mt-2 cursor-pointer"
                    >
                      Save Address Reference
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* List saved addresses */}
            <div id="saved-addresses-list" className="flex flex-col gap-3">
              {!user.saved_addresses || user.saved_addresses.length === 0 ? (
                <div className="text-center p-8 bg-slate-50/50 rounded-2xl border border-slate-100 text-xs text-slate-400">
                  There are no saved addresses yet. Save one above to enable rapid prefilled checkouts.
                </div>
              ) : (
                user.saved_addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 bg-slate-50/30 hover:bg-slate-50 rounded-2xl border border-slate-150/60 hover:border-emerald-500/10 transition-all flex items-start justify-between gap-4"
                  >
                    <div className="text-xs font-sans text-slate-600">
                      <p className="font-bold text-slate-800 flex items-center gap-1.5 mb-1 text-sm">
                        <MapPin className="h-4 w-4 text-emerald-700" /> {addr.fullName}
                      </p>
                      <p className="leading-relaxed">{addr.addressLine}</p>
                      <p className="mt-0.5">{addr.city}, {addr.state} - <b className="text-slate-850 font-bold font-mono">{addr.pincode}</b></p>
                      <p className="mt-1 text-slate-400 font-mono">Mobile Contact: {addr.phone}</p>
                    </div>

                    <button
                      id={`delete-address-${addr.id}`}
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

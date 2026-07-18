import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Leaf, Phone, Mail, MapPin, Send, MessageSquare, Clock, Globe } from 'lucide-react';
import { motion } from 'motion/react';

export default function Contact() {
  const { settings, addToast } = useStore();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      addToast('Thank you! Your query has been logged with our support hub in Konkan Agro Belt. We will contact you shortly.', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1500);
  };

  return (
    <div id="contact-support-page" className="pt-24 pb-16 min-h-screen bg-slate-50/50 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title panel */}
        <div className="mb-12 text-center lg:text-left">
          <span className="text-xs font-bold text-emerald-700 tracking-widest uppercase block mb-1">
            Support center
          </span>
          <h1 className="font-display font-medium text-3xl text-emerald-950 tracking-tight leading-tight">
            Connect with Our Kitchen
          </h1>
          <p className="text-xs sm:text-sm text-slate-450 mt-1 max-w-lg">
            Have questions about grandma's recipe batches, country packaging shipments, wholesale requirements, or bulk setups? Drop us a line.
          </p>
        </div>

        {/* Content columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* A. Info and WhatsApp Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Quick stats details cards */}
            <div className="bg-emerald-950 text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-white/5">
              
              <div className="relative z-10 flex flex-col gap-5">
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 px-2.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider self-start text-emerald-300">
                  <Leaf className="h-3.5 w-3.5" /> Farmer Provenance Approved
                </span>

                <h3 className="font-display font-bold text-lg text-white">
                  Headquarter Coordinates
                </h3>

                <ul className="flex flex-col gap-4 text-xs sm:text-sm">
                  <li className="flex items-start gap-2.5 text-emerald-100/80">
                    <MapPin className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{settings?.address || "Goval, Khalchi Wadi, Rajapur, Ratnagiri, Maharashtra, 416702"}</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-emerald-100/80">
                    <Phone className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                    <span>{settings?.contact_number || "+91 8956140868"}</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-emerald-100/80">
                    <Mail className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{settings?.email || "villageproduct480@gmail.com"}</span>
                  </li>
                </ul>

                <hr className="border-emerald-900/60 my-1" />

                {/* WhatsApp Button */}
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] text-emerald-200/60 uppercase tracking-widest font-semibold">Immediate Hotline:</p>
                  <a
                    id="contact-whatsapp-btn"
                    href={`https://wa.me/${settings?.whatsapp_number?.replace(/[^0-9]/g, '') || "918956140868"}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl text-center flex items-center justify-center gap-2 text-white border-none shadow transition-all cursor-pointer"
                  >
                    <MessageSquare className="h-4.5 w-4.5 animate-bounce" />
                    <span>Ping WhatsApp Support Now</span>
                  </a>
                </div>

              </div>
            </div>

            {/* Timings card details */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex gap-3 text-sans text-xs">
              <Clock className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <b className="text-slate-800 text-sm block">Working Hours</b>
                <span className="text-slate-550 inline-block mt-0.5">Monday to Saturday: <b className="text-slate-750">08:00 AM - 07:00 PM IST</b></span>
                <p className="text-[10px] text-slate-400 mt-1">Sun drying crop schedules require grandma to operate outdoors in afternoons. Enquiries received on Sundays will be answered on Mondays.</p>
              </div>
            </div>

          </div>

          {/* B. Contact Form Column */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-5">
            <h3 className="font-display font-bold text-sm text-emerald-950 uppercase tracking-widest pb-3 border-b border-slate-50 flex items-center gap-1.5">
              <Send className="h-4.5 w-4.5 text-emerald-700" /> Send support letter
            </h3>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 text-xs sm:text-sm font-sans">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full name */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-600">Your Full name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priyah Patel"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-600">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. priyah@outlook.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                  />
                </div>

              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-600">Enquiry Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Custom batch bulk packaging order for marriage"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-600">Detailed Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share details of what food recipe or grains packing you would like to clarify..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 border-none text-white rounded-xl shadow font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer mt-1"
              >
                {loading ? 'Dispatched support query...' : 'Log Inquiry'}
              </button>

            </form>
          </div>

        </div>

        {/* C. Stylized Maps Embed pointers */}
        <section className="mt-16 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-450 uppercase tracking-widest font-bold px-2 pt-2">
            <Globe className="h-4.5 w-4.5 text-emerald-600" /> Traditional Konkan Agro Belt
          </div>
          
          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-105 border border-slate-150">
            {/* Visual simulated map with real locations overlays */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3821.1448651815594!2d73.38870311481634!3d16.994444388194488!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be9ccd0fa822187%3A0x6bba8d2345d4c8db!2sRatnagiri%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1717314352109!5m2!1sen!2sin"
              title="Konkan Agro Belt Location"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 filter saturate-75 opacity-90 hover:saturate-100 transition-all"
            />
          </div>
        </section>

      </div>
    </div>
  );
}

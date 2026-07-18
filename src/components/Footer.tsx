import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Leaf, Phone, Mail, MapPin, Send, Instagram, Facebook, MessageSquare } from 'lucide-react';
import React, { useState } from 'react';

export default function Footer() {
  const { settings, addToast } = useStore();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    addToast('Thank you for subscribing to our fresh village newsletter!', 'success');
    setEmail('');
  };

  const categories = [
    { name: 'Pulses & Rice (कडधान्ये व तांदूळ)', path: '/products?category=Pulses%20%26%20Rice%20(कडधान्ये%20व%20तांदूळ)' },
    { name: 'Talele Gare (तळलेले गरे)', path: '/products?category=Talele%20Gare%20(तळलेले%20गरे)' },
    { name: 'Fruit Leathers (पोळी)', path: '/products?category=Fruit%20Leathers%20(पोळी)' },
    { name: 'Pickles (लोणचे)', path: '/products?category=Pickles%20(लोणचे)' },
    { name: 'Home Products & Flours (पीठ व इतर)', path: '/products?category=Home%20Products%20%26%20Flours%20(पीठ%20व%20इतर)' }
  ];

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Our Products', path: '/products' },
    { name: 'Our Story (About Us)', path: '/about' },
    { name: 'Contact & Support', path: '/contact' }
  ];

  return (
    <footer id="main-footer" className="bg-white border-t border-gray-200 text-gray-600 pt-16 pb-8 font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Branch brand description */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="p-1.5 bg-[#15803D] text-white rounded-xl">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="font-display font-bold text-xl text-[#111827] tracking-tight">
              {settings?.store_name || "Village Product"}
            </span>
          </Link>
          <p className="text-sm text-gray-500 leading-relaxed">
            Delivering authentic, 100% homemade, sun-cured village delicacies and stone-ground grains. Sourced directly from local farmers and crafted of grandmother's heirloom farm-perfect recipes.
          </p>

          {/* Social Platforms links */}
          <div className="flex items-center gap-3 mt-2">
            <a
              id="social-instagram"
              href={settings?.instagram_url || "https://instagram.com"}
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-gray-50 hover:bg-[#F0FDF4] text-gray-400 hover:text-[#15803D] rounded-lg transition-colors border border-gray-200"
            >
              <Instagram className="h-4.5 w-4.5" />
            </a>
            <a
              id="social-facebook"
              href={settings?.facebook_url || "https://facebook.com"}
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-gray-50 hover:bg-[#F0FDF4] text-gray-400 hover:text-[#15803D] rounded-lg transition-colors border border-gray-200"
            >
              <Facebook className="h-4.5 w-4.5" />
            </a>
            <a
              id="social-whatsapp"
              href={`https://wa.me/${settings?.whatsapp_number?.replace(/[^0-9]/g, '') || "918956140868"}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-[#DCFCE7] hover:bg-[#bbf7d0] text-[#15803D] hover:text-[#166534] rounded-lg transition-colors border border-[#15803D]/10 flex items-center gap-1.5 text-xs font-semibold"
            >
              <MessageSquare className="h-4.5 w-4.5" />
            </a>
          </div>
        </div>

        {/* Quick Navigate Index */}
        <div className="flex flex-col gap-4">
          <h3 className="font-display font-extrabold text-base text-[#111827] tracking-wider uppercase">
            Product Categories
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.name}>
                <Link
                  id={`footer-cat-${c.name.toLowerCase().replace(/\s+/g, '-')}`}
                  to={c.path}
                  className="text-gray-500 hover:text-[#15803D] transition-colors font-medium"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links Index */}
        <div className="flex flex-col gap-4">
          <h3 className="font-display font-extrabold text-base text-[#111827] tracking-wider uppercase">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            {quickLinks.map((ql) => (
              <li key={ql.name}>
                <Link
                  id={`footer-link-${ql.name.toLowerCase().replace(/\s+/g, '-')}`}
                  to={ql.path}
                  className="text-gray-500 hover:text-[#15803D] transition-colors font-medium"
                >
                  {ql.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Store Contacts & Newsletter */}
        <div className="flex flex-col gap-4">
          <h3 className="font-display font-extrabold text-base text-[#111827] tracking-wider uppercase">
            Store Contact
          </h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-start gap-2 text-gray-500">
              <MapPin className="h-5 w-5 text-[#15803D] shrink-0 mt-0.5" />
              <span className="leading-tight">{settings?.address || "Goval, Khalchi Wadi, Rajapur, Ratnagiri, Maharashtra, 416702"}</span>
            </li>
            <li className="flex items-center gap-2 text-gray-500">
              <Phone className="h-4 w-4 text-[#15803D] shrink-0" />
              <span>{settings?.contact_number || "+91 8956140868"}</span>
            </li>
            <li className="flex items-center gap-2 text-gray-500">
              <Mail className="h-4 w-4 text-[#15803D] shrink-0" />
              <span className="truncate">{settings?.email || "villageproduct480@gmail.com"}</span>
            </li>
          </ul>

          <div className="mt-2">
            <h4 className="text-xs font-bold tracking-wider uppercase text-[#15803D] mb-2">
              Subscribe to Newsletter
            </h4>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                id="footer-email-input"
                type="email"
                placeholder="Enter email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#15803D] flex-1 min-w-0"
              />
              <button
                id="footer-email-btn"
                type="submit"
                className="bg-[#15803D] hover:bg-[#166534] text-white rounded-lg px-3 py-1.5 transition-colors text-xs font-bold shrink-0 flex items-center justify-center cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>© 2026 {settings?.store_name || "Village Product"}. Hand-crafted directly with organic nature. All rights reserved.</p>
        <p className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full border border-gray-250">
          <span>Current UTC timezone status:</span>
          <span className="font-mono text-[10px] text-[#15803D] font-bold">2026 UTC</span>
        </p>
      </div>
    </footer>
  );
}

import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ShoppingBag, User, ShieldAlert, LogOut, Menu, X, Leaf, ChevronRight, PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { cart, user, logout, settings } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const isAdmin = user?.role === 'admin';

  // Quick navigation items for store
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact Us', path: '/contact' }
  ];

  return (
    <>
      <header
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b ${
          scrolled
            ? 'bg-white/95 text-slate-800 border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)] py-3 backdrop-blur-md'
            : 'bg-white/85 text-slate-800 border-gray-100/50 shadow-sm py-4 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo Brand / Identity */}
          <Link id="logo-brand-link" to="/" className="flex items-center gap-2 group">
            <span className="p-1.5 bg-[#15803D] text-white rounded-xl group-hover:bg-[#166534] transition-colors">
              <Leaf className="h-5 w-5 animate-pulse" />
            </span>
            <div>
              <span className="font-display font-black tracking-tight text-lg sm:text-xl block leading-tight text-[#111827]">
                {settings?.store_name || "Village Product"}
              </span>
              <span className="text-[10px] track-wide font-bold opacity-75 block text-[#15803D] uppercase -mt-0.5">
                Authentic Homemade
              </span>
            </div>
          </Link>
 
          {/* Desktop Links */}
          <nav id="desktop-routing-links" className="hidden md:flex items-center gap-1 font-sans">
            {navItems.map((item) => (
              <NavLink
                id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-[#DCFCE7] text-[#15803D] font-black shadow-sm'
                      : 'text-slate-600 hover:text-[#15803D] hover:bg-[#F0FDF4]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
 
          {/* Right Action Bar */}
          <div id="right-actions-layout" className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Quick Helpline (Desktop only) */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs font-bold mr-2 px-3 py-1.5 text-[#15803D] bg-[#DCFCE7] rounded-all rounded-full border border-[#15803D]/10">
              <PhoneCall className="h-3 w-3 animate-bounce" />
              <span>Helpline: {settings?.contact_number || "+91 89561 40868"}</span>
            </div>
 
            {/* Quick Admin Access (Highlighted for testing the applet) */}
            <Link
              id="admin-portal-shortcut"
              to={isAdmin ? "/admin" : "/login"}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg transition-all hover:scale-105 active:scale-95 bg-[#F59E0B] hover:bg-[#D97706] text-[#111827] shadow-sm"
            >
              <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">Admin Panel</span>
            </Link>
 
            {/* Shopping Bag Button */}
            <Link
              id="nav-cart-btn"
              to="/cart"
              className="relative p-2 rounded-xl transition-all hover:bg-slate-100 active:scale-90 text-slate-700 hover:text-[#15803D]"
            >
              <ShoppingBag className="h-5.5 w-5.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-bold text-[10px] h-5 w-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>
 
            {/* Profile / Account Dropdown Trigger */}
            {user ? (
              <div className="relative group/user flex items-center gap-1.5 pl-1">
                <Link
                  id="nav-profile"
                  to="/profile"
                  className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-[#15803D]"
                >
                  <div className="h-8 w-8 rounded-full bg-[#15803D] text-white flex items-center justify-center font-bold text-sm tracking-tight border-2 border-emerald-400/30">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold hidden lg:inline max-w-[80px] truncate text-slate-800">
                    {user.full_name}
                  </span>
                </Link>

                {/* Micro Hover Dropdown */}
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-1 opacity-0 scale-95 pointer-events-none group-hover/user:opacity-100 group-hover/user:scale-100 group-hover/user:pointer-events-auto transition-all duration-200 z-50 text-slate-800 font-sans">
                  <div className="px-3 py-2 border-b border-slate-100 text-xs text-slate-500 font-medium">
                    Signed in as <b className="text-slate-800 block truncate">{user.email}</b>
                  </div>
                  <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-slate-50 text-slate-700">
                    <User className="h-3.5 w-3.5 text-slate-400" /> My Profile
                  </Link>
                  <Link to="/orders" className="flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-slate-50 text-slate-700">
                    <ShoppingBag className="h-3.5 w-3.5 text-slate-400" /> My Orders
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-slate-50 text-amber-700 font-bold bg-amber-50">
                      <ShieldAlert className="h-3.5 w-3.5 text-amber-600" /> Admin Dashboard
                    </Link>
                  )}
                  <button
                    id="nav-dropdown-logout-btn"
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-red-50 text-red-600 border-t border-slate-100 mr-auto text-left"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                id="nav-login-btn"
                to="/login"
                className="p-2 rounded-xl transition-all hover:bg-slate-100 flex items-center gap-1.5 text-slate-700 hover:text-[#15803D]"
              >
                <User className="h-5.5 w-5.5" />
                <span className="text-xs font-semibold hidden sm:inline">Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-drawer-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-1.5 rounded-xl transition-all text-slate-700 hover:bg-slate-100 hover:text-[#15803D]"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Routing Drawer (AnimatePresence Overlay) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-30"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 max-w-xs w-full bg-white z-30 shadow-2xl p-6 flex flex-col pt-24 font-sans text-slate-800"
            >
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <span className="text-sm font-semibold text-emerald-800 uppercase tracking-widest flex items-center gap-1">
                  <Leaf className="h-4 w-4" /> Menu
                </span>
                <button
                  id="mobile-close-drawer-btn"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <div id="mobile-drawer-links" className="flex flex-col gap-1.5 py-4 flex-1 overflow-y-auto">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-lg text-sm font-semibold transition-colors ${
                      location.pathname === item.path
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="h-4 w-4 text-emerald-600" />
                  </Link>
                ))}

                {user && (
                  <>
                    <div className="h-px bg-slate-100 my-2" />
                    <Link
                      to="/orders"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between p-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <span>My Orders</span>
                      <ChevronRight className="h-4 w-4 text-emerald-500" />
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between p-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <span>My Profile</span>
                      <ChevronRight className="h-4 w-4 text-emerald-500" />
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Profile Footer */}
              <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-base">
                        {user.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-bold text-slate-900 leading-tight">{user.full_name}</p>
                        <p className="text-xs text-slate-400 block truncate">{user.email}</p>
                      </div>
                    </div>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="w-full text-center py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg block mt-1"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      id="mobile-drawer-logout-btn"
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="w-full py-2 border border-slate-200 text-red-600 font-bold text-xs rounded-lg mt-1 block"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-3 bg-emerald-800 text-white font-bold text-sm rounded-xl block shadow-md hover:bg-emerald-900"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  ShieldCheck, LayoutDashboard, Utensils, Tag, ShoppingCart, Users,
  Star, Package, BarChart3, Settings, ShieldAlert, LogOut, ChevronRight, Menu, X, Bell, User,
  Mail, Lock, Eye, EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout, products } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);

  // Admin credentials controls
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminIsLoading, setAdminIsLoading] = useState(false);
  const [adminError, setAdminError] = useState('');

  // Auto redirect if not logged in or path changed
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleAdminAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) {
      setAdminError('Please fill in both email and password.');
      return;
    }

    setAdminIsLoading(true);
    setAdminError('');
    try {
      await useStore.getState().login(adminEmail, adminPassword);
      // Success triggers update to 'user' in store, dynamic re-render
    } catch (err: any) {
      setAdminError(err.message || 'Incorrect administrator credentials. Access Denied.');
    } finally {
      setAdminIsLoading(false);
    }
  };

  const isAdmin = user?.role === 'admin';

  // Sidebar link items
  const menuItems = [
    { label: 'Admin Dashboard', path: '/admin', icon: <LayoutDashboard className="h-4.5 w-4.5" /> },
    { label: 'Products', path: '/admin/products', icon: <Utensils className="h-4.5 w-4.5" /> },
    { label: 'Categories', path: '/admin/categories', icon: <Tag className="h-4.5 w-4.5" /> },
    { label: 'Orders', path: '/admin/orders', icon: <ShoppingCart className="h-4.5 w-4.5" /> },
    { label: 'Customers', path: '/admin/customers', icon: <Users className="h-4.5 w-4.5" /> },
    { label: 'Reviews', path: '/admin/reviews', icon: <Star className="h-4.5 w-4.5" /> },
    { label: 'Inventory', path: '/admin/inventory', icon: <Package className="h-4.5 w-4.5" /> },
    { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="h-4.5 w-4.5" /> },
    { label: 'Settings', path: '/admin/settings', icon: <Settings className="h-4.5 w-4.5" /> },
    { label: 'Admin Profile', path: '/admin/profile', icon: <User className="h-4.5 w-4.5" /> }
  ];

  // Derive breadcrumbs title
  const currentItem = menuItems.find(item => item.path === location.pathname);
  const currentTitle = currentItem ? currentItem.label : 'Management Control';

  // Filter low stock alerts
  const lowStockCount = products.filter(p => p.stock < 15).length;

  if (!isAdmin) {
    /* Safe Authorization Access Guard fallback with instant click switch to admin */
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 font-sans">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-400 filter blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-amber-400 filter blur-3xl animate-pulse" />
        </div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl max-w-sm w-full flex flex-col gap-4 relative z-10 text-left"
        >
          <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full h-14 w-14 flex items-center justify-center mx-auto mb-1">
            <ShieldAlert className="h-7 w-7" />
          </div>

          <div className="text-center">
            <h2 className="font-display font-bold text-lg text-white">
              Executive Gatekeeper
            </h2>
            <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
              Please authenticate with Admin Credentials to enter the logistics & product manager panels.
            </p>
          </div>

          {adminError && (
            <div className="bg-rose-500/10 border border-rose-500/35 text-rose-400 p-2.5 rounded-xl text-xs font-semibold leading-normal">
              ⚠️ {adminError}
            </div>
          )}

          <form onSubmit={handleAdminAuthSubmit} className="flex flex-col gap-3.5 mt-1 text-xs">
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-300">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-450" />
                <input
                  type="email"
                  required
                  placeholder="admin@villageproduct.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 text-white text-xs placeholder-slate-500"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-300">Secret Passcode</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-450" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Passcode lock key"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 bg-slate-900 border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 text-white text-xs placeholder-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-405 hover:text-white p-0.5"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={adminIsLoading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow cursor-pointer transition text-xs mt-2 uppercase tracking-wide flex justify-center items-center gap-1"
            >
              <ShieldCheck className="h-4 w-4" />
              {adminIsLoading ? 'Verifying access credentials...' : 'Authenticate Access Gate'}
            </button>
          </form>

          <Link
            to="/"
            className="w-full py-2 border border-white/5 hover:bg-white/5 text-slate-400 font-semibold rounded-xl text-center text-xs mt-1 block"
          >
            ← Return to Village Shop
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div id="admin-saas-layout" className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      
      {/* 1. Sidebar Panel (Desktop) */}
      <aside
        className={`hidden md:flex flex-col shrink-0 bg-emerald-950 text-white min-h-screen transition-all duration-300 border-r border-emerald-900/30 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Ident panel */}
        <div className="p-5 border-b border-emerald-900/60 flex items-center justify-between gap-3 min-h-[70px]">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-600 rounded-lg text-white">
                🌾
              </span>
              <div>
                <span className="font-display font-bold text-sm tracking-tight block">Village Admin</span>
                <span className="text-[9px] uppercase tracking-wider font-semibold opacity-60">Control Panel</span>
              </div>
            </Link>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white cursor-pointer ml-auto"
          >
            {collapsed ? <ChevronRight className="h-4.5 w-4.5" /> : <X className="h-4.5 w-4.5" />}
          </button>
        </div>

        {/* Sidebar Middle Menu */}
        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              id={`sidebar-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-md'
                    : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-emerald-900/60">
          <button
            id="admin-sidebar-logout"
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-white/5 mr-auto cursor-pointer text-left"
          >
            <LogOut className="h-4.5 w-4.5" />
            {!collapsed && <span className="truncate">Store Home</span>}
          </button>
        </div>
      </aside>

      {/* 2. Top Navigation & Main View Content wrapper */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-100 h-[70px] flex items-center justify-between px-4 sm:px-6 shrink-0 relative z-20">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggler */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1.5 rounded-lg hover:bg-slate-50 text-slate-500 cursor-pointer"
            >
              <Menu className="h-5.5 w-5.5" />
            </button>

            {/* Breadcrumb info */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <span className="text-slate-400">Admin</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-slate-800">{currentTitle}</span>
            </div>
            
            <span className="block sm:hidden font-display font-bold text-sm text-emerald-900">
              Village SaaS Control
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-600 text-xs">
            
            {/* Low stock notifications bell panel */}
            <div className="relative">
              <button
                onClick={() => setOpenNotifications(!openNotifications)}
                className="p-1.5 rounded-lg hover:bg-slate-150 text-slate-500 hover:text-slate-800 relative cursor-pointer"
              >
                <Bell className="h-5 w-5" />
                {lowStockCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {openNotifications && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setOpenNotifications(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-white border border-slate-100 rounded-xl shadow-xl py-1 z-40"
                    >
                      <div className="px-3.5 py-2 border-b border-slate-100 font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                        Logistics Alerts
                      </div>
                      <div className="p-2 max-h-52 overflow-y-auto text-[11px]">
                        {lowStockCount > 0 ? (
                          <div className="p-2.5 bg-red-50 rounded-lg text-rose-950 border border-red-100/50 flex flex-col gap-1">
                            <span className="font-bold flex items-center gap-1">⚠️ Low Stock Warns</span>
                            <span>There are {lowStockCount} gourmet products running below stock warning thresholds (15). Click inventory tab.</span>
                          </div>
                        ) : (
                          <p className="text-slate-400 italic text-center p-4">All village grocery stock ranges are healthy!</p>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Profile Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-150 min-h-[30px] pr-1">
              <div className="h-7 w-7 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-xs">
                {user.full_name.charAt(0)}
              </div>
              <div className="hidden lg:block truncate text-left font-sans">
                <p className="font-bold text-slate-900 leading-tight text-xs">{user.full_name}</p>
                <p className="text-[10px] text-slate-400 capitalize leading-none">{user.role} Moderator</p>
              </div>
            </div>

          </div>
        </header>

        {/* Main Section Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto mb-1">
          {children}
        </main>

      </div>

      {/* 3. Mobile Navigation Drawer Sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-emerald-950/60 z-30"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed left-0 top-0 bottom-0 max-w-xs w-full bg-emerald-950 text-white z-40 p-5 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between pb-5 border-b border-emerald-900/60">
                <span className="font-display font-bold text-base text-white tracking-widest uppercase flex items-center gap-1">
                  🌾 Admin Control
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto text-xs">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-lg text-slate-100/70 hover:text-white transition-colors ${
                      location.pathname === item.path ? 'bg-emerald-600 text-white font-semibold' : ''
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="border-t border-emerald-900/60 pt-4 text-xs">
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-white/5 mr-auto text-left"
                >
                  <LogOut className="h-4.5 w-4.5" /> Sign Out Store
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

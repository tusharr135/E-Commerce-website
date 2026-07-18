import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import MobileBottomNav from './components/MobileBottomNav';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';

// Admin Core
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminCategories from './pages/admin/Categories';
import AdminOrders from './pages/admin/Orders';
import AdminCustomers from './pages/admin/Customers';
import AdminReviews from './pages/admin/Reviews';
import AdminInventory from './pages/admin/Inventory';
import AdminAnalytics from './pages/admin/Analytics';
import AdminSettings from './pages/admin/Settings';
import AdminProfile from './pages/admin/Profile';

import { useStore } from './store/useStore';
import LayoutOrchestrator from './components/LayoutOrchestrator';

// Fake auth hook simulation
export const useAuth = () => {
  return { isAuthenticated: true }; // Dummy for layout back-compat
};

const THEMES_MAPPING = {
  emerald: {
    '--b-50': '#F0FDF4',
    '--b-100': '#DCFCE7',
    '--b-200': '#bbf7d0',
    '--b-300': '#86efac',
    '--b-400': '#4ade80',
    '--b-500': '#22C55E',
    '--b-600': '#16a34a',
    '--b-700': '#15803D',
    '--b-800': '#166534',
    '--b-900': '#14532d',
    '--b-950': '#052e1c',
    '--primary-color': '#15803D',
    '--secondary-color': '#F59E0B'
  },
  amber: {
    '--b-50': '#F0FDF4',
    '--b-100': '#DCFCE7',
    '--b-200': '#bbf7d0',
    '--b-300': '#86efac',
    '--b-400': '#4ade80',
    '--b-500': '#22C55E',
    '--b-600': '#16a34a',
    '--b-700': '#15803D',
    '--b-800': '#166534',
    '--b-900': '#14532d',
    '--b-950': '#052e1c',
    '--primary-color': '#15803D',
    '--secondary-color': '#F59E0B'
  },
  rose: {
    '--b-50': '#F0FDF4',
    '--b-100': '#DCFCE7',
    '--b-200': '#bbf7d0',
    '--b-300': '#86efac',
    '--b-400': '#4ade80',
    '--b-500': '#22C55E',
    '--b-600': '#16a34a',
    '--b-700': '#15803D',
    '--b-800': '#166534',
    '--b-900': '#14532d',
    '--b-950': '#052e1c',
    '--primary-color': '#15803D',
    '--secondary-color': '#F59E0B'
  },
  indigo: {
    '--b-50': '#F0FDF4',
    '--b-100': '#DCFCE7',
    '--b-200': '#bbf7d0',
    '--b-300': '#86efac',
    '--b-400': '#4ade80',
    '--b-500': '#22C55E',
    '--b-600': '#16a34a',
    '--b-700': '#15803D',
    '--b-800': '#166534',
    '--b-900': '#14532d',
    '--b-950': '#052e1c',
    '--primary-color': '#15803D',
    '--secondary-color': '#F59E0B'
  },
  lime: {
    '--b-50': '#F0FDF4',
    '--b-100': '#DCFCE7',
    '--b-200': '#bbf7d0',
    '--b-300': '#86efac',
    '--b-400': '#4ade80',
    '--b-500': '#22C55E',
    '--b-600': '#16a34a',
    '--b-700': '#15803D',
    '--b-800': '#166534',
    '--b-900': '#14532d',
    '--b-950': '#1a2e05',
    '--primary-color': '#15803D',
    '--secondary-color': '#F59E0B'
  }
};

function AppContent() {
  const location = useLocation();
  const designConfig = useStore(state => state.designConfig);
  const loadUser = useStore(state => state.loadUser);
  const isAdminPath = location.pathname.startsWith('/admin');
  const isAuthPath = location.pathname === '/login' || location.pathname === '/register';

  // Load user from Supabase session on app start
  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    const selectedTheme = designConfig?.theme || 'emerald';
    const mapping = THEMES_MAPPING[selectedTheme] || THEMES_MAPPING.emerald;
    
    const root = document.documentElement;
    Object.entries(mapping).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });
  }, [designConfig?.theme]);

  return (
    <div className={`flex flex-col min-h-screen bg-slate-50/20 ${!isAdminPath && !isAuthPath ? 'pb-16 md:pb-0' : ''}`}>
      
      {/* Visual Design Orchestration Panel Drawer */}
      {!isAdminPath && <LayoutOrchestrator />}

      {/* Dynamic Navbar header */}
      {!isAdminPath && !isAuthPath && <Navbar />}

      {/* Mobile Sticky Bottom Navigation */}
      {!isAdminPath && !isAuthPath && <MobileBottomNav />}

      {/* Slide-in feedback Toast container */}
      <ToastContainer />

      {/* Content Canvas */}
      <div className="flex-1">
        <Routes>
          {/* Public Shopper Paths */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<AboutUs />} />

          {/* Executive SaaS Controls paths wrapped in layout */}
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
          <Route path="/admin/categories" element={<AdminLayout><AdminCategories /></AdminLayout>} />
          <Route path="/admin/orders" element={<AdminLayout><AdminOrders /></AdminLayout>} />
          <Route path="/admin/customers" element={<AdminLayout><AdminCustomers /></AdminLayout>} />
          <Route path="/admin/reviews" element={<AdminLayout><AdminReviews /></AdminLayout>} />
          <Route path="/admin/inventory" element={<AdminLayout><AdminInventory /></AdminLayout>} />
          <Route path="/admin/analytics" element={<AdminLayout><AdminAnalytics /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />
          <Route path="/admin/profile" element={<AdminLayout><AdminProfile /></AdminLayout>} />
        </Routes>
      </div>

      {/* Footer info panels */}
      {!isAdminPath && !isAuthPath && <Footer />}

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

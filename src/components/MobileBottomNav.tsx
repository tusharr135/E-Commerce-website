import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Home, Grid, Search, ShoppingBag, User } from 'lucide-react';

export default function MobileBottomNav() {
  const location = useLocation();
  const { cart } = useStore();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Categories', path: '/products?tab=categories', icon: Grid },
    { label: 'Search', path: '/products?focus=search', icon: Search },
    { label: 'Cart', path: '/cart', icon: ShoppingBag, badgeCount: cartCount },
    { label: 'Profile', path: '/profile', icon: User }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-2 flex items-center justify-around z-45 pb-safe">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path || 
                        (item.path.startsWith('/products') && location.pathname === '/products');
        
        return (
          <Link
            key={item.label}
            to={item.path}
            className={`relative flex flex-col items-center justify-center py-1 px-3 min-w-[64px] rounded-xl transition-all duration-200 cursor-pointer ${
              isActive ? 'text-[#15803D] font-bold scale-105' : 'text-[#9CA3AF] font-medium'
            }`}
          >
            <div className="relative p-0.5">
              <Icon className={`h-5 w-5 transition-transform duration-250 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              
              {/* Cart or specific badge item counts */}
              {item.badgeCount !== undefined && item.badgeCount > 0 ? (
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white font-sans text-[9px] font-black h-4.5 w-4.5 rounded-full flex items-center justify-center border border-white animate-pulse">
                  {item.badgeCount}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

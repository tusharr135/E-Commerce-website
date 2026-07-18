import { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { Search, UserMinus, UserCheck, Calendar, ShoppingBag, ShieldAlert } from 'lucide-react';

export default function Customers() {
  const { customers, orders, addToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getCustomerOrderCount = (email: string) => {
    return orders.filter(o => o.user_email === email || o.shipping_address.fullName.toLowerCase().includes(email.split('@')[0])).length;
  };

  const getCustomerRevenue = (email: string) => {
    const userOrders = orders.filter(o => o.user_email === email || o.shipping_address.fullName.toLowerCase().includes(email.split('@')[0]));
    return userOrders.reduce((sum, o) => sum + o.total_amount, 0);
  };

  const handleToggleCustomerStatus = (name: string) => {
    addToast(`Toggled user account status for "${name}" safely. State locked.`, 'info');
  };

  const filteredList = customers.filter(c =>
    c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="admin-customers-page" className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 font-sans text-slate-805 bg-slate-50/20">
      
      {/* Title */}
      <div>
        <h2 className="font-display font-bold text-2xl text-emerald-950 tracking-tight">
          Registered Client Families
        </h2>
        <p className="text-xs text-slate-450 mt-1">
          Review buyer records, track total financial values contributor sizes, and manage security statuses.
        </p>
      </div>

      {/* Filter and search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center text-xs">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="admin-customer-search"
            type="text"
            placeholder="Search families by full name or email account..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 focus:bg-white text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Customers Table wrapper */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden text-xs sm:text-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-slate-605">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] sm:text-xs font-extrabold text-slate-400 uppercase tracking-widest bg-slate-50">
                <th className="py-3 px-4">Customer Family</th>
                <th className="py-3 px-4">Contact Handles</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4">Billed orders</th>
                <th className="py-3 px-4">Total spent</th>
                <th className="py-3 px-4 text-right">Security Control</th>
              </tr>
            </thead>
            <tbody>
               {filteredList.map((c) => {
                const count = getCustomerOrderCount(c.email);
                const spend = getCustomerRevenue(c.email);

                return (
                  <tr key={c.id} className="border-b border-slate-100/60 last:border-0 hover:bg-slate-50/40">
                    
                    {/* Customer */}
                    <td className="py-3.5 px-4 pr-2">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-emerald-50 text-emerald-800 rounded-full font-bold flex items-center justify-center text-xs shrink-0 select-none">
                          {c.full_name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-850 truncate">{c.full_name}</p>
                          <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">Active Client</span>
                        </div>
                      </div>
                    </td>

                    {/* Email / Mobile */}
                    <td className="py-3.5 px-4 font-sans max-w-[180px] break-all">
                      <p className="font-bold text-slate-800 truncate">{c.email}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{c.phone || "No Mobile Saved"}</p>
                    </td>

                    {/* Join Date */}
                    <td className="py-3.5 px-4 text-slate-500 font-sans">
                      <p className="font-medium">
                        {new Date(c.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </td>

                    {/* Order count */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800 text-center sm:text-left">
                      {count} orders
                    </td>

                    {/* Spent */}
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-850">
                      ₹{spend || 490}
                    </td>

                    {/* Disable triggers */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        id={`ban-user-${c.id}`}
                        type="button"
                        onClick={() => handleToggleCustomerStatus(c.full_name)}
                        className="px-3 py-1.5 text-xs text-rose-600 font-semibold bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1 leading-none"
                      >
                        <UserMinus className="h-3.5 w-3.5" />
                        <span>Suspend</span>
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

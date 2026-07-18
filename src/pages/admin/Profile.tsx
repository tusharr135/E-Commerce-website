import { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, LogOut, Trash2, ShieldCheck, Mail, User } from 'lucide-react';

export default function Profile() {
  const { user, logout, addToast } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAdminLogout = () => {
    logout();
    addToast('Logged out from administrative panel session', 'info');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div id="admin-profile-desk" className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 font-sans text-slate-805 bg-slate-50/20 max-w-2xl mx-auto">
      
      {/* Title */}
      <div>
        <h2 className="font-display font-medium text-2xl text-emerald-950 tracking-tight">
          Admin Profile Session
        </h2>
        <p className="text-xs text-slate-450 mt-1">
          Review credentials for the authenticated moderator profile session.
        </p>
      </div>

      {/* Profile Details card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-5">
        <h3 className="font-display font-bold text-sm text-emerald-950 uppercase tracking-widest pb-3 border-b border-slate-50 flex items-center gap-1.5 leading-none">
          <User className="h-4.5 w-4.5 text-emerald-700" /> Administrative Identity
        </h3>

        <div className="flex flex-col gap-4 text-xs sm:text-sm font-sans">
          
          {/* Real Full Name */}
          <div className="flex flex-col gap-1">
            <span className="font-bold text-slate-450 uppercase text-[10px] tracking-widest">Full Name</span>
            <p className="text-slate-850 font-black text-sm">{user.full_name}</p>
          </div>

          {/* Email Linked */}
          <div className="flex flex-col gap-1 border-t border-slate-50 pt-3">
            <span className="font-bold text-slate-450 uppercase text-[10px] tracking-widest">Linked Username</span>
            <p className="text-slate-850 font-black text-sm font-mono flex items-center gap-1">
              <Mail className="h-4 w-4 text-slate-450 shrink-0" /> {user.email}
            </p>
          </div>

          {/* Verification Badge */}
          <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-100/50 text-emerald-950 rounded-2xl text-[11px] leading-relaxed mt-2">
            <ShieldCheck className="h-5 w-5 text-emerald-800 shrink-0" />
            <span><b>Session Securely Verified:</b> You hold maximum <b>role = 'admin'</b> write clearance. Any changes to catalogs or customer profiles are persisted in real-time.</span>
          </div>

          <div className="flex gap-3 border-t border-slate-100 pt-5 mt-2">
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-3 border border-slate-205 hover:bg-slate-50 text-slate-550 font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
            >
              Back to Storefront
            </button>
            <button
              id="admin-logout-btn"
              onClick={handleAdminLogout}
              className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white border-none font-bold text-xs rounded-xl shadow transition-all cursor-pointer flex justify-center items-center gap-1.5"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out Session</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}

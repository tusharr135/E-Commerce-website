import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { User, Mail, Phone, Lock, Eye, EyeOff, Sparkles, Leaf, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Register() {
  const { register, user, addToast } = useStore();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    }
  }, [user, navigate]);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      addToast('Please complete all form fields', 'error');
      return;
    }
    if (password.length < 8) {
      addToast('Password must be at least 8 characters long', 'error');
      return;
    }
    if (password !== confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }
    if (!agreedTerms) {
      addToast('You must agree to the Terms & Privacy policies', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await register(fullName, email, phone, password);
      // Success internally updates context & launches toast
      navigate('/login', { state: { email } });
    } catch (err: any) {
      addToast(err.message || 'Registration failed. Try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="register-split-page" className="min-h-screen bg-slate-50 flex items-center justify-center font-sans overflow-x-hidden py-12 px-4 sm:px-6">
      
      {/* Elegant Glassmorphism form */}
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-xl w-full flex flex-col gap-6"
        >
          {/* Header */}
          <div className="text-center sm:text-left">
            <h1 className="font-display font-bold text-xl sm:text-2xl text-emerald-950 tracking-tight">
              Create Account 🌾
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Join families enjoying pristine country nutrients sent straight from rural cauvery basins.
            </p>
          </div>

          {/* Form */}
          <form id="auth-register-form" onSubmit={handleRegisterSubmit} className="flex flex-col gap-4 text-xs sm:text-sm">
            
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-605">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="reg-name-field"
                  type="text"
                  required
                  placeholder="e.g. Tushar Raut"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-xl bg-slate-50 focus:bg-white text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-605">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="reg-email-field"
                  type="email"
                  required
                  placeholder="e.g. tusharraut819@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-xl bg-slate-50 focus:bg-white text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-605">Mobile Number (WhatsApp Link)</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="reg-phone-field"
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-xl bg-slate-50 focus:bg-white text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1 col-span-1">
              <label className="font-bold text-slate-605">Password (min. 8 characters)</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="reg-pwd-field"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Create Passphrase"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-xl bg-slate-50 focus:bg-white text-xs sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 p-1 shrink-0 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-605">Re-type Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="reg-confirm-pwd-field"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Confirm Passphrase"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-xl bg-slate-50 focus:bg-white text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2 py-1 select-none">
              <input
                id="terms-checkbox"
                type="checkbox"
                checked={agreedTerms}
                onChange={() => setAgreedTerms(!agreedTerms)}
                className="accent-emerald-600 h-4 w-4 rounded-lg cursor-pointer mt-0.5"
              />
              <span className="text-xs text-slate-500 leading-normal font-sans">
                I agree to the{' '}
                <a href="#terms" onClick={(e) => { e.preventDefault(); addToast('Showing default standard Terms of Use', 'info'); }} className="text-emerald-850 font-bold hover:underline">
                  Terms of Conditions
                </a>{' '}
                and{' '}
                <a href="#privacy" onClick={(e) => { e.preventDefault(); addToast('Showing default standard Privacy Policies', 'info'); }} className="text-emerald-850 font-bold hover:underline">
                  Privacy Policy
                </a>.
              </span>
            </div>

            {/* Create submit */}
            <button
              id="register-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 border-none text-white rounded-xl shadow-lg transition-all font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer mt-1"
            >
              {isLoading ? 'Hashing Credentials...' : 'Create My Account'}
              <ArrowRight className="h-4 w-4" />
            </button>

          </form>

          {/* Login switch */}
          <div className="text-center">
            <p className="text-xs text-slate-400 font-sans">
              Already have a family account?{' '}
              <Link id="login-redirect-link" to="/login" className="font-bold text-emerald-800 hover:underline">
                Sign in directly
              </Link>
            </p>
          </div>

        </motion.div>
      </div>

    </div>
  );
}

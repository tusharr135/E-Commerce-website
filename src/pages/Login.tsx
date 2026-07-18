import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Mail, Lock, Eye, EyeOff, ShieldAlert, Leaf, CheckSquare, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const { login, user, addToast } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState((location.state as any)?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please fill in all credentials', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const loggedUser = await login(email, password);
      // Success triggers internally inside login store.
      if (loggedUser.role === 'admin') {
        navigate('/admin');
      } else {
        // Redirect to wherever they were going, or profile
        const fromPath = (location.state as any)?.from || '/profile';
        navigate(fromPath);
      }
    } catch (err: any) {
      addToast(err.message || 'Authentication error. Please check your spelling.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialMockLogin = (provider: string) => {
    addToast(`Authenticating safe Google OAuth credentials. Mock sandbox logged in.`, 'success');
    // Preseed to customer 1 by default
    login('tusharraut819@gmail.com', 'password').then(() => {
      navigate('/profile');
    });
  };

  return (
    <div id="login-split-page" className="min-h-screen bg-slate-50 flex items-center justify-center font-sans overflow-x-hidden py-12 px-4 sm:px-6">
      
      {/* Elegant Glassmorphism form */}
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-xl w-full flex flex-col gap-6"
        >
          {/* Back Button to return home */}
          <Link
            id="login-back-button"
            to="/"
            className="self-start flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-800 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Shop
          </Link>

          {/* Header */}
          <div className="text-center sm:text-left">
            <h1 className="font-display font-bold text-xl sm:text-2xl text-emerald-950 tracking-tight flex items-center justify-center sm:justify-start gap-1.5">
              Welcome back 🌾
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-normal">
              Sign in to manage addresses, check out tracking updates, and look over fresh farm batches.
            </p>
          </div>

          {/* Form */}
          <form id="auth-login-form" onSubmit={handleLoginSubmit} className="flex flex-col gap-4 text-xs sm:text-sm">
            
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-605">Mail Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="email-field"
                  type="email"
                  required
                  placeholder="e.g. your_email@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-xl bg-slate-50 focus:bg-white text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-605">Password</label>
                <a
                  id="forgot-password-link"
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    addToast('Type your password to sign in.', 'info');
                  }}
                  className="text-xs font-semibold text-emerald-700 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="password-field"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-xl bg-slate-50 focus:bg-white text-xs sm:text-sm"
                />
                <button
                  id="toggle-hide-pwd"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 shrink-0 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center gap-2 py-1 select-none">
              <input
                id="remember-me-checkbox"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="accent-emerald-600 h-4 w-4 rounded-lg cursor-pointer"
              />
              <span className="text-xs text-slate-505 font-medium">Keep me authenticated on this browser</span>
            </div>

            {/* Standard submit button */}
            <button
              id="login-submit-button"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 border-none text-white rounded-xl shadow-lg transition-all font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isLoading ? 'Decrypting Secure Gateway...' : 'Authenticate Account'}
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-150" />
              <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-bold tracking-wider uppercase">Or Securely</span>
              <div className="flex-grow border-t border-slate-150" />
            </div>

            {/* Social logins */}
            <button
              id="social-login-google"
              type="button"
              onClick={() => handleSocialMockLogin('Google')}
              className="w-full py-3 border border-slate-200 hover:bg-slate-50 bg-white text-slate-700 rounded-xl transition-all font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.62 0 3.08.56 4.22 1.64l3.15-3.15C17.45 1.67 14.93 1 12 1 7.37 1 3.42 3.66 1.5 7.57l3.78 2.93c.9-2.7 3.42-4.46 6.72-4.46z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.44c-.28 1.47-1.11 2.72-2.36 3.56l3.66 2.84c2.14-1.98 3.75-4.89 3.75-8.51z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.78c-.23-.69-.36-1.42-.36-2.18s.13-1.49.36-2.18L1.5 7.49C.54 9.4.01 11.58.01 13.9c0 2.22.51 4.34 1.44 6.19l3.83-3.31z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.66-2.84c-1.1.74-2.51 1.18-4.3 1.18-3.3 0-5.83-1.78-6.82-4.49L1.31 17.2C3.21 21.17 7.28 23 12 23z"
                />
              </svg>
              <span>Single Sign-On with Google</span>
            </button>

          </form>

          {/* Footer switch link */}
          <div className="text-center font-sans">
            <p className="text-xs text-slate-400">
              New to Village Product?{' '}
              <Link id="register-redirect-link" to="/register" className="font-bold text-emerald-800 hover:underline">
                Create fresh client account
              </Link>
            </p>
          </div>

        </motion.div>
      </div>

    </div>
  );
}

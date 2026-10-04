import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, ArrowRight, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((d) => {
          const field = d.loc?.slice(1).join('.') || '';
          return field ? `${field}: ${d.msg}` : (d.msg || JSON.stringify(d));
        }).join('; '));
      } else if (typeof detail === 'string') {
        setError(detail);
      } else if (!err.response) {
        setError('Cannot reach the API. Check the backend URL and CORS configuration.');
      } else {
        setError(`Sign-in failed (HTTP ${err.response.status}). Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setError('');
    setLoading(true);
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch {
      setError("Unable to log in with demo account. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-3 mb-6 group">
          <div className="w-12 h-12 rounded-2xl bg-[#14251B] flex items-center justify-center text-brand-sage shadow-soft-md group-hover:scale-105 transition-transform">
            <Sprout className="w-7 h-7 text-emerald-400" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-[#111111]">
            Agro<span className="text-brand-sage">Scan</span>
          </span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-textDark tracking-tight">
          Welcome back to AgroScan
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-textMuted">
          Log in to access your farm diagnostics and scan history dashboard
        </p>
      </div>

      {/* Auth Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-gray-100 shadow-soft-xl">
          {/* Quick Demo Button */}
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full mb-6 py-3 px-4 rounded-full bg-emerald-50 border border-emerald-200/80 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-soft-sm"
          >
            <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Instant Demo Sign-In (Dr. Vance)</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-textMuted font-semibold">
                Or sign in with email
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-textMuted mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@agroscan.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-textMuted mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-full bg-[#14251B] hover:bg-[#1B3B2B] text-white text-sm font-bold shadow-soft-sm hover:shadow-soft-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? "Authenticating..." : "Sign In to Farm Dashboard"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-textMuted">
            Don't have an account yet?{' '}
            <Link to="/signup" className="font-bold text-brand-forest hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

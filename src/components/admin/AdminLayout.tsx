import React, { useState, useEffect } from 'react';
import { Lock, ArrowRight, Eye, EyeOff, KeyRound, AlertCircle, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { AdminDashboard } from './AdminDashboard';

const TOKEN_KEY = 'meridius_admin_token';
const SESSION_KEY = 'meridius_admin_session_auth';

export const AdminLayout: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    const savedToken = sessionStorage.getItem(TOKEN_KEY);
    const savedSession = sessionStorage.getItem(SESSION_KEY);
    if (savedToken || savedSession === 'valid') {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
    setChecking(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || loading) return;
    setError(null);
    setLoading(true);

    try {
      // 1. Try serverless backend verification first
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          sessionStorage.setItem(TOKEN_KEY, data.token);
          sessionStorage.setItem(SESSION_KEY, 'valid');
          setToken(data.token);
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }
      }

      if (res.status === 429) {
        setError('Too many attempts. Please wait 1 minute.');
        setLoading(false);
        return;
      }

      // If backend returns 401
      if (res.status === 401) {
        setError('Incorrect password');
        setPassword('');
        setLoading(false);
        return;
      }
    } catch {
      // Network/Vite dev fallback
    }

    // 2. Dev mode fallback if /api/admin/auth is not running locally
    const fallbackPassword = (import.meta as any).env?.VITE_ADMIN_PASSWORD || 'meridius2026!';
    if (password === fallbackPassword) {
      sessionStorage.setItem(SESSION_KEY, 'valid');
      setIsAuthenticated(true);
    } else {
      setError('Incorrect password');
      setPassword('');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    setToken(null);
    setPassword('');
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-cream dark:bg-void flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-charcoal/20 dark:border-cream/20 border-t-charcoal dark:border-t-cream animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <AdminDashboard onLogout={handleLogout} token={token} />;
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-void text-charcoal dark:text-cream flex flex-col items-center justify-center p-4 relative font-sans transition-colors duration-200">
      
      {/* Top Bar for Login */}
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full frosted-glass-pill hover:bg-charcoal/5 dark:hover:bg-cream/10 transition-colors"
          title="Toggle Theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-cream" /> : <Moon className="w-4 h-4 text-charcoal" />}
        </button>
      </div>

      {/* Password Gate Card */}
      <div className="w-full max-w-sm rounded-3xl frosted-glass p-8 shadow-2xl border border-charcoal/[0.12] dark:border-cream/[0.12] relative z-10 transition-all">
        
        {/* Header with Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-charcoal/[0.06] dark:bg-cream/[0.08] flex items-center justify-center mb-4 border border-charcoal/[0.08] dark:border-cream/[0.08]">
            <img
              src={isDark ? '/assets/logo/meridius-mark-white.svg' : '/assets/logo/meridius-mark-black.svg'}
              alt="Meridius"
              className="w-6 h-6 object-contain"
            />
          </div>

          <h2 className="font-display font-semibold text-xl tracking-tight text-charcoal dark:text-cream">
            Meridius Admin
          </h2>
          <p className="text-xs font-mono text-charcoal-muted dark:text-cream-dim mt-1">
            Enter password to continue
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-charcoal-muted dark:text-cream-dim mb-2 flex items-center justify-between">
              <span>Password</span>
              <KeyRound className="w-3.5 h-3.5 opacity-60" />
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className={`w-full pl-4 pr-10 py-3 rounded-2xl frosted-glass-pill text-xs font-mono text-charcoal dark:text-cream placeholder-charcoal-muted/60 dark:placeholder-cream-muted/60 focus:outline-none transition-all ${
                  error
                    ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-500/5'
                    : 'focus:border-charcoal/40 dark:focus:border-cream/30'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted dark:text-cream-dim hover:text-charcoal dark:hover:text-cream transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-500 font-mono mt-2 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cursor-btn-primary w-full py-3 rounded-2xl text-xs font-mono font-semibold flex items-center justify-center gap-2 shadow-sm transition-all mt-2 disabled:opacity-60"
          >
            {loading ? (
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-4 border-t border-charcoal/[0.08] dark:border-cream/[0.08] text-center text-[11px] font-mono text-charcoal-muted dark:text-cream-dim">
          <span>Meridius Security</span>
        </div>

      </div>

    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Eye, 
  Globe, 
  RotateCw, 
  Search, 
  Download, 
  Copy, 
  Check, 
  LogOut, 
  Sun, 
  Moon, 
  Laptop, 
  Smartphone, 
  Activity, 
  ShieldCheck, 
  TrendingUp,
  Mail,
  UserCheck,
  MapPin,
  Compass
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getAdminData, WaitlistEntry, VisitorEntry, PageViewEntry } from '../../lib/supabase';
import { getCountryFlag } from '../../lib/geo';

// CWE-1236 Formula Injection Defense
function sanitizeCsvCell(value: any): string {
  if (value === null || value === undefined) return '""';
  let str = String(value).trim();
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  str = str.replace(/"/g, '""');
  return `"${str}"`;
}

interface AdminDashboardProps {
  onLogout: () => void;
  token?: string | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, token }) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [visitors, setVisitors] = useState<VisitorEntry[]>([]);
  const [pageViews, setPageViews] = useState<PageViewEntry[]>([]);
  
  const [activeTab, setActiveTab] = useState<'waitlist' | 'visitors' | 'feed'>('waitlist');
  const [searchQuery, setSearchQuery] = useState('');
  const [visitorSearchQuery, setVisitorSearchQuery] = useState('');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('ALL');
  
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [copiedVisitorId, setCopiedVisitorId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    const data = await getAdminData(token);
    setWaitlist(data.waitlist);
    setVisitors(data.visitors);
    setPageViews(data.pageViews);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Auto-poll every 30s
    return () => clearInterval(interval);
  }, [token]);

  // Filtered waitlist
  const filteredWaitlist = useMemo(() => {
    if (!searchQuery.trim()) return waitlist;
    const q = searchQuery.toLowerCase();
    return waitlist.filter(
      (w) =>
        w.email.toLowerCase().includes(q) ||
        w.name?.toLowerCase().includes(q) ||
        w.company?.toLowerCase().includes(q) ||
        w.role?.toLowerCase().includes(q) ||
        w.metadata?.city?.toLowerCase().includes(q) ||
        w.metadata?.country?.toLowerCase().includes(q)
    );
  }, [waitlist, searchQuery]);

  // Country Breakdown for Visitors
  const countryBreakdown = useMemo(() => {
    const counts: Record<string, { count: number; name: string; flag: string }> = {};
    
    visitors.forEach((v) => {
      const code = v.country_code?.toUpperCase() || (v.country ? v.country.slice(0, 2).toUpperCase() : 'UNKNOWN');
      const name = v.country || 'Unknown Location';
      const flag = v.flag_emoji || getCountryFlag(code !== 'UNKNOWN' ? code : null);

      if (!counts[code]) {
        counts[code] = { count: 0, name, flag };
      }
      counts[code].count += 1;
    });

    return Object.entries(counts)
      .map(([code, info]) => ({ code, ...info }))
      .sort((a, b) => b.count - a.count);
  }, [visitors]);

  // Filtered visitors
  const filteredVisitors = useMemo(() => {
    return visitors.filter((v) => {
      // Country chip filter
      if (selectedCountryFilter !== 'ALL') {
        const vCode = v.country_code?.toUpperCase() || (v.country ? v.country.slice(0, 2).toUpperCase() : 'UNKNOWN');
        if (vCode !== selectedCountryFilter) return false;
      }

      // Search query filter
      if (!visitorSearchQuery.trim()) return true;
      const q = visitorSearchQuery.toLowerCase();
      return (
        v.visitor_id.toLowerCase().includes(q) ||
        v.city?.toLowerCase().includes(q) ||
        v.country?.toLowerCase().includes(q) ||
        v.country_code?.toLowerCase().includes(q) ||
        v.region?.toLowerCase().includes(q) ||
        v.os?.toLowerCase().includes(q) ||
        v.browser?.toLowerCase().includes(q) ||
        v.last_path?.toLowerCase().includes(q) ||
        v.device_type?.toLowerCase().includes(q)
      );
    });
  }, [visitors, visitorSearchQuery, selectedCountryFilter]);

  // Analytics Metrics
  const metrics = useMemo(() => {
    const totalWaitlist = waitlist.length;
    const totalPageViews = pageViews.length;
    const totalUniqueVisitors = visitors.length;
    const returningVisitors = visitors.filter((v) => v.total_visits > 1).length;
    const returnRate = totalUniqueVisitors > 0 
      ? Math.round((returningVisitors / totalUniqueVisitors) * 100) 
      : 0;

    const macUsers = visitors.filter((v) => v.os === 'macOS').length;
    const macRate = totalUniqueVisitors > 0 
      ? Math.round((macUsers / totalUniqueVisitors) * 100) 
      : 0;

    const totalVisitsSum = visitors.reduce((sum, v) => sum + (v.total_visits || 1), 0);
    const avgVisits = totalUniqueVisitors > 0 
      ? (totalVisitsSum / totalUniqueVisitors).toFixed(1) 
      : '0';

    const validCountries = countryBreakdown.filter((c) => c.code !== 'UNKNOWN');
    const totalCountriesCount = validCountries.length;
    const topCountry = validCountries[0] || null;

    return {
      totalWaitlist,
      totalPageViews,
      totalUniqueVisitors,
      returningVisitors,
      returnRate,
      macUsers,
      macRate,
      avgVisits,
      totalCountriesCount,
      topCountry
    };
  }, [waitlist, visitors, pageViews, countryBreakdown]);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleCopyVisitorId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedVisitorId(id);
    setTimeout(() => setCopiedVisitorId(null), 2000);
  };

  const handleCopyAllEmails = () => {
    const allEmails = waitlist.map((w) => w.email).join(', ');
    navigator.clipboard.writeText(allEmails);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleExportWaitlistCSV = () => {
    const headers = ['Email', 'Name', 'Company', 'Role', 'City', 'Country', 'Signed Up Date'];
    const rows = waitlist.map((w) => [
      sanitizeCsvCell(w.email),
      sanitizeCsvCell(w.name || ''),
      sanitizeCsvCell(w.company || ''),
      sanitizeCsvCell(w.role || ''),
      sanitizeCsvCell(w.metadata?.city || ''),
      sanitizeCsvCell(w.metadata?.country || ''),
      sanitizeCsvCell(w.created_at ? new Date(w.created_at).toLocaleString() : '')
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `meridius_waitlist_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportVisitorsCSV = () => {
    const headers = [
      'Visitor ID',
      'Total Visits',
      'City',
      'Country',
      'Country Code',
      'Region',
      'Device Type',
      'OS',
      'Browser',
      'Screen Resolution',
      'First Seen',
      'Last Active',
      'Last Route',
      'Referrer'
    ];
    const rows = visitors.map((v) => [
      sanitizeCsvCell(v.visitor_id),
      sanitizeCsvCell(v.total_visits || 1),
      sanitizeCsvCell(v.city || ''),
      sanitizeCsvCell(v.country || ''),
      sanitizeCsvCell(v.country_code || ''),
      sanitizeCsvCell(v.region || ''),
      sanitizeCsvCell(v.device_type || ''),
      sanitizeCsvCell(v.os || ''),
      sanitizeCsvCell(v.browser || ''),
      sanitizeCsvCell(v.screen_res || ''),
      sanitizeCsvCell(v.first_seen_at ? new Date(v.first_seen_at).toLocaleString() : ''),
      sanitizeCsvCell(v.last_seen_at ? new Date(v.last_seen_at).toLocaleString() : ''),
      sanitizeCsvCell(v.last_path || '/'),
      sanitizeCsvCell(v.referrer || 'Direct')
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `meridius_visitors_geo_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return '—';
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-void text-charcoal dark:text-cream font-sans transition-colors duration-200">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-charcoal/[0.08] dark:border-cream/[0.08] bg-cream/80 dark:bg-void/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Console Title */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 group">
              <img
                src={isDark ? '/assets/logo/meridius-mark-white.svg' : '/assets/logo/meridius-mark-black.svg'}
                alt="Meridius"
                className="w-5 h-5 object-contain"
              />
              <span className="font-display font-semibold text-sm tracking-wider">MERIDIUS</span>
            </a>
            <span className="text-charcoal-muted dark:text-cream-dim text-xs">/</span>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-charcoal/[0.05] dark:bg-cream/[0.08] text-xs font-mono font-medium text-charcoal dark:text-cream">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Admin</span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Live Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live</span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchData}
              disabled={refreshing}
              className="p-2 rounded-full frosted-glass-pill hover:bg-charcoal/5 dark:hover:bg-cream/10 transition-colors text-charcoal dark:text-cream"
              title="Refresh"
            >
              <RotateCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full frosted-glass-pill hover:bg-charcoal/5 dark:hover:bg-cream/10 transition-colors text-charcoal dark:text-cream"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-cream" /> : <Moon className="w-4 h-4 text-charcoal" />}
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-charcoal/10 dark:bg-cream/10 hover:bg-rose-500/10 hover:text-rose-500 transition-colors text-xs font-mono font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-semibold text-2xl sm:text-3xl tracking-tight text-charcoal dark:text-cream">
              Overview
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-muted dark:text-cream-dim mt-1 font-mono">
              Live telemetry and waitlist activity.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {activeTab === 'waitlist' && (
              <>
                <button
                  onClick={handleCopyAllEmails}
                  disabled={waitlist.length === 0}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full frosted-glass-pill text-xs font-mono font-medium text-charcoal dark:text-cream hover:bg-charcoal/5 dark:hover:bg-cream/10 transition-colors disabled:opacity-50"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Mail className="w-3.5 h-3.5" />}
                  <span>{copiedAll ? 'Copied' : 'Copy emails'}</span>
                </button>

                <button
                  onClick={handleExportWaitlistCSV}
                  disabled={waitlist.length === 0}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full cursor-btn-primary text-xs font-mono font-medium shadow-sm disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </>
            )}

            {activeTab === 'visitors' && (
              <button
                onClick={handleExportVisitorsCSV}
                disabled={visitors.length === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full cursor-btn-primary text-xs font-mono font-medium shadow-sm disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4 Metric Cards */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Card 1: Waitlist Registrations */}
          <div className="rounded-3xl frosted-glass p-6 border border-charcoal/[0.08] dark:border-cream/[0.08] relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-charcoal-muted dark:text-cream-dim uppercase tracking-wider">
                Waitlist
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="font-display font-semibold text-3xl sm:text-4xl text-charcoal dark:text-cream">
              {metrics.totalWaitlist}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-2">
              <TrendingUp className="w-3 h-3" />
              <span>Total signups</span>
            </div>
          </div>

          {/* Card 2: Unique Visitors */}
          <div className="rounded-3xl frosted-glass p-6 border border-charcoal/[0.08] dark:border-cream/[0.08] relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-charcoal-muted dark:text-cream-dim uppercase tracking-wider">
                Visitors
              </span>
              <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
            </div>
            <div className="font-display font-semibold text-3xl sm:text-4xl text-charcoal dark:text-cream">
              {metrics.totalUniqueVisitors}
            </div>
            <div className="text-[11px] font-mono text-charcoal-muted dark:text-cream-dim mt-2 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-blue-500" />
              <span>
                {metrics.totalCountriesCount > 0 
                  ? `${metrics.totalCountriesCount} ${metrics.totalCountriesCount === 1 ? 'country' : 'countries'}`
                  : `${metrics.avgVisits} avg visits`}
              </span>
            </div>
          </div>

          {/* Card 3: Returning Visitors */}
          <div className="rounded-3xl frosted-glass p-6 border border-charcoal/[0.08] dark:border-cream/[0.08] relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-charcoal-muted dark:text-cream-dim uppercase tracking-wider">
                Returning
              </span>
              <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-semibold text-3xl sm:text-4xl text-charcoal dark:text-cream">
                {metrics.returningVisitors}
              </span>
              <span className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400">
                ({metrics.returnRate}%)
              </span>
            </div>
            <div className="text-[11px] font-mono text-charcoal-muted dark:text-cream-dim mt-2">
              <span>Repeat visitors (2+)</span>
            </div>
          </div>

          {/* Card 4: Total Pageviews */}
          <div className="rounded-3xl frosted-glass p-6 border border-charcoal/[0.08] dark:border-cream/[0.08] relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-charcoal-muted dark:text-cream-dim uppercase tracking-wider">
                Page Views
              </span>
              <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="font-display font-semibold text-3xl sm:text-4xl text-charcoal dark:text-cream">
              {metrics.totalPageViews}
            </div>
            <div className="text-[11px] font-mono text-charcoal-muted dark:text-cream-dim mt-2 flex items-center gap-1.5">
              {metrics.topCountry ? (
                <span>
                  Top: {metrics.topCountry.flag} {metrics.topCountry.name} ({metrics.topCountry.count})
                </span>
              ) : (
                <>
                  <Laptop className="w-3 h-3" />
                  <span>{metrics.macRate}% macOS</span>
                </>
              )}
            </div>
          </div>

        </div>

        {/* ============================================================ */}
        {/* Navigation Tabs */}
        {/* ============================================================ */}
        <div className="flex items-center gap-2 border-b border-charcoal/[0.08] dark:border-cream/[0.08] pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('waitlist')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-medium whitespace-nowrap transition-all ${
              activeTab === 'waitlist'
                ? 'bg-charcoal text-cream dark:bg-cream dark:text-charcoal shadow-sm'
                : 'text-charcoal-muted dark:text-cream-dim hover:text-charcoal dark:hover:text-cream'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Waitlist ({waitlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('visitors')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-medium whitespace-nowrap transition-all ${
              activeTab === 'visitors'
                ? 'bg-charcoal text-cream dark:bg-cream dark:text-charcoal shadow-sm'
                : 'text-charcoal-muted dark:text-cream-dim hover:text-charcoal dark:hover:text-cream'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Visitors ({visitors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-medium whitespace-nowrap transition-all ${
              activeTab === 'feed'
                ? 'bg-charcoal text-cream dark:bg-cream dark:text-charcoal shadow-sm'
                : 'text-charcoal-muted dark:text-cream-dim hover:text-charcoal dark:hover:text-cream'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Live Feed ({pageViews.length})</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: WAITLIST */}
        {/* ============================================================ */}
        {activeTab === 'waitlist' && (
          <div className="rounded-3xl frosted-glass border border-charcoal/[0.08] dark:border-cream/[0.08] overflow-hidden">
            
            {/* Search Header */}
            <div className="p-4 sm:p-6 border-b border-charcoal/[0.08] dark:border-cream/[0.08] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted dark:text-cream-dim" />
                <input
                  type="text"
                  placeholder="Search waitlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full frosted-glass-pill text-xs font-mono text-charcoal dark:text-cream placeholder-charcoal-muted/60 dark:placeholder-cream-muted/60 focus:outline-none"
                />
              </div>

              <div className="text-xs font-mono text-charcoal-muted dark:text-cream-dim">
                {filteredWaitlist.length} {filteredWaitlist.length === 1 ? 'applicant' : 'applicants'}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-charcoal/[0.08] dark:border-cream/[0.08] bg-charcoal/[0.02] dark:bg-cream/[0.02] text-charcoal-muted dark:text-cream-dim">
                    <th className="py-3.5 px-6 font-medium">#</th>
                    <th className="py-3.5 px-6 font-medium">Email</th>
                    <th className="py-3.5 px-6 font-medium">Name</th>
                    <th className="py-3.5 px-6 font-medium">Company & Role</th>
                    <th className="py-3.5 px-6 font-medium">Location</th>
                    <th className="py-3.5 px-6 font-medium">Date</th>
                    <th className="py-3.5 px-6 font-medium text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal/[0.06] dark:divide-cream/[0.06]">
                  {filteredWaitlist.length > 0 ? (
                    filteredWaitlist.map((item, idx) => (
                      <tr
                        key={item.id || idx}
                        className="hover:bg-charcoal/[0.02] dark:hover:bg-cream/[0.02] transition-colors"
                      >
                        <td className="py-4 px-6 text-charcoal-muted dark:text-cream-dim">
                          {idx + 1}
                        </td>
                        <td className="py-4 px-6 font-semibold text-charcoal dark:text-cream">
                          {item.email}
                        </td>
                        <td className="py-4 px-6 text-charcoal-muted dark:text-cream-muted">
                          {item.name || '—'}
                        </td>
                        <td className="py-4 px-6 text-charcoal-muted dark:text-cream-muted">
                          {item.company || item.role ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-charcoal/[0.05] dark:bg-cream/[0.08]">
                              {item.company || ''} {item.role ? `· ${item.role}` : ''}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="py-4 px-6 text-charcoal dark:text-cream">
                          {item.metadata?.city || item.metadata?.country ? (
                            <div className="flex items-center gap-1.5">
                              <span>{getCountryFlag(item.metadata?.country_code)}</span>
                              <span>
                                {[item.metadata?.city, item.metadata?.country].filter(Boolean).join(', ')}
                              </span>
                            </div>
                          ) : (
                            <span className="text-charcoal-muted dark:text-cream-dim">—</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-charcoal-muted dark:text-cream-dim">
                          {formatDate(item.created_at)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleCopyEmail(item.email)}
                            className="p-1.5 rounded-lg hover:bg-charcoal/10 dark:hover:bg-cream/10 transition-colors text-charcoal dark:text-cream"
                            title="Copy email"
                          >
                            {copiedEmail === item.email ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-charcoal-muted dark:text-cream-dim">
                        {loading ? 'Loading waitlist...' : 'No waitlist applicants found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: VISITORS */}
        {/* ============================================================ */}
        {activeTab === 'visitors' && (
          <div className="rounded-3xl frosted-glass border border-charcoal/[0.08] dark:border-cream/[0.08] overflow-hidden">
            
            {/* Header & Controls */}
            <div className="p-4 sm:p-6 border-b border-charcoal/[0.08] dark:border-cream/[0.08] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              
              {/* Search Box */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted dark:text-cream-dim" />
                <input
                  type="text"
                  placeholder="Search visitors by city, OS, browser, or ID..."
                  value={visitorSearchQuery}
                  onChange={(e) => setVisitorSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full frosted-glass-pill text-xs font-mono text-charcoal dark:text-cream placeholder-charcoal-muted/60 dark:placeholder-cream-muted/60 focus:outline-none"
                />
              </div>

              {/* Country Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                <button
                  onClick={() => setSelectedCountryFilter('ALL')}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all shrink-0 ${
                    selectedCountryFilter === 'ALL'
                      ? 'bg-charcoal text-cream dark:bg-cream dark:text-charcoal font-semibold shadow-sm'
                      : 'bg-charcoal/[0.04] dark:bg-cream/[0.06] text-charcoal-muted dark:text-cream-dim hover:bg-charcoal/10 dark:hover:bg-cream/10'
                  }`}
                >
                  All ({visitors.length})
                </button>

                {countryBreakdown.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => setSelectedCountryFilter(item.code)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-mono transition-all shrink-0 ${
                      selectedCountryFilter === item.code
                        ? 'bg-charcoal text-cream dark:bg-cream dark:text-charcoal font-semibold shadow-sm'
                        : 'bg-charcoal/[0.04] dark:bg-cream/[0.06] text-charcoal-muted dark:text-cream-dim hover:bg-charcoal/10 dark:hover:bg-cream/10'
                    }`}
                  >
                    <span>{item.flag}</span>
                    <span>{item.code === 'UNKNOWN' ? 'Unknown' : item.name}</span>
                    <span className="opacity-60 text-[10px]">({item.count})</span>
                  </button>
                ))}
              </div>

            </div>

            {/* Visitors Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-charcoal/[0.08] dark:border-cream/[0.08] bg-charcoal/[0.02] dark:bg-cream/[0.02] text-charcoal-muted dark:text-cream-dim">
                    <th className="py-3.5 px-6 font-medium">Visitor ID</th>
                    <th className="py-3.5 px-6 font-medium">Location</th>
                    <th className="py-3.5 px-6 font-medium">Visits</th>
                    <th className="py-3.5 px-6 font-medium">Device</th>
                    <th className="py-3.5 px-6 font-medium">Browser</th>
                    <th className="py-3.5 px-6 font-medium">First Seen</th>
                    <th className="py-3.5 px-6 font-medium">Last Active</th>
                    <th className="py-3.5 px-6 font-medium">Last Page</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal/[0.06] dark:divide-cream/[0.06]">
                  {filteredVisitors.length > 0 ? (
                    filteredVisitors.map((visitor) => {
                      const flag = visitor.flag_emoji || getCountryFlag(visitor.country_code);
                      const hasLocation = Boolean(visitor.city || visitor.country);

                      return (
                        <tr
                          key={visitor.visitor_id}
                          className="hover:bg-charcoal/[0.02] dark:hover:bg-cream/[0.02] transition-colors"
                        >
                          {/* Visitor ID & Copy */}
                          <td className="py-4 px-6 font-semibold text-charcoal dark:text-cream">
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded bg-charcoal/5 dark:bg-cream/10 font-mono">
                                {visitor.visitor_id.slice(0, 10)}...
                              </span>
                              <button
                                onClick={() => handleCopyVisitorId(visitor.visitor_id)}
                                className="p-1 rounded hover:bg-charcoal/10 dark:hover:bg-cream/10 transition-colors text-charcoal-muted dark:text-cream-dim"
                                title="Copy ID"
                              >
                                {copiedVisitorId === visitor.visitor_id ? (
                                  <Check className="w-3 h-3 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Location */}
                          <td className="py-4 px-6">
                            {hasLocation ? (
                              <div className="flex items-start gap-2.5">
                                <span className="text-base leading-none mt-0.5" title={visitor.country || 'Location'}>
                                  {flag}
                                </span>
                                <div>
                                  <div className="font-semibold text-charcoal dark:text-cream flex items-center gap-1.5">
                                    <span>{visitor.city || visitor.country}</span>
                                    {visitor.country_code && (
                                      <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-charcoal/[0.06] dark:bg-cream/[0.1] text-charcoal-muted dark:text-cream-dim">
                                        {visitor.country_code}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-charcoal-muted dark:text-cream-dim">
                                    {[visitor.region && visitor.region.length > 2 ? visitor.region : null, visitor.country].filter(Boolean).join(', ')}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-charcoal/[0.04] dark:bg-cream/[0.06] text-charcoal-muted dark:text-cream-dim text-[11px]">
                                <Compass className="w-3 h-3 opacity-60" />
                                <span>Pending</span>
                              </div>
                            )}
                          </td>

                          {/* Total Visits Badge */}
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold ${
                                visitor.total_visits > 3
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                  : visitor.total_visits > 1
                                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                  : 'bg-charcoal/[0.05] dark:bg-cream/[0.08] text-charcoal-muted dark:text-cream-dim'
                              }`}
                            >
                              {visitor.total_visits} {visitor.total_visits === 1 ? 'visit' : 'visits'}
                            </span>
                          </td>

                          {/* Device & OS */}
                          <td className="py-4 px-6 text-charcoal dark:text-cream">
                            <div className="flex items-center gap-1.5">
                              {visitor.device_type === 'Mobile' ? (
                                <Smartphone className="w-3.5 h-3.5 text-charcoal-muted dark:text-cream-dim" />
                              ) : (
                                <Laptop className="w-3.5 h-3.5 text-charcoal-muted dark:text-cream-dim" />
                              )}
                              <span>{visitor.os || 'Unknown'}</span>
                            </div>
                          </td>

                          {/* Browser */}
                          <td className="py-4 px-6 text-charcoal-muted dark:text-cream-muted">
                            {visitor.browser || '—'}
                          </td>

                          {/* First Seen */}
                          <td className="py-4 px-6 text-charcoal-muted dark:text-cream-dim">
                            {formatDate(visitor.first_seen_at)}
                          </td>

                          {/* Last Active */}
                          <td className="py-4 px-6 text-charcoal dark:text-cream">
                            {formatDate(visitor.last_seen_at)}
                          </td>

                          {/* Last Route */}
                          <td className="py-4 px-6 text-charcoal-muted dark:text-cream-dim font-mono">
                            {visitor.last_path || '/'}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-charcoal-muted dark:text-cream-dim">
                        {loading ? 'Loading visitors...' : 'No visitors found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: LIVE ACTIVITY STREAM */}
        {/* ============================================================ */}
        {activeTab === 'feed' && (
          <div className="rounded-3xl frosted-glass border border-charcoal/[0.08] dark:border-cream/[0.08] overflow-hidden p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-base text-charcoal dark:text-cream">
                Recent Activity
              </h3>
              <div className="text-xs font-mono text-charcoal-muted dark:text-cream-dim flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Auto-refreshing</span>
              </div>
            </div>

            <div className="space-y-3">
              {pageViews.length > 0 ? (
                pageViews.map((pv, idx) => {
                  const flag = getCountryFlag(pv.country_code);
                  const hasGeo = Boolean(pv.city || pv.country);

                  return (
                    <div
                      key={pv.id || idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-charcoal/[0.02] dark:bg-cream/[0.02] border border-charcoal/[0.04] dark:border-cream/[0.04] text-xs font-mono gap-2 hover:bg-charcoal/[0.04] dark:hover:bg-cream/[0.04] transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                        <span className="font-semibold text-charcoal dark:text-cream">
                          {pv.path}
                        </span>
                        <span className="text-charcoal-muted dark:text-cream-dim">
                          via {pv.referrer || 'Direct'}
                        </span>

                        {/* Location Tag on Live Feed */}
                        {hasGeo && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-charcoal/[0.05] dark:bg-cream/[0.08] text-charcoal dark:text-cream text-[11px]">
                            <span>{flag}</span>
                            <span>{[pv.city, pv.country_code || pv.country].filter(Boolean).join(', ')}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-charcoal-muted dark:text-cream-dim text-[11px] shrink-0">
                        <span className="px-2 py-0.5 rounded bg-charcoal/5 dark:bg-cream/10">
                          {pv.visitor_id.slice(0, 8)}...
                        </span>
                        <span>{formatDate(pv.created_at)}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-charcoal-muted dark:text-cream-dim text-xs font-mono">
                  {loading ? 'Loading activity...' : 'No recent activity.'}
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

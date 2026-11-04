import { useCallback, useEffect, useMemo, useState } from 'react';
import { NavMark } from '../../site/brand/NavMark';
import { DeviceIcon } from './DeviceIcon';
import { getAdminData, type PageViewEntry, type VisitorEntry, type WaitlistEntry } from '../../lib/supabase';
import { getCountryFlag } from '../../lib/geo';

/** CWE-1236: neutralise spreadsheet formulas before a value lands in a CSV. */
export function sanitizeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '""';
  let str = String(value).trim();
  if (/^[=+\-@\t\r]/.test(str)) str = `'${str}`;
  return `"${str.replace(/"/g, '""')}"`;
}

function downloadCsv(name: string, headers: string[], rows: unknown[][]) {
  const csv = [headers.map(sanitizeCsvCell).join(','), ...rows.map((r) => r.map(sanitizeCsvCell).join(','))].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const when = (iso?: string) =>
  iso ? new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—';

function ago(iso?: string) {
  if (!iso) return '—';
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

const codeOf = (v: { country_code?: string | null; country?: string | null }) =>
  v.country_code?.toUpperCase() || (v.country ? v.country.slice(0, 2).toUpperCase() : 'UNKNOWN');

type Tab = 'waitlist' | 'visitors' | 'feed';

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (key: string, text: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(key);
      window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 1600);
    });
  };
  return { copied, copy };
}

/**
 * The admin console, in the site's own look: who asked for early access,
 * who visited and from where, and a live feed of page views. Data comes only
 * from /api/admin/data, which reads with the service-role key on the server.
 */
export function AdminDashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updated, setUpdated] = useState<Date | null>(null);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [visitors, setVisitors] = useState<VisitorEntry[]>([]);
  const [pageViews, setPageViews] = useState<PageViewEntry[]>([]);
  const [tab, setTab] = useState<Tab>('waitlist');
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('ALL');
  const { copied, copy } = useCopy();

  const load = useCallback(async () => {
    setRefreshing(true);
    const data = await getAdminData(token);
    if (data.unauthorized) {
      onLogout();
      return;
    }
    setError(data.error);
    if (!data.error || data.waitlist.length || data.visitors.length) {
      setWaitlist(data.waitlist);
      setVisitors(data.visitors);
      setPageViews(data.pageViews);
    }
    setUpdated(new Date());
    setLoading(false);
    setRefreshing(false);
  }, [token, onLogout]);

  useEffect(() => {
    load();
    const id = window.setInterval(load, 30000);
    return () => window.clearInterval(id);
  }, [load]);

  const countries = useMemo(() => {
    const map = new Map<string, { code: string; name: string; flag: string; count: number }>();
    visitors.forEach((v) => {
      const code = codeOf(v);
      const row = map.get(code) ?? { code, name: v.country || 'Unknown', flag: v.flag_emoji || getCountryFlag(code === 'UNKNOWN' ? null : code), count: 0 };
      row.count += 1;
      map.set(code, row);
    });
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [visitors]);

  const metrics = useMemo(() => {
    const unique = visitors.length;
    const returning = visitors.filter((v) => (v.total_visits || 1) > 1).length;
    const mac = visitors.filter((v) => (v.os || '').toLowerCase().includes('mac')).length;
    const today = new Date().toDateString();
    const joinedToday = waitlist.filter((w) => w.created_at && new Date(w.created_at).toDateString() === today).length;
    const known = countries.filter((c) => c.code !== 'UNKNOWN');
    return {
      waitlist: waitlist.length,
      joinedToday,
      unique,
      returnRate: unique ? Math.round((returning / unique) * 100) : 0,
      macRate: unique ? Math.round((mac / unique) * 100) : 0,
      conversion: unique ? ((waitlist.length / unique) * 100).toFixed(1) : '0.0',
      countries: known.length,
      top: known[0] ?? null,
    };
  }, [waitlist, visitors, countries]);

  const q = query.trim().toLowerCase();
  const shownWaitlist = useMemo(
    () =>
      !q
        ? waitlist
        : waitlist.filter((w) =>
            [w.email, w.name, w.company, w.role, w.use_case, w.metadata?.city, w.metadata?.country].some((f) => f?.toLowerCase().includes(q))
          ),
    [waitlist, q]
  );
  const shownVisitors = useMemo(
    () =>
      visitors.filter(
        (v) =>
          (country === 'ALL' || codeOf(v) === country) &&
          (!q || [v.visitor_id, v.city, v.country, v.region, v.os, v.browser, v.last_path, v.referrer].some((f) => f?.toLowerCase().includes(q)))
      ),
    [visitors, country, q]
  );
  const shownFeed = useMemo(
    () => (!q ? pageViews : pageViews.filter((p) => [p.path, p.city, p.country, p.referrer, p.visitor_id].some((f) => f?.toLowerCase().includes(q)))),
    [pageViews, q]
  );

  const exportCsv = () => {
    if (tab === 'waitlist') {
      downloadCsv(
        'meridius_waitlist',
        ['Email', 'Name', 'Company', 'Role', 'Use case', 'City', 'Country', 'Joined'],
        waitlist.map((w) => [w.email, w.name, w.company, w.role, w.use_case, w.metadata?.city, w.metadata?.country, w.created_at])
      );
    } else if (tab === 'visitors') {
      downloadCsv(
        'meridius_visitors',
        ['Visitor', 'Visits', 'City', 'Region', 'Country', 'Device', 'OS', 'Browser', 'Screen', 'First seen', 'Last seen', 'Last path', 'Referrer'],
        visitors.map((v) => [v.visitor_id, v.total_visits, v.city, v.region, v.country, v.device_type, v.os, v.browser, v.screen_res, v.first_seen_at, v.last_seen_at, v.last_path, v.referrer])
      );
    } else {
      downloadCsv(
        'meridius_page_views',
        ['Time', 'Path', 'Visitor', 'Session', 'City', 'Country', 'Referrer'],
        pageViews.map((p) => [p.created_at, p.path, p.visitor_id, p.session_id, p.city, p.country, p.referrer])
      );
    }
  };

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'waitlist', label: 'Waitlist', count: waitlist.length },
    { id: 'visitors', label: 'Visitors', count: visitors.length },
    { id: 'feed', label: 'Live feed', count: pageViews.length },
  ];

  return (
    <div className="a-root">
      <header className="a-nav">
        <div className="a-wrap a-nav__inner">
          <a href="/" className="a-brand">
            <NavMark size={26} tone="dark" />
            Meridius
            <span className="a-brand__tag">Admin</span>
          </a>
          <div className="a-nav__actions">
            <span className="a-updated">{updated ? `Updated ${updated.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : ''}</span>
            <button type="button" className="a-btn" onClick={load} disabled={refreshing} aria-label="Refresh">
              <svg viewBox="0 0 16 16" className={refreshing ? 'a-rotate' : undefined} aria-hidden="true">
                <path d="M13.5 8a5.5 5.5 0 1 1-1.7-4M13.5 2.5v3h-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Refresh
            </button>
            <button type="button" className="a-btn" onClick={onLogout}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="a-wrap a-main">
        <div className="a-head">
          <div>
            <h1>Overview</h1>
            <p>Early-access requests and site traffic. Refreshes every 30 seconds.</p>
          </div>
        </div>

        {error ? (
          <div className="a-alert" role="alert">
            <b>Couldn’t load everything.</b> {error}
          </div>
        ) : null}

        <section className="a-metrics" aria-label="Key numbers">
          <article className="a-metric a-metric--blue">
            <span>Waitlist</span>
            <b>{loading ? '—' : metrics.waitlist}</b>
            <small>{metrics.joinedToday ? `+${metrics.joinedToday} today` : 'No new sign-ups today'}</small>
          </article>
          <article className="a-metric">
            <span>Unique visitors</span>
            <b>{loading ? '—' : metrics.unique}</b>
            <small>{metrics.returnRate}% came back</small>
          </article>
          <article className="a-metric">
            <span>Visitor → waitlist</span>
            <b>{loading ? '—' : `${metrics.conversion}%`}</b>
            <small>{metrics.macRate}% on a Mac</small>
          </article>
          <article className="a-metric">
            <span>Countries</span>
            <b>{loading ? '—' : metrics.countries}</b>
            <small>{metrics.top ? `Most from ${metrics.top.flag} ${metrics.top.name}` : 'No location data yet'}</small>
          </article>
        </section>

        <section className="a-panel">
          <div className="a-toolbar">
            <div className="a-tabs" role="tablist" aria-label="Data">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => {
                    setTab(t.id);
                    setQuery('');
                  }}
                >
                  {t.label}
                  <span>{t.count}</span>
                </button>
              ))}
            </div>
            <div className="a-toolbar__right">
              <input className="a-search" type="search" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search" />
              {tab === 'waitlist' ? (
                <button type="button" className="a-btn" onClick={() => copy('all', waitlist.map((w) => w.email).join(', '))} disabled={!waitlist.length}>
                  {copied === 'all' ? 'Copied' : 'Copy emails'}
                </button>
              ) : null}
              <button type="button" className="a-btn a-btn--blue" onClick={exportCsv}>
                Export CSV
              </button>
            </div>
          </div>

          {tab === 'visitors' && countries.length > 1 ? (
            <div className="a-chips" role="group" aria-label="Filter by country">
              <button type="button" aria-pressed={country === 'ALL'} onClick={() => setCountry('ALL')}>
                All <span>{visitors.length}</span>
              </button>
              {countries.map((c) => (
                <button key={c.code} type="button" aria-pressed={country === c.code} onClick={() => setCountry(c.code)}>
                  {c.flag} {c.name} <span>{c.count}</span>
                </button>
              ))}
            </div>
          ) : null}

          <div className="a-table-wrap">
            {loading ? (
              <p className="a-empty">Loading…</p>
            ) : tab === 'waitlist' ? (
              shownWaitlist.length ? (
                <table className="a-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Name</th>
                      <th>Use case</th>
                      <th>Location</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shownWaitlist.map((w) => (
                      <tr key={w.id ?? w.email}>
                        <td>
                          <button type="button" className="a-copy" onClick={() => copy(w.email, w.email)} title="Copy email">
                            {w.email}
                            <em>{copied === w.email ? 'Copied' : 'Copy'}</em>
                          </button>
                        </td>
                        <td>{[w.name, w.company].filter(Boolean).join(' · ') || <span className="a-dim">—</span>}</td>
                        <td className="a-wrap-cell">{w.use_case || <span className="a-dim">—</span>}</td>
                        <td>
                          {w.metadata?.country ? `${getCountryFlag(w.metadata?.country_code)} ${[w.metadata?.city, w.metadata?.country].filter(Boolean).join(', ')}` : <span className="a-dim">—</span>}
                        </td>
                        <td className="a-nowrap">{when(w.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="a-empty">{q ? 'Nothing matches that search.' : 'No early-access requests yet.'}</p>
              )
            ) : tab === 'visitors' ? (
              shownVisitors.length ? (
                <table className="a-table">
                  <thead>
                    <tr>
                      <th>Device</th>
                      <th>Location</th>
                      <th>Visits</th>
                      <th>Last page</th>
                      <th>From</th>
                      <th>Last seen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shownVisitors.map((v) => (
                      <tr key={v.visitor_id}>
                        <td>
                          <span className="a-device">
                            <DeviceIcon os={v.os} deviceType={v.device_type} className="a-ico" />
                            <span>
                              {v.os || 'Unknown'} · {v.browser || '—'}
                              <small>{v.screen_res || ''}</small>
                            </span>
                          </span>
                        </td>
                        <td>
                          {v.flag_emoji || getCountryFlag(v.country_code)} {[v.city, v.country].filter(Boolean).join(', ') || <span className="a-dim">Unknown</span>}
                        </td>
                        <td>
                          <span className="a-count" data-many={(v.total_visits || 1) > 1 ? '' : undefined}>
                            {v.total_visits || 1}
                          </span>
                        </td>
                        <td>
                          <code>{v.last_path || '/'}</code>
                        </td>
                        <td className="a-wrap-cell">{v.referrer || 'Direct'}</td>
                        <td className="a-nowrap" title={when(v.last_seen_at)}>
                          {ago(v.last_seen_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="a-empty">{q || country !== 'ALL' ? 'No visitors match these filters.' : 'No visitors recorded yet.'}</p>
              )
            ) : shownFeed.length ? (
              <ol className="a-feed">
                {shownFeed.map((p, i) => (
                  <li key={p.id ?? `${p.visitor_id}-${p.created_at}-${i}`}>
                    <span className="a-feed__dot" />
                    <code>{p.path}</code>
                    <span className="a-feed__where">{[p.city, p.country].filter(Boolean).join(', ') || 'Unknown location'}</span>
                    <span className="a-dim a-feed__from">{p.referrer && p.referrer !== 'Direct' ? `from ${p.referrer}` : 'direct'}</span>
                    <time className="a-dim" title={when(p.created_at)}>
                      {ago(p.created_at)}
                    </time>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="a-empty">No page views yet.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

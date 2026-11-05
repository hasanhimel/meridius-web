import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { fetchVisitorGeo, GeoLocation } from './geo';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.trim();
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

/**
 * Public (anon) client. Null when the env vars are missing so the marketing
 * pages still render; waitlist and tracking calls then fail closed instead of
 * talking to a hardcoded project. RLS limits this key to INSERT on waitlist and
 * page_views plus the track_visit RPC; it cannot read any table.
 */
export const supabase: SupabaseClient | null =
  SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const NOT_CONFIGURED = 'Supabase is not configured (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).';

export interface WaitlistEntry {
  id?: string;
  email: string;
  name?: string;
  company?: string;
  role?: string;
  use_case?: string;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface VisitorEntry {
  visitor_id: string;
  total_visits: number;
  first_seen_at: string;
  last_seen_at: string;
  device_type?: string;
  browser?: string;
  os?: string;
  screen_res?: string;
  referrer?: string;
  last_path?: string;
  city?: string;
  country?: string;
  country_code?: string;
  region?: string;
  ip?: string;
  flag_emoji?: string;
}

export interface PageViewEntry {
  id?: number;
  visitor_id: string;
  path: string;
  referrer?: string;
  session_id?: string;
  created_at?: string;
  city?: string;
  country?: string;
  country_code?: string;
}

/**
 * Detect client OS, browser, and device
 */
function getDeviceDetails() {
  const ua = navigator.userAgent;
  let os = 'Unknown OS';
  let deviceType = 'Desktop';
  let browser = 'Unknown Browser';

  // OS detection
  if (/Macintosh|Mac OS X/i.test(ua)) os = 'macOS';
  else if (/Windows/i.test(ua)) os = 'Windows';
  else if (/iPhone|iPad|iPod/i.test(ua)) {
    os = 'iOS';
    deviceType = 'Mobile';
  } else if (/Android/i.test(ua)) {
    os = 'Android';
    deviceType = 'Mobile';
  } else if (/Linux/i.test(ua)) os = 'Linux';

  // Browser detection
  if (/Chrome|CriOS/i.test(ua) && !/Edg/i.test(ua)) browser = 'Chrome';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/Edg/i.test(ua)) browser = 'Edge';

  const screenRes = `${window.screen.width}x${window.screen.height}`;

  return { os, deviceType, browser, screenRes };
}

/**
 * Get or generate persistent unique visitor ID and session ID
 */
export function getVisitorId(): string {
  let visitorId = localStorage.getItem('meridius_visitor_id');
  if (!visitorId) {
    visitorId = 'v_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    localStorage.setItem('meridius_visitor_id', visitorId);
  }
  return visitorId;
}

export function getSessionId(): string {
  let sessionId = sessionStorage.getItem('meridius_session_id');
  if (!sessionId) {
    sessionId = 's_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    sessionStorage.setItem('meridius_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Record a visit and page view in Supabase with Geolocation
 */
/**
 * Visits that are not a person: local development (your own machine and the
 * test browser write to the same database), browsers driven by automation
 * (navigator.webdriver), known crawlers, and headless Chrome. Vercel loads
 * every new deployment in headless Chrome at 800x600 on Linux from AWS
 * us-west-1, which showed up as a pair of "San Jose" visitors per deploy;
 * no real visitor browses at that exact size on Linux.
 */
export function isNonHumanVisit(
  env: { hostname: string; userAgent: string; webdriver?: boolean; screenW: number; screenH: number } = {
    hostname: window.location.hostname,
    userAgent: navigator.userAgent,
    webdriver: navigator.webdriver,
    screenW: window.screen.width,
    screenH: window.screen.height,
  },
): boolean {
  const host = env.hostname;
  if (host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host.endsWith('.local') || host.endsWith('.localhost')) {
    return true;
  }
  if (env.webdriver) return true;
  if (/HeadlessChrome|bot\b|crawler|spider|slurp|Lighthouse|PageSpeed|vercel|screenshot|preview/i.test(env.userAgent)) {
    return true;
  }
  return /Linux/.test(env.userAgent) && !/Android/.test(env.userAgent) && env.screenW === 800 && env.screenH === 600;
}

export async function trackPageView(path = window.location.pathname) {
  if (isNonHumanVisit()) return;
  if (!supabase) {
    console.warn(`Telemetry disabled: ${NOT_CONFIGURED}`);
    return;
  }

  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const isNewSession = !sessionStorage.getItem('meridius_session_tracked');
    const { os, deviceType, browser, screenRes } = getDeviceDetails();
    const referrer = document.referrer || 'Direct';

    // Fetch visitor geolocation (city, country, region, flag)
    let geo: GeoLocation = {
      city: null,
      country: null,
      country_code: null,
      region: null,
      ip: null,
      flag_emoji: null,
    };

    try {
      geo = await fetchVisitorGeo();
    } catch (e) {
      console.warn('Geolocation capture deferred/unavailable:', e);
    }

    if (isNewSession) {
      sessionStorage.setItem('meridius_session_tracked', 'true');
    }

    // Upsert the visitor row server-side. The anon role has no SELECT/UPDATE on
    // `visitors`; the SECURITY DEFINER function only touches this visitor's row.
    const { error: visitError } = await supabase.rpc('track_visit', {
      p_visitor_id: visitorId,
      p_is_new_session: isNewSession,
      p_path: path,
      p_referrer: referrer,
      p_device_type: deviceType,
      p_browser: browser,
      p_os: os,
      p_screen_res: screenRes,
      p_city: geo.city || null,
      p_country: geo.country || null,
      p_country_code: geo.country_code || null,
      p_region: geo.region || null,
      p_ip: geo.ip || null,
      p_flag_emoji: geo.flag_emoji || null,
    });
    if (visitError) console.warn('Visitor tracking failed:', visitError.message);

    // Log the page view event (INSERT only; no RETURNING, so no SELECT needed)
    await supabase.from('page_views').insert({
      visitor_id: visitorId,
      path,
      referrer,
      session_id: sessionId,
      created_at: new Date().toISOString(),
      city: geo.city || null,
      country: geo.country || null,
      country_code: geo.country_code || null,
    });
  } catch (err) {
    console.error('Telemetry tracking error:', err);
  }
}

/**
 * Strict email validation helper (RFC 5322 compliant)
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length < 3 || trimmed.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

/**
 * String sanitizer to prevent XSS payloads and script tags
 */
export function sanitizeText(str?: string | null, maxLength = 100): string | null {
  if (!str || typeof str !== 'string') return null;
  const cleaned = str.replace(/[<>]/g, '').trim();
  return cleaned.length > 0 ? cleaned.slice(0, maxLength) : null;
}

/**
 * Add an email to the waitlist
 */
export async function joinWaitlist(entry: {
  email: string;
  name?: string;
  company?: string;
  role?: string;
  use_case?: string;
}): Promise<{ success: boolean; error?: string; alreadyJoined?: boolean }> {
  if (!supabase) {
    return { success: false, error: 'The waitlist is temporarily unavailable. Please try again later.' };
  }

  try {
    const rawEmail = entry.email ? entry.email.trim().toLowerCase() : '';
    if (!validateEmail(rawEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const visitorId = getVisitorId();
    let geo: GeoLocation | null = null;
    try {
      geo = await fetchVisitorGeo();
    } catch {}

    const { error } = await supabase
      .from('waitlist')
      .insert({
        email: rawEmail,
        name: sanitizeText(entry.name, 100),
        company: sanitizeText(entry.company, 100),
        role: sanitizeText(entry.role, 100),
        use_case: sanitizeText(entry.use_case, 500),
        metadata: {
          visitor_id: visitorId,
          user_agent: navigator.userAgent.slice(0, 250),
          timestamp: new Date().toISOString(),
          city: geo?.city || null,
          country: geo?.country || null,
          country_code: geo?.country_code || null,
          region: geo?.region || null,
        },
      });
    // No `.select()`: returning the row would need a SELECT policy on waitlist,
    // which the anon role deliberately does not have.

    if (error) {
      if (error.code === '23505') {
        // Unique violation (already registered)
        return { success: true, alreadyJoined: true };
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
}

export interface AdminData {
  waitlist: WaitlistEntry[];
  visitors: VisitorEntry[];
  pageViews: PageViewEntry[];
  error: string | null;
  /** True when the session token is missing, invalid or expired. */
  unauthorized: boolean;
}

function emptyAdminData(error: string, unauthorized = false): AdminData {
  return { waitlist: [], visitors: [], pageViews: [], error, unauthorized };
}

/**
 * Admin data comes only from the signed /api/admin/data endpoint, which reads
 * with the service-role key after verifying the HMAC session token. There is
 * deliberately no direct Supabase fallback: the anon key cannot read these
 * tables, and must never be able to.
 */
export async function getAdminData(token?: string | null): Promise<AdminData> {
  if (!token) return emptyAdminData('Not signed in', true);

  try {
    const res = await fetch('/api/admin/data', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (res.status === 401) return emptyAdminData('Session expired', true);

    const json = await res.json().catch(() => ({}));
    if (!res.ok) return emptyAdminData(json.error || `Admin API error (${res.status})`);

    return {
      waitlist: (json.waitlist || []) as WaitlistEntry[],
      visitors: (json.visitors || []) as VisitorEntry[],
      pageViews: (json.pageViews || []) as PageViewEntry[],
      error: json.error || null,
      unauthorized: false,
    };
  } catch {
    return emptyAdminData('Could not reach the admin API');
  }
}

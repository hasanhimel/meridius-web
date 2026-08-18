import { createClient } from '@supabase/supabase-js';
import { fetchVisitorGeo, GeoLocation } from './geo';

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://mthtrnwwauawbhldmshy.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10aHRybnd3YXVhd2JobGRtc2h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3ODg1MTUsImV4cCI6MjEwMjM2NDUxNX0.NPZVctN_4DyQWMK9hFzapiJ6YjhO5oRP3P3608OudW0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
export async function trackPageView(path = window.location.pathname) {
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

      // Check if visitor already exists in DB
      const { data: existingVisitor } = await supabase
        .from('visitors')
        .select('total_visits, city, country, country_code, region, ip, flag_emoji')
        .eq('visitor_id', visitorId)
        .single();

      if (existingVisitor) {
        // Increment visit count and update timestamp & location
        await supabase
          .from('visitors')
          .update({
            total_visits: (existingVisitor.total_visits || 1) + 1,
            last_seen_at: new Date().toISOString(),
            last_path: path,
            referrer,
            device_type: deviceType,
            browser,
            os,
            screen_res: screenRes,
            city: geo.city || existingVisitor.city || null,
            country: geo.country || existingVisitor.country || null,
            country_code: geo.country_code || existingVisitor.country_code || null,
            region: geo.region || existingVisitor.region || null,
            ip: geo.ip || existingVisitor.ip || null,
            flag_emoji: geo.flag_emoji || existingVisitor.flag_emoji || null,
          })
          .eq('visitor_id', visitorId);
      } else {
        // Insert new unique visitor
        await supabase.from('visitors').insert({
          visitor_id: visitorId,
          total_visits: 1,
          first_seen_at: new Date().toISOString(),
          last_seen_at: new Date().toISOString(),
          device_type: deviceType,
          browser,
          os,
          screen_res: screenRes,
          referrer,
          last_path: path,
          city: geo.city || null,
          country: geo.country || null,
          country_code: geo.country_code || null,
          region: geo.region || null,
          ip: geo.ip || null,
          flag_emoji: geo.flag_emoji || null,
        });
      }
    } else {
      // Just update last seen and path (and backfill geo if missing)
      const updatePayload: Record<string, any> = {
        last_seen_at: new Date().toISOString(),
        last_path: path,
      };

      if (geo.city || geo.country) {
        if (geo.city) updatePayload.city = geo.city;
        if (geo.country) updatePayload.country = geo.country;
        if (geo.country_code) updatePayload.country_code = geo.country_code;
        if (geo.region) updatePayload.region = geo.region;
        if (geo.flag_emoji) updatePayload.flag_emoji = geo.flag_emoji;
        if (geo.ip) updatePayload.ip = geo.ip;
      }

      await supabase
        .from('visitors')
        .update(updatePayload)
        .eq('visitor_id', visitorId);
    }

    // Log the page view event
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
 * Add an email to the waitlist
 */
export async function joinWaitlist(entry: {
  email: string;
  name?: string;
  company?: string;
  role?: string;
  use_case?: string;
}): Promise<{ success: boolean; error?: string; alreadyJoined?: boolean }> {
  try {
    const visitorId = getVisitorId();
    let geo: GeoLocation | null = null;
    try {
      geo = await fetchVisitorGeo();
    } catch {}

    const { error } = await supabase
      .from('waitlist')
      .insert({
        email: entry.email.trim().toLowerCase(),
        name: entry.name?.trim() || null,
        company: entry.company?.trim() || null,
        role: entry.role?.trim() || null,
        use_case: entry.use_case?.trim() || null,
        metadata: {
          visitor_id: visitorId,
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          city: geo?.city || null,
          country: geo?.country || null,
          country_code: geo?.country_code || null,
          region: geo?.region || null,
        },
      })
      .select();

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

/**
 * Admin helpers: fetch waitlist, visitors, and analytics
 */
export async function getAdminData() {
  const [waitlistRes, visitorsRes, pageViewsRes] = await Promise.all([
    supabase.from('waitlist').select('*').order('created_at', { ascending: false }),
    supabase.from('visitors').select('*').order('last_seen_at', { ascending: false }),
    supabase.from('page_views').select('*').order('created_at', { ascending: false }).limit(200),
  ]);

  return {
    waitlist: (waitlistRes.data || []) as WaitlistEntry[],
    visitors: (visitorsRes.data || []) as VisitorEntry[],
    pageViews: (pageViewsRes.data || []) as PageViewEntry[],
    error: waitlistRes.error || visitorsRes.error || pageViewsRes.error,
  };
}

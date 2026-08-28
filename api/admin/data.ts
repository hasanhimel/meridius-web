import type { IncomingMessage, ServerResponse } from 'http';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminToken } from './auth';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://mthtrnwwauawbhldmshy.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10aHRybnd3YXVhd2JobGRtc2h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3ODg1MTUsImV4cCI6MjEwMjM2NDUxNX0.NPZVctN_4DyQWMK9hFzapiJ6YjhO5oRP3P3608OudW0';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(
  req: IncomingMessage & { headers: Record<string, string | string[] | undefined> },
  res: ServerResponse
) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  // Check authorization header
  const authHeader = req.headers['authorization'];
  const token = Array.isArray(authHeader) ? authHeader[0] : authHeader;
  const bearerToken = token?.startsWith('Bearer ') ? token.slice(7) : null;

  const expectedPassword = process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD || 'meridius2026!';
  const secretKey = process.env.SESSION_SECRET || expectedPassword + '_secret_salt_2026';

  if (!bearerToken || !verifyAdminToken(bearerToken, secretKey)) {
    res.statusCode = 401;
    res.end(JSON.stringify({ error: 'Unauthorized: Invalid or expired admin session token' }));
    return;
  }

  try {
    const [waitlistRes, visitorsRes, pageViewsRes] = await Promise.all([
      supabaseAdmin.from('waitlist').select('*').order('created_at', { ascending: false }),
      supabaseAdmin.from('visitors').select('*').order('last_seen_at', { ascending: false }),
      supabaseAdmin.from('page_views').select('*').order('created_at', { ascending: false }).limit(200),
    ]);

    res.statusCode = 200;
    res.end(
      JSON.stringify({
        waitlist: waitlistRes.data || [],
        visitors: visitorsRes.data || [],
        pageViews: pageViewsRes.data || [],
        error: waitlistRes.error?.message || visitorsRes.error?.message || pageViewsRes.error?.message || null,
      })
    );
  } catch (err: any) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err.message || 'Failed to fetch admin data' }));
  }
}

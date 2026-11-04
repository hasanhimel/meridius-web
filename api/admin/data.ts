import type { IncomingMessage, ServerResponse } from 'http';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { verifyAdminToken } from './auth';
import { getAdminDataConfig } from './_config';

// Cached per serverless instance, keyed by URL + key so a config change is picked up.
let cachedClient: { cacheKey: string; client: SupabaseClient } | null = null;

function getServiceClient(url: string, serviceRoleKey: string): SupabaseClient {
  const cacheKey = `${url}\n${serviceRoleKey}`;
  if (!cachedClient || cachedClient.cacheKey !== cacheKey) {
    cachedClient = {
      cacheKey,
      client: createClient(url, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      }),
    };
  }
  return cachedClient.client;
}

export default async function handler(
  req: IncomingMessage & { headers: Record<string, string | string[] | undefined> },
  res: ServerResponse
) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');

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

  // Fail closed: no default password, derived secret or anon-key fallback.
  const config = getAdminDataConfig();
  if (!config) {
    res.statusCode = 503;
    res.end(JSON.stringify({ error: 'Supabase is not connected on the server: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY' }));
    return;
  }

  const authHeader = req.headers['authorization'];
  const token = Array.isArray(authHeader) ? authHeader[0] : authHeader;
  const bearerToken = token?.startsWith('Bearer ') ? token.slice(7) : null;

  if (!bearerToken || !verifyAdminToken(bearerToken, config.sessionSecret)) {
    res.statusCode = 401;
    res.end(JSON.stringify({ error: 'Unauthorized: Invalid or expired admin session token' }));
    return;
  }

  try {
    const supabaseAdmin = getServiceClient(config.supabaseUrl, config.supabaseServiceRoleKey);
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
  } catch {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Failed to fetch admin data' }));
  }
}

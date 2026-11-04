// Server-only admin configuration. Files prefixed with `_` are not exposed as
// Vercel routes. Every value here is required: when one is missing the admin
// endpoints refuse to run (fail closed) instead of falling back to a default.

export const MIN_SESSION_SECRET_LENGTH = 32;

export interface AdminAuthConfig {
  adminPassword: string;
  sessionSecret: string;
}

export interface AdminDataConfig extends AdminAuthConfig {
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
}

type Env = Record<string, string | undefined>;

function read(env: Env, key: string): string | null {
  const value = env[key]?.trim();
  return value ? value : null;
}

/**
 * Returns the admin auth config, or null if it is missing or unsafe.
 * The session secret must be independent of the password and long enough to
 * resist offline brute force of captured tokens.
 */
export function getAdminAuthConfig(env: Env = process.env): AdminAuthConfig | null {
  const adminPassword = read(env, 'ADMIN_PASSWORD');
  const sessionSecret = read(env, 'SESSION_SECRET');

  if (!adminPassword || !sessionSecret) return null;
  if (sessionSecret.length < MIN_SESSION_SECRET_LENGTH) return null;
  if (sessionSecret.includes(adminPassword)) return null;

  return { adminPassword, sessionSecret };
}

/**
 * Returns the config needed to read admin data, or null if anything is missing.
 * Admin reads use the service-role key because RLS gives the anon role no
 * SELECT access to waitlist, visitors or page_views.
 */
export function getAdminDataConfig(env: Env = process.env): AdminDataConfig | null {
  const auth = getAdminAuthConfig(env);
  const supabaseUrl = read(env, 'SUPABASE_URL') ?? read(env, 'VITE_SUPABASE_URL');
  const supabaseServiceRoleKey = read(env, 'SUPABASE_SERVICE_ROLE_KEY');

  if (!auth || !supabaseUrl || !supabaseServiceRoleKey) return null;

  return { ...auth, supabaseUrl, supabaseServiceRoleKey };
}

/**
 * Names (never values) of the settings that keep the admin from running, for
 * the server log. Empty when everything is in place.
 */
export function describeAdminConfigProblems(env: Env = process.env): string[] {
  const problems: string[] = [];
  const adminPassword = read(env, 'ADMIN_PASSWORD');
  const sessionSecret = read(env, 'SESSION_SECRET');
  if (!adminPassword) problems.push('ADMIN_PASSWORD is missing');
  if (!sessionSecret) problems.push('SESSION_SECRET is missing');
  else {
    if (sessionSecret.length < MIN_SESSION_SECRET_LENGTH) problems.push(`SESSION_SECRET is shorter than ${MIN_SESSION_SECRET_LENGTH} characters`);
    if (adminPassword && sessionSecret.includes(adminPassword)) problems.push('SESSION_SECRET contains ADMIN_PASSWORD');
  }
  if (!read(env, 'SUPABASE_URL') && !read(env, 'VITE_SUPABASE_URL')) problems.push('SUPABASE_URL is missing');
  if (!read(env, 'SUPABASE_SERVICE_ROLE_KEY')) problems.push('SUPABASE_SERVICE_ROLE_KEY is missing');
  return problems;
}

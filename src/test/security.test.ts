import { describe, it, expect, vi, afterEach } from 'vitest';
import { Readable } from 'stream';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import type { IncomingMessage, ServerResponse } from 'http';
import { validateEmail, sanitizeText, getAdminData, supabase } from '../lib/supabase';
import { getCountryFlag, getCountryName } from '../lib/geo';
import authHandler, { createAdminToken, verifyAdminToken } from '../../api/admin/auth';
import dataHandler from '../../api/admin/data';
import { getAdminAuthConfig, getAdminDataConfig } from '../../api/admin/_config';

// Formula injection sanitizer replicate for unit test
function sanitizeCsvCell(value: any): string {
  if (value === null || value === undefined) return '""';
  let str = String(value).trim();
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  str = str.replace(/"/g, '""');
  return `"${str}"`;
}

describe('Security & Input Validation Suite', () => {
  describe('Email RFC Validation (validateEmail)', () => {
    it('accepts legitimate standard and corporate emails', () => {
      expect(validateEmail('founder@meridiusai.com')).toBe(true);
      expect(validateEmail('john.doe@company.co.uk')).toBe(true);
      expect(validateEmail('sarah+tag@sub.domain.org')).toBe(true);
      expect(validateEmail('user_name123@domain.io')).toBe(true);
    });

    it('rejects invalid or malformed email formats', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('   ')).toBe(false);
      expect(validateEmail('plainaddress')).toBe(false);
      expect(validateEmail('@missinguser.com')).toBe(false);
      expect(validateEmail('missingdomain@.com')).toBe(false);
      expect(validateEmail('user@domain')).toBe(false);
      expect(validateEmail('user space@domain.com')).toBe(false);
    });

    it('rejects malicious injection attempts in email field', () => {
      expect(validateEmail('<script>alert(1)</script>@domain.com')).toBe(false);
      expect(validateEmail('user@domain.com<script>')).toBe(false);
      expect(validateEmail('user@domain.com; DROP TABLE waitlist;')).toBe(false);
    });

    it('rejects emails exceeding RFC max length of 254 characters', () => {
      const longUser = 'a'.repeat(245) + '@domain.com';
      expect(validateEmail(longUser)).toBe(false);
    });
  });

  describe('XSS Text Sanitization (sanitizeText)', () => {
    it('strips dangerous HTML tag brackets and scripts', () => {
      expect(sanitizeText('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
      expect(sanitizeText('<img src=x onerror=alert(1)>')).toBe('img src=x onerror=alert(1)');
      expect(sanitizeText('<b>Bold Name</b>')).toBe('bBold Name/b');
    });

    it('preserves clean legitimate business names and punctuation', () => {
      expect(sanitizeText('Acme Corp, Inc.')).toBe('Acme Corp, Inc.');
      expect(sanitizeText("O'Connor & Sons")).toBe("O'Connor & Sons");
      expect(sanitizeText('AI / ML Engineer')).toBe('AI / ML Engineer');
    });

    it('enforces maximum character length boundaries', () => {
      const giantString = 'A'.repeat(500);
      const sanitized = sanitizeText(giantString, 100);
      expect(sanitized?.length).toBe(100);
    });
  });

  describe('CWE-1236 CSV Formula Injection Defense (sanitizeCsvCell)', () => {
    it('neutralizes executable formula prefixes (=, +, -, @, tab)', () => {
      expect(sanitizeCsvCell('=cmd|\'/C calc\'!A0')).toBe("\"'=cmd|'/C calc'!A0\"");
      expect(sanitizeCsvCell('+12345678')).toBe("\"'+12345678\"");
      expect(sanitizeCsvCell('-SUM(1+1)')).toBe("\"'-SUM(1+1)\"");
      expect(sanitizeCsvCell('@SUM(A1:A10)')).toBe("\"'@SUM(A1:A10)\"");
    });

    it('properly escapes internal double quotes in CSV fields', () => {
      expect(sanitizeCsvCell('Acme "Tech" Solutions')).toBe('"Acme ""Tech"" Solutions"');
    });

    it('handles null, undefined, and safe standard values', () => {
      expect(sanitizeCsvCell(null)).toBe('""');
      expect(sanitizeCsvCell(undefined)).toBe('""');
      expect(sanitizeCsvCell('John Doe')).toBe('"John Doe"');
    });
  });

  describe('Cryptographic Admin Token (HMAC-SHA256)', () => {
    const testSecret = 'meridius_test_secret_key_2026';

    it('generates verifiable tokens with valid signature', () => {
      const token = createAdminToken(testSecret);
      expect(typeof token).toBe('string');
      expect(token).toContain('.');

      const isValid = verifyAdminToken(token, testSecret);
      expect(isValid).toBe(true);
    });

    it('rejects tokens signed with wrong secret key', () => {
      const token = createAdminToken(testSecret);
      const isValid = verifyAdminToken(token, 'wrong_secret_key');
      expect(isValid).toBe(false);
    });

    it('rejects forged or tampered token payloads', () => {
      const token = createAdminToken(testSecret);
      const [, sig] = token.split('.');
      const tamperedPayload = Buffer.from(JSON.stringify({ role: 'admin', expiresAt: Date.now() + 9999999 })).toString('base64url');
      const tamperedToken = `${tamperedPayload}.${sig}`;

      expect(verifyAdminToken(tamperedToken, testSecret)).toBe(false);
    });
  });

  describe('Geolocation and Flag Safety', () => {
    it('resolves valid 2-letter country codes to Unicode flag emoji', () => {
      expect(getCountryFlag('US')).toBe('🇺🇸');
      expect(getCountryFlag('GB')).toBe('🇬🇧');
      expect(getCountryFlag('BD')).toBe('🇧🇩');
      expect(getCountryFlag('DE')).toBe('🇩🇪');
      expect(getCountryFlag('JP')).toBe('🇯🇵');
    });

    it('returns default globe for null, empty, or invalid country codes', () => {
      expect(getCountryFlag(null)).toBe('🌐');
      expect(getCountryFlag('')).toBe('🌐');
      expect(getCountryFlag('INVALID')).toBe('🌐');
    });

    it('resolves ISO region to standard English country name', () => {
      expect(getCountryName('US')).toBe('United States');
      expect(getCountryName('GB')).toBe('United Kingdom');
      expect(getCountryName('JP')).toBe('Japan');
    });
  });
});

// ---------------------------------------------------------------------------
// Fail-closed admin configuration
// ---------------------------------------------------------------------------

const STRONG_SECRET = 'x'.repeat(48);
const ADMIN_ENV_KEYS = [
  'ADMIN_PASSWORD',
  'VITE_ADMIN_PASSWORD',
  'SESSION_SECRET',
  'SUPABASE_URL',
  'VITE_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_ANON_KEY',
  'VITE_SUPABASE_ANON_KEY',
] as const;

function setAdminEnv(values: Partial<Record<(typeof ADMIN_ENV_KEYS)[number], string>>) {
  for (const key of ADMIN_ENV_KEYS) vi.stubEnv(key, values[key] ?? '');
}

let ipCounter = 0;
function mockRequest(opts: { method: string; body?: unknown; headers?: Record<string, string> }) {
  const req = Readable.from(opts.body === undefined ? [] : [JSON.stringify(opts.body)]) as unknown as IncomingMessage & {
    headers: Record<string, string | string[] | undefined>;
  };
  req.method = opts.method;
  // Unique IP per request so the in-memory login rate limiter never interferes.
  req.headers = { 'x-forwarded-for': `10.0.${Math.floor(ipCounter / 250)}.${ipCounter++ % 250}`, ...opts.headers };
  return req;
}

function mockResponse() {
  const res = {
    statusCode: 200,
    headers: {} as Record<string, string>,
    body: '',
    setHeader(name: string, value: string) {
      this.headers[name.toLowerCase()] = value;
    },
    end(chunk?: string) {
      this.body = chunk ?? '';
    },
  };
  return res as typeof res & ServerResponse;
}

function json(res: { body: string }) {
  return JSON.parse(res.body || '{}');
}

describe('Admin config fails closed', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('returns null when ADMIN_PASSWORD or SESSION_SECRET is missing', () => {
    expect(getAdminAuthConfig({})).toBeNull();
    expect(getAdminAuthConfig({ ADMIN_PASSWORD: 'correct horse battery' })).toBeNull();
    expect(getAdminAuthConfig({ SESSION_SECRET: STRONG_SECRET })).toBeNull();
    expect(getAdminAuthConfig({ ADMIN_PASSWORD: '   ', SESSION_SECRET: STRONG_SECRET })).toBeNull();
  });

  it('ignores the client-exposed VITE_ADMIN_PASSWORD', () => {
    expect(getAdminAuthConfig({ VITE_ADMIN_PASSWORD: 'leaked', SESSION_SECRET: STRONG_SECRET })).toBeNull();
  });

  it('rejects a short SESSION_SECRET or one derived from the password', () => {
    expect(getAdminAuthConfig({ ADMIN_PASSWORD: 'pw-123456', SESSION_SECRET: 'short' })).toBeNull();
    expect(
      getAdminAuthConfig({ ADMIN_PASSWORD: 'pw-123456', SESSION_SECRET: 'pw-123456_secret_salt_2026_padding_padding' })
    ).toBeNull();
  });

  it('accepts a complete, independent configuration', () => {
    expect(getAdminAuthConfig({ ADMIN_PASSWORD: 'pw-123456', SESSION_SECRET: STRONG_SECRET })).toEqual({
      adminPassword: 'pw-123456',
      sessionSecret: STRONG_SECRET,
    });
  });

  it('requires the service-role key for admin data and never falls back to an anon key', () => {
    const base = { ADMIN_PASSWORD: 'pw-123456', SESSION_SECRET: STRONG_SECRET, SUPABASE_URL: 'https://example.supabase.co' };
    expect(getAdminDataConfig({ ...base, SUPABASE_ANON_KEY: 'anon', VITE_SUPABASE_ANON_KEY: 'anon' })).toBeNull();
    expect(getAdminDataConfig({ ...base, SUPABASE_URL: '', SUPABASE_SERVICE_ROLE_KEY: 'service' })).toBeNull();
    expect(getAdminDataConfig({ ...base, SUPABASE_SERVICE_ROLE_KEY: 'service' })?.supabaseServiceRoleKey).toBe('service');
  });
});

describe('POST /api/admin/auth', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('returns 503 and no token when env is missing, even for the old default password', async () => {
    setAdminEnv({});
    const res = mockResponse();
    await authHandler(mockRequest({ method: 'POST', body: { password: 'meridius' + '2026!' } }), res);
    expect(res.statusCode).toBe(503);
    expect(json(res).token).toBeUndefined();
  });

  it('returns 503 when SESSION_SECRET is missing, even with the right password', async () => {
    setAdminEnv({ ADMIN_PASSWORD: 'pw-123456' });
    const res = mockResponse();
    await authHandler(mockRequest({ method: 'POST', body: { password: 'pw-123456' } }), res);
    expect(res.statusCode).toBe(503);
    expect(json(res).token).toBeUndefined();
  });

  it('rejects a wrong password with 401', async () => {
    setAdminEnv({ ADMIN_PASSWORD: 'pw-123456', SESSION_SECRET: STRONG_SECRET });
    const res = mockResponse();
    await authHandler(mockRequest({ method: 'POST', body: { password: 'pw-12345' } }), res);
    expect(res.statusCode).toBe(401);
    expect(json(res).token).toBeUndefined();
  });

  it('issues a token signed with SESSION_SECRET for the right password', async () => {
    setAdminEnv({ ADMIN_PASSWORD: 'pw-123456', SESSION_SECRET: STRONG_SECRET });
    const res = mockResponse();
    await authHandler(mockRequest({ method: 'POST', body: { password: 'pw-123456' } }), res);
    expect(res.statusCode).toBe(200);
    const { token } = json(res);
    expect(verifyAdminToken(token, STRONG_SECRET)).toBe(true);
    // The old password-derived secret must not validate it.
    expect(verifyAdminToken(token, 'pw-123456_secret_salt_2026')).toBe(false);
  });
});

describe('GET /api/admin/data', () => {
  afterEach(() => vi.unstubAllEnvs());

  const configured = {
    ADMIN_PASSWORD: 'pw-123456',
    SESSION_SECRET: STRONG_SECRET,
    SUPABASE_URL: 'https://example.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'service-role-key',
  };

  it('returns 503 without the service-role key, even with a valid token and an anon key', async () => {
    setAdminEnv({ ...configured, SUPABASE_SERVICE_ROLE_KEY: '', SUPABASE_ANON_KEY: 'anon', VITE_SUPABASE_ANON_KEY: 'anon' });
    const res = mockResponse();
    const token = createAdminToken(STRONG_SECRET);
    await dataHandler(mockRequest({ method: 'GET', headers: { authorization: `Bearer ${token}` } }), res);
    expect(res.statusCode).toBe(503);
    expect(json(res).waitlist).toBeUndefined();
  });

  it('returns 503 when SESSION_SECRET is missing', async () => {
    setAdminEnv({ ...configured, SESSION_SECRET: '' });
    const res = mockResponse();
    const token = createAdminToken('meridius' + '2026!' + '_secret_salt_2026');
    await dataHandler(mockRequest({ method: 'GET', headers: { authorization: `Bearer ${token}` } }), res);
    expect(res.statusCode).toBe(503);
  });

  it('returns 401 for a missing or wrongly signed token', async () => {
    setAdminEnv(configured);
    const missing = mockResponse();
    await dataHandler(mockRequest({ method: 'GET' }), missing);
    expect(missing.statusCode).toBe(401);

    const forged = mockResponse();
    const token = createAdminToken('meridius' + '2026!' + '_secret_salt_2026');
    await dataHandler(mockRequest({ method: 'GET', headers: { authorization: `Bearer ${token}` } }), forged);
    expect(forged.statusCode).toBe(401);
  });
});

describe('getAdminData uses only the signed endpoint', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('does not touch the network or Supabase without a token', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const data = await getAdminData(null);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(data).toMatchObject({ unauthorized: true, waitlist: [], visitors: [], pageViews: [] });
  });

  it('reports unauthorized on 401 instead of falling back to a direct query', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 401 }));
    vi.stubGlobal('fetch', fetchMock);
    const data = await getAdminData('bad-token');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe('/api/admin/data');
    expect(data).toMatchObject({ unauthorized: true, waitlist: [] });
  });

  it('returns empty data on server or network failure instead of falling back', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"error":"Admin console is not configured"}', { status: 503 })));
    expect(await getAdminData('t')).toMatchObject({ unauthorized: false, waitlist: [], error: 'Admin console is not configured' });

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('network')));
    expect(await getAdminData('t')).toMatchObject({ unauthorized: false, waitlist: [] });
  });

  it('passes the bearer token and returns endpoint data', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ waitlist: [{ email: 'a@b.co' }], visitors: [], pageViews: [] }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const data = await getAdminData('good-token');
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer good-token');
    expect(data.waitlist).toEqual([{ email: 'a@b.co' }]);
    expect(data.unauthorized).toBe(false);
  });

  it('leaves the public Supabase client unset when its env vars are missing', () => {
    // Test env has no VITE_SUPABASE_*; there must be no hardcoded project to fall back to.
    expect(supabase).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// No secrets in source
// ---------------------------------------------------------------------------

const REPO_ROOT = join(__dirname, '..', '..');

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return /\.(ts|tsx|js|jsx)$/.test(name) && !full.includes(`${'test'}/`) ? [full] : [];
  });
}

describe('Source contains no secret literals', () => {
  const files = [...sourceFiles(join(REPO_ROOT, 'src')), ...sourceFiles(join(REPO_ROOT, 'api'))];
  const jwtPattern = /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/;
  const supabaseProjectUrl = /https:\/\/[a-z0-9]{20}\.supabase\.co/;
  const oldPassword = 'meridius' + '2026!';

  it('scans a non-trivial set of files', () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it.each(files.map((f) => [relative(REPO_ROOT, f), f]))('%s has no JWTs, project URLs or default passwords', (_, file) => {
    const text = readFileSync(file, 'utf8');
    expect(text).not.toMatch(jwtPattern);
    expect(text).not.toMatch(supabaseProjectUrl);
    expect(text.includes(oldPassword)).toBe(false);
    expect(text).not.toMatch(/_secret_salt_/);
  });

  it('has no client-side admin password check', () => {
    const layout = readFileSync(join(REPO_ROOT, 'src/components/admin/AdminLayout.tsx'), 'utf8');
    expect(layout).not.toMatch(/VITE_ADMIN_PASSWORD/);
    expect(layout).not.toMatch(/password\s*===/);
    const clientFiles = sourceFiles(join(REPO_ROOT, 'src'));
    for (const f of clientFiles) {
      expect(readFileSync(f, 'utf8'), relative(REPO_ROOT, f)).not.toMatch(/VITE_ADMIN_PASSWORD|SERVICE_ROLE/);
    }
  });
});

describe('Vercel functions load as native ES modules', () => {
  // package.json is "type": "module", so Node resolves api/* imports strictly:
  // a relative import without its .js extension crashes the function at boot.
  const apiFiles = sourceFiles(join(REPO_ROOT, 'api'));
  it.each(apiFiles.map((f) => [relative(REPO_ROOT, f), f]))('%s uses explicit .js extensions on relative imports', (_, file) => {
    const text = readFileSync(file, 'utf8');
    const relativeImports = [...text.matchAll(/from\s+['"](\.{1,2}\/[^'"]+)['"]/g)].map((m) => m[1]);
    for (const spec of relativeImports) expect(spec, spec).toMatch(/\.js$/);
  });
});

describe('withClockRetry', () => {
  it('retries a query that Supabase rejects for clock skew, then returns the good result', async () => {
    const { withClockRetry } = await import('../../api/admin/data');
    const skew = { data: null, error: { code: 'PGRST303', message: 'JWT issued at future' } };
    const ok = { data: [1, 2], error: null };
    const run = vi.fn().mockResolvedValueOnce(skew).mockResolvedValueOnce(ok);
    expect(await withClockRetry(run, 3, 1)).toBe(ok);
    expect(run).toHaveBeenCalledTimes(2);
  });

  it('does not retry other errors', async () => {
    const { withClockRetry } = await import('../../api/admin/data');
    const denied = { data: null, error: { code: '42501', message: 'permission denied' } };
    const run = vi.fn().mockResolvedValue(denied);
    expect(await withClockRetry(run, 3, 1)).toBe(denied);
    expect(run).toHaveBeenCalledTimes(1);
  });
});

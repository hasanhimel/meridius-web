import type { IncomingMessage, ServerResponse } from 'http';
import crypto from 'crypto';
import { getAdminAuthConfig } from './_config.js';

// In-memory rate limiting map for brute-force protection (per serverless instance)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: IncomingMessage & { headers: Record<string, string | string[] | undefined> }): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return raw.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 60000 }); // 1 minute window
    return true;
  }

  if (entry.count >= 5) {
    return false; // Exceeded 5 attempts per minute
  }

  entry.count += 1;
  return true;
}

export function createAdminToken(secretKey: string): string {
  const payload = JSON.stringify({
    role: 'admin',
    issuedAt: Date.now(),
    expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
  });
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(payload);
  const signature = hmac.digest('hex');
  const encodedPayload = Buffer.from(payload).toString('base64url');
  return `${encodedPayload}.${signature}`;
}

export function verifyAdminToken(token: string, secretKey: string): boolean {
  try {
    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) return false;

    const payloadStr = Buffer.from(encodedPayload, 'base64url').toString('utf8');
    const payload = JSON.parse(payloadStr);

    if (payload.role !== 'admin' || typeof payload.expiresAt !== 'number' || Date.now() > payload.expiresAt) {
      return false;
    }

    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(payloadStr);
    const expectedSignature = hmac.digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch {
    return false;
  }
}

export default async function handler(
  req: IncomingMessage & { headers: Record<string, string | string[] | undefined> },
  res: ServerResponse
) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  // Fail closed: never authenticate against a default password or derived secret.
  const config = getAdminAuthConfig();
  if (!config) {
    res.statusCode = 503;
    res.end(JSON.stringify({ error: 'Admin console is not configured' }));
    return;
  }

  const clientIp = getClientIp(req);
  if (!checkRateLimit(clientIp)) {
    res.statusCode = 429;
    res.end(JSON.stringify({ error: 'Too many login attempts. Please try again in 1 minute.' }));
    return;
  }

  // Parse request body
  let body = '';
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 1024) {
      res.statusCode = 413;
      res.end(JSON.stringify({ error: 'Payload too large' }));
      return;
    }
  }

  try {
    const { password } = JSON.parse(body || '{}');
    if (!password || typeof password !== 'string') {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Password is required' }));
      return;
    }

    const { adminPassword: expectedPassword, sessionSecret: secretKey } = config;

    // Constant-time comparison of fixed-length digests, so neither the content
    // nor the length of the expected password leaks through timing.
    const digest = (value: string) => crypto.createHash('sha256').update(value, 'utf8').digest();
    const match = crypto.timingSafeEqual(digest(password), digest(expectedPassword));

    if (!match) {
      // Artificial delay to mitigate brute force timing
      await new Promise((r) => setTimeout(r, 400));
      res.statusCode = 401;
      res.end(JSON.stringify({ error: 'Invalid password' }));
      return;
    }

    // Generate signed session token
    const token = createAdminToken(secretKey);

    res.statusCode = 200;
    res.end(
      JSON.stringify({
        success: true,
        token,
        expiresIn: 86400,
      })
    );
  } catch {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
}

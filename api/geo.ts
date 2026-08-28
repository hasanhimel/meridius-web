import type { IncomingMessage, ServerResponse } from 'http';

function sanitizeString(str: string | null, maxLen = 100): string | null {
  if (!str) return null;
  // Strip control characters, tags, newlines
  const cleaned = str.replace(/[^\w\s.,'-]/gi, '').trim();
  return cleaned.length > 0 ? cleaned.slice(0, maxLen) : null;
}

export default function handler(
  req: IncomingMessage & { query?: any; headers: Record<string, string | string[] | undefined> },
  res: ServerResponse
) {
  // Security & Content headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'private, max-age=1800');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.statusCode = 204;
    res.end();
    return;
  }

  // Reject unsupported HTTP methods
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  const getHeader = (key: string): string | null => {
    const val = req.headers[key.toLowerCase()];
    if (!val) return null;
    return Array.isArray(val) ? val[0] : val;
  };

  const rawCountryCode = getHeader('x-vercel-ip-country');
  const countryCode = rawCountryCode && /^[a-zA-Z]{2}$/.test(rawCountryCode.trim())
    ? rawCountryCode.trim().toUpperCase()
    : null;

  const rawRegion = getHeader('x-vercel-ip-country-region');
  const region = sanitizeString(rawRegion, 50);

  const rawCity = getHeader('x-vercel-ip-city');
  let decodedCity: string | null = null;
  if (rawCity) {
    try {
      decodedCity = decodeURIComponent(rawCity);
    } catch {
      decodedCity = rawCity;
    }
  }
  const city = sanitizeString(decodedCity, 80);

  const rawForwarded = getHeader('x-forwarded-for');
  const rawIp = rawForwarded?.split(',')[0]?.trim() || req.socket?.remoteAddress || null;
  // Mask IP or format safely
  const ip = rawIp && /^[\da-fA-F.:]+$/.test(rawIp) ? rawIp.slice(0, 45) : null;

  const rawLat = getHeader('x-vercel-ip-latitude');
  const latitude = rawLat && !isNaN(Number(rawLat)) ? rawLat : null;

  const rawLon = getHeader('x-vercel-ip-longitude');
  const longitude = rawLon && !isNaN(Number(rawLon)) ? rawLon : null;

  let flagEmoji = '🌐';
  if (countryCode && countryCode.length === 2) {
    try {
      const codePoints = countryCode
        .split('')
        .map((c) => 127397 + c.charCodeAt(0));
      flagEmoji = String.fromCodePoint(...codePoints);
    } catch {}
  }

  let countryName: string | null = null;
  if (countryCode && countryCode.length === 2) {
    try {
      const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
      countryName = displayNames.of(countryCode) || null;
    } catch {}
  }

  res.statusCode = 200;
  res.end(
    JSON.stringify({
      city,
      country: countryName,
      country_code: countryCode,
      region,
      flag_emoji: flagEmoji,
      ip,
      latitude,
      longitude,
    })
  );
}


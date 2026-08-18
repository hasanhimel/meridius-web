import type { IncomingMessage, ServerResponse } from 'http';

export default function handler(
  req: IncomingMessage & { query?: any; headers: Record<string, string | string[] | undefined> },
  res: ServerResponse
) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const getHeader = (key: string): string | null => {
    const val = req.headers[key.toLowerCase()];
    if (!val) return null;
    return Array.isArray(val) ? val[0] : val;
  };

  const countryCode = getHeader('x-vercel-ip-country');
  const region = getHeader('x-vercel-ip-country-region');
  const rawCity = getHeader('x-vercel-ip-city');
  const city = rawCity ? decodeURIComponent(rawCity) : null;
  const ip = getHeader('x-forwarded-for')?.split(',')[0]?.trim() || req.socket?.remoteAddress || null;
  const latitude = getHeader('x-vercel-ip-latitude');
  const longitude = getHeader('x-vercel-ip-longitude');

  let flagEmoji = '🌐';
  if (countryCode && countryCode.trim().length === 2) {
    try {
      const codePoints = countryCode
        .trim()
        .toUpperCase()
        .split('')
        .map((c) => 127397 + c.charCodeAt(0));
      flagEmoji = String.fromCodePoint(...codePoints);
    } catch {}
  }

  let countryName: string | null = null;
  if (countryCode && countryCode.trim().length === 2) {
    try {
      const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
      countryName = displayNames.of(countryCode.trim().toUpperCase()) || null;
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

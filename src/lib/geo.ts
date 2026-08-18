/**
 * Visitor Geolocation Detection Utility
 * Resolves visitor city, country, region, flag emoji, and IP.
 * Multi-tier detection:
 * 1. Session Storage Cache (fastest, prevents redundant queries)
 * 2. Vercel Serverless Edge Headers (/api/geo)
 * 3. Fallback / City-enrichment with public IP geolocation APIs (ipwho.is / ipinfo.io)
 */

export interface GeoLocation {
  city: string | null;
  country: string | null;
  country_code: string | null;
  region: string | null;
  ip: string | null;
  flag_emoji: string | null;
}

const CACHE_KEY = 'meridius_geo_telemetry';

/**
 * Convert 2-letter ISO country code (e.g. "US", "BD", "GB") to flag emoji
 */
export function getCountryFlag(countryCode?: string | null): string {
  if (!countryCode || countryCode.trim().length !== 2) return '🌐';
  try {
    const codePoints = countryCode
      .trim()
      .toUpperCase()
      .split('')
      .map((c) => 127397 + c.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return '🌐';
  }
}

/**
 * Convert country code to English full name if name is missing
 */
export function getCountryName(countryCode?: string | null): string | null {
  if (!countryCode || countryCode.trim().length !== 2) return null;
  try {
    const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
    return displayNames.of(countryCode.trim().toUpperCase()) || null;
  } catch {
    return null;
  }
}

/**
 * Fetch geolocation data for current visitor
 */
export async function fetchVisitorGeo(): Promise<GeoLocation> {
  // 1. Check session storage cache
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as GeoLocation;
      if (parsed && (parsed.country || parsed.city)) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage parse errors
  }

  let geo: GeoLocation = {
    city: null,
    country: null,
    country_code: null,
    region: null,
    ip: null,
    flag_emoji: null,
  };

  // 2. Try internal /api/geo endpoint (Vercel edge headers)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch('/api/geo', {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && (data.country_code || data.city)) {
        const countryCode = data.country_code || null;
        const countryName = data.country || getCountryName(countryCode);
        geo = {
          city: data.city || null,
          country: countryName,
          country_code: countryCode,
          region: data.region || null,
          ip: data.ip || null,
          flag_emoji: data.flag_emoji || getCountryFlag(countryCode),
        };

        // If we have both city and country, cache and return immediately
        if (geo.city && geo.country) {
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(geo));
          } catch {}
          return geo;
        }
      }
    }
  } catch {
    // /api/geo timed out or in local dev without Vercel backend
  }

  // 3. Fallback or enrich with ipwho.is (to get city if Vercel header omitted it)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch('https://ipwho.is/', {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.success !== false) {
        const countryCode = data.country_code || geo.country_code;
        geo = {
          city: data.city || geo.city,
          country: data.country || geo.country || getCountryName(countryCode),
          country_code: countryCode,
          region: data.region || geo.region,
          ip: data.ip || geo.ip,
          flag_emoji: data.flag?.emoji || geo.flag_emoji || getCountryFlag(countryCode),
        };

        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(geo));
        } catch {}
        return geo;
      }
    }
  } catch {
    // Secondary fallback
  }

  // 4. Fallback to ipinfo.io
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch('https://ipinfo.io/json', {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data) {
        const countryCode = data.country || geo.country_code;
        geo = {
          city: data.city || geo.city,
          country: getCountryName(countryCode) || data.country || geo.country,
          country_code: countryCode,
          region: data.region || geo.region,
          ip: data.ip || geo.ip,
          flag_emoji: getCountryFlag(countryCode) || geo.flag_emoji,
        };

        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(geo));
        } catch {}
        return geo;
      }
    }
  } catch {
    // Fallback failed
  }

  // Return whatever was obtained
  if (geo.country || geo.city) {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(geo));
    } catch {}
  }

  return geo;
}

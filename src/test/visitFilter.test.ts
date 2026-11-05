import { describe, expect, it } from 'vitest';
import { isNonHumanVisit } from '../lib/supabase';

const mac = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const iphone = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const linux = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const android = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36';
const site = { hostname: 'meridiusai.vercel.app', webdriver: false, screenW: 1440, screenH: 900 };

describe('isNonHumanVisit', () => {
  it('counts real browsers', () => {
    expect(isNonHumanVisit({ ...site, userAgent: mac })).toBe(false);
    expect(isNonHumanVisit({ ...site, userAgent: iphone, screenW: 393, screenH: 852 })).toBe(false);
    expect(isNonHumanVisit({ ...site, userAgent: linux, screenW: 1920, screenH: 1080 })).toBe(false);
    expect(isNonHumanVisit({ ...site, userAgent: android, screenW: 800, screenH: 600 })).toBe(false);
  });

  it('skips local development', () => {
    expect(isNonHumanVisit({ ...site, hostname: 'localhost', userAgent: mac })).toBe(true);
    expect(isNonHumanVisit({ ...site, hostname: '127.0.0.1', userAgent: mac })).toBe(true);
  });

  it('skips automation, crawlers and headless Chrome', () => {
    expect(isNonHumanVisit({ ...site, userAgent: mac, webdriver: true })).toBe(true);
    expect(isNonHumanVisit({ ...site, userAgent: linux.replace('Chrome/', 'HeadlessChrome/') })).toBe(true);
    expect(isNonHumanVisit({ ...site, userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1)' })).toBe(true);
  });

  it("skips Vercel's deployment screenshots (Linux Chrome at 800x600)", () => {
    expect(isNonHumanVisit({ ...site, userAgent: linux, screenW: 800, screenH: 600 })).toBe(true);
  });
});

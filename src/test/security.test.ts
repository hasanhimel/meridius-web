import { describe, it, expect } from 'vitest';
import { validateEmail, sanitizeText } from '../lib/supabase';
import { getCountryFlag, getCountryName } from '../lib/geo';
import { createAdminToken, verifyAdminToken } from '../../api/admin/auth';

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

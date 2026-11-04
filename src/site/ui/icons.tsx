import type { CSSProperties } from 'react';

/** Small line icons used across the site. All inherit currentColor. */

type P = { className?: string };

export function CheckIcon({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
    </svg>
  );
}

export function SearchIcon({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="9" cy="9" r="6" />
      <path d="m13.5 13.5 3.5 3.5" />
    </svg>
  );
}

export function SparkIcon({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 1.5c.4 3.9 2.6 6.1 6.5 6.5-3.9.4-6.1 2.6-6.5 6.5-.4-3.9-2.6-6.1-6.5-6.5 3.9-.4 6.1-2.6 6.5-6.5Z" />
      <path d="M15.5 13c.2 1.6 1 2.4 2.5 2.5-1.5.2-2.3 1-2.5 2.5-.2-1.5-1-2.3-2.5-2.5 1.5-.1 2.3-.9 2.5-2.5Z" />
    </svg>
  );
}

export function ChevronIcon({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 7.5 5 5 5-5" />
    </svg>
  );
}

export function ArrowDownIcon({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 3v13M5 11l5 5 5-5" />
    </svg>
  );
}

export function EyeIcon({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M1.8 10S5 4.5 10 4.5 18.2 10 18.2 10 15 15.5 10 15.5 1.8 10 1.8 10Z" />
      <circle cx="10" cy="10" r="2.6" />
    </svg>
  );
}

export function BoltIcon({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M11.2 1.5 3.8 11.2h5l-1 7.3 7.4-9.7h-5l1-7.3Z" />
    </svg>
  );
}

export function DocIcon({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 1.8h5.2L12.5 5v9.2H4z" />
      <path d="M9 1.8V5.2h3.4M6 8.2h4.5M6 10.8h4.5" />
    </svg>
  );
}

export function LockIcon({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="9" width="12" height="8.5" rx="2" />
      <path d="M7 9V6.5a3 3 0 0 1 6 0V9" />
    </svg>
  );
}

/** The agent's pointer, drawn in the brand blue. */
export function CursorIcon({ className, style }: P & { style?: CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4.5 2.5v14l3.8-3.6 2.6 5.6 2.4-1.1-2.6-5.5 5.3-.3z" fill="currentColor" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

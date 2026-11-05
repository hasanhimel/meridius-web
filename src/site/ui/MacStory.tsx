import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { gsap } from '../motion';
import { LogoMark } from '../brand/LogoMark';
import { Cursor, type CursorHandle } from './Cursor';
import { CheckIcon } from './icons';
import { reducedMotion } from '../demos/useDemo';
import './mac-story.css';

/* =============================================================================
   The hero's motion piece: a MacBook, used for real.

   One GSAP timeline, looping:
     1. The Mac pointer opens Meridius from the dock. The notch drips a
        teardrop into a Dynamic-Island pill with the Meridius icon, folds back,
        and the logo and an open eye appear in the menu bar.
     2. Gmail opens with the Genie effect; the professor's email announces
        Assignment 3.
     3. Slack opens; the channel scrolls to the TA's post with the starter
        files and a deadline, the next full hour on the visitor's own clock.
     4. Meridius's notification slides in at the top right.
     5. Approved: the card stretches, in place, into a small virtual display
        while faint copies of the email, files and deadline drift into it.
     6. The camera dives in: Meridius's cursor writes the code in VS Code and
        runs the tests. Back out, the display folds into the menu bar and
        Meridius asks for a review before anything is submitted.

   Everything inside the screen is in em on a 72 x 45 em stage. Elements moved
   by script in em keep the stage's font-size; only leaf text sets its own.
   ============================================================================= */

const W = 72;
const H = 45;

/* ------------------------------------------------------------------ time */

const fmtTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
const fmtClock = (d: Date) =>
  `${d.toLocaleDateString('en-US', { weekday: 'short' })} ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${fmtTime(d)}`;
const fmtDay = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

/** The story's deadline: the next full hour on the visitor's clock. */
function deadlineInfo(now = new Date()) {
  const due = new Date(now);
  due.setMinutes(0, 0, 0);
  due.setHours(due.getHours() + 1);
  const left = Math.max(1, Math.ceil((due.getTime() - now.getTime()) / 60000));
  const when = due.getDate() !== now.getDate() || due.getHours() >= 18 ? 'tonight' : 'today';
  return { time: fmtTime(due), left: `${left} min left`, when };
}

/** Timestamps in the story, relative to when the page was opened. */
function storyTimes(now: Date) {
  const ago = (min: number) => fmtTime(new Date(now.getTime() - min * 60000));
  const daysAgo = (d: number) => fmtDay(new Date(now.getTime() - d * 86400000));
  return {
    email: ago(132),
    posts: [ago(205), ago(188), ago(160), ago(151), ago(64), ago(38)],
    days: ['Yesterday', 'Yesterday', daysAgo(2), daysAgo(3), daysAgo(3), daysAgo(4), daysAgo(5)],
  };
}

/** The menu bar clock, ticking with the visitor's local time. */
function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 10000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="ms-clock">{fmtClock(now)}</span>;
}

/* ----------------------------------------------------------------- icons */

type IcoName =
  | 'menu'
  | 'search'
  | 'sliders'
  | 'help'
  | 'gear'
  | 'grid'
  | 'pencil'
  | 'inbox'
  | 'star'
  | 'clock'
  | 'send'
  | 'file'
  | 'chevL'
  | 'chevR'
  | 'box'
  | 'refresh'
  | 'kebab'
  | 'back'
  | 'archive'
  | 'trash'
  | 'reply'
  | 'forward'
  | 'home'
  | 'dm'
  | 'bell'
  | 'dots'
  | 'plus'
  | 'files'
  | 'branch'
  | 'run'
  | 'ext'
  | 'tag'
  | 'smile'
  | 'at'
  | 'mail';

const ICO: Record<IcoName, ReactNode> = {
  menu: <path d="M3.5 6h13M3.5 10h13M3.5 14h13" />,
  search: (
    <>
      <circle cx="8.8" cy="8.8" r="5.3" />
      <path d="m12.8 12.8 4 4" />
    </>
  ),
  sliders: (
    <>
      <path d="M3.5 6.5h7M15 6.5h1.5M3.5 13.5h1.5M9.5 13.5h7" />
      <circle cx="12.7" cy="6.5" r="1.9" />
      <circle cx="7.2" cy="13.5" r="1.9" />
    </>
  ),
  help: (
    <>
      <circle cx="10" cy="10" r="7.2" />
      <path d="M8 8.2a2.1 2.1 0 1 1 2.9 1.9c-.6.3-.9.7-.9 1.3M10 13.8v.1" />
    </>
  ),
  gear: (
    <>
      <circle cx="10" cy="10" r="2.6" />
      <path d="M10 2.8v2.1M10 15.1v2.1M2.8 10h2.1M15.1 10h2.1M4.9 4.9l1.5 1.5M13.6 13.6l1.5 1.5M4.9 15.1l1.5-1.5M13.6 6.4l1.5-1.5" />
    </>
  ),
  grid: (
    <>{[5, 10, 15].flatMap((y) => [5, 10, 15].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.1" fill="currentColor" stroke="none" />))}</>
  ),
  pencil: <path d="M4.5 15.5l.9-3.6 8-8 2.7 2.7-8 8z" />,
  inbox: <path d="M3.5 11l2-6h9l2 6v4.5h-13zM3.5 11h4l1 2h3l1-2h4" />,
  star: <path d="m10 3.2 2 4.2 4.6.6-3.4 3.2.9 4.6L10 13.6l-4.1 2.2.9-4.6-3.4-3.2 4.6-.6z" />,
  clock: (
    <>
      <circle cx="10" cy="10" r="6.8" />
      <path d="M10 6.2V10l2.7 1.8" />
    </>
  ),
  send: <path d="M3.5 10 16.5 4l-5.6 13-2.1-5.2z" />,
  file: <path d="M6 3h5.5L15 6.5V17H6zM11.5 3v3.5H15" />,
  chevL: <path d="M12 5l-5 5 5 5" />,
  chevR: <path d="M8 5l5 5-5 5" />,
  box: <rect x="4.5" y="4.5" width="11" height="11" rx="2" />,
  refresh: <path d="M15.2 10a5.2 5.2 0 1 1-1.5-3.7M15.2 4.2v3h-3" />,
  kebab: (
    <>
      <circle cx="10" cy="5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="10" cy="10" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="10" cy="15" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  back: <path d="M16 10H4.5M9 5.5 4.5 10 9 14.5" />,
  archive: <path d="M3.5 4.5h13v3.5h-13zM4.5 8v7.5h11V8M8 11h4" />,
  trash: <path d="M4 6h12M8 6V4h4v2M5.7 6l.9 10.5h6.8l.9-10.5" />,
  reply: <path d="M8 5 3.5 9.5 8 14M3.5 9.5H12a4.5 4.5 0 0 1 4.5 4.5v1" />,
  forward: <path d="M12 5l4.5 4.5L12 14M16.5 9.5H8A4.5 4.5 0 0 0 3.5 14v1" />,
  home: <path d="M3.5 9 10 3.5 16.5 9v7.5h-4.5v-4.5H8v4.5H3.5z" />,
  dm: <path d="M4 4.5h12v8.5H8.5L4 16.5z" />,
  bell: <path d="M10 3.5a4.3 4.3 0 0 0-4.3 4.3V11l-1.5 3h11.6l-1.5-3V7.8A4.3 4.3 0 0 0 10 3.5zM8.4 16.2a1.6 1.6 0 0 0 3.2 0" />,
  dots: (
    <>
      <circle cx="5" cy="10" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="10" cy="10" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  plus: <path d="M10 4.5v11M4.5 10h11" />,
  files: <path d="M5.5 3h6l3.5 3.5V17h-9.5zM11.5 3v3.5H15" />,
  branch: (
    <>
      <circle cx="6" cy="5" r="1.8" />
      <circle cx="6" cy="15" r="1.8" />
      <circle cx="14" cy="7.5" r="1.8" />
      <path d="M6 6.8v6.4M14 9.3c0 2.3-2.2 3.3-8 3.7" />
    </>
  ),
  run: <path d="M6.5 4.5 15.5 10l-9 5.5z" />,
  ext: <path d="M4 4h5v5H4zM11 4h5v5h-5zM4 11h5v5H4zM12.5 10.5v6M9.5 13.5h6" />,
  tag: <path d="M4 4h6.5l6 6-6.5 6.5-6-6zM7.3 7.3h.1" />,
  smile: (
    <>
      <circle cx="10" cy="10" r="6.8" />
      <path d="M7.3 11.6a3.3 3.3 0 0 0 5.4 0M7.8 8h.1M12.2 8h.1" />
    </>
  ),
  at: (
    <>
      <circle cx="10" cy="10" r="2.8" />
      <path d="M12.8 10v1.2a2 2 0 0 0 4 0V10a6.8 6.8 0 1 0-2.6 5.3" />
    </>
  ),
  mail: <path d="M3.5 5.5h13v9h-13zM3.5 6l6.5 5 6.5-5" />,
};

function Ico({ name, className }: { name: IcoName; className?: string }) {
  return (
    <svg
      className={`ms-ico${className ? ` ${className}` : ''}`}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICO[name]}
    </svg>
  );
}

/** A minimal document glyph with a coloured file-type label. */
type FileKind = 'zip' | 'pdf' | 'py' | 'md';
const FILE_META: Record<FileKind, [string, string]> = {
  zip: ['#6b7280', 'ZIP'],
  pdf: ['#e5484d', 'PDF'],
  py: ['#3572a5', 'PY'],
  md: ['#5b6b8c', 'MD'],
};

function FileGlyph({ kind }: { kind: FileKind }) {
  const [color, label] = FILE_META[kind];
  return (
    <svg className="ms-fg" viewBox="0 0 24 30" aria-hidden="true">
      <path
        d="M5 1.5h10.2L21.5 7.8V27a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 27V3A1.5 1.5 0 0 1 5 1.5z"
        fill="#fff"
        stroke="#cdd2db"
        strokeWidth="1.1"
      />
      <path d="M15.2 1.5V6.6a1.2 1.2 0 0 0 1.2 1.2h5.1" fill="#f1f3f6" stroke="#cdd2db" strokeWidth="1.1" strokeLinejoin="round" />
      {kind === 'zip' ? <path d="M10 3.5h2M12 5.5h2M10 7.5h2M12 9.5h2M10 11.5h2" stroke="#a0a6b1" strokeWidth="1.3" /> : null}
      {kind === 'py' ? (
        <>
          <circle cx="10.5" cy="9.5" r="2.6" fill="#3572a5" />
          <circle cx="14" cy="12.2" r="2.6" fill="#ffd43b" />
        </>
      ) : null}
      <rect x="1" y="16.5" width="17.5" height="8.2" rx="2" fill={color} />
      <text x="9.75" y="22.6" textAnchor="middle" fontSize="6" fontWeight="700" fill="#fff" fontFamily="ui-sans-serif, system-ui, sans-serif">
        {label}
      </text>
    </svg>
  );
}

/** A minimal open eye: one hairline, one pupil. */
function EyeThin() {
  return (
    <svg className="ms-eye" viewBox="0 0 24 14" aria-hidden="true">
      <path
        d="M1.4 7C4 3.1 7.6 1.2 12 1.2S20 3.1 22.6 7C20 10.9 16.4 12.8 12 12.8S4 10.9 1.4 7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.15"
      />
      <circle cx="12" cy="7" r="2.7" fill="currentColor" />
    </svg>
  );
}

function Glyph({ name }: { name: 'apple' | 'battery' | 'wifi' | 'search' | 'control' }) {
  switch (name) {
    case 'apple':
      return (
        <svg viewBox="0 0 14 17" aria-hidden="true">
          <path
            fill="currentColor"
            d="M11.6 9c0-2 1.6-2.9 1.7-3a3.7 3.7 0 0 0-2.9-1.6c-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7A3.9 3.9 0 0 0 1.5 6.4c-1.4 2.4-.4 6 1 8 .7 1 1.5 2 2.5 2s1.4-.6 2.6-.6 1.5.6 2.6.6 1.7-1 2.4-2a8 8 0 0 0 1-2.2A3.4 3.4 0 0 1 11.6 9ZM9.6 3c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.6.6-1 1.6-.9 2.6 1 0 1.9-.5 2.5-1.2Z"
          />
        </svg>
      );
    case 'battery':
      return (
        <svg viewBox="0 0 26 12" aria-hidden="true">
          <rect x="0.6" y="0.6" width="22" height="10.8" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.2" />
          <rect x="2.4" y="2.4" width="15" height="7.2" rx="1.6" fill="currentColor" />
          <path d="M24.2 4.2v3.6c.8-.3 1.2-1 1.2-1.8s-.4-1.5-1.2-1.8Z" fill="currentColor" fillOpacity="0.5" />
        </svg>
      );
    case 'wifi':
      return (
        <svg viewBox="0 0 16 12" aria-hidden="true">
          <path
            fill="currentColor"
            d="M8 2.4c2.3 0 4.4.9 6 2.4l1.2-1.3A10.3 10.3 0 0 0 8 .6C5.2.6 2.7 1.7.8 3.5L2 4.8a8.5 8.5 0 0 1 6-2.4Zm0 3.5c1.3 0 2.5.5 3.5 1.4l1.2-1.3A7 7 0 0 0 8 4.1C6.2 4.1 4.6 4.8 3.3 6l1.2 1.3c1-.9 2.2-1.4 3.5-1.4Zm0 3.4c-.6 0-1.1.2-1.5.6L8 11.5l1.5-1.6c-.4-.4-.9-.6-1.5-.6Z"
          />
        </svg>
      );
    case 'search':
      return (
        <svg viewBox="0 0 14 14" aria-hidden="true">
          <circle cx="5.8" cy="5.8" r="4.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="m9.2 9.2 3.6 3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    case 'control':
      return (
        <svg viewBox="0 0 16 14" aria-hidden="true">
          <rect x="0.8" y="0.8" width="14.4" height="5.2" rx="2.6" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="12.6" cy="3.4" r="1.6" fill="currentColor" />
          <rect x="0.8" y="8" width="14.4" height="5.2" rx="2.6" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="3.4" cy="10.6" r="1.6" fill="currentColor" />
        </svg>
      );
  }
}

function Lights({ dim = false }: { dim?: boolean }) {
  return (
    <span className={`ms-lights${dim ? ' ms-lights--dim' : ''}`}>
      <i />
      <i />
      <i />
    </span>
  );
}

/** The standard macOS arrow: black, white outline, soft shadow. Tip at (0, 0). */
function MacPointer() {
  return (
    <div className="ms-ptr" aria-hidden="true">
      <span className="ms-ptr__ripple" />
      <div className="ms-ptr__in">
        <svg viewBox="0 0 15 22">
          <path
            d="M1.2 1.2V17.6L5.1 13.9L7.6 19.8C7.8 20.3 8.4 20.5 8.9 20.3L10.2 19.7C10.7 19.5 10.9 18.9 10.7 18.4L8.3 12.8H13.6Z"
            fill="#000"
            stroke="#fff"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ dock */

const DOCK = [
  { key: 'finder', label: 'Finder', src: '/icons/apps/finder.png' },
  { key: 'gmail', label: 'Gmail', src: '/icons/apps/gmail.png' },
  { key: 'slack', label: 'Slack', src: '/icons/apps/slack.png' },
  { key: 'notion', label: 'Notion', src: '/icons/apps/notion.png' },
  { key: 'figma', label: 'Figma', src: '/icons/apps/figma.png' },
  { key: 'calendar', label: 'Google Calendar', src: '/icons/apps/calendar.png' },
  { key: 'vscode', label: 'Visual Studio Code', src: '/icons/apps/vscode.png' },
  { key: 'sep', label: '', src: '' },
  { key: 'meridius', label: 'Meridius', src: '/icons/apps/meridius.png' },
];

/** Icon slots include the icon's own transparent margin, as in macOS. */
const ICON = 3.3;
const GAP = 0.04;
const SEP = 0.9;
const PAD = 0.24;
const DOCK_BOTTOM = 0.45;
const SHELF_H = ICON + PAD * 2;
const ICON_CY = H - DOCK_BOTTOM - PAD - ICON / 2;
const DOCK_ZONE = H - DOCK_BOTTOM - SHELF_H - 0.5;

function layoutDock(scales: number[]) {
  const widths = DOCK.map((d, i) => (d.key === 'sep' ? SEP : ICON * scales[i]));
  const lefts: number[] = [];
  let x = 0;
  widths.forEach((w, i) => {
    lefts.push(x);
    x += w + (i < widths.length - 1 ? GAP : 0);
  });
  return { widths, lefts, total: x };
}

const BASE = layoutDock(DOCK.map(() => 1));
const BASE_START = W / 2 - BASE.total / 2;
const dockCenter = (key: string) => {
  const i = DOCK.findIndex((d) => d.key === key);
  return { x: BASE_START + BASE.lefts[i] + ICON / 2, y: ICON_CY };
};

/** Where a point of the resting dock lands once the dock has magnified. */
function mapPoint(xRel: number, a: ReturnType<typeof layoutDock>, b: ReturnType<typeof layoutDock>) {
  const n = a.widths.length;
  if (xRel <= 0) return xRel;
  for (let i = 0; i < n; i++) {
    const span = a.widths[i] + (i < n - 1 ? GAP : 0);
    if (xRel <= a.lefts[i] + span) return b.lefts[i] + ((xRel - a.lefts[i]) / span) * (b.widths[i] + (i < n - 1 ? GAP : 0));
  }
  return b.total + (xRel - a.total);
}

/* ------------------------------------------------------------------ code */

type Tok = 'kw' | 'kw2' | 'fn' | 'var' | 'ty' | 'str' | 'num' | 'tx';
const CODE: [string, Tok][][] = [
  [
    ['import', 'kw'],
    [' hashlib', 'tx'],
  ],
  [],
  [
    ['store', 'var'],
    [': ', 'tx'],
    ['dict', 'ty'],
    ['[', 'tx'],
    ['str', 'ty'],
    [', ', 'tx'],
    ['str', 'ty'],
    ['] = {}', 'tx'],
  ],
  [],
  [
    ['def', 'kw2'],
    [' ', 'tx'],
    ['shorten', 'fn'],
    ['(', 'tx'],
    ['url', 'var'],
    [': ', 'tx'],
    ['str', 'ty'],
    [') -> ', 'tx'],
    ['str', 'ty'],
    [':', 'tx'],
  ],
  [
    ['    ', 'tx'],
    ['key', 'var'],
    [' = ', 'tx'],
    ['hashlib', 'var'],
    ['.', 'tx'],
    ['sha256', 'fn'],
    ['(', 'tx'],
    ['url', 'var'],
    ['.', 'tx'],
    ['encode', 'fn'],
    ['()).', 'tx'],
    ['hexdigest', 'fn'],
    ['()[:', 'tx'],
    ['7', 'num'],
    [']', 'tx'],
  ],
  [
    ['    ', 'tx'],
    ['store', 'var'],
    ['[', 'tx'],
    ['key', 'var'],
    ['] = ', 'tx'],
    ['url', 'var'],
  ],
  [
    ['    ', 'tx'],
    ['return', 'kw'],
    [' ', 'tx'],
    ['f"https://mrd.is/', 'str'],
    ['{', 'kw2'],
    ['key', 'var'],
    ['}', 'kw2'],
    ['"', 'str'],
  ],
  [],
  [
    ['def', 'kw2'],
    [' ', 'tx'],
    ['expand', 'fn'],
    ['(', 'tx'],
    ['key', 'var'],
    [': ', 'tx'],
    ['str', 'ty'],
    [') -> ', 'tx'],
    ['str', 'ty'],
    [':', 'tx'],
  ],
  [
    ['    ', 'tx'],
    ['return', 'kw'],
    [' ', 'tx'],
    ['store', 'var'],
    ['[', 'tx'],
    ['key', 'var'],
    [']', 'tx'],
  ],
];
const CODE_LEN = CODE.reduce((n, line) => n + line.reduce((m, [t]) => m + t.length, 0) + 1, 0);
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function renderCode(code: HTMLElement, gutter: HTMLElement, n: number) {
  let left = n;
  let html = '';
  let lines = 0;
  for (const line of CODE) {
    if (lines > 0 && left <= 0) break;
    lines++;
    let row = '';
    for (const [text, tok] of line) {
      if (left <= 0) break;
      const part = text.slice(0, left);
      left -= part.length;
      row += `<span class="t-${tok}">${esc(part)}</span>`;
    }
    left -= 1;
    html += `<div>${row}${left < 0 ? '<i class="ms-caret"></i>' : ''}</div>`;
  }
  code.innerHTML = html;
  gutter.innerHTML = Array.from({ length: Math.max(lines, 1) }, (_, i) => `<div>${i + 1}</div>`).join('');
}

const TERM_CMD = 'pytest -q';

/* ----------------------------------------------------------------- content */

const MENUS: Record<string, string[]> = {
  finder: ['Finder', 'File', 'Edit', 'View', 'Go', 'Window', 'Help'],
  meridius: ['Meridius', 'File', 'Edit', 'View', 'Window', 'Help'],
  gmail: ['Gmail', 'File', 'Edit', 'View', 'Window', 'Help'],
  slack: ['Slack', 'File', 'Edit', 'View', 'Go', 'Window', 'Help'],
};

const INBOX = [
  {
    from: 'Prof. Rahman',
    subject: 'Assignment 3 is out',
    snippet: 'Build a URL shortener in Python. The spec and starter files are pinned in #cs-201',
    unread: true,
    target: true,
  },
  { from: 'Google Calendar', subject: 'Updated: Design review', snippet: 'Now Thursday at 2:00 PM · Room 4B', unread: true },
  { from: 'Ayaan', subject: 'Logo files', snippet: 'I’ll send them Monday, promise', unread: false },
  { from: 'Course site', subject: 'Grades posted', snippet: 'Assignment 2 grades are live', unread: false },
  { from: 'GitHub', subject: '[cs-201] New push to main', snippet: '3 commits by Nadia', unread: false },
  { from: 'Mum', subject: 'Flight on the 21st', snippet: 'Did you book it yet?', unread: false },
  { from: 'Figma', subject: 'Your receipt', snippet: 'Professional plan · $15.00', unread: false },
  { from: 'Pathao', subject: 'Your ride receipt', snippet: 'BDT 240 · Gulshan to Banani', unread: false },
];

const POSTS: { who: string; c: string; text: string; files?: [string, FileKind][] }[] = [
  { who: 'Nadia', c: '#e8912d', text: 'Office hours moved to Thursday, 3 PM.' },
  { who: 'Ayaan', c: '#2bac76', text: 'Anyone up for a study group tomorrow?' },
  { who: 'Mim', c: '#cd2553', text: 'Lecture 9 slides please 🙏' },
  { who: 'Rafi (TA)', c: '#1d9bd1', text: 'Lecture 9 slides are up.', files: [['lecture-9.pdf', 'pdf']] },
  { who: 'Ayaan', c: '#2bac76', text: 'who else hasn’t started A3 😅' },
];

const FILES: [string, string, FileKind][] = [
  ['starter.zip', 'Zip', 'zip'],
  ['spec.pdf', 'PDF', 'pdf'],
  ['test_shortener.py', 'Python', 'py'],
];

const STEPS = ['Open Meridius', 'An email', 'A Slack post', 'Meridius asks', 'Its own display', 'You review'];

/* ============================================================== component */

export const MacStory = forwardRef<HTMLDivElement>(function MacStory(_, ref) {
  const rootRef = useRef<HTMLDivElement>(null);
  const camRef = useRef<HTMLDivElement>(null);
  const blueRef = useRef<CursorHandle>(null);
  const dockRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const shelfRef = useRef<HTMLSpanElement>(null);
  const realHover = useRef(false);
  const fakeX = useRef<number | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const visible = useRef(false);
  const started = useRef(false);
  const [paused, setPaused] = useState(false);
  const syncRef = useRef<() => void>(() => undefined);
  const [times] = useState(() => storyTimes(new Date()));
  const [due] = useState(() => deadlineInfo());

  useImperativeHandle(ref, () => rootRef.current!);

  /** macOS magnification: icons near x grow and push their neighbours apart. */
  const magnify = useCallback((x: number | null) => {
    const scales = DOCK.map((d, i) => {
      if (d.key === 'sep' || x === null) return 1;
      const c = BASE_START + BASE.lefts[i] + ICON / 2;
      const dist = (x - c) / ICON;
      return 1 + 0.55 * Math.exp(-(dist * dist) / 1.1);
    });
    const next = layoutDock(scales);
    const start = x === null ? W / 2 - next.total / 2 : x - mapPoint(x - BASE_START, BASE, next);
    let nearest = -1;
    if (x !== null) {
      let best = Infinity;
      DOCK.forEach((d, i) => {
        if (d.key === 'sep') return;
        const c = start + next.lefts[i] + next.widths[i] / 2;
        const dd = Math.abs(x - c);
        if (dd < best && dd < next.widths[i] / 2 + GAP) {
          best = dd;
          nearest = i;
        }
      });
    }
    DOCK.forEach((d, i) => {
      const el = dockRefs.current[i];
      if (!el) return;
      el.style.left = `${start + next.lefts[i]}em`;
      if (d.key !== 'sep') {
        el.style.width = `${next.widths[i]}em`;
        el.style.height = `${next.widths[i]}em`;
      }
      el.toggleAttribute('data-hover', i === nearest);
    });
    const shelf = shelfRef.current;
    if (shelf) {
      shelf.style.left = `${start - PAD}em`;
      shelf.style.width = `${next.total + PAD * 2}em`;
    }
  }, []);

  const onDockMove = (e: React.PointerEvent) => {
    const cam = camRef.current;
    if (!cam || e.pointerType === 'touch') return;
    const r = cam.getBoundingClientRect();
    realHover.current = true;
    magnify(((e.clientX - r.left) / r.width) * W);
  };
  const onDockLeave = () => {
    realHover.current = false;
    magnify(fakeX.current);
  };

  useLayoutEffect(() => {
    const root = rootRef.current!;
    const cam = camRef.current!;
    const blue = blueRef.current!;
    const q = <T extends HTMLElement = HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
    const qa = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));

    // Measure only once the fonts are in: text widths decide where things are.
    let ctx: gsap.Context | null = null;
    let cancelled = false;
    const build = () => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const emPx = parseFloat(getComputedStyle(cam).fontSize);
        // The goo filter works in px; keep its blur proportional to the stage.

        /** An element's layout box in em relative to `stop`, ignoring transforms. */
        const pos = (el: HTMLElement, stop: HTMLElement = cam) => {
          let x = 0;
          let y = 0;
          let n: HTMLElement | null = el;
          while (n && n !== stop) {
            x += n.offsetLeft;
            y += n.offsetTop;
            n = n.offsetParent as HTMLElement | null;
          }
          return { x: x / emPx, y: y / emPx, w: el.offsetWidth / emPx, h: el.offsetHeight / emPx };
        };
        type Box = ReturnType<typeof pos>;
        const center = (r: Box) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });
        const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
        const smooth = (a: number, b: number, t: number) => {
          const x = clamp((t - a) / (b - a), 0, 1);
          return x * x * (3 - 2 * x);
        };

        // Elements.
        const ptr = q('.ms-ptr');
        const ptrIn = q('.ms-ptr__in');
        const ripple = q('.ms-ptr__ripple');
        const menubar = q('.ms-menubar');
        const mbItem = q('.ms-mb-meridius');
        const mbEye = q('.ms-mb-meridius .ms-eye');
        const islandBody = q('.ms-island__body');
        const islandContent = q('.ms-island__content');
        const gmail = q('.ms-gmail');
        const gList = q('.ms-gmail__list');
        const gMail = q('.ms-gmail__mail');
        const gRow = q('.ms-gmail__row[data-target]');
        const gHl = q('.ms-gmail__hl');
        const slack = q('.ms-slack');
        const sView = q('.ms-slack__view');
        const sMsgs = q('.ms-slack__msgs');
        const sTarget = q('.ms-slack__msg[data-target]');
        const sDue = q('.ms-slack__due');
        const sFiles = qa('.ms-slack__msg[data-target] .ms-slack__file');
        const notif = q('.ms-note--ask');
        const notifInner = q('.ms-note--ask .ms-note__inner');
        const notifStart = q('.ms-note--ask .ms-note__btn--primary');
        const notif2 = q('.ms-note--done');
        const vd = q('.ms-vd');
        const vdScreen = q('.ms-vd__screen');
        const vdScene = q('.ms-vd__scene');
        const vdWorking = q('.ms-vd__state--working');
        const vdBar = q('.ms-vd__bar');
        const vdDone = q('.ms-vd__state--done');
        const souls = qa('.ms-soul');
        const steps = q('.ms-steps');
        const code = q('.ms-code__text');
        const gutter = q('.ms-code__gutter');
        const editor = q('.ms-vs__editor');
        const crumbs = q('.ms-vs__crumbs');
        const welcome = q('.ms-vs__welcome');
        const tabWelcome = q('.ms-vs__tab--welcome');
        const tabFile = q('.ms-vs__tab--file');
        const exFile = q('.ms-vs__file[data-target]');
        const term = q('.ms-vs__cmd');
        const termOut = qa('.ms-vs__out');
        const termPanel = q('.ms-vs__terminal');
        const toast = q('.ms-vs__toast');
        const iconOf = (key: string) => dockRefs.current[DOCK.findIndex((d) => d.key === key)]!;

        // Geometry (cam em).
        const GR = pos(gmail);
        const SR = pos(slack);
        const NR = pos(notif);
        const VR = pos(vd);
        const VS = pos(vdScreen);
        const targetBox = pos(sTarget, sMsgs);
        const scrollBy = Math.max(0, targetBox.y + targetBox.h - pos(sView, slack).h + 0.6);
        const rowAt = center(pos(gRow));
        const dueAt = center(pos(sDue));
        dueAt.y -= scrollBy;
        const startAt = center(pos(notifStart));
        const notifAt = center(NR);
        const notif2At = center(pos(notif2));
        const mbAt = center(pos(mbItem));
        const viewAt = center(pos(sView));
        vdScene.style.transform = `scale(${VS.w / W})`;

        /* ---- drawing, driven by proxies ---- */
        const P = { x: 40, y: 27 };
        const drawPtr = () => {
          ptr.style.transform = `translate(${P.x}em, ${P.y}em)`;
          fakeX.current = P.y > DOCK_ZONE ? P.x : null;
          if (!realHover.current) magnify(fakeX.current);
        };
        const C = { s: 1, x: 0, y: 0 };
        const drawCam = () => {
          cam.style.transform = `translate(${C.x}em, ${C.y}em) scale(${C.s})`;
        };
        const S = { y: 0 };
        const drawScroll = () => {
          sMsgs.style.transform = `translateY(${-S.y}em)`;
        };
        const T = { n: 0 };
        const drawCode = () => renderCode(code, gutter, Math.round(T.n));
        const K = { n: 0 };
        const drawCmd = () => {
          term.textContent = TERM_CMD.slice(0, Math.round(K.n));
        };

        /** Genie: the window stretches up out of its dock icon through a funnel. */
        const genieDraw = (win: HTMLElement, R: Box, key: string, v: number) => {
          if (v <= 0.001) {
            win.style.visibility = 'hidden';
            return;
          }
          win.style.visibility = 'visible';
          if (v >= 0.999) {
            win.style.transform = '';
            win.style.clipPath = '';
            win.style.opacity = '';
            return;
          }
          const I = dockCenter(key);
          const ease3 = (t: number) => 1 - Math.pow(1 - t, 3);
          const top = lerp(I.y - 1.2, R.y, ease3(clamp(v / 0.62, 0, 1)));
          const bottom = lerp(I.y + 1, R.y + R.h, smooth(0.28, 1, v));
          const h = Math.max(0.3, bottom - top);
          win.style.transformOrigin = '0 0';
          win.style.transform = `translateY(${top - R.y}em) scaleY(${h / R.h})`;
          const pinch = 1 - smooth(0.32, 1, v);
          const narrowTop = 1 - smooth(0, 0.5, v);
          const ix = ((I.x - R.x) / R.w) * 100;
          const iw = (1.3 / R.w) * 100;
          const left: string[] = [];
          const right: string[] = [];
          for (let k = 0; k <= 16; k++) {
            const t = k / 16;
            const f = pinch * (narrowTop + (1 - narrowTop) * smooth(0.02, 1, t));
            left.push(`${lerp(0, ix - iw, f).toFixed(2)}% ${(t * 100).toFixed(2)}%`);
            right.unshift(`${lerp(100, ix + iw, f).toFixed(2)}% ${(t * 100).toFixed(2)}%`);
          }
          win.style.clipPath = `polygon(${left.concat(right).join(',')})`;
          win.style.opacity = String(clamp(v * 5, 0, 1));
        };

        const updateTimes = () => {
          const d = deadlineInfo();
          qa('[data-due-time]').forEach((el) => (el.textContent = d.time));
          qa('[data-due-left]').forEach((el) => (el.textContent = d.left));
          qa('[data-due-when]').forEach((el) => (el.textContent = d.when));
        };

        const reset = () => {
          updateTimes();
          Object.assign(P, { x: 40, y: 27 });
          drawPtr();
          Object.assign(C, { s: 1, x: 0, y: 0 });
          drawCam();
          S.y = 0;
          drawScroll();
          T.n = 0;
          drawCode();
          K.n = 0;
          drawCmd();
          genieDraw(gmail, GR, 'gmail', 0);
          genieDraw(slack, SR, 'slack', 0);
          blue.set(40, 62);
        };

        /* ---- timeline ---- */
        const tl = gsap.timeline({ paused: true, repeat: -1, onRepeat: reset, defaults: { ease: 'power2.inOut' } });
        // Written at a calm 1x, played a touch faster: one loop is about 48 s.
        tl.timeScale(1.12);
        tlRef.current = tl;
        if (import.meta.env.DEV) (window as unknown as { __macStory?: gsap.core.Timeline }).__macStory = tl;

        const move = (x: number, y: number, d = 1, at: gsap.Position = '>') => tl.to(P, { x, y, duration: d, onUpdate: drawPtr }, at);
        const click = (at: gsap.Position = '>') => {
          tl.to(ptrIn, { scale: 0.86, duration: 0.08, ease: 'power2.in' }, at)
            .fromTo(ripple, { scale: 0.25, opacity: 0.5 }, { scale: 1, opacity: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }, '<')
            .to(ptrIn, { scale: 1, duration: 0.2, ease: 'back.out(3)' }, '<0.08');
        };
        const zoom = (s: number, cx: number, cy: number, d = 1.1, at: gsap.Position = '>') => {
          const x = clamp(W / 2 - s * cx, W - W * s, 0);
          const y = clamp(H / 2 - s * cy, H - H * s, 0);
          tl.to(C, { s, x, y, duration: d, ease: 'power3.inOut', onUpdate: drawCam }, at);
        };
        const zoomOut = (d = 1, at: gsap.Position = '>') => zoom(1, W / 2, H / 2, d, at);
        const hold = (d: number) => tl.to({}, { duration: d });
        const step = (i: number, at: gsap.Position = '>') => tl.set(steps, { attr: { 'data-step': i } }, at);
        const launch = (key: string, times = 2, at: gsap.Position = '>') => {
          const img = iconOf(key).querySelector('.ms-dock__tile')!;
          tl.to(img, { yPercent: -34, duration: 0.24, ease: 'sine.out', yoyo: true, repeat: times * 2 - 1 }, at);
          tl.set(iconOf(key), { attr: { 'data-running': 'true' } }, '<0.3');
        };
        const genie = (win: HTMLElement, R: Box, key: string, d = 0.8, at: gsap.Position = '>') => {
          const g = { v: 0 };
          tl.to(g, { v: 1, duration: d, ease: 'power2.inOut', onUpdate: () => genieDraw(win, R, key, g.v) }, at);
        };
        const blink = (at: gsap.Position = '>') => tl.to(mbEye, { scaleY: 0.12, duration: 0.09, ease: 'power1.in', yoyo: true, repeat: 1 }, at);
        const toPct = (r: { x: number; y: number }) => [(r.x / W) * 100, (r.y / H) * 100] as const;

        // Starting looks for things that tween in.
        gsap.set(mbItem, { opacity: 0, scale: 0.5 });
        gsap.set(islandContent, { opacity: 0 });
        gsap.set(notif, { scale: 0.94, opacity: 0, filter: 'blur(14px)', transformOrigin: '50% 30%' });
        gsap.set(notif2, { opacity: 0, filter: 'blur(10px)' });
        gsap.set(vd, { opacity: 0, filter: 'blur(12px)' });
        gsap.set(gMail, { opacity: 0 });
        gsap.set(souls, { opacity: 0 });
        gsap.set([tabFile, editor, crumbs, toast, ...termOut], { opacity: 0 });
        gsap.set(toast, { y: 14 });
        gsap.set(vdDone, { opacity: 0 });

        // 1. Open Meridius: the notch opens into a Dynamic Island ------------
        hold(0.5);
        step(0);
        const mer = dockCenter('meridius');
        move(mer.x, mer.y, 1.3);
        click();
        launch('meridius', 2);
        tl.set(menubar, { attr: { 'data-app': 'meridius' } }, '<');
        zoom(2.0, 36, 5, 1.0, '<0.15');
        // A breath, then the spring open, as the island does on iPhone.
        tl.to(islandBody, { width: '9.6em', duration: 0.18, ease: 'power2.out' }, '>-0.2');
        tl.to(
          islandBody,
          { width: '24em', height: '7em', borderBottomLeftRadius: '2.3em', borderBottomRightRadius: '2.3em', duration: 0.75, ease: 'back.out(1.25)' },
          '>',
        );
        tl.fromTo(
          islandContent,
          { opacity: 0, scale: 0.4, filter: 'blur(4px)' },
          { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.6, ease: 'back.out(1.1)' },
          '<0.05',
        );
        hold(1.5);
        // Closing: the content shrinks with the island and is the last to go.
        tl.to(
          islandBody,
          { width: '8.6em', height: '3.7em', borderBottomLeftRadius: '0.8em', borderBottomRightRadius: '0.8em', duration: 0.6, ease: 'power3.inOut' },
        );
        tl.to(islandContent, { scale: 0.36, duration: 0.6, ease: 'power3.inOut' }, '<');
        tl.to(islandContent, { opacity: 0, filter: 'blur(3px)', duration: 0.24, ease: 'power2.in' }, '<0.36');
        zoom(2.4, mbAt.x - 4, 5, 0.9, '<-0.1');
        tl.to(mbItem, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, '>-0.35');
        blink('>0.25');
        hold(0.6);
        zoomOut(1.0);

        // 2. Gmail -------------------------------------------------------------
        step(1, '<0.3');
        const gm = dockCenter('gmail');
        move(gm.x, gm.y, 1.1, '<0.2');
        click();
        launch('gmail', 1);
        tl.set(menubar, { attr: { 'data-app': 'gmail' } }, '<');
        genie(gmail, GR, 'gmail', 0.8, '<0.1');
        move(rowAt.x - 6, rowAt.y, 1.0, '>-0.1');
        click();
        tl.to(gList, { opacity: 0, duration: 0.2 }, '>-0.05').to(gMail, { opacity: 1, duration: 0.3 }, '<0.1');
        tl.fromTo(gHl, { backgroundSize: '0% 100%' }, { backgroundSize: '100% 100%', duration: 0.8, ease: 'power2.out' }, '>0.2');
        move(GR.x + GR.w * 0.6, GR.y + GR.h * 0.74, 0.9, '<');
        hold(1.1);

        // 3. Slack -------------------------------------------------------------
        step(2);
        const sl = dockCenter('slack');
        move(sl.x, sl.y, 1.0);
        click();
        launch('slack', 1);
        tl.set(menubar, { attr: { 'data-app': 'slack' } }, '<');
        genie(slack, SR, 'slack', 0.8, '<0.1');
        move(viewAt.x + 3, viewAt.y + 2, 0.9, '>-0.1');
        tl.to(S, { y: scrollBy, duration: 2.3, ease: 'power2.inOut', onUpdate: drawScroll }, '>0.05');
        tl.to(sTarget, { backgroundColor: 'rgba(242, 199, 68, 0.16)', duration: 0.4 }, '>-0.2');
        zoom(2.8, dueAt.x + 4, dueAt.y - 2, 1.1, '>0.1');
        tl.to(
          sDue,
          {
            color: '#e01e5a',
            backgroundColor: 'rgba(224, 30, 90, 0.1)',
            boxShadow: 'inset 0 0 0 0.08em rgba(224, 30, 90, 0.5)',
            scale: 1.06,
            duration: 0.35,
            ease: 'power2.out',
          },
          '>-0.1',
        );
        hold(0.8);
        tl.to(sDue, {
          color: '#1d1c1d',
          backgroundColor: 'rgba(29, 28, 29, 0.05)',
          boxShadow: 'inset 0 0 0 0.08em rgba(29, 28, 29, 0)',
          scale: 1,
          duration: 0.5,
        });
        zoomOut(1.0, '>0.1');

        // 4. Meridius asks: only once the whole screen is back in view ----------
        step(3, '>0.15');
        tl.to(notif, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.85, ease: 'power3.out' }, '>0.25');
        blink('<0.2');
        tl.set(notif, { filter: 'none' }, '>');
        zoom(2.1, notifAt.x, notifAt.y, 1.0, '>0.15');
        hold(2.0);
        zoomOut(0.9);
        tl.addLabel('poster');
        move(startAt.x, startAt.y, 1.0, '<0.2');
        click('>0.05');
        tl.to(notifStart, { filter: 'brightness(0.85)', duration: 0.08, yoyo: true, repeat: 1 }, '<');

        // 5. The card becomes a display, in place -------------------------------
        step(4, '>0.1');
        tl.to(notifInner, { opacity: 0, filter: 'blur(6px)', duration: 0.35, ease: 'power2.in' }, '<0.1');
        tl.to(notif, { height: `${VR.h}em`, borderRadius: '1em', duration: 0.75, ease: 'power3.inOut' }, '<0.1');
        tl.to(vd, { opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out' }, '<0.35');
        tl.to(notif, { opacity: 0, duration: 0.25 }, '>-0.2');
        tl.set(vd, { filter: 'none' });
        move(GR.x + 10, GR.y + GR.h - 4, 1.2, '<-0.4');

        // Faint copies of everything Meridius read, from Gmail and from Slack,
        // drift into the display; each trails two fainter echoes, and the
        // display glows as it takes each one in. Gmail's copies lift off from
        // the part of its window Slack doesn't cover.
        const fromGmail = (el: HTMLElement) => {
          const c = center(pos(el));
          return { x: Math.min(c.x, SR.x - 3), y: c.y };
        };
        const fromSlack = (el: HTMLElement) => {
          const c = center(pos(el));
          return { x: c.x, y: c.y - scrollBy };
        };
        const sources = [
          fromGmail(q('.ms-gmail__mail h4')),
          fromGmail(gHl),
          fromGmail(q('.ms-gmail__from')),
          fromGmail(q('.ms-gmail__push')),
          fromSlack(q('.ms-slack__msg[data-target] p')),
          ...sFiles.map(fromSlack),
          dueAt,
        ];
        const into = center(VS);
        const PEAK = [0.34, 0.16, 0.08];
        tl.addLabel('souls', '<0.1');
        souls.forEach((el) => {
          const i = Number(el.dataset.soul);
          const layer = Number(el.dataset.layer);
          const a = sources[i] ?? sources[0];
          const m = { t: 0 };
          const cx = lerp(a.x, into.x, 0.35);
          const cy = Math.min(a.y, into.y) - 5 + (i % 4) * 0.8;
          const draw = () => {
            const t = clamp(m.t, 0, 1);
            const u = 1 - t;
            const x = u * u * a.x + 2 * u * t * cx + t * t * into.x;
            const y = u * u * a.y + 2 * u * t * cy + t * t * into.y;
            const peak = PEAK[layer];
            const o = t < 0.18 ? (t / 0.18) * peak : t > 0.8 ? ((1 - t) / 0.2) * peak : peak;
            const wobble = Math.sin(t * Math.PI * 2 + i) * 4;
            el.style.transform = `translate(${x}em, ${y}em) translate(-50%, -50%) rotate(${wobble * (1 - t)}deg) scale(${lerp(1, 0.35, t)})`;
            el.style.opacity = o.toFixed(3);
          };
          tl.to(m, { t: 1, duration: 1.8, ease: 'power1.inOut', onUpdate: draw }, `souls+=${i * 0.14 + layer * 0.07}`);
        });
        sources.forEach((_, i) => {
          tl.fromTo(
            vdScreen,
            { boxShadow: '0 0 0 0 rgba(79, 139, 255, 0)' },
            { boxShadow: '0 0 0 0.25em rgba(79, 139, 255, 0.35)', duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out', immediateRender: false },
            `souls+=${i * 0.14 + 1.55}`,
          );
        });
        hold(0.2);

        // 6. Into its own display ---------------------------------------------
        zoom(W / VS.w, VS.x + VS.w / 2, VS.y + VS.h / 2, 1.5);
        const fileAt = toPct(center(pos(exFile, vdScene)));
        const codeAt = pos(code, vdScene);
        const termAt = center(pos(termPanel, vdScene));
        blue.moveTo(tl, fileAt[0] + 2, fileAt[1], 1.0, '>-0.2');
        blue.click(tl);
        tl.set(exFile, { attr: { 'data-on': 'true' } }, '<');
        tl.to([welcome, tabWelcome], { opacity: 0, duration: 0.2 }, '<0.05').to([tabFile, editor, crumbs], { opacity: 1, duration: 0.25 }, '<');
        blue.moveTo(tl, toPct({ x: codeAt.x + 18, y: 0 })[0], toPct({ x: 0, y: codeAt.y + 2 })[1], 0.7);
        blue.click(tl);
        tl.to(T, { n: CODE_LEN, duration: 3.2, ease: 'none', onUpdate: drawCode }, '>0.1');
        blue.moveTo(tl, toPct(termAt)[0] - 6, toPct(termAt)[1], 0.8, '>0.1');
        blue.click(tl);
        tl.to(K, { n: TERM_CMD.length, duration: 0.6, ease: 'none', onUpdate: drawCmd }, '>0.1');
        tl.to(termOut[0], { opacity: 1, duration: 0.15 }, '>0.2').to(termOut[1], { opacity: 1, duration: 0.2 }, '>0.35');
        blue.moveTo(tl, 76, 30, 0.8, '>0.15');
        tl.to(toast, { opacity: 1, y: 0, duration: 0.45, ease: 'expo.out' }, '<0.3');
        hold(1.2);

        // 7. Back out: the display becomes the Review notification, in place ----
        zoomOut(1.4);
        tl.set(vdWorking, { opacity: 0 }, '<0.6').set(vdDone, { opacity: 1 }, '<');
        step(5, '<0.6');
        const N2 = pos(notif2);
        tl.to([vdBar, vdScreen], { opacity: 0, filter: 'blur(6px)', duration: 0.4, ease: 'power2.in' }, '>0.6');
        tl.to(vd, { height: `${N2.h}em`, borderRadius: '1.3em', duration: 0.75, ease: 'power3.inOut' }, '<0.15');
        tl.to(notif2, { opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out' }, '<0.35');
        tl.to(vd, { opacity: 0, duration: 0.25 }, '>-0.2');
        tl.set(notif2, { filter: 'none' });
        blink('<');
        zoom(2.1, notif2At.x, notif2At.y, 1.0, '>0.1');
        hold(1.6);
        zoomOut(0.9);
        hold(0.5);

        // Curtain, then loop.
        tl.to([gmail, slack, notif2], { opacity: 0, filter: 'blur(6px)', duration: 0.7, ease: 'power2.in' });
        tl.to(mbItem, { opacity: 0, scale: 0.5, duration: 0.4 }, '<');
        move(40, 27, 0.9, '<');
        tl.set(menubar, { attr: { 'data-app': 'finder' } }, '<0.3');
        ['meridius', 'gmail', 'slack'].forEach((k) => tl.set(iconOf(k), { attr: { 'data-running': 'false' } }, '<'));
        hold(0.4);

        reset();

        if (reducedMotion()) {
          // A still frame: both windows open, Meridius's question on screen.
          tl.seek('poster').pause();
          drawPtr();
          drawCam();
          drawScroll();
          genieDraw(gmail, GR, 'gmail', 1);
          genieDraw(slack, SR, 'slack', 1);
        }
      }, root);
      syncRef.current();
    };
    const fonts = document.fonts;
    if (!fonts || fonts.status === 'loaded') build();
    else fonts.ready.then(build);

    return () => {
      cancelled = true;
      tlRef.current?.kill();
      tlRef.current = null;
      ctx?.revert();
    };
  }, [magnify]);

  // Play only while on screen, after the hero has settled, and not when paused.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion()) return;
    const sync = () => {
      const tl = tlRef.current;
      if (!tl) return;
      if (visible.current && started.current && !paused) tl.play();
      else tl.pause();
    };
    syncRef.current = sync;
    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting;
      sync();
    });
    io.observe(root);
    const delay = started.current
      ? 0
      : window.setTimeout(() => {
          started.current = true;
          sync();
        }, 1600);
    sync();
    return () => {
      io.disconnect();
      window.clearTimeout(delay);
    };
  }, [paused]);

  return (
    <div ref={rootRef} className="ms">
      <div
        className="ms-mac"
        role="img"
        aria-label="A MacBook: Meridius is opened from the dock and appears in the notch and the menu bar. The user reads an email announcing Assignment 3 and a Slack post with the starter files and a deadline later today. Meridius sends a notification offering to start; the user clicks Start, and Meridius works on the assignment in VS Code inside its own virtual display, then asks for a review before submitting."
      >
        <div className="ms-lid">
          <div className="ms-screen">
            <div ref={camRef} className="ms-cam">
              <div className="ms-wall" aria-hidden="true" />

              {/* Menu bar */}
              <div className="ms-menubar" data-app="finder" aria-hidden="true">
                <span className="ms-menubar__apple">
                  <Glyph name="apple" />
                </span>
                {Object.entries(MENUS).map(([key, items]) => (
                  <span key={key} className={`ms-menus ms-menus--${key}`}>
                    {items.map((m, i) => (i === 0 ? <b key={m}>{m}</b> : <span key={m}>{m}</span>))}
                  </span>
                ))}
                <span className="ms-menubar__right">
                  <span className="ms-mb-meridius">
                    <LogoMark size={14} />
                    <EyeThin />
                  </span>
                  <Glyph name="battery" />
                  <Glyph name="wifi" />
                  <Glyph name="search" />
                  <Glyph name="control" />
                  <Clock />
                </span>
              </div>

              {/* Gmail */}
              <div className="ms-win ms-gmail" aria-hidden="true">
                <div className="ms-gmail__top">
                  <Lights />
                  <Ico name="menu" className="ms-gmail__burger" />
                  <img src="/logos/gmail.svg" alt="" className="ms-gmail__logo" />
                  <span className="ms-gmail__brand">Gmail</span>
                  <span className="ms-gmail__search">
                    <Ico name="search" />
                    <span>Search mail</span>
                    <Ico name="sliders" />
                  </span>
                  <span className="ms-gmail__tools">
                    <Ico name="help" />
                    <Ico name="gear" />
                    <Ico name="grid" />
                    <span className="ms-avatar">H</span>
                  </span>
                </div>
                <div className="ms-gmail__body">
                  <nav className="ms-gmail__nav">
                    <span className="ms-gmail__compose">
                      <Ico name="pencil" />
                      Compose
                    </span>
                    <span data-on>
                      <Ico name="inbox" />
                      Inbox<em>2</em>
                    </span>
                    <span>
                      <Ico name="star" />
                      Starred
                    </span>
                    <span>
                      <Ico name="clock" />
                      Snoozed
                    </span>
                    <span>
                      <Ico name="send" />
                      Sent
                    </span>
                    <span>
                      <Ico name="file" />
                      Drafts<em>1</em>
                    </span>
                    <span>
                      <Ico name="chevR" />
                      More
                    </span>
                  </nav>
                  <div className="ms-gmail__main">
                    <div className="ms-gmail__list">
                      <div className="ms-gmail__bar">
                        <Ico name="box" />
                        <Ico name="refresh" />
                        <Ico name="kebab" />
                        <span className="ms-gmail__count">1–50 of 2,318</span>
                        <Ico name="chevL" />
                        <Ico name="chevR" />
                      </div>
                      <div className="ms-gmail__tabs">
                        <span data-on>
                          <Ico name="inbox" />
                          Primary
                        </span>
                        <span>
                          <Ico name="tag" />
                          Promotions
                        </span>
                        <span>
                          <Ico name="at" />
                          Social
                        </span>
                      </div>
                      {INBOX.map((m, i) => (
                        <div key={m.from} className="ms-gmail__row" data-unread={m.unread ? '' : undefined} data-target={m.target ? '' : undefined}>
                          <Ico name="box" />
                          <Ico name="star" />
                          <b>{m.from}</b>
                          <span className="ms-gmail__line">
                            <strong>{m.subject}</strong> – {m.snippet}
                          </span>
                          <time>{i === 0 ? times.email : times.days[i - 1]}</time>
                        </div>
                      ))}
                    </div>
                    <div className="ms-gmail__mail">
                      <div className="ms-gmail__bar">
                        <Ico name="back" />
                        <Ico name="archive" />
                        <Ico name="trash" />
                        <Ico name="mail" />
                        <Ico name="kebab" />
                      </div>
                      <h4>
                        Assignment 3 is out <span className="ms-label">Inbox</span>
                      </h4>
                      <div className="ms-gmail__from">
                        <span className="ms-gmail__av">PR</span>
                        <span>
                          <b>Prof. Rahman</b> <span className="ms-dim">&lt;rahman@university.edu&gt;</span>
                          <small>to CS 201</small>
                        </span>
                        <time>{times.email}</time>
                      </div>
                      <div className="ms-gmail__text">
                        <p>Hi all,</p>
                        <p>
                          <span className="ms-gmail__hl">Assignment 3 is out: build a URL shortener in Python.</span> The spec and starter files are
                          pinned in #cs-201. <span className="ms-gmail__push">Push your solution with every test passing.</span>
                        </p>
                        <p>
                          Good luck,
                          <br />
                          Prof. Rahman
                        </p>
                      </div>
                      <div className="ms-gmail__actions">
                        <span>
                          <Ico name="reply" />
                          Reply
                        </span>
                        <span>
                          <Ico name="forward" />
                          Forward
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slack (light) */}
              <div className="ms-win ms-slack" aria-hidden="true">
                <div className="ms-slack__top">
                  <Lights />
                  <span className="ms-slack__nav">
                    <Ico name="chevL" />
                    <Ico name="chevR" />
                    <Ico name="clock" />
                  </span>
                  <span className="ms-slack__search">
                    <Ico name="search" />
                    Search CS 201
                  </span>
                  <Ico name="help" className="ms-slack__help" />
                </div>
                <div className="ms-slack__body">
                  <div className="ms-slack__rail">
                    <span className="ms-slack__ws">CS</span>
                    <span data-on>
                      <Ico name="home" />
                      <small>Home</small>
                    </span>
                    <span>
                      <Ico name="dm" />
                      <small>DMs</small>
                    </span>
                    <span>
                      <Ico name="bell" />
                      <small>Activity</small>
                    </span>
                    <span>
                      <Ico name="dots" />
                      <small>More</small>
                    </span>
                  </div>
                  <aside className="ms-slack__side">
                    <b className="ms-slack__wsname">CS 201</b>
                    <span>
                      <Ico name="at" />
                      Threads
                    </span>
                    <span>
                      <Ico name="send" />
                      Drafts &amp; sent
                    </span>
                    <small>Channels</small>
                    <span># general</span>
                    <span data-on># cs-201</span>
                    <span># random</span>
                    <small>Direct messages</small>
                    <span>
                      <i className="ms-slack__mini" style={{ background: '#2bac76' }} />
                      Ayaan
                    </span>
                    <span>
                      <i className="ms-slack__mini" style={{ background: '#e8912d' }} />
                      Nadia
                    </span>
                  </aside>
                  <section className="ms-slack__chan">
                    <header>
                      <b># cs-201</b>
                      <span className="ms-slack__members">
                        <i style={{ background: '#e8912d' }} />
                        <i style={{ background: '#2bac76' }} />
                        <i style={{ background: '#1d9bd1' }} />
                        48
                      </span>
                    </header>
                    <div className="ms-slack__tabs">
                      <span data-on>Messages</span>
                      <span>Files</span>
                      <span>Pins</span>
                    </div>
                    <div className="ms-slack__view">
                      <div className="ms-slack__msgs">
                        {POSTS.map((m, i) => (
                          <div key={i} className="ms-slack__msg">
                            <span className="ms-slack__av" style={{ background: m.c }}>
                              {m.who[0]}
                            </span>
                            <div>
                              <b>{m.who}</b>
                              <time>{times.posts[i]}</time>
                              <p>{m.text}</p>
                              {m.files ? (
                                <div className="ms-slack__files">
                                  {m.files.map(([n, k]) => (
                                    <span key={n} className="ms-slack__file">
                                      <FileGlyph kind={k} />
                                      <span>
                                        {n}
                                        <small>PDF</small>
                                      </span>
                                    </span>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        ))}
                        <div className="ms-slack__msg" data-target>
                          <span className="ms-slack__av" style={{ background: '#1d9bd1' }}>
                            R
                          </span>
                          <div>
                            <b>Rafi (TA)</b>
                            <time>{times.posts[5]}</time>
                            <p>📌 Assignment 3 starter files. All tests in test_shortener.py must pass.</p>
                            <div className="ms-slack__files">
                              {FILES.map(([n, t, k]) => (
                                <span key={n} className="ms-slack__file">
                                  <FileGlyph kind={k} />
                                  <span>
                                    {n}
                                    <small>{t}</small>
                                  </span>
                                </span>
                              ))}
                            </div>
                            <span className="ms-slack__due">
                              ⏰ Due <span data-due-when>{due.when}</span> at <b data-due-time>{due.time}</b>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ms-slack__composer">
                      <span>Message #cs-201</span>
                      <span className="ms-slack__tools">
                        <Ico name="plus" />
                        <Ico name="smile" />
                        <Ico name="at" />
                        <Ico name="send" className="ms-slack__send" />
                      </span>
                    </div>
                  </section>
                </div>
              </div>

              {/* Meridius's own display, where the notification was */}
              <div className="ms-vd" aria-hidden="true">
                <div className="ms-vd__bar">
                  <Lights dim />
                  <span className="ms-vd__title">Meridius · Display 2</span>
                  <span className="ms-vd__states">
                    <span className="ms-vd__state ms-vd__state--working">
                      <i className="ms-vd__pulse" />
                      Working on Assignment 3
                    </span>
                    <span className="ms-vd__state ms-vd__state--done">
                      <CheckIcon />
                      Done · 4/4 tests pass
                    </span>
                  </span>
                </div>
                <div className="ms-vd__screen">
                  <div className="ms-vd__scene">
                    <div className="ms-vd__wall" />
                    <div className="ms-vd__menubar">
                      <span className="ms-menubar__apple">
                        <Glyph name="apple" />
                      </span>
                      <b>Code</b>
                      {['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Window', 'Help'].map((m) => (
                        <span key={m}>{m}</span>
                      ))}
                      <span className="ms-menubar__right">
                        <span>Display 2</span>
                        <Clock />
                      </span>
                    </div>

                    <div className="ms-vs">
                      <div className="ms-vs__title">
                        <Lights />
                        <span className="ms-vs__navarrows">
                          <Ico name="back" />
                        </span>
                        <span className="ms-vs__cmdbar">
                          <Ico name="search" />
                          assignment-3
                        </span>
                      </div>
                      <div className="ms-vs__body">
                        <div className="ms-vs__activity">
                          <Ico name="files" className="is-on" />
                          <Ico name="search" />
                          <Ico name="branch" />
                          <Ico name="run" />
                          <Ico name="ext" />
                        </div>
                        <div className="ms-vs__side">
                          <small>Explorer</small>
                          <b>ASSIGNMENT-3</b>
                          <span className="ms-vs__file" data-kind="dir">
                            <Ico name="chevR" />
                            starter
                          </span>
                          <span className="ms-vs__file">
                            <FileGlyph kind="md" />
                            README.md
                          </span>
                          <span className="ms-vs__file" data-target>
                            <FileGlyph kind="py" />
                            shortener.py
                          </span>
                          <span className="ms-vs__file">
                            <FileGlyph kind="pdf" />
                            spec.pdf
                          </span>
                          <span className="ms-vs__file">
                            <FileGlyph kind="py" />
                            test_shortener.py
                          </span>
                        </div>
                        <div className="ms-vs__main">
                          <div className="ms-vs__tabs">
                            <span className="ms-vs__tab ms-vs__tab--welcome">Welcome</span>
                            <span className="ms-vs__tab ms-vs__tab--file">
                              <FileGlyph kind="py" />
                              shortener.py
                            </span>
                          </div>
                          <div className="ms-vs__crumbs">assignment-3 › shortener.py</div>
                          <div className="ms-vs__pane">
                            <div className="ms-vs__welcome">
                              <img src="/icons/apps/vscode.png" alt="" />
                              <span>Show All Commands ⇧⌘P · Go to File ⌘P</span>
                            </div>
                            <div className="ms-vs__editor">
                              <div className="ms-code__gutter" />
                              <div className="ms-code__text" />
                            </div>
                          </div>
                          <div className="ms-vs__terminal">
                            <div className="ms-vs__ptabs">
                              <span>Problems</span>
                              <span>Output</span>
                              <span>Debug Console</span>
                              <span data-on>Terminal</span>
                              <span>Ports</span>
                            </div>
                            <p>
                              <span className="ms-vs__prompt">assignment-3 %</span> <span className="ms-vs__cmd" />
                            </p>
                            <p className="ms-vs__out">
                              <span className="t-ok">....</span> <span className="ms-vs__dim">[100%]</span>
                            </p>
                            <p className="ms-vs__out">
                              <span className="t-ok">4 passed</span> in 0.08s
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="ms-vs__status">
                        <span className="ms-vs__remote">⌁</span>
                        <span>main</span>
                        <span>⊗ 0 ⚠ 0</span>
                        <span className="ms-vs__status-r">Ln 11, Col 22 · Spaces: 4 · UTF-8 · Python 3.12</span>
                      </div>
                      <div className="ms-vs__toast">
                        <img src="/icons/apps/meridius.png" alt="" />
                        <span>
                          <b>All 4 tests pass.</b> I won’t submit anything until you’ve reviewed it.
                        </span>
                      </div>
                    </div>
                    <Cursor ref={blueRef} x={40} y={62} label="Meridius" />
                  </div>
                </div>
              </div>

              {/* Meridius notifications */}
              <div className="ms-note ms-note--ask" aria-hidden="true">
                <div className="ms-note__inner">
                  <img src="/icons/apps/meridius.png" alt="" className="ms-note__icon" />
                  <div className="ms-note__body">
                    <span className="ms-note__app">
                      Meridius <time>now</time>
                    </span>
                    <b>
                      Assignment 3 is due at <span data-due-time>{due.time}</span>
                    </b>
                    <p>
                      <span data-due-left>{due.left}</span> · brief from Gmail, 3 files from #cs-201
                    </p>
                    <p className="ms-note__ask">Start it in my own display?</p>
                    <div className="ms-note__actions">
                      <span className="ms-note__btn ms-note__btn--primary">Start</span>
                      <span className="ms-note__btn">Later</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ms-note ms-note--done" aria-hidden="true">
                <div className="ms-note__inner">
                  <img src="/icons/apps/meridius.png" alt="" className="ms-note__icon" />
                  <div className="ms-note__body">
                    <span className="ms-note__app">
                      Meridius <time>now</time>
                    </span>
                    <b>Assignment 3 is ready for review</b>
                    <p>4/4 tests pass · nothing submitted yet</p>
                    <p className="ms-note__ask">
                      Review before <span data-due-time>{due.time}</span>?
                    </p>
                    <div className="ms-note__actions">
                      <span className="ms-note__btn ms-note__btn--primary">Review</span>
                      <span className="ms-note__btn">Later</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Everything Meridius read, as faint copies, each with two echoes */}
              {[
                <>
                  <img src="/logos/gmail.svg" alt="" />
                  Assignment 3 is out
                </>,
                <>
                  <img src="/logos/gmail.svg" alt="" />
                  Build a URL shortener in Python
                </>,
                <>
                  <img src="/logos/gmail.svg" alt="" />
                  Prof. Rahman · CS 201
                </>,
                <>
                  <img src="/logos/gmail.svg" alt="" />
                  Push with every test passing
                </>,
                <>
                  <img src="/logos/slack.svg" alt="" />
                  All tests in test_shortener.py must pass
                </>,
                ...FILES.map(([n, , k]) => (
                  <>
                    <FileGlyph kind={k} />
                    {n}
                  </>
                )),
                <>
                  <img src="/logos/slack.svg" alt="" />
                  Due <span data-due-when>{due.when}</span> at <span data-due-time>{due.time}</span>
                </>,
              ].flatMap((content, i) =>
                [0, 1, 2].map((layer) => (
                  <span key={`${i}-${layer}`} className="ms-soul" data-soul={i} data-layer={layer} aria-hidden="true">
                    {content}
                  </span>
                )),
              )}

              {/* Dock */}
              <div className="ms-dock" onPointerMove={onDockMove} onPointerLeave={onDockLeave} aria-hidden="true">
                <span ref={shelfRef} className="ms-dock__shelf" style={{ left: `${BASE_START - PAD}em`, width: `${BASE.total + PAD * 2}em` }} />
                {DOCK.map((d, i) => (
                  <span
                    key={d.key}
                    ref={(el) => {
                      dockRefs.current[i] = el;
                    }}
                    className={d.key === 'sep' ? 'ms-dock__sep' : 'ms-dock__icon'}
                    data-running={d.key === 'finder' ? 'true' : 'false'}
                    style={{ left: `${BASE_START + BASE.lefts[i]}em`, ...(d.key === 'sep' ? {} : { width: `${ICON}em`, height: `${ICON}em` }) }}
                  >
                    {d.key === 'sep' ? null : (
                      <>
                        <span className="ms-dock__label">{d.label}</span>
                        <img className="ms-dock__tile" src={d.src} alt="" draggable={false} />
                        <i className="ms-dock__dot" />
                      </>
                    )}
                  </span>
                ))}
              </div>

              {/* The notch, which becomes a Dynamic Island when Meridius starts */}
              <div className="ms-island" aria-hidden="true">
                <span className="ms-island__body" />
                <span className="ms-island__cam" />
                <div className="ms-island__content">
                  <img src="/icons/apps/meridius.png" alt="" />
                  <span>
                    <b>Meridius is on</b>
                    <small>Noticing what matters to you</small>
                  </span>
                  <EyeThin />
                </div>
              </div>

              <MacPointer />
            </div>
          </div>
        </div>
        <div className="ms-base" aria-hidden="true" />
      </div>

      <div className="ms-foot">
        <ol className="ms-steps" data-step="0" aria-hidden="true">
          {STEPS.map((s) => (
            <li key={s}>
              <i />
              <span>{s}</span>
            </li>
          ))}
        </ol>
        {reducedMotion() ? null : (
          <button
            type="button"
            className="ms-pause"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            aria-label={paused ? 'Play the animation' : 'Pause the animation'}
          >
            {paused ? (
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M5 3.5v9l7.5-4.5z" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <rect x="4" y="3.5" width="2.6" height="9" rx="0.8" fill="currentColor" />
                <rect x="9.4" y="3.5" width="2.6" height="9" rx="0.8" fill="currentColor" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
});

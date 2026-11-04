import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { LogoMark } from '../brand/LogoMark';
import { CheckIcon, DocIcon } from './icons';
import { Cursor, type CursorHandle } from './Cursor';
import { gsap } from '../motion';
import { APPS, AppMark, type AppId } from './apps';

const RECEIPTS = ['Pathao · BDT 240', 'Figma · $15.00', 'Star Kabab · BDT 860'];

/**
 * The floating mirror of Meridius's own display: its cursor ticks off
 * receipts one by one, on a loop, while the visitor's screen stays still.
 */
function MirrorLoop() {
  const [done, setDone] = useState(0);
  const cursor = useRef<CursorHandle>(null);
  const box = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const c = cursor.current!;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDone(RECEIPTS.length);
      return;
    }
    const tl = gsap.timeline({ repeat: -1, paused: true, delay: 2.4 });
    tl.call(() => setDone(0), [], 0);
    c.set(40, 92);
    tl.set(c.el, { left: '40%', top: '92%' }, 0);
    tl.to({}, { duration: 0.4 });
    RECEIPTS.forEach((_, i) => {
      c.moveTo(tl, 90, 19 + i * 31, 0.75);
      c.click(tl);
      tl.call(() => setDone(i + 1));
      tl.to({}, { duration: 0.3 });
    });
    c.moveTo(tl, 40, 92, 0.8);
    tl.to({}, { duration: 1.6 });
    tlRef.current = tl;
    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? tlRef.current?.play() : tlRef.current?.pause()));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} className="m-mirror__screen">
      {RECEIPTS.map((r, i) => (
        <div key={r} className="m-mirror__row" data-on={done > i}>
          <span>{r}</span>
          <i>{done > i ? <CheckIcon /> : null}</i>
        </div>
      ))}
      <Cursor ref={cursor} x={40} y={92} />
    </div>
  );
}

/** Tiny menu-bar glyphs, drawn to match macOS's status items. */
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
          <path fill="currentColor" d="M8 2.4c2.3 0 4.4.9 6 2.4l1.2-1.3A10.3 10.3 0 0 0 8 .6C5.2.6 2.7 1.7.8 3.5L2 4.8a8.5 8.5 0 0 1 6-2.4Zm0 3.5c1.3 0 2.5.5 3.5 1.4l1.2-1.3A7 7 0 0 0 8 4.1C6.2 4.1 4.6 4.8 3.3 6l1.2 1.3c1-.9 2.2-1.4 3.5-1.4Zm0 3.4c-.6 0-1.1.2-1.5.6L8 11.5l1.5-1.6c-.4-.4-.9-.6-1.5-.6Z" />
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

const INBOX = [
  { from: 'Dr. Rahman', subject: 'Problem Set 4', snippet: 'Please submit one PDF by Friday…', time: '8:30 AM', unread: true, on: true },
  { from: 'Ayaan', subject: 'Logo files', snippet: 'I’ll send them Monday, promise', time: 'Yesterday', unread: true },
  { from: 'Google Calendar', subject: 'Design review moved', snippet: 'Now Thursday at 2:00 PM', time: 'Yesterday' },
  { from: 'Course site', subject: 'Grades posted', snippet: 'Problem Set 3 grades are live', time: 'Mon' },
  { from: 'Mum', subject: 'Flight on the 21st', snippet: 'Did you book it yet?', time: 'Mon' },
];

const DOCK: { id: AppId; running?: boolean }[] = [
  { id: 'finder', running: true },
  { id: 'chrome', running: true },
  { id: 'slack', running: true },
  { id: 'notion' },
  { id: 'figma' },
  { id: 'calendar' },
  { id: 'docs' },
];

/**
 * The hero's product shot: a Mac desktop, drawn in HTML so it stays sharp.
 * Gmail is open in Chrome; Meridius has noticed the deadline in the email,
 * gathered the files and is offering to start, while in its own display (the
 * small window, bottom right) it files receipts. Every size is in em and
 * scales with the stage.
 */
export const Desktop = forwardRef<HTMLDivElement>(function Desktop(_, ref) {
  return (
    <div
      ref={ref}
      className="m-desk"
      role="img"
      aria-label="Meridius on a Mac: Gmail is open in Chrome, and Meridius has noticed that Problem Set 4 is due Friday at 11:59 PM, gathered the brief, lecture notes and draft, and offers to start the outline, while it files receipts in its own display in the corner."
    >
      <div className="m-desk__stage" aria-hidden="true">
        <div className="mac-menubar">
          <span className="mac-menubar__apple">
            <Glyph name="apple" />
          </span>
          <b>Chrome</b>
          {['File', 'Edit', 'View', 'History', 'Bookmarks', 'Profiles', 'Tab', 'Window', 'Help'].map((m, i) => (
            <span key={m} className={i > 4 ? 'mac-menubar__more' : undefined}>
              {m}
            </span>
          ))}
          <span className="mac-menubar__right">
            <span className="mac-menubar__meridius">
              <LogoMark size={13} />
            </span>
            <Glyph name="battery" />
            <Glyph name="wifi" />
            <Glyph name="search" />
            <Glyph name="control" />
            <span>Thu Nov 6&nbsp;&nbsp;4:12 PM</span>
          </span>
        </div>

        <div className="mac-win mac-chrome">
          <div className="mac-chrome__tabs">
            <span className="mac-lights">
              <i />
              <i />
              <i />
            </span>
            <span className="mac-tab" data-on>
              <AppMark id="gmail" size={12} />
              Inbox (2) – Gmail
            </span>
            <span className="mac-tab">
              <AppMark id="docs" size={12} />
              CS 201 · Course doc
            </span>
            <span className="mac-tab mac-tab--new">+</span>
          </div>
          <div className="mac-chrome__bar">
            <span className="mac-nav">
              <svg viewBox="0 0 12 12">
                <path d="M7.5 2.5 4 6l3.5 3.5" />
              </svg>
              <svg viewBox="0 0 12 12" style={{ opacity: 0.35 }}>
                <path d="M4.5 2.5 8 6 4.5 9.5" />
              </svg>
              <svg viewBox="0 0 12 12">
                <path d="M9.6 6.2a3.6 3.6 0 1 1-1.1-2.6M9.6 2.4v1.9H7.7" />
              </svg>
            </span>
            <span className="mac-omni">
              <svg viewBox="0 0 10 12">
                <rect x="1.5" y="5" width="7" height="5.5" rx="1.2" />
                <path d="M3 5V3.6a2 2 0 0 1 4 0V5" fill="none" />
              </svg>
              mail.google.com/mail/u/0/#inbox
            </span>
            <span className="mac-avatar">H</span>
          </div>
          <div className="mac-gmail">
            <div className="mac-gmail__list">
              {INBOX.map((m) => (
                <div key={m.from} className="mac-gmail__row" data-on={m.on ? '' : undefined} data-unread={m.unread ? '' : undefined}>
                  <span className="mac-gmail__from">
                    {m.from}
                    <time>{m.time}</time>
                  </span>
                  <span className="mac-gmail__subject">{m.subject}</span>
                  <span className="mac-gmail__snippet">{m.snippet}</span>
                </div>
              ))}
            </div>
            <div className="mac-gmail__read">
              <h4>
                Problem Set 4 <span className="mac-label">Inbox</span>
              </h4>
              <div className="mac-gmail__sender">
                <span className="mac-gmail__avatar">DR</span>
                <span>
                  <b>Dr. Rahman</b> &lt;rahman@university.edu&gt;
                  <small>to CS 201 · Tue, 8:30 AM</small>
                </span>
              </div>
              <p>Hi all,</p>
              <p>
                Problem Set 4 covers sorting and recursion. Please submit{' '}
                <span className="m-mark-hl" data-hl>
                  one PDF by Friday at 11:59 PM
                </span>
                . Problems 1 to 3 are required; 4 is optional.
              </p>
              <p>Office hours move to Thursday this week.</p>
            </div>
          </div>
        </div>

        <div className="m-panel" style={{ left: '38.5em', top: '8.6em', width: '25.5em' }} data-pop>
          <span className="m-panel__tag">
            <LogoMark size={12} />
            Meridius
            <span className="m-panel__when">now</span>
          </span>
          <p className="m-panel__title">Problem Set 4 is due Friday at 11:59 PM</p>
          <p className="m-panel__text">Also mentioned in #cs-201 and the course doc. I gathered what you’ll need:</p>
          <div className="m-panel__chips">
            <span className="m-chip">
              <DocIcon />
              Course brief
            </span>
            <span className="m-chip">
              <DocIcon />
              Lecture 9 notes
            </span>
            <span className="m-chip">
              <DocIcon />
              Your draft
            </span>
          </div>
          <div className="m-panel__actions">
            <span className="m-mini-btn m-mini-btn--blue">Start the outline</span>
            <span className="m-mini-btn">Remind me Thursday</span>
            <span className="m-kbd">⌘ ↵</span>
          </div>
        </div>

        <div className="m-mirror" style={{ right: '2em', bottom: '6.2em' }} data-pop>
          <div className="m-mirror__head">
            <span className="mac-lights mac-lights--dim">
              <i />
              <i />
              <i />
            </span>
            <b>Meridius · its own display</b>
          </div>
          <MirrorLoop />
          <div className="m-mirror__foot">Filing November receipts</div>
        </div>

        <div className="mac-dock">
          {DOCK.map(({ id, running }) => (
            <span key={id} className="mac-dock__app" data-full={APPS[id].full ? '' : undefined} data-running={running ? '' : undefined}>
              <AppMark id={id} size={APPS[id].full ? 44 : 26} />
            </span>
          ))}
          <span className="mac-dock__sep" />
          <span className="mac-dock__app" data-full="" data-running="">
            <img src="/icons/app-icon-256.png" alt="" width={44} height={44} draggable={false} />
          </span>
        </div>
      </div>
    </div>
  );
});

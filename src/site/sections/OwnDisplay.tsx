import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { display } from '../content';
import { LogoMark } from '../brand/LogoMark';
import { Cursor, type CursorHandle } from '../ui/Cursor';
import { gsap } from '../motion';
import { reducedMotion } from '../demos/useDemo';

const ROWS = [
  { date: 'Nov 2', merchant: 'Pathao', amount: 'BDT 240', cat: 'Travel' },
  { date: 'Nov 3', merchant: 'Figma', amount: '$15.00', cat: 'Software' },
  { date: 'Nov 3', merchant: 'Star Kabab', amount: 'BDT 860', cat: 'Meals' },
  { date: 'Nov 4', merchant: 'Notion', amount: '$10.00', cat: 'Software' },
];

/**
 * Two screens side by side. The visitor's side is a real text area; on the
 * other side Meridius files expenses with its own cursor, in a loop, without
 * ever touching the visitor's side.
 */
export function OwnDisplay() {
  const [note, setNote] = useState(display.you);
  const [filled, setFilled] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const cursor = useRef<CursorHandle>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useLayoutEffect(() => {
    const c = cursor.current!;
    if (reducedMotion()) {
      setFilled(ROWS.length);
      return;
    }
    const tl = gsap.timeline({ repeat: -1, paused: true });
    // The sheet is five rows of equal height (header + 4); each target is
    // the middle of a row's Category cell, as a percentage of the sheet.
    const rowY = (i: number) => 30 + i * 20;
    tl.call(() => setFilled(0), [], 0);
    c.set(52, 12);
    tl.set(c.el, { left: '52%', top: '12%' }, 0);
    tl.to({}, { duration: 0.6 });
    ROWS.forEach((_, i) => {
      c.moveTo(tl, 86, rowY(i), 0.8);
      c.click(tl);
      tl.call(() => setFilled(i + 1));
      tl.to({}, { duration: 0.35 });
    });
    c.moveTo(tl, 52, 12, 0.9);
    tl.to({}, { duration: 2.2 });
    tlRef.current = tl;
    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (inView && !paused) tl.play();
    else tl.pause();
  }, [inView, paused]);

  return (
    <section ref={sectionRef} id="display" className="m-section m-wrap" data-section aria-labelledby="display-title">
      <div className="m-head">
        <h2 id="display-title" className="m-h2" data-reveal>
          {display.heading[0]} <span className="m-soft">{display.heading[1]}</span>
        </h2>
        <p className="m-lead" data-reveal>
          {display.sentence}
        </p>
      </div>

      <div className="m-dual" data-reveal>
        <div className="m-dual__side">
          <span className="m-dual__label">Your screen</span>
          <div className="m-dual__win">
            <div className="d-win__bar">
              <i />
              <i />
              <i />
              <span>Notes</span>
            </div>
            <label htmlFor="your-note" className="m-sr">
              Your notes. Type here while Meridius works.
            </label>
            <textarea id="your-note" className="m-dual__note" value={note} onChange={(e) => setNote(e.target.value)} spellCheck={false} />
          </div>
          <p className="m-dual__hint">Your cursor, your keyboard, your focus.</p>
        </div>

        <div className="m-dual__side m-dual__side--it">
          <span className="m-dual__label m-dual__label--it">
            <LogoMark size={12} />
            Meridius’s display
          </span>
          <div className="m-dual__win m-dual__win--it">
            <div className="d-win__bar">
              <i />
              <i />
              <i />
              <span>Expenses · November</span>
            </div>
            <div className="m-sheet" aria-label="Meridius filling in the category for four expenses" role="img">
              <div className="m-sheet__row m-sheet__row--head" aria-hidden="true">
                <span>Date</span>
                <span>Merchant</span>
                <span>Amount</span>
                <span>Category</span>
              </div>
              {ROWS.map((r, i) => (
                <div key={r.merchant + i} className="m-sheet__row" data-on={filled > i} aria-hidden="true">
                  <span>{r.date}</span>
                  <span>{r.merchant}</span>
                  <span>{r.amount}</span>
                  <span className="m-sheet__cat">{filled > i ? r.cat : ''}</span>
                </div>
              ))}
              <Cursor ref={cursor} x={52} y={12} />
            </div>
          </div>
          <div className="m-dual__ctrl">
            <span className="m-dual__status" data-paused={paused}>
              {paused ? 'Paused' : `Filing receipts · ${Math.min(filled, ROWS.length)} of ${ROWS.length}`}
            </span>
            <button type="button" className="m-btn m-btn--sm m-btn--ghost" onClick={() => setPaused((p) => !p)}>
              {paused ? 'Resume' : 'Pause Meridius'}
            </button>
          </div>
        </div>
      </div>

      <div className="m-points">
        {display.points.map((p) => (
          <p key={p.lead} data-reveal>
            <b>{p.lead}</b> {p.body}
          </p>
        ))}
      </div>
    </section>
  );
}

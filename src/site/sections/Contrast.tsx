import { useCallback, useEffect, useRef, useState } from 'react';
import { contrast } from '../content';
import { AppMark } from '../ui/apps';
import { LogoMark } from '../brand/LogoMark';
import { CheckIcon, DocIcon } from '../ui/icons';
import { reducedMotion } from '../demos/useDemo';

const PROMPT = contrast.chat.prompt;
const TYPE_MS = 18;

/**
 * Chapter one, the hook: the same need met two ways, side by side. On the
 * left the visitor watches a chat box being fed (typing, pasting, waiting);
 * on the right Meridius has already put the answer on screen. Nothing names a
 * competitor; the contrast does the work.
 */
export function Contrast() {
  const root = useRef<HTMLElement>(null);
  const timers = useRef<number[]>([]);
  const [typed, setTyped] = useState(0);
  const [pasted, setPasted] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const [shown, setShown] = useState(false);
  const [choice, setChoice] = useState<'none' | 'start' | 'later'>('none');
  const played = useRef(false);

  const clear = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };

  const play = useCallback(() => {
    clear();
    setChoice('none');
    if (reducedMotion()) {
      setTyped(PROMPT.length);
      setPasted(contrast.chat.pasted.length);
      setWaiting(true);
      setShown(true);
      return;
    }
    setTyped(0);
    setPasted(0);
    setWaiting(false);
    setShown(false);
    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
    // Meridius is already there; the chat box is still being fed.
    at(500, () => setShown(true));
    for (let i = 1; i <= PROMPT.length; i += 2) at(700 + i * TYPE_MS, () => setTyped(Math.min(i + 1, PROMPT.length)));
    const typedAt = 700 + PROMPT.length * TYPE_MS;
    contrast.chat.pasted.forEach((_, i) => at(typedAt + 350 + i * 450, () => setPasted(i + 1)));
    at(typedAt + 350 + contrast.chat.pasted.length * 450 + 300, () => setWaiting(true));
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !played.current) {
          played.current = true;
          play();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clear();
    };
  }, [play]);

  return (
    <section ref={root} id="why" className="m-section m-wrap" data-section aria-labelledby="why-title">
      <div className="m-head">
        <h2 id="why-title" className="m-h2" data-reveal="words">
          {contrast.heading[0]} <span className="m-soft">{contrast.heading[1]}</span>
        </h2>
        <p className="m-lead" data-reveal>
          {contrast.sentence}
        </p>
      </div>

      <div className="x-duo">
        {/* A chat box: you do the remembering. */}
        <article className="x-card x-card--plain" data-reveal="pop">
          <header className="x-card__head">
            <svg className="x-chat-icon" viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M3.2 2.5h9.6a1.7 1.7 0 0 1 1.7 1.7v5.6a1.7 1.7 0 0 1-1.7 1.7H7.4l-3 2.4v-2.4H3.2a1.7 1.7 0 0 1-1.7-1.7V4.2a1.7 1.7 0 0 1 1.7-1.7Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
            {contrast.chat.name}
          </header>
          <div className="x-chat" aria-hidden="true">
            <div className="x-chat__files">
              {contrast.chat.pasted.map((f, i) => (
                <span key={f} className="x-file" data-on={pasted > i}>
                  <DocIcon />
                  {f}
                </span>
              ))}
            </div>
            <p className="x-chat__prompt">
              {PROMPT.slice(0, typed)}
              {typed < PROMPT.length ? <span className="d-caret" /> : null}
            </p>
            <div className="x-chat__bar">
              <span className="x-chat__wait" data-on={waiting}>
                <i />
                <i />
                <i />
              </span>
              <span className="x-send" data-on={typed >= PROMPT.length} aria-hidden="true">
                <svg viewBox="0 0 16 16">
                  <path d="M8 12.5V3.8M4.2 7.4 8 3.6l3.8 3.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </div>
          <p className="x-card__caption">{contrast.chat.caption}</p>
        </article>

        {/* Meridius: it already saw it. */}
        <article className="x-card x-card--blue" data-reveal="pop">
          <header className="x-card__head">
            <LogoMark size={14} />
            {contrast.meridius.name}
          </header>
          <div className="x-note" data-on={shown}>
            <span className="x-note__tag">
              <LogoMark size={11} />
              Noticed this morning
            </span>
            <p className="x-note__title">{contrast.meridius.title}</p>
            <p className="x-note__body">{contrast.meridius.body}</p>
            <div className="x-note__src">
              <span>
                <AppMark id="gmail" size={14} />
                Mail
              </span>
              <span>
                <AppMark id="slack" size={14} />
                #cs-201
              </span>
              <span>
                <AppMark id="docs" size={14} />
                Course doc
              </span>
            </div>
            <div className="x-note__actions" role="group" aria-label="What should Meridius do?">
              {choice === 'none' ? (
                <>
                  <button type="button" className="x-btn x-btn--blue" onClick={() => setChoice('start')}>
                    Start the outline
                  </button>
                  <button type="button" className="x-btn" onClick={() => setChoice('later')}>
                    Remind me Thursday
                  </button>
                </>
              ) : (
                <span className="x-done" role="status">
                  <CheckIcon />
                  {choice === 'start' ? 'Outline started in its own display' : 'Reminder set for Thursday, 9:00 AM'}
                </span>
              )}
            </div>
          </div>
          <p className="x-card__caption">{contrast.meridius.caption}</p>
        </article>
      </div>

      <div className="x-replay" data-reveal>
        <button type="button" className="m-pillbtn" onClick={play}>
          Replay
        </button>
      </div>
    </section>
  );
}

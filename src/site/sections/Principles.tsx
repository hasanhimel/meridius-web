import { useEffect, useRef, useState } from 'react';
import { principles } from '../content';
import { APPS, AppMark, type AppId } from '../ui/apps';
import { LogoMark } from '../brand/LogoMark';
import { CheckIcon, DocIcon } from '../ui/icons';
import { reducedMotion } from '../demos/useDemo';

const GRID: AppId[] = ['gmail', 'slack', 'notion', 'figma', 'docs', 'calendar', 'drive', 'chrome'];

/** Every app it can see: hover one to see how Meridius knows about it. */
function Apps() {
  const [hover, setHover] = useState<AppId | null>(null);
  return (
    <div className="p-apps">
      <ul className="p-apps__grid">
        {GRID.map((id) => (
          <li key={id} onPointerEnter={() => setHover(id)} onPointerLeave={() => setHover(null)} onFocus={() => setHover(id)} tabIndex={0}>
            <AppMark id={id} size={26} />
            <span className="m-sr">{APPS[id].name}</span>
          </li>
        ))}
        <li className="p-apps__more" aria-label="Any other app on your screen">
          +
        </li>
      </ul>
      <p className="p-apps__note" aria-live="polite">
        {hover ? (
          <>
            <b>{APPS[hover].name}</b> · read from your screen, confirmed by its connector
          </>
        ) : (
          'Hover or tap an app. Anything else on screen counts too.'
        )}
      </p>
      <span className="p-apps__scan" aria-hidden="true" />
    </div>
  );
}

/** Nothing leaves without a yes: approve, and watch it finish and check. */
function Approve() {
  const [phase, setPhase] = useState<'ask' | 'working' | 'done' | 'held'>('ask');
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const approve = () => {
    if (reducedMotion()) return setPhase('done');
    setPhase('working');
    timer.current = window.setTimeout(() => setPhase('done'), 1400);
  };
  return (
    <div className="p-ask" data-phase={phase}>
      <div className="p-ask__card">
        <span className="p-ask__tag">
          <LogoMark size={11} />
          Ready to submit
        </span>
        <p className="p-ask__title">Submit PS4.pdf to the course site?</p>
        <span className="p-ask__file">
          <DocIcon />
          PS4-final.pdf · 4 pages
        </span>
        {phase === 'ask' ? (
          <div className="p-ask__actions">
            <button type="button" className="x-btn x-btn--blue" onClick={approve}>
              Approve
            </button>
            <button type="button" className="x-btn" onClick={() => setPhase('held')}>
              Not yet
            </button>
          </div>
        ) : (
          <p className="p-ask__state" role="status">
            {phase === 'working' && (
              <>
                <span className="p-spin" /> Submitting…
              </>
            )}
            {phase === 'done' && (
              <>
                <CheckIcon /> Submitted · receipt saved
              </>
            )}
            {phase === 'held' && 'Held. I’ll ask again tonight.'}
            <button type="button" className="p-ask__reset" onClick={() => setPhase('ask')}>
              Reset
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

const SPOKEN = 'Remind me to send Ayaan the deck after this call.';

/** Tap to talk: the waveform listens, the words land, a reminder appears. */
function Voice() {
  const [phase, setPhase] = useState<'idle' | 'listening' | 'done'>('idle');
  const [typed, setTyped] = useState('');
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const talk = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    if (reducedMotion()) {
      setTyped(SPOKEN);
      setPhase('done');
      return;
    }
    setPhase('listening');
    setTyped('');
    const words = SPOKEN.split(' ');
    words.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setTyped(words.slice(0, i + 1).join(' ')), 300 + i * 190));
    });
    timers.current.push(window.setTimeout(() => setPhase('done'), 300 + words.length * 190 + 400));
  };

  return (
    <div className="c-voice">
      <p className="c-voice__said" data-on={typed.length > 0}>
        {typed || 'Tap and say what you need.'}
      </p>
      <button type="button" className="c-mic" data-phase={phase} onClick={talk} aria-label={phase === 'listening' ? 'Listening' : 'Tap to talk'}>
        <span className="c-mic__wave" aria-hidden="true">
          {Array.from({ length: 5 }, (_, i) => (
            <i key={i} style={{ animationDelay: `${i * 0.12}s` }} />
          ))}
        </span>
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <rect x="7" y="2.5" width="6" height="10" rx="3" />
          <path d="M4.5 9.5a5.5 5.5 0 0 0 11 0M10 15v2.5" />
        </svg>
      </button>
      <div className="c-reminder" data-on={phase === 'done'}>
        <LogoMark size={12} />
        <span>
          <b>Send Ayaan the deck</b>
          <small>When “Weekly sync” ends</small>
        </span>
        <CheckIcon />
      </div>
    </div>
  );
}

const MODELS = [
  { id: 'local', name: 'Gemma', where: 'On this Mac · free', local: true },
  { id: 'claude', name: 'Claude', where: 'Hosted', local: false },
  { id: 'gpt', name: 'GPT', where: 'Hosted', local: false },
  { id: 'gemini', name: 'Gemini', where: 'Hosted', local: false },
];

/** Pick the model; the note says what leaves the Mac. */
function Models() {
  const [model, setModel] = useState('local');
  const local = MODELS.find((m) => m.id === model)!.local;
  return (
    <div className="c-models">
      <div className="c-models__list" role="radiogroup" aria-label="Model">
        {MODELS.map((m) => (
          <button key={m.id} type="button" role="radio" aria-checked={model === m.id} onClick={() => setModel(m.id)}>
            <span className="c-radio" />
            <b>{m.name}</b>
            <small>{m.where}</small>
          </button>
        ))}
      </div>
      <p className="c-models__note" data-local={local}>
        {local ? 'Nothing leaves your Mac.' : 'Only the pieces this task needs are sent.'}
      </p>
    </div>
  );
}


/**
 * Chapter four, a bento of four small, working pieces: what makes Meridius
 * easy to live with, each shown rather than claimed.
 */
export function Principles() {
  const cards = [
    { key: 'apps', copy: principles.apps, Art: Apps, wide: true },
    { key: 'approve', copy: principles.approve, Art: Approve, wide: false },
    { key: 'voice', copy: principles.voice, Art: Voice, wide: false },
    { key: 'models', copy: principles.models, Art: Models, wide: true },
  ];
  return (
    <section id="principles" className="m-section m-wrap" data-section aria-labelledby="principles-title">
      <div className="m-head">
        <h2 id="principles-title" className="m-h2" data-reveal="words">
          {principles.heading[0]} <span className="m-soft">{principles.heading[1]}</span>
        </h2>
        <p className="m-lead" data-reveal>
          {principles.sentence}
        </p>
      </div>
      <div className="p-bento">
        {cards.map(({ key, copy, Art, wide }) => (
          <article key={key} className={`p-card${wide ? ' p-card--wide' : ''}`} data-reveal="pop">
            <div className="p-card__art">
              <Art />
            </div>
            <h3>{copy.lead}</h3>
            <p>{copy.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

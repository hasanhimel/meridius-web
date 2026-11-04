import { useEffect, useRef, useState } from 'react';
import { companion } from '../content';
import { APPS, AppMark, type AppId } from '../ui/apps';
import { LogoMark } from '../brand/LogoMark';
import { CheckIcon } from '../ui/icons';
import { reducedMotion } from '../demos/useDemo';

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

/** The same answer as a wall of chat, or as an interface. */
function Interfaces() {
  const [mode, setMode] = useState<'chat' | 'ui'>('ui');
  return (
    <div className="c-ui">
      <div className="c-seg" role="group" aria-label="Answer style">
        <button type="button" aria-pressed={mode === 'chat'} onClick={() => setMode('chat')}>
          Chat
        </button>
        <button type="button" aria-pressed={mode === 'ui'} onClick={() => setMode('ui')}>
          Meridius
        </button>
      </div>
      {mode === 'chat' ? (
        <div className="c-chat" key="chat">
          <p>Sure! Here’s a plan for your Friday. First, you might want to start the morning by reviewing Problem Set 4, since it’s due at 11:59 PM. After that, consider replying to Ayaan about the logo files. Around lunchtime, it may be a good idea to…</p>
          <p className="c-chat__fade">…and finally, don’t forget the flight on the 21st, which you could book in the evening once you…</p>
        </div>
      ) : (
        <div className="c-plan" key="ui">
          <b>Your Friday</b>
          {[
            ['9:00', 'Finish Problem Set 4', true],
            ['12:30', 'Reply to Ayaan', true],
            ['17:00', 'Book flight for the 21st', false],
          ].map(([t, label, done]) => (
            <span key={label as string} className="c-plan__row" data-done={done}>
              <time>{t}</time>
              {label}
              <i>{done ? <CheckIcon /> : null}</i>
            </span>
          ))}
        </div>
      )}
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

const ART = [Voice, Interfaces, Models];
const ROW: AppId[] = ['gmail', 'slack', 'notion', 'drive', 'calendar', 'docs'];

export function Companion() {
  return (
    <section id="companion" className="m-section m-wrap" data-section aria-labelledby="companion-title">
      <div className="m-head">
        <h2 id="companion-title" className="m-h2" data-reveal>
          {companion.heading[0]} <span className="m-soft">{companion.heading[1]}</span>
        </h2>
        <p className="m-lead" data-reveal>
          {companion.sentence}
        </p>
      </div>

      <div className="m-trio">
        {companion.cards.map((c, i) => {
          const Art = ART[i];
          return (
            <article key={c.lead} className="m-tile" data-reveal>
              <div className="m-tile__art">
                <Art />
              </div>
              <p>
                <b>{c.lead}</b> {c.body}
              </p>
            </article>
          );
        })}
      </div>

      <div className="m-apps" data-reveal>
        <p className="m-apps__label">{companion.apps}</p>
        <ul className="m-apps__row">
          {ROW.map((id) => (
            <li key={id}>
              <AppMark id={id} size={20} />
              {APPS[id].name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

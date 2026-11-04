import { useEffect, useState } from 'react';
import { recall } from '../content';
import { SearchIcon, SparkIcon } from '../ui/icons';

/**
 * The page's one interactive moment: pick a question and Meridius answers it
 * from the timeline. The question types itself in, then the answer fades up.
 */
export function Recall() {
  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState(recall.questions[0].q);
  const [busy, setBusy] = useState(false);
  const item = recall.questions[active];

  useEffect(() => {
    const full = recall.questions[active].q;
    if (typed === full) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(full);
      setBusy(false);
      return;
    }
    let i = 0;
    setTyped('');
    const id = window.setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) {
        window.clearInterval(id);
        window.setTimeout(() => setBusy(false), 160);
      }
    }, 22);
    return () => window.clearInterval(id);
  }, [active]);

  const choose = (i: number) => {
    if (i === active) return;
    setBusy(true);
    setActive(i);
  };

  return (
    <section id="recall" className="m-section m-wrap" data-section aria-labelledby="recall-title">
      <div className="m-head">
        <h2 id="recall-title" className="m-h2" data-reveal>
          {recall.heading[0]} <span className="m-soft">{recall.heading[1]}</span>
        </h2>
        <p className="m-lead" data-reveal>
          {recall.sentence}
        </p>
      </div>

      <div className="m-stage" data-reveal>
        <div className="m-app">
          <div className="m-win__bar">
            <i />
            <i />
            <i />
            <span>Meridius · Recall</span>
          </div>
          <div className="m-app__inner">
            <div className="m-search" aria-live="off">
              <SearchIcon />
              <span>
                {typed}
                <span className="m-search__caret" aria-hidden="true" />
              </span>
            </div>
            <div className="m-answer" data-busy={busy} aria-live="polite">
              <span className="m-answer__label">
                <SparkIcon />
                From your timeline
              </span>
              <p className="m-answer__text">{item.answer}</p>
              <ul className="m-moments">
                {item.moments.map((m) => (
                  <li key={m.time + m.app} className="m-moment">
                    <time>{m.time}</time>
                    <b>{m.app}</b>
                    <span>{m.what}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="m-asks" role="group" aria-label="Try a question" data-reveal>
        {recall.questions.map((q, i) => (
          <button key={q.q} type="button" className="m-ask" aria-pressed={i === active} onClick={() => choose(i)}>
            {q.q}
          </button>
        ))}
      </div>
    </section>
  );
}

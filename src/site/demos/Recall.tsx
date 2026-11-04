import { useRef, useState } from 'react';
import { recall } from '../content';
import { SearchIcon, SparkIcon } from '../ui/icons';
import { gsap } from '../motion';
import { Win } from './parts';
import { reducedMotion, useDemo, type DemoProps } from './useDemo';

/** Adds "type this question, then show its answer" to a timeline. */
function addQuestion(
  tl: gsap.core.Timeline,
  i: number,
  setActive: (n: number) => void,
  setTyped: (s: string) => void,
  setShow: (b: boolean) => void
) {
  const q = recall.questions[i].q;
  const p = { v: 0 };
  tl.call(() => {
    setActive(i);
    setShow(false);
    setTyped('');
  });
  tl.to(p, {
    v: q.length,
    duration: q.length * 0.028,
    ease: 'none',
    onUpdate: () => setTyped(q.slice(0, Math.round(p.v))),
  });
  tl.call(() => setShow(true), [], '+=0.25');
}

/** Recall: questions in plain words, answered from the timeline. Chips are live. */
export function RecallDemo(props: DemoProps) {
  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState('');
  const [show, setShow] = useState(false);
  const manual = useRef<gsap.core.Timeline | null>(null);

  const auto = useDemo((tl) => {
    recall.questions.forEach((_, i) => {
      addQuestion(tl, i, setActive, setTyped, setShow);
      tl.to({}, { duration: 2.4 });
    });
  }, props);

  const choose = (i: number) => {
    auto.current?.pause();
    manual.current?.kill();
    if (reducedMotion()) {
      setActive(i);
      setTyped(recall.questions[i].q);
      setShow(true);
      return;
    }
    const tl = gsap.timeline();
    addQuestion(tl, i, setActive, setTyped, setShow);
    manual.current = tl;
  };

  const item = recall.questions[active];

  return (
    <>
      <Win title="Meridius · Recall" style={{ left: '5em', top: '2.2em', width: '46em', height: '26.4em' }}>
        <div className="d-recall">
          <div className="d-search">
            <SearchIcon />
            <span>
              {typed}
              <span className="d-caret" />
            </span>
          </div>
          <div className="d-answer" data-on={show}>
            <span className="d-answer__label">
              <SparkIcon />
              From your timeline
            </span>
            <p>{item.answer}</p>
            <ul>
              {item.moments.map((m) => (
                <li key={m.time + m.app}>
                  <time>{m.time}</time>
                  <b>{m.app}</b>
                  <span>{m.what}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Win>
      <div className="d-asks" role="group" aria-label="Try a question" style={{ left: '3em', right: '3em', top: '30em' }}>
        {recall.questions.map((q, i) => (
          <button key={q.q} type="button" aria-pressed={i === active} onClick={() => choose(i)}>
            {q.q}
          </button>
        ))}
      </div>
    </>
  );
}

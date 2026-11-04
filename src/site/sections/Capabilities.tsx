import { useCallback, useEffect, useRef, useState } from 'react';
import { capabilities, type CapabilityId } from '../content';
import { ObserveDemo } from '../demos/Observe';
import { RememberDemo } from '../demos/Remember';
import { RecallDemo } from '../demos/Recall';
import { PrepareDemo } from '../demos/Prepare';
import { ActDemo } from '../demos/Act';
import { VerifyDemo } from '../demos/Verify';
import { reducedMotion, type DemoProps } from '../demos/useDemo';

const ITEMS = capabilities.items;

/**
 * The capability explorer: the loop as a list on the left and a live demo on
 * the right. It plays through on its own while in view; choosing a step takes
 * over. Demos pause off screen.
 */
export function Capabilities() {
  const [active, setActive] = useState(0);
  const [run, setRun] = useState(0);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLSpanElement | null>(null);
  const next = useRef(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => () => window.clearTimeout(next.current), []);

  // On phones the steps are a scrolling row of chips: keep the active one in view.
  useEffect(() => {
    const tab = document.getElementById(`cap-tab-${ITEMS[active].id}`);
    const row = tab?.parentElement;
    if (!tab || !row || row.scrollWidth <= row.clientWidth) return;
    row.scrollTo({ left: tab.offsetLeft - (row.clientWidth - tab.clientWidth) / 2, behavior: reducedMotion() ? 'auto' : 'smooth' });
  }, [active]);

  const select = useCallback((i: number, byVisitor = true) => {
    window.clearTimeout(next.current);
    if (byVisitor) setAuto(false);
    setActive(i);
    setRun((r) => r + 1);
    barRef.current?.style.setProperty('--p', '0');
  }, []);

  const onDone = useCallback(() => {
    if (!auto || reducedMotion()) return;
    next.current = window.setTimeout(() => select((active + 1) % ITEMS.length, false), 1200);
  }, [active, auto, select]);

  const onProgress = useCallback((p: number) => {
    barRef.current?.style.setProperty('--p', p.toFixed(3));
  }, []);

  const props: DemoProps = { playing: inView, onDone, onProgress };
  const id: CapabilityId = ITEMS[active].id;
  const actIndex = ITEMS.findIndex((x) => x.id === 'act');

  return (
    <section ref={sectionRef} id="capabilities" className="m-section m-wrap" data-section aria-labelledby="cap-title">
      <div className="m-head">
        <h2 id="cap-title" className="m-h2" data-reveal>
          {capabilities.heading[0]} <span className="m-soft">{capabilities.heading[1]}</span>
        </h2>
        <p className="m-lead" data-reveal>
          {capabilities.sentence}
        </p>
      </div>

      <div className="m-cap" data-reveal>
        <div className="m-cap__list" role="tablist" aria-label="Capabilities">
          {ITEMS.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`cap-tab-${item.id}`}
              aria-selected={i === active}
              aria-controls="cap-stage"
              className="m-cap__tab"
              onClick={() => select(i)}
            >
              <span className="m-cap__num">{String(i + 1).padStart(2, '0')}</span>
              <span className="m-cap__text">
                <b>{item.title}</b>
                <span>{item.body}</span>
              </span>
              {i === active ? <span className="m-cap__bar" ref={barRef} data-auto={auto} /> : null}
            </button>
          ))}
        </div>

        <div className="m-cap__body">
          <p className="m-cap__mobile-copy">{ITEMS[active].body}</p>
          <div
            id="cap-stage"
            className="m-canvas"
            role="tabpanel"
            aria-labelledby={`cap-tab-${id}`}
            onPointerDown={() => {
              window.clearTimeout(next.current);
              setAuto(false);
            }}
          >
            <div className="m-canvas__stage" key={`${id}-${run}`}>
              {id === 'observe' && <ObserveDemo {...props} />}
              {id === 'remember' && <RememberDemo {...props} />}
              {id === 'recall' && <RecallDemo {...props} />}
              {id === 'prepare' && <PrepareDemo {...props} onStart={() => select(actIndex)} />}
              {id === 'act' && <ActDemo {...props} />}
              {id === 'verify' && <VerifyDemo {...props} />}
            </div>
            <button type="button" className="m-canvas__replay" onClick={() => select(active)}>
              Replay
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

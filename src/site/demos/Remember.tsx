import { LogoMark } from '../brand/LogoMark';
import { AppMark, type AppId } from '../ui/apps';
import { useLayoutEffect, useRef, useState } from 'react';
import { useDemo, useStep, type DemoProps } from './useDemo';

const SOURCES: { app: AppId; where: string; text: string; y: number }[] = [
  { app: 'slack', where: '#cs-201 · Mon', text: 'Problem Set 4 is out, due Friday', y: 5 },
  { app: 'gmail', where: 'Dr. Rahman · Tue', text: 'Submit one PDF by 11:59 PM', y: 14.5 },
  { app: 'docs', where: 'Course doc · Wed', text: 'Problems 1 to 3 are required', y: 24 },
];

/** Field values as each source is merged in (index = sources merged). */
const FIELDS = [
  { label: 'Due', values: ['—', 'Friday', 'Friday, 11:59 PM', 'Friday, 11:59 PM'] },
  { label: 'Format', values: ['—', '—', 'One PDF', 'One PDF'] },
  { label: 'Scope', values: ['—', '—', '—', 'Problems 1 to 3'] },
];
const CONFIDENCE = [0, 62, 86, 97];

/** Remember: three sightings resolve into one commitment, sources kept. */
export function RememberDemo(props: DemoProps) {
  const [merged, go] = useStep();
  useDemo((tl) => {
    tl.call(() => go(0), [], 0);
    [1, 2, 3].forEach((n, i) => tl.call(() => go(n), [], 0.9 + i * 1.6));
    tl.to({}, { duration: 2.2 });
  }, props);

  // Links are measured from the real card edges, in the stage's em units, so
  // every line starts on its card and ends on the commitment's port.
  const srcRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [links, setLinks] = useState<{ d: string; a: [number, number] }[]>([]);
  const [port, setPort] = useState<[number, number]>([31.5, 10]);
  useLayoutEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const measure = () => {
      const em = parseFloat(getComputedStyle(node).fontSize);
      const px = node.offsetLeft / em;
      const py = node.offsetTop / em + 4.1;
      setPort([px, py]);
      setLinks(
        srcRefs.current.map((el) => {
          if (!el) return { d: '', a: [0, 0] as [number, number] };
          const x = (el.offsetLeft + el.offsetWidth) / em;
          const y = (el.offsetTop + el.offsetHeight / 2) / em;
          const mid = x + (px - x) * 0.5;
          return { d: `M${x} ${y} C ${mid} ${y}, ${mid} ${py}, ${px} ${py}`, a: [x, y] as [number, number] };
        })
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      {SOURCES.map((s, i) => (
        <div
          key={s.app}
          ref={(el) => {
            srcRefs.current[i] = el;
          }}
          className="d-src"
          data-on={merged > i}
          data-active={merged === i + 1}
          style={{ left: '2.5em', top: `${s.y}em` }}
        >
          <span className="d-src__icon">
            <AppMark id={s.app} />
          </span>
          <span>
            <small>{s.where}</small>
            <b>{s.text}</b>
          </span>
        </div>
      ))}

      <svg className="d-links" viewBox="0 0 56 36" aria-hidden="true">
        {links.map((l, i) => (
          <g key={i} data-on={merged > i} data-active={merged === i + 1}>
            <path className="d-links__guide" d={l.d} />
            <path className="d-links__line" d={l.d} pathLength={1} />
            <path className="d-links__pulse" d={l.d} pathLength={1} />
            <circle className="d-links__dot" cx={l.a[0]} cy={l.a[1]} r="0.32" />
          </g>
        ))}
        <circle className="d-links__port" data-on={merged > 0} cx={port[0]} cy={port[1]} r="0.42" />
      </svg>

      <div ref={nodeRef} className="d-node" data-merged={merged} style={{ left: '31.5em', top: '6em', width: '22em' }}>
        <div className="d-node__head">
          <LogoMark size={13} />
          One commitment
          <span>{merged} of 3 sources</span>
        </div>
        <h4>Problem Set 4</h4>
        <span className="d-node__glow" key={merged} aria-hidden="true" />
        <dl>
          {FIELDS.map((f) => (
            <div key={f.label} data-filled={f.values[merged] !== '—'}>
              <dt>{f.label}</dt>
              <dd key={f.values[merged]}>{f.values[merged]}</dd>
            </div>
          ))}
        </dl>
        <div className="d-conf">
          <span>Confidence</span>
          <span className="d-conf__bar">
            <i style={{ width: `${CONFIDENCE[merged]}%` }} />
          </span>
          <b>{CONFIDENCE[merged]}%</b>
        </div>
      </div>
    </>
  );
}

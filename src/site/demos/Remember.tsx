import { LogoMark } from '../brand/LogoMark';
import { AppMark, type AppId } from '../ui/apps';
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
    [1, 2, 3].forEach((n, i) => tl.call(() => go(n), [], 0.8 + i * 1.4));
    tl.to({}, { duration: 2 });
  }, props);

  return (
    <>
      {SOURCES.map((s, i) => (
        <div key={s.app} className="d-src" data-on={merged > i} data-active={merged === i + 1} style={{ left: '2.5em', top: `${s.y}em` }}>
          <span className="d-src__icon">
            <AppMark id={s.app} size={16} />
          </span>
          <span>
            <small>{s.where}</small>
            <b>{s.text}</b>
          </span>
        </div>
      ))}

      <svg className="d-links" viewBox="0 0 56 36" preserveAspectRatio="none" aria-hidden="true">
        {SOURCES.map((s, i) => (
          <path
            key={s.app}
            d={`M24.5 ${s.y + 3.4} C 28 ${s.y + 3.4}, 28 18, 31.5 18`}
            pathLength={1}
            data-on={merged > i}
          />
        ))}
      </svg>

      <div className="d-node" style={{ left: '31.5em', top: '6em', width: '22em' }}>
        <div className="d-node__head">
          <LogoMark size={13} />
          One commitment
          <span>{merged} of 3 sources</span>
        </div>
        <h4>Problem Set 4</h4>
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

import { LogoMark } from '../brand/LogoMark';
import { DocIcon } from '../ui/icons';
import { Appear, Status } from './parts';
import { useDemo, useStep, type DemoProps } from './useDemo';

const PREP = [
  { text: 'Found the brief on the course site', file: 'PS4 brief.pdf' },
  { text: 'Pulled your Lecture 9 notes', file: 'Lecture 9.key' },
  { text: 'Opened last night’s draft', file: 'ps4-draft.pages' },
];

/** Prepare: noticed a day ahead, gathered the files, then asks first. */
export function PrepareDemo({ onStart, ...props }: DemoProps & { onStart?: () => void }) {
  const [step, go] = useStep();
  useDemo((tl) => {
    tl.call(() => go(0), [], 0);
    [1, 2, 3, 4, 5, 6, 7].forEach((n, i) => tl.call(() => go(n), [], 0.5 + i * 0.6));
    tl.to({}, { duration: 2.6 });
  }, props);

  return (
    <>
      <div className="d-prep" style={{ left: '6em', top: '2.6em', width: '44em' }}>
        <div className="d-prep__head">
          <span className="d-prep__when">Thursday 4:12 PM</span>
          <h4>Problem Set 4 is due tomorrow at 11:59 PM</h4>
          <small>You usually start a day ahead. Getting things ready.</small>
        </div>
        <div className="d-prep__rows">
          {PREP.map((p, i) => (
            <Appear key={p.text} on={step >= i * 2 + 1} className="d-prep__row">
              <Status done={step >= i * 2 + 2} />
              {p.text}
              <span className="d-file">
                <DocIcon />
                {p.file}
              </span>
            </Appear>
          ))}
        </div>
      </div>

      <Appear on={step >= 7} className="d-ask" style={{ left: '14em', top: '22.6em', width: '28em' }}>
        <span className="d-ask__tag">
          <LogoMark size={12} />
          Ready when you are
        </span>
        <p>Everything’s in one folder. Start the outline now?</p>
        <div className="d-ask__row">
          <button type="button" className="d-btn d-btn--blue" onClick={onStart}>
            Start the outline
          </button>
          <button type="button" className="d-btn">Remind me at 7 PM</button>
        </div>
      </Appear>
    </>
  );
}

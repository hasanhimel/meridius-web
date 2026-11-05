import { LogoMark } from '../brand/LogoMark';
import { CheckIcon } from '../ui/icons';
import { AppMark } from '../ui/apps';
import { Appear, Status } from './parts';
import { useDemo, useStep, type DemoProps } from './useDemo';

/** Each check, with the app that proves it. */
const EVIDENCE = [
  { title: 'The file exists', detail: '~/School/CS201/ps4.pdf · 412 KB', app: 'finder' },
  { title: 'The answers check out', detail: 'check_answers.py · 3 of 3 pass', app: 'terminal' },
  { title: 'The submission went through', detail: 'Course site · receipt #A-20418', app: 'chrome' },
] as const;

/** Verify: every task ends with evidence, then the commitment is closed. */
export function VerifyDemo(props: DemoProps) {
  const [step, go] = useStep();
  useDemo((tl) => {
    tl.call(() => go(0), [], 0);
    [1, 2, 3, 4, 5, 6, 7, 8].forEach((n, i) => tl.call(() => go(n), [], 0.4 + i * 0.55));
    tl.to({}, { duration: 2.4 });
  }, props);

  return (
    <>
      <div className="d-verify" style={{ left: '8em', top: '2.6em', width: '40em' }}>
        <div className="d-verify__head">
          <LogoMark size={14} />
          Checking the result
          <span>{Math.min(3, Math.floor(step / 2))} of 3</span>
        </div>
        {EVIDENCE.map((e, i) => (
          <Appear key={e.title} on={step >= i * 2 + 1} className="d-evidence">
            <span className="d-thumb">
              <AppMark id={e.app} />
            </span>
            <span>
              <b>{e.title}</b>
              <small>{e.detail}</small>
            </span>
            <Status done={step >= i * 2 + 2} />
          </Appear>
        ))}
      </div>
      <Appear on={step >= 7} className="d-closed" style={{ left: '12em', top: '24.4em', width: '32em' }}>
        <span className="d-closed__check">
          <CheckIcon />
        </span>
        <span>
          <s data-on={step >= 8}>Problem Set 4, due Friday 11:59 PM</s>
          <small>Verified and marked done. Nothing left for you.</small>
        </span>
      </Appear>
    </>
  );
}

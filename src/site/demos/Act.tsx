import { useEffect, useRef, useState } from 'react';
import { LogoMark } from '../brand/LogoMark';
import { Cursor, type CursorHandle } from '../ui/Cursor';
import { CheckIcon, DocIcon } from '../ui/icons';
import { Appear } from './parts';
import { useDemo, type DemoProps } from './useDemo';

/** Stage is 56 × 36 em; the cursor takes percentages of it. */
const at = (xEm: number, yEm: number) => [(xEm / 56) * 100, (yEm / 36) * 100] as const;

const TERMINAL = ['$ python3 check_answers.py', '3 of 3 problems pass', '$ pandoc ps4.md -o ps4.pdf', 'ps4.pdf   412 KB'];
type Agent = 'Browser' | 'Terminal' | 'Desktop';

/**
 * Act: the browser and terminal agents finish the assignment inside
 * Meridius's own display, with its own cursor, and stop to ask before the
 * one step that can't be undone. The visitor can approve it.
 */
export function ActDemo(props: DemoProps) {
  const cursor = useRef<CursorHandle>(null);
  const [page, setPage] = useState(0);
  const [lines, setLines] = useState(0);
  const [attached, setAttached] = useState(false);
  const [ask, setAsk] = useState<'none' | 'asking' | 'approved'>('none');
  const [submitted, setSubmitted] = useState(false);
  const [agent, setAgent] = useState<Agent>('Browser');
  const [pressed, setPressed] = useState<string | null>(null);
  const resumeTimer = useRef<number>(0);

  const tlRef = useDemo((tl) => {
    const c = cursor.current!;
    const press = (id: string) => {
      tl.call(() => setPressed(id));
      c.click(tl);
      tl.call(() => setPressed(null), [], '+=0.05');
    };
    tl.call(() => {
      setPage(0);
      setLines(0);
      setAttached(false);
      setAsk('none');
      setSubmitted(false);
      setAgent('Browser');
    }, [], 0);
    c.set(...at(34, 10));
    tl.set(c.el, { left: `${at(34, 10)[0]}%`, top: `${at(34, 10)[1]}%` }, 0);
    tl.to({}, { duration: 0.5 });

    // Browser agent: open the assignment.
    c.moveTo(tl, ...at(8.2, 12.1), 1);
    press('assignments');
    tl.call(() => setPage(1));
    tl.to({}, { duration: 0.5 });

    // Terminal agent: check answers and build the PDF.
    tl.call(() => setAgent('Terminal'));
    TERMINAL.forEach((_, i) => tl.call(() => setLines(i + 1), [], `+=${i === 0 ? 0.2 : 0.5}`));
    tl.to({}, { duration: 0.5 });

    // Browser agent again: attach the file.
    tl.call(() => setAgent('Browser'));
    c.moveTo(tl, ...at(19.5, 16.1), 0.9);
    press('attach');
    tl.call(() => setAttached(true));
    tl.to({}, { duration: 0.4 });

    // Stop before submitting: this one needs the person's OK.
    c.moveTo(tl, ...at(47, 29.7), 1);
    tl.call(() => setAsk('asking'));
    tl.addPause('+=0.1', () => {
      window.clearTimeout(resumeTimer.current);
      resumeTimer.current = window.setTimeout(() => approve(), 2600);
    });
    tl.call(() => setAsk('approved'));
    tl.to({}, { duration: 0.5 });
    press('submit');
    tl.call(() => setSubmitted(true));
    tl.to({}, { duration: 2.4 });
  }, props);

  useEffect(() => () => window.clearTimeout(resumeTimer.current), []);

  function approve() {
    window.clearTimeout(resumeTimer.current);
    const tl = tlRef.current;
    if (tl && tl.paused() && props.playing) tl.play();
  }

  return (
    <>
      <div className="d-vd" style={{ left: '2em', top: '2em', width: '52em', height: '32em' }}>
        <div className="d-vd__bar">
          <LogoMark size={12} />
          Meridius’s display
          <span className="d-vd__virtual">virtual</span>
          <span className="d-agents">
            {(['Browser', 'Terminal', 'Desktop'] as Agent[]).map((a) => (
              <span key={a} data-on={agent === a}>
                {a}
              </span>
            ))}
          </span>
        </div>
        <div className="d-url">course site · CS 201{page ? ' · Assignments' : ''}</div>
        <nav className="d-side">
          <span>Home</span>
          <span data-on={page === 1} data-pressed={pressed === 'assignments'}>
            Assignments
          </span>
          <span>Grades</span>
          <span>People</span>
        </nav>
        <div className="d-page">
          {page === 0 ? (
            <>
              <h4>CS 201 · Data Structures</h4>
              <p className="d-muted">Announcements</p>
              <div className="d-skel">
                <i style={{ width: '70%' }} />
                <i />
                <i style={{ width: '55%' }} />
              </div>
            </>
          ) : (
            <>
              <h4>Problem Set 4</h4>
              <p className="d-muted">Due Friday, 11:59 PM · one PDF</p>
              <span className="d-btn d-btn--line" data-pressed={pressed === 'attach'} style={{ position: 'absolute', left: '1em', top: '7.2em' }}>
                Attach file
              </span>
              <Appear on={attached} className="d-file d-file--lg" style={{ position: 'absolute', left: '1em', top: '10.4em' }}>
                <DocIcon />
                ps4.pdf · 412 KB
              </Appear>
              <span
                className="d-btn d-btn--blue"
                data-pressed={pressed === 'submit'}
                data-disabled={!attached}
                style={{ position: 'absolute', right: '1.6em', bottom: '1.4em' }}
              >
                {submitted ? 'Submitted' : 'Submit'}
              </span>
              <Appear on={submitted} className="d-done" style={{ position: 'absolute', left: '1em', bottom: '1.5em' }}>
                <CheckIcon />
                Submitted 8:14 PM · receipt saved
              </Appear>
            </>
          )}
        </div>
        <div className="d-term" data-on={agent === 'Terminal' || lines > 0}>
          <div className="d-term__bar">Terminal agent</div>
          {TERMINAL.slice(0, lines).map((l) => (
            <div key={l} className={l.startsWith('$') ? '' : 'd-term__out'}>
              {l}
            </div>
          ))}
        </div>
      </div>

      <Appear on={ask !== 'none' && !submitted} className="d-ask d-ask--sm" style={{ left: '29em', top: '18.4em', width: '22em' }}>
        <span className="d-ask__tag">
          <LogoMark size={12} />
          {ask === 'approved' ? 'Approved by you' : 'Needs your OK'}
        </span>
        <p>Submit Problem Set 4 to the course site?</p>
        <div className="d-ask__row">
          <button type="button" className="d-btn d-btn--blue" onClick={approve} disabled={ask !== 'asking'}>
            Approve
          </button>
          <button type="button" className="d-btn" disabled={ask !== 'asking'}>
            Not yet
          </button>
        </div>
      </Appear>

      <Cursor ref={cursor} x={at(34, 10)[0]} y={at(34, 10)[1]} label="Meridius" />
    </>
  );
}

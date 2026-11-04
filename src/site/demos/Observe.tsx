import { LogoMark } from '../brand/LogoMark';
import { AppMark } from '../ui/apps';
import { Appear, Win } from './parts';
import { useDemo, useStep, type DemoProps } from './useDemo';

const NOTICED = [
  { app: 'slack' as const, title: 'Problem Set 4 is due Friday', from: 'Slack · #cs-201' },
  { app: 'gmail' as const, title: 'Submit one PDF by 11:59 PM', from: 'Mail · Dr. Rahman' },
  { app: null, title: 'Ayaan sends the logo files Monday', from: 'Zoom · weekly sync audio' },
];

/** Observe: three apps, no connectors; each commitment is spotted and listed. */
export function ObserveDemo(props: DemoProps) {
  const [step, go] = useStep();
  useDemo((tl) => {
    tl.call(() => go(0), [], 0);
    [1, 2, 3, 4, 5, 6].forEach((n, i) => tl.call(() => go(n), [], 0.6 + i * 0.85));
    tl.to({}, { duration: 1.4 });
  }, props);

  const scanning = (n: number) => step === n * 2 - 1;
  const found = (n: number) => step >= n * 2;

  return (
    <>
      <Win title="#cs-201" scan={scanning(1)} style={{ left: '3em', top: '2.6em', width: '25em', height: '10em' }}>
        <div className="d-msg">
          <span className="d-avatar" style={{ background: '#c7d2fe' }}>R</span>
          <div>
            <b>Rafi · TA</b> <small>10:14 AM</small>
            <p>
              Heads up: <mark data-on={found(1) || scanning(1)}>Problem Set 4 is out, due Friday</mark>. Office hours Thursday.
            </p>
          </div>
        </div>
      </Win>
      <Win title="Inbox" scan={scanning(2)} style={{ left: '3em', top: '13.6em', width: '25em', height: '10.2em' }}>
        <div className="d-mail">
          <b>Dr. Rahman</b>
          <small>Problem Set 4 · Tue 8:30 AM</small>
          <p>
            Please <mark data-on={found(2) || scanning(2)}>submit one PDF by 11:59 PM</mark>. Problems 1 to 3 are required.
          </p>
        </div>
      </Win>
      <Win title="Weekly sync" dark scan={scanning(3)} style={{ left: '3em', top: '24.8em', width: '25em', height: '8.6em' }}>
        <div className="d-call">
          <span className="d-wave" data-live={scanning(3) || found(3)}>
            {Array.from({ length: 22 }, (_, i) => (
              <i key={i} style={{ animationDelay: `${(i % 7) * 0.09}s` }} />
            ))}
          </span>
          <p>
            Ayaan: <mark data-on={found(3) || scanning(3)}>“I’ll send the logo files Monday.”</mark>
          </p>
        </div>
      </Win>

      <div className="d-panel" style={{ left: '30.5em', top: '2.6em', width: '22.5em', height: '30.8em' }}>
        <div className="d-panel__head">
          <LogoMark size={14} />
          Noticed today
          <span className="d-live">Watching</span>
        </div>
        <div className="d-list">
          {NOTICED.map((n, i) => (
            <Appear key={n.title} on={found(i + 1)} className="d-noticed">
              <span className="d-noticed__icon">{n.app ? <AppMark id={n.app} size={15} /> : <span className="d-mic" />}</span>
              <span>
                <b>{n.title}</b>
                <small>{n.from}</small>
              </span>
            </Appear>
          ))}
        </div>
        <Appear on={step >= 6} className="d-panel__foot">
          3 commitments found · 0 connectors needed
        </Appear>
      </div>
    </>
  );
}

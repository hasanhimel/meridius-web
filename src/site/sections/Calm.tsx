import { calm } from '../content';
import { APPS, AppMark, type AppId } from '../ui/apps';
import { CheckIcon, CursorIcon } from '../ui/icons';

function TwoDisplays() {
  return (
    <div className="m-displays">
      <div className="m-display m-display--you">
        <span className="m-display__label">Your screen</span>
        <div className="m-display__lines">
          <i style={{ width: '70%' }} />
          <i />
          <i style={{ width: '85%' }} />
          <i style={{ width: '50%' }} />
        </div>
        <CursorIcon className="m-cursor" style={{ left: '58%', top: '66%', color: '#0a0a0c' }} />
      </div>
      <div className="m-display m-display--it">
        <span className="m-display__label">Meridius</span>
        <div className="m-display__lines">
          <i style={{ width: '60%' }} />
          <i />
          <i style={{ width: '75%' }} />
        </div>
        <CursorIcon className="m-cursor" style={{ left: '62%', top: '58%' }} />
      </div>
    </div>
  );
}

function Approve() {
  return (
    <div className="m-approve">
      <small>Before I send this</small>
      <p>Reply to Ayaan: “Monday works, thanks for the logo files.”</p>
      <div className="m-approve__row">
        <span className="m-btn m-btn--blue m-btn--sm">Send</span>
        <span className="m-btn m-btn--sm" style={{ background: 'rgba(255,255,255,0.08)' }}>
          Edit
        </span>
      </div>
    </div>
  );
}

function Verify() {
  const rows = ['ps4.pdf exists, 412 KB', '3 of 3 answers check out', 'Submission receipt saved'];
  return (
    <div className="m-verify">
      {rows.map((r) => (
        <div key={r} className="m-verify__row">
          <span className="m-step__dot">
            <CheckIcon />
          </span>
          {r}
        </div>
      ))}
      <div className="m-verify__done">Verified · Problem Set 4</div>
    </div>
  );
}

const ART = [TwoDisplays, Approve, Verify];
const ROW: AppId[] = ['gmail', 'slack', 'notion', 'drive', 'calendar', 'docs'];

export function Calm() {
  return (
    <section id="calm" className="m-section m-wrap" data-section aria-labelledby="calm-title">
      <div className="m-head">
        <h2 id="calm-title" className="m-h2" data-reveal>
          {calm.heading[0]} <span className="m-soft">{calm.heading[1]}</span>
        </h2>
        <p className="m-lead" data-reveal>
          {calm.sentence}
        </p>
      </div>

      <div className="m-trio">
        {calm.cards.map((c, i) => {
          const Art = ART[i];
          return (
            <article key={c.lead} className="m-tile" data-reveal>
              <div className="m-tile__art" aria-hidden="true">
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
        <p className="m-apps__label">{calm.apps}</p>
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

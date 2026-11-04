import { how } from '../content';
import { AppMark, type AppId } from '../ui/apps';
import { ArrowDownIcon, BoltIcon, CheckIcon, EyeIcon } from '../ui/icons';
import { LogoMark } from '../brand/LogoMark';

const SIGHTINGS: { app: AppId; where: string; what: string; when: string }[] = [
  { app: 'slack', where: '#cs-201', what: 'Problem Set 4 is out, due Friday', when: 'Mon' },
  { app: 'gmail', where: 'Dr. Rahman', what: 'Submit one PDF by 11:59 PM', when: 'Tue' },
  { app: 'docs', where: 'Course doc', what: 'Problems 1 to 3 are required', when: 'Wed' },
];

const STEPS = [
  { text: 'Collected the brief and lecture notes', agent: 'Browser' },
  { text: 'Checked answers and built ps4.pdf', agent: 'Terminal' },
  { text: 'Added figure 2 to the document', agent: 'Desktop' },
];

export function How() {
  return (
    <section id="how" className="m-section m-wrap" data-section aria-labelledby="how-title">
      <div className="m-head">
        <h2 id="how-title" className="m-h2" data-reveal>
          {how.heading[0]} <span className="m-soft">{how.heading[1]}</span>
        </h2>
      </div>

      <div className="m-pair">
        <article className="m-card m-card--blue" data-reveal>
          <h3 className="m-card__title">
            {how.notice.title[0]}{' '}
            <span className="m-tagword">
              <EyeIcon />
              {how.notice.title[1]}
            </span>{' '}
            {how.notice.title[2]}
          </h3>
          <p className="m-card__body">{how.notice.body}</p>
          <div className="m-card__visual" aria-label="Three mentions of the same deadline become one commitment" role="img">
            <div className="m-sources" aria-hidden="true">
              {SIGHTINGS.map((s) => (
                <div key={s.app} className="m-source">
                  <span className="m-source__icon">
                    <AppMark id={s.app} size={18} />
                  </span>
                  <span>
                    <b>{s.where}</b>
                    {s.what}
                  </span>
                  <time>{s.when}</time>
                </div>
              ))}
            </div>
            <div className="m-merge" aria-hidden="true">
              <ArrowDownIcon />
            </div>
            <div className="m-commit" aria-hidden="true">
              <span className="m-commit__top">One commitment · 3 sources</span>
              <h3>Problem Set 4, due Friday 11:59 PM</h3>
              <p>Submit one PDF. Problems 1 to 3.</p>
            </div>
          </div>
        </article>

        <article className="m-card m-card--grey" data-reveal>
          <h3 className="m-card__title">
            {how.act.title[0]}{' '}
            <span className="m-tagword">
              <BoltIcon />
              {how.act.title[1]}
            </span>
          </h3>
          <p className="m-card__body">{how.act.body}</p>
          <div className="m-card__visual" role="img" aria-label="A task in progress: three steps done by the browser, terminal and desktop agents, waiting for your approval to submit">
            <div className="m-task" aria-hidden="true">
              <div className="m-task__head">
                <LogoMark size={16} />
                <b>Problem Set 4</b>
                <span>3 of 4 done</span>
              </div>
              <ul className="m-steps">
                {STEPS.map((s) => (
                  <li key={s.text} className="m-step">
                    <span className="m-step__dot">
                      <CheckIcon />
                    </span>
                    {s.text}
                    <span className="m-step__agent">{s.agent}</span>
                  </li>
                ))}
                <li className="m-step" data-state="wait">
                  <span className="m-step__dot">
                    <CheckIcon />
                  </span>
                  Submit on the course site?
                  <span className="m-step__agent">Needs your OK</span>
                </li>
              </ul>
              <div className="m-task__actions">
                <span className="m-btn m-btn--blue m-btn--sm">Submit</span>
                <span className="m-btn m-btn--sm" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  Not yet
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

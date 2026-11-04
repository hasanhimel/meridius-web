import { privacy } from '../content';
import { LockIcon } from '../ui/icons';

function Settings() {
  return (
    <div className="m-settings" role="img" aria-label="Meridius privacy settings: stored on this Mac, system audio on, microphone off, three apps excluded, local model">
      <div className="m-win__bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>Privacy</span>
      </div>
      <div className="m-settings__body" aria-hidden="true">
        <div className="m-setting">
          <LockIcon className="m-apple" />
          Storage
          <span>On this Mac</span>
        </div>
        <div className="m-setting">
          System audio
          <span className="m-toggle" data-on />
        </div>
        <div className="m-setting">
          Microphone
          <span className="m-toggle" />
        </div>
        <div className="m-setting">
          Never capture
          <span className="m-excluded">
            <em>Banking</em>
            <em>Passwords</em>
            <em>Health</em>
          </span>
        </div>
        <div className="m-setting">
          Model
          <span>Local · Gemma</span>
        </div>
        <div className="m-setting">
          Pause observing
          <span>For 1 hour</span>
        </div>
      </div>
    </div>
  );
}

export function Privacy() {
  return (
    <section id="privacy" className="m-section m-wrap" data-section aria-labelledby="privacy-title">
      <div className="m-split">
        <div className="m-split__art" data-reveal>
          <Settings />
        </div>
        <div>
          <h2 id="privacy-title" className="m-h2" data-reveal>
            {privacy.heading}
          </h2>
          <div className="m-rows">
            {privacy.rows.map((r) => (
              <div key={r.big} className="m-row" data-reveal>
                <span className="m-row__big">{r.big}</span>
                <div>
                  <h3>{r.title}</h3>
                  <p>{r.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

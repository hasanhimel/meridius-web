import { useState } from 'react';
import { privacy } from '../content';
import { LockIcon } from '../ui/icons';

function Toggle({ on, label, onChange }: { on: boolean; label: string; onChange: () => void }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} className="m-toggle" data-on={on || undefined} onClick={onChange} />
  );
}

/** A working settings panel: the switches switch, and pausing says so. */
function Settings() {
  const [audio, setAudio] = useState(true);
  const [mic, setMic] = useState(false);
  const [paused, setPaused] = useState(false);
  return (
    <div className="m-settings">
      <div className="m-win__bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>Privacy</span>
        <span className="m-settings__state" data-paused={paused}>
          {paused ? 'Paused' : 'Observing'}
        </span>
      </div>
      <div className="m-settings__body">
        <div className="m-setting">
          <LockIcon className="m-apple" />
          Storage
          <span>On this Mac</span>
        </div>
        <div className="m-setting">
          System audio
          <Toggle on={audio} label="System audio" onChange={() => setAudio((v) => !v)} />
        </div>
        <div className="m-setting">
          Microphone
          <Toggle on={mic} label="Microphone" onChange={() => setMic((v) => !v)} />
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
          Observing
          <button type="button" className="m-pause" data-paused={paused} onClick={() => setPaused((v) => !v)}>
            {paused ? 'Resume' : 'Pause for 1 hour'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Privacy() {
  return (
    <section id="privacy" className="m-section m-wrap" data-section aria-labelledby="privacy-title">
      <div className="m-split">
        <div className="m-split__art" data-reveal="pop">
          <Settings />
        </div>
        <div>
          <h2 id="privacy-title" className="m-h2" data-reveal="words">
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

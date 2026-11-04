import { forwardRef } from 'react';
import { LogoMark } from '../brand/LogoMark';
import { CursorIcon, DocIcon } from './icons';
import { AppMark } from './apps';

/**
 * The hero's product shot: a Mac desktop where Meridius has just noticed a
 * deadline in an email, gathered the files, and is working on something else
 * in its own display (the mirror, bottom right). Built in HTML so it stays
 * sharp; every size is in em and scales with the stage.
 */
export const Desktop = forwardRef<HTMLDivElement>(function Desktop(_, ref) {
  return (
    <div ref={ref} className="m-desk" role="img" aria-label="Meridius on a Mac: it has noticed that Problem Set 4 is due Friday at 11:59 PM, gathered the brief, lecture notes and draft, and offers to start the outline, while it works in its own display in the corner.">
      <div className="m-desk__stage" aria-hidden="true">
        <div className="m-desk__menubar">
          <b>Mail</b>
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span className="m-right">
            <LogoMark size={13} />
            <span>Thu 4:12 PM</span>
          </span>
        </div>

        <div className="m-win m-mail">
          <div className="m-win__bar">
            <i />
            <i />
            <i />
            <span>Inbox</span>
          </div>
          <div className="m-mail__body">
            <div className="m-mail__list">
              <div className="m-mail__item" data-on>
                <b>Dr. Rahman</b>Problem Set 4
              </div>
              <div className="m-mail__item">
                <b>Ayaan</b>Logo files, Monday
              </div>
              <div className="m-mail__item">
                <b>Calendar</b>Design review moved
              </div>
              <div className="m-mail__item">
                <b>Course site</b>Grades posted
              </div>
              <div className="m-mail__item">
                <b>Mum</b>Flight on the 21st
              </div>
            </div>
            <div className="m-mail__read">
              <h4>Problem Set 4</h4>
              <div className="m-mail__meta">Dr. Rahman · to CS 201 · Tue 8:30 AM</div>
              <p>Hi all,</p>
              <p>
                Problem Set 4 covers sorting and recursion. Please submit{' '}
                <span className="m-mark-hl" data-hl>
                  one PDF by Friday at 11:59 PM
                </span>
                . Problems 1 to 3 are required; 4 is optional.
              </p>
              <p>Office hours move to Thursday this week.</p>
            </div>
          </div>
        </div>

        <div className="m-pill" style={{ left: '35em', top: '2.9em' }} data-pop>
          <LogoMark size={15} />
          <span className="m-pill__live">Watching</span>
          <span style={{ opacity: 0.7 }}>Hide</span>
          <span className="m-pill__stop" />
        </div>

        <div className="m-panel" style={{ left: '37.5em', top: '7em', width: '25.5em' }} data-pop>
          <span className="m-panel__tag">
            <LogoMark size={12} />
            Meridius noticed
          </span>
          <p className="m-panel__title">Problem Set 4 is due Friday at 11:59 PM</p>
          <p className="m-panel__text">Also mentioned in #cs-201 and the course doc. I gathered what you’ll need:</p>
          <div className="m-panel__chips">
            <span className="m-chip">
              <DocIcon />
              Course brief
            </span>
            <span className="m-chip">
              <DocIcon />
              Lecture 9 notes
            </span>
            <span className="m-chip">
              <DocIcon />
              Your draft
            </span>
          </div>
          <div className="m-panel__actions">
            <span className="m-mini-btn m-mini-btn--blue">Start the outline</span>
            <span className="m-mini-btn">Remind me Thursday</span>
            <span className="m-kbd">⌘ ↵</span>
          </div>
        </div>

        <div className="m-mirror" style={{ right: '2.4em', bottom: '5.8em' }} data-pop>
          <div className="m-mirror__head">
            <LogoMark size={11} />
            <b>Its own display</b>
            <span style={{ marginLeft: 'auto' }}>Filing receipts</span>
          </div>
          <div className="m-mirror__screen">
            <div className="m-mirror__doc">
              <i />
              <i />
              <i style={{ width: '80%' }} />
              <i />
              <i style={{ width: '60%' }} />
            </div>
            <CursorIcon className="m-cursor" style={{ left: '62%', top: '48%' }} />
          </div>
        </div>

        <div className="m-dock">
          <span>
            <LogoMark size={26} />
          </span>
          {(['gmail', 'slack', 'docs', 'notion', 'calendar'] as const).map((id) => (
            <span key={id}>
              <AppMark id={id} size={26} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});

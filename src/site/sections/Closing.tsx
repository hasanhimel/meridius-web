import { forwardRef, useState, type FormEvent } from 'react';
import { closing } from '../content';
import { joinWaitlist, validateEmail } from '../../lib/supabase';
import { BOOK_CALL_URL } from '../../config';
import { LogoMark } from '../brand/LogoMark';
import { SparkIcon } from '../ui/icons';

const DISPOSABLE = new Set([
  'mailinator.com',
  'guerrillamail.com',
  'tempmail.com',
  'throwawaymail.com',
  '10minutemail.com',
  'yopmail.com',
  'sharklasers.com',
  'getairmail.com',
  'dispostable.com',
  'trashmail.com',
]);

type Status = { kind: 'idle' | 'error' | 'ok'; text: string };

/** Early access: one field, one button, with the honeypot and throttle. */
export const Closing = forwardRef<HTMLInputElement>(function Closing(_, inputRef) {
  const [email, setEmail] = useState('');
  const [trap, setTrap] = useState('');
  const [busy, setBusy] = useState(false);
  const [lastSubmit, setLastSubmit] = useState(0);
  const [status, setStatus] = useState<Status>({ kind: 'idle', text: '' });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    // Bots fill the hidden field: pretend success, store nothing.
    if (trap.trim()) {
      setStatus({ kind: 'ok', text: 'You’re on the list. We’ll write when your seat opens.' });
      return;
    }
    const value = email.trim().toLowerCase();
    if (!validateEmail(value)) {
      setStatus({ kind: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    if (DISPOSABLE.has(value.split('@')[1] ?? '')) {
      setStatus({ kind: 'error', text: 'Please use an address you’ll still read next month.' });
      return;
    }
    const now = Date.now();
    if (now - lastSubmit < 5000) {
      setStatus({ kind: 'error', text: 'One moment, then try again.' });
      return;
    }
    setLastSubmit(now);
    setBusy(true);
    setStatus({ kind: 'idle', text: 'Saving…' });
    const result = await joinWaitlist({ email: value });
    setBusy(false);
    if (result.success) {
      setStatus({
        kind: 'ok',
        text: result.alreadyJoined
          ? `${value} is already on the list.`
          : `You’re on the list. We’ll write to ${value} when your seat opens.`,
      });
      setEmail('');
    } else {
      setStatus({ kind: 'error', text: 'That didn’t go through. Please try again in a moment.' });
    }
  };

  return (
    <section id="access" className="m-closing" data-section aria-labelledby="access-title">
      <div className="m-wrap m-closing__inner">
        <div>
          <h2 id="access-title" data-reveal>
            {closing.title}
            <span>{closing.sub}</span>
          </h2>
          <form className="m-form" onSubmit={submit} noValidate data-reveal>
            <label htmlFor="access-email" className="m-sr">
              Email address
            </label>
            <input
              ref={inputRef}
              id="access-email"
              className="m-input"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={closing.placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-describedby="access-status"
              required
            />
            <button type="submit" className="m-btn m-btn--blue" disabled={busy}>
              {closing.button}
            </button>
            <span className="m-trap" aria-hidden="true">
              <label htmlFor="access-company">Company</label>
              <input id="access-company" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
            </span>
          </form>
          <p id="access-status" className="m-status" data-kind={status.kind} role="status">
            {status.text}
          </p>
          <p className="m-call">
            {closing.call} <a href={BOOK_CALL_URL}>{closing.callLink}</a>
          </p>
        </div>
        <div className="m-icon-float" aria-hidden="true">
          <span className="m-appicon m-appicon--a" data-float>
            <LogoMark size={92} />
          </span>
          <span className="m-appicon m-appicon--b" data-float>
            <SparkIcon />
          </span>
        </div>
      </div>
    </section>
  );
});

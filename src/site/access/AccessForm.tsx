import { forwardRef, useId, useState, type FormEvent } from 'react';
import { closing } from '../content';
import { joinWaitlist, validateEmail } from '../../lib/supabase';

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

/**
 * One field, one button: the early-access form, with a honeypot and a 5s
 * throttle. Used inline at the end of the page and inside the access dialog.
 */
export const AccessForm = forwardRef<HTMLInputElement, { compact?: boolean }>(function AccessForm({ compact = false }, inputRef) {
  const uid = useId();
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
        text: result.alreadyJoined ? `${value} is already on the list.` : `You’re on the list. We’ll write to ${value} when your seat opens.`,
      });
      setEmail('');
    } else {
      setStatus({ kind: 'error', text: 'That didn’t go through. Please try again in a moment.' });
    }
  };

  return (
    <>
      <form className={`m-form${compact ? ' m-form--compact' : ''}`} onSubmit={submit} noValidate>
        <label htmlFor={`${uid}-email`} className="m-sr">
          Email address
        </label>
        <input
          ref={inputRef}
          id={`${uid}-email`}
          className="m-input"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={closing.placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-describedby={`${uid}-status`}
          required
        />
        <button type="submit" className="m-btn m-btn--blue" disabled={busy}>
          {closing.button}
        </button>
        <span className="m-trap" aria-hidden="true">
          <label htmlFor={`${uid}-company`}>Company</label>
          <input id={`${uid}-company`} tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
        </span>
      </form>
      <p id={`${uid}-status`} className="m-status" data-kind={status.kind} role="status">
        {status.text}
      </p>
    </>
  );
});

import { useEffect, useState, type FormEvent } from 'react';
import { NavMark } from '../../site/brand/NavMark';
import { AdminDashboard } from './AdminDashboard';
import './admin.css';

const TOKEN_KEY = 'meridius_admin_token';
// Legacy flag from the removed client-side password check; cleared on load.
const LEGACY_SESSION_KEY = 'meridius_admin_session_auth';

/**
 * The admin console's gate. The password is checked only by /api/admin/auth,
 * which returns a signed, expiring token; the UI unlocks with that token and
 * every data request is verified again on the server.
 */
export function AdminLayout() {
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Meridius · Admin';
    sessionStorage.removeItem(LEGACY_SESSION_KEY);
    setToken(sessionStorage.getItem(TOKEN_KEY));
    setChecking(false);
  }, []);

  const signIn = async (e: FormEvent) => {
    e.preventDefault();
    if (!password || loading) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.token === 'string' && data.token) {
          sessionStorage.setItem(TOKEN_KEY, data.token);
          setToken(data.token);
          setPassword('');
          return;
        }
        setError('The server sent an unexpected response.');
      } else if (res.status === 401) {
        setError('That password isn’t right.');
        setPassword('');
      } else if (res.status === 429) {
        setError('Too many attempts. Try again in a minute.');
      } else if (res.status === 503) {
        setError('The admin console isn’t configured on the server yet.');
      } else {
        setError(`Sign-in failed (${res.status}).`);
      }
    } catch {
      setError('Couldn’t reach the admin API.');
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  if (checking) return <div className="a-root a-center" />;
  if (token) return <AdminDashboard token={token} onLogout={signOut} />;

  return (
    <div className="a-root a-gate">
      <div className="a-gate__sky" aria-hidden="true" />
      <form className="a-gate__card" onSubmit={signIn} noValidate>
        <NavMark size={40} tone="dark" />
        <h1>Meridius Admin</h1>
        <p className="a-gate__lead">Sign in to see the waitlist and visitors.</p>
        <label className="a-sr" htmlFor="admin-password">
          Password
        </label>
        <div className="a-field" data-error={error ? '' : undefined}>
          <input
            id="admin-password"
            type={show ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            aria-describedby="admin-error"
          />
          <button type="button" className="a-field__eye" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
            {show ? 'Hide' : 'Show'}
          </button>
        </div>
        <p id="admin-error" className="a-gate__error" role="alert">
          {error}
        </p>
        <button type="submit" className="a-btn a-btn--blue a-btn--full" disabled={loading || !password}>
          {loading ? <span className="a-spin" /> : 'Sign in'}
        </button>
        <a className="a-gate__back" href="/">
          Back to the site
        </a>
      </form>
    </div>
  );
}

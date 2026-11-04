import { lazy, Suspense } from 'react';
import { Landing } from './site/Landing';
import { useVisitorTracker } from './hooks/useVisitorTracker';

// The admin console is code-split so it never ships with the landing page.
const AdminLayout = lazy(() =>
  import('./components/admin/AdminLayout').then((m) => ({ default: m.AdminLayout }))
);

function isAdminPath() {
  return typeof window !== 'undefined' && window.location.pathname.toLowerCase().startsWith('/admin');
}

export function App() {
  // First-party visitor analytics (skips /admin internally).
  useVisitorTracker();

  if (isAdminPath()) {
    return (
      <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f6f7fb' }} />}>
        <AdminLayout />
      </Suspense>
    );
  }

  // The marketing site owns its own tokens (src/site/site.css).
  return <Landing />;
}

export default App;

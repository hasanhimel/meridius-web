import { lazy, Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
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
      <ThemeProvider>
        <Suspense
          fallback={
            <div className="min-h-screen bg-cream dark:bg-void flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-charcoal/20 dark:border-cream/20 border-t-charcoal dark:border-t-cream animate-spin" />
            </div>
          }
        >
          <AdminLayout />
        </Suspense>
      </ThemeProvider>
    );
  }

  // The marketing site owns its own tokens (src/site/site.css).
  return <Landing />;
}

export default App;

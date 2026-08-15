import { useEffect } from 'react';
import { trackPageView } from '../lib/supabase';

export function useVisitorTracker() {
  useEffect(() => {
    // Only track if not on admin page
    if (window.location.pathname.startsWith('/admin')) {
      return;
    }

    trackPageView(window.location.pathname);

    // Track hash navigation (e.g. #product, #comparison, #sync)
    const handleHashChange = () => {
      trackPageView(window.location.pathname + window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
}

import { useState, useEffect, lazy, Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MCPSection } from './components/mcp/MCPSection';
import { ProductSection } from './components/ProductSection';
import { ComparisonSection } from './components/ComparisonSection';
import { SyncSection } from './components/SyncSection';
import { Footer } from './components/Footer';
import { useVisitorTracker } from './hooks/useVisitorTracker';
import { SoftwareCursor } from './components/SoftwareCursor';

// Code-split admin and modal components to keep landing page bundle lightweight and secure
const AdminLayout = lazy(() =>
  import('./components/admin/AdminLayout').then((m) => ({ default: m.AdminLayout }))
);
const WaitlistModal = lazy(() =>
  import('./components/WaitlistModal').then((m) => ({ default: m.WaitlistModal }))
);

export function App() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    return typeof window !== 'undefined' && window.location.pathname.toLowerCase().startsWith('/admin');
  });

  // Automatic visitor and telemetry tracking
  useVisitorTracker();

  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.startsWith('/admin')) {
        setIsAdminRoute(true);
      } else {
        setIsAdminRoute(false);
        if (path === '/' || path === '') {
          // Landing/main big logo page at first
          window.scrollTo({ top: 0, behavior: 'instant' });
        } else if (path === '/product') {
          setTimeout(() => document.getElementById('product')?.scrollIntoView({ behavior: 'smooth' }), 150);
        } else if (path === '/comparison') {
          setTimeout(() => document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' }), 150);
        } else if (path === '/sync') {
          setTimeout(() => document.getElementById('sync')?.scrollIntoView({ behavior: 'smooth' }), 150);
        } else if (path === '/mcp' || path === '/integrations') {
          setTimeout(() => document.getElementById('mcp')?.scrollIntoView({ behavior: 'smooth' }), 150);
        }
      }
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
    };
  }, []);

  return (
    <ThemeProvider>
      {/* Native Meridius Software-Rendered Interactive Cursor (Intro flight active on landing, skipped on /admin) */}
      <SoftwareCursor skipIntro={isAdminRoute} />

      {isAdminRoute ? (
        <Suspense fallback={
          <div className="min-h-screen bg-cream dark:bg-void flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-charcoal/20 dark:border-cream/20 border-t-charcoal dark:border-t-cream animate-spin" />
          </div>
        }>
          <AdminLayout />
        </Suspense>
      ) : (
        <div className="min-h-screen bg-cream dark:bg-void text-charcoal dark:text-cream selection:bg-charcoal/15 dark:selection:bg-cream/15 flex flex-col transition-colors duration-200">
          {/* Navigation */}
          <Navbar onOpenWaitlist={() => setIsWaitlistOpen(true)} />

          {/* Main Single-Page Content: Landing Hero at first, MCP at very last */}
          <main className="flex-grow">
            <HeroSection onOpenWaitlist={() => setIsWaitlistOpen(true)} />
            <ProductSection />
            <ComparisonSection />
            <SyncSection onOpenWaitlist={() => setIsWaitlistOpen(true)} />
            <MCPSection onOpenWaitlist={() => setIsWaitlistOpen(true)} />
          </main>

          {/* Footer */}
          <Footer />

          {/* Waitlist Modal */}
          {isWaitlistOpen && (
            <Suspense fallback={null}>
              <WaitlistModal 
                isOpen={isWaitlistOpen} 
                onClose={() => setIsWaitlistOpen(false)} 
              />
            </Suspense>
          )}
        </div>
      )}
    </ThemeProvider>
  );
}

export default App;

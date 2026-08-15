import { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductSection } from './components/ProductSection';
import { ComparisonSection } from './components/ComparisonSection';
import { SyncSection } from './components/SyncSection';
import { Footer } from './components/Footer';
import { WaitlistModal } from './components/WaitlistModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { useVisitorTracker } from './hooks/useVisitorTracker';

export function App() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  // Automatic visitor and telemetry tracking
  useVisitorTracker();

  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      setIsAdminRoute(path.startsWith('/admin') || hash === '#admin');
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  return (
    <ThemeProvider>
      {isAdminRoute ? (
        <AdminLayout />
      ) : (
        <div className="min-h-screen bg-cream dark:bg-void text-charcoal dark:text-cream selection:bg-charcoal/15 dark:selection:bg-cream/15 flex flex-col transition-colors duration-200">
          {/* Navigation */}
          <Navbar onOpenWaitlist={() => setIsWaitlistOpen(true)} />

          {/* Main Single-Page Content */}
          <main className="flex-grow">
            <HeroSection onOpenWaitlist={() => setIsWaitlistOpen(true)} />
            <ProductSection />
            <ComparisonSection />
            <SyncSection onOpenWaitlist={() => setIsWaitlistOpen(true)} />
          </main>

          {/* Footer */}
          <Footer />

          {/* Waitlist Modal */}
          <WaitlistModal 
            isOpen={isWaitlistOpen} 
            onClose={() => setIsWaitlistOpen(false)} 
          />
        </div>
      )}
    </ThemeProvider>
  );
}

export default App;

import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductSection } from './components/ProductSection';
import { ComparisonSection } from './components/ComparisonSection';
import { SyncSection } from './components/SyncSection';
import { Footer } from './components/Footer';
import { WaitlistModal } from './components/WaitlistModal';

export function App() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
}

export default App;

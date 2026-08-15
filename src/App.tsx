import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ArchitectureSection } from './components/ArchitectureSection';
import { ComparisonSection } from './components/ComparisonSection';
import { FounderSection } from './components/FounderSection';
import { Footer } from './components/Footer';
import { WaitlistModal } from './components/WaitlistModal';

export function App() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-cream dark:bg-void text-charcoal dark:text-cream selection:bg-charcoal/15 dark:selection:bg-cream/15 flex flex-col transition-colors duration-200">
        {/* Navigation */}
        <Navbar onOpenWaitlist={() => setIsWaitlistOpen(true)} />

        {/* Main Content */}
        <main className="flex-grow">
          <HeroSection onOpenWaitlist={() => setIsWaitlistOpen(true)} />
          <ArchitectureSection />
          <ComparisonSection />
          <FounderSection onOpenWaitlist={() => setIsWaitlistOpen(true)} />
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

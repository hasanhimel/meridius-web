import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  onOpenWaitlist: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenWaitlist }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const navigateTo = (e: React.MouseEvent, path: string, elementId?: string) => {
    e.preventDefault();
    window.history.pushState(null, '', path);
    if (elementId) {
      document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-charcoal/[0.08] dark:border-cream/[0.08] bg-cream/80 dark:bg-void/80 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <a 
          href="/" 
          onClick={(e) => navigateTo(e, '/')}
          className="flex items-center gap-2.5 sm:gap-3 group"
        >
          <img 
            src={isDark ? "/assets/logo/meridius-mark-white.svg" : "/assets/logo/meridius-mark-black.svg"} 
            alt="Meridius" 
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain opacity-100 transition-transform group-hover:scale-105 shrink-0"
          />
          <span className="font-brand font-extrabold text-base sm:text-[18px] tracking-[0.02em] uppercase text-charcoal dark:text-cream transition-colors">
            MERIDIUS
          </span>
        </a>

        {/* Clean Nav Links (No '#' symbols) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-sans text-charcoal-muted dark:text-cream-muted">
          <a 
            href="/product" 
            onClick={(e) => navigateTo(e, '/product', 'product')}
            className="hover:text-charcoal dark:hover:text-cream transition-colors"
          >
            Product
          </a>
          <a 
            href="/comparison" 
            onClick={(e) => navigateTo(e, '/comparison', 'comparison')}
            className="hover:text-charcoal dark:hover:text-cream transition-colors"
          >
            Comparison
          </a>
          <a 
            href="/sync" 
            onClick={(e) => navigateTo(e, '/sync', 'sync')}
            className="hover:text-charcoal dark:hover:text-cream transition-colors"
          >
            Sync
          </a>
        </nav>

        {/* Theme Toggle & CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <button
            onClick={onOpenWaitlist}
            className="cursor-btn-primary px-3.5 py-1.5 rounded-full text-xs font-sans flex items-center gap-1 shrink-0 shadow-sm"
          >
            <span>Join Waitlist</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </header>
  );
};

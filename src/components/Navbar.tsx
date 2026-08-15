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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-charcoal/[0.08] dark:border-cream/[0.08] bg-cream/80 dark:bg-void/80 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <a href="#" className="flex items-center gap-2.5 sm:gap-3 group">
          <img 
            src={isDark ? "/assets/logo/meridius-mark-white.svg" : "/assets/logo/meridius-mark-black.svg"} 
            alt="Meridius" 
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain opacity-100 transition-transform group-hover:scale-105 shrink-0"
          />
          <span className="font-brand font-extrabold text-base sm:text-[18px] tracking-[0.02em] uppercase text-charcoal dark:text-cream transition-colors">
            MERIDIUS
          </span>
        </a>

        {/* Minimal Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-sans text-charcoal-muted dark:text-cream-muted">
          <a href="#how-it-works" className="hover:text-charcoal dark:hover:text-cream transition-colors">
            How it works
          </a>
          <a href="#comparison" className="hover:text-charcoal dark:hover:text-cream transition-colors">
            Comparison
          </a>
          <a href="#sync" className="hover:text-charcoal dark:hover:text-cream transition-colors">
            Sync
          </a>
          <a href="#founder" className="hover:text-charcoal dark:hover:text-cream transition-colors">
            Founder
          </a>
        </nav>

        {/* Theme Toggle & CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <button
            onClick={onOpenWaitlist}
            className="cursor-btn-primary px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-sans flex items-center gap-1 sm:gap-1.5 shadow-sm"
          >
            <span>Request Access</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
};

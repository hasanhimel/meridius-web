import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const Footer: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <footer className="border-t border-charcoal/[0.08] dark:border-cream/[0.08] py-12 bg-cream dark:bg-void transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-charcoal-muted dark:text-cream-dim text-center sm:text-left">
        <div className="flex items-center gap-2.5">
          <img 
            src={isDark ? "/assets/logo/meridius-mark-white.svg" : "/assets/logo/meridius-mark-black.svg"} 
            alt="Meridius" 
            className="w-3.5 h-3.5 object-contain opacity-80"
          />
          <span className="text-charcoal dark:text-cream tracking-wider font-semibold">MERIDIUS</span>
          <span>© {new Date().getFullYear()}</span>
        </div>

        <div>
          Built by Himel Hasan · Dhaka → San Francisco
        </div>
      </div>
    </footer>
  );
};

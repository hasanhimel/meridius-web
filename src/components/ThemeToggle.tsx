import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  return (
    <div className={`relative flex items-center ${className}`}>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full frosted-glass-pill text-charcoal-muted dark:text-cream-muted hover:text-charcoal dark:hover:text-cream transition-all flex items-center justify-center shadow-sm"
        title={`Current theme: ${theme} (${resolvedTheme}). Click to switch.`}
        aria-label="Toggle color theme"
      >
        {resolvedTheme === 'dark' ? (
          <Moon className="w-3.5 h-3.5" />
        ) : (
          <Sun className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
};

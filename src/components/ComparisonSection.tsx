import React from 'react';

export const ComparisonSection: React.FC = () => {
  return (
    <section id="comparison" className="py-16 sm:py-24 border-t border-charcoal/[0.08] dark:border-cream/[0.08] bg-cream dark:bg-void transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 sm:mb-14">
          <div className="text-xs font-mono text-charcoal-muted dark:text-cream-dim uppercase tracking-wider mb-2">
            Engineering
          </div>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl text-charcoal dark:text-cream tracking-tight mb-3 sm:mb-4">
            Why not just existing tools?
          </h2>
          <p className="text-charcoal-muted dark:text-cream-muted text-sm sm:text-base leading-relaxed">
            Every other computer-use tool on the market solves part of this and breaks somewhere else.
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          
          <div className="p-5 sm:p-6 rounded-2xl frosted-glass transition-colors">
            <h4 className="font-mono text-sm font-semibold text-charcoal dark:text-cream mb-1.5">
              Codex Computer Use
            </h4>
            <p className="text-xs sm:text-sm text-charcoal-muted dark:text-cream-muted leading-relaxed font-sans">
              Avoids hijacking your cursor, but macOS occasionally forces the app it's controlling to the foreground anyway, on top of your active work.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl frosted-glass transition-colors">
            <h4 className="font-mono text-sm font-semibold text-charcoal dark:text-cream mb-1.5">
              Claude Computer Use (via Cowork)
            </h4>
            <p className="text-xs sm:text-sm text-charcoal-muted dark:text-cream-muted leading-relaxed font-sans">
              Takes your entire screen and cursor outright. You watch it work or you wait until it finishes.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl frosted-glass transition-colors">
            <h4 className="font-mono text-sm font-semibold text-charcoal dark:text-cream mb-1.5">
              Coasty
            </h4>
            <p className="text-xs sm:text-sm text-charcoal-muted dark:text-cream-muted leading-relaxed font-sans">
              Solved isolation by moving the task to a cloud VM, but that means it's not your machine, not your logged-in apps, and not your real environment.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl frosted-glass transition-colors">
            <h4 className="font-mono text-sm font-semibold text-charcoal dark:text-cream mb-1.5">
              Hermes Agent (via cua-driver)
            </h4>
            <p className="text-xs sm:text-sm text-charcoal-muted dark:text-cream-muted leading-relaxed font-sans">
              Keeps the app backgrounded using undocumented macOS system calls, which can break on any OS update, and still runs on your one real display.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl frosted-glass border-charcoal/25 dark:border-cream/25 shadow-md transition-colors">
            <h4 className="font-display text-sm sm:text-base font-semibold text-charcoal dark:text-cream mb-1.5 sm:mb-2">
              Meridius
            </h4>
            <p className="text-xs sm:text-sm text-charcoal dark:text-cream leading-relaxed font-sans font-medium">
              Meridius is the only one that gets both: a genuinely separate display, and it's still your Mac, your real apps, your real logins.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

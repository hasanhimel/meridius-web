import React from 'react';

export const ArchitectureSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 border-t border-charcoal/[0.08] dark:border-cream/[0.08] bg-cream dark:bg-void transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-xl mb-12 sm:mb-16">
          <div className="text-xs font-mono text-charcoal-muted dark:text-cream-dim uppercase tracking-wider mb-2">
            Architecture
          </div>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl text-charcoal dark:text-cream tracking-tight mb-3 sm:mb-4">
            A second display, not a trick.
          </h2>
          <p className="text-charcoal-muted dark:text-cream-muted text-sm sm:text-base leading-relaxed">
            There are two displays. You only ever see one. Meridius lives on the other one.
          </p>
        </div>

        {/* 3 Beats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          <div className="border-t border-charcoal/[0.12] dark:border-cream/[0.12] pt-5 sm:pt-6 transition-colors">
            <div className="text-xs font-mono text-charcoal-dim dark:text-cream-dim mb-2.5">01 / Display</div>
            <h3 className="font-display font-semibold text-base sm:text-lg text-charcoal dark:text-cream mb-2">
              Hardware-level separation
            </h3>
            <p className="text-sm text-charcoal-muted dark:text-cream-muted font-sans leading-relaxed">
              Meridius creates a second, invisible display that your Mac actually renders. Not a cloud VM. Not a background process pretending to be invisible.
            </p>
          </div>

          <div className="border-t border-charcoal/[0.12] dark:border-cream/[0.12] pt-5 sm:pt-6 transition-colors">
            <div className="text-xs font-mono text-charcoal-dim dark:text-cream-dim mb-2.5">02 / Authentication</div>
            <h3 className="font-display font-semibold text-base sm:text-lg text-charcoal dark:text-cream mb-2">
              Your real native apps
            </h3>
            <p className="text-sm text-charcoal-muted dark:text-cream-muted font-sans leading-relaxed">
              Your real apps open there, fully logged in, fully native. Meridius clicks, types, and navigates them with your actual session state and Keychain access.
            </p>
          </div>

          <div className="border-t border-charcoal/[0.12] dark:border-cream/[0.12] pt-5 sm:pt-6 transition-colors">
            <div className="text-xs font-mono text-charcoal-dim dark:text-cream-dim mb-2.5">03 / Focus</div>
            <h3 className="font-display font-semibold text-base sm:text-lg text-charcoal dark:text-cream mb-2">
              Zero cursor movement
            </h3>
            <p className="text-sm text-charcoal-muted dark:text-cream-muted font-sans leading-relaxed">
              Your own screen and cursor never move. You can keep working the entire time, or talk to it out loud while it gets the work done.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

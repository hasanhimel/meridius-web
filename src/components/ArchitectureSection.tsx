import React from 'react';

export const ArchitectureSection: React.FC = () => {
  return (
    <section id="capabilities" className="py-16 sm:py-24 border-t border-charcoal/[0.08] dark:border-cream/[0.08] bg-cream dark:bg-void transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-xl mb-12 sm:mb-16">
          <div className="text-xs font-mono text-charcoal-muted dark:text-cream-dim uppercase tracking-wider mb-2">
            Outcomes
          </div>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl text-charcoal dark:text-cream tracking-tight mb-3 sm:mb-4">
            Real computer work, zero interference.
          </h2>
          <p className="text-charcoal-muted dark:text-cream-muted text-sm sm:text-base leading-relaxed">
            You stay in your flow. Meridius gets the work done in parallel on your Mac.
          </p>
        </div>

        {/* 3 Outcome Beats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          <div className="border-t border-charcoal/[0.12] dark:border-cream/[0.12] pt-5 sm:pt-6 transition-colors">
            <div className="text-xs font-mono text-charcoal-dim dark:text-cream-dim mb-2.5">01 / Flow</div>
            <h3 className="font-display font-semibold text-base sm:text-lg text-charcoal dark:text-cream mb-2">
              Uninterrupted Parallel Execution
            </h3>
            <p className="text-sm text-charcoal-muted dark:text-cream-muted font-sans leading-relaxed">
              Keep coding, writing documents, or presenting on calls. Meridius performs tasks simultaneously without stealing your cursor or ever forcing background windows onto your screen.
            </p>
          </div>

          <div className="border-t border-charcoal/[0.12] dark:border-cream/[0.12] pt-5 sm:pt-6 transition-colors">
            <div className="text-xs font-mono text-charcoal-dim dark:text-cream-dim mb-2.5">02 / Ecosystem</div>
            <h3 className="font-display font-semibold text-base sm:text-lg text-charcoal dark:text-cream mb-2">
              Your Real Apps & Logins
            </h3>
            <p className="text-sm text-charcoal-muted dark:text-cream-muted font-sans leading-relaxed">
              Works directly with your actual installed Mac software, logged-in browser sessions, and Keychain credentials. No fresh sandboxes, no re-authenticating, and no disconnected cloud VMs.
            </p>
          </div>

          <div className="border-t border-charcoal/[0.12] dark:border-cream/[0.12] pt-5 sm:pt-6 transition-colors">
            <div className="text-xs font-mono text-charcoal-dim dark:text-cream-dim mb-2.5">03 / Privacy</div>
            <h3 className="font-display font-semibold text-base sm:text-lg text-charcoal dark:text-cream mb-2">
              Local Privacy & Model Freedom
            </h3>
            <p className="text-sm text-charcoal-muted dark:text-cream-muted font-sans leading-relaxed">
              Connect to your favorite cloud models or run entirely offline with local models. Your screen visuals, private files, and sensitive credentials stay strictly on your personal Mac.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

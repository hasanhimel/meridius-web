import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FounderSectionProps {
  onOpenWaitlist: () => void;
}

export const FounderSection: React.FC<FounderSectionProps> = ({ onOpenWaitlist }) => {
  return (
    <section id="founder" className="py-16 sm:py-24 border-t border-charcoal/[0.08] dark:border-cream/[0.08] bg-cream dark:bg-void transition-colors duration-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Sync teaser */}
        <div className="mb-12 sm:mb-16 border-l-2 border-charcoal/30 dark:border-cream/30 pl-4 sm:pl-6 transition-colors">
          <div className="text-xs font-mono text-charcoal-muted dark:text-cream-dim uppercase tracking-wider mb-2">
            Next / Meridius Sync
          </div>
          <h3 className="font-display font-semibold text-lg sm:text-xl text-charcoal dark:text-cream mb-2">
            Multiple machines. One shared project brain.
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-muted dark:text-cream-muted font-sans leading-relaxed">
            Next, we're building Meridius Sync: multiple people's Meridius instances working on the same shared project, each running locally on its own machine, coordinating automatically, whether that's two co-founders or an entire company running on a shared brain.
          </p>
        </div>

        {/* Founder note card in Frosted Glass */}
        <div className="p-6 sm:p-8 md:p-10 rounded-2xl frosted-glass transition-colors">
          <blockquote className="font-sans text-base sm:text-lg text-charcoal dark:text-cream leading-relaxed mb-6">
            "Hi YC, I'm Himel, a computer science senior, and I'm building Meridius. It's an AI that runs your Mac for you, without ever touching your screen. I built it alone in ten days, code, design, all of it. Now I need speed: people who've done this before, and the money to move faster than I can alone."
          </blockquote>

          <div className="pt-5 sm:pt-6 border-t border-charcoal/[0.08] dark:border-cream/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6 transition-colors">
            <div>
              <div className="font-display font-semibold text-sm text-charcoal dark:text-cream">
                Himel Hasan
              </div>
              <div className="text-xs font-mono text-charcoal-muted dark:text-cream-dim mt-0.5">
                Founder & CEO · Dhaka → San Francisco
              </div>
            </div>

            <button
              onClick={onOpenWaitlist}
              className="cursor-btn-primary px-5 py-2.5 sm:py-2 rounded-full text-xs font-sans flex items-center justify-center gap-1.5 self-stretch sm:self-auto shadow-sm"
            >
              <span>Join the Waitlist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

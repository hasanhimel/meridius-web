import React from 'react';
import { ArrowRight, Network } from 'lucide-react';

interface FounderSectionProps {
  onOpenWaitlist: () => void;
}

export const FounderSection: React.FC<FounderSectionProps> = ({ onOpenWaitlist }) => {
  return (
    <section id="sync" className="py-16 sm:py-24 border-t border-charcoal/[0.08] dark:border-cream/[0.08] bg-cream dark:bg-void transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Meridius Sync Vision — The Collective Company Brain */}
        <div className="mb-16 sm:mb-20 p-8 sm:p-10 rounded-3xl frosted-glass border border-charcoal/[0.12] dark:border-cream/[0.12] transition-colors relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full frosted-glass-pill text-[11px] font-mono text-charcoal-muted dark:text-cream-dim uppercase tracking-wider mb-4">
              <Network className="w-3.5 h-3.5" />
              <span>The Next Frontier · Meridius Sync</span>
            </div>

            <h3 className="font-display font-semibold text-2xl sm:text-3xl text-charcoal dark:text-cream mb-4 tracking-tight">
              Multiple instances. One shared company brain.
            </h3>

            <p className="text-sm sm:text-base text-charcoal-muted dark:text-cream-muted font-sans leading-relaxed mb-6 max-w-2xl">
              Imagine your entire team's Meridius instances working together on shared initiatives. Each teammate's Meridius runs natively on their own Mac, understanding their unique local context and workflows, and automatically coordinates across the team to form a living, collective <strong>Company Brain</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-charcoal/[0.08] dark:border-cream/[0.08]">
              <div>
                <div className="font-display font-semibold text-sm text-charcoal dark:text-cream mb-1">
                  Multiplayer Agents
                </div>
                <div className="text-xs text-charcoal-muted dark:text-cream-dim leading-relaxed">
                  Agents coordinate across machines to execute complex cross-team workflows in parallel.
                </div>
              </div>

              <div>
                <div className="font-display font-semibold text-sm text-charcoal dark:text-cream mb-1">
                  Collective Intelligence
                </div>
                <div className="text-xs text-charcoal-muted dark:text-cream-dim leading-relaxed">
                  Each instance contributes contextual knowledge without exposing private user logins.
                </div>
              </div>

              <div>
                <div className="font-display font-semibold text-sm text-charcoal dark:text-cream mb-1">
                  Autonomous Sync
                </div>
                <div className="text-xs text-charcoal-muted dark:text-cream-dim leading-relaxed">
                  Two co-founders or an entire 500-person company executing in perfect alignment.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Founder Note */}
        <div id="founder" className="p-6 sm:p-8 md:p-10 rounded-2xl frosted-glass transition-colors">
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

import React from 'react';
import { DynamicCompanyBrainArtwork } from './DynamicCompanyBrainArtwork';
import { Network, Users, Cpu, Compass } from 'lucide-react';

interface SyncSectionProps {
  onOpenWaitlist?: () => void;
}

export const SyncSection: React.FC<SyncSectionProps> = () => {
  return (
    <section id="sync" className="py-16 sm:py-24 border-t border-charcoal/[0.08] dark:border-cream/[0.08] bg-cream dark:bg-void transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (OpenWork-style) */}
        <div className="max-w-2xl mb-10 sm:mb-12">
          <div className="text-xs font-mono text-charcoal-muted dark:text-cream-dim uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Network className="w-3.5 h-3.5 text-signal" />
            <span>Meridius Sync · Multiplayer Intelligence</span>
          </div>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl text-charcoal dark:text-cream tracking-tight mb-3 sm:mb-4">
            Multiple instances. One shared company brain.
          </h2>
          <p className="text-charcoal-muted dark:text-cream-muted text-sm sm:text-base leading-relaxed">
            Connect team members' native Meridius instances to build a living, collective intelligence. Each instance coordinates locally without centralizing sensitive credentials.
          </p>
        </div>

        {/* Dynamic Animated Company Brain Visual */}
        <div className="mb-12">
          <DynamicCompanyBrainArtwork />
        </div>

        {/* 3 Capabilities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pt-8 border-t border-charcoal/[0.08] dark:border-cream/[0.08]">
          
          <div className="flex flex-col">
            <div className="w-8 h-8 rounded-xl frosted-glass flex items-center justify-center text-signal mb-3 border border-charcoal/[0.08] dark:border-cream/[0.08] shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-xs font-mono text-charcoal-dim dark:text-cream-dim mb-1.5">01 / Distributed Swarm</div>
            <h3 className="font-display font-semibold text-base sm:text-lg text-charcoal dark:text-cream mb-2">
              Multiplayer Agent Mesh
            </h3>
            <p className="text-sm text-charcoal-muted dark:text-cream-muted font-sans leading-relaxed">
              Teammates' agents coordinate across separate machines to execute multi-step cross-functional initiatives in parallel.
            </p>
          </div>

          <div className="flex flex-col">
            <div className="w-8 h-8 rounded-xl frosted-glass flex items-center justify-center text-signal mb-3 border border-charcoal/[0.08] dark:border-cream/[0.08] shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="text-xs font-mono text-charcoal-dim dark:text-cream-dim mb-1.5">02 / Shared Knowledge</div>
            <h3 className="font-display font-semibold text-base sm:text-lg text-charcoal dark:text-cream mb-2">
              Collective Company Brain
            </h3>
            <p className="text-sm text-charcoal-muted dark:text-cream-muted font-sans leading-relaxed">
              Shares synthesized context, progress, and team insights dynamically across projects without exposing raw user tokens.
            </p>
          </div>

          <div className="flex flex-col">
            <div className="w-8 h-8 rounded-xl frosted-glass flex items-center justify-center text-signal mb-3 border border-charcoal/[0.08] dark:border-cream/[0.08] shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div className="text-xs font-mono text-charcoal-dim dark:text-cream-dim mb-1.5">03 / Continuous Sync</div>
            <h3 className="font-display font-semibold text-base sm:text-lg text-charcoal dark:text-cream mb-2">
              Autonomous Alignment
            </h3>
            <p className="text-sm text-charcoal-muted dark:text-cream-muted font-sans leading-relaxed">
              Two co-founders or an entire 500-person organization executing simultaneously in complete lockstep.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

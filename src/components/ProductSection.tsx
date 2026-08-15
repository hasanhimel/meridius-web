import React from 'react';
import { ParallelExecutionSvg } from './ProductArtwork';

export const ProductSection: React.FC = () => {
  return (
    <section id="product" className="py-16 sm:py-24 border-t border-charcoal/[0.08] dark:border-cream/[0.08] bg-cream dark:bg-void transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (OpenWork-style) */}
        <div className="max-w-2xl mb-10 sm:mb-12">
          <div className="text-xs font-mono text-charcoal-muted dark:text-cream-dim uppercase tracking-wider mb-2">
            Product · Workflow Automation
          </div>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl text-charcoal dark:text-cream tracking-tight mb-3 sm:mb-4">
            Your computer works while you stay focused.
          </h2>
          <p className="text-charcoal-muted dark:text-cream-muted text-sm sm:text-base leading-relaxed">
            Turn natural requests into autonomous actions across your native Mac software — without watching cursors move or waiting for background tasks to finish.
          </p>
        </div>

        {/* SVG Interactive Visual Diagram */}
        <div className="mb-12">
          <ParallelExecutionSvg />
        </div>

        {/* 3 Outcome Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          <div className="border-t border-charcoal/[0.12] dark:border-cream/[0.12] pt-5 sm:pt-6 transition-colors">
            <div className="text-xs font-mono text-charcoal-dim dark:text-cream-dim mb-2">01 / Focus</div>
            <h3 className="font-display font-semibold text-base sm:text-lg text-charcoal dark:text-cream mb-2">
              Zero Screen Takeover
            </h3>
            <p className="text-sm text-charcoal-muted dark:text-cream-muted font-sans leading-relaxed">
              Keep coding, designing in Figma, or presenting on Zoom. Meridius executes tasks in parallel without ever stealing your mouse or popping windows over your active work.
            </p>
          </div>

          <div className="border-t border-charcoal/[0.12] dark:border-cream/[0.12] pt-5 sm:pt-6 transition-colors">
            <div className="text-xs font-mono text-charcoal-dim dark:text-cream-dim mb-2">02 / Authentication</div>
            <h3 className="font-display font-semibold text-base sm:text-lg text-charcoal dark:text-cream mb-2">
              Your Real Native Apps
            </h3>
            <p className="text-sm text-charcoal-muted dark:text-cream-muted font-sans leading-relaxed">
              Interacts directly with your already logged-in desktop software, Keychain passwords, and browser sessions. No fresh sandboxes, no re-authenticating, and no cloud VMs.
            </p>
          </div>

          <div className="border-t border-charcoal/[0.12] dark:border-cream/[0.12] pt-5 sm:pt-6 transition-colors">
            <div className="text-xs font-mono text-charcoal-dim dark:text-cream-dim mb-2">03 / Privacy</div>
            <h3 className="font-display font-semibold text-base sm:text-lg text-charcoal dark:text-cream mb-2">
              Local Model Freedom
            </h3>
            <p className="text-sm text-charcoal-muted dark:text-cream-muted font-sans leading-relaxed">
              Bring any cloud model or run completely private offline with local models (Ollama/LM Studio). Your files, visual information, and accounts never leave your personal Mac.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

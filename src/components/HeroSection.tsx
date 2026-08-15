import React, { useState } from 'react';
import { AnimatedLogoMark } from './AnimatedLogoMark';
import { ArrowRight, Check } from 'lucide-react';

interface HeroSectionProps {
  onOpenWaitlist?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 sm:py-16 md:py-20 lg:py-24 bg-cream dark:bg-void bg-subtle-dots transition-colors duration-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Two-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* ============================================================ */}
          {/* LEFT: CURSOR-INSPIRED MINIMALIST TYPOGRAPHY & COPY */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left w-full">
            
            {/* Frosted Glass Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full frosted-glass-pill text-[11px] sm:text-xs font-mono text-charcoal-muted dark:text-cream-muted mb-6 transition-colors max-w-full truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-charcoal dark:bg-cream shrink-0" />
              <span className="truncate">Two displays. You only ever see one.</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-[48px] xl:text-[56px] tracking-tight text-charcoal dark:text-cream leading-[1.12] mb-6 transition-colors">
              Computer-using AI that never touches your screen.
            </h1>

            {/* Locked Copy Product Description */}
            <p className="text-sm sm:text-base md:text-lg text-charcoal-muted dark:text-cream-muted font-sans leading-relaxed max-w-xl mb-8 transition-colors">
              Meridius is a native Mac app that gives your computer a second display, one your own Mac renders and fully controls, completely separate from the screen in front of you. Meridius opens your real apps there and clicks, types, and navigates them exactly like you would, while your actual screen and cursor stay completely free.
            </p>

            {/* Frosted Glass CTA Input Pill */}
            <div className="w-full max-w-md mb-8 sm:mb-10">
              <form onSubmit={handleInlineSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 rounded-2xl sm:rounded-full frosted-glass-pill transition-all">
                <input
                  type="email"
                  required
                  placeholder="Enter your work email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent px-4 py-2 text-sm text-charcoal dark:text-cream placeholder-charcoal-muted/60 dark:placeholder-cream-muted/60 focus:outline-none font-sans min-w-0"
                />
                <button
                  type="submit"
                  className="cursor-btn-primary px-5 py-2.5 sm:py-2 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
                >
                  {submitted ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <span>Request Access</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* 3 Quiet Hardware Facts */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 sm:pt-8 border-t border-charcoal/[0.08] dark:border-cream/[0.08] w-full max-w-lg transition-colors">
              <div>
                <div className="font-mono text-sm sm:text-base md:text-lg font-semibold text-charcoal dark:text-cream">0px</div>
                <div className="text-[11px] sm:text-xs font-mono text-charcoal-muted dark:text-cream-dim mt-0.5">Cursor Takeover</div>
              </div>

              <div>
                <div className="font-mono text-sm sm:text-base md:text-lg font-semibold text-charcoal dark:text-cream">2nd</div>
                <div className="text-[11px] sm:text-xs font-mono text-charcoal-muted dark:text-cream-dim mt-0.5">macOS Display</div>
              </div>

              <div>
                <div className="font-mono text-sm sm:text-base md:text-lg font-semibold text-charcoal dark:text-cream">100%</div>
                <div className="text-[11px] sm:text-xs font-mono text-charcoal-muted dark:text-cream-dim mt-0.5">Local Logins</div>
              </div>
            </div>

          </div>

          {/* ============================================================ */}
          {/* RIGHT: FLUID RESPONSIVE ANIMATED MERIDIUS LOGO MARK */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 xl:col-span-6 flex items-center justify-center w-full py-4 lg:py-0">
            <div className="relative w-full max-w-[280px] sm:max-w-[380px] md:max-w-[440px] lg:max-w-[500px] xl:max-w-[540px] aspect-square flex items-center justify-center mx-auto">
              <AnimatedLogoMark size={540} />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

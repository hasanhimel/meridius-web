import React, { useState } from 'react';
import { AnimatedLogoMark } from './AnimatedLogoMark';
import { ArrowRight, Check } from 'lucide-react';
import Dither from './Dither';
import { useTheme } from '../context/ThemeContext';

interface HeroSectionProps {
  onOpenWaitlist?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 sm:py-16 md:py-20 lg:py-24 bg-cream dark:bg-void transition-colors duration-200 overflow-hidden">
      
      {/* Interactive Dither Wave Ambient Background Canvas with 100% Transparent Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none opacity-[0.38] dark:opacity-[0.45] z-0">
        <Dither
          waveColor={isDark ? "#e5e5dc" : "#2B2B2A"}
          disableAnimation={false}
          enableMouseInteraction
          mouseRadius={0.3}
          waveAmplitude={0.37}
          waveFrequency={5.8}
          waveSpeed={0.04}
          colorNum={4}
          pixelSize={2.5}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 pointer-events-none">
        
        {/* Two-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* ============================================================ */}
          {/* LEFT: OPENWORK-INSPIRED HEADLINE & VALUE PROP */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left w-full pointer-events-auto">
            
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full frosted-glass-pill text-[11px] sm:text-xs font-mono text-charcoal-muted dark:text-cream-muted mb-6 transition-colors max-w-full truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="truncate">Parallel Mac Execution · Zero Cursor Hijacking</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-[48px] xl:text-[56px] tracking-tight text-charcoal dark:text-cream leading-[1.12] mb-6 transition-colors">
              Computer-using AI that never touches your screen.
            </h1>

            {/* Product Description */}
            <p className="text-sm sm:text-base md:text-lg text-charcoal-muted dark:text-cream-muted font-sans leading-relaxed max-w-xl mb-8 transition-colors">
              Meridius is the native Mac app that opens your real desktop applications and navigates them with your existing accounts and logins — while your active screen and cursor stay 100% free for your own work.
            </p>

            {/* Inline Email Waitlist Form */}
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
                      <span>Added to Waitlist</span>
                    </>
                  ) : (
                    <>
                      <span>Join the waitlist</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* 3 Core Highlights */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 sm:pt-8 border-t border-charcoal/[0.08] dark:border-cream/[0.08] w-full max-w-lg transition-colors">
              <div>
                <div className="font-mono text-sm sm:text-base md:text-lg font-semibold text-charcoal dark:text-cream">0px</div>
                <div className="text-[11px] sm:text-xs font-mono text-charcoal-muted dark:text-cream-dim mt-0.5">Cursor Takeover</div>
              </div>

              <div>
                <div className="font-mono text-sm sm:text-base md:text-lg font-semibold text-charcoal dark:text-cream">0%</div>
                <div className="text-[11px] sm:text-xs font-mono text-charcoal-muted dark:text-cream-dim mt-0.5">Window Popups</div>
              </div>

              <div>
                <div className="font-mono text-sm sm:text-base md:text-lg font-semibold text-charcoal dark:text-cream">100%</div>
                <div className="text-[11px] sm:text-xs font-mono text-charcoal-muted dark:text-cream-dim mt-0.5">Native & Private</div>
              </div>
            </div>

          </div>

          {/* ============================================================ */}
          {/* RIGHT: FLUID ANIMATED MERIDIUS LOGO MARK */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 xl:col-span-6 flex items-center justify-center w-full py-4 lg:py-0 pointer-events-auto">
            <div className="relative w-full max-w-[280px] sm:max-w-[380px] md:max-w-[440px] lg:max-w-[500px] xl:max-w-[540px] aspect-square flex items-center justify-center mx-auto">
              <AnimatedLogoMark size={540} />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

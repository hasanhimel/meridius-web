import React, { useState } from 'react';
import { MCPConstellation } from './MCPConstellation';
import { MCPMarquee } from './MCPMarquee';
import { Blocks, ArrowRight, ShieldCheck, Cpu, Layers, Sparkles } from 'lucide-react';

interface MCPSectionProps {
  onOpenWaitlist?: () => void;
}

export const MCPSection: React.FC<MCPSectionProps> = ({ onOpenWaitlist }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Integrations (18+)' },
    { id: 'google', label: 'Google Workspace (15)' },
    { id: 'communication', label: 'Communication & Chat' },
    { id: 'productivity', label: 'Docs & Knowledge' },
  ];

  return (
    <section 
      id="mcp" 
      className="py-16 sm:py-20 md:py-24 border-t border-charcoal/[0.08] dark:border-cream/[0.08] bg-cream dark:bg-void transition-colors duration-200 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-10 md:mb-12">
          <div className="max-w-2xl">
            <div className="text-xs font-mono text-charcoal-muted dark:text-cream-dim uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Blocks className="w-3.5 h-3.5 text-signal shrink-0" />
              <span>Model Context Protocol · Universal Connected Workspace</span>
            </div>
            <h2 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl text-charcoal dark:text-cream tracking-tight mb-3 sm:mb-4">
              One agent. Every tool you already work with.
            </h2>
            <p className="text-charcoal-muted dark:text-cream-muted text-sm sm:text-base leading-relaxed">
              Meridius natively connects to the entire Google Workspace suite, Notion, Discord, Slack, and extensible MCP servers. Your agent executes multi-app workflows in background isolation on your second display — while your active screen stays untouched.
            </p>
          </div>

          {/* Segmented Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl frosted-glass self-start lg:self-end max-w-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-sans font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-charcoal dark:bg-cream text-cream dark:text-charcoal shadow-sm'
                    : 'text-charcoal-muted dark:text-cream-muted hover:text-charcoal dark:hover:text-cream hover:bg-charcoal/[0.04] dark:hover:bg-cream/[0.04]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1. Dynamic Interactive Constellation Mesh (Unboxed Large Standalone Logos) */}
        <div className="mb-12 sm:mb-14 w-full">
          <MCPConstellation activeCategory={activeCategory} />
        </div>

        {/* 2. Ultra-Slow Cinematic Marquee (Pure Unboxed Standalone Logos) */}
        <div className="mb-14 w-full">
          <div className="text-xs font-mono uppercase tracking-wider text-charcoal-dim dark:text-cream-dim text-center mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-signal" />
            <span>Continuous Ecosystem Stream · 18+ Verified MCP Endpoints</span>
          </div>
          <MCPMarquee />
        </div>

        {/* 3 MCP Capability Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-8 border-t border-charcoal/[0.08] dark:border-cream/[0.08] mb-10 sm:mb-12">
          
          <div className="flex flex-col">
            <div className="w-8 h-8 rounded-xl frosted-glass flex items-center justify-center text-signal mb-3 border border-charcoal/[0.08] dark:border-cream/[0.08] shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="text-xs font-mono text-charcoal-dim dark:text-cream-dim mb-1.5">01 / Universal Standard</div>
            <h3 className="font-display font-semibold text-base sm:text-lg text-charcoal dark:text-cream mb-2">
              Model Context Protocol
            </h3>
            <p className="text-sm text-charcoal-muted dark:text-cream-muted font-sans leading-relaxed">
              Dynamically discovers tools, resources, and prompt schemas across standard stdio and SSE MCP servers with zero custom glue code.
            </p>
          </div>

          <div className="flex flex-col">
            <div className="w-8 h-8 rounded-xl frosted-glass flex items-center justify-center text-signal mb-3 border border-charcoal/[0.08] dark:border-cream/[0.08] shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div className="text-xs font-mono text-charcoal-dim dark:text-cream-dim mb-1.5">02 / Seamless Autonomy</div>
            <h3 className="font-display font-semibold text-base sm:text-lg text-charcoal dark:text-cream mb-2">
              Cross-App Synergy
            </h3>
            <p className="text-sm text-charcoal-muted dark:text-cream-muted font-sans leading-relaxed">
              Read customer tickets in Gmail, extract metrics in Sheets, and summarize updates directly to Notion and Slack in a single unbroken step.
            </p>
          </div>

          <div className="flex flex-col sm:col-span-2 lg:col-span-1">
            <div className="w-8 h-8 rounded-xl frosted-glass flex items-center justify-center text-signal mb-3 border border-charcoal/[0.08] dark:border-cream/[0.08] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xs font-mono text-charcoal-dim dark:text-cream-dim mb-1.5">03 / Native Security</div>
            <h3 className="font-display font-semibold text-base sm:text-lg text-charcoal dark:text-cream mb-2">
              Zero Token Relaying
            </h3>
            <p className="text-sm text-charcoal-muted dark:text-cream-muted font-sans leading-relaxed">
              All credentials and sessions stay protected inside your Mac's secure Keychain. No OAuth tokens or proprietary files ever touch external cloud servers.
            </p>
          </div>

        </div>

        {/* Bottom Fast Action Prompt */}
        {onOpenWaitlist && (
          <div className="p-6 sm:p-8 rounded-3xl frosted-glass border border-charcoal/[0.08] dark:border-cream/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="font-display font-semibold text-base sm:text-lg text-charcoal dark:text-cream">
                Want to connect your company's custom MCP tools?
              </div>
              <p className="text-xs sm:text-sm text-charcoal-muted dark:text-cream-muted font-sans">
                Meridius supports custom private endpoints and local tool registries out of the box.
              </p>
            </div>

            <button
              onClick={onOpenWaitlist}
              className="cursor-btn-primary px-5 py-2.5 rounded-full text-xs font-sans flex items-center justify-center gap-1.5 shrink-0 shadow-sm self-start sm:self-auto cursor-pointer"
            >
              <span>Get Early Access</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

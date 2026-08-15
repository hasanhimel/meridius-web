import React from 'react';
import { Check, X, AlertTriangle, Minus } from 'lucide-react';

export const ComparisonSection: React.FC = () => {
  const rows = [
    {
      feature: 'Separate display',
      meridius: 'check',
      codex: 'cross',
      claude: 'cross',
      coasty: 'cross',
      openwork: 'cross',
      hermes: 'cross',
      voiceos: 'na',
      clicky: 'na',
    },
    {
      feature: 'Never hijacks your cursor',
      meridius: 'check',
      codex: 'check',
      claude: 'cross',
      coasty: 'check',
      openwork: 'partial',
      hermes: 'check',
      voiceos: 'na',
      clicky: 'na',
    },
    {
      feature: 'Stays in background',
      meridius: 'check',
      codex: 'partial',
      claude: 'cross',
      coasty: 'na',
      openwork: 'cross',
      hermes: 'partial',
      voiceos: 'na',
      clicky: 'na',
    },
    {
      feature: 'Uses your real, logged-in apps',
      meridius: 'check',
      codex: 'check',
      claude: 'check',
      coasty: 'cross',
      openwork: 'partial',
      hermes: 'check',
      voiceos: 'na',
      clicky: 'na',
    },
    {
      feature: 'Local model option',
      meridius: 'check',
      codex: 'cross',
      claude: 'cross',
      coasty: 'cross',
      openwork: 'check',
      hermes: 'cross',
      voiceos: 'na',
      clicky: 'na',
    },
    {
      feature: 'Voice + memory',
      meridius: 'check',
      codex: 'check',
      claude: 'cross',
      coasty: 'cross',
      openwork: 'cross',
      hermes: 'cross',
      voiceos: 'check',
      clicky: 'check',
    },
    {
      feature: 'Team sync',
      meridius: 'planned',
      codex: 'cross',
      claude: 'cross',
      coasty: 'cross',
      openwork: 'partial',
      hermes: 'cross',
      voiceos: 'cross',
      clicky: 'cross',
    },
  ];

  return (
    <section id="comparison" className="py-16 sm:py-24 border-t border-charcoal/[0.08] dark:border-cream/[0.08] bg-cream dark:bg-void transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-8 sm:mb-12">
          <div className="text-xs font-mono text-charcoal-muted dark:text-cream-dim uppercase tracking-wider mb-2">
            Competitive Matrix
          </div>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl text-charcoal dark:text-cream tracking-tight mb-3">
            Meridius vs. Competitors
          </h2>
          <p className="text-charcoal-muted dark:text-cream-muted text-sm sm:text-base leading-relaxed">
            Direct capability matrix across the computer-use and autonomous AI landscape.
          </p>
        </div>

        {/* Minimalist Icon-Only Comparison Table */}
        <div className="overflow-x-auto rounded-2xl frosted-glass border border-charcoal/[0.08] dark:border-cream/[0.08] shadow-sm mb-5">
          <table className="w-full text-left border-collapse min-w-[880px] text-xs">
            <thead>
              <tr className="border-b border-charcoal/[0.08] dark:border-cream/[0.08] bg-white/50 dark:bg-white/[0.03]">
                <th className="py-4 px-5 font-mono font-semibold text-charcoal-muted dark:text-cream-dim uppercase tracking-wider w-[22%] sticky left-0 bg-cream/95 dark:bg-void/95 backdrop-blur-md z-10">
                  Feature
                </th>
                <th className="py-4 px-3.5 font-mono font-bold text-charcoal dark:text-cream tracking-wider text-center w-[12%] bg-charcoal/[0.04] dark:bg-cream/[0.05]">
                  Meridius
                </th>
                <th className="py-4 px-3 font-mono font-semibold text-charcoal-muted dark:text-cream-dim tracking-wider text-center w-[12%]">
                  Codex CU
                </th>
                <th className="py-4 px-3 font-mono font-semibold text-charcoal-muted dark:text-cream-dim tracking-wider text-center w-[11%]">
                  Claude Cowork
                </th>
                <th className="py-4 px-3 font-mono font-semibold text-charcoal-muted dark:text-cream-dim tracking-wider text-center w-[9%]">
                  Coasty
                </th>
                <th className="py-4 px-3 font-mono font-semibold text-charcoal-muted dark:text-cream-dim tracking-wider text-center w-[10%]">
                  OpenWork
                </th>
                <th className="py-4 px-3 font-mono font-semibold text-charcoal-muted dark:text-cream-dim tracking-wider text-center w-[12%]">
                  Hermes Agent
                </th>
                <th className="py-4 px-3 font-mono font-semibold text-charcoal-muted dark:text-cream-dim tracking-wider text-center w-[8%]">
                  VoiceOS
                </th>
                <th className="py-4 px-3 font-mono font-semibold text-charcoal-muted dark:text-cream-dim tracking-wider text-center w-[8%]">
                  Clicky
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/[0.06] dark:divide-cream/[0.06] font-sans">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/30 dark:hover:bg-white/[0.01] transition-colors">
                  {/* Feature Label */}
                  <td className="py-3.5 px-5 font-semibold text-charcoal dark:text-cream font-display sticky left-0 bg-cream/95 dark:bg-void/95 backdrop-blur-md z-10 border-r border-charcoal/[0.04] dark:border-cream/[0.04]">
                    {row.feature}
                  </td>

                  {/* Meridius Column */}
                  <td className="py-3.5 px-3.5 text-center bg-charcoal/[0.04] dark:bg-cream/[0.05]">
                    <div className="flex justify-center items-center">
                      {renderBadge(row.meridius)}
                    </div>
                  </td>

                  {/* Codex */}
                  <td className="py-3.5 px-3 text-center">
                    <div className="flex justify-center items-center">
                      {renderBadge(row.codex)}
                    </div>
                  </td>

                  {/* Claude */}
                  <td className="py-3.5 px-3 text-center">
                    <div className="flex justify-center items-center">
                      {renderBadge(row.claude)}
                    </div>
                  </td>

                  {/* Coasty */}
                  <td className="py-3.5 px-3 text-center">
                    <div className="flex justify-center items-center">
                      {renderBadge(row.coasty)}
                    </div>
                  </td>

                  {/* OpenWork */}
                  <td className="py-3.5 px-3 text-center">
                    <div className="flex justify-center items-center">
                      {renderBadge(row.openwork)}
                    </div>
                  </td>

                  {/* Hermes */}
                  <td className="py-3.5 px-3 text-center">
                    <div className="flex justify-center items-center">
                      {renderBadge(row.hermes)}
                    </div>
                  </td>

                  {/* VoiceOS */}
                  <td className="py-3.5 px-3 text-center">
                    <div className="flex justify-center items-center">
                      {renderBadge(row.voiceos)}
                    </div>
                  </td>

                  {/* Clicky */}
                  <td className="py-3.5 px-3 text-center">
                    <div className="flex justify-center items-center">
                      {renderBadge(row.clicky)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-mono text-charcoal-muted dark:text-cream-muted mb-12 px-1">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-emerald-600/80 dark:text-emerald-400/80 text-sm">✓</span>
            <span>works as claimed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-charcoal-muted/50 dark:text-cream-dim/50 text-sm">✗</span>
            <span>doesn't</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-amber-500/80 dark:text-amber-400/80 text-sm">⚠</span>
            <span>partial, breaks sometimes, or comes with a real tradeoff</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-charcoal-muted/30 dark:text-cream-dim/30 text-sm">—</span>
            <span>not applicable</span>
          </div>
        </div>

        {/* The 3 Things That Actually Matter */}
        <div className="rounded-2xl frosted-glass border border-charcoal/[0.08] dark:border-cream/[0.08] p-6 sm:p-8">
          <h3 className="font-display font-semibold text-base sm:text-lg text-charcoal dark:text-cream mb-4">
            The 3 things that actually matter
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-[13px] text-charcoal-muted dark:text-cream-muted font-sans leading-relaxed">
            <div className="space-y-1.5">
              <span className="font-semibold text-charcoal dark:text-cream font-display block text-sm">
                Codex & Hermes
              </span>
              <p>
                Try to stay backgrounded but slip occasionally, Codex because macOS forces the app forward sometimes, Hermes because it leans on undocumented Apple APIs. Meridius can't slip, the app is never on your real display.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-semibold text-charcoal dark:text-cream font-display block text-sm">
                Coasty & OpenWork
              </span>
              <p>
                <strong className="text-charcoal dark:text-cream font-medium">Coasty</strong> solves isolation by leaving your machine entirely, a cloud VM, so it loses your real, logged-in apps. <strong className="text-charcoal dark:text-cream font-medium">OpenWork</strong> does the same for browser tasks specifically, a separate signed-in browser, not your real one, so it avoids cursor hijacking there at the cost of your actual session. Its team plan also shares configs and skills, not live shared-project coordination like Meridius Sync.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-semibold text-charcoal dark:text-cream font-display block text-sm">
                VoiceOS & Clicky
              </span>
              <p>
                Aren't computer-use agents at all, they trigger actions through app connectors, not screen control.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

function renderBadge(type: string) {
  switch (type) {
    case 'check':
      return <Check className="w-4 h-4 text-emerald-600/80 dark:text-emerald-400/80 stroke-[2.25]" />;
    case 'cross':
      return <X className="w-3.5 h-3.5 text-charcoal-muted/45 dark:text-cream-dim/45 stroke-[2.25]" />;
    case 'partial':
      return <AlertTriangle className="w-3.5 h-3.5 text-amber-500/80 dark:text-amber-400/80 stroke-[2.25]" />;
    case 'planned':
      return (
        <span className="text-[11px] font-mono font-medium text-charcoal-muted dark:text-cream-dim">
          Planned
        </span>
      );
    case 'na':
    default:
      return <Minus className="w-3.5 h-3.5 text-charcoal-muted/30 dark:text-cream-dim/30" />;
  }
}

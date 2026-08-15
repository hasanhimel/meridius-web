import React from 'react';
import { Check, X, AlertTriangle, Minus } from 'lucide-react';

interface CellData {
  type: 'check' | 'cross' | 'partial' | 'planned' | 'na';
  tooltip?: string;
}

export const ComparisonSection: React.FC = () => {
  const rows: { feature: string; [key: string]: string | CellData }[] = [
    {
      feature: 'Separate display',
      meridius: { type: 'check' },
      codex: { type: 'cross' },
      claude: { type: 'cross' },
      coasty: { type: 'cross' },
      openwork: { type: 'cross' },
      hermes: { type: 'cross' },
      voiceos: { type: 'na' },
      clicky: { type: 'na' },
    },
    {
      feature: 'Never hijacks your cursor',
      meridius: { type: 'check' },
      codex: { type: 'check' },
      claude: { type: 'cross' },
      coasty: { type: 'check' },
      openwork: {
        type: 'partial',
        tooltip: 'Only true for browser tasks, which run in a separate signed-in browser instead of hijacking your cursor. Native app tasks still hijack your cursor.',
      },
      hermes: { type: 'check' },
      voiceos: { type: 'na' },
      clicky: { type: 'na' },
    },
    {
      feature: 'Stays in background',
      meridius: { type: 'check' },
      codex: {
        type: 'partial',
        tooltip: 'Mostly stays backgrounded, but macOS occasionally forces the app to the foreground during certain operations, despite the marketing claim that it never does.',
      },
      claude: { type: 'cross' },
      coasty: { type: 'na' },
      openwork: { type: 'cross' },
      hermes: {
        type: 'partial',
        tooltip: 'Avoids foregrounding by using undocumented Apple system APIs, which can break on any macOS update. Still runs on your one real display, not a separate one.',
      },
      voiceos: { type: 'na' },
      clicky: { type: 'na' },
    },
    {
      feature: 'Uses your real, logged-in apps',
      meridius: { type: 'check' },
      codex: { type: 'check' },
      claude: { type: 'check' },
      coasty: { type: 'cross' },
      openwork: {
        type: 'partial',
        tooltip: 'True for native app tasks. Browser tasks run in a separate, non-logged-in browser, so it loses access to your real accounts there.',
      },
      hermes: { type: 'check' },
      voiceos: { type: 'na' },
      clicky: { type: 'na' },
    },
    {
      feature: 'Local model option',
      meridius: { type: 'check' },
      codex: { type: 'cross' },
      claude: { type: 'cross' },
      coasty: { type: 'cross' },
      openwork: { type: 'check' },
      hermes: { type: 'cross' },
      voiceos: { type: 'na' },
      clicky: { type: 'na' },
    },
    {
      feature: 'Voice + memory',
      meridius: { type: 'check' },
      codex: { type: 'check' },
      claude: { type: 'cross' },
      coasty: { type: 'cross' },
      openwork: { type: 'cross' },
      hermes: { type: 'cross' },
      voiceos: { type: 'check' },
      clicky: { type: 'check' },
    },
    {
      feature: 'Team sync',
      meridius: { type: 'planned' },
      codex: { type: 'cross' },
      claude: { type: 'cross' },
      coasty: { type: 'cross' },
      openwork: {
        type: 'partial',
        tooltip: "Has a paid team plan, but it shares configs and skills between teammates. It's not live coordination on a shared project the way Meridius Sync is designed.",
      },
      hermes: { type: 'cross' },
      voiceos: { type: 'cross' },
      clicky: { type: 'cross' },
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
          <p className="text-xs font-mono text-charcoal-dim dark:text-cream-dim italic mt-2">
            *Hover over any ⚠ for the specific caveat.*
          </p>
        </div>

        {/* Minimalist Comparison Table Container with Perfect Rounded Corners */}
        <div className="rounded-2xl frosted-glass border border-charcoal/[0.08] dark:border-cream/[0.08] shadow-sm mb-10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[880px] text-xs">
              <thead>
                <tr className="border-b border-charcoal/[0.08] dark:border-cream/[0.08] bg-white/50 dark:bg-white/[0.03]">
                  <th className="py-4 px-5 font-mono font-semibold text-charcoal-muted dark:text-cream-dim uppercase tracking-wider w-[22%] sticky left-0 bg-cream dark:bg-void z-10 rounded-tl-2xl">
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
                  <th className="py-4 px-3 font-mono font-semibold text-charcoal-muted dark:text-cream-dim tracking-wider text-center w-[8%] rounded-tr-2xl">
                    Clicky
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/[0.06] dark:divide-cream/[0.06] font-sans">
                {rows.map((row, idx) => {
                  const isLastRow = idx === rows.length - 1;
                  return (
                    <tr key={idx} className="hover:bg-white/30 dark:hover:bg-white/[0.01] transition-colors">
                      {/* Feature Label */}
                      <td className={`py-3.5 px-5 font-semibold text-charcoal dark:text-cream font-display sticky left-0 bg-cream dark:bg-void z-10 border-r border-charcoal/[0.04] dark:border-cream/[0.04] ${isLastRow ? 'rounded-bl-2xl' : ''}`}>
                        {row.feature}
                      </td>

                      {/* Meridius Column */}
                      <td className="py-3.5 px-3.5 text-center bg-charcoal/[0.04] dark:bg-cream/[0.05]">
                        <div className="flex justify-center items-center">
                          {renderBadge(row.meridius as CellData, idx)}
                        </div>
                      </td>

                      {/* Codex */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex justify-center items-center">
                          {renderBadge(row.codex as CellData, idx)}
                        </div>
                      </td>

                      {/* Claude */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex justify-center items-center">
                          {renderBadge(row.claude as CellData, idx)}
                        </div>
                      </td>

                      {/* Coasty */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex justify-center items-center">
                          {renderBadge(row.coasty as CellData, idx)}
                        </div>
                      </td>

                      {/* OpenWork */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex justify-center items-center">
                          {renderBadge(row.openwork as CellData, idx)}
                        </div>
                      </td>

                      {/* Hermes */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex justify-center items-center">
                          {renderBadge(row.hermes as CellData, idx)}
                        </div>
                      </td>

                      {/* VoiceOS */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex justify-center items-center">
                          {renderBadge(row.voiceos as CellData, idx)}
                        </div>
                      </td>

                      {/* Clicky */}
                      <td className={`py-3.5 px-3 text-center ${isLastRow ? 'rounded-br-2xl' : ''}`}>
                        <div className="flex justify-center items-center">
                          {renderBadge(row.clicky as CellData, idx)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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

function renderBadge(cell: CellData, rowIndex: number = 0) {
  switch (cell.type) {
    case 'check':
      return <Check className="w-4 h-4 text-emerald-600/80 dark:text-emerald-400/80 stroke-[2.25]" />;
    case 'cross':
      return <X className="w-3.5 h-3.5 text-charcoal-muted/45 dark:text-cream-dim/45 stroke-[2.25]" />;
    case 'partial': {
      // Place tooltip below on upper rows, and above on lower rows to avoid any clipping
      const isTopHalf = rowIndex < 3;
      return (
        <div className="relative group/tip flex items-center justify-center cursor-help">
          <abbr
            title={cell.tooltip || ''}
            className="no-underline cursor-help flex items-center justify-center p-1"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500/90 dark:text-amber-400/90 stroke-[2.25]" />
          </abbr>

          {/* Sleek Adaptive Floating Tooltip */}
          {cell.tooltip && (
            <div
              className={`absolute left-1/2 -translate-x-1/2 hidden group-hover/tip:flex flex-col items-center z-50 pointer-events-none w-64 ${
                isTopHalf ? 'top-full mt-2' : 'bottom-full mb-2'
              }`}
            >
              {isTopHalf && <div className="w-2 h-2 bg-charcoal dark:bg-cream rotate-45 -mb-1 z-10" />}
              <div className="bg-charcoal dark:bg-cream text-cream dark:text-charcoal text-[11px] font-sans font-normal leading-snug p-3 rounded-xl shadow-2xl border border-white/10 dark:border-black/10 text-center">
                {cell.tooltip}
              </div>
              {!isTopHalf && <div className="w-2 h-2 bg-charcoal dark:bg-cream rotate-45 -mt-1 z-10" />}
            </div>
          )}
        </div>
      );
    }
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

import React from 'react';

export const ComparisonSection: React.FC = () => {
  const rows = [
    {
      label: 'Display',
      meridius: 'Separate display, rendered by your own Mac',
      codex: 'Your one real display',
      claude: 'Your one real display',
      coasty: 'Cloud VM, not your machine',
      openwork: 'Your one real display (browser mode: cloud browser)',
      hermes: 'Your one real display',
      voiceos: 'N/A, no screen control',
      clicky: 'N/A, no screen control',
    },
    {
      label: 'Cursor',
      meridius: 'Own software cursor, never touches yours',
      codex: "Doesn't hijack your cursor",
      claude: 'Hijacks your real cursor',
      coasty: 'No local cursor (cloud VM)',
      openwork: 'Hijacks your cursor for native apps',
      hermes: "Doesn't move your cursor",
      voiceos: 'N/A',
      clicky: 'N/A',
    },
    {
      label: 'App foregrounding',
      meridius: 'Never, target apps are never on real display',
      codex: 'Occasionally forces app forward anyway',
      claude: 'Full screen takeover by design',
      coasty: 'N/A, runs on cloud machine',
      openwork: 'Foregrounds your display for native tasks',
      hermes: 'Direct events, but still on real display',
      voiceos: 'N/A',
      clicky: 'N/A',
    },
    {
      label: 'Runs your real, logged-in native apps',
      meridius: 'Yes',
      codex: 'Yes',
      claude: 'Yes',
      coasty: 'No, fresh disconnected copy of accounts',
      openwork: 'No for browser tasks, separate browser',
      hermes: 'Yes',
      voiceos: 'N/A',
      clicky: 'N/A',
    },
    {
      label: 'Local model support',
      meridius: 'Yes, via Ollama',
      codex: 'No, ChatGPT models only',
      claude: 'No',
      coasty: 'No',
      openwork: 'Not specified',
      hermes: 'Not specified',
      voiceos: 'N/A',
      clicky: 'N/A',
    },
    {
      label: 'Core technique',
      meridius: 'AX-first, screenshot fallback for non-AX apps',
      codex: 'Not disclosed in detail',
      claude: 'Not disclosed in detail',
      coasty: 'Screenshot-and-action loop',
      openwork: 'AX-based clicking + screenshot fallback',
      hermes: 'Direct event posting via SkyLight APIs',
      voiceos: 'MCP / API connectors only',
      clicky: 'Screen-aware guidance + background mode',
    },
    {
      label: 'Reliability risk',
      meridius: 'Uses public, documented Apple APIs',
      codex: 'Occasional foregrounding despite promise',
      claude: 'Takes the screen outright',
      coasty: 'Screenshot loop breaks on poor UIs, token-heavy',
      openwork: 'Screenshot loop shares Coasty issues',
      hermes: 'Undocumented private APIs, can break on updates',
      voiceos: 'Limited to supported app APIs',
      clicky: 'Limited outside supported connectors',
    },
    {
      label: 'Voice + persistent memory',
      meridius: 'Yes, always-on voice with persistent memory',
      codex: 'No',
      claude: 'No',
      coasty: 'No',
      openwork: 'No',
      hermes: 'No',
      voiceos: 'Yes, but predefined / not dynamic',
      clicky: 'Yes, primarily guidance-oriented',
    },
    {
      label: 'Multiplayer / team sync',
      meridius: 'Planned (Meridius Sync): multi-instance shared project coordination',
      codex: 'No',
      claude: 'No',
      coasty: 'No',
      openwork: 'No',
      hermes: 'No',
      voiceos: 'No',
      clicky: 'No',
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
            Detailed technical and experiential comparison across the current computer-use and AI automation landscape.
          </p>
        </div>

        {/* Full Comprehensive Comparison Table */}
        <div className="overflow-x-auto rounded-2xl frosted-glass border border-charcoal/[0.08] dark:border-cream/[0.08] shadow-sm mb-12">
          <table className="w-full text-left border-collapse min-w-[1100px] text-xs">
            <thead>
              <tr className="border-b border-charcoal/[0.08] dark:border-cream/[0.08] bg-white/50 dark:bg-white/[0.03]">
                <th className="py-4 px-4 font-mono font-semibold text-charcoal-muted dark:text-cream-dim uppercase tracking-wider w-[14%] sticky left-0 bg-cream/90 dark:bg-void/90 backdrop-blur-md z-10">
                  Dimension
                </th>
                <th className="py-4 px-4 font-mono font-bold text-charcoal dark:text-cream tracking-wider w-[15%] bg-charcoal/[0.04] dark:bg-cream/[0.05]">
                  Meridius
                </th>
                <th className="py-4 px-3 font-mono font-semibold text-charcoal-muted dark:text-cream-dim tracking-wider w-[11%]">
                  Codex
                </th>
                <th className="py-4 px-3 font-mono font-semibold text-charcoal-muted dark:text-cream-dim tracking-wider w-[11%]">
                  Claude Cowork
                </th>
                <th className="py-4 px-3 font-mono font-semibold text-charcoal-muted dark:text-cream-dim tracking-wider w-[11%]">
                  Coasty AI
                </th>
                <th className="py-4 px-3 font-mono font-semibold text-charcoal-muted dark:text-cream-dim tracking-wider w-[11%]">
                  OpenWork
                </th>
                <th className="py-4 px-3 font-mono font-semibold text-charcoal-muted dark:text-cream-dim tracking-wider w-[11%]">
                  Hermes Agent
                </th>
                <th className="py-4 px-3 font-mono font-semibold text-charcoal-muted dark:text-cream-dim tracking-wider w-[8%]">
                  VoiceOS
                </th>
                <th className="py-4 px-3 font-mono font-semibold text-charcoal-muted dark:text-cream-dim tracking-wider w-[8%]">
                  Clicky
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/[0.06] dark:divide-cream/[0.06] font-sans">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/30 dark:hover:bg-white/[0.01] transition-colors">
                  {/* Dimension Header */}
                  <td className="py-3.5 px-4 font-semibold text-charcoal dark:text-cream font-display sticky left-0 bg-cream/95 dark:bg-void/95 backdrop-blur-md z-10 border-r border-charcoal/[0.04] dark:border-cream/[0.04]">
                    {row.label}
                  </td>

                  {/* Meridius Column (Highlighted) */}
                  <td className="py-3.5 px-4 font-medium text-charcoal dark:text-cream bg-charcoal/[0.04] dark:bg-cream/[0.05] leading-relaxed">
                    <span className="font-semibold">{row.meridius}</span>
                  </td>

                  {/* Codex */}
                  <td className="py-3.5 px-3 text-charcoal-muted dark:text-cream-muted leading-relaxed">
                    {row.codex}
                  </td>

                  {/* Claude */}
                  <td className="py-3.5 px-3 text-charcoal-muted dark:text-cream-muted leading-relaxed">
                    {row.claude}
                  </td>

                  {/* Coasty */}
                  <td className="py-3.5 px-3 text-charcoal-muted dark:text-cream-muted leading-relaxed">
                    {row.coasty}
                  </td>

                  {/* OpenWork */}
                  <td className="py-3.5 px-3 text-charcoal-muted dark:text-cream-muted leading-relaxed">
                    {row.openwork}
                  </td>

                  {/* Hermes */}
                  <td className="py-3.5 px-3 text-charcoal-muted dark:text-cream-muted leading-relaxed">
                    {row.hermes}
                  </td>

                  {/* VoiceOS */}
                  <td className="py-3.5 px-3 text-charcoal-muted dark:text-cream-dim leading-relaxed font-mono text-[11px]">
                    {row.voiceos}
                  </td>

                  {/* Clicky */}
                  <td className="py-3.5 px-3 text-charcoal-muted dark:text-cream-dim leading-relaxed font-mono text-[11px]">
                    {row.clicky}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3 Detailed Notes on the Close Calls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl frosted-glass border border-charcoal/[0.08] dark:border-cream/[0.08]">
            <h4 className="font-display font-semibold text-sm text-charcoal dark:text-cream mb-2">
              Codex & Hermes: Structural vs. Hook-Based Isolation
            </h4>
            <p className="text-xs text-charcoal-muted dark:text-cream-muted font-sans leading-relaxed">
              Codex and Hermes try to solve non-disruptive computer use on your main screen. But Codex is vulnerable when macOS forces windows forward, and Hermes relies on private undocumented Apple APIs that can break on OS updates. Meridius avoids both failure modes structurally.
            </p>
          </div>

          <div className="p-6 rounded-2xl frosted-glass border border-charcoal/[0.08] dark:border-cream/[0.08]">
            <h4 className="font-display font-semibold text-sm text-charcoal dark:text-cream mb-2">
              Coasty & OpenWork: The Cloud VM Disconnect
            </h4>
            <p className="text-xs text-charcoal-muted dark:text-cream-muted font-sans leading-relaxed">
              Coasty's cloud VM approach means the agent literally isn't running on your computer, so it can't touch your real, already-logged-in apps. You get a fresh, disconnected copy of your accounts on a remote machine.
            </p>
          </div>

          <div className="p-6 rounded-2xl frosted-glass border border-charcoal/[0.08] dark:border-cream/[0.08]">
            <h4 className="font-display font-semibold text-sm text-charcoal dark:text-cream mb-2">
              VoiceOS & Clicky: API Connectors vs. Autonomous Agents
            </h4>
            <p className="text-xs text-charcoal-muted dark:text-cream-muted font-sans leading-relaxed">
              VoiceOS and Clicky are voice-first automation layers that act through app-specific connectors (MCPs, APIs), not by controlling software dynamically. Useful for basic integrations, but not autonomous computer use.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

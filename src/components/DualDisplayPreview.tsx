import React, { useState } from 'react';
import { Monitor, Layers, Shield, Sparkles, MousePointer2 } from 'lucide-react';

export const DualDisplayPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ghost' | 'display1' | 'display2'>('ghost');

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* View Switcher Controls */}
      <div className="flex items-center gap-1 p-1 bg-surface-subtle/90 border border-white/[0.08] rounded-lg backdrop-blur-md mb-5 text-xs font-mono">
        <button
          onClick={() => setActiveTab('ghost')}
          className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
            activeTab === 'ghost'
              ? 'bg-signal text-void font-semibold shadow-sm'
              : 'text-foreground-muted hover:text-foreground'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Dual Display (Ghost Layer)</span>
        </button>

        <button
          onClick={() => setActiveTab('display1')}
          className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
            activeTab === 'display1'
              ? 'bg-surface-elevated text-foreground border border-white/10 font-medium'
              : 'text-foreground-dim hover:text-foreground'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Display 1 (Your Screen)</span>
        </button>

        <button
          onClick={() => setActiveTab('display2')}
          className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
            activeTab === 'display2'
              ? 'bg-signal-dim text-signal-light border border-signal/30 font-medium'
              : 'text-foreground-dim hover:text-foreground'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Display 2 (Meridius Agent)</span>
        </button>
      </div>

      {/* Stage Container */}
      <div className="relative w-full h-[320px] sm:h-[360px] rounded-2xl bg-surface/40 border border-white/[0.08] p-4 flex items-center justify-center overflow-hidden shadow-2xl">
        
        {/* Ambient Signal glow behind the second display */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-72 bg-signal/15 rounded-full blur-[70px] pointer-events-none" />

        {/* ============================================================ */}
        {/* DISPLAY 2: THE GHOST LAYER (Background Virtual Display) */}
        {/* ============================================================ */}
        <div
          className={`absolute rounded-xl border border-signal/40 bg-surface-elevated/90 transition-all duration-700 overflow-hidden ${
            activeTab === 'display1'
              ? 'opacity-0 scale-95 pointer-events-none'
              : activeTab === 'display2'
              ? 'w-[90%] h-[85%] z-20 opacity-100 translate-x-0 translate-y-0 scale-100 shadow-glow-signal'
              : 'w-[82%] sm:w-[75%] h-[75%] z-0 translate-x-8 sm:translate-x-12 -translate-y-6 opacity-60 filter blur-[1px] hover:blur-none hover:opacity-90 shadow-[0_0_40px_rgba(91,140,255,0.2)] animate-ghost-drift'
          }`}
        >
          {/* Mac Window Titlebar */}
          <div className="h-8 bg-surface-active/80 border-b border-signal/20 px-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/80" />
              <span className="ml-2 text-[11px] font-mono text-signal-light font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-signal animate-ping" />
                Virtual Display 2 — Safari (Native)
              </span>
            </div>
            <div className="text-[10px] font-mono text-signal/80 bg-signal-dim px-2 py-0.5 rounded border border-signal/30">
              Agent Navigating
            </div>
          </div>

          {/* Window Content */}
          <div className="p-4 font-mono text-xs text-foreground-muted space-y-2.5">
            <div className="flex items-center gap-2 p-2 rounded bg-surface/90 border border-signal/20 text-signal-light">
              <span className="text-signal font-bold">↳</span>
              <span className="truncate text-[11px]">Logged in as Himel • Real Session Cookie • Full Keychain Access</span>
            </div>

            <div className="space-y-1.5 text-[11px] text-foreground-dim">
              <div className="flex items-center justify-between text-foreground-muted">
                <span>[1/3] Navigating to stripe.com/dashboard/invoices</span>
                <span className="text-signal">DONE</span>
              </div>
              <div className="flex items-center justify-between text-foreground-muted">
                <span>[2/3] Extracting Q3 revenue metrics via native DOM</span>
                <span className="text-signal font-medium animate-pulse">EXECUTING...</span>
              </div>
              <div className="flex items-center justify-between text-foreground-dim">
                <span>[3/3] Compiling summary into Apple Notes</span>
                <span>QUEUED</span>
              </div>
            </div>

            {/* Virtual cursor simulation */}
            <div className="mt-4 flex items-center gap-2 text-[10px] text-signal font-mono">
              <MousePointer2 className="w-3.5 h-3.5 text-signal animate-bounce" />
              <span>Meridius cursor clicking button #export-csv</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* DISPLAY 1: THE REAL USER SCREEN (Foreground Sharp Display) */}
        {/* ============================================================ */}
        <div
          className={`absolute rounded-xl border border-white/10 bg-surface shadow-ghost-window transition-all duration-700 overflow-hidden ${
            activeTab === 'display2'
              ? 'opacity-0 scale-95 pointer-events-none'
              : activeTab === 'display1'
              ? 'w-[90%] h-[85%] z-20 opacity-100 translate-x-0 translate-y-0 scale-100'
              : 'w-[82%] sm:w-[75%] h-[75%] z-10 -translate-x-8 sm:-translate-x-10 translate-y-4 opacity-100 shadow-2xl'
          }`}
        >
          {/* Mac Window Titlebar */}
          <div className="h-8 bg-surface-subtle border-b border-white/[0.06] px-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-ghost" />
              <span className="w-2.5 h-2.5 rounded-full bg-ghost" />
              <span className="w-2.5 h-2.5 rounded-full bg-ghost" />
              <span className="ml-2 text-[11px] font-mono text-foreground-muted font-medium">
                Display 1 — Your Main Screen (Untouched)
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              0px Cursor Movement
            </div>
          </div>

          {/* Window Content */}
          <div className="p-4 font-mono text-xs text-foreground-muted space-y-3">
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
              <span className="text-foreground font-semibold text-xs">Your Current Work: VS Code / Figma / Meeting</span>
              <span className="text-[10px] text-foreground-dim font-mono">100% Focused</span>
            </div>

            <p className="text-xs text-foreground-muted leading-relaxed font-sans">
              You are continuing to type in your editor, join video calls, or design without any interruption.
              No windows stealing focus. No cursor jumping around your screen.
            </p>

            <div className="p-2.5 rounded-lg bg-surface-subtle/80 border border-white/[0.04] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-signal" />
                <span className="text-foreground text-[11px]">Foreground isolation: 100% Guaranteed</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">Secure Native IPC</span>
            </div>
          </div>
        </div>

      </div>

      {/* Subtitle Annotation */}
      <div className="mt-3 flex items-center gap-2 text-xs font-mono text-foreground-dim text-center">
        <span className="w-2 h-2 rounded-full bg-signal" />
        <span>Physical Hardware-level Separation: Two actual displays rendered by macOS.</span>
      </div>
    </div>
  );
};

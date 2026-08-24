import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MCP_SERVICES, MCPService } from './mcpData';
import { Terminal, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface MCPConstellationProps {
  activeCategory?: string;
  onSelectService?: (service: MCPService) => void;
}

export const MCPConstellation: React.FC<MCPConstellationProps> = ({ 
  activeCategory = 'all',
  onSelectService 
}) => {
  const [selectedId, setSelectedId] = useState<string>('gmail');
  const [isHovering, setIsHovering] = useState(false);

  const filteredServices = activeCategory === 'all' 
    ? MCP_SERVICES 
    : MCP_SERVICES.filter(s => s.category === activeCategory || s.category === 'custom');

  // Auto-cycle through services every 4 seconds if not hovering
  useEffect(() => {
    if (isHovering) return;
    const interval = setInterval(() => {
      setSelectedId((prev) => {
        const currentIndex = filteredServices.findIndex((s) => s.id === prev);
        const nextIndex = (currentIndex + 1) % filteredServices.length;
        return filteredServices[nextIndex]?.id || filteredServices[0]?.id || MCP_SERVICES[0].id;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovering, filteredServices]);

  // Keep selection valid on category filter change
  useEffect(() => {
    if (!filteredServices.some(s => s.id === selectedId)) {
      setSelectedId(filteredServices[0]?.id || MCP_SERVICES[0].id);
    }
  }, [activeCategory, filteredServices, selectedId]);

  const activeService = MCP_SERVICES.find((s) => s.id === selectedId) || MCP_SERVICES[0];

  const handleSelect = (service: MCPService) => {
    setSelectedId(service.id);
    if (onSelectService) {
      onSelectService(service);
    }
  };

  return (
    <div className="w-full relative">
      {/* Outer Frosted Glass Canvas Container */}
      <div className="relative rounded-3xl p-6 sm:p-8 lg:p-12 frosted-glass border border-charcoal/[0.1] dark:border-cream/[0.1] overflow-hidden transition-all duration-300 shadow-[0_12px_48px_rgba(0,0,0,0.05)] dark:shadow-[0_12px_48px_rgba(0,0,0,0.45)]">
        
        {/* Ambient Signal Glow Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full blur-[120px] pointer-events-none opacity-15 dark:opacity-25 bg-signal" />

        {/* Top Mesh Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-charcoal/[0.08] dark:border-cream/[0.08] relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute opacity-75" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative" />
            </div>
            <div>
              <div className="text-xs font-mono font-medium text-charcoal dark:text-cream flex items-center gap-2">
                <span>Autonomous MCP Mesh: Active</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-charcoal/[0.06] dark:bg-cream/[0.08] text-charcoal-muted dark:text-cream-dim">
                  18+ Endpoints Connected
                </span>
              </div>
              <div className="text-[11px] font-mono text-charcoal-muted dark:text-cream-dim">
                Direct AppleScript & Accessibility Bridge · Zero Cursor Hijack
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-charcoal-muted dark:text-cream-dim">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>macOS Keychain Isolation</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN LAYOUT: UNBOXED FLOATING SYNAPSE NODES + FLOATING TELEMETRY HUD      */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          
          {/* ===================================================================== */}
          {/* LEFT / CENTER: UNBOXED STANDALONE FLOATING ICONS (NO BOX SHAPES)       */}
          {/* ===================================================================== */}
          <div 
            className="lg:col-span-7 flex flex-col justify-center relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            
            {/* Centerpiece Banner Note */}
            <div className="text-xs font-mono uppercase tracking-wider text-charcoal-dim dark:text-cream-dim mb-6 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-signal" />
                <span>Connected MCP Ecosystem (Pure Vector Silicon)</span>
              </span>
              <span className="text-[10px]">{filteredServices.length} Active Tools</span>
            </div>

            {/* Unboxed Fluid Icon Grid (No border boxes, large icons, pure zoom on selected) */}
            {/* Unboxed Fluid Icon Grid (No fading, 100% crisp opacity, zoom on selected) */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-y-9 sm:gap-y-11 gap-x-4 sm:gap-x-6">
              {filteredServices.map((service) => {
                const IconComponent = service.icon;
                const isSelected = service.id === selectedId;

                return (
                  <button
                    key={service.id}
                    onClick={() => handleSelect(service)}
                    className="flex flex-col items-center justify-center gap-2 group relative focus:outline-none transition-all select-none cursor-pointer"
                  >
                    {/* Standalone Vector Monochrome Logo - 100% full opacity, zoom on selected */}
                    <motion.div
                      animate={{
                        scale: isSelected ? 1.35 : 1,
                        y: isSelected ? -3 : 0,
                      }}
                      whileHover={{ scale: isSelected ? 1.38 : 1.15, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 450, damping: 24 }}
                      className="relative flex items-center justify-center text-charcoal dark:text-cream opacity-100"
                    >
                      <IconComponent size={40} className="w-10 h-10 object-contain" />
                    </motion.div>

                    {/* Unboxed Minimal Text Label - 100% crisp opacity */}
                    <span 
                      className={`text-xs font-sans tracking-tight text-center truncate max-w-full text-charcoal dark:text-cream opacity-100 transition-all ${
                        isSelected 
                          ? 'font-bold scale-105' 
                          : 'font-medium'
                      }`}
                    >
                      {service.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Subtext */}
            <div className="mt-8 pt-4 border-t border-charcoal/[0.06] dark:border-cream/[0.06] flex items-center justify-between text-[11px] font-mono text-charcoal-dim dark:text-cream-dim">
              <span>Hover or click any icon to inspect live MCP tool calls</span>
              <span className="text-emerald-500 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Zero Latency Sync</span>
              </span>
            </div>

          </div>

          {/* ===================================================================== */}
          {/* RIGHT: FLOATING GLASS HUD AGENT INSPECTOR (TRANSLUCENT GLASS)          */}
          {/* ===================================================================== */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="rounded-3xl bg-[#14161b]/90 dark:bg-[#0c0d10]/90 backdrop-blur-3xl border border-white/15 dark:border-white/10 p-6 sm:p-7 shadow-[0_16px_48px_rgba(0,0,0,0.35)] flex flex-col justify-between min-h-[410px] relative overflow-hidden font-mono text-[#f5f5ee]">
              
              {/* Subtle Inset Top Highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

              {/* Titlebar */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                  </div>
                  <span className="ml-2 text-xs text-[#8a8a82] flex items-center gap-1.5 font-mono">
                    <Terminal className="w-3.5 h-3.5 text-signal" />
                    <span>meridius-mcp-engine</span>
                  </span>
                </div>

                <div className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-signal/15 text-signal border border-signal/30">
                  {activeService.badge}
                </div>
              </div>

              {/* Active Service Telemetry Display */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col flex-1 justify-between gap-5"
                >
                  
                  {/* Service Details */}
                  <div>
                    {/* Header with big unboxed logo */}
                    <div className="flex items-center gap-3.5 mb-3">
                      <div className="text-signal drop-shadow-[0_0_12px_rgba(91,140,255,0.5)]">
                        {React.createElement(activeService.icon, { size: 32, className: "w-8 h-8 object-contain" })}
                      </div>
                      <div>
                        <div className="text-base sm:text-lg font-display font-semibold !text-[#f5f5ee] tracking-tight">
                          {activeService.name} MCP Server
                        </div>
                        <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Connected · Running in Ghost Display 1</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs font-sans text-[#c4c4bb] leading-relaxed mb-4 min-h-[36px] line-clamp-2">
                      {activeService.description}
                    </p>

                    {/* Protocol Tools */}
                    <div>
                      <div className="text-[10px] text-[#8a8a82] uppercase tracking-wider mb-2 font-mono">
                        Available MCP Protocol Tools:
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-h-[48px] overflow-hidden">
                        {activeService.mcpTools.map((tool) => (
                          <span 
                            key={tool} 
                            className="px-2 py-0.5 rounded-md text-[10px] bg-white/5 border border-white/10 text-[#eaeae2] font-mono"
                          >
                            `{tool}`
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Terminal Execution Sandbox */}
                  <div className="p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-xs space-y-2 h-[120px] flex flex-col justify-between shadow-inner">
                    <div className="flex items-start gap-2 text-[#f5f5ee]">
                      <span className="select-none text-[#8a8a82]">$</span>
                      <span className="font-mono truncate">{activeService.simulatedAction.command}</span>
                    </div>

                    <div className="flex items-start gap-2 text-[#c4c4bb] pl-3 text-[11px] truncate">
                      <span className="select-none text-[#8a8a82]">→</span>
                      <span className="truncate">{activeService.simulatedAction.log}</span>
                    </div>

                    <div className="flex items-start gap-2 text-emerald-400 pl-3 pt-1 border-t border-white/10 text-[11px] truncate font-medium">
                      <span className="select-none">✓</span>
                      <span className="truncate">{activeService.simulatedAction.result}</span>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

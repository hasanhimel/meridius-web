import React from 'react';
import { MCP_SERVICES } from './mcpData';

export const MCPMarquee: React.FC = () => {
  // Duplicate array for seamless infinite stream
  const row1 = [...MCP_SERVICES, ...MCP_SERVICES];

  return (
    <div className="w-full overflow-hidden py-8 relative [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] select-none">
      
      {/* Track: Ultra-slow, smooth cinematic drift of unboxed standalone icons */}
      <div className="flex items-center gap-14 sm:gap-20 w-max animate-marquee-slow hover:[animation-play-state:paused]">
        {row1.map((service, index) => {
          const Icon = service.icon;
          return (
            <div
              key={`marquee-${service.id}-${index}`}
              className="flex flex-col items-center justify-center gap-3 transition-all duration-300 group cursor-pointer"
            >
              {/* Pure unboxed standalone vector logo - Large (40px) */}
              <div className="text-charcoal dark:text-cream opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 group-hover:drop-shadow-[0_0_16px_rgba(91,140,255,0.4)] flex items-center justify-center">
                <Icon size={40} className="w-10 h-10 object-contain transition-transform" />
              </div>
              
              {/* Clean minimal typography - Unboxed */}
              <span className="text-xs font-sans font-medium text-charcoal-muted dark:text-cream-muted group-hover:text-charcoal dark:group-hover:text-cream tracking-tight transition-colors">
                {service.name}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
};

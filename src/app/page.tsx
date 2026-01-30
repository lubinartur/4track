'use client';

import GreetingBlock from '@/components/life/GreetingBlock';
import OverviewRow from '@/components/life/OverviewRow';
import ReflectiveCard from '@/components/life/ReflectiveCard';

export default function LifePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Cinematic vignette background */}
      <div className="fixed inset-0 bg-[#0b0b0f]">
        {/* Radial vignette - edges darker */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(11, 11, 15, 0) 0%, rgba(11, 11, 15, 0.3) 40%, rgba(5, 5, 8, 0.8) 100%)'
          }}
        />
        {/* Subtle top glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a20]/20 via-transparent to-transparent" />
        {/* Optional noise-like effect */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
            backgroundSize: '100% 4px'
          }}
        />
      </div>

      {/* Content container with device stage feeling */}
      <div className="relative mx-auto max-w-md min-h-screen px-4 pt-safe-area-inset-top pb-32">
        <div className="relative rounded-[36px] bg-[#0b0b0f]/30 p-6 pt-8 shadow-[inset_0_0_80px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.02)] backdrop-blur-[0.5px]">
          <GreetingBlock />

          {/* Cross-domain overview */}
          <div className="mb-6 space-y-4">
            <OverviewRow
              iconType="films"
              label="FILMS"
              metric="2 tracked · 8.6 avg"
            />
            <OverviewRow
              iconType="sport"
              label="SPORT"
              metric="1 sessions total"
            />
            <OverviewRow
              iconType="books"
              label="BOOKS"
              metric="Reading: Atomic Habits"
            />
          </div>

          {/* Reflective Intelligence */}
          <ReflectiveCard />
        </div>
      </div>
    </div>
  );
}

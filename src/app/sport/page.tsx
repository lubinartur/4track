'use client';

import SportHeader from '@/components/sport/SportHeader';
import MetricCard from '@/components/shared/MetricCard';
import MetricRow from '@/components/shared/MetricRow';
import SessionCard from '@/components/sport/SessionCard';
import { useSessionStats, useLatestSession } from '@/db/hooks';

export default function SportPage() {
  const { stats, loading: statsLoading } = useSessionStats();
  const { session, loading: sessionLoading } = useLatestSession();
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
          <SportHeader />

          {/* Metrics */}
          <div className="mb-8 px-8">
            <MetricRow>
              <MetricCard label="TRAINING" value={statsLoading ? '...' : stats.trainingThisWeek.toString()} />
              <MetricCard label="INTENSITY" value={statsLoading ? '...' : stats.avgIntensity.toFixed(1)} />
              <MetricCard label="LAST 7" value={statsLoading ? '...' : stats.last7Count.toString()} />
            </MetricRow>
          </div>

          {/* Recent Sessions */}
          <div>
            <h2 className="mb-5 text-[14px] font-medium uppercase tracking-[0.08em] text-primary">
              Recent sessions
            </h2>
            {sessionLoading ? (
              <div className="text-tertiary text-sm">Loading...</div>
            ) : session ? (
              <SessionCard
                title={session.title}
                meta={`${session.durationMin}m • ${session.type}`}
                score={Math.round(session.intensity).toString()}
                tags={session.tags.slice(0, 2)}
              />
            ) : (
              <div className="text-tertiary text-sm">No sessions yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

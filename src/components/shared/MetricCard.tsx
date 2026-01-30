import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string;
  className?: string;
}

export default function MetricCard({ label, value, className }: MetricCardProps) {
  return (
    <div className={cn('relative h-[96px] rounded-[28px] border border-white/5 bg-[#141420]/60 px-5 shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.08),inset_0_-1px_0_0_rgba(0,0,0,0.2)] backdrop-blur-xl', className)}>
      {/* Label - absolute positioned at 20px from card edge */}
      <div className="absolute top-[14px] left-5 right-5 whitespace-nowrap overflow-hidden text-ellipsis text-[11px] font-medium uppercase tracking-[0.24em] text-white/45">
        {label}
      </div>
      
      {/* Value - absolute positioned, optically centered */}
      <div className="absolute left-5 right-5 top-[44px] text-center text-[36px] leading-none font-light tracking-tight text-[#ff3d00]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
        {value}
      </div>
    </div>
  );
}

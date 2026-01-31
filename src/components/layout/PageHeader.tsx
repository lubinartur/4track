'use client';

interface PageHeaderProps {
  subtitle?: string;
  title: string;
  rightElement?: React.ReactNode;
  className?: string;
}

export default function PageHeader({ subtitle, title, rightElement, className = '' }: PageHeaderProps) {
  return (
    <div className={`mb-8 pt-12 ${className}`}>
      {subtitle && (
        <div className="mb-3.5 text-[10px] uppercase tracking-[0.2em] text-white/50">
          {subtitle}
        </div>
      )}
      <div className="flex items-start justify-between gap-4">
        <h1 className="flex-1 text-[40px] font-light leading-[1.19] tracking-[-0.01em] text-white/85" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          {title}
        </h1>
        {rightElement && <div className="mt-1 shrink-0">{rightElement}</div>}
      </div>
    </div>
  );
}

'use client';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`relative mx-auto w-full max-w-[420px] min-h-screen px-6 pt-safe-area-inset-top pb-32 ${className}`}>
      <div className="relative rounded-[36px] bg-[#0b0b0f]/30 p-6 pt-8 shadow-[inset_0_0_80px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.02)] backdrop-blur-[0.5px]">
        {children}
      </div>
    </div>
  );
}

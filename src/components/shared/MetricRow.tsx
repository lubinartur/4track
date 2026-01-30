interface MetricRowProps {
  children: React.ReactNode;
}

export default function MetricRow({ children }: MetricRowProps) {
  return (
    <div className="grid grid-cols-3 gap-6 items-stretch w-full max-w-[860px] mx-auto">
      {children}
    </div>
  );
}

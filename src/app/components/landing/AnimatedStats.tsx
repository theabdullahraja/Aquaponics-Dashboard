import { useEffect, useState, useRef } from 'react';

const stats = [
  { value: 99.2, suffix: '%', label: 'System Uptime', decimal: true },
  { value: 12, suffix: '', label: 'Active Sensors', decimal: false },
  { value: 2400, suffix: '+', label: 'Alerts Resolved', decimal: false },
];

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function useAnimatedNumber(target: number, duration = 1500, isDecimal = false) {
  const [current, setCurrent] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    startRef.current = null;

    const step = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      setCurrent(isDecimal ? parseFloat((eased * target).toFixed(1)) : Math.floor(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, isDecimal]);

  return current;
}

function StatItem({ value, suffix, label, decimal }: (typeof stats)[0]) {
  const animated = useAnimatedNumber(value, 1500, decimal);
  return (
    <div className="text-center">
      <p className="text-4xl font-mono font-bold text-foreground tabular-nums">
        {decimal ? animated.toFixed(1) : animated.toLocaleString()}
        {suffix}
      </p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

export function AnimatedStats() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
      {stats.map((stat) => (
        <StatItem key={stat.label} {...stat} />
      ))}
    </div>
  );
}

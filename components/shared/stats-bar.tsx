import { cn } from "@/lib/utils";

interface Stat {
  label: string;
  value: string | number;
}

interface StatsBarProps {
  stats: Stat[];
  className?: string;
}

export function StatsBar({ stats, className }: StatsBarProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-6 sm:grid-cols-4", className)}>
      {stats.map((stat) => (
        <div key={stat.label}>
          <p className="text-2xl font-extrabold text-foreground sm:text-3xl">{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

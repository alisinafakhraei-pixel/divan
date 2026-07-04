"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { BreakdownItem } from "@/lib/data-access/insights";
import { useRouter } from "next/navigation";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface ClickableBarChartProps {
  data: BreakdownItem[];
  /** e.g. linkBase="/startups" linkParam="industry" -> /startups?industry=<label> */
  linkBase: string;
  linkParam: string;
}

// Takes serializable linkBase/linkParam instead of a buildHref function — a Server Component
// can't pass a function prop to a Client Component (RSC boundary), so the href is built here.
export function ClickableBarChart({ data, linkBase, linkParam }: ClickableBarChartProps) {
  const router = useRouter();

  return (
    <ChartContainer config={{}} className="max-h-96 w-full">
      <BarChart data={data} layout="vertical" margin={{ left: 16 }}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" hide />
        <YAxis dataKey="label" type="category" width={120} tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="label" />} />
        <Bar
          dataKey="value"
          fill="var(--action-blue)"
          radius={4}
          cursor="pointer"
          onClick={(entry) => {
            const label = (entry as unknown as BreakdownItem).label;
            router.push(`${linkBase}?${linkParam}=${encodeURIComponent(label)}`);
          }}
        />
      </BarChart>
    </ChartContainer>
  );
}

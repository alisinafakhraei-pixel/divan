"use client";

import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { BreakdownItem } from "@/lib/data-access/insights";
import { useRouter } from "next/navigation";
import { Cell, Pie, PieChart } from "recharts";

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

interface ClickableDonutChartProps {
  data: BreakdownItem[];
  /** e.g. linkBase="/startups" linkParam="hqCountry" -> /startups?hqCountry=<label> */
  linkBase: string;
  linkParam: string;
}

// Takes serializable linkBase/linkParam instead of a buildHref function — a Server Component
// can't pass a function prop to a Client Component (RSC boundary), so the href is built here.
export function ClickableDonutChart({ data, linkBase, linkParam }: ClickableDonutChartProps) {
  const router = useRouter();

  // ChartLegendContent only shows a label when it finds one in `config`, keyed by the data value
  // itself (since Pie's nameKey="label" makes each legend payload item's key the label string).
  const chartConfig: ChartConfig = Object.fromEntries(
    data.map((entry, index) => [entry.label, { label: entry.label, color: COLORS[index % COLORS.length] }])
  );

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-80">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="label" />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius={60}
          outerRadius={110}
          paddingAngle={2}
          cursor="pointer"
          onClick={(entry) => {
            const label = (entry as unknown as BreakdownItem).label;
            router.push(`${linkBase}?${linkParam}=${encodeURIComponent(label)}`);
          }}
        >
          {data.map((entry, index) => (
            <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="label" className="flex-wrap" />} />
      </PieChart>
    </ChartContainer>
  );
}

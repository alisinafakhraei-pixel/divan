import { ClickableBarChart } from "@/components/insights/clickable-bar-chart";
import { ClickableDonutChart } from "@/components/insights/clickable-donut-chart";
import { WorldMap } from "@/components/insights/world-map";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatsBar } from "@/components/shared/stats-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getBusinessModelBreakdown,
  getFundingStageBreakdown,
  getHqLocationBreakdown,
  getIndustryBreakdown,
} from "@/lib/data-access/insights";
import { getSiteStats } from "@/lib/data-access/stats";

export default function InsightsPage() {
  const stats = getSiteStats();

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-12 sm:px-6">
      <SectionHeading
        as="h1"
        bold="Insights &"
        muted="charts"
        subhead="Computed live from the Entrepreneurs and Startups directories — click any segment to jump to the filtered view."
      />

      <StatsBar
        stats={[
          { label: "Entrepreneurs", value: stats.totalEntrepreneurs },
          { label: "Startups", value: stats.totalStartups },
          { label: "Countries", value: stats.countriesRepresented },
          { label: "Tracked valuation", value: stats.combinedTrackedValuation },
        ]}
      />

      <Tabs defaultValue="map">
        <TabsList>
          <TabsTrigger value="map">World map</TabsTrigger>
          <TabsTrigger value="hq">HQ location</TabsTrigger>
          <TabsTrigger value="model">B2C vs B2B</TabsTrigger>
          <TabsTrigger value="industries">Industries</TabsTrigger>
          <TabsTrigger value="funding">Funding stage</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="pt-6">
          <WorldMap />
        </TabsContent>

        <TabsContent value="hq" className="pt-6">
          <ClickableDonutChart data={getHqLocationBreakdown()} linkBase="/startups" linkParam="hqCountry" />
        </TabsContent>

        <TabsContent value="model" className="pt-6">
          <ClickableDonutChart data={getBusinessModelBreakdown()} linkBase="/startups" linkParam="businessModel" />
        </TabsContent>

        <TabsContent value="industries" className="pt-6">
          <ClickableBarChart data={getIndustryBreakdown()} linkBase="/startups" linkParam="industry" />
        </TabsContent>

        <TabsContent value="funding" className="pt-6">
          <ClickableBarChart data={getFundingStageBreakdown()} linkBase="/startups" linkParam="fundingRound" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

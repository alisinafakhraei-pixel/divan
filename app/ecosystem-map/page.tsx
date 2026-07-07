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
import { getPeople } from "@/lib/data-access/people";
import { getSiteStats } from "@/lib/data-access/stats";
import { getStartups } from "@/lib/data-access/startups";

export default async function EcosystemMapPage() {
  const [stats, people, startups, hqLocationBreakdown, businessModelBreakdown, industryBreakdown, fundingStageBreakdown] =
    await Promise.all([
      getSiteStats(),
      getPeople(),
      getStartups(),
      getHqLocationBreakdown(),
      getBusinessModelBreakdown(),
      getIndustryBreakdown(),
      getFundingStageBreakdown(),
    ]);

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-12 sm:px-6">
      <SectionHeading
        as="h1"
        bold="Ecosystem"
        muted="map"
        subhead="Computed live from the Startups and Entrepreneurs directories — click any segment to jump to the filtered view."
      />

      <StatsBar
        stats={[
          { label: "Startups", value: stats.totalStartups },
          { label: "Entrepreneurs", value: stats.totalEntrepreneurs },
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
          <WorldMap people={people} startups={startups} />
        </TabsContent>

        <TabsContent value="hq" className="pt-6">
          <ClickableDonutChart data={hqLocationBreakdown} linkBase="/startups" linkParam="hqCountry" />
        </TabsContent>

        <TabsContent value="model" className="pt-6">
          <ClickableDonutChart data={businessModelBreakdown} linkBase="/startups" linkParam="businessModel" />
        </TabsContent>

        <TabsContent value="industries" className="pt-6">
          <ClickableBarChart data={industryBreakdown} linkBase="/startups" linkParam="industry" />
        </TabsContent>

        <TabsContent value="funding" className="pt-6">
          <ClickableBarChart data={fundingStageBreakdown} linkBase="/startups" linkParam="fundingRound" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

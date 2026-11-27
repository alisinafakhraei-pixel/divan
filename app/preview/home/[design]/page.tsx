import { HomeFrontPage } from "@/components/home/prototypes/front-page";
import { HomeLiveExplorer } from "@/components/home/prototypes/live-explorer";
import { loadHomeData } from "@/components/home/prototypes/load";
import { HomeSpotlightRows } from "@/components/home/prototypes/spotlight-rows";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Unlisted review pages for the new homepage designs: not linked from anywhere on the site and hidden from search engines.
// Share the URL directly: /preview/home/1, /preview/home/2, /preview/home/3
export const metadata: Metadata = {
  title: "Homepage preview | Divan",
  robots: { index: false, follow: false, nocache: true },
};

export default async function HomePreviewPage({ params }: { params: Promise<{ design: string }> }) {
  const { design } = await params;
  if (!["1", "2", "3"].includes(design)) notFound();

  const data = await loadHomeData();
  if (design === "1") return <HomeFrontPage data={data} />;
  if (design === "2") return <HomeLiveExplorer data={data} />;
  return <HomeSpotlightRows data={data} />;
}

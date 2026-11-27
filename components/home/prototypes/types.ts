import type { HeroStat } from "@/components/home/hero-types";
import type { ActivityFeed } from "@/lib/data-access/activity";
import type { NewsItem, Person, Startup } from "@/lib/types";

/** Everything the homepage designs draw on, loaded once so each design is just layout. */
export interface HomeData {
  heroStats: HeroStat[];
  featuredPeople: Person[];
  featuredStartups: Startup[];
  allPeople: Person[];
  allStartups: Startup[];
  news: NewsItem[];
  feed: ActivityFeed;
  vouchCounts: Record<string, number>;
}

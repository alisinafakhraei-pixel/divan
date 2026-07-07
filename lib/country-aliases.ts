/** Aliases from our fixture country names to the world-atlas topojson's country names. Kept dependency-free (no lib/data-access import) so client components like WorldMap can use it without pulling in server-only code. */
export const COUNTRY_TOPOJSON_ALIASES: Record<string, string> = {
  "United States": "United States of America",
};

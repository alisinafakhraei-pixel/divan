export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Continues an existing "prefix-01", "prefix-02", ... sequence — matches the id scheme already used in data/people.json and data/startups.json. */
export function nextSequentialId(prefix: string, existingIds: string[]): string {
  const numbers = existingIds
    .map((id) => id.match(new RegExp(`^${prefix}-(\\d+)$`)))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => parseInt(match[1], 10));
  const next = (numbers.length > 0 ? Math.max(...numbers) : 0) + 1;
  return `${prefix}-${String(next).padStart(2, "0")}`;
}

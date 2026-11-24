import https from "node:https";
import { getPeople } from "@/lib/data-access/people";
import { getStartups } from "@/lib/data-access/startups";
import type { NewsItem, NewsType } from "@/lib/types";

// Divan AI curator: asks Gemini (with Google Search grounding) for the week's notable stories, then refuses to
// publish anything it cannot verify — every candidate's article is opened and checked before it is kept.

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-flash-latest";
const MAX_PER_RUN = 5;
const FRESH_WINDOW_DAYS = 16;
const ALLOWED_TYPES: NewsType[] = ["Funding News", "News", "Article", "Event"];
const STOPWORDS = new Set(
  "the and for that which with from this into over after about their its are was were has have been will new more than who how why what when where startup startups company companies raise raises raised".split(" ")
);
const GEMINI_ATTEMPTS = 4;
const USER_AGENT = "Mozilla/5.0 (compatible; DivanNewsBot/1.0; +https://divan.ac)";

// Divan covers founders and startups, not politics — anything touching these topics is dropped, whatever the source.
const BLOCKED_TOPICS =
  /\b(regime|sanctions?|war|military|missiles?|irgc|protests?|nuclear|elections?|crackdown|execution|executed|airstrike|terror\w*|propaganda)\b/i;

// State-run outlets are never used as sources: Divan is about founders and builders, not government messaging.
const BLOCKED_DOMAINS = [
  "tasnimnews.com",
  "farsnews.ir",
  "farsnews.com",
  "presstv.ir",
  "presstv.com",
  "irna.ir",
  "mehrnews.com",
  "tehrantimes.com",
  "tasnimnews.ir",
  "tasnimmedia.com",
  "irna.com",
  "mehrnews.ir",
  "pishrafteirani.ir",
  "iranprogress.org",
  "isna.ir",
  "kayhan.ir",
  "iranpress.com",
  "iribnews.ir",
  "yjc.ir",
];

export interface CurationReport {
  added: NewsItem[];
  rejected: { title: string; reason: string; source?: string }[];
  candidates: number;
}

interface Candidate {
  title?: unknown;
  summary?: unknown;
  sourceUrl?: unknown;
  sourceName?: unknown;
  publishedDate?: unknown;
  category?: unknown;
  country?: unknown;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function buildPrompt(today: string, knownTitles: string[]): string {
  // Kept deliberately short: a long, rule-heavy prompt pushes Gemini's search past Google's 60s idle cutoff.
  const skip = knownTitles.length ? ` Skip anything already covered: ${knownTitles.join(" | ")}.` : "";
  return `Today is ${today}. Use the Google Search tool to find the most notable news from the last 14 days about Iranian and Persian entrepreneurs around the world: Iranian-born or Iranian-heritage founders and their startups in the US, Canada, Europe, the Gulf, Australia and elsewhere (funding rounds, launches, acquisitions, exits, hackathons, community events, notable talks). Do NOT cover companies or tech scenes based inside Iran. Business and tech only, no politics. Prefer independent outlets, company blogs and press releases.${skip} Return ONLY a JSON array of up to ${MAX_PER_RUN} items: {"title", "summary" (max 2 sentences, your own words), "sourceUrl", "sourceName", "publishedDate" (YYYY-MM-DD), "country" (where the founder or company is based), "category" (Funding News|News|Article|Event)}. Only real articles you found; an empty array if none.`;
}

interface GeminiResult {
  candidates: Candidate[];
  /** Domains of the pages Google Search actually returned — the evidence the answer is grounded in. */
  groundedDomains: string[];
  /** The real pages Google Search returned (redirect links) — a fallback when the model garbles an article URL. */
  groundedUrls: string[];
  searches: number;
}

function postStream(url: string, headers: Record<string, string>, body: string, timeoutMs: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method: "POST", headers: { ...headers, "Content-Length": Buffer.byteLength(body) } }, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (c: Buffer) => chunks.push(c));
      res.on("end", () => {
        const text = Buffer.concat(chunks).toString("utf-8");
        if ((res.statusCode ?? 500) >= 400) reject(new Error(`Gemini request failed: ${res.statusCode} ${text.slice(0, 300)}`));
        else resolve(text);
      });
      res.on("error", reject);
    });
    req.setTimeout(timeoutMs, () => req.destroy(new Error("Gemini request timed out")));
    req.on("error", reject);
    req.end(body);
  });
}

async function askGeminiOnce(prompt: string): Promise<GeminiResult> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");

  // Streamed (SSE) on purpose: Google drops requests that sit silent for ~60s, and a grounded answer can take
  // close to that. "medium" thinking is the lowest level at which the model reliably runs its web searches.
  // Plain node:https rather than fetch: Next.js wraps the global fetch, and that wrapper kills this long call.
  const body = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    tools: [{ google_search: {} }],
    generationConfig: { thinkingConfig: { thinkingLevel: "medium" } },
  });
  const raw = await postStream(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse`,
    { "x-goog-api-key": key, "Content-Type": "application/json" },
    body,
    150_000
  );

  let text = "";
  const groundedDomains = new Set<string>();
  const groundedUrls = new Set<string>();
  let searches = 0;
  for (const line of raw.split("\n")) {
    if (!line.startsWith("data:")) continue;
    try {
      const chunk = JSON.parse(line.slice(5));
      const candidate = chunk?.candidates?.[0];
      for (const part of (candidate?.content?.parts ?? []) as { text?: string; thought?: boolean }[]) {
        if (!part.thought) text += part.text ?? "";
      }
      const grounding = candidate?.groundingMetadata;
      if (grounding) {
        searches += (grounding.webSearchQueries ?? []).length;
        for (const c of grounding.groundingChunks ?? []) {
          const title = String(c?.web?.title ?? "").toLowerCase().replace(/^www\./, "");
          if (title.includes(".")) groundedDomains.add(title);
          if (typeof c?.web?.uri === "string") groundedUrls.add(c.web.uri);
        }
      }
    } catch {
      // ignore keep-alive / partial lines
    }
  }

  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  let candidates: Candidate[] = [];
  if (start !== -1 && end > start) {
    const parsed = JSON.parse(text.slice(start, end + 1));
    if (Array.isArray(parsed)) candidates = parsed;
  }
  return { candidates, groundedDomains: [...groundedDomains], groundedUrls: [...groundedUrls], searches };
}

async function askGemini(prompt: string): Promise<GeminiResult> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= GEMINI_ATTEMPTS; attempt += 1) {
    try {
      const result = await askGeminiOnce(prompt);
      // No search evidence means the model answered from memory — nothing from it can be trusted.
      if (result.searches === 0 || result.groundedDomains.length === 0) {
        throw new Error("Gemini answered without searching the web");
      }
      return result;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Gemini request failed");
}

function normalizeUrl(raw: string): string {
  try {
    const u = new URL(raw);
    for (const k of [...u.searchParams.keys()]) {
      if (k.startsWith("utm_") || k === "fbclid" || k === "gclid") u.searchParams.delete(k);
    }
    u.hash = "";
    return `${u.hostname.replace(/^www\./, "")}${u.pathname.replace(/\/$/, "")}${u.search}`.toLowerCase();
  } catch {
    return raw.toLowerCase();
  }
}

function cleanUrl(raw: string): string {
  const u = new URL(raw);
  for (const k of [...u.searchParams.keys()]) {
    if (k.startsWith("utm_") || k === "fbclid" || k === "gclid") u.searchParams.delete(k);
  }
  u.hash = "";
  return u.toString();
}

function words(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function similar(a: string, b: string): boolean {
  const A = new Set(words(a));
  const B = new Set(words(b));
  if (A.size === 0 || B.size === 0) return false;
  let shared = 0;
  for (const w of A) if (B.has(w)) shared += 1;
  return shared / (A.size + B.size - shared) >= 0.7;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");
}

function stripHtml(html: string): string {
  return html
    .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#?\w+;/g, " ")
    .replace(/\s+/g, " ");
}

type Fetched = { ok: true; finalUrl: string; pageText: string; rawText: string; image?: string } | { ok: false; reason: string };
const fetchCache = new Map<string, Promise<Fetched>>();

/** The article's own preview image (og:image / twitter:image), as an absolute https URL. */
function findPreviewImage(html: string, pageUrl: string): string | undefined {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    if (!/(property|name)=["'](og:image(:secure_url)?|twitter:image)["']/i.test(tag)) continue;
    const content = tag.match(/content=["']([^"']+)["']/i)?.[1];
    if (!content) continue;
    try {
      const url = new URL(content.replace(/&amp;/g, "&"), pageUrl);
      if (url.protocol === "https:") return url.toString();
    } catch {
      // try the next tag
    }
  }
  return undefined;
}

/** Opens a link and returns the live page's text (cached, so a grounded page checked for one story isn't re-fetched). */
export function fetchArticle(sourceUrl: string): Promise<Fetched> {
  const cached = fetchCache.get(sourceUrl);
  if (cached) return cached;
  const job = (async (): Promise<Fetched> => {
    let res: Response;
    try {
      res = await fetch(sourceUrl, {
        redirect: "follow",
        headers: { "User-Agent": USER_AGENT, Accept: "text/html,application/xhtml+xml" },
        signal: AbortSignal.timeout(15_000),
        cache: "no-store",
      });
    } catch {
      return { ok: false, reason: "source link did not load" };
    }
    if (!res.ok) return { ok: false, reason: `source link returned ${res.status}` };
    if (new URL(res.url).hostname.endsWith("google.com")) return { ok: false, reason: "link never resolved to a publisher" };
    if (!(res.headers.get("content-type") ?? "").includes("html")) return { ok: false, reason: "source is not a web page" };
    const html = (await res.text()).slice(0, 600_000);
    const rawText = stripHtml(html);
    return { ok: true, finalUrl: cleanUrl(res.url), pageText: rawText.toLowerCase(), rawText, image: findPreviewImage(html, res.url) };
  })();
  fetchCache.set(sourceUrl, job);
  return job;
}

/** Confirms the page actually mentions what the headline claims. */
function matchesHeadline(pageText: string, title: string): boolean | "generic" {
  // Distinctive words from the headline: names and numbers, minus filler (headlines are often Title Case, so
  // capitalisation alone would count "That" or "Which" as evidence).
  const distinctive = title
    .split(/[\s\-/]+/)
    .slice(1)
    .map((w) => w.replace(/[^\p{L}\p{N}$%.]/gu, ""))
    .filter((w) => w.length > 2 && !STOPWORDS.has(w.toLowerCase()) && (/^\p{Lu}/u.test(w) || /\d/.test(w)));
  const needles = distinctive.length >= 2 ? distinctive : words(title).filter((w) => w.length > 4 && !STOPWORDS.has(w));
  if (needles.length === 0) return "generic";
  const hits = needles.filter((w) => pageText.includes(w.toLowerCase())).length;
  return hits / needles.length >= 0.6;
}

/** Tries the model's link first; if that is dead or about something else, falls back to the real pages Google returned. */
async function verifyArticle(
  sourceUrl: string,
  title: string,
  groundedUrls: string[]
): Promise<{ ok: true; finalUrl: string; image?: string; mentionsIran: boolean } | { ok: false; reason: string }> {
  let firstFailure = "source link did not load";
  for (const url of [sourceUrl, ...groundedUrls.filter((u) => u !== sourceUrl)]) {
    const page = await fetchArticle(url);
    if (!page.ok) {
      if (url === sourceUrl) firstFailure = page.reason;
      continue;
    }
    const match = matchesHeadline(page.pageText, title);
    if (match === "generic") return { ok: false, reason: "headline too generic to verify" };
    if (match) return { ok: true, finalUrl: page.finalUrl, image: page.image, mentionsIran: /\b(iran|iranian|iranians|persian)\b/.test(page.pageText) };
    if (url === sourceUrl) firstFailure = "article does not match the headline";
  }
  return { ok: false, reason: firstFailure };
}

function mentionedIds(text: string, names: { id: string; name: string }[]): string[] {
  const hay = ` ${text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ")} `;
  return names
    .filter(({ name }) => name.trim().length >= 4 && hay.includes(` ${name.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").trim()} `))
    .map(({ id }) => id);
}

export async function curateNews(existing: NewsItem[], now = new Date()): Promise<CurationReport> {
  fetchCache.clear();
  const today = isoDate(now);
  const oldest = isoDate(new Date(now.getTime() - FRESH_WINDOW_DAYS * 86_400_000));
  const known = existing.slice(0, 40);

  const { candidates, groundedDomains, groundedUrls } = await askGemini(buildPrompt(today, known.map((n) => n.title)));
  const [people, startups] = await Promise.all([getPeople(), getStartups()]);
  const entities = [...people, ...startups].map((e) => ({ id: e.id, name: e.name }));

  const added: NewsItem[] = [];
  const rejected: CurationReport["rejected"] = [];
  const takenUrls = new Set(existing.map((n) => normalizeUrl(n.link)));
  const takenSlugs = new Set(existing.map((n) => n.slug));
  const takenTitles = existing.map((n) => n.title);

  for (const c of candidates.slice(0, MAX_PER_RUN * 2)) {
    const title = typeof c.title === "string" ? c.title.trim() : "";
    const summary = typeof c.summary === "string" ? c.summary.trim() : "";
    const sourceUrl = typeof c.sourceUrl === "string" ? c.sourceUrl.trim() : "";
    const date = typeof c.publishedDate === "string" ? c.publishedDate.trim() : "";
    const sourceName = typeof c.sourceName === "string" ? c.sourceName.trim().slice(0, 60) : "";
    const label = title || "(untitled)";
    const reject = (reason: string) => rejected.push({ title: label, reason, source: sourceName || undefined });

    if (!title || title.length > 180 || !summary || summary.length > 500 || !sourceUrl) {
      reject("missing or malformed fields");
      continue;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < oldest || date > today) {
      reject("not published recently");
      continue;
    }
    const country = typeof c.country === "string" ? c.country.trim() : "";
    if (/\biran\b|\bislamic republic\b|\btehran\b/i.test(country) || /\b(tehran|isfahan|shiraz|tabriz|mashhad)\b/i.test(`${title} ${summary}`)) {
      reject("based in Iran — Divan covers Iranian entrepreneurs abroad");
      continue;
    }
    if (BLOCKED_TOPICS.test(`${title} ${summary}`)) {
      reject("outside Divan's scope (politics or conflict)");
      continue;
    }
    if (added.length >= MAX_PER_RUN) {
      reject("daily limit reached");
      continue;
    }

    const check = await verifyArticle(sourceUrl, title, groundedUrls);
    if (!check.ok) {
      reject(check.reason);
      continue;
    }

    // A story can match its own headline and still be off-topic (e.g. a robotaxi launch). The article itself must mention Iran or Persian.
    if (!check.mentionsIran) {
      reject("article never mentions Iran or Persian");
      continue;
    }

    const host = new URL(check.finalUrl).hostname.toLowerCase().replace(/^www\./, "");
    if (BLOCKED_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`))) {
      reject("source is a state-run outlet");
      continue;
    }
    if (!groundedDomains.some((d) => host === d || host.endsWith(`.${d}`) || d.endsWith(`.${host}`))) {
      reject("source was not among the pages Google Search returned");
      continue;
    }

    const urlKey = normalizeUrl(check.finalUrl);
    if (takenUrls.has(urlKey) || takenTitles.some((t) => similar(t, title))) {
      reject("already published");
      continue;
    }

    let slug = slugify(title) || "story";
    if (takenSlugs.has(slug)) slug = `${slug}-${date}`;

    const type: NewsType = ALLOWED_TYPES.includes(c.category as NewsType) ? (c.category as NewsType) : "News";
    const item: NewsItem = {
      id: `nw-auto-${date.replaceAll("-", "")}-${slug.slice(0, 24)}`,
      slug,
      title,
      link: check.finalUrl,
      type,
      tldr: summary,
      sourceFavicon: "",
      submittedBy: "Divan AI",
      date,
      relatedEntityIds: mentionedIds(`${title} ${summary}`, entities),
      auto: true,
      sourceName: sourceName || new URL(check.finalUrl).hostname.replace(/^www\./, ""),
      image: check.image,
    };

    added.push(item);
    takenUrls.add(urlKey);
    takenSlugs.add(slug);
    takenTitles.push(title);
  }

  return { added, rejected, candidates: candidates.length };
}

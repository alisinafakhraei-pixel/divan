const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER ?? "alisinafakhraei-pixel";
const GITHUB_REPO = process.env.GITHUB_REPO ?? "divan";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH ?? "main";

// Reads and writes go straight to the GitHub repo via the Contents API — this works identically
// on localhost and on serverless platforms like Vercel, where the deployed filesystem is read-only.
// Reads are cached in memory per warm instance for CACHE_TTL_MS so a page load that touches the
// same file several times (e.g. filters + listing) doesn't fire off several GitHub requests, and so
// we don't burn through GitHub's API rate limit under real traffic.
const CACHE_TTL_MS = 30_000;
const cache = new Map<string, { data: unknown; expiresAt: number }>();

function assertConfigured(): void {
  if (!GITHUB_TOKEN) {
    throw new Error(
      "GITHUB_TOKEN is not set. Divan reads/writes data/*.json and public/uploads/** through the GitHub API " +
        "(GitHub is the database) — set GITHUB_TOKEN to a repo-scoped personal access token in your environment."
    );
  }
}

function apiUrl(path: string): string {
  return `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
}

async function githubFetch(path: string, init?: RequestInit): Promise<Response> {
  assertConfigured();
  return fetch(apiUrl(path), {
    ...init,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
}

interface GitHubContentResponse {
  sha: string;
  content: string;
}

async function getFile(path: string): Promise<GitHubContentResponse | null> {
  const res = await githubFetch(`${path}?ref=${GITHUB_BRANCH}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub read failed for ${path}: ${res.status} ${await res.text()}`);
  return res.json();
}

async function putFile(path: string, base64Content: string, message: string): Promise<void> {
  const existing = await getFile(path);
  const res = await githubFetch(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, content: base64Content, sha: existing?.sha, branch: GITHUB_BRANCH }),
  });
  if (!res.ok) throw new Error(`GitHub write failed for ${path}: ${res.status} ${await res.text()}`);
}

export async function readJsonFile<T>(path: string): Promise<T> {
  const cached = cache.get(path);
  if (cached && cached.expiresAt > Date.now()) return cached.data as T;

  const result = await getFile(path);
  if (!result) throw new Error(`${path} not found in the GitHub repo`);
  const data = JSON.parse(Buffer.from(result.content, "base64").toString("utf-8"));
  cache.set(path, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  return data as T;
}

export async function writeJsonFile(path: string, data: unknown, message: string): Promise<void> {
  const content = Buffer.from(JSON.stringify(data, null, 2) + "\n").toString("base64");
  await putFile(path, content, message);
  cache.set(path, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

export async function writeBinaryFile(path: string, buffer: Buffer, message: string): Promise<void> {
  await putFile(path, buffer.toString("base64"), message);
}

export async function readBinaryFile(path: string): Promise<Buffer | null> {
  const result = await getFile(path);
  if (!result) return null;
  return Buffer.from(result.content, "base64");
}

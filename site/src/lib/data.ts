import type {
  Feature,
  Group,
  Provider,
  Situation,
  Verdict,
} from "../data/schema";
import { plainText } from "./plain";

/**
 * Provider documentation uses Markdown emphasis and code fences. The data files
 * keep the original wording; every string is stripped once at load so all pages
 * render the same text without literal `backticks` or **asterisks**.
 */
function cleanDeep<T>(value: T): T {
  if (typeof value === "string") return plainText(value) as T;
  if (Array.isArray(value)) return value.map((item) => cleanDeep(item)) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      out[key] = cleanDeep(item);
    }
    return out as T;
  }
  return value;
}

const providerModules = import.meta.glob<Provider>("../data/providers/*.json", {
  eager: true,
  import: "default",
});
const featureModules = import.meta.glob<Feature>("../data/features/*.json", {
  eager: true,
  import: "default",
});
const groupModule = import.meta.glob<{ groups: Group[] }>(
  "../data/groups.json",
  { eager: true, import: "default" },
);
const situationModule = import.meta.glob<{ situations: Situation[] }>(
  "../data/situations.json",
  { eager: true, import: "default" },
);

const VERDICTS: Verdict[] = ["yes", "partly", "no", "not-published", "pending"];

function fail(message: string): never {
  throw new Error(`Content check failed: ${message}`);
}

export const providers: Provider[] = Object.values(providerModules)
  .map((p) => cleanDeep(p))
  .sort((a, b) => a.name.localeCompare(b.name));

export const providerById = new Map(providers.map((p) => [p.id, p]));

export const features: Feature[] = Object.values(featureModules)
  .map((f) => cleanDeep(f))
  .sort((a, b) => a.order - b.order);

export const groups: Group[] = cleanDeep(
  Object.values(groupModule)[0]?.groups ?? [],
).sort(
  (a, b) =>
    features.findIndex((f) => f.group === a.id) -
    features.findIndex((f) => f.group === b.id),
);

export const situations: Situation[] = cleanDeep(
  Object.values(situationModule)[0]?.situations ?? [],
);

export function providerName(id: string): string {
  return providerById.get(id)?.name ?? id;
}

/** Cross-checks the data so a missing provider or a typo fails the build. */
export function validateContent(): void {
  if (providers.length === 0) fail("no providers found in src/data/providers");
  if (features.length === 0) fail("no features found in src/data/features");

  for (const p of providers) {
    if (!p.id || !p.name) fail(`provider is missing id or name: ${JSON.stringify(p)}`);
    if (p.status === "researched" && !p.cost) {
      fail(`provider ${p.id} is researched but has no cost examples`);
    }
  }

  for (const f of features) {
    if (!f.id || !f.title) fail(`feature is missing id or title: ${JSON.stringify(f)}`);
    if (!groups.some((g) => g.id === f.group)) {
      fail(`feature ${f.id} has unknown group "${f.group}"`);
    }
    for (const row of f.rows) {
      if (!providerById.has(row.provider)) {
        fail(`feature ${f.id} refers to unknown provider "${row.provider}"`);
      }
      if (!VERDICTS.includes(row.verdict)) {
        fail(`feature ${f.id}/${row.provider} has verdict "${row.verdict}"`);
      }
    }
    const covered = new Set(f.rows.map((r) => r.provider));
    for (const p of providers) {
      if (!covered.has(p.id)) fail(`feature ${f.id} has no row for provider ${p.id}`);
    }
  }

  for (const s of situations) {
    for (const id of s.features) {
      if (!features.some((f) => f.id === id)) {
        fail(`situation ${s.id} refers to unknown feature "${id}"`);
      }
    }
    for (const pick of s.providers) {
      if (!providerById.has(pick.provider)) {
        fail(`situation ${s.id} refers to unknown provider "${pick.provider}"`);
      }
    }
  }
}

validateContent();

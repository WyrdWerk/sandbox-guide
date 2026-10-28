import type {
  Feature,
  GlossaryEntry,
  Provider,
  Term,
  UseCase,
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
const termModules = import.meta.glob<Term>("../data/terminology/*.json", {
  eager: true,
  import: "default",
});
const glossaryModule = import.meta.glob<{ entries: GlossaryEntry[] }>(
  "../data/glossary.json",
  { eager: true, import: "default" },
);
const useCaseModule = import.meta.glob<{ useCases: UseCase[] }>(
  "../data/use-cases.json",
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

export const terms: Term[] = Object.values(termModules)
  .map((t) => cleanDeep(t))
  .sort((a, b) => a.term.localeCompare(b.term));

export const glossary: GlossaryEntry[] = cleanDeep(
  Object.values(glossaryModule)[0]?.entries ?? [],
);
export const useCases: UseCase[] = cleanDeep(
  Object.values(useCaseModule)[0]?.useCases ?? [],
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
    for (const pick of f.picks) {
      for (const id of pick.providers) {
        if (!providerById.has(id)) {
          fail(`feature ${f.id} pick refers to unknown provider "${id}"`);
        }
      }
    }
  }
}

validateContent();

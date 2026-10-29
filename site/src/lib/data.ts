import type {
  Capability,
  Change,
  Confidence,
  CostCase,
  Feature,
  GlossaryEntry,
  Group,
  Guide,
  Provider,
  Situation,
  UseCase,
  Verdict,
} from "../data/schema";
import { plainText } from "./plain";
import { presets, price, formatMoney, type RateCard } from "./cost";
import glossaryData from "../data/glossary.json";
import capabilityData from "../data/capabilities.json";

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
const pricingModules = import.meta.glob<RateCard>("../data/pricing/*.json", {
  eager: true,
  import: "default",
});
const useCaseModule = import.meta.glob<{ usecases: UseCase[]; checkedOn: string }>("../data/usecases.json", {
  eager: true,
  import: "default",
});
const docsModule = import.meta.glob<Record<string, Record<string, { title: string; url: string }>>>(
  "../data/docs.json",
  { eager: true, import: "default" },
);
const guideModule = import.meta.glob<{ guides: Guide[] }>("../data/guides.json", { eager: true, import: "default" });
/** Articles; strings keep their [links](url), like use cases. */
export const guides: Guide[] = Object.values(guideModule)[0]?.guides ?? [];

const changeModule = import.meta.glob<{ changes: Change[] }>(
  "../data/changes.json",
  { eager: true, import: "default" },
);

/** Provenance tag classes, shared by quotes and the folded sources in compare tables. */
export const tagClass: Record<Confidence, string> = {
  "docs-confirmed": "tag tag--docs",
  "pricing-page": "tag tag--pricing",
  "third-party": "tag tag--third-party",
  inferred: "tag tag--inferred",
  "not-published": "tag tag--not-published",
};

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

export const changes: Change[] = cleanDeep(
  Object.values(changeModule)[0]?.changes ?? [],
).sort((a, b) => b.date.localeCompare(a.date));

/** Rate cards for the calculator, one per researched provider, sorted by provider name. */
export const pricing: RateCard[] = Object.values(pricingModules).sort((a, b) =>
  (providerById.get(a.provider)?.name ?? a.provider).localeCompare(providerById.get(b.provider)?.name ?? b.provider),
);

/**
 * Use cases keep their [text](url) links and **bold**: the page renders them as
 * markup, unlike provider quotes, which are stripped to plain text.
 */
export const useCases: UseCase[] = Object.values(useCaseModule)[0]?.usecases ?? [];

/** "2026-10-29" -> "29 October 2026". */
export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/**
 * When each kind of claim was last checked. Prices use the oldest rate card, so
 * "prices checked on X" stays true for every card; the weekly price check moves it.
 */
export const checked = {
  prices: pricing.map((c) => c.checkedOn).sort()[0],
  useCases: Object.values(useCaseModule)[0]!.checkedOn,
  capabilities: (capabilityData as { checkedOn: string }).checkedOn,
};

/** Specific capabilities, each checked for every provider. Strings keep their [links](url). */
export const capabilities: Capability[] = (capabilityData as { capabilities: Capability[] }).capabilities;
export const capabilityById = new Map(capabilities.map((c) => [c.id, c]));
export const capabilitiesOf = (featureId: string) => capabilities.filter((c) => c.feature === featureId);
/** Verdicts in the order a reader cares about: does it fully, with a catch, not at all, unknown. */
export const capabilityVerdicts = ["yes", "partly", "no", "not-published"] as const;
export const capabilityLabel = {
  yes: "Yes",
  partly: "With a catch",
  no: "No",
  "not-published": "Not published",
} as const;

/** Plain-language definitions, shown on hover or focus wherever a <Term> appears. */
export const glossary: GlossaryEntry[] = glossaryData.terms;
export const glossaryById = new Map(glossary.map((g) => [g.id, g]));

/** The provider's own documentation page for a feature, by provider id and feature id. */
export const docLinks: Record<string, Record<string, { title: string; url: string }>> =
  Object.values(docsModule)[0] ?? {};

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
    if (p.status === "researched" && !pricing.some((c) => c.provider === p.id)) {
      fail(`provider ${p.id} is researched but has no rate card in src/data/pricing`);
    }
    if (p.status === "researched" && !p.company?.facts?.length) {
      fail(`provider ${p.id} has no company facts`);
    }
    if (p.status === "researched" && (!p.fits?.well?.length || !p.fits?.badly?.length)) {
      fail(`provider ${p.id} has no fits well / fits badly pair`);
    }
  }

  for (const f of features) {
    if (!f.id || !f.title) fail(`feature is missing id or title: ${JSON.stringify(f)}`);
    if (!groups.some((g) => g.id === f.group)) {
      fail(`feature ${f.id} has unknown group "${f.group}"`);
    }
    if (!f.figureLabel) fail(`feature ${f.id} has no figureLabel`);
    if (!f.scenario?.title || !f.scenario?.beats?.length) {
      fail(`feature ${f.id} has no worked scenario`);
    }
    if (!Array.isArray(f.questions) || f.questions.length < 3 || f.questions.length > 5) {
      fail(`feature ${f.id} needs 3 to 5 questions, has ${f.questions?.length ?? 0}`);
    }
    for (const row of f.rows) {
      if (!providerById.has(row.provider)) {
        fail(`feature ${f.id} refers to unknown provider "${row.provider}"`);
      }
      if (!VERDICTS.includes(row.verdict)) {
        fail(`feature ${f.id}/${row.provider} has verdict "${row.verdict}"`);
      }
      if (!row.figure) fail(`feature ${f.id}/${row.provider} has no key figure`);
      if (!row.scenario) fail(`feature ${f.id}/${row.provider} has no scenario line`);
    }
    const covered = new Set(f.rows.map((r) => r.provider));
    for (const p of providers) {
      if (!covered.has(p.id)) fail(`feature ${f.id} has no row for provider ${p.id}`);
    }
  }

  for (const c of pricing) {
    if (!providerById.has(c.provider)) fail(`rate card for unknown provider "${c.provider}"`);
    if (!c.plans?.length) fail(`rate card ${c.provider} has no plans`);
    if (!c.sources?.length) fail(`rate card ${c.provider} has no sources`);
  }

  for (const u of useCases) {
    if (!presets[u.preset]) fail(`use case ${u.id} has unknown preset "${u.preset}"`);
    for (const id of u.features) {
      if (!features.some((f) => f.id === id)) fail(`use case ${u.id} refers to unknown feature "${id}"`);
    }
    for (const item of [...u.routes, ...u.picks]) {
      if (!providerById.has(item.provider)) fail(`use case ${u.id} refers to unknown provider "${item.provider}"`);
    }
  }

  for (const g of guides) {
    if (!g.sources.length) fail(`guide ${g.id} has no sources`);
    for (const s of g.sources) if (!s.url || !s.quote || !s.checkedOn) fail(`guide ${g.id} has a source without url, quote or date`);
    for (const id of g.capabilities) if (!capabilities.some((c) => c.id === id)) fail(`guide ${g.id} refers to unknown capability "${id}"`);
  }
  for (const u of useCases) {
    for (const m of u.managed ?? []) {
      if (!m.source?.url || !m.source.quote || !m.source.checkedOn) fail(`use case ${u.id}: managed service ${m.name} has no dated, quoted source`);
    }
  }

  for (const c of capabilities) {
    if (!features.some((f) => f.id === c.feature)) fail(`capability ${c.id} has unknown feature "${c.feature}"`);
    if (c.rows.length === 0) continue; // research not merged yet
    for (const row of c.rows) {
      if (!providerById.has(row.provider)) fail(`capability ${c.id} refers to unknown provider "${row.provider}"`);
      if (!capabilityVerdicts.includes(row.verdict)) fail(`capability ${c.id}/${row.provider} has verdict "${row.verdict}"`);
      if (row.verdict === "partly" && !row.shortfall) fail(`capability ${c.id}/${row.provider} is "partly" but says no shortfall`);
      if (!row.source?.url) fail(`capability ${c.id}/${row.provider} has no source`);
    }
    for (const p of providers) {
      if (c.rows.filter((r) => r.provider === p.id).length !== 1) fail(`capability ${c.id} needs exactly one row for ${p.id}`);
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

/** A reference workload (a, b or c) priced by the calculator engine, in the shape CostCard shows. */
export function engineCase(providerId: string, key: "a" | "b" | "c"): CostCase {
  const q = price(pricing.find((c) => c.provider === providerId)!, presets[key].workload);
  return {
    headline: q.feasible ? formatMoney(q.total) : `${formatMoney(q.total)}, with a catch`,
    shape: `${q.shape}${q.plan ? ` (plan: ${q.plan})` : ""}`,
    lines: q.lines.map((l) => ({ label: l.label, arithmetic: l.math, amount: formatMoney(l.amount) })),
    total: formatMoney(q.total),
    notes: q.notes,
    flag: q.problems.length ? `It cannot run this exactly as described: ${q.problems.join(" ")}` : undefined,
  };
}

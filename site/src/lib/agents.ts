// Plain Markdown and JSON versions of the guide for AI agents and scripts:
// /llms.txt, /llms-full.txt and /data/*. Built from the same data as the pages,
// so they change when the data does.
import site from "../data/site.json";
import comparisonData from "../data/comparisons.json";
import {
  capabilities,
  checked,
  docLinks,
  features,
  formatDate,
  glossary,
  guides,
  pricing,
  providerById,
  providerName,
  providers,
  useCases,
} from "./data";
import { formatMoney, modelCost, presets, price, type ModelPrice } from "./cost";
import modelData from "../data/models.json";
import type { Capability, Provider, UseCase } from "../data/schema";

export const base = (import.meta.env.SITE as string).replace(/\/$/, "");
export const abs = (path: string) => `${base}${path}`;

/** Wiki links become absolute Markdown links, glossary terms plain words. */
export function md(text: string): string {
  return text.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target: string, label?: string) => {
    const [ns, id] = target.includes(":") ? target.split(":", 2) : ["term", target];
    if (ns === "term") return label ?? glossary.find((g) => g.id === id)?.term.toLowerCase() ?? id;
    const path = { cap: "capabilities", feature: "features", provider: "providers", use: "use-cases" }[ns];
    const title =
      label ??
      (ns === "cap" ? capabilities.find((c) => c.id === id)?.title
        : ns === "feature" ? features.find((f) => f.id === id)?.navTitle
        : ns === "provider" ? providerName(id)
        : useCases.find((u) => u.id === id)?.title) ?? id;
    return `[${title}](${abs(`/${path}/${id}/`)})`;
  }).replace(/\]\((\/[^)]*)\)/g, (_, p: string) => `](${abs(p)})`);
}

const json = (value: unknown) =>
  new Response(JSON.stringify(value, null, 1), { headers: { "content-type": "application/json; charset=utf-8" } });
const text = (body: string, type = "text/markdown") =>
  new Response(body, { headers: { "content-type": `${type}; charset=utf-8` } });
export const respond = { json, text };

/** Every preset priced on every provider, cheapest that can run it as asked first. */
const rankings = new Map<string, ReturnType<typeof rank>>();
export function ranking(preset: string) {
  if (!rankings.has(preset)) rankings.set(preset, rank(preset));
  return rankings.get(preset)!;
}
function rank(preset: string) {
  return pricing
    .map((card) => ({ provider: card.provider, quote: price(card, presets[preset].workload) }))
    .sort((a, b) => Number(b.quote.feasible) - Number(a.quote.feasible) || a.quote.total - b.quote.total)
    .map(({ provider, quote }) => ({
      provider,
      name: providerName(provider),
      monthlyUsd: Math.round(quote.total * 100) / 100,
      fits: quote.feasible,
      plan: quote.plan,
      shape: quote.shape,
      problems: quote.problems,
      lines: quote.lines.map((l) => ({ label: l.label, math: l.math, usd: Math.round(l.amount * 100) / 100 })),
    }));
}

/** Head-to-head pairs and alternatives pages; an unknown provider id fails the build. */
export const comparisons = comparisonData as { pairs: [string, string][]; alternatives: string[] };
for (const id of [...comparisons.pairs.flat(), ...comparisons.alternatives]) {
  if (!providerById.get(id)) throw new Error(`Content check failed: comparisons.json names unknown provider "${id}"`);
}
export const pairSlug = (a: string, b: string) => `${a}-vs-${b}`;

/** The use-case workloads, one per preset, in guide order. */
export const workloads = [...new Set(useCases.map((u) => u.preset))].map((id) => ({ id, label: presets[id].label }));

/** One provider's price for one preset, from the shared ranking. */
export const quoteFor = (preset: string, provider: string) => ranking(preset).find((r) => r.provider === provider)!;

export const names = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}`);
const ordinal = (n: number) => `${n}${n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th"}`;

/** One or two sentences that answer a use-case page's question with prices and a date. */
export function useCaseAnswer(u: UseCase): string {
  const all = ranking(u.preset);
  const fit = all.filter((r) => r.fits);
  const ai = modelAnswer(u.preset);
  if (!fit.length) return `No provider runs it exactly as described; each has a catch, listed under the costs below.${ai ? ` ${ai}` : ""}`;
  const next = fit.slice(1, 3).map((r) => `${r.name} (${formatMoney(r.monthlyUsd)})`);
  return `The cheapest machine that runs it as described is ${fit[0].name} at ${formatMoney(fit[0].monthlyUsd)} a month${next.length ? `, then ${names(next)}` : ""}. ${fit.length} of ${all.length} providers run it without a catch. ${ai ?? "Any AI model is billed separately and not priced here."} List prices checked ${formatDate(checked.prices)}.`;
}

/** The model estimate the calculator adds for a preset, as one sentence, or null when the preset has no model. */
export function modelAnswer(preset: string): string | null {
  const w = presets[preset].workload;
  const ai = modelCost(w, (modelData as { models: ModelPrice[] }).models);
  if (!ai) return null;
  return `The AI model adds about ${formatMoney(ai.median)} a month on top (${ai.model.label}, ${w.messagesPerDay.toLocaleString("en-US")} requests a day at ${w.kTokens.toLocaleString("en-US")}k tokens each, median zero-retention price${ai.lowest < ai.median - 0.005 ? `; from ${formatMoney(ai.lowest)} at the cheapest host` : ""}).`;
}

/** What one always-on personal agent costs on this provider, and where that ranks. */
export function providerAnswer(p: Provider): string | undefined {
  if (p.status !== "researched") return undefined;
  const fit = ranking("personal").filter((r) => r.fits);
  const r = ranking("personal").find((x) => x.provider === p.id);
  if (!r) return undefined;
  const cost = `One always-on personal agent (2 vCPU / 4 GiB / 20 GiB) costs about ${formatMoney(r.monthlyUsd)} a month here`;
  const rank = r.fits
    ? `${cost}, the ${((n) => (n === 1 ? "" : `${ordinal(n)} `))(fit.findIndex((x) => x.provider === p.id) + 1)}cheapest of the ${fit.length} providers that run it as described.`
    : `${cost}, with a catch: ${r.problems.join(" ").replace(/\.$/, "")}.`;
  return `${rank} ${modelAnswer("personal") ?? ""} Fits well: ${p.fits.well[0]}`.replace(/  +/g, " ");
}

/** Which providers offer a capability, fully and with a catch. */
export function capabilityAnswer(c: Capability): string | undefined {
  if (!c.rows.length) return undefined;
  const who = (v: string) => c.rows.filter((r) => r.verdict === v).map((r) => providerName(r.provider)).sort();
  const yes = who("yes"), partly = who("partly");
  return [
    yes.length ? `${yes.length} of ${c.rows.length} providers offer it fully: ${names(yes)}.` : `None of the ${c.rows.length} providers offers it without a catch.`,
    partly.length ? `With a catch: ${names(partly)}.` : "",
    `Checked ${formatDate(checked.capabilities)}.`,
  ].filter(Boolean).join(" ");
}

export function rankingsMarkdown(): string {
  const out = [
    `# Monthly cost by use case`,
    ``,
    `Every provider priced for each preset workload by the guide's cost engine, from list rates checked ${checked.prices}. Illustrations, not quotes: tax, egress and discounts are left out. Providers that cannot run the workload exactly as described are listed after the ones that can, with the reason.`,
  ];
  for (const [id, p] of Object.entries(presets)) {
    const ai = modelAnswer(id);
    out.push(``, `## ${p.label} (\`${id}\`)`, ``, p.why, ...(ai ? [``, ai] : []), ``);
    ranking(id).forEach((r, i) =>
      out.push(`${i + 1}. ${r.name}: ${formatMoney(r.monthlyUsd)}/month${r.plan ? ` on ${r.plan}` : ""}, ${r.shape}${r.fits ? "" : `. Catch: ${r.problems.join(" ")}`}`),
    );
  }
  return out.join("\n") + "\n";
}

export function providerMarkdown(p: Provider): string {
  const out = [`# ${p.name}`, ``, `> ${p.oneLiner}`, ``, `Website: ${p.url}  `, `Guide page: ${abs(`/providers/${p.id}/`)}  `, `Checked: ${p.checkedOn ?? site.checkedOn}`];
  if (p.status === "pending") return [...out, ``, `Research on this provider is not finished.`].join("\n") + "\n";
  out.push(``, `**Short answer:** ${providerAnswer(p)}`, ``, ...p.whatItIs, ``, `**Who it is for:** ${p.whoFor}`, ``, `**Isolation:** ${p.kind === "vps" ? "A VPS (virtual private server), not a sandbox built for agents. " : ""}${p.isolation}`, ``, `**Sizes and regions:** ${p.sizes}`);
  out.push(``, `## How it charges`, ``, ...Object.entries(p.billing).map(([k, v]) => `- ${k}: ${v}`));
  const card = pricing.find((c) => c.provider === p.id);
  if (card) out.push(``, card.summary, ...card.notes.map((n) => `- ${n}`));
  out.push(``, `## Monthly cost for each preset workload`, ``);
  for (const id of Object.keys(presets)) {
    const r = ranking(id).find((x) => x.provider === p.id)!;
    out.push(`- ${presets[id].label}: ${formatMoney(r.monthlyUsd)}${r.fits ? "" : ` (catch: ${r.problems.join(" ")})`}`);
  }
  out.push(``, `## Fits well`, ``, ...p.fits.well.map((s) => `- ${s}`), ``, `## Fits badly`, ``, ...p.fits.badly.map((s) => `- ${s}`));
  out.push(``, `## Features`, ``);
  for (const f of features) {
    const row = f.rows.find((r) => r.provider === p.id);
    if (!row) continue;
    const doc = docLinks[p.id]?.[f.id];
    out.push(`- **${f.navTitle}** (${row.verdict}): ${row.figure}. ${row.note}${row.source ? ` [source](${row.source.url})` : ""}${doc ? ` [docs](${doc.url})` : ""}`);
  }
  out.push(``, `## Capabilities`, ``);
  for (const c of capabilities) {
    const row = c.rows.find((r) => r.provider === p.id);
    if (!row) continue;
    out.push(`- ${c.title}: ${row.verdict}${row.figure ? ` (${row.figure})` : ""}${row.shortfall ? `. ${md(row.shortfall)}` : ""} [source](${row.source.url})`);
  }
  out.push(``, `## Usability`, ``, `- Dashboard: ${p.usability.dashboard}`, `- Without code: ${p.usability.withoutCode}`, `- Signup: ${p.usability.signup}`, `- Docs: ${p.usability.docs}`, ...p.usability.tripsUp.map((s) => `- Trips people up: ${s}`));
  out.push(``, `## Company`, ``, ...p.company.facts.map((f) => `- ${f.label}: ${f.value}${f.source ? ` [source](${f.source.url})` : ""}`));
  if (p.caveats.length) out.push(``, `## Caveats`, ``, ...p.caveats.map((c) => `- **${c.issue}** (${c.status}): ${c.detail}`));
  out.push(``, `## Sources`, ``, ...p.sources.map((s) => `- [${s.label}](${s.url})`));
  return out.join("\n") + "\n";
}

export function useCaseMarkdown(id: string): string {
  const u = useCases.find((x) => x.id === id)!;
  const out = [`# ${u.title}`, ``, `> ${md(u.question)}`, ``, md(u.standfirst), ``, `Guide page: ${abs(`/use-cases/${u.id}/`)}`, ``, `**Short answer:** ${useCaseAnswer(u)}`, ``, ...u.whatItIs.map(md)];
  out.push(``, `## What it needs`, ``, ...u.needs.map((n) => `- **${n.label}:** ${md(n.value)} [source](${n.source})`));
  out.push(``, `## Picks`, ``, ...u.picks.map((p) => `- **${providerName(p.provider)}**, ${md(p.for)}: ${md(p.why)} Watch: ${md(p.watch)} ${p.link}`));
  out.push(``, `## How to run it on each provider`, ``, ...u.routes.map((r) => `- **${providerName(r.provider)}** (${r.tier}; no terminal: ${r.noTerminal}): ${md(r.what)}${r.price ? ` Price: ${r.price}.` : ""}${r.link ? ` [${r.link.title}](${r.link.url})` : ""}`));
  out.push(``, `## Monthly machine cost (preset \`${u.preset}\`)`, ``, presets[u.preset].why, ``, ...ranking(u.preset).map((r) => `- ${r.name}: ${formatMoney(r.monthlyUsd)}${r.fits ? "" : ` (catch: ${r.problems.join(" ")})`}`));
  if (u.managed?.length) out.push(``, `## Managed services (someone else runs it)`, ``, ...u.managed.map((m) => `- **${m.name}** (${m.url}): ${md(m.what)} From ${m.price}. Catch: ${md(m.catch)} [source](${m.source.url}), checked ${m.source.checkedOn}`));
  out.push(``, `## Outside a sandbox`, ``, md(u.outside), ``, `## Sources`, ``, ...u.sources.map((s) => `- [${s.label}](${s.url})`));
  return out.join("\n") + "\n";
}

export function guideMarkdown(id: string): string {
  const g = guides.find((x) => x.id === id)!;
  return [
    `# ${g.title}`, ``, `> ${g.question}`, ``, g.standfirst, ``, `Guide page: ${abs(`/guides/${g.id}/`)}  `, `Checked: ${g.checkedOn}`, ``,
    `**Short answer:** ${md(g.answer)}`,
    ...g.sections.flatMap((s) => [``, `## ${s.heading}`, ``, ...s.body.map(md)]),
    ``, `## Sources`, ``, ...g.sources.map((s) => `- [${s.label}](${s.url}) (${s.confidence}, checked ${s.checkedOn}): "${s.quote}"`),
  ].join("\n") + "\n";
}

export function featuresMarkdown(): string {
  const out = [`# Features that decide whether a sandbox fits`];
  for (const f of features) {
    out.push(``, `## ${f.title}`, ``, `Guide page: ${abs(`/features/${f.id}/`)}`, ``, f.standfirst, ``, ...f.idea, ``, `Watch for:`, ...f.watchFor.map((w) => `- ${w}`), ``, `Ask a provider:`, ...f.questions.map((q) => `- ${q}`), ``, `${f.figureLabel}, by provider:`);
    for (const r of f.rows) out.push(`- ${providerName(r.provider)} (${r.verdict}): ${r.figure}`);
  }
  return out.join("\n") + "\n";
}

export function capabilitiesMarkdown(): string {
  const out = [`# Capabilities, checked for every provider`, ``, `Verdicts: yes, partly (with the catch), no, not-published.`];
  for (const c of capabilities) {
    out.push(``, `## ${c.title}`, ``, `${md(c.plain)} Guide page: ${abs(`/capabilities/${c.id}/`)}`, ``);
    for (const r of c.rows) out.push(`- ${providerName(r.provider)}: ${r.verdict}${r.figure ? ` (${r.figure})` : ""}${r.shortfall ? `. ${md(r.shortfall)}` : ""}`);
  }
  return out.join("\n") + "\n";
}

export function glossaryMarkdown(): string {
  return [`# Glossary`, ``, ...glossary.map((g) => `- **${g.term}:** ${md(g.definition)}`)].join("\n") + "\n";
}

export function llmsTxt(): string {
  return `# ${site.shortTitle}

> ${site.description} Covers ${providers.length} providers, ${features.length} features, ${capabilities.length} capability checks and ${useCases.length} use-case guides. Every claim has a source URL, an exact quote and a confidence tag. Prices checked ${checked.prices}.

The HTML pages work without JavaScript, but these plain files are smaller and carry the same facts. Prices are list rates in US dollars excluding tax; "not published" means the provider says nothing, never an estimate.

## Data
- [Provider index](${abs("/data/index.json")}): every provider with its one-liner and links to its files
- Per provider: \`${abs("/data/providers/<id>.md")}\` (readable profile, costs, features, capabilities, company, sources) and \`${abs("/data/providers/<id>.json")}\` (the full record, rate card and doc links)
- [Use-case guides](${abs("/data/use-cases.md")}): what each agent job needs and how to run it on each provider; one file each at \`${abs("/data/use-cases/<id>.md")}\`
- [Features](${abs("/data/features.md")}) ([JSON](${abs("/data/features.json")})): what each feature means and each provider's key figure
- [Capabilities](${abs("/data/capabilities.md")}) ([JSON](${abs("/data/capabilities.json")})): yes / partly / no per provider, with the catch
- [Monthly cost by use case](${abs("/data/rankings.md")}) and [preset workloads](${abs("/data/presets.json")}); per preset: \`${abs("/data/rankings/<preset>.json")}\`
- [Glossary](${abs("/data/glossary.md")})
- [Everything in one file](${abs("/llms-full.txt")})

## Providers
${providers.map((p) => `- [${p.name}](${abs(`/data/providers/${p.id}.md`)}): ${p.oneLiner}`).join("\n")}

## Use cases
${useCases.map((u) => `- [${u.title}](${abs(`/data/use-cases/${u.id}.md`)}): ${md(u.question)}`).join("\n")}

## Guides
${guides.map((g) => `- [${g.title}](${abs(`/data/guides/${g.id}.md`)}): ${g.question}`).join("\n")}

## Notes
- About and publisher: ${abs("/about/")}
- Method and limits: ${abs("/how-we-checked/")}
- How costs are calculated: ${abs("/costs/how-it-works/")}
- Source code and data: https://github.com/WyrdWerk/sandbox-guide
- Report a mistake: https://github.com/WyrdWerk/sandbox-guide/issues
`;
}

export function llmsFullTxt(): string {
  return [
    llmsTxt(),
    `# Limits of this research\n\n${site.limits.map((l) => `- ${l}`).join("\n")}\n`,
    ...useCases.map((u) => useCaseMarkdown(u.id)),
    ...guides.map((g) => guideMarkdown(g.id)),
    featuresMarkdown(),
    capabilitiesMarkdown(),
    rankingsMarkdown(),
    ...providers.map(providerMarkdown),
    glossaryMarkdown(),
  ].join("\n---\n\n");
}

export const providerRecord = (id: string) => ({
  ...providerById.get(id),
  page: abs(`/providers/${id}/`),
  rateCard: pricing.find((c) => c.provider === id) ?? null,
  docs: docLinks[id] ?? {},
  features: Object.fromEntries(features.map((f) => [f.id, f.rows.find((r) => r.provider === id)])),
  capabilities: Object.fromEntries(capabilities.map((c) => [c.id, c.rows.find((r) => r.provider === id) ?? null])),
});

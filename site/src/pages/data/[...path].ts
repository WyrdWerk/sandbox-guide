// Every file under /data/, for agents and scripts. Listed in /llms.txt.
import { capabilities, features, guides, providers, useCases } from "../../lib/data";
import { presets } from "../../lib/cost";
import {
  abs, capabilitiesMarkdown, featuresMarkdown, glossaryMarkdown, providerMarkdown, providerRecord,
  guideMarkdown, ranking, rankingsMarkdown, respond, useCaseMarkdown,
} from "../../lib/agents";

const files: Record<string, () => unknown> = {
  "index.json": () => ({
    providers: providers.map((p) => ({
      id: p.id, name: p.name, url: p.url, status: p.status, oneLiner: p.oneLiner, isolation: p.isolation,
      page: abs(`/providers/${p.id}/`), markdown: abs(`/data/providers/${p.id}.md`), json: abs(`/data/providers/${p.id}.json`),
    })),
    useCases: useCases.map((u) => ({ id: u.id, title: u.title, question: u.question, preset: u.preset, page: abs(`/use-cases/${u.id}/`), markdown: abs(`/data/use-cases/${u.id}.md`) })),
    presets: Object.keys(presets).map((id) => ({ id, ranking: abs(`/data/rankings/${id}.json`) })),
  }),
  "features.json": () => features,
  "features.md": featuresMarkdown,
  "capabilities.json": () => capabilities,
  "capabilities.md": capabilitiesMarkdown,
  "glossary.md": glossaryMarkdown,
  "presets.json": () => presets,
  "rankings.md": rankingsMarkdown,
  "use-cases.md": () => useCases.map((u) => useCaseMarkdown(u.id)).join("\n---\n\n"),
  ...Object.fromEntries(providers.flatMap((p) => [
    [`providers/${p.id}.md`, () => providerMarkdown(p)],
    [`providers/${p.id}.json`, () => providerRecord(p.id)],
  ])),
  ...Object.fromEntries(guides.map((g) => [`guides/${g.id}.md`, () => guideMarkdown(g.id)])),
  ...Object.fromEntries(useCases.map((u) => [`use-cases/${u.id}.md`, () => useCaseMarkdown(u.id)])),
  ...Object.fromEntries(Object.keys(presets).map((id) => [`rankings/${id}.json`, () => ({ preset: id, ...presets[id], providers: ranking(id) })])),
};

export function getStaticPaths() {
  return Object.keys(files).map((path) => ({ params: { path } }));
}

export function GET({ params }: { params: { path: string } }) {
  const body = files[params.path]();
  return params.path.endsWith(".json") ? respond.json(body) : respond.text(body as string);
}

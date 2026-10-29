// Everything a reader might look up, written once at build time for the search page.
import { capabilities, features, glossary, guides, providers, useCases, situations } from "../lib/data";

export function GET() {
  const items = [
    ...useCases.map((u) => ({ kind: "Use case", title: u.title, url: `/use-cases/${u.id}/`, text: `${u.question} ${u.standfirst}` })),
    ...guides.map((g) => ({ kind: "Guide", title: g.title, url: `/guides/${g.id}/`, text: `${g.question} ${g.standfirst}` })),
    ...features.map((f) => ({ kind: "Feature", title: f.title, url: `/features/${f.id}/`, text: `${f.standfirst} ${f.idea.join(" ")}` })),
    ...capabilities.map((c) => ({ kind: "Capability", title: c.title, url: `/capabilities/${c.id}/`, text: c.plain })),
    ...providers.map((p) => ({ kind: "Provider", title: p.name, url: `/providers/${p.id}/`, text: p.oneLiner })),
    ...glossary.map((g) => ({ kind: "Glossary", title: g.term, url: `/glossary/#${g.id}`, text: g.definition })),
    ...situations.map((s) => ({ kind: "Situation", title: s.title, url: `/compare/situations/#${s.id}`, text: `${s.question} ${s.answer}` })),
    { kind: "Page", title: "Do you even need a sandbox?", url: "/do-you-need-a-sandbox/", text: "VPS, app platform, one-click hosting or sandbox, priced for the same machine" },
    { kind: "Page", title: "Cost calculator", url: "/costs/", text: "Price your own workload on every provider" },
    { kind: "Page", title: "Help me choose", url: "/choose/", text: "Four questions, then a short list of providers" },
  ].map((i) => ({ ...i, text: i.text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*|\[\[|\]\]/g, "") }));
  return new Response(JSON.stringify(items), { headers: { "content-type": "application/json" } });
}

# Bot Perch site

A static Astro site with no backend or client UI framework. It currently renders 16 researched
providers, 16 features, 78 capabilities and 10 use-case guides, plus search, glossary, recommendations,
comparison and a shared build/browser cost calculator. Data files, not this count, are authoritative.

The `research/` and `site/` folders sit at the repo root. Read [the root guidance](../AGENTS.md)
and [repository overview](../README.md) for evidence, research routing and publishing rules.

## Run it

```bash
cd site
npm ci
npm run build          # writes dist/
npm run preview        # serves the last dist/ build on loopback port 4321
npm test               # checks the cost engine against the hand-worked reference workloads
npm run check-rates    # lists provider pricing pages whose figures changed (see ../PRICE-CHECK.md)
```

`npm run dev` serves development mode. In an orb, run preview as a supervised service so it survives
pause/resume. From the repository root at the standard orb checkout path:

```bash
amp orb service start sandbox-guide \
  --command 'npm --prefix /home/user/workspace/repo/site run preview' \
  --portal --title 'Bot Perch'
```

Adjust the absolute checkout path outside this orb. Share the returned portal URL, not a localhost
or direct sandbox-host URL. Rebuild after changing data; preview serves `dist/` from disk.

## Structure

Paths in this table are relative to `site/`:

| Path | Responsibility |
|---|---|
| `src/data/providers/<id>.json` | Provider profile, status, checked date, sources and hand-worked costs. |
| `src/data/pricing/<id>.json` | Executable rate card for the calculator and rendered cost tables. |
| `src/data/features/<id>.json`, `groups.json` | Feature explanations/scenarios, provider rows and seven groups. |
| `src/data/capabilities.json` | 78 specific capability definitions and per-provider verdicts, catches and evidence. |
| `src/data/usecases.json`, `situations.json` | Ten setup guides and eight situation-based recommendations. |
| `src/data/docs.json`, `changes.json` | Published provider doc links and dated sourced changes. |
| `src/data/site.json`, `glossary.json`, `models.json` | Site metadata, jargon definitions and committed model prices. |
| `src/data/schema.ts` | Content types; pricing/workload types live in `lib/cost.ts`. |
| `src/lib/data.ts`, `plain.ts` | Data loading/sorting/checks, date semantics and provider/feature Markdown normalization. |
| `src/lib/cost.ts`, `cost.test.ts` | Shared engine/presets and independent arithmetic regression fixtures. |
| `src/layouts/Base.astro`, `components/`, `pages/` | Page shell, reusable UI, static routes and client interactions. |
| `src/styles/tokens.css`, `theme.css` | Design tokens and shared stylesheet. |
| `scripts/check-rates.mjs`, `price-baseline.json` | Price-source currency detector and generated baseline. |
| `scripts/fetch-model-prices.mjs` | Optional TokenWatch refresh into `src/data/models.json`. |

## Adding or rechecking a provider

Use the repo skill [maintaining-providers](../.agents/skills/maintaining-providers/SKILL.md), in
**add** or **recheck** mode. Its [file and verification checklist](../.agents/skills/maintaining-providers/reference/provider-checklist.md)
replaces the old short add-provider procedure: a complete listing needs all feature and capability
rows, research, pricing, docs, use-case review, recommendations, changes, baseline and A/B/C tests,
not just a profile and build. Recheck uses the same checklist with the existing ID.

`npm run build` invokes `validateContent()` but does not verify source quotations, all schema fields
or arithmetic. Run the skill's coverage audit and `npm test` as well. Render and inspect affected
provider/comparison/capability/cost/use-case states for site content changes, including narrow mobile.

## Adding a feature

1. Add a JSON file in `src/data/features/` with `id`, `group`, `order`, `title`, `navTitle`,
   `standfirst`, `idea` paragraphs, `splits`, `watchFor`, `figureLabel`, a `scenario`
   (`title`, `setup`, three or so `beats`, `turn`), three to five `questions`, and one row per
   provider with `figure`, `scenario`, `note` and `source`.
2. A split can carry an optional `quote` with `text`, `cite`, `url` and `tag`; the quote renders
   beside the claim.
3. Rebuild. Feature pages, the home page, the features index and the side-by-side table all pick it
   up from the data. The table column header comes from `figureLabel`, so a new feature does not
   need a layout change.

## Design layer

The look follows WyrdWerk/resource-library: a light page by default with a dark theme (the header
button stores the choice in `localStorage`), Georgia headings, system sans for reading, monospace
for small labels and figures, one mint accent, and hairlines instead of boxes. All fonts are system
fonts. Keep visual rules in `tokens.css` and `theme.css` in `src/styles/`. Components
use the documented classes (`badge`, `quote`, `split`, `watch`, `compare`, `compare-columns`,
`picks`, `answers`, `states`) and a small set of additions at the end of `theme.css` for cost cards,
data tables and the compare picker.

## Content rules

- A claim needs a source URL, an exact quote and one of the five confidence tags.
- Unpublished facts are written as “not published”, never estimated.
- `partly` needs a plain-language shortfall; keep plan, preview, region and size restrictions visible.
- Contradictions between a provider's own pages are shown as contradictions, with both sides.
- A cost example shows its arithmetic, names any substituted size, and is labelled an illustration.
- Rendered costs use the engine, not just provider `cost` prose. Derive A/B/C expectations by hand;
  use the engine's 730-hour month, including C's 640 stopped hours. Keep unknown charges explicit.
- Data files keep the provider's original wording, including Markdown emphasis. `src/lib/data.ts`
  strips it for provider/feature content. Use-case and capability text retains links/emphasis through
  `Inline.astro`; wiki targets must resolve.
- Use Composio-first research and fresh price sources per `../AGENTS.md`. battleships.dev is built
  by the Boat team and is only a disclosed cross-check, not sole evidence.

Weekly price checks follow [PRICE-CHECK.md](../PRICE-CHECK.md); they do not replace full-provider
rechecks. Their Amp host starts fresh threads Monday at 10:00 Asia/Kolkata. Ask the owner before
pushing to `main`: Cloudflare Pages deploys every push to the live site.

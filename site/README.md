# Sandbox guide site

A static Astro site. No backend, no framework components, one stylesheet and one small script for
the side-by-side compare picker.

The `research/` and `site/` folders sit at the repo root.

## Run it

```bash
cd site
npm ci
npm run build          # writes dist/
npm run preview        # serves dist/ at http://127.0.0.1:4321
```

In an orb, run it as a supervised service so it survives pause/resume:

```bash
amp orb service start sandbox-guide \
  --command 'npx astro preview --host 127.0.0.1 --port 4321' \
  --cwd site \
  --portal --title 'Sandbox guide'
```

Rebuild after changing data; the static server serves `dist/` from disk.

## Structure

```
src/
  data/
    providers/<id>.json     one file per provider
    features/<id>.json      one file per feature page
    groups.json             the seven feature groups, in order
    situations.json         the eight jobs on the home page and compare/situations
    changes.json            the dated changes on /changes/, newest first
    pricing/<id>.json       one rate card per provider for the cost calculator
    usecases.json           the use-case guides; text may carry [links](url) and **bold**
    docs.json               per provider, the doc page for each feature (from research/rates)
    site.json               site title, check date, confidence tags, limits
    schema.ts               TypeScript types for all of the above
  lib/data.ts               loads the JSON, sorts it, validates it at build time
  lib/plain.ts              strips Markdown emphasis from provider text once at load
  lib/cost.ts               the pricing engine and calculator presets, shared by build and browser
  layouts/Base.astro        page shell: skip link, header, nav, footer
  components/               badge, quote, page header, section nav, split, watch, compare table, cost card
  pages/                    home, use cases, features, compare, costs, providers, changes, how-we-checked
  styles/tokens.css         design tokens: dark and light palettes, type, space
  styles/theme.css          the single stylesheet; imports tokens.css
```

## Adding a provider

1. Copy a provider file in `src/data/providers/` and change `id`, `name` and `url`.
2. Fill the fields, including `company.facts` (section 17 of the profile) and the `fits.well` /
   `fits.badly` pair. If research is unfinished, set `"status": "pending"` and leave the optional
   fields out; comparisons show it as pending and render no claims.
3. Add a row for the provider to every file in `src/data/features/`, with a `figure` (the number
   that decides the row, or “Not published”) and a one-line `scenario`. The build fails, naming the
   feature, if a provider has no row, no figure or no scenario.
4. Add a rate card in `src/data/pricing/` (the build fails without one) and its doc links to
   `docs.json`. Add it to `situations.json` and the `routes` of each use case where relevant, to `changes.json` for dated changes, and to
   `compare/side-by-side.astro`'s `kinds` map.
5. `npm run build`.

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
- Contradictions between a provider's own pages are shown as contradictions, with both sides.
- A cost example shows its arithmetic, names any substituted size, and is labelled an illustration.
- Data files keep the provider's original wording, including Markdown emphasis. `src/lib/data.ts`
  strips it once at load, so pages never show literal backticks or asterisks.

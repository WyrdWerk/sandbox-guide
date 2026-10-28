# Sandbox guide site

A static Astro site. No backend, no framework components, one stylesheet and one small script for
the side-by-side compare picker.

In the public repository (github.com/WyrdWerk/sandbox-guide) the `research/` and `site/` folders sit
at the repo root; the paths below are the workspace layout, the same tree one level down.

## Run it

```bash
cd experiments/sandbox-comparison/site
npm install
npm run build          # writes dist/
npm run preview        # serves dist/ at http://127.0.0.1:4321
```

In an orb, run it as a supervised service so it survives pause/resume:

```bash
amp orb service start sandbox-comparison \
  --command 'python3 -m http.server "$PORT" --bind 127.0.0.1 --directory dist' \
  --cwd experiments/sandbox-comparison/site \
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
    situations.json         the four jobs on the home page and compare/situations
    site.json               site title, check date, confidence tags, limits
    schema.ts               TypeScript types for all of the above
  lib/data.ts               loads the JSON, sorts it, validates it at build time
  lib/plain.ts              strips Markdown emphasis from provider text once at load
  layouts/Base.astro        page shell: skip link, header, nav, footer
  components/               badge, quote, page header, section nav, split, watch, compare table, cost card
  pages/                    home, features, compare, providers, how-we-checked
  styles/tokens.css         fonts and design tokens (direction C)
  styles/theme.css          the single stylesheet; imports tokens.css
public/
  fonts/                    Manrope, Geist and IBM Plex Mono, self-hosted
  fonts-OFL.md              licence notices
```

## Adding a provider

1. Copy a provider file in `src/data/providers/` and change `id`, `name` and `url`.
2. Fill the fields. If research is unfinished, set `"status": "pending"` and leave the optional
   fields out; comparisons show it as pending and render no claims.
3. Add a row for the provider to every file in `src/data/features/` — the build fails, naming the
   feature, if a provider has no row.
4. Add it to `situations.json` where relevant, and to `compare/side-by-side.astro`'s `kinds` map.
5. `npm run build`.

## Adding a feature

1. Add a JSON file in `src/data/features/` with `id`, `group`, `order`, `title`, `navTitle`,
   `standfirst`, `idea` paragraphs, `splits`, `watchFor` and one row per provider.
2. A split can carry an optional `quote` with `text`, `cite`, `url` and `tag`; the quote renders
   beside the claim.
3. Rebuild. Feature pages, the home page, the features index and the side-by-side table all pick it
   up from the data.

## Design layer

The design studio supplied direction C: `tokens.css` and `theme.css` in `src/styles/`, plus
`DESIGN.md` in the workspace for component patterns. Keep visual rules in those two files. Components
use the documented classes (`badge`, `quote`, `split`, `watch`, `compare`, `compare-columns`,
`picks`, `answers`, `states`) and a small set of additions at the end of `theme.css` for cost cards,
data tables and the compare picker.

IBM Plex Mono ships in Regular only. Do not set a heavier weight on mono text; use size and colour.

## Content rules

- A claim needs a source URL, an exact quote and one of the five confidence tags.
- Unpublished facts are written as “not published”, never estimated.
- Contradictions between a provider's own pages are shown as contradictions, with both sides.
- A cost example shows its arithmetic, names any substituted size, and is labelled an illustration.
- Data files keep the provider's original wording, including Markdown emphasis. `src/lib/data.ts`
  strips it once at load, so pages never show literal backticks or asterisks.

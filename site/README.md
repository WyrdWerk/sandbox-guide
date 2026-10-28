# Sandbox comparison site

A static Astro site that explains cloud sandbox providers for AI agents to non-engineers. No
backend, no client-side JavaScript, no framework components: HTML and one stylesheet.

In the public repository (github.com/WyrdWerk/sandbox-guide) the `research/` and `site/` folders sit
at the repo root; the paths below are the workspace layout, which is the same tree one level down.

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
  --portal --title 'Sandbox comparison'
```

Rebuild after changing data (`npm run build`); the static server serves `dist/` from disk.

## Structure

```
src/
  data/
    providers/<id>.json     one file per provider
    features/<id>.json      one file per feature page
    terminology/<term>.json one file per "same word" entry
    glossary.json           glossary entries
    use-cases.json          the four situations
    site.json               site title, check date, confidence tags, limits
    schema.ts               TypeScript types for all of the above
  lib/data.ts               loads the JSON, sorts it, validates it at build time
  layouts/Base.astro        the page shell: header, nav, footer
  components/               comparison table, verdict label, source line, cost case, picks
  pages/                    one route per page; [id].astro generates provider and feature pages
  styles/theme.css          the entire visual layer
```

## Adding a provider

1. Copy an existing file in `src/data/providers/` and change the `id`, `name` and `url`.
2. Fill in the fields. If the research is not finished, set `"status": "pending"` and leave the
   optional fields out; every comparison table will show that provider as “research pending” and
   no claims will be rendered.
3. Add a row for the new provider to each file in `src/data/features/` — the build fails, naming
   the feature, if a provider has no row.
4. Add the provider's id to the relevant `picks` in features and use cases, and to
   `terminology/*.json` if it has something distinctive to say about a word.
5. `npm run build`. The build validates ids, verdicts and coverage, so a typo fails loudly.

## Changing the design

Everything visual is in `src/styles/theme.css`, driven by the custom properties at the top. The
markup only uses semantic class names (`.card`, `.callout`, `.verdict`, `.picks`, `.arithmetic-table`
and so on). Replace that file, or the variables in it, without touching content or pages.

## Content rules

- A claim needs a source URL, an exact quote and one of the five confidence tags.
- Unpublished facts are written as “not published”, never estimated.
- Contradictions between a provider's own pages are shown as contradictions, with both sides.
- A cost example shows its arithmetic, names any substituted size, and flags figures that still
  need checking.
- Data files keep the provider's original wording, including Markdown emphasis. `src/lib/data.ts`
  strips it once at load, so pages never show literal backticks or asterisks.

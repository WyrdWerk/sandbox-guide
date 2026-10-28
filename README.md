# Sandbox comparison

A static site that helps non-technical people understand cloud sandbox providers for AI agents. It
explains behaviour rather than ranking prices: sixteen features, twelve providers, and a separate
compare section.

- **Research:** `research/*.md` — one evidence-backed profile per provider, each claim with a URL,
  an exact quote and a confidence tag, plus worked cost examples and a usability section.
- **Site:** `site/` — an Astro site with one page per feature, a compare section, provider pages and
  a method page. See `site/README.md` for structure and how to add a provider or feature.

## Providers covered

Agent 37, Blaxel, Boat, boxd, E2B, InstaBox, Lizard, Morph, Runtime, Sandboxer, Sprites and Vercel
Sandbox. All twelve were researched on 2026-10-28. The site supports a `"status": "pending"`
provider so a thirteenth can be added as data before its profile is finished.

## Feature groups

The machine (isolation; sizes and regions), state and storage (lifecycle; snapshots and forks;
storage), staying on (idle timers and waking), access and network (reaching it; custom domains;
outbound network; keys and secrets), running it (ways to drive it; built-in agents; teams and
accounts), money (billing models; trials and free tiers), and the company.

## Three shared workloads

Every cost example prices the same three cases:

- **A** — 1,000 agent tasks a month, ten minutes each, 2 vCPU / 4 GiB, deleted after each.
- **B** — one always-on 4 vCPU / 8 GiB / 50 GiB box, 730 hours a month.
- **C** — one 2 vCPU / 4 GiB / 20 GiB box, three hours a day for 30 days, stopped otherwise.

Where a provider does not sell the exact shape, the site names the nearest shapes it used. The
reference-costs page labels all of them as list-price illustrations and links to battleships.dev for
pricing your own workload.

## Known open questions

- Sandboxer's sizes and prices match Boat's exactly while disk sizes, regions, stopped-disk
  retention and legal entity differ. No public source explains the relationship.
- Several unpublished prices: egress at Agent 37 and boxd; snapshot storage at Lizard;
  backup storage at boxd.
- Contradictions inside providers' own material, listed per provider on the provider pages.
- Thin research on company details for Morph, and on regions and GPU availability for Morph and
  Sprites; those rows say “not published” rather than guessing.

## Run

```bash
cd site && npm install && npm run build && npm run preview
```

Checked on 2026-10-28. Documentation research only: no account was created and no sandbox was
started or billed.

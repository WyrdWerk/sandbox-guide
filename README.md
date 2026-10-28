# Sandbox comparison

A first working version of a website that helps non-technical people understand and compare cloud
sandbox providers for AI agents. It is static, has no backend, and is built to be iterated on.

- **Research:** `research/*.md` — one evidence-backed profile per provider, each claim with a URL,
  an exact quote and a confidence tag, plus worked cost examples and a usability section.
- **Site:** `site/` — an Astro site that renders the research as feature pages, use cases, a
  vocabulary page, provider pages and a pricing page. See `site/README.md` for structure and how to
  add a provider.

## Providers covered

Agent 37, Boat, boxd, InstaBox, Lizard, Runtime, Sandboxer. All seven were researched on
2026-10-28. The site supports a `"status": "pending"` provider so an eighth can be added as data
before its profile is finished.

## Three shared workloads

Every cost example prices the same three cases:

- **A** — 1,000 agent tasks a month, ten minutes each, 2 vCPU / 4 GiB, deleted after each.
- **B** — one always-on 4 vCPU / 8 GiB / 50 GiB box, 730 hours a month.
- **C** — one 2 vCPU / 4 GiB / 20 GiB box, three hours a day for 30 days, stopped otherwise.

Where a provider does not sell the exact shape, the site names the nearest shapes it used.

## Known open questions

These are shown on the site as open questions, not resolved:

- Sandboxer's sizes and prices match Boat's exactly while disk sizes, regions, stopped-disk
  retention and legal entity differ. No public source explains the relationship.
- boxd bills RAM the machine actually holds, so its examples show both ends: the always-on box is
  $222.50 at 8 GiB resident and $304.26 at the full 16 GiB.
- Several unpublished prices: egress at Agent 37, boxd and Boat; snapshot storage at Lizard;
  backup storage at boxd.
- Contradictions inside providers' own material, listed per provider on the provider pages.

## Run

```bash
cd site && npm install && npm run build && npm run preview
```

Checked on 2026-10-28. Documentation research only: no account was created and no sandbox was
started or billed.

# Botperch

A plain-language guide to cloud sandboxes for AI agents. It helps people choose a provider for a job, understand the catches, and estimate machine and model costs separately.

**Live site: https://botperch.com (also https://sandbox-guide.pages.dev). A push to `main` deploys it through Cloudflare Pages. Ask the owner before pushing to `main`.** Passing local checks is not permission to publish.

## What is covered

The current data contains **18 researched providers (16 sandboxes and 2 VPS providers), 16 feature pages, 78 capabilities compared across all 18 providers (1,404 rows), and 10 use-case guides**. The JSON is the source of truth for counts and research status; not every claim shares one checked date.

Providers: Agent 37, Blaxel, Boat, boxd, Cloudflare Sandbox, Daytona, E2B, InstaBox, Lizard, Modal, Morph, Runtime, Sandboxer, Sprites, **Tensorlake** and Vercel Sandbox. All currently have `"status": "researched"`; none is pending. The schema supports `pending` for unfinished drafts, not as a substitute for a complete listing.

Use cases: Hermes, OpenClaw, a coding agent, a code interpreter, a browser/computer-use agent, n8n, a Discord/Slack bot, Claude Code for a team, scheduled scraping, and a remote MCP server. The site also has situation-based recommendations, side-by-side comparison, capability filters, search, a glossary and a cost calculator.

## Repository and data model

| Path | Responsibility |
|---|---|
| `research/*.md` | Dated evidence, quotes, confidence tags, usability, worked costs, contradictions and unanswered questions. Runtime's historical profile is `withruntime.md`. |
| `research/rates/*.json` | Detailed rate/plan research, original units, doc links and setup findings. These are not executable calculator cards; Tensorlake's original rate notes are in its profile. |
| `research/usecases*.md` / `.json`, `research/capabilities-NOTES-*.md` | Original research batches. Later merged data and corrections can supersede their conclusions. |
| `site/src/data/providers/<id>.json` | Provider identity, researched/pending status, profile, billing, company facts, usability, fits, caveats, sources and hand-worked A/B/C. |
| `site/src/data/pricing/<id>.json` | Executable hourly rate card, plans, allowances, fixed shapes, storage and feasibility limits. |
| `site/src/data/features/*.json` | Feature explanations and worked scenarios, with one provider row per feature. |
| `site/src/data/capabilities.json` | Specific capability definitions and one sourced verdict per provider per capability. `partly` requires a written shortfall. |
| `site/src/data/docs.json` | Provider → feature → `{title, url}` documentation links, where published. |
| `site/src/data/usecases.json`, `situations.json`, `changes.json` | Setup routes/recommendations, situation picks, and dated sourced changes. |
| `site/src/data/schema.ts` | Content types; `RateCard` and workload types instead live in `site/src/lib/cost.ts`. |
| `site/src/lib/data.ts` | Loads and cross-checks content, computes checked dates and engine-backed cost cards. |
| `site/src/lib/cost.ts`, `cost.test.ts` | Shared build/browser calculator and independently hand-worked regression expectations. |
| `site/src/data/models.json` | Committed TokenWatch model-price snapshot; optional refresh via `site/scripts/fetch-model-prices.mjs`. The site build needs no price-service request. |
| `site/src/pages/`, `components/`, `styles/` | Static Astro routes, reusable presentation, client interactions and styles. See [site development notes](site/README.md). |
| `site/scripts/check-rates.mjs`, `price-baseline.json` | Currency-figure change detector and its generated baseline. |
| `.agents/skills/maintaining-providers/` | Add-provider and full-recheck workflow, file checklist, evidence rules, research fan-out and verification. |
| `.github/ISSUE_TEMPLATE/provider-listing.yml` | Provider-submitted listing requests. Public links and contact only, no secrets. |

## Add or recheck a provider

Ask an agent to **“add a provider” with its name and official docs link**, or **“recheck provider-id end to end.”** Load the repo skill [`maintaining-providers`](.agents/skills/maintaining-providers/SKILL.md). It covers the profile, rate card, all features and capabilities, docs, use cases, recommendations, changes, price baseline, research and tests. The [detailed checklist](.agents/skills/maintaining-providers/reference/provider-checklist.md) includes a read-only coverage audit and links to the threads/commits that produced the original work.

A full recheck revisits all claims and routes, including unknowns and contradictions. A weekly price check is narrower. Neither a successful build nor unchanged currency figures proves that documentation or recommendations are still correct.

Research fan-out uses the exact mode key `zro-deepseek`, resolved through `list_agent_modes`, on `a1.tiny` orbs (`a1.small` only when a browser is needed, never larger without approval). Workers return evidence artifacts; the primary agent reconciles and integrates them. Keep work in one thread when requested or when coordination would add more work than it saves.

## Evidence and cost rules

- Claims need an official URL, an exact quote checked against the live page, a confidence tag and a research date. Tags are `docs-confirmed`, `pricing-page`, `third-party`, `inferred`, and `not-published`. Outside company reports must be tagged third-party.
- `partly` means a buyer-relevant catch, with a short written explanation. Preview, expensive-plan/support gates, restricted sizes/regions and best-effort preservation must stay visible. Silence is `not-published`, not an unsupported `no` or an invented number.
- Keep conflicting provider statements together, with both sources. Do not turn a desk-research claim into something “we tested.” No provider account or billable sandbox is required for this workflow.
- Start external web research with connected **Composio** tools: Parallel for broad synthesis, Exa for semantic search/known URLs, Tavily for ordinary search, Firecrawl for rendered pages. Use Amp native web tools only when the relevant Composio route is unavailable or fails to provide usable evidence. Record fallbacks; never claim a failed call succeeded.
- **Cached scrapes are not safe for price checks.** Check retrieval/cache metadata and independently fetch the live page when needed. HTTP 200 or a quote match does not prove freshness or that the quote supports the claim.
- **battleships.dev is built by the Boat team.** Disclose that when citing it; use it as a cross-check/workload reference, never the sole source of a rate or verdict.
- Keep unknown prices explicit. Do not omit an unpublished charge as though it were free, equate GB with GiB, or confuse a managed-agent plan with a sandbox machine.

The calculator and rendered reference costs share `site/src/lib/cost.ts`. Provider JSON retains independent hand-worked examples, but changing those alone does not change the displayed price. Current A/B/C inputs are:

| Case | Machine and usage | CPU busy share |
|---|---|---:|
| A | 1,000 ten-minute tasks; 2 vCPU / 4 GiB / 10 GiB; delete each run; 166⅔ running hours | 50% |
| B | One uninterrupted 4 vCPU / 8 GiB / 50 GiB machine; 730 hours; keep files | 10% |
| C | One 2 vCPU / 4 GiB / 20 GiB machine; 3 hours × 30 days = 90 running hours; 640 stopped hours with files kept | 10% |

Use the engine's 730-hour month consistently. Name substituted sizes, plan/session restrictions, excluded fees and modeling assumptions. Separate consumed usage from pack purchases, recurring allowances from signup credit, and machine cost from model spend. Derive test totals by hand from provider sources, never from engine output.

## Run and verify

Use a Node version supporting the package's direct TypeScript tests and Astro requirements (the current orb uses Node 26). From the repository root:

```sh
cd site
npm ci
npm run build          # static output in dist/, including build-time content checks
npm test               # independent cost regression tests
npm run check-rates    # read-only pricing-source change detector
```

`npm run dev` serves development mode; `npm run preview` serves the last build. In an orb, use a supervised service and its portal as described in [site/README.md](site/README.md). Rebuild after edits when using preview. Data/UI changes also need inspection of rendered affected states; build/test success does not establish visual correctness or source accuracy.

## Weekly price check and publishing

Follow [PRICE-CHECK.md](PRICE-CHECK.md). An Amp schedule on the [weekly price-check host](https://ampcode.com/threads/T-01a188c3-12dd-70d1-ab4e-74707313d877) starts a **fresh thread every Monday at 10:00 Asia/Kolkata**. The schedule lives in Amp, not in GitHub Actions or this repository. This documentation does not create or change it.

The checker compares money tokens, not pricing meaning. Inspect `CHANGED`, `NEW`, `FAILED`, `NO PRICES` and `OLD`; re-read stale cards and all unreadable sources. Refresh the generated baseline only after reviewing the live evidence, then inspect its diff. A successful exit alone is insufficient.

Each weekly run follows the existing one-branch/PR procedure (`prices/YYYY-MM-DD`); a person reviews and merges. That price-check workflow does not authorize other agents to push `main` or merge PRs. **Merging/pushing to `main` publishes the site.** State what is local, committed, pushed or deployed, and finish reports with a plain-language bottom line and unresolved questions.

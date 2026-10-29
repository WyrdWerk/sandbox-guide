---
name: maintaining-providers
description: Adds cloud sandbox providers or rechecks an existing provider end to end in sandbox-guide, from live evidence through pricing, capabilities, use cases and publication checks. Use for add a provider, list a provider, refresh provider research, or audit a provider for stale information.
argument-hint: "add <provider name> <docs URL> | recheck <provider-id>"
---

# Maintaining providers

Turn a documentation link into a complete, evidence-backed provider listing, or recheck an existing listing without leaving old claims behind.

## Modes and boundaries

- **Add:** choose one stable lowercase, hyphenated ID; research and integrate every surface below. A name and official documentation URL are enough to begin. Discover missing pricing, legal and product links yourself; use the issue template's questions as the intake checklist.
- **Recheck:** keep the existing ID and audit the same complete checklist, not only prices. Compare old and new claims, quotes, rates, restrictions, routes and recommendations. A confirmation with no change is still a research result; log its date, pages and unresolved questions in the provider's research notes.
- A weekly **price-only** check follows `PRICE-CHECK.md`. It is not a full-provider recheck.
- Research is read-only desk work unless the owner authorizes account creation, credentials, sandbox usage and a spending cap. Documentation claims are not measured behavior.
- Local integration is allowed when asked to add/update a provider. Never push, open a PR or publish without the applicable authorization. A push to `main` deploys the live Cloudflare Pages site. Research workers never publish.

Read root `AGENTS.md`, `README.md`, `PRICE-CHECK.md`, and [the file and verification checklist](reference/provider-checklist.md). The current JSON and source code override historical notes. At this skill's introduction there are 16 researched providers, 16 features, 78 capabilities and 10 use cases; derive the inventory afresh rather than freezing these counts into code.

## 1. Establish the starting point

1. Inspect `git status --short`, the current branch and HEAD. Preserve unrelated changes and staged work. Record the revision and target provider in the research notes.
2. Read `site/src/data/schema.ts`, `site/src/lib/data.ts`, `site/src/lib/cost.ts`, `site/src/lib/cost.test.ts`, the target's existing files, and a comparable provider. Separate the research-rate format from the executable `RateCard` format.
3. Enumerate every feature and capability ID and all use cases. Use their actual definitions, not their titles alone. Read the relevant `research/capabilities-NOTES-*.md`, but do not import unresolved shard decisions over later merged data.
4. For an unfamiliar pattern, inspect the producing commits and their `Amp-Thread-ID` threads. The reference lists the original work and later corrections. Establish how the evidence was collected, not just how the JSON looks.

## 2. Research the whole provider

Start with official docs, `llms.txt`/sitemaps, pricing, limits, quickstart, API/OpenAPI, changelog, terms and trust pages. Documentation indexes often omit billing, account and security pages. Inspect the provider's product names: managed agents, application hosting, functions, Workers, sandboxes and BYOC can have different prices and behavior.

Cover all these areas, including explicit unknowns:

- Isolation, root, Docker, custom images, nested virtualization, GPUs, independent CPU/RAM sizing, resize, resource maxima, region choice and EU residency.
- Stop, pause, RAM/process survival, idle behavior, wake triggers, hard session limits, retention/deletion deadlines, snapshots, forks, templates, pools, backups, separate/shared volumes and external mounts.
- Public/private URLs, standard SSH versus provider-only terminal, browser terminal, local tunnels, raw TCP, domains/certificates, egress, fixed outgoing IP, allowlists and no-internet mode.
- Saved versus passed versus hidden credentials; scoped API keys; dashboard creation; CLI/SDK/API/MCP; PTY/file APIs; preinstalled agents, prompt API, browser/desktop and hosted-agent backends.
- Team roles, SSO, hard spend controls versus alerts, audit logs; entity, history, funding/headcount, status, SLA, SOC 2 scope/report, DPA and self-hosting/licensing. Use third-party company facts only with that tag.
- Every plan's fees, recurring allowances, signup credits, pack/minimum purchase, concurrency, session/size limits, CPU meter/floor, RAM meter, rounding/minimum durations, running/stopped storage, snapshots/backups, retention, egress, IP and seat charges. An omitted price is not zero.
- Setup routes for **all current use cases**, with nontechnical-reader consequences and links. Check recommendations and situation picks as well as route tables.

### Web routing and freshness

Discover the connected **Composio** tools and confirm the relevant connection is active before using them. Do not create/reconnect integrations without permission. Prefer Parallel for broad research/synthesis, Exa for semantic search and known-URL extraction, Tavily for ordinary search, and Firecrawl for rendered/JavaScript pages. Discover live schemas; do not invent parameters or nested response paths.

Use Amp native `web_search`/`read_web_page` only if the relevant Composio route is unavailable, errors or yields unusable/insufficient content. A direct fetch of official Markdown/HTML or browser read can resolve source failures; record the fallback and why. Report only tools that actually succeeded.

For prices and performance numbers, **cached scrapes are not safe**. Inspect acquisition/cache metadata and request a fresh fetch using the tool's documented options. Cross-check against a newly fetched official page or rendered browser when freshness is uncertain. A new tool call, HTTP 200, long response or `llms.txt` fallback is not proof of current page content. Check status, redirects, page identity and surrounding context. Never reuse a previous session's quote cache as a live recheck.

### Evidence rules

- Each factual claim needs a source URL, an exact contiguous copied quote, a confidence tag and a checked date in the research record. Keep claim-level evidence in `research/<id>.md` (or the existing claim ledger); fields that accept only links still need evidence there. Do not add untyped keys everywhere to hold citations.
- Tags: `docs-confirmed` for first-party documentation; `pricing-page` for money-specific pages; `third-party` for outside reports; `inferred` for a conclusion derived from named evidence; `not-published` for an unanswered question after searching.
- Re-fetch the cited URL and machine-check quote presence. You may normalize whitespace/Markdown markup for the check; state exactly what was normalized. Keep the saved quote verbatim, including numbers and qualifiers. Do not synthesize a quote, insert ellipses that change it, or quote one page while linking another.
- Also read context and test whether the quote proves the claim. A heading, navigation link or `$0` does not prove non-support, a free tier or no-card access. Normalized substring matching does not establish meaning, freshness or real-world behavior.
- `yes` means the capability as defined is supported. `partly` means a buyer-relevant shortfall, such as preview, support/Enterprise gating, size/region restrictions, best-effort behavior or a partial substitute. Write **one plain-language shortfall sentence**. Feature rows lack a `shortfall` field, so put their limitation in `note` and `scenario`.
- `no` needs an explicit negative, or a justified inference from the authoritative page/API where support would be documented, tagged `inferred`. Mere silence becomes `not-published`, not `no`. Quote the inspected page and record the unanswered question; don't pretend it proves an absence.
- Keep conflicting first-party statements together, with both URLs/quotes, the chosen interpretation and its consequence. Do not silently pick the cheaper figure. A newly discovered fact is not necessarily a newly launched feature.
- **battleships.dev is built by the Boat team.** Say so wherever citing it. Use it only as a cross-check/workload reference, never sole evidence for rates or verdicts. Do not copy its engine or unverified booleans.
- Preserve units and scope: GB is not GiB, cores need not equal vCPUs, EU locations are not guaranteed EU residency, and an open SDK is not a self-hostable service. `open-source` currently means open source **or self-hostable**; say which applies without inventing a licence.

## 3. Optional research fan-out

Do the work in the primary thread when small or sequential, or when the owner says not to create threads. Otherwise research can be split into non-overlapping packages; the primary agent owns integration and final verification.

Before dispatch, resolve **`zro-deepseek`** with `list_agent_modes` and state the exact key. Use `agent_mode: "zro-deepseek"` and `orb_size: "a1.tiny"`; use `a1.small` only for a package needing a browser. Never request larger without approval. Verify returned mode metadata; stop and diagnose mismatches rather than substituting a model. A delegated thread that cannot create persistent threads asks its parent/Puck, with the resolved key and explicit orb size.

The original partition, reusable for one provider, is:

| Package | Features | Current capability count |
|---|---|---:|
| Machine and money | isolation, sizes-regions, billing-models, trials-free-tiers | 19 |
| State and staying on | lifecycle, snapshots-forks, storage, idle-timers | 18 |
| Access | reaching-it, custom-domains, outbound-network, keys-secrets | 15 |
| Running and company | ways-to-drive, built-in-agents, teams-accounts, company | 26 |

Optionally assign rates, A/B/C and all setup routes to a separate package with clear ownership; avoid having everyone research the same pricing pages. Derive capability assignments from today's data, not just these historical counts.

Give each worker the repository/revision, target ID, official starting URL, exact assigned capability IDs, schema, evidence/verdict/freshness rules, relevant existing notes, and an output contract: JSON rows plus Markdown evidence, contradictions, unknowns, source dates and successful/failed retrieval methods. Ask for **research artifacts, not concurrent edits of shared JSON**. Workers do not create further threads, commit or push.

Use separate artifact paths. Choose one completion path: a reply to the primary's actual thread ID, or `wait_for_threads`, not both. Idle does not establish success. Use `download_thread_file`/`upload_thread_file` for artifacts; messages and commit IDs do not transfer local files. Separate orbs do not contain the primary's uncommitted work or local commits. Name the exact source revision and distinguish local `main` from `origin/main`.

Inspect returned evidence, fetch missing sources and resolve contradictory verdicts before merging. Re-download corrected files, recount, and keep the notes and rows in sync. Parent integration sometimes changed a shard's conclusions; old shard totals are not the site's source of truth.

## 4. Work A, B and C independently

Use `presets.a/b/c` in `cost.ts` as the input contract:

| Case | Shape | Time | CPU busy | Disk retention |
|---|---|---|---|---|
| A | 2 vCPU / 4 GiB / 10 GiB | 1,000 × 10 minutes = 166⅔ hours | 50% | Deleted each run |
| B | 4 vCPU / 8 GiB / 50 GiB | 730 hours, uninterrupted | 10% | Kept |
| C | 2 vCPU / 4 GiB / 20 GiB | 90 running + **640 stopped** hours | 10% | Kept between sessions |

The engine uses `MONTH_HOURS = 730`, including for C's storage. Older research sometimes used 720/630; don't mix conventions. `hoursPerDay: 24` means 730 hours in the engine, not 24 × 30. Read `hoursOf()` when handling sleep or multiple machines.

1. Copy published original units into the research ledger. Convert a **per-second rate to a per-hour rate** by ×3,600 (durations in seconds become hours by ÷3,600); show core/vCPU and GB/GiB conversions explicitly. Preserve currency and any exchange-rate assumption.
2. Hand-calculate each plan's CPU, RAM, running/stopped storage, allowances, fees, credits and pack rounding. Select a documented shape that fits CPU **and RAM and disk**; name any substitution. Check session/concurrency/retention limits before calling a price feasible.
3. Distinguish recurring free usage from one-off credits, consumed usage from the cash needed to buy packs, and metered machines from separate managed-agent products. Show model API/subscription spend separately, not inside sandbox cost.
4. Fill the provider's `cost.A/B/C` with arithmetic and caveats. Rendered cards use `engineCase()`/`price()`, not those hand-written totals; update the executable rate card too.
5. Extend the existing `handWorked` cases in `site/src/lib/cost.test.ts` for representable A/B/C expectations, derived from the pages **before** running the engine. For an infeasible case also verify `feasible`/its meaningful limit, not a misleading cheap total. Don't copy engine output into expected values. A real price correction needs independently redone arithmetic.
6. Compare the engine's plan, shape, feasibility, usage **and bill**, not just equal totals: an included-credit fee can hide wrong line items. Exercise the relevant boundary (credit threshold, CPU floor, disk-driven shape or session cap). Keep only tests for observable contract regressions; use temporary probes for the rest.

`RateCard` cannot represent every provider tariff. Per-plan rates, unique snapshot bytes, minimum intervals or unpublished fees may need explicit model limitations. Do not omit an unknown charge as if free, or put arbitrary `null` into numeric rate fields (`egress.perGiB` explicitly permits it). If honest pricing cannot be represented, report the blocker or make a scoped, tested engine change with an explicit unknown/infeasible result. Never force a passing illustration by inventing a rate.

## 5. Integrate, audit and report

Work through **every row of [the file checklist](reference/provider-checklist.md)**, including research, baseline, recommendations, static counts and date semantics. Rechecking is the same checklist with existing IDs; don't delete/recreate the provider or reset unrelated data. Preserve older evidence as dated history when useful, clearly superseded by the current result.

Run the reference's content audit, then `cd site && npm run build && npm test`. Inspect checker output, not just exit status. Re-run after the final edit. If site content/UI changes, render representative provider, comparison, capability, cost and relevant use-case states; inspect screenshots at desktop/mobile, and exercise changed interactions. Tests/build alone cannot validate research or visual presentation.

Report a plain-language **Bottom line**, checked sources/date and unknowns, material verdict/rate/route changes, A/B/C totals and model limitations, verification commands/results, files changed, and actual delivery state. Distinguish local edits, commit, push, PR, merge and deployment. Ask the owner before pushing to `main`; only claim deployment after an authorized push and successful Cloudflare result. Do not advance dates for sources you did not re-read.

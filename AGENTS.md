# Working on sandbox-guide

## Product and source of truth

This is a static Astro site in `site/`, explaining cloud sandbox providers to nontechnical readers. Preserve its plain-language, evidence-first comparisons and existing visual design. There is no application backend or client UI framework; TypeScript powers the calculator, comparison, search and other interactions.

At this guidance's introduction, the data contains **16 researched providers (Tensorlake included), 16 features, 78 capabilities with 1,248 provider rows, and 10 use cases**. Read `site/src/data/` for today's inventory. Historical research notes can be stale or superseded by integration commits; don't restore their old verdicts blindly.

## Start here

- Load `.agents/skills/maintaining-providers/SKILL.md` for **adding a provider or fully rechecking an existing provider**. Its reference is the complete file/verification checklist. A docs link is enough to start research; missing published facts remain unknown.
- Read `README.md`, `site/README.md`, `PRICE-CHECK.md`, relevant research and git history before changing content. For work modeled on earlier additions, read the producing commit's `Amp-Thread-ID` thread to recover its research/check method.
- Inspect the worktree first. Preserve changes you did not make; never use broad checkout/reset commands to clean up a temporary provider integration.
- `site/src/data/schema.ts` owns content types. `site/src/lib/cost.ts` owns `RateCard`, workloads and the shared build/browser price engine. `site/src/lib/data.ts` loads data and runs build-time content checks. The two rate formats (`research/rates` and `site/src/data/pricing`) are not interchangeable.

## Evidence and verdicts

- Every factual claim needs a URL, a verbatim quote checked against the live source, a confidence tag and a checked date in its evidence record. Tags: `docs-confirmed`, `pricing-page`, `third-party`, `inferred`, `not-published`. Match a quote mechanically, then read its context; normalized substring matching alone proves neither meaning nor freshness.
- Start external web research with connected Composio tools. Prefer Parallel for broad research/synthesis, Exa for semantic discovery/known URLs, Tavily for ordinary search and Firecrawl for rendered pages. Verify connections and live schemas. Amp native web tools are fallback only when the relevant Composio route is unavailable, fails or cannot provide usable evidence. Record failures/fallbacks honestly; don't reconnect integrations without permission.
- Cached scrapes are **not safe for price checks**. Inspect cache/acquisition metadata, request fresh retrieval where supported, and independently read the live official page/browser if necessary. Verify that HTTP 200 contains the requested page, not an agent-index or JavaScript fallback.
- `partly` requires a written, plain-language catch. For capability rows use `shortfall`; for feature rows explain it in `note`/`scenario`. Preview, support/expensive-plan gates, limited sizes/regions and best-effort behavior matter to a buyer.
- Unsupported `no` is not acceptable. Explicit negative documentation or a clearly tagged justified inference can support it; silence becomes `not-published`. Unpublished prices are not zero, free or unlimited.
- Preserve both sides of first-party contradictions and say which interpretation the model uses. Separate products, plan gates, lifecycle states, GB/GiB and physical cores/vCPUs. Do not invent a launch date for a newly found fact.
- **battleships.dev is built by the Boat team.** Disclose that wherever cited. It is a cross-check/workload reference, never the sole source of a rate or verdict.
- This is desk research unless separate hands-on work is authorized. Do not create provider accounts, use credentials or start billable sandboxes without authorization and a spending cap. Never describe documentation claims as measured results.

## Integration and arithmetic

- Provider work spans its profile and rate card, `docs.json`, every feature row, **all 78 current capability rows**, use-case routes/picks, situation picks, `changes.json`, price baseline, research notes and tests. Review `compare/side-by-side.astro`'s manual `kinds` map and static counts as well. The skill enumerates required edits versus legitimate no-change/unknown dispositions.
- Rendered costs use `engineCase()`/`price()`, not the hand-written provider `cost` totals. Keep both accurate. A/B/C are defined in `presets.a/b/c`: A is 166⅔ task-hours at 50% CPU busy; B is 730 uninterrupted hours at 10%; C is 90 running plus 640 stopped hours at 10%. Read the exact sizes/disk inputs before calculating.
- Compute expected totals independently from provider pages, including shapes, disk, allowances, fees, packs and feasibility. Extend `site/src/lib/cost.test.ts`, never copy engine output into expectations. A test failure is not permission to bless a new number without evidence.
- A missing numeric tariff must not silently become zero. Explain model limitations; `RateCard` permits `null` for unpublished egress but not arbitrary numeric fields.
- Advance `checkedOn` only for sources actually reread. Provider and rate dates are separate; site-wide price freshness uses the oldest rate card. Capability/use-case top-level dates describe whole datasets, not one newly checked provider.

## Research fan-out

Use a single thread when requested or when work is tightly sequential. When fan-out is appropriate, first resolve **`zro-deepseek`** with `list_agent_modes`; use that exact mode key and verify returned metadata. Research orbs use **`a1.tiny`**, or **`a1.small` only when a browser is needed**, never larger without owner approval.

Use disjoint research packages with exact capability IDs and artifact paths. Workers return sourced rows and notes rather than concurrently editing shared JSON; the primary reconciles and integrates. Workers do not create further persistent threads, commit or push. A delegated thread needing persistent workers must request them through its parent/Puck with the exact resolved mode key and explicit orb size. Transfer artifacts with thread file tools; messages do not transfer unpushed work. The skill records the original four capability groups and completion/transfer rules.

## Commands and completion

Run from `site/`:

```sh
npm ci                  # if dependencies need installing
npm run build           # static dist/ plus content checks
npm test                # cost-engine regression checks
npm run check-rates     # read-only currency-figure comparison; see PRICE-CHECK.md
```

Run build/tests after the final edit. The build is not a full schema/evidence audit; also use the skill's coverage checks. For UI/data presentation changes, render and inspect representative affected states, including mobile and changed interactions. Use supervised orb services/portal URLs per `site/README.md`; preview serves the last build. No visual check is needed for instructions-only edits that do not affect the site.

Weekly pricing follows `PRICE-CHECK.md`. The Amp schedule lives on [the weekly host](https://ampcode.com/threads/T-01a188c3-12dd-70d1-ab4e-74707313d877), starts a fresh thread every Monday at **10:00 Asia/Kolkata**, and uses the `prices/YYYY-MM-DD` PR workflow for human review. It is not a full-provider audit. Do not create/change schedules just because this document describes one. Read `NEW`/`OLD` and unreadable-page output even if the checker exits zero. Baseline updates must follow source review, never replace it.

**Ask the owner before pushing to `main`: every push deploys https://botperch.com (Pages project `sandbox-guide`) through Cloudflare Pages.** A request to prepare content is not permission to push, open/merge a PR or deploy. Existing weekly-run authorization is scoped to that workflow and never permits a main-branch push or merge. Report actual local/committed/pushed/deployed state, verification and limitations. Include a brief plain-language **Bottom line** in substantive final reports.

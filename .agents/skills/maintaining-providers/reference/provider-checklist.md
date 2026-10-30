# Provider integration and verification checklist

Paths are relative to the repository root. Read alongside `SKILL.md`; this checklist is identical for add and full recheck, except that add creates the missing provider-specific files.

## Files and contracts

| File | Add or recheck action |
|---|---|
| `research/<id>.md` | Keep a dated claim ledger: claim, URL, exact quote, confidence, retrieval date/method, interpretation and restrictions. Cover all feature/capability IDs and all use cases, including searched-but-unanswered questions. Include A/B/C arithmetic, dashboard/non-coder experience, company facts, contradictions and a before/after audit summary. Runtime's historical file is `research/withruntime.md`; keep its ID `runtime`. |
| `research/rates/<id>.json` | Preserve original rates/units, hourly conversions, plans, limits, storage/egress extras, feature doc links and deploy evidence. This is a research artifact, **not** the executable card. Follow a current neighbor's shape when adding one; Tensorlake historically has notes instead of a separate research-rate JSON, so record that mapping rather than pretending the file exists. |
| `research/usecases*.md` / `.json`, `research/capabilities-NOTES-*.md` | Read relevant historical evidence. Correct or explicitly supersede claims affected by this audit; don't present a dated old snapshot as newly verified. Put new provider evidence in its own ledger rather than regenerating every old research batch. |
| `site/src/data/providers/<id>.json` | Match `Provider`: identity/status/date, description/audience, isolation/sizes, billing, hand-worked `cost.A/B/C`, company facts/sources, fits well/badly, usability, strengths, caveats and source list. Keep contradictions' paired evidence. `pending` is a drafting state, not completion; do not use it to bypass honest research or pricing. |
| `site/src/data/pricing/<id>.json` | Match `RateCard` in `cost.ts` (VPS billing fields are listed in SKILL.md, VPS providers): hourly USD rates, active/allocated CPU and floor, RAM basis, fixed shapes or resource/MCU model, running/stopped disk, limits, plans/allowances/credits, `between`, optional `sleeps`, egress and sources. Record exclusions/model limitations. Rates and units come from evidence, not a neighboring provider. |
| `site/src/data/docs.json` | Map the provider ID to `{featureId: {title, url}}`. Review all 16 topics and link the best real page. Missing docs are allowed when nothing is published; record why in the research ledger. Do not fabricate a URL or copy another product's docs. |
| `site/src/data/features/*.json` | Exactly one row for the provider in every feature. Required `provider`, `verdict`, `figure`, `scenario`, `note`, plus evidence for factual claims. Use `Not published` for unknown figures. Write the provider's consequence in the feature's existing worked scenario. A broad feature row can summarize several capability catches; do not copy one component's verdict blindly. Review shared prose, splits, watch-outs and questions if findings contradict them. |
| `site/src/data/capabilities.json` | Preserve metadata/definitions; add or replace exactly one row per capability, currently 78. `CapabilityRow` requires provider, verdict and `Source`; optional figure (≤40 characters), shortfall and note. Every `partly` needs a plain-language shortfall. No `pending` verdict here. Unknowns need rows too. Never leave a capability's rows empty to bypass validation. |
| `site/src/data/usecases.json` | Review all 10 guides' needs, routes, picks, outside options and sources. Record a disposition for each in research even if no route is justified. Route tiers are `one-click`, `preinstalled`, `guide`, `manual`, `backend`, `none`; `noTerminal` is `yes`, `partly` or `no`. Include a real doc link or `null`, not an invented setup guide. Add picks only when supported; fix count/exclusivity claims if a new route changes them. |
| `site/src/data/situations.json` | Review the eight situation-based recommendation groups. Add/change a pick only where its fit and catch are supported. Being listed does not require being recommended everywhere. |
| `site/src/pages/compare/side-by-side.astro` | Review the manual `kinds` map and add the isolation label for a new provider. A VPS gets a `VPS: …` label and `"kind": "vps"` in its provider JSON. The provider picker and calculator data are automatic, the kind label is not. |
| `site/src/data/changes.json` | Add a dated, sourced entry for a new listing or material finding/correction. Distinguish the guide's observation date from a provider-announced launch/change date. Don't invent an announcement date or create product-change entries for a no-change recheck. |
| `site/scripts/price-baseline.json` | Run the existing price checker. New money-bearing source URLs need baseline entries. Limits/concept pages with no currency figures need manual disposition, not invented empty-price baselines. Refresh only after reviewing results; see below. |
| `site/src/lib/cost.test.ts` | Extend existing fixtures for independently hand-worked, representable A/B/C. Check meaningful feasibility/plan boundaries. Never derive expected values from `price()` or rewrite expectations just to turn a failing test green. |
| `site/src/data/schema.ts`, `site/src/lib/data.ts`, `site/src/lib/cost.ts` | Read the contracts and actual validation/model limits. Change them only if necessary for an honest new behavior; use regression tests for behavior changes. Most provider additions are data edits. |
| `README.md`, `site/README.md`, `site/src/data/site.json`, page/component copy | Review counts, examples, comparison attribution and method statements when the provider set or evidence changes. Search prose as well as JSON. Don't advance a blanket checked date after checking one provider. |
| `site/src/data/models.json` | Sandbox-provider work normally does not change model prices. If separately refreshing them, run `node scripts/fetch-model-prices.mjs` from `site/`: the committed TokenWatch snapshot uses zero-data-retention offerings only, a 5/90/5 input/cache/output mix and no colon delivery variants. Keep model spend distinct from machine spend. |

Provider/feature strings are normalized to plain text by `data.ts`; use-case/capability strings retain links/emphasis through `Inline.astro`. Preserve exact source wording in data. Existing wiki links include `[[vcpu]]`, `[[cap:live-resize]]`, `[[feature:storage]]`, `[[provider:boat]]` and `[[use:hermes-agent]]`; nonexistent targets fail the build when rendered.

### Date semantics

- Provider `checkedOn` is the profile date; pricing `checkedOn` is the rate-card date. Advance only the part actually checked.
- Provider cost sections use their own rate-card date; the site-wide prices date is the **oldest** card date, calculated by `data.ts`.
- `capabilities.json.checkedOn` and `usecases.json.checkedOn` are whole-dataset dates. A single-provider recheck does not justify making every other provider look newly checked. Record per-provider coverage/date in its research notes when the schema has no finer date.
- `site.json.checkedOn` is separate profile/method metadata. A build or unchanged currency set is not a research date.

## Use-case interpretation traps

- Hosting Hermes/OpenClaw is different from supplying their tool-execution backend. A preinstalled agent that still needs commands is not one-click. Tensorlake's Crabbox integration runs repository tests; it does not host OpenClaw's Gateway.
- n8n needs a database and the original encryption key. Sleeping webhooks may wake on HTTP; internal scheduled jobs cannot run while asleep. A template's omissions still matter after one-click deployment.
- A persistent Discord/Slack gateway connection needs an awake process; HTTP interaction handlers can be request-driven. A ready-made managed assistant is not deployment of the reader's custom bot.
- Claude Code teams normally need one machine and separate credentials per developer. An account-wide shared login is not per-user isolation.
- Scraper scheduling must survive independently of a sleeping/deleted task machine; store results elsewhere if the machine is thrown away.
- A provider's MCP server that controls sandboxes is not hosting the reader's MCP server. Cloudflare's one-click remote MCP route uses **Workers**, not Sandbox, so Sandbox calculator prices do not price that route.
- Use workload presets as modeled examples, not measured usage. Do not copy Battleships fleet totals into a one-machine illustration.

## Reproducible checks

Start with `git status --short`. From `site/`, use `npm ci` if dependencies are not installed, then run:

```sh
npm run build
npm test
```

The build invokes `validateContent()` in `src/lib/data.ts`. It checks researched providers' cards/cost/company/fit data; feature coverage, figures and scenarios; references and presets; and nonempty capability matrices' exact provider coverage, sources and `partly` shortfalls. It does **not** validate every TypeScript field, duplicate feature rows, all quote text/confidence tags, all docs links, dates, rates, recommendation quality or evidence meaning. An empty capability matrix is currently skipped, so the additional audit matters.

Run this read-only structural audit from `site/`. It derives counts from the files and fills gaps in build validation; it is not a source/semantic audit:

```sh
node --input-type=module <<'NODE'
import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
const read = p => JSON.parse(readFileSync(p, 'utf8'));
const files = dir => readdirSync(dir).filter(n => n.endsWith('.json'));
const providers = files('src/data/providers').map(n => read(`src/data/providers/${n}`));
const features = files('src/data/features').map(n => read(`src/data/features/${n}`));
const capabilities = read('src/data/capabilities.json').capabilities;
const usecases = read('src/data/usecases.json').usecases;
const ids = providers.map(p => p.id).sort();
const tags = ['docs-confirmed', 'pricing-page', 'third-party', 'inferred', 'not-published'];
const unique = (items, label) => assert.equal(new Set(items).size, items.length, label);
unique(ids, 'duplicate provider IDs');
unique(features.map(f => f.id), 'duplicate feature IDs');
unique(capabilities.map(c => c.id), 'duplicate capability IDs');
unique(usecases.map(u => u.id), 'duplicate use-case IDs');
assert(capabilities.length > 0, 'no capabilities');
for (const f of features) {
  assert.deepEqual(f.rows.map(r => r.provider).sort(), ids, `feature ${f.id} coverage`);
}
for (const c of capabilities) {
  assert.deepEqual(c.rows.map(r => r.provider).sort(), ids, `capability ${c.id} coverage`);
  for (const r of c.rows) {
    assert(r.source?.url && r.source?.quote, `${c.id}/${r.provider} evidence`);
    assert(tags.includes(r.source.confidence), `${c.id}/${r.provider} confidence`);
    assert((r.figure?.length ?? 0) <= 40, `${c.id}/${r.provider} figure`);
    assert(r.verdict !== 'partly' || r.shortfall?.trim(), `${c.id}/${r.provider} shortfall`);
  }
}
console.log(`${providers.length} providers, ${features.length} features, ${capabilities.length} capabilities, ${usecases.length} use cases; coverage/evidence fields OK`);
NODE
```

For the target provider, additionally verify (manually or with a temporary probe):

- Filename/ID agreement, one matching pricing card, all feature/topic dispositions, every capability's source/meaning/shortfall, and all use-case dispositions in the evidence ledger. Missing docs/routes may be legitimate; missing capability rows are not.
- A/B/C engine plan, shape, feasibility, line items and totals versus independently worked arithmetic. Include affected non-default/boundary workloads.
- Every changed URL loads the intended document; quoted passages remain present with only declared normalization. Validate **final** files after regenerating, not an obsolete intermediate.
- Built provider, feature/capability, comparison, use-case and search pages contain the expected content and valid internal links. Check for visible raw Markdown, `undefined`, `NaN`, `[object Object]`, obsolete rates/counts and contradictory summaries.
- Render/inspect affected pages on desktop and narrow mobile. Capture and inspect changed pointer/keyboard behavior where relevant. Use a supervised orb preview from the existing site workflow, and share portal URLs rather than localhost with the owner.

### Pricing-source baseline

From `site/`, run `npm run check-rates` after adding/changing source URLs. Read all `CHANGED`, `NEW`, `FAILED`, `NO PRICES` and `OLD` output; **NEW and OLD do not make the exit code nonzero**. A source with no figures and no prior figures may print nothing. This script extracts money tokens, not tariff meanings: it can miss a changed unit, allowance, duration or unchanged-number rewording.

Read affected live pages through the Composio-first route, bypass caches, reconcile real changes with the card/prose/tests/ledger, and only then run:

```sh
npm run check-rates -- --update
```

This writes all successfully fetched nonempty figure sets, not only the target provider. Inspect the baseline diff; do not bless unrelated changes, failures or stale renderings. `--update` is not a verification pass and can finish successfully despite unreadable pages. Keep unresolved sources explicit. Commit a justified baseline together with its card changes when committing is authorized. Never hand-edit the generated baseline to suppress a warning.

## How the existing work was produced

Read these threads when reconstructing a method or resolving a historical decision:

- [Main build/integration](https://ampcode.com/threads/T-01a185c3-bb1a-76c8-950e-b27236d343ad): research batches, single shared engine, dated sources, integrations, corrections and publication approvals.
- [Tensorlake](https://ampcode.com/threads/T-01a18629-61d8-720f-bccc-95dbc7108e5b): seven research artifacts (profile, rate card, feature rows, docs, routes, extra capabilities, notes), temporary real-site integration, then parent integration. Its quote check covered normalized fetched text, not literal bytes. Historical `/tmp` generators are not repo commands.
- [New use cases](https://ampcode.com/threads/T-01a18612-9809-75a5-8097-0f5955752409): generated research Markdown/JSON, quote verification, explicit route tiers and proposed workloads; parent mapped selected fields into the site.
- [Machine/money](https://ampcode.com/threads/T-01a1862f-40ff-736e-9eb5-12414a020062), [state/staying-on](https://ampcode.com/threads/T-01a1862f-49e5-7789-adc2-3923a17c6e84), [access](https://ampcode.com/threads/T-01a1862f-541c-773f-80cf-1dabf3f342fe), [running/company](https://ampcode.com/threads/T-01a1862f-6156-707c-89e3-518ee25508cc): independent JSON/notes shards, normalized quote matching, corrected verdicts, artifact transfer, and parent reconciliation.

Useful history commands: `git log -- <path>`, `git show <commit> -- <path>`. If shallow, fetch the required branch's full history first. Starting points:

- `f24f333`: Tensorlake integration, including three added A/B/C fixtures ($22 / $250 / $8.25 under the documented model).
- `16288e1`: $22 consumed usage versus the $25 minimum purchase covering it. Keep this distinction even when totals happen to match.
- `ce03c1d`: claim-level Tensorlake evidence; a historical schema exception, not permission to add arbitrary keys.
- `8146c64`: five new guides plus presets, research separated from executable data.
- `8acdb3f`, `1373106`, `28e5232`: Tensorlake GPU isolation exception, InstaBox static IP unknown rather than third-party negative, Cloudflare templates with a catch.
- `11f569b`, `43887e1`, `617bf4c`: scheduled local copies treated as backups with a catch; Tensorlake/Modal role gates.
- `b0711a6`, `eeafd8b`: date semantics, Lizard plans, baseline coverage and the weekly schedule host.

These identify reproducible methods and mistakes to avoid, not current provider facts. Recheck primary sources before using their figures or wording.

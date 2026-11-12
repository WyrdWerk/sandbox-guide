# Agent 37 recheck — 2026-11-12

Repo: sandbox-guide @ `origin/main` `4432d00` (worktree clean at start).
Previous site check: **2026-10-28** (provider `checkedOn` 2026-10-28, pricing card 2026-10-30, capabilities 2026-10-29).
Scope: profile `site/src/data/providers/agent37.json`, 16 feature rows, 78 capability rows, `site/src/data/pricing/agent37.json`, `docs.json`, `research/agent37.md`, `research/rates/agent37.json`.
Desk research only: no account, no credentials, no sandbox created, started or billed.

## Bottom line for the parent

- **No unit-rate change.** $0.80/vCPU-month, $0.70/GB-RAM-month, $0.09/GB-disk-month, per-minute, performance 4×, vm 2.5× are all still live. A/B/C *rate inputs* are unchanged.
- **Shape table changed.** The VM type no longer sells 8 or 16 vCPU. Its four shapes are now 2/4, 4/8, 4/16, 4/32 (was 2/4, 4/8, 8/16, 16/32), and **every VM or Performance shape takes 2–100 GB of disk** (was 2–12/20/40/80). The billing page also says the free tier runs 3 instances "of any template, size, or type, VMs included", while `create` still says a VM "needs a funded workspace" — see contradiction 1. The 4 vCPU ceiling contradiction is resolved: 4 vCPU is now the ceiling on every type, and the benchmark page says "Agent37 sandboxes go up to 4 vCPU."
- **Capability verdicts to change: 4** — `big-disk` no→yes, `big-machines` partly→yes, `dpa` not-published→yes, `free-tier` no→partly. Plus one correction with no doc change: `fast-start` not-published→no (its own ledger already recorded "a few seconds").
- **No feature verdict changes.** Eight feature rows need text (sizes-regions, trials-free-tiers, company, custom-domains, outbound-network, keys-secrets, built-in-agents, teams-accounts); the rest are unchanged.
- **Commercial framing changed.** Agent37 now sells four surfaces, not two: Cloud API, Personal agents, a **Skills/Creators marketplace** (`/skills`, `/creators`, keep 80%), and a **white-label dashboard starter kit** (`agent37-platform/starter-kit`). It also publishes MIT reference apps (`Open Instinct`, `Minions`). A **DPA** now exists (Delaware entity, SCCs, named OVH/AWS sub-processors), and the Terms explicitly bless white-labelled end-user agents.
- **Reliability record changed.** The status page lists **8 incidents since 20 Oct**, including 4 on 11 Nov, a 3 h 44 m Europe degradation (5 Nov) and a 2 h 14 m India degradation (11 Nov), while every component headline still reads "100% uptime".
- **Pricing page is now a comparison app** (31 providers, 36 comparisons, benchmark pages), not just a rate table. The Agent37 rate block is unchanged; the new pages carry money figures that will need `price-baseline.json` entries if the parent counts them.

## Tool record and method

- `curl https://www.agent37.com/docs/llms.txt` → **200**, 16,386 bytes, 86 doc links. `curl .../docs/llms-full.txt` → **200**, 830,821 bytes (baseline bundle was 787 KB, so docs grew).
- `curl` on the root `/llms.txt` and `/llms-full.txt` → **404** (Next.js error page). Only the `/docs/` paths serve the bundles. Do not use the root paths.
- **Context.dev MCP** (`web_scrape`, `maxAgeMs: 0`, `responseMode: "full"`, `formats.markdown`) succeeded on `/pricing`, `/cloud`, `/personal`, `/`, `/terms`, `/privacy`, `/dpa`, `/open-instinct`, `/skills`, `/creators`, `/abuse`, `/solutions`, `/benchmarks`, `/qm`, `status.agent37.com`, `status.agent37.com/incidents`, `trust.agent37.com/compliance`. Fresh retrieval: every price page was requested with `maxAgeMs: 0`; `/pricing` was scraped twice (start and re-read of the unit table) with identical figures.
- `curl` on 77 individual `docs/...md` pages → all **200**, saved under `/tmp/a37docs/`; `curl` on the marketing pages → all **200**.
- **TinyFish / Parallel / Exa / Firecrawl / Tavily:** not called; Context answered every page (so no second Composio route was exercised). No Composio connection was created or changed.
- **Amp native `web_search` / `read_web_page`:** not used. No fallback was required.
- **Quote check:** 94 evidence quotes in the current feature+capability rows (79 docs, 15 marketing) were normalised (markdown emphasis/link syntax, curly quotes, HTML) and substring-matched against the live pages. **89 still match**; 5 no longer do and were inspected: `custom-domains` (table row → prose), `outbound-network` and `egress-allowlist` (same sentence, new "a list of addresses only" wording), `teams-accounts` (sentence moved concepts → members), `static-ip` ("Entries are IPv4 for now" → "Entries are domains and IPv4"). The `ssh`/`tunnel`/`status-page` misses in the first pass were normaliser artifacts (angle-bracket code spans, a URL used as link text) and do match.
- **No changelog page exists.** `/changelog`, `/docs/changelog`, `/docs/agents-api/changelog`, `/whats-new`, `/releases` all 404. "Latest changelog" was therefore taken from: baseline quote diffs, the blog (posts dated 10–12 Nov), the first-party GitHub org (`minions` and `templates` pushed 12 Nov; `starter-kit` 9 Nov), the status page, and the legal pages' "Last updated" dates (Terms/DPA 5 Nov, Privacy 1 Sep, Abuse 21 Sep).
- **Trust Center** returns 403 to `curl` but rendered through Context: SOC 2 "In progress", GDPR "In progress", unchanged.

## 1. Features — current verdict, specifics, evidence, changed?

### isolation — **partly** — unchanged row
- gVisor container by default (shared host CPU); `vm` is a full Linux VM with its own kernel and KVM at 2.5× compute; `performance` holds its cores at 4×.
- The only substantive movement is the ceiling: **4 vCPU now applies to every type** (the VM page's 8/16-vCPU rows are gone), so "the VM type buys more cores" is no longer true — it buys a kernel, KVM and Docker.
- `https://www.agent37.com/cloud` — "Every sandbox is enforced by gVisor, with its own filesystem and a hard disk quota."
- `https://www.agent37.com/docs/agents-api/vm-instances` — "A `vm` instance is a full Linux virtual machine with its own kernel and KVM hardware virtualization."
- `https://www.agent37.com/docs/agents-api/instance-sizing` — "4 vCPU is the ceiling on every instance type."
- Verdict unchanged; note "vm type gives a real kernel at 2.5× compute" still right. **No edit needed** beyond the sizes row.

### sizes-regions — **partly** — **CHANGED**
- Four shapes remain: 2/4, 4/8, 4/16, 4/32. Three regions: `us`, `eu` (France), `ap-south` (India, Mumbai); same price; EU/India run only VM and Performance.
- **Disk is now 2–100 GB on every VM and Performance shape**, not the old per-shape 2–12/20/40/80. Default shapes keep 2–12/20/40/80.
- **The VM type's shape list is now the same four as default** (2/4, 4/8, 4/16, 4/32) at 2.5× compute: $11.36 / $22.54 / $37.08 / $66.16. The old 8/16 ($45.08) and 16/32 ($90.16) rows are gone, which **resolves the 4-vCPU contradiction**.
- Evidence: `https://www.agent37.com/docs/agents-api/instance-sizing` — "A VM or `performance` instance takes 2-100 GB of disk on every shape." · "4 vCPU is the ceiling on every instance type."
- `https://www.agent37.com/docs/agents-api/vm-instances#sizing-and-price` — table "| 4 | 32 GB | 2-100 GB | 24 GB | $66.16 |"; page text "The same four [shapes], and compute meters at 2.5x the default rate".
- `https://www.agent37.com/benchmarks` — "Agent37 sandboxes go up to 4 vCPU. The build benchmark asks for 8, so our builds ran on half the cores most providers had."
- `https://www.agent37.com/docs/agents-api/instances/create` — "Where the instance runs: `us`, `eu` (France), or `ap-south` (India, Mumbai). The price is the same in all three." · "`us` is the only region that runs every instance type."
- **Edit:** note "2–80 GB of disk by shape" → "2–80 GB on the default shapes; 2–100 GB on VM and Performance". Scenario "Four shapes cap at 4 vCPU" → "Four shapes, 4 vCPU on every type". Figure can stay "4 vCPU; three regions".

### billing-models — **yes** — unchanged
- Prepaid wallet, per-minute, priced from reserved `resources`, no plan fee, no minimum, stopped/sleeping is disk only.
- `https://www.agent37.com/docs/agents-api/billing` — "The monthly price is the rate; the wallet is metered per minute (the monthly price divided by 730 hours, divided by 60)."
- `https://www.agent37.com/pricing` — "No monthly plan fee or seat charge."
- Rates and model unchanged. Instance *caps* changed but belong to `trials-free-tiers`; see there.

### trials-free-tiers — **partly** — **CHANGED**
- Cloud: one-off **$5** credit after a card is added (nothing charged); not granted to `POST /v1/signup` workspaces. No recurring Cloud allowance. Top-ups $5–$10,000.
- **Free-tier concurrency is now 3 instances of any template, size or type — "VMs included"** (was 1 instance, 2 vCPU / 4 GB only). After the first top-up: 10. Then **$50** lifetime top-ups → 50 (was $100), **$250** → 200, **$1,000** → 1,000 (new). **The cap now counts only awake instances**; sleeping and stopped ones never count (was: every instance not deleted or failed).
- **New: startup credits up to $10,000** — "$1,000 to start, then we match what you spend", booked via a call. Separate from the self-serve $5.
- Personal: Free $0/mo, one agent, **now "with a card on file (nothing is charged)"** (baseline said "no card"), $0.20 default-model credit, sleeps after 15 min, removed after 30 days asleep. Paid plans from $3.99.
- Evidence: `https://www.agent37.com/docs/agents-api/billing` — "Until your first real top-up, the workspace runs up to three instances at once, of any template, size, or type, VMs included." · "The limit counts only awake instances." · "| Top-ups total $50 or more | 50, all shapes |" · "| Top-ups total $1,000 or more | 1,000, all shapes |"
- `https://www.agent37.com/pricing` — "3 before your first top-up, 10 after it, 50 once your top-ups total $50, 200 once they total $250, and 1,000 once they total $1,000." · "New eligible accounts get $5 starter credit after adding a card."
- `https://www.agent37.com/` — "Up to $10,000 in credits for startups." · "$1,000 to start, then we match what you spend."
- `https://www.agent37.com/personal` — "Yes. One agent, with a card on file (nothing is charged). It sleeps after 15 minutes idle and wakes when you message it."
- **Edit:** figure stays "$5 one-off"; scenario "plus a managed-hosting free plan with no card" → "plus a $0 managed-hosting plan that also needs a card on file"; note add 3 concurrent any shape incl VM, $50/$250/$1,000 tiers, awake-only counting, startup credits.

### lifecycle — **partly** — unchanged
- `stop` keeps disk, loses memory; `sleep` checkpoints memory+disk and bills disk only; wake usually restores but is not guaranteed; `restart`/`resize`/`update`/`restore` lose memory; `update` resets the OS layer outside `mount_path`.
- `https://www.agent37.com/docs/agents-api/instances/sleep` — "Sleep and [stop] both release CPU and memory and bill disk alone. A sleeping instance keeps its memory and wakes on the next request; a stopped one loses its memory and stays down until `start`."
- New detail: boot hooks `~/.agent37/hooks/post-restart.sh` (5 min) and `post-image-update.sh` (15 min) re-run installs after the OS layer resets. Verdict unchanged.

### snapshots-forks — **partly** — unchanged
- No snapshot product. Seven nightly backups of `/home/node` plus one on-demand slot, restored in place; live fork copies disk (not memory) with its own id/URLs/budget/meter; templates are pinned images.
- `https://www.agent37.com/docs/agents-api/instance-backups` — "Every instance's data (`/home/node`) is backed up nightly into seven rotating slots, so the last seven nights are available as restore points."
- `https://www.agent37.com/docs/agents-api/instances/fork` — "What is copied is the source's disk, not its memory: processes running in the source do not carry over, and the fork boots fresh with the same files."
- No change.

### storage — **partly** — unchanged
- Whole disk persists and bills at **$0.09/GB-month** until delete; no volumes, no shared volume, no bucket mount. Backups cover only `/home/node`. Cold storage **$0.03/GB-month** on compressed bytes.
- New detail (already in ledger): writes outside `mount_path` share a **10 GB OS layer separate from the billed disk**; `update` resets it. This is why "whole disk" ≠ "everything survives update".
- `https://www.agent37.com/docs/agents-api/billing` — "Disk | $0.09 per GB per month" · "Parked in cold storage | $0.03 per GB per month, on the actual compressed bytes stored."
- Verdict unchanged.

### idle-timers — **yes** — unchanged
- `auto_sleep` defaults **false**; no lifetime cap; `idle_timeout_seconds` 300–86400 (5 min–1 day); any request to any URL wakes; exec counts as activity; open-but-silent connections do not.
- `https://www.agent37.com/docs/agents-api/instance-auto-sleep` — "Instances default to `auto_sleep: false` and never sleep on their own unless you opt them in."
- Unchanged.

### reaching-it — **yes** — unchanged
- Instance URL `https://{id}.agent37.app` (default port), preview URL `https://{id}-{port}.agent37.app` for any port, both need `X-Agent37-Key` or a signed URL; public ports are permanent and unauthenticated; SSH is tunnelled over WebSocket; no raw TCP.
- `https://www.agent37.com/docs/agents-api/concepts` — "Instance URLs require auth on every request"
- `https://www.agent37.com/docs/agents-api/public-ports` — "an HTTPS URL for one port of one instance that anyone can reach with no credential at all"
- Minor: `Authorization: Bearer` on instance URLs now works only for grandfathered workspaces; new keys use `X-Agent37-Key`. Not a capability change.

### custom-domains — **yes** — **CHANGED (threshold)**
- Whole-domain delegation only (nameservers), no subdomain of an existing domain; every workspace URL mirrors at `{label}.yourdomain.com`; platform certificate.
- **Unlock threshold is now $50 of lifetime top-ups, not $100.** Up to **10 domains per workspace, free**; 11th returns 400.
- `https://www.agent37.com/docs/agents-api/domains` — "Custom domains are a paid feature: they unlock once your workspace's top-ups total $50, the same tier that raises the instance limit to 50." · "Up to 10 domains per workspace, at no charge." · "The whole domain's DNS is delegated to us, so it cannot carry your website, mail, or other records."
- **Edit:** `custom-domain` capability shortfall "$100 of top-ups" → "$50"; feature note add the threshold/10-domain cap if desired.

### outbound-network — **yes** — **CHANGED**
- Three policies, changeable live with `PATCH /v1/instances/{id}`, applied within seconds, no restart; connections no longer allowed are cut.
- **Allowlist now takes domains as well as IPv4 addresses/ranges, up to 100 entries.** Domain entries cover HTTPS on 443 only; `*.example.com` wildcards one label; plain HTTP and other ports follow address entries. IPv6 still 400.
- DNS still counts as a connection under `deny-all` or an address-only list; private ranges still blocked; managed services reached at `api.agent37.com` and must be on the list.
- No static egress IP and no published egress price.
- `https://www.agent37.com/docs/agents-api/instance-network` — "Only the listed domains and IPv4 addresses and ranges, up to 100 entries." · "A domain entry lets the instance make HTTPS connections to that name." · "Entries are domains and IPv4."
- **Edit:** note "an IPv4 allowlist" → "a domain and IPv4 allowlist"; mention 443-only for names. `docs.json` title "IPv4 allowlist" → "domain and IPv4 allowlist".

### keys-secrets — **partly** — **minor change**
- No general secret manager; your keys are `env` vars on the instance, write-only through the API and reapplied on every container build. The agent can read and repeat them; a per-instance `AGENT37_MANAGED_TOKEN` covers four managed services (LLM, Brave, Composio, Perflo).
- **Env limits changed:** now "any number of entries, each under 128 KB and 256 KB in total" (was "Up to 64 entries and 64 KB in total"). Six reserved names rejected. Env is encrypted at rest (DPA Annex II).
- Workspace API keys can carry an **IP allowlist (20)** and now an **expiry date**; still no read-only or per-resource scopes.
- `https://www.agent37.com/docs/agents-api/instance-environment` — "`env` is write-only: it is not returned by `GET /v1/instances/{id}`"
- `https://www.agent37.com/docs/agents-api/browser-use` — "Anything in an instance's environment, the agent can read and repeat back."
- Verdict unchanged; note can add "write-only, encrypted at rest; no secret manager".

### ways-to-drive — **yes** — unchanged verdict, more API surface
- REST on two planes (`api.agent37.com` Bearer; instance URLs `X-Agent37-Key`), Python one-file SDK, `npx agent37` / `npm i -g agent37` CLI, SSH with ProxyCommand, web terminal on 7681, desktop on 6080/6901. No control-plane MCP server.
- New endpoints since baseline: `GET /v1/billing`, `POST /v1/billing/top-up` (Stripe Checkout URL), `GET /v1/instances/{id}/events` (start/sleep/wake/stop history, recorded from 2026-11-08), `/v1/ssh-keys` CRUD, `/v1/instances/{id}/integrations/*` (Composio), `/v1/instances/{id}/crons`.
- `https://www.agent37.com/docs/agents-api/overview` — "Use the **Sandbox API** to create and manage persistent sandboxes for code, services, and agents."
- Row still accurate; note can name the new endpoints.

### built-in-agents — **yes** — **CHANGED (figure correction)**
- **Seven** agent harnesses, not six: Hermes, OpenClaw, Claude Code, Codex, Grok, OpenCode, **Pi**. Plus n8n (workflow app, not an agent harness) and the VM-only Ubuntu/Android templates.
- Claude Code (own Anthropic account) and Codex (own OpenAI account) are the only ones Agent37 never bills; Grok needs your xAI key; Hermes, OpenClaw, OpenCode and Pi run on the managed model or BYOK.
- `https://www.agent37.com/docs/agents-api/concepts` — "Hermes, OpenClaw, Claude Code, Codex, Grok, OpenCode, and Pi are the live agents today"
- `https://www.agent37.com/docs/agents-api/templates` — the 11-row catalog.
- **Edit:** figure "Six templates; hosted" → "7 agents; hosted"; note "Six agent templates (… OpenCode) plus Pi and n8n" → "Seven agent templates (… OpenCode, Pi) plus n8n". (`agents-preinstalled` capability figure "6 templates" likewise → "7 templates".)

### teams-accounts — **partly** — **minor change**
- Workspace = account: owns keys, wallet, every instance. Invite by email; invitation must be accepted. Roles `admin` (everything) and `user` (**use the workspace's apps; no dashboard, keys or billing**) — the user role is narrower than "users get the rest".
- Per-instance managed-spend budget (monthly cap + one-time credit), not a bill cap. **No SSO/SAML, no audit log, no usage alerts** published. SSH public keys are listed and auditable; instance start/sleep/wake/stop events are now queryable.
- Instance caps: 3 / 10 / 50 / 200 / 1,000 by top-ups, awake only (see trials).
- `https://www.agent37.com/docs/agents-api/members` — "A workspace is the account: it owns the API keys, the wallet, and every instance." · "`user` | Use the workspace's apps. No dashboard, keys, or billing."
- **Edit:** note the narrower `user` role, key expiry/IP allowlist, awake-only instance caps. Verdict stays partly (no SSO/audit log).

### company — **partly** — **CHANGED (material)**
- **Entity:** Terms still say "Agent 37 Inc." (New York law); the new **DPA (5 Nov 2026)** says **"Agent37.com Inc, a Delaware corporation"**, address **555 S 1st St #521, Harrison, NJ 07029**, signed by **Vishnu Krishnaprasad, CEO**. So the state of incorporation is now published (Delaware), and the entity name is inconsistent across first-party pages.
- **DPA:** published at `/dpa`, forms part of the Terms, includes SCCs (Module 2/3), UK Addendum, Swiss FADP, 48-hour breach notice, annual audit right, 30-day sub-processor notice, backups-off option, 30-day deletion.
- **Sub-processors (newly named):** **OVH (OVHcloud)** — instance servers, US/France/India matching region; **Amazon Web Services** — additional instance servers at peak demand; Cloudflare (routing + US backups); Google/Firebase; Vercel; Stripe; Grafana; Resend; Google Workspace; PostHog; Crisp (France); GitHub; Daytona (template builds); OpenRouter; Brave; Composio; Perflo.
- **Status:** 8 incidents since 20 Oct — 20 Oct US 21 min, 29 Oct creations 1 h 5 min, 5 Nov (US/Europe/India; Europe 3 h 44 m), 10 Nov (US/Europe/India; Europe 4 m), 11 Nov ×4 (India 2 h 14 m, Europe 9 m). Every component still headlines "100% uptime", which cannot be true for Europe's 30-day window.
- **SLA:** still none. **SOC 2:** Type I on request, Type II in progress (Trust Center still says "In progress"). **Headcount/funding:** still unpublished beyond YC F26.
- Evidence: `https://www.agent37.com/dpa` — "Agent37.com Inc, a Delaware corporation" · "United States, France or India, matching the instance's region" · "Additional instance servers at peak demand"
- `https://www.agent37.com/terms` — "our Data Processing Agreement forms part of these Terms." · "including giving your end users white-labeled agents on their own instances."
- `https://status.agent37.com/` — "Degraded for 3 hours and 44 minutes" · "100% uptime"
- **Edit:** figure "Agent 37 Inc.; no SLA" → "Agent37.com Inc (Delaware); no SLA"; note add DPA/SCCs, named OVH+AWS, white-label clause, 8 incidents; scenario add DPA. Verdict stays partly (no SLA, Type II not done, status page self-contradicts).

## 2. Capabilities — all 78

Format: `id` — verdict — figure — evidence (URL, short verbatim quote) — change.
A leading `/` is `https://www.agent37.com`; `/docs/...` is the documentation site. Unmarked = unchanged. Everything below was checked live on 2026-11-12.

### isolation (5)

- **own-vm** — partly — gVisor; VM costs 2.5× — `/cloud`, "Every sandbox is enforced by gVisor, with its own filesystem and a hard disk quota."; `/docs/agents-api/vm-instances`, "A `vm` instance is a full Linux virtual machine with its own kernel and KVM hardware virtualization." — unchanged. Shortfall still right: the standard machine is a gVisor container, the VM type is 2.5×.
- **root** — yes — root on request — `/docs/agents-api/exec`, "pass \"root\" to run as root, for example to install system packages with apt-get" — unchanged.
- **docker-inside** — partly — VM type only — `/docs/agents-api/vm-instances`, "The default gVisor instance type cannot run a Docker daemon." — unchanged. Note the VM type is now 4 vCPU max, so a Docker build cannot buy more than 4 cores.
- **nested-virt** — partly — VM type only — `/docs/agents-api/vm-instances`, "`/dev/kvm` is present inside the machine" — unchanged.
- **custom-image** — yes — Dockerfile or registry — `/docs/agents-api/custom-image`, "You can run an Agent37 instance from any Docker image." — unchanged; still `linux/amd64` only, ARM rejected.

### sizes-regions (6)

- **any-size** — no — 4 fixed shapes — `/docs/agents-api/instance-sizing`, "4 vCPU is the ceiling on every instance type." — unchanged verdict. Four fixed CPU/RAM pairs (2/4, 4/8, 4/16, 4/32); disk is free-form inside the range (2–12/20/40/80 default, 2–100 VM/Performance). Anything else snaps to the nearest shape.
- **big-machines** — **partly → yes** — **4 vCPU / 32 GiB** — `/docs/agents-api/instance-sizing`, "4 vCPU is the ceiling on every instance type."; `/docs/agents-api/vm-instances`, table "| 4 | 32 GB | 2-100 GB | 24 GB | $66.16 |"; `/benchmarks`, "Agent37 sandboxes go up to 4 vCPU." — **CHANGED**: the VM page's 8-vCPU/16-GB and 16-vCPU/32-GB rows are gone, so the old "16 on the VM type" figure and the contradiction shortfall are both false. The 4 vCPU / 32 GB shape remains on every type and meets the 32 GiB half of the definition. *If the parent reads the provider's "32 GB" as decimal GB (29.8 GiB, the Hostinger precedent), this stays `partly` with figure "4 cores / 29.8 GiB"; the site's rate card already models it as 32 GiB, so I recommend `yes`.*
- **live-resize** — partly — resize, but memory is lost — `/docs/agents-api/instance-lifecycle`, "start and resize answer 202 instead of 200 when they moved the instance to another host" — unchanged. CPU/memory/disk all resize in place; memory and processes are lost on a host move; disk only grows.
- **gpu** — no — no GPU — `/docs/agents-api/instance-sizing` (no GPU row anywhere; `llms-full.txt` has zero occurrences of "GPU", "CUDA" or "H100") — unchanged.
- **choose-region** — yes — 3 regions — `/docs/agents-api/instances/create`, "Where the instance runs: `us`, `eu` (France), or `ap-south` (India, Mumbai). The price is the same in all three." — unchanged. No fallback: a full region returns `503 no_capacity`.
- **eu-region** — partly — France, backups in US — `/docs/agents-api/instances/create`, "Backups and the instance's own control-plane record (its id, shape, and status) are stored in the US" — unchanged. DPA Annex III confirms instance servers are OVH/AWS in France for `eu`, backups at Cloudflare in the US.

### lifecycle (3)

- **pause-memory** — partly — `/docs/agents-api/instances/sleep`, "A sleeping instance keeps its memory and wakes on the next request; a stopped one loses its memory and stays down until `start`." — unchanged. Memory "usually" survives; a wake that has to rebuild or was moved to cold storage boots fresh.
- **warm-pool** — no — `/docs/agents-api/instance-lifecycle`, "Six calls control whether the instance's computer is running, which image it runs, and how big it is." — unchanged. No pre-started pool; the paid **Performance account** only speeds starts/wakes, it is not a pool.
- **fast-start** — **not-published → no** — **a few seconds** — `/docs/agents-api/instance-auto-sleep`, "The restore itself takes a few seconds." — **CORRECTION, not a doc change**: this sentence is already in the 2026-10-28 ledger, so the row's note "No start or resume time is published anywhere in the docs" was wrong then too. A resume is documented at a few seconds, so it is not under one. Cold-create time is still unpublished. Use `no` with shortfall "A sleep checkpoint takes a few seconds to restore; a cold create publishes no time."

### snapshots-forks (6)

- **snapshot-files** — partly — No snapshots; 7 backups — `/docs/agents-api/instance-backups`, "Every instance's data (`/home/node`) is backed up nightly into seven rotating slots, so the last seven nights are available as restore points." — unchanged. No named snapshot; restore is in place and only `/home/node`.
- **snapshot-memory** — no — `/docs/agents-api/instances/fork`, "What is copied is the source's disk, not its memory: processes running in the source do not carry over, and the fork boots fresh with the same files." — unchanged. (Sleep checkpoints memory but cannot be named, listed or cloned, so they do not count.)
- **fork-running** — yes — `/docs/agents-api/instances/fork`, "The source keeps running throughout and is not touched." — unchanged. Fork copies disk only, can change CPU/RAM up or down and disk up, not down.
- **older-snapshot** — partly — 7 nightly backups — `/docs/agents-api/instance-backups`, "You can also take a backup on demand, into a separate slot that only your next on-demand backup replaces." — unchanged.
- **templates** — yes — `/docs/agents-api/templates`, "A template is a named image, plus (optionally) the port its main service listens on." — unchanged verdict; **new depth**: cloud builds now expose immutable **revisions** and release history, pin with `@<tag>` (system) or `@<revision>` (workspace), and `update` can migrate an instance between templates. 11 system templates.
- **backups** — yes — Nightly; 7 slots — same backups quote — unchanged; backups/restores free, can be turned off by emailing support@agent37.com.

### storage (5)

- **files-survive-stop** — yes — `/docs/agents-api/instance-lifecycle`, "The whole disk persists, like a VM." — unchanged. Survives stop, start, restart, resize; `update` resets only outside `mount_path`; the OS layer is a separate 10 GB.
- **volumes** — no — `/docs/agents-api/instance-lifecycle`, "The whole disk persists, like a VM." — unchanged. No detachable volume; the instance disk dies with the instance.
- **shared-volume** — no — same page/quote — unchanged. No storage attachable to two machines.
- **mount-buckets** — no — `/docs/agents-api/instances/create`, "The folder the instance's disk is mounted at, and the one folder an `update` keeps." — unchanged. `mount_path` is a path on the instance disk, not an S3/NFS mount.
- **big-disk** — **no → yes** — **100 GB (VM)** — `/docs/agents-api/instance-sizing`, "A VM or `performance` instance takes 2-100 GB of disk on every shape."; `/docs/agents-api/vm-instances`, "| 4 | 8 GB | 2-100 GB | 6 GB | $22.54 |" — **CHANGED**: 100 GB is orderable, but only on the 2.5× VM or 4× Performance type. The default type still caps at 80 GB (4/32 shape). Shortfall should be dropped or replaced with the type gate; figure "100 GB (VM type)".

### idle-timers (4)

- **stay-on** — yes — `/docs/agents-api/instance-auto-sleep`, "Instances default to `auto_sleep: false` and never sleep on their own unless you opt them in." — unchanged. No lifetime cap; "Nothing times out mid-task" (Cloud FAQ).
- **choose-idle** — yes — 5 min to 1 day, or off — `/docs/agents-api/instance-auto-sleep`, "Once no bytes have moved through any of its URLs for `idle_timeout_seconds` (default 900, from five minutes to a day)" — unchanged.
- **wake-on-request** — yes — `/docs/agents-api/instance-auto-sleep`, "opening one is exactly the kind of request that wakes the instance." — unchanged. Any request to any URL; exec and update also wake.
- **schedules** — yes — `/docs/agents-api/crons`, "Each firing wakes the instance, runs the turn on its own session, and lets the instance go back to sleep." — unchanged. Platform crons live outside the instance, so they fire while it sleeps; `agent37-base` and `agent37-n8n` take none.

### reaching-it (6)

- **public-url** — yes — Any port — `/docs/agents-api/public-ports`, "an HTTPS URL for one port of one instance that anyone can reach with no credential at all" — unchanged. Permanent; 20-char random slug or a chosen prefix; the URL is the credential.
- **private-url** — yes — Key or signed link — `/docs/agents-api/concepts`, "Instance URLs require auth on every request" — unchanged. `X-Agent37-Key` header or a time-boxed signed URL; 401 without one.
- **ssh** — yes — Over one connection — `/docs/agents-api/ssh`, "`ProxyCommand` is what carries the SSH stream (there is no port to dial directly)" — unchanged. Standard OpenSSH, key registered via API/CLI; login `root` by default or `node` as the agent user; scp/sftp/-L/VS Code Remote SSH.
- **web-terminal** — yes — Port 7681 — `/docs/agents-api/urls`, "A shell in the container (browser)" — unchanged.
- **tunnel** — yes — ssh -L — `/docs/agents-api/ssh`, "port forwarding with `-L`" — **evidence upgraded** from inferred to docs-confirmed; verdict unchanged.
- **raw-tcp** — no — `/docs/agents-api/urls`, "Every port it listens on has its own HTTPS URL" — unchanged. Only HTTPS is carried; SSH is WebSocket; the Android doc adds "The emulator's own WebRTC stream needs UDP, which the Agent37 edge does not carry."

### custom-domains (2)

- **custom-domain** — partly — Dedicated domain only — `/docs/agents-api/domains`, "The whole domain's DNS is delegated to us, so it cannot carry your website, mail, or other records." — unchanged verdict, **threshold changed**: "they unlock once your workspace's top-ups total **$50**" (was $100), up to 10 domains free. Update the shortfall's "$100 of top-ups first" to "$50".
- **auto-https** — yes — Platform certificate — `/docs/agents-api/domains`, "Set the nameservers" — unchanged. The edge serves the certificate; nothing to renew.

### outbound-network (4)

- **egress-included** — not-published — No rate published — `/pricing`, "Cloud API pricing" — unchanged. No per-GB outbound rate, allowance or overage anywhere on `/pricing`, `/cloud`, `/docs/agents-api/billing` or `/docs/agents-api/instance-network`.
- **egress-allowlist** — yes — **100 domains + IPv4 entries** — `/docs/agents-api/instance-network`, "Only the listed domains and IPv4 addresses and ranges, up to 100 entries." — **CHANGED** (baseline figure "100 IPv4 entries"). Names cover HTTPS/443 only; `*.example.com` matches subdomains and the bare domain; an address-only list still needs a resolver; private ranges stay blocked; change applies in seconds and cuts existing connections.
- **no-internet** — yes — deny-all — `/docs/agents-api/instance-network`, "Nothing, including DNS." — unchanged.
- **static-ip** — not-published — `/docs/agents-api/instance-network`, "Entries are domains and IPv4." — **quote changed** (was "Entries are IPv4 for now."); verdict unchanged. No fixed outbound address, no NAT-IP product; the allowlist is a destination policy, not a source address.

### keys-secrets (3)

- **secrets-store** — yes — Environment variables — `/docs/agents-api/instance-environment`, "`env` is write-only: it is not returned by `GET /v1/instances/{id}`" — unchanged verdict; **specifics changed**: any number of entries (each <128 KB, 256 KB total; was 64 entries/64 KB), encrypted at rest, six reserved names rejected, applied on the next container build (a sleep wake does not re-read them). Still no dedicated secret manager, rotation or per-secret scope.
- **hidden-secrets** — no — `/docs/agents-api/browser-use`, "Anything in an instance's environment, the agent can read and repeat back." — unchanged. No proxy that injects a key after the agent's request; the agent can print it.
- **scoped-keys** — partly — Workspace only — `/docs/agents-api/concepts`, "each key is scoped to one workspace" — unchanged verdict; **new controls**: optional IP allowlist (20 IPs/CIDRs) and an **expiry date**; still no read-only or per-resource key. Update the note/shortfall to mention expiry; "there is no read-only key" stays true.

### ways-to-drive (8)

- **dashboard-create** — yes — `/terms`, "You can create instances from our dashboard or provision them programmatically through the Agent 37 Cloud API" — unchanged. The docs still never show a click path, but the Terms do.
- **cli** — yes — `/docs/agents-api/templates.md`, "The supported path is the Agent37 CLI:" — unchanged. `npx agent37`; durable form `npm install -g agent37`.
- **python-sdk** — yes — `/docs/python-sdk.md`, "The Agent37 Python SDK is one file built on `requests`, with no package to install." — unchanged.
- **ts-sdk** — no — `/docs/quickstart.md`, "There is no SDK to install: the API is plain HTTPS and JSON" — unchanged.
- **rest-api** — yes — `/docs/agents-api/overview.md`, "Use the **Sandbox API** to create and manage persistent sandboxes for code, services, and agents." — unchanged verdict; more endpoints (billing top-up, instance events, SSH keys, integrations, crons).
- **mcp-server** — no — `/docs/agents-api/managed-services.md`, "Register Composio and Perflo with your MCP client." — unchanged. Agent37 is an MCP **client/host** (Composio, Perflo); no control-plane MCP server for creating sandboxes.
- **pty** — yes — `/docs/agents-api/ssh.md`, "interactive shells with a PTY" — unchanged.
- **file-api** — yes — `/docs/agents-api/files.md`, "Files live on the instance's disk." — unchanged. List/read/write/move/delete/download folders over the instance URL; 512 KB inline cap, streamed downloads unlimited; not available on `agent37-base` (no agent), use scp there.

### built-in-agents (7)

- **agents-preinstalled** — yes — **7 templates** — `/docs/agents-api/templates.md`, "`agent37-hermes` | Hermes, the general agent: chat, browsing, code, files." — unchanged verdict, **figure correction** "6 templates" → "7 templates" (Hermes, OpenClaw, Claude Code, Codex, Grok, OpenCode, Pi). Note still correctly adds n8n and the VM-only Ubuntu/Android.
- **prompt-api** — yes — `/docs/agents-api/chat.md`, "Send a message or task to the agent on your instance." — unchanged. `POST /v1/responses`, SSE streaming, sessions, model/provider per turn.
- **one-click-hermes** — yes — $0–99.99/mo — `/personal`, "Run OpenClaw, Hermes, Claude Code, Codex, OpenCode, or Grok around the clock. Yours is live in one click." — unchanged.
- **one-click-openclaw** — yes — $0–99.99/mo — same quote — unchanged.
- **browser** — yes — `/docs/agents-api/desktop.md`, "The stock `agent37-hermes` template includes a headless browser" — unchanged. Hermes only (plus Personal Pro's Chromium); Claude Code/Codex/Grok/OpenCode images have "no browser and no desktop".
- **desktop** — yes — `/docs/agents-api/vm-instances.md`, "plus an XFCE desktop with Firefox in the browser" — unchanged. Ubuntu VM on 6080, `hermes-vnc-desktop` on 6901.
- **hosts-other-agents** — yes — `/docs/agents-api/cursor.md`, "Cursor Self-Hosted Machines on Agent37" — unchanged verdict; **more platforms now documented**: Cursor Cloud Agents, Claude Managed Agents, OpenAI Agents API, OpenAI Agents SDK, LangChain Deep Agents, plus the Grok Bot/Muse/Instinct/Dots example apps. Update note.

### teams-accounts (6)

- **team-workspace** — yes — `/docs/agents-api/members.md`, "A workspace is the account: it owns the API keys, the wallet, and every instance." — unchanged verdict; **source moved** from `concepts` to `members` (the concepts page no longer carries the sentence). Fix the URL.
- **roles** — yes — `/docs/agents-api/members.md`, "`admin` | Everything: instances, keys, billing, and the team." — unchanged verdict, **role meaning clarified**: `user` is "Use the workspace's apps. No dashboard, keys, or billing." (not "everything except admin").
- **sso** — not-published — `/docs/agents-api/members.md`, "There is no endpoint that writes a membership directly" — unchanged. No SSO/SAML/OIDC page, flag, plan line or endpoint; zero "SAML"/"OIDC" hits in the full docs bundle.
- **spend-cap** — no — `/docs/agents-api/budgets.md`, "Budget figures are ceilings, not money." — unchanged. Per-instance budget caps managed LLM/search/tool spend only; compute has no cap, and auto top-up is on by default.
- **usage-alerts** — not-published — `/docs/agents-api/billing.md`, "returns everything the workspace spent" — unchanged. No threshold/alert setting; emails exist only for a failed auto-charge and for suspension.
- **audit-log** — not-published — `/docs/agents-api/overview.md`, "REST API reference" — unchanged. No account audit log. New `GET /v1/instances/{id}/events` records start/sleep/wake/stop (from 2026-11-08) and `/v1/ssh-keys` lists enrolled keys, but neither records who did what.

### billing-models (5)

- **per-second** — no — per minute — `/pricing`, "Metered by the minute: compute while the sandbox runs, disk while you keep it." — unchanged.
- **active-cpu** — no — full rate while awake — `/pricing`, "An awake instance still pays compute even when its CPU is idle." — unchanged. Billing is from `resources`, not utilisation; `burstable` (experimental, "pricing starting at $1/month") has been **removed from the docs** since baseline, so the only relief is auto-sleep.
- **cheap-pause** — yes — disk only — `/docs/agents-api/billing`, "The disk rate alone: $0.09 per reserved GB per month." — unchanged. Sleeping, stopped and waking all bill disk only; memory held in a sleep checkpoint is not billed.
- **no-monthly-fee** — yes — none — `/pricing`, "No monthly plan fee or seat charge." — unchanged on Cloud (Personal is a separate subscription).
- **flat-price** — no — metered parts — `/docs/agents-api/billing`, "The monthly price is the rate; the wallet is metered per minute" — unchanged. Cores + RAM + disk all meter; the "monthly price" is a display unit.

### trials-free-tiers (3)

- **free-tier** — **no → partly** — **$0 Personal agent** — `/personal`, "$0/mo" · "One agent, sleeps when idle" · "Bring your own API keys (BYOK)" — **CHANGED**. The baseline note ("only free usage is a one-off $5 credit") ignored the managed-hosting Free plan, which is an ongoing $0 tier: one agent, 1 vCPU/4 GB/2 GB, sleeps after 15 min, wakes on a message, BYOK after $0.20 of model credit; removed after 30 days asleep. That is an ongoing free machine, but it is a **different product** from the Cloud API (which has no recurring allowance) and it now needs a **card on file**, so the provider-level answer is `partly`, not `yes`. Shortfall: "The free tier is one managed personal agent, not the Cloud API: it needs a card on file, sleeps when idle, and is removed after 30 days asleep." If the parent scopes the row to Cloud only, `no` is still the answer.
- **free-credit** — yes — $5 — `/docs/agents-api/billing`, "Add a card from the billing page (nothing is charged) and your workspace gets a one-time $5 credit" — unchanged. Still once per account/card, only before the first top-up, never for `POST /v1/signup` workspaces. `/pricing` now hedges "New **eligible** accounts get $5 starter credit"; the docs do not use "eligible".
- **no-card** — no — **card on file** — `/personal`, "Yes. One agent, with a card on file (nothing is charged)." — **changed evidence**: the Personal Free plan now states a card is required, where the baseline ledger recorded "Yes. One agent, no card." (the current page no longer contains that sentence). Cloud still needs a card for the $5 credit and for Stripe top-ups; the API signup path needs funding before anything runs. Verdict stays no; figure/note change.

### company (5)

- **status-page** — yes — `/personal` (footer link "Status") — unchanged verdict; **the quote is a link target, not visible text** — switch the source to `https://status.agent37.com/` and quote "All services are online" (or keep `/personal` and quote "Status"); **note should change**: the page now lists 8 incidents since 20 Oct (20 Oct, 29 Oct, 5 Nov, 10 Nov, 11 Nov ×4) while every component headline reads "100% uptime". Europe's 5 Nov degradation was 3 h 44 m, which is ~0.5% of 30 days, so "100%" is a rounded/reset figure, not a 30-day calculation.
- **sla** — no — `/terms`, "we do not promise a specific uptime level unless we have agreed to one with you in writing." — unchanged. No credits, no target, no remedy; liability capped at 12 months' fees or $100.
- **soc2** — partly — Type I only — `/cloud`, "SOC 2 Type I and readiness reports on request." — unchanged. Privacy adds "Type II is in progress"; Trust Center still lists SOC 2 as "In progress"; DPA Annex II says "Agent 37 runs a SOC 2 program (Security, Availability and Confidentiality)". Preserve the contradiction.
- **dpa** — **not-published → yes** — **Published; SCCs** — `/dpa`, "This Data Processing Agreement ("DPA") is between Agent37.com Inc, a Delaware corporation ("Agent 37"), and the customer that accepts the Agent 37 Terms of Service" — **CHANGED**. Dated 5 Nov 2026; incorporated by the Terms ("our Data Processing Agreement forms part of these Terms"); GDPR roles, SCC Modules 2/3, UK Addendum, Swiss FADP, 48-hour breach notice, 30-day sub-processor notice, annual audit, deletion/return, Annex II security measures, Annex III sub-processor list. Shortfall field no longer needed.
- **open-source** — no — `/terms`, "Agent 37 provides persistent, isolated sandboxes for AI agents." — unchanged verdict; **note should widen**: the sandbox/orchestrator is hosted and not published, but the org now publishes MIT code — the white-label starter kit (`agent37-platform/starter-kit`), Open Instinct (`/open-instinct`), Minions (`minionsai`), the system-template Dockerfiles and the agent37 CLI. "Only template Dockerfiles and images are published" is now too narrow; "the sandbox itself is hosted; the apps and images around it are MIT" is accurate.

## 3. Rate-card inputs — original units

**Executable card (`site/src/data/pricing/agent37.json`): no number changes.** `cpu.rate`, `ram.rate`, `disk.running`, `disk.stopped`, the four `shapes`, `between: "kept"`, `egress.perGiB: null` and the single fee-0 `plans` entry are all still correct. The changes are to things the card cannot express — the VM type's shape list and 100 GB disk cap, the concurrency tiers, and the awake-only counting — so they belong in `notes` (and the profile/features), not in a new numeric field. Do **not** add a `vm` shape array or an instance-limit field just for this; the card has no type dimension and the engine prices the default type.

### Unchanged (re-read live 2026-11-12)

| Input | Original unit | Source |
|---|---|---|
| vCPU | **$0.80 per vCPU per 730-hour month** = $0.00109589/vCPU-h = $0.0000182648/vCPU-min | `/docs/agents-api/billing` — "vCPU \| $0.80 per vCPU per month" |
| RAM | **$0.70 per GB per 730-hour month** = $0.000958904/GB-h = $0.0000159817/GB-min | same — "RAM \| $0.70 per GB per month" |
| Disk | **$0.09 per GB per 730-hour month** = $0.000123288/GB-h = $0.0000020548/GB-min | same — "Disk \| $0.09 per GB per month" |
| Rounded hourly (pricing page) | $0.0011/vCPU-h · $0.00096/GB-h · $0.00012/GB-h | `/pricing` |
| Performance multiplier | **4×** default compute, disk unchanged | `/docs/agents-api/billing` — "compute is 4x the default rate, and disk is unchanged" |
| VM multiplier | **2.5×** default compute, disk unchanged | `/docs/agents-api/vm-instances` — "compute meters at 2.5x the default rate" |
| Default shapes | 2/4 $4.76 (4 GB) · 4/8 $9.34 (6 GB) · 4/16 $15.48 (12 GB) · 4/32 $27.76 (24 GB); disk ranges 2–12 / 2–20 / 2–40 / 2–80 GB | `/docs/agents-api/billing` |
| Cold storage | **$0.03/GB-month** on compressed bytes | same |
| Backups / restores | **free**, 7 nightly slots + 1 on-demand | `/docs/agents-api/instance-backups` |
| Brave search | **$0.005/call** (5,000 micros) | `/docs/agents-api/budgets` |
| Composio | **$0.000114/call** (114 micros) | same |
| Managed LLM | OpenRouter inference cost, **no Agent37 markup** | same |
| Perflo | reported charge, **no markup**; discovery free | same |
| Top-ups | **$5–$10,000** each, Stripe; auto top-up default half the amount, floor **$3** | `/docs/agents-api/billing` |
| Starter credit | **$5** one-time, card required, not for signup-API workspaces | same |
| Create balance check | one day of the instance's running rate; **nothing debited at create** | same |
| Metering | **1 minute**, whole minutes at transitions and at least hourly | same |
| Egress | **no rate, no allowance, no overage** published | `/pricing`, `/cloud` |
| Seats / plan fee (Cloud) | **none** | `/pricing` |
| Custom domains | **10 per workspace, free** | `/docs/agents-api/domains` |

### Changed

| Input | Was (2026-10-28/30) | Now (2026-11-12) | Evidence |
|---|---|---|---|
| **VM shape list** | 2/4, 4/8, **8/16**, **16/32** | 2/4, 4/8, **4/16**, **4/32** | vm-instances table |
| VM 8 vCPU / 16 GB | **$45.08/mo** (12 GB disk) | **removed** | vm-instances |
| VM 16 vCPU / 32 GB | **$90.16/mo** (24 GB disk) | **removed** | vm-instances |
| VM 4 vCPU / 16 GB | not offered | **$37.08/mo** (12 GB disk) | vm-instances |
| VM 4 vCPU / 32 GB | not offered | **$66.16/mo** (24 GB disk) | vm-instances |
| VM/Performance disk range | 2–12 / 2–20 / 2–40 / 2–80 GB by shape | **2–100 GB on every shape** | instance-sizing — "takes 2-100 GB of disk on every shape" |
| Max disk (any type) | **80 GB** | **100 GB** (VM/Performance only; default still 80) | same |
| Concurrent instances before first top-up | **1**, 2 vCPU/4 GB only | **3**, any template/size/type, **VMs included** | billing — "up to three instances at once" |
| 50-instance tier | **$100** lifetime top-ups | **$50** lifetime top-ups | billing — "Top-ups total $50 or more \| 50" |
| 1,000-instance tier | none | **$1,000** lifetime top-ups | billing — "Top-ups total $1,000 or more \| 1,000" |
| What the instance cap counts | every instance not deleted/failed | **awake instances only**; sleeping/stopped never count | billing — "The limit counts only awake instances." |
| Custom-domain unlock | **$100** lifetime top-ups | **$50** lifetime top-ups | domains — "unlock once your workspace's top-ups total $50" |
| Personal Free card | **no card** | **card on file** (nothing charged) | `/personal` FAQ |
| Personal Plus free models | GPT-6 Luna, DeepSeek V4.1 Flash, **Mercury 2** | GPT-6 Luna, DeepSeek V4.1 Flash | `/personal` |
| `burstable` instance type | experimental, **from $1/mo**, no shapes | **removed from all docs** (0 hits in `llms-full.txt`) | docs bundle |
| Startup credits | not listed | **$1,000 to start, matched up to $10,000 total** | `/` — "Up to $10,000 in credits for startups." |
| Env-var limits (not money) | 64 entries, 64 KB total | any number, **128 KB each / 256 KB total** | instances/create |

**No change to the A/B/C unit-rate arithmetic.** A $1.09, B $10.60/$30.10, C $1.61/$2.86 all still derive from the same published rates. Two *feasibility flags* need qualifying:

- B's flag "50 GB of disk forces the 4 vCPU / 32 GB shape" is now true **only on the default type**. A 4/8 VM with 50 GB is $26.50 (2.5 × $8.80 compute + 50 × $0.09 disk), cheaper than B1's $30.10. If B means "always-on default box", keep the flag but add "on the default type"; otherwise the substitution changes.
- C's flag "20 GB is not orderable with 2 vCPU" is now true **only on the default type**. A 2/4 VM with 20 GB at 90 h is $3.13 ($1.36 compute + $1.78 disk), still dearer than C2's $2.86, so C2 remains the cheapest way to get 20 GB — but the sentence needs "on the default type" and the $3.13 alternative is the honest comparison.
- The profile's `sizes` sentence "Disk is any whole number of GB inside each shape's range" now needs the 100 GB VM/Performance exception; `cost.B.flag` and `cost.C.flag` need the same qualification.

## 4. Contradictions between first-party pages (both sides)

1. **Can a free workspace run a VM?**
   - `/docs/agents-api/billing`: "Until your first real top-up, the workspace runs up to three instances at once, of any template, size, or type, VMs included."
   - `/docs/agents-api/instances/create`: "`vm` … It needs a funded workspace." (and the same for `performance`)
   - Reading: "funded" = a positive wallet balance, which the $5 card credit provides; it does not mean "has topped up". A signup-API workspace with $0 can run nothing, so both sentences hold under that reading. The model should use the billing page for the cap (3, any type) and note that a VM still needs a positive balance.

2. **Where do instances run?**
   - `/docs/agents-api/concepts`: "Runs on dedicated servers in the United States."
   - `/docs/agents-api/instances/create`: "`us`, `eu` (France), or `ap-south` (India, Mumbai). The price is the same in all three."
   - `/dpa` Annex III: "United States, France or India, matching the instance's region".
   - Reading: the concepts sentence is stale or refers to the default/control plane. Regions are real; use the create page + DPA.

3. **Legal entity name and state.**
   - `/terms`: "an agreement between you and Agent 37 Inc."; New York law.
   - `/dpa`: "between Agent37.com Inc, a Delaware corporation"; address Harrison, NJ; CEO Vishnu Krishnaprasad; signed 5 Nov 2026.
   - `/privacy`: "Agent 37 Inc." and "(Agent37.com Inc)" both appear.
   - Reading: the DPA is the most specific legal document; use **Agent37.com Inc (Delaware)** and note the Terms' variant. Consequence: procurement should ask which name invoices/NDAs use.

4. **Status page uptime vs incident list.**
   - `status.agent37.com`: every component "100% uptime"; "All services are online".
   - Same page: "Some sandboxes are unreachable — Degraded for 3 hours and 44 minutes — Nov 05, 2026" (Europe) and "Degraded for 2 hours and 14 minutes" (India, 11 Nov), inside a list of 8 incidents: 20 Oct, 29 Oct, 5 Nov, 10 Nov and four on 11 Nov.
   - Reading: the headline is rounded/reset, not a 30-day calculation (3 h 44 m alone is ~0.5% of 30 days). Treat the incident list as the record.

5. **SOC 2 status.**
   - `/privacy`: "Our SOC 2 Type I report and our SOC 2 readiness report are available … Our SOC 2 Type II is in progress"
   - `/cloud`: "SOC 2 Type I and readiness reports on request."
   - `trust.agent37.com/compliance`: "SOC 2 — In progress" (and "GDPR — In progress").
   - Reading: Type I complete, Type II in progress; the Trust Center row is coarse. Pre-existing, still live.

6. **Deleting a dashboard-hosted (Personal) instance.**
   - `/privacy` §9: "Deleting a dashboard hosting instance keeps its data so support can restore it; email us to have it removed sooner."
   - `/dpa` §9: "When Customer deletes an instance, its storage is erased at once and its backups are permanently deleted after 7 days."
   - Reading: the DPA describes Cloud instances; the Personal dashboard product still keeps deleted data until asked. A privacy-relevant exception, not a Cloud behaviour.

7. **How many app integrations?**
   - `/docs/agents-api/integrations`: "250+ other apps".
   - `/cloud`: "Connect Gmail, Slack, Notion, and 1000+ apps."; `/personal`: "1,000+ app connections via Composio".
   - Reading: docs quote a curated catalog, marketing quotes Composio's total. Cite the marketing number only with "via Composio".

8. **$5 credit eligibility wording.**
   - `/docs/agents-api/billing`: "Add a card … and your workspace gets a one-time $5 credit"; "a workspace created by `POST /v1/signup` never receives it."
   - `/pricing`: "New **eligible** accounts get $5 starter credit after adding a card."
   - `/docs/agents-api/signup`: "An account created by `POST /v1/signup` does not receive the one-time $5 starter credit."
   - Reading: "eligible" is the docs' enumerated exclusion (first card, no prior top-up, not signup-API), not an unpublished discretionary test. Keep the docs' detail.

**Resolved since baseline:** the 4-vCPU ceiling contradiction. `instance-sizing` still says 4, the VM page no longer prices 8/16, and `/benchmarks` says "Agent37 sandboxes go up to 4 vCPU." Remove the profile caveat "The vCPU ceiling contradicts itself".

## 5. Important new products and surfaces the 16 features / 78 capabilities miss

These are documented now and absent from the 2026-10-28 ledger. The ledger is not proof of launch date; where a date is known I give it.

1. **Skills marketplace + Creators payouts** (`/skills`, `/creators`). A third business line: an index of public Claude skills and a hosted way to sell them. `https://www.agent37.com/skills` — "Search 386,312+ skills from GitHub" · "Indexed from public GitHub repositories · Synced daily · Ranked by stars, forks, and recent activity". `https://www.agent37.com/creators` — "Upload your skill. We host it, handle payments, and give you a shareable link. You keep 80%." · "Built-in free trials" · "No credit card required". Users do not need a Claude account or local install; Agent37 runs the skill. This is a consumer/creator marketplace, not a sandbox API, and no feature or capability row covers it.
2. **White-label dashboard starter kit** (`/docs/agents-api/white-label`, `github.com/agent37-platform/starter-kit`). "A white-label, multi-tenant agent dashboard built on the Agent37 API. Fork it, point it at your key, rebrand it, and ship the fastest way to put Agent37 in front of your users." Next.js + Supabase, `npm run setup`, workspace/team/invite, per-agent Chat/Files/Messaging/Integrations/Settings, instance CRUD, budgets, usage. Formerly the `whitelabel` repo. This is the "sell agents to your own customers" route the Cloud API previously left to the buyer.
3. **Open Instinct** (`/open-instinct`, `github.com/agent37-platform/open-instinct`, MIT). "Launch your own Instinct." A complete iMessage subscription business: Stripe checkout/billing portal/webhooks, Photon iMessage, one private agent per customer, web chat, `/admin` with MRR and per-customer Agent37 cost, setup driven by a coding agent. Published unit economics: "Each agent is 2 vCPU, 4 GB RAM and 6 GB disk" · "$4.94/mo if it ran all month. It sleeps when nobody is texting, and a sleeping agent costs $0.54/mo." · model cap "$10 by default".
4. **Minions** (`github.com/agent37-platform/minions`, MIT, `npx minionsai`). "Mission Control for Hermes Agent" — kanban task board, autonomous execution, review queue, live streaming, per-task model/effort, scheduled tasks, file browser, local SQLite, "Hosted access option on Agent37". Pushed 2026-11-12; no page on agent37.com yet (404 at `/minions`), so it is a GitHub-only product today.
5. **`agent37-omnara` system template.** The public templates repo lists it as "an [Omnara](https://docs.omnara.com) pool's default", but the docs catalog still shows 11 templates and never mentions Omnara. Either a pre-release template or a docs gap; do not add it to the catalog count without a docs page.
6. **App integrations API** (`/docs/agents-api/integrations`). Managed Composio per instance: one entity per instance, 250+ apps in the docs (marketing says 1,000+), OAuth connect flow over the Sandbox API, multiple accounts per toolkit, connections survive stop/start/update. Browsing/connecting/listing/disconnecting are **free**; runtime tool calls meter at $0.000114. This is a real "connect Gmail/Slack/Notion" product, not just an env-var MCP URL.
7. **iMessage / phone identity** (`/docs/agents-api/imessage`). Each agent can get its own iMessage line, email address and phone calls through **Inkbox** (or Photon), with signed webhooks that wake a sleeping instance. The guide's cost note: `public_ports` on 8765 + `auto_sleep` + a budget is the intended shape. This is a new reachability channel beyond HTTPS/SSH and is not represented in `reaching-it`.
8. **Messaging channels** (`/docs/agents-api/messaging`). Telegram, WhatsApp, Slack, Discord and "two dozen more" chat apps from your own backend; Personal Basic+ includes them. Also not in `reaching-it`.
9. **Wallet API** — `GET /v1/billing` (balance, tier, instance ceiling, refill rule, `past_due`) and `POST /v1/billing/top-up` (Stripe Checkout URL, $5–$10,000). Previously dashboard-only.
10. **Instance events API** — `GET /v1/instances/{id}/events?from=&to=` returns `instance.started|woke|slept|stopped`, read from the same meter as the bill; recorded from **2026-11-08**, 90-day window. The closest thing to an audit trail, but not who-did-it.
11. **SSH key API** — `POST/GET/DELETE /v1/ssh-keys`, 7 key types, dashboard "Cloud API → Settings → SSH access". A teammate's key can be enrolled and rotated from CI.
12. **API key expiry** — a key can carry an end date in the dashboard, in addition to the 20-entry IP allowlist; after the date it returns the same 401 as a revoked key.
13. **Template revisions and cloud builds** — build context ≤1 GB, `secrets`, `registry_auth`, immutable revisions, release history, `@<tag>`/`@<revision>` pins, and `update` can **migrate an instance onto a different template** while keeping data. The `templates` capability row is still `yes` but its note ("pinned by digest") understates this.
14. **Boot hooks** — `~/.agent37/hooks/post-restart.sh` (every boot, 5 min) and `post-image-update.sh` (after an image change, 15 min) re-run installs that the OS layer reset. This is the documented answer to "my apt packages vanish on update" and belongs in `lifecycle`/`storage` prose.
15. **Startup credits** — "Up to $10,000 in credits for startups. $1,000 to start, then we match what you spend." Gated behind a call, not self-serve; a separate trial input from the $5 card credit.
16. **Public benchmark pages** (`/benchmarks`, `github.com/agent37-platform/computesdk-benchmarks`, `.../hpc-sandbox-benchmarks`). First-party, dated 3 Nov 2026, with honest caveats: "Agent37 sandboxes go up to 4 vCPU. The build benchmark asks for 8, so our builds ran on half the cores most providers had." · "Two of five Performance builds ran out of memory and one standard build timed out." · "Our best disk results may include host caching. Read them as an upper bound." Claims: $0.99 per 1,000 builds, #1 disk random reads (VM), #1 disk sequential writes (default), #7 Node.js CPU (VM). Useful as a cross-check, but it is the provider benchmarking itself.
17. **QM landing page** (`/qm`) — "YY Combinator's agent harness" (sic) · "An AI agent for every person and project, in Slack and on the web. We handle the hosting." A customer/partner page showing Agent37 as YC's QM hosting backend, not a new Agent37 product.
18. **White-label clause in the Terms** — "You are welcome to build the Service into your own product, including giving your end users white-labeled agents on their own instances. Your end users are your customers, not ours". This is the contractual permission for the marketplace/white-label push; the old "resell bare access" restriction remains.
19. **Support surface** — `support@agent37.com` (backups off), `info@agent37.com` (terms, security, deletion, abuse), `vishnu@agent37.com` (capacity, residency, Performance), dashboard chat via **Crisp** (France, new subprocessor). No ticketing portal, hours or response target.

## 6. Profile prose that is now wrong (not just rows)

- `whatItIs`: "two products under one brand" — there are now at least four commercial surfaces (Cloud API, Personal agents, Skills/Creators marketplace, white-label starter kit) plus MIT reference apps. The paragraph still describes Cloud and Personal correctly but reads as complete when it is not.
- `oneLiner`: "sold two ways: a prepaid Cloud API and a one-click personal-agent subscription" — still true of the sandbox business, but no longer of the company. If the parent wants the profile to match the homepage ("The Cheapest Sandbox for Agents", "Host any agent"), add the marketplace/white-label line or accept the narrowing.
- `usability.signup`: "The personal free plan needs no card." — **now false**; `/personal` says "One agent, with a card on file (nothing is charged)."
- `usability.docs`: "over 60 pages" — now 86 doc links / 830 KB bundle; "over 60" is still true but understates. Support is no longer only a founder's email: `support@agent37.com`, Crisp chat, `info@`, `vishnu@`.
- `usability.tripsUp`: "Two dashboards and two products share one brand" — now more; "the pricing page covers only the Cloud one" is still true.
- `strengths`: "Cheapest always-on 4 vCPU box of the seven at about $10.60 a month." — **"of the seven" is stale** (16 providers) and the absolute claim is false across the current set: Contabo B $6.60, TierHive B $6.11, OVHcloud B $10.00 all undercut $10.60 (VPS, not sandboxes). Scope it to "sandbox providers" or drop "cheapest".
- `strengths`: "Managed hosting is the only genuinely one-click personal agent in this set." — not re-verified against all 16 in this thread; leave only if the parent is confident.
- `caveats[0]` "The vCPU ceiling contradicts itself" — **resolved**; delete it.
- `caveats[1]` battleships.dev "snapshot: mem" — still true; keep.
- `caveats[2]` egress — still true; keep (and note `/cloud` now says "Egress is firewalled per sandbox" but still no rate).
- `caveats[3]` dashboard create — still open; the Terms is still the only sentence.
- `caveats[4]` regions/backups — still true; DPA confirms.
- `caveats[5]` "$5 starter credit has moved before" — the number is still $5 in both docs and pricing, but `/pricing` now says "New **eligible** accounts", while billing says any card. Keep as "rechecking" or resolve to "$5, with an eligibility qualifier on the pricing page".

## 7. Files that need edits (for the parent)

### Proposed feature-row text (the eight changed rows)

**sizes-regions** — figure `4 vCPU; three regions` · scenario "Four shapes, 4 vCPU on every type; the EU and India regions need the 2.5× vm type." · note "Four shapes with a 4 vCPU ceiling on every type; 2–80 GB of disk on the default shapes and 2–100 GB on VM and Performance. Three regions; EU and India require the 2.5× vm type."

**trials-free-tiers** — figure `$5 one-off` · scenario "A one-off $5 Cloud credit after adding a card, plus a $0 managed-hosting plan that now also needs a card on file; the credit is not granted to workspaces made through the signup API." · note "A one-off $5 Cloud credit after adding a card, and a $0 managed-hosting plan with a card on file. The credit is not granted to workspaces created through the signup API. Before the first top-up a workspace can run 3 instances of any type, VMs included; 10 after it, 50 at $50 of top-ups, 200 at $250 and 1,000 at $1,000, counting awake instances only. Startups can apply for $1,000–$10,000 in credits."

**company** — figure `Agent37.com Inc (Delaware); no SLA` · scenario "No SLA unless agreed in writing; SOC 2 Type I is available on request under NDA, Type II is in progress, and a DPA with SCCs is published." · note "Agent37.com Inc, a Delaware corporation at 555 S 1st St #521, Harrison, NJ; the Terms still say Agent 37 Inc. and use New York law. Founded 2026 by Vishnu Krishnaprasad (CEO), YC Fall 2026; funding amount not published. DPA (5 Nov 2026) includes SCCs, a 48-hour breach notice, audit rights and named sub-processors OVH and AWS. Status page reports 100% but lists eight incidents since 20 Oct, including 3 h 44 m in Europe and 2 h 14 m in India. No SLA; SOC 2 Type I on request, Type II in progress. Deleted Cloud instances keep a recovery copy 7 days; dashboard hosting is kept until you ask; account data goes within 30 days."

**custom-domains** — figure `Whole domain only` · scenario "Possible only by delegating a whole dedicated domain's nameservers; a subdomain of your existing domain cannot be registered." · note "Custom domains are supported, but only by delegating a whole dedicated domain's nameservers; a subdomain of an existing domain cannot be registered. They unlock at $50 of lifetime top-ups, and you can register 10 per workspace for free."

**outbound-network** — figure `Not published` · scenario "The agent's package downloads go out through the allowlist, and no egress rate or cap is published to price them." · note "Allow-all, deny-all or an allowlist of up to 100 domains and IPv4 addresses, changeable live. Domain entries cover HTTPS on 443 only and wildcard one label; DNS counts as a connection, and private ranges stay blocked. No static egress IP or published egress price."

**keys-secrets** — figure `Yes, env vars` · scenario "The key is an environment variable, so it prints with everything else; the per-instance token only covers four managed services." · note "Instances boot with a per-instance token for four managed services, but there is no general secret manager: your own keys go in environment variables, write-only through the API and encrypted at rest, which the agent can read. Any number of entries, each under 128 KB and 256 KB in total."

**built-in-agents** — figure `7 agents; hosted` · scenario "Seven agent templates plus a separate managed-hosting product where the agent is the product; the templates are prompted through the API." · note "Seven agent templates (Hermes, OpenClaw, Claude Code, Codex, Grok, OpenCode, Pi) plus n8n, and a separate managed-hosting product where the agent is the product. Claude Code and Codex use your own account; Grok uses your xAI key."

**teams-accounts** — figure `Per-instance budget` · scenario "Per-instance budget ceilings stop a runaway instance, but they are not a money cap; no audit log or SSO is published." · note "Workspaces own keys, wallet and instances; admins control instances, keys, billing and the team, while users can only use the workspace's apps and cannot see the dashboard, keys or billing. API keys can carry an IP allowlist and an expiry date; SSH keys are listed and auditable. No audit log or SSO is published, and backups are stored in the US."

### Proposed `changes.json` entry

```json
{
  "date": "2026-11-12",
  "title": "Agent 37 recheck: 100 GB VM disks, a domain allowlist, a DPA and a skills marketplace",
  "provider": "agent37",
  "what": "Rechecked Agent 37 on 12 November 2026. The VM type now sells the same four shapes as the default type, up to 4 vCPU / 32 GB, and every VM or Performance instance can take 2-100 GB of disk, so the old 8- and 16-vCPU rows and the 4-vCPU contradiction are gone. The free tier now runs three instances of any type, VMs included, and counts only awake instances; the 50-instance tier moved from $100 to $50 and a 1,000-instance tier was added at $1,000. The network allowlist now takes domains as well as IPv4 addresses, still up to 100 entries, and custom domains unlock at $50 instead of $100. A DPA dated 5 November names Agent37.com Inc as a Delaware corporation, incorporates SCCs and lists OVH and AWS as instance-server sub-processors. The Terms now explicitly allow white-labelled end-user agents. New surfaces include a skills marketplace with an 80% creator share, a white-label dashboard starter kit, the MIT Open Instinct and Minions apps, wallet top-up and instance-event API endpoints, API-key expiry and SSH-key management. Unit rates are unchanged. The date is when this guide checked it, not a launch date.",
  "sources": [
    {"url": "https://www.agent37.com/docs/agents-api/billing", "quote": "Until your first real top-up, the workspace runs up to three instances at once, of any template, size, or type, VMs included.", "confidence": "docs-confirmed"},
    {"url": "https://www.agent37.com/docs/agents-api/instance-sizing", "quote": "A VM or `performance` instance takes 2-100 GB of disk on every shape.", "confidence": "docs-confirmed"},
    {"url": "https://www.agent37.com/docs/agents-api/instance-network", "quote": "Only the listed domains and IPv4 addresses and ranges, up to 100 entries.", "confidence": "docs-confirmed"},
    {"url": "https://www.agent37.com/docs/agents-api/domains", "quote": "they unlock once your workspace's top-ups total $50", "confidence": "docs-confirmed"},
    {"url": "https://www.agent37.com/dpa", "quote": "Agent37.com Inc, a Delaware corporation", "confidence": "docs-confirmed"},
    {"url": "https://www.agent37.com/terms", "quote": "including giving your end users white-labeled agents on their own instances", "confidence": "docs-confirmed"},
    {"url": "https://www.agent37.com/creators", "quote": "You keep 80%.", "confidence": "pricing-page"}
  ]
}
```

**Date semantics:** advance provider `checkedOn` and pricing `checkedOn` to 2026-11-12 (both sets of sources were reread). Leave `capabilities.json.checkedOn` (2026-10-29) and `usecases.json.checkedOn` alone — they are whole-dataset dates and a single-provider recheck does not justify moving them. Leave `site.json.checkedOn` alone. The rate card is not the oldest (nine cards are 2026-10-29), so advancing it does not move the site-wide "prices checked" date.

### File-by-file

| File | Action |
|---|---|
| `site/src/data/providers/agent37.json` | `checkedOn` → 2026-11-12. Update `sizes` (4 vCPU every type; 2–100 GB VM/Perf), `billing.minimum` (3 concurrent any type), `company.facts` (Delaware/DPA/OVH+AWS/8 incidents), `caveats` (remove vCPU contradiction; add free-tier-VM, entity-name, Personal-delete, SOC 2, integration-count), `strengths` ("of the seven" → current count; add white-label/skills), `sources` (+ `/dpa`, `/benchmarks`, `/skills`, `/creators`, `/open-instinct`, `/docs/agents-api/integrations`), `cost.B.flag`/`cost.C.flag` qualify "on the default type". |
| `site/src/data/features/sizes-regions.json` | note/scenario: 4 vCPU every type; 2–80 default / 2–100 VM-Perf. |
| `site/src/data/features/trials-free-tiers.json` | scenario: Personal free plan now needs a card; note: 3 concurrent any type incl VM, $50/$250/$1,000 tiers, awake-only, startup credits. |
| `site/src/data/features/company.json` | figure/note/scenario: Delaware DPA, SCCs, OVH/AWS, 8 incidents; keep SOC 2 Type I + no SLA. |
| `site/src/data/features/custom-domains.json` | note: $50 unlock, 10 free. |
| `site/src/data/features/outbound-network.json` | note: domains + IPv4, 100 entries, 443-only names. |
| `site/src/data/features/keys-secrets.json` | note: env write-only/encrypted at rest, new 128 KB/256 KB limits, key expiry. |
| `site/src/data/features/built-in-agents.json` | figure "Six templates" → "7 agents"; note six+Pi → seven. |
| `site/src/data/features/teams-accounts.json` | note: `user` cannot see dashboard/keys/billing; key expiry; instance caps awake-only. |
| `site/src/data/capabilities.json` | verdicts: `big-disk` no→yes, `big-machines` partly→yes, `dpa` not-published→yes, `free-tier` no→partly, `fast-start` not-published→no; figures/notes: `egress-allowlist`, `custom-domain`, `no-card`, `status-page`, `open-source`, `roles`, `team-workspace` (URL), `secrets-store`, `scoped-keys`, `templates`, `hosts-other-agents`, `agents-preinstalled` (6→7). |
| `site/src/data/pricing/agent37.json` | `checkedOn` → 2026-11-12; notes: 3 concurrent any type incl VM, 100 GB VM disk, `burstable` gone, no unit-rate change; `shapes` stays the four default shapes (the card has no type dimension). |
| `site/src/data/docs.json` | `outbound-network` title "IPv4 allowlist" → "domain and IPv4 allowlist". |
| `research/agent37.md` | §1 (four surfaces), §3 (4 vCPU every type, boot hooks already), §5 (VM shapes/disk, burstable gone, ceiling resolved), §6 (domain allowlist, $50), §7 (billing/events/SSH-key/integrations endpoints, key expiry), §9 (instance tiers, awake-only, role meaning), §10 (free tier 3, startup credits, Personal Plus models, DPA), §11 (B/C flags conditional), §14 (remove resolved contradiction, add new), §17 (Delaware, address, CEO, DPA, subprocessors, incidents), §16 method. |
| `research/rates/agent37.json` | `plans` (free 3 any type; $50 tier; $1,000 tier; awake-only), `compute.shapeExamples` (VM 4/16 $37.08, 4/32 $66.16; drop 8/16 and 16/32; disk 2–100), `other.custom domains` ($50), `freeTier.personal` (card on file), `diffs` (VM max size resolved; add free-tier-VM, entity, dashboard-delete), remove `burstable` note. |
| `site/src/data/changes.json` | One dated entry: 2026-11-12 — Agent 37 recheck: domain allowlist, 100 GB VM disk, 3-instance free tier, DPA/Delaware, skills/white-label products, 8 incidents. Do **not** date the provider's changes; use the guide's observation date unless a page gives one (DPA/Terms 5 Nov; events 8 Nov; benchmarks 3 Nov). |
| `site/scripts/price-baseline.json` | New money-bearing URLs: `/benchmarks` ($0.0060/h, $0.99/1,000 builds, $0.0121/h), `/open-instinct` ($4.94, $0.54, $25), `/creators` (80%), `/skills` (from $3.99/mo), maybe `/qm` (none). Run `npm run check-rates`, read NEW/OLD, then `--update` only for real pages. |
| `research/capabilities-NOTES-1-machine-money.md` | Supersede item 1 (core ceiling resolved: VM page now 4/16 and 4/32). |
| `research/capabilities-NOTES-3-access.md` | Supersede the $100 custom-domain threshold with $50; add domain allowlist. |
| `research/capabilities-NOTES-4-running-company.md` | Dashboard-create finding still true (Terms is the only sentence); add DPA/audit right. |
| `site/src/pages/compare/side-by-side.astro` | Review only: `kinds` label still "sandbox"; counts 16/78/10 unchanged. No edit needed. |
| `site/src/lib/cost.test.ts` | `agent37 b 30.1` unchanged; no new fixture required (the card cannot express the VM type). Optionally add a comment that B is the default type and 50 GB is also available on a 4/8 VM at $26.50. |

## 8. Verification limits

- **No account, no credential, no sandbox.** Every statement is documentation or a first-party page; nothing is measured. The free-tier 3-instance behaviour, the 100 GB VM disk, the `$50` domain unlock, the `3 h 44 m` status figure and the `$4.94/mo` Open Instinct cost were not exercised.
- The **pricing page is now a client-side comparison app**. Its rendered markdown gives the Agent37 rates and the 31-provider table, but the calculator's default state ("57 hrs", "$0.37") is a UI selection, not a tariff. I read the rate block, not the JS engine.
- **Context screenshots/browser actions were not used**; the pages are static and the markdown was sufficient. If the parent wants visual proof of the new pricing layout, use `agent-browser` on the portal, not this file.
- **`trust.agent37.com` returns 403 to curl**; it rendered through Context. The Trust Center content is unchanged, but its "In progress" row may lag the privacy page.
- **No changelog** exists, so "what changed" is inferred from page diffs, not an official release list. The DPA, Terms, events API, Minions repo and template revisions are dated; the skills marketplace, white-label kit, Open Instinct, domain allowlist and 100 GB disk are not.
- **The 2026-10-28 ledger's own errors** are now visible: `fast-start` said no start time was published while §3 of the same ledger quoted "a few seconds"; `free-tier` ignored the Personal $0 plan; `agents-preinstalled` counted six while listing seven. These are corrections, not provider changes, and are marked as such above.
- **Quote matching**: 94 rows checked, 89 exact after normalisation. The 5 stale quotes are replaced in the rows above. Normalisation: strip HTML tags, markdown link targets, backticks/emphasis, curly quotes, collapse whitespace, lowercase. No ellipses were used inside quotes.

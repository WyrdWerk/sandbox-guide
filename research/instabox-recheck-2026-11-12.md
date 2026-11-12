# InstaBox — fresh desk research

**Checked:** 12 November 2026 (Asia/Calcutta)
**Baseline:** `sandbox-guide` InstaBox data, `checkedOn` 2026-10-28 (rates 2026-10-30)
**Scope:** the 16 features and 78 capabilities the site already models, plus anything important the model does not capture. Read-only desk research; no account, machine, key or billable resource was created. Repo data files were not edited.
**Official starting points:** <https://instabox.sh>, <https://instabox.sh/docs>, <https://instabox.sh/pricing>, <https://instabox.sh/changelog>

**Baseline caveat:** the repo's provider JSON is dated 28 October but already contains the **Builder** plan ($100, 16/32) and a 30 October rate card that contains it, while the changelog dates Builder to **3 November**. Either the date fields are stale or Builder was visible before its announcement. I therefore do **not** count Builder as a new discovery in this pass; the substantive changes are the ones dated after 28 October (GPU, SDKs, MCP, templates, disk allowance, Trust Center).

## Bottom line

InstaBox changed materially in the two weeks since the repo's check. The docs were rebuilt on Mintlify on 6 November and now cover products the site's model has no row for: **NVIDIA L4 GPUs, a Python SDK, a hosted MCP server, Android 14, an Arch/Omarchy desktop, GitHub Actions CI, Docker/OCI image import, native copy-on-write forks, in-place restore, Direct Secrets, agent self-sign-up, webhooks, logs and labels, desktop sharing, and four ADE integrations**. The repo's InstaBox rows are still broadly right on isolation, lifecycle, ports and billing shape, but **9 capability verdicts are now stale** (8 move up, 1 moves down) and the storage pricing model changed: paid plans now include 200 GiB / 1 TiB / 5 TiB of disk, and snapshots and paused memory are free. That invalidates the old "disk beyond 20 GiB bills" assumption behind the B and C storage lines.

## Method and tool log

- Read `AGENTS.md`, the `maintaining-providers` skill, `site/src/data/providers/instabox.json`, all 16 `site/src/data/features/*.json`, all 78 capability definitions and InstaBox rows in `site/src/data/capabilities.json`, `site/src/data/docs.json`, `site/src/data/pricing/instabox.json`, and the four `research/capabilities-NOTES-*.md` files.
- Re-read the live first-party corpus: `llms.txt`, `docs/llms.txt`, `docs/llms-full.txt`, every current `.md` docs page (43 documentation pages plus 86 API-reference entries), `changelog.md`, `blog.md`, `pricing.md`, the OpenAPI 3.1 document at `api.instabox.sh/v1/openapi.json`, Terms, Privacy, Sub-processors and the Vanta Trust Center.
- **Context.dev (`context.web_scrape`) succeeded** and was the primary rendered-page tool: docs index, pricing page, changelog page, homepage, Terms, Privacy, Trust Center, Sub-processors. Pricing, changelog and the account pricing page were re-fetched with `maxAgeMs: 0` (fresh, no cache); the response carried no cache marker.
- **Firecrawl (`firecrawl_scrape`) succeeded** once, on the docs index, and confirmed the new Mintlify navigation (MCP, Direct Secrets, Agent sign-up, Custom images, CI, Android, ADEs, Migrate pages).
- **Plain `curl` succeeded** for every first-party Markdown page (`/docs/*.md`), `llms.txt`, `llms-full.txt`, the OpenAPI JSON, and the Instatus `summary.json`. Mintlify serves stable Markdown, so this is the vendor's own text, not a scraper's rendering.
- **TinyFish, Exa, Tavily and Parallel were not needed**; no call was made, so none is claimed. **Amp native `web_search` / `read_web_page` were not used.** No third-party source is relied on for a verdict.
- Prices: the marketing page and `docs/account/pricing` were both fetched fresh and agree on every plan and unit rate. The marketing page omits the GPU section that the docs page carries (noted below).

## The 16 features

### 1. Isolation — `yes` (unchanged verdict, expanded detail)

**Now:** each machine is a Firecracker microVM with its own kernel, Debian 13 (trixie) amd64, systemd, kernel `6.18.60-instabox`, root and passwordless `sudo` with apt. Docker 29.8.2 with Compose 5.6.0 is in `agent-browser`, `universal`, `t3` and `android`; `herdr` and `orca` ship without Docker. `ci` is Ubuntu 24.04 and `omarchy` is Arch Linux with Hyprland on its own guest kernel. There is **no `/dev/kvm`**, so no nested VMs.

**Evidence:** <https://instabox.sh/docs/account/limits> — "Every template but `ci` (Ubuntu 24.04) and `omarchy` (Arch Linux) is Debian 13 (trixie), amd64, with systemd, on Linux 6.18.60"; "passwordless `sudo` with apt for anything else"; "There is also no `/dev/kvm` in the guest (the kernel is a KVM guest, not a KVM host), so Firecracker, QEMU with KVM, Docker-in-VM runtimes that need it, and nested microVMs cannot run".

**Changed:** verdict unchanged; the template spread (Android/Omarchy/CI), kernel version and explicit "no nested KVM" statement are new detail the repo row does not carry.

### 2. Sizes and regions — `partly` (unchanged verdict, new GPU sizes)

**Now:** fixed pairs only, 2 GiB of RAM per vCPU on the standard sizes: Free 4/8; Pro 2/4, 4/8, 8/16; Builder up to 16/32; Team up to 32/64. Disk 20 GiB fixed on Free, then 200 / 500 / 1,024 GiB. A GPU machine is sized by its GPU count instead: each NVIDIA L4 brings **11 vCPU / 36 GiB**, 1–4 GPUs per machine, 8 per workspace, paid plans only. **No region selector**; a `region` field is refused `400 unknown_field` and the platform decides placement.

**Evidence:** <https://instabox.sh/docs/machines/sizes> — "Run the resize on a stopped machine, and the new size applies at the next start"; <https://instabox.sh/docs/machines/storage> — "You cannot choose a region. A machine has no `region` field, and a `region` in a create request is refused with `400 unknown_field`. The platform decides where a machine runs."; <https://instabox.sh/docs/concepts> — "each GPU brings 11 vCPUs and 36 GiB of memory, so you cannot change the vCPUs or memory yourself".

**Changed:** GPU shapes and the 1,024 GiB disk ceiling are new; the "fixed menu, no region" conclusion is unchanged.

### 3. Lifecycle — `partly` (unchanged verdict, more controls)

**Now:** Running / Paused / Stopped / Deleted. Pause keeps memory and processes and resumes "usually in about a second", but a resume can cold-boot with `processesPreserved: false`; stop keeps files only; a paused machine cannot be stopped. `restart` power-cycles a hung machine, `restore` puts the disks back to a snapshot in place, `--delete-after` deletes and `archiveSeconds` stops at a deadline, and free machines have a **480-minute maximum run** with a 5–20 / 60–75 / 120–135-minute cooldown after successive max-run pauses.

**Evidence:** <https://instabox.sh/docs/machines/lifecycle> — "If a resume cannot bring memory back, the machine starts fresh with its files"; "A paused machine cannot be stopped. Resume or delete it."; <https://instabox.sh/docs/machines/auto-pause> — "Free machines run at most 480 minutes at a time and only an admin changes that; paid machines default to `-1`".

**Changed:** `restore`, `restart`, the cooldown ladder and the now-documented 480-minute free cap are new; pause/stop semantics are unchanged.

### 4. Snapshots and forks — `partly` (unchanged verdict, fork is now native)

**Now:** a snapshot holds installed software and `/data`, never memory or running processes; a running machine can be saved live; `--root-only` saves only software; snapshots survive machine deletion, are shared with the workspace, are free and unlimited on paid plans (5 on Free). A **fork is a native copy-on-write copy of the disks on the source host**, made in a few seconds without a snapshot, of a running or stopped machine, up to 5 at once; it keeps files, template, size, env, Secret selection and labels, but **not memory, processes or published ports**. `restore` rewinds a machine in place and keeps its ID and URLs.

**Evidence:** <https://instabox.sh/docs/machines/fork> — "A fork is a copy-on-write copy of the source's disks: the system disk and `/data`. It is not a live memory fork."; <https://instabox.sh/docs/machines/snapshots> — "The snapshot holds the installed software and the files under `/data`".

**Changed:** fork moved from "snapshot save plus create, a few seconds" to a native host-local COW copy; live snapshot, `--root-only`, in-place restore and OCI import are new. The homepage still lists "Running Processes" under "Fork a machine, mid-run", which the docs deny — contradiction retained.

### 5. Storage — `partly` (unchanged verdict, much larger and now included)

**Now:** one disk per machine, `/data`, 20 GiB default and the home is `/data/home`; paid machines grow it live (no restart) to 200 / 500 / 1,024 GiB and shrink only while stopped when data + 10% (at least 1 GiB) fits. The root disk is template-owned (16 GiB standard, 8 GiB herdr/orca, 24 GiB android/omarchy, 50 GiB ci). No separate volumes, no shared volume, no bucket mount. **Paid plans include disk across all machines — 200 GiB Pro, 1 TiB Builder, 5 TiB Team — then $0.08/GiB-month; snapshots and a paused machine's saved memory are free.** Free has a 200 GiB stored-data cap.

**Evidence:** <https://instabox.sh/docs/account/limits> — "A machine has one disk you size, `/data`."; "The disk grows to 200 GiB on Pro, 500 GiB on Builder, 1024 GiB on Team and Enterprise"; <https://instabox.sh/docs/account/pricing> — "Paid plans include disk across all their machines (200 GiB on Pro, 1 TiB on Builder, 5 TiB on Team); beyond that, allocated /data is billed at $0.08 per GiB-month".

**Changed:** yes — the included-disk allowance is new and replaces the old "first 20 GiB free" reading; live grow/shrink and the 1,024 GiB ceiling are new detail. Still one disk, so the verdict holds.

### 6. Idle timers — `partly` (unchanged verdict, cap is now documented)

**Now:** default idle pause is **30 minutes**; paid plans choose any whole minute 5–30 or `0` (off); Free is fixed at 30 and refuses another value. Paid max-run defaults to `-1` (unlimited); Free is capped at **480 minutes** per run, only an admin can change it, and `0` freezes the machine. A max-run pause starts a cooldown (5–20, 60–75, then 120–135 minutes on Free). An **activity lease** (`PUT /v1/machines/{id}/activity-leases/{taskID}`, TTL 30–3,600 s) keeps a silent task awake. Idle-paused machines wake on exec, files, SSH, a public URL, `wake`, or a lease; manually paused/stopped machines do not.

**Evidence:** <https://instabox.sh/docs/machines/auto-pause> — "By default a machine pauses once it has been idle for 30 minutes"; "Free machines run at most 480 minutes at a time"; <https://instabox.sh/docs/account/limits> — "Idle pause | Free: 30 minutes, fixed. Paid plans: 5 to 30 minutes, or off".

**Changed:** the 480-minute cap is back in the docs (the repo's caveat said it had disappeared), and cooldowns/leases are new. Verdict stays `partly` because Free still cannot stay up indefinitely.

### 7. Reaching it — `partly` (unchanged verdict, more doors)

**Now:** up to **16** HTTPS port URLs per machine, public by default or private behind a one-time-shown `?_token=ibp_…` link with a browser cookie, `Authorization: Bearer` for scripts, and token rotation; ports 1024–65535, 5901 and 6768 reserved. **Raw TCP is still a preview**: `--tcp`, admins only, then paid plans only with a per-workspace cap. SSH is a real `ssh` client through an InstaBox gateway with a short-lived certificate, or a pasted `ibssh_…` token valid 7 days by default (up to 30, or never); mosh is relayed. Browser terminal, VNC desktop, local `port-forward`, desktop share links (view-only or control, 60 s–24 h, revocable) and `instabox-port serve` all exist. **No custom domain.**

**Evidence:** <https://instabox.sh/docs/access/ports> — "A machine has up to 16 published ports."; "Raw TCP ports (preview)"; <https://instabox.sh/docs/access/ssh> — "The instabox gateway terminates SSH: `ssh -p <port> <machine-id>@<host>`".

**Changed:** desktop sharing, port-forward to `127.0.0.1`, 7-day SSH tokens and the 16-port cap are new detail; private ports and raw-TCP preview were already in the 29 October notes. Verdict stays `partly` for raw TCP/custom domains.

### 8. Custom domains — `not-published` (unchanged)

**Now:** still no bring-your-own-hostname. The port URL is the fixed vendor shape `https://<port>-<machine id without m_>.<domain>/`; the current OpenAPI `PublicPort` has `port`, `name`, `url`, `machineId`, `access`, `tokenUrl`, `protocol` and `address`, and no `customDomain`/`cname` field; the docs never mention a CNAME. The only "domain" in the API is the platform's.

**Evidence:** <https://instabox.sh/docs/access/ports> — "The URL is `https://<port>-<machine id without m_>.<domain>/`."; OpenAPI `PublicPort` (checked 12 Nov) has no custom-domain property.

**Changed:** no. This is a genuine gap versus Lizard-class products and worth saying plainly in the head-to-head.

### 9. Outbound network — `partly` (unchanged verdict, new speed detail)

**Now:** egress is open by default and metered only beyond a monthly allowance: **100 GiB Free, 1 TiB Pro, 5 TiB Builder, 50 TiB Team**, then **$0.02/GiB**; ingress free. Each machine's send speed is capped at **about 50 Mbit/s (~6 MB/s)** with little burst; downloads into the machine are not capped. There is **no general allowlist, no no-internet mode and no published static egress IP**. Org Secrets' `hosts` scoping is credential scoping, not network policy: "This scopes credential use, not all sandbox network access." The HTTPS proxy intercepts all supported hosts and closes intercepted connections to private addresses, but that is a Secrets-path behaviour, not a firewall for the machine.

**Evidence:** <https://instabox.sh/docs/account/pricing> — "Each plan includes egress every month (100 GiB on Free, 1 TiB on Pro, 5 TiB on Builder, 50 TiB on Team), then $0.02 per GiB."; <https://instabox.sh/docs/account/limits> — "What a machine **sends** is capped at about **50 Mbit/s** (~6 MB/s), with little or no burst".

**Changed:** the egress allowances were already in the 29 October notes; the 50 Mbit/s per-machine cap and the explicit "no region/static IP" silence are newly confirmed. Verdict unchanged.

### 10. Keys and secrets — `yes` (unchanged verdict, Direct Secrets added)

**Now:** two delivery modes. **Proxy Org Secrets** keep the real value out of the machine: the machine sees `ibsec_…`, the outbound proxy swaps it only in HTTPS headers on port 443 to up to 32 exact hosts (or `*`), never in URL parameters or bodies; rotation reaches running machines in about 10 s; `--ai anthropic|openai|gemini|openrouter` scopes a model key to its API host. **Direct Secrets** put the real value in the machine as an env var or a home file (tmpfs, mode 0600, symlinked), for database URLs, SSH keys and login files the proxy cannot carry; 64 references per machine; any code in the machine can read them. The older per-user **Vault** still works alongside. Secrets are selected per machine, can be changed on a running machine, and are audited by name.

**Evidence:** <https://instabox.sh/docs/security/secrets> — "A machine sees each Secret as an environment variable whose value is an opaque placeholder (`ibsec_...`)."; "The proxy … supports HTTPS on port 443 only, and it does not substitute URL parameters or request bodies."; <https://instabox.sh/docs/security/direct-secrets> — "A direct Secret is an Org Secret whose **real value** is put in the machine".

**Changed:** verdict unchanged; Direct Secrets, `--ai` presets, the 64-reference cap, the tmpfs file delivery and per-reference audit are new. The old row's "Version one supports HTTPS on port 443" is now "supports HTTPS on port 443 only" — still accurate.

### 11. Ways to drive it — `yes` (was `partly`; **changed**)

**Now:** dashboard (create, Computer, Ports, Snapshots, Secrets, Webhooks, Metrics, Support, Billing, API keys, CI), REST API with an **OpenAPI 3.1** document, **TypeScript SDK 0.7.0** (`@insforge/instabox-sdk`), **Python SDK** (`instabox-sdk` on PyPI, Python 3.9–3.13, one dependency), CLI (`npm install -g instabox` or `npx instabox@latest`), SSH + mosh through a gateway, browser terminal, VNC desktop with share links, **hosted MCP server** at `https://api.instabox.sh/mcp` (plus a local stdio server and a public docs MCP), webhooks, and a GitHub Actions CI integration. The old row said "No control-plane MCP is published" — that is no longer true.

**Evidence:** <https://instabox.sh/docs/integrations/mcp> — "The hosted server at `https://api.instabox.sh/mcp` is the recommended way to connect."; <https://instabox.sh/docs/python-sdk> — "The Python SDK is [`instabox-sdk` on PyPI]"; <https://instabox.sh/docs/reference/sdk> — "Version 0.7.0 of `@insforge/instabox-sdk`".

**Changed:** **yes — `partly` → `yes`.** MCP and Python SDK are the two missing surfaces.

### 12. Built-in agents — `yes` (unchanged verdict, stronger)

**Now:** `agent-browser` (the default) ships **Claude Code 2.1.288, Codex 0.160.0 and OpenCode 1.19.5** on every template except `ci`; `herdr`, `orca`, `t3`, `universal` and `android` also carry them. The CLI adds a first-class agent surface: `instabox agent prompt <machine> --provider claude|codex -f "…"`, `agent events`, `agent steer`, `agent interrupt`, `agent ls`. A prompt is a turn: one background job running `claude -p --output-format stream-json` or `codex exec --json`, with permissions skipped because the machine is the boundary; conversations live in `~/.instabox/agents/<id>`. Model credentials come from the machine env, Org Secrets or `--env`; the provider does **not** run or bill the model. There is still no HTTP prompt endpoint, no hosted agent run and no managed model credential. No Hermes or OpenClaw template.

**Evidence:** <https://instabox.sh/docs/use-cases/coding-agents> — "`agent prompt` runs Claude Code as a background job in the machine, and you can run Codex instead with `--provider codex`."; <https://instabox.sh/docs/reference/cli> — "Each prompt is a turn: one background job that runs `claude -p --output-format stream-json` or `codex exec --json`, with permissions and sandboxing skipped (the machine is the boundary)."; <https://instabox.sh/docs/account/limits> — "Claude Code | 2.1.288 | every template except `ci`".

**Changed:** verdict unchanged; OpenCode, the `agent` command family and the MCP/skills preinstall are new. `prompt-api` moves `no` → `partly` because prompting is real but CLI-only.

### 13. Teams and accounts — `partly` (unchanged verdict, spend controls confirmed)

**Now:** personal org plus shared workspaces; roles **owner / admin / member**; email invites with a role (default member); every API key belongs to exactly one workspace and reaches nothing outside it; member caps Free 3, paid unlimited; **no per-seat fee**. A hard **spend cap** stops the workspace's machines (`spend_limit_reached`, `instabox workspace spend-cap <usd>|off`), and **usage alerts** email owners/admins at a configurable percent (default 80%), when the allowance is used, on a charge and on a payment failure. **SSO / SAML + SCIM** and **audit logs** are listed only on Enterprise; audit events exist in the API (`org.invite.redeem`, `user.activate`) but there is no published audit-log viewer or export. Data location is US.

**Evidence:** <https://instabox.sh/pricing> — "SSO / SAML and SCIM", "Audit logs", "99.9% SLA" under Enterprise; <https://instabox.sh/docs/security/api-keys> — "`workspace:admin` | a workspace's key only: everything above plus the workspace's members, invites and Secrets"; <https://instabox.sh/docs/account/billing> — "`remainingUSD` | What may still be used this month before machines are stopped, when a spend cap applies".

**Changed:** spend cap and alerts are now documented (the old rows rested on OpenAPI fields); roles now explicitly include owner; no seat fee is confirmed. SSO/audit remain Enterprise-only, so `partly`.

### 14. Billing models — `yes` (unchanged verdict, new allowance and GPU line)

**Now:** monthly plan whose fee is also credit — **Pro $20, Builder $100, Team $500**, Enterprise custom — plus per-second metered usage: **$0.004/vCPU-hour**, **$0.00225/GiB-hour**, **$0.00011/GiB-hour** storage only beyond the plan's included disk, **$0.02/GiB** egress beyond allowance. **Snapshots are free; paused memory is free; disk is included to 200 GiB / 1 TiB / 5 TiB.** GPU is a separate per-second line: **$0.80 per L4 GPU-hour**, on top of the 11 vCPU / 36 GiB the GPU brings (~$0.925/hour all-in per GPU). Alipay is accepted on Pro and Builder; Team needs a card. Credits reset monthly; the plan fee is a floor.

**Evidence:** <https://instabox.sh/docs/account/pricing> — "Runtime is metered by the second, only while a machine is running. Snapshots are free."; "NVIDIA L4 (`l4`) | $0.80 per GPU-hour | 11 vCPU / 36 GiB | $0.925 per hour"; <https://instabox.sh/pricing> — "Paid plans include disk across all their machines (200 GiB on Pro, 1 TiB on Builder, 5 TiB on Team); beyond that, allocated /data is billed at $0.08 per GiB-month".

**Changed:** the included-disk allowance, free snapshots/paused memory and the L4 rate are new. The marketing page's calculator still shows **$24.82** for 4 vCPU / 8 GiB / 730 h, which is now correct as a runtime-only figure (disk is included) but still omits egress.

### 15. Trials and free tiers — `yes` (unchanged verdict, caps now explicit)

**Now:** a real, non-converting **Free** plan: one 4 vCPU / 8 GiB machine, 20 GiB fixed disk, 5 snapshots, 100 GiB egress/month, 200 GiB stored-data cap, 3 members, 3 starts/minute, 30-minute fixed idle pause, **480-minute max run**, no GPU, templates limited to `agent-browser`, `android`, `omarchy` and `ci` (snapshots unrestricted). No signup credit is published; paid plans' "free credits" are the plan fee itself. Early accounts (registered before 20 Oct, activated before 25 Oct) keep five free sandboxes until **1 December 2026**, then one runs at a time. A card is not mentioned on the Free path, but a free workspace with no card gets `402 payment_method_required` on its machines, so the answer stays "yes, with a caveat".

**Evidence:** <https://instabox.sh/pricing> — "1 machine, 4 vCPU / 8 GiB", "20 GiB disk (fixed)", "5 snapshots", "100 GiB egress / month"; <https://instabox.sh/docs/account/limits> — "Stored data cap | 200 GiB"; "Max run | Free: 480 minutes at a time, fixed".

**Changed:** the 480-minute cap, 200 GiB stored cap and the four-template Free restriction are now published; the five-sandbox grace period is new. Verdict unchanged.

### 16. Company — `partly` (unchanged verdict, much stronger evidence)

**Now:** **InsForge AI, Inc.**, a Delaware corporation; InstaBox is a product line. Founded 2025, YC Spring 2026, six people, **$8M seed** announced 29 September 2026 (investors/valuation not disclosed). Public launch **14 October 2026**; pricing **19 October 2026**. A real **status page** now exists at <https://instabox.instatus.com> (components incl. "Boxes", 99.99% uptime, incidents), and the **Trust Center** at Vanta is branded InstaBox: **SOC 2 Type II completed by InsForge, report on request; HIPAA badge, BAA on request**; sub-processor list (AWS us-west-2, Latitude.sh US, GitHub, Vercel, Stripe, WorkOS, PostHog, Loops, Slack, Google Workspace). **99.9% SLA is still Enterprise-only**, with no credits, measurement method or exclusions published; Team says "SLAs" with no figure. **No customer DPA** is published — the Privacy Policy only says InsForge maintains DPAs with its sub-processors. Data is US-only. Terms: 30 days' price notice, non-refundable, 12-month liability cap, Delaware law/AAA arbitration, data deleted within 30 days of account deletion and backups within 90.

**Evidence:** <https://instabox.sh/blog/trust-center> — "InstaBox is built by InsForge, which completed a SOC 2 Type II audit. The report is available on request."; <https://instabox.instatus.com> — "status":"UP"; <https://instabox.sh/pricing> — "99.9% SLA"; <https://instabox.sh/terms> — "are stored and processed in the United States."

**Changed:** verdict stays `partly` because the SLA is still Enterprise-only and there is still no customer DPA, but the company's transparency is materially better: status page, SOC 2 Type II, Trust Center, sub-processor page, named entity.

## Summary of feature movement

| Feature | Repo | Now | Movement |
|---|---|---|---|
| isolation | yes | yes | none (detail) |
| sizes-regions | partly | partly | none (GPU sizes, 1 TiB disk) |
| lifecycle | partly | partly | none (restore/restart, 480 cap) |
| snapshots-forks | partly | partly | none (native fork, live/root-only) |
| storage | partly | partly | none (included disk) |
| idle-timers | partly | partly | none (480 documented, leases) |
| reaching-it | partly | partly | none (desktop share, 16 ports) |
| custom-domains | not-published | not-published | none |
| outbound-network | partly | partly | none (50 Mbit/s) |
| keys-secrets | yes | yes | none (Direct Secrets) |
| ways-to-drive | partly | **yes** | **up** |
| built-in-agents | yes | yes | none (OpenCode, prompt CLI) |
| teams-accounts | partly | partly | none (spend cap documented) |
| billing-models | yes | yes | none (disk included, GPU) |
| trials-free-tiers | yes | yes | none (caps published) |
| company | partly | partly | none (SOC 2, status page) |

## Capabilities — all 78

Verdicts use the site's definitions. "Δ" is against the repo's current row: `—` means the **verdict** is unchanged; where the underlying facts moved (included disk, new template, new limit, new price), the Specifics column says so. Only the nine rows marked `↑`/`↓` change verdict.

**Confidence:** every row is `docs-confirmed` or `pricing-page` from the cited first-party page unless the Specifics says **(inferred)**. `not-published` means the question was searched across the docs, OpenAPI, pricing, Terms, Privacy and Trust Center and no first-party answer exists. An inferred `no` rests on the authoritative page where the feature would be documented (create fields, template table, pricing card, OpenAPI schema) plus the absence of any route, field, command or sentence for it.

### Machine and state (29)

| ID | Verdict | Current specifics | Evidence | Δ |
|---|---|---|---|---|
| `own-vm` | **yes** | Firecracker microVM, own kernel, Debian 13 trixie amd64, systemd, kernel 6.18.60. Omarchy has its own guest kernel; Android runs as a container on the machine's kernel. | <https://instabox.sh/docs/account/limits> — "in a Firecracker microVM" | — |
| `root` | **yes** | Root and passwordless `sudo` with apt on every Debian template; `omarchy` uses `sudo` with pacman. | <https://instabox.sh/docs/account/limits> — "passwordless `sudo` with apt for anything else" | — |
| `docker-inside` | **yes** | Docker 29.8.2 + Compose 5.6.0 on `agent-browser`, `universal`, `t3`, `android`; user in `docker` group. `herdr`/`orca` omit Docker; `ci` is a runner image. | <https://instabox.sh/docs/account/limits> — "Docker with Compose" | — |
| `nested-virt` | **no** | No `/dev/kvm` in the guest. Firecracker, QEMU/KVM, Docker-in-VM runtimes and nested microVMs cannot run; QEMU TCG works slowly. | <https://instabox.sh/docs/account/limits> — "There is also no `/dev/kvm` in the guest" | **↓** (was not-published) |
| `custom-image` | **yes** | `instabox snapshot import IMAGE --name N` pulls a Docker/OCI image from a registry into a snapshot; works on every plan; private registries supported; `linux/amd64` only; `ENTRYPOINT`/`CMD` run as `instabox-image.service`; `--no-entrypoint` skips it. Local-only images must be pushed first. | <https://instabox.sh/docs/machines/custom-images> — "An import turns a Docker or OCI image from a registry into a snapshot" | **↑** (was partly/operator-built) |
| `any-size` | **no** | Fixed pairs only: Free 4/8; Pro 2/4, 4/8, 8/16; Builder 2/4–16/32; Team 2/4–32/64. Any other pair is `400 spec_not_allowed`. GPU shapes are fixed by GPU count (11 vCPU / 36 GiB each). | <https://instabox.sh/docs/machines/sizes> — "the server refuses any other size with `400 spec_not_allowed`" | — |
| `big-machines` | **yes** | 32 vCPU / 64 GiB only on Team (and Enterprise); Builder tops at 16/32; Pro at 8/16. | <https://instabox.sh/docs/account/limits> — "32 vCPU / 64 GiB" | — |
| `live-resize` | **partly** | Disk grows **while running** with no restart (shrink only stopped, data + 10%). vCPU/RAM change only on a stopped machine and apply at next start; `--restart` automates stop→resize→start but running processes end. Free cannot resize. | <https://instabox.sh/docs/machines/sizes> — "Run the resize on a stopped machine, and the new size applies at the next start."; <https://instabox.sh/docs/account/limits> — "a running machine's disk grows at once, with no restart" | — |
| `gpu` | **yes** | NVIDIA **L4**, 24 GiB per GPU, 1–4 per machine, **8 per workspace**, paid plans only, `gpu` template with CUDA 13.0 + PyTorch 2.8, **$0.80/GPU-hour**. Each GPU brings 11 vCPU / 36 GiB. | <https://instabox.sh/docs/concepts> — "Today the only GPU type is `l4`, the NVIDIA L4 with 24 GiB of GPU memory. A machine can have 1 to 4 of them." | **↑** (was no) |
| `choose-region` | **no** | No region selector, no `region` field, no region list. A create with `region` is `400 unknown_field`; "the platform decides where a machine runs". Sub-processors are US-only (AWS us-west-2, Latitude.sh US). | <https://instabox.sh/docs/machines/storage> — "You cannot choose a region. A machine has no `region` field" | — |
| `eu-region` | **no** | US-only. Terms: sandboxes, disks, snapshots, Secrets and metadata are stored and processed in the United States; sub-processor page lists AWS us-west-2 and Latitude.sh United States. | <https://instabox.sh/terms> — "stored and processed in the United States" | — |
| `pause-memory` | **partly** | Pause keeps memory and processes and resumes "usually in about a second"; but a resume can cold-boot (`processesPreserved: false`, files kept), and a paused machine cannot be stopped. | <https://instabox.sh/docs/machines/lifecycle> — "If a resume cannot bring memory back, the machine starts fresh with its files." | — |
| `warm-pool` | **no** | **(inferred)** No pool of pre-started machines. A create boots a fresh machine; fork copies an existing one. "Dedicated pool or BYOC" is an Enterprise commercial arrangement, not a warm pool. | <https://instabox.sh/pricing> — "Dedicated pool or BYOC" | — |
| `fast-start` | **partly** | Resume is "usually in about a second" — close to but not documented under one. Create is a cold boot ("a few seconds longer than `agent-browser`" for Android); fork takes "a few seconds". | <https://instabox.sh/docs/integrate> — "carries on where it left off, usually in about a second" | — |
| `snapshot-files` | **yes** | Snapshot holds installed software and everything under `/data` (home, workspace, saved sign-ins). Live save of a running machine; `--root-only` saves software only; snapshots survive deleting the machine. | <https://instabox.sh/docs/machines/snapshots> — "The snapshot holds the installed software and the files under `/data`" | — |
| `snapshot-memory` | **no** | Explicit: memory and running processes are not saved; a machine from a snapshot starts without the programs that were running. | <https://instabox.sh/docs/machines/snapshots> — "Memory and running processes are not saved" | — |
| `fork-running` | **yes** | Native `POST /v1/machines/{id}/fork` copies a **running or stopped** machine's disks on its host, copy-on-write, in a few seconds, without a snapshot; source keeps running; up to 5 copies. Memory/processes are **not** copied and the copy cold-boots. | <https://instabox.sh/docs/machines/fork> — "`fork` (or `clone`) copies a running or stopped machine's disks into new machines on its host, in a few seconds and without a snapshot." | **↑** (was partly) |
| `older-snapshot` | **yes** | Any saved snapshot can start a new machine or restore a machine in place; deleting a machine keeps its snapshots; deleting a snapshot does not affect machines made from it. | <https://instabox.sh/docs/machines/snapshots> — "put a machine back to an earlier state when something goes wrong" | — |
| `templates` | **yes** | A snapshot is the reusable template: save once, start any number later on any host, or `fork` for an immediate copy. Custom OCI images also become snapshots. Templates are private/shared with the workspace, not a public catalogue. | <https://instabox.sh/docs/machines/snapshots> — "Set up once, reuse everywhere." | — |
| `backups` | **no** | No scheduled backup. Terms put recovery on the customer: persistent disks and snapshots are the mechanism, "Customer remains responsible for maintaining copies of Customer Data sufficient for its own recovery requirements." | <https://instabox.sh/terms> — "Customer remains responsible for maintaining copies of Customer Data sufficient for its own recovery requirements." | — (now explicit) |
| `files-survive-stop` | **yes** | Stop shuts down; root disk and `/data` stay; next start boots fresh with files. | <https://instabox.sh/docs/machines/lifecycle> — "Stop shuts the machine down. Files stay." | — |
| `volumes` | **no** | **(inferred)** One disk per machine (`/data`), sized with the machine. No separate volume object that outlives the machine and re-attaches; snapshots can seed a new machine but are not attachable disks. | <https://instabox.sh/docs/account/limits> — "A machine has one disk you size, `/data`." | — |
| `shared-volume` | **no** | **(inferred)** A disk belongs to one machine; no attach-detach or multi-attach. | <https://instabox.sh/docs/account/limits> — "A machine has one disk you size, `/data`." | — |
| `mount-buckets` | **no** | **(inferred)** No S3/object-store mount, no NFS, no external filesystem. (Object storage exists only behind snapshots.) | <https://instabox.sh/docs/account/limits> — "A machine has one disk you size, `/data`." | — |
| `big-disk` | **yes** | Up to **1,024 GiB** on Team/Enterprise; 500 GiB Builder, 200 GiB Pro, 20 GiB fixed Free. Grows live, shrinks stopped. | <https://instabox.sh/docs/account/limits> — "1024 GiB on Team and Enterprise" | — |
| `stay-on` | **partly** | Paid: max run `-1` by default (unlimited), idle pause can be `0`/off — can stay up for weeks. Free: fixed 480-minute max run **and** 30-minute idle pause, so it cannot. | <https://instabox.sh/docs/machines/auto-pause> — "Free machines run at most 480 minutes at a time and only an admin changes that; paid machines default to `-1`" | — |
| `choose-idle` | **partly** | Paid: any whole minute 5–30, or `0` off. Free: fixed 30, other values refused. | <https://instabox.sh/docs/machines/auto-pause> — "you choose any whole minute from 5 to 30" | — |
| `wake-on-request` | **partly** | Only an **idle auto-pause** wakes on use (exec, files, SSH, public URL, `wake`, lease); a pause/stop you requested stays offline until resume/start. A private port without its token does not wake it. | <https://instabox.sh/docs/machines/auto-pause> — "A machine that paused **itself**" | — |
| `schedules` | **no** | **(inferred)** No cron/scheduler object for machines or jobs. `archiveSeconds` and `deleteAfterSeconds` are one-shot deadlines, not recurring schedules. | <https://instabox.sh/docs/machines/storage> — "Both deadlines are optional." | — |

### Access (15)

| ID | Verdict | Current specifics | Evidence | Δ |
|---|---|---|---|---|
| `public-url` | **yes** | One HTTPS URL per published port, up to **16** per machine. Public is the default; anyone with the URL reaches the whole service until unpublish. Ports 1024–65535; 5901 (desktop) and 6768 (Orca) reserved. | <https://instabox.sh/docs/access/ports> — "A machine has up to 16 published ports." | — |
| `private-url` | **yes** | `--private` returns a one-time `tokenUrl` with `?_token=ibp_…`; browser gets a `__Host-` cookie, scripts send `Authorization: Bearer ibp_…`; token can be rotated, which kills old links; a request without it gets 401 and **does not wake** the machine. | <https://instabox.sh/docs/access/ports> — "A private port answers only requests that carry its token." | — |
| `ssh` | **yes** | Standard `ssh` through an InstaBox gateway: machine ID as user, short-lived certificate via CLI, or a pasted `ibssh_…` token (7 days default, up to 30, or never). Agent/X11/remote forwarding not supported; local `-L` is. mosh relayed over the same gateway. | <https://instabox.sh/docs/access/ssh> — "The instabox gateway terminates SSH: `ssh -p <port> <machine-id>@<host>`" | — |
| `web-terminal` | **yes** | Dashboard terminal is a WebSocket PTY (`GET /v1/machines/{id}/terminal`); opening it wakes the machine, reconnects do not. Each user gets at most 8 open terminals/desktops. | <https://instabox.sh/docs/api-reference/introduction> — "`GET /v1/machines/{id}/terminal`" (WebSocket, 101) | — |
| `tunnel` | **yes** | `instabox port-forward <machine> 8080:3000` forwards any TCP service to `127.0.0.1` (or `--address`), multiple ports per command, until Ctrl-C. Private to the caller. | <https://instabox.sh/docs/access/ssh> — "A forward reaches any TCP service in the machine" | — |
| `raw-tcp` | **partly** | `instabox port publish <machine> <port> --tcp` gives `port-<id>.<tcp domain>:443` with TLS/SNI, for Postgres/Redis. **Still preview, admins only**; when opened, paid plans only, per-workspace cap (5). Always public; `--private` does not apply. | <https://instabox.sh/docs/access/ports> — "In preview (admins only) until the server opens it to everyone; then paid plans only, up to 5 per workspace." | — |
| `custom-domain` | **not-published** | **(inferred)** No bring-your-own-hostname. The URL is a fixed vendor subdomain; OpenAPI `PublicPort` has no `customDomain` or `cname` property; docs have no domain page; no roadmap. | <https://instabox.sh/docs/access/ports> — "The URL is `https://<port>-<machine id without m_>.<domain>/`." | — |
| `auto-https` | **not-published** | **(inferred)** Every published port is HTTPS on the vendor domain with a vendor certificate, but there is no customer domain to issue/renew for. The capability as defined ("for your domain") has nothing to attach to. | <https://instabox.sh/docs/access/ports> — "A published port gives a web server inside a machine its own HTTPS URL." | — |
| `egress-included` | **yes** | Monthly allowance: **100 GiB Free, 1 TiB Pro, 5 TiB Builder, 50 TiB Team**; then **$0.02/GiB**. Ingress free. | <https://instabox.sh/docs/account/pricing> — "100 GiB on Free, 1 TiB on Pro, 5 TiB on Builder, 50 TiB on Team), then $0.02 per GiB" | — |
| `egress-allowlist` | **no** | **(inferred)** No network allowlist/deny-list. Secret `hosts` constrain where a *credential* may be substituted, not where the machine may connect; `*` is the default. A machine can reach any public HTTPS host. | OpenAPI `Secret.hosts` — "This scopes credential use, not all sandbox network access." | — |
| `no-internet` | **not-published** | No documented "no internet" or isolated-network mode. Machines have outbound access by default; the only restriction is the Secrets proxy's private-address rejection on intercepted HTTPS. | <https://instabox.sh/docs/account/limits> — "Outbound bandwidth" (no off switch) | — |
| `static-ip` | **not-published** | No published outbound address, fixed or shared, IPv4 or IPv6. The docs cover only the 50 Mbit/s cap. No outbound address is published at all, so there is nothing to whitelist. | <https://instabox.sh/docs/account/limits> — "What a machine **sends** is capped at about **50 Mbit/s**" | — |
| `secrets-store` | **yes** | Org Secrets, two modes: proxy (machine sees `ibsec_…`, real value injected by proxy) and direct (real value as env var or tmpfs file). Per-machine selection, `all`/`none`, `.env` import, rotation, 64 KiB value, 32 hosts, 64 direct refs. Legacy per-user Vault still works. | <https://instabox.sh/docs/security/secrets> — "A machine sees each Secret as an environment variable whose value is an opaque placeholder (`ibsec_...`)." | — |
| `hidden-secrets` | **yes** | Proxy mode: the real key never lands on the machine's disk or in snapshots; the machine holds only a placeholder. Coverage is **HTTPS on port 443, header values only** — not URL parameters, bodies, HTTP, or QUIC/HTTP3 (must disable QUIC in Chromium). | <https://instabox.sh/docs/security/secrets> — "The real key never lands on the machine's disk or in its snapshots." | — |
| `scoped-keys` | **yes** | Scopes `machines:read`, `machines:write`, `machines:delete`, `images:read/write/delete`, `workspace:admin`; write/delete include read; a key is bound to exactly one workspace and cannot create keys. 20 active keys/account; optional expiry. | <https://instabox.sh/docs/security/api-keys> — "A scope limits what a key can do" | — |

### Running it (15)

| ID | Verdict | Current specifics | Evidence | Δ |
|---|---|---|---|---|
| `dashboard-create` | **yes** | Full console: create from template (incl. GPU type/count), Computer tab, Ports, Snapshots, Secrets, Webhooks, Metrics, Support, Billing, API keys, CI. | <https://instabox.sh/docs/concepts> — "In the dashboard, pick the `gpu` template, then the GPU type and count." | — |
| `cli` | **yes** | `instabox` CLI via `npm install -g instabox` or `npx instabox@latest`; login, create, exec/stream/background, jobs, agent, files, ssh/mosh, snapshot, restore, fork, port, keys, usage, workspace, webhooks, ci, mcp init. | <https://instabox.sh/docs/quickstart> — "The command signs you in, installs the `instabox` CLI" | — |
| `python-sdk` | **yes** | `instabox-sdk` on PyPI, Python 3.9–3.13, one dependency (`httpx`), imports as `instabox`. Covers machines, exec, files (incl. streams/upload/download), snapshots, templates, lifecycle. | <https://instabox.sh/docs/python-sdk> — "The Python SDK is [`instabox-sdk` on PyPI]" | **↑** (was partly: a single mention, no package) |
| `ts-sdk` | **yes** | `@insforge/instabox-sdk` **0.7.0** on npm; `Sandbox` class with create/connect/list, commands, files, desktop, metrics, usage, snapshots. | <https://instabox.sh/docs/reference/sdk> — "Version 0.7.0 of `@insforge/instabox-sdk`" | — |
| `rest-api` | **yes** | JSON REST at `https://api.instabox.sh`, **OpenAPI 3.1** at `/v1/openapi.json`; idempotency keys, operation objects, scoped keys, `X-Confirm-Delete`, SSE exec, WebSocket terminal/VNC. | <https://instabox.sh/llms.txt> — "every endpoint an API key calls, as OpenAPI 3.1 JSON" | — |
| `mcp-server` | **yes** | **Hosted control-plane MCP** at `https://api.instabox.sh/mcp` (Streamable HTTP, API key, machine tools: list/get/create/exec/read/write/suspend/resume/save_snapshot/list_snapshots/delete/get_usage). Local stdio server via `instabox mcp init`. Separate public docs MCP at `https://instabox.sh/docs/mcp` needs no account. Preinstalled and connected in Claude Code/Codex inside the box. | <https://instabox.sh/docs/integrations/mcp> — "The hosted server at `https://api.instabox.sh/mcp` is the recommended way to connect." | **↑** (was no) |
| `pty` | **yes** | WebSocket PTY at `GET /v1/machines/{id}/terminal`, xterm-256color login shell; also SSH/mosh sessions. Max 8 open terminals/desktops per user. | <https://instabox.sh/docs/api-reference/introduction> — "`GET /v1/machines/{id}/terminal`" under WebSockets | — |
| `file-api` | **yes** | `GET/PUT /v1/machines/{id}/files`, raw bytes, upload to **5 GiB**, signed one-file upload URLs (15 min default, 1 h max), list capped 5,000 entries; CLI `push`/`pull`/`cp`, SDK file APIs, Python `files.upload/download` for whole directories. | <https://instabox.sh/docs/machines/files> — "`push` streams a single file of up to 5 GiB" | — |
| `agents-preinstalled` | **yes** | **Claude Code 2.1.288, Codex 0.160.0, OpenCode 1.19.5** on every template except `ci`; plus the `instabox` CLI, agent skills and the InstaBox MCP already configured in Claude Code/Codex inside the box. | <https://instabox.sh/docs/account/limits> — "Claude Code \| 2.1.288 \| every template except `ci`" | — |
| `prompt-api` | **partly** | `instabox agent prompt <machine> --provider claude` (or `codex`) `[-f] "…"` runs a turn as a background job (`claude -p --output-format stream-json` / `codex exec --json`), with `events`, `steer`, `interrupt`, `ls`, resume and attachments. It is a **CLI feature over exec**, not an HTTP endpoint, SDK method or MCP tool; you still supply the model key. | <https://instabox.sh/docs/reference/cli> — "Drive a coding agent (Claude Code or Codex) inside a machine." | **↑** (was no) |
| `one-click-hermes` | **no** | **(inferred)** No Hermes template, guide, image or CLI shortcut anywhere in docs/templates. | <https://instabox.sh/docs/account/limits> — template table lists agent-browser, universal, t3, herdr, orca, android, omarchy, ci (no Hermes) | — |
| `one-click-openclaw` | **no** | **(inferred)** No OpenClaw template, guide or one-click route. | <https://instabox.sh/docs/account/limits> — same template table (no OpenClaw) | — |
| `browser` | **yes** | Chromium in the Xfce desktop on `agent-browser` (the default), `universal`/`t3` after a ~30 s desktop install, `android`; driven by `sbx.desktop` or the dashboard Computer tab. | <https://instabox.sh/docs/access/desktop> — "A Linux desktop with a browser" | — |
| `desktop` | **yes** | Xfce + VNC on `agent-browser`; Computer tab with human takeover (returns to agent after 1 idle minute / 30 s after tab close); SDK `start/screenshot/click/type/press/scroll/drag`; **share links** view-only or control, 60 s–24 h, revocable, embeddable in an iframe; Omarchy/Hyprland Wayland desktop on its own template. | <https://instabox.sh/docs/access/desktop> — "Click the desktop to take control; it goes back to the agent after a minute idle." | — |
| `hosts-other-agents` | **no** | **(inferred)** No InstaBox page documents a cloud-agent platform using it as its runtime (no Cursor Cloud Agents, Devin, Claude Managed Agents). What exists is the reverse: four **desktop ADEs** — cmux, Orca, Paradev, T3 Code — can connect to a machine over SSH or a plugin and run *their* agents there. That is a client integration, not hosted agent infrastructure. | <https://instabox.sh/docs/use-cases/ade> — "cmux, Orca, Paradev, and T3 Code are four of them." | — (note now distinguishes ADEs) |

### Money, teams and company (19)

| ID | Verdict | Current specifics | Evidence | Δ |
|---|---|---|---|---|
| `team-workspace` | **yes** | Personal org plus shared workspaces; machines, snapshots, Secrets and billing belong to the workspace; members see each other's machines; invites by email; Free 3 members, paid unlimited; **no seat fee**. A workspace can be created on a plan and renamed/deleted. | <https://instabox.sh/docs/reference/cli> — "Machines, snapshots and stored data are counted against an org: your personal org, or a workspace." | — |
| `roles` | **yes** | Three roles: **owner / admin / member**; invitee role defaults to member; only owner/admin manage keys, Secrets, webhooks, billing and workspace settings. API keys are a second, orthogonal permission layer with scopes. | OpenAPI `OrgMember.role` — "Your role in the org." (enum `owner`, `admin`, `member`); <https://instabox.sh/docs/security/api-keys> — "not the owner or an admin of the workspace" | — (specifics expanded from admin/member) |
| `sso` | **partly** | **SSO / SAML and SCIM** are listed only on **Enterprise** (custom price). No self-serve SSO on Pro/Builder/Team; no published IdP list, setup docs or per-seat charge. WorkOS is the auth vendor. | <https://instabox.sh/pricing> — "SSO / SAML and SCIM" (Enterprise card only) | — |
| `spend-cap` | **yes** | A monthly **spend cap** on a paid workspace; when reached, its machines cannot run (`402 spend_limit_reached`), and the error tells you to raise/remove it with `instabox workspace spend-cap <workspace> <usd> or off`. This is a hard stop, not an alert. | <https://instabox.sh/docs/reference/errors> — "its machines cannot run" | — |
| `usage-alerts` | **yes** | Email to owner/admins at a configurable percentage (**default 80%**), when the allowance is used up, on each pay-as-you-go charge and on payment failure; at most once per month/event; can be turned off per alert with `instabox workspace alerts`. | <https://instabox.sh/changelog> — "80% used. Usage has reached 80% of what the month includes" | — |
| `audit-log` | **partly** | **Audit logs** are an **Enterprise** bullet only. The API writes named audit events (`org.invite.redeem`, `user.activate`, Secret reference by name, key lifecycle) and exposes them in error/operation text, but there is no documented customer-facing audit-log page, filter, export or retention period. | <https://instabox.sh/pricing> — "Audit logs" (Enterprise) | — |
| `per-second` | **yes** | Runtime metered by the second, only while `running` (not starting/paused/stopped); rated hourly in arrears. Disk billed by the second while the machine exists, beyond the included allowance. | <https://instabox.sh/docs/account/pricing> — "Runtime is metered by the second, only while a machine is running." | — |
| `active-cpu` | **no** | You pay for the **allocated** vCPUs and memory for every running second, whether the CPU is busy or idle. There is no CPU-utilization meter or burst/credit model. A waiting machine costs the same as a busy one of its size. | <https://instabox.sh/docs/account/pricing> — "While a machine is running, you pay for the vCPUs and memory you gave it." | — |
| `cheap-pause` | **yes** | Paused/stopped pays disk only; **paused memory is explicitly free**; snapshots free; the first 200 GiB/1 TiB/5 TiB of disk is included, so most paused machines bill **$0**. Manual pause does not wake on a URL, but the disk charge is the only one. | <https://instabox.sh/docs/account/billing> — "The system disk, snapshots, and a paused machine's saved memory are free." | — |
| `no-monthly-fee` | **no** | There is a real Free plan, but anything beyond one 4/8 machine needs **Pro at $20/month minimum** (Builder $100, Team $500). The fee is also credit, not pure pay-as-you-go. | <https://instabox.sh/pricing> — "**$20**/month" | — |
| `flat-price` | **no** | The bill is `plan fee + vCPU-hours + GiB-hours + disk overage + egress overage + GPU-hours`; no flat per-machine or per-month all-in price. | <https://instabox.sh/docs/account/pricing> — "You pay for a machine's vCPUs and memory only while it runs" | — |
| `free-tier` | **yes** | Permanent Free plan, no conversion: 1 machine, 4 vCPU / 8 GiB, 20 GiB fixed disk, 5 snapshots, 100 GiB egress/month, 200 GiB stored-data cap, 3 members, 30-min idle pause, 480-min max run, no GPU. | <https://instabox.sh/pricing> — "1 machine, 4 vCPU / 8 GiB" | — |
| `free-credit` | **no** | **(inferred)** No signup credit or trial balance. "Free credits" on Pro/Builder/Team are the plan fee converted to usage each month, not a one-off grant. Credits reset monthly and unused credit expires. | <https://instabox.sh/docs/account/pricing> — "Usage comes out of your included credits first, then you pay as you go. Credits reset every month." | — |
| `no-card` | **yes** | Free is `$0` with "Get started"; no card is requested in the documented free path. Caveat retained: a free workspace with no card on file can get `402 payment_method_required` ("A free workspace has no card on file, so its machines cannot run"), so some accounts may be asked. Paid plans subscribe by card (or Alipay on Pro/Builder). | <https://instabox.sh/pricing> — "1 machine, 4 vCPU / 8 GiB"; <https://instabox.sh/docs/reference/errors> — "A free workspace has no card on file, so its machines cannot run." | — (least certain yes) |
| `status-page` | **yes** | Public Instatus page at **<https://instabox.instatus.com>**, linked from the site footer as "All systems operational". Components include **Boxes**, API, Dashboard, GitHub upstream; per-component uptime (Boxes 99.99% in the checked window), incident history with updates, subscribe by email/Slack/Discord/webhook. | <https://instabox.instatus.com/summary.json> — `"name":"instabox" … "status":"UP"`; footer — "All systems operational" | **↑** (was not-published; `status.instabox.sh` still does not resolve — the page is on instatus.com) |
| `sla` | **partly** | **99.9% SLA** only on **Enterprise** (custom); Team says "Priority email support & SLAs" with no figure; Pro/Builder/Free none. Still **no service-credit schedule, measurement method, exclusions or remedy** published. Terms disclaim uninterrupted service. | <https://instabox.sh/pricing> — "99.9% SLA" (Enterprise) | — |
| `soc2` | **yes** | **SOC 2 Type II completed** by InsForge, Inc.; the report is available **on request** (email `support@instabox.sh`). Trust Center shows SOC 2 + HIPAA compliance, controls and sub-processors. The report is InsForge's; the Trust Center presents it for InstaBox, but the report scope itself is not public. | <https://instabox.sh/blog/trust-center> — "InstaBox is built by InsForge, which completed a SOC 2 Type II audit. The report is available on request." | **↑** (was not-published) |
| `dpa` | **not-published** | No customer-facing DPA document or download is published, and no DPA is referenced in the Terms or signup docs. The Privacy Policy says InsForge maintains **DPAs with its sub-processors**, and offers SCCs for transfers, but not a DPA it offers to customers. Enterprise buyers would have to ask. | <https://instabox.sh/privacy> — "We maintain data processing agreements with our sub-processors" | — |
| `open-source` | **no** | **(inferred)** Hosted service only; no self-host path, no open-source runtime, no public repo for the sandbox stack, no licence published. The docs are Markdown but the product is proprietary. | <https://instabox.sh/docs> — "InstaBox gives each agent a full Linux VM in the cloud" | — |

## New and uncaptured (what the 16 features + 78 capabilities miss)

These are ordered by how much they should change the head-to-head. "Covered by" means an existing row now carries part of it; "No row" means the model cannot express it at all.

### Genuinely new products

1. **NVIDIA L4 GPU machines** — `gpu` template, 1–4 L4s per machine (24 GiB each), 8 per workspace, paid plans only, **$0.80/GPU-hour** on top of the 11 vCPU / 36 GiB each GPU brings; CUDA 13.0 and PyTorch 2.8 preinstalled; `nvidia-smi` from the host. Covered by `gpu` (now `yes`), but the feature list has no GPU row, so the comparison UI will not surface it unless the parent adds one or puts it in `sizes-regions`. **This is the single biggest capability change since 28 October.**
   - <https://instabox.sh/docs/concepts> — "Today the only GPU type is `l4`, the NVIDIA L4 with 24 GiB of GPU memory. A machine can have 1 to 4 of them."
   - <https://instabox.sh/docs/account/pricing> — "NVIDIA L4 (`l4`) | $0.80 per GPU-hour | 11 vCPU / 36 GiB | $0.925 per hour"

2. **Python SDK** — `instabox-sdk` on PyPI, Python 3.9–3.13, `httpx` only, imports as `instabox`; machines, exec, files (including streaming and directory upload/download), snapshots, templates, lifecycle. Covered by `python-sdk` (now `yes`); no feature-level mention.
   - <https://instabox.sh/docs/python-sdk> — "The Python SDK is [`instabox-sdk` on PyPI]."

3. **Hosted MCP server** — `https://api.instabox.sh/mcp` (Streamable HTTP, API key, machine tools), plus `instabox mcp init <client>` for a local stdio server, plus a public no-auth docs MCP at `https://instabox.sh/docs/mcp`. Claude Code, Cursor, Codex, OpenCode and Antigravity are supported; the box ships with the MCP already connected for Claude Code/Codex. Covered by `mcp-server` (now `yes`).
   - <https://instabox.sh/docs/integrations/mcp> — "The hosted server at `https://api.instabox.sh/mcp` is the recommended way to connect."

4. **Android 14 template** — `android` runs Android as a **container on the machine's own Linux kernel**, no emulator and no nested VM; `adb` inside the box; phone window on the Computer tab; pause/fork work; every plan including Free. Limits: no Google Play/services, x86_64 only (no ARM translation), software rendering. **No capability row.**
   - <https://instabox.sh/docs/use-cases/android> — "Android runs as a container on the machine's own Linux kernel, with no emulator and no nested VM."

5. **Omarchy desktop template** — Arch Linux + Hyprland (Wayland), logged in from boot, own kernel `6.18.60-instabox-drm`, `sudo pacman -S`, every plan including Free; **no computer-use agents** preinstalled. **No capability row.** Relevant because it is the first non-Debian, non-Xfce desktop.
   - <https://instabox.sh/docs/account/limits> — "Arch Linux with [Omarchy]: its Hyprland desktop (Wayland, on the Computer tab) … Every plan, free included; no computer-use agents"

6. **GitHub Actions CI** — install the `instabox-cloud` GitHub App, change `runs-on` to `instabox-small|medium|large|xlarge|2xlarge`; each job gets a fresh Ubuntu 24.04 machine built from GitHub's `ubuntu-24.04` runner image, deleted at the end, and **uses no GitHub Actions minutes**. Jobs can start from a `ci`-template snapshot (`instabox-medium-snapshot-NAME`) for warm repos/toolchains/caches; snapshots only in private repos with fork-PR workflows off; refresh the runner snapshot monthly. Any other CI can call `instabox run --push . --timeout 10m`.
   - <https://instabox.sh/docs/use-cases/ci> — "Each job with this label gets a fresh Ubuntu 24.04 machine that has the tools of GitHub's `ubuntu-24.04` image, and the machine is deleted when the job ends."
   - **No capability row.** This is a distinct product surface (CI runner), not "ways to drive".

7. **ADE integrations** — cmux (one-link workspace), Orca (plugin creates/pauses/deletes machines, `orca` template), Paradev (SSH host), T3 Code (`t3` template); the `orca` and `t3` templates are the matching images, and `herdr` is the other agent-specific image. **No capability row**; `hosts-other-agents` is the wrong bucket (these are clients, not hosted agent platforms).
   - <https://instabox.sh/docs/use-cases/ade> — "cmux, Orca, Paradev, and T3 Code are four of them."

8. **Desktop share links** — `POST /v1/machines/{id}/desktop/stream` returns a full-screen viewer URL, view-only by default or control with `viewOnly: false`, TTL 60 s–86,400 s (1 h default), revocable, embeddable in an `<iframe>`; only the machine's creator (or their personal key) can make/revoke them, workspace keys get 403. **Partially covered by `desktop`**, but it is a separate collaboration surface worth a sentence.
   - <https://instabox.sh/docs/access/desktop> — "`streamUrl()` makes a link to a full-screen viewer of one machine's desktop, and the link works without signing in."

9. **Agent self sign-up** — `instabox login --agent` prints a claim page and a short code; the owner approves from any device (`instabox claim CODE` or dashboard), can trim scopes/expiry, or deny. The agent holds an ordinary API key of the owner's account; default scopes `machines:read machines:write machines:delete images:read`; code valid 24 h. **No capability row** (closest is `scoped-keys`, but this is onboarding).
   - <https://instabox.sh/docs/security/agent-sign-up> — "An agent with no browser signs itself up; the account owner approves later with a code."

10. **Webhooks** — signed POSTs (Standard Webhooks, `whsec_…`) on `sandbox.created/started/stopped/suspended/error/deleted`, `snapshot.created/failed/deleted`, `webhook.test`; 10 s response deadline; retries 5 s, 5 min, 30 min, 2 h, 5 h, 10 h, 10 h; delivery log 30 days; endpoint disabled after 5 days of failures. **No capability row.**
    - <https://instabox.sh/docs/integrations/webhooks> — "A webhook is a signed JSON request that InstaBox POSTs to your server when a machine or a snapshot changes state"

11. **Logs, labels and history** — `instabox logs` (last 200 console lines + last 20 operations, never wakes), `-f` follow, JSON with cursor; `key=value` labels (`metadata`, 32/machine, filter with `--meta`); `instabox history` and `instabox output` for past execs; `ps`. **No capability row.**
    - <https://instabox.sh/docs/machines/logs-and-labels> — "A machine's logs show what it printed while it booted and what its recent operations did."

12. **Activity leases** — `PUT /v1/machines/{id}/activity-leases/{taskID}` with `ttlSeconds` 30–3600, renew, DELETE; keeps a silently waiting task awake and counts as activity. **No capability row** (relevant to `choose-idle`/`wake-on-request`).
    - <https://instabox.sh/docs/machines/auto-pause> — "To keep the machine awake, you can hold a lease for as long as the task runs."

13. **Environment variables** — up to 128 plain `NAME=value` per machine, 32 KiB, set at create, exported to every login shell, `--env-file`, per-exec `--env`; not secrets; refused names list; no env on Windows. **No capability row.**
    - <https://instabox.sh/docs/machines/environment> — "Environment variables are plain `NAME=value` settings that every shell in a machine gets."

14. **Migrations from Boat, Daytona and E2B** — call-by-call mapping pages (TypeScript and Python), including "what has no equivalent" tables (shared volumes, declarative image builder, sessions, code_run charts, LSP, region targets). **No capability row**, but useful for the head-to-head and for switchers.
    - <https://instabox.sh/docs/migrate/from-e2b>, `/from-daytona`, `/from-boat`

15. **`instabox run` one-shot machines** — `instabox run --timeout 10m -- npm test` creates a machine, pushes the checkout, runs one command, deletes the machine; sets `deleteAfterSeconds` and `archiveSeconds` from `--timeout`; `--fail-fast`; exit codes. **No capability row.**
    - <https://instabox.sh/docs/machines/storage> — "`instabox run` creates a machine for one command and deletes it afterwards."

16. **Devcontainer / setup-file create** — `instabox create --devcontainer [PATH|DIR]` applies `devcontainer.json` (workspace, env, features, lifecycle hooks; image/build not booted); `--setup-file` runs a script at most 64 KB. **No capability row.**
    - <https://instabox.sh/docs/reference/cli> — "`--devcontainer` Apply a `devcontainer.json`"

17. **Data export** — `POST /v1/orgs/{id}/exports` produces a downloadable `<name>-data-<date>.tar.gz` of the workspace's `/data`. **No capability row**; relevant to lock-in and `dpa`.
    - OpenAPI `OrgExport` — "The archive's download name: `<name>-data-<date>.tar.gz`."

18. **Alipay** — Pro and Builder can be paid with Alipay (Stripe, China), renewing monthly; Team requires a card. **No capability row.**
    - <https://instabox.sh/changelog> — "You can now pay for the Pro and Builder plans with Alipay."

19. **Builder plan** — $100/month, 16 vCPU / 32 GiB, 200 concurrent, 1,000 machines, 1 TiB disk included, 5 TiB egress, 50 starts/min. Added 3 November. The repo's provider JSON already knows Builder, but the capability row `big-machines` should be read as "16/32 on Builder, 32/64 on Team".
    - <https://instabox.sh/changelog> — "Builder is a new $100 a month plan between Pro and Team"

20. **Status page + Trust Center + sub-processors** — new since 28 October: Instatus status page, Vanta Trust Center branded InstaBox with SOC 2 Type II and HIPAA, a public sub-processor table, and a Terms/Privacy rewrite dated 9 November. **No feature/capability row** except `status-page`/`soc2`; `company` should absorb the rest.
    - <https://instabox.sh/blog/trust-center>, <https://instabox.sh/subprocessors>, <https://instabox.instatus.com>

27. **Per-box cost breakdown** — the Usage page of a paid workspace lists every sandbox with its compute price, CPU seconds and RAM GB-seconds for the billing period, sortable by price, and **includes deleted sandboxes** (marked "Deleted"). New on 9 November; relevant to chargeback and to anyone running a fleet. **No capability row.**
    - <https://instabox.sh/blog/usage-by-box> — "You can now see exactly how much each box costs, with a detailed breakdown of resource usage and charges."

28. **Docs are a product surface now** — Mintlify rebuild on 6 November: 43 documentation pages plus 86 API-reference entries (the repo's `usability.docs` still says 26 pages), every page as Markdown, a docs assistant on ⌘I, copy/open-in-Claude/ChatGPT, and a **public no-auth docs MCP** at `https://instabox.sh/docs/mcp` with `search_insta_box`, `query_docs_filesystem_insta_box` and `submit_feedback`. The root `llms.txt` is a curated agent index; the root `llms-full.txt` is **not** complete (see contradiction 9). **No capability row.**
    - <https://instabox.sh/docs/integrations/mcp> — "`https://instabox.sh/docs/mcp` is a public MCP server for these docs, so an agent can read them before anything is installed. It needs no account, and it has no access to your machines."

### Documented but not (yet) a public product

21. **macOS and Windows machines** appear only in the **OpenAPI schema**, not in the template table, docs nav, pricing or changelog:
    - `Template.os` enum `["macos","windows"]`, "Absent: Linux"; `pool` for macOS/Windows.
    - `minimum_lease_required`: "A macOS sandbox leases a whole Mac to its workspace for at least 24 hours, billed whatever the sandbox does"; `acceptMinimumLease`, CLI `--accept-24h-minimum`.
    - `template_not_allowed`: "macOS machines need the Pro plan or higher."
    - Environment variables: "macOS and Windows machines take no env (`400 bad_request`)."
    This is enough to say, **(inferred)**, that macOS/Windows are on the API roadmap or in private rollout — not enough to put a verdict, price or availability date in the comparison. Do not invent a launch date. The 24-hour Mac lease is the most consequential fact if it ships: it is a different billing model from per-second Linux.
    - <https://api.instabox.sh/v1/openapi.json> — "A macOS sandbox leases a whole Mac to its workspace for at least 24 hours"

22. **Region blocking at workspace creation** — `POST /v1/orgs` can return `403 permission_denied` "From a region the server blocks". No list of blocked regions is published. This is geo-restriction of *accounts*, not a region selector for machines.
    - OpenAPI — "From a region the server blocks, such an account gets `403 permission_denied`."

### Limits and operational facts the model misses

23. **Hard numbers worth carrying into the comparison:** 20 active API keys; 16 published ports; 32 labels; 8 concurrent terminals/desktops per user; 32 concurrent exec requests; 10 min per command (60 s default); 1 MiB per stdout/stderr without streaming; 5 GiB per file upload; 16 GiB root disk (8 GiB herdr/orca, 24 GiB android/omarchy, 50 GiB ci); 20 GiB `/data` default; 1–1,024 GiB `/data`; 128 env vars / 32 KiB; 64 KiB Secret value; 32 Secret hosts; 64 direct Secret refs; 8 GPUs/workspace; 200 GiB Free stored data; 3 Free members; 3 Free starts/min; 100/200/500 concurrent Pro/Builder/Team.
24. **Security caveats:** no `/dev/kvm`; no kernel tracing (no kprobes/ftrace/BTF; `bpftrace`/BCC/`perf probe` fail); `/tmp` is a quarter of RAM; swapfile is the size of RAM up to 4 GiB and **is carried in snapshots/forks** (zero it before sharing); snapshots contain `/data/home` credentials; public ports are unauthenticated by design; the Secrets proxy MITMs all supported HTTPS hosts, so clients must trust its CA and cannot pin certificates; QUIC/HTTP3 bypasses the proxy; direct Secrets are readable by any code in the box; `exec` output is UTF-8 with 1 MiB caps; `herdr`/`orca` have no Docker.
25. **Free-plan abuse rules:** no proxy/VPN exit, no artificial keep-alive (scheduled pings, externally renewed leases, busy loops), no pause/resume to reset max runtime. Paid plans may run a proxy/VPN for their own traffic. This is new in the 9 November Terms and matters for "always-on agent" comparisons.
26. **Five-sandbox grace period** ends **1 December 2026** for accounts registered before 20 October / activated before 25 October. After that, one Free sandbox runs at a time; the others are paused, not deleted.

## Repo facts now stale beyond the verdicts (for the integration pass)

These are concrete sentences/fields in the current InstaBox data that the live pages contradict. The parent should fix them even where the capability verdict does not move.

1. **`usability.docs`: "26 pages"** → the Mintlify site is 43 documentation pages plus 86 API-reference entries, with an assistant and a docs MCP. The 26-page count described the pre-6-November site.
2. **`company.facts` "Status and SLA": "No status page."** → there is one at <https://instabox.instatus.com>, linked from the footer, with a Boxes component and incident history. The SLA sentence is still right.
3. **`caveats` "No published regions and no status page"** → split: regions still unpublished; status page now published. The `status.instabox.sh` DNS check is still NXDOMAIN, but that is no longer the test — the page is on instatus.com.
4. **`company.facts` "Certification": "The Trust Center lists HIPAA only … No SOC 2 badge."** → the Trust Center now lists **HIPAA and SOC 2**, is branded InstaBox, and the blog says the SOC 2 Type II audit is complete with the report on request. Keep the scope caveat (report not public, entity-level).
5. **`caveats` "An 8-hour free run cap has left the docs"** → it is back: `docs/account/limits` says "Max run | Free: 480 minutes at a time, fixed" and `docs/machines/auto-pause` says "Free machines run at most 480 minutes at a time". The caveat should be closed or reversed.
6. **`caveats` "Docs and API disagree on whether a preview visit wakes a paused machine"** → the OpenAPI sentence is scoped to manual pause/stop/archive; it is not a contradiction with idle auto-pause. Close it and keep the manual-vs-idle distinction in `wake-on-request`.
7. **`billing` "Paused and stopped machines pay GiB-hours for their disk and snapshots"** → snapshots are free; disk is included to 200 GiB / 1 TiB / 5 TiB. Paused memory is explicitly free. The sentence now overstates the bill.
8. **`cost` A/B/C storage lines** → the 20 GiB disk is inside the included allowance on Pro. The lines should be re-derived (see Rate inputs).
9. **`sources`** → point at the canonical new pages (`/docs/account/limits`, `/docs/machines/lifecycle`, `/docs/machines/snapshots`, `/docs/machines/fork`, `/docs/access/ports`, `/docs/security/secrets`, `/docs/security/direct-secrets`, `/docs/integrations/mcp`, `/docs/python-sdk`, `/docs/account/pricing`), not the aliases. Add the status page, Trust Center and sub-processor page to `company`.
10. **`docs.json`** → `ways-to-drive` should point at MCP/SDK/Python, `built-in-agents` at coding-agents + limits, `keys-secrets` at secrets + direct-secrets, `teams-accounts` at api-keys + billing, and `sizes-regions` at sizes + limits. The old titles ("TypeScript, HTTP and CLI", "no managed agent hosting") are now incomplete.

## Rate inputs that changed (no full recalculation)

| Input | Repo (30 Oct) | Live (12 Nov) | Effect |
|---|---|---|---|
| Included disk, Pro | first 20 GiB free, then $0.00011/GiB-h | **200 GiB included**, then $0.08/GiB-month | 20–200 GiB no longer bills |
| Included disk, Builder | (not modelled) | **1 TiB included** | new |
| Included disk, Team | (not modelled) | **5 TiB included** | new |
| Snapshots | implied GiB-hours in provider text | **free** | remove any snapshot storage line |
| Paused memory | not billed | **not billed** (explicit) | unchanged |
| GPU | none | **$0.80/L4-GPU-hour**, 11 vCPU / 36 GiB per GPU | new line |
| Egress | $0.02/GiB, 100 GiB–50 TiB included | same | unchanged |
| vCPU / RAM | $0.004 / $0.00225 | same | unchanged |
| Plans | $20 / $100 / $500 | same, plus Alipay | unchanged |
| Free caps | 1 machine, 4/8, 20 GiB, 5 snapshots, 100 GiB egress | same + **200 GiB stored**, **480-min max run**, **3 members**, **3 starts/min**, 4 templates | more explicit |

**Arithmetic consequence, not a re-derived card:** the repo's A/B/C storage lines (`20 GiB × $0.00011 × hours`) are now inside the included 200 GiB and should fall to $0. That alone would take the old A from $3.20 to **$2.83**, B from $27.23 to **$24.82**, and C from $3.14 to **$1.53** of usage before the plan floor; the Free nearest-size figures would become **$5.67** (A) and **$3.06** (C). The parent should re-run `engineCase()` and the hand-worked tests rather than bless these four numbers; the point here is that the storage input changed, not that the card is final. The marketing calculator's **$24.82** for B is now the runtime-only figure and agrees with this consequence.

## Contradictions and open questions

1. **Fork and running processes — still contradictory, and now sharper.** Homepage: "Fork a machine, mid-run … Copy a running machine in seconds … Running Processes". Docs: "A fork is a copy-on-write copy of the source's disks … **It is not a live memory fork. Memory and running processes are not copied.**" The docs are authoritative; the homepage's "Running Processes" bullet is wrong as written. Keep the caveat, update the quote to the fork page.
2. **Free "no usage limit" vs 480-minute max run.** The 19 October pricing blog still says "Free gives you one 4 vCPU / 8 GB machine with no usage limit" and "Q1: Is there a usage limit on the free machine? No." The current limits page says "Max run | Free: 480 minutes at a time, fixed" and auto-pause says "Free machines run at most 480 minutes at a time". The 480-minute cap is real; the blog is stale. The repo's old caveat ("an 8-hour cap has left the docs") is now **resolved in the opposite direction**: the cap is back, in two current pages.
3. **Preview links and wake — the repo's contradiction is a misread.** The OpenAPI sentence "Preview links remain offline until resumed" follows "Manual pause/stop and archive are never automatically undone." It is about **manual** pause/stop/archive, not idle auto-pause. The docs' "a visit wakes a machine that paused itself for being idle" is consistent. Recommend removing this from the caveat list and keeping only the manual-vs-idle distinction, which is real and buyer-relevant.
4. **Free plan and a card — still open.** Pricing says Free `$0` with "Get started"; the error catalogue still has `payment_method_required` — "A free workspace has no card on file, so its machines cannot run." It may apply only to workspaces that once had a paid plan, or to flagged abuse accounts. One support question settles it; the row stays `yes` with the caveat.
5. **GPU price is only in the docs.** `docs/account/pricing` has the L4 table ($0.80/GPU-hour, $0.925 all-in); the marketing `/pricing` page has **no GPU section**, no GPU in the calculator, and the root `pricing.md` omits it. The docs page is the more current first-party statement; the marketing page is incomplete, not contradictory. Say "published in the docs, not shown on the pricing page".
6. **Team concurrency wording.** `/pricing` says "500 concurrent machines" and "Unlimited machines"; `/docs/account/limits` says "Machines: unlimited" and "Running at once: 500". These are consistent if "machines" means total and "concurrent" means running, but the card's two adjacent lines read as a contradiction. Interpret as 500 running / unlimited total.
7. **Free plan size history.** The 20 October changelog says Free had 2/4 and 4/8; current docs, pricing, limits and API all say **4/8 only**. The changelog is stale; current behaviour is 4/8. (The repo already noted this.)
8. **Builder absent from older pages.** `docs/limits` (the alias page) does list Builder now, but some older prose (blog, 20 October changelog) has only Free/Pro/Team. Use the current limits/pricing table.
9. **`llms-full.txt` is not the whole docs site.** `https://instabox.sh/llms-full.txt` is ~291 KB and omits pages that `https://instabox.sh/docs/llms-full.txt` (~443 KB) includes — notably GPU, sizes, custom images, Direct Secrets, Android, CI, ADEs. Use the `/docs/` bundle or per-page `.md`; do not treat the root bundle as complete. The root `llms.txt` index *is* current.
10. **macOS/Windows are documented in the API but not published as products.** No template row, price, region or changelog entry. Do not put them in the comparison as available; note them as an API-level signal only.
11. **No customer DPA.** The Privacy Policy mentions DPAs with sub-processors and SCCs for transfers; there is no customer DPA page or download. If the head-to-head scores "DPA available", InstaBox is `not-published`, not `yes`.
12. **Region.** No selector, no list, `region` refused, US-only sub-processors. The Terms say US. If Lizard offers EU choice, this is a clean win for Lizard; do not soften it with "US-only by default".

## Source map (old docs.json → current canonical pages)

| `docs.json` key | Current page(s) |
|---|---|
| `isolation` | <https://instabox.sh/docs/account/limits> |
| `sizes-regions` | <https://instabox.sh/docs/machines/sizes>, <https://instabox.sh/docs/account/limits> |
| `lifecycle` | <https://instabox.sh/docs/machines/lifecycle> |
| `snapshots-forks` | <https://instabox.sh/docs/machines/snapshots>, <https://instabox.sh/docs/machines/fork> |
| `storage` | <https://instabox.sh/docs/machines/storage>, <https://instabox.sh/docs/account/limits> |
| `idle-timers` | <https://instabox.sh/docs/machines/auto-pause> |
| `reaching-it` | <https://instabox.sh/docs/access/ports>, <https://instabox.sh/docs/access/ssh>, <https://instabox.sh/docs/access/desktop> |
| `custom-domains` | <https://instabox.sh/docs/access/ports> |
| `outbound-network` | <https://instabox.sh/docs/account/limits>, <https://instabox.sh/docs/account/pricing> |
| `keys-secrets` | <https://instabox.sh/docs/security/secrets>, <https://instabox.sh/docs/security/direct-secrets> |
| `ways-to-drive` | <https://instabox.sh/docs/integrations/mcp>, <https://instabox.sh/docs/reference/sdk>, <https://instabox.sh/docs/python-sdk> |
| `built-in-agents` | <https://instabox.sh/docs/use-cases/coding-agents>, <https://instabox.sh/docs/account/limits> |
| `teams-accounts` | <https://instabox.sh/docs/security/api-keys>, <https://instabox.sh/docs/account/billing> |
| `billing-models` | <https://instabox.sh/docs/account/pricing> |
| `trials-free-tiers` | <https://instabox.sh/docs/account/pricing>, <https://instabox.sh/docs/account/limits> |
| `quickstart` | <https://instabox.sh/docs/quickstart> |
| `pricing` | <https://instabox.sh/docs/account/pricing> |

The old URLs (`/docs/limits`, `/docs/machines`, `/docs/snapshots`, `/docs/ports`, `/docs/ssh`, `/docs/secrets`, `/docs/keys-sdk`, `/docs/pricing`, `/docs/start`, `/docs/integrate`, `/docs/concepts`) still return **200** and resolve to the same current content, so the repo will not break — but they are aliases, and the nav canonicalises to the new paths. Prefer the new paths for new evidence.

## Sources

Primary, all re-read 12 November 2026:

- <https://instabox.sh> — homepage ("Fork a machine, mid-run", "Running Processes")
- <https://instabox.sh/pricing> — plans, unit prices, calculator, FAQ (fresh fetch, `maxAgeMs: 0`)
- <https://instabox.sh/docs> — docs index (Mintlify, 6 November)
- <https://instabox.sh/docs/account/pricing> — plans, unit prices, GPU table, disk allowance
- <https://instabox.sh/docs/account/limits> — plan table, machine specs, templates, exec/disk/bandwidth limits
- <https://instabox.sh/docs/account/billing> — how cost is computed, per-resource lines
- <https://instabox.sh/docs/machines/sizes> — sizes, create fields, resize
- <https://instabox.sh/docs/machines/lifecycle> — pause/resume/stop/start/restart/restore/delete
- <https://instabox.sh/docs/machines/auto-pause> — idle, max run, cooldown, activity leases, wake table
- <https://instabox.sh/docs/machines/storage> — retention, deadlines, region
- <https://instabox.sh/docs/machines/snapshots> — snapshot semantics, root-only, restore
- <https://instabox.sh/docs/machines/fork> — native COW fork, limits
- <https://instabox.sh/docs/machines/custom-images> — OCI import
- <https://instabox.sh/docs/machines/files> — file API, 5 GiB
- <https://instabox.sh/docs/machines/run-commands> — exec limits, background jobs
- <https://instabox.sh/docs/machines/environment> — env vars
- <https://instabox.sh/docs/machines/logs-and-labels> — logs, labels
- <https://instabox.sh/docs/access/ports> — public/private ports, raw TCP preview
- <https://instabox.sh/docs/access/ssh> — SSH, mosh, tokens, forwarding
- <https://instabox.sh/docs/access/desktop> — desktop, takeover, share links
- <https://instabox.sh/docs/security/secrets> — proxy Secrets
- <https://instabox.sh/docs/security/direct-secrets> — direct Secrets
- <https://instabox.sh/docs/security/api-keys> — scopes, workspace binding
- <https://instabox.sh/docs/security/agent-sign-up> — agent claim flow
- <https://instabox.sh/docs/integrations/mcp> — hosted/local/docs MCP, tools
- <https://instabox.sh/docs/integrations/webhooks> — events, retries, signatures
- <https://instabox.sh/docs/use-cases/ci> — GitHub Actions, labels, snapshots
- <https://instabox.sh/docs/use-cases/android> — Android 14 template
- <https://instabox.sh/docs/use-cases/ade> — cmux/Orca/Paradev/T3
- <https://instabox.sh/docs/use-cases/coding-agents> — agents, `agent prompt`
- <https://instabox.sh/docs/python-sdk> — Python SDK
- <https://instabox.sh/docs/reference/sdk> — TS SDK 0.7.0
- <https://instabox.sh/docs/reference/cli> — CLI, agent commands, exit codes
- <https://instabox.sh/docs/reference/errors> — error catalogue
- <https://instabox.sh/docs/api-reference/introduction> — REST/SSE/WebSocket surfaces
- <https://instabox.sh/docs/concepts> — templates, states, GPU
- <https://instabox.sh/docs/quickstart> — CLI first run
- <https://instabox.sh/changelog> — 6 Nov, 5 Nov, 4 Nov, 3 Nov, 1 Nov, 31 Oct, 27 Oct, 26 Oct, 24 Oct, 20 Oct, 19 Oct
- <https://instabox.sh/blog> — 10 Nov Trust Center, 9 Nov per-box cost, 8 Nov Omarchy, 7 Nov Python, 6 Nov Mintlify, 5 Nov Alipay, 4 Nov plan limits, 3 Nov Builder/Android, 1 Nov agent toolkit, 31 Oct alerts/CI, 29 Oct webhooks
- <https://instabox.sh/blog/instabox-pricing> — 19 October pricing post (stale "no usage limit")
- <https://instabox.sh/terms> — Terms, last updated 9 November 2026
- <https://instabox.sh/privacy> — Privacy, last updated 9 November 2026
- <https://instabox.sh/subprocessors> — sub-processors, last updated 9 November 2026
- <https://app.vanta.com/insforge.dev/trust/9dxtxcntvvv5ow2tx7e4dm> — Trust Center (SOC 2, HIPAA, controls, sub-processors)
- <https://instabox.instatus.com> and `/summary.json` — status page
- <https://api.instabox.sh/v1/openapi.json> — OpenAPI 3.1 (os enum, macOS lease, Secret hosts, scopes, fields)

Secondary (only where labelled): <https://battleships.dev/data/providers/instabox.json> (built by the Boat team; not used for any verdict this pass), <https://www.ycombinator.com/companies/insforge-instacloud>, <https://dealroom.co/news/158042-insforge-raises-8m-seed-to-build-cloud-infrastructure-for-ai-agents/>.

## Verification status

- All 78 capability IDs in the site's `capabilities.json` are present above exactly once; no extras. (Checked by extracting the first-column IDs and diffing against the JSON.)
- 16/16 features covered, each with current verdict, specifics, source, quote and a changed/unchanged note.
- No repo data file was edited; no commit, push or PR; no account, key, machine or billable resource created.
- All 79 evidence quotations in the capability tables and all 16 feature Evidence lines were mechanically matched (whitespace/backticks/emphasis normalised) against the fetched first-party corpus: `docs/llms-full.txt`, the root `pricing.md`, `changelog.md`, `openapi.json`, `blog.md`, the Trust Center blog, and saved Terms/Privacy/status strings. Result: **0 unmatched** after replacing two ellipsis-joined feature quotes with contiguous text. The corpus is local to this research pass, not a repo test.
- One repo quote is **no longer present** in the current fork page: "It is snapshot save plus create". Replace it with "A fork is a copy-on-write copy of the source's disks … It is not a live memory fork." The parent should treat the quote column as evidence to re-check during integration, not as a final audited ledger.


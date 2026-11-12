# Tensorlake recheck — 12 November 2026

**Provider:** `tensorlake` · https://www.tensorlake.ai · baseline `origin/main` 4432d00, site last checked **2026-10-29** (rate card 2026-10-30).
**Scope:** all 16 features, all 78 capabilities, the rate-card inputs, and anything new since the baseline. Desk research only: no account, no API key, no sandbox was started.

**Bottom line:** the sandbox product is materially the same, but two billing inputs changed and the EU story lost its documentation. CPU now bills at a **minimum of 20% of allocated vCPU** — so the site's B and C workloads, which assume 10% busy, pay twice for CPU — and Tensorlake now publishes **reserved H100 capacity at $3.95 per GPU-hour** on a separate invoice. The page that documented the EU endpoints has been **deleted** (the host still answers), the docs now publish a **shared** egress-IP list rather than a dedicated one, and there is a **cron scheduler for Orchestration endpoints**. Four findings from before the baseline were missed, touching five rows: egress is free, the BYOC ingress does give you your own domain and certificate, self-hosting is multi-cloud BYOC, and DeepSeek Harness is a supported agent. Separately, Tensorlake disclosed a **security incident on 7 November 2026** in which customer email addresses were read.

## Method and freshness

- **Tools that succeeded:** `curl` for the provider's own Markdown (`docs.tensorlake.ai/llms.txt`, every `.md` page, `llms-full.txt`, `sitemap.xml`, `api.eu.tensorlake.ai/health`); Composio **Context** `web_scrape` with `maxAgeMs: 0` and `cache_metadata.status: "miss"` for the rendered marketing pages (pricing, home, blog, Trust Center, status, indexed.vc, careers); Context `web_search` once, for the deleted EU page (it still returns the old title/description). Amp native web tools were not used.
- The pricing page was fetched fresh through Context (`cache_metadata: {status: "miss", age_ms: 0}`, request `d1d908a8-…`) and independently with `curl` (HTTP 200, `date: Thu, 12 Nov 2026 09:54 GMT`). The Wayback Machine snapshot of **22 October 2026** was used as the before-image for the two new rates.
- Quote check: every URL/quote pair in the current provider, feature and capability data was re-fetched and normalised (tags stripped, entities decoded, `\` escapes removed, whitespace collapsed). **137/150 matched**. The 13 misses are 6 pairs on 3 JavaScript/third-party pages (indexed.vc ×3, status ×2, Trust Center ×1), 1 Mintlify React split around `$0.01`, 2 where `<port>` was eaten as a tag, 2 pricing sentences that have since been rewritten (a finding, not an error) and 2 citations of the deleted EU page. Details at the end.
- Docs inventory: **109 unique URLs in `llms.txt` (143 lines)** against the baseline's 108, and **163 URLs in `sitemap.xml`** (the sitemap adds the v2 API reference, examples and FAQs). Two of the 109 are not pages (`llms-full.txt` and the OpenAPI file), so the page count itself is flat while the contents changed. New index pages since the baseline: `platform/usage`, `sandboxes/cli-contexts`, `agent-skills`, `filesystems/http-api`, `filesystems/manage-sessions`, `filesystems/read-only-mounts`, `git/{commits,blame,merging,repository-sdks,authentication,store-generated-code}`, `api-reference/v2/*`, `examples/*`. Deleted: `platform/eu-data-residency`.

## What changed since 29 October

| Area | Baseline | Now | Evidence |
|---|---|---|---|
| CPU metering | Active CPU only; fall back to allocation when sampling fails | Active CPU **with a 20% floor of allocated vCPU**; full allocation when sampling fails | [pricing](https://www.tensorlake.ai/pricing) — "with a minimum of 20% of allocated vCPU" |
| GPUs | By request, no price | By request, **H100 $3.95/GPU-hour**, reserved capacity, own invoice | [pricing](https://www.tensorlake.ai/pricing) — "The NVIDIA H100 is $3.95 per GPU-hour." |
| EU residency | Dedicated page with EU endpoints | Page **404**; intro still claims EU residency; `api.eu.tensorlake.ai` live | [intro](https://docs.tensorlake.ai/sandboxes/introduction) vs deleted `/platform/eu-data-residency` |
| Egress IPs | Nothing published | **Ten shared NAT addresses** documented for allowlists | [networking](https://docs.tensorlake.ai/sandboxes/networking) — "These addresses are shared across customers." |
| Scheduling | No scheduler | **Cron for Orchestration endpoints** (API + Applications UI) | [cron](https://docs.tensorlake.ai/applications/cron-scheduler) |
| Cost visibility | Dashboard only | **`tl usage` / UsageClient**, per sandbox and per project, CLI 0.5.160+ | [usage](https://docs.tensorlake.ai/platform/usage) |
| CLI auth | API key; `tl login` not described in the pages read | **`tl login` Personal Access Tokens + named contexts** per project, switch with `tl context use` | [cli-contexts](https://docs.tensorlake.ai/sandboxes/cli-contexts) |
| Company | — | **Security incident 7 Nov 2026** (email addresses read); subprocessors now 7; status 99.90% sandboxes | [Trust updates](https://trust.tensorlake.ai/updates), [status](https://status.tensorlake.ai/) |

The 20% floor and the H100 rate are genuinely new: neither appears as text in the 22 October Wayback snapshot of `/pricing`, which still carries the baseline's "CPU tracks active runtime execution when metering is available" sentence and no GPU price at all.

## Rate-card inputs (original units)

**Plans — unchanged except where noted**

| Plan | Price | Concurrency | Per-sandbox ceiling | Session cap |
|---|---|---|---|---|
| Free | $0 forever, no card | 1 | 1 vCPU · 1 GB · 10 GB | 2 h |
| Usage Credits | Prepaid packs from $5 | up to 100 | 4 vCPU · 16 GB · 100 GB | 24 h |
| Pro | **$250 per billing cycle**, includes 25,000 CU ($250 of usage), overage **$0.01/CU** | 1,000 | 16 vCPU · 64 GB · 100 GB | unlimited |
| Enterprise | custom | unlimited | custom | unlimited |

Packs unchanged: **$5 = 500 CU, $10 = 1,000 CU, $20 = 2,000 CU**, 1 CU = $0.01, up to 10 packs at once, optional auto-refill, no postpaid overage on credits.

**Metered rates — unchanged**

| Resource | Usage Credits | Pro |
|---|---|---|
| Active CPU, per core-hour | $0.07 | $0.042 |
| RAM, per GB-hour | $0.015 | $0.009 |
| Root disk, per GB-hour while running | $0.0002 | $0.0001 |
| Snapshot storage, per GB-month while suspended | $0.07 | $0.07 |
| Network egress | free | free |

**Changed inputs**

1. **CPU floor: 20% of allocated vCPU.** "CPU is billed on active execution, not reserved vCPU time, with a minimum of 20% of the vCPU you allocate. An idle 8-vCPU sandbox bills 1.6 vCPU; a busy one bills what it uses." In `presets`, **A** is 50% busy so the floor does not bind; **B and C are 10% busy**, so their billed CPU input doubles (B: 0.4 → 0.8 vCPU; C: 0.2 → 0.4 vCPU). The RAM and disk inputs are unchanged. B's metered usage still fits inside Pro's $250 included allowance.
2. **Reserved GPU: NVIDIA H100, $3.95 per GPU-hour**, "billed per GPU-hour on their own invoice, separate from sandbox usage", capacity reserved by talking to engineers. Not modelled by `RateCard` (no GPU dimension); record it as an exclusion.
3. **Egress is free and now stated as a rule**, not just an absent line: "Network egress is free." No allowance, no per-GiB rate.
4. **Billing granularity unchanged:** per second, whole CUs, pooled per organisation, snapshot storage on unique bytes with a fixed 30-day month.

**Model limitations the rate card cannot express**

- `RateCard.cpu.floor` is an **absolute vCPU count** (`cost.ts`: `Math.max(c.floor ?? 0, vcpu * w.busy)`), not a share of allocation. Tensorlake's floor is **20% of whatever you allocated**, so a single constant cannot serve 1-, 2- and 4-vCPU shapes. Needs a proportional floor (`floorShare`) or an engine change; today the only honest options are to leave the floor out (understates B/C) or to add a per-shape hack (wrong elsewhere).
- GPU capacity is sold on a separate invoice and reserved, not attached per second; keep it out of A/B/C.
- Snapshot storage is billed on "unique bytes", so modelling it as the sandbox's disk size is an upper bound (pre-existing caveat, still true).

## Features (16)

5 rows need edits; 11 are confirmed.

**isolation** · yes · Firecracker; `/dev/kvm` — unchanged
CPU sandboxes are Firecracker microVMs with their own kernel, root and `/dev/kvm`; Docker needs `tensorlake/ubuntu-systemd`; GPU sandboxes are gVisor. Evidence: https://docs.tensorlake.ai/sandboxes/introduction — "Tensorlake provides isolated MicroVM sandboxes that boot in hundreds of milliseconds, with memory and filesystem preserved across suspend/resume."

**sizes-regions** · partly · 16 vCPU / 64 GiB; no region picker — changed (note only)
Ceilings are unchanged (Free 1/1/10, Credits 4/16/100, Pro 16/64/100; 1–8 GB RAM per vCPU; 10–100 GB disk, growth-only). What changed is the region evidence: the dedicated EU page is gone, so the only first-party claim left is one sentence in the introduction, and BYOC is the only documented way to pin compute to a country. Evidence: https://docs.tensorlake.ai/sandboxes/introduction — "Tensorlake is HIPAA and SOC 2 Type II compliant, supports EU data residency, and offers zero data retention." Note should say the EU endpoints page was removed, not link it.

**lifecycle** · yes · RAM + processes; ~1 s resume — unchanged
Named sandboxes suspend (idle or explicit) and resume under the same ID with the process tree intact; ephemeral ones terminate; terminated ones restart for 48 h from the latest snapshot. Evidence: https://docs.tensorlake.ai/sandboxes/lifecycle — "Filesystem, memory, and running processes are preserved so you can resume later under the same name." Also documented and worth a clause: a `resume_failed` state is retryable from its retained checkpoint, and `auto_resume` can be turned off per sandbox.

**snapshots-forks** · yes · Memory or disk; copy ×N — unchanged
`filesystem` (cold boot) and `memory` (warm boot, processes running) snapshots, deduplicated, outliving the source; `copy` takes a running, suspended or resume-failed source and fans out N copies in one call. Evidence: https://docs.tensorlake.ai/sandboxes/snapshots — "`memory`: captures filesystem, memory, and running process state and restores with a warm start."

**storage** · yes · 10–100 GB root; 8 volumes — unchanged (naming shifting)
Root disk is ephemeral; durable storage is a mounted Tensorlake filesystem (the pages now call it *File Systems*; the intro page still says *Cloud Volumes*), versioned with permanent snapshots and time travel, up to 8 mounts per sandbox, read-only/prefetched/pinned/owner variants, attach and detach on a running sandbox. Evidence: https://docs.tensorlake.ai/sandboxes/mount-filesystems — "At most 8 filesystem mounts per sandbox". A note-only refresh could name the new HTTP API and local mounts (see New products).

**idle-timers** · yes · 10 min idle; 2 h to unlimited — unchanged
`timeout_secs` is an idle threshold on proxied traffic, default 600 s, max 2 h Free / 24 h Credits / unlimited Pro+Enterprise, 0 means the plan maximum. Evidence: https://docs.tensorlake.ai/sandboxes/lifecycle — "If `timeout_secs` is not set, it goes with the default value which is `600` sec (10 minutes)."

**reaching-it** · yes · HTTPS per port; auth on by default — unchanged
`https://<port>-<name>.sandbox.tensorlake.ai` per exposed port, project key or browser session by default, `allow_unauthenticated_access` per port, management API on 9501 always authenticated. Evidence: https://docs.tensorlake.ai/sandboxes/networking — "Authenticated routing is the default model for sandbox access."

**custom-domains** · partly · BYOC ingress only — unchanged
No domain setting on Tensorlake Cloud; in the BYOC mode where you run the ingress you supply NLB, ACM certificate and a public DNS zone and every sandbox gets a subdomain of your base domain. Evidence: https://docs.tensorlake.ai/platform/self-hosted-compute/aws — "You own the endpoint and its domain". (The matching capability rows said `not-published`; corrected below.)

**outbound-network** · yes · Allow/deny lists; free egress — unchanged
Open by default; `allow_out`/`deny_out` with domains, leading wildcards, IPv4 and CIDRs; deny wins; policy can be swapped atomically on a running sandbox and rejects unresolvable hostnames; `allow_internet_access=false` with an empty allowlist blocks DNS too. Egress is free. Evidence: https://docs.tensorlake.ai/sandboxes/networking — "values can be domains, leading-wildcard domains like `*.example.com`, IPv4 addresses, or IPv4 CIDR ranges".

**keys-secrets** · partly · Env vars only — unchanged
Command-scoped and PTY-scoped environment variables; no sandbox secrets manager, no placeholder/proxy injection, so the agent can read what it is given. Orchestration has its own `tl secrets` page, which does not cover sandboxes. Evidence: https://docs.tensorlake.ai/sandboxes/environment-variables — "Use command-scoped env when values should not persist across all sandbox processes."

**ways-to-drive** · partly · SDK, CLI, SSH; no MCP — changed (note)
Same surface — Python/TypeScript SDKs, async Python, `tl` CLI, REST v2 with OpenAPI, SSH, PTY over WebSocket, local tunnels, desktop SDK — plus `tl login` PAT contexts, `tl usage`, and an agent-skills package (`npx skills add tensorlakeai/tensorlake-skills`) for Claude Code, Codex and Google ADK. Still no Tensorlake-run MCP server: MCP appears only as a client (`chrome-devtools-mcp` attaching to Chrome in a sandbox) or as a tool type a Claude agent calls. Evidence: https://docs.tensorlake.ai/sandboxes/quickstart — "This installs the `tl` CLI, which you can use to manage sandboxes and other resources from the command line." and https://docs.tensorlake.ai/sandboxes/cli-contexts — "A context is one organization, one project, and one token, saved under a name you choose."

**built-in-agents** · partly · None; six integrations — changed
Nothing is preinstalled, but the first-party integration list is OpenCode (plugin), Claude Managed Agents, Cursor Cloud Agents, Devin Outposts, Crabbox and **DeepSeek Harness** (the `@tensorlakeai/dsh-sandbox` bundle, 15 Aug 2026, linked from the homepage but absent from `llms.txt`; the baseline missed it). Evidence: https://www.tensorlake.ai/blog/deepseek-harness-tensorlake-sandbox — "The @tensorlakeai/dsh-sandbox bundle moves DeepSeek Harness file, subprocess, Bash, terminal, and LSP operations into one short-lived Tensorlake microVM."

**teams-accounts** · partly · Roles + SSO; no spend cap — unchanged
Org admin/member and project admin/member; project-scoped keys; SSO via OIDC/SAML gated on enablement (Enterprise column), now with an enforcement switch and a required bypass user; no budget, alert or self-serve audit log. New: `tl usage` reports cost per sandbox and per project, which helps after the fact but caps nothing. Evidence: https://docs.tensorlake.ai/platform/billing — "When the balance reaches zero, Tensorlake blocks new sandbox activity and stops running sandboxes instead of creating a postpaid overage."

**billing-models** · yes · Active CPU, 20% floor; $250 Pro — changed
Per-second metering: $0.07 per active core-hour, $0.015 per GB-hour RAM, $0.0002 per GB-hour disk, or $0.042/$0.009/$0.0001 on Pro; CPU has a **20% floor** of allocated vCPU and falls back to full allocation if sampling fails; RAM and disk bill on allocation while running; suspended state bills snapshot storage at $0.07/GB-month on unique bytes; egress free; reserved H100 at $3.95/GPU-hour on its own invoice; `tl usage` exposes cost per sandbox. Evidence: https://www.tensorlake.ai/pricing — "CPU is billed on active execution, with a minimum of 20% of allocated vCPU."

**trials-free-tiers** · yes · Free forever, 1 sandbox — unchanged
$0 forever, no card, one concurrent sandbox at 1 vCPU / 1 GB / 10 GB, 2-hour sessions, unmetered sessions, SOC 2 Type 2, "Encrypted storage, 7 day retention" (retention target not explained); Usage Credits start at a $5 pack; unused credits retained, not refunded. Evidence: https://www.tensorlake.ai/pricing — "You can start on our Free tier and run 1 sandbox at a time — no credit card required."

**company** · partly · Tensorlake, Inc.; 99.9% SLA — changed
Legal entity and California/San Francisco venue unchanged; 99.9% control-plane SLA, automatic credits capped at 50%, paid plans only; SOC 2 Type 2; HIPAA claimed with a BAA on Pro+ but still no HIPAA badge in the Trust Center. **New:** a security incident on 7 Nov 2026 (leaked GitHub token → long-lived AWS Secrets Manager credentials → internal secrets and **customer email addresses** read; sandboxes, snapshots and images not accessed; API keys not exposed, rotation advised). Subprocessors now **7** where the baseline recorded 4 (adds Lambda Labs, Microsoft Azure, Vercel). Status: Applications 100.00%, **Sandboxes 99.90%** over 90 days to 12 Nov. The homepage says "BACKED BY Redpoint Ventures, Amplify Partners", which conflicts with the third-party investor list still used in the profile. Evidence: https://trust.tensorlake.ai/updates — "On November 7, 2026, between 19:29 and 21:59 UTC, an attacker used a leaked internal credential to read secrets stored in our cloud account."

## Capabilities (78)

12 rows change: 7 verdicts and 5 figure/note corrections. The other 66 are confirmed as they stand. One line each: verdict · specifics · URL · quote · status.

### Machine and money

- **own-vm** · partly · VM, except GPU — https://docs.tensorlake.ai/sandboxes/introduction — "GPU sandboxes use gVisor while CPU-only sandboxes run in VMs." — unchanged
- **root** · yes · sudo or --user root — https://docs.tensorlake.ai/sandboxes/tensorlake-images — "a non-root user with passwordless sudo" — unchanged
- **docker-inside** · yes · needs ubuntu-systemd image — https://docs.tensorlake.ai/sandboxes/tensorlake-images — "Required for workloads needing service management, such as Docker or Kubernetes, within the sandbox." — unchanged
- **nested-virt** · yes · /dev/kvm — https://docs.tensorlake.ai/sandboxes/nested-virt — "Tensorlake Sandboxes have /dev/kvm devices, so you can run virtual machines inside them using any KVM-based hypervisor." — unchanged
- **custom-image** · yes · Dockerfile builds — https://docs.tensorlake.ai/faqs/sandbox-images-faq — "Tensorlake supports defining sandbox images in Python, TypeScript, or a raw Dockerfile." — unchanged
- **any-size** · yes · any cores and memory — https://docs.tensorlake.ai/platform/billing — "allocate between 1 GB and 8 GB of RAM per vCPU" — unchanged
- **big-machines** · yes · 16 cores / 64 GB — https://docs.tensorlake.ai/platform/billing — "16 vCPU, 64 GB RAM, 100 GB root disk" — unchanged
- **live-resize** · yes · cores, memory, disk live — https://docs.tensorlake.ai/sandboxes/live-resize — "A sandbox can change its CPU, memory, and root disk allocation while it runs." — unchanged
- **gpu** · partly · H100, by request, $3.95/h — https://docs.tensorlake.ai/sandboxes/gpu — "GPU sandboxes are available by request." — **changed**
  - Figure and note now carry the published H100 rate; the request gate and the gVisor constraints are unchanged.
- **choose-region** · partly · US or EU host, undocumented — https://docs.tensorlake.ai/sandboxes/introduction — "Tensorlake is HIPAA and SOC 2 Type II compliant, supports EU data residency, and offers zero data retention." — **changed**
  - Was yes, citing /platform/eu-data-residency. That page is now 404 and has dropped out of llms.txt and the sitemap; api.eu.tensorlake.ai still answers /health with 200, so the capability exists but is no longer documented.
- **eu-region** · partly · EU host, undocumented — https://docs.tensorlake.ai/sandboxes/introduction — "supports EU data residency" — **changed**
  - Was yes, citing the deleted /platform/eu-data-residency page. The introduction still claims EU residency; the endpoint still resolves and answers, so the row is partly rather than no.
- **per-second** · yes · per second — https://docs.tensorlake.ai/platform/billing — "runtime usage is measured by the second" — unchanged
- **active-cpu** · yes · active CPU, 20% floor — https://www.tensorlake.ai/pricing — "CPU is billed on active execution, with a minimum of 20% of allocated vCPU." — **changed**
  - New 20% floor. Baseline said CPU billed only while executing, with a fallback to allocated time when sampling failed; the fallback survives and a floor was added.
- **cheap-pause** · yes · storage only — https://docs.tensorlake.ai/sandboxes/lifecycle — "Consumes no compute; state is preserved for resume under the same sandbox ID." — unchanged
- **no-monthly-fee** · yes · prepaid credit — https://docs.tensorlake.ai/platform/billing — "Prepaid packs starting at $5" — unchanged
- **flat-price** · no · metered parts — https://docs.tensorlake.ai/platform/billing — "Active CPU per core-hour" — unchanged
- **free-tier** · yes · 1 machine, 1 core / 1 GB — https://docs.tensorlake.ai/platform/billing — "Tensorlake Cloud has a free tier" — unchanged
- **free-credit** · no · none — https://docs.tensorlake.ai/platform/billing — "Prepaid packs starting at $5" — unchanged
- **no-card** · yes · free plan, no card — https://docs.tensorlake.ai/platform/billing — "Tensorlake Cloud has a free tier" — unchanged

### State and staying on

- **pause-memory** · yes · Only named sandboxes can be suspended; an unnamed one runs until it ends. — https://docs.tensorlake.ai/sandboxes/lifecycle.md — "**Named**: a name given at creation. Supports suspend and resume, so you can pause between tasks and pick up exactly where you left off." — unchanged
- **warm-pool** · yes · A pool keeps a set number of booted containers and refills itself after each claim. — https://docs.tensorlake.ai/sandboxes/pools.md — "A Sandbox Pool is a sandbox template (image, resources, entrypoint, timeout, network policy) plus a set of pre-booted warm containers." — unchanged
- **fast-start** · yes · Hundreds of ms — https://docs.tensorlake.ai/sandboxes/introduction.md — "Tensorlake provides isolated MicroVM sandboxes that boot in hundreds of milliseconds" — unchanged
- **snapshot-files** · yes · Filesystem is the default snapshot type and restores with a cold boot. — https://docs.tensorlake.ai/sandboxes/snapshots.md — "`filesystem`: captures filesystem state and restores with a cold boot." — unchanged
- **snapshot-memory** · yes · A memory snapshot restores the files, memory and running processes. — https://docs.tensorlake.ai/sandboxes/snapshots.md — "`memory`: captures filesystem, memory, and running process state and restores with a warm start." — unchanged
- **fork-running** · yes · One call, N copies — https://docs.tensorlake.ai/sandboxes/snapshots.md — "Cloning a sandbox is done with `tl sbx copy` or `sandbox.copy()` in either SDK." — unchanged
- **older-snapshot** · yes · A snapshot survives the source sandbox and can be restored much later. — https://docs.tensorlake.ai/sandboxes/snapshots.md — "once a snapshot reaches `completed`, the artifact persists after the source sandbox is terminated" — unchanged
- **templates** · yes · Images and snapshots are the two starting points for a new sandbox. — https://docs.tensorlake.ai/sandboxes/snapshots.md — "This means you can snapshot an ephemeral sandbox before it ends, then restore that state into a new sandbox much later." — unchanged
- **backups** · partly · Only the storage you mount is saved automatically; a machine's own disk has no copy. — https://docs.tensorlake.ai/filesystems/core-concepts.md — "An **autosave checkpoint** is a durable, shared recovery point for the mounted file state." — unchanged
- **files-survive-stop** · partly · 48 h after terminate — https://docs.tensorlake.ai/sandboxes/lifecycle.md — "Call `restart` within 48 hours of termination to boot it again under the same ID and name" — unchanged
- **volumes** · yes · A Cloud Volume can be mounted on one or more sandboxes, read-only if you choose. — https://docs.tensorlake.ai/sandboxes/mount-filesystems.md — "Mount durable, shareable Tensorlake filesystems into sandboxes at boot, on warm-pool claims, or on a running sandbox" — unchanged
- **shared-volume** · yes · Same-path writes are last-writer-wins, so two machines editing one file can clash. — https://docs.tensorlake.ai/filesystems/concurrent-writes.md — "Disjoint paths merge automatically, same-path writes are last-writer-wins." — unchanged
- **mount-buckets** · no · The mount feature covers Tensorlake's own file systems; an outside S3 bucket is not documented. — https://docs.tensorlake.ai/sandboxes/mount-filesystems.md — "Mount durable, shareable Tensorlake filesystems into sandboxes at boot, on warm-pool claims, or on a running sandbox" — unchanged
- **big-disk** · yes · 100 GB root — https://docs.tensorlake.ai/platform/billing.md — "16 vCPU, 64 GB RAM, 100 GB root disk" — unchanged
- **stay-on** · partly · 2 h free, 24 h credits — https://docs.tensorlake.ai/sandboxes/lifecycle.md — "The maximum allowed `timeout_secs` depends on your plan: **2 hours** on Free, **24 hours** with Usage Credits, and unlimited on Pro and Enterprise." — unchanged
- **choose-idle** · yes · The value is an idle threshold; 0 asks for the plan maximum. — https://docs.tensorlake.ai/sandboxes/lifecycle.md — "`timeout_secs` is an **idle threshold**, not a wall-clock lifetime." — unchanged
- **wake-on-request** · yes · Automatic resume can be switched off per sandbox. — https://docs.tensorlake.ai/sandboxes/lifecycle.md — "Setting it to `true` allows the next proxied request to wake a suspended sandbox" — unchanged
- **schedules** · partly · cron on orchestration — https://docs.tensorlake.ai/applications/cron-scheduler — "Cron schedules trigger your deployed orchestration endpoints on a recurring basis." — **changed**
  - Was no ('No cron scheduler; an application is called over HTTP'). A cron scheduler for Orchestration endpoints is documented, with API and Applications UI management.

### Access

- **public-url** · yes · Per-port switch — https://docs.tensorlake.ai/sandboxes/networking.md — "So traffic to that user port becomes publicly reachable from the internet without TensorLake auth." — unchanged
- **private-url** · yes · Project key — https://docs.tensorlake.ai/sandboxes/networking.md — "Authenticated routing is the default model for sandbox access." — unchanged
- **ssh** · yes · Standard ssh — https://docs.tensorlake.ai/sandboxes/pty-sessions.md — "Reach a running sandbox over standard SSH, or open a programmatic PTY session over WebSocket" — unchanged
- **web-terminal** · not-published · The console shows process logs, but no browser terminal is documented; its shell sessions are built into your own app. — https://docs.tensorlake.ai/sandboxes/process-logs.md — "View, search, and filter stdout and stderr from sandbox processes in the Tensorlake Console" — unchanged
- **tunnel** · yes · Local tunnel — https://docs.tensorlake.ai/sandboxes/tunnels.md — "Tunnels give your machine a `localhost:<port>` that maps directly to a port inside a running sandbox." — unchanged
- **raw-tcp** · partly · Through a tunnel — https://docs.tensorlake.ai/sandboxes/tunnels.md — "Anything else (VNC's RFB protocol, the Postgres wire protocol, MySQL, Redis's RESP, MongoDB, custom binary protocols) needs a tunnel" — unchanged
- **custom-domain** · partly · BYOC ingress only — https://docs.tensorlake.ai/platform/self-hosted-compute/aws — "You own the endpoint and its domain" — **changed**
  - Was not-published, which contradicted the custom-domains feature row (partly, BYOC ingress only). Both now say partly.
- **auto-https** · partly · ACM cert in BYOC — https://docs.tensorlake.ai/platform/self-hosted-compute/aws — "Request an ACM certificate in the same AWS account and Region as the NLB." — **changed**
  - Was not-published, which contradicted the custom-domains feature row. TLS is terminated for every documented URL; what is missing is a managed certificate for your own domain.
- **egress-included** · yes · Not billed — https://www.tensorlake.ai/pricing — "Network egress is free." — **changed**
  - Was not-published on the reasoning that the card has no outbound line. The pricing page and billing FAQ both say egress is free, so yes is the honest reading; the baseline row contradicted the profile and the billing-models feature.
- **egress-allowlist** · yes · Domains or addresses — https://docs.tensorlake.ai/sandboxes/networking.md — "Use `allow_out` when you want a sandbox to reach only selected destinations." — unchanged
- **no-internet** · yes · --no-internet — https://docs.tensorlake.ai/sandboxes/networking.md — "Setting `allow_internet_access=false` with an empty `allow_out` blocks all outbound traffic, including DNS requests." — unchanged
- **static-ip** · partly · 10 shared NAT IPs — https://docs.tensorlake.ai/sandboxes/networking — "These addresses are shared across customers." — **changed**
  - Was not-published. The networking page lists ten NAT gateway addresses for source-IP allowlists.
- **secrets-store** · no · There is no saved secret: you pass the value with each command or session. — https://docs.tensorlake.ai/sandboxes/environment-variables.md — "Set per-command and per-PTY environment variables in the CLI, Python, and TypeScript." — unchanged
- **hidden-secrets** · no · There is no service that adds keys to requests; the machine holds whatever you pass it. — https://docs.tensorlake.ai/sandboxes/environment-variables.md — "Set per-command and per-PTY environment variables" — unchanged
- **scoped-keys** · yes · Project-scoped — https://docs.tensorlake.ai/platform/authentication.md — "API keys are project-specific credentials that allow programmatic access to resources within a project." — unchanged

### Running and company

- **dashboard-create** · no · The console lists sandboxes, logs and billing; the docs create sandboxes from the CLI or the SDK. — https://docs.tensorlake.ai/faqs/sandboxes-faq.md — "Create one on demand from the CLI or the SDK." — unchanged
- **cli** · yes · `tl` manages sandboxes, projects and contexts. — https://docs.tensorlake.ai/sandboxes/quickstart.md — "This installs the `tl` CLI, which you can use to manage sandboxes and other resources from the command line." — unchanged
- **python-sdk** · yes · `pip install tensorlake`. — https://docs.tensorlake.ai/sandboxes/quickstart.md — "This installs the Python SDK." — unchanged
- **ts-sdk** · yes · `@tensorlakeai/tensorlake`. — https://docs.tensorlake.ai/sandboxes/quickstart.md — "npm install @tensorlakeai/tensorlake" — unchanged
- **rest-api** · yes · A versioned API reference and a published OpenAPI file. — https://docs.tensorlake.ai/llms.txt — "Raw OpenAPI schema for the Tensorlake APIs, useful for exact endpoint inspection and client generation." — unchanged
- **mcp-server** · no · MCP appears only as a client you point at the browser inside a sandbox. — https://docs.tensorlake.ai/sandboxes/chrome-cdp.md — "can both drive the same sandboxed Chrome through the official" — unchanged
- **pty** · yes · A PTY API with resize and callbacks, plus SSH. — https://docs.tensorlake.ai/sandboxes/pty-sessions.md — "create_pty(" — unchanged
- **file-api** · yes · Copy, read, write and list files over the API. — https://docs.tensorlake.ai/sandboxes/file-operations.md — "## Write Files" — unchanged
- **agents-preinstalled** · no · The managed images ship an OS, a desktop and tooling; no coding agent is installed. — https://docs.tensorlake.ai/sandboxes/tensorlake-images.md — "The managed tensorlake/* images, what ships in them" — unchanged
- **prompt-api** · no · Tensorlake exposes a sandbox as a tool for your own agent; it does not run an agent from a prompt. — https://docs.tensorlake.ai/sandboxes/tool-calls.md — "Expose Tensorlake sandboxes as tools to your LLM agents" — unchanged
- **one-click-hermes** · no · No Hermes template or guide is published. — https://docs.tensorlake.ai/sandboxes/tensorlake-images.md — "The managed tensorlake/* images" — unchanged
- **one-click-openclaw** · no · No OpenClaw template or guide is published. — https://docs.tensorlake.ai/sandboxes/tensorlake-images.md — "The managed tensorlake/* images" — unchanged
- **browser** · yes · Chrome ships in the ubuntu-vnc image and is driven over CDP through a tunnel. — https://docs.tensorlake.ai/sandboxes/chrome-cdp.md — "Run Google Chrome inside an ubuntu-vnc sandbox and drive it locally through the Chrome DevTools Protocol over a tunnel." — unchanged
- **desktop** · yes · The ubuntu-vnc image gives a desktop driven from Python or JavaScript. — https://docs.tensorlake.ai/sandboxes/computer-use.md — "Launch ubuntu-vnc sandboxes and drive their desktop from Python or JavaScript." — unchanged
- **hosts-other-agents** · yes · Cursor, Claude, Devin, dsh — https://www.tensorlake.ai/blog/deepseek-harness-tensorlake-sandbox — "The @tensorlakeai/dsh-sandbox bundle moves DeepSeek Harness file, subprocess, Bash, terminal, and LSP operations into one short-lived Tensorlake microVM." — **changed**
  - Added DeepSeek Harness, whose first-party dsh bundle is linked from the homepage but is not in the docs index.
- **team-workspace** · yes · Organisations hold projects and members, with project-level access. — https://docs.tensorlake.ai/platform/access-control.md — "Organizations are the top-level entity in our system." — unchanged
- **roles** · partly · Admin and member only — https://docs.tensorlake.ai/platform/access-control — "Organizations implement a role-based access control system with two distinct roles: admin and member." — unchanged
- **sso** · partly · SSO is listed on the Enterprise plan, and the docs say access must be enabled for your organisation. — https://docs.tensorlake.ai/platform/sso.md — "SSO access must be enabled for your organization." — unchanged
- **spend-cap** · partly · Prepaid credit packs cannot be overspent, but the Pro plan bills overage beyond its included usage. — https://www.tensorlake.ai/pricing — "no postpaid overage" — unchanged
- **usage-alerts** · not-published · The billing page shows a live balance and auto-refill, but no alert or threshold is published. — https://docs.tensorlake.ai/platform/billing.md — "auto-refill" — unchanged
- **audit-log** · partly · Audit logs are not self-serve: you ask support for them. — https://docs.tensorlake.ai/platform/security.md — "access audit logs from Tensorlake, please contact us" — unchanged
- **status-page** · yes · 99.90% sandboxes — https://status.tensorlake.ai/ — "99.90% uptime" — **changed**
  - Rolling-window figure: 99.90% today, 99.89% at the baseline. The old quote ('Welcome to tensorlake...') is no longer on the rendered page.
- **sla** · yes · 99.9% monthly, control plane — https://www.tensorlake.ai/terms — "TensorLake will use commercially reasonable efforts to make the Control Plane available 99.9% of the time in each calendar month" — unchanged
- **soc2** · yes · Type 2 — https://docs.tensorlake.ai/platform/security.md — "Tensorlake is SOC 2 Type 2 certified." — unchanged
- **dpa** · yes · A public DPA with a dated revision is published. — https://www.tensorlake.ai/dpa — "Data Processing Addendum" — unchanged
- **open-source** · partly · BYOC, Enterprise — https://www.tensorlake.ai/blog/introducing-tensorlake-byoc — "Run Tensorlake Sandboxes on compute you own across AWS, GCP, Azure, CoreWeave, Nebius, and bare metal." — **changed**
  - Note widened from 'your own AWS account' to the six substrates the July BYOC post names; the docs still document AWS only.

## Contradictions between first-party pages

**1. CPU is metered on active execution — with a 20% floor the billing docs do not mention.** (New)
- Pricing: "CPU is billed on active execution, not reserved vCPU time, with a minimum of 20% of the vCPU you allocate."
- Billing docs: "CPU tracks active runtime execution, not allocated vCPU time is used."
- Model: the floor is real (the calculator's "20% minimum" slider and "Idle time still bills 20% of allocated vCPU" both encode it); the billing page is stale. Consequence: estimates built from the docs understate an idle-ish sandbox by up to 2× on CPU, and the 20% sentence must be quoted from `/pricing`, not `/platform/billing`.

**2. Does Pro's $250 include usage?** (Open since baseline)
- Pricing: "Includes 25,000 CU ($250 of usage) per billing cycle. Additional usage is billed at $0.01 per CU at the Pro rates below."
- Pricing FAQ: "Pro is $250 per billing cycle and includes 25,000 CU, which is $250 of usage at Pro's lower per-resource rates."
- Billing docs table: "**Pro** | \$250 / month + usage | 1,000 | 16 vCPU, 64 GB RAM, 100 GB root disk | Unlimited"
- Model: includes $250. If the docs are right, every Pro figure is $250 too low. Get it in the order form.

**3. Where does EU residency live now?**
- Introduction: "supports EU data residency"
- Pricing FAQ: "For strict data residency or sovereignty requirements we offer on-prem and in-VPC deployment on Enterprise — email support@tensorlake.ai to start a conversation."
- Deleted EU page (Wayback, 17 Jul 2026): "EU HTTP Endpoint is https://api.eu.tensorlake.ai/" and "The same API key can be used for both US and EU regions."
- Model: the EU host still exists and answers (`/health` 200, same 401 body as the US host for `/sandboxes`), but the documented route for residency is now Enterprise BYOC. A reader cannot discover the EU host from the docs; the intro sentence is the only trace in them.

**4. Free starting credit.**
- Harbor guide: "New accounts include free credits, enough to run a full Terminal-Bench sweep before you pay for anything."
- Pricing: "Free $0 forever … 1 sandbox at a time"; "Usage Credits … $5 starting credit pack"; "Is there a free trial? … start on our Free tier … switch to Usage Credits and choose a prepaid pack starting at $5."
- Model: `free-credit` stays `no`; the Harbor sentence is either a promotion or stale. Nothing on the pricing page grants credit at signup.

**5. Audit logs: "full audit trails" or ask support?**
- Homepage: "Full audit trails, per-project data boundaries, and compliance for regulated workloads."
- Security docs: "If you need to request complete data deletion and/or access audit logs from Tensorlake, please contact us at support@tensorlake.ai"
- Model: `audit-log` stays `partly` — logs exist, but are requested, not self-served.

**6. How many clouds does BYOC run on?**
- Homepage: "Run sandboxes and applications inside your own AWS / GCP / Azure account"
- BYOC post (28 Jul 2026): "Run Tensorlake Sandboxes on compute you own across AWS, GCP, Azure, CoreWeave, Nebius, and bare metal."
- Docs: one page, "Set up BYOC on AWS", plus "If the Self-hosted Compute page is not available, contact Tensorlake."
- Model: capability exists on at least AWS (documented) and is claimed for six substrates; the docs only let a reader complete AWS.

**7. Who invested?**
- Homepage: "BACKED BY Redpoint Ventures Amplify Partners"
- indexed.vc (updated 2 Sep 2026): "Investors include Artisanal Ventures, Plug and Play and Hawk Hill Ventures" — plus Materialized View Capital on the investor list; "$8.0M Seed" dated "2024 (est.)".
- Model: first-party names for who backs the company; third-party for the amount and date, tagged as estimated. No funding announcement was found on the site or in search, so do not attach Redpoint/Amplify to the $8M or invent a new round.

**8. Resources fixed at create vs live resize.** (Open since baseline)
- Lifecycle: "These are fixed when the sandbox is created and cannot be changed afterwards."
- Live Resize: "A sandbox can change its CPU, memory, and root disk allocation while it runs."
- Model: live resize is real (own page, SDK call, generation numbers); the lifecycle sentence is stale. GPU sandboxes are the exception.

**9. Usage Credits vs On-Demand.** (Open since baseline)
- Pricing plan card: "Usage Credits"; calculator column: "On-Demand"; Terms: "On-Demand, Pro and Enterprise".
- Model: same tier. The calculator now uses "On-Demand" for the prepaid column, which strengthens the reading but still does not state it.

**10. Snapshot storage size.** (Open since baseline)
- Billing: "$0.07 per GB-month while the sandbox is suspended."
- Snapshots: "Users are only billed for unique bytes in their images and snapshots."
- Model: the rate card bills the sandbox's disk size, so stopped storage is an upper bound.

**11. P1 response: 24 hours or 4 hours?** (Open since baseline)
- Pricing Pro: "P1 SLA: 24 hours"; Enterprise: "P1 SLA: 1 hour".
- Terms §5.7: "4 hours, 24×7" for paid plans.
- Model: quote the pricing column for the plan you buy and tell readers to get it in the order form.

**12. HIPAA is claimed but not badged.** (Open since baseline)
- Pricing: "HIPAA compliant with a BAA on Pro and above."
- Trust Center: SOC 2 only; no HIPAA resource or badge.
- Model: contract term, not a product property.

## New products the 16 features and 78 capabilities miss

These are real, documented surfaces with no row anywhere in the current inventory. The first four are the ones a buyer would notice.

1. **Hosted Git repositories** — `tl git` / `RepositoryClient`: create repos from the SDK, plain Git over smart HTTP, server-side merges and rebase, compare-and-swap promote that copies zero bytes, commit/blame APIs, repository mounts that stream a branch into a sandbox without cloning. Claim: tens of millions of repositories, hundreds of thousands of pushes per second. Docs: https://docs.tensorlake.ai/git/introduction — "We built a disaggregated Git infrastructure to scale to tens of millions of repositories and absorb hundreds of thousands of pushes per second". **No capability row covers "version control as a service"; the `storage` feature mentions it in one clause.**
2. **Versioned file systems outside sandboxes** — `tl fs mount` on Linux/macOS, `FilesystemClient.mount()`, the same volumes on any cloud VM or Kubernetes pod, an HTTP API for create/read/write/list/snapshot, sessions with resume/recover, read-only distribution to fleets, fork at any retained point, ~1 s autosave with a crash-safe local journal. The `volumes` row only describes mounting into a Tensorlake sandbox. Docs: https://docs.tensorlake.ai/filesystems/introduction — "Volumes can be used on any sandbox provider or AWS/GCP/Azure or even Kubernetes containers."
3. **BYOC in your own cloud account** — two AWS modes (compute-only with a Tensorlake endpoint, or compute+ingress with your own NLB, ACM certificate and DNS zone), VPC peering, private endpoints, your S3 bucket, reserved capacity; claimed for AWS, GCP, Azure, CoreWeave, Nebius and bare metal, with the post's own heading scaling to 5 million concurrent sandboxes. Only the `open-source` row hints at it, as a licence question. Docs: https://docs.tensorlake.ai/platform/self-hosted-compute/aws
4. **Reserved GPU capacity** — dedicated H100s at $3.95 per GPU-hour on a separate invoice, reserved through sales; GPU sandboxes are gVisor, cannot be live-resized and cannot mount Tensorlake filesystems. `gpu` covers access but not the reserved-capacity product. Docs: https://www.tensorlake.ai/pricing
5. **Usage and cost API** — `tl usage`, `UsageClient.summary()`, `client.sandboxes()`: org total split by CPU/memory/disk/snapshot, per-sandbox and per-project attribution, included-usage and overage fields, money in minor units, `basis: invoice | current_price_estimate`. Requires 0.5.160+. Docs: https://docs.tensorlake.ai/platform/usage
6. **Lifecycle webhooks** — signed (Svix) project-scoped events for sandbox and application lifecycle, e.g. `tensorlake.sandbox.running`, `tensorlake.sandbox.failed`, with retries and a test endpoint. Replaces polling for bulk creates; no capability row exists for events/webhooks. Docs: https://docs.tensorlake.ai/platform/webhooks/overview
7. **DeepSeek Harness bundle** — `@tensorlakeai/dsh-sandbox`, one ephemeral microVM per dsh run covering file, subprocess, Bash, terminal and LSP providers. First-party, linked from the homepage, absent from `llms.txt`. Blog: 15 Aug 2026.
8. **Agent skills package** — `tensorlake-skills` installs a `SKILL.md`/`AGENTS.md` that teaches Claude Code, OpenAI Codex or Google ADK to build against the Sandbox and Orchestration SDKs (`npx skills add tensorlakeai/tensorlake-skills`). A distribution surface, not a runtime. Docs: https://docs.tensorlake.ai/agent-skills
9. **Harbor multi-container tasks** — one microVM per Docker Compose task with a Docker daemon inside, so an agent's MCP server, database, browser or game server runs beside it as its own container; per-phase network policy (public / allowlist / none) swapped on the running sandbox. Blog: 16 Sep 2026. Fits `docker-inside` and `outbound-network`, but neither row says it.
10. **GitHub Actions runners** — `tl`-managed CI runners with size labels and a shared dependency cache, a separate product from sandboxes. Docs: https://docs.tensorlake.ai/github-actions/quickstart
11. **Orchestration (durable functions)** — `@application`/`@function`, futures, map-reduce, retries, cron, crash recovery, public endpoints, per-function images and secrets. The cron half now touches `schedules`; the rest has no row.

## Research-note claims this supersedes

- `capabilities-NOTES-1-machine-money.md`: "Tensorlake `choose-region` / `eu-region` = yes. EU residency is a separate API endpoint for the whole account" — the endpoint still exists, but the page documenting it was deleted and the row is now `partly`.
- `capabilities-NOTES-1`: "`big-machines` = yes … prepaid credit stops at 4 vCPU / 16 GB" — still true; unchanged.
- `capabilities-NOTES-3-access.md`: "`secrets-store` and `hidden-secrets` = no … only per-command and per-session environment variables" — rechecked the env-var page; still true, and Orchestration's `tl secrets` still does not reach sandboxes.
- `capabilities-NOTES-4-running-company.md`: "`open-source` = partly … need the arrangement enabled on an Enterprise plan" — still true; add that BYOC is now claimed for six substrates and documented only for AWS.
- `capabilities-NOTES-2-state-staying-on.md`: Tensorlake as the state/pause leader — still holds; the lifecycle page now adds a retryable `resume_failed` state and a per-sandbox `auto_resume` switch.

## Verification and limitations

- **Quote audit.** 150 URL/quote pairs from `providers/tensorlake.json`, all 16 feature rows and all 78 capability rows were re-fetched and matched after normalisation (HTML tags stripped, entities decoded, `\` escapes removed, backticks/asterisks removed, whitespace collapsed). 137 matched. The 13 misses:
  - `indexed.vc` ×3 — Vercel bot checkpoint for plain `curl`; read through Context, text matches.
  - `status.tensorlake.ai` ×2 and `trust.tensorlake.ai` ×1 — JavaScript apps; read through Context. The status quote "Welcome to tensorlake…" no longer exists in the rendered page and is replaced above.
  - `faqs/pricing-limits-faq` — Mintlify splits `$0.01` into separate React text nodes in HTML; the `.md` source contains the quote verbatim.
  - `sandboxes/networking` ×2 — the quote contains `<port>`, which the tag-stripper eats; the page text is verbatim.
  - `platform/eu-data-residency` ×2 — the page is now 404 (the actual finding).
- **Freshness.** Pricing: Context `maxAgeMs: 0`, `cache_metadata.status: "miss"`, `age_ms: 0`, plus an independent `curl` 200 at 09:54 UTC and a 22 Oct Wayback diff. Docs: `curl` of the `.md` source (Mintlify serves current Markdown, `last-modified` 12 Nov 09:54 UTC for `llms.txt`). Trust/status/indexed.vc: Context `maxAgeMs: 0`, wait-for-render, `status: "miss"`.
- **Not measured.** No sandbox was started and no account created, so boot times, resume times, autosave latency and the 84 ms cold-start claim are vendor claims. The console's create flow is still inferred from docs (`dashboard-create = no`); the pricing page CTA goes to a login wall.
- **Unresolved.** Whether the 20% CPU floor applies to Enterprise custom rates; whether Free's "7 day retention" means data, snapshots or logs (it sits beside "zero data retention" claims and a DPA that says there is no fixed retention period); whether the H100 price includes the sandbox's CPU/RAM/disk or only the GPU (the page says "separate from sandbox usage", which implies only the GPU); whether EU and US are separate accounts or one account with two hosts (the deleted page said the same API key works in both); whether warm-pool containers bill while idle (nothing says); when the EU page was removed (between 29 Oct and 12 Nov).
- **Date semantics for integration.** Provider profile and rate card were both last checked 29/30 Oct; the pricing page has changed since, so the rate-card date must advance to 12 Nov even though the profile's other pages were only confirmed. `capabilities.json` and `usecases.json` top-level dates describe whole datasets and should not move for this one provider. The changes ledger should record: CPU floor, H100 rate, EU page removal, shared egress IPs, cron scheduler, security incident — not a blanket "rechecked".
- **Files touched.** This file only: `.amp/in/scratchpad/tensorlake-recheck.md`. No repo data edited, no commit, no push, no threads created.

## Tools actually used

| Route | Used for | Result |
|---|---|---|
| Composio **Context** `web_scrape` (`maxAgeMs: 0`) | pricing, home, blog index, BYOC post, dsh post, Trust Center overview/updates/subprocessors, status, indexed.vc, careers | all rendered; `cache_metadata.status: "miss"` each time |
| Composio **Context** `web_search` | finding the deleted EU page and any funding announcement | found the stale EU page; no funding announcement |
| `curl` | every `docs.tensorlake.ai` `.md`, `llms.txt`, `llms-full.txt`, `sitemap.xml`, `api.eu…/health`, GitHub releases API | 109/109 docs pages HTTP 200; EU docs page 404 |
| Wayback Machine | before-image for the pricing page (22 Oct) and the deleted EU page (17 Jul) | both retrieved |
| Amp native `web_search` / `read_web_page` | — | not needed |

Integration note (primary thread, 2026-11-12): active-cpu set to partly (not yes as proposed above): a 20% minimum is a buyer-relevant catch, unlike Runtime's 1/20-core floor. Engine gained cpu.floorShare; A/B/C re-derived by hand (A $22, B $250, C $9.52; browser preset $269 on Pro). Incident quote confirmed via fresh Context scrape of trust.tensorlake.ai/updates.

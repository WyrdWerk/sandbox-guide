# Daytona recheck — 2026-11-12

Repo `sandbox-guide`, `origin/main` **4432d00**. Provider `daytona`, https://www.daytona.io.
Baseline read: `site/src/data/providers/daytona.json`, its rows in all 16 `site/src/data/features/*.json`, all 78 `site/src/data/capabilities.json` rows, `site/src/data/pricing/daytona.json`, `site/src/data/docs.json`, `research/daytona.md`, `research/capabilities-NOTES-*.md`.
Site's previous check: **2026-10-28** (rate card `checkedOn` 2026-10-29). Desk research only; no account, no sandbox, no billable call.

## Headline

**Daytona launched a second, differently priced platform on 1 November 2026 — eleven days ago, after the site's last check — and the site's `daytona` row now describes only the older one.** `www.daytona.com` publishes "Docs v2.0", a `v2.0.0` changelog and its own pricing: hardware-isolated Firecracker/Cloud Hypervisor/Apple-VF VMs by default, native macOS sandboxes on reserved Macs, Windows and GPU VMs, per-**core** rates, a $250/month Team plan, static egress IPs and custom domains. `www.daytona.io` still serves the product the site models (Linux containers by default, per-vCPU rates, no plan fee), still actively released (v0.231.0 on 7 Nov) and now links its macOS section to the `.com` docs. Both are first-party and live; they contradict each other on isolation, sizes, plans, stopped-state billing and macOS.

For the **`daytona.io` (1.x) product the site models**, three capability verdicts change. None comes from a price or product launch; each rests on first-party evidence the 28 October pass did not record:

1. **`agents-preinstalled`: partly → yes.** The default snapshots now list `@anthropic-ai/claude-code` 2.1.220, `@openai/codex` 0.146.0, `openclaw` 2026.7.1-2 and `opencode-ai` 1.18.14 as pre-installed npm packages.
2. **`browser`: not-published → yes.** First-party guides say the standard image "already carries Chromium and ffmpeg", and the computer-use guide launches `chromium` on a default-snapshot sandbox without installing it. The Devin Outposts guide is one the baseline notes did not record.
3. **`backups`: no → partly.** The Sandbox object exposes `backup_state` and `backup_created_at`, and `recover()` restores a failed sandbox from its `last successful backup`. That is a provider backup, but it is one rolling recovery copy with no published schedule, retention, export or restore-to-new-machine.

**No 1.x rate changed.** vCPU $0.0504/h, memory $0.0162/GiB-h, storage $0.000108/GiB-h after 5 free, Windows $0.0858/vCPU-h, per-second, $200 credit, no plan fee. What is new on the rate card is a **GPU price list the model cannot represent**: nine types, each with an on-demand and a preemptible rate, plus separate "GPU credits"/"spot GPU credits" wallet balances. NVIDIA L40S was added on 7 Nov (v0.231.0).

The 2.0 platform, if the site adopts it, would change far more: `own-vm` yes, `any-size`/`big-machines` yes, `big-disk` yes, `static-ip` yes, `custom-domain` yes, `wake-on-request` maybe, `no-monthly-fee` **no**, `cheap-pause` yes-but-unmetered, `free-tier` no.

## Retrieval record

| Tool | Use | Result |
|---|---|---|
| **Context `web_scrape`** (`maxAgeMs: 0`, `responseMode: full`) | `daytona.io/pricing`, `daytona.com/pricing`, `daytona.io/changelog`, `daytona.com/changelog`, `daytona.io/`, `daytona.io/sla`, `daytona.io/terms-of-service`, `trust.daytona.io`, `daytona.io/careers`, `daytona.io/about` | Worked. Every call returned `cache_metadata.status: "miss"`, `age_ms: 0` — i.e. fresh fetches, not cache hits. |
| **TinyFish `fetch_content`** (`ttl: 0`) | `daytona.io/pricing`, `daytona.com/docs/limits.md`, `daytona.com/pricing` | Worked. Independent second read of both price pages; identical figures to Context. |
| **curl** | `daytona.io/docs/llms.txt` (HTTP 200, `last-modified: Wed, 11 Nov 2026 19:48:25 GMT`, 226,870 bytes), all 192 `.md` URLs it lists, `daytona.com/docs/*.md`, `status.app.daytona.io`, GitHub API | Worked. This is the provider's own Markdown, used for exact quotes and for diffing the page inventory. |
| Amp native web tools | — | **Not used.** Composio routes were available throughout. |

Docs inventory check: `llms.txt` lists **192** `.md` pages (baseline research read the same tree at v0.226). Pages the baseline notes did not cover (some may predate 28 Oct): `language-server-protocol`, `log-streaming`, `linked-accounts`, `scale`, `troubleshooting`, `observability/otel-collection`, `vnc-access`, plus guides for Kimi CLI, Letta Code, Pi, Flue, Brainbase, Cursor self-hosted machines, Devin Outposts, Claude managed agents, Gemini managed agents and the OpenAI Agents API. `/docs/en/v2/` and `/docs/en/v2/macos-sandboxes/` now **404**; `/docs/en/macos-sandboxes` **301s to `https://www.daytona.com/docs/macos-sandboxes`**. So the v2 tree did not disappear — it graduated to its own domain and docs site ("Docs v2.0"), with a new SDK surface (`daytona.v2.*`).

---

# 1. The 16 features

Legend: **Δ** = changed since the 2026-10-28 check. Verdicts are for the `daytona.io` product unless the row says 2.0; a `2.0:` clause is the verdict the `daytona.com` platform would take, not a change to the `.io` row.

| Feature | Verdict | Figure | Δ | Evidence |
|---|---|---|---|---|
| isolation | partly | Containers; VM on request | no (1.x) / **yes (2.0)** | `Sandboxes run as **Linux containers** by default.` — [sandboxes.md](https://www.daytona.io/docs/en/sandboxes.md). VM classes: `Full virtual machine with its own kernel.` — [isolation.md](https://www.daytona.io/docs/en/isolation.md). 2.0: `A sandbox is a hardware-isolated virtual machine with its own kernel, filesystem, network stack, and allocated vCPU, RAM, and disk, with isolation enforced by the hypervisor.` — [com/sandboxes](https://www.daytona.com/docs/sandboxes.md) |
| sizes-regions | partly | 4 vCPU / 8 GiB / 10 GiB | no (1.x) / **yes (2.0)** | `Organizations get a maximum sandbox resource limit of **4 vCPUs**, **8GB RAM**, and **10GB disk**.` — [sandboxes.md](https://www.daytona.io/docs/en/sandboxes.md). Only `us` and `eu` shared. 2.0: `A Linux sandbox may guarantee at most **16 cores**, **32GiB memory**, and **256GiB disk**.` — [com/sandboxes](https://www.daytona.com/docs/sandboxes.md) |
| billing-models | partly | $0.0504/vCPU-hour | **yes** (new GPU meters) | `vCPU $0.0504/h`, `Memory GiB $0.0162/h`, `Storage GiB $0.000108/h`, `Windows $0.0858/vCPU/h` — [pricing](https://www.daytona.io/pricing) (fresh). New: nine GPU types each with `Preemptible ($/hour)` **and** `On-demand ($/hour)` lists, L40S $1.14/$1.99; wallet now has `GPU credits` and `spot GPU credits` — [gpu-sandboxes.md](https://www.daytona.io/docs/en/gpu-sandboxes.md) |
| trials-free-tiers | yes | $200 credit, no card | no (2.0 trial is the same $200; the paid plan adds credit) | `$200 in free compute included` + `Sign up for a free trial - no credit card required` — [pricing](https://www.daytona.io/pricing); `Free credit balance: … not available for GPU sandboxes` — [billing.md](https://www.daytona.io/docs/en/billing.md). 2.0: Starter `$200 one time`, Team `$100 / month free credits` — [com/pricing](https://www.daytona.com/pricing) |
| lifecycle | partly | VM pause: RAM; container stop | no | `Stopping terminates the running container. The filesystem is preserved, but memory state is not.`; `Pause / resume sandboxes \| ✗ \| ✓ \| ✓ \| ✗` (Container / Linux VM / Windows / GPU) — [sandboxes.md](https://www.daytona.io/docs/en/sandboxes.md) |
| snapshots-forks | partly | Hot: RAM (VM); cold: disk | no | `container sandboxes capture filesystem state only (**cold snapshots**), VM sandboxes capture filesystem and memory state (**hot snapshots**)`; `Forking creates a duplicate of a Linux VM sandbox's filesystem and memory state` — [snapshots.md](https://www.daytona.io/docs/en/snapshots.md), [sandboxes.md](https://www.daytona.io/docs/en/sandboxes.md) |
| storage | partly | 10 GiB cap; volumes free | no (1.x) / **yes (2.0)** | `Daytona volumes are included at no additional cost. Each organization can create up to 100 volumes, and volume data does not count against your storage quota.` — [volumes.md](https://www.daytona.io/docs/en/volumes.md). 2.0 volumes are billed: `Volumes (Stateful)$0.000108` and disk volumes `from 1 to 1000 GiB` — [com/pricing](https://www.daytona.com/pricing), [com/volumes](https://www.daytona.com/docs/volumes.md) |
| idle-timers | partly | 15 min container; 60 min VM | no (wording clarified) | `if not set, the default interval of 15 minutes is used`; `non-ephemeral sandbox classes that support pausing default to an auto-pause interval of 60 minutes with auto-stop disabled` — [sandboxes.md](https://www.daytona.io/docs/en/sandboxes.md). New clarification: auto-**pause** ignores preview traffic — `Interactions through [sandbox previews] do not reset the timer.` |
| reaching-it | partly | Token, or signed URL | no | `If a sandbox has its public property set to true, preview links are publicly accessible without authentication.`; `there is no way to revoke a standard preview token`; signed `Default: 60 seconds`, `Maximum: 86,400 seconds (24 hours)` — [preview.md](https://www.daytona.io/docs/en/preview.md) |
| custom-domains | partly | Own proxy | no (1.x) / **yes (2.0: Beta)** | `host your proxy under your own domain` — [custom-preview-proxy.md](https://www.daytona.io/docs/en/custom-preview-proxy.md). 2.0 lists `Custom domains Beta` on Team — [com/pricing](https://www.daytona.com/pricing) |
| outbound-network | partly | Tier 3 for internet | no (1.x) / **yes (2.0: open by default)** | `**Tier 1 & Tier 2**: Network access is restricted and cannot be overridden at the sandbox level.`; `**Tier 3 & Tier 4**: Full internet access is available by default` — [network-limits.md](https://www.daytona.io/docs/en/network-limits.md). 2.0: `Egress is open by default.` — [com/network-limits](https://www.daytona.com/docs/network-limits.md) |
| keys-secrets | yes | No, proxy headers only | no (1.x) / **yes (2.0)** | `The proxy substitutes placeholders in HTTPS request headers only.` … `Request bodies` / `URL query parameters` are not substituted — [secrets.md](https://www.daytona.io/docs/en/secrets.md). 2.0: `in the request line and query string, in every request header, and in the request body` — [com/secrets](https://www.daytona.com/docs/secrets.md) |
| ways-to-drive | yes | Yes, playground | no | `Daytona provides an interactive environment ("Playground") for creating sandboxes, running SDK operations, and exploring Daytona features directly from your browser.` — [playground.md](https://www.daytona.io/docs/en/playground.md). Five SDKs + CLI + REST + MCP + web terminal + VNC + webhooks (support-gated) |
| built-in-agents | partly | **Claude Code, Codex, OpenClaw, OpenCode; no prompt API** | **yes** (note) | Baseline said "No agent is preinstalled". Default snapshots now list `@anthropic-ai/claude-code v2.1.220`, `@openai/codex v0.146.0`, `openclaw v2026.7.1-2`, `opencode-ai v1.18.14` — [snapshots.md](https://www.daytona.io/docs/en/snapshots.md). Still no hosted loop or prompt call: the Codex guide prints `Installing Codex agent in sandbox...` and drives it from a local CLI. |
| teams-accounts | partly | Org-wide resource pool | no | `Every member of an organization can address that organization's running sandboxes — running processes, reading and writing files, opening preview URLs and using the web terminal and the Computer Use desktop — whatever assignments they hold, including none.` — [organizations.md](https://www.daytona.io/docs/en/organizations.md) |
| company | partly | Daytona Platforms Inc.; 99.95% Tier 4+ | no (adds 2.0) | SLA `99.95%`, credits `**Tier 4 and above customers** may request a Service Credit` — [sla](https://www.daytona.io/sla), last updated **Aug 22, 2025**. Terms still dated **Aug 22, 2025**; their Runtime definition now reads `container or microVM environment` — [terms](https://www.daytona.io/terms-of-service). SOC 2 Type 1 + Type 2 + HIPAA + GDPR listed — [trust](https://trust.daytona.io/) |

### Feature notes that matter to a buyer

- **`built-in-agents`**: the distinction the feature page draws is installed vs hosted vs prompt-through-API. Daytona now does the first, not the second or third. The row must say agents are preinstalled; the verdict stays `partly` because there is still no prompt endpoint and no managed model credentials.
- **`billing-models`**: 1.x is still reserved-resource billing. 2.0 is a **measured** meter with a guaranteed floor: `CPU and memory usage within the guarantee is billed at the guarantee; usage above it … is billed as measured.` This is a different shape from anything in the feature's "four shapes", and the $250/month Team plan with $100 of expiring credit is the plan-fee shape again.
- **`storage`**: 1.x volumes are free and not quota-counted; 2.0 volumes are billed at $0.000108/GiB-h **and** bucket-volume traffic is billed per uploaded GiB, downloaded GiB and 1,000 requests (rate not published).
- **`idle-timers`**: the 15-minute auto-stop still ignores a running build. Auto-pause (VM) additionally ignores preview traffic, so a VM serving a preview can pause after 60 minutes unless something else touches it.

---

# 2. All 78 capabilities

Format: **verdict** · figure/shortfall · verbatim quote (source) · Δ versus the 2026-10-28 row. Quotes keep the docs' wording; Markdown emphasis (`**`), link targets and table pipes are normalized where noted, never the words. `Δ no` means re-read and still true; `Δ note` means verdict unchanged but the wording must change; `Δ YES` is a verdict change.

URLs are the `.md` pages the docs themselves serve; the rendered page is the same path without `.md`.

## Isolation (5)

- **own-vm** — **partly** · containers by default · `Sandboxes run as **Linux containers** by default.` [sandboxes](https://www.daytona.io/docs/en/sandboxes.md) · Δ no for 1.x. **Δ YES for 2.0**: every sandbox is a VM — `A sandbox is a hardware-isolated virtual machine with its own kernel, filesystem, network stack, and allocated vCPU, RAM, and disk` (Firecracker for Linux, Cloud Hypervisor for Windows/GPU, Apple Virtualization for macOS) [com/sandboxes](https://www.daytona.com/docs/sandboxes.md)
- **root** — **yes** · root in the sandbox · `Code runs as root inside the sandbox without affecting the runner.` [isolation](https://www.daytona.io/docs/en/isolation.md) · Δ no
- **docker-inside** — **yes** · Docker-in-Docker · `Sandboxes can run Docker containers inside them (**Docker-in-Docker**)` [snapshots](https://www.daytona.io/docs/en/snapshots.md) · Δ no
- **nested-virt** — **partly** · Linux VM class only · `KVM sandboxes must be enabled for your organization.` [sandboxes](https://www.daytona.io/docs/en/sandboxes.md) · Δ no. 2.0 exposes KVM as a plan feature (`KVM access (nested virtualization)`) rather than a support switch.
- **custom-image** — **yes** · Dockerfile or OCI image · `Dockerfile and declarative image builds are not supported for the Linux VM sandbox class` (link markup normalized; containers/GPU are) [snapshots](https://www.daytona.io/docs/en/snapshots.md) · Δ no

## Sizes and regions (6)

- **any-size** — **partly** · presets, custom on request · Custom tier: `Contact [support@daytona.io](mailto:support@daytona.io)` [limits](https://www.daytona.io/docs/en/limits.md) · Δ no
- **big-machines** — **partly** · 4 cores / 8 GiB; more with GPUs · `**4 vCPUs**, **8GB RAM**, and **10GB disk**`; each GPU adds `**16 vCPUs**, **192GB RAM**, and **512GB disk**` [sandboxes](https://www.daytona.io/docs/en/sandboxes.md) · Δ no. **2.0: yes** — 16 cores / 32 GiB per Linux sandbox, plan table advertises 64 cores / 128 GiB.
- **live-resize** — **partly** · grow only, support must enable · `Sandbox resizing must be enabled for your organization.` … `On a running sandbox, you can increase CPU and memory without interruption.` … `Disk size can only be increased and cannot be decreased.` [sandboxes](https://www.daytona.io/docs/en/sandboxes.md) · Δ no
- **gpu** — **yes** · up to 8 GPUs · `A GPU sandbox has up to **8** GPU units.` [gpu-sandboxes](https://www.daytona.io/docs/en/gpu-sandboxes.md) · Δ **note**. Two capacity classes now: `GPU sandboxes are on-demand.` and `Spot GPU sandboxes are preemptible`. The old note "Graphics machines are preemptible" is now only true of spot; on-demand is reserved. Nine types, **L40S added 7 Nov**: H100, H200, B200, B300, RTX PRO 6000, RTX 4090, RTX 5090, L40S, AMD MI355X. Shared-region GPUs still land in `earth` and ignore the requested region; dedicated/custom regions keep their real region ID.
- **choose-region** — **yes** · US or EU · `| United States | **us** |` / `| Europe | **eu** |` [regions](https://www.daytona.io/docs/en/regions.md) · Δ **note**: shared GPU ignores the choice, but `GPU sandboxes on dedicated and custom regions keep their real region ID`. Dedicated regions are single-tenant, sales-led.
- **eu-region** — **yes** · eu region · same table [regions](https://www.daytona.io/docs/en/regions.md) · Δ no

## Lifecycle (3)

- **pause-memory** — **partly** · VM only · `Pause / resume sandboxes | ✗ | ✓ | ✓ | ✗` (Container / Linux VM / Windows / GPU); `The filesystem and memory state are preserved` [sandboxes](https://www.daytona.io/docs/en/sandboxes.md) · Δ no
- **warm-pool** — **partly** · support must enable · `Warm pools must be enabled for your organization.` [warm-pools](https://www.daytona.io/docs/en/warm-pools.md) · Δ no. One pool per snapshot per region; pool sandboxes `count against your organization quota in the same way as regular sandboxes`.
- **fast-start** — **yes** · under 90 ms · `Sub 90ms sandbox creation from code to execution.` [homepage](https://www.daytona.io/) · Δ no. Careers still says `sub 200ms startup times` — contradiction retained.

## Snapshots and forks (6)

- **snapshot-files** — **yes** · cold snapshot of a stopped sandbox · `container sandboxes capture filesystem state only (**cold snapshots**)` [snapshots](https://www.daytona.io/docs/en/snapshots.md) · Δ no
- **snapshot-memory** — **partly** · VM only · `VM sandboxes capture filesystem and memory state (**hot snapshots**)`; hot requires `Started` [snapshots](https://www.daytona.io/docs/en/snapshots.md) · Δ no
- **fork-running** — **yes** · VM only; parent pinned while children live · `Forking creates a duplicate of a Linux VM sandbox's filesystem and memory state in a new sandbox.` / `The parent sandbox cannot be deleted while it has active fork children.` [sandboxes](https://www.daytona.io/docs/en/sandboxes.md) · Δ no. Forking a KVM sandbox inherits `kvm` and 403s if KVM is not enabled.
- **older-snapshot** — **yes** · any number of sandboxes from one snapshot · `any number of new sandboxes can start from the same snapshot` [snapshots](https://www.daytona.io/docs/en/snapshots.md) · Δ no
- **templates** — **yes** · snapshot from image or Dockerfile, then create · `Create snapshots from an image … Daytona builds it into a snapshot you can use to create sandboxes` [snapshots](https://www.daytona.io/docs/en/snapshots.md) · Δ no
- **backups** — **partly** (was no) · one rolling recovery backup · `Daytona can restore the sandbox from its last successful backup`; the Sandbox object exposes `backup_state` and `backup_created_at` [troubleshooting](https://www.daytona.io/docs/en/troubleshooting.md), [python-sdk/sandbox](https://www.daytona.io/docs/en/python-sdk/sync/sandbox.md) · **Δ YES**. Shortfall: schedule, retention, export and restore-to-new-machine are not published, and a user cannot take or name a backup; the advertised `snapshots` remain the user-facing mechanism.

## Storage (5)

- **files-survive-stop** — **yes** · whole disk persists and bills · `it stays on the runner and counts against disk quota while stopped` [persistence](https://www.daytona.io/docs/en/persistence.md) · Δ no
- **volumes** — **yes** · S3-backed FUSE, free, 100/org · `Daytona volumes are included at no additional cost. Each organization can create up to 100 volumes` [volumes](https://www.daytona.io/docs/en/volumes.md) · Δ no for 1.x. **2.0: partly** — volumes are metered at $0.000108/GiB-h and bucket traffic is billed.
- **shared-volume** — **yes** · last write wins · `If two sandboxes write to the same path concurrently, the last write wins.` [volumes](https://www.daytona.io/docs/en/volumes.md) · Δ no. New: per-tenant **subpaths** isolate one volume tree per sandbox.
- **mount-buckets** — **yes** · broader than before · `Amazon S3, Cloudflare R2, Tigris, Supabase Storage, Google Cloud Storage, Azure Blob` plus `Box`, `Archil`, `MesaFS`, `TiDB Cloud Filesystem` [mount-external-storage](https://www.daytona.io/docs/en/mount-external-storage.md) · Δ **note** (baseline said S3/R2/Tigris; the list grew)
- **big-disk** — **no** · 10 GiB cap · `Disk | GiB | 3 | 1 | 10` (table row, markup normalized) [sandboxes](https://www.daytona.io/docs/en/sandboxes.md) · Δ no for 1.x. **2.0: yes** — 256 GiB max, 512 GiB–3 TiB ephemeral per plan.

## Idle timers (4)

- **stay-on** — **yes** · auto-stop 0 · `**0**: disables the auto-stop functionality, allowing the sandbox to run indefinitely` [sandboxes](https://www.daytona.io/docs/en/sandboxes.md) · Δ no. A TTL still wins if set.
- **choose-idle** — **yes** · minutes, or 0 · `Set auto-stop interval to the desired value in minutes` [sandboxes](https://www.daytona.io/docs/en/sandboxes.md) · Δ no. Four separate intervals: stop, pause, archive, delete.
- **wake-on-request** — **no** · request does not start it · The only documented start-on-request path is the sample proxy, which `automatically start[s] stopped sandboxes before forwarding users`; the preview page itself describes no auto-start and the state table starts a sandbox only when `A start is requested` [custom-preview-proxy](https://www.daytona.io/docs/en/custom-preview-proxy.md) · Δ no
- **schedules** — **no** · no scheduler · The only time controls are inactivity intervals and a wall-clock TTL; TTL `destroys the sandbox` but does not start one [sandboxes](https://www.daytona.io/docs/en/sandboxes.md) · Δ no

## Reaching it (8)

- **public-url** — **yes** · public flag · `If a sandbox has its public property set to true, preview links are publicly accessible without authentication.` [preview](https://www.daytona.io/docs/en/preview.md) · Δ no
- **private-url** — **yes** · token or signed link · `Otherwise, authentication is required.`; signed links are `bound to a single port, expires, and can be revoked` [preview](https://www.daytona.io/docs/en/preview.md) · Δ no
- **ssh** — **yes** · token, 60 min default · `Set the expiration time (defaults to 60 minutes)` [ssh-access](https://www.daytona.io/docs/en/ssh-access.md) · Δ no
- **web-terminal** — **yes** · dashboard, port 22222 · `The web terminal runs on port 22222 inside each sandbox.` [web-terminal](https://www.daytona.io/docs/en/web-terminal.md) · Δ no
- **tunnel** — **not-published** · no local port forwarding documented · `This allows you to connect from local terminals, IDEs, and development tools without installing additional software.` — the page documents plain `daytona ssh <sandbox>` only; no `-L`/forwarding flag or section exists in the 192-page corpus [ssh-access](https://www.daytona.io/docs/en/ssh-access.md) · Δ no
- **raw-tcp** — **not-published** · preview is HTTP(S) · `Any process listening for HTTP traffic on ports 1 - 65535 can be previewed` [preview](https://www.daytona.io/docs/en/preview.md) · Δ no. Linked sandboxes now give private TCP between sandboxes (`telnet LINKED_SANDBOX_ID 5555`), not a public port.
- **custom-domain** — **partly** · own proxy · `host your proxy under your own domain` [custom-preview-proxy](https://www.daytona.io/docs/en/custom-preview-proxy.md) · Δ no for 1.x. **2.0: yes, Beta** on Team.
- **auto-https** — **no** · you run the proxy and its certificate · same page; the provider's certificate is for its own proxy domain · Δ no

## Outbound network (4)

- **egress-included** — **not-published** · no outbound byte price or allowance · The price card's only allowance is storage: `Price per **GiB** after first 5 free`; compute, memory, Windows and GPU are the other rows and no egress row exists [pricing](https://www.daytona.io/pricing) · Δ no
- **egress-allowlist** — **yes** · CIDR, domain or upstream proxy · `networkAllowList for IPv4 CIDR ranges`, `domainAllowList for domains and wildcard domains` [network-limits](https://www.daytona.io/docs/en/network-limits.md) · Δ no
- **no-internet** — **yes** · block-all · `networkBlockAll to block all outbound traffic` [network-limits](https://www.daytona.io/docs/en/network-limits.md) · Δ no
- **static-ip** — **not-published** · no fixed egress address · No static/dedicated egress IP in docs, pricing or FAQ · Δ no for 1.x. **2.0: yes, Beta** — `Static egress IPs (Beta)` on Team.

## Keys and secrets (3)

- **secrets-store** — **yes** · stored, proxy-substituted · `Secrets are project-scoped, encrypted credentials that Daytona injects into a sandbox's outbound HTTPS traffic without ever placing the plaintext inside the sandbox.` [secrets](https://www.daytona.io/docs/en/secrets.md) · Δ no
- **hidden-secrets** — **yes** · header only · `The proxy substitutes placeholders in HTTPS request headers only.` … `Request bodies` and `URL query parameters` are listed as not substituted [secrets](https://www.daytona.io/docs/en/secrets.md) · Δ no for 1.x. **2.0: yes, everywhere** — request line, query, every header and body; only cleartext HTTP and >1 MiB bodies are excluded.
- **scoped-keys** — **yes** · permission scopes · `Sandbox runtime access is not a grantable scope. Any API key valid for an organization can address that organization's running sandboxes through the toolbox` [api-keys](https://www.daytona.io/docs/en/api-keys.md) · Δ no

## Ways to drive it (8)

- **dashboard-create** — **yes** · Playground · `an interactive environment ("Playground") for creating sandboxes, running SDK operations, and exploring Daytona features directly from your browser` [playground](https://www.daytona.io/docs/en/playground.md) · Δ no
- **cli** — **yes** · create/exec/ssh/snapshot/MCP · CLI reference lists lifecycle, snapshots, `daytona mcp init claude` [cli](https://www.daytona.io/docs/en/tools/cli.md), [mcp](https://www.daytona.io/docs/en/mcp.md) · Δ no
- **python-sdk** — **yes** · one of five · `Python`, `TypeScript`, `Ruby`, `Go`, and `Java` SDKs [architecture](https://www.daytona.io/docs/en/architecture.md) · Δ no
- **ts-sdk** — **yes** · one of five · same · Δ no
- **rest-api** — **yes** · `NestJS-based RESTful service` · same · Δ no
- **mcp-server** — **yes** · first-party, six tool groups · `MCP server provides the following tools for interacting with Daytona Sandboxes` — sandbox management, files, git, process/code execution, computer use and preview [mcp](https://www.daytona.io/docs/en/mcp.md) · Δ no
- **pty** — **yes** · PTY sessions API · `Daytona provides powerful pseudo terminal (PTY) capabilities through the process module` [pty](https://www.daytona.io/docs/en/pty.md) · Δ no
- **file-api** — **yes** · `fs` module · `The fs module covers listing directories, reading file metadata, creating directories, uploading and downloading files…` [file-system-operations](https://www.daytona.io/docs/en/file-system-operations.md) · Δ no

## Built-in agents (7)

- **agents-preinstalled** — **yes** (was partly) · Claude Code, Codex, OpenClaw, OpenCode · `Default snapshots include pre-installed Python and Node.js packages.` Table: `@anthropic-ai/claude-code v2.1.220`, `@openai/codex v0.146.0`, `openclaw v2026.7.1-2`, `opencode-ai v1.18.14` [snapshots](https://www.daytona.io/docs/en/snapshots.md) · **Δ YES**. Catch: the Codex guide still prints `Installing Codex agent in sandbox...`, so guides do not rely on the preinstall.
- **prompt-api** — **no** · no hosted loop or prompt call · The agent is a binary you drive over PTY/exec; the platform has no prompt endpoint. 2.0 docs are the same: toolbox only. [pty](https://www.daytona.io/docs/en/pty.md) · Δ no
- **one-click-hermes** — **no** · not documented · 192-page corpus has no "Hermes" page or mention · Δ no
- **one-click-openclaw** — **partly** · preinstalled, still needs a terminal · `OpenClaw comes preinstalled in the default Daytona snapshot` but the guide then runs `daytona ssh`, onboarding and `start the gateway` [openclaw guide](https://www.daytona.io/docs/en/guides/openclaw/openclaw-run-secure-sandbox.md) · Δ no
- **browser** — **yes** (was not-published) · Chromium · `It builds on Daytona's standard sandbox image, which already carries Chromium and ffmpeg for Devin's browser and screen tooling` [Devin Outposts guide](https://www.daytona.io/docs/en/guides/devin/devin-outposts.md); the computer-use guide launches `chromium` on a default-snapshot sandbox with no install step [OpenAI computer use](https://www.daytona.io/docs/en/guides/openai/openai-computer-use-helpers.md) · **Δ YES**
- **desktop** — **yes** · VNC + computer-use API · `Computer Use enables programmatic control of desktop environments within sandboxes. It provides mouse, keyboard, screenshot, screen recording, and display operations` [computer-use](https://www.daytona.io/docs/en/computer-use.md); `VNC … provides a graphical desktop environment for your Daytona Sandbox directly in the browser` [vnc-access](https://www.daytona.io/docs/en/vnc-access.md) · Δ no
- **hosts-other-agents** — **yes** · wider than before · First-party guides now cover Claude Code **and Claude managed agents**, Codex **and the OpenAI Agents API self-hosted**, Gemini CLI **and Gemini managed agents**, Cursor **self-hosted machines**, **Devin Outposts**, OpenCode, Amp, Kiro, Kimi CLI, Letta Code, Pi, Flue and Brainbase [guides index](https://www.daytona.io/docs/en/guides.md) · Δ **note** (list grew)

## Teams and accounts (6)

- **team-workspace** — **yes** · org with members, roles, shared sandboxes · `Organizations` page distinguishes personal from collaborative; `Multiple users (invite-based)` [organizations](https://www.daytona.io/docs/en/organizations.md) · Δ no
- **roles** — **partly** · roles gate admin, not running sandboxes · `Assignments govern what a member can do to the organization's resources … They do not govern what a member can do inside a running sandbox.` [organizations](https://www.daytona.io/docs/en/organizations.md) · Δ no
- **sso** — **partly** · Enterprise only · `SSO is available on the Enterprise plan for collaborative organizations. Personal organizations cannot configure SSO.` [sso](https://www.daytona.io/docs/en/sso.md) · Δ no
- **spend-cap** — **partly** · prepaid resource pool, not a dollar cap · Tiers set an org-wide vCPU/RAM/storage pool (`10 / 10GiB / 30GiB` at Tier 1); there is no per-project budget in 1.x. Terms add: `may be suspended until the balance is paid or brought back to zero or positive` [limits](https://www.daytona.io/docs/en/limits.md), [terms](https://www.daytona.io/terms-of-service) · Δ **note** (negative-balance suspension is new wording; 2.0 adds `Project-level budgets` on Team)
- **usage-alerts** — **not-published** · no threshold or budget alert · `Automatic top-up adds credits to your wallet when the balance drops below a certain threshold.` — the only balance-triggered action; no alert, email or budget threshold is documented [billing](https://www.daytona.io/docs/en/billing.md) · Δ no
- **audit-log** — **partly** · role-gated, export missing · `**Compliance Export**: export logs for internal or external audits (coming soon)`; `available to administrators with full access and members with audit log permissions` [audit-logs](https://www.daytona.io/docs/en/audit-logs.md) · Δ no

## Billing model (5)

- **per-second** — **yes** · per second · `All billing is calculated per second.` [pricing](https://www.daytona.io/pricing) · Δ no
- **active-cpu** — **no** · reserved vCPU · `Sandboxes are billed for the resources reserved: **vCPU**, **RAM**, and **disk**` [billing](https://www.daytona.io/docs/en/billing.md) · Δ no for 1.x. **2.0: partly** — CPU/memory billed at the greater of measured use and the guarantee, so an idle box still pays its guarantee but a busy one pays more.
- **cheap-pause** — **yes** · disk only · `| Paused | ✗ | ✗ | ✓ |` … `The preserved memory state is not billed.` [billing](https://www.daytona.io/docs/en/billing.md) · Δ no for 1.x. **2.0: yes, $0** — `Stopped, paused, and deleted sandboxes are not metered for CPU, memory, or disk.`
- **no-monthly-fee** — **yes** · none · `Pay as you go with usage-based pricing`; no plan price on the page [pricing](https://www.daytona.io/pricing) · Δ no for 1.x. **2.0: no** — Team is `$250 + compute / month`.
- **flat-price** — **no** · three meters · vCPU + memory + disk per second, plus Windows and GPU [billing](https://www.daytona.io/docs/en/billing.md) · Δ no

## Trials and free tiers (3)

- **free-tier** — **no** · one-off $200 · `$200 in free compute included` (bold normalized); no recurring allowance [pricing](https://www.daytona.io/pricing) · Δ no for 1.x. **2.0: no** — Team's `$100 / month free credits` are part of a paid plan and `expire at the end of the billing period`.
- **free-credit** — **yes** · $200 · same; `not available for GPU sandboxes` [billing](https://www.daytona.io/docs/en/billing.md) · Δ no. 2.0 adds separate `GPU credits` and `spot GPU credits` balances.
- **no-card** — **yes** · no card · `Sign up for a free trial - no credit card required` [pricing](https://www.daytona.io/pricing) · Δ no

## Company (5)

- **status-page** — **yes** · Better Stack, Global + Sandbox · `All services are online`; components `app.daytona.io / API endpoint` and `Sandbox creation` [status](https://status.app.daytona.io/) · Δ **note**: the lowest of the three displayed figures is now **99.675%** (sandbox creation; the widest is 99.893%) vs 99.768% at baseline; today's incident 01:20–03:57 UTC, `the daytona api was slow or timing out, and sandbox create, start, stop and archive operations were delayed or failed`.
- **sla** — **partly** · 99.95%, Tier 4+ only · `Daytona will use commercially reasonable efforts to make the Services available **99.95%** of the time`; `**Tier 4 and above customers** may request a Service Credit` [sla](https://www.daytona.io/sla) · Δ no
- **soc2** — **yes** · Type 1 + Type 2 · Trust Center lists `SOC 2 Type 1` and `SOC 2 Type 2` under Compliance, alongside HIPAA and GDPR [trust](https://trust.daytona.io/) · Δ no
- **dpa** — **yes** · public DPA · `The competent supervisory authority shall be the Irish Data Protection Commission`; subprocessor changes get `At least thirty (30) days` notice [dpa](https://www.daytona.io/dpa) · Δ no
- **open-source** — **partly** · BYOC + archived repo · GitHub API: `"archived": true`, last push **2026-07-24**; BYOC still `must be enabled for your organization` [github](https://github.com/daytonaio/daytona), [BYOC](https://www.daytona.io/docs/en/bring-your-own-compute.md) · Δ no. 2.0 adds Enterprise-only `BYOC deployment` and `Cloud marketplaces (Beta)`.

**Tally:** 78 rows. Verdict changes: `agents-preinstalled` (partly→yes), `browser` (not-published→yes), `backups` (no→partly). Note-only changes: `gpu`, `choose-region`, `mount-buckets`, `spend-cap`, `status-page`, `hosts-other-agents`. Everything else unchanged for the `daytona.io` product.

---

# 3. Rate-card inputs

## 3.1 `daytona.io` (the product the current card models) — no rate changed

Read twice on 2026-11-12, once by Context `web_scrape` (`maxAgeMs: 0`, cache `miss`) and once by TinyFish `fetch_content` (`ttl: 0`), plus the billing doc via curl. Original units as published:

| Input | Published value | Unit | Card field | Changed? |
|---|---|---|---|---|
| vCPU | `$0.0504/h` | per vCPU-hour, per second | `cpu.rate` | no |
| Memory | `$0.0162/h` | per GiB-hour, per second | `ram.rate` | no |
| Storage | `$0.000108/h` | per GiB-hour, first 5 GiB free | `disk.running` / `disk.stopped` | no |
| Storage allowance | `Price per **GiB** after first 5 free` | 5 GiB free; scope not stated | `disk.included: 5` | no |
| Windows | `$0.0858/vCPU/h` | per vCPU-hour, separate OS row | not modelled | no |
| Plan fee | none | pay-as-you-go | `plans[0].fee: 0` | no |
| Free credit | `$200 in free compute included` | one-time, no card, GPU excluded | note | no |
| Billing period | `All billing is calculated per second.` | second | `per-second` | no |
| Max disk | 10 GiB per sandbox | GiB | `maxDisk: 10` | no |
| Egress | not on the card | — | `egress.perGiB: null` | no |
| Volumes | `included at no additional cost`, 100/org | — | not in card | no |
| Tiers | $25 / $500 / $2,000 top-up | USD | not in card | no |

**GPU: new meters the rate card does not have.** The 1.x pricing page now publishes two columns, `Preemptible ($/hour)` and `On-demand ($/hour)`, for nine types. Baseline research recorded one preemptible list of eight types and no on-demand tier; **L40S is new (changelog v0.231.0, 7 Nov 2026)** and on-demand capacity is now the default (`GPU sandboxes are on-demand` — [gpu-sandboxes](https://www.daytona.io/docs/en/gpu-sandboxes.md)).

| GPU | Preemptible $/h | On-demand $/h |
|---|---:|---:|
| NVIDIA RTX 4090 | 0.57 | 0.99 |
| NVIDIA RTX 5090 | 0.74 | 1.29 |
| NVIDIA L40S | 1.14 | 1.99 |
| NVIDIA RTX PRO 6000 | 1.74 | 3.03 |
| NVIDIA H100 | 2.27 | 3.95 |
| NVIDIA H200 | 2.61 | 4.54 |
| AMD MI355X | 3.44 | 5.99 |
| NVIDIA B200 | 3.59 | 6.25 |
| NVIDIA B300 | 4.08 | 6.25 |

Wallet semantics also changed: `On-demand GPU sandboxes require GPU credits. Spot GPU sandboxes require GPU credits or spot GPU credits.` [gpu-sandboxes](https://www.daytona.io/docs/en/gpu-sandboxes.md). The free $200 is still `not available for GPU sandboxes` [billing](https://www.daytona.io/docs/en/billing.md). Spot needs `Tier 2 or higher`; on-demand does not count against the tier pool and has its own GPU quota under `earth` [limits](https://www.daytona.io/docs/en/limits.md). The billing page never states the GPU meter's unit beyond the price page's `$/hour`, and it still says only `vCPU`, `RAM` and `disk` are billed — so whether the GPU price is additive to the vCPU/RAM/disk of the same sandbox is **not published**. Treat GPU totals as a separate, unmodelled line.

## 3.2 `daytona.com` 2.0 — a different rate card

Fresh Context + TinyFish reads of [daytona.com/pricing](https://www.daytona.com/pricing) and [docs/billing](https://www.daytona.com/docs/billing.md). The estimator's own worked line is `2,000 hours × $0.1865 / hr` for 2 cores + 4 GiB, i.e. 2×0.0706 + 4×0.0113.

| Input | 2.0 value | Unit | Notes |
|---|---|---|---|
| CPU, baseline | `$0.0706` | per **core**-hour | AMD Zen 3 / Intel Ice Lake / AWS Graviton 4 / Apple M4 |
| CPU, mid | `$0.118` | per core-hour | Zen 4 / Intel Rapids / Graviton 5 / M4 Pro |
| CPU, top | `$0.164` | per core-hour | Zen 5 / M5 Pro |
| Core definition | `One core is equivalent to 2 vCPUs where SMT is available and enabled` | — | 1 vCPU otherwise; baseline ≈ $0.0353/vCPU-h on SMT parts |
| Memory | `$0.0113` | per GiB-hour | |
| Ephemeral disk | `$0.000` | per GiB-hour | `NVMe SSD (Ephemeral)` |
| Volumes | `$0.000108` | per GiB-hour | stateful; plus bucket traffic per GiB and per 1k requests, rate unpublished |
| Windows | `$0.12` | per core-hour | OS meter |
| macOS | `$0.00574` | per core-hour | **plus** the Mac reservation below |
| Linux | `$0.000` | per core-hour | |
| GPU | $0.57–$5.17 | per GPU-hour | 4090 0.57, 5090 0.74, L40S 1.14, RTX PRO 6000 1.95, H100 2.47, H200 2.87, MI355X 3.56, B200 4.30, B300 5.17 |
| Spot / preemptible | 0.7× | multiplier | `Preemptible is 30% off cores and memory; it may be reclaimed` |
| Region | 1.15–2× | multiplier on base | `Region selection 1.15 – 2x base prices` |
| Plan, Starter | $0 + compute | per month | $200 one-time credit, 100 sandboxes, 24 h sessions, 3 members |
| Plan, Team | `$250` + compute | per month | `$100 / month free credits` that `expire at the end of the billing period`; 5,000 sandboxes; 48 h sessions |
| Plan, Enterprise | Custom | — | SSO, audit logs, HIPAA, KVM, BYOC |
| Free credit | $200 one-time | USD | no card |
| macOS reservation | `$2.5032 per Mac-hour, $60.08 per 24-hour period` | per Mac, 24 h minimum | M4 Pro 12c/24 GB/220 GB; up to 2 sandboxes; no early end |
| Stopped / paused | `not metered for CPU, memory, or disk` | — | only volumes persist and bill |
| Sandbox max (docs) | 16 cores / 32 GiB / 256 GiB | per sandbox | [com/limits](https://www.daytona.com/docs/limits.md) |
| Sandbox max (pricing table) | 64 cores / 128 GiB / 512 GiB (Starter), 1 TiB (Team), 3 TiB (Enterprise) | per sandbox | contradiction, see §4 |
| Session cap | 24 h Starter / 48 h Team | per sandbox | `Session length` |

**Which inputs changed, for the parent's arithmetic (no totals recomputed):**

1. **CPU unit** — vCPU-hour → core-hour, with 1 core = 2 vCPU on SMT. A 2-vCPU sandbox is 1 core on SMT hosts, so the comparable CPU rate is $0.0353/h, not $0.0706/h. Apple silicon and Graviton are explicitly **not** SMT, so the same 2-vCPU shape is 2 cores there.
2. **CPU rate** — $0.0504/vCPU-h → $0.0353/vCPU-h baseline (−30%), $0.059/vCPU-h mid, $0.082/vCPU-h top.
3. **Memory rate** — $0.0162 → $0.0113/GiB-h (−30%).
4. **Disk rate** — running $0.000108/GiB-h → **$0** for ephemeral NVMe; stateful volumes stay $0.000108. The 5 GiB free allowance disappears (it was a storage allowance; 2.0 ephemeral disk is simply free, volumes bill from byte one).
5. **Stopped-state cost** — disk-only → **$0** for the sandbox; only volumes bill.
6. **Disk cap** — 10 GiB → 256 GiB (docs) or 512 GiB–3 TiB (plan table).
7. **Minimum billing unit / rounding** — still per second; no minimum published.
8. **Plan fee** — $0 → $0 Starter or $250/month Team; Team credits are $100/month and expire.
9. **Free credit** — $200 one-time → $200 one-time (Starter) **or** $100/month included with a paid plan. Not a free tier either way.
10. **Egress** — no published meter → volumes traffic billed per GiB/request, rate still unpublished.
11. **GPU** — per-GPU-hour on-demand/spot **plus** separate GPU credit balances; no longer a single preemptible list.
12. **Region pricing** — flat `us`/`eu` → per-region multipliers 1.15–2×.

The `RateCard` cannot express (2) core-vs-vCPU, (7) the two-dimensional guarantee/limit, (10) unpublished bucket traffic, or (11) GPU credit balances. If the site adopts 2.0, those are explicit model limitations, not zeros.

---

# 4. First-party contradictions (both sides quoted)

### 4.1 The same company sells two platforms that disagree about what a sandbox is

| Question | `daytona.io` (1.x) | `daytona.com` (2.0) |
|---|---|---|
| Isolation | `Sandboxes run as **Linux containers** by default.` [sandboxes](https://www.daytona.io/docs/en/sandboxes.md) | `A sandbox is a hardware-isolated virtual machine with its own kernel, filesystem, network stack, and allocated vCPU, RAM, and disk` [com/sandboxes](https://www.daytona.com/docs/sandboxes.md) |
| CPU unit | `vCPU $0.0504/h` [pricing](https://www.daytona.io/pricing) | `core* / hour … $0.0706` [com/pricing](https://www.daytona.com/pricing) |
| Plan fee | none; pay-as-you-go | `Team $250 + compute / month` [com/pricing](https://www.daytona.com/pricing) |
| Stopped sandbox | `Billed for reserved disk only.` [billing](https://www.daytona.io/docs/en/billing.md) | `Stopped, paused, and deleted sandboxes are not metered for CPU, memory, or disk.` [com/billing](https://www.daytona.com/docs/billing.md) |
| Disk cap | `**10GB disk**` [sandboxes](https://www.daytona.io/docs/en/sandboxes.md) | `**256GiB disk**` [com/sandboxes](https://www.daytona.com/docs/sandboxes.md) |
| macOS | `[macOS sandboxes](https://www.daytona.com/docs/macos-sandboxes) running on dedicated Apple silicon hardware` — but the macOS API is `api.us-macos.daytona.com` and the client is `daytona.v2`, not the `.io` SDKs [sandboxes](https://www.daytona.io/docs/en/sandboxes.md) | `macOS virtual machines on Apple silicon Mac computers`; `$2.5032 per Mac-hour` [com/macos](https://www.daytona.com/docs/macos-sandboxes.md) |
| SDKs | `Python, TypeScript, Ruby, Go, and Java` [architecture](https://www.daytona.io/docs/en/architecture.md) | `Python` and `TypeScript` on the docs home [com/docs](https://www.daytona.com/docs) |

Both sites are the same company: `daytona.com/about` reports `$91M raised, most recently a $60M Series B led by FirstMark Growth`, and `daytona.com/terms-of-service` and `/sla` redirect to the `.io` pages [com/about](https://www.daytona.com/about).

Resolution used in this report: the `.io` pages, price list, dashboard (`app.daytona.io`) and five SDKs are one product; the `.com` pages, `app.daytona.com`, `api.daytona.com`, `daytona.v2.*` client and Starter/Team plans are a second. The `.io` changelog itself confirms the split — its 7 Nov entry says `let 0.x keep the npm latest tag until 2.x is stable` — and the `.com` changelog has exactly one release, `v2.0.0 · Nov 1, 2026`. Treating either as the whole of "Daytona" now loses half the company.

### 4.2 Contradictions inside 1.x (all still live)

1. **Dedicated kernel vs container.** `Each sandbox runs in isolation, giving it a dedicated kernel, filesystem, network stack…` vs `Sandboxes run as **Linux containers** by default.` — both [sandboxes.md](https://www.daytona.io/docs/en/sandboxes.md). The isolation page sides with containers: `Isolated container with dedicated namespaces and enforced resource limits.`
2. **90 ms vs 200 ms.** `Sub 90ms sandbox creation from code to execution.` [home](https://www.daytona.io/) vs `isolated environments with sub 200ms startup times` [careers](https://www.daytona.io/careers).
3. **Tier 1 memory 10 GiB vs 20 GiB.** Resources table `Tier 1 | 10 / 10GiB / 30GiB` vs Limits table `**1** | 10 | 20 | 30` — same page, [limits.md](https://www.daytona.io/docs/en/limits.md).
4. **10 GiB disk cap vs 50 GiB Windows presets.** `Organizations get a maximum sandbox resource limit of … **10GB disk**` vs `windows-medium` and `windows-large` at `50GiB` — same page, [sandboxes.md](https://www.daytona.io/docs/en/sandboxes.md).
5. **Startup credits $50k vs $100k.** `up to **$50k in credits for free**` [pricing](https://www.daytona.io/pricing) vs `Get up to $100k in Daytona credits for your startup` [startups](https://www.daytona.io/startups).
6. **Audit logs: Enterprise feature vs permission.** Pricing lists `SSO, audit logs` under Enterprise; the docs say `available to administrators with full access and members with audit log permissions` [audit-logs](https://www.daytona.io/docs/en/audit-logs.md).
7. **GPU is priced but not billed.** The price card has nine GPU rates, while [billing.md](https://www.daytona.io/docs/en/billing.md) says `Sandboxes are billed for the resources reserved: vCPU, RAM, and disk` and never mentions a GPU meter. The GPU page says only `On-demand GPU sandboxes require GPU credits.` No page reconciles $/GPU-hour with credits.
8. **Agents are preinstalled, but the guide installs them.** Default-snapshot table lists `@openai/codex` 0.146.0 and `@anthropic-ai/claude-code` 2.1.220 [snapshots](https://www.daytona.io/docs/en/snapshots.md), while the Codex guide's own output is `Installing Codex agent in sandbox...` [guide](https://www.daytona.io/docs/en/guides/openai/codex-sdk-interactive-terminal-sandbox.md). Resolution in this report: the package table is the stronger claim (it is the image manifest); guides install to pin/upgrade.

### 4.3 Contradictions inside 2.0

1. **Sandbox size cap.** Docs: `A Linux sandbox may guarantee at most **16 cores**, **32GiB memory**, and **256GiB disk**.` [com/sandboxes](https://www.daytona.com/docs/sandboxes.md). Pricing plan table: `Sandbox size | Cores 64 | Memory 128 GiB | Ephemeral disk 512 GiB / 1 TiB / 3 TiB` [com/pricing](https://www.daytona.com/pricing). Both first-party, same week. The model should use the docs' 16/32/256 as the per-sandbox guarantee until someone tests a 64-core create.
2. **macOS billing.** Pricing page: macOS `$0.00574` per core-hour **plus** `Mac reservations $60.08 per 24-hour period`. Billing doc: `macOS sandboxes are not metered; their Mac reservation is charged instead.` If macOS is "not metered", the $0.00574/core-hour OS rate is unreachable; if it is metered, "charged instead" is wrong.
3. **`Volumes` price vs `Bucket volume` traffic.** Billing doc bills bucket traffic per uploaded GiB, downloaded GiB and 1,000 requests; the pricing page publishes only `Volumes (Stateful) $0.000108` per GiB-hour and no traffic rate. A buyer cannot compute a bucket-volume bill from the public card.

### 4.4 Contradictions resolved since the last check

- **macOS on the platform vs on someone else's.** Baseline: current docs said `use.computer` and `The Daytona SDKs, CLI, and API do not manage macOS sandboxes`, while the Series B post claimed macOS on one platform. Now: native macOS VMs on Apple silicon, managed by `daytona.v2`, with reservations, snapshots, pause/resume, fork, VNC, computer use and SSH — and the old `macos-sandboxes.md` page now 404s. Resolved in Daytona's favour, but only on the **2.0** product.
- **The v2 alpha tree.** `/docs/en/v2/` 404s; v2 is now the `.com` docs site. The "two documentation trees" caveat survives in a new form (§4.1), and is now a product split rather than an alpha.

---

# 5. Important products the 16 features and 78 capabilities miss

Ordered by how much a buyer would care. "New" means since the 2026-10-28 check; "gap" means it existed but the model has no row for it.

## 5.1 Daytona 2.0 (new, 1 Nov 2026) — a second platform, not a version bump

- **Hardware-isolated VMs by default.** Linux on Firecracker, Windows/GPU on Cloud Hypervisor, macOS on Apple's Virtualization framework. `The boundary is enforced by the hypervisor, not by the guest` [com/isolation](https://www.daytona.com/docs/isolation.md). The 16 features model "container vs VM" as a provider choice; for Daytona it is now a **product** choice.
- **Measured resources with a guaranteed floor and a limit, no manual resize.** `Each resource has a guarantee and a limit. A sandbox can always use its guarantee and takes more as its workload needs it, up to the limit, with no manual resize.` [com/sandboxes](https://www.daytona.com/docs/sandboxes.md). This is a measured meter with a floor — a shape the feature's four-way split does not distinguish — and a direct answer to the `live-resize` row.
- **Native macOS sandboxes with Mac reservations.** 24-hour reservation, M4 Pro 12 cores/24 GiB/220 GiB, two sandboxes per Mac, persistent disks, snapshots, pause/resume, fork, VNC, computer use, SSH on 2222, region `macos-1`, API `api.us-macos.daytona.com`. `$2.5032 per Mac-hour, $60.08 per 24-hour period` [com/macos](https://www.daytona.com/docs/macos-sandboxes.md). The model has no macOS class and no reservation concept.
- **Windows VMs as a first-class class.** `Windows virtual machines with a desktop` [com/docs](https://www.daytona.com/docs); Cloud Hypervisor, UEFI, Hyper-V enlightenments, no graphics card. 1.x has Windows sandboxes too, but the model treats them only as a disk workaround.
- **Plans, concurrency and session caps.** Starter/Team/Enterprise with member caps (3/unlimited), sandbox concurrency (100/5,000), GPU cards (7/50), Windows core licenses (10/50), Mac reservations (10/50), session length (24 h/48 h), OTel retention (1/3 days). None of this is in `plans` or `teams-accounts`.
- **Static egress IPs (Beta)** and **custom domains (Beta)** on Team. Both are `not-published`/`partly` in the 1.x model.
- **Project-level budgets** on Team. The model's `spend-cap` and `usage-alerts` rows describe org-wide prepaid pools, not project budgets.
- **BYOC and cloud marketplaces.** Enterprise `BYOC deployment`; `Cloud marketplaces (Beta)`; `Use committed spend on AWS and GCP`. The model's `open-source` row mentions BYOC, but not marketplaces or committed-spend drawdown.
- **Disk and bucket volumes.** Disk volumes `from 1 to 1000 GiB`, at most 8 per sandbox, with background commits and `pull`; bucket volumes are S3-compatible with their own access keys, `read_only` mounts, and per-GiB/request billing. The 1.x model has one free FUSE volume type.
- **OpenTelemetry.** Sandbox telemetry and SDK tracing over OTLP, 3-day retention on 1.x (1/3 days by plan on 2.0), custom exporters on Team. Missing from the 78.

## 5.2 1.x products/features the model misses (gap, mostly not new)

- **Linked sandboxes** — a private link network of ephemeral children on the same runner, bidirectional TCP, DNS aliases by name and ID, cascade delete. `telnet LINKED_SANDBOX_ID 5555` from the parent [sandboxes](https://www.daytona.io/docs/en/sandboxes.md). Introduced v0.183.0 (29 May 2026). This is the only sandbox-to-sandbox networking Daytona has, and no feature or capability row covers it.
- **Language Server Protocol API** — per-sandbox Python and TypeScript language servers with completions, document symbols and workspace symbol search. `A language server runs inside the sandbox and analyzes the project's code, so your application gets IDE-grade code intelligence for code that never leaves the sandbox.` [lsp](https://www.daytona.io/docs/en/language-server-protocol.md). No capability row.
- **Log streaming API** — live session/command logs plus snapshots, callbacks and WebSocket; `Log streaming lets you access and process session command logs in real time while a process is still running` [log-streaming](https://www.daytona.io/docs/en/log-streaming.md). The model has `pty` and `file-api` but no logs row.
- **OpenTelemetry collection** — traces, logs and metrics from inside the sandbox and from SDK calls; `Daytona retains sandbox telemetry data for **3 days**` [otel](https://www.daytona.io/docs/en/observability/otel-collection.md). No observability row.
- **Agent Skills package** — `npx skills add https://github.com/daytona/skills --skill daytona` installs a Daytona skill into Claude Code and other harnesses [agent-skills](https://www.daytona.io/docs/en/agent-skills.md). The model covers MCP but not the skills/plugin distribution channel.
- **GPU capacity classes and credit currencies** — on-demand vs spot, separate GPU quota under `earth`, `GPU credits` and `spot GPU credits`, a `gpu-capacity` endpoint that reports `availableOnDemand`/`availableSpot` per type. The `gpu` capability row cannot express any of it.
- **L40S** — ninth GPU type, added 7 Nov (v0.231.0). Relevant to price comparisons against Modal/Runtime/Runpod-style GPU providers.
- **VNC access as a first-class surface** — dashboard VNC viewer with a Connect button, separate from the computer-use API; requires packages that default snapshots include and custom images do not [vnc-access](https://www.daytona.io/docs/en/vnc-access.md). The `desktop` row says yes; the packaging caveat is new.
- **Private-registry snapshots** — Docker Hub, Google Artifact Registry, GitHub Container Registry and Amazon ECR, each with its own auth flow [snapshots](https://www.daytona.io/docs/en/snapshots.md). `custom-image` says yes without the registry caveat.
- **Managed-agent and self-hosted-agent integrations** — Claude managed agents, Gemini managed agents, OpenAI Agents API self-hosted sandbox, Cursor self-hosted machines, Devin Outposts. These are not "guides to install a CLI": they are Daytona positioning itself as the execution substrate behind other vendors' agent products. The `hosts-other-agents` row is `yes` but its figure should name them.
- **Charts and object storage in the SDKs** — `Chart`/`ChartType` types returned by the code-run endpoint, and an `ObjectStorage` client for Daytona's own bucket (used for volume builds). Minor, but they are public SDK surface the capability list does not describe.

## 5.3 What the model gets right and should not lose

The 1.x profile's four "badly" fits are still the four that bite: the 10 GiB Linux disk cap, the 15-minute idle stop that ignores a running build, Tier 1/2's restricted network, and organisation-wide runtime access. Two of the baseline's five strengths need editing: "free S3-backed volumes, 100 per organisation" is 1.x-only (2.0 bills them), and "a VNC desktop and a computer-use API" should add "with Chromium already in the standard image".

The `fits.well` line "A fast container for untrusted code" is weaker than it was: on 2.0 the default is a hardware-isolated VM, which is the stronger claim for untrusted code, and on 1.x the container shares the runner's kernel. If the row is re-scoped to 2.0, that sentence should become "a hardware-isolated VM per task".

---

# 6. Verification, limits and what was not done

## Checks run

- Quotes were checked against the downloaded Markdown with a Python substring test after whitespace normalization, except the pricing/terms/SLA/trust/status quotes, which were matched against the rendered Markdown returned by Context or TinyFish in this session. Markup normalization is stated where it matters.
- **Freshness of money pages:** both `daytona.io/pricing` and `daytona.com/pricing` were fetched with `maxAgeMs: 0` / `ttl: 0` and both responses reported `cache_metadata.status: "miss"`, `age_ms: 0`. A second, independent tool (TinyFish) returned identical figures for both. No price here comes from a cached scrape.
- **Page identity:** HTTP 200 checked for every cited page; `daytona.io/docs/en/v2/*` returns 404 and `/docs/en/macos-sandboxes` returns 200 at `www.daytona.com/docs/macos-sandboxes` (final URL recorded), so the redirect is not being mistaken for the old page.
- **Docs inventory:** `llms.txt` is 226,870 bytes, `last-modified: Wed, 11 Nov 2026 19:48:25 GMT`, and lists 192 `.md` pages. All 192 were downloaded; the capability quotes come from that set, not from search snippets.
- **Status:** read `status.app.daytona.io` HTML (Better Stack) on 12 Nov 2026, 09:54 UTC. `index.json` also fetched, but the rendered page was used for the component names and uptime figures because the JSON is a Better Stack resource bundle, not a status summary.
- **GitHub:** `api.github.com/repos/daytonaio/daytona` → `"archived": true`, `pushed_at: 2026-07-24`.
- **Terms/SLA/DPA/trust:** all re-read on 12 Nov; Terms and SLA both still say `Last updated: Aug 22, 2025`.

## What was not done

- **No account, no sandbox, no runtime test.** Every claim is documentation or a rendered page. "Sub 90 ms", "available instantly", "up to two sandboxes per Mac" and the GPU capacity endpoint are vendor claims, not measurements.
- **No A/B/C recomputation**, as instructed. The 2.0 inputs are listed in §3.2; the parent should redo the arithmetic if it re-scopes, because the vCPU→core conversion changes the shape of every case (A and C are 2-vCPU shapes; on SMT hosts they become 1 core, on Graviton/Apple silicon 2 cores).
- **The 2.0 platform was not exercised.** Its docs are a separate tree with a separate client (`daytona.v2`); page counts, redirects and the pricing table were checked, but not the API surface, the macOS reservation flow or the guarantee/limit behaviour.
- **GPU billing remains ambiguous.** The price page gives $/GPU-hour; the billing page lists only vCPU/RAM/disk; the GPU page talks about credits. Whether a GPU sandbox pays GPU rate **plus** vCPU/RAM/disk, or the GPU rate **includes** them, is not published. The model should not silently add both or silently drop one.
- **ISO 27001 status** could not be read from the rendered Trust Center (the badge is displayed; the underlying maturity field the baseline quoted is not in the text). SOC 2 Type 1/Type 2, HIPAA and GDPR are listed.
- **No repo files were edited** outside `.amp/in/scratchpad/`. No commit, push, PR or thread creation. The site's `checkedOn` dates, rate card and rows are untouched, by design: the parent integrates.

`docs.json` needs no URL change: all 17 of its Daytona links still return HTTP 200 and still document the 1.x product. Its `built-in-agents` title — `OpenClaw Guides (preinstalled in the default snapshot)` — remains true and is now one of four preinstalled agents.

## Bottom line for the parent

The `daytona` row is **not stale on price** — every 1.x rate the card uses is still on the page, byte for byte — but it is **stale on product scope**. Three verdicts should move (`agents-preinstalled` to yes, `browser` to yes, `backups` to partly), six notes need editing (`gpu`, `choose-region`, `mount-buckets`, `spend-cap`, `status-page`, `hosts-other-agents`), and the profile needs a decision the research cannot make for it: **is `daytona` the 1.x container platform at daytona.io, or the 2.0 VM platform at daytona.com?** They differ on isolation, disk, macOS, plans, stopped billing and SDK count. Modelling 1.x alone is defensible and cheap; it just understates the product the company launched eleven days ago and now markets as "Computers for Agents".

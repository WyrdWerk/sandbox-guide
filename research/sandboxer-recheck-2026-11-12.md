# Sandboxer — full recheck, 2026-11-12

Target: provider `sandboxer`, <https://sandboxer.com>. Repository `sandbox-guide` at
`origin/main` **4432d00** (shallow checkout; HEAD 4432d00). Last site check: **2026-10-28**
(provider profile) and **2026-10-29** (rate card).

Scope: the provider profile, all 16 feature rows, all **78** capability rows, the rate card,
the `docs.json` entry, and `research/sandboxer.md` (the 2026-10-28 research record). Desk
research only: no account, no card, no sandbox, no credentials, no billable resource. No repo
data files were edited, committed or pushed. This file is the only artifact.

## Method and what actually succeeded

| Tool | Use | Result |
|---|---|---|
| **Context MCP** `web_scrape` | `https://sandboxer.com/pricing` with `maxAgeMs: 0`, `responseMode: "full"` (fresh, cache bypassed) | **Worked.** Returned the full rendered page: four size rows, four plan cards, burst table, estimate widget, all 11 FAQ answers. |
| **TinyFish MCP** `fetch_content` | Independent fetch of `/pricing` and `/docs/billing`, Markdown | **Worked.** Same rates, plan ladder, "No." free-tier answer, 14-day stopped-data sentence. Used as the second route for the price check. |
| `curl` (official Markdown mirror) | `/pricing.md`, `/docs/*.md` (25 docs pages) and 3 guide pages, `/llms.txt`, `/llms-full.txt` (2.83 MB), `/changelog.md`, `/terms`, `/privacy`, `/acceptable-use`, `status.sandboxer.com/api/status.json` | **Worked.** All 25 docs pages and 3 guide pages HTTP 200. `/docs/troubleshooting.md` and `/docs/glossary.md` are 404 probes; the glossary is a guide. Terms/privacy are HTML only. |
| Amp native `web_search` / `read_web_page` | — | **Not used.** The Context + TinyFish + Markdown-mirror routes covered every question. |

**Freshness.** The price check was done three ways on 2026-11-12 between 09:54 and 10:00 UTC:
Context `web_scrape` with `maxAgeMs: 0` (no cache), TinyFish `fetch_content`, and a direct
`curl` of both `https://sandboxer.com/pricing` (HTTP 200, 38,852 bytes, 0.34 s) and
`https://sandboxer.com/pricing.md` (HTTP 200, 2,606 bytes). All three returned the same
figures and the same "Is there a free tier? No." answer. The status JSON's `updatedAt` is
`2026-11-12T10:00:50Z`, so the status numbers are live for this check. This is **not** a
cached scrape: the rendered HTML itself was read, and the Markdown mirror was compared to it.

Quotes below are copied from the live page and are verbatim after normalising whitespace and
stripping Markdown emphasis (`**`, backticks), table pipes and link markup. That is the same
normalisation the site's evidence checker uses. Every quote was matched against the fetched
page corpus by script.

---

## 1. The 16 features

### At a glance

| Feature | Verdict | Figure | Changed since 2026-10-28 |
|---|---|---|---|
| isolation | **yes** | Cloud Hypervisor; /dev/kvm | unchanged |
| sizes-regions | **partly** | 16 vCPU / 32 GB; 2 regions | updated — resize on resume/fork, burst spill, region pinning |
| billing-models | **partly** | $0.036/h default | updated — no trial, 14-day stopped retention, paid starts |
| trials-free-tiers | **no** *(was partly)* | None; $20 from day one | **CHANGED — trial removed 2026-11-02** |
| lifecycle | **partly** | RAM to disk; 14-day retention | updated — 14-day expiry, requireMemory 30 min |
| snapshots-forks | **yes** | Disk + RAM on stop; versions | updated — versioned/labelled named snapshots, 14-day auto retention |
| storage | **partly** | Whole disk; quota, not bill; 14 days | updated — 14-day expiry, opt-in auto-delete |
| idle-timers | **partly** | 30–120 min idle; 1 h–30 d stop | updated — 30-min floor, 7-day idle maximum |
| reaching-it | **yes** | Token in URL; IPv4 SSH endpoint | updated — three SSH routes, reverse forward, browser-only stream |
| custom-domains | **partly** | CNAME plus your TLS | unchanged |
| outbound-network | **partly** | Not billed; no allowlist | unchanged |
| keys-secrets | **partly** | Env + files; scoped keys | updated — key TTLs, in-sandbox token narrowed 2026-11-08 |
| ways-to-drive | **yes** | REST, 2 SDKs, CLI, MCP, SSH | updated — 20 MCP tools, Daytona API, labels, idempotency |
| built-in-agents | **yes** | Six harnesses; prompt API | updated — agent tasks that end in a PR |
| teams-accounts | **partly** | Per-member caps; no SSO/audit | updated — shared sandboxes, concurrency caps, storage not × seats |
| company | **partly** | North Bay Opco I, Inc.; no SLA | updated — status numbers, Terms 2026-11-02 |

**Verdict change: one.** `trials-free-tiers` goes `partly` → `no`. No capability verdict
changes. The big substantive changes are commercial/lifecycle, not isolation or interfaces:
the free trial is gone, stopped sandboxes expire after 14 days, start limits can be exceeded
for a per-start fee, and the in-sandbox token lost account access.

### Feature detail

| Feature | Verdict | Current specifics | Source | Quote | Changed |
|---|---|---|---|---|---|
| isolation | **yes** | Cloud Hypervisor microVM, own kernel, Ubuntu 24.04 with Sandboxer's own kernel build; root via passwordless `sudo`; systemd; Docker with BuildKit + Compose; `/dev/kvm` passed through; control channel is vsock, not TCP; per-root-disk COW image; forks regenerate machine-id, SSH host keys and hostname. No Windows, no custom kernel, no image build (customise inside, snapshot). | <https://sandboxer.com/docs/security> | "Each sandbox is a separate Cloud Hypervisor microVM with its own kernel." | unchanged |
| sizes-regions | **partly** | Four fixed sizes: small 2 vCPU / 4 GB / 12 GB, default 4 / 8 / 50, large 8 / 16 / 125, xlarge 16 / 32 / 251. Shared vCPU, reserved RAM. `xlarge` needs the $100 plan. Two regions: `us-east` Ashburn and `eu-central` Helsinki; nearest-by-IP unless `region` is set. **New:** grow on resume or fork (`sbx resume --type large`, `sbx fork --type xlarge`), always a cold boot; shrink needs a new sandbox and a file copy. **New:** an unnamed burst can spill to the other region (`regionSource: "burst"`), so pin `region` for residency. Forks and snapshot-creates stay in the source region. No GPU, ARM or Windows. | <https://sandboxer.com/docs/machines> | "you can make it bigger whenever you resume or fork" | updated |
| billing-models | **partly** | Per-second while running at a fixed multiplier: small 0.5× $0.018/h, default 1× $0.036/h, large 2× $0.072/h, xlarge 5.56× $0.20/h. One dollar = 100,000 default-seconds. Plans $20 / $100 / $500 / $2,000 a month; every dollar returns as machine time; included time expires monthly; $20 packs never expire; plan time spent before packs. $20 is the floor (no free tier). Stopped compute is free, but the data now expires after 14 days. **New:** starts above a plan's per-minute/hour/day limits cost $0.03–$0.07 each, up to 3×, from prepaid credit only. Plans are per seat in an org. | <https://sandboxer.com/docs/billing> | "Metering is per second, from the moment a sandbox is up until it is stopped." | updated |
| trials-free-tiers | **no** | **No free tier and no trial for new accounts.** Choosing a plan charges the first month immediately; plans renew monthly. $20 is the entry price. A card is needed for a plan, but signup, docs, CLI and dashboard work without one; creating/forking/resuming answers `402 payment_method_required` until a card and plan exist. Grandfathered trials keep 2 sandboxes, small/default, 25 h and an 8-hour auto-stop; cancelling one or removing its only card deletes every sandbox and snapshot at once. Legacy trial sandboxes are CPU-braked to 1 vCPU after 30 min at high CPU. | <https://sandboxer.com/pricing> | "No. Plans start at $20/month; the first month is charged when you subscribe" | **CHANGED** (partly → no) |
| lifecycle | **partly** | Stop freezes the filesystem, pauses the VM, writes memory + device state, powers off, stops the meter; state `archiving → archived`. Resume restores memory only on the same CPU type, waiting up to 2 min for a busy matching host; otherwise cold boot from disk with `memoryRestored: false` and `resumeReason` (`cpu_mismatch`, `resized`, `no_memory_snapshot`, `restore_failed`). `requireMemory: true` waits up to 30 min and fails `memory_unavailable` rather than cold-boot; cannot combine with a size change. A resize resume always cold-boots. **Stopped data now expires 14 days after the last stop** (`dataExpiresAt`, expired state, `409 snapshot_data_expired`); sandboxes created before 2026-10-29 are exempt. Zero-data-retention and snapshots-off change the stop semantics. | <https://sandboxer.com/docs/snapshots> | "A stopped sandbox keeps its disk, memory and automatic snapshots for 14 days after it last stopped, at no charge." | updated |
| snapshots-forks | **yes** | Three kinds: stop snapshot (disk + memory), continuous disk snapshots every 10 min and at every stop (latest two kept), named snapshots used as templates. All COW reflinks. Named snapshots support versions (`<name>-v<N>`, `ifLatest`, `keep`), labels, `fromLabels`, share codes (`bsh_…`) and `storedBytes`; kept until deleted, independent of source. Browse with `sbx snapshot tree`, download with `sbx snapshot pull`. Fork is disk-only, freezes the source's filesystem for the copy, boots with a new identity (id, subdomain, machine-id, SSH keys), inherits type/env but not TTL. Automatic snapshots now expire with the 14-day stopped-data rule. | <https://sandboxer.com/docs/snapshots> | "A fork copies the disk only, never memory or running processes" | updated |
| storage | **partly** | One whole-VM disk per sandbox, sized by the shape (12/50/125/251 GB for user files, on top of a ~6–7 GB OS image). No separate volume, no shared volume, no bucket mount, no image registry. Stopped sandboxes and named snapshots count against an included quota (10 GB no plan; 50 GB / 250 GB / 1 TB / 5 TB by plan); running ones do not. Over quota blocks new sandboxes, forks and named-snapshot saves with `402 storage_limit_reached`; stop/resume/delete still work. **New:** opt-in auto-delete removes least-recently-used stopped sandboxes after a 7-day email notice; off by default, never touches running sandboxes or named snapshots. **New:** stopped data is deleted 14 days after the last stop unless saved as a named snapshot. | <https://sandboxer.com/docs/billing> | "Storage isn't billed: each plan includes an amount for what you keep" | updated |
| idle-timers | **partly** | Idle auto-pause defaults: $20 plan 30 min, $100/$500 60 min, $2,000 120 min; settable 0 (never) to 10,080 min (7 days). Pausing is a stop with memory, so processes survive; compute billing stops; the disk/memory image counts toward storage. Wakes on the next API call (waits up to 60 s), hosted-URL request (held up to 45 s, then `503` + `Retry-After`), or `sbx ssh`; raw SSH to the IPv4 port does not wake it. Auto-stop defaults to 1 h, range 1 s–30 days or `null`; `sbx extend` resets to now + TTL. Schedules inside the VM do not fire while stopped/paused, and a stopped sandbox's clock is corrected on resume, so wall-clock jobs can bunch up. `~/.sandboxer/keep-awake` and load ≥ 0.5 keep it awake. | <https://sandboxer.com/docs/long-running> | "`0` turns it off; the maximum is `10080` (7 days)." | updated |
| reaching-it | **yes** | Stable HTTPS URL per port `https://<subdomain>-<port>.box.sandboxer.com`, TLS/HTTP2/WebSockets, private by default with `?_token=`/`__sbx_auth` cookie (stripped before the app) or public with `--public`. Public IPv6 per sandbox, ufw closed except SSH. Three SSH routes: CLI tunnel over HTTPS (`sbx ssh`), direct IPv6, and a public IPv4 `sshEndpoint` host:port while running; SCP. Browser terminal (full PTY), streamed XFCE desktop over VNC (10-minute URLs), browser-only Chrome stream. `sbx forward` local and `--reverse`. No public raw-TCP endpoint except the SSH forward. | <https://sandboxer.com/docs/hosting> | "Treat a private URL like a password" | updated |
| custom-domains | **partly** | First-class custom domains are still a roadmap item. Documented workaround: CNAME the hosted hostname and terminate TLS yourself, or run Caddy inside the sandbox on its public IPv6 after `sudo ufw allow 80,443/tcp`. The platform's wildcard certificate covers only `*.box.sandboxer.com`. | <https://sandboxer.com/docs/hosting> | "First-class custom domains are on the roadmap." | unchanged |
| outbound-network | **partly** | Outbound open by default over IPv4 NAT and direct IPv6; no egress allowlist, domain filter or outbound-firewall setting. Bandwidth is not billed ("Do you bill bandwidth? No."). Traffic shares the node's IPv4 and IPv6 /64, so per-IP rate limits are shared. SMTP port 25 blocked; sandbox→sandbox blocked; private ranges/host blocked except the DNS relay; bandwidth shaped per VM. No fixed egress IP. Restricting or disabling egress is DIY with `ufw` inside the VM, which root/the agent can undo. | <https://sandboxer.com/guides/what-can-reach-a-sandbox-and-what-it-can-reach> | "There is no egress allowlist, domain filter or outbound firewall setting in Sandboxer." | unchanged |
| keys-secrets | **partly** | Environments bundle `.env` variables, secret files under `/home/user`, GitHub repos and credential switches; immutable versions, upgrade pushes changes (and deletes removed secrets) to running sandboxes; per-sandbox `env` overrides. `noEnv`/safe-for-third-parties strips everything. API keys are scoped to actions, sandboxes/environments, presets (`read-only`, `full-sandbox`, `ci`, `admin`) and a TTL (default 90 d, max 365 d), stored hashed and rotatable. Every sandbox gets `SANDBOXER_TOKEN`, narrowed on 2026-11-08 to its own sandbox only (account endpoints 403); `noEnv` tokens are read+host only. **No** secret broker, OIDC/workload identity, short-lived credential exchange or provider-held secret that the agent cannot read: secrets are written into the VM, so root can read them. | <https://sandboxer.com/docs/security> | "Removing a secret from an environment and upgrading **deletes** it from the sandboxes' disks" | updated |
| ways-to-drive | **yes** | REST API `https://sandboxer.com/api/v1` (alias `api.sandboxer.com/v1`) with OpenAPI; TypeScript `sandboxer-sdk` and Python `sandboxer-sdk` (imports as `sandboxer`), both 0.1.3; static `sbx` binary for Linux/macOS/Windows; hosted MCP at `/mcp` + local `sbx mcp` (20 tools + local `handoff_session`); SSH/SCP; browser terminal; VNC desktop; `sbx browser`; webhooks (HMAC); SSE events; Daytona-compatible API at `/daytona/api`; labels; idempotency keys; per-sandbox usage API. Dashboard is manage-only: no documented create button. | <https://sandboxer.com/docs/cli> | "`sbx` is one static binary for Linux, macOS and Windows." | updated |
| built-in-agents | **yes** | Six harnesses installed in every sandbox: Claude Code, Codex, OpenCode, Pi, Kimi Code, Mistral Vibe; Prime Agent "coming soon". Prompt API returns `promptId`, `conversationId`, `status: "queued"`; events/SSE; many conversations per sandbox; steer (native for Claude/Codex/Pi, interrupt-and-continue for OpenCode) and interrupt; live `/provider-models` catalogue; bring-your-own provider keys; computer-use tools against the desktop. **New:** MCP `create_task`/`task_status` run a coding agent on a connected GitHub repo and end in a pull request, with cost so far. | <https://sandboxer.com/docs/agents> | "Every sandbox ships with Claude Code, Codex, OpenCode, Pi, Kimi and Mistral Vibe." | updated |
| teams-accounts | **partly** | An organization is a shared wallet (one plan, one balance, members), not a workspace. Owner/member only; no read-only role, SSO/SAML/SCIM or account audit log published. Plans are per seat: price × seats, and concurrency/start limits × seats. Storage is **not** multiplied by seats: one plan amount. Owners can cap a member's machine time per billing period (`usageCapSeconds`, `402 team_member_cap_reached`) and concurrent sandboxes (`maxActiveSandboxes`). **New:** shared sandboxes with `access: "view"` then `sbx share` → `access: "use"`; sharing wipes the owner's injected logins at the next start. Scoped API keys, alerts and webhooks. | <https://sandboxer.com/docs/organizations> | "An **organization** is a shared wallet: one plan, one balance, and the members who run sandboxes on it." | updated |
| company | **partly** | North Bay Opco I, Inc., a Delaware corporation, 777 Brickell Ave, Suite 500 PMB 1074, Miami (a private mailbox); North Bay Ventures' product, founded by Jon Oringer; entity incorporated 2022-11-09; product launched 2026-10-18; funding/headcount not published; no team page. Status: web 99.96%, sign-in 99.96%, API 100%, sandboxes 99.89%, preview/SSH 99.89%, MCP 100%, billing 100%, email 100% (30 d = 90 d; no incidents in 90 days). No SLA ("Not yet during early access"). No SOC 2, ISO 27001, HIPAA or trust centre. DPA on request. Vulnerability policy: 3-business-day acknowledgement, security.txt. Terms updated 2026-11-02: 30-day price notice, 30-day termination notice, month-end cancellation, closing forfeits credit, no export window, Florida law/AAA arbitration. | <https://sandboxer.com/terms> | "North Bay Opco I, Inc., a Delaware corporation whose mailing address is 777 Brickell Ave, Suite 500 PMB 1074, Miami, FL 33131" | updated |

---

## 2. All 78 capabilities

Legend: **unchanged** = same verdict and same buyer-relevant specifics as the 2026-10-28
record; **updated** = same verdict, but the figure, shortfall, note or evidence quote changed;
**CHANGED** = verdict changed. No capability verdict changed. That is the headline: the
commercial and lifecycle terms moved, not the product's capability set.

### Isolation (5)

| ID | Verdict | Current specifics | Source | Quote | Changed |
|---|---|---|---|---|---|
| own-vm | yes | Cloud Hypervisor microVM, one kernel per sandbox, own root disk, own network stack and process tree. No shared kernel. | <https://sandboxer.com/docs/security> | "Each sandbox is a separate Cloud Hypervisor microVM with its own kernel." | unchanged |
| root | yes | Login user `user` with passwordless `sudo`; install anything with apt, run system services. | <https://sandboxer.com/docs/machines> | "Inside it you are an ordinary Linux user with `sudo`." | unchanged |
| docker-inside | yes | Docker pre-installed with BuildKit, Compose, buildx; `kind` and `k3s` work; Docker daemon is the sandbox's own. | <https://sandboxer.com/docs/machines> | "Docker with BuildKit and Compose" | unchanged |
| nested-virt | yes | `/dev/kvm` exposed; Firecracker, QEMU/KVM, Android emulator run inside; inner guest RAM comes from the sandbox's RAM, so use `large`/`xlarge`. | <https://sandboxer.com/docs/machines> | "`/dev/kvm` is available: run Firecracker, QEMU/KVM or the Android emulator inside" | unchanged |
| custom-image | partly | No Dockerfile build, image registry, OCI pull or "start from my image". Customise a running VM, then save its disk as a named snapshot and `sbx new --from` it; snapshots are versioned and label-selectable. | <https://sandboxer.com/docs/llms.txt> | "Set up one sandbox the way you want it, then save its disk under a name with sbx snapshot" | unchanged |

### Sizes and regions (6)

| ID | Verdict | Current specifics | Source | Quote | Changed |
|---|---|---|---|---|---|
| any-size | no | Four fixed shapes only: 2/4/12, 4/8/50, 8/16/125, 16/32/251. No CPU/RAM slider. Grow on resume or fork; no shrink. | <https://sandboxer.com/docs/machines> | "Moving to a smaller size isn't supported yet." | unchanged |
| big-machines | yes | `xlarge` 16 vCPU / 32 GB / 251 GB; needs the $100 plan or higher, else `403 machine_class_plan_required`. | <https://sandboxer.com/docs/machines> | "`xlarge` needs the $100/month plan or higher." | unchanged |
| live-resize | no | **Now resizable on resume and fork** (`sbx resume --type large`, `sbx fork --type xlarge`), grow-only, and a size change always cold-boots from disk: running processes are lost and enabled systemd services start. Not resizable while running. | <https://sandboxer.com/docs/machines> | "A resize resume cold-boots from disk instead of restoring memory" | updated |
| gpu | no | No GPU shapes, no GPU add-on, no GPU passthrough. CPU-only (Ollama/llama.cpp recipes are CPU). | <https://sandboxer.com/docs/llms.txt> | "You need GPUs. Sandboxer has none." | unchanged |
| choose-region | yes | Two regions: `us-east` (Ashburn, Virginia) and `eu-central` (Helsinki, Finland). Pick with `region` on create, `sbx new --region`, SDK, MCP `create_sandbox`, or Daytona `target`. Without one, nearest by IP. **New:** an unnamed burst can spill to the other region (`regionSource: "burst"`); pin `region` for residency. Forks and snapshot-creates stay in the source region; resume has no region field. | <https://sandboxer.com/docs/regions> | "New sandboxes go to the region nearest you unless you pick one." | updated |
| eu-region | yes | `eu-central` is Helsinki, Finland, inside the EU. Two regions only; no EU residency commitment or data-boundary guarantee beyond region placement. | <https://sandboxer.com/docs/regions> | "EU Central (Finland)" | unchanged |

### Lifecycle (3)

| ID | Verdict | Current specifics | Source | Quote | Changed |
|---|---|---|---|---|---|
| pause-memory | partly | A stop writes memory + device state to disk, so processes normally survive. Memory is restored only on a matching CPU type; if that host is busy the resume waits up to 2 min, then cold-boots. `requireMemory: true` waits up to 30 min and fails `memory_unavailable` rather than cold-boot, but cannot combine with a size change. A resize resume always cold-boots. Auto-stop defaults to 1 h; stopped data expires after 14 days. | <https://sandboxer.com/docs/snapshots> | "Memory is restored on a machine with the same CPU type as the one the sandbox stopped on." | updated |
| warm-pool | partly | Each region keeps booted-and-paused sandboxes; a standard-image create takes one instead of booting. Pools are per size and per region (2026-11-12: us-east 12 default, 4 small, 2 large, 1 xlarge; eu-central 10 default, 6 small, 1 large), grow toward the last 10 minutes' creates up to 2× and shrink back. You cannot reserve, size, pre-warm or choose a pool; a size the region does not keep boots in ~1–2 s. Pooled sandboxes are never billed and never ran anyone's code. | <https://sandboxer.com/docs/machines> | "Each region keeps sandboxes already booted and paused, and a new sandbox from the standard image takes one instead of booting." | updated |
| fast-start | yes | Create→ready median 0.18 s in `us-east` and 0.32 s in `eu-central` for `default` (10 each, 2026-10-28, from Virginia). Changelog re-measurement on 2026-11-02 says 0.19 s in `eu-central`. 10 concurrent creates: 0.38 s / 0.58 s median. Snapshot creates ~1.05–1.4 s; fork ~1.07 s; boot when no pool machine ~1–2 s. | <https://sandboxer.com/docs/machines> | "0.18 s / 0.32 s" | updated |

### Snapshots and forks (6)

| ID | Verdict | Current specifics | Source | Quote | Changed |
|---|---|---|---|---|---|
| snapshot-files | yes | Stop snapshot contains disk + memory; continuous snapshots are disk-only; named snapshots are disk templates. `sbx snapshot tree` and `sbx snapshot pull` browse/download a stopped sandbox's files without resuming. | <https://sandboxer.com/docs/snapshots> | "**Stop snapshot** (disk + memory)" | unchanged |
| snapshot-memory | yes | A stop pauses the VM and writes memory and device state to disk; resume restores it if the CPU type matches. Memory is included only in stop snapshots, not continuous/named/fork copies. | <https://sandboxer.com/docs/snapshots> | "pauses the VM and writes its **memory and device state** to disk" | unchanged |
| fork-running | partly | Fork a running sandbox: the filesystem is frozen for the instant of the copy, so files written just before are included; the source keeps running. But the fork copies disk only, never RAM/processes, and boots fresh with `memoryRestored: null`. Reflink copy, ~1 s, new id/subdomain/machine-id/SSH keys, no TTL inheritance. | <https://sandboxer.com/docs/snapshots> | "A fork copies the disk only, never memory or running processes" | unchanged |
| older-snapshot | partly | Automatic snapshots keep only the latest two; older automatic copies are replaced. To restore an earlier state you must have saved a named snapshot, which is kept until deleted. Named snapshots can now be versioned (`<name>-v<N>`, `ifLatest`, `keep`), making an older restore point easy to keep but still an explicit save. | <https://sandboxer.com/docs/snapshots> | "each sandbox keeps its latest two" | updated |
| templates | yes | Named snapshots are templates: `sbx snapshot <id> <name>`, `sbx new --from <name>`, share with `bsh_…` codes, `fromLabels` picks the newest matching. Versions, labels, `storedBytes`, independent of source; share strips logins, API keys, secret files, repo credentials and SSH keys. New sandboxes default to the snapshot's size. | <https://sandboxer.com/docs/snapshots> | "**Named snapshots** (templates)" | updated |
| backups | partly | Automatic disk snapshots every 10 min while running and at every stop, latest two kept; also a stop snapshot with memory. They are COW reflinks on the node's filesystem, not an off-site backup, and expire with the sandbox 14 days after its last stop. Named snapshots are the durable copy. | <https://sandboxer.com/docs/snapshots> | "Every 10 minutes while a sandbox runs, and at every stop" | unchanged |

### Storage (5)

| ID | Verdict | Current specifics | Source | Quote | Changed |
|---|---|---|---|---|---|
| files-survive-stop | yes | A stop keeps the whole disk, and a resume finds the files. **Retention is now 14 days after the last stop**, not indefinite; day-11 email, day-14 deletion, sandbox stays listed as expired, `409 snapshot_data_expired`. Resume before then restarts the 14 days. Sandboxes created before 2026-10-29 are kept until deleted. Save a named snapshot to keep longer. Zero-data-retention accounts keep nothing. | <https://sandboxer.com/docs/snapshots> | "A stopped sandbox keeps its disk, memory and automatic snapshots for **14 days** after it last stopped, at no charge." | updated |
| volumes | no | No attachable/detachable volume product. The sandbox's own root disk is the only storage; it persists while stopped (14 days) but cannot outlive the sandbox or move to another. "Volumes" in the Daytona API are not covered. | <https://sandboxer.com/docs/machines> | "space for your files, added on top of the OS image" | unchanged |
| shared-volume | no | No storage attachable to two machines at once. Docker named volumes are inside one VM. To share, host a port and use the HTTPS URL, or copy with `sbx scp`; sandbox-to-sandbox networking is blocked. | <https://sandboxer.com/docs/machines> | "space for your files, added on top of the OS image" | unchanged |
| mount-buckets | no | No S3/GCS bucket, NFS or outside-filesystem mount. You can reach object storage over the network from inside, but it is not a mounted folder. | <https://sandboxer.com/docs/machines> | "space for your files, added on top of the OS image" | unchanged |
| big-disk | yes | Largest shape `xlarge` has 251 GB for user files, plus the ~6–7 GB OS image. Disks are fixed per shape; no extra-disk purchase. | <https://sandboxer.com/docs/machines> | "251 GB" | unchanged |

### Idle timers (4)

| ID | Verdict | Current specifics | Source | Quote | Changed |
|---|---|---|---|---|---|
| stay-on | yes | `ttlSeconds: null` (CLI `--no-auto-stop`) removes the hard deadline; `idleStopMinutes: 0` disables idle pause. Default TTL is 1 h, maximum 30 days. No session cap. | <https://sandboxer.com/docs/limits> | "1 s – 30 days, or `null`" | unchanged |
| choose-idle | yes | `idleStopMinutes` 0–10,080 (7 days). Defaults: $20 plan 30, $100/$500 60, $2,000 120; 0 = never. Forks copy the source's setting; sandboxes created before 2026-10-26 have it off until set; snapshots-off and zero-data-retention force 0. | <https://sandboxer.com/docs/long-running> | "the maximum is `10080` (7 days)" | updated |
| wake-on-request | yes | Idle-paused sandboxes wake on the next API call (waits up to 60 s), hosted-URL request (held up to 45 s, then `503` + `Retry-After`), or `sbx ssh`. Raw SSH to the IPv4 endpoint does not wake; signed/expiring desktop or Daytona preview links do not wake. A sandbox stopped by you, auto-stop or billing stays stopped until resumed. | <https://sandboxer.com/docs/long-running> | "A sandbox paused for being idle resumes by itself" | unchanged |
| schedules | partly | No provider scheduler. Use cron/systemd timers inside, which do not fire while stopped or idle-paused; on memory resume missed wall-clock jobs run at once, on cold boot only `Persistent=true` catches up; elapsed-time timers do not count stopped time. For exact schedules keep it awake or trigger from outside. | <https://sandboxer.com/guides/run-scheduled-jobs-in-a-sandbox-with-systemd-timers> | "Neither fires while the sandbox is stopped or idle-paused." | unchanged |

### Reaching it (6)

| ID | Verdict | Current specifics | Source | Quote | Changed |
|---|---|---|---|---|---|
| public-url | yes | `sbx host <id> <port> --public` (or `public: true`) gives `https://<subdomain>-<port>.box.sandboxer.com` with no token; TLS/HTTP2/WebSockets handled by the edge. Public mode clears the token; `--private` returns a fresh one. Routes survive stop/resume/resize; rename re-points all URLs. | <https://sandboxer.com/docs/hosting> | "make it public (clears the token)" | unchanged |
| private-url | yes | Default. URL carries `?_token=<secret>`; first visit sets `__sbx_auth` cookie; app never sees token (proxy strips it). Anyone with the full URL is in; treat it as a password. Token survives stop/resume; `--private` rotates it. Signed desktop/Daytona preview links expire (10 min for desktop). | <https://sandboxer.com/docs/hosting> | "Treat a private URL like a password" | unchanged |
| ssh | yes | Standard OpenSSH server, three routes: `sbx ssh` over an authenticated HTTPS WebSocket (works anywhere), direct IPv6 `ssh user@<ipv6>`, and a public IPv4 `sshEndpoint` `host:port` while running. `sbx ssh-config --install` adds `Host *.sbx` with `ProxyCommand sbx proxy %h`; VS Code/Cursor Remote-SSH, rsync and Ansible work. CLI key pinned at `~/.ssh/sandboxer_ed25519`, host key pinned. | <https://sandboxer.com/docs/ssh> | "Every sandbox runs a standard OpenSSH server." | updated |
| web-terminal | yes | Dashboard **Terminal** tab: full PTY in the browser over the same exec WebSocket as the CLI. Useful from a phone/locked-down machine. | <https://sandboxer.com/docs/ssh> | "The dashboard's **Terminal** tab opens a full PTY in your browser" | unchanged |
| tunnel | yes | `sbx forward <id> --remote 5432` maps a sandbox port to localhost; `--local` changes it. **New:** `--reverse` exposes a local port (e.g. a local model or MCP server) inside the sandbox. Forwards reconnect after a move/resume; nothing becomes public. | <https://sandboxer.com/docs/ssh> | "`sbx forward sb_k3v9x2mq --remote 5432`" | updated |
| raw-tcp | partly | No public raw-TCP endpoint for arbitrary services. Non-HTTP is reached by (a) an SSH local forward through the CLI tunnel or direct SSH, or (b) the public IPv4 `sshEndpoint` only for port 22. Hosted ports are HTTPS only; the proxy speaks TCP to the VM but TLS to the client. Public IPv6 can expose any port after `ufw allow`, but it is IPv6-only and firewall-closed by default. | <https://sandboxer.com/docs/security> | "Only the SSH port forward (`sshEndpoint`) and hosted ports; nothing else can address the VM" | unchanged |

### Custom domains (2)

| ID | Verdict | Current specifics | Source | Quote | Changed |
|---|---|---|---|---|---|
| custom-domain | partly | First-class custom domains still on the roadmap. Documented workaround: point a CNAME at the hosted `*.box.sandboxer.com` name and terminate TLS yourself (proxy in front), or run Caddy in the sandbox on its public IPv6 after `sudo ufw allow 80,443/tcp`. No dashboard domain object, no certificate upload, no automatic DNS. | <https://sandboxer.com/docs/hosting> | "Point a CNAME at the hosted hostname and terminate TLS yourself" | unchanged |
| auto-https | no | The platform's wildcard certificate covers `*.box.sandboxer.com`, not your domain. On a custom domain you supply and renew the certificate at your own TLS terminator; the sandbox does not get or renew one for you. | <https://sandboxer.com/docs/hosting> | "First-class custom domains are on the roadmap." | unchanged |

### Outbound network (4)

| ID | Verdict | Current specifics | Source | Quote | Changed |
|---|---|---|---|---|---|
| egress-included | yes | Outbound bandwidth is not billed and has no published cap or allowance; the pricing FAQ says no, and the billing page lists no egress line. Bandwidth is shaped per VM so one sandbox cannot starve neighbours. | <https://sandboxer.com/pricing> | "Do you bill bandwidth? No." | unchanged |
| egress-allowlist | no | No provider-side egress allowlist, domain filter, outbound firewall or proxy setting, in the API, CLI, dashboard or Daytona compatibility layer (`networkBlockAll`/allow-lists return `not_supported`). The documented substitute is `ufw` inside the VM, which root/the agent controls and can undo; Docker traffic bypasses it unless you also use `DOCKER-USER`. | <https://sandboxer.com/guides/what-can-reach-a-sandbox-and-what-it-can-reach> | "There is no **egress** allowlist, domain filter or outbound firewall setting in Sandboxer." | unchanged |
| no-internet | partly | No provider switch. Set `sudo ufw default deny outgoing` (keeping DNS and the ports you need) inside the VM; inbound hosted URLs keep answering, and `sbx exec` still works because it does not use the sandbox's network. The agent has root and can reverse it. Docker containers skip ufw rules unless you configure `DOCKER-USER`. | <https://sandboxer.com/guides/what-can-reach-a-sandbox-and-what-it-can-reach> | "Sandboxer has no egress allowlist; restrict outbound yourself with ufw inside the VM." | unchanged |
| static-ip | no | No fixed egress IP, no NAT gateway, no IP allowlist product. Outbound shares the node's IPv4 and IPv6 /64 with every sandbox on that node; a sandbox can move nodes on resume, so the address can change. External per-IP rate limits are shared. | <https://sandboxer.com/docs/security> | "Outbound traffic shares the node's IPv4 address and IPv6 /64 with the other sandboxes on that node" | unchanged |

### Keys and secrets (3)

| ID | Verdict | Current specifics | Source | Quote | Changed |
|---|---|---|---|---|---|
| secrets-store | yes | Environments store variables (`.env`-style, exported to every process, `/etc/sandboxer/env`), secret files under `/home/user` (service-account JSON, `~/.npmrc`, kubeconfig), GitHub repos and credential switches. `GET`/`POST /secrets` reads/replaces the default environment in one call; per-sandbox `env` overrides. Immutable versions; upgrade pushes changes to running sandboxes and deletes removed secrets from disk. | <https://sandboxer.com/docs/environments> | "**Variables** — a `.env`-style list, exported to every process in the sandbox." | unchanged |
| hidden-secrets | no | Secrets are written into the VM as environment variables/files, so any process the agent runs — and root — can read them. There is no provider-side secret broker, request-signing proxy, OIDC/workload-identity exchange or short-lived token minting. `noEnv` only removes them; it does not hide them. Mitigation is to pass only what a task needs and delete it after use. | <https://sandboxer.com/docs/environments> | "**Secret files** — files written into the home directory" | unchanged |
| scoped-keys | yes | Keys are scoped to actions (create/read/update/stop/resume/fork/delete, exec, file read/write, ssh, host, desktop, prompt, snapshot, environment, account), to sandboxes/environments, with presets `read-only`/`full-sandbox`/`ci`/`admin`, a TTL (default 90 d, max 365 d), rotation/revocation, SHA-256 storage and a 30-day request/live-resource usage view. Every sandbox also gets `SANDBOXER_TOKEN`; since 2026-11-08 it is limited to its own sandbox and account endpoints return `403`, so code inside needs its own scoped key for account work. `noEnv` tokens are read+host only. | <https://sandboxer.com/docs/api-keys> | "A request is allowed only when **both** hold:" | updated |

### Ways to drive it (8)

| ID | Verdict | Current specifics | Source | Quote | Changed |
|---|---|---|---|---|---|
| dashboard-create | no | Dashboard at `/app` lists sandboxes with stop countdown/Extend, Open desktop, Terminal, file browser, Billing, Environments, Agents, API keys, Webhooks, Alerts, Organization. No documented "New sandbox" button: quickstart and every create path start with `sbx` or the API. Inferred from the docs, not an explicit negative. | <https://sandboxer.com/docs/quickstart> | "Install the sbx CLI, sign in, and run your first sandbox in about two minutes." | unchanged |
| cli | yes | `sbx`, one static binary for Linux, macOS and Windows; `sbx onboard`/`login`; create, exec, ssh, scp, host, forward, snapshot, fork, stop/resume, extend, idle, prompt, steer, interrupt, events, desktop, browser, mcp, api-key, webhook, org, billing, usage, limits, history, ps, dashboard, update. JSON output on most commands. | <https://sandboxer.com/docs/cli> | "`sbx` is one static binary for Linux, macOS and Windows." | unchanged |
| python-sdk | yes | Official `sandboxer-sdk` on PyPI, 0.1.3, Python 3.10+, sync and async clients, typed models, low-level method for every API operation, `wait_until_ready`, exec/stream/PTY, files, snapshots, desktop, prompts. Imports as `sandboxer`; the PyPI package literally named `sandboxer` is an unrelated project. | <https://sandboxer.com/docs/sdk-python> | "pip install sandboxer-sdk" | updated |
| ts-sdk | yes | Official `sandboxer-sdk` on npm, 0.1.3, typed client for Node 20+, Bun, Deno, edge runtimes and browsers; no runtime dependencies; `ws` needed for `sandbox.pty()` in Node. Generated from the same OpenAPI document. | <https://sandboxer.com/docs/sdk-typescript> | "npm install sandboxer-sdk" | updated |
| rest-api | yes | `https://sandboxer.com/api/v1` (alias `https://api.sandboxer.com/v1`), OpenAPI at `/openapi.yaml`, bearer `sbx_live_…` keys, `{ok, type}` envelopes, `X-Request-Id`, cursor pagination, idempotency keys, SSE events, webhooks. A second Daytona-compatible API lives at `/daytona/api`. | <https://sandboxer.com/docs/api> | "https://sandboxer.com/api/v1" | unchanged |
| mcp-server | yes | Hosted Streamable-HTTP server at `https://sandboxer.com/mcp` (OAuth for apps, bearer for headless) and local stdio `sbx mcp`/`npx sandboxer-mcp`. **20 tools** now, including new `create_task` and `task_status` (coding agent on a GitHub repo → pull request, with status/cost); local adds `handoff_session` (21). Tools cover create/list/get/exec/detached commands/files/ports/stop/resume/extend/rename/labels/delete/snapshots. Scopes apply tool by tool. | <https://sandboxer.com/docs/mcp> | "It has the same 20 tools plus `handoff_session`" | updated |
| pty | yes | Exec WebSocket accepts `pty: true`, `cols`, `rows`; `command: null` with a PTY gives a login shell; a string or argv runs a command. Used by the CLI, SDKs and browser terminal. | <https://sandboxer.com/docs/api> | "`command: null` with a PTY gives a login shell" | unchanged |
| file-api | yes | `GET`/`PUT /sandboxes/{id}/files` read/write single files under `/home/user` or `/tmp`; MCP `read_file`/`write_file` up to 5 MiB; SDK download up to 50 MiB; `sbx scp` for files/folders of any size, recursive tar stream. Dashboard file browser with upload/download. | <https://sandboxer.com/docs/mcp> | "read and write files" | unchanged |

### Built-in agents (7)

| ID | Verdict | Current specifics | Source | Quote | Changed |
|---|---|---|---|---|---|
| agents-preinstalled | yes | Six harnesses installed in every sandbox: Claude Code (`claude`), OpenAI Codex CLI (`codex`), OpenCode (`opencode`), Pi (`pi`), Kimi Code CLI (`kimi`), Mistral Vibe (`vibe`). Prime Agent is "coming soon" and not installed. Bring your own provider keys; no subscription sign-in yet. | <https://sandboxer.com/docs/llms.txt> | "Claude Code, Codex, OpenCode, Pi, Kimi Code and Mistral Vibe are installed in every sandbox" | unchanged |
| prompt-api | yes | `POST /sandboxes/{id}/prompt` or `sbx prompt`; returns at once with `promptId`, `conversationId`, `status: "queued"`; poll or stream events; `provider`, `model`, `reasoningEffort`, `fast`, `new`, `conversationId`. Steering and interrupt; many parallel conversations per sandbox; history survives stop/resume/fork. Agent runs as `user` in `/home/user`. | <https://sandboxer.com/docs/agents> | "The call returns at once with `promptId`, `conversationId`" | updated |
| one-click-hermes | no | Hermes Agent is not among the six pre-installed harnesses, has no template, no dashboard entry and no documented install path. You can install it yourself with `pip`/`uv` and run it as a service, but that is not one-click. Inferred from the exhaustive harness list. | <https://sandboxer.com/docs/agents> | "Every sandbox ships with Claude Code, Codex, OpenCode, Pi, Kimi and Mistral Vibe." | unchanged |
| one-click-openclaw | no | OpenClaw is not in the harness list, the model catalogue or the template docs; no one-click path. Same DIY route as any unlisted agent. Inferred from the exhaustive list. | <https://sandboxer.com/docs/agents> | "Every sandbox ships with Claude Code, Codex, OpenCode, Pi, Kimi and Mistral Vibe." | unchanged |
| browser | yes | Google Chrome installed in every VM, headed on the desktop (`:1`) and usable headless; Playwright/Browser Use/Selenium recipes; `sbx browser` streams Chrome alone (tabs + address bar) from display `:2` on port 6081; `--profile` chooses a Chrome user-data dir (must be absolute and outside `/home/user`), so one sandbox can hold several signed-in profiles. | <https://sandboxer.com/docs/llms.txt> | "Every Sandboxer VM has Google Chrome installed." | unchanged |
| desktop | yes | XFCE + Chrome on display `:1`, 1920×1080, streamed over VNC/noVNC in a browser tab (WebRTC "coming"); `sbx desktop`, dashboard **Open desktop**, 10-minute URL then 8-hour session; clipboard panel; wallpaper via `~/.config/sandboxer/wallpaper.png`; integrated agents get `computer` tools (screenshot/move/click/type/scroll). | <https://sandboxer.com/docs/desktop> | "Every running sandbox has a graphical desktop (XFCE with Google Chrome)" | updated |
| hosts-other-agents | no | Documented integrations are MCP clients (Claude, ChatGPT, Cursor, Claude Code, Codex) and SDKs/frameworks (LangGraph, CrewAI, Vercel AI SDK, OpenAI Agents SDK, Claude Agent SDK), not another platform naming Sandboxer as its hosted-agent backend. No page says it is the machine for Cursor cloud agents, Devin or Claude Managed Agents. Inferred. | <https://sandboxer.com/docs/mcp> | "Connect Claude, ChatGPT, Claude Code, Codex, Cursor or any MCP client to `https://sandboxer.com/mcp`" | unchanged |

### Teams and accounts (6)

| ID | Verdict | Current specifics | Source | Quote | Changed |
|---|---|---|---|---|---|
| team-workspace | yes | Organizations: shared wallet with one plan, one balance, members, invites, ownership transfer, active-wallet switching (`sbx org switch`, `X-Sandboxer-Org`, `?org=`), shared sandboxes, per-member caps, seats. Personal and org wallets coexist; every sandbox bills exactly one. | <https://sandboxer.com/docs/organizations> | "An **organization** is a shared wallet: one plan, one balance, and the members who run sandboxes on it." | unchanged |
| roles | partly | Two roles: owner and member. Owners invite/remove, change roles, set caps, buy seats, manage billing; members run sandboxes and see org usage. No read-only/auditor/billing-only role, no per-sandbox ACL beyond the view/use share switch. The Terms mention "owners and admins", but the Organizations docs name only owner and member. | <https://sandboxer.com/docs/organizations> | "To remove members, change roles or set caps, use the dashboard's **Organization** page." | unchanged |
| sso | not-published | No SSO, SAML, OIDC or SCIM page, plan line or setting in docs, pricing, Terms or dashboard docs. Sign-in is GitHub, Google, email code or email+password. Searched the full 2.83 MB docs corpus: zero SAML/SCIM/OIDC hits. | <https://sandboxer.com/docs/organizations> | "An **organization** is a shared wallet" | unchanged |
| spend-cap | partly | Per-member hard caps: `usageCapSeconds` (machine time per billing period; `402 team_member_cap_reached`) and `maxActiveSandboxes` (concurrent; `429 member_limit_reached`). Owners can set them with the API/dashboard. A zero balance stops new starts and then running sandboxes after a 24 h grace period. **No account-wide dollar cap**: a member can exceed a dollar budget by running expensive sizes until the seconds cap, and org owners cannot set one org-wide spend ceiling. | <https://sandboxer.com/docs/organizations> | "Owners can also cap a member's machine time per billing period" | updated |
| usage-alerts | yes | Dashboard **Alerts** page takes your own balance/usage thresholds; email alerts. No per-project or per-key budgets. `GET /limits` exposes balance and start windows for your own alerting. | <https://sandboxer.com/docs/billing> | "set your own thresholds on the dashboard's **Alerts** page." | unchanged |
| audit-log | not-published | No account-level audit log page, export or API endpoint in the docs, API reference or OpenAPI. Nearest things: per-sandbox command history (`sbx history`, 90 days for API/exec commands; other process output 72 h; `--no-monitoring` disables), `createdBy` on org sandboxes, API-key usage counts and webhook events. Internal "audit records" are mentioned only as retained after account closure. | <https://sandboxer.com/docs/long-running> | "Commands run via `exec` / the API" | unchanged |

### Billing models (5)

| ID | Verdict | Current specifics | Source | Quote | Changed |
|---|---|---|---|---|---|
| per-second | yes | Metered per second from `up` to stopped, at the size's hourly rate; no minimum charge or rounding increment published. Machine time is counted in `default`-seconds ($1 = 100,000). | <https://sandboxer.com/docs/billing> | "Metering is per second, from the moment a sandbox is up until it is stopped." | unchanged |
| active-cpu | no | Price depends on the chosen size, not CPU utilisation: a `default` sandbox costs $0.036/h whether idle or pegged. Shared vCPUs, reserved RAM. | <https://sandboxer.com/docs/billing> | "Each size consumes machine time at a fixed rate relative to `default`" | unchanged |
| cheap-pause | yes | Stopped compute is never counted; disk, memory image and automatic snapshots are free within the included storage quota for 14 days after the last stop. Named snapshots have no separate charge. After 14 days the data is deleted, not billed. | <https://sandboxer.com/docs/billing> | "Time while stopped is never counted." | updated |
| no-monthly-fee | no | $20/month minimum plan, charged from the first month; no pay-as-you-go-only account. Plan time expires monthly; packs ($20) never expire. | <https://sandboxer.com/docs/billing> | "You need a plan before you can start a sandbox." | unchanged |
| flat-price | yes | One flat hourly price per size, metered per second: $0.018 / $0.036 / $0.072 / $0.20. No CPU, RAM, disk, request, egress or snapshot line items. Plans convert dollars to machine time 1:1. | <https://sandboxer.com/pricing> | "Every size has one price per hour, metered per second" | unchanged |

### Trials and free tiers (3)

| ID | Verdict | Current specifics | Source | Quote | Changed |
|---|---|---|---|---|---|
| free-tier | no | No ongoing free tier, no free plan, no free monthly machine time. $20/month is the floor. Signup/docs/dashboard are free but cannot run a sandbox. Grandfathered 7-day trials are the only free compute and no new account can get one. | <https://sandboxer.com/pricing> | "No. Plans start at $20/month" | updated |
| free-credit | no | No signup credit, no promotional dollars. The old 25-hour trial was removed on 2026-11-02; a new account pays the first month at subscribe. Time packs are purchased, not granted. | <https://sandboxer.com/pricing> | "the first month is charged when you subscribe" | updated |
| no-card | no | You can sign up, read docs, install the CLI and look around the dashboard without a card, but you cannot create, fork or resume a sandbox: `402 payment_method_required` until a card and a plan exist. So "try it" needs a card before the first machine. | <https://sandboxer.com/docs/billing> | "Creating, forking or restoring a sandbox answers `402 payment_method_required` until you add one." | updated |

### Company (5)

| ID | Verdict | Current specifics | Source | Quote | Changed |
|---|---|---|---|---|---|
| status-page | yes | Public `status.sandboxer.com` and `/status`, hosted off Sandboxer's servers, JSON at `/api/status.json`. Eight components (web, sign-in, API, sandboxes, preview/SSH, hosted MCP, billing, email), per-check latency, 90-day history, incidents. Checked every minute from outside plus internal checks every 10–30 min. 2026-11-12: all operational, no incidents in 90 days. | <https://status.sandboxer.com> | "No incidents in the last 90 days." | updated |
| sla | no | No uptime commitment, no credit schedule, no enterprise SLA. FAQ: "Not yet during early access." llms.txt: "There's no SLA during early access". Status page is informational only. | <https://sandboxer.com/docs/faq> | "Not yet during early access." | unchanged |
| soc2 | not-published | No SOC 2 Type I/II, ISO 27001, HIPAA, PCI or trust centre. No certification claim on Security, Terms, Privacy or pricing; no report request link. The security page publishes a vulnerability policy and safe harbour instead. Absence after searching the full docs corpus is the evidence; it is not an explicit "we have none". | <https://sandboxer.com/docs/security> | "Email **security@sandboxer.com** with a description, the steps to reproduce, and the impact you think it has." | unchanged |
| dpa | partly | A DPA is available but not self-serve or published: email `privacy@sandboxer.com`. No downloadable DPA, sub-processor list or SCC/UK-addendum page. Terms §9 puts controller obligations on the customer for end-user personal data. | <https://sandboxer.com/terms> | "If you need a Data Processing Addendum, write to privacy@sandboxer.com" | unchanged |
| open-source | no | Hosted only on dedicated servers Sandboxer operates; no source repository, licence, self-hosted edition, BYOC or on-prem option published. SDKs/CLI are clients, not the sandbox runtime. | <https://sandboxer.com/docs/llms.txt> | "on dedicated servers Sandboxer operates" | unchanged |

---

## 3. Rate-card inputs, in original units

The published **unit rates did not change**. The changes are to eligibility, retention and
one new per-start tariff. Everything below was read from the fresh `/pricing` fetch and
cross-checked against `/pricing.md` and `/docs/billing`.

### Shapes and rates (unchanged)

| Shape | vCPU | RAM | Disk for files | Multiplier | USD/hour | 730 h (provider figure) |
|---|---:|---:|---:|---:|---:|---:|
| `small` | 2 | 4 GB | 12 GB | 0.5× | **$0.018** | $13.14 |
| `default` | 4 | 8 GB | 50 GB | 1× | **$0.036** | $26.28 |
| `large` | 8 | 16 GB | 125 GB | 2× | **$0.072** | $52.56 |
| `xlarge` | 16 | 32 GB | 251 GB | ≈5.56× (50/9) | **$0.20** | $146 |

- vCPUs are shared; RAM is reserved. Disk is user files on top of a ~6–7 GB OS image.
- `xlarge` requires the $100 plan or higher (`403 machine_class_plan_required`).
- Rate card shapes (`small`/`default`/`large`/`xlarge`) are **unchanged**; no shape or hourly
  figure needs editing.

### Plans, packs and allowances

| Plan | Fee | Machine-time credit | Pack size | Concurrent | Starts / min · h · day | Storage | Shape gate |
|---|---:|---:|---:|---:|---|---:|---|
| $20 | $20/mo | $20 | $20 | 100 | 12 · 60 · 200 | 50 GB | no `xlarge` |
| $100 | $100/mo | $100 | $20 | 300 | 30 · 210 · 840 | 250 GB | all |
| $500 | $500/mo | $500 | $20 | 1,000 | 65 · 420 · 1,680 | 1 TB | all |
| $2,000 | $2,000/mo | $2,000 | $20 | 2,000 | 90 · 600 · 2,400 | 5 TB | all |

- **Unchanged:** $20 / $100 / $500 fees and credits, $20 pack, $20 excludes `xlarge`,
  monthly expiry of included plan time, packs never expire, plan time spent before packs.
- The rate card still models only the $20, $100 and $500 plans (as on 2026-10-29); the $2,000
  plan is published but not in `pricing/sandboxer.json`. That is a pre-existing omission, not
  a new change.
- An organization is **per seat**: price × seats, and concurrency/start limits × seats.
  **Storage is not multiplied by seats**: one plan amount for the org.
- Included-time figure: $20 ≈ 555 h of `default`; $100 ≈ 2,777 h; $500 ≈ 13,888 h;
  $2,000 ≈ 55,555 h. (The $20 figure is 555.56 h at $0.036; the site rounds.)

### New: paid starts above the limit (2026-10-31)

| Start number against the limit | USD per start |
|---|---:|
| Up to 1× | free |
| Above 1×, up to 1.5× | **$0.03** |
| Above 1.5×, up to 2× | **$0.05** |
| Above 2×, up to 3× | **$0.07** |

- Applies separately to the per-minute, per-hour and per-day limits; a start over several
  windows pays the highest bracket. Maximum 3× each limit.
- Paid from **prepaid credit (time packs) only**, never the plan's included time. Needs a paid
  plan and its first payment. Trials, complimentary plans and pack-only wallets do not burst.
- With no prepaid credit, the limit is a hard wall, as before.
- Full-3× day cost: $22 ($20 plan), $92.40 ($100), $184.80 ($500), $264 ($2,000).
- **Not representable** in the current `RateCard`: there is no per-start overage field. It
  does not affect A/B/C (A's 1,000 starts are spread; B and C have one start each), but it is a
  real published tariff a reader can incur.

### New: stopped-data retention (2026-10-31)

- A stopped sandbox keeps disk + memory + automatic snapshots for **14 days** after its last
  stop, at no charge; day-11 email; day-14 deletion; then listed as expired and cannot resume,
  fork or save (`409 snapshot_data_expired`, `dataExpiresAt`).
- Resume or fork before day 14 resets the clock at the next stop. Named snapshots are kept
  until deleted. Sandboxes created before **2026-10-29** are kept until deleted.
- Zero-data-retention accounts keep nothing after a stop.
- `RateCard.between: "kept"` is now time-limited; the schema has no retention field, so the
  model cannot express "kept for 14 days". This is a model limitation, not a price.

### New: storage auto-delete (2026-10-28)

- Off by default. When on and over the included quota, Sandboxer emails the LRU stopped
  sandboxes it will delete, waits at least 7 days, then deletes them if still over.
- Never deletes running sandboxes or named snapshots.
- API: `PATCH /api/v1/account/storage` with `{"autoCleanup": true}`; `GET /limits` exposes
  `storage.autoCleanup`.
- No price; it changes what "kept" means under quota pressure. Worth a rate-card note.

### Unchanged inputs

- **Egress:** $0/GiB, not billed, no published allowance or cap (`egress.perGiB: 0`).
- **Storage:** included quota, not billed; over-quota blocks creates rather than charging.
- **Minimum:** no per-run minimum, no rounding increment, no minimum duration.
- **Snapshots:** no separate charge; named snapshots count toward storage.
- **Free tier:** none (was already true in the rate card; the *trial* was the only free
  compute and it is now gone).
- **Currency:** USD; taxes excluded.
- **Upkeep:** still not published.

### A/B/C: inputs changed, totals not

| Case | Inputs used | Changed since 2026-10-29? | Total |
|---|---|---|---|
| A | `small` $0.018/h × 166⅔ h = $3.00; $20 plan floor; 1,000 starts | Hourly rate, hours, floor, start day-limit unchanged. **New:** per-minute 12 / per-hour 60 limits and paid starts above them. At 33 starts/day spread out, no overage. 1,000 starts in one burst cannot fit the 200/day limit (3× = 600), so the case implicitly spreads over ≥5 days or pays for burst days. | **$20.00** |
| B | `default` $0.036/h × 730 h = $26.28; $20 plan + $20 pack | Rate, hours, plan, pack, expiry unchanged. **New:** 14-day stopped-data rule does not bite an uninterrupted run. | **$40.00 cash** ($26.28 used) |
| C | `small` $0.018/h × 90 h = $1.62; 640 stopped hours free; $20 floor | Rate, hours, floor unchanged. **New:** 14-day expiry; the 3 h/day pattern has gaps < 14 days, so the same sandbox still survives. A single 640 h stop would expire on day 14; the model does not encode that. No 20 GB shape (12 GB or 50 GB), unchanged. | **$20.00** |

**Do not recompute the totals** — no rate, fee, pack, quota or shape input used by A/B/C
changed. The two new time/eligibility rules (paid starts, 14-day expiry) are caveats, not
price changes, and neither moves the modelled totals.

`checkedOn` should advance from **2026-10-29** to **2026-11-12** on the rate card, and the
provider profile's **2026-10-28** to **2026-11-12**. `research/sandboxer.md` should get a new
dated section, not a rewrite (its older evidence remains dated history).

---

## 4. First-party contradictions, both sides quoted

1. **`eu-central` create time: 0.32 s or 0.19 s?**
   - Machines/FAQ: "A new sandbox is `ready` in a median of 0.18 s in `us-east` and 0.32 s in `eu-central`" — <https://sandboxer.com/docs/machines>, table headed "Measured on 2026-10-28 from US-East (Leesburg, VA)".
   - Changelog 2026-11-02: "A `default` sandbox was ready in a median of 0.18 s in `us-east` and 0.19 s in `eu-central`" — <https://sandboxer.com/changelog>.
   - Reading: the 0.19 s is the newer re-measurement (2026-11-02, from Florida); the machines table still carries the 2026-10-28 figure. Use **0.18 s / 0.19 s** as the current claim and note the stale 0.32 s. This matters because `fast-start` is a yes either way, but the second region's number is 1.7× off.

2. **Where is `us-east`?**
   - Regions: "`us-east` | US East: Ashburn, Virginia" — <https://sandboxer.com/docs/regions>.
   - Machines: "Measured on 2026-10-28 from US-East (Leesburg, VA)" — <https://sandboxer.com/docs/machines>.
   - Reading: same northern-Virginia metro, different data-centre town. Keep "Ashburn, Virginia" as the product answer; the benchmark client is in Leesburg. Pre-existing; unresolved.

3. **"Resume keeps running processes" vs the conditional.**
   - llms.txt: "stopping saves memory as well as disk, so processes are still running after resume" — <https://sandboxer.com/docs/llms.txt>.
   - Snapshots: "Memory is restored on a machine with the same CPU type as the one the sandbox stopped on. If a machine with that CPU type is online but busy, the resume waits up to 2 minutes for it; if none is free by then (or none is online), it boots from disk instead (files intact, running processes not kept)" — <https://sandboxer.com/docs/snapshots>.
   - Reading: the absolute sentence is the marketing promise; the conditional is the implementation. Use the conditional in the capability row (`partly`), and say `requireMemory: true` is the strict mode. A resize resume is always a cold boot, so even the strict mode is not universal.

4. **"A stopped sandbox costs nothing and keeps everything" vs 14 days.**
   - Snapshots: "A stopped sandbox costs nothing and keeps everything." — <https://sandboxer.com/docs/snapshots>.
   - Same page, section "How long a stopped sandbox keeps its data": "A stopped sandbox keeps its disk, memory and automatic snapshots for **14 days** after it last stopped, at no charge. ... On day 14 the data is deleted" — <https://sandboxer.com/docs/snapshots>.
   - Reading: "keeps everything" means it does not discard on stop, not that it keeps forever. The 14-day rule is the operative one; `files-survive-stop` is still `yes` but now has a `14 days` figure and a shortfall sentence. This is the single most buyer-relevant wording trap on the site.

5. **Trial CPU-brake threshold: "full CPU" or "90% or more"?**
   - Changelog 2026-11-01: "A free-trial sandbox that runs at full CPU for 30 minutes straight is now slowed to 1 vCPU" — <https://sandboxer.com/changelog>.
   - Limits: "A trial sandbox that uses 90% or more of its vCPUs (averaged per minute) for 30 minutes in a row is slowed to **1 vCPU**." — <https://sandboxer.com/docs/limits>.
   - Reading: the limits page is the precise rule (≥90%, minute-averaged, 30 consecutive minutes); the changelog is shorthand. Applies only to grandfathered trials.

6. **"No free trial" vs trial language still in the docs.**
   - Pricing FAQ: "Is there a free tier? No. Plans start at $20/month; the first month is charged when you subscribe" — <https://sandboxer.com/pricing>.
   - Billing: "There's no free trial." — <https://sandboxer.com/docs/billing>.
   - Limits: "There's no free trial for new accounts. A trial that had already started keeps its limits until it ends: 2 sandboxes at once, the `small` and `default` sizes, and auto-stop within 8 hours" — <https://sandboxer.com/docs/limits>.
   - Reading: both are true. New accounts have no trial; accounts that started one before 2026-11-02 keep it until its end date. The site must say "grandfathered trials" or a reader will think the trial still exists. This is the source of the `trials-free-tiers` verdict change, not a contradiction.

7. **Packs "never expire" vs "while your account is open".**
   - Pricing: "**Time packs:** $20 each at the same rates; they never expire." — <https://sandboxer.com/pricing>.
   - Terms §7: "Credit packs do not expire while your account is open." — <https://sandboxer.com/terms>.
   - Reading: same rule with the obvious account-lifetime qualifier; "never" is marketing. Not a price contradiction, but the Terms version is the precise one.

8. **Organization roles: "owners and admins" vs owner/member.**
   - Terms §2: "Organizations: owners and admins of an organization control its members, keys, sandboxes and billing." — <https://sandboxer.com/terms>.
   - Organizations docs: "you become the owner"; "To remove members, change roles or set caps, use the dashboard's **Organization** page"; the only named roles are owner and member — <https://sandboxer.com/docs/organizations>.
   - Reading: "admins" in the Terms is generic, or an undocumented third role. The docs model owner/member; `roles` stays `partly` (no read-only role) either way. Flag for the next check.

9. **"Stopped sandboxes are free" vs they consume the storage quota and can block creates.**
   - Billing: "A stopped sandbox costs nothing" and "Storage isn't billed: each plan includes an amount for what you keep" — <https://sandboxer.com/docs/billing>.
   - Same page: "At or over it, new sandboxes (including from templates and share codes), forks and named-snapshot saves answer `402 storage_limit_reached` until you delete stopped sandboxes or named snapshots, or upgrade." — <https://sandboxer.com/docs/billing>.
   - Reading: free of a dollar charge, not free of a resource constraint. `cheap-pause` is still `yes`, but the shortfall should say the kept disk counts against a finite quota that can block new work.

10. **Status page 90-day uptime vs a 25-day-old product.**
    - Status: "99.89% · 30 days 99.89% · 90 days" for sandboxes, and "No incidents in the last 90 days." — <https://status.sandboxer.com>.
    - Launch: "Sandboxer is live" on 2026-10-18 — <https://x.com/jonoringer/status/2111826193578070439>.
    - Reading: the 90-day columns equal the 30-day ones and the history starts 2026-08-15 with `"status":"unknown"`; they are not 90 days of production traffic. Cite the 30-day figures, not the 90-day ones, as uptime evidence.

11. **"Every size is the same machine with the same features" vs `xlarge` is plan-gated.**
    - llms.txt: "Every size is the same machine with the same features." — <https://sandboxer.com/docs/llms.txt>.
    - Pricing: "xlarge $100+ plan" and Billing: "`xlarge` requires the $100 plan or higher." — <https://sandboxer.com/pricing>, <https://sandboxer.com/docs/billing>.
    - Reading: same feature set, different eligibility. Not a capability difference, but a buyer on the $20 plan cannot use the 16-core size. `big-machines` is `yes` with the plan gate in the shortfall.

12. **"Plans are per seat" vs storage is one amount, not per seat.**
    - Organizations: "An organization plan is **per seat**: the plan price × seats." and "Concurrency and start limits are the plan's limits **multiplied by seats**" — <https://sandboxer.com/docs/organizations>.
    - Billing: "An organization has one amount, from its plan (not multiplied by seats)." — <https://sandboxer.com/docs/billing>.
    - Reading: price, concurrency and starts scale with seats; storage does not. Both are current; say "storage is pooled per organization" to avoid implying seats × 50 GB.

**Pre-existing, still unresolved:** the `us-east` Ashburn/Leesburg split (baseline caveat) and the
conditional memory resume (baseline caveat). **New:** the 0.32/0.19 s split, the 14-day
"keeps everything" wording, the trial-language residue, and the owners/admins wording.

---

## 5. Products and surfaces the 16 features / 78 capabilities miss

The checklist is organised around "what kind of computer, how do I reach it, what does it
cost". Sandboxer has added a layer of **operations products** around that computer — task
objects, metering APIs, retention controls, eventing, compatibility shims — which the 78 rows
do not have a home for. These are the ones worth knowing about, split into what is new since
the last check and what was already there but is not represented.

### 5a. New since 2026-10-28

| Surface | What it is | Why the model misses it | Date | Source and quote |
|---|---|---|---|---|
| **Agent tasks** (`create_task`, `task_status`) | A first-class task object: run a coding agent on a connected GitHub repo in its own sandbox, on branch `sandboxer/<task-id>`, commit, open a PR against the base branch, then pause. `task_status` returns `queued / starting / running / committing / opening_pr / paused / failed / cancelled`, the PR, cost so far and any error. Exposed through the MCP server; the repo needs the Sandboxer GitHub App. | `prompt-api` covers "send a prompt, get a conversation". This is repo→branch→commit→PR→cost, with a task id and a lifecycle. It is the closest thing to a managed coding-agent product and the model has no row for it. | Undated; docs call it "the newest pair". Baseline recorded 18 MCP tools; live docs have 20. | <https://sandboxer.com/docs/mcp> — "Run a coding agent on a GitHub repo in its own sandbox and end in a pull request" |
| **Paid starts above the start limits** | Each start above a per-minute/hour/day limit costs $0.03 (1–1.5×), $0.05 (1.5–2×) or $0.07 (2–3×), paid from prepaid credit, up to 3× the limit. A full 3× day costs $22 on the $20 plan. | `billing-models` covers per-second compute and the plan floor. A per-*start* tariff is a second meter; no capability says "you can exceed the start limit for money". | 2026-10-31 | <https://sandboxer.com/docs/limits> — "On a paid plan, a start limit isn't a wall: starts above it are paid, up to 3x each limit." |
| **14-day stopped-data expiry** | Stopped sandboxes keep disk + memory + automatic snapshots for 14 days after the last stop; day-11 email; then deleted, listed as expired, `dataExpiresAt`, `409 snapshot_data_expired`. Pre-2026-10-29 sandboxes are exempt. | `files-survive-stop` and `cheap-pause` say "kept" and "free"; neither says *for how long*. The expiry state and API field are new. | 2026-10-31 | <https://sandboxer.com/docs/snapshots> — "On day 14 the data is deleted: the sandbox stays in your list as expired" |
| **Storage auto-delete** | Opt-in account setting: when over the included storage, delete least-recently-used stopped sandboxes after emailing the list at least 7 days ahead. Off by default; never running sandboxes or named snapshots. API `PATCH /account/storage`. | `storage` covers the quota blocking creates. It does not cover the provider deleting your stopped machines to get you back under. | 2026-10-28 | <https://sandboxer.com/docs/billing> — "we pick the stopped sandboxes that bring you back under, least recently used first" |
| **Region burst spill** | An unnamed create that exhausts the local ready pool can start in the other region, reporting `regionSource: "burst"`. Naming `region` pins it. | `choose-region` says "you decide"; the default now sometimes decides for you. A residency-sensitive buyer needs the exception. | 2026-10-31 | <https://sandboxer.com/docs/regions> — "a new sandbox can start in the other region instead of waiting" |
| **Client out-of-date warnings** | Older `sbx` prints a one-line update notice; local MCP tool results carry it; SDK responses carry `Sandboxer-Client-Warning` and `Sandboxer-Client-Latest`. | `cli`/SDKs are "yes"; version negotiation is an operational detail, not a capability. | 2026-10-31 | <https://sandboxer.com/changelog> — "When you use an older `sbx`, the command still works and ends with one line saying it's out of date" |
| **Trial CPU brake** | A grandfathered trial sandbox using ≥90% of its vCPUs (minute average) for 30 minutes is slowed to 1 vCPU; `cpuBraked`, `sandbox.cpu_braked`/`cpu_unbraked`; paying lifts it. | `trials-free-tiers` is now "no", but legacy trials still exist and this is a live performance limit on them. | 2026-11-01 | <https://sandboxer.com/docs/limits> — "slowed to **1 vCPU**" |
| **`payment_past_due`** | A failed plan payment does not stop running sandboxes; new starts answer `402 payment_past_due` with a billing link. | Billing rows describe price, not dunning states. | 2026-11-02 | <https://sandboxer.com/docs/limits> — "Your last payment didn't go through" |
| **Narrow in-sandbox token** | `SANDBOXER_TOKEN` is now limited to its own sandbox; account endpoints (`/me`, `/limits`, `/billing`, `/orgs`, `/webhooks`, `/alerts`, `/api-keys`) return `403`. A `noEnv` token is read+host only. | `scoped-keys` covers user-created keys; this is a per-sandbox identity with its own fixed scope, and it changed on 2026-11-08. | 2026-11-08 | <https://sandboxer.com/docs/api-keys> — "It can't read or change your account either" |
| **Reverse port forwarding** | `sbx forward --reverse --local 11434` exposes a port on your own machine *inside* the sandbox, so an agent can reach a local model, MCP server or webhook receiver. | `tunnel` is written as sandbox→your computer; the reverse direction is the other half. | Undated; absent from the 2026-10-28 notes | <https://sandboxer.com/docs/ssh> — "expose a port on **your** machine inside the sandbox" |
| **Shared organization sandboxes** | `sbx share <id>` moves a sandbox from `access: "view"` (teammates can see/stop, not enter) to `access: "use"` (any member can open, exec, prompt, stop, resume). The owner's injected logins are wiped at the next start. | `team-workspace` covers the shared wallet; it does not cover a sandbox changing hands, or the credential-wipe step. | Undated; absent from the 2026-10-28 notes | <https://sandboxer.com/docs/organizations> — "`sbx share sb_k3v9x2mq`" |
| **Browser profiles** | `sbx browser --profile /data/chrome-work` streams Chrome alone from a chosen user-data dir, so one sandbox holds several signed-in browser identities; profiles survive snapshots and forks. | `browser` says Chrome is installed; `desktop` says there is a desktop. Neither says browser-only stream or multiple profiles. | Undated; absent from the 2026-10-28 notes | <https://sandboxer.com/docs/desktop> — "one sandbox can hold several signed-in profiles" |

### 5b. Existing surfaces the 16 / 78 still do not represent

| Surface | What it is | Nearest capability, and the gap | Source and quote |
|---|---|---|---|
| **Named-snapshot versions** | `<name>-v<N>`, `ifLatest` for concurrent saves, `keep: N` to prune, labels, `fromLabels` to start from the newest matching snapshot, `storedBytes`. | `templates` says "reusable"; it does not say versioned, labelled or selectable by label. | <https://sandboxer.com/docs/mcp> — "With `versioned: true` each save is a new version under one name." |
| **Sandbox labels** | Up to 64 `k=v` labels per sandbox, filter `GET /sandboxes?labels=pr=412,repo=web`, replace with PATCH. Named snapshots take labels too. | No capability. `team-workspace` is about people, not machine metadata. | <https://sandboxer.com/docs/api> — "Sandboxes and named snapshots carry `labels`, string keys and values you choose" |
| **Per-sandbox usage API** | `GET /sandboxes/{id}/usage?since=&until=` returns billable seconds, dollars, `secondsPerDollar`, `running`; `sbx usage`. For billing your own end users. | `billing-models` is about how *you* pay Sandboxer, not how you meter a customer. | <https://sandboxer.com/docs/billing> — "Bill your own users from the same numbers that drain your balance" |
| **Daytona-compatible API** | A second API at `/daytona/api` that the official Daytona TypeScript/Python SDKs speak; create/list/get/delete/start/stop, commands, files, previews, labels, orgs; `not_supported` for custom images, volumes, GPUs, network allow-lists, PTY, LSP. | `rest-api` is one API. This is a compatibility surface with its own gaps, useful for migration and for Daytona-shaped clients. | <https://sandboxer.com/docs/daytona> — "Sandboxer has a second API that speaks Daytona's." |
| **Command history / process monitoring** | `sbx history` (every API/exec command with output and exit code, 90 days), `sbx ps` (live process list), 72 h of other process output, `--no-monitoring`. Readable while stopped. | `audit-log` is account-level and `not-published`; this is per-sandbox and real. It is the nearest thing to an audit trail and should be named in the shortfall. | <https://sandboxer.com/docs/long-running> — "Every command run through the API is recorded with its output, readable even while the sandbox is stopped" |
| **Setup scripts** | `setupScript` / `--setup-file` runs in the background as `user` once ready; `setupStatus` (`pending/running/done/failed`) and `setupError`. | No capability. It changes first-boot ergonomics: `ready` does not wait for the install. | <https://sandboxer.com/docs/long-running> — "Pass a script at create time; it runs in the background as `user` once the sandbox is ready" |
| **Idempotency keys** | `Idempotency-Key` on `POST /sandboxes` and fork; same key+body returns the same sandbox for 24 h; `409 idempotency_key_reused` on a different body. | `rest-api` says the API exists; it does not say creates are retry-safe. | <https://sandboxer.com/docs/api> — "Send `Idempotency-Key: <uuid>` on `POST /sandboxes` to make it safe to retry after a timeout" |
| **Zero data retention** | Account setting: a stop deletes the sandbox's data instead of archiving it; also disables idle pause. | `storage`/`files-survive-stop` assume data is kept. ZDR is the opposite mode and a compliance feature. | <https://sandboxer.com/docs/security> — "**Zero data retention** (account setting) deletes the data of every archived sandbox and every named snapshot instead of keeping it." |
| **OpenTelemetry export** | One OTLP/HTTP endpoint; per-sandbox metrics every 60 s (CPU, memory, disk, I/O pressure), lifecycle events as logs, command/prompt spans as traces; `service.instance.id` per sandbox. | `company`/`ways-to-drive` do not mention observability export. It is a real integration product. | <https://sandboxer.com/docs/opentelemetry> — "Export sandbox metrics, lifecycle events and command spans to any OTLP/HTTP collector" |
| **`failFast` and capacity errors** | `failFast: true` returns `202` or `503 no_ready_machine` within ~1.5 s instead of queueing; `503 capacity_exceeded` carries `details.availableBySize`; a refused fail-fast create bills nothing and does not count as a start. | `warm-pool` says pools exist; it does not say you can opt out of waiting or read per-size capacity. | <https://sandboxer.com/docs/machines> — "Pass `failFast` when you would rather try again or fall back" |
| **`handoff_session` / `sbx handoff`** | Moves a local Claude Code or Codex session plus its repo into a sandbox and resumes it headless; checkpoints untracked files on a temporary branch, pushes over SSH, resumes with the account key; `.env` stays behind unless `--include-env`; `--back` returns. Local MCP only. | `prompt-api` covers prompts *inside* a sandbox; this moves an existing laptop session *into* one. | <https://sandboxer.com/docs/mcp> — "Move this machine's Claude Code or Codex session and its repo into a new sandbox" |
| **GitHub App repository environments** | Connect GitHub once, attach repos with a base branch and setup script; new sandboxes clone into `/home/user/<repo>` with a token that can `git push` and `gh pr create`. | `secrets-store` covers variables/files, not repo provisioning or the GitHub App. | <https://sandboxer.com/docs/environments> — "New sandboxes clone them into `/home/user/<repo>` with a token that lets `git push` and `gh pr create` work" |
| **Webhooks + SSE events** | Signed HMAC-SHA256 webhooks for `sandbox.ready/error/archived/hydrated/degraded/recovered/cpu_braked/cpu_unbraked`; `GET /sandboxes/{id}/events` as SSE or poll. | `ways-to-drive` lists interfaces; it does not say the provider pushes lifecycle events. | <https://sandboxer.com/docs/webhooks> — "Get a signed HTTPS request when a sandbox becomes ready, errors, stops, finishes hydrating, degrades or recovers." |
| **Subdomain rename** | `PATCH /sandboxes/{id}` with a new `subdomain` re-points every hosted URL without downtime; old URLs stop resolving. | `public-url` says the address is stable; it does not say it is renameable. | <https://sandboxer.com/docs/hosting> — "re-points every hosted URL to the new name without downtime" |

**Candidate new capability IDs, if the owner wants the checklist to grow** (not proposed as
must-haves): `agent-tasks`, `usage-metering`, `sandbox-labels`, `snapshot-versions`,
`data-retention`, `storage-auto-delete`, `start-overage`, `observability-export`,
`setup-scripts`, `idempotent-creates`, `browser-profiles`, `reverse-tunnel`, `org-sharing`,
`fail-fast-capacity`. Each has a public first-party page and a buyer-visible consequence.

---

## 6. Integration impact for the parent

Nothing below was edited in the repo; this is the hand-off. The worktree is clean apart from
this scratch file (`.amp/in` is ignored).

### 6a. Provider profile (`site/src/data/providers/sandboxer.json`)

- `checkedOn`: **2026-10-28 → 2026-11-12**.
- `billing.stopped`: add the 14-day expiry. Suggested: "Nothing for compute. Storage counts
  against an included quota and is not billed. Stopped data — disk, memory image and
  automatic snapshots — is kept for 14 days after the last stop, then deleted; going over
  the quota blocks new sandboxes rather than charging. Optional auto-delete trims the
  least-recently-used stopped sandboxes after a 7-day notice."
- `billing.minimum`: the 7-day trial sentence is **stale**. Suggested: "The $20 plan is the
  floor: there is no free tier and no trial for new accounts. Choosing a plan charges the
  first month immediately; signup, docs, CLI and dashboard need no card, but creating a
  sandbox does. Grandfathered 7-day/25-hour trials still convert to $20."
- `billing.planFee`: add "per seat; storage is one amount per organization, not per seat;
  starts above the plan limits cost $0.03–$0.07 each up to 3×, from prepaid credit."
- `usability.signup`: the "7-day trial with 25 hours ... day 8" sentence is **stale**.
  Suggested: "GitHub, Google, email code or email and password. Signing up needs no card;
  a card and a plan are needed before the first sandbox, and the first month is charged at
  subscribe. No trial for new accounts."
- `usability.tripsUp`: replace "The trial becomes a subscription on day 8 unless cancelled."
  with "There is no trial: the first month is charged the moment you pick a plan." Keep
  "The card comes first".
- `fits.well`: "Stopped time that is free, with the whole disk kept while the sandbox is
  stopped." → "Stopped compute that is free, with the whole disk and memory image kept for 14
  days while the sandbox is stopped."
- `caveats` "Its sizes and prices exactly match Boat's": the **disk/retention sentence is now
  wrong**. Both keep a stopped disk for 14 days. Replace "Boat deletes a stopped sandbox's
  disk after 14 days while Sandboxer keeps it" with "Boat and Sandboxer both keep a stopped
  disk for 14 days; Boat's cleanup is still report-only, while Sandboxer deletes on day 14.
  Boat still offers a 7-day/25-hour trial; Sandboxer removed its trial on 2026-11-02." The
  "sizes and prices match" part still holds for the four shapes and the $20/$100/$500/$2,000
  ladder.
- `caveats` "Ten days old at the time of research": the detail is dated. Either leave as
  history or add "25 days old at the 2026-11-12 recheck". The underlying open questions
  (no reviews, no team page, one shared entity) still hold.
- `caveats`: **add** "Stopped data expires after 14 days" with the snapshots quote and the
  pre-2026-10-29 exemption. This is the biggest data-loss fact a non-technical reader can
  miss.
- `caveats`: **add** "No trial; the first month is charged at subscribe" if the trials
  feature is not enough. This is a buying-decision fact, not just a feature row.
- `strengths`: "created in about 0.7 seconds" is stale; use "0.18 s median in us-east for a
  default create (2026-10-28, provider measurement)". "Free stopped storage within a
  generous quota" → "Free stopped storage for 14 days within a generous quota".
- `company.facts` "Status and SLA": update to "API, MCP, billing and email 100%; website and
  sign-in 99.96%; sandboxes and preview/SSH 99.89% over 30 days (the 90-day figures are
  identical and cover only the launch period). No SLA during early access."
- `whatItIs`: the third paragraph is still true; consider "no free trial" there. The
  one-liner still reads correctly.
- `fits.badly`: "A team that wants per-seat pricing to stay flat" still true; consider adding
  "A buyer who wants to try before paying" because there is no trial.

### 6b. Rate card (`site/src/data/pricing/sandboxer.json`)

- `checkedOn`: **2026-10-29 → 2026-11-12**.
- `summary`: still true; add "no trial, and stopped data expires after 14 days" if you want
  the card to carry the commercial change.
- `shapes`, `egress`, `plans`: **no numeric edits**.
- `notes`: add
  - "Stopped data is kept 14 days after the last stop, then deleted; sandboxes created before 2026-10-29 are exempt."
  - "No free trial: the first month is charged at subscribe; signup needs no card but a sandbox does."
  - "Starts above the plan's per-minute/hour/day limits cost $0.03 / $0.05 / $0.07 each up to 3x, from prepaid credit; not modelled."
  - "Storage is one amount per organization, not multiplied by seats."
  - "Opt-in storage auto-delete removes LRU stopped sandboxes after a 7-day notice; named snapshots and running sandboxes are never deleted by it."
- `upkeep`: unchanged.

### 6c. Features

Only **`trials-free-tiers` changes verdict**: `partly` → `no`, figure `None; $20 from day
one`, scenario "No free tier and no trial: choosing a plan charges the first month
immediately, and a card is needed before the first sandbox", note "No free tier or trial;
$20/month is the floor. Signup, docs, CLI and dashboard need no card, but creating, forking
or resuming needs a plan and card. Grandfathered 7-day/25-hour trials keep their limits until
they end. The old trial's CPU brake and 8-hour auto-stop still apply to them."

Other rows need text, not verdicts:
- `billing-models`: add paid starts and 14-day stopped retention.
- `storage`: "free within a quota" → "free for 14 days within a quota"; add auto-delete.
- `lifecycle`: add 14-day expiry; `requireMemory` 30 min.
- `snapshots-forks`: add versions/labels/share codes; auto snapshots expire with the sandbox.
- `idle-timers`: 30–120 min (not 15–120), max 7 days, 14-day retention after auto-stop.
- `sizes-regions`: grow on resume/fork; burst spill; pin region.
- `reaching-it`: IPv4 `sshEndpoint`, reverse forward, browser-only stream.
- `keys-secrets`: key TTLs; in-sandbox token narrowed 2026-11-08.
- `ways-to-drive`: 20 MCP tools, Daytona API, labels, idempotency, usage API.
- `built-in-agents`: `create_task`/`task_status`; Prime Agent coming.
- `teams-accounts`: shared sandboxes, concurrency cap, storage not × seats.
- `company`: status numbers, Terms 2026-11-02, 25 days old.
- `custom-domains`, `outbound-network`, `isolation`: unchanged.

### 6d. Capabilities

**No verdict changes.** 23 rows need figure/note/shortfall text (the other 55 can stay):
`live-resize`, `choose-region`, `pause-memory`, `warm-pool`, `fast-start`, `older-snapshot`,
`templates`, `files-survive-stop`, `choose-idle`, `ssh`, `tunnel`, `scoped-keys`,
`python-sdk`, `ts-sdk`, `mcp-server`, `prompt-api`, `desktop`, `spend-cap`, `cheap-pause`,
`free-tier`, `free-credit`, `no-card`, `status-page`. `big-disk` is unchanged (251 GB).

Most important:
- `files-survive-stop`: figure `14 days`; shortfall "Stopped data is deleted 14 days after the
  last stop unless saved as a named snapshot; sandboxes created before 2026-10-29 are exempt."
- `free-tier` / `free-credit` / `no-card`: no trial; $20 floor; card needed before the first
  sandbox.
- `mcp-server`: 20 tools (not 18), hosted + local, `create_task`/`task_status`.
- `live-resize`: grow on resume/fork, always cold-boots; no shrink; still `no`.
- `choose-region`: pin `region` or a burst can spill to the other region.
- `scoped-keys`: TTL default 90 d / max 365 d; in-sandbox token limited to its own sandbox.
- `cheap-pause`: free for 14 days, then deleted.

### 6e. Other data

- `docs.json` → `sandboxer.trials-free-tiers.title`: **"Pricing (trial)"** is stale. Use
  "Pricing (no trial)" or "Pricing and plans". URL unchanged.
- `situations.json` → `answer-when-asked` → Sandboxer `watch`: **"the trial converts to $20 a
  month"** is stale. Suggested: "The default TTL is one hour, there is no trial (the first
  month is charged at signup), stopped data expires after 14 days, and memory restore needs a
  matching machine within two minutes."
- `usecases.json`: no stale trial text found. `claude-code-team`'s "$40 a month" still works
  (5 default × 8 h × 22 d = 880 h × $0.036 = $31.68, covered by the $20 plan + one $20 pack).
  `hermes-agent` / `openclaw` manual routes still correct; `code-interpreter` `price: null`
  is still null; `scheduled-scraper` still has no scheduler.
- `changes.json`: optional entry, e.g. "Sandboxer removed its free trial and expires stopped
  data after 14 days", provider `sandboxer`, date 2026-11-12, sources pricing + snapshots +
  limits. The feed's existing entries are site changes, so this fits if the parent wants a
  visible note.
- `research/sandboxer.md`: append a **2026-11-12** section; do not rewrite 2026-10-28. Mark
  these older claims as superseded:
  1. "ten days old" / "ten-day-old product" (now 25 days).
  2. idle pause "15 to 120 minutes" (now 30–120 for new accounts; trial 15 only grandfathered).
  3. "A stopped sandbox costs nothing and keeps everything" (now 14 days).
  4. create "0.69 s median" and "about 1.5 s" for large (now 0.18 s us-east; 0.32/0.19 s
     eu-central; 1–2 s boot).
  5. status "API 100% and sandboxes 99.45%" (now sandboxes 99.89%, web 99.96%).
  6. §10 trial row "$0, 7 days, 25 hours" (now no trial for new accounts; grandfathered only).
  7. §10 "no per-request charge" (now paid starts above the limits, $0.03–$0.07).
  8. §10 "The trial converts automatically" (now only grandfathered trials).
  9. §11 A "inside the 200-a-day start limit" (also 60/hour and 12/minute; spread required).
  10. §11 C "630 stopped hours" (add 14-day expiry caveat).
  11. §14.11 trial sandbox length (grandfathered only).
  12. §15 "The card starts a 7-day trial ... becomes the $20 plan on day 8" (no trial).
  13. §16 "Sandboxer keeps stopped sandboxes 'Until you delete them'" and "Boat deletes ...
      while Sandboxer keeps it" (both 14 days now).
  14. §12 glossary idle pause "15 to 120 minutes" (30–120).
- `PRICE-CHECK.md` baseline: the checker will flag the trial removal only if it compares
  trial text; the four rates and three plan fees are unchanged, so a baseline update is not
  required for the rates. If the baseline stores a trial line, update it.

### 6f. Contradiction / caveat candidates for the site

1. `eu-central` create time **0.32 s** (machines table) vs **0.19 s** (changelog 2026-11-02).
2. `us-east` **Ashburn** (regions) vs **Leesburg** (machines benchmark client) — pre-existing.
3. "Resume keeps running processes" (llms.txt) vs "only on the same CPU type within 2
   minutes" (snapshots) — pre-existing.
4. "A stopped sandbox ... keeps everything" (snapshots) vs "14 days, then deleted" (same page,
   FAQ, Terms, pricing) — **new**.
5. Trial CPU brake "full CPU" (changelog) vs "90% or more ... averaged per minute" (limits) —
   **new**.
6. "Owners and admins" (Terms) vs owner/member only (Organizations docs) — **new**.
7. "Credit packs ... never expire" (pricing) vs "do not expire while your account is open"
   (Terms) — qualification, not a contradiction.
8. "Every size is the same machine with the same features" (llms.txt) vs `xlarge` needs the
   $100 plan (pricing/billing) — eligibility, not features.
9. "Plans are per seat" (organizations) vs storage one amount, not × seats (billing) —
   qualification, not a contradiction.
10. 90-day status uptime on a 25-day-old product — the 90-day columns equal the 30-day ones
    and the history starts with `unknown`; do not cite them as 90 days of production.

The two the site should definitely carry: **#4** (data-loss wording) and **#1** (the stale
second-region latency). #2/#3 are already known and can stay as open caveats. #5/#6 are
minor wording defects, not buyer traps.

---

## 7. Verification and coverage

- **Features:** 16/16 IDs present, exactly one row each. Quotes matched against the cited
  live page after whitespace/emphasis normalisation: **16/16**.
- **Capabilities:** 78/78 IDs present, exactly one row each. Quotes matched: **78/78**.
  Total **94/94**.
- **Changelog:** 68 entries read (2026-10-17 → 2026-11-08). Every entry after 2026-10-28 is
  reflected above or explicitly classified as a guide-only change.
- **Docs:** 28 documentation/guide Markdown pages fetched (25 docs + 3 guides), including `llms.txt` (144 KB), `llms-full.txt`
  (2.83 MB), `openapi.yaml` not re-read this pass (the API reference page and the docs were),
  Terms/Privacy/Acceptable Use HTML, status JSON and status HTML.
- **Pricing:** read three ways — Context `web_scrape` fresh (`maxAgeMs: 0`), TinyFish
  `fetch_content`, direct `curl` of `/pricing` (HTTP 200, 38,852 bytes) and `/pricing.md`
  (HTTP 200, 2,606 bytes). Same four rates, four plans, four pack rows, four burst rows.
- **Status:** `GET /api/status.json` at `2026-11-12T10:00:50Z`; eight components, all
  operational, zero incidents, 30/90-day uptime pairs.
- **Quote normalisation:** Unicode NFKC, Markdown emphasis/backticks/heading marks stripped,
  table pipes and link markup removed, whitespace collapsed, case-folded. No ellipses were
  inserted; every quote is a contiguous substring of the cited page after that
  normalisation.
- **Freshness caveat:** the docs Markdown mirror is served live (no `age` header used); the
  rendered pricing HTML and the mirror agreed. The only cached-looking surface was the
  pricing page's JSON-LD/meta description ("Stopped sandboxes are free"), which is less
  precise than the body ("free for 14 days") and was not used as evidence.
- **Worktree:** `git status --short` is empty; no data files, commits or pushes. The only
  artifact is `.amp/in/scratchpad/sandboxer-recheck.md` (ignored by git).

### 7a. What was not verified

- No account, card, checkout or sandbox. Plan proration, the `payment_method_required` path,
  the dashboard create button, Alerts UI, file browser and auto-delete toggle are
  **docs-inferred**, not clicked.
- No performance measurement. 0.18 s / 0.19 s / 0.32 s / 1.05 s / 1.07 s / 6 s are the
  provider's own figures; the two `eu-central` create figures conflict (see §4).
- No independent review or benchmark found in a fresh search. One X post lists Sandboxer
  among alternatives to Vercel Sandbox (third-party, not a review); no battleships.dev
  entry. "No independent reviews" remains a search result, not proof.
- No SOC 2 report, DPA, sub-processor list or trust centre could be requested without an
  account/sales contact. Their absence is documented, not their non-existence.
- No Windows, ARM, GPU or custom-kernel test. Docs are explicit on GPU ("none"), silent on
  Windows/ARM, and the kernel is "our own kernel build".
- No test of paid starts, burst spill, snapshot versions/labels, org sharing, reverse
  forwarding, browser profiles, ZDR or OTel export. These are documentation claims.
- No currency/tax check beyond "USD, taxes excluded"; VAT/sales-tax behaviour at checkout is
  not documented.
- No test of the 14-day clock, day-11 email or `dataExpiresAt` (the product is 25 days old;
  the oldest stopped sandbox could not yet have crossed it without an account).

### 7b. Unknowns worth a follow-up

1. Does the dashboard have a **Create sandbox** button? Docs only show CLI/API; `/app` is
   auth-walled.
2. Is there an **account audit log** behind the dashboard? No page, endpoint or export is
   documented; `sbx history` is per-sandbox and 90 days.
3. Is **SSO/SAML/SCIM** on the roadmap or enterprise-only? No mention anywhere.
4. **SOC 2 / ISO 27001** status: not claimed; is a report available under NDA?
5. **DPA/sub-processors**: email-only; is there a standard DPA and a sub-processor list?
6. **create_task** launch date and whether it has a REST endpoint (docs expose it only
   through MCP).
7. **Paid starts**: exact rolling-window accounting when a start is over several limits; the
   docs say "pays the highest price among them", but not whether it consumes quota in all
   windows.
8. **14-day expiry**: does a fork/resume of an expired sandbox ever work, or is it always
   `409`? Docs say cannot resume/fork.
9. **Trial grandfathering** end date: "until it ends" — is that the original 7 days or a
   fixed sunset?
10. **Org admins**: Terms say owners and admins; docs name only owner/member. Is there a
    hidden admin role?
11. **Windows/ARM**: not published; likely no.
12. **Custom domain** ETA: "on the roadmap" since launch; no date.
13. **xlarge pool** in `eu-central`: machines lists none; is xlarge us-east-only in practice?
14. **Storage auto-delete** interaction with the 14-day rule: if auto-delete is off and you
    are over quota, does the 14-day expiry still run? (Yes, it is independent, but the docs
    do not say what happens to the quota after expiry.)
15. **Packs while over quota**: packs without a plan get 50 GB storage; does buying a pack
    after expiry restore expired sandboxes? (No — expired data is deleted.)

---

## 8. Bottom line

**Sandboxer's computer did not change; its commercial terms did.** The four shapes, the
$0.018 / $0.036 / $0.072 / $0.20 hourly rates, the $20 / $100 / $500 / $2,000 plan ladder, the
$20 packs, the 50 GB–5 TB storage quotas and the no-egress-bill rule are all the same. What
changed in the last two weeks is that the **free trial is gone** (new accounts pay the first
month at subscribe), **stopped data now expires after 14 days** (it used to be kept until you
deleted it), and **you can pay $0.03–$0.07 per start to exceed the plan's start limits**.
There is also a new MCP "agent task" product that runs a coding agent on a GitHub repo and
ends in a pull request.

For the guide, the material edits are: `trials-free-tiers` **partly → no**; `files-survive-stop`
and `cheap-pause` gain a **14-day** limit; `billing-models` gains **paid starts** and loses the
trial; `mcp-server` goes **18 → 20 tools**; the **Boat caveat** must drop its "Sandboxer keeps
stopped disks, Boat deletes after 14 days" claim because both now keep a stopped disk for 14
days (Boat's cleanup is still report-only); and
`research/sandboxer.md` has a handful of superseded trial/retention/age claims that should be
marked, not silently rewritten. **A/B/C totals do not move** — the plan floor and the four
hourly rates are unchanged — but C now carries a 14-day-expiry caveat and A a start-rate
caveat. No capability verdict changed; 23 rows need new figures or notes.

The one thing a buyer could get wrong from the old page: **a stopped sandbox is not a safe
place to leave work indefinitely any more.** Fourteen days after the last stop, the disk and
the memory image are deleted; only a named snapshot survives. That is the sentence to put in
front of a non-technical reader.

---

*Prepared 2026-11-12 for the Sandboxer recheck thread. Desk research only. The parent thread
owns integration, tests, build and publication.*

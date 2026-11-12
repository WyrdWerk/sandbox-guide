# Cloudflare Sandbox — recheck, 12 November 2026

Provider id `cloudflare-sandbox` · repo `sandbox-guide` at `origin/main` 4432d00 · previous check **2026-10-28** (profile), rate card **2026-10-30**.
Desk research only: no account, credential, deploy, container or billable action. Recommended dates: provider `checkedOn: 2026-11-12`, pricing `checkedOn: 2026-11-12` (every source below was reread today).

**Bottom line.** Prices, plans and allowances are unchanged. What moved is the platform around them: the limits page now documents a custom-instance floor of 1/16 vCPU / 256 MiB / 2 GB, the account concurrency ceilings went up 10×, the old `allowedHosts` egress API was replaced by intercepts, the `default` scheduling policy was deprecated, and a new experimental **Agents SDK container-harness** layer now runs Claude Code and Codex in a Container with no Dockerfile, sessions in Durable Object SQLite and a five-minute idle snapshot. Three prior claims are now stale: "no start time is published" (Cloudflare cites a 648 ms median), "the only terminal is one you build" (`exec({ pty })`), and "no pool of pre-started machines" (the runtime restores a prepared VM). One prior claim is now contradicted: the "3 GiB of memory per vCPU" minimum is gone from the limits page. A September cross-tenant disk-block disclosure, which predates the last check, was missing from the profile and should be added.

## How this was checked

| Route | Use | Result |
|---|---|---|
| `curl -H 'Accept: text/markdown'` | every `developers.cloudflare.com` page, its `.md` twin | 200 on every page fetched (40 form the quote-check corpus); quotes below are from these |
| `curl` | `sandbox/llms.txt`, `containers/llms.txt`, `llms-full.txt`, `changelog/product/{sandbox,containers}`, `cloudflarestatus.com/api/v2/*`, GitHub + npm registry, `www.cloudflare.com` product page, terms, SLA, DPA | 200 except `cloudflare.com/mcp/` (404, not needed) |
| **Context** `web_scrape`, `maxAgeMs: 0` | fresh price retrieval: Containers pricing, Containers limits, two Cloudflare blog posts | succeeded; see "Price freshness" below |
| **TinyFish** `search` (after_date 2026-10-28) | what changed off-docs; surfaced the two Cloudflare blog posts and the 9 Nov harness changelog entries | succeeded |
| Amp native web tools | not used | — |

Quote checks: every quotation below was matched mechanically against the fetched page (whitespace collapsed, Markdown emphasis/links/HTML tags stripped, typographic apostrophes normalised), then read in context. 94 of the 112 quotes already in the site data still match a live page; the 18 that do not are listed in §6 with replacements (plus one row whose "quote" is not a sentence). Table cells are quoted as `row | value` and match the Markdown table row, not a prose sentence.

**Price freshness (required check).** The Containers rate card is a docs page, not a checkout page. Fresh retrieval with `maxAgeMs: 0` was run twice today, about five minutes apart, and returned the same four meters, the same included allowances and the same egress table; the page's own `dateModified` is `2026-10-05`, i.e. it has not been edited since before the last check. The fresh text matches the `curl` `.md` twin fetched in the same session (same meters, allowances, egress rows and `Last updated Oct 5, 2026` line). `developers.cloudflare.com` is Cloudflare's own origin, and the `.md` twin is the source its HTML page renders, so there is no agent-index or JavaScript fallback to mistake for the page. That is the strongest freshness evidence available without an account.

**Inventory.** `sandbox/llms.txt` still lists **121** pages (unchanged). `containers/llms.txt` now lists **40** pages (baseline said 41). New since the last check: `containers/guides/migrate-to-durable-object-scheduling-policy`, `containers/guides/image-management`, `containers/configuration/rollouts`, `containers/configuration/scaling-and-routing`, `containers/configuration/workers-connections`, `containers/api/durable-object-container` (the last existed but was renamed/moved). Nothing was removed that the profile cited except by redirect (`/containers/pricing/` → `/containers/platform/pricing/`).

**Pages that changed after 28 October** (the rest of the Sandbox set is dated 22–23 October and is what the baseline read): Containers limits **Nov 12**, Wrangler configuration **Nov 11**, outbound traffic **Nov 9**, Container lifecycle **Nov 9**, Containers FAQ **Nov 9**, DO container API **Nov 9**, migrate-to-DO pages **Nov 9**, scheduling policy **Nov 4**, Dynamic Workers **Oct 31**, R2 pricing **Oct 30**, Agents "Sandbox" tool **Oct 27**. Sandbox docs themselves: no page newer than **Oct 23**. New: Agents SDK harness set **Nov 9–10**.

---

## 1. Features (16)

Legend: `D` = `https://developers.cloudflare.com`. "Δ" = changed since 28 Oct. Verdicts are the current ones; where nothing changed the row is one line.

### isolation — **yes** (unchanged verdict, new caveat)
Figure `Firecracker; all root`. One Firecracker microVM per container, own kernel and network, image runs as a Linux container inside it, every process has root capabilities, so there is no privilege boundary between users inside one sandbox; no memory snapshot, pause or fork.
"D/containers/concepts/architecture/": "Each container instance runs in a Firecracker microVM with its own kernel and network."
"D/sandbox/concepts/security/": "In a deployed sandbox, every process has the same Linux capabilities as `root`, so file permissions do not restrict it, and it can switch back to `root`."
**Δ Caveat to add:** the storage layer did not hold that boundary until September. `blog.cloudflare.com/containers-cross-tenant-vulnerability/` (24 Sep 2026): "The researchers demonstrated that a customer with a Workers Paid account could recover residual disk blocks previously used by Containers on the same host." Root cause: dm-thin pools with `skip_block_zeroing` and a 64 KiB block size, shared across customer accounts; a 4 KiB write left up to 60 KiB of the previous tenant readable. Reported 4 Sep, runtime fix merged and rolled out 4–7 Sep, "cleanup of all pre-mitigation cached snapshots" completed 19 Sep. This qualifies the isolation *feature* row's note, not its verdict (the VM boundary was never crossed).

### sizes-regions — **partly** (Δ evidence and shortfall)
Figure `4 vCPU / 12 GiB / 20 GB` (still true). Presets `lite` 1/16 vCPU · 256 MiB · 2 GB, `basic` 1/4 · 1 GiB · 4 GB, `standard-1` 1/2 · 4 GiB · 8 GB, `standard-2` 1 · 6 GiB · 12 GB, `standard-3` 2 · 8 GiB · 16 GB, `standard-4` 4 · 12 GiB · 20 GB. The limits page now documents custom-instance minimums of **1/16 vCPU, 256 MiB, 2 GB**; per-instance maxima **4 vCPU / 12 GiB / 20 GB**; no GPU; `linux/amd64` only; placement chosen by Cloudflare, no pinning under `durable_object`.
"D/containers/platform/limits/": "Custom instance types using the `durable_object` scheduling policy have the following minimums:" … "| vCPU | 1/16 (`0.0625`) |" … "| Memory | 256 MiB |" … "| Disk | 2 GB (`2000` MB) |" … "| vCPU per instance | 4 |" … "| Memory per instance | 12 GiB |" … "| Disk per instance | 20 GB |"
"D/containers/configuration/scheduling-policy/": "The runtime does not accept `basic` or the legacy `dev` and `standard` aliases."
**Δ** The old limits page said "Minimum vCPU | 1" and "Memory to vCPU ratio | Minimum 3 GiB memory per vCPU". Both statements are gone (page dated Nov 12). `basic` is no longer startable at runtime under `durable_object`, so a sandbox has **five** usable presets, not six. Shortfall text should stop claiming the 3 GiB-per-core rule; see §4, contradiction 1.

### lifecycle — **no** (unchanged)
Figure `No pause; stop wipes disk`. An instance runs only until something stops it; processes and disk end with it; the next `start()` is a new instance. A snapshot carries files, not memory. Deploys restart the Durable Object but keep the instance and its image; `start()` throws while one runs, so a new image needs a stop first.
"D/sandbox/concepts/lifetime/": "An instance runs only until something stops it, and its processes and the files on its disk end with it. The next `start()` creates a new instance."
Same page: "Container [rollouts] replace instances only in Container applications that use the [default scheduling policy], so no rollout replaces a sandbox."

### snapshots-forks — **partly** (Δ note)
Figure `Filesystem only; 30 days`. `snapshotContainer()` saves the writable root filesystem, max 20 GB, expires 30 days after creation or last restore, public beta, tied to the image it was made from. No memory, no fork of a running machine. **New:** one snapshot is reusable and can start many sandboxes — "Since snapshots are immutable and reusable, multiple Containers can start independently of the same prepared environment" (blog.cloudflare.com/faster-agent-sandboxes/). Forking a *running* machine still does not exist.
"D/sandbox/concepts/lifetime/": "`snapshotContainer()` saves the writable root filesystem of a running instance. It does not save separately mounted filesystems, memory, or processes."
"D/containers/platform/limits/": "| Maximum snapshot size | 20 GB |" · "| Snapshot retention | 30 days from creation or the most recent restore |"

### storage — **partly** (unchanged)
Figure `20 GB; wiped on stop`. 20 GB maximum disk, deleted when the instance stops. Three persistence paths: snapshot (30 days, 20 GB), `DirectoryBackup` into your own R2 (no expiry), `S3Mount` R2/S3 prefix as a directory (outlives every instance, no POSIX locks/rename/permissions). Mounts now consume outbound intercepts: "Each new mount adds an outbound intercept, and `unmount()` does not remove it."
"D/sandbox/files/": "Stopping the instance deletes the files on its disk."
"D/sandbox/files/mount-an-r2-bucket/": "The `S3Mount` class from `@cloudflare/sandbox` mounts one prefix of a bucket as a directory with `s3fs`."

### idle-timers — **partly** (Δ harness layer)
Figure `No default; 6 h max` for the sandbox primitive. Sandboxes 1.0 has **no default** inactivity timeout; if you set one it is capped at 6 h (`21600000` ms), is lost when the Durable Object restarts, and code running inside does not count as activity — only requests, alarms, streamed responses or an accepted WebSocket keep the object active. **New:** the Agents SDK `ContainerHarness` adds its own default: "The container goes idle. After five minutes, the harness snapshots the filesystem and stops it. The next prompt restores the snapshot and resumes the CLI's session." (`D/agents/harnesses/container/`). That is a 5-minute idle stop with automatic file restore, at the agent layer only.
"D/sandbox/concepts/lifetime/": "Code that runs inside the instance does not count as activity."

### reaching-it — **partly** (unchanged)
Figure `No public port`. No address for the machine; HTTP from the Internet reaches it only through your Worker; previews are paths your Worker forwards (or per-preview hostnames). SSH exists only through `wrangler containers ssh`, does not start a stopped container and does not keep one alive. No built-in preview auth, token or IP allowlist — authentication is Worker code.
"D/sandbox/previews/": "The server has no public port, so your Worker forwards requests to it."
"D/containers/guides/ssh/": "SSH does not expose a publicly accessible port on the Container."

### custom-domains — **partly** (unchanged)
Figure `Worker route + DNS`. A wildcard DNS record plus a Worker route (`*.example-previews.com/*`) send every preview hostname to your Worker; each preview then gets its own origin, so one preview cannot read another's cookies or storage. TLS is Cloudflare's for the zone. Not a sandbox feature and not per-sandbox configuration.
"D/sandbox/previews/serve-previews-on-their-own-hostnames/": "A wildcard DNS record and the route `*.example-previews.com/*` send every preview hostname to your Worker."
Same page: "Code in one preview cannot read your application pages or the storage of another preview."

### outbound-network — **partly** (Δ rewritten API)
Figure `1 TB a month, then $0.025/GB`. Outbound is off unless `enableInternet: true`; with it off, only traffic matched by an outbound **intercept** leaves, and only HTTP/HTTPS can be intercepted. Intercepts are registered on `ctx.container` (`interceptOutboundHttp`, `interceptOutboundHttps`, `interceptAllOutboundHttp`) with a `WorkerEntrypoint` from `ctx.exports`; they last until the container stops and cannot be removed while it runs. A container holds **128 intercept entries** (64 hostname targets, or 128 IP/CIDR targets). With internet off, DNS resolves only intercepted hostnames (placeholder address); every other lookup times out, and non-HTTP traffic is denied. No static egress IP and no private network/VPC peering. Outbound TCP on any port is allowed when `enableInternet` is true; with it false, only HTTP/HTTPS intercepts leave, so other ports and UDP are blocked. Egress is $0.025/GB in North America & Europe after 1 TB, $0.05/GB in Oceania/Korea/Taiwan and $0.04/GB elsewhere after 500 GB. New per-request cap: outbound HTTP request body **100 MiB** by default.
"D/containers/configuration/outbound-traffic/": "When `enableInternet` is `false`, only traffic that an intercept handles can leave the container. Only HTTP and HTTPS traffic can be intercepted. Your intercepts decide which DNS lookups resolve."
Same page: "Outbound intercepts only handle HTTP and HTTPS traffic. Other traffic never reaches an outbound handler."
"D/containers/api/durable-object-container/": "A container has 128 intercept entries, which `interceptOutboundHttp()`, `interceptOutboundHttps()`, and `interceptAllOutboundHttp()` share."
"D/containers/platform/limits/": "Cloudflare limits each HTTP request body forwarded from a Container to an external service through an [outbound handler] to **100 MiB by default**."
**Δ** The old `allowedHosts` / "outbound handler" API and the sentence "Only ports `80` and `443` are available" are gone from the Containers docs. A `mount()` now costs an intercept entry, which makes the 128-entry cap buyer-relevant for multi-mount sandboxes.

### keys-secrets — **yes** (unchanged; evidence refreshed)
Figure `No, Worker injects`. The credential stays in the Worker; an outbound handler adds it after the request leaves the sandbox, for HTTPS only (an HTTP request would cross the internet unencrypted). `S3Mount` gives the sandbox placeholder R2 credentials and the Worker signs each request. Once a value is inside, all code there can read it and send it anywhere the sandbox can reach. The new harness applies the same pattern to model keys: "The CLI calls a placeholder host with a placeholder key. `ContainerEgress`, a Worker entrypoint in your Worker, adds the real credentials to each model request after it leaves the container." (`D/agents/harnesses/container/`).
"D/sandbox/concepts/security/": "A Container can send its request without the credential, and an outbound handler in your Worker adds the credential after the request leaves the sandbox."

### ways-to-drive — **partly** (Δ new CLI/scaffold)
Figure `No; Worker code`. TypeScript in a Worker with a Durable Object is the only first-class surface. Wrangler deploys, tails and opens SSH; `npm create cloudflare@latest -- sandbox-linux` scaffolds a working sandbox; the new `cf` CLI (`cf init claude-code-agent`) scaffolds harness projects. Still **no** Cloudflare-hosted REST API (the "sandbox bridge" is a reference Worker you deploy yourself, and it is 0.x-only), no Python/Go/Java SDK, no sandbox-control MCP server, no lifecycle webhooks (Durable Object alarms are the substitute).
"D/sandbox/sdk/bridge/": "You deploy the Worker in **your** account; it is not a Cloudflare-hosted shared API."
"D/sandbox/get-started/": "npm create cloudflare@latest -- sandbox-linux --category=hello-world --type=hello-world --lang=ts --no-deploy --no-git --no-agents"

### built-in-agents — **partly** (Δ materially improved)
Figure `None in image; harnesses`. The managed base images still ship **no** coding agent (`cloudflare/debian-trixie` = Debian Trixie slim + Node 24.20.0; `node:24-trixie-slim` likewise; the docs say they "include none of" Python, Git, curl, wget, jq, unzip, ps). But Cloudflare now ships an **Agents SDK container harness** (`agents/harness/container`, experimental, 9–10 Nov) that runs Claude Code or Codex as the CLI in a Container with **no Dockerfile**: "The harness starts the `cloudflare/debian-trixie` image, installs Claude Code on first use, and snapshots the filesystem for later starts." Sessions, operations, transcripts and the CLI's session files live in the Durable Object's SQLite; credentials stay outside; `sessions.fork(id)` branches a session. Documented harnesses: Pi, Flue, OpenCode, Claude Code, Codex, Think, Nanocode, Exo, self-modifying. There is still no Hermes or OpenClaw harness and no agent in the base image.
"D/agents/harnesses/container/": "No Dockerfile is needed. The harness starts the `cloudflare/debian-trixie` image, installs Claude Code on first use, and snapshots the filesystem for later starts."
"D/sandbox/sdk/migrate/changes-in-1-0/": "`cloudflare/debian-trixie` and `node:24-trixie-slim`, which these pages use, include none of them."

### teams-accounts — **partly** (Δ concurrency 10×)
Figure `Alerts only`. Account members, roles, policies and dashboard SSO exist and are inherited; there is no per-sandbox IAM, no per-sandbox owner record, no spend cap. Concurrency is now account-wide **15,000 vCPU, 60 TiB memory, 300 TB disk** (was 1,500 / 6 TiB / 30 TB), which at 2 vCPU each is roughly 7,500 concurrent `standard-3` sandboxes. Budget alerts remain email-only.
"D/containers/platform/limits/": "| Concurrent memory | 60 TiB |" · "| Concurrent vCPU | 15,000 |" · "| Concurrent disk | 300 TB |"
"D/billing/manage/budget-alerts/": "Budget alerts are informational only. They do not pause or cap usage."

### billing-models — **partly** (unchanged)
Figure `$0.072/vCPU-hour active`. Per 10 ms while running: active CPU $0.000020/vCPU-s (= $0.072/vCPU-h), provisioned memory $0.0000025/GiB-s (= $0.009/GiB-h), provisioned disk $0.00000007/GB-s (= $0.000252/GB-h). Memory and disk bill on the **provisioned** size, CPU only on **active** use. Charges start on a request or a manual start and stop when the instance sleeps; a stopped instance bills nothing. Egress by destination region. Workers, Durable Objects, R2 and Logs bill separately.
"D/containers/platform/pricing/": "Memory and disk usage are based on the *provisioned resources* for the instance type you select, while CPU usage is based on *active usage* only."

### trials-free-tiers — **no** (unchanged)
Figure `None; $5 plan`. No free tier for Containers: the Free column is N/A for memory and CPU (the disk cell is blank — a docs gap, not an allowance), and the docs require Workers Paid. No signup credit, no trial, no card-free path. The $5/month plan includes 25 GiB-h memory, 375 vCPU-min and 200 GB-h disk, worth about $0.73 at list price; it is a plan minimum, not a credit.
"D/sandbox/": "Available on Workers Paid plan"
"D/containers/platform/pricing/": "| **Free** | N/A | N/A | |"

### company — **partly** (Δ one material fact missing)
Figure `Cloudflare, Inc.; no sandbox SLA`. Cloudflare, Inc., Delaware (July 2009), NYSE: NET since 13 Sep 2019, 5,156 full-time employees at 31 Dec 2025, ~332,000 paying customers; CEO Matthew Prince, President Michelle Zatlyn, CFO Thomas Seifert. No sandbox SLA: the Workers SLA "applies to use of Workers only" (99.99% SLO, credits 10/25/50%, claim route through Enterprise support terms). Status page has a **Containers** component and no Sandboxes component (483 components today, up from 481; Containers operational; Workers was `degraded_performance` at fetch time). The profile's incident count (58 from 6 Aug to 4 Nov) is unchanged for its stated window; extending it to 12 Nov adds eight incidents naming Workers, Containers or Durable Objects (66 total), one of them naming Containers — the 11 Nov "Cloudflare Worker Builds Issue" (its component list includes Containers). SOC 2 Type II, ISO 27001, PCI DSS L1 and HIPAA AoC are company-wide with no published product scope. Self-serve terms: 30 days' notice before fee changes, non-refundable, suspend at will, 12-month liability cap, California law. **New/overdue:** the 24 Sep 2026 cross-tenant disk-block disclosure (see isolation) belongs in the company or caveats section; the baseline (28 Oct) missed it.
"cloudflare.com/workers-service-level-agreement/": "This Workers Service Level Agreement (“Workers SLA”) applies to use of Workers only."

---

## 2. Capabilities (78)

Base for every URL below: **`D` = `https://developers.cloudflare.com`**. Quote normalisation: whitespace collapsed, Markdown emphasis/link syntax and HTML tags stripped, typographic apostrophes → `'`. `Δ` = edit the row; `—` = verdict, figure and note stand (refresh the quote only if it moved).

### Machine and money (19)

- `own-vm` **yes** · one microVM per container, own kernel and network. "Each container instance runs in a Firecracker microVM with its own kernel and network." D/containers/concepts/architecture/ · —
- `root` **yes** · every process is root, no user boundary inside. "every process has the same Linux capabilities as `root`" D/sandbox/concepts/security/ · —
- `docker-inside` **partly** · `docker:dind` works; daemon must run as root with iptables and IP forwarding off; inner containers need host networking. "Yes. Use the `docker:dind` image, and start the Docker daemon with iptables and IP forwarding turned off" D/containers/faq/ · —
- `nested-virt` **not-published** · no statement on nested VMs anywhere in Containers/Sandboxes docs. "| vCPU per instance | 4 |" (limits page; absence checked) D/containers/platform/limits/ · **Δ** old quote "Maximum vCPU" no longer exists
- `custom-image` **yes** · your Dockerfile or a digest-pinned image; named images up to 100 per config. "Each named image must set exactly one of `dockerfile` or `image`." D/workers/wrangler/configuration/ · —
- `any-size` **partly** · custom vCPU/RAM/disk from 1/16 vCPU · 256 MiB · 2 GB up to 4 vCPU · 12 GiB · 20 GB. "Custom instance types using the `durable_object` scheduling policy have the following minimums:" D/containers/platform/limits/ · **Δ** shortfall must drop "each core needs at least 3 GB"; the 3 GiB/vCPU rule is no longer on the page (changelog still asserts it — §4)
- `big-machines` **no** · ceiling 4 vCPU / 12 GiB, so no 16-core or 32 GB machine. "| Memory per instance | 12 GiB |" D/containers/platform/limits/ · **Δ** quote (old "Maximum vCPU" row is gone)
- `live-resize` **no** · size is fixed when the instance **starts**, not at deploy. "If you omit `instance`, the Container uses `lite`." D/containers/api/durable-object-container/ · **Δ** note wording ("set at deploy time" → "chosen at start")
- `gpu` **no** · no GPU type, price or region in Containers/Sandboxes docs. "| vCPU per instance | 4 |" D/containers/platform/limits/ · **Δ** quote
- `choose-region` **no** · placement near the request; no sandbox-level pinning. "By default, containers run in the location nearest to the incoming request with a pre-fetched image." D/containers/concepts/placement/ · —
- `eu-region` **partly** · EU regions exist (`EEUR`, `WEUR`, `jurisdiction: eu`) but `durable_object` rejects placement constraints, so a sandbox cannot be required to stay. "Wrangler rejects every other Container application field for this policy, including `image`, `instance_type`, `max_instances`, rollout settings, and placement constraints." D/workers/wrangler/configuration/ · —
- `pause-memory` **no** · no paused state; stop ends processes and disk. "An instance runs only until something stops it, and its processes and the files on its disk end with it." D/sandbox/concepts/lifetime/ · —
- `warm-pool` **partly** · no pool you size or manage, but the platform keeps prepared VMs and restores one on start, so the first command does not wait for a boot. "Instead of booting a new virtual machine from scratch, the new runtime restores a prepared virtual machine that isn't yet assigned." blog.cloudflare.com/faster-agent-sandboxes/ · **Δ verdict** (was `no`) + shortfall: "You cannot size, warm or drain the pool; Cloudflare restores an unassigned prepared VM, so a start is fast but not instant."
- `fast-start` **partly** · median 648 ms, p95 910 ms, p99 1,129 ms (ComputeSDK burst TTI, cited by Cloudflare); Containers FAQ still says cold starts are often 1–3 s. "median startup fell from just over four seconds to 648 milliseconds" blog.cloudflare.com/faster-agent-sandboxes/ · **Δ verdict** (was `not-published`, "No start or resume time is published") + figure; proposed shortfall: "The median is under a second in Cloudflare's cited benchmark, but the Containers FAQ still says cold starts are often 1-3 seconds, so a first start can be slower."
- `snapshot-files` **partly** · writable root filesystem only, 20 GB max, 30-day expiry, public beta, tied to image. "`snapshotContainer()` saves the writable root filesystem of a running instance." D/sandbox/concepts/lifetime/ · —
- `snapshot-memory` **no** · memory and processes are not saved. "It does not save separately mounted filesystems, memory, or processes." D/sandbox/concepts/lifetime/ · —
- `fork-running` **no** · no copy of a running machine; a snapshot starts a new instance that re-runs its entrypoint. "The processes that were running do not continue." D/sandbox/concepts/lifetime/ · —
- `older-snapshot` **partly** · snapshots are named and immutable, so older ones can be restored, but there is no list API and each expires 30 days after creation or last restore. "The Worker API has no method to list snapshots. Store the returned `id`, for example in Durable Object storage." D/containers/api/durable-object-container/ · —
- `templates` **partly** · any image can start many sandboxes; a snapshot is now explicitly a reusable checkpoint ("multiple Containers can start independently of the same prepared environment"), but it is beta, files-only and expires in 30 days. "Since snapshots are immutable and reusable, multiple Containers can start independently of the same prepared environment" blog.cloudflare.com/faster-agent-sandboxes/ · **Δ note** (old note said the docs describe restore into "the next instance", not many)
- `backups` **partly** · `DirectoryBackup` to your own R2 has no expiry, but it is a directory you schedule, not an automatic whole-machine backup; the "save automatically" pattern snapshots on stop and still expires in 30 days. "R2 keeps each backup until you delete it." D/sandbox/files/back-up-a-directory-to-r2/ · —

### State and staying on (18)

- `files-survive-stop` **no** · disk dies with the instance; only snapshot/backup/mount survives. "Stopping the instance deletes the files on its disk." D/sandbox/files/ · —
- `volumes` **partly** · no separate disk; 20 GB root only; an R2/S3 prefix can be mounted, a snapshot lasts 30 days. "A snapshot does not include mounted directories, and a mount ends with its instance" D/sandbox/concepts/lifetime/ · —
- `shared-volume` **partly** · the shared option is an object-store prefix over `s3fs`, not a block disk: no locks, ownership, atomic replace or hard links. "File locks, hard links, ownership, permissions, and atomic replacement do not work as they do on a local filesystem." D/sandbox/reference/s3-mounts/ · —
- `mount-buckets` **yes** · mount one R2/S3 prefix as a directory; works with internet off; any process can read/write/delete under the prefix. "The `S3Mount` class from `@cloudflare/sandbox` mounts one prefix of a bucket as a directory with `s3fs`." D/sandbox/files/mount-an-r2-bucket/ · —
- `big-disk` **no** · 20 GB maximum. "| Disk per instance | 20 GB |" D/containers/platform/limits/ · **Δ** quote
- `stay-on` **partly** · no fixed runtime cap, but the instance stops when the DO goes inactive plus at most a 6-hour inactivity timeout; timeout is lost on DO restart; no uptime guarantee. "After the Durable Object becomes inactive, the instance keeps running for the time set with [`setInactivityTimeout()`], up to 6 hours." D/sandbox/concepts/lifetime/ · —
- `choose-idle` **partly** · 0 < timeout ≤ 6 h, per DO, re-set after every restart; no "never". "The restarted Durable Object starts without an inactivity timeout" D/sandbox/concepts/lifetime/ · —
- `wake-on-request` **partly** · a request wakes the DO, which starts a **new** instance from image or snapshot; not the stopped one. "Cloudflare does not wake the Durable Object when its instance stops." D/sandbox/concepts/lifetime/ · —
- `schedules` **yes** · Workers Cron Trigger starts a container task on a schedule; DO alarms also work. "Run a short container task every two minutes with a Workers [Cron Trigger]." D/containers/examples/cron/ · —
- `public-url` **partly** · no per-machine URL; previews are Worker routes (path or per-preview hostname), HTTP only. "The server has no public port, so your Worker forwards requests to it." D/sandbox/previews/ · —
- `private-url` **partly** · reachability is your Worker's auth; no built-in token, signed URL or IP allowlist. "When your Worker forwards a page from a sandbox, the page runs under the hostname that served it." D/sandbox/concepts/security/ · —
- `ssh` **partly** · only `wrangler containers ssh`, authenticated to your Cloudflare account; no public port, no sshd endpoint, no keys. "SSH does not expose a publicly accessible port on the Container." D/containers/guides/ssh/ · —
- `web-terminal` **partly** · documented xterm.js + WebSocket + tmux pattern you host; no terminal in the Cloudflare dashboard. "Expose a live shell in a Linux sandbox on a web page." D/sandbox/commands/open-a-terminal-in-the-browser/ · —
- `tunnel` **no** · no port-forward to your computer; the only documented local path is `wrangler containers ssh`. "Because all Container requests are passed through a Worker, end-users cannot make non-HTTP TCP or UDP requests to a Container instance." D/containers/concepts/architecture/ · —
- `raw-tcp` **no** · HTTP/HTTPS only through the Worker; no raw TCP or UDP ingress. Same quote, D/containers/concepts/architecture/ · —
- `custom-domain` **partly** · wildcard DNS + Worker route; you own routing and TLS config. "A wildcard DNS record and the route `*.example-previews.com/*` send every preview hostname to your Worker." D/sandbox/previews/serve-previews-on-their-own-hostnames/ · —
- `auto-https` **yes** · Cloudflare's zone certificate covers the wildcard hostnames and renews itself; no per-sandbox certificate work. Same wildcard-DNS quote (inferred for renewal), D/sandbox/previews/serve-previews-on-their-own-hostnames/ · —
- `egress-included` **yes** · 1 TB/month in North America & Europe, 500 GB in the other two bands. "| North America & Europe | $0.025 | 1 TB |" D/containers/platform/pricing/ · —

### Access (15)

- `egress-allowlist` **yes** · per-host HTTP/HTTPS intercepts (globs, IPs, CIDR), 128 entries; everything else denied with internet off. "To allow only specific hosts, start the container with `enableInternet: false`. Then intercept each allowed host with an entrypoint that forwards the request:" D/containers/configuration/outbound-traffic/ · **Δ** quote/mechanism (`allowedHosts` → intercepts); note should mention the 128-entry cap
- `no-internet` **yes** · off unless started with `enableInternet: true`; with it off, non-intercepted DNS times out and non-HTTP traffic is denied. "A Container starts with `enableInternet: false` by default, so it cannot reach the Internet." D/sandbox/concepts/security/ · — (the API reference still calls the field *required*, §4)
- `static-ip` **not-published** · no fixed outbound address, NAT gateway or egress-IP option in Containers/Sandboxes docs. "Egress from Containers is priced at the following rates:" (no IP line) D/containers/platform/pricing/ · —
- `secrets-store` **partly** · no secret store in the sandbox; values come from Worker bindings/secrets and are injected per request or mounted with placeholder credentials. "Once a value is in the sandbox, all the code there can read it and send it anywhere the sandbox can reach." D/sandbox/concepts/security/ · —
- `hidden-secrets` **yes** · outbound handler adds the credential after the request leaves; `ContainerEgress` does the same for model keys. "A Container can send its request without the credential, and an outbound handler in your Worker adds the credential after the request leaves the sandbox." D/sandbox/concepts/security/ · —
- `scoped-keys` **yes** · Cloudflare API tokens can be limited by permission and resource; account roles/policies scope members. "Below is a list of the available token permissions." D/fundamentals/api/reference/permissions/ · —
- `dashboard-create` **no** · no sandbox console; a sandbox is a name in Worker code and the dashboard manages Workers/containers. "Your Worker reaches each sandbox by name." D/sandbox/manage/ · —
- `cli` **partly** · Wrangler deploys, tails, lists instances and opens SSH; `cf` scaffolds harness projects; neither creates or drives a sandbox's lifecycle — that is Worker code. "The only way to connect is through Wrangler with [`wrangler containers ssh`]" D/containers/guides/ssh/ · —
- `python-sdk` **no** · only the TypeScript/npm package; Python talks to your Worker over HTTP. "npm i @cloudflare/sandbox" (no Python package in the docs index) D/sandbox/reference/ · —
- `ts-sdk` **yes** · `@cloudflare/sandbox` 1.0.3 on npm (Apache-2.0), plus the raw `ctx.container` API. "`@cloudflare/sandbox` works with a container you start from a Durable Object." D/sandbox/reference/ · —
- `rest-api` **no** · no Cloudflare-hosted sandbox API; the 0.x bridge is a reference Worker you deploy. "You deploy the Worker in **your** account; it is not a Cloudflare-hosted shared API." D/sandbox/sdk/bridge/ · —
- `mcp-server` **no** · no MCP server that creates/drives sandboxes; Code Mode's MCP page *consumes* MCP tools inside an agent. "Expose tools from an Agents SDK MCP connection inside Code Mode." D/agents/tools/codemode/mcp/ · **Δ** note/source (old "Code Mode MCP Server" line is gone from the terminal page)
- `pty` **yes** · `exec()` takes `pty: true` or `{cols, rows}`, `stdin: "pipe"`, and returns an `ExecProcess` with `isPty` and `resize()` — an interactive terminal over the API. "Runs the process attached to a pseudo-terminal. `true` uses 80 columns and 24 rows." D/containers/api/durable-object-container/ · **Δ verdict** (was `partly`, "no call that opens a terminal session for a script")
- `file-api` **yes** · `Files` class moves files in/out and does common filesystem operations; `DirectoryBackup` and `S3Mount` cover bulk and shared files. "The `Files` class from `@cloudflare/sandbox` moves files between your Worker and a running sandbox, and provides common file system operations." D/sandbox/files/ · —
- `agents-preinstalled` **partly** · base images ship no agent, but the new `ContainerHarness` installs Claude Code or Codex on first use with no Dockerfile, and keeps their sessions in DO SQLite. "The harness starts the `cloudflare/debian-trixie` image, installs Claude Code on first use, and snapshots the filesystem for later starts." D/agents/harnesses/container/ · **Δ verdict** (was `no`); proposed shortfall: "The CLI is not in the base image; the harness installs it on first use, which needs network access and adds time to the first prompt."

### Running and company (26)

- `prompt-api` **no** · no prompt endpoint on the sandbox; the harness has `prompt()`/`submit()`/`wait()` but it is an Agents SDK class in your Worker, not a hosted API. "`prompt()` submits work and waits for the answer." D/agents/harnesses/container/ · **Δ** note (mention the harness methods)
- `one-click-hermes` **no** · no Hermes template or harness; install it in your own Dockerfile. "Coding agents such as Claude Code, Codex, and OpenCode can run a task on their own" (list has no Hermes) D/sandbox/coding-agents/ · —
- `one-click-openclaw` **no** · no OpenClaw template or harness; guides cover Claude Code, Codex, OpenCode, Pi. Same quote, D/sandbox/coding-agents/ · —
- `browser` **no** · no browser in the base images or a documented browser tool inside the sandbox; install Chromium/Playwright yourself. "`cloudflare/debian-trixie` and `node:24-trixie-slim`, which these pages use, include none of them." D/sandbox/sdk/migrate/changes-in-1-0/ · —
- `desktop` **no** · no VNC/desktop/computer-use surface documented. "A sandbox is an isolated place to run code." D/sandbox/ · —
- `hosts-other-agents` **yes** · vendor-loop templates for Devin, Cursor, Claude Managed Agents and the OpenAI Agents API, each session its own sandbox; plus harnesses for Claude Code and Codex. "Devin, Cursor, Claude Managed Agents, and the OpenAI Agents API run their agent loop in their own service." D/sandbox/coding-agents/ · —
- `team-workspace` **partly** · account members and scoped policies are the only sharing model; no per-sandbox owner, workspace or sharing UI. "On any Cloudflare account, you can collaborate by adding members to your account and assigning them access via one or several policies." D/fundamentals/manage-members/ · —
- `roles` **yes** · account roles + resource-scoped policies govern who can deploy/read the Worker and its containers; no sandbox-level role. Same page, D/fundamentals/manage-members/ · —
- `sso` **yes** · dashboard SSO free on all plans; not sandbox-specific. "Cloudflare Dashboard SSO is available for free to all plans." D/fundamentals/manage-members/dashboard-sso/ · —
- `spend-cap` **no** · budget alerts email only; no hard stop. "Budget alerts are informational only. They do not pause or cap usage." D/billing/manage/budget-alerts/ · —
- `usage-alerts` **yes** · account budget alerts at user-set USD thresholds. "Budget alerts notify you by email when your account-wide usage-based spend crosses a dollar threshold you define." D/billing/manage/budget-alerts/ · —
- `audit-log` **yes** · account audit log v2 records user- and system-initiated control-plane actions; not commands inside a sandbox. "All user-initiated actions are recorded automatically across both the Cloudflare API and dashboard." D/fundamentals/account/account-security/audit-logs/ · —
- `per-second` **yes** · 10 ms billing. "Containers are billed for every 10ms that they are actively running" D/containers/platform/pricing/ · —
- `active-cpu` **yes** · CPU only while active; memory and disk always on the provisioned size. "CPU usage is based on *active usage* only" D/containers/platform/pricing/ · —
- `cheap-pause` **yes** · stopped instance bills nothing (and keeps nothing). "After the instance stops, it is not billed." D/sandbox/concepts/lifetime/ · —
- `no-monthly-fee` **no** · $5/month Workers Paid minimum before anything runs. "Available on Workers Paid plan" D/sandbox/ · —
- `flat-price` **no** · usage-based: active vCPU-s + provisioned GiB-h + GB-h + egress. "Containers are billed for every 10ms that they are actively running" D/containers/platform/pricing/ · —
- `free-tier` **no** · Free column N/A for memory and CPU. "| **Free** | N/A | N/A | |" D/containers/platform/pricing/ · —
- `free-credit` **no** · no signup credit; the included monthly usage is part of the $5 plan. "25 GiB-hours/month included" D/containers/platform/pricing/ · —
- `no-card` **no** · Workers Paid requires a payment method before a sandbox can run (inferred from the plan requirement; no card-free path documented). "Available on Workers Paid plan" D/sandbox/ · —
- `status-page` **yes** · `cloudflarestatus.com` has a Containers component (operational today) and no Sandboxes component; 483 components total. "Containers" cloudflarestatus.com/api/v2/components.json · —
- `sla` **no** · 99.99% Workers SLO, Workers only; no Containers/Sandboxes SLA. "applies to use of Workers only." cloudflare.com/workers-service-level-agreement/ · —
- `soc2` **yes** · SOC 2 Type II report, company-wide, download from dashboard; product scope unpublished. "SOC 2 Type II report covers security, confidentiality, and availability controls" cloudflare.com/trust-hub/compliance-resources/soc-2/ · —
- `dpa` **yes** · standard customer DPA with EU SCCs; delete-or-return on termination, no deadline. "delete or return all Personal Data (including copies thereof) processed pursuant to this DPA" cloudflare.com/cloudflare-customer-dpa/ · —
- `open-source` **partly** · SDK is Apache-2.0 on npm and the `cloudflare/sandbox-sdk` repo is public (pushed 10 Nov), but the platform is proprietary and not self-hostable. "npm i @cloudflare/sandbox" + npm `"license": "Apache-2.0"` D/sandbox/reference/ · —

---

## 3. Rate-card inputs

### 3.1 Plans and unit rates — **no change**

All four meters, all three included allowances and the egress table are identical to the 30 October card. Original units as published:

| Input | Original unit | Per hour (for the card) | Included / month |
|---|---|---|---|
| CPU | `$0.000020` per **vCPU-second**, active only | `$0.072` per vCPU-hour | `375 vCPU-minutes` = 6.25 vCPU-h |
| Memory | `$0.0000025` per **GiB-second**, provisioned | `$0.009` per GiB-hour | `25 GiB-hours` |
| Disk | `$0.00000007` per **GB-second**, provisioned | `$0.000252` per GB-hour | `200 GB-hours` |
| Plan | `$5 USD per month` minimum charge per account (Workers Paid) | — | the three allowances above |
| Egress NA & Europe | `$0.025` per GB | — | `1 TB` |
| Egress Oceania, Korea, Taiwan | `$0.05` per GB | — | `500 GB` |
| Egress everywhere else | `$0.04` per GB | — | `500 GB` |

Billing granularity `10 ms`. Free plan: `N/A` for memory and CPU; the disk cell is **blank** (unchanged, still ambiguous, still not a free tier — "Available on Workers Paid plan"). No sandbox-specific plan, no committed-use or Enterprise rate published, no snapshot-storage line item, no image-storage line item. The included usage is worth `6.25 × 0.072 + 25 × 0.009 + 200 × 0.000252 = $0.45 + $0.225 + $0.0504 = $0.7254` at list, unchanged.

Adjacent rates the profile cites, all unchanged: Workers Paid `$5` minimum; Workers requests 10 M included then `$0.30/M`; Durable Objects 1 M requests then `$0.15/M`, 400,000 GB-s then `$12.50/M GB-s` on a 128 MB allocation; R2 Standard `$0.015/GB-month` with `10 GB-month` free; Workers Logs 20 M events then `$0.60/M`; Dynamic Workers 1,000 unique/month then `$0.002 per Dynamic Worker per day` (plus Workers request/CPU rates).

### 3.2 Inputs that are not rates but feed the cost model — **changed**

| Input | 30 Oct card | Today | Effect |
|---|---|---|---|
| Custom instance **floor** | 1 vCPU, 3 GiB per vCPU, disk ≤ 2 GB per GiB RAM | 1/16 vCPU (`0.0625`), 256 MiB, 2 GB; disk up to 20 GB independent of RAM | smaller/cheaper shapes become expressible |
| Per-instance **ceiling** | 4 vCPU / 12 GiB / 20 GB | 4 / 12 / 20 (unchanged) | — |
| **Memory-to-vCPU** minimum | 3 GiB per vCPU | not stated on the limits page; a 29 Sep changelog still says it | 2 vCPU/4 GiB and 4 vCPU/8 GiB are documented-permissible but not proven |
| **Disk-to-memory** ratio | 2 GB per GiB | removed 29 Sep | a 4 GiB sandbox can now have 20 GB disk |
| **Account concurrency** | 1,500 vCPU · 6 TiB · 30 TB | 15,000 vCPU · 60 TiB · 300 TB | 10× more sandboxes per account |
| **Runtime instance names** | six presets | `lite`, `standard-1`…`standard-4`; `basic` rejected | five presets |
| **Outbound request body** | not published | 100 MiB per request (raisable on review) | new ceiling |
| **Outbound intercepts** | `allowedHosts` list, 80/443 only | 128 entries, HTTP/HTTPS, hostname/glob/IP/CIDR; each mount adds one (entry cost unpublished) | new ceiling and mechanism |
| Snapshot size / retention | 20 GB / 30 days | 20 GB / 30 days | — |
| Inactivity timeout ceiling | 6 h | 6 h | — |
| Image storage per account | 50 GB | 50 GB | — |

The floor change has **no changelog entry**: the Containers product changelog's newest item is 30 September, and nothing there mentions 1/16 vCPU, 256 MiB or a 2 GB disk minimum. Treat "floor dropped" as a documentation change whose product effect is unverified; the old page may have been describing the `default` policy while the new page describes `durable_object`.

### 3.3 What that does to the A/B/C shapes (inputs only; totals not recomputed)

- **A (2 vCPU / 4 GiB / 10 GiB)** — the 4 GiB *brief* was not buyable while 2 vCPU required 6 GiB. But `2 vCPU / 6 GiB / 10 GB` was: 6 GiB satisfies the ratio, and 10 GB is under the old 2 GB-per-GiB disk cap. It is cheaper than `standard-3` (8 GiB / 16 GB). So A's substitution was never forced to be a preset; it was forced to be at least 6 GiB. Today the limits page permits `2 / 4 / 10` outright.
- **B (4 vCPU / 8 GiB / 50 GiB)** — under the ratio, 4 vCPU needs 12 GiB, so `4 / 12 / 20` (= `standard-4`) is the certain shape; the 50 GiB disk is impossible at any shape (max 20 GB), so 30 GB still lives outside. If the ratio is gone, `4 / 8 / 20` is legal and cheaper.
- **C (2 vCPU / 4 GiB / 20 GiB)** — `2 / 6 / 20` is **certainly legal today under both readings**: 6 GiB satisfies the 3 GiB-per-vCPU rule, and the 29 Sep changelog removed the disk-to-memory ratio, so 20 GB no longer needs 12 GiB of RAM or `standard-4`. `2 / 4 / 20` is legal only if the ratio is gone. The card's `standard-3` (2/8/16) is therefore the wrong shape for this brief: 2 GiB of RAM the brief does not need, 4 GB of disk it does, and a higher memory-plus-disk price than `2/6/20`. (The card's note that 20 GiB "would need standard-4" is stale — 20 GB has been available on any custom shape since 29 Sep.)
- The Nov 12 limits page's own minimums (1/16 vCPU, 256 MiB) are a 4 GiB-per-vCPU ratio, so they cannot be read as a 3 GiB minimum; the Sep 29 changelog's own example (`1 vCPU / 3 GiB / 20 GB`) satisfies a 3 GiB rule and settles nothing.
- **Recommendation:** do not change A/B/C totals in this recheck, but do not repeat "the brief is not buyable" either. If the parent reworks shapes, use the certain-under-both-readings shapes: A `2 / 6 / 10`, B `4 / 12 / 20`, C `2 / 6 / 20`. Those need no resolution of the contradiction. The cheaper `2/4`, `4/8`, `2/4/20` shapes rest on the limits page and should be labelled "documented, ratio rule contested" until Cloudflare says which page is right.

---

## 4. Contradictions between first-party pages

**1. Is there a 3 GiB-of-memory-per-vCPU minimum? (new, material)**
- Limits page, `dateModified` 2026-11-12: "Custom instance types using the `durable_object` scheduling policy have the following minimums:" → vCPU `1/16 (0.0625)`, Memory `256 MiB`, Disk `2 GB (2000 MB)`. No ratio row; the old "Memory to vCPU ratio | Minimum 3 GiB memory per vCPU" row is gone. `D/containers/platform/limits/`
- Changelog, 29 Sep 2026: "The other custom instance type constraints do not change, including the minimum of 3 GiB of memory per vCPU." `D/changelog/post/2026-09-29-remove-disk-to-memory-ratio/`
- **Model choice:** price the standard shapes (the conservative reading), and state in the notes that a 2 vCPU/4 GiB custom shape is documented-permissible on the current limits page but contradicted by the changelog. Do **not** claim "2 vCPU needs at least 6 GiB" as a flat fact; say "Cloudflare's September changelog still says so."

**2. Instance maximums: defaults or hard limits?**
- "All instance size maximums and account limits on this page are defaults and can be increased. To request higher limits, contact your account team or [Cloudflare Support]." `D/containers/platform/limits/`
- Same page's table: "| vCPU per instance | 4 |" · "| Memory per instance | 12 GiB |" · "| Disk per instance | 20 GB |"
- **Resolution:** the page now names the route (account team/Support) and says maximums are defaults, so treat 4/12/20 as the *default* ceiling that can be raised on request; no published SLA or price for a raised limit. This supersedes the old "whether support can lift them is not published" caveat.

**3. Is outbound internet on or off by default?**
- Security guide: "A Container starts with `enableInternet: false` by default, so it cannot reach the Internet." `D/sandbox/concepts/security/`
- API reference: "`enableInternet` ( `boolean`, required): Whether to allow outbound Internet access. Required when you pass `options`." `D/containers/api/durable-object-container/`
- Outbound guide: "By default, a container started with `enableInternet: true` can reach any host." `D/containers/configuration/outbound-traffic/` — this is conditional, not a statement about the default, so the old third leg of this contradiction ("By default, a Container will allow internet access") no longer exists.
- **Model choice:** the sandbox docs say off; the API says you must pass it. Both mean "decide per start", so treat egress as explicit and never assume a default. Two pages, not three, now conflict.

**4. Six presets, but `basic` cannot be started.**
- Limits/pricing tables list six instance types including `basic` (1/4 vCPU, 1 GiB, 4 GB). `D/containers/platform/limits/`
- Scheduling policy: "The runtime does not accept `basic` or the legacy `dev` and `standard` aliases." `D/containers/configuration/scheduling-policy/`
- **Resolution:** a sandbox can start `lite`, `standard-1`…`standard-4` (five). `basic` exists only for the deprecated `default` policy / legacy configs. The profile's "Six presets" should become "Five startable presets (a sixth, `basic`, exists only in the legacy policy)".

**5. Start time: milliseconds, 1–3 seconds, or 648 ms?**
- Product page: "Sandboxes start in milliseconds, not minutes." `cloudflare.com/products/sandboxes/`
- Containers FAQ: "Container cold starts can often be in the 1-3 second range, but this is dependent on image size and code execution time, among other factors." `D/containers/faq/`
- Blog, 30 Sep: "median startup fell from just over four seconds to 648 milliseconds"; p95 910 ms, p99 1,129 ms. `blog.cloudflare.com/faster-agent-sandboxes/`
- **Resolution:** 648 ms is the median *time to interactive* under the `durable_object` policy (ComputeSDK benchmark, 100 concurrent); the FAQ's 1–3 s is the older/general cold-start range; the product page's "milliseconds" is a rounded claim about the same median. All three can be true; a buyer should expect sub-second typically and about 1.1 s at p99.

**6. "Start building for free" but no free sandbox.**
- Product page CTA: "Start building for free" `cloudflare.com/products/sandboxes/`
- Sandboxes docs: "Available on Workers Paid plan" `D/sandbox/`; rate card Free column: memory `N/A`, CPU `N/A`, disk blank `D/containers/platform/pricing/`.
- **Resolution:** free signup, paid runtime. Unchanged from the baseline.

**7. Idle stop: 10 minutes or none?**
- 0.x: "After a period of inactivity (10 minutes by default, configurable via `sleepAfter`), the container stops to free resources." `D/sandbox/sdk/concepts/sandboxes/`
- 1.0: "Without a timeout, Cloudflare stops the instance shortly after the Durable Object becomes inactive." `D/sandbox/concepts/lifetime/`
- Harness layer (new): "After five minutes, the harness snapshots the filesystem and stops it." `D/agents/harnesses/container/`
- **Resolution:** three products, three defaults. The 10-minute figure belongs to the deprecated SDK, not Sandboxes 1.0; the 5-minute figure is the Agents SDK harness, not the sandbox.

**8. Isolation: "no other workload shares it" vs recoverable residual blocks.**
- Sandboxes overview: "Each instance is a microVM with its own kernel and network, so no other workload shares it." `D/sandbox/`
- Cloudflare blog, 24 Sep: "a customer with a Workers Paid account could recover residual disk blocks previously used by Containers on the same host." `blog.cloudflare.com/containers-cross-tenant-vulnerability/`
- **Resolution:** the VM/kernel/network boundary was never crossed; the *storage pool* was shared and dm-thin reused 64 KiB blocks without zeroing them. Fixed 4–7 Sep, pools and pre-mitigation snapshots cleared by 19 Sep. Keep the isolation verdict, add the caveat, and don't claim "nothing is shared" — the host and the physical storage pool are shared by design.

**9. `basic` / 3 GiB / 1 vCPU: the changelog and the limits page disagree about which constraints are current.** Covered in 1 and 4; the general lesson is that the Sep 29 changelog is stale relative to the Nov 12 limits page for constraints, while the limits page is stale relative to nothing for prices.

---

## 5. Important new products the 16 features and 78 capabilities miss

### 5.1 Agents SDK container harness — the biggest gap (`agents/harness/container`, 9–10 Nov, experimental)

A first-class layer **above** Sandbox that runs a coding-agent CLI in a Container, driven by a Durable Object, with no Dockerfile. The site's `docs.json` has no entry for it and it is in no feature row, yet it changes the answer to "built-in agents", "idle timers", "snapshots", "keys and secrets" and "ways to drive it" for anyone whose job is "run Claude Code/Codex".

- "Run Claude Code on Cloudflare, with its plugins, mods, and settings, the way it runs on your laptop." `D/agents/harnesses/claude-code/`
- "The CLI owns the loop." · "The Durable Object owns the record." · "The harness stores sessions, operations, transcripts, and the CLI's session files in the object's SQLite database." `D/agents/harnesses/container/`
- "No Dockerfile is needed. The harness starts the `cloudflare/debian-trixie` image, installs Claude Code on first use, and snapshots the filesystem for later starts." Same page.
- "Credentials stay outside the container. The CLI calls a placeholder host with a placeholder key. `ContainerEgress`, a Worker entrypoint in your Worker, adds the real credentials to each model request after it leaves the container." Same page.
- Recovery: "**The Durable Object is evicted or redeployed.** A Lifecycle job reattaches to the running container and replays the events it missed." · "**The container goes idle.** After five minutes, the harness snapshots the filesystem and stops it. The next prompt restores the snapshot and resumes the CLI's session." · "**The container dies during a turn.** The turn ends with `status: "unanswered"` and `reason: "container_lost"`, and the session survives. Pass `onContainerLost: "retry"` to run the turn again instead, when its side effects are safe to repeat." Same page.
- Caveat: "Files in the container come back from the last snapshot, so edits made after it can be lost. Keep files that must survive in separate durable storage." Same page.
- API: `prompt()`, `submit()`, `wait({operationId})`, `sessions.create()`, `sessions.fork(id)`, `session.events()`, `allowedTools`/`disallowedTools`.
- Cost: the container is a normal Container instance (same meters); the harness itself is Workers/DO code. No separate price line is published.
- Status: experimental — "`agents/harness/container` is experimental. Its API may change in any release."

**What it changes for the site.** `built-in-agents` is no longer just "guides"; `agents-preinstalled` is no longer a flat `no`; `idle-timers` has a second, buyer-facing default (5 min at the harness layer); `snapshots-forks`/`lifecycle` can mention that the harness restores the *agent session* even though the sandbox cannot pause. It does **not** make Hermes or OpenClaw one-click.

### 5.2 The harness family (`D/agents/harnesses/`)

Nine documented harnesses (plus a "coding agent CLIs without a harness" row) with a comparison table of where they run and how they recover: **Pi** and **Flue** (Durable Objects, automatic resume, Cloudflare Computer supported), **OpenCode** (DO, resumes interrupted work), **Claude Code** and **Codex** (experimental; Linux container driven by a DO; reattach after object restart, container loss fails/retries the turn), **Think** (DO; continues from saved output), **Nanocode** (pre-1.0; Wasm in its own DO host), **Exo** (pre-1.0; Wasm in DOs + Linux sandbox), **self-modifying** (DO + Dynamic Workers). This is a new product category: "run an agent loop on Cloudflare", distinct from "run code in a sandbox". The site's 16 features have no row for it; `built-in-agents` is the nearest, and it is now under-described.

### 5.3 Cloudflare Computer — `Workspace` (`@cloudflare/computer`, 6 Nov)

"A `Workspace` lives inside a Durable Object and keeps every file in the SQLite storage of that object. Files remain after the Durable Object is evicted or restarted, with no external storage to configure." Includes `read`/`write`/`edit`/`grep` tools, a JavaScript runtime, and "an experimental container-based runtime for running shell commands". Install `npm i @cloudflare/computer zod`. `D/agents/tools/filesystem/`
This is the persistence answer that Sandbox lacks (files survive eviction, no snapshot expiry), at the cost of SQLite-sized storage and no general Linux. It is not a Sandbox feature and is not priced separately in the docs; it consumes Durable Object storage. It belongs in the "storage" and "lifecycle" comparisons as a sibling product, and in the new-products list.

### 5.4 `cf` CLI and the `sandbox-linux` scaffold

- `cf init claude-code-agent` / `cf init codex-agent` scaffold a harness project with `cloudflare.config.ts`, a SQLite Durable Object, a Container on the `durable_object` policy, `ContainerEgress`, and the API-key secret. `D/agents/harnesses/claude-code/`
- `npm create cloudflare@latest -- sandbox-linux --category=hello-world --type=hello-world --lang=ts` scaffolds the plain Sandbox Worker. `D/sandbox/get-started/`
Neither manages a running sandbox; both reduce "first sandbox" to one command. `cli` and `ways-to-drive` should mention them; neither becomes `yes`.

### 5.5 Outbound intercepts — a new capability surface, not just new words

The 9 Nov rewrite replaces `allowedHosts`/outbound handlers with `ctx.container.interceptOutboundHttp()`, `interceptOutboundHttps()`, `interceptAllOutboundHttp()`, and `WorkerEntrypoint` handlers from `ctx.exports`:

- targets: hostname, `*.glob`, IP, `IP:port`, CIDR; HTTP and HTTPS are separate registrations;
- **128 entries per container**, shared by all three methods; a hostname on both HTTP and HTTPS costs four; "up to 64 hostname targets, or up to 128 IP address and CIDR targets";
- intercepts last until the container stops, cannot be removed while it runs (replace the handler instead), and a `mount()` adds one;
- HTTPS interception terminates TLS with an ephemeral CA at `/etc/cloudflare/certs/cloudflare-containers-ca.crt`; the image must trust it (register before `start()`, copy into the trust store in the entrypoint);
- with `enableInternet: false`, **DNS itself** is intercepted: only covered hostnames resolve (placeholder address), everything else times out; non-HTTP traffic never reaches a handler;
- `ctx.exports` needs compatibility date `2025-11-17` or the `enable_ctx_exports` flag.

This is a materially better allowlist than the old one (IP/CIDR, globs, per-host policy, credential injection, runtime policy changes) and a materially tighter ceiling (128 entries, no removal, TLS CA plumbing). `outbound-network` and `egress-allowlist` should say so.

### 5.6 Smaller new facts

- **Container labels**: `start({labels})` accepts up to 10 labels (name 1–16 bytes, value ≤64 bytes); `inspect()` returns image + labels; useful for billing/attribution and for finding a sandbox in the dashboard. `D/containers/api/durable-object-container/`
- **`basic` retired at runtime** and the **`default` scheduling policy deprecated** ("The `default` scheduling policy is deprecated. This includes applications that omit `scheduling_policy`"). Direction of travel: every sandbox is a `durable_object` Container.
- **Outbound request-body cap** 100 MiB, raisable on review; applies per request, not per file.
- **Sandbox SDK 0.12.14** (22 Oct) rebuilds trust stores after the eMudhra intermediate-CA compromise; 0.x images before 0.12.14 trust forgeable CAs. 1.x needs a rebuilt image, not a new SDK. `D/changelog/post/2026-10-22-emudhra-certificates/`
- **100,000 containers in 5.387 s** across six locations in Cloudflare's preliminary burst test; "hundreds of thousands" claimed. Useful for the scale/teams row, not a customer guarantee.
- **Status page**: 483 components today (was 481); still a `Containers` component and **no** `Sandboxes` component; `Workers` showed `degraded_performance` in the same fetch (its component row was last updated 11 Nov 13:09 UTC, so this may be a stale state rather than a new incident).

---

## 6. Site quotes that no longer match, and replacements

| Row | Old quote | Status | Replacement |
|---|---|---|---|
| `any-size` shortfall | "Minimum 3 GiB memory per vCPU" | **gone** from limits page | "Custom instance types using the `durable_object` scheduling policy have the following minimums:" — plus shortfall: "You can set your own cores and memory, but only up to 4 cores and 12 GB per machine by default." |
| `big-machines` | "Maximum vCPU" | row renamed | "| vCPU per instance | 4 |" |
| `big-disk` | "Maximum Disk | 20 GB" | row renamed | "| Disk per instance | 20 GB |" |
| `nested-virt` | "Maximum vCPU" | row renamed | "| vCPU per instance | 4 |" (absence still the evidence) |
| `live-resize` | "Maximum vCPU" | row renamed | "If you omit `instance`, the Container uses `lite`." (size chosen per start; no resize call) |
| `gpu` | "Maximum vCPU" | row renamed | "| vCPU per instance | 4 |" |
| `sizes-regions` feature | "Maximum vCPU | 4" | row renamed | "| Memory per instance | 12 GiB |" |
| `egress-allowlist` | "Use enableInternet = false to block public internet access by default" | sentence rewritten | "To allow only specific hosts, start the container with `enableInternet: false`. Then intercept each allowed host with an entrypoint that forwards the request:" |
| `mcp-server` | "Code Mode MCP Server" | phrase gone from terminal page | "Expose tools from an Agents SDK MCP connection inside Code Mode." — note: no sandbox-control MCP server is documented |
| `built-in-agents` feature | "Run Claude Code in a Linux sandbox to edit a GitHub repository from a prompt, then read its changes as a diff." | link markup inserted; still present | "Run [Claude Code ↗︎](…) in a Linux sandbox to edit a GitHub repository from a prompt, then read its changes as a diff." (keep, or use the harness quote) |
| Caveat "outbound is off/on/required" | "By default, a Container will allow internet access" | **gone** — page now says "By default, a container started with `enableInternet: true` can reach any host." | Replace the third leg with that conditional sentence, and note it no longer states a default |
| Caveat "instance maximums" | "Maximum vCPU | 4" | row renamed; page now names Support as the route | "| vCPU per instance | 4 |" + "All instance size maximums and account limits on this page are defaults and can be increased." |
| Company / Legal entity (SEC) | "The Company was incorporated in Delaware in July 2009." | page fetched as 4.8 KB (SEC blocks plain fetches); **unverified today** | Re-fetch with a browser/Context before keeping; do not advance the date on this quote |
| Company / Leadership (cloudflare.net) | "Mr. Prince is one of our Co-Founders…" | page is a JS challenge (5.5 KB); **unverified today** | Re-fetch via Context/browser; if it fails, cite the 10-K instead |
| Company / Scale (SEC) | "As of December 31, 2025, we had 5,156 full-time employees" | same SEC fetch problem | Re-fetch; the 10-K cover page is the source |
| Company / Recent incidents | "Cloudflare Container Issues Started Nov 3, 2026, 04:12 UTC Resolved Nov 3, 2026, 05:23 UTC" | status page is a JS app; API has it | Use `cloudflarestatus.com/api/v2/incidents.json`, or keep the status-page URL (it renders in a browser) |
| Company / Price changes | "provided that we give you at least thirty (30) days' prior notice of such changes" | present, but with a typographic apostrophe (`days’`) | Keep; normalise `’` → `'` in the checker, or copy the curly form |
| Caveat "Start building for free" | "Start building for free" | **present in the page HTML**, dropped from the `Accept: text/markdown` variant (which is an LLM summary, not the page) | Keep; fetch the HTML, not the markdown twin, when checking CTA copy |
| `status-page` | quote "cloudflarestatus.com" | not a quote | "Containers" from `components.json`, or "Cloudflare Container Issues" from the incident |

Everything else in the site data (94 quotes) still matches a live page. The SEC and `cloudflare.net` failures are retrieval, not content: both are third-party/IR surfaces that bot-block plain `curl`, and the baseline recorded them as live-scraped.

---

## 7. Recommended edits (for the parent; no repo data touched here)

1. **`providers/cloudflare-sandbox.json`** — `checkedOn: 2026-11-12`. Update `sizes`: five startable presets, `basic` legacy-only; custom floor 1/16 vCPU · 256 MiB · 2 GB; maxima 4 / 12 GiB / 20 GB; note the 3 GiB/vCPU contradiction. Add a company fact for the 24 Sep cross-tenant disclosure, or a caveat — it is the most consequential thing missing. Consider a `tripsUp` line: "The docs' 3 GiB-per-vCPU rule is gone from the limits page but still asserted in a September changelog."
2. **`pricing/cloudflare-sandbox.json`** — rates unchanged; `checkedOn: 2026-11-12` if the parent accepts the fresh Context read. `maxDisk` stays 18.626 GiB (20 GB decimal). No rate changes. The `shapes` list still contains `basic` (0.25 vCPU / 1 GiB / 3.725 GiB), which `ctx.container.start()` no longer accepts; keep it only as a legacy/`default`-policy shape or drop it.
3. **`docs.json`** — change `built-in-agents` to `D/agents/harnesses/` (title "Agent harnesses: run Claude Code and Codex in a Container"), and consider a second entry for `D/agents/harnesses/container/`. `ways-to-drive` stays on `D/sandbox/reference/` (the SDK is still the primary surface); `outbound-network` stays on the same URL but the page is now about intercepts, so the title should change. Capability-level evidence for `pty` must move to `D/containers/api/durable-object-container/` (there is no docs.json key for it).
4. **Features** — `sizes-regions` (five presets, custom floor), `built-in-agents` (harness), `idle-timers` (5-min harness default), `teams-accounts` (15,000 vCPU / 60 TiB / 300 TB), `outbound-network` (intercepts, 128, 100 MiB), `ways-to-drive` (`cf`, scaffold). `isolation` note gains the storage caveat; `snapshots-forks` note gains "one snapshot, many sandboxes".
5. **Capabilities** — every row marked Δ in §2: `any-size`, `big-machines`, `live-resize`, `gpu`, `nested-virt`, `big-disk`, `fast-start` (verdict + figure), `pty` (verdict), `agents-preinstalled` (verdict), `templates`, `warm-pool`, `mcp-server`, `egress-allowlist`, `status-page`, `built-in-agents`-adjacent `prompt-api` note. Recount `partly`/`no`/`yes` for the changelog.
6. **Use cases** — `coding-agent` route: upgrade the prose from "official guide" to "official guide, or the experimental container harness with no Dockerfile, sessions in SQLite, 5-minute idle snapshot"; keep tier `guide`, `noTerminal: no`. `code-interpreter` pick `watch`: soften "smallest size that has 2 vCPU also has 8 GiB" (custom 2/4 is documented now, ratio contested). `mcp-server`: no change — it already says the route is a Worker, not a sandbox. `openclaw`: no change (still a third-party template, ~$40–50/month). `hermes-agent`: still no template.
7. **Situations** — no new pick is justified by this recheck; if the parent adds one, "cheapest per task with a hard ceiling" still favours Cloudflare only when the workload already lives on Workers. The harness layer strengthens "coding agent with a Cloudflare app" but not the non-technical situations.
8. **`changes.json`** — a dated entry is justified for the harness layer (9–10 Nov) and for the limits/concurrency change (12 Nov); the 29 Sep disk-ratio removal is a late discovery, not a new change. Do not date the cross-tenant fix as new (24 Sep disclosure).
9. **`research/rates/cloudflare-sandbox.json`** — three stale spots: `plans[Workers Paid].limits.maxConcurrent` says 1,500 vCPU / 6 TiB / 30 TB and cites the quote "Concurrent vCPU 1,500"; the per-instance evidence quote "Minimum vCPU 1 Maximum vCPU 4 … Minimum 3 GiB memory per vCPU" no longer exists; `notVerified` says "Whether support will raise the 4 vCPU / 12 GiB / 20 GB per-instance ceilings is not published" — it now is ("contact your account team or Cloudflare Support"). Update all three, and add the 1/16-vCPU floor and 128-intercept cap to `compute`/`other`.
10. **`research/cloudflare-sandbox.md`** — append a dated "Recheck 12 November 2026" section rather than rewriting §5/§10/§14; supersede the limits table, the concurrency figures, the `fast-start` row, the `pty` row, the `warm-pool` row and the contradictions list (start time, internet default and instance maxima each gain a new second leg, plus two new ones: the 3 GiB rule and `basic`). Add the harness family, Cloudflare Computer, the cross-tenant disclosure and the eMudhra advisory. The old text is still the evidence for 28 October; the new section is the evidence for 12 November.

---

## 8. Verification, limits and open questions

**What was verified.** Every page cited was fetched as `.md` today (40 of them form the quote-check corpus, the rest were read directly); every quote above matched mechanically after the declared normalisation and was read in context. Price freshness was checked twice with Context `maxAgeMs: 0`; the page's own `dateModified` (2026-10-05) and the `.md` twin agree. Status components and incidents came from the JSON APIs, not the rendered page. npm and GitHub metadata came from `registry.npmjs.org` and `api.github.com` (SDK 1.0.3, Apache-2.0, repo pushed 2026-11-10).

**What was not verified.** No account, no deployment, no container start: every timing is Cloudflare's or ComputeSDK's claim, not a measurement. No EU/US placement test, no snapshot restore test, no intercept-limit test. The SEC filing and the `cloudflare.net` leadership page were not re-scraped successfully today (bot blocks), so the company identity/scale quotes are carried forward from 28 Oct and should be re-fetched before the profile date advances on their evidence. The `durable_object` "3 GiB per vCPU" question cannot be settled from docs; a one-line `wrangler deploy` with a 2 vCPU/4 GiB custom instance would settle it, but that is a billable-adjacent hands-on step and was not authorized.

**Open questions for the parent.**
1. Does the 3 GiB rule still exist? It does not change what is certainly buyable: A can be `2/6/10` and C `2/6/20` either way (B's disk still caps at 20 GB, so `4/12/20`). It changes only whether `2/4` and `4/8` are legal, which would make A, B and C cheaper still. The site asserts the rule in a note; the limits page no longer states it, and no changelog records its removal.
2. Is the harness layer in scope for a *sandbox* comparison? It is Cloudflare's strongest answer to "run Claude Code here", but it is Agents SDK, not Sandbox, and it is experimental. A one-line mention is cheap; a feature row would need equivalent research for every other provider.
3. Should the cross-tenant disclosure be a caveat (product risk) or a company fact (vendor track record)? It affects the isolation row's meaning either way. The disclosure is first-party and the remediation is dated; the site's rule is to preserve both sides, so both quotes belong together.
4. The product page still shows 0.x code (`getSandbox`, `runCode`) and "Start building for free" while the docs say Workers Paid and 1.0. That is a year-old marketing/docs drift, not a new change; keep the caveat, do not re-date it.

**Bottom line for the parent.** Nothing in the rate card moved: $0.072/vCPU-hour active, $0.009/GiB-hour, $0.000252/GB-hour, 25 GiB-h / 375 vCPU-min / 200 GB-h included, $5 plan, same egress. What moved is the product around the meter — 10× concurrency, a custom-instance floor the limits page now states as 1/16 vCPU / 256 MiB, an intercept-based egress model with a 128-entry ceiling, a deprecated default policy, and an experimental harness that turns "bring your own Claude Code Dockerfile" into "install the SDK and go". The two rows that most need a human decision are `fast-start` (published 648 ms median now exists) and `any-size` (the 3 GiB rule vanished from the page but not from the changelog).

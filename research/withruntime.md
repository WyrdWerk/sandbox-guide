# Runtime Cloud (withruntime.com) — provider profile

Disclosure: battleships.dev, cited in this document, is built by the Boat team; Boat is one of the providers compared here. It is used as a cross-check, never as the sole source of a rate or verdict.

**Desk research only.** No sandbox was created, started, woken or billed. No account, key or
credential was used.

- **Researched:** 28 October 2026 (all quotes retrieved that day).
- **Vendor:** Runtime LLC, 1500 N Grant St Ste N, Denver, CO 80203, United States
  ("Runtime is made by Runtime LLC, 1500 N Grant St Ste N, Denver, CO 80203, United States."
  — <https://withruntime.com/about> — docs-confirmed).
- **Docs entry point:** <https://withruntime.com/docs>. The site publishes its whole
  documentation as one file, <https://withruntime.com/llms-full.txt>, and every page as
  Markdown at `/docs/<page>.md`; that is what most quotes below come from.

## How to read the tags

Every factual claim carries a source URL, a short exact quote, and one tag:

| Tag | Meaning |
|---|---|
| **docs-confirmed** | Stated by Runtime on its own site: a documentation or product page, a legal page, the status feed, or the structured data in a page. |
| **pricing-page** | Stated on <https://withruntime.com/pricing> or <https://withruntime.com/docs/pricing>. |
| **third-party** | Stated by someone other than Runtime (competitor page, directory, Hacker News, GitHub). |
| **inferred** | My arithmetic or reading, derived from published facts. Not a vendor statement. |
| **not-published** | Runtime does not say, and I did not guess. |

### Research tools actually used

| Tool | Route | Result |
|---|---|---|
| Context.dev `web_map` | `context` module | **Succeeded.** Returned the site's URL inventory (docs pages, changelog, pricing, status, about, trust). |
| Context.dev `web_scrape` | `context` module | **Succeeded** on 12 pages: `/docs/speed`, `/docs/trust`, `/docs/products`, `/docs/start`, `/docs/mcp`, `/docs/jobs`, `/docs/networking`, `/docs/observability`, `/docs/feedback-and-support`, `/about`, `/status`, `/glossary`. |
| Context.dev `web_search` | `context` module | **Succeeded** (3 queries). Surfaced the third-party pages below. |
| TinyFish `TINYFISH_SEARCH_WEB` | Composio | **Succeeded, low value.** Returned generic "sandbox" pages, no relevant hit for this vendor. |
| TinyFish `TINYFISH_FETCH_URLS` | Composio | **Succeeded.** Fetched `createos.sh/vs/withruntime`, `sandbox0.ai/alternatives/withruntime`, `readassay.com` article. |
| Firecrawl `FIRECRAWL_SCRAPE` | Composio | **Succeeded** on `/pricing` (10,408 chars, HTTP 200); content matched the vendor's own `pricing.md` exactly. |
| Firecrawl `FIRECRAWL_CRAWL_V2` | Composio | **Failed** — HTTP 429 "Rate limit exceeded. Consumed (req/min): 5". Docs coverage was taken from `llms-full.txt` instead. |
| Tavily `TAVILY_SEARCH` | Composio | **Succeeded** (found the GitHub repo and the CreateOS comparison). |
| Exa `EXA_SEARCH` | Composio | **Succeeded** but noisy; no unique finding. |
| Direct HTTPS fetch | `curl` | Used for the vendor's own `llms.txt`, `llms-full.txt`, `pricing.md`, plus the Hacker News Algolia API and the GitHub API. Not one of the named research providers; disclosed for completeness. |

Two Composio connection-management calls returned pending authentication links for
tinyfish/exa/parallel/tavily. They expired unused; no credential was created, changed or used.

Two quotes come from rendered pages rather than a saved file: the status page's median sentence
and the speed page's "No operation is within 2× of its floor yet." Both sentences are generated
client-side, so they are absent from the `.md` and raw HTML; each was read through Context.dev's
renderer twice on 28 October 2026, most recently at 12:35 UTC.

---

## 1. What it is, who it is for, product lines

**In one paragraph.** Runtime Cloud is a hosted fleet of Firecracker microVMs — small virtual
machines, each with its own Linux kernel — that an agent (or the program driving it) creates,
runs commands in, pauses, forks and deletes over an API. It is sold as compute for AI-agent
workloads rather than for websites or long-lived servers, and its commercial pitch is that CPU
is billed on measured use with a very low idle floor, so a sandbox that is waiting on a language
model costs almost nothing.

- "Runtime Cloud is a cloud for AI agents' code: Linux sandboxes, each a Firecracker microVM,
  billed on the CPU they use." — <https://withruntime.com/llms.txt> — docs-confirmed
- "Runtime Cloud gives your agents Linux sandboxes, billed on the CPU they use. It connects them
  with one browser approval." — <https://withruntime.com/docs/start> — docs-confirmed

**Who it is for.** Teams building agent products that execute model-written code, and teams
moving off a rival sandbox SDK. The vendor's own migration pitch names the competitors:

- "Code written for E2B, Daytona, Vercel Sandbox or Blaxel runs by changing the import to
  `withruntime/e2b`, `withruntime/daytona`, `withruntime/vercel` or `withruntime/blaxel` …" —
  <https://withruntime.com/llms.txt> — docs-confirmed
- "Pick Runtime if you are in or near US East and want low per-unit prices, memory-preserving
  pause, live forks and SSO, SCIM and audit log at no extra cost." —
  <https://createos.sh/vs/withruntime> — third-party (a competitor's page, so read the
  recommendation as marketing, but the factual rows match Runtime's own docs)

**Product lines.** Twenty products are listed as available, all reached through one API, CLI, MCP
server and SDK set:

- "20 products are available today: Sandboxes, Code interpreter, Network rules, Secrets, Images,
  Volumes, Snapshots, Previews, Desktop, Metrics, Webhooks, OpenTelemetry, Bucket mounts, MCP
  servers, Custom domains, TCP ports, Dedicated addresses, Private networks, Identity tokens and
  Single sign-on." — <https://withruntime.com/about> — docs-confirmed
- A further product family, **Apps and Functions** (deploying an app or function from an image),
  is in closed beta: "Functions in the CLI and the console (private beta)." …
  "Outside the beta these are refused with `product_in_beta`." —
  <https://withruntime.com/docs/changelog> — docs-confirmed
- **Plans** (monthly subscriptions) are also beta-gated: "Plans are in a private beta. Only the
  organizations in it can see or choose one." — <https://withruntime.com/docs/plans> —
  docs-confirmed

---

## 2. Isolation technology, and what it allows or forbids

**Technology: Firecracker microVMs on servers Runtime operates. Not containers, not gVisor.**

- "Every sandbox is a Firecracker microVM. It has its own Linux kernel and disk." —
  <https://withruntime.com/docs/sandbox-environment> — docs-confirmed
- "Runtime uses Firecracker microVMs on Runtime-operated dedicated servers." —
  <https://withruntime.com/docs/security> — docs-confirmed
- "CPU, memory, disk, network rules, time limits and billing are enforced on the host, outside
  the guest." — <https://withruntime.com/docs/security> — docs-confirmed

**Base image and architecture.**

- "The image is Ubuntu 24.04.5 LTS (noble) for amd64, on a 6.18 kernel." —
  <https://withruntime.com/docs/sandbox-environment> — docs-confirmed
- "**Processor:** AMD EPYC (x86-64, Zen). AVX, AVX2 and FMA are guaranteed on every server." …
  "AVX-512 is not offered." — <https://withruntime.com/docs/sandbox-environment> — docs-confirmed

**Root and sudo.** You are root inside your own VM, with passwordless sudo; the host still owns
CPU, memory, network and billing.

- "Commands run as the user `runtime` (uid 1000), in `bash`." and "`sudo` works without a
  password. You are root inside your own sandbox." — <https://withruntime.com/docs/sandbox-environment>
  — docs-confirmed
- "Root cannot change what the sandbox may reach. Root cannot change how much CPU and memory it
  has, or what it costs. The host enforces those, outside the sandbox." —
  <https://withruntime.com/docs/sandbox-environment> — docs-confirmed

**Docker inside: yes, installed on demand.**

- "`enable-docker` installs Docker Engine, Buildx and Compose from Ubuntu's archive, and starts
  them. After that, `docker` works as the sandbox user, without `sudo`." —
  <https://withruntime.com/docs/sandbox-environment> — docs-confirmed
- "Containers reach the web with no proxy settings. Their outbound connections go through the
  sandbox's relay." — <https://withruntime.com/docs/sandbox-environment> — docs-confirmed

**Kernel features: FUSE, cgroups, and now hardware virtualisation inside the guest.**

- "FUSE is built into the kernel, and `/dev/fuse` is in every sandbox." —
  <https://withruntime.com/docs/sandbox-environment> — docs-confirmed
- "New sandboxes on current-generation hosts boot a guest kernel with KVM and expose `/dev/kvm`
  to every user in the sandbox, so QEMU, Firecracker or an Android emulator runs with hardware
  acceleration instead of emulation." — <https://withruntime.com/docs/changelog> (entry dated
  27 October 2026) — docs-confirmed
- "A VM inside a sandbox keeps running through pause and resume, and is carried into snapshots
  and forks." — <https://withruntime.com/docs/changelog> — docs-confirmed

**What it forbids.** No inbound connections by default, no private/internal address reach, and a
proxy that no guest process — root included — can bypass.

- "Nothing on the internet can connect in to a sandbox." —
  <https://withruntime.com/docs/sandbox-environment> — docs-confirmed
- "A sandbox has no network card. All outbound traffic goes through a proxy on the host." …
  "The rules apply to root inside the sandbox too." —
  <https://withruntime.com/docs/sandbox-environment> — docs-confirmed
- "For both, private and internal addresses are refused." —
  <https://withruntime.com/docs/sandbox-environment> — docs-confirmed

**Practical consequence (inferred).** Because each sandbox is a whole VM with its own kernel,
anything that needs kernel-level access works the way it would on a normal Linux box: Docker,
FUSE mounts, `apt`, system packages, nested QEMU now that `/dev/kvm` exists. Because the network
is a host-side proxy with no NIC, anything that needs raw packet capture, custom routing, IP
spoofing, or inbound listeners reachable without Runtime's routing layer does not work.

**systemd: not-published.** No page says whether systemd runs as PID 1 or is even installed; the
image ships `chronyd` and `sshd` and you get `sudo` and a normal service toolbox
(<https://withruntime.com/docs/sandbox-environment>). Treat "a real VM, so systemd should work"
as an assumption to test, not a documented promise.

---

## 3. Lifecycle: states, what survives, idle behaviour, limits

### States

- The docs name the transitions rather than a single state list: "A `pause()` that returns first,
  with the sandbox still `pausing`, has not failed. `GET /v1/sandboxes/{id}?waitFor=paused` …
  shows `paused`. It shows `running` if the pause was not taken." —
  <https://withruntime.com/docs/api> — docs-confirmed
- **A canonical list of state strings is not published.** The states the docs mention are
  `starting`, `running`, `pausing`, `paused`, `resuming`, `stopping` and `stopped`; `resuming` in
  particular is not a documented string I could quote — inferred / not-published.
- There is **no archive state** and no archive action; `DELETE` is permanent. "A deleted sandbox
  is gone. `DELETE /v1/sandboxes/{id}`, `sandbox.delete()` or `runtime sandboxes rm <id>` stops
  it and deletes its disk and paused memory, in any state. Its snapshots stay." —
  <https://withruntime.com/docs/sandbox-environment> — docs-confirmed

### What survives each action (the vendor's own table)

| | Pause | Stop | Delete |
|---|---|---|---|
| Memory and running programs | Kept | Gone | Gone |
| Files on its disk | Kept | Kept | Gone |
| Comes back with | "`wake`: it carries on where it was" | "`restart`: it boots fresh from its disk" | "Nothing; create a new one" |
| Billed | "Paused storage for its memory and disk" | "Paused storage for its disk" | "Nothing; its snapshots stay billed" |

— <https://withruntime.com/docs/sandbox-environment> — docs-confirmed

### Idle auto-stop is really idle auto-**pause**

- "A sandbox pauses itself after 300 seconds with nothing happening in it: no request, no command
  still running, no open connection, no network traffic and no CPU use. From then on, it pays only
  for paused storage. The next request wakes it. Set `idlePauseSeconds` from 60 to 86,400, or 0 to
  keep it running." — <https://withruntime.com/docs/pricing> — pricing-page
- The default changed on 18 October 2026: "Idle sandboxes now pause after 5 minutes. A new
  sandbox … pauses after 5 minutes with nothing happening in it by default, where it was 1 minute
  before." — <https://withruntime.com/docs/changelog> — docs-confirmed
- "**Wake on request.** A paused sandbox with `autoWake` wakes by itself when a command, file,
  process, terminal, desktop or interpreter call reaches it. The call runs once the sandbox is
  running, usually within a second." — <https://withruntime.com/docs/api> — docs-confirmed

### Maximum session length

- "**Busy time is never cut off on a clock.** A sandbox has no time limit unless you set one with
  `timeoutSeconds`." — <https://withruntime.com/docs/pricing> — pricing-page
- "`timeoutSeconds` … A time limit you choose, 60 to 86,400 seconds (24 hours)" —
  <https://withruntime.com/docs/api> — docs-confirmed
- "`persistent: true` keeps a sandbox running until you stop it, with no idle pause." —
  <https://withruntime.com/docs/pricing> — pricing-page
- Scheduled jobs are the exception: "**A run may last up to 60 minutes.**" —
  <https://withruntime.com/docs/jobs> — docs-confirmed

### Retention when you stop paying, and how long a paused box is kept

- "A paused sandbox on a paid account is kept as long as the account has credit, until you delete
  it, or for 1–365 days if you set them with `:retention`." —
  <https://withruntime.com/docs/pricing> — pricing-page
- "A stopped or paused sandbox's disk is kept for **30 days** in an account that has bought credit
  or saved a card. Any other item, and every item in an account that has done neither, is kept for
  **seven days**." — <https://withruntime.com/docs/pricing> — pricing-page

### Published start / resume times

This is the weakest published area, and it contradicts itself:

- Current status page: "At the median, the API answers in 11 ms and a sandbox starts in 323 ms."
  — <https://withruntime.com/status> — docs-confirmed
- The dedicated speed page publishes **no** per-operation figures: "The figures this page showed
  from September 2026 were taken down on 27 October 2026, because they were no longer what
  customers see." … "**No operation is within 2× of its floor yet.**" —
  <https://withruntime.com/docs/speed> — docs-confirmed
- The last dated measurement in the changelog: "the default 2 vCPU / 4 GiB memory / 4 GiB disk
  sandbox reached running in 207 ms median (620 ms p95), and took 351 ms median from create
  through the first Python result (815 ms p95)" — <https://withruntime.com/docs/changelog>
  (24 September 2026) — docs-confirmed
- Resume from pause is described qualitatively only: "usually within a second" (above), and
  "A large sandbox needs time to wake its memory: 190 s for 65,536 MiB" —
  <https://withruntime.com/docs/api> — docs-confirmed
- The status feed does publish start-time percentiles for a create: `"median_start_ms": 272` and
  `"p95_start_ms": 673` over 7 days, 282 and 789 over 30 days — <https://withruntime.com/status.json>
  — docs-confirmed. It measures create-to-running only, not resume from pause.
- **Resume-from-pause latency percentile figures: not-published.**

---

## 4. State tools: snapshots, forks, images, volumes

### Snapshots — memory by default, disk optional

- "Snapshots default to `mode: \"memory\"`. That mode keeps files, memory and running processes.
  `await base.snapshot({ mode: \"disk\" })` keeps only the root filesystem." —
  <https://withruntime.com/docs/javascript> — docs-confirmed
- "A snapshot stays on the server of the sandbox it came from. … It is also copied off that
  server, so it survives losing it" — <https://withruntime.com/docs/products> — docs-confirmed
- "A sandbox with volumes cannot be snapshotted." — <https://withruntime.com/docs/products> —
  docs-confirmed
- Retention: "A snapshot is kept as long as you have credit. It has no end date. Without credit,
  it is kept for 7 days. Or it is kept for `retentionDays`, which can be 1 to 365." —
  <https://withruntime.com/docs/javascript> — docs-confirmed

### Fork — a copy of a running machine, but not without a pause

- "A fork is a copy of a sandbox as it is now. It has the same files, memory and running
  processes." — <https://withruntime.com/docs/javascript> — docs-confirmed
- "A running sandbox is paused while a snapshot or fork captures it. It is woken before the call
  returns." — <https://withruntime.com/docs/javascript> — docs-confirmed
- "1 to 10 running copies of a sandbox, with its files, memory and running processes." —
  <https://withruntime.com/llms.txt> — docs-confirmed
- "The snapshot a fork takes is deleted when the fork ends. This happens whether or not every copy
  started. Nothing is billed for it. Pass `keepSnapshot: true` to keep it." —
  <https://withruntime.com/docs/javascript> — docs-confirmed
- **Consequence (inferred):** this is a memory fork, not a live fork. The source freezes for the
  duration of the memory write, so "fork a busy sandbox with zero downtime" is not what is sold.

### Images (the "template" equivalent)

- "Build an image once, with your code and dependencies. Then start every sandbox from it. You can
  build an image from any Dockerfile. You can also build one from any public or private container
  image, or from a short recipe of packages." — <https://withruntime.com/docs/images> —
  docs-confirmed
- "Building an image is free." — <https://withruntime.com/pricing> — pricing-page

### Volumes

- "A create attaches up to four volumes, each at a path such as `/data`" —
  <https://withruntime.com/docs/storage> — docs-confirmed
- Two attach modes: "**`\"rw\"`** (the default): read-write, attached to one sandbox at a time.
  **`\"snapshot\"`**: a read-only copy of the volume as it is when the sandbox starts." —
  <https://withruntime.com/docs/storage> — docs-confirmed
- "Every volume is backed up off its server daily, unless you turn that off." —
  <https://withruntime.com/docs/pricing> — pricing-page
- "A volume holds its whole size on its server from the moment you create it." —
  <https://withruntime.com/docs/pricing> — pricing-page

### Bucket mounts

- "A bucket in Amazon S3, Cloudflare R2 or Google Cloud Storage, or any S3-compatible store,
  appears as a directory in a running sandbox. **The sandbox never holds the bucket's key.**" —
  <https://withruntime.com/docs/storage> — docs-confirmed

---

## 5. Machine sizes, GPU, architecture, regions

### Sizes (create defaults and bounds)

| Field | Default | Bounds |
|---|---|---|
| `vcpu` | 2 | "At most 16 on a paid sandbox, 2 without credit" |
| `memoryMiB` | 4096 | "At least 128; at most 65,536 (64 GiB) on a paid sandbox, 4,096 without credit" |
| `diskMiB` | 4096 | "At least 3,072; at most 409,600 (400 GiB), and 10,240 without credit" |
| `cpu` | `"shared"` | `"reserved"` "guarantees every vCPU" |
| `cpuFloorMillis` | 50 | "at most `vcpu` x 1000 … and 250 without credit" |

— <https://withruntime.com/docs/api> — docs-confirmed

- Account-wide ceilings: "A paid account runs **100 sandboxes at once**. … up to **200 vCPUs and
  400 GiB of memory** across the running sandboxes, and 1 TiB of disk, from the first top-up."
  — <https://withruntime.com/docs/pricing> — pricing-page
- No fixed size menu: any vCPU/memory/disk combination inside the bounds is allowed (inferred
  from the create schema, which takes numbers rather than a size id). Odd memory is rounded: "An odd size is rounded up to the next even number (4095 becomes 4096)" —
  <https://withruntime.com/docs/api> — docs-confirmed
- Resize exists but not live: memory can be changed "while it is paused
  (`POST /v1/sandboxes/{id}:resize` with memoryMiB)" —
  <https://withruntime.com/docs/sandbox-environment> — docs-confirmed

### GPU, architecture, OS

- **GPU: none.** The vendor's own support example of a missing feature is a GPU request: "No GPU
  sandboxes, so our model evaluations cannot move" — <https://withruntime.com/docs/feedback-and-support>
  — docs-confirmed. Also listed as unsupported for the Harbor integration: "**Not supported:**
  Docker Compose tasks with sidecar services, GPUs, Windows" — <https://withruntime.com/docs/harbor>
  — docs-confirmed
- **CPU arch: x86-64 (AMD EPYC) only.** "Runtime sandboxes are x86-64." —
  <https://withruntime.com/docs/aws-lambda-microvms-alternative> — docs-confirmed. An `arm64`
  image request "gets a plain error before any sandbox is made" —
  <https://withruntime.com/docs/changelog> — docs-confirmed
- **Windows / macOS: not offered** — not-published as a product; no page mentions either, and the
  base image is Ubuntu only (<https://withruntime.com/docs/sandbox-environment>).
- **Regions: one.** "Everything runs in one region, in Virginia, United States" —
  <https://withruntime.com/docs/trust> — docs-confirmed. The region id is `us-east`; the old
  `us-east-vin` name now "answers `invalid_region` and names `us-east`" —
  <https://withruntime.com/docs/changelog> — docs-confirmed.
- **IPv6 included**, dedicated IPv4 is a paid add-on (§6).

---

## 6. Networking

### Inbound — closed by default, four ways in

- "Nothing on the internet can connect in to a sandbox. These are the ways in. You open each one
  yourself" — <https://withruntime.com/docs/sandbox-environment> — docs-confirmed
- **Preview URLs:** "A preview: an HTTPS address for one port that you share on purpose. It is
  private, with a token, by default. Search engines never index it." —
  <https://withruntime.com/docs/sandbox-environment> — docs-confirmed. Host domain is
  `runtimehost.com`; tokens can be rotated; up to 16 previews per sandbox
  (<https://withruntime.com/docs/limits>).
- **Custom domains:** "**Custom domain:** a sandbox's web port at your own hostname, with HTTPS."
  — <https://withruntime.com/docs/networking> — docs-confirmed. Requires a kept top-up; verified
  by a TXT record and a CNAME; certificate from Let's Encrypt on first visit.
- **Raw TCP:** "**TCP port:** a public `address:port` for anything that is not HTTP, such as
  Postgres, Redis, MQTT or a game server." — <https://withruntime.com/docs/networking> —
  docs-confirmed. "5 a sandbox, 20 an account" (<https://withruntime.com/docs/limits>).
- **Private network / Tailscale:** "**Private network:** a WireGuard tunnel from your own network,
  in any cloud or on your premises, into your sandboxes" … "**Your Tailscale network:** a sandbox
  joins your tailnet as a machine of its own, with your auth key." —
  <https://withruntime.com/docs/networking> — docs-confirmed
- **SSH / port-forward, through the API, no open port:** "All of it goes through Runtime's API,
  authenticated with your key, over one WebSocket per connection. The sandbox opens no port to
  the internet" — <https://withruntime.com/docs/editors> — docs-confirmed

### Auth on those URLs

- Private previews carry a token: "Anyone holding its token can use it until it expires or you
  rotate it." — <https://withruntime.com/docs/networking> — docs-confirmed
- Public previews have no token and require a paid top-up: "**Public previews need a kept
  top-up:** one paid and not refunded." — <https://withruntime.com/docs/included-usage> —
  docs-confirmed
- Custom domains and TCP ports have **no built-in auth**: not-published as a feature; the docs
  only describe the routing and the certificate. (You would put auth in your own app.)

### Outbound

- "A paid sandbox reaches any public host on any port, once your account has made a purchase. A
  sandbox without credit reaches ports 443 and 80." —
  <https://withruntime.com/docs/sandbox-environment> — docs-confirmed
- Allowlists per sandbox: "`internet: false` refuses every outbound connection. With an `allow`
  list, it is allow-list only." … "`deny` always wins." —
  <https://withruntime.com/docs/sandbox-environment> — docs-confirmed
- Ports that are never reachable: "Mail ports (25, 465 and 587) are closed unless support enables
  them for your account. A few ports are never reachable: telnet, Windows RPC, NetBIOS and SMB,
  and IRC." — <https://withruntime.com/docs/sandbox-environment> — docs-confirmed
- **Static egress IP:** "**Dedicated outbound address:** every sandbox in your account sends from
  one address of its own, so you can allow-list it." — <https://withruntime.com/docs/networking>
  — docs-confirmed. $5 per 30-day month (<https://withruntime.com/pricing>).
- Sandbox-to-sandbox: "your sandboxes reach each other at `<name>.sandbox.internal`, free." —
  <https://withruntime.com/docs/networking> — docs-confirmed

### Secret / credential injection — the strongest differentiator

- "**Store an API key once. Your sandboxes use it without holding it.** Each secret has a name, a
  value and the hosts it may go to." — <https://withruntime.com/docs/security> — docs-confirmed
- "The machine sees a placeholder. The value is added only to HTTPS requests to the hosts you
  name. Code in the machine can never read it or leak it." —
  <https://withruntime.com/docs/security> — docs-confirmed
- Only specific headers are rewritten: "The credential headers are `Authorization`, `x-api-key`,
  `x-goog-api-key`, `api-key`, `xi-api-key`, `x-subscription-token` and `private-token`." —
  <https://withruntime.com/docs/security> — docs-confirmed
- Rules and scoping, both quoted: "With `rules`, on accounts with credit, the value goes only
  into requests that a rule allows. A rule allows requests by method and path." and "With `only`,
  the secret goes to some of your sandboxes instead of all of them." —
  <https://withruntime.com/docs/security> — docs-confirmed
- **Workload identity:** "Runtime signs a short-lived OpenID Connect token that names the
  sandbox, its organization and its image. Your AWS or Google Cloud account trusts Runtime once."
  — <https://withruntime.com/docs/identity-tokens> — docs-confirmed

---

## 7. Interfaces

| Interface | Status | Evidence |
|---|---|---|
| REST API | Yes | "The HTTP API is at `https://api.withruntime.com/v1`, described by its OpenAPI document" — <https://withruntime.com/about> — docs-confirmed |
| SDKs | JavaScript/TypeScript, Python, Go, Ruby, Java | "JavaScript, Python, Go, Ruby and Java SDKs, CLI, MCP, REST" — <https://createos.sh/vs/withruntime> — third-party; corroborated by the docs nav (<https://withruntime.com/docs>) |
| CLI | Yes, `npx withruntime` (also installable as `runtime`) | "The CLI runs every Runtime Cloud product from a terminal or a script." — <https://withruntime.com/docs/cli> — docs-confirmed |
| MCP server | Yes, local bridge and remote HTTP | "The endpoint is `https://api.withruntime.com/mcp`, over MCP Streamable HTTP." — <https://withruntime.com/docs/mcp> — docs-confirmed |
| SSH | Yes, over the API (no public port) | "Log in to a sandbox over SSH, open it in VS Code or a JetBrains IDE, and reach any port in it from your own machine." — <https://withruntime.com/docs/editors> — docs-confirmed |
| Web terminal | Yes, in the console | "**Terminal** is a shell in the browser" — <https://withruntime.com/docs/products> — docs-confirmed |
| Desktop / GUI | Yes, Linux desktop with live view, clicks, screenshots, MP4 recording | "A Linux desktop runs in the sandbox. You drive it as a person would." — <https://withruntime.com/docs/javascript> — docs-confirmed |
| Browser automation | Yes, Chromium over CDP | "`sbx.browser.start()` runs Chromium in the sandbox. It returns `cdpUrl`, the address that Playwright, Puppeteer, browser-use and Stagehand connect to." — <https://withruntime.com/docs/javascript> — docs-confirmed |
| Webhooks | Yes, signed, retried ~3 days, delivery log | "Those events are sent as POSTs to your URL. Each is signed and retried for about three days." — <https://withruntime.com/docs/observability> — docs-confirmed |
| OpenTelemetry | Yes, OTLP/HTTP logs, metrics, traces | "**OpenTelemetry export.** Events are pushed as logs. Each sandbox's readings are pushed as metrics." — <https://withruntime.com/docs/observability> — docs-confirmed |
| Embedded browser sessions | Yes, short-lived token for a web page | "**Sandbox sessions:** a short-lived token your own web page uses to run commands, use files and reach previews in one sandbox" — <https://withruntime.com/llms.txt> — docs-confirmed |

---

## 8. Agent features

**What exists:**

- MCP server exposing every product as tools, with browser approval instead of key copying:
  "One command, no key to copy." The documented Claude Code setup is
  `claude mcp add --scope user runtime -- npx -y withruntime mcp` —
  <https://withruntime.com/docs/mcp> — docs-confirmed
- An MCP **catalog** that runs third-party MCP servers inside a sandbox: "MCP servers from
  Runtime's catalog run in a sandbox at private URLs your agent connects to" —
  <https://withruntime.com/llms.txt> — docs-confirmed
- Framework adapters: "Use Runtime with your AI framework" lists LangChain/LangGraph, the OpenAI
  Agents SDK, the Vercel AI SDK, Claude Managed Agents, ComputeSDK, Harbor and Inspect AI
  (<https://withruntime.com/docs/frameworks> — docs-confirmed). Separate drop-in imports cover
  E2B, Daytona, Vercel, Blaxel, Morph, Modal and Cloudflare: "Code written for E2B, Daytona,
  Vercel Sandbox or Blaxel runs by changing the import" (<https://withruntime.com/llms.txt> —
  docs-confirmed).
- Four generic sandbox tools for any model: "`runtimeTools(sbx)` from `withruntime/ai` gives any
  AI SDK model the four framework tools: `runtime_exec`, `runtime_read_file`,
  `runtime_write_file` and `runtime_list_files`" — <https://withruntime.com/docs/vercel-ai-sdk>
  — docs-confirmed
- Harness adapter for Claude Code / Codex / OpenCode / Pi — **but unproven in the vendor's own
  words**: "No bridge harness (Claude Code, Codex) has run on Runtime yet." —
  <https://withruntime.com/docs/vercel-ai-sdk> — docs-confirmed

**What does not exist:**

- **No preinstalled coding agents.** The default image ships Python, Node, Bun, git, compilers and
  `sudo`; agents are installed by you: "`npm install -g @anthropic-ai/claude-code` (with or
  without `sudo`) … put their commands on `PATH`" — <https://withruntime.com/llms.txt> —
  docs-confirmed. The console's "Agents" list is a list of *connections*, not hosted agents:
  "**Agents** are connected from an agent tool such as Claude Code, Cursor or Codex." —
  <https://withruntime.com/docs/products> — docs-confirmed
- **No hosted agent-run API** (nothing like "send a prompt, get a PR"). The products are compute
  primitives; "jobs" run a shell command on a schedule, not an agent. — inferred from
  <https://withruntime.com/docs/products> and <https://withruntime.com/docs/jobs>
- **AI credential handling:** yes, and it is the most distinctive part — secrets the sandbox never
  sees (§6, quoted there), plus OIDC identity tokens for AWS/GCP (§6). No additional claim here.

---

## 9. Accounts

| Topic | What Runtime offers | Evidence |
|---|---|---|
| Orgs/teams | One "account" = org; many members; four roles (owner, admin, developer, billing); multiple accounts per person | "One Runtime account can have as many people as you need." — <https://withruntime.com/docs/teams> — docs-confirmed |
| SSO | SAML or OIDC, free; can be required for non-owners | "Single sign-on over SAML or OIDC … Free" — <https://withruntime.com/pricing> — pricing-page |
| SCIM | Yes, free, roles from directory groups | "Directory sync over SCIM … Free" — <https://withruntime.com/pricing> — pricing-page |
| Audit log | Yes, ≥400 days, CSV + API, free | "An audit log of every change to members, keys, money and security settings … kept at least 400 days" — <https://withruntime.com/docs/pricing> — pricing-page |
| Key scopes | Read-only keys; daily spend limit per key; "compartments" that wall off a key group | "read-only keys, a daily spending limit per key, and compartments" — <https://withruntime.com/docs/pricing> — pricing-page |
| Per-sandbox spend cap | `maxTotalCostMicros`, a lifetime cap | "The most the sandbox may cost over its whole life" — <https://withruntime.com/docs/api> — docs-confirmed |
| Compartment semantics | A key in a compartment gets 404 for anything outside it | "Anything outside its compartment returns 404 `not_found`" — <https://withruntime.com/docs/security> — docs-confirmed |
| Data residency | One region only, Virginia US | "Everything runs in one region, in Virginia, United States" — <https://withruntime.com/docs/trust> — docs-confirmed |
| Compliance | Vendor cites its **suppliers'** certifications; no Runtime-owned SOC 2 is claimed | "Runtime runs every sandbox in its own Firecracker virtual machine on dedicated servers in audited data centers" — <https://withruntime.com/docs/trust> — docs-confirmed |
| DPA | Standard, free | "A data processing addendum that is part of the terms for every account" — <https://withruntime.com/docs/pricing> — pricing-page |
| Uptime SLA | 99% API uptime/month, 10% service credit if missed, paid accounts | "Paid accounts are promised 99% API uptime every calendar month." — <https://withruntime.com/docs/pricing> — pricing-page |

The certification table on that page attaches each certificate to a supplier, not to Runtime:
"Sandboxes, their disks and memory — Data center, Virginia — SOC 1, SOC 2 and SOC 3 Type 2;
ISO 27001", with separate rows for Neon, Vercel, Backblaze B2, Stripe and Cloudflare/Resend
(<https://withruntime.com/docs/trust>) — docs-confirmed.

**Third-party reading of the compliance gap:** "Runtime cites its data centre's certifications
rather than its own." — <https://createos.sh/vs/withruntime> — third-party. I checked: the trust
page's certification column is attached to suppliers, and no page claims a Runtime SOC 2 report.

---

## 10. Pricing, exactly

### Published rates

| What | Price | Unit |
|---|---|---|
| Active CPU | **$0.025** | per active vCPU-hour, measured, 50 millicore floor per sandbox |
| Memory | **$0.0075** | per reserved GiB-hour (1 GiB = 1,073,741,824 bytes) |
| Paused or stopped sandbox storage | **$0.08** | per decimal GB per 30-day month |
| Snapshot | **$0.08** | per decimal GB per 30-day month |
| Custom image | **$0.08** | per decimal GB per 30-day month |
| Volume | **$0.153** (≈ $0.11 per GiB-month) | per GiB-hour |
| Volume backup | **$0.02** | per decimal GB per 30-day month |
| Inbound traffic | Free | — |
| Outbound traffic | Free for first **100 GiB/month per account**, then **$0.02** | per decimal GB |
| Sandbox-to-sandbox, same region | Free | — |
| Dedicated IPv4 | **$5** | per 30-day month |
| WireGuard tunnel (≤16 peers) | **$5** | per 30-day month |
| Plan fee, seats, minimum | **None** | — |
| SSO, SCIM, audit log, roles | **Free** | — |

— <https://withruntime.com/pricing> and <https://withruntime.com/docs/pricing> — pricing-page

- "Compute has no one-minute minimum, and memory is billed while compute runs." —
  <https://withruntime.com/pricing> — pricing-page
- Per-second meter: "Sandboxes you run bill as usual, per second." —
  <https://withruntime.com/docs/reservations> — docs-confirmed
- Disk while running: "The first 10 GiB of a running sandbox's disk is included. Past that, the
  blocks that only its disk holds are billed at the paused-storage rate, $0.08 per decimal GB per
  30-day month, measured every 30 seconds while it runs." —
  <https://withruntime.com/docs/pricing> — pricing-page
- What paused storage is charged on: "disk and memory-snapshot blocks the sandbox alone owns.
  Shared base-image blocks and snapshot safety overhead are left out." —
  <https://withruntime.com/docs/pricing> — pricing-page
- "Storage is paid an hour at a time from your balance." —
  <https://withruntime.com/docs/pricing> — pricing-page

### Free tier / credits

- "100 free hours of a 1 GB machine … 100 GiB-hours of memory, 25 vCPU-hours of active CPU, 10 GB
  of saved copies … and 5 GB of volumes" — <https://withruntime.com/docs/pricing> — pricing-page
- "An account that has never paid gets the machine time once, across its first 30 days. An account
  that has paid gets it every month, renewed on the 1st (UTC)." —
  <https://withruntime.com/docs/pricing> — pricing-page
- "Model calls are not included." — <https://withruntime.com/docs/included-usage> — docs-confirmed
- Separate from that monthly allowance: "Your first three images and first 10 GiB of volumes are
  stored free, for as long as you keep them … That is apart from the table. The 5 GB of disks a
  month in the table pays for volumes past your first 10 GiB." —
  <https://withruntime.com/docs/included-usage> — docs-confirmed
- Welcome match: "Credit your organization adds within 30 days of signing up is matched with
  credit, up to $1,000 in total." — <https://withruntime.com/docs/pricing> — pricing-page
- Auto top-up earns a bonus: "Each automatic top-up earns **5% more as credit** once its charge has
  gone through. For example, add $20 and you get $21." —
  <https://withruntime.com/docs/pricing> — pricing-page

### Plans / subscriptions

- "Plans are in a private beta. Only the organizations in it can see or choose one." A plan is "a
  monthly fee that comes back as usage" and "Any plan usage left at the end of the month expires."
  — <https://withruntime.com/docs/plans> — docs-confirmed
- **Plan prices: not-published.** No dollar figure appears on any public page; plans are read at
  runtime via `GET /v1/plans` (<https://withruntime.com/docs/plans>).

### Prepaid wallet

- "You prepay credit by card, any amount from $10 to $10,000, and usage is taken from it. There is
  no plan fee, no seat price and no commitment." — <https://withruntime.com/pricing> — pricing-page
- Stablecoin top-ups: "Credit can be bought in USDC on Base, Solana or Tempo, from any wallet." —
  <https://withruntime.com/docs/pricing> — pricing-page
- "Your balance never goes below zero and you never owe money." —
  <https://withruntime.com/pricing> — pricing-page

### Extra charges that surprise people

- Volumes are charged on **allocated** size, written or not: "The full size you create it with,
  written or not" — <https://withruntime.com/docs/pricing> — pricing-page
- Dedicated IPv4 and WireGuard are monthly, not hourly: "These are prorated to funded time."
  — <https://withruntime.com/docs/pricing> — pricing-page
- A reserved CPU floor raises the idle bill to full price: "2 reserved vCPUs and 4 GiB cost $0.08
  an hour whether the code works or waits." — <https://withruntime.com/docs/pricing> — pricing-page
- Booked burst capacity you do not use: "Booked room that none of them uses costs a quarter of the
  memory rate, $0.001875 per GiB-hour" — <https://withruntime.com/docs/pricing> — pricing-page

### How the model works, in plain words

You prepay a balance. While a sandbox is running you pay for two things continuously: the memory
you reserved for it (always, for as long as it runs) and the CPU it actually used, measured, with
a floor of one-twentieth of a core so a completely idle-but-running box still pays a little. When
nothing happens for five minutes it pauses itself; from then on you pay only for the disk and
memory blocks it occupies, at a storage rate. Nothing is charged per seat, per plan or per API
call, and there is no minimum billing period. Inbound traffic and the first 100 GiB/month out are
free. The economic bet is that agent workloads spend most of their wall-clock time waiting on a
model, so measured CPU plus a tiny floor is much cheaper than paying for every allocated core.

---

## 11. Worked cost examples

All arithmetic uses only the published rates above, and every figure below is **inferred** —
arithmetic, not a vendor statement. Where a needed input is unpublished (notably per-task CPU
utilisation and how full a disk is), I show a formula and a labelled range instead of inventing a
number.

### (A) 1,000 agent tasks/month, 10 minutes each, 2 vCPU / 4 GiB, deleted after each

Published: memory $0.0075/GiB-hour; CPU $0.025/vCPU-hour with a 0.05 vCPU floor per sandbox; disk
≤10 GiB included while running; delete leaves nothing billed.

Running time per task = 600 s = 1/6 hour. Total = 1,000/6 = 166.667 sandbox-hours.

- **Memory (exact, no assumption):** 166.667 h × 4 GiB × $0.0075 = **$5.00**
- **CPU, at the floor:** max(0.05, measured) × 166.667 h × $0.025 = 0.05 × 166.667 × 0.025 =
  **$0.208**
- **CPU, fully busy (upper bound):** 2 × 166.667 × $0.025 = **$8.33**
- **Disk:** default 4 GiB ≤ 10 GiB included → **$0.00**; deleted → no storage charge.

**Total: $5.21 (every task CPU-starved) to $13.33 (every task pegging both cores).** — inferred

Note on the floor: the vendor's own $0.64 example assumes "the CPU floor does not exceed measured
CPU" (<https://withruntime.com/docs/pricing>). In a *ten-minute* task that used only 20
CPU-seconds, average utilisation is 0.033 vCPU — below the 0.05 floor — so the floor, not the
measurement, sets the bill. The floor is what makes long, mostly-waiting tasks cost a predictable
$0.00125 per sandbox-hour.

Also: a task that sits idle for more than 300 s mid-run pauses itself, so a 10-minute task that
waits 6 minutes on a model is billed for less compute and some paused storage instead. Whether
that is cheaper depends on how much memory you keep; 4 GiB paused for an hour is
4.295 GB × $0.08/720 h ≈ $0.00048, versus $0.03125/h running.

### (B) One always-on dev box, 4 vCPU / 8 GiB / 50 GiB, 730 h/month (the brief's figure)

- **CPU, fully busy:** 4 × 730 × $0.025 = **$73.00**
- **Memory:** 8 × 730 × $0.0075 = **$43.80**
- Subtotal, busy: **$116.80**
- **CPU, idle at the floor:** 0.05 × 730 × $0.025 = $0.9125 → subtotal **$44.71**
- **Disk:** 50 GiB = 53.687 decimal GB. First 10 GiB (10.737 GB) included, so at most
  42.950 GB is billed: 42.950 × $0.08 = **$3.44/month**.
  This is an upper bound: the charge is on "the blocks that only its disk holds", so a 50 GiB disk
  that is mostly empty bills less, and the published text does not say how full a disk must be.

**Total: about $48.15 (idle) to $120.24 (both cores pegged all month).** — inferred

Caveat: "always-on" needs `persistent: true` or `idlePauseSeconds: 0`; otherwise the box pauses
after 5 idle minutes and the memory charge stops — which would make it *cheaper*, not more
expensive, but it would not be running when you came back.

### (C) One persistent box, 2 vCPU / 4 GiB / 20 GiB, 3 h/day for 30 days, stopped otherwise

A 30-day month is 720 h, not 730. Running: 90 h. Stopped: 720 − 90 = 630 h.

- **CPU, fully busy:** 2 × 90 × $0.025 = **$4.50**
- **Memory:** 4 × 90 × $0.0075 = **$2.70**
- Subtotal running, busy: **$7.20**; at the floor: 0.05 × 90 × $0.025 = $0.1125 → **$2.81**
- **Disk while running** (only the 10 GiB past the inclusion): 10 GiB = 10.737 GB × $0.08 ×
  (90/720) = **$0.11**
- **Disk while stopped:** the whole 20 GiB = 21.475 GB × $0.08 × (630/720) = **$1.50**
- **Total: $4.42 (idle) to $8.81 (busy).** — inferred

If you **pause** instead of stopping, memory is saved and billed as storage too: 24 GiB =
25.770 GB × $0.08 × (630/720) = $1.80, giving **$4.72 to $9.11** — 30 cents a month more than
stopping, in exchange for waking with your processes still alive.

The proration above (rate × hours ÷ 720) is my arithmetic: the published rate is "per decimal GB
per 30-day month", and storage billing "begins at that moment [of pause] … and ends on a confirmed
resume or deletion" (<https://withruntime.com/docs/pricing>), so a partial month is charged for the
time held. — inferred

### What none of these include

Egress past 100 GiB/month, dedicated IPv4 ($5), WireGuard ($5), volume storage, volume backups,
snapshots, or model/API costs. All are published rates; none is included in the totals above
unless stated.

---

## 12. Same word, different meaning

Every row below is **inferred**: the definitions restate the quoted documentation in §3–§6 and
§10, and the "practical consequence" column is my reading of those quotes. Where a row rests on a
vendor phrase, that phrase is quoted in the row.

| Term | Runtime's meaning | What people usually assume | Practical consequence |
|---|---|---|---|
| **Snapshot** | Memory **and** disk by default; disk-only is opt-in (`mode: "disk"`) | A disk image only | A default snapshot resumes running processes; it is bigger, and its copies come back mid-execution. A disk snapshot boots fresh. |
| **Pause** | Freezes the VM with RAM and processes intact; you keep paying storage for both | "Paused = stopped/off" | A paused box wakes exactly where it left off — but it is not free, and its saved state can be deleted (7 days without credit, or your `:retention`). |
| **Stop** | Disk kept, memory gone, **still billed** at the storage rate until deleted | "Stopped = not billed" | A stopped box is a bill, not a cleanup. Only `DELETE` ends the charge. |
| **Delete** | Removes disk and paused memory; snapshots survive | "Delete = remove everything" | Snapshots, images and volumes are separate resources with their own bills. |
| **Persistent** (`persistent: true`) | "keeps a sandbox running until you stop it, with no idle pause" | "The disk persists" | It is about *runtime*, not storage. Every sandbox's disk persists through pause and stop anyway. |
| **Fork** | Copy of files + memory + running processes, source briefly frozen, 1–10 copies | "Live clone with no interruption" | The source stalls while memory is written; "fork a busy box with zero downtime" is not what is sold. |
| **Active CPU** | Measured CPU use above a 50-millicore floor | "You pay for the vCPUs you allocated" | A 2 vCPU box that waits costs $0.03125/h, not $0.08/h — and a nearly-idle box still pays the floor. |
| **Free usage** | A resource bucket (GiB-hours, vCPU-hours, GB) | A dollar credit | It covers memory, CPU and a little storage only; egress, IPv4 and plan fees are separate, and it expires monthly (or after 30 days if you never pay). |
| **Kept top-up** | A payment that has been made and not refunded or charged back | "You have credit" | Some features (public previews, custom domains, TCP ports, private networks) need *paid money*, not granted credit. |
| **Region** | Exactly one (`us-east`, Virginia) | "Pick the closest region" | Everyone's traffic and data is in the US; there is no EU option. |
| **Template** | Called an **image**; built from a Dockerfile, a public/private image, or a package recipe | A prebuilt app template | You bring the build; there is no gallery of ready-made app templates. |
| **Preview** | Token-gated HTTPS URL on `runtimehost.com`, `noindex` | A public deployment URL | Sharing it means sharing the token. Public, indexable hosting requires a custom domain. |
| **Desktop** | Linux desktop streamed as a private preview, plus CDP browser | A VNC/RDP endpoint | There is no VNC address to connect a client to; you drive it through the API or watch the preview. |
| **Volume** | Fixed-size disk attached to one sandbox (or a read-only copy attached to many) | A shared network filesystem | Only one sandbox can write at a time; "shared" mode is read-only. |
| **Compartment** | A key-scope boundary; other keys get 404 | A network/VPC | It is access control, not networking. |
| **Lease** (`leaseSeconds`) | How far ahead funding is renewed (up to 12 h) | A session timeout | A short lease does not stop your sandbox; it changes how much credit is held in advance. |
| **`no_capacity`** | A queue position, admitted by plan lane | "Try again later" | Requests wait in line and are retried; a paid account is ahead of a free one. |

---

## 13. Glossary candidates

Terms a newcomer needs before this provider's docs make sense:

- **microVM / Firecracker** — a lightweight virtual machine with its own kernel, smaller and
  faster to start than a traditional VM, stronger isolation than a container.
- **Own kernel** — why Docker, FUSE and `apt` work here but not inside a shared-kernel container.
- **vCPU** — a virtual core; here it is a *burst ceiling*, not a reservation.
- **CPU floor** (`cpuFloorMillis`, default 50 = 0.05 vCPU) — the guaranteed share, and the least
  you are billed for while running.
- **Shared vs reserved CPU** — burstable vs "bills every vCPU as if always busy".
- **GiB vs GB / decimal GB** — memory is priced in GiB (2³⁰ bytes), disk and egress in GB (10⁹
  bytes). The 7.4% difference is real money at scale.
- **Active CPU-hour / GiB-hour** — the two compute meters.
- **Paused storage** — the storage meter for a frozen VM's disk and RAM.
- **Memory snapshot vs disk snapshot** — resume processes vs boot fresh.
- **Fork** — copy a running machine, including RAM and processes.
- **Pause / stop / delete / restart / wake** — five words, five different outcomes for state and billing.
- **Idle pause** — automatic freeze after 5 minutes of no activity.
- **`persistent`** — never idle-pause; runs until stopped.
- **Lease** — the funding renewal window, not a timeout.
- **Kept top-up** — paid, unrefunded money, required for some network features.
- **Free usage** — a monthly resource allowance, not dollars.
- **Welcome match** — dollar-for-dollar credit on your first 30 days, up to $1,000.
- **Egress / ingress** — outbound vs inbound bytes; only outbound is metered.
- **Preview URL** — tokenised HTTPS route to one port.
- **Custom domain / TCP port / dedicated IP / WireGuard** — the four paid ways to expose or route.
- **`<name>.sandbox.internal`** — free sandbox-to-sandbox addressing.
- **Egress secret / placeholder (`rtsec_…`)** — the key the sandbox can use but not read.
- **Identity token** — short-lived OIDC token so a sandbox can assume a cloud role.
- **Compartment** — a key group walled off from the rest of the account.
- **Image vs snapshot vs volume** — build artifact vs saved machine vs attached disk.
- **MCP / MCP catalog** — the tool protocol, and Runtime's in-sandbox server catalogue.
- **Harness** — an agent runtime (Claude Code, Codex, OpenCode, Pi) wrapped by an adapter.
- **Code interpreter** — a stateful notebook session inside the sandbox.
- **CDP** — Chrome DevTools Protocol; how Playwright/Puppeteer attach to the in-sandbox browser.
- **Idempotency key** — how a retried create does not make a second sandbox.
- **`no_capacity` / `quota_exceeded` / `account_share_full`** — the three different "you cannot
  have this right now" errors.
- **`maxTotalCostMicros`** — a lifetime spend cap per sandbox, in millionths of a dollar.

---

## 14. Gaps, gotchas, contradictions, and differences from battleships.dev

### Unpublished facts

- **Latency:** no per-operation p50/p95/p99 table exists on the speed page today — "No operation
  is within 2× of its floor yet." (<https://withruntime.com/docs/speed>) — not-published. The
  status feed is the only place with numbers, and it covers one operation only: create-to-running,
  `"median_start_ms": 272`, `"p95_start_ms": 673` over 7 days
  (<https://withruntime.com/status.json>).
- **Plan prices:** "Plans are in a private beta. Only the organizations in it can see or choose
  one." (<https://withruntime.com/docs/plans>) — no dollar figure is published; not-published.
- **Resume-from-pause time:** qualitative only — "usually within a second"
  (<https://withruntime.com/docs/api>) — not-published as a percentile.
- **Per-task CPU utilisation:** never published, which is why example (A) is a range —
  not-published.
- **How full a disk must be** before the "unique blocks" charge bites: the docs say only that
  "the blocks that only its disk holds are billed" (<https://withruntime.com/docs/pricing>) —
  not-published.
- **Whether memory is billed during boot:** "Memory is billed while compute runs. CPU is billed
  from the moment the sandbox is ready" (<https://withruntime.com/docs/pricing>) leaves the boot
  window ambiguous, while also saying "Runtime pays for the CPU used while a sandbox boots".
- **Custom-domain / TCP-port authentication:** the networking page describes routing and the
  certificate only; no built-in auth is documented — not-published.

### Internal contradictions

1. **How often new accounts get free hours.** `/docs/start` says "New accounts get 100 free hours
   of a 1 GB machine **every month**, no card"; `/docs/included-usage` and `/docs/pricing` say an
   account that has never paid gets them **once**, across its first 30 days. The about page agrees
   with the "first 30 days" reading. Treat "every month" as applying only after a first payment.
2. **Speed page vs homepage.** `llms.txt` advertises published p50/p95/p99 per operation; the
   speed page says it lists nothing because no operation is within 2× of its floor.
3. **Idle default.** Docs say 300 s (changed 18 Oct). Two third-party pages still say 60 s.

### Gotchas that cost money or time

- **A stopped sandbox keeps billing.** "A stopped sandbox keeps its disk the same way, at the same
  rate, for as long as a paused one. It is kept until you delete it. Only a delete removes a
  disk." — <https://withruntime.com/docs/pricing> — pricing-page
- **`persistent: true` is not free persistence.** "`persistent: true` keeps a sandbox running
  until you stop it, with no idle pause." (<https://withruntime.com/docs/pricing>) So a forgotten
  box bills memory 24/7. — inferred
- **Open connections keep a box awake.** Idle means "no request, no command, terminal, SSH session
  or port forward open, no CPU use and no traffic" — so a forgotten terminal, SSH session or
  port-forward keeps billing. A preview tab left open does not count: "A browser tab left open on
  a preview does not count." (<https://withruntime.com/docs/included-usage>)
- **A sandbox with volumes cannot be snapshotted** — "A sandbox with volumes cannot be
  snapshotted." (<https://withruntime.com/docs/products>) Pick volumes *or* memory snapshots.
- **Forked processes share random-number state.** "a program that keeps its own generator in
  memory gives the same 'random' bytes in every copy until it reseeds. Two copies can then make
  the same key, token, session ID or UUID." (<https://withruntime.com/docs/storage>)
- **Secrets only rewrite specific headers, never URLs:** "The value never goes into the URL (its
  path or query) or into any other header." (<https://withruntime.com/docs/security>) An API that
  takes `?key=` cannot use an egress secret.
- **Mail ports are closed** unless support opens them: "Mail ports (25, 465 and 587) are closed
  unless support enables them for your account." (<https://withruntime.com/docs/sandbox-environment>)
- **Jobs do not keep disk between runs:** "Nothing on the sandbox's own disk carries over to the
  next run." (<https://withruntime.com/docs/jobs>)
- **Free-tier size ceiling is hard:** "Up to **four sandboxes running at the same time**, each up
  to **2 vCPU and 4 GiB of memory**, with up to 10 GiB of disk" and "At most **5 sandboxes kept**"
  and "At most **50 sandboxes made a day**" (<https://withruntime.com/docs/included-usage>) —
  docs-confirmed.
- **Free usage is not available from data-centre or VPN addresses** until you add credit: "An
  account opened from a data-centre or VPN network … gets its free usage once it adds credit, not
  before." (<https://withruntime.com/docs/included-usage>) — docs-confirmed
- **`maxTotalCostMicros` is a lifetime cap, not a monthly budget:** "The most the sandbox may
  cost over its whole life" (<https://withruntime.com/docs/api>). Whether the cap covers storage,
  and whether it can be read back, are not documented — not-published.
- **Egress accounting changed on 5 Oct 2026** for previews/domains/TCP ports: "For sandboxes
  created from 5 October 2026, it also covers what they serve through previews, custom domains and
  TCP ports" and "What a sandbox created before 5 October 2026 serves stays free for its life."
  (<https://withruntime.com/docs/pricing>) — pricing-page
- **Uptime is currently below the promise.** The status page reports "Last 7 days 96.37%" and
  "Last 30 days 98.87%" against "99% API uptime every calendar month"
  (<https://withruntime.com/status>) — docs-confirmed. The SLA pays 10% of a month's charges back,
  but buyers should expect occasional API failures.
- **Very young product.** GitHub repo created 26 September 2026 with 1 star
  (<https://api.github.com/repos/withruntime/runtime>); two Hacker News submissions on 8 and 10
  October 2026, each with 3 points and 1 comment between them
  (<https://hn.algolia.com/api/v1/search_by_date?query=withruntime.com&restrictSearchableAttributes=url>)
  — third-party. Changelog entries land daily, including breaking changes (idle default, egress
  accounting, kernel upgrades).

### Discrepancies with battleships.dev

Source: <https://battleships.dev/data/providers/withruntime.json> and `.md` (retrieved 28 Oct 2026;
its notes date from 28 September 2026).

| battleships.dev says | Live docs say | Verdict |
|---|---|---|
| "Default idle pause is 60 seconds (configurable 10–86,400 or disabled)" | 300 s default, minimum 60, changed 18 Oct 2026 | **Stale.** The 60 s figure was correct before 18 October. |
| "nested virtualization: No" | "New sandboxes … expose `/dev/kvm` … QEMU, Firecracker or an Android emulator runs with hardware acceleration" (27 Oct 2026) | **Stale.** Nested virtualisation is now available. |
| "preinstalled agents: Yes" | Default image has Python/Node/Bun/git/compilers; agents are installed by the user; "No bridge harness (Claude Code, Codex) has run on Runtime yet." | **Wrong or misleading.** What exists is MCP/agent *connection* support, not preinstalled agents. |
| "automatic snapshots: Yes" | Snapshots are on demand; automatic backups apply to volumes, not sandboxes | **Imprecise.** |
| "public IPv4: Yes" | Dedicated IPv4 is *outbound* ($5/mo); inbound is previews, custom domains, TCP ports | **Imprecise.** |
| "shared volumes: Yes" | Volume `"snapshot"` mode is read-only multi-attach; `"rw"` is one sandbox | **Half true** — sharing is read-only. |
| "live resize: No" | Memory resize exists but only while paused | **Correct**, worth stating as "resize while paused". |
| "fork/clone: Yes" + "live fork (no pause): No" | Fork copies memory/processes but freezes the source during capture | **Correct and well judged.** |
| "SOC 2: No" | Runtime cites its data centre's and subprocessors' SOC 2/ISO certs, not its own | **Correct.** |
| "idle auto-stop: Yes" | It auto-*pauses*, keeping memory, and bills storage | **Imprecise** but harmless. |
| "≥24 h sessions: Yes" | No time limit at all unless you set one (max 24 h when you do) | **Understated.** |
| "GPU: No", "arm64: No", "Windows/macOS: No", "EU data residency: No", "self-hosting/BYOC/open source: No" | Consistent with docs (single US region; x86-64; no GPU). The SDK/CLI/MCP repo is Apache-2.0, but the platform itself is not open source and cannot be self-hosted | **Correct** (with the licence nuance above) |
| "Unknown: everything else" | — | Fair; several items it marks "Yes" are documentation claims it did not test. |

battleships.dev's own caveat is the right frame: "No sandbox was purchased or tested; feature and
performance statements are documentation claims." I did the same — this profile is documentation
and third-party evidence, not measured behaviour.

---

## 15. Non-technical usability

Short version: there is a real web console, but the product is built for agents and developers.
A non-technical buyer can sign up, start a sandbox and look at a terminal without writing code;
they cannot get much further without either an agent or an engineer.

### Is there a dashboard?

Yes, and it is unusually detailed for a product this young.

- "The sidebar holds everything. … Under it are **Search or create**, **Home**, then
  **Sandboxes**, **Images** and **Volumes**. At its foot are **Usage & billing** … and
  **Settings**." — <https://withruntime.com/docs/products> — docs-confirmed
- Home is a daily report with a "**Needs you**" section: "That includes a sandbox that failed to
  start or wake, or credit or free usage about to run out (credit five days ahead at this month's
  pace)." — <https://withruntime.com/docs/products> — docs-confirmed
- A sandbox page has tabs "Overview, Terminal, Files, Activity and Settings", and "**Terminal** is
  a shell in the browser" — <https://withruntime.com/docs/products> — docs-confirmed
- Billing is a real page: "Usage & billing opens on your credit, with adding credit in place …
  It also shows daily spend by product, with where the month is heading" —
  <https://withruntime.com/docs/products> — docs-confirmed
- Limits have their own page: "You can see your account's limits, and how much of each you use, on
  the Limits page of the console" — <https://withruntime.com/docs/limits> — docs-confirmed

But the console is an operations view, not a builder: every panel also shows "the commands that
change them" (e.g. "Each start shows the CLI command and SDK call that does it, ready to copy" —
<https://withruntime.com/docs/products>). — inferred: the console is designed to hand you code,
not to replace it.

### Can someone use it without writing code?

Partly, and only for the first step.

- **Yes, one click to a working shell:** "**In the browser:** sign in and press **Start a
  sandbox** on Home. It opens with a shell running in the page, on your free hours." —
  <https://withruntime.com/docs/start> — docs-confirmed
- **Yes, if you have a coding agent.** The docs' first instruction is "Paste this into your coding
  agent:" followed by the prompt block "Move this project to Runtime Cloud: read
  https://withruntime.com/llms.txt and follow it." —
  <https://withruntime.com/docs/start> — docs-confirmed
- **No app templates or one-click agents.** "Template" maps to a Docker image you build, and the
  only catalogues are MCP servers and framework integrations. There is no gallery of ready-made
  apps and no hosted agent you can prompt from the dashboard. — inferred from
  <https://withruntime.com/docs/products> and <https://withruntime.com/docs/images>
- Scheduled jobs are console-manageable ("It has buttons to run the job now, change its schedule,
  pause it, resume it or cancel it" — <https://withruntime.com/docs/jobs>) but creating one means
  supplying a command line.

### What signup takes

- **A Google sign-in, no card, no waitlist.** The "Start free" buttons on every page I read
  (docs, pricing, about, speed, support) point at `https://withruntime.com/api/sign-in/google`
  (e.g. <https://withruntime.com/docs/start>), and the free tier is "no card"
  (<https://withruntime.com/pricing>). There is also a general sign-in page: "sign in and press
  Start a sandbox" (<https://withruntime.com/docs/start>).
- Free usage requires a "verified sign-in" and is withheld from cloud/VPN origins:
  "An account opened from a data-centre or VPN network … gets its free usage once it adds credit,
  not before." — <https://withruntime.com/docs/included-usage> — docs-confirmed
- Team invites are email links with a role: "The link works once, for seven days." —
  <https://withruntime.com/docs/teams> — docs-confirmed
- **No enterprise sales gate for SSO:** "There is no enterprise plan, no seat fee and no add-on to
  buy. A company pays the same rates as one person." — <https://withruntime.com/docs/pricing> —
  pricing-page

### Docs, support, status

- **Docs:** extensive (dozens of pages), each page carries a date stamp — for example "Updated
  October 27, 2026" (<https://withruntime.com/docs/speed>) — and the site publishes `llms.txt` /
  `llms-full.txt` so an agent can read the whole manual in one fetch. "Runtime Cloud is a cloud
  for AI agents' code" opens that file (<https://withruntime.com/llms.txt>) — docs-confirmed.
  Documentation quality is high but written for builders: dense with API field names, error codes
  and shell commands. — inferred
- **Support is AI-first:** "**Runtime's support agent replies in the same call, with your account
  in view.**" It can propose actions but "The support agent never changes your account by itself."
  — <https://withruntime.com/docs/feedback-and-support> — docs-confirmed. Humans handle "Refunds,
  credits, disputed charges, security reports, suspected leaked keys, data loss, outages, abuse
  reports and legal questions" — same page.
- **No phone support, no published support hours or response-time targets** — not-published.
- **Status page is public and specific:** "Both checks passed their last run. At the median, the
  API answers in 11 ms and a sandbox starts in 323 ms." plus 24 h / 7 d / 30 d uptime and a
  day-by-day table — <https://withruntime.com/status> — docs-confirmed. That sentence is rendered
  client-side and the page was stamped "Updated 10:10 UTC"; the JSON feed behind it carries fresher
  numbers (§17).
- **Feedback is a first-class channel** with a taxonomy: "Kinds are `bug`, `missing_feature`,
  `competitor_gap`, `migration_blocker`, `docs`, `pricing`, `praise` and `other`." —
  <https://withruntime.com/docs/feedback-and-support> — docs-confirmed.

### What would trip up a non-engineer

1. **"Sandbox" here is not a website host.** Nothing is reachable from the internet unless you
   deliberately open a preview, domain or TCP port (§6).
2. **The bill moves while nothing "happens".** Memory is charged for every running second, and a
   forgotten `persistent` box bills 24/7. The console warns, but the mental model has to be learned.
3. **Pause, stop and delete are three different things** with three different bills (§12).
4. **The first useful step still needs a command or an agent.** After "Start a sandbox" you are
   looking at a shell prompt.
5. **Keys and secrets are a concept you must hold.** Even the friendly path ends in "make your
   first key in one click. The key is shown once." (<https://withruntime.com/docs/start>)
6. **Two units for "size".** GiB for memory, decimal GB for disk and egress — a 7.4% difference
   that shows up in quotes and bills.
7. **No EU region.** If a buyer's data must stay in Europe, this is disqualifying, and nothing in
   the UI will stop them before they have built on it.
8. **Uptime is not yet at the promised level** (96.37% over the last 7 days at the time of
   research), so "it just works" expectations should be tempered.
9. **It is very new.** A one-month-old GitHub repo, near-zero community discussion, and daily
   changelog entries including breaking changes. A non-technical buyer cannot lean on a large
   body of tutorials or Stack Overflow answers.


---

## 17. The company behind it

*Numbered 17 as requested; this profile's other sections run 1–15, so there is no section 16.*

*Researched 28 October 2026. Legal pages were read as Markdown from
`https://withruntime.com/legal/raw/<page>`; the status figures were read from
`https://withruntime.com/status.json` at 12:28 UTC the same day.*

### Legal entity and where it is registered

- **Runtime LLC**, at a Denver, Colorado address, is the contracting party. The terms open:
  "These terms are a contract between you and Runtime LLC" … "1500 N Grant St Ste N, Denver, CO
  80203, United States." — <https://withruntime.com/legal/terms> — docs-confirmed
- The same entity appears in the site's structured data: `"legalName": "Runtime LLC"` with
  `"addressLocality": "Denver"`, `"addressRegion": "CO"`, `"postalCode": "80203"`,
  `"addressCountry": "US"` — <https://withruntime.com/about> (Organization JSON-LD) —
  docs-confirmed
- The data-processing addendum names the same entity: "Importer: Runtime LLC, 1500 N Grant St Ste
  N, Denver, CO 80203, United States" — <https://withruntime.com/legal/dpa> — docs-confirmed
- **State of formation and registration/file number: not-published.** No page states them. I
  tried Colorado's Secretary of State business search on 28 October 2026; it returned only its
  search form to a scripted request, so I could not confirm a filing. The Denver address is
  therefore the only registered detail a buyer can verify from public pages.
- The site also points at package registries rather than a corporate register: `"sameAs"` lists
  GitHub, npm, PyPI, RubyGems and pkg.go.dev — <https://withruntime.com/about> — docs-confirmed

### Founders and leadership

- **No founder, executive or board member is named anywhere Runtime publishes.** The about page
  names the company and the address, not people; the terms, privacy policy and DPA are signed by
  the entity only; and the pages a team would live on return HTTP 404 — `/team`, `/careers`,
  `/company` and `/press` all returned 404 on 28 October 2026. — not-published
- The code repositories do not name people either. The GitHub organisation was created on
  14 September 2026 and its commits come from `runtime-release`, `Runtime` and a bot account, not
  from individuals: the organisation's `"name"` is the company name, its `"location"` and
  `"email"` are null, and it has `"public_repos": 17` and `"followers": 0` —
  <https://api.github.com/orgs/withruntime> — third-party (registry record)
- Both Hacker News submissions of the site were posted by the account `shermansingh` — stories
  50001168 (8 October 2026) and 50030427 (10 October 2026), 3 points each — but the account's
  role, if any, is not stated anywhere. — <https://hn.algolia.com/api/v1/items/50030427> —
  third-party
- **A caution for the explainer:** another company called "Runtime" is easy to confuse with this
  one, and it is also agent infrastructure. Runtime disambiguates itself in its own structured
  data: "Runtime Cloud at withruntime.com, a cloud of Linux sandboxes for AI agents. Not to be
  confused with Runtime at runtm.com." — <https://withruntime.com/about> — docs-confirmed
- That other company is a Y Combinator company: "Runtime — The AI agent harness for payment
  teams", Spring 2026, San Francisco, website `https://www.runtm.com/`, with founder/CEO Gus
  Trigos — <https://www.ycombinator.com/companies/runtime> — third-party. battleships.dev's note
  about a YC "Runtime" described as "AI agents for financial operations" refers to the same
  company, described differently. **None of its founders, funding or customers belong to
  withruntime.com**, and any explainer that merges the two will attribute a YC-backed payments
  company's profile to a one-month-old sandbox provider.

### Founding date and public launch

Runtime publishes no founding date. The earliest public traces, all checked 28 October 2026:

| Trace | Date | Source | Tag |
|---|---|---|---|
| Domain `heyruntime.com` registered (now redirects to withruntime.com) | 2 September 2026 | <https://rdap.verisign.com/com/v1/domain/HEYRUNTIME.COM> | third-party (registry record) |
| GitHub organisation created | 14 September 2026 | <https://api.github.com/orgs/withruntime> | third-party (registry record) |
| Domain `withruntime.com` registered | 18 September 2026 | <https://rdap.verisign.com/com/v1/domain/WITHRUNTIME.COM> | third-party (registry record) |
| Earliest changelog entry | 18 September 2026 | <https://withruntime.com/docs/changelog> ("## 18 September 2026") | docs-confirmed |
| npm package first published | 22 September 2026 | <https://registry.npmjs.org/withruntime> (`"created":"2026-09-22T22:46:32.237Z"`) | third-party (registry record) |
| Status record begins | 23 September 2026 | <https://withruntime.com/status.json> (`"record_begins":"2026-09-23"`) | docs-confirmed |
| First Hacker News submission | 8 October 2026 | <https://hn.algolia.com/api/v1/items/50001168> | third-party |

- The changelog describes itself as complete from the start: "What shipped in Runtime Cloud,
  newest first." It holds 38 dated sections running from 18 September to 27 October 2026 —
  <https://withruntime.com/docs/changelog> — docs-confirmed
- **The LLC's formation date, and any date before September 2026, are not-published.**

### Funding: stage, amounts, investors, accelerators

- **Not-published.** No funding announcement, investor page, accelerator badge or "backed by" line
  appears on withruntime.com. I checked the about, startups, pricing, trust and legal pages and
  the structured data, and searched for the company by name.
- The searches return only unrelated companies with the same name — Runtime Ventures (a
  cybersecurity fund), Upwind's "Runtime Cloud Security", and the YC company above — so the
  absence is not an artefact of a bad query but a name-collision problem. — third-party (my
  searches, 28 October 2026). The vendor itself disambiguates only against runtm.com:
  <https://withruntime.com/about> — docs-confirmed
- **Do not read the startup programme as evidence of funding.** "Runtime for Startups" is a
  customer offer whose eligibility test is about the *applicant*: "Your company is venture-backed:
  it has raised from an accelerator, a pre-seed round, a seed round or a Series A, and a public
  page shows it." — <https://withruntime.com/startups> — docs-confirmed
- Cross-check: battleships.dev records "Stage: unknown", "Total raised: unknown", "Accelerators:
  none found" — <https://battleships.dev/data/providers/withruntime.md> — third-party. That
  matches what I found independently.

### Ownership, parent companies, changes of control

- **No parent, subsidiary, investor or acquisition is disclosed.** Runtime LLC contracts directly
  with customers and is described as the maker of the service: "Runtime is made by Runtime LLC,
  1500 N Grant St Ste N, Denver, CO 80203, United States." —
  <https://withruntime.com/about> — docs-confirmed
- **No ownership change is published**, and I found no report of one. — not-published
- One ownership-adjacent term is worth flagging for a buyer: the terms reserve the right to name
  customers publicly. "We may name you as a customer and show your name and logo when we describe
  who uses the Services. Email legal@withruntime.com to be left out." —
  <https://withruntime.com/legal/terms> — docs-confirmed

### Headcount

- **Not-published.** No page states a number of employees, and there is no careers page to
  estimate from (`/careers` returns 404). The only indirect signal is operational: the vendor says
  it runs its own servers and a support function, and its subprocessor list includes Slack for
  "our team's alerts and support drafts" — <https://withruntime.com/legal/subprocessors> —
  docs-confirmed. That is not a headcount.

### Status page and recent uptime (re-checked today)

The status page is public, machine-readable, and specific about method:

- "Every 2 minutes, a scheduled job at Vercel's Washington, D.C. region (iad1) requests
  https://api.withruntime.com/healthz and counts the check as passed only when it answers HTTP 200
  within 8 seconds; it runs outside our servers, so an outage of our host reads as down rather
  than as silence." — <https://withruntime.com/status.json> — docs-confirmed
- A second, separate check starts a real sandbox: "Every 10 minutes, a scheduled job at Vercel's
  Washington, D.C. region (iad1) uses an account of our own, through the public API like any
  customer, to create the smallest sandbox, run echo ok in it and stop it" —
  <https://withruntime.com/status.json> — docs-confirmed

Figures at 12:28 UTC on 28 October 2026:

| Measure | 24 h | 7 days | 30 days | Since 23 Sep 2026 |
|---|---|---|---|---|
| API checks passed | 99.85% (702/703) | **96.37%** (4,841/5,023) | 98.87% (21,335/21,577) | 99.02% (24,829/25,073) |
| Sandbox-start check passed | 100% (144/144) | 96.42% (972/1,008) | 98.58% (4,256/4,317) | 98.75% (4,927/4,989) |

— <https://withruntime.com/status.json> — docs-confirmed

- **The 7-day figure has not moved from 96.37%** since this profile's first pass earlier the same
  day; only the denominators grew (5,014 → 5,023 readings). The 30-day figure is unchanged at
  98.87%. So the answer to "did it move?" is no.
- The same feed publishes sandbox start times, which is the closest thing to a public latency
  figure: "median_start_ms": 272 and "p95_start_ms": 673 over 7 days; 282 and 789 over 30 days —
  <https://withruntime.com/status.json> — docs-confirmed
- The feed listed `"incidents": []` at the time of reading — zero incidents recorded —
  <https://withruntime.com/status.json> — docs-confirmed
- The bad day is visible in the daily table: 25 October 2026 shows 75.00% (180 failed readings of
  720) — <https://withruntime.com/status> — docs-confirmed

### The 99% promise, and who it covers

- **It is not tied to a plan.** It is tied to having paid: "It covers every account that has
  bought credit and has not had all of it refunded or charged back" — and the page then calls that
  state a paid account — <https://withruntime.com/legal/sla> — docs-confirmed
- The machine-readable status feed says the same: `"uptime_promise": {"percent": 99,
  "credit_percent": 10, "applies_to": "paid accounts", "measured_by": "API"}` —
  <https://withruntime.com/status.json> — docs-confirmed
- What is promised: "The Runtime Cloud API is available at least 99% of every calendar month, in
  UTC. In a 30-day month, 99% leaves 7 hours and 12 minutes of downtime." —
  <https://withruntime.com/legal/sla> — docs-confirmed
- The remedy is automatic and capped: "every paid account receives service credit equal to 10% of
  what it was charged for the Services in that month." … "Service credit is your sole remedy for
  the API being unavailable." — <https://withruntime.com/legal/sla> — docs-confirmed
- Exclusions: "a feature marked prerelease, preview, beta, trial or private testing" and "a
  problem in your own code, network or the services your sandboxes reach" —
  <https://withruntime.com/legal/sla> — docs-confirmed
- **Which plans:** the SLA names no plan, and the plans themselves are beta. "Plans are in a
  private beta. Only the organizations in it can see or choose one." —
  <https://withruntime.com/docs/plans> — docs-confirmed. So the honest answer is: the promise
  covers paid accounts, not a plan tier, and a beta plan's own terms are not published.
- At the figures above, the account would have missed the promise over the last 7 and 30 days
  (96.37% and 98.87% against 99%), which is exactly when the 10% credit applies — inferred.

### Support channels

| Channel | Detail | Source | Tag |
|---|---|---|---|
| In-console support agent | "Runtime's support agent replies in the same call, with your account in view." | <https://withruntime.com/docs/feedback-and-support> | docs-confirmed |
| Human escalation | "Refunds, credits, disputed charges, security reports, suspected leaked keys, data loss, outages, abuse reports and legal questions always go to a person." | same page | docs-confirmed |
| Email | `support@withruntime.com`, `security@withruntime.com`, `legal@withruntime.com`, `abuse@withruntime.com` | <https://withruntime.com/legal/terms> | docs-confirmed |
| CLI / MCP | "`npx withruntime support "…"`" and the `runtime_support` MCP tool | <https://withruntime.com/docs/feedback-and-support> | docs-confirmed |
| Status page | API checked every 2 minutes, a real sandbox every 10 | <https://withruntime.com/status> | docs-confirmed |
| Security reports | "Contact: mailto:security@withruntime.com" | <https://withruntime.com/.well-known/security.txt> | docs-confirmed |

- **No phone number, no published support hours and no response-time target: not-published.** The
  only response commitment in the legal pages is about the *service*, not support.
- Support conversations are processed by a model, and the vendor says so: "Support conversations
  are processed by an AI model through a third-party model gateway." —
  <https://withruntime.com/docs/feedback-and-support> — docs-confirmed. The subprocessor list has a
  row for "Anthropic, PBC" whose job is "Runs the AI model that answers support" —
  <https://withruntime.com/legal/subprocessors> — docs-confirmed

### Security and compliance claims

- "Runtime runs every sandbox in its own Firecracker virtual machine on dedicated servers in
  audited data centers, encrypts every backup to keys the storage provider never sees, and
  publishes how it works." — <https://withruntime.com/docs/trust> — docs-confirmed
- **The certifications are the suppliers', not Runtime's.** The trust page's table attaches them
  to a data centre, Neon, Vercel, Backblaze B2, Stripe and Cloudflare/Resend. For sandboxes it
  lists the holder as "Data center, Virginia" and the certificate as "SOC 1, SOC 2 and SOC 3 Type
  2; ISO 27001" — <https://withruntime.com/docs/trust> — docs-confirmed. **A Runtime-owned SOC 2
  report is not-published.**
- Who runs the metal: the subprocessor table lists "OVH US LLC (OVHcloud US)", whose row reads
  "The dedicated servers that run and store sandboxes, and storage for copies of paused sandboxes",
  located in the "United States" — <https://withruntime.com/legal/subprocessors> — docs-confirmed
- Data location: "We and our subprocessors are in the United States." —
  <https://withruntime.com/legal/privacy> — docs-confirmed. Transfers out of the EEA/UK/Switzerland
  rely on "the European Commission's standard contractual clauses" — same page.
- Access and audit: four roles, SSO over SAML/OIDC, SCIM, two-step sign-in, read-only keys,
  compartments and an audit log "kept at least 400 days" — <https://withruntime.com/docs/pricing>
  — pricing-page
- Customer audits: "you may audit us on at least 30 days' notice, during business" hours —
  <https://withruntime.com/legal/dpa> — docs-confirmed
- Cross-check: "Runtime cites its data centre's certifications rather than its own." —
  <https://createos.sh/vs/withruntime> — third-party

### Terms that matter to a buyer

**Deletion when you cancel.** Three documents say the same thing in increasing detail:

- "**What happens then.** Your access stops and Your Content is deleted." —
  <https://withruntime.com/legal/terms> — docs-confirmed
- "When your organization closes, we first destroy its encryption key. This makes the off-server
  copies of its volumes and snapshots, which that key alone opens, unreadable immediately. Then we
  delete what it runs and stores, including job output, and within 30 days after that, the rest,
  such as stored secrets. Our servers' own nightly backups, encrypted with each server's key,
  expire within a further 44 days." — <https://withruntime.com/legal/dpa> — docs-confirmed
- Deletion is not always announced: "We do not promise any notice, and deletion does not wait for
  one." … "Deleted data cannot be recovered." — <https://withruntime.com/legal/terms> —
  docs-confirmed
- And the blunt version, which belongs in any buyer's checklist: "**A sandbox is not a backup.**
  Storage on the Services may sit on a single server with no replica. Export anything you cannot
  afford to lose." — <https://withruntime.com/legal/terms> — docs-confirmed

**Notice period for price changes: none is promised for new usage.**

- "**Price changes.** We may change prices. A new price applies to usage after we post it. For a
  resource with a fixed quote, the new price applies from the end of that quote." —
  <https://withruntime.com/legal/terms> — docs-confirmed
- The pricing page describes a softer practice for stored items, not a contractual notice period:
  "Each item's rate is fixed when you make it, and a new price reaches it only from a date
  announced ahead." — <https://withruntime.com/pricing> — pricing-page. Read together: new usage
  can be repriced immediately on posting; already-quoted resources run to the end of their quote;
  the "announced ahead" line is a practice for existing stored items, not a term.
- **A specific number of days' notice before a price rise: not-published.**

**Other terms a buyer should know before signing:**

| Term | What it says | Source | Tag |
|---|---|---|---|
| Refunds | "For 15 days after a purchase of credit, you may ask us to refund the part of that purchase that is neither spent nor reserved by a resource that is still running." | <https://withruntime.com/legal/terms> | docs-confirmed |
| Credit expiry | "Purchased credit expires 12 months after your most recent purchase of credit." | same | docs-confirmed |
| Service changes | "We may add, change, limit or remove any part of the Services at any time. We try to give notice of a change that removes something you are likely to depend on, but we do not promise to." | same | docs-confirmed |
| Terms changes | "For a change that materially reduces your rights, we give at least 30 days' notice by email or by a notice in your account." | same | docs-confirmed |
| Runtime ending the contract | "We may end this agreement for any reason or none by emailing the account's owners at least 30 days first." | same | docs-confirmed |
| Suspension | "We may suspend or limit your account or any resource immediately and without notice if … your balance is exhausted or a payment is disputed." | same | docs-confirmed |
| Liability cap | "our total liability … is limited to the greater of (a) the amount you paid us for the Services in the 12 months before the event giving rise to the claim and (b) US$1,000." Beta features are capped at US$100. | same | docs-confirmed |
| Law and forum | "Colorado law governs these terms" … "binding arbitration administered by the American Arbitration Association … seated in Denver, Colorado", with a class-action waiver, a one-year limit on claims and a 30-day arbitration opt-out. | same | docs-confirmed |
| Publicity | "We may name you as a customer and show your name and logo" unless you email legal@ to opt out. | same | docs-confirmed |
| Tax records | "Billing and tax records: seven years." | <https://withruntime.com/legal/privacy> | docs-confirmed |

### Cross-check against battleships.dev's company block

battleships.dev records: "Ownership: independent", "Stage: unknown", "Accelerators: none found",
"Total raised: unknown", "Revenue: unknown", and a note that the YC directory's "Runtime" is a
different company. — <https://battleships.dev/data/providers/withruntime.md> — third-party

| battleships.dev | What I found | Verdict |
|---|---|---|
| "Ownership: independent" | Runtime LLC contracts directly; no parent or investor disclosed | **Consistent**, but "independent" is an inference from silence, not a published fact. |
| "Stage: unknown", "Total raised: unknown" | Nothing published; searches return unrelated "Runtime" companies | **Correct.** |
| "Accelerators: none found" | No accelerator badge or programme mention on any page | **Correct.** |
| YC "Runtime" is a different company | Confirmed: it is runtm.com, YC Spring 2026, and Runtime's own JSON-LD disambiguates against it | **Correct**; worth adding that the other Runtime is YC-backed and also agent infrastructure, which makes the confusion likelier. |
| "Revenue: unknown" | Nothing published | **Correct.** |

### What stays not-published about the company

Founders and leadership names; headcount; state of formation and registration number; the LLC's
founding date; funding stage, amount, investors and any accelerator; any parent company or change
of control; a Runtime-owned SOC 2 or ISO certificate; support hours and response-time targets; and
a specific notice period for price increases.


---

## Source index

Vendor (retrieved 28 October 2026): <https://withruntime.com/> · <https://withruntime.com/llms.txt> ·
<https://withruntime.com/llms-full.txt> · <https://withruntime.com/pricing> ·
<https://withruntime.com/docs/pricing> · <https://withruntime.com/docs/plans> ·
<https://withruntime.com/docs/included-usage> · <https://withruntime.com/docs/limits> ·
<https://withruntime.com/docs/api> · <https://withruntime.com/docs/start> ·
<https://withruntime.com/docs/products> · <https://withruntime.com/docs/sandbox-environment> ·
<https://withruntime.com/docs/security> · <https://withruntime.com/docs/trust> ·
<https://withruntime.com/docs/storage> · <https://withruntime.com/docs/networking> ·
<https://withruntime.com/docs/egress> · <https://withruntime.com/docs/images> ·
<https://withruntime.com/docs/jobs> · <https://withruntime.com/docs/mcp> ·
<https://withruntime.com/docs/observability> · <https://withruntime.com/docs/editors> ·
<https://withruntime.com/docs/identity-tokens> · <https://withruntime.com/docs/teams> ·
<https://withruntime.com/docs/single-sign-on> · <https://withruntime.com/docs/speed> ·
<https://withruntime.com/docs/reservations> · <https://withruntime.com/docs/changelog> ·
<https://withruntime.com/docs/feedback-and-support> · <https://withruntime.com/about> ·
<https://withruntime.com/status> · <https://withruntime.com/status.json> ·
<https://withruntime.com/glossary> · <https://withruntime.com/startups> ·
<https://withruntime.com/legal/terms> · <https://withruntime.com/legal/sla> ·
<https://withruntime.com/legal/privacy> · <https://withruntime.com/legal/dpa> ·
<https://withruntime.com/legal/subprocessors> · <https://withruntime.com/legal/acceptable-use> ·
<https://withruntime.com/.well-known/security.txt>

Third-party: <https://battleships.dev/data/providers/withruntime.json> ·
<https://rdap.verisign.com/com/v1/domain/WITHRUNTIME.COM> ·
<https://rdap.verisign.com/com/v1/domain/HEYRUNTIME.COM> ·
<https://api.github.com/orgs/withruntime> · <https://registry.npmjs.org/withruntime> ·
<https://pypi.org/pypi/withruntime/json> · <https://hn.algolia.com/api/v1/items/50030427> ·
<https://hn.algolia.com/api/v1/items/50001168> · <https://www.ycombinator.com/companies/runtime> ·
<https://www.linkedin.com/company/runtm> ·
<https://battleships.dev/data/providers/withruntime.md> · <https://createos.sh/vs/withruntime> ·
<https://sandbox0.ai/alternatives/withruntime> ·
<https://readassay.com/articles/agent-sandboxes-are-turning-into-a-fork-and-snapshot-price-war/> ·
<https://github.com/withruntime/runtime> · <https://api.github.com/repos/withruntime/runtime> ·
<https://hn.algolia.com/api/v1/search_by_date?query=withruntime.com&restrictSearchableAttributes=url>

# boxd recheck — 2026-11-12

**Provider:** `boxd` · https://boxd.sh · docs https://docs.boxd.sh
**Baseline:** `origin/main` 4432d00 (profile checked 2026-10-28, rate card 2026-10-29)
**Scope:** desk research only. No account, credential, CLI login, machine, snapshot or billable resource was created.
**Verdict:** material changes. CPU is now billed on **active vCPU only** (not the reserved size), the **New York region is live**, there is a public **status page**, self-hosting is **free to 16 worker vCPUs** with an Apache-2.0 installer, and `SOC 2 Type II` / `ISO 27001` are now stated as **in progress**. Unit rates did not move. Six capability verdicts change; no feature verdict changes.

## Bottom line

- **Rate card:** $0.047/vCPU-hour, $0.014/GiB-hour RAM, $0.000096/GiB-hour written disk (EUR €0.039 / €0.012 / €0.00008). The **numbers are unchanged**, but the vCPU meter now charges **only active vCPU**, sampled every second, not the machine's reserved count. That is the single biggest cost-model change: the existing card's `cpu.billing: "allocated"` is now wrong and should be `"active"`.
- **Plans:** Pay as you go (≤100 machines total, ≤8 vCPU / 32 GiB) and **Scale** (same rates, >100, >8/32, BYOC, dedicated support) and **Self-host** (free ≤16 worker vCPUs, yearly licence above) are now three published columns. Custom is no longer a separate published column; Scale carries the old Custom story.
- **Regions:** Frankfurt (`fra`) and **New York (`nyc`)** are both live, one machine per region, same account/bill/secrets. The FAQ and the `/us-waitlist` page still say the US is "coming" — stale pages, not the product.
- **Free tier:** no hosted monthly free usage; $30/€30 one-off credit with a payment method; **self-hosting is free to 16 worker vCPUs** with no key or account. The hosted `free-tier` capability therefore stays `no` (same convention as E2B/Daytona), but `open-source` and `trials-free-tiers` must carry the new free self-host tier.
- **Company:** a public status page now exists at **status-boxd.com** with 90-day per-component uptime and **zero recorded incidents**, but its checks only begin 28 Oct 2026 (16 days of data, not 90). SOC 2 Type II and ISO 27001 are **in progress**, not certified. Still no SLA. Legal entity, terms date (18 Sep 2026) and privacy date (1 Sep 2026) are unchanged.

## Method and sources

| What | How | Result |
|---|---|---|
| Docs index / inventory | `curl https://docs.boxd.sh/llms.txt` | HTTP 200, full page list incl. new **Regions**, **Computer use**, **Mobile**, **Menu bar**, **Filesystem API**, **Self-delete** pages |
| Docs pages | `curl https://docs.boxd.sh/<path>.md` for 60+ pages | HTTP 200 each; quotes below are from these per-page Markdown files, not the lagging `llms-full.txt` |
| Pricing, fresh | Composio **Context** `web_scrape`, `url: https://boxd.sh/pricing`, **`maxAgeMs: 0`** (forced fresh), `formats.markdown` | Succeeded; USD page. `cache_metadata` showed a fresh fetch. Confirmed again with live Chromium |
| Pricing, both currencies | **agent-browser** Chromium, viewport 1280×900 @2x, loaded `https://boxd.sh/pricing` live, clicked the **EUR** / **USD** toggle buttons, full-page screenshots | Succeeded; USD `$0.047/$0.014/$0.000096`, EUR `€0.039/€0.012/€0.00008`; `$30`/`€30` credit; PAYG "Up to 100", "Up to 8 vCPU · 32 GiB"; Scale "More than 100", "Above 8 vCPU · 32 GiB"; self-host "No limit" / "Try it free · up to 16 vCPUs" |
| Pricing HTML | `curl -D` | HTTP/2 200, `date: Thu, 12 Nov 2026 09:56:02 GMT`, 93,558 bytes; schema.org `Offer` prices 0.047 / 0.014 / 0.000096 |
| Homepage, FAQ, terms, privacy, self-hosting | `curl` + tag-strip | HTTP 200 each; terms "Last updated: 18 September 2026", privacy "Last updated: 1 September 2026" |
| Status | `curl https://status-boxd.com/`, `/history`, `/api/v1/status`, `/api/v1/incidents`, `/feed.atom` | HTTP 200; 90-day API; `incidents: []`; Atom feed empty (`updated` 1970-01-01) |
| GitHub / licence | GitHub REST API + raw README/LICENSE | `boxd-sh/self-host`, public, Apache-2.0, created 2026-10-21, pushed 2026-11-12; binaries under PolyForm Internal Use 1.0.0 |
| Changelog | probed `/changelog`, `/changelog/`, `docs.boxd.sh/changelog`, `/changelog.md`, `/whats-new` | all **404**; no changelog page. Blog is the release-notes surface; one new post since baseline (9 Nov). GitHub Releases is the dated version feed for self-host |
| Quote audit | script: fetch each cited URL, normalize whitespace/Markdown/HTML entities, substring-match every quote in this file | see "Quote audit" at the end |

Tools that actually succeeded: **Context `web_scrape`** (fresh pricing), **agent-browser** Chromium (live pricing, both currency toggles, screenshots), **curl** (all provider Markdown/HTML/API), **GitHub REST API**. TinyFish was discovered and connected but not needed; Parallel/Exa/Tavily/Firecrawl were not called because Context + curl covered every page. No Amp native `web_search`/`read_web_page` fallback was used.

---

## 1. Features (16)

All 16 features keep their current verdict. Twelve notes/figures need material edits: `sizes-regions`, `lifecycle`, `idle-timers`, `reaching-it`, `custom-domains`, `keys-secrets`, `ways-to-drive`, `built-in-agents`, `teams-accounts`, `billing-models`, `trials-free-tiers`, `company`. The rest are unchanged.

- **isolation** — `yes` — KVM microVM with its own kernel, network stack and disk; root + passwordless sudo; Docker Engine/Compose/Buildx preinstalled and running; systemd, kernel modules, `/etc`, ports and breaking the OS all stay inside. Nested virtualisation is still not documented; no GPU/ARM. [docs](https://docs.boxd.sh/use-cases/sandboxes) · "Every boxd machine is a KVM microVM with its own kernel, network stack, and disk." · **unchanged**.

- **sizes-regions** — `partly` — Four fixed sizes: 1 vCPU / 4 GiB, 2 / 8 (default), 4 / 16, 8 / 32; fixed 100 GB disk; 8 / 32 is the self-serve ceiling and anything larger is the **Scale** column. **Two regions now: Frankfurt (`fra`) and New York (`nyc`)**, picked per machine, same account/bill/secrets. No GPU, no ARM, no configurable CPU/RAM. Resize reboots. [docs](https://docs.boxd.sh/guides/resources) · "This is the largest size a single machine may have, 8 vCPU / 32 GiB unless the boxd team raised it for your org." · **changed**: one EU region → EU + US; figure 8 vCPU / 32 GiB; one EU region is now wrong. Verdict stays `partly` for the size ceiling, no GPU and no ARM, not for regions.

- **lifecycle** — `yes` — running, standby (memory kept in host RAM, sub-millisecond resume), hibernated (memory written to disk, docs say ~85 ms), stopped (disk only, fresh boot), destroy. Disk survives every sleep/stop. Runtime unlimited. [docs](https://docs.boxd.sh/guides/suspend-resume) · "Waking from hibernation takes **about 85ms** and loads the memory image back into RAM." · **changed (minor)**: the pricing page now says a hibernated machine is back to running in **156 ms**, and boxd's own 29 Oct measurement says "app answers in 156 ms median (104–213 ms, n=10)". 85 ms is memory restore, 156 ms is the app answering; the figure/note should carry both. The 156 ms measurement is [llms.txt](https://boxd.sh/llms.txt) · "A hibernated machine answered an HTTPS request with its app still running in 156 ms median (104–213 ms, n=10)."

- **snapshots-forks** — `yes` — snapshot = named, versioned copy of disk **and** memory, must be taken while running, new machines resume already running (measured **1.19 s** to first HTTPS response); checkpoint = in-place undo point; backup = disk-only, off-cluster, off by default; fork = live copy of memory, disk and processes in **under 200 ms**, source pauses for a fraction. Older snapshot versions are discarded. Templates are snapshots (plus per-team default snapshots). [docs](https://docs.boxd.sh/guides/fork) · "up in under 200ms" · **unchanged** (new 1.19 s measurement and team default snapshots are supporting detail).

- **storage** — `yes` — fixed 100 GB copy-on-write disk per machine, billed on bytes written in every state; standalone disks outlive the machine, attach to one machine at a time, live on one host and in one region; no S3/object mount; 100 GB qualifies as a large disk. [docs](https://docs.boxd.sh/guides/resources) · "Disk | 100 GB, fixed (copy-on-write)" · **unchanged** (disks are now region-scoped; no verdict effect).

- **idle-timers** — `yes` — auto-hibernate **on by default, 4 h** without TCP/UDP traffic **in either direction**; auto-suspend off by default; both timeouts settable per machine and as org defaults, `0` = never; `idle.ignore-outbound` makes only inbound connections count; clocks freeze while asleep; a hibernated machine does **not** wake on a raw port forward (roadmap). Runtime unlimited. [docs](https://docs.boxd.sh/guides/suspend-resume) · "**On by default, set to 4 hours.** After 4 hours without TCP/UDP traffic in either direction, boxd hibernates the machine" · **changed**: new `idle.ignore-outbound` / org-default controls and the raw-port wake caveat; homepage FAQ says "no inbound traffic" while docs say either direction (contradiction below).

- **reaching-it** — `yes` — every machine gets `<machine>.boxd.sh` (New York: `<machine>.nyc.boxd.sh`), public, no sign-in; bot protection is a wake gate only (503 to webhooks/API clients); real SSH on a dedicated port; console web terminal; 3 raw TCP/UDP forwards on 40000–60000; `ssh -L` tunnels; **Tailscale or NetBird can make every name tailnet-only**, org-wide. [docs](https://docs.boxd.sh/guides/https) · "Every machine gets a domain at `<machine>.boxd.sh`" · **changed (note)**: private networking now documented as an org-wide option; raw ports don't wake a hibernated machine. Verdict unchanged.

- **custom-domains** — `yes` — per-machine domain or org-wide wildcard subdomain; both self-serve; boxd verifies DNS and issues TLS automatically; one wildcard per region; a per-machine domain points at the public IP, so it does not follow a Tailscale/NetBird tailnet. [docs](https://docs.boxd.sh/guides/custom-domains) · "Both are self-serve. boxd verifies your DNS and issues TLS certificates automatically." · **changed (note)**: org wildcard is now **per region**; per-machine domains stay public under Tailscale. Verdict unchanged.

- **outbound-network** — `yes` — open by default; per-machine allowlist of hostnames, wildcards, IPv4 and CIDR ranges, **256 entries**, `none` = no internet; enforced outside the guest, DNS follows it, IPv6 refused; no static egress IP published; egress price/allowance unpublished. [docs](https://docs.boxd.sh/guides/egress) · "An allowlist of just `none` cuts the machine off from the internet entirely." · **unchanged** (more detail on 256 entries/IPv6 in the row note).

- **keys-secrets** — `yes` — org env vars and sealed secrets in `shared` / `private` / `all` scopes, plus **`unattached` / `private-unattached`** secrets that reach only machines whose spec names them; host-bound secrets keep the real value outside the machine (`bxds_` placeholder, HTTPS substitution only for named hosts, 16 MiB body limit); API keys are member or org kind, org-fenced, optionally expiring, **no per-key scopes**. [docs](https://docs.boxd.sh/guides/egress) · "Inside the machine `STRIPE_KEY` is an opaque string starting with `bxds_`." · **changed (note)**: unattached secret scopes are now documented. Verdict unchanged.

- **ways-to-drive** — `partly` — **the console now has a New machine dialog** (Name, Region, Start from snapshot, Size, Isolated) and the macOS menu bar opens the same dialog; plus CLI (macOS, Linux, Windows), Python and TypeScript SDKs, gRPC API, real SSH, web terminal, browser desktop, PTY exec and a file API. Still **no REST/JSON API** and **no boxd-control MCP server**. [docs](https://docs.boxd.sh/guides/menu-bar) · "**New machine**, at the bottom of the menu, is the console's New machine dialog" · **changed**: `dashboard-create` moves `no → yes`; the figure `No; CLI` is obsolete. Verdict stays `partly` for REST + MCP, not for the dashboard.

- **built-in-agents** — `yes` — Claude Code, Codex and OpenCode preinstalled on every machine; the in-VM `boxd` CLI is pre-authenticated so an agent can create sibling machines; **Claude and Codex logins are now org-level** and served to every private machine and fork, OpenCode is per-machine; no prompt/agent-loop API; browser (`agent-browser`), desktop and **computer-use** API included. [docs](https://docs.boxd.sh/use-cases/coding-agents) · "Every boxd machine ships with three coding agents" · **changed (note)**: Codex login was per-machine at baseline, now org-level like Claude; computer use is new. Verdict unchanged.

- **teams-accounts** — `partly` — every account is an organisation; roles **owner / admin / member** plus **team admin**; **teams** with an optional default snapshot; org API keys outlive the person; machines can be created for another member (`assignTo`); **SAML SSO only on Enterprise (ask)**, OIDC SSO built into self-host; **audit logs only on Custom/self-host**; **no hard spend cap and no usage alerts**; data residency per region (Frankfurt EU, New York US), account/org data replicated to every region used. [docs](https://docs.boxd.sh/cli/commands) · "An org has three roles: **owner**, **admin**, and **member**." · **changed (note)**: teams, team default snapshots and per-region residency are new/documented; spend controls still absent. Verdict unchanged.

- **billing-models** — `partly` — prepaid credits, no plan fee, no seats; metered per second, settled every 15 minutes; three meters: **active vCPU** $0.047/vCPU-h, **resident RAM** $0.014/GiB-h (running or standby), **written disk** $0.000096/GiB-h (every state); no minimum; egress and snapshot/backup/volume storage still unpublished. [pricing](https://boxd.sh/pricing) · "You only pay for active vCPU, not for the vCPUs your machine reserves." · **changed**: CPU basis **allocated → active**; the scenario's line that a waiting box pays for what it holds is now true only of RAM/disk, not CPU. Verdict stays `partly` because storage/egress prices are still missing.

- **trials-free-tiers** — `partly` — **$30 / €30 one-off credit** when a payment method is added; nothing charged at card add; no hosted monthly free allowance; an org without a payment method is capped at **2 machines**; **self-hosting is free up to 16 worker vCPUs**, no licence key, no account, telemetry on, paid yearly licence above. [pricing](https://boxd.sh/pricing) · "$30 of credits when you add a payment method." (USD toggle) · **changed**: new permanent free self-host tier (≤16 worker vCPUs). The managed product still has only a one-off credit, so the verdict stays `partly`.

- **company** — `partly` — **Azin Tech Operating Company B.V.**, KvK 99718340, RSIN 869104743, VAT NL869104743B01, Westerstraat 246-2, 1015 MT Amsterdam; registered **5 Feb 2026** (Drimble/KvK; the same-address **Azin Tech Holding Company B.V.**, KvK 99712768, was registered the same day); **€2M pre-seed** led by BlueYard, announced **16 Sep 2026** (boxd says €2 million; [tech.eu](https://tech.eu/2026/09/16/boxd-raises-2m-to-build-cloud-infrastructure-for-ai-coding-agents) says **$2 million** and names the same three founders); three founders (Michiel Voortman, Laurentiu Ciobanu, Hidde Kehrer) plus a named **founding engineer, Jonny Serban** (blog, 9 Nov 2026); headcount still unpublished. **Status page: status-boxd.com**, 90-day per-component uptime, **zero incidents recorded**, checks start **28 Oct 2026** (so 16 days, not 90). **No SLA**; Terms §4.5 says commercially reasonable efforts only. **SOC 2 Type II and ISO 27001 in progress**, no certification; DPA available. Two regions, Frankfurt (EU) and New York (US); privacy notice still names **Latitude.sh LLC (Delaware)** for both clusters; machine data in its region, account/org data in every region used. Price changes immediate for new usage; content may be deleted after 30 days. [terms](https://boxd.sh/terms/) · "“Boxd”, “we”, “us” or “our” means Azin Tech Operating Company B.V. (KvK 99718340, RSIN 869104743, VAT NL869104743B01), with its corporate seat in Amsterdam" · **changed**: status page exists; SOC 2/ISO 27001 in progress; New York region; named founding engineer. Verdict stays `partly` (no SLA, no certification, no published headcount).

---

## 2. Capabilities (78)

Format: `id` — verdict — figure/specifics. Source · quote · change. Unchanged rows are one line. Six verdicts change: **choose-region**, **active-cpu**, **schedules**, **private-url**, **dashboard-create**, **status-page**. Several notes/figures change without a verdict change.

### Isolation (5)

- **own-vm** — `yes` — KVM microVM, own kernel, network stack and disk. [sandboxes](https://docs.boxd.sh/use-cases/sandboxes) · "Every boxd machine is a KVM microVM with its own kernel, network stack, and disk." · unchanged.
- **root** — `yes` — `boxd` user with passwordless sudo. [quickstart](https://docs.boxd.sh/quickstart) · "You get a normal shell on the machine, as the `boxd` user with passwordless sudo." · unchanged.
- **docker-inside** — `yes` — Docker Engine, Compose and Buildx preinstalled; daemon running; user in `docker` group. [run-docker](https://docs.boxd.sh/guides/run-docker) · "Docker Engine, Compose, and Buildx come pre-installed on every machine, with the daemon already running." · unchanged.
- **nested-virt** — `not-published` — docs list Docker, kernel modules and systemd, never VMs inside; self-host **workers** need nested virtualisation, but guest support is unstated. [sandboxes](https://docs.boxd.sh/use-cases/sandboxes) · "Code in the sandbox can run Docker, load kernel modules, restart `systemd`, edit `/etc`, open ports, and break the OS completely" · unchanged.
- **custom-image** — `partly` — no self-serve image field; the documented path is customise a machine then snapshot it. **New:** the FAQ says a different distro/base container image works, but "We set it up with you for now." [faq](https://boxd.sh/faq/) · "The distro, yes. Machines boot from a container image, so a base like SUSE with your packages works. We set it up with you for now." · **changed**: baseline shortfall said you cannot bring a Docker image; now a custom base image is possible via boxd support, so the shortfall is no self-serve image field — snapshot your setup, or ask boxd to boot your base image.

### Sizes and regions (6)

- **any-size** — `no` — four fixed sizes; naming either dimension picks the pair; any other value is refused. [resources](https://docs.boxd.sh/guides/resources) · "A machine comes in one of four sizes. Naming either dimension picks the size, so `--vcpu 1` means 1 vCPU with 4 GiB." · unchanged.
- **big-machines** — `yes` — 8 vCPU / 32 GiB is the largest standard size; larger by request/Scale. [resources](https://docs.boxd.sh/guides/resources) · "| 8 | 32 GiB |" · unchanged.
- **live-resize** — `no` — a running machine reboots to apply a new size; stopped picks it up at next start. [resources](https://docs.boxd.sh/guides/resources) · "A running machine reboots to apply it, so its disk persists and running processes are lost." · unchanged.
- **gpu** — `no` — no GPU shape, price or availability anywhere; the size table stops at 8 vCPU / 32 GiB. [resources](https://docs.boxd.sh/guides/resources) · "This is the largest size a single machine may have, 8 vCPU / 32 GiB unless the boxd team raised it for your org." · unchanged.
- **choose-region** — **`yes`** — **Frankfurt (`fra`) or New York (`nyc`), picked per machine** from CLI (`--region`), console, SDKs or `BOXD_REGION`; names unique within a region; default is org default else closest (SDK: Frankfurt). [regions](https://docs.boxd.sh/guides/regions) · "Run machines in Frankfurt or New York. Pick the region per machine, with one login, one bill and the same secrets in both." · **changed `no → yes`**; the old shortfall (There is one region, in Germany, and no way to choose another) is obsolete.
- **eu-region** — `yes` — Frankfurt, Germany; machine disk, memory, snapshots, checkpoints and backups stay in that region. [faq](https://boxd.sh/faq/) · "Machines in Frankfurt, and their data, stay in the EU." · **changed quote only** (the baseline FAQ said so your machines and their data stay in the EU); verdict same.

### Lifecycle (3)

- **pause-memory** — `yes` — standby freezes memory in host RAM; hibernate writes the memory image to disk; both restore processes and sockets. [suspend-resume](https://docs.boxd.sh/guides/suspend-resume) · "Next to `running`, boxd has two sleep states: `standby` keeps the memory in RAM, and `hibernated` writes it to disk." · **changed quote only** (docs added a colon; meaning same).
- **warm-pool** — `no` — no pre-started pool; machines are created or woken on demand. A snapshot boots in ~6 ms, but that is fast creation, not a kept pool. [suspend-resume](https://docs.boxd.sh/guides/suspend-resume) · "A machine moves between these states on its own, based on network traffic." · unchanged (`inferred`).
- **fast-start** — `yes` — new machine under 10 ms; standby resume sub-millisecond; hibernate ~85 ms (app answers 156 ms). [suspend-resume](https://docs.boxd.sh/guides/suspend-resume) · "The first inbound packet (an SSH connection, an HTTP request, even a single TCP SYN) wakes it in **sub-millisecond** time." · unchanged.

### Snapshots and forks (6)

- **snapshot-files** — `yes` — a named snapshot keeps disk and memory; the machine must be running when saved. [snapshots](https://docs.boxd.sh/guides/snapshots) · "A snapshot is a saved copy of a specific machine. It captures the disk and the memory" · unchanged.
- **snapshot-memory** — `yes` — a machine from a snapshot resumes with processes still running, same PID and uptime; measured **1.19 s** to first HTTPS response. [snapshots](https://docs.boxd.sh/guides/snapshots) · "A machine created from a snapshot resumes in the state you captured. Nothing boots." · **changed figure**: baseline figure Under 200 ms was a fork number; use Memory + disk (and 1.19 s in the note), not 200 ms.
- **fork-running** — `yes` — 100–200 ms live copy of memory, disk and processes; source pauses a fraction of a second and keeps running. [fork](https://docs.boxd.sh/guides/fork) · "up in under 200ms" · unchanged.
- **older-snapshot** — `no` — saving over a name replaces the version; older versions are cleaned up and cannot be restored or pinned. [snapshots](https://docs.boxd.sh/guides/snapshots) · "Older versions are cleaned up and cannot be restored or pinned." · unchanged.
- **templates** — `yes` — a snapshot is the image mechanism; create as many machines as you want, plus per-team default snapshots. [snapshots](https://docs.boxd.sh/guides/snapshots) · "Make as many as you want from the same snapshot." · unchanged.
- **backups** — `yes` — disk-only to object storage, off the cluster; off by default; per-machine schedule; 15-minute floor; default 7-day retention; restore in place. [cli/commands](https://docs.boxd.sh/cli/commands) · "Backups are off by default and set per machine." · unchanged.

### Storage (5)

- **files-survive-stop** — `yes` — stop keeps the disk and loses memory/processes; start boots from the disk. [suspend-resume](https://docs.boxd.sh/guides/suspend-resume) · "It keeps its disk and loses its memory and running processes" · unchanged.
- **volumes** — `yes` — standalone disks outlive the machine, attach/detach by name, one region, host-affine. [disks](https://docs.boxd.sh/guides/disks) · "A disk is standalone storage that outlives the machine it is attached to." · unchanged.
- **shared-volume** — `no` — one attachment at a time; the holder opens it read-write, so a second writer would conflict. [disks](https://docs.boxd.sh/guides/disks) · "One attachment at a time." · unchanged.
- **mount-buckets** — `no` — no S3/object bucket or outside filesystem mount; backups go to object storage but are not mounted. [disks](https://docs.boxd.sh/guides/disks) · "A disk is standalone storage that outlives the machine it is attached to." · unchanged (`inferred`).
- **big-disk** — `yes` — fixed 100 GB per machine, plus detachable disks (`--size 10G` and up); no published maximum. [resources](https://docs.boxd.sh/guides/resources) · "Disk | 100 GB, fixed (copy-on-write)" · unchanged.

### Idle timers (4)

- **stay-on** — `yes` — no session limit; auto-hibernate after 4 h without traffic; set the timeout to `0` for never; hibernated/stopped machines keep counting toward the machine quota. [resources](https://docs.boxd.sh/guides/resources) · "| Runtime | Unlimited |" · unchanged.
- **choose-idle** — `yes` — auto-suspend and auto-hibernate timeouts are per-machine and settable in seconds, `0` = off; org defaults apply to new and existing machines; `idle.ignore-outbound` changes what counts. [suspend-resume](https://docs.boxd.sh/guides/suspend-resume) · "# never hibernate this machine" · unchanged (org-default controls are new detail).
- **wake-on-request** — `yes` — any inbound packet wakes standby; a new HTTPS, SSH or `boxd machine exec` connection wakes hibernation. **A raw port forward does not wake a hibernated machine**; it does wake standby. [suspend-resume](https://docs.boxd.sh/guides/suspend-resume) · "A hibernated machine wakes on the next connection that comes through boxd" · **changed quote** (the old sentence They wake automatically on the first inbound packet is gone); the raw-port exception is new detail, verdict same.
- **schedules** — **`yes`** — `every(...)` / event triggers in a `*.run.ts` automation are held by the platform; boxd wakes a standby or hibernated machine shortly before a cron slot and delivers events (held up to 15 min while waking); crashes retry with backoff; TS only for now; isolated machines get no automations. [automations/jobs](https://docs.boxd.sh/guides/automations/jobs) · "The platform holds the next time any `every(...)` on the machine is due and wakes a sleeping machine, on standby or hibernated, shortly before it." · **changed `partly → yes`**; the old shortfall (a schedule runs inside the machine, so it only fires while that machine is awake) is contradicted by the platform-held schedule and by [integrations/overview](https://docs.boxd.sh/guides/integrations/overview) ("wakes the machine when a schedule is due").

### Reaching it (6)

- **public-url** — `yes` — every machine gets an HTTPS domain; the URL is public to the internet; no auth in front of a running machine. [share-a-vm](https://docs.boxd.sh/guides/share-a-vm) · "The machine's `https://<machine>.boxd.sh` URL is already public to the internet." · unchanged.
- **private-url** — **`yes`** — an org can be put on **Tailscale or NetBird**; every name (default, subdomain proxies, wildcard domain) then resolves and routes **only inside that tailnet**, and raw ports move too. Setup is by the boxd team, org-wide; off the tailnet the names stop resolving. [tailscale](https://docs.boxd.sh/guides/tailscale) · "Those names now resolve and route only inside your tailnet." · **changed `no → yes`**. Caveats for the note: no per-machine token, one private network per org, and a **per-machine custom domain stays public** (its A record points at boxd's public IP). Sprites' org-token row is the precedent for `yes`.
- **ssh** — `yes` — real SSH server, dedicated port on the shared proxy IP; `scp`, `rsync`, `ssh -L`, Remote-SSH work; can be turned off per machine. [quickstart](https://docs.boxd.sh/quickstart) · "It is real SSH" · unchanged.
- **web-terminal** — `yes` — console terminal session; also in the macOS menu bar. [client-utilities](https://docs.boxd.sh/guides/client-utilities) · "a console terminal" · unchanged.
- **tunnel** — `yes` — local port forwarding works because SSH is real. [quickstart](https://docs.boxd.sh/quickstart) · "It is real SSH, so `scp`, `rsync`, `ssh -L` and your editor's Remote-SSH all work too." · unchanged.
- **raw-tcp** — `yes` — up to **3** raw TCP/UDP forwards per machine, public port allocated from **40000–60000**; TCP default, `--udp` or both. Note: a **hibernated** machine does not wake on a raw port yet (roadmap); keep hibernation off for a database/game server. [port-forwarding](https://docs.boxd.sh/guides/port-forwarding) · "Up to 3 raw port forwards per machine." · **changed note** (wake caveat); verdict stays `yes` because the public port exists and standby wakes on it.

### Custom domains (2)

- **custom-domain** — `yes` — one domain per machine or a wildcard subdomain delegated to the org; self-serve; one org wildcard per region; per-machine domain can't follow a tailnet. [custom-domains](https://docs.boxd.sh/guides/custom-domains) · "Point one domain you own at a single machine" · unchanged.
- **auto-https** — `yes` — DNS verified and TLS certificate issued automatically; HTTP→HTTPS redirect and HSTS. [custom-domains](https://docs.boxd.sh/guides/custom-domains) · "boxd verifies your DNS and issues TLS certificates automatically." · unchanged.

### Outbound network (4)

- **egress-included** — `not-published` — the rate card has three meters only (vCPU, RAM, disk); no outbound price or allowance on pricing, FAQ or the egress guide. Do not assume free. [pricing](https://boxd.sh/pricing) · "each settlement adds up your organization's vCPU, RAM and disk for that window" · unchanged.
- **egress-allowlist** — `yes` — per-machine allowlist of hostnames, wildcards, IPv4 addresses/ranges; **256 entries**; enforced outside the guest, DNS follows it; IPv6 refused because machines have no IPv6 egress. [egress-allowlist](https://docs.boxd.sh/guides/egress-allowlist) · "An allowlist holds at most 256 entries." · unchanged (detail added).
- **no-internet** — `yes` — allowlist `none` cuts the machine off completely; DNS lookups are refused too, so names can't leak data. [egress](https://docs.boxd.sh/guides/egress) · "An allowlist of just `none` cuts the machine off from the internet entirely." · unchanged.
- **static-ip** — `not-published` — no fixed outbound address or price anywhere; battleships' "static egress IP" claim is still unconfirmed. [egress](https://docs.boxd.sh/guides/egress) · "A machine starts unrestricted." · unchanged.

### Keys and secrets (3)

- **secrets-store** — `yes` — org env vars and sealed secrets in `shared` (default), `private`, `all`, plus `unattached` / `private-unattached`; injected into login shells, `exec`, agents and boot services; secrets sealed at rest and never returned. [env-secrets](https://docs.boxd.sh/guides/env-secrets) · "Set an environment variable or a secret **once** for your organization" · unchanged (unattached scopes are new detail).
- **hidden-secrets** — `yes` — host-bound secret: machine holds an opaque `bxds_` placeholder; the real value is substituted into HTTPS requests to named hosts only (URL, header or body); plain HTTP and other hosts get the placeholder; 16 MiB body limit; certificate-pinning clients must trust boxd's CA. [egress](https://docs.boxd.sh/guides/egress) · "Inside the machine `STRIPE_KEY` is an opaque string starting with `bxds_`." · unchanged.
- **scoped-keys** — `partly` — keys are fenced to one org, `member` or userless `org` kind, optional expiry, revocable, raw value shown once; **no per-machine, read-only or permission scopes**. [authentication](https://docs.boxd.sh/cli/authentication) · "Every key is fenced to **one organization** and never grants account-wide access." · unchanged (shortfall: kinds are not scopes).

### Ways to drive (8)

- **dashboard-create** — **`yes`** — the console at app.boxd.sh has a **New machine** dialog: Name (optional), Region, Start from a snapshot, Size (org default, 1/4, 2/8, 4/16) and Isolated; **Create machine** runs `boxd machine new`. The macOS menu bar opens the same dialog. The first-run path still pushes "Download the CLI", but a machine can be started without a terminal. [menu-bar](https://docs.boxd.sh/guides/menu-bar) · "**New machine**, at the bottom of the menu, is the console's New machine dialog" · **changed `no → yes`**. Baseline said the dashboard was a viewer; it has a create flow.
- **cli** — `yes` — official CLI, primary surface, pre-authenticated inside every machine, `--json` throughout. **Now installs on macOS (Apple Silicon), Linux x86_64/arm64 and Windows 10/11 x86_64**; client utilities remain macOS/Linux only. [installation](https://docs.boxd.sh/cli/installation) · "The boxd CLI manages machines from the terminal on your laptop." · **changed note**: Windows is now supported; the FAQ still says "Not yet" (contradiction below).
- **python-sdk** — `yes` — `pip install boxd`; sync and async clients. [python-sdk](https://docs.boxd.sh/reference/python-sdk) · "Programmatic access to boxd machines from Python, sync and async" · unchanged.
- **ts-sdk** — `yes` — `@boxd-sh/sdk`, promise-only ESM, Node 20+/Bun/Deno. [typescript-sdk](https://docs.boxd.sh/reference/typescript-sdk) · "The `@boxd-sh/sdk` package" · unchanged.
- **rest-api** — `no` — the only wire API is **gRPC** (`boxd.api.v1.BoxdApi`, server reflection on); no HTTP/JSON endpoint is documented; the SDKs wrap gRPC. [grpc-api](https://docs.boxd.sh/reference/grpc-api) · "Raw gRPC access to the boxd public API, for any language with a protoc plugin." · unchanged.
- **mcp-server** — `no` — boxd installs **other products'** MCP servers (Linear, Claude, etc.) into Claude Code, Codex and OpenCode; it publishes no MCP server that creates or drives machines. The homepage's "The MCP server installs straight into Claude Code" is the integration's server. [cli/commands](https://docs.boxd.sh/cli/commands) · "install an integration's MCP server into these coding agents" · unchanged.
- **pty** — `yes` — `boxd machine exec --tty` allocates a pseudo-TTY; bidirectional stream; PTY merges stderr into stdout. [cli/commands](https://docs.boxd.sh/cli/commands) · "PTY execs (`--tty`) are the exception." · unchanged.
- **file-api** — `yes` — SDK upload/download and `machines.fs` (read, write, list, stat, mkdir, remove, rename, realpath) with streams; no laptop-side size cap; **machine-to-machine `cp` capped at 1 GB per file**. [machine-filesystem](https://docs.boxd.sh/guides/machine-filesystem) · "Read, write, list and manage files inside a machine from code" · unchanged (1 GB inter-machine cap is new detail).

### Built-in agents (7)

- **agents-preinstalled** — `yes` — **Claude Code, Codex and OpenCode** in the default image, already configured for boxd; the in-VM `boxd` CLI is pre-authenticated. Claude **and Codex** logins are now org-level and served to every private machine and fork; OpenCode is per-machine. [coding-agents](https://docs.boxd.sh/use-cases/coding-agents) · "Every boxd machine ships with three coding agents" · **changed note**: Codex login moved from per-machine disk to org-level (baseline said per-machine); no verdict change.
- **prompt-api** — `no` — no boxd-run agent loop or prompt endpoint; the documented integrations hand the loop to Anthropic or OpenAI. [claude-managed-agents](https://docs.boxd.sh/use-cases/claude-managed-agents) · "Anthropic runs the agent loop." · unchanged.
- **one-click-hermes** — `no` — no Hermes page, template, harness or preinstall; "Any assistant that runs on Linux can live here" and you install it its own way. [personal-assistants](https://docs.boxd.sh/use-cases/personal-assistants) · "Any assistant that runs on Linux can live here." · unchanged.
- **one-click-openclaw** — `no` — OpenClaw is named as the example assistant but is a manual install: create, connect, install, turn bot protection off, turn hibernation off. No template or one-click button. [personal-assistants](https://docs.boxd.sh/use-cases/personal-assistants) · "Run OpenClaw or any other assistant that needs a machine of its own." · unchanged.
- **browser** — `yes` — `agent-browser` with a Chromium build with anti-bot fingerprinting preinstalled; also drives the laptop's Chrome through client utilities. [launch-a-browser](https://docs.boxd.sh/guides/launch-a-browser) · "backed by a Chromium build with anti-bot fingerprinting" · unchanged.
- **desktop** — `yes` — every machine has a display; browser desktop to watch/control; **new computer-use API** (screenshot, click, drag, scroll, type, key, wait) with Claude/OpenAI adapters. [desktop](https://docs.boxd.sh/guides/desktop) · "Every machine has a display." · **changed note**: computer use is a new programmatic surface; verdict same.
- **hosts-other-agents** — `yes` — documented backends for **Claude Managed Agents** and the **OpenAI Agents API**, plus OSS integrations (Pydantic AI, AG2, TanStack AI, Flue, Bindu, Harbor, Crabbox, Zuse, Omnara, Convex, herdr, Scale AI AgentEnv, Paperclip, rakazo, Agent Swarm, Sheprd, Tardigrade, Bast, seekrit). [openai-agents-api](https://docs.boxd.sh/use-cases/openai-agents-api) · "OpenAI runs the Codex harness. Every command runs inside a boxd machine you control." · unchanged (list expanded).

### Teams and accounts (6)

- **team-workspace** — `yes` — every account is an organisation with one credit balance; invite members, share machines, create **teams**; usage across members bills to the org. [pricing](https://boxd.sh/pricing) · "Every account is an organization. Invite your team, share machines, and draw from one credit balance." · unchanged (teams are new detail).
- **roles** — `yes` — **owner / admin / member** at org level, plus **team admin** on a team; owner fixed and transferred by boxd; admins manage members, teams, org keys, unattached secrets and other members' machines. [cli/commands](https://docs.boxd.sh/cli/commands) · "An org has three roles: **owner**, **admin**, and **member**." · unchanged (team admin is new detail).
- **sso** — `partly` — boxd cloud: "Talk to us about SAML SSO for Enterprise" (ask, not self-serve, price unpublished). **Self-host: OIDC SSO built in** (Entra ID, Okta, Google Workspace, Keycloak). [faq](https://boxd.sh/faq/) · "Talk to us about SAML SSO for Enterprise." · **changed shortfall**: baseline said SSO only on Enterprise; now a self-hosted cluster has OIDC SSO on the free tier too. Verdict stays `partly` because cloud SSO is still a sales conversation.
- **spend-cap** — `not-published` — no budget, hard cap or "stop at $X" control in docs, pricing, FAQ or CLI; the only controls are prepaid credits and auto top-up (switchable off). What happens at zero balance with top-up off is not published. [pricing](https://boxd.sh/pricing) · "Credit-based." · unchanged.
- **usage-alerts** — `not-published` — no user-set spend-threshold alert; the console shows a low-credit/out-of-credit banner and `boxd manage usage` reports cost, but no alert amount or channel is published. [pricing](https://boxd.sh/pricing) · "auto top-up adds $20 at a time from that card so your machines keep running" (USD toggle) · unchanged (low-balance banner is not a threshold alert).
- **audit-log** — `partly` — audit logs are named only in the **Custom/self-host** blurb ("SSO + audit logs"); no self-serve audit log, schema, retention or export is documented, and the pricing page no longer lists them at all. [llms-full](https://boxd.sh/llms-full.txt) · "SSO + audit logs" · **changed source/note**: baseline quoted the pricing page, which has dropped the line; the FAQ's SSH-command-history answer is also gone. Verdict stays `partly`.

### Billing models (5)

- **per-second** — `yes` — metered every second, settled every 15 minutes, each component rounded up to the next millionth of the currency; no minimum charge. [pricing](https://boxd.sh/pricing) · "Usage is metered every second and settled every 15 minutes" · unchanged.
- **active-cpu** — **`yes`** — only **active vCPU** is billed, sampled every second; a 2 vCPU machine active 10% of an hour pays 0.2 vCPU-hours; boxd says the fleet average is 10% active; idle vCPU costs nothing. [pricing](https://boxd.sh/pricing) · "You only pay for active vCPU, not for the vCPUs your machine reserves." · **changed `no → yes`**; the old quote (its full vCPU count while it runs) is gone.
- **cheap-pause** — `partly` — **standby** keeps memory in host RAM and bills **RAM + disk** (no vCPU); **hibernate** writes memory to disk and bills disk only; **stop** bills disk only. Pausing is not free; hibernating/stopping is. [pricing](https://boxd.sh/pricing) · "a machine in standby pays for memory and disk" · unchanged (quote wording confirmed).
- **no-monthly-fee** — `yes` — no monthly plan, no per-seat fee; prepaid usage only. [pricing](https://boxd.sh/pricing) · "There is no monthly plan and no per-seat fee." · unchanged.
- **flat-price** — `no` — three separate meters (active vCPU, resident RAM, written disk); no single monthly price per machine. [pricing](https://boxd.sh/pricing) · "Credit-based." · unchanged.

### Trials and free tiers (3)

- **free-tier** — `no` — no hosted monthly free allowance; the only hosted free usage is a **one-off $30 / €30 credit** with a payment method. The **self-hosted** edition is free up to 16 worker vCPUs, but that is your hardware and does not count as a hosted free tier (same convention as E2B and Daytona rows). [pricing](https://boxd.sh/pricing) · "$30 of credits when you add a payment method." (USD toggle) · unchanged verdict, **note** gains the self-host free tier.
- **free-credit** — `yes` — **$30 on the USD list, €30 on the EUR list**, granted when a payment method is added; nothing charged at card add; no expiry published. [pricing](https://boxd.sh/pricing) · "$30 of credits when you add a payment method." (USD toggle) · unchanged.
- **no-card** — `yes` — an org with **no payment method is capped at 2 machines**; a card is not required to create them. **Contradiction:** the agent-facing `llms.txt` says "A new organization also needs a payment method before its first machine", and the console has a separate time-limited "free starter window" state. The docs' 2-machine cap is the model used here. [resources](https://docs.boxd.sh/guides/resources) · "An org without a payment method is capped at 2 machines." · **changed note** (contradiction surfaced); verdict stays `yes`.

### Company (5)

- **status-page** — **`yes`** — **status-boxd.com**: platform (website, console, docs) plus **Frankfurt** and **New York** components (API, machine creation, HTTPS proxy, SSH gateway, backup storage), 90-day uptime, incident history and Atom feed. History and feed are **empty** ("No incidents reported", `incidents: []`). Caveat: checks begin **2026-10-28** (NYC **2026-11-03**), so the "90 days" figures cover 16 and 10 days. [regions](https://docs.boxd.sh/guides/regions) · "The [status page](https://status-boxd.com) shows each region's uptime and incidents." · **changed `not-published → yes`**.
- **sla** — `not-published` — no availability target, credit regime or support-response target in Terms, FAQ or pricing. Terms §4.5 promises only "commercially reasonable efforts" and expressly does not guarantee uninterrupted service; liability is capped at 12 months' fees (§11.2). [terms](https://boxd.sh/terms/) · "Boxd will use commercially reasonable efforts to make the Services available, but does not guarantee uninterrupted or error-free operation." · unchanged.
- **soc2** — `no` — **SOC 2 Type II is "In progress"**, not certified; **ISO 27001 is also "In progress"**; no report or trust centre is published; security details by email. [faq](https://boxd.sh/faq/) · "We're working on both." · unchanged verdict (ISO status added).
- **dpa** — `yes` — a Data Processing Agreement is available today and signed on request; the Privacy Notice also refers to it for customer-content processing. [self-hosting](https://boxd.sh/self-hosting/) · "DPA available today." · unchanged.
- **open-source** — `yes` — **self-hostable**: public `boxd-sh/self-host` repo, **Apache-2.0 installer**, signed release binaries under the **PolyForm Internal Use 1.0.0** licence (binary-only, no distribution/reverse engineering; personal and internal business use permitted). Free up to **16 worker vCPUs**, no key or account; paid yearly licence above; BYOC and air-gapped available. [github](https://github.com/boxd-sh/self-host) · "The installer is open source; the binaries have their own license" · **changed figure/note**: baseline said Annual licence and no licence or repository published; now there is a public repo, an Apache-2.0 installer, a separate binary licence and a free ≤16-vCPU tier. Verdict stays `yes` (the capability explicitly allows self-hostable).

---

## 3. Rate-card inputs (original units)

### Unit rates — unchanged

| Meter | USD list | EUR list | Billed on | States billed |
|---|---:|---|---|---|
| vCPU | **$0.047 / vCPU-hour** | **€0.039 / vCPU-hour** | **active vCPU only**, sampled every second; not the vCPUs reserved | running |
| RAM | **$0.014 / GiB-hour** | **€0.012 / GiB-hour** | memory actually resident; not the provisioned GiB | running, standby |
| Disk | **$0.000096 / GiB-hour** | **€0.00008 / GiB-hour** | bytes written; not the 100 GiB provisioned | running, standby, hibernated, stopped |

Sources: [pricing USD](https://boxd.sh/pricing) · "vCPU $0.047 / hour, active", "RAM $0.014 / GiB-hour, active", "Disk $0.000096 / GiB-hour, written" (USD toggle); [pricing EUR](https://boxd.sh/pricing) (EUR toggle) · "€0.039 / hour, active", "€0.012 / GiB-hour, active", "€0.00008 / GiB-hour, written"; [resources](https://docs.boxd.sh/guides/resources) · "Active vCPU only, memory in use, disk written".

**The one rate-card input that changed: the CPU basis.** The unit rate is the same, but `cpu.billing` must go from `"allocated"` to `"active"`. Boxd's own sentence changed from "vCPU is the one component billed on the machine's size: its full vCPU count while it runs" (28 Oct baseline) to:

> "You only pay for active vCPU, not for the vCPUs your machine reserves. On average only 10% of reserved vCPU is active, and that is all you pay for." — [pricing](https://boxd.sh/pricing)

> "You only pay for active vCPU, sampled every second, not for the vCPUs a machine reserves: a 2 vCPU machine that is active 10% of an hour pays for 0.2 vCPU-hours." — [pricing FAQ](https://boxd.sh/pricing)

The engine already supports `cpu.billing: "active"` (it multiplies by `w.busy`), so this is a data change, not a code change. **No floor is published.**

### What did not change

- Metering: per second; settlement every **15 minutes**; each of the three components rounded up to the next **millionth** of the currency; **no minimum charge per machine**; a partly used window bills only the seconds used.
- No monthly plan, no per-seat fee, no included usage allowance, no minimum purchase.
- Fixed **100 GB** copy-on-write disk per machine; four shapes 1/4, 2/8 (default), 4/16, 8/32; max **8 vCPU / 32 GiB** on Pay as you go (above on Scale).
- Disk billed on written bytes in **every** state; RAM billed in running and standby; vCPU only while running.
- Egress, snapshot, checkpoint, backup and standalone-disk prices **still unpublished**; egress still `null` in the card; no static egress IP.
- VAT excluded ("Prices exclude VAT.").
- Prices identical in both regions ("Billing, credits and usage, at the same rates in every region").

### Plans — changed shape

| Plan | Price | Limits / what it is | Changed? |
|---|---|---|---|
| **Pay as you go** | Same three meters; $0 / €0 fee; **$30 / €30** one-off credit with a payment method | **Up to 100 machines**; **up to 8 vCPU / 32 GiB**; cloud only | Yes: quota/ceiling restated as a plan card; CPU basis now active |
| **Scale** | **Same rates** as PAYG; fee unpublished | **More than 100 machines**; **above 8 vCPU / 32 GiB**; cloud **or BYOC**; dedicated support; **DPA**; **SOC 2 Type II in progress**; **ISO 27001 in progress** | **New** (replaces the old "Custom" column) |
| **Self-host** | **Free up to 16 worker vCPUs**; **yearly licence** above, priced for the size of the cluster | AWS, GCP or any KVM host; no vCPU limit with a licence; air-gapped; support included; same release as cloud | Yes: price model changed from "annual licence, unpublished" to **free ≤16 + paid licence above** |

### Free tier and allowances — changed

- **Hosted:** no recurring free allowance. **$30 / €30 one-off credit** when a payment method is added; nothing charged at card add. Unchanged amount. The homepage still says "Every new account starts with €30 of free credits" without the card condition.
- **Without a card:** an org is capped at **2 machines**; the credit still requires a card. Unchanged in docs; contradicted by `llms.txt` (see below).
- **Self-hosted:** **free up to 16 worker vCPUs**, "no licence key and no sign-up"; memory and disk are yours to size; one hourly telemetry report with counts only, always on the free tier, opt-out with a paid licence; above 16 vCPUs the cluster keeps running but starts no new machines until under the limit or licensed. **New.**
- **Machine limit:** docs say **50 per organization**, applied **per region**; pricing says **"Up to 100"** and its FAQ says **"quota of 100 machines"**. Reconciliation: **50 per region × 2 regions = 100 total**. The `machine-limit request` takes a single `--max-vms` (up to 1000), so whether that number is per region or total is still ambiguous. The old "50 vs 100" caveat should be rewritten, not kept as a flat contradiction.
- **No included egress, snapshot, checkpoint, backup or disk allowance is published.** Do not convert any of these to zero.

### A/B/C inputs — which changed

The presets are unchanged (`a` 2 vCPU / 4 GiB / 10 GiB, 1,000 × 10 min, busy 0.5; `b` 4 vCPU / 8 GiB / 50 GiB, 730 h, busy 0.1; `c` 2 vCPU / 4 GiB / 20 GiB, 90 running + 640 stopped h, busy 0.1). **Only the CPU input changes:**

| Case | Old CPU input | New CPU input |
|---|---|---|
| A | 2 vCPU × $0.047 × 166⅔ h (full 2 vCPU) | 2 × 0.5 = **1 active vCPU** × $0.047 × 166⅔ h |
| B | 4 vCPU × $0.047 × 730 h (full 4 vCPU) | 4 × 0.1 = **0.4 active vCPU** × $0.047 × 730 h |
| C | 2 vCPU × $0.047 × 90 h (full 2 vCPU) | 2 × 0.1 = **0.2 active vCPU** × $0.047 × 90 h |

RAM and disk inputs are **unchanged**: A 4 GiB resident / 2 GiB written; B 8 GiB (or 16 GiB full shape) resident / 50 GiB written; C 4 GiB (or 8 GiB) resident / 20 GiB written, 90 h running + 630 h stopped, disk billed in both. `between: "kept"`, no plan fee, no minimum, no free allowance. The shapes chosen (A 2/8, B 4/16, C 2/8) are unchanged.

**Existing test expectation:** `site/src/lib/cost.test.ts` has `["boxd", "b", 222.5]`, built on allocated CPU. It will fail with `billing: "active"`; the parent must redo it from the page (the new CPU line is 4 × 0.047 × 730 × 0.1 = $13.724; the RAM and disk lines are unchanged). Do not bless 222.5.

### Pricing-page arithmetic checks (not A/B/C)

The new per-size table is internally consistent with full active vCPU, full RAM and 100 GiB written:

| Size | Running | Always on | Standby | Hibernated |
|---|---:|---:|---:|---:|
| 1 vCPU / 4 GiB | $0.11/h | $82.20/mo | $0.07/h | $0.0096/h |
| 2 vCPU / 8 GiB (default) | $0.22/h | $157.39/mo | $0.12/h | $0.0096/h |
| 4 vCPU / 16 GiB | $0.42/h | $307.77/mo | $0.23/h | $0.0096/h |
| 8 vCPU / 32 GiB | $0.83/h | $608.53/mo | $0.46/h | $0.0096/h |

Check: 2 × 0.047 + 8 × 0.014 + 100 × 0.000096 = 0.2156/h × 730 = $157.39. Standby: (8 × 0.014 + 100 × 0.000096) = 0.1216/h, shown rounded as $0.12/h; × 730 = $88.77. Hibernated: 100 × 0.000096 = $0.0096/h; × 730 = $7.01/mo. The lifecycle example with 20 GiB written gives $1.40/mo (20 × 0.000096 × 730 = $1.402). All consistent; the table is a maximum-cost illustration, not a typical bill.

The calculator's default example (2 vCPU / 8 GiB, 8 h/day, 10% active, 2 GiB, 20 GiB disk) shows **$10.50/mo** and line items 49 vCPU-h / 487 GiB-h RAM / 14,600 GiB-h disk. Check: 49 × 0.047 = $2.303; 487 × 0.014 = $6.818; 14,600 × 0.000096 = $1.4016; total $10.52 (rounding). Fine.

### Rate-card fields to touch (for the parent)

- `cpu.billing`: `"allocated"` → `"active"`; `cpu.rate` stays `0.047`.
- `summary`: mention active vCPU, resident RAM, written disk.
- `notes`: add "only active vCPU is billed, sampled per second; boxd says 10% of reserved vCPU is typical"; add self-host free ≤16 vCPU; keep the egress/storage unknowns.
- `plans`: keep the $0 Pay as you go plan; consider a `Scale` note (same rates, >100 machines, >8/32, BYOC) and a `Self-host` note (free ≤16 vCPU, licence above). Do **not** add a monthly fee: none is published.
- `checkedOn`: advance to `2026-11-12` for the card actually reread; provider profile `checkedOn` to `2026-11-12` only for the pages reread (all profile sources were reread except the third-party company pages; the profile's own facts were rechecked against first-party pages).
- `sources`: add `https://docs.boxd.sh/guides/regions`, `https://boxd.sh/self-hosting/`, `https://status-boxd.com/`, `https://docs.boxd.sh/guides/regions` (and the GitHub repo if the licence is cited).
- `upkeep`: unchanged; the desktop/snapshot image sentence still holds.

---

## 4. Contradictions between first-party pages

Each row gives both sides verbatim. "Model uses" is the interpretation this recheck recommends; it is not a claim that the other page is wrong.

### 4.1 The US region is both live and "coming"

| Side A — live | Side B — coming |
|---|---|
| [regions](https://docs.boxd.sh/guides/regions): "boxd runs in two regions, and every org can use both." / "Run machines in Frankfurt or New York. Pick the region per machine, with one login, one bill and the same secrets in both." | [FAQ](https://boxd.sh/faq/): "It's coming. Join the waitlist at boxd.sh/us-waitlist." |
| [FAQ](https://boxd.sh/faq/), same page, "Where do my machines run?": "On bare-metal servers in two regions: Frankfurt, Germany, and New York." | [us-waitlist](https://boxd.sh/us-waitlist/): "We're opening a cluster in the US. Vote where we open first." / "★ Waitlist open ★" |
| [status](https://status-boxd.com/): a **North America (New York City)** group with API, machine creation, HTTPS proxy, SSH gateway and backup storage, checks from **2026-11-03**. | [pricing](https://boxd.sh/pricing): Scale "Runs in Our cloud or BYOC", both regions implied; no US-coming note. |

**Model uses:** New York is **live**; the FAQ's "Is there a US region?" answer and the `/us-waitlist` page are stale. This is the single clearest first-party inconsistency in the recheck. Do not restore "US announced but not open" from the baseline. Do not invent a launch date: the earliest first-party artefact is the **3 November 2026** start of NYC status checks and the **v2026.11.03** self-host release; no announcement post exists.

### 4.2 Is 8 vCPU / 32 GiB self-serve?

| Side A — yes | Side B — email us |
|---|---|
| [pricing](https://boxd.sh/pricing): Pay as you go "Size **Up to 8 vCPU · 32 GiB**"; the calculator has an 8 vCPU / 32 GiB button; the 8/32 row has a price ($0.83/h, $608.53/mo). | [FAQ](https://boxd.sh/faq/): "Machines come in 1 vCPU / 4 GiB, 2 vCPU / 8 GiB (the default) and 4 vCPU / 16 GiB, and you can pick any of them yourself. For 8 vCPU / 32 GiB or larger, email contact@boxd.sh." |
| [resources](https://docs.boxd.sh/guides/resources): size table includes "\| 8 \| 32 GiB \|"; quota is "8 vCPU / 32 GiB unless the boxd team raised it for your org". | [menu-bar](https://docs.boxd.sh/guides/menu-bar): the console **New machine** dialog offers "1 vCPU and 4 GiB, 2 vCPU and 8 GiB, or 4 vCPU and 16 GiB" — no 8/32. |

**Model uses:** 8 vCPU / 32 GiB is the **documented ceiling** and the CLI/SDK can create it if the org quota allows; the console dialog and the FAQ's "email us" describe the practical self-serve path (up to 4/16, 8/32 by request). The `big-machines` verdict stays `yes` either way; the sizes-regions note should say "8/32 is the quota ceiling, not the console default".

### 4.3 The machine quota: 50, 100, or 50 per region?

| Side A — 50 | Side B — 100 |
|---|---|
| [resources](https://docs.boxd.sh/guides/resources): "\| Machines \| 50 per organization (your default org included) \|" | [pricing](https://boxd.sh/pricing): "Machines **Up to 100**" on Pay as you go |
| [FAQ](https://boxd.sh/faq/): "50 per organization to start, including forks and hibernated machines." | [pricing FAQ](https://boxd.sh/pricing): "Each organization starts with a quota of 100 machines; email contact@boxd.sh to raise it or to get larger shapes than the default 2 vCPU / 8 GiB." |
| [resources](https://docs.boxd.sh/guides/resources): "the machine limit applies in each region on its own" | [llms-full](https://boxd.sh/llms-full.txt): "100 machines per organization, raiseable on request" |

**Model uses:** the limit is **50 per region**, so **100 across Frankfurt + New York**. The pricing page's "Up to 100" and its FAQ's "quota of 100" are totals; the docs/FAQ "50 per organization" is the per-region limit. This **resolves** the old 50-vs-100 caveat rather than preserving it. Caveat: `boxd manage machine-limit request --max-vms` takes one number and does not say per region; `manage machine-limit` shows per-region counts. If the parent wants to keep a caveat, word it as "50 per region; 100 total; the request command's number is not labelled per-region".

### 4.4 Hibernation wake: 85 ms or 156 ms?

| Side A — 85 ms | Side B — 156 ms |
|---|---|
| [suspend-resume](https://docs.boxd.sh/guides/suspend-resume): "Waking from hibernation takes **about 85ms** and loads the memory image back into RAM." | [pricing](https://boxd.sh/pricing), Lifecycle: hibernated, "Back to running **156 ms**" |
| [resources](https://docs.boxd.sh/guides/resources): hibernated wake "About 85ms" | [llms.txt](https://boxd.sh/llms.txt): "A hibernated machine answered an HTTPS request with its app still running in **156 ms median (104–213 ms, n=10)**." (measured 2026-10-29, Frankfurt) |

**Model uses:** **85 ms** is the memory-restore claim; **156 ms** is the measured time for the app to answer an HTTPS request. Use 85 ms in the lifecycle figure and 156 ms in the note/scenario when the reader cares about a request completing. Do not call 156 ms a contradiction; it is a different endpoint.

### 4.5 Can you start without a card?

| Side A — yes, 2 machines | Side B — card before the first machine |
|---|---|
| [resources](https://docs.boxd.sh/guides/resources): "An org without a payment method is capped at 2 machines. Add a payment method and the cap goes to the full 50." | [llms.txt](https://boxd.sh/llms.txt): "A new organization also needs a payment method before its first machine: right after sign-in they are asked to connect one (nothing is charged, and the free credits arrive with it)." |
| Console bundle (app.boxd.sh): a `cardless_start` org "runs on its free credits with up to 2 machines"; a separate `card_deadline_at` state is a time-limited "free starter window". | [FAQ](https://boxd.sh/faq/): "New accounts get €30 of free credits." (no card condition stated) |

**Model uses:** **`no-card: yes`**, on the docs' explicit 2-machine cap. Add the caveat that the sign-up flow now asks for a payment method before the first machine and that the console has a time-limited "starter window" variant; the public docs and the onboarding flow disagree. Do not claim the 2 machines come with free credit — the credit is tied to adding a card on the pricing page.

### 4.6 What counts as idle: either direction, or inbound only?

| Side A — either direction | Side B — inbound only |
|---|---|
| [suspend-resume](https://docs.boxd.sh/guides/suspend-resume): "The idle timers count TCP/UDP traffic in both directions, so outbound traffic (polling an API, downloading packages, calling an LLM) keeps a machine awake" | [FAQ](https://boxd.sh/faq/): "By default a machine with **no inbound traffic** for 4 hours hibernates and wakes on the next connection" |
| [llms-full](https://boxd.sh/llms-full.txt): "A machine goes to standby or hibernates after its timeout passes with no network traffic in either direction" | [pricing](https://boxd.sh/pricing): "A machine hibernates on its own when its network traffic stops" (no direction, no 4 h) |

**Model uses:** **either direction** (docs), with `idle.ignore-outbound` available to make it inbound-only. The FAQ sentence is a simplification; the pricing sentence is vaguer still. This matters because an agent polling an API stays awake, while a local compile does not.

### 4.7 Where do SSO and audit logs live?

| Side A — Enterprise/Custom add-ons | Side B — not on the pricing page |
|---|---|
| [FAQ](https://boxd.sh/faq/): "Talk to us about SAML SSO for Enterprise." | [pricing](https://boxd.sh/pricing), Scale compliance column: **DPA**, **SOC 2 Type II In progress**, **ISO 27001 In progress** — no SSO, no audit logs |
| [llms-full](https://boxd.sh/llms-full.txt), Custom: "EU data residency, **SSO + audit logs**, and an annual license." | The old pricing line "SSO + audit logs" is **gone** from the live page (present in the 28 Oct baseline quote, absent on 12 Nov) |

**Model uses:** SAML SSO and audit logs are **Custom/Enterprise add-ons** (ask), not self-serve and not on Scale's published list. `sso: partly`, `audit-log: partly`. Flag the pricing-page omission as a gap, not as removal of the feature.

### 4.8 The currency: EUR only, or EUR/USD?

| Side A — EUR | Side B — USD and EUR |
|---|---|
| [Terms §5.2](https://boxd.sh/terms/): "Fees are calculated based on Customer’s actual use of the Services, at the rates published on the Boxd website from time to time, and are charged in **euro (EUR)**." | [pricing](https://boxd.sh/pricing): USD/EUR toggle; USD list $0.047 / $0.014 / $0.000096, $30 credit |
| | [llms-full](https://boxd.sh/llms-full.txt): "Billing is in euros or US dollars; an organization's currency is set when the organization is created, and the rates differ per currency" |

**Model uses:** both lists are real; an org's currency is fixed at creation. The Terms sentence is stale (or the USD list is a display-only conversion, but the page says "Priced in dollars" on the US waitlist and the USD list is not a 1.2× FX conversion of a EUR charge). Flag for procurement.

### 4.9 "No dashboard" — but there is a console

| Side A — no dashboard | Side B — console |
|---|---|
| [llms-full](https://boxd.sh/llms-full.txt): "Drive everything from the `boxd` CLI, with `--json` on every command for scripts and agents. **No dashboard**, no heavyweight SDK." | [regions](https://docs.boxd.sh/guides/regions): "shows every region your org uses" / "**New machine** and **New disk** have a **Region** field." |
| | [menu-bar](https://docs.boxd.sh/guides/menu-bar): "**New machine**, at the bottom of the menu, is the console's New machine dialog" with Name, Region, Start from, Size, Isolated and **Create machine**. |

**Model uses:** a console exists and can create machines. The "No dashboard" line is a positioning claim (CLI-first), not a product fact; `dashboard-create` is `yes`. This also means the old feature prose "boxd and Boat are CLI-first ... At boxd and Boat it cannot [create without a terminal]" needs editing for boxd.

### 4.10 Does the CLI run on Windows?

| Side A — yes | Side B — not yet |
|---|---|
| [installation](https://docs.boxd.sh/cli/installation): "It supports Windows 10 and 11 on x86_64; Windows 11 on Arm runs the same build." / PowerShell installer `install.ps1` | [FAQ](https://boxd.sh/faq/): "Not yet. The CLI runs on macOS (Apple Silicon) and Linux, and Windows is on the list." |
| [llms.txt](https://boxd.sh/llms.txt): Windows PowerShell quick start, `-Yes` flag | |

**Model uses:** Windows is supported by the CLI (docs are newer and more specific); the FAQ is stale. Client utilities remain macOS/Linux only; say so in the note.

### 4.11 Is there a boxd MCP server?

| Side A — yes (implied) | Side B — no boxd-control server |
|---|---|
| [homepage](https://boxd.sh/): "The MCP server installs straight into Claude Code, Codex or opencode." (under **Integrations**) | [cli/commands](https://docs.boxd.sh/cli/commands): "`boxd manage integrations mcp linear claude` # install an integration's MCP server into these coding agents" |
| | [launch-a-browser](https://docs.boxd.sh/guides/launch-a-browser): the only other MCP named is `chrome-devtools`, registered for the in-machine browser |
| | No `mcp` page in `llms.txt`; no `boxd mcp` command; no server that creates machines |

**Model uses:** `mcp-server: no` for a **boxd-control** MCP server. The homepage means the integration's MCP server (Linear, etc.) is installed into the agent. If boxd later ships one, it is not documented as of 12 Nov.

### 4.12 Free credits: "every new account" or "add a payment method"?

| Side A — every account | Side B — with a payment method |
|---|---|
| [homepage](https://boxd.sh/): "Every new account starts with €30 of free credits" | [pricing](https://boxd.sh/pricing): "€30 of credits when you add a payment method. Nothing is charged when you add the card" |
| [FAQ](https://boxd.sh/faq/): "New accounts get €30 of free credits." | [llms.txt](https://boxd.sh/llms.txt): "A new organization also needs a payment method before its first machine" |

**Model uses:** the pricing page (credit is tied to adding a payment method). The homepage/FAQ omit the condition. The console's cardless path may grant a smaller starter amount, but no public page states it; do not invent one.

### 4.13 "90-day uptime" with 16 days of data

| Side A — 90 days | Side B — 16 days |
|---|---|
| [status page](https://status-boxd.com/): "Uptime, last 90 days"; the API's `history_days` is 90 | The same API's first `checks` day is **2026-10-28** for Platform/Frankfurt and **2026-11-03** for New York; every earlier day has `checks: 0`, `uptime: null` |

**Model uses:** quote the 90-day label but say the record begins 28 Oct (16 days) / 3 Nov (10 days). Do not present 99.98% as a 90-day figure. This is a limitation, not a contradiction.

### 4.14 "Free to start" / "EU hosting by default"

| Claim | What the product says |
|---|---|
| [pricing](https://boxd.sh/pricing): "Simple pricing. **Free to start.**" / "Start with $30 free" (USD toggle) | The $30 needs a payment method; without one you are capped at 2 machines. "Free to start" is marketing, not a no-card allowance. |
| [llms-full](https://boxd.sh/llms-full.txt): "EU hosting **by default**. No vendor lock-in." | [regions](https://docs.boxd.sh/guides/regions): two regions, Frankfurt and New York; the CLI/console default to the **closest** region until the org sets one; the SDK defaults to Frankfurt. EU hosting is the default for EU users, not the only product. |

**Model uses:** no hosted free tier; EU is the default region for EU users, and New York is a real US region. These are wording gaps, not verdict changes.

---

## 5. Important products the 16 features and 78 capabilities miss

Some are new since 28 Oct; others existed at the baseline but the profile treated them as one-line "adjacent capabilities". The distinction matters for how they are written up: a new product gets a "new" note, a previously missed one gets a correction.

### 5.1 Integrations and automations (the biggest miss)

- **What:** **over 100 integrations** (Linear, Slack, GitHub, Notion, Google, Stripe, Salesforce, OpenAI, Vercel, Jira, HubSpot, Zendesk, …) connect once, personal or org-shared; inside a machine the **`run` CLI** and the typed **`@boxd/run` TypeScript SDK** call them without an API key or MCP server; a **`*.run.ts`** file becomes a background job with **cron (`every`) and event triggers**, durable state (`object`), retries, logs, a console write-up and a flow diagram; boxd **wakes a hibernated machine** for a schedule or event.
- **Why it matters:** it is the answer to "how does a sleeping agent do work?" and it is the product's main non-sandbox differentiator. It also changes the `schedules` capability from `partly` to `yes` and makes `mcp-server: no` less of a gap (boxd's integrations deliberately work **without** an MCP server).
- **Evidence:** [integrations/overview](https://docs.boxd.sh/guides/integrations/overview) · "Connect Linear, GitHub, Slack and over a hundred other integrations, then let scripts run on schedules and events while the machine sleeps between runs."; [automations/jobs](https://docs.boxd.sh/guides/automations/jobs) · "The platform holds the next time any `every(...)` on the machine is due and wakes a sleeping machine, on standby or hibernated, shortly before it."; [automations/scripts](https://docs.boxd.sh/guides/automations/scripts) · "Everything a .run.ts script can import from @boxd/run: typed integrations, triggers, schedules, durable state"; [cli/run](https://docs.boxd.sh/cli/run).
- **Baseline status:** one paragraph in §1 and §8 ("Automations as an agent-adjacent feature"), no capability row except `schedules` (which was marked `partly` with the now-false shortfall). **Verdict: underweighted, not new.**

### 5.2 Private machine-to-machine networking

- **What:** every machine is on one org-private network by default; **`--networks` / `boxd machine networks`** puts machines into named tags, and two machines reach each other only if they **share a network** or **neither has one**; **`<machine>.boxd`** resolves to the private IP inside the org; changes apply immediately without reboot; networks never cross orgs or regions; isolated machines never join and only reach networks you add; a machine spec can carry up to **16 networks**.
- **Why it matters:** the profile's `outbound-network` feature asks "can sandboxes reach each other over a private network?" in `watchFor`, but there is no capability row for it. This is a real product (micro-services, agent fleets, a DB machine) and a differentiator from public-URL-only providers.
- **Evidence:** [vm-to-vm](https://docs.boxd.sh/guides/vm-to-vm) · "share at least one network"; "`<machine>.boxd` resolves to that machine's private IP"; [cli/commands](https://docs.boxd.sh/cli/commands) · "Networks are labels you pick, with nothing to create first"
- **Baseline status:** §6 mentioned "Named networks narrow reachability" and `boxd machine networks`; no feature/capability row. **Verdict: missed, not new.**

### 5.3 Computer use API

- **What:** `boxd machine computer <machine> screenshot|click|move|drag|scroll|type|key|wait` with screen-pixel coordinates, optional screenshot after every action, and adapters for Claude and OpenAI; works on the same desktop a person watches; sleeping machines wake; stopped machines must be started.
- **Why it matters:** `desktop` only records that a display exists. Computer use is the programmatic GUI-control surface that makes the desktop useful to an agent that is not a human clicking.
- **Evidence:** [computer-use](https://docs.boxd.sh/guides/computer-use) · "Let an agent see and control a machine's desktop with screenshots, the mouse and the keyboard, from the CLI, the SDKs or the API."; [docs index](https://docs.boxd.sh/index.md) · "Let an agent see and control a machine's desktop with screenshots, the mouse and the keyboard"
- **Baseline status:** absent. **Verdict: new (or newly documented); add as a capability or a `desktop` note.**

### 5.4 Machine specs (declarative machines in code)

- **What:** one JSON/TypeScript/Python value with **13 fields** — base (image/snapshot/fork), size, labels, networks, isolation, egress allowlist, env, secrets, integrations, agent logins, first-boot commands, packages, `assignTo` — created from the SDKs or API; specs survive forks and snapshots; a spec can be assigned to another member; teams can have a default snapshot; limits: 256 KiB JSON, 128 env vars, 64 secrets, 16 networks, 256 egress entries, 64 connections, 200 packages.
- **Why it matters:** it is the "compose once, stamp out many" product the profile describes in prose, but `templates` only points at snapshots. A spec is a different, code-first template with credentials, networks and boot commands.
- **Evidence:** [machine-specs](https://docs.boxd.sh/guides/machine-specs) · "A machine spec describes a machine in one value: what it boots from, its size, labels, networks, isolation, egress allowlist, env vars, the secrets it gets, the integrations and agent logins it needs, and the shell commands it runs on its first boot."; [blog, 9 Nov](https://boxd.sh/blog/composability-explained/) · "one JSON value with 13 fields".
- **Baseline status:** §7 mentions machine specs in the interfaces table, but no capability and no feature. **Verdict: missed as a product; add a capability or a `templates` note.**

### 5.5 Self-hosting / BYOC as a product line

- **What:** the **same** machines, CLI, console and SDKs on your own **AWS, GCP or bare-metal KVM** hosts; **free ≤16 worker vCPUs**, paid yearly licence above; **Apache-2.0 installer**, signed **PolyForm Internal Use** binaries; **OIDC SSO** (Entra ID, Okta, Google Workspace, Keycloak); **air-gapped**; **BYOC** where boxd operates the cluster in your account; one hourly telemetry report on the free tier; releases roughly daily (`v2026.11.11.1` latest).
- **Why it matters:** `open-source: yes` captures "self-hostable" but not the free tier, the licence split, OIDC SSO, BYOC/air-gapped, or the fact that this is now a **priced product line** with its own support and release cadence. It is also the only way to get a region other than Frankfurt/New York.
- **Evidence:** [self-hosting](https://boxd.sh/self-hosting/) · "Free up to 16 vCPUs."; "A licence lifts the limit."; "BYOC and air-gapped installs on request"; [GitHub](https://github.com/boxd-sh/self-host) · "The installer is open source; the binaries have their own license"; [LICENSE-BINARIES](https://github.com/boxd-sh/self-host/blob/main/LICENSE-BINARIES.md) · "PolyForm Internal Use License 1.0.0".
- **Baseline status:** §1 listed "Self-host / BYOC: the whole platform as one Rust binary" and §10 said "annual licence, no numbers"; the profile's `open-source` row said "not open source: one binary ... no licence or repository published". **Verdict: changed; the baseline understated it.**

### 5.6 Self-expiring machines (delete-after and self-delete)

- **What:** `boxd machine config set <name> delete-after 2h` (or `7d`, or a cron expression) permanently deletes a machine at a set time, **whatever state it is in** — running, standby, hibernated or stopped; forks start their own copy; snapshots survive; the platform enforces it, not the machine. `boxd machine remove --self` lets a machine delete itself from inside, always with a y/N confirmation (no `-y`), and the SDKs expose `delete_self()` / `deleteSelf()`.
- **Why it matters:** `lifecycle` and `idle-timers` cover sleep and stop, but not **expiry**. For throwaway agent fleets, this is the cost-control that replaces a spend cap.
- **Evidence:** [delete-after](https://docs.boxd.sh/guides/delete-after) · "A delete-after timer permanently deletes a machine at a set time." / "boxd enforces the timer, not the machine. It fires whatever state the machine is in"; [self-delete](https://docs.boxd.sh/guides/self-delete) · "A machine can delete itself from inside."
- **Baseline status:** §3 mentioned delete-after in passing; no capability row. **Verdict: missed.**

### 5.7 Mobile SSH and the macOS menu bar

- **What:** **Mobile**: open any machine from a phone in Termius, Moshi, a-Shell, WebSSH, ConnectBot or any SSH client; a tap creates a one-year token (10 live per machine), shown only while the page is open; QR from the console. **Menu bar**: macOS 13+ app in the CLI daemon; create a machine, open a shell/website/desktop, pause/hibernate/stop, see running count and credit balance, filter, switch org; the New machine dialog is the same one as the console.
- **Why it matters:** these are the non-technical/on-the-go surfaces; the profile's `usability` section only mentions the console and the desktop.
- **Evidence:** [mobile](https://docs.boxd.sh/guides/mobile) · "Open any machine from your phone in the SSH app you already have."; [menu-bar](https://docs.boxd.sh/guides/menu-bar) · "Your machines in the macOS menu bar: create one, open a shell or its website, and put it to sleep, in a click."
- **Baseline status:** absent. **Verdict: new surfaces; low priority for the comparison, but worth a line in `ways-to-drive`/`reaching-it`.**

### 5.8 Smaller but real

- **Filesystem API** (`machines.fs`): read/write/list/stat/mkdir/remove/rename/realpath from Python/TS, streams large files, wakes sleeping machines, isolated machines included. `file-api` covers the existence, not the surface. [machine-filesystem](https://docs.boxd.sh/guides/machine-filesystem)
- **Unattached secrets**: `unattached` / `private-unattached` scopes reach only machines whose spec names them; owners/admins manage org ones. [env-secrets](https://docs.boxd.sh/guides/env-secrets#unattached-secrets)
- **Teams with default snapshots**: a team is a group of members with an optional default snapshot; new team machines start from it; `assignTo` lets an admin create a machine for a member that the admin cannot later reach. [organizations](https://docs.boxd.sh/guides/organizations)
- **Windows CLI**: Windows 10/11 x86_64, PowerShell installer, `boxd.exe`, no admin rights; client utilities still macOS/Linux. [installation](https://docs.boxd.sh/cli/installation)
- **`idle.ignore-outbound`**: only connections opened **to** the machine count as activity; org default; applies to auto-suspend and auto-hibernate. [suspend-resume](https://docs.boxd.sh/guides/suspend-resume)
- **OSS integrations**: ~22 documented frameworks (TanStack AI, Flue, Bindu, Harbor, Crabbox, Zuse, Omnara, Convex, herdr, Scale AI AgentEnv, Paperclip, Pydantic AI, rakazo, Agent Swarm, Sheprd, Tardigrade, Bast, AG2, seekrit, …) — an ecosystem signal, not a capability. [oss-integrations](https://docs.boxd.sh/use-cases/oss-integrations)
- **Per-region wildcard domains**: one org wildcard per region, delegated to that region's nameservers; a per-machine domain can't follow a tailnet. [custom-domains](https://docs.boxd.sh/guides/custom-domains)
- **Scale / BYOC**: >100 machines, >8/32, cloud or BYOC, dedicated support, DPA, SOC 2/ISO in progress. [pricing](https://boxd.sh/pricing)

---

## 6. Not published (searched, unanswered)

Keep these as unknowns; do not turn them into zero, free or no.

- **Egress price and allowance.** Pricing, FAQ, egress guide and CLI reference have no transfer price or included GB. The rate card's three meters are vCPU, RAM and disk only.
- **Snapshot, checkpoint, backup and standalone-disk storage prices.** All exist; none has a price line. Backup default retention is 7 days, schedule floor 15 minutes; restore is in-place.
- **Static / dedicated outbound IP.** No page mentions one, and none prices one. Battleships lists it as a Yes; unconfirmed.
- **GPU, ARM guests, nested virtualisation.** No shape, price or statement; the size table stops at 8 vCPU / 32 GiB and names no architecture.
- **Maximum standalone disk size.** Sizes appear by example (`--size 10G`); no maximum or size list.
- **Custom / Scale / self-host licence prices.** "Talk to us"; self-host is free ≤16 vCPU and "priced for the size of your cluster" above.
- **SLA.** No availability target, credit regime or support-response target. Terms §4.5 is "commercially reasonable efforts"; liability is capped at 12 months' fees.
- **Headcount.** Not published. Named: three founders + founding engineer Jonny Serban (floor of 4); the blog's "Authors 3" is a floor, not a headcount.
- **SOC 2 / ISO 27001 reports.** "In progress"; no report, trust centre, date or auditor. Security pack by email.
- **What happens at zero balance** with auto top-up off.
- **Audit log contents, retention and export** on Custom/self-host.
- **Snapshot retention.** Named snapshots persist until removed; no expiry published. Backups default 7 days.
- **The $30 credit's expiry.** No date published.
- **Cardless "starter window" length and amount.** The console has the state; no public page states the duration or the cardless credit amount.
- **Whether the `machine-limit` number is per region or total.** The docs say the limit applies per region; the request command takes one number.
- **Windows client utilities.** The CLI supports Windows; the clipboard/file/browser bridge is macOS/Linux only.
- **Python automations.** `*.run.ts` is TypeScript today; "Python support is coming soon."
- **A launch date for New York.** No announcement post; the earliest first-party artefacts are the 3 Nov status checks and the `v2026.11.03` self-host release.
- **A changelog.** `/changelog`, `/changelog/`, `docs.boxd.sh/changelog`, `docs.boxd.sh/changelog.md` and `/whats-new` all 404. The blog is the release-notes surface; GitHub Releases is the dated version feed for self-host.

---

## 7. Integration notes (for the parent)

These are the specific edits the recheck implies. No repo data file was edited by this thread.

### 7.1 `site/src/data/pricing/boxd.json`

- `checkedOn`: `2026-10-29` → **`2026-11-12`**.
- `cpu.billing`: `"allocated"` → **`"active"`**. `cpu.rate` stays `0.047`. No floor.
- `ram.billing`: stays `"requested"` (this card's convention for "the GiB the machine holds"); `ram.rate` stays `0.014`.
- `disk.running` / `disk.stopped`: stay `9.6e-05`.
- `shapes`: unchanged (1/4, 2/8, 4/16, 8/32; 100 GiB each).
- `between`: `"kept"` unchanged.
- `egress.perGiB`: `null` unchanged; note "still not published".
- `plans`: keep the $0 Pay as you go plan. Add notes for **Scale** (same rates, >100 machines, >8 vCPU/32 GiB, BYOC, dedicated support, DPA, SOC 2/ISO in progress) and **Self-host** (free ≤16 worker vCPUs, yearly licence above, air-gapped, BYOC). Do not add a monthly fee.
- `notes`: add "Only **active** vCPU is billed, sampled every second; boxd says 10% of reserved vCPU is typical, so a 2 vCPU machine usually bills like 0.2 vCPU." Add "Self-hosting is free to 16 worker vCPUs." Keep "Egress and snapshot storage prices are not published, so neither is included."
- `summary`: "Per second on three meters: **active** vCPU while running, memory on what is resident, disk on bytes written in every state."
- `sources`: add `https://docs.boxd.sh/guides/regions`, `https://boxd.sh/self-hosting/`, `https://status-boxd.com/`, `https://github.com/boxd-sh/self-host`.
- `upkeep`: unchanged.

### 7.2 `site/src/data/providers/boxd.json`

- `checkedOn`: `2026-10-28` → **`2026-11-12`**.
- `oneLiner`: "KVM machines in the EU" → **"KVM machines in the EU and US"** (or "Frankfurt and New York").
- `whatItIs`: "one product sold three ways: pay-as-you-go credits, a Custom contract with SSO and audit logs, and a self-hosted version" → **"pay-as-you-go, a Scale contract for larger fleets/BYOC, and a self-hosted version that is free to 16 worker vCPUs"**.
- `billing.meter`: "vCPU on the machine's size while running" → **"active vCPU while running"**.
- `billing.planFee`: "None. Custom and self-hosted are contracts with unpublished prices." → **"None on Pay as you go. Scale and self-hosted licences are contracts; self-hosted is free to 16 worker vCPUs."**
- `billing.minimum`: unchanged, but the $30 credit is still card-gated.
- `cost.A/B/C`: recompute with `cpu.billing: "active"` (A busy 50%, B/C 10%); shapes/disk/RAM unchanged. Update the headlines and the vCPU line labels; the RAM/disk lines and notes stay. Add a note that a 2 vCPU machine active 10% of the hour bills 0.2 vCPU-hours, per boxd's own FAQ.
- `company.facts`:
  - **Status and SLA**: "Public status page at status-boxd.com: 90-day per-component uptime for the platform, Frankfurt and New York, incident history and Atom feed. **No incidents recorded**; checks begin 28 Oct 2026 (NYC 3 Nov), so the 90-day figures cover 16/10 days. No SLA."
  - **Certification**: "No certification. **SOC 2 Type II and ISO 27001 are in progress** (pricing page); no report or trust centre; security details by email."
  - **Data residency**: "Two regions: **Frankfurt (EU)** and **New York (US)**. A machine's disk, memory, snapshots, checkpoints and backups stay in its region; account/org data (members, keys, secrets, integrations) is kept in every region the org uses. Privacy notice names **Latitude.sh LLC (Delaware)** for both clusters; the old 'no US cloud dependency' FAQ line is gone."
  - **Headcount**: "Not published. Three founders plus a named **founding engineer, Jonny Serban** (9 Nov 2026); the blog counts three authors, which is a floor."
  - **Founded**: unchanged (5 Feb 2026); the holding company is confirmed same-date, KvK 99712768.
  - **Funding**: unchanged (€2M pre-seed, 16 Sep 2026); note tech.eu reports "$2 million".
- `fits.well`: add "A team that wants both an EU and a US region on one account and bill." Add "A small team that wants the platform free on its own KVM hosts up to 16 vCPUs."
- `fits.badly`: remove "a US region today" (it exists); keep "a REST API, a published egress price"; add "a published SLA or a SOC 2 report today".
- `usability.dashboard`: "Yes, at boxd.sh/app ... It is secondary" — still true, but the console now has a **New machine** dialog (Name, Region, Start from, Size, Isolated), so it is no longer view-only. Reword.
- `usability.withoutCode`: "Partly, and less than the marketing suggests" — still true; add that the console's New machine dialog removes the terminal from **creation**, but setup still needs commands.
- `usability.signup`: "There is no waitlist in the EU; the US region has one." → **"Both regions are open self-serve; the US waitlist page is stale."** Add "New sign-ups may be asked for a payment method before the first machine; the docs still describe a 2-machine cardless cap."
- `usability.docs`: "There is no status page." → **"Status: status-boxd.com, 90-day per-component uptime, no incidents recorded."**
- `usability.tripsUp`: 
  - "The headline hourly price assumes 2 GiB of an 8 GiB machine is in use." → **"The headline $0.04/h assumes 10% of the vCPU (0.2 of 2) and 2 GiB resident on an 8 GiB machine."**
  - "Whatever you serve is on the open internet at name.boxd.sh, with no auth in front." → add "unless the org is on Tailscale/NetBird, which is org-wide."
  - "Sleep is invisible..." unchanged.
- `caveats`:
  - "The bill follows resident RAM, not the shape" — keep; update the detail: boxd's calculator now assumes **10% active vCPU** and 2 GiB resident, so both CPU and RAM can be best-case.
  - "Public URLs are open..." — add the Tailscale/NetBird exception.
  - "The machine quota is stated as both 50 and 100" — rewrite: **"The machine limit is 50 per region, 100 across Frankfurt and New York; the pricing page says 'Up to 100', the docs/FAQ say '50 per organization', and the request command's number is not labelled per-region."** Status: resolved-with-caveat, not contradiction.
  - "Inbound public IPv4 is contradictory" — keep (FAQ says a public IPv4; docs say shared proxy IP).
  - "EU-only, except for the US cluster" — rewrite: **"Data residency now follows the region"**; machine data stays in Frankfurt/NYC, but account/org data is replicated to every region the org uses, and the privacy notice names a Delaware vendor for both. Status: resolved-with-caveat.
  - "Static egress IP is unconfirmed" — keep.
  - "Prices moved about 20% in 19 days" — keep as history; note the rate card has been stable since 14 Oct.
  - "Storage prices are not published" — keep; add egress.
  - "No status page and no REST API" — split: **"No REST API"** (open) and **remove the status-page part** (status page exists). 
- `strengths`: add "A public status page with per-region uptime and an empty incident history." Add "Self-hosting free to 16 worker vCPUs, with an Apache-2.0 installer." Add "A US region on the same account and bill as the EU."
- `sources`: add `https://docs.boxd.sh/guides/regions`, `https://boxd.sh/self-hosting/`, `https://status-boxd.com/`, `https://github.com/boxd-sh/self-host`.

### 7.3 `site/src/data/features/*.json` (16 rows)

Only these need edits; the rest are unchanged.

- **sizes-regions**: figure `"8 vCPU / 32 GiB; EU + US"`; scenario "The ceiling is 8 vCPU / 32 GiB, in Frankfurt or New York; bigger machines are the Scale column."; note "Four sizes ... Two regions, per machine ... no GPU, no ARM."; source can stay resources, add regions to the evidence in research.
- **lifecycle**: figure `"RAM frozen; 85 ms / 156 ms"`; scenario/note "standby keeps RAM; hibernate writes memory to disk, ~85 ms to restore, 156 ms median for the app to answer (boxd, 29 Oct)."
- **idle-timers**: figure `"4 h either way, or never"`; note add `idle.ignore-outbound` and org defaults; scenario keep "a stalled model call makes no traffic".
- **reaching-it**: note add Tailscale/NetBird org-wide private option and "raw ports don't wake a hibernated machine"; figure "No auth" still true by default.
- **custom-domains**: note add "one org wildcard per region; a per-machine domain stays public under Tailscale".
- **keys-secrets**: note add unattached/private-unattached scopes.
- **ways-to-drive**: figure `"Console; gRPC only"`; scenario "The console can create a machine, but the wire API is gRPC with no REST and there is no boxd MCP server."; note add Windows CLI.
- **built-in-agents**: note "Claude **and Codex** logins are org-level; OpenCode per machine"; add computer-use API.
- **teams-accounts**: figure `"3 roles; SSO Enterprise"`; note add teams/default snapshots, self-host OIDC, audit only Custom; scenario update.
- **billing-models**: figure `"Three meters, active CPU"`; scenario "an idle box pays for the memory it holds, not the cores it reserves"; note add active vCPU and self-host free.
- **trials-free-tiers**: figure `"$30 one-off + free self-host"`; note add self-host ≤16 vCPU; scenario update.
- **company**: scenario "A Dutch BV with a status page but no SLA and no certification."; note update status page, SOC2/ISO in progress, NYC region, headcount floor 4, DPA.
- **isolation**, **snapshots-forks**, **storage**, **outbound-network** — no material change; optional note additions (snapshot 1.19 s; disks per region; networks). Leave them to minimize churn.

### 7.4 `site/src/data/capabilities.json` (78 rows)

Verdict changes:
- `choose-region`: `no` → **`yes`** (figure "Frankfurt or New York"; source regions; quote above; remove shortfall).
- `active-cpu`: `no` → **`yes`** (figure "active vCPU only"; source pricing; quote above; remove shortfall).
- `schedules`: `partly` → **`yes`** (figure "cron + events"; source automations/jobs; quote above; remove shortfall).
- `private-url`: `no` → **`yes`** (figure "Tailscale/NetBird"; source tailscale; quote above; remove shortfall; note org-wide/support-enabled and per-machine domains stay public).
- `dashboard-create`: `no` → **`yes`** (figure "Console dialog"; source menu-bar; quote above; remove shortfall).
- `status-page`: `not-published` → **`yes`** (figure "90-day uptime"; source regions; quote above).

Figure/note/source changes without verdict change:
- `eu-region`: quote "Machines in Frankfurt, and their data, stay in the EU." (FAQ); note "New York is the US region."
- `pause-memory`: quote "Next to `running`, boxd has two sleep states..." (colon); note 85 ms restore.
- `snapshot-memory`: figure "Memory + disk" (not "Under 200 ms"); note measured 1.19 s to first HTTPS response; 6 ms boot.
- `wake-on-request`: quote "A hibernated machine wakes on the next connection that comes through boxd"; note raw ports don't wake a hibernated machine.
- `raw-tcp`: note "a hibernated machine does not wake on a raw port; keep hibernation off"; figure "3 forwards" unchanged.
- `custom-image`: new shortfall (no self-serve image field; snapshot or ask boxd to boot your container-image base).
- `sso`: new shortfall (cloud SAML on Enterprise; self-host OIDC built in).
- `audit-log`: source llms-full, quote "SSO + audit logs"; shortfall "named only on Custom/self-host; no self-serve audit log documented; the pricing page no longer lists it."
- `scoped-keys`: note member/org kinds and expiry; still no scopes.
- `secrets-store`: note unattached/private-unattached scopes.
- `hidden-secrets`: note 16 MiB body limit and cert-pinning caveat.
- `egress-allowlist`: note 256 entries, DNS follows, IPv6 refused.
- `no-internet`: note DNS refused.
- `egress-included`: note three meters only.
- `static-ip`: note unconfirmed.
- `agents-preinstalled`: note Claude **and Codex** org-level, OpenCode per machine.
- `desktop`: note computer-use API.
- `browser`: note laptop Chrome too.
- `hosts-other-agents`: note OSS list.
- `team-workspace`: note teams.
- `roles`: note team admin.
- `spend-cap`: note prepaid + auto top-up off; zero-balance unpublished.
- `usage-alerts`: note low-credit banner only, no threshold alert.
- `per-second`: note 15-min settlement.
- `cheap-pause`: quote "a machine in standby pays for memory and disk"; note hibernate/stop disk only.
- `no-monthly-fee`: unchanged.
- `flat-price`: unchanged.
- `free-tier`: note self-host free ≤16 vCPU does not count as a hosted tier; keep `no`.
- `free-credit`: note $30 USD / €30 EUR.
- `no-card`: note contradiction with llms.txt; keep `yes`.
- `sla`: quote Terms §4.5 "commercially reasonable efforts ... does not guarantee uninterrupted or error-free operation"; note no target/credits.
- `soc2`: quote "We're working on both." (FAQ); note ISO 27001 also in progress.
- `dpa`: quote "DPA available today." (self-hosting); keep yes.
- `open-source`: figure "Free to 16 vCPUs"; note Apache-2.0 installer, PolyForm binaries, free ≤16, paid above, BYOC/air-gapped.
- `file-api`: note 1 GB machine-to-machine cap; no laptop cap.
- `templates`: note team default snapshots.
- `backups`: note 15-min floor, 7-day default retention.
- `volumes`: note one region/host, one attachment.
- `big-disk`: note no published max.
- `stay-on`: note hibernated/stopped count toward quota.
- `public-url`: note public by default; Tailscale can make it tailnet-only.
- `ssh`: note can be turned off.
- `custom-domain`: note one wildcard per region.
- `rest-api`: note gRPC only.
- `mcp-server`: note integration MCP servers, not boxd-control.
- `prompt-api`: note Anthropic/OpenAI run the loop.
- `one-click-hermes` / `one-click-openclaw`: unchanged no.
- `nested-virt`: unchanged not-published.
- `gpu`: unchanged no.
- `any-size`: unchanged no.
- `live-resize`: unchanged no.
- `warm-pool`: unchanged no.
- `older-snapshot`: unchanged no.
- `shared-volume`: unchanged no.
- `mount-buckets`: unchanged no.
- `eu-region`: unchanged yes.
- `big-machines`: unchanged yes.
- `pause-memory`: unchanged yes.
- `fast-start`: unchanged yes.
- `snapshot-files`: unchanged yes.
- `fork-running`: unchanged yes.
- `templates`: unchanged yes.
- `files-survive-stop`: unchanged yes.
- `volumes`: unchanged yes.
- `big-disk`: unchanged yes.
- `stay-on`: unchanged yes.
- `choose-idle`: unchanged yes.
- `public-url`: unchanged yes.
- `ssh`: unchanged yes.
- `web-terminal`: unchanged yes.
- `tunnel`: unchanged yes.
- `custom-domain`: unchanged yes.
- `auto-https`: unchanged yes.
- `egress-allowlist`: unchanged yes.
- `no-internet`: unchanged yes.
- `secrets-store`: unchanged yes.
- `hidden-secrets`: unchanged yes.
- `cli`: unchanged yes.
- `python-sdk`: unchanged yes.
- `ts-sdk`: unchanged yes.
- `pty`: unchanged yes.
- `file-api`: unchanged yes.
- `agents-preinstalled`: unchanged yes.
- `browser`: unchanged yes.
- `desktop`: unchanged yes.
- `hosts-other-agents`: unchanged yes.
- `team-workspace`: unchanged yes.
- `roles`: unchanged yes.
- `per-second`: unchanged yes.
- `no-monthly-fee`: unchanged yes.
- `free-credit`: unchanged yes.
- `no-card`: unchanged yes.
- `dpa`: unchanged yes.
- `open-source`: unchanged yes.
- `own-vm`, `root`, `docker-inside`: unchanged yes.
- `custom-image`: partly (shortfall changed).
- `sso`: partly (shortfall changed).
- `audit-log`: partly (source/note changed).
- `scoped-keys`: partly (note changed).
- `cheap-pause`: partly (quote changed).
- `sla`: not-published (quote improved).
- `spend-cap`, `usage-alerts`: not-published.
- `nested-virt`, `egress-included`, `static-ip`: not-published.

### 7.5 `site/src/data/docs.json`

No URL needs to change. The 16 topics still resolve to the best pages:
- `sizes-regions` stays `https://docs.boxd.sh/guides/resources` (sizes + quotas; regions is a second page, add it to `sources`/research).
- `billing-models` and `trials-free-tiers` stay `https://boxd.sh/pricing`.
- `ways-to-drive` stays `https://docs.boxd.sh/cli/commands` (console is covered by `menu-bar`/`regions`, but the CLI reference is still the hub).
- `teams-accounts` stays `https://docs.boxd.sh/guides/organizations`.
- `built-in-agents` stays `https://docs.boxd.sh/use-cases/coding-agents`.
- `company` has no docs entry.

Optional: point `sizes-regions` at `https://docs.boxd.sh/guides/regions` instead, but that loses the size table. Keep resources; add regions to the profile `sources`.

### 7.6 Use cases, situations, changes, baseline, tests

- **Use cases (`usecases.json`)**: no route tier changes. No new one-click template. The only factual updates are (a) boxd now has a US region, so any "EU-only" catch should say "EU or US, picked per machine"; (b) self-hosting is free to 16 vCPUs, which is a new outside option for cost-sensitive guides; (c) `schedules`/automations are now a real platform scheduler, which strengthens the n8n and Discord/Slack gateway routes (but those still need an always-on machine because the gateway process cannot sleep). Review each boxd `what` for "EU-only" and "no US region".
- **`situations.json`**: two boxd picks need edits:
  - `agentic-saas` (around line 282): "One EU region, a fixed 100 GB disk per machine and RAM billed on resident use" → "**Two regions (Frankfurt, New York)**, a fixed 100 GB disk per machine and RAM billed on resident use".
  - `eu-residency` (around line 385): "Marketed as EU-only on German bare metal..." → "**Frankfurt machines and their data stay in the EU**, on German bare metal, with a Dutch contracting entity." The watch must change: the old "contradicts the FAQ's no-US-dependency line" is no longer true (that line is gone); say "**New York moves machine data to the US, and account/org data (members, keys, secrets) is kept in every region the org uses**; the privacy notice names a Delaware infrastructure vendor for both clusters."
- **`changes.json`**: add a dated entry, observation 2026-11-12:
  - Title: "boxd bills only active vCPU, opens New York and makes self-hosting free to 16 vCPUs"
  - What: rate numbers unchanged ($0.047 / $0.014 / $0.000096), but the vCPU meter now charges active vCPU only (boxd says 10% of reserved is typical); a New York (`nyc`) region is live alongside Frankfurt (`fra`), same account/bill/secrets; self-hosting is free to 16 worker vCPUs with no key or account, paid licence above; a public status page (status-boxd.com) records zero incidents; SOC 2 Type II and ISO 27001 are in progress, not certified.
  - Sources: pricing, regions, self-hosting, status, GitHub.
  - Do not claim a provider announcement date; the observation date is 12 Nov 2026. The pricing page's sitemap `lastmod` is 2026-11-01 and the self-hosting page's is 2026-10-29, if a date is needed.
- **`site/scripts/price-baseline.json`**: refresh the boxd pricing entry after `npm run check-rates`. The rate numbers are unchanged, but the page now carries per-size example figures ($0.11, $82.20, $0.07, $0.0096, $0.22, $157.39, $0.12, $0.42, $307.77, $0.23, $0.83, $608.53, $0.46), calculator figures ($10.50, $2.29, $6.81, $1.40, $57.13, $28.70, $21.84, $0.04, $0.03, $0.0019) and the self-host "16 vCPUs" line. Expect `CHANGED`, not `NEW`. Do not bless until the page text is read; the checker extracts money tokens, not tariff meaning.
- **`site/src/lib/cost.test.ts`**: `["boxd", "b", 222.5]` is built on allocated CPU. Redo it from the page with `billing: "active"`; add A and C fixtures while there (A busy 0.5, C busy 0.1, C stopped disk 630 h). Do not copy engine output.
- **`site/src/pages/compare/side-by-side.astro`**: `boxd: "KVM machine"` still correct; `defaults` includes boxd; static counts (16 providers, 16 features, 78 capabilities, 10 use cases) unchanged. No edit.
- **`README.md` / `site/README.md` / `site/src/data/site.json`**: provider count unchanged; don't advance the site-wide checked date for one provider. No edit.
- **`capabilities.json.checkedOn` / `usecases.json.checkedOn`**: whole-dataset dates; leave at `2026-10-29` / current unless the owner wants a dataset-wide date. Record boxd's 2026-11-12 coverage in `research/boxd.md`.
- **`research/boxd.md`**: append a dated "Recheck 2026-11-12" section; supersede §5 (regions), §10 (rates/plans/free tier), §14 (contradictions 1, 2, 4, 5, 6, 7, 10), §15 (dashboard/status), §17 (status page, certification, headcount). Keep the old text as dated history.
- **`research/rates/boxd.json`**: update `compute.cpuBasis` to `active`, `cpuBasisQuote` to the new sentence, `plans` to PAYG/Scale/Self-host, `freeTier` with the self-host tier, `diffs` for the resolved quota, `docs` with regions/self-hosting/status. The old `rates` values stay.

---

## 8. Changes at a glance

### Verdict changes (6 capabilities, 0 features)

| Row | Old | New | Why |
|---|---|---|---|
| `choose-region` | `no` — one EU region | **`yes`** — Frankfurt or New York | `nyc` region is live; per-machine `--region` / console field / SDK `region` |
| `active-cpu` | `no` — full cores while running | **`yes`** — active vCPU only | Pricing and docs now bill only active vCPU, sampled per second, ~10% typical |
| `schedules` | `partly` — only while awake | **`yes`** — platform-held cron/events | `every(...)` is held by boxd; it wakes standby/hibernated machines |
| `private-url` | `no` — URL is the only credential | **`yes`** — Tailscale/NetBird tailnet | Org names resolve and route only inside the tailnet |
| `dashboard-create` | `no` — CLI only | **`yes`** — console New machine dialog | Name/Region/Start from/Size/Isolated + Create machine |
| `status-page` | `not-published` | **`yes`** — status-boxd.com | 90-day per-component uptime, incident history, Atom feed |

### Note/figure changes without a verdict change

`eu-region` (FAQ wording), `pause-memory` (colon/85 ms), `snapshot-memory` (figure: not 200 ms; 1.19 s measured), `wake-on-request` (quote + raw-port exception), `raw-tcp` (hibernation caveat), `custom-image` (container-image base via support; no self-serve field), `sso` (self-host OIDC), `audit-log` (source now llms-full; pricing page dropped the line), `scoped-keys` (member/org kinds), `secrets-store` (unattached scopes), `hidden-secrets` (16 MiB body limit), `egress-allowlist` (256/DNS/IPv6), `no-internet` (DNS refused), `egress-included` (three meters only), `static-ip` (unconfirmed), `agents-preinstalled` (Claude **and Codex** org-level), `desktop` (computer use), `browser` (laptop Chrome), `hosts-other-agents` (OSS list), `team-workspace` (teams), `roles` (team admin), `spend-cap` (prepaid only), `usage-alerts` (low-credit banner only), `per-second` (15-min settlement), `cheap-pause` (quote), `free-tier` (self-host note), `free-credit` ($/€), `no-card` (contradiction), `sla` (Terms §4.5), `soc2` (ISO too), `dpa` (quote), `open-source` (licence/free tier), `file-api` (1 GB inter-machine), `templates` (team defaults), `backups` (15 min/7 d), `volumes` (region/host), `big-disk` (no max), `stay-on` (quota), `public-url` (Tailscale), `ssh` (can turn off), `custom-domain` (per region), `rest-api` (gRPC), `mcp-server` (integration MCP), `prompt-api` (vendor loop), `one-click-hermes`/`one-click-openclaw` (manual).

### Features (12 material note changes, 0 verdict changes)

`sizes-regions` (EU + US), `lifecycle` (156 ms app answer), `idle-timers` (ignore-outbound, raw-port caveat), `reaching-it` (Tailscale, raw-port caveat), `custom-domains` (per region, tailnet caveat), `keys-secrets` (unattached scopes), `ways-to-drive` (console create, Windows CLI), `built-in-agents` (Codex org-level, computer use), `teams-accounts` (teams, OIDC self-host, audit gating), `billing-models` (active CPU), `trials-free-tiers` (self-host free tier), `company` (status page, SOC 2/ISO in progress, NYC, founding engineer).

### Contradictions found (14 subsections, 15 claims; both sides quoted in §4)

1. US region live vs "coming" / waitlist page.
2. 8 vCPU / 32 GiB self-serve vs "email us" vs console max 4/16.
3. Machine quota 50 vs 100 (resolved as 50/region × 2 = 100 total; request number unlabelled).
4. Hibernation wake 85 ms vs 156 ms (memory restore vs app answer; not a true conflict).
5. Cardless 2-machine cap vs "payment method before the first machine" / starter window.
6. Idle timer either-direction vs "no inbound traffic".
7. SSO/audit on Custom/Enterprise vs absent from the pricing page.
8. Terms "charged in euro" vs USD list / org currency at creation.
9. "No dashboard" vs the console's New machine dialog.
10. Windows CLI "not yet" vs Windows 10/11 installer.
11. "The MCP server installs" vs no boxd-control MCP server.
12. "Every new account starts with €30" vs "when you add a payment method".
13. "90-day uptime" vs 16/10 days of checks.
14. "Free to start" vs card-gated credit.
15. "EU hosting by default" vs New York region.

### New products missed by the 16 features / 78 capabilities

1. **Integrations + automations** (100+ integrations, `run` CLI, `*.run.ts`, cron/events, durable state, retries, console write-up). The biggest miss; `schedules` only covered the cron edge.
2. **Private machine networking** (networks tags, `<machine>.boxd` DNS, default network, isolated, per region). No capability row.
3. **Computer use API** (screenshot/click/type, Claude/OpenAI adapters). `desktop` only says a display exists.
4. **Machine specs** (13-field declarative machine, `assignTo`, team defaults). `templates` only points at snapshots.
5. **Self-hosting / BYOC** (free ≤16 worker vCPUs, Apache-2.0 installer, PolyForm binaries, OIDC SSO, air-gapped). `open-source` says "yes" but misses the product line.
6. **Self-expiring machines** (delete-after duration/cron, self-delete from inside). Lifecycle covers sleep, not expiry.
7. **Mobile SSH + macOS menu bar** (phone tokens, menu bar create/sleep). Client surfaces.
8. **Filesystem API** (`machines.fs`), **unattached secrets**, **teams/default snapshots**, **Windows CLI**, **`idle.ignore-outbound`**, **per-region wildcard domains**, **Scale/BYOC** — smaller but real.

---

## 9. Quote audit and limitations

### Quote audit

- **189 quoted spans** in this file were extracted with their nearest cited URL and checked by substring against the live page after normalization: HTML tags removed, entities decoded, Markdown emphasis/backticks/brackets/parentheses stripped, whitespace collapsed, curly quotes/dashes folded, case folded.
- **180 matched** their cited page. The **9** that did not are all explained and were checked by hand:
  - **8 are USD-toggle strings** (`$0.047`, `$0.014`, `$0.000096`, `$30`, `$20`, `Start with $30 free`). `https://boxd.sh/pricing` serves **EUR** by default to a fresh HTTP client (the baseline noted this), so the USD text is only in the toggle payload and the USD screenshot. I loaded the page in Chromium, clicked **USD**, and captured `pricing-usd-full.png`; the strings are visible there.
  - **1 is the 156 ms measurement** (`"A hibernated machine answered an HTTPS request with its app still running in 156 ms median (104–213 ms, n=10)."`). It is in `https://boxd.sh/llms.txt`, linked immediately after the quote in the lifecycle row; the checker attributed it to the preceding `suspend-resume` link.
- Every **docs** quote was checked against the **per-page `.md`**, not `llms-full.txt`, because the bulk export lags (baseline §14, item 10). The per-page files are current as of 12 Nov 2026.
- The `pricing.html` raw bytes (93,558; HTTP 200; `date: Thu, 12 Nov 2026 09:56:02 GMT`) contain both EUR and USD strings and the schema.org `Offer` prices; the rendered USD screenshot is the primary evidence for the USD list, the rendered EUR screenshot for the EUR list.
- The status page quotes are from `https://status-boxd.com/`, `/history`, `/api/v1/status` and `/api/v1/incidents`; the API returns `"incidents":[]` and the history page says "No incidents reported."
- The GitHub quotes are from `https://github.com/boxd-sh/self-host` (README) and `LICENSE-BINARIES.md`, fetched raw; the repository metadata is from the GitHub REST API (`created_at` 2026-10-21, `pushed_at` 2026-11-12, `license` Apache-2.0).

### Limitations

- **Desk research only.** No account, CLI login, machine, snapshot, fork or billable resource was created. Every number is a provider claim or a provider-published measurement, not a measured result. The 156 ms / 1.19 s / 12.6 runs/s figures are boxd's own, from its 29 Oct 2026 Frankfurt run; they are not independent.
- **No changelog.** `/changelog`, `/changelog/`, `docs.boxd.sh/changelog`, `docs.boxd.sh/changelog.md` and `/whats-new` all 404. "New since 28 Oct" is inferred from dated artefacts: the status API's first checks (28 Oct / 3 Nov), the self-host GitHub releases (`v2026.11.03` onward), the pricing sitemap `lastmod` (2026-11-01), the self-hosting `lastmod` (2026-10-29), the blog's one new post (9 Nov), and the SDK 0.3.1 release (10 Nov). Some products marked "not in baseline" (computer use, networks, machine specs) may have existed before 28 Oct and been missed by the profile; they are labelled "missed/underweighted", not "launched".
- **The 90-day status figures are 16/10 days of data.** The page says "last 90 days" and the API says `history_days: 90`, but checks start 28 Oct (Frankfurt/Platform) and 3 Nov (New York). Quote the label and the coverage, not the label alone.
- **The pricing page has visual defects at 1280×900**: the FAQ overlaps the plan cards, the testimonial overlaps the heading, and the footer overlaps the rate table. The text is in the DOM and readable; the defects are the provider's, not ours. Screenshots are in `.amp/in/scratchpad/`.
- **Currency**: the default HTML is EUR; the USD list is only after the toggle. The rate card uses USD; the EUR list is reported for reference. The Terms say EUR. Do not treat the USD list as a live FX conversion; the ratio is fixed (1.205 / 1.167 / 1.2).
- **Plan pricing**: Scale and self-host licence fees are not published. Do not put a number in `plans[].fee`; use notes and `null`/omitted where the schema requires.
- **Machine quota**: the 50-per-region / 100-total reconciliation is my reading of three pages, not a provider statement that says "50 per region = 100 total". The `machine-limit request` command's number is unlabelled. Keep the caveat.
- **"No incidents"** is what the status page records, not proof there were none. The status page is new (28 Oct) and its incident history is empty; an outage before 28 Oct would not appear.
- **The $30 credit's expiry, the cardless starter window's length, and the zero-balance behaviour** are not published. Do not infer them from the console strings; the strings describe states, not durations.
- **`llms.txt` vs docs**: the agent-facing `llms.txt` is not always in sync with the docs (it says a new org needs a payment method before its first machine; the docs say 2 machines without one). The docs win for limits; `llms.txt` is used only for the measured numbers and the billing-currency sentence, where it is more specific.
- **No repo data files were edited, committed, pushed, or deployed.** This is a research artifact in `.amp/in/scratchpad/`. The parent integrates.

### Source dates

| Source | Date on the page | Re-read |
|---|---|---|
| Terms | Last updated 18 September 2026 | 12 Nov 2026 |
| Privacy Notice | Last updated 1 September 2026 | 12 Nov 2026 |
| Pricing | no date; sitemap `lastmod` 2026-11-01 | 12 Nov 2026, 09:56 UTC |
| Self-hosting | no date; sitemap `lastmod` 2026-10-29 | 12 Nov 2026 |
| Docs | no date; per-page `.md` | 12 Nov 2026 |
| Status | live; checks from 28 Oct / 3 Nov | 12 Nov 2026, 09:59 UTC |
| Blog (latest) | 9 November 2026 | 12 Nov 2026 |
| GitHub self-host | created 21 Oct 2026; pushed 12 Nov 2026 | 12 Nov 2026 |
| Tech.eu funding | 16 September 2026 | 12 Nov 2026 |
| Drimble (KvK) | registration 5 February 2026 | 12 Nov 2026 (Context, Cloudflare bypass) |

**Bottom line for the parent:** the rates did not move, but the **CPU meter did**. Flip `cpu.billing` to `"active"`, add the **New York** region and the **free self-host ≤16 vCPU** tier, replace the "no status page" and "EU-only" claims, and rewrite the **50 vs 100** quota caveat as **50 per region / 100 total**. The six capability verdicts above are the only verdict changes; no feature verdict changes. The biggest editorial miss is **integrations + automations**, followed by **private machine networking**, **computer use** and **machine specs**.

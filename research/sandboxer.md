# Sandboxer — provider profile

Research date: **2026-10-28**. Product docs entry point: <https://sandboxer.com/docs>.
Desk research only: no account, no sandbox, no signup. Nothing committed or pushed.

**Claim tags.** `docs-confirmed` = stated in Sandboxer's own material (docs, OpenAPI, changelog, Terms).
`pricing-page` = stated on the pricing page or in the billing doc's price tables. `third-party` = someone other
than Sandboxer. `inferred` = my reading of named evidence. `not-published` = I looked and found no statement.

**Quote audit.** Every quotation below was checked mechanically against a live fetch of the cited URL: 301 quoted
spans, 295 matching the cited page verbatim after whitespace and Markdown normalisation, 6 matching the page but
attributed by the parser to a neighbouring link (each verified by hand), and none left unmatched. The script,
its corpus and every correction are described at the end.

**Tool provenance (what actually returned data).**

| Tool | Result |
|---|---|
| Context.dev `web_search`, `web_scrape` | Worked. Pricing, status, X posts, HN, transformer.gg, microdose.fun, boat.dev and docs.boat.dev. |
| TinyFish Fetch + Search (direct API) | Worked. 30 docs pages as Markdown (10 URLs per call), 5 re-fetches, 3 searches. |
| Composio `TINYFISH_FETCH_URLS` via `COMPOSIO_MULTI_EXECUTE_TOOL` | Worked. Two 10-URL batches; one URL (`/about`) returned a per-URL 404. |
| Composio `COMPOSIO_REMOTE_BASH_TOOL` | Worked, for reading the saved large responses. |
| Composio Firecrawl (`FIRECRAWL_CRAWL` + `FIRECRAWL_SCRAPE`) | **Failed** — the call aborted on timeout and was not retried. The site's Markdown mirror made a crawl unnecessary. |
| Exa, Parallel, Tavily | Not used; Context.dev and TinyFish covered every question. |
| Amp native `web_search` / `read_web_page` | Not used. |

---

## 1. What it is, who it is for, product lines

**One paragraph.** Sandboxer rents whole Linux virtual machines to AI agents and to the people running them, and
bills by the second while a machine runs. Each "sandbox" is an Ubuntu 24.04 microVM with its own kernel, root,
systemd, Docker and `/dev/kvm`, reachable over an HTTP API, a CLI, two SDKs and an MCP server. The selling point
is that state outlives the session: a stop saves RAM as well as disk, a resume brings processes back, and a fork
makes a copy-on-write clone. It is ten days old at the time of writing, has two regions, no GPUs and no SLA, and
I found no independent review of it.

- **What it is, in the company's words.** "Sandboxer runs **persistent Ubuntu 24.04 microVMs** — we call them
  sandboxes — that you create from a CLI, an HTTP API or an SDK." — `docs-confirmed` ·
  [docs](https://sandboxer.com/docs)
- **Positioning line.** "The agent swarm platform" — `docs-confirmed` · [homepage](https://sandboxer.com/).
  And: "Sandboxer runs your agent swarm: thousands of isolated agents in parallel, coordinated toward one goal,
  priced per second." — `docs-confirmed` · [homepage](https://sandboxer.com/)
- **Who it says it is for.** "Solo builders and small agent fleets" ($20 plan), "Products that give every user a
  computer" ($100), "High-volume platforms and eval farms" ($500), "Large fleets with headroom to burst"
  ($2,000). — `pricing-page` · [pricing](https://sandboxer.com/pricing)
- **Named use cases.** "Coding agents in parallel", "Preview environments per PR", "Computer-use agents",
  "Untrusted code execution", "Android emulator & nested VMs". — `docs-confirmed` ·
  [use cases](https://sandboxer.com/use-cases)
- **When it says to go elsewhere.** "You need GPUs. Sandboxer has none." and "You need more than two regions, an
  SLA or a self-hosted deployment today." — `docs-confirmed` · [llms.txt](https://sandboxer.com/docs/llms.txt)
- **Product lines.** One product in four machine sizes, with several surfaces: hosted sandboxes, integrated
  coding agents, a streamed desktop, an MCP server, a Daytona-compatible API, CLI and two SDKs. — `inferred`
  from the docs tree ([docs](https://sandboxer.com/docs)), which contains no second product, add-on or
  enterprise SKU.
- **Maturity.** "Sandboxer is live" — `third-party` ·
  [X, @jonoringer, 2026-10-18](https://x.com/jonoringer/status/2111826193578070439). The changelog's oldest
  entry is dated 2026-10-17. — `docs-confirmed` · [changelog](https://sandboxer.com/changelog)
- **Legal entity.** "North Bay Opco I, Inc., a Delaware corporation whose mailing address is 777 Brickell Ave,
  Suite 500 PMB 1074, Miami, FL 33131" — `docs-confirmed` · [terms](https://sandboxer.com/terms). *PMB* denotes
  a private mailbox rather than an office. sandboxer.com itself publishes no team page, founder byline or
  registration number (`/about` returns 404, observed at <https://sandboxer.com/about>); §17 supplies those from
  the studio's site and a corporate index. — `inferred`
- **Who runs it.** The studio that lists Sandboxer as one of its companies names the person: "JO **Jon Oringer**
  @jonoringer · Shutterstock founder" — `third-party` · [northbayventures.com](https://www.northbayventures.com/).
  His own X profile reads: "Founder of @Shutterstock. Building @transformer_gg and @Sandboxer_" — `third-party` ·
  [X profile, @jonoringer](https://x.com/jonoringer). The same profile lists "Miami, FL" and
  "northbayventures.com", the domain of the studio whose site carries the same Miami address and the same legal
  entity as Sandboxer's terms — `third-party` · [X profile](https://x.com/jonoringer),
  [northbayventures.com](https://www.northbayventures.com/). Reading: the studio, its founder and the contracting
  entity are one operation; no separate CEO, board or team page is published. — `inferred`
- **The entity is shared with its sibling products.** The same name and Miami address appear in another product's
  terms: "These Terms of Service ("Terms") are an agreement between you and North Bay Opco I, Inc., a Delaware
  corporation whose mailing address is 777 Brickell Ave, Suite 500 PMB 1074, Miami, FL 33131 ("Transformer", "we",
  "us")." — `third-party` · [transformer.gg/terms](https://transformer.gg/terms). They also appear in a third
  product's policy: "**North Bay Opco I, Inc.** **Address:** 777 Brickell Ave, Suite 500 PMB 1074, Miami,
  Florida, USA" — `third-party` · [microdose.fun/privacy](https://microdose.fun/privacy). Reading: one studio
  operating several products through one entity, not a single-product company. — `inferred`; see §17.

## 2. Isolation technology, and what it allows

- **Cloud Hypervisor microVM, one kernel per sandbox.** "Each sandbox is a separate Cloud Hypervisor microVM
  with its own kernel. There is no shared kernel between sandboxes, unlike container-based platforms." —
  `docs-confirmed` · [security](https://sandboxer.com/docs/security)
- **Own kernel build.** "Ubuntu 24.04 LTS, our own kernel build" — `docs-confirmed` ·
  [machines](https://sandboxer.com/docs/machines)
- **Control channel is not on the network.** "The agent inside the VM talks to the host over **vsock**, not TCP.
  Nothing on the sandbox's network — including code you run as root — can reach the host's control API." —
  `docs-confirmed` · [security](https://sandboxer.com/docs/security)
- **Root and sudo.** "Inside it you are an ordinary Linux user with `sudo`." — `docs-confirmed` ·
  [machines](https://sandboxer.com/docs/machines)
- **systemd works, and survives restarts.** "Init | systemd — `systemctl enable` your services and they come
  back after a resume or fork" — `docs-confirmed` · [machines](https://sandboxer.com/docs/machines)
- **Docker, including BuildKit and Compose.** "Containers | Docker with BuildKit and Compose" — `docs-confirmed`
  · [machines](https://sandboxer.com/docs/machines). And: "Docker is pre-installed. kind/k3s work." —
  `docs-confirmed` · [FAQ](https://sandboxer.com/docs/faq)
- **Nested virtualisation is passed through.** "`/dev/kvm` is available: run Firecracker, QEMU/KVM or the
  Android emulator inside" — `docs-confirmed` · [machines](https://sandboxer.com/docs/machines). The same page
  warns "the inner guest's RAM comes out of yours" — `docs-confirmed` ·
  [machines](https://sandboxer.com/docs/machines).
- **Separate disks, fresh identity on copy.** "Each root disk is its own copy-on-write image; forks and
  snapshots are reflinks, never shared writable state" and "Forks regenerate the machine-id, SSH host keys and
  hostname, so copies can't impersonate each other." — `docs-confirmed` ·
  [security](https://sandboxer.com/docs/security)
- **What that practically buys you:** a real Docker daemon, systemd services that restart, `/dev/kvm` for
  emulators and nested hypervisors, and root for kernel-adjacent tooling. — `inferred` from the four items
  above.
- **What is not offered:** no GPU passthrough, no Windows, no custom kernel or image build; you customise from
  inside a VM and save a snapshot instead. "There's no SLA during early access, and no GPUs." —
  `docs-confirmed` · [llms.txt](https://sandboxer.com/docs/llms.txt). Kernel-module loading is not discussed. —
  `not-published`

## 3. Lifecycle: states, what survives, timers

**States.** "A new sandbox goes `provisioning → ready`. While an integrated agent works it shows `running`, then
`idle`. A stop moves it through `archiving` to `archived` (stopped). `error` and `cancelled` are the failure
states." — `docs-confirmed` · [docs](https://sandboxer.com/docs). The API schema carries more:
"enum: [init, provisioning, provisioned, cloning, ready, idle, running, archiving, archived, error, cancelled]"
— `docs-confirmed` · [openapi.yaml](https://sandboxer.com/openapi.yaml)

**Stop** — saves disk and memory, stops the meter.
"A stop: 1. freezes the filesystem so the disk image is consistent, 2. pauses the VM and writes its **memory and
device state** to disk, 3. shuts the VM down and stops the meter." — `docs-confirmed` ·
[snapshots](https://sandboxer.com/docs/snapshots). Hosted routes survive: "**Stop/resume:** routes and tokens
are kept." — `docs-confirmed` · [hosting](https://sandboxer.com/docs/hosting)

**Resume** — memory if a matching host is free, otherwise a cold boot.
"Memory is restored on a machine with the same CPU type as the one the sandbox stopped on. If a machine with
that CPU type is online but busy, the resume waits up to 2 minutes for it; if none is free by then (or none is
online), it boots from disk instead (files intact, running processes not kept) and says so" — `docs-confirmed` ·
[snapshots](https://sandboxer.com/docs/snapshots). Reasons are reported: "`memoryRestored` is `true` when memory
was restored and running processes were kept, and `false` when it booted from disk with your files intact." —
`docs-confirmed` · [snapshots](https://sandboxer.com/docs/snapshots)

**Resume with a size change** — always a cold boot.
"A resize resume cold-boots from disk instead of restoring memory (the memory image belongs to the old size)." —
`docs-confirmed` · [machines](https://sandboxer.com/docs/machines)

**Fork** — disk only, new identity.
"A fork copies the disk only, never memory or running processes, so its `memoryRestored` is null." —
`docs-confirmed` · [snapshots](https://sandboxer.com/docs/snapshots). "The fork boots fresh from that disk with
a **new identity**: new id, new subdomain, new machine-id and SSH host keys." — `docs-confirmed` ·
[snapshots](https://sandboxer.com/docs/snapshots). The fork does not inherit the TTL: "It does **not** inherit
the source's TTL — the default one hour applies unless you pass one" — `docs-confirmed` ·
[snapshots](https://sandboxer.com/docs/snapshots).

**Delete** — removes disk, memory and automatic snapshots; named snapshots survive.
"Delete a sandbox permanently: its disk, memory and automatic snapshots go (named snapshots saved from it
stay)." — `docs-confirmed` · [mcp](https://sandboxer.com/docs/mcp)

**Snapshots off** — a stop erases the sandbox.
"Create with `--no-snapshots` (`"snapshots": false`) for throwaway work: nothing is captured in the background,
and stopping the sandbox erases it. Such a sandbox can't be resumed, forked or saved as a template." —
`docs-confirmed` · [snapshots](https://sandboxer.com/docs/snapshots)

**Zero data retention** — a stop deletes the data.
"**Zero data retention** (account setting) deletes the data of every archived sandbox and every named snapshot
instead of keeping it." — `docs-confirmed` · [security](https://sandboxer.com/docs/security)

**Idle auto-pause** — a soft timer that keeps memory and wakes on use.
"a sandbox nobody is using pauses itself with its memory (after 15 to 120 minutes depending on the plan;
`idleStopMinutes`, 0 = never) and wakes on the next API call or request to its URL" — `docs-confirmed` ·
[llms.txt](https://sandboxer.com/docs/llms.txt). Per plan: "Free trial | 15", "$20 / month | 30", "$100 and
$500 / month | 60", "$2,000 / month | 120" — `docs-confirmed` ·
[long-running](https://sandboxer.com/docs/long-running)

**Auto-stop (TTL)** — a hard deadline.
"Every sandbox has a time-to-live. When it runs out we stop the sandbox (memory and disk are kept; billing
stops)." — `docs-confirmed` · [long-running](https://sandboxer.com/docs/long-running). Range: "`ttlSeconds` |
1 s – 30 days, or `null`" — `docs-confirmed` · [limits](https://sandboxer.com/docs/limits)

**Published timings.** "20 sequential creates of the `default` size took a median of **0.69 s** from the create
call to `ready`, and 0.69–1.15 s for 90% of them (2026-10-27)." — `docs-confirmed` ·
[machines](https://sandboxer.com/docs/machines). "`large` and `xlarge`, and creates from a snapshot, boot as
before, in about 1.5 s." — `docs-confirmed` · [machines](https://sandboxer.com/docs/machines). Fork: "an
independent copy, created in about a second" — `docs-confirmed` ·
[quickstart](https://sandboxer.com/docs/quickstart). Resume: "resume it in seconds" — `docs-confirmed` ·
[docs](https://sandboxer.com/docs); **no measured resume figure is published** — `not-published`. Wake on a
hosted URL: "the request is held while it resumes (up to 45 seconds, then `503` with `Retry-After`)" —
`docs-confirmed` · [hosting](https://sandboxer.com/docs/hosting)

**Recovery from a hung machine.** "Recover a sandbox that stopped responding" / "Power-cycle the machine of a
sandbox that stopped answering. The disk is not touched." — `docs-confirmed` ·
[openapi.yaml](https://sandboxer.com/openapi.yaml)

## 4. State tools: snapshots, forks, templates, volumes

- **Three different things are called a snapshot.** "**Stop snapshot** (disk + memory) | You stop a sandbox, or
  auto-stop does"; "**Continuous snapshots** (disk) | Every 10 minutes while a sandbox runs, and at every stop";
  "**Named snapshots** (templates) | You save one with a name". — `docs-confirmed` ·
  [snapshots](https://sandboxer.com/docs/snapshots)
- **Two automatic snapshots are kept.** "each sandbox keeps its latest two" — `docs-confirmed` ·
  [snapshots](https://sandboxer.com/docs/snapshots)
- **All are copy-on-write reflinks.** "All of them are copy-on-write reflinks on the node's filesystem: making
  one is O(1) in time and space until blocks change." — `docs-confirmed` ·
  [snapshots](https://sandboxer.com/docs/snapshots)
- **Fork is disk-only and not live.** "A fork is a new, independent sandbox made from a copy of the source's
  disk as it is at that moment." — `docs-confirmed` · [snapshots](https://sandboxer.com/docs/snapshots). Their
  own guide asks the question directly: "Can You Fork a Running Cloud Sandbox, Memory and All?" and answers
  "No." — `docs-confirmed` ·
  [guide](https://sandboxer.com/guides/fork-a-running-sandbox-with-memory)
- **Templates are named snapshots, with versions and share codes.** "`sbx snapshot sb_k3v9x2mq web-stack` # save
  (re-using a name replaces it)" and "`sbx new --from web-stack` # deploy it, as many times as you like" —
  `docs-confirmed` · [snapshots](https://sandboxer.com/docs/snapshots). A share code strips credentials:
  "Your logins, API keys, secret files, repository credentials and SSH keys are removed from it; all other files
  come across." — `docs-confirmed` · [snapshots](https://sandboxer.com/docs/snapshots)
- **Snapshots can be browsed and downloaded while stopped.** "`sbx snapshot tree <snapshotId>` # files and
  sizes, while stopped" and "`sbx snapshot pull <snapshotId> -o ./restore` # download home_user/ and docker/" —
  `docs-confirmed` · [snapshots](https://sandboxer.com/docs/snapshots)
- **What a snapshot holds.** "Everything on the disk: `/home/user`, `/etc`, installed packages, Docker images
  and volumes" is saved; "Memory and running processes (stop snapshots only)" is the exception; "Hosted-port
  tokens on a fork (re-run `sbx host`)" is not saved. — `docs-confirmed` ·
  [snapshots](https://sandboxer.com/docs/snapshots)
- **No separate volume, image-registry or Dockerfile-build product.** Storage is the VM disk; persistence is the
  whole disk. `volumes` appear only as Docker volumes inside it. — `inferred` from the absence of any volume or
  image endpoint in [openapi.yaml](https://sandboxer.com/openapi.yaml) and from the storage model in
  [billing](https://sandboxer.com/docs/billing)

## 5. Machine sizes, GPU, architecture, regions

The four rows below are quoted from the pricing table: "| `small` | 2 | 4 GB | 12 GB | 0.5× | $0.018 | $13.14
|", "| `default` | 4 | 8 GB | 50 GB | 1× | $0.036 | $26.28 |", "| `large` | 8 | 16 GB | 125 GB | 2× | $0.072
| $52.56 |", "| `xlarge` ($100+ plan) | 16 | 32 GB | 251 GB | 5.56× | $0.20 | $146 |" — `pricing-page` ·
[pricing.md](https://sandboxer.com/pricing.md)

| Size | vCPU | RAM | Disk for your files | Rate | $/hour | Their 730 h figure |
|---|---|---|---|---|---|---|
| `small` | 2 | 4 GB | 12 GB | 0.5× | $0.018 | $13.14 |
| `default` | 4 | 8 GB | 50 GB | 1× | $0.036 | $26.28 |
| `large` | 8 | 16 GB | 125 GB | 2× | $0.072 | $52.56 |
| `xlarge` | 16 | 32 GB | 251 GB | 5.56× | $0.20 | $146 |

The rendered page rounds the same figures: "| small | 2 | 4 GB | 12 GB | 0.5× | $0.018 | $13 |" — `pricing-page`
· [pricing](https://sandboxer.com/pricing)

- **No custom sizes.** "Moving to a smaller size isn't supported yet. To go smaller, create a new sandbox of that
  size and copy your files across" — `docs-confirmed` · [machines](https://sandboxer.com/docs/machines)
- **CPU is shared, RAM is not.** "vCPUs are shared; RAM is reserved for the sandbox." — `pricing-page` ·
  [pricing](https://sandboxer.com/pricing)
- **Disk is on top of the OS image.** ""Disk" is space for your files, added on top of the OS image; the OS and
  pre-installed tools don't count against it." — `docs-confirmed` ·
  [machines](https://sandboxer.com/docs/machines). The same paragraph gives the effect: "a `small` sandbox's
  root disk is the image (about 6–7 GB) plus 12 GB, about 19 GB." — `docs-confirmed` ·
  [machines](https://sandboxer.com/docs/machines)
- **`xlarge` is gated by plan.** "`xlarge` requires the $100 plan or higher." — `pricing-page` ·
  [billing](https://sandboxer.com/docs/billing)
- **No GPUs.** "You need GPUs. Sandboxer has none." — `docs-confirmed` ·
  [llms.txt](https://sandboxer.com/docs/llms.txt)
- **Architecture.** No architecture is published as a product attribute; every documented instance and image is
  x86_64, for example "install the Android command-line tools and an `x86_64` system image" — `inferred` from
  [llms.txt](https://sandboxer.com/docs/llms.txt). ARM instances are not offered anywhere in the docs. —
  `not-published`
- **Two regions.** "`us-east` | US East: Ashburn, Virginia" and "`eu-central` | EU Central: Helsinki, Finland" —
  `docs-confirmed` · [regions](https://sandboxer.com/docs/regions)
- **Region is picked for you by IP.** "A new sandbox goes to the region nearest you, judged from the country of
  your IP address." — `docs-confirmed` · [regions](https://sandboxer.com/docs/regions). Pinning: "A fork runs in
  its source sandbox's region." — `docs-confirmed` · [regions](https://sandboxer.com/docs/regions)

## 6. Networking

**Inbound**

- **HTTPS per port, on a stable hostname.** "Any TCP service inside a sandbox can be published on a stable HTTPS
  address" — `docs-confirmed` · [hosting](https://sandboxer.com/docs/hosting). The hostname pattern is
  `https://<subdomain>-<port>.box.sandboxer.com`, and "It stays the same across stop, resume and resize, so links
  you share keep working." — `docs-confirmed` · [hosting](https://sandboxer.com/docs/hosting)
- **Private by default, token in the URL.** "Private (default) | `https://…-3000.box.sandboxer.com?_token=…` |
  Anyone with the full URL." — `docs-confirmed` · [hosting](https://sandboxer.com/docs/hosting). Public mode
  clears the token: "`sbx host sb_k3v9x2mq 3000 --public` # make it public (clears the token)" —
  `docs-confirmed` · [hosting](https://sandboxer.com/docs/hosting)
- **A public IPv6 address per sandbox, firewall closed.** "public IPv6 address per sandbox" — `docs-confirmed` ·
  [machines](https://sandboxer.com/docs/machines). "whose firewall (`ufw`) is **closed except SSH** by default.
  Open a port with `sudo ufw allow <port>`" — `docs-confirmed` ·
  [security](https://sandboxer.com/docs/security)
- **No inbound IPv4 except SSH and hosted ports.** "Internet → sandbox IPv4 | Only the SSH port forward
  (`sshEndpoint`) and hosted ports; nothing else can address the VM" — `docs-confirmed` ·
  [security](https://sandboxer.com/docs/security)
- **Custom domains are DIY.** "First-class custom domains are on the roadmap." — `docs-confirmed` ·
  [hosting](https://sandboxer.com/docs/hosting). The workaround given is "Point a CNAME at the hosted hostname
  and terminate TLS yourself" — `docs-confirmed` · [hosting](https://sandboxer.com/docs/hosting)
- **Raw TCP inbound: only over the SSH tunnel.** "`sbx forward sb_k3v9x2mq --remote 5432` # psql -h 127.0.0.1 -p
  5432" — `docs-confirmed` · [ssh](https://sandboxer.com/docs/ssh). No public raw-TCP endpoint is documented. —
  `not-published`

**Outbound**

- **Open internet, no allowlist.** "Sandbox → internet | Allowed (IPv4 via NAT, IPv6 direct)" — `docs-confirmed`
  · [security](https://sandboxer.com/docs/security). And: "There is no **egress** allowlist, domain filter or
  outbound firewall setting in Sandboxer. Outbound traffic is open by default." — `docs-confirmed` ·
  [guide](https://sandboxer.com/guides/what-can-reach-a-sandbox-and-what-it-can-reach)
- **No static IP; egress IP is shared.** "Outbound traffic shares the node's IPv4 address and IPv6 /64 with the
  other sandboxes on that node, so outside services that rate-limit per IP (Docker Hub pulls, speed tests) see
  one shared limit." — `docs-confirmed` · [security](https://sandboxer.com/docs/security)
- **SMTP 25 blocked.** "Sandbox → SMTP port 25 | Blocked (use your mail provider's submission port)" —
  `docs-confirmed` · [security](https://sandboxer.com/docs/security)
- **Sandboxes cannot reach each other.** "Sandbox → another sandbox | **Blocked** — VMs have no shared bridge" —
  `docs-confirmed` · [security](https://sandboxer.com/docs/security). The suggested alternative: "Connect them
  through [hosted URLs](/docs/hosting), which work from anywhere, with your own authentication." —
  `docs-confirmed` · [FAQ](https://sandboxer.com/docs/faq)

**Secrets and credentials**

- **An environment is the injection mechanism.** "An **environment** is the starting kit a sandbox receives
  when it is created." — `docs-confirmed` · [environments](https://sandboxer.com/docs/environments). It bundles
  "**Variables** — a `.env`-style list, exported to every process in the sandbox." and "**Secret files** — files
  written into the home directory (a service-account JSON, `~/.npmrc`, a kubeconfig)." and "**Repositories** —
  GitHub repos cloned into `/home/user` with a base branch and optional setup script." — `docs-confirmed` ·
  [environments](https://sandboxer.com/docs/environments)
- **Per-sandbox values win.** "`env` on create (or `-e` on the CLI) adds variables to **one** sandbox, on top of
  its environment. On a name clash the per-sandbox value wins." — `docs-confirmed` ·
  [environments](https://sandboxer.com/docs/environments)
- **A secrets API exists.** "The simplest integration is `GET`/`POST /secrets`, which reads or replaces the
  default environment's `.env` contents and secret files in one call." — `docs-confirmed` ·
  [environments](https://sandboxer.com/docs/environments)
- **A "no secrets" mode.** "`--safe-for-third-parties` | **Master switch.** When on, the sandbox gets nothing of
  yours and the switches above are ignored" — `docs-confirmed` · [environments](https://sandboxer.com/docs/environments).
  And: "It receives no variables, files or credentials of yours and cannot act on your account or your other
  sandboxes." — `docs-confirmed` · [environments](https://sandboxer.com/docs/environments)
- **Removing a secret deletes it from disk.** "Removing a secret from an environment and upgrading **deletes** it
  from the sandboxes' disks; it doesn't just hide it." — `docs-confirmed` ·
  [security](https://sandboxer.com/docs/security)
- **No secret-manager or short-lived-credential brokering product.** There is no vault, and no OIDC or workload
  identity exchange; secrets are written into the VM. — `inferred` from the environments page, which lists only
  variables, files, repositories and credential switches ([environments](https://sandboxer.com/docs/environments)),
  and from the API surface ([openapi.yaml](https://sandboxer.com/openapi.yaml)), which has no secret-broker
  endpoint.

## 7. Interfaces

- **REST API.** "`https://sandboxer.com/api/v1`" and "`https://api.sandboxer.com/v1` is an alias." —
  `docs-confirmed` · [api](https://sandboxer.com/docs/api)
- **SDKs.** "Typed clients generated from the same OpenAPI document" — `docs-confirmed` ·
  [api](https://sandboxer.com/docs/api) — published as `sandboxer-sdk` (TypeScript) and `sandboxer` (Python) on
  the same page.
- **CLI.** "`sbx` is one static binary for Linux, macOS and Windows." — `docs-confirmed` ·
  [cli](https://sandboxer.com/docs/cli)
- **MCP server.** "Hosted at `https://sandboxer.com/mcp` (Streamable HTTP). Nothing to install." and "**Local**
  with `sbx mcp` (or `npx sandboxer-mcp`), a stdio server that ships with the CLI. It has the same 18 tools plus
  `handoff_session`" — `docs-confirmed` · [mcp](https://sandboxer.com/docs/mcp)
- **SSH and SCP.** "The CLI keeps a dedicated key at `~/.ssh/sandboxer_ed25519`, authorizes it on the sandbox the
  first time, and pins the sandbox's host key." — `docs-confirmed` · [ssh](https://sandboxer.com/docs/ssh)
- **Web terminal.** "The dashboard's **Terminal** tab opens a full PTY in your browser over the same exec
  WebSocket the CLI uses" — `docs-confirmed` · [ssh](https://sandboxer.com/docs/ssh)
- **Desktop.** "Every running sandbox has a graphical desktop (XFCE with Google Chrome) that you can open in a
  browser tab." — `docs-confirmed` · [desktop](https://sandboxer.com/docs/desktop). Transport: "Today every
  desktop streams over **VNC** (noVNC over plain HTTPS)" — `docs-confirmed` ·
  [desktop](https://sandboxer.com/docs/desktop)
- **Browser-only stream.** "Streams only Chrome (tabs and address bar, no desktop around it) — useful to embed a
  "remote browser" in your own product." — `docs-confirmed` · [desktop](https://sandboxer.com/docs/desktop)
- **Browser automation.** "Every Sandboxer VM has Google Chrome installed." — `docs-confirmed` ·
  [llms.txt](https://sandboxer.com/docs/llms.txt)
- **Webhooks.** "Get a signed HTTPS request when a sandbox becomes ready, errors, stops, finishes hydrating,
  degrades or recovers." — `docs-confirmed` · [webhooks](https://sandboxer.com/docs/webhooks). Events:
  "`sandbox.ready`", "`sandbox.error`", "`sandbox.archived`", "`sandbox.hydrated`", "`sandbox.degraded`",
  "`sandbox.recovered`" — `docs-confirmed` · [webhooks](https://sandboxer.com/docs/webhooks)
- **Event stream.** The events endpoint serves Server-Sent Events: "curl -N -sS
  https://sandboxer.com/api/v1/sandboxes/sb_k3v9x2mq/events" with "Accept: text/event-stream" — `docs-confirmed`
  · [agents](https://sandboxer.com/docs/agents)
- **OpenTelemetry.** A `/telemetry` endpoint exists in the API description — `docs-confirmed` ·
  [openapi.yaml](https://sandboxer.com/openapi.yaml). A dedicated docs page is linked from the docs index. —
  `docs-confirmed` · [docs](https://sandboxer.com/docs)
- **Daytona-compatible API.** "Sandboxer has a second API that speaks Daytona's." — `docs-confirmed` ·
  [daytona](https://sandboxer.com/docs/daytona). Tested clients: "We test the official TypeScript and Python SDKs
  (`@daytonaio/sdk` and `daytona` 0.225.0) against this API end to end" — `docs-confirmed` ·
  [daytona](https://sandboxer.com/docs/daytona)

## 8. Agent features

- **Six harnesses pre-installed in every sandbox.** "Claude Code, Codex, OpenCode, Pi, Kimi Code and Mistral
  Vibe are installed in every sandbox" — `docs-confirmed` · [llms.txt](https://sandboxer.com/docs/llms.txt).
  Prime Agent is not: "Coming soon: not installed in sandboxes yet" — `docs-confirmed` ·
  [agents](https://sandboxer.com/docs/agents)
- **Prompt them over the API.** "The call returns at once with `promptId`, `conversationId` and `status:
  "queued"`." — `docs-confirmed` · [agents](https://sandboxer.com/docs/agents). Steering support is stated per
  harness. Claude Code, Codex and Pi get native steering; OpenCode gets interrupt-and-continue, described in the
  table as "Steering by interrupt-and-continue" — `docs-confirmed` · [agents](https://sandboxer.com/docs/agents)
- **Model catalog is live.** "`GET /provider-models` returns the live catalog: each harness's models, the
  reasoning-effort levels each model accepts, and which models support fast mode." — `docs-confirmed` ·
  [agents](https://sandboxer.com/docs/agents)
- **Bring your own provider keys.** "Add provider credentials on the dashboard's **Agents** page — an API key per
  provider (subscription sign-in is coming)" — `docs-confirmed` · [agents](https://sandboxer.com/docs/agents).
  "`noEnv` sandboxes never do; give those their own key with `env`" — `docs-confirmed` ·
  [agents](https://sandboxer.com/docs/agents)
- **Agent tokens are billed by the model provider, not by Sandboxer.** The only billing mention for model usage
  is fast mode, "billed by the provider at its fast rate" — `docs-confirmed` ·
  [agents](https://sandboxer.com/docs/agents); Sandboxer's own meter is machine time, per
  [billing](https://sandboxer.com/docs/billing). The conclusion that Sandboxer takes no cut of model usage is
  `inferred`.
- **Agents get computer-use tools.** "Integrated agents get `computer` tools — screenshot, move, click, type,
  scroll — that act on this same screen." — `docs-confirmed` · [desktop](https://sandboxer.com/docs/desktop)
- **Session handoff.** "Move this machine's Claude Code or Codex session and its repo into a new sandbox and
  resume the agent there, headless ("close my laptop")." — `docs-confirmed` · [mcp](https://sandboxer.com/docs/mcp)

## 9. Accounts, keys, limits, compliance

- **Organizations are shared wallets, not workspaces.** "An **organization** is a shared wallet: one plan, one
  balance, and the members who run sandboxes on it." — `docs-confirmed` ·
  [organizations](https://sandboxer.com/docs/organizations). And: "The organization is a **wallet, not a
  workspace**" — `docs-confirmed` · [organizations](https://sandboxer.com/docs/organizations)
- **Per-seat pricing for orgs.** "An organization plan is **per seat**: the plan price × seats." —
  `docs-confirmed` · [organizations](https://sandboxer.com/docs/organizations). Limits: "Concurrency and start
  limits are the plan's limits **multiplied by seats**, shared by all members." — `docs-confirmed` ·
  [organizations](https://sandboxer.com/docs/organizations)
- **Scoped API keys.** "A request is allowed only when **both** hold:" — `docs-confirmed` ·
  [api-keys](https://sandboxer.com/docs/api-keys); the two conditions are "its action is in the key's actions"
  and "its target sandbox is in the key's sandboxes — or in one of its environments" — `docs-confirmed` · same
  page. Presets: "`read-only`", "`full-sandbox`", "`ci`", "`admin`" — `docs-confirmed` ·
  [api-keys](https://sandboxer.com/docs/api-keys). Storage: "We store only a hash: the full secret is shown
  **once**, when you create or rotate it." — `docs-confirmed` · [api-keys](https://sandboxer.com/docs/api-keys)
- **Every sandbox carries its own key.** "Every sandbox gets `SANDBOXER_TOKEN`: a key limited to **that
  sandbox**." — `docs-confirmed` · [api-keys](https://sandboxer.com/docs/api-keys). Consequence: "If a sandbox is
  compromised, the blast radius is that sandbox." — `docs-confirmed` ·
  [api-keys](https://sandboxer.com/docs/api-keys)
- **Spend controls.** "Owners can also cap a member's machine time per billing period with the API:
  `PATCH /orgs/{orgId}/members/{userId}` with `usageCapSeconds`" — `docs-confirmed` ·
  [organizations](https://sandboxer.com/docs/organizations). Auto-refill and alerts: "Turn on **auto-refill** to
  buy packs automatically when your balance falls below a threshold (in hours)" — `docs-confirmed` ·
  [billing](https://sandboxer.com/docs/billing)
- **Hard limits.** "| $20 / month | 100 |" … "| $2,000 / month | 2,000 |" for active sandboxes, and "API calls
  (and hosted MCP calls) are limited to **600 a minute per API key**" — `docs-confirmed` ·
  [limits](https://sandboxer.com/docs/limits)
- **Audit log: not published.** No audit-log endpoint or page exists in the API list or the docs. The nearest
  thing is per-sandbox command history: "Commands run via `exec` / the API | 90 days" — `docs-confirmed` ·
  [long-running](https://sandboxer.com/docs/long-running). A separate account-level audit trail is absent from
  [openapi.yaml](https://sandboxer.com/openapi.yaml). — `not-published`
- **SSO / SAML / SCIM: not published.** No mention in docs, pricing, security or terms. Their own comparison
  pages cite SAML/SCIM as a competitor advantage: "Freestyle provides full Linux VMs with live forking, pause and
  resume, and SSH and domain routing, plus an Enterprise SLA and SAML/SCIM." — `docs-confirmed` ·
  [guide](https://sandboxer.com/guides/top-ai-sandbox-platforms-for-code-execution)
- **Data residency: only the region.** Two regions, and "Forks, and sandboxes made from a snapshot, stay in
  their source's region" — `docs-confirmed` · [changelog](https://sandboxer.com/changelog). No residency
  commitment, DPA summary or sub-processor list is published. — `not-published`
- **Compliance certifications: not published.** No SOC 2, ISO 27001 or HIPAA statement appears in the security
  page or the terms. What is published is a vulnerability policy: "Email **security@sandboxer.com** with a
  description, the steps to reproduce, and the impact you think it has." — `docs-confirmed` ·
  [security](https://sandboxer.com/docs/security)
- **Retention controls.** "**Close your account** on the dashboard's [Account](/app/account) page." and "For a
  GDPR request, choose **Erase permanently**" — `docs-confirmed` · [security](https://sandboxer.com/docs/security)

## 10. Pricing, exactly

**The model in plain words.** You prepay a monthly plan. The plan's dollars come back as *machine time*, so the
subscription is a minimum spend that converts into hours rather than a fee on top. Usage is metered per second
while a sandbox runs, at a fixed multiple of the `default` rate. The unit of account is `default`-seconds, and
"One dollar buys 100,000 of them" — `docs-confirmed` · [billing](https://sandboxer.com/docs/billing). Stopped
sandboxes cost nothing but count against an included storage quota. There is no free tier, no per-request
charge, no bandwidth charge and no snapshot charge.

**Every published price**

| Item | Price | Unit | Source and quote |
|---|---|---|---|
| `small` | $0.018 | per hour (0.5×) | [pricing](https://sandboxer.com/pricing): "| `small` | 2 | 4 GB | 12 GB | 0.5× | $0.018 | $13.14 |" |
| `default` | $0.036 | per hour (1×) | [pricing](https://sandboxer.com/pricing): "| `default` | 4 | 8 GB | 50 GB | 1× | $0.036 | $26.28 |" |
| `large` | $0.072 | per hour (2×) | [pricing](https://sandboxer.com/pricing): "| `large` | 8 | 16 GB | 125 GB | 2× | $0.072 | $52.56 |" |
| `xlarge` | $0.20 | per hour (5.56×) | [pricing](https://sandboxer.com/pricing): "| `xlarge` ($100+ plan) | 16 | 32 GB | 251 GB | 5.56× | $0.20 | $146 |" |
| Plans | $20 / $100 / $500 / $2,000 | per month | [pricing.md](https://sandboxer.com/pricing.md): "| $20 / month | 100 | 12 / 60 / 200 | 50 GB |" … "| $2,000 / month | 2,000 | 90 / 600 / 2,400 | 5 TB |" |
| Time pack | $20 | one-off, never expires | [pricing](https://sandboxer.com/pricing): "**Time packs:** $20 each at the same rates; they never expire." |
| Trial | $0 | 7 days, 25 hours, 2 sandboxes | [pricing](https://sandboxer.com/pricing): "7 days, 25 hours of machine time, up to 2 sandboxes at once on the small and default sizes" |
| Storage | included, not billed: 10 GB / 50 GB / 250 GB / 1 TB / 5 TB | GB | [billing](https://sandboxer.com/docs/billing): "Storage isn't billed: each plan includes an amount for what you keep" |
| Egress | not billed | — | [pricing](https://sandboxer.com/pricing): "Do you bill bandwidth? No." |
| Named snapshots | no separate charge | — | [pricing](https://sandboxer.com/pricing): "They have no separate charge." |
| Extra seats | plan price × seats | per seat | [organizations](https://sandboxer.com/docs/organizations): "An organization plan is **per seat**: the plan price × seats." |

**The meter**

- "Metering is per second, from the moment a sandbox is up until it is stopped." — `docs-confirmed` ·
  [billing](https://sandboxer.com/docs/billing)
- Rate multipliers: "`small` | 0.5×", "`default` | 1×", "`large` | 2×", "`xlarge` | ≈5.56× (50/9)" —
  `docs-confirmed` · [billing](https://sandboxer.com/docs/billing)
- "One dollar buys 100,000 of them, so a `large` sandbox running ten minutes uses 1,200 seconds." —
  `docs-confirmed` · [billing](https://sandboxer.com/docs/billing)
- **No minimum and no rounding rule is stated.** Billing is per second with no published minimum charge or
  rounding increment. — `docs-confirmed` for per-second; `not-published` for rounding.
- **Stopped time is free, including a refused stop.** "Time while stopped is never counted. Time after a refused
  stop isn't either — if we can't snapshot your sandbox we keep it running for you at no charge until we can." —
  `docs-confirmed` · [billing](https://sandboxer.com/docs/billing)
- **What storage counts.** "each plan includes an amount for what you keep, **sandboxes that aren't running**
  (stopped or failed: their disk, memory and automatic snapshots) and **named snapshots**" — `docs-confirmed` ·
  [billing](https://sandboxer.com/docs/billing). Measurement: "It's measured as the data beyond the shared OS
  image, about every 10 minutes." — `docs-confirmed` · [billing](https://sandboxer.com/docs/billing)
- **Included time does not roll over.** "Included time renews each billing month and does **not** roll over." —
  `docs-confirmed` · [billing](https://sandboxer.com/docs/billing)
- **Plan time is spent before packs.** "Plan time is always spent first, then packs." — `docs-confirmed` ·
  [billing](https://sandboxer.com/docs/billing)
- **Running out.** "Running sandboxes keep running for a **24 hour grace period**, so you can top up before
  anything stops." — `docs-confirmed` · [billing](https://sandboxer.com/docs/billing)
- **Storage overage is a quota, not a charge.** "At or over it, new sandboxes (including from templates and share
  codes), forks and named-snapshot saves answer `402 storage_limit_reached` until you delete stopped sandboxes or
  named snapshots, or upgrade." — `docs-confirmed` · [billing](https://sandboxer.com/docs/billing)
- **The trial converts automatically.** "When the 7 days end, the trial becomes the $20/month plan and your card
  is charged." — `docs-confirmed` · [billing](https://sandboxer.com/docs/billing)

## 11. Worked cost examples

Prices used: `small` $0.018/h, `default` $0.036/h; $1 = 100,000 `default`-seconds, so one `default`-second costs
$0.00001 and a `small` second costs $0.000005.

### (A) 1,000 agent tasks a month, 10 minutes each, 2 vCPU / 4 GiB, deleted after each

That is exactly the `small` size (2 vCPU / 4 GB / 12 GB) — no substitution needed.

```
10 min                  = 600 s
cost per task           = 600 s × $0.018 / 3600 s = $0.003
1,000 tasks             = 1,000 × $0.003          = $3.00

cross-check in default-seconds:
1,000 × 600 s × 0.5     = 300,000 default-seconds
300,000 ÷ 100,000 per $ = $3.00
```

**Machine time used: $3.00.** The $20 plan includes "≈555 h of default included" — `pricing-page` ·
[pricing](https://sandboxer.com/pricing) — so this workload uses about 15% of the cheapest plan. **The bill is
still $20**, because $20/month is the entry price and there is no free tier. Starts are not a constraint: 1,000 creates ≈ 33/day against the plan's 200/day limit. Deleting each
sandbox adds nothing; a stopped sandbox costs no machine time.

### (B) One always-on dev box, 4 vCPU / 8 GiB / 50 GiB, 730 h a month

That is exactly the `default` size. The brief's 730 h is the usual 24×365÷12 month.

```
730 h × $0.036/h = $26.28
cross-check: 730 × 3600 = 2,628,000 default-seconds ÷ 100,000 = $26.28
```

**Machine time used: $26.28.** Plans are bought in $20 units and packs are $20 each, so the cash outlay is
**$40**: the $20 plan covers ≈555 h and one $20 pack covers the remaining ≈175 h. Packs never expire, so the
unused ≈380 h (≈$13.72) carries into later months. Sandboxer's own table agrees on the usage figure: "One
`default` sandbox around the clock | 730 h | $26.28 — the $20 plan plus one pack" — `pricing-page` ·
[billing](https://sandboxer.com/docs/billing).

### (C) One persistent box, 2 vCPU / 4 GiB / 20 GiB disk, 3 h a day for 30 days, stopped otherwise

The month is **720 h** (30 × 24). The box runs **90 h** (3 × 30) and is stopped for **630 h**.

**No 20 GiB size exists.** Disk is fixed per size: `small` is 12 GB, `default` is 50 GB. Using the nearest size
below the ask (`small`) and the nearest above (`default`):

```
elapsed                  = 30 × 24            = 720 h
running                  = 3 × 30             =  90 h
stopped, free            = 720 − 90           = 630 h

small   (2 vCPU / 4 GB / 12 GB):  90 h × $0.018 = $1.62
default (4 vCPU / 8 GB / 50 GB):  90 h × $0.036 = $3.24
```

**Machine time used: $1.62 on `small`, $3.24 on `default`.** The 630 stopped hours are billed at zero. The bill
is $20 either way, and the leftover is plan time that expires at month end (plan time does not roll over; packs
do). The 90 h is itself an upper bound: with the $20 plan's default `idleStopMinutes` of 30, an idle box pauses
itself and stops billing before three hours elapse. Its used data — up to 12 GB on `small`, 50 GB on `default` —
sits inside the 50 GB included storage.

**What the three examples show.** The meter is cheap at this scale; the $20 monthly minimum, not the hourly rate,
is what a small workload actually costs. Usage starts to matter once you exceed ≈555 `default`-hours a month or
run many sandboxes at once.

## 12. Same word, different meaning

**sandbox** — a whole VM with its own kernel.
"Each one is a real virtual machine, not a container" — `docs-confirmed` · [docs](https://sandboxer.com/docs).
A reader may assume a container or a process jail; here Docker, systemd, `/dev/kvm` and root all work, and
creation takes ~0.7–1.5 s rather than milliseconds. — `inferred`

**stop** — snapshot of disk **and** memory, then power off.
"pauses the VM and writes its **memory and device state** to disk" — `docs-confirmed` ·
[snapshots](https://sandboxer.com/docs/snapshots). A reader may assume *kill the process*; here the dev server,
database and half-finished agent turn are still there on resume — if memory was restored. — `inferred`

**archived** — the *stopped* state, not cold storage or deletion.
"A stop moves it through `archiving` to `archived` (stopped)." — `docs-confirmed` ·
[docs](https://sandboxer.com/docs). An archived sandbox is resumable and costs nothing; deleting is a separate
call. — `inferred`

**resume** — memory restore **if** a same-CPU-type machine is free, otherwise a cold boot.
"`memoryRestored` is `true` when memory was restored and running processes were kept, and `false` when it booted
from disk with your files intact." — `docs-confirmed` · [snapshots](https://sandboxer.com/docs/snapshots). A
reader may assume a full restore; a resize resume is always a cold boot. — `inferred`

**snapshot** — three different objects.
"**Stop snapshot** (disk + memory)", "**Continuous snapshots** (disk)", "**Named snapshots** (templates)" —
`docs-confirmed` · [snapshots](https://sandboxer.com/docs/snapshots). Only a stop snapshot contains memory; only
a named snapshot can start new sandboxes. — `inferred`

**fork** — a copy-on-write copy of the disk only, booting fresh.
"A fork copies the disk only, never memory or running processes" — `docs-confirmed` ·
[snapshots](https://sandboxer.com/docs/snapshots). A reader may expect a live clone including RAM; plan for a
cold start in the fork. — `inferred`

**persistent** — the whole disk persists while stopped, for free, within quota.
"Leave it running for a week, stop it for a month, resume it in seconds" — `docs-confirmed` ·
[docs](https://sandboxer.com/docs). A reader may expect a mounted volume or an always-on machine; here `/etc`,
packages, Docker images and volumes all survive, and *persistent* does not mean *always on*. — `inferred`

**template** — a named snapshot of a disk.
"Install your stack once, save it, and start every new sandbox from it." — `docs-confirmed` ·
[snapshots](https://sandboxer.com/docs/snapshots). A reader may expect a Dockerfile or image build; there is no
build pipeline, you customise by hand inside a VM. — `inferred`

**environment** — a bundle of variables, secret files, repositories and credential switches.
"An **environment** is the starting kit a sandbox receives when it is created." — `docs-confirmed` ·
[environments](https://sandboxer.com/docs/environments). A reader may expect an OS image or a deployment target;
the docs warn that "`--environment` and `--env` are different things" — `docs-confirmed` · same page.

**idle pause vs auto-stop** — two separate timers.
"Pausing is a stop **with memory**" — `docs-confirmed` · [long-running](https://sandboxer.com/docs/long-running);
"Auto-stop (below) stays the hard limit either way." — `docs-confirmed` ·
[long-running](https://sandboxer.com/docs/long-running). Auto-stop defaults to one hour, so a forgotten sandbox
stops even if it is busy; the work is kept in memory. — `inferred`

**storage** — a free quota, measured as data beyond the shared OS image.
"Storage isn't billed" — `docs-confirmed` · [billing](https://sandboxer.com/docs/billing), but "going over never
deletes anything: new sandboxes wait instead." — `docs-confirmed` · [billing](https://sandboxer.com/docs/billing).
A reader may expect a billed disk; here it is free but finite, and over quota it blocks creates. — `inferred`

**plan** — prepaid machine time plus concurrency.
"The plan fee is not a fee on top: every dollar comes back as machine time." — `docs-confirmed` ·
[billing](https://sandboxer.com/docs/billing). A reader may expect a feature tier; the $20 is credit, and also a
floor — light use still costs $20/month. — `inferred`

**machine time** — a currency of `default`-seconds, not wall-clock.
"Your balance is counted in **seconds of `default` time**." — `docs-confirmed` ·
[billing](https://sandboxer.com/docs/billing). A `large` hour costs two machine-hours; a `small` hour costs
0.5. — `inferred`

**seat** — a member on an org plan; price × seats and limits × seats.
"An organization plan is **per seat**: the plan price × seats." — `docs-confirmed` ·
[organizations](https://sandboxer.com/docs/organizations). An org of five on the $20 plan pays $100/month. —
`inferred`

**4 vCPU** — shared, not dedicated.
"vCPUs are shared; RAM is reserved for the sandbox." — `pricing-page` · [pricing](https://sandboxer.com/pricing).
Noisy-neighbour effects are possible on CPU; memory is not shared. — `inferred`

## 13. Glossary candidates for newcomers

**microVM** — a virtual machine small and fast enough to start per task, but still with its own kernel, unlike a
container. **Cloud Hypervisor / KVM** — KVM is the Linux kernel's virtualisation feature; Cloud Hypervisor is the
program that uses it to run each VM. **`/dev/kvm`** — the device that lets a VM run other VMs; its presence is why
Android emulators and Firecracker work inside a sandbox. **vCPU vs reserved RAM** — shared CPU time versus memory
set aside for you. **snapshot** — a saved state; here disk, memory, or both, depending on which of three kinds you
mean. **memory snapshot / restore** — saving RAM so processes keep running across a stop; the opposite is a **cold
boot**. **reflink / copy-on-write** — a copy that shares unchanged blocks, so it is instant and nearly free until
data diverges. **fork** — a new sandbox from a copy of another's disk. **named snapshot / template** — a saved
disk you start new sandboxes from. **TTL (auto-stop)** — the deadline after which a sandbox stops itself.
**idle auto-pause** — a softer timer that pauses an unused sandbox with its memory and wakes it on the next
request. **machine time / default-seconds** — the billing currency; $1 = 100,000 default-seconds. **time pack** —
a $20 prepaid block of machine time that never expires. **hosted port / preview URL** — a public HTTPS address for
one port inside a sandbox. **`_token` / `__sbx_auth`** — the secret that makes a private preview URL private.
**`noEnv` / safe for third parties** — a sandbox stripped of your credentials. **environment version** — an
immutable record of the variables, files and repos a sandbox started with. **MCP (Model Context Protocol)** — the
standard by which Claude, ChatGPT, Cursor and Codex call tools; Sandboxer's MCP server is how a chat assistant
gets its own computer. **PTY** — a real terminal session, as opposed to one-shot command execution. **vsock** — a
private channel between a VM and its host that is not reachable over the network. **`ufw`** — the firewall inside
the VM, closed except SSH by default. **egress** — outbound traffic; here open, shared-IP, with port 25 blocked.

All terms are explained in the body above with their sources; this list is a reading order, not new claims.

## 14. Gaps, gotchas, contradictions

**Maturity and provenance**

1. **Ten days old at the time of writing.** "Sandboxer is live" — `third-party` ·
   [X, 2026-10-18](https://x.com/jonoringer/status/2111826193578070439); the changelog's oldest entry is
   2026-10-17 ([changelog](https://sandboxer.com/changelog)). I found no independent review, benchmark or case
   study — only the founder's posts, one positive reply ("I'm using Sandboxer! Onboarding was a snap and it "just
   works"", `third-party`, reply in [the launch thread](https://x.com/jonoringer/status/2111826193578070439))
   and one pricing objection ("the current approach to pricing would deter me (and I believe most agents)",
   `third-party`, same thread). No battleships.dev entry, as the brief notes.
2. **No company page.** `/about` 404s; the only identity is a Delaware entity at a Miami private mailbox, shared
   with unrelated products. Founders and headcount are `not-published`; the founder link rests on the X profile
   quoted in §1.
3. **Name collision.** An unrelated open-source project is also called Sandboxer: "Show HN: Sandboxer – Forkable
   code execution server for LLMs, agents, and devs" — `third-party` ·
   [HN, 2025-05-07](https://news.ycombinator.com/item?id=43912645). Search results mix them.

**Behaviour that contradicts the marketing gloss**

4. **"Resume keeps running processes" is conditional.** "Memory is restored on a machine with the same CPU type
   as the one the sandbox stopped on." — `docs-confirmed` · [snapshots](https://sandboxer.com/docs/snapshots).
   The fallback is a cold boot after two minutes.
5. **"fork instantly" is a disk fork.** "fork instantly" — `docs-confirmed` · [docs](https://sandboxer.com/docs);
   but "A fork copies the disk only, never memory or running processes" — `docs-confirmed` ·
   [snapshots](https://sandboxer.com/docs/snapshots).
6. **Auto-stop can stop a working sandbox.** "a running job keeps the sandbox awake but doesn't hold off
   auto-stop" — `docs-confirmed` ·
   [guide](https://sandboxer.com/guides/run-a-long-job-in-a-cloud-sandbox). The default TTL is one hour.
7. **Storage is free but can block you.** "At or over it, new sandboxes (including from templates and share
   codes), forks and named-snapshot saves answer `402 storage_limit_reached`" — `docs-confirmed` ·
   [billing](https://sandboxer.com/docs/billing).

**Small contradictions between pages**

8. **Where `us-east` is.** "`us-east` | US East: Ashburn, Virginia" — `docs-confirmed` ·
   [regions](https://sandboxer.com/docs/regions); but "From US-East (Leesburg, VA) through
   `https://sandboxer.com`, 20 sequential creates of the `default` size took a median of **0.69 s**" —
   `docs-confirmed` · [machines](https://sandboxer.com/docs/machines). Both are in the same metro, but the pages
   disagree.
9. **730-hour totals.** $13.14 / $26.28 / $52.56 / $146 in [pricing.md](https://sandboxer.com/pricing.md)
   against $13 / $26 / $53 / $146 on [pricing](https://sandboxer.com/pricing).
10. **State list.** The prose names eight states ([docs](https://sandboxer.com/docs)); the schema adds `init`,
    `provisioned` and `cloning` ([openapi.yaml](https://sandboxer.com/openapi.yaml)).
11. **Trial sandbox length.** "On the free trial, a sandbox can now run for up to 8 hours before it auto-stops,
    up from 2." — `docs-confirmed` · [changelog](https://sandboxer.com/changelog). Older prose on the same site
    says "sandboxes stop within 8 hours" — `pricing-page` · [pricing.md](https://sandboxer.com/pricing.md). The
    current value is 8 hours either way; only the history differs.

**Unpublished facts a buyer will ask about**

12. No measured **resume** time (only "in seconds"), no fork time beyond "about a second", and no p50/p99 for
    anything except create. — `not-published`
13. No **SLA**, no uptime commitment, no status-page history beyond 90 days: "No incidents in the last 90 days."
    — `third-party` · [status](https://status.sandboxer.com)
14. No **SSO/SAML/SCIM**, no account-level **audit log**, no **SOC 2 / ISO 27001 / HIPAA**, no published **DPA**
    or sub-processor list, no residency commitment beyond *which of two regions*. — `not-published`
15. No **GPU**, no **Windows**, no **ARM**, no **self-hosting**, no first-class **custom domains** ("on the
    roadmap"), no **static IPs**, no **egress allowlist**, no managed volumes or image registry. — `not-published`
    for each, with the roadmap exception quoted in §6.
16. No published price outside the four sizes, the plan ladder and the $20 packs — because there is nothing else
    to buy: "Do you bill bandwidth? No." — `pricing-page` · [pricing](https://sandboxer.com/pricing)
17. **What "25 hours of machine time" means** is not stated as default-hours or size-hours. If it is
    `default`-hours, the trial is 90,000 default-seconds ≈ $0.90 of list-price compute. — `inferred` from
    "25 hours of machine time" ([pricing](https://sandboxer.com/pricing)) and the $1 = 100,000 seconds rule
    ([billing](https://sandboxer.com/docs/billing)).

## 15. Non-technical usability

**There is a dashboard, but it is a control panel, not a builder.** It lives at
[sandboxer.com/app](https://sandboxer.com/app), and opening it signed out gives "Sign in to Sandboxer" with
"Continue with GitHub" and "Continue with Google", plus an email-and-password form — `docs-confirmed` ·
[app](https://sandboxer.com/app). Documented surfaces inside it: a sandbox list with a countdown (labelled
*Stops in*) and an **Extend** button — "The dashboard shows a countdown … on every sandbox with an **Extend**
button." — `docs-confirmed` · [long-running](https://sandboxer.com/docs/long-running); an **Open desktop** button
— "The dashboard has an **Open desktop** button on each running sandbox." — `docs-confirmed` ·
[desktop](https://sandboxer.com/docs/desktop); a **Terminal** tab (quoted in §7); **Billing** — "the dashboard's
**Billing** page, which shows your balance, a daily usage chart and your invoices" — `docs-confirmed` ·
[billing](https://sandboxer.com/docs/billing); **Environment**, **API keys**, **Webhooks**, **Agents** and
**Alerts** pages — `docs-confirmed` · [environments](https://sandboxer.com/docs/environments),
[api-keys](https://sandboxer.com/docs/api-keys), [webhooks](https://sandboxer.com/docs/webhooks),
[agents](https://sandboxer.com/docs/agents), [billing](https://sandboxer.com/docs/billing).

**Without writing code, the realistic path is a chat assistant, not the dashboard.** No template gallery, agent
preset or one-click task is documented; templates are made from a CLI or API and started with `sbx new --from`
(§4). The one genuinely no-code route is the hosted MCP server: "Apps like Claude and ChatGPT sign in with your
Sandboxer account (OAuth)." — `docs-confirmed` · [mcp](https://sandboxer.com/docs/mcp). The guide for Claude
states the outcome: "Claude can create Linux sandboxes, run commands, serve ports and delete them" —
`docs-confirmed` · [guide](https://sandboxer.com/guides/connect-claude-ai-to-a-cloud-computer). Watching or
driving the graphical desktop in a browser tab is the closest thing to a familiar computer (§7).

**Signup takes a credit card, not a waitlist.** "You need a card on file before you can start a sandbox." —
`docs-confirmed` · [billing](https://sandboxer.com/docs/billing). Without one, "Creating, forking or restoring a
sandbox answers `402 payment_method_required` until you add one." — `docs-confirmed` ·
[billing](https://sandboxer.com/docs/billing). Sign-in methods: "opens your browser so you can sign in with
GitHub, Google, an email code, or an email and password" — `docs-confirmed` ·
[quickstart](https://sandboxer.com/docs/quickstart). No waitlist or invite step is documented anywhere I
searched. — `not-published`

**Docs, support and status look unusually complete for a ten-day-old product.** The docs are a full tree of
about 30 pages with a Markdown mirror, `llms.txt`, an OpenAPI file, dozens of step-by-step app recipes, a 50-term
glossary and published benchmark methodology — `docs-confirmed` · [docs](https://sandboxer.com/docs),
[glossary](https://sandboxer.com/guides/sandbox-glossary). The changelog notes that "Every command was run on a
real sandbox." — `docs-confirmed` · [changelog](https://sandboxer.com/changelog). Support is email only: "Email
**support@sandboxer.com** with your `requestId` or sandbox id, or use the **Support** link on the dashboard." —
`docs-confirmed` · [FAQ](https://sandboxer.com/docs/faq). No chat, phone, forum, Discord or Slack is published. —
`not-published`. Status is a public page with per-service checks: "Checked every minute from outside our network"
— `third-party` (the vendor's own claim, hosted off its network) · [status](https://status.sandboxer.com);
current figures include "API _Operational_ 100.00% · 30 days" and "Sandboxes: create, run, pause and resume" at
"99.45% · 30 days" — `third-party` · [status](https://status.sandboxer.com).

**What would trip up a non-engineer**

1. **The card comes first.** You cannot try it, or see a sandbox, without payment details.
2. **It becomes a subscription on day 8.** "When the 7 days end, the trial becomes the $20/month plan and your
   card is charged." — `docs-confirmed` · [billing](https://sandboxer.com/docs/billing)
3. **Nothing is one-click.** Every documented workflow outside the chat-assistant route is a command — `sbx new`,
   `sbx host 3000`, `sbx prompt "…"` ([quickstart](https://sandboxer.com/docs/quickstart)). The desktop gives a
   familiar screen, but publishing a service still needs a CLI call.
4. **The one-hour default TTL** stops a sandbox you forgot about; the work survives in memory, but the URL stops
   answering until someone resumes it (§3).
5. **A private preview URL is a password.** "Treat a private URL like a password" — `docs-confirmed` ·
   [hosting](https://sandboxer.com/docs/hosting)
6. **Resume may not restore the session**, which is the promise a non-technical buyer will remember (§12).
7. **Sizing is a guess with no downgrade.** "Moving to a smaller size isn't supported yet." — `docs-confirmed` ·
   [machines](https://sandboxer.com/docs/machines)
8. **No Windows and no GPU**, so *run my desktop app* or *train a model* are out (§5).
9. **Org billing multiplies by people**: "An organization plan is **per seat**: the plan price × seats." —
   `docs-confirmed` · [organizations](https://sandboxer.com/docs/organizations)
10. **Email-only support, no SLA, ten-day-old vendor** — fine for experiments, risky as the only place work
    lives (§14).

## 16. Relationship to Boat (boat.dev)

The brief notes that Sandboxer's sizes, hourly prices and plan tiers match Boat's. They do, on price and plans.
They do not match on disk or on lifecycle. No public source I could find explains any relationship between the
two companies.

**What matches exactly — hourly prices**

"| `small` | **$0.018** | 2 vCPU | 4 GB | 51 GB |" and "| `default` | **$0.036** | 4 vCPU | 8 GB | 51 GB |" and
"| `large` | **$0.072** | 8 vCPU | 16 GB | 111 GB |" and "| `xlarge` \* | **$0.200** | 16 vCPU | 32 GB | 251
GB |" — `third-party` (Boat's docs) · [docs.<|place_holder_mm_span_0442|>/pricing](https://docs.boat.dev/pricing). Compare Sandboxer's
$0.018 / $0.036 / $0.072 / $0.20 in §5.

**What matches exactly — plan tiers and limits**

"| \$20/mo | 100 | 12 / 60 / 200 | 555 h of `default` (\$20) | 10 |" … "| \$2000/mo | 2,000 | 90 / 600 / 2,400
| 55,555 h of `default` (\$2000) | 1,000 |" — `third-party` · [docs.boat.dev/pricing](https://docs.boat.dev/pricing).
Sandboxer's plans and start limits are identical (§10).

**What matches exactly — the meter's framing**

"$20 buys 2,000,000 VM-seconds (about 555 hours) of dedicated 4 vCPU / 8 GB VM-time" — `third-party` ·
[boat.dev](https://boat.dev/). Sandboxer: "One dollar buys 100,000 of them" — `docs-confirmed` ·
[billing](https://sandboxer.com/docs/billing). Same rate, same 555-hour
framing.

**What does not match — disk, regions, retention, entity**

- Disk: Boat lists 51 GB for both `small` and `default` and 111 GB for `large`
  ([docs.boat.dev/pricing](https://docs.boat.dev/pricing)); Sandboxer lists 12 GB, 50 GB and 125 GB (§5).
- Regions: "EU regions today (Germany, Finland, France)." — `third-party` · [boat.dev](https://boat.dev/).
  Sandboxer has one US and one EU region (§5).
- Retention: "**A stopped sandbox keeps its disk for 14 days.** Then boat deletes the data, and the sandbox
  cannot resume." — `third-party` · [docs.boat.dev/pricing](https://docs.boat.dev/pricing). Sandboxer keeps
  stopped sandboxes "Until you delete them" — `docs-confirmed` · [FAQ](https://sandboxer.com/docs/faq).
- Entity: Boat is "the cloud sandbox service provided by Dedale AI, Corp." — `third-party` ·
  [boat.dev/terms](https://boat.dev/terms); its privacy policy says "Dedale AI, Corp. ("Dedale," "we," "us," or
  "our") provides boat." — `third-party` · [boat.dev/privacy](https://boat.dev/privacy). Sandboxer's contracting
  party is North Bay Opco I, Inc. (§1).

**What public sources say about a relationship: nothing.**

- Boat's privacy policy describes third-party products on Boat without naming any: "Some companies build their
  own products on boat. If you use one of these products, the company that runs it decides how it uses the data
  you give it, and its privacy notice applies to that data." — `third-party` ·
  [boat.dev/privacy](https://boat.dev/privacy)
- Boat's docs index never mentions Sandboxer: a case-insensitive search of
  [docs.boat.dev/llms.txt](https://docs.boat.dev/llms.txt) for *sandboxer* returns 0 matches, and
  [boat.dev/compare](https://boat.dev/compare) lists no such provider.
- Sandboxer's own corpus never mentions Boat: a case-insensitive search of
  [llms-full.txt](https://sandboxer.com/llms-full.txt) (2.4 MB, the whole docs corpus) for *boat* returns 0
  matches.
- Neither site, terms page, changelog nor comparison page states a partnership, resale, white-label or shared
  ownership. — `not-published`

**Reading.** Identical hourly prices and identical plan/limit ladders, on different disks, regions, retention
rules and legal entities, with no public explanation in either direction. That is consistent with a reseller or
white-label arrangement of the kind Boat's privacy policy describes, and equally consistent with a copied price
sheet. I could not distinguish these from public evidence. — `inferred`

---

## 17. The company behind it

**Legal entity and registration.** "North Bay Opco I, Inc., a Delaware corporation whose mailing address is 777
Brickell Ave, Suite 500 PMB 1074, Miami, FL 33131" — `docs-confirmed` · [terms](https://sandboxer.com/terms). The
privacy policy repeats the controller: "North Bay Opco I, Inc. is responsible for the personal information
described in this policy." — `docs-confirmed` · [privacy](https://sandboxer.com/privacy).

A third-party corporate index lists the registration: "NORTH BAY OPCO I, INC. — 7126691 2022-11-09", on a page
of companies represented by Corporation Service Company — `third-party` ·
[netstate.co](https://netstate.co/agents/us-de/corporation-service-company/p/14030). That gives a Delaware file
number (7126691) and an incorporation date (2022-11-09). **I could not confirm either against the registry
itself:** Delaware's entity search is behind a CAPTCHA and OpenCorporates returned a browser check, so the date
rests on an aggregator. — `not-published` for a primary confirmation.

**Who runs it.** The entity is a venture studio. Its own site says "A venture studio · Miami" and "We build
companies from zero to one." — `third-party` · [northbayventures.com](https://www.northbayventures.com/). The
model is stated plainly: "North Bay Ventures starts new companies and runs them through their earliest days." —
`third-party` · [northbayventures.com](https://www.northbayventures.com/). Sandboxer appears there under the
heading "Live", in a card headed "Sandboxer" that reads "The agent swarm platform." — `third-party` ·
[northbayventures.com](https://www.northbayventures.com/).

The person named is Jon Oringer: the studio's page lists "JO **Jon Oringer** @jonoringer · Shutterstock founder"
— `third-party` · [northbayventures.com](https://www.northbayventures.com/), and his X profile reads "Founder of
@Shutterstock. Building @transformer_gg and @Sandboxer_" with "Miami, FL" and "northbayventures.com" beneath it —
`third-party` · [X profile](https://x.com/jonoringer). No chief executive, board, engineering lead or team page is
published for Sandboxer itself. — `not-published`. Reading: the studio, its founder and the contracting entity are
one operation, and Sandboxer is one of its products rather than a standalone company. — `inferred`

**Founding and launch.** Two different dates matter, and they are four years apart. The entity was incorporated
2022-11-09 (`third-party`, netstate.co, above). The product went public on 2026-10-18: "Sandboxer is live" —
`third-party` · [X](https://x.com/jonoringer/status/2111826193578070439). The changelog's oldest entry is
2026-10-17 — `docs-confirmed` · [changelog](https://sandboxer.com/changelog). No product founding date, first
commit, private beta or "founded in" line is published. — `not-published`. Reading: the entity predates the
product by almost four years and is shared with sibling products, so 2022 is the company's date, not Sandboxer's.
— `inferred`

**Funding.** Nothing is published. I found no round, amount, valuation, investor list, accelerator batch or
announcement for Sandboxer in the company's pages, its terms, the studio's site, or in press and database
searches. — `not-published`. What is published is the studio's model — "North Bay Ventures starts new companies
and runs them through their earliest days" (`third-party`,
[northbayventures.com](https://www.northbayventures.com/)) — which describes self-funded incubation rather than a
disclosed raise. Sandboxer does not appear in Y Combinator's public company directory in my searches; absence
there is weak evidence and I did not confirm it with YC. — `inferred`

**Ownership, parents, acquisitions.** No parent company, subsidiary structure, acquisition or ownership change is
stated anywhere. The contracting entity and the studio are the same legal person: the studio's footer reads
"© 2026 North Bay Opco I, Inc." at the same Miami address — `third-party` ·
[northbayventures.com](https://www.northbayventures.com/). The same entity also contracts for a sibling product,
Transformer — `third-party` · [transformer.gg/terms](https://transformer.gg/terms) — and appears in a third
product's policy, Microdose — `third-party` · [microdose.fun/privacy](https://microdose.fun/privacy). Customers
have no say in a change of control: "We may assign them in a merger, acquisition or sale of assets." —
`docs-confirmed` · [terms](https://sandboxer.com/terms). — `not-published` for any actual change of ownership.

**Headcount.** No number is published. The only description is qualitative, and it describes the studio rather
than Sandboxer alone: "A small team of builders who write the code, ship the product and run the business
ourselves, AI-native from day one." — `third-party` · [northbayventures.com](https://www.northbayventures.com/).
— `not-published` for a headcount figure.

**Status page and uptime.** <https://status.sandboxer.com> exists and is hosted off Sandboxer's own network:
"Checked every minute from outside our network, plus our own production checks of every service." —
`third-party` · [status](https://status.sandboxer.com). Recent figures, read 2026-10-28: API "100.00% · 30 days";
sandboxes "99.45% · 30 days"; website and dashboard "99.79% · 30 days"; and "No incidents in the last 90 days." —
`third-party` · [status](https://status.sandboxer.com). One oddity: the page reports a 90-day window for a
product that launched ten days earlier, so the 90-day columns cannot all describe production traffic. —
`inferred`

**SLA.** There is none. "There's no SLA during early access, and no GPUs." — `docs-confirmed` ·
[llms.txt](https://sandboxer.com/docs/llms.txt). The terms go further and exclude availability commitments for
unfinished features: "Features we label as beta, preview or experimental are provided as they are, may change or
end without notice, and are excluded from any commitment we make about availability." — `docs-confirmed` ·
[terms](https://sandboxer.com/terms). No plan, including the $2,000 tier, carries a service-level commitment,
credit scheme or uptime guarantee. — `inferred` from the two statements above; no plan-level SLA text exists to
quote. — `not-published`

**Support.** Email only, with a dashboard link. "Email **support@sandboxer.com** with your `requestId` or sandbox
id, or use the **Support** link on the dashboard." — `docs-confirmed` · [FAQ](https://sandboxer.com/docs/faq).
Other published addresses: `hello@sandboxer.com` for general contact — `docs-confirmed` ·
[llms.txt](https://sandboxer.com/docs/llms.txt); `security@sandboxer.com` — `docs-confirmed` ·
[security](https://sandboxer.com/docs/security); `legal@sandboxer.com` and `privacy@sandboxer.com` —
`docs-confirmed` · [terms](https://sandboxer.com/terms). No phone number, live chat, community forum, Discord,
Slack or ticketing portal is published, and no support hours or response-time target is stated. — `not-published`

**Security and compliance claims.** No SOC 2, ISO 27001 or HIPAA claim appears on the security page, the terms or
the pricing page, and there is no trust centre. — `not-published`. What is published is a vulnerability policy
and a security contact: "Contact: mailto:security@sandboxer.com" — `docs-confirmed` ·
[security.txt](https://sandboxer.com/.well-known/security.txt). The policy commits to acknowledgement times and
safe harbour: "Acknowledge your report within 3 business days and keep you updated until it's resolved." —
`docs-confirmed` · [security](https://sandboxer.com/docs/security). A data processing addendum exists on request:
"If you need a Data Processing Addendum, write to privacy@sandboxer.com." — `docs-confirmed` ·
[terms](https://sandboxer.com/terms). International transfers rely on standard clauses: "we use appropriate
safeguards for transfers of personal information out of the European Economic Area, the United Kingdom or
Switzerland, such as the European Commission's Standard Contractual Clauses" — `docs-confirmed` ·
[privacy](https://sandboxer.com/privacy). The isolation design is described in §2; note that a security
*architecture* is not a security *certification*. — `inferred`

**Terms a buyer should read before signing up.**

- **Price changes need 30 days' notice.** "We may change prices with at least 30 days' notice for plans; a change
  applies from your next renewal." — `docs-confirmed` · [terms](https://sandboxer.com/terms)
- **Material reductions are announced, and you can leave.** "If a change materially reduces what a paid plan
  includes, we will tell you in advance, and you may cancel before it takes effect." — `docs-confirmed` ·
  [terms](https://sandboxer.com/terms)
- **Cancelling does not refund the rest of the month.** "If you cancel, the plan runs to the end of the current
  period and is not refunded for the rest of it." — `docs-confirmed` · [terms](https://sandboxer.com/terms)
- **Closing the account forfeits credit.** "Closing cancels your plan immediately, and any remaining plan time,
  credit packs and account credit are forfeited without refund." — `docs-confirmed` ·
  [terms](https://sandboxer.com/terms)
- **Your data is deleted after termination, with no export window promised.** "We are not required to keep Your
  Content after termination and may delete it, so export anything you need first." — `docs-confirmed` ·
  [terms](https://sandboxer.com/terms)
- **Non-payment triggers deletion, after email notice.** "We will give notice by email before deleting stored
  data for non-payment." — `docs-confirmed` · [terms](https://sandboxer.com/terms)
- **Over-quota storage is deleted only after 30 days' notice.** "We may start deleting unused stopped sandboxes,
  or what's over the limit, only after giving at least 30 days' notice by email and updating these Terms." —
  `docs-confirmed` · [terms](https://sandboxer.com/terms)
- **Refunds are the exception.** "Fees are non-refundable except as required by law." — `docs-confirmed` ·
  [terms](https://sandboxer.com/terms)
- **Liability is capped at 12 months of fees or $100.** "Each party's total liability arising from these Terms or
  the Service is limited to the greater of the fees you paid us in the 12 months before the claim, or US$100." —
  `docs-confirmed` · [terms](https://sandboxer.com/terms)
- **Disputes are arbitrated in Miami under Florida law, with a 30-day opt-out.** "These Terms are governed by the
  laws of the State of Florida" and "You can opt out of arbitration and the class-action waiver by emailing" …
  "within 30 days of first accepting a version of these Terms that contains this arbitration agreement" —
  `docs-confirmed` · [terms](https://sandboxer.com/terms)
- **A change of control can transfer your contract.** "We may assign them in a merger, acquisition or sale of
  assets." — `docs-confirmed` · [terms](https://sandboxer.com/terms)
- **Terms can change on 30 days' notice.** "For material changes we will give at least 30 days' notice by email or
  in the dashboard before they take effect." — `docs-confirmed` · [terms](https://sandboxer.com/terms)

**What is known, and what is not, about Boat.** §16 lays out the comparison; this is the plain restatement.

*Known, with sources.* Sandboxer's hourly rates and plan ladder are identical to Boat's: $0.018 / $0.036 / $0.072
/ $0.20 and $20 / $100 / $500 / $2,000 with the same concurrency and start limits, per
[docs.boat.dev/pricing](https://docs.boat.dev/pricing) and [pricing](https://sandboxer.com/pricing). The machines
are not identical: Boat lists 51/51/111/251 GB of disk, Sandboxer 12/50/125/251
([docs.boat.dev/pricing](https://docs.boat.dev/pricing), §5). Boat's regions are "EU regions today (Germany,
Finland, France)" ([boat.dev](https://boat.dev/)); Sandboxer has one US and one EU region. Boat deletes a stopped
sandbox's disk after 14 days ([docs.boat.dev/pricing](https://docs.boat.dev/pricing)); Sandboxer keeps it until
deleted ([FAQ](https://sandboxer.com/docs/faq)). The contracting parties differ: Dedale AI, Corp. for Boat
([boat.dev/terms](https://boat.dev/terms)), North Bay Opco I, Inc. for Sandboxer ([terms](https://sandboxer.com/terms)).

*Known, about the possibility.* Boat's privacy policy acknowledges products built on top of it without naming
any: "Some companies build their own products on boat. If you use one of these products, the company that runs it
decides how it uses the data you give it, and its privacy notice applies to that data." — `third-party` ·
[boat.dev/privacy](https://boat.dev/privacy).

*Not known.* No page on either site states a partnership, resale, white-label, hosting, investor or shared-owner
relationship. The word *sandboxer* appears zero times in Boat's docs index and compare page, and *boat* appears
zero times in Sandboxer's 2.4 MB corpus (§16). Neither company has announced anything. — `not-published`.

*What follows.* Identical prices with different disks, regions, retention and legal entities is consistent with a
reseller arrangement of the kind Boat's privacy policy describes, and equally consistent with an independently
built product that copied a competitor's price sheet. **Public evidence does not distinguish these, and I am not
asserting either.** — `inferred`

## Audit method

Corpus: 60 cited URLs, each fetched live and saved as text, plus the Markdown mirror of every docs page, five
re-fetches through a browser-grade fetcher for pages that render only in JavaScript (`/app` and four guides), and
Boat's pricing, terms, privacy and compare pages. Normalisation: HTML entity decoding, comment and tag stripping,
removal of Markdown escapes and emphasis markers, curly-to-straight quotes, dash and ellipsis folding, whitespace
collapse, lowercasing, and removal of spaces before punctuation.

Procedure: every straight-quoted span of 12 characters or more was extracted, the URLs cited in the following 400
characters were located, and each span was searched in the cited page's text. An ellipsis splits a span into
fragments that must appear in order, which is how elided quotes were verified. Spans that are plainly not
quotations — text sitting between two unrelated quotation marks in a sentence that also cites a source — were
excluded by a filter on the tag markers and link syntax they contain.

Result on the final text: **301 spans checked, 295 matched the cited page verbatim, 6 matched the page but sat
next to a neighbouring link in the parser's URL window (each verified by hand, listed below), and none were left
unmatched.**

What the audit changed:

- **Five paraphrases inside quotation marks** were replaced with the source's exact words: *otherwise it boots
  from disk* became "it boots from disk instead (files intact, running processes not kept)"
  ([snapshots](https://sandboxer.com/docs/snapshots)); *outbound internet is open by default* became "Outbound
  traffic is open by default."
  ([guide](https://sandboxer.com/guides/what-can-reach-a-sandbox-and-what-it-can-reach)); *Forks, and sandboxes
  made from a snapshot, stay in their source's region* became the changelog's own sentence
  ([changelog](https://sandboxer.com/changelog)); *Power-cycle[s]* became "Power-cycle the machine of a sandbox
  that stopped answering." ([openapi.yaml](https://sandboxer.com/openapi.yaml)); and a quoted line about SDKs
  dropped link syntax that is not in the rendered sentence ([api](https://sandboxer.com/docs/api)).
- **Six wrong sources** were corrected: the inner-guest RAM note is on the machines page, not security; bandwidth
  and named-snapshot charges are on the pricing page, not the billing or organizations pages; sandbox-to-sandbox
  routing is in the FAQ; *fork instantly* is in the docs index; the Freestyle/SAML sentence is in the
  top-platforms guide, not the E2B-alternatives guide; and Chrome's presence is stated in `llms.txt`.
- **Two quotes that omitted arguments** were fixed: the `sbx snapshot tree` and `sbx snapshot pull` examples both
  need `<snapshotId>` to match the page.
- **One quote missing a word** was fixed: the allowlist sentence says "**egress** allowlist"
  ([guide](https://sandboxer.com/guides/what-can-reach-a-sandbox-and-what-it-can-reach)).
- **Scare quotes** around ordinary words (*sandbox*, *persistent*, *which region*, *kill the process*, *train a
  model*, *Stops in*) became italics, so they no longer read as citations.
- **Every table row now carries its own source and quote.** The size table, the lifecycle list, the interfaces
  list, the pricing table and the same-word list each cite the page and the words they rest on.

The six spans the parser attributed to a neighbouring link (five distinct quotes, one of them repeated), each verified by hand in the cited page: "Storage
isn't billed: each plan includes an amount for what you keep"
([billing](https://sandboxer.com/docs/billing)); "They have no separate charge."
([pricing](https://sandboxer.com/pricing)); "An organization plan is **per seat**: the plan price × seats."
([organizations](https://sandboxer.com/docs/organizations)); "`--environment` and `--env` are different things"
([environments](https://sandboxer.com/docs/environments)); "Contact: mailto:security@sandboxer.com"
([security.txt](https://sandboxer.com/.well-known/security.txt)).

Not verifiable by this method, and therefore tagged rather than quoted: the absence claims (no SSO, no audit log,
no SOC 2, no static IP, no egress allowlist, no first-party custom domains, no published SLA). Those rest on
searching the docs corpus, the API description and the legal pages, not on a sentence I can quote.

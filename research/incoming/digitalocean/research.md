# DigitalOcean — provider research (Droplets, Agent Droplets, 1-Click agent images)

Research date: **2026-10-29**. Repository revision: `911a347` (`origin/main` at the time of the
checkout). Target provider id: `digitalocean`. Desk research only: no account was created, no
Droplet was started, nothing was billed.

**Scope.** DigitalOcean Droplets as the guide's first VPS-style provider, plus the agent-specific
products a reader will meet on the same site: **Agent Droplets** (the monthly plan for Managed
Agents), **Harness Runtime** (the managed microVM sessions that plan pays for), and the
**1-Click Marketplace images** for OpenClaw and Hermes Agent.

**Tag legend**

| Tag | Meaning |
|---|---|
| `docs-confirmed` | Stated on docs.digitalocean.com. |
| `pricing-page` | Stated on a page whose subject is money (digitalocean.com/pricing/*, pricing docs, SLA). |
| `third-party` | Not from DigitalOcean. Used only for company colour, never for a rate or verdict. |
| `inferred` | My reading of documented behaviour, not a sentence the source states. |
| `not-published` | DigitalOcean does not answer the question on any page I could find. |

**Quote handling.** Quotes are copied from the fetched Markdown of each page on 2026-10-29. For
matching I removed Markdown emphasis markers (`**`, `\*`) and backslash escapes, and collapsed
table pipes/whitespace. No wording, number or qualifier was changed. Every quote below is a
contiguous substring of the fetched text after that normalisation.

**Retrieval method.** Composio tools first: TinyFish `search` (14 calls) and `fetch_content`
(39 URLs across 11 batched calls); Context `web_scrape` (3 calls, used for the JavaScript-heavy
Marketplace listings after TinyFish returned the shell of the page). No Amp native web tool was
needed. Prices were read from a fresh TinyFish fetch of
`https://www.digitalocean.com/pricing/droplets` on 2026-10-29, cross-checked against a separate
fresh fetch of `https://docs.digitalocean.com/products/droplets/details/pricing/` (page header
"Last verified 26 Oct 2026"). No cached scrape was used for a price.

**Spend.** 14 TinyFish searches + 39 page fetches + 3 Context scrapes. No deep-research report, no
browser-automation session, no paid dataset. Well inside the ~$1 cap.

---

## 1. What the product is

DigitalOcean sells Linux virtual machines. The Droplet is the VM; there is no sandbox API in front
of it, so "create a machine for an agent" means the same thing it means for a web server: pick a
size, pick a region, pick an image, boot. `docs-confirmed`

> "DigitalOcean Droplets are Linux-based virtual machines (VMs) that run on top of virtualized
> hardware. Each Droplet you create is a new server you can use, either standalone or as part of a
> larger, cloud-based infrastructure." — [Droplet Features](https://docs.digitalocean.com/products/droplets/details/features/)

> "A Droplet is DigitalOcean's brand name for a virtual private server (VPS)." —
> [Droplet pricing](https://www.digitalocean.com/pricing/droplets)

**Two ways to buy a Droplet.** Bundled plans are fixed shapes in five families (Basic shared CPU;
General Purpose, CPU-Optimized, Memory-Optimized and Storage-Optimized on dedicated CPU). v5
configurations, on 5th-gen AMD EPYC, let you pick vCPU, memory and boot disk independently, but
only in four US datacenters. `docs-confirmed`

> "Bundled Plan Droplets offer fixed vCPU, memory, and storage ratios pre-configured for common
> workloads, like Basic, CPU-Optimized, or Memory-Optimized." —
> [Droplet pricing FAQ](https://www.digitalocean.com/pricing/droplets)

> "v5 Droplets let you size compute, memory, storage, and networking independently, with Shared
> configurations for shared vCPUs and General Purpose configurations for dedicated vCPUs." —
> [Droplet Features](https://docs.digitalocean.com/products/droplets/details/features/)

**Agent Droplets are not VMs.** This matters for the guide: an "Agent Droplet" is the monthly plan
that discounts Managed Agents usage. The compute underneath is a per-session Firecracker microVM
from Harness Runtime, priced separately, and it is a different product from a Droplet. `docs-confirmed`

> "One plan covers the compute, inference, storage, and tools your agents use, and the discount
> applies automatically to all of it." — [Agent Droplets pricing](https://www.digitalocean.com/pricing/agent-droplets)

> "Isolated execution in a dedicated Firecracker microVM per session, with its own compute and
> filesystem" — [Managed Agents](https://www.digitalocean.com/products/managed-agents)

**1-Click agent images.** The Marketplace ships OpenClaw, Hermes Agent and Docker Agent as 1-Click
Droplet images. OpenClaw's image is the hardened one DigitalOcean writes about: Caddy with a
Let's Encrypt certificate, a generated gateway token, device pairing, Docker container isolation,
fail2ban and unattended upgrades. `docs-confirmed`

> "1-Click deployment for OpenClaw on DigitalOcean Droplet® servers, now starting at just
> $12/month" — [OpenClaw announcement](https://www.digitalocean.com/blog/moltbot-on-digitalocean)

> "OpenClaw runs inside a dedicated Docker container, isolating agent execution from the host
> system." — same page

> "Create Hermes Agent Droplet" — [Hermes Agent listing](https://marketplace.digitalocean.com/apps/hermes-agent)

---

## 2. Prices (fresh read, 2026-10-29)

### 2.1 Bundled CPU Droplets — the shapes the calculator uses

Basic (shared CPU), from the live pricing page. Columns: memory, vCPU, transfer, SSD, $/hr, $/mo.

> "| 512 MiB | 1 vCPU | 500 GiB | 10 GiB | $0.00595 | $4.00 |"
> "| 1 GiB | 1 vCPU | 1,000 GiB | 25 GiB | $0.00893 | $6.00 |"
> "| 2 GiB | 1 vCPU | 2,000 GiB | 50 GiB | $0.01786 | $12.00 |"
> "| 2 GiB | 2 vCPUs | 3,000 GiB | 60 GiB | $0.02679 | $18.00 |"
> "| 4 GiB | 2 vCPUs | 4,000 GiB | 80 GiB | $0.03571 | $24.00 |"
> "| 8 GiB | 4 vCPUs | 5,000 GiB | 160 GiB | $0.07143 | $48.00 |"
> "| 16 GiB | 8 vCPUs | 6,000 GiB | 320 GiB | $0.14286 | $96.00 |"
> — [Droplet pricing](https://www.digitalocean.com/pricing/droplets) `pricing-page`

The four dedicated families on the same page, with the rows used in this research:

> "| 4 GiB | 2 vCPUs | 4,000 GiB | 1x | 25 GiB | $0.06250 | $42.00 |" (CPU-Optimized)
> "| 8 GiB | 2 vCPUs | 4,000 GiB | 1x | 25 GiB | $0.09375 | $63.00 |" (General Purpose)
> "| 16 GiB | 2 vCPUs | 4,000 GiB | 1x | 50 GiB | $0.12500 | $84.00 |" (Memory-Optimized)
> "| 16 GiB | 2 vCPUs | 4,000 GiB | 1x | 300 GiB | $0.19494 | $131.00 |" (Storage-Optimized)
> — [Droplet pricing](https://www.digitalocean.com/pricing/droplets) `pricing-page`

All 31 bundled CPU rows are in `pricing.json`. GPU Droplets are priced separately (H100 $4.41/hr,
RTX 4000 $0.76/hr) and are not part of the calculator.

### 2.2 v5 configurations — per-resource, no cap

> "| Shared vCPU, per vCPU | $0.0158219/hour |"
> "| General Purpose vCPU, per vCPU | $0.028/hour |"
> "| Memory, per GiB | $0.0040411/hour |"
> "| Boot disk, per GiB | $0.000137/hour |"
> — [Droplet Pricing docs](https://docs.digitalocean.com/products/droplets/details/pricing/) `pricing-page`

Worked check of DigitalOcean's own example: 8 × 0.0158219 + 16 × 0.0040411 + 30 × 0.000137 =
0.1265752 + 0.0646576 + 0.00411 = **$0.19534/hr**, against the page's "about $0.1953/hour". The
rates multiply correctly.

v5 is only in ATL1, RIC1, MKC1 and MEM1. `docs-confirmed`

> "| v5 | | | | | | | | | | | | | ✓ | ✓ | ✓ | ✓ |" —
> [Droplet Availability](https://docs.digitalocean.com/products/droplets/details/availability/)

### 2.3 The two billing rules that decide A, B and C

**Per second, 60-second minimum.** `pricing-page`

> "Effective January 1, 2026, we're moving to per-second billing (with a minimum charge of 60
> seconds or $0.01, whichever is higher) for Droplets." —
> [Droplet pricing](https://www.digitalocean.com/pricing/droplets)

**Bundled plans cap at 672 hours a month.** `pricing-page`

> "Usage is capped at 672 hours (28 days) per month." —
> [Droplet Pricing docs](https://docs.digitalocean.com/products/droplets/details/pricing/)

> "Bundled Plans have a monthly cap, so you'll never pay more than the flat monthly price for that
> plan." — [Droplet pricing FAQ](https://www.digitalocean.com/pricing/droplets)

**A powered-off Droplet is billed in full.** This is the statement the task asked for, and it is
about bundled CPU Droplets by name. `pricing-page`

> "Billing begins when you create the Droplet and ends when you destroy it. You are still billed
> for bundled-plan CPU Droplets that are powered off because the compute resources stay reserved
> on the hypervisor. To end billing, destroy the Droplet." —
> [Droplet Pricing docs](https://docs.digitalocean.com/products/droplets/details/pricing/)

Consequence for workload C: 90 running + 640 stopped hours is **730 billed hours**, and 730 ×
$0.03571 = $26.07, which the 672-hour cap cuts to the $24 monthly price. The machine does not get
cheaper by being off; it only gets cheaper by being destroyed, which loses the disk.

### 2.4 Extras

| Item | Price | Quote / source |
|---|---|---|
| Outbound transfer | Included per plan (500 GiB–11,000 GiB), then $0.01/GiB | "Each Droplet plan includes an amount of free outbound data transfer. Additional outbound transfer is billed at $0.01 per GiB." — [pricing docs](https://docs.digitalocean.com/products/droplets/details/pricing/) |
| Transfer pooling | Pooled per team, no rollover | "Transfer allowance and usage is pooled cumulatively across all Droplets at the team level, not individually per Droplet." — same |
| Snapshots | $0.06/GB-month | "| Droplet Snapshots | $0.06/GB per month |" — [pricing page](https://www.digitalocean.com/pricing/droplets) |
| Backups | 20% weekly / 30% daily of the Droplet price | "| Weekly | 20.0% of the Droplet's cost per month |" — [Backups pricing](https://docs.digitalocean.com/products/backups/details/pricing/) |
| Volumes | $0.10/GiB-month, 1 GiB–16 TiB | "DigitalOcean Volumes Block Storage cost $0.10 per GiB per month and range from 1 GiB to 16384 GiB (16 TiB)." — [Volume pricing](https://docs.digitalocean.com/products/volumes/details/pricing/) |
| Signup credit | $5, expires in 90 days, card required first | "Signup credits expire 90 days after signup." — [Signup credit](https://docs.digitalocean.com/platform/billing/signup-credit/) |
| Cloud firewalls | No extra cost | "DigitalOcean Cloud Firewalls are a network-based, stateful firewall service for Droplets provided at no additional cost." — [Firewalls](https://docs.digitalocean.com/products/networking/firewalls/details/features/) |

### 2.5 Managed Agents / Agent Droplets — separate product, separate meter

> "| CPU | $0.044 per vCPU-hour | Actual CPU consumed |"
> "| Memory | $0.0095 per GB-hour | Actual memory allocated over time |"
> "| Session Storage (Volumes) | $0.05 per GiB-month | Actual capacity held over time |"
> — [Harness Runtime pricing](https://www.digitalocean.com/pricing/harness-runtime) `pricing-page`

> "| XSmall | 1 | 1 GB | $0.0535/hr |"
> "| Medium (default) | 2 | 4 GB | $0.126/hr |"
> "| XLarge | 16 | 32 GB | $1.008/hr |" — same page

> "| Monthly price | $5 Credit† | $50.00 | $200.00 |" —
> [Agent Droplets pricing](https://www.digitalocean.com/pricing/agent-droplets) `pricing-page`

Plan mechanics: the monthly fee is a credit, and the plan discounts usage (15% Pro, 20% Team).
`pricing-page`

> "When your plan credit runs out, you choose: keep going at list price or stop at the plan price."

Harness Runtime also needs prepaid balance and has a session cap. `docs-confirmed`

> "Harness Runtime requires a positive prepaid account balance." —
> [Harness Runtime pricing](https://www.digitalocean.com/pricing/harness-runtime)

> "Each session has a monthly active compute cap of 744 hours." —
> [Harness Runtime limits](https://docs.digitalocean.com/products/managed-agents/agent-harness-runtime/details/limits/)

**Not priced by the calculator.** The guide's A/B/C cards price Droplets. Agent Droplets and
Harness Runtime are a different meter with a different unit (per-session CPU/memory plus inference
and tools), and mixing them into the Droplet card would misstate both. The profile names them; the
card does not.

---

## 3. A, B and C

Hand-worked in `abc.md`; the short version:

| Case | Shape used | Hand-worked bill | Why |
|---|---|---|---|
| A | Basic 2 vCPU / 4 GiB / 80 GiB | **$10.00** | 1,000 runs, each floored at $0.01 because 10 min of this shape is $0.00595 |
| B | Basic 4 vCPU / 8 GiB / 160 GiB | **$48.00** | 730 h × $0.07143 = $52.14, cut to the 672-hour monthly cap |
| C | Basic 2 vCPU / 4 GiB / 80 GiB | **$24.00** | 730 billed hours (90 on + 640 off) = $26.07, cut to the monthly cap |

**The $0.01 floor matters for A.** Ten minutes on the 2 vCPU Basic shape is $0.00595, below the
published "minimum charge of 60 seconds or $0.01, whichever is higher". Read per Droplet (the docs
state the minimum per Droplet creation), 1,000 separate runs cost $10.00, not $5.95. If the floor
turned out to be per invoice, A would be $5.95; the profile uses $10.00 and says so.

**Model limitation — the shared engine cannot show A, B or C correctly.** `cost.ts` bills
`hoursOf().run` only, has no monthly-cap rule and no per-machine minimum. Fed this card it prints
**$5.95 for A** (the $0.01 floor), **$52.14 for B** (8.6% high) and **$3.21 for C** (87% low). All
three are wrong for a documented reason, not a rounding one. Recommended scoped engine changes for
the integrating thread:

1. `Shape.capHours?: number` — bill `Math.min(h.run, capHours)` for shapes that carry it, and add a
   "Monthly cap" line showing the difference. DigitalOcean's value is 672.
2. `RateCard.billedWhileStopped?: boolean` — when true, compute lines use `h.run + h.stopped`.
   DigitalOcean needs it because a powered-off Droplet keeps billing.
3. `RateCard.minimumPerMachine?: number` — floor each machine's charge at $0.01, which is how the
   60-second/$0.01 minimum behaves for a 10-minute Droplet.

All three are a handful of lines in `priceOnPlan` plus fixtures; I did not make them because this
task is research-artifacts-only and `cost.ts` is shared code. Until they land, the provider's
`cost.A/B/C` prose (which is hand-worked and correct) disagrees with the rendered card. That is the
honest state and must not be "fixed" by inventing a rate.

---

## 4. Features

### 4.1 Isolation

Full VM, own kernel, root, Docker. RAM, disk and network are dedicated; only the vCPU is shared on
Basic. `docs-confirmed`

> "Resources like RAM, disk storage, and network bandwidth are always dedicated, but you can choose
> between shared CPU and dedicated CPU plans for dedicated vCPU." —
> [Choosing a plan](https://docs.digitalocean.com/products/droplets/concepts/choosing-a-plan/)

> "You can connect to your Droplet using SSH (Secure Shell). You will need to use an SSH client and
> the root password or an SSH key to log in to your server." —
> [Droplet pricing FAQ](https://www.digitalocean.com/pricing/droplets)

Docker is a 1-Click image as well as an apt install. `docs-confirmed`

> "OpenClaw runs inside a dedicated Docker container, isolating agent execution from the host
> system." — [OpenClaw announcement](https://www.digitalocean.com/blog/moltbot-on-digitalocean)

**Nested virtualisation is unresolved.** One docs page assumes nested VMs exist, and nothing
explains how to enable them. `docs-confirmed` for the sentence, `not-published` for the capability.

> "If you have Droplets running workloads leveraging nested virtualization, you need to restart any
> nested VMs after a live migration." —
> [Live Migrations](https://docs.digitalocean.com/products/droplets/details/live-migration/)

The 2021 community question "Does DigitalOcean support KVM or nested virtulzation ?" has no answer
rendered on the page today, so it is not evidence either way.

### 4.2 Sizes and regions

- 31 bundled CPU shapes: 512 MiB/1 vCPU up to 256 GiB/32 vCPU (Storage-Optimized, 4,690 GiB disk).
- v5: Shared 1–8 vCPU and 1–24 GB at a 1x–3x ratio; General Purpose 2–64 vCPU and 4–512 GB at 2x–8x.
  `docs-confirmed` — "| General Purpose | Dedicated | 2-64 | 4-512 GB, at a 2x-8x RAM-to-vCPU ratio |"
  ([Choosing a plan](https://docs.digitalocean.com/products/droplets/concepts/choosing-a-plan/))
- 16 datacenters, of which AMS3 and FRA1 are in the EU. `docs-confirmed` — "DigitalOcean has data
  centers in multiple locations around the world, including San Francisco, Richmond, NYC, Kansas
  City, Atlanta, Toronto, Amsterdam, London, Frankfurt, Bangalore, Singapore, and Sydney."
  ([pricing FAQ](https://www.digitalocean.com/pricing/droplets))
- Resize exists but requires a power-off and cannot shrink the disk. `docs-confirmed` — "Before you
  can resize a Droplet in the control panel, you need to power it off." and "You cannot decrease the
  size of a Droplet's disk." ([Resize](https://docs.digitalocean.com/products/droplets/how-to/resize/))
- GPUs: on-demand H100 at $4.41/hr, RTX 4000 at $0.76/hr, plus AMD MI300X/MI325X, H200, L40S, RTX
  6000, spot and contract tiers. `pricing-page`

### 4.3 Lifecycle

There is no pause and no idle stop. Power off keeps the disk and the bill; destroy ends both.
`pricing-page`

> "Billing begins when you create the Droplet and ends when you destroy it." —
> [Droplet Pricing docs](https://docs.digitalocean.com/products/droplets/details/pricing/)

Managed Agents is the opposite: sessions pause on idle and resume on input. `docs-confirmed`

> "Idle suspend defaults to 15 minutes." —
> [Harness Runtime limits](https://docs.digitalocean.com/products/managed-agents/agent-harness-runtime/details/limits/)

> "The session resumes on new input when the platform wakes it." —
> [Harness Runtime features](https://docs.digitalocean.com/products/managed-agents/agent-harness-runtime/details/features/)

Concurrency limit: "You can't create more than 10 Droplets at the same time using the Control Panel
or the API." ([Droplet Limits](https://docs.digitalocean.com/products/droplets/details/limits/))

### 4.4 Snapshots, backups, templates

Disk-only, on demand, kept until deleted, restorable individually, usable to create new Droplets.
`docs-confirmed`

> "Creating a snapshot saves everything from the Droplet or volume's disk to a disk image saved in
> your DigitalOcean account." —
> [Snapshots features](https://docs.digitalocean.com/products/snapshots/details/features/)

> "Snapshots are retained indefinitely until manually deleted." — same page

> "You can use snapshots to create new Droplets or volumes with the same contents of the snapshot."
> — same page

Backups are automatic disk images at 4/6/12-hour, daily or weekly intervals, priced as a percentage
of the Droplet (`pricing-page`, table above). No memory snapshot, no fork of a running machine.
Harness Runtime is the only place a fork exists, and it forks from a checkpoint. `docs-confirmed`

> "Checkpoint a session and fork a new, independent session from it" —
> [Managed Agents](https://www.digitalocean.com/products/managed-agents)

### 4.5 Storage

Boot disk persists with the Droplet; volumes are separate network block storage. `docs-confirmed`

> "You can only attach a volume to one Droplet at a time." —
> [Volume limits](https://docs.digitalocean.com/products/volumes/details/limits/)

> "You are charged for volumes whether or not they are attached to a Droplet." —
> [Volume pricing](https://docs.digitalocean.com/products/volumes/details/pricing/)

Spaces is S3-compatible object storage, but DigitalOcean does not document mounting a bucket as a
folder on a Droplet. `docs-confirmed` for the compatibility, `inferred` for the missing mount:

> "For object storage, Spaces is S3-compatible." — [docs index](https://docs.digitalocean.com/llms.txt)

### 4.6 Idle timers and schedules

No idle timer, no session lifetime and no wake-on-request for a Droplet: it runs until destroyed.
Scheduled work is cron inside a machine that is already on. Managed Agents has scheduled triggers.
`docs-confirmed`

> "Scheduled and webhook triggers for automated runs" —
> [Managed Agents](https://www.digitalocean.com/products/managed-agents)

### 4.7 Reaching it

Public IPv4 by default, real SSH, a browser console, any TCP port except SMTP. No tokenised preview
URL and no port-forwarding service (standard `ssh -L` works). `docs-confirmed`

> "By default, each Droplet you create comes with its own public IPv4 address." —
> [Droplet pricing FAQ](https://www.digitalocean.com/pricing/droplets)

> "The Droplet Console is a browser-based way to connect to Droplets." —
> [Droplet Console](https://docs.digitalocean.com/products/droplets/how-to/connect-with-console/)

> "SMTP ports 25, 465, and 587 are blocked on all Droplets." —
> [Droplet Limits](https://docs.digitalocean.com/products/droplets/details/limits/)

Private Droplets exist (VPC-only, no public IP), but they still reach the internet through a NAT
gateway, so they are not an "offline" mode.

### 4.8 Custom domains and HTTPS

DNS is a DigitalOcean product; automatic certificates are a Load Balancer and Spaces feature, not a
Droplet feature. `docs-confirmed`

> "Adding a domain you own to your DigitalOcean account lets you manage the domain's DNS records
> with the control panel and API." — [Domains and DNS](https://docs.digitalocean.com/products/networking/dns/)

> "Domains you manage on DigitalOcean integrate with DigitalOcean Load Balancers and Spaces to
> streamline automatic SSL certificate management." — same page

The OpenClaw image is the exception and gets its own certificate:

> "Our best practices consist of using Caddy as a reverse proxy with a TLS certificate issued by
> LetsEncrypt." —
> [OpenClaw technical deep dive](https://www.digitalocean.com/blog/technical-dive-openclaw-hardened-1-click-app)

### 4.9 Outbound network

Allowances are per plan and pooled per team; overage $0.01/GiB; inbound free. Cloud firewalls
filter in both directions by protocol, port and address, at no extra cost. `docs-confirmed`

> "Firewall rules can allow or deny traffic by protocol, port range, and source or destination." —
> [Firewalls features](https://docs.digitalocean.com/products/networking/firewalls/details/features/)

> "Cloud firewalls block all traffic that isn't expressly permitted by a rule." — same page

A Droplet's public IPv4 is a stable outbound address for the life of the Droplet; Reserved IPs are
for inbound remapping. `docs-confirmed` — "DigitalOcean Reserved IPs are publicly-accessible static
IPv4 and IPv6 addresses." ([Reserved IPs](https://docs.digitalocean.com/products/networking/reserved-ips/details/features/))

### 4.10 Keys and secrets

Granular API token scopes exist. Droplets have no secret store; Harness Runtime injects secrets.
`docs-confirmed`

> "Most scopes in this table are granular scopes that grant access to a specific resource type and
> action." — [Scopes for API Tokens](https://docs.digitalocean.com/reference/api/scopes/)

> "DigitalOcean stores them securely and injects them into the session when it starts, so the values
> never appear in the spec file or in logs." —
> [Harness Runtime features](https://docs.digitalocean.com/products/managed-agents/agent-harness-runtime/details/features/)

> "Credential brokering: tokens resolve at execution time and never reach the model, the agent
> prompt, or the sandbox" — [Managed Agents](https://www.digitalocean.com/products/managed-agents)

### 4.11 Ways to drive it

Control panel, `doctl`, REST API v2, official PyDo (Python), DoTs (TypeScript) and Godo (Go), an
official MCP server, SSH and the browser console. No PTY or file API for Droplets; Harness Runtime
has attach and file upload/download. `docs-confirmed`

> "Official Python client for the DigitalOcean API (OpenAPIv3)." —
> [PyDo](https://docs.digitalocean.com/reference/pydo/)

> "Official TypeScript client for the DigitalOcean API." —
> [DoTs](https://docs.digitalocean.com/reference/dots/)

> "DigitalOcean MCP servers bridge your development tools and the DigitalOcean API, exposing tools
> and context that allow MCP clients to manage resources such as App Platform, Droplets, Kubernetes
> clusters" — [MCP servers](https://docs.digitalocean.com/reference/mcp/)

> "Start, attach, list, show, pause, resume, remove, and view logs for sessions, and cancel runs." —
> [Harness Runtime features](https://docs.digitalocean.com/products/managed-agents/agent-harness-runtime/details/features/)

### 4.12 Built-in agents

The default images have no coding agent. The Marketplace does: OpenClaw (hardened, from $12/month),
Hermes Agent, Docker Agent. Harness Runtime runs Claude Code, Codex, OpenCode, Hermes and LangGraph
as a managed product. `docs-confirmed`

> "OpenClaw is now accessible on our $12/month Droplet tier" —
> [OpenClaw announcement](https://www.digitalocean.com/blog/moltbot-on-digitalocean)

> "Run coding agents such as Codex, Claude Code, and OpenCode, or general purpose agent frameworks
> such as LangGraph, CrewAI, Hermes, and OpenHands in an isolated sandbox." —
> [Harness Runtime features](https://docs.digitalocean.com/products/managed-agents/agent-harness-runtime/details/features/)

### 4.13 Teams and accounts

Teams share machines, billing and keys. Six predefined roles plus custom roles, OIDC SSO, spend
alerts that are explicitly not a cap. `docs-confirmed`

> "Teams are how you manage your billing and infrastructure on DigitalOcean." —
> [Teams](https://docs.digitalocean.com/platform/teams/)

> "Teams come with six predefined roles which cover common use cases for levels of access." —
> [Team roles](https://docs.digitalocean.com/platform/teams/roles/)

> "Enable single sign-on (SSO) to let team members sign in to DigitalOcean with a single set of
> credentials from an OIDC-compatible identity provider (IdP), like Okta or Microsoft Entra ID." —
> [Team settings](https://docs.digitalocean.com/platform/teams/settings/)

> "A spend alert budget is not a spending cap and does not limit how much you can use, unless you
> enable pausing on a model access key alert." —
> [Spend alerts](https://docs.digitalocean.com/platform/billing/spend-alerts/)

Audit trail: API token scopes include `actions:read`, "View events of shared resources that have
occurred in the current team". That is per-resource activity, not a published account-wide audit
log; the Agent Droplets plan table lists "audit logs" as part of Enterprise IAM. Verdict `partly`.

### 4.14 Trials and free tiers

$5 credit, 90 days, payment method first. No free tier. `docs-confirmed`

> "When you create your first team, DigitalOcean automatically applies a $5 signup credit." —
> [Signup credit](https://docs.digitalocean.com/platform/billing/signup-credit/)

> "You must add a valid payment method before you can create Droplets or other resources." — same

Managed Agents has a separate $5 trial that the blog says needs no card; that does not change the
Droplet answer, and the two must not be merged into one claim. `docs-confirmed` — "New customers can
start with a free trial: $5 in credit, no card required" ([Agent Droplets blog](https://www.digitalocean.com/blog/introducing-agent-droplets)).

### 4.15 Company

| Fact | Value | Evidence |
|---|---|---|
| Legal entity | DigitalOcean, LLC | "This Data Processing Agreement ("DPA") is an addendum to the Customer Terms of Service ("Agreement") between DigitalOcean, LLC ("DigitalOcean") and the Customer." — [DPA](https://www.digitalocean.com/legal/data-processing-agreement) |
| Founded | 2012 | "DigitalOcean was founded in 2012" — [About](https://www.digitalocean.com/about) |
| Public company | NYSE: DOCN, 680,000+ customers | "DigitalOcean (NYSE: DOCN) is the AI-Native Cloud, purpose-built for inference and agentic workloads." — [Investors](https://investors.digitalocean.com/) |
| Uptime promise | 99.99% per Droplet | "DigitalOcean commits to a Monthly Uptime Percentage of 99.99% for each individual Droplet instance." — [CPU Droplet SLA](https://www.digitalocean.com/sla/cpu-droplets) |
| Certification | SOC 2 Type II and SOC 3 Type II | "DigitalOcean maintains a SOC 2 Type II and SOC 3 Type II certification, issued by our independent auditor, Schellman & Company." — [Certification reports](https://www.digitalocean.com/trust/certification-reports) |
| DPA | Published | DPA page above |
| Status page | status.digitalocean.com | "All Systems Operational" — [Status](https://status.digitalocean.com/) |
| Self-hosting | None | "DigitalOcean relies on open source technologies to do what we do." — [Open source](https://www.digitalocean.com/open-source). Inferred: the platform is a hosted service; only clients and tools are published. |

---

## 5. Capability ledger — the answers that are not obvious

Everything is in `capability-rows.json`. These are the rows where the verdict needed a judgement
call, recorded here so the integrating thread can challenge it.

| Capability | Verdict | Why |
|---|---|---|
| `nested-virt` | not-published | Live-migration docs mention nested VMs; no page says how to enable them. Contradiction, not a yes. |
| `any-size` | partly | v5 sizes freely, but only ATL1/RIC1/MKC1/MEM1 and only 1–8 shared vCPU. |
| `pause-memory` | partly | Droplets have no pause; Managed Agents pauses workspace and conversation. |
| `warm-pool` | partly | Autoscale pools keep Droplets running, but nothing hands one to a job. |
| `fast-start` | partly | Droplet "under a minute"; Harness sessions "about a second". |
| `fork-running` | partly | Fork exists only from a Managed Agents checkpoint. |
| `mount-buckets` | partly | Spaces is S3-compatible; no documented mount on a Droplet. |
| `private-url` | partly | Cloud firewall can restrict by address; no token or login link. |
| `auto-https` | partly | Automatic only on Load Balancers and Spaces (and the OpenClaw image). |
| `no-internet` | yes (inferred) | A deny-all outbound firewall rule leaves no internet; Private Droplets remove the public IP. |
| `secrets-store`, `hidden-secrets` | partly | Only Managed Agents / Action Gateway. |
| `pty`, `file-api` | partly | Only Harness Runtime attach and upload/download. |
| `agents-preinstalled` | partly | Marketplace images, not the default image. |
| `prompt-api` | partly | Harness sessions take new input; no send-a-prompt call for a Droplet. |
| `one-click-hermes` | partly | Image exists; listing publishes no post-deploy steps. |
| `one-click-openclaw` | yes | Hardened 1-Click image, $12/month, TLS and gateway token preconfigured. |
| `browser` | partly | Chromium inside Harness sessions only. |
| `desktop` | no | No graphical desktop anywhere in the Droplet or Harness documentation. |
| `hosts-other-agents` | not-published | Docs name their own harness runtime, not Cursor/Devin/Claude Managed Agents. |
| `audit-log` | partly | Per-resource action events; account-wide audit logs only claimed for Managed Agents IAM. |
| `schedules` | partly | Scheduled triggers for Managed Agents sessions; a Droplet runs its own cron. |
| `open-source` | no | Hosted service; clients and tools are open, the platform is not. |

---

## 6. Use-case routes

Full table in `routes.json`. Summary of the disposition for all ten current use cases:

| Use case | Tier | noTerminal | Note |
|---|---|---|---|
| `hermes-agent` | one-click | partly | Marketplace Hermes image; setup steps unpublished. |
| `openclaw` | one-click | partly | Hardened image from $12/month; token and pairing still need a step. |
| `coding-agent` | manual | no | Install Claude Code/Codex yourself on a Droplet. |
| `code-interpreter` | backend | no | Harness Runtime sessions via API; per-session pricing. |
| `browser-agent` | backend | no | Chromium in Harness sessions; no desktop, no live preview. |
| `workflow-automation` | manual | no | Docker + n8n on a Droplet; you run the database and key. |
| `chat-bot` | manual | no | Always-on Droplet; gateway process stays up because nothing idles it. |
| `claude-code-team` | manual | no | One Droplet per developer; separate credentials. |
| `scheduled-scraper` | manual | no | cron inside a Droplet that stays on; no scheduler that starts machines. |
| `mcp-server` | manual | no | Public IP + your server; DigitalOcean's own MCP manages DigitalOcean, not yours. |

Picks suggested: `openclaw` (cheapest hardened one-click with a public IP) and `mcp-server` (a $6
always-on box with a stable public address). Neither is suggested for `code-interpreter` or
`browser-agent`, where per-session runtimes beat a per-hour VM.

---

## 7. Contradictions and unknowns

### Contradictions (both sides kept)

1. **OpenClaw minimum size.** The 30 January technical deep dive says the image needs a $24/month
   Droplet; the 10–11 February announcement says it now runs on the $12 tier.
   > "While this currently necessitates a minimum $24/month Droplet size to match the snapshot's
   > disk and memory requirements" — [technical deep dive](https://www.digitalocean.com/blog/technical-dive-openclaw-hardened-1-click-app)

   > "OpenClaw is now accessible on our $12/month Droplet tier" —
   > [announcement](https://www.digitalocean.com/blog/moltbot-on-digitalocean)

   Interpretation: **$12 today**; the later statement supersedes the earlier constraint. A reader on
   the $12 tier should expect a tighter fit and check the image's own requirements.

2. **Harness Runtime CPU billing.** The pricing page says actual CPU consumed; the pricing docs say
   active-CPU billing has not shipped and 25% of allocated vCPU is charged until it does.
   > "| CPU | $0.044 per vCPU-hour | Actual CPU consumed |" —
   > [Harness Runtime pricing](https://www.digitalocean.com/pricing/harness-runtime)

   > "Active CPU billing is coming soon. Until then, you will be billed at 25% of the vCPUs
   > allocated to your sandbox." —
   > [Harness Runtime pricing docs](https://docs.digitalocean.com/products/managed-agents/agent-harness-runtime/details/pricing/)

   Interpretation: **the docs are more specific and later-dated (22 Sep 2026)**; today's bill is
   about 25% of allocated vCPU, and the "actual CPU" line describes the intended model. This affects
   any Managed Agents comparison, not the Droplet card.

3. **Managed Agents snapshot price.** The launch press release says $0.005 per GiB-month; both the
   pricing page and the blog say $0.05.
   > "with snapshots at $0.005 per GiB-month" —
   > [press release](https://investors.digitalocean.com/news/news-details/2026/DigitalOcean-Launches-Managed-Agents-Bringing-Agent-Execution-Tool-Access-and-Inference-Together-on-One-Cloud/default.aspx)

   > "| Snapshots and checkpoints | $0.05 per GiB-month | Storage retained |" —
   > [Harness Runtime pricing](https://www.digitalocean.com/pricing/harness-runtime)

   Interpretation: **$0.05**, a 10× difference, with the live pricing page governing. The press
   release looks like a typo but is not corrected anywhere.

4. **Nested virtualisation.** Live-migration docs assume nested VMs; no other page documents them.
   Kept as `not-published` rather than resolved either way.

### Unknowns (searched, not answered)

- **Nested virtualisation**: no plan or image page says it is enabled, which plans allow it, or how
  to turn it on.
- **OpenClaw first-run**: how the gateway token is delivered, and whether pairing a device needs the
  Droplet console. The blog says a setup wizard exists but does not show it.
- **Hermes Agent image**: what the post-deploy setup asks for; the Marketplace listing's "Getting
  started" section contains only the API example.
- **v5 boot-disk minimum**: the pricing docs give a per-GiB rate and examples at 30 GiB but no
  stated floor, so a 10 GiB request may be rounded up. The calculator would understate disk.
- **Account-wide audit log**: `actions:read` exposes per-resource events; no page describes a
  downloadable audit trail for Droplets.
- **Volume IOPS by Droplet family**: the table gives Shared/Dedicated figures but not which bundled
  family maps to which tier.
- **A Droplet's outbound IP after destroy/recreate**: a new Droplet gets a new address; no page
  promises otherwise. Reserved IPs are inbound.

---

## 8. Verification performed

- **Quote presence.** Every source URL cited in `capability-rows.json`, `feature-rows.json` and
  `provider.json` (37 unique URLs, 101 quotes) was re-fetched and machine-checked after normalising
  Markdown emphasis, escapes, code fences, link syntax, HTML entities, table pipes and whitespace.
  The same check covered the 53 blockquotes in this ledger. All quotes matched except the cases
  below.
- **Cases needing a different fetch path, each re-checked individually.** Some pages render part of
  their text client-side, so a plain `curl` sees less than a rendered fetch: the Droplet pricing FAQ
  and table, `/products/managed-agents`, both OpenClaw blog posts, `investors.digitalocean.com` and
  the Marketplace listing descriptions. Those quotes were re-verified with a fresh TinyFish
  `fetch_content` call: all OK. `docs.digitalocean.com` pages, the DPA, the SLA, the status page and
  the Harness Runtime pricing page matched over plain `curl`.
- **Wording corrected during verification** (each was a real error, now fixed in the artifacts):
  the SSH FAQ sentence says "an SSH client **and** the root password"; the fork line is "fork a new,
  independent session"; the Harness Runtime memory and storage rows read "Actual memory allocated
  over time" and "Actual capacity held over time"; the harness agent list continues "…LangGraph,
  CrewAI, Hermes, and OpenHands"; the spend-alert sentence continues "…unless you enable pausing on
  a model access key alert"; the `doctl` sentence is "using the DigitalOcean API, or using `doctl`,
  the DigitalOcean CLI"; the session-lifecycle line ends "…view logs for sessions, and cancel runs";
  the product heading is "Runs the harnesses you already use".
- **The Docker 1-Click quote was dropped.** The Marketplace listing's description does not render in
  either fetch path, so `docker-inside` now cites the OpenClaw announcement's statement that the
  agent runs in a Docker container, which is first-party evidence that Docker works inside a
  Droplet. The Marketplace link stays in the note.
- **Engine probe.** `node --experimental-strip-types` against `site/src/lib/cost.ts` with this card
  prints A **$5.95**, B **$52.14**, C **$3.21**, all `feasible: true`, on the shapes named in
  `abc.md`. That is the engine gap recorded in section 3, confirmed rather than assumed.

## 9. Integration notes for the parent thread

- Provider id `digitalocean`; rate card `pricing.json`; profile `provider.json`.
- Feature and capability rows are complete for today's 16 features and 78 capabilities, derived
  from `site/src/data/`.
- `docs.json` topics should point at: Droplets features (isolation, sizes), pricing docs (billing),
  resize (live-resize), snapshots/backups/volumes (state), Droplet Console (web terminal), DNS
  (domains), firewalls (network), MCP (ways to drive), teams/roles/SSO (teams), signup credit
  (trials), SLA/trust (company), and the Managed Agents pages for the agent-specific rows.
- `compare/side-by-side.astro` needs a `kinds` label for DigitalOcean: "VPS (full VM)".
- The two engine gaps in section 3 must be resolved before the rendered B and C can match the
  profile. Do not bless the engine's numbers.
- Nothing here was committed, and no shared site JSON was edited.

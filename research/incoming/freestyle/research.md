# Freestyle — provider research

Research date: **2026-10-30**. Repository revision: `197302e` (`origin/main`). Target provider id:
`freestyle`. Desk research only: no account was created, no credential used, no VM started, nothing
billed.

**Scope.** Freestyle VMs as a sandbox-style provider for agents: the Free, Hobby, Pro and Enterprise
plans; VM lifecycle, snapshots and forks; storage and networking; secrets and identities; the
dashboard, CLI, SDK and API; and the ten use cases the guide covers. Freestyle's older "Sandboxes"
product and its app-hosting templates are out of scope except where the current docs still mention
them.

**Tag legend**

| Tag | Meaning |
|---|---|
| `docs-confirmed` | Stated on `freestyle.sh/docs`, `about.md`, `openapi.json` or another first-party product page. |
| `pricing-page` | Stated on a page whose subject is money (`/pricing`, `/pricing.md`, the pricing section of the docs). |
| `third-party` | Not from Freestyle. Used only for company colour, never for a rate or verdict. |
| `inferred` | My reading of documented behaviour, not a sentence the source states. |
| `not-published` | Freestyle does not answer the question on any page I could find. |

**Quote handling.** Quotes are copied from the live page, then machine-checked with whitespace
collapsed, Markdown backticks and `*` removed, curly quotes straightened, and spaces removed before
`,` `.` `;` `:` (HTML tag stripping inserts those spaces). No other normalisation. All 126 quotes
cited here and in the JSON artifacts matched the live page on 2026-10-30; see §9.

---

## 1. What the product is

Freestyle sells full Linux virtual machines. A VM is created from a base snapshot, accepts commands
through an SDK/CLI/SSH, can pause with memory intact, can be snapshotted or forked, and can publish a
port at a public domain.

> "Freestyle VMs are full Linux virtual machines designed for long-running, complex tasks."
> — https://www.freestyle.sh/docs/vms (`docs-confirmed`)

> "They start quickly, persist their files, can preserve memory while paused, and wake when work
> needs to run." — same page (`docs-confirmed`)

The company positions the product for long-running agent tasks, branching experiments, complex coding
work and multi-tenant platforms, and explicitly **not** for production application hosting, sustained
CPU work or very short tasks:

> "**Sole Application Hosting**: Freestyle VMs are designed as workbenches for development,
> experimentation and task execution. Not for hosting production applications." —
> https://www.freestyle.sh/about.md (`docs-confirmed`)

> "we do not offer autoscaling, load balancers or CDNs and we don't plan to" — same page
> (`docs-confirmed`)

> "**CPU Intensive CI/CD**: Freestyle VMs run on bare metal on data center CPUs. We also oversubscribe
> host resources." — same page (`docs-confirmed`)

> "If your average task takes less than 15 minutes to complete then they are likely cheaply retryable
> and don't require the reliability and persistence that Freestyle VMs provide." — same page
> (`docs-confirmed`)

That is unusual and useful: the vendor itself tells a buyer when not to use it.

**Isolation.** A hardware-virtualised Linux VM, not a shared-kernel container. The base Ubuntu image
runs systemd as pid 1, Docker starts at boot, and nested virtualisation, FUSE and eBPF are supported:

> "supporting nested virtualization, FUSE, eBPF, full Linux networking and more" —
> https://www.freestyle.sh/about.md (`docs-confirmed`)

> "the Docker Engine runs inside one natively" —
> https://www.freestyle.sh/docs/guides/run-docker-in-a-sandbox (`docs-confirmed`)

Root is available through `vm.linuxUser("root")`; the default `ubuntu` user has passwordless sudo.
The published image catalogue is Ubuntu 24.04 at six sizes, Kali 2026.3 and BusyBox. GPUs and
colocated bare metal are private enterprise offers with no price.

**Sizes.** Any CPU/memory/disk combination up to the plan caps, not a fixed shape list. Free tops out
at 4 vCPU / 8 GiB / 32 GB, Hobby at 8 / 16 / 64, Pro at 32 / 64 / 256. The 64 vCPU / 128 GiB base
image needs custom limits. CPU and memory resize live and all three dimensions are grow-only.

**No region choice.** `CreateVmRequest` in the OpenAPI document has no region, location or
availability-zone field, and the VM response describes placement as internal:

> "Placement and topology internals (hosting manager, VXLAN ids, node-local network allocation) are
> not part of this contract." — https://www.freestyle.sh/openapi.json (`inferred`)

I therefore record `choose-region` as `no` and `eu-region` as `not-published`. The second is
deliberately weaker: nothing disproves an EU location, but nothing publishes one either.

---

## 2. Prices (fresh read, 2026-10-30)

Sources: `https://www.freestyle.sh/pricing.md` (the machine-readable pricing document, fetched fresh),
`https://www.freestyle.sh/docs/vms/pricing-and-limits`, and `https://www.freestyle.sh/pricing`
(rendered). All three agree on the rates. The rendered page's FAQ answers are client-rendered and did
not appear even in a Firecrawl render, so no claim here relies on them.

### 2.1 Plans

| Plan | Price | Concurrent VMs | Saved VMs | Snapshots | Max per VM |
|---|---|---:|---:|---:|---|
| Free | $0 | 10 | 10 | 10 | 4 vCPU / 8 GiB / 32 GB |
| Hobby | $50/month minimum, including $50 usage | 40 | 200 | 1,000 | 8 vCPU / 16 GiB / 64 GB |
| Pro | $500/month minimum, including $500 usage | 400 | 4,000 | 12,000 | 32 vCPU / 64 GiB / 256 GB |
| Enterprise | Custom | Custom | Custom | Custom | Custom |

> "The Hobby and Pro monthly fees are a usage credit, not a surcharge: your first $50 (Hobby) or $500
> (Pro) of usage each month is already covered by the plan fee, and you are only billed for usage
> beyond it." — https://www.freestyle.sh/docs/vms/pricing-and-limits (`pricing-page`)

> "Adding a card to a Free account charges **$1 USD for verification**, then Freestyle automatically
> issues a full refund to that card." — same page (`pricing-page`)

The $1 verification is not a plan payment and adds no credit. The product page says the Free plan
needs no card at all: "No credit card required." (`https://www.freestyle.sh/products/vms`,
`docs-confirmed`).

### 2.2 Usage rates and monthly allowances

| Resource | Rate | Included every month, every plan |
|---|---:|---:|
| vCPU-hour | $0.04032 | 200 |
| GiB-hour of memory | $0.0129 | 400 |
| GiB-hour of storage | $0.000086 | 60,000 |
| GB of data transfer | $0.02 | 50 on Free; 500 on Hobby and Pro |

> "Compute is metered per second and billed per hour of resource used. vCPU, memory and storage are
> all billed on the amount allocated to the VM for the time it is allocated — a reserved core is
> yours whether or not the guest is busy. A paused VM holds no compute reservation, so it bills only
> for storage while it sleeps." — https://www.freestyle.sh/docs/vms/pricing-and-limits
> (`pricing-page`)

> "The free-included amounts reset monthly and apply to every plan. On Free, they are hard allowances
> and usage does not continue into paid overage." — same page (`pricing-page`)

Two consequences matter to a buyer:

- **Allocated, not active.** A 4 vCPU VM that idles at 3% CPU still pays for 4 vCPUs. Measured-CPU
  billing exists only as an Enterprise option.
- **Storage is charged twice over.** It bills while the VM runs and while it is paused. The 60,000
  GiB-hour allowance is generous (82 GiB running continuously for a month), but it is a GiB-hour
  budget, not a free disk size.

Data transfer counts bytes crossing the datacenter boundary in either direction; traffic between your
own VMs in a VPC is not billed.

### 2.3 Enterprise and unpublished charges

Enterprise adds custom limits, SAML SSO and SCIM, audit logs, a 99.99% SLA, dedicated support,
measured-CPU billing, node-based pricing and commitment discounts. None of those prices is published,
so none is modelled.

Snapshot storage is **not** separately priced anywhere I could find. The tariff lists four resources
and no snapshot line. Whether a snapshot bills at the storage rate and on what size is unknown, so the
calculator adds nothing. This is a real omission, not a zero.

There is no charge for a public IPv4, no per-seat fee, no image fee and no minimum run duration.

---

## 3. A, B and C

Full arithmetic is in [`abc.md`](abc.md). Summary:

| Case | Hand-worked | Engine on `pricing.json` | Difference |
|---|---:|---:|---|
| A — 1,000 × 10 min, 2 vCPU / 4 GiB / 10 GiB | $50.00 | $50.00 | none |
| B — 4 vCPU / 8 GiB / 50 GiB, 730 h | $179.85 | $179.85 | none |
| C — 2 vCPU / 4 GiB / 20 GiB, 90 h on + 640 h paused | $0.00 (Free) | $50.00 (Hobby) | $50.00 |

A is $8.82 of metered usage after allowances, raised to the $50 Hobby minimum because Free's 200
vCPU-hour and 400 GiB-hour caps are too small. B fits Hobby and pays $179.85. C fits every Free
allowance exactly and is $0 on Free — **if** Free keeps the disk between sessions.

The engine's C answer differs because it applies the storage allowance only to the running-hours disk
line, leaving $1.10 of paused storage to trip Free's hard cap. The smallest fix is to apply the one
`diskHours` budget across both disk lines in `priceOnPlan` (`site/src/lib/cost.ts`); the rate card is
not bent to hide it. The same gap overstates the `team` preset by $2.41.

**Free persistence is the load-bearing unknown.** The docs' plan table marks persistent VMs available
on Free; the pricing page's limit table marks them unavailable. If the pricing page is right, C costs
$50 on Hobby. The cost case uses the docs and carries a flag naming the alternative.

---

## 4. Features

### 4.1 Isolation — `yes`

Full VM, own kernel, root, Docker, nested virtualisation. The only shortfall is custom images: there
is no Dockerfile or image import, so a custom base is a configured VM captured as a snapshot
(`custom-image`, `partly`). GPU is `partly`: private enterprise only, no price.

### 4.2 Sizes and regions — `partly`

Any size up to the plan caps (`any-size`, `yes`), 32 vCPU / 64 GiB on Pro (`big-machines`, `yes`), live
CPU/memory resize (`live-resize`, `yes`), GPU enterprise-only (`partly`). No region choice
(`choose-region`, `no`, inferred) and no EU option published (`eu-region`, `not-published`). The
feature verdict is `partly` because the region half fails.

### 4.3 Lifecycle — `yes`

> "Pausing freezes the VM and saves its memory. Starting it again resumes the same processes at the
> same point, with open files and in-memory state intact." —
> https://www.freestyle.sh/docs/vms/lifecycle (`docs-confirmed`)

> "VMs provision in about 65ms from API request to ready machine." —
> https://www.freestyle.sh/products/vms (`docs-confirmed`)

Stop keeps the disk and drops memory. Pause does not count against the concurrent-VM limit. Run limits
(`ttlSeconds`, `maxRunSeconds`, `maxRunTotalSeconds`) are optional and unset by default. A warm pool is
`not-published`; boot is fast enough that none is documented.

### 4.4 Snapshots and forks — `yes`

> "Start from a base snapshot, set it up however you want, resize if you need more, and capture its
> exact memory and disk." — https://www.freestyle.sh/docs/vms/base-snapshots (`docs-confirmed`)

> "Clone a running VM without pausing it — get full copies in milliseconds." —
> https://www.freestyle.sh/products/vms (`docs-confirmed`)

Snapshots keep memory and disk (`snapshot-memory`, `yes`), are private by default, boot in about a
second, and are kept until deleted, so an older one can be chosen (`older-snapshot`, `yes`). They work
as templates (`yes`). Automatic backups are `not-published`; snapshots are manual.

### 4.5 Storage — `partly`

The VM disk is the storage model. A persistent VM keeps it across a stop; an ephemeral VM is deleted
when it stops. Files can be read while the VM is paused, and a single file can be 16 GiB.

> "A stopped VM keeps its disk but discards its memory." —
> https://www.freestyle.sh/docs/vms/lifecycle (`docs-confirmed`)

There is no separate block volume (`volumes`, `partly`: a snapshot can outlive the VM, but you boot a
new VM from it rather than attach it). There is no shared volume (`shared-volume`, `partly`); the
shared-storage route is an S3 bucket mounted with FUSE (`mount-buckets`, `yes`). Disks reach 256 GB on
Pro (`big-disk`, `yes`).

### 4.6 Idle timers — `yes`

> "Configure an idle timeout to let Freestyle pause VMs that have no network activity." —
> https://www.freestyle.sh/docs/vms/lifecycle (`docs-confirmed`)

> "A VM paused this way resumes on its next start, or on the next traffic that reaches it." — same page
> (`docs-confirmed`)

`idleTimeoutSeconds: -1` removes the timeout, so a machine can stay on indefinitely. There is no
scheduler (`schedules`, `not-published`): cron inside a running VM is the user's own and stops when the
VM pauses.

### 4.7 Reaching it — `yes`

Public HTTPS through a TLS rule, a free `style.dev` subdomain or a verified domain; SSH through
`beta-ssh.freestyle.sh` with a scoped token; a PTY API; WireGuard tunnels into a VPC; TLS passthrough
for non-HTTP protocols.

> "Use inbound rules to give services on your VM a public domain." —
> https://www.freestyle.sh/docs/vms/network/tls-inbound (`docs-confirmed`)

Two shortfalls: there is no hosted browser terminal (`web-terminal`, `partly` — you build one with
xterm.js or ttyd), and a private link needs your own authorizer behind forward auth (`private-url`,
`partly`). Raw TCP is `yes` through TLS passthrough, the Minecraft/IMAP edges, or a tunnel.

### 4.8 Custom domains — `yes`

> "Any unused subdomain of `style.dev` is yours to take, with no verification, no DNS records, and no
> certificate of your own." — https://www.freestyle.sh/docs/vms/domains (`docs-confirmed`)

> "HTTPS is provisioned automatically, once `_acme-challenge` is delegated" — same page
> (`docs-confirmed`)

Wildcards are supported for a domain you own. The `style.dev` name is a single label, not a wildcard.

### 4.9 Outbound network — `partly`

Default deny. A VM reaches nothing until a firewall rule allows it:

> "A VM gets nothing implicitly — no outbound Internet, no inbound" —
> https://www.freestyle.sh/openapi.json (`docs-confirmed`)

Allowlisting works by CIDR, VM, VPC, tunnel or exact TLS domain. Egress includes 50 GB on Free or
500 GB on paid plans, then $0.02/GB. The shortfall is the fixed address: every VM shares one
account-level outbound IPv4 that survives restarts, but the API says it is optional and not promised:

> "It belongs to your account rather than to this VM: every VM you own shares it, and it survives
> restarts and moves between machines." — https://www.freestyle.sh/openapi.json (`docs-confirmed`)

> "nothing promises an account keeps a single outbound address" — same document (`docs-confirmed`)

### 4.10 Keys and secrets — `yes`

> "Credential injection lets the VM authenticate without receiving the real API key or database
> password." — https://www.freestyle.sh/docs/vms/network/tls-outbound (`docs-confirmed`)

Stored headers are encrypted at the edge and read back as `"***"`; the VM sends a placeholder.
Identities scope an end user to named VMs and Linux users (`scoped-keys`, `yes`). There is no
environment-variable secret store (`secrets-store`, `no`): the mechanism is request injection, not
export into the guest.

### 4.11 Ways to drive it — `yes`

Dashboard (`dash.freestyle.sh`), CLI (`npx freestyle`), TypeScript SDK, OpenAPI, PTY and file APIs.
The dashboard creates VMs — its shipped bundle contains a `/vms/create` form with slug, display name
and idle timeout — though no docs page describes that flow. Python is `partly`: PyPI has an official
`freestyle` package, but it is the older **Sandboxes** SDK at 0.0.17, and the current VM docs are
TypeScript-only. There is no MCP server that controls Freestyle (`mcp-server`, `not-published`); the
docs instead suggest running your own MCP server inside a VM.

### 4.12 Built-in agents — `partly`

> "claude, codex, opencode, and openclaw, also installed in the shared Node tree" —
> https://www.freestyle.sh/docs/vms/base-snapshots (`docs-confirmed`)

Claude Code, Codex, opencode and OpenClaw are preinstalled and on PATH. There is no prompt API
(`prompt-api`, `no`): you start the agent yourself over a PTY or SSH. Hermes has no image, template or
guide (`one-click-hermes`, `no`). OpenClaw has a terminal guide, not a one-click template
(`one-click-openclaw`, `no`). A browser (`partly`) and a GNOME desktop (`partly`) come from guides that
install Chromium/TigerVNC/noVNC and snapshot the result. Other platforms' agents are `partly`: guides
cover Claude Code, Codex, Copilot, t3 and Omnara, but not Cursor cloud agents, Devin or Claude Managed
Agents.

### 4.13 Teams and accounts — `partly`

Teams exist (the CLI can list and switch them), and identities/tokens scope VM access. But no role
names or permissions are documented (`roles`, `not-published`), no dollar spend cap is published
(`spend-cap`, `not-published`), and no usage alert is documented (`usage-alerts`, `not-published`).
SAML SSO/SCIM and audit logs are Enterprise-only (`partly`).

### 4.14 Billing models — `partly`

Per-second metering (`per-second`, `yes`), allocated rather than active CPU (`active-cpu`, `partly`),
storage-only while paused (`cheap-pause`, `yes`), no monthly fee only on Free (`no-monthly-fee`,
`partly`), and no flat machine price (`flat-price`, `no`). The $50 minimum is the defining feature for
small workloads.

### 4.15 Trials and free tiers — `yes`

Free is a real ongoing tier, not a trial: 200 vCPU-hours, 400 GiB-hours of memory, 60,000 GiB-hours of
storage and 50 GB of transfer a month, with no card. It is a hard stop. The only published credit is a
$5,000 YC-founder deal plus a $25,000 match (`free-credit`, `partly`); there is no general signup
credit.

### 4.16 Company — `partly`

Freestyle Cloud Inc., founded 2024, YC-backed, 5 employees in San Francisco per Y Combinator. A status
page exists and showed all systems operational on 30 October 2026. A 99.99% SLA is Enterprise-only. No
SOC 2 report, trust centre, DPA or subprocessor page is published (`soc2`, `dpa` both
`not-published`). The platform is hosted only; no self-hosted edition or platform licence is published
(`open-source`, `no`).

---

## 5. Capability ledger

All 78 rows, with their exact quote, URL and confidence, are in
[`capability-rows.json`](capability-rows.json). This table is the index; the JSON is the claim-level
evidence.

| Capability | Verdict | Key evidence |
|---|---|---|
| own-vm | yes | docs: "Freestyle VMs are full Linux virtual machines" |
| root | yes | onboard: "full root" |
| docker-inside | yes | guide: "Docker is already installed in all Ubuntu base snapshots" |
| nested-virt | yes | about: "supporting nested virtualization" |
| custom-image | partly | snapshots, no Dockerfile/import |
| any-size | yes | "any valid size up to its CPU, memory, and disk maximums" |
| big-machines | yes | "up to 32 vCPUs, 64 GB RAM" |
| live-resize | yes | "Resizing happens live" |
| gpu | partly | "private GPU sandboxes for enterprise customers" |
| choose-region | no | no region field; placement internal (inferred) |
| eu-region | not-published | no EU option published |
| pause-memory | yes | "Pausing freezes the VM and saves its memory" |
| warm-pool | not-published | no pool documented |
| fast-start | yes | "about 65ms" |
| snapshot-files | yes | snapshot captures disk |
| snapshot-memory | yes | "exact state … (memory and disk)" |
| fork-running | yes | "Clone a running VM without pausing it" |
| older-snapshot | yes | "snapshots are kept until you delete them" |
| templates | yes | private snapshots boot new VMs |
| backups | not-published | no scheduled backup documented |
| files-survive-stop | yes | "A stopped VM keeps its disk" |
| volumes | partly | no separate volume; snapshot only |
| shared-volume | partly | S3 FUSE, not a shared disk |
| mount-buckets | yes | S3 bucket mounted with rclone |
| big-disk | yes | 256 GB on Pro |
| stay-on | yes | "Freestyle VMs can run forever" |
| choose-idle | yes | `idleTimeoutSeconds`; −1 never |
| wake-on-request | yes | traffic resumes a paused VM |
| schedules | not-published | no scheduler resource |
| public-url | yes | TLS rule to a VM port |
| private-url | partly | forward auth needs your authorizer |
| ssh | yes | `beta-ssh.freestyle.sh` |
| web-terminal | partly | build with PTY + xterm.js/ttyd |
| tunnel | yes | WireGuard into a VPC |
| raw-tcp | yes | TLS passthrough, Minecraft/IMAP, tunnel |
| custom-domain | yes | verified domain or style.dev |
| auto-https | yes | managed certificate |
| egress-included | yes | 50 GB free, 500 GB paid |
| egress-allowlist | yes | firewall + TLS domain rules |
| no-internet | yes | default deny |
| static-ip | partly | shared account IPv4, not guaranteed |
| secrets-store | no | injection, not env vars |
| hidden-secrets | yes | edge header injection |
| scoped-keys | yes | per-VM identity tokens |
| dashboard-create | yes | dashboard `/vms/create` (inferred) |
| cli | yes | `freestyle` CLI |
| python-sdk | partly | PyPI is the older Sandboxes SDK |
| ts-sdk | yes | `npm install freestyle@latest` |
| rest-api | yes | OpenAPI 3 at `/openapi.json` |
| mcp-server | not-published | no control MCP; run your own in a VM |
| pty | yes | PTY over WebSocket |
| file-api | yes | read/write, 16 GiB per file |
| agents-preinstalled | yes | Claude Code, Codex, opencode, OpenClaw |
| prompt-api | no | no prompt endpoint |
| one-click-hermes | no | no Hermes material |
| one-click-openclaw | no | terminal guide only |
| browser | partly | Chromium installed by a guide |
| desktop | partly | GNOME built by a guide |
| hosts-other-agents | partly | Claude Code/Codex/Copilot/t3/Omnara, not Cursor/Devin |
| team-workspace | yes | teams and team keys |
| roles | not-published | no role names documented |
| sso | partly | Enterprise only |
| spend-cap | not-published | no dollar cap published |
| usage-alerts | not-published | wallet chart only |
| audit-log | partly | Enterprise only |
| per-second | yes | "metered per second" |
| active-cpu | partly | allocated; measured CPU Enterprise |
| cheap-pause | yes | "bills only for storage while it sleeps" |
| no-monthly-fee | partly | Free $0; paid $50 minimum |
| flat-price | no | plans are minimums |
| free-tier | yes | 200 vCPU-h/month |
| free-credit | partly | YC founders only |
| no-card | yes | "No credit card required." |
| status-page | yes | `/status` |
| sla | partly | Enterprise only |
| soc2 | not-published | no report or trust centre |
| dpa | not-published | no DPA page |
| open-source | no | hosted only; CLI repo unlicensed |

---

## 6. Use-case routes

Full text, links and prices are in [`routes.json`](routes.json).

| Use case | Tier | No terminal | Price at the preset | Disposition |
|---|---|---|---|---|
| hermes-agent | manual | no | ~$83/mo | No Hermes material; not recommended |
| openclaw | guide | no | ~$83/mo | First-party guide; recommended with caveats |
| coding-agent | preinstalled | no | $50/mo | Recommended |
| code-interpreter | backend | no | ~$50/mo | SDK build only |
| browser-agent | guide | no | ~$648/mo | Capable but expensive |
| workflow-automation | manual | no | ~$83/mo | No n8n template |
| chat-bot | manual | no | $50/mo | Telegram guide only |
| claude-code-team | preinstalled | no | ~$206/mo | Recommended |
| scheduled-scraper | manual | no | $0/mo | Cheapest fit; no scheduler |
| mcp-server | manual | no | $50/mo | Manual, high floor |

Four picks: coding-agent, claude-code-team, browser-agent and openclaw. Three situation picks:
long-jobs, build-and-test and one-per-customer. `notPicked` records the four use cases where Freestyle
has no route worth recommending.

The route prices are hand-checked against the same arithmetic as A/B/C. The team figure is $205.76
hand-worked (the engine says $208.16 because of the paused-storage allowance gap described in
`abc.md`).

---

## 7. Contradictions (both sides kept)

### 7.1 Paused billing

- Pricing docs: "A paused VM holds no compute reservation, so it bills only for storage while it
  sleeps." — https://www.freestyle.sh/docs/vms/pricing-and-limits
- Product page: "Hibernate VMs and resume exactly where you left off — pay nothing while paused." —
  https://www.freestyle.sh/products/vms
- A guide repeats the marketing line: "a paused VM bills nothing" —
  https://www.freestyle.sh/docs/guides/run-a-telegram-bot-in-a-sandbox

**Interpretation used:** storage keeps billing while paused; CPU and memory stop. The tariff table
lists storage as a metered resource, the changelog charts storage separately in the wallet, and the
pricing docs are the specific page for billing. The marketing lines are treated as shorthand for "no
compute charge".

### 7.2 Free persistence

- Docs plan table: "Persistent VMs ✓ ✓ ✓" — https://www.freestyle.sh/docs/vms/pricing-and-limits
- Pricing page limit table: "Persistent VMs ✗ ✓ ✓" — https://www.freestyle.sh/pricing
- Pricing page: "Persistent Snapshots ✗ ✓ ✓" — same page
- Docs prose: "**Persistent VMs** keep their disk once stopped, so they can start again." —
  https://www.freestyle.sh/docs/vms/pricing-and-limits

**Interpretation used:** Free can keep a disk between sessions, because the docs' detailed table and
the pause/resume behaviour both require it. The pricing page's ✗ is treated as a stale or
differently-scoped marketing table — it also marks "Custom Sizing ✗" for Free while the docs say every
plan can create any valid size up to its caps. Consequence: C is $0 on Free. If the pricing page is
right, C is $50 on Hobby; the cost case flags this.

### 7.3 Disk units

- Docs: "| Max disk per VM | 32 GB | 64 GB | 256 GB |" — https://www.freestyle.sh/pricing.md
- Pricing page: "Max Disk per VM 32 GiB 64 GiB 256 GiB" — https://www.freestyle.sh/pricing

**Interpretation used:** GiB, because the meter is explicitly per GiB-hour and the base images list
GiB. The difference is about 7% at the cap and does not affect A/B/C.

### 7.4 Command timeout

- VMs page: "The maximum timeout is five minutes" — https://www.freestyle.sh/docs/vms
- October changelog: "supports timeouts up to 24 hours" on VMs with an updated guest agent —
  https://www.freestyle.sh/changelog

**Interpretation used:** both are current for different VMs; the docs page has not been updated. Not
material to any verdict.

### 7.5 Custom sizing

The pricing page marks "Custom Sizing ✗" for Free, but the docs say "Every plan can create a VM at any
valid size up to its CPU, memory, and disk maximums." Treated as the same stale table as 7.2.

---

## 8. Unknowns (searched, not answered)

| Question | Status | Consequence |
|---|---|---|
| How is snapshot storage billed, and on what size? | `not-published` | Not added to any cost; a real omission. |
| Is there an EU region or data-residency option? | `not-published` | No EU pick; `eu-region` row says so. |
| SOC 2 report, ISO 27001, trust centre | `not-published` | No `soc2` claim; buyers must ask. |
| DPA and subprocessors | `not-published` | No `dpa` claim. |
| Team roles and permissions | `not-published` | No `roles` claim. |
| Dollar spend cap and usage alerts | `not-published` | No `spend-cap` or `usage-alerts` claim. |
| Warm pool of pre-started VMs | `not-published` | No `warm-pool` claim. |
| Scheduled runs / cron as a service | `not-published` | No `schedules` claim. |
| Official MCP server for Freestyle | `not-published` | No `mcp-server` claim. |
| Python SDK for the current VM API | `not-published` | PyPI package is the older Sandboxes SDK. |
| A guaranteed fixed egress IP | Not promised | `static-ip` is `partly`. |
| GPU price and availability | Not published | `gpu` is `partly`; enterprise only. |
| General signup credit | Not published | Only the YC-founder deal. |

Searched: the full docs (`llms-full.txt`, 92 pages), the pricing page and `pricing.md`, `about.md`,
`openapi.json`, the changelog, the blog index, the status page, the privacy policy, the YC page, the
dashboard bundle and the GitHub organisation. No trust centre, `/security`, `/trust`, `/dpa`, `/soc2`
or `/terms` page exists (all returned 404 except `/privacy`).

---

## 9. Verification performed

- **Quote check:** every quote in this file and in the JSON artifacts was fetched live from its cited
  URL on 2026-10-30 and matched after the declared normalisation. Result: **106/106 artifact quotes
  and every quoted passage in this file found**. The checker fetched every URL fresh (no cache),
  parsed JSON documents by walking their string values, and included HTML meta descriptions where the
  visible page is client-rendered.
- **Engine run:** `price()` from `site/src/lib/cost.ts` against `pricing.json` with `presets.a/b/c` and
  the eight use-case presets. A and B match the hand-work; C differs by $50 for the reason in §3 and
  `abc.md`.
- **Artifact structure:** `feature-rows.json` has 16 rows, one per feature in `site/src/data/features`;
  `capability-rows.json` has 78 rows, one per capability in `site/src/data/capabilities.json`;
  `routes.json` has 10 routes, one per use case; `docs.json` has all 16 feature keys plus quickstart and
  pricing. Every capability row has a source URL, quote and confidence; every `partly` has a shortfall.
- **Not verified:** no account, no dashboard login, no VM created, no snapshot taken, no price paid.
  The dashboard-create verdict comes from the shipped JavaScript bundle, not from using the form. The
  rendered pricing FAQ answers never appeared, so no claim depends on them.

### Retrieval log

| Tool | Call | Result |
|---|---|---|
| TinyFish `fetch_content` | `llms-full.txt` | Succeeded, truncated by the tool at 262,144 characters |
| TinyFish `fetch_content` | `freestyle.sh/` | Succeeded |
| TinyFish `fetch_content` | `/pricing` | Succeeded (FAQ answers empty) |
| TinyFish `fetch_content` | `/products/vms` | Succeeded |
| TinyFish `fetch_content` | YC company page | Succeeded (body only) |
| TinyFish `search` | company/funding query | Succeeded, 9 results |
| Firecrawl `firecrawl_scrape` | `/pricing`, live, 4 s wait | Succeeded; FAQ headings but no answers |
| Direct `curl` (fallback) | full `llms-full.txt`, `pricing.md`, `about.md`, `onboard.md`, `openapi.json`, sitemap, status, privacy, changelog, `yc.md`, GitHub API, dashboard bundle | Succeeded; used where the Composio fetch truncated or the page is not HTML |
| Context, Exa, Tavily, Parallel | — | Not used |

The TinyFish and Firecrawl responses did not return a per-call dollar total. Firecrawl's workspace
balance showed 410 of 1,000 credits remaining, but that balance is shared and cannot be attributed to
this run. No paid plan was upgraded; the run stayed within the requested budget.

---

## 10. Integration notes for the parent

1. **Provider id** `freestyle`; `status: "researched"`; `checkedOn: "2026-10-30"`. The rate card has the
   same date.
2. **Rate card** uses `cpu.billing: "allocated"`, `ram.billing: "allocated"`, both disk rates at
   $0.000086, `sleeps`, `between: "kept"`, and three plans with the same `allowance` block. Free is
   `capped`. Hobby and Pro carry `fee` and `credit` equal to their minimums.
3. **Engine gap:** C needs the storage allowance applied to paused hours. The smallest change is in
   `priceOnPlan`'s allowance block (`site/src/lib/cost.ts`), as described in `abc.md`. Without it the
   site will show $50 for C and overstate the team preset by $2.41.
4. **Feature row `sizes-regions` is `partly`** because there is no region choice, not because of a size
   limit. The capability rows carry the detail.
5. **Do not advance** `capabilities.json.checkedOn` or `usecases.json.checkedOn` for this one provider;
   those are whole-dataset dates.
6. **Docs links** in `docs.json` are all live first-party pages; `#idle-timeout` and `#whats-installed`
   are anchors on pages that contain those headings.
7. **Side-by-side** needs a `kinds` entry for `freestyle`; it is not a VPS, so the label should say
   "sandbox VM" or similar rather than `vps`.
8. **Tests to add on integration:** hand-worked fixtures for A ($50), B ($179.85) and C ($0 after the
   storage-allowance fix). Do not bless the current engine's $50 for C; it is the known gap, not the
   tariff.
9. **No shared site JSON was edited, nothing was committed or pushed.** These are research artifacts
   only.

# Akamai Cloud (Linode) — provider research

Research date: **2026-10-30** (Asia/Kolkata; live pages read 2026-10-30 IST / 2026-10-29 UTC).
Repository revision: **`df4cd0c`** on `main` (clean worktree apart from this directory).
Target provider id: **`linode`**. Desk research only: no Akamai account was created, no Linode was
deployed, nothing was bought or measured. Prices are the published list, not an invoice.

**Scope.** Akamai Cloud's CPU compute instances — Shared CPU, G6 Dedicated, G7 Dedicated, G8
Dedicated and High Memory — plus the billing, storage, networking, access and account features a
reader needs to host an agent. GPU, Accelerated (VPU) and Kubernetes plans are described where a
reader would trip over them but are not priced. The separate **Akamai Agent Sandbox** product
(WebAssembly sandboxes on Akamai Functions) is named only to keep it from being confused with a
Linode.

**Tag legend**

| Tag | Meaning |
|---|---|
| `docs-confirmed` | Stated on an Akamai TechDocs page or an Akamai legal page. |
| `pricing-page` | Stated on a page whose subject is money (the CPU pricing page, the free-credit page, the backups pricing page). |
| `third-party` | Not from Akamai. Not used for any rate or verdict in this file. |
| `inferred` | My reading of a documented surface where the answer is absent, such as an API with no file endpoint. |
| `not-published` | Akamai does not answer the question on any current page I could find. |

**Quote handling.** Quotes are copied from the fetched Markdown/HTML of each page on 2026-10-30. A
script re-fetched 35 of the 42 cited URLs and checked every quote in `capability-rows.json`,
`feature-rows.json` and `provider.json` against the raw page. Normalisation applied for the check:
HTML tags removed, Markdown links replaced by their text, `*` and backticks removed, backslash
escapes removed, HTML entities decoded, zero-width characters removed, typographic quotes and dashes
folded to ASCII, whitespace collapsed. No wording, number or qualifier was changed. 84 of 84 quotes
on machine-readable pages matched. The eight URLs Akamai blocks to scripted fetches (the pricing
pages, `akamai.com/company`, the MSA, the SLA, the free-credit page, the DPA PDF and one community
answer) were read through Composio and checked by reading the returned text; section 12 lists them.

**Retrieval method.** Composio first: **TinyFish** `search` for discovery and `fetch_content` with
`ttl: 0` for fresh page reads (about 30 URLs), **Firecrawl** `firecrawl_scrape` once to render the
JavaScript-only Marketplace list, **Context** `web_scrape` for the DPA PDF and its SOC 2 clause.
Akamai TechDocs publishes `.md` versions of every page, and `curl` against those (read-only GETs)
was used for the long tail of documentation. Two live read-only API calls
(`api.linode.com/v4/regions`, `/v4/linode/types`) cross-checked region and plan data; both are public
and need no token. No cached scrape was used for a price. No paid dataset or deep-research report was
bought.

**Spend.** Effectively **$0**: TinyFish `search` and `fetch_content` are free, and the only metered
calls were one Firecrawl render and two Context scrapes of the DPA PDF. Well inside the $1 cap.

---

## 0. Why the provider id is `linode`

The compute product is now **sold as Akamai Cloud**, and `linode.com/pricing` redirects to
`akamai.com/cloud/pricing`, whose CPU tab is `akamai.com/cloud/pricing/cpu`. But the product is not
*only* branded Akamai:

- The MSA calls the service "**Akamai Cloud (formerly Linode)**" — [MSA](https://www.akamai.com/legal/msa) `docs-confirmed`.
- The compute SLA is "by and between you and **Linode**" — [Compute SLA](https://www.akamai.com/legal/sla-compute) `docs-confirmed`.
- The plans are still named "**Linode 4 GB**", "Nanode 1 GB" and so on — [CPU pricing](https://www.akamai.com/cloud/pricing/cpu) `pricing-page`.
- The API host is `api.linode.com`, the console is `cloud.linode.com`, the CLI is `linode-cli`, and the status page is `status.linode.com`.

So the product has a dual identity, not a completed rename. `linode` is the stable, searchable id a
reader will recognise, and the profile name "Akamai Cloud (Linode)" carries both. If the site later
prefers `akamai`, the id is the only thing that changes.

---

## 1. What the product is

> "Linodes (also referred to as compute instances) are virtual machines that run on Akamai's secure and reliable global infrastructure." — [Linodes](https://techdocs.akamai.com/cloud-computing/docs/compute-instance) `docs-confirmed`

> "Linodes deployed to core compute regions meet the following specifications: Shared or Dedicated vCPU cores (dependent on the chosen plan); 100% SSD storage; 40 Gbps inbound network bandwidth; Free inbound network transfer (ingress); Metered outbound network transfer (egress) that includes 1 TB - 20 TB of prorated network transfer allowance; Dedicated IPv4 and IPv6 addresses (additional addresses available on request)" — same page `docs-confirmed`

Five CPU families, from [Choose a compute plan](https://techdocs.akamai.com/cloud-computing/docs/how-to-choose-a-compute-instance-plan) `docs-confirmed`:

| Family | Range | Cores | Notes |
|---|---|---|---|
| Shared CPU | 1-192 GB, 1-32 vCPU, 25-3,840 GB | shared | "should remain below 80% sustained usage on average" |
| G6 Dedicated | 4-256 GB, 2-56 vCPU, 80-5,000 GB | dedicated | legacy hardware, monthly cap |
| G7 Dedicated | 4-256 GB, 2-56 vCPU, 80-5,000 GB | dedicated | 3rd-gen EPYC, monthly cap |
| G8 Dedicated | 4-512 GB, 2-256 vCPU, 40-5,120 GB | dedicated | 1:2 and 1:4 shapes, **no monthly cap** |
| High Memory | 24-300 GB, 2-16 vCPU, 20-340 GB | dedicated | memory-heavy, little disk |

The docs' own range line for dedicated plans reads "**4 GB - 512 GB Memory, 2 - 256 Dedicated
vCPUs, 40 GB - 7200 GB Storage**". The 7,200 GB figure comes from the 512 GB G7 plan that the pricing
page lists but the live type list does not return (section 9).

---

## 2. Prices read on 2026-10-30

From [CPU plans and pricing](https://www.akamai.com/cloud/pricing/cpu) `pricing-page`, cross-checked
against `GET https://api.linode.com/v4/linode/types` (public, no token). The API returned the same
hourly and monthly figures for every plan below.

**Shared CPU**

| Plan | $/h | $/mo | RAM | vCPU | Disk | Transfer |
|---|---:|---:|---:|---:|---:|---:|
| Nanode 1 GB | 0.0075 | 5.00 | 1 GB | 1 | 25 GB | 1 TB |
| Linode 2 GB | 0.0180 | 12.00 | 2 GB | 1 | 50 GB | 2 TB |
| Linode 4 GB | 0.0360 | 24.00 | 4 GB | 2 | 80 GB | 4 TB |
| Linode 8 GB | 0.0720 | 48.00 | 8 GB | 4 | 160 GB | 5 TB |
| Linode 16 GB | 0.1440 | 96.00 | 16 GB | 6 | 320 GB | 8 TB |
| Linode 32 GB | 0.2880 | 192.00 | 32 GB | 8 | 640 GB | 16 TB |
| Linode 64 GB | 0.5760 | 384.00 | 64 GB | 16 | 1,280 GB | 20 TB |
| Linode 96 GB | 0.8640 | 576.00 | 96 GB | 20 | 1,920 GB | 20 TB |
| Linode 128 GB | 1.1520 | 768.00 | 128 GB | 24 | 2,560 GB | 20 TB |
| Linode 192 GB | 1.7280 | 1,152.00 | 192 GB | 32 | 3,840 GB | 20 TB |

**G6 Dedicated** (monthly cap): 4 GB $0.054/$36 (2 vCPU, 80 GB, 4 TB) · 8 GB $0.108/$72 (4, 160, 5 TB) ·
16 GB $0.216/$144 (8, 320, 6 TB) · 32 GB $0.432/$288 (16, 640, 7 TB) · 64 GB $0.864/$576 (32, 1,280, 8 TB) ·
96 GB $1.296/$864 (48, 1,920, 9 TB) · 128 GB $1.728/$1,152 (50, 2,500, 10 TB) · 256 GB $3.456/$2,304 (56, 5,000, 11 TB).

**G7 Dedicated** (monthly cap): 4 GB $0.0645/$43 (2 vCPU, 80 GB, 4 TB) · 8 GB $0.129/$86 (4, 160, 5 TB) ·
16 GB $0.2595/$173 (8, 320, 6 TB) · 32 GB $0.519/$346 (16, 640, 7 TB) · 64 GB $1.0365/$691 (32, 1,280, 8 TB) ·
96 GB $1.5555/$1,037 (48, 1,920, 9 TB) · 128 GB $2.073/$1,382 (50, 2,500, 10 TB) · 256 GB $4.1475/$2,765 (56, 5,000, 11 TB).

**G8 Dedicated, 1:2** (hourly only, **0 TB transfer**): 4x2 $0.07 (2 vCPU, 4 GB, 40 GB) · 8x4 $0.14 ·
16x8 $0.27 · 32x16 $0.54 · 64x32 $1.08 · 96x48 $1.62 · 128x64 $2.16 · 256x128 $4.32 · 512x256 $8.64.
**G8 Dedicated, 1:4** (hourly only): 8x2 $0.11 (2 vCPU, 8 GB, 80 GB) · 16x4 $0.21 · 32x8 $0.42 ·
64x16 $0.84 · 96x24 $1.26 · 128x32 $1.68 · 256x64 $3.36 · 512x128 $6.84.

**High Memory** (monthly cap): 24 GB $0.09/$60 (2 vCPU, 20 GB disk, 5 TB) · 48 GB $0.18/$120 (2, 40, 6 TB) ·
90 GB $0.36/$240 (4, 90, 7 TB) · 150 GB $0.72/$480 (8, 200, 8 TB) · 300 GB $1.44/$960 (16, 340, 9 TB).

Every shared, G6 and G7 monthly price equals exactly 666⅔ hours at its own hourly rate, so the cap
binds at 666.67 hours in every case.

**Other prices used in this research**

| Item | Price | Source | Tag |
|---|---|---|---|
| Block Storage | $0.10/GB-month, 10 GB-16 TB per volume | [Block Storage pricing](https://www.akamai.com/cloud/pricing/block-storage) | `pricing-page` |
| Egress overage | US$0.005 per GB | [CPU pricing](https://www.akamai.com/cloud/pricing/cpu) | `pricing-page` |
| Backups add-on | $2/mo (Nanode) to $200/mo; **$5/mo ($0.008/h) on Linode 4 GB** | [Backups pricing](https://www.akamai.com/cloud/pricing/backups), confirmed by `addons.backups` in `GET /v4/linode/types` | `pricing-page` |
| Signup credit | US$100, new customers, GPU excluded, expires | [Free credit](https://www.akamai.com/lp/free-credit-100) | `pricing-page` |

The pricing page's FAQ gives the credit window: "if you received a $100 credit for 60 days". A
separate Akamai developer README claims a $300 credit instead; the card uses $100 for 60 days and
records the disagreement in section 9.

---

## 3. The billing rules that decide A/B/C

> "Akamai uses a hybrid hourly billing model that's simple and flexible. … Once the month ends, you receive an invoice for the hourly usage of each service **up to the monthly cap**." — [Billing](https://techdocs.akamai.com/cloud-computing/docs/understanding-how-billing-works) `docs-confirmed`

> "Usage is always rounded up to the nearest hour." — same page `docs-confirmed`

> "Some services don't have a monthly rate. Starting July 1, 2026, G8 dedicated Linodes, GPU Linodes, and additional IPv4 addresses are billed for actual hours used each month, with no monthly price cap." — same page `docs-confirmed`

> "**Charges accrue for any service present on an account, even if it's powered off or otherwise not actively being used.** This is because data is still maintained and resources, such as RAM and network capacity are still reserved." — same page `docs-confirmed`

> "You're never billed more than the monthly rate for each service, excluding network transfer overages." — same page `docs-confirmed`

> "If you use a service for part of a month, you're charged only for the time it remains on your account." — same page `docs-confirmed`

> "When you resize a service, such as a Linode, you effectively create a new billable service. Each billable service appears as a separate line item on your monthly invoice." — same page `docs-confirmed`

That last sentence is the evidence for reading the hourly rounding **per service**: each Linode is
its own billable line item with its own hours. The alternative reading (round the month's total) would
change workload A from $36.00 to $6.01; see `abc.md`.

Storage units: "Storage usage is calculated in binary gigabytes (GB), where 1 GB is 2^30 bytes. This
unit of measurement is also known as a gibibyte (GiB)" — [Billing FAQ](https://techdocs.akamai.com/cloud-computing/docs/billing-faqs) `docs-confirmed`.
The live type endpoint returns disk in MiB (Linode 4 GB: 81,920 MB = 80 GiB), so the card's GiB
figures are exact.

---

## 4. A, B and C

Worked in full in [`abc.md`](abc.md). Summary:

| Case | Plan | Hand-worked | `price()` prints | Note |
|---|---|---:|---:|---|
| A | Linode 4 GB, 1,000 × 10 min | **$36.00** | $36.00 | 1,000 × 1 h × $0.036; the cap is per service, so it never binds |
| B | Linode 8 GB, 730 h | **$48.00** | $48.00 | 730 × $0.072 = $52.56, capped at $48 |
| C | Linode 4 GB, 90 + 640 h | **$24.00** | $24.00 | 730 × $0.036 = $26.28, capped at $24 |

The card expresses all three without engine changes: `Shape.monthly` for the cap,
`billedWhileStopped` for C, `wholeHours` for A. `minimumPerRun` is not needed and `monthlyPlans` is
wrong here (these are hourly plans with a cap, not prepaid months). Nothing in this tariff needs a
new `RateCard` field.

---

## 5. Feature ledger (16 features)

Each row here is the evidence behind `feature-rows.json`.

**Isolation — yes.** "Linodes (also referred to as compute instances) are virtual machines that run
on Akamai's secure and reliable global infrastructure." ([Linodes](https://techdocs.akamai.com/cloud-computing/docs/compute-instance), `docs-confirmed`).
Root: "Since you have full root access to your Linode's system…" ([FAQ](https://techdocs.akamai.com/cloud-computing/docs/faqs-for-compute-instances)). Docker is a one-click app
([Docker](https://techdocs.akamai.com/quick-deploy-apps/docs/docker)). Shared plans "should remain below 80% sustained usage on average,
including virtualization overheads" ([Choose a plan](https://techdocs.akamai.com/cloud-computing/docs/how-to-choose-a-compute-instance-plan)).
Nested virtualisation is not documented (section 10).

**Sizes and regions — yes.** Fixed shapes; "No, RAM and local disk storage are bundled into the
specific VM size. You cannot purchase extra RAM or local disk space individually for an existing
instance plan." ([CPU pricing](https://www.akamai.com/cloud/pricing/cpu), `pricing-page`). 33 core
regions from the live `/v4/regions` endpoint. Six EU countries plus the UK, quoted from
[Choose a data center](https://techdocs.akamai.com/cloud-computing/docs/how-to-choose-a-data-center):
"All European data centers, located at: Frankfurt DE, London UK, Milan IT, Paris FR, Amsterdam NL,
Stockholm SE, Madrid ES".

**Billing models — partly.** Hourly with a monthly cap, rounded up, and a powered-off machine bills
in full. G8 has no cap since 2026-07-01. The shortfall a reader cares about: there is no per-second
meter and no cheaper stopped state, so a mostly idle box costs the same as a busy one.

**Trials and free tiers — partly.** "Try Akamai Cloud with a US$100 Credit" and "Promotional credits
are available only to new customers who have not yet signed up for a free trial."
([Free credit](https://www.akamai.com/lp/free-credit-100), `pricing-page`). "You must spend your
service credits during the trial period." No recurring free allowance.

**Lifecycle — partly.** No pause or hibernate: a stop is a power-off. Files survive
("We maintain your saved data and reserve your ability to use other resources like RAM, transfer,
etc., even when your VM is powered off." — [CPU pricing FAQ](https://www.akamai.com/cloud/pricing/cpu)),
memory and processes do not, and the meter keeps running.

**Snapshots and forks — partly.** Images capture or upload a whole disk and "don't expire"; a clone
"copies all disks and configuration profiles" but "Before continuing, you should power off the Linode
you want to clone." ([Clone](https://techdocs.akamai.com/cloud-computing/docs/clone-a-compute-instance)). No memory snapshot, no fork of a
running machine. Backups add daily, weekly, biweekly and one manual copy
([Backups](https://techdocs.akamai.com/cloud-computing/docs/backup-service)).

**Storage — yes.** Plan SSD plus Block Storage: "Minimum size for a volume is 10 GB and the maximum
size is 16 TB." A volume attaches to one Linode at a time
([Block Storage](https://techdocs.akamai.com/cloud-computing/docs/block-storage), `docs-confirmed`).

**Idle timers — yes, with a maintenance caveat.** The API's status field is the authoritative
lifecycle surface, and its 14 values — running, offline, booting, busy, rebooting, shutting_down,
provisioning, deleting, migrating, rebuilding, cloning, restoring, stopped, billing_suspension —
contain no paused or idle state. The only provider-initiated stops are a past-due balance
("`billing_suspension` indicates that payment is past due on the Linode, so we've suspended its use.")
and maintenance, which the [host maintenance policy](https://techdocs.akamai.com/cloud-computing/docs/host-maintenance-policy)
announces seven days ahead and can power a Linode off for. There is no idle timeout, wake trigger or
session cap to set. This follows the definition's "including never" and DigitalOcean's existing row;
Hetzner's `no` on the same fact is an inconsistency in the existing data, noted here rather than
copied.

**Reaching it — yes.** Public IPv4 and IPv6 per Linode, any inbound port, real SSH, and Lish in the
browser: "you can log in to the Cloud Manager and use the Lish console in your web browser"
([Lish](https://techdocs.akamai.com/cloud-computing/docs/access-your-system-console-using-lish)). Outbound 25/465/587 are blocked on
some new accounts ([FAQ](https://techdocs.akamai.com/cloud-computing/docs/faqs-for-compute-instances)).

**Custom domains — partly.** Free DNS Manager ("Within the DNS Manager, you can add your registered
domain names and manage DNS records for each of them."), but no managed certificate for a port. Only
some Quick Deploy apps add TLS — the OpenClaw app asks for "The email address you want to use for
generating the SSL certificates via Let's Encrypt."

**Outbound network — yes.** 1-20 TB included by plan, pooled and prorated, then $0.005/GB. G8
includes none. Cloud Firewall does both directions: "Outbound rules limit the outgoing network
connections coming from a Akamai Cloud service based on the port(s) and destinations you configure."
([Firewall rules](https://techdocs.akamai.com/cloud-computing/docs/manage-firewall-rules)).

**Keys and secrets — no.** Scoped tokens exist ("For each product or service on the list, select the
level of access the token should have."), but there is no secret store and no request-side injection.
User data is passed at first boot and read by cloud-init, not vaulted.

**Ways to drive — yes.** Cloud Manager, `linode-cli`, REST API v4, official Python and JavaScript
clients, Terraform and Pulumi providers, StackScripts. The official MCP server exists but is
read-only (below), and there is no PTY or file endpoint.

**Built-in agents — partly.** Two real one-click agent apps and no prompt API:
"Deploy OpenClaw, an open source AI agent platform that runs locally and executes tasks through a
persistent gateway service connecting communication channels, tools, and AI models."
([OpenClaw app](https://techdocs.akamai.com/quick-deploy-apps/docs/openclaw)). Hermes has the same shape. The default images ship no
coding agent.

**Teams and accounts — partly.** RBAC, SAML SSO and streamed audit logs, but no hard spend cap and
no billing alert. "Identity and Access uses the role-based access control (RBAC) model to authorize
operations on entities." ([Identity and Access](https://techdocs.akamai.com/cloud-computing/docs/identity-and-access-cm)).

**Company — yes.** 99.99% SLA for GA compute, 99% for limited-availability plans, a SOC 2 Type 2
report on request, a published DPA and a status page.

---

## 6. Capability coverage (78/78)

`capability-rows.json` carries one row per capability with its own quote and tag. Counts:
**yes 46 · partly 8 · no 22 · not-published 2** (78 total). The verdicts that are not obvious:

| Capability | Verdict | Why, and the quote that decides it |
|---|---|---|
| `live-resize` | partly | "Warm resize. Your Linode remains up during the migration and it's rebooted once the migration completes." A resize ends in a reboot. |
| `nested-virt` | not-published | No current doc. The only first-party answer is a 2018 Linode Staff reply: "At present, there is no option to enable nested virtualization for a Linode." Too old to state as current. |
| `fast-start` | no | A new Linode boots an OS; nothing resumes from memory and no sub-second start is documented. `inferred`. |
| `warm-pool` | no | No pool of pre-started machines is documented. `inferred`. |
| `choose-idle` | yes | No idle state exists to time out; the status enum has no paused value, so "never" is the only behaviour. |
| `wake-on-request` | no | Nothing pauses, so there is nothing to wake. |
| `schedules` | no | No provider scheduler; cron inside a running Linode is your own. |
| `mount-buckets` | partly | "Akamai's Object Storage is a globally-available, Amazon S3-compatible method…" — S3 client, no native mount. |
| `shared-volume` | no | "a volume can only be attached to one Linode at a time." |
| `auto-https` | partly | Only Quick Deploy apps that bake in Let's Encrypt; the platform has no managed certificate. |
| `no-internet` | yes | "Accept allows all traffic except for those defined in the listed rules, and Drop denies all traffic except for those defined in the rules." Set outbound to Drop with no rules. |
| `egress-allowlist` | yes | Outbound firewall rules limit destinations and ports. |
| `mcp-server` | partly | "A read-only Model Context Protocol server for Akamai Cloud (Linode)." Inspect only. |
| `pty`, `file-api` | no | Console is Lish over SSH or the browser; the API has no terminal or file endpoint. `inferred`. |
| `desktop` | partly | Glish shows a desktop in the browser, but "Distribution images do not have any desktop environments pre-installed." |
| `browser` | no | Nothing preinstalled; you install Chromium yourself. |
| `agents-preinstalled` | partly | Hermes and OpenClaw are apps, not the default image; no coding agent ships. |
| `prompt-api` | no | A Linode is a server, not a harness. Akamai Agent Sandbox is a different product on Akamai Functions. |
| `hosts-other-agents` | not-published | OpenClaw's install index lists DigitalOcean, Hetzner, Hostinger, GCP, Azure and Oracle, not Linode. |
| `usage-alerts` | partly | Resource thresholds, not money: "Cloud Manager allows you to configure alerts that automatically notify you through email if certain performance thresholds are reached." |
| `spend-cap` | no | "You pay for any service on your account, even if it's inactive or powered off. To stop additional charges, delete the service." |
| `audit-log` | yes | Who/what/when control-plane events, but you must configure a log stream to read them. |
| `free-credit` | yes | $100 for 60 days, new customers, GPU excluded. |
| `open-source` | no | Hosted platform; the CLI, SDKs and MCP server are open source, which is not the same thing. `inferred`. |

Full per-row quotes, figures and shortfalls are in `capability-rows.json`.

---

## 7. Use cases (10/10 dispositions)

Detail in `routes.json`. Summary:

| Use case | Tier | noTerminal | Disposition |
|---|---|---|---|
| `hermes-agent` | one-click | partly | Hermes Quick Deploy App; model keys and channel still terminal. No pick. |
| `openclaw` | one-click | partly | OpenClaw app with HTTPS dashboard; pairing and keys terminal. No pick. |
| `coding-agent` | manual | no | Linode 8 GB at $48; stopped hours bill. No pick. |
| `code-interpreter` | manual | no | Whole-hour rounding makes 20,000 one-minute runs $720. Do not recommend. |
| `browser-agent` | manual | no | Nothing preinstalled; monthly plan for minutes of work. Do not recommend. |
| `workflow-automation` | guide | no | No n8n app; Akamai's own n8n guide + Docker. No pick. |
| `chat-bot` | manual | no | Nanode 1 GB $5 or Linode 2 GB $12, always on. No pick. |
| `claude-code-team` | manual | no | Five Linode 8 GB, RBAC and SAML SSO, own credentials each. No pick. |
| `scheduled-scraper` | manual | no | Cron on a box that bills 730 h. Do not recommend. |
| `mcp-server` | manual | no | Nanode 1 GB $5 behind Caddy. No pick. |

**No picks added.** Every case where a Linode fits already has a VPS or a managed pick, and the
skill's rule is to prefer a route row over a duplicate pick. The two one-click apps are the strongest
new fact, but they do not beat the existing picks on price or on needing no server at all.

### Integration notes for the parent

This research stops at artifacts. If the provider is merged into the site, these are the surfaces
outside `research/incoming/linode/` that the checklist expects:

- `site/src/data/providers/linode.json`, `site/src/data/pricing/linode.json`, one row in every
  `features/*.json` and in all 78 `capabilities.json` rows.
- `site/src/pages/compare/side-by-side.astro`: add a `VPS: …` label for `linode` to the manual
  `kinds` map.
- `site/src/data/changes.json`: a dated entry for the new listing (2026-10-30), sourced to the
  pricing page and the Quick Deploy Apps docs.
- `site/src/lib/cost.test.ts`: add the three `handWorked` cases at $36.00 / $48.00 / $24.00, derived
  from the arithmetic in `abc.md`, plus the whole-hour boundary for A.
- `site/scripts/price-baseline.json`: the CPU pricing page, the block-storage page and the free-credit
  page carry money figures and need baseline entries; the TechDocs pages do not.
- Prose counts: the site's provider count and any "one-click Hermes/OpenClaw" tallies in use-case
  standfirsts change when a VPS with both apps joins the set. Recount rather than assume.
- Do **not** add `minimumPerRun` or `monthlyPlans` for this provider: the tariff is an hourly rate
  with a per-service monthly cap, which `Shape.monthly` already expresses.

---

## 8. Company

| Fact | Value | Source | Tag |
|---|---|---|---|
| Legal entity | Linode is the contracting party; marketed as Akamai Cloud | [Compute SLA](https://www.akamai.com/legal/sla-compute): "by and between you and Linode (the “MSA”)" | `docs-confirmed` |
| Brand | Sold as Akamai Cloud; Linode is the former name | [MSA](https://www.akamai.com/legal/msa): "Akamai Cloud (formerly Linode)" | `docs-confirmed` |
| Founded / listed | Incorporated 1998, Cambridge MA, NASDAQ: AKAM | [About Akamai](https://www.akamai.com/company): "Akamai Technologies, Inc. is publicly traded: (NASDAQ: AKAM)" | `docs-confirmed` |
| Uptime | 99.99% GA compute, 99% limited availability | [SLA](https://www.akamai.com/legal/sla-compute) | `docs-confirmed` |
| Certification | SOC 2 Type 2 report on request | [DPA](https://www.akamai.com/site/en/documents/corporate/akamai-data-protection-addendum.pdf): "Akamai’s then-current SOC 2 Type 2 (or its successor) report" | `docs-confirmed` |
| DPA | Published, incorporated into the terms | [DPA](https://www.akamai.com/site/en/documents/corporate/akamai-data-protection-addendum.pdf) | `docs-confirmed` |
| Status | status.linode.com | [Status docs](https://techdocs.akamai.com/cloud-computing/docs/subscribe-to-status-updates) | `docs-confirmed` |

The acquisition date and price (March 2022, about $900 million) appear only in Akamai press releases
that returned HTTP 403 to every fetch route tried, so they are **not** stated in the profile. No
third-party source was used to fill the gap.

---

## 9. Contradictions

**1. $100 or $300 of signup credit.** The pricing page and the free-credit landing page say US$100;
the Akamai Cloud MCP server README says "Create an Akamai Cloud account with an API token (includes a
$300 credit)". The card uses $100 for 60 days because that is what the two pricing pages say and what
the terms page describes. A reader may see a different offer in a campaign.

**2. G6 and G7 512 GB plans are listed but not returned by the API.** The pricing page shows
"G6 Dedicated 512 GB $4,608" and "G7 Dedicated 512 GB $5,530"; `GET /v4/linode/types` returns eight
G7 sizes and nine G6 sizes with no 512 GB entry. The card prices only what the live type list returns,
so the largest priced RAM is 512 GiB on G8 (512x256) and 256 GiB on G6/G7.

**3. Two names for the same G7 plans.** The pricing page says "G7 Dedicated 4 GB"; the API returns
both `g7-premium-4` ("Premium 4GB") and `g7-dedicated-4-2` ("G7 Dedicated 4x2") with identical specs
and prices, and the docs say "Premium CPU plans are now offered as G7 Dedicated plans". Not a pricing
contradiction, but a naming one that will confuse a reader comparing pages.

**4. Existing site data disagrees about idle timers.** DigitalOcean's row says `yes` ("nothing stops
it") and Hetzner's says `no` ("no idle timer exists") for the same fact. This profile uses `yes`,
following the capability's own wording ("including never"). Flagged for the parent rather than
silently joined to one side.

**Correction, later on 2026-10-30: the backups page was not mislabelled.** My first reading compared its "$2.00" row with the $5 Nanode price and concluded the page repeated compute prices. It does not. The page lists the Backups add-on price for each plan, with the plan name as the row label, and `GET /v4/linode/types` confirms every figure in `addons.backups`: Nanode $2.00/mo ($0.003/h), Linode 4 GB $5.00/mo ($0.008/h), Linode 8 GB $10/mo, G6 and G7 Dedicated 4 GB $5/mo, up to $200/mo on the 256 GB plans the API returns (the advertised 512 GB rows show $240), with higher rates in Jakarta and São Paulo. That is roughly 20% of a shared plan's price and a little less on dedicated plans. It is still outside A/B/C.

---

## 10. Unknowns and searched-but-unanswered questions

| Question | Status | What was searched |
|---|---|---|
| Can a Linode run KVM inside it? | `not-published` | TechDocs compute index, Linodes FAQ, plan pages, web search restricted to akamai.com/linode.com. Only 2018/2020 community answers, both negative. |
| What does the Backups add-on cost? | **Answered: $2-$200/mo by plan, $5/mo on Linode 4 GB** | Backups pricing page, cross-checked against `addons.backups` in `GET /v4/linode/types`. |
| What is an extra IPv4 address per hour? | `not-published` | Billing page says additional IPv4s are hourly with no cap and "pricing for additional public IPv4 addresses may vary by region"; no rate table found. Not needed for A/B/C because every Linode includes one. |
| What do custom images cost? | `not-published` | Images docs describe storage as Object Storage; the images pricing page was not read for this card. |
| Does a Linode boot in under a second? | `not-published` | No boot-time figure published; `fast-start` marked `no` by inference. |
| Is there an official MCP server? | **Answered: yes, read-only** | Found via GitHub search; README fetched. This corrects the assumption that a VPS has none. |
| Is there a one-click Hermes or OpenClaw app? | **Answered: yes, both** | Quick Deploy Apps catalogue (`techdocs.akamai.com/quick-deploy-apps/docs/app-catalog`). This is the main finding that differs from a plain VPS. |
| Which OpenClaw/Hermes setup steps stay manual? | Partly answered | App docs list the Cloud Manager fields; model keys and channel pairing are not among them, so the routes are `partly` on `noTerminal`. |

---

## 11. Retrieval log

| Method | What it was used for | Result |
|---|---|---|
| TinyFish `search` | Finding the CPU pricing URL, the MCP server, the DPA, the acquisition release | 6 searches; 4 useful |
| TinyFish `fetch_content` (`ttl: 0`) | Pricing pages, legal pages, quick-deploy app docs, community answer | ~30 URLs; 3 needed a retry, 1 (IR press release) unreachable |
| Firecrawl `firecrawl_scrape` | The Marketplace app list, which is JavaScript-only | Rendered and returned the app names and links |
| Context `web_scrape` | The DPA PDF and its SOC 2 clause | Parsed the PDF; highlights returned the exact clause |
| `curl` (read-only GET) | TechDocs `.md` pages, GitHub READMEs, the public regions and types endpoints | ~20 URLs; all 200 |
| Blocked | `akamai.com/newsroom` and `ir.akamai.com` press releases | HTTP 403 on every route; claim dropped |

Two fetches were retried after transient failures (`fetch_content` returning no body); no source was
substituted with a cached copy. Prices were read fresh: `ttl: 0` on the pricing pages, and the type
endpoint called live on the day.

---

## 12. Quote verification

A script re-fetched 35 of the 42 cited URLs and checked 84 quotes. **84 matched, 0 failed** after the
declared normalisation. The eight URLs not machine-checked, and how each was verified:

| URL | Why not scripted | Verification |
|---|---|---|
| `akamai.com/cloud/pricing/cpu` | Akamai returns 403 to scripted fetches | Read twice through TinyFish; the two quotes were printed back and compared |
| `akamai.com/cloud/pricing/backups` | same | Read through TinyFish; both table rows and the summary sentence printed back |
| `akamai.com/company` | same | Read through TinyFish |
| `akamai.com/legal/msa` | same | Read through TinyFish |
| `akamai.com/legal/sla-compute` | same | Read through TinyFish |
| `akamai.com/lp/free-credit-100` | same | Read through TinyFish |
| `akamai-data-protection-addendum.pdf` | PDF, blocked to curl | Parsed with Context; the SOC 2 clause returned verbatim |
| `linode.com/community/questions/17491/...` | Akamai returns 403 to scripted fetches | Read through TinyFish; the staff reply printed back |

One quote needed the normaliser to drop zero-width characters: the Object Storage page embeds
`\u200b` around the word "Akamai" in its description. The rendered sentence is unchanged.


## Parent integration, 2026-10-30

The idle-timers feature row and the stay-on and choose-idle capability rows keep `yes` but are tagged `inferred`: the API status enum lists states and does not, by itself, rule out an automatic stop. No Akamai page states that Linodes are never stopped for idleness.

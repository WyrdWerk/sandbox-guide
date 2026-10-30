# Vultr — research ledger (provider id `vultr`)

Target: **https://www.vultr.com/** (docs: **https://docs.vultr.com/**).
Repository revision at start: `df4cd0c` (`main`, `origin/main`), clean worktree.
Research date: **2026-10-30**. Desk research only: no account was created, no server deployed,
started or billed. Prices were read fresh from Vultr's live pages, docs and public plans API; no cached
scrape was used for money. This is an **add-mode VPS** package under `research/incoming/vultr/`; no shared
site JSON was edited, and nothing was committed or pushed.

**Tag legend**

| Tag | Meaning |
|---|---|
| `docs-confirmed` | Stated on a docs.vultr.com page or an official Vultr product, legal, security or blog page. |
| `pricing-page` | Stated on a page whose subject is money, or returned by Vultr's own public plans API. |
| `third-party` | Not from Vultr (none used for a verdict in this package). |
| `inferred` | My reading of documented behaviour or of the complete published API, not a sentence Vultr writes. |
| `not-published` | Vultr does not say; no answer found. |

## 0. Verdict in one paragraph

Vultr is a full virtual-machine provider with a clean **hourly + 672-hour monthly cap** model, 34 regions,
one-click Hermes and OpenClaw Marketplace apps and unusually strong compliance for the price. It is a
good always-on host: 2 vCPU / 4 GB / 80 GB is $20 a month, 4 vCPU / 8 GB / 160 GB is $40, and both include
a public IPv4 and 3–4 TB of egress. It is a poor fit for bursty or per-run work: the one-hour minimum makes
1,000 ten-minute tasks cost 1,000 server-hours, and a stopped server bills exactly like a running one until
it is destroyed. The biggest buyer catches are the one-hour minimum, the stopped-instance bill, an
inbound-only firewall, and two one-click apps that ship the password `Password`.

## 1. How the evidence was collected

| Method | What it was used for | Notes |
|---|---|---|
| Firecrawl `firecrawl_scrape`, `maxAge: 0` | `https://www.vultr.com/pricing/` (two passes) and the VX1 nested-virtualisation blog | Fresh live fetch, HTTP 200, page title and plan tables checked. The pricing page is server-rendered enough for Firecrawl but returns 403 to plain `curl`. |
| Exa `web_fetch_exa` | ~40 first-party pages: billing, stop, snapshots, backups, block storage, File System, object storage, VPC, firewall, reserved IPs, custom ISO, resize, DNS, IAM/SSO, API, CLI, Terraform, Marketplace guides, DPA, account limits, notifications, about, compliance, SLA, ToS, free tier, coupons, status | Each page returned its article text; quotes were copied from those live fetches. |
| TinyFish `search` | ~35 URL-discovery queries, scoped to `vultr.com` | Snippets only. No snippet is used as evidence; every claim was re-read on the page itself. |
| Direct `curl` of `docs.vultr.com` | Sitemap (31 article sitemaps, 1,172 URLs) and full HTML for 23 cited docs pages | Used to find pages and to machine-check quotes. The docs site is server-rendered. |
| Direct `curl` of `https://api.vultr.com/v2/plans` | 139 plans with `vcpu_count`, `ram` (MB), `disk`, `monthly_cost`, `hourly_cost`, locations | Public, unauthenticated, first-party. Used for exact shape data and the hourly-rate contradiction. |
| Direct `curl` of GitHub API / raw README | `vultr/vultr-node`, `vultr/vultr-python-client`, the Vultr org repo list | Confirms which clients are official. |
| `curl` of `https://www.vultr.com/pricing/` | Attempted direct read | **Failed:** HTTP 403 with a 5.5 KB bot page. Firecrawl was used instead and the fallback is recorded here. |
| Exa `web_fetch_exa` of `https://github.com/vultr/vultr-python` | Attempted Python SDK citation | **Failed:** `CRAWL_NOT_FOUND`; the repo was renamed. GitHub API found `vultr/vultr-python-client`, which is the citation used. |
| Exa `web_fetch_exa` of the VX1 AMD whitepaper | Attempted nested-virtualisation citation | **Failed:** `CRAWL_UNKNOWN_ERROR`. Vultr's own 9 September 2026 blog carries the same sentence and is the citation used. |
| Exa `web_fetch_exa` of `https://status.vultr.com/` | Status page | HTTP 200. On 30 October 2026 it listed 31 regions as **Planned Service** and Singapore as **Service Impacted**; see §6c. |

**Paid-tool spend.** TinyFish search, Exa page fetches and Firecrawl scrapes were used; Parallel, Tavily
and Context were not. The tools do not return a per-call price. Firecrawl reported 1 credit per pricing
scrape; the total is estimated well under **US$0.30**, inside the $1 cap.

**Freshness.** Every money figure comes from a live fetch on 30 October 2026, not a cached scrape. The
pricing page was fetched three times (two full passes and one targeted section pass) and the plan tables
agreed. The public plans API was read separately and agrees on monthly prices; its hourly figures do not
agree, which is recorded as contradiction 1.

---

## 2. Product, plans and prices

Vultr sells fixed-size virtual machines. **Cloud Compute** is the shared-CPU family this listing prices:
Regular Performance (older Intel, regular SSD), High Performance (current AMD EPYC or Intel Xeon, NVMe) and
High Frequency (3 GHz+ Xeon, NVMe). **Optimized Cloud Compute** is the dedicated-vCPU family (General
Purpose, CPU Optimized, Memory Optimized, Storage Optimized); **VX1** is a newer dedicated family with
nested virtualisation; **Cloud GPU** and **Bare Metal** are separate products. `docs-confirmed`

> "Easily deploy and scale shared or dedicated virtual machines (VMs) and bare metal across six continents" — [Cloud Compute](https://www.vultr.com/products/cloud-compute/)

> "34 cloud data center regions" — [Cloud Compute](https://www.vultr.com/products/cloud-compute/)

### Regular Performance (priced by the card)

| vCPU | RAM | Disk | Monthly | Page hourly | Monthly ÷ 672 |
|---:|---:|---:|---:|---:|---:|
| 1 | 0.5 GB | 10 GB | $3.50 | $0.005 | $0.005208 |
| 1 | 1 GB | 25 GB | $5.00 | $0.007 | $0.007440 |
| 1 | 2 GB | 55 GB | $10.00 | $0.015 | $0.014881 |
| 2 | 2 GB | 65 GB | $15.00 | $0.022 | $0.022321 |
| 2 | 4 GB | 80 GB | $20.00 | $0.03 | $0.029762 |
| 4 | 8 GB | 160 GB | $40.00 | $0.06 | $0.059524 |
| 6 | 16 GB | 320 GB | $80.00 | $0.11 | $0.119048 |
| 8 | 32 GB | 640 GB | $160.00 | $0.219 | $0.238095 |
| 16 | 64 GB | 1,280 GB | $320.00 | $0.438 | $0.476190 |
| 24 | 96 GB | 1,600 GB | $640.00 | $0.877 | $0.952381 |

There is also a **$2.50 1 vCPU / 0.5 GB / 10 GB IPv6-only** plan. It is excluded from the card because a
machine without IPv4 cannot serve most agent endpoints; the $3.50 twin is the smallest priced shape.
`pricing-page`

### High Performance (priced by the card)

| vCPU | RAM | Disk | Monthly | Page hourly | Monthly ÷ 672 |
|---:|---:|---:|---:|---:|---:|
| 1 | 1 GB | 25 GB | $6.00 | $0.009 | $0.008929 |
| 1 | 2 GB | 50 GB | $12.00 | $0.018 | $0.017857 |
| 2 | 2 GB | 60 GB | $18.00 | $0.027 | $0.026786 |
| 2 | 4 GB | 100 GB | $24.00 | $0.036 | $0.035714 |
| 4 | 8 GB | 180 GB | $48.00 | $0.071 | $0.071429 |
| 4 | 12 GB | 260 GB | $72.00 | $0.107 | $0.107143 |
| 8 | 16 GB | 350 GB | $96.00 | $0.143 | $0.142857 |
| 12 | 24 GB | 500 GB | $144.00 | $0.214 | $0.214286 |

High Frequency is a third shared family (1–16 vCPU, 32–1,024 GB NVMe, $6–$320 a month). It is named in the
profile but not in the card: its odd vCPU/RAM ratios (3 vCPU / 8 GB, 16 vCPU / 58 GB) never beat Regular
Performance for the A/B/C shapes, and adding a third family would make the card harder to audit without
changing a total. `pricing-page`

**Memory and disk units.** Vultr labels memory in GB, but the plans API returns MB: the 4 GB plan is
`"ram":4096`, the 96 GB plan is `98304`. Those are exact GiB, so the card maps GB to GiB 1:1. Disk is
labelled GB and also maps 1:1. This matches the site's existing Hostinger treatment and is stated in the
card notes.

**Optimized Cloud Compute** reaches 96 vCPU / 256 GB / 1,280 GB at $3,840 a month (General Purpose); VX1
reaches 192 vCPU / 768 GB; Cloud GPU adds AMD and NVIDIA accelerators; Bare Metal is single-tenant. These
are outside the card but inside the profile's `sizes` sentence. `pricing-page`

**Windows** is a separate licence line: the same 2 vCPU / 4 GB plan is $20/mo base plus $32/mo licence; the
24 vCPU / 96 GB plan is $640 + $384. `pricing-page` from [Windows servers](https://www.vultr.com/servers/windows/)

---

## 3. Billing rules that decide A/B/C

> "Vultr bills servers hourly, capped at 672 hours a month or 730 for GPU, with invoices generated on the 1st." — [How am I billed](https://docs.vultr.com/support/platform/billing/how-am-i-billed-for-my-servers)

> "The minimum billing unit is one hour, and hourly charges begin when a server is deployed, regardless of whether it is powered on or off." — same page

> "Servers that are stopped but not destroyed continue to incur hourly charges for reserved resources such as compute, storage, and IP address allocations." — same page

> "To stop billing for a server, you must destroy it from your account. Stopping a server does not suspend billing." — same page

> "All servers on your account are billed hourly up to the monthly rate cap. The hourly rate is determined by dividing the monthly rate by 672 hours (28 days)." — [Block Storage](https://www.vultr.com/products/block-storage/)

> "If your server is online for more than 672 hours in a calendar month, you will only be billed the monthly rate." — same page

> "Stopping an instance shuts it down and disables network connectivity until it is restarted. The operating system and all running processes are halted, but billing continues unless the instance is deleted." — [Stop an instance](https://docs.vultr.com/products/compute/instances/cloud-compute/management/stop-instance.md)

**Interpretation.** The monthly price is a cap on hourly billing, not a subscription. A server destroyed
after 90 hours bills 90 hours at the derived hourly rate. A server left stopped bills every hour until it
is destroyed, and destroying it permanently deletes the data. There is no pause, hibernate, memory
snapshot or cheaper stopped-storage rate.

**The 672-hour cap.** The card's `Shape.monthly` is the published monthly price and `hourly` is
`monthly ÷ 672`, so the cap binds at exactly 672 billed hours. The engine's always-on month is 730 hours;
because 730 > 672, an always-on machine is capped at the monthly price, which is what Vultr does in a
28-, 30- or 31-day month. A 671-hour month bills $19.97 on the 2 vCPU / 4 GB shape; 672 hours bills $20.00.

**One public IPv4 is included.** "Many of our plans come with one primary IPv4 address. Up to two
additional addresses are available for an extra fee." — [FAQ](https://www.vultr.com/resources/faq/). The
amount of the extra fee is not published on the pages read, so the card cannot model it.

**Egress.** Each plan includes 0.5–15 TB; overage is $0.01/GB worldwide and inbound is free.
`pricing-page` / [Regular Performance](https://www.vultr.com/products/regular-performance-compute/)

**Tax and currency.** USD list prices exclude VAT/sales tax; Vultr adds tax as a separate invoice line and
the FAQ lists country rates. Some regions have different prices and the console shows the local price.
`docs-confirmed` from [FAQ](https://www.vultr.com/resources/faq/)

**Add-ons not in the card.** Snapshots $0.05/GB-month; automatic backups +20%; Block Storage $0.10/GB-month;
Vultr File System $100/TB-month; Object Storage from $18/TB-month; DDoS Protection $10/month; Windows
licence $16–$384/month. Each is sourced in the capability ledger or the card notes.

---

## 4. A/B/C

Full arithmetic is in [`abc.md`](./abc.md). Summary:

| Case | Shape | Billed hours | Hand-worked | Engine | Feasible |
|---|---|---:|---:|---:|---|
| A — 1,000 × 10-minute tasks | Regular Performance 2 vCPU / 4 GB / 80 GB | 1,000 (one-hour minimum per server) | **$29.76** | $29.7619 | yes |
| B — 730 hours always on | Regular Performance 4 vCPU / 8 GB / 160 GB | 730, capped at 672 | **$40.00** | $40.00 | yes |
| C — 90 running + 640 stopped | Regular Performance 2 vCPU / 4 GB / 80 GB | 730, capped at 672 | **$20.00** | $20.00 | yes |

The engine's plan, shape, feasibility, usage and bill all match the hand-worked arithmetic. The card also
passes the boundary checks in `abc.md`: 671/672/673 hours, one-minute and 61-minute tasks, a 200 GiB disk
that needs a 40 GiB volume, the $3.50 IPv4 plan rather than the $2.50 IPv6-only plan, and an oversized
32 vCPU ask that is reported infeasible rather than priced as if it fit.

**Model limitations.** The card cannot hold three hourly rates for one plan (contradiction 1), per-region
price differences, the unpublished additional-IPv4 fee, or Windows/DDoS/snapshot/backup/File System/Object
Storage charges. It also uses 730 hours for an always-on month; the monthly cap makes that harmless for
A/B/C but it is a convention, not a Vultr statement.

---

## 5. Contradictions

### 5a. Three first-party hourly rates for the same plan

| Source | Quote | 2 vCPU / 4 GB hourly | 1,000-hour bill |
|---|---|---|---|
| Pricing page | "$20.00/mo" and "$0.03/hr" | $0.03 | $30.00 |
| Billing FAQ / Block Storage page | "The hourly rate is determined by dividing the monthly rate by 672 hours (28 days)." | $0.0297619 | **$29.76** |
| Plans API | `"monthly_cost":20,"hourly_cost":0.027` | $0.027 | $27.00 |

The page also lists larger plans at roughly monthly ÷ 730 (the $160 plan shows $0.219, and $160 ÷ 730 =
$0.2192), which would make 672 billed hours cost $147.17 rather than the $160 monthly cap. The three
figures cannot all be the billing rate.

**Interpretation used:** the card uses **monthly ÷ 672**, because that is the rule the billing FAQ states
and it makes the 672-hour cap equal the monthly price. **Consequence:** workload A is $29.76. A reader
using the page's $0.03 gets $30.00; a reader using the API's $0.027 gets $27.00. The difference is 9% at
the extremes. This is flagged in the provider caveats and the card notes; it is not silently rounded away.

### 5b. 672-hour Cloud Compute cap vs the engine's 730-hour month

Vultr caps Cloud Compute at 672 hours and VX1/GPU at 730. The engine's `MONTH_HOURS` is 730 for every
provider. This is a convention mismatch, not a Vultr contradiction: because the monthly price caps the
bill, an always-on machine pays the same $20/$40 in a 28-, 30- or 31-day month. A task workload is not
capped per month because each task is its own server. The card documents the 672 cap and the engine's
730-hour month.

### 5c. Status page vs the 100% SLA (observation, unresolved)

On 30 October 2026 the status page showed **31 of 34 regions as "Planned Service"** and Singapore as
**"Service Impacted"**, while the SLA promises 100% uptime on network and host-node availability. The SLA
excludes scheduled maintenance with 24 hours' notice and outages under 10 minutes, so a planned-service
window is not necessarily an SLA breach. This may be a maintenance window or a status-page rendering
artefact; it is recorded as an observation and **not** used to downgrade the SLA verdict. No Vultr
statement explaining the 30 October state was found.

### 5d. "Free tier" and "one-click" are qualified claims

The Free Tier Program is real but application-only, randomized and limited to three regions; it is not a
standing free tier for every account. The Hermes and OpenClaw Marketplace apps are genuine one-click
deployments, so the one-click capability is `yes`; the default password and the remaining in-app setup are
recorded as caveats, not as a downgrade of the one-click verdict. The free tier is `partly` because access
is application-only and region-limited.

---

## 6. Unknowns

| Question | Status | What was checked |
|---|---|---|
| Price of a third/fourth public IPv4 | `not-published` | FAQ says "up to two additional addresses are available for an extra fee" but gives no amount. |
| Price of an unattached Reserved IP | `not-published` | Reserved IP docs describe attach/detach but no unattached fee; pricing page has no line. |
| Do stopped hours count toward the 672-hour cap? | implied yes | Billing says stopped instances "continue to incur hourly charges" and the cap is on billed hours; no sentence spells out the interaction. The card assumes yes. |
| Is the 672 cap calendar hours or billed hours? | ambiguous | FAQ says "hours in monthly calculations" and "online for more than 672 hours"; the card treats it as billed hours. |
| Exact billing rate | contradiction | Three first-party figures; see 5a. |
| Maximum number of snapshots per account | `not-published` | Snapshot pages describe manual snapshots and $0.05/GB-month but no count limit. |
| Vultr File System minimum/maximum size | `not-published` | Product page gives $1/10 GB and $100/TB but no minimum or maximum. |
| Nested virtualisation on standard Cloud Compute | `not-published` | Only VX1 is documented as supporting it; no page says the shared plans cannot. Verdict is `partly`, not `no`. |
| Forced password change on the Hermes/OpenClaw apps | `not-published` | Listings print the default credentials; no first-login forced-change step is documented. |
| Account credit limit amount | `not-published` | Docs say view "maximum instance cost" and request an increase; no figure. |
| Per-region price differences | `not-published` | FAQ says some locations differ; no table of differences on the pages read. |
| DDoS Protection price | confirmed | FAQ: "adds 10Gbps of mitigation capacity per instance and costs an additional $10/mo." |
| File System availability: 12 hubs or 34 regions? | ambiguous | Product page says both "12 dedicated storage hubs" and "34 cloud data center regions"; the card does not price File System. |

---

## 7. Capability ledger (all 78)

Each row is the verdict, the exact quote used, the source and the confidence tag. `partly` rows carry the
required plain-language shortfall in the JSON; it is repeated in the note here.

### Isolation: what kind of computer you get (`isolation`)

- **own-vm — yes.** "Easily deploy and scale shared or dedicated virtual machines (VMs) and bare metal across six continents" — [https://www.vultr.com/products/cloud-compute/](https://www.vultr.com/products/cloud-compute/) `docs-confirmed`. Each instance is its own virtual machine with its own kernel, disk and public IP, so Docker, kernel modules and any TCP service work as on a normal Linux box.
- **root — yes.** "Local administrator/root and out-of-band console access is provided on all bare metal and virtualized compute instances." — [https://www.vultr.com/company/about-us/](https://www.vultr.com/company/about-us/) `docs-confirmed`. Root login over SSH from the first boot; the VNC console gives out-of-band access if SSH fails.
- **docker-inside — yes.** "The Vultr Docker Marketplace Application deploys Docker Community Edition (CE)" — [https://docs.vultr.com/how-to-use-vultrs-docker-marketplace-application](https://docs.vultr.com/how-to-use-vultrs-docker-marketplace-application) `docs-confirmed`. Docker CE is a Marketplace image, and a preconfigured docker user is included; you can also install Docker yourself.
- **nested-virt — partly.** "Vultr VX1 supports nested virtualization, enabling businesses to deploy microVM solutions with their own kernels for secure sandbox isolation." — [https://blogs.vultr.com/cpus-workhorse-agentic-ai-infrastructure](https://blogs.vultr.com/cpus-workhorse-agentic-ai-infrastructure) `docs-confirmed`. *Shortfall:* Nested virtualisation is documented only on VX1 plans, not on the Regular Performance and High Performance plans priced here. Nested virtualisation is documented for VX1, a separate newer plan family, not for the Regular Performance and High Performance plans priced here.
- **custom-image — partly.** "Each account can store a maximum of two ISOs at a time." — [https://docs.vultr.com/how-to-upload-and-use-custom-isos-on-vultr](https://docs.vultr.com/how-to-upload-and-use-custom-isos-on-vultr) `docs-confirmed`. *Shortfall:* A custom image means booting a mounted ISO, not uploading a disk image; accounts hold two ISOs under 10 GB and Windows ISOs are refused. A custom image means booting a mounted ISO, not uploading a qcow2 or OCI image; snapshots can seed a new instance at the same or larger disk size.

### Sizes, regions and hardware (`sizes-regions`)

- **any-size — no.** "2 vCPUs 4 GB Memory 3.00 TB Bandwidth 80 GB Storage $20.00/mo $0.03/hr" — [https://www.vultr.com/pricing/](https://www.vultr.com/pricing/) `inferred`. Every Cloud Compute plan pairs a fixed vCPU, RAM and disk; the plan API lists fixed plans and no custom-size endpoint is documented.
- **big-machines — yes.** "96 vCPUs 256 GB Memory 12.00 TB Bandwidth 1280 GB Storage $3840.00/mo $5.714/hr" — [https://www.vultr.com/pricing/](https://www.vultr.com/pricing/) `docs-confirmed`. Optimized Cloud Compute reaches 96 vCPU / 256 GB / 1,280 GB; Regular Performance stops at 24 / 96 / 1,600 GB and VX1 reaches 192 / 768 GB.
- **live-resize — partly.** "Downgrading is not supported while upgrading the instance enables a higher plan without changes to the instance's data or file system." — [https://docs.vultr.com/products/compute/instances/cloud-compute/management/resize-instance](https://docs.vultr.com/products/compute/instances/cloud-compute/management/resize-instance) `docs-confirmed`. *Shortfall:* Only upgrades are supported; downgrades are refused and Vultr does not document whether running processes survive the change. A plan change is an upgrade to a larger plan; downgrades are refused, and Vultr does not document whether running processes survive.
- **gpu — yes.** "Vultr offers global access to the latest AMD and NVIDIA GPUs" — [https://www.vultr.com/products/cloud-gpu/](https://www.vultr.com/products/cloud-gpu/) `docs-confirmed`. Cloud GPU is a separate product with AMD and NVIDIA accelerators, available as VMs, bare metal or clusters; GPU instances are excluded from the SLA.
- **choose-region — yes.** "34 cloud data center regions" — [https://www.vultr.com/products/cloud-compute/](https://www.vultr.com/products/cloud-compute/) `docs-confirmed`. 34 data-centre regions across six continents, with per-region pricing in the console.
- **eu-region — yes.** "Frankfurt DE" — [https://www.vultr.com/products/cloud-compute/](https://www.vultr.com/products/cloud-compute/) `docs-confirmed`. Amsterdam, Frankfurt, London, Madrid, Manchester, Milan, Paris, Stockholm and Warsaw.

### Lifecycle: stop, pause and sleep (`lifecycle`)

- **pause-memory — no.** "The operating system and all running processes are halted, but billing continues unless the instance is deleted." — [https://docs.vultr.com/products/compute/instances/cloud-compute/management/stop-instance.md](https://docs.vultr.com/products/compute/instances/cloud-compute/management/stop-instance.md) `docs-confirmed`. Stopping halts the operating system and every running process; there is no pause, hibernate or memory snapshot.
- **warm-pool — no.** "All functions of the Vultr customer portal are accessible via the API" — [https://www.vultr.com/api/](https://www.vultr.com/api/) `inferred`. No pool, warm-capacity or pre-started machine product is documented; instances are created on demand.
- **fast-start — no.** "Vultr Cloud Compute can be deployed in seconds" — [https://www.vultr.com/products/cloud-compute/](https://www.vultr.com/products/cloud-compute/) `docs-confirmed`. Vultr advertises deployment in seconds, not sub-second starts; a booted server takes tens of seconds.

### Snapshots, forks and templates (`snapshots-forks`)

- **snapshot-files — yes.** "Yes. Vultr charges $0.05 per GB per month for each stored snapshot." — [https://docs.vultr.com/support/platform/billing/does-vultr-charge-for-stored-snapshots](https://docs.vultr.com/support/platform/billing/does-vultr-charge-for-stored-snapshots) `docs-confirmed`. Manual snapshots are disk images kept until deleted, priced at $0.05/GB-month.
- **snapshot-memory — no.** "Snapshots are point-in-time images of your instance’s disk" — [https://docs.vultr.com/support/platform/billing/does-vultr-charge-for-stored-snapshots](https://docs.vultr.com/support/platform/billing/does-vultr-charge-for-stored-snapshots) `docs-confirmed`. A snapshot is a point-in-time image of the disk, not of RAM or running processes.
- **fork-running — no.** "Capture the full state of a Vultr Cloud Compute instance on demand, then restore it or clone it into new instances." — [https://docs.vultr.com/products/storage/snapshots](https://docs.vultr.com/products/storage/snapshots) `docs-confirmed`. A snapshot can seed a new instance, but nothing copies a running machine with its memory.
- **older-snapshot — yes.** "Snapshots are user-managed images that do not expire and remain in your account until you delete them manually." — [https://docs.vultr.com/support/products/orchestration/how-can-i-destroy-my-instance-while-maintaining-its-backups](https://docs.vultr.com/support/products/orchestration/how-can-i-destroy-my-instance-while-maintaining-its-backups) `docs-confirmed`. Snapshots do not expire; any snapshot in the account can be restored or used to deploy.
- **templates — yes.** "Capture the full state of a Vultr Cloud Compute instance on demand, then restore it or clone it into new instances." — [https://docs.vultr.com/products/storage/snapshots](https://docs.vultr.com/products/storage/snapshots) `docs-confirmed`. A snapshot is the template mechanism: deploy a new instance from it, at the same or larger disk size.
- **backups — yes.** "Automatic backups can be configured to run daily, every other day, weekly, or monthly." — [https://docs.vultr.com/vps-automatic-backups](https://docs.vultr.com/vps-automatic-backups) `docs-confirmed`. Automatic backups run daily, every other day, weekly or monthly, keep the two most recent and exclude attached block storage; they add 20% to the plan price.

### Storage: disk, volumes and what persists (`storage`)

- **files-survive-stop — yes.** "Destroying an instance releases the associated resources and permanently deletes its data." — [https://docs.vultr.com/support/platform/billing/are-stopped-instances-still-billed-on-vultr](https://docs.vultr.com/support/platform/billing/are-stopped-instances-still-billed-on-vultr) `docs-confirmed`. Stopping keeps the disk; destroying the instance permanently deletes its data.
- **volumes — yes.** "Attach up to 16 volumes per instance" — [https://www.vultr.com/products/block-storage/](https://www.vultr.com/products/block-storage/) `docs-confirmed`. Block Storage is $1 per 10 GB a month, attaches up to 16 volumes per instance and must be in the same region.
- **shared-volume — yes.** "Vultr File System supports shared access across multiple virtual machines" — [https://www.vultr.com/products/file-system/](https://www.vultr.com/products/file-system/) `docs-confirmed`. Vultr File System is shared file storage with simultaneous access and write locking, at $100/TB-month.
- **mount-buckets — partly.** "Vultr Object Storage supports the S3 API" — [https://www.vultr.com/products/object-storage/](https://www.vultr.com/products/object-storage/) `docs-confirmed`. *Shortfall:* Object Storage speaks the S3 API, but Vultr documents clients such as s3cmd rather than mounting a bucket as a folder; you add s3fs or rclone. Object Storage is S3-compatible, but Vultr documents clients such as s3cmd rather than mounting a bucket as a folder; you add s3fs or rclone.
- **big-disk — yes.** "up to 40 TB of highly affordable HDD, or up to 10 TB of blazing fast NVMe SSD" — [https://www.vultr.com/products/block-storage/](https://www.vultr.com/products/block-storage/) `docs-confirmed`. Block Storage reaches 40 TB on HDD or 10 TB on NVMe per volume, and the plan disk reaches 1,600 GB.

### Idle timers, waking and session limits (`idle-timers`)

- **stay-on — yes.** "Stopping an instance shuts it down and disables network connectivity until it is restarted." — [https://docs.vultr.com/products/compute/instances/cloud-compute/management/stop-instance.md](https://docs.vultr.com/products/compute/instances/cloud-compute/management/stop-instance.md) `docs-confirmed`. Nothing stops an instance for idleness; it runs until you stop or destroy it.
- **choose-idle — no.** "All functions of the Vultr customer portal are accessible via the API" — [https://www.vultr.com/api/](https://www.vultr.com/api/) `inferred`. There is no idle timeout or auto-stop setting; the only stop is manual.
- **wake-on-request — no.** "until it is restarted" — [https://docs.vultr.com/products/compute/instances/cloud-compute/management/stop-instance.md](https://docs.vultr.com/products/compute/instances/cloud-compute/management/stop-instance.md) `docs-confirmed`. A stopped instance stays stopped until the console, API or CLI restarts it; an incoming request cannot wake it.
- **schedules — no.** "All functions of the Vultr customer portal are accessible via the API" — [https://www.vultr.com/api/](https://www.vultr.com/api/) `inferred`. No provider scheduler starts or stops instances; schedules are cron or systemd timers inside the guest.

### Reaching it: links, ports and who can open them (`reaching-it`)

- **public-url — yes.** "Many of our plans come with one primary IPv4 address." — [https://www.vultr.com/resources/faq/](https://www.vultr.com/resources/faq/) `docs-confirmed`. One public IPv4 is included on paid plans, and any TCP or UDP port can be opened through the firewall.
- **private-url — partly.** "Create isolated Vultr VPC networks for private instance traffic" — [https://docs.vultr.com/products/network/vpc-networks](https://docs.vultr.com/products/network/vpc-networks) `docs-confirmed`. *Shortfall:* A VPC address is reachable only inside your own network; there is no token or login link in front of a public port. A VPC address is reachable only inside your own network; there is no token or login link in front of a public port.
- **ssh — yes.** "This Quickstart Guide describes how to connect to Vultr servers over SSH with a key instead of a password." — [https://docs.vultr.com/connect-to-a-server-using-an-ssh-key](https://docs.vultr.com/connect-to-a-server-using-an-ssh-key) `docs-confirmed`. A normal SSH daemon with key or password login, root included.
- **web-terminal — partly.** "Click the View Console icon to open the VNC console" — [https://docs.vultr.com/how-to-upload-and-use-custom-isos-on-vultr](https://docs.vultr.com/how-to-upload-and-use-custom-isos-on-vultr) `docs-confirmed`. *Shortfall:* The browser console is a VNC view of the screen for emergencies, not a shell API; you log in at the console. The browser console is a VNC view of the screen for emergencies, not a shell API; you log in at the console.
- **tunnel — yes.** "This Quickstart Guide describes how to connect to Vultr servers over SSH with a key instead of a password." — [https://docs.vultr.com/connect-to-a-server-using-an-ssh-key](https://docs.vultr.com/connect-to-a-server-using-an-ssh-key) `docs-confirmed`. Port forwarding over SSH works because SSH is a normal daemon; Vultr sells no tunnel service.
- **raw-tcp — yes.** "We block several outbound ports for network security." — [https://docs.vultr.com/what-ports-are-blocked](https://docs.vultr.com/what-ports-are-blocked) `docs-confirmed`. Inbound ports are yours to open. Outbound 25, 137–139 and 445 are blocked by default and can be removed by ticket; 1688 is blocked inbound only, and a short list (17, 19, 1900, 53413, 11211) is permanently blocked.

### Custom domains (`custom-domains`)

- **custom-domain — yes.** "Free domain record management for any domain you own" — [https://docs.vultr.com/product-overviews/dns](https://docs.vultr.com/product-overviews/dns) `docs-confirmed`. Vultr DNS is free, anycast and supports A, AAAA, CNAME, MX, TXT, DNSSEC and reverse DNS.
- **auto-https — partly.** "This article explains how to deploy Hermes Agent on a Linux server using Docker Compose with Traefik for automatic HTTPS." — [https://docs.vultr.com/how-to-deploy-hermes-agent-open-source-self-hosted-ai-agent](https://docs.vultr.com/how-to-deploy-hermes-agent-open-source-self-hosted-ai-agent) `docs-confirmed`. *Shortfall:* Vultr does not issue a certificate for a compute instance; its guides put Traefik or Caddy in front and obtain Let's Encrypt certificates. Vultr does not issue a certificate for a compute instance; its guides put Traefik or Caddy in front and obtain Let's Encrypt certificates.

### Outbound network: egress, allowlists and static IP (`outbound-network`)

- **egress-included — yes.** "Egress bandwidth beyond generous included free bandwidth allocations is priced at a consistent $0.01/GB worldwide." — [https://www.vultr.com/products/regular-performance-compute/](https://www.vultr.com/products/regular-performance-compute/) `docs-confirmed`. Each plan includes 0.5–15 TB of egress; overage is $0.01/GB worldwide and inbound traffic is free.
- **egress-allowlist — no.** "No, Vultr Firewall does not filter outgoing traffic from instances." — [https://docs.vultr.com/support/products/network/does-vultr-firewall-filter-outgoing-traffic-from-my-instance](https://docs.vultr.com/support/products/network/does-vultr-firewall-filter-outgoing-traffic-from-my-instance) `docs-confirmed`. Vultr Firewall filters only incoming traffic; outbound rules are UFW, iptables or firewalld inside the instance.
- **no-internet — yes.** "making it possible to deploy virtual machines without public IP addresses." — [https://blogs.vultr.com/nat-gateways](https://blogs.vultr.com/nat-gateways) `docs-confirmed`. A VPC-only instance is deployed without a public IP; it reaches other instances over the VPC and the internet only through a NAT Gateway.
- **static-ip — yes.** "Reserve static public IP addresses that stay on your Vultr account when unattached" — [https://docs.vultr.com/products/network/reserved-ips](https://docs.vultr.com/products/network/reserved-ips) `docs-confirmed`. An instance keeps its public IPv4 for its life, and a Reserved IP can be detached and reattached to another instance.

### Keys and secrets (`keys-secrets`)

- **secrets-store — no.** "All functions of the Vultr customer portal are accessible via the API" — [https://www.vultr.com/api/](https://www.vultr.com/api/) `inferred`. No vault or write-only environment store is documented; cloud-init and startup scripts write configuration to the disk.
- **hidden-secrets — no.** "All functions of the Vultr customer portal are accessible via the API" — [https://www.vultr.com/api/](https://www.vultr.com/api/) `inferred`. Nothing brokers credentials away from the agent; keys on the instance are readable by anything running there.
- **scoped-keys — partly.** "Create, rotate, list, and delete Vultr API keys for Vultr Account Users" — [https://www.vultr.com/products/iam/](https://www.vultr.com/products/iam/) `docs-confirmed`. *Shortfall:* Scoped access comes from IAM users and OAuth tokens; the portal's Personal Access Token is account-wide, with no per-key read-only switch. Scoped access comes from IAM users and OAuth tokens; the portal's Personal Access Token is account-wide, with no per-key read-only switch.

### Ways to drive it (`ways-to-drive`)

- **dashboard-create — yes.** "from a user-friendly control panel or API" — [https://www.vultr.com/products/cloud-compute/](https://www.vultr.com/products/cloud-compute/) `docs-confirmed`. The console creates instances, storage, snapshots, firewalls, VPCs, DNS and object storage by clicking.
- **cli — yes.** "`vultr-cli` is the official command-line interface for managing Vultr cloud infrastructure" — [https://docs.vultr.com/reference/vultr-cli](https://docs.vultr.com/reference/vultr-cli) `docs-confirmed`. The official Go CLI covers instances, storage, networking, DNS, snapshots, ISOs and marketplace apps.
- **python-sdk — yes.** "An OpenAPI Python Client for Vultr" — [https://github.com/vultr/vultr-python-client](https://github.com/vultr/vultr-python-client) `docs-confirmed`. An OpenAPI-generated Python client is published in the official Vultr GitHub organisation.
- **ts-sdk — partly.** "Official Vultr client node module." — [https://github.com/vultr/vultr-node](https://github.com/vultr/vultr-node) `docs-confirmed`. *Shortfall:* The official @vultr/vultr-node client is JavaScript; Vultr publishes no separately typed TypeScript SDK. The official @vultr/vultr-node client is JavaScript; Vultr publishes no separately typed TypeScript SDK.
- **rest-api — yes.** "All functions of the Vultr customer portal are accessible via the API" — [https://www.vultr.com/api/](https://www.vultr.com/api/) `docs-confirmed`. API v2 exposes every portal function over REST with bearer-token auth, cursor pagination and a 30-request-per-second limit.
- **mcp-server — partly.** "The read-only Vultr MCP Server is available now in preview." — [https://blogs.vultr.com/vultr-mcp-server-public-preview](https://blogs.vultr.com/vultr-mcp-server-public-preview) `docs-confirmed`. *Shortfall:* The official Vultr MCP server is a read-only public preview: it can inspect resources but cannot create, change or delete them. The official Vultr MCP server is a read-only public preview: it can inspect resources but cannot create, change or delete them.
- **pty — no.** "All functions of the Vultr customer portal are accessible via the API" — [https://www.vultr.com/api/](https://www.vultr.com/api/) `inferred`. The API has no interactive terminal endpoint; SSH is the interactive path.
- **file-api — no.** "All functions of the Vultr customer portal are accessible via the API" — [https://www.vultr.com/api/](https://www.vultr.com/api/) `inferred`. Files move over SSH or the S3 API, not through an instance file API.

### Built-in agents (`built-in-agents`)

- **agents-preinstalled — no.** "Deploy Popular Apps in One Click" — [https://www.vultr.com/marketplace/](https://www.vultr.com/marketplace/) `docs-confirmed`. Marketplace has Hermes and OpenClaw apps, but no coding-agent image; Claude Code and Codex are installed by guide.
- **prompt-api — no.** "All functions of the Vultr customer portal are accessible via the API" — [https://www.vultr.com/api/](https://www.vultr.com/api/) `inferred`. There is no endpoint that sends a prompt to an agent; Serverless Inference is a model API, not an agent runtime.
- **one-click-hermes — yes.** "Self improving AI Agent built by Nous Research." — [https://www.vultr.com/marketplace/apps/hermesagent/](https://www.vultr.com/marketplace/apps/hermesagent/) `docs-confirmed`. The HermesAgent Marketplace app deploys on Ubuntu 24.04 with Vultr Serverless Inference configured; its listing prints username hermes and password Password.
- **one-click-openclaw — yes.** "The AI that actually does things." — [https://www.vultr.com/marketplace/apps/openclaw/](https://www.vultr.com/marketplace/apps/openclaw/) `docs-confirmed`. The OpenClaw Marketplace app deploys the gateway with Homebrew, Docker and a browser VS Code terminal; its listing prints username clawmine and password Password.
- **browser — no.** "Neko is an open-source virtual browser platform that runs inside Docker and streams an interactive browser session to multiple users via WebRTC." — [https://docs.vultr.com/how-to-deploy-neko-self-hosted-virtual-browser-platform](https://docs.vultr.com/how-to-deploy-neko-self-hosted-virtual-browser-platform) `docs-confirmed`. No browser image or browser API; Vultr's Neko guide installs a virtual browser in Docker for a human to watch.
- **desktop — partly.** "Windows Server brings familiarity to the data center for Windows administrators with its graphical environment." — [https://www.vultr.com/servers/windows/](https://www.vultr.com/servers/windows/) `docs-confirmed`. *Shortfall:* A Windows Server instance with RDP gives a graphical desktop you manage; there is no computer-use API or preconfigured desktop agent. A Windows Server instance with RDP gives a graphical desktop you manage; there is no computer-use API or preconfigured desktop agent.
- **hosts-other-agents — yes.** "This article explains how to deploy Hermes Agent on a Linux server using Docker Compose with Traefik for automatic HTTPS." — [https://docs.vultr.com/how-to-deploy-hermes-agent-open-source-self-hosted-ai-agent](https://docs.vultr.com/how-to-deploy-hermes-agent-open-source-self-hosted-ai-agent) `docs-confirmed`. Vultr publishes deployment guides for Hermes, OpenClaw, Codex with Dokploy, Cursor with Coolify, n8n, Discord bots and MCP servers.

### Teams and accounts (`teams-accounts`)

- **team-workspace — yes.** "Organizations create environments with shared Vultr resources that are governed by IAM permission policies." — [https://www.vultr.com/products/iam/](https://www.vultr.com/products/iam/) `docs-confirmed`. Organizations are separate resource and billing environments with invited members and IAM policies.
- **roles — yes.** "Roles are predefined permission sets." — [https://www.vultr.com/products/iam/](https://www.vultr.com/products/iam/) `docs-confirmed`. Predefined roles, groups and custom JSON policies at service, action and resource level; assumable roles add time- or IP-bound access.
- **sso — yes.** "SSO on Vultr is made available through OpenID Connect." — [https://docs.vultr.com/single-sign-on](https://docs.vultr.com/single-sign-on) `docs-confirmed`. Single sign-on uses OpenID Connect with Okta, OneLogin, Google or Microsoft Entra ID; SAML is explicitly not supported.
- **spend-cap — no.** "Review the maximum instances, current instances, and maximum instance cost." — [https://docs.vultr.com/platform/billing/manage-account-limits](https://docs.vultr.com/platform/billing/manage-account-limits) `docs-confirmed`. Vultr enforces an account credit limit (a maximum instance cost) that you can view and ask to raise, but there is no user-set budget that stops machines; invoice and bandwidth emails are alerts only.
- **usage-alerts — partly.** "You can configure email notifications for maintenance, outages, bandwidth usage, and new invoices" — [https://docs.vultr.com/platform/other/manage-notifications](https://docs.vultr.com/platform/other/manage-notifications) `docs-confirmed`. *Shortfall:* Vultr emails new invoices and bandwidth usage, but there is no alert at a dollar threshold you set. Email preferences cover outages, maintenance, bandwidth usage and new invoices; there is no published spend-threshold alert.
- **audit-log — yes.** "Vultr Audit Logs retain user product activity for a maximum of 10 years in a dedicated read-only storage bucket" — [https://www.vultr.com/products/iam/](https://www.vultr.com/products/iam/) `docs-confirmed`. Audit Logs retain user product activity for up to 10 years in a read-only bucket; 30 days are free, longer retention is billed by storage.

### Billing models (`billing-models`)

- **per-second — no.** "The minimum billing unit is one hour, and hourly charges begin when a server is deployed, regardless of whether it is powered on or off." — [https://docs.vultr.com/support/platform/billing/how-am-i-billed-for-my-servers](https://docs.vultr.com/support/platform/billing/how-am-i-billed-for-my-servers) `docs-confirmed`. Billing is hourly with a one-hour minimum per server, not per second.
- **active-cpu — no.** "Servers that are stopped but not destroyed continue to incur hourly charges for reserved resources such as compute, storage, and IP address allocations." — [https://docs.vultr.com/support/platform/billing/how-am-i-billed-for-my-servers](https://docs.vultr.com/support/platform/billing/how-am-i-billed-for-my-servers) `docs-confirmed`. CPU, RAM and disk are reserved and billed for every hour the instance exists, whether the agent works or waits.
- **cheap-pause — no.** "To stop billing for a server, you must destroy it from your account. Stopping a server does not suspend billing." — [https://docs.vultr.com/support/platform/billing/how-am-i-billed-for-my-servers](https://docs.vultr.com/support/platform/billing/how-am-i-billed-for-my-servers) `docs-confirmed`. A stopped instance bills at the running rate; only destroying it ends the charge.
- **no-monthly-fee — yes.** "All servers on your account are billed hourly up to the monthly rate cap." — [https://www.vultr.com/products/block-storage/](https://www.vultr.com/products/block-storage/) `docs-confirmed`. No subscription: each server bills hourly from deployment, capped at its monthly price.
- **flat-price — yes.** "2 vCPUs 4 GB Memory 3.00 TB Bandwidth 80 GB Storage $20.00/mo $0.03/hr" — [https://www.vultr.com/pricing/](https://www.vultr.com/pricing/) `docs-confirmed`. The 2 vCPU / 4 GB / 80 GB plan is $20 a month, and 730 hours is capped at that price.

### Trials and free tiers (`trials-free-tiers`)

- **free-tier — partly.** "The free tier instance is available in Miami, Seattle, and Frankfurt." — [https://www.vultr.com/free-tier-program/](https://www.vultr.com/free-tier-program/) `docs-confirmed`. *Shortfall:* The free instance is an application-only, randomized program limited to Miami, Seattle and Frankfurt, not a standing free tier for every account. The free instance is an application-only, randomized program limited to Miami, Seattle and Frankfurt, not a standing free tier for every account.
- **free-credit — partly.** "Vultr will match your first deposit dollar for dollar, up to $100, when you open a new account." — [https://www.vultr.com/coupons/](https://www.vultr.com/coupons/) `docs-confirmed`. *Shortfall:* The advertised credit is a promo code or a dollar-for-dollar deposit match, not an automatic signup credit. The advertised credit is a promo code or a dollar-for-dollar deposit match, not an automatic signup credit.
- **no-card — no.** "We accept Visa, Mastercard, American Express, Discover, JCB, BitPay (BTC, BCH, ETH, DOGE, PAX, BUSD, LTC, USDC, GUSD), Alipay, UnionPay, and PayPal." — [https://www.vultr.com/resources/faq/](https://www.vultr.com/resources/faq/) `docs-confirmed`. Paid servers need a card, PayPal, Alipay, UnionPay or crypto; the free tier is a separate application.

### Who is behind it (`company`)

- **status-page — yes.** "Vultr provides real-time server status in JSON and RSS format via three endpoints." — [https://status.vultr.com/](https://status.vultr.com/) `docs-confirmed`. A public status page with per-region status, compute availability, JSON and RSS feeds.
- **sla — yes.** "Vultr offers a 100% uptime guarantee via this Service Level Agreement based on network and host node availability." — [https://www.vultr.com/legal/sla/](https://www.vultr.com/legal/sla/) `docs-confirmed`. A 100% uptime guarantee on network and host-node availability, credited per service item when the customer opens a ticket and asks.
- **soc2 — yes.** "SOC 2+ (HIPAA)" — [https://www.vultr.com/legal/compliance/](https://www.vultr.com/legal/compliance/) `docs-confirmed`. SOC 2+ with HIPAA, plus ISO 27001/27017/27018/20000-1, PCI Merchant and CSA Star Level 1.
- **dpa — yes.** "Yes, Vultr offers a Data Processing Addendum (DPA) to support customers that are subject to the EU General Data Protection Regulation (GDPR)" — [https://docs.vultr.com/support/platform/compliance/does-vultr-offer-a-data-processing-addendum](https://docs.vultr.com/support/platform/compliance/does-vultr-offer-a-data-processing-addendum) `docs-confirmed`. A GDPR Data Processing Addendum is available for e-signature through an account manager or support ticket.
- **open-source — no.** "These terms of use (the “Terms”) are a legal contract between The Constant Company, LLC, and its affiliates (“Vultr”, “we” or “us”)" — [https://www.vultr.com/legal/tos/](https://www.vultr.com/legal/tos/) `inferred`. Vultr is a proprietary hosted cloud; its CLI, Terraform provider and clients are open source, the platform is not.

---

## 8. Feature ledger (all 16)

Each feature's verdict, key figure, worked-scenario line, note and source. The JSON rows are the
machine-readable form of the same dispositions.

- **isolation — yes, "Full VM; root, Docker, ISO".** Scenario: Clone, build and load the module without a workaround: an ordinary virtual machine with its own kernel, root, Docker and SSH. Note: A full VM per instance with root, Docker and real SSH. Nested virtualisation is documented only on VX1 plans, and a custom image is a mounted ISO (two per account, under 10 GB) rather than a disk-image upload. Source: [https://www.vultr.com/products/cloud-compute/](https://www.vultr.com/products/cloud-compute/) — "Easily deploy and scale shared or dedicated virtual machines (VMs) and bare metal across six continents"
- **sizes-regions — yes, "24 vCPU / 96 GB; 34 regions".** Scenario: A fixed plan fits the 4 vCPU / 8 GiB ask exactly, in any of 34 regions, and the plan can be upgraded later — but not downgraded. Note: Shared Cloud Compute runs 1–24 vCPU and 0.5–96 GB with 10–1,600 GB of SSD or NVMe; dedicated Optimized plans reach 96 vCPU / 256 GB / 1,280 GB and VX1 reaches 192 vCPU / 768 GB. No custom CPU/RAM split, no downgrade on resize, and GPUs are a separate product. Source: [https://www.vultr.com/products/cloud-compute/](https://www.vultr.com/products/cloud-compute/) — "34 cloud data center regions"
- **lifecycle — no, "No pause; stop still bills".** Scenario: At 18:00 the server is stopped and keeps its disk and IP; at 09:00 its disk is as it was left, and the 640 stopped hours cost the same as running ones. Note: Stop halts the operating system and all running processes and keeps billing; only destroy ends the charge, and destroying permanently deletes the data. There is no pause, hibernate or memory snapshot. Source: [https://docs.vultr.com/products/compute/instances/cloud-compute/management/stop-instance.md](https://docs.vultr.com/products/compute/instances/cloud-compute/management/stop-instance.md) — "Stopping an instance shuts it down and disables network connectivity until it is restarted. The operating system and all running processes are halted, but billing continues unless the instance is deleted."
- **snapshots-forks — partly, "Disk snapshots $0.05/GB-mo".** Scenario: Snapshot the configured server and boot copies from it; there is no memory snapshot, no live fork and automatic backups keep only two copies. Note: Manual snapshots are disk images kept until deleted at $0.05/GB-month, and they double as the template mechanism. They never include RAM or attached block storage, and automatic backups keep only the two most recent. Source: [https://docs.vultr.com/support/platform/billing/does-vultr-charge-for-stored-snapshots](https://docs.vultr.com/support/platform/billing/does-vultr-charge-for-stored-snapshots) — "Yes. Vultr charges $0.05 per GB per month for each stored snapshot."
- **storage — yes, "Disk kept; 40 TB volumes".** Scenario: The 20 GiB the agent writes lives on the plan disk and is still there next session, because the disk is kept while the server exists. Note: The plan disk persists across stops and is included in the plan price. Block Storage adds up to 16 volumes per instance, 40 TB HDD or 10 TB NVMe, at $0.10/GB-month and only in the same region. Vultr File System gives multi-instance shared storage at $100/TB-month; Object Storage is S3-compatible. Source: [https://www.vultr.com/products/block-storage/](https://www.vultr.com/products/block-storage/) — "Attach up to 16 volumes per instance"
- **idle-timers — yes, "No idle timer; no session limit".** Scenario: The agent is still awake at 00:20, because there is no idle timer and no lifetime limit to configure; nothing stops it but you. Note: There is no idle timeout, auto-stop or maximum session length. The same absence means there is no wake path: a stopped instance stays stopped until the console, API or CLI starts it. Source: [https://docs.vultr.com/products/compute/instances/cloud-compute/management/stop-instance.md](https://docs.vultr.com/products/compute/instances/cloud-compute/management/stop-instance.md) — "Stopping an instance shuts it down and disables network connectivity until it is restarted."
- **reaching-it — yes, "Public IPv4, any port, SSH".** Scenario: The agent's web port is reachable at a static public address, SSH is a real port on the same host, and any other TCP or UDP service can be opened. Note: One public IPv4 is included on paid plans, any inbound port can be opened, and SSH is a normal daemon. There is no provider-issued private or token-gated link, and the browser console is a VNC view rather than an API shell. Source: [https://www.vultr.com/resources/faq/](https://www.vultr.com/resources/faq/) — "Many of our plans come with one primary IPv4 address."
- **custom-domains — partly, "Your DNS, your proxy".** Scenario: Point an A record at the server's static IP and run Caddy or Traefik for TLS; the certificate is yours to renew. Note: Vultr DNS is free and anycast, so a custom domain is a DNS record. TLS is yours: the documented paths run Traefik or Caddy with Let's Encrypt, and Vultr does not issue a certificate for a compute instance. Source: [https://docs.vultr.com/product-overviews/dns](https://docs.vultr.com/product-overviews/dns) — "Free domain record management for any domain you own"
- **outbound-network — partly, "0.5–15 TB out; inbound-only FW".** Scenario: The agent browses freely inside its plan allowance from a static IPv4, but an outbound allowlist has to be enforced inside the VM. Note: Each plan includes 0.5–15 TB of egress, overage is $0.01/GB, and a VPC-only instance can be deployed with no public IP. Vultr Firewall filters only incoming traffic, so outbound allowlisting is UFW, iptables or firewalld on the instance. Outbound 25, 137–139 and 445 are blocked by default and can be removed by ticket. Source: [https://docs.vultr.com/support/products/network/does-vultr-firewall-filter-outgoing-traffic-from-my-instance](https://docs.vultr.com/support/products/network/does-vultr-firewall-filter-outgoing-traffic-from-my-instance) — "No, Vultr Firewall does not filter outgoing traffic from instances."
- **keys-secrets — no, "No secrets store".** Scenario: Whatever key the agent needs is a file or an environment variable on the server, readable by anything running there. Note: There is no vault, write-only environment store or request-signing proxy. Cloud-init user-data and startup scripts inject first-run configuration onto the disk. API keys are managed through IAM, but the portal's personal access token is account-wide. Source: [https://www.vultr.com/api/](https://www.vultr.com/api/) — "All functions of the Vultr customer portal are accessible via the API"
- **ways-to-drive — yes, "Console, CLI, API, SDKs".** Scenario: The first machine is clickable in the console; the agent is installed over SSH, and everything after that can be scripted through the API, CLI or Terraform. Note: Console, REST API v2, official CLI, Terraform provider and official Go, Python, Node, PHP and Ruby clients. There is no PTY or file API, and the official MCP server is a read-only preview. Source: [https://www.vultr.com/api/](https://www.vultr.com/api/) — "All functions of the Vultr customer portal are accessible via the API"
- **built-in-agents — partly, "Hermes + OpenClaw one-click".** Scenario: Hermes or OpenClaw can be running from the Marketplace in minutes, but a coding agent is still your install and the app's default password must be changed first. Note: Marketplace one-click apps exist for Hermes Agent and OpenClaw, each printed with the default password "Password". There is no coding agent preinstalled, no prompt API and no built-in browser or computer-use desktop; coding agents arrive through guides such as Codex with Dokploy. Source: [https://www.vultr.com/marketplace/apps/hermesagent/](https://www.vultr.com/marketplace/apps/hermesagent/) — "Self improving AI Agent built by Nous Research."
- **teams-accounts — yes, "IAM orgs, roles, OIDC SSO".** Scenario: Five developers share an organization with roles and scoped policies; the owner sees an audit log, but nothing sets a hard monthly budget. Note: Organizations, IAM policies, roles, groups, service accounts, OIDC SSO and audit logs with up to 10 years of retention. SAML is not supported. Spend control is an account credit limit plus invoice and bandwidth emails, not a user-set monthly cap. Source: [https://www.vultr.com/products/iam/](https://www.vultr.com/products/iam/) — "Organizations create environments with shared Vultr resources that are governed by IAM permission policies."
- **billing-models — partly, "Hourly, 1 h minimum, 672 h cap".** Scenario: An always-on 4 vCPU machine costs the same as the cap every month, but a machine that stops between sessions is billed as if it never stopped. Note: Hourly with a one-hour minimum and a 672-hour monthly cap (the monthly price); stopped hours bill at the same rate. Not per-second, not active-CPU, and there is no cheap paused state. Source: [https://docs.vultr.com/support/platform/billing/how-am-i-billed-for-my-servers](https://docs.vultr.com/support/platform/billing/how-am-i-billed-for-my-servers) — "The minimum billing unit is one hour, and hourly charges begin when a server is deployed, regardless of whether it is powered on or off."
- **trials-free-tiers — partly, "Free tier by application; deposit match".** Scenario: A new account can apply for one small free instance in three regions, or use a promo code that matches a first deposit; a card is still needed for paid servers. Note: The Free Tier Program offers 1 vCPU / 512 MB / 10 GB in Miami, Seattle and Frankfurt to eligible applicants, on a limited and randomized basis. Otherwise credit comes from promo codes or a dollar-for-dollar deposit match up to $100, not an automatic signup credit. Source: [https://www.vultr.com/free-tier-program/](https://www.vultr.com/free-tier-program/) — "Vultr is offering free cloud compute instances to eligible applicants!"
- **company — yes, "SOC 2+, ISO 27001, 100% SLA".** Scenario: The buyer can check a 2014-founded, privately held company, a 100% uptime SLA with credits, a DPA on request and audited certifications. Note: The Constant Company, LLC (Vultr), founded 2014, privately held, 34 regions and 80m+ instances. SOC 2+ (HIPAA), ISO 27001/27017/27018/20000-1, PCI Merchant and CSA Star; a 100% uptime SLA with service credits; a DPA by request. Source: [https://www.vultr.com/legal/compliance/](https://www.vultr.com/legal/compliance/) — "SOC 2+ (HIPAA)"

---

## 9. Use cases (all 10)

| Use case | Tier | No terminal | Price | Disposition |
|---|---|---|---|---|
| hermes-agent | one-click | partly | 2 vCPU / 4 GiB plan $20/mo; no app surcharge | The Marketplace HermesAgent app deploys Hermes on Ubuntu 24.04 with a Vultr Serverless Inference key you supply at launch, plus a web login. The listing prints a default password (hermes / Password) and channel setup is done in the app, so budget a first login and a password change. |
| openclaw | one-click | partly | 2 vCPU / 4 GiB plan $20/mo; no app surcharge | The Marketplace OpenClaw app deploys the gateway on Ubuntu 24.04 with Homebrew, Docker and a browser VS Code terminal, and a default clawmine / Password login. Change the password and treat the Code Server terminal as root-equivalent access. |
| coding-agent | manual | no | $40/mo for 4 vCPU / 8 GiB, on or stopped | Create a 4 vCPU / 8 GiB instance, SSH in and install Claude Code or Codex. Vultr's Codex guide uses Dokploy for the deploy half; the agent itself is a terminal install, and the disk survives a stop but the server bills through it. |
| code-interpreter | backend | no | $0.02976 per server-hour: 20,000 one-minute runs ≈ $595 | There is no execution API or sandbox pool. You would build the run endpoint and machine pool on the Vultr API, and the one-hour minimum makes 20,000 one-minute runs cost 20,000 server-hours. |
| browser-agent | manual | no | $0.02976 per server-hour, one hour minimum per session | No browser or computer-use product. The Neko guide installs a virtual browser in Docker on a 4-core / 8 GB server; every ten-minute session still bills a whole hour, so 30,000 sessions are uneconomic. |
| workflow-automation | guide | no | 2 vCPU / 4 GiB $20/mo always on | Vultr's n8n guide runs n8n and Traefik from Docker Compose on Ubuntu 24.04, with the database and encryption key on the instance disk. It is a terminal build, not a Marketplace app. |
| chat-bot | guide | no | 1 vCPU / 2 GiB $10/mo | Vultr's Discord guide deploys a Docker app and runs a Python bot inside it; keep it as a service and store the token on the disk. A gateway connection needs the machine awake, and Vultr has no idle stop. |
| claude-code-team | manual | no | 5 × $40 = $200/mo | One instance per developer in a shared IAM organization, each with its own SSH key and Claude login. Five 4 vCPU / 8 GiB machines cost $200 a month whether the developers work eight hours or twenty-four. |
| scheduled-scraper | manual | no | 120 runs × 1 h × $0.01488 ≈ $1.79, or $10/mo always on | Run cron or a systemd timer inside an always-on instance, or create a fresh instance per run through the API. A fresh 1 vCPU / 2 GiB instance is billed a whole hour per run, so 120 ten-minute runs cost about $1.79 against $10 for an always-on box; write results to Object Storage. |
| mcp-server | guide | no | 1 vCPU / 1 GiB $5/mo | Vultr's MCP guide runs a FastMCP server on an Ubuntu instance and reaches it over HTTP; add TLS and authentication yourself. The instance needs a public IPv4 and must stay up. |

**Picks: none.** Reasons:

- **hermes-agent** — A real one-click app at $20/mo, but DigitalOcean and Hostinger already make the one-click Hermes case, and Vultr's listing prints a default password.
- **openclaw** — A one-click app at $20/mo, but DigitalOcean's hardened $12 image is cheaper and already a pick.
- **coding-agent** — Manual install only; Vultr has no preinstalled coding agent.
- **code-interpreter** — No execution API, and the one-hour minimum makes per-run interpreters uneconomic.
- **browser-agent** — No browser or computer-use product; the Neko guide plus hourly billing is a poor fit.
- **workflow-automation** — A good n8n guide, but n8n's own Hetzner guide is already a pick.
- **chat-bot** — A solid always-on host, but Hetzner already makes the same case at a similar price.
- **claude-code-team** — Five 4/8 machines cost $200/mo and add no team-specific advantage over the existing picks.
- **scheduled-scraper** — Fresh-instance runs are cheap, but providers with a real scheduler already cover this case.
- **mcp-server** — $5/mo is the cheapest VPS here, but DigitalOcean's $6 pick already covers a small always-on endpoint; a route row is enough.

The route rows are justified because Vultr publishes first-party deployment pages for Hermes, OpenClaw,
n8n, Discord bots, MCP servers and Codex. No pick is justified: the one-click Hermes/OpenClaw apps are
either more expensive than DigitalOcean's or ship a default password, the always-on VPS case is already
made by Hetzner and DigitalOcean, and the cheap MCP endpoint is already covered by DigitalOcean's $6 pick.

---

## 10. Company and trust

| Fact | Value | Source |
|---|---|---|
| Legal entity | The Constant Company, LLC, trading as Vultr | [Terms](https://www.vultr.com/legal/tos/) — "These terms of use (the “Terms”) are a legal contract between The Constant Company, LLC, and its affiliates (“Vultr”, “we” or “us”)" |
| Founded and scale | 2014; 34 regions; 80m+ instances; 1.5m+ customers; 75+ engineers | [About](https://www.vultr.com/company/about-us/) — "Vultr, founded in 2014, is on a mission to empower developers and businesses by simplifying the deployment of infrastructure via its advanced cloud platform." |
| Ownership and funding | Privately held; December 2024 financing at a $3.5bn valuation from LuminArx and AMD Ventures; June 2025 $329m credit financing | [About](https://www.vultr.com/company/about-us/) — "Secured $3.5 billion valuation in financing from LuminArx and AMD Ventures" |
| Certifications | SOC 2+ (HIPAA), ISO/IEC 27001:2022, ISO 27017, ISO 27018, ISO 20000-1, PCI Merchant, CSA Star Level 1 | [Compliance](https://www.vultr.com/legal/compliance/) — "SOC 2+ (HIPAA)" |
| SLA | 100% uptime on network and host-node availability, credited per service item on request | [SLA](https://www.vultr.com/legal/sla/) — "Vultr offers a 100% uptime guarantee via this Service Level Agreement based on network and host node availability." |
| DPA | GDPR DPA by request through an account manager or support ticket | [DPA](https://docs.vultr.com/support/platform/compliance/does-vultr-offer-a-data-processing-addendum) — "Yes, Vultr offers a Data Processing Addendum (DPA) to support customers that are subject to the EU General Data Protection Regulation (GDPR)" |
| Status | Public status page with JSON and RSS feeds | [status.vultr.com](https://status.vultr.com/) — "Vultr provides real-time server status in JSON and RSS format via three endpoints." |

**Ownership note.** Vultr is privately held; no parent company or stock listing is published. The 2024
financing is a valuation, not a customer-facing price or guarantee. `docs-confirmed`

---

## 11. Quote verification

On 30 October 2026 every cited quote was re-checked mechanically against the live page:

- **23 docs.vultr.com URLs** were fetched directly with `curl`, stripped of HTML tags and compared after
  normalization: 39 quoted passages on those 23 pages, all present.
- **20 www.vultr.com pages** were re-fetched through Exa and compared the same way, all present.
  Across the whole package, 103 quoted passages on 50 URLs were checked.
- **GitHub** quotes were checked against the raw README and the repository description; the plans-API
  quote was checked against the live compact JSON.
- **Status page** was re-fetched after its first quote was replaced; the final quote is present.

Normalization applied, and nothing else: HTML tags removed, entities decoded, whitespace collapsed,
spaces around punctuation removed, Markdown `**` and backticks stripped, curly quotes normalized to
straight quotes, and spaces that inline HTML tags inserted after opening or before closing quote marks
removed. No words, numbers or qualifiers were changed.

**Failures during research, recorded rather than hidden:** plain `curl` of `www.vultr.com` returns 403;
the old `vultr/vultr-python` repo is 404 (renamed `vultr-python-client`); the VX1 whitepaper fetch failed
and the Vultr blog was used instead. The status page's "Planned Service" state is an observation, not a
verdict.

---

## 12. Integration notes (not applied)

This package is research only. To integrate it into the site, the parent would:

1. Copy `provider.json` to `site/src/data/providers/vultr.json` and `pricing.json` to
   `site/src/data/pricing/vultr.json`.
2. Add the 16 feature rows to `site/src/data/features/*.json` and the 78 capability rows to
   `site/src/data/capabilities.json`.
3. Add the 10 route rows to `site/src/data/usecases.json`; add no picks.
4. Add the `vultr` key to `site/src/data/docs.json`; add a `VPS: …` entry for Vultr in
   `site/src/pages/compare/side-by-side.astro`'s manual `kinds` map.
5. Add a dated `changes.json` entry for the new listing.
6. Run `npm run check-rates` from `site/` and add baseline entries for the new money-bearing URLs, then
   review `NEW`/`OLD` output before any `--update`.
7. Extend `site/src/lib/cost.test.ts` with the independently worked A/B/C figures ($29.76 / $40.00 /
   $20.00) and the boundary checks in `abc.md`.
8. Run `npm run build && npm test`, then render the provider page, comparison table, calculator and the
   Hermes/OpenClaw/n8n/MCP use-case pages at desktop and mobile.

Counts after integration would be **22 providers (17 sandboxes and 5 VPS), 16 features, 78 capabilities,
10 use cases** and **1,716 provider rows** (1,638 + 78). The current data has 21 providers, not the 16 named in the
skill's introduction or the 16 still printed in `site/README.md`; the root `README.md` already says 21.
Both READMEs, the provider-list prose and any static counts need updating to 22 when this is integrated.
No shared JSON was edited, nothing was committed, and nothing was pushed.

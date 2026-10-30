# Scaleway Instances — research ledger (provider id `scaleway`)

Target: **https://www.scaleway.com/en/virtual-instances/** (pricing: **https://www.scaleway.com/en/pricing/virtual-instances/**).
Repository revision at start: `df4cd0c` (`main`, 2026-10-30), clean worktree; the only new files are under `research/incoming/scaleway/`.
Research date: **2026-10-30**. Desk research only: no Scaleway account was created, no Instance was ordered, started or billed.
Scope: general-purpose Instances — the shared-CPU **Development** (STARDUST1, DEV1, PLAY2) and **General Purpose** (BASIC3, BASIC2-A, PRO2, GP1) ranges. GPU Instances, dedicated STANDARD3/POP2, the compute/memory-optimised ranges and Elastic Metal are out of scope except where a capability row needs them (GPUs, big machines).

**Integration status (reported 2026-10-30, after this research).** The integrating thread applied this card in local commit `06aae74` — not pushed, and not visible in this checkout, which is still at `df4cd0c`. That commit uses the one-plan block-storage card and adds `perMachine {hourly: 0.005565, monthly: 4.0625}` for the flexible IPv4. It also changed `cost.ts` so a per-machine fee bills through kept stopped hours, and so `minimumSeconds` applies to disk and per-machine fees on short tasks. With those changes the engine prints the hand-worked **$29.49 / $44.15 / $8.20**. Every "engine prints" figure below, and the limitations marked *superseded*, describe `df4cd0c` and are kept as the pre-integration record; they are not statements about current `main`. I have not run the fixed engine in this checkout.

**Tag legend**

| Tag | Meaning |
|---|---|
| `docs-confirmed` | Stated on a Scaleway docs page, legal notice or official API page. |
| `pricing-page` | Stated on a page whose subject is money, or on the official price-update post. |
| `third-party` | Not from Scaleway. |
| `inferred` | My reading of documented behaviour, not a sentence Scaleway writes. |
| `not-published` | Scaleway does not say; no answer found after searching. |

A tag applies to the claim it sits on; the quote under it is the evidence. Quotes are copied verbatim and checked mechanically against the live page (see §14).

## 0. How the evidence was collected

| Method | What it was used for | Notes |
|---|---|---|
| TinyFish `search` | Finding the pricing, docs, storage, network, compliance, SSO, OpenClaw and SDK pages | 12 searches. Returned the official pricing page and the June 2026 price-update post first. |
| TinyFish `fetch_content` | Reading docs and marketing pages as Markdown, and re-reading every cited page for the quote check | About 45 fetches. The pricing page renders server-side enough to return its tables; the storage page returned only the Object Storage tab, which is why Firecrawl was used for it. |
| Firecrawl `firecrawl_scrape` (`maxAge: 0`, `waitFor: 4000`) | Rendered pricing pages (virtual instances, storage, network) and the security/compliance page | Fresh fetch, 4 calls during research and 4 more for the quote check. The storage page's Block Storage table only appears in the rendered DOM. |
| `curl` of docs pages | Full text of ~20 docs pages, saved under `/tmp/scw` and grepped for quotes | docs.scaleway.com server-renders its article text. `/pricing/*` returns 403 to curl behind Bunny Shield, so pricing pages came through TinyFish/Firecrawl instead. |
| `curl` of `https://api.scaleway.com/instance/v1/zones/fr-par-1/products/servers` | Per-shape local-volume maximums and the list of offers in a zone | Public, no token. Its `hourly_price`/`monthly_price` fields are 0.0 (deprecated), so it is not a price source. It also omits PLAY2 and PRO2 entirely, so it is not an availability source either. |
| `curl` of `https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml` | EUR→USD conversion | Reference rate for 29 October 2026: **1 EUR = 1.1130 USD**. |

**Paid-tool spend.** TinyFish (12 searches, ~25 fetches) and Firecrawl (3 scrapes). No Exa, Tavily, Parallel or Context calls succeeded or were used. Estimated total **well under US$1**.

**Price freshness.** The live pricing page matches the "new pricing starting June 1st, 2026" column of Scaleway's own price-update post, line for line: PLAY2-PICO €0.01428, DEV1-S €0.00898, BASIC3-X2C-4G €0.03945, STARDUST1-S €0.0006, local storage €0.000049/GB/hour, Zonal Flexible IPv4 €0.005/hour. That cross-check is what confirms the page is current rather than a cached or pre-change rendering.

## 1. What it is

Scaleway sells fixed-size virtual machines called **Instances**, with storage and public IPs billed as separate resources. `docs-confirmed`

> "An Instance is a virtual machine in the cloud. Like a physical machine, it provides resources such as virtualized CPU, RAM, and storage." — [Create an Instance](https://www.scaleway.com/en/docs/instances/how-to/create-an-instance/)

> "Instances are billed on a pay-as-you-go basis, and their prices are made up of three parts: Instance price, Storage price (local or block), Flexible IP price." — [Instances FAQ](https://www.scaleway.com/en/docs/instances/faq/)

> "List prices include egress and IPv6 addresses. Storage (local, block) and attached public IPv4 addresses are excluded." — [Virtual Instances pricing](https://www.scaleway.com/en/pricing/virtual-instances/)

**Who it is for.** A reader who wants an ordinary EU Linux server priced in euros, from a French provider with ISO 27001 and HDS, and who benefits from a cheap idle state: powering off stops the compute meter. It is the reference "VPS that does not bill while off" in this comparison, as opposed to Hetzner, which bills a powered-off server in full.

**Who it is not for.** Anyone running many short tasks: every resource is billed for a minimum of 60 minutes, so a ten-minute task costs a full hour of compute, disk and IP.

## 2. Ranges, sizes and prices

All prices are the **PAR-1 (Paris)** view of the pricing page, read on 2026-10-30, in EUR before tax. "Per month" on Scaleway's page is the hourly rate × 730; it is not a cap.

### Development range (shared vCPU) `pricing-page`

| Offer | vCPU | RAM | Bandwidth | €/hour | ≈ €/month | USD/hour (×1.113) |
|---|---:|---:|---|---:|---:|---:|
| STARDUST1-S | 1 | 1 GiB | 100 Mbps | 0.0006 | 0.43 | 0.000668 |
| DEV1-S | 2 | 2 GiB | 200 Mbps | 0.00898 | 6.55 | 0.009995 |
| DEV1-M | 3 | 4 GiB | 300 Mbps | 0.0202 | 14.74 | 0.022483 |
| DEV1-L | 4 | 8 GiB | 400 Mbps | 0.04284 | 31.27 | 0.047681 |
| DEV1-XL | 4 | 12 GiB | 500 Mbps | 0.06508 | 47.50 | 0.072434 |
| PLAY2-PICO | 1 | 2 GiB | 100 Mbps | 0.01428 | 10.42 | 0.015894 |
| PLAY2-NANO | 2 | 4 GiB | 200 Mbps | 0.02754 | 20.10 | 0.030652 |
| PLAY2-MICRO | 4 | 8 GiB | 400 Mbps | 0.05508 | 40.20 | 0.061304 |

### General Purpose range (shared vCPU; BASIC2-A is arm64) `pricing-page`

| Offer | vCPU | RAM | €/hour | ≈ €/month | USD/hour |
|---|---:|---:|---:|---:|---:|
| BASIC3-X2C-4G | 2 | 4 GiB | 0.03945 | 28.79 | 0.043908 |
| BASIC3-X4C-8G | 4 | 8 GiB | 0.079 | 57.67 | 0.087927 |
| BASIC3-X8C-32G | 8 | 32 GiB | 0.2368 | 172.86 | 0.263558 |
| BASIC3-X16C-64G | 16 | 64 GiB | 0.47329 | 345.49 | 0.526772 |
| BASIC2-A2C-4G | 2 | 4 GiB | 0.023 | 16.79 | 0.025599 |
| BASIC2-A4C-8G | 4 | 8 GiB | 0.0517 | 37.74 | 0.057542 |
| BASIC2-A8C-32G | 8 | 32 GiB | 0.1378 | 100.59 | 0.153371 |
| BASIC2-A16C-64G | 16 | 64 GiB | 0.2756 | 201.18 | 0.306743 |
| PRO2-XXS | 2 | 8 GiB | 0.0561 | 40.95 | 0.062439 |
| PRO2-XS | 4 | 16 GiB | 0.1122 | 81.90 | 0.124879 |
| PRO2-S | 8 | 32 GiB | 0.22338 | 163.06 | 0.248622 |
| PRO2-L | 32 | 128 GiB | 0.89454 | 653.01 | 0.995623 |
| GP1-XS | 4 | 16 GiB | 0.09282 | 67.75 | 0.103309 |
| GP1-S | 8 | 32 GiB | 0.19074 | 139.24 | 0.212294 |
| GP1-M | 16 | 64 GiB | 0.38352 | 279.96 | 0.426858 |
| GP1-L | 32 | 128 GiB | 0.77418 | 565.15 | 0.861662 |
| GP1-XL | 48 | 256 GiB | 1.67382 | 1,221.88 | 1.862962 |

The complete card has 42 shapes; this table shows the ones a reader is likely to price. The other BASIC2-A, BASIC3 and PRO2 sizes are in `pricing.json` at the same conversion.

**Shared vs dedicated** `docs-confirmed`

> "**vCPU type** indicates whether the Instance uses dedicated or shared vCPUs." — [Instances datasheet](https://www.scaleway.com/en/docs/instances/reference-content/instances-datasheet/)

> "They provide a **cost-effective** solution for development and production workloads with **non-intensive** requirements" — [General Purpose Instances](https://www.scaleway.com/en/general-purpose-instances/)

The datasheet lists DEV1, PLAY2, STARDUST1, BASIC2-A, BASIC3-X, PRO2 and GP1 as **Shared**, and STANDARD3-X, COMPUTE3-X, MEMORY3-X and POP2 as **Dedicated**. Dedicated ranges are outside this card.

**Regions** `docs-confirmed`

> "Scaleway offers different Instance ranges in all regions: Paris (France), Amsterdam (Netherlands), and Warsaw (Poland)." — [Instances FAQ](https://www.scaleway.com/en/docs/instances/faq/)

> "A subsidiary of the iliad Group, Scaleway currently operates in France, Poland, Italy, and the Netherlands, with upcoming deployments in Sweden and Germany." — [About Scaleway](https://www.scaleway.com/en/about-us/)

Milan (`it-mil`) is the fourth region and appears in the datasheet's per-AZ CO₂ table. Not every offer exists in every zone; the pricing page's zone selector is the authoritative list.

**Resizing** `docs-confirmed`

> "This upgrades your Instance, which reboots in the process, resulting in up to five minutes of downtime." — [Resize an Instance](https://www.scaleway.com/en/docs/instances/how-to/resize-instances/)

## 3. Billing: the rules that decide A, B and C

### 3.1 Hourly with a 60-minute minimum `docs-confirmed`

> "Each of these resources is billed separately for a minimum of 60 minutes." — [Billing FAQ](https://www.scaleway.com/en/docs/billing/faq/)

> "CPU Instances: Billed per hour of uptime (including startup and standby time)." — [Instances FAQ](https://www.scaleway.com/en/docs/instances/faq/)

This is the decisive rule for workload A. A ten-minute task is billed 60 minutes of compute, 60 minutes of volume and 60 minutes of IPv4. The page also defines a "unique resource" as each uninterrupted period between a start and a stop billing event, which is what the 60-minute floor applies to.

**Tension to record:** some third-party comparison pages still describe Scaleway as per-second. No current first-party page does; both billing pages above say hourly. If per-second billing with a 60-second minimum were still in force, A would fall from $28.59 to about $4.80. This ledger follows the first-party text and flags the risk in `provider.json`.

### 3.2 Powering off stops compute `docs-confirmed`

> "Compute billing stops, but you continue to pay for any attached storage (local volumes that you chose to keep or Block Storage volumes) and for any Flexible IPs." — [Instance states](https://www.scaleway.com/en/docs/instances/reference-content/instance-states/)

> "Billing pauses if you power off the Instance and resumes when you power it back on. However, any attached storage or flexible IPv4s continue to be billed even when powered off." — [Understanding Instance pricing](https://www.scaleway.com/en/docs/instances/reference-content/understanding-instance-pricing/)

### 3.3 Standby mode is not a pause `docs-confirmed`

> "You are still billed for an Instance in standby mode, as well as for its storage and any flexible IPs attached to it." — [Standby mode](https://www.scaleway.com/en/docs/instances/how-to/use-standby-mode/)

Standby keeps the Instance allocated and its local data in place, but it is billed like a running machine. There is no cheaper paused state and no memory snapshot.

### 3.4 No monthly cap, no plan fee `docs-confirmed`

> "You can power off or delete your Instance at any time—no minimum commitment or notice period is required." — [Understanding Instance pricing](https://www.scaleway.com/en/docs/instances/reference-content/understanding-instance-pricing/)

The pricing page's "approx. per month" is exactly hourly × 730 (0.01428 × 730 = 10.42 for PLAY2-PICO), which confirms it is an estimate, not a cap. Savings Plans (up to 25% for an hourly commitment) exist but are not modelled.

### 3.5 Storage prices `pricing-page`

> "Block Storage 5K | Up to 5,000 IOPS* | Free | €0.000130/GB/HOUR" — [Storage pricing](https://www.scaleway.com/en/pricing/storage/)

> "Block Snapshot will be billed at €0.000049/GB/hour. Unified Snapshot will be billed at €0.000049/GB/hour." — [Storage pricing](https://www.scaleway.com/en/pricing/storage/)

> "Compute Local Storage | €0.000044 /GB /hour | €0.000049 /GB /hour" — [Price update, effective 1 June 2026](https://www.scaleway.com/en/blog/a-transparent-update-on-scaleway-pricing/)

The blog's second column is the current price and matches the live storage page for block 5K (€0.000130) and snapshots (€0.000049). The live storage page does not show a local-storage row, so the local rate is evidenced by the price-update post, which is first-party and effective.

### 3.6 Flexible IPv4 `pricing-page` / `docs-confirmed`

> "Additional IP address | Instance | Type: IPv4 IP per asset - 1 IP | €0.005/hour" — [Network pricing](https://www.scaleway.com/en/pricing/network/)

> "Zonal Flexible IPv4 | €0.004 /hour | €0.005 /hour" — [Price update, effective 1 June 2026](https://www.scaleway.com/en/blog/a-transparent-update-on-scaleway-pricing/)

> "Each Instance’s flexible IPv4 costs €0.004/hour, excl. VAT." — [Instances FAQ](https://www.scaleway.com/en/docs/instances/faq/) — **stale**, contradicts the two pages above.

> "Billing for an Instance stops when it is powered off, but its flexible IPv4 remains reserved and continues to be billed unless deleted." — [Understanding Instance pricing](https://www.scaleway.com/en/docs/instances/reference-content/understanding-instance-pricing/)

The card uses **€0.005/hour = €3.65/month = $4.06/month**. IPv6 is free, and an Instance can be created without a public IPv4.

### 3.7 Currency and VAT

Scaleway publishes **EUR only**; no USD list was found on any pricing, product, billing or legal page read. The account's billing alerts are "denominated in euros" `docs-confirmed`:

> "Your budget, denominated in euros, represents the limit for your expenses." — [Use billing alerts](https://www.scaleway.com/en/docs/billing/how-to/use-billing-alerts/)

VAT is added on top `docs-confirmed`:

> "Prices before tax." — [Virtual Instances pricing](https://www.scaleway.com/en/pricing/virtual-instances/)

> "For EU customers, the local VAT rate is applied to the untaxed total to determine the total due amount." — [Reading an invoice](https://www.scaleway.com/en/docs/billing/additional-content/reading-an-invoice/)

So a French consumer pays 20% VAT on top of every figure here; a VAT-registered business in another EU country is reverse-charged; a customer outside the EU pays the figure shown. **The USD figures in this card are my conversion, not Scaleway's**: EUR × **1.1130**, the ECB reference rate for 29 October 2026. They are not a market quote and will drift.

## 4. Lifecycle, storage and snapshots

- **Stop** releases the hypervisor, keeps local storage (billed) or archives it (snapshot storage, billed), and keeps block volumes and the IPv4. `docs-confirmed` — [Instance states](https://www.scaleway.com/en/docs/instances/reference-content/instance-states/)
- **No memory pause, no idle timer, no wake-on-request, no session limit.** A stopped machine must be started by an API call. `inferred` from the state table and the absence of any timer setting in the docs.
- **Snapshots** are per volume; **images** snapshot every volume of an Instance. Both are manual, independent, billed resources kept until deleted, and can be exported/imported as QCOW2. `docs-confirmed` — [Create a backup](https://www.scaleway.com/en/docs/instances/how-to/create-a-backup/), [Snapshot import/export](https://www.scaleway.com/en/docs/instances/api-cli/snapshot-import-export-feature/)
- **No automatic backups.** Scaleway's own answer is a tutorial that schedules snapshots with Serverless Jobs. `docs-confirmed` (tutorial exists) / `inferred` (no product feature).
- **Volumes**: block 5 GB–15 TB, up to 16 per Instance (15 data volumes plus boot); local SSD up to 600 GB on GP1-XL. `docs-confirmed`

> "The maximum size of a block volume is 15 TB." — [Block Storage FAQ](https://www.scaleway.com/en/docs/block-storage/faq/)

> "You can attach a maximum of 16 volumes (including the mandatory boot volume) to a single Instance." — [Block Storage FAQ](https://www.scaleway.com/en/docs/block-storage/faq/)

> "The size of Local Storage depends on your Instance type. With today's configurations, the maximum Local Storage available is 600 GB." — [Block Storage FAQ](https://www.scaleway.com/en/docs/block-storage/faq/)

Per-shape local maximums (used for the card's `disk` field) come from the public product API `volumes_constraint.max_size`: DEV1-S 20 GB, DEV1-M 40, DEV1-L 80, DEV1-XL 120, GP1-XS 150, GP1-S 300, GP1-M/L/XL 600, STARDUST1-S 10. The FAQ's 600 GB ceiling matches.

## 5. Networking

- **Public IP**: flexible IPv4 routed to the Instance, up to five per type, detachable and movable; flexible IPv6 free. `docs-confirmed` — [Use flexible IPs](https://www.scaleway.com/en/docs/instances/how-to/use-flexips/)
- **Security groups**: inbound and outbound rules, stateful or stateless, applied to public traffic and to private-network interfaces; SMTP blocked until enabled. `docs-confirmed` — [Security groups](https://www.scaleway.com/en/docs/instances/how-to/use-security-groups/)
- **Private networks**: layer-2 VPC networks with DHCP, up to 8 NICs per Instance; private IPs free. `docs-confirmed` — [Private networks](https://www.scaleway.com/en/docs/instances/how-to/use-private-networks/), [Quotas](https://www.scaleway.com/en/docs/organizations-and-projects/organization/organization-quotas/)
- **Egress**: included, no per-GB fee. `pricing-page`

> "List prices include egress and IPv6 addresses." — [Virtual Instances pricing](https://www.scaleway.com/en/pricing/virtual-instances/)

> "Eliminate billing surprises and gain cost clarity with flat, transparent pricing, no egress fees, and Savings Plans." — [Virtual Instances](https://www.scaleway.com/en/virtual-instances/)

- **TLS/custom domain**: no per-Instance managed certificate. Edge Services terminates TLS with a managed Let's Encrypt certificate or an uploaded one, but its backends are Object Storage, a Load Balancer or a Serverless Container. `docs-confirmed` — [Edge Services concepts](https://www.scaleway.com/en/docs/edge-services/concepts/)

## 6. Access, secrets, automation

- **SSH** as root with an uploaded key; **serial console** in the browser for emergencies; no provider tunnel client (plain `ssh -L` works). `docs-confirmed`
- **Secret Manager**: separate product, versioned secrets, paths, ephemeral policies, single-access, TTL up to a year. Not injected into Instances; no write-only proxy. `docs-confirmed` — [Secret Manager concepts](https://www.scaleway.com/en/docs/secret-manager/concepts/)
- **API/CLI/SDKs**: REST API with OpenAPI specs, `scw` CLI, Python/Go/JS SDKs, Terraform provider. No official MCP server; community `scaleway-mcp` exists (third-party, not evaluated). `docs-confirmed` / `inferred`
- **No PTY endpoint, no file API, no prompt API.** `inferred` from the developer surfaces read.
- **InstantApps**: Docker, GitLab, Nextcloud, WordPress, OpenVPN. No agent images. `docs-confirmed` — [OS images and InstantApps](https://www.scaleway.com/en/docs/instances/reference-content/images-and-instantapps/)
- **Templates and autoscaling groups**: immutable Instance templates; groups run at a fixed size or autoscale on CPU/RAM behind a Load Balancer. No scheduled scaling. `docs-confirmed` — [Instance templates](https://www.scaleway.com/en/docs/instances/how-to/create-manage-instance-templates/), [Autoscaling groups](https://www.scaleway.com/en/docs/instances/how-to/create-manage-instance-groups/)

## 7. Teams, compliance and company

- **IAM**: Organizations, Projects, Members, groups, applications; permission sets with resource scopes and CEL conditions; API keys belong to a principal. `docs-confirmed` — [IAM concepts](https://www.scaleway.com/en/docs/iam/concepts/), [Permission sets](https://www.scaleway.com/en/docs/iam/policies-permissions/permission-sets/)
- **SSO**: SAML Identity Federation, plus SCIM user/group provisioning. The Owner cannot use SAML and logs in with OAuth2. `docs-confirmed` — [SSO with Authentik](https://www.scaleway.com/en/docs/iam/user-provisioning/set-up-sso-with-authentik/)
- **Audit Trail**: every action by any principal, with API method, outcome and source IP; 90-day export to Object Storage. `docs-confirmed` — [Audit Trail concepts](https://www.scaleway.com/en/docs/audit-trail/concepts/)
- **Spend control**: billing alerts only, up to 10 per budget, by SMS/email/webhook; nothing blocks spending. `docs-confirmed` (alerts) / `inferred` (no cap)
- **Certifications**: ISO/IEC 27001:2022, HDS, SecNumCloud under assessment; no SOC 2 listed. `docs-confirmed` — [Security and compliance](https://www.scaleway.com/en/security-and-compliance/)
- **SLA**: 99% for BASIC2-A/BASIC3-X, 99.5% for dedicated/specialised, **no SLO** for DEV1, GP1, PLAY2, PRO2. `docs-confirmed` — [Instance SLA](https://www.scaleway.com/en/virtual-instances/sla/)
- **Entity**: Scaleway SAS, 8 rue de la Ville-l'Évêque, 75008 Paris; SIREN 433 115 904 RCS Paris; VAT FR 35 433115904; capital €142,050; subsidiary of the iliad Group. `docs-confirmed` — [Legal notice](https://www.scaleway.com/en/legal-notice/), [About](https://www.scaleway.com/en/about-us/)
- **DPA**: published with the contracts and named in the privacy policy. `docs-confirmed` — [Privacy policy](https://www.scaleway.com/en/privacy-policy/)

## 8. Free tier, credit and quotas

> "Create a Business account and get started with €100 free credit." — [Scaleway vs AWS](https://www.scaleway.com/en/scaleway-vs-aws/)

> "New Business customers to Scaleway with a valid payment method are eligible. To be eligible, you must never have had an invoice issued by Scaleway" — [Scaleway vs AWS](https://www.scaleway.com/en/scaleway-vs-aws/)

No Instance size is free. A card is mandatory:

> "Note that you must add a credit card to your account before setting up a SEPA mandate." — [Billing FAQ](https://www.scaleway.com/en/docs/billing/faq/)

Default quotas are small and per offer type `docs-confirmed` — [Organization quotas](https://www.scaleway.com/en/docs/organizations-and-projects/organization/organization-quotas/): DEV1-S 10/20, DEV1-M 8/15, DEV1-L 5/10, PLAY2-NANO 5/10, PLAY2-MICRO 3/5, GP1-XS 1/4, PRO2-XXS 1/5 (payment-method-validated / identity-validated). This matters for A: 1,000 simultaneous machines are impossible without a quota increase, so the tasks must be sequential or spread across offer types. The table does not list BASIC3 or STARDUST1-S at all; BASIC3 is clearly current (it is the range the resize docs use), so the table is incomplete rather than authoritative on availability.

## 9. A, B and C

Worked in full in [`abc.md`](abc.md). Summary, USD, before VAT, at 1.1130 USD/EUR:

| Case | Shape | Compute | Block disk | IPv4 | Total | Engine at `df4cd0c` | Local-SSD total |
|---|---|---:|---:|---:|---:|---:|---:|
| A | DEV1-M, 1,000 × 10 min | $22.48 | $1.45 | $5.57 | **$29.49** | $22.72 | $28.59 |
| B | DEV1-L, 730 h | $34.81 | $5.28 | $4.06 | **$44.15** | $40.09 | $40.86 |
| C | DEV1-M, 90 + 640 h | $2.02 | $2.11 | $4.06 | **$8.20** | $4.14 | $6.88 |

At `df4cd0c` the engine matched the hand-worked compute and block storage for B and C exactly, including C's stopped hours, and differed on two points: the **IPv4**, which the research card excluded because `perMachine` then followed billed machine hours; and **A's disk**, because the 60-minute floor applied to compute only ($0.24 printed against $1.45 worked). Both were closed in `06aae74` (reported): the integrated card adds the IPv4 as `perMachine`, and the engine now applies `minimumSeconds` to disk and per-machine fees, so the integrated calculator prints the hand-worked totals.

## 10. Use-case dispositions

| Use case | Tier | noTerminal | Why |
|---|---|---|---|
| `hermes-agent` | manual | no | Create a DEV1-M, SSH in, run Hermes as a service. No first-party or vendor guide for Scaleway. |
| `openclaw` | manual | no | Scaleway documents OpenClaw only as a client of its Generative APIs; the Gateway host is a manual Docker install on DEV1-L. |
| `coding-agent` | manual | no | DEV1-L, install Claude Code/Codex. Stopped hours stop billing compute, which is the differentiator. |
| `code-interpreter` | backend | no | No execution API, and the 60-minute minimum makes 20,000 one-minute runs cost about $572. |
| `browser-agent` | manual | no | Install Chromium/Playwright; per-session machines are uneconomic at a one-hour minimum. |
| `workflow-automation` | manual | no | Docker + n8n + Postgres on an always-on DEV1-M; no Scaleway or n8n guide. |
| `chat-bot` | manual | no | DEV1-S always on; no idle timer, but a gateway connection needs an awake process. |
| `claude-code-team` | manual | no | One DEV1-L per developer, IAM-scoped keys, audit trail. |
| `scheduled-scraper` | manual | no | Cron inside a DEV1-S and results in Object Storage; per-run machines bill a full hour. |
| `mcp-server` | manual | no | Small always-on Instance with a security group; STARDUST1-S if orderable, else DEV1-S. |

**Picks.** None of the ten use-case guides: `eu-residency` is a situation, not a guide, so the recommendation lives in `situationPicks` for French-law residency with HDS. No `stay-available` pick, because Hetzner already makes the cheap always-on VPS case and Scaleway's differentiator there is the stopped-compute meter, a route-level detail. No `build-and-test` pick: the 60-minute minimum makes it the wrong tool.

## 11. Contradictions

### 11.1 Flexible IPv4: €0.004 or €0.005 an hour
- [Instances FAQ](https://www.scaleway.com/en/docs/instances/faq/): "Each Instance’s flexible IPv4 costs €0.004/hour, excl. VAT."
- [Network pricing](https://www.scaleway.com/en/pricing/network/): "Additional IP address | Instance | Type: IPv4 IP per asset - 1 IP | €0.005/hour"
- [Price update](https://www.scaleway.com/en/blog/a-transparent-update-on-scaleway-pricing/): "Zonal Flexible IPv4 | €0.004 /hour | €0.005 /hour" (effective 1 June 2026)

**Interpretation:** the FAQ is stale. The card uses €0.005/hour. Consequence: C's IPv4 line is $4.06 rather than $3.25, and the FAQ's figure understates every total by about 20%.

### 11.2 Hourly vs per-second
The two current billing pages say hourly with a 60-minute minimum; several third-party guides still say per-second. No current first-party page supports per-second. **Interpretation:** hourly floor is the documented rule. Consequence: A is $28.59 rather than about $4.80. This is the single largest uncertainty in the artefact.

### 11.3 STARDUST1-S is priced but not in the quota table
The pricing page lists it at €0.0006/hour and the zone product API returns it, but the default quota table omits it (and BASIC3). **Interpretation:** the quota table is incomplete; STARDUST is included in the card with a caveat that its orderability on a new account is unconfirmed.

### 11.4 Local storage maximum: 600 GB or 2.4 TB
The Block Storage FAQ says the maximum local storage is 600 GB (GP1-XL); the product API returns `max_size` 2,400,000,000,000 for GP1-XL's `volumes_constraint` but 600,000,000,000 in `per_volume_constraint.l_ssd`. **Interpretation:** 600 GB is the per-volume local limit the FAQ describes; the larger figure is the total volume constraint, not local SSD. The card uses 600 GB for GP1-M/L/XL.

## 12. Unknowns

- **Nested virtualisation**: not documented either way. `not-published`.
- **Hypervisor**: never named. `not-published`.
- **USD pricing**: no Scaleway-published USD list found. All USD figures are converted. `not-published`.
- **AZ price differences**: only the PAR-1 view was read. The page offers a zone selector for AMS/WAW/MIL; I did not exhaustively compare each zone. Prices for Instances are expected to be uniform, but that is an assumption, not evidence.
- **STARDUST1-S orderability** on a new account.
- **BASIC3 default quota**: absent from the quota table.
- **Savings Plans**: up to 25% discount for an hourly commitment; exact tiers not modelled.
- **Whether a 90-minute run bills 1.5 h or 2 h**: the FAQ says hourly billing with a 60-minute minimum; A/B/C are unaffected because every run is either 10 minutes or a whole number of hours.
- **Windows licensing cost**: Windows offers (POP2-WIN) are outside the card; the licence is bundled in their higher price, not modelled.

## 13. Model limitations in the card

1. **IPv4 was excluded (superseded).** In the `df4cd0c` card, `perMachine` counted only billed machine hours, so a stopped machine's reserved address would have disappeared. The proposed fix — `const perMachineHours = (h.run + h.stopped) / Math.max(1, h.machines);` plus `Math.max(h.session, (card.minimumSeconds ?? 0) / 3600)` per run in tasks mode — was applied in `06aae74`, which also added `perMachine {hourly: 0.005565, monthly: 4.0625}`. The integrating thread reports that reverting each of the three engine changes fails a Scaleway A or C test.
2. **One storage class is priced.** The card prices Block Storage 5K (€0.000130/GB/hour) on every shape, because it is the only option on BASIC3, PLAY2, PRO2 and BASIC2-A and a valid option on DEV1, GP1 and STARDUST1. `Plan.rates` can override `diskRunning` but not the stopped rate, so a card holding both block and local SSD would price stopped block volumes at the local rate, understating them by 2.65×. Pricing one class keeps every printed number valid; the local-SSD totals are shown as alternatives in §9 and `abc.md`. Expressing both needs a plan-level `rates.diskStopped`.
3. **The 60-minute minimum applied to compute only (superseded).** In `df4cd0c`, storage and IPv4 minimums were added by hand in `provider.json` and `abc.md`; `06aae74` extends `minimumSeconds` to disk and per-machine fees.
4. **No monthly cap and no Savings Plans** are modelled; neither changes A/B/C.

## 14. Quote verification

Every quote in this ledger, `provider.json`, `feature-rows.json`, `capability-rows.json` and `routes.json` — 134 quote/URL pairs across 49 pages — was re-fetched and machine-checked against the live page after the final edit. Text was lowercased, Markdown emphasis (`**`), escapes and table pipes were stripped, whitespace was collapsed, and the quote was matched as a substring. Nothing else was normalised; the stored quotes keep their original wording and typography (`’`, `–`, `€`).

The check ran through TinyFish `fetch_content` for the docs and marketing pages and through Firecrawl's rendered DOM for the four pages whose content only exists after client-side rendering: `/pricing/virtual-instances/`, `/pricing/storage/`, `/pricing/network/` and `/security-and-compliance/`. Direct `curl` was used during the research but started returning Bunny Shield's 403 challenge after roughly twenty requests, so it was not used for the final check. Four quotes failed the first pass and were corrected against the page rather than kept: the CLI sentence (the page inserts "(External link)" between clauses), the SDK sentences (the search snippets were meta descriptions, not body text), the security-group sentence ("the security group", not "your security group"), and the billing-alert sentence ("notify you", not "notify users"). Two source URLs were also corrected: the open-source quote belongs to the security and compliance page, and the per-hour uptime sentence to the Instances FAQ rather than the Billing FAQ.

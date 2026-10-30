# Amazon Lightsail — research ledger

Provider ID `lightsail`. Desk research only: no AWS account was created, no instance, credential or
billable resource was used. Repository revision at the start: `df4cd0c` (`List Hetzner's
Cost-Optimized plans as out of stock`) on `main`, working tree clean apart from this
`research/incoming/lightsail/` directory.

All pages below were read on **2026-10-30** (Asia/Kolkata). Quotes are verbatim from the live page
after removing HTML tags, Markdown link targets, `*` emphasis and backticks, collapsing whitespace,
and normalising curly quotes and dashes. Every quote in `capability-rows.json`, `feature-rows.json`
and `provider.json` was machine-matched against the fetched page text on 2026-10-30; the check is
described at the end.

---

## 1. Retrieval log

| # | Source | Method | Result |
|---|---|---|---|
| 1 | `https://aws.amazon.com/lightsail/pricing/` | TinyFish `fetch_content`, `ttl: 0` (live render), then `curl` for the raw HTML | 200, full page including bundle grids, block storage, snapshots, containers, databases, CDN, load balancer, examples |
| 2 | `https://aws.amazon.com/lightsail/faq/` | TinyFish `fetch_content`, `ttl: 0`; raw HTML saved | 200, 65k characters of FAQ |
| 3 | `https://docs.aws.amazon.com/lightsail/latest/userguide/*.md` | `curl` of the Markdown variants listed in `llms.txt` | 200 for every page used |
| 4 | `https://docs.aws.amazon.com/lightsail/latest/userguide/llms.txt` | `curl` | 200, index of the user guide |
| 5 | `https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonLightsail/current/us-east-1/index.json` | `curl` + `jq`/Python | 200, publication date 2026-09-15, 150 products, 150 OnDemand terms |
| 6 | `https://aws.amazon.com/lightsail/sla-lightsail-instances-and-block-storage/` | TinyFish + `curl` | 200, last updated 2022-05-20 |
| 7 | `https://aws.amazon.com/free/` and `https://aws.amazon.com/free/compute/lightsail/` | TinyFish + `curl` | 200. The Lightsail offer table's "Free Tier Offer Details" cell is an empty `<ul/>` on the live page |
| 8 | `https://aws.amazon.com/agreement/`, `https://aws.amazon.com/service-terms/` | `curl` | 200, both last updated 2026-10-29 |
| 9 | `https://aws.amazon.com/compliance/soc-faqs/`, `https://docs.aws.amazon.com/health/latest/ug/what-is-aws-health.md` | TinyFish / `curl` | 200 |
| 10 | `https://aws.amazon.com/iam/identity-center/`, `https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.md` | TinyFish | 200 |
| 11 | `https://aws.amazon.com/blogs/aws/the-aws-mcp-server-is-now-generally-available/` | TinyFish | 200 |
| 12 | `https://aws.amazon.com/blogs/aws-cloud-financial-management/a-quick-overview-of-aws-payment-methods/` | `curl` | 200, 2019 post |
| 13 | `https://docs.aws.amazon.com/boto3/latest/reference/services/lightsail.html`, `https://raw.githubusercontent.com/aws/aws-sdk-js-v3/main/clients/client-lightsail/README.md` | `curl` | 200 |
| 14 | `https://health.aws.amazon.com/health/status`, `https://status.aws.amazon.com/` | `curl` | 200 but JavaScript shells; used the AWS Health documentation for the quote instead |

Failures and fallbacks:

- **Guessable documentation URLs 404'd.** `understanding-billing-and-payment.html`,
  `amazon-lightsail-stopping-and-starting-instances.html`, `amazon-lightsail-configuring-static-ip.html`,
  `amazon-lightsail-creating-instance-snapshots.html`, `amazon-lightsail-quotas.html` and
  `amazon-lightsail-connect-using-browser-based-ssh.html` all redirect to the "What is Lightsail?"
  page. The guide was renamed and now publishes `.md` variants; I used its `llms.txt` index and
  `toc-contents.json` to get real slugs. Anything quoting those old URLs would be quoting the wrong
  page.
- **`https://aws.amazon.com/compliance/data-processing-addendum/` is 404.** The DPA is now
  incorporated through the Service Terms, so that is what is cited.
- **TinyFish `search` failed once with an MCP HTTP 400** when `fetch` was passed as a bare string; it
  worked without that parameter. No search result was used as evidence for a rate or verdict.
- **No cache was trusted for prices.** The pricing page was fetched with `ttl: 0`, the price list is
  the live offer file, and the monthly figures were cross-checked against the docs bundle table and
  the price list (all three agree). The billing FAQ's own worked example does not agree; see §7.

---

## 2. What the product is

| Claim | Source | Quote | Confidence |
|---|---|---|---|
| Lightsail is a VPS product with instances, containers, databases, CDN, load balancers, block storage, static IPs, DNS and snapshots | `what-is-amazon-lightsail.md` | "It includes everything you need to launch your project quickly—instances (virtual private servers), container services, managed databases, content delivery network (CDN) distributions, load balancers, SSD-based block storage, static IP addresses, DNS management of registered domains, and resource snapshots (backups)—for a low, predictable monthly price." | docs-confirmed |
| An instance is a full VM | `understanding-instances-virtual-private-servers-in-amazon-lightsail.md` | "Your Lightsail instance is a virtual private server (also called a virtual machine)." | docs-confirmed |
| AWS calls it a VPS provider and targets simple projects | `https://aws.amazon.com/lightsail/faq/` | "Amazon Lightsail is a virtual private server (VPS) provider and is the easiest way to get started with AWS for developers, small businesses, students, and other users who need a solution to build and host their applications on cloud." | docs-confirmed |
| Instances are burstable, not fixed-performance | FAQ | "Lightsail uses burstable performance instances that provide a baseline level of CPU performance with the additional ability to burst above the baseline." | docs-confirmed |
| AWS recommends EC2 for sustained high CPU | FAQ | "If you need highly configurable environments and instances with consistently high CPU performance for applications such as video encoding or HPC applications, we recommend you use Amazon EC2." | docs-confirmed |

**Interpretation:** this is a general-purpose VPS, not a sandbox or an agent product. Most capability
rows are therefore `no` or `partly` by design, not by omission. Container services, managed databases
and Lightsail for Research are separate products and are excluded from the card; they appear only
where a buyer would confuse them (GPU, stopped billing, the `$15` database trial).

---

## 3. Bundles, sizes and regions

Linux bundles **with a public IPv4 address**, from the docs table (identical to the pricing page and
to the price list's monthly ÷ 744):

| Bundle | $/month | vCPU | RAM | SSD | Transfer | $/hour (price list) |
|---|---:|---:|---:|---:|---:|---:|
| Nano-0.5GB | 5 | 2 | 0.5 GB | 20 GB | 1 TB | 0.00672 |
| Micro-1GB | 7 | 2 | 1 GB | 40 GB | 2 TB | 0.00940 |
| Small-2GB | 12 | 2 | 2 GB | 60 GB | 3 TB | 0.01612 |
| Medium-4GB | 24 | 2 | 4 GB | 80 GB | 4 TB | 0.03225 |
| Large-8GB | 44 | 2 | 8 GB | 160 GB | 5 TB | 0.05913 |
| Xlarge-16GB | 84 | 4 | 16 GB | 320 GB | 6 TB | 0.11290 |
| 2Xlarge-32GB | 164 | 8 | 32 GB | 640 GB | 7 TB | 0.22043 |
| 4Xlarge-64GB | 384 | 16 | 64 GB | 1,280 GB | 8 TB | 0.51612 |
| 8Xlarge-128GB | 884 | 32 | 128 GB | 1,280 GB | 9 TB | 1.18817 |
| 12Xlarge-192GB | 1,324 | 48 | 192 GB | 1,280 GB | 10 TB | 1.77956 |
| 16Xlarge-256GB | 1,764 | 64 | 256 GB | 1,280 GB | 10 TB | 2.37096 |
| Memory-optimised Large-16GB | 74 | 2 | 16 GB | 160 GB | 5 TB | 0.09946 |
| Memory-optimised Xlarge-32GB | 144 | 4 | 32 GB | 320 GB | 6 TB | 0.19355 |
| Memory-optimised 2Xlarge-64GB | 294 | 8 | 64 GB | 640 GB | 7 TB | 0.39516 |
| Memory-optimised 4Xlarge-128GB | 584 | 16 | 128 GB | 1,280 GB | 8 TB | 0.78495 |
| Memory-optimised 8Xlarge-256GB | 1,174 | 32 | 256 GB | 1,280 GB | 9 TB | 1.57796 |
| Memory-optimised 12Xlarge-384GB | 1,764 | 48 | 384 GB | 1,280 GB | 10 TB | 2.37097 |
| Memory-optimised 16Xlarge-512GB | 2,344 | 64 | 512 GB | 1,280 GB | 10 TB | 3.15054 |
| Compute-optimised Large-4GB | 42 | 2 | 4 GB | 160 GB | 5 TB | 0.05645 |
| Compute-optimised Xlarge-8GB | 84 | 4 | 8 GB | 320 GB | 6 TB | 0.11290 |
| Compute-optimised 2Xlarge-16GB | 168 | 8 | 16 GB | 640 GB | 7 TB | 0.22581 |
| Compute-optimised 4Xlarge-32GB | 336 | 16 | 32 GB | 1,280 GB | 8 TB | 0.45161 |
| Compute-optimised 9Xlarge-72GB | 844 | 36 | 72 GB | 1,280 GB | 9 TB | 1.13441 |
| Compute-optimised 12Xlarge-96GB | 1,126 | 48 | 96 GB | 1,280 GB | 10 TB | 1.51344 |
| Compute-optimised 18Xlarge-144GB | 1,688 | 72 | 144 GB | 1,280 GB | 10 TB | 2.26882 |

Quotes and claims:

| Claim | Source | Quote | Confidence |
|---|---|---|---|
| Bundles are fixed plans | `amazon-lightsail-bundles.md` | "Lightsail offers a variety of instance bundles (also known as instance plans) to meet different workload requirements." | docs-confirmed |
| Each bundle includes public IP addressing and the price varies by type | same | "Each bundle will include public IP addressing. It will provide either a public IPv4 address, a public IPv4 address with an IPv6 address (known as dual-stack), or just an IPv6 address (known as IPv6 only). The bundle price varies depending on whether it includes a public IPv4 address." | docs-confirmed |
| The $5/$7/$12 bundles now list 2 vCPU, older ones have 1 | pricing page footnote | "Virtual servers created on or before June 29, 2023 have 1 vCPU." | pricing-page |
| IPv6-only bundles are cheaper | pricing page | "$3.50" for Nano-0.5GB IPv6-only (bundle grid) | pricing-page |
| 19 regions, four opt-in | `understanding-regions-and-availability-zones-in-amazon-lightsail.md` | "Lightsail is available in the following Regions." (list of 19; Hong Kong, Jakarta, Malaysia and Spain marked "This Region is disabled by default.") | docs-confirmed |
| EU regions exist | same | "EU (Ireland) (eu-west-1)" | docs-confirmed |
| No in-place resize | `amazon-lightsail-right-size-instance.md` | "Lightsail does not change the plan of an existing instance in place." | docs-confirmed |
| Shrinking is limited by the disk | same | "When you create an instance from a snapshot, the disk of the new instance must be equal to or larger than the disk of the original instance." | docs-confirmed |
| 20 instances (vCPUs) per region, adjustable | AWS General Reference | "The maximum number of vCPUs per Region for Lightsail instances." (row value: 20, adjustable: Yes) | docs-confirmed |
| 5 static IPs per region, adjustable | AWS General Reference | "The maximum number of static IP addresses per region." (row value: 5, adjustable: Yes) | docs-confirmed |

**Unit note:** AWS labels memory and disk in **GB**. The card treats those numbers as GiB, the unit
the site uses throughout. The difference (4 GB vs 4 GiB is about 7%) never changes which bundle is
the smallest fit at the sizes in A/B/C, but it is an assumption, not a published identity.

**GPU:** ordinary Lightsail bundles have none. `https://aws.amazon.com/lightsail/faq/`:
"Lightsail for Research offers two types of virtual computers: non-GPU and GPU." That is a separate
product with its own bundles and a different stopped rate; the `gpu` row is `partly` for that reason.

---

## 4. Billing: hourly, capped, and not free when stopped

| Claim | Source | Quote | Confidence |
|---|---|---|---|
| Hourly, capped at monthly | `amazon-lightsail-bundles.md` | "Bundles are billed on an on-demand hourly rate, so you pay only for what you use." | docs-confirmed |
| The cap is the monthly price | Billing FAQ | "For every Lightsail plan you use, we charge you the fixed hourly price, up to the maximum monthly plan cost." | docs-confirmed |
| Stopped still bills | Billing FAQ | "Lightsail instances and managed databases incur charges until they are deleted." / "These resources accrue charges even when they are in the stopped state." | docs-confirmed |
| Deleting ends the charge | `delete-an-amazon-lightsail-instance.md` | "You stop incurring charges for the instance as soon as it’s deleted." | docs-confirmed |
| Hourly rate = monthly ÷ 744 | Price list + pricing page | Price list: "$0.03225 / Hour of 4GB bundle Instance including public IPv4"; pricing page: "$24 USD/mo" for 4 GB. 24 ÷ 744 = 0.032258… | pricing-page |
| No plan fee | FAQ | "Lightsail plans are billed on an on-demand hourly rate, so you pay only for what you use." | docs-confirmed |
| Static IP free while attached, $0.005/h detached | Billing FAQ | "we charge a small $0.005 USD/hour fee for static IPs not attached to an instance for more than 1 hour." | docs-confirmed |
| Static IPs cannot go on IPv6-only instances | Billing FAQ | "Static IPs cannot be attached to IPv6-only instances." | docs-confirmed |
| Block storage $0.10/GB-month | pricing page | "Block storage starts at 8 GB and costs $0.10 USD per allocated GB per month." | pricing-page |
| Snapshots $0.05/GB-month | pricing page | "$0.05 USD GB/mo" (instance and disk snapshots section) | pricing-page |
| Load balancer $18/month, certificates free with it | Billing FAQ | "Lightsail certificates and certificate management are free with use of a Lightsail load balancer." | docs-confirmed |

**Derivation of the card's hourly rates.** AWS's price list gives one hourly dimension per bundle.
Dividing each published monthly price by 744 reproduces the price-list rate to five decimals for all
25 bundles (checked in the table above), so the card stores the price-list rate and the monthly price
as `Shape.monthly`. A 730-hour month therefore bills slightly under the monthly price, and the cap
binds only in a 31-day month. That is AWS's arithmetic, not a rounding choice of ours.

**The per-run question.** Nothing on the pricing page, the billing FAQ or the bundle docs says how a
partial hour is billed. The FAQ's only worked example uses whole hours: "if you use the least
expensive Lightsail instance plan for 100 hours in a month, you will be charged 46 cents
(100\*0.0046)". The card therefore bills pro-rata hours and flags the alternative. If AWS rounds up,
A is $32.25 rather than $5.38. This is the single largest uncertainty in the profile.

---

## 5. Lifecycle, snapshots and storage

| Claim | Source | Quote | Confidence |
|---|---|---|---|
| Stop powers down; start boots again | FAQ | "When you stop your instance, it is powered down at its current state and is available for you to start again at any time." | docs-confirmed |
| Stopping releases the public IPv4 unless static | FAQ | "Stopping your instance will release its public IP, so it is recommended that you use static IPs for instances that must retain the same IP after they stop." | docs-confirmed |
| Instance states are Pending → Running | start/stop doc | "When Amazon Lightsail creates your instance, your machine goes into a Pending state before it starts Running." | docs-confirmed |
| Booting takes minutes | FAQ | "Once you choose Create, your new instance will spin up automatically within minutes." | docs-confirmed |
| Snapshots are disk point-in-time | `understanding-snapshots-in-amazon-lightsail.md` | "A snapshot contains all of the data that is needed to restore your resource (from the moment when the snapshot was taken)." | docs-confirmed |
| Manual snapshots kept indefinitely | same | "Manual snapshots are stored indefinitely until you delete them." | docs-confirmed |
| Automatic snapshots keep seven | same | "The latest seven daily automatic snapshots are stored before the oldest one is replaced with the newest one." | docs-confirmed |
| Automatic snapshots die with the instance | same | "All automatic snapshots associated with a resource are deleted when you delete the source resource." | docs-confirmed |
| Restore only to same or larger plan | same | "Use snapshots to create new Lightsail resources using the same plan, or larger plan, than the original resource." | docs-confirmed |
| No memory snapshot; stop before snapshotting | FAQ | "We recommend stopping your instance temporarily when taking a snapshot, to ensure your data is complete and not corrupted in any way." | docs-confirmed |
| Extra disks persist separately | `elastic-block-storage-and-ssd-disks-in-amazon-lightsail.md` | "You can also add more storage to your virtual private server by creating additional block storage disks." | docs-confirmed |
| Disk size limits | same | "16 TB per disk maximum, or 8 GB per disk minimum." | docs-confirmed |
| 15 disks per instance, 20,000 GB per region | same + AWS General Reference | "Each instance can have up to 15 attached disks, and 1 boot volume disk." / "The maximum amount of attached block storage disk space (in GB) per region." (row value: 20,000) | docs-confirmed |
| A disk attaches to one instance | API reference | "Attaches a block storage disk to a running or stopped Lightsail instance and exposes it to the instance with the specified disk name." | inferred |
| Buckets are S3-based but not mountable | `buckets-in-amazon-lightsail.md` | "It is designed to make web-scale computing easier for developers, and is built using the Amazon Simple Storage Service (Amazon S3)." | inferred |

---

## 6. Access, network and domains

| Claim | Source | Quote | Confidence |
|---|---|---|---|
| Public IP reachable from the internet | FAQ | "You can use the public IP to connect to your instance from the Internet, such as through a registered domain name or through an SSH or RDP connection from your local computer." | docs-confirmed |
| Firewall is inbound only | firewall doc | "they don't control the traffic that flows out of it—the firewalls allow all outbound traffic." | docs-confirmed |
| Firewall rules can be restricted by source IP | same | "you can choose to restrict a firewall rule to an IPv4 or IPv6 address or range of IP addresses." | docs-confirmed |
| Any TCP port can be opened | firewall rules reference | "A database instance needs rules that allow access for the type of database, such as access over port 3306 for MySQL." | docs-confirmed |
| SMTP works but needs reverse DNS | firewall doc | "To enable SMTP on your instance, you must also configure reverse DNS for your instance. Otherwise, your email might be limited over TCP port 25." | docs-confirmed |
| Browser SSH and RDP | FAQ | "Lightsail offers a 1-click secure connection to your instance's terminal right from your browser, supporting SSH access for Linux/Unix-based instances and RDP access for Windows-based instances." | docs-confirmed |
| Default SSH key per region | `understanding-ssh-in-amazon-lightsail.md` | "In Lightsail, as soon as you create an instance in an AWS Region, we create a Default SSH key in that Region." | docs-confirmed |
| Files move by SFTP | SFTP doc | "You can transfer files between your local computer and your Linux or Unix instance in Amazon Lightsail by connecting to your instance using SFTP (SSH File Transfer Protocol)." | docs-confirmed |
| Transfer allowance 1-10 TB, halved in six regions | data transfer doc | "Every Lightsail instance plan includes a data transfer allowance." / "Plans in the Mumbai, Sydney, Jakarta, Malaysia, Hong Kong and São Paulo Regions include half the data transfer allowances of other Regions." | docs-confirmed |
| Overage $0.09-$0.17/GB by region | data transfer doc | "US East (N. Virginia) (us-east-1): $0.09 USD/GB" … "Asia Pacific (Sydney) (ap-southeast-2): $0.17 USD/GB" | docs-confirmed |
| Six free DNS zones | `understanding-dns-in-amazon-lightsail.md` | "You can create up to six DNS zones in Lightsail." | docs-confirmed |
| No managed certificate on a bare instance | Billing FAQ | "Lightsail certificates and certificate management are free with use of a Lightsail load balancer." | docs-confirmed |
| No outbound allowlist or no-internet mode | firewall doc | "the firewalls allow all outbound traffic." | docs-confirmed |

---

## 7. Contradictions

### 7.1 The billing FAQ's worked example uses a rate that does not exist

- Billing FAQ: "The least expensive Lightsail plan starts at $0.0067 USD/hour ($5 USD/month)." Then:
  "For example, if you use the least expensive Lightsail instance plan for 100 hours in a month, you
  will be charged 46 cents (100*0.0046)."
- The price list for us-east-1: "$0.00672 / Hour of 0.5GB bundle Instance including public IP" and
  "$0.00470 / Hour of 0.5GB IPv6 bundle Instance".
- The main FAQ says: "The least expensive Lightsail plan starts at $0.0047 USD/hour ($3.50 USD/month)."

**Reading:** $0.0046 is a stale rate from an older $3.50 ÷ 750 arithmetic. The current price list is
authoritative and internally consistent with the monthly prices (÷ 744). The profile uses $0.00672
for the $5 bundle and $0.00470 for the IPv6-only bundle, and does not repeat the 46-cent example.

### 7.2 Two answers to "what does the cheapest plan cost"

The billing FAQ says $5/$0.0067; the main FAQ says $3.50/$0.0047. Both are right for different
products: $5 is the cheapest bundle **with a public IPv4 address**, $3.50 the cheapest **IPv6-only**
bundle. The card prices the public-IPv4 line because an agent that needs to be reached, or to reach
services that are IPv4-only, cannot use an IPv6-only instance. This is a scope difference, not an
error, but it is the kind of difference a reader will trip over.

### 7.3 Lightsail vs Lightsail for Research on stopped billing

Billing FAQ: ordinary Lightsail resources "accrue charges even when they are in the stopped state".
The same page: "Lightsail for Research instances accrue full hourly charges only while running. All
Lightsail for Research instances cost $0.00685 USD/hr while stopped." The two products share a name
and a console family but not a billing model. The profile's `cheap-pause: no` is about ordinary
instances only.

### 7.4 Documentation URLs have moved

The old `amazon-lightsail-*` guide slugs now redirect to "What is Lightsail?". A page can return
HTTP 200 and still be the wrong document, which is why every docs URL used here was checked by title
and content, not status code.

---

## 8. Unknowns and searched-but-unanswered questions

1. **Partial-hour rounding.** Not published. Card assumes pro-rata. Affects A only ($5.38 vs $32.25).
   Searched the pricing page, billing FAQ, bundle docs, price list and general web; no first-party
   statement.
2. **Nested virtualisation.** No page documents it, and the instance docs never mention a
   virtualisation flag. Marked `not-published`, not `no`.
3. **Custom image import.** The documented image sources are AWS blueprints and Lightsail snapshots.
   No import path (AMI, qcow2, ISO) is documented. Marked `partly` with an inferred shortfall.
4. **Lightsail's hypervisor.** Never named. Irrelevant to price but relevant to isolation claims; the
   profile says "full VM" without naming KVM or Nitro.
5. **Free-tier amount specific to Lightsail.** The Free Tier page's Lightsail row has an empty offer
   cell, and the Lightsail billing FAQ only says "up to $200 USD in free AWS credits". No Lightsail
   hours allowance is published. Recorded as credits, not an ongoing free tier.
6. **Whether the 20-instance quota counts instances or vCPUs.** The AWS General Reference row is
   titled "Instances", gives 20, and describes it as "The maximum number of vCPUs per Region". Both
   readings are recorded; it does not affect A/B/C because the runs are sequential.
7. **Memory usage metrics.** "Lightsail doesn't report memory usage as an instance metric." Relevant
   to sizing advice, not to price.

---

## 9. A/B/C

Worked in full in `abc.md`. Summary:

| Case | Shape | Hours | Hand-worked | Engine (`price()`) |
|---|---|---|---:|---:|
| A | Medium-4GB, 2 vCPU / 4 GiB / 80 GiB | 166.67 running | $5.38 | $5.38 |
| B | Xlarge-16GB, 4 vCPU / 16 GiB / 320 GiB | 730 running | $82.42 | $82.42 |
| C | Medium-4GB, 2 vCPU / 4 GiB / 80 GiB | 90 running + 640 stopped | $23.54 | $23.54 |

- A is pro-rata hours. The whole-hour alternative is $32.25 and is flagged, not modelled.
- B does not reach the $84 cap at 730 hours; the hourly rate is monthly ÷ 744.
- C pays the full 730 hours because a stopped instance bills at the running rate.
- Disk is included in every bundle; no volume is needed for A, B or C.

---

## 10. Use-case dispositions

No picks are proposed. The always-on, fixed-address, flat-price VPS case is already made by cheaper
or better-supported listings (Hetzner, DigitalOcean, Runtime), and Lightsail adds no agent template
that would change a recommendation.

| Use case | Tier | Disposition |
|---|---|---|
| `hermes-agent` | manual | Install Hermes on Ubuntu yourself; $12-$24/month. No one-click count changes. |
| `openclaw` | manual | Install and harden yourself; DigitalOcean's $12 hardened image is cheaper and does the hardening. |
| `coding-agent` | manual | 4 vCPU starts at $84/month; dear for a VPS, no pick. |
| `code-interpreter` | none | No per-run sandbox API, minutes to boot, hourly billing. Not a fit. |
| `browser-agent` | manual | Headless Chromium works; no desktop stream except Windows RDP. |
| `workflow-automation` | manual | Docker n8n on a $24 bundle; picks already cover this case. |
| `chat-bot` | manual | $12 for 2 vCPU / 2 GB is genuinely cheap; route row, no pick. |
| `claude-code-team` | manual | $84 per developer per month, $420 for five; no pick. |
| `scheduled-scraper` | manual | Cron inside an always-billed instance; the workload's point is paying per run, so a warning. |
| `mcp-server` | manual | $7 for 2 vCPU / 1 GB; a dollar more than the DigitalOcean pick, same advantages. |

Situation picks (`situations.json`) were reviewed: nothing here is strong enough to displace an
existing pick. Lightsail's distinguishing facts (cheapest public-IPv4 bundle, 1-10 TB egress, 19
regions, IAM/SOC/DPA) are already represented by other VPS listings or are not situation criteria.

---

## 11. Coverage of features and capabilities

- **Features (16):** one row each in `feature-rows.json`; `docs.json` links a real page for all 16.
- **Capabilities (78):** one row each in `capability-rows.json`, every one with a source, and a
  plain-language shortfall for each of the 5 `partly` rows (`custom-image`, `gpu`, `auto-https`,
  `mcp-server`, `desktop`). Feature rows have no shortfall field, so their catches live in `note`.
- **Verdict distribution:** 40 `yes`, 5 `partly`, 32 `no`, 1 `not-published` (`nested-virt`). Every
  `no` is either an explicit negative in the docs or an inference from a page that would document
  the feature if it existed; the note says which.
- **Not published rather than no:** nested virtualisation, because AWS neither offers nor refuses it
  in writing.

---

## 12. Company and compliance

| Claim | Source | Quote | Confidence |
|---|---|---|---|
| AWS contracting party depends on account country | Customer Agreement | "If you have not provided AWS with location information to determine your Account Country, your AWS Contracting Party is Amazon Web Services, Inc." | docs-confirmed |
| 99.5% per-instance SLA, 99.99% region-level, credits | SLA | "AWS will use commercially reasonable efforts to make the Single Lightsail Instance available with an Instance-Level Uptime Percentage, as shown in the table below during any monthly billing cycle" | docs-confirmed |
| SOC 1/2/3 | SOC FAQ | "AWS SOC 2 Security, Availability, Confidentiality, & Privacy Report available to AWS customers from AWS Artifact." | docs-confirmed |
| DPA | Service Terms | "These Service Terms incorporate the AWS Data Processing Addendum (“DPA”), when you use AWS Services to process Customer Data (as defined in the DPA)." | docs-confirmed |
| Status page | AWS Health docs | "All customers can use the AWS Health Dashboard, powered by the AWS Health API. The dashboard requires no setup, and it's ready to use for authenticated AWS users." | docs-confirmed |
| IAM for teams | IAM user doc | "you can create one or more IAM users in your AWS account, and those users can be configured with different levels of access to services offered by AWS." | docs-confirmed |
| SSO | IAM Identity Center | "Give your workforce single sign-on access and a consistent experience across AWS services." | docs-confirmed |
| CloudTrail audit | CloudTrail doc | "CloudTrail captures all API calls for Lightsail as events." | docs-confirmed |
| Budgets alert, not a hard cap | Budgets doc | "You can choose to be alerted for both actual (after accruing) and forecasted (before accruing) spends." | docs-confirmed |
| Card required at sign-up | AWS blog (2019) | "AWS sign-up requires that you have a valid credit card on file." | docs-confirmed |

**Note on the SLA:** "commercially reasonable efforts" is weaker than a guarantee, and the credits
start below 99.5% per instance. The profile says 99.5% but does not call it a guarantee.

**Note on the card requirement:** the only first-party statement found is a 2019 AWS blog post. The
current Free Tier page says a Free plan incurs no charges, but it does not say an account can be
opened without a payment method, and the sign-up flow still asks for one. Recorded as `no` with that
caveat in the row note.

---

## 13. Dashboard and non-coder experience

- Creating an instance is a console form: image, bundle, region, name, key pair. No terminal needed.
- The browser SSH button opens a terminal in the page; RDP does the same for Windows.
- Everything after that is terminal work: installing an agent, Docker, Caddy, or a bot runtime.
- The console also covers static IPs, firewalls, disks, snapshots, DNS zones, metrics and alarms.
- The first-run experience is AWS account creation, which is heavier than a typical VPS sign-up
  (payment method, identity verification, and a console with hundreds of other services).
- Support is AWS Support; the free/basic tier is documentation and community, not a Lightsail chat.

---

## 14. Quote verification method

Every `source.quote` in `capability-rows.json`, `feature-rows.json` and `provider.json` was checked
mechanically on 2026-10-30 against the fetched pages stored during this session:

1. Fetch each cited URL (Markdown variant for docs, raw HTML for AWS marketing pages, JSON for the
   price list).
2. Normalise both sides: strip HTML tags, replace Markdown links `[text](url)` with `text`, remove
   `*` and backticks and stray backslashes, unescape HTML entities, convert curly quotes and dashes
   to ASCII, collapse whitespace, and remove spaces before punctuation.
3. Require the normalised quote to be a contiguous substring of the normalised page.

Result: **78/78 capability quotes, 16/16 feature quotes and every provider company quote matched**,
with zero unmatched. Two initial misses were real problems, not checker noise: a status-page quote
that only existed in a JavaScript-rendered dashboard, and an SFTP quote taken from a search-result
description rather than the page. Both were replaced with sentences from the actual documents.

This is a presence check, not a meaning check. Each quote was also read in context: the shortfall
sentences, the "no" verdicts and the billing arithmetic were written from the surrounding text, not
from the matched substring alone.

---

## 15. Integration notes for the parent thread

Nothing outside `research/incoming/lightsail/` was edited, committed or pushed.

- **Provider files:** copy `provider.json` to `site/src/data/providers/lightsail.json` and
  `pricing.json` to `site/src/data/pricing/lightsail.json`. Both already carry `kind: "vps"` and the
  rate-card date separately from the profile date.
- **Comparison label:** add `lightsail: "VPS: full VM"` to the manual `kinds` map in
  `site/src/pages/compare/side-by-side.astro`, alongside the other VPS entries.
- **Counts:** this is a 17th provider. Every feature and capability gains one row, so the capability
  matrix goes from 78 rows × 16 providers to 78 × 17. Any prose that says "16 providers" (README,
  `site/src/data/site.json`, page copy, search descriptions) needs recounting; the skill's audit
  script derives the numbers rather than hard-coding them.
- **One-click counts:** no use-case standfirst needs changing. Lightsail adds no one-click or
  preinstalled agent route, so sentences such as "three providers offer it in one click" stay true.
- **Picks:** none proposed. `situations.json` needs no change; the distinguishing facts are already
  represented by other VPS listings.
- **changes.json:** add one entry dated 2026-10-30 (the guide's observation date, not an AWS launch
  date) describing the new listing, sourced to the pricing page and the billing FAQ. Do not invent a
  product-announcement date.
- **Price baseline:** the pricing page carries currency figures, so `npm run check-rates` will report
  it as `NEW`. Review the extracted figures against §3, then add the baseline entry; do not hand-edit
  `price-baseline.json`. The docs bundle table and the price-list JSON also contain figures and may
  appear as new sources.
- **cost.test.ts:** add Lightsail to the `handWorked` fixtures with A $5.38, B $82.42 and C $23.54,
  derived from §9 above, not from `price()`. The A fixture should carry a comment that it assumes
  pro-rata hours and that AWS does not publish the rounding rule.
- **Docs:** merge `docs.json` into `site/src/data/docs.json` under the `lightsail` key; all 16 URLs
  were checked for 200 and the intended title on 2026-10-30.

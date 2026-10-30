# Hetzner Cloud — research ledger (provider id `hetzner`)

Target: **https://www.hetzner.com/cloud/** (docs: **https://docs.hetzner.com/cloud/**).
Repository revision at start: `911a347` (`origin/main`), clean worktree.
Research date: **2026-10-29**. Desk research only: no account was created, no server ordered,
started or billed. Prices were read fresh from live pages and from Hetzner's own website price API;
no cached scrape was used for money.

**Tag legend**

| Tag | Meaning |
|---|---|
| `docs-confirmed` | Stated on a docs.hetzner.com page (or an official Hetzner legal/security page). |
| `pricing-page` | Stated on a page whose subject is money, or returned by Hetzner's own price API. |
| `third-party` | Not from Hetzner: an agent vendor's docs (OpenClaw, n8n), a community repo, a blog. |
| `inferred` | My reading of documented behaviour or of a complete published API, not a sentence Hetzner writes. |
| `not-published` | Hetzner does not say; no answer found. |

A tag applies to the sentence or row it sits on; the quote immediately below it is the evidence.

## 0. How the evidence was collected

| Method | What it was used for | Notes |
|---|---|---|
| Firecrawl `firecrawl_scrape` (`maxAge: 0`, live) | Marketing and plan pages: `/cloud/`, `/cloud/regular-performance/`, `/cloud/general-purpose/`, `/cloud/cost-optimized/`, `/cloud/block-storage`, `/storage/object-storage/`, `/dns/`, `/cloud/load-balancer/`, `/unternehmen/ueber-uns/`, `/legal/legal-notice/` | Fresh fetch, `statusCode: 200`, page title checked. One call reported `creditsUsed: 1`. |
| Exa `web_search_exa` | Finding the snapshot/backup/IP rate pages, payment methods, certifications, agent-vendor guides | ~16 searches. |
| Exa `web_fetch_exa` | OpenClaw's Hetzner page, n8n's Hetzner guide, and the `/cloud/?country=us` variant that a search index returned | The first two are `third-party`. The third could not be reproduced on a fresh fetch (see §11e), so no price is quoted from it. |
| Firecrawl `firecrawl_map` | Enumerating docs.hetzner.com/cloud URLs | Used to find pages, not as evidence. |
| Direct `curl` of docs.hetzner.com pages | Full text of ~30 docs pages, saved and grepped | The docs site server-renders its article text; each page reports its own "Last change" date. |
| `curl` of `https://docs.hetzner.cloud/cloud.spec.json` | The official OpenAPI 3.1 specification (3.5 MB) | Used for the resize precondition and for proving which API surfaces do **not** exist. |
| `curl` of `https://website-price-api.hetzner.com/api/v1/products/<id>` | USD **and** EUR monthly/hourly prices per data centre | This is the API the pricing page's own `ho-price-container` web component calls (found in `webcomponents.js`). Live, 200, first-party. |
| `agent-browser` (Chromium) | Screenshots of the Regular Performance and Cost-Optimized pricing tables to confirm availability badges | Artifacts: `.amp/in/artifacts/hz-regular-table.png`, `.amp/in/artifacts/hz-cost.png`. |

**Paid-tool spend.** Only Firecrawl and Exa were used. Firecrawl: about 10 scrapes (1–2 credits each).
Exa: about 16 searches and 3 page fetches. TinyFish, Context, Tavily and Parallel were not used.
Estimated total well under **US$1**.

**Price freshness.** The plan pages render a server-side EUR fallback and then re-render client-side from
`website-price-api.hetzner.com`. I read both: the page text (EUR, includes one Primary IPv4) and the API
(EUR and USD, server only). The two agree once the €0.50/$0.60 IPv4 is added, which is the check that the
API response is the one the page is showing.

---

## 1. What it is

Hetzner Cloud sells **fixed-size virtual machines** with a **monthly price cap and an hourly rate**.
It is a general-purpose VPS product, not a sandbox API: there is no prompt endpoint, no snapshot-with-memory,
no idle sleep and no per-second billing. `docs-confirmed`

> "Cloud servers are virtual machines that run on physical servers and are used to run an operating system and computer programs." — [Servers overview](https://docs.hetzner.com/cloud/servers/overview)

> "Servers have both a monthly price cap and a price per hour. Your server's bill will never exceed its monthly price cap." — [Billing FAQ](https://docs.hetzner.com/cloud/billing/faq)

**Four plan families, three resource classes.** `docs-confirmed`

| Family | Class | vCPU | Notes |
|---|---|---|---|
| Cost-Optimized (CX / CAX) | Shared, older hardware | 2–16 | **Shown as "not available" today** (see §11) |
| Regular Performance (CPX) | Shared, current hardware | 1–16 | The buyable default today |
| General Purpose (CCX) | Dedicated vCPU | 2–48 | "one vCPU equals one thread of a physical CPU core" |
| (AMD / Arm variants) | Shared | — | CAX = Ampere Arm; CX = Intel or AMD, not choosable |

> "In plans (CX, CPX, CAX) with shared resources the compute resources are distributed among all instances on the same physical server." — [Servers FAQ](https://docs.hetzner.com/cloud/servers/faq)

> "Plans (CCX) with dedicated resources have their CPU resources exclusively. Here one vCPU equals one thread of a physical CPU core." — [Servers FAQ](https://docs.hetzner.com/cloud/servers/faq)

> "CX plans can run on either Intel® or AMD. You can not choose the CPU type yourself." — [Servers FAQ](https://docs.hetzner.com/cloud/servers/faq)

**Who it is for.** People who want an ordinary always-on Linux server at a low monthly price, in the EU or
in three other regions, and who are willing to run the operating system themselves. For this guide's
audience — readers running Hermes, OpenClaw, n8n, a chat bot, Claude Code or an MCP server on a VPS — it is
the reference "plain VPS" the other providers are being compared against.

**Who it is not for.** Anyone whose workload starts and stops many times a day: Hetzner bills a powered-off
server exactly like a running one, rounds every server's usage up to a whole hour, and has no pause. That
is the opposite of a sandbox.

---

## 2. Isolation and what the machine allows

| Item | Status | Evidence |
|---|---|---|
| Separate VM per server | Yes | "Cloud servers are virtual machines that run on physical servers" ([Servers overview](https://docs.hetzner.com/cloud/servers/overview)) |
| Root | Yes | Root password mailed on creation, or SSH key; rescue system and root-password reset exist ([Connecting to your server](https://docs.hetzner.com/cloud/servers/getting-started/connecting-to-the-server), [Servers FAQ](https://docs.hetzner.com/cloud/servers/faq)) |
| Docker inside | Yes | Docker CE is a one-click app; you also have root and an ordinary kernel ([Apps](https://docs.hetzner.com/cloud/apps/overview)) |
| Nested virtualisation | **No** | "Can I run virtual machines on cloud servers, or rather is nested virtualization possible? No, this is not possible on cloud server." ([Servers FAQ](https://docs.hetzner.com/cloud/servers/faq)) |
| Own image | Partly | You can attach a custom ISO, or turn a configured server into a Snapshot and boot new servers from it. There is no Dockerfile/OCI-image import. ([Creating a server](https://docs.hetzner.com/cloud/servers/getting-started/creating-a-server), [Backups/Snapshots](https://docs.hetzner.com/cloud/servers/backups-snapshots/overview)) |
| GPU | No | The Cloud plan matrix offers only CPU families; GPU servers are sold on Hetzner's separate Dedicated line ("GPU-Line Maximum workloads & ai"). `inferred` from the plan chooser at [hetzner.com/cloud](https://www.hetzner.com/cloud/) and the nav on [hetzner.com](https://www.hetzner.com/) |
| Hypervisor named | Not published | Hetzner describes "hypervisors" and "physical servers" but does not name KVM/Firecracker on the Cloud docs. `not-published` |

> "For best performance, hypervisors are used to distribute usage rights of CPU resources among several virtual servers" — [Servers overview](https://docs.hetzner.com/cloud/servers/overview)

Live migration is a real behaviour worth knowing for an always-on agent: a failing host triggers a
migration with "usually ... a disruption of less than 1 second". `docs-confirmed`

> "On your cloud server, live migration usually causes a disruption of less than 1 second." — [Terminology](https://docs.hetzner.com/cloud/servers/technical-concepts/terminology)

> "In some rare cases, a server may be automatically powered on after a live migration." — [Servers FAQ](https://docs.hetzner.com/cloud/servers/faq)

---

## 3. Sizes, regions and hardware

**Six locations, four network zones.** `docs-confirmed`

> "There are currently four network zones and six locations:" — [Locations](https://docs.hetzner.com/cloud/general/locations)

The table under that sentence lists eu-central (DE Falkenstein `fsn1`, DE Nuremberg `nbg1`, FI Helsinki
`hel1`), us-east (US Ashburn, VA `ash`), us-west (US Hillsboro, OR `hil`) and ap-southeast (SG Singapore `sin`).

**Prices differ by zone.** `docs-confirmed`

> "Prices are the same for all locations in the network zone eu-central . We charge different prices for the network zones us-east , us-west , and ap-southeast ." — [Locations](https://docs.hetzner.com/cloud/general/locations)

**No custom sizes.** `docs-confirmed`

> "Customized virtual servers are not currently available. However, you can mount additional disks, called Volumes, which are flexible block storage drives with up to 10 TB storage. And you can add RAM and CPU resources with the Rescale feature." — [Technical details FAQ](https://docs.hetzner.com/cloud/technical-details/faq)

**Resize is not live.** `docs-confirmed` (from the official OpenAPI specification)

> "Server must be powered off for this command to succeed." — [`POST /servers/{id}/actions/change_type`, cloud.spec.json](https://docs.hetzner.cloud/cloud.spec.json)

> "No, you can only rescale to server plans with a disk size equal to or larger than the current disk of your server." — [Servers FAQ](https://docs.hetzner.com/cloud/servers/faq)

**Current EU Regular Performance (CPX) plans**, page prices in EUR incl. one Primary IPv4, server-only
prices in EUR and USD from Hetzner's price API. `pricing-page`

| Plan | vCPU (AMD) | RAM | Disk | EUR/mo server | +IPv4 | USD/mo server | USD/h server |
|---|---:|---:|---:|---:|---:|---:|---:|
| CPX02 | 1 | 1 GB | 20 GB NVMe | €5.99 | €6.49 | $7.49 | $0.0120 |
| CPX12 | 1 | 2 GB | 40 GB NVMe | €11.49 | €11.99 | $13.49 | $0.0216 |
| CPX22 | 2 | 4 GB | 80 GB NVMe | €19.49 | €19.99 | $22.99 | $0.0368 |
| CPX32 | 4 | 8 GB | 160 GB NVMe | €35.49 | €35.99 | $41.99 | $0.0673 |
| CPX42 | 8 | 16 GB | 320 GB NVMe | €69.49 | €69.99 | $81.99 | $0.1314 |
| CPX52 | 12 | 24 GB | 480 GB NVMe | €100.49 | €100.99 | $118.99 | $0.1907 |
| CPX62 | 16 | 32 GB | 640 GB NVMe | €129.99 | €130.49 | $152.99 | $0.2452 |

Evidence: plan cards on [Regular Performance](https://www.hetzner.com/cloud/regular-performance/) (e.g.
"CPX22 … 2 AMD … 4 GB … 80 GB NVMe … € 19.99 per month, excl. VAT", and the `visually-hidden` string
"€ 19.99 per month, excl. VAT" on the card whose `product-key` is `CLOUD_124+CLOUD_21`), and
`https://website-price-api.hetzner.com/api/v1/products/CLOUD_124` → EUR 19.49 / USD 22.99 monthly,
USD 0.0368 hourly at FSN1/NBG1/HEL1.

**US Regular Performance plans** are a different, older set, priced higher. `pricing-page`

| Plan | vCPU | RAM | Disk | EUR/mo (+IPv4) | USD/mo server | USD/h |
|---|---:|---:|---:|---:|---:|---:|
| CPX11 | 2 | 2 GB | 40 GB | €17.99 | $20.49 | $0.0328 |
| CPX21 | 3 | 4 GB | 80 GB | €32.49 | $37.49 | $0.0601 |
| CPX31 | 4 | 8 GB | 160 GB | €62.99 | $73.49 | $0.1178 |
| CPX41 | 8 | 16 GB | 240 GB | €120.99 | $141.49 | $0.2267 |
| CPX51 | 16 | 32 GB | 360 GB | €238.49 | $279.49 | $0.4479 |

**Singapore** carries the same CPX names at higher prices: CPX22 at €26.99 on the page including the IPv4
(€26.49 / $30.99 server-only from the API) and $0.0497/h; CPX62 $202.99/mo. Dedicated (CCX) runs 2→48 vCPU,
8→192 GB, 80→960 GB NVMe; CCX63 in the EU is $1,006.99/mo and $1.6138/h. All from the same price API and
plan pages.

**Largest shapes:** shared 16 vCPU / 32 GB / 640 GB (CPX62); dedicated 48 vCPU / 192 GB / 960 GB (CCX63).
Additional storage to 10 TB per volume, 16 volumes per server. `pricing-page` / `docs-confirmed`

**Boot time.** No sub-second claim; the marketing line is seconds. `docs-confirmed`

> "order your new server conveniently in the Hetzner Console and start using it in seconds" — [Cloud](https://www.hetzner.com/cloud/)

**Availability is genuinely dynamic, and today the cheap family is out.** `docs-confirmed`

> "Please note: Cloud instances may occasionally be unavailable for ordering" — [Locations](https://docs.hetzner.com/cloud/general/locations)

> "This product is currently unavailable. Please check back later." — tooltip text present in the HTML of every plan card on [Regular Performance](https://www.hetzner.com/cloud/regular-performance/); it is a hidden template, so it is **not** evidence on its own (see §11).

> "The availability of a server plan is checked and updated about every 15 minutes." — [Servers FAQ](https://docs.hetzner.com/cloud/servers/faq)

---

## 4. Lifecycle: stop, pause, sleep

**There is no pause and no sleep. "Off" still bills.** `docs-confirmed`

> "Do you bill servers that are off? Yes, you pay for a server that has completed the creation process for as long as it exists, regardless of whether it is turned on or not. We will bill you for your servers until you delete them, independent of their state." — [Billing FAQ](https://docs.hetzner.com/cloud/billing/faq)

> "This is because we allocate full resources to servers, regardless of their power state. This enables rapid startup and boot times for you." — [Billing FAQ](https://docs.hetzner.com/cloud/billing/faq)

> "We will bill you for all servers that have finished the creation process, including servers that are powered off. If you want to stop paying for a cloud product, you need to delete it. If it still exists, we will still bill you for it." — [Locations](https://docs.hetzner.com/cloud/general/locations)

The documented workaround for a long idle period is snapshot-and-delete, which loses memory, the IP and
the running processes:

> "If you are planning to switch off a server for an extended period of time, consider taking a Snapshot of the server and deleting it, then recreating it from the Snapshot at a later point. Although server Snapshots aren't free, they might be a cheaper alternative than leaving servers switched off." — [Billing FAQ](https://docs.hetzner.com/cloud/billing/faq)

**No idle timer, no session limit, no wake path.** There is no auto-stop, auto-sleep or wake-on-request
setting anywhere in the create-server options, the API or the docs. `inferred`, resting on the complete
create-server option list ([Creating a server](https://docs.hetzner.com/cloud/servers/getting-started/creating-a-server))
and the full API path list ([cloud.spec.json](https://docs.hetzner.cloud/cloud.spec.json)).

> "If a server is not needed and should remain powered off permanently, it is recommended to delete it." — [Servers FAQ](https://docs.hetzner.com/cloud/servers/faq)

**Deletion protection** exists for servers, snapshots and Floating IPs. `docs-confirmed`

> "Servers, Snapshots and Floating IPs can be protected in the Hetzner Console and API." — [Servers FAQ](https://docs.hetzner.com/cloud/servers/faq)

---

## 5. Storage: disk, volumes, object storage

**The primary disk is bound to the plan** and cannot shrink. `docs-confirmed`

> "Cloud servers primary disks are bound to their respective plan. In order to increase the primary disk, you have to Rescale the server." — [Servers FAQ](https://docs.hetzner.com/cloud/servers/faq)

**Volumes** are the separate-disk product. `docs-confirmed` / `pricing-page`

> "Volumes are used to expand storage capacity of cloud servers." — [Volumes](https://docs.hetzner.com/cloud/volumes/overview)

> "Volumes can be easily scaled up to 10 TB at any time." — [Block Storage](https://www.hetzner.com/cloud/block-storage)

> "Expand your cloud instance with high-availability SSD block storage for € 0.044, excl. VAT GB / per month." — [Block Storage](https://www.hetzner.com/cloud/block-storage)

**A volume is single-attach.** `docs-confirmed`

> "You can mount up to 16 Volumes on each of your Hetzner cloud servers. Please note that you can only attach a Volume to one server at a time." — [Volumes FAQ](https://docs.hetzner.com/cloud/volumes/faq)

> "a volume can only be attached to one server at a time and cannot be used simultaneously by multiple servers in a writable state." — [Block Storage](https://www.hetzner.com/cloud/block-storage)

**Object Storage is S3-compatible but not mountable as a folder by Hetzner.** `pricing-page`

> "Object Storage is the S3-compatible storage solution that grows with your data requirements – secure, flexible and accessible via API." — [Object Storage](https://www.hetzner.com/storage/object-storage/)

> "You can create up to 100 buckets, 100TB each." — [Object Storage](https://www.hetzner.com/storage/object-storage/)

Mounting it on a server needs a third-party FUSE client (s3fs, rclone, GeeseFS) or a gateway such as
Mountpoint for S3; nothing in Hetzner's docs presents a native mount. `inferred`, and the reason the
`mount-buckets` row is `partly`. Object Storage is only in Nuremberg, Falkenstein and Helsinki. Prices:
€6.49/month base with 1 TB, €6.26/TB extra storage, €1.00/TB traffic (page, excl. VAT).

**Stopped-machine storage.** A powered-off server keeps its whole disk and is billed as if running; there
is no cheaper "stopped storage" rate. Volumes attached to a server are billed whether or not the server
runs. `docs-confirmed` (see §4).

---

## 6. Snapshots, backups and templates

**Snapshots are manual, disk-only, kept until deleted, and limited to 30 per account.** `docs-confirmed`

> "A Snapshot is a copy of a server's disk that is created manually." — [Backups/Snapshots overview](https://docs.hetzner.com/cloud/servers/backups-snapshots/overview)

> "Snapshots are never deleted or updated automatically." — [Backups/Snapshots overview](https://docs.hetzner.com/cloud/servers/backups-snapshots/overview)

> "Up to 30 Snapshots across all projects" — [Backups/Snapshots FAQ](https://docs.hetzner.com/cloud/servers/backups-snapshots/faq)

**A snapshot is also the template mechanism.** `docs-confirmed`

> "Simply create one server, set it up, and create your Snapshot. Next, you can use this Snapshot to duplicate this server once or several times." — [Backups/Snapshots overview](https://docs.hetzner.com/cloud/servers/backups-snapshots/overview)

**Backups are daily and capped at seven slots.** `docs-confirmed`

> "Backups are copies of a server's disk that are created automatically on a daily basis. Each server has a total of seven Backup slots." — [Backups/Snapshots overview](https://docs.hetzner.com/cloud/servers/backups-snapshots/overview)

> "We will bill you for Backups with a monthly flat price, which is 20% of the price of the server you activate them for." — [Billing FAQ](https://docs.hetzner.com/cloud/billing/faq)

**Snapshot price: not published on the live pages at this check.** `docs-confirmed` for the billing method,
`not-published` for the rate.

> "We will bill you for Snapshots per gigabyte per month." — [Billing FAQ](https://docs.hetzner.com/cloud/billing/faq)

The API's `/pricing` response does carry the rate as `image.price_per_gb_month` (and `server_backup.percentage`
for backups), but that endpoint needs an account token, which this desk research did not create. An older
variant of the Cloud page, still in a search index, showed "€ 0.011 0.0130 / GB per Month" (EUR 0.011 /
USD 0.0130 per GB-month, compressed bytes, charged pro rata) and "20% of instance price" for backups. I
could **not** reproduce that section on a fresh fetch of `/cloud/` or `/cloud/?country=us` today, so I treat
the snapshot rate as unverified and use the documented method (per compressed GB-month) instead. Backups
are still documented at 20% in the billing FAQ.

**Snapshots are not memory snapshots.** Nothing in Hetzner Cloud saves RAM or a running process; the
snapshot is "a copy of your server's disk". `docs-confirmed`

> "Backups and Snapshots are copies of your server's disk." — [Backups/Snapshots FAQ](https://docs.hetzner.com/cloud/servers/backups-snapshots/faq)

**Architecture lock:** a snapshot or backup can only boot a server of the same architecture (x86 vs Arm64).
`docs-confirmed`

> "The architecture type of a new server always has to match the architecture type of the Backup/Snapshot used to create the server." — [Backups/Snapshots FAQ](https://docs.hetzner.com/cloud/servers/backups-snapshots/faq)

---

## 7. Network, access and who can reach it

| Item | Status | Evidence |
|---|---|---|
| Public IPv4/IPv6 | Yes, but not included | "Cloud servers do not have a public network interface unless at least one Primary IP is assigned to them." ([Primary IPs](https://docs.hetzner.com/cloud/servers/primary-ips/overview)) |
| Primary IPv4 price | €0.50 / $0.60 per month | "We charge € 0.50 / $ 0.60 per month (excl. VAT) for our Primary IPv4s." ([Primary IPs](https://docs.hetzner.com/cloud/servers/primary-ips/overview)) |
| Primary IPv6 | Free | "We do not charge for our Primary IPv6s." ([Primary IPs](https://docs.hetzner.com/cloud/servers/primary-ips/overview)) |
| Static IP | Yes | A Primary IP can be detached from a deleted server and reattached; Floating IPs move between servers. ([Primary IPs](https://docs.hetzner.com/cloud/servers/primary-ips/overview), [Floating IPs](https://docs.hetzner.com/cloud/floating-ips/overview)) |
| Floating IP price | €3.00/mo IPv4, €1.00/mo IPv6 | "We charge € 3.00 / month (excl. VAT) for our Floating IPv4s." ([Floating IPs](https://docs.hetzner.com/cloud/floating-ips/overview)) |
| Firewall | Yes, inbound **and** outbound, free | "A Firewall is used to restrict the incoming and outgoing traffic a user wants on the server." ([Firewalls](https://docs.hetzner.com/cloud/firewalls/overview)) |
| No-internet server | Yes | "The server does not have a public network. Instead, it only is accessible with a private IP address and it has to be added to a private network" ([Creating a server](https://docs.hetzner.com/cloud/servers/getting-started/creating-a-server)) |
| Private network | Yes, free, up to 3 per server | "Networks provide private environments for servers to communicate directly." ([Networks](https://docs.hetzner.com/cloud/networks/overview)) |
| SSH | Yes | "you can connect to it via SSH by using a command-line interface (CLI)" ([Connecting to your server](https://docs.hetzner.com/cloud/servers/getting-started/connecting-to-the-server)) |
| Browser terminal | VNC console | "The console that is provided on the Hetzner Console is a VNC console." ([Servers FAQ](https://docs.hetzner.com/cloud/servers/faq)) |
| Raw TCP | Yes | Firewall rules are per protocol/port; nothing restricts non-HTTP services. ([Firewalls](https://docs.hetzner.com/cloud/firewalls/overview)) |
| Custom domain | Yes | Hetzner runs a free DNS service and the server has a fixed public IP. ([DNS](https://www.hetzner.com/dns/)) |
| Automatic HTTPS | Partly | Managed certificates belong to the paid Load Balancer; a plain server needs Caddy/certbot. ([Load Balancer](https://www.hetzner.com/cloud/load-balancer/)) |
| Traffic allowance | 20 TB EU / 1 TB US / 0.5 TB SG, then €1.00/$1.20 per TB (EU+US) or €7.40/$8.30 (SG) | [plan pages](https://www.hetzner.com/cloud/regular-performance/), [price API CLOUD_66](https://website-price-api.hetzner.com/api/v1/products/CLOUD_66) |
| Ports 25/465 | Blocked by default on new accounts | "we block ports 25 and 465 by default on all cloud servers" ([Servers FAQ](https://docs.hetzner.com/cloud/servers/faq)) |

> "Cloud servers located in the EU include at least 20 TB of included traffic." — [Regular Performance](https://www.hetzner.com/cloud/regular-performance/)

> "Cloud servers at AP locations include at least 0.5 TB of included traffic." — [Regular Performance](https://www.hetzner.com/cloud/regular-performance/)

> "Cloud servers located in the U.S. include at least 1 TB of included traffic." — [General Purpose](https://www.hetzner.com/cloud/general-purpose/)

Per-TB overage from Hetzner's own price API (`CLOUD_66`): €1.00 / **$1.20** per TB at all locations, and
€7.40 / **$8.30** per TB in Singapore. (An archived variant of the Cloud page said $8.49 for Singapore; the
live API is the fresher source and is what `pricing.json` uses.)

> "With our Hetzner Console and API, you can list, add, modify or remove zones and records for free." — [DNS](https://www.hetzner.com/dns/)

> "Handle common use-cases like TLS Termination" — [Load Balancer](https://www.hetzner.com/cloud/load-balancer/) (each LB includes 10–50 SSL certificates)

Outbound traffic beyond the allowance is billed in 100 MB blocks and warned about at 75% and 100%, but the
warning does not stop it:

> "We will notify you, the project owner, if the traffic usage exceeds 75% of the included free traffic, and again if you reach 100%. These notifications are a convenience to help you keep track of your usage; they do not cap or stop it." — [Billing FAQ](https://docs.hetzner.com/cloud/billing/faq)

---

## 8. Keys, secrets and how you drive it

**No secrets manager.** There is no vault, no placeholder-injection proxy and no write-only environment
store. Cloud-init user data is the documented way to inject a first-run script, and it is limited to 32 KiB
and stored on the server. `inferred` from the complete create-server option list and API.

> "Cloud-init helps with early initialization of a cloud server. It is a software used to process and execute scripts. Here, you can upload those scripts if needed. Please note that this field is limited to 32KiB." — [Creating a server](https://docs.hetzner.com/cloud/servers/getting-started/creating-a-server)

**API tokens are project-scoped and read-only or read-write.** `docs-confirmed`

> "Choose a permission. You can choose between Read and Read & Write." — [Generating an API token](https://docs.hetzner.com/cloud/api/getting-started/generating-api-token)

> "Make sure to create a separate API token for each project, as each API token is bound to the project it was created in and cannot be used for other projects." — [Using the API](https://docs.hetzner.com/cloud/api/getting-started/using-api)

**Ways to drive it:** console UI, REST API, `hcloud` CLI, official Go and Python libraries, Terraform and
Ansible integrations. **No official TypeScript/JavaScript library, no MCP server, no PTY or file API.**
`docs-confirmed` for what exists; `inferred` for what does not, from the API's own introduction and its
complete path list.

> "As an alternative to working directly with our API you may also consider to use:" — [Hetzner Cloud API introduction](https://docs.hetzner.cloud/cloud.spec.json), which then lists the CLI, the Go library and the Python library, and points to an Awesome List for everything else.

> "We currently provide Open Source libraries for Go and Python." — [API FAQ](https://docs.hetzner.com/cloud/api/faq)

> "Yes. We provide it as an Open Source project here: https://github.com/hetznercloud/cli" — [API FAQ](https://docs.hetzner.com/cloud/api/faq)

The OpenAPI spec's path list (`cloud.spec.json`, 3.5 MB, read in full) contains no `/files`, `/pty`,
`/exec`, `/prompt`, `/schedules` or `/mcp` route.

**One-click apps are infrastructure, not agents.** `docs-confirmed`

> "Want to use popular software such as Docker, WordPress, Nextcloud, or GitLab – preferably without the hassle of configuration?" — [Cloud](https://www.hetzner.com/cloud/)

The app list is Docker CE, Coolify, GitLab CE, Grafana/Prometheus, Jitsi Meet, LAMP, Nextcloud, Owncast,
PhotoPrism, RustDesk, WireGuard and WordPress. There is no coding agent, no Hermes, no OpenClaw and no
n8n app. `docs-confirmed` ([Apps overview](https://docs.hetzner.com/cloud/apps/overview), [Cloud](https://www.hetzner.com/cloud/))

> "We preinstall the relevant software on your server when you create it." — [Apps overview](https://docs.hetzner.com/cloud/apps/overview)

---

## 9. Teams, accounts and company controls

**Projects with four roles.** `docs-confirmed`

> "You can group your servers and other resources into projects. For each project, you can invite other users to join and therefore work with you on the project via Hetzner Console." — [General FAQ](https://docs.hetzner.com/cloud/general/faq)

> "Each member's role in a project determines what they are allowed to do:" — [General FAQ](https://docs.hetzner.com/cloud/general/faq)

The roles are Owner, Admin, Member and Restricted; Restricted cannot create or delete servers, snapshots,
volumes, networks, load balancers or DNS zones.

**No hard spend cap.** `docs-confirmed`

> "You can set alerts that will send you an email if you exceed a certain cost limit." — [Billing FAQ](https://docs.hetzner.com/cloud/billing/faq)

> "These alerts are optional and are meant to help you keep track of your spending. They are a convenience feature rather than a spending limit, so your usage is billed as usual even in the rare case that an alert email is delayed or does not reach you." — [Billing FAQ](https://docs.hetzner.com/cloud/billing/faq)

**No audit log is published; there is an Activity view.** `inferred`

> "In the Hetzner Console as a failing Activity" — [Servers FAQ](https://docs.hetzner.com/cloud/servers/faq). The same passage continues, as a separate list item, "In the API as a failing Action."

> "The prefix can be retrieved again to identify the token, for example, in the list of account activities." — [API FAQ](https://docs.hetzner.com/cloud/api/faq)

The Cloud API exposes per-resource `/actions` (what happened to a resource), not a who-did-what audit trail
with user attribution, export or a published retention period. Nothing on the docs or legal pages describes
an account audit log. `not-published` for the log itself.

**No SSO documented.** Accounts are email + password with optional 2FA; there is no SAML or OIDC login in
the docs. `not-published`

> "After registration, you can enable two-factor authentication (2FA) regardless of the account type." — [General FAQ](https://docs.hetzner.com/cloud/general/faq)

---

## 10. Money

**Model:** hourly rate per server, capped at the monthly price; a server is billed from creation until
deletion. Primary IPs, Floating IPs, Volumes, Snapshots, Backups, Load Balancers and Object Storage are
separate line items. `docs-confirmed` / `pricing-page`

> "We bill Primary IPs (IPv4, IPv6) and cloud servers separately, and we list both resources separately in invoices." — [Billing FAQ](https://docs.hetzner.com/cloud/billing/faq)

> "It is not possible to change the currency after an account has been created." — [Billing FAQ](https://docs.hetzner.com/cloud/billing/faq)

| Item | Rate | Source |
|---|---|---|
| CPX22 2 vCPU / 4 GB / 80 GB | €19.49 or $22.99 a month; $0.0368/h; €19.99 with IPv4 | price API + plan page |
| CPX32 4 vCPU / 8 GB / 160 GB | €35.49 or $41.99 a month; $0.0673/h | price API + plan page |
| Primary IPv4 | €0.50 / $0.60 a month, €0.0008 / $0.0010 an hour | [Primary IPs](https://docs.hetzner.com/cloud/servers/primary-ips/overview) |
| Primary IPv6 | free | [Primary IPs](https://docs.hetzner.com/cloud/servers/primary-ips/overview) |
| Floating IPv4 / IPv6 | €3.00 / €1.00 a month | [Floating IPs](https://docs.hetzner.com/cloud/floating-ips/overview) |
| Volume | €0.044/GB a month (10 GB–10 TB, 16 per server) | [Block Storage](https://www.hetzner.com/cloud/block-storage) |
| Snapshot | Not published on the live pages; billed per compressed GB a month | [Billing FAQ](https://docs.hetzner.com/cloud/billing/faq) |
| Backup | 20% of the server price, 7 slots | [Billing FAQ](https://docs.hetzner.com/cloud/billing/faq) |
| Object Storage | €6.49/mo base (1 TB), €6.26/TB extra, €1.00/TB traffic | [Object Storage](https://www.hetzner.com/storage/object-storage/) |
| Load Balancer | from €7.49 a month | [Load Balancer](https://www.hetzner.com/cloud/load-balancer/) |
| Extra traffic | €1.00/$1.20 per TB (EU, US); €7.40/$8.30 per TB (SG) | [price API CLOUD_66](https://website-price-api.hetzner.com/api/v1/products/CLOUD_66) |
| DNS | free | [DNS](https://www.hetzner.com/dns/) |
| Firewall, Network | free | [Firewalls](https://docs.hetzner.com/cloud/firewalls/overview), [Networks](https://docs.hetzner.com/cloud/networks/overview) |

**Rounding and the cap.** `docs-confirmed`

> "We always round up the hourly usage of a server. If you create a server just for a few minutes, we will still bill you for one whole hour." — [Billing FAQ](https://docs.hetzner.com/cloud/billing/faq)

> "Mathematically speaking, we will bill you for the minimum amount, whether that is the monthly price cap OR the hourly price multiplied by the number of hours you used the server." — [Billing FAQ](https://docs.hetzner.com/cloud/billing/faq)

The cap binds at about **624 hours** a month at the current rates ($22.99 / $0.0368 = 624.7 h for CPX22;
$41.99 / $0.0673 = 623.9 h for CPX32). Any machine left up for a full 730-hour month pays the monthly
price, not 730 × hourly.

**Currency.** Hetzner publishes two independent price lists and the account currency is fixed at signup.
The USD list is not a daily FX conversion: it sits at roughly **1.17–1.18×** the EUR list (CPX12 11.49→13.49,
CPX22 19.49→22.99, CPX32 35.49→41.99, CCX13 42.99→50.49). A USD figure in this guide uses Hetzner's own USD
list, so no exchange assumption is needed; a reader billed in EUR who wants dollars should divide by about
1.18, and VAT (19% in Germany) is excluded from every figure here.

**Signup, trials and free usage.** No free tier and no automatic signup credit. `docs-confirmed`

> "We accept the following payment methods:" — [Payment overview](https://docs.hetzner.com/general/billing-and-account-management/billing-at-hetzner/payment-overview/). The list is credit card (VISA, Mastercard, AMEX, UnionPay), SEPA direct debit for EUR accounts, bank/wire transfer and PayPal, and not every option is available in every country.

> "Promo codes are credit or discount codes that Hetzner gives to customers or potential customers." — [Promo codes](https://docs.hetzner.com/general/billing-and-account-management/billing-at-hetzner/promo-code/)

Promo codes are not a standing offer, and there is no card-free trial: the account needs a payment method,
invoices are "due immediately", and the first limit increase is only available "if you have been with us for
a month and paid your first invoice" ([Servers FAQ](https://docs.hetzner.com/cloud/servers/faq)).

---

## 11. Contradictions and page defects (kept, not resolved away)

**11a. The Cost-Optimized family is advertised and marked unavailable at the same time.**
The overview says the whole family is currently unavailable; every Cost-Optimized plan card carries a
"not available" badge; the price API returns `active: true` for all of them.

> "Currently not available" — the Cost-Optimized card on [Cloud](https://www.hetzner.com/cloud/) and [Cloud pricing](https://www.hetzner.com/cloud/pricing)

> "not available" — badge on every card on [Cost-Optimized](https://www.hetzner.com/cloud/cost-optimized/), confirmed in a rendered screenshot (`.amp/in/artifacts/hz-cost.png`)

> `"productId":"CLOUD_124", … "active":true` — [price API](https://website-price-api.hetzner.com/api/v1/products/CLOUD_124) (the `active` flag is true for every plan I queried, including the unavailable CX/CAX ones)

**Interpretation used:** the buyer-facing availability is the badge and the overview banner — you cannot
order a Cost-Optimized server today — while the API's `active` flag tracks whether a price exists, not
whether stock does. Consequence for the guide: the €5.99 CX23 cannot be quoted as a buyable option; the
cheapest buyable shape today is CPX02 at €5.99 / $7.49 for the server, plus €0.50 / $0.60 for an IPv4. This is exactly the dynamic stock the
docs warn about ("Cloud instances may occasionally be unavailable for ordering"), so a later recheck may
find them back.

**11b. A hidden "currently unavailable" tooltip exists in the HTML of every plan card.** The raw HTML of
[Regular Performance](https://www.hetzner.com/cloud/regular-performance/) contains
`<span class="configbtn-tooltip"> This product is currently unavailable. Please check back later. </span>`
for CPX02 as well as for the unavailable plans. It is a template, so I did **not** treat it as evidence;
the badge and the screenshot are the evidence.

**11c. Traffic overage is printed with the wrong unit on the plan pages.** The tooltip says
"For each additional TB at EU-Central locations we charge € 1.00 per hour, excl. VAT." Its own subject is
"each additional TB", and the price API returns `CLOUD_66` as a per-TB charge (€1.00 / $1.20, and
€7.40 / $8.30 in Singapore), so the "per hour" suffix is a page defect. The guide quotes per TB.

**11d. Marketing prices include one Primary IPv4; the API and the docs price the server alone.** The card
price comes from `product-key="CLOUD_124+CLOUD_21"` (server + IPv4); the API's `CLOUD_124` is the server
only. Both are correct; the guide must say which one it is quoting.

**11e. The snapshot and traffic price list that search indexes still carry is not on the live page.**
The `/cloud/?country=us` variant that a search index returned, with a SNAPSHOTS / BACKUPS / FLOATING IPS /
TRAFFIC grid, did **not** appear in two fresh fetches of `/cloud/`, `/cloud/?country=us` and `/de/cloud/`
today; those pages now render only the plan chooser and the calculator. Consequence: the snapshot rate is
recorded as unverified rather than quoted, and the traffic overage uses the price API instead. The traffic
*allowance* sentences are quoted from the plan pages, which are live.

---

## 12. Searched but unanswered (`not-published`)

- Which hypervisor runs Cloud servers. The docs say "hypervisors" and never name KVM, Firecracker or Nitro.
- A memory snapshot, pause or hibernate feature. No such state exists in the console or the API.
- A hard spending cap. Only email alerts and traffic notices.
- SSO (SAML/OIDC) for the Console.
- An account audit log with user attribution, export or a retention period.
- An official TypeScript/JavaScript SDK, an official MCP server, or a PTY/file API.
- A published boot time in milliseconds. The claim is only "in seconds".
- A published snapshot retention limit in time. Snapshots persist until deleted; the limit is 30 per account.
- Whether the Cost-Optimized family will return, and when.

---

## 13. Use-case routes (detail behind `routes.json`)

| Use case | Tier | Route |
|---|---|---|
| Run a Hermes agent | manual | Create a CPX22 (2/4/80), SSH in, install Hermes, keep it running as a service. A community Ansible playbook exists; neither Hetzner nor Hermes publishes a Hetzner page. |
| Run an OpenClaw agent | guide | **OpenClaw's own docs have a Hetzner page**: create a Debian/Ubuntu server with ≥6 GB RAM, attach a firewall allowing only SSH, install Docker, follow the Docker VM runtime, reach the Control UI over `ssh -L`. |
| Give a coding agent its own machine | manual | CPX32 (4/8/160), SSH, install Claude Code; the disk survives between sessions but the server keeps billing while stopped. |
| Run code inside your own product | backend | You would build the pool and the execute API yourself on top of `hcloud`; there is no per-run sandbox endpoint. One-hour rounding makes short runs very expensive. |
| Run a browser or computer-use agent | manual | No browser or desktop image; install Chromium and (optionally) a desktop, view it through the VNC console or over SSH. |
| Host your own n8n | guide | **n8n's own docs have a Hetzner page**: Docker CE one-click app, Docker Compose, Caddy, SQLite by default, encryption key on the disk. |
| Host your own Discord or Slack bot | manual | CPX12 (1/2/40), install the bot, keep it running; a bot with an open gateway connection cannot stop. |
| Give a small team Claude Code in the cloud | manual | One CPX32 per developer, each with its own login; five machines left stopped still bill about $213 a month. |
| Run a scraper on a schedule | manual | cron or a systemd timer inside the server; there is no provider scheduler. A fresh server per run costs a whole hour each. |
| Host your own MCP server | manual | CPX02 (1/1/20) with a public IP and a firewall rule; the server must stay up because there is no wake-on-request. |

## 14. Company facts

| Fact | Value | Evidence |
|---|---|---|
| Entity | Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Germany | [Legal notice](https://www.hetzner.com/legal/legal-notice/) |
| Founded | 1997 | "founded in 1997" ([About us](https://www.hetzner.com/unternehmen/ueber-uns/)) |
| Management | Martin Hetzner, Stephan Konvickova and Günther Müller, listed as CEOs | [Legal notice](https://www.hetzner.com/legal/legal-notice/) |
| Registration | Ansbach HRB 6089, VAT DE 812871812 | [Legal notice](https://www.hetzner.com/legal/legal-notice/) |
| Finnish subsidiary | Hetzner Finland Oy, Tuusula | [About us](https://www.hetzner.com/unternehmen/ueber-uns/) |
| Governing law | German law, jurisdiction Gunzenhausen | "governed by the laws of the Federal Republic of Germany" ([Terms](https://www.hetzner.com/legal/terms-and-conditions/)) |
| Certifications | ISO/IEC 27001:2022; BSI C5 Type 2; KRITIS §8a BSIG; PCI DSS | [Information security](https://docs.hetzner.com/general/company-and-policy/information-security-at-hetzner/) |
| SOC 2 | Not held, deliberately | "As an international web hosting company, we at Hetzner place our focus on the ISO/IEC 27001:2022 certification because it is more applicable to an international market." (same page) |
| SLA | 99.9% monthly availability per server, Cloud Credit refunds | "We will make commercially reasonable efforts to ensure a monthly availability of 99.9% for every Cloud Server." ([SLA](https://docs.hetzner.com/general/company-and-policy/slas-cloud/)) |
| DPA | Available online, TOMs in Appendix 2 | "We provide an overview of our Technical and organizational measures (\"TOMs\" for short) in the Appendix 2 of our Data Processing Agreement." ([Information security](https://docs.hetzner.com/general/company-and-policy/information-security-at-hetzner/)) |
| Status page | https://status.hetzner.com/ | [Cloud](https://www.hetzner.com/cloud/) footer |

## 15. Hand-worked A/B/C

See `abc.md`. Summary: **A $37.80**, **B $42.59**, **C $23.59** in Hetzner's own USD list, each for one
machine in the EU with one Primary IPv4. A is driven by one-hour rounding, B and C by the fact that a
stopped server is billed in full. The updated engine (`Shape.monthly`, `billedWhileStopped`,
`minimumPerRun` from `origin/main` b101ed3) reproduces the server-only totals exactly — $36.80, $41.99 and
$22.99 — leaving only the separately billed IPv4 outside the card.

## 16. Unknowns that would need a real account

Not done, because this is desk research with no account and no spend authorisation:

- Whether a brand-new account can actually create 1,000 servers a month (default project limits are not
  published; the first increase needs a month of paid history).
- Real boot-to-SSH time, and whether the API's best-effort availability check makes bulk creation flaky.
- The actual compressed size of a snapshot of a 20 GB disk (the price is per compressed GB).
- Whether Object Storage mounting via s3fs is usable in practice for an agent's workspace.

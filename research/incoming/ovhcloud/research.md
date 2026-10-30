# OVHcloud VPS — research ledger

**Provider ID:** `ovhcloud`
**Product:** OVHcloud VPS, the "VPS 2027" range. Not Public Cloud instances and not
dedicated servers.
**Checked:** 2026-10-30 (Asia/Kolkata; 2026-10-29/30 UTC).
**Repository:** `WyrdWerk/sandbox-guide`, working tree at `df4cd0c` ("List Hetzner's
Cost-Optimized plans as out of stock"), `origin/main`. Desk research only: no account, no
order, no server.
**Currency:** USD, from OVHcloud's US site (`us.ovhcloud.com`) and its US public order
catalog. US prices exclude sales tax: the catalog's `locale` block is
`{"currencyCode": "USD", "subsidiary": "US", "taxRate": 0}` and the US Terms of Service say
"All Fees are exclusive of all sales, use, excise, value added, withholding and other
taxes". No exchange rate is used anywhere in this file.

## 1. What the product is

| Claim | Source | Quote | Confidence | Checked |
|---|---|---|---|---|
| A VPS is a server the customer administers end to end | https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/starting-with-a-vps | "A Virtual Private Server (VPS) is a server that you fully administer." | docs-confirmed | 2026-10-30 |
| It is an isolated environment, not shared hosting | https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/vps-faq | "Unlike shared hosting, a VPS offers an isolated environment, dedicated to the customer." | docs-confirmed | 2026-10-30 |
| The customer is responsible for OS security and backups | https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/starting-with-a-vps | "Security: protecting your VPS against attacks." | docs-confirmed | 2026-10-30 |
| It needs server-administration skills | https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/vps-faq | "Using a VPS requires basic knowledge of server administration." | docs-confirmed | 2026-10-30 |
| OVHcloud positions VPS between web hosting and dedicated servers | https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/vps-faq | "Our VPS solutions bridge the gap between shared web hosting and dedicated servers, combining performance and reliability without the burden of hardware management." | docs-confirmed | 2026-10-30 |
| VPS and Public Cloud are different products | https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/vps-faq | "OVHcloud Public Cloud - Offers a multi-server infrastructure with high availability and a private network (vRack), and is designed for complex, scalable architectures." | docs-confirmed | 2026-10-30 |
| Root access is part of the offer | https://us.ovhcloud.com/vps/vps-openclaw/ | "You are the root user." | docs-confirmed | 2026-10-30 |
| The current range is called VPS 2027 and has four models | https://us.ovhcloud.com/vps/ | "Choose the configuration that fits your needs—web hosting, gaming, VPN, development, and more." | pricing-page | 2026-10-30 |

## 2. Plans, specs and prices

The product page shows the four 2027 models with "Starting at" prices. Those are the
12-month commitment prices, not the month-to-month price. The authoritative live price list
is OVHcloud's public order catalog for the US subsidiary, which returns every plan code with
a `default` (no commitment), `upfront6`, and `upfront12` price. The card uses the **default
(monthly-billed, no commitment)** price, which is also the ongoing renewal price.

Source: https://api.us.ovhcloud.com/1.0/order/catalog/public/vps?ovhSubsidiary=US
(catalog id 3787, 245 plans, `taxRate: 0`).

| Model | vCores | RAM | NVMe | Monthly, no commitment (card) | 6-month commitment | 12-month commitment | Catalog plan code |
|---|---:|---:|---:|---:|---:|---:|---|
| VPS-1 | 2 | 4 GB | 40 GB | **$5.35** | $5.08 | $4.54 | `vps-2027-model1` |
| VPS-2 | 4 | 8 GB | 75 GB | **$10.00** | $9.50 | $8.50 | `vps-2027-model2` |
| VPS-3 | 6 | 12 GB | 100 GB | **$14.50** | $13.77 | $12.32 | `vps-2027-model3` |
| VPS-4 | 8 | 24 GB | 200 GB | **$27.50** | $26.12 | $23.37 | `vps-2027-model4` |

Evidence: the product page lists "Starting at $4.54 /month", "Starting at $8.50 /month",
"Starting at $12.32 /month" and "Starting at $23.37 /month" beside 2/4/6/8 vCores and
4/8/12/24 GB RAM (https://us.ovhcloud.com/vps/, `pricing-page`). The catalog gives the
monthly-billed figures as `"formattedPrice": "$5.35 USD"` (VPS-1), `"$10.00 USD"` (VPS-2),
`"$14.50 USD"` (VPS-3) and `"$27.50 USD"` (VPS-4) with `commitment: 0` (`pricing-page`).
The same catalog lists `upfront12` renew prices of $4.54, $8.50, $12.32 and $23.37, which
matches the "Starting at" labels and shows they are commitment prices.

- Installation fee: $0.00 (`"Installation fees"`, catalog).
- Local Zone variants: VPS-1 LZ $6.54 monthly-billed ($5.55 on 12 months), VPS-2 LZ $10.00
  monthly-billed ($8.50 on 12 months). Source: catalog plan codes `vps-2027-model1.LZ` and
  `vps-2027-model2.LZ`.
- The older 2026 range (`vps-2025-model1` … `model6`) is still listed in the catalog but the
  product page presents 2027 as the range to buy and warns existing customers that
  configurations have shifted. This research prices 2027 only.

### Options (monthly, USD, no commitment)

| Option | Price | Source |
|---|---:|---|
| Daily backup, standard (24 h) | Listed at $0.50–$1.20 a month in the catalog, but the product page and FAQ say it is free — see contradictions | catalog `option-auto-backup-2027-1-model*`; https://us.ovhcloud.com/vps/ |
| Premium backup, 7-day rolling | $1.40 (VPS-1) to $5.90 (VPS-4) | https://us.ovhcloud.com/vps/ "Starting at $1.40 /month"; catalog `option-auto-backup-2027-7-model*` |
| Snapshot | "Starting at $0.40 /month" on the page; the catalog's 20 GB snapshot option is $1.20 | https://us.ovhcloud.com/vps/; catalog `option-snapshot-20g` |
| Additional disk 50 GB | $2.60 | catalog `option-additional-disk-2027-50g` |
| Additional disk 100 GB | $5.20 | catalog `option-additional-disk-2027-100g` |
| Additional disk 200 GB | $10.30 | catalog `option-additional-disk-2027-200g` |
| Additional disk 500 GB | $25.70 | catalog `option-additional-disk-2027-500g` |
| Additional disk 1,000 GB | $51.30 | catalog `option-additional-disk-2027-1000g` |
| Additional disk 5,000 GB | $256.50 | catalog `option-additional-disk-2027-5000g` |
| Additional disk 10,000 GB | $512.90 | catalog `option-additional-disk-2027-10000g` |

The additional disk is a fixed-size add-on, not a per-GiB rate: the effective rate falls
from $0.052/GiB-month at 50 GB to $0.0513/GiB-month at 10 TB. The calculator therefore does
not price it (see §6).

## 3. Billing rules that decide A, B and C

| Claim | Source | Quote | Confidence | Checked |
|---|---|---|---|---|
| A VPS is billed monthly; commitment only discounts the monthly price | https://support.us.ovhcloud.com/hc/en-us/articles/360002306224-Overview-of-Billing-with-OVHcloud-US | "You can choose to be billed monthly for a Virtual Private Server (VPS) regardless of whether you select a commitment that is month-to-month, 12 months, or 24 months." | docs-confirmed | 2026-10-30 |
| A month-to-month VPS can be cancelled at any time | same | "If you choose a month-to-month commitment period, you can cancel your VPS at any time from the OVHcloud Manager." | docs-confirmed | 2026-10-30 |
| Renewal is automatic until cancelled | https://docs.ovhcloud.com/en/guides/account-and-service-management/managing-billing-payments-and-services/faq-billing | "By default, your services are renewed automatically when they reach their renewal date" | docs-confirmed | 2026-10-30 |
| There is no hourly or per-second meter for VPS | catalog and billing article: the only recurring price is "Monthly fees", `interval: 1`, `intervalUnit: "month"` | `"description": "Monthly fees"` | pricing-page | 2026-10-30 |
| Powering off is an API action, not a billing change | https://api.us.ovhcloud.com/1.0/vps.json | "Stop the VPS (power off) and return an asynchronous task" | docs-confirmed | 2026-10-30 |
| A stopped VPS keeps its disk (no reinstall or delete) | https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/understand-vps-control-panel | "A reinstallation will delete all data currently hosted on the VPS (except for additional disks)." | docs-confirmed | 2026-10-30 |
| Payment method required | https://docs.ovhcloud.com/en/guides/account-and-service-management/managing-billing-payments-and-services/faq-billing | "To ensure that your services are renewed properly, you will need to set at least one payment method in the OVHcloud Control Panel." | docs-confirmed | 2026-10-30 |
| Accepted payment methods | same | "you can add or delete a payment method (bank card, PayPal or SEPA direct debit)" | docs-confirmed | 2026-10-30 |

**Interpretation used in the card.** A VPS is a subscription for the calendar month. There is
no state in which the machine exists and does not bill: `/stop` powers it off, the invoice
renews, and only cancellation ends the charge. That is `monthlyPlans: true` plus
`between: "kept"`, with no hourly rate and no `billedWhileStopped` (the monthly plan already
covers every hour).

## 4. A, B and C

`MONTH_HOURS = 730`. Workloads are `presets.a/b/c` in `site/src/lib/cost.ts`.

### A — 1,000 tasks × 10 minutes, 2 vCPU / 4 GiB / 10 GiB, deleted after each

- Hours: 1,000 × 10 ÷ 60 = **166.6667 h**.
- Shape: **VPS-1**, 2 vCores / 4 GB / 40 GB, $5.35 monthly-billed. It is the smallest shape
  that has 2 vCores and 4 GB; its disk is larger than the 10 GiB asked for.
- Billing shape: one monthly plan. 166.67 h of back-to-back tasks fit inside one 730-hour
  month, so one plan covers all 1,000 runs.
- **Bill: $5.35.** No per-run minimum, no hourly rounding, no per-task charge.
- If the tasks must run concurrently, the bill multiplies by the number of VPS-1 plans.
- If the catalog's standard-backup line is really charged, add $0.50 (see contradictions).

### B — one 4 vCPU / 8 GiB / 50 GiB machine, 730 hours

- Shape: **VPS-2**, 4 vCores / 8 GB / 75 GB, $10.00 monthly-billed. VPS-1 has only 2 vCores,
  so VPS-2 is the smallest fit; its memory and disk are larger than asked.
- **Bill: $10.00.** The monthly plan is the whole charge; there is no hourly arithmetic.
- 12-month commitment would be $8.50 a month ($102.00 upfront); 6-month $9.50 ($57.00).
- If the standard-backup line is charged, add $0.60.

### C — 2 vCPU / 4 GiB / 20 GiB, 90 running + 640 stopped hours, files kept

- Shape: **VPS-1**, $5.35 monthly-billed.
- Billed hours: 90 + 640 = **730 h**, because powering off does not change the subscription.
- **Bill: $5.35.** The 640 stopped hours are not free and are not cheaper; they are simply
  part of the month already paid for.
- Files: the system disk stays attached across `/stop` and `/start`; memory and running
  processes do not survive a power-off.
- If the standard-backup line is charged, add $0.50.

### What the shared engine prints

With `monthlyPlans: true`, `monthly`-only shapes and `between: "kept"`, `price()` prints
$5.35 for A, $10.00 for B and $5.35 for C — identical to the hand-worked totals. The engine
picks VPS-1 for A and C and VPS-2 for B, and its A line says "1 × $5.35 a month, running
166.67 h of tasks back to back". Details and the full comparison are in `abc.md`.

## 5. Feature and capability evidence

### Isolation and hardware

| Claim | Source | Quote | Confidence |
|---|---|---|---|
| Full VM with root and Docker | https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/install-docker-on-vps | "This guide explains how to install Docker Engine and Docker Compose on an OVHcloud VPS." | docs-confirmed |
| Hardware cannot be customised | https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/vps-faq | "A VPS cannot be customized or modified at the hardware level." | docs-confirmed |
| Only one OS per VPS | https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/vps-faq | "OVHcloud installation templates only allow for one operating system." | docs-confirmed |
| No Proxmox/virtualisation template | https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/vps-faq | "OVHcloud installation templates for VPS do not include the Proxmox Operating System or a similar OS for virtualization." | docs-confirmed |
| Images are OVHcloud's own list | https://api.us.ovhcloud.com/1.0/vps.json | "List images available for this VPS" | docs-confirmed |
| No GPU on VPS | https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/vps-faq | "A VPS cannot be customized or modified at the hardware level." | inferred |

Nested virtualisation is **not published**. The FAQ only says OVHcloud's templates do not
include a virtualisation OS; it does not say whether the vmx/svm flag is exposed. The
capability row is `not-published`, not `no`.

Custom images: there is no ISO mount, image upload or BYOI path for VPS. The API exposes
`images/available`, which lists OVHcloud's images, and the reinstall guide says the options
offered are "images compatible with an OVHcloud VPS". A determined admin can install another
system from rescue mode, but that is not a supported image path. Row is `no` (`inferred`).

### Sizes and regions

| Claim | Source | Quote | Confidence |
|---|---|---|---|
| 28 locations, 15 Local Zones | https://www.ovhcloud.com/en-gb/lp/vps-localzone/ | "Our virtual private servers are currently available in 28 global locations, including 15 with Local Zones already available." | docs-confirmed |
| VPS-2 is the Local Zone model | same | "VPS-2 is deployed in all Local Zones." | docs-confirmed |
| Local Zones lose options | https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/vps-faq | "A Local Zone VPS, unlike a regular VPS, does not include security features like Anti-DDoS, or advanced options such as Additional IP and Load Balancer." | docs-confirmed |
| EU hosting | https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/vps-faq | "Hosting your VPS with OVHcloud in France or generally within the EU offers advantages such as competitive pricing and reinforced data protection." | docs-confirmed |
| Cannot move a VPS between regions | https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/vps-faq | "It is not possible to migrate a VPS from one location to another, whether to another data centre, another country, or another continent" | docs-confirmed |
| In-place upgrades keep data and IP | https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/upgrade-resources | "The upgrade will be effective immediately, keeping all of your data." | docs-confirmed |
| US support restricts upgrades to US regions | https://support.us.ovhcloud.com/hc/en-us/articles/38299056076947-Upgrading-your-VPS-configuration | "At this time, we cannot offer RAM, vCPU, or storage upgrades for customers who have purchased VPS services in regions outside of the United States." | docs-confirmed |

### Lifecycle, snapshots, backups, storage

| Claim | Source | Quote | Confidence |
|---|---|---|---|
| Power off / power on exist | https://api.us.ovhcloud.com/1.0/vps.json | "Start the VPS (power on) and return an asynchronous task" | docs-confirmed |
| One snapshot at a time | https://support.us.ovhcloud.com/hc/en-us/articles/360012573640-How-to-use-snapshots-on-a-VPS | "Since you can only have one snapshot activated at a time, the existing snapshot has to be deleted before creating a new one." | docs-confirmed |
| Snapshot is a live disk image | same | "Snapshots are instantaneous images of your running system (“live snapshot”)." | docs-confirmed |
| Daily backup included free | https://support.us.ovhcloud.com/hc/en-us/articles/360012678619-How-to-use-automated-backups-on-a-VPS | "When you order a VPS, a single daily Automated backup is included as a free service option." | docs-confirmed |
| 24-hour retention on new services | https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/understand-vps-control-panel | "A daily system backup (excluding additional disks) is automatically performed and kept for 24 hours (applicable only to services ordered from August 7, 2025)." | docs-confirmed |
| Premium backup gives 7 days | https://support.us.ovhcloud.com/hc/en-us/articles/360012678619-How-to-use-automated-backups-on-a-VPS | "Upgrading to Premium Automated Backup enhances your Automated backup option to a 7-day rolling daily backup." | docs-confirmed |
| Additional disk is separate storage | https://support.us.ovhcloud.com/hc/en-us/articles/4410563713427-Configuring-an-additional-disk-on-a-VPS | "This storage is separated from the internal storage capacity of the VPS solution" | docs-confirmed |
| Additional disk is single-server | same | "The additional disk will only be accessible from the server’s IP address, and data stored on it will remain unaffected, even if the VPS is reinstalled or suffers data loss." | docs-confirmed |
| Rescue mode exists | https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/rescue | "Rescue mode is a tool provided by OVHcloud to boot your VPS into a temporary operating system." | docs-confirmed |

No pause, hibernate, memory snapshot, fork, warm pool, idle timer or scheduled-run feature is
documented. The API has `/start`, `/stop`, `/reboot`, `/rebuild`, `/createSnapshot`,
`/snapshot/revert`, `/snapshot/download` and `/automatedBackup/restorePoints`, and nothing
else in that family.

### Access and network

| Claim | Source | Quote | Confidence |
|---|---|---|---|
| Dedicated IPv4 and IPv6 | https://us.ovhcloud.com/vps/ | "Get a unique IPv4 address, for more flexibility and network compatibility." | pricing-page |
| Unlimited traffic | https://us.ovhcloud.com/vps/ | "Unlimited traffic" | pricing-page |
| Bandwidth by model | https://us.ovhcloud.com/vps/ | "500 Mbps public bandwidth" (VPS-1) up to "3 Gbps public bandwidth" (VPS-4) | pricing-page |
| Real SSH | https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/starting-with-a-vps | "ssh username@IPv4_VPS" | docs-confirmed |
| Browser console | https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/using-kvm-for-vps | "The KVM console for VPS available in your OVHcloud Control Panel allows you to open a connection to your VPS in your web browser" | docs-confirmed |
| Up to 16 additional IPs | https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/vps-faq | "A VPS is limited to 16 Additional IP addresses" | docs-confirmed |
| Port 25 open by default (not Local Zones) | https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/vps-faq | "Port 25 is not blocked by default on OVHcloud VPS servers" | docs-confirmed |
| Domains are separate | https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/vps-faq | "No, our VPS solutions do not include a domain name or email service." | docs-confirmed |
| TLS is self-installed | https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/install-ssl-certificate | "This guide documents the use of Let's Encrypt, a free and automated service." | docs-confirmed |
| Firewall is inside the guest | https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/firewall-linux-iptable | "Most of the rules outlined in this guide assume that your iptables is configured by default to DROP incoming traffic, and that you selectively authorize incoming traffic." | docs-confirmed |
| Object Storage is S3-compatible | https://support.us.ovhcloud.com/hc/en-us/articles/23896851215379-Object-Storage-FAQ | "The Object Storage classes are largely compatible with the S3™ protocol and benefit from a recent, high-performance design and good bandwidth." | docs-confirmed |

The VPS API has no firewall resource at all. Inbound filtering is either the Edge Network
Firewall (documented for dedicated servers and linked from the VPS FAQ) or iptables in the
guest; outbound allowlisting is only the latter, and a root agent can change it. Rows
`egress-allowlist` and `no-internet` are `partly` for that reason.

### Ways to drive it

| Claim | Source | Quote | Confidence |
|---|---|---|---|
| Documented REST API | https://api.us.ovhcloud.com/1.0/vps.json | 52 paths under `/vps`, including `/vps/{serviceName}/reboot` | docs-confirmed |
| Official CLI covers VPS | https://github.com/ovh/ovhcloud-cli | "Retrieve information and manage your VPS services" | docs-confirmed |
| CLI example | same | "ovhcloud vps list" | docs-confirmed |
| Python SDK | https://github.com/ovh/python-ovh | "Lightweight wrapper around OVHcloud's APIs." | docs-confirmed |
| Node SDK | https://github.com/ovh/node-ovh | "The easiest way to use the OVHcloud.com APIs in your node.js applications." | docs-confirmed |
| Terraform resource | https://github.com/ovh/terraform-provider-ovh/blob/master/docs/resources/vps.md | "Creates an OVHcloud Virtual Private Server (VPS)." | docs-confirmed |
| Scoped API keys | https://docs.ovhcloud.com/en/guides/manage-and-operate/api/first-steps | "The `Rights` field allows you to restrict the use of the application to certain APIs." | docs-confirmed |
| Official MCP server, split by product | https://docs.ovhcloud.com/en/guides/web-cloud/domains/mcp-domain-getting-started | "You always connect to a specific section: there is no global URL exposing every tool at once." | docs-confirmed |

No VPS MCP section is documented; the MCP guide's section list is domain names and the hub,
and the docs index has no VPS MCP page. Row is `partly`.

### Agents and templates

| Claim | Source | Quote | Confidence |
|---|---|---|---|
| Preinstalled application images | https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/apps-first-steps | "OVHcloud offers VPS customers pre-installed application images for quick and easy deployment of applications in just a few clicks." | docs-confirmed |
| n8n can be ordered preinstalled | https://us.ovhcloud.com/vps/vps-n8n/ | "Now conveniently pre-installed on a range of OVHcloud plans." | docs-confirmed |
| n8n guide points at the preinstalled offer | https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/install-n8n-on-vps | "For a turn-key setup, opt for an OVHcloud preinstalled n8n VPS." | docs-confirmed |
| OpenClaw is a guide, not an image | https://us.ovhcloud.com/vps/vps-openclaw/ | "Follow our step-by-step guide to install OpenClaw using Docker on your OVHcloud VPS in less than 5 minutes" | docs-confirmed |
| Hermes is a guide | https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/install-hermes-agent | "Find out how to deploy Hermes Agent in production on a VPS, connected to OVHcloud AI Endpoints, with a Telegram gateway and scheduled tasks" | docs-confirmed |
| OpenClaw guide uses Docker | https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/install-openclaw | "This guide uses Docker to protect your host system and ensure your assistant stays online 24/7." | docs-confirmed |

No coding agent, browser or desktop image, and no prompt or PTY API. Rows
`agents-preinstalled`, `prompt-api`, `browser` and `pty` are `no`; `desktop` is `partly`
because a Windows VPS plus RDP is a real desktop, even though there is no computer-use image.

### Teams, keys, spend

| Claim | Source | Quote | Confidence |
|---|---|---|---|
| IAM users, groups and policies | https://us.ovhcloud.com/identity-security-operations/identity-access-management/ | "Policies contain a list of identities, such as accounts, users, and user groups, a list of resources where the policies are applicable, and a list of actions that the identities are allowed to perform." | docs-confirmed |
| SSO via SAML 2.0 | same | "Leverage SAML 2.0 federation protocol to seamlessly connect your Identity Provider, such as ADFS, Azure AD, Google Workspace, and Okta." | docs-confirmed |
| Audit logs exist, forwarded to LDP | https://docs.ovhcloud.com/en/guides/manage-and-operate/iam/logs-forwarding | "Audit Logs: Provide a security-relevant, chronological set of records documenting the sequence of actions in your OVHcloud account" | docs-confirmed |
| Reading them costs LDP usage | same | "Note that enabling the forwarding is free of charge, but you will be charged for the usage of your Logs Data Platform service as per the standard price plan." | docs-confirmed |
| Renewal/expiry emails | https://docs.ovhcloud.com/en/guides/account-and-service-management/managing-billing-payments-and-services/best-practices | "you will receive several notifications by email" | docs-confirmed |

No hard spend cap and no spend-threshold alert is documented for VPS. `spend-cap` is `no`;
`usage-alerts` is `partly` (renewal/expiry mail only).

### Company, contract, compliance

| Claim | Source | Quote | Confidence |
|---|---|---|---|
| US contracting entity | https://us.ovhcloud.com/legal/terms-of-service/ | "OVH US LLC dba OVHcloud®, a Delaware limited liability company" | docs-confirmed |
| US address | https://us.ovhcloud.com/legal/data-processing-agreement/ | "with its principal place of business at 11950 Democracy Drive, Suite 300, Reston, VA 20190" | docs-confirmed |
| Wholly owned subsidiary | https://us.ovhcloud.com/about/ | "OVH US, a wholly owned subsidiary of OVH Group" | docs-confirmed |
| Founded 1999 | same | "OVHcloud has been shaping the internet of today and tomorrow since 1999." | docs-confirmed |
| 46 data centres, 4 continents | same | "46 data centers" | docs-confirmed |
| 1.6 million customers | same | "over 1.6 million customers worldwide" | docs-confirmed |
| 99.9% VPS SLA | https://us.ovhcloud.com/legal/sla/vps/ | "VPS 1-6 | 99.9%" | docs-confirmed |
| Service credits | same | "Less than 99.9% but equal to or greater than 99.0% | 10%" | docs-confirmed |
| SOC 1/2/3 exist, scope named | https://us.ovhcloud.com/compliance/soc-1-2-3/ | "The scope of the SSAE 18 Type 2 SOC 1, 2, & 3 examinations is the OVHcloud Services and US Data Centers" | docs-confirmed |
| DPA | https://us.ovhcloud.com/legal/data-processing-agreement/ | "This Data Processing Agreement (“DPA”) forms part of the OVHcloud Terms of Service" | docs-confirmed |
| Public status page | https://www.status-ovhcloud.com/ | "OVHcloud Status" | docs-confirmed |
| Prices exclude tax | https://us.ovhcloud.com/legal/terms-of-service/ | "All Fees are exclusive of all sales, use, excise, value added, withholding and other taxes" | docs-confirmed |

SOC 2 is `partly`: the report exists, but the published scope names "Bare Metal Cloud" and
the two US data centres, not VPS by name, and non-US services need a sales request.

## 6. RateCard model and its limits

The tariff is representable without an engine change:

- `monthlyPlans: true` and `Shape.monthly` only. OVHcloud sells whole months, not hours.
- `between: "kept"`.
- No `billedWhileStopped`: the monthly plan already charges the stopped hours; adding it
  would double-count.
- No `minimumPerRun`, `wholeHours` or `perMachine`: there is no per-run charge, no hourly
  rounding, and the IPv4 is included in the plan.

**Limits recorded on the card:**

1. The additional disk is sold in fixed sizes (50 GB, 100 GB, 200 GB, 500 GB, 1 TB, 5 TB,
   10 TB) at fixed monthly prices, not a per-GiB rate. `disk.extraMonthly` would pro-rate
   sizes OVHcloud does not sell, so it is omitted. A request above the plan's own disk is
   reported as infeasible; the note says an additional disk can be attached but is not
   priced.
2. The backup add-on contradiction (below) is not priced. The card uses the product page's
   "free" statement and the notes give the $0.50/$0.60 alternative.
3. Local Zone prices differ for VPS-1 ($6.54) and are not modelled.
4. The 6- and 12-month commitment prices are recorded in the notes, not used.

## 7. Use-case dispositions

| Use case | Tier | Why |
|---|---|---|
| `hermes-agent` | guide | OVHcloud publishes a full "How to install Hermes Agent on a VPS" guide with Telegram and scheduled tasks. No preinstalled image, no terminal-free path. |
| `openclaw` | guide | Full Docker/Traefik guide plus a marketing landing page; not an image. |
| `coding-agent` | manual | Install Claude Code/Codex over SSH yourself. VPS-2 ($10) or VPS-3 ($14.50). |
| `code-interpreter` | manual | No sandbox API or per-run machine; one monthly plan serves every job. Poor fit for untrusted code. |
| `browser-agent` | manual | Install Chromium and a driver; no browser image, no desktop streaming. |
| `workflow-automation` | preinstalled | n8n is offered preinstalled on VPS plans; you still configure the domain, TLS and database. Cheapest route in the comparison at $5.35. |
| `chat-bot` | manual | Always-on VPS-1 at $5.35 is a good fit; installation is a terminal job. |
| `claude-code-team` | manual | One VPS per developer, or one shared box; no per-seat isolation product. |
| `scheduled-scraper` | manual | Cron/systemd inside the guest; the machine bills all month, so a 10-minute daily scrape pays $5.35. |
| `mcp-server` | manual | A public IPv4 and any port make it a natural MCP host; setup is manual. |

Proposed pick: `workflow-automation` only. OVHcloud's preinstalled n8n on VPS-1 at $5.35 a
month is the cheapest supported n8n route in the set, and it is a different case from the
existing Hostinger/DigitalOcean picks (managed template vs raw price). No pick for
Hermes/OpenClaw: Hostinger already owns the one-click case, and OVHcloud's route is a guide.

## 8. Contradictions

### 8.1 Is the daily backup free or $0.50–$1.20?

- Product page: "Daily backups are a free feature of your VPS." (https://us.ovhcloud.com/vps/)
- FAQ: "Yes, when you order a VPS, a daily backup option is included free of charge."
  (https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/vps-faq)
- Order catalog: `option-auto-backup-2027-1-model1` "Option Automated Backup Standard -
  VPS-1 2027" at `"$0.50 USD"`, model2 $0.60, model3 $0.80, model4 $1.20, and the addon
  family is `mandatory: true`.
  (https://api.us.ovhcloud.com/1.0/order/catalog/public/vps?ovhSubsidiary=US)

**Interpretation used:** backup is included, because two product pages and the FAQ say so and
the plan cards list "Daily backup of the previous 24 hours" with no price. **Consequence:**
if the order funnel really adds the standard-backup line, every total rises by $0.50 (VPS-1)
or $0.60 (VPS-2). The provider cost section and the rate card both state this.

### 8.2 Does an upgrade need a reboot, and is it available outside the US?

- US product page: "Upgrade your VPS resources with a single click -- just a quick reboot
  required, with no data migration or configuration changes needed."
- International product page: "Get more VPS resources instantly, with no service disruption
  or data migration."
- Upgrade guide: "The upgrade will be effective immediately, keeping all of your data."
- US support article: "At this time, we cannot offer RAM, vCPU, or storage upgrades for
  customers who have purchased VPS services in regions outside of the United States."

**Interpretation used:** in-place upgrade exists and keeps data and IP, but a reboot may be
required and the US support page restricts upgrades to US regions. Row `live-resize` is
`partly`, not `yes`.

### 8.3 Hero bandwidth

- US hero: "Unlimited bandwidth, up to 1.5 Gbps*"
- US plan cards: 500 Mbps, 1 Gbps, 2 Gbps, 3 Gbps.
- International hero: "Unlimited bandwidth, up to 3 Gbps*"

**Interpretation used:** plan cards and the international page are current; the US hero
figure is stale. Rows use 500 Mbps–3 Gbps.

### 8.4 "Starting at" vs monthly billing

The product page's "Starting at $4.54 /month" is the 12-month commitment price. A
month-to-month buyer pays $5.35. The card uses $5.35 and the notes explain the difference.
This is not a price change; it is a term difference.

## 9. Unknowns

1. **Nested virtualisation.** No VPS page says whether vmx/svm is exposed. Not published.
2. **Fair-use threshold on "unlimited" traffic.** The page's asterisk footnote is not
   rendered in the served HTML; no cap, throttle or overage is published for standard VPS.
3. **vCore contention.** OVHcloud does not publish a CPU-share, burst or steal policy for
   VPS vCores. The n8n landing page says resources are "allocated specifically to you", which
   is marketing, not a technical guarantee.
4. **Snapshot price.** "From $0.40/month" on the page vs $1.20 for the 20 GB catalog option.
   The difference is probably snapshot size tiers; not resolved.
5. **Whether VPS is inside the SOC 2 scope.** "Bare Metal Cloud" is the control-panel section
   that contains VPS, but the report does not name VPS.
6. **Standard backup charge.** See 8.1.
7. **Local Zone list.** OVHcloud says 15 Local Zones and "more than 15 cities" for VPS-2 LZ,
   but does not publish the city list on the pages read; the map is a separate app.

## 10. Retrieval log

| # | Tool | URL | Result |
|---|---|---|---|
| 1 | TinyFish search | OVHcloud VPS pricing | found `us.ovhcloud.com/vps/`, configurator, SLA, support |
| 2 | TinyFish fetch | https://us.ovhcloud.com/vps/ | 200, full product page and plan cards |
| 3 | TinyFish fetch | https://us.ovhcloud.com/vps/configurator/ | login wall, no prices |
| 4 | curl | https://api.us.ovhcloud.com/1.0/order/catalog/public/vps?ovhSubsidiary=US | 200, 12.5 MB JSON, 245 plans, 389 addons, `taxRate: 0` |
| 5 | curl | https://eu.api.ovh.com/1.0/order/catalog/public/vps?ovhSubsidiary=US | 400 invalid subsidiary; US API used |
| 6 | TinyFish fetch | US billing article, snapshot guide, automated-backup guide | 200, full text |
| 7 | TinyFish fetch | additional-disk guide, upgrade guide | 200, full text |
| 8 | curl | https://docs.ovhcloud.com/en/llms/bare-metal-cloud-virtual-private-servers/llms.txt | 200, 24.5 KB documentation index |
| 9 | curl | 17 VPS guides as Markdown (`starting-with-a-vps`, `vps-faq`, `upgrade-resources`, `using-kvm-for-vps`, `using-snapshots-on-a-vps`, `using-automated-backups-on-a-vps`, `config-additional-disk`, `install-openclaw`, `install-hermes-agent`, `install-n8n-on-vps`, `install-docker-on-vps`, `install-ssl-certificate`, `firewall-linux-iptable`, `rescue`, `install-ia-agent-on-vps`, `landing-page-vps`, `understand-vps-control-panel`) | 200 each |
| 10 | TinyFish fetch | https://www.ovhcloud.com/en/vps/ | 200, international page (USD in this locale), confirms 3 Gbps and free backup |
| 11 | TinyFish fetch | https://www.ovhcloud.com/en-gb/lp/vps-localzone/ | 200, 28 locations / 15 Local Zones |
| 12 | TinyFish fetch | https://us.ovhcloud.com/identity-security-operations/identity-access-management/ | 200 |
| 13 | TinyFish fetch | https://us.ovhcloud.com/compliance/soc-1-2-3/ and https://us.ovhcloud.com/about/ | 200 |
| 14 | TinyFish fetch | https://us.ovhcloud.com/legal/terms-of-service/ and /legal/data-processing-agreement/ | 200 |
| 15 | TinyFish fetch | https://us.ovhcloud.com/legal/sla/vps/ | 200 |
| 16 | TinyFish fetch | https://support.us.ovhcloud.com/hc/en-us/articles/23896851215379-Object-Storage-FAQ | 200 |
| 17 | curl | https://api.us.ovhcloud.com/1.0/vps.json | 200, 52 API paths |
| 18 | curl | https://raw.githubusercontent.com/ovh/ovhcloud-cli/master/README.md | 200, `ovhcloud vps` commands |
| 19 | curl | https://raw.githubusercontent.com/ovh/python-ovh/master/README.rst | 200 |
| 20 | curl | https://raw.githubusercontent.com/ovh/node-ovh/master/README.md | 200 |
| 21 | curl | https://raw.githubusercontent.com/ovh/terraform-provider-ovh/master/docs/resources/vps.md | 200 |
| 22 | curl | https://www.status-ovhcloud.com/ | 200, JS app, "OVHcloud Status" |
| 23 | curl | https://docs.ovhcloud.com/en/guides/manage-and-operate/iam/logs-forwarding.md | 200 |
| 24 | curl | https://docs.ovhcloud.com/en/guides/manage-and-operate/api/first-steps.md | 200 |
| 25 | curl | https://docs.ovhcloud.com/en/guides/account-and-service-management/managing-billing-payments-and-services/faq-billing.md | 200 |
| 26 | TinyFish search | nested virt, custom ISO, MCP, audit logs, Terraform, preinstalled apps | used for discovery only |

No Composio connection failed. TinyFish handled search and most page fetches; curl was used
for Markdown documentation, JSON APIs and GitHub raw files, which are exact-text sources and
cheaper than a rendered fetch. No Amp native web tool was used. Prices were read fresh from
the live catalog and product pages on 2026-10-30, not from a cache.

## 11. Integration notes for the parent (not applied here)

This research folder is the only change. A dry run in a throwaway copy of `site/` — provider,
rate card, 16 feature rows, 78 capability rows, docs entries and 10 route rows merged —
built 160 pages with `validateContent()` passing, rendered `$5.35` on the provider page, and
passed all 44 cost tests. The parent still needs:

1. **`site/src/pages/compare/side-by-side.astro`**: add `ovhcloud: "VPS: KVM VM"` to `kinds`.
   Without it the comparison labels OVHcloud "Sandbox" (confirmed in the dry run).
2. **`site/src/data/changes.json`**: a dated entry for the new listing. OVHcloud launched the
   VPS 2027 range before this check; do not invent a launch date. The observation date is
   2026-10-30.
3. **`site/scripts/price-baseline.json`**: new money-bearing URLs are
   `https://us.ovhcloud.com/vps/` and
   `https://api.us.ovhcloud.com/1.0/order/catalog/public/vps?ovhSubsidiary=US`. Run
   `npm run check-rates` and read `NEW`/`OLD` output before `--update`.
4. **`site/src/lib/cost.test.ts`**: add `handWorked` cases A $5.35, B $10.00, C $5.35 for
   `ovhcloud`, derived from the table above, not from `price()`.
5. **Counts**: `README.md` says 21 providers (17 sandboxes, 4 VPS) and 1,638 capability rows.
   With OVHcloud it becomes 22 providers (17 sandboxes, 5 VPS) and 1,716 rows. Recheck
   `site/README.md` and `site/src/data/site.json` for any other hard-coded count.
6. **`situations.json`**: no change proposed. OVHcloud's case (cheap always-on VPS) is
   already made by Hostinger and Hetzner; a fourth VPS pick would add noise.
7. **Picks**: one proposed, `workflow-automation`, because the preinstalled n8n on VPS-1 at
   $5.35 is the cheapest supported n8n route in the set. Hermes and OpenClaw are route rows,
   not picks: Hostinger's one-click templates own that case.

## 12. Verification

**Correction after review.** The company facts were re-audited: each fact's value is now
limited to what its own quote states. The bundled "46 data centres, four continents, 100 Tbps
and 44 PoPs" fact was split, and the 100 Tbps and 44 PoP figures were dropped because no
single matched quote covered them. The legal entity, SLA credit, SOC and ISO facts were
likewise narrowed to their quoted scope; the unquoted extras (address, credit tiers, VPS not
being named) are either separate facts with their own quote or live in the caveats and this
ledger.

- All JSON artifacts parse. The capability file has 78 rows in the same order as
  `site/src/data/capabilities.json`; the feature file has all 16 IDs; routes cover all 10 use
  cases; docs cover all 16 topics.
- 72 distinct `(url, quote)` pairs were collected from the artifacts. 64 were re-fetched with
  curl and matched after normalization (HTML tags to spaces, whitespace collapsed, spaces
  around punctuation and quotes removed, Markdown backticks/asterisks removed, typographic
  quotes and dashes folded to ASCII for comparison only). The 8 Zendesk support-page quotes
  were re-fetched through TinyFish because curl receives a Cloudflare challenge; all 8
  matched. 0 failures.
- `price()` printed $5.35 / $10.00 / $5.35 for A/B/C, matching the hand-worked totals.
- Dry-run build in `/tmp/site-test`: 160 pages, `validateContent()` passed, structural audit
  reported 22 providers / 16 features / 78 capabilities / 10 use cases with coverage and
  evidence OK, and `npm test` passed 44/44.

**Tool spend:** $0.00. TinyFish search and fetch are billed at $0 per query and $0 per URL on
this account's rate card; the wallet showed $12.968 available at the end. curl and GitHub raw
fetches are free. No Exa, Tavily, Parallel, Firecrawl, Context or Amp native web call was
used, and no paid research run was started.

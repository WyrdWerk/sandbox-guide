# Contabo — provider research (Cloud VPS / Core VPS)

Research date: **2026-10-30**. Repository revision: `df4cd0c` (`origin/main` at the time of the
checkout). Target provider id: `contabo`. Desk research only: no account was created, no server was
ordered, nothing was billed.

**Scope.** Contabo's Cloud VPS (Core VPS) as a VPS-style provider: plans, billing, limits, access,
support and company. Performance VPS, Storage VPS, Cloud VDS, GPU VPS and dedicated servers are
described where they change a verdict, but the rate card prices Core VPS only. The 1-click images for
n8n, OpenClaw and Hermes are in scope because they decide the use-case routes.

**Tag legend**

| Tag | Meaning |
|---|---|
| `docs-confirmed` | Stated on docs.contabo.com, help.contabo.com, api.contabo.com or a Contabo product page. |
| `pricing-page` | Stated on a page whose subject is money (`/pricing/`, the VPS page's price block, the configurator). |
| `third-party` | Not from Contabo. Used only for ownership colour, never for a rate or verdict. |
| `inferred` | My reading of documented behaviour, not a sentence the source states. |
| `not-published` | Contabo does not answer the question on any page I could find. |

**Quote handling.** Quotes are copied from the fetched Markdown of each page on 2026-10-30. For
matching I removed Markdown emphasis (`**`), backticks and backslash escapes and underscores, and collapsed table
pipes and whitespace. No wording, number or qualifier was changed. The price tables render as
`$<br>5<br>28$ / month` in raw Markdown; the saved quote uses the normalised `$5.28`.

**Retrieval method.** Composio first: TinyFish `search` (6 successful queries) and `fetch_content`
(8 successful page fetches), Firecrawl `scrape` (12 successful rendered fetches, used for the
JavaScript pricing table and configurator), Exa `web_search_exa` (2 successful searches). Amp native
`read_web_page` was used as a fallback for 20 pages when the Composio route returned a generic
executor error or the wrong page; those pages are marked in the retrieval log. A direct `curl` of the
configurator hit a bot challenge and was not used as evidence. No cached scrape was used for a price:
every price below comes from a fresh fetch on 2026-10-30, cross-checked between the VPS page, the
pricing page and the configurator.

**Spend.** About 14 TinyFish calls, 12 Firecrawl scrapes for the research, about 40 Firecrawl
scrapes for quote verification, 2 Exa searches and 20 native reads. No deep-research report, no
browser-automation session and no paid dataset. Well inside the $1 cap; estimated under $0.30.

---

## 1. What the product is

Contabo sells KVM virtual machines. Core VPS is the entry family: shared vCPU cores, fixed RAM, SSD
storage, sold in six sizes. There is no sandbox API in front of it. `docs-confirmed`

> "Contabo VPS are KVM-based virtual servers with shared vCPU cores and a fixed RAM allocation" —
> [VPS documentation](https://docs.contabo.com/docs/servers-hosting/vps/)

> "Core VPS is the entry plan family: shared vCPU cores on infrastructure spanning multiple CPU
> generations, with SSD storage." — same page

> "Core VPS runs on proven infrastructure across multiple CPU generations, virtualized with KVM." —
> [Core VPS page](https://contabo.com/en-us/vps/)

The product ladder is Core VPS (SSD), Performance VPS (AMD EPYC + NVMe), Storage VPS (large SSD),
Cloud VDS (dedicated vCores) and GPU VPS (one RTX 6000 PRO configuration). `docs-confirmed`

> "Performance VPS is the upper plan family: shared vCPU cores on the latest AMD EPYC generations
> with PCIe Gen 4 NVMe storage and higher port speeds on the smaller plans." —
> [VPS documentation](https://docs.contabo.com/docs/servers-hosting/vps/)

> "GPU VPS is a Performance VPS instance with a physically dedicated NVIDIA GPU attached via PCIe
> passthrough: the guest OS has direct access to the whole device, one GPU per instance." —
> [GPU VPS documentation](https://docs.contabo.com/docs/servers-hosting/gpu-vps/)

The default images are ordinary Linux and Windows Server. Root, SSH and any TCP port come with the
machine. `docs-confirmed`

> "then access the server through SSH (Linux) or RDP (Windows)." —
> [Core VPS FAQ](https://contabo.com/en-us/vps/)

> "Reliable uptime, predictable resources, and full root access." — same page

---

## 2. Prices (fresh read, 2026-10-30)

### 2.1 Core VPS, 1-month term vs 24-month term

The VPS page shows a large standard price and a smaller "for the first 24 months" price. The
configurator shows the term ladder in EUR; the en-US prices are a fixed 1.2× the EUR list.

> "$6.60" — [Core VPS page](https://contabo.com/en-us/vps/) `pricing-page`

> "$5.28 Including VAT Excluding VAT for the first 24 months" — same page `pricing-page`

> "The price displayed is the effective monthly rate for a 24-month subscription including
> applicable taxes" — same page `pricing-page`

Configurator, Cloud VPS 4, 2026-10-30:

> "1 Month **€5.50** / month No Setup Fee 3 Months **€5.50** / month No Setup Fee 6 Months
> **€5.50** / month No Setup Fee" —
> [Cloud VPS 4 configurator](https://contabo.com/en-us/vps/cloud-vps-core-4) `pricing-page`

> "12 Months €5.50 / month**€4.68** / month" — same configurator `pricing-page`

> "24 Months €5.50 / month**€4.40** / month" — same configurator `pricing-page`

The arithmetic confirms the mapping: €5.50 × 1.2 = $6.60 and €4.40 × 1.2 = $5.28. The one rounding
difference is Cloud VPS 16: €37.00 × 1.2 = $44.40, but the USD page shows $44.50.

| Plan | vCPU | RAM | Disk | Port | 1-month USD | 24-month USD | 24-month upfront |
|---|---:|---:|---|---:|---:|---:|---:|
| Cloud VPS 4 | 4 | 8 GB | 100 GB SSD | 200 Mbit/s | $6.60 | $5.28 | $126.72 |
| Cloud VPS 6 | 6 | 12 GB | 200 GB SSD + 100 GB NVMe | 300 Mbit/s | $9.00 | $7.20 | $172.80 |
| Cloud VPS 8 | 8 | 24 GB | 300 GB SSD + 150 GB NVMe | 600 Mbit/s | $16.80 | $13.44 | $322.56 |
| Cloud VPS 12 | 12 | 48 GB | 400 GB SSD + 200 GB NVMe | 800 Mbit/s | $30.00 | $24.00 | $576.00 |
| Cloud VPS 16 | 16 | 64 GB | 500 GB SSD + 250 GB NVMe | 1 Gbit/s | $44.50 | $35.60 | $854.40 |
| Cloud VPS 18 | 18 | 96 GB | 600 GB SSD + 300 GB NVMe | 1 Gbit/s | $58.80 | $47.04 | $1,128.96 |

The 1-month figures are the large numbers on the VPS page; the 24-month figures are the "for the
first 24 months" numbers, which the pricing page repeats. The 24-month upfront totals are my
arithmetic (24 × the monthly figure), not a published total.

### 2.2 Setup fee

No setup fee was shown for any term. `pricing-page`

> "1 Month **€5.50** / month No Setup Fee 3 Months **€5.50** / month No Setup Fee 6 Months
> **€5.50** / month No Setup Fee" —
> [Cloud VPS 4 configurator](https://contabo.com/en-us/vps/cloud-vps-core-4)

The same "No Setup Fee" label appears under the 12- and 24-month options.

Contabo announced a VPS setup-fee waiver in 2014: "Contabo waived the setup fee on all VPS plans!"
([2014 blog post](https://contabo.com/blog/contabo-waived-setup-fee-vps-plans/), `docs-confirmed`).
The current configurator is the operative evidence.

### 2.3 Add-ons (net EUR, configurator)

All rows were read from the Cloud VPS 4 configurator on 2026-10-30 (`pricing-page`); the term-ladder
quote above is from the same page.

| Add-on | Price on Cloud VPS 4 | Source |
|---|---|---|
| Auto Backup | €1.65/month | Configurator |
| Private Networking | €2.29/month | Configurator; marketing page says €2.73 including VAT |
| One additional IPv4 | €3.50/month | Configurator |
| 100 GB extra SSD (100 → 200 GB) | €1.50/month | Configurator |
| Windows Server licence | €8.00/month | Configurator |
| cPanel (5 accounts) | €23.50/month | Configurator |
| Plesk Web Admin | €13.50/month | Configurator |

The marketing page's private-networking price is the VAT-inclusive version of the configurator's
€2.29 (€2.29 × 1.19 = €2.73). `pricing-page`

> "The monthly fee is: €2.73 for each Cloud VPS" —
> [Private Networking](https://contabo.com/en/private-networking/)

### 2.4 Other products mentioned but not priced

These are context, not inputs to the card. Specs come from the VPS documentation table
(`docs-confirmed`); the 24-month prices come from the pricing page (`pricing-page`). The 1-month
figures marked "inferred" are the 24-month price ÷ 0.8, because the 24-month term is 20% cheaper
than the 1-month term on Core VPS ($6.60 → $5.28). This is a term discount, separate from the
EUR→USD 1.2 conversion.

- Performance VPS: 4–18 vCPU, 8–96 GB, 150–900 GB NVMe, from $13.00 on 24 months ($16.25 on 1 month,
  inferred; the en-US home page shows $16.25).
- Storage VPS: 2–14 vCPU, 4–50 GB, 300 GB–1.4 TB SSD, from $5.28 on 24 months ($6.60 on 1 month,
  inferred).
- Cloud VDS: 6–24 dedicated vCores, 24–96 GB, 180–720 GB NVMe, from $52.00 on 24 months ($65.00 on
  1 month, inferred).
- GPU VPS: one RTX 6000 PRO, 18 vCPU / 96 GB / 900 GB NVMe, EU and US Central, waitlist at this
  check.

> "|Cloud VPS Plus 4 |4 vCPUs (AMD EPYC) |8 GB |150 GB NVMe |500 |Unlimited\* |" —
> [VPS documentation](https://docs.contabo.com/docs/servers-hosting/vps/) `docs-confirmed`

> "|Cloud VDS XXL |24 vCores |AMD EPYC 7282, 2.8 GHz |96 GB |720 GB NVMe |1,000 |Unlimited\* |" —
> [VDS documentation](https://docs.contabo.com/docs/servers-hosting/max-performance-vps/)
> `docs-confirmed`

> "|Storage VPS 50 |14 vCPUs |50 GB |1.4 TB SSD |1,000 |Unlimited\* |" — same page `docs-confirmed`

---

## 3. Billing and contract — what a buyer should know

### 3.1 Monthly plans only, prepaid

> "One monthly price covers the resources, the network, and the platform." —
> [Core VPS page](https://contabo.com/en-us/vps/) `docs-confirmed`

> "If the customer selects a contractual term of one month for server services, then the total price
> will fall due immediately." —
> [Terms, Clause 4](https://contabo.com/en/legal/terms-and-conditions/) `docs-confirmed`

There is no hourly or per-second rate. The smallest unit is one month, so a ten-minute task costs a
month unless it shares a server with other work.

### 3.2 A stopped server still bills

> "The service will remain active until the end of its current billing period." —
> [Help: add or remove a service](https://help.contabo.com/en/support/solutions/articles/103000387511-i-would-like-to-add-or-remove-a-service)
> `docs-confirmed`

Powering off keeps the disk but not the bill. This is an inference from the term-based contract, not
a sentence that says "a stopped server bills"; the cancellation article and the absence of any
hourly or stopped-storage rate make it the only reading. `inferred`

### 3.3 Minimum term, renewal and cancellation

> "Minimum initial contract length: 1 month | Minimum following contract length: Equal to the initial
> contract length | Minimum cancellation notice: None (pre-paid) or 4 weeks (post-paid)." —
> [Core VPS page](https://contabo.com/en-us/vps/) `docs-confirmed`

The Terms say something stricter:

> "The contractual term will be extended by an additional period equivalent to the one selected for
> the initial term" — [Terms, Clause 5](https://contabo.com/en/legal/terms-and-conditions/)
> `docs-confirmed`

> "so long as neither party has declared termination observing a notice period of four weeks until
> the end of the initial term or of an Extension Period." — same clause `docs-confirmed`

The model assumes a 1-month prepaid term that ends at the end of the paid month. A buyer should
confirm in the panel which rule applies to their contract. See Contradiction 2.

### 3.4 Shared CPU, not dedicated

> "A VPS shares physical CPU cores across multiple customers on the same host" —
> [Contabo blog: VPS to VDS](https://contabo.com/blog/vps-to-vds-upgrade-path/) `docs-confirmed`

> "Performance consistency | Can vary with neighboring tenant load" — same page `docs-confirmed`

> "CPU and RAM are dedicated allocations but shared at the hypervisor level." —
> [VPS documentation](https://docs.contabo.com/docs/servers-hosting/vps/) `docs-confirmed`

The two statements are consistent in practice: you are allocated 4 vCPU, but they are not four
physical cores reserved for you. Contabo does not publish a vCPU-to-physical-core ratio and does not
use the word oversubscription; the documented facts are shared cores and performance that can vary
with neighbours. See Contradiction 1.

### 3.5 Network: unlimited traffic, fair-use throttle, no bandwidth guarantee

> "Outgoing Traffic: Unlimited — fair usage policy applies based on average server workloads. To
> maintain fair network performance for all customers, Contabo reserves the right to throttle
> servers with exceptionally high or disruptive usage patterns." —
> [Core VPS page](https://contabo.com/en-us/vps/) `pricing-page`

> "the Provider cannot guarantee the level/volume of the bandwidth that will actually be available
> for an individual server" — [Terms, Clause 11](https://contabo.com/en/legal/terms-and-conditions/)
> `docs-confirmed`

Port speeds: 200 Mbit/s on Cloud VPS 4, 300 on VPS 6, 600 on VPS 8, 800 on VPS 12, 1 Gbit/s on VPS
16 and 18. Inbound is unmetered; outbound is unmetered under fair use. `docs-confirmed`

> "|Cloud VPS 4 |4 vCPUs |8 GB |100 GB SSD |200 |1 |Unlimited\* |" —
> [VPS documentation](https://docs.contabo.com/docs/servers-hosting/vps/) `docs-confirmed`

### 3.6 Snapshots and backups

> "Image of the VPS disk, retained for 30 days" —
> [VPS documentation](https://docs.contabo.com/docs/servers-hosting/vps/) `docs-confirmed`

> "After 30 days, the snapshots will be deleted." —
> [Help: snapshots](https://help.contabo.com/en/support/solutions/articles/103000270385-how-do-i-create-a-snapshot-of-my-server-)
> `docs-confirmed`

> "Taking a snapshot does not use any disk space." — same page `docs-confirmed`

> "Snapshots cannot be downloaded." — same page `docs-confirmed`

Cloud VPS 4 includes one snapshot slot, VPS 6 two, VPS 8 and larger three. Auto Backup is a paid
add-on:

> "Auto Backup provides 10 days of daily off-server backups" —
> [Auto Backup documentation](https://docs.contabo.com/docs/servers-hosting/vps-auto-backup/)
> `docs-confirmed`

> "Contabo ensures that backups are performed and that backup data is accessible, but does not
> guarantee recoverability and does not perform recovery on the customer’s behalf." — same page
> `docs-confirmed`

> "Restores are whole-VPS restores; individual-file restore is not offered." — same page
> `docs-confirmed`

### 3.7 Support terms

> "Contabo provides full technical assistance for the Contabo VPS itself - including the network,
> hardware, and initial setup of any 1-click Add-Ons." —
> [Core VPS page](https://contabo.com/en-us/vps/) `docs-confirmed`

> "Any additional open source software included in the applications is owned by the respective
> provider - maintenance, upgrading, and troubleshooting are within the end-users responsibility." —
> same page `docs-confirmed`

> "2 Hours Average Response Time" —
> [Support experience](https://contabo.com/en-us/support-experience) `docs-confirmed`

> "Since we are currently receiving a high number of incoming requests, waiting time is longer than
> usual." — same page `docs-confirmed`

The two-hour figure is an average, not a contractual response time. The Terms limit support to what
is contractually agreed:

> "The Provider’s obligation to render technical support to the customer is limited to what has been
> contractually agreed." — [Terms, Clause 2](https://contabo.com/en/legal/terms-and-conditions/)
> `docs-confirmed`

### 3.8 Upgrades, downgrades and migrations

> "Data is transferred to the upgraded server with no data loss. Requires a short reboot once
> migration completes." —
> [Help: plan changes](https://help.contabo.com/en/support/solutions/articles/103000269700-how-to-make-changes-to-your-vps-or-vds-plan)
> `docs-confirmed`

> "Downgrading as a direct action is not possible." — same page `docs-confirmed`

> "No direct downgrade: requires a new smaller server, manual data migration and cancellation of the
> original — the IP address changes." —
> [VPS documentation](https://docs.contabo.com/docs/servers-hosting/vps/) `docs-confirmed`

An upgrade keeps the IP and can preserve the data, but needs a short reboot. A downgrade or a
plan-family change is a new server with a new IP and a manual migration. A region migration also
changes both IPs and may add a monthly location surcharge; the live-migration fee is €33.00 / $38.50
/ £33.00 plus VAT. `docs-confirmed`

### 3.9 Images and 1-click apps

> "An OS image with an application preinstalled and configured at first boot." —
> [Images documentation](https://docs.contabo.com/docs/servers-hosting/images/) `docs-confirmed`

> "VPS and VDS (Max Performance VPS) | OpenClaw · n8n · Nextcloud · WireGuard · GitLab CE · cPanel ·
> Plesk · Dokploy · Paperclip AI · Hermes Agent · Ollama" — same page `docs-confirmed`

OpenClaw and Hermes still need a terminal step:

> "Once your server is deployed with OpenClaw installed, connect via SSH and run the onboarding
> wizard." — [OpenClaw hosting](https://contabo.com/en-us/openclaw-hosting) `docs-confirmed`

> "SSH into the server and point the Agent at a model and connect the integrations you want." —
> [Hermes hosting](https://contabo.com/en-us/hermes-ai-vps-hosting) `docs-confirmed`

n8n is the exception:

> "Once we've set up your server including n8n, it's over to you!" —
> [n8n hosting](https://contabo.com/en-us/n8n-hosting) `docs-confirmed`

> "access n8n's visual workflow editor via your hostname IP address" — same page `docs-confirmed`

> "The entire provisioning process including installation of the n8n image can take up to 30
> minutes" — same page `docs-confirmed`

### 3.10 Access, secrets and teams

> "Every server is assigned a public IPv4 address and an IPv6 subnet; further IPv4 addresses are
> available up to a per-product maximum." —
> [IP assignment](https://docs.contabo.com/docs/network-services/ip-assignment/) `docs-confirmed`

> "The primary IPv4 address persists for the lifetime of the server." — same page `docs-confirmed`

> "Default policy: all inbound traffic is dropped by a permanent default rule; outbound traffic is
> unrestricted." — [Firewall](https://docs.contabo.com/docs/network-services/firewall/)
> `docs-confirmed`

> "Traffic logs are not available in the Control Panel." — same page `docs-confirmed`

> "You can optionally save your passwords or public ssh keys using the Secrets Management API." —
> [API documentation](https://api.contabo.com/) `docs-confirmed`

> "The type of the secret. Can be `password` or `ssh`" — same page `docs-confirmed`

> "A Contabo account can have several users. Each user holds a role that determines which areas of
> the account and which functions are accessible." —
> [User management](https://docs.contabo.com/docs/account-management/user-management/)
> `docs-confirmed`

The API exposes audit lists for instances, actions, snapshots, images, object storage, private
networks, tags, users, roles, secrets, domains, DNS and firewalls, each with a changedBy field and
timestamps. There is no account-wide audit log with export or a published retention period.
`docs-confirmed` / `inferred`

### 3.11 Object storage (separate product)

> "Contabo Object Storage is an S3-compatible object storage service built on a Ceph cluster" —
> [Object Storage documentation](https://docs.contabo.com/docs/storage/object-storage/)
> `docs-confirmed`

> "SFTP/SCP, FTP/FTPS, NFS/CIFS/SMB and RTSP are not supported — access is via the S3 API and web UI;
> use a FUSE client (s3fs-fuse, goofys) for filesystem access." — same page `docs-confirmed`

> "Capacity | Added in 250 GB increments" — same page `docs-confirmed`

It is not a block volume and cannot be attached as a disk. A FUSE mount is possible with software
you run yourself.

---

## 4. Company, compliance and support

| Fact | Value | Source | Tag |
|---|---|---|---|
| Legal entity | Contabo GmbH, Welfenstrasse 22, 81541 Munich; AG Munich HRB 180722; VAT DE267602842; MDs Stephan Wolfram and Mario Wilhelm | [Impressum](https://contabo.com/en/legal/impressum/) | `docs-confirmed` |
| Founded | Spring 2003 as Giga-International; renamed Contabo in 2013 | [About](https://contabo.com/en-us/about-us) | `docs-confirmed` |
| Scale | ~300 staff; 275,000+ customers in 190 countries; 450,000 servers; 11 locations in 9 regions on 4 continents | [About](https://contabo.com/en-us/about-us) | `docs-confirmed` |
| Ownership | KKR agreed a majority stake in June 2022; Oakley Capital minority; management and the hosting entrepreneurs retain stakes | [KKR press release, 2022-06-08](https://www.kkr.com/content/dam/kkr/country-sites/de/press-release/20220608-pressemitteilung-kkr-erwirbt-mehrheitsbeteiligung-am-globalen-cloud-infrastruktur-und-hosting-anbieter-contabo.pdf) | `third-party` |
| Uptime promise | 99.9% annual average physical connectivity; no credit formula | [Terms, Clause 11](https://contabo.com/en/legal/terms-and-conditions/) | `docs-confirmed` |
| DPA | Standardised GDPR DPA created in the panel, covering VPS/VDS/dedicated/object storage | [DPA docs](https://docs.contabo.com/docs/dpa/dpa/) | `docs-confirmed` |
| Certifications | India location page lists ISO 27001, 27017, 27018, PCI DSS and SOC 1/SOC 2 Type 2 for the data centre | [India location](https://contabo.com/en-us/locations/india/) | `docs-confirmed` (holder unclear) |
| Status page | Public incidents and maintenance | [contabo-status.com](https://contabo-status.com/) | `docs-confirmed` |
| Support | Ticket support; 2-hour average response; no response SLA | [Support experience](https://contabo.com/en-us/support-experience) | `docs-confirmed` |

Verbatim evidence for the table:

> "Contabo GmbH" — [Impressum](https://contabo.com/en/legal/impressum/) `docs-confirmed`

> "Originally known as \"Giga-International,\" we rebranded to Contabo in 2013" —
> [About](https://contabo.com/en-us/about-us) `docs-confirmed`

> "275,000+ Customers in 190 Countries" — same page `docs-confirmed`

> "we're powering over 450,000 servers worldwide" — same page `docs-confirmed`

> "Operating across 11 locations in 9 regions on 4 continents" — same page `docs-confirmed`

> "about 300 dedicated professionals" — same page `docs-confirmed`

> "KKR, ein weltweit führender Investor, hat Vereinbarungen über den Erwerb einer
> Mehrheitsbeteiligung an Contabo" —
> [KKR, 2022-06-08](https://www.kkr.com/content/dam/kkr/country-sites/de/press-release/20220608-pressemitteilung-kkr-erwirbt-mehrheitsbeteiligung-am-globalen-cloud-infrastruktur-und-hosting-anbieter-contabo.pdf)
> `third-party`

> "available at an annual average rate of 99.9%" —
> [Terms, Clause 11](https://contabo.com/en/legal/terms-and-conditions/) `docs-confirmed`

> "A Data Processing Agreement (DPA) is a contract between Contabo and its customer that governs the
> processing of personal data by Contabo on behalf of the customer" —
> [DPA documentation](https://docs.contabo.com/docs/dpa/dpa/) `docs-confirmed`

> "SOC 2 Type 2 Report" — [India location](https://contabo.com/en-us/locations/india/)
> `docs-confirmed` (holder unclear)

> "2 Hours Average Response Time" —
> [Support experience](https://contabo.com/en-us/support-experience) `docs-confirmed`

Contabo does not publish a trust centre, a SOC 2 report request route, or a statement that the SOC 2
report covers its VPS platform. The location-page certifications appear in a data-centre
specifications block and may belong to the facility operator. `not-published`

---

## 5. Contradictions

### 5.1 Shared cores described two ways

> "A VPS shares physical CPU cores across multiple customers on the same host" —
> [blog](https://contabo.com/blog/vps-to-vds-upgrade-path/)

> "CPU and RAM are dedicated allocations but shared at the hypervisor level." —
> [docs](https://docs.contabo.com/docs/servers-hosting/vps/)

The model treats Core VPS as shared: performance can vary with neighbours, and a buyer who needs
guaranteed cores must move to Cloud VDS. The docs sentence is about the allocation being fixed, not
about a reserved physical core.

### 5.2 Cancellation notice: none vs four weeks

> "Minimum cancellation notice: None (pre-paid) or 4 weeks (post-paid)." —
> [Core VPS page](https://contabo.com/en-us/vps/)

> "The contractual term will be extended by an additional period equivalent to the one selected for
> the initial term ... observing a notice period of four weeks" —
> [Terms, Clause 5](https://contabo.com/en/legal/terms-and-conditions/)

The model assumes the prepaid 1-month term ends at the end of the paid month. A buyer should confirm
in the panel; the Terms are the stricter document and the German version prevails in ambiguity.

### 5.3 $5.28 is not the monthly price

> "$6.60 ... $5.28 / month ... for the first 24 months" — [Core VPS page](https://contabo.com/en-us/vps/)

> "The price displayed is the effective monthly rate for a 24-month subscription including
> applicable taxes" — same page

The card uses $6.60, the 1-month price. The $5.28 rate requires a 24-month commitment and $126.72
upfront.

### 5.4 The support page still says 75 GB NVMe

> "Starts with 4 vCPU cores, 8 GB RAM, and 75 GB NVMe." —
> [Support experience](https://contabo.com/en-us/support-experience)

> "|Cloud VPS 4 |4 vCPUs |8 GB |100 GB SSD |200 |1 |Unlimited\* |" —
> [VPS documentation](https://docs.contabo.com/docs/servers-hosting/vps/)

The VPS page, pricing page and docs all say 100 GB SSD. The support strip looks stale; the model uses
100 GB SSD.

### 5.5 Auto Backup appears free on its own page

The Auto Backup page headlines Cloud VPS 4 at €5.50 with "Auto Backup Included", which is the base
plan price, while the configurator charges €1.65/month for the add-on. The configurator is the
operative price; the page is marketing. `pricing-page`

### 5.6 Customer count varies by page

The About page says "275,000+ Customers in 190 Countries" and "over 450,000 servers"; the VPS page
says "300,000+ Customers Worldwide" and "575,000+ Servers Running"; one About paragraph still says
"Over 20,000 customers agree". The company facts use the About page's headline figures and note that
the pages disagree. `docs-confirmed`

### 5.7 USD is a fixed 1.2× the EUR list

Every USD price is 1.2× the EUR price (€5.50 → $6.60, €4.40 → $5.28), with a small rounding
difference on Cloud VPS 16 ($44.50 vs $44.40). This is a pricing convention, not a market FX rate.
The account currency is fixed at order, and EU consumers pay VAT on top. `pricing-page` / `inferred`

---

## 6. Unknowns

1. **Is 8 GB decimal or binary?** Contabo says GB. If decimal, 8 GB = 7.45 GiB and workload B's
   8 GiB request does not fit. No page states the unit.
2. **What is the CPU oversubscription ratio and which CPU models?** Core VPS spans "multiple CPU
   generations"; no per-plan CPU model or vCPU-to-core ratio is published.
3. **Can a snapshot be used to create a new server?** The docs describe restore to the same instance
   only. A snapshot-as-template path is not documented.
4. **Can an API user be restricted to one server or project?** Roles limit areas, not resources.
   No per-key scope is documented.
5. **Is a SOC 2 report available to customers, and what does it cover?** Location pages list one;
   no trust centre or request route.
6. **Are there spend alerts or a hard account cap?** Nothing is published beyond the prepaid term.
7. **Is SAML/OIDC SSO available?** Only a Contabo-account login and a one-time SSO token for the
   panel are documented.
8. **What does Auto Backup cost in USD?** The configurator shows €1.65/month on Cloud VPS 4; no USD
   add-on table was found.
9. **Is the $6.60 price promotional?** It is shown as the standard price next to the 24-month
   discount, but Contabo runs frequent promotions; no end date is published.
10. **Does a 1-month prepaid contract auto-renew?** The Terms say yes with four weeks' notice; the
    VPS footnote says no notice for prepaid. Unresolved.
11. **Is IPv6-only available?** Every plan includes IPv4; no IPv6-only option is documented.
12. **Is the GPU VPS orderable?** The pricing page showed a waitlist on 2026-10-30.

---

## 7. A, B and C

Worked in full in [`abc.md`](abc.md). Summary:

| Case | Shape | Bill | Why |
|---|---|---:|---|
| A | Cloud VPS 4, one plan for 1,000 × 10-minute tasks | $6.60 | 166.67 h fits one month; no hourly meter |
| B | Cloud VPS 4, 730 h | $6.60 | 4 vCPU / 8 GB / 100 GB exact fit |
| C | Cloud VPS 4, 90 running + 640 stopped | $6.60 | The plan bills through the stopped hours |

The engine (`price()` with `presets.a/b/c`) prints $6.60 for all three, with the plan "Monthly
(1-month term)" and the shape "Cloud VPS 4: 4 vCPU / 8 GiB / 100 GiB". Hand-worked and engine
totals agree. No engine change is needed: `monthlyPlans`, `Shape.monthly`, `between: "kept"` and
`maxVcpu`/`maxRam`/`maxDisk` express this tariff. The card does not model the 24-month prepay or the
add-ons, and says so.

---

## 8. Feature dispositions (16)

| Feature | Verdict | Figure | Why |
|---|---|---|---|
| isolation | yes | KVM VM; root, Docker | Full VM, own kernel, root; nested virt only on VDS |
| sizes-regions | partly | 18 vCPU / 96 GB; 9 regions | Fixed ratios; no 2 vCPU / 16 GB shape |
| billing-models | partly | $6.60/mo, monthly only | Flat monthly plan; no hourly or per-second meter |
| trials-free-tiers | no | No trial or credit | No free tier, trial or signup credit advertised |
| lifecycle | no | Stop loses memory | Power-off only; no pause or hibernate |
| snapshots-forks | partly | Disk only; 1 slot, 30 days | Disk image, one slot on VPS 4, auto-deleted |
| storage | yes | Whole disk; +1.2 TB max | Whole disk persists; Storage Extension adds capacity |
| idle-timers | yes | No idle stop | Runs until stopped or cancelled |
| reaching-it | yes | Public IPv4; SSH; VNC | Static IPv4, any port, SSH, VNC console |
| custom-domains | partly | DNS yes; TLS yourself | DNS and PTR managed; no certificate service |
| outbound-network | yes | Unlimited, fair use | No per-GiB charge; throttle reserved |
| keys-secrets | partly | Provisioning secrets only | Password/SSH store, no env-var injection |
| ways-to-drive | yes | Panel, API, CLI, Terraform | REST API, cntb, Terraform, cloud-init |
| built-in-agents | partly | OpenClaw, Hermes, n8n images | 1-click images; OpenClaw/Hermes need SSH |
| teams-accounts | partly | 8 roles; no SSO or cap | Users and roles; no SSO, cap or alerts |
| company | partly | GmbH; 99.9%; no SOC 2 offer | 99.9% promise without credits; SOC 2 unclear |

---

## 9. Capability dispositions (78)

All 78 rows are in [`capability-rows.json`](capability-rows.json), each with a source. Counts:
**27 yes, 14 partly, 35 no, 2 not-published** (the exact split is in the JSON; this line is a
reading aid, not a schema field).

| Capability | Verdict | Capability | Verdict |
|---|---|---|---|
| own-vm | yes | root | yes |
| docker-inside | yes | nested-virt | partly |
| custom-image | yes | any-size | no |
| big-machines | yes | live-resize | partly |
| gpu | partly | choose-region | yes |
| eu-region | yes | pause-memory | no |
| warm-pool | no | fast-start | no |
| snapshot-files | yes | snapshot-memory | no |
| fork-running | no | older-snapshot | partly |
| templates | no | backups | yes |
| files-survive-stop | yes | volumes | no |
| shared-volume | no | mount-buckets | partly |
| big-disk | yes | stay-on | yes |
| choose-idle | partly | wake-on-request | no |
| schedules | no | public-url | yes |
| private-url | no | ssh | yes |
| web-terminal | partly | tunnel | yes |
| raw-tcp | yes | custom-domain | yes |
| auto-https | no | egress-included | yes |
| egress-allowlist | no | no-internet | no |
| static-ip | yes | secrets-store | partly |
| hidden-secrets | no | scoped-keys | partly |
| dashboard-create | yes | cli | yes |
| python-sdk | no | ts-sdk | no |
| rest-api | yes | mcp-server | no |
| pty | no | file-api | no |
| agents-preinstalled | no | prompt-api | no |
| one-click-hermes | partly | one-click-openclaw | partly |
| browser | no | desktop | no |
| hosts-other-agents | no | team-workspace | yes |
| roles | yes | sso | no |
| spend-cap | partly | usage-alerts | not-published |
| audit-log | partly | per-second | no |
| active-cpu | no | cheap-pause | no |
| no-monthly-fee | no | flat-price | yes |
| free-tier | no | free-credit | no |
| no-card | no | status-page | yes |
| sla | partly | soc2 | not-published |
| dpa | yes | open-source | no |

### Notes on the less obvious verdicts

- **nested-virt = partly.** Nested virtualisation is supported on the dedicated-core Cloud VDS
  line (Proxmox VE, KVM, XenServer) but not on Core VPS, which is what the card prices.
- **gpu = partly.** A real GPU VPS exists (one RTX 6000 PRO configuration, EU and US Central), but
  it was on a waitlist, cannot be customised, and is not part of the Cloud VPS card.
- **live-resize = partly.** An in-place upgrade keeps the IP and can preserve data, but needs a short
  reboot; a downgrade is a new server with a new IP.
- **older-snapshot = partly.** Any snapshot you still hold can be restored, but Cloud VPS 4 holds
  only one and every snapshot is deleted at 30 days.
- **templates = no.** Custom images are uploaded from outside; there is no capture-a-server action
  and snapshots are not documented as a template source.
- **mount-buckets = partly.** S3-compatible buckets exist, and Contabo documents s3fs-fuse/goofys,
  but there is no native mount.
- **web-terminal = partly.** A VNC console, not a browser shell.
- **scoped-keys = partly.** Eight account roles, including for API users, but no per-key or
  per-resource scope.
- **audit-log = partly.** Rich per-resource API audit lists, no account-wide export or retention
  statement.
- **sla = partly.** A written 99.9% annual average for physical connectivity, with no service credit.
- **soc2 = not-published.** A report is listed on data-centre pages; no Contabo trust centre or
  request route.
- **open-source = no.** The CLI is open source; the platform is not self-hostable.

---

## 10. Use-case dispositions (10)

| Use case | Tier | No terminal? | Disposition |
|---|---|---|---|
| hermes-agent | one-click | no | Image exists; SSH onboarding; no pick |
| openclaw | one-click | no | Image exists; SSH onboarding; no pick |
| coding-agent | manual | no | Cheap always-on box; monthly billing hurts occasional use; no pick |
| code-interpreter | none | no | No per-run sandbox; monthly plans only |
| browser-agent | manual | no | Shared machine and one IP; no pick |
| workflow-automation | one-click | yes | **Pick**: genuine no-terminal n8n at $6.60 |
| chat-bot | manual | no | Good price for an always-on bot; no template |
| claude-code-team | manual | no | One box per developer; no SSO or cap |
| scheduled-scraper | manual | no | 20 h of work costs a full month; no pick |
| mcp-server | manual | no | Public IP, always on; TLS is yours |

Only n8n is proposed as a pick. OpenClaw and Hermes are one-click images but still require SSH, so
they are route rows. No situation pick is proposed: Hetzner already occupies "stay available" and
"EU residency", and Contabo's shared cores and missing SOC 2 report make it a weaker default.

---

## 11. Retrieval log (2026-10-30)

| # | URL | Tool | Result |
|---|---|---|---|
| 1 | `https://contabo.com/en-us/pricing/` | TinyFish fetch + Firecrawl | Full plan table, traffic footnote; prices read fresh |
| 2 | `https://contabo.com/en-us/vps/` | Firecrawl (twice) | Standard and 24-month prices, FAQ, contract footnote |
| 3 | `https://contabo.com/en-us/vps/cloud-vps-core-4` | Firecrawl | Term ladder (€5.50/€4.68/€4.40), no setup fee, add-ons |
| 4 | `https://docs.contabo.com/docs/servers-hosting/vps/` | Native read | Plans, shared vCPU, nested virt, limits, API/CLI |
| 5 | `https://docs.contabo.com/docs/servers-hosting/images/` | Native read | 1-click app list, custom image formats |
| 6 | `https://docs.contabo.com/docs/servers-hosting/vps-auto-backup/` | Native read | 10 daily backups, restore limits |
| 7 | `https://docs.contabo.com/docs/servers-hosting/gpu-vps/` | Native read | GPU configuration and limits |
| 8 | `https://docs.contabo.com/docs/network-services/ip-assignment/` | Native read | Static IPv4, IPv6, IP changes |
| 9 | `https://docs.contabo.com/docs/network-services/firewall/` | Native read | Inbound-only filtering, no traffic logs |
| 10 | `https://docs.contabo.com/docs/network-services/dns-management/` | Native read | DNS zones, PTR, no TLS |
| 11 | `https://docs.contabo.com/docs/storage/object-storage/` | Native read | S3 compatibility, quotas, FUSE clients |
| 12 | `https://docs.contabo.com/docs/account-management/user-management/` | Native read | Eight roles, API credentials |
| 13 | `https://docs.contabo.com/docs/dpa/dpa/` | Native read | Online DPA and covered services |
| 14 | `https://api.contabo.com/` | Native read | Endpoints, OAuth2, secrets, audits |
| 15 | `https://contabo.com/en/legal/terms-and-conditions/` | Firecrawl (three reads) | Clauses 2, 4, 5, 11 |
| 16 | `https://contabo.com/en/legal/impressum/` | Firecrawl | Entity, HRB, VAT |
| 17 | `https://contabo.com/en-us/about-us` | Firecrawl | History, scale, staff |
| 18 | `https://contabo.com/en-us/locations/` | Firecrawl | Nine regions, five German DCs |
| 19 | `https://contabo.com/en-us/locations/india/` | Native read | Facility certifications, migration fee |
| 20 | `https://contabo.com/en-us/support-experience` | Native read | 2-hour average, 365 days, 75 GB stale line |
| 21 | `https://contabo.com/en-us/openclaw-hosting` | Native read | Image, SSH onboarding, support scope |
| 22 | `https://contabo.com/en-us/hermes-ai-vps-hosting` | Native read | Image, SSH onboarding |
| 23 | `https://contabo.com/en-us/n8n-hosting` | Native read | Image, web UI, 30-minute install |
| 24 | `https://help.contabo.com/en/support/solutions/articles/103000270385-how-do-i-create-a-snapshot-of-my-server-` | Native read | 30-day deletion, no download |
| 25 | `https://help.contabo.com/en/support/solutions/articles/103000269700-how-to-make-changes-to-your-vps-or-vds-plan` | Native read | Upgrade reboot, no downgrade |
| 26 | `https://help.contabo.com/en/support/solutions/articles/103000387511-i-would-like-to-add-or-remove-a-service` | Native read | Active to end of billing period |
| 27 | `https://contabo.com/en/contabo-api/` | TinyFish | API capabilities |
| 28 | `https://contabo.com/en/contabo-cli/` | TinyFish | CLI, JSON/YAML/CSV |
| 29 | `https://contabo.com/en/auto-backup/` | TinyFish | Auto Backup marketing and 10-day retention |
| 30 | `https://contabo.com/en/custom-images/` | TinyFish | ISO/QCOW2, upload routes |
| 31 | `https://contabo.com/en/private-networking/` | TinyFish | €2.73 incl. VAT per instance, /22 max |
| 32 | `https://contabo.com/en/cloud-init/` | TinyFish | cloud-init at boot |
| 33 | `https://contabo.com/blog/vps-to-vds-upgrade-path/` | Native read | Shared physical cores, neighbour load |
| 34 | `https://contabo.com/blog/contabo-waived-setup-fee-vps-plans/` | Native read | 2014 setup-fee waiver |
| 35 | `https://contabo-status.com/` | Native read | Public status page |
| 36 | `https://www.kkr.com/.../20220608-pressemitteilung-kkr-erwirbt-mehrheitsbeteiligung...pdf` | Exa | KKR majority stake, 2022 |
| 37 | `https://www.oakleycapital.com/news-and-insights/oakley-capital-agrees-sale-of-contabo-and-follow-on-investment` | Exa | Oakley minority, 2022 |

Failed or unusable routes: a direct `curl` of the configurator returned a bot challenge; Firecrawl
and TinyFish intermittently returned a generic executor error, which is why 20 pages were read with
the native tool. None of the failed calls is cited as evidence.

**Quote check.** A separate verification pass re-fetched the 27 cited URLs through the Firecrawl API
and machine-checked every saved quote after normalising emphasis, backticks, table pipes and
whitespace. 72 of 73 unique quotes matched; the one skip is the KKR PDF, whose German sentence was
verified from the Exa search highlight. Two quotes were corrected before the final pass (the
"price displayed" sentence ends with a bold full stop in the rendered page, and the plan-change
sentence has no space before its colon). Further ledger-only quotes, including the configurator's term ladder, were checked the same way; all
matched, one after correcting which page it belonged to.

---

## 12. Integration notes for the parent

- Add `contabo` to `providers/`, `pricing/`, every feature row and all 78 capability rows.
- Add a `VPS: …` label to the manual `kinds` map in `compare/side-by-side.astro` (for example
  "VPS: KVM, shared vCPU").
- Add the provider to `docs.json` and a dated `changes.json` entry for the new listing.
- No `cost.ts` change is required.
- `situations.json`: no pick proposed; the parent may add Contabo to `stay-available` as a budget
  option if it wants one.
- `price-baseline.json`: new money-bearing sources are the VPS page, the pricing page and the
  configurator. Run `npm run check-rates` after integration; the configurator is JavaScript-rendered
  and may be unreadable to the checker, so record that rather than blessing an empty result.

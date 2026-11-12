# TierHive — research ledger

- **Provider ID:** `tierhive`
- **Kind:** `vps`
- **Researched:** 2026-11-04 (desk research only; no account, no credentials, no server started)
- **Repository:** thelaggingway/sandbox-guide at `38f711c` (`origin/main`), clean worktree at start
- **Official site:** https://tierhive.com — "Next generation NAT VPS hosting with true hourly billing"
- **Operator:** Kernel Keepers LTD, England & Wales, company 16294246
- **Status:** self-declared **Alpha**; the operator's own policy says data loss can occur and there is no SLA

Every claim below carries a URL, a verbatim quote, a confidence tag and the date it was read
(2026-11-04 unless stated). Quotes are copied from the fetched page text; matching was done on
whitespace-normalised text, so a wrapped line or a Markdown escape in the fetch may differ from
the raw HTML bytes. Meaning was checked by reading the surrounding passage, not by substring
matching alone.

Tags used: `docs-confirmed` (first-party documentation), `pricing-page` (first-party money page),
`third-party` (outside the operator's own site, including the operator's forum ads),
`inferred` (a conclusion drawn from named evidence), `not-published` (searched and unanswered).

---

## 1. What TierHive is

| # | Claim | Quote | Source | Tag |
|---|---|---|---|---|
| 1.1 | TierHive is hourly-billed **NAT** KVM VPS hosting, aimed at the cheapest end of the market | "The cheapest NAT hourly VPS hosting available. Deploy instantly, scale dynamically, cancel anytime. Pay only for the hours you use." | https://tierhive.com/ | docs-confirmed |
| 1.2 | The platform is built on QEMU/KVM/libvirt | "Everything in TierHive is custom, we designed and wrote it on top of an absolute minimal, cut-to-the-bone QEMU/KVM/libvirt stack." | https://tierhive.com/about.php | docs-confirmed |
| 1.3 | It is deliberately not an enterprise service | "TierHive is a no-SLA, budget service, probably the cheapest generally available KVM VPS that exists online right now, run by experienced, competent people." | https://tierhive.com/about.php | docs-confirmed |
| 1.4 | The operator will not recover lost data | "If you put data on TierHive, we do everything possible to avoid any data loss, but in the event it happens, we will not recover it for you, you get a fresh, blank VPS." | https://tierhive.com/about.php | docs-confirmed |
| 1.5 | It is in Alpha and not production-ready | "ALPHA STATUS: This service is in active development and not production-ready." | https://tierhive.com/acceptable-use.php | docs-confirmed |
| 1.6 | Data loss is an accepted risk, and production use is explicitly excluded | "Data loss can occur at any time without warning" | https://tierhive.com/acceptable-use.php | docs-confirmed |
| 1.7 | No uptime promise | "We do not guarantee any specific uptime or Service Level Agreement (SLA)" | https://tierhive.com/acceptable-use.php | docs-confirmed |
| 1.8 | Support is best-efforts and discretionary | "Support is complimentary, not a right." | https://tierhive.com/acceptable-use.php | docs-confirmed |
| 1.9 | The first public launch was a Show HN on 8 January 2026 (item 46544004, `time` 1767894287 = 2026-01-08T17:44:47Z) | "Show HN: TierHive – Hourly-billed NAT VPS with private /24 subnets" | https://news.ycombinator.com/item?id=46544004 | third-party |

## 2. Isolation and CPU

| # | Claim | Quote | Source | Tag |
|---|---|---|---|---|
| 2.1 | Each VPS is a KVM guest with root | "It's a NAT VPS (KVM) platform with true hourly billing." | https://news.ycombinator.com/item?id=46544004 | third-party |
| 2.2 | **At most 2 vCPU per VPS.** 1 vCPU up to 2 GB of RAM, 2 vCPU above that | "We allow access to 1 vCPU for 2GB and under, anything over 2GB gets access to 2 vCPU." | https://tierhive.com/about.php | docs-confirmed |
| 2.3 | The 2 vCPU ceiling is repeated in the operator's own forum offer | "vCPU: 1vCPU for upto 2048MB then anything over gets 2vCPU" | https://lowendspirit.com/discussion/10743/tierhive-from-0-000135-hr-new-pops-france-and-vint-hill-make-your-own-plan-de-fr-uk-ca-usax2 | third-party |
| 2.4 | Nested virtualisation and CPU passthrough are enabled | "we do have passthrough and nesting enabled for you, in case you want to run anything that requires it" | https://tierhive.com/about.php | docs-confirmed |
| 2.5 | CPU is shared and contended; the vendor warns about steal | "If you need dedicated cores, please do not use TierHive." … "you should expect to see higher steal levels than you would see with any enterprise-grade host" | https://tierhive.com/about.php | docs-confirmed |
| 2.6 | A CPU watchdog halves a core after two hours at 100% | "We have a CPU watchdog: if you average 100% of a CPU core for more than 2 hours solid, you will be limited to 50% of a core on the backend. You can self-resolve this with a reboot if you are limited." | https://tierhive.com/about.php | docs-confirmed |
| 2.7 | Disk IOPS is capped in three tiers | "We have 3 tiers: low, medium, and high. In most cases, as standard, low = 100, medium = 250, and high = 500." | https://tierhive.com/about.php | docs-confirmed |
| 2.8 | Docker is a first-party recipe, so it is expected to work inside the guest | "Alpine Linux with Docker installed and a script to easily add an IPV6 and setup a SWAP partition if necessary." | https://tierhive.com/ | docs-confirmed |
| 2.9 | No GPU product is offered: the sizing surface stops at 8 GB of RAM and the calculator exposes only RAM, NVMe, HDD, backup storage and three priority tiers | "Not all locations support up to 8GB" | https://tierhive.com/ | inferred |

## 3. Sizes and locations

| # | Claim | Quote | Source | Tag |
|---|---|---|---|---|
| 3.1 | RAM is a slider from 128 MB to 8 GB in 128 MB steps | "Not all locations support up to 8GB" (the slider in the page source runs `min="128" max="8192" step="128"`) | https://tierhive.com/ | docs-confirmed |
| 3.2 | NVMe is capped at 50 GB and HDD at 4,000 GB in four locations | "\"slow_disk_max_gb\": 4000" | https://tierhive.com/api/pricing.php | pricing-page |
| 3.3 | 8 GB is not available everywhere | "\"max_ram_mb\": 8192" (Amsterdam; the same feed gives 4096 for most locations and 1024 for Tokyo) | https://tierhive.com/api/pricing.php | pricing-page |
| 3.4 | 19 locations, including ones the homepage list omits | "\"country_code\": \"ZA\"" | https://tierhive.com/api/pricing.php | pricing-page |
| 3.5 | Six EU locations (DE, FR ×3, NL, PL) plus the UK | "\"country_code\": \"DE\"" | https://tierhive.com/api/pricing.php | pricing-page |
| 3.6 | You can migrate a VPS between regions yourself | "You can self-migrate between regions" | https://lowendspirit.com/discussion/11534/tierhive-19-locations-build-your-own-vps-plan-from-0-10-p-month-or-0-000135-per-hour | third-party |
| 3.7 | Disk can be grown from the panel, then the guest needs a reboot | "In the panel, select the new size and confirm" … "## After reboot" | https://tierhive.com/blog/tierhive-howto/extend-a-vps-disk | docs-confirmed |
| 3.8 | The panel claims CPU, RAM and disk resize without downtime | "Real-time upgrades and downgrades. Adjust CPU, RAM, and disk without downtime." | https://tierhive.com/ | docs-confirmed |

Note on 3.8: the vendor's own disk guide puts the filesystem step after a reboot, and vCPU is not an
independent control (2.2). Treated as `partly` on `live-resize`.

## 4. Pricing mechanics (the tariff)

The public calculator reads its rates from `https://tierhive.com/api/pricing.php`. That feed is the
source of the numbers below; the homepage cards and the two worked examples on the page reproduce
them exactly (see 4.4).

| # | Claim | Quote | Source | Tag |
|---|---|---|---|---|
| 4.1 | 1 token = $1 | "1 Token = $1 USD" | https://tierhive.com/ | pricing-page |
| 4.2 | RAM costs $0.00000090 per MB-hour | "\"token_cost_per_unit_hour\": \"0.00000090\"" | https://tierhive.com/api/pricing.php | pricing-page |
| 4.3 | NVMe $0.00002000, HDD $0.00000700, backup storage $0.00000500 and snapshots $0.00002000 per GB-hour | "\"resource_name\": \"fast_disk\"" | https://tierhive.com/api/pricing.php | pricing-page |
| 4.4 | The published example configurations reproduce from those rates | "Micro Development VPS: 1 vCPU, 1GB RAM, 10GB NVMe - $0.001122/hour" (1024 × 0.0000009 + 10 × 0.00002 = 0.0011216) | https://tierhive.com/ | pricing-page |
| 4.5 | CPU, IOPS and network are priced as priority tiers, not as vCPU counts | "\"token_cost_per_hour\": \"0.000030\"" (the High step; Low is 0.000000 and Medium 0.000020, and the tier value is a weight of 1024/2048/4096) | https://tierhive.com/api/pricing.php | pricing-page |
| 4.6 | There is a per-hour DHCP charge and a one-off activation charge | "\"resource_name\": \"DHCP\"" | https://tierhive.com/api/pricing.php | pricing-page |
| 4.7 | Backup create and restore each cost $0.00002 | "\"resource_name\": \"Backup Creation Fee\"" | https://tierhive.com/api/pricing.php | pricing-page |
| 4.8 | A network-backed storage rate exists with no documented product | "\"resource_name\": \"nbd_network_storage\"" | https://tierhive.com/api/pricing.php | pricing-page |
| 4.9 | The first payment is a $3 top-up | "A $3 minimum top up is required after registration to use this service." | https://tierhive.com/ | pricing-page |
| 4.10 | No monthly plan and no monthly cap | "True hourly billing - pay only for hours used, no monthly commitments" | https://tierhive.com/ | pricing-page |
| 4.11 | The four homepage cards are the base-resource price with no priority tiers: Micro 128 MB / 1 GB $0.10/mo, Storage 512 MB / 5 GB / 1,000 GB HDD $5.44/mo, Standard 2 GB / 25 GB $1.69/mo, Maximum 4 GB / 50 GB $3.37/mo | "0.007561" (the Storage card's hourly rate; all four reproduce from 4.2/4.3 at low priority) | https://tierhive.com/ | pricing-page |

### Worked check of the default calculator configuration

Default: 1,024 MB RAM, 20 GB NVMe, Medium priority on CPU, IOPS and network.

- Base: 1,024 × 0.0000009 = 0.0009216; 20 × 0.00002 = 0.0004 → **0.0013216** (page shows "0.001322 tokens")
- Tiers: 3 × 0.00002 = **0.00006** (page shows "0.000060 tokens")
- Total: **0.0013816** tokens/h (page shows "0.001382 tokens/hr", "~$0.99 / month" at 24 × 30 h)

The provider's "month" is 24 × 30 = **720 hours**; this site's engine uses 730. Both are shown in
`abc.md` where it matters.

### Units (GB or GiB)

| # | Claim | Quote | Source | Tag |
|---|---|---|---|---|
| 4.12 | The provider's MB and GB are binary: the site calls 8 GB what the feed calls 8,192 MB | "Up to 8GB RAM per VPS (not all locations support 8GB)" against `"max_ram_mb": 8192` | https://tierhive.com/ and https://tierhive.com/api/pricing.php | docs-confirmed |
| 4.13 | The disk unit is inferred from that, not defined in bytes | "NVMe SSD25 GB" on a card whose RAM is labelled 2 GB and priced from 2,048 MB | https://tierhive.com/ | inferred |

Consequence: the card maps the provider's GB-hour to the engine's GiB-hour 1:1 and does not set
`disk.decimalGB`. If the disk unit is decimal GB instead, every disk charge rises by 7.37% — A $3.90,
B $6.17, C $0.65 — and a 50 GiB disk would exceed the advertised 50 GB ceiling. RAM is unaffected
either way, because the rate is quoted per MB and the site's 8 GB = 8,192 MB settles that unit.

## 5. Billing lifecycle: run, stop, delete

| # | Claim | Quote | Source | Tag |
|---|---|---|---|---|
| 5.1 | Deleting the server ends the bill | "Billing stops the second you delete the server" | https://tierhive.com/blog/general/what-is-an-hourly-vps-and-why-you-might-want-one | docs-confirmed |
| 5.2 | A powered-off server bills storage only | "You only pay for storage when the VPS is powered off." | https://lowendspirit.com/discussion/11534/tierhive-19-locations-build-your-own-vps-plan-from-0-10-p-month-or-0-000135-per-hour (operator's own offer post) | third-party |
| 5.3 | The same claim in the operator's earlier offer | "Shutdown your VPS and ONLY pay for storage" | https://lowendspirit.com/discussion/11448/tierhive-16-locations-new-accepting-recurring-payments-vps-from-0-10-mo-10-bonus | third-party |
| 5.4 | Each server bills a minimum of one hour | "You can create a VPS or 253 VPS with a 1-hour minimum and you are only billed for that hour, so you only pay for what you actually use instead of idle time." | https://lowendspirit.com/discussion/11534/tierhive-19-locations-build-your-own-vps-plan-from-0-10-p-month-or-0-000135-per-hour | third-party |
| 5.5 | A stop is a power-off: there is no pause that keeps memory | "You only pay for storage when the VPS is powered off." (a powered-off server runs nothing; no page offers hibernation, a memory snapshot or resume-in-place) | https://lowendspirit.com/discussion/11534/tierhive-19-locations-build-your-own-vps-plan-from-0-10-p-month-or-0-000135-per-hour | inferred |
| 5.6 | Nothing sleeps an idle server; the only automatic intervention is the CPU watchdog | "We have a CPU watchdog: if you average 100% of a CPU core for more than 2 hours solid, you will be limited to 50% of a core on the backend." | https://tierhive.com/about.php | inferred |

**Why 5.2 is not `docs-confirmed`:** the operator states it in forum offer posts, not on tierhive.com.
The site's own pages never describe the stopped state. The card models it (see `pricing.json`) and
`provider.json` repeats the caveat.

## 6. Reaching it: NAT ports, HAProxy, domains, TLS, IPv6

| # | Claim | Quote | Source | Tag |
|---|---|---|---|---|
| 6.1 | Each VPS gets 2 TCP and 2 UDP forwarded ports on a shared public IPv4 | "Your nat VPS is provided with 2 open TCP ports and 2 UDP port. By design the 1st TCP port is mapped to your VPS port 22/TCP." | https://tierhive.com/blog/tierhive-howto/tierhive-vps-ports | docs-confirmed |
| 6.2 | The external port number differs from the internal one | "the external port 2154/TCP HV is mapped to 22/TCP VPS, 2155/TCP HV to 2155/TCP VPS" | https://tierhive.com/blog/tierhive-howto/tierhive-vps-ports | docs-confirmed |
| 6.3 | The public IPv4 belongs to the hypervisor, not the customer | "HV stands for Hypervisor" … "The HV related public IP is found in the VPS Instances page" | https://tierhive.com/blog/tierhive-howto/tierhive-vps-ports | docs-confirmed |
| 6.4 | You can map your own external-to-internal port pairs | "You can add your own ports with internal port mapping as required. e.g. 5897 > 8080" | https://lowendspirit.com/discussion/11534/tierhive-19-locations-build-your-own-vps-plan-from-0-10-p-month-or-0-000135-per-hour | third-party |
| 6.5 | Each account gets a private /24 joined across locations | "TierHive gives you a global meshed /24, and a subnet from 10.0.0.0/8" | https://tierhive.com/about.php | docs-confirmed |
| 6.6 | HAProxy with Let's Encrypt is included and managed in the panel | "We allow you to add your domains and subdomains to our HAProxy service within the control panel." | https://tierhive.com/acceptable-use.php | docs-confirmed |
| 6.7 | The certificate is issued and renewed for you | "Automatic SSL/TLS certificates - Let's Encrypt integration with auto-renewal" | https://tierhive.com/blog/general/haproxy | docs-confirmed |
| 6.8 | HAProxy backends are VPS in your private subnet | "HAProxy backends connect to your TierHive VPS instances via your private /24 subnet." | https://tierhive.com/blog/general/haproxy | docs-confirmed |
| 6.9 | IPv6 is available per location, up to 10 addresses per VPS, and opens nearly all ports | "You have the nearly full range of ports (except the services mentioned in the T&C that are not allowed) associated to your VPS." … "You can even associate up to 10 IPv6 per VPS." | https://tierhive.com/blog/technical_articles/configuring-ipv6 | docs-confirmed |
| 6.10 | HAProxy does not front IPv6 | "our haproxy solution is not managing IPv6 response" | https://tierhive.com/blog/technical_articles/configuring-ipv6 | docs-confirmed |
| 6.11 | A browser console exists | "Browser-based noVNC console access" | https://tierhive.com/ | docs-confirmed |
| 6.12 | A domain left pointing at TierHive after you leave can be repurposed | "Should you leave the service (i.e., have no active services in your account for more than 90 days) but leave your domain DNS records pointed at our IP addresses, we may redirect or use those domains as we see fit without limitation or further permission." | https://tierhive.com/acceptable-use.php | docs-confirmed |

## 7. Outbound network and email

| # | Claim | Quote | Source | Tag |
|---|---|---|---|---|
| 7.1 | No per-GB egress price and no volume allowance | "We do not give any specific arbitrary GB or TB number, it is simply not practical with the TierHive model." | https://tierhive.com/about.php | docs-confirmed |
| 7.2 | No egress fees are advertised | "Dramatically simpler pricing with no hidden egress fees." | https://tierhive.com/ | pricing-page |
| 7.3 | Bandwidth is metered by speed tier and throttled by fair use | "if you use 100 Mbit/s for 1 hour on average, we will globally limit your speed to 90 Mbit/s" … down to 10 Mbit/s | https://tierhive.com/about.php | docs-confirmed |
| 7.4 | Per-location speed ceilings range from 50 to 300 Mbit/s | "\"network_bw_limit\": 225" (Tokyo 50, Singapore and Sydney 75, Amsterdam 225, Kansas City 300) | https://tierhive.com/api/pricing.php | pricing-page |
| 7.5 | Outgoing mail is blocked except through approved relays | "We don't allow it, except through known mail relays on port 587." | https://tierhive.com/about.php | docs-confirmed |
| 7.6 | Bulk and transactional email is prohibited | "No bulk or transactional email of any kind is permitted, without exception, unless sent via one of our approved relay services" | https://tierhive.com/acceptable-use.php | docs-confirmed |

## 8. Snapshots, backups and storage

| # | Claim | Quote | Source | Tag |
|---|---|---|---|---|
| 8.1 | Backups can be scheduled or taken once | "Scheduled or one time backups" | https://lowendspirit.com/discussion/11534/tierhive-19-locations-build-your-own-vps-plan-from-0-10-p-month-or-0-000135-per-hour | third-party |
| 8.2 | The panel advertises automatic backups with restore | "Automated backups with flexible scheduling. Instant restore capabilities." | https://tierhive.com/ | docs-confirmed |
| 8.3 | Backups are disk images that can be attached to another VPS | "Attach the backup to the VPS you want to chroot." | https://tierhive.com/blog/tierhive-howto/tierhive-backup-chroot | docs-confirmed |
| 8.4 | Backup storage is billed per GB-hour | see 4.3 | https://tierhive.com/api/pricing.php | pricing-page |
| 8.5 | Snapshots exist as a billed storage type | "\"resource_name\": \"snapshot_storage\"" | https://tierhive.com/api/pricing.php | pricing-page |
| 8.6 | How long snapshots or backups are kept is not published | "Automated backups with flexible scheduling. Instant restore capabilities." (no retention period, slot count or history depth appears on the site or in the feed) | https://tierhive.com/ | not-published |
| 8.7 | There is no documented separate-volume product | "\"resource_name\": \"nbd_network_storage\"" (a rate with no page describing attach or detach) | https://tierhive.com/api/pricing.php | not-published |

## 9. Control surface: panel, API, CLI, SDK, MCP

| # | Claim | Quote | Source | Tag |
|---|---|---|---|---|
| 9.1 | Everything is done in a web control panel | "In the panel, the page Subnet Config reveal your mapped ports" | https://tierhive.com/blog/tierhive-howto/tierhive-vps-ports | docs-confirmed |
| 9.2 | No API documentation is published | "Pricing Features Why TierHive About TierHive Status Locations Static Hosting Blog" (the site's whole public navigation; its complete sitemap adds only status, four legal pages and 18 blog posts, and every guessed panel path returns 401) | https://tierhive.com/ | inferred |
| 9.3 | The only public JSON endpoints are site helpers | "fetch(\"/api/pricing.php\")" in `main.min.js`; `/api/recipes.php` feeds the ticker and `control.tierhive.com/simple/netinfo?token=<token>` returns a VPS's own ports from inside the guest | https://tierhive.com/assets/js/main.min.js | docs-confirmed |
| 9.4 | A third-party dossier also reports no API yet | "Shared NAT IPv4 with few ports; shared HAProxy for web; no API yet" | https://app.notion.com/p/40d6e471db42819aad7ef173e0826d4f (read 2026-11-04) | third-party |
| 9.5 | Deployments can be automated with recipes and script injection | "or just automate your own deployments anytime you want with script injection managed by you" | https://lowendspirit.com/discussion/11534/tierhive-19-locations-build-your-own-vps-plan-from-0-10-p-month-or-0-000135-per-hour | third-party |
| 9.6 | Login uses a password plus a six-digit code | "6-digit authentication code" | https://control.tierhive.com/login | docs-confirmed |

## 10. Agents, templates and recipes

| # | Claim | Quote | Source | Tag |
|---|---|---|---|---|
| 10.1 | A community recipe marketplace deploys applications in one click | "Deploy complex applications with community recipes. Earn tokens by creating and maintaining popular recipes." | https://tierhive.com/ | docs-confirmed |
| 10.2 | Recipes cover servers and tools, not AI agents | "Recipe Marketplace" (entries include AmneziaWG, Beszel, Blocky, Caddy, Calibre Web, cloudflared, Docker, Flarum, Forgejo, Gotify, GRAV, LAMP, Laravel, MariaDB, Navidrome, Netbird, OpenVPN, PostgreSQL, rqlite, Tailscale, Vaultwarden, WireGuard, WordPress and Xray — no Hermes, OpenClaw, Claude Code or Codex) | https://tierhive.com/ | docs-confirmed |
| 10.3 | OS templates include BSDs and FreeDOS | "One-click OS deployments: Ubuntu, Debian, AlmaLinux, Rocky Linux, CentOS Stream, Alpine, Fedora, Arch, SUSE, OpenSUSE, FreeBSD, OpenBSD, FreeDOS" | https://tierhive.com/ | docs-confirmed |
| 10.4 | Custom ISO and PXE boot are supported | "You can mount ISO's from URLs (plural)" | https://lowendspirit.com/discussion/11534/tierhive-19-locations-build-your-own-vps-plan-from-0-10-p-month-or-0-000135-per-hour | third-party |
| 10.5 | There is no prompt API, hosted browser or managed desktop | "Browser-based noVNC console access" (the only interactive surface offered is a view of your own VM) | https://tierhive.com/ | inferred |

## 11. Accounts, teams, policy limits

| # | Claim | Quote | Source | Tag |
|---|---|---|---|---|
| 11.1 | One account per customer | "One Account Per Customer: You are permitted one Account per customer." | https://tierhive.com/terms.php | docs-confirmed |
| 11.2 | Sub-users, roles, SSO and audit logs are not documented | "One Account Per Customer: You are permitted one Account per customer." | https://tierhive.com/terms.php | not-published |
| 11.3 | Service is refused to five countries, including Brazil | "We are unable to provide our Services to customers in the following countries: China, Russia, Brazil, Vietnam, and Iran." | https://tierhive.com/terms.php | docs-confirmed |
| 11.4 | Scraping needs written permission in advance | "Automated scraping of external websites is not permitted." … "Please open a support ticket to discuss your use case in advance of conducting any scraping activity." | https://tierhive.com/acceptable-use.php | docs-confirmed |
| 11.5 | TOR, torrents and unapproved mining are prohibited | "TOR nodes are strictly prohibited" | https://tierhive.com/acceptable-use.php | docs-confirmed |
| 11.6 | The environment is explicitly shared | "this is and always will be a shared resource environment" | https://tierhive.com/acceptable-use.php | docs-confirmed |
| 11.7 | Refunds within 14 days only if barely used | "you may request a full refund within 14 days of your initial purchase, provided you have not extensively used the service" | https://tierhive.com/refund.php | docs-confirmed |
| 11.8 | Payments go through a merchant of record | "All payments are processed securely through our Merchant of Record, FastSpring." | https://tierhive.com/terms.php | docs-confirmed |

## 12. Company and trust

| # | Claim | Quote | Source | Tag |
|---|---|---|---|---|
| 12.1 | Operated by Kernel Keepers LTD | "TierHive is a project run by Kernel Keepers LTD." | https://tierhive.com/about.php | docs-confirmed |
| 12.2 | Company number and registered office | "Company Number: 16294246" | https://kernelkeepers.com | third-party |
| 12.3 | Incorporated 5 March 2025 | "Incorporated on 5 March 2025" (status Active, SIC 62012) | https://find-and-update.company-information.service.gov.uk/company/16294246 | third-party |
| 12.4 | A public status page shows per-location 90-day uptime | "Amsterdam, NL Operational 90 days ago 99.99 % uptime Today" | https://tierhive.com/status | docs-confirmed |
| 12.5 | No SOC 2 report or ISO 27001 certificate is claimed | "This is not an enterprise-grade service and should never be considered as such." (no audit is claimed on the site, the legal pages or the company site) | https://tierhive.com/acceptable-use.php | not-published |
| 12.6 | No data processing agreement is published | "FastSpring is the data controller for all payment and billing data" (the legal pages cover terms, privacy, refunds and acceptable use only) | https://tierhive.com/privacy.php | not-published |
| 12.7 | The platform is proprietary; some recipe scripts are open source | "Open source, view the scripts running at https://github.com/matthewgall/tierhive" | https://tierhive.com/ | docs-confirmed |
| 12.8 | Headcount and funding are not published | "We're a dedicated R&D and SaaS company driven by a passion for solving real world problems." (no headcount, revenue or investors appear on either site) | https://kernelkeepers.com | not-published |

## 13. A / B / C arithmetic (hand-worked)

Rates: RAM $0.0009216 per GiB-hour (1,024 MB × $0.0000009), NVMe $0.00002 per GB-hour. No vCPU
charge; vCPU follows RAM (1 up to 2 GiB, 2 above). Low-priority CPU/IOPS/network tiers are free, so
the card uses those. `wholeHours` applies because each server bills a one-hour minimum.

**A — 2 vCPU / 4 GiB / 10 GiB, 1,000 × 10 minutes, deleted after each run**

- Each run is a fresh 4 GiB / 10 GB server held 10 minutes → 1 billed hour × 1,000 = 1,000 h
- RAM: 1,000 h × 4 GiB × $0.0009216 = **$3.6864**
- Disk: 1,000 h × 10 GB × $0.00002 = **$0.20**
- **Total $3.8864** (engine: $3.89)
- Note: 4 GiB is the smallest size that gives 2 vCPU, so A matches the published rule exactly.
- The first purchase needs a $3 top-up, so a $4 balance covers A.

**B — 4 vCPU / 8 GiB / 50 GiB, 730 hours**

- **Infeasible as asked:** TierHive never gives more than 2 vCPU (2.2, 2.3). Priced on 2 vCPU / 8 GiB / 50 GB.
- RAM: 730 h × 8 GiB × $0.0009216 = **$5.382144**
- Disk: 730 h × 50 GB × $0.00002 = **$0.73**
- **Total $6.112144** (engine: $6.11, with the 4 vCPU problem shown)

**C — 2 vCPU / 4 GiB / 20 GiB, 90 running + 640 stopped hours**

- Running: 90 h × (4 × $0.0009216 + 20 × $0.00002) = 90 × $0.0040864 = **$0.367776**
- Stopped: 640 h × 20 GB × $0.00002 = **$0.256** (storage only; 5.2)
- **Total $0.623776** (engine: $0.62)

**Provider's own 720-hour month, for comparison**

- A would be unchanged (whole hours).
- B: 720 × $0.0083728 = $6.03 (the engine's 730 h figure is $6.11)
- C: 90 running + 630 stopped = $0.367776 + $0.252 = $0.62

Not modelled: the $0.000001/h DHCP charge (about $0.0007 a month per server), backup/snapshot
storage, backup create/restore fees, priority tiers (+$0.00002/h each for Medium, +$0.00003/h for
High), HDD at $0.000007/GB-h, and any egress (none is charged).

## 14. Contradictions (both sides kept)

### 14.1 Free trial vs a $3 minimum top-up

- Homepage: "A $3 minimum top up is required after registration to use this service." (https://tierhive.com/)
- Price feed: `"signup_bonus_tokens": 0.01` — one cent of credit at sign-up (https://tierhive.com/api/pricing.php)
- Blog: "Start with the free trial, no credit card required." (https://tierhive.com/blog/general/what-is-an-hourly-vps-and-why-you-might-want-one)
- Offer posts: "FREE tokens on sign up, try before you buy" (https://lowendspirit.com/discussion/11534/tierhive-19-locations-build-your-own-vps-plan-from-0-10-p-month-or-0-000135-per-hour)

Reading used: a free account with $0.01 of credit (about 74 hours on the 128 MB Micro) is created
without a card, but the page also says a $3 top-up is required to use the service. Both statements
are live. The card and feature rows treat the trial as a one-cent credit that may not be usable
until $3 is added, and say so.

### 14.2 The blog's hourly prices are stale

- Blog: "A Micro tier costs $0.000135/hour at TierHive" (matches today) but "A Popular tier costs $0.004061/hour" and "The Popular tier is $0.004061/hour. The Standard is $0.002343/hour."
- Homepage card: the "Popular" plan (Storage, 512 MB / 5 GB / 1,000 GB HDD) is "0.007561/hr"; the Standard is "0.002343/hr".

Reading used: the Standard figure matches today's rate; the Popular figure does not (0.004061 does not
reproduce from any current size). The blog is older marketing copy. No rate in this package is taken
from it.

### 14.3 Terms describe a subscription; the product is prepaid hourly tokens

- Terms: "Subscriptions are billed in advance on a [monthly/annual] basis, as selected during purchase." (https://tierhive.com/terms.php)
- Homepage: "True hourly billing - pay only for hours used, no monthly commitments" and "1 Token = $1 USD" (https://tierhive.com/)

Reading used: the terms are the operator's boilerplate for its other products (PracticalCRM,
ClickReroute, NetWatch). The hourly token model is what the product page, the calculator and the price
feed implement.

### 14.4 Disposable email and VPN: allowed in one place, banned in another

- About: "We have no objection to you using a free or disposable email, or a VPN, etc." (https://tierhive.com/about.php)
- Terms: "You may not use free or disposable email addresses to create or maintain an Account." and "You may not use a proxy or VPN to sign up for an Account or as a primary mode of use to access our Services." (https://tierhive.com/terms.php)

Reading used: the stricter terms govern. Sign-up should assume a real email address and no VPN, even
though the About page invites the opposite.

### 14.5 Brazil is a listed location and a blocked country

- Locations: "Sao Paulo, Brazil" with `country_code` BR and 4,096 MB max RAM (https://tierhive.com/api/pricing.php)
- Terms: "We are unable to provide our Services to customers in the following countries: China, Russia, Brazil, Vietnam, and Iran." (https://tierhive.com/terms.php)

Reading used: the Sao Paulo node exists and is offered to customers outside Brazil; customers located
in Brazil are refused. A reader in Brazil should not buy.

### 14.6 "Adjust CPU, RAM, and disk without downtime" vs a reboot to grow the filesystem

- Homepage: "Real-time upgrades and downgrades. Adjust CPU, RAM, and disk without downtime." (https://tierhive.com/)
- Disk guide: "In the panel, select the new size and confirm" then "## After reboot" (https://tierhive.com/blog/tierhive-howto/extend-a-vps-disk)

Reading used: the panel change is live, but the guest only sees the new disk after a reboot, and vCPU
cannot be chosen independently. `live-resize` is `partly`.

## 15. Unknowns (searched, not answered)

1. **Stopped-state billing is not on the operator's website.** Only forum offer posts state it (5.2, 5.3). What exactly is billed while stopped (disk at the NVMe rate? backup storage? the DHCP charge?) is unstated.
2. **Sub-hour billing granularity.** "True hourly" plus a one-hour minimum is clear; whether a 90-minute server bills 1.5 h or 2 h is not.
3. **Snapshot and backup retention.** No slot count, age limit or history depth is published.
4. **Team features.** Sub-users, roles, SSO and audit logs are all behind the login; nothing public.
5. **Public API.** No documentation exists; whether the panel exposes keys to customers is unknown.
6. **Data processing agreement / GDPR posture.** No DPA is published; the company is UK-based and the EU locations are in DE, FR, NL and PL.
7. **What happens at a zero token balance.** Whether a running server stops, is suspended, or is deleted is not documented.
8. **Whether 8 GB is orderable in every 8 GB location** at the time of purchase (the feed lists per-location maxima only).
9. **The `nbd_network_storage` rate** has no documented product.
10. **Actual stopped-hour behaviour for the CPU/IOPS/network tiers** — assumed not billed while stopped.

## 16. Retrieval log

| Tool / route | Target | Result |
|---|---|---|
| Context MCP `web_scrape` | https://tierhive.com | ✅ full Markdown (28,086 chars) |
| Context MCP `web_scrape` | /about.php, /static-hosting, /blog | ✅ |
| Context direct `POST /v1/web/scrape` | /terms.php, /refund.php, /privacy.php | ⚠️ HTTP 200 but body was only the nav/footer shell (the legal pages render past a cookie gate) |
| Context direct `POST /v1/web/scrape` | /status, /blog/pricing, 7 blog posts, kernelkeepers.com, Companies House, LowEndSpirit thread, HN item | ✅ |
| Context MCP `web_search` | 3 queries (stopped billing, API, vCPU) | ✅ results used only as leads; every cited fact re-read on the source page |
| Firecrawl `v2/scrape` (fresh, `maxAge: 0`) | /terms.php, /refund.php, /privacy.php | ✅ rendered bodies (7,319 / 3,909 / 5,607 chars) — this is the route that succeeded for the legal pages |
| TinyFish `fetch_content` | /about.php | ✅ 7,305 chars, matches the Context read |
| TinyFish `fetch_content` | /terms.php | ❌ same nav-only shell as Context (no JS rendering) |
| curl (public, no session) | /api/pricing.php, /assets/js/main.min.js, /robots.txt, /sitemap.xml, /register, control login HTML | ✅ |
| Notion MCP `notion_fetch` | dossier 40d6e471db42819aad7ef173e0826d4f | ✅ read as third-party leads; nothing cited from it without a first-party reconfirmation |
| Amp native `web_search` / `read_web_page` | — | not used (no Composio route failed in a way that required it) |
| Parallel, Exa, Tavily | — | not used; Context search and Firecrawl rendering covered the questions, so no duplicate spend |

**Spend:** roughly 25 Context scrapes, 3 Context searches, 3 Firecrawl scrapes, 2 TinyFish fetches,
1 Notion read. No Parallel/Exa/Tavily calls, no deep-research or browser-automation runs. Estimated
well under $0.50 of the ~$1 budget.

**Cache/freshness:** every price and rate was read from a live fetch on 2026-11-04 — the price feed,
the calculator JS and the rendered cards were fetched in this session. Firecrawl was called with
`maxAge: 0` so no cached scrape was reused. The homepage's own map stamp reads "Updated 4 Nov 2026
05:30 UTC" and the status page "Last updated 4 Nov 2026 05:15 UTC", consistent with a same-day read.

## 17. Verdict summary

See `feature-rows.json` (16 rows) and `capability-rows.json` (78 rows). Counts are repeated in the
final report. Nothing in this package was merged into `site/src/data`; no commit, push or deploy.

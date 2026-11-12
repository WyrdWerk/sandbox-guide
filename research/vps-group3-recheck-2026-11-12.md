# VPS group 3 recheck — OVHcloud, Scaleway, TierHive, Vultr

Recheck date: **2026-11-12** (Asia/Kolkata). Repository `WyrdWerk/sandbox-guide`, baseline `origin/main` **4432d00**.
Desk research only: no accounts, credentials, deployments or billable resources. No repo data files edited.

Method: fresh **Context `web_scrape`** (`maxAgeMs: 0`) for rendered/marketing pages, plus direct `curl` of
first-party machine surfaces (OVHcloud order-catalog API, Vultr plans/regions API, TierHive pricing feed,
provider HTML) so the money and the quotes come from the page itself rather than a cache. Every quote below was
copied from the fresh fetch and re-read in context. Amp native `read_web_page` / `web_search` were used as a
fallback where Context returned a JS shell or `curl` hit a 403 (notably Vultr's pricing/about pages and a few
Scaleway docs); those calls are named in the sections. `agent-browser` (Chromium) rendered
kernelkeepers.com/terms and kernelkeepers.com/privacy. Scaleway's `www` docs sit behind a Bunny Shield
proof-of-work challenge that did not clear in headless Chrome, so the quota-table and CLI-MCP quotes were
cross-checked against Scaleway's own `scaleway/docs-content` and `scaleway/scaleway-cli` repositories on GitHub
(the source those pages render). TinyFish, Parallel, Exa and Firecrawl were available but not used; nothing here
depends on them.

Status of the four providers: **no headline price change** for OVHcloud VPS, Scaleway Instances, TierHive or
Vultr Cloud Compute. Two verdict changes (`ovhcloud` and `scaleway` `mcp-server`, both to `yes`), one
product/location correction (TierHive HDD is three locations, not four), and several specific/quote changes.
A/B/C totals were not recomputed.

### At a glance

| Provider | Rate card | Verdict changes | Specific changes to carry |
|---|---|---|---|
| OVHcloud VPS | Unchanged (USD, tax 0) | `mcp-server` partly → **yes** | 65 US VPS MCP tools (87 EU/CA); `ways-to-drive` note/figure; APAC traffic quota contradicts "unlimited" |
| Scaleway Instances | EUR list unchanged; FX 1.1130 → **1.1127** (optional) | `mcp-server` no → **yes** | STARDUST1 quota caveat can go; SLA covers BASIC2-A too, not just BASIC3-X; IPv4 €0.004 contradiction gone; Milan 3-AZ |
| TierHive | Unchanged | None | HDD **4 → 3 locations** (London dropped); status 99.93–100%; terms/privacy iframe to kernelkeepers.com |
| Vultr | Unchanged (USD, tax added) | None | 34th region Chennai (21 Oct, API still 33); VX1 uncapped/actual hours; Audit Logs $0.50/GB ingest + $0.01/GB-mo; MCP still read-only |

---

## OVHcloud VPS (`ovhcloud`) — checked 2026-11-12, baseline 2026-10-30

### Rate card: unchanged

Fresh sources: product page <https://us.ovhcloud.com/vps/> (Context, `maxAgeMs: 0`), public order catalog
`https://api.us.ovhcloud.com/1.0/order/catalog/public/vps?ovhSubsidiary=US` (direct `curl`, 12.5 MB,
`currencyCode: USD`, `subsidiary: US`, `taxRate: 0`).

| Model | vCores / RAM / NVMe | Monthly, no commitment | 6-month commitment | 12-month commitment |
|---|---|---|---|---|
| VPS-1 | 2 / 4 GB / 40 GB | **$5.35** | $5.08 | $4.54 |
| VPS-2 | 4 / 8 GB / 75 GB | **$10.00** | $9.50 | $8.50 |
| VPS-3 | 6 / 12 GB / 100 GB | **$14.50** | $13.77 | $12.32 |
| VPS-4 | 8 / 24 GB / 200 GB | **$27.50** | $26.12 | $23.37 |

All four no-commitment and commitment prices match the existing card exactly (catalog `pricings[]` with
`capacities: ["renew"]`; `price/1e8`). Product page still shows the 12-month prices as "Starting at
$4.54 /month", "$8.50", "$12.32", "$23.37" — the card's trap about "Starting at" being the 12-month price
still holds.

Verified verbatim on <https://us.ovhcloud.com/vps/>: "$4.54 /month", "2 vCores", "4 GB  RAM", "40 GB SSD NVMe",
"500 Mbps public bandwidth"; "$8.50 /month" with "4 vCores", "8 GB  RAM", "75 GB SSD NVMe", "1 Gbps";
"$12.32 /month" with "6 vCores", "12 GB  RAM", "100 GB SSD NVMe", "2 Gbps"; "$23.37 /month" with "8 vCore",
"24 GB RAM", "200 GB SSD NVMe", "3 Gbps".

Other tariff inputs (all unchanged):

- **Additional disk 2027**: 50 GB $2.60, 100 GB $5.20, 200 GB $10.30, 500 GB $25.70, 1 TB $51.30,
  5 TB $256.50, 10 TB $512.90 a month. Catalog add-ons `option-additional-disk-2027-*`. Matches card notes.
- **Standard daily backup**: $0.50 / $0.60 / $0.80 / $1.20 a month for VPS-1..4 2027
  (`option-auto-backup-2027-1-model*`). The product page still calls it included: "Daily backups are a free
  feature of your VPS." and the plan cards say "Daily backup of the previous 24 hours". Card's $0.50–$1.20
  caveat is still exactly right.
- **Premium 7-day backup**: $1.40 / $2.20 / $3.00 / $5.90 (`option-auto-backup-2027-7-model*`). Card says
  "$1.40–$5.90" — right.
- **Snapshot**: $0.40 / $0.60 / $0.90 / $1.70 by model (`option-snapshot-2027-model*`), product page "Starting
  at $0.40 /month". Card says "from $0.40" and cites a $1.20 20 GB catalog option (older range) — still fine.
- **Additional IP**: "Additional IPs $2.40 /IP/month" on <https://us.ovhcloud.com/vps/options/>, "Add up to
  16 additional IP addresses". Card's "up to 16 additional IPs" holds; price still not in the card.
- **Currency/tax**: USD, `taxRate: 0`; Terms of Service: "All Fees are exclusive of all sales, use, excise,
  value added, withholding and other taxes". Unchanged.
- **No hourly meter, no free tier, no signup credit**: unchanged; VPS FAQ and product page show only monthly
  commitments, and the billing article still describes a full first monthly charge then proration to the
  first of the month.

### Contradictions and new findings (first-party)

1. **NEW: OVHcloud's MCP server now has a VPS section.** The **US** MCP Hub at
   <https://mcp.us.ovhcloud.com/index.html> lists "V1 Vps" with "MCP tools to manage V1 Vps resources via the
   OVHcloud API." Endpoint `/mcp/v1_vps`. Its section payload (`https://mcp.us.ovhcloud.com/api/mcp/sections`,
   **52 sections**) contains **65 VPS tools** including `get-vps-list`, `get-vps-details`, `getVpsConsoleUrl`,
   `createVpsSnapshot`, `getVpsAutomatedBackupRestorePoints`, `start-vps`, `stop-vps`, `reboot-vps`, `rebuildVps`,
   `update-vps-details`. The EU and CA hubs carry the same section with **87 tools** (78 and 63 sections
   respectively) and add `reinstall-vps`, `setVpsRootPassword`, Veeam restore and backup-FTP tools; the US hub
   omits those. Quote the US count for this US-priced card. This supersedes the card's "official MCP server that
   has no documented VPS section".
2. **Local Zone anti-DDoS contradiction (both first-party).** Docs FAQ says a Local Zone VPS "does not include
   security features like Anti-DDoS, or advanced options such as Additional IP and Load Balancer."
   (<https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/vps-faq>). The Local Zone
   landing page's own feature block says "Anti-DDoS protection included … Included", and its "Which features
   are not available on a Local Zone VPS?" list omits anti-DDoS entirely (it names Windows images, cPanel,
   Plesk, Docker images, Additional IPs, Load Balancer, managed databases and advanced monitoring)
   (<https://www.ovhcloud.com/en-gb/lp/vps-localzone/>). The guide follows the docs FAQ (LZ loses anti-DDoS);
   the contradiction should be recorded because a buyer on the LZ page is told the opposite.
3. **Upgrades are US-only, but the feature list is global.** US page footnote: "VPS services ordered in data
   centers outside of the United States regions will not be able to be modified or upgraded after delivery."
   The same page still advertises "Upgrade your VPS resources with a single click -- just a quick reboot
   required". Card already marks `live-resize` partly and documents the US-only restriction; no change.
4. **"Unlimited traffic" vs an APAC quota.** Same US page footnote: "VPSs in Asia-Pacific (Mumbai, Singapore,
   Sydney) have a monthly traffic quota: 1 TB for VPS-1 and VPS-2, 3 TB for VPS-3 and VPS-4, 4 TB for VPS-5 and
   VPS-6. Beyond that, bandwidth is limited to 10 Mbps." So traffic is not billed per GB, but it is not
   unlimited in APAC; the footnote also names VPS-5/VPS-6, which the 2027 range does not sell (the 2025 range
   `vps-2025-model5/6` still does). Card's egress text "Unlimited traffic on every 2027 plan" should become
   "unlimited traffic with no per-GB charge; APAC plans have a 1–4 TB monthly quota, then 10 Mbps".
5. **Locations confirmed, not changed.** Local Zone page: "Our virtual private servers are currently available
   in 28 global locations, including 15 with Local Zones already available." The US page banner says "VPS-2
   Local Zone is now available in more than 15 cities" — "cities" vs "locations" wording only. EU catalog
   (`ovhSubsidiary=IE`) lists 11 non-LZ datacentres: `BHS DE EU-SOUTH-MIL EU-WEST-RBX GRA SBG SGP SYD UK WAW
   YNM`; with the two US (`US-EAST-VA`, `US-WEST-OR`) that is 13 classic + 15 LZ = 28. EU countries in the
   card (France, Germany, Italy, Poland, UK) still correct; no new EU country appears.
6. **2027 range is still four models.** Catalog has `vps-2027-model1..4` (+ `-ca`, `-eu`, `.LZ`); the 2025
   range `vps-2025-model1..6` remains listed at $7.60–$86.00. No new VPS-5/6 in the 2027 range.
7. **SLA/company facts unchanged.** "Get guaranteed availability with a 99.9% service level agreement (SLA).";
   SLA page still lists VPS 1-6 / Starter / Value / Essential / Comfort / Elite / Epyc / Best Value at 99.9%;
   service credits "calculated as a percentage of the total Fees paid by the Customer"; ToS still "OVH US LLC
   dba OVHcloud®, a Delaware limited liability company"; DPA address 11950 Democracy Drive, Suite 300, Reston,
   VA 20190; about page "46 data centers implemented across 4 continents" and "over 1.6 million customers
   worldwide"; SOC page scope still names Bare Metal Cloud, Virtual Private Cloud, Hosted Private Cloud, Public
   Cloud and the two US data centres, **not VPS**.
8. **Recent incidents fact**: the cited example still resolves and still reads
   "Start time : 14/08/2026 08:45 UTC End time : 18/08/2026 10:15 UTC" (Madrid Local Zone, ~4 days). The
   card's count is explicitly windowed "from 6 August to 4 November 2026" and was not recounted. OVHcloud's
   status pages only expose the last 50 incidents through `/api/v2/incidents.json`, and `/history?page=N`
   is JS-rendered, so a recount needs the history pages in a browser. Either keep the dated window or extend
   it with a fresh browser count — do not silently present 4 November as "now".

### Features (16) — verdicts

All verdicts unchanged. Only `ways-to-drive` needs its note/figure refreshed.

| Feature | Verdict | Confirmation |
|---|---|---|
| billing-models | partly | Monthly subscription only; no hourly/per-second rate; 6- and 12-month commitments discount; powered-off still bills. Product page + catalog + billing article. |
| built-in-agents | partly | n8n is a pre-installed image ("n8n … Debian 12 … Included"); Hermes and OpenClaw are Docker guides only. No coding-agent image, no prompt API. `/vps/os/` + install-hermes-agent / install-openclaw docs. |
| company | yes | OVH US LLC (Delaware), OVH Group subsidiary, 99.9% SLA with credits, SOC 1/2/3 and ISO 27001/27017/27018 scopes name US data centres and Bare Metal Cloud, not VPS. Unchanged. |
| custom-domains | partly | DNS points at the VPS; TLS is a self-installed Let's Encrypt certificate (install-ssl-certificate guide). No managed per-VPS certificate. Unchanged. |
| idle-timers | yes | No idle timeout, sleep or session limit; API lifecycle is start/stop/reboot/rebuild/snapshot. Unchanged. |
| isolation | yes | Full VM, own kernel, root, Docker, SSH; hypervisor unnamed; no GPU; nested virtualisation not documented. Unchanged. |
| keys-secrets | no | No vault, no write-only env store, no credential proxy; API tokens are scoped but only control OVHcloud. Unchanged. |
| lifecycle | no | Stop is a power-off: disk and IP stay, memory/processes gone, subscription keeps billing. Unchanged. |
| outbound-network | partly | Unlimited traffic (APAC quota — see finding 4), dedicated IPv4/IPv6, no provider-side egress allowlist; firewall is iptables in the guest. Unchanged verdict. |
| reaching-it | yes | Dedicated public IPv4 + IPv6, any TCP/UDP port, real SSH, browser KVM console, up to 16 additional IPs. Unchanged. |
| sizes-regions | partly | Four fixed 2027 models 2/4/40 → 8/24/200; 28 locations incl. 15 Local Zones; no independent sizing; no region move. Unchanged. |
| snapshots-forks | partly | One manual snapshot at a time, deleted on restore; standard daily backup 24 h, Premium 7 days; no memory snapshot, no clone/fork. Unchanged. |
| storage | yes | Plan NVMe 40–200 GB; additional disk 50 GB–10 TB, monthly, survives reinstall, not portable. Unchanged. |
| teams-accounts | partly | IAM users/groups/policies, SAML 2.0 SSO, audit logs via LDP; no hard spend cap or VPS spend-threshold alert. Unchanged. |
| trials-free-tiers | no | No free tier, no signup credit, payment method required, first invoice full month. Unchanged. |
| ways-to-drive | yes | **Change:** panel, 52-path/66-operation VPS API, `ovhcloud vps` CLI, Python/Node SDKs, Terraform, and now an official MCP server with a **VPS section** (65 tools in the US hub; 87 in EU/CA). Figure should mention MCP; note must drop "no documented VPS section". |

### Capabilities (78) — changed or refreshed rows

- **`mcp-server`: `partly` → `yes`.** Old figure "Official; no VPS section"; old shortfall "OVHcloud publishes
  an official MCP server, but it has no documented VPS tools, so an agent cannot create or manage a VPS through
  MCP." Evidence: hub <https://mcp.us.ovhcloud.com/index.html>; section payload
  <https://mcp.us.ovhcloud.com/api/mcp/sections> (`id: v1_vps`, 52 sections), quote "MCP tools to manage V1 Vps
  resources via the OVHcloud API."; **65 tools** in that section (the EU/CA hubs have 87), including
  `get-vps-list`, `get-vps-details`, `start-vps`, `stop-vps`, `reboot-vps`, `rebuildVps`, `createVpsSnapshot`,
  `getVpsConsoleUrl`, `update-vps-details`. No shortfall needed.
  **Caveat for the note:** the 65 tools manage an existing VPS; there is no `orderVps`/`createVps` tool and
  the separate `v1_order` section exposes **0** tools. So an assistant can start, rebuild, snapshot and console
  an existing VPS but cannot provision a new one through MCP — the first VPS is still ordered in the panel or
  through the order API. Keep the verdict `yes` (product-specific write tools exist) but say "manage an
  existing VPS", not "create and manage".
- **`egress-included`** (yes, "Unlimited traffic"): verdict/figure stay, but the note's "no published fair-use
  threshold for standard VPS" is false for APAC. The US VPS page footnote says: "VPSs in Asia-Pacific (Mumbai,
  Singapore, Sydney) have a monthly traffic quota: 1 TB for VPS-1 and VPS-2, 3 TB for VPS-3 and VPS-4, 4 TB for
  VPS-5 and VPS-6. Beyond that, bandwidth is limited to 10 Mbps." For the 2027 range that is 1 TB (VPS-1/2) and
  3 TB (VPS-3/4). New note: "No per-GiB charge. APAC plans have a monthly quota — 1 TB on VPS-1/2, 3 TB on
  VPS-3/4 (4 TB on the older VPS-5/6) — then 10 Mbps; other regions have no published threshold."

All other 77 rows: **verdicts unchanged**. Spot-confirmed the ones most likely to move, with fresh reads:

- `custom-image` no, `nested-virt` not-published, `gpu` no, `any-size` no, `big-machines` yes,
  `live-resize` partly — product page, VPS FAQ ("installation templates … do not include the Proxmox
  Operating System"), `/vps/os/` image list (no custom ISO/upload; Fedora 43/44, AlmaLinux 8/9/10, Debian
  11/12/13, Rocky 8/9/10, Ubuntu 22.04/24.04/26.04, FreeBSD 14.3/15, Windows), upgrade guide.
- `snapshot-files` yes "you can only have one snapshot activated at a time"; `snapshot-memory` no;
  `fork-running` no; `older-snapshot` yes (Premium keeps 7 daily); `backups` yes (standard daily free);
  `files-survive-stop` yes; `volumes` yes (50 GB–10 TB add-on); `shared-volume` no; `big-disk` yes;
  `mount-buckets` partly — snapshot + backup + additional-disk docs.
- `stay-on` yes, `choose-idle` no, `wake-on-request` no, `schedules` no, `warm-pool` no, `fast-start` no,
  `pause-memory` no — VPS FAQ + API lifecycle.
- `public-url` yes, `private-url` no, `ssh` yes, `web-terminal` yes, `tunnel` yes, `raw-tcp` yes,
  `custom-domain` yes, `auto-https` partly, `static-ip` yes, `no-internet` partly, `egress-allowlist` partly,
  `egress-included` yes — product page, KVM/SSL/iptables guides.
- `secrets-store` no, `hidden-secrets` no, `scoped-keys` yes, `dashboard-create` yes, `cli` yes,
  `python-sdk` yes, `ts-sdk` yes, `rest-api` yes (52 paths / 66 operations), `pty` no, `file-api` no,
  `agents-preinstalled` no, `prompt-api` no, `one-click-hermes` no, `one-click-openclaw` no, `browser` no,
  `desktop` partly, `hosts-other-agents` yes — API definition, OS page, guides.
- `team-workspace` yes, `roles` yes, `sso` yes (SAML 2.0), `spend-cap` no, `usage-alerts` partly,
  `audit-log` partly (forwarding is free but the Logs Data Platform stream is charged) — IAM docs.
- `per-second` no, `active-cpu` no, `cheap-pause` no, `no-monthly-fee` yes, `flat-price` yes,
  `free-tier` no, `free-credit` no, `no-card` no, `status-page` yes, `sla` yes, `soc2` partly,
  `dpa` yes, `open-source` no — unchanged.

### Docs links

All 16 `docs.json` URLs still resolve; `sizes-regions` points at `https://us.ovhcloud.com/vps/` and the live
product page is at that host/path (a `www`-less US host). No docs change needed except optionally adding the MCP
Hub link to `ways-to-drive`; `ways-to-drive` currently points at the API first-steps guide, which is still the
right "how to drive it" page, and the MCP Hub is cited in the feature note instead.

---

## Scaleway Instances (`scaleway`) — checked 2026-11-12, baseline 2026-10-30

### Rate card: EUR list unchanged, FX moved 0.03%

Fresh sources: <https://www.scaleway.com/en/pricing/virtual-instances/> (Context, `maxAgeMs: 0`, PAR-1 table),
<https://www.scaleway.com/en/pricing/storage/>, <https://www.scaleway.com/en/pricing/network/>, and the
1 June 2026 price-change post <https://www.scaleway.com/en/blog/a-transparent-update-on-scaleway-pricing/>.

Every EUR rate in the card matches the live list exactly:

- DEV1-S €0.00898, DEV1-M €0.0202, DEV1-L €0.04284, DEV1-XL €0.06508 per hour; STARDUST1-S €0.0006.
- PLAY2-PICO €0.01428, NANO €0.02754, MICRO €0.05508.
- BASIC3 12 shapes €0.03945–€0.47329; BASIC2-A 10 shapes €0.023–€0.2756; PRO2 5 shapes €0.0561–€0.89454;
  GP1 5 shapes €0.09282–€1.67382.
- Block Storage 5K €0.000130/GB/hour (15K €0.000177); snapshots €0.000049; local SSD €0.000049 (from the
  1 June update: "Compute Local Storage | €0.000044 /GB /hour | €0.000049 /GB /hour").
- Additional/flexible IPv4 €0.005/hour (network pricing); no egress fee.
- 60-minute minimum per resource per start/stop; hourly billing; no monthly cap.

The 1 June 2026 post is still the latest price change and its "New pricing" column is exactly today's list, so
nothing was re-priced since the baseline. VAT unchanged: prices ex-VAT, French VAT 20% or the customer's local
rate on the invoice.

**FX input changed.** The card's USD figures were derived with the ECB reference rate for 29 October 2026,
1 EUR = 1.1130 USD. The ECB daily file for 11 November 2026 (the latest before this check) prints
`<Cube time='2026-11-11'>` and `currency='USD' rate='1.1127'` — 1.1127, i.e. 0.027% lower. Effect if re-based:
DEV1-M $0.0224826 → $0.02247654/h; DEV1-L $0.04768092 → $0.04766207/h; Block 5K $0.00014469 → $0.00014465/GB-h;
IPv4 $0.005565 → $0.0055635/h. A/B/C totals move by under a cent. Recommendation: either keep the documented
29 October rate or re-base all Scaleway USD figures to 1.1127 in one edit and say so; do not mix.

### Corrected baseline errors (no price change)

1. **STARDUST1-S is in the default quota table.** The current Organization quotas page lists
   `| STARDUST1 | 1 | 1 |` (payment method validated / identity validated). The card's note that it is "absent
   from the default Organization quota table read on 2026-10-30" is wrong — it is present under the name
   `STARDUST1`, not `STARDUST1-S`. Drop the "orderability unconfirmed" caveat; keep the 1-per-Organization quota,
   which is the real constraint.
2. **The €0.004 IPv4 contradiction is gone.** The Instances FAQ no longer quotes any IPv4 price (it now only
   says public IPs are billed for the whole allocation period). The network pricing page still lists
   "Additional IP address | Instance | Type: IPv4 IP per asset - 1 IP | €0.005/hour", and the 1 June post moved
   "Zonal Flexible IPv4 | €0.004 /hour | €0.005 /hour". So there is one current first-party price (€0.005) and
   the card's `tripsUp`/caveat "the FAQ says €0.004/hour" is stale. Remove the contradiction, keep €0.005.
3. **SLA wording is wrong for BASIC2-A.** The SLA table reads "Covered Shared Instances (BASIC2-A, BASIC3-X) |
   99%", and "Other Instances SLO (DEV1, GP1, PLAY2, PRO2, COPARM1, ENT1) | No SLO". The `sla` capability's
   figure "99% BASIC3 only" and shortfall "only BASIC3-X among the shared ranges carries 99%" should say
   **BASIC2-A and BASIC3-X**. The `company` feature figure "99% on BASIC3 only" has the same error. Verdict
   `partly` stays.

### New / changed facts

1. **Official MCP server exists.** `scw mcp server serve` "Runs the MCP server, exposing all CLI commands as MCP
   tools for AI assistants. Supports stdio (default) and streamable HTTP transports."
   (<https://www.scaleway.com/en/developers/cli/mcp>). There are `scw mcp server list-tools` /
   `list-resources` commands with `namespaces=instance` filters, and a `read-only=true` filter that lists only
   get/list operations. That filter is for discovery: `serve` itself "expos[es] all CLI commands". This is the
   official Scaleway CLI (same `scw` binary the docs use for Instances), so the `mcp-server` row changes
   `no` → `yes` and `ways-to-drive` gains MCP. It is a local server (stdio or streamable HTTP on `:8080`), not a
   hosted endpoint — say so in the note so nobody expects a URL from Scaleway.
2. **Milan is now a full 3-AZ region.** Changelog 12 October 2026: "A full 3-AZ Region in Milan! With the
   opening of MIL-2 and MIL-3, you can now deploy resilient enterprise-grade workloads across multiple area
   zones. Instances, Block Storage, Object Storage Standard Multi-AZ class, Public Gateway, and more."
   (<https://www.scaleway.com/en/docs/changelog/>). The about page now says "4 Multi-AZ cloud regions in
   Europe" and "ten Availability Zones in four different regions" — that "ten" is stale (3 Paris + 3
   Amsterdam + 3 Warsaw + 3 Milan = 12). The card's `choose-region` note "each with three Availability Zones"
   is the correct reading; no verdict change.
3. **Milan launched 19 March 2026.** About-page news: "Scaleway, part of the iliad Group, launches a new cloud
   region in Italy". This is the source of the fourth region; do not treat the older three-region pages as
   current.
4. **Instance FAQ still lists only three countries.** "Scaleway offers different Instance ranges in all
   regions: Paris (France), Amsterdam (Netherlands), and Warsaw (Poland)." (<https://www.scaleway.com/en/docs/instances/faq/>)
   It omits Milan even though the datasheet, pricing page and about page include `IT-MIL-1`. Stale FAQ, not a
   withdrawal — the product API returns Milan offers and the Milan CO₂/water columns are in the datasheet.
5. **Secret Manager documents three regions only.** Its Region definition says secrets "are duplicated on all
   Availability Zones of the selected region (Paris, Amsterdam, or Warsaw)."
   (<https://www.scaleway.com/en/docs/secret-manager/concepts/>). If that is current, Secret Manager is not
   offered in Milan — worth adding to the `keys-secrets` note/shortfall, but it does not change the `partly`
   verdict (the row is already partly because secrets are not injected at boot and the agent can read them).
6. **Instance Templates** (15 July 2026) and **Autoscaling Groups public beta** (25 August 2026, fr-par /
   nl-ams / pl-waw only, not Milan) are already reflected in the `templates` and `warm-pool` rows. No change
   needed, but the autoscaling region limit is worth a clause if the `warm-pool` note is edited.
7. **Recent incidents.** The 29 October block-storage latency incident is now **resolved 5 November 2026
   15:35 CET** (started 29 October 12:01), after seven days; the card says "had no resolution posted by
   4 November", which was true at the baseline but is no longer the current state. The 7 November
   "[Block Storage] - fr-par-1 - Write latency increase due to background operations" is a new incident in
   the same family. Counting the status-page history by name for 6 Aug–12 Nov gives 9 Instances/Block Storage
   incidents (the baseline's 8 for 6 Aug–4 Nov plus 7 November); the status API's `/api/v2/incidents.json`
   only returns the latest 50 (back to 21 October), so this is a name-based count, not a component-filtered
   one. If `checkedOn` advances, update the sentence and extend the window; if it stays 4 November, leave it.

### Features (16)

Verdicts unchanged except `ways-to-drive`'s figure/note (still `yes`).

| Feature | Verdict | Change / confirmation |
|---|---|---|
| billing-models | partly | Hourly, 60-minute minimum per resource per start/stop; power-off stops compute but storage + flexible IPv4 keep billing; no monthly cap. Fresh billing FAQ + Instance states. |
| built-in-agents | no | InstantApps still Docker, GitLab, Nextcloud, WordPress, OpenVPN; no Hermes/OpenClaw/coding-agent image; OpenClaw docs are model-API integration only. |
| company | yes | **Figure fix:** "99% on BASIC3 only" → "99% on BASIC2-A and BASIC3-X" (SLA table). Entity/iliad/ISO 27001/HDS/DPA/status all unchanged. |
| custom-domains | partly | DNS A/AAAA at the flexible IP; TLS via Caddy/certbot or a paid Load Balancer/Edge Services; no per-Instance managed certificate. |
| idle-timers | yes | No idle timeout, auto-stop or session limit; standby is billed as running. |
| isolation | yes | Full KVM VM, own kernel, root, Docker; hypervisor unnamed; nested virtualisation still not documented. |
| keys-secrets | partly | Secret Manager (versioned, path-scoped, ephemeral, single-access, TTL to 1 year) is separate and not injected at boot; agent can read what it can reach. **Add:** Secret Manager documents Paris/Amsterdam/Warsaw only. |
| lifecycle | partly | Power off releases the hypervisor, stops compute billing, keeps disk + IP billing; no memory-preserving pause; standby bills full. |
| outbound-network | yes | No egress fees; outbound security-group rules; can run with no public IPv4. SMTP 25/465/587 blocked by default (quota page) — already implied by `raw-tcp`. |
| reaching-it | yes | Flexible IPv4/IPv6, any port through the security group, real SSH, serial console. |
| sizes-regions | yes | Fixed offers 1 vCPU/1 GiB → 48/256 shared; four EU regions; Milan now 3 AZ. |
| snapshots-forks | partly | Volume snapshots and images, manual, kept until deleted, QCOW2 import/export; no RAM, no live fork, no automatic backup schedule. |
| storage | yes | Block volumes 5 GB–15 TB (15 per Instance + boot = 16), local SSD to 600 GB, persistent without the machine. |
| teams-accounts | partly | Organizations/Projects, permission sets with CEL, SAML SSO + SCIM, Audit Trail 90-day export; billing alerts only, no hard cap. |
| trials-free-tiers | partly | €100 Business voucher still advertised; card required; no free Instance size. |
| ways-to-drive | yes | **Figure/note change:** Console, CLI, API, SDKs **and MCP** (`scw mcp server`). Remove "No official MCP server". |

### Capabilities (78) — changed or refreshed rows

- **`mcp-server`: `no` → `yes`.** Old: figure "None official", note "Scaleway publishes no official MCP server
  for its control plane; the developer site lists API, SDKs, CLI and third-party integrations. Community servers
  such as scaleway-mcp exist but are third-party and were not evaluated." New source
  <https://www.scaleway.com/en/developers/cli/mcp>, quote "Runs the MCP server, exposing all CLI commands as MCP
  tools for AI assistants.", confidence `docs-confirmed`. Figure: "scw mcp server (official)". Note: local
  stdio/streamable-HTTP server shipped in the official `scw` CLI; `namespaces=instance` filters the tool list to
  Instance create/get/list/start/stop/delete and the rest of the CLI, and `list-tools read-only=true` lists only
  the get/list subset (the `serve` command itself exposes every CLI command). No shortfall.
- **`sla`: `partly` stays; figure/shortfall corrected.** Figure "99% BASIC3 only" → "99% BASIC2-A and BASIC3-X"; shortfall
  "only BASIC3-X among the shared ranges carries 99%" → "BASIC2-A and BASIC3-X carry 99%; DEV1, GP1, PLAY2 and
  PRO2 have no SLO at all". Evidence unchanged (SLA table).
- **`secrets-store`:** verdict `yes` stays; add the Milan gap to the note if the parent wants regional detail
  ("Secret Manager's Region definition lists Paris, Amsterdam and Warsaw only").
- **`free-credit`:** `yes` stays; €100 Business voucher still advertised on scaleway-vs-aws.
- **`cli`:** `yes` stays; optionally note it doubles as the MCP server (`scw mcp server serve`).

All other 74 rows: **verdicts unchanged**. Reconfirmed the load-bearing ones:

- `per-second` no / `active-cpu` no — "Each of these resources is billed separately for a minimum of 60
  minutes"; CPU Instances "Billed per hour of uptime (including startup and standby time)".
- `cheap-pause` yes — Stopped: "Compute billing stops, but you continue to pay for any attached storage
  (local volumes that you chose to keep or Block Storage volumes) and for any Flexible IPs"; standby "charged
  as a running Instance".
- `flat-price` partly — "no monthly cap"; `approx. per month` = hourly × 730.
- `free-tier` no, `no-card` no, `no-monthly-fee` yes, `dpa` yes, `soc2` no, `open-source` no, `status-page` yes,
  `audit-log` yes (90-day export), `spend-cap` no (alerts only), `usage-alerts` yes (budget alerts).
- `any-size` no, `big-machines` yes (note already names COMPUTE3 96 vCPU), `live-resize` partly, `gpu` yes,
  `custom-image` yes (QCOW2), `nested-virt` not-published.
- `pause-memory` no, `warm-pool` partly (autoscaling groups, public beta), `fast-start` no, `snapshot-memory` no,
  `fork-running` no, `older-snapshot` yes, `templates` yes (immutable Instance templates), `backups` no
  (manual; DIY Serverless Jobs schedule), `files-survive-stop` yes.
- `volumes` yes, `shared-volume` no, `mount-buckets` partly, `big-disk` yes.
- `stay-on` yes, `choose-idle` no, `wake-on-request` no, `schedules` no.
- `public-url` yes, `private-url` no, `ssh` yes, `web-terminal` yes (serial console), `tunnel` yes, `raw-tcp` yes,
  `custom-domain` yes, `auto-https` partly, `egress-included` yes, `egress-allowlist` yes, `no-internet` yes,
  `static-ip` yes, `hidden-secrets` no, `scoped-keys` yes, `dashboard-create` yes, `python-sdk` yes,
  `ts-sdk` yes, `rest-api` yes, `pty` no, `file-api` no, `agents-preinstalled` no, `prompt-api` no,
  `one-click-hermes` no, `one-click-openclaw` no, `browser` no, `desktop` partly (Windows + RDP),
  `hosts-other-agents` partly (OpenClaw model-API client; Mac mini blog; no Instance guide), `team-workspace` yes,
  `roles` yes, `sso` yes, `open-source` no.

### Docs links

All 16 resolve; `ways-to-drive` points at <https://www.scaleway.com/en/developers> (generic developer hub). With
the official MCP server, the best page is now <https://www.scaleway.com/en/developers/cli/mcp> or the CLI
cheatsheet; the developer hub still works but no longer shows the strongest route. Recommend changing
`docs.json.scaleway.ways-to-drive.url` to the MCP page or the CLI docs index — and if it changes to the MCP page,
change that feature row's source quote from the generic API line to "Runs the MCP server, exposing all CLI
commands as MCP tools for AI assistants."

### Sources (Scaleway)

- <https://www.scaleway.com/en/pricing/virtual-instances/>
- <https://www.scaleway.com/en/pricing/storage/>
- <https://www.scaleway.com/en/pricing/network/>
- <https://www.scaleway.com/en/blog/a-transparent-update-on-scaleway-pricing/>
- <https://www.scaleway.com/en/docs/billing/faq/>
- <https://www.scaleway.com/en/docs/instances/faq/>
- <https://www.scaleway.com/en/docs/instances/reference-content/instance-states/>
- <https://www.scaleway.com/en/docs/instances/reference-content/instances-datasheet/>
- <https://www.scaleway.com/en/docs/organizations-and-projects/organization/organization-quotas/>
- <https://www.scaleway.com/en/virtual-instances/sla/>
- <https://www.scaleway.com/en/docs/changelog/>
- <https://www.scaleway.com/en/docs/instances/reference-content/images-and-instantapps/>
- <https://www.scaleway.com/en/docs/iam/concepts/>
- <https://www.scaleway.com/en/docs/iam/user-provisioning/set-up-sso-with-authentik/>
- <https://www.scaleway.com/en/docs/audit-trail/concepts/>
- <https://www.scaleway.com/en/docs/secret-manager/concepts/>
- <https://www.scaleway.com/en/docs/billing/additional-content/understanding-savings-plans/>
- <https://www.scaleway.com/en/developers/cli/mcp>
- <https://www.scaleway.com/en/legal-notice/>
- <https://www.scaleway.com/en/security-and-compliance/>
- <https://www.scaleway.com/en/about-us/>
- <https://www.scaleway.com/en/scaleway-vs-aws/>
- <https://status.scaleway.com/>
- <https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml>

---

## TierHive (`tierhive`) — checked 2026-11-12, baseline 2026-11-04

### Rate card: unchanged, one disk-location change

Fresh source: the calculator's own feed <https://tierhive.com/api/pricing.php> (direct `curl`, HTTP 200,
15,032 bytes, `application/json`), plus <https://tierhive.com/> and <https://tierhive.com/status>.
The feed's `valid_from` dates are all 2025 and its newest `updated_at` is 2026-09-01 (`slow_disk`), so no
rate has been touched since before the baseline.

| Input | Live value | Card |
|---|---|---|
| RAM | 0.00000090 tokens per MB-hour | same |
| NVMe (`fast_disk`) | 0.00002000 per GB-hour | same |
| HDD (`slow_disk`) | 0.00000700 per GB-hour | same |
| Backup storage | 0.00000500 per GB-hour | same |
| Snapshots | 0.00002000 per GB-hour | same |
| Backup create / restore | 0.00002000 each | same (not modelled) |
| DHCP | 0.00000100 per hour + 0.00000100 one-off activation | same (not modelled) |
| Network-backed storage | 0.00000500 per GB-hour, no documented product | same (not modelled) |
| Sign-up credit | `signup_bonus_tokens: 0.01` | same |
| RAM range | 128 MB minimum, 8,192 MB maximum | same |
| Disk range | 1 GB minimum, 50 GB maximum NVMe; 4,000 GB slow disk | same |
| CPU / IOPS / network priority | Low free; Medium 0.00002/h; High 0.00003/h | same |
| Mail relay tiers | Free 5/day $0; Basic 25/day 0.00001/h; Standard 50/day 0.00002/h; Premium 100/day 0.00004/h | **not in the card** |

Token = $1; $3 minimum top-up; one-hour minimum per server; 19 locations. All shape prices reproduce from the
rates exactly (e.g. 4 GiB / 20 GB = 4,096 × 0.0000009 + 20 × 0.00002 = 0.0040864), so the card's seven shapes
stay valid.

**One real change: HDD is now three locations, not four.** The feed's per-location `has_slow_storage` flag is 1
for Singapore, Sydney and Vint Hill only; **London is 0**. The homepage's HDD storage control agrees:
"HDD Storage Available in: 🇸🇬 🇦🇺 🇺🇸" (Singapore, Australia, US flags, no UK). The card's `sizes-regions` note
("HDD to 4,000 GB in four locations"), `storage` feature scenario ("big disks mean slow HDD in four
locations"), `storage` feature note ("HDD is offered only in London, Singapore, Sydney and Vint Hill") and
`big-disk` note ("only in London, Singapore, Sydney and Vint Hill") must all drop London and say **three**
(Singapore, Sydney, Vint Hill). The `big-disk` figure "4,000 GB HDD" and `storage` figure "50 GB NVMe, 4 TB
HDD" are unchanged.

**Mail relay tiers.** The feed now exposes four `mail_tiers` (Free 5/day, Basic 25/day, Standard 50/day,
Premium 100/day, the paid ones at 0.00001–0.00004 tokens/hour). The AUP already says bulk/transactional mail is
forbidden "unless sent via one of our approved relay services (available in the control panel once logged
in)", so this is the price list for that relay, not a new egress allowance. The card's `egress` note "Email is
blocked except through approved relays on port 587" stays true; add the tiers only if the parent wants the
detail. They are tiny (≤$0.03/month at 730 h) and not part of the server rate.

### Evidence-page change: terms and privacy now iframes

`https://tierhive.com/terms.php` and `https://tierhive.com/privacy.php` are now 6.5 KB shells whose only content
is `<iframe src="https://kernelkeepers.com/terms/">` and `<iframe src="https://kernelkeepers.com/privacy/">`.
A text scrape of tierhive.com returns just the header/footer, so the card's quotes no longer match that URL.
The clauses themselves are unchanged on the iframe source:

- <https://kernelkeepers.com/terms/> — "You are permitted one Account per customer."; "We are unable to provide
  our Services to customers in the following countries: China, Russia, Brazil, Vietnam, and Iran."; "You may
  not use free or disposable email addresses"; "You may not use a proxy or VPN to sign up"; "Subscriptions are
  billed in advance on a [monthly/annual] basis" (the literal bracket is in the text); FastSpring is the
  Merchant of Record.
- <https://kernelkeepers.com/privacy/> — FastSpring is "the data controller for all payment and billing data";
  no DPA, sub-processor list or GDPR annex.

Point the research ledger and the `team-workspace`/`spend-cap`/`dpa` evidence at the kernelkeepers.com URLs (or
keep the tierhive.com link and note the iframe), otherwise a quote check on tierhive.com/terms.php fails.

### Status / company facts

- 19 locations, all operational, "Last updated 12 Nov 2026 11:30 UTC" (the time moved from 10:15 between the
  first read and the final read; use the final one only if `checkedOn` advances).
- 90-day uptime now **99.93–100%**: Tokyo 99.93, Singapore 99.98, Amsterdam and London 99.99, the other 15 at
  100. The card's "99.91–100% on 2026-11-04" should become "99.93–100% on 2026-11-12" if the date advances.
- Announcements: 6 Nov "General HAProxy updates" (wildcard/TCP mode, multi-zone failover routing; minor
  instability), 28 Oct "Jacksonville Florida USA - is now live!", 20 Oct emergency security update. No
  incident history is published — still true.
- Jacksonville was the 19th location (28 Oct), already in the card's 19-location list.

### Contradictions (all persist)

1. **Free trial vs $3 top-up.** Homepage: "A $3 minimum top up is required after registration to use this
   service." Blog: "Start with the free trial, no credit card required." Feed: 0.01 sign-up tokens. Both live.
2. **The blog's "Popular" price matches nothing.** Blog: "The Popular tier is $0.004061/hour. The Standard is
   $0.002343/hour." Homepage cards: Popular = 512 MB / 5 GB NVMe / 1 TB HDD at **$0.007561/hour**; Standard =
   2 GB / 25 GB at $0.002343; Maximum = 4 GB / 50 GB at $0.004686; Micro = 0.000135. The $0.004061 figure is
   stale.
3. **"Adjust CPU, RAM, and disk without downtime"** (homepage) vs the About page "1 vCPU for 2GB and under,
   anything over 2GB gets 2 vCPU" (CPU is not a control) and the disk guide's reboot before the filesystem
   grows. Card already marks `live-resize` partly.
4. **Terms ban what About invites.** Terms: no disposable email, no VPN/proxy sign-up. About: "We have no
   objection to you using a free or disposable email, or a VPN". Persists.
5. **Sao Paulo vs the Brazil ban.** Feed lists "Sao Paulo, Brazil"; terms refuse customers in Brazil. Persists.
6. **Alpha, no SLA, data loss.** AUP (last updated 1 April 2026) still: "ALPHA STATUS: This service is in
   active development and not production-ready"; "Data loss can occur at any time without warning"; "We do not
   guarantee any specific uptime or Service Level Agreement (SLA)". About: "no-SLA, budget service"; "we will
   not recover it for you, you get a fresh, blank VPS". Persists.

### Features (16)

Verdicts unchanged. Specifics to edit: `storage` (three HDD locations), `sizes-regions` (three HDD locations),
`company` (uptime 99.93–100 on 12 Nov; terms URL now kernelkeepers.com). All other rows confirmed against the
live feed/pages:

- billing-models yes — per-hour RAM + NVMe + optional priority; one-hour minimum; no monthly plan.
- built-in-agents no — recipe marketplace is WordPress/LAMP/Docker/Laravel etc.; no Hermes/OpenClaw/coding-agent
  recipe, no prompt API.
- custom-domains yes — shared HAProxy + Let's Encrypt, auto-renew; backend is the private /24 IP.
- idle-timers yes — no idle stop/sleep/session limit; CPU watchdog only after 2 h at a full core.
- isolation yes — KVM guest on the operator's QEMU/KVM/libvirt stack, root, Docker recipes, CPU passthrough and
  nesting.
- keys-secrets no — no secrets manager or env store; deploy token in a file readable by root.
- lifecycle partly — stop is power-off; files stay, storage bills; no memory preservation, no fork.
- outbound-network partly — no per-GB fee, speed tiers + FUP step-down to 10 Mbit/s; shared IPv4, own IPv6.
- reaching-it partly — two forwarded TCP (one is SSH/22) + two UDP ports on the host's shared IPv4; HAProxy for
  HTTP(S); no provider tunnel.
- sizes-regions partly — RAM 128 MB–8 GB in 128 MB steps, NVMe 1–50 GB, CPU 1–2 vCPU fixed by RAM, 19 locations.
- snapshots-forks partly — scheduled/one-off backups and snapshots, GB-hour billed, attachable to another VPS;
  disk-only, no memory snapshot or fork.
- storage partly — NVMe 1–50 GB; HDD 4,000 GB in Singapore, Sydney and Vint Hill only (was four incl. London);
  backup/snapshot storage separate.
- teams-accounts not-published — one account per customer; companies may ask for more; no sub-users/roles/SSO/
  audit log documented.
- trials-free-tiers partly — $0.01 sign-up credit; $3 minimum top-up; no card to register.
- ways-to-drive partly — custom panel only; no API/CLI/SDK/MCP; noVNC console; SSH/SFTP.

### Capabilities (78) — changed or refreshed rows

- **`big-disk`** (yes, "4,000 GB HDD"): note "only in London, Singapore, Sydney and Vint Hill" → "only in
  Singapore, Sydney and Vint Hill". Figure unchanged. Source stays the feed, but quote the `has_slow_storage`
  flags (Singapore/Sydney/Vint Hill = 1, London = 0) or the homepage's three flags.
- **`storage` feature's** scenario/note (not a capability) — same three-location fix.
- **`status-page`** (yes): note "stamped 4 Nov 2026 05:15 UTC … 99.91–100%" → "12 Nov 2026 11:30 UTC …
  99.93–100%". Verdict unchanged.
- **`dpa`** (not-published): source URL should become <https://kernelkeepers.com/privacy/> (tierhive.com/
  privacy.php is now an iframe shell). The finding is unchanged: no DPA, no sub-processor list, FastSpring is
  controller for billing data.
- **`team-workspace`** / **`roles`** / **`sso`** (not-published): evidence URL for the one-account rule should be
  <https://kernelkeepers.com/terms/>; findings unchanged.
- **`spend-cap`** (partly): unchanged — prepaid tokens are the ceiling; no configurable cap and no published
  behaviour at zero balance.

All other rows: **verdicts unchanged**. The feed still has 19 locations, 8,192 MB max RAM, 50 GB max NVMe,
4,000 GB slow disk, 0.01 sign-up tokens, and the same six rates; the AUP still declares Alpha and no SLA, so
`company` partly, `sla` no, `soc2` not-published, `open-source` no, `free-tier` no, `no-card` yes,
`free-credit` yes, `per-second` no, `cheap-pause` yes, `flat-price` no, `no-monthly-fee` yes and the rest hold.

### Docs links

TierHive's `docs.json` entry covers only 12 of the 16 topics (it has no `idle-timers`, `keys-secrets`,
`teams-accounts` or `ways-to-drive`). The links it does have — homepage, about, acceptable-use, terms, status,
ports/HAProxy/disk blog posts, static hosting — all resolve, except that `terms.php`/`privacy.php` render only the
iframe shell to a text scraper. `/static-hosting.php` is 404; the live page is `/static-hosting` (the card's source
already uses the clean URL).

### Sources (TierHive)

- <https://tierhive.com/> — cards, calculator, HDD flags, $3 top-up, 19 locations
- <https://tierhive.com/api/pricing.php> — rates, tiers, mail tiers, locations, limits
- <https://tierhive.com/about.php> — no-SLA, CPU rule, nesting/passthrough, network FUP, email relays
- <https://tierhive.com/acceptable-use.php> — Alpha, data loss, no SLA, email rules
- <https://tierhive.com/terms.php> (iframe) / <https://kernelkeepers.com/terms/> — one account, countries, email/VPN, subscriptions, FastSpring
- <https://tierhive.com/privacy.php> (iframe) / <https://kernelkeepers.com/privacy/> — FastSpring controller, no DPA
- <https://tierhive.com/status> — 19 locations, 90-day uptime, announcements
- <https://tierhive.com/static-hosting> — free 25 MB / paid 1 GB static hosting
- <https://tierhive.com/blog/general/what-is-an-hourly-vps-and-why-you-might-want-one> — older prices, free trial
- <https://lowendspirit.com/discussion/11534/tierhive-19-locations-build-your-own-vps-plan-from-0-10-p-month-or-0-000135-per-hour> — 1-hour minimum, storage-only while off

---

## Vultr (`vultr`) — checked 2026-11-12, baseline 2026-10-30

### Rate card: Cloud Compute unchanged

Fresh sources: <https://www.vultr.com/pricing/> (read via Amp `read_web_page`; the page is JS/Cloudflare-heavy
and a plain `curl` returns 403), the public plans API `https://api.vultr.com/v2/plans?per_page=500` (direct
`curl`, 140 plans), `https://api.vultr.com/v2/regions?per_page=500` (33 regions), the Cloud Compute product page,
and the docs.

Every plan in the card is present at the same monthly price and the same vCPU/RAM/disk:

- Regular Performance: $3.50 (1/0.5/10), $5 (1/1/25), $10 (1/2/55), $15 (2/2/65), $20 (2/4/80), $40 (4/8/160),
  $80 (6/16/320), $160 (8/32/640), $320 (16/64/1280), $640 (24/96/1600).
- High Performance (AMD and Intel SKUs, same price): $6 (1/1/25), $12 (1/2/50), $18 (2/2/60), $24 (2/4/100),
  $48 (4/8/180), $72 (4/12/260), $96 (8/16/350), $144 (12/24/500).
- The IPv6-only 0.5 GB plan is $2.50; the IPv4 twin is $3.50.
- Bandwidth allowances unchanged (0.5 TB on the $3.50 plan to 15 TB on 24/96).
- Hourly figures on the page are rounded; the API still gives the same monthly and hourly values as the card
  (e.g. `vc2-2c-4gb` $20 / $0.027; `vhp-1c-1gb-intel` $6 / $0.008).

No Cloud Compute price changed. The card's "34 regions" still matches the Cloud Compute product page,
pricing nav, about page and Windows page, but the locations page and regions API say 33 — see the Chennai note
below.

Other money inputs, all unchanged unless stated:

- **672-hour monthly cap**, one-hour minimum, stopped-but-not-destroyed keeps billing: docs updated 26 October
  2026 — "Billed up to 672 hours per month. The minimum billing unit is one hour, and hourly charges begin when
  a server is deployed, regardless of whether it is powered on or off. Servers that are stopped but not
  destroyed continue to incur hourly charges for reserved resources such as compute, storage, and IP address
  allocation."
- **VX1 is the exception:** "VX1 instances are billed on actual hours used each month and are not capped at
  672 hours." (pricing page, VX1 section). VX1 starts at $43.80/mo (2 vCPU / 8 GB, block storage) and reaches
  192 vCPU / 768 GB at $5.760/hr. It is outside the calculator but is named in the card's `sizes` note; the
  `billing-models` note should say "Cloud Compute" if it keeps the unqualified 672-hour cap.
- **Egress:** $0.01/GB over the plan allowance, inbound free; allowances 0.5–15 TB (pricing FAQ).
- **Snapshots:** $0.05/GB-month. **Automatic backups:** +20% base fee, two most recent copies, excludes block
  storage. **Block Storage:** $0.10/GB-month ($1 per 10 GB), 16 volumes, 40 TB HDD / 10 TB NVMe.
  **File System:** $1 per 10 GB ($100/TB-month). **Object Storage:** $18/TB-month (1 TB storage + 1 TB
  bandwidth; $10/TB additional transfer). **NAT Gateway:** $0.03/hr. **Load Balancer:** $10/mo. **DDoS:**
  +$10/mo. **Windows licence:** $16–$384/mo by plan. All unchanged.
- **Audit Logs add-on (doc published 27 June 2026, updated 23 October 2026):** the pricing page lists
  "**$0.50**/GB audit log ingestion" **plus** "**+$0.01**/GB/month audit log retention (based on average daily
  GB retained per billing cycle)". Retention is configurable to 3,653 days (10 years). The IAM page says log
  storage is priced "beyond an initial free 30-day storage period ... after an initial ingestion charge", and
  the docs describe the subscription as extending "log retention beyond the standard 30-day window covered by
  the List Logs endpoint". So the first 30 days of *storage* are free, but ingestion is charged; the card's
  `audit-log` note ("30 days are free, longer retention is billed by storage") is right about the 30-day
  allowance but omits the ingestion charge and the per-GB-month retention rate. Add both.
- **Hourly rate: the known three-way inconsistency is still there, and the card already documents it.** The
  pricing page shows $0.03 for the $20 plan, the plans API returns $0.027 for `vc2-2c-4gb`, and the card uses
  $0.0297619 (monthly ÷ 672). Vultr's own FAQ says all non-GPU servers are "billed and capped at 672 hours per
  month", which supports monthly ÷ 672; the API's `hourly_cost` is effectively monthly ÷ 730 (e.g. $640 →
  $0.877). Do not switch the card to the API figure. Card note 2 already explains this; no edit needed.
- **The 672-hour cap is per plan, not per server.** Resizing mid-month produces separate line items and can
  show more than 672 hours in total, but "the total billed hours will never exceed the actual hours in the
  month (e.g., 720 hours in a 30-day month)" (billing FAQ). The card's meter ("one-hour minimum per server and
  a 672-hour monthly cap") is fine for an un-resized server; a note could say the cap is per plan line.
- **GPU plans use 730 hours, VX1 uses actual calendar hours.** FAQ: "GPU servers and VX1™ Cloud Compute
  instances are billed at the industry-standard 730-hour month ... All other servers are billed and capped at
  672 hours per month." So the 672 cap is Cloud Compute/Optimized/Bare Metal, not GPU/VX1.

### Regions: 34 in marketing, 33 in the locations page and API

- Chennai is the 34th region, announced **21 October 2026** — "Vultr is deploying a supercluster of AMD GPUs
  in Chennai, India, for our 34th global cloud data center region" (<https://blogs.vultr.com/chennai-cloud-data-center-region>).
  A separate ribbon-cutting post is dated 9 November 2026 and repeats "our 34th cloud data center region"
  (<https://blogs.vultr.com/chennai-india-data-center-region-ribbon-cutting-amd-gpu>). Do not conflate the two.
- The Cloud Compute product page and pricing nav both say **"34 cloud data center regions"**, and the product
  page's location list ends with "Chennai IN" (no test-speed link) then "34 regions". The canonical
  **Data Center Regions** feature page is stronger: it says "34 cloud data center regions", includes
  "Chennai - India" in the Asia table, says "**34 cities** around the globe" and "With **34 global cloud data
  center regions**", but its speed-test list still has no Chennai entry
  (<https://www.vultr.com/features/datacenter-regions/>).
- **But** the locations page says **"33 cloud data center regions"**, lists 33 cities, and does not list
  Chennai; it also says "With 33 global cloud data center regions" and "33 cities around the globe"
  (<https://www.vultr.com/locations/>). The public regions API likewise returns 33 (`meta.total: 33`, 9 in
  Europe) and has no Chennai entry.
- So: 34 is the announced/marketing count (announcement, about page, product page, pricing nav, Windows page,
  data-center-regions page); 33 is what the older locations page and the deploy API currently expose. The
  card's 34 matches its quoted source ("34 cloud data center regions"). Keep 34, but if the note enumerates
  regions or says "deploy in any of 34", qualify it: Chennai was announced 21 Oct and is not yet in the
  locations page/regions API. Do not silently change 34 to 33.
- **Consequence for `sizes-regions`:** its scenario says a 4 vCPU / 8 GiB plan fits "in any of 34 regions".
  That is true of the 33 regions the deploy API returns; Chennai is announced but has no speed-test endpoint
  and is not in the API, so a Cloud Compute plan may not be deployable there yet. The figure can stay 34; the
  scenario is the sentence to qualify if the parent wants strict deployability.
- The EU set is still the same nine: Amsterdam, Frankfurt, London, Madrid, Manchester, Milan, Paris,
  Stockholm, Warsaw.
- The Free Tier is still 1 vCPU / 512 MB / 10 GB in Miami, Seattle and Frankfurt, application-only and
  randomized/weighted — "**Hardware Specifications:** 1vCPU / 512MB RAM / 10GB SSD / IPv4 Address"; "The free
  tier instance is available in Miami, Seattle, and Frankfurt."

### Features (16)

Verdicts unchanged. Specifics to consider:

| Feature | Verdict | Change / confirmation |
|---|---|---|
| billing-models | partly | Cloud Compute: hourly, one-hour minimum, 672-hour cap, stopped hours bill. **Add the VX1 exception** (actual hours, uncapped) or qualify the sentence as Cloud Compute. |
| built-in-agents | partly | HermesAgent v0.16.0 (Ubuntu 24.04, username `hermes`, password `Password`, Vultr Serverless Inference preconfigured) and OpenClaw v2026.9.6 (username `clawmine`, password `Password`, Code Server terminal also `Password`). No coding-agent image; no prompt API. Unchanged. |
| company | yes | The Constant Company, LLC; founded 2014; 34 regions / 80m+ instances / 1.5m+ customers / 75+ engineers; SOC 2+ (HIPAA), ISO 27001:2022, 27017, 27018, 20000-1, PCI Merchant, CSA Star Level 1; 100% network/host-node SLA. Unchanged except Chennai is now the 34th region. |
| custom-domains | partly | Free anycast DNS; TLS is Caddy/Traefik/Let's Encrypt on the instance. Unchanged. |
| idle-timers | yes | No idle timeout, auto-stop or session limit. Unchanged. |
| isolation | yes | Full VM per instance; root, Docker, SSH; custom ISO; nested virtualisation documented only on VX1. Unchanged. |
| keys-secrets | no | No vault or write-only env store; cloud-init/startup scripts write to disk; IAM keys are account/user-level. Unchanged. |
| lifecycle | no | Stop halts the OS and processes but keeps billing; only destroy ends the charge and deletes data. Unchanged. |
| outbound-network | partly | 0.5–15 TB included, $0.01/GB overage, inbound free; firewall is inbound-only, so egress control is UFW/iptables/firewalld in the guest; VPC-only instances exist. Unchanged. |
| reaching-it | yes | One public IPv4 on paid plans, any port, real SSH, VNC console. Unchanged. |
| sizes-regions | yes | Shared Cloud Compute 1–24 vCPU / 0.5–96 GB / 10–1,600 GB; Optimized to 96/256/1,280; VX1 to 192/768; 34 regions incl. 9 EU; no downgrade on resize. **Chennai is the 34th but the locations page/API still list 33** — see the Regions note. |
| snapshots-forks | partly | Manual disk snapshots $0.05/GB-month, kept until deleted, double as templates; no RAM, no live fork; automatic backups keep two copies. Unchanged. |
| storage | yes | Plan disk persists; Block Storage 16 volumes / 40 TB HDD / 10 TB NVMe at $0.10/GB-month; File System shared at $100/TB-month; S3-compatible Object Storage. Unchanged. |
| teams-accounts | yes | Organizations, IAM policies/roles/groups/service accounts, OIDC SSO, audit logs to 10 years; no SAML; no user-set monthly cap. Unchanged. |
| trials-free-tiers | partly | Free Tier application (1/512/10, Miami/Seattle/Frankfurt); promo codes or dollar-for-dollar deposit match up to $100, not automatic. Unchanged. |
| ways-to-drive | yes | Console, API v2, official CLI, Terraform, Go/Python/Node/PHP/Ruby clients, **read-only hosted MCP server** (OAuth, per-product endpoints, `/mcp/compute` etc.). README says "all 195 tools"; its endpoint table sums to 185 (see contradiction). |

### Capabilities (78) — changed or refreshed rows

- **`audit-log`** (yes, "Up to 10 years"): update the note to include the price — "Audit Logs export account
  activity to an immutable Object Storage bucket for up to 10 years (3,653 days); the first 30 days of storage
  are included, ingestion costs $0.50/GB and retention beyond that costs $0.01/GB/month." Verdict/figure stay.
  Source: <https://www.vultr.com/pricing/> and
  <https://docs.vultr.com/platform/logs/audit-logs/how-to-create-an-audit-logs-subscription.md>.
- **`mcp-server`** (partly, "Read-only preview"): still correct. Refresh the note with the current shape:
  hosted at `https://mcp.vultr.com/mcp`, OAuth sign-in, read-only, per-product endpoints (`/mcp/compute` 31
  tools, `/mcp/network` 38, `/mcp/databases` 30, `/mcp/account` 23, `/mcp/catalog` 18, `/mcp/storage` 16,
  `/mcp/registry` 12, `/mcp/kubernetes` 14, `/mcp/inference` 3), admin must enable MCP for the organization and
  grant the `Use MCP` policy. It cannot create, modify or delete, and has no tools that spend money.
  **Tool count contradiction:** the README header says "serves all 195 tools", but its endpoint table sums to
  185 (31+38+30+23+18+16+12+14+3), and the same README is titled "Public Beta" while the docs call it "public
  preview". Do not put a count in the card unless the parent wants to cite the 195 header; the card currently
  says no count, so nothing needs changing.
  Sources: <https://docs.vultr.com/reference/mcp-server/overview>,
  <https://github.com/vultr/vultr-mcp> (README, commit 10 Nov 2026, v2.1.31) and the 23 October 2026 blog.
- **`sso`** (yes, "OIDC; no SAML"): unchanged — docs updated 15 April 2026 still say "Other authentication
  technologies, such as SAML, are not currently supported."
- **`scoped-keys`** (partly): unchanged in substance — API keys belong to users and inherit that user's IAM
  policies, but there is no per-key scope/read-only switch; the portal's key is account-wide. (Docs describe
  API Key Manager for account users and optional expiry; no per-key scopes.)
- **`choose-region`** (yes, "34 regions"): keep 34, but add Chennai to the note if it enumerates; the API lags
  at 33.
- **`big-machines`** (yes, "96 vCPU / 256 GB"): note already says VX1 reaches 192 / 768 — fine; the figure is
  the Optimized maximum, not the platform maximum.

All other rows: **verdicts unchanged**. Reconfirmed the load-bearing ones:

- `per-second` no / `active-cpu` no / `cheap-pause` no — one-hour minimum, billed while stopped, only destroy
  ends the charge.
- `free-tier` partly — 1 vCPU / 512 MB / 10 GB, Miami/Seattle/Frankfurt, application + randomized weighted.
- `free-credit` partly — promo codes ($200/$300/$250 offers) or VULTRMATCH dollar-for-dollar up to $100; no
  automatic signup credit.
- `no-card` no — registration requires a linked card or PayPal; Alipay, UnionPay, BitPay crypto
  and the rest are accepted payment methods. The free tier is a separate application.
- `flat-price` yes — $20 for 2 vCPU / 4 GB / 80 GB; the 672-hour cap means a full month bills $20, not
  730 × the hourly rate.
- `no-monthly-fee` yes, `sla` yes (100%, per service item, ticket + request), `soc2` yes, `dpa` yes,
  `status-page` yes, `open-source` no.
- `any-size` no, `live-resize` partly (upgrades only; downgrades unsupported), `gpu` yes (AMD + NVIDIA),
  `custom-image` partly (ISO only, max 2 per account, <10 GB, Windows ISOs refused), `nested-virt` partly
  (VX1 only).
- `pause-memory` no, `warm-pool` no, `fast-start` no, `snapshot-files` yes, `snapshot-memory` no,
  `fork-running` no, `older-snapshot` yes, `templates` yes, `backups` yes (daily/every other day/weekly/
  monthly, two most recent, +20%), `files-survive-stop` yes.
- `volumes` yes, `shared-volume` yes (File System), `mount-buckets` partly (S3 API, no native mount),
  `big-disk` yes, `big-machines` yes.
- `stay-on` yes, `choose-idle` no, `wake-on-request` no, `schedules` no.
- `public-url` yes, `private-url` partly, `ssh` yes, `web-terminal` partly (VNC), `tunnel` yes, `raw-tcp` yes
  (outbound 25/137–139/445 blocked by default, 1688 inbound only), `custom-domain` yes, `auto-https` partly,
  `egress-included` yes, `egress-allowlist` no, `no-internet` yes, `static-ip` yes, `secrets-store` no,
  `hidden-secrets` no, `scoped-keys` partly, `dashboard-create` yes, `cli` yes, `python-sdk` yes, `ts-sdk`
  partly (JS client), `rest-api` yes, `pty` no, `file-api` no, `agents-preinstalled` no, `prompt-api` no,
  `one-click-hermes` yes, `one-click-openclaw` yes, `browser` no, `desktop` partly, `hosts-other-agents` yes,
  `team-workspace` yes, `roles` yes, `spend-cap` no, `usage-alerts` partly, `open-source` no.

### Other product and policy findings

- **Vultr Clusters** is a newer product on the Cloud Compute page: "Create on-demand, self-service Vultr Cloud
  Compute instance clusters provisioned through the simple Vultr Console or API. Vultr Clusters creates
  configurations to satisfy the exacting needs of workloads, and can scale infrastructure to meet varying
  demand with ease." It is an orchestration layer over Cloud Compute instances, not a new sandbox primitive, so
  no feature/capability verdict changes.
- **Vultr Agent** (beta, `agent.vultr.com`) is a docs chat plus "Agent Compose": "Vultr Agent lets you chat with
  our docs to explore products and use Agent Compose to build infrastructure and get instant pricing." It is
  not a hosted agent runtime and does not change `built-in-agents`, `hosts-other-agents`, `agents-preinstalled`
  or `prompt-api`.
- **NVIDIA OpenShell / Confidential Computing** (21 October 2026): Vultr supports the OpenShell reference
  architecture and confidential-computing deployment models on its GPU stack. It is infrastructure for agent
  security, not a VPS feature; no capability change.
- **Vultr Open Source Alliance** (10 November 2026): partnerships with Spinifex, UpBound, Qdrant, Valkey, HAMi
  and NetBird. The platform itself is still proprietary; `open-source` stays **no**.
- **Resize contradiction:** the Cloud Compute FAQ says "Yes, Vultr allows users to scale resources up or down
  based on their needs", but the resize doc (updated 4 November 2026) says "Move a Vultr Cloud Compute instance
  to a plan with more vCPUs, RAM, and storage. **Downgrades are unsupported.**" and "Downgrading is not
  supported." The card's upgrades-only reading matches the doc, not the FAQ.
- **Payments / tax:** "We accept Visa, Mastercard, American Express, Discover, JCB, BitPay (BTC, BCH, ETH,
  DOGE, PAX, BUSD, LTC, USDC, GUSD), Alipay, UnionPay, and PayPal." A "valid Credit Card or PayPal must be
  linked to register for services". "Prices listed on our website do not include tax. Tax will be added to your
  invoice as a separate line item." Vultr collects VAT/sales tax where required. All prices are USD; the console
  shows local pricing in some regions, and the FAQ says "certain global data center locations may have different
  per hour and per month pricing".
- **Reserved IPs:** "$0.004 per hour, which amounts to $3 per month" — not free. One public IPv4 is included on
  paid plans; additional instance IPv4 addresses are available, but their fee is not published on the pages
  read (the card already says this).
- **Status:** on 12 November the status page showed Singapore as the only "Service Impacted" region, from
  "Singapore Network Outage - ALRT-7JHLJJT", alert created 2026-09-24 14:31:17 UTC: "The cause is due to
  inclement weather involving Typhoon Dujuan which resulted in a global sub-sea cable cut. Our engineers will
  continue to monitor the status of this outage until it is resolved." There is still no incident-history or
  past-incidents section, only current alerts and planned maintenance.
- **Company:** The Constant Company, LLC; founded 2014; privately held; 34 regions, 80m+ instances, 1.5m+
  customers, 75+ engineers; $3.5B valuation (December 2024, LuminArx and AMD Ventures) and $329M credit
  financing (June 2025) — all unchanged and confirmed on the about page.
- **Legal:** ToS last modified 28 March 2024, entity "The Constant Company, LLC, and its affiliates"; DPA by
  request through an account manager or support ticket; 100% uptime SLA last modified 27 June 2022, per
  service item, credits proportional to the affected server.

### Docs links

All 16 resolve. `mcp-server` isn't a docs topic, but `ways-to-drive` points at the API docs and could mention
`https://mcp.vultr.com/mcp`. The Marketplace links for Hermes/OpenClaw still resolve.

### Sources (Vultr)

- <https://www.vultr.com/pricing/>
- <https://www.vultr.com/resources/faq/>
- <https://docs.vultr.com/support/platform/compliance/does-vultr-offer-a-data-processing-addendum>
- <https://www.vultr.com/products/cloud-compute/>
- <https://www.vultr.com/locations/>
- <https://www.vultr.com/features/datacenter-regions/>
- <https://www.vultr.com/products/vx1-compute/>
- <https://blogs.vultr.com/chennai-cloud-data-center-region>
- <https://blogs.vultr.com/chennai-india-data-center-region-ribbon-cutting-amd-gpu>
- <https://blogs.vultr.com/vultr-mcp-server-public-preview>
- <https://blogs.vultr.com/nvidia-openshell-confidential-computing>
- <https://blogs.vultr.com/vultr-open-source-alliance>
- <https://github.com/vultr/vultr-mcp>
- <https://agent.vultr.com/>
- <https://api.vultr.com/v2/plans?per_page=500>
- <https://api.vultr.com/v2/regions?per_page=500>
- <https://docs.vultr.com/support/platform/billing/how-am-i-billed-for-my-servers>
- <https://docs.vultr.com/support/platform/billing/are-stopped-instances-still-billed-on-vultr>
- <https://docs.vultr.com/support/platform/billing/does-vultr-charge-for-stored-snapshots>
- <https://docs.vultr.com/vps-automatic-backups>
- <https://docs.vultr.com/support/products/network/does-vultr-firewall-filter-outgoing-traffic-from-my-instance>
- <https://docs.vultr.com/how-to-upload-and-use-custom-isos-on-vultr>
- <https://docs.vultr.com/products/compute/instances/cloud-compute/management/resize-instance>
- <https://docs.vultr.com/what-ports-are-blocked>
- <https://docs.vultr.com/single-sign-on>
- <https://docs.vultr.com/platform/billing/manage-account-limits>
- <https://docs.vultr.com/platform/other/manage-notifications>
- <https://docs.vultr.com/reference/mcp-server/overview>
- <https://docs.vultr.com/reference/mcp-server/tools/overview>
- <https://docs.vultr.com/platform/logs/audit-logs/how-to-create-an-audit-logs-subscription.md>
- <https://blogs.vultr.com/vultr-mcp-server-public-preview>
- <https://www.vultr.com/marketplace/apps/hermesagent/>
- <https://www.vultr.com/marketplace/apps/openclaw/>
- <https://www.vultr.com/free-tier-program/>
- <https://www.vultr.com/coupons/>
- <https://www.vultr.com/servers/windows/>
- <https://www.vultr.com/company/about-us/>
- <https://www.vultr.com/legal/compliance/>
- <https://www.vultr.com/legal/sla/>
- <https://www.vultr.com/legal/tos/>
- <https://status.vultr.com/>


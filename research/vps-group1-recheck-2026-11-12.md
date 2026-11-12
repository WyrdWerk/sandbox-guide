# VPS group 1 recheck — Contabo, DigitalOcean, Hetzner Cloud, HostHatch

**At a glance**

| Provider | Rate change | Verdict change | Material product/terms change |
|---|---|---|---|
| Contabo | **new €2.00 / ~$2.40 one-time setup fee** on Cloud VPS 4, 1-month term only; plan prices unchanged | `sizes-regions/gpu` **partly → yes** | GPU VPS now orderable ($1,199/mo); Max Performance VPS rename; 275k vs 300k customer contradiction, 575k servers claimed |
| DigitalOcean | **none** | `built-in-agents/desktop` **no → yes** (Omarchy RDP desktop) | Omarchy 1-Click desktop; Codex Universal + OpenCode images; Private Droplets GA; High Performance volumes preview; Entra ID SSO |
| Hetzner Cloud | **new Helsinki CPX tier ~15% cheaper** (the price API also lists ASH/HIL at it); Falkenstein/Nuremberg unchanged; snapshots now published €0.0143/$0.0199 per GB-month | none | "Limited availability of cloud instances" notice since 26 Jun 2026; Cost-Optimized still out of stock; Experiments Inference API |
| HostHatch | **none** | none | 13 compute locations now consistent (Madrid/Milan/Warsaw stale entries removed); 8 storage locations; API exposes pooled bandwidth; BGP $10 setup |

Repo: `sandbox-guide`, baseline `origin/main` @ `4432d00` (2026-11-04). Desk research only; no accounts, credentials or billable resources. Research date **2026-11-12** (Asia/Calcutta). All prices below are in the provider's original units, copied from fresh retrievals (`maxAgeMs: 0`), not recomputed into A/B/C totals.

Tool note: **`context.web_scrape` (Composio Context) succeeded for every page cited** unless marked, always with `maxAgeMs: 0`; **`context.web_search`** succeeded for DigitalOcean Private Droplets, Hetzner's official MCP status and HostHatch 2FA corroboration; **`curl`** succeeded for Hetzner's price API (`website-price-api.hetzner.com`), `bgp.tools/as/63473` and HostHatch's `docs.hosthatch.com/llms.txt`, and was used for Hetzner raw HTML where the rendered Markdown hid the `ho-price-container` attributes. **TinyFish was not called** in this pass (Context covered every page); **no Amp native `read_web_page`/`web_search` fallback** was used. The HostHatch marketing pages rendered through Context only (plain `curl` returned a 735-byte JS shell), so those quotes are from the rendered Markdown, not raw bytes. The `research/rates/*.json` files are research artifacts; this note does not edit them.

**Confidence tags** are inline where a claim is not a direct first-party quote: `pricing-page` for money pages, `docs-confirmed` for product docs, `third-party` for outside sources, `inferred` for a conclusion from named evidence, `not-published` for a searched-but-unanswered question. Absence-based conclusions (a location no longer appears, a feature is not documented) are tagged `inferred` and should be re-checked against the order form before being treated as hard fact.

---

## 1. Contabo (`contabo`) — checked 2026-11-12

Baseline: `providers/contabo.json`, `pricing/contabo.json` (`checkedOn` 2026-10-30), `research/contabo.md`, `research/rates/contabo.json`.

### Rate card: one new input, the rest unchanged

| Input | Baseline (2026-10-30) | Fresh (2026-11-12) | Change |
|---|---|---|---|
| Cloud VPS 4, 1-month term | $6.60 / €5.50 per month | $6.60 / €5.50 per month | none |
| Cloud VPS 6 | $9.00 / €7.50 | $9.00 / €7.50 | none |
| Cloud VPS 8 | $16.80 / €14.00 | $16.80 / €14.00 | none |
| Cloud VPS 12 | $30.00 / €25.00 | $30.00 / €25.00 | none |
| Cloud VPS 16 | $44.50 / €37.00 | $44.50 / €37.00 | none |
| Cloud VPS 18 | $58.80 / €49.00 | $58.80 / €49.00 | none |
| 24-month rate, VPS 4 | $5.28 / €4.40 | $5.28 / €4.40 | none |
| **Setup fee, Cloud VPS 4, 1-month term** | **none** ("No Setup Fee" on every term) | **€2.00 one-time** (other terms "No Setup Fee") | **NEW** |
| Hourly / per-second meter | none | none | none |
| Powered-off billing | full term | full term | none |
| IPv4 | 1 included; extra €3.50/mo | 1 included; extra €3.50/mo | none |
| Traffic | unlimited, fair use | unlimited, fair use | none |
| Currency / VAT | USD list = 1.2× EUR; VAT extra for EU consumers | same (DE proxy shows gross €6.55/€2.38 vs net €5.50/€2.00) | none |

**The setup fee is the only rate-card change.** The order configurator for Cloud VPS 4 now shows a term ladder where the 1-month option carries a one-time charge:

> "1 Month **€5.50** / month €2.00 Setup fee 3 Months **€5.50** / month No Setup Fee 6 Months **€5.50** / month No Setup Fee … 12 Months €5.50 / month **€4.68** / month No Setup Fee … 24 Months €5.50 / month **€4.40** / month No Setup Fee"
> — https://contabo.com/en-us/vps/cloud-vps-core-4, fresh scrape 2026-11-12, EUR locale

The VPS page footnote says:

> "A one-time setup fee applies to new Cloud VPS 4 instances (monthly contracts only)."
> — https://contabo.com/en-us/vps/

and the FAQ says:

> "The setup fee is a one-time charge that applies to new Cloud VPS 4 orders. … For longer contracts, no setup fees apply"
> — https://contabo.com/en-us/vps/

**Contradiction (first party).** The plan cards on the same VPS page still show a "No Setup Fee" row, and the 24-month pricing page lists Cloud VPS 4 with no "No Setup Fee" label while Cloud VPS 6–18 each carry that label:

> "Cloud VPS 6 No Setup Fee … Cloud VPS 18 No Setup Fee"
> — https://contabo.com/en-us/pricing

Interpretation used here: the €2.00 fee applies **only to Cloud VPS 4 on the 1-month term**; 3-, 6-, 12- and 24-month Cloud VPS 4 terms and all other plans are fee-free. The "No Setup Fee" badges are now plan-family marketing that no longer cover the 1-month VPS 4 exception.

**USD amount.** Contabo publishes only the EUR setup fee on the configurator. Its en-US list is a fixed 1.2× the EUR list (established in `research/contabo.md` §5.7 and still true: €5.50 → $6.60, €4.40 → $5.28), so the implied USD fee is **$2.40**. This is `inferred`, not a printed USD figure; the configurator is EUR-only even on `/en-us/`.

**VAT check (fresh, same URL, different proxy country).** A German visitor sees the **gross** ladder: `€6.55 / month`, `€2.38 Setup fee`, 12 months `€5.56`, 24 months `€5.24`. A US visitor sees the **net** ladder: `€5.50`, `€2.00`, `€4.68`, `€4.40`. The difference is exactly 19% German VAT (€5.50 × 1.19 = €6.545; €2.00 × 1.19 = €2.38). So the €2.00 fee is the **net** amount, the DE page displays it gross, and the card's USD/EUR net list is the right basis. EU consumers pay VAT on top; the site's displayed "from" price for a German visitor is gross. `pricing-page` + `inferred` from the two proxies.

**What this does to A/B/C.** A, B and C each buy one Cloud VPS 4 on the 1-month term, so each gains **+€2.00 / +$2.40 one-time** on the first invoice. The monthly price itself is unchanged, so recurring totals are unchanged. (Parent should decide whether the model adds one-time fees; the rate card currently has no field for them.)

### Other Contabo changes

- **GPU VPS is now orderable, not a waitlist.** The product page shows a price and a working configurator link: `$1,199.00` standard, **`$959.20 / month` for the first 24 months** (the 12-month configurator default is **`$1,019.15 / month`**, 15% off), one **NVIDIA RTX PRO 6000** with 96 GB GDDR7, **18 vCPU / 96 GB RAM / 900 GB NVMe**, unlimited traffic, EU and US Central only. Quote: "GPU VPS $1,199.00 $ 959 20 $ / month $959.20 for the first 24 months" — https://contabo.com/en-us/gpu-vps. The old caveat "GPU VPS … was showing a waitlist on 2026-10-30" is stale; capability `sizes-regions/gpu` should move **partly → yes** (still one fixed configuration, two regions, no customisation, but it is buyable), and feature `sizes-regions` figure/note need updating.
- **Naming contradiction, GPU.** Marketing says "NVIDIA RTX PRO 6000" (RTX PRO 6000 Blackwell Server Edition, 96 GB GDDR7, 24,064 CUDA cores); docs say "NVIDIA RTX 6000 PRO Blackwell Server Edition". Same single product, two orders of the name. Report both; do not silently pick one.
- **Max Performance VPS.** The dedicated-core line formerly "Cloud VDS" is now sold as **Max Performance VPS** (docs: "sold in the Customer Control Panel as VDS and previously as Cloud VDS"). Specs: 6–24 dedicated AMD EPYC 7282 vCores, 24–96 GB reserved RAM, 180–720 GB NVMe, from $52/month. Nested virtualisation is explicitly supported there ("Proxmox VE, KVM, XenServer"), while the Core/Performance/Storage VPS docs say "Nested virtualization is not supported on any VPS plan family." This **confirms** `nested-virt = partly` (VDS line only), it does not change it.
- **1-Click images.** Docs now list: OpenClaw · n8n · Nextcloud · WireGuard · GitLab CE · cPanel · Plesk · **Dokploy** · Paperclip AI · Hermes Agent · Ollama. Quote: "An OS image with an application preinstalled and configured at first boot." — https://docs.contabo.com/docs/servers-hosting/images/. Baseline already listed OpenClaw, Hermes, n8n, Paperclip and Ollama; Dokploy is the only addition. No verdict change.
- **User roles unchanged at 8.** The rendered highlights truncate the table at six, but the full page still lists **Object Storage** and **Object Storage r/w** after Abuse & Fraud — https://docs.contabo.com/docs/account-management/user-management/. Capability `teams-accounts/roles` ("8 predefined roles") stands.
- **Snapshots unchanged.** Disk image, 1 slot on VPS 4 / 2 on VPS 6 / 3 on VPS 8+, deleted after 30 days, not counted against plan disk. Storage VPS has none. https://docs.contabo.com/docs/servers-hosting/vps/ and https://help.contabo.com/en/support/solutions/articles/103000270385-how-do-i-create-a-snapshot-of-my-server-.
- **Traffic / ports unchanged.** Unlimited inbound and outbound with fair use; 200 Mbit/s on VPS 4 up to 1 Gbit/s on VPS 16/18. Extra IPv4 limit is 1 on VPS (15 on VDS, 25 on Dedicated). https://docs.contabo.com/docs/network-services/ip-assignment/.
- **Terms changed wording on notice.** §8 now renews for an "Extension Period" equal to the initial term unless terminated "observing a notice period of four weeks until the end of the initial term"; "In the current month, notice of termination can be given at the end of the month at the earliest." This still means a 1-month contract runs to the end of the paid month; it is not an hourly stop. https://contabo.com/en-us/legal/terms-and-conditions/
- **Add-on prices unchanged** (EUR, configurator): Auto Backup €1.65/mo, Private Networking €2.29/mo, additional IPv4 €3.50/mo, 100 GB extra SSD €1.50/mo (100→200 GB), Windows Server €8.00/mo, Custom Images storage 25 GB €1.19/mo, Object Storage 250 GB €2.49/mo, Full Monitoring €11.49/mo.
- **Company numbers now contradict each other.** The VPS page says "300,000+ Customers Worldwide", "575,000+ Servers Running", "190 Countries Served", "23 Years in business"; the About page still says "**275,000+ Customers in 190 Countries**", "**300 Team Members**", "**11 locations in 9 regions on 4 continents**", "23 Years in Business". `providers/contabo.json` currently carries 275,000 customers / "over 450,000 servers". Update the servers figure to **575,000+** and keep the customer figure at 275,000+ with the 300,000+ contradiction recorded (do not average them).
- **Recent incidents unchanged in substance.** Status page still shows six notices in the 6 Aug–12 Nov window: 03.11 CVE-2026-98432 patching, 02.11 Auto Backup EU issue, 01.11 Control Panel sync, 26.10 Object Storage EU disruption (still updating 02.11), 23.10 PHP CVE-2026-115560, 08.09 CEPH slowdown (900 min estimate). https://contabo-status.com/. The 02.11 Auto Backup EU incident is worth a caveat because Auto Backup is the paid backup product.
- **1-Click app list / support scope** unchanged; no coding agent in the default Ubuntu image, no prompt API.
- **Object Storage** still S3-compatible, no native mount; docs recommend s3fs/goofys.
- **DNS** still zones + PTR, no managed TLS for VPS.
- **API** still OAuth2, `cntb`, Terraform; secrets store limited to passwords and SSH keys ("You can optionally save your passwords or public ssh keys using the Secrets Management API" — https://api.contabo.com/), no env-var injection, no proxy.
- **No free tier / no signup credit** unchanged; cheapest 1-month plan is paid at order.

### Contabo rows to change

| Row | Old | New | Why |
|---|---|---|---|
| feature `billing-models` note/figure | `$6.60/mo, monthly only`; "1-month term is $6.60 … no setup fee" | `$6.60/mo + $2.40 setup`; add one-time setup fee on the 1-month term only | new configurator fee |
| feature `trials-free-tiers` scenario | "cheapest 1-month plan is paid at order" | still true; add that the first invoice includes a $2.40 setup fee | same |
| feature `sizes-regions` note | "GPU VPS … was showing a waitlist on 2026-10-30" | orderable at $1,199/mo ($959.20 on 24-month), 18 vCPU / 96 GB / 900 GB NVMe, EU + US Central | GPU launched |
| feature `company` customers/servers | 275,000+ / 450,000+ | 275,000+ (About) vs 300,000+ (VPS page); 575,000+ servers | first-party contradiction |
| capability `sizes-regions/gpu` | `partly`, "RTX 6000 PRO; waitlist" | `yes`, "RTX PRO 6000; $1,199/mo" | buyable now |
| capability `billing-models/flat-price` | `$6.60/mo` | `$6.60/mo + $2.40 setup` | one-time fee |
| capability `sizes-regions/any-size` etc. | unchanged | unchanged | — |
| provider `cost.A/B/C` | unchanged recurring | +$2.40 one-time each (if modelled) | setup fee |
| provider `checkedOn` | 2026-10-30 | 2026-11-12 | pages reread |
| pricing `summary` | "Cloud VPS 4 is $6.60 a month on the 1-month term…" | add "plus a €2.00/$2.40 one-time setup fee on that term" | configurator |
| pricing note "No setup fee was shown for any term…" | no setup fee; 2014 waiver | "A **€2.00** setup fee applies to the **1-month** term only; 3/6/12/24-month terms show 'No Setup Fee'. The 2014 waiver no longer covers the 1-month Cloud VPS 4." | configurator |
| feature `billing-models` note | "The 1-month term is $6.60…" | add "plus a one-time €2.00/$2.40 setup fee on that term only" | configurator |
| feature `trials-free-tiers` note | "the cheapest 1-month plan is paid at order" | "the cheapest 1-month plan is paid at order, plus a €2.00/$2.40 setup fee" | configurator |
| provider `billing.planFee` | "no setup fee was shown for any term at this check" | "no platform fee; a one-time €2.00/$2.40 setup fee applies to the 1-month Cloud VPS 4 term, and 3/6/12/24-month terms show 'No Setup Fee'" | configurator |
| provider `billing.minimum` | "One month of Cloud VPS 4 at $6.60" | "One month of Cloud VPS 4 at $6.60 plus a $2.40 one-time setup fee on the 1-month term" | configurator |
| provider `billing.stopped` | "cancellation leaves the service active until the end of the period already paid for" | unchanged; note the Terms now require four weeks' notice before the end of the term | terms |
| provider `fits.badly` | "…or a GPU today: … the GPU VPS was on a waitlist" | "…or a GPU other than one RTX PRO 6000: the GPU VPS is a single fixed configuration in EU and US Central, orderable at $1,199/mo" | GPU launched |
| provider `whatItIs` | "Cloud VDS gives 6–24 dedicated vCores" | "Max Performance VPS (Cloud VDS) gives 6–24 dedicated vCores" | rename |
| provider `isolation` | "the dedicated-core Cloud VDS line" | "the dedicated-core Max Performance VPS (Cloud VDS) line" | rename |
| provider `company` facts | 275,000 customers; over 450,000 servers | keep 275,000+ with the 300,000+ contradiction; **575,000+ servers** | current pages |
| provider `strengths` | no GPU line | add "A single RTX PRO 6000 Blackwell GPU VPS with 96 GB VRAM, 18 vCPU / 96 GB / 900 GB NVMe, at $1,199/mo ($959.20 on 24 months)" | GPU launched |

Everything else in the Contabo feature/capability set was confirmed against a live first-party page and needs no verdict change: KVM full VM, root, Docker, custom ISO/QCOW2, fixed shapes, upgrade-in-place with reboot (no shrink), 9 regions/11 locations, no pause, disk snapshots only, no templates, daily Auto Backup add-on, whole disk persists, no block volumes, S3 object storage via s3fs/goofys, 1.4 TB Storage VPS, no idle stop, no wake, no scheduler, public IPv4 + /64 IPv6 + SSH + VNC, DNS zones + PTR but no managed TLS, unlimited traffic with no egress allowlist or offline mode, static IP, password/SSH-only secret store, role-scoped (not resource-scoped) API users, panel/API/CLI/Terraform, no official Python/TS SDK, no MCP, no PTY/file API, no coding-agent image, no prompt API, Hermes/OpenClaw only via 1-click + SSH onboarding, no browser/desktop, no documented "hosts other agents", several users with 8 roles, no SSO, prepaid term as the only spend cap, per-resource API audits but no account-wide audit log, monthly-only billing, no active-CPU meter, no cheap pause, flat price, no free tier/credit, pay-before-provision, status page, 99.9% annual connectivity with no credits, no SOC 2 report offered, online DPA, proprietary platform.

### Contabo exact prose replacements

- `billing.planFee`: **"No platform fee. The plan price is the whole machine charge. A one-time €2.00 setup fee applies to new Cloud VPS 4 instances on the 1-month term only; the 3-, 6-, 12- and 24-month terms show 'No Setup Fee'."**
- `billing.minimum`: **"One month of Cloud VPS 4 at $6.60 plus a one-time €2.00 ($2.40 implied) setup fee on the 1-month term. No free tier and no signup credit; payment is due before the server is provisioned."**
- `billing.meter`: unchanged ("$6.60 a month on the 1-month term and $5.28 on the 24-month term").
- `whatItIs[0]`: "Cloud VDS gives 6–24 dedicated vCores" → **"Max Performance VPS (Cloud VDS) gives 6–24 dedicated vCores"**.
- `isolation`: "the dedicated-core Cloud VDS line" → **"the dedicated-core Max Performance VPS (Cloud VDS) line"**; "The GPU product is a separate, single-configuration instance." → **"The GPU product is a separate, single-configuration RTX PRO 6000 instance, orderable in EU and US Central."**
- `fits.well`: add **"A single dedicated GPU when a shared-core box will do: the GPU VPS pairs one RTX PRO 6000 Blackwell (96 GB VRAM) with 18 vCPU / 96 GB / 900 GB NVMe at $1,199 a month ($959.20 on 24 months), in EU and US Central."**
- `fits.badly[4]`: **"Nested virtualisation on the cheap Core VPS, Windows bring-your-own-licence, or a GPU other than one RTX PRO 6000: nested virt needs the Max Performance VPS line, and the GPU VPS is a single fixed configuration in two regions."**
- `fits.badly` GPU sentence "Anything that needs a GPU…" → **"Anything that needs a GPU other than one RTX PRO 6000, nested virtualisation, a memory snapshot, an idle sleep, a hard spend cap or SSO."**
- `usability.tripsUp`: add **"The 1-month Cloud VPS 4 term carries a €2.00 one-time setup fee; 3-, 6-, 12- and 24-month terms do not."**
- `company.facts["Customers"]`: **"275,000+ customers in 190 countries on the About page; the VPS page says 300,000+ Customers Worldwide."** Source https://contabo.com/en-us/about-us, quote "275,000+ Customers in 190 Countries", `docs-confirmed`; keep the VPS-page 300,000+ as the second side.
- `company.facts["Servers"]`: **"575,000+ servers running worldwide."** Source https://contabo.com/en-us/vps/, quote "575,000+ Servers Running", `docs-confirmed`. The old "over 450,000" quote is no longer on the About page.
- `company.facts["Recent incidents"]`: **"The status page currently shows six notices for 6 August to 12 November 2026. The oldest is a CEPH storage slowdown posted on 8 September with a published estimate of 900 minutes; the newest is a 3 November CVE-2026-98432 patching notice. The 2 November Auto Backup EU incident is still being updated."** Source https://contabo-status.com/.
- `caveats`: add **"GPU VPS is one fixed configuration"** — 18 vCPU / 96 GB / 900 GB NVMe / one RTX PRO 6000 96 GB, EU and US Central only, Ubuntu 24.04 CUDA only, not available via the API or CLI, no Auto Backup add-on, no custom images, no region migration. Source https://docs.contabo.com/docs/servers-hosting/gpu-vps/.
- `caveats`: add **"The 1-month term now has a setup fee"** — €2.00 on Cloud VPS 4 only, waived on 3/6/12/24 months and on every other plan; the page's "No Setup Fee" badges no longer cover the 1-month VPS 4.
- `sources`: add `https://contabo.com/en-us/gpu-vps`, `https://docs.contabo.com/docs/servers-hosting/gpu-vps/`, `https://docs.contabo.com/docs/servers-hosting/max-performance-vps/`, `https://contabo-status.com/`.
- `pricing.sources`: add the GPU VPS page and configurator, the Max Performance VPS docs, and the status page.

**Bottom line for Contabo:** the plan prices did not move; the 1-month Cloud VPS 4 now carries a **€2.00 / ~$2.40 one-time setup fee**, and the **GPU VPS is on sale** at $1,199/month instead of a waitlist. Both are worth integrating; the GPU change flips a capability verdict.

---

## 2. DigitalOcean (`digitalocean`) — checked 2026-11-12

Baseline: `providers/digitalocean.json`, `pricing/digitalocean.json` (`checkedOn` 2026-10-30), `research/digitalocean.md`.

### Rate card: no price changed

Every published Droplet price was re-read from the live table and matches the card exactly:

- **Basic (Regular, shared vCPU):** 512 MiB/1 vCPU/10 GiB $4.00 ($0.00595/h); 1 GiB/1/25 $6.00 ($0.00893); 2 GiB/1/50 $12.00 ($0.01786); 2 GiB/2/60 $18.00 ($0.02679); 4 GiB/2/80 $24.00 ($0.03571); 8 GiB/4/160 $48.00 ($0.07143); 16 GiB/8/320 $96.00 ($0.14286).
- **CPU-Optimized:** 4 GiB/2/25 $42.00; 8/4/50 $84.00; 16/8/100 $168.00; 32/16/200 $336.00; 64/32/400 $672.00; 96/48/600 $1,008.00.
- **General Purpose:** 8 GiB/2/25 $63.00; 16/4/50 $126.00; 32/8/100 $252.00; 64/16/200 $504.00; 128/32/400 $1,008.00; 160/40/500 $1,260.00.
- **Memory-Optimized:** 16 GiB/2/50 $84.00; 32/4/100 $168.00; 64/8/200 $336.00; 128/16/400 $672.00; 192/24/600 $1,008.00; 256/32/800 $1,344.00.
- **Storage-Optimized:** 16 GiB/2/300 $131.00; 32/4/600 $262.00; 64/8/1,170 $524.00; 128/16/2,340 $1,048.00; 192/24/3,520 $1,572.00; 256/32/4,690 $2,096.00.
- **v5 resource rates:** shared vCPU $0.0158219/vCPU-hour, General Purpose vCPU $0.028/vCPU-hour, memory $0.0040411/GiB-hour, boot disk $0.000137/GiB-hour. Public IPv4 "introductory line-item price is currently $0.00". No monthly cap.
- **Billing rules:** per-second, 60-second or $0.01 minimum; bundled plans capped at **672 hours** (28 days) per month; powered-off Droplets bill in full; "Billing begins when you create the Droplet and ends when you destroy it."
- **GPU Droplets:** H100 $4.41/GPU-hour ($35.28 for 8x), H200 $4.47 ($35.76 8x), L40S $1.57, RTX 4000 $0.76, RTX 6000 $1.57, MI300X $2.59 ($20.72 8x), MI325X $3.80 ($30.40 8x). 12-month reserved H100 $3.26, H200 $3.40.
- **Volumes:** standard $0.10/GiB-month, 1 GiB–16,384 GiB (16 TiB), billed whether attached or not. **High Performance volumes are free during the private preview** (new, no published future rate).
- **Snapshots:** $0.06/GB-month, $0.01 minimum, retained until deleted. **Backups:** 20% weekly / 30% daily of the Droplet price (usage-based alternatives $0.04/$0.03/$0.02/$0.015/$0.01 per GiB-month for weekly/12h/6h/4h).
- **Egress:** included per plan then **$0.01/GiB**; inbound free; pooled at team level, no rollover.

**No rate-card input changed.** The only new money fact is a forward-looking policy: "Beginning on 1 January 2027, new and existing copies of a Droplet snapshot in additional regions are billed at the same price as the original snapshot." (https://docs.digitalocean.com/products/snapshots/details/pricing/). Not a current rate.

### New and changed product facts

1. **Omarchy is a full graphical desktop Droplet image — a capability flip for `built-in-agents/desktop`.**
   > "This 1-Click runs the full Omarchy desktop natively on your droplet, viewable from your browser: a persistent, accessible-from-anywhere cloud dev desktop"
   — https://docs.digitalocean.com/products/marketplace/catalog/omarchy/ (generated 10 Nov 2026)

   The same page gives the access model:
   > "Remote desktop at `<droplet-ip>:3389`, served by hypr-rdp, a native RDP server for Hyprland … Connect with any standard RDP client. No browser plugin, no VNC, and no SSH tunnel to set up"
   > "Minimum: 2 vCPUs / 4 GB RAM … Disk: 80 GB or larger (image minimum) … No GPU required: graphics run in software on the droplet's virtual display"

   So DigitalOcean now sells a **real Hyprland desktop on a Droplet**, reachable over RDP, with Chromium, Docker, Neovim and the Omarchy app suite. The old `desktop: no` row and the feature sentence "There is no graphical desktop on a Droplet or in a Harness Runtime session" are wrong. Recommended: **`desktop: yes`**, figure `Omarchy RDP desktop`, note the 2 vCPU / 4 GB / 80 GB minimum and that the password is memory-only, so a reboot turns RDP off until `omarchy-rdp-password` is run again (a buyer-relevant catch). The **$24/month Basic 2 vCPU / 4 GiB / 80 GiB** Droplet is the cheapest bundled shape that meets the stated minimum. If the parent prefers to reserve `yes` for a managed computer-use product, `partly` with that shortfall is the conservative alternative.

2. **New coding-agent 1-Click images: Codex Universal and OpenCode.**
   - Codex Universal: "Run OpenAI codex-universal on DigitalOcean — the reference Docker image for the multi-language development environment used in OpenAI Codex." It is a **development container**, not the Codex CLI agent: "Official image from `ghcr.io/openai/codex-universal`", minimum 8 GB RAM / 4 vCPU / 120 GB, SSH in and run `/opt/codex-universal/shell-codex-universal.sh`. https://marketplace.digitalocean.com/apps/codex-universal
   - OpenCode: "Deploy OpenCode, an open-source AI coding agent that runs in your terminal, pre-configured to use DigitalOcean Serverless Inference for inference." https://marketplace.digitalocean.com/apps/opencode
   - Hermes Agent (v2026.9.24) and OpenClaw (2026.10.10) are still listed; QM by YC Labs ("An AI workspace for your team") is another new 1-Click.

   `agents-preinstalled` stays **partly**: the default Ubuntu image has no agent, and Codex Universal is an environment rather than the Codex CLI. But the shortfall/figure should now name **OpenClaw, Hermes, OpenCode and Codex Universal**, not just OpenClaw/Hermes. `one-click-hermes` stays **partly** — its listing still has no "Getting started" body (the heading jumps straight to "API Creation"), so the post-deploy steps remain unpublished.

3. **Private Droplets are GA, at no extra cost.**
   > "Private Droplets are Droplets with VPC-only networking and no direct public connectivity."
   > "Private Droplets do not have additional costs beyond standard Droplet pricing."
   > "Internet access only through VPC NAT gateway."
   — https://docs.digitalocean.com/products/droplets/details/private-droplets/ (last verified 22 Jul 2026)

   This gives a Droplet **no public IPv4 at all** (so no IPv4 line item), no public ingress except a load balancer, and egress only through a VPC NAT gateway. It does not change `reaching-it/private-url` (still no tokenised URL), but the reaching-it note should mention it: a public IP is now optional. `outbound-network/no-internet` is still `yes`; a Private Droplet with no NAT gateway is a clean no-internet mode.

4. **SSO docs refreshed 2 Nov 2026: Entra ID-specific guidance, and the `team_role` claim is now optional.** Still generic **OIDC**, not SAML:
   > "Teams can use Microsoft Entra ID as an identity provider for single sign-on (SSO). SSO configuration no longer requires your IdP to send a `team_role` claim."
   — https://docs.digitalocean.com/platform/teams/

   Entra ID was already documented as an OIDC provider in the baseline research (`research/digitalocean.md` quotes "an OIDC-compatible identity provider (IdP), like Okta or Microsoft Entra ID"). `teams-accounts/sso` stays `yes` (OIDC), with Okta and Entra ID as named providers. No verdict change.

5. **v5 Droplets are still the only freely-sized option, still four US datacenters.** The pricing page's v5 section has no new regions. `sizes-regions/any-size` stays **partly** ("v5: 1-8 shared vCPU"; provider text also allows 2–64 dedicated vCPU). `live-resize` stays **no** (power off; disk cannot shrink).

6. **GPU Droplets cannot be resized** — now stated in the limits page: "You cannot resize GPU Droplets." Worth adding to the sizes/regions note, not a verdict change.

7. **Recent incidents: count unchanged at 15, but the window has rolled.**
   The status API (`https://status.digitalocean.com/api/v2/incidents.json`, fetched 2026-11-12) has **15 incidents since 2026-08-06**, the newest on **2026-10-27** ("Kubernetes Cluster Management Operations", major). There have been **no new incidents 28 Oct–12 Nov**. The profile fact says "15 incidents from 6 August to 4 November 2026" — the count and the 24 Aug control-panel/API severity statement still hold, but if `checkedOn` moves to 12 Nov the window end should become 12 Nov (still 15). The 90-day window start would also move to 14 Aug on a strict 90-day reading, which would drop the two 6 Aug entries to 13; the existing fact uses a fixed 6 Aug start, so keep that convention and change only the end date, or restate as "15 incidents between 6 August and 27 October 2026".

8. **Signup credit, SLA, certifications, DPA, status page, MCP servers, roles** all re-confirmed unchanged:
   - "$5 signup credit … expire 90 days after signup … add a valid payment method before you can create Droplets" — https://docs.digitalocean.com/platform/billing/signup-credit/
   - "99.99% for each individual Droplet instance … less than 99.99% → 100% Service Credit" — https://www.digitalocean.com/sla/cpu-droplets
   - SOC 2 Type II + SOC 3 Type II, DPA published — https://www.digitalocean.com/trust/certification-reports (not re-read in full; profile text unchanged)
   - 20 datacenters across 13 regions, 16 creatable; AMS3 and FRA1 are the two EU — https://docs.digitalocean.com/platform/regional-availability/
   - Official MCP servers, doctl, PyDo, DoTs, Go — https://docs.digitalocean.com/reference/mcp/
   - Six predefined roles plus custom roles; spend alerts are not a cap — https://docs.digitalocean.com/platform/teams/ and https://docs.digitalocean.com/platform/billing/spend-alerts/

### DigitalOcean rows to change

| Row | Old | New | Why |
|---|---|---|---|
| capability `built-in-agents/desktop` | `no`, "none" | `yes`, "Omarchy RDP desktop" (or `partly` + RDP/4 GB/80 GB shortfall) | 1-Click full Hyprland desktop over RDP |
| feature `built-in-agents` note/scenario | "There is no graphical desktop on a Droplet…" | Omarchy gives a browser/RDP desktop; default Ubuntu still has none | same |
| feature `built-in-agents` note | "OpenClaw … Hermes Agent and Docker Agent" | add **OpenCode** and **Codex Universal**; QM by YC Labs | new 1-Click images |
| capability `built-in-agents/agents-preinstalled` | `partly`, "OpenClaw/Hermes images" | `partly`, "OpenClaw/Hermes/OpenCode images"; shortfall: default Ubuntu has none, Codex Universal is an env not the CLI | new images |
| capability `built-in-agents/browser` | `partly`, "chromium in sessions" | `partly`, "Chromium in Omarchy; sessions" — shortfall: only the Omarchy image or Harness sessions, not the default Droplet | Omarchy ships Chromium |
| capability `reaching-it/private-url` | `partly`, "firewall by address" | unchanged verdict; note Private Droplets remove public ingress entirely but still have no token URL | Private Droplets |
| capability `storage/volumes` | `yes`, "1 GiB-16 TiB, $0.10/GiB-mo" | unchanged; note High Performance volumes free in private preview | new tier |
| feature `snapshots-forks` note | "Snapshots … kept until deleted" | add multi-region copies billed from 1 Jan 2027 | new pricing policy |
| feature `company` recent incidents | 15 incidents "6 August to 4 November" | 15 incidents, none after 27 Oct; update window end to 12 Nov if `checkedOn` advances | status API |
| provider `checkedOn` | 2026-10-29 | 2026-11-12 | pages reread |
| pricing `checkedOn` | 2026-10-30 | 2026-11-12 | price table reread (no change) |

Everything else in the DigitalOcean feature/capability set was re-confirmed: full Linux VM, root, Docker, custom images (qcow2/VMDK up to 100 GB), no documented nested virt, 31 bundled shapes, 16 datacenters / 2 EU, GPU H100 $4.41/h, 672-hour cap, powered-off billing, per-second meter with 60 s/$0.01 floor, no plan fee, $24 flat 2 vCPU/4 GiB, $5 credit but card required, no free tier, disk survives power-off, 1–16 TiB volumes one-server-at-a-time, Spaces S3 but no documented mount, 16 TiB big disk, no idle stop, no wake for Droplets (Managed Agents only), cron only (no scheduler), public IPv4 + SSH + browser console + ssh -L + any port except SMTP, DNS + A record but no managed cert on a Droplet, egress included + firewall allowlist + deny-all + static IP, no secret store on a Droplet (Managed Agents only), scoped API tokens, dashboard/doctl/PyDo/DoTs/REST/MCP, no PTY or file API on Droplets, 1-Click agent images but no prompt API, no desktop before Omarchy, no documented "hosts other agents", teams/roles/SSO/spend alerts/no cap/partial audit, SOC 2/SLA/DPA/status, proprietary platform.

### DigitalOcean provider prose that still says the old thing

- `oneLiner`: "Ordinary Linux VMs at a flat monthly price, with a hardened one-click OpenClaw image and a separate managed agent runtime." → add "and a browser/RDP desktop image" (Omarchy).
- `whatItIs[2]`: "the Marketplace carries 1-Click Droplet images for OpenClaw, Hermes Agent and Docker Agent" → **OpenClaw, Hermes Agent, OpenCode, Codex Universal, QM and Omarchy**; "Docker Agent" is not a listing (Docker is).
- `isolation`: "nested virtualisation is not documented" — still true; add that Private Droplets have no public interface and Omarchy is a software-rendered desktop.
- `sizes`: "31 bundled CPU shapes … 16 datacenters" — still true; add "GPU Droplets cannot be resized" and "Omarchy needs 2 vCPU / 4 GB / 80 GB".
- `whoFor`: add "a computer-use agent that needs a real desktop".
- `fits.well`: add "A computer-use agent: Omarchy gives a full Hyprland desktop over RDP, Chromium included, from $24/month (2 vCPU / 4 GiB / 80 GiB)." Add "Private Droplets: a Droplet with no public IPv4 at no extra cost."
- `fits.badly`: "outside the three Marketplace images" → "outside the Marketplace images"; add "a reader who expects a managed desktop API: Omarchy is an image you administer, not a computer-use service."
- `usability.tripsUp`: add "Omarchy's RDP password is held in memory only; a reboot turns remote desktop off until `omarchy-rdp-password` is run again." Add "Private Droplets have no public IP; reach them through a bastion, load balancer or NAT gateway." Add "GPU Droplets cannot be resized." Add "High Performance volumes are free only while the private preview lasts."
- `strengths`: add "A real Arch/Hyprland desktop over RDP, with Chromium and a dev toolchain, as a 1-Click Droplet." Add "Private Droplets with no public IP, at no extra cost."
- `caveats`: add "The Omarchy desktop is an image, not a managed computer-use product" with the 2 vCPU / 4 GB / 80 GB minimum, RDP port 3389, self-signed certificate, memory-only password and reboot behaviour; add "Private Droplets are VPC-only" (no public ingress except a load balancer; egress only via NAT); add "High Performance volumes are a private preview" (free now, no published price).
- `company.facts["Recent incidents"]`: replace the value with **"By this guide's count, the status page lists 15 incidents between 6 August and 27 October 2026 (checked 12 November; none since 27 October). The most severe, on 24 August, gave control-panel and API users errors peaking at 25% for 3.5 hours within a 6-hour span."** Source https://status.digitalocean.com/incidents/4qwm6pzlx1z3 and the status API `https://status.digitalocean.com/api/v2/incidents.json` (15 records with `created_at >= 2026-08-06`). The old "to 4 November" wording is a check-date, not an incident date.

**Bottom line for DigitalOcean:** no Droplet, GPU, volume, snapshot or egress price moved. The one material change is **Omarchy**, a 1-Click Arch/Hyprland desktop reachable over RDP, which turns the "no graphical desktop" claim into a `yes` and adds Chromium to the browser story. Codex Universal and OpenCode are new agent images but do not change the default-image verdict.

---

## 3. Hetzner Cloud (`hetzner`) — checked 2026-11-12

Baseline: `providers/hetzner.json`, `pricing/hetzner.json` (`checkedOn` 2026-10-29), `research/hetzner.md`.

### The rate change: CPX plans are now priced per location, and Helsinki is ~15% cheaper

Hetzner has not raised the Falkenstein/Nuremberg price of any CPX plan. It has introduced a **second, lower price tier for Helsinki** on the current CPX product generation. The price API's CLOUD_140–146 entries also carry **ASH1/HIL1** at the Helsinki level, but the plan page's separate "United States" table uses different plan names and specs (CPX11–CPX51), so do not read that as the same US plan being cheaper without checking the order form. The old `CLOUD_124` product (the one the baseline card cites) still returns one EU price; the plan page now uses `CLOUD_140`–`CLOUD_146`, whose price API entries differ by data centre. CPX02 carries a **"New"** badge and the current product keys are `CLOUD_140+CLOUD_21` … `CLOUD_146+CLOUD_21` (server + Primary IPv4), not `CLOUD_124`.

Fresh price API reads (`https://website-price-api.hetzner.com/api/v1/products/<id>`, 2026-11-12), **server only, USD/EUR per month**, plus the page's hourly rate. The page's "from" prices add one Primary IPv4 (€0.50 / $0.60) to the server price:

| Plan | Specs | HEL1 server USD / EUR (page, incl. IPv4) | NBG1 + FSN1 server USD / EUR (page, incl. IPv4) | Old card |
|---|---|---|---|---|
| CPX02 | 1 vCPU / 1 GB / 20 GB | **$5.99 / €4.99** (page €5.49) | $7.49 / €5.99 (page €6.49) | $7.49, $0.012/h |
| CPX12 | 1 / 2 / 40 | **$10.99 / €9.49** (€9.99) | $13.49 / €11.49 (€11.99) | $13.49, $0.0216/h |
| CPX22 | 2 / 4 / 80 | **$19.49 / €16.49** (€16.99) | $22.99 / €19.49 (€19.99) | $22.99, $0.0368/h |
| CPX32 | 4 / 8 / 160 | **$35.49 / €29.99** (€30.49) | $41.99 / €35.49 (€35.99) | $41.99, $0.0673/h |
| CPX42 | 8 / 16 / 320 | **$69.49 / €58.99** (€59.49) | $81.99 / €69.49 (€69.99) | $81.99, $0.1314/h |
| CPX52 | 12 / 24 / 480 | **$100.99 / €84.99** (€85.49) | $118.99 / €100.49 (€100.99) | $118.99, $0.1907/h |
| CPX62 | 16 / 32 / 640 | **$129.99 / €110.49** (€110.99) | $152.99 / €129.99 (€130.49) | $152.99, $0.2452/h |

Hourly server rates follow the same split: CPX22 **$0.0312/h HEL1 (and the API's ASH1/HIL1 entries)** vs **$0.0368/h NBG1, FSN1**; CPX32 **$0.0569** vs **$0.0673**; CPX02 **$0.0096** vs **$0.0120**; CPX12 **$0.0176** vs **$0.0216**; CPX42 **$0.1114** vs **$0.1314**; CPX52 **$0.1618** vs **$0.1907**; CPX62 **$0.2083** vs **$0.2452**. Singapore is higher again (CPX22 $30.99/€26.49, $0.0497/h).

Quotes (rendered page):
> "CPX22 … from /month € 16.99 per month, excl. VAT … from /hour € 0.0272 per hour, excl. VAT … eu-central NBG1 … € 19.99 per month … eu-central HEL1 … € 16.99 per month … ap-southeast SIN1 … € 26.99 per month"
— https://www.hetzner.com/cloud/regular-performance/

> "CPX02 … from /month € 5.49 per month, excl. VAT … /hour € 0.0088 per hour"
— same page. The page's per-location prices **include one Primary IPv4**; the price API's do not (baseline caveat, still true).

**What this means for the card.** The existing `pricing/hetzner.json` numbers are exactly the **NBG1/FSN1** tier, so if the card keeps that basis **no shape rate changes** — but its note "These are Hetzner's own USD prices for the EU network zone (Falkenstein, Nuremberg, Helsinki)" and its summary are now wrong, because Helsinki is not the same price. If the card moves to the **cheapest EU** tier (HEL1), every shape changes:

| Shape | Old monthly | New HEL1 monthly | Old hourly | New HEL1 hourly |
|---|---|---|---|---|
| CPX02 | $7.49 | **$5.99** | $0.0120 | **$0.0096** |
| CPX12 | $13.49 | **$10.99** | $0.0216 | **$0.0176** |
| CPX22 | $22.99 | **$19.49** | $0.0368 | **$0.0312** |
| CPX32 | $41.99 | **$35.49** | $0.0673 | **$0.0569** |
| CPX42 | $81.99 | **$69.49** | $0.1314 | **$0.1114** |
| CPX52 | $118.99 | **$100.99** | $0.1907 | **$0.1618** |
| CPX62 | $152.99 | **$129.99** | $0.2452 | **$0.2083** |

**A note on the "currently unavailable" tooltip.** The regular-performance page contains a hidden `<span class="configbtn-tooltip">This product is currently unavailable. Please check back later.</span>` next to every Create button. It is a CSS tooltip, not a visible badge, and it is present for **all** plans (including General Purpose, which is on sale). Do not read it as stock status. The visible stock signal is the separate **"not available"** label on the Cost-Optimized cards. `inferred` from the raw HTML.

A/B/C consequences, for the parent to choose (not recomputed here): on the HEL1 tier the always-on B (CPX32) falls from $41.99 + $0.60 to **$35.49 + $0.60**, and C (CPX22) from $22.99 + $0.60 to **$19.49 + $0.60**. The cap binds at the same ~624 hours because the hourly/monthly ratio is unchanged. A's CPX02 + IPv4 falls from $8.09 to **$6.59** a month. The site currently describes itself as pricing "the EU network zone"; that phrase can no longer mean one price.

**Recommendation.** Either tier is defensible, but the note must name it. Option 1 (cheapest, matches the page's "from"): model **HEL1**, state "Helsinki; Falkenstein/Nuremberg are ~15% more", and update the `fits`/`strengths`/`cost` examples to $19.49/$35.49. Option 2 (least churn): keep the existing **NBG/FSN** numbers, rename the note "Falkenstein/Nuremberg", and add the HEL1 figures as the cheaper alternative. Do **not** leave the note saying all three EU locations are the same price.

### Other Hetzner rates

| Input | Baseline | Fresh | Change |
|---|---|---|---|
| Primary IPv4 | €0.50 / $0.60 per month; €0.0008 / $0.0010 per hour | same | none |
| Primary IPv6 | free | free | none |
| Extra traffic EU/US | €1.00 / $1.20 per TB | same | none |
| Extra traffic Singapore | €7.40 / $8.30 per TB | same | none |
| Volumes (block storage) | €0.044 / $0.0484 per GB-month; 10 GB–10 TB; 16 per server | same | none |
| **Snapshots** | **no published rate**; legacy page variant €0.011 / $0.0130 per GB-month, unverified | **€0.0143 / $0.0199 per GB-month** of compressed data, pro rata | **now published; +30% EUR / +53% USD vs the legacy figure** |
| Backups | 20% of server price; 7 slots | same, minimum **€1.0980**/month on CPX02; 7 slots | minimum now shown |
| Floating IPs | not priced in card | €1.00/month per IPv6 | not in card |
| Cost-Optimized | CX23 €5.99, CAX11 €6.49, CX33 €8.99, CAX21 €10.99, CX43 €16.49, CAX31 €21.49, CX53 €29.99, CAX41 €41.49; all "not available" | **same prices, all still "not available"** | none |
| General Purpose (not in card) | CCX13 from €36.99; CCX63 €725.49 (EUR, HEL) | CCX13 **€36.99 HEL / €43.49 NBG-FSN**; CCX63 **€725.49 HEL / €853.99 NBG-FSN** | same tier split; specs 2–48 vCPU / 8–192 GB / 80–960 GB |

Quotes:
> "Snapshots … per GB per month … € 0.0143, excl. VAT" — https://www.hetzner.com/cloud/regular-performance/ (add-ons table, product `CLOUD_24`; USD attribute `$ 0.0199`)
> "Backups … mo. price related to instance, starting at: € 1.0980, excl. VAT" — same page
> "We will bill you for Snapshots per gigabyte per month. … We will only bill you for the space the compressed Snapshot uses in our storage system." — https://docs.hetzner.com/cloud/billing/faq/
> "We will bill you for Backups with a monthly flat price, which is 20% of the price of the server you activate them for." — same page

### Availability caveat (new, material)

Hetzner's status page carries a still-open **information** notice:

> "Due to the continuing high demand and the limited availability of required hardware components, the provisioning of cloud servers at our locations is currently only possible to a limited extent. Given this situation, we are currently required to restrict the creation of new cloud servers for both new customers and some of our existing customers. The selection of affected existing customers is made at random."
> — https://status.hetzner.com/incident/0a75c7ae-3377-41dc-aabe-601063724d24, start **2026-06-26 06:00 UTC+0**, status **Identified**

The docs FAQ adds that a specific location can be temporarily restricted for a limited group, and that at that location new servers, rescaling and moves are blocked while existing servers keep running — https://docs.hetzner.com/cloud/general/faq/. This is buyer-relevant: "from €5.49" may not be orderable in the reader's location/account, and it explains why Cost-Optimized is out of stock. It should become a caveat/`tripsUp` item, not a verdict change.

### Status page: the "Recent incidents" fact is stale

The baseline fact says the page "keeps only its 15 most recent resolved entries, so it shows three Cloud or network outages, all between 28 October and 3 November 2026. The longest was a 58-minute Cloud DNS API fault on 3 November." On 2026-11-12 the resolved list covers **6–12 November** (no 15-entry archive), and the Cloud-relevant entries are:

- **11 Nov, 11:55–14:50 UTC — "API failure for metrics"**, status Resolved, affected **Cloud (Load Balancer, Networks, Cloud Server, Object Storage, Cloud Volume)**; description: "API endpoints for metrics (/servers/{id}/metrics and /load_balancers/{id}/metrics) are failing or data may be incomplete." That is a **2 h 55 min** metrics-API degradation, not a compute outage. https://status.hetzner.com/incident/bad0f9d8-3630-4733-8d82-94f12008e5d5
- **11 Nov — "Urgent maintenance on all core routers"**, Resolved, affected Network (Datacenter, vSwitch, Uplinks, Backbone).
- **9 Nov — "Object Storage in location fsn1 partially degraded"**, Resolved.
- **6 Nov — "Object Storage in location FSN1 partially degraded"**, Resolved.
- 6/10/11 Nov — UPS function tests and power-supply replacement in FSN1-DC24, NBG1-DC2, HEL1-DC8/10/12 (maintenance, no expected impact).
- Planned: HEL1-DC10/DC12 UPS work 17–19 Nov; NBG1-DC2 power components 24 Nov.

The 3 November DNS API fault and the 28 Oct–3 Nov entries are no longer visible. Rewrite the fact around the **11 November metrics-API degradation (2 h 55 min)** and the two Object Storage degradations; do not keep the 58-minute DNS quote.

### New product facts

- **Experiments platform: a free, experimental Inference API.** OpenAI-compatible `https://inference.hetzner.com/api/v1`, models `Qwen/Qwen3.6-35B-A3B-FP8` (MoE, 35B total / 3B active, 262,144 context, text+image) and `Qwen3.8-27B` (dense, 262,144 context, text+image). "No guarantees, but no cost either"; no backups; not for production. https://docs.hetzner.com/general/company-and-policy/experiments/inference/
- **The hosted OpenClaw experiment is finished, not current.** Hetzner ran a fully hosted OpenClaw with pre-configured models, then discontinued it: "The code quality of OpenClaw is too low … Users prefer to connect to inference directly with other clients or harnesses, without OpenClaw in the middle." So `one-click-openclaw` stays **no** (there is a first-party install guide, not a hosted one-click), and the guide/experiment should not be described as a current product. https://docs.hetzner.com/general/company-and-policy/experiments/experiments-platform/
- **No official MCP server.** The docs and product pages do not list one; only community MCP servers (e.g. `lazyants/hetzner-mcp-server`, released Mar 2026) exist. `ways-to-drive/mcp-server` stays **no**.
- **Load Balancer still from €7.49/month** (€7.49 / €21.49 / €42.99 plans), so the custom-domains note is unchanged. https://www.hetzner.com/cloud/load-balancer/

### Confirmations (no verdict change)

- **Billing:** hourly, always rounded up to a whole hour; monthly cap; powered-off still billed; delete to stop. Quotes: "We always round up the hourly usage of a server. If you create a server just for a few minutes, we will still bill you for one whole hour." / "Yes, you pay for a server that has completed the creation process for as long as it exists, regardless of whether it is turned on or not." — https://docs.hetzner.com/cloud/billing/faq/. `billing-models/per-second` no, `cheap-pause` no, `flat-price` yes all stand.
- **Locations:** "There are currently four network zones and six locations" — FSN1, NBG1, HEL1 (eu-central), ASH1 (us-east), HIL1 (us-west), SIN1 (ap-southeast). https://docs.hetzner.com/cloud/general/locations/
- **Traffic:** 20 TB EU, 1 TB US, 0.5 TB SG; overage billed in 100 MB blocks; 75%/100% notifications do not cap. https://docs.hetzner.com/cloud/billing/faq/
- **Snapshots/backups:** snapshots are manual disk copies, kept until deleted, never auto-deleted, **up to 30 across all projects**; 7 backup slots per server; both exclude attached Volumes; backups 20% of server price. https://docs.hetzner.com/cloud/servers/backups-snapshots/faq/ and /overview/
- **Nested virtualisation:** "Can I run virtual machines on cloud servers …? No, this is not possible on cloud server." `nested-virt` no stands. https://docs.hetzner.com/cloud/servers/faq/
- **Ports 25/465:** blocked by default on all cloud servers; unblock after a month and a paid invoice via a limit request. `reaching-it`/`tripsUp` stand. Same FAQ.
- **Private-only servers:** a server can have no public IP if it is in a private network; then no Floating IPs, no Firewalls, no rescue system. `outbound-network/no-internet` yes stands. https://docs.hetzner.com/cloud/servers/faq/
- **Resize:** power off, rescale; disk cannot shrink; partition may need manual work in rescue. `live-resize` no stands.
- **Team roles:** Owner, Admin, Member, Restricted; no SSO; cost/traffic alerts but no cap; Activity feed without per-user attribution. `teams-accounts` partly stands. https://docs.hetzner.com/cloud/general/faq/
- **SLA:** 99.9% monthly per Cloud Server, compensation as Cloud Credit. https://docs.hetzner.com/general/company-and-policy/slas-cloud/
- **Payments:** credit card, SEPA direct debit (EUR only), bank/wire transfer, PayPal. No free tier or signup credit; new projects start limited. https://docs.hetzner.com/general/billing-and-account-management/billing-at-hetzner/payment-overview/
- **Terms:** "The Customer is responsible for managing and securing these products at their own expense and risk." — https://www.hetzner.com/legal/terms-and-conditions/
- **No GPU on Cloud**, no pause, no scheduler, no tokenised private URL, no secret store, no TS SDK, no PTY/file API, no account-wide audit log — all re-confirmed by the docs above or unchanged pages.

### Hetzner rows to change

| Row | Old | New | Why |
|---|---|---|---|
| pricing `shapes[]` | NBG/FSN-only prices, presented as EU | either relabel as NBG/FSN or replace with HEL1 tier (table above) | location-tiered CPX pricing |
| pricing `summary`/notes | "EU network zone (Falkenstein, Nuremberg, Helsinki)" one price; "US and Singapore … higher" | EU has two tiers; HEL1 and US ASH/HIL are ~15% cheaper than NBG/FSN; Singapore higher | same |
| pricing notes: snapshots | "Hetzner no longer publishes the snapshot rate … last figure €0.011/$0.0130, unverified" | **publishes €0.0143/$0.0199 per GB-month** (compressed, pro rata); +30%/+53% vs legacy | page now shows it |
| pricing notes: backups | "20%" | "20%, minimum €1.0980/month; 7 slots" | page shows minimum |
| pricing notes: availability | only Cost-Optimized out of stock | add the 26 Jun 2026 "Limited availability of cloud instances" notice; per-location restrictions can block new servers, rescaling and moves | status/docs |
| feature `billing-models` note | 624-hour cap, powered-off | unchanged; optionally note the two EU price tiers | — |
| feature `sizes-regions` note | "Six locations in four network zones, with EU, US and Singapore prices differing." | "…with Helsinki/US ~15% below Falkenstein/Nuremberg, and Singapore higher again." | rate tiers |
| feature `trials-free-tiers` scenario | "cheapest buyable plan today is CPX02 at €5.99 / $7.49 for the server plus €0.50 / $0.60 for an IPv4" | "**€4.99 / $5.99** for the server plus €0.50 / $0.60 for an IPv4 in Helsinki (€6.49 / $8.09 in Nuremberg); availability is restricted" | new tier |
| feature `snapshots-forks` note | "no automatic retention"; no price | add "€0.0143/$0.0199 per GB-month of compressed data" | published rate |
| capability `snapshots-forks/older-snapshot` figure | "Up to 30, any age" | unchanged (docs: "Up to 30 Snapshots across all projects") | confirmed |
| feature `company` recent incidents | 3 Cloud/network outages 28 Oct–3 Nov, 58-min DNS fault | 11 Nov metrics-API degradation 2 h 55 min; 9 & 6 Nov Object Storage fsn1 degradations; no compute outage in the visible 6–12 Nov window | status page |
| provider `caveats`/`usability.tripsUp` | Cost-Optimized out of stock only | add "New cloud servers can be restricted per location" (26 Jun 2026 notice) | new availability fact |
| provider `checkedOn` | 2026-10-29 | 2026-11-12 | pages reread |
| pricing `checkedOn` | 2026-10-29 | 2026-11-12 | API reread |
| provider `fits.well` / `strengths` / `cost` prose | "$41.99 + $0.60", "$22.99 + $0.60" | update to the chosen tier; if HEL1, **$35.49 + $0.60** and **$19.49 + $0.60** | location tiering |
| provider `caveats` "Two first-party price lists" | only EUR vs USD and the IPv4 inclusion | add the **HEL1 vs NBG/FSN** tier: the page's €19.99 NBG quote vs the API's €16.49 HEL1 server price is not a contradiction, it is a different location | location tiering |
| provider `caveats` "The cheapest family is out of stock" | Cost-Optimized only | add the 26 Jun 2026 **"Limited availability of cloud instances"** notice: new servers, rescaling and moves can be restricted per location, for new and some existing customers, chosen at random | status/docs |
| provider `caveats` "Two first-party price lists" / `usability.tripsUp` | "the advertised price includes one Primary IPv4; the server alone is €0.50/$0.60 cheaper" | still true; add that **Helsinki is €1.00/$2.00 cheaper than Nuremberg for CPX02** and ~€3/€4 cheaper for CPX22 | location tier |
| provider `usability.tripsUp` "Cost-Optimized plans are listed but marked not available" | true | keep; add the broader provisioning restriction | status |
| provider `strengths` | "A cheap always-on 4 vCPU machine… $41.99 a month" | if HEL1: **$35.49**; if NBG: unchanged. State the location. | tier choice |

### Hetzner exact fact replacement

`company.facts["Recent incidents"]`:

> **"The status page's visible resolved list covers 6–12 November 2026. The Cloud-relevant entries are an 11 November metrics-API degradation (11:55–14:50 UTC, 2 h 55 min; /servers/{id}/metrics and /load_balancers/{id}/metrics failing or incomplete, affected Cloud Load Balancer, Networks, Cloud Server, Object Storage and Cloud Volume) and Object Storage degradations in fsn1 on 9 November and FSN1 on 6 November. No compute outage is visible in the window. The status page also carries a still-open 'Limited availability of cloud instances' information notice since 26 June 2026."**
— https://status.hetzner.com/incident/bad0f9d8-3630-4733-8d82-94f12008e5d5 and https://status.hetzner.com/incident/0a75c7ae-3377-41dc-aabe-601063724d24

### Hetzner provider prose that still says the old thing

- `oneLiner`: "Cheap fixed-size virtual servers..." — no price, fine; add "with a cheaper Helsinki tier" if space allows.
- `whatItIs`: "CPX22 at $22.99 + $0.60" → state the location; "$19.49 + $0.60 in Helsinki, $22.99 + $0.60 in Nuremberg".
- `sizes`: "Six locations in four network zones, with EU, US and Singapore prices differing." → "Six locations in four network zones. Falkenstein/Nuremberg and Helsinki are no longer the same price: Helsinki is ~15% cheaper, the US entries in the price API match Helsinki, and Singapore is higher again."
- `fits.well[0]`: "CPX22 at $22.99 + $0.60" → "$19.49 + $0.60 in Helsinki (€16.99 incl. IPv4) or $22.99 + $0.60 in Nuremberg".
- `fits.well[1]`: "CPX32 … $41.99 a month" → "$35.49 in Helsinki, $41.99 in Nuremberg".
- `strengths[0]`: "A cheap always-on 4 vCPU machine … $41.99 a month plus $0.60" → "$35.49 in Helsinki, $41.99 in Nuremberg, plus $0.60".
- `usability.tripsUp`: add "The plan page's 'from' price is Helsinki; Nuremberg/Falkenstein are ~15% more." Add "New cloud servers can be restricted per location; the restriction is temporary and chosen at random (status notice since 26 June 2026)." Add "Snapshots are billed at €0.0143/$0.0199 per GB-month of compressed data; backups at 20% of the server price, minimum €1.0980."
- `caveats`:
  - "The cheapest family is out of stock": update "rechecked 30 October 2026" → "12 November 2026"; "about three to four times as much" → "about 2.75–3.25× at the Helsinki tier".
  - "Two first-party price lists, and marketing includes the IPv4": add the **Helsinki vs Falkenstein/Nuremberg** tier. The page quote `€ 19.99` is NBG incl. IPv4; the HEL page quote is `€ 16.99`; the API is `€ 19.49` NBG / `€ 16.49` HEL server-only. The €0.50 difference is the IPv4, not a price change. The USD list is ~1.18× the EUR list; the account currency is fixed at signup.
  - Add "Provisioning is restricted per location": quote the status notice and the docs FAQ; consequences: a new server, rescale or move can be blocked at a location even when the plan is listed, existing servers are unaffected, restrictions are temporary and lifted automatically.
  - Add "Snapshots are now priced": €0.0143/$0.0199 per GB-month compressed, pro rata; the old €0.011/$0.0130 legacy figure is superseded.
- `sources`: add `https://status.hetzner.com/incident/0a75c7ae-3377-41dc-aabe-601063724d24`, `https://docs.hetzner.com/cloud/general/faq/`, `https://www.hetzner.com/cloud/load-balancer/`, `https://docs.hetzner.com/general/company-and-policy/experiments/experiments-platform/`, `https://docs.hetzner.com/general/company-and-policy/experiments/inference/`.
- `pricing.sources`: add the status/FAQ notice and the load-balancer page; the snapshot/backup rates come from the regular-performance add-ons table (`CLOUD_24`, `CLOUD_3`).
- `pricing.notes`: replace the "Hetzner no longer publishes the snapshot rate" paragraph with the current €0.0143/$0.0199 per GB-month (compressed, pro rata) and the €1.0980 backup minimum; add the HEL/NBG location tier and the 26 June availability notice.

**Bottom line for Hetzner:** the headline CPX prices in Falkenstein/Nuremberg did not move, but Helsinki and the US are now a **cheaper second tier** (CPX22 $19.49 vs $22.99), so the card's single "EU" price and its "US is higher" note are wrong. Snapshots now have a published rate (€0.0143/GB-month) and Hetzner is openly restricting new cloud-server provisioning per location. The card should pick a tier and say which.

---

## 4. HostHatch (`hosthatch`) — checked 2026-11-12

Baseline: `providers/hosthatch.json`, `pricing/hosthatch.json` (`checkedOn` 2026-11-04), `research/hosthatch.md`.

### Rate card: no plan price changed

Every compute and storage price is identical to the 4 November card. Fresh read of https://hosthatch.com/products:

- **Compute:** NVMe 2 GB **$4.00**; 4 GB **$6.00**; 8 GB **$9.00**; 12 GB **$12.00**; 16 GB **$15.00**; 24 GB **$22.00**; 32 GB **$29.00**; 48 GB **$39.00**; 64 GB **$49.00**; 96 GB **$69.00** per month. Specs (cores / RAM / NVMe / transfer) also unchanged: 1/2/10/1 TB, 2/4/20/1 TB, 2/8/35/2 TB, 4/12/50/3 TB, 4/16/75/4 TB, 6/24/100/6 TB, 8/32/125/8 TB, 8/48/150/12 TB, 12/64/200/15 TB, 16/96/250/20 TB.
- **Storage:** 1 TB **$5.00**; 2 TB **$9.00**; 3 TB **$12.00**; 4 TB **$16.00**; 5 TB **$20.00**; 6 TB **$24.00**; 8 TB **$32.00**; 10 TB **$38.00** per month. Specs 1–2 vCPU / 1–2 GB / 1,000–10,000 GB HDD / 2.5–25 TB transfer, unchanged.
- **Extras:** additional IPv4 **$2.00/month** (API pricing example, labelled illustration); IPv6 **free**; extra bandwidth **$2.00 per 500 GB**, **$4.00 per 1 TB** (one-time, `$4/TB`); **BGP/BYOIP $10 one-time setup per location, no monthly fee** (promotional post). No setup fee on the standard monthly plan (`setup_fees.monthly: "0.00"`).
- **Billing cycles:** monthly, quarterly, semi-annually, annually; the API catalogue returns `prices` for each cycle and `billing_cycles`, but the actual values still need an authenticated key. The docs example (`Cloud VPS 2x4`, explicitly illustrative) shows monthly `$12.00`, quarterly `$34.00`, annual `$120.00` — i.e. an annual price of 10× monthly, two months free. Do **not** copy those as plan rates; the standard NVMe 12 GB is still published at `$12.00/month`, and the card should keep using the monthly list.

**No rate-card shape or egress price changed.** `monthlyPlans: true`, `between: kept`, the 10 fixed compute shapes, 8 storage shapes, max 16 vCPU / 96 GB / 250 GB, and the 1–20 TB transfer tiers all stand.

### The material change: location set and count

The current **product page flags, Features page, homepage and status page all agree on 13 compute locations**, and **8 storage locations**:

**Compute (13):** Amsterdam, Chicago, Hong Kong, London, Los Angeles, New York, Oslo, Singapore, Stockholm, Sydney, Tokyo, Vienna, Zurich.
— https://hosthatch.com/features ("We operate out of 13 global locations"), homepage ("Deploy in 13 locations in 4 different continents"), and the 13 flag `aria-label`s on https://hosthatch.com/products.

**Storage (8):** Amsterdam, Chicago, Hong Kong, London, Los Angeles, New York, Singapore, Stockholm.
— the second flag row on https://hosthatch.com/products ("Available in 8 strategic locations").

**Docs matrix (14):** the same 13 plus **Seoul** (KINX Dogok). Seoul has a Compute VM check and no Storage VM check. https://docs.hosthatch.com/features/

**Status page monitors (13):** the same 13, no Seoul. https://status.hosthatch.com

**Stale prose still says 16:** the products page body says "Deploy in 16 edge locations", and the company page says "our own equipment in 16 data centers". The 13 flags and 13 status monitors are the operative facts; 16 is a copy-paste leftover.

What changed vs the 4 November note (`inferred` from comparing the baseline caveat with today's pages):
- **Madrid, Milan and Warsaw are gone** from every current page (product flags, features list, docs matrix, status). The baseline said they "appear in the site's product data but not in the docs matrix". They no longer appear in either. The simplest reading is that the product data carried three stale entries and has now been cleaned to the 13 real locations — not that three sites closed on 12 November.
- **Oslo, Vienna and Zurich remain listed** as first-class compute locations with datacenters and looking glasses: Oslo (Blix BDC), Vienna (Interxion MAD1 on the features page; Digital Realty VIE2 on the docs matrix), Zurich (Interxion ZUR1 / Digital Realty ZUR1). They are not new in this pass: Vienna was already named in the baseline `eu-region` capability figure, and all three were in the baseline docs matrix. Oslo and Zurich are non-EU; Vienna is EU.
- **Seoul is not a standard location.** It is absent from the 13 product flags, the features list, the homepage and the status page, but present in the docs matrix and in the April 2026 promotional plan list. Treat it as a promotional/legacy location, not one a standard order can pick.
- **Storage VMs are flagged in 8 locations**, not the 4 the baseline note listed. The 8 are Amsterdam, Chicago, Hong Kong, London, Los Angeles, New York, Singapore and Stockholm. This looks like the site data catching up with the "Available in 8 strategic locations" copy, not a new product.
- The features page's **Vienna datacenter row says "Interxion MAD1"** — MAD1 is Madrid's code; the docs matrix says Digital Realty VIE2. First-party copy error, not a location fact. Report both.

Quotes:
> "We operate out of 13 global locations, and all of them are hand picked after very thorough research." — https://hosthatch.com/features
> "Deploy in 13 locations in 4 different continents" — https://hosthatch.com/
> "Deploy in 16 edge locations" — https://hosthatch.com/products (stale prose)
> "We have our own equipment in 16 data centers around the world" — https://hosthatch.com/company (stale prose)
> "Amsterdam … Chicago … Hong Kong … London … Los Angeles … New York … Oslo … Singapore … Stockholm … Sydney … Tokyo … Vienna … Zurich" — https://hosthatch.com/features
> "| Seoul | … | 10 GbE | 100 GbE | ✓ | KINX Dogok |" — https://docs.hosthatch.com/features/

### The API exposes pooled transfer allowances, while the Terms still say per-server

The server object in the new API documents a **`pooled`** transfer allowance:

> `"bandwidth": { "pooled": true, "allocated_gb": 1000, "extra_gb": 0, "used_gb": 12, "pool": { "allocated_gb": 5000, "extra_gb": 0, "used_gb": 301 } }`
> "`pooled` servers share an allowance with your other servers in the location, and `pool` has its totals"
— https://docs.hosthatch.com/api/servers/

The example shows one server with 1,000 GB allocated inside a 5,000 GB location pool. For a `pooled: true` server, a single VM can in principle consume the whole pool before the 5 Mbps throttle — a material improvement over the baseline's "each plan includes 1–20 TB, when the allowance is used the server is rate-limited" reading. The docs do not say whether every server is pooled, so do not generalise this to all plans without checking the server object; the example is `docs-confirmed` for the shape, `inferred` for the effect.

But the Terms still describe a **per-server** limit:
> "If there is a bandwidth limit, it means that you are not allowed to use more bandwidth than the limit in one month. Your server will be rate-limited to 5 Mbps if you reach your bandwidth limit. Additional bandwidth can be added for $4 per TB by contacting our support. Bandwidth limit is reset on the 1st of every month, regardless of your service due date."
— https://hosthatch.com/terms-of-service

And the product page still lists 1 TB / 2 TB / 3 TB … per plan, with only a footnote that APAC limits are lower. **Preserve both**: the API is the newer product surface and documents pooling; the Terms and product page still describe a per-server ceiling. The site's `outbound-network` note should say "per-plan allowance, pooled across servers in the same location according to the API; the Terms still describe a per-server ceiling" rather than silently choosing one. Verdict stays `yes`.

APAC remains lower: the 2 GB plan's tooltip says **"500GB in Hong Kong, Tokyo, Sydney & Singapore"** (https://hosthatch.com/products). The April promotional post gives different APAC numbers for its plans (3 TB APAC / 1.5 TB Seoul on the 4 GB plan, etc.) — promotional plans are a separate tariff.

### Other product/API changes

- **API 1.0.0** is documented as a full REST API with Bearer keys, read-only keys, expiry, revocation on password change, projects, servers, actions, orders, snapshots, firewalls, ISOs, SSH keys, stable error codes, idempotency keys and per-key rate limits. New in the docs since the baseline note: an explicit **"For AI agents"** section ("An agent that changes things should send an `Idempotency-Key` with every action and order, poll actions instead of assuming they finished, act on the error `code` rather than on `detail`") and a `GET /me/`. No CLI, SDK, MCP or PTY/file endpoint — unchanged.
- **Server object is richer:** `pending_changes`, `boot_disk_gb`, `bandwidth.pooled`/`pool`, `has_user_data`, `billing.upgradeable_to`. Cancellation still runs to the end of the paid term.
- **Cloud-init user data is still not orderable.** The order field is documented as: "`user_data` … **Not available yet**: sending it answers `400 feature_unavailable`. Cloud-init user data, up to 65536 characters, starting with `#cloud-config` or `#!`." — https://docs.hosthatch.com/api/orders-and-payment/. IPv6 is auto-configured via cloud-init at creation, but user-supplied cloud-init is not accepted. Baseline caveat stands.
- **Firewalls are allowlist-only.** "Every rule allows traffic. Traffic that no rule allows is refused, so there are no deny rules." A server with no group allows all; once an egress group is attached, only listed destinations pass. Groups are additive. — https://docs.hosthatch.com/api/firewalls/. The `outbound-network/egress-allowlist` and `no-internet` verdicts stand; the note should say "allowlist, no deny rules".
- **Snapshots:** disk copy, restore replaces the whole disk, can order a new server from `snapshot_id`; limit is a **project-owner-wide** count across all projects, number unpublished; no price; `size_gb` is reported. — https://docs.hosthatch.com/api/snapshots/. No change to `snapshots-forks`.
- **Roles:** owner, admin, member only. No SSO, no audit log, no spend cap. — https://docs.hosthatch.com/api/projects-and-roles/. `teams-accounts` stands.
- **Backups and block storage still do not exist.** The features page still lists them (and snapshots and the API) under "Upcoming Features" with **2023** dates; the API changelog 1.0.0 lists no backup or volume endpoint. The features page remains years out of date; do not read it as a product list.
- **2FA:** not in the API docs. A LowEndTalk thread says "Hosthatch and Terrahost both run custom panels which fully support 2FA" (third-party, undated in the snippet). Baseline's "password-plus-2FA" claim is plausible but **not re-verified first-party**; keep it only as a third-party note or drop the 2FA detail.
- **AUP citation fix:** the crypto-mining and "any CPU, disk or network abusing software" prohibitions are now on the **Terms of Service → Prohibited Usage** section, not the Acceptable Use Policy page. The AUP page only says "A list of examples of prohibited content can be on our terms of service page." Quote (Terms): "All kinds of cryptocurrency mining (e.g Bitcoin/Ethereum mining, Chia plotting etc)" and "Any CPU, disk or network abusing software. … Exceptions can be made for plans with dedicated CPU if we are notified in advance." — https://hosthatch.com/terms-of-service. The baseline caveat attributes them to the AUP; fix the citation.
- **Terms: 30-day notice.** The Term clause reads "shall renew for the same successive terms until terminated by either Party upon the sooner of (i) **thirty (30) days prior written notice** to the other Party, or (ii) the expiration or termination of all Service(s)". Cancellation is not instant; the panel's `end_of_term` still runs the server to the end of the paid period. Add to the billing/lifecycle note.
- **Terms: unpaid invoice.** Suspended two days after due, terminated after five, data wiped. Chargeback/dispute suspends the whole account. Refund: 7-day money-back with a valid reason, used resources deducted, upgrades/setup/licensing non-refundable, other services non-refundable. All unchanged.
- **Status:** 13 network monitors, all Up. Overall **99.995%** over 90 days (was 99.994%); 24 h 99.997%, 7 days 100.000%, 30 days 99.989%. **New York 99.956%** over 90 days and **99.869%** over 30, the weakest; latest NY outage **35 seconds on 11 November**. Amsterdam 100%, Hong Kong 100%, Los Angeles 100%, Stockholm 100%, Sydney 100%, Vienna 100%, Zurich 100%; Chicago 99.995%, London 99.993%, Oslo 99.998%, Singapore 99.997%, Tokyo 99.996%. — https://status.hosthatch.com
- **Company:** "HostHatch LLC, 4830 West Kennedy Blvd, Tampa, FL 33609, United States" unchanged; support `support@hosthatch.com` 24×7×365, billing/sales/abuse addresses; ticket-only. Company page still says "own equipment in 16 data centers" and "tens of thousands of customers in over 100 countries". — https://hosthatch.com/contact, https://hosthatch.com/company
- **Trustpilot:** **2.7 from 93 reviews** unchanged. — https://www.trustpilot.com/review/hosthatch.com
- **BGP:** AS63473, ARIN, **86 IPv4 and 19 IPv6 prefixes originated** unchanged. — https://bgp.tools/as/63473
- **Founded:** VPSBenchmarks still says 2011, USA. — https://www.vpsbenchmarks.com/hosters/hosthatch
- **April 2026 promotional post** still live, with more detail than the baseline captured:
  - NVMe: 4 GB / 50 GB **$35/year or $95/3 years** (2 cores, 0.5 dedicated); 8 GB / 100 GB **$65/year or $170/3 years**; **16 GB / 200 GB $130/year or $350/3 years**; 3-year payments double RAM, storage and bandwidth.
  - Storage: 2 GB + 2 TB HDD **$130/3 years**; 4 GB + 5 TB HDD **$140/year or $400/3 years**.
  - **HFC plans** (new line in the post): 4 GB / 40 GB PCIe Gen5 **$65/year or $120/2 years**; 12 GB / 100 GB **$140/year or $270/2 years**, with 5.7 GHz boosted cores.
  - Locations in the post: London, Amsterdam, Chicago, Hong Kong, Los Angeles, New York, Singapore, Sydney, Tokyo, **Seoul** (no Oslo/Vienna/Zurich). Seoul therefore still has a promotional route even though it is not one of the 13 standard flags.
  - BGP **$10 setup per location**, no monthly; routed /64 IPv6 in all locations; 10 working days setup; all sales final, no refunds/credits; no location migrations; support "can take several days".
  - This is a **promotional tariff**, not the standard product; it is April 2026-dated and stock-limited. Report it as history, not as current standard pricing.

### HostHatch rows to change

| Row | Old | New | Why |
|---|---|---|---|
| provider `oneLiner` | "up to 16 locations" | "13 locations" | 13 flags/features/homepage/status; 16 is stale prose |
| provider `sizes` | "advertises 16 locations on its product and company pages, docs 14, status 13" | "13 on its product flags, features page, homepage and status page; stale prose and the company page still say 16; docs list 14 (adds Seoul)" | location cleanup |
| feature `sizes-regions` figure | "16 cores / 96 GB; 16 sites claimed" | "16 cores / 96 GB; 13 sites" | 13 current |
| feature `sizes-regions` note | "Ten compute plans … 16 locations" | 13 compute + 8 storage; name Oslo/Vienna/Zurich; note Seoul docs + April promo only, Madrid/Milan/Warsaw gone | location change |
| capability `sizes-regions/choose-region` | `yes`, "16 advertised locations" | `yes`, "13 advertised locations" | same |
| capability `sizes-regions/eu-region` | "Amsterdam, Stockholm, Vienna…" | unchanged verdict; note Oslo/Zurich are Europe but not EU | precision |
| feature `outbound-network` note | "Each plan includes 1–20 TB … When the allowance is used the server is rate-limited to 5 Mbps" | add "the API pools the allowance across servers in the same location (`pooled`, `pool`), while the Terms still describe a per-server limit"; add BGP $10 setup | pooling contradiction |
| capability `outbound-network/egress-included` | `yes`, "1–20 TB/mo" | `yes`, "1–20 TB/mo, pooled" | pooling |
| feature `storage` note | "storage plans … in only 4 locations in the site data (Amsterdam, Stockholm, Los Angeles, Chicago)" | **8 locations**: Amsterdam, Chicago, Hong Kong, London, Los Angeles, New York, Singapore, Stockholm | current flags |
| feature `billing-models` note | "checkout's longer-term prices are behind the login" | "the API catalogue returns per-cycle `prices` and `billing_cycles` to an authenticated key; the docs example (illustrative) shows annual = 10× monthly; the product page still publishes only the monthly figure" | API 1.0.0 |
| feature `billing-models` promo note | 4 GB $35/yr, 8 GB $65/yr | add 16 GB $130/yr, HFC plans, Seoul, 3-year doubling, BGP $10 | April post detail |
| feature `teams-accounts` note | "password-plus-2FA sign-in" | "password sign-in (2FA reported by third parties; not documented first-party)" or drop 2FA | no first-party evidence |
| feature `company` facts | "16 data centres"; "99.994%" | "13 current compute locations (16 claimed on the company page)"; "99.995%" | current pages |
| provider `caveats` "number of locations" | 16/16/14/13, Madrid/Milan/Warsaw in product data | 13/16/14/13; Madrid/Milan/Warsaw **gone**; Oslo/Vienna/Zurich **listed**; Seoul docs + April promo only | rewrite |
| provider `caveats` price cycle | "checkout's price for each cycle is behind the login" | API exposes per-cycle prices to a key; the product page still shows only monthly; docs example annual = 10× monthly | soften |
| provider `caveats` fair-share | "acceptable-use policy bans …" | "**Terms of Service** bans …" | citation fix |
| provider `fits.well` | "20 TB of transfer on the $69 compute plan" | "20 TB pooled with your other servers in the same location" | pooling |
| provider `strengths` | "1–20 TB of monthly transfer included" | "1–20 TB pooled per location" | pooling |
| pricing `egress.included` | "per month, inbound and outbound counted together; APAC allowances are lower" | add "pooled across the account's servers in the same location per the API; the Terms still say per server"; APAC 500 GB on the 2 GB plan | pooling |
| pricing `checkedOn` / provider `checkedOn` | 2026-11-04 | 2026-11-12 | pages reread |
| pricing notes: locations | "Storage VMs … advertised in 8 locations but listed in only 4" | "8 storage locations: AMS, CHI, HKG, LON, LAX, NYC, SGP, STO" | current |
| pricing notes: BGP | not mentioned | "$10 one-time setup per location, no monthly fee" | promo post |
| pricing notes: cloud-init | "documented but answers feature_unavailable" | still true; quote the order-field wording | recheck |
| provider `oneLiner` / `sizes` | "up to 16 locations"; "16 on product and company pages" | "13 locations"; "13 on the product flags, features page, homepage and status page; stale prose and the company page say 16; docs list 14 (adds Seoul)" | cleanup |
| provider `company` "Own hardware and network" | "Own equipment in 16 data centres" | "Own equipment in 13 current compute locations (the company page still says 16)" | current pages |
| provider `company` "Public status" | "99.994% over 90 days on 2026-11-04, New York down 31 minutes…" | "**99.995%** over 90 days on 2026-11-12; New York **99.956%** (99.869% over 30 days) with a **35-second** outage on 11 November; 13 network monitors" | status page |
| provider `caveats` "number of locations" | "16/16/14/13; Madrid, Milan and Warsaw in product data; Seoul docs-only" | "**13** product flags / **16** stale prose and company page / **14** docs matrix / **13** status monitors; Madrid, Milan and Warsaw **no longer appear anywhere**; Oslo, Vienna and Zurich listed; Seoul docs + April promo only" | current |
| provider `caveats` "price cycle" | "checkout's price for each cycle is behind the login" | "the API catalogue returns `prices` per cycle and `billing_cycles` to an authenticated key; the docs example (illustrative) shows annual = 10× monthly; the product page still shows only monthly" | API 1.0.0 |
| provider `caveats` "fair-share CPU" | "the acceptable-use policy bans …" | "the **Terms of Service** bans …" | citation |
| provider `fits.well` / `strengths` | "20 TB of transfer"; "1–20 TB of monthly transfer included" | "1–20 TB, **pooled across your servers in the same location** (API); the Terms still say per server" | pooling |
| provider `strengths` | "Presence in Europe, North America and Asia-Pacific" | still true; 13 locations in 4 continents, 3 EU (Amsterdam, Stockholm, Vienna) | locations |
| provider `usability.tripsUp` | "The product page says 'dedicated CPU allocations', but the 2, 4 and 8 GB plans are labelled 'fair share' and only the 12 GB plan and above include a dedicated core." | still true; add the exact split (12 GB = 1 dedicated of 4; 96 GB = 8 of 16) and that Seoul is a promo-only location | product table |
| provider `caveats` "The features page is years out of date" | "still presents snapshots, backups, block storage and a user API as 'Upcoming Features' with 2023 dates" | still true; the page now also lists 13 datacenters, so only the "Upcoming Features" block is stale | recheck |

### HostHatch exact fact replacements

- `company.facts["Own hardware and network"].value`: **"Own equipment in 13 current compute locations (the company page still says 16), with its own ARIN-allocated network AS63473."** Keep the quote "We have our own equipment in 16 data centers around the world" and add the 13-page quote "We operate out of 13 global locations" from https://hosthatch.com/features. `inferred` that 13 is current.
- `company.facts["Public status"].value`: **"A public status page (UptimeRobot) showed 99.995% overall over the last 90 days on 2026-11-12, across 13 network monitors. New York is the weakest at 99.956% (99.869% over 30 days) and was down for 35 seconds on 11 November; Amsterdam, Hong Kong, Los Angeles, Stockholm, Sydney, Vienna and Zurich showed 100%."** Quote "99.995%". `docs-confirmed`.
- `company.facts["Support"].value`: unchanged ("Tickets in the client area … no phone or live chat"). The contact page also lists `support@hosthatch.com` 24×7×365, `billing@`, `sales@`, `abuse@`; add those if the field has room.
- `company.facts["Public rating"].value`: **"Trustpilot showed a 2.7 average from 93 reviews on 2026-11-12, a small and self-selected sample."** Quote "93 reviews" / "2.7". `third-party`.
- `company.facts["Founded"].value`: unchanged; the company page's "12 years" is stale (2011 → 15 years in 2026), and the April post says "15 years in business". Keep 2011 with the VPSBenchmarks tag and note the company page's "12 years" is stale.
- `company.facts["Network registration"].value`: unchanged; BGP.tools still shows **86 IPv4, 19 IPv6** prefixes originated, ARIN. `third-party`.

### HostHatch provider prose that still says the old thing

- `oneLiner`: "up to 16 locations" → "13 locations".
- `whatItIs[0]`: "ten fixed plans … $4–$69" — true; add "in 13 compute locations, with storage VMs in 8".
- `whatItIs[3]`: "The surprise is the control surface … There is no official CLI, SDK or MCP server, and cloud-init user data is not available yet." — still true; add "the API now has a 'For AI agents' section and exposes per-cycle prices".
- `sizes`: rewrite the location sentence (see table).
- `isolation`: "The cheapest three plans (2, 4 and 8 GB) are labelled 'fair share' CPU, and the 12 GB plan and above mix dedicated and fair-shared cores" — still true; add the exact split if useful (12 GB = 1 dedicated of 4; 96 GB = 8 of 16).
- `whoFor`: "in Europe, North America or Asia" → **"in Europe, North America, Asia or Australia"** (Sydney is Oceania; 13 locations, 3 EU).
- `fits.well`: "a 10 TB storage VM for $38 a month, or 20 TB of transfer on the $69 compute plan" — true; add "transfer pooled with your other servers in the same location".
- `fits.well`: "Presence in Europe, North America and Asia-Pacific" — true.
- `usability.dashboard`: add "13 compute locations and 8 storage locations; Seoul is promotional only".
- `usability.tripsUp`: update the dedicated-core sentence with the exact split; update the bandwidth sentence for pooling; update "acceptable-use policy" → "Terms of Service"; add "cancellation requires 30 days' prior written notice".
- `strengths`: "1–20 TB of monthly transfer included, with extra at $4 per TB" → "1–20 TB pooled per location, with extra at $4 per TB"; add "13 locations, 3 in the EU"; add "a documented 'For AI agents' API section".
- `caveats`: rewrite the location and price-cycle items; add bandwidth pooling; add 2FA not documented; add Seoul promo-only; add Vienna datacenter-code error.
- `company.facts["Own hardware and network"]`: 16 → 13 (note the company page still says 16).
- `company.facts["Public status"]`: 99.994% → 99.995%, date 2026-11-12, NY 99.956% / 99.869% 30-day, 35 s outage 11 Nov, 13 monitors.
- `sources`: add docs API pages, status, features, products, homepage, company, terms, AUP, privacy, Trustpilot, BGP, VPSBenchmarks, LowEndTalk.

**Bottom line for HostHatch:** **no price moved** — $4–$69 compute and $5–$38 storage are identical. What did move is the location story: the product flags now agree with the features page, homepage and status page on **13 compute locations**, after the stale Madrid/Milan/Warsaw entries disappeared (Seoul survives only in the docs matrix and the April promotional tariff); **storage VMs are flagged in 8** of the 13, not 4; and the API documents **pooled** transfer allowances even though the Terms still describe a per-server cap. The "16 locations" prose and the "4 storage locations" note are stale.

---

## 5. Integration notes for the parent

### `site/src/data/pricing/*.json` — exact edits

**contabo.json**
- `checkedOn`: `2026-10-30` → `2026-11-12`.
- `summary`: append "A one-time €2.00 setup fee applies to new Cloud VPS 4 instances on the 1-month term; the 3-, 6-, 12- and 24-month terms are fee-free."
- `notes`: replace the "No setup fee was shown for any term…" note with the 1-month-only €2.00 fee; add the GPU VPS price/spec/limits note; update the add-on note with the current configurator prices (unchanged except the new fee); update the "GPU VPS … waitlist" note to "orderable at $1,199/month, $959.20 on 24 months".
- `sources`: add `https://contabo.com/en-us/gpu-vps`, `https://contabo.com/en-us/vps/cloud-vps-core-4`, `https://docs.contabo.com/docs/servers-hosting/gpu-vps/`, `https://docs.contabo.com/docs/servers-hosting/max-performance-vps/`, `https://contabo-status.com/`.
- `shapes`: unchanged.

**digitalocean.json**
- `checkedOn`: `2026-10-30` → `2026-11-12`.
- `shapes`: unchanged (verify all 31 against the fresh table).
- `notes`: add the no-change statement; High Performance volumes private preview (free); regional snapshot copies billed from 1 Jan 2027; Private Droplets no public IPv4 at no extra cost; Agent Droplets/Managed Agents rates unchanged; GPU Droplets cannot be resized; Omarchy minimum 2 vCPU / 4 GB / 80 GB and the $24 Basic shape meets it.
- `sources`: add `https://docs.digitalocean.com/products/marketplace/catalog/omarchy/`, `https://marketplace.digitalocean.com/apps/codex-universal`, `https://marketplace.digitalocean.com/apps/opencode`, `https://docs.digitalocean.com/products/droplets/details/private-droplets/`, `https://docs.digitalocean.com/products/volumes/details/pricing/`, `https://docs.digitalocean.com/products/snapshots/details/pricing/`, `https://docs.digitalocean.com/products/backups/details/pricing/`, `https://docs.digitalocean.com/platform/teams/`, `https://docs.digitalocean.com/platform/regional-availability/`.
- `shapes`: if the parent wants to model Omarchy, no new shape is needed; the Basic 2 vCPU / 4 GiB / 80 GiB is already `$24`.
- `billedWhileStopped`, `minimumPerRun`, `between`, `egress`: unchanged.

**hetzner.json**
- `checkedOn`: `2026-10-29` → `2026-11-12`.
- `shapes`: choose **NBG/FSN unchanged** (least churn) or **HEL1** (page "from") — table above. Do not mix. Add `locationBasis: "NBG1/FSN1"` or `"HEL1"` if the schema permits; otherwise put it in the summary/notes.
- `summary`: name the tier; e.g. "A fixed-size server billed by the hour but never more than its monthly price, from creation until deletion; a powered-off server costs the same as a running one. Prices are the Falkenstein/Nuremberg tier; Helsinki is ~15% cheaper."
- `notes`:
  - Replace the "These are Hetzner's own USD prices for the EU network zone (Falkenstein, Nuremberg, Helsinki)…" note with the two-tier explanation.
  - Replace the "Hetzner no longer publishes the snapshot rate…" note with **€0.0143 / $0.0199 per GB-month** (compressed, pro rata), backups **20% with a €1.0980 minimum**, volumes **€0.044 / $0.0484 per GB-month** (10 GB–10 TB, 16 per server), Floating IPs **€1.00/month**.
  - Keep the IPv4, hourly rounding, powered-off and 624-hour notes; adjust the 624-hour example to the chosen tier.
  - Cost-Optimized note: rechecked **12 November 2026**, still all "not available"; "about three to four times" → "about 2.75–3.25× at the Helsinki tier".
  - Add the **26 June 2026 "Limited availability of cloud instances"** notice and its consequences.
- `sources`: add `https://status.hetzner.com/incident/0a75c7ae-3377-41dc-aabe-601063724d24`, `https://docs.hetzner.com/cloud/general/faq/`, `https://www.hetzner.com/cloud/load-balancer/`, `https://docs.hetzner.com/general/company-and-policy/experiments/experiments-platform/`, `https://docs.hetzner.com/general/company-and-policy/experiments/inference/`, `https://website-price-api.hetzner.com/api/v1/products/CLOUD_24`, `https://website-price-api.hetzner.com/api/v1/products/CLOUD_21`, `https://website-price-api.hetzner.com/api/v1/products/CLOUD_66`.
- `perMachine`, `billedWhileStopped`, `wholeHours`, `between`, `egress`: unchanged.

**hosthatch.json**
- `checkedOn`: `2026-11-04` → `2026-11-12`.
- `shapes`: unchanged.
- `summary`: add "13 compute locations, 8 storage locations".
- `egress.included`: add "the API pools the allowance across the account's servers in the same location; the Terms still describe a per-server limit".
- `egress.note`: add pooling; keep $4/TB, 5 Mbps, APAC 500 GB.
- `plans[0].note`: add "the API catalogue returns `prices` per billing cycle to an authenticated key; the docs example is illustrative".
- `notes`: update locations (13/8/Seoul/Madrid-Milan-Warsaw), bandwidth pooling, BGP $10, 2FA, 30-day notice, API 1.0.0 "For AI agents", per-cycle prices, 16 GB/HFC promo lines, storage 8 locations.
- `sources`: add `https://hosthatch.com/features`, `https://hosthatch.com/company`, `https://status.hosthatch.com`, `https://docs.hosthatch.com/features/`, `https://docs.hosthatch.com/api/servers/`, `https://docs.hosthatch.com/api/orders-and-payment/`, `https://docs.hosthatch.com/api/snapshots/`, `https://docs.hosthatch.com/api/firewalls/`, `https://docs.hosthatch.com/api/projects-and-roles/`, `https://docs.hosthatch.com/api/authentication/`, `https://bgp.tools/as/63473`, `https://www.trustpilot.com/review/hosthatch.com`, `https://www.vpsbenchmarks.com/hosters/hosthatch`, `https://lowendtalk.com/discussion/216524/calmly-celebrating-15-years-in-business`.

### `site/src/data/providers/*.json` — exact edits

- **contabo.json**: `checkedOn` 2026-11-12; `billing.planFee`/`minimum` setup fee; `fits.badly` GPU sentence; `whatItIs`/`isolation` Max Performance VPS rename; `fits.well` GPU; `usability.tripsUp` setup fee; `company.facts` customers/servers/recent incidents; `caveats` GPU fixed config + setup fee; `sources` add GPU/Max Performance/status. See the Contabo exact prose block.
- **digitalocean.json**: `checkedOn` 2026-11-12; `oneLiner`/`whatItIs`/`whoFor`/`fits`/`usability`/`strengths`/`caveats`/`company.facts["Recent incidents"]`/`sources` per the DO blocks. No price change.
- **hetzner.json**: `checkedOn` 2026-11-12; `sizes` location tier; `fits`/`strengths` prices per chosen tier; `usability.tripsUp` tier + availability + snapshot/backup rates; `caveats` location tier, availability notice, snapshot rate, Cost-Optimized recheck date; `company.facts["Recent incidents"]` exact replacement; `sources` add status/FAQ/load-balancer/experiments.
- **hosthatch.json**: `checkedOn` 2026-11-12; `oneLiner`/`whatItIs`/`sizes`/`whoFor`/`fits`/`usability`/`strengths`/`caveats`/`company.facts`/`sources` per the HostHatch blocks.

### `site/src/data/features/*.json` — exact rows

| Provider | Feature | Change |
|---|---|---|
| contabo | `billing-models` | figure `$6.60/mo, monthly only` → `$6.60/mo + $2.40 setup`; note add the 1-month setup fee and the 3/6/12/24 fee-free terms |
| contabo | `trials-free-tiers` | note add the €2.00/$2.40 setup fee to the first invoice |
| contabo | `sizes-regions` | note: GPU VPS orderable at $1,199/mo ($959.20 24-month), 18 vCPU / 96 GB / 900 GB NVMe, EU + US Central, Ubuntu 24.04 CUDA, no API/CLI; remove "waitlist"; add Max Performance VPS rename |
| contabo | `company` | note: 275k vs 300k customers; 575k servers; 11 locations / 9 regions; no SOC 2 offer |
| digitalocean | `built-in-agents` | figure `OpenClaw/Hermes 1-Click` → `OpenClaw/Hermes/OpenCode 1-Click`; note add Codex Universal, OpenCode, QM, Omarchy desktop; scenario update; remove "no graphical desktop" |
| digitalocean | `sizes-regions` | note add "GPU Droplets cannot be resized"; add Omarchy 2 vCPU/4 GB/80 GB minimum; unchanged verdict |
| digitalocean | `storage` | note add High Performance volumes private preview (free); unchanged verdict |
| digitalocean | `snapshots-forks` | note add regional snapshot copies billed from 1 Jan 2027; unchanged verdict |
| digitalocean | `reaching-it` | note add Private Droplets (no public IPv4, VPC-only, no extra cost); unchanged verdict |
| digitalocean | `teams-accounts` | note Entra ID SSO guidance 2 Nov 2026, `team_role` claim optional; unchanged verdict |
| digitalocean | `company` | recent incidents value 6 Aug–27 Oct, 15 incidents, none since 27 Oct; unchanged verdict |
| hetzner | `billing-models` | note add the HEL1 vs NBG/FSN tier; unchanged verdict |
| hetzner | `trials-free-tiers` | scenario cheapest CPX02 €4.99/$5.99 + €0.50/$0.60 IPv4 in Helsinki (€6.49/$8.09 in Nuremberg); add availability restriction; unchanged verdict |
| hetzner | `sizes-regions` | note add the two EU price tiers; unchanged verdict |
| hetzner | `snapshots-forks` | note add €0.0143/$0.0199 per GB-month compressed, pro rata; backups 20%, €1.0980 minimum; unchanged verdict |
| hetzner | `storage` | note add the volume/snapshot prices and the 16-volume limit; unchanged verdict |
| hetzner | `company` | recent incidents exact replacement; unchanged verdict |
| hosthatch | `sizes-regions` | figure `16 sites claimed` → `13 sites`; note rewrite locations (13 compute, 8 storage, Seoul promo/docs, Madrid/Milan/Warsaw gone, Vienna code error) |
| hosthatch | `outbound-network` | figure unchanged; note add pooling (`pooled`/`pool`), BGP $10 setup, APAC 500 GB |
| hosthatch | `storage` | note 8 storage locations, not 4; unchanged verdict |
| hosthatch | `billing-models` | note per-cycle API prices, 30-day notice, 16 GB/HFC promo; unchanged verdict |
| hosthatch | `company` | note 13 current locations vs 16 claimed; status 99.995%; Trustpilot 2.7/93; unchanged verdict |
| hosthatch | `reaching-it` | note BYOIP BGP $10 setup; unchanged verdict |
| hosthatch | `ways-to-drive` | note "For AI agents" section, `GET /me/`, per-cycle catalogue; unchanged verdict |
| hosthatch | `teams-accounts` | note 2FA third-party only; unchanged verdict |
| hosthatch | `snapshots-forks` | note snapshot limit across all projects, no price; unchanged verdict |
| hosthatch | `trials-free-tiers` | note 7-day refund unchanged; payment methods not published |

### `site/src/data/capabilities.json` — exact rows

| Provider | Capability | Change |
|---|---|---|
| contabo | `sizes-regions/gpu` | `partly`, "RTX 6000 PRO; waitlist" → **`yes`, "RTX PRO 6000; $1,199/mo"**; remove/rewrite the shortfall (single fixed config, two regions, no customisation) |
| contabo | `billing-models/flat-price` | figure `$6.60/mo` → `$6.60/mo + $2.40 setup` |
| digitalocean | `built-in-agents/desktop` | `no`, "none" → **`yes`, "Omarchy RDP desktop"** (or `partly` + 2 vCPU/4 GB/80 GB/RDP shortfall) |
| digitalocean | `built-in-agents/agents-preinstalled` | figure `OpenClaw/Hermes images` → `OpenClaw/Hermes/OpenCode`; shortfall add Codex Universal is an env, default Ubuntu has none |
| digitalocean | `built-in-agents/browser` | figure `chromium in sessions` → `Chromium in Omarchy/sessions`; shortfall add "only the Omarchy image or Harness sessions" |
| digitalocean | `reaching-it/public-url` | figure "public IPv4 per Droplet" → "public IPv4 by default; Private Droplets none" |
| hetzner | `snapshots-forks/older-snapshot` | figure "Up to 30, any age" unchanged; add the €0.0143/$0.0199 per GB-month rate to the note if the schema allows |
| hosthatch | `sizes-regions/choose-region` | figure "16 advertised locations" → **"13 advertised locations"** |
| hosthatch | `sizes-regions/eu-region` | figure "Amsterdam, Stockholm, Vienna…" unchanged; note Oslo/Zurich are non-EU |
| hosthatch | `outbound-network/egress-included` | figure "1–20 TB/mo" → **"1–20 TB/mo, pooled"**; shortfall/note add the Terms still say per-server |
| hosthatch | `snapshots-forks/older-snapshot` | figure "Kept until deleted" unchanged; note the limit is across all the owner's projects |

### `site/src/data/usecases.json` — routes/picks affected

| Use case | Provider | Current | Suggested |
|---|---|---|---|
| `coding-agent` | digitalocean | `manual`, "Install Claude Code or Codex on a Droplet yourself; the default images have no coding agent." | mention the **OpenCode** and **Codex Universal** 1-Click images; keep `manual` if the reader still needs SSH, or move to `preinstalled` with a note that OpenCode is pre-configured for DO Serverless Inference and Codex Universal is an environment, not the Codex CLI |
| `browser-agent` | digitalocean | `backend`, "Harness Runtime sessions include chromium … but there is no desktop…" | add "the **Omarchy** 1-Click image gives a full Hyprland desktop with Chromium over RDP" — the `backend` tier can stay for the managed browser tool, but the "no desktop" sentence is now false |
| `browser-agent` | hetzner | `manual`, "No browser or desktop image… CPX22 $0.0368 an hour…" | keep `manual`; update the price to the chosen tier ($0.0312/h HEL1, $0.0368/h NBG/FSN) and note the 26 June availability restriction |
| `browser-agent` | contabo | `manual`, "$6.60/mo (Cloud VPS 4, 1-month term)" | add the $2.40 one-time setup fee; note the GPU VPS is not needed for a browser |
| `workflow-automation` | hetzner | pick "$23.59 a month" (CPX22 + IPv4, NBG) | if HEL: **$20.09**; if NBG: keep and say Nuremberg |
| `chat-bot` | hetzner | pick "$14.09 a month" (CPX12 + IPv4, NBG) | if HEL: **$11.59**; if NBG: keep and say Nuremberg |
| `hermes-agent` / `openclaw` / `workflow-automation` | contabo | one-click | add the $2.40 setup fee to the price/notes |
| `mcp-server` | digitalocean | "$6 a month buys a 1 vCPU / 1 GiB Droplet…" | unchanged |
| `situations.json` Hetzner EU | hetzner | "The US and Singapore locations are outside the EU and are priced differently." | add "Helsinki is ~15% cheaper than Falkenstein/Nuremberg" |

### `site/src/data/changes.json` — candidates

- **Contabo** (2026-11-12): "Contabo's 1-month Cloud VPS 4 now carries a €2.00 setup fee; the GPU VPS is orderable at $1,199/month." Sources: `https://contabo.com/en-us/vps/cloud-vps-core-4` quote "€2.00 Setup fee" / "No Setup Fee" for 3 months, `pricing-page`; `https://contabo.com/en-us/gpu-vps` quote "$1,199.00 … $959.20 for the first 24 months", `pricing-page`.
- **DigitalOcean** (2026-11-12): "DigitalOcean now sells a full Omarchy Hyprland desktop on a Droplet, reachable over RDP, and lists Codex Universal and OpenCode 1-Click images." Sources: `https://docs.digitalocean.com/products/marketplace/catalog/omarchy/` quote "This 1-Click runs the full Omarchy desktop natively on your droplet, viewable from your browser", `docs-confirmed`; `https://marketplace.digitalocean.com/apps/opencode` quote "Deploy OpenCode, an open-source AI coding agent that runs in your terminal", `docs-confirmed`.
- **Hetzner** (2026-11-12): "Hetzner's Helsinki CPX tier is now ~15% cheaper than Falkenstein/Nuremberg, and snapshots have a published €0.0143/$0.0199 per GB-month rate." Sources: `https://www.hetzner.com/cloud/regular-performance/` quote "CPX22 … from /month € 16.99 … NBG1 … € 19.99", `pricing-page`; `https://website-price-api.hetzner.com/api/v1/products/CLOUD_24` quote `"EUR":"0.014300","USD":"0.019900"`, `pricing-page`.
- **HostHatch** (2026-11-12): correction — "HostHatch lists 13 compute locations, not 16; Madrid, Milan and Warsaw are no longer listed and Seoul is promotional/docs-only." Sources: `https://hosthatch.com/features` quote "We operate out of 13 global locations", `docs-confirmed`; `https://hosthatch.com/products` quote "Deploy in 16 edge locations" (the stale prose being corrected), `docs-confirmed`. This is a guide correction, not a provider change; phrase it as "Correction: the current pages list 13, not 16".

### `site/scripts/price-baseline.json` — candidates

New money-bearing URLs to add:
- `https://contabo.com/en-us/gpu-vps` ($1,199 / $959.20)
- `https://contabo.com/en-us/vps/cloud-vps-core-4` (€2.00 setup)
- `https://www.hetzner.com/cloud/regular-performance/` (already? check; the HEL/NBG prices)
- `https://website-price-api.hetzner.com/api/v1/products/CLOUD_24` (€0.0143/$0.0199)
- `https://website-price-api.hetzner.com/api/v1/products/CLOUD_21` (€0.50/$0.60)
- `https://website-price-api.hetzner.com/api/v1/products/CLOUD_66` (€1.00/$1.20, €7.40/$8.30)
- `https://www.hetzner.com/cloud/block-storage/` (€0.044/$0.0484)
- `https://www.hetzner.com/cloud/load-balancer/` (€7.49)
- `https://www.digitalocean.com/pricing/agent-droplets` ($50/$200)
- `https://www.digitalocean.com/pricing/gpu-droplets` ($4.41/$0.76)
- `https://docs.digitalocean.com/products/volumes/details/pricing/` ($0.10)
- `https://docs.digitalocean.com/products/snapshots/details/pricing/` ($0.06)
- `https://docs.digitalocean.com/products/backups/details/pricing/` (20%/30%)
- `https://hosthatch.com/products` (already)
- `https://docs.hosthatch.com/api/orders-and-payment/` (illustrative prices; may be noisy — consider NO PRICES disposition)

Run `npm run check-rates` from `site/`, read `NEW`/`OLD`/`FAILED`/`NO PRICES`, then `--update` only after reconciling.

### `site/src/lib/cost.test.ts` — candidates

- **Contabo**: add the €2.00/$2.40 one-time setup fee to A/B/C expectations for the 1-month term; keep the 3-month and 24-month cases fee-free. Verify the engine has a one-time-fee field; if not, this is a model limitation (report it, don't invent a zero).
- **Hetzner**: if the card switches to HEL1, update A/B/C expectations to $6.59 / $36.09 / $20.09 (including IPv4) and keep an NBG case at $8.09 / $42.59 / $23.59. The 624-hour cap boundary is unchanged. If the card stays NBG, add a HEL1 boundary test to prove the engine uses the card's shape price and not the page's "from" price.
- **HostHatch**: no price change; add a test for the 13-location catalogue only if the engine exposes locations (it likely doesn't). The bandwidth pooling is not modelled; note the limitation.
- **DigitalOcean**: no price change; add no test for Omarchy unless the engine models desktops (it doesn't). The `desktop` verdict is a content row, not a cost input.

### `site/src/pages/compare/side-by-side.astro`

All four already have `"kind": "vps"` and VPS labels. No `kinds` map change. Check the static counts and the "16 researched providers" prose if the parent adds a provider (it isn't).

### `README.md` / `site/README.md` / `site/src/data/site.json`

No provider count change (16). If the site's prose says "VPS providers ... 16 locations" or "DigitalOcean has no desktop", search and update. The blanket checked date should not advance for one provider.

### Research ledgers

- `research/contabo.md`: add a 2026-11-12 section for the setup fee, GPU orderability, Max Performance VPS rename, customer/server contradiction, 8 roles, 1-click Dokploy.
- `research/digitalocean.md`: add the 2026-11-12 section for Omarchy, Codex Universal, OpenCode, Private Droplets, HP volumes, Entra ID, regional snapshots, 15 incidents, GPU resize limit.
- `research/hetzner.md`: add the 2026-11-12 section for the HEL1/NBG tier, snapshot/backup/volume rates, availability notice, Experiments Inference API/OpenClaw, status incidents, MCP absence, no 30-snapshot doc change.
- `research/hosthatch.md`: add the 2026-11-12 section for 13 locations, 8 storage, Seoul promo-only, Vienna code error, bandwidth pooling, BGP $10, API 1.0.0, 30-day notice, AUP→Terms citation, 2FA third-party, status 99.995%, Trustpilot 93.
- `research/rates/*.json`: update the matching rate artifacts if the parent keeps them in sync (the task says don't edit repo data files; this is for the integration pass).

### Verification commands

From `site/`:

```sh
npm run build
npm test
npm run check-rates
```

Then the read-only structural audit from the checklist. For UI/data presentation changes, render the provider page, comparison, capability matrix and the affected use cases at desktop and narrow mobile; inspect screenshots. No UI change is proposed in this research note, so the visual check is for the parent's integration.

### What I could not verify

- **Contabo USD setup fee**: the configurator is EUR-only even on `/en-us/`; $2.40 is the established 1.2× mapping, not a printed USD figure. `inferred`.
- **Contabo 1-month term availability**: the configurator shows it, but the USD page's "from $5.28" is the 24-month rate. The $6.60 1-month rate is on the VPS page's plan cards, not the pricing page. `pricing-page` for the card, `inferred` for the USD setup fee.
- **Hetzner Helsinki availability**: the page's Create CTA points at `location=hel1` and carries a hidden "currently unavailable" tooltip; the visible "not available" badge is only on Cost-Optimized. The docs FAQ says per-location restrictions are temporary and random. I could not confirm whether a given reader can order HEL1 today without an account. `inferred`.
- **Hetzner US comparison**: the price API lists ASH1/HIL1 for CLOUD_140–146 at the Helsinki level, but the page's US table uses CPX11–CPX51 with different specs. I did not reconcile the two lineups. `inferred`/unresolved.
- **Hetzner snapshot unit**: the page label says "per GB per month"; the API field is named `hourly`. The €0.0143 figure is the monthly per-GB rate; the hourly equivalent is €0.0143/730 ≈ €0.0000196. `inferred` from the label.
- **DigitalOcean Omarchy access**: the docs say "viewable from your browser" and "Remote desktop at `<droplet-ip>:3389` … any standard RDP client … No browser plugin, no VNC". A browser can open an RDP client, but the exact browser path is not documented. The desktop is RDP; that is enough for the verdict. `docs-confirmed` for RDP, `inferred` for "browser".
- **DigitalOcean Omarchy availability by region**: the marketplace page does not list regions; the API example uses NYC3. I did not verify all 16. `not-published`.
- **DigitalOcean Codex Universal**: it is the `codex-universal` dev container, not the Codex CLI agent. `agents-preinstalled` stays `partly`. `docs-confirmed`.
- **HostHatch Seoul**: docs matrix + April promo only; not on the 13 flags, features, homepage or status. Whether a standard order can pick Seoul is not public. `inferred`.
- **HostHatch bandwidth pooling**: the API example is `pooled: true`; the docs do not say whether every server is pooled or how the pool is sized. The Terms still say per-server. `docs-confirmed` for the field, `inferred` for the effect.
- **HostHatch 2FA**: third-party LowEndTalk post only; no first-party doc. `third-party`.
- **HostHatch Vienna datacenter**: features page says Interxion MAD1 (Madrid code), docs says Digital Realty VIE2. One is wrong; the city is listed in both. `contradiction`.
- **HostHatch price cycle**: the API docs example is illustrative; the actual per-plan quarterly/annual values need a key. The product page still shows only monthly. `inferred` that longer cycles are discounted (the example shows 10× annual).
- **Contabo GPU availability**: the page has a working configurator link and a 12-month order summary; I did not complete an order. `docs-confirmed`/`pricing-page`, not measured.
- **All providers**: no account, no server, no billable resource. Documentation claims are not measured performance. `desk research`.

# VPS group 2 — recheck notes (hostinger, hostup, lightsail, linode)

Baseline: `origin/main` @ `4432d00`, provider data as at `checkedOn: 2026-10-30`.
Recheck date: **2026-11-12** (Asia/Kolkata). Desk research only: no accounts, no credentials, no billable resources, no repo edits.

Retrieval routes that actually worked:

- **Context MCP `web_scrape`** with `formats.markdown`, `maxAgeMs: 0`, `responseMode: "full"` — primary route for rendered/JS pages (Hostinger support + docs, HostUp, AWS, Akamai). Cache metadata came back `{"status":"miss","age_ms":0}` on the pages where it was inspected, i.e. fresh fetch, not a cached hit.
- **`curl`** from the shell — provider-owned HTML/JSON APIs (Hostinger cart catalog, AWS price-list JSON, Linode API).
- **TinyFish `search`** — discovery only (finding article URLs); **not** used as evidence for a rate.
- Amp native `web_search` / `read_web_page` — **not used** in this pass.

---

## 1. hostinger — no rate change, no verdict change

### Rate card (`site/src/data/pricing/hostinger.json`)

Read from Hostinger's own live cart catalog (the same source the 2026-10-30 card used), freshly fetched with curl on 2026-11-12. Prices are USD cents; `price` = renewal for the term, `base_price` = non-sale list, `first_period_price` = introductory first term.

| Plan | Term | Catalog `price` | Card | 2026-10-30 |
|---|---|---|---|---|
| KVM 1 | 1 m | 1949 ($19.49) | 19.49 | same |
| KVM 2 | 1 m | 2449 ($24.49) | 24.49 | same |
| KVM 4 | 1 m | 4299 ($42.99) | 42.99 | same |
| KVM 8 | 1 m | 7399 ($73.99) | 73.99 | same |

Introductory / other-term figures are unchanged too:

- 1-month first period: $9.99 / $13.99 / $25.99 / $50.99 (catalog `first_period_price` 999/1399/2599/5099).
- 12-month: renewal $12.99 / $16.99 / $30.99 / $53.99 (`price` 15588/20388/37188/64788 ÷ 12); list $19.49/$24.49/$42.99/$73.99 (`base_price` 23388/29388/51588/88788 ÷ 12); intro $6.99/$9.99/$14.99/$28.49 (`first_period_price` 8388/11988/17988/34188 ÷ 12).
- 24-month: renewal $11.99/$14.99/$28.99/$49.99 (`price` 28776/35976/69576/119976 ÷ 24); intro $6.49/$8.79/$12.99/$25.99 (15576/21096/31176/62376 ÷ 24).

Quotes (VPS page, fresh 2026-11-12): "Today you pay $155.76 for 24 months. Renews at $11.99/mo for the same term." · "From ~$19.49~$6.49/mo" · "All plans are paid upfront. The monthly rate reflects the total plan price divided by the number of months in your plan."

**Still on sale.** The page banner reads "Biggest deals of the year … Black Friday up to 70% off" and the FAQ still answers the price question with the introductory band: "Our KVM VPS hosting plans range from **$6.49–$25.99/month**". That keeps the existing caveat valid: the advertised range is the 24-month introductory price, the 1-month renewal is $19.49–$73.99, and the card's choice (1-month renewal) is still the right ongoing figure. Nothing to change; do not re-date the caveat as a new finding.

Other rate-card inputs re-checked, all unchanged: no hourly meter (flat plan price), no per-GiB egress charge, no separate IPv4 fee, no platform/setup fee, no plan add-on fee. The live cart catalog carries no IPv4 or bandwidth line item at all — its add-ons are `daily_backup` ($6/mo on KVM 2, $12 KVM 4, $24 KVM 8), cPanel/DirectAdmin/LiteSpeed/Plesk/Webuzo/Monarx licences, and AI-credit packs (see below) — so there is nothing to model for an IP. Bandwidth allowances 4/8/16/32 TB and the 10 Mbps throttle after the allowance are still on the page and in the support article ("bandwidth throttling reduces the connection speed to 10 Mbps for the rest of the month"). `monthlyPlans: true`, `between: "kept"`, `maxDisk/maxVcpu/maxRam` 400/8/32 unchanged. Currency USD, no VAT line shown to a non-EU checkout; no currency or tax change to record.

### Feature rows — all 16 confirmed, none changed

| Feature | Verdict / figure | What I re-read on 2026-11-12 |
|---|---|---|
| billing-models | partly · $19.49–$73.99/mo, prepaid | Catalog + page quote above. |
| built-in-agents | partly · OpenClaw/Hermes/n8n templates | Page app grid still lists 9router, Buzz, Hermes Agent, n8n with AI Assistant, Nextcloud, OpenClaw, Agent Zero, Dify. |
| company | yes · Hostinger International Ltd; 99.9% | Hosting agreement §7 still "We offer a Service uptime guarantee of 99.9% … you may contact us and request a credit of 5% of your monthly hosting fee". Trust Center still lists exactly GDPR, ISO/IEC 27001:2022, PCI DSS v4.0.1 — still no SOC 2. Page still says "Trusted by 5M+ users". |
| custom-domains | partly · DNS; HTTPS manual | SSL article still "deploy Traefik from the Docker Catalog, run Certbot manually, or use the built-in SSL tools of your VPS control panel". |
| idle-timers | yes · No idle stop | Stop endpoint still "This is a compute-only power state change and does not affect billing. To stop future charges, disable auto-renewal on the owning subscription." |
| isolation | yes · KVM VM; root and Docker | KVM FAQ answer still on page. Nested virt article now states it harder: "Nested virtualization is not supported on Hostinger Virtual Private Server (VPS) hosting plans. Hostinger disables it…". Custom OS article still "we don't offer an option to upload or install your own OS images on VPS". |
| keys-secrets | no · No secret store | API overview still "Tokens inherit the permissions of the user who created them and can be set to expire." No scoped-key or vault product appeared. |
| lifecycle | partly · Stop keeps disk; no pause | Same stop quote; still no pause/suspend state. |
| outbound-network | yes · 4–32 TB/mo, then 10 Mbps | Same 4/8/16/32 TB on the four plans; throttle article unchanged. |
| reaching-it | yes · Public IPv4; SSH and web console | Hosting agreement still "You will have administrator (root) access and a dedicated IP address." Browser console and SSH still documented. |
| sizes-regions | partly · 8 vCPU / 32 GB; 10 regions | Page still "Launch your VPS in 10 data centers across 4 continents, from Boston to Jakarta" and "Change location anytime"; support article still "For VPS, the server location is fixed after initial setup." Contradiction stands. |
| snapshots-forks | partly · 1 snapshot, 1 day | Article still "Only one snapshot is stored at a time; creating a new one overwrites the previous one." + "Snapshots are automatically deleted **after 1 day.**" New detail in the same article: a snapshot is also deleted if you reinstall the OS or restore from a backup. |
| storage | partly · 50–400 GB included | Upgrade article still "Individual resources (such as disk space or RAM) can't be upgraded separately". Still no block-storage/volume product in the VPS API (14 sections, none for volumes). |
| teams-accounts | partly · 2 roles; no SSO or spend cap | Account Sharing article still "grant Collaborator or Admin roles"; still no SSO and no account spend cap. |
| trials-free-tiers | no · No free tier; 30-day refund | Refund article still 30-day money-back for "KVM VPS hosting plans" and still "After you successfully receive a refund for a VPS plan, a 180-day cooldown period applies." |
| ways-to-drive | yes · Dashboard, CLI, SDKs, API, MCP | Connector docs still list CLI, SDKs, REST, and MCP; see capability checks below. |

### Capability spot-checks (the numeric claims, re-derived)

- `mcp-server` figure **"63 VPS tools"** — still exact. Connector overview: "your AI assistant gets access to 372 Hostinger tools across these product areas" and the VPS row is "**VPS** | 63". Quote in the row ("Start, stop, and restart virtual machines; manage firewalls, SSH keys, snapshots, and metrics") is still the VPS capability cell.
- `rest-api` figure **"90 requests/min"** — still exact: "The API allows **90 requests per minute**."
- `file-api` and `prompt-api` "67 endpoints across 14 sections" — still exact, and still no file or prompt endpoint in the section list (Actions, Backups, Data centers, Docker Manager, PTR records, Firewall, Malware scanner, OS Templates, Post-install scripts, Public Keys, Recovery, Snapshots, SSH Keys, Virtual machine). Both `no` verdicts hold.
- `cli` quote — still "`hostinger` is the official command-line client for the Hostinger API."

### New / changed detail worth carrying into the profile (no verdict change)

1. **The MCP surface is now an editor extension with a hosted endpoint.** The page is titled "Hostinger Connector" and describes "an official Hostinger extension for your code editor"; it also documents a hosted remote MCP server at `https://mcp.hostinger.com` with OAuth 2.1, a local `npx -y @hostinger/mcp` stdio server, and per-product packages (`hostinger-vps-mcp`, …). Supported clients listed: VS Code/Copilot, Cursor, Windsurf, Devin Desktop, Antigravity, Claude Code, OpenAI Codex, Gemini CLI. The 2026-10-30 note only said "official MCP server with 63 VPS tools". Worth one clause in `ways-to-drive`/`mcp-server`; verdict stays `yes` and the figure stays 63.
2. **AI credit packs are now sold inside the VPS cart.** The KVM 2 catalog lists optional `agentscredits` packs ("Hostinger Credits 500/1000/2000/5000"), `nexosai` packs ("Nexos AI Credits 5/10/20/50/100") and `oxycredits` ("Oxylabs Credits", the 1,000 pack free with the plan). None is part of the machine price and none is required to run a VPS, but it means the dashboard an agent user meets can sell model/search credits alongside the server. Keep them out of the card; note them as separate spend if the profile discusses the AI console.
3. **Hostinger AI Router** — new product, changelog 11 Sep 2026, tagged `VPSNew`: "You can use one API key and credit balance to access AI models, without managing separate provider accounts and invoices. Spend limits and automatic routing help you manage costs when running AI agents." It is a model gateway with its own credits, not machine time, so it does not enter the rate card — but it is the kind of thing a reader may meet on the VPS dashboard and mistake for sandbox pricing. Note it as model spend, separate from the machine, if it is mentioned at all.
4. **Backups are not encrypted at rest** — the backup article now says "Hostinger doesn't encrypt VPS backups or snapshots at rest, but backup transfers are encrypted in transit." (It already said this on 2026-10-30; re-confirmed.) The `keys-secrets` `no` and the snapshot caveat both read slightly stronger with it, but neither verdict moves.
5. **Snapshot lifetime is now also tied to lifecycle events**: "it is deleted if you reinstall the OS or restore from a backup". Same 1-day expiry; adds a way to lose the only snapshot.

### Contradictions re-confirmed (both sides still live)

- "dedicated resources" / "Get dedicated resources" (VPS page) vs "If you purchase VPS, you will share a server with other customers" (hosting agreement) vs the credit floor (40% KVM 1, 30% KVM 2/4/8).
- "Change location anytime" (VPS page) vs "For VPS, the server location is fixed after initial setup. As an alternative, you can backup and reinstall the VPS on a different data center." (support). The VPS FAQ now spells out the reinstall cost itself: "This permanently deletes all data, including backups and snapshots, so back up your data first."
- CPU floor: credit article 40%/30% vs the older CPU-limit FAQ's 5–20%. Unresolved on 2026-10-30, unresolved now.
- Price band: FAQ "$6.49–$25.99/month" (24-month intro) vs the same page's "$19.49" struck-through list price and the card's $19.49–$73.99 1-month renewal.

**Hostinger verdict: no price change, no feature-verdict change, no capability-verdict change.** The only content worth touching is enrichment (hosted MCP endpoint, AI Router, snapshot-deleted-on-reinstall), and that is the parent's call, not a correction.

---

## 2. hostup — no rate change; three evidence quotes went stale (none changes a verdict)

### Rate card (`site/src/data/pricing/hostup.json`)

Fresh reads of `https://hostup.se/en/vps/` (EUR), `?currency=USD`, `?currency=SEK` and the order cart. Prices are unchanged; the USD column is still HostUp's own display conversion of the EUR column (EUR × 7/6), and SEK is still EUR × 10.

| Plan | Spec | EUR/mo (fresh) | USD display (fresh) | Card |
|---|---|---|---|---|
| VPS Nano | 1 vCPU / 2 GB / 25 GB / 1 TB | €3.50 | $4.08 | 4.08 |
| VPS XS | 2 / 4 / 50 / 2 TB | €4.90 | $5.72 | 5.72 |
| VPS SM | 4 / 8 / 100 / 5 TB | €9.90 | $11.55 | 11.55 |
| VPS MED | 8 / 16 / 200 / 10 TB | €19.90 | $23.22 | 23.22 |
| VPS LG | 16 / 32 / 400 / 20 TB | €39.90 | $46.55 | 46.55 |
| VPS XL | 16 / 64 / 800 / 32 TB | €74.90 | $87.38 | 87.38 |
| VPS XXL | 32 / 128 / 1,600 / 32 TB | €149.90 | $174.88 | 174.88 |

Annual (−10%) still shown per plan and billed as one year: "$44,10/year", "$61,72/year", "$124,72/year", "$250,72/year", "$502,72/year", "$943,72/year", "$1 888,72/year" — i.e. $3.68–$157.39/mo, matching the card's notes. No new plan, no plan removed, no term added.

Add-on rates re-read from the live cart for VPS XS (the configure page, not a marketing page):

- Block Storage (NVMe): "€0,06/mo per GB", 50 GB included, slider to 5,000 GB → the card's `disk.extraMonthly` 0.0642 USD/GiB is still the same 0.55 SEK at HostUp's display conversion.
- Bandwidth: "€1/mo per TB", 2 TB included, slider to 500 TB → still 10 SEK/TB.
- Backup slots: "€0,10/mo per additional backup slot", 7 included, up to 30 → still 1 SEK/slot, and still 7 on the smallest plan.
- No IPv4 fee line; "IPv6 address" is a free toggle, off by default. No setup fee, no minimum term.

**All rate-card inputs unchanged.** Currency chain, VAT treatment and the 10% annual discount are as recorded on 2026-10-30.

### Two quotes in the repo no longer match the live pages (fix these; no verdict moves)

1. **`features/ways-to-drive.json` (hostup row) → `source.quote`.** The repo quotes
   "383 documented endpoints cover the things you manage in the HostUp dashboard." (`https://developer.hostup.se/`)
   That sentence is gone. The page now reads, under API reference:
   **"All 386 endpoints, each with its fields, scopes, examples and errors."**
   Also live there: "276 error codes", and a per-area count list — "VPS 107 endpoints", "Cloud VPS 27 endpoints", "Domains & DNS 85 endpoints", "CDN 10", "Web hosting 88", "Orders & billing 35", "Account & API keys 23", "Support tickets 11".
   The row's note ("documented endpoint by endpoint with an OpenAPI spec and an llms.txt") still holds; only the number and wording need replacing. Verdict `yes` unchanged.

2. **`providers/hostup.json` caveat "HostUp's own pages give four different endpoint counts" → second evidence quote.** Same cause: 383 → 386. The contradiction itself is *stronger* now, not weaker:
   - home page, same screen, two figures: heading "**API First — 300+ Endpoints**" and body "**336 documented endpoints with typed IDs and stable error codes**";
   - VPS page: "we have a powerful and modern API with over 300 endpoints";
   - developer site: "All 386 endpoints".
   Four first-party counts (300+, 336, 386, "over 300") on three pages. Keep the caveat; refresh the 383 quote to 386. No verdict depends on the count.

3. **VAT contradiction has partly dissolved — re-word the caveat.** The price calculator still shows the two-line pattern the card quotes ("Subtotal (excl. VAT)" then "VAT (25%) (for private individuals in the EU)"). But the **cart no longer labels its total "inc. VAT"**: the live VPS XS cart now renders "Subtotal €4,90" / "**Total €4,90 /mo**" / "VPS XS · Total €4,90 /mo" with **no VAT line and no inc./excl. label at all**. The repo's second evidence quote ("VPS XS · Total (inc. VAT)") is therefore stale.
   What still governs is the terms, §4.4: "**You choose whether prices are shown including or excluding VAT.** VAT follows the rules for where you are: Swedish VAT for customers in Sweden, your country's VAT rate for private individuals elsewhere in the EU, and no Swedish VAT for companies in another EU country with a valid VAT number (reverse charge) or for customers outside the EU. **The total to pay is shown before you order.**"
   So the display mode is a customer setting, the calculator's default is ex-VAT, and the cart is now simply unlabelled. The card's ex-VAT choice remains defensible and the practical warning (a Swedish private buyer adds 25%; $5.72 → $7.15) still stands, but the caveat should say "the cart shows no VAT line at all" rather than "the cart labels the same total inc. VAT", and it should drop the alternative reading that the published figure already includes VAT — that reading rested on the stale label.

### Feature rows — confirmed, no verdict change

| Feature | Verdict / figure | Re-read evidence |
|---|---|---|
| billing-models | partly · $4.08–$174.88/mo | Monthly or annual (−10%, year upfront) only; standard VPS is a subscription for the period. |
| built-in-agents | no · None | Order flow still "Choose Operating System" → Debian/Ubuntu/Rocky/AlmaLinux, Windows from SM up; no app templates on the VPS. AI assistant + MCP manage the account, not an agent runtime. |
| company | yes · Hostup AB, 2019, Sweden | About page unchanged ("100% Swedish-owned internet company with our own hardware and network in Älvsjö, Stockholm"). Status page now **99.995%** over 90 days (was 99.992% at baseline) — same order of magnitude, still no SOC 2/ISO claim. |
| custom-domains | partly · Your DNS, your TLS | Still no managed certificate on a VPS; DNS is in-panel. |
| idle-timers | yes · No idle stop or limit | No timer, no sleep, no session cap anywhere in the VPS docs or cart. |
| isolation | yes · KVM, own kernel, root | VPS page still "Every VPS is its own KVM machine with its own resources"; KVM + own ISO (≤20 GB) still documented; 50% CPU cap after several days at full load still documented on the warnings page ("The CPU limited to 50 % notice appears when the server has run at full load for several days… It may then use CPU time equal to half of its vCPUs"). |
| keys-secrets | partly · Scoped API keys | Unchanged: scoped keys, IP/DNS-zone restriction, expiry; no secret vault. |
| lifecycle | partly · Stop keeps disk, bills on | Unchanged; the Cloud VM is still the only pay-while-running product and still gated. |
| outbound-network | partly · 1–32 TB, then blocked | Bandwidth still a hard cap, extra at €1/TB (10 SEK), no overage meter; firewall still inbound-only. |
| reaching-it | yes · IPv4, SSH, VNC | Unchanged (IPv4 included, SSH/RDP, VNC console, panel firewall). |
| sizes-regions | partly · 7 plans, 1–32 vCPU | Same 7 plans, same 25 GB–1.6 TB disks, same "Scale up to 1 TB RAM" line, still one Stockholm region. |
| snapshots-forks | partly · 24 h snapshots, 7 backups | Snapshots page (re-checked by HostUp 6 Nov 2026): "Every snapshot is deleted automatically 24 hours after it was taken." Slots are plan-bound ("Snapshots must be included in the server's plan"). Backups still 7 slots included, restorable to another/new server. |
| storage | yes · 25–1,600 GB, up to 32 TB | Ceph-replicated NVMe is now the headline ("Now with high availability! … Ceph replication … Your files, stored on several servers"); grow-only disk unchanged. |
| teams-accounts | partly · Users, audit log, no SSO | Unchanged (per-service users, 90-day audit log, no SAML/SSO, alerts but no hard spend cap). |
| trials-free-tiers | no · None; 14-day refund | Terms §2.2 verbatim unchanged: "a money-back guarantee for 14 days from activation, or for two days if you live or have your registered office outside the EU/EEA". |
| ways-to-drive | yes · API + MCP, no CLI | Unchanged except the endpoint count (above). Still no official CLI/SDK. |

### Capability / note deltas worth carrying (no verdict changes)

- **Cloud VM gate is now explicit about VAT**: "The account needs invoices paid with us for **2,000 SEK in total, VAT included**." Then "you verify your identity on the same page with a passport or ID card. If the account is Swedish, you can also use BankID." The `billing-models` and `sizes-regions` notes say "SEK 2,000 of prior payments" / "identity verification" — accurate, but "VAT included" is the precise wording if the parent wants it.
- **`sizes-regions` / `storage`**: the marketing page now sells the HA/Ceph story as the default ("High availability as standard – your data mirrored across several servers in Stockholm", "7 backups included"), and there is a dedicated `/en/vps/high-availability/` page with failover detail ("VM is rebooted on another server within minutes upon failure", "we'll live migrate your VPS onto another server without reboot"). The 2026-10-30 research already recorded Ceph replication and the HA page, so this is not new — just confirmed still live and now promoted on the VPS page.
- **Support pages carry their own review dates** ("Checked against the client area 6 November 2026" on snapshots; "30 October 2026" on order-a-vps). Useful freshness signal for the ledger; not a rate change.
- **Status page**: "99.995% uptime over 90 days", all systems operational at check. Two one-minute "mu / Could not connect to server" incidents on 11 and 12 Nov 2026.

**HostUp verdict: prices identical; no feature or capability verdict changes. Three evidence-text repairs (386 endpoint quote, cart VAT label, 99.995% uptime) and one precision addition (VAT-included Cloud VM threshold).**

---

## 3. lightsail — no rate change, no verdict change; five new console features since the baseline

### Rate card (`site/src/data/pricing/lightsail.json`)

Cross-checked three ways, all fresh: the AWS Price List offer file for `AmazonLightsail` / us-east-1 (`curl`), the bundle table in the User Guide (`Context web_scrape`, `maxAgeMs: 0`), and the pricing page's rendered bundle cards.

- Offer file `publicationDate`: **2026-09-15T15:19:51Z** — older than the 2026-10-30 baseline, so the machine-readable prices have not moved since the last check. 150 products.
- User Guide table and pricing-page cards agree with each other and with the card on all 25 public-IPv4 Linux bundles: $5 / $7 / $12 / $24 / $44 / $84 / $164 / $384 / $884 / $1,324 / $1,764 general purpose; $74 / $144 / $294 / $584 / $1,174 / $1,764 / $2,344 memory-optimised; $42 / $84 / $168 / $336 / $844 / $1,126 / $1,688 compute-optimised.
- Hourly rates are unchanged to the cent and are still exactly monthly ÷ 744: Nano 0.00672, Micro 0.0094, Small 0.01612, Medium 0.03225, Large 0.05913, Xlarge 0.1129, 2Xlarge 0.22043, 4Xlarge 0.51612, 8Xlarge 1.18817, 12Xlarge 1.77956, 16Xlarge 2.37096; memory-optimised 0.09946, 0.19355, 0.39516, 0.78495, 1.57796, 2.37097, 3.15054; compute-optimised 0.05645, 0.1129, 0.22581, 0.45161, 1.13441, 1.51344, 2.26882.
- IPv6-only Linux table still reads $3.50 / $5 / $10 / $20 / $40 / $80 / $160 / $380 / $880 / $1,320 / $1,760 for general purpose, i.e. **$1.50–$4 cheaper** than the IPv4 twin, matching the card's note. Hourly 0.00470 for the $3.50 bundle.
- Windows bundles still start at $9.50 (0.5 GB) and reach $4,204 (512 GB) — the card's "$9.50–$4,204" range is right.
- Per-bundle transfer allowances 1/2/3/4/5/6/7/8/9/10/10 TB, unchanged; the "halved in Mumbai, Sydney, Jakarta, Malaysia, Hong Kong and São Paulo" sentence is still on the pricing page verbatim ("include half the data transfer allowances mentioned in the bundles above").
- Overage table unchanged and still matches the card's per-region list: "$0.09 USD/GB" for US East/West, Canada, Hong Kong, Frankfurt, Ireland, London, Paris, Stockholm; "**$0.13**" Mumbai and Seoul; "$0.12" Singapore and Spain; "$0.17" Sydney; "$0.132" Jakarta; "$0.108" Malaysia; "$0.14" Tokyo; "$0.15" São Paulo.
- Add-ons unchanged: block storage "**$0.10 USD per allocated GB per month**" starting at 8 GB; snapshots "**$0.05 USD GB/mo**"; load balancer "**$18 USD/mo**"; containers from $7 with a 500 GB quota and $0.09/GB overage; static IPv4 "**$0.005 USD/hour**" when "not attached to an instance for more than 1 hour"; certificate management free.
- Region list unchanged at **19** ("Lightsail is available in the following Regions"), four starred as opt-in — Hong Kong, Jakarta, Malaysia, Spain — and six EU entries (Frankfurt, Ireland, London, Paris, Stockholm, Spain). Matches `choose-region`, `eu-region` and the profile's "19 regions, six in the EU, four opt-in".

### Billing-behaviour quotes still live

- "**Lightsail instances and managed databases incur charges until they are deleted. These resources accrue charges even when they are in the stopped state.**" — billing FAQ. This is the sentence the card's `billedWhileStopped` rests on; unchanged.
- Same FAQ now also carries the Research carve-out explicitly: "**Lightsail for Research instances accrue full hourly charges only while running. All Lightsail for Research instances cost $0.00685 USD/hr while stopped.**" Consistent with the existing caveat that Research is a different product with a cheap stopped rate.
- The FAQ's proration example is "if you use the least expensive Lightsail instance plan for 100 hours in a month, you will be charged **46 cents (100\*0.0046)**". Note the example rate ($0.0046/h) no longer matches the current cheapest bundle ($0.0067/h): it is a stale illustration, and it is the *only* first-party statement about partial-month billing. It still says nothing about rounding a partial **hour**, so the card's open question ("AWS publishes hourly billing but not whether a partial instance-hour rounds up") stays open. Do not turn this example into a rounding rule.
- Static IP page unchanged: "There are no costs associated with static IP addresses when they are attached to a Lightsail instance. However, static IP addresses incur a charge when they aren't attached to an instance."

### Feature rows — all 16 confirmed, none changed

Spot-checks that matter for money and for the "no pause" story: `billing-models` (hourly at bundle rate, capped monthly, stopped still billed, no plan fee), `lifecycle` (stop = power off, disk kept, no pause), `idle-timers` (no timer, "runs until you stop or delete it"), `trials-free-tiers` (Free Tier credits, not a recurring allowance), `sizes-regions` (25 fixed bundles, no in-place resize), `outbound-network` (1–10 TB, overage only outbound), `snapshots-forks` ($0.05/GB-mo, 7 daily automatic), `storage` ($0.10/GB-mo, 16 TB max, 15 disks), `teams-accounts` (IAM/Identity Center), `company` (SLA 99.5% per instance, SOC 1/2/3, AWS DPA). No number moved.

### New first-party capability since 2026-10-30 (docs release history, RSS)

The Lightsail user-guide release feed has five entries after the baseline that are product features, not just doc edits:

| Date | Entry (verbatim title) | What it is | Effect on our rows |
|---|---|---|---|
| 11 Nov 2026 | "Added Lightsail web addresses" | "names that end in `amazonlightsail.com`, that you can attach to your Lightsail distributions without registering a domain" | New free hostname option, **distributions only** (not instances). `custom-domain` verdict stays `yes`; worth one clause in the `custom-domains` feature note as a CDN-only convenience. Does not give an instance a hostname. |
| 4 Nov 2026 | "Added updating instances to newer-generation hardware" | "update it to the equivalent newer-generation bundle at the same price when you start it… and revert it to its original bundle" | Reinforces the existing "created on or before 29 June 2023 has 1 vCPU" caveat: old instances can now be moved to the current bundle at the same price on next start. No rate change. |
| 23 Oct 2026 | "Added the Web Application Firewall (WAF) for distributions" | Managed and custom WAF rule groups on CDN distributions, with blocked/allowed-request metrics | Distribution feature, not instance ingress. `reaching-it` unchanged. |
| 21 Oct 2026 | "Added instance status checks" | System and instance status checks, status-check alarms, troubleshooting page | Monitoring only. `usage-alerts` figure ("AWS Budgets") could mention status-check alarms; verdict already `yes`. |
| 16 Oct 2026 | "Added system disk performance metrics for instances" | Disk performance metrics and alarms | Same: `usage-alerts` note could add "disk-performance alarms". |

Also 31 Oct: "Added guidance for addressing CVE-2026-98432 on Linux-based instances" — an OS-patching advisory, not a Lightsail-managed patch. It reinforces, rather than changes, the `upkeep` claim that patching is the customer's job.

### Contradictions / model limits re-confirmed

- **GB vs GiB**: AWS labels memory and disk in "GB"; the card maps them 1:1 to GiB. Still the case on the bundle table. No new statement.
- **Stopped billing vs Research**: ordinary instances bill in full while stopped; Research bills $0.00685/h. Both on the same FAQ page, correctly separated in the card.
- **Partial-hour rounding**: still unpublished; the card's A figure ($5.38 pro-rata) versus $32.25 whole-hour remains an open question, not a rule.
- **"Lightsail for Research" is not in the rate card** — correct, it is a separate product with its own bundles; nothing new appeared there on this pass beyond the pricing-page anchor.

**Lightsail verdict: no price change, no feature or capability verdict change.** Only enrichment candidates: amazonlightsail.com web addresses (distributions), WAF on distributions, instance status checks, disk-performance metrics/alarms, and same-price newer-generation hardware upgrade.

---

## 4. linode (Akamai Cloud) — no rate change, no verdict change; four new first-party products and one retirement

### Rate card (`site/src/data/pricing/linode.json`)

Verified against **the provider's own machine-readable type list** (`https://api.linode.com/v4/linode/types`, fresh `curl`, 75 types) *and* the rendered pricing page *and* the docs bundle tables. All three agree with the card; no shape was added, removed or repriced.

- Shared CPU: Nanode 1 GB $5 / 0.0075; Linode 2 GB $12 / 0.018; 4 GB $24 / 0.036; 8 GB $48 / 0.072; 16 GB $96 / 0.144; 32 GB $192 / 0.288; 64 GB $384 / 0.576; 96 GB $576 / 0.864; 128 GB $768 / 1.152; 192 GB $1,152 / 1.728 — all with a monthly cap, all identical to the card.
- G6 Dedicated: $36 / $72 / $144 / $288 / $576 / $864 / $1,152 / $2,304 for 4–256 GB, hourly 0.054–3.456 — unchanged.
- G7 Dedicated ("premium" in the API): $43 / $86 / $173 / $346 / $691 / $1,037 / $1,382 / $2,765, hourly 0.0645 / 0.129 / 0.2595 / 0.519 / 1.0365 / 1.5555 / 2.073 / 4.1475 — unchanged.
- G8 Dedicated: nine 1:2 shapes and eight 1:4 shapes, hourly only, `monthly: null` in the API — unchanged, and the API itself is the proof that there is still no cap. Cheapest 4x2 is $0.07/h; largest 512x256 is $8.64/h.
- High Memory: 24 GB $60 / 0.09, 48 GB $120 / 0.18, 90 GB $240 / 0.36, 150 GB $480 / 0.72, 300 GB $960 / 1.44 — unchanged.
- Backups add-on: $2 (Nanode), $2.50 (2 GB), $5 (4 GB), $10 (8 GB), $20 (16 GB), $40 (32 GB), $80 (64 GB), $120 (96 GB), $160 (128 GB), $240 (192 GB) — matches the card's notes.
- Block Storage: "Volumes start at **$0.10/GB per month** ($0.00015/GB per hour) and can range from **10 GB to 16 TB** in size" — matches `disk.extraMonthly` 0.10 and the volume limits.
- Egress: "Egress overage costs = **US$0.005 per GB**" repeated under every plan family — matches `egress.perGiB`.
- Regions: API `/v4/regions` returns **33** regions, all `site_type: core`, all with the `Linodes` capability. Ten European entries across **seven European countries** (Germany ×2, UK ×2, France ×2, Netherlands, Sweden, Italy, Spain) = **six EU countries** once the UK is excluded. Matches "33 core regions, seven in Europe, six in the EU". Paris 2 (`fr-par-2`) and Washington 2 (`us-iad-2`) are now listed as ordinary core regions in the "New data centers 2026" doc ("Available to all customers") and are already inside the 33 — no recount needed.
- Region surcharges: API `region_prices` still carries only Jakarta (+20%: $6 / 0.009 on Nanode) and São Paulo (+40%: $7 / 0.0105). Matches "Jakarta and São Paulo excepted".

**Billing-rule quotes still live** (billing doc):

- "**Usage is always rounded up to the nearest hour.**" — `wholeHours` and the A reading.
- "**Starting July 1, 2026, G8 dedicated Linodes, GPU Linodes, and additional IPv4 addresses are billed for actual hours used each month, with no monthly price cap.**" — unchanged.
- "**Charges accrue for any service present on an account, even if it's powered off or otherwise not actively being used.** This is because data is still maintained and resources, such as RAM and network capacity are still reserved." — `billedWhileStopped`, and the profile's "nothing changes when you power off".
- Pricing-page FAQ: "If my VM is powered off, will I be billed? **Yes.**" and "G6 and G7 plans include some network transfer (egress) in their hourly rate… **Newer VM families, such as the G8 dedicated compute series, no longer include bundled egress.**" Both already reflected in the card.

### Two display discrepancies to know about (not rate changes)

1. **The marketing page rounds G7 hourly rates to two decimals** — "$0.06", "$0.13", "$0.26", "$0.52", "$1.04", "$1.56", "$2.07", "$4.15" — while the API returns the exact $0.0645 / 0.129 / 0.2595 / 0.519 / 1.0365 / 1.5555 / 2.073 / 4.1475 the card uses. Anyone re-deriving the card from the page will get different cents. The card is right; keep the API figures.
2. **G8 disk is quoted in the card as the round marketing figure** (40 / 80 / 160 / 320 / 640 / 960 / 1,280 / 2,560 / 5,120 GB) while the API reports 41,984 MB (41 GiB), 83,968 MB (82 GiB), … i.e. one GiB more at the small end. It makes no difference to A/B/C (10 / 50 / 20 GiB) and the card is conservative, but the profile's "Fixed shapes only" sentence inherits a GB-vs-GiB ambiguity it does not flag. Same class of issue as the existing Hostinger/HostUp notes; low priority.

### New first-party products since 2026-10-30

1. **Akamai Agent Sandbox** — the big one. A new product page under Serverless, next to Akamai Functions: "Akamai Agent Sandbox runs AI agents on Akamai Functions and gives the code those agents write an additional sandbox nested inside the sandbox Akamai Functions already provides." WebAssembly/Spin isolation, "no outbound access by default", JavaScript or Python runtimes for agent-written code, "any OpenAI-compatible model", runs across "Akamai Cloud core regions". **Status: tech preview — every CTA is "Request access"**, and the FAQ says "The tech preview supports intermittent agents. Each step completes in about a minute". **No price is published anywhere on the page.** Verbatim quotes worth keeping:
   - "It uses two layers. Your agent runs in a WebAssembly sandbox because it is a Spin application on Akamai Functions, and the code it writes runs in a restricted JavaScript or Python runtime nested inside that sandbox."
   - "no outbound access by default"
   - "The tech preview supports intermittent agents. Each step completes in about a minute, then the agent stops until it receives its next instruction. Stateful components will add support for agents that stay alive and keep their state for days or weeks."
   This is **not** the `linode` VPS product and should not be priced into its rate card. It is a separate provider candidate for the guide (or at minimum a cross-reference on the linode page), and it is the one finding in this group that could change the site's provider inventory rather than a row.
2. **Akamai Inference** (beta) — an OpenAI-compatible model-serving product on Akamai Cloud, with monitoring added 2 Nov 2026. Model spend, not machine spend; relevant only if a provider page starts mixing inference into its totals.
3. **NAT Gateways** — beta, 4 Nov 2026.
4. **Cloud Pulse monitoring for Linodes and Block Storage** — beta, 26 Oct 2026 (metrics and alerts).

### Retirement / limit changes worth a note

- **Distributed compute regions are being retired**: "we've made the decision to **retire the _Akamai Distributed Compute_ regions, effective December 31, 2026.** You need to move your services out of these regions before then. Any services remaining in the above regions after then will be permanently deleted." (page updated 2 days before this check). These were limited-availability edge regions on `g6-dedicated-edge-*` plans; they are not in the card and not among the 33 core regions, so no rate or verdict moves — but a reader who saw "distributed compute regions" in the docs nav should not plan around them past 2026.
- **Account-level IPv4 limits per data center** (28 Oct 2026) — new allocation cap; does not change the per-instance price.
- **Reserved public IPv4 addresses** (1 Jul 2026) — the mechanism behind the "additional IPv4 addresses billed hourly with no cap" note; still no published figure in the card, price varies by region.

### Quick Deploy Apps catalogue

Unchanged in substance but larger than the card's two examples: AI Agent → **Hermes, NemoClaw, OpenClaw, OpenFang**; AI Coding Agent → **OpenCode**; plus CrewAI, Haystack, Langflow, Microsoft Agent Framework and the usual control panels/databases. OpenFang and OpenCode guides were added 26 Oct 2026, i.e. four days before the baseline, so the 2026-10-30 `agents-preinstalled` note ("Opencode, NemoClaw and other agent frameworks") is right and only misses OpenFang by name. Verdict `partly` stands: these are separate deployments, not a coding agent in the default image.

Quote checks: Hermes page still reads "Deploy Hermes Agent, an open source AI agent platform that executes tasks through a persistent gateway connecting communication channels, tools, and AI models." with "Estimated deployment time: 5–10 minutes" (the card's "5-10 minutes" hyphenation is the only normalisation). OpenClaw page still reads "This app allows you to connect to the OpenClaw dashboard via a secure HTTPS endpoint protected by HTPASSWD and creates a limited user on the system named `openclaw`."

### Feature rows — all 16 confirmed

`billing-models` (hourly to a monthly cap; G8 uncapped; off = billed), `lifecycle` (no pause, delete to stop), `idle-timers` (none), `snapshots-forks` (images/snapshots; clone needs power-off), `storage` (plan disk + $0.10/GB volumes), `sizes-regions` (fixed shapes, 33 regions), `reaching-it` (public IPv4, SSH, Lish/Glish), `outbound-network` ($0.005/GB overage, 1–20 TB by plan), `custom-domains` (DNS manager), `teams-accounts` (IAM/RBAC, no hard spend cap), `trials-free-tiers` ($100 credit, card at signup), `company` (Linode contracting entity, 99.99% SLA, SOC 2 Type 2, DPA), `isolation` (KVM), `keys-secrets` (no vault), `ways-to-drive` (API, CLI, SDKs, MCP), `built-in-agents` (Quick Deploy apps). Nothing moved.

**Linode verdict: no price change, no feature or capability verdict change.** Additive findings: Akamai Agent Sandbox (tech preview, unpriced, separate product), Akamai Inference (beta), NAT Gateways (beta), Cloud Pulse monitoring (beta), distributed-compute retirement on 2026-12-31, IPv4 allocation limits. Evidence repairs: none required — every checked quote is still live.

Integration note (primary thread): cart total quote "VPS XS · Total€4,90 /mo" confirmed by a fresh Firecrawl render (maxAge 0) on 2026-11-12; no VAT word appears anywhere in the rendered cart.

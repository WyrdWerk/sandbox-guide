# HostUp — provider research

Research date: **2026-10-30** (Asia/Kolkata; the live pages were read on 2026-10-30 IST, i.e.
2026-10-29/30 UTC). Repository revision: **`197302e`** (`origin/main`, clean checkout).
Target provider id: **`hostup`**. Desk research only: no HostUp account was created, no identity
verification was started, no VPS was ordered and nothing billable was run.

**Scope.** HostUp's VPS product as sold on `hostup.se`: seven fixed plans on a monthly or annual
term, the gated pay-as-you-go "Cloud VM" that a new customer cannot buy, and the surrounding
control panel (API, MCP, snapshots, backups, firewall, network). HostUp's web hosting, domains and
CDN are mentioned only where a reader could confuse them with the VPS.

**Tag legend**

| Tag | Meaning |
|---|---|
| `docs-confirmed` | Stated on a HostUp support guide, legal document or security page. |
| `pricing-page` | Stated on a page whose subject is money (the VPS page, the cart, the price calculator, the products API). |
| `third-party` | Not from HostUp. Not used for a rate or a verdict. |
| `inferred` | My reading of a documented surface where the answer is absent, such as an order API whose only option is the operating system. |
| `not-published` | HostUp does not answer the question on any page I could find. |

**Quote handling.** Quotes are copied from the fetched Markdown of each page on 2026-10-30. For
matching I removed Markdown emphasis and code markers (`**`, backticks), converted typographic
apostrophes and quotes to ASCII, unescaped backslash escapes, and collapsed whitespace. No wording,
number or qualifier was changed. A script re-fetched every cited URL and checked each quote in
`feature-rows.json` and `capability-rows.json` against the normalised page text; results are in
section 15.

**Retrieval method.** Composio MCP tools first. TinyFish `fetch_content` (free) with `ttl: 0` for
fresh page reads, in batches, for every public page cited here. Firecrawl `firecrawl_scrape` for
the two PDFs (terms of service) and for the client-area cart, which TinyFish returned only partly.
`curl` for HostUp's own public product endpoint
`https://cloud.hostup.se/api/v2/products/vps`, which returns `200` without authentication (plain
`curl` against `hostup.se` returns `403`, as expected; `cloud.hostup.se` does not). No Context, Exa,
Tavily or Parallel call was needed; no paid dataset, deep-research report or browser session was
purchased.

**Spend.** Firecrawl: 4 scrapes (about 4 credits). TinyFish: free tier. Total well under **$0.05**,
against the $1 cap.

---

## 1. What the product is

HostUp sells KVM virtual servers in seven fixed sizes, on its own hardware in one data hall in
Älvsjö, Stockholm. The guest is a full virtual machine with root, its own kernel and a public IPv4.

> "Every VPS is its own KVM machine with its own resources, so you can test, reboot and reinstall freely without affecting your production VPS." — [VPS hosting](https://hostup.se/en/vps/) `docs-confirmed`

> "Gain full control over your VPS with KVM. Install any operating system and your own kernel. Run whatever you want on your VPS." — [VPS hosting](https://hostup.se/en/vps/) `docs-confirmed`

> "All our VPS servers are located in Sweden and are owned by us at Hostup AB." — [VPS hosting](https://hostup.se/en/vps/) `docs-confirmed`

There is no sandbox API, no per-task machine, no fork and no managed agent runtime. The product a
reader buys is one server for a month or a year, plus a control panel that is unusually complete for
this price: a documented REST API, an OpenAPI spec and a remote MCP server.

### The seven plans

Storage and bandwidth on the page are per plan; CPU and memory are fixed by the plan.

| Plan | vCPU | RAM | NVMe | Bandwidth | SEK/mo | EUR/mo | USD/mo | EUR/yr (billed) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| VPS Nano | 1 | 2 GB | 25 GB | 1 TB | 35 | €3.50 | $4.08 | €37.80 |
| VPS XS | 2 | 4 GB | 50 GB | 2 TB | 49 | €4.90 | $5.72 | €52.90 |
| VPS SM | 4 | 8 GB | 100 GB | 5 TB | 99 | €9.90 | $11.55 | €106.90 |
| VPS MED | 8 | 16 GB | 200 GB | 10 TB | 199 | €19.90 | $23.22 | €214.90 |
| VPS LG | 16 | 32 GB | 400 GB | 20 TB | 399 | €39.90 | $46.55 | €430.90 |
| VPS XL | 16 | 64 GB | 800 GB | 32 TB | 749 | €74.90 | $87.38 | €808.90 |
| VPS XXL | 32 | 128 GB | 1,600 GB | 32 TB | 1,499 | €149.90 | $174.88 | €1,618.90 |

> "### €4.90 €4.41/mo Billed €52.90/year" — [VPS hosting](https://hostup.se/en/vps/) `pricing-page`

> "### €149.90 €134.91/mo Billed €1 618.90/year" — [VPS hosting](https://hostup.se/en/vps/) `pricing-page`

The same plans from the order API, in the base currency:

> `"slug":"vps-xs","tier":"xs","name":"VPS XS","resources":{"cpuCores":2,"memoryGb":4,"storageGb":50},"bandwidth":{"limitGb":2048},"billing":{"amount":49,"currencyCode":"SEK","billingCycle":"monthly"},"billing":{"amount":49,"currencyCode":"SEK","billingCycle":"monthly"}` — [Products API](https://cloud.hostup.se/api/v2/products/vps) `pricing-page`

Disk and bandwidth can be raised on the same plan; CPU and memory cannot. The order API prices the
add-ons in SEK:

> `{"key":"storageGb","label":"Block Storage (NVMe)","type":"slider","min":25,"max":5000,"step":25,"default":25,"includedAtBase":25,"unit":"GB","pricing":[{"billingCycle":"monthly","amount":0.55,"currencyCode":"SEK"}}` — [Products API](https://cloud.hostup.se/api/v2/products/vps) `pricing-page`

> `{"key":"bandwidthGb","label":"Bandwidth limit","type":"slider","min":1024,"max":512000,"step":1024,"default":1024,"includedAtBase":1024,"unit":"GB","pricing":[{"billingCycle":"monthly","amount":0.009765625,"currencyCode":"SEK"}}` — [Products API](https://cloud.hostup.se/api/v2/products/vps) `pricing-page`

0.55 SEK per GB-month of extra NVMe and 0.009765625 SEK per GB-month of extra bandwidth, i.e. exactly
**10 SEK per TB per month**. The cart rounds those to "€0,06/mo per GB" and "€1/mo per TB".

> "Block Storage (NVMe) 50 GB included GB €0,06/mo per GB" — [VPS XS order page](https://cloud.hostup.se/cart/en/vps/xs) `pricing-page`

> "Bandwidth limit 2 TB included TB €1/mo per TB" — [VPS XS order page](https://cloud.hostup.se/cart/en/vps/xs) `pricing-page`

---

## 2. Currency, VAT and what the number on the page means

**Base currency is SEK. EUR and USD are display conversions, not market rates.**

The Swedish page shows round SEK prices (35, 49, 99, 199, 399, 749, 1,499). The English page shows
EUR by default, and the EUR figure is exactly the SEK figure divided by ten (35 → €3.50, 49 → €4.90,
1,499 → €149.90). The USD figure is exactly the EUR figure times 7/6 ($4.08, $5.72, $11.55, $23.22,
$46.55, $87.38, $174.88). Both steps are fixed arithmetic applied by HostUp's own storefront:

> "VPS Nano **1 vCPU** Processor **2 GB** Memory **25 GB** NVMe SSD **1 TB** Bandwidth ### 35 32 SEK/mo Billed 378 SEK/year" — [VPS hosting, SEK](https://hostup.se/en/vps/?currency=SEK) `pricing-page`

> "VPS Nano **1 vCPU** Processor **2 GB** Memory **25 GB** NVMe SSD **1 TB** Bandwidth ### $4.08 $3.68/mo Billed $44.10/year" — [VPS hosting, USD](https://hostup.se/en/vps/?currency=USD) `pricing-page`

The site offers the three currencies in its own switcher (`?currency=SEK`, `?currency=EUR`,
`?currency=USD`), and the cart shows which one it is using:

> "Showing:EUR" — [VPS order page](https://cloud.hostup.se/cart/en/vps) `pricing-page`

The legal basis for paying in any of the three:

> "Payments are made in SEK, EUR or USD." — [Terms of service §4.4](https://hostup.se/legal/terms-of-service-en.pdf) `docs-confirmed`

**What this means for the card.** The card is in USD because the shared engine is USD. Its figures
are HostUp's **own USD display** read on 2026-10-30 (VPS XS $5.72, VPS SM $11.55). I did not apply an
exchange rate of my own and I am not quoting a market rate: the chain is SEK list ÷ 10 = EUR display,
EUR display × 7/6 = USD display, both fixed by HostUp. That conversion is not documented as an FX
policy anywhere, HostUp may reprice (terms §4.5 gives 30 days' notice), and a card payment in SEK
will be converted by the card issuer at its own rate. Anyone reconciling the card against a Swedish
invoice should use the SEK column.

**VAT: HostUp's own pages do not agree, and I could not settle it without checking out.**

The price calculator separates a subtotal from VAT, which reads as "plan prices are ex-VAT":

> "Subtotal (excl. VAT) VAT (25%) (for private individuals in the EU)" — [Price calculator](https://hostup.se/en/pricecalculator/) `pricing-page`

The cart labels its total the other way round, and the total equals the plan price:

> "VPS XS · Total (inc. VAT)" — [VPS XS order page](https://cloud.hostup.se/cart/en/vps/xs) `pricing-page`

The terms say the display mode is a customer choice, and the client area has a switch for private EU
customers:

> "You choose whether prices are shown including or excluding VAT." — [Terms of service §4.4](https://hostup.se/legal/terms-of-service-en.pdf) `docs-confirmed`

> "VAT follows the rules for where you are: Swedish VAT for customers in Sweden, your country's VAT rate for private individuals elsewhere in the EU, and no Swedish VAT for companies in another EU country with a valid VAT number (reverse charge) or for customers outside the EU." — [Terms of service §4.4](https://hostup.se/legal/terms-of-service-en.pdf) `docs-confirmed`

> "If you are a private customer in an EU country, you can choose whether prices in the client area include VAT." — [Costs and VAT](https://hostup.se/en/support/costs-and-vat/) `docs-confirmed`

> "Companies and customers outside the EU always see prices without VAT. There is no switch for them." — [Costs and VAT](https://hostup.se/en/support/costs-and-vat/) `docs-confirmed`

**Interpretation and consequence.** The card uses the published plan figure ($5.72 / €4.90) and labels
it **ex-VAT**, following the calculator, because that page's whole job is to compute a total and it
puts VAT on a separate line above "Total". Under that reading a private customer in Sweden adds 25%
(VPS XS $5.72 → $7.15), a private customer elsewhere in the EU adds their own rate, and a
VAT-registered business in another EU country or a customer outside the EU pays the figure as shown.

If the cart's label is the literal one — the €4.90 already includes 25% Swedish VAT — then the ex-VAT
price is €3.92 ($4.58) and the card overstates a business buyer's cost by 25%, while a Swedish private
buyer pays €4.90 either way. I did not create an account or complete a checkout to settle it, so the
card's totals should be read as "the figure HostUp publishes", with this caveat attached. This is
recorded as a contradiction in `provider.json`, not silently resolved.

---

## 3. Billing terms

**Standard VPS: one month or one year, paid in advance.**

> "A standard VPS is paid for one month or one year at a time." — [Order a VPS](https://hostup.se/en/support/order-a-vps/) `docs-confirmed`

> "Choose the billing period in Order Summary: 1 month or 12 months." — [Order a VPS](https://hostup.se/en/support/order-a-vps/) `docs-confirmed`

> "Once the order is paid, the server is created." — [Order a VPS](https://hostup.se/en/support/order-a-vps/) `docs-confirmed`

The annual option is 10% off the monthly price, paid for the whole year: €4.90 → €4.41/mo, billed
€52.90. It is not a different product. There is no introductory discount on the monthly price: the
monthly figure and the annual figure sit side by side under "Monthly / Annually (-10%)", and the cart
totals the plan at the monthly figure with no discount line:

> "VPS XS · Total€4,90 /mo" — [VPS XS order page](https://cloud.hostup.se/cart/en/vps/xs) `pricing-page`

> "Monthly Annually **(-10%)**" — [VPS hosting](https://hostup.se/en/vps/) `pricing-page`

**Hourly billing exists, but a new customer cannot get it.**

> "PAYG requires identity verification and at least SEK 2,000 in previous payments to HostUp, including for Swedish accounts verified with BankID." — [VPS hosting FAQ](https://hostup.se/en/vps/) `docs-confirmed`

> "The account needs paid invoices with us up to a certain amount. Until then, New Server goes straight to ordering a standard VPS." — [Create a VPS billed by the hour](https://hostup.se/en/support/cloud-vm/) `docs-confirmed`

> "Then you verify your identity on the same page with a passport or ID card." — [Create a VPS billed by the hour](https://hostup.se/en/support/cloud-vm/) `docs-confirmed`

> "CPU and memory only cost money while the server is running. The disk costs money for as long as the server exists, even when it is stopped." — [Create a VPS billed by the hour](https://hostup.se/en/support/cloud-vm/) `docs-confirmed`

> "A VPS billed by the hour has no Billing tab. You pay for the time it runs." — [Change your billing cycle](https://hostup.se/en/support/billing-cycle/) `docs-confirmed`

The hourly Cloud VM (PAYG) is a genuinely different meter — CPU and RAM only while running, disk
always, bandwidth per GB — but it is behind identity verification and SEK 2,000 of prior payments,
and its per-hour rates are shown only inside the client area to an eligible account. The public API
reference documents the shape of those rates with **example** values (`cpuPerCoreHour: 0.12`,
`memoryPerGbHour: 0.04`, `storagePerGbHour: 0.003`, `bandwidthPerGb: 0.1`, `ipPerHour: 0.02`, all
SEK):

> "`pricing.cpuPerCoreHour` number required · Example: `0.12` Hourly rate per CPU core, in `currencyCode`." — [API: Get Cloud VPS PAYG deployment options](https://developer.hostup.se/endpoints/cloud-vps/get-v2-vps-payg-deployments) `docs-confirmed`

Those are documentation examples, not a published tariff, and they are **not** used in the card. A
new reader cannot buy that meter, so pricing it would describe a product they cannot have.

**A stopped standard VPS keeps billing in full.** Stopping is a power-off: the plan is a
subscription for the period, the disk stays, the invoice does not change.

> "The server gets 60 seconds to shut itself down. If it is not off by then, the power is cut automatically." — [Start, stop and restart your VPS](https://hostup.se/en/support/start-stop-restart/) `docs-confirmed`

> "A stopped VPS billed by the hour still costs money for its disk, see Create a VPS billed by the hour." — [Start, stop and restart your VPS](https://hostup.se/en/support/start-stop-restart/) `docs-confirmed`

The second sentence is the only one that distinguishes billing by state, and it is about the PAYG
product. For a standard plan there is no stopped state that costs less.

**Refunds and cancellation.**

> "On a new order of VPS or web hosting, both Consumers and Business Customers have a money-back guarantee for 14 days from activation, or for two days if you live or have your registered office outside the EU/EEA when you order." — [Terms of service §2.2](https://hostup.se/legal/terms-of-service-en.pdf) `docs-confirmed`

> "The fee for the paid period is not refunded when you cancel the service yourself, except under sections 2.2 and 2.3." — [Terms of service §4.2.3](https://hostup.se/legal/terms-of-service-en.pdf) `docs-confirmed`

---

## 4. Isolation, CPU and hardware

The guest is a KVM virtual machine with its own kernel, root and a public IPv4. There is no
nested-virtualisation page and no GPU product.

> "Every virtual server runs on NVMe storage in our Stockholm data center, with your data mirrored across several servers." — [VPS hosting](https://hostup.se/en/vps/) `docs-confirmed`

> "We utilize a cluster of compute servers. Any of these servers can run your VM, and if a compute server fails, it can simply be rebooted onto another within minutes." — [High availability](https://hostup.se/en/vps/high-availability/) `docs-confirmed`

**CPU is not a permanently dedicated core.** A server that has run at full load for several days is
capped at half of its vCPUs, and disk I/O can be throttled:

> "The CPU limited to 50 % notice appears when the server has run at full load for several days. It may then use CPU time equal to half of its vCPUs. The server keeps running as usual but works more slowly when it needs more than that." — [Warnings on your VPS](https://hostup.se/en/support/vps-warnings/) `docs-confirmed`

> "The Temporary disk limit active notice appears when the server reads or writes far more on its disk than normal. The disk is then slower until the limit is removed." — [Warnings on your VPS](https://hostup.se/en/support/vps-warnings/) `docs-confirmed`

For A, B and C — all of which sit far below 50% average CPU — the cap does not bind. It does bind a
build server or a model-inference box that pegs every vCPU for days, which is worth telling a reader.

**Docker** is not documented for the VPS, but the guest is a KVM machine with root and its own
kernel, so it runs. Tagged `inferred` on the row; the quote is the "install any operating system and
your own kernel" sentence above. HostUp's own support text says Docker *cannot* be installed on its
shared web hosting, which is a different product.

**Custom images** are ISO-based, not image-based: you can mount your own ISO (up to 20 GB) and
install anything, but you cannot upload a disk image.

> "To install an operating system we don't offer, or to start the server in a rescue system, you mount an ISO file." — [Boot your VPS from your own ISO file](https://hostup.se/en/support/mount-custom-iso/) `docs-confirmed`

> "The file can be at most 20 GB." — [Boot your VPS from your own ISO file](https://hostup.se/en/support/mount-custom-iso/) `docs-confirmed`

---

## 5. Sizes, regions, storage

**One region.** Everything is in Älvsjö, Stockholm, in two availability zones. There is no region
picker and no way to move a server to another country.

> "Your VPS, our physical server, is located at Obehosting AB, which provides a data center in Stockholm, Sweden (Älvsjö)." — [VPS hosting FAQ](https://hostup.se/en/vps/) `docs-confirmed`

> "We open our second availability zone in Älvsjö, Sweden." — [About us](https://hostup.se/en/about-us/) `docs-confirmed`

Sweden is in the EU, so "runs in the EU" is `yes`; "choose the region" is `no`.

**Sizes are fixed except disk and bandwidth.**

> "When you change package, the server restarts by itself as the change is made." — [Upgrade or downgrade](https://hostup.se/en/support/upgrade-or-downgrade/) `docs-confirmed`

So a resize is not live: CPU and memory changes need a restart. Disk can grow without one (the
filesystem still has to be extended inside the guest):

> "A disk can only grow, never shrink." — [More storage for your VPS](https://hostup.se/en/support/vps-disks-and-storage/) `docs-confirmed`

> "The disk gets bigger. The file system in the operating system does not grow by itself, though." — [More storage for your VPS](https://hostup.se/en/support/vps-disks-and-storage/) `docs-confirmed`

Large sizes are available on request, above the 32 vCPU / 128 GB top plan:

> "Scale up to 1 TB RAM and down just as easily." — [VPS hosting](https://hostup.se/en/vps/) `docs-confirmed`

> "We can provide up to 32 TB of NVMe storage on request." — [VPS hosting FAQ](https://hostup.se/en/vps/) `docs-confirmed`

**Separate volumes exist only on the gated PAYG product.**

> "Volumes are only for pay-as-you-go VPS. On a regular VPS, add a disk on the server's Storage tab instead." — [Volumes (block storage)](https://hostup.se/en/support/block-storage-volumes/) `docs-confirmed`

A volume attaches to one server at a time; it is not a shared filesystem.

> "Pick the server under Select VM. Only active pay-as-you-go VPS are listed." — [Volumes (block storage)](https://hostup.se/en/support/block-storage-volumes/) `docs-confirmed`

---

## 6. Lifecycle, snapshots and backups

**Stop keeps the disk, loses memory.** No pause, no hibernation, no fork.

**Snapshots are disk-only and expire after 24 hours.**

> "A snapshot saves the state of the server's disk right now." — [Snapshots of your VPS](https://hostup.se/en/support/snapshots/) `docs-confirmed`

> "All snapshots are deleted automatically after 24 hours. They do not replace backups." — [Snapshots of your VPS](https://hostup.se/en/support/snapshots/) `docs-confirmed`

> "The plan decides how many snapshots the server can have." — [Snapshots of your VPS](https://hostup.se/en/support/snapshots/) `docs-confirmed`

**Backups are the durable copy: weekly by default, seven slots included.**

> "Every new VPS gets a schedule that takes a backup once a week." — [VPS backups](https://hostup.se/en/support/backups/) `docs-confirmed`

> "A server can have one schedule." — [VPS backups](https://hostup.se/en/support/backups/) `docs-confirmed`

> "Hostup automatically backs up every VPS, at no extra cost, according to the settings available for the service." — [Terms of service §19.1](https://hostup.se/legal/terms-of-service-en.pdf) `docs-confirmed`

**Restore, not fork.** A backup can be restored onto the same server, onto another of your servers,
or onto a brand-new server — that last path is the closest thing to a clone, and it is a cold copy,
not a copy of a running machine.

> "You can restore a backup in three ways: to the same server, from another of your servers, or to a brand new server." — [Restore a backup](https://hostup.se/en/support/restore-a-backup/) `docs-confirmed`

**No templates.** Rebuild templates are HostUp's OS list; you cannot save a configured server as a
reusable image.

> "List VPS rebuild templates" — [API index](https://developer.hostup.se/llms.txt) `docs-confirmed`

> "At order time you choose between the following operating systems: Ubuntu 20.04 + 22.04 + 24.04 + 26.04 Debian 11 + 12 + 13 Rocky Linux 8 + 9 + 10 AlmaLinux 8 + 9 + 10 CentOS 10 Stream CentOS 7 (EOL) Windows Server 2019 + 2022 + 2025 (bring your own license, BYOL)" — [VPS hosting FAQ](https://hostup.se/en/vps/) `docs-confirmed`

---

## 7. Network

**One public IPv4 included, IPv6 optional, both movable.** HostUp owns its subnets (RIPE member),
so the address stays with the server.

> "We can also arrange white-label whois by allocating IP addresses through RIPE by agreement." — [VPS hosting FAQ](https://hostup.se/en/vps/) `docs-confirmed`

> "Get your own VPN server for increased privacy by having control over what gets logged. Additionally, we are members of RIPE and own our IP subnets, meaning your IP address stays with the server for as long as you have it." — [VPS hosting](https://hostup.se/en/vps/) `docs-confirmed`

> "Every public IP address at Hostup can be moved between your VPS." — [Move an IP address](https://hostup.se/en/support/reserved-ip/) `docs-confirmed`

**Firewall is inbound only.** There is no egress allowlist and no way to switch the internet off.

> "The firewall in the client area stops incoming traffic before it reaches your VPS." — [Firewall for your VPS](https://hostup.se/en/support/vps-firewall/) `docs-confirmed`

> "The firewall only covers incoming traffic." — [Firewall for your VPS](https://hostup.se/en/support/vps-firewall/) `docs-confirmed`

**Bandwidth is a hard monthly cap, not an overage bill.** Inbound and outbound count together; when
the allowance is gone the server cannot start until you buy more capacity or the period resets.

> "Inbound and outbound traffic count together." — [Bandwidth on your VPS](https://hostup.se/en/support/vps-bandwidth/) `docs-confirmed`

> "If the bandwidth runs out, the server cannot be started or restarted until you buy more or the next period starts." — [Bandwidth on your VPS](https://hostup.se/en/support/vps-bandwidth/) `docs-confirmed`

**Port 25 is closed by default**, with a mail relay offered instead, and direct sending needs an
annual plan or BankID verification.

> "Outgoing traffic on port 25 is closed on every VPS." — [Open port 25](https://hostup.se/en/support/open-port-25/) `docs-confirmed`

**Private networking** exists (VLAN, one /24 included) but has a one-time account fee:

> "A private network gives your servers private IP addresses on a VLAN of their own, separate from other customers." — [Private network between your VPS](https://hostup.se/en/support/private-networks/) `docs-confirmed`

> "Private networking has a one-time fee per account." — [Private network between your VPS](https://hostup.se/en/support/private-networks/) `docs-confirmed`

**DDoS scrubbing** is included and can be switched on per address, for 1–24 hours or always.

> "Included scrubbing protection against network-layer (L3/L4) and SYN-flood attacks." — [VPS hosting](https://hostup.se/en/vps/) `docs-confirmed`

---

## 8. Driving it: panel, API, MCP, console

This is HostUp's strongest area for the price. The control panel is a front end for a documented
public API, and there is a remote MCP server so Claude, ChatGPT, Cursor, Claude Code or Codex can
drive the account.

> "383 documented endpoints cover the things you manage in the HostUp dashboard." — [API documentation](https://developer.hostup.se/) `docs-confirmed`

> "Hostup runs a remote MCP server. Add it to Claude, ChatGPT, Cursor, Claude Code or Codex, sign in with your Hostup account, and your assistant can manage your VPS, domains, DNS, web hosting and billing" — [API documentation](https://developer.hostup.se/) `docs-confirmed`

> "The app never makes purchases, reinstalls, restores or cancellations on its own. You confirm those yourself in the client area." — [Connect Claude or ChatGPT](https://hostup.se/en/support/connect-claude-chatgpt-mcp/) `docs-confirmed`

A browser VNC console and a guest-agent "remote commands" path exist, both reachable from the panel
and the API:

> "The console, sometimes called the VNC console, shows your server's screen in the browser." — [The console (VNC)](https://hostup.se/en/support/vps-console/) `docs-confirmed`

> "The command runs as root with full access." — [Run commands on your VPS](https://hostup.se/en/support/remote-commands/) `docs-confirmed`

**No CLI and no SDKs.** The documented ways in are the panel, the REST API, the OpenAPI spec and the
MCP server. Site search for a command-line tool or a Python/TypeScript SDK returns only the API and
MCP pages. The API exposes a console session and a one-shot guest-agent command, but no streaming
PTY and no file-transfer endpoints; files move over SSH/SFTP.

**No preinstalled agents and no application templates on the VPS.** The order flow offers an
operating system and nothing else; the "250+ apps via Softaculous" on the home page belong to cPanel
web hosting.

> "Our control panel allows for effortless one-click installation of over 250 applications. #### 1-Click Installs 250+ apps via Softaculous #### cPanel Control" — [Home page](https://hostup.se/en/) `docs-confirmed`

---

## 9. Accounts, teams, security and company

**Team access without SSO.** Colleagues get their own sign-in with per-service permissions, or an
agency gets delegated access; there is an audit log with 90 days of history and CSV export. Sign-in
is BankID, Google or email plus password, with six second factors — no SAML/SSO.

> "Invite colleagues to the account with granular permissions instead of sharing login credentials." — [Security](https://hostup.se/en/security/) `docs-confirmed`

> "They get their own sign-in to your account and only see what you choose." — [Give colleagues or an agency access](https://hostup.se/en/support/give-others-access/) `docs-confirmed`

> "The Audit Log shows what has been done on the account and when." — [Active sessions and audit log](https://hostup.se/en/support/sessions-and-activity-log/) `docs-confirmed`

> "Swedish BankID is built natively into the control panel. Prefer something else? Google sign-in and email with password are also available" — [Security](https://hostup.se/en/security/) `docs-confirmed`

**No hard spend cap.** Cost Management shows spend, a forecast and alerts; nothing stops a purchase.

> "The bell (Alerts) next to Budget Used sets up alerts for your costs. They are only shown on this page. The settings are not saved to your account." — [Costs and VAT](https://hostup.se/en/support/costs-and-vat/) `docs-confirmed`

> "A higher limit costs nothing by itself. You only pay for what you actually use." — [Request higher Cloud resource limits](https://hostup.se/en/support/request-higher-limits/) `docs-confirmed`

**Company.** Hostup AB, reg. no. 559290-1325, founded 2019, Swedish-owned, no VC, own hardware in
Älvsjö.

> "Hostup AB is a 100% Swedish-owned internet company with our own hardware and network in Älvsjö, Stockholm." — [About us](https://hostup.se/en/about-us/) `docs-confirmed`

> "The company was founded in 2019 by David Berndtsson, who is still CEO and principal owner." — [About us](https://hostup.se/en/about-us/) `docs-confirmed`

> "Hostup AB, reg. no. 559290-1325, Mässvägen 4, 125 30 Älvsjö, Sweden." — [Terms of service §18.1](https://hostup.se/legal/terms-of-service-en.pdf) `docs-confirmed`

**SLA is business-only.** 99.9% a month with 10/25/50% credits, and a private customer gets none of
it.

> "This SLA applies to Business Customers' paid VPS and web hosting." — [Terms of service §20.1](https://hostup.se/legal/terms-of-service-en.pdf) `docs-confirmed`

> "Hostup's target is 99.9% availability per calendar month." — [Terms of service §20.2](https://hostup.se/legal/terms-of-service-en.pdf) `docs-confirmed`

**Status page** is public and current:

> "99.992% uptime over 90 days" — [HostUp Status](https://status.hostup.se/) `docs-confirmed`

**DPA** applies automatically, no signature:

> "Yes. The Data Processing Agreement covers all our services and applies to every customer automatically, with no signature" — [VPS hosting FAQ](https://hostup.se/en/vps/) `docs-confirmed`

**No SOC 2.** The security page lists GDPR, Swedish physical security classes and a DPA; a SOC 2
report is not mentioned anywhere I could find. `not-published`.

**Not open source.** The platform is proprietary; the WHMCS reseller module is open source but that
is a client, not the service.

---

## 10. Use cases — disposition for all ten

HostUp is a plain VPS with no application templates, so every route is `manual` with
`noTerminal: no`. What changes between them is whether the machine shape and the price suit the job.

| Use case | Tier | noTerminal | Disposition |
|---|---|---|---|
| `hermes-agent` | manual | no | Install Hermes over SSH on VPS XS ($5.72/mo, 2 vCPU / 4 GiB / 50 GB). Cheap and always-on; no template, no managed update. No pick. |
| `openclaw` | manual | no | Same shape. Node install and channel pairing are terminal work. No pick. |
| `coding-agent` | manual | no | VPS SM ($11.55/mo, 4 vCPU / 8 GiB / 100 GB) fits Claude Code or Codex. Stopping between sessions still bills the month, so it suits someone who works most days. No pick. |
| `code-interpreter` | manual | no | Possible but wrong-shaped: the API creates whole monthly servers, not per-run sandboxes, and there is no snapshot-with-memory. A build-it-yourself route only. |
| `browser-agent` | manual | no | A headless Chromium runs on VPS SM, but there is no browser product, no desktop streaming and no per-session isolation. No pick. |
| `workflow-automation` | manual | no | n8n on VPS XS or SM via Docker; must stay awake for webhooks and cron. Always-on is what a monthly plan is good at. No pick. |
| `chat-bot` | manual | no | VPS Nano ($4.08) or XS for a Discord/Slack gateway. No sleep, so the connection stays up. Reasonable budget option, no pick. |
| `claude-code-team` | manual | no | One VPS SM per developer, or one bigger box with separate logins. No SSO and no per-user isolation from the panel. No pick. |
| `scheduled-scraper` | manual | no | Cron inside the VM works, but a monthly plan bills through the idle hours; a per-task sandbox is cheaper for four runs a day. No pick. |
| `mcp-server` | manual | no | VPS Nano is the cheapest always-on public address here ($4.08/mo); point DNS at it and terminate TLS yourself. No pick. |

**Picks and situation picks: none.** HostUp is competent and cheap, but nothing it does is the best
answer among the 19 listed providers: it is not the cheapest per task, it has no one-click agent
route, no fork, no GPU and one region. The honest recommendation is to mention it as a budget
EU-resident option in prose, not to add a pick. `routes.json` records that decision per use case and
an empty `picks`/`situationPicks` list.

---

## 11. A, B and C

Full arithmetic is in `abc.md`. Headline, hand-worked from the pages above and priced in HostUp's own
USD display:

| Case | Shape chosen | Plan | Hand-worked | Engine |
|---|---|---|---:|---:|
| A | 2 vCPU / 4 GiB / 10 GiB, 1,000 × 10 min, deleted each run | VPS XS | **$5.72** | $5.72 |
| B | 4 vCPU / 8 GiB / 50 GiB, 730 h | VPS SM | **$11.55** | $11.55 |
| C | 2 vCPU / 4 GiB / 20 GiB, 90 running + 640 stopped | VPS XS | **$5.72** | $5.72 |

The card treats all three as ex-VAT, following HostUp's price calculator; its cart labels the same
total "inc. VAT", so the VAT question is recorded as a contradiction in §2 and §12. If the calculator
is right, a Swedish private customer pays 25% more: $7.15, $14.44, $7.15.

---

## 12. Contradictions and loose ends in HostUp's own material

1. **Endpoint count.** The home page says "336 documented endpoints", the VPS page says "over 300
   endpoints", the developer page says "383 documented endpoints", and the support index says
   "300+ API endpoints". Same product, four numbers. The model says "300+" and quotes 383 where a
   figure is needed; the count is not used for any verdict.
2. **Mail relay vendor.** The VPS page still advertises "MailChannel's Smart Host", while the status
   page announced on 2026-10-08 that outgoing mail moved to "our own mail relay". Consequence: the
   relay exists either way; the vendor name is stale.
3. **Object storage date.** The About timeline still says "March 2026 (ETA) S3 storage launches",
   seven months after that date, and no S3 product appears in the panel, the API index or the order
   flow. Treated as not launched; the row is `not-published` rather than `yes`.
4. **"Dedicated resources" vs a 50% CPU cap.** The VPS page sells each guest "its own resources" and
   the marketing says "dedicated", while the support guide caps sustained CPU at half the vCPUs.
   Both are true in the narrow sense (the vCPUs are allocated, not shared) but a reader planning a
   long build should read the cap. The model uses the support guide.
5. **PAYG rates.** The API reference shows example hourly rates that look like a real tariff. They
   are labelled "Example" and are not reachable without an eligible account, so they are not used.
6. **`hostup.se` blocks plain `curl`** (HTTP 403 to a normal user agent) while `cloud.hostup.se`
   answers a plain `curl` with JSON. This is why rendered fetches were used for the marketing site
   and a direct call for the product API.
7. **VAT is "excl." on one page and "inc." on another.** The price calculator puts VAT on a separate
   line under "Subtotal (excl. VAT)"; the cart labels the same €4.90 total "inc. VAT". Both are
   first-party. The card follows the calculator and says so; the alternative reading is recorded in
   §2 and in the caveat. This is the one contradiction that moves every number in the card by 25%,
   so it should be settled with HostUp before publication.

## 13. Unknowns

- **Hourly PAYG rates.** Real per-core-hour, per-GiB-hour and per-GB bandwidth figures are only
  visible to a verified account with SEK 2,000 of prior payments. `not-published` publicly.
- **Nested virtualisation.** No page, support guide or API field mentions it. `not-published`.
- **Extra IPv4 and reserved-IP prices.** Both exist and are charged; both prices are shown only in
  the portal. `not-published`.
- **Snapshot storage price.** Snapshots are included in slots; no separate storage rate is published.
- **SOC 2 / ISO 27001.** Neither is claimed. `not-published`.
- **Headcount, revenue, funding.** Only "100% Swedish-owned", "no VC", founder and 2019 are stated.
- **Object storage.** Listed as an ETA, not orderable; whether it shipped is unresolved.
- **Windows licence cost.** BYOL; not in the price.

## 14. How the tariff fits the engine

The standard product is a whole monthly plan, so `pricing.json` uses `monthlyPlans: true` with a
`monthly` price on each shape and no `hourly` and no `cpu`/`ram` rates. That makes the engine bill
each machine one plan per month, and in tasks mode bill as few plans as the run-hours need
(`ceil(hours / 730)`), which is exactly how A behaves: 166.67 hours of tasks on one XS plan.

`billedWhileStopped` is **not** set, because the monthly-plan branch already charges the full plan
regardless of stopped hours; setting it as well would double-count. C's 640 stopped hours are
covered by the plan, and the card's note says so.

`wholeHours`, `minimumPerRun` and `perMachine` are not used: there is no hourly meter on the standard
product, no per-run minimum, and the primary IPv4 is included. Extra IPv4s and reserved IPs are
charged but unpublished, so they are described in `notes`, not modelled.

`disk.extraMonthly` is set to $0.0642, which is HostUp's 0.55 SEK per GB-month of extra NVMe at the
same display conversion. Without it the card would call a workload that asks for more disk than its
shape carries infeasible, when in fact HostUp sells the extra disk on the same server. A probe of
B with 300 GiB of disk picked VPS SM plus 200 GiB and printed $24.39 ($11.55 + 200 × $0.0642).

`egress.perGiB` is `null` rather than a number: HostUp has no metered per-GiB overage. The allowance
is a hard cap and extra capacity is bought in 1 TB steps at 10 SEK a month. Putting a per-GiB figure
there would describe a meter that does not exist.

**No engine change is needed.**

---

## 15. Retrieval log and quote check

Successful tools, in order:

| # | Tool | What it did |
|---|---|---|
| 1 | TinyFish `fetch_content` (`ttl: 0`) | `hostup.se/en/`, `/en/vps/`, `/en/pricecalculator/`, `/en/support/`, plus `/en/vps/?currency=USD`, `?currency=SEK` |
| 2 | TinyFish `fetch_content` | 33 VPS support guides across six batches (order, hourly, disks, bandwidth, IPs, firewall, backups, snapshots, console, remote commands, ISO, RDP, limits, volumes, teams, API, MCP, monitoring, VAT, billing) |
| 3 | TinyFish `fetch_content` | `/en/legal/`, `/en/about-us/`, `/en/security/`, `/en/vps/high-availability/`, `/en/blog/vps-vs-web-hosting/`, `status.hostup.se` |
| 4 | TinyFish `fetch_content` | `developer.hostup.se/`, `developer.hostup.se/llms.txt`, two endpoint reference pages |
| 5 | Firecrawl `firecrawl_scrape` (PDF parser, `maxAge: 0`) | `hostup.se/legal/terms-of-service-en.pdf`, read in two passes |
| 6 | Firecrawl `firecrawl_scrape` (`maxAge: 0`, `waitFor`) | `cloud.hostup.se/cart/en/vps` and `…/vps/xs` for the rendered cart and add-on prices |
| 7 | `curl` | `https://cloud.hostup.se/api/v2/products/vps` (200, no auth) |
| 8 | Firecrawl `firecrawl_search` | 8 queries for GPU, Docker, nested virt, OpenClaw/Hermes, CLI and SDK; used for absence checks only |

Failed or unusable: `curl https://hostup.se/en/support/` and `curl https://developer.hostup.se/openapi.json`
both returned **403** to a plain client; `https://hostup.se/en/support/volumes/` and
`…/higher-limits/` are 404 (correct slugs are `block-storage-volumes` and `request-higher-limits`).
No Composio integration had to be reconnected, and no fallback to Amp's native web tools was needed.

Quote check: every quote in `feature-rows.json` and `capability-rows.json`, plus every quote in the
`company` facts and contradiction evidence in `provider.json` — **106 quotes across 31 URLs** — was
re-fetched on 2026-10-30 and matched mechanically: **106 of 106 pass, 0 fail**.

Method: the pages were re-read through a headless Chromium session (`agent-browser read`), because
`hostup.se` answers Cloudflare's "Just a moment…" challenge to `curl` and to TinyFish on some paths;
the terms PDF was downloaded and its text extracted with pypdf. Matching normalised the text by
stripping Markdown emphasis, code and heading markers, replacing `[text](url)` links with their text,
folding the PDF ligatures ﬀ ﬁ ﬂ ﬃ ﬄ, converting typographic quotes and apostrophes to ASCII,
replacing non-breaking spaces and collapsing whitespace, then lower-casing both sides. No wording,
number or qualifier was altered in any saved quote. The three initial failures were all normalisation
artefacts (a `ﬃ` ligature in the PDF's "office", a Markdown link around "VPS" in the order guide, and
a heading marker between "March 2026 (ETA)" and "S3 storage launches"); the last was fixed by
shortening the quote to the date alone rather than by loosening the check.

Cost engine: `price()` from `site/src/lib/cost.ts` was run against `pricing.json` with
`presets.a/b/c` and returned $5.72 (VPS XS), $11.55 (VPS SM) and $5.72 (VPS XS), feasible, matching
the hand-worked totals exactly. Two boundary probes (800 h of tasks → two plans, $11.44; B with
300 GiB of disk → VPS SM plus 200 GiB, $24.39) also behaved as the tariff says.


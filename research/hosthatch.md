# HostHatch — research ledger

Provider ID `hosthatch`, kind `vps`. Desk research only: no account was created, no credential used
and no server started. Research date **2026-11-04** (Asia/Kolkata). Repository `WyrdWerk/sandbox-guide`,
`origin/main` at `38f711c`; the worktree was clean apart from these new files under
`research/incoming/hosthatch/`.

Scope: all 16 features, all 78 capability IDs, all 10 use cases, a rate card, hand-worked A/B/C and a
docs map. The shared site JSON was not edited, and nothing was committed or pushed.

## Verdict summary

- **Capabilities (78):** 29 yes, 2 partly, 40 no, 7 not-published.
- **Features (16):** 5 yes, 9 partly, 2 no, 0 not-published.
- **Use cases (10):** all 10 recorded as manual terminal routes, 0 picks.
- The two `partly` capabilities are `web-terminal` (VNC/serial console rather than a terminal
  multiplexer) and `scoped-keys` (keys cannot be limited to one project).

## Evidence ledger

Every quote below was read from the live page on 2026-11-04. Where a quote is stored in JSON with
line breaks collapsed, the only normalization is whitespace. `docs-confirmed` means first-party
documentation, `pricing-page` a money page, `third-party` an outside source, `inferred` a conclusion
drawn from the named evidence, `not-published` an unanswered question.

| Key | Claim it supports | URL | Verbatim quote | Tag |
|---|---|---|---|---|
| E1 | 16 advertised locations; fixed compute plans | https://hosthatch.com/products | "Deploy in 16 edge locations" | docs-confirmed |
| E2 | The entry plans are fair-share CPU | https://hosthatch.com/products | "1 AMD EPYC core ( fair share )" | docs-confirmed |
| E3 | A 16-core / 96 GB plan exists | https://hosthatch.com/products | "16 AMD EPYC cores ( 8 dedicated, 8 fair-shared cores )" | docs-confirmed |
| E4 | Storage VMs scale to hundreds of TB | https://hosthatch.com/products | "our storage VMs are designed for massive storage capacity, scalable up to hundreds of terabytes" | docs-confirmed |
| E5 | The cheapest plan is $4 a month | https://hosthatch.com/ | "Our smallest plan costs $4 per month" | docs-confirmed |
| E6 | Root access | https://hosthatch.com/ | "You have full root-level access to your VMs." | docs-confirmed |
| E7 | Provisioning time | https://hosthatch.com/ | "Get online within 60 seconds." | docs-confirmed |
| E8 | Own ISO install on a full VM | https://hosthatch.com/features | "You can also upload your own ISO image using our control panel, and deploy it on your VMs with us, just like you would on a bare-metal or a physical server." | docs-confirmed |
| E9 | Only OS templates, no app templates | https://hosthatch.com/features | "We offer pre-ready cloud templates for the major Linux distributions." | docs-confirmed |
| E10 | The panel is proprietary in-house software | https://hosthatch.com/features | "In 2017, we launched our own control panel" | docs-confirmed |
| E11 | Only two product lines, no GPU or object storage | https://hosthatch.com/company | "We sell only two types of no-frills IaaS - Compute and Storage" | docs-confirmed |
| E12 | Own hardware in 16 data centres | https://hosthatch.com/company | "We have our own equipment in 16 data centers around the world" | docs-confirmed |
| E13 | Billing cycles include monthly and annual | https://hosthatch.com/terms-of-service | "HostHatch will invoice Customer for Fees and Expenses monthly, quarterly, semi-annually or annually." | docs-confirmed |
| E14 | A term renews until cancelled | https://hosthatch.com/terms-of-service | "shall be for 1 month (or any other billing period selected by the customer) and shall renew for the same successive terms until terminated" | docs-confirmed |
| E15 | Bandwidth overage price | https://hosthatch.com/terms-of-service | "Additional bandwidth can be added for $4 per TB by contacting our support." | docs-confirmed |
| E16 | Bandwidth ceiling behaviour | https://hosthatch.com/terms-of-service | "Your server will be rate-limited to 5 Mbps if you reach your bandwidth limit." | docs-confirmed |
| E17 | Conditional 7-day refund | https://hosthatch.com/terms-of-service | "Our virtual private servers (VPS) carry a 7-day money back guarantee with a valid reason requirement." | docs-confirmed |
| E18 | The only interruption remedy is pro-rata | https://hosthatch.com/terms-of-service | "Customer shall also be entitled to a pro-rata refund of any Fees attributable to the interrupted or inoperable Service(s)" | docs-confirmed |
| E19 | CPU-abuse restriction | https://hosthatch.com/terms-of-service | "Any CPU, disk or network abusing software." | docs-confirmed |
| E20 | Port 25 blocked by default | https://hosthatch.com/terms-of-service | "Outbound TCP port 25 (SMTP) is blocked by default in all locations." | docs-confirmed |
| E21 | The API covers the console's operations | https://docs.hosthatch.com/api/ | "The HostHatch API lets your code, scripts and AI agents do what you do in the console: order servers and pay for them with account credit, power and reinstall them, take snapshots, set up firewalls, mount ISOs, and manage SSH keys and reverse DNS." | docs-confirmed |
| E22 | An OpenAPI document exists | https://docs.hosthatch.com/api/ | "The OpenAPI document is at `/api/openapi.json`" | docs-confirmed |
| E23 | Read-only API keys | https://docs.hosthatch.com/api/authentication/ | "A read-only key can send `GET` requests and nothing else" | docs-confirmed |
| E24 | A key spans every project | https://docs.hosthatch.com/api/authentication/ | "A key carries your access to every project you belong to." | docs-confirmed |
| E25 | Projects hold the resources and the people | https://docs.hosthatch.com/api/projects-and-roles/ | "A project holds servers, SSH keys, firewall groups, snapshots, ISOs, actions and orders, and the people who manage them." | docs-confirmed |
| E26 | Three project roles | https://docs.hosthatch.com/api/projects-and-roles/ | "Your role in it: `owner`, `admin` or `member`." | docs-confirmed |
| E27 | A snapshot is disk-only | https://docs.hosthatch.com/api/snapshots/ | "A snapshot is a copy of a server's disk at one moment." | docs-confirmed |
| E28 | A snapshot can seed a new server | https://docs.hosthatch.com/api/snapshots/ | "To create a new server from a snapshot, order a server with its `snapshot_id` instead of an `image`." | docs-confirmed |
| E29 | Snapshots belong to the project, not the server | https://docs.hosthatch.com/api/snapshots/ | "A snapshot belongs to the project: you can restore it onto any of the project's servers, and it stays when the server it was taken from is gone." | docs-confirmed |
| E30 | The snapshot limit is unpublished | https://docs.hosthatch.com/api/snapshots/ | "The project owner's account can hold a limited number of snapshots, across all the owner's projects" | docs-confirmed |
| E31 | Only three server states | https://docs.hosthatch.com/api/servers/ | "`running`, `stopped` or `suspended`" | docs-confirmed |
| E32 | Cancellation runs to the end of the paid term | https://docs.hosthatch.com/api/servers/ | "`end_of_term`: the server runs until the end of the period you paid for, then it is deleted." | docs-confirmed |
| E33 | An upgrade is applied on reboot | https://docs.hosthatch.com/api/servers/ | "The server has changes, such as a new plan, that its next reboot through the API applies." | docs-confirmed |
| E34 | Firewall groups have a direction | https://docs.hosthatch.com/api/firewalls/ | "A group has a direction, chosen when you create it: `ingress` rules allow traffic to the servers, and `egress` rules allow traffic from them." | docs-confirmed |
| E35 | Egress can be restricted | https://docs.hosthatch.com/api/firewalls/ | "Once it has an egress group, it also refuses outbound traffic that no egress rule allows." | docs-confirmed |
| E36 | An empty group refuses traffic | https://docs.hosthatch.com/api/firewalls/ | "A server without groups allows all traffic. Once it has any group attached, it refuses new inbound connections that no ingress rule allows." | docs-confirmed |
| E37 | Public IPv4 is standard | https://docs.hosthatch.com/networking/ | "We support both dynamic (DHCP) and static IPv4 configuration." | docs-confirmed |
| E38 | A routed /64 of IPv6 | https://docs.hosthatch.com/networking/ | "You will be assigned a public /64 IP block." | docs-confirmed |
| E39 | Private networking is a same-region VLAN | https://docs.hosthatch.com/networking/ | "If you enable Private Networking on your VM you will get an additional network interface that you can use for traffic between your own VMs in the same region." | docs-confirmed |
| E40 | Bandwidth counts both directions | https://docs.hosthatch.com/networking/ | "Both incoming and outgoing traffic is counted towards the bandwidth usage of your VM" | docs-confirmed |
| E41 | Cloud-init user data is not available | https://docs.hosthatch.com/api/orders-and-payment/ | "Not available yet: sending it answers `400 feature_unavailable`." | docs-confirmed |
| E42 | One custom ISO per project | https://docs.hosthatch.com/api/isos/ | "A project holds one custom ISO" | docs-confirmed |
| E43 | ISO upload is panel-only for now | https://docs.hosthatch.com/api/isos/ | "Uploads through the API aren't available yet" | docs-confirmed |
| E44 | Billing cycle is a product choice | https://docs.hosthatch.com/api/orders-and-payment/ | "One of the product's `billing_cycles`." | docs-confirmed |
| E45 | No official SDK in the quickstart | https://docs.hosthatch.com/api/quickstart/ | "import requests" | docs-confirmed |
| E46 | Support is by ticket | https://hosthatch.com/contact | "If you are already a customer, we kindly ask you to please submit a ticket by logging in to the client area." | docs-confirmed |
| E47 | A GDPR DPA exists | https://hosthatch.com/privacy-policy | "Our GDPR Data Processing Agreement is available here." | docs-confirmed |
| E48 | Status page and 90-day uptime | https://status.hosthatch.com | "All systems Operational" (overall 99.994% over 90 days on the same page) | docs-confirmed |
| E49 | AS63473 is HostHatch's own | https://bgp.tools/as/63473 | "Registered to: ARIN-HOSTH-2 (arin)" | third-party |
| E50 | Public rating | https://www.trustpilot.com/review/hosthatch.com | "HostHatch Reviews 93 • 2.7" | third-party |
| E51 | Trading since about 2011 | https://lowendtalk.com/discussion/216524/calmly-celebrating-15-years-in-business | "Celebrating 15 years in business" | third-party |
| E52 | Promotional annual prices | https://lowendtalk.com/discussion/216524/calmly-celebrating-15-years-in-business | "$35 per year, $95 per 3 years" | third-party |
| E53 | The features page is stale | https://hosthatch.com/features | "Available to customers in select locations in May 2023." | docs-confirmed |
| E54 | The panel has a VNC console | https://cloud.hosthatch.com/build/assets/vendor.7380af1b.js | "Peregrine.Servers.Console.VncSession" | inferred |
| E55 | Amsterdam is an EU location | https://docs.hosthatch.com/features/ | "Digital Realty AMS18" | docs-confirmed |
| E56 | The docs are written for agents, but there is no MCP server | https://docs.hosthatch.com/api/ | "These docs are written for people and for agents alike." | docs-confirmed |
| E57 | The homepage says 13 locations | https://hosthatch.com/ | "We span across three different continents with our 13 data center locations." | docs-confirmed |
| E58 | US law governs the contract | https://hosthatch.com/terms-of-service | "governed by, and interpreted in accordance with, the substantive laws of the United States." | docs-confirmed |
| E59 | Card data is held by Stripe | https://hosthatch.com/privacy-policy | "any credit card and related information that you provide to us is stored at Stripe, Inc" | docs-confirmed |
| E60 | Non-payment suspends after two days | https://hosthatch.com/terms-of-service | "Invoices which remain unpaid two days after they are due, shall be suspended and after 5 days, terminated and any data stored on the service, completely wiped." | docs-confirmed |
| E61 | A chargeback suspends the whole account | https://hosthatch.com/terms-of-service | "Chargebacks and disputes will lead to suspension of the whole account, including all services that are active under the account." | docs-confirmed |
| E62 | Founded in 2011, US-headquartered | https://www.vpsbenchmarks.com/hosters/hosthatch | "HostHatch was founded as a VPS provider in 2011." | third-party |

### Quote verification

Quotes were checked by fetching each URL live and locating the passage in the rendered text. The
only normalization was collapsing whitespace and Markdown emphasis markers around the words (for
example `**$4.00**` in the page's rendered text is stored as `$4.00`). Two quotes need a note:

- **E48** stores the page's status line; the 99.994% figure is a separate heading on the same page,
  so the claim combines two visible strings rather than one contiguous sentence.
- **E50** stores a heading, count and score that Trustpilot renders on separate lines; whitespace
  was collapsed to `HostHatch Reviews 93 • 2.7`.
- **E54** is a class name inside a public JavaScript bundle, not prose. It proves the panel ships a
  VNC session component, not that the console is documented or available on every plan.

## Feature findings

### isolation — yes

A full VM with its own kernel, root and an ISO installer (E6, E8). HostHatch never names the
hypervisor; the evidence for a real VM is the ISO install, the "just like … a physical server"
wording and the guest's own kernel, so this is a full-VM inference rather than a documented KVM
claim. The entry plans are fair-share CPU (E2), so isolation is strong but CPU dedication is not.

### sizes-regions — partly

Ten fixed compute plans and eight storage plans, no custom CPU/RAM mix (E1, E3, E4). The location
count is the catch: 16 on the product page (E1), 16 data centres on the company page (E12), 14 rows
in the docs matrix, 13 monitored networks on the status page, and 13 on the homepage (E57). Madrid,
Milan and Warsaw appear in the site's product data but not in the docs matrix; Seoul appears in the
docs matrix but not in the product data. A buyer should confirm the city at checkout.

### lifecycle — partly

Power on, shutdown, power off, reboot and reinstall are API actions; the only states are running,
stopped and suspended (E31). A stop is a power-off, so memory and processes are lost, and the term
keeps billing (E14, E32). No pause, hibernate or fork.

### snapshots-forks — partly

Disk snapshots, project-owned, restorable to any server in the project and usable as the image for a
new server (E27, E28, E29). No memory snapshot, no live fork, an unpublished account limit (E30) and
no published snapshot price. Automated backups are not sold: the features page still lists them as
upcoming in 2023 (E53) and nothing in the current API or panel offers them, so `backups` is
`not-published` rather than a confident no.

### storage — partly

Local NVMe on compute plans (10–250 GB) and RAID-10 HDD on the storage line (1–10 TB) (E4). Files
survive a stop and the disk can grow on an upgrade. There is no detachable volume, no shared volume
and no object storage (E11), so storage cannot outlive the server.

### idle-timers — yes

Nothing sleeps the machine: the only states are running, stopped and suspended (E31), and the API's
power actions are all manual. No idle timeout, wake trigger or session cap exists. The trade is that
idle hours bill like busy ones.

### reaching-it — yes

Public IPv4 by default (E37), a routed /64 of IPv6 (E38), real SSH, any TCP/UDP port through a
firewall group (E34), a same-region private VLAN (E39) and a VNC/serial console in the panel (E54).
No private or tokenised URL and no managed tunnel.

### custom-domains — partly

You point your own DNS at the static IPv4 or the IPv6 block (E37, E38). HostHatch does not host DNS
zones and does not issue certificates: the API's DNS surface is reverse DNS only, so TLS and the
reverse proxy are yours.

### outbound-network — yes

1–20 TB included, inbound and outbound counted together (E40), with a 5 Mbps throttle at the ceiling
(E16) and $4 per TB for more (E15). Egress firewall groups can restrict destinations (E35) or block
outbound entirely (E36). The primary IPv4 is static, and BYOIP with BGP is available.

### keys-secrets — partly

API keys can be read-only (E23) and can expire, and project roles limit what a person may do (E26).
A key cannot be scoped to one project: it carries access to every project you belong to (E24). There
is no secret store and no request-signing proxy, and cloud-init user data is not available (E41), so
an agent's key must live on the machine where the agent can read it.

### ways-to-drive — yes

A documented REST API with an OpenAPI document (E21, E22), idempotency keys, stable error codes,
read-only keys and a quickstart (E45). No official CLI, Python or TypeScript SDK, no MCP server and
no PTY or file endpoint. The docs are explicitly written for agents (E56), but that is documentation,
not an MCP integration.

### built-in-agents — no

Only Linux distribution templates and your own ISO (E9). No Hermes, OpenClaw, n8n or Docker template,
no coding agent in any image, no prompt endpoint, no hosted browser and no managed desktop.

### teams-accounts — partly

Projects with owner, admin and member roles (E25, E26), read-only API keys (E23) and 2FA sign-in.
No SAML/OIDC single sign-on, no audit log and no hard spending cap.

### company — partly

HostHatch LLC in Tampa, Florida, trading since 2011 (E62; the company's own April 2026 post
celebrated 15 years, E51), privately funded, with its own
hardware (E12) and its own ARIN-registered network AS63473 (E49). A public status page showed
99.994% over 90 days (E48) and a GDPR DPA exists (E47). Against that: no SLA (E18 is a warranty
remedy, not an uptime promise), ticket-only support (E46), Trustpilot at 2.7 from 93 reviews (E50),
no SOC 2 or ISO 27001 claim, and its own promotional post warns that support can take days on promo
plans. US law governs the contract (E58).

### billing-models — partly

Monthly, quarterly, semi-annual or annual invoicing (E13), with the product page quoting a monthly
price (E5). No hourly or per-second meter, no cheaper stopped rate (E32), and a stopped server keeps
billing (E14). Flat monthly prices from $4 to $69 for compute.

### trials-free-tiers — no

No free tier, trial or starting credit. The only safety net is the conditional 7-day refund (E17).
The accepted payment methods are not published before signup; the privacy policy only says card data
is held by Stripe (E59), which is why `no-card` is `not-published` rather than yes or no.

## Capability coverage

Every row below is in `capability-rows.json` with its own source and note; the key points to the
ledger entry that carries the quote.

| Capability | Verdict | Evidence | Why |
|---|---|---|---|
| own-vm | yes | E8 | Full VM, own kernel, own ISO |
| root | yes | E6 | Root over SSH and a reset action |
| docker-inside | yes | E8 | Full VM with root; install Docker yourself |
| nested-virt | not-published | E9 | No mention anywhere in site or docs |
| custom-image | yes | E8, E42, E43 | Own ISO in the panel, one per project |
| any-size | no | E2 | Ten fixed CPU/RAM bundles |
| big-machines | yes | E3 | 16 cores / 96 GB / 250 GB |
| live-resize | no | E33 | Upgrade applies on reboot |
| gpu | no | E11 | Compute and Storage only |
| choose-region | yes | E1 | Location chosen at order |
| eu-region | yes | E55 | Amsterdam, Stockholm, Vienna, Madrid, Milan |
| pause-memory | no | E31 | Only running, stopped, suspended |
| warm-pool | no | E7 | Provisioned per order |
| fast-start | no | E7 | About 60 seconds |
| snapshot-files | yes | E27 | Disk snapshot |
| snapshot-memory | no | E27 | Disk only |
| fork-running | no | E28 | Cold snapshot, then new server |
| older-snapshot | yes | E29 | Kept until deleted |
| templates | yes | E28 | Snapshot used as an image |
| backups | not-published | E53 | Only a stale 2023 promise |
| files-survive-stop | yes | E32 | Disk stays with the server |
| volumes | no | E11 | No block-storage product |
| shared-volume | no | E39 | VLAN, not a shared filesystem |
| mount-buckets | no | E11 | No object storage |
| big-disk | yes | E4 | 10 TB storage VM |
| stay-on | yes | E32 | Runs for the paid term |
| choose-idle | no | E31 | No idle timer |
| wake-on-request | no | E31 | Nothing sleeps |
| schedules | no | E21 | No provider scheduler |
| public-url | yes | E37 | Public IPv4 and any port |
| private-url | no | E39 | No tokenised URL |
| ssh | yes | E6 | Normal sshd |
| web-terminal | partly | E54 | VNC/serial console, not a multiplexer |
| tunnel | yes | E6 | ssh -L works |
| raw-tcp | yes | E34 | Any protocol and port |
| custom-domain | yes | E37 | A record to the static IP |
| auto-https | no | E21 | No certificate product |
| egress-included | yes | E15, E40 | 1–20 TB included |
| egress-allowlist | yes | E35 | Egress firewall groups |
| no-internet | yes | E36 | Empty ingress and egress groups |
| static-ip | yes | E37 | Static primary IPv4 |
| secrets-store | no | E41 | No vault; cloud-init unavailable |
| hidden-secrets | no | E6 | Root reads everything |
| scoped-keys | partly | E24 | Read-only and expiring, but account-wide |
| dashboard-create | yes | E21 | Peregrine panel |
| cli | no | E22 | No official CLI |
| python-sdk | no | E45 | No official SDK |
| ts-sdk | no | E22 | No official SDK |
| rest-api | yes | E21, E22 | Versioned REST API and OpenAPI |
| mcp-server | no | E56 | No MCP endpoint |
| pty | no | E21 | No exec endpoint |
| file-api | no | E21 | No file endpoint |
| agents-preinstalled | no | E9 | OS images only |
| prompt-api | no | E21 | No agent runtime |
| one-click-hermes | no | E9 | No template |
| one-click-openclaw | no | E9 | No template |
| browser | no | E9 | No browser image |
| desktop | no | E8 | Install your own, view via VNC |
| hosts-other-agents | no | E9 | Not named by any agent platform |
| team-workspace | yes | E25 | Projects and members |
| roles | yes | E26 | Owner, admin, member |
| sso | not-published | E46 | Email + password + 2FA only |
| spend-cap | no | E13 | No cap; prepaid terms only |
| usage-alerts | not-published | E31 | No alert setting documented |
| audit-log | not-published | E21 | Actions list, no account audit log |
| per-second | no | E13 | Monthly plans |
| active-cpu | no | E5 | Whole plan, not CPU time |
| cheap-pause | no | E32 | Stop still bills |
| no-monthly-fee | no | E5 | Monthly plan only |
| flat-price | yes | E5 | $4–$69 flat |
| free-tier | no | E17 | None |
| free-credit | no | E17 | None |
| no-card | not-published | E59 | Payment methods unstated |
| status-page | yes | E48 | Public status page |
| sla | no | E18 | No uptime promise |
| soc2 | not-published | E47 | DPA only, no audit report |
| dpa | yes | E47 | GDPR DPA PDF |
| open-source | no | E10 | Proprietary panel |

## Contradictions

### 1. How many locations?

- Product page: "Deploy in 16 edge locations" (E1).
- Company page: "We have our own equipment in 16 data centers around the world" (E12).
- Homepage: "We span across three different continents with our 13 data center locations." (E57).
- Docs matrix: 14 rows (Amsterdam, Chicago, Hong Kong, London, Los Angeles, New York, Oslo, Seoul,
  Singapore, Stockholm, Sydney, Tokyo, Vienna, Zurich).
- Status page: 13 monitored networks (the docs list minus Seoul).
- Site product data: 16 keys, adding Madrid, Milan and Warsaw and omitting Seoul.

Interpretation used: **16 advertised locations**, with a note that the docs matrix and status page
list fewer. Consequence: a reader who needs Madrid, Milan, Warsaw or Seoul must check the order form;
the guide does not promise any of them.

### 2. "Dedicated CPU allocations" vs "fair share"

The products page introduces the line as "High performance compute VMs, with dedicated CPU
allocations" but the same page labels the 2, 4 and 8 GB plans "1 AMD EPYC core ( fair share )" and
"2 AMD EPYC cores ( fair share )" (E2). Only the 12 GB plan and above include a dedicated core.
Interpretation: dedicated cores start at $12 a month; the $4–$9 plans are fair-share.

### 3. The features page is three years stale

The page's "Upcoming Features" block says snapshots are "Available to customers in select locations
in May 2023" (E53), backups in May 2023, block storage in June 2023 and a user API "coming". The API
and snapshots now exist and are documented; backups and block storage do not appear anywhere in the
current docs, API or panel. Interpretation: treat the features page as marketing history, not a
product list.

### 4. Storage VMs: 8 locations advertised, 4 listed

The products page says "Available in 8 strategic locations", but the site's own plan data lists only
Amsterdam, Stockholm, Los Angeles and Chicago for every storage plan. The April 2026 promotional post
also lists Chicago, Los Angeles, Singapore, Sydney and Hong Kong for storage. Consequence: the 10 TB
storage plan may not be orderable where a reader expects.

### 5. Monthly price vs the checkout

The product page labels every price "/ month" and the terms allow monthly invoicing, but the order
form's per-cycle prices are behind the login. This is an unknown, not a contradiction: the card uses
the published monthly price and records that a multi-month discount, if any, is unpublished.

## Unknowns

1. **The monthly-billed checkout total.** The $4–$69 list is the published monthly price; the
   per-cycle prices at checkout are not observable without an account.
2. **The snapshot limit and any snapshot charge.** The API only says "a limited number" (E30).
3. **Whether backups exist at all.** No current documentation, API or panel feature; the only
   mention is the stale 2023 promise (E53).
4. **The current extra-IPv4 price.** The API documentation's $2.00 example is labelled an
   illustration, not a rate.
5. **Payment methods, VAT treatment and whether a card is required at signup.**
6. **The fair-share CPU threshold and whether a 50%-busy agent is within it.**
7. **Nested virtualisation.** Nothing published.
8. **SOC 2 or ISO 27001.** Nothing published; a DPA exists.
9. **Audit logging and usage alerts.** Neither is documented.
10. **Data-centre-level redundancy per location.** The company claims redundant upstreams and a
    standardised build, but per-location N+1 details are not published.

## A, B and C

Worked by hand in `abc.md`: **A $6.00, B $12.00, C $6.00**, matching `price()` on the card exactly
(plan, shape, feasibility and total). The card is `monthlyPlans: true`, `between: "kept"`, with ten
fixed shapes. Boundary checks: 4,380 ten-minute tasks (exactly 730 h) print $6.00 and 4,381 print
$12.00; B with 300 GiB prints $69.00 but is marked infeasible because the largest plan is 250 GiB.

## Use cases

All ten are manual routes with `noTerminal: "no"` and no picks: HostHatch has no application
templates, no prompt API and no managed TLS. The cheapest shapes per use case are in `routes.json`:
$4 for a bot, scraper or MCP server; $6 for Hermes, OpenClaw, n8n or a code interpreter; $9–$12 for a
browser agent or a coding agent; $60 for five coding-agent machines. Adding HostHatch does not change
any one-click count or any existing pick.

## Retrieval log

| Tool | URL or query | Result |
|---|---|---|
| TinyFish `fetch_content` (ttl 0) | https://hosthatch.com | Success |
| TinyFish `fetch_content` (ttl 0) | https://hosthatch.com/products | Success |
| TinyFish `fetch_content` (ttl 0) | https://hosthatch.com/features | Success |
| TinyFish `fetch_content` (ttl 0) | https://hosthatch.com/company | Success |
| TinyFish `fetch_content` (ttl 0) | https://hosthatch.com/terms-of-service | Success |
| TinyFish `fetch_content` (ttl 0) | https://hosthatch.com/acceptable-use-policy | Success |
| TinyFish `fetch_content` (ttl 0) | https://hosthatch.com/privacy-policy | Success |
| TinyFish `fetch_content` (ttl 0) | https://hosthatch.com/hosthatch-gdpr-dpa.pdf | Success (PDF text) |
| TinyFish `fetch_content` (ttl 0) | https://hosthatch.com/contact | Success |
| TinyFish `fetch_content` (ttl 0) | https://hosthatch.com/location/ams, /sto, /benchmarks | Success; placeholder/lorem ipsum content |
| TinyFish `fetch_content` (ttl 0) | https://docs.hosthatch.com | Success |
| TinyFish `fetch_content` (ttl 0) | https://docs.hosthatch.com/features/ | Success |
| TinyFish `fetch_content` (ttl 0) | https://docs.hosthatch.com/networking/ | Success |
| TinyFish `fetch_content` (ttl 0) | https://docs.hosthatch.com/api/ | Success |
| TinyFish `fetch_content` (ttl 0) | https://docs.hosthatch.com/api/authentication/ | Success |
| TinyFish `fetch_content` (ttl 0) | https://docs.hosthatch.com/api/projects-and-roles/ | Success |
| TinyFish `fetch_content` (ttl 0) | https://docs.hosthatch.com/api/servers/ | Success |
| TinyFish `fetch_content` (ttl 0) | https://docs.hosthatch.com/api/actions/ | Success |
| TinyFish `fetch_content` (ttl 0) | https://docs.hosthatch.com/api/orders-and-payment/ | Success |
| TinyFish `fetch_content` (ttl 0) | https://docs.hosthatch.com/api/snapshots/ | Success |
| TinyFish `fetch_content` (ttl 0) | https://docs.hosthatch.com/api/changelog/ | Success |
| TinyFish `fetch_content` (ttl 0) | https://docs.hosthatch.com/api/quickstart/ | Success |
| TinyFish `fetch_content` (ttl 0) | https://docs.hosthatch.com/legacy-api/ | Success |
| curl | https://docs.hosthatch.com/llms-full.txt | Success; 228,944 bytes, searched locally |
| curl | https://hosthatch.com/js/app.js | Success; plan data and 16 location keys |
| curl | https://cloud.hosthatch.com/build/assets/vendor.7380af1b.js | Success; VNC/serial console class names |
| curl | https://cloud.hosthatch.com/api/v1/products?prices | 302 to login; no public price list |
| curl | https://cloud.hosthatch.com/order, /cart, /store, /products | 200 SPA shell that redirects to login |
| Context `web_scrape` (maxAgeMs 0) | https://hosthatch.com/products | Success; second fresh read of the plan table |
| Context `web_scrape` (maxAgeMs 0) | https://hosthatch.com/ | Success |
| Context `web_scrape` (maxAgeMs 0) | https://status.hosthatch.com | Success; 99.994% over 90 days |
| Context `web_scrape` (maxAgeMs 0) | https://www.trustpilot.com/review/hosthatch.com | Success; 93 reviews, 2.7 |
| TinyFish `fetch_content` (ttl 0) | https://www.trustpilot.com/review/hosthatch.com | Failed, HTTP 403; Context succeeded |
| TinyFish `fetch_content` (ttl 0) | https://bgp.tools/as/63473 | Success |
| TinyFish `fetch_content` (ttl 0) | https://www.vpsbenchmarks.com/hosters/hosthatch | Success; founding year and HQ |
| TinyFish `fetch_content` (ttl 0) | https://lowendtalk.com/discussion/216524/... | Success; April 2026 promo and support caveat |
| TinyFish `search` | HostHatch pricing / billing cycle / 2026 offers | Success; used for discovery only |
| Notion MCP `notion_fetch` | Dossier page `40d6e471db4281cc808ff48bcc5297bd` | Success; third-party leads only |
| agent-browser | https://cloud.hosthatch.com/order, /, /products | Login wall; no public order prices |

No Amp native `web_search` or `read_web_page` call was needed: Context and TinyFish covered every
fetch, with one Trustpilot fallback from TinyFish to Context.

## Tool spend

- TinyFish: 4 search calls and about 17 `fetch_content` calls (a batched call with several URLs
  counts once). Search and fetch are on the free/favourable tier per the skill; no TinyFish Agent,
  Browser or Research product was used.
- Context: 7 successful `web_scrape` calls at `maxAgeMs: 0` (products twice, homepage, status twice,
  Trustpilot twice) and 1 failed call with an invalid argument shape. Context credits were consumed
  but the exact count was not surfaced by the MCP response; well inside the roughly $1 target.
- Composio Parallel, Exa, Tavily and Firecrawl: not called, because Context and TinyFish succeeded.
- Notion: one page read. agent-browser: four page loads, no account action.
- **Estimated cash spend: under $0.25**, dominated by the Context scrapes.

## Notes for integration

- `provider.json` uses `"kind": "vps"`; the side-by-side `kinds` map needs a `VPS: …` entry.
- `pricing.json` is a `RateCard` with `monthlyPlans: true` and `between: "kept"`. No engine change is
  needed: the existing Hostinger-style monthly-plan path prices A/B/C honestly.
- `feature-rows.json` and `capability-rows.json` are arrays of `{feature|capability, row}` objects,
  not dictionaries.
- `docs.json` covers all 16 features with real pages; `custom-domains`, `built-in-agents` and
  `idle-timers` point at the closest real page rather than a fabricated one.
- Before publishing, the owner should decide whether to state the monthly price as "from $4" with
  the cycle caveat, and whether to add HostHatch to any situation group. This package adds no picks.


---

# A/B/C worked by hand (from abc.md)

# HostHatch — A, B and C worked by hand

Rates read fresh from `https://hosthatch.com/products` on 2026-11-04 (twice: TinyFish then
Context), with the billing rules from `https://hosthatch.com/terms-of-service` and the API
documentation at `https://docs.hosthatch.com/api/orders-and-payment/`. Workload inputs are
`presets.a/b/c` in `site/src/lib/cost.ts`; `MONTH_HOURS = 730`.

Three published rules drive every number below:

1. **Monthly plans, no hourly meter.** "HostHatch will invoice Customer for Fees and Expenses
   monthly, quarterly, semi-annually or annually." The product page quotes every plan as
   `from $X.00 / month`, and the API's product object carries a `billing_cycles` list rather than
   a rate per hour. A ten-minute task therefore costs a whole plan unless it shares one with other
   tasks.
2. **The monthly price is the list price.** `NVMe 4 GB` is $6.00 and `NVMe 12 GB` is $12.00 a
   month. The checkout's prices for quarterly, semi-annual and annual terms are behind the login
   and are not published, so no multi-month discount is applied here. The card is the monthly
   list price.
3. **Stopping does not stop the bill.** The contract is a term that renews until cancelled, and a
   server cancelled with `end_of_term` "runs until the end of the period you paid for". Powering
   off is an action on the server, not a change to the subscription.

The cheapest plan is `NVMe 2 GB`: 1 core (fair share) / 2 GB / 10 GB NVMe, $4.00 a month. There is
no 2 vCPU plan below $6, so A and C pay for a slightly larger machine than they ask for.

---

## A — 1,000 tasks × 10 minutes, 2 vCPU / 4 GiB / 10 GiB, deleted after each

**Size chosen:** NVMe 4 GB, 2 cores (fair share) / 4 GB DDR4 / 20 GB NVMe, **$6.00** a month. It is
the smallest plan with 2 cores and 4 GB, and its 20 GB disk is 10 GB more than the task needs.

**Hours.** 1,000 × 10 min = 10,000 min ÷ 60 = **166.6667 h**.

**Billing unit.** A monthly plan. 166.67 h is inside one 730-hour month, so the runs share one
server back to back and need **one plan**.

**Bill for A: 1 × $6.00 = $6.00.**

**Feasibility.** The tasks are sequential, so one server is enough. A fresh server per task would
mean 1,000 plans: 1,000 × $6.00 = **$6,000**. That is the honest cost of treating HostHatch as a
per-task sandbox, and it is why A only makes sense as a shared, always-on box.

**CPU.** 50% of 2 cores for 166.67 h is 166.67 core-hours spread over the month. The plan is priced
for the whole month, not for CPU time, so the busy fraction does not change the bill. The 2 GB, 4
GB and 8 GB plans are labelled "fair share"; HostHatch does not publish the fair-share threshold.

**What the profile says.** `cost.A` = $6.00, with the flag that the tasks must share one server.

---

## B — one 4 vCPU / 8 GiB / 50 GiB machine, 730 hours

**Size chosen:** NVMe 12 GB, 4 cores (1 dedicated, 3 fair-shared) / 12 GB DDR4 / 50 GB NVMe,
**$12.00**. It is the cheapest plan with 4 cores, and its 50 GB disk matches the ask exactly.

**Why not NVMe 8 GB.** It is $9.00 but has only 2 cores, so it fails the 4 vCPU request. The next
cheapest fit after NVMe 12 GB is NVMe 16 GB at $15.00, which adds memory and disk that B does not
use.

**Hours.** 730, all inside the monthly plan.

**Bill for B: 1 × $12.00 = $12.00.**

**Feasibility.** No session limit, no idle stop and no cap on hours. The server runs all month, and
10% average CPU is far below anything that would meet a fair-use rule.

**What the profile says.** `cost.B` = $12.00.

---

## C — 2 vCPU / 4 GiB / 20 GiB, 90 running + 640 powered-off hours, files kept

**Size chosen:** NVMe 4 GB, 2 cores / 4 GB / 20 GB, **$6.00**. The 20 GB disk is an exact fit.

**The trap.** Workload C assumes the 640 idle hours are cheap. They are not: the plan is sold by
term, not by running hour. Powering off keeps the disk and the files, but the month is already
paid for. There is no cheaper stopped-storage rate and no pause that keeps memory.

**Billed hours.** 90 + 640 = **730 h**, all inside one monthly plan.

**Bill for C: 1 × $6.00 = $6.00.**

**Line-by-line for the profile:**

| Line | Arithmetic | Amount |
|---|---|---|
| Monthly plan | 1 × $6.00 | $6.00 |
| Stopped hours | 640 h, no extra charge and no credit | $0.00 |
| **Bill** | | **$6.00** |

---

## What `price()` prints for the card

Run with `node` against `site/src/lib/cost.ts` and the card in `pricing.json` (probe kept outside
the repo):

```
== A total=$6.00 feasible=true plan=Monthly plan shape=NVMe 4 GB: 2 vCPU / 4 GiB / 20 GiB
   Monthly plan (NVMe 4 GB): 1 × $6.00 a month, running 166.67 h of tasks back to back = $6.00

== B total=$12.00 feasible=true plan=Monthly plan shape=NVMe 12 GB: 4 vCPU / 12 GiB / 50 GiB
   Monthly plan (NVMe 12 GB): 1 × $12.00 a month = $12.00

== C total=$6.00 feasible=true plan=Monthly plan shape=NVMe 4 GB: 2 vCPU / 4 GiB / 20 GiB
   Monthly plan (NVMe 4 GB): 1 × $6.00 a month = $6.00
```

Plan, shape, feasibility and total match the hand arithmetic for all three cases.

## Boundaries checked

- **The 730-hour edge in A.** 4,380 ten-minute tasks are exactly 730 h and print **$6.00**;
  4,381 are 730.17 h and print **$12.00**, because a second monthly plan is needed. The engine
  rounds up per 730 hours of back-to-back work, which is the honest shape of a monthly-only tariff.
- **Disk over the largest plan.** B with 300 GiB prints `$69.00` but `feasible=false`, with "No size
  with 4 vCPU allows 300 GiB of disk; the most is 250 GiB on NVMe 96 GB." There is no volume to buy
  past the plan's disk, so the total is not a price a reader can pay.
- **Nothing is billed while stopped in C** because `monthlyPlans` charges whole plans rather than
  hours; the card does not also set `billedWhileStopped`, which would double-count the catch.

## Model limitation

The card cannot show a multi-month discount, because HostHatch publishes none. The promotional
plans sold through LowEndTalk (April 2026: 4 GB / 50 GB for $35 a year) are annual-only, limited
stock, no refunds and a slower support queue; they are not the standard product and are excluded.

---

## Integration notes (parent thread, 2026-11-04)

- Integrated from `research/incoming/hosthatch/` at base `38f711c` (local, uncommitted).
- Removed `hourly: null` from shapes and `billedWhileStopped: null` from the card; `RateCard` types them as optional number/boolean, and `monthlyPlans` already bills stopped months. Engine output unchanged: A $6, B $12, C $6.
- Capability `no` rows whose quote does not itself say no were retagged to `inferred`: live-resize, gpu, fast-start, mount-buckets, agents-preinstalled, one-click-hermes, one-click-openclaw, per-second, active-cpu, cheap-pause, no-monthly-fee, free-tier, sla, open-source. Kept: `secrets-store` ("Not available yet").
- Change-log quote "Our smallest plan costs $4 per month" re-read through a fresh Context.dev scrape (`cache_metadata.status: miss`). Plain HTTP fetches of hosthatch.com return a JavaScript shell, so `check-rates` reads no HostHatch prices and the weekly check cannot track them yet.
- Plan sizes say "cores" and "GB"; the card maps them to vCPU and GiB, as the worker's abc.md does. Neither unit is defined first-party.

## Recheck, 12 November 2026

Rechecked with the rest of VPS group 1: [vps-group1-recheck-2026-11-12.md](vps-group1-recheck-2026-11-12.md). The earlier ledger is kept as written.
- No price changed. The features page says "We operate out of 13 global locations"; the product page still says 16. The site now uses 13.

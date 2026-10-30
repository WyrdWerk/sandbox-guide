# Hostinger — provider research

Research date: **2026-10-30** (Asia/Kolkata; live pages read 2026-10-30 IST / 2026-10-29 UTC).
Repository revision: **`911a347`** (`origin/main` at the start of the task; the newer `b101ed3`
adds the VPS billing fields this card uses, read from `origin/main` without changing the checkout).
Target provider id: **`hostinger`**. Desk research only: no Hostinger account was created, no VPS
was bought, nothing was run on Hostinger infrastructure.

**Scope.** Hostinger's KVM VPS plans, the one-click VPS application templates a reader will meet
on the same pages (OpenClaw, Hermes Agent, n8n, Agent Zero, Dify), and the separate managed
OpenClaw/Hermes plans only where they could be confused with the VPS. The card prices the VPS, not
the managed plan.

**Tag legend**

| Tag | Meaning |
|---|---|
| `docs-confirmed` | Stated on a Hostinger support, docs or legal page. |
| `pricing-page` | Stated on a page whose subject is money (the VPS page or a live catalog endpoint). |
| `third-party` | Not from Hostinger. Not used for a rate or a verdict. |
| `inferred` | My reading of a documented surface where the answer is absent, such as an API index with no volume endpoint. |
| `not-published` | Hostinger does not answer the question on any page I could find. |

**Quote handling.** Quotes are copied from the fetched Markdown/HTML of each page on 2026-10-30.
For matching I removed Markdown emphasis markers (`**`, backticks), unescaped backslash escapes and
collapsed whitespace. No wording, number or qualifier was changed. Every quote in
`capability-rows.json` and `feature-rows.json` is a contiguous substring of the fetched text after
that normalisation; a script checked the final files.

**Retrieval method.** Composio tools first: TinyFish `search` for discovery and TinyFish
`fetch_content` with `ttl: 0` for fresh page reads (about 40 URLs across batched calls). Prices were
read fresh, not from a cached scrape: the VPS page was fetched with `ttl: 0`, and all three terms
for all four plans were read from Hostinger's own live cart catalog endpoints
(`cart.hostinger.com/api/v1/catalog/hostingercom-vps-kvm{1,2,4,8}?brand_name=hostinger.com&currency_code=USD`),
which return `first_period_price`, `base_price` and `renewal.price` in cents. A live cart was also
opened in the orb's Chromium to confirm the period selector and the visible 24-month price. No
Context, Exa, Tavily, Parallel or Firecrawl call was needed. No paid dataset, deep-research report
or browser-automation run was purchased.

**Spend.** About **$0** (TinyFish and the local browser were free; no paid Composio call). Well
inside the ~$1 cap.

---

## 1. What the product is

Hostinger sells KVM virtual private servers in four fixed sizes. The VPS page calls the guest a
"completely independent and isolated virtual environment" and the FAQ explains the boundary:

> "Kernel-based virtual machine (KVM) is a full virtualization solution that divides a physical server into completely independent and isolated virtual environments." — [VPS hosting](https://www.hostinger.com/vps-hosting) `docs-confirmed`

> "If you purchase VPS, you will share a server with other customers, but you will have full control over your server space and the complete configuration of your virtual instance on the server. You will have administrator (root) access and a dedicated IP address." — [Hosting agreement](https://www.hostinger.com/legal/hosting-agreement) `docs-confirmed`

The second sentence matters for the "dedicated resources" marketing: the guest is isolated, but the
physical host is shared. CPU is also burstable under a credit system, not a permanently dedicated
core (section 3).

**The four plans** (monthly-billed renewal; see section 2 for all terms):

| Plan | vCPU | RAM | NVMe disk | Bandwidth | 1-month renewal |
|---|---:|---:|---:|---:|---:|
| KVM 1 | 1 | 4 GB | 50 GB | 4 TB | $19.49/mo |
| KVM 2 | 2 | 8 GB | 100 GB | 8 TB | $24.49/mo |
| KVM 4 | 4 | 16 GB | 200 GB | 16 TB | $42.99/mo |
| KVM 8 | 8 | 32 GB | 400 GB | 32 TB | $73.99/mo |

> "All plans are paid upfront. The monthly rate reflects the total plan price divided by the number of months in your plan." — [VPS hosting](https://www.hostinger.com/vps-hosting) `pricing-page`

Every plan includes root, a dedicated IPv4, Docker, a browser console, a managed firewall, DDoS
protection, weekly backups and a free domain for one year. The dashboard adds Docker Manager,
Hostinger Agent (an AI console), snapshots, OS reinstall, DNS and API tokens.

> "Full root access" — [VPS hosting](https://www.hostinger.com/vps-hosting) `docs-confirmed`

> "Docker manager" — [VPS hosting](https://www.hostinger.com/vps-hosting) `docs-confirmed`

> "The Web Console is a feature available with all Hostinger VPS plans that allows you to manage your server using terminal commands directly from your web browser." — [VPS Web Console](https://www.hostinger.com/support/how-to-use-the-web-console-in-hostinger/) `docs-confirmed`

**What it is not.** There is no per-second meter, no pause that keeps memory, no fork, no separate
volume, no custom OS image and no nested virtualisation. The 67 VPS API endpoints cover firewalls,
snapshots, backups, Docker projects, recovery, SSH keys and malware scanning; they do not include a
PTY, file transfer, volume or fork call.

> "Deploy and operate virtual machines — firewalls, snapshots, backups, Docker projects, recovery mode, SSH keys and malware scanning." — [VPS API](https://docs.hostinger.com/api-reference/endpoints/vps) `docs-confirmed`

> "67 endpoints across 14 sections." — same page `docs-confirmed`

---

## 2. Prices, terms and what a month-to-month buyer pays

Hostinger sells **three prepaid terms**: 1 month, 12 months and 24 months. The page was in a Black Friday sale on the check date and leads with
24-month introductory prices; the cart shows a first-period discount on every term, including
1 month. The renewal is the ongoing price.

The table below is read from the live catalog JSON on 2026-10-30. Each cell is the monthly
equivalent; the 12- and 24-month rows are paid upfront for the whole term.

| Plan | 1-month first | 1-month renewal | 12-month first | 12-month renewal | 24-month first | 24-month renewal |
|---|---:|---:|---:|---:|---:|---:|
| KVM 1 | $9.99 | **$19.49** | $6.99 | $12.99 | $6.49 | $11.99 |
| KVM 2 | $13.99 | **$24.49** | $9.99 | $16.99 | $8.79 | $14.99 |
| KVM 4 | $25.99 | **$42.99** | $14.99 | $30.99 | $12.99 | $28.99 |
| KVM 8 | $50.99 | **$73.99** | $28.49 | $53.99 | $25.99 | $49.99 |

Upfront totals: KVM 1 $155.88 (12 months) / $287.76 (24); KVM 2 $203.88 / $359.76;
KVM 4 $371.88 / $695.76; KVM 8 $647.88 / $1,199.76.

The page's own sentence for the 24-month KVM 1 plan:

> "Today you pay $155.76 for 24 months. Renews at $11.99/mo for the same term. Cancel anytime." — [VPS hosting](https://www.hostinger.com/vps-hosting) `pricing-page`

**Which one the card uses.** The card uses the **1-month term at renewal**, the only monthly-billed
term and the price a month-to-month buyer pays after the first invoice. The first month is a
discount, not the ongoing price. The 12- and 24-month renewals are cheaper per month but require
the whole term upfront; they are recorded in `pricing.json` notes, not used in the card.

**No separate fee.** The plan price is the whole machine charge. A free domain for one year is
included; its later renewal is a separate domain price.

**Refunds.** KVM VPS plans are covered by the 30-day money-back guarantee, with a 180-day cooldown
after a VPS refund. There is no free tier, no starting credit and no card-free path.

> "The Hostinger refund policy offers a 30-day money-back guarantee for most hosting and email services, such as web, cloud, and KVM VPS hosting plans." — [Refund policy](https://www.hostinger.com/support/9088216-what-is-hostinger-refund-policy/) `docs-confirmed`

---

## 3. Isolation, CPU credits and the "dedicated" contradiction

The guest is a full KVM VM with its own kernel, root, Docker and a dedicated IPv4. Nested
virtualisation is explicitly disabled:

> "Nested virtualization is not supported on Hostinger Virtual Private Server (VPS) hosting plans." — [Nested virtualisation](https://www.hostinger.com/support/10429687-is-nested-virtualization-supported-in-hostinger/) `docs-confirmed`

A custom OS image is explicitly refused:

> "we don’t offer an option to upload or install your own OS images on VPS" — [Custom OS image](https://www.hostinger.com/support/8852324-can-you-add-your-own-os-image-to-vps-at-hostinger/) `docs-confirmed`

CPU is the important catch. Every plan has a **60% baseline**; usage below it earns credits,
usage above it spends them. A full balance covers about three hours at 100% across all vCPUs. When
the balance is empty, capacity is cut to a plan limit until the balance rebuilds.

> "The baseline is 60% on every plan." — [CPU credits](https://www.hostinger.com/support/how-cpu-credits-work-on-hostinger-vps/) `docs-confirmed`

> "A full balance supports approximately three hours of continuous 100% CPU usage across all allocated vCPUs" — same page `docs-confirmed`

> "40% on KVM 1 and 30% on KVM 2, KVM 4 and KVM 8" — same page `docs-confirmed`

A second Hostinger page gives a different floor:

> "It is limited only when the credit balance is empty, to between 5% and 20% of capacity depending on your plan." — [CPU use limit](https://www.hostinger.com/support/6899741-what-is-the-cpu-use-limit-for-vps-at-hostinger/) `docs-confirmed`

This is a first-party contradiction. The card uses the credit article's 40%/30% figures because
that page gives the formula and the per-plan table; the 5–20% page is recorded as unresolved. For
A, B and C the distinction does not bind: A averages 50% CPU, B 10% and C 10%, all at or below the
60% baseline. A long compile or browser burst can bind it.

The marketing also calls the resources dedicated, while the legal agreement says the host is
shared:

> "Get dedicated resources, root access, and the freedom to configure your server your way." — [VPS hosting](https://www.hostinger.com/vps-hosting) `docs-confirmed`

> "If you purchase VPS, you will share a server with other customers" — [Hosting agreement](https://www.hostinger.com/legal/hosting-agreement) `docs-confirmed`

The model treats CPU as shared and burstable, not as a dedicated core. RAM and disk are allocated
to the guest; CPU is credit-throttled.

---

## 4. Sizes, regions and hardware

Four fixed plans, no custom size. CPU, RAM and disk cannot be upgraded separately:

> "Individual resources (such as disk space or RAM) can’t be upgraded separately — upgrading the entire VPS plan is required" — [Upgrade a VPS](https://www.hostinger.com/support/1583229-how-to-upgrade-a-vps-server-at-hostinger/) `docs-confirmed`

> "The upgrade can take up to 10 minutes to complete." — same page `docs-confirmed`

> "All your files and configurations will remain unchanged during the upgrade" — same page `docs-confirmed`

The page does **not** say a running process or memory survives, so `live-resize` is `partly`, not
`yes`. KVM 8 cannot be upgraded further: "KVM 8 plans can’t be upgraded, as they are the highest tier available."

**Regions.** Ten data centers, four in Europe, three of them in the EU:

> "Launch your VPS in 10 data centers across 4 continents, from Boston to Jakarta." — [VPS hosting](https://www.hostinger.com/vps-hosting) `docs-confirmed`

> "Europe: France, Germany, Lithuania, and the United Kingdom." — [Server locations](https://www.hostinger.com/support/1583267-where-are-hostinger-servers-located/) `docs-confirmed`

The VPS page says "Change location anytime"; the support article says the opposite for VPS:

> "For VPS, the server location is fixed after initial setup. As an alternative, you can backup and reinstall the VPS on a different data center." — [Server locations](https://www.hostinger.com/support/1583267-where-are-hostinger-servers-located/) `docs-confirmed`

This is a contradiction. The model treats the location as fixed after setup; moving means a
backup and reinstall.

**GPU.** No GPU on the VPS product. Hostinger sells GPUs separately by the hour:

> "Run AI, rendering, and compute workloads on dedicated NVIDIA GPUs with simple hourly pricing and no long-term commitment." — [GPU hosting](https://www.hostinger.com/gpu-hosting) `pricing-page`

> "738 credits/hour. You’re billed for as long as you have the GPU." — same page `pricing-page`

The separate GPU product is not a VPS shape and is not in this card.

**Disk.** 50, 100, 200 or 400 GB NVMe, included in the plan. There is no separate volume product,
no shared volume and no bucket mount.

---

## 5. Lifecycle, snapshots, backups and storage

**Stop is a power-off, not a pause, and it does not stop billing.**

> "This is a compute-only power state change and does not affect billing." — [Stop virtual machine](https://docs.hostinger.com/api-reference/endpoints/vps/virtual-machine/stop-virtual-machine) `docs-confirmed`

The disk survives a stop; memory and running processes do not. There is no wake-on-request: a
stopped VPS stays stopped until you start it in the dashboard or API. There is no idle timer or
lifetime cap, so an always-on VPS runs until you stop it or the subscription ends.

**Snapshots are single and short-lived.**

> "Only one snapshot is stored at a time; creating a new one overwrites the previous one." — [Back up or restore a VPS](https://www.hostinger.com/support/1583232-how-to-back-up-or-restore-a-vps-at-hostinger/) `docs-confirmed`

> "Snapshots are automatically deleted **after 1 day.**" — same page `docs-confirmed`

The snapshot is a whole-VPS capture, but the page does not say whether RAM or running processes are
included. `snapshot-memory` is therefore `not-published`, not `yes`. A new snapshot overwrites the
old one, so `older-snapshot` is `no`.

**Backups are the durable copy.**

> "Automated weekly backups (and daily if enabled), stored separately from your server. Up to four are retained, two daily and two weekly." — [Back up or restore a VPS](https://www.hostinger.com/support/1583232-how-to-back-up-or-restore-a-vps-at-hostinger/) `docs-confirmed`

> "By default, your VPS is backed up automatically every week." — same page `docs-confirmed`

Daily backups are a paid add-on; the cart showed $3/mo for KVM 1, $6/mo for KVM 2 and $12/mo for
KVM 4. A restore overwrites the whole server and cannot be stopped once started. There is no fork,
no clone of a running machine and no user-created template.

**Storage.** The NVMe disk is part of the plan and survives a stop. It cannot be grown without a
larger plan; there are no separate volumes, no shared volume and no S3-style mount.

---

## 6. Reaching it, domains and the network

**Public address and SSH.** Every VPS gets a dedicated IPv4; any open TCP or UDP port is reachable.
The managed firewall filters **incoming** traffic before it reaches the server and drops everything
until you add accept rules:

> "With Hostinger VPS Firewall, packet filtering occurs before incoming traffic reaches the protected server" — [Managed VPS firewall](https://www.hostinger.com/support/8172641-how-to-use-a-managed-vps-firewall-at-hostinger/) `docs-confirmed`

> "By default, Hostinger VPS Firewall drops all traffic, which means you must add **accept rules** for all ports you want to use." — same page `docs-confirmed`

Standard SSH and a browser console are included. SSH local forwarding (`ssh -L`) works, so a tunnel
is possible even though Hostinger has no dedicated tunnel product. There is no private, token-gated
URL.

**Domains and HTTPS.** A free domain for one year is included and DNS can point at the VPS. HTTPS is
not automatic for a plain VPS:

> "deploy Traefik from the Docker Catalog, run Certbot manually, or use the built-in SSL tools of your VPS control panel" — [Install SSL on VPS](https://www.hostinger.com/support/6360129-how-to-install-ssl-on-vps-at-hostinger/) `docs-confirmed`

The Traefik Docker template can issue and renew Let's Encrypt certificates for containerized apps,
which is why `auto-https` is `partly` rather than `no`. It is not applied to a plain VPS.

**Egress.** 4 TB on KVM 1 up to 32 TB on KVM 8, included per month. There is no per-GiB overage
charge; exceeding the allowance throttles the link to 10 Mbps until the next month.

> "When your Hostinger VPS reaches its monthly bandwidth limit, bandwidth throttling reduces the connection speed to 10 Mbps for the rest of the month, while your websites and services stay online." — [Bandwidth limits](https://www.hostinger.com/support/8789965-what-happens-if-your-vps-bandwidth-resource-limits-are-exceeded/) `docs-confirmed`

The managed firewall is inbound-only, so there is no provider-level outbound allowlist and no
no-internet mode. The dedicated IPv4 is a stable outgoing address in practice, but the hosting
agreement allows a different IP after a migration:

> "you may be assigned a different IP number. We do not warrant that you will be able to consistently maintain your given IP numbers." — [Hosting agreement](https://www.hostinger.com/legal/hosting-agreement) `docs-confirmed`

---

## 7. API, CLI, SDKs and MCP

The VPS is unusually well covered for a budget host. The public API is REST over HTTPS with a
90-request-per-minute limit; the CLI, PHP/Python/TypeScript SDKs and the MCP server are generated
from the same OpenAPI specification.

> "The Hostinger API is a mostly RESTful API over HTTPS." — [API overview](https://docs.hostinger.com/api-reference/overview) `docs-confirmed`

> "The API allows 90 requests per minute" — same page `docs-confirmed`

> "`hostinger` is the official command-line client for the Hostinger API." — [CLI](https://docs.hostinger.com/api-reference/cli) `docs-confirmed`

> "Official client libraries for the Hostinger API in PHP, Python, and TypeScript." — [SDKs](https://docs.hostinger.com/api-reference/sdks) `docs-confirmed`

> "Hosted remote server at `https://mcp.hostinger.com`" — [Hostinger Connector](https://docs.hostinger.com/hostinger-connector/overview) `docs-confirmed`

> "Start, stop, and restart virtual machines; manage firewalls, SSH keys, snapshots, and metrics" — same page `docs-confirmed`

The MCP server manages Hostinger resources; it is **not** a prompt API for an agent inside the VPS.
There is no PTY endpoint and no file read/write endpoint. The browser console is for a person.

API tokens inherit the creator's permissions and can expire, but there is no project or machine
scope:

> "Tokens inherit the permissions of the user who created them and can be set to expire." — [API overview](https://docs.hostinger.com/api-reference/overview) `docs-confirmed`

There is no provider secret store or hidden-secret proxy. Keys live in the OS, a `.env` file or the
app's configuration.

---

## 8. Agents and templates

Hostinger's agent story is **one-click Docker templates on a VPS**, not a managed runtime:

- **OpenClaw** — a self-hosted personal AI assistant platform with messaging channels, a dashboard
  and a browser. The VPS template deploys it; channel pairing and model keys are terminal work.
- **Hermes Agent** — Nous Research's self-improving agent, with persistent memory and multi-platform
  messaging. The VPS template deploys it; model keys and channels are terminal work.
- **n8n** — workflow automation, with the editor in your browser. The template deploys n8n in
  Docker; domain and TLS are manual.
- **Agent Zero, Dify and others** — one-click Docker templates in the same catalogue.

> "OpenClaw is a self-hosted personal AI assistant platform that connects to the messaging channels you already use" — [OpenClaw VPS template](https://www.hostinger.com/applications/openclaw) `docs-confirmed`

> "Hermes Agent is a self-improving AI agent built by Nous Research" — [Hermes Agent VPS template](https://www.hostinger.com/applications/hermes-agent) `docs-confirmed`

> "n8n is a workflow automation platform that connects applications, services, and APIs through a visual node-based interface." — [n8n VPS template](https://www.hostinger.com/applications/n8n) `docs-confirmed`

> "Choose the best template for you: n8n, n8n with queue mode, or an n8n template with access to 100+ pre-made workflows." — [Self-hosted n8n](https://www.hostinger.com/self-hosted-n8n) `docs-confirmed`

> "Get your application up and running instantly with a preconfigured setup." — same application pages `docs-confirmed`

No coding agent (Claude Code, Codex or similar) is preinstalled, there is no browser or desktop in
the default image, and there is no prompt API. The application templates are agent *apps*, not a
tool-execution backend for Cursor, Devin or Claude Managed Agents.

**The separate managed plan.** Hostinger also sells a managed AI automation plan that runs
OpenClaw, Hermes or n8n. It is a different product with a different price and a different support
model:

> "Managed OpenClaw handles all security, updates, and backups." — [Managed OpenClaw](https://www.hostinger.com/managed-openclaw) `docs-confirmed`

> "Try OpenClaw and other automation apps, all on a single plan." — same page `docs-confirmed`

> "Works with: Hermes OpenClaw n8n Paperclip" — [AI automation apps](https://www.hostinger.com/ai-automation-apps) `pricing-page`

> "1 month $ 10.99 /mo" — same page `pricing-page`

> "Today you pay $119.76 for 24 months. Renews at $11.99/mo for the same term." — same page `pricing-page`

> "Launch once and let Hermes Agent handle daily tasks." — [Managed Hermes](https://www.hostinger.com/managed-hermes-agent) `docs-confirmed`

The managed plan includes AI credits, Telegram pairing and managed updates; the VPS template does
not. The two must not be conflated in a route or a price.

---

## 9. Teams, security and the company

**Teams.** Account Sharing gives another Hostinger account access to selected services with one of
two roles:

> "Assign each shared user the Collaborator or Admin role, and remove their access at any time." — [Share access](https://www.hostinger.com/support/1583777-how-to-share-access-to-your-account-at-hostinger/) `docs-confirmed`

> "you choose a role for the shared user: Collaborator or Admin" — same page `docs-confirmed`

There is no SSO (no SAML/OIDC), no account-wide spend cap and no full audit log. The VPS API keeps
an action log (start, stop, restart) and the account shows sign-ins and devices, but neither is a
who-changed-what account trail. The prepaid term caps the machine's own bill, which is why
`spend-cap` is `partly` rather than `no`.

**Security and compliance.** ISO/IEC 27001:2022, GDPR and PCI DSS v4.0.1 are listed; SOC 2 is not.

> "ISO/IEC 27001:2022 certified hosting provider" — [Trust center](https://trust.hostinger.com/) `docs-confirmed`

> "“Covered Services” means hosted services that could involve our Processing of Personal Data, such as: (1) Hosting Services, (2) VPS Services" — [DPA](https://www.hostinger.com/legal/dpa) `docs-confirmed`

**SLA.** A 99.9% monthly uptime guarantee with a 5% credit of the monthly hosting fee; scheduled
maintenance and customer-caused interruptions are excluded.

> "We offer a Service uptime guarantee of 99.9% (“Service Uptime Guarantee”) of available time per month." — [Hosting agreement](https://www.hostinger.com/legal/hosting-agreement) `docs-confirmed`

> "you may contact us and request a credit of 5% of your monthly hosting fee for that month" — same page `docs-confirmed`

**Company.** Hostinger International Limited, a Cyprus private limited company, for most countries
including the EU; UK customers contract with Hostinger UK Limited. Founded in 2004 in Kaunas,
Lithuania; 5M+ customers, 150+ countries, 1000+ people. No outside funding round or valuation is
published; the company describes its 2004 origin as bootstrapped.

> "HOSTINGER INTERNATIONAL LIMITED, Cyprus private limited company" — [Terms of service](https://www.hostinger.com/legal/universal-terms-of-service-agreement) `docs-confirmed`

> "A group of young entrepreneurs bootstrapped a personal company and named it Hosting Media." — [About](https://www.hostinger.com/about) `docs-confirmed`

> "Hostinger serves customers in more than 150 countries" — same page `docs-confirmed`

**Status page.** A public page lists incidents and scheduled maintenance, including VPS node work.

> "Scheduled maintenance is currently in progress. We will provide updates as necessary." — [Status page](https://statuspage.hostinger.com/) `docs-confirmed`

---

## 10. A, B and C in one paragraph

The card uses the 1-month renewal: KVM 2 $24.49, KVM 4 $42.99. **A** is one KVM 2 plan for the
month, $24.49, because 1,000 ten-minute tasks take 166.67 hours inside a 730-hour month; the
calculator prints $5.59 because tasks mode has no monthly minimum. **B** is one KVM 4 plan, $42.99
for 730 hours. **C** is one KVM 2 plan, $24.49, because the 640 stopped hours still bill; the
running-only arithmetic would be $3.02. The full hand-work, all term alternatives and the engine
comparison are in `abc.md`.

---

## 11. Contradictions and how the model resolves them

| # | What disagrees | Evidence | Resolution |
|---|---|---|---|
| 1 | "Dedicated resources" vs "share a server with other customers" and a CPU credit throttle | [VPS page](https://www.hostinger.com/vps-hosting) says "Get dedicated resources"; [hosting agreement](https://www.hostinger.com/legal/hosting-agreement) says "you will share a server with other customers"; [CPU credits](https://www.hostinger.com/support/how-cpu-credits-work-on-hostinger-vps/) cuts capacity when credits run out | Treat RAM and disk as allocated, CPU as shared and burstable. The word "dedicated" is marketing, not a dedicated-core promise. |
| 2 | The throttled CPU floor is 40%/30% or 5–20% | [CPU credits](https://www.hostinger.com/support/how-cpu-credits-work-on-hostinger-vps/) says "40% on KVM 1 and 30% on KVM 2, KVM 4 and KVM 8"; [CPU use limit](https://www.hostinger.com/support/6899741-what-is-the-cpu-use-limit-for-vps-at-hostinger/) says "between 5% and 20%" | Use the credit article's 40%/30% because it gives the formula and a per-plan table; record the 5–20% page as unresolved. A/B/C are unaffected. |
| 3 | "Change location anytime" vs fixed after setup | [VPS page](https://www.hostinger.com/vps-hosting) says "Change location anytime"; [server locations](https://www.hostinger.com/support/1583267-where-are-hostinger-servers-located/) says "For VPS, the server location is fixed after initial setup" | Treat the location as fixed; a move is a backup and reinstall in another data center. |
| 4 | The advertised monthly price is not the renewal price | [VPS page](https://www.hostinger.com/vps-hosting) leads with $6.49–$25.99/mo on 24 months and "All plans are paid upfront"; the cart shows a first-period discount and a higher renewal on every term | The card uses the 1-month renewal ($19.49–$73.99); the 12/24-month renewals are recorded but not used. |
| 5 | The managed AI automation price is a VPS price | [Managed OpenClaw](https://www.hostinger.com/managed-openclaw) is $4.99/mo introductory, renewing at $11.99/mo on a 24-month term; the VPS template is priced by the VPS plan | Keep them separate. The card and routes price the VPS; the managed plan is a different product. |

---

## 12. Unknowns

1. **Does a snapshot include RAM or running processes?** Hostinger calls it a copy of the VPS state
   but does not say. `snapshot-memory` is `not-published`.
2. **How fast does a new VPS boot?** No provisioning or boot time is published. `fast-start` is
   `not-published`.
3. **Does a plan upgrade keep running processes?** The docs promise files and configurations, not
   memory or processes. `live-resize` is `partly`.
4. **Daily backup add-on price for every plan.** The cart showed $3/mo (KVM 1), $6/mo (KVM 2) and
   $12/mo (KVM 4); KVM 8 was not read. Not used in the card.
5. **Is there any spending alert or account spend cap?** No feature is documented; `usage-alerts`
   is `not-published` and `spend-cap` is `partly` only because the plan is prepaid.
6. **SOC 2.** The trust center lists ISO 27001, GDPR and PCI DSS, not SOC 2. `soc2` is `no` by
   justified inference from that list, not an explicit denial.
7. **What exactly does "dedicated resources" mean?** The legal agreement says the host is shared
   and the CPU credit article describes throttling; no page defines a dedicated-core guarantee.
8. **Is the dedicated IPv4 permanent?** The agreement allows a different IP after a migration.
9. **Are there other terms (3, 6 months)?** The plan catalog returned only 1m, 1y and 2y for the
   VPS plans; add-ons have more periods, but the VPS does not.

---

## 13. Capability ledger

All 78 capability IDs, with the verdict used in `capability-rows.json`. The row file carries the
full quote and note for each.

| Capability | Verdict | Figure | Evidence |
|---|---|---|---|
| `own-vm` | yes | KVM full VM | [hostinger.com](https://www.hostinger.com/vps-hosting) |
| `root` | yes | root over SSH | [hostinger.com](https://www.hostinger.com/legal/hosting-agreement) |
| `docker-inside` | yes | Docker + Docker Manager | [hostinger.com](https://www.hostinger.com/vps-hosting) |
| `nested-virt` | no | Not supported | [hostinger.com](https://www.hostinger.com/support/10429687-is-nested-virtualization-supported-in-hostinger/) |
| `custom-image` | no | No custom OS image | [hostinger.com](https://www.hostinger.com/support/8852324-can-you-add-your-own-os-image-to-vps-at-hostinger/) |
| `any-size` | no | 4 fixed plans | [hostinger.com](https://www.hostinger.com/support/1583229-how-to-upgrade-a-vps-server-at-hostinger/) |
| `big-machines` | partly | 8 vCPU / 32 GB | [hostinger.com](https://www.hostinger.com/vps-hosting) |
| `live-resize` | partly | Whole-plan upgrade only | [hostinger.com](https://www.hostinger.com/support/1583229-how-to-upgrade-a-vps-server-at-hostinger/) |
| `gpu` | no | No GPU on VPS | [hostinger.com](https://www.hostinger.com/gpu-hosting) |
| `choose-region` | yes | 10 data centers | [hostinger.com](https://www.hostinger.com/vps-hosting) |
| `eu-region` | yes | FR, DE, LT | [hostinger.com](https://www.hostinger.com/support/1583267-where-are-hostinger-servers-located/) |
| `pause-memory` | no | Stop loses memory | [docs.hostinger.com](https://docs.hostinger.com/api-reference/endpoints/vps/virtual-machine/stop-virtual-machine) |
| `warm-pool` | no | No pre-started pool | [docs.hostinger.com](https://docs.hostinger.com/api-reference/endpoints/vps) |
| `fast-start` | not-published | Not published | [docs.hostinger.com](https://docs.hostinger.com/api-reference/endpoints/vps) |
| `snapshot-files` | yes | 1 snapshot, 1 day | [hostinger.com](https://www.hostinger.com/support/1583232-how-to-back-up-or-restore-a-vps-at-hostinger/) |
| `snapshot-memory` | not-published | Not published | [hostinger.com](https://www.hostinger.com/support/1583232-how-to-back-up-or-restore-a-vps-at-hostinger/) |
| `fork-running` | no | No fork | [hostinger.com](https://www.hostinger.com/support/1583232-how-to-back-up-or-restore-a-vps-at-hostinger/) |
| `older-snapshot` | no | Only 1 snapshot | [hostinger.com](https://www.hostinger.com/support/1583232-how-to-back-up-or-restore-a-vps-at-hostinger/) |
| `templates` | no | OS/app templates only | [docs.hostinger.com](https://docs.hostinger.com/api-reference/endpoints/vps) |
| `backups` | yes | Weekly; 2 weekly + 2 daily | [hostinger.com](https://www.hostinger.com/support/1583232-how-to-back-up-or-restore-a-vps-at-hostinger/) |
| `files-survive-stop` | yes | Disk kept on stop | [docs.hostinger.com](https://docs.hostinger.com/api-reference/endpoints/vps/virtual-machine/stop-virtual-machine) |
| `volumes` | no | No volumes | [hostinger.com](https://www.hostinger.com/support/1583229-how-to-upgrade-a-vps-server-at-hostinger/) |
| `shared-volume` | no | No shared volume | [docs.hostinger.com](https://docs.hostinger.com/api-reference/endpoints/vps) |
| `mount-buckets` | no | No bucket mount | [docs.hostinger.com](https://docs.hostinger.com/api-reference/endpoints/vps) |
| `big-disk` | yes | Up to 400 GB | [hostinger.com](https://www.hostinger.com/vps-hosting) |
| `stay-on` | yes | No idle stop | [docs.hostinger.com](https://docs.hostinger.com/api-reference/endpoints/vps/virtual-machine/stop-virtual-machine) |
| `choose-idle` | partly | Never; no timer | [docs.hostinger.com](https://docs.hostinger.com/api-reference/endpoints/vps/virtual-machine/stop-virtual-machine) |
| `wake-on-request` | no | Manual start only | [docs.hostinger.com](https://docs.hostinger.com/api-reference/endpoints/vps/virtual-machine/stop-virtual-machine) |
| `schedules` | no | Cron only inside VM | [docs.hostinger.com](https://docs.hostinger.com/api-reference/endpoints/vps) |
| `public-url` | yes | Public IPv4 | [hostinger.com](https://www.hostinger.com/legal/hosting-agreement) |
| `private-url` | no | No private link | [hostinger.com](https://www.hostinger.com/support/8172641-how-to-use-a-managed-vps-firewall-at-hostinger/) |
| `ssh` | yes | Standard SSH | [hostinger.com](https://www.hostinger.com/support/5723772-how-to-connect-to-your-vps-via-ssh-at-hostinger/) |
| `web-terminal` | yes | Browser console | [hostinger.com](https://www.hostinger.com/support/how-to-use-the-web-console-in-hostinger/) |
| `tunnel` | yes | SSH -L | [hostinger.com](https://www.hostinger.com/support/5723772-how-to-connect-to-your-vps-via-ssh-at-hostinger/) |
| `raw-tcp` | yes | Any TCP/UDP port | [hostinger.com](https://www.hostinger.com/support/8172641-how-to-use-a-managed-vps-firewall-at-hostinger/) |
| `custom-domain` | yes | DNS + free domain | [hostinger.com](https://www.hostinger.com/vps-hosting) |
| `auto-https` | partly | Traefik/Certbot | [hostinger.com](https://www.hostinger.com/support/6360129-how-to-install-ssl-on-vps-at-hostinger/) |
| `egress-included` | yes | 4–32 TB/mo, then 10 Mbps | [hostinger.com](https://www.hostinger.com/vps-hosting) |
| `egress-allowlist` | no | Inbound firewall only | [hostinger.com](https://www.hostinger.com/support/8172641-how-to-use-a-managed-vps-firewall-at-hostinger/) |
| `no-internet` | no | No provider mode | [hostinger.com](https://www.hostinger.com/support/8172641-how-to-use-a-managed-vps-firewall-at-hostinger/) |
| `static-ip` | yes | Dedicated IPv4 | [hostinger.com](https://www.hostinger.com/legal/hosting-agreement) |
| `secrets-store` | no | No secret store | [docs.hostinger.com](https://docs.hostinger.com/account/security) |
| `hidden-secrets` | no | No secret proxy | [docs.hostinger.com](https://docs.hostinger.com/account/security) |
| `scoped-keys` | no | Account-wide tokens | [docs.hostinger.com](https://docs.hostinger.com/api-reference/overview) |
| `dashboard-create` | yes | Dashboard + web console | [hostinger.com](https://www.hostinger.com/support/5726606-how-to-use-the-vps-dashboard-in-hostinger/) |
| `cli` | yes | hostinger CLI | [docs.hostinger.com](https://docs.hostinger.com/api-reference/cli) |
| `python-sdk` | yes | hostinger-api | [docs.hostinger.com](https://docs.hostinger.com/api-reference/sdks) |
| `ts-sdk` | yes | @hostinger/sdk | [docs.hostinger.com](https://docs.hostinger.com/api-reference/sdks) |
| `rest-api` | yes | 90 requests/min | [docs.hostinger.com](https://docs.hostinger.com/api-reference/overview) |
| `mcp-server` | yes | 63 VPS tools | [docs.hostinger.com](https://docs.hostinger.com/hostinger-connector/overview) |
| `pty` | no | No PTY API | [docs.hostinger.com](https://docs.hostinger.com/api-reference/endpoints/vps) |
| `file-api` | no | No file API | [docs.hostinger.com](https://docs.hostinger.com/api-reference/endpoints/vps) |
| `agents-preinstalled` | no | No coding agent | [docs.hostinger.com](https://docs.hostinger.com/api-reference/endpoints/vps) |
| `prompt-api` | no | No prompt API | [docs.hostinger.com](https://docs.hostinger.com/api-reference/endpoints/vps) |
| `one-click-hermes` | yes | VPS template | [hostinger.com](https://www.hostinger.com/applications/hermes-agent) |
| `one-click-openclaw` | yes | VPS template | [hostinger.com](https://www.hostinger.com/applications/openclaw) |
| `browser` | no | Not preinstalled | [docs.hostinger.com](https://docs.hostinger.com/api-reference/endpoints/vps) |
| `desktop` | no | No desktop | [docs.hostinger.com](https://docs.hostinger.com/api-reference/endpoints/vps) |
| `hosts-other-agents` | no | Self-host only | [hostinger.com](https://www.hostinger.com/applications/openclaw) |
| `team-workspace` | yes | Account Sharing | [hostinger.com](https://www.hostinger.com/support/1583777-how-to-share-access-to-your-account-at-hostinger/) |
| `roles` | partly | Collaborator/Admin | [hostinger.com](https://www.hostinger.com/support/1583777-how-to-share-access-to-your-account-at-hostinger/) |
| `sso` | no | No SAML/OIDC | [hostinger.com](https://www.hostinger.com/support/1583777-how-to-share-access-to-your-account-at-hostinger/) |
| `spend-cap` | partly | Prepaid plan only | [hostinger.com](https://www.hostinger.com/vps-hosting) |
| `usage-alerts` | not-published | Not published | [hostinger.com](https://www.hostinger.com/support/5726606-how-to-use-the-vps-dashboard-in-hostinger/) |
| `audit-log` | partly | VPS actions + sign-ins | [docs.hostinger.com](https://docs.hostinger.com/api-reference/endpoints/vps/actions) |
| `per-second` | no | Monthly plan | [hostinger.com](https://www.hostinger.com/vps-hosting) |
| `active-cpu` | no | Allocated plan | [hostinger.com](https://www.hostinger.com/vps-hosting) |
| `cheap-pause` | no | Stop still bills | [docs.hostinger.com](https://docs.hostinger.com/api-reference/endpoints/vps/virtual-machine/stop-virtual-machine) |
| `no-monthly-fee` | no | Monthly plan | [hostinger.com](https://www.hostinger.com/vps-hosting) |
| `flat-price` | yes | $19.49–$73.99/mo | [hostinger.com](https://www.hostinger.com/vps-hosting) |
| `free-tier` | no | No free tier | [hostinger.com](https://www.hostinger.com/support/9088216-what-is-hostinger-refund-policy/) |
| `free-credit` | no | No starting credit | [hostinger.com](https://www.hostinger.com/support/9088216-what-is-hostinger-refund-policy/) |
| `no-card` | no | Card required | [hostinger.com](https://www.hostinger.com/vps-hosting) |
| `status-page` | yes | statuspage.hostinger.com | [statuspage.hostinger.com](https://statuspage.hostinger.com/) |
| `sla` | yes | 99.9%, 5% credit | [hostinger.com](https://www.hostinger.com/legal/hosting-agreement) |
| `soc2` | no | ISO 27001, no SOC 2 | [trust.hostinger.com](https://trust.hostinger.com/) |
| `dpa` | yes | DPA covers VPS | [hostinger.com](https://www.hostinger.com/legal/dpa) |
| `open-source` | no | Proprietary service | [hostinger.com](https://www.hostinger.com/legal/universal-terms-of-service-agreement) |

## 14. Feature ledger

All 16 feature IDs, with the verdict used in `feature-rows.json`.

| Feature | Verdict | Figure | Scenario |
|---|---|---|---|
| `isolation` | yes | KVM VM; root and Docker | The build needs Docker and a kernel module: Docker and root work inside a full KVM guest, but a module that needs nested virtualisation does not. |
| `sizes-regions` | partly | 8 vCPU / 32 GB; 10 regions | The lopsided 2 vCPU / 16 GiB request has no exact shape; KVM 4's 16 GB is about 14.9 GiB if decimal, so the next fit is KVM 8 at 8 vCPU / 32 GB for $73.99. |
| `billing-models` | partly | $19.49–$73.99/mo, prepaid | One month of a box that mostly waits still costs the full plan; there is no per-second meter and no cheap paused state. |
| `trials-free-tiers` | no | No free tier; 30-day refund | A week of testing costs a month's plan; the 30-day money-back guarantee is the only way out. |
| `lifecycle` | partly | Stop keeps disk; no pause | Stop at 18:00 and the disk is there at 09:00, but the queued test run and the memory are gone, and the plan bills through the night. |
| `snapshots-forks` | partly | 1 snapshot, 1 day | Rewind a bad change only from the single snapshot taken in the last day; fanning out ten copies means ten VPS plans, not ten forks. |
| `storage` | partly | 50–400 GB included | Postgres in /var/lib survives a stop, but there is no separate volume to attach to a new machine after the VPS is deleted. |
| `idle-timers` | yes | No idle stop | Still running at 00:20 and at 01:00; nothing pauses it for idleness, and the plan keeps billing. |
| `reaching-it` | yes | Public IPv4; SSH and web console | Paste the public IPv4 URL into the client channel; SSH and the browser console both work. |
| `custom-domains` | partly | DNS; HTTPS is manual | Point demo.acme.com at the IPv4, then deploy Traefik or Certbot for a certificate; Hostinger does not issue one for the server. |
| `outbound-network` | yes | 4–32 TB/mo, then 10 Mbps | The 400 GB download fits inside KVM 2's 8 TB; after the allowance the link drops to 10 Mbps, not a bill. |
| `keys-secrets` | no | No secret store | The agent pastes its environment into a message because the keys live in the OS environment, not a provider vault. |
| `ways-to-drive` | yes | Dashboard, CLI, SDKs, API, MCP | A designer can create the VPS in the dashboard, but the first agent still needs a terminal or an application template. |
| `built-in-agents` | partly | OpenClaw/Hermes/n8n templates | Send a task to OpenClaw after the template deploys; no coding agent, browser or prompt API is built into the default image. |
| `teams-accounts` | partly | 2 roles; no SSO or spend cap | Five people share the VPS through Account Sharing; one runaway agent cannot be stopped by an account-level spend cap. |
| `company` | yes | Hostinger International Ltd; 99.9% | Procurement gets a Cyprus entity, a 99.9% SLA with a 5% credit, ISO 27001 and a DPA; no SOC 2 report is listed. |

## 15. Use-case dispositions

| Use case | Tier | No terminal? | Disposition |
|---|---|---|---|
| `hermes-agent` | one-click | partly | Offer; the VPS template is one click, but model keys and channels are terminal work. The managed AI automation plan is the no-terminal alternative. |
| `openclaw` | one-click | partly | Recommend for a reader who wants root and a persistent VPS; the managed AI automation plan is a different product. |
| `coding-agent` | manual | no | List; install Claude Code or Codex yourself. KVM 4 $42.99/mo. |
| `code-interpreter` | manual | no | Do not recommend; no per-run billing, and untrusted code wants a sandbox. |
| `browser-agent` | manual | no | Do not recommend; no browser image, monthly plan. |
| `workflow-automation` | one-click | partly | Recommend; the n8n template is the strongest Hostinger route. |
| `chat-bot` | manual | no | List; KVM 1 $19.49 or KVM 2 $24.49, always on. |
| `claude-code-team` | manual | no | List; five KVM 4 plans = $214.95/mo, separate Claude logins. |
| `scheduled-scraper` | manual | no | Do not recommend; 20 hours of work bills as a 730-hour plan. |
| `mcp-server` | manual | no | Recommend as a value pick; KVM 1 $19.49, public IPv4, add auth and TLS. |

Picks proposed: OpenClaw, n8n and a small remote MCP server. No pick for the task-shaped or
team-shaped use cases, where the monthly plan is the wrong meter.

---

## 16. Sources

| Source | URL | Used for |
|---|---|---|
| VPS hosting | https://www.hostinger.com/vps-hosting | Plans, specs, 24-month price, features, regions, refund banner |
| KVM 1 catalog | https://cart.hostinger.com/api/v1/catalog/hostingercom-vps-kvm1?brand_name=hostinger.com&currency_code=USD | All three terms, first/renewal prices |
| KVM 2 catalog | https://cart.hostinger.com/api/v1/catalog/hostingercom-vps-kvm2?brand_name=hostinger.com&currency_code=USD | All three terms |
| KVM 4 catalog | https://cart.hostinger.com/api/v1/catalog/hostingercom-vps-kvm4?brand_name=hostinger.com&currency_code=USD | All three terms |
| KVM 8 catalog | https://cart.hostinger.com/api/v1/catalog/hostingercom-vps-kvm8?brand_name=hostinger.com&currency_code=USD | All three terms |
| Nested virtualisation | https://www.hostinger.com/support/10429687-is-nested-virtualization-supported-in-hostinger/ | Explicit no |
| Custom OS image | https://www.hostinger.com/support/8852324-can-you-add-your-own-os-image-to-vps-at-hostinger/ | Explicit no |
| Server locations | https://www.hostinger.com/support/1583267-where-are-hostinger-servers-located/ | 10 locations, fixed after setup |
| Bandwidth limits | https://www.hostinger.com/support/8789965-what-happens-if-your-vps-bandwidth-resource-limits-are-exceeded/ | 10 Mbps throttle, no overage |
| Backups and snapshots | https://www.hostinger.com/support/1583232-how-to-back-up-or-restore-a-vps-at-hostinger/ | Weekly backups, one snapshot, 1-day expiry |
| Upgrade a VPS | https://www.hostinger.com/support/1583229-how-to-upgrade-a-vps-server-at-hostinger/ | Whole-plan upgrade only |
| SSL on VPS | https://www.hostinger.com/support/6360129-how-to-install-ssl-on-vps-at-hostinger/ | Manual TLS |
| VPS Web Console | https://www.hostinger.com/support/how-to-use-the-web-console-in-hostinger/ | Browser terminal |
| SSH | https://www.hostinger.com/support/5723772-how-to-connect-to-your-vps-via-ssh-at-hostinger/ | Standard SSH |
| Managed VPS firewall | https://www.hostinger.com/support/8172641-how-to-use-a-managed-vps-firewall-at-hostinger/ | Inbound filtering, default drop |
| Account Sharing | https://www.hostinger.com/support/1583777-how-to-share-access-to-your-account-at-hostinger/ | Collaborator/Admin roles |
| VPS dashboard | https://www.hostinger.com/support/5726606-how-to-use-the-vps-dashboard-in-hostinger/ | Dashboard, resource usage, web console |
| CPU credits | https://www.hostinger.com/support/how-cpu-credits-work-on-hostinger-vps/ | 60% baseline, 3-hour burst, 40%/30% floor |
| CPU use limit | https://www.hostinger.com/support/6899741-what-is-the-cpu-use-limit-for-vps-at-hostinger/ | Contradictory 5–20% floor |
| Stop endpoint | https://docs.hostinger.com/api-reference/endpoints/vps/virtual-machine/stop-virtual-machine | Stop does not affect billing |
| VPS API | https://docs.hostinger.com/api-reference/endpoints/vps | 67 endpoints, no volume/fork/PTY/file |
| API overview | https://docs.hostinger.com/api-reference/overview | REST, 90 req/min, token scope |
| CLI | https://docs.hostinger.com/api-reference/cli | Official CLI |
| SDKs | https://docs.hostinger.com/api-reference/sdks | Python/TypeScript/PHP |
| Hostinger Connector | https://docs.hostinger.com/hostinger-connector/overview | MCP server, 63 VPS tools |
| Tools and integrations | https://docs.hostinger.com/api-reference/tools | CLI, SDKs, MCP, Terraform |
| Security and access | https://docs.hostinger.com/account/security | API tokens, account activity |
| OpenClaw template | https://www.hostinger.com/applications/openclaw | One-click OpenClaw |
| Hermes template | https://www.hostinger.com/applications/hermes-agent | One-click Hermes |
| n8n template | https://www.hostinger.com/applications/n8n | One-click n8n |
| Self-hosted n8n | https://www.hostinger.com/self-hosted-n8n | n8n plan and features |
| Managed OpenClaw | https://www.hostinger.com/managed-openclaw | Separate managed product |
| Managed Hermes | https://www.hostinger.com/managed-hermes-agent | Separate managed product |
| Managed AI automation apps | https://www.hostinger.com/ai-automation-apps | One managed plan for OpenClaw, Hermes, n8n, Paperclip |
| GPU hosting | https://www.hostinger.com/gpu-hosting | Separate GPU product |
| Hosting agreement | https://www.hostinger.com/legal/hosting-agreement | VPS definition, SLA, IP caveat |
| Terms of service | https://www.hostinger.com/legal/universal-terms-of-service-agreement | Contracting entity |
| DPA | https://www.hostinger.com/legal/dpa | VPS covered |
| Trust center | https://trust.hostinger.com/ | ISO 27001, GDPR, PCI DSS |
| About | https://www.hostinger.com/about | Founding, scale |
| Refund policy | https://www.hostinger.com/support/9088216-what-is-hostinger-refund-policy/ | 30-day money-back |
| Status page | https://statuspage.hostinger.com/ | Public incidents |

---

## 17. Audit notes

- **Counts.** 78 capability rows, 16 feature rows, 10 route rows, 3 picks. IDs were diffed against
  `site/src/data/capabilities.json` and `site/src/data/features/` and match exactly. `provider.json`
  sets `kind: "vps"` for the comparison label.
- **Every `partly` has a shortfall sentence.** The shortfalls are: whole-plan upgrade only,
  the 8 vCPU / 32 GB near-miss, no idle setting, Traefik/Certbot TLS, two roles, prepaid-only
  spend cap, and VPS-actions-only audit log.
- **Most `no` verdicts are explicit or a justified inference.** Nested virtualisation and custom
  images are explicit. Volumes, forks, PTY, file API, prompt API, browser, desktop, outbound
  allowlist and no-internet are inferred from the 67-endpoint VPS API and the inbound-only
  firewall. SOC 2 is inferred from the trust center's list.
- **Unknowns are not zeros.** No free tier, no starting credit, no snapshot price, no daily-backup
  price for KVM 8 and no boot time were invented.
- **The card's A is knowingly low in the engine.** The hand-worked $24.49 is the bill; the profile's
  A case carries the flag.
- **No site JSON was edited, committed or pushed.** These are research artifacts only.

## Parent integration, 2026-10-30

Integrated by https://ampcode.com/threads/T-01a188d2-e3f1-734f-8aed-80041812cbe2.

- **Quote check:** all 18 profile, 16 feature and 78 capability quotes were re-fetched and matched after removing
  whitespace and hyphens.
- **Prices:** all four plans' prices for the 1-month, 12-month and 24-month terms (first period and renewal)
  were re-read from the `cart.hostinger.com` catalog endpoints, and match the worker's table.
- **Engine:** added `RateCard.monthlyPlans`. Each machine is billed its plan's monthly price, and tasks run back to
  back on `ceil(hours / 730)` plans. The shapes carry `monthly` only; the worker's derived `hourly` (monthly ÷ 730)
  is dropped because Hostinger does not sell hourly time. The engine now prints A $24.49, B $42.99, C $24.49, the
  hand-worked totals. The worker's A flag (an engine undercount) is replaced with the back-to-back assumption.
- **Picks not used:** OpenClaw, n8n and MCP servers already had four picks each, two of them from VPS providers
  with the same argument. Hostinger appears in every route table, with one-click tiers for Hermes, OpenClaw and
  n8n, and the one-click counts in those three standfirsts were updated.
- **Price baseline:** not refreshed (see DigitalOcean).

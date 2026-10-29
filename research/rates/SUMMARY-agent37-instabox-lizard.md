# Rates and doc links — agent37, instabox, lizard

Checked **2026-10-29** against each provider's live pricing page and docs, plus the Battleships card for each provider (`https://battleships.dev/data/providers/<id>.json`, ids confirmed in `https://battleships.dev/data/index.json`).

Files: `agent37.json`, `instabox.json`, `lizard.json` in this folder.

Method: existing profiles in `research/<id>.md` were the starting point. Live pages were read through TinyFish Fetch (Context.dev and TinyFish are the preferred providers; Composio discovery was used only to confirm the available scrape route). Long `.md` doc pages were re-fetched directly with `curl` because the first Fetch responses were truncated. Every quote in the JSON was machine-checked as a substring of the cited page (131 quotes, 0 misses) after normalising Markdown whitespace and emphasis. All doc links returned HTTP 200 on 2026-10-29.

Derived figures are labelled in the JSON: monthly prices for fixed sizes use 730 hours (the providers' own convention); hourly figures for monthly-priced resources are the published monthly rate ÷ 730.

## Changes since our research

### Agent 37

| Field | Research (2026-10-28) | Live (2026-10-29) |
|---|---|---|
| Custom domains | not published; no domain price in docs or pricing | **Free**, up to 10 domains per workspace, unlocked once lifetime top-ups reach $100 |
| Regions | us, eu (France), ap-south (India, Mumbai) | Create docs unchanged, but the concepts page now says instances "Runs on dedicated servers in the United States" — a new internal contradiction |
| Personal free tier idle | "sleeps when idle", no timer | **Sleeps after 15 minutes idle**; removed after 30 days asleep |
| VM size ceiling | 4 vCPU ceiling vs VM table listing 8/16 and 16/32 | Still contradictory: `instance-sizing` says 4 vCPU is the ceiling "on every instance type"; `vm-instances` prices 16 vCPU / 32 GB |

No price changes: $0.80/vCPU-month, $0.70/GB-month, $0.09/GB-month, $4.76 entry shape, 2.5× VM, 4× Performance, $0.03/GB-month cold storage, $5 starter credit, 1/10/50/200 instance caps, and Personal $0 / $3.99 / $9.99 / $29.99 / $99.99 are all still live. Egress is still not published.

### InstaBox

| Field | Research (2026-10-28) | Live (2026-10-29) |
|---|---|---|
| Stopped/paused retention | not published | **No forced TTL**: machines and snapshots stay until deleted; 30 days after a workspace is disabled |
| Free 8-hour cap | only in the OpenAPI schema, "not on any docs page" | Now in the CLI reference: `max-run … (free plan: fixed at 480)` |
| Preview URL wake | Docs said a visit wakes an idle machine; OpenAPI said preview links stay offline (flagged as a contradiction) | Resolved: an **idle** auto-pause wakes on use; a **manual** pause or stop does not |
| Builder plan | Missing from the Limits page | Still missing from the Limits sizes/count rows; present on Pricing and in `llms.txt` |

No price changes: Free/Pro $20/Builder $100/Team $500, $0.004 per vCPU-hour, $0.00225 per GiB-hour, $0.00011 per GiB-hour storage, $0.02/GiB egress and the 100 GiB / 1 / 5 / 50 TiB allowances are all live. Custom domains and a region selector are still absent; the docs now state explicitly that a machine has no `region` field.

### Lizard

No price changes: Pro $19 with $19 of monthly credits, Small/Medium/Large at $0.0162/$0.0324/$0.0648 per hour, volumes at $0.14/GB-month, 2 TB sandbox egress per rolling 30 days, $0.045/GB app egress. The trial is still 7 days with $5 and a card.

New confirmations that were weaker in the research file: the hosted **Lizard MCP** server is documented (`docs/agents`); the OpenClaw **one-click template** exists (the deploy catalog has exactly three templates: n8n, Grafana, OpenClaw); there is no Hermes template.

## Battleships disagreements (all captured in each JSON `diffs`)

The cards are dated: InstaBox and Lizard feature evidence checked 2026-10-14, Agent 37 through 2026-10-14. That explains most of the gaps.

- **Agent 37**: Battleships records only `us` and `custom_domain: true` with no price. Live has three advertised regions (with the concepts-page contradiction) and free-but-gated custom domains.
- **InstaBox**: the card is effectively the pre-October product — invite-only beta with no published price, one 4/8 size, 5 free machines, no secret proxy, no SSO, `snapshot_mem: true`, no egress or storage rate. Live has five plans, sizes to 32/64, 1 free machine, Org Secrets, Enterprise SSO, disk-only snapshots and published rates.
- **Lizard**: fork count 1–10 (live 1–100), `whole_disk: false` (live: the whole disk survives a pause), `spend_limits: null` (live: no cap), `mcp_server: null` (live: hosted MCP), `custom_image: true` (live: no custom-template upload), and `included_usd: 0` for a $19 plan that includes $19 of credits.

## Could not confirm

**Agent 37**
- Egress or bandwidth price: no rate on the pricing page or in billing docs.
- Whether the default type really caps at 4 vCPU or the VM type really offers 16 vCPU; both statements are live on different pages.
- Whether "dedicated servers in the United States" means the `eu` and `ap-south` regions are exceptions or the concepts page is stale.
- How many managed agents a paid Personal tier allows (only the Free tier's "one agent" is stated).

**InstaBox**
- Regions: no selector, no list; the Terms say data is stored in the United States, and the docs say placement is the platform's.
- Custom domains for public ports: no feature or doc found.
- Whether a brand-new free account needs a card; the OpenAPI has a `cardMissingAt` state but the pricing page says Free $0.
- Overage charge threshold and starts-per-minute limit: fields exist, values not published.
- SOC 2 / ISO 27001: not stated on the site.
- Builder machine sizes: pricing says up to 16/32, the Limits page omits Builder entirely.

**Lizard**
- Snapshot storage price: restores are priced; stored snapshots are not.
- What a paused sandbox's own disk or memory costs: only "paused compute $0" and volumes billed separately are stated.
- Resume and restore latency, Docker/systemd inside a sandbox, CPU architecture, egress above 2 TB, custom domains on sandbox preview URLs.
- Hermes: no template, one-click route or guide. Only a manual sandbox install is possible; OpenClaw has the one-click template.

## Calculator notes

- **Agent 37** prices compute purely per resource ($/vCPU-hour + $/GiB-hour + $/GiB-hour disk), with a per-minute increment. Its fixed shapes are just examples at default disk.
- **InstaBox** is per-resource too, but sells fixed vCPU/RAM pairs by plan and bills per second. The $20 Pro fee comes back as $20 of usage credits, so the plan sets a monthly floor but the usage itself is metered.
- **Lizard** sandboxes are fixed-size flat hourly prices (CPU, RAM and local disk included), billed per second, with a $19 subscription that includes $19 of platform usage. Its per-resource CPU/RAM rates are for apps, not sandboxes, and are roughly 6× the equivalent sandbox size — do not use them to price a sandbox.
- All three bill storage while a sandbox is stopped or paused (Lizard: volumes only; the paused sandbox's own disk has no published price).
- Lizard's sandbox egress is $0 only **inside** the included 2 TB per rolling 30 days. The overage rate is unpublished, so the JSON leaves `usdPerGiB` and `overageUSDPerGiB` as `null` rather than 0; do not render it as unlimited free egress.

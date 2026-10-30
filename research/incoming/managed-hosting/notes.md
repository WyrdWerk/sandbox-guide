# Managed, one-click hosting for OpenClaw, Hermes Agent and n8n

- **Collected:** 2026-10-29 (Asia/Kolkata), desk research only. No accounts, purchases, trials or provider contact.
- **Repository revision:** `911a347` (`origin/main` at the time of the request), worktree otherwise clean.
- **Artifact:** [managed-hosting.json](managed-hosting.json) - 16 services: 6 OpenClaw, 5 Hermes Agent, 5 n8n/workflow automation.
- **Scope:** services where a non-technical buyer pays a recurring fee and gets the agent running, as opposed to a cloud sandbox or a raw VPS. Each entry records the cheapest ongoing monthly price and its term, the catch, and a primary `source`; the fuller `plans`, `sources`, machine sizes and company fields are kept alongside.

## Method

- **Tools:** Composio **Context** MCP only - `web_search` for discovery, `web_map` for site URLs, `web_scrape` for page reads. No TinyFish, Exa, Tavily, Parallel or Firecrawl calls; no Amp native `web_search`/`read_web_page` fallback was needed.
- **Freshness:** every price page was requested with `maxAgeMs: 0` and returned `cache_metadata.status = "miss"`, i.e. a live fetch, not a cache hit. No price was taken from a search-result snippet or an earlier session.
- **Rendering:** pages were read with cookie dismissal and, for most sites, main-content extraction. Client-rendered pricing needed specific handling: n8n's monthly prices only appear after activating the **Monthly** toggle (browser action), and xCloud's six OpenClaw prices live in the page's JSON-LD offer block, not the visible plan card.
- **Evidence:** 119 source records, all re-fetched after writing and substring-checked with whitespace normalized. Markdown emphasis markers, smart quotes and link syntax were ignored for the check; the stored quotes keep the page's wording.
- **Verification misses and fixes:** 21 initial misses. xCloud's JSON-LD quotes exist in the HTML only (7). xCloud docs, Hostimul, InstaPods and MyClaw quotes appear only with main-content extraction (4). Two quotes were trimmed where a markdown link interrupted the sentence (Hermes docs, n8n trial docs). n8n monthly prices needed the Monthly toggle (3). Railway's "one click" wording existed only in a search-result description, so it was replaced with two verified sentences from the template page (1). Render's deploy-page FAQ quote needed main-content extraction (1). All fixes were re-checked.
- **Prices:** recorded exactly as displayed, in the page's currency. No currency conversion and no tax assumptions. "Intro" and "renewal" are separated wherever the page does.

## What the market looks like

- **OpenClaw has no first-party hosted service.** The official docs describe OpenClaw as a self-hosted gateway and list VPS/PaaS install routes (Azure, DigitalOcean, Fly.io, Hetzner, Hostinger, Northflank, Railway, Render, exe.dev, Daytona, Upstash) rather than a managed product. Every OpenClaw entry here is a third party; openclawai.io says so explicitly.
- **Hermes does have a first-party hosted option**, Hermes Cloud on Nous Portal, but it is usage-billed and its per-size prices are behind sign-in. Third-party hosts split into "AI included" (FlyHermes) and BYOK containers (Agent 37, RunOnFlux, OneClickClaw).
- **n8n is the most mature managed market**: an official cloud with execution-based plans, plus flat-fee managed hosts (InstaPods, Elestio) and usage-billed PaaS templates (Railway, Render).

## Contradictions kept, and how they were read

1. **xCloud messaging channels.** The marketing page says "Telegram and WhatsApp work out of the box" and the FAQ says Discord/Slack/Signal are on the Q2 2026 roadmap; the deployment documentation says "Right now, xCloud allows you to connect to one built-in messaging platform: 'Telegram'." The JSON records both and treats Telegram as the only confirmed channel today.
2. **xCloud intro pricing.** The card shows `$19.99/mo` struck through `$39.99` with "Save 50%" and the JSON-LD offer price is `19.99`; the renewal line says `Renews at $39.99/mo`. Treated as an introductory monthly rate, not a permanent price.
3. **n8n Cloud currency.** The same pricing page shows **USD when Monthly is selected** ($24 / $60 / $960) and **EUR when Annually is selected** (€20 / €50 / €667). Both are recorded verbatim. This looks like a page/geo quirk, not a like-for-like discount; the 17% annual saving claim is consistent within each currency only if the monthly EUR price is about €24/€60/€800, which the page does not print.
4. **n8n Business.** It appears in the cloud plan grid but is labelled "Self-hosted only" with a cloud waitlist link. Treated as self-hosted for a buyer who wants managed hosting.
5. **MyClaw search snippet vs page.** A search result described Lite at $19/mo, Pro $39 and Max $79; the live page shows $29 / $59 / $119 / $239 monthly and $16.6 / $33.3 / $66.6 / $133.3 as yearly equivalents. The live page is used; the snippet is stale.
6. **MyClaw AI credits.** Pro/Max/Ultra advertise "Extra $100/$150/$200 AI credits included" while a footnote says "AI token usage isn't included in the subscription." Read as a fixed credit allowance, not unlimited inference.
7. **OneClickClaw price presentation.** The card shows Pro at €49.99/mo and €479.88/year; €479.88 ÷ 12 = €39.99, which matches the terms' annual table. Not a contradiction once the annual total is read as 12 × the annual monthly-equivalent.
8. **Hostinger Hermes.** FlyHermes' comparison table cites Hostinger managed Hermes at $5.99/mo, but Hostinger's own `/hermes` URL redirected to a French affiliate landing page selling KVM VPS packs (€4.94/mo on a 24-month term, renews €11.99). That is a VPS, not a managed agent, so it is excluded here rather than mixed into the managed set.

## Excluded after checking

- **OVHcloud VPS OpenClaw** (https://us.ovhcloud.com/vps/vps-openclaw/): a VPS product with root access, not a managed service. Quote: "our [VPS cloud] solution gives you the root user access needed to manage environment variables, configuration files, and secure your conversation history". From $8.50/mo for 4 vCores / 8 GB, but the buyer administers it.
- **Hostinger Hermes**: one-click Hermes on a KVM VPS (see contradiction 8). Hostinger's *OpenClaw* managed container is included; its Hermes offer is not equivalent.
- **Kimi Claw**: described as "Fully Managed Cloud Hosting" only in a Kimi marketing article and third-party pages; no own product/pricing page was found to verify, so it is skipped.
- **Dreamhost Hermes VPS**: search results only; not verified from its own pricing page, so skipped.
- **Agent 37 OpenClaw and InstaPods OpenClaw**: both exist (Agent 37 sells OpenClaw on identical tiers; InstaPods lists OpenClaw on its $15 Grow plan) but were left out of the OpenClaw set to keep it at six; they are already represented under Hermes and n8n respectively.
- **Elestio OpenClaw**: Elestio's catalogue also lists OpenClaw, but its pricing is generic managed-VM pricing already captured under n8n; not duplicated.

## Unknowns

- **Hermes Cloud per-instance prices**: the size table is on `portal.nousresearch.com/agents/new`, which redirects to sign-in. Only the billing model, the $2 minimum and the Portal subscription tiers are public.
- **Hostinger OpenClaw machine size**: no CPU, RAM or disk figures anywhere on the OpenClaw page.
- **Hostimul**: only a $9/mo starting price; no tiers, machine size, trial, renewal or country.
- **MyClaw**: free trial, refund policy, company, country and terminal policy are behind collapsed FAQ items or unpublished.
- **FlyHermes, Render, RunOnFlux**: operating company and country are not published on the pages read.
- **OneClickClaw**: the terms name Greek law and Athens courts but not the legal entity; hosting is Denmark via Webdock.
- **Nous Research country**: the docs name Nous Research as the builder but the pages read do not state a jurisdiction.
- **Messaging channels**: RunOnFlux and MyClaw do not publish a channel list; Hermes Cloud publishes Telegram, Discord, Slack, Email and CLI.

## Tool spend

- **Context MCP only.** Today's account usage was 341 credits / 337 requests across the whole account (all threads), which cannot be attributed to this thread; my own calls were roughly 90 scrapes/searches. No other paid research tool was used, so incremental spend outside the existing Context subscription is **$0**. No balance top-up, no account creation, no purchase.
- Context reported 51,003 credits remaining in the current period at the end of the work.

## Delivery state

- Files written locally: `research/incoming/managed-hosting/managed-hosting.json` and this note.
- **Not committed, not pushed, no site files touched.** Nothing was published.

## Parent integration, 2026-10-30

Integrated by https://ampcode.com/threads/T-01a188d2-e3f1-734f-8aed-80041812cbe2 into `usecases.json` `managed`
(OpenClaw 6, Hermes 4, n8n 5).

- **Left out:** Agent 37's Hermes plan, because Agent 37 is already a listed provider with a Hermes route and pick.
- **Re-checked on a fresh Firecrawl render (maxAge 0):** all 15 displayed quotes. The JavaScript-rendered pages
  were n8n, openclawai.io, Hostinger, Hostimul, InstaPods and RunOnFlux.
- **n8n:** the rendered pricing page defaults to annual billing and shows "$20/mo, billed annually" (USD in this
  render; the worker saw €20, so the currency likely follows the visitor's location). The worker's "$24/mo, billed
  monthly" sits behind the billing toggle and could not be re-read, so the site shows the annual figure only.
- **Quotes replaced with fuller visible text:** openclawai.io ("Plans from $19.9/mo · …"), MyClaw ("LITE … $16.6 /mo
  $29 /mo Yearly $199"), RunOnFlux, FlyHermes and InstaPods (the Markdown link syntax was removed).

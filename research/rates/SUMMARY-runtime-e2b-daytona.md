# Rates check — Runtime, E2B, Daytona

Disclosure: battleships.dev, cited in this document, is built by the Boat team; Boat is one of the providers compared here. It is used as a cross-check, never as the sole source of a rate or verdict.

Checked 2026-10-29 against each provider's live pricing page and docs, plus Battleships' card
(`https://battleships.dev/data/providers/<id>.json`, generated 2026-10-14). No account was created,
no sandbox was started, and nothing was billed. Every number in the three JSON files carries a source
URL and a quote; quotes were machine-checked against the fetched page text.

Files written:

- `runtime.json` — Runtime (withruntime.com), id `withruntime`
- `e2b.json` — E2B, id `e2b`
- `daytona.json` — Daytona, id `daytona` (also cross-checked the separate `daytona-windows` card)

## What changed since the 2026-10-28 profiles

**Runtime — no rate or limit change found.** The pricing page is dated 2026-10-26 and still lists
$0.025 per active vCPU-hour, $0.0075 per reserved GiB-hour, $0.08 per decimal GB per 30-day month
for paused storage and snapshots, 100 GiB/month free egress then $0.02/GB, and a $5/30-day IPv4.
Paid limits are still 100 sandboxes at once (200 with auto top-up), 16 vCPU / 64 GiB / 400 GiB disk
per sandbox, 200 vCPU / 400 GiB across running sandboxes. Plans remain a private beta with no
published prices. The free tier is still 100 GiB-hours of memory + 25 vCPU-hours, 4 sandboxes at
once, 2 vCPU / 4 GiB / 10 GiB each, and **5** sandboxes kept.

**E2B — storage is now explicitly free.** The pricing page's rate table now has a `Storage | Free`
row and the page says "Sandbox storage is included with every plan at no extra cost." Our profile
said more-than-included disk and snapshot storage had no published price; that gap is closed for
sandbox storage, though there is still no per-GiB price for exceeding 10 GiB (Hobby) or 20 GiB
(Pro). Per-second rates, plan fees, concurrency and session limits are unchanged. The old
default-size conflict is still live: the pricing page says 2 vCPU / 4 GiB, the billing FAQ says
2 vCPU / 512 MiB.

**Daytona — one GPU price moved, everything else held.** The live on-demand GPU table now shows
**B300 at $6.25/h**, where Battleships has $7.10/h (its own note says it "corrected 6.25 -> 7.10").
B200 is $6.25/h on both. vCPU $0.0504/h, memory $0.0162/h, storage $0.000108/GiB-hour after the
first 5 GiB, Windows $0.0858/vCPU-hour, and the four tier pools are unchanged. The Tier 1 memory
contradiction (10 GiB in the Tiers table, 20 GiB in the Limits table on the same page) is still
there. The Windows rate is still readable as either a replacement or a surcharge.

## Diffs

| Provider | Field | Ours (2026-10-28) | Battleships | Live (2026-10-29) | Source |
|---|---|---|---|---|---|
| Runtime | free-tier sandboxes kept | 5 | 10 | 5 | [Free usage](https://withruntime.com/docs/included-usage) — "At most 5 sandboxes kept, running, paused or stopped." |
| Runtime | CPU floor | 50 millicores | `active_floor: 0` (its note says the 0.05-vCPU floor cannot be encoded) | 50 millicores | [Pricing](https://withruntime.com/pricing) — "the default CPU floor of 50 millicores, a twentieth of a vCPU" |
| E2B | disk price | not published past the included 10/20 GiB | `null` | Free | [Pricing](https://e2b.dev/pricing.md) — "\| Storage \| Free \|" |
| E2B | included disk | 10 GiB Hobby / 20 GiB Pro | 20 in `storage.included_disk_gib` (Hobby plan note says 10) | 10 GiB Hobby / 20 GiB Pro | [Price FAQ](https://docs.e2b.dev/faq/calculate-sandbox-price) — "\| Disk \| Included (10 GiB Hobby / 20 GiB Pro) \| Included \|" |
| E2B | EU/APAC regions | all plans, workspace verified by adding a payment method | "Pro plan and above" via support | all plans, workspace verified by adding a payment method | [Egress IP ranges](https://docs.e2b.dev/faq/egress-ip-ranges) — "All plans, workspace verified by adding a payment method" |
| Daytona | on-demand B300 | not in the profile | $7.10/h | $6.25/h | [Pricing](https://www.daytona.io/pricing) — "On-demand ($/hour) / Nvidia B300 / $6.25/h" |
| Daytona | Tier 1 memory | 10 GiB, with the page's 20 GiB contradiction noted | 10 | 10 GiB (Tiers table) and 20 GiB (Limits table), same page | [Limits](https://www.daytona.io/docs/en/limits) — "\| Tier 1 \| 10 / 10GiB / 30GiB \| Email verified \|" |
| Daytona | Windows rate | ambiguous (replacement or surcharge) | $0.0858 replacement on the `daytona` card; $0.1362 total on the `daytona-windows` card | $0.0858/vCPU/h as a separate OS line | [Pricing](https://www.daytona.io/pricing) — "OS / Windows / $0.0858/vCPU/h" |

### Conversions that look like diffs but are not

Battleships stores some rates per GiB-month where the vendor quotes per decimal GB, and uses a
730-hour month:

- Runtime paused storage/snapshot: $0.08/GB-month = **$0.0859/GiB-month** (`0.08 × 1.073741824`).
- Runtime volume: **153 microdollars/GiB-hour = $0.000153/GiB-hour = $0.11016/GiB** per
  720-hour month.
- Runtime volume backup: $0.02/GB-month = **$0.02147/GiB-month** (`0.02 × 1.073741824`).
- Runtime egress: $0.02/GB = **$0.02147/GiB**.
- Daytona storage: $0.000108/GiB-hour = **$0.07776/GiB per 720-hour month**; Battleships has
  $0.07884, which is 730 hours at the same hourly rate.

The JSON keeps the vendor's original unit in `original` and the converted figure alongside it.

## Could not confirm

- **Runtime plan prices.** Plans are in a private beta; only the members see them. No dollar figure
  is public. Enterprise/custom limits are also quote-only.
- **E2B egress.** No bandwidth or egress price is published on the pricing page or in billing docs.
- **E2B volumes.** Private beta, no published price. Snapshot storage has no separate line; only
  "Storage: Free" for sandbox storage.
- **E2B Enterprise rates.** The $3,000/month minimum is published; the negotiated discount is not.
- **E2B Hobby custom sizes.** The pricing page says "Default sandbox CPU and RAM" for Hobby and
  "Custom sandbox CPU and RAM" for Pro, while the pricing Markdown says sandboxes can be configured
  with 1–8 vCPU and 1–8 GiB without naming a plan. The entitlement is unresolved.
- **Daytona egress.** No bandwidth price on the pricing page or in the docs index.
- **Daytona snapshot storage.** Snapshots "remain billed for storage" after deletion, but no
  separate snapshot rate is published; only the $0.000108/GiB-hour storage meter.
- **Daytona Windows.** Whether $0.0858/vCPU-hour replaces the $0.0504 compute rate or is added to
  it. The two Battleships cards disagree with each other.
- **Daytona archived-data retention.** Auto-archive defaults to 7 days and stops billing, but how
  long archived data is kept is not published. Auto-delete is off unless set.
- **Daytona startup credits.** The pricing page says up to $50k; the startups page said up to $100k
  in our 2026-10-28 profile. I did not re-check the startups page for this rates pass.
- **Hermes Agent on Runtime.** No guide, template or managed option exists in Runtime's docs;
  `/docs/hermes.md` and `/docs/openclaw.md` return 404. The manual route (browser shell + install
  script + `persistent: true`) is inferred from Runtime's sandbox and persistence docs, not a
  Runtime-endorsed Hermes recipe, and was not run.
- **Dashboard-only Hermes.** E2B's Hermes page starts with the CLI; no console-only flow is
  documented. Daytona and Runtime can create a sandbox and open a browser terminal, but the agent
  setup still needs typed commands.

## Deploy summary

- **Runtime:** manual only. Browser shell from Home, install Hermes with its installer, set a model
  key, keep the sandbox persistent. No one-click or template. Not tested.
- **E2B:** official pre-built `hermes` template and guide (`e2b sbx create hermes`); OpenClaw has
  its own gateway guide. Not one-click, and no documented dashboard-only route.
- **Daytona:** official OpenClaw guide — OpenClaw is preinstalled in the default snapshot, one
  `daytona sandbox create` command plus SSH onboarding. Hermes lists Daytona as a built-in terminal
  backend (`terminal.backend: daytona`, `DAYTONA_API_KEY`), so Hermes runs locally and drives a
  Daytona workspace; no Daytona-hosted Hermes guide. Dashboard Playground + web terminal removes
  the local install but not the commands.

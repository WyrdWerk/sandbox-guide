# Rates refresh — Sprites, Morph, Blaxel

Disclosure: battleships.dev, cited in this document, is built by the Boat team; Boat is one of the providers compared here. It is used as a cross-check, never as the sole source of a rate or verdict.

Checked 2026-10-29 against the live pricing and documentation pages. Starting point was `research/sprites.md`, `research/morph.md` and `research/blaxel.md` (2026-10-28). Battleships cards were read as a secondary source only; its `index.json` was generated 2026-10-14, so its "live" values can be two weeks older than this check.

Method: TinyFish Fetch for every page body, direct HTTPS reads for the Battleships JSON. Context.dev was not needed because TinyFish returned usable text for all pricing and doc pages. 140 quoted fragments were checked verbatim against the fetched page text. All 39 unique documentation URLs in the three files were re-fetched and returned content; one 10-URL batch hit a gateway timeout and was retried successfully.

Battleships ids used: `sprites`, `morph-cloud`, `blaxel` (the Morph card id is `morph-cloud`, not `morph`). Its `index.json` is dated 2026-10-14, so its values can lag this check by two weeks.

Files: `sprites.json`, `morph.json`, `blaxel.json`, this summary.

## What changed since the 2026-10-28 research

### Sprites

- **The billing increment is stated explicitly on a live page.** The checkpoint product page says compute bills per second and storage hourly, aggregated monthly; the 10-28 file listed billing rounding as unpublished. The pricing page and FAQ still say "per hour", so the files record per-second compute and flag the wording conflict. This may be a page the earlier pass missed rather than a change.
- **Concurrency and creation limits are published, and were missing from the 10-28 file.** Hero allows 100 running plus 100 warm Sprites; creation is 10/minute on pay-as-you-go, 60/minute on Adventurer and 240/minute on Mythic.
- **The plan ladder is still mostly unpublished.** The pricing page still says "No plans and no tiers"; the FAQ confirms only Hero ($100, 1,200 CPU-h / 4,800 RAM GB-h / 150 GB) and Mythic ($2,000, 28,000 RAM GB-h). Adventurer, Veteran, Champion, Legend and Epic are named but have no published fee.
- **Rates, minimums and free credit are unchanged.** $0.0385/CPU-h, $0.021875/GB-h, $0.000683/GB-h hot, $0.000027/GB-h cold, 0.0625 CPU and 256 MB RAM minimums, one $30 trial credit per user and per org.
- **RAM is still not a published size.** The lifecycle page says there is no single RAM figure; 16 GB survives only on marketing pages.

### Morph

- **The free-tier conflict is three-way on live pages.** The pricing table shows 0 starting MCUs, the Plans doc says "300 MCUs free", and the Signing Up page says "300 free compute hours per month". The FAQ says credits are measured in MCUs, not hours. The 10-28 file knew only the last two.
- **Per-second compute is confirmed** in Exhibit B of the terms; the 10-28 file had already picked this up, Battleships still lists granularity as unpublished.
- **The 1 MCU/hour floor is still documented** on the live disk-capacity page: `max(1, vCPUs, ceil(memory_MiB/4096), ceil(disk_size_MiB/16384))`.
- **Prices are unchanged:** $0.05/MCU, Team $40 for 1,000 MCUs, Scale $250 for 7,500 MCUs, Volumes $0.0054794/GiB-hour (~$4.00/GiB-month).
- **Regions, egress pricing and custom domains are still undocumented.**

### Blaxel

- **Blaxel publishes an official OpenClaw tutorial that the 10-28 file did not record.** `docs.blaxel.ai/Tutorials/OpenClaw.md` walks through a manual install in a sandbox. No Hermes Agent guide or template was found.
- **The pricing page's tier table matches the 10-28 file**: Tier 0 free with 10 sandboxes, Tier 1 $20/month minimum top-up with 50, Tier 2 $50 with 200, Tier 9 contact with 100,000+. It still publishes no per-tier sandbox size cap.
- **The Agents Hosting doc states a 15-minute maximum runtime**, which rules it out as an always-on home for a personal agent. The 10-28 file did not note this.
- **Rates are unchanged:** $0.0000115/GB RAM-second, snapshot storage $0.20/GB-month, images $0.045/GB-month, volumes $0.12/GB-month, egress included, dedicated IPs and Agent Drive free during beta.
- **The 5-second vs 15-second idle conflict is still live** between the pricing FAQ and the sandbox docs.
- **The Baseten acquisition still has no visible pricing effect.** Blaxel branding, pricing and docs are unchanged; Baseten-managed workspaces are documented.

## Diffs recorded in the JSON

| Provider | Field | Disagreement |
| --- | --- | --- |
| Sprites | plans | Battleships carries a full 7-tier ladder from a January community post; live pages confirm only Hero and Mythic. |
| Sprites | compute.billingIncrement | Live product page says per-second compute; pricing page and FAQ say hourly. Battleships records a zero minimum. |
| Sprites | compute.cpuFloor | Battleships `active_floor: 0`; live page still publishes 0.0625 CPU and 256 MB RAM minimums. |
| Sprites | plans[].maxConcurrent | Battleships has a per-tier ladder; live publishes only Hero's 100 + 100. |
| Sprites | compute.fixedSizes[].ramGiB | Battleships and marketing say 16 GB; lifecycle doc says no published RAM figure. |
| Sprites | storage.snapshotStorage | Battleships assumes checkpoints bill as cold storage; live says kept blocks are billed without naming a rate. |
| Morph | freeTier | 0 MCUs vs 300 MCUs vs 300 hours, all live. Battleships says no free credit. |
| Morph | storage.volumes / EFS | Battleships adds EFS at $0.12–$0.18/GiB-month; no EFS line exists on the live pricing page or Volumes doc. |
| Morph | compute.billingIncrement | Live terms say per-second; Battleships says unpublished. |
| Morph | compute.floor | Live doc has the `max(1, …)` floor. Battleships' shorthand formula is written without `max(1, …)`, but its on-demand mode sets `min_vcpu: 1` separately, so this is not a demonstrated floor undercharge. Its disk-dominated limitation is the real gap. |
| Morph | storage.retention | Battleships says snapshots have no default TTL; live docs only say TTL is opt-in. |
| Blaxel | plans[Tier 0].limits | Battleships lists a 2 vCPU / 4 GiB cap it could not re-verify; live publishes none. |
| Blaxel | plans[].monthlyFeeUsd | Live calls Tier 1/2 amounts minimum top-ups, not fees; Battleships encodes them as fees flagged as credit. |
| Blaxel | compute.idleTimer | 5 seconds (pricing FAQ) vs 15 seconds (docs), both live. |
| Blaxel | compute.billingIncrement | Live billing doc confirms GB-second metering; Battleships says minimum billed seconds are undocumented. |
| Blaxel | storage.snapshotStorage.billedOn | Battleships assumes snapshot size ≈ allocated RAM; live never states the basis. |

## Could not confirm

- **Sprites:** fees and allowances for Adventurer, Veteran, Champion, Legend and Epic; whether hot and cold storage bill the same bytes simultaneously; which storage rate applies to checkpoint blocks; the pay-as-you-go concurrency cap; any minimum invoice or per-start minimum; whether 16 GB is a real per-Sprite ceiling; native custom domains; selectable regions.
- **Morph:** which of the three free-credit statements is true; per-instance maximum vCPU/RAM/disk; GPU availability; regions; egress price; custom domains; whether snapshot storage bills allocated or written bytes; EFS prices (Battleships-only); retention of the implicit snapshot created by pausing.
- **Blaxel:** per-tier sandbox size caps; whether snapshot storage bills allocated RAM, written bytes or both; minimum billed duration; archive storage price; the exact promotional credit grant per account; whether Tier 0 is really capped at 4 GiB.
- **Deploy:** no provider has a one-click or managed Hermes Agent option. Sprites' only official Hermes integration is a terminal backend that keeps Hermes on your own machine. Blaxel has an official but manual OpenClaw tutorial. Morph has neither, only a Claude Code example. None of the three lets a non-coder install and supervise an agent from the dashboard alone.

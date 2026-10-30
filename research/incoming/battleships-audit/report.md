# Independent Battleships audit, 2026-10-30

**Bottom line:** Botperch should not replace its newer rates with Battleships wholesale. Many differences are stale Battleships entries or deliberately different product scopes. However, this audit found **26 grouped Botperch corrections**: 16 pricing, feasibility or pricing-content issues, and 10 disclosure, sourcing or attribution issues. Another 10 findings remain unresolved. No site data, source code, baseline, commit or remote branch was changed.

Battleships is built by the Boat team, and Boat is a provider in both comparisons. Its own introduction says: “Built by the boat.dev team; boat.dev is held to the same rules as everyone.” It is a secondary cross-check here, never the authority for a provider tariff. [1]

## Scope, counts and how to read the findings

- Starting point: freshly fetched `origin/main`, commit `197302e1584ef80b6aca1465df5ae4f7f284c297`. Local `main` equalled that commit before writing these two audit files.
- Searched `site/src`, `research/` and `README.md`, excluding the new audit's self-references. The original search contained **57 files and 628 matching lines**: 41 research files, 15 site source files and README. A line is not a distinct claim.
- There are **19 executable Botperch rate cards**, of which **18 overlap** with Battleships. Sandboxer has no indexed card. Battleships' index has **369 providers**, generated on 2026-10-14. Its card dates are not all the same, and a company's checked date is not necessarily its pricing date. [1][2]
- Downloaded the overlapping JSON and Markdown cards, presets, and six workload-ranking files. Also read the separate Daytona Windows card to check an attribution about inconsistent Windows pricing; that is not a nineteenth overlapping Botperch provider. [3]
- `findings.json` contains **54 grouped records**, each with both sides, a live-source URL, verbatim quote, checked date, verdict and proposed fix. Record numbers below are its one-based array positions. All quotes were checked against the retrieved text, then interpreted in context.

| Verdict | Records | Meaning |
|---|---:|---|
| `botperch-right` | 18 | Preserve Botperch's interpretation on this specific field; Battleships is stale, uses an unsupported assumption or models less of the contract. |
| `battleships-right` | 18 | Correct the specified Botperch passage/model. For disclosure and provenance records this means Battleships' attributed fact is right, not that Battleships may replace a primary citation. |
| `both-wrong` | 8 | Each side misses a rule, unit or current detail, sometimes in opposite directions. |
| `unclear` | 10 | The official material conflicts, omits a tariff or cannot determine the billed quantity. No winner is asserted. |

The 26 correction count is the 18 `battleships-right` plus 8 `both-wrong` records. It is **not 26 providers** or 26 changed headline rates. It includes grouped disclosure gaps and stale research summaries. Within it, 16 records concern pricing/shape/content fields and 10 concern disclosure/sourcing/attribution. Findings marked `unclear` are additional limitations, not established undercharges or overcharges.

## Botperch's pricing corrections

Every source in this section was fetched on **2026-10-30**. Quotes are `docs-confirmed` or `pricing-page`; arithmetic and impact examples are this audit's calculations. These are desk findings, not observed provider invoices.

| Provider; finding | Botperch problem and independently supported correction | Primary evidence |
|---|---|---|
| Agent 37; 11 | The summary says per-minute but the engine prorates fractional seconds. Model minute metering; do not assume a specific final-partial-minute rounding rule without clarification. | “The monthly price is the rate; the wallet is metered per minute (the monthly price divided by 730 hours, divided by 60).” [4] |
| Blaxel; 54 | CPU cannot be selected independently of memory. The engine accepts 6 requested CPUs with 8 GiB, although that documented memory size supplies 4 cores. Warn or constrain the mapping. The documented 16-GB/6-core option is $0.6624/hour. | “a sandbox with 8 GB memory is allocated 4 CPU cores, while one with 16 GB memory is allocated 6 CPU cores.” [5] |
| Boat; 13 | `xlarge` incorrectly qualifies for the sole encoded $20 plan. It requires $100 or more. A one-hour 16/32 example returns $20 and feasible, rather than the required $100 payment. Battleships also wrongly retains a contact/operator requirement. | “xlarge needs the $100 plan or higher. Subscribe from Dashboard > Billing, then pass --type xlarge. You do not need to contact us.” [6] |
| Cloudflare; 23 | Disk sizes, rate and allowance are decimal GB, while the shared model labels them GiB. 20 GB is about 18.626 GiB. Named-shape billing at the native provisioned amount can still be correct, but the displayed capacity and fit test are wrong. Battleships has the same unit relabeling. | “200 GB-hours/month” and “+$0.00000007 per additional GB-second”; its adjacent RAM line explicitly says GiB. [7] |
| Cloudflare; 51 | `egress.included` correctly lists an allowance but the note says not included. Its `perGiB` also copies $0.025/GB without conversion, as Battleships does. Use $0.0268435/GiB or retain native GB. Egress is not added to Botperch totals. | “Price per GB”, “North America & Europe”, “$0.025”, “1 TB”. [7] |
| DigitalOcean; 27 | Botperch enforces $0.01 but omits the 60-second floor. Battleships enforces 60 seconds but omits $0.01. Apply the greater of actual usage, 60 seconds at the chosen rate and $0.01. At $1/hour a one-second run must cost at least $0.0166667, not $0.01. | “Bundled-plan CPU Droplets are billed per second with a minimum charge of 60 seconds or $0.01, whichever is higher.” [8] |
| Instabox; 32 | The first 20 GiB of `/data` must be excluded in every lifecycle state. Botperch charges all requested disk. At 730 hours it overstates pre-credit usage by $1.606 per kept machine. | “each paid sandbox's `/data` beyond its free 20 GiB, by the second while it exists (running, paused or stopped)”. [9] |
| Instabox; 33 | Rename Max/Ultra to Builder/Team and enforce the plan's CPU/RAM pairs and disk ceiling. A 16/32 run currently selects Pro at $20; it requires Builder at $100. Battleships still models the old unpriced beta. | “Pro: 2/4, 4/8, 8/16. Builder: 2/4 up to 16/32. Team: 2/4 up to 32/64 (vCPUs/GiB).” Disk ceilings are 200/500/1024 GiB. [10] |
| Instabox; 34 | Replace the note's egress not included with beyond the included allowance, and include Team in the allowance label. | “Each plan includes egress every month (100 GiB on Free, 1 TiB on Pro, 5 TiB on Builder, 50 TiB on Team), then $0.02 per GiB.” [11] |
| Runtime; 41 | Storage's nominal month is 720 hours, not 730. Better use the published rounded 119 microdollars/GiB-hour directly. Botperch is 1.37% below the nominal rate, about 1.1% below the rounded tariff. | “$0.08 per decimal GB per 30-day month, 119 microdollars per GiB-hour”. [12] |
| Runtime; 42 | Deduct the recurring paid-account resource buckets: 25 active vCPU-hours and 100 GiB-hours RAM/month, worth at most $1.375/month at current rates. Battleships' `free.conditions` correctly describes this; `included_usd:0` must not be misread as no resource allowance. Its engine was not executed. | “account that has paid (bought credit) gets it every calendar month.” The same table lists the two quantities. [13] |
| Tensorlake; 44 | Pro has lower CPU/RAM/root-disk rates: $0.042/$0.009/$0.0001 versus prepaid $0.07/$0.015/$0.0002. Botperch applies prepaid rates to all plans. Its explanatory note admits this, but the resulting Pro estimate remains overstated. | Billing table columns Usage Credits / Pro: “Active CPU per core-hour” $0.07/$0.042; RAM $0.015/$0.009; root disk $0.0002/$0.0001. Exact escaped Markdown is retained in finding 44. [14] |
| Tensorlake; 45 | Convert $0.07/GB-month snapshot storage using 720 hours, not 730. The current hourly rate is 1.37% low. | “Snapshot storage uses a fixed 30-day month.” [15] |
| Vercel; 46 | Apply the one-minute memory minimum/increment, without inventing an active-CPU minimum. Botperch applies neither; Battleships' single 60-second field affects CPU too. Four GB for one second has at least $0.001413333 RAM usage before allowances, not $0.0000235556. | “Provisioned memory is billed in 1 minute minimum increments to account for sandbox lifecycle management.” [16] |
| Vercel; 47 | Enforce 2 GB memory per vCPU and supported CPU counts. For example, 2 vCPU/1 GB cannot be priced as only 1 GB; that shape has 4 GB. | “Each vCPU includes 2 GB of memory.” The same page permits 1 or an even number of vCPUs and lists plan maximums. [16] |
| Sprites; 49 | `changes.json` incorrectly says Mythic is $100/month. Hero is $100; Mythic is $2000. The current Sprites rate card already gets those two names/prices right. | “Hero ($100/mo)” and “at $2,000/mo the plan cost more than the overage it saved” in the Mythic example. [17] |

The shared workload inputs say GiB, but several providers publish GB without a binary-byte definition. Cloudflare explicitly distinguishes GB disk from GiB RAM, and Runtime explicitly says decimal GB, so those unit conclusions are stronger than guessing a universal conversion for every provider's GB label. No undocumented universal GB/GiB correction was imposed.

## The other ten confirmed Botperch corrections

1. **Disclosure in research, finding 1:** 31 files omit a document-level Boat disclosure, listed below. Seven already disclose it. Three mention absence/non-use only.
2. **Disclosure in exports, finding 2:** the live provider Markdown exports for Agent 37, boxd and Modal cite/name Battleships but do not identify its ownership. Their JSON records also carry no standalone disclosure. The HTML footer does not travel with these files. [18]
3. **boxd research funding, finding 3:** the opening summary still says funding rests on Battleships alone. Later in that same file, and in the published company record, there is already a primary announcement. The live announcement confirms €2M and its named investors. Correct the stale passage; do not report the published funding fact as Battleships-only. [19]
4. **Agent 37 backup limit, finding 4:** a research sentence cites only Battleships for one on-demand backup per 15 minutes. The provider now says exactly “One on-demand backup per instance every 15 minutes; a second call inside the window returns `429 rate_limited` with a `Retry-After` header.” Replace the citation, not the limit. [20]
5. **Lizard credit attribution, finding 6:** `fee_is_credit:true` plus a $19 fee is $19 included usage even when `included_usd` is zero. The research disagreement is false; Botperch's executable `fee:19, credit:19` is right. [21]
6. **Morph floor attribution, finding 7:** Battleships' shorthand lacks `max(1,...)`, but its mode already has `min_vcpu:1`. Do not claim a demonstrated sub-one-MCU undercharge for a supported request. Its acknowledged missing disk-binding term is a separate, real limitation. [22]
7. **boxd stale-summary attribution, finding 8:** the rate summary criticizes `research/boxd.md` as if it still says the whole Battleships card is stale. That file now correctly distinguishes a current headline/JSON from an obsolete narrative table. Preserve that distinction.
8. **Workload source targets, finding 9:** utilization claims sometimes link to `presets.json`, where the fields do not exist. Link to the corresponding ranking. Label reduced workloads such as 20,000 interpreter runs or 160 coding hours as Botperch adaptations, not literal Battleships presets. The measured-looking percentages are model assumptions, not independent provider measurements. [23]
9. **Modal constant multiplier, finding 10:** the profile says two CPU-unit interpretations differ by 1.6x on every cost estimate. The CPU line differs by 2x; totals depend on RAM, credits and fees. The provider labels a physical core as “2 vCPU equivalent”. This does not establish guest CPU count or measured performance. [24]
10. **boxd operator summary, finding 53:** the same stale opening research paragraph repeats Azin Tech Holding, although its later section and the published company record correctly name Azin Tech Operating Company B.V. The live terms confirm the latter contracting entity. [25]

## No executable rate was sourced only to Battleships

The executable rate-card `sources` all point to providers, not Battleships. The Modal CPU caveat cites Battleships as the alternative interpretation alongside the provider's own core definition. No Battleships URL was found as a sole feature/capability verdict source in `site/src/data`.

This is not a blanket clearance of every raw research statement. Besides the two stale/sole-source passages above, **Lizard's raw research has categorical negatives based only on Battleships or on silence**: nested virtualization, raw TCP/public IPv4, secret proxy and HIPAA are examples. Finding 5 recommends `not-published` unless direct negative documentation can be supplied. A provider statement that the public CLI lacks custom-template upload cannot prove those unrelated negatives. Other statements in the same notes already use unverified/not-published appropriately. [26]

The site's workload assumptions can legitimately come from Battleships. They determine illustrative costs but are not provider tariffs or proof of performance. Calling those assumptions measured would overstate the evidence.

## Citation inventory and disclosure disposition

This is a file inventory, not a requirement to repeat an ownership disclaimer after every sentence in a long research document. The undisclosed-file count is a minimum: it catches documents with no disclosure at all. Standalone exports need their own context.

### Site and README: all 16 matching files

| File | Disposition |
|---|---|
| `README.md` | Explicit ownership and cross-check-only rule. |
| `site/src/layouts/Base.astro` | Explicit global HTML-footer disclosure. |
| `site/src/components/Quote.astro` | Appends ownership when the evidence URL is Battleships. |
| `site/src/components/CompanyFacts.astro` | Same conditional ownership disclosure. |
| `site/src/pages/use-cases/[id].astro` | Adds ownership to Battleships need-source links. |
| `site/src/pages/how-we-checked.astro` | Explicit ownership and cross-check policy. |
| `site/src/pages/costs/how-it-works.astro` | Explicit ownership; current Boat disks and Modal documented-unit arithmetic verified. Its acknowledgement of approach does not import Battleships code. |
| `site/src/pages/changes.astro` | Explicit ownership in the comparison referral; uses shared Quote component. |
| `site/src/data/site.json` | Methodology explicitly discloses Boat. The confidence-label example is a definition, not an evidence citation. |
| `site/src/data/providers/boat.json` | Its disagreement paragraph itself identifies the Boat connection. Current disk/retention/operator disagreements are real. |
| `site/src/data/providers/agent37.json` | HTML footer context only; standalone exports missing disclosure. Its snapshot caveat distinguishes checkpoint/cold-storage semantics rather than falsely denying pause memory. Its $5-credit history is historical: the current primary and Battleships both say $5. |
| `site/src/data/providers/boxd.json` | HTML footer context only; standalone exports missing disclosure. Static egress remains explicitly unconfirmed, not an unsupported No. Published funding uses the company announcement. |
| `site/src/data/providers/modal.json` | Quote component discloses its evidence in HTML; export does not. Fix the constant 1.6x-total statement. |
| `site/src/data/pricing/modal.json` | HTML global disclosure only; this card is also embedded in the provider JSON export. Preserve the documented-vCPU-equivalent label and untested guest behavior. |
| `site/src/data/changes.json` | Quote component discloses the Sprites third-party citation in HTML. The old $0.07/$0.04375 narrative really persists in Battleships, but its numeric card is current. Fix Mythic's price. |
| `site/src/data/usecases.json` | Source-list labels disclose Boat; HTML need citations add it. Correct source targets and separate adaptations from quoted preset facts. The Markdown source list retains the disclosure; individual need citations do not repeat it. |

The affected live exports were fetched, not inferred solely from the route generator. `site/src/lib/agents.ts` and `site/src/pages/data/[...path].ts` explain why the footer/component disclosure is not included in provider Markdown/JSON. These generators have no Battleships string and therefore are not counted among the 57 matching files. [18]

### Research: seven documents already disclose ownership

`research/boat.md`, `research/blaxel.md`, `research/lizard.md`, `research/usecases.md`, `research/usecases.json`, `research/usecases2.md`, `research/usecases2.json`.

### Research: 31 documents need disclosure

Provider notes, 11:

- `research/agent37.md`
- `research/boxd.md`
- `research/cloudflare-sandbox.md`
- `research/daytona.md`
- `research/e2b.md`
- `research/instabox.md`
- `research/modal.md`
- `research/morph.md`
- `research/sprites.md`
- `research/vercel-sandbox.md`
- `research/withruntime.md`

Rate artifacts, 14:

- `research/rates/agent37.json`
- `research/rates/blaxel.json`
- `research/rates/boat.json`
- `research/rates/boxd.json`
- `research/rates/cloudflare-sandbox.json`
- `research/rates/daytona.json`
- `research/rates/e2b.json`
- `research/rates/instabox.json`
- `research/rates/lizard.json`
- `research/rates/modal.json`
- `research/rates/morph.json`
- `research/rates/runtime.json`
- `research/rates/sprites.json`
- `research/rates/vercel-sandbox.json`

Five rate summaries and one methodology note:

- `research/rates/SUMMARY-agent37-instabox-lizard.md`
- `research/rates/SUMMARY-boat-sandboxer-boxd.md`
- `research/rates/SUMMARY-modal-cloudflare-vercel.md`
- `research/rates/SUMMARY-runtime-e2b-daytona.md`
- `research/rates/SUMMARY-sprites-morph-blaxel.md`
- `research/capabilities-NOTES-1-machine-money.md` (declares Battleships cross-check use, even though it does not attach a row to it).

### Research: three mentions do not establish reliance

- `research/sandboxer.md`: no Battleships provider card.
- `research/rates/sandboxer.json`: absence of a card.
- `research/capabilities-NOTES-2-state-staying-on.md`: explicitly says Battleships was not used.

These complete the 41-file research inventory. Historical notes are not equivalent to current published verdicts. Correct their contradictory summaries without restoring older data over newer integrated sources.

## All 18 overlapping executable cards were compared

Rates below are USD. CPU/RAM rates are per hour unless stated otherwise. Monthly-to-hourly conversions use the provider's specified denominator when available; equal-looking monthly values are not proof that either calculator uses the right denominator. Product modes, discounts, seats and plans absent from the intentionally narrower Botperch card are identified as scope differences rather than invented zero prices.

| Botperch ID / Battleships ID | Shared contract, differences and disposition |
|---|---|
| `agent37` / `agent-37` | Standard $0.80/CPU-month, $0.70/GB-month, $0.09/GB-month disk divided by 730 match. Disk continues while stopped/sleeping. Performance 4x and VM 2.5x are separate, excluded compute types, not alternative prices for Botperch's default. Current free credit is $5, not a recurring allowance. Minute-meter omission is finding 11; Battleships' stale CPU shapes are finding 52. Its $0.03/GB-month is compressed cold storage, not an ordinary stopped-disk price or a general named-snapshot product. [4][27] |
| `blaxel` / `blaxel` | Active RAM $0.0414/GB-hour and persistent volumes $0.12/GB-month match. Standby snapshot $0.20/GB-month is separately published and explicitly excluded by Botperch because stored quantity is unknown. Battleships tier fees of $20/$50 describe rolling real top-ups that become wallet credit, not an additional service subscription. The provider says “Top-ups are not flat fees”. Botperch's model omits quota gates rather than charging a separate subscription. CPU mapping needs the correction in finding 54. [5][28][29] |
| `boat` / `boat` | Flat small/default/large/xlarge $0.018/$0.036/$0.072/$0.20 match. Botperch's 51/51/111/251 disks beat stale 12/50/125/251. $20 plan fully credited, but xlarge needs $100. Stopped disk lasts 14 days, not the machine's indefinite life. No current published 2-TB egress cap. Wallet replaced mandatory $20 packs. Extra-seat limits now add 20% below the $2000 plan, with a grandfather exception. Saved snapshots beyond the included count are $0.056/item/day, not a general zero-per-GiB snapshot tariff. Findings 12 through 18. [6][30][31] |
| `boxd` / `boxd` | Current $0.047/vCPU-hour, $0.014/resident-GiB-hour and $0.000096/written-GiB-hour match. Ordinary disk monthly equivalent $0.07008 is just 730 hourly units. No service subscription; one-time trial excluded. CPU stops at standby; resident RAM continues in standby but not hibernation, and written disk continues. Botperch has no distinct warm-standby input, so its kept/stopped case must mean hibernated/stopped, not RAM-resident standby. Named-snapshot tariff, 8/32 access and 50-versus-100 quota remain unresolved, findings 19 through 21. Old narrative rates inside Battleships are real despite its correct current JSON. [32][33] |
| `cloudflare-sandbox` / same | Active CPU $0.072, allocated RAM $0.009 and native-GB disk $0.000252 match before normalization. Workers Paid $5 is a fee, not usage credit. Botperch correctly uses separate 375 CPU-minute/25 GiB-hour/200 GB-hour buckets; Battleships expresses them as $0.7254 but its own prose also correctly says resource-specific. Treating that sum as fungible would be wrong. Native container snapshots are beta; the R2 Standard $0.015 tariff for user-owned directory backups does not establish a native container-snapshot tariff. Findings 22 through 24 and 51. [7][34] |
| `daytona` / same | Linux allocated CPU $0.0504, RAM $0.0162, disk $0.000108 after included 5 GiB match, with disk still billed stopped. Botperch uses the default 10-GiB disk ceiling; higher account tiers, unrestricted networking top-ups and region pools are omitted rather than priced as subscriptions. One-time trial excluded. Findings 25 and 26 cover newer B300 $6.25 versus $7.10 and unresolved additive-versus-replacement Windows pricing. Those excluded product modes are not CPU-card errors. [3][35][36] |
| `digitalocean` / same | All 31 Botperch bundled Basic Regular and CPU-/General-/Memory-/Storage-Optimized Regular shapes match the corresponding Battleships shapes and hourly/monthly prices. Per-second with 672-hour cap; full compute while powered off; destroy ends billing. Extra volume $0.10/GiB-month and egress $0.01/GiB match. Snapshot $0.06/GB-month, backups and newer v5 resource pricing are explicitly excluded. Minimums differ as finding 27. Additional Premium/Agent/GPU modes are different products. [8][37] |
| `e2b` / same | Allocated CPU $0.0504 and RAM $0.0162 match; Hobby $0, Pro $150 fee; 1h/24h session limits. One-time $100 trial excluded. Storage within 10-GiB Hobby/20-GiB Pro is included at no extra cost; paused compute is free. Global 20-GiB Battleships field conflicts with its own correct Hobby prose. EU is now available on every plan after workspace verification, not just Pro/support. Egress and separately priced Volumes remain unpublished. Findings 28 through 30. [38][39][40] |
| `hetzner` / `hetzner-cloud` | Six shared current EU CPX12/22/32/42/52/62 shapes match in size, disk, USD hourly and monthly caps. Botperch additionally includes CPX02; Battleships' lack of that size is omission, not proof of invalidity. CPX22's live public price API confirms $0.0368/hour and $22.99/month in EU. Whole-hour rounding, cap, full stopped billing and optional $0.60/month IPv4 are consistent. Different US/Singapore, ARM, cost-optimized and explicit legacy regimes in Battleships are not contradictory current-EU prices. Native-TB traffic allowances are region/size scoped; generic GiB labels are not a verified byte definition. [41][42][43] |
| `hostinger` / `hostinger-vps` | Shared one-month renewal KVM1/2/4/8 prices match exactly: $19.49/$24.49/$42.99/$73.99, with 1/4/50, 2/8/100, 4/16/200, 8/32/400 sizes. Live catalog first-month prices are $9.99/$13.99/$25.99/$50.99, as Botperch's note says. CPU/RAM/disk are bundled and the payment period continues when powered off. Battleships' lower 12-/24-month and introductory prices buy different commitments, not equivalent month-to-month service. No per-GiB overage; bandwidth is limited by plan and then throttled. No shared-scope numeric error found. Long-commitment promotional amounts were not independently re-priced as a separate product audit. [44] |
| `instabox` / same | Current $0.004 CPU/$0.00225 RAM/$0.00011 extra disk and $20/$100/$500 credited plans beat Battleships' unpriced beta. Free plan now has one 4/8 sandbox; the five-machine launch grant was not a recurring new-user offer. Running CPU/RAM versus storage in every state is consistent with the current provider. Botperch misses included 20-GiB disk, current plan names/gates and coherent egress wording, findings 31 through 34. [9][10][11] |
| `lizard` / same | Small 2/4/5 $0.0162, Medium 4/8/20 $0.0324, Large 8/16/50 $0.0648 match. Extra Persistent Volumes $0.14/native-GB-month used space match. Pause, not stop, preserves state without compute charge; stop deletes. $19 fee returns as usage; current $99/$499 plans add higher limits, not lower unit rates. Pooled vCPU quotas now replace old machine counts. Current docs say contact Lizard beyond 2 TB; they do not repeat a categorical outbound-cutoff promise. Findings 6 and 35. No separately confirmed paused-snapshot tariff. [21][26][45] |
| `modal` / same | CPU $0.070956 per documented vCPU equivalent versus Battleships $0.141912 per Modal/API core is a unit interpretation, not a new price cut or measured throughput finding. RAM $0.024012 matches. Starter $30 credit and Team $250 fee/$100 compute credit match. Request-or-actual maximum, non-preemptible sandbox 3x Function rates, per-second billing, no stopped state. Broad/narrow region premiums 1.15x/1.75x and low-request burst modes in Battleships are optional different configurations. Snapshot/Volume storage lacks a tariff; explicit snapshots are not guaranteed EU-resident. Findings 10 and 36. [24][46] |
| `morph` / `morph-cloud` | $0.05 per max(1, CPU, ceil(RAM/4), ceil(disk/16)) MCU-hour. Team $40 buys $50 of list-value usage; Scale $250 buys $375. Paused snapshot $0.00001/GiB-hour equals $0.0073/month at 730; Botperch includes memory in that quantity. The important Battleships limitation is the acknowledged missing disk-binding term, not the claimed missing one-MCU floor. Developer zero versus 300 starting MCUs conflicts in current first-party pages. EFS notes are not a substitute for the distinct Volumes product. Findings 7 and 37 through 39. [22][47][48] |
| `runtime` / `withruntime` | Active CPU $0.025 and allocated RAM $0.0075 match; Botperch correctly enforces absolute 0.05-vCPU floor. Monthly native-GB storage value agrees after conversion; Botperch uses the wrong hourly denominator. First 10 GiB running disk correctly receives the native-unit conversion. Paid accounts retain recurring CPU/RAM resource allowances. Storage measures unique privately owned disk plus memory-snapshot blocks, not allocated capacity, so both capacity-based estimates have unknown net error. Egress $0.0215/GiB is harmless rounding of $0.02147483648; separate IPv4, volumes and auto-top-up bonus are excluded. Findings 40 through 43. [12][13] |
| `sprites` / same | Current active CPU $0.0385 and actual RAM $0.021875 match. Botperch's awake disk $0.00071 is correctly hot $0.000683 plus cold $0.000027; cold-only stopped cost matches rounded $0.02/month. Botperch's absolute 0.0625 CPU floor is documented; Battleships omits it. Request RAM in Botperch is explicitly an estimate for actual use. One-time $30 trial excluded, egress unmetered. Optional per-resource plan buckets do not invalidate pay-as-you-go, but contradict Fly's own no-plans headline. Correct Mythic, and do not assert a separately confirmed checkpoint tariff. Findings 48 through 50. [17][49][50] |
| `tensorlake` / same | Prepaid resource rates match; Pro lower rates must be modeled separately. $250 Pro equals 25,000 CUs according to pricing, while billing docs/FAQ say plus metered usage; preserve that contradiction rather than resolving it silently. Shared root-disk rates are running-only; suspend bills unique-byte snapshot storage at $0.07 per fixed 30-day month. Free 1/1/10, prepaid 4/16/100 and Pro 16/64/100 gates match. Egress is free; BYOC and paid-pack cash-flow are different from base usage rates. Findings 44 and 45. [14][15] |
| `vercel-sandbox` / same | Base active CPU $0.128 and RAM $0.0212 match; Hobby $0 and Pro $20 fully credited. Botperch correctly keeps separate Hobby CPU/RAM buckets and hard cap rather than treating Battleships' illustrative $12.55 aggregate as fungible. Base snapshot $0.08/GB-month and 64-GB included running disk agree. Add memory-only minimum and fixed CPU/RAM ratio. Creation $0.60/million, data transfer, drives, extra seats and non-base regions are excluded; Pro Flat Rate CDN is not a universal $0.15/GB charge. Findings 46 and 47. [16] |

### Ten unresolved records, not manufactured winners

- **5, Lizard negatives:** silence/Battleships flags cannot establish categorical lack of kernel, network or compliance features.
- **19, boxd named snapshots:** $0.07008 from ordinary written disk is not proof of a separate snapshot tariff. A checkpoint and a named image snapshot are distinct products. [33]
- **20, boxd 8/32:** pricing selector/resources list it, while FAQ says email for it. Botperch should show that access caveat; do not claim the contradiction is resolved. [33]
- **21, boxd quota:** live pricing says 100, FAQ/resources say 50. Preserve both. [32][33]
- **22, Cloudflare snapshots:** R2 directory-backup pricing does not establish native container-snapshot beta pricing. [34]
- **26, Daytona Windows:** official “Windows $0.0858/vCPU/h” does not settle replacement versus surcharge; Battleships' two cards use different totals. [3][35]
- **38, Morph credits:** subscribe says zero starting MCUs, plans says 300 free. The attempted signup URL for the repository's third, 300-hours wording returned 404. No free credit is promised. [47]
- **39, Morph EFS:** plan-note EFS $0.12/$0.15/$0.18 per GiB-month was not established by a current official tariff. Current Volumes is a separate service. [48]
- **43, Runtime storage quantity:** unique disk and memory blocks cannot be inferred from requested disk capacity. Overcounting unused disk and omitting memory may offset either way. [12]
- **50, Sprites checkpoints:** billing for kept blocks is documented, but the separate checkpoint price is not conclusively tied to the cold-storage tariff. [50]

## Workload attributions: percentages match, some links and implications do not

The ranking JSON contains these means: always-on employees **5.8% CPU**, full-stack factory **3.4%**, interpreter **17.4%**, browser-use **3.3%**, and scraping **40%**. Rounded 6%, 3-4%, 17%, 3% and 40% claims are supported. Presets alone contain sizes and session structure but not the utilization fields. [23]

Botperch's n8n, community-bot and MCP pages explicitly derive their own 6%/3%/2% assumptions from the nearest workload, rather than claiming a direct n8n/Discord/MCP measurement. Keep that qualification. There is insufficient evidence here to call the means independent measurements of every provider. Interpreter count 20,000 versus Battleships 200,000, a safer 2/4/10 size versus Battleships 1/2/5, and 160 coding hours versus the original factory schedule are adaptations, not literal source values. That is fine if named as such and linked to the correct underlying fields.

## Method, freshness, tool cost and limits

Research routing started by discovering connected tools. Composio tool discovery was unavailable in this environment; **one Exa MCP Contents call succeeded for two known URLs**, Battleships' llms/index, with a bounded text limit. No paid search, research-agent, browser-agent, crawl or batch run was launched. Amp native web search/read was not used. Subsequent retrieval used direct, unauthenticated public HTTPS requests, with no-cache request headers and cache-busting query strings for provider evidence.

The main fresh evidence pass made **104 public source requests, 102 HTTP 200 and two 404** (a guessed Boat wallet page and Morph signup path). A final five-request pass retrieved Exa pricing, the Daytona Windows comparison card, and Blaxel overview/Volumes/Fork documentation, all HTTP 200. Other initial discovery and Battleships-card reads preceded that pass. These counts describe acquisition, not paid tools or unique confirmed facts. The unhelpful Instabox generic `/pricing` response was not treated as rate evidence; its actual pricing/billing Markdown was read instead.

**Fresh network retrieval is not a guarantee of origin-cache bypass.** Some provider CDNs still returned `Age` or `HIT` despite no-cache headers and unique queries. Where available the response Date was 2026-10-30 and content Last-Modified was inspected. This report does not claim those CDN bytes were generated on demand. It did not rely on an old research-service cached scrape for a price verdict. To require proof of origin revalidation beyond a provider's public CDN would need the provider's cooperation.

**Tool spend:** Exa currently publishes “$1 / 1k pages” for Contents and charges content types separately. Two text pages imply **$0.002 list-price cost**, well below the $2 cap. The MCP response returned no actual billing total, so $0.002 is an estimate, not an invoice or verified connector charge. All remaining source reads were direct public HTTPS, with no third-party research-tool charge. No accounts were created, no credentials were used and no billable sandboxes ran. [51]

Three kinds of evidence were kept separate: current provider statements, arithmetic derived from them, and unverified provider performance/actual invoices. This is not a hands-on audit of every Battleships feature flag or all 369 providers. It covers the site's Battleships-related material and the shared pricing contract for its 18 overlapping cards; additional Battleships product regimes are not new Botperch obligations simply because the larger dataset contains them.

Local validation imported the unchanged `price()` engine with the repository's rate cards. It reproduced Boat and Instabox selecting the wrong $20 plan for 16/32, DigitalOcean returning $0.01 for a one-second $1/hour shape, per-second Agent 37 metering and Vercel memory proration. It also checked Blaxel's unsupported 6-CPU/8-GiB acceptance. No provider sandbox or paid workflow was exercised. Research-only deliverables require no site build or visual check. JSON keys/enums, one-record-per-field uniqueness, quote matches, coverage counts and untouched site/README state were checked before handoff.

## Sources

All accessed 2026-10-30. Provider quotes in `findings.json` are the exact retrievable substrings; normalized whitespace was used only for matching. A source that merely lacks a tariff is not cited as proof of a zero tariff. Battleships sources below are third-party and Boat-built; primary tariff decisions use providers' own URLs.

[1] Battleships introduction, Boat-team disclosure: https://battleships.dev/llms.txt

[2] Battleships current index: https://battleships.dev/data/index.json ; overlapping files use `https://battleships.dev/data/providers/<id>.json` and `.md`, with IDs in the coverage table.

[3] Battleships, Boat-built, Daytona comparison and separate Windows record: https://battleships.dev/data/providers/daytona.json ; https://battleships.dev/data/providers/daytona-windows.json

[4] Agent 37 billing: https://www.agent37.com/docs/agents-api/billing.md

[5] Blaxel overview: https://docs.blaxel.ai/Sandboxes/Overview.md

[6] Boat pricing: https://docs.boat.dev/pricing

[7] Cloudflare Containers pricing: https://developers.cloudflare.com/containers/platform/pricing/

[8] DigitalOcean billing: https://docs.digitalocean.com/products/droplets/details/pricing/

[9] Instabox billing: https://instabox.sh/docs/billing.md

[10] Instabox plan limits: https://instabox.sh/docs/limits.md

[11] Instabox published pricing: https://instabox.sh/docs/pricing.md

[12] Runtime pricing details: https://withruntime.com/docs/pricing ; https://withruntime.com/pricing

[13] Runtime recurring included usage: https://withruntime.com/docs/included-usage

[14] Tensorlake billing: https://docs.tensorlake.ai/platform/billing.md

[15] Tensorlake pricing: https://www.tensorlake.ai/pricing

[16] Vercel Sandbox pricing: https://vercel.com/docs/sandbox/pricing

[17] Sprites FAQ and current price table: https://fly.io/sprites/

[18] Botperch live exports: https://botperch.com/data/providers/agent37.md ; https://botperch.com/data/providers/boxd.md ; https://botperch.com/data/providers/modal.md

[19] boxd funding announcement: https://boxd.sh/blog/we-raised-2m-to-kill-localhost/

[20] Agent 37 on-demand backup endpoint: https://www.agent37.com/docs/agents-api/instances/create-backup.md

[21] Lizard monthly plan credits: https://lizard.build/docs/platform/billing.md

[22] Morph MCU formula: https://cloud.morph.so/docs/documentation/instances/resize-disk

[23] Battleships, Boat-built, model workloads: https://battleships.dev/data/presets.json ; https://battleships.dev/data/rankings/employees.json ; https://battleships.dev/data/rankings/fullstack.json ; https://battleships.dev/data/rankings/interp.json ; https://battleships.dev/data/rankings/browseruse.json ; https://battleships.dev/data/rankings/cua.json ; https://battleships.dev/data/rankings/scrape.json

[24] Modal physical-core pricing: https://modal.com/pricing

[25] boxd contracting entity: https://boxd.sh/terms/

[26] Lizard sandbox contract: https://lizard.build/docs/sandboxes.md

[27] Agent 37 current shapes: https://www.agent37.com/docs/agents-api/instance-sizing.md ; sleep/backup distinctions: https://www.agent37.com/docs/agents-api/instance-backups.md

[28] Blaxel pricing: https://blaxel.ai/pricing

[29] Blaxel quota top-ups: https://docs.blaxel.ai/Security/Quotas.md

[30] Boat wallet FAQ: https://docs.boat.dev/faq

[31] Boat seat limits: https://docs.boat.dev/organizations/seats-and-limits

[32] boxd pricing and public documentation: https://boxd.sh/pricing ; https://boxd.sh/llms.txt

[33] boxd FAQ and resources: https://boxd.sh/faq/ ; https://docs.boxd.sh/guides/resources.md

[34] Cloudflare native snapshot status and separate directory-backup workflow: https://developers.cloudflare.com/sandbox/concepts/lifetime/ ; https://developers.cloudflare.com/sandbox/files/back-up-a-directory-to-r2/

[35] Daytona price table: https://www.daytona.io/pricing

[36] Daytona billing and limits: https://www.daytona.io/docs/en/billing.md ; https://www.daytona.io/docs/en/limits.md

[37] DigitalOcean price tables and volumes: https://www.digitalocean.com/pricing/droplets ; https://docs.digitalocean.com/products/volumes/details/pricing/

[38] E2B price table: https://e2b.dev/pricing.md

[39] E2B included disk: https://docs.e2b.dev/faq/calculate-sandbox-price.md

[40] E2B EU access: https://docs.e2b.dev/faq/eu-region.md

[41] Hetzner regular servers: https://www.hetzner.com/cloud/regular-performance/

[42] Hetzner public CPX22 price API: https://website-price-api.hetzner.com/api/v1/products/CLOUD_124

[43] Hetzner billing and separately scoped cheaper family: https://docs.hetzner.com/cloud/billing/faq/ ; https://www.hetzner.com/cloud/cost-optimized/

[44] Hostinger VPS and public checkout catalogs: https://www.hostinger.com/vps-hosting ; https://cart.hostinger.com/api/v1/catalog/hostingercom-vps-kvm1?brand_name=hostinger.com&currency_code=USD ; the same fetched endpoint for `kvm2`, `kvm4` and `kvm8`.

[45] Lizard sizes and quotas: https://lizard.build/docs/platform/limits ; https://lizard.build/pricing

[46] Modal resource and region rules: https://modal.com/docs/guide/sandbox-resources ; https://modal.com/docs/guide/region-selection ; https://modal.com/docs/guide/data-residency

[47] Morph conflicting credit pages and pause: https://cloud.morph.so/web/subscribe ; https://cloud.morph.so/docs/documentation/setup/plans ; https://cloud.morph.so/docs/documentation/instances/pause-resume

[48] Morph separate Volumes product: https://cloud.morph.so/docs/volumes/getting-started

[49] Sprites CPU floor and pricing: https://fly.io/sprites/checkpoint-restore/ ; https://fly.io/pricing/

[50] Sprites checkpoint quantity, without a confirmed standalone tariff: https://docs.fly.io/sprites/concepts/checkpoints.md

[51] Exa Contents list price: https://exa.ai/docs/reference/pricing

## Delivery state

Only `research/incoming/battleships-audit/report.md` and `findings.json` were added. They are local, uncommitted and unpushed. No site content or implementation was corrected as part of this read-only audit. The requested parent-thread handoff should prioritize the missing plan gates, omitted allowances, unit errors and exported disclosures, while preserving unknowns and Botperch's independently supported newer figures.

## Parent integration, 2026-10-30

Applied by https://ampcode.com/threads/T-01a188d2-e3f1-734f-8aed-80041812cbe2. All 26 corrections were applied; the 10 unclear records stay unknown.

- **Primary sources re-read:** every pricing correction's primary page was fetched fresh through Firecrawl (`maxAge: 0`) and its quote matched. Boat's matched once Markdown backticks were ignored. Runtime's included-usage table came back without its rows, so the page was read over plain HTTPS as a fallback: "Machine memory 100 GiB-hours", "Machine active CPU 25 vCPU-hours", renewed every calendar month for a paid account.
- **Engine:** new `Plan.rates` (Tensorlake Pro), `RateCard.minimumSeconds` (DigitalOcean's 60 s), `ramWholeMinutes` (Vercel) and `ramForVcpu` (Blaxel). Disk allowances are labelled GiB-h.
- **Data:** Boat's $100 plan and xlarge gate; InstaBox's free 20 GiB, Builder/Team plans, size and disk gates, and egress wording; Runtime's 720-hour storage month and recurring allowance; Tensorlake's 720-hour snapshot month; Vercel's 2 GB-per-vCPU sizes; Cloudflare's GB disk converted to GiB, and its egress rate per GiB; an Agent 37 partial-minute note; Modal's 2× CPU wording; Sprites' Hero/Mythic changelog line; the use-case workload citations; and Boat-team disclosures in the Markdown and JSON exports.
- **Totals that moved:** InstaBox B $28.84 → $27.23; Runtime A/B/C → $7.79 / $53.21 / $3.58 in the calculator (the profile's floor-to-busy ranges also moved); Tensorlake C $8.25 → $8.26. Each was re-worked by hand and added to `cost.test.ts`.

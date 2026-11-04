# TierHive — A, B and C worked by hand

Inputs are `presets.a/b/c` in `site/src/lib/cost.ts`. Money is USD; TierHive bills prepaid tokens at
$1 each.

## Published rates used

From the calculator's own feed, https://tierhive.com/api/pricing.php (read 2026-11-04):

| Resource | Published | Per hour, in the engine's units |
|---|---|---|
| RAM | 0.00000090 tokens per **MB-hour** | 1,024 × 0.0000009 = **$0.0009216 per GiB-hour** |
| NVMe | 0.00002000 tokens per **GB-hour** | **$0.00002 per GB-hour** |
| HDD | 0.00000700 tokens per GB-hour | $0.000007 per GB-hour (not used) |
| Backup storage | 0.00000500 per GB-hour | $0.000005 (not used) |
| Snapshots | 0.00002000 per GB-hour | $0.00002 (not used) |
| CPU priority | 0.00000000 / 0.00002000 / 0.00003000 per hour | Low is free; the card prices Low |
| IOPS, network tier | same three steps | Low is free |
| DHCP | 0.00000100 per hour | $0.000001 (not modelled, ≈$0.0007/mo) |

There is **no vCPU charge**: one vCPU comes with up to 2 GiB of RAM and two vCPU above that, so 4 GiB
is the smallest size that satisfies a 2 vCPU ask and 8 GiB the largest size sold.

The provider's own cards confirm the arithmetic: 128 MB + 1 GB = 0.000135/h, 2 GB + 25 GB =
0.002343/h, 4 GB + 50 GB = 0.004686/h — all reproduced from the two rates above.

Each server bills a **one-hour minimum** (operator's offer post), modelled with `wholeHours`.

## A — 1,000 ten-minute tasks, 2 vCPU / 4 GiB / 10 GiB, deleted after each

One fresh 4 GiB / 10 GB server per task, held ten minutes, deleted. Ten minutes bills an hour.

- Hourly rate: 4 × $0.0009216 + 10 × $0.00002 = $0.0036864 + $0.0002 = **$0.0038864/h**
- Billed hours: 1,000 × 1 h = **1,000 h** (the work is 166.67 h; the minimum turns it into 1,000)
- RAM: 1,000 × 4 × $0.0009216 = **$3.6864**
- Disk: 1,000 × 10 × $0.00002 = **$0.20**
- **Total: $3.8864 → $3.89**

The same work on one server that stayed up for its 166.67 hours would be 166.67 × $0.0038864 =
$0.6477. The difference is entirely the per-server minimum, and it is the single most important thing
to understand about using TierHive for task-shaped work.

## B — one 4 vCPU / 8 GiB / 50 GiB machine for 730 hours

**TierHive cannot sell this shape.** The published rule gives 1 vCPU up to 2 GB of RAM and 2 vCPU
above it, so the largest machine is 2 vCPU / 8 GiB. Priced on that:

- Hourly rate: 8 × $0.0009216 + 50 × $0.00002 = $0.0073728 + $0.001 = **$0.0083728/h**
- RAM: 730 × 8 × $0.0009216 = **$5.382144**
- Disk: 730 × 50 × $0.00002 = **$0.73**
- **Total: $6.112144 → $6.11**, with the workload flagged infeasible

## C — 2 vCPU / 4 GiB / 20 GiB, 90 running + 640 stopped hours

- Running rate: 4 × $0.0009216 + 20 × $0.00002 = $0.0036864 + $0.0004 = **$0.0040864/h**
- Running: 90 × $0.0040864 = **$0.367776**
- Stopped: 640 h × 20 GB × $0.00002 = **$0.256** (storage only; RAM and CPU are not billed while off)
- **Total: $0.623776 → $0.62**

## What `price()` prints

Card: `research/incoming/tierhive/pricing.json`, shapes priced at the two rates above.

| Case | Shape chosen | Engine lines | Engine total | Feasible | Hand total |
|---|---|---|---:|---|---:|
| A | 4 GiB / 10 GB | 1,000 runs × 1 h × $0.003886 | **$3.89** | yes | $3.8864 |
| B | 8 GiB / 50 GB | 730 h × $0.008373 | **$6.11** | no — "No size has 4 vCPU and 8 GiB; the largest is 2 vCPU / 8 GiB." | $6.112144 |
| C | 4 GiB / 20 GB | 90 h × $0.004086 + 640 h × 20 GiB × $0.00002 | **$0.62** | yes | $0.623776 |

Exact engine output (probe run against the card):

```
A  4 GiB / 10 GB: 2 vCPU / 4 GiB / 10 GiB
   Machine time (4 GiB / 10 GB)  1,000 runs × 1 h each, rounded up × $0.003886   3.886400
B  8 GiB / 50 GB: 2 vCPU / 8 GiB / 50 GiB
   Machine time (8 GiB / 50 GB)  730 h × $0.008373                                6.112144
C  4 GiB / 20 GB: 2 vCPU / 4 GiB / 20 GiB
   Machine time (4 GiB / 20 GB)  90 h × $0.004086                                 0.367776
   Disk while stopped            640 h × 20 GiB × $0.00002                        0.256000
```

Plan, shape, usage and bill all agree with the hand arithmetic. The one difference from a plain
per-resource card is presentational: the engine shows a single "Machine time" line for a shape, while
the hand work shows RAM and disk separately. Both come to the same number because each shape's hourly
price is exactly the two rates applied to its RAM and disk.

## Boundaries checked

| Probe | Result | Why it matters |
|---|---|---|
| C with `billedWhileStopped: true` added | Engine prints $3.24 because it charges the full shape rate **and** the stopped disk line, double-counting storage | The card deliberately uses one mechanism, not both. Billed at the running rate by hand, C would be 730 × $0.0040864 = **$2.98** |
| A with `wholeHours: false` | $0.647733 (166.67 h) | Confirms the minimum is what makes A $3.89; if TierHive metered the first hour by the minute, A would be 65 cents |
| A on 2 GiB (1 vCPU) | $2.3432 on the 2 GiB / 25 GB shape | A cheaper machine that does not meet the 2 vCPU ask; not used |
| B as asked | Infeasible, $6.11 | The 4 vCPU ask is impossible at any price |
| 3 GiB / 15 GB | $2.98 on the 4 GiB / 20 GB shape (exact would be $2.24) | Shape granularity, see limitations |

## Provider's own month, for comparison

TierHive's cards and blog use 24 × 30 = 720 hours; this site's engine uses 730.

- A: unchanged at $3.89 (whole hours)
- B: 720 × $0.0083728 = $6.03 (engine: $6.11)
- C: 90 running + 630 stopped = $0.367776 + $0.252 = $0.62 (engine: $0.62)

## Model limitations

1. **Shape granularity.** TierHive is build-your-own — RAM in 128 MB steps, NVMe in 1 GB steps — but
   the card lists seven representative shapes, because the engine prices a shape. An in-between size
   is priced at the next shape up, which overstates it: 3 GiB / 15 GB costs $2.98 on the card against
   $2.24 built exactly. A/B/C and the site's own presets land on listed shapes, so they are exact.
2. **Stopped-state billing.** The card bills stopped hours as storage at the NVMe rate, which follows
   the operator's forum offers rather than any page on tierhive.com. If stopped hours billed at the
   running rate, C would be $2.98.
3. **One-hour minimum.** Modelled with `wholeHours`, from the operator's offer post. Whether a
   90-minute server bills 1.5 or 2 hours is not published; A, B and C are unaffected.
4. **Priority tiers.** The card prices Low-priority CPU, IOPS and network, which are free. Medium adds
   $0.00002/h per tier and High $0.00003/h, so the default calculator configuration costs $0.00006/h
   more than the same size at Low.
5. **Units.** The provider's MB and GB are binary — the site calls 8 GB what the feed calls
   8,192 MB — so its GB-hour is treated as the engine's GiB-hour and no `disk.decimalGB` conversion
   is applied. That is direct for RAM and an inference for disk. If the disk GB is decimal, every disk
   charge is 7.37% higher: A $3.90, B $6.17, C $0.65.
6. **Not priced:** the DHCP charge (≈$0.0007/mo), backup creation and restore fees, backup and
   snapshot storage, HDD at $0.000007/GB-h, and the network-storage rate with no documented product.
   Egress has no per-GB price at all, so it contributes nothing to any case.

## If the minimum ever needs to apply to per-resource billing

The card uses shapes because that is the only branch of `priceOnPlan()` that honours `wholeHours`.
If a future card wants the exact per-resource price for every size, the smallest engine change is to
apply the same rounding in the per-resource branch — roughly:

```ts
// in priceOnPlan(), before the CPU/RAM/disk lines
const billHours = w.mode === "tasks" && card.wholeHours
  ? w.tasks * Math.ceil(h.session - 1e-9)
  : h.run;
```

and use `billHours` for the CPU, RAM and disk-while-running amounts (with the math string saying
"× 1 h each, rounded up"). The card would then drop `shapes` for `ram` and `disk.running` rates and
keep `wholeHours: true`; A would still print $3.89 and every other size would be exact. No existing
card uses `wholeHours` without shapes (Hetzner and Vultr have shapes), so the change would be inert
for them. It is a proposal only — no engine or test file was modified for this package.

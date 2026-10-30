# OVHcloud VPS — A, B and C worked by hand

Prices read live on **2026-10-30** (Asia/Kolkata) from OVHcloud's US product page
(`https://us.ovhcloud.com/vps/`) and its public order catalog for the US subsidiary
(`https://api.us.ovhcloud.com/1.0/order/catalog/public/vps?ovhSubsidiary=US`). The catalog
returns USD with `taxRate: 0`. Workload inputs are `presets.a/b/c` in `site/src/lib/cost.ts`;
`MONTH_HOURS = 730`.

## Which price the card uses

OVHcloud sells three terms for the same model: no commitment, 6 months and 12 months. All
three are billed monthly; the commitment only lowers the monthly figure. **The card uses the
no-commitment price**, because it is the ongoing price a month-to-month buyer pays and the
only term that can be left at any time.

| Model | Specs | No commitment (card) | 6 months | 12 months |
|---|---|---:|---:|---:|
| VPS-1 | 2 vCores / 4 GB / 40 GB NVMe | **$5.35** | $5.08 | $4.54 |
| VPS-2 | 4 vCores / 8 GB / 75 GB NVMe | **$10.00** | $9.50 | $8.50 |
| VPS-3 | 6 vCores / 12 GB / 100 GB NVMe | **$14.50** | $13.77 | $12.32 |
| VPS-4 | 8 vCores / 24 GB / 200 GB NVMe | **$27.50** | $26.12 | $23.37 |

The product page's "Starting at $4.54 / $8.50 / $12.32 / $23.37" figures are the 12-month
column. They are not the month-to-month price and are not used in the card.

## A — 1,000 tasks × 10 minutes, 2 vCPU / 4 GiB / 10 GiB, deleted after each

**Size chosen:** VPS-1, 2 vCores / 4 GB / 40 GB, $5.35 a month. It is the smallest shape with
2 vCores and 4 GB, and its disk is larger than the 10 GiB asked for.

**Hours.** 1,000 × 10 min = 10,000 min ÷ 60 = **166.6667 h**.

**The billing shape.** OVHcloud sells a calendar month, not a machine-hour. One VPS-1 can run
all 1,000 tasks one after another: 166.67 hours is well inside the 730-hour month. There is no
per-task charge, no hourly rounding and no minimum duration.

**Bill for A: $5.35.** If the tasks must run concurrently, each concurrent task needs its own
VPS-1, so the bill is $5.35 × the concurrency.

**Pro-rata arithmetic, for comparison only.** $5.35 ÷ 730 = **$0.0073288/h**;
166.6667 h × $0.0073288 = **$1.2215**. That is not a price OVHcloud sells; it is what a
machine-hour model would produce. The card does not use it.

**Term alternatives.** 12 months at $4.54 a month is $54.48 paid over the year; 6 months at
$5.08 is $30.48. Neither changes the fact that one plan covers A.

---

## B — one 4 vCPU / 8 GiB / 50 GiB machine, 730 hours

**Size chosen:** VPS-2, 4 vCores / 8 GB / 75 GB, $10.00 a month. VPS-1 has only 2 vCores, so
VPS-2 is the smallest fit; its memory and disk are over-provisioned.

**Arithmetic.** 730 h × ($10.00 ÷ 730) = 730 × **$0.0136986/h** = **$10.00**. The monthly
price is the whole bill; there is no hourly meter to round.

**Term alternatives.** 12 months $8.50/mo, $102.00 over the year; 6 months $9.50/mo, $57.00.

**Feasibility.** No session or lifetime limit. The VPS runs for weeks. The 75 GB disk covers
the 50 GiB asked for.

**Bill for B: $10.00.**

---

## C — 2 vCPU / 4 GiB / 20 GiB, 90 running + 640 stopped hours, files kept

**Size chosen:** VPS-1, 2 vCores / 4 GB / 40 GB, $5.35 a month.

**The trap.** OVHcloud has `/stop`, but it is a power-off, not a billing state. The service is
a monthly subscription that renews automatically; the only way to end the charge is to cancel
it, and the disk is deleted then. The 640 stopped hours are inside the month already paid for.

**Billed hours.** 90 + 640 = **730 h**.

**Arithmetic.** 730 × $0.0073288 = **$5.35**, which is simply the monthly price.

**Line by line for the profile:**

| Line | Arithmetic | Amount |
|---|---|---:|
| Running | 90 h × $0.0073288 | $0.66 |
| Stopped, still billed | 640 h × $0.0073288 | $4.69 |
| **Bill** | | **$5.35** |

(The two lines are for explanation; OVHcloud does not bill them separately. The subscription
is one monthly charge.)

**Files.** The system disk stays attached across a power-off, so the 20 GiB are there in the
morning. Memory and running processes are not: a stop is a power-off, not a pause.

**Bill for C: $5.35.**

---

## What the shared engine prints

`pricing.json` sets `monthlyPlans: true`, gives each shape a `monthly` price only, and sets
`between: "kept"`. `price()` was run against `presets.a/b/c` on 2026-10-30:

| Case | Engine total | Engine shape | Engine line | Hand-worked | Match |
|---|---:|---|---|---:|---|
| A | $5.35 | VPS-1 (2 vCPU / 4 GiB / 40 GiB) | 1 × $5.35 a month, running 166.67 h of tasks back to back | $5.35 | yes |
| B | $10.00 | VPS-2 (4 vCPU / 8 GiB / 75 GiB) | 1 × $10.00 a month | $10.00 | yes |
| C | $5.35 | VPS-1 (2 vCPU / 4 GiB / 40 GiB) | 1 × $5.35 a month | $5.35 | yes |

All three are feasible with no problems. `catches()` reports "Bills while switched off" and
"Whole months only", which is the correct pair of warnings for this tariff.

## Why no engine change was needed

OVHcloud's tariff is exactly the shape `monthlyPlans` was added for: whole months, no hourly
rate, one plan per machine, tasks sharing as few plans as their hours need. A 166.67-hour
task workload needs one 730-hour plan, which is what the engine prints.

Two things the card deliberately does not model:

1. **Additional disks.** They are sold in fixed sizes (50 GB to 10 TB) at fixed monthly
   prices, not as a per-GiB rate. `disk.extraMonthly` would invent a rate OVHcloud does not
   sell. A request above the plan disk is reported as infeasible, and the notes say an
   additional disk can be attached but is not priced.
2. **The standard-backup line.** The product page and FAQ say the daily backup is free; the
   order catalog lists a mandatory standard-backup option at $0.50 (VPS-1), $0.60 (VPS-2),
   $0.80 (VPS-3) and $1.20 (VPS-4). The card follows the product page. If the catalog is
   right, A and C are $5.85 and B is $10.60.

## What is not in the bill

- Model API spend is not machine spend and is not included.
- A snapshot (from $0.40), premium backup ($1.40–$5.90), additional IPs, Plesk/cPanel
  licences, a Load Balancer and additional disks are separate monthly options.
- Local Zone plans are priced separately (VPS-1 LZ $6.54, VPS-2 LZ $10.00) and lose several
  options.
- Sales tax is not included: OVHcloud's US prices are exclusive of tax.

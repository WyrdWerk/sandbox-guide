# Hostinger — A, B and C worked by hand

Prices read live on **2026-10-30** (Asia/Kolkata; 2026-10-29 UTC) from
`https://www.hostinger.com/vps-hosting` and from Hostinger's own cart catalog endpoints
(`https://cart.hostinger.com/api/v1/catalog/hostingercom-vps-kvm{1,2,4,8}?brand_name=hostinger.com&currency_code=USD`).
The catalog returns prices in cents for all three terms, with `first_period_price`, `base_price` and
`renewal.price`. Workload inputs are `presets.a/b/c` in `site/src/lib/cost.ts`; `MONTH_HOURS = 730`.

## Which term the card uses

Hostinger sells three prepaid terms: 1 month, 12 months and 24 months. **The card uses the 1-month
term at its renewal price**, because it is the only monthly-billed term and its renewal is what a
month-to-month buyer pays after the first invoice. The first month is also discounted, so it is not
the ongoing price. The 12- and 24-month renewals are lower per month but the whole term is paid
upfront; they are recorded here and in `pricing.json`, not used in the card.

| Plan | 1-month first | 1-month renewal (card) | 12-month first | 12-month renewal | 24-month first | 24-month renewal |
|---|---:|---:|---:|---:|---:|---:|
| KVM 1 (1 vCPU / 4 GB / 50 GB) | $9.99 | **$19.49** | $6.99 | $12.99 | $6.49 | $11.99 |
| KVM 2 (2 vCPU / 8 GB / 100 GB) | $13.99 | **$24.49** | $9.99 | $16.99 | $8.79 | $14.99 |
| KVM 4 (4 vCPU / 16 GB / 200 GB) | $25.99 | **$42.99** | $14.99 | $30.99 | $12.99 | $28.99 |
| KVM 8 (8 vCPU / 32 GB / 400 GB) | $50.99 | **$73.99** | $28.49 | $53.99 | $25.99 | $49.99 |

Upfront totals: KVM 1 $155.88 for 12 months and $287.76 for 24; KVM 2 $203.88 and $359.76;
KVM 4 $371.88 and $695.76; KVM 8 $647.88 and $1,199.76. The first-period prices are the totals
actually charged today; the renewal is charged at the end of the term.

## A — 1,000 tasks × 10 minutes, 2 vCPU / 4 GiB / 10 GiB, deleted after each

**Size chosen:** KVM 2, 2 vCPU / 8 GB / 100 GB, $24.49 on the monthly-billed term. KVM 1 has only
1 vCPU, so it does not fit the 2 vCPU ask. KVM 2's memory and disk are larger than requested.

**Hours.** 1,000 × 10 min = 10,000 min ÷ 60 = **166.6667 h**.

**The billing shape.** Hostinger sells a whole monthly plan, not a machine-hour. One KVM 2 can run
all 1,000 tasks one after another: 166.67 hours is well inside the 730-hour month. There is no
per-task charge and no per-second meter.

**Bill for A: $24.49.** The plan covers the month regardless of whether the CPU is busy for 166.67
hours or 730. If this is a single month and the plan is not renewed, the first-period price is
$13.99; $24.49 is the ongoing monthly rate used in the card.

**Pro-rata arithmetic, for comparison.** $24.49 ÷ 730 = **$0.0335479/h**;
166.6667 h × $0.0335479 = **$5.5913**. That is what the shared engine prints, and it is not the
bill: it assumes a machine-hour price Hostinger does not sell.

**Term alternatives.** 12-month renewal $16.99/mo, $203.88 paid upfront; 24-month renewal
$14.99/mo, $359.76 paid upfront. Neither changes the fact that one plan covers A.

**Feasibility.** One machine, sequential tasks. If the 1,000 tasks must run concurrently, the
workload needs more machines and the bill multiplies by the number of KVM 2 plans. Buying a fresh
VPS per task would mean 1,000 monthly plans, which is why A is not a Hostinger-shaped workload.

---

## B — one 4 vCPU / 8 GiB / 50 GiB machine, 730 hours

**Size chosen:** KVM 4, 4 vCPU / 16 GB / 200 GB, $42.99 on the monthly-billed term. It is the
smallest plan with 4 vCPU; KVM 2 has only 2 vCPU. Memory and disk are over-provisioned.

**Arithmetic.** 730 h × ($42.99 ÷ 730) = 730 × **$0.0588904/h** = **$42.99**. The plan's monthly
price is the whole bill; there is no hourly meter to round.

**Term alternatives.** 12-month renewal $30.99/mo, $371.88 upfront; 24-month renewal $28.99/mo,
$695.76 upfront.

**CPU.** The workload averages 10% CPU, below Hostinger's 60% credit baseline, so credits
accumulate rather than drain. The burst throttle does not bind B.

**Feasibility.** No session or lifetime limit. The VPS runs for weeks. Disk is over-provisioned but
not a constraint. One manual snapshot can be kept for a day; weekly backups are the durable copy.

**Bill for B: $42.99.**

---

## C — 2 vCPU / 4 GiB / 20 GiB, 90 running + 640 stopped hours, files kept

**Size chosen:** KVM 2, 2 vCPU / 8 GB / 100 GB, $24.49 on the monthly-billed term.

**The trap.** The 640 stopped hours are not free. Hostinger's stop endpoint says:
"This is a compute-only power state change and does not affect billing." The plan is a subscription
for the term; powering the machine off keeps the disk and the invoice. The only states are
"billing" and "cancelled at the end of the term".

**Billed hours.** 90 + 640 = **730 h**.

**Arithmetic.** 730 × $0.0335479 = **$24.49**. Equivalently, the plan's monthly price.

**Line-by-line for the profile:**

| Line | Arithmetic | Amount |
|---|---|---:|
| Running | 90 h × $0.0335479 | $3.02 |
| Stopped, still billed | 640 h × $0.0335479 | $21.47 |
| **Bill** | | **$24.49** |

**Files.** Stopping keeps the disk, so the 20 GiB of files are there in the morning. Memory and
running processes are not: a stop is a power-off, not a pause.

**Term alternative.** 24-month renewal $14.99/mo, $359.76 upfront. The stopped hours still bill.

**Bill for C: $24.49.**

---

## What the shared engine prints

`pricing.json` gives each shape both an hourly rate (monthly ÷ 730) and a `monthly` cap, and sets
`billedWhileStopped: true`.

| Case | Engine | Hand-worked | Why they differ |
|---|---:|---:|---|
| A | $5.59 | **$24.49** | Tasks mode bills only 166.67 h at the pro-rata rate; it has no monthly minimum. |
| B | $42.99 | **$42.99** | 730 h × the pro-rata rate reaches the monthly cap. |
| C | $24.49 | **$24.49** | `billedWhileStopped` adds the 640 stopped hours, reaching 730 h and the monthly cap. |

A is the only gap, and it is a model limitation, not a rate error. `RateCard.minimumPerRun` cannot
express "one monthly plan covers all the tasks": setting it to $24.49 would bill 1,000 × $24.49.
Do not "fix" A by changing the card's rates; the hand-worked total is the truth and the profile's
cost section carries the flag.

## What is not in the bill

- The free domain for one year is included; its renewal is a separate domain price.
- Daily backups are a paid add-on; weekly backups are included. Snapshot storage has no published
  separate price.
- The managed AI automation plan is a separate product, not these VPS plans.
- Model API spend is not machine spend and is not included.

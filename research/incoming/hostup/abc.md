# HostUp — A, B and C worked by hand

Prices read live on **2026-10-30** from `https://hostup.se/en/vps/` (EUR), the same page with
`?currency=USD` and `?currency=SEK`, and HostUp's own public product endpoint
`https://cloud.hostup.se/api/v2/products/vps`, which returns prices in SEK without authentication.
Workload inputs are `presets.a/b/c` in `site/src/lib/cost.ts`; `MONTH_HOURS = 730`.

## Which price the card uses

HostUp sells one product two ways: one month in advance, or twelve months in advance at 10% off. The
card uses the **monthly** price, because it is the ongoing month-to-month price and there is no
introductory discount to strip out. The annual price is recorded here and in `pricing.json` but not
used, because the whole year is paid upfront.

| Plan | vCPU / RAM / NVMe | SEK/mo | EUR/mo | **USD/mo (card)** | EUR/yr (billed) | USD/yr (billed) |
|---|---|---:|---:|---:|---:|---:|
| VPS Nano | 1 / 2 GB / 25 GB | 35 | €3.50 | **$4.08** | €37.80 | $44.10 |
| VPS XS | 2 / 4 GB / 50 GB | 49 | €4.90 | **$5.72** | €52.90 | $61.72 |
| VPS SM | 4 / 8 GB / 100 GB | 99 | €9.90 | **$11.55** | €106.90 | $124.72 |
| VPS MED | 8 / 16 GB / 200 GB | 199 | €19.90 | **$23.22** | €214.90 | $250.72 |
| VPS LG | 16 / 32 GB / 400 GB | 399 | €39.90 | **$46.55** | €430.90 | $502.72 |
| VPS XL | 16 / 64 GB / 800 GB | 749 | €74.90 | **$87.38** | €808.90 | $943.72 |
| VPS XXL | 32 / 128 GB / 1,600 GB | 1,499 | €149.90 | **$174.88** | €1,618.90 | $1,888.72 |

**Where the USD column comes from.** It is HostUp's own USD display, not my conversion. HostUp's
base prices are the round SEK figures; the English page shows EUR by default at exactly SEK ÷ 10
(49 → €4.90, 1,499 → €149.90), and the USD page shows exactly EUR × 7/6 (€4.90 → $5.72,
€149.90 → $174.88). The card records the conversion and its date (2026-10-30) rather than inventing
a rate. VAT is not settled by HostUp's own pages — its calculator says "excl. VAT" and its cart says
"inc. VAT" for the same total — so the card follows the calculator and treats the figures as ex-VAT;
the contradiction is in `provider.json` and should be settled before publication.

## A — 1,000 tasks × 10 minutes, 2 vCPU / 4 GiB / 10 GiB, deleted after each

**Size chosen:** VPS XS, 2 vCPU / 4 GB / 50 GB, $5.72 a month (49 SEK, €4.90). VPS Nano has only
1 vCPU, so it does not fit the ask. XS's 50 GB and 2 TB are larger than needed.

**Hours.** 1,000 × 10 min = 10,000 min ÷ 60 = **166.6667 h**.

**The billing shape.** HostUp sells a whole monthly plan, not a machine-hour. One XS can run all
1,000 tasks one after another: 166.67 hours is well inside the 730-hour month. There is no per-task
charge and no per-second meter.

**Bill for A: $5.72.** The plan covers the month whether the CPU is busy for 166.67 hours or 730.

**Pro-rata arithmetic, for comparison.** $5.72 ÷ 730 = **$0.0078356/h**; 166.6667 h × $0.0078356 =
**$1.3059**. That is what a machine-hour meter would charge, and it is not the bill, because HostUp
does not sell that meter on a standard plan.

**Feasibility.** One machine, sequential tasks. If the tasks must run concurrently the bill multiplies
by the number of XS plans. A fresh server per task would mean 1,000 monthly plans, which is why A is
not a HostUp-shaped workload. The gated pay-as-you-go Cloud VM would fit A far better, but a new
account cannot buy it.

**Term alternative.** 12 months at $61.72 upfront, $5.14 a month.

---

## B — one 4 vCPU / 8 GiB / 50 GiB machine, 730 hours

**Size chosen:** VPS SM, 4 vCPU / 8 GB / 100 GB, $11.55 a month (99 SEK, €9.90). It is the smallest
plan with 4 vCPU and 8 GiB, so it matches the ask exactly; 100 GB and 5 TB are over-provisioned.

**Arithmetic.** 730 h × ($11.55 ÷ 730) = 730 × **$0.0158219/h** = **$11.55**. The plan's monthly
price is the whole bill; there is no hourly meter to round.

**CPU.** The workload averages 10% CPU, far below HostUp's 50%-of-vCPUs sustained cap, so neither the
CPU cap nor the disk throttle binds. Memory and disk are over-provisioned but not a constraint.

**Feasibility.** No session or lifetime limit. The VPS runs for weeks. Snapshots expire after a day,
so the weekly backup is the durable copy.

**Bill for B: $11.55.** Term alternative: $124.72 upfront for a year, $10.39 a month.

---

## C — 2 vCPU / 4 GiB / 20 GiB, 90 running + 640 stopped hours, files kept

**Size chosen:** VPS XS, 2 vCPU / 4 GB / 50 GB, $5.72 a month.

**The trap.** The 640 stopped hours are not free. A standard VPS is a subscription for the period:
powering it off keeps the disk, keeps the files, and keeps the invoice. The only cheaper stopped
state is on the pay-as-you-go Cloud VM, which needs identity verification and SEK 2,000 of prior
payments.

**Billed hours.** 90 + 640 = **730 h**, all at the plan price.

**Arithmetic.** 730 × $0.0078356 = **$5.72**. Equivalently, the plan's monthly price.

**Line-by-line for the profile:**

| Line | Arithmetic | Amount |
|---|---|---:|
| Running | 90 h × $0.0078356 | $0.71 |
| Stopped, still billed | 640 h × $0.0078356 | $5.01 |
| **Bill** | | **$5.72** |

**Files.** Stopping keeps the disk, so the 20 GiB of files are there in the morning. Memory and
running processes are not: a stop is a power-off, not a pause.

**Bill for C: $5.72.** Term alternative: $61.72 upfront for a year; the stopped hours still bill.

---

## What the shared engine prints

`pricing.json` gives each shape a `monthly` price only, sets `monthlyPlans: true`, and does **not**
set `billedWhileStopped` (the monthly-plan branch already charges the full plan, so setting it as
well would double-count the stopped hours).

| Case | Engine | Hand-worked | Difference |
|---|---:|---:|---|
| A | $5.72 | **$5.72** | none — one plan covers 166.67 h of tasks |
| B | $11.55 | **$11.55** | none |
| C | $5.72 | **$5.72** | none — the plan bills through the 640 stopped hours |

All three agree, and the engine picks the same shapes: XS, SM, XS.

**Why A works here but not on Hostinger's card.** Hostinger's card gives each shape both an hourly
rate and a monthly cap, so tasks mode bills 166.67 machine-hours at the pro-rata rate and the
hand-worked total has to be carried separately. HostUp's card has no hourly rate at all, so
`monthlyPlans` applies and the engine bills one whole plan for the month of tasks — which is the
actual tariff. No engine change is needed.

**Boundary worth knowing.** In tasks mode the engine buys `ceil(hours / 730)` plans, so 1,000 tasks
of ten minutes stay on one plan and 4,800 ten-minute tasks (800 h) need two, printing $11.44. A
workload asking for more disk than its shape carries is priced as extra disk at $0.0642 per GiB a
month (HostUp's 0.55 SEK): B with 300 GiB of disk picks VPS SM plus 200 GiB and prints $24.39. Both
were probed directly against `price()`; neither appears in A, B or C.

## What is not in the bill

- VAT. The card treats the figures as ex-VAT, following HostUp's price calculator; its cart labels the
  same total "inc. VAT". If the calculator is right, a Swedish private customer adds 25% ($7.15,
  $14.44, $7.15). If the cart is right, the published figure already includes it.
- Extra IPv4 addresses and kept reserved addresses, which are charged but priced only in the portal.
- Extra snapshots and backup slots beyond the plan's included ones (1 SEK per slot a month).
- Windows Server, which is bring-your-own-licence.
- Model API spend, which is not machine spend.
- The 14-day money-back guarantee, which is a refund path, not a discount.

# HostHatch — A, B and C worked by hand

Rates read fresh from `https://hosthatch.com/products` on 2026-11-04 (twice: TinyFish then
Context), with the billing rules from `https://hosthatch.com/terms-of-service` and the API
documentation at `https://docs.hosthatch.com/api/orders-and-payment/`. Workload inputs are
`presets.a/b/c` in `site/src/lib/cost.ts`; `MONTH_HOURS = 730`.

Three published rules drive every number below:

1. **Monthly plans, no hourly meter.** "HostHatch will invoice Customer for Fees and Expenses
   monthly, quarterly, semi-annually or annually." The product page quotes every plan as
   `from $X.00 / month`, and the API's product object carries a `billing_cycles` list rather than
   a rate per hour. A ten-minute task therefore costs a whole plan unless it shares one with other
   tasks.
2. **The monthly price is the list price.** `NVMe 4 GB` is $6.00 and `NVMe 12 GB` is $12.00 a
   month. The checkout's prices for quarterly, semi-annual and annual terms are behind the login
   and are not published, so no multi-month discount is applied here. The card is the monthly
   list price.
3. **Stopping does not stop the bill.** The contract is a term that renews until cancelled, and a
   server cancelled with `end_of_term` "runs until the end of the period you paid for". Powering
   off is an action on the server, not a change to the subscription.

The cheapest plan is `NVMe 2 GB`: 1 core (fair share) / 2 GB / 10 GB NVMe, $4.00 a month. There is
no 2 vCPU plan below $6, so A and C pay for a slightly larger machine than they ask for.

---

## A — 1,000 tasks × 10 minutes, 2 vCPU / 4 GiB / 10 GiB, deleted after each

**Size chosen:** NVMe 4 GB, 2 cores (fair share) / 4 GB DDR4 / 20 GB NVMe, **$6.00** a month. It is
the smallest plan with 2 cores and 4 GB, and its 20 GB disk is 10 GB more than the task needs.

**Hours.** 1,000 × 10 min = 10,000 min ÷ 60 = **166.6667 h**.

**Billing unit.** A monthly plan. 166.67 h is inside one 730-hour month, so the runs share one
server back to back and need **one plan**.

**Bill for A: 1 × $6.00 = $6.00.**

**Feasibility.** The tasks are sequential, so one server is enough. A fresh server per task would
mean 1,000 plans: 1,000 × $6.00 = **$6,000**. That is the honest cost of treating HostHatch as a
per-task sandbox, and it is why A only makes sense as a shared, always-on box.

**CPU.** 50% of 2 cores for 166.67 h is 166.67 core-hours spread over the month. The plan is priced
for the whole month, not for CPU time, so the busy fraction does not change the bill. The 2 GB, 4
GB and 8 GB plans are labelled "fair share"; HostHatch does not publish the fair-share threshold.

**What the profile says.** `cost.A` = $6.00, with the flag that the tasks must share one server.

---

## B — one 4 vCPU / 8 GiB / 50 GiB machine, 730 hours

**Size chosen:** NVMe 12 GB, 4 cores (1 dedicated, 3 fair-shared) / 12 GB DDR4 / 50 GB NVMe,
**$12.00**. It is the cheapest plan with 4 cores, and its 50 GB disk matches the ask exactly.

**Why not NVMe 8 GB.** It is $9.00 but has only 2 cores, so it fails the 4 vCPU request. The next
cheapest fit after NVMe 12 GB is NVMe 16 GB at $15.00, which adds memory and disk that B does not
use.

**Hours.** 730, all inside the monthly plan.

**Bill for B: 1 × $12.00 = $12.00.**

**Feasibility.** No session limit, no idle stop and no cap on hours. The server runs all month, and
10% average CPU is far below anything that would meet a fair-use rule.

**What the profile says.** `cost.B` = $12.00.

---

## C — 2 vCPU / 4 GiB / 20 GiB, 90 running + 640 powered-off hours, files kept

**Size chosen:** NVMe 4 GB, 2 cores / 4 GB / 20 GB, **$6.00**. The 20 GB disk is an exact fit.

**The trap.** Workload C assumes the 640 idle hours are cheap. They are not: the plan is sold by
term, not by running hour. Powering off keeps the disk and the files, but the month is already
paid for. There is no cheaper stopped-storage rate and no pause that keeps memory.

**Billed hours.** 90 + 640 = **730 h**, all inside one monthly plan.

**Bill for C: 1 × $6.00 = $6.00.**

**Line-by-line for the profile:**

| Line | Arithmetic | Amount |
|---|---|---|
| Monthly plan | 1 × $6.00 | $6.00 |
| Stopped hours | 640 h, no extra charge and no credit | $0.00 |
| **Bill** | | **$6.00** |

---

## What `price()` prints for the card

Run with `node` against `site/src/lib/cost.ts` and the card in `pricing.json` (probe kept outside
the repo):

```
== A total=$6.00 feasible=true plan=Monthly plan shape=NVMe 4 GB: 2 vCPU / 4 GiB / 20 GiB
   Monthly plan (NVMe 4 GB): 1 × $6.00 a month, running 166.67 h of tasks back to back = $6.00

== B total=$12.00 feasible=true plan=Monthly plan shape=NVMe 12 GB: 4 vCPU / 12 GiB / 50 GiB
   Monthly plan (NVMe 12 GB): 1 × $12.00 a month = $12.00

== C total=$6.00 feasible=true plan=Monthly plan shape=NVMe 4 GB: 2 vCPU / 4 GiB / 20 GiB
   Monthly plan (NVMe 4 GB): 1 × $6.00 a month = $6.00
```

Plan, shape, feasibility and total match the hand arithmetic for all three cases.

## Boundaries checked

- **The 730-hour edge in A.** 4,380 ten-minute tasks are exactly 730 h and print **$6.00**;
  4,381 are 730.17 h and print **$12.00**, because a second monthly plan is needed. The engine
  rounds up per 730 hours of back-to-back work, which is the honest shape of a monthly-only tariff.
- **Disk over the largest plan.** B with 300 GiB prints `$69.00` but `feasible=false`, with "No size
  with 4 vCPU allows 300 GiB of disk; the most is 250 GiB on NVMe 96 GB." There is no volume to buy
  past the plan's disk, so the total is not a price a reader can pay.
- **Nothing is billed while stopped in C** because `monthlyPlans` charges whole plans rather than
  hours; the card does not also set `billedWhileStopped`, which would double-count the catch.

## Model limitation

The card cannot show a multi-month discount, because HostHatch publishes none. The promotional
plans sold through LowEndTalk (April 2026: 4 GB / 50 GB for $35 a year) are annual-only, limited
stock, no refunds and a slower support queue; they are not the standard product and are excluded.

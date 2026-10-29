# DigitalOcean — A, B and C worked by hand

Rates read from `https://www.digitalocean.com/pricing/droplets` on 2026-10-29 and cross-checked
against `https://docs.digitalocean.com/products/droplets/details/pricing/`. Workload inputs are
`presets.a/b/c` in `site/src/lib/cost.ts`; `MONTH_HOURS = 730`.

Three published rules drive every number below:

1. **Per second, 60-second minimum.** "Effective January 1, 2026, we're moving to per-second billing
   (with a minimum charge of 60 seconds or $0.01, whichever is higher) for Droplets."
2. **Bundled plans cap at 672 hours a month.** "Usage is capped at 672 hours (28 days) per month."
3. **Powered off is not stopped billing.** "You are still billed for bundled-plan CPU Droplets that
   are powered off because the compute resources stay reserved on the hypervisor. To end billing,
   destroy the Droplet."

---

## A — 1,000 tasks × 10 minutes, 2 vCPU / 4 GiB / 10 GiB, deleted after each

**Size chosen:** Basic 2 vCPU / 4 GiB / 80 GiB, $0.03571/h, $24.00/mo. The smallest Basic shape
with 2 vCPU and 4 GiB; its 80 GiB disk is more than the 10 GiB asked for, and there is no smaller
disk on that shape.

**Hours.** 1,000 × 10 min = 10,000 min ÷ 60 = **166.6667 h**.

**Compute.** 166.6667 h × $0.03571 = **$5.9517 → $5.95**.

**Minimum charge.** Each task runs 600 s, ten times the 60-second minimum, so no run is rounded up
to a minute. But 600 s at $0.03571/h is $0.005952, which is **below the $0.01 floor**. The rule is
"a minimum charge of 60 seconds or $0.01, whichever is higher", and the docs apply it per Droplet:
"If you create a bundled-plan CPU Droplet and destroy it in less than 60 seconds, you are still
charged the minimum." So each of the 1,000 runs is billed **$0.01**, not $0.005952.

**Corrected compute.** 1,000 × $0.01 = **$10.00**.

> This is the one place where the per-second model does not scale linearly. A ten-minute run on the
> cheapest 2 vCPU shape costs a cent, not six-tenths of a cent, because the dollar floor binds. The
> engine, which multiplies hours by the hourly rate, cannot see that floor and would print $5.95.

**Disk.** Included in the shape. No volume, because 80 GiB ≥ 10 GiB.

**Bill for A: $10.00.** (Linear arithmetic $5.95; the $0.01-per-Droplet floor raises it to $10.00.)

**Feasibility.** Concurrency is the only limit: "You can't create more than 10 Droplets at the same
time using the Control Panel or the API." Running the 1,000 tasks in sequence never has more than
one alive. Billing starts at create and ends at destroy, so a destroyed Droplet costs only its run.

---

## B — one 4 vCPU / 8 GiB / 50 GiB machine, 730 hours

**Size chosen:** Basic 4 vCPU / 8 GiB / 160 GiB, $0.07143/h, $48.00/mo. Exact fit on CPU and memory;
the disk is 160 GiB against a 50 GiB ask because that is the only disk this shape comes with.

**Uncapped arithmetic.** 730 h × $0.07143 = **$52.1439**.

**Cap.** Bundled plans stop at 672 h: 672 × $0.07143 = $48.0010, which is the published $48.00
monthly price. The last 58 hours of the month are free.

**Bill for B: $48.00.**

**v5 comparison (not used).** The same 4 vCPU / 8 GiB with a 50 GiB boot disk:
4 × $0.0158219 = $0.0632876; 8 × $0.0040411 = $0.0323288; 50 × $0.000137 = $0.00685.
Total $0.1024664/h × 730 = **$74.80**, with no cap. v5 is 56% dearer here and is only offered in
ATL1, RIC1, MKC1 and MEM1, so the bundled plan is the right shape for B.

**Feasibility.** No session limit; the Droplet runs for weeks. Disk is over-provisioned but not a
constraint.

---

## C — 2 vCPU / 4 GiB / 20 GiB, 90 running + 640 powered-off hours, files kept

**Size chosen:** Basic 2 vCPU / 4 GiB / 80 GiB, $0.03571/h, $24.00/mo.

**The trap.** Workload C assumes the 640 idle hours are cheap. They are not: a powered-off Droplet
reserves its compute on the hypervisor and bills at the full hourly rate. The only states are
"billing" and "destroyed", and destroyed takes the disk with it.

**Billed hours.** 90 + 640 = **730 h**.

**Uncapped arithmetic.** 730 h × $0.03571 = **$26.0683**.

**Cap.** 730 h is over the 672-hour cap, so the bill is the flat **$24.00** monthly price.

**Line-by-line for the profile:**

| Line | Arithmetic | Amount |
|---|---|---|
| Running | 90 h × $0.03571 | $3.21 |
| Powered off | 640 h × $0.03571 | $22.86 |
| Monthly cap | $26.07 − $24.00 | −$2.07 |
| **Bill** | | **$24.00** |

**Files.** Powering off keeps the boot disk, so the 20 GiB of files are there in the morning. That is
the one thing C gets right on DigitalOcean: the state survives, at the price of a full month.

**Alternative that would actually be cheaper.** Destroy the Droplet after each session and keep a
snapshot: 90 h × $0.03571 = $3.21 of compute plus snapshot storage at $0.06 per GB-month. If the
snapshot bills only the data actually stored, 20 GB is $1.20 and the month is **$4.41**; if it bills
the full 80 GiB disk, it is $4.80 and the month is **$8.01**. Either way it is far below $24, at the
cost of a rebuild before each session and a new public IP. That is a different workload (no warm
machine), so it is not the C figure, but it is the honest answer to "how do I make C cheap here".

---

## What the shared engine prints, and why it is wrong

`priceOnPlan` bills `hoursOf().run` and has no monthly-cap rule. Fed `pricing.json`:

| Case | Engine | Hand-worked | Difference | Cause |
|---|---|---|---|---|
| A | $5.95 | $10.00 | −$4.05 | engine has no $0.01-per-Droplet floor |
| B | $52.14 | $48.00 | +$4.14 | engine has no 672-hour cap |
| C | $3.21 | $24.00 | −$20.79 | engine does not bill stopped hours |

Three gaps, not one. The smallest honest engine change that closes all three:

1. `Shape.capHours?: number` — bill `min(run, capHours)` and show the cap as a credit line.
2. `RateCard.billedWhileStopped?: boolean` — compute lines use `run + stopped`.
3. `RateCard.minimumChargePerMachine?: number` — floor each machine's bill at $0.01 (or, for tasks
   mode, each run at $0.01).

None of these were applied: this task produces research artifacts only, and `cost.ts` is shared
code. Until they are, `provider.json`'s hand-worked totals are the truth and the rendered card is
not. Do not "fix" the mismatch by editing the card's rates.

# Amazon Lightsail — A, B and C worked by hand

Rates read on 2026-10-30 from `https://aws.amazon.com/lightsail/pricing/`, the bundle table at
`https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-bundles.html`, and AWS's own
price list for Lightsail in us-east-1
(`https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonLightsail/current/us-east-1/index.json`,
publication date 2026-09-15). Workload inputs are `presets.a/b/c` in `site/src/lib/cost.ts`;
`MONTH_HOURS = 730`.

Three published rules drive every number below:

1. **Hourly, capped at the monthly price.** "For every Lightsail plan you use, we charge you the fixed
   hourly price, up to the maximum monthly plan cost." (Billing FAQ)
2. **The hourly rate is the monthly price ÷ 744.** The price list's Linux rates are exactly the
   published monthly prices divided by 744: $5 → $0.00672, $24 → $0.03225, $84 → $0.11290. 744 is
   31 × 24 hours, so a full 31-day month lands on the monthly price and a 730-hour month does not.
3. **Stopped is not free.** "These resources accrue charges even when they are in the stopped state."
   (Billing FAQ)

---

## A — 1,000 tasks × 10 minutes, 2 vCPU / 4 GiB / 10 GiB, deleted after each

**Size chosen:** Medium-4GB, 2 vCPU / 4 GB / 80 GB, $24.00 a month, $0.03225 an hour. It is the
smallest bundle with 2 vCPU and 4 GB; the 80 GB SSD is more than the 10 GiB asked for, and the bundle
cannot be trimmed.

**Hours.** 1,000 × 10 min = 10,000 min ÷ 60 = **166.6667 h**.

**Compute.** 166.6667 h × $0.03225 = **$5.375 → $5.38**.

**Disk.** Included in the bundle. No volume, because 80 GB ≥ 10 GiB.

**Minimum charge.** None is published. Unlike DigitalOcean there is no per-instance dollar floor and
no stated minimum duration, so the bill is linear in hours.

**Bill for A: $5.38.**

**The open question.** AWS says billing is hourly but never says whether a partial instance-hour is
rounded up. The card assumes pro-rata hours. If every ten-minute run were billed as a whole hour,
A would be 1,000 × 1 h × $0.03225 = **$32.25**. That is six times the pro-rata figure and it is not
resolvable from AWS's published pages; the site should show the assumption rather than hide it.

**Feasibility.** 1,000 runs in sequence never has more than one instance alive. The default quota is
20 instances (the quota table describes it as 20 vCPUs) per region, adjustable, so concurrency is not
the constraint.

---

## B — one 4 vCPU / 8 GiB / 50 GiB machine, 730 hours

**Size chosen:** Xlarge-16GB, 4 vCPU / 16 GB / 320 GB, $84.00 a month, $0.11290 an hour. Four vCPU
is the step in the ladder: the 8 GB Large bundle has only 2 vCPU, so the cheapest bundle with 4 vCPU
is $84. The compute-optimised Xlarge-8GB is the same $84 with exactly 8 GB and 320 GB; the
general-purpose Xlarge-16GB is the same price with twice the memory, so the card picks it and B is
priced on it.

**Compute.** 730 h × $0.11290 = **$82.417 → $82.42**.

**Cap.** The monthly price is $84, and 730 h is below the 744 h that $84 buys, so the cap does not
bind. A 31-day month would cost the full $84.

**Disk.** 320 GB is included; the 50 GiB ask is comfortably covered.

**Bill for B: $82.42.**

**Comparison.** The cheapest 4 vCPU machine is 3.5 times the $24 two-vCPU bundle. A reader who needs
four cores is paying for a tier jump, not for 2× the machine.

---

## C — 2 vCPU / 4 GiB / 20 GiB, 90 running + 640 stopped hours, files kept

**Size chosen:** Medium-4GB, 2 vCPU / 4 GB / 80 GB, $24.00 a month, $0.03225 an hour.

**The trap.** Workload C assumes the 640 idle hours are cheap. On Lightsail they are not: a stopped
instance is charged at the full hourly rate, and stopping only powers the machine down. The disk
stays, memory and processes do not.

**Billed hours.** 90 + 640 = **730 h**.

**Arithmetic.** 730 h × $0.03225 = **$23.5425 → $23.54**.

Line by line for the profile:

| Line | Arithmetic | Amount |
|---|---|---|
| Running | 90 h × $0.03225 | $2.90 |
| Stopped, still billed | 640 h × $0.03225 | $20.64 |
| **Bill** | | **$23.54** |

**Files.** The boot disk survives the stop, so the 20 GiB are there next session. That is the one
thing C gets right, and it costs the same as leaving the machine on all month.

**Alternative that is actually cheaper.** Delete the instance after each session and keep a manual
snapshot: 90 h × $0.03225 = $2.90 of compute, plus snapshot storage at $0.05 per GB-month. If the
snapshot bills the 20 GB of data, that is $1.00, for **$3.90** a month; if it bills the whole 80 GB
disk, $4.00, for **$6.90**. Either way it is far below $23.54, at the cost of a rebuild and a new
public IP before each session. That is a different workload (no warm machine), so it is not the C
figure, but it is the honest answer to "how do I make C cheap here".

---

## What the shared engine prints, and why

`price()` fed `pricing.json` (25 shapes with `hourly` and `monthly`, `billedWhileStopped: true`,
no per-run minimum, no whole-hour rounding):

| Case | Engine | Hand-worked | Difference | Cause |
|---|---|---|---|---|
| A | $5.38 | $5.38 | — | 166.67 h × $0.03225, pro-rata |
| B | $82.42 | $82.42 | — | 730 h × $0.11290, cap not reached |
| C | $23.54 | $23.54 | — | 730 h × $0.03225, stopped hours billed |

The engine's plan, shape and line items match: A and C pick Medium-4GB, B picks Xlarge-16GB, and C
shows a separate "Stopped, still billed" line for 640 h. No engine change is needed for this tariff:
`Shape.hourly` + `Shape.monthly` + `billedWhileStopped` express it exactly.

The one thing the card cannot express is the unknown in A. There is no field for "AWS may round each
instance-hour up", and inventing `wholeHours: true` would assert a rule AWS does not publish. The card
therefore prices pro-rata hours and `provider.json` and `pricing.json` both carry the $32.25
alternative in a flag. If AWS confirms whole-hour rounding, the correct change is `wholeHours: true`
(already supported, first used by Hetzner), not a new field.

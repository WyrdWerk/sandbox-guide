# Akamai Cloud (Linode) — A, B and C worked by hand

Prices read live on **2026-10-30** (Asia/Kolkata; 2026-10-29 UTC) from
`https://www.akamai.com/cloud/pricing/cpu` (the canonical URL behind `linode.com/pricing`) and
cross-checked against the public type list at `https://api.linode.com/v4/linode/types`, which
returned the same hourly and monthly figures. Workload inputs are `presets.a/b/c` in
`site/src/lib/cost.ts`; `MONTH_HOURS = 730`.

## Which plans the three cases land on

| Case | Ask | Plan chosen | Why | Price |
|---|---|---|---|---|
| A | 2 vCPU / 4 GiB / 10 GiB, deleted per run | Linode 4 GB | Smallest plan with 2 vCPU and 4 GiB; 80 GB disk covers 10 GiB | $0.036/h, $24/mo cap |
| B | 4 vCPU / 8 GiB / 50 GiB, 730 h | Linode 8 GB | Smallest plan with 4 vCPU and 8 GiB; 160 GB disk covers 50 GiB | $0.072/h, $48/mo cap |
| C | 2 vCPU / 4 GiB / 20 GiB, 90 + 640 h | Linode 4 GB | Same fit as A; 80 GB disk covers 20 GiB | $0.036/h, $24/mo cap |

The dedicated alternatives cost more for the same shape: G6 Dedicated 4 GB is $0.054/h ($36/mo),
G6 Dedicated 8 GB is $0.108/h ($72/mo), and the G8 8x4 is $0.14/h with **no monthly cap**
($102.20 for 730 hours). The shared plan is the honest cheapest fit in every case.

## The two billing rules that decide all three answers

1. **Usage is rounded up to the nearest hour, per service.** Akamai: "Usage is always rounded up to
   the nearest hour." A ten-minute Linode bills one hour.
2. **Each service stops charging at its monthly cap.** "You're never billed more than the monthly
   rate for each service, excluding network transfer overages." For Linode 8 GB the cap binds at
   48 ÷ 0.072 = **666.67 hours**; for Linode 4 GB at 24 ÷ 0.036 = **666.67 hours** too, because every
   shared plan is priced at exactly 666⅔ hours a month.

---

## A — 1,000 tasks × 10 minutes, 2 vCPU / 4 GiB / 10 GiB, deleted after each

**Hours of work.** 1,000 × 10 min = 10,000 min ÷ 60 = **166.6667 h**.

**Billed hours.** Each task is its own Linode and its own billable service, so each ten-minute run
rounds up to one hour: **1,000 billable hours**.

**Arithmetic.** 1,000 h × $0.036 = **$36.00**.

**Why the cap does not help.** The $24 cap applies to one service over one month. Each Linode here
exists for an hour, so it never approaches the cap: 1 h × $0.036 = $0.036, a little over three cents
a run.

**Bill for A: $36.00.** That is six times the 166.67 hours the work actually takes, and it is the
price of a provider that meters by the hour rather than the second.

---

## B — one 4 vCPU / 8 GiB / 50 GiB machine, 730 hours

**Arithmetic.** 730 h × $0.072 = **$52.56**, which is over the cap, so the bill is the monthly
price: **$48.00**.

**Where the cap binds.** 666.67 h × $0.072 = $48.00. At 666 hours the bill would be $47.95; at 667
hours it is $48.02 before the cap and $48.00 after it. Any always-on month is $48.

**Bill for B: $48.00.**

---

## C — 2 vCPU / 4 GiB / 20 GiB, 90 running + 640 stopped hours, files kept

**Billed hours.** 90 + 640 = **730 h**, because a powered-off Linode is still a service on the
account: "Charges accrue for any service present on an account, even if it's powered off or
otherwise not actively being used."

**Arithmetic.** 730 h × $0.036 = **$26.28**, capped at **$24.00**.

**Line by line for the profile:**

| Line | Arithmetic | Amount |
|---|---|---:|
| Running | 90 h × $0.036 | $3.24 |
| Stopped, still billed | 640 h × $0.036 | $23.04 |
| Monthly cap | $26.28 → $24.00 | −$2.28 |
| **Bill** | | **$24.00** |

**Files.** Stopping keeps the disk and the IP addresses, so the 20 GiB are there in the morning.
Memory and running processes are not: a stop is a power-off, not a pause.

**Bill for C: $24.00** — the same as running all month.

---

## What the shared engine prints

`pricing.json` gives every shape an hourly rate and, except for G8, a `monthly` cap, and sets
`billedWhileStopped: true` and `wholeHours: true`. Running `price()` on the card gives:

| Case | Engine | Hand-worked | Line items the engine prints |
|---|---:|---:|---|
| A | **$36.00** | **$36.00** | `1,000 runs × 1 h each, rounded up × $0.036` |
| B | **$48.00** | **$48.00** | `730 h × $0.072` then `Monthly price cap 1 × $48.00` (−$4.56) |
| C | **$24.00** | **$24.00** | `90 h × $0.036`, `Stopped, still billed 640 h × $0.036`, then the cap (−$2.28) |

The plan, the shape and the feasibility flag agree too: all three pick "Pay as you go", Linode 4 GB
/ Linode 8 GB / Linode 4 GB, and all three are feasible.

## The one assumption worth arguing with

Everything in A rests on reading "rounded up to the nearest hour" **per service**. If Akamai instead
rounded each month's total hours up, 1,000 ten-minute runs would be 166.67 → 167 h and A would cost
167 × $0.036 = **$6.01**, a sixth of the figure here. The per-service reading is the one supported by
the billing page's own description of resizing ("you effectively create a new billable service. Each
billable service appears as a separate line item"), and it is the conservative choice for a reader
deciding whether a VPS suits short tasks. It is recorded as a flag on the provider's cost section.

## What is not in the bill

- **Egress.** 1 TB to 20 TB is included by plan, then $0.005 per GB. None of A, B or C leaves enough
  traffic to matter, and the calculator does not price it.
- **Backups.** A paid add-on with four rotating copies: $5 a month ($0.008/h) on Linode 4 GB, $2 on the
  Nanode, $10 on Linode 8 GB, read from `addons.backups` in the public type list. Not part of A, B or C.
- **Images and snapshots.** Stored as Object Storage and kept until deleted; not priced here.
- **Extra IPv4 addresses.** Billed hourly with no cap since 1 July 2026, at a rate that varies by
  region; each Linode already includes one, so none of the three cases needs one.
- **Model API spend.** Not machine spend, and not included.

## Boundary probes run while checking the card

- `presets.personal` (2 vCPU / 4 GiB / 20 GiB, always on) → Linode 4 GB, **$24.00**, capped.
- `presets.chatbot` (1 vCPU / 2 GiB / 10 GiB, always on) → Linode 2 GB, **$12.00**.
- `presets.mcp` (1 vCPU / 1 GiB / 10 GiB, always on) → Nanode 1 GB, **$5.00**.
- `presets.scraper` (120 × 10 min) → Linode 2 GB, **$2.16**: 120 runs rounded to 120 hours at $0.018.
- `presets.interpreter` (20,000 × 1 min) → **$720.00**, and `presets.browser` (30,000 × 10 min) →
  **$1,080.00**. Both are the whole-hour rule doing its work, and both are why the routes file tells
  readers not to run per-task work on a Linode.

# Contabo — A, B and C worked by hand

Rates read from `https://contabo.com/en-us/vps/` and `https://contabo.com/en-us/pricing/` on
2026-10-30, cross-checked against the Cloud VPS 4 configurator
(`https://contabo.com/en-us/vps/cloud-vps-core-4`) and the product documentation
(`https://docs.contabo.com/docs/servers-hosting/vps/`). Workload inputs are `presets.a/b/c` in
`site/src/lib/cost.ts`; `MONTH_HOURS = 730`.

Three published rules drive every number below:

1. **Monthly plans only.** "One monthly price covers the resources, the network, and the platform."
   There is no hourly or per-second rate.
2. **The 1-month term is $6.60; the $5.28 headline is the 24-month rate.** "The price displayed is
   the effective monthly rate for a 24-month subscription including applicable taxes."
3. **Stopping does not stop the bill.** "The service will remain active until the end of its current
   billing period."

The smallest Core VPS is Cloud VPS 4: 4 vCPU / 8 GB / 100 GB SSD, 200 Mbit/s, one snapshot. There is
no 2 vCPU shape, so A and C are served by a larger machine than they ask for.

---

## A — 1,000 tasks × 10 minutes, 2 vCPU / 4 GiB / 10 GiB, deleted after each

**Size chosen:** Cloud VPS 4, 4 vCPU / 8 GB / 100 GB, $6.60 on the 1-month term. The smallest plan,
and a superset of the request.

**Hours.** 1,000 × 10 min = 10,000 min ÷ 60 = **166.6667 h**.

**Billing unit.** A monthly plan. 166.67 h is inside one 730-hour month, so the tasks run back to
back on one server and need **one plan**.

**Bill for A: 1 × $6.60 = $6.60.**

**Feasibility.** The tasks are sequential, so one server is enough. A fresh server per task would
mean 1,000 plans: 1,000 × $6.60 = **$6,600**. That is the honest cost of treating a Contabo VPS as a
per-task sandbox, and it is why A only makes sense as a shared, always-on box.

**What the profile says.** `cost.A` = $6.60, with the flag that the tasks must share one server.

---

## B — one 4 vCPU / 8 GiB / 50 GiB machine, 730 hours

**Size chosen:** Cloud VPS 4, 4 vCPU / 8 GB / 100 GB, $6.60. Exact fit on CPU and memory; the disk
is 100 GB against a 50 GiB ask because that is the plan's disk.

**Hours.** 730, all inside the monthly plan.

**Bill for B: 1 × $6.60 = $6.60.**

**Feasibility.** No session limit, no idle stop, no cap on hours. The server runs all month.

**24-month comparison (not used).** $5.28 a month × 24 = **$126.72 paid upfront**, an effective
$5.28 a month. The card uses the 1-month price because the site prices the cheapest monthly-billed
term at its ongoing rate.

**What the profile says.** `cost.B` = $6.60.

---

## C — 2 vCPU / 4 GiB / 20 GiB, 90 running + 640 powered-off hours, files kept

**Size chosen:** Cloud VPS 4, 4 vCPU / 8 GB / 100 GB, $6.60.

**The trap.** Workload C assumes the 640 idle hours are cheap. They are not: the plan is sold by
term, not by running hour. Powering off keeps the disk and the files, but the month is already paid
for. There is no cheaper stopped-storage rate and no pause that keeps memory.

**Billed hours.** 90 + 640 = **730 h**, all inside one monthly plan.

**Bill for C: 1 × $6.60 = $6.60.**

**Line-by-line for the profile:**

| Line | Arithmetic | Amount |
|---|---|---|
| Monthly plan | 1 × $6.60 | $6.60 |
| Stopped hours | 640 h, no extra charge and no credit | $0.00 |
| **Bill** | | **$6.60** |

**Files.** A stop keeps the whole disk, so the 20 GiB of files are there in the morning. What is lost
is memory and any running process.

**What the profile says.** `cost.C` = $6.60, with the flag that the idle hours are not cheap, they
are simply already paid for.

---

## What the shared engine prints

`pricing.json` uses the existing VPS fields: `shapes[].monthly`, `monthlyPlans: true`,
`between: "kept"`, `maxVcpu: 18`, `maxRam: 96`, `maxDisk: 600`. No engine change was needed.

Command (from `site/`):

```sh
node --input-type=module -e '
import {readFileSync} from "node:fs";
import {price, presets} from "./src/lib/cost.ts";
const card = JSON.parse(readFileSync("../research/incoming/contabo/pricing.json","utf8"));
for (const k of ["a","b","c"]) {
  const q = price(card, presets[k].workload);
  console.log(k, q.plan, q.shape, q.total, q.feasible, q.lines);
}'
```

| Case | Engine plan | Engine shape | Engine total | Hand-worked | Difference |
|---|---|---|---|---|---|
| A | Monthly (1-month term) | Cloud VPS 4: 4 vCPU / 8 GiB / 100 GiB | $6.60 | $6.60 | $0.00 |
| B | Monthly (1-month term) | Cloud VPS 4: 4 vCPU / 8 GiB / 100 GiB | $6.60 | $6.60 | $0.00 |
| C | Monthly (1-month term) | Cloud VPS 4: 4 vCPU / 8 GiB / 100 GiB | $6.60 | $6.60 | $0.00 |

The engine prints one line per case, for example:

```
Monthly plan (Cloud VPS 4)  1 × $6.60 a month, running 166.67 h of tasks back to back  $6.60
```

`feasible` is true for all three and `problems` is empty.

### Boundary checks

| Request | Engine result | Reading |
|---|---|---|
| 2 vCPU / 16 GiB / 20 GiB | Cloud VPS 8, $16.80, feasible | No 2/16 shape; the engine buys 8 vCPU / 24 GiB to get 16 GiB. This is the fixed-ratio catch. |
| 12 vCPU / 48 GiB / 400 GiB | Cloud VPS 12, $30.00, feasible | Exact fit. |
| 18 vCPU / 96 GiB / 600 GiB | Cloud VPS 18, $58.80, feasible | Top Core plan. |
| 20 vCPU / 96 GiB / 600 GiB | Cloud VPS 18, infeasible | "No size has 20 vCPU and 96 GiB; the largest is 18 vCPU / 96 GiB." |
| 4 vCPU / 8 GiB / 700 GiB | Cloud VPS 18, infeasible | "the most is 600 GiB on Cloud VPS 18." Storage Extension can add capacity up to 1.2 TB, but it is a paid add-on not in the card. |

### Model limitations

- **No hourly or per-second option.** `monthlyPlans` is the right model: one plan per machine, and
  tasks share as few plans as their hours need. The card cannot express a per-task server, because
  Contabo does not sell one.
- **The 24-month discount is not modelled.** `Shape.monthly` holds the 1-month price. A 24-month
  buyer pays $126.72 upfront and gets an effective $5.28; that is a term commitment, not the
  monthly price the calculator is comparing.
- **Add-ons are not modelled.** Auto Backup, Private Networking, an extra IPv4, a storage extension,
  Windows Server and control panels are separate monthly charges. None is in A/B/C.
- **GB vs GiB.** Contabo says 8 GB. The card treats it as 8 GiB, like the other VPS cards. If it is
  decimal, 8 GB = 7.45 GiB and B's 8 GiB request does not fit; Cloud VPS 6 (12 GB) would be needed.
- **The 600 GiB `maxDisk` is the base plan limit.** A 700 GiB request is refused even though a
  Storage Extension could reach 1.2 TB, because the extension has no published USD per-GB rate in the
  card. The refusal is honest rather than silently pricing an unknown add-on.

No change to `cost.ts` is proposed.

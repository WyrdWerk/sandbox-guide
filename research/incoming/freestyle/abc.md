# Freestyle — A, B and C worked by hand

Rates read on **2026-10-30** from `https://www.freestyle.sh/pricing.md` and
`https://www.freestyle.sh/docs/vms/pricing-and-limits`. Workload inputs are
`presets.a/b/c` in `site/src/lib/cost.ts`; `MONTH_HOURS = 730`.

The tariff has four moving parts:

1. **Per-resource, per-second.** `$0.04032` per vCPU-hour, `$0.0129` per GiB-hour
   of memory and `$0.000086` per GiB-hour of storage. vCPU and memory bill on
   what is **allocated**, not on what the guest uses. Storage bills while the VM
   runs and while it is paused.
2. **Monthly allowances on every plan.** 200 vCPU-hours, 400 GiB-hours of memory
   and 60,000 GiB-hours of storage, plus 50 GB of transfer on Free or 500 GB on a
   paid plan. They reset monthly and apply to Hobby and Pro too.
3. **A monthly minimum, not a fee on top.** Hobby is `$50/month minimum,
   including $50 usage`; Pro is `$500/month minimum, including $500 usage`. A
   month with less usage than the minimum still costs the minimum.
4. **Free is a hard stop.** On Free the allowances are caps: usage does not
   continue into paid overage.

---

## A — 1,000 tasks × 10 minutes, 2 vCPU / 4 GiB / 10 GiB, deleted after each

**Hours.** 1,000 × 10 min = 10,000 min = **166.67 h**. Ephemeral, so storage is
billed only while the VM runs.

| Line | Arithmetic | Amount |
|---|---|---:|
| CPU | 166.67 h × 2 vCPU × $0.04032 | $13.44 |
| Memory | 166.67 h × 4 GiB × $0.0129 | $8.60 |
| Storage | 166.67 h × 10 GiB × $0.000086 | $0.1433 |
| **Gross** | | **$22.1833** |
| CPU allowance | 200 vCPU-h × $0.04032 | −$8.064 |
| Memory allowance | 400 GiB-h × $0.0129 | −$5.16 |
| Storage allowance | 166.67 GiB-h used, 60,000 allowed | −$0.1433 |
| **Net metered usage** | | **$8.816** |

**Free** cannot run it: the job needs 333.3 vCPU-hours and 666.7 GiB-hours of
memory against 200 and 400, and Free stops rather than billing overage.

**Hobby:** $50 minimum + max($0, $8.816 − $50) = **$50.00**.

**A = $50.00.** The meter says $8.82; the minimum is what is charged.

---

## B — 4 vCPU / 8 GiB / 50 GiB, 730 hours, disk kept

| Line | Arithmetic | Amount |
|---|---|---:|
| CPU | 730 h × 4 vCPU × $0.04032 | $117.7344 |
| Memory | 730 h × 8 GiB × $0.0129 | $75.336 |
| Storage | 730 h × 50 GiB × $0.000086 | $3.139 |
| **Gross** | | **$196.2094** |
| CPU allowance | 200 vCPU-h × $0.04032 | −$8.064 |
| Memory allowance | 400 GiB-h × $0.0129 | −$5.16 |
| Storage allowance | 36,500 GiB-h used, 60,000 allowed | −$3.139 |
| **Net metered usage** | | **$179.8464** |

**Free** is not allowed: the shape needs 50 GiB of disk and Free caps a VM at
32 GB. **Hobby** allows 8 vCPU / 16 GiB / 64 GB, and its fee covers the first
$50 of usage, so the bill is $50 + ($179.8464 − $50) = **$179.85**.

**B = $179.85.**

---

## C — 2 vCPU / 4 GiB / 20 GiB, 90 running + 640 paused hours, disk kept

| Line | Arithmetic | Amount |
|---|---|---:|
| CPU | 90 h × 2 vCPU × $0.04032 | $7.2576 |
| Memory | 90 h × 4 GiB × $0.0129 | $4.644 |
| Storage, running | 90 h × 20 GiB × $0.000086 | $0.1548 |
| Storage, paused | 640 h × 20 GiB × $0.000086 | $1.1008 |
| **Gross** | | **$13.1572** |
| CPU allowance | 180 of 200 vCPU-h | −$7.2576 |
| Memory allowance | 360 of 400 GiB-h | −$4.644 |
| Storage allowance | 14,600 of 60,000 GiB-h | −$1.2556 |
| **Net metered usage** | | **$0.00** |

The shape fits Free's 4 vCPU / 8 GiB / 32 GB caps, and every use is inside its
monthly allowances. **C = $0.00 on Free.**

That answer depends on Free keeping the disk between sessions. The docs' plan
table marks persistent VMs available on all three plans; the pricing page's limit
table marks them unavailable on Free. If the pricing page is right, C cannot keep
its disk on Free and costs the Hobby minimum, **$50.00**.

---

## Engine comparison

Run against `research/incoming/freestyle/pricing.json` with `price()` and
`presets.a/b/c`:

| Case | Hand-worked | Engine | Difference |
|---|---:|---:|---|
| A | $50.00 | $50.00 | none; engine picks Hobby and reports the Free cap correctly |
| B | $179.85 | $179.85 | none |
| C | $0.00 (Free) | $50.00 (Hobby) | **$50.00** |

### Why C differs, and the smallest engine change

The engine applies a plan's `diskHours` allowance only to the line labelled
`Disk while running`:

```ts
const diskLine = lines.find((l) => l.label === "Disk while running");
```

C's paused storage is a separate `Disk while stopped` line, so the engine leaves
$1.10 of it unoffset. Free's `capped` flag then treats the workload as over its
allowance and `price()` falls through to Hobby, whose $50 minimum hides the
$1.10 but changes the plan and the total.

The smallest honest change is in the allowance block of `priceOnPlan` in
`site/src/lib/cost.ts`: collect both disk lines, sum their amounts, and subtract
one allowance of `min(totalDiskAmount, a.diskHours * card.disk.running)`, instead
of offsetting only the running line. That keeps the single GiB-hour budget and
fixes every paused workload, not just C. The same gap overstates the `team`
preset by $2.41 (five machines, 146,000 GiB-hours of storage against the 60,000
allowance): hand-worked $205.76 versus the engine's $208.16.

The rate card itself is not bent to hide this. No field was set to zero and no
allowance was converted into a per-hour `included` size, because that would
misprice part-time machines with large disks.

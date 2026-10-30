# Vultr — hand-worked A/B/C arithmetic

All figures are **USD from Vultr's own list**, checked 30 October 2026, excluding sales tax/VAT.
The card prices the shared **Cloud Compute** plans. The shape chosen for A, B and C is
**Regular Performance**, the cheapest family that fits each ask.

Two rules from Vultr's billing documentation drive every number:

1. **Hourly billing, one-hour minimum per server.** "The minimum billing unit is one hour, and hourly
   charges begin when a server is deployed, regardless of whether it is powered on or off."
2. **672-hour monthly cap.** "All servers on your account are billed hourly up to the monthly rate cap.
   The hourly rate is determined by dividing the monthly rate by 672 hours (28 days)." A server billed
   for more than 672 hours in a month pays the monthly price.

A stopped server is billed like a running one: "Servers that are stopped but not destroyed continue to
incur hourly charges for reserved resources such as compute, storage, and IP address allocations."
Destroying it is the only way to stop the meter, and destroying deletes the data.

## The rate used

Vultr publishes three figures for the same 2 vCPU / 4 GB plan:

| Source | Figure | Implied 1,000-hour bill |
|---|---|---:|
| Pricing page | $0.03/hr | $30.00 |
| Billing FAQ: monthly ÷ 672 | $20 ÷ 672 = $0.0297619/hr | **$29.76** |
| Plans API `hourly_cost` | $0.027/hr | $27.00 |

The card uses **monthly ÷ 672**, because that is the rule Vultr's billing FAQ states and it makes the
672-hour cap equal the monthly price. The page rounds to $0.03; the API field is a third, lower figure.
This is recorded as contradiction 1 in `research.md`. If Vultr actually bills the API figure, workload A
would be $27.00, not $29.76 — a $2.76 (9%) difference that the published pages cannot settle.

## A — 1,000 short tasks (2 vCPU / 4 GiB / 10 GiB, deleted after each)

Shape: **Regular Performance 2 vCPU / 4 GB / 80 GB**, $20/month, $0.0297619/hour. It is the cheapest
shape that fits 2 vCPU and 4 GiB, and its 80 GB disk covers the 10 GB asked for.

Work done: 1,000 × 10 minutes = 166.67 hours. **Billed: 1,000 hours**, because each of the 1,000 servers
lives for less than an hour and is rounded up to one.

| Line | Arithmetic | Amount |
|---|---|---:|
| Compute | 1,000 servers × 1 h × $0.0297619 | $29.76 |
| **Total** | | **$29.76** |

- One public IPv4 is included; no separate IP line.
- The monthly cap never applies: every server exists for one hour.
- The 3 TB egress allowance is far above what a ten-minute task uses.
- **Engine check:** `1,000 runs × 1 h each, rounded up × $0.02976 = $29.7619`, shape
  `Regular Performance 2 vCPU / 4 GB`, feasible. Matches the hand-worked **$29.76**.

## B — one always-on box (4 vCPU / 8 GiB / 50 GiB, 730 hours)

Shape: **Regular Performance 4 vCPU / 8 GB / 160 GB**, $40/month, $0.0595238/hour. Cheapest shape that
fits 4 vCPU and 8 GiB; 160 GB covers the 50 GB asked for.

| Line | Arithmetic | Amount |
|---|---|---:|
| Compute at the hourly rate | 730 h × $0.0595238 | $43.45 |
| Monthly cap | min($43.45, $40.00) | **$40.00** |
| **Total** | | **$40.00** |

- The cap binds at exactly 672 hours: 672 × $0.0595238 = $40.00. A 600-hour month would cost $35.71.
- Automatic backups would add 20%, **$8.00** a month.
- The plan includes 4 TB of egress; overage is $0.01/GB.
- **Engine check:** `730 h × $0.05952 = $43.4524`, then `1 × $40.00 a month = −$3.4524`, total
  **$40.00**, shape `Regular Performance 4 vCPU / 8 GB`, feasible. Matches.

## C — 90 running + 640 stopped hours (2 vCPU / 4 GiB / 20 GiB, files kept)

Shape: **Regular Performance 2 vCPU / 4 GB / 80 GB**, $20/month, $0.0297619/hour.

| Line | Arithmetic | Amount |
|---|---|---:|
| Running | 90 h × $0.0297619 | $2.68 |
| Stopped, still billed | 640 h × $0.0297619 | $19.05 |
| Subtotal | 730 h × $0.0297619 | $21.73 |
| Monthly cap | min($21.73, $20.00) | **$20.00** |
| **Total** | | **$20.00** |

- Stopping does not stop the meter. The 640 stopped hours cost $19.05, almost as much as the 90 running
  hours cost $2.68.
- The monthly cap binds because 730 billed hours exceed 672.
- **Snapshot-and-destroy** is the only cheaper pattern: a 20 GB snapshot at $0.05/GB is **$1.00** a month,
  plus 90 hours of compute at **$2.68**, total **$3.68**. It loses the public IP, the memory and any
  running process, and a rebuild takes minutes.
- **Engine check:** `90 h × $0.02976 = $2.6786`, `640 h × $0.02976 = $19.0476`, then the cap line
  `−$1.7262`, total **$20.00**, feasible. Matches.

## Boundary checks the card must get right

| Check | Hand answer | Engine answer |
|---|---|---|
| 671 h on RP 2/4 (just under the cap) | 671 × $0.0297619 = **$19.97** | $19.97, no cap line |
| 672 h on RP 2/4 (at the cap) | 672 × $0.0297619 = **$20.00** | $20.00, cap line −$0.00 |
| 673 h on RP 2/4 (over the cap) | **$20.00** | $20.00, cap line −$0.03 |
| 1-minute task on RP 1/2 | 1 h × $0.0148810 = **$0.0149** | $0.0149 |
| 61-minute task on RP 1/2 | 2 h × $0.0148810 = **$0.0298** | $0.0298 |
| 2 vCPU / 4 GiB / 200 GiB | 160 GB shape + 40 GiB volume = $40 + $4 = **$44.00** | $44.00, `+ 40 GiB volume` |
| 1 vCPU / 0.5 GiB | $3.50 (IPv4 plan, not the $2.50 IPv6-only plan) | $3.50 |
| 32 vCPU / 128 GiB | Infeasible; largest is 24 vCPU / 96 GiB | $640 shown, `feasible: false`, "No size has 32 vCPU and 128 GiB; the largest is 24 vCPU / 96 GiB." |

The oversized case is priced on the largest shape as an illustration but flagged infeasible; $640 is not
a price for the 32 vCPU ask.

## What the card cannot express

- **Per-region price differences.** Vultr's FAQ says some locations differ; the card uses the standard
  USD list.
- **The exact 672-hour month.** The engine uses 730 hours for an always-on month; because the monthly
  price caps the bill, A/B/C are unaffected. A 720- or 744-hour calendar month still pays the same cap.
- **Additional IPv4 addresses.** Vultr says up to two more are available for an extra fee but does not
  publish the amount on the pages read, so the card cannot add it.
- **Windows licences, DDoS Protection ($10/month), snapshots, backups, File System and Object Storage.**
  These are separate products and are noted rather than priced.
- **The API's $0.027 hourly figure.** The card cannot hold three rates for one plan; the chosen
  monthly ÷ 672 figure is documented and makes the cap arithmetic consistent.

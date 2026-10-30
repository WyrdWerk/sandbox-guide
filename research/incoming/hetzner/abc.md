# Hetzner Cloud — hand-worked A/B/C arithmetic

All figures are **USD from Hetzner's own price list** (`website-price-api.hetzner.com`, the API the plan
pages render from), EU network zone (Falkenstein, Nuremberg or Helsinki), **excluding VAT**, and include
one Primary IPv4 at $0.60 a month where a public IPv4 is needed. The EUR equivalents are in `research.md`.

Two rules from Hetzner's billing FAQ drive every number:

1. **The monthly price is a cap, not a fee.** Bill = min(monthly price, hourly rate × billed hours).
2. **Billed hours are rounded up per server, and a server is billed from creation until deletion — running
   or not.** A 10-minute server is one billed hour; a powered-off server bills exactly like a running one.

At the current rates the cap binds at:

| Shape | Hourly | Monthly | Hours to reach the cap |
|---|---:|---:|---:|
| CPX22 (2 vCPU / 4 GB / 80 GB) | $0.0368 | $22.99 | 22.99 / 0.0368 = **624.7 h** |
| CPX32 (4 vCPU / 8 GB / 160 GB) | $0.0673 | $41.99 | 41.99 / 0.0673 = **623.9 h** |

So an always-on 730-hour month is billed at the cap, and a month with fewer than about 624 hours is billed
at the hourly rate.

## A — 1,000 short tasks (2 vCPU / 4 GiB / 10 GiB, deleted after each)

Shape: **CPX22**, 2 vCPU / 4 GB / 80 GB. It is the cheapest shape that fits 2 vCPU and 4 GB, and its 80 GB
disk covers the 10 GB asked for.

Work done: 1,000 × 10 minutes = 166.67 hours. **Billed: 1,000 hours**, because each of the 1,000 servers
lives for less than an hour and is rounded up to one.

| Line | Arithmetic | Amount |
|---|---|---:|
| Compute | 1,000 servers × 1 h × $0.0368 | $36.80 |
| Primary IPv4 | 1,000 × 1 h × $0.0010 | $1.00 |
| **Total** | | **$37.80** |

- IPv6-only would be **$36.80**; IPv6 is free but many agent endpoints still need IPv4.
- The monthly cap never applies: every server exists for one hour.
- Feasibility: 1,000 creations. Hetzner publishes neither the default project limit nor the API request
  rate limit on the pages read, and the first limit increase needs "a month and a paid first invoice", so
  this workload may not be possible on a fresh account. That is a real constraint, not a pricing one.
- **Engine check:** with `minimumPerRun: 0.0368` (CPX22's hourly rate) the engine prints
  `166.67 h × $0.0368 = $6.13` plus `1,000 runs × ($0.0368 − $0.006133) = $30.67`, total **$36.80** —
  the server-only hand-worked figure. The remaining $1.00 is the IPv4, which the card cannot add.

## B — one always-on box (4 vCPU / 8 GiB / 50 GiB, 730 hours)

Shape: **CPX32**, 4 vCPU / 8 GB / 160 GB. Cheapest shape that fits 4 vCPU and 8 GB; 160 GB covers 50 GB.

| Line | Arithmetic | Amount |
|---|---|---:|
| Compute at the hourly rate | 730 h × $0.0673 | $49.13 |
| Compute after the cap | min($49.13, $41.99) | **$41.99** |
| Primary IPv4 | 1 × $0.60 a month | $0.60 |
| **Total** | | **$42.59** |

- IPv6-only would be **$41.99**.
- Backups are optional and add 20% of the server price: $41.99 × 0.20 = **$8.40** a month.
- **Engine check:** `730 h × $0.0673 = $49.13`, then `1 × $41.99 a month = −$7.14`, total **$41.99** —
  exactly the server-only hand-worked figure, thanks to `shape.monthly`. The $0.60 IPv4 is outside the card.

## C — three hours a day (2 vCPU / 4 GiB / 20 GiB, 90 running + 640 stopped hours)

Shape: **CPX22**. The machine is powered off for 640 hours, which on Hetzner changes nothing about the bill.

| Line | Arithmetic | Amount |
|---|---|---:|
| Compute for 730 hours of existence | 730 h × $0.0368 = $26.86, capped at $22.99 | **$22.99** |
| Powered-off hours | 640 h at the same rate — already in the line above | $0.00 |
| Primary IPv4 | 1 × $0.60 a month | $0.60 |
| **Total** | | **$23.59** |

- C is the workload where Hetzner loses to every sandbox provider: it costs the same as leaving a small
  server on all month, for a machine that is idle two thirds of the time.
- **Engine check:** `90 h × $0.0368 = $3.31` + `640 h × $0.0368 = $23.55` = $26.86, then the cap
  `−$3.87`, total **$22.99** — the server-only hand-worked figure, thanks to `billedWhileStopped` and
  `shape.monthly`. The $0.60 IPv4 is outside the card.
- **The only cheaper pattern** is the one Hetzner's own docs suggest — snapshot and delete:
  - Snapshot of a 20 GB disk: billed per compressed GB-month. Hetzner does not publish the rate on its live
    pricing pages (see `research.md` §6); at the last figure visible in an archived page variant
    ($0.0130/GB-month) a 20 GB snapshot would be about **$0.26** a month. Treat it as an unknown, not zero.
  - Compute for 90 hours: 90 × $0.0368 = **$3.31**.
  - Primary IPv4 kept detached: **$0.60** (or free if you let it be deleted and take a new address).
  - Total ≈ **$4.17 plus the snapshot rate**, but every resume is a rebuild from the snapshot, the address
    changes unless you keep the IP, and anything the agent left in memory is gone.

## Summary

| Case | Hand-worked bill (USD, EU, with IPv4) | Engine (server only) | Difference |
|---|---:|---:|---|
| A | $37.80 | $36.80 | $1.00 IPv4 (1,000 one-hour IPs) |
| B | $42.59 | $41.99 | $0.60 IPv4 |
| C | $23.59 | $22.99 | $0.60 IPv4 |

The engine now matches the server price exactly for all three cases. The only tariff it cannot express is
the separately billed Primary IPv4, which is $0.60 per machine-month or $0.001 per hour. One card-wide
caveat remains: `minimumPerRun` is a single dollar value, set to CPX22's $0.0368, so a short run on the
smaller CPX12 is overstated by $0.0152 (the scraper preset prints $4.42 instead of $2.59 before IPv4).

**Currency.** These are Hetzner's own USD figures, so no exchange rate is assumed. A reader billed in EUR
would use the EUR list, which is about **1.18× lower** (CPX22 €19.49 vs $22.99; CPX32 €35.49 vs $41.99);
VAT at 19% is excluded from both lists. The account currency is fixed at signup and cannot be changed.

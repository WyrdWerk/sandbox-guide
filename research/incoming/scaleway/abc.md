# Scaleway Instances — hand-worked A/B/C

All figures are **USD**, **before VAT**, converted from Scaleway's EUR list at the **ECB reference rate for 29 October 2026: 1 EUR = 1.1130 USD**. Scaleway publishes no USD list; this is a conversion, not a provider quote. A French consumer adds 20% VAT; a VAT-registered EU business is reverse-charged.

Four rules drive every number:

1. **The Instance price excludes storage and the IPv4.** The card prices a **Block Storage 5K** volume at €0.000130/GB/hour on every shape; the IPv4 is added by hand here.
2. **Every resource is billed for a minimum of 60 minutes per start and stop event.** A ten-minute task pays a full hour of compute, a full hour of volume and a full hour of IPv4.
3. **Powering off stops compute billing**; storage and a reserved flexible IPv4 keep billing. There is no monthly cap.
4. **One storage class is priced.** Local SSD on DEV1, GP1 and STARDUST1 is cheaper (€0.000049/GB/hour), but the engine has one disk rate per plan and one stopped rate per card, so a card holding both classes would misprice stopped block volumes. The local-SSD totals are shown as alternatives below.

Rates used:

| Resource | EUR | USD (×1.113) |
|---|---:|---:|
| DEV1-M (3 vCPU / 4 GiB) | €0.0202/h | $0.022483/h |
| DEV1-L (4 vCPU / 8 GiB) | €0.04284/h | $0.047681/h |
| Block Storage 5K (priced by the card) | €0.000130/GB/h | $0.00014469/GiB/h |
| Local SSD (alternative, not in the card) | €0.000049/GB/h | $0.000054537/GiB/h |
| Flexible IPv4 | €0.005/h (€3.65/mo) | $0.005565/h ($4.0625/mo) |

## A — 1,000 short tasks (2 vCPU / 4 GiB / 10 GiB, deleted after each)

Shape: **DEV1-M**, 3 vCPU / 4 GiB. It is the cheapest offer that fits 2 vCPU and 4 GiB: $0.022483/h against PLAY2-NANO at $0.030652/h and BASIC3-X2C-4G at $0.043908/h.

Work done: 1,000 × 10 minutes = 166.67 hours. **Billed: 1,000 hours**, because each resource lives for less than the 60-minute floor.

| Line | Arithmetic | Amount |
|---|---|---:|
| Compute | 1,000 runs × 1 h × $0.022483 | $22.48 |
| Block Storage 5K | 1,000 h × 10 GiB × $0.00014469 | $1.45 |
| Flexible IPv4 | 1,000 × 1 h × $0.005565 | $5.57 |
| **Total** | | **$29.49** |

- Precise arithmetic: 22.4826 + 1.4469 + 5.565 = 29.4945. The rounded lines add to $29.50.
- On DEV1 **local SSD** the disk line is $0.55 and the total **$28.59**. IPv6-only with local SSD is **$23.03**.
- Feasibility: the default quota is 8 DEV1-M Instances with a validated payment method (15 with identity validated), so the runs must be sequential or spread across offer types. 1,000 simultaneous machines are not available without a quota increase.
- **Engine check:** the card prints `166.67 h × $0.02248 = $3.75` plus `1,000 runs × ($0.02248 − $0.003747) = $18.74`, total **$22.48** of compute, plus `$0.24` of disk, for **$22.72**. It matches the compute line exactly. It differs on two lines: the disk is billed for 166.67 hours rather than the 1,000 billed hours ($0.24 vs $1.45), and the IPv4 is not in the card at all ($5.57).
- This is the workload Scaleway is worst at. A per-second sandbox bills about $3.75 of compute for the same 166.67 hours; the 60-minute floor multiplies it by six.

## B — one always-on box (4 vCPU / 8 GiB / 50 GiB, 730 hours)

Shape: **DEV1-L**, 4 vCPU / 8 GiB. Cheapest offer that fits; PLAY2-MICRO is $0.061304/h and BASIC3-X4C-8G $0.087927/h.

| Line | Arithmetic | Amount |
|---|---|---:|
| Compute | 730 h × $0.047681 | $34.81 |
| Block Storage 5K | 730 h × 50 GiB × $0.00014469 | $5.28 |
| Flexible IPv4 | 730 h × $0.005565 | $4.06 |
| **Total** | | **$44.15** |

- Precise arithmetic: 34.8071 + 5.2812 + 4.0625 = 44.1508.
- There is no monthly cap, so 730 hours is the bill, not a discounted cap.
- On **local SSD** the disk line is $1.99 and the total **$40.86**; IPv6-only on local SSD is **$36.80**.
- The trade-off: DEV1 is AMD EPYC 7281 at 2.1 GHz, shared, with **no SLA**. The current-generation BASIC3-X4C-8G with 50 GiB of block storage is 730 × $0.087927 = $64.19 + $5.28 + $4.06 = **$73.53**, with a 99% SLO.
- **Engine check:** `730 h × $0.04768 = $34.81` plus `730 h × 50 GiB × $0.0001447 = $5.28`, total **$40.09** — exactly the hand-worked compute and disk. The $4.06 IPv4 is outside the card.

## C — three hours a day (2 vCPU / 4 GiB / 20 GiB, 90 running + 640 stopped hours)

Shape: **DEV1-M**. The 640 powered-off hours release the hypervisor, so they cost no compute; the volume and the reserved IPv4 keep billing.

| Line | Arithmetic | Amount |
|---|---|---:|
| Compute | 90 h × $0.022483 | $2.02 |
| Block Storage 5K | 730 h × 20 GiB × $0.00014469 | $2.11 |
| Flexible IPv4 | 730 h × $0.005565 (reserved while off) | $4.06 |
| **Total** | | **$8.20** |

- Precise arithmetic: 2.0234 + 2.1125 + 4.0625 = 8.1984. The rounded lines add to $8.19.
- On **local SSD** the disk line is $0.80 and the total **$6.88**; IPv6-only on local SSD is **$2.82**.
- Archiving local storage on stop does not save money: the archive is snapshot storage at the same €0.000049/GB/hour.
- This is Scaleway's best case against the other VPS providers: a machine used three hours a day costs $8.20, not a full monthly plan.
- **Engine check:** `90 h × $0.02248 = $2.02` + `90 h × 20 GiB × $0.0001447 = $0.26` + `640 h × 20 GiB × $0.0001447 = $1.85`, total **$4.14** — exactly the hand-worked compute and disk, including the stopped hours. The $4.06 IPv4 is outside the card.

## Summary

| Case | Hand-worked bill (USD, block storage, with IPv4) | Engine (machine + disk) | Difference | Local-SSD alternative |
|---|---:|---:|---|---:|
| A | $29.49 | $22.72 | $5.57 IPv4 + $1.21 storage minimum | $28.59 |
| B | $44.15 | $40.09 | $4.06 IPv4 | $40.86 |
| C | $8.20 | $4.14 | $4.06 IPv4 | $6.88 |

The card is exact for compute and block storage on B and C, including the stopped hours. The remaining gap is structural: `RateCard.perMachine` follows billed machine hours, so it cannot charge an address that survives a stop, and the engine applies `minimumSeconds` to compute only.

**Smallest engine change to close the IPv4 gap** (one line plus one test):

```ts
// src/lib/cost.ts, in the perMachine block
- const perMachineHours = (h.run + stoppedBilled) / Math.max(1, h.machines);
+ const perMachineHours = (h.run + h.stopped) / Math.max(1, h.machines);
```

and, in the tasks branch of the same block, bill `Math.max(h.session, (card.minimumSeconds ?? 0) / 3600)` hours per run rather than `h.session`. For Hetzner (the only card using `perMachine`, with `billedWhileStopped: true`) `stoppedBilled === h.stopped`, so its numbers do not change. With that change, adding `"perMachine": {"label": "Flexible IPv4", "hourly": 0.005565, "monthly": 4.0625}` to `pricing.json` makes all three cases match the hand-worked bills.

**If the card should price local SSD too**, the engine needs a plan-level stopped-disk rate (`rates.diskStopped`, used for the `Disk while stopped` line the same way `rates.diskRunning` is used while running). That is a slightly larger change and is not required while the card prices one storage class.

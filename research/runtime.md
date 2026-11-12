
## Recheck, 12 November 2026

Full recheck of all 16 features and 78 capabilities: [runtime-recheck-2026-11-12.md](runtime-recheck-2026-11-12.md). The earlier ledger is kept as written.

- Pay first since 10 November 2026: "No free usage before you pay. You add credit by card from $10" (https://withruntime.com/pricing). The first $10 is matched; the 100 GiB-hour / 25 vCPU-hour monthly allowance applies only after a purchase. Legacy accounts keep remaining free hours (https://withruntime.com/docs/included-usage.md).
- Sandbox unit rates unchanged ($0.025/active vCPU-h, 50-millicore floor, $0.0075/GiB-h, $0.08/GB-month disk, 10 GiB running disk included, $0.02/GB egress after 100 GiB, $5 IPv4, $5 WireGuard). A/B/C and their test fixtures stand; the $10 is prepaid usage, not a fee.
- Verdicts: built-in-agents and trials-free-tiers features now partly; ssh yes; prompt-api, free-tier and no-card partly.
- Hosted Agents (private beta) run Claude Code, Codex or Gemini CLI per session at $0.03/active vCPU-h + $0.01/GiB-h, from the SDK types only.
- Status: 97.85% API over 30 days; 4 November 61.38% while the incident list says "No incidents recorded."
- Corrected: the "about $0.03 an hour" waiting cost is mostly memory; the docs state $0.03125 for 2 vCPU / 4 GiB, memory plus the floor.

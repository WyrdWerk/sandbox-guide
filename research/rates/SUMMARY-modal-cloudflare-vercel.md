# Rate cards: Modal, Cloudflare Sandboxes, Vercel Sandbox

Disclosure: battleships.dev, cited in this document, is built by the Boat team; Boat is one of the providers compared here. It is used as a cross-check, never as the sole source of a rate or verdict.

Checked 2026-10-29 against each provider's live pricing page and docs. Files: `modal.json`, `cloudflare-sandbox.json`, `vercel-sandbox.json`.

**No published rate changed since the 2026-10-28 research.** Every number in the three rate cards — Modal's $0.00003942/core-second and $0.00000667/GiB-second, Cloudflare's $0.000020/vCPU-second, $0.0000025/GiB-second and $0.00000007/GB-second, Vercel's $0.128/vCPU-hour and $0.0212/GB-hour — is still on the live page. The diffs below are with Battleships and with details the research did not pin down, not with the providers' prices.

## The Modal core question, settled

Modal bills sandbox CPU **per physical core**, and its own pages define one physical core as **2 vCPUs**:

- "Physical core (2 vCPU equivalent)" — [pricing](https://modal.com/pricing), on the sandbox CPU row priced at $0.00003942 per core-second.
- "The cpu parameter specifies physical CPU cores (1 core = 2 vCPUs), and memory specifies MiB" — [Sandbox resources](https://modal.com/docs/guide/sandbox-resources).
- "Note that each physical core is equivalent to 2 vCPUs as offered by AWS or GCP." — [pricing FAQ](https://modal.com/pricing).

So the documented vCPU-equivalent rate is **$0.070956 per vCPU-hour** (half of $0.141912 per core-hour). Battleships prices $0.141912 as a vCPU-hour, i.e. twice the documented vCPU-equivalent rate. What the docs do **not** settle is how many CPUs the guest actually sees for a given `cpu=` value; Battleships reports a benchmark where `cpu=N` gives `nproc N`. That was not tested here, so the JSON records the billing unit as settled and the guest CPU count as unverified.

## Diffs vs Battleships (5 per provider)

| Provider | Field | Battleships | Live |
|---|---|---|---|
| Modal | CPU unit | 1 core = 1 vCPU, $0.141912/vCPU-h | 1 core = 2 vCPU; $0.141912/core-h = $0.070956/vCPU-h |
| Modal | SSH | yes | no SSH server; `modal shell sb-...` only |
| Modal | Automatic snapshots | no | exit snapshots are automatic when enabled at creation |
| Modal | Docker inside | no | documented on the opt-in VM runtime |
| Modal | Fork | yes | no live fork; several sandboxes from one snapshot |
| Cloudflare | Snapshot storage | $0.015/GiB-month | no snapshot rate published anywhere |
| Cloudflare | EU residency | yes | `durable_object` policy rejects placement constraints |
| Cloudflare | Snapshot status | private beta | public beta |
| Cloudflare | Instance type scope | per class at deploy time | per `start()` on the durable_object policy |
| Cloudflare | Idle tail | 10-minute default | no default timeout on Sandbox SDK 1.0 |
| Vercel | CPU minimum | 60 s applied to CPU | 1-minute minimum on provisioned memory only |
| Vercel | Egress | $0.15/GB with 1 TB free | Hobby 20 GB/month; Pro bundled in Flat Rate CDN; Enterprise $0.15/GB |
| Vercel | Fork while running | yes | fork from the latest snapshot, not live memory |
| Vercel | Usage API | no | SDK exposes cumulative usage counters |
| Vercel | Hobby reset rule | 30 days after first use | page says both "next billing cycle" and "30 days" |

## Details added or sharpened since the research

- **Cloudflare:** Workers Logs pricing changes to Cloudflare Observability pricing on **1 December 2026**; until then 20M events/month are included, then $0.60/M. There is no Sandboxes pricing page of its own: `/sandbox/pricing/` returns 404, and the rate card lives at `/containers/platform/pricing/`.
- **Cloudflare:** the durable_object policy has no per-app `max_instances`, so the real concurrency limit is the account-wide 1,500 vCPU / 6 TiB / 30 TB.
- **Vercel:** Hobby's 15 GB snapshot and 15 GB drive allowances are explicitly "lifetime", not monthly.
- **Vercel:** Vercel removes sandboxes that cannot resume from a snapshot after **14 days of inactivity** — a retention rule the research did not record.
- **Vercel:** the Pro table has no per-GB sandbox transfer rate; it reads "Included in Flat Rate CDN". Only Hobby (20 GB/month) and Enterprise ($0.15/GB) are explicit.
- **Modal:** the sandbox CPU and memory rows sit under a separate "Modal Sandbox pricing" section with a 3x non-preemptible multiplier; the list (Function) CPU rate is $0.0000131/core-second.

## Deploy: what exists for Hermes and OpenClaw

- **Modal + Hermes:** documented terminal backend in Hermes ("Runs commands in a Modal cloud sandbox..."), configured with `terminal.backend: modal` plus Modal tokens. Hermes still runs on your machine; Modal runs the commands. No Modal-side template or guide found, and no one-click option. Not an always-on host: 24-hour sandbox ceiling, no pause.
- **Cloudflare + OpenClaw:** an official, experimental OpenClaw template (`scripts/cloudflare`) deploys one Worker, one Durable Object and one `standard-2` Container with `max_instances: 1`, Litestream to R2, and stays awake by default. OpenClaw's own estimate is roughly $40–50/month before egress. Manual route: git, Docker, Wrangler, then a one-time `wrangler containers ssh` bootstrap.
- **Cloudflare + Hermes:** not found in either project's docs.
- **Vercel + Hermes:** an official Vercel guide, but it is a laptop-driven terminal backend (macOS/Linux/WSL2, Vercel CLI, `hermes config set terminal.backend vercel_sandbox`), one sandbox per task.
- **Vercel + OpenClaw:** an official Vercel KB walkthrough (Sandbox CLI, `npm i -g openclaw`, onboarding wizard, nohup gateway, WhatsApp QR) and a separate `vercel-labs/vercel-openclaw` review PoC that is "not a production-ready hosting service".
- **Dashboard-only:** none of the three lets a non-coder create and run an agent from the dashboard. Modal and Cloudflare dashboards observe; Vercel's can stop or delete an existing persistent sandbox.

## Could not confirm

- **Modal snapshot storage price:** no rate published; snapshots are billed but uncostable.
- **Modal per-container maximum CPU/memory:** enforced but not published.
- **Cloudflare snapshot storage price:** no rate on the rate card or the Sandboxes pages.
- **Cloudflare region pinning for sandboxes:** the Wrangler reference rejects placement constraints for the durable_object policy, but whether support can change that is unpublished.
- **Vercel CPU metering granularity:** only the memory minimum is published.
- **Vercel regional rates beyond `iad1`:** the other values sit behind an interactive selector and were not read.
- **Vercel custom domains for sandbox ports:** no documentation found.
- **Guest CPU count on Modal:** the billing unit is documented; the number of CPUs the guest sees was not tested.
- **Hermes "Nous-managed gateway":** mentioned once in Hermes' backend configuration page ("direct or via the Nous-managed gateway") with no page explaining what it is; not treated as a managed hosting option.

## Method and verification

Direct HTTPS fetches of the official pages (Context.dev search used once, for discovery of the OpenClaw/Vercel guides). 189 quotations were checked mechanically against the fetched page text after whitespace normalisation; all matched. All 72 distinct URLs used in the three files returned HTTP 200, and every `#fragment` used in `docs` exists as an element id on its page. No account was created, no sandbox was started, and nothing was committed or pushed.

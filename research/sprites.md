# Sprites by Fly.io: research for the sandbox guide

Research date: 2026-10-28. Desk research only; no account, sandbox, or billed Sprites resources were created. Rates and product descriptions can change. This is not an operational test.

**Bottom line — inferred:** Sprites is best understood as a persistent Linux computer that automatically moves between running, memory-preserving suspension, and a disk-only cold state. Its bill tracks measured consumption rather than a purchased fixed-size machine; idle disk can still cost money. Evidence: lifecycle and pricing pages quoted below.

Evidence labels: **docs-confirmed** means a provider-owned page, including Fly's community pages; **pricing-page** means Fly's pricing page; **third-party** means Battleships; **inferred** is our interpretation/calculation and identifies its evidence; **not-published** means not found in the sources checked, not proof that a capability is impossible. Each direct-evidence bullet gives a URL and an exact quotation. A quotation can support multiple closely related claims in the same bullet.

## 1. What it is and who it is for

- **docs-confirmed** — Sprites are isolated Linux environments for code and agents: [overview](https://docs.fly.io/sprites/index.md): “Sprites are persistent, hardware-isolated Linux environments for running arbitrary code.”
- **docs-confirmed** — Intended uses include agents, development environments, user-submitted code, and services: [overview](https://docs.fly.io/sprites/index.md): “They're useful for things like AI agents, persistent development environments, or user-submitted code.”
- **inferred** — Do not substitute Fly Machines' VM prices or features for Sprites: the [pricing page](https://fly.io/pricing/) has separate Machines and Sprites sections, quoted in section 10.

## 2. Isolation and privileges

- **docs-confirmed** — Hardware isolation is advertised as a dedicated microVM: [overview](https://docs.fly.io/sprites/index.md): “Hardware-level** ✓ — dedicated microVM”.
- **docs-confirmed** — Sprites do not use systemd; their own service manager is the alternative: [services](https://docs.fly.io/sprites/concepts/services.md): “Sprites don't run systemd; the log files and the create/start streams are how you see service output.”
- **third-party** — Battleships reports Docker and root, but not nested virtualization: [JSON](https://battleships.dev/data/providers/sprites.json): `"docker_inside": true`, `"root": true`, `"nested_virt": false`.
- **docs-confirmed** — A Fly community user reports a Docker limitation, not a general prohibition: [community report](https://community.fly.io/t/27956): “Within sprites, running docker exec will fail for any container whose PID 1 is non-root.”
- **not-published** — A definitive guest capability list, nested KVM guarantee, and complete root privilege boundary were not established from the provider documentation checked. Do not interpret root inside a VM as host root.
- **inferred** — A microVM is a stronger isolation boundary than merely placing processes in one shared host container, but the actual threat model and untrusted-code guarantees need explicit provider review; evidence: [overview](https://docs.fly.io/sprites/index.md) above.

## 3. Lifecycle and persistence

- **docs-confirmed** — Active use is metered, and idle begins after a short window: [lifecycle](https://docs.fly.io/sprites/concepts/lifecycle.md): “When the activity stops, a short idle window passes (about 30 seconds today) and the Sprite pauses.”
- **docs-confirmed** — Warm suspension preserves RAM and running processes: [lifecycle](https://docs.fly.io/sprites/concepts/lifecycle.md): “The VM is suspended with everything in memory frozen in place. Compute billing stops. The next request resumes it in 100–500ms, and processes pick up mid-thought, exactly where they were.”
- **docs-confirmed** — Cold drops memory and restarts processes: [lifecycle](https://docs.fly.io/sprites/concepts/lifecycle.md): “If the Sprite stays idle long enough, the VM is fully stopped and in-memory state is dropped. The next wake takes 1–2s and starts processes fresh.”
- **docs-confirmed** — The warm-to-cold transition is not user-selected or visible, and connections drop even on warm pause: [lifecycle](https://docs.fly.io/sprites/concepts/lifecycle.md): “One thing drops either way: open TCP connections do not survive a pause, warm or cold.”
- **docs-confirmed** — Persistent data is not limited to one mounted folder: [quickstart](https://docs.fly.io/sprites/quickstart.md): “Sprites remember your entire filesystem between sessions.”
- **docs-confirmed** — Destroy is different from sleeping: [working with Sprites](https://docs.fly.io/sprites/working-with-sprites.md): “Destruction is irreversible!** All data is permanently deleted: files, packages, checkpoints. No undo.”
- **docs-confirmed** — A configured service can resume after cold wake: [services](https://docs.fly.io/sprites/concepts/services.md): “The runtime starts every service fresh, in dependency order.”
- **not-published** — No precise warm-to-cold timeout, maximum Sprite lifetime, initial creation latency, or universal maximum running session was found. The published wake times are claims, not independent benchmarks.
- **docs-confirmed** — Wake-on-request is explicitly documented: [working with Sprites](https://docs.fly.io/sprites/working-with-sprites.md): “When a request hits your Sprite's URL, it wakes automatically.”
- **docs-confirmed** — Idle detection has exceptions, and a task hold is bounded: [Sprites FAQ](https://fly.io/sprites/): “Four things reset the idle timer: an in-flight HTTP/API request, output to a session or exec'd process's stdout (redirecting to a file or detaching tmux doesn't count), an open TCP connection, or an active task”; same page: “max 1 hour, renewable”.
- **inferred** — An open connection can keep the meter running even if the user thinks the Sprite is idle; verify using the activity rules and actual usage, not a presumed timer. Evidence: preceding FAQ quote.

## 4. Snapshots, fork, images, volumes

- **docs-confirmed** — Checkpoints are writable-filesystem snapshots, not process or RAM snapshots: [checkpoints](https://docs.fly.io/sprites/concepts/checkpoints.md): “A checkpoint snapshots the writable filesystem overlay: everything you've added on top of the base image. It does not touch the base image itself, and it does not capture anything that only lives in memory.”
- **docs-confirmed** — A checkpoint can be taken without interrupting work: [checkpoints](https://docs.fly.io/sprites/concepts/checkpoints.md): “It runs copy-on-write, so it's fast and doesn't interrupt the Sprite.”
- **docs-confirmed** — Restoration overwrites current work: [checkpoints](https://docs.fly.io/sprites/concepts/checkpoints.md): “Restoring overwrites your current filesystem with the checkpoint's, and the state you replace is not backed up for you.”
- **docs-confirmed** — Automatic checkpoints are also made and pruned: [checkpoints](https://docs.fly.io/sprites/concepts/checkpoints.md): “Alongside the checkpoints you take by hand, the platform creates its own in the background as you work.”
- **docs-confirmed** — Storage is a local ext4 filesystem with durable backing, not a mounted object-store substitute: [lifecycle](https://docs.fly.io/sprites/concepts/lifecycle.md): “It is not an object-storage shim or a network filesystem.”
- **not-published** — A public create-from-checkpoint/fork API, live memory fork, custom OCI image, attachable/shared volumes, and a separate checkpoint price were not established from the docs checked. Do not equate an in-place restore with a fork.
- **docs-confirmed** — Checkpoint blocks can add storage charges: [checkpoints](https://docs.fly.io/sprites/concepts/checkpoints.md): “You're billed for the blocks actually kept, and deleting a checkpoint frees that space right away.”

## 5. Capacity, GPU, architecture, regions

- **docs-confirmed** — The Sprite shape is not the requested fixed 2- or 4-vCPU VM: [lifecycle](https://docs.fly.io/sprites/concepts/lifecycle.md): “The vCPU count and the storage ceiling are fixed; memory is handled automatically.” The same page lists “8 vCPUs” and “100 GB of storage”.
- **docs-confirmed** — Memory is not a selectable fixed SKU: [lifecycle](https://docs.fly.io/sprites/concepts/lifecycle.md): “Memory is assigned per Sprite, and the platform can autoscale it”.
- **third-party** — Battleships lists no GPU or ARM64 and says region selection is unavailable: [JSON](https://battleships.dev/data/providers/sprites.json): `"gpu": false`, `"arm64": false`, “no region selection”.
- **not-published** — A provider-confirmed current list of Sprite regions, GPU availability, CPU architecture, and guaranteed RAM ceiling was not established; do not assume Fly Machines' region list applies.

## 6. Networking and credentials

- **docs-confirmed** — Every Sprite has an HTTPS URL, private to the organization by default: [networking](https://docs.fly.io/sprites/concepts/networking.md): “A Sprite URL is private by default. It's reachable only by members of your org, through the browser or with an org token”.
- **docs-confirmed** — General outbound access is open unless a policy is applied: [networking](https://docs.fly.io/sprites/concepts/networking.md): “By default, a Sprite's outbound is unrestricted: it can resolve and reach any domain.”
- **docs-confirmed** — A separately controlled DNS allowlist can restrict egress: [networking](https://docs.fly.io/sprites/concepts/networking.md): “Applying one is opt-in and done from outside the Sprite.”
- **docs-confirmed** — Connector credentials stay with the provider's gateway instead of being placed in the guest: [connectors](https://docs.fly.io/sprites/concepts/connectors.md): “Connectors solve this by storing the credential once, in your organization, and routing API calls through the Sprites gateway. Sprites never see the token.”
- **docs-confirmed** — Connector access starts denied: [connectors](https://docs.fly.io/sprites/concepts/connectors.md): “a connector with no policy refuses every Sprite.”
- **inferred** — This is brokered HTTP credential use, not universal transparent injection for every protocol; test the intended integration and access policy. Evidence: [connectors](https://docs.fly.io/sprites/concepts/connectors.md), including its gateway URL and custom HTTP API description.

## 7. Interfaces

- **docs-confirmed** — CLI and interactive terminal are documented: [quickstart](https://docs.fly.io/sprites/quickstart.md): “Open an interactive shell” followed by `sprite console`.
- **docs-confirmed** — SSH is possible through a proxy after setup, rather than as a native public SSH endpoint: [working with Sprites](https://docs.fly.io/sprites/working-with-sprites.md): “Sprites don't expose SSH directly—you'll need to install an SSH server on your”.
- **docs-confirmed** — A browser can access an organization-private Sprite URL, and a local TCP proxy is available: [networking](https://docs.fly.io/sprites/concepts/networking.md): “it maps a remote port onto your machine”.
- **docs-confirmed** — The provider describes SDKs and integrations: [Sprites product page](https://fly.io/sprites/): “Official plugins for every serious coding agent, plus SDKs and native integrations.”
- **third-party** — Battleships lists an MCP server but no outbound webhook feature: [JSON](https://battleships.dev/data/providers/sprites.json): `"mcp_server": true`, `"webhooks": false`.
- **docs-confirmed** — A public Sprite URL can receive a webhook; that is not evidence of outbound lifecycle notifications: [networking](https://docs.fly.io/sprites/concepts/networking.md): “a webhook that needs to be hit without a token”.
- **not-published** — A provider-managed graphical desktop or managed browser automation product was not established. A web browser reaching a URL is not the same as a remote desktop or a browser controlled by the agent.

## 8. Agent features

- **docs-confirmed** — Agents can create their own restore points: [checkpoints](https://docs.fly.io/sprites/concepts/checkpoints.md): “Agents and scripts running inside a Sprite can manage their own checkpoints”.
- **docs-confirmed** — The Tasks API can keep work alive rather than letting it sleep prematurely: [lifecycle](https://docs.fly.io/sprites/concepts/lifecycle.md): “holds the Sprite active so the current run finishes before it pauses at all.”
- **not-published** — A native provider-managed agent prompting/orchestration API was not established; preinstalled agent tools and SDK integrations do not establish one.

## 9. Accounts and governance

- **docs-confirmed** — Authentication uses a Fly.io account: [quickstart](https://docs.fly.io/sprites/quickstart.md): “Sprites uses your Fly.io account for authentication”.
- **docs-confirmed** — Connector management is organization-scoped and has a dashboard: [connectors](https://docs.fly.io/sprites/concepts/connectors.md): “Most connector management happens in the dashboard. Open your organization, then **Connectors**.”
- **third-party** — Battleships claims SSO but leaves spend limits, audit logs and scoped API keys unknown: [JSON](https://battleships.dev/data/providers/sprites.json): `"sso": true`, `"spend_limits": null`, `"audit_logs": null`, `"scoped_api_keys": null`.
- **not-published** — Sprite-specific SSO eligibility, actual key scopes, hard spend caps, audit retention, data residency guarantees, and team billing permissions were not established from primary sources. Confirm with Fly before adopting for regulated data.

## 10. Pricing and contradictions

- **pricing-page** — Actual CPU use: [Fly pricing](https://fly.io/pricing/): “Cumulative CPU usage measured by cpu.stat” and “$0.0385 / CPU-hour”.
- **pricing-page** — Actual memory use: [Fly pricing](https://fly.io/pricing/): “Actual memory usage” and “$0.021875 / GB-hour”.
- **pricing-page** — Storage: [Fly pricing](https://fly.io/pricing/): “Hot Bills while the Sprite is awake” at “$0.000683 / GB-hour”; “Cold Bills for as long as you keep it” at “$0.000027 / GB-hour”.
- **pricing-page** — The displayed monthly storage equivalents assume 730 hours: [Fly pricing](https://fly.io/pricing/): “Per-month figures are the hourly rate over a 730-hour month.”
- **docs-confirmed** — Warm and cold incur no running compute charge: [Sprites FAQ](https://fly.io/sprites/): “Sprites have three states: running (billed), warm (not billed), and cold (not billed).”
- **inferred** — That FAQ shorthand cannot mean all storage is free in warm/cold: the [pricing page](https://fly.io/pricing/) explicitly says cold storage is billed while retained, as quoted above. Confirm whether hot and cold are simultaneous charges on identical bytes rather than distinct physical usage quantities.
- **docs-confirmed** — Bandwidth is not currently metered for Sprites: [Sprites FAQ](https://fly.io/sprites/): “No. Sprites bandwidth isn't metered today.”
- **pricing-page** — The pricing page claims no plans: [Fly pricing](https://fly.io/pricing/): “No plans and no tiers, and nothing charged per Sprite.”
- **docs-confirmed** — The current product FAQ contradicts that statement: [Sprites FAQ](https://fly.io/sprites/): “Plans bundle an allowance of CPU-hours, RAM GB-hours, and storage GB, not unlimited usage.” It also says “Hero ($100/mo) includes 1,200 CPU-hours, 4,800 RAM GB-hours, and 150 GB of storage”.
- **docs-confirmed** — The product FAQ says one-time credit is limited across users and organizations: [Sprites FAQ](https://fly.io/sprites/): “Each user can grant one $30 trial credit, and each org can receive at most one.”
- **docs-confirmed** — Trial credits cannot pay a subscription fee: [Sprites FAQ](https://fly.io/sprites/): “Credits apply to Sprites usage only. The monthly subscription fee is billed separately and isn't covered.”
- **not-published** — Exact billing rounding, per-start minimum, cold checkpoint storage rate, card requirement, credit expiry, and treatment after exhaustion were not established. “Not published” is not evidence of a zero minimum or free service forever.

## 11. Worked examples, before credits, plan allowances, taxes and extras

**inferred** — All examples use the quoted [Fly pricing](https://fly.io/pricing/) rates above and the [lifecycle](https://docs.fly.io/sprites/concepts/lifecycle.md) fixed 8-vCPU shape. The requested CPU/RAM sizes cannot be reserved as specified; instead assume the workload consumes the stated average RAM within an 8-vCPU Sprite. RAM is actual usage, not an allocation guarantee. For comparison assume a constant retained data volume, hot charges only during active hours, and cold charges for all retained hours **in addition to hot**; Fly does not unambiguously explain overlap, so this is a conditional estimate, not an invoice. CPU bounds are zero to full use of all eight vCPUs, not the requested two or four; zero CPU with nonzero RAM and running state is a theoretical lower bound. The upper bound is conditional on the stated average RAM use and does not bound additional memory usage. GB and GiB are treated as numerically equal only for these illustrative estimates; Fly lists GB, not GiB. Additional task time, startup, rounding, snapshots and extra retained bytes are excluded. Dollar totals are rounded after summing unrounded components.

- **inferred** — **A:** 1,000 × 10 minutes = 166.667 active hours. Assume 4 GB average RAM; assume no disk because the request specifies none (actual writes cost extra), and immediate deletion. Memory = 166.667 × 4 × $0.021875 = $14.58. CPU = 0–(166.667 × 8 × $0.0385) = $0–$51.33. **Total $14.58–$65.92**, plus actual storage and any overhead. Evidence: section 10 rates and section 5 shape.
- **inferred** — **B:** 730 hours, 8 GB average RAM, 50 GB retained. CPU = 0–(730 × 8 × $0.0385) = $0–$224.84; memory = 730 × 8 × $0.021875 = $127.75; hot storage = 730 × 50 × $0.000683 = $24.93; cold storage = 730 × 50 × $0.000027 = $0.99. **Total $153.67–$378.51**, conditional on additive storage. An actually always-on workload must actively prevent idle sleep. Evidence: sections 3 and 10.
- **inferred** — **C:** 90 active hours; 630 idle hours; 720 hours retained. CPU = 0–(90 × 8 × $0.0385) = $0–$27.72; memory = 90 × 4 × $0.021875 = $7.88; hot storage = 90 × 20 × $0.000683 = $1.23; cold storage = 720 × 20 × $0.000027 = $0.39. **Total $9.49–$37.21**, conditional on additive storage. Evidence: sections 3 and 10.

## 12. Same word, different meaning

- **inferred** — “Pause” here has two distinct outcomes: warm freezes a process, cold discards it; a generic “pause/resume” checkbox conceals this difference. Evidence: section 3 lifecycle quotations.
- **inferred** — “Checkpoint” means filesystem rollback, whereas warm suspension preserves memory temporarily; neither establishes a clone. Evidence: sections 3–4.
- **inferred** — “Storage 100 GB” is capacity, not an included 100 GB flat-rate disk; billing tracks written/retained data. Evidence: section 5 and [lifecycle](https://docs.fly.io/sprites/concepts/lifecycle.md): “you pay for the bytes you actually write, not the full 100 GB”.
- **inferred** — “Free when idle” must be read as compute-free, not necessarily storage-free. Evidence: section 10.

## 13. Glossary candidates

- **inferred** — Warm suspension: a sleeping VM whose memory is temporarily preserved. Evidence: section 3.
- **inferred** — Cold wake: starting again from persistent files, without prior process memory. Evidence: section 3.
- **inferred** — Checkpoint: a filesystem restore point, not a running-process copy. Evidence: section 4.
- **inferred** — CPU-hour: one CPU's worth of actual accumulated work for one hour; wall-clock hours can differ. Evidence: section 10.
- **inferred** — Connector: a controlled gateway that applies a stored credential on the Sprite's behalf. Evidence: section 6.

## 14. Gaps and Battleships discrepancies

- **third-party** — Battleships describes actual CPU and RAM billing while awake: [JSON](https://battleships.dev/data/providers/sprites.json): “Sprite, billed on actual CPU time + actual memory while awake”.
- **inferred** — The meter description is confirmed by section 10's primary pricing quotes, subject to storage and plan caveats.
- **third-party** — Battleships marks wake-on-request: [JSON](https://battleships.dev/data/providers/sprites.json): `"wake_on_request": true`.
- **inferred** — URL-request wake is confirmed by section 3; this is not evidence that every possible input wakes it.
- **third-party** — Its JSON reports contradictory image fields: [JSON](https://battleships.dev/data/providers/sprites.json): `"custom_image": true` and `"custom_image": false`.
- **inferred** — Do not treat either image value as a verified capability until Fly clarifies.
- **third-party** — It sets a zero billing minimum: [JSON](https://battleships.dev/data/providers/sprites.json): `"min_billed_seconds": 0`.
- **inferred** — Primary pricing checked does not explicitly establish a zero minimum; unknown is safer.
- **third-party** — Battleships says no SSH: [JSON](https://battleships.dev/data/providers/sprites.json): `"ssh": false`.
- **inferred** — This is accurate for direct exposed SSH but incomplete for SSH via an installed server and proxy, as section 7 shows.
- **third-party** — Battleships says no memory snapshot: [JSON](https://battleships.dev/data/providers/sprites.json): `"snapshot_mem": false`.
- **inferred** — This is consistent with filesystem checkpoints, but warm suspension temporarily preserves RAM; these are different concepts.
- **third-party** — Battleships assumes cold storage and hot storage both apply: [JSON](https://battleships.dev/data/providers/sprites.json): “COLD storage on all bytes written, billed for as long as kept (including while awake).”
- **inferred** — Fly's published wording supports retention billing but does not make the same-byte overlap unambiguous; request clarification before treating that assumption as confirmed.
- **third-party** — Battleships' Markdown contains stale rates in its narrative: [Markdown](https://battleships.dev/data/providers/sprites.md): “CPU on cumulative CPU time (`cpu.stat`), $0.07/CPU-hour,” and “memory on actual usage, $0.04375/GB-hour,”.
- **inferred** — Those narrative rates contradict both its own current pricing-regime table and Fly's current rates in section 10; the JSON and Markdown are secondary cross-checks, not independent billing verification.
- **inferred** — The provider's own overview says memory persists between runs, whereas the lifecycle page distinguishes warm from cold; use the lifecycle's more precise claim. Evidence: [overview](https://docs.fly.io/sprites/index.md): “Sprites keep their filesystem and memory between runs”; section 3 cold-state quote.
- **not-published** — The entire current optional-plan ladder, plan eligibility, whether old published tier prices still apply, precise memory-meter composition (for example page cache), and storage overlap need clarification.

## 15. Non-technical usability

- **docs-confirmed** — There is a dashboard for at least connector setup: [connectors](https://docs.fly.io/sprites/concepts/connectors.md): “Most connector management happens in the dashboard.”
- **docs-confirmed** — A limited no-code connector test exists: [connectors](https://docs.fly.io/sprites/concepts/connectors.md): “The **Gateway Playground** at the bottom lets you fire a real request from any of your Sprites against the connector, without writing any code.”
- **inferred** — That dashboard does not establish a complete no-code workflow: the documented getting-started path installs and runs a command-line tool. Evidence: [quickstart](https://docs.fly.io/sprites/quickstart.md), section 7.
- **docs-confirmed** — Support varies by plan: [Sprites FAQ](https://fly.io/sprites/): “Pay-as-you-go and the plans below Hero (Adventurer, Veteran) have community support.”
- **docs-confirmed** — The provider says trial credit is a limited one-time allowance, not a monthly free tier: [Sprites FAQ](https://fly.io/sprites/): “Each user can grant one $30 trial credit, and each org can receive at most one.”
- **not-published** — Signup card requirement, waitlist, trial duration and exact behavior at credit exhaustion remain unverified. Do not promise a free tier or automatic shutdown when credit ends.
- **inferred** — A non-engineer could encounter command-line setup, public URL authentication, billing for retained data, and processes disappearing on cold wake. Evidence: sections 3, 6, 7 and 10. Provider documentation is at [docs](https://docs.fly.io/sprites/index.md); status and support response guarantees specific to Sprites were not established.

## 16. Concept examples

- **inferred** — Pause: automatic warm memory-preserving suspension followed by possible cold disk-only wake; [lifecycle](https://docs.fly.io/sprites/concepts/lifecycle.md), section 3.
- **inferred** — Stop: cold stop discards processes but retains files; destroy permanently deletes the Sprite; [working with Sprites](https://docs.fly.io/sprites/working-with-sprites.md), section 3.
- **inferred** — Snapshot: copy-on-write filesystem checkpoint, not RAM; [checkpoints](https://docs.fly.io/sprites/concepts/checkpoints.md), section 4.
- **inferred** — Fork: a live fork or create-from-checkpoint is not established; in-place rollback is not a clone; [checkpoints](https://docs.fly.io/sprites/concepts/checkpoints.md), section 4.
- **inferred** — Persistent storage: whole writable filesystem backed by durable object storage; [lifecycle](https://docs.fly.io/sprites/concepts/lifecycle.md), sections 3–4.
- **inferred** — Isolation: hardware-isolated Linux microVM, not just a process sandbox; [overview](https://docs.fly.io/sprites/index.md), section 2.
- **inferred** — Billing meter: actual CPU time and actual memory, plus storage; [pricing](https://fly.io/pricing/), section 10.
- **inferred** — Trial: one-time limited credit rather than evidence of permanent free usage; [product FAQ](https://fly.io/sprites/), section 10.
- **inferred** — Secrets: organization-held credential brokered to a permitted HTTP request; [connectors](https://docs.fly.io/sprites/concepts/connectors.md), section 6.

## Research method and limits

**inferred** — Context.dev search returned no results for the initial query; Context.dev scrape successfully returned lifecycle, checkpoint and networking docs. TinyFish Search and Fetch through Composio succeeded; Parallel Search through Composio succeeded. Fresh direct HTTPS reads checked 82 of 82 quoted evidence fragments in the direct-evidence bullets against the live source text; two initially failed and were corrected before that final check. Battleships' JSON and Markdown were read only as secondary checks. Findings represent published claims, not tests of security, performance, billing or signup. No Sprites resources were provisioned.

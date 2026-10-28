# Lizard (lizard.build) — provider profile

Research date: 2026-10-28. Desk research only; no account was created and no sandbox was run.
Primary sources: the docs site (`lizard.build/docs`, including its raw `.md` twins), the pricing page, the marketing pages, the support and status pages. Secondary: `battleships.dev/data/providers/lizard.json` and `.md` (cost-comparison site by the boat.dev team), cross-checked against the docs, never used as the primary source.

**Tag legend.** `docs-confirmed` = stated in Lizard's documentation. `pricing-page` = stated on a Lizard pricing/marketing page. `third-party` = from battleships.dev or another outside source. `inferred` = my reasoning from documented facts, not stated by Lizard. `not-published` = I looked and Lizard does not say.

**One-line verdict.** Lizard is a small, fast-moving PaaS-plus-sandboxes product whose sandbox pricing is unusually cheap per running hour and whose lifecycle vocabulary ("pause", "stop", "snapshot", "fork") is unusually generous — but several things a buyer will ask about (snapshot storage price, Docker inside, allowlists, resume latency, SOC 2) are simply not published yet.

---

## 1. What it is, who it is for, product lines

Lizard is a cloud platform with two halves: **Sandboxes** (Firecracker microVMs for running agent code) and an **app platform** (deploy a repo, plus managed Postgres, Redis and S3-compatible storage). The docs describe the sandbox half first and treat app deployment as the second step once the agent has built something.

| Claim | Tag | Source | Quote |
|---|---|---|---|
| Lizard is a cloud sandbox platform for AI agents; sandboxes are Firecracker microVMs with their own kernel | docs-confirmed | https://lizard.build/docs/index.md | "Lizard is a cloud sandbox platform for AI agents. Lizard Sandboxes are Firecracker microVMs, each with its own kernel" |
| Same product also deploys apps and databases from the same CLI | docs-confirmed | https://lizard.build/docs/index.md | "When the agent has built something, deploy it on the same platform: `lizard up` uploads the current folder, `lizard add -r owner/repo` deploys a GitHub repository" |
| Audience framing is agent builders, not general hosting buyers | pricing-page | https://lizard.build/pricing | "Cloud pricing for the way AI agents work" |
| Homepage positioning is raw speed and concurrency | pricing-page | https://lizard.build/sandboxes | "The fastest cloud VMs for AI-generated code" — "Run thousands of agents, builds, tests and evals in parallel without ever thinking about infrastructure." |
| Product lines: CLI, managed Postgres, managed Redis, managed object storage, plus Lizard Studio | docs-confirmed | https://lizard.build/docs/index.md | "Add Managed Postgres, Managed Redis or S3-compatible Managed Object Storage with the same CLI" |
| Lizard Studio is a separate product for editing a page visually from Claude Code/ChatGPT | docs-confirmed | https://lizard.build/docs/index.md | Task table row: "Edit a page visually with Claude Code or ChatGPT", mapped to "Lizard Studio" |
| Company is independent; funding/stage/headcount are not published anywhere the researcher could find | third-party | https://battleships.dev/data/providers/lizard.json | "ownership": "independent" … "No funding, investor, or accelerator announcements were found … Could not confirm whether it is bootstrapped, VC-backed, or a side project." |
| No public status/uptime SLA on Pro; SLA is an Enterprise line item | pricing-page | https://lizard.build/pricing | Enterprise: "Dedicated, hands-on support with SLAs" (Pro: "Basic support") |

**In plain words** (`inferred`). If you are building something where a model writes code and that code has to run somewhere safe, Lizard sells you the machine by the hour in three fixed sizes, and separately sells you a normal app-hosting service for whatever the agent produces. The two are billed on different meters (see §10), which is the single most confusing thing about the product.

---

## 2. Isolation technology, and what it practically allows

Lizard's sandboxes are Firecracker microVMs with a guest kernel. Its *apps* are a different thing: containers in pods. The same word "isolation" on the marketing site covers both.

| Claim | Tag | Source | Quote |
|---|---|---|---|
| Sandboxes are Firecracker microVMs, each with its own kernel | docs-confirmed | https://lizard.build/docs/sandboxes.md | "Sandboxes run as Firecracker microVMs, each with its own kernel." |
| Firecracker described as KVM-based hardware virtualization with a limited device model | docs-confirmed | https://lizard.build/blog/ai-sandbox | Table row "Firecracker microVM": "A virtual machine has its own guest kernel and uses KVM for hardware virtualization." and "Firecracker uses a small virtual machine monitor and a limited device model." |
| Apps (not sandboxes) run as isolated pods, which are containers | docs-confirmed | https://lizard.build/docs/concepts/architecture.md | "Each running service runs as its own **isolated pod** with a default-deny network policy" |
| Commands inside a sandbox run as root by default | docs-confirmed | https://lizard.build/docs/sandboxes/sdk-reference.md | "commands run as `root` unless you pass `user`" |
| Sandboxes are Linux only | pricing-page | https://lizard.build/sandboxes | Under "Not on Lizard yet", item "Windows and macOS": "Sandboxes run Linux. The desktop template is a Linux desktop with Chromium." |
| No GPU, no self-hosting | pricing-page | https://lizard.build/sandboxes | Under "Not on Lizard yet": item "GPUs" reads "Sandboxes run on CPUs only."; item "Self-hosting" reads "Every sandbox runs in Lizard's cloud, in US East or EU West." |
| Docker inside a sandbox | not-published | — | Nothing in `docs/sandboxes*`, the CLI reference, the SDK reference or the FAQ says whether a Docker daemon runs inside. The word Docker appears in the sandbox docs only as a link to a blog post about local dev containers. |
| systemd / init system | not-published | — | No mention of systemd, PID 1 or an init system anywhere in the sandbox docs. |
| Nested virtualization | third-party | https://battleships.dev/data/providers/lizard.json | "nested_virt": false — no supporting quote in the docs. |
| Kernel features (eBPF, cgroups, mounts, FUSE) | third-party | https://battleships.dev/data/providers/lizard.md | "kernel features (eBPF, mounts, cgroups)" listed as supported; "FUSE mounts" also listed. The docs never mention these. |
| Guest firewall (nftables) | third-party | https://battleships.dev/data/providers/lizard.md | "firewall inside (nftables)". Not in the docs. |

**What this practically means** (`inferred`). A dedicated guest kernel plus root inside the guest is the strongest isolation tier in this market: a kernel exploit inside the sandbox has to escape KVM/Firecracker, not just a namespace. That is the claim that makes running untrusted model output defensible. Because the sandbox is a whole machine rather than a container, anything that needs its own kernel objects (mounts, cgroups, iptables) should work *in principle* — but Lizard does not document Docker-in-sandbox, systemd, or nested virt, so treat those as unverified until tested. Root inside the guest is not a security property; it is just the default user.

**Historical wrinkle worth knowing.** Dated Wayback captures of Lizard's own docs, from 30 September 2026, say the opposite of today's page about how sandboxes are isolated:

| Claim | Tag | Source | Quote |
|---|---|---|---|
| On 30 September 2026 the docs described sandboxes as pods on a shared kernel, at a fixed 4 vCPU / 4096 MiB, billed on measured usage | third-party | https://web.archive.org/web/20260930084615/https://lizard.build/docs/platform/limits.md and https://web.archive.org/web/20260930084612/https://lizard.build/docs/sandboxes.md | Wayback capture of Lizard's own docs: "Sandboxes run short-lived commands and agent tasks in Kubernetes pods with the runc runtime. They share the host kernel; they are not Firecracker virtual machines." (limits.md) and "Current sandboxes use fixed limits of 4 vCPU and 4096 MiB RAM." (sandboxes.md), both captured 2026-09-30 |
| The live Limits page no longer contains that text and now states Firecracker microVMs at $0.0162/hour | docs-confirmed | https://lizard.build/docs/platform/limits.md (updated 2026-10-24) | Sizes table: "Small \| 2 vCPU / 4 GB \| 5 GB \| $0.0162 per hour" |
| A legacy generation of sandboxes with different billing still exists | docs-confirmed | https://lizard.build/sandboxes | "Older sandboxes without a size keep their original usage-based billing." |

So: **new** sandboxes are microVMs; **older** sandboxes were pods with usage-based billing and may still exist. If the question is whether it is Firecracker, the answer is yes for anything created today, and the billing model changed from metered to flat per size when that happened (`inferred` from the two dated pages below).

---

## 3. Lifecycle: states, what survives, timers

States documented: `create → running → paused → running`, `running → stopped (kill or expiration)`, `running → new sandboxes (fork)`, `snapshot → new sandbox (restore)`. There is no separate stopped-but-restartable state — **stop means delete**.

| Claim | Tag | Source | Quote |
|---|---|---|---|
| State diagram, four lines quoted separately | docs-confirmed | https://lizard.build/docs/sandboxes.md | "create -> running -> stopped (kill / expiration)"; "running -> paused -> running (pause / resume)"; "running -> new sandboxes (fork)"; "snapshot -> new sandbox (restore)" |
| Pause keeps whole disk + memory + running processes | docs-confirmed | https://lizard.build/docs/sandboxes.md | "The whole disk, including packages installed outside `/workspace`, plus memory and running processes (a pause with `fast: true` keeps the disk only)" |
| Fast pause keeps files only; processes end; resume boots fresh | docs-confirmed | https://lizard.build/docs/sandboxes/quickstart.md | "`pause({ fast: true })` … keeps only the files: the whole disk and `/workspace`. It takes about a second at any memory size … `resume()` boots the sandbox fresh with its files, like a restart" |
| Stop (kill or expiry) deletes the disk | docs-confirmed | https://lizard.build/docs/sandboxes.md | "A stop (kill or expiration) deletes the sandbox's disk: only files on an attached Persistent Volume at `/workspace` and the snapshots you took remain." |
| Pause closes open network connections | docs-confirmed | https://lizard.build/docs/sandboxes/quickstart.md | "Pausing closes open network connections. Programs in the sandbox must reconnect after a resume." |
| Pause can fail and leave the sandbox running | docs-confirmed | https://lizard.build/docs/platform/known-issues.md | "If the processes cannot be saved, the sandbox keeps running and reports the reason in `pauseError`." |
| Pause/resume are async; wait for status | docs-confirmed | https://lizard.build/docs/sandboxes/quickstart.md | "Both calls queue the work and return at once; wait for `paused` or `running` to confirm success." |
| Default lifetime: 5 minutes from SDK/CLI, unlimited from raw API and dashboard | docs-confirmed | https://lizard.build/docs/sandboxes.md | "Five minutes by default from the SDK and CLI; no expiration by default from the raw API and dashboard" |
| Lifetime is a hard deadline, not an idle timer | docs-confirmed | https://lizard.build/docs/sandboxes.md | "Commands do not reset the deadline. This is not an idle timer." |
| Max lifetime is the ms integer ceiling (~24.8 days); no other cap published | docs-confirmed | https://lizard.build/docs/platform/limits.md | "Explicit lifetime range \| Integer milliseconds from 0 to 2147483647" |
| Idle auto-stop: none | pricing-page | https://lizard.build/sandboxes | FAQ "How long can an AI sandbox run?": "Commands do not extend the deadline, and idle time does not stop it early." |
| Paused sandboxes do not count against the running limit; the deadline freezes | docs-confirmed | https://lizard.build/docs/sandboxes/quickstart.md | "The lifetime deadline stops while the sandbox is paused and continues after the resume. A paused sandbox does not count toward the running limit." |
| Published start time: 228 ms median, 310 ms p95 | docs-confirmed | https://lizard.build/docs/sandboxes.md | "the median time from creating a sandbox to its first Python output was 228 ms, and the 95th percentile was 310 ms" |
| Published resume/restore latency | not-published | — | No number is given for pause→resume or snapshot→restore. The only timing statement is that a fast pause "takes about a second at any memory size" (https://lizard.build/docs/sandboxes/quickstart.md). |
| Billing pause (non-payment) pauses running sandboxes; unpausable ones are deleted | docs-confirmed | https://lizard.build/docs/platform/billing.md | "A running sandbox is paused with its files and memory. A sandbox that can't be paused at that moment, or one that has crashed, is deleted with its files." |

**What survives what**

| Event | Whole disk | `/workspace` on a volume | Memory + processes | Billing |
|---|---|---|---|---|
| Running | yes | yes | yes | per second, including idle |
| Pause | yes | yes | yes | compute $0; volume storage continues |
| Fast pause | yes | yes | **no** | compute $0 |
| Snapshot | yes (captured) | yes (copied into snapshot) | yes (captured) | not published |
| Kill / expiry | **no** | yes | no | stops |
| Restore from snapshot | yes (from capture) | only the captured copy | yes | at the source's size/price |

(Tags: all `docs-confirmed` from the two tables above plus the snapshot rows in §4.)

---

## 4. State tools: snapshots, fork, templates, volumes

| Claim | Tag | Source | Quote |
|---|---|---|---|
| Snapshot = memory + processes + whole disk | docs-confirmed | https://lizard.build/docs/sandboxes/quickstart.md | "A snapshot saves a running sandbox's memory, running processes and every file on its disk." |
| Snapshot is ready when the call returns and restores from disk | docs-confirmed | https://lizard.build/docs/sandboxes/quickstart.md | "A snapshot is ready when the call returns and restores from disk, so `poolSize` does not apply." |
| Restores bill at the source's size, not a chosen size | docs-confirmed | https://lizard.build/docs/sandboxes/quickstart.md | "Each restore runs at the source's size and bills at that size's hourly price; `size` does not apply to a restore." |
| Snapshot scope controls who can restore where | docs-confirmed | https://lizard.build/docs/sandboxes/quickstart.md | "`workspace` (the default): any project in the source sandbox's workspace." / "`user`: any project in any of your workspaces." / "`project`: only the source sandbox's project." |
| A snapshot of a sandbox with a volume copies the volume's files and shares them with anyone who can restore | docs-confirmed | https://lizard.build/docs/sandboxes/quickstart.md | "Anyone who can restore the snapshot can read those files, so sharing such a snapshot shares the volume's data." |
| Snapshot storage price | not-published | — | No rate for stored snapshots appears on the pricing page or the billing page. Only restore compute is priced. |
| Fork copies a **running** sandbox, memory and processes included | docs-confirmed | https://lizard.build/docs/sandboxes/sdk-reference.md | "Copy a running sandbox 1 to 100 times, memory and processes included" |
| Fork is not fully live: the source is paused for a moment to capture | docs-confirmed | https://lizard.build/docs/cli/sandbox.md | "Lizard pauses the sandbox for a moment, captures its memory, processes, and files once, and boots every copy from that capture. The source keeps running with the same ID and lifetime." |
| Fork blocked with a volume attached; cannot fork a paused sandbox | docs-confirmed | https://lizard.build/docs/cli/sandbox.md | "You can't fork a paused sandbox or one with a volume attached (HTTP 409)." |
| Templates are a fixed platform catalog; no custom template upload | docs-confirmed | https://lizard.build/docs/sandboxes.md | "`base`, `interpreter`, `codex`, `claude`, `opencode`, `pi`, `prime`, `desktop` and `desktop-camoufox` (US East only)" / "The public CLI does not provide a custom-template upload flow." |
| No bring-your-own Docker/OCI image for sandboxes | third-party | https://battleships.dev/data/providers/lizard.md | Listed under "No:": "your own Docker/OCI image" |
| Volumes mount only at `/workspace`, one sandbox at a time | docs-confirmed | https://lizard.build/docs/sandboxes/volumes.md | "Each volume mounts at **`/workspace`** and attaches to **one sandbox at a time**." |
| Volume size 1–50 GB, default 5 GB, 200 GB allocated per workspace | docs-confirmed | https://lizard.build/docs/sandboxes/volumes.md | "New volumes allow **1 to 50 GB**, in whole GB, with **5 GB** as the default." / "The volumes of one workspace can add up to **200 GB** of allocated size" |
| You pay for used space, not allocation | docs-confirmed | https://lizard.build/docs/sandboxes/volumes.md | "You pay for **used space**, not the full allocation." |
| Volumes are node-local, not replicated | docs-confirmed | https://lizard.build/docs/sandboxes/volumes.md | "Volumes use node-local storage; export data you need after a node failure." |
| Volumes can only grow (with a legacy exception) | docs-confirmed | https://lizard.build/docs/sandboxes/volumes.md | "A volume can only grow. Some volumes created before October 2026 can also shrink if at least 10% of the new size stays free." |
| Sandboxes, volumes and snapshots have no trash/recycle bin | docs-confirmed | https://lizard.build/docs/platform/storage-and-recovery.md | "Sandboxes, their volumes and snapshots have no trash. Deleting them, or the project they belong to, removes them at once." |

---

## 5. Machine sizes, GPU, architecture, regions

| Size | vCPU | RAM | Local disk | Price while running |
|---|---|---|---|---|
| Small | 2 | 4 GB | 5 GB | $0.0162/hour |
| Medium (default) | 4 | 8 GB | 20 GB | $0.0324/hour |
| Large | 8 | 16 GB | 50 GB | $0.0648/hour |

| Claim | Tag | Source | Quote |
|---|---|---|---|
| Exactly three sizes, chosen at create time | docs-confirmed | https://lizard.build/docs/platform/limits.md | "Small \| 2 vCPU / 4 GB \| 5 GB \| $0.0162 per hour" … "Medium (default outside the trial) \| 4 vCPU / 8 GB \| 20 GB \| $0.0324 per hour" … "Large \| 8 vCPU / 16 GB \| 50 GB \| $0.0648 per hour" |
| CPU and memory are in the price; volumes are extra | docs-confirmed | https://lizard.build/docs/platform/limits.md | "CPU and memory are included in the price. Persistent Volumes are billed separately." |
| No custom size, no live resize | third-party | https://battleships.dev/data/providers/lizard.json | "live_resize": false — and the size list is closed at 2/4/8 vCPU. |
| No GPU | pricing-page | https://lizard.build/sandboxes | Under "Not on Lizard yet", item "GPUs": "Sandboxes run on CPUs only." |
| CPU architecture | not-published | https://battleships.dev/data/providers/lizard.json | Docs never state x86-64 or arm64; battleships records "arm64": null. That x86-64 is what runs is my `inferred` reading of Firecracker on KVM in the two named regions. |
| Two regions: US East (Virginia) `us-east-1`, EU West (Limburg) `eu-west-lim-a` | docs-confirmed | https://lizard.build/docs/platform/limits.md | "The current configured regions include US East (Virginia), `us-east-1`, and EU West (Limburg), `eu-west-lim-a`." |
| Region capacity is not guaranteed | docs-confirmed | https://lizard.build/docs/sandboxes.md | "a catalog entry does not guarantee free capacity" |
| A sandbox with a volume must run on that volume's node | docs-confirmed | https://lizard.build/docs/platform/limits.md | "a sandbox using an existing volume must run on that volume's node" |
| Trial is Small-only, US-only | docs-confirmed | https://lizard.build/docs/platform/limits.md | "the trial allows 5 at once, only Small and only in US regions" |

---

## 6. Networking

| Claim | Tag | Source | Quote |
|---|---|---|---|
| Inbound is HTTPS preview URLs per exposed port | docs-confirmed | https://lizard.build/docs/sandboxes/preview-urls.md | "You get `https://<sandbox-id>-3000.sandbox.<region>.onlizard.com/?lizard_token=…`" |
| Every request needs the sandbox's access token | docs-confirmed | https://lizard.build/docs/sandboxes/preview-urls.md | "a request without the sandbox's access token gets HTTP 401" |
| One token per sandbox, not per port; three ways to send it | docs-confirmed | https://lizard.build/docs/sandboxes/preview-urls.md | "The token belongs to the sandbox, not to a port: it opens every port you expose on that sandbox" / "the `lizard_token` query parameter, the `X-Lizard-Access-Token` header, or the `lizard_access` cookie" |
| Browsers get an HttpOnly cookie, so the token leaves the URL | docs-confirmed | https://lizard.build/docs/sandboxes/preview-urls.md | "Lizard sets the `lizard_access` cookie for that hostname (HttpOnly, Secure, SameSite=None, Partitioned, 30 days)" |
| WebSockets work through preview URLs | docs-confirmed | https://lizard.build/docs/sandboxes/preview-urls.md | "Upgrade requests pass through, so dev servers with hot reload and terminal UIs work." |
| Port 49983 is reserved | docs-confirmed | https://lizard.build/docs/sandboxes/preview-urls.md | "The platform reserves port `49983`; you cannot expose it." |
| Custom domains on sandbox ports | not-published | — | Custom domains are documented only for app *services* (`lizard domain app.example.com --service web`), not for sandbox preview URLs. |
| Raw TCP inbound | third-party | https://battleships.dev/data/providers/lizard.json | "raw_tcp_inbound": false — consistent with preview URLs being HTTP(S)-only. |
| Public IPv4 | third-party | https://battleships.dev/data/providers/lizard.json | "public_ipv4": false |
| Outbound internet is open; no allowlist or static egress IP documented | inferred | https://battleships.dev/data/providers/lizard.json | Battleships JSON: "open_internet": true, "egress_allowlist": null, "static_egress_ip": false. Lizard's own sandbox blog says: "Do not assume a network allowlist exists without checking the product's controls." (https://lizard.build/blog/ai-sandbox) |
| Egress allowance: 2 TB per account per rolling 30 days, shared across sandboxes, no per-GB charge | docs-confirmed | https://lizard.build/docs/platform/limits.md | "Sandbox egress has no separate per-GB charge. The included allowance is 2 TB per account over a rolling 30 days, shared across the account's sandboxes." |
| Over 2 TB: "contact us" — no published overage rate | docs-confirmed | https://lizard.build/docs/platform/limits.md | "If your workload needs more, contact us before running it." |
| Secret/credential injection at create time | docs-confirmed | https://lizard.build/docs/sandboxes/sdk-reference.md | "Create-time `envs` reach every command." (the create option is `envs`) |
| Scoped in-sandbox CLI key | docs-confirmed | https://lizard.build/docs/cli/keys.md | "The sandbox gets a new key of its own, limited to the sandbox's project and deleted with the sandbox." |
| Secret proxy / egress credential brokering | third-party | https://battleships.dev/data/providers/lizard.json | "secret_proxy": false, "secret_proxy_any": false. No such feature in the docs. |
| Private networking exists between app services, not sandboxes | docs-confirmed | https://lizard.build/docs/networking.md | "Services in the same project reach each other at `<service>.lizard.internal`" (sandboxes are not mentioned in that page) |

**Practical consequence** (`inferred`). A sandbox can call anything on the internet, and anything on the internet can reach a published port *only* with a bearer-style token that also opens every other port on that sandbox. There is no per-port auth, no IP allowlist, no mTLS, and no way to publish a raw TCP service. Lizard's own warning is to "Treat a preview URL like a password", because "whoever has it can use every exposed port of that sandbox" (https://lizard.build/docs/sandboxes/preview-urls.md).

---

## 7. Interfaces

| Surface | Status | Tag | Source | Quote |
|---|---|---|---|---|
| REST API | Yes | docs-confirmed | https://lizard.build/docs/sandboxes/sdk-reference.md | "POST /api/sandboxes with `template`, `projectId`, `size`, `timeoutMs`, `envs`, `metadata`, `region`, `volumeName`; returns 201 with `sandboxId`" |
| TypeScript SDK | Yes (`@lizard-build/sdk`) | docs-confirmed | https://lizard.build/docs/sandboxes.md | "Create one with Lizard SDK (`@lizard-build/sdk` for TypeScript, `lizard-sdk` for Python)" |
| Python SDK | Yes (`lizard-sdk`, imported as `lizard`) | docs-confirmed | https://lizard.build/docs/sandboxes/sdk-reference.md | "`lizard-sdk` on PyPI for Python, imported as `lizard`" |
| Other SDK languages | No | not-published | — | Only TypeScript and Python are documented; the REST API is the fallback. |
| CLI | Yes (`lizard`) | docs-confirmed | https://lizard.build/docs/cli/sandbox.md | "Create and manage Sandboxes from the terminal. Alias: `lizard sb`." |
| MCP server | Yes, hosted, Streamable HTTP | docs-confirmed | https://lizard.build/docs/agents.md | "Lizard MCP lets ChatGPT, Claude and other MCP clients manage your Lizard projects: create sandboxes, run commands and read or write files in them" |
| SSH (protocol) | **No** | docs-confirmed | https://lizard.build/docs/sandboxes/sdk-reference.md | "SSH protocol access is not available; `lizard sandbox ssh` opens an interactive shell with your CLI credentials." |
| Interactive shell | Yes, over Lizard's own transport | docs-confirmed | https://lizard.build/docs/cli/sandbox.md | "It is not the SSH protocol, so SSH clients, `scp`, and port forwarding don't work." |
| Web terminal | Yes, in the dashboard | docs-confirmed | https://lizard.build/docs/sandboxes/dashboard.md | "the Terminal tab opens a shell in a running sandbox" |
| Desktop / VNC | Yes on the `desktop` template; VNC only through a local CLI bridge | docs-confirmed | https://lizard.build/docs/cli/sandbox.md | "The desktop has no public VNC port, so the CLI listens on `localhost` and carries each connection to the sandbox over a secure WebSocket." |
| Browser automation | Yes (`desktop` with Chromium; `desktop-camoufox` with Camoufox + Playwright) | docs-confirmed | https://lizard.build/docs/sandboxes.md | "`desktop-camoufox` is the `desktop` template plus Camoufox, a Firefox build for scraping that you drive with Playwright; it runs only in `us-east-1` for now." |
| Webhooks | No | not-published | https://battleships.dev/data/providers/lizard.json | No webhook section exists in the sandbox docs and `lizard events` is pull-only; battleships records "webhooks": null. |
| File watching | **No** | docs-confirmed | https://lizard.build/docs/sandboxes.md | "File watching is not available yet." |

---

## 8. Agent features

| Claim | Tag | Source | Quote |
|---|---|---|---|
| Nine templates, five of which are preinstalled coding agents | docs-confirmed | https://lizard.build/docs/sandboxes.md | "Choose a template from the current catalog: `base`, `interpreter`, `codex`, `claude`, `opencode`, `pi`, `prime`, `desktop`, or `desktop-camoufox`." |
| Agent runs are driven by CLI prompt, streaming the agent's actions | docs-confirmed | https://lizard.build/docs/cli/sandbox.md | "`lizard sandbox prompt <id> <prompt...>` sends a prompt and streams what the agent does." |
| Conversation continuity and interrupt | docs-confirmed | https://lizard.build/docs/cli/sandbox.md | "`-c, --conversation <id>`" … "`lizard sandbox interrupt <id> [-c <conversation>]` stops its running turn." |
| Credentials are account-level, not per-sandbox | docs-confirmed | https://lizard.build/docs/cli/agents.md | "Credentials belong to your account. Connect a credential once to use it for agent runs in any sandbox." |
| ChatGPT login is exchanged for a short-lived per-run token; API keys and Claude subscription tokens are passed through unchanged | docs-confirmed | https://lizard.build/docs/cli/agents.md | "For a ChatGPT login, the platform keeps the long-lived token and hands a sandbox a short-lived access token for each run. Lizard passes API keys and the stored Claude subscription token unchanged in each run's environment." |
| Bring-your-own subscription is the point (Claude or ChatGPT plan) | pricing-page | https://lizard.build/sandboxes | Card titled "Bring your Claude or ChatGPT plan": "Connect your AI provider once, and your agent starts in every sandbox already signed in." |
| Claude Code runs with `--dangerously-skip-permissions` inside the sandbox | docs-confirmed | https://lizard.build/docs/sandboxes/guides/claude-code.md | "Claude Code runs on its own Linux machine with `--dangerously-skip-permissions`: it edits files and runs commands without asking, and it has no access to your computer." |
| Agent-run API (a hosted "run this task" endpoint) — **no**, agent runs are CLI-only | third-party | https://battleships.dev/data/providers/lizard.json | Battleships note: "CLI only: the SDK reference lists no prompt method." Confirmed by the SDK method table, which has no prompt call, and by `prompt` appearing only in `lizard sandbox` CLI docs. |
| An SDK-level stateful code interpreter — yes, `CodeSandbox` with a Jupyter kernel per context | docs-confirmed | https://lizard.build/docs/sandboxes/code-interpreter.md | "Python runs in a Jupyter kernel that keeps variables between calls" |
| `base` template cannot run agents (no Node.js) | docs-confirmed | https://lizard.build/docs/cli/sandbox.md | "the `base` template has no Node.js and can't run agents" |

---

## 9. Accounts, teams, keys, governance

| Claim | Tag | Source | Quote |
|---|---|---|---|
| Workspace → project → service/addon hierarchy; sandboxes belong to a project | docs-confirmed | https://lizard.build/docs/concepts/architecture.md | "Lizard groups services into projects and projects into workspaces." |
| Unlimited team members, no seat fee | pricing-page | https://lizard.build/pricing | "No seat fees" / "Inviting team members does not add a seat fee. Their usage counts toward the workspace owner's plan." |
| API keys are `liz_`-prefixed, optionally scoped to one project or workspace | docs-confirmed | https://lizard.build/docs/cli/keys.md | "A key without a scope has full access to every workspace and project you can reach." |
| Scoped keys cannot touch billing, keys, members or workspace settings | docs-confirmed | https://lizard.build/docs/cli/keys.md | "A scoped key works only inside its projects or workspaces." Its list of what such a key "can't" do includes "see billing, the plan, cards or account-wide usage" and "create, list or delete API keys, so `lizard keys` fails with it" |
| Workspace owner can cap sandboxes, CPU, memory, disk per workspace | docs-confirmed | https://lizard.build/docs/platform/limits.md | "A workspace owner can cap one workspace, for example one that a customer reaches with a scoped API key." |
| Spend limits — **none** | docs-confirmed | https://lizard.build/docs/platform/billing.md | "There is no spending cap." |
| Audit log — Enterprise only | pricing-page | https://lizard.build/pricing | Enterprise row "RBAC & audit log"; the Pro cell in that row is marked "Not included" |
| SSO / SAML — Enterprise only | pricing-page | https://lizard.build/pricing | Enterprise row "SSO / SAML"; the Pro cell in that row is marked "Not included" |
| SOC 2 — not yet | pricing-page | https://lizard.build/pricing | "SOC 2 report (coming soon)" |
| Signed DPA, security review, dedicated nodes — Enterprise only | pricing-page | https://lizard.build/pricing | "Signed DPA and security review" / "Dedicated nodes on demand" |
| Data residency — two regions; you choose one per resource. No per-tenant pinning or residency guarantee is documented | docs-confirmed | https://lizard.build/docs/deploy/regions.md | "Lizard runs services, addons and Sandboxes in regions such as US East (`us-east-1`) and EU West (`eu-west-lim-a`). You pick the region when you create a resource". That no per-tenant residency control exists is `inferred` from its absence. |
| HIPAA — no | third-party | https://battleships.dev/data/providers/lizard.md | "No: … HIPAA" (not mentioned anywhere on Lizard's site) |

---

## 10. Pricing, exactly

### 10.1 The model in plain words

There is one self-serve plan, **Pro, $19/month**, which includes **$19 of usage per month** across the whole platform. Usage beyond $19 is charged at published rates. Overages are charged automatically in steps as they accrue, and there is no cap. Sandboxes are the exception to the metered model: they have a **flat hourly price per size**, billed per second, with CPU, RAM and local disk included.

| Claim | Tag | Source | Quote |
|---|---|---|---|
| One plan, $19/month, $19 of usage included | pricing-page | https://lizard.build/pricing | "Pro costs $19 a month and includes $19 of usage for the whole platform: apps, databases, Sandboxes, storage and egress." |
| Included usage does not roll over | docs-confirmed | https://lizard.build/docs/platform/billing.md | "Unused usage does not carry over to the next month." |
| Overage is charged in escalating steps | docs-confirmed | https://lizard.build/docs/platform/billing.md | "When unbilled overage reaches $20, Lizard charges your card. Each paid charge raises the next step: $100, then $200, $400 and $1,000, and $1,000 after that." |
| No spending cap | docs-confirmed | https://lizard.build/docs/platform/billing.md | "There is no spending cap." |
| Sandbox sizes and prices | pricing-page | https://lizard.build/pricing | "Small 2 vCPU · 4 GB RAM · 5 GB disk \| $0.0162 per hour" / "Medium 4 vCPU · 8 GB RAM · 20 GB disk \| $0.0324 per hour" / "Large 8 vCPU · 16 GB RAM · 50 GB disk \| $0.0648 per hour" |
| Billing granularity: per second, idle included, no minimum published | pricing-page | https://lizard.build/pricing | "Running sandboxes are billed per second, including idle time." |
| Monthly figures assume 730 hours | pricing-page | https://lizard.build/pricing | "Monthly prices assume 730 hours of running time. You pay per second." |
| Paused sandbox compute is $0 | pricing-page | https://lizard.build/pricing | Row labelled "Paused sandbox compute", value cell "$0"; footnote "A successful pause stops compute charges; Persistent Volumes storage is billed separately." |
| Metered app rates (not used for sandboxes) | docs-confirmed | https://lizard.build/docs/platform/billing.md | "CPU \| $0.000006948 per vCPU-second" / "Memory \| $0.000003474 per GB-second" / "Persistent Volumes \| $0.000000054 per GB-second" |
| Same rates expressed monthly | pricing-page | https://lizard.build/pricing | "CPU \| $18.26 per vCPU/month" / "Memory \| $9.13 per GB/month" / "Persistent Volumes \| $0.14 per GB/month" |
| Object storage | pricing-page | https://lizard.build/pricing | "Managed Object Storage \| $0.0135 per GB/month" |
| App egress | docs-confirmed | https://lizard.build/docs/platform/billing.md | "Outgoing traffic \| $0.045 per GB, from the first byte" |
| Sandbox egress included, no per-GB rate | pricing-page | https://lizard.build/pricing | "Sandbox egress \| 2 TB per account over a rolling 30 days included" |
| Free tier / credits — 7-day trial with $5 of usage, card required | docs-confirmed | https://lizard.build/docs/platform/billing.md | "Pro starts with a 7-day trial that includes $5 of usage. You add a card to start it; Apple Pay works too. Nothing is charged when the trial starts." |
| One trial per account and per card | docs-confirmed | https://lizard.build/docs/platform/billing.md | "Each account and each card gets one trial." |
| Promo codes can extend a trial up to 730 days | docs-confirmed | https://lizard.build/docs/platform/billing.md | "A promo code can give a longer trial, up to 730 days, and more trial usage." |
| Prepaid wallets — **no**, card or invoice only | pricing-page | https://lizard.build/pricing | Pro "How you pay \| Card, charged automatically"; Enterprise "Invoice, billed monthly" |
| Seat fees — none | pricing-page | https://lizard.build/pricing | "Seat fees \| None" |
| Separate charge for static IPs — **no such product** | third-party | https://battleships.dev/data/providers/lizard.json | "static_egress_ip": false, "public_ipv4": false |
| Snapshot storage price | not-published | — | No rate anywhere for stored snapshots. |
| Volume billing while detached — still billed | docs-confirmed | https://lizard.build/docs/cli/sandbox.md | "storage in Persistent Volumes continues at the volume rate, whether attached or detached" |
| Legacy sandboxes keep usage-based billing | docs-confirmed | https://lizard.build/sandboxes | "Older sandboxes without a size keep their original usage-based billing." |

### 10.2 Two meters, one product — the arithmetic worth knowing

At the metered rates, 2 vCPU + 4 GB for one hour costs:

- CPU: 2 × $18.26 / 730 = **$0.05003**
- RAM: 4 × $9.13 / 730 = **$0.05003**
- Total: **$0.10006/hour**

The Small sandbox — the same 2 vCPU and 4 GB, plus 5 GB of disk — costs **$0.0162/hour**, about **6.2× less** than the metered rate for the same capacity. (`inferred`: that the gap is intentional rather than an error.) This is not a contradiction in Lizard's pricing; it is two different products with two different meters, but it means you cannot sanity-check sandbox prices against the CPU/memory table on the same page.

---

## 11. Worked cost examples

All figures use only published prices: Small $0.0162/h, Medium $0.0324/h, Large $0.0648/h, volumes $0.14/GB-month, Pro $19/month with $19 of usage included.

### (A) 1,000 agent tasks a month, 10 minutes each, 2 vCPU / 4 GiB, then deleted

The exact size exists: **Small** is 2 vCPU / 4 GB / 5 GB disk.

```
10 minutes = 10/60 = 0.166667 hours
Per task   = 0.0162 × 0.166667 = $0.0027
1,000 tasks = 0.0027 × 1,000 = $2.70 of sandbox compute
No volumes, no snapshots (tasks are deleted) → no storage charge
Bill = $19 (Pro) + max(0, $2.70 − $19) = $19.00
```

The $2.70 is entirely absorbed by the included usage. **You pay $19/month for this workload.** Lizard publishes the same arithmetic at 5 minutes per task: "1,000 × (5 / 60 hours) × $0.0162 = $1.35 in compute usage" (https://lizard.build/blog/ai-sandbox).

Rate-limit check, not cost: 1,000 starts spread over a month is fine, but Pro caps starts at 400/day and 24/minute (https://lizard.build/docs/platform/limits.md), so the tasks cannot all run in one day.

### (B) One always-on dev box, 4 vCPU / 8 GiB / 50 GiB disk, 730 h/month

**That exact machine does not exist.** Medium is 4 vCPU / 8 GB but only 20 GB of disk; Large has 50 GB but 8 vCPU / 16 GB. Two published ways to get close:

```
Option 1 — Medium + a 30 GB volume (30 GB used)
  compute: 0.0324 × 730            = $23.652
  storage: 0.14 × 30               = $4.20
  total                            = $27.85/month
Option 2 — Large (8 vCPU / 16 GB / 50 GB)
  compute: 0.0648 × 730            = $47.304
  total                            = $47.30/month
```

Option 1 matches the requested CPU and RAM exactly and over-delivers disk by splitting it across two filesystems (20 GB local + 30 GB at `/workspace`). Option 2 matches the disk and over-delivers CPU and RAM by 2×. Either way the bill is above $19, so the included usage simply discounts it: $27.85 or $47.30 all-in.

### (C) One persistent box, 2 vCPU / 4 GiB / 20 GiB, 3 h/day × 30 days, stopped otherwise

A 30-day month is 720 h, of which the box runs 3 h a day for 90 running hours. **No size has 2 vCPU with 20 GB of disk.** Two readings:

```
Option 1 — Small + a 15 GB volume (15 GB used)
  compute: 0.0162 × 90             = $1.458
  storage: 0.14 × 15               = $2.10
  total                            = $3.558 ≈ $3.56
Option 2 — Medium (4 vCPU / 8 GB / 20 GB), no volume
  compute: 0.0324 × 90             = $2.916 ≈ $2.92
```

Both are under $19, so **the bill is $19/month either way** — the Pro floor dominates, and the choice between them is about latency and disk layout, not money. Two caveats that change the shape, not the price: "stopped" here means killed, which deletes the sandbox's own disk, so anything you want to keep must live on the volume; and if you *pause* instead of stopping, compute is $0 while paused and the whole disk plus memory is retained at no published charge.

**Sensitivity.** If the box ran all 720 h of the month instead of 90, Option 1 becomes 0.0162 × 720 + 2.10 = $13.76 (still under the $19 floor), and Medium becomes 0.0324 × 720 = $23.33 (over it). Sandbox compute at these rates is small enough that the $19 subscription is the real cost driver for anything short of a fleet.

---

## 12. Same word, different meaning

Every row in this table is `inferred`: my reading of the behaviour documented in §2–§7, not a claim Lizard makes about itself. Where a phrase is quoted from Lizard, the URL is inline.

| Term | What it means at Lizard | How that differs elsewhere | Practical consequence |
|---|---|---|---|
| **Stop / kill** | Deletes the sandbox and its disk. There is no stopped-but-restartable state. | Many providers let you stop an instance and start it again with the disk intact. | Lizard's own advice, "Pause or kill a sandbox when the task ends." (https://lizard.build/docs/sandboxes.md), means files outside `/workspace` are destroyed. If you wanted a cold spare, you wanted *pause* or a snapshot. |
| **Pause** | Saves memory, running processes and the **whole** disk; resume restores the same sandbox ID; compute billing stops. | At providers where "pause" is a euphemism for stop, memory is gone; at others, paused memory is billed. | A paused sandbox is a free, fully resumable machine — including packages installed outside `/workspace`, which most providers lose. |
| **Pause (fast)** | Same word, second meaning: keeps files only, kills processes, resume is a cold boot. | — | Two buttons both called pause, with different guarantees. The response field `memoryRestored: false` is the only signal. |
| **Snapshot** | Memory + running processes + whole disk, captured from a running sandbox, restorable into a new sandbox. | Often disk-only, or memory-only, or requires the source to be stopped. | A snapshot is closer to a hibernated machine image than to a backup. It also silently embeds a copy of any attached volume's files. |
| **Fork** | Copies a **running** sandbox 1–100 times, memory and processes included — but the source is paused *briefly* to capture. | "Fork" sometimes means clone the disk and cold-boot; some providers require an explicit pause first. | It is not zero-impact: the source stalls for the capture. And it is impossible while a volume is attached (409). |
| **Persistent** | Only `/workspace`, only via a named volume, one sandbox at a time, on one node. | Often the whole disk persists, or storage is network-attached and shareable. | A persistent volume here is closer to a USB stick than to a network drive: no sharing, no HA, dies with the node. |
| **Lifetime / timeout** | A hard deadline from creation. Commands do not reset it. Defaults differ by entry point: 5 min (SDK/CLI) vs never (API/dashboard). | Usually an idle timeout that activity extends. | A long build gets killed at the deadline mid-command, and the same product behaves oppositely depending on how you created the sandbox. |
| **SSH** | `lizard sandbox ssh` is an interactive shell over Lizard's own transport with your CLI login. | The SSH protocol. | No `scp`, no `ssh -L`, no keys, no `rsync` over SSH. Scripts that shell out to `ssh` will fail. |
| **Egress included** | 2 TB free **for sandboxes only**; apps pay $0.045/GB from the first byte. | "Free egress" usually means one allowance for the account. | An agent that downloads datasets inside a sandbox is free; the same download inside a deployed app is billed. |
| **$19 plan** | A floor plus a credit: $19 buys $19 of usage, and you cannot spend less than $19. | "Free tier" or "pay as you go with no minimum". | The cheapest possible month is $19, no matter how little you run. |
| **Credits** | Older pages call the included usage "monthly credits"; current pages call it "included usage". Same money. | — | Cosmetic, but quoted copy from an older doc will look wrong against today's pricing page. |
| **Template** | A fixed platform image from a short catalog. Not a Dockerfile, not an OCI image you supply. | "Template" often means "your own image". | No custom base images for sandboxes; snapshots are the only way to carry your own setup forward. |
| **Desktop** | A Linux desktop with Chromium that the agent drives by screenshots and clicks; VNC only through a local CLI tunnel. | Usually RDP/VNC on a public port. | You cannot hand a colleague a VNC address; you hand them a tokenised URL or run the CLI bridge. |
| **Root** | The default user inside the guest. | Some sandboxes drop to an unprivileged user. | Root here is a convenience, not an isolation boundary — the boundary is the VM. |

---

## 13. Glossary candidates

- **microVM / Firecracker** — a lightweight virtual machine with its own kernel, started in milliseconds; the isolation boundary Lizard sells.
- **Own kernel** — the guest does not share the host's kernel, so a kernel exploit inside does not directly reach the host.
- **Template** — one of Lizard's fixed starting images (`base`, `interpreter`, `codex`, `claude`, `opencode`, `pi`, `prime`, `desktop`, `desktop-camoufox`).
- **Size** — Small / Medium / Large; bundles vCPU, RAM and local disk at one hourly price.
- **Lifetime / deadline** — the hard expiry set at create time (`timeoutMs`); not an idle timer.
- **Pause vs fast pause** — memory-preserving freeze vs files-only freeze.
- **Snapshot vs restore** — a captured machine state, and a new sandbox booted from it.
- **Fork** — N copies of a running sandbox, memory included.
- **Persistent Volume** — a named 1–50 GB disk mounted at `/workspace`, attached to one sandbox at a time, node-local.
- **Workspace / project** — account-level container, then a grouping of services, addons and sandboxes; sandboxes always belong to a project.
- **Preview URL** — a private HTTPS address for one exposed port, gated by a per-sandbox access token.
- **Included usage / overage** — the $19 of monthly credit, and the metered spend above it.
- **Egress** — outbound traffic; free up to 2 TB/30 days for sandboxes, billed per GB for apps.
- **Prepared capacity** — Lizard's claim that starts come from a warm pool, which is how 228 ms is possible (`inferred` from "Starts can use prepared capacity").
- **Billing pause** — the platform pausing your resources when a payment fails, which is not the same as you pausing a sandbox.

---

## 14. Gaps, gotchas, contradictions, and battleships discrepancies

### Not published (asked and answered: no source found)

1. **Snapshot storage price.** Restores are priced; stored snapshots are not. This is the biggest hole in the cost model for anyone using snapshots as images.
2. **What a paused sandbox costs in storage.** Pricing says paused compute is $0 and volumes bill separately; nothing says whether the paused sandbox's own disk or memory is charged, or whether paused sandboxes are reaped after some period.
3. **Resume and restore latency.** Only cold start (228 ms median) and "about a second" for fast pause are published.
4. **Docker inside a sandbox**, systemd/init, nested virtualization, kernel feature support (eBPF, FUSE, cgroups), guest firewall rules.
5. **CPU architecture** (x86-64 vs arm64) — never stated.
6. **Sandbox egress beyond 2 TB** — "contact us", no rate.
7. **Webhooks** for sandbox events.
8. **Custom domains** for preview URLs (documented for app services only).
9. **Concurrency behaviour under load** — limits are published, but not queueing or admission behaviour beyond HTTP 429 codes.

### Gotchas

Each gotcha is `inferred` from the quoted behaviour above; the sources are in §3–§7.

- **Default lifetime is 5 minutes from SDK/CLI and infinite from the API/dashboard.** Same product, opposite defaults. The docs are explicit ("even in the middle of a task"), and this is the most likely way a beginner loses work.
- **`kill` deletes the disk.** There is no undo and no trash: "Sandboxes, their volumes and snapshots have no trash."
- **A snapshot of a sandbox with a volume silently embeds the volume's contents**, and anyone who can restore it can read them.
- **Fork and volumes are mutually exclusive** (409), so forking a prepared environment does not work if the environment lives on a volume.
- **Pause can fail** and leaves the sandbox running and billing, with the reason in `pauseError`.
- **Pausing drops open connections** — long-lived WebSockets and SSH-style sessions must reconnect.
- **Preview URL tokens are per-sandbox, not per-port**, and the URL works only while the sandbox runs.
- **No spending cap**, and overage auto-charges your card in $20 → $100 → $200 → $400 → $1,000 steps.
- **$19 is a floor**, so tiny workloads are dominated by the subscription, not by compute.
- **Trial is Small-only and US-only**, and a second trial is not available on the same account or card.
- **`base` cannot run coding agents** (no Node.js); you need an agent template.

### Contradictions inside Lizard's own material

| Issue | Evidence | Sources |
|---|---|---|
| The runtime changed from pods/runc to Firecracker, and the billing model changed from metered to flat per size, between 30 September and 13 October 2026 | The 30 September capture of the Limits page reads "Sandboxes run short-lived commands and agent tasks in Kubernetes pods with the runc runtime. They share the host kernel; they are not Firecracker virtual machines." and "Billing uses measured CPU, memory, storage, and egress." The 13 October capture of the pricing page already lists "Small 2 vCPU · 4 GB RAM · 5 GB disk" at "$0.0162 per hour". Neither page announces the change, and the live docs carry no migration note. | https://web.archive.org/web/20260930084615/https://lizard.build/docs/platform/limits.md · https://web.archive.org/web/20260930084612/https://lizard.build/docs/sandboxes.md · https://web.archive.org/web/20261013193324/https://lizard.build/pricing · https://lizard.build/docs/platform/limits.md |
| Fork copy count changed from 10 to 100 | Battleships, checked 2026-10-14: "Copy a running sandbox 1 to 10 times". Live SDK reference: "Copy a running sandbox 1 to 100 times". Live CLI: "Copies to start, from 1 to 100 (default `1`)". | https://battleships.dev/data/providers/lizard.json · https://lizard.build/docs/sandboxes/sdk-reference.md · https://lizard.build/docs/cli/sandbox.md |
| A "pod sandbox" fork error (501) has disappeared from the docs | Battleships quotes "501 for a sandbox that runs as a pod" from `docs/sandboxes.md`. The live page (updated 2026-10-27) contains neither "501" nor "pod" — checked by search, not by eye. | https://battleships.dev/data/providers/lizard.json · https://lizard.build/docs/sandboxes.md |
| "Live fork (no pause)" vs a documented brief pause | Battleships lists "live fork (no pause)". Lizard's CLI docs say "Lizard pauses the sandbox for a moment, captures its memory, processes, and files once". | https://battleships.dev/data/providers/lizard.md · https://lizard.build/docs/cli/sandbox.md |
| "Credits" vs "included usage" | The live Terms still say "monthly credits"; the live billing docs say "included usage" for the same $19. | https://lizard.build/terms · https://lizard.build/docs/platform/billing.md |
| The Pro/trial compare table puts two values in each cell, so text extraction concatenates them | Extracted text runs the two values together, so 100 and 5 appear as 1005, and 5 and 1 appear as 51. Read the plan bullets, not that table. This is an observation of the extracted text, not a quotation of the page. | https://lizard.build/pricing (observation of the extracted text) |

### Discrepancies with battleships.dev

| Field | Battleships | What Lizard's docs say | Verdict |
|---|---|---|---|
| `isolation` | firecracker | "Sandboxes run as Firecracker microVMs, each with its own kernel." | **Agrees.** |
| pricing regime | "flat per second while it runs" | "flat hourly price … billed by the second while the sandbox runs, idle time included" | **Agrees.** |
| `whole_disk` | false | Pause and snapshot keep "the whole disk, including packages installed outside `/workspace`"; only a *stop* loses it | **Misleading.** Correct for survives-a-stop, wrong as a general statement about the disk. |
| `persist_scope` | "folder" | Volumes mount only at `/workspace` | **Agrees** for stop-persistence. |
| `snapshot_mem` | true | "saves the sandbox's memory, running processes and every file" | **Agrees.** |
| `fork_running` | true | "Copy a running sandbox … memory and processes included" | **Agrees**, though the source briefly pauses. |
| `fork` count | "1 to 10" (quoted) | "1 to 100" | **Stale.** |
| `mcp_server` | null (unknown) | Hosted MCP server documented at `https://employ-woman-g1q2.us-east-1.onlizard.com/mcp` | **Should be true.** |
| `spend_limits` | null | "There is no spending cap." | **Should be false.** |
| `auto_stop_idle` | false | "idle time does not stop it early"; "This is not an idle timer." | **Agrees.** |
| `ssh` | false | "SSH protocol access is not available" | **Agrees** (there is an interactive shell, but not SSH). |
| `desktop`, `browser`, `computer_use` | true | `desktop` template with Chromium; screenshots/clicks/keys | **Agrees.** |
| `docker_inside` | null | not documented | **Correctly unknown.** |
| `systemd` | null | not documented | **Correctly unknown.** |
| `soc2`, `sso`, `audit_logs` | false | "coming soon" / Enterprise-only / Enterprise-only | **Agrees for Pro.** |
| `eu_data_residency` | true | EU West (Limburg) region | **Agrees.** |
| `gpu` | false | "Sandboxes run on CPUs only." | **Agrees.** |
| `custom_image` | true | Templates are fixed; "The public CLI does not provide a custom-template upload flow" | **Disputed.** Snapshots can act as a custom image; a Docker/OCI image cannot. |
| `guest_firewall` | true ("nftables") | not documented | **Unverified.** |

---

## 15. Non-technical usability

Read this section as: could a curious non-engineer get value here without writing code?

| Question | Answer | Tag | Source | Quote |
|---|---|---|---|---|
| Is there a web dashboard? | Yes, and it can create sandboxes without code | docs-confirmed | https://lizard.build/docs/sandboxes/dashboard.md | "The dashboard lets you create and manage Sandboxes without code." |
| What can the dashboard do? | Pick template, region, size and lifetime; then pause/resume, open a terminal, browse volumes | docs-confirmed | https://lizard.build/docs/sandboxes/dashboard.md | "Create a sandbox with **New Sandbox**: pick a template from the catalog, a region, and a size … Pick a lifetime under **Delete after**: 15 minutes, 1 hour, 4 hours, 1 day, 7 days, or Never (the default)." |
| Is there a browser terminal? | Yes, a Terminal tab per sandbox | docs-confirmed | https://lizard.build/docs/sandboxes/dashboard.md | "Its header has Pause and Resume buttons, and the Terminal tab opens a shell in a running sandbox." |
| Can you run an agent with clicks only? | **No.** Templates preinstall Claude Code/Codex/etc., but you start the agent with a CLI prompt or the SDK | docs-confirmed | https://lizard.build/docs/cli/sandbox.md | "`lizard sandbox prompt <id> <prompt...>` sends a prompt and streams what the agent does." (no dashboard equivalent documented) |
| Can you attach a volume from the dashboard? | Not at create time; volumes are created/attached via SDK or CLI | docs-confirmed | https://lizard.build/docs/sandboxes/dashboard.md | "Create and attach volumes with the SDK or CLI; the create form has no volume option." |
| Is there a template gallery for apps? | Yes — a one-click catalogue of open-source apps | pricing-page | https://lizard.build/deploy | "Deploy open-source apps in one click" / "Deploy an app in minutes." |
| What does signup take? | A GitHub or Google account. The sign-in page has only those two buttons — no email/password form | docs-confirmed | https://lizard.build/login (rendered) | "Sign in to your account" … "[Sign in with GitHub] [Sign in with Google]" (rendered page; the raw HTML contains no page text) |
| Same sign-in for CLI and dashboard | Yes; the CLI asks the same question and opens the same browser flow | docs-confirmed | https://lizard.build/docs/cli/login.md | "At a terminal, `login` asks whether you sign in with GitHub or Google, opens that page in your browser and waits until you approve." |
| Is there a waitlist? | No evidence of one; OAuth sign-in is the only gate on the page | `inferred` from the rendered page | https://lizard.build/login (rendered) | "By continuing, you agree to Terms of Service and Privacy Policy, and to receive periodic emails with updates." (the only condition stated before entering) |
| Does signup ask for a card? | **Not at signup.** A card is needed later, to start the trial or Pro, and Pro is required before you can create anything | docs-confirmed | https://lizard.build/docs/platform/billing.md | "You can browse with a new account, but you need Pro to create apps, Sandboxes, databases or volumes." |
| Card required to start the trial? | Yes, via Stripe Checkout; nothing is charged during the 7 days | pricing-page | https://lizard.build/pricing | "You need a card to start it, but we charge nothing during the 7 days, and you can cancel before the trial ends." |
| Signing in the "wrong" way creates a second account | Picking the other provider makes a new empty account unless both share a verified email | docs-confirmed | https://lizard.build/docs/cli/login.md | "If you already have an account, pick the method you signed up with: the other one opens a second, empty account unless both share a verified email." |
| Docs quality | Unusually candid: per-page "updated" dates, explicit "Test status" notes saying what was and was not verified, raw `.md` twins, six languages, "Ask AI about this page" buttons | docs-confirmed | https://lizard.build/docs/sandboxes/guides/claude-code.md | "**Test status:** the commands and behaviour on this page come from Lizard CLI 4.0.42 and the platform's agent runner as of 2026-10-12 … We have not run this walkthrough end to end in a live sandbox for this page." (observation of the page; quotes as marked) |
| Support channels | Email and Discord; no phone, no ticket portal | pricing-page | https://lizard.build/support | "For account issues, billing questions, or anything else, email team@lizard.build." / "Join the Lizard Discord for community help and to talk with the team directly." |
| Paid support | Pro is "Basic support"; SLAs are Enterprise | pricing-page | https://lizard.build/pricing | Pro: "Basic support"; Enterprise: "Dedicated, hands-on support with SLAs" |
| Status page | Yes, with per-component uptime and incident history | third-party | https://status.lizard.build/ (rendered) | "This page reports platform-wide incidents with significant, widespread user impact. Smaller or isolated issues won't show up here." / "Platform 99.95% uptime" |
| Does the status page cover sandboxes? | **No** — components listed are website, dashboard/API, CLI installer, deployments/builds, app hosting, S3. Sandbox capacity is not a monitored component | third-party | https://status.lizard.build/ (rendered) | Component list: "Website", "Dashboard & API", "CLI installer", "Deployments & builds", "App hosting", "S3 storage" |

Quotes from `https://lizard.build/login` and `https://status.lizard.build/` were taken from rendered fetches (Firecrawl and Context.dev, 2026-10-28). Both pages are client-rendered, so the quoted text is absent from the raw HTML.

### What would trip up a non-engineer

These are `inferred` observations from the sources above, not claims Lizard makes.

1. **The five-minute default.** Create a sandbox from the SDK or CLI, look away, and it is deleted — with its files. The dashboard's "Never" default is the opposite behaviour, so two people following two different docs get two different experiences.
2. **"Stop" means delete.** A non-technical user will reasonably expect a stopped machine to still be there. Here it is gone, and so is everything outside `/workspace`.
3. **Everything interesting needs a terminal.** The dashboard can start a machine and give you a shell, but running Claude Code, attaching a volume, taking a snapshot, or forking all live in the CLI or SDK. The dashboard can *list* snapshots and volumes but not create them.
4. **The card comes before the product.** You can create an account for free, but you cannot create a single sandbox until you add a card and start the trial.
5. **Two bills in one number.** Apps are metered per vCPU-second and GB-second; sandboxes are flat per hour. Reading the pricing page as one consistent rate card will produce wrong estimates — as the 6.2× gap in §10.2 shows.
6. **Overage charges arrive without a cap**, in steps, as you use them.
7. **Preview URLs look broken without the token.** Opening a bare `…onlizard.com` host returns 401 by design; the full URL with `?lizard_token=` is required, and each port needs its own first visit.
8. **Agent credentials are account-wide.** Connecting a Claude or ChatGPT credential once makes it available to every sandbox in the account, which is convenient and also a thing to explain before handing out access.

---

## 17. The company behind it

Lizard is the trading name of **Dragon Labs LLC**, a small US company that publishes a Portland, Oregon mailing address and chooses Delaware law for its contracts. Two people are named in public — Yura Dubinin, described by a startup directory as "co-founder and president", and Mikhail Erin, who co-authors the company blog. The product has been public since roughly mid-2026; there is no announced funding round, no published team page, no SLA outside Enterprise, and no SOC 2 report yet. Infrastructure runs on OVHcloud in Germany and the United States, with a French test environment.

### 17.1 Legal entity and registration

| Claim | Tag | Source | Quote |
|---|---|---|---|
| Legal entity is Dragon Labs LLC, trading as Lizard | docs-confirmed | https://lizard.build/terms | "We are Dragon Labs LLC, doing business as Lizard" |
| Postal address on the contract | docs-confirmed | https://lizard.build/terms | "or by mail to 1336 NW Flanders St #312, Portland, OR 97209, United States." |
| Governing law is Delaware, not the address state | docs-confirmed | https://lizard.build/terms | "governed by and construed in accordance with the laws of the State of Delaware" |
| The DPA is signed by the same entity | docs-confirmed | https://lizard.build/dpa | "entered into between Dragon Labs LLC, doing business as Lizard" |
| The privacy notice names the same entity | docs-confirmed | https://lizard.build/privacy | "This Privacy Notice for Dragon Labs LLC (doing business as Lizard)" |
| Terms version in force | docs-confirmed | https://lizard.build/terms | "Last updated October 19, 2026" |
| Directories place it in Delaware | third-party | https://f4.fund/startups/lizard-build (rendered) | "Delaware, Delaware, United States" |
| The same on LinkedIn | third-party | https://www.linkedin.com/company/lizard-build | "Delaware, Delaware 2 followers" |
| State of incorporation | not-published | — | No page cites a company-registry number or filing. Delaware governing law plus a Portland mailing address does not establish where the LLC is registered; I did not find a registry record I could tie to this company with confidence. |

### 17.2 Founders and leadership

| Claim | Tag | Source | Quote |
|---|---|---|---|
| Yura Dubinin is named publicly and writes the engineering blog | docs-confirmed | https://lizard.build/blog/welcome-to-the-lizard-blog | "Mikhail Erin and Yura Dubinin" (byline, "July 31, 2026") |
| Dubinin's title is "co-founder and president" | third-party | https://f4.fund/startups/lizard-build (rendered) | "Yura Dubinin" … "co-founder and president" |
| A second person, Mikhail Erin, is named on the same byline | docs-confirmed | https://lizard.build/blog/welcome-to-the-lizard-blog | "Mikhail Erin and Yura Dubinin" |
| Erin's title, and whether he is the second co-founder | not-published | — | The byline carries no titles. Co-founder implies at least one other founder, but Lizard never names one. `inferred`, not established. |
| Other leadership (CTO, board, advisors) | not-published | — | No team, about, or leadership page exists on the site (checked by mapping the domain). |
| Two npm accounts publish the SDK | third-party | https://registry.npmjs.org/@lizard-build/sdk | "\"maintainers\":[\"onlizard\",\"yuraoak\"]" |
| Named press coverage of the founders | not-published | — | No interviews, funding stories, or profiles found; Hacker News returns zero stories for the domain. |

### 17.3 Founding and launch dates

| Claim | Tag | Source | Quote |
|---|---|---|---|
| Company founded 2026 | third-party | https://f4.fund/startups/lizard-build (rendered) | Quick Reference row "Founded", value "2026" |
| Crunchbase hides the founding date | third-party | https://www.crunchbase.com/organization/lizard-lizard-build (rendered) | Label "Founded", value "obfuscated" |
| GitHub organisation created 30 October 2024 | third-party | https://api.github.com/orgs/lizard-build | "\"created_at\": \"2024-10-30T13:17:25Z\"" |
| First public SDK release 24 June 2026 | third-party | https://registry.npmjs.org/@lizard-build/sdk | "\"created\":\"2026-06-24T11:27:01.839Z\"" |
| First blog post 31 July 2026 | docs-confirmed | https://lizard.build/blog/welcome-to-the-lizard-blog | "July 31, 2026" |
| Official founding date | not-published | — | Lizard states none. The 2024 GitHub date and the 2026 founded date disagree by about 20 months, which usually means a renamed or repurposed org; that is `inferred`. |

### 17.4 Funding, investors, accelerators

| Claim | Tag | Source | Quote |
|---|---|---|---|
| No announced round, amount, or investor list | not-published | — | Nothing on the site, blog, or in search results. Battleships, cross-check only: "No funding, investor, or accelerator announcements were found" (https://battleships.dev/data/providers/lizard.json) |
| A directory labels the stage "Seed" | third-party | https://f4.fund/startups/lizard-build (rendered) | "Stage" … "Seed" |
| F4 is not an investor on the evidence available | inferred | https://f4.fund/portfolio (rendered) | Lizard is absent from F4's portfolio list, and its profile carries "Is this your company? Claim your profile" — the page is a research directory entry, not a portfolio page. |
| Accelerators | not-published | — | No accelerator is named anywhere. Battleships, cross-check only: "Accelerators: none found" (https://battleships.dev/data/providers/lizard.md) |
| Crunchbase funding detail | not-published | https://www.crunchbase.com/organization/lizard-lizard-build (rendered) | "Unlock best-in-class private company insights with Crunchbase Pro" — the figures are behind a login. |
| Revenue or valuation | not-published | — | Not disclosed anywhere. |

### 17.5 Ownership and parent companies

| Claim | Tag | Source | Quote |
|---|---|---|---|
| Parent company | not-published | — | The Terms name one contracting entity and no parent, subsidiary, or affiliate as counterparty. |
| Ownership changes, mergers, acquisitions | not-published | — | None found. |
| Independent company | third-party | https://battleships.dev/data/providers/lizard.json | "\"ownership\": {\"value\": \"independent\", \"parent\": null}" |

### 17.6 Headcount

| Claim | Tag | Source | Quote |
|---|---|---|---|
| LinkedIn lists two employees | third-party | https://www.linkedin.com/company/lizard-build | "Discover all 2 employees" |
| Crunchbase band is 1–10 | third-party | https://www.crunchbase.com/organization/lizard-lizard-build (rendered) | "Private[1-10]" |
| F4 band is 1–10 | third-party | https://f4.fund/startups/lizard-build (rendered) | "1-10 employees" |
| Headcount published by Lizard | not-published | — | No team page. Every figure above is a directory estimate. |

### 17.7 Status page and recent uptime

| Claim | Tag | Source | Quote |
|---|---|---|---|
| Status page exists and is currently green | third-party | https://status.lizard.build/ (rendered) | "All systems operational" |
| Platform uptime at time of check | third-party | https://status.lizard.build/ (rendered) | "Platform 99.95% uptime" |
| Both regions at 99.85% | third-party | https://status.lizard.build/ (rendered) | "EU West · Limburg 99.85% uptime" / "US East · Virginia 99.85% uptime" |
| Control plane and installer figures | third-party | https://status.lizard.build/ (rendered) | "Dashboard & API— control plane 99.95% uptime" / "CLI installer— install.sh 99.96% uptime" |
| Scope is deliberately narrow | third-party | https://status.lizard.build/ (rendered) | "This page reports platform-wide incidents with significant, widespread user impact. Smaller or isolated issues won't show up here." |
| No sandbox component is monitored | inferred | https://status.lizard.build/ (rendered) | The listed components are Website, Dashboard & API, CLI installer, Deployments & builds, App hosting, and S3 storage per region. Sandbox creation and capacity appear nowhere, so the 99.95% figure says nothing about sandbox availability. |
| Recent incident history | third-party | https://status.lizard.build/ (rendered) | "No incidents reported." for each of 22–28 October 2026 |

### 17.8 SLA

| Claim | Tag | Source | Quote |
|---|---|---|---|
| No published SLA document | not-published | — | No SLA or service-level page exists, and the word "SLA" does not appear in the Terms of Service. |
| An SLA is an Enterprise contract item | pricing-page | https://lizard.build/pricing | "Dedicated, hands-on support with SLAs" (Enterprise column) |
| Pro gets no SLA, only "Basic support" | pricing-page | https://lizard.build/pricing | Pro column: "Basic support" |
| Uptime target or service credits for Pro | not-published | — | The status page reports history; it promises nothing, and no credit scheme is documented. |
| Remedies for downtime | not-published | — | Nothing beyond the general liability cap in §17.11. |

### 17.9 Support channels

| Claim | Tag | Source | Quote |
|---|---|---|---|
| Email | docs-confirmed | https://lizard.build/support | "For account issues, billing questions, or anything else, email team@lizard.build." |
| Discord | pricing-page | https://lizard.build/support | "Join the Lizard Discord for community help and to talk with the team directly." |
| Docs | docs-confirmed | https://lizard.build/support | "Guides, CLI reference, and platform docs live at lizard.build/docs." |
| GitHub issues for the open-source tools | pricing-page | https://lizard.build/support | "Found a bug in a Lizard open-source tool (CLI, MCP server)? File it on github.com/lizard-build" |
| Phone, live chat, or a ticket portal | not-published | — | The support page lists only email, Discord, docs, and GitHub. That there is no other channel is `inferred` from that list. |
| Response-time commitment or support hours | not-published | — | No target is stated for either plan. |
| Named support contacts or escalation path | not-published | — | None published. |

### 17.10 Security and compliance claims

| Claim | Tag | Source | Quote |
|---|---|---|---|
| SOC 2 is not available yet | pricing-page | https://lizard.build/pricing | "SOC 2 report (coming soon)" |
| HIPAA is out of scope and no BAA is signed | docs-confirmed | https://lizard.build/terms | "We do not sign Business Associate Agreements (BAAs)." |
| Not a payment processor, so PCI DSS is the customer's problem | docs-confirmed | https://lizard.build/terms | "We are not a payment card processor." |
| A signable DPA is offered | docs-confirmed | https://lizard.build/privacy | "If you need a signed Data Processing Addendum, download it at lizard.build/dpa and email the signed copy to team@lizard.build." |
| SCCs apply, with Irish governing law | docs-confirmed | https://lizard.build/dpa | "in Clause 17, Option 1 applies, and the governing law is the law of Ireland" |
| Sub-processors are published with advance notice | docs-confirmed | https://lizard.build/subprocessors | "We add a new sub-processor to this page at least five days before it starts processing Customer Personal Data" |
| Infrastructure is OVHcloud in Germany, France and the US | docs-confirmed | https://lizard.build/terms | "The Services use OVHcloud infrastructure in Germany (Limburg an der Lahn), France (test infrastructure), and the United States." |
| The EU region's host is OVH GmbH | docs-confirmed | https://lizard.build/subprocessors | "OVH GmbH" … "Infrastructure for `eu-west-lim-a` and the copy of the control plane database" … "Germany" |
| Customer may audit once a year | docs-confirmed | https://lizard.build/dpa | "Customer may audit Lizard's compliance with this DPA no more than once per calendar year" |
| One security questionnaire per year is answered | docs-confirmed | https://lizard.build/dpa | "Lizard will answer one written security and privacy questionnaire from Customer per calendar year." |
| Breach notification is "without undue delay", with no hour count | docs-confirmed | https://lizard.build/dpa | "Lizard will notify Customer without undue delay after becoming aware of a Personal Data Breach." |
| SSO, RBAC and audit logs are Enterprise-only | pricing-page | https://lizard.build/pricing | Pro cells for "SSO / SAML" and "RBAC & audit log": "Not included" |
| No warranty against data loss | docs-confirmed | https://lizard.build/terms | "WE DO NOT WARRANT THAT CUSTOMER DATA WILL NOT BE LOST, CORRUPTED, OR DESTROYED." |
| Only databases are backed up, and only the latest copy | docs-confirmed | https://lizard.build/terms | "We back up each Managed Postgres and Managed Redis database once a day and keep only the latest backup." |
| Sandbox and volume data is explicitly not backed up | docs-confirmed | https://lizard.build/terms | "We do not back up Managed Object Storage or Persistent Volumes." |
| Zero-data-retention or a security certification beyond SOC 2 | not-published | — | Neither is offered or mentioned. |
| Penetration-test report or bug bounty | not-published | — | None published; the Terms require written consent before a customer may test. |

### 17.11 Contract terms that matter to a buyer

| Term | What it says | Tag | Source | Quote |
|---|---|---|---|---|
| Cancellation | Access runs to the end of the paid month, then workloads pause | docs-confirmed | https://lizard.build/terms | "Your access continues until the end of the paid month or the trial." |
| Closing the account | By email, from the account address | docs-confirmed | https://lizard.build/terms | "You may close your account at any time by emailing team@lizard.build from the email address on your account." |
| Data deletion on termination | "Commercially reasonable timeframe" — no number of days | docs-confirmed | https://lizard.build/terms | "Following termination of your account, we will delete your Customer Data within a commercially reasonable timeframe" |
| Deletion on request | Immediate on request, including backups | docs-confirmed | https://lizard.build/terms | "We then delete all of the data concerned, including archived projects, logs, crash log excerpts and backups." |
| Pause never deletes | A paused account keeps its data | docs-confirmed | https://lizard.build/terms | "A pause stops your workloads but keeps your data. We do not delete data because of a pause." |
| Price-change notice | Notice first, then the increase applies from the next calendar month | docs-confirmed | https://lizard.build/terms | "Before an increase that affects Services you use, we will post a notice in your dashboard or email you, and the increase will not take effect for you until the first day of the next calendar month after that notice." |
| Terms-change notice | Material changes by email or notice; effective when posted | docs-confirmed | https://lizard.build/terms | "Changes take effect when we post them, unless we state a later date." |
| Spending cap | None | docs-confirmed | https://lizard.build/terms | "We do not cap your spending, so you pay for all the usage you run." |
| Refunds | At Lizard's discretion | docs-confirmed | https://lizard.build/terms | "We grant refunds at our discretion, except where the law requires a refund." |
| EU/EEA/UK consumer withdrawal | 14 days | docs-confirmed | https://lizard.build/terms | "you can withdraw from your subscription within 14 days after you start it" |
| Tax | Displayed prices include tax | docs-confirmed | https://lizard.build/terms | "Our prices and rates include the taxes we must collect, such as sales tax or VAT." |
| Suspension | Notice on commercially reasonable efforts, not guaranteed | docs-confirmed | https://lizard.build/terms | "We will use commercially reasonable efforts to provide notice before suspension" |
| Liability cap | Greater of $100 or 6 months of fees | docs-confirmed | https://lizard.build/terms | "WILL NOT EXCEED THE GREATER OF ONE HUNDRED US DOLLARS ($100) AND THE AMOUNTS PAID BY YOU TO US IN THE SIX (6) MONTHS BEFORE THE EVENT THAT GAVE RISE TO THE LIABILITY." |
| Dispute route | AAA arbitration under Delaware law | docs-confirmed | https://lizard.build/terms | "The American Arbitration Association" … "will administer the arbitration" |
| Prepaid credits | Retired from 1 November 2026 | docs-confirmed | https://lizard.build/terms | "From November 1, 2026, you need Pro to create resources" |
| Beta features | No notice, no warranty, may vanish | docs-confirmed | https://lizard.build/terms | "We may change, discontinue, or terminate Beta Services at any time without notice." |

### 17.12 The undocumented pods-to-Firecracker switch

Lizard's Terms promise notice before a price increase. Between 30 September and 13 October 2026 the sandbox runtime and the billing model both changed, and I can find no announcement of either. What I **cannot** show is that anyone's bill went up: the old model was metered, so there was no per-size price to compare against the new one.

| Claim | Tag | Source | Quote |
|---|---|---|---|
| 30 September 2026: sandboxes were pods on a shared kernel | third-party | https://web.archive.org/web/20260930084615/https://lizard.build/docs/platform/limits.md | "Sandboxes run short-lived commands and agent tasks in Kubernetes pods with the runc runtime. They share the host kernel; they are not Firecracker virtual machines." |
| 30 September 2026: one fixed size, not three | third-party | https://web.archive.org/web/20260930084612/https://lizard.build/docs/sandboxes.md | Wayback capture: "Current sandboxes use fixed limits of 4 vCPU and 4096 MiB RAM." |
| 30 September 2026: billing was metered, not per size | third-party | https://web.archive.org/web/20260930084612/https://lizard.build/docs/sandboxes.md | Wayback capture: "Billing uses measured CPU, memory, storage, and egress." |
| 30 September 2026: pause, snapshot, fork and restore did not work | third-party | https://web.archive.org/web/20260930084612/https://lizard.build/docs/sandboxes.md | Wayback capture: "Pause, resume, fork, snapshot, restore, and file watching currently return HTTP 501." |
| 13 October 2026: three sizes with flat hourly prices were live | third-party | https://web.archive.org/web/20261013193324/https://lizard.build/pricing | Wayback capture, row "Sandboxes": "Small 2 vCPU · 4 GB RAM · 5 GB disk" … "$0.0162 per hour" |
| Today: the runtime is Firecracker microVMs | docs-confirmed | https://lizard.build/docs/platform/limits.md | "Sandboxes run commands and agent tasks in Firecracker microVMs" |
| No changelog entry covers it | docs-confirmed | https://lizard.build/changelog | "Nothing here yet." / "The first entry lands with the next release." |
| No blog post covers it | docs-confirmed | https://lizard.build/blog | 37 posts listed between 31 July and 28 October 2026; none announces a runtime migration or a sandbox pricing change. |
| The Terms require notice before an increase | docs-confirmed | https://lizard.build/terms | "Before an increase that affects Services you use, we will post a notice in your dashboard or email you" |
| Whether that clause was triggered | inferred | — | The old model had no per-size price, so there is no like-for-like figure to call an increase. Existing sandboxes were grandfathered: "Older sandboxes without a size keep their original usage-based billing." (https://lizard.build/sandboxes) |
| Size of the price change for a typical customer | not-published | — | Metered billing depended on utilisation, which was never published per customer. Any percentage figure would be invented, so I give none. |

**Practical reading** (`inferred`). The migration is documented only by dated third-party archives of Lizard's own pages; Lizard never announced it, and its changelog is empty by design. A buyer comparing a cached September page with today's site sees a different isolation model and a completely different price structure, with nothing on the site explaining the switch. What I can state is the change in *model* — pods to microVMs, metered to flat per size — and the two-week window it happened in. I cannot state that prices rose.

### 17.13 What stays unpublished

Legal registration state and filing number; the official founding date; the identity and title of any second co-founder; funding stage, amount and investors (a directory's "Seed" label is not a round); accelerators; headcount from the company itself; a Pro SLA, uptime target, or service credits; support hours and response targets; security certifications beyond the promised SOC 2; penetration-test results; and any notice Lizard may have sent customers about the sandbox price change.

## Sources consulted

Lizard docs (raw markdown, each page carries an `updated` date): `/docs/index.md`, `/docs/sandboxes.md`, `/docs/sandboxes/quickstart.md`, `/docs/sandboxes/sdk-reference.md`, `/docs/sandboxes/volumes.md`, `/docs/sandboxes/preview-urls.md`, `/docs/sandboxes/code-interpreter.md`, `/docs/sandboxes/dashboard.md`, `/docs/sandboxes/guides/claude-code.md`, `/docs/platform/limits.md`, `/docs/platform/billing.md`, `/docs/platform/storage-and-recovery.md`, `/docs/platform/known-issues.md`, `/docs/concepts/architecture.md`, `/docs/networking.md`, `/docs/deploy/regions.md`, `/docs/agents.md`, `/docs/cli/sandbox.md`, `/docs/cli/agents.md`, `/docs/cli/keys.md`, `/docs/observability/events.md`.
Lizard marketing/pricing: `/`, `/sandboxes`, `/pricing`, `/support`, `/login`, `status.lizard.build`.
Lizard blog: `/blog/ai-sandbox`, `/blog/claude-code-sandbox`, `/blog/welcome-to-the-lizard-blog`.
Company and legal (section 17): `/terms`, `/privacy`, `/dpa`, `/subprocessors`, `/changelog`, `/blog`, `status.lizard.build`.
Dated archives used for the September-to-October comparison (section 17.12), all Wayback captures of Lizard's own pages: `web.archive.org/web/20260930084615/https://lizard.build/docs/platform/limits.md`, `web.archive.org/web/20260930084612/https://lizard.build/docs/sandboxes.md`, `web.archive.org/web/20261013193324/https://lizard.build/pricing`.
Registries and directories (section 17, all third-party): `api.github.com/orgs/lizard-build`, `registry.npmjs.org/@lizard-build/sdk`, `f4.fund/startups/lizard-build`, `f4.fund/portfolio`, `linkedin.com/company/lizard-build`, `crunchbase.com/organization/lizard-lizard-build`, `hn.algolia.com` (zero results for the domain).
Third party: `https://battleships.dev/data/providers/lizard.json`, `https://battleships.dev/data/providers/lizard.md`, `https://www.crunchbase.com/organization/lizard-lizard-build` (profile text mirrors Lizard's own copy; no funding data).

# Agent 37 — provider profile

Research date: 2026-10-28. Desk research only; no sandbox or agent was created, started, or billed.
Prices are the provider's published list rates in USD. Where a fact is not published I say so rather
than inferring a number.

**Claim tags**

| Tag | Meaning |
|---|---|
| `docs-confirmed` | Stated in Agent 37's own documentation at the quoted URL |
| `pricing-page` | Stated on the provider's own pricing or product page |
| `third-party` | From battleships.dev or another outside source, not the provider |
| `inferred` | My reasoning from published facts; not stated by the provider |
| `not-published` | The provider does not document this |

**Primary sources used**

- Docs site root: <https://agent37.mintlify.app/agents-api/overview> (canonical host `www.agent37.com/docs`)
- Full docs bundle: <https://www.agent37.com/docs/llms-full.txt>
- Pricing: <https://www.agent37.com/pricing>
- Consumer/managed hosting: <https://www.agent37.com/personal>
- Cloud product page: <https://www.agent37.com/cloud>
- Terms: <https://www.agent37.com/terms>
- Privacy policy: <https://www.agent37.com/privacy>
- Trust Center: <https://trust.agent37.com> and <https://trust.agent37.com/compliance>
- Status page: <https://status.agent37.com>
- Company listing: <https://www.ycombinator.com/companies/agent-37>
- Secondary: <https://battleships.dev/data/providers/agent-37.json> and `.md`

---

## 1. What it is, who it is for, product lines

**One paragraph.** Agent 37 is an early-stage (Y Combinator Fall 2026) New York company selling
hosted Linux computers for AI agents. It runs two separate businesses on one brand. The first is
**Agent37 Cloud**, a prepaid API for persistent sandboxes — a container under gVisor by default, or
a full VM with its own kernel as an option — that keeps its whole disk between runs and can sleep
when idle. The second is **managed agent hosting**, a flat monthly subscription where a
non-technical buyer gets a pre-installed OpenClaw, Hermes, Claude Code, Codex, OpenCode or Grok
agent with a browser dashboard, task board and chat channels. The Cloud API is the developer
product; the managed hosting is the consumer product.

The company facts come from outside the provider: Y Combinator lists it as Fall 2026, and
battleships.dev records the location and founder.

> "Agent 37 Persistent sandboxes for agents like hermes, openclaw, claude code Y Combinator Logo Fall 2026 Active Developer Tools SaaS B2B AI Company"
> — Y Combinator company listing, quoted at <https://battleships.dev/data/providers/agent-37.md> `third-party`
> "Founded in 2026 by VISHNU KRISHNAPRASAD, Agent 37 has 0 employees based in New York City."
> — <https://battleships.dev/data/providers/agent-37.md> (quoting the YC listing) `third-party`

> "Persistent sandboxes and full Linux VMs for code, services, and agents. Run Docker, automate Android, and reach your tools over HTTPS."
> — <https://www.agent37.com/docs> `docs-confirmed`

> "Persistent sandboxes for agents like hermes, openclaw, claude code"
> — Y Combinator company listing, quoted by <https://battleships.dev/data/providers/agent-37.md> `third-party`

**Who it is for.** Two distinct buyers, and it matters for comparison:

| Buyer | Product | What they get | Source — verbatim quote |
|---|---|---|
| A developer or startup building an agent product, one sandbox per end user | Agent37 Cloud (Sandbox API + optional Agent API) | API keys, wallet, instances, templates, exec, SSH, preview URLs |
| A founder, operator or hobbyist who wants a working personal agent without code | Managed hosting (`agent37.com/personal`) | A pre-built OpenClaw/Hermes/Claude Code agent, dashboard, messaging channels — <https://www.agent37.com/personal> `pricing-page` — "Run OpenClaw, Hermes, Claude Code, Codex, OpenCode, or Grok around the clock. Yours is live in one click." |

> "One call provisions a sandbox per customer. Message it across as many sessions as you like. Its files, memory, and connected tools stay put until you delete it."
> — <https://www.agent37.com/cloud> `pricing-page`

> "Run OpenClaw, Hermes, Claude Code, Codex, OpenCode, or Grok around the clock. Yours is live in one click."
> — <https://www.agent37.com/personal> `pricing-page`

**Product lines, mapped separately.**

**Line 1 — Agent37 Cloud (the API).** Three instance *types* on one API:

| Type | What it is | Compute rate | Source — verbatim quote |
|---|---|---|---|
| `default` (the default) | Container under gVisor, shared host CPU | 1× | <https://www.agent37.com/docs/agents-api/instances/create> `docs-confirmed` — "`default` is used when you omit `type`, and for most harnesses it is all you need." |
| `performance` | Whole machine, cores held for it | 4× | <https://www.agent37.com/docs/agents-api/instances/create> `docs-confirmed` — "`performance` is a whole machine with its cores held for it, for heavy work such as computer use, at 4x the default compute rate" |
| `vm` | Full VM, own kernel, KVM | 2.5× | <https://www.agent37.com/docs/agents-api/instances/create> `docs-confirmed` — "`vm` is a whole virtual machine with its own kernel, for Docker, Kubernetes, databases, and Android emulators, at 2.5x the default compute rate." |

> "`default` is used when you omit `type`, and for most harnesses it is all you need. `performance` is a whole machine with its cores held for it, for heavy work such as computer use, at 4x the default compute rate … `vm` is a whole virtual machine with its own kernel, for Docker, Kubernetes, databases, and Android emulators, at 2.5x the default compute rate."
> — <https://www.agent37.com/docs/agents-api/instances/create> `docs-confirmed`

**Line 2 — Managed hosting (no API).** Flat monthly plans, one agent per plan.

> "Free $0/mo … Basic $3.99/mo … Plus $9.99/mo … Pro $29.99/mo … Max $99.99/mo"
> — <https://www.agent37.com/personal> `pricing-page`

**Which line does the Agents API belong to?** The Agents API belongs to **Line 1, Agent37 Cloud**.
The documentation is explicit that the reference covers a Sandbox API plus an optional Agent API
that agent *templates* provide inside a Cloud instance:

> "Use the **Sandbox API** to create and manage persistent sandboxes for code, services, and agents. The **Agent API** is an optional capability provided by agent templates for conversations and tools inside an instance."
> — <https://agent37.mintlify.app/agents-api/overview> and <https://www.agent37.com/docs/agents-api/overview> `docs-confirmed`

The managed-hosting line has no documented public API of its own; it is sold through a browser
dashboard. Its plans are also no longer on `/pricing`, which is Cloud-only:

> "Browser-managed personal plans have their own pricing."
> — <https://www.agent37.com/pricing> `pricing-page`

**The single most important framing point for a comparison site:** "Agent API" here does **not**
mean an API that runs an agent for you in the provider's cloud. It means an HTTP endpoint inside
*your* sandbox that talks to agent software the template installed. The agent loop runs on your
instance and is billed as ordinary compute; the model is billed separately.

> "**The agent is not the model.** The *template* installs the agent software, the *gateway* inside the instance runs your sessions on it … and the *model* is the LLM the agent thinks with, set as `model` on a turn"
> — <https://www.agent37.com/docs/agents-api/concepts> `docs-confirmed`

---

## 2. Isolation technology

**Default type: gVisor (a user-space kernel), not a microVM.**

> "Every sandbox is enforced by gVisor, with its own filesystem and a hard disk quota. Tenants can never see each other."
> — <https://www.agent37.com/cloud> `pricing-page`

> "Isolation enforced by the kernel … gVisor, built at Google"
> — <https://www.agent37.com/cloud> `pricing-page`

**VM type: full virtual machine with its own kernel and KVM.**

> "A `vm` instance is a full Linux virtual machine with its own kernel and KVM hardware virtualization."
> — <https://www.agent37.com/docs/agents-api/vm-instances> `docs-confirmed`

**What that practically allows or forbids:**

| Capability | `default` (gVisor) | `vm` | Source |
|---|---|---|---|
| Docker daemon inside | **No** | **Yes** | "The default gVisor instance type cannot run a Docker daemon." |
| Docker-in-Docker, Compose, buildx | No | Yes | "Build and run containers, including Docker-in-Docker workloads and containers that need privileged mode or their own networks." |
| Kubernetes (k3s) | No | Yes | "k3s runs with its node Ready and pod networking working." |
| `/dev/kvm` / nested virtualization | No | Yes | "`/dev/kvm` is present inside the machine" |
| Android emulator | No | Yes | "The emulator needs hardware virtualization (`/dev/kvm`), which a VM has and a sandbox does not" |
| systemd as PID 1 | No | **No** | "Your entrypoint is PID 1, and there is no init system. An image whose entrypoint *is* systemd is not supported" |
| root | Yes | Yes | "pass `"root"` to run as root" |
| Databases (Postgres/MySQL/Redis) | Yes (as a process) | Yes | "Databases. Postgres, MySQL, Redis, anything with its own storage engine." listed under VM rationale |

Sources for the table: <https://www.agent37.com/docs/agents-api/vm-instances>,
<https://www.agent37.com/docs/agents-api/android>, <https://www.agent37.com/docs/agents-api/exec> — all `docs-confirmed`.

**Notable:** root works on the gVisor type, and `apt-get` works there too — the docs' own example
installs ffmpeg as root on a default instance. So the gVisor type is a real Linux userland with
package management; what it lacks is kernel-level features (own kernel, KVM, container runtimes).

> "The agent also has the rest of the machine. It can install software with `apt-get`, run scripts, and serve its own ports, as itself or through exec as root"
> — <https://www.agent37.com/docs/agents-api/desktop> `docs-confirmed`

**Architecture:** Linux `amd64` only. ARM images are rejected at registration.

> "Build for `linux/amd64` even on an Apple Silicon Mac … An arm64 image is rejected during registration."
> — <https://www.agent37.com/docs/agents-api/templates> `docs-confirmed` (also stated on <https://www.agent37.com/docs/agents-api/custom-image>)

**Compliance:** SOC 2 Type I, Type II in progress.

> "SOC 2 Type I and readiness reports on request. CONTROLS MONITORED TYPE II IN PROGRESS SOC 2 TYPE I"
> — <https://www.agent37.com/cloud> `pricing-page`

---

## 3. Lifecycle: every state and what survives

**Published statuses (12):**

> "An instance's `status` is one of `provisioning`, `running`, `stopping`, `stopped`, `starting`, `restarting`, `updating`, `sleeping`, `waking`, `failed`, `deleting`, or `deleted`"
> — <https://www.agent37.com/docs/agents-api/concepts> `docs-confirmed`

**What survives what — the key table for this comparison:**

| Action | Whole disk | `/home/node` | Memory / running processes | Billing after | Source |
|---|---|---|---|---|---|
| `stop` | Yes | Yes | **Lost** | disk only | "halts the container … CPU and memory are released … the disk stays reserved on that host" |
| `sleep` | Yes | Yes | **Kept** (checkpoint) | disk only | "Memory and running processes are saved, CPU and memory are released" |
| `start` (from stop) | Yes | Yes | Lost — fresh boot | full rate | "recreating the container from the image it already ran" |
| wake (from sleep) | Yes | Yes | Usually kept, **not guaranteed** | full rate | "In-memory state usually survives a wake, but it is not guaranteed" |
| `restart` | Yes | Yes | Lost | full rate | "Restart an instance using its current image and files." |
| `resize` | Yes | Yes | Lost | new rate | "Change an instance's CPU, memory, or disk while keeping its id and URLs." |
| `update` | Yes, **except OS layer** | Yes | Lost | full rate | "resets the operating system layer to the fresh image while keeping your data" |
| `restore` (backup) | Replaced | Replaced | Lost | full rate | "a restore replaces the data it finds rather than merging into it" |
| `delete` | **Destroyed** | Destroyed | Destroyed | stops | "Deleting an instance settles its final minutes and ends billing." |

Sources: <https://www.agent37.com/docs/agents-api/instance-lifecycle>,
<https://www.agent37.com/docs/agents-api/instances/stop>,
<https://www.agent37.com/docs/agents-api/instances/sleep>,
<https://www.agent37.com/docs/agents-api/instances/start>,
<https://www.agent37.com/docs/agents-api/instance-backups>,
<https://www.agent37.com/docs/agents-api/billing>,
<https://www.agent37.com/docs/agents-api/vm-instances>,
<https://www.agent37.com/docs/agents-api/instances/restart>,
<https://www.agent37.com/docs/agents-api/instances/resize> — all `docs-confirmed`.

**Whole disk persists, like a VM — this is a differentiator.**

> "The whole disk persists, like a VM. Files anywhere on the filesystem, installed packages, edited config, connected accounts: all of it survives `stop`, `start`, `restart`, and `resize`, and rides along if the platform ever moves the instance between hosts."
> — <https://www.agent37.com/docs/agents-api/instance-lifecycle> `docs-confirmed`

**The OS layer is separate and not on your billed disk:**

> "Writes outside that directory share a 10 GB operating-system layer separate from the instance's billed disk."
> — <https://www.agent37.com/docs/agents-api/instance-lifecycle> `docs-confirmed`

**Idle auto-stop** exists but is **off by default**:

> "Instances default to `auto_sleep: false` and never sleep on their own unless you opt them in."
> — <https://www.agent37.com/docs/agents-api/instance-auto-sleep> `docs-confirmed`

> "`idle_timeout_seconds` … An integer from `300` to `86400` (five minutes to one day)."
> — <https://www.agent37.com/docs/agents-api/instances/create> `docs-confirmed`

> "Activity is data flow in either direction on any of the instance's URLs, or a command run through exec; a connection that is open but silent does not count, and API reads like `GET /v1/instances/{id}` never reset the timer."
> — <https://www.agent37.com/docs/agents-api/instance-auto-sleep> `docs-confirmed`

**Max session length / TTL: none published.** Instances live until deleted.

> "As long as you keep it. Nothing times out mid-task, and what your agent writes to disk is still there on the next call, weeks later."
> — <https://www.agent37.com/cloud> `pricing-page` (FAQ "How long can one agent run?")

Two things that *do* have time limits, and neither ends the session:

- HTTP requests through an instance URL: 15 minutes of **silence**, not total time — "The limit is on silence, not on total time: **15 minutes**" (<https://www.agent37.com/docs/agents-api/urls> `docs-confirmed`).
- A single `exec` call waits 15 min on `sandbox.agent37.app`, 13 min on `api.agent37.com`, then returns an error while "The command itself is not stopped" (<https://www.agent37.com/docs/agents-api/exec> `docs-confirmed`).

**Published start/resume times:**

| Transition | Published time | Source |
|---|---|---|
| Wake from sleep checkpoint | "The restore itself takes a few seconds." | <https://www.agent37.com/docs/agents-api/instance-auto-sleep> `docs-confirmed` |
| Start from stopped | "It normally returns to its host in seconds" | <https://www.agent37.com/docs/agents-api/instances/start> `docs-confirmed` |
| Start, host moved | `202`, "a transfer time that depends on the amount of data" | <https://www.agent37.com/docs/agents-api/instances/start> `docs-confirmed` |
| Sleep checkpoint write | "tens of seconds on a large instance" | <https://www.agent37.com/docs/agents-api/instance-auto-sleep> `docs-confirmed` |
| Cold-storage / rebuild wake | "can take longer than a checkpoint restore and boots fresh"; up to ~3 min before `wake_timeout` | <https://www.agent37.com/docs/agents-api/instance-auto-sleep>, <https://www.agent37.com/docs/agents-api/urls> `docs-confirmed` |
| Cold create | `not-published` for default; "a create takes longer than a default instance's" for Performance | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` |

**Cold storage tier** (a fourth billing state, not a user-facing one):

> "Parked in cold storage | $0.03 per GB per month, on the actual compressed bytes stored."
> — <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed`

**Non-payment suspension** is a real state: instances are force-slept, flagged `past_due`, requests
return 402, suspended time is never billed, and an instance suspended 30 days is deleted.

> "running ones are force-slept, every one is flagged `past_due: true`, and the workspace owner is emailed."
> — <https://www.agent37.com/docs/agents-api/billing#past-due-and-suspension> `docs-confirmed`
> "A request to a suspended instance's URL returns `402` with `{"error": "instance_suspended"}` instead of waking it, and suspended time is never billed."
> — <https://www.agent37.com/docs/agents-api/billing#past-due-and-suspension> `docs-confirmed`
> "An instance left suspended for 30 days is permanently deleted."
> — <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed`

**Boot hooks** — two scripts re-run installs after the OS layer is reset:

> "`~/.agent37/hooks/post-image-update.sh` … It gets up to 15 minutes"
> "`~/.agent37/hooks/post-restart.sh` … On every boot … It gets up to 5 minutes"
> — <https://www.agent37.com/docs/agents-api/instance-lifecycle> `docs-confirmed`

---

## 4. State tools: snapshots, fork, templates, volumes

### There is no "snapshot" product. Three different things do that job.

**(a) Sleep checkpoint — disk + memory, but not cloneable.**

> "the platform checkpoints it and `status` becomes `sleeping`: CPU and memory are released, the disk stays reserved"
> — <https://www.agent37.com/docs/agents-api/instance-auto-sleep> `docs-confirmed`

**(b) Backups — folder-scoped, in-place restore, free.**

> "Every instance's data (`/home/node`) is backed up nightly into seven rotating slots, so the last seven nights are available as restore points. You can also take a backup on demand, into a separate slot that only your next on-demand backup replaces. … Backups and restores are free."
> — <https://www.agent37.com/docs/agents-api/instance-backups> `docs-confirmed`

> "A backup is taken from the machine's disks, so it captures what your programs have written to disk, not what they are still holding in memory"
> — <https://www.agent37.com/docs/agents-api/vm-instances> `docs-confirmed`

**(c) Templates — the closest thing to an image.**

> "Registering a workspace template copies your image once into private storage and pins it by digest. That snapshot is what instances run"
> — <https://www.agent37.com/docs/agents-api/templates> `docs-confirmed`

**Fork: live, disk-only, source untouched.**

> "`POST /v1/instances/{id}/fork` copies an instance into a second instance: the same image and the same files, with its own id, URLs, starter credential, budget, and meter. The source keeps running throughout and is not touched."
> — <https://www.agent37.com/docs/agents-api/instances/fork> `docs-confirmed`

> "What is copied is the source's disk, not its memory: processes running in the source do not carry over, and the fork boots fresh with the same files."
> — <https://www.agent37.com/docs/agents-api/instances/fork> `docs-confirmed`

Fork can also change size, which makes it a clone-at-a-different-shape tool:

> "`resources` is the field that makes fork more than a copy: `cpu` and `memory` may move in either direction … `disk` can only match or grow"
> — <https://www.agent37.com/docs/agents-api/instances/fork> `docs-confirmed`

Fork requires the source to be `running`, `stopped`, or `sleeping` — not cold storage.

**Volumes: not offered.** No volume, shared-volume or FUSE product appears anywhere in the docs.
<https://battleships.dev/data/providers/agent-37.json> agrees (`volumes: false`, `volume_attach: false`, `volume_shared: false`) `third-party`.

**Resize is in-place and keeps id + URLs:**

> "Change an instance's CPU, memory, or disk while keeping its id and URLs."
> — <https://www.agent37.com/docs/agents-api/instances/resize> `docs-confirmed`

> "Disk only grows, as on every instance."
> — <https://www.agent37.com/docs/agents-api/vm-instances> `docs-confirmed`

**System template catalog (11):** `agent37-base`, `agent37-hermes`, `agent37-openclaw`,
`agent37-claude-code`, `agent37-codex`, `agent37-grok`, `agent37-opencode`, `agent37-pi`,
`agent37-n8n`, `agent37-ubuntu`, `agent37-android`.

> "`agent37-base` | A plain Linux sandbox: Node, Python, git, build tools, and a terminal. No agent. The default."
> — <https://www.agent37.com/docs/agents-api/templates> `docs-confirmed`

Templates are version-pinned and immutable, and every system template's Dockerfile is public:

> "Every release is an immutable dated tag, never republished, so a pin is a freeze."
> — <https://www.agent37.com/docs/agents-api/templates> `docs-confirmed`

> "Every system template is built from a public Dockerfile in [agent37-platform/templates]"
> — <https://www.agent37.com/docs/agents-api/templates> `docs-confirmed`

---

## 5. Machine sizes

**Four shapes on the `default` type.** 4 vCPU is the documented ceiling:

| vCPU | RAM | Disk range | Monthly price at default disk | Default disk | Source — verbatim published row |
|---|---|---|---|---|---|
| 2 | 4 GB | 2–12 GB | $4.76 | 4 GB | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — "2 vCPU / 4 GB RAM / 2-12 GB disk (the default) \| $4.76" |
| 4 | 8 GB | 2–20 GB | $9.34 | 6 GB | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — "4 vCPU / 8 GB RAM / 2-20 GB disk \| $9.34" |
| 4 | 16 GB | 2–40 GB | $15.48 | 12 GB | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — "4 vCPU / 16 GB RAM / 2-40 GB disk \| $15.48" |
| 4 | 32 GB | 2–80 GB | $27.76 | 24 GB | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — "4 vCPU / 32 GB RAM / 2-80 GB disk \| $27.76" |

> "4 vCPU is the ceiling on every instance type. A create that asks for more cores keeps the memory it asked for and comes back with 4 vCPU, at the price above, so a request for `{ "cpu": 16, "memory": 32 }` provisions 4 vCPU / 32 GB."
> — <https://www.agent37.com/docs/agents-api/instance-sizing> `docs-confirmed`

> "Disk is any whole number of GB within the shape's range and defaults to 4, 6, 12, or 24 GB by shape"
> — <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed`

**VM type prices the same shapes at 2.5× compute — and lists larger ones:**

| vCPU | RAM | Disk range | Disk used for price | Monthly price | Source — verbatim published row |
|---|---|---|---|---|---|
| 2 | 4 GB | 2–12 GB | 4 GB | $11.36 | <https://www.agent37.com/docs/agents-api/vm-instances#sizing-and-price> `docs-confirmed` — "2 \| 4 GB \| 2-12 GB \| 4 GB \| $11.36" |
| 4 | 8 GB | 2–20 GB | 6 GB | $22.54 | <https://www.agent37.com/docs/agents-api/vm-instances#sizing-and-price> `docs-confirmed` — "4 \| 8 GB \| 2-20 GB \| 6 GB \| $22.54" |
| 8 | 16 GB | 2–40 GB | 12 GB | $45.08 | <https://www.agent37.com/docs/agents-api/vm-instances#sizing-and-price> `docs-confirmed` — "8 \| 16 GB \| 2-40 GB \| 12 GB \| $45.08" |
| 16 | 32 GB | 2–80 GB | 24 GB | $90.16 | <https://www.agent37.com/docs/agents-api/vm-instances#sizing-and-price> `docs-confirmed` — "16 \| 32 GB \| 2-80 GB \| 24 GB \| $90.16" |

> "The same four [shapes], and compute meters at 2.5x the default rate … Disk is unchanged at $0.09 per GB per month."
> — <https://www.agent37.com/docs/agents-api/vm-instances> `docs-confirmed`

⚠️ **These two tables contradict each other on the vCPU ceiling.** The sizing page says 4 vCPU is the
ceiling "on every instance type" and that a 16/32 request becomes 4 vCPU; the VM page prices
8 vCPU/16 GB at $45.08 and 16 vCPU/32 GB at $90.16. See §14.

**Other size facts:**

- `performance` type: same shapes, 4× compute (<https://www.agent37.com/docs/agents-api/billing#default-and-performance-instances> `docs-confirmed`).
- `burstable` type: "pricing starting at $1/month", experimental, requires application and workspace enablement — **no published shapes or rates** (<https://www.agent37.com/docs/agents-api/billing#burstable-instances> `docs-confirmed`).
- GPU: **not offered / not published.** No GPU shape appears in any pricing table or docs page.
- CPU arch: `linux/amd64` only. No ARM (<https://www.agent37.com/docs/agents-api/custom-image> `docs-confirmed`).
- OS: Linux only. No Windows or macOS image is offered anywhere in the docs or pricing `not-published`.
- Regions: **3** — `us`, `eu` (France), `ap-south` (India, Mumbai), same price in all three.

> "Where the instance runs: `us`, `eu` (France), or `ap-south` (India, Mumbai). The price is the same in all three."
> — <https://www.agent37.com/docs/agents-api/instances/create> `docs-confirmed`

> "`us` is the only region that runs every instance type. `eu` and `ap-south` run VM and Performance instances"
> — <https://www.agent37.com/docs/agents-api/instances/create> `docs-confirmed`

Region is fixed for the instance's life; a resize cannot move it.

---

## 6. Networking

### Inbound

Every port gets a derivable HTTPS URL. There is no public IP.

> "An instance needs no public IP address. Every port it listens on has its own HTTPS URL, and the platform edge checks your key."
> — <https://www.agent37.com/docs/agents-api/urls> `docs-confirmed`

| URL form | Pattern | Auth | Source — verbatim quote |
|---|---|---|---|
| Instance URL | `https://{instanceId}.agent37.app` → template `default_port` | `X-Agent37-Key` header, or signed URL | <https://www.agent37.com/docs/agents-api/urls> `docs-confirmed` — "**Instance URL**: `https://{instanceId}.agent37.app`, the bare id." |
| Preview URL | `https://{instanceId}-{port}.agent37.app`, any port | same | <https://www.agent37.com/docs/agents-api/urls> `docs-confirmed` — "**Preview URL**: `https://{instanceId}-{port}.agent37.app`, for **any** port, no registration needed." |
| Public port | `https://{prefix}-{instanceId}.agent37.app` or random 20-char slug | **none** | <https://www.agent37.com/docs/agents-api/public-ports> `docs-confirmed` — "an HTTPS URL for one port of one instance that anyone can reach with no credential at all" |
| Custom domain | `https://{label}.yourdomain.com` mirrors all of the above | same as source | <https://www.agent37.com/docs/agents-api/domains> `docs-confirmed` — "Register `acme-agents.com` once, and every URL your workspace has also answers under it" |

> "**Instance URLs require auth on every request**: the `X-Agent37-Key` header for API calls, or a time-boxed signed URL to open a preview URL in a browser tab. An unauthenticated request gets a 401."
> — <https://www.agent37.com/docs/agents-api/concepts> `docs-confirmed`

**Signed URLs** are time-boxed browser links: `POST /v1/instances/{id}/signed-url` with
`{ "port": 9119, "ttl_seconds": 3600 }`. `docs-confirmed`

**Public ports are permanently unauthenticated** — the URL is the credential:

> "an HTTPS URL for one port of one instance that anyone can reach with no credential at all, and that keeps working until you delete it."
> — <https://www.agent37.com/docs/agents-api/public-ports> `docs-confirmed`

> "With no `prefix`, the hostname is a server-minted 20-character random slug: unguessable, so the URL itself is the only credential."
> — <https://www.agent37.com/docs/agents-api/public-ports> `docs-confirmed`

**Custom domains** require delegating a whole dedicated domain's nameservers; subdomains of an
existing domain cannot be registered. `docs-confirmed`

**Raw TCP inbound: not published.** Only HTTPS is documented; SSH is tunnelled over a WebSocket to
`{instanceId}-22022.agent37.app`, not a dialable port.

> "pipes the SSH byte stream over a WebSocket to `https://{instanceId}-22022.agent37.app`,"
> — <https://www.agent37.com/docs/agents-api/ssh#how-it-works> `docs-confirmed`
> "`ProxyCommand` is what carries the SSH stream (there is no port to dial directly)"
> — <https://www.agent37.com/docs/agents-api/ssh> `docs-confirmed`

The Android doc adds a concrete negative: the emulator's own WebRTC stream "needs UDP, which the
Agent37 edge does not carry" (`docs-confirmed`).

### Outbound

Three policies, changeable live, no restart:

| Value | Reaches |
|---|---|
| `"allow-all"` | "The whole public internet. The default." |
| `"deny-all"` | "Nothing, including DNS." |
| `{ "allow": [...] }` | "Only the listed IPv4 addresses and ranges, up to 100 entries." |

All three rows: <https://www.agent37.com/docs/agents-api/instance-network> `docs-confirmed`.

> "**DNS counts as a connection.** Under `deny-all` or a list, names do not resolve unless a resolver is on the list."
> — <https://www.agent37.com/docs/agents-api/instance-network> `docs-confirmed`

> "**Private ranges stay blocked.** Listing a private address (such as `10.0.0.0/8`) has no effect: an instance can never reach private networks, other instances, or the machine it runs on."
> — <https://www.agent37.com/docs/agents-api/instance-network> `docs-confirmed`

> "**Entries are IPv4 for now.** Domain names and IPv6 return `400 invalid_request`."
> — <https://www.agent37.com/docs/agents-api/instance-network> `docs-confirmed`

- **Static egress IP: not published.** No static or dedicated egress IP product appears.
- **Egress bandwidth charges: not published.** No per-GB transfer price appears on `/pricing`, in
  `billing`, or in the comparison table.
- Note the interaction: an allowlist instance cannot use the managed LLM/Brave/Composio services —
  "an instance under `deny-all` or a list cannot use them" (<https://www.agent37.com/docs/agents-api/instance-network> `docs-confirmed`).

### Secret / credential injection

**Per-instance managed credentials are injected at container create, not baked into the image:**

> "Every Agent37 instance boots with credentials already in its environment. Your image does not receive them from you, does not store them, and does not need to ask for them"
> — <https://www.agent37.com/docs/agents-api/managed-services> `docs-confirmed`

| Variable | Purpose | Source — verbatim published row |
|---|---|---|
| `AGENT37_MANAGED_TOKEN` | Per-instance token authorising all four managed services | <https://www.agent37.com/docs/agents-api/managed-services> `docs-confirmed` — "`AGENT37_MANAGED_TOKEN` \| A per-instance token" |
| `AGENT37_LLM_PROXY_URL` | LLM router base URL | <https://www.agent37.com/docs/agents-api/managed-services> `docs-confirmed` — "`AGENT37_LLM_PROXY_URL` \| `https://api.agent37.com/llm/v1`" |
| `AGENT37_BRAVE_PROXY_URL` | Brave Search | <https://www.agent37.com/docs/agents-api/managed-services> `docs-confirmed` — "`AGENT37_BRAVE_PROXY_URL` \| `https://api.agent37.com/search/brave`" |
| `AGENT37_COMPOSIO_MCP_URL` | Composio MCP | <https://www.agent37.com/docs/agents-api/managed-services> `docs-confirmed` — "`AGENT37_COMPOSIO_MCP_URL` \| `https://api.agent37.com/mcp/composio`" |
| `AGENT37_PERFLO_MCP_URL` | Perflo paid tools | <https://www.agent37.com/docs/agents-api/managed-services> `docs-confirmed` — "`AGENT37_PERFLO_MCP_URL` \| `https://api.agent37.com/mcp/perflo`" |
| `AGENT37_INSTANCE_ID` | Instance id | <https://www.agent37.com/docs/agents-api/managed-services> `docs-confirmed` — "`AGENT37_INSTANCE_ID` \| This instance's id" |

> "That token opens all four services. **This applies to any image**, including one you built yourself from scratch: the platform injects these at container create, not the image."
> — <https://www.agent37.com/docs/agents-api/managed-services> `docs-confirmed`

**But there is no general secret manager or secret proxy for arbitrary third-party APIs.**
<https://battleships.dev/data/providers/agent-37.json> marks `secret_proxy_any: false` `third-party`, and the docs only describe these four
managed services. User env vars are plaintext-ish: `env` on create, "Up to 64 entries and 64 KB in
total" (`docs-confirmed`).

The docs are explicit that env vars are readable by the agent — a real gotcha for multi-tenant
products:

> "Anything in an instance's environment, the agent can read and repeat back. When your users chat with their agents, a key in the environment is a key your users can take, so keep it on your server."
> — <https://www.agent37.com/docs/agents-api/browser-use> `docs-confirmed`

**API key scoping:** keys are per-workspace, with an optional IP allowlist of up to 20 IPs/CIDRs.
There is deliberately no key-minting endpoint.

> "A key can carry an **IP allowlist**: up to 20 IPs or CIDR ranges (IPv4 and IPv6), edited per key"
> — <https://www.agent37.com/docs/agents-api/concepts> `docs-confirmed`

---

## 7. Interfaces

| Interface | Available? | Source — verbatim quote |
|---|---|---|
| REST API | **Yes**, two planes: `api.agent37.com/v1` (Bearer) and `agent37.app` (`X-Agent37-Key`) | <https://www.agent37.com/docs/agents-api/concepts> `docs-confirmed` — "Both planes take the same `sk_live_` key, in two different headers." |
| Python SDK | **Yes** — one file, no package | <https://www.agent37.com/docs/python-sdk> `docs-confirmed` — "The Agent37 Python SDK is one file built on `requests`, with no package to install." |
| Node/TypeScript SDK | **No official package** | <https://www.agent37.com/docs/quickstart> `docs-confirmed` — "There is no SDK to install: the API is plain HTTPS and JSON, so the `requests` and `fetch` calls below are the Python and Node clients" |
| Go / Rust / Java SDK | `not-published` | No SDK for these languages appears anywhere in the docs (`not-published`) |
| CLI | **Yes**, `npx agent37` — `templates build`, `ssh setup`, `ssh`, `tunnel`, `cron` | <https://www.agent37.com/docs/agents-api/templates> `docs-confirmed` — "The supported path is the Agent37 CLI:" · <https://www.agent37.com/docs/agents-api/ssh> `docs-confirmed` — "`ssh setup` is a one-time step and safe to re-run." · <https://www.agent37.com/docs/agents-api/crons> `docs-confirmed` — "with the `agent37 cron` CLI baked into every Agent37 agent image" |
| MCP server (control plane) | **No** — nothing documented for creating or managing instances over MCP | No MCP server for the Sandbox API appears in the docs or the API reference (`not-published`) |
| MCP servers (as a client) | **Yes** — managed Composio and Perflo MCP endpoints | <https://www.agent37.com/docs/agents-api/managed-services> `docs-confirmed` — "Register Composio and Perflo with your MCP client." |
| SSH | **Yes** — root by default, `scp`/`sftp`/`-L` forwarding, VS Code Remote SSH | <https://www.agent37.com/docs/agents-api/ssh> `docs-confirmed` — "Open a real shell on an instance with your own SSH keypair: ssh, scp, sftp, port forwarding, and VS Code Remote SSH, on any template image." |
| Web terminal | **Yes** — a shell in the container on port `7681`, opened with a signed URL | <https://www.agent37.com/docs/agents-api/urls> `docs-confirmed` — "`7681` | `https://ab12cd34ef-7681.agent37.app` | A shell in the container (browser)" |
| Desktop / VNC | **Yes** — XFCE + Firefox on `6080` in `agent37-ubuntu`; noVNC on `6901` in the `hermes-vnc-desktop` recipe | <https://www.agent37.com/docs/agents-api/vm-instances> `docs-confirmed` — "plus an XFCE desktop with Firefox in the browser" · <https://www.agent37.com/docs/agents-api/desktop> `docs-confirmed` — "and [noVNC](https://github.com/novnc/noVNC) serving that screen on port `6901`" |
| Browser automation | **Yes** — headless Chromium and a browser tool in `agent37-hermes`; optional Browser Use Cloud for stealth, residential proxies and CAPTCHA | <https://www.agent37.com/docs/agents-api/desktop> `docs-confirmed` — "The stock `agent37-hermes` template includes a headless browser: the agent opens pages, clicks, fills forms, and reads what comes back." · <https://www.agent37.com/docs/agents-api/browser-use> `docs-confirmed` — "with its [stealth](https://docs.browser-use.com/cloud/browser/stealth) and [residential proxies](https://docs.browser-use.com/cloud/browser/proxies)" |
| Webhooks (outbound from platform) | `not-published` | No event-subscription or webhook-delivery API appears in the docs (`not-published`) |
| Webhooks (inbound to your app) | **Yes** — via public ports, and Hermes' own webhook subscriptions on `8644` | <https://www.agent37.com/docs/agents-api/public-ports> `docs-confirmed` — "The canonical use is webhooks." · <https://www.agent37.com/docs/agents-api/hermes-webhooks> `docs-confirmed` — "Hermes receives webhook events on port `8644`, which Agent37 keeps credential-protected by default." |
| Scheduled runs | **Yes** — platform crons that wake a sleeping instance | <https://www.agent37.com/docs/agents-api/crons> `docs-confirmed` — "A platform cron is outside the instance: it fires whether the instance is awake or asleep" |
| Usage API | **Yes** — `GET /v1/usage`, `GET /v1/instances/{id}/usage` | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — "`GET /v1/usage?from=YYYY-MM-DD&to=YYYY-MM-DD` returns everything the workspace spent, by UTC day, by instance, and by model" |
| Logs / metrics | **Yes** — `GET` logs, and CPU/memory/disk history | <https://www.agent37.com/docs/agents-api/logs> `docs-confirmed` — "Fetch an instance's boot and runtime logs from your backend to debug a container that will not start or crashed after booting." · <https://www.agent37.com/docs/agents-api/metrics> `docs-confirmed` — "Fetch an instance's CPU, memory, and disk history to see whether it is sized right, spot leaks, and know before it hits a limit." |

**Crons are a notable feature** — a scheduler that lives outside the instance, so it works while the
instance sleeps:

> "A crontab inside the container only runs while the container is running, so on an instance with auto-sleep it stops firing the moment the instance sleeps … A platform cron is outside the instance: it fires whether the instance is awake or asleep"
> — <https://www.agent37.com/docs/agents-api/crons> `docs-confirmed`

**Two API planes, two auth headers** — a detail that trips people up:

> "`api.agent37.com` takes `Authorization: Bearer sk_live_...`. Everything on `agent37.app` (instance URLs and `sandbox.agent37.app`) takes the raw key as `X-Agent37-Key: sk_live_...`, which leaves `Authorization` free for your own app running inside the instance."
> — <https://www.agent37.com/docs/agents-api/concepts> `docs-confirmed`

---

## 8. Agent features

**Preinstalled agent harnesses (6) plus 2 app/OS templates:**

| Template | Agent | Whose model account | Source — verbatim published row |
|---|---|---|---|
| `agent37-hermes` | Hermes | Agent37 managed model (or BYO) | <https://www.agent37.com/docs/agents-api/templates> `docs-confirmed` — "`agent37-hermes` \| Hermes, the general agent: chat, browsing, code, files." |
| `agent37-openclaw` | OpenClaw | Agent37 managed model (or BYO) | <https://www.agent37.com/docs/agents-api/templates> `docs-confirmed` — "`agent37-openclaw` \| OpenClaw, the general agent: chat, headless browsing, code, files." |
| `agent37-claude-code` | Claude Code | **Your Anthropic account** | <https://www.agent37.com/docs/agents-api/templates> `docs-confirmed` — "on your own Anthropic account: chat, code, files, shell. No browser or desktop." |
| `agent37-codex` | Codex | **Your OpenAI account** | <https://www.agent37.com/docs/agents-api/templates> `docs-confirmed` — "on your own OpenAI account: chat, code, files, shell. No browser or desktop." |
| `agent37-grok` | Grok | **Your xAI API key** | <https://www.agent37.com/docs/agents-api/templates> `docs-confirmed` — "on your own xAI API key: chat, code, files, shell. No browser or desktop." |
| `agent37-opencode` | OpenCode | Agent37 managed model out of the box | <https://www.agent37.com/docs/agents-api/templates> `docs-confirmed` — "on the managed model out of the box: chat, code, files, shell." |
| `agent37-pi` | Pi | Agent37 managed model out of the box | <https://www.agent37.com/docs/agents-api/templates> `docs-confirmed` — "Pi, the minimal open-source agent harness, on the managed model out of the box" |
| `agent37-n8n` | n8n (workflow app, no chat API) | managed model for AI nodes | <https://www.agent37.com/docs/agents-api/templates> `docs-confirmed` — "n8n, the workflow automation tool, on its own always-on instance … with the managed model ready for its AI nodes. Not an agent harness." |

> "`agent37-claude-code` runs on your own Anthropic account: connect it before the first chat turn"
> — <https://www.agent37.com/docs/agents-api/templates> `docs-confirmed`

> "Model usage on `agent37-claude-code` and `agent37-codex` is the exception: Claude Code runs on your own Anthropic account and Codex on your own OpenAI account, so Agent37 never supplies or bills their model spend."
> — <https://www.agent37.com/docs/agents-api/concepts> `docs-confirmed`

**Agent-run API (the "Agent API")** — inside your instance, on the default port:

| Endpoint | Purpose | Source — verbatim quote |
|---|---|---|
| `POST /v1/responses` | Run one agentic turn; `session_id` continues a thread | <https://www.agent37.com/docs/agents-api/chat> `docs-confirmed` — "Send a message or task to the agent on your instance. Omit `session_id` to start a conversation." |
| `GET /v1/responses/{id}/stream` | Reconnect a dropped SSE stream | <https://www.agent37.com/docs/agents-api/concepts> `docs-confirmed` — "reconnect a dropped stream with `GET /v1/responses/{id}/stream`" |
| `/v1/sessions` | List/read/rename/delete conversations | <https://www.agent37.com/docs/agents-api/sessions> `docs-confirmed` — "A session is one conversation on an instance. An instance holds many sessions, one per thread, and each session keeps its own full history" |
| `/v1/models` | Models the harness can run | <https://www.agent37.com/docs/agents-api/models> `docs-confirmed` — "The model is the LLM a turn runs on; the agent harness is the software driving it." |
| `/v1/files` | Browse, read, write, move, delete, download folders | <https://www.agent37.com/docs/agents-api/files> `docs-confirmed` — "Files live on the instance's disk. A file's absolute `path` is its identity" |
| `/v1/health`, `/v1/version` | Readiness and gateway build | <https://www.agent37.com/docs/agents-api/health> `docs-confirmed` — "Both endpoints live on the instance URL, not the Sandbox API" |

Source: <https://www.agent37.com/docs/agents-api/concepts> `docs-confirmed`

> "Omit `session_id` and the gateway mints a new session; the reply carries the `session_id` you reuse to continue the thread."
> — <https://www.agent37.com/docs/agents-api/concepts> `docs-confirmed`

**AI credential handling — three distinct modes:**

1. **Managed (default).** One per-instance token; LLM passed through at OpenRouter cost with no
   markup; metered to your wallet inside a per-instance budget.
   > "Agent37's LLM router uses OpenRouter and passes through the reported inference cost with **no Agent37 markup**."
   > — <https://www.agent37.com/docs/agents-api/managed-services> `docs-confirmed`
2. **Bring your own key.** Set `OPENAI_API_KEY`, `XAI_API_KEY`, `ANTHROPIC_API_KEY` etc. in `env`;
   provider bills you directly. "Yes, and that spend never touches your balance."
   (<https://www.agent37.com/cloud> FAQ, `pricing-page`)
3. **Subscription login.** Log in interactively through the instance terminal:
   > "The terminal on `7681` is where you run `claude auth login`"
   > "The terminal on `7681` is where you run `codex login --device-auth`"
   > — <https://www.agent37.com/docs/agents-api/urls> `docs-confirmed`

**Managed service rates** (billed to the same wallet, inside the instance budget):

| Service | Rate | Source — verbatim published row |
|---|---|---|
| Managed LLM | "OpenRouter inference cost, passed through with no Agent37 markup" | <https://www.agent37.com/docs/agents-api/budgets> `docs-confirmed` — "Managed LLM \| OpenRouter inference cost, passed through with no Agent37 markup" |
| Brave web search | "$0.005 per call (5,000 micros)" | <https://www.agent37.com/docs/agents-api/budgets> `docs-confirmed` — "Web search (Brave) \| $0.005 per call (5,000 micros)" |
| Composio | "$0.000114 per call (114 micros)" | <https://www.agent37.com/docs/agents-api/budgets> `docs-confirmed` — "Composio \| $0.000114 per call (114 micros)" |
| Perflo paid tools | "Reported charge, passed through with no markup; discovery is free" | <https://www.agent37.com/docs/agents-api/budgets> `docs-confirmed` — "Perflo paid tools \| Reported charge, passed through with no markup; discovery is free" |

> — <https://www.agent37.com/docs/agents-api/budgets> `docs-confirmed`

**A budget is a ceiling, not money:**

> "Budget figures are ceilings, not money. The workspace wallet is the only pot of dollars; raising a cap or topping up an instance moves no funds."
> — <https://www.agent37.com/docs/agents-api/budgets> `docs-confirmed`

Budgets default to **$0**, so managed calls are refused until you grant headroom. That is a common
first-run failure.

> "It defaults to $0, so managed calls are refused until you grant headroom."
> — <https://www.agent37.com/docs/agents-api/budgets#how-budgets-work> `docs-confirmed`

**Framework integrations documented:** OpenAI Agents API and Agents SDK, LangChain Deep Agents,
Cursor self-hosted machines, Claude Managed Agents, plus a LangChain package `langchain-agent37`.

> "Run Deep Agents shell commands and file operations in Agent37 sandboxes with the langchain-agent37 Python package."
> — <https://www.agent37.com/docs/agents-api/langchain> `docs-confirmed`

---

## 9. Accounts: orgs, keys, limits, audit, residency, SSO

| Topic | State | Source — verbatim quote |
|---|---|---|
| Account unit | **Workspace** — owns the keys, the wallet, every instance | <https://www.agent37.com/docs/agents-api/members> `docs-confirmed` — "A workspace is the account: it owns the API keys, the wallet, and every instance." |
| Teams | **Yes**, invite by email; roles `admin` / `user` | <https://www.agent37.com/docs/agents-api/members> `docs-confirmed` — "`admin` | Everything: instances, keys, billing, and the team." · "A workspace must keep at least one admin. Removing the last one returns `409`." |
| Invitations | Always required, must be accepted | <https://www.agent37.com/docs/agents-api/members> `docs-confirmed` — "There is no endpoint that writes a membership directly" |
| API key scopes | Per-workspace only; optional IP allowlist (≤20 IPs); **no sub-scopes** | <https://www.agent37.com/docs/agents-api/concepts> `docs-confirmed` — "each key is scoped to one workspace" · "A key can carry an **IP allowlist**: up to 20 IPs or CIDR ranges (IPv4 and IPv6), edited per key" |
| Key minting | **No endpoint** — dashboard only | <https://www.agent37.com/docs/agents-api/signup> `docs-confirmed` — "There is no endpoint that mints keys, on purpose" |
| Spend limits | Per-instance budget caps (monthly + one-time) + wallet balance | <https://www.agent37.com/docs/agents-api/budgets> `docs-confirmed` — "Each paid managed call is metered at cost against your workspace wallet, and a per-instance budget caps how much each instance can spend." · "a monthly cap that resets each UTC month plus optional one-time top-up headroom" |
| Instance limits | 1 → 10 → 50 → 200 by cumulative top-ups | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — "| Topped up at least once (any amount) | 10, all shapes |" · "| Top-ups total $250 or more | 200, all shapes |" |
| Audit log | `not-published` | No audit-log feature appears in the docs (`not-published`); battleships.dev records `audit_logs: null` (<https://battleships.dev/data/providers/agent-37.json> `third-party`) |
| SSO / SAML | `not-published` / not offered | `"sso": false` (<https://battleships.dev/data/providers/agent-37.json> `third-party`); no SSO page appears in the docs (`not-published`) |
| HIPAA | `not-published` / not offered | `"hipaa": false` (<https://battleships.dev/data/providers/agent-37.json> `third-party`); no BAA or HIPAA page appears in the docs (`not-published`) |
| Data residency | Compute + disk in the chosen region; **backups and control plane in the US** | <https://www.agent37.com/docs/agents-api/instances/create> `docs-confirmed` — "`eu` and `ap-south` run the instance, its disk, and everything your code writes to that disk in that region. Backups and the instance's own control-plane record (its id, shape, and status) are stored in the US" |
| SOC 2 | Type I; Type II in progress | <https://www.agent37.com/cloud> `pricing-page` — "SOC 2 Type I and readiness reports on request. CONTROLS MONITORED TYPE II IN PROGRESS SOC 2 TYPE I" |
| Trust center | <https://trust.agent37.com> | <https://www.agent37.com/cloud> `pricing-page` — "View Trust Center" (linked to `trust.agent37.com`) |

That quote is the clearest residency statement in the docs, and it rules out a clean EU-only posture.

Sources: <https://www.agent37.com/docs/agents-api/members>, `concepts`, `billing`, `instances/create` — `docs-confirmed`.

---

## 10. Pricing, exactly

### The model in plain words

You prepay into one wallet. Everything draws from it: sandbox compute, retained disk, and optional
managed model/search/tool usage. There is **no subscription, no plan fee, and no seat charge** on the
Cloud API. Compute is priced from the *shape you reserved*, not from CPU you actually used, and it
meters by the minute while the instance is awake. Disk meters from creation until deletion,
awake or asleep. Delete the instance and billing stops. The monthly figures on the pricing page are
just the per-minute rate × 730 hours; nothing is billed monthly.

> "You top up a prepaid balance and each sandbox spends it down per minute while it runs. No subscription, no plan fee, no minimum"
> — <https://www.agent37.com/cloud> `pricing-page`

> "The monthly price is the rate; the wallet is metered per minute (the monthly price divided by 730 hours, divided by 60)."
> — <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed`

### Every published Cloud price

| Item | Price | Unit | Source — verbatim quote |
|---|---|---|---|
| vCPU | **$0.80** | per vCPU per 730-hour month | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — "vCPU \| $0.80 per vCPU per month" |
| RAM | **$0.70** | per GB per 730-hour month | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — "RAM \| $0.70 per GB per month" |
| Disk | **$0.09** | per GB per 730-hour month | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — "Disk \| $0.09 per GB per month" |
| vCPU (per hour) | **$0.0011** | per vCPU-hour | <https://www.agent37.com/pricing> `pricing-page` — "vCPU $0.0011 per vCPU · hour" |
| RAM (per hour) | **$0.00096** | per GB-hour | <https://www.agent37.com/pricing> `pricing-page` — "Memory $0.00096 per GB · hour" |
| Disk (per hour) | **$0.00012** | per GB-hour | <https://www.agent37.com/pricing> `pricing-page` — "Disk $0.00012 per GB · hour" |
| `performance` compute | **4×** default | multiplier | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — "compute is 4x the default rate, and disk is unchanged" |
| `vm` compute | **2.5×** default | multiplier | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — "Its compute is 2.5x the default rate, and disk is unchanged." |
| `burstable` | **$1/month** starting | no published rates | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — "`burstable` is an experimental instance type for low average CPU and RAM usage, with pricing starting at $1/month." |
| Cold storage | **$0.03** | per GB per month, on compressed bytes | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — "Parked in cold storage \| $0.03 per GB per month, on the actual compressed bytes stored." |
| Backups | **free** | — | <https://www.agent37.com/docs/agents-api/instance-backups> `docs-confirmed` — "Backups and restores are free." |
| Brave search | **$0.005** | per call | <https://www.agent37.com/docs/agents-api/budgets> `docs-confirmed` — "Web search (Brave) \| $0.005 per call (5,000 micros)" |
| Composio | **$0.000114** | per call | <https://www.agent37.com/docs/agents-api/budgets> `docs-confirmed` — "Composio \| $0.000114 per call (114 micros)" |
| Managed LLM | OpenRouter cost | no markup | <https://www.agent37.com/docs/agents-api/budgets> `docs-confirmed` — "Managed LLM \| OpenRouter inference cost, passed through with no Agent37 markup" |
| Perflo | vendor charge | no markup | <https://www.agent37.com/docs/agents-api/budgets> `docs-confirmed` — "Perflo paid tools \| Reported charge, passed through with no markup; discovery is free" |
| Starter credit | **$5** | one-time, once per account and card | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — "Add a card from the billing page (nothing is charged) and your workspace gets a one-time $5 credit" |
| Top-up range | **$5 – $10,000** | per top-up | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — "Top-ups are $5 to $10,000 each, paid through Stripe." |

Sources: <https://www.agent37.com/pricing> `pricing-page`; <https://www.agent37.com/docs/agents-api/billing>, `budgets`, `managed-services` `docs-confirmed`.

### Billing meter, minimums, rounding

- **Granularity: one minute.** "metered per minute" throughout (<https://www.agent37.com/pricing> `pricing-page`).
- **No published minimum charge per instance.** The only floor is the create-time balance check.
- **Rounding:** whole minutes are billed "at every lifecycle transition and at least hourly":
  > "Whole minutes are billed at every lifecycle transition and at least hourly; you never see a per-minute charge on an API call."
  > — <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed`
- **Allocated, not consumed.** Billing is from `resources`, not CPU utilisation:
  > "Compute is priced from the instance's `resources`"
  > — <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed`
  > "An awake instance still pays compute even when its CPU is idle."
  > — <https://www.agent37.com/pricing> `pricing-page`
- **Create is free, but needs a day of balance:**
  > "`POST /v1/instances` requires the wallet to hold one day of the instance's running rate; below that, the create returns `402 insufficient_balance` and nothing is provisioned. Nothing is debited at create"
  > — <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed`

### What is charged in each state

| State | Compute | Disk | Source — verbatim quote |
|---|---|---|---|
| `running` | full rate | $0.09/GB-mo | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — "`running`, and the transitional states (`starting`, `restarting`, `updating`, `stopping`) \| The full compute rate, with auto-sleep on or off." |
| `starting`, `restarting`, `updating`, `stopping` | **full rate** | $0.09/GB-mo | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — same row as above: the transitional states bill "The full compute rate" |
| `sleeping`, `stopped`, `waking` | **$0** | $0.09/GB-mo | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — "`sleeping`, `stopped`, or `waking` \| The disk rate alone: $0.09 per reserved GB per month." |
| cold storage | **$0** | $0.03/GB-mo compressed | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — "Parked in cold storage \| $0.03 per GB per month, on the actual compressed bytes stored." |
| suspended (past due) | $0 | $0 | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — "suspended time is never billed" |
| deleted | $0 | $0 | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — "Deleting an instance settles its final minutes and ends billing." |
| backups | free | free | <https://www.agent37.com/docs/agents-api/instance-backups> `docs-confirmed` — "Backups and restores are free." |
| memory held in a sleep checkpoint | **not billed** | — | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — sleep bills "the disk rate alone"; no memory line appears in the metering table |

Note the last row: holding a memory image costs nothing extra. That is unusual and worth calling out.

### Plans / tiers (not subscriptions — instance caps)

| Workspace state | Instances | Shapes allowed | Source — verbatim published row |
|---|---|---|---|
| Free, before first top-up | **1** | 2 vCPU / 4 GB only | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — "Free (before your first top-up) \| 1, on the 2 vCPU / 4 GB shape" |
| Any top-up | **10** | all | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — "Topped up at least once (any amount) \| 10, all shapes" |
| $100 cumulative top-ups | **50** | all | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — "Top-ups total $100 or more \| 50, all shapes" |
| $250 cumulative top-ups | **200** | all | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — "Top-ups total $250 or more \| 200, all shapes" |

> "The cap counts every instance that is not deleted or `failed`, sleeping and stopped ones included"
> — <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed`

> "Need more than 200? Email vishnu@agent37.com or use the chat bubble in the dashboard."
> — <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed`

**Paid add-on:** "Performance account" — faster starts and wakes, priced per account, price `not-published`,
request via the billing page or the founder.

> "On a Performance account, new instances start faster and more consistently, and sleeping instances wake faster. It covers every instance in the workspace, on any tier, and is a paid add-on priced per account."
> — <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed`

### Free tier / credits

- **$5 one-time** starter credit, requires adding a card (nothing charged).
- Not available to workspaces created via `POST /v1/signup`.
- No recurring free allowance.
- Free tier is capped at one 2 vCPU/4 GB instance; VM and Performance need a funded workspace.

> "Add a card from the billing page (nothing is charged) and your workspace gets a one-time $5 credit … The credit is granted once per account and once per card, and only to a workspace that has not topped up yet; a workspace created by `POST /v1/signup` never receives it."
> — <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed`

### Prepaid wallet mechanics

- Automatic top-up is **on by default** after your first top-up: refill the same amount when the
  balance drops below half of it, minimum $3 threshold.
  > "a $25 top-up buys $25 again below $12.50"
- Failed auto-charge → auto top-up turns itself off and emails the owner.
- Negative balance → instances suspended, requests return 402, 30 days → permanent deletion.

### Extra charges: what exists and what does not

| Item | Charged? | Source — verbatim quote |
|---|---|---|
| Egress / bandwidth | **`not-published`** | No egress or transfer rate appears on <https://www.agent37.com/pricing> or in the billing docs (`not-published`) |
| Static / public IPv4 | **No product** | No IPv4 or static-IP product appears in the docs; "An instance needs no public IP address." (<https://www.agent37.com/docs/agents-api/urls> `docs-confirmed`) |
| Snapshots | **No snapshot product**; backups free; cold storage $0.03/GB-mo | <https://www.agent37.com/docs/agents-api/instance-backups> `docs-confirmed` — "Backups and restores are free." |
| Seats | **No** | <https://www.agent37.com/pricing> `pricing-page` — "No monthly plan fee or seat charge" |
| Custom domains | **`not-published`** | No domain price appears in the docs or on <https://www.agent37.com/pricing> (`not-published`) |
| Template builds | **`not-published`** — but they draw on the wallet | <https://www.agent37.com/docs/agents-api/signup> `docs-confirmed` — "cloud template builds and member invitations return `402 insufficient_balance`" |
| Model tokens | **Yes**, separately (or BYO keys) | <https://www.agent37.com/pricing> `pricing-page` — "Model and tool usage is separate." |
| Search / Composio / Perflo | **Yes**, per call | <https://www.agent37.com/docs/agents-api/budgets> `docs-confirmed` — "Web search (Brave) \| $0.005 per call (5,000 micros)" |

### Managed hosting prices (Line 2, separate product)

| Plan | Price/mo | vCPU | RAM | Storage | Included | Source — verbatim quote |
|---|---|---|---|---|---|---|
| Free | **$0** | 1 | 4 GB | 2 GB | $0.20 of default model; sleeps when idle; BYOK | <https://www.agent37.com/personal> `pricing-page` — "$0/mo" · "1 vCPU · 4 GB RAM · 2 GB storage" · "One agent, sleeps when idle" |
| Basic | **$3.99** | 1 | 4 GB | 8 GB | $1/mo AI credits; BYOK; all models; community support; messaging channels | <https://www.agent37.com/personal> `pricing-page` — "$3.99/mo" · "1 vCPU · 4 GB RAM · 8 GB storage" · "$1/mo in AI credits" · "Community support" |
| Plus | **$9.99** | 1 | 4 GB | 12 GB | Free models (GPT-6 Luna, DeepSeek V4.1 Flash, Mercury 2), reset every 5 h | <https://www.agent37.com/personal> `pricing-page` — "$9.99/mo" · "1 vCPU · 4 GB RAM · 12 GB storage" · "Free models: GPT-6 Luna, DeepSeek V4.1 Flash & Mercury 2" · "Free model usage resets every 5 hrs" |
| Pro | **$29.99** | 2 | 8 GB | 20 GB | Built-in Chromium browser; $5/mo AI credits; email/chat support | <https://www.agent37.com/personal> `pricing-page` — "$29.99/mo" · "2 vCPU · 8 GB RAM · 20 GB storage" · "Built-in browser (Chromium)" · "$5/mo in AI credits" · "Email/Chat support" |
| Max | **$99.99** | 4 | 16 GB | 40 GB | $20/mo AI credits; team management + roles; priority support; onboarding call | <https://www.agent37.com/personal> `pricing-page` — "$99.99/mo" · "4 vCPU · 16 GB RAM · 40 GB storage" · "$20/mo in AI credits" · "Team Management + roles" · "Priority Support" |

> "Free $0/mo … Basic $3.99/mo … Plus $9.99/mo … Pro $29.99/mo … Max $99.99/mo"
> — <https://www.agent37.com/personal> `pricing-page`

> "An agent left asleep for 30 days is removed, and we email you a week before."
> — <https://www.agent37.com/personal> `pricing-page`

---

## 11. Worked cost examples

All arithmetic uses only published rates. Per-minute and per-hour figures are derived exactly as the
docs specify — monthly rate ÷ 730 ÷ 60 — because that is the formula the provider bills with
(<https://www.agent37.com/docs/agents-api/billing> `docs-confirmed`). The pricing page's rounded
per-hour rates ($0.0011 / $0.00096 / $0.00012) give the same totals to the cent.

Derived per-minute unit rates:

- vCPU: $0.80 ÷ 730 ÷ 60 = **$0.0000182648** per vCPU-minute
- RAM: $0.70 ÷ 730 ÷ 60 = **$0.0000159817** per GB-minute
- Disk: $0.09 ÷ 730 ÷ 60 = **$0.0000020548** per GB-minute

### (A) 1,000 agent tasks/month, 10 min each, 2 vCPU / 4 GiB, deleted after each

The requested shape exists exactly (2 vCPU / 4 GB is the entry shape). Default disk 4 GB.

Per-task compute: 10 min × (2 × $0.0000182648 + 4 × $0.0000159817)
= 10 × ($0.0000365296 + $0.0000639268)
= 10 × $0.0001004564
= **$0.001004564**

Per-task disk (4 GB, held 10 min): 10 × 4 × $0.0000020548 = **$0.000082192**

| Line | Arithmetic | Cost |
|---|---|---|
| Compute | 1,000 × $0.001004564 | **$1.0046** |
| Disk | 1,000 × $0.000082192 | **$0.0822** |
| **Total** | | **≈ $1.09 / month** |

Notes that change the answer in practice:

- Boot/provisioning time is **not** billed ("the meter starts when the instance first reaches
  `running`"), so 10 minutes of *work* is 10 billed minutes only if the task runs continuously.
- Transitional states (`starting`, `stopping`) **are** billed at full rate, so short tasks pay a
  disproportionate share if create/stop takes minutes.
- Each create needs one day of balance in the wallet — for this shape 24 × ($0.00604 compute +
  $0.00049 disk) ≈ **$0.16**. That is a balance requirement, not a charge.
- 1,000 sequential tasks need only 1 instance slot, so the 10-instance cap is not a blocker. Running
  them concurrently at >10 at a time needs a $100 lifetime top-up for 50 slots.
- Excludes model tokens entirely. A 10-minute agent task is usually dominated by inference cost, not
  by $0.001 of compute.

### (B) One always-on dev box, 4 vCPU / 8 GiB / **50 GiB disk**, 730 h/month

⚠️ **This exact size is not orderable.** The 4 vCPU / 8 GB shape allows 2–20 GB of disk. 50 GB
requires the 4 vCPU / 32 GB shape, whose range is 2–80 GB. So there are two honest answers.

**B1 — as requested, at the nearest shape that permits 50 GB (4 vCPU / 32 GB):**

730 h is exactly one billing month, so the monthly rates apply without conversion.

| Line | Arithmetic | Cost |
|---|---|---|
| Compute | 4 × $0.80 + 32 × $0.70 = $3.20 + $22.40 | **$25.60** |
| Disk | 50 GB × $0.09 | **$4.50** |
| **Total** | | **$30.10 / month** |

This matches the vendor's own shape price exactly: 4/32 at its 24 GB default is $27.76, and
$27.76 + 26 GB × $0.09 = $30.10.

**B2 — keep 4 vCPU / 8 GB and cap disk at the 20 GB maximum:**

| Line | Arithmetic | Cost |
|---|---|---|
| Compute | 4 × $0.80 + 8 × $0.70 = $3.20 + $5.60 | **$8.80** |
| Disk | 20 GB × $0.09 | **$1.80** |
| **Total** | | **$10.60 / month** |

Again matching the table: 4/8 at its 6 GB default is $9.34, and $9.34 + 14 GB × $0.09 = $10.60.

**If a VM is required** (Docker, k3s, `/dev/kvm`), multiply compute by 2.5: B2 becomes
$22.00 + $1.80 = **$23.80/month**; B1 becomes $64.00 + $4.50 = **$68.50/month**. `inferred` — applies the published 2.5× VM multiplier (<https://www.agent37.com/docs/agents-api/vm-instances#sizing-and-price>) to the Standard rates (<https://www.agent37.com/pricing>).

### (C) One persistent box, 2 vCPU / 4 GiB / **20 GiB disk**, 3 h/day × 30 days, stopped otherwise

The brief's month is **30 days = 720 h**, not 730. Running time is 3 × 30 = **90 h**; stopped time is
720 − 90 = **630 h**. Disk is billed for all 720 h because the instance is retained the whole month.

⚠️ **20 GB is not orderable on 2 vCPU / 4 GB**, which caps at 12 GB. Two honest answers again.

**C1 — as close as 2 vCPU allows (2 vCPU / 4 GB / 12 GB disk):**

| Line | Arithmetic | Cost |
|---|---|---|
| Compute | 90 h × (2 × $0.0011 + 4 × $0.00096) = 90 × ($0.0022 + $0.00384) = 90 × $0.00604 | **$0.5436** |
| Disk | 12 GB × $0.09 × (720 ÷ 730) = 12 × $0.088767 | **$1.0652** |
| **Total** | | **≈ $1.61 / month** |

**C2 — if 20 GB of disk is a hard requirement (4 vCPU / 8 GB / 20 GB):**

| Line | Arithmetic | Cost |
|---|---|---|
| Compute | 90 h × (4 × $0.0011 + 8 × $0.00096) = 90 × $0.01208 | **$1.0872** |
| Disk | 20 GB × $0.09 × (720 ÷ 730) = 20 × $0.088767 | **$1.7753** |
| **Total** | | **≈ $2.86 / month** |

Note how the cost splits: at a 12.5% duty cycle (90 of 720 h), **disk is two-thirds of the bill** in
C1 ($1.07 of $1.61). If the same box were left running all 720 h instead, compute would be
720 × $0.0060274 = $4.3397 and the total **$5.40** — so `stop` saves about **$3.80/month** here,
which is the whole point of the stop/disk-only model.

**What is excluded from all three examples:** model tokens, Brave/Composio/Perflo calls, egress (no
published rate), custom domains (no published rate), template builds (no published rate), and taxes.

---

## 12. Same word, different meaning

These are the terms where reading Agent 37 as if it were E2B, Daytona or Modal will mislead you.

### "Pause" — Agent 37 has two different pauses, and they are not interchangeable

Most providers expose a single pause. Agent 37 has **`stop`** and **`sleep`**, with opposite memory behaviour (`inferred` — the competitor claim rests on the other provider profiles in this series, not on Agent 37 sources; the Agent 37 behaviour is quoted below):

> "Sleep and stop both release CPU and memory and bill disk alone. A sleeping instance keeps its memory and wakes on the next request; a stopped one loses its memory and stays down until `start`."
> — <https://www.agent37.com/docs/agents-api/instances/sleep> `docs-confirmed`

- **Practical consequence:** if you "pause" by calling `stop`, your agent loses every running process,
  open connection and in-memory session. If a competitor's "pause" preserves memory, you have just
  silently changed behaviour. Use `sleep` for pause-with-memory.
- **Second consequence:** `sleep` still wakes on *any* request to any URL. So a "paused" instance can
  be woken by a stray health check or bot. `stop` cannot. If you need "stay down", `stop` is the only
  option — and then you pay a fresh boot.

### "Snapshot" — there is no snapshot product; there are three unrelated things

| What competitors call a snapshot | What Agent 37 has | Difference that matters | Source — verbatim quote |
|---|---|---|---|
| Bootable disk image you can clone N times | **Template** (image pinned by digest) | Built at build time, not from a running instance | <https://www.agent37.com/docs/agents-api/templates> `docs-confirmed` — "Registering a workspace template copies your image once into private storage and pins it by digest." |
| Disk + memory image, restorable | **Sleep checkpoint** | Cannot be cloned, named, listed, or restored to a second instance | <https://www.agent37.com/docs/agents-api/instances/sleep> `docs-confirmed` — "Memory and running processes are saved, CPU and memory are released, the disk stays" |
| Point-in-time volume backup | **Backup** | Only `/home/node`, only 7 nightly + 1 on-demand, in-place restore only | <https://www.agent37.com/docs/agents-api/instance-backups> `docs-confirmed` — "Every instance's data (`/home/node`) is backed up nightly into seven rotating slots" |

> "Every instance's data (`/home/node`) is backed up nightly into seven rotating slots"
> — <https://www.agent37.com/docs/agents-api/instance-backups> `docs-confirmed`

**Practical consequence:** you cannot snapshot a configured instance and spin up ten clones from it.
You *can* `fork` a live instance (disk only), or build a template from a Dockerfile. The backup is
folder-scoped, so anything you installed outside `/home/node` is not in it — and a restore "replaces
the data it finds rather than merging into it".

### "Fork" — live, but disk-only

> "The source keeps running throughout and is not touched." … "What is copied is the source's disk, not its memory: processes running in the source do not carry over"
> — <https://www.agent37.com/docs/agents-api/instances/fork> `docs-confirmed`

**Practical consequence:** fork is a *live* operation (no pause needed, a genuine advantage), but it
is **not** a memory fork. Providers whose fork captures memory can resume a half-finished tool call
in the clone; here the clone boots fresh. `battleships.dev` records the same split: `fork_running:
true`, `memory_snapshot_fork: false` (<https://battleships.dev/data/providers/agent-37.json> `third-party`).

### "Persistent" — the whole disk, not one folder

> "The whole disk persists, like a VM. Files anywhere on the filesystem, installed packages, edited config, connected accounts: all of it survives `stop`, `start`, `restart`, and `resize`"
> — <https://www.agent37.com/docs/agents-api/instance-lifecycle> `docs-confirmed`

**Practical consequence** (`inferred`, comparing against the workspace-only persistence common in this
category): this is broader than providers that persist only a mounted workspace
directory. But it is narrower than it sounds in one place: `update` resets the OS layer, and writes
outside `/home/node` live on a separate 10 GB layer that is not part of your billed disk.

### "Instance" — a gVisor container, unless you say `vm`

Calling an Agent 37 instance a "sandbox" is accurate; calling it a VM is not, by default. The default
type cannot run Docker at all. This is the single biggest source of wrong expectations.

### "Template" — an image + a default port, not a config bundle

> "A template is a named image, plus (optionally) the port its main service listens on."
> — <https://www.agent37.com/docs/agents-api/templates> `docs-confirmed`

Registration **copies the image once** and pins it by digest, so re-pushing a tag does nothing until
you update the template. `docs-confirmed`

### "Budget" — a ceiling, not money

> "Budget figures are ceilings, not money."
> — <https://www.agent37.com/docs/agents-api/budgets> `docs-confirmed`

**Practical consequence:** a generous budget on an empty wallet still fails with
`insufficient_balance`. Two different 402 codes tell you which pot is empty.

### "Performance" — two unrelated products share the word

- **Performance instance** = dedicated cores for one instance, 4× compute.
- **Performance account** = a workspace add-on that speeds up starts and wakes, priced per account.

> "Performance accounts and Performance instances are separate"
> — <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed`

### "Region" — compute is local, backups are not

EU and India regions keep the instance and its disk local, but "Backups and the instance's own
control-plane record … are stored in the US" (<https://www.agent37.com/docs/agents-api/instances/create#request-body> `docs-confirmed`). A compliance-driven buyer who reads
"EU region" as "EU-only data" is wrong here.

### "Public port" — unauthenticated by design

> "anyone can reach with no credential at all … the URL itself is the only credential"
> — <https://www.agent37.com/docs/agents-api/public-ports> `docs-confirmed`

At most providers "expose a port" still means "behind your auth". Here a public port is genuinely
open, and the slug leaks like any URL.

### "Agent API" — runs inside your sandbox, not on the provider's fleet

Covered in §1. The agent loop is your compute; the provider supplies the machine, the harness image
and (optionally) the model gateway.

### "Scale to zero" — does not exist

A sleeping instance still bills disk at $0.09/GB-month. There is no state where an existing instance
costs nothing. Only `delete` reaches zero, and delete destroys the disk.

> "Stopping (or auto-sleep) releases CPU and RAM and keeps the disk, so parked time bills disk alone."
> — <https://www.agent37.com/docs/agents-api/billing#per-minute-metering> `docs-confirmed`
> "Deleting an instance settles the final window and billing stops."
> — <https://www.agent37.com/docs/agents-api/billing#per-minute-metering> `docs-confirmed`

---

## 13. Glossary candidates

Concepts a newcomer needs before the pricing makes sense:

1. **Sandbox / instance** — one persistent Linux computer, addressed by a 10-character id that is also
   its DNS label.
2. **Workspace** — the account. Owns the API keys, the wallet, and every instance. A person can be a
   member of one.
3. **Wallet** — one prepaid pot of money. Compute, disk and managed usage all draw from it.
4. **Micros** — money unit used in the API: USD × 1,000,000. `$1.00` = `1000000`.
5. **gVisor** — a user-space kernel that intercepts system calls, giving stronger isolation than a
   plain container but less capability than a VM. Why Docker does not work on the default type.
6. **VM instance** — `"type": "vm"`. Own kernel, `/dev/kvm`, Docker, k3s. 2.5× compute.
7. **Performance instance** — dedicated cores for one instance. 4× compute.
8. **Shape** — the vCPU / RAM / disk triple you reserve. You pay for the shape, not for usage.
9. **Template** — a named, digest-pinned image plus an optional default port.
10. **Default port** — the port the bare instance URL routes to (`3737` for agent templates).
11. **Instance URL** vs **preview URL** vs **public port** — three inbound URL kinds with three
    different auth models.
12. **Signed URL** — a time-boxed browser link (`?a37_token=...`) that substitutes for an API key.
13. **`exec`** — run a shell command inside the instance over HTTP. The escape hatch for everything
    the API does not wrap.
14. **Sleep vs stop** — pause keeping memory vs pause losing memory. The most consequential pair of
    words on the platform.
15. **Checkpoint** — the memory+disk image written when an instance sleeps.
16. **Cold storage** — a cheaper tier a long-idle sleeper is moved to ($0.03/GB-mo), woken by a
    rebuild rather than a restore.
17. **Auto-sleep / idle timeout** — opt-in checkpointing after N seconds with no bytes through any URL.
18. **Boot hook** — `~/.agent37/hooks/post-restart.sh` and `post-image-update.sh`, re-run on boot to
    reinstall what an image update wipes.
19. **Backup** — nightly folder-scoped restore point for `/home/node`, 7 rotating slots, free.
20. **Fork** — copy a live instance's disk into a new independent instance.
21. **Harness / agent** — the agent software installed by the template (Hermes, OpenClaw, Claude Code…).
22. **Gateway** — the service inside the instance on port 3737 that serves `/v1/responses`.
23. **Session vs response** — a conversation vs one agentic turn within it.
24. **Budget** — a per-instance spending ceiling for managed services, not money.
25. **Managed services** — the provider's LLM router, Brave search, Composio and Perflo, billed at cost.
26. **Managed token** (`AGENT37_MANAGED_TOKEN`) — per-instance credential that authorises managed spend.
27. **Day-of-balance check** — create requires 24 h of the instance's rate in the wallet but debits nothing.
28. **`past_due`** — the suspended-for-non-payment state.
29. **Cron (platform)** — a schedule that lives outside the instance and can wake it.
30. **Boot-time OS layer** — the separate 10 GB writable layer outside `/home/node`, reset by `update`.

---

## 14. Gaps, gotchas, contradictions

### Internal contradictions in the docs

1. **The vCPU ceiling.** "4 vCPU is the ceiling on every instance type" and `{ "cpu": 16, "memory": 32 }`
   "provisions 4 vCPU / 32 GB" (<https://www.agent37.com/docs/agents-api/instance-sizing> `docs-confirmed`). But the VM page prices
   **8 vCPU/16 GB at $45.08** and **16 vCPU/32 GB at $90.16** (<https://www.agent37.com/docs/agents-api/vm-instances#sizing-and-price>
   `docs-confirmed`). `inferred`: the 4-vCPU ceiling applies to `default` and `performance`, and the
   sizing page's blanket "every instance type" is stale — the two pages are both live and cannot both
   be read literally. A buyer sizing a VM cannot trust the sizing page.
2. **Starter credit history.** battleships.dev records a conflict: "Website advertises $5 starter
   credit but detailed billing docs say $1" (<https://battleships.dev/data/providers/agent-37.json> `third-party`). As of 2026-10-28 the billing docs
   say $5 (<https://www.agent37.com/docs/agents-api/billing#how-the-balance-works> `docs-confirmed`), so this appears resolved in the
   provider's favour — but it shows the number has moved.
3. **Snapshot modelling.** battleships.dev sets `snapshot: "mem"` and `snapshot_gib_month: 0.03`
   (<https://battleships.dev/data/providers/agent-37.json> `third-party`), while also recording `memory_snapshot_fork: false` and noting "No named-snapshot
   product documented." The $0.03 is cold storage, not a snapshot price; the `snapshot: mem` field refers to the sleep checkpoint, which is
   not a snapshot you can name, list or clone (`inferred` from the billing page's cold-storage row at
   <https://www.agent37.com/docs/agents-api/billing> and the absence of any snapshot resource in <https://www.agent37.com/docs/agents-api/overview>). Treat "Agent 37 has
   memory snapshots" as a modelling artefact, not a product.

### Discrepancies with battleships.dev

| Field | battleships.dev | Provider docs (2026-10-28) | Verdict | Source — verbatim quote |
|---|---|---|---|---|
| `regions` | `null` | `us`, `eu` (France), `ap-south` (India, Mumbai) | **battleships incomplete** | <https://battleships.dev/data/providers/agent-37.json> `third-party` — `"regions": null` · <https://www.agent37.com/docs/agents-api/instances/create> `docs-confirmed` — "Where the instance runs: `us`, `eu` (France), or `ap-south` (India, Mumbai)." |
| `egress_allowlist` | `false` | `{ "allow": [...] }`, up to 100 entries | **battleships wrong** — an IPv4 allowlist exists | <https://battleships.dev/data/providers/agent-37.json> `third-party` — `"egress_allowlist": false` · <https://www.agent37.com/docs/agents-api/instance-network> `docs-confirmed` — "Only the listed IPv4 addresses and ranges, up to 100 entries." |
| `vcpu_options` / `max_vcpu` | `[2,4,8,16]`, max 16 | 4 max on default; 16 on VM | matches VM, contradicts sizing page | <https://battleships.dev/data/providers/agent-37.json> `third-party` — `"vcpu_options": [ 2, 4, 8, 16 ]` · `"max_vcpu": 16` · <https://www.agent37.com/docs/agents-api/instance-sizing> `docs-confirmed` — "4 vCPU is the ceiling on every instance type." |
| `snapshot_gib_month` | `0.03` | backups free; $0.03 is cold storage | **conflated** | <https://battleships.dev/data/providers/agent-37.json> `third-party` — `"snapshot_gib_month": 0.03` · <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — "Parked in cold storage \| $0.03 per GB per month, on the actual compressed bytes stored." |
| `vm_isolation` | `false` (top level) | `"type": "vm"` is a full VM | true of the default type only | <https://battleships.dev/data/providers/agent-37.json> `third-party` — `"vm_isolation": false` · <https://www.agent37.com/docs/agents-api/vm-instances> `docs-confirmed` — "A `vm` instance is a full Linux virtual machine with its own kernel and KVM hardware virtualization." |
| `docker_inside` | `false` (top level) | true on `vm` | true of the default type only | <https://battleships.dev/data/providers/agent-37.json> `third-party` — `"docker_inside": false` · <https://www.agent37.com/docs/agents-api/vm-instances> `docs-confirmed` — "The default gVisor instance type cannot run a Docker daemon." |
| `sso`, `hipaa`, `audit_logs` | false / false / null | not documented | consistent | <https://battleships.dev/data/providers/agent-37.json> `third-party` — `"sso": false`, `"hipaa": false`, `"audit_logs": null`; no SSO, HIPAA or audit-log page in the docs (`not-published`) |
| `mcp_server` | `false` | no control-plane MCP; managed MCP servers as a client | consistent with a caveat | <https://battleships.dev/data/providers/agent-37.json> `third-party` — `"mcp_server": false` · <https://www.agent37.com/docs/agents-api/managed-services> `docs-confirmed` — "Register Composio and Perflo with your MCP client." |
| `secret_proxy_any` | `false` | only 4 managed services injected | consistent | <https://battleships.dev/data/providers/agent-37.json> `third-party` — `"secret_proxy_any": false` · <https://www.agent37.com/docs/agents-api/managed-services> `docs-confirmed` — "Every Agent37 instance boots with credentials already in its environment." |

### Unpublished facts (do not guess these)

- **Egress bandwidth price and any cap.** No rate, no free allowance, no overage policy published.
- **Maximum session length.** None published; the FAQ implies unlimited. Whether a host ever evicts a
  long-running instance is not documented.
- **Cold-create time** for a default instance.
- **Custom domain price.**
- **Template build price.**
- **`burstable` rates and shapes** beyond "starting at $1/month".
- **Performance account price.**
- **Concurrency/rate limits** on the API — only "One instance runs up to 48 commands at a time"
  (<https://www.agent37.com/docs/agents-api/exec> `docs-confirmed`) and
  "1 on-demand backup per instance per 15 min" (<https://battleships.dev/data/providers/agent-37.json> `third-party` for the latter) are stated.
- **Audit logs, SSO/SAML, HIPAA BAA.** None documented.
- **GPU.** None offered.
- **IPv6.** Outbound rules are IPv4-only.

### Gotchas that will bite in production

1. **Managed services are refused by default.** Budgets default to $0, so an agent's first model call
   fails until you raise `monthly_cap_micros` or `credit_micros`. Two different 402 codes.
2. **`deny-all` breaks the managed model.** The LLM router, Brave and Composio are reached over the
   internet; an allowlisted instance cannot use them. You must allowlist the router's addresses or
   bring your own keys.
3. **`deny-all` also breaks DNS** unless you allowlist a resolver.
4. **A silent open connection does not count as activity.** An instance whose idle timeout is shorter
   than its slowest request can be checkpointed mid-request. The docs recommend keeping
   `idle_timeout_seconds` ≥ your longest call; the 900 s default matches the 15-minute HTTP silence
   limit.
5. **Memory is not guaranteed across a wake.** A wake that has to rebuild (host move, cold storage,
   failed restore) boots fresh. "treat anything that must outlive a sleep as a file."
6. **The instance cap counts sleeping and stopped instances.** With one instance per end user, 200
   instances = 200 users, awake or not. Deleting is the only way to free a slot.
7. **Create needs a day of balance** but debits nothing — so a low wallet blocks *new* instances while
   existing ones keep running.
8. **`stop` discards the sleep checkpoint.** "Stopping a sleeper discards its checkpoint (the data
   stays)". If you stop a sleeping instance expecting to resume the memory, you lose it.
9. **Env vars are visible to the agent.** For multi-tenant products, never put your own provider keys
   in `env`; the docs say so explicitly and provide a broker pattern.
10. **`exec` output is capped at 512 KB per stream**, with the middle cut out — easy to miss when
    parsing build logs.
11. **`exec` timeouts do not stop the command.** A retry starts a second copy.
12. **Node's `fetch` cannot wait long enough** for slow `exec` calls (300 s cap, no keepalive by
    default); the docs recommend `http.request` with TCP keepalive or backgrounding the command.
13. **Disk only grows.** You cannot shrink an instance's disk; a smaller fork returns 400.
14. **`update` wipes everything outside `/home/node`**, and `apt-get` cannot go in a boot hook
    (hooks run as `node`, not root).
15. **Backups exclude anything outside `/home/node`.** A database installed to `/var/lib/...` is not
    backed up.
16. **VM backups are crash-consistent, not clean.** "a database is backed up the way pulling the power
    cord would leave it."
17. **Region is permanent.** No resize or move; you must create a new instance and copy data.
18. **`eu`/`ap-south` cannot run the default type** — they require `"type": "vm"` or `"performance"`,
    which costs 2.5× or 4×.
19. **No capacity fallback.** `503 no_capacity` rather than placing you elsewhere.
20. **The pricing comparison is self-serving.** `/pricing` compares 31 providers and concludes Agent 37
    is cheapest, but it compares *list rates at 100% CPU utilisation* against providers that meter
    actual CPU. For I/O-bound agent workloads the ranking can invert. The page does disclose this:
    "This compares prices, not throughput." (<https://www.agent37.com/pricing> `pricing-page`)

---

## 15. Non-technical usability

### Is there a web dashboard, or is it API-only?

**There is a real web dashboard, and the product is split between two.** The Cloud dashboard is at
`agent37.com/dashboard/cloud`; the personal-agent product is browser-managed and sold separately.

> "Mint keys in the dashboard, or get your first one with `POST /v1/signup`"
> — <https://www.agent37.com/docs/agents-api/concepts> `docs-confirmed`
> "Add funds at dashboard/cloud/billing, or call `POST /v1/billing/top-up`."
> — <https://www.agent37.com/docs/agents-api/billing#how-the-balance-works> `docs-confirmed`
> "Browser-managed personal plans have their own pricing."
> — <https://www.agent37.com/pricing> `pricing-page`

Documented dashboard surfaces for the Cloud API:

| Surface | Documented location | What it does | Source — verbatim quote |
|---|---|---|---|
| API keys | `dashboard/cloud/api-keys` | Mint keys, set IP allowlists | <https://www.agent37.com/docs/agents-api/concepts> `docs-confirmed` — "Mint keys in the dashboard" · "edited per key in the dashboard" |
| Billing / wallet | `dashboard/cloud/billing` | Top up, auto-top-up, ledger, spend breakdown, request a Performance account | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — "Add funds at dashboard/cloud/billing, or call `POST /v1/billing/top-up`." · "The ledger and the spend breakdown stay in the dashboard" |
| Team | **Team** tab | Invite/remove members, roles | <https://www.agent37.com/docs/agents-api/members> `docs-confirmed` — "The dashboard manages the same list under **Team**." |
| SSH access | `dashboard/cloud/settings#ssh-access` | List registered public keys | <https://www.agent37.com/docs/agents-api/ssh> `docs-confirmed` — "The dashboard lists the same keys under **Cloud API → Settings → SSH access**" |
| Metrics | instance **Metrics** tab | CPU, memory and disk charts | <https://www.agent37.com/docs/agents-api/metrics> `docs-confirmed` — "The same charts live in the dashboard on the instance's **Metrics** tab." |
| Support | dashboard chat bubble | Contact the team | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — "use the chat bubble in the dashboard" |

Sources: <https://www.agent37.com/docs/agents-api/concepts>, <https://www.agent37.com/docs/agents-api/billing>, <https://www.agent37.com/docs/agents-api/members>, <https://www.agent37.com/docs/agents-api/ssh>, <https://www.agent37.com/docs/agents-api/metrics> — `docs-confirmed`.

**What the dashboard does not obviously do:** the docs never describe clicking a button to *create* a
sandbox on the Cloud API. Every Cloud "create" path in the documentation is `POST /v1/instances`,
`npx agent37`, or a code snippet. The `/cloud` call to action is "Start free" → the dashboard, but the
documented instance-creation flow is programmatic. `inferred` — rests on the absence of any
click-to-create flow across every Cloud docs page I read (<https://www.agent37.com/docs/quickstart>, <https://www.agent37.com/docs/agents-api/instances/create>,
<https://www.agent37.com/docs>); it may exist in the UI undocumented.

> "There is no SDK to install: the API is plain HTTPS and JSON … Run these calls from your backend or terminal."
> — <https://www.agent37.com/docs/quickstart> `docs-confirmed`

### Can someone use it without writing code?

**On the managed-hosting line, yes — that is the entire product.**

> "Run OpenClaw, Hermes, Claude Code, Codex, OpenCode, or Grok around the clock. Yours is live in one click."
> — <https://www.agent37.com/personal> `pricing-page`

> "It lives on our machines, with a task board, web terminal, file browser, live desktop, and scheduled jobs, all in your browser."
> — <https://www.agent37.com/personal> `pricing-page`

The dashboard also exposes an in-browser shell and file browser, so post-setup work is click-driven:

> "`7681` | `https://ab12cd34ef-7681.agent37.app` | A shell in the container (browser)"
> "`8080` | `https://ab12cd34ef-8080.agent37.app` | File browser for the workspace (browser)"
> — <https://www.agent37.com/docs/agents-api/urls> `docs-confirmed`

**On the Cloud API line, no.** There are templates and one-call creation, but "one call" means an
HTTP request or a terminal command. The docs even ship prompts designed to be pasted into a coding
agent rather than instructions a person follows by hand:

> "Paste this into your coding agent … My key is in AGENT37_API_KEY."
> — repeated across <https://www.agent37.com/docs/agents-api/desktop>, `crons`, `managed-services` `docs-confirmed`

That pattern is a strong signal about the intended user: a developer, or a non-developer who has an
AI coding agent do the work.

### What does signup take?

| Path | Card? | Waitlist? | Source — verbatim quote |
|---|---|---|---|
| Cloud, via dashboard | **Yes** — card to unlock the $5 credit | None documented | <https://www.agent37.com/pricing> `pricing-page` — "Add a card to unlock the starter credit. No charge until you top up." |
| Cloud, via `POST /v1/signup` | No card at signup; wallet starts at $0 | None documented | <https://www.agent37.com/docs/agents-api/signup> `docs-confirmed` — "An account created by `POST /v1/signup` does not receive the one-time $5 starter credit." |
| Managed hosting, Free plan | **No card** | None documented | <https://www.agent37.com/personal> `pricing-page` — "No card needed. Cancel anytime." |

No waitlist or invite gate appears on any of the three pages above (`not-published`; absence across <https://www.agent37.com/pricing>, <https://www.agent37.com/personal> and <https://www.agent37.com/docs/agents-api/signup>).

> "New eligible accounts get $5 starter credit after adding a card. Adding the card does not charge it."
> — <https://www.agent37.com/pricing> `pricing-page`

> "No card needed. Cancel anytime."
> — <https://www.agent37.com/personal> `pricing-page`

> "An account created by `POST /v1/signup` does not receive the one-time $5 starter credit."
> — <https://www.agent37.com/docs/agents-api/signup> `docs-confirmed`

No waitlist and no invite requirement appears anywhere in the docs or on the product pages (`not-published`; absence across <https://www.agent37.com/pricing> and <https://www.agent37.com/personal>).

### Docs, support, status

- **Docs:** Mintlify-hosted, genuinely thorough — 60+ pages, full REST reference, runnable curl/Python/Node
  for every endpoint, and two machine-readable bundles (`llms.txt`, `llms-full.txt`) so an AI agent can
  read the whole thing. Quality is well above the category average for a company this young.
  > "Need the whole spec? Use the complete documentation" — <https://www.agent37.com/docs> `docs-confirmed`
- **Support:** unusually founder-led. Named email, dashboard chat bubble, and a booking link.
  > "Email vishnu@agent37.com or use the chat bubble in the dashboard."
  > — <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed`
  > "Talk to the founder" → `cal.com/vishnukool/30min` — <https://www.agent37.com/cloud> `pricing-page`
  Support tiers exist only on the consumer line: "Community support" (Basic), "Email/Chat support" (Pro),
  "Priority Support" (Max) — <https://www.agent37.com/personal> `pricing-page`.
- **Status page:** `status.agent37.com`, public, component-level, with three region components.
  > "All services are online"
  The components are listed as "Website and dashboard", "API", "Sandbox creation", "Sandbox URLs", "US",
"Europe" and "India", each followed by "100% uptime".
  > — <https://status.agent37.com> `docs-confirmed` (provider-owned status page, read 2026-10-28)
  It also shows a real incident — the headline "Temporary interruption to US sandboxes" and "Degraded for 21 minutes", dated Oct 20, 2026 — which is a good sign of honest reporting rather than a permanently green board (<https://status.agent37.com> `docs-confirmed`).
- **Trust center:** `trust.agent37.com`, linked from <https://www.agent37.com/cloud>. `pricing-page`

### What would trip up a non-engineer

1. **The vocabulary is developer-native.** "Instance", "template", "exec", "signed URL", "preview URL",
   "default port", "fork", "mount_path". Nothing on the Cloud pages explains these in plain language.
2. **The first step is a terminal.** Even the Quickstart's first instruction is to export an API key and
   run curl. No click-to-create path for a Cloud sandbox is documented anywhere (<https://www.agent37.com/docs/quickstart> `inferred`).
3. **Two dashboards and two products.** `agent37.com/pricing` is Cloud-only and links to
   `agent37.com/personal` for consumer plans. A newcomer who lands on `/pricing` looking for a personal
   agent will not find the $3.99 plan there — only a small "Looking for a personal agent?" link.
4. **The $5 credit needs a card.** "Free" on the Cloud side means free only after you enter payment details.
   The genuinely card-free option is the personal Free plan, a different product.
5. **Sleep vs stop is a billing decision disguised as a lifecycle decision.** A non-technical user who
   "stops" their box to save money also throws away the running agent's memory. Nothing in the UI
   vocabulary warns them.
6. **Disk is billed forever until you delete.** "Stopped" is not "free". A forgotten instance costs
   $0.36/month at the entry shape — small, but it never reaches zero on its own.
7. **Managed model calls fail silently-ish by default.** Budget starts at $0, so the first chat fails
   with a 402 unless someone sets a cap. That is a setup step with no obvious UI affordance described
   in the docs.
8. **Region choice is permanent** and, outside the US, forces the 2.5× VM type. A non-technical buyer
   picking "Europe" for privacy reasons gets a more expensive machine and US-stored backups.
9. **Instance caps are tied to lifetime spend, not a plan.** Wanting 11 sandboxes means topping up $100
   in total — a rule that is easy to miss and reads like an upsell.
10. **No phone support, no live chat SLA, one founder's email.** Fine at this stage; worth knowing before
    depending on it.

### Bottom line for this section

Agent 37 is two products with two very different usability profiles. **Managed hosting is genuinely
consumer-grade** — one click, no card on the free plan, a browser task board and desktop. **Agent37
Cloud is developer-grade** — excellent documentation, a dashboard for money and keys, but every path to
a running sandbox goes through an API call or a terminal. A non-engineer should be pointed at
`agent37.com/personal`, not at the Cloud API.

---

## 16. Research method and tool record

| Tool | Route | Result |
|---|---|---|
| Context.dev (`context` module) | `web_map` on `agent37.mintlify.app`; `web_scrape` on the docs entry page, docs pages and `/pricing` | **Succeeded.** Produced the full 22-page site map and clean markdown of the entry page and pricing page. |
| TinyFish | `TINYFISH_FETCH_URLS` via Composio | **Succeeded.** Used for `instance-auto-sleep`, `/pricing` (independent second read), `status.agent37.com`, `agents-api/signup`, `agents-api/crons`. |
| Firecrawl | `FIRECRAWL_CRAWL` via Composio | **Connected and active, but the crawl call timed out.** Not used for content. Docs coverage came from the provider's own `llms.txt` index instead, which is more complete than a 20-page crawl would have been. |
| Tavily | `TAVILY_MCP_TAVILY_SEARCH` via Composio | **Failed** — the tool returned `No active connection found for toolkit(s) 'tavily_mcp'` (tool error text, not a provider claim). Not used. |
| Exa | Composio | **No active connection.** Not used. |
| Parallel | Composio | **No active connection.** Not used. |
| `curl` (shell) | `llms-full.txt`, `battleships.dev` JSON + MD, `/personal`, `/cloud` HTML | **Succeeded.** `llms-full.txt` (787 KB) is the provider's own complete docs bundle and was the main quoting source. |

No new integrations were connected, and no provider account or sandbox was touched.

### Quote audit (2026-10-28)

Every quotation in this file was re-checked mechanically against the live source, after fetching each
cited docs page individually as `.md` and normalising markdown emphasis, backticks, link syntax and
quote punctuation on both sides.

| Result | Count |
|---|---|
| Quotations checked | **291** |
| Matched the cited page verbatim | **291** |
| Data rows in provider-claims tables carrying their own URL + quote (or an explicit `not-published`) | **183** |
| Data rows still without one | **0** |
| Corrected before publication | **18** (7 misattributed, 5 altered, 6 de-quoted) |
| Removed | 0 |

Two different checks were run, because the first one alone was not enough.

1. **Quote integrity** — every quotation that exists in the file matches the page it cites. This is the
   table above.
2. **Quote coverage** — every factual claim *has* a quotation and a URL. The first pass of this audit
   checked only the quotes that were already there, which meant a claim with no quote at all was
   invisible to it. A second, scripted pass now flags any data row in a provider-claims table that
   contains neither a verbatim quote nor an explicit `not-published`. That pass started at **127 rows
   without a quote** and ends at **0**.

The coverage pass added a `Source — verbatim quote` column to the tables in §1, §5, §6, §7, §8, §9,
§10, §12, §14 and §15, and inline quotes to the narrative gaps in §1, §3, §6, §8 and §15. Tables that
are deliberately left without quotes are the derived ones: the worked-cost arithmetic in §11 (computed
from the rates above it), the tag legend, and this method section.

What the audit corrected:

- **7 misattributions.** Four quotes were credited to the wrong page (the vCPU-ceiling sentence to
  `billing` instead of `instance-sizing`, the backups sentence to `vm-instances` instead of
  `instance-backups`, the resize description to `vm-instances` instead of `instances/resize`, the
  Claude Code sentence to `concepts` instead of `templates`). Two were credited to a docs page when
  they live on `/cloud` and `/personal`. One was credited to `custom-image` but appears on `templates`.
- **5 altered quotes.** One ended in a full stop where the source has a comma; one lower-cased the
  source's capital `A`; one truncated a parenthetical mid-clause; one spliced a field name to its
  description with an ellipsis; one joined three cells of a table row into a single "quote".
- **6 paraphrases that had been presented in quotation marks.** These were my own wording, not the
  provider's, and now appear unquoted with their status marked `inferred`.
- **Shorthand citations.** Table cells that cited a page by short name (`` `billing` ``,
  `` `instance-auto-sleep` `` and 24 others) now carry full URLs; 26 lines were rewritten by script and
  the remainder by hand. Every `docs-confirmed`, `pricing-page` and `third-party` claim in the file now
  has its own URL on the same or adjacent line, and a scripted check reports zero tagged claims
  without one.
- **1 double-tagged claim** (tagged `docs-confirmed` and `inferred` at once) retagged `not-published`.
- **1 wrong URL path** (`docs/agents-api/quickstart` → `docs/quickstart`). All 45 distinct
  `agent37.com` URLs cited now return HTTP 200.

One quotation is not from a provider source and cannot be verified against one: the Tavily failure
string is Composio's own tool error, and is labelled as such.

### Arithmetic recheck (2026-10-28)

Recomputed independently from the published rates on the basis the docs specify (monthly ÷ 730 ÷ 60).
Workload C was corrected: a 30-day month is **720 h**, not 730, so its retained-disk charge is
`disk × $0.09 × 720/730` rather than a full month.

| Workload | Before | After | Why |
|---|---|---|---|
| A — 1,000 × 10 min, 2 vCPU / 4 GB | $1.09 | **$1.09** | unchanged |
| B1 — 4 vCPU / 32 GB / 50 GB, 730 h | $30.14 | **$30.10** | 730 h is exactly one month, so the monthly rate applies directly; now matches the vendor's own shape price ($27.76 + 26 GB × $0.09) exactly |
| B2 — 4 vCPU / 8 GB / 20 GB, 730 h | $10.62 | **$10.60** | same basis; matches $9.34 + 14 GB × $0.09 |
| C1 — 2 vCPU / 4 GB / 12 GB, 90 of 720 h | $1.62 | **$1.61** | 720 h month, not 730 |
| C2 — 4 vCPU / 8 GB / 20 GB, 90 of 720 h | $2.89 | **$2.86** | 720 h month, not 730 |
| C1 if left running all month | $5.49 | **$5.40** | 720 h month |
| C1 saving from `stop` | $3.87 | **$3.80** | follows from the 720 h basis |
| VM variants of B | $23.85 / $68.59 | **$23.80 / $68.50** | 2.5× applied to the corrected Standard compute |


### Biggest open questions

1. **Does the Cloud dashboard let you create a sandbox by clicking?** The docs only ever show API/CLI
   creation. If it does not, "Cloud API" is unusable without code, which materially changes the
   non-technical verdict.
2. **What is the real vCPU ceiling?** The docs contradict themselves between the sizing page (4 vCPU,
   "every instance type") and the VM pricing table (16 vCPU). This affects every large-workload cost
   estimate.
3. **Is egress really free?** No egress rate is published anywhere. For an agent fleet that downloads
   dependencies and scrapes the web, that could be the largest unpriced line item.
4. **What happens to a running instance over weeks or months?** "Nothing times out" is a marketing
   claim; no maximum session length, eviction policy or maintenance-reboot policy is published.
5. **How reliable is the memory-preserving sleep in practice?** The docs hedge ("usually survives … not
   guaranteed") and fall back to a fresh boot on host moves. The practical wake rate for a multi-tenant
   fleet is the key number for anyone building "one sandbox per user" on this.

---

## 17. The company behind it

**At a glance**

| Question | Answer | Evidence — URL and verbatim quote |
|---|---|---|
| Legal entity | **Agent 37 Inc.** (also written Agent37.com Inc once) | <https://www.agent37.com/terms> `docs-confirmed` — "an agreement between you and Agent 37 Inc." |
| Where registered | **`not-published`** — New York law governs; state of incorporation unstated | No registry, company number or address anywhere on the site (`not-published`) |
| Founder / CEO | **Vishnu Krishnaprasad**, sole listed founder | <https://www.ycombinator.com/companies/agent-37> `third-party` — "Founder at Agent 37. Previously Senior Software Engineer at Amazon and Engineering Manager at Quantcast." |
| Founded | **2026** | <https://trust.agent37.com> `docs-confirmed` — "Founded in 2026" · <https://www.ycombinator.com/companies/agent-37> `third-party` — "Founded:2026" |
| Public launch | Launch HN post, roughly mid-October 2026 | <https://news.ycombinator.com/item?id=50059096> `third-party` — "Launch HN: Agent37 (YC F26) – Low-cost agent sandboxes for running agents" |
| Funding | **Y Combinator Fall 2026**; amount, round and other investors `not-published` | <https://www.ycombinator.com/companies/agent-37> `third-party` — "Batch:Fall 2026" |
| Parent / acquisitions | **None disclosed**; listed as Active and independent | <https://battleships.dev/data/providers/agent-37.json> `third-party` — "Ownership: independent" · <https://www.ycombinator.com/companies/agent-37> `third-party` — "Status:Active" |
| Headcount | **`not-published`** (YC's "0 employees" is an unfilled field) | <https://www.ycombinator.com/companies/agent-37> `third-party` — "Agent 37 has 0 employees based in New York City." |
| Status page | **Yes**, `status.agent37.com`; every component "100% uptime" over 30/60/90 days at check | <https://status.agent37.com> `docs-confirmed` — "All services are online" |
| SLA | **None.** No uptime commitment unless agreed in writing | <https://www.agent37.com/terms> `docs-confirmed` — "we do not promise a specific uptime level unless we have agreed to one with you in writing." |
| SOC 2 | **Type I on request under NDA; Type II in progress** — Trust Center lists SOC 2 as in progress | <https://www.agent37.com/privacy> `docs-confirmed` — "Our SOC 2 Type I report and our SOC 2 readiness report are available to prospective and current business customers on request under NDA. Our SOC 2 Type II is in progress" |
| ISO 27001 | **`not-published`** — appears nowhere on the site or Trust Center | Absent from terms, privacy, Trust Center, Cloud page and pricing page (`not-published`) |
| HIPAA | **`not-published`** — no BAA, no HIPAA page | Absent from all provider pages (`not-published`); battleships.dev records `"hipaa": false` (<https://battleships.dev/data/providers/agent-37.json> `third-party`) |
| Data deleted on cancellation | Cloud instances **7 days**; dashboard hosting **kept until you ask**; account **30 days** | <https://www.agent37.com/privacy> `docs-confirmed` — "Deleting an Agent 37 Cloud instance keeps a recovery copy for 7 days and then purges it permanently." |

### 17.1 Legal entity and registration

The contracting entity is a corporation named **Agent 37 Inc.**, and the contract is governed by New
York law.

> "These Terms of Service (the "Terms") are an agreement between you and Agent 37 Inc. ("Agent 37", "we", "us")."
> — <https://www.agent37.com/terms> `docs-confirmed`

> "These Terms are governed by the laws of the State of New York, without regard to its conflict of law rules. Disputes will be resolved in the state or federal courts located in New York, and both sides consent to their jurisdiction."
> — <https://www.agent37.com/terms> `docs-confirmed`

> "At Agent 37 Inc. ("Agent 37", "we", "our", or "us"), privacy is foundational to how we built our service."
> — <https://www.agent37.com/privacy> `docs-confirmed`

**Where it is registered is not published.** New York is the governing-law jurisdiction and the courts,
not necessarily the state of incorporation; nothing on the site, in the terms, in the privacy policy or
on the Trust Center states a state of incorporation, a company number, or a registered address. No
Delaware or New York registry record for "Agent 37 Inc." was retrievable from the open web
(`not-published`). A buyer who needs an entity number for procurement should ask for the certificate of
incorporation rather than inferring one from "Inc." or from New York law.

**The entity name is inconsistent inside the privacy policy.** Two forms appear:

> "Agent 37 (Agent37.com Inc) has appointed Data Protection Representative Limited (trading as DataRep) as its data protection representative in the EU/EEA, the United Kingdom, and Switzerland"
> — <https://www.agent37.com/privacy> `docs-confirmed`

The terms (§1) and the privacy policy (§1) both say "Agent 37 Inc.", while privacy §14 says
"Agent37.com Inc". Both cannot be the registered name. `inferred`: this is a drafting slip, most likely in the newer section, but it is the kind of slip
that stalls a vendor-onboarding review, so expect to have to resolve it with them.

**EU/UK representation exists**, which matters for GDPR buyers:

> "you can raise any data protection matter with us through DataRep at www.datarep.com/data-request, by email to datarequest@datarep.com (mentioning Agent37.com Inc in your message), or by post to DataRep, 77 Camden Street Lower, Dublin, D02 XE80, Ireland."
> — <https://www.agent37.com/privacy> `docs-confirmed`

Both legal documents are recent and dated:

> "Last updated: August 4, 2026"
> — <https://www.agent37.com/terms> `docs-confirmed`
> "Last updated: September 1, 2026"
> — <https://www.agent37.com/privacy> `docs-confirmed`

### 17.2 Founders and leadership

One founder is public: **Vishnu Krishnaprasad**, listed as Founder/CEO. No other executives, board or
advisers are published.

> "VISHNU KRISHNAPRASAD" / "Founder/CEO"
> — <https://www.ycombinator.com/companies/agent-37> `third-party`

> "Founder at Agent 37. Previously Senior Software Engineer at Amazon and Engineering Manager at Quantcast. Founded Real Voxel and Dota2Connect. Began career at ThoughtWorks, progressing from Application Developer to Senior Consultant. Master's in Information Science Management from Carnegie Mellon University."
> — <https://www.ycombinator.com/companies/agent-37> `third-party`

The founder is also the support escalation path and the sales contact, which tells you something about
the company's size (see §17.9):

> "Need more than 200? Email vishnu@agent37.com or use the chat bubble in the dashboard."
> — <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed`

> "Talk to the founder"
> — booking link `cal.com/vishnukool/30min`, <https://www.agent37.com/cloud> `pricing-page`
> — <https://www.agent37.com/cloud> `pricing-page`

`inferred`: a single named founder who is simultaneously CEO, the enterprise contact and the person
answering capacity requests is consistent with a very small team, and it is the main concentration risk
in this profile. There is no published second line of support.

### 17.3 Founding and launch

> "Founded in 2026"
> — <https://trust.agent37.com> `docs-confirmed`

> "Founded:2026" / "Batch:Fall 2026" / "Status:Active" / "Location:New York City, NY"
> — <https://www.ycombinator.com/companies/agent-37> `third-party`

The public launch was a Hacker News "Launch HN" post:

> "Launch HN: Agent37 (YC F26) – Low-cost agent sandboxes for running agents"
> — <https://news.ycombinator.com/item?id=50059096> `third-party`

HN displayed that post as "15 days ago" when checked on 2026-10-28, putting the launch in roughly
mid-October 2026 (`third-party`). **No exact incorporation date is published** (`not-published`); "2026"
is the finest granularity available, and the product is therefore only months old. That is the single
most important fact for a buyer weighing durability: every uptime and compliance claim in this profile
covers a very short operating history.

### 17.4 Funding and accelerators

**Accelerator: Y Combinator, Fall 2026 batch.** YC lists a primary partner.

> "Primary Partner:Andrew Miklas"
> — <https://www.ycombinator.com/companies/agent-37> `third-party`

**Amount raised, round type, valuation and any investors beyond YC are not published.** No funding
announcement, press release, SEC filing or Crunchbase figure was found. The only money publicly
associated with the company is YC's programme terms, which apply to every accepted company and are
**not** a disclosure of what Agent 37 raised:

> "We have a standard deal for every company that is accepted to Y Combinator. We invest $500,000, and our investment gives YC 7% of your company plus an incremental equity amount"
> — <https://www.ycombinator.com/deal> `third-party` (YC's standard programme terms, not Agent 37's round)

`inferred`: by accepting a standard YC deal the company has at least that programme investment, but the
actual cap table — including whether a priced round happened — is unknown. Do not quote "$500k raised"
as an Agent 37 fact; it is a programme default, not a disclosure.

Battleships.dev classifies the stage as pre-seed with low confidence, and says so explicitly:

> "Company is an active (current-batch) Y Combinator Fall 2026 company; YC provides a standard pre-seed deal to accepted startups, but no specific round amount, investors, or priced round was found publicly."
> — <https://battleships.dev/data/providers/agent-37.json> `third-party`

That matches what I found independently, and it is the correct way to read it: **pre-seed by inference,
not by disclosure** (`inferred`).

### 17.5 Ownership, acquisitions and parent companies

**Nothing published.** There is no mention of a parent company, subsidiary, merger, acquisition or
ownership change in the terms, the privacy policy, the Trust Center or the YC listing. YC lists the
company as Active and independent.

> "Status:Active"
> — <https://www.ycombinator.com/companies/agent-37> `third-party`

battleships.dev records the ownership as independent, sourced to the same YC page:

> "Ownership: independent"
> — <https://battleships.dev/data/providers/agent-37.md> `third-party`

`not-published`: no cap table, no parent, no acquisition history. For a company this young that is
expected rather than suspicious, but it means there is no published change-of-control clause to review
either — the terms contain none (`not-published`).

### 17.6 Headcount

**Not published.** YC's page carries a machine-generated line that says zero employees:

> "Cloud Sandbox for Agents. Founded in 2026 by VISHNU KRISHNAPRASAD, Agent 37 has 0 employees based in New York City."
> — <https://www.ycombinator.com/companies/agent-37> `third-party`

That is almost certainly an unfilled YC profile field rather than a literal headcount — the company
clearly has at least its founder, and the site claims named customers and case studies. `inferred`: the
true number is small (single digits), but **no reliable headcount figure is published** (`not-published`).

### 17.7 Status page and recent uptime

There is a public, component-level status page at `status.agent37.com`, with separate components for the
website/dashboard, the API, sandbox creation, sandbox URLs, and three regions.

> "All services are online"
> — <https://status.agent37.com> `docs-confirmed` (provider-owned, checked 2026-10-28)

The components are listed as "Website and dashboard", "API", "Sandbox creation", "Sandbox URLs", "US",
"Europe" and "India", each followed by "100% uptime"
> — <https://status.agent37.com> `docs-confirmed`

So the **recent uptime figure is 100%** across every component over the 30-, 60- and 90-day windows
displayed at the time of checking. That is a real figure, but it covers a company founded in 2026 — the
window is short, and a 90-day 100% record on a few months of operation carries much less weight than the
same number on a multi-year service.

One incident is visible, and it is worth noting that the US component shows both "100% uptime" and a
degraded period, which is internally inconsistent:

> "Temporary interruption to US sandboxes" / "Degraded for 21 minutes" / "Oct 20, 2026"
> — <https://status.agent37.com> `docs-confirmed`

`inferred`: the "100%" appears to be a rounded or since-reset figure rather than a strict 90-day
calculation, because a 21-minute degradation in a 90-day window is about 99.98%, not 100%. Treat the
status page as directional evidence of intent to be transparent, not as an audited uptime record.

### 17.8 SLA

**There is no SLA.** The terms disclaim any uptime commitment unless one is separately negotiated.

> "We work hard to keep the Service up, but we do not promise a specific uptime level unless we have agreed to one with you in writing."
> — <https://www.agent37.com/terms> `docs-confirmed`

> "The Service is provided "as is" and "as available". To the fullest extent permitted by law, we disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement."
> — <https://www.agent37.com/terms> `docs-confirmed`

No service-credit schedule, no uptime target, and no remedy for downtime is published on any plan —
Cloud or managed hosting (`not-published`). Liability is capped, which compounds the absence of an SLA:

> "Our total liability for all claims arising out of the Service is limited to the amounts you paid us in the twelve months before the event giving rise to the claim, or one hundred US dollars if you have paid us nothing."
> — <https://www.agent37.com/terms> `docs-confirmed`

`inferred`: for a buyer whose product depends on this, the practical ceiling on what you can recover is
one year of fees, and the contract does not promise the service will be up. If you need an SLA you have
to negotiate one in writing, and the terms explicitly leave that door open.

### 17.9 Support channels

| Channel | Detail | Source — verbatim quote |
|---|---|---|
| General email | `info@agent37.com` — terms contact, security reports, account deletion, publicity opt-out | <https://www.agent37.com/terms> `docs-confirmed` — "Questions about these Terms? Email info@agent37.com." |
| Founder email | `vishnu@agent37.com` — capacity, compliance/residency questions, Performance accounts | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — "Need more than 200? Email vishnu@agent37.com or use the chat bubble in the dashboard." |
| In-dashboard chat | Chat bubble in the dashboard | <https://www.agent37.com/docs/agents-api/billing> `docs-confirmed` — "use the chat bubble in the dashboard" |
| Booking link | 30-minute call with the founder | <https://www.agent37.com/cloud> `pricing-page` — "Talk to the founder" |
| Status page | Public incident history | <https://status.agent37.com> `docs-confirmed` — "All services are online" |
| Trust Center | Compliance documents behind an access request | <https://www.agent37.com/privacy> `docs-confirmed` — "To request either report, email info@agent37.com or see our Trust Center." |

**Paid support tiers exist only on the consumer line**, not on the Cloud API:

> "Community support"
> "Email/Chat support"
> "Priority Support"
> — Basic, Pro and Max respectively, <https://www.agent37.com/personal> `pricing-page`

`not-published`: no support SLA, no response-time targets, no phone line, no ticketing portal, no
published support hours (`not-published`). `inferred`: support on the Cloud API is effectively
best-effort email and a founder's inbox, which is workable at this stage and a real risk if you build
a product with paying end users on it.

### 17.10 Security and compliance claims

**SOC 2 is claimed, but the two sources disagree on its status.** The privacy policy says Type I is
available now and Type II is in progress:

> "Our SOC 2 Type I report and our SOC 2 readiness report are available to prospective and current business customers on request under NDA. Our SOC 2 Type II is in progress, and our controls are monitored continuously."
> — <https://www.agent37.com/privacy> `docs-confirmed`

The Trust Center lists SOC 2 as merely "In progress":

> "SOC 2" / "In progress"
> — <https://trust.agent37.com/compliance> `docs-confirmed`

And the marketing page states it as achieved:

> "SOC 2 Type I and readiness reports on request. CONTROLS MONITORED TYPE II IN PROGRESS SOC 2 TYPE I"
> — <https://www.agent37.com/cloud> `pricing-page`

`inferred`: the most consistent reading is that **SOC 2 Type I is complete and Type II is not**, and the
Trust Center's single "In progress" row is a coarse status covering the Type II work. A buyer who needs
the report should request it under NDA rather than rely on any of the three public statements, and
should ask specifically which period the Type II covers, if any.

**GDPR is also listed as in progress**, alongside SOC 2, and those are the only two frameworks on the
Trust Center:

> "Compliances (2)" / "GDPR" / "In progress"
> — <https://trust.agent37.com/compliance> `docs-confirmed`

**ISO 27001 is not claimed anywhere.** It does not appear in the terms, the privacy policy, the Trust
Center, the Cloud page or the pricing page (`not-published`).

**HIPAA is not claimed anywhere.** There is no BAA, no HIPAA page and no mention of protected health
information (`not-published`). battleships.dev independently records `hipaa: false`:

> "hipaa": false
> — <https://battleships.dev/data/providers/agent-37.json> `third-party`

**No DPA is published.** Neither the terms nor the privacy policy offers or links a data processing
agreement (`not-published`). An independent third-party review reached the same conclusion:

> "Agent 37 Inc.; New York law; an EU representative (DataRep, Dublin) privacy policy of 1 Sep 2026; no DPA; SOC 2 Type I; a third-party list, not a sub-processor list"
> — <https://aplite.ai/blog/openclaw-hosting-eu-gdpr> `third-party`

That third-party line also corroborates the DataRep appointment, the New York governing law and the
1 September 2026 privacy policy date, which I verified independently from the primary documents.

**Encryption and isolation claims:**

> "Your data is encrypted in transit (TLS 1.2 or better). Backups and account data are encrypted at rest (AES-256), and Agent 37 Cloud instance storage runs with volume-level encryption on infrastructure we operate."
> — <https://www.agent37.com/terms> `docs-confirmed`

> "Every sandbox is enforced by gVisor, with its own filesystem and a hard disk quota. Tenants can never see each other."
> — <https://www.agent37.com/cloud> `pricing-page`

**Notable supply-chain detail:** the privacy policy names its subprocessors, and one of them is a
competitor in this comparison:

> "Daytona. Throwaway sandboxes that run cloud template builds and image imports."
> — <https://www.agent37.com/privacy> `docs-confirmed`

`inferred`: template builds and image imports run on Daytona, not on Agent 37's own infrastructure. That
is worth knowing if you care about where build-time code executes, and it means a Daytona outage could
affect image builds even while your instances stay up.

The full subprocessor list on the same page names Firebase, Stripe, Cloudflare, Vercel, GitHub, Resend
and Google Workspace, PostHog, Composio, LLM and search providers (OpenRouter, Brave), Daytona, Grafana
Cloud, and unnamed "Cloud infrastructure providers" (`docs-confirmed`).

### 17.11 Terms that matter to a buyer

**Data deletion — three different clocks, and one that never starts on its own.**

| What you delete | What happens | Source — verbatim quote |
|---|---|---|
| An Agent 37 Cloud instance | Recovery copy kept **7 days**, then purged | <https://www.agent37.com/privacy> `docs-confirmed` — "Deleting an Agent 37 Cloud instance keeps a recovery copy for 7 days and then purges it permanently." |
| A dashboard-hosting instance | **Kept indefinitely** so support can restore it; you must email to remove it sooner | <https://www.agent37.com/privacy> `docs-confirmed` — "Deleting a dashboard hosting instance keeps its data so support can restore it; email us to have it removed sooner." |
| Your whole account | Deleted within **30 days** | <https://www.agent37.com/privacy> `docs-confirmed` — "Upon account deletion request, all associated data, including your instances and any stored configuration, is permanently deleted within 30 days, except records we are required to keep for legal, tax, or accounting purposes." |
| Billing records | Kept **~7 years** | <https://www.agent37.com/privacy> `docs-confirmed` — "Billing records. Kept for as long as legal, tax, and accounting rules require, typically seven years." |
| Request/operational logs | Rolling **30 days** | <https://www.agent37.com/privacy> `docs-confirmed` — "Request and operational logs. Kept on a rolling window, currently up to 30 days, then deleted automatically." |

⚠️ **The dashboard-hosting row is a real gotcha.** On the consumer product, deleting an agent does not
delete its data — it is retained so support can restore it, and removal requires an email. Anyone
deleting an agent because it holds sensitive material needs to know that. The Cloud API behaves the way
you would expect (7-day recovery, then purge).

**Price changes: notice promised, period not specified.**

> "Prices may change; we will give notice before a change affects what you already pay."
> — <https://www.agent37.com/terms> `docs-confirmed`

`not-published`: no notice period (30 days, 60 days, etc.) is stated, and no cap on increases. `inferred`:
"notice before a change affects what you already pay" is a commitment to warn you, not a commitment to
any particular length of warning, so a short notice period would satisfy the letter of the clause.

**Terms changes: same pattern.**

> "We may update these Terms from time to time. If a change is material, we will give you notice, such as by email or in the dashboard, before it takes effect."
> — <https://www.agent37.com/terms> `docs-confirmed`

**Cancellation and refunds.** Subscriptions cancel at period end; the first month is refundable.

> "Cancellation takes effect at the end of the current billing period."
> — <https://www.agent37.com/terms> `docs-confirmed`

> "If you are not satisfied during your first month on a subscription, contact us before your second billing cycle and we will refund it in full, no questions asked."
> — <https://www.agent37.com/terms> `docs-confirmed`

> "Otherwise, and except where the law requires more, fees and prepaid top-ups are non-refundable."
> — <https://www.agent37.com/terms> `docs-confirmed`

**Prepaid balance is not refundable**, which is worth flagging separately because the Cloud API is
prepaid: unused wallet credit is money you have already committed. `inferred`: the first-month refund
applies to "a subscription", i.e. the managed-hosting plans, not to Cloud top-ups.

**Termination and what survives it.**

> "After termination, we delete your data as described in our Privacy Policy."
> — <https://www.agent37.com/terms> `docs-confirmed`

**Publicity rights are opt-out, not opt-in.** By default the provider may use your name and logo:

> "You grant us the right to use your name and logo to identify you as a customer on our website and in our marketing materials. You can opt out at any time by emailing info@agent37.com, and we will stop within a reasonable period."
> — <https://www.agent37.com/terms> `docs-confirmed`

`inferred`: if you are building a white-label product, check this before you launch — your customers
could appear in Agent 37's marketing, and the opt-out is a manual email rather than a dashboard toggle.

**Acceptable-use restrictions that can bite agent builders:**

> "mine cryptocurrency;"
> — <https://www.agent37.com/terms> `docs-confirmed`

> "resell bare access to the Service as if it were your own hosting platform, without a written agreement with us. Building the Service into your own product, as described in section 6, is expected and welcome."
> — <https://www.agent37.com/terms> `docs-confirmed`

`inferred`: reselling raw sandboxes is prohibited without a written agreement, while building a product
on top is explicitly allowed. If your business model is cheaper rebranded sandboxes, this clause is the one that decides whether you
are a customer or a breach.

**No data-residency guarantee in the contract.** The docs say EU and India instances keep compute and
disk local but store backups and control-plane records in the US (§9), and the terms contain no
residency commitment at all (`not-published`). For a GDPR-driven buyer, that plus the absence of a DPA
is the main gap.

### 17.12 What stays not-published

Everything below could not be established from primary sources, and is left open rather than guessed:

- **State of incorporation, company number, registered address.** "Agent 37 Inc." is named; the jurisdiction is not. No Delaware or New York registry record was retrievable.
- **Exact incorporation date.** Only "2026" is published.
- **Funding amount, round type, valuation, lead investor.** Only the YC batch is public; YC's $500k standard deal is programme terms, not this company's round.
- **Cap table and any investors beyond YC.**
- **Ownership changes, acquisitions, parent company, change-of-control terms.** None disclosed; the terms contain no change-of-control clause.
- **Headcount.** YC's "0 employees" is an unfilled field, not a real number.
- **SLA, uptime commitment, service credits.** Explicitly disclaimed unless negotiated in writing.
- **Support response times, support hours, ticketing system.**
- **ISO 27001.** Not claimed.
- **HIPAA / BAA.** Not claimed.
- **A published DPA.** None offered on the site.
- **Price-change notice period.** A notice is promised; its length is not stated.
- **Data residency commitment in the contract.** Stated in docs, absent from the terms.


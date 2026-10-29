# Use-case guides: research notes

Research date: 2026-10-29. Desk research only; no account, sandbox, or purchase was used. Every factual claim below carries a source URL and an exact quote copied from the page. Where a page did not state something, the note says **not found** rather than guessing. Statements that combine sources or reason from them are marked **inferred**.

Prices are published list prices in USD on 2026-10-29 and can change. Battleships is a secondary source: it is built by the boat.dev team, and its numbers are used only for the workload shape and duty cycle, not as vendor documentation.

> "Built by the boat.dev team; boat.dev is held to the same rules as everyone."
> — [Battleships guide for agents](https://battleships.dev/llms.txt)

## How to read the numbers

- **Minimum** is the smallest published configuration in which the software is documented to run. It is not a recommendation.
- **Recommended** is the vendor's own recommendation, or the smallest shape that avoids a known constraint (for example, Hermes says browser tools need at least 2 GB).
- **Duty cycle** is Battleships' `cpuUtil`, the share of running time the CPU is busy on average. It is a modelled average for a preset, not a measurement of your workload. Battleships also publishes `idleShare`, but its public guide does not define that field, so this document does not interpret it.
- **Machine-hours** are one machine running for one hour. For bursty workloads this is not the same as wall-clock hours: 333 machine-hours at 10 concurrent machines is about 33 wall-clock hours.

Battleships defines its workload fields as: "Fields: sessions a month, minutes per session, machines at once, machines on 24/7, CPU/RAM busy share (0-1), GiB kept, GiB egress." — [Battleships guide for agents](https://battleships.dev/llms.txt)

---

## 1. Hermes Agent (NousResearch/hermes-agent)

### What it is

Hermes Agent is an open-source (MIT) personal AI agent built by Nous Research. It runs on a server you control, talks to you through chat apps, keeps memory across sessions, and writes reusable skills from its own experience.

> "MIT license"
> — [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

> "Run it on a $5 VPS, a GPU cluster, or serverless infrastructure that costs nearly nothing when idle. It's not tied to your laptop — talk to it from Telegram while it works on a cloud VM."
> — [Hermes README](https://github.com/NousResearch/hermes-agent)

> "The self-improving AI agent built by [Nous Research](https://nousresearch.com). The only agent with a built-in learning loop — it creates skills from experience, improves them during use, nudges itself to persist knowledge, and builds a deepening model of who you are across sessions."
> — [Hermes docs home](https://hermes-agent.nousresearch.com/docs/)

> "**Lives where you do** — CLI, Telegram, Discord, Slack, WhatsApp, Signal, Matrix, Mattermost, Email, SMS, DingTalk, Feishu, WeCom, Weixin, QQ Bot, Yuanbao, BlueBubbles, Home Assistant, Microsoft Teams, Google Chat, and more — 20+ platforms from one gateway"
> — [Hermes docs home](https://hermes-agent.nousresearch.com/docs/)

### Minimum and recommended CPU, RAM and disk

| Resource | Minimum | Recommended |
| --- | --- | --- |
| CPU | 1 core | 2 cores |
| RAM | 1 GB | 2–4 GB |
| Disk (data volume) | 500 MB | 2+ GB, growing with sessions and skills |

> "| Memory | 1 GB | 2–4 GB |"
> "| CPU | 1 core | 2 cores |"
> "| Disk (data volume) | 500 MB | 2+ GB (grows with sessions/skills) |"
> — [Hermes Docker guide, Resource limits](https://hermes-agent.nousresearch.com/docs/user-guide/docker#resource-limits)

The browser is the exception to the 1 GB floor:

> "Browser automation (Playwright/Chromium) is the most memory-hungry feature. If you don't need browser tools, 1 GB is sufficient. With browser tools active, allocate at least 2 GB."
> — [Hermes Docker guide](https://hermes-agent.nousresearch.com/docs/user-guide/docker#resource-limits)

**Not found:** Hermes does not publish a separate CPU or disk recommendation for its Modal, Daytona or Vercel Sandbox backends. The Docker table is the only first-party sizing table in the pages inspected.

### Does it have to stay on all the time?

It depends on how messages arrive. With the default Telegram long polling, the gateway makes outbound requests, so it cannot sleep:

> "By default, Hermes connects to Telegram using **long polling** — the gateway makes outbound requests to Telegram's servers to fetch new updates."
> — [Hermes Telegram setup](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/telegram)

> "Since polling is outbound, a polling bot can never sleep."
> — [Hermes Telegram setup](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/telegram)

Webhook mode flips the direction and allows sleep-when-idle on hosts that can wake on inbound HTTP:

> "For **cloud deployments** (Fly.io, Railway, Render, etc.), **webhook mode** is more cost-effective. These platforms can auto-wake suspended machines on inbound HTTP traffic, but not on outbound connections."
> — [Hermes Telegram setup](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/telegram)

The gateway is also the scheduler, so scheduled jobs need it running:

> "The gateway also runs the cron scheduler, ticking every 60 seconds to execute any due jobs."
> — [Hermes messaging gateway](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/)

**Inferred:** a personal Hermes that only answers Telegram messages can be always-on; a Hermes that uses webhook mode plus a host with HTTP auto-wake can sleep between messages, but cron jobs will not fire while it is asleep.

### How it receives messages

Chat platforms are adapters inside one gateway:

> "Each platform adapter receives messages, routes them through a per-chat session store, and dispatches them to the AIAgent for processing."
> — [Hermes messaging gateway](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/)

For events from other services, Hermes runs an HTTP webhook server:

> "The webhook adapter runs an HTTP server that accepts POST requests, validates HMAC signatures, transforms payloads into agent prompts, and routes responses back to the source or to another configured platform."
> — [Hermes webhooks](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/webhooks)

So it can work either way: outbound long polling for chat, or an inbound public HTTPS URL for webhooks.

### What it must keep between restarts

Everything lives under `~/.hermes` (or `HERMES_HOME`). The important parts are memory, sessions, skills, credentials and config:

> "~/.hermes/
> ├── config.yaml     # Settings (model, terminal, TTS, compression, etc.)
> ├── .env            # API keys and secrets
> ├── auth.json       # OAuth provider credentials (Nous Portal, etc.)
> ├── SOUL.md         # Primary agent identity (slot #1 in system prompt)
> ├── memories/       # Persistent memory (MEMORY.md, USER.md)
> ├── skills/         # Agent-created skills (managed via skill_manage tool)
> ├── cron/           # Scheduled jobs
> ├── sessions/       # Gateway sessions
> └── logs/           # Logs (errors.log, gateway.log — secrets auto-redacted)"
> — [Hermes configuration, Directory Structure](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)

> "Both are stored in `~/.hermes/memories/` and are injected into the system prompt as a frozen snapshot at session start."
> — [Hermes memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)

> "All CLI and messaging sessions are stored in SQLite (`~/.hermes/state.db`) with FTS5 full-text search"
> — [Hermes memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)

> "Secrets (API keys, bot tokens, passwords) go in `.env`."
> — [Hermes configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)

Losing the disk means losing memory, sessions, skills and logins. Pausing a sandbox is fine if the filesystem survives; killing it is not.

### Browser, Docker and GPU

- **Browser:** optional. Hermes ships browser tools: "`browser_exec` drives Chromium with Python over CDP (screenshots included)." — [Hermes tools](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools)
- **Docker:** optional. The terminal backend is a setting: "backend: local    # local | docker | ssh | modal | daytona | vercel_sandbox | <plugin backend>" — [Hermes configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)
- **GPU:** only for local models. "For local models, ensure you have enough GPU VRAM" — [Hermes FAQ](https://hermes-agent.nousresearch.com/docs/reference/faq). API models need no GPU.

### How much of the time it is actually busy

Battleships' `employees` preset is the matching workload: always-on assistant agents that keep memory, files and logins, answer messages, run scheduled jobs and use a browser. Its per-machine shape is 2 vCPU / 4 GiB / 20 GiB, and it records:

> "cpuUtil": 0.057999999999999996
> "ramUtil": 0.358
> "idleShare": 0.28
> "cpuPeakUtil": 0.98
> "ramPeakUtil": 0.8
> — [Battleships employees ranking](https://battleships.dev/data/rankings/employees.json)

That is about **5.8% average CPU**, with peaks at 98% and RAM peaks at 80%. The average is low because the agent is waiting on messages and model responses (**inferred**); the peaks are why a 1 vCPU / 1 GB box feels tight when a browser or a build runs.

### Official backends and hosting

Hermes ships six terminal backends:

> "Hermes ships six terminal backends. Each determines where the agent's shell commands actually execute — your local machine, a Docker container, a remote server via SSH, a Modal cloud sandbox (direct or via the Nous-managed gateway), a Daytona workspace, or a Vercel Sandbox."
> — [Hermes configuration, Terminal Backend Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)

> "6 built-in terminal backends (local, Docker, SSH, Daytona, Modal, Vercel Sandbox) plus plugin backends such as Singularity."
> — [Hermes docs home](https://hermes-agent.nousresearch.com/docs/)

The Modal and Daytona backends are explicitly described as persistent when idle:

> "Daytona and Modal offer serverless persistence — your environment hibernates when idle, costing nearly nothing"
> — [Hermes docs home](https://hermes-agent.nousresearch.com/docs/)

> "Runs commands in a [Modal](https://modal.com) cloud sandbox. Each task gets an isolated VM with configurable CPU, memory, and disk. Filesystem can be snapshot/restored across sessions."
> — [Hermes configuration, Modal Backend](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)

> "Runs commands in a [Daytona](https://daytona.io) managed workspace. Supports stop/resume for persistence."
> — [Hermes configuration, Daytona Backend](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)

> "Runs commands in a [Vercel Sandbox](https://vercel.com/docs/vercel-sandbox) cloud microVM. Hermes uses the normal terminal and file tool surfaces; there are no Vercel-specific model-facing tools."
> — [Hermes configuration, Vercel Sandbox Backend](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)

E2B is not one of Hermes' own backends, but E2B documents Hermes as a supported workload with a prebuilt template:

> "E2B provides a pre-built `hermes` template with the Hermes CLI and bundled skills already installed."
> — [E2B Hermes guide](https://e2b.dev/docs/agents/hermes)

> "Hermes itself runs inside E2B. Its local terminal and file tools therefore operate on the E2B filesystem and processes, while E2B owns sandbox lifecycle, isolation, resource limits, and network policy. No separate Hermes terminal-backend integration is required for this setup."
> — [E2B Hermes guide](https://e2b.dev/docs/agents/hermes)

**Not found:** Hermes does not document Cloudflare Sandbox, Blaxel, Sprites, Boat, boxd, Lizard, InstaBox, Morph, Runtime or Sandboxer as terminal backends. That is not proof they cannot run it; it means Hermes' own docs do not name them.

### Managed one-click hosting, with price

Agent 37 is the clearest managed option among the 15 providers. It sells a personal plan with Hermes pre-installed, and its API catalog has an `agent37-hermes` template:

> "Run OpenClaw, Hermes, Claude Code, Codex, OpenCode, or Grok around the clock. Yours is live in one click."
> — [Agent 37 personal](https://www.agent37.com/personal)

> "| `agent37-hermes` | Hermes, the general agent: chat, browsing, code, files. |"
> — [Agent 37 templates](https://www.agent37.com/docs/agents-api/templates)

| Plan | vCPU / RAM / disk | Price | Notes |
| --- | --- | --- | --- |
| Free | 1 vCPU / 4 GB / 2 GB | $0/mo | "Sleeps when idle, wakes when you message it." |
| Basic | 1 vCPU / 4 GB / 8 GB | $3.99/mo | BYOK, $1/mo AI credits |
| Plus | 1 vCPU / 4 GB / 12 GB | $9.99/mo | Free models included |
| Pro | 2 vCPU / 8 GB / 20 GB | $29.99/mo | Built-in Chromium browser |
| Max | 4 vCPU / 16 GB / 40 GB | $99.99/mo | Team management and roles |

> "1 vCPU · 4 GB RAM · 2 GB storage" / "$0/mo" / "One agent to try things out. Sleeps when idle, wakes when you message it."
> "1 vCPU · 4 GB RAM · 8 GB storage" / "$3.99/mo"
> "1 vCPU · 4 GB RAM · 12 GB storage" / "$9.99/mo"
> "2 vCPU · 8 GB RAM · 20 GB storage" / "$29.99/mo"
> "4 vCPU · 16 GB RAM · 40 GB storage" / "$99.99/mo"
> — [Agent 37 personal](https://www.agent37.com/personal)

> "On paid plans, your agent stays up between scheduled jobs."
> — [Agent 37 personal](https://www.agent37.com/personal)

E2B's Hermes template is not managed hosting: it is a sandbox image you create and pay for by usage (**inferred** from the template guide, which shows `e2b sbx create` rather than a hosted account). **Not found:** a first-party Hermes one-click host other than Agent 37; Hermes itself ships a desktop app and installers, not a hosted service.

### Battleships preset

The matching preset is `employees` — "Always-on AI employees":

> "Assistant agents that each live on their own machine all the time (one per employee or customer, like OpenClaw or Hermes): they keep their memory and files, hold logins to your tools, answer messages, run scheduled jobs and use a browser. They read untrusted web pages and messages all day, so no shared-kernel containers. Mostly idle, so waking on a message and sleeping in between matters more than Docker."
> — [Battleships presets](https://battleships.dev/data/presets.json)

Exact workload:

```json
{"vcpu":2,"ram":4,"disk":20,"sessions":0,"sessionMin":0,"concurrency":0,"alwaysOn":50,"snapshotGiB":0,"egress":100,"ipv4":0,"seats":2,"persistentDisk":true}
```

That is **50 machines on 24/7**, not one. It is a fleet preset for a team or a customer base. The useful part for one person is the per-machine shape and the duty cycle.

### Proposed workload for one person

| Field | Value |
| --- | --- |
| vCPU | 2 |
| RAM | 4 GiB |
| Disk | 20 GiB |
| Machines | 1 |
| Machine-hours / month | 730 |
| Wall-clock hours / month | 730 (always-on) |
| CPU busy share | 6% average |
| Disk persists while stopped | Yes |

**Reasoning.** Hermes' own recommended minimum is 2 cores / 2–4 GB / 2+ GB, and browser tools push the RAM floor to 2 GB. A 2 vCPU / 4 GiB / 20 GiB box sits at the top of the vendor's recommended RAM range and leaves room for Chromium, skills and session history. The 20 GiB disk matches Battleships' per-machine shape and Agent 37's Pro plan. 730 hours is 24/7, which is the honest number for a Telegram-polling personal assistant with cron jobs. The 6% CPU figure is Battleships' average; size for the 98% peaks, not the average.

**Team variant.** One shared 4 vCPU / 8 GiB / 40 GiB gateway, 730 hours, about 10% average CPU. Hermes supports multiple users on one gateway with allowlists:

> "Yes. The [messaging gateway](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/) lets multiple users interact with the same Hermes Agent instance via Telegram, Discord, Slack, WhatsApp, or Home Assistant. Access is controlled through allowlists (specific user IDs) and DM pairing (first user to message claims access)."
> — [Hermes FAQ](https://hermes-agent.nousresearch.com/docs/reference/faq)

Use separate machines instead if the users do not trust each other; one gateway is one shared memory and one set of credentials.

---

## 2. OpenClaw

### What it is

OpenClaw is an open-source, self-hosted personal AI assistant. One long-lived Gateway process connects the chat apps you already use to an agent that can read files, run commands, browse and keep memory. It is designed to run on your own machine or server, not as a hosted SaaS.

> "**Open source and hackable**: inspect, extend, and self-host without vendor lock-in."
> — [OpenClaw FAQ](https://docs.openclaw.ai/help/faq/what-is-openclaw)

> "OpenClaw is an AI assistant you run on your own infrastructure - for yourself, or shared with your team. It replies on the messaging surfaces you already use (Discord, Google Chat, iMessage, Mattermost, Signal, Slack, Telegram, WebChat, WhatsApp, and bundled channel plugins such as QQ Bot) and can also do voice plus hosted widgets in chat, on session dashboards, and in the macOS panel."
> — [OpenClaw FAQ](https://docs.openclaw.ai/help/faq/what-is-openclaw)

> "The **Gateway** is the always-on control plane; the assistant is the product."
> — [OpenClaw FAQ](https://docs.openclaw.ai/help/faq/what-is-openclaw)

### Minimum and recommended CPU, RAM and disk

OpenClaw's general install page lists only the Node.js version, not hardware. The Raspberry Pi page is the page that publishes a hardware floor:

> "**Minimum:** 1 GB RAM, 1 core, 500 MB free disk, 64-bit OS. **Recommended:** 2 GB+ RAM, 16 GB+ SD card (or USB SSD), Ethernet."
> — [OpenClaw on Raspberry Pi](https://docs.openclaw.ai/install/raspberry-pi)

| Resource | Minimum | Recommended |
| --- | --- | --- |
| CPU | 1 core | 2 cores |
| RAM | 1 GB | 2 GB+ |
| Disk | 500 MB free | 16 GB+ |

The Fly.io deployment guide uses a 2-CPU / 2 GB machine as its recommended shape:

> "With the recommended config (`shared-cpu-2x`, 2GB RAM), expect roughly $10-15/month depending on usage"
> — [OpenClaw on Fly.io](https://docs.openclaw.ai/install/fly)

**Not found:** a general OpenClaw system-requirements table with CPU, RAM and disk. The Pi table is the only first-party hardware table found.

### Does it have to stay on all the time?

Yes, in the normal chat setup. The Gateway is described as the always-on control plane, and it owns the provider connections:

> "A single long-lived **Gateway** owns all messaging surfaces (WhatsApp via Baileys, Telegram via grammY, Slack, Discord, Signal, iMessage, WebChat)."
> — [OpenClaw gateway architecture](https://docs.openclaw.ai/concepts/architecture)

Telegram can use webhooks instead of polling, but that still needs a running HTTP endpoint:

> "Long polling is the default. Webhook mode is the alternative when an HTTPS ingress is available."
> — [OpenClaw Telegram transports](https://docs.openclaw.ai/channels/telegram/transports)

**Inferred:** OpenClaw is effectively always-on for chat use. Webhook mode can reduce latency and fits an ingress that auto-wakes a sleeping host, but OpenClaw's docs do not document a sleep-when-idle mode of its own.

### How it receives messages

The Gateway keeps provider connections open and routes inbound messages to agents and sessions:

> "A single long-lived **Gateway** owns all messaging surfaces"
> — [OpenClaw gateway architecture](https://docs.openclaw.ai/concepts/architecture)

Telegram is long polling by default, with webhook as an alternative:

> "Long polling is the default. Webhook mode is the alternative when an HTTPS ingress is available."
> — [OpenClaw Telegram transports](https://docs.openclaw.ai/channels/telegram/transports)

### What it must keep between restarts

OpenClaw's state is local by default:

> "Everything lives under `$OPENCLAW_STATE_DIR` (default: `~/.openclaw`)"
> — [OpenClaw: where things live on disk](https://docs.openclaw.ai/help/faq/where-things-live-on-disk)

The critical pieces are config, SQLite state and channel credentials:

> "`$OPENCLAW_STATE_DIR/openclaw.json` | Main config (JSON5)"
> "`$OPENCLAW_STATE_DIR/state/openclaw.sqlite` | Shared SQLite state, including shared auth profiles"
> "`$OPENCLAW_STATE_DIR/credentials/` | Provider state (for example `whatsapp/<accountId>/creds.json`)"
> — [OpenClaw: where things live on disk](https://docs.openclaw.ai/help/faq/where-things-live-on-disk)

The agent's memory and personality are in the workspace, not the state directory:

> "**Workspace (per agent)**: `AGENTS.md`, `SOUL.md`, `IDENTITY.md`, `USER.md`, `MEMORY.md`, `memory/YYYY-MM-DD.md`."
> — [OpenClaw: where things live on disk](https://docs.openclaw.ai/help/faq/where-things-live-on-disk)

Losing the disk means losing sessions, memory and logins. WhatsApp is the sharpest example (**inferred** from the credential path): losing `creds.json` loses the linked WhatsApp session and requires scanning the QR code again.

### Browser, Docker and GPU

- **Browser:** optional. "OpenClaw can run a **dedicated Chrome/Brave/Edge/Chromium profile** that the agent controls." — [OpenClaw browser](https://docs.openclaw.ai/tools/browser)
- **Docker:** optional. Tool sandboxing is off by default: "Sandboxing is off by default" — [OpenClaw sandboxing](https://docs.openclaw.ai/gateway/sandboxing). The Docker guide's 6 GB figure is for building the image locally, not for running it: "At least 6 GB RAM for a local source image build; pre-built images avoid this build requirement" — [OpenClaw Docker](https://docs.openclaw.ai/install/docker).
- **GPU:** not needed for API models. The Pi page says the Pi is "just the gateway (models run in the cloud via API)" — [OpenClaw on Raspberry Pi](https://docs.openclaw.ai/install/raspberry-pi). Local models are an option, not a requirement: "Local-only option: run local models so all data can stay on your device" — [OpenClaw FAQ](https://docs.openclaw.ai/help/faq/what-is-openclaw).

### How much of the time it is actually busy

Battleships' `employees` preset explicitly names OpenClaw and Hermes. It records about **5.8% average CPU**, 35.8% RAM, 28% idle share, 98% CPU peak and 80% RAM peak for a 2 vCPU / 4 GiB / 20 GiB machine:

> "cpuUtil": 0.057999999999999996
> "ramUtil": 0.358
> "idleShare": 0.28
> "cpuPeakUtil": 0.98
> "ramPeakUtil": 0.8
> — [Battleships employees ranking](https://battleships.dev/data/rankings/employees.json)

The gateway is mostly waiting; the browser and large shell commands are the spikes (**inferred** from the average and peak figures).

### Official backends and hosting

OpenClaw documents more hosting targets than Hermes. Its Linux-server page is the index:

> "Run the OpenClaw Gateway on any Linux server or cloud VPS. This page helps you pick a provider, explains how cloud deployments work, and covers generic Linux tuning that applies everywhere."
> — [OpenClaw Linux server](https://docs.openclaw.ai/vps)

The page's hosting and platform list, each linked to its own guide:

| Target | Guide |
| --- | --- |
| Azure Linux VM | [docs.openclaw.ai/install/azure](https://docs.openclaw.ai/install/azure) |
| Daytona | [docs.openclaw.ai/install/daytona](https://docs.openclaw.ai/install/daytona) |
| DigitalOcean | [docs.openclaw.ai/install/digitalocean](https://docs.openclaw.ai/install/digitalocean) |
| exe.dev | [docs.openclaw.ai/install/exe-dev](https://docs.openclaw.ai/install/exe-dev) |
| Fly.io | [docs.openclaw.ai/install/fly](https://docs.openclaw.ai/install/fly) |
| GCP Compute Engine | [docs.openclaw.ai/install/gcp](https://docs.openclaw.ai/install/gcp) |
| Hetzner | [docs.openclaw.ai/install/hetzner](https://docs.openclaw.ai/install/hetzner) |
| Hostinger | [docs.openclaw.ai/install/hostinger](https://docs.openclaw.ai/install/hostinger) |
| Northflank | [docs.openclaw.ai/install/northflank](https://docs.openclaw.ai/install/northflank) |
| Oracle Cloud | [docs.openclaw.ai/install/oracle](https://docs.openclaw.ai/install/oracle) |
| Railway | [docs.openclaw.ai/install/railway](https://docs.openclaw.ai/install/railway) |
| Render | [docs.openclaw.ai/install/render](https://docs.openclaw.ai/install/render) |
| Raspberry Pi | [docs.openclaw.ai/install/raspberry-pi](https://docs.openclaw.ai/install/raspberry-pi) |
| Upstash Box | [docs.openclaw.ai/install/upstash](https://docs.openclaw.ai/install/upstash) |
| Cloudflare Containers | [docs.openclaw.ai/install/cloudflare](https://docs.openclaw.ai/install/cloudflare) |
| Kubernetes | [docs.openclaw.ai/install/kubernetes](https://docs.openclaw.ai/install/kubernetes) |
| Ansible | [docs.openclaw.ai/install/ansible](https://docs.openclaw.ai/install/ansible) |
| Podman | [docs.openclaw.ai/install/podman](https://docs.openclaw.ai/install/podman) |
| Docker VM runtime | [docs.openclaw.ai/install/docker-vm-runtime](https://docs.openclaw.ai/install/docker-vm-runtime) |
| macOS VMs | [docs.openclaw.ai/install/macos-vm](https://docs.openclaw.ai/install/macos-vm) |

Specific guides:

> "Run a persistent OpenClaw Gateway in a [Daytona](https://www.daytona.io) cloud sandbox: an isolated Linux environment with SSH access and built-in preview URLs, no VPS management required."
> — [OpenClaw on Daytona](https://docs.openclaw.ai/install/daytona)

> "It deploys a `standard-2` Container with `max_instances: 1`."
> — [OpenClaw on Cloudflare Containers](https://docs.openclaw.ai/install/cloudflare)

> "This deployment target is experimental."
> — [OpenClaw on Cloudflare Containers](https://docs.openclaw.ai/install/cloudflare)

> "**Goal:** OpenClaw Gateway running on a [Fly.io](https://fly.io) machine with persistent storage, automatic HTTPS, and Discord/channel access."
> — [OpenClaw on Fly.io](https://docs.openclaw.ai/install/fly)

E2B also documents OpenClaw with a prebuilt template:

> "E2B provides a pre-built `openclaw` template with OpenClaw already installed."
> — [E2B OpenClaw guide](https://e2b.dev/docs/agents/openclaw)

**Not found:** OpenClaw does not document Modal, E2B, Blaxel, Sprites, Boat, boxd, Lizard, InstaBox, Morph, Runtime or Sandboxer as hosting targets. E2B's guide is written by E2B, not by OpenClaw.

### Managed one-click hosting, with price

| Provider | What it offers | Price | Source |
| --- | --- | --- | --- |
| Agent 37 | Managed OpenClaw personal plan, one-click | Free $0; Basic $3.99/mo (1 vCPU/4 GB/8 GB); Plus $9.99/mo (1/4/12); Pro $29.99/mo (2/8/20); Max $99.99/mo (4/16/40) | [Agent 37 personal](https://www.agent37.com/personal) |
| Hostinger | 1-Click managed OpenClaw | $4.99/mo promotional, renews at $11.99/mo on the 24-month term | [Hostinger OpenClaw](https://www.hostinger.com/openclaw) |
| Render | Blueprint deploy; free tier spins down | Free spins down after 15 min; 1 CPU/2 GB is $25/mo | [OpenClaw on Render](https://docs.openclaw.ai/install/render), [Render pricing](https://render.com/pricing) |
| Fly.io | Fly Machine with a volume | "roughly $10-15/month" for shared-cpu-2x / 2 GB | [OpenClaw on Fly.io](https://docs.openclaw.ai/install/fly) |
| Northflank | One-click template with a persistent volume | **Not found** in the guide | [OpenClaw on Northflank](https://docs.openclaw.ai/install/northflank) |
| Railway | One-click template | **Not found** in the guide | [OpenClaw on Railway](https://docs.openclaw.ai/install/railway) |

Quotes:

> "Run OpenClaw, Hermes, Claude Code, Codex, OpenCode, or Grok around the clock. Yours is live in one click."
> — [Agent 37 personal](https://www.agent37.com/personal)

> "Choose a **1-Click** managed deployment"
> — [OpenClaw on Hostinger](https://docs.openclaw.ai/install/hostinger)

> "From ~$21.99~$4.99/mo" / "Today you pay $119.76 for 24 months. Renews at $11.99/mo for the same term."
> — [Hostinger OpenClaw](https://www.hostinger.com/openclaw)

> "| Free | After 15 min idle | Not available | Testing, demos |"
> — [OpenClaw on Render](https://docs.openclaw.ai/install/render)

> "| 1 CPU | $25/month | 2 GB RAM | 1c-2g |"
> — [Render pricing](https://render.com/pricing)

> "Deploy OpenClaw on Northflank with a one-click template and access it through the web Control UI."
> — [OpenClaw on Northflank](https://docs.openclaw.ai/install/northflank)

> "Persistent storage via a Northflank Volume (`/data`) so `openclaw.json`, shared and per-agent SQLite auth stores, channel/provider state, sessions, and workspace survive redeploys"
> — [OpenClaw on Northflank](https://docs.openclaw.ai/install/northflank)

> "Deploy OpenClaw on Railway with a one-click template and access it through the web Control UI."
> — [OpenClaw on Railway](https://docs.openclaw.ai/install/railway)

### Battleships preset

Same `employees` preset as Hermes, because Battleships names both products in the description:

> "Assistant agents that each live on their own machine all the time (one per employee or customer, like OpenClaw or Hermes)"
> — [Battleships presets](https://battleships.dev/data/presets.json)

Exact workload:

```json
{"vcpu":2,"ram":4,"disk":20,"sessions":0,"sessionMin":0,"concurrency":0,"alwaysOn":50,"snapshotGiB":0,"egress":100,"ipv4":0,"seats":2,"persistentDisk":true}
```

That is 50 machines on 24/7, 100 GiB egress, 2 seats and a persistent disk. See the Hermes section for the ranking fields.

### Proposed workload for one person

| Field | Value |
| --- | --- |
| vCPU | 2 |
| RAM | 4 GiB |
| Disk | 20 GiB |
| Machines | 1 |
| Machine-hours / month | 730 |
| Wall-clock hours / month | 730 (always-on) |
| CPU busy share | 6% average |
| Disk persists while stopped | Yes |

**Reasoning.** OpenClaw's published floor is 1 core / 1 GB / 500 MB, and its recommended floor is 2 GB+ / 16 GB+. The Fly.io guide's recommended 2-CPU / 2 GB machine costs about $10–15/month. A 2 vCPU / 4 GiB / 20 GiB box doubles the RAM for the browser and channel adapters and matches Battleships' per-machine shape. 730 hours is the honest number for long polling and scheduled jobs. The 6% average is the same modelled duty cycle as Hermes; the 98% CPU peak is the reason not to buy the 1 GB floor.

**Team variant.** One shared 4 vCPU / 8 GiB / 40 GiB gateway, 730 hours, about 10% average CPU. OpenClaw explicitly supports a shared gateway:

> "Yes. A shared gateway is a supported, first-class deployment: sessions carry an immutable creator, an assignable owner, and the people who prompted them; the Control UI shows who is viewing and typing in real time"
> — [OpenClaw FAQ](https://docs.openclaw.ai/help/faq/what-is-openclaw)

One gateway is one trust domain. OpenClaw's own boundary: "a gateway is one trust domain. Share it with people who trust each other; mutually adversarial users need separate gateways." — [OpenClaw FAQ](https://docs.openclaw.ai/help/faq/what-is-openclaw)

---

## 3. A coding agent in a cloud sandbox (Claude Code, Codex CLI or similar)

### What it is

A coding agent is a program that reads a repository, edits files, runs commands and tests, and reports back. Running it in a cloud sandbox gives each developer or each task its own disposable Linux machine, so the agent can work without full access to a laptop.

> "Claude Code is an agentic coding tool that reads your codebase, edits files, runs commands, and integrates with your development tools. Available in your terminal, IDE, desktop app, and browser."
> — [Claude Code overview](https://code.claude.com/docs/en/overview)

> "The sandbox is the boundary that lets the agent act autonomously without giving it unrestricted access to your machine."
> — [Codex sandbox](https://learn.chatgpt.com/docs/sandboxing)

### Minimum and recommended CPU, RAM and disk

Claude Code publishes a RAM floor but not a CPU or disk floor:

> "**Hardware**: 4 GB+ RAM, x64 or ARM64 processor"
> — [Claude Code setup](https://code.claude.com/docs/en/setup)

Anthropic's own hosted cloud environment publishes approximate ceilings of 4 vCPU / 16 GB / 30 GB:

> "Cloud sessions in Anthropic-hosted environments run with approximate resource ceilings that may change over time:
> - 4 vCPUs
> - 16 GB of RAM
> - 30 GB of disk"
> — [Claude Code cloud environments](https://code.claude.com/docs/en/cloud-environments)

| Resource | Minimum | Recommended |
| --- | --- | --- |
| CPU | **Not found** | 4 vCPU |
| RAM | 4 GB+ | 16 GB |
| Disk | **Not found** | 30 GB |

**Not found:** OpenAI does not publish Codex CLI CPU, RAM or disk requirements in the pages inspected. Codex Cloud says only that it runs on "OpenAI-managed computers" — [Using Codex Cloud](https://help.openai.com/en/articles/20001545-using-codex-cloud).

### Does it have to stay on all the time?

No. A coding agent is started for a task or a work session and can stop when the task is done. Anthropic's cloud sessions pause themselves when idle:

> "**Idle sessions**: after a few minutes without activity, a session’s VM pauses with its files saved, and a paused VM can later be reclaimed."
> — [Claude Code cloud environments](https://code.claude.com/docs/en/cloud-environments)

Codex Cloud keeps saved VM state for a week, not forever:

> "By default, saved virtual machine (VM) state is recoverable for up to 7 days after the last start of a turn or task resume."
> — [Using Codex Cloud](https://help.openai.com/en/articles/20001545-using-codex-cloud)

### How it receives messages

A coding agent is driven by a person or a program, not by a chat webhook. Claude Code runs in a terminal, IDE, desktop app or browser, and can also run as a cloud session. Codex runs as a CLI or as a cloud task.

> "Claude Code is an agentic coding tool that reads your codebase, edits files, runs commands, and integrates with your development tools. Available in your terminal, IDE, desktop app, and browser."
> — [Claude Code overview](https://code.claude.com/docs/en/overview)

> "Codex Cloud runs coding tasks on OpenAI-managed computers."
> — [Using Codex Cloud](https://help.openai.com/en/articles/20001545-using-codex-cloud)

**Not found:** an inbound webhook interface in the Claude Code or Codex CLI docs; the trigger is the user, the CLI, the SDK or the cloud task API.

### What it must keep between restarts

- The repository and its uncommitted changes.
- The agent's own config and login. Claude Code's config paths are `~/.claude` and `~/.claude.json`:

> "Claude Code’s configuration paths `~/.claude` and `~/.claude.json`."
> — [Claude Code sandbox environments](https://code.claude.com/docs/en/sandbox-environments)

- Package caches, Docker images and build outputs, if you want the next session to start warm. Anthropic's cloud environment cache keeps files but not running processes:

> "The cache stores files only, not running processes, so Claude still starts the containers each session."
> — [Claude Code cloud environments](https://code.claude.com/docs/en/cloud-environments)

For a personal dev box, the disk must persist while stopped. For a one-task-per-sandbox design, the repository can be re-cloned and the disk can be ephemeral.

### Browser, Docker and GPU

- **Docker:** often needed, because the agent runs services and test databases. Claude Code's comparison table lists a dev container as requiring Docker, and a VM as not requiring it:

> "| [Dev container](https://code.claude.com/docs/en/sandbox-environments#dev-containers) | Full development environment | Yes | Medium |"
> "| [Virtual machine](https://code.claude.com/docs/en/sandbox-environments#virtual-machine) | Full operating system | No | High |"
> — [Claude Code sandbox environments](https://code.claude.com/docs/en/sandbox-environments)

- **Browser:** optional. It is needed only if the agent checks a web UI or runs browser tests; the CLI itself does not require one. **Inferred** from the Claude Code system requirements, which list no browser.
- **GPU:** not needed for the agent. **Inferred** from the same requirements; GPU is only relevant if the project itself trains or serves models.

### How much of the time it is actually busy

Battleships' `fullstack` preset is the matching workload: agents that build and ship software, each on its own machine for an eight-hour work session, with Docker, a desktop and a browser. It records about **3.4% average CPU**, 19.4% RAM, 63% idle share, 47% CPU peak and 36% RAM peak:

> "cpuUtil": 0.034
> "ramUtil": 0.19399999999999998
> "idleShare": 0.63
> "cpuPeakUtil": 0.47
> "ramPeakUtil": 0.36
> — [Battleships fullstack ranking](https://battleships.dev/data/rankings/fullstack.json)

Most of the wall-clock time is the agent waiting on the model, not the CPU (**inferred**). The machine still needs enough RAM and disk for installs, builds and tests.

### Official backends and hosting

Claude Code documents its own isolation choices: the built-in Bash sandbox, the sandbox runtime, a dev container, a custom container, a virtual machine, and Anthropic-hosted cloud sessions:

> "The first two approaches in the table below run on the host operating system without containers. The rest place Claude Code inside a container or virtual machine."
> — [Claude Code sandbox environments](https://code.claude.com/docs/en/sandbox-environments)

Provider guides that officially document running Claude Code or Codex inside their sandbox:

> "Run AI coding agents like Claude Code, Codex, and Amp in secure E2B sandboxes with full terminal, filesystem, and git access."
> — [E2B coding agents](https://e2b.dev/docs/use-cases/coding-agents)

> "This guide walks you through running Claude Code inside a Daytona sandbox using the Daytona CLI."
> — [Daytona Claude Code guide](https://www.daytona.io/docs/en/guides/claude/claude-code-run-cli-sandbox)

> "Run [Claude Code ↗︎](https://code.claude.com/docs/en/overview) in a Linux sandbox to edit a GitHub repository from a prompt, then read its changes as a diff."
> — [Cloudflare Sandbox Claude Code guide](https://developers.cloudflare.com/sandbox/coding-agents/claude-code/)

> "Each session of [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) gets its own [Vercel Sandbox](https://vercel.com/docs/sandbox), and Claude Code runs only there"
> — [Vercel durable Claude Code](https://vercel.com/docs/agent-harnesses/claude-code)

Several other providers ship the harness preinstalled in the base image rather than documenting a separate integration:

> "The seven coding-agent harnesses on every sandbox (Claude Code, Codex, pi, OpenCode, Prime Agent, Kimi Code, Mistral Vibe), their models, and fast mode."
> — [Boat harnesses](https://docs.boat.dev/integrated-agents/harnesses-and-models)

> "Every boxd machine ships with three coding agents: **Claude Code** (`claude`), **Codex** (`codex`), and **OpenCode** (`opencode`)."
> — [boxd coding agents](https://docs.boxd.sh/use-cases/coding-agents)

> "Claude Code, Codex, and the desktop (VNC, Xfce, Chromium)"
> — [InstaBox limits](https://instabox.sh/docs/limits)

> "Choose a template from the current catalog: `base`, `interpreter`, `codex`, `claude`, `opencode`, `pi`, `prime`, `desktop`, or `desktop-camoufox`."
> — [Lizard sandboxes](https://lizard.build/docs/sandboxes.md)

These are sandboxes with the harness preinstalled, not managed agent hosting.

**Not found:** a Modal first-party Claude Code guide in the pages inspected. Modal is a Hermes backend, not a documented Claude Code host in these sources.

### Managed one-click hosting, with price

| Provider | What it offers | Price | Source |
| --- | --- | --- | --- |
| Agent 37 | Managed Claude Code / Codex personal plan, one-click | From $3.99/mo; Pro $29.99/mo (2 vCPU/8 GB/20 GB); Max $99.99/mo | [Agent 37 personal](https://www.agent37.com/personal) |
| Anthropic | Claude Code cloud sessions on Anthropic-managed VMs | Requires a Claude subscription; price not on the docs page | [Claude Code sandbox environments](https://code.claude.com/docs/en/sandbox-environments) |
| OpenAI | Codex Cloud on OpenAI-managed computers | Included in ChatGPT plans; price not on the docs page | [Using Codex Cloud](https://help.openai.com/en/articles/20001545-using-codex-cloud) |

> "Run OpenClaw, Hermes, Claude Code, Codex, OpenCode, or Grok around the clock. Yours is live in one click."
> — [Agent 37 personal](https://www.agent37.com/personal)

> "| `agent37-hermes` | Hermes, the general agent: chat, browsing, code, files. |"
> "| `agent37-openclaw` | OpenClaw, the general agent: chat, headless browsing, code, files. |"
> — [Agent 37 templates](https://www.agent37.com/docs/agents-api/templates)

Agent 37's catalog also has dedicated Claude Code and Codex templates:

> "| `agent37-claude-code` | Claude Code, Anthropic’s coding agent, on your own Anthropic account: chat, code, files, shell. No browser or desktop. |"
> "| `agent37-codex` | Codex, OpenAI’s coding agent, on your own OpenAI account: chat, code, files, shell. No browser or desktop. |"
> — [Agent 37 templates](https://www.agent37.com/docs/agents-api/templates)

### Battleships preset

The matching preset is `fullstack` — "Software factory":

> "Agents that build and ship software, each on its own machine for a work session of about 8 hours: Docker for services and test databases, a desktop and a browser to check the UI they built, and a disk that keeps the work between sessions. Turn on nested virtualization if they also run Android emulators or VMs."
> — [Battleships presets](https://battleships.dev/data/presets.json)

Exact workload:

```json
{"vcpu":4,"ram":8,"disk":20,"sessions":2200,"sessionMin":480,"concurrency":100,"alwaysOn":0,"snapshotGiB":250,"egress":300,"ipv4":0,"seats":3,"persistentDisk":true}
```

That is 2,200 eight-hour sessions a month with 100 running at once, a software-factory fleet. For one developer, use the per-machine shape and the duty cycle, not the fleet totals.

### Proposed workload for one developer

| Field | Value |
| --- | --- |
| vCPU | 4 |
| RAM | 8 GiB |
| Disk | 40 GiB |
| Machines | 1 per developer |
| Machine-hours / month | 160 per machine |
| Wall-clock hours / month | 160 per developer (8 h × 20 workdays) |
| CPU busy share | 3–5% average |
| Disk persists while stopped | Yes |

**Reasoning.** Claude Code's floor is 4 GB RAM; Anthropic's hosted environment gives 4 vCPU / 16 GB / 30 GB; Battleships gives 4 vCPU / 8 GB / 20 GB. A 4 vCPU / 8 GiB / 40 GiB box is the practical middle: 8 GiB is enough for the CLI, a language server, tests and a couple of containers, and 40 GiB leaves room for Docker images and package caches that the 20 GiB preset does not. Use 16 GiB if the project builds large native code or runs several services. 160 hours is 8 hours a day for 20 workdays; the sandbox can stop outside those hours because the repo and config are on disk. The 3.4% average CPU is why a small machine is fine most of the day, and the 47% peak is why it should not be 1 vCPU.

**Team variant.** Three developers, three machines, 4 vCPU / 8 GiB / 40 GiB each, 480 machine-hours/month total. Keep one sandbox per developer rather than one shared box: Claude Code keeps state on disk and is not built for multiple tenants. Vercel's guide states the reason directly:

> "Claude Code isn't built to be safe for multiple tenants: it's a command-line tool for one user, it keeps its state on disk, and its built-in tools run commands and change files on the machine it runs on."
> — [Vercel durable Claude Code](https://vercel.com/docs/agent-harnesses/claude-code)

---

## 4. A code interpreter inside your own product

### What it is

A code interpreter is a sandbox that your application calls to run code on behalf of a user or an LLM. Your app sends code and inputs; the sandbox runs it, returns stdout, errors and files, and is thrown away. It is infrastructure you embed, not a product your users log into.

> "E2B provides isolated sandboxes that let agents safely execute code, process data, and run tools. Our SDKs make it easy to start and manage these environments."
> — [E2B docs](https://docs.e2b.dev/index.md)

> "Run untrusted or agent-generated code in isolated Linux microVMs. Use Vercel Sandbox for agent workflows, debugging, and one-off commands."
> — [Vercel Sandbox](https://vercel.com/docs/sandbox)

### Minimum and recommended CPU, RAM and disk

There is no single vendor recommendation because the shape depends on the provider. The documented defaults and limits are:

| Provider | Default | Maximum | Source |
| --- | --- | --- | --- |
| E2B | 2 vCPU / 512 MiB / 10 GiB disk | 8 vCPU / 8 GiB / 20+ GiB | [E2B billing and limits](https://docs.e2b.dev/billing) |
| Daytona | 1 vCPU / 1 GiB / 3 GiB | 4 vCPU / 8 GiB / 10 GiB | [Daytona sandboxes](https://www.daytona.io/docs/en/sandboxes/) |
| Modal | 0.125 CPU core / 128 MiB | Plan-dependent; not found as a single table | [Modal resources](https://modal.com/docs/guide/resources) |
| Vercel Sandbox | 2 vCPU / 4 GB / 64 GB ephemeral NVMe | 32 vCPU / 64 GB (Enterprise) | [Vercel Sandbox pricing](https://vercel.com/docs/sandbox/pricing) |
| Cloudflare Containers | `basic`: 1/4 vCPU / 1 GiB / 4 GB | 4 vCPU / 12 GiB / 20 GB | [Cloudflare Containers limits](https://developers.cloudflare.com/containers/platform/limits/) |

Quotes:

> "Start with default resources (2 vCPU, 512 MiB RAM) and increase only if necessary"
> — [E2B billing and limits](https://docs.e2b.dev/billing)

> "Sandboxes have **1 vCPU**, **1GB RAM**, and **3GiB disk** by default. Organizations get a maximum sandbox resource limit of **4 vCPUs**, **8GB RAM**, and **10GB disk**."
> — [Daytona sandboxes](https://www.daytona.io/docs/en/sandboxes/)

> "Each Modal Function or Sandbox container has a default request of 0.125 CPU cores and 128 MiB of memory."
> — [Modal resources](https://modal.com/docs/guide/resources)

> "The default is 2 vCPUs." / "Each vCPU includes 2 GB of memory." / "Each sandbox created with Sandbox SDK 3.0.0 or above, or from a [custom image](https://vercel.com/docs/sandbox/concepts/images#custom-images), is automatically provisioned 64 GB of ephemeral NVMe storage."
> — [Vercel Sandbox pricing](https://vercel.com/docs/sandbox/pricing)

> "| basic | 1/4 | 1 GiB | 4 GB |" / "| standard-2 | 1 | 6 GiB | 12 GB |"
> — [Cloudflare Containers limits](https://developers.cloudflare.com/containers/platform/limits/)

**Practical minimum (inferred):** 1 vCPU / 512 MiB / 1 GiB disk. That is above Modal's 0.125-core floor, at E2B's default RAM, and at Daytona's minimum disk. **Practical recommendation (inferred):** 2 vCPU / 4 GiB / 10 GiB for a general Python/data interpreter. Battleships' `interp` preset uses 1 vCPU / 2 GiB / 5 GiB and records 81.5% RAM utilisation, which is why 2 GiB is a floor rather than a comfortable size.

### Does it have to stay on all the time?

No. Each run is short-lived, and the default lifecycle is destructive. E2B's timeout is five minutes and kills the sandbox by default:

> "Every sandbox has a timeout, and it defaults to **5 minutes** if you do not set one."
> "`onTimeout: 'kill'` (the default) terminates the sandbox and releases its resources. A killed sandbox cannot be resumed, and its state is gone."
> — [E2B sandbox lifetime](https://docs.e2b.dev/faq/sandbox-lifetime)

Vercel's default timeout is also five minutes:

> "The default timeout is 5 minutes."
> — [Vercel Sandbox pricing](https://vercel.com/docs/sandbox/pricing)

So the product creates a sandbox when code arrives, runs it, returns the result and lets the sandbox die. There is no always-on machine per user unless you deliberately keep one.

### How it receives messages

Your application receives the user's request (HTTP, WebSocket, queue, chat), then calls the sandbox provider's API to create or reuse a sandbox and run the code. The sandbox itself does not need a public inbound webhook. E2B's code interpreter server is reachable over the sandbox's public URL, but that is a surface your app can restrict:

> "By default, the Code Interpreter server inside the sandbox is reachable through the sandbox’s [public URL](https://docs.e2b.dev/network/public-url) and runs any code it receives."
> — [E2B code interpreting](https://e2b.dev/docs/code-interpreting/analyze-data-with-ai)

> "To make sure only your application can run code in the sandbox, create it with `allowPublicTraffic: false` / `allow_public_traffic: False`."
> — [E2B code interpreting](https://e2b.dev/docs/code-interpreting/analyze-data-with-ai)

### What it must keep between restarts

By default, nothing. A killed sandbox loses its state:

> "A killed sandbox cannot be resumed, and its state is gone."
> — [E2B sandbox lifetime](https://docs.e2b.dev/faq/sandbox-lifetime)

Persistence is available if the product needs it: E2B can pause with filesystem and memory, and Vercel's persistent sandboxes save state on stop.

> "`onTimeout: 'pause'` pauses the sandbox instead. Both the filesystem **and** the memory are saved, which includes running processes and loaded variables."
> — [E2B sandbox lifetime](https://docs.e2b.dev/faq/sandbox-lifetime)

> "Sandboxes that auto-save state on stop and resume where you left off. Persistence is the default."
> — [Vercel Sandbox](https://vercel.com/docs/sandbox)

But for a code interpreter, the usual design is to return output files to your object storage and keep the sandbox stateless (**inferred**).

### Browser, Docker and GPU

- **Browser:** not needed for a code interpreter. It is a separate use case.
- **Docker:** optional. Some providers run Docker inside the sandbox, but a plain Python/Node interpreter does not need it.
- **GPU:** not needed. E2B is CPU-only: "E2B sandboxes are CPU-only, sized by vCPU and RAM only, with no GPU option in the SDKs, CLI, API, or a template definition." — [E2B FAQ](https://docs.e2b.dev/faq)

> "Sandbox with Docker or Docker Compose installed for running containers"
> — [E2B Docker template](https://docs.e2b.dev/template/examples/docker)

> "Run workloads that need system-level privileges, such as container runtimes like Docker, VPN clients, and FUSE filesystem drivers."
> — [Vercel Sandbox](https://vercel.com/docs/sandbox)

### How much of the time it is actually busy

Battleships' `interp` preset is the matching workload: lots of one-minute runs, each on a small machine. It records about **17.4% average CPU**, 81.5% RAM, 5% idle share, 56% CPU peak and 100% RAM peak:

> "cpuUtil": 0.174
> "ramUtil": 0.815
> "idleShare": 0.05
> "cpuPeakUtil": 0.56
> "ramPeakUtil": 1
> — [Battleships interp ranking](https://battleships.dev/data/rankings/interp.json)

That is much busier than an assistant agent, because a one-minute run uses the CPU for a larger share of its short life (**inferred**). It is also RAM-bound at 2 GiB, which supports 4 GiB for data work.

### Official backends and hosting

The sandbox providers themselves are the backends. Official code-execution guides exist at E2B, Daytona, Modal, Vercel and Cloudflare. For example:

> "E2B provides isolated sandboxes that let agents safely execute code, process data, and run tools."
> — [E2B docs](https://docs.e2b.dev/index.md)

> "Sandboxes are isolated runtime environments you can manage programmatically to run code."
> — [Daytona sandboxes](https://www.daytona.io/docs/en/sandboxes/)

> "This page is a high-level guide to Sandboxes, secure containers for executing untrusted code on Modal. Sandboxes are useful for tasks like executing code generated by an LLM or isolating user-generated code."
> — [Modal sandboxes](https://modal.com/docs/guide/sandboxes)

> "Run untrusted or agent-generated code in isolated Linux microVMs."
> — [Vercel Sandbox](https://vercel.com/docs/sandbox)

> "In this tutorial, you will build a Worker that answers questions by running code."
> — [Cloudflare: build an AI code interpreter](https://developers.cloudflare.com/sandbox/get-started/build-an-ai-code-interpreter/)

Anthropic also sells a fully managed code-execution tool, which is the closest thing to one-click hosting for this use case. It is a fixed container, not a configurable sandbox:

> "* **Memory:** The container has 5 GiB of RAM."
> "* **Disk space:** The container has 5 GiB of workspace storage."
> "* **CPU:** The container has 1 CPU."
> "* **Internet access:** Completely disabled for security"
> — [Anthropic code execution tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool)

### Managed one-click hosting, with price

| Provider | What it offers | Price | Source |
| --- | --- | --- | --- |
| Anthropic | Hosted code-execution tool, fixed 1 CPU / 5 GiB / 5 GiB, no internet | 1,550 hours included; "$0.05 USD per hour, per container" after that | [Anthropic code execution tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool) |
| E2B, Daytona, Modal, Vercel, Cloudflare | Sandbox APIs you integrate; not a one-click end-user product | Usage-priced; see each provider's pricing page | — |

> "* Additional usage beyond 1,550 hours is billed at **$0.05 USD per hour, per container**."
> — [Anthropic code execution tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool)

**Not found:** a managed "code interpreter" product among the 15 providers. They sell the sandbox, not the interpreter UI; you bring the app, the model loop and the file handling.

### Battleships preset

The matching preset is `interp` — "Code interpreter bursts":

> "An AI app that runs short pieces of code for its users: lots of one-minute runs, each on a small machine."
> — [Battleships presets](https://battleships.dev/data/presets.json)

Exact workload:

```json
{"vcpu":1,"ram":2,"disk":5,"sessions":200000,"sessionMin":1,"concurrency":100,"alwaysOn":0,"snapshotGiB":0,"egress":20,"ipv4":0,"seats":1,"persistentDisk":false}
```

That is 200,000 one-minute runs a month, 100 at once, with no persistent disk.

### Proposed workload for a small product

| Field | Value |
| --- | --- |
| vCPU | 2 |
| RAM | 4 GiB |
| Disk | 10 GiB |
| Machines | 10 concurrent |
| Machine-hours / month | 333 (20,000 runs × 1 minute) |
| Wall-clock hours / month | About 33 at 10 concurrent |
| CPU busy share | 17% average |
| Disk persists while stopped | No |

**Reasoning.** The preset's 1 vCPU / 2 GiB / 5 GiB shape is the floor, and its 81.5% RAM utilisation says 2 GiB is tight for dataframes or image work. Doubling to 2 vCPU / 4 GiB / 10 GiB gives headroom for Python libraries, temporary files and a browser-free workload, while staying inside E2B's and Daytona's limits. 20,000 runs a month is a small product: about 650 a day, or one every two minutes on average, with a 10-machine pool to absorb bursts. Disk does not need to persist because outputs are returned to the app; if users need files between runs, add object storage rather than a stateful sandbox.

**Scale variant.** 200,000 runs a month, 100 concurrent, 1 vCPU / 2 GiB / 5 GiB, 3,333 machine-hours. This is the exact Battleships preset and is the right shape for a consumer app with heavy burst traffic.

---

## 5. A browser or computer-use agent

### What it is

A browser agent drives a real browser: it opens pages, reads the DOM or a screenshot, clicks, types and fills forms. A computer-use agent goes further and drives a whole desktop with a virtual display, mouse and keyboard. The first is enough for websites; the second is for desktop apps, file managers, installers or anything that is not a web page.

> "Claude can interact with computer environments through the computer use tool, which provides screenshot capabilities and mouse/keyboard control for autonomous desktop interaction."
> — [Anthropic computer use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)

> "The [E2B Desktop](https://github.com/e2b-dev/desktop) SDK gives your agent a full Linux desktop with mouse, keyboard, and screen capture APIs."
> — [E2B computer use](https://e2b.dev/docs/use-cases/computer-use)

> "Computer Use enables programmatic control of desktop environments within sandboxes. It provides mouse, keyboard, screenshot, screen recording, and display operations for automating GUI interactions and testing desktop applications."
> — [Daytona Computer Use](https://www.daytona.io/docs/en/computer-use/)

### Minimum and recommended CPU, RAM and disk

There is no single official sizing table for browser agents. The closest first-party numbers are from browser-infrastructure vendors and from Battleships:

| Workload | vCPU | RAM | Disk | Source |
| --- | --- | --- | --- | --- |
| Browser-use agent | 2 | 4 GiB | 10 GiB | [Battleships browseruse preset](https://battleships.dev/data/presets.json) |
| Computer-use agent | 4 | 8 GiB | 20 GiB | [Battleships cua preset](https://battleships.dev/data/presets.json) |
| Self-hosted Browserless (minimum) | 2 cores | 4 GB | 10 GB | [Browserless Enterprise](https://docs.browserless.io/enterprise/docker/enterprise-image) |
| Self-hosted Steel (minimum) | Not published | 4 GB | 10 GB | [Steel Docker guide](https://docs.steel.dev/overview/self-hosting/docker) |

Quotes:

> "Minimum 2 CPU cores and 4GB RAM"
> — [Browserless Enterprise](https://docs.browserless.io/enterprise/docker/enterprise-image)

> "At least 4GB of RAM"
> — [Steel Docker guide](https://docs.steel.dev/overview/self-hosting/docker)

> "10GB of free disk space"
> — [Steel Docker guide](https://docs.steel.dev/overview/self-hosting/docker)

**Not found:** Anthropic does not publish a CPU/RAM/disk recommendation for the computer-use reference container. It publishes the architecture (virtual display, Docker) but not a sizing table.

### Does it have to stay on all the time?

No. Browser and computer-use sessions are task-scoped, usually minutes. Battleships models 10-minute browser sessions and 15-minute computer-use sessions. A machine is created for the task, driven, and discarded. The exception is a workflow that must keep a logged-in browser profile: then the profile (cookies, local storage) must persist even if the machine does not.

### How it receives messages

Your application or agent loop drives the browser. It sends a goal or an action, receives a screenshot or DOM snapshot, decides the next action, and repeats. There is no inbound chat webhook unless you add one. Anthropic describes the loop:

> "A program that handles communication between Claude and the environment, sending Claude’s actions to the environment and returning the results (screenshots, command outputs) back to Claude."
> — [Anthropic computer use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)

### What it must keep between restarts

Usually nothing. The task state is in your application, and the sandbox is disposable. If the agent must stay logged in, keep the browser profile or cookies on a persistent volume; otherwise a fresh sandbox starts logged out.

### Browser, Docker and GPU

- **Browser:** required. This is the workload.
- **Docker:** optional. It is one way to package the browser and its drivers, but the sandbox provider can supply the image.
- **GPU:** not needed. Browsers render on the CPU; vision models run remotely. **Inferred** from the architecture pages, which describe screenshots sent to a model, not local inference.

### How much of the time it is actually busy

Battleships records about **3.3% average CPU** for both browser-use and computer-use presets, with 56% idle share and low peaks (26% CPU, 46% RAM for browser-use; 26% CPU, 23% RAM for computer-use):

> "cpuUtil": 0.033
> "ramUtil": 0.345
> "idleShare": 0.56
> "cpuPeakUtil": 0.26
> "ramPeakUtil": 0.46
> — [Battleships browseruse ranking](https://battleships.dev/data/rankings/browseruse.json)

> "cpuUtil": 0.033
> "ramUtil": 0.17300000000000001
> "idleShare": 0.56
> "cpuPeakUtil": 0.26
> "ramPeakUtil": 0.23
> — [Battleships cua ranking](https://battleships.dev/data/rankings/cua.json)

A browser agent is mostly waiting on page loads and the model. RAM, not CPU, is the binding resource (**inferred** from the RAM utilisation and the Chromium-per-session design).

### Official backends and hosting

The sandbox providers document browser and desktop modes:

> "The [E2B Desktop](https://github.com/e2b-dev/desktop) SDK gives your agent a full Linux desktop with mouse, keyboard, and screen capture APIs."
> — [E2B computer use](https://e2b.dev/docs/use-cases/computer-use)

> "Computer Use enables programmatic control of desktop environments within sandboxes."
> — [Daytona Computer Use](https://www.daytona.io/docs/en/computer-use/)

> "OpenClaw can run a **dedicated Chrome/Brave/Edge/Chromium profile** that the agent controls."
> — [OpenClaw browser](https://docs.openclaw.ai/tools/browser)

Two more of the 15 providers ship a desktop or browser template:

> "Claude Code, Codex, and the desktop (VNC, Xfce, Chromium)"
> — [InstaBox limits](https://instabox.sh/docs/limits)

> "`desktop` runs a graphical desktop that you drive with `sandbox.desktop` or `lizard sandbox desktop`."
> — [Lizard sandboxes](https://lizard.build/docs/sandboxes.md)

**Not found:** a first-party browser-agent guide from Modal, Vercel Sandbox, Blaxel, Sprites, Boat, boxd, Morph, Runtime or Sandboxer in the pages inspected. Lizard and InstaBox document desktop/browser templates, but not a browser-agent product. Several others can run a browser inside a general sandbox, but that is not the same as a documented browser-agent product.

### Managed one-click hosting, with price

| Provider | What it offers | Price | Source |
| --- | --- | --- | --- |
| Agent 37 | Personal plan with a built-in Chromium browser on Pro and above | Pro $29.99/mo (2 vCPU/8 GB/20 GB); Max $99.99/mo (4/16/40) | [Agent 37 personal](https://www.agent37.com/personal) |
| Browser Use Cloud | Hosted browser hours | "$0.02 / hour" | [Browser Use pricing](https://browser-use.com/pricing) |
| E2B, Daytona | Desktop/browser sandbox APIs, not a one-click agent product | Usage-priced | — |

> "Built-in browser (Chromium)"
> "2 vCPU · 8 GB RAM · 20 GB storage" / "$29.99/mo"
> — [Agent 37 personal](https://www.agent37.com/personal)

> "$0.02 / hour"
> — [Browser Use pricing](https://browser-use.com/pricing)

### Battleships preset

Two presets match, depending on whether the agent needs a browser only or a whole desktop.

`browseruse` — "Browser-use agents":

> "Agents that do tasks on websites for your users: open a real browser, read the page, click and fill forms. Sessions of about 10 minutes."
> — [Battleships presets](https://battleships.dev/data/presets.json)

```json
{"vcpu":2,"ram":4,"disk":10,"sessions":30000,"sessionMin":10,"concurrency":50,"alwaysOn":0,"snapshotGiB":0,"egress":300,"ipv4":0,"seats":2,"persistentDisk":false}
```

`cua` — "Computer-use agents":

> "Agents that use a computer the way a person does: they look at a desktop and a browser, then click and type. Sessions of about 15 minutes."
> — [Battleships presets](https://battleships.dev/data/presets.json)

```json
{"vcpu":4,"ram":8,"disk":20,"sessions":20000,"sessionMin":15,"concurrency":50,"alwaysOn":0,"snapshotGiB":0,"egress":300,"ipv4":0,"seats":2,"persistentDisk":false}
```

### Proposed workload for a small team

**Browser-use (primary).**

| Field | Value |
| --- | --- |
| vCPU | 2 |
| RAM | 4 GiB |
| Disk | 10 GiB |
| Machines | 50 concurrent |
| Machine-hours / month | 5,000 (30,000 sessions × 10 minutes) |
| Wall-clock hours / month | About 100 at 50 concurrent |
| CPU busy share | 3% average |
| Disk persists while stopped | No |

**Reasoning.** The Battleships browser-use preset is exactly 2 vCPU / 4 GiB / 10 GiB, and Browserless's published minimum is 2 cores / 4 GB. 30,000 ten-minute sessions a month is a realistic small-team workload: about 1,000 a day, with 50 running at once at peak. CPU is almost never the constraint; RAM is, because each Chromium instance is memory-hungry (**inferred**). Disk does not need to persist unless you keep logged-in profiles.

**Computer-use variant.**

| Field | Value |
| --- | --- |
| vCPU | 4 |
| RAM | 8 GiB |
| Disk | 20 GiB |
| Machines | 50 concurrent |
| Machine-hours / month | 5,000 (20,000 sessions × 15 minutes) |
| Wall-clock hours / month | About 100 at 50 concurrent |
| CPU busy share | 3% average |
| Disk persists while stopped | No |

**Reasoning.** A full desktop adds Xvfb, a window manager, VNC and a browser (**inferred** from the architecture pages), so Battleships doubles the shape to 4 vCPU / 8 GiB / 20 GiB. Daytona's default 1 vCPU / 1 GiB / 3 GiB is the wrong shape for this: it is a code sandbox default, not a desktop default. Use 8 GiB and check that the provider's image includes the desktop packages; Daytona says custom images need them installed:

> "Default snapshots include the packages required for Computer Use. Sandboxes created from custom images or custom snapshots, including custom [Linux VM snapshots](https://www.daytona.io/docs/en/snapshots#vm-snapshots), need the [VNC and desktop packages](https://www.daytona.io/docs/en/vnc-access#required-packages) installed in the image."
> — [Daytona Computer Use](https://www.daytona.io/docs/en/computer-use/)

---

## Proposed workloads at a glance

These are the primary proposals; each section has the team or scale variant and the reasoning.

| Use case | vCPU | RAM | Disk | Machines | Machine-hours / month | CPU busy | Disk persists while stopped |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hermes Agent | 2 | 4 GiB | 20 GiB | 1 | 730 | 6% | Yes |
| OpenClaw | 2 | 4 GiB | 20 GiB | 1 | 730 | 6% | Yes |
| Coding agent | 4 | 8 GiB | 40 GiB | 1 per developer | 160 per developer | 4% | Yes |
| Code interpreter | 2 | 4 GiB | 10 GiB | 10 concurrent | 333 | 17% | No |
| Browser agent | 2 | 4 GiB | 10 GiB | 50 concurrent | 5,000 | 3% | No |

The computer-use variant of the last row is 4 vCPU / 8 GiB / 20 GiB, 50 concurrent, 5,000 machine-hours, 3% CPU, no persistent disk.

---

## Cross-cutting notes

### Always-on is the exception, not the default

Only Hermes and OpenClaw are always-on in the normal chat setup. Coding agents, code interpreters and browser agents are task-scoped. The practical split:

| Use case | Always-on? | What drives it |
| --- | --- | --- |
| Hermes | Yes for polling chat + cron; no with webhook + auto-wake | Inbound chat message or scheduled job |
| OpenClaw | Yes for chat channels | Inbound chat message |
| Coding agent | No | Developer or CI task |
| Code interpreter | No | Your app's API call |
| Browser / computer-use | No | Your app's task loop |

### Disk persistence is about memory and logins

For Hermes and OpenClaw, the disk is the agent: memory files, session SQLite, skills, channel credentials. For a coding agent, the disk is the repository and the login. For a code interpreter or browser agent, the disk is usually disposable; persist only the outputs or the browser profile you need.

### Browser and Docker are optional except where they are the point

Hermes and OpenClaw can use a browser but do not require one. A coding agent usually needs Docker for services and tests, and a browser only for UI checks. A code interpreter needs neither. A browser agent needs a browser by definition; a computer-use agent needs a desktop image with a virtual display.

### GPU is not part of any of these workloads by default

In the workloads above, all five use cases call models over an API by default. A GPU is only needed if you run the model locally. Hermes states the local-model case directly: "For local models, ensure you have enough GPU VRAM" — [Hermes FAQ](https://hermes-agent.nousresearch.com/docs/reference/faq). E2B is explicit that its sandboxes are CPU-only: "E2B sandboxes are CPU-only, sized by vCPU and RAM only, with no GPU option in the SDKs, CLI, API, or a template definition." — [E2B FAQ](https://docs.e2b.dev/faq)

### What Battleships adds, and what it does not

Battleships is useful for the shape and duty cycle of each workload, and it names OpenClaw and Hermes in its `employees` preset. It is not vendor documentation, its presets are fleet-scale (50 always-on assistants; 2,200 eight-hour coding sessions; 200,000 one-minute interpreter runs), and its `idleShare` field is undefined in the public guide. Use the per-machine shape and the CPU average, then scale the machine count to your team.

### Open questions

- **Hermes cloud sizing:** the Docker table is the only first-party sizing table; Modal, Daytona and Vercel Sandbox sizing is left to the user.
- **OpenClaw general sizing:** the Raspberry Pi table is the only hardware table; the general install page lists only Node.js.
- **Coding agent disk:** neither Claude Code nor Codex publishes a disk minimum. The 30 GB Anthropic cloud ceiling and the 20 GB Battleships preset are the only anchors.
- **Computer-use sizing:** Anthropic publishes the architecture but not CPU/RAM/disk. The 4 vCPU / 8 GiB / 20 GiB shape comes from Battleships, not from Anthropic.
- **One-click hosting prices:** Northflank and Railway publish one-click OpenClaw templates but no price in the OpenClaw guide. Render's cheapest always-on shape that meets OpenClaw's 1 GB floor is the 1 CPU / 2 GB plan at $25/mo, not the $7/mo 512 MB plan.

Render's own price rows:

> "| Less than 1 CPU | $7/month | 512 MB RAM | 0.5c-512mb |"
> "| 1 CPU | $25/month | 2 GB RAM | 1c-2g |"
> — [Render pricing](https://render.com/pricing)

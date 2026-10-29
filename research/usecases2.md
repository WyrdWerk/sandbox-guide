# Use-case guides, second set: research notes

Research date: 2026-10-29. Desk research only; no account, sandbox, or purchase was used. Every factual claim below carries a source URL and an exact quote copied from the page. Where a page did not state something, the note says **not found** rather than guessing. Statements that combine sources or reason from them are marked **inferred**.

Prices are published list prices on 2026-10-29 and can change. n8n Cloud publishes in euros, so those figures stay in euros. Battleships is a secondary source: it is built by the boat.dev team, and its numbers are used only for the workload shape and duty cycle, not as vendor documentation.

> "Built by the boat.dev team; boat.dev is held to the same rules as everyone."
> — [Battleships guide for agents](https://battleships.dev/llms.txt)

## How to read the numbers

- **Minimum** is the smallest published configuration in which the software is documented to run, or the smallest shape that a published plan or preset supports. When no vendor publishes one, the table says so and the figure is marked **inferred**.
- **Recommended** is the vendor's own recommendation, or the smallest shape that avoids a known constraint. When it is inferred, the reasoning is in the section.
- **Duty cycle** is Battleships' `cpuUtil`, the share of running time the CPU is busy on average. It is a modelled average for a preset, not a measurement of your workload. Battleships also publishes `idleShare`, but its public guide does not define that field, so this document records it and does not interpret it.
- **Machine-hours** are one machine running for one hour. A task that runs four times a day for ten minutes is about 20 machine-hours a month, not 730.
- **Non-coder from the dashboard** means someone who does not write code can get the thing running from a browser. "Partly" means the dashboard creates the machine but a shell is still needed.

Battleships defines its workload fields as: "Fields: sessions a month, minutes per session, machines at once, machines on 24/7, CPU/RAM busy share (0-1), GiB kept, GiB egress." — [Battleships guide for agents](https://battleships.dev/llms.txt)

---

## 1. Workflow automation with n8n, self-hosted

### What it is

n8n is a visual workflow automation server. You draw a workflow on a canvas — a trigger, then steps that call APIs, transform data or ask a model — and n8n runs it on a machine you control. Self-hosting means you own the server, its database, its encryption key and its upgrades.

> "n8n is a fair-code licensed workflow automation tool that combines AI features with business process automation."
> — [n8n Docs](https://docs.n8n.io/)

> "Fair-code platform to build and deploy AI agents and workflows. Combine a visual canvas with custom code, run it self-hosted or in the cloud, and connect to 1500+ integrations."
> — [n8n README](https://github.com/n8n-io/n8n)

The two similar tools named in the brief take the same shape. Activepieces is a Docker Compose install with PostgreSQL and Redis:

> "Recommended. Docker Compose with PostgreSQL and Redis."
> — [Activepieces install overview](https://www.activepieces.com/docs/install/overview)

Windmill is a container plus PostgreSQL:

> "Windmill itself just requires 3 components: A Postgres database, which contains the entire state of Windmill, including the job queue."
> — [Windmill self-hosting](https://www.windmill.dev/docs/advanced/self_host)

Neither changes the hosting question: it is a small always-on web app with a database.

### Minimum and recommended CPU, RAM and disk

n8n does not publish a self-host minimum. What it does publish is the shape of its own Cloud instances, which is the closest first-party anchor:

> "Starter: 640MiB RAM, 10 millicore CPU burstable"
> "Pro-1 (10k executions): 640MiB RAM, 20 millicore CPU burstable"
> "Pro-2 (50k executions): 1280MiB RAM, 80 millicore CPU burstable"
> "Enterprise: 4096MiB RAM, 80 millicore CPU burstable"
> — [n8n Cloud data management](https://docs.n8n.io/deploy/use-n8n-cloud/configure-cloud/manage-your-data/)

> "Note that n8n itself consumes memory to run. On average, the software alone uses around 180MiB RAM."
> — [n8n Cloud data management](https://docs.n8n.io/deploy/use-n8n-cloud/configure-cloud/manage-your-data/)

> "n8n gives each instance up to 100GB of data storage."
> — [n8n Cloud data management](https://docs.n8n.io/deploy/use-n8n-cloud/configure-cloud/manage-your-data/)

| Resource | Minimum | Recommended |
| --- | --- | --- |
| CPU | 1 vCPU (inferred) | 2 vCPU |
| RAM | 640 MiB | 4 GiB |
| Disk | not published | 20 GiB |

**Recommended is inferred, not published.** 4 GiB is n8n's own Enterprise Cloud allowance and also the app limit in Lizard's n8n template, which explicitly says the limit is not a recommendation:

> "It sets an app limit of 4 vCPUs and 4 GiB RAM, plus PostgreSQL 18 with 1 GiB of storage. These are template settings, not measured resource needs or a promise that every workflow will fit."
> — [Lizard n8n template](https://lizard.build/deploy/n8n--n8n)

The honest reading: a single-user instance with a few workflows runs in 1 GiB, and 4 GiB is the size that survives a workflow that pulls a large JSON payload into memory. n8n warns that any node can do that:

> "n8n doesn't restrict the amount of data each node can fetch and process."
> — [Fix memory issues](https://docs.n8n.io/deploy/host-n8n/configure-n8n/scaling/fix-memory-issues)

### Does it have to stay on all the time?

Yes, if anything is supposed to arrive while nobody is watching. Both trigger types depend on the process being alive.

> "Production: n8n registers a production webhook when you publish the workflow."
> — [Webhook node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook)

> "Use the Schedule Trigger node to run workflows at fixed intervals and times. This works in a similar way to the Cron software utility in Unix-like systems."
> — [Schedule Trigger](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.scheduletrigger)

In queue mode the main process is the one holding timers and webhooks, which is why n8n tells you not to put it behind the webhook load balancer:

> "The main n8n instance handles timers and webhook calls, generating (but not running) a workflow execution."
> — [Enable queue mode](https://docs.n8n.io/deploy/host-n8n/configure-n8n/scaling/enable-queue-mode)

**The exception:** a host that wakes on an inbound HTTP request can serve webhooks while asleep, at the cost of a cold start on the first request. Schedules still will not fire while it sleeps. Agent 37 states this for its own n8n template:

> "With it on, n8n’s Schedule triggers do not fire while the instance sleeps; an incoming webhook does wake it, after a cold-start delay. Leave auto-sleep off for scheduled workflows."
> — [Agent 37 Host n8n](https://www.agent37.com/docs/agents-api/n8n)

### How it receives work

Two directions matter.

- **Inbound HTTPS.** A published workflow exposes a production URL under `/webhook/*`. The host must give that path a public HTTPS address, and the n8n instance must know its own public base URL so it can show and register correct callback URLs. Lizard's template spells out the setting:

> "n8n listens inside the app on port `5678`; clients reach it through the public HTTPS address. Set the webhook base URL to that public address so n8n registers reachable callback URLs with other services."
> — [Lizard n8n template](https://lizard.build/deploy/n8n--n8n)

- **An internal timer.** Schedule Trigger needs no inbound traffic at all; it is the instance's own clock. That is why a sleeping host misses scheduled runs.

Outbound calls are how the workflow does anything: HTTP Request nodes, app nodes and model nodes all leave the machine.

### What it must keep between restarts

The database is the installation. By default it is SQLite on the instance's disk:

> "By default, n8n uses SQLite. n8n also supports PostgreSQL."
> — [Database configuration](https://docs.n8n.io/deploy/host-n8n/configure-n8n/basic-configuration/use-environment-variables/database)

> "Running n8n with execution mode set to `queue` with an SQLite database isn't recommended."
> — [Enable queue mode](https://docs.n8n.io/deploy/host-n8n/configure-n8n/scaling/enable-queue-mode)

Credentials are encrypted with a key that n8n generates on first start:

> "n8n automatically generates an encryption key upon first startup."
> — [Enable queue mode](https://docs.n8n.io/deploy/host-n8n/configure-n8n/scaling/enable-queue-mode)

Lizard's template is blunt about what that means for a restore:

> "The separate Postgres database stores workflow records and encrypted credentials. **Recovering credentials also requires the original encryption key.** n8n normally generates that key on first launch and saves it under `~/.n8n`. A database backup alone cannot replace a lost key."
> — [Lizard n8n template](https://lizard.build/deploy/n8n--n8n)

So: keep the database and the encryption key. Losing the key is not a rollback, it is a re-entry of every credential.

### Browser, Docker and database

- **Browser:** no. The editor runs in the user's browser, not on the server.
- **Docker:** the documented production install is Docker Compose, and n8n's own README quick start requires Docker. npm is supported if you manage Node yourself.

> "Try n8n instantly with our install script (requires [Docker](https://www.docker.com/)):"
> — [n8n README](https://github.com/n8n-io/n8n)

> "n8n requires a Node.js version between 20.19 and 24.x, inclusive."
> — [Install with npm](https://docs.n8n.io/deploy/host-n8n/install-options/install-with-npm)

- **Database:** yes. SQLite is the default and is enough for one instance; PostgreSQL is the documented choice for queue mode and for anything that must survive being restored elsewhere.
- **GPU:** no, unless a workflow runs a local model.

### How much of the time it is actually busy

No preset measures n8n. The nearest modelled shape is Battleships' always-on assistant: 2 vCPU / 4 GiB, 5.8% average CPU and a 98% peak, because the machine is idle between runs and then bursts. n8n's own Cloud sizing agrees that the baseline is tiny — 10 millicore for Starter is one hundredth of a core — while a single big execution can consume everything it is given.

The ranking file records the fleet values directly: `"alwaysOn": 50`, `"cpuUtil": 0.058`, `"cpuPeakUtil": 0.98` — [Battleships employees ranking](https://battleships.dev/data/rankings/employees.json). That is 50 machines on 24/7, not one person; the per-machine shape is 2 vCPU / 4 GiB / 20 GiB.

Use the 5.8% as the average and size for the peak, not the average.

### The 15 providers: route, dashboard and evidence

| Provider | Route | Non-coder from the dashboard | What it takes |
| --- | --- | --- | --- |
| Agent 37 | one-click template | yes | `agent37-n8n` is a system template: official n8n image, public editor URL on port 5678, SQLite on the persistent disk, auto-sleep off by default. The dashboard create asks for an owner password. |
| Blaxel | manual only | no | Blaxel's n8n page is an integration tutorial (n8n calls a Blaxel agent), not a way to host n8n. No n8n image or template found. |
| Boat | manual | partly | Ubuntu VM with Docker and systemd. Install n8n as a systemd service, expose port 5678 with `host`, and keep the disk. No n8n guide. |
| boxd | manual | partly | Docker is preinstalled, custom domains are self-serve, and hibernation must be turned off for schedules. No n8n template or guide. |
| Cloudflare Sandbox | manual, poor fit | no | A container started by a Worker. Stopping it deletes its disk, so n8n's SQLite and encryption key would need external storage; no n8n guide found. |
| Daytona | manual | partly | Create a sandbox with auto-stop disabled, install n8n with npm, expose its port. n8n also recommends Daytona as the sandbox provider for its own Assistant feature, which is an endorsement of Daytona as a sandbox, not as an n8n host. |
| E2B | not suitable for always-on | no | Sandbox sessions are capped at 1 hour on Hobby and 24 hours on Pro. n8n needs a machine that outlives its schedule. |
| InstaBox | manual | partly | Docker is in the agent-browser template; turn auto-pause off, install n8n, publish port 5678. No n8n guide found. |
| Lizard | one-click template | yes | The strongest non-coder route: Deploy Now creates an n8n app plus Managed Postgres, wires the connection, and gives it a public HTTPS address. The template does not set an encryption key, a volume or Redis workers. |
| Modal | manual only | no | Modal is built for functions and task sandboxes, not a permanently running web app. No n8n guide or example found. |
| Morph | manual | partly | A Devbox can serve HTTP and wake on request, but a paused instance's own clock stops, so schedules need it kept running. No n8n guide. |
| Runtime | manual | partly | Docker and persistent sandboxes are documented; a custom domain and a persistent sandbox make n8n viable. No n8n guide found. |
| Sandboxer | manual | partly | Create with auto-stop and idle pause off, install n8n, run it under systemd, host the port. No n8n guide found. |
| Sprites | manual, CLI only | no | Fixed 8 vCPU / 100 GB shape, CLI-only, and a Sprite pauses when idle unless a service or task hold keeps it up. Expensive for n8n's actual load. |
| Vercel Sandbox | not suitable | no | Sandboxes are task-scoped microVMs with no always-on web app model. n8n would need a different Vercel product, not Sandbox. |

**Evidence for the routes above.** A quote is shown where a provider documents the route; rows with no quote are negative findings from that provider's documentation index, not guesses.

> "The `agent37-n8n` template runs n8n, the open-source workflow automation tool, on an Agent37 instance"
> — [Agent 37](https://www.agent37.com/docs/agents-api/n8n)

> "Build n8n workflows that forward chat messages to Blaxel-hosted AI agents via HTTP requests"
> — [Blaxel](https://docs.blaxel.ai/Tutorials/n8n)

> "Run a server, bot or worker 24/7: make a process come back by itself after stop, resume and fork with a systemd service."
> — [Boat](https://docs.boat.dev/long-running-tasks/always-on-services)

> "Docker Engine, Compose, and Buildx come pre-installed on every machine, with the daemon already running."
> — [boxd](https://docs.boxd.sh/guides/run-docker)

> "Stopping the instance deletes the files on its disk."
> — [Cloudflare Sandbox](https://developers.cloudflare.com/sandbox/files/)

> "For a production instance, n8n currently recommends Daytona as the sandbox provider instead."
> — [n8n docs on Daytona](https://docs.n8n.io/deploy/host-n8n/install-options/install-using-docker-compose)

> "Up to 1 hour per sandbox session."
> — [E2B](https://e2b.dev/pricing.md)

> "Commands, files, SSH and a visit to one of its public port URLs resume it by themselves."
> — [InstaBox](https://instabox.sh/docs/concepts)

> "This template creates one n8n app and a separate Managed Postgres database."
> — [Lizard](https://lizard.build/deploy/n8n--n8n)

> "The template does not set an explicit encryption key, attach Persistent Volumes to the app, or configure Redis workers."
> — [Lizard](https://lizard.build/deploy/n8n--n8n)

> "You can change this by passing a timeout of up to 24 hours to the Sandbox.create(...) function."
> — [Modal](https://modal.com/docs/guide/sandboxes)

> "When a request comes in through HTTP or an SSH-backed access path, the instance automatically resumes"
> — [Morph](https://cloud.morph.so/docs/documentation/instances/wake-on)

> "persistent: true keeps a sandbox running until you stop it, with no idle pause."
> — [Runtime](https://withruntime.com/docs/pricing)

> "`0` turns it off; the maximum is `10080` (7 days)."
> — [Sandboxer](https://sandboxer.com/docs/long-running)

> "Install with our install script (macOS/Linux)"
> — [Sprites](https://docs.fly.io/sprites/quickstart.md)

> "One sandbox per task: Hermes creates a sandbox on demand when the agent first runs a terminal command and reuses it for the rest of the task."
> — [Vercel Sandbox](https://vercel.com/docs/sandbox/ecosystem/hermes)

### Alternatives outside the 15, with price

| Option | What it is | Price on 2026-10-29 | Source |
| --- | --- | --- | --- |
| n8n Cloud | Hosted n8n, billed by workflow executions | Starter €20/mo billed annually; Pro €50/mo; Business €667/mo | [n8n Cloud](https://n8n.io/pricing/) |
| Activepieces Cloud | Open-source automation with a hosted option | Free $0; Plus $20/mo flat; Team $200/mo flat | [Activepieces Cloud](https://www.activepieces.com/pricing) |
| Windmill (self-hosted) | Open-source workflow and script runner; needs PostgreSQL | Free self-hosted; Cloud paid tiers | [Windmill (self-hosted)](https://www.windmill.dev/docs/advanced/self_host) |
| Lizard n8n template | One-click n8n plus Managed Postgres | Lizard Pro $19/mo including $19 of usage, then usage | [Lizard n8n template](https://lizard.build/deploy/n8n--n8n) |
| Agent 37 n8n template | One-click n8n on an always-on instance | Default 2 vCPU / 4 GB shape at $4.76/mo | [Agent 37 n8n template](https://www.agent37.com/docs/agents-api/templates) |

> "20€/mo, billed annually"
> — [n8n Cloud](https://n8n.io/pricing/)

> "$20 flat per month"
> — [Activepieces Cloud](https://www.activepieces.com/pricing)

> "The rule of thumb is 1 worker per 1vCPU and 1-2 GB of RAM."
> — [Windmill (self-hosted)](https://www.windmill.dev/docs/advanced/self_host)

> "Lizard Pro costs $19 a month and includes $19 of usage."
> — [Lizard n8n template](https://lizard.build/deploy/n8n--n8n)

> "Most templates default to 2 vCPU / 4 GB on the default instance type at $4.76 per month."
> — [Agent 37 n8n template](https://www.agent37.com/docs/agents-api/templates)

### Battleships preset

There is no n8n preset. The nearest is `employees` — always-on assistants with a persistent disk — and it is a shape match, not a workload match: its `required` list includes `browser`, and n8n does not need one.

```json
{"vcpu":2,"ram":4,"disk":20,"sessions":0,"sessionMin":0,"concurrency":0,"alwaysOn":50,"snapshotGiB":0,"egress":100,"ipv4":0,"seats":2,"persistentDisk":true}
```

That is 50 machines on 24/7, a fleet. The useful part is the per-machine shape: 2 vCPU, 4 GiB, 20 GiB, 5.8% average CPU, 98% peak.

### Proposed workload

| Field | Value |
| --- | --- |
| vCPU | 2 |
| RAM | 4 GiB |
| Disk | 20 GiB |
| Machines | 1 |
| Machine-hours / month | 730 |
| Wall-clock hours / month | 730 (always-on) |
| Hours / day | 24 |
| Days / month | 30 |
| Files must persist on the machine | Yes |
| CPU busy share | 5.8% average, 98% peak |
| Disk persists while stopped | Yes |

**Reasoning.** n8n's own Cloud instances run from 640 MiB to 4 GiB, and the software alone averages 180 MiB. 4 GiB is the Enterprise allowance and the Lizard template limit; it is the size that survives a node which loads a large payload. 20 GiB holds the database, execution history and any binary data. 730 hours is 24/7, which is the honest number for a webhook-and-schedule server. The 5.8% average is why a small machine is fine; the 98% peak is why it should not be 1 vCPU.

**Team variant.** One instance serves a small team; n8n Cloud's Starter plan includes unlimited users.

> "All plans include unlimited users & workflows and every integration."
> — [n8n pricing](https://n8n.io/pricing/)

The machine does not need to grow with the number of people until concurrent executions do. If workflows start to queue, add workers and Redis rather than making one machine bigger:

> "When running in queue mode, you have multiple n8n instances set up, with one main instance receiving workflow information (such as triggers) and the worker instances performing the executions."
> — [Enable queue mode](https://docs.n8n.io/deploy/host-n8n/configure-n8n/scaling/enable-queue-mode)

---

## 2. A Discord or Slack bot backed by an LLM

### What it is

A support or community bot is a small program with a token, a connection to the chat platform, and a loop: receive a message, assemble context, call a model, reply. The hosting question is decided almost entirely by how the platform delivers messages.

- **Discord** bots normally hold a persistent WebSocket to the gateway. Discord describes the connection as stateful and something the app must maintain:

> "Gateway connections are persistent WebSockets which introduce more complexity than sending HTTP requests or responding to interactions (like Slash Commands)."
> — [Discord Gateway](https://discord.com/developers/docs/topics/gateway)

> "Discord sends the app a Hello (opcode `10`) event containing a heartbeat interval in milliseconds."
> — [Discord Gateway](https://discord.com/developers/docs/topics/gateway)

- **Slack** offers both. Socket Mode holds a WebSocket and needs no public URL; the HTTP way needs a public Request URL.

> "Socket Mode allows your app to use the Events API and interactive features—*without* exposing a public HTTP **Request URL**."
> — [Using Socket Mode](https://docs.slack.dev/apis/events-api/using-socket-mode)

That split — outbound socket versus inbound request — is the whole hosting decision. A socket bot must stay awake. A request-style bot can sleep between messages if the host wakes on HTTP.

### Minimum and recommended CPU, RAM and disk

Neither Discord nor Slack publishes a CPU, RAM or disk requirement for a bot; their docs cover the API, not the host. **Not found** is the honest answer for a first-party floor.

The only published shape for this job is Battleships' `employees` preset: 2 vCPU / 4 GiB / 20 GiB per always-on assistant that answers messages. That is a modelled fleet shape, not a vendor requirement.

| Resource | Minimum | Recommended |
| --- | --- | --- |
| CPU | 1 vCPU | 2 vCPU |
| RAM | 1 GiB | 2–4 GiB |
| Disk | 5 GiB | 20 GiB |

**Inferred.** A Node bot with discord.js and a SQLite history idles in a few hundred megabytes; 1 GiB is enough for one guild and one model call at a time. 2 GiB is the safer buy because a model response, an embedding lookup and a burst of messages can overlap, and because the process must not be killed mid-reply. 20 GiB is not about the bot; it is about the logs, the message archive and the snapshots you will want after an incident.

### Does it have to stay on all the time?

It depends on the delivery method, not on the bot.

**Discord gateway: yes.** The bot holds a socket and must answer heartbeats or be disconnected:

> "From that point until the connection is closed, your app must continually send Discord a heartbeat every `heartbeat_interval` milliseconds. If your app fails to send a heartbeat event in time, your connection will be closed and you will be forced to Resume."
> — [Discord Gateway](https://discord.com/developers/docs/topics/gateway)

**Slack Socket Mode: yes.** The socket is refreshed every few hours, and the app has to reconnect:

> "No matter what, you'll need to handle connection refreshes once every few hours."
> — [Using Socket Mode](https://docs.slack.dev/apis/events-api/using-socket-mode)

**Slack HTTP Request URL: no.** Slack posts each event to a public HTTPS endpoint; the app only has to be running when the request arrives.

**Discord Interactions Endpoint URL: no.** A slash-command-only bot can be an HTTP service instead of a gateway client. Lizard's guide says so directly:

> "A bot that only answers slash commands through an **Interactions Endpoint URL** is an HTTP service instead: deploy it with a real port and give Discord its HTTPS URL."
> — [Host a Discord bot](https://lizard.build/docs/guides/discord-bot)

So a support bot that only answers `/ask` can be request-driven; a bot that reads every message in a community server needs the gateway and an always-on machine.

### How it receives work

- **Discord gateway:** outbound WSS to `wss://gateway.discord.gg/`, then heartbeats and event dispatch. No inbound port.

> "`wss://gateway.discord.gg/?v=10&encoding=json` is an example of a WSS URL an app may use to connect to the Gateway."
> — [Discord Gateway](https://discord.com/developers/docs/topics/gateway)

- **Slack Socket Mode:** the app calls `apps.connections.open` to get a WebSocket URL, then connects outbound.

> "Unlike a public HTTP endpoint, the WebSocket URL you listen to is not static. The URL is created at runtime by calling the [`apps.connections.open`](https://docs.slack.dev/reference/methods/apps.connections.open) method, and it refreshes regularly."
> — [Using Socket Mode](https://docs.slack.dev/apis/events-api/using-socket-mode)

- **HTTP style:** Discord and Slack both POST events to a public HTTPS URL you register. That is the only mode a request-driven host can serve.

> "A **Interactions Endpoint URL** is a public endpoint for your app where Discord can send your app HTTP-based interactions."
> — [Discord Interactions](https://discord.com/developers/docs/interactions/overview)

> "Request URLs operate similarly to [slash command](https://docs.slack.dev/interactivity/implementing-slash-commands) invocation URLs in that they receive an HTTP POST containing data in response to activity."
> — [Using HTTP Request URLs](https://docs.slack.dev/apis/events-api/using-http-request-urls)

Rate limits are part of the design. Discord allows 120 gateway events per connection per 60 seconds, and a bot may only identify 1,000 times in 24 hours:

> "Apps can send 120 [gateway events](https://docs.discord.com/developers/events/gateway-events) per [connection](https://discord.com/developers/docs/events/gateway#connections) every 60 seconds, meaning an average of 2 commands per second."
> — [Discord Gateway](https://discord.com/developers/docs/topics/gateway)

> "Clients are limited to 1000 `IDENTIFY` calls to the websocket in a 24-hour period."
> — [Discord Gateway](https://discord.com/developers/docs/topics/gateway)

That is why a host that restarts or sleeps the bot constantly is a bad host for a gateway bot: every cold start spends an identify.

### What it must keep between restarts

The bot can lose its process at any time; it cannot lose its tokens or its memory.

- **Tokens.** The Discord bot token and the Slack bot/app tokens are the identity. Discord treats a leaked token as full control:

> "Keep the token private: anyone with it controls the bot."
> — [Host a Discord bot](https://lizard.build/docs/guides/discord-bot)

- **Conversation state.** A support bot that forgets the last ten messages is a worse product. Lizard's guide puts it in a database rather than the container:

> "Files written inside the container are lost on the next deploy. Keep settings, scores or queues in [Managed Postgres](https://lizard.build/docs/addons/postgres.md)"
> — [Host a Discord bot](https://lizard.build/docs/guides/discord-bot)

- **A restart can replay work.** The same guide warns to make handlers idempotent:

> "Make handlers safe to run twice: a restart can replay work that was in progress."
> — [Host a Discord bot](https://lizard.build/docs/guides/discord-bot)

No disk persistence is needed for the code if you deploy from git, but the token and the history must survive.

### Browser, Docker and database

- **Browser:** no. A chat bot reads text and calls an API.
- **Docker:** optional. Most hosts run a Node or Python process directly; Docker helps when you want the same image locally and in production.
- **Database:** recommended. SQLite is fine for one replica; Postgres is the safe choice if you ever run two, because a second process would write the same SQLite file.
- **GPU:** no. The model is called over an API.

One replica per token is a hard rule, not a preference:

> "Each replica opens its own gateway session with the same token, so each one answers every message. Keep the bot service at one replica."
> — [Host a Discord bot](https://lizard.build/docs/guides/discord-bot)

### How much of the time it is actually busy

A bot is idle almost all the time and busy in short bursts when a message arrives and a model answers. Battleships' `employees` preset models exactly this job — assistants that answer messages and run scheduled jobs — at 5.8% average CPU with a 98% peak.

> "Assistant agents that each live on their own machine all the time (one per employee or customer, like OpenClaw or Hermes): they keep their memory and files, hold logins to your tools, answer messages, run scheduled jobs and use a browser."
> — [Battleships presets](https://battleships.dev/data/presets.json)

The average is low; the peak is a model call plus a burst of messages. Size for the peak.

### The 15 providers: route, dashboard and evidence

| Provider | Route | Non-coder from the dashboard | What it takes |
| --- | --- | --- | --- |
| Agent 37 | one-click, via OpenClaw or Hermes | yes | Not a custom-coded bot, but a working LLM bot in Discord or Slack: pick OpenClaw or Hermes on the personal plan, connect your own Discord/Slack account on Basic or above. The bot is the agent, not your code. |
| Blaxel | manual only | no | No bot guide found. A quiet WebSocket is treated as idle: Blaxel puts a sandbox into standby after 15 minutes without data on the socket, which is the wrong lifecycle for a Discord gateway bot. |
| Boat | manual | partly | A documented always-on pattern: run the bot as an enabled systemd service so it returns after stop, resume or fork, and keep its public URL with `host`. |
| boxd | manual | partly | Works if you turn off auto-hibernate and bot protection for the machine. Bot protection is on by default and blocks non-browser clients, which includes chat platforms. |
| Cloudflare Sandbox | not suitable for a gateway bot | no | A Worker plus a container can serve an HTTP-style Slack app, but a Discord gateway socket needs a process that stays connected; the sandbox lifecycle is built around requests and stopping. No bot guide found. |
| Daytona | manual | partly | Create a sandbox with `--auto-stop 0`, install the bot, keep it under a process manager. No bot guide found. |
| E2B | not suitable | no | Session limits (1 hour on Hobby, 24 hours on Pro) make it a task sandbox, not a bot host. |
| InstaBox | manual | partly | A general Linux box with Docker. Turn auto-pause off so the gateway socket stays connected. No bot guide found. |
| Lizard | official guide | no | The most complete first-party walkthrough: discord.js example, worker mode with no port, one replica per token, secrets, Managed Postgres. It is a CLI deploy, not a dashboard button. |
| Modal | official example, HTTP style only | no | Modal's Discord example is a slash-command service behind an ASGI app, not a gateway client. That fits Modal's request-scoped functions; a persistent socket does not. |
| Morph | manual, request-driven only | partly | HTTP services and wake-on-request exist, but an idle Devbox is paused, which drops a gateway socket. Suitable only for an HTTP-style bot. |
| Runtime | manual | partly | A persistent sandbox with Docker can host a bot; no bot guide found. |
| Sandboxer | manual | partly | Turn idle pause off, or keep a keep-awake file, and run the bot under systemd. No bot guide found. |
| Sprites | not suitable for a gateway bot | no | A Sprite pauses when idle even with services defined; a quiet socket bot would be paused. An HTTP-style bot behind a service is the only fit. |
| Vercel Sandbox | not suitable | no | Sandboxes are task-scoped and functions are request-scoped; there is no documented long-lived socket host. |

**Evidence for the routes above.** A quote is shown where a provider documents the route; rows with no quote are negative findings from that provider's documentation index, not guesses.

> "Message your agent from WhatsApp, Telegram, Discord, or Slack through your own accounts, on Basic and above."
> — [Agent 37](https://www.agent37.com/personal)

> "Idle connections, such as WebSockets with no data flow, have a 15-minute timeout"
> — [Blaxel](https://docs.blaxel.ai/knowledge-base/configuration-and-operation/understanding-sandbox-active-vs-standby-states-and-billing.md)

> "Run a server, bot or worker 24/7: make a process come back by itself after stop, resume and fork with a systemd service."
> — [Boat](https://docs.boat.dev/long-running-tasks/always-on-services)

> "Chat apps can’t pass [bot protection](https://docs.boxd.sh/guides/bot-protection), so turn it off for that machine:"
> — [boxd](https://docs.boxd.sh/use-cases/personal-assistants)

> "While an instance runs, Containers bill its memory and disk, whether or not anything inside it does work."
> — [Cloudflare Sandbox](https://developers.cloudflare.com/sandbox/concepts/lifetime/)

> "By default, Daytona sandboxes auto-stop after 15 minutes of inactivity."
> — [Daytona](https://www.daytona.io/docs/en/sandboxes#auto-stop-interval)

> "Up to 1 hour per sandbox session."
> — [E2B](https://e2b.dev/pricing.md)

> "Commands, files, SSH and a visit to one of its public port URLs resume it by themselves."
> — [InstaBox](https://instabox.sh/docs/concepts)

> "A gateway bot opens an outbound connection to Discord and serves no HTTP, so deploy it with `lizard up --port 0` (`containerPort=0`) and keep one replica per bot token."
> — [Lizard](https://lizard.build/docs/guides/discord-bot)

> "Slash commands send information from Discord server members to a service at a URL."
> — [Modal](https://modal.com/docs/examples/discord_bot)

> "When a request comes in through HTTP or an SSH-backed access path, the instance automatically resumes"
> — [Morph](https://cloud.morph.so/docs/documentation/instances/wake-on)

> "persistent: true keeps a sandbox running until you stop it, with no idle pause."
> — [Runtime](https://withruntime.com/docs/pricing)

> "Create that file for work our API can't see, such as a daemon streaming from a model:"
> — [Sandboxer](https://sandboxer.com/docs/long-running)

> "Services don't keep a Sprite from pausing."
> — [Sprites](https://docs.fly.io/sprites/concepts/services.md)

> "One sandbox per task: Hermes creates a sandbox on demand when the agent first runs a terminal command and reuses it for the rest of the task."
> — [Vercel Sandbox](https://vercel.com/docs/sandbox/ecosystem/hermes)

### Alternatives outside the 15, with price

| Option | What it is | Price on 2026-10-29 | Source |
| --- | --- | --- | --- |
| Agent 37 personal (OpenClaw/Hermes) | Managed chat agent with Discord and Slack channels | Basic $3.99/mo; Plus $9.99; Pro $29.99; Max $99.99 | [Agent 37 personal (OpenClaw/Hermes)](https://www.agent37.com/personal) |
| Render | Always-on web service or background worker | $7/mo for 512 MB; $25/mo for 1 CPU / 2 GB | [Render](https://render.com/pricing) |
| Cloudflare Workers (HTTP-style Slack app) | Request-driven app; no gateway socket | Free 100,000 requests/day; Paid $5/mo minimum | [Cloudflare Workers (HTTP-style Slack app)](https://developers.cloudflare.com/workers/platform/pricing/) |
| Lizard Pro | App platform worker plus Managed Postgres | $19/mo including $19 of usage | [Lizard Pro](https://lizard.build/deploy/n8n--n8n) |

> "$3.99/mo"
> — [Agent 37 personal (OpenClaw/Hermes)](https://www.agent37.com/personal)

> "| 1 CPU | $25/month | 2 GB RAM | 1c-2g |"
> — [Render](https://render.com/pricing)

> "The Workers Paid plan includes Workers, Pages Functions, Workers KV, Hyperdrive, and Durable Objects usage for a minimum charge of $5 USD per month for an account."
> — [Cloudflare Workers (HTTP-style Slack app)](https://developers.cloudflare.com/workers/platform/pricing/)

> "Lizard Pro costs $19 a month and includes $19 of usage."
> — [Lizard Pro](https://lizard.build/deploy/n8n--n8n)

### Battleships preset

`employees` is the direct match: its description names assistants that "answer messages" and keep memory, and it is the same always-on socket shape as a chat bot.

```json
{"vcpu":2,"ram":4,"disk":20,"sessions":0,"sessionMin":0,"concurrency":0,"alwaysOn":50,"snapshotGiB":0,"egress":100,"ipv4":0,"seats":2,"persistentDisk":true}
```

50 machines on 24/7 is a fleet, not one community bot. The per-machine shape is 2 vCPU / 4 GiB / 20 GiB at 5.8% average CPU.

### Proposed workload

| Field | Value |
| --- | --- |
| vCPU | 1 |
| RAM | 2 GiB |
| Disk | 10 GiB |
| Machines | 1 |
| Machine-hours / month | 730 |
| Wall-clock hours / month | 730 (always-on) |
| Hours / day | 24 |
| Days / month | 30 |
| Files must persist on the machine | Yes |
| CPU busy share | about 3% |
| Disk persists while stopped | Yes |

**Reasoning.** There is no vendor floor to quote. 1 vCPU / 2 GiB runs the runtime, a small database and one model call at a time; 10 GiB holds logs, message history and a snapshot. 730 hours is 24/7, because a gateway or Socket Mode bot drops its connection when the machine sleeps. 3% is below Battleships' 5.8% always-on average, which models a fleet of personal assistants rather than one community server.

**Scale variant.** Past roughly 2,500 guilds Discord requires sharding, which is a code change rather than a bigger machine:

> "Each shard can only support a maximum of 2500 guilds, and apps that are in 2500+ guilds _must_ enable sharding."
> — [Discord Gateway](https://discord.com/developers/docs/topics/gateway)

Before that point, scale the database and the model budget, not the vCPU. If you run more than one replica, move history to Postgres and use a queue so two workers never answer the same message.

---

## 3. Claude Code for a small team of three to five developers

### What it is

Claude Code is a terminal coding agent. A developer starts it in a repository, asks for a change, and it edits files and runs commands on the machine where it runs. For a team of three to five, three things have to be decided together: where each copy runs, whose Claude account it uses, and what happens to the repository and the login when the machine is replaced.

> "Claude Code is an agentic coding tool that reads your codebase, edits files, runs commands, and integrates with your development tools. Available in your terminal, IDE, desktop app, and browser."
> — [Claude Code overview](https://code.claude.com/docs/en/overview)

The important property for hosting is that it is single-user software with on-disk state, not a multi-tenant service:

> "Claude Code isn't built to be safe for multiple tenants: it's a command-line tool for one user, it keeps its state on disk, and its built-in tools run commands and change files on the machine it runs on."
> — [Vercel durable Claude Code](https://vercel.com/docs/agent-harnesses/claude-code)

### Minimum and recommended CPU, RAM and disk

Anthropic publishes a RAM floor and a processor requirement, but no CPU count and no disk figure:

> "**Hardware**: 4 GB+ RAM, x64 or ARM64 processor"
> — [Advanced setup](https://code.claude.com/docs/en/setup)

Its own hosted cloud sessions publish the ceiling instead:

> "- 4 vCPUs
> - 16 GB of RAM
> - 30 GB of disk"
> — [Configure cloud environments](https://code.claude.com/docs/en/cloud-environments)

| Resource | Minimum | Recommended per developer |
| --- | --- | --- |
| CPU | not published | 4 vCPU |
| RAM | 4 GiB | 8 GiB |
| Disk | not published | 40 GiB |

**Recommended is inferred.** 4 vCPU / 8 GiB sits between Anthropic's hosted 4 vCPU / 16 GiB and Battleships' 4 vCPU / 8 GiB coding preset. 8 GiB covers the CLI, a language server, tests and a couple of containers. 40 GiB is above the 30 GiB hosted ceiling and the 20 GiB preset because Docker images and package caches are what actually fill a development disk. Choose 16 GiB for a monorepo with heavy native builds.

### Does it have to stay on all the time?

No. Claude Code runs when a developer is working. The machine can stop between sessions, provided the repository and the login survive on disk. Anthropic's cloud sessions go further and reclaim the machine:

> "Cloud sessions stop after a period of inactivity and the session’s VM is reclaimed."
> — [Claude Code on the web](https://code.claude.com/docs/en/claude-code-on-the-web)

The exception is an agent left running a long build or test loop; that is a task, not a reason to keep the machine on all month.

### How it receives work

Nothing arrives from the internet in the normal setup. A person starts a session from the terminal, the IDE, the desktop app or the web. Automation can drive it through the Agent SDK or `claude -p`, but that is still outbound from a job you started, not an inbound endpoint. **Not found:** an inbound webhook interface in the Claude Code docs.

### What it must keep between restarts

Two things must survive a replaced machine: the work and the login.

**The login** lives in the home directory, not in the repository:

> "On Linux, credentials are stored in `~/.claude/.credentials.json` with file mode `0600`."
> — [Authentication](https://code.claude.com/docs/en/authentication)

> "Subscription OAuth credentials from `/login`. This is the default for Claude Pro, Max, Team, and Enterprise users."
> — [Authentication](https://code.claude.com/docs/en/authentication)

**A long-lived token** is the alternative for machines where nobody can complete a browser login:

> "For CI pipelines, scripts, or other environments where interactive browser login isn't available, generate a one-year OAuth token with `claude setup-token`:"
> — [Authentication](https://code.claude.com/docs/en/authentication)

**The work** is the cloned repository plus uncommitted changes. If the sandbox is disposable, the repository must be pushed or the disk must survive; otherwise the session's output is lost.

**Team setting:** the login is per developer, which is exactly why one machine per developer is the default. A shared machine would hold one person's credential and mix two people's uncommitted work.

### Browser, Docker and database

- **Browser:** optional. Needed only when the change has to be checked in a browser or the project's tests drive one.
- **Docker:** often. A real project needs its database, queue or service dependencies to run tests; Docker is the usual way to provide them.
- **Database:** no, not for Claude Code itself. The project may need one, which is a Docker concern.
- **GPU:** no. The model is called over an API.

### How much of the time it is actually busy

A coding session is bursty: the model thinks, the machine waits, then a build or test run saturates it. Battleships' `fullstack` preset models eight-hour coding sessions at 3.4% average CPU with a 47% peak.

> "Agents that build and ship software, each on its own machine for a work session of about 8 hours: Docker for services and test databases, a desktop and a browser to check the UI they built, and a disk that keeps the work between sessions."
> — [Battleships presets](https://battleships.dev/data/presets.json)

That is why 4 vCPU is right and 16 vCPU is waste: the average is tiny, the peak is a compile or a test suite, and the machine is idle while the model is thinking.

### The 15 providers: route, dashboard and evidence

| Provider | Route | Non-coder from the dashboard | What it takes |
| --- | --- | --- | --- |
| Agent 37 | one-click template | yes | `agent37-claude-code` is a system template on the developer's own Anthropic account. Team management and roles are on the Max personal plan; a template creates one instance, so five developers would mean five instances. |
| Blaxel | official guide | no | A written tutorial: run Claude Code inside a Blaxel sandbox against a codebase in another sandbox. CLI and SDK steps, not a dashboard button. |
| Boat | preinstalled | partly | Seven harnesses preinstalled on every sandbox, Claude Code among them. Create a sandbox from the dashboard or CLI, then run `claude`. |
| boxd | preinstalled | partly | Claude Code, Codex and OpenCode ship on every machine; the console opens a terminal or desktop. No shared-credential feature is documented, so each developer signs in on their own machine. |
| Cloudflare Sandbox | official guide | no | A Worker-driven sandbox that runs Claude Code against a GitHub repository and returns a diff. Requires Workers and a container deployment. |
| Daytona | official guide | partly | CLI walkthrough. The dashboard Playground opens a web terminal, so no local install is needed, but the setup is typed commands. |
| E2B | official guide and template | no | A prebuilt `claude` template plus a CLI/SDK guide, including headless `-p` runs. Per-task sandboxes, not a developer's persistent box. |
| InstaBox | preinstalled | partly | The default template includes Claude Code, Codex, Docker and a desktop. Create a machine and open its terminal or Computer tab; no Claude Code guide found. |
| Lizard | preinstalled and official guide | partly | A `claude` template plus a guide. The platform stores one Claude credential at account level and every sandbox can use it, so separate machines do not give separate logins. |
| Modal | manual only | no | No first-party Claude Code guide found. Modal is a Hermes backend, not a documented Claude Code host. |
| Morph | official example | no | A Claude Code example installs it with the official installer inside a Devbox. No team or login guidance. |
| Runtime | manual only | no | A sandbox can run it, but no Claude Code guide, template or harness was found in Runtime's docs. |
| Sandboxer | preinstalled and official guide | partly | `claude` is in the preinstalled agent list, and Sandboxer publishes a Claude Code guide. The dashboard has a Terminal tab. |
| Sprites | manual only | no | Sprites documents Claude Managed Agents, which is Claude's tool-call runtime, not Claude Code. No Claude Code guide found. |
| Vercel Sandbox | official guide | no | A durable Claude Code guide: one sandbox per session, with the multi-tenant warning that motivates one machine per developer. |

**Evidence for the routes above.** A quote is shown where a provider documents the route; rows with no quote are negative findings from that provider's documentation index, not guesses.

> "| `agent37-claude-code` | Claude Code, Anthropic’s coding agent, on your own Anthropic account: chat, code, files, shell. No browser or desktop. |"
> — [Agent 37](https://www.agent37.com/docs/agents-api/templates)

> "Run Claude Code inside a Blaxel sandbox to execute coding tasks on a hosted codebase, with persistent storage and secure network access."
> — [Blaxel](https://docs.blaxel.ai/Tutorials/Claude-Code)

> "The seven coding-agent harnesses on every sandbox (Claude Code, Codex, pi, OpenCode, Prime Agent, Kimi Code, Mistral Vibe), their models, and fast mode."
> — [Boat](https://docs.boat.dev/integrated-agents/harnesses-and-models)

> "Every boxd machine ships with three coding agents: **Claude Code** (`claude`), **Codex** (`codex`), and **OpenCode** (`opencode`)."
> — [boxd](https://docs.boxd.sh/use-cases/coding-agents)

> "Run [Claude Code ↗︎](https://code.claude.com/docs/en/overview) in a Linux sandbox to edit a GitHub repository from a prompt, then read its changes as a diff."
> — [Cloudflare Sandbox](https://developers.cloudflare.com/sandbox/coding-agents/claude-code/)

> "This guide walks you through running Claude Code inside a Daytona sandbox using the Daytona CLI."
> — [Daytona](https://www.daytona.io/docs/en/guides/claude/claude-code-run-cli-sandbox)

> "E2B provides a pre-built `claude` template with Claude Code already installed."
> — [E2B](https://docs.e2b.dev/agents/claude-code)

> "Claude Code, Codex, and the desktop (VNC, Xfce, Chromium)"
> — [InstaBox](https://instabox.sh/docs/limits)

> "Credentials belong to your Lizard account, not to a project, and every sandbox you start can use them."
> — [Lizard](https://lizard.build/docs/sandboxes/guides/claude-code)

> "instance.exec("curl -fsSL https://claude.ai/install.sh | sh")"
> — [Morph](https://cloud.morph.so/docs/examples/claude-code)

> "It opens with a shell running in the page, on your free hours."
> — [Runtime](https://withruntime.com/docs/start)

> "| Coding agents | `claude` (Claude Code), `codex`, `opencode`, `pi`, `kimi`, `vibe` (Mistral) |"
> — [Sandboxer](https://sandboxer.com/docs/machines)

> "Run Claude Managed Agents tool calls in a per-session Sprite"
> — [Sprites](https://docs.fly.io/sprites/integrations/claude-managed-agents.md)

> "Each session of [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) gets its own [Vercel Sandbox](https://vercel.com/docs/sandbox), and Claude Code runs only there"
> — [Vercel Sandbox](https://vercel.com/docs/agent-harnesses/claude-code)

### Alternatives outside the 15, with price

| Option | What it is | Price on 2026-10-29 | Source |
| --- | --- | --- | --- |
| Claude Team | Per-seat plan with central billing, SSO and admin tools; includes Claude Code | $25/seat/month monthly, $20 annual; Premium seat $125 monthly, $100 annual | [Claude Team](https://claude.com/pricing) |
| Claude Enterprise | Adds RBAC, SCIM, audit logs, compliance API | $20/seat/month billed annually plus usage at API rates, 20-seat minimum | [Claude Enterprise](https://claude.com/pricing) |
| Anthropic cloud sessions | Claude Code on Anthropic-managed VMs | Requires a Claude subscription; no separate price on the docs page | [Anthropic cloud sessions](https://code.claude.com/docs/en/sandbox-environments) |
| Agent 37 Max | One-click Claude Code instances plus team management and roles | $99.99/mo (4 vCPU / 16 GB / 40 GB) | [Agent 37 Max](https://www.agent37.com/personal) |

> "$20 Per seat / month if billed annually. $25 if billed monthly."
> — [Claude Team](https://claude.com/pricing)

> "US$20/seat/month, billed annually, 20 seat minimum."
> — [Claude Enterprise](https://claude.com/pricing)

> "requires a Claude subscription, and a connected GitHub account unless you launch with `claude --cloud`"
> — [Anthropic cloud sessions](https://code.claude.com/docs/en/sandbox-environments)

> "Team Management + roles"
> — [Agent 37 Max](https://www.agent37.com/personal)

### Battleships preset

`fullstack` is the match: each agent gets its own machine for an eight-hour work session, with Docker, a desktop, a browser and a persistent disk.

```json
{"vcpu":4,"ram":8,"disk":20,"sessions":2200,"sessionMin":480,"concurrency":100,"alwaysOn":0,"snapshotGiB":250,"egress":300,"ipv4":0,"seats":3,"persistentDisk":true}
```

2,200 sessions at 100 concurrent is a software factory. For five developers, take the per-machine shape (4 vCPU / 8 GiB / 20 GiB), raise the disk to 40 GiB, and multiply by five.

### Proposed workload

| Field | Value |
| --- | --- |
| vCPU | 4 |
| RAM | 8 GiB |
| Disk | 40 GiB |
| Machines | 1 per developer |
| Machine-hours / month | 160 per developer |
| Wall-clock hours / month | 160 per developer (8 h × 20 workdays) |
| Hours / day | 8 |
| Days / month | 20 |
| Files must persist on the machine | Yes |
| CPU busy share | 3.4% average, 47% peak |
| Disk persists while stopped | Yes |

**Reasoning.** Anthropic's floor is 4 GB RAM. Its hosted environment gives 4 vCPU / 16 GB / 30 GB, and Battleships gives 4 vCPU / 8 GB / 20 GB. 4 vCPU / 8 GiB / 40 GiB is the practical middle: enough for the CLI, a language server, tests and a couple of containers, with room for Docker images that the 20 GiB preset does not have. 160 hours is 8 hours a day for 20 workdays. The 3.4% average CPU is why a small machine is fine most of the day; the 47% peak is why it should not be 1 vCPU.

### One machine each, or one shared machine?

**One machine each.** The reason is not performance; it is that Claude Code is single-user software with state on disk:

> "Claude Code isn't built to be safe for multiple tenants: it's a command-line tool for one user, it keeps its state on disk, and its built-in tools run commands and change files on the machine it runs on."
> — [Vercel durable Claude Code](https://vercel.com/docs/agent-harnesses/claude-code)

A shared machine would hold one person's `~/.claude/.credentials.json`, one person's shell history and everyone's uncommitted changes in the same working tree. Separate machines also mean a runaway test run or a deleted file affects one developer.

**Team variant.** Five developers, five machines, 4 vCPU / 8 GiB / 40 GiB each, 800 machine-hours a month in total. The cost scales with people, not with concurrency, because nobody codes eight hours without a break.

### How logins are kept

Three models, and they are not equivalent:

1. **Each developer logs in with their own account.** On a Team plan, the admin invites them and they sign in:

> "Team members install Claude Code and log in with their claude.ai accounts."
> — [Authentication](https://code.claude.com/docs/en/authentication)

The credential lands in `~/.claude/.credentials.json` on Linux, so it survives a stopped sandbox if the disk survives, and dies with the sandbox if it does not.

2. **One long-lived token for automation.** `claude setup-token` mints a one-year OAuth token for scripts and CI, not for people.

3. **One platform-level credential shared by every sandbox.** Some managed sandbox platforms attach a single Claude credential to the account rather than to a person. Lizard says so plainly:

> "Credentials belong to your Lizard account, not to a project, and every sandbox you start can use them."
> — [Run Claude Code in a sandbox](https://lizard.build/docs/sandboxes/guides/claude-code)

That is convenient for a solo developer and wrong for a team that wants per-person usage and revocation: five machines would still be one Claude login. If per-developer attribution matters, use each person's own account inside their own sandbox, or a Team plan with SSO and per-user seats.

### Team features that matter

> "**Claude for Teams**: self-service plan with collaboration features, admin tools, SSO, billing management, and [server-managed settings](https://code.claude.com/docs/en/server-managed-settings.md) for organization-wide Claude Code configuration. Best for smaller teams."
> — [Authentication](https://code.claude.com/docs/en/authentication)

Team covers 2–150 people, central billing, SSO, connector admin controls and usage analytics:

> "For teams of 2 to 150"
> — [Claude pricing](https://claude.com/pricing)

Enterprise adds domain capture, role-based access, SCIM, audit logs and the compliance API. For three to five developers, Team is the right tier; Enterprise's 20-seat minimum is the reason not to start there.

### Repositories

The repository is cloned into each developer's machine, or cloned by Anthropic's cloud session from GitHub. Either way it must be pushed before the machine is destroyed; a sandbox disk is a cache, not a backup.

---

## 4. A scheduled web scraper that runs a few times a day

### What it is

A scheduled scraper is a short batch job. A scheduler starts it, it fetches pages, extracts fields, writes the result somewhere durable, and exits. The interesting parts are the scheduler and the storage, not the machine.

Two kinds of scrape decide the size:

- **HTTP fetch.** Download the HTML, parse it, save rows. A small machine is enough.
- **Headless browser.** Launch Chromium, render the page, wait for the DOM, extract. That needs more memory and a browser binary, and it is what Battleships' `scrape` preset models.

> "A startup collecting data from websites with headless browsers: about 100,000 short visits a month, 50 at a time."
> — [Battleships presets](https://battleships.dev/data/presets.json)

The job runs for minutes, not hours. The machine should not be billed for the other 23 hours.

### Minimum and recommended CPU, RAM and disk

No scraper vendor publishes a CPU/RAM/disk floor, and Playwright's system requirements list Node and operating-system versions, not memory:

> "Node.js: latest 22.x, 24.x or 26.x."
> — [Playwright introduction](https://playwright.dev/docs/intro)

The only published shape for this job is Battleships' `scrape` preset: 1 vCPU / 2 GiB / 5 GiB per visit, modelled at 40% CPU while a browser is open.

| Resource | Minimum (HTTP only) | Recommended (headless browser) |
| --- | --- | --- |
| CPU | 1 vCPU | 2 vCPU |
| RAM | 1 GiB | 2–4 GiB |
| Disk | 5 GiB | 20 GiB |

**Inferred.** An HTTP fetch and parse fits in 1 GiB. A headless Chromium plus the page it renders is the memory hog; 2 GiB is the smallest comfortable size and 4 GiB lets two pages render at once. 20 GiB is for the browser binary, logs and a local copy of the results, not for the scrape itself.

If the pages are static, skip the browser entirely. That halves the memory and removes the largest source of flakiness.

### Does it have to stay on all the time?

No — provided the scheduler is outside the machine.

That distinction is the one that trips people up. A crontab inside a sandbox only fires while the sandbox is running. Agent 37 states it directly:

> "A crontab inside the container only runs while the container is running, so on an instance with auto-sleep it stops firing the moment the instance sleeps"
> — [Agent 37 Crons](https://www.agent37.com/docs/agents-api/crons)

boxd makes the same point from the other direction — its scheduler is a platform service that wakes the machine:

> "**Schedules.** The platform holds the next time any `every(...)` on the machine is due and wakes a sleeping machine, on standby or hibernated, shortly before it."
> — [boxd Jobs](https://docs.boxd.sh/guides/automations/jobs)

So the design choice is: platform cron plus a stopped machine (cheap), or an always-on machine with its own cron (simple, and billed 24/7).

### How it receives work

The normal trigger is time, not traffic.

- **Platform cron.** The scheduler is a service; each firing starts a run.

> "Cron Triggers allow users to map a cron expression to a Worker using a [`scheduled()` handler](https://developers.cloudflare.com/workers/runtime-apis/handlers/scheduled/) that enables Workers to be executed on a schedule."
> — [Cloudflare Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/)

- **A job service.** Runtime runs the command in a fresh sandbox per firing:

> "A job runs a command in a fresh sandbox. It runs once, at a time you choose, or on a cron schedule."
> — [Runtime scheduled jobs](https://withruntime.com/docs/jobs)

- **A timer inside the machine.** This only works while the machine runs. It is the right choice only if the machine is always on for another reason.

An inbound webhook is a useful second trigger ("scrape now"), but it is not the schedule.

### What it must keep between restarts

Almost nothing on the machine needs to survive; the output does.

Runtime is explicit that a job starts clean and that data must be put somewhere else:

> "A run never starts in an existing sandbox, whether running, paused or stopped. Every run is a fresh sandbox. To keep a sandbox's whole disk, use a [persistent sandbox](./javascript#keep-a-sandbox-running) and run the command in it yourself. To keep data for a job, put it on a volume."
> — [Runtime scheduled jobs](https://withruntime.com/docs/jobs)

So the durable set is:

- **Results.** A database table, an object store bucket, or a file in a volume. Not the run's own disk.
- **Session state.** If the site requires a login, the cookie jar or browser profile is the expensive thing to rebuild; store it encrypted.
- **A cursor.** Without one, a rerun after a failure duplicates rows.
- **Logs.** A short retention is enough; you need to know which pages failed, not to keep every HTML body.

### Browser, Docker and database

- **Browser:** optional. A headless Chromium is required only when the data is rendered by JavaScript or the site blocks plain HTTP clients. It is also the largest memory cost.
- **Docker:** optional. Useful to pin the browser and its dependencies into an image so the run is identical every time.
- **Database:** optional on the machine, mandatory somewhere. Results written to the run's own disk disappear with the run.
- **GPU:** no.

### How much of the time it is actually busy

While a scrape runs, the CPU is genuinely busy: Battleships models its `scrape` preset at 40% average CPU with a 64% peak, because a headless browser is doing real work. But the duty cycle over a day is tiny — a few ten-minute runs is well under 5% of the month.

> "A startup collecting data from websites with headless browsers: about 100,000 short visits a month, 50 at a time."
> — [Battleships presets](https://battleships.dev/data/presets.json)

The 40% figure describes the run, not the month. Do not size an always-on machine as if it were busy all day.

### The 15 providers: route, dashboard and evidence

| Provider | Route | Non-coder from the dashboard | What it takes |
| --- | --- | --- | --- |
| Agent 37 | platform cron or n8n schedule | partly | Platform crons wake a sleeping agent instance and run a prompt; they are not available on `agent37-base` or `agent37-n8n`. For a script, the n8n template with auto-sleep off is the other route. |
| Blaxel | sandbox schedules | no | Cron, one-off `at` and `sleep` schedules run a command inside a sandbox, with an execution history. Up to 100 schedules per sandbox. Created by SDK or API. |
| Boat | manual, timer inside the machine | partly | No scheduler found. A systemd timer in an always-on sandbox works, but the machine is billed 24/7. The job-run pattern can also create a sandbox per run. |
| boxd | automation schedule | partly | A `*.run.ts` script registers a schedule; the platform wakes a sleeping machine shortly before it is due and fires a missed slot once on wake. Best fit for this job among the sandbox providers. |
| Cloudflare Sandbox | Workers Cron Trigger | partly | The cron is a Workers feature, not a Sandbox feature: the scheduled Worker can start a container for the scrape. CPU per cron invocation is capped at 15 minutes on the paid plan. |
| Daytona | manual, external scheduler | no | No cron or schedule feature found in the docs index. You would call the API from an external scheduler and create a sandbox per run. |
| E2B | manual, external scheduler | no | No cron feature found. E2B is an SDK/CLI sandbox; the schedule must live in your app or another service. |
| InstaBox | manual, external scheduler | no | No cron feature found. The machine can be woken by an API call or a request to a public port, so an external scheduler is the route. |
| Lizard | n8n template with Schedule Trigger | yes | Lizard has no sandbox cron, but its one-click n8n template gives a non-coder a Schedule Trigger node and a place to keep results in Postgres. That is the practical route here. |
| Modal | function schedule | no | Cron schedules attach to a Modal function; the function can do the scrape or create a sandbox. Code-defined, not a dashboard schedule. |
| Morph | manual, external trigger | no | No cron found. Wake-on-HTTP plus an external scheduler can work, but the Devbox's own clock stops while paused. |
| Runtime | scheduled job | partly | Jobs run a command in a fresh sandbox on a cron, keep exit code and output, and have a Jobs page in the account. Results must go to a volume or external store. |
| Sandboxer | manual, external scheduler | no | No cron found. Auto-stop and idle pause are configurable, so an external scheduler plus the API is the route. |
| Sprites | manual, external scheduler | no | No cron found. The Tasks API holds a Sprite awake during a run; something outside must start it. |
| Vercel Sandbox | Cron Job | partly | Vercel Cron invokes a function; the function can create a sandbox for the scrape. Hobby is limited to once a day, which fails this use case; Pro allows once a minute. |

**Evidence for the routes above.** A quote is shown where a provider documents the route; rows with no quote are negative findings from that provider's documentation index, not guesses.

> "A platform cron is outside the instance: it fires whether the instance is awake or asleep"
> — [Agent 37](https://www.agent37.com/docs/agents-api/crons)

> "Schedules run a process inside a sandbox automatically, without you triggering it from your client."
> — [Blaxel](https://docs.blaxel.ai/Sandboxes/Schedules)

> "Run a server, bot or worker 24/7: make a process come back by itself after stop, resume and fork with a systemd service."
> — [Boat](https://docs.boat.dev/long-running-tasks/always-on-services)

> "The platform holds the next time any `every(...)` on the machine is due and wakes a sleeping machine, on standby or hibernated, shortly before it."
> — [boxd](https://docs.boxd.sh/guides/automations/jobs)

> "Cron Triggers allow users to map a cron expression to a Worker using a [`scheduled()` handler](https://developers.cloudflare.com/workers/runtime-apis/handlers/scheduled/) that enables Workers to be executed on a schedule."
> — [Cloudflare Sandbox](https://developers.cloudflare.com/workers/configuration/cron-triggers/)

> "Commands, files, SSH and a visit to one of its public port URLs resume it by themselves."
> — [InstaBox](https://instabox.sh/docs/concepts)

> "This template creates one n8n app and a separate Managed Postgres database."
> — [Lizard](https://lizard.build/deploy/n8n--n8n)

> "Modal facilitates this through function schedules."
> — [Modal](https://modal.com/docs/guide/cron)

> "When a request comes in through HTTP or an SSH-backed access path, the instance automatically resumes"
> — [Morph](https://cloud.morph.so/docs/documentation/instances/wake-on)

> "A job runs a command in a fresh sandbox. It runs once, at a time you choose, or on a cron schedule."
> — [Runtime](https://withruntime.com/docs/jobs)

> "Two things stop one on its own, and you control both: **idle auto-pause**, which pauses a sandbox nobody is using and wakes it on the next use, and **auto-stop**, a hard deadline."
> — [Sandboxer](https://sandboxer.com/docs/long-running)

> "Keep a Sprite from pausing mid-task with the Tasks API"
> — [Sprites](https://docs.fly.io/sprites/keeping-sprites-running.md)

> "Hobby accounts are limited to cron jobs that run **once per day**."
> — [Vercel Sandbox](https://vercel.com/docs/cron-jobs/usage-and-pricing)

### Alternatives outside the 15, with price

| Option | What it is | Price on 2026-10-29 | Source |
| --- | --- | --- | --- |
| Cloudflare Workers Cron Triggers | Scheduled Worker; can fetch and parse without a server | Free 100,000 requests/day; Paid $5/mo minimum with 15 minutes CPU per cron invocation | [Cloudflare Workers Cron Triggers](https://developers.cloudflare.com/workers/platform/pricing/) |
| Vercel Cron Jobs | Scheduled function invocation | Included on all plans; Hobby once/day, Pro once/minute; Pro $20/mo platform fee | [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs/usage-and-pricing) |
| Modal cron | Scheduled function, usage-billed | No plan fee; compute billed per second | [Modal cron](https://modal.com/docs/guide/cron) |
| n8n Schedule Trigger | Visual schedule plus any HTTP or browser step | Self-hosted free; n8n Cloud from €20/mo | [n8n Schedule Trigger](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.scheduletrigger) |

> "Max of 15 minutes of CPU time per [Cron Trigger](https://developers.cloudflare.com/workers/configuration/cron-triggers/) or [Queue Consumer](https://developers.cloudflare.com/queues/configuration/javascript-apis/#consumer) invocation"
> — [Cloudflare Workers Cron Triggers](https://developers.cloudflare.com/workers/platform/pricing/)

> "| **Pro**        | 100 cron jobs                       | Once per minute      | Per-minute               |"
> — [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs/usage-and-pricing)

> "Modal facilitates this through function schedules."
> — [Modal cron](https://modal.com/docs/guide/cron)

> "Use the Schedule Trigger node to run workflows at fixed intervals and times."
> — [n8n Schedule Trigger](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.scheduletrigger)

### Battleships preset

`scrape` is the shape match, but its volume is roughly a thousand times this use case.

```json
{"vcpu":1,"ram":2,"disk":5,"sessions":100000,"sessionMin":3,"concurrency":50,"alwaysOn":0,"snapshotGiB":0,"egress":500,"ipv4":0,"seats":1,"persistentDisk":false}
```

100,000 visits of three minutes each is a startup's crawler. A few runs a day is closer to 120 visits a month. Keep the 1 vCPU / 2 GiB / 5 GiB per-visit shape and the 40% busy figure; ignore the session count and the concurrency.

### Proposed workload

| Field | Value |
| --- | --- |
| vCPU | 1 |
| RAM | 2 GiB |
| Disk | 10 GiB |
| Machines | 1 |
| Runs | 4 a day × 10 minutes |
| Tasks / month | 120 |
| Machine-hours / month | about 20 |
| Wall-clock hours / month | about 20 |
| Hours / day | about 0.7 (four 10-minute runs) |
| Days / month | 30 |
| Files must persist on the machine | No (results live elsewhere) |
| CPU busy share | 40% during a run, under 2% of the month |
| Disk persists while stopped | Yes, for the browser and logs; results live elsewhere |

**Reasoning.** Four ten-minute runs a day is 40 minutes a day, about 20 machine-hours a month. 1 vCPU / 2 GiB / 10 GiB is Battleships' per-visit shape with room for the browser binary and logs. The CPU is 40% busy while a browser is open and idle otherwise. Results must be written to a database, object store or volume, because a fresh run starts clean on the job-style hosts.

**Scale variant.** If the scrape grows to hourly across hundreds of pages, the shape changes before the machine does: run several sandboxes in parallel and keep the scheduler outside them. At that point the 50-concurrent `scrape` preset is the right model, and the cost is dominated by machine-hours rather than by the scheduler.

---

## 5. Hosting a remote MCP server over HTTP

### What it is

The Model Context Protocol is how an AI client discovers and calls tools. A server can be local (the client starts it as a subprocess and talks over stdio) or remote (the client connects to an HTTPS URL).

> "The protocol currently defines two standard transport mechanisms for client/server communication:
>
> 1. [stdio](#stdio), communication over standard in and standard out
> 2. [Streamable HTTP](#streamable-http)"
> — [MCP specification: Transports](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports)

Remote means HTTP, and Claude requires it to be reachable from the internet:

> "A remote server runs on infrastructure you host and is reachable over the internet."
> — [Build an MCP server for Claude](https://claude.com/docs/connectors/building)

> "HTTP servers are the recommended option for connecting to remote MCP servers. This is the most widely supported transport for cloud-based services."
> — [Claude Code MCP](https://code.claude.com/docs/en/mcp)

So the hosting question is small but strict: a public HTTPS endpoint that speaks Streamable HTTP, stays reachable, and holds whatever authentication you choose.

### Minimum and recommended CPU, RAM and disk

No vendor publishes a minimum for an MCP server, because the protocol says nothing about the host. What the host must do is small: accept an HTTP POST, run a tool, return JSON.

| Resource | Minimum | Recommended |
| --- | --- | --- |
| CPU | 1 vCPU (shared is fine) | 1 vCPU |
| RAM | 512 MiB | 1 GiB |
| Disk | 1 GiB | 10 GiB |

**Inferred.** A stateless TypeScript or Python MCP server is a small HTTP process; 512 MiB is enough to start it and serve a handful of clients. 1 GiB leaves room for a framework, a database client and a burst of concurrent calls. Disk matters only for logs, a session store or a local cache.

The shape changes if the tools are heavy — a server that runs code, renders a browser or queries a large local index is really a compute service, and should be sized like one. Cloudflare's free Workers allowance is a useful sanity check for the light end: 10 milliseconds of CPU per invocation.

> "**Free** | 100,000 per day | No charge for duration | 10 milliseconds of CPU time per invocation"
> — [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)

### Does it have to stay on all the time?

It depends on whether the host can wake on an inbound request.

**Always on** is the simple answer: the client may call at any time, and a server that is asleep is a failed tool call.

**Wake on request** is the cheaper answer, and it is documented by several hosts. Lizard describes the trade-off precisely:

> "The server keeps running between calls, and Lizard bills its measured CPU and memory while it runs. To cut idle cost, turn on [sleep when idle](https://lizard.build/docs/cli/sleep.md): `lizard sleep --on --service mcp`. Turning it on restarts the service once. After a set time without requests (10 minutes by default), the service sleeps; the next request wakes it, so that first call takes longer."
> — [Host a remote MCP server](https://lizard.build/docs/guides/deploy-mcp-server)

A cold start of a few seconds is usually acceptable for a tool call; it is not acceptable if the client has a short timeout. Check the client's tool timeout before choosing sleep.

> "Tool call timeout | 240 seconds per tool call"
> — [Build an MCP server for Claude](https://claude.com/docs/connectors/building)

### How it receives work

The server is passive: it waits for the client.

> "In the **Streamable HTTP** transport, the server operates as an independent process that can handle multiple client connections. This transport uses HTTP POST and GET requests."
> — [MCP specification: Transports](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports)

> "The client **MUST** use HTTP POST to send JSON-RPC messages to the MCP endpoint."
> — [MCP specification: Transports](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports)

So the host needs one public HTTPS path (commonly `/mcp`) that accepts POST, and optionally GET for streaming. There is no outbound connection to establish and no webhook to register; the client brings the traffic.

### What it must keep between restarts

A stateless MCP server can lose its disk on every deploy. A stateful one cannot.

- **Nothing.** The common design is a fresh server object per request:

> "The handler is stateless: each request gets a fresh `McpServer` from a factory function, so the server needs no Durable Object or session."
> — [Build a Remote MCP server](https://developers.cloudflare.com/agents/model-context-protocol/guides/remote-mcp-server/)

- **Keys and registrations.** If you use OAuth, the signing key and client registrations must survive restarts or every client has to re-authorise.

> "The generated token expires after one hour. The private signing key is not saved. Use your own token issuer and rotation process for a lasting deployment; keep its private key outside the server."
> — [Host a remote MCP server](https://lizard.build/docs/guides/deploy-mcp-server)

- **Sessions.** The spec allows a server to assign a session ID; if you do, the session store must be shared or sticky.

- **Tool data.** Keep it in a database, not in the server's memory. The server is a thin adapter.

### Browser, Docker and database

- **Browser:** no, unless a tool itself browses. The MCP server is an HTTP adapter.
- **Docker:** optional. Useful to pin the runtime and to deploy the same image to any host.
- **Database:** optional. A stateless server needs none; a server whose tools query data needs the database, which can live elsewhere.
- **GPU:** no. Models are on the client side.

### How much of the time it is actually busy

An MCP server is idle between tool calls and busy for milliseconds when one arrives. There is no preset for it. The nearest always-on shape is Battleships' `employees`, at 5.8% average CPU — but that models an agent doing work, not a thin HTTP adapter, so 2% is a more honest estimate for a server whose tools are API calls.

The practical consequence: do not buy CPU for an MCP server. Buy reachability, a stable URL and a fast cold start.

### The 15 providers: route, dashboard and evidence

| Provider | Route | Non-coder from the dashboard | What it takes |
| --- | --- | --- | --- |
| Agent 37 | manual | no | No MCP template. A custom image can run the server and every port gets a public `https://{instanceId}-{port}.agent37.app` URL, but there is no MCP guide. |
| Blaxel | official quickstart and deploy | no | `bl new mcp` scaffolds a TypeScript or Python server using Streamable HTTP; deploy it as a Blaxel Function with a global HTTP endpoint. CLI, not dashboard. |
| Boat | manual | partly | Run the server in the sandbox and expose its port; Boat gives a public URL for the port and keeps it stable across resume. No MCP guide found. |
| boxd | manual | partly | A machine plus a self-serve custom domain is a clean MCP host. No MCP guide found. |
| Cloudflare Sandbox | one-click Workers template | yes | The clearest non-coder route: a Deploy to Workers button creates a remote MCP server at `*.workers.dev/mcp`. The Sandbox product is not involved; this is a Worker. |
| Daytona | manual; its MCP server is a control plane | no | Daytona documents an MCP server that lets agents operate Daytona sandboxes. That is not a way to host your own server for Claude. |
| E2B | manual; the gateway consumes MCP servers | no | E2B's MCP gateway runs MCP tools inside a sandbox for your agent; it is a client-side integration, not hosting your server for remote clients. |
| InstaBox | manual | partly | A public port works, but published ports are unauthenticated: anyone with the URL reaches the whole service. Put auth in the server. |
| Lizard | official guide | no | A complete guide: Streamable HTTP, bearer-token check, health endpoint, public HTTPS service, and sleep-when-idle. CLI deploy. |
| Modal | official example | no | A stateless FastMCP server behind FastAPI, deployed as a Modal app. Code-defined, no dashboard template. |
| Morph | manual | partly | HTTP services and wake-on-request make a Devbox a workable MCP host. No MCP guide found. |
| Runtime | manual; catalog MCP servers are private | partly | Runtime's catalog MCP servers run in a sandbox at private URLs for your agent. Hosting your own for external clients is a normal sandbox plus a custom domain; no guide found. |
| Sandboxer | official guide | partly | A detailed guide to running each MCP server in its own sandbox, bridged from stdio to Streamable HTTP and hosted on a private URL with a per-sandbox token. Suited to your own clients, not to Claude's web connector. |
| Sprites | manual; its MCP server is a control plane | no | Sprites publishes a remote MCP server for operating Sprites. Hosting your own is a service plus a port; no guide found. |
| Vercel Sandbox | manual | no | A sandbox port gets a public URL, but there is no MCP hosting guide and the sandbox is task-scoped. A Vercel Function would be the simpler host. |

**Evidence for the routes above.** A quote is shown where a provider documents the route; rows with no quote are negative findings from that provider's documentation index, not guesses.

> "Any other port an instance serves, including the built-in dashboard, terminal, and file browser, is reachable at its derivable `https://{instanceId}-{port}.agent37.app` URL"
> — [Agent 37](https://www.agent37.com/docs/agents-api/templates)

> "These servers can be interacted with using HTTP on the server's global endpoint."
> — [Blaxel](https://docs.blaxel.ai/Functions/Create-MCP-server)

> "Public URLs for the ports of a sandbox."
> — [Boat](https://docs.boat.dev/pricing)

> "Both are self-serve. boxd verifies your DNS and issues TLS certificates automatically."
> — [boxd](https://docs.boxd.sh/guides/custom-domains)

> "This guide shows how to deploy a remote MCP server on Cloudflare using [Streamable HTTP transport](https://developers.cloudflare.com/agents/model-context-protocol/protocol/transport/)."
> — [Cloudflare Sandbox](https://developers.cloudflare.com/agents/model-context-protocol/guides/remote-mcp-server/)

> "Daytona Model Context Protocol (MCP) server enables AI agents to interact with Daytona Sandboxes programmatically."
> — [Daytona](https://www.daytona.io/docs/en/mcp)

> "E2B provides a batteries-included MCP gateway that runs inside sandboxes"
> — [E2B](https://docs.e2b.dev/mcp-gateway)

> "It is not a secret: once published, anyone can reach the whole service"
> — [InstaBox](https://instabox.sh/docs/ports)

> "Deploy an MCP server as an HTTP application when clients need a remote URL."
> — [Lizard](https://lizard.build/docs/guides/deploy-mcp-server)

> "Deploy a remote, stateless MCP server on Modal with FastMCP"
> — [Modal](https://modal.com/docs/examples/mcp_server_stateless)

> "Morph Cloud allows you to expose HTTP services running within your instances to the public internet."
> — [Morph](https://cloud.morph.so/docs/documentation/instances/http-services)

> "**MCP servers** from Runtime's catalog run in a sandbox at private URLs your agent connects to"
> — [Runtime](https://withruntime.com/llms.txt)

> "host each port privately, and connect your client to every URL with its own __sbx_auth cookie header"
> — [Sandboxer](https://sandboxer.com/guides/run-each-mcp-server-in-its-own-sandbox)

> "Point any MCP client at sprites.dev/mcp and sign in with Fly.io OAuth."
> — [Sprites](https://docs.fly.io/sprites/integrations/remote-mcp.md)

> "Exposed ports are accessible via a public URL, so be mindful of what services you run."
> — [Vercel Sandbox](https://vercel.com/docs/sandbox/concepts)

### Alternatives outside the 15, with price

| Option | What it is | Price on 2026-10-29 | Source |
| --- | --- | --- | --- |
| Cloudflare Workers | Remote MCP server on Workers, with a dashboard deploy | Free 100,000 requests/day; Paid $5/mo minimum | [Cloudflare Workers](https://developers.cloudflare.com/workers/platform/pricing/) |
| Render | Always-on web service with a public URL | $7/mo for 512 MB; $25/mo for 1 CPU / 2 GB | [Render](https://render.com/pricing) |
| Vercel Functions | Serverless HTTPS endpoint | Hobby free; Pro $20/mo platform fee | [Vercel Functions](https://vercel.com/docs/plans/pro-plan) |
| Lizard app platform | Public HTTPS service with sleep-when-idle | Lizard Pro $19/mo including $19 of usage | [Lizard app platform](https://lizard.build/docs/guides/deploy-mcp-server) |

> "The Workers Paid plan includes Workers, Pages Functions, Workers KV, Hyperdrive, and Durable Objects usage for a minimum charge of $5 USD per month for an account."
> — [Cloudflare Workers](https://developers.cloudflare.com/workers/platform/pricing/)

> "| 1 CPU | $25/month | 2 GB RAM | 1c-2g |"
> — [Render](https://render.com/pricing)

> "$20/month Pro platform fee"
> — [Vercel Functions](https://vercel.com/docs/plans/pro-plan)

> "After a set time without requests (10 minutes by default), the service sleeps; the next request wakes it"
> — [Lizard app platform](https://lizard.build/docs/guides/deploy-mcp-server)

### Battleships preset

No preset describes an MCP server. `employees` is the nearest always-on shape (2 vCPU / 4 GiB / 20 GiB, persistent disk, 5.8% average CPU), but it models an assistant that answers messages and runs jobs, not a thin HTTP adapter.

```json
{"vcpu":2,"ram":4,"disk":20,"sessions":0,"sessionMin":0,"concurrency":0,"alwaysOn":50,"snapshotGiB":0,"egress":100,"ipv4":0,"seats":2,"persistentDisk":true}
```

Treat 2 vCPU / 4 GiB as a ceiling for a light server, not a target.

### Proposed workload

| Field | Value |
| --- | --- |
| vCPU | 1 |
| RAM | 1 GiB |
| Disk | 10 GiB |
| Machines | 1 |
| Machine-hours / month | 730 (always-on) or only the calls, with wake-on-request |
| Wall-clock hours / month | 730 |
| Hours / day | 24 |
| Days / month | 30 |
| Files must persist on the machine | No (stateless by default) |
| CPU busy share | about 2% |
| Disk persists while stopped | Yes |

**Reasoning.** A stateless MCP server is a small HTTP process: 1 vCPU / 1 GiB / 10 GiB covers the runtime, logs and an optional session store. 730 hours is the honest number if the URL must always answer; a host that wakes on inbound HTTP can bill only the calls instead. 2% CPU is an estimate below Battleships' 5.8% always-on average, because the server adapts tool calls rather than doing the work itself.

**Scale variant.** Concurrency, not size, is the limit. Streamable HTTP lets one process handle multiple clients, so scale horizontally behind a load balancer before buying a bigger machine, and move session state out of the process first.

---

## Proposed workloads at a glance

These are the primary proposals. Each section has the scale or team variant and the reasoning.

| Use case | vCPU | RAM | Disk | Machines | Machine-hours / month | CPU busy | Disk persists while stopped |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Workflow automation with n8n, self-hosted | 2 | 4 GiB | 20 GiB | 1 | 730 | 6% | Yes |
| A Discord or Slack bot backed by an LLM | 1 | 2 GiB | 10 GiB | 1 | 730 | 3% | Yes |
| Claude Code for a small team of three to five developers | 4 | 8 GiB | 40 GiB | 1 | 160 | 3% | Yes |
| A scheduled web scraper that runs a few times a day | 1 | 2 GiB | 10 GiB | 1 | 20 | 40% | Yes |
| Hosting a remote MCP server over HTTP | 1 | 1 GiB | 10 GiB | 1 | 730 | 2% | Yes |

The Claude Code row is per developer: five developers means five machines and 800 machine-hours, not one machine with five times the size. The scraper's 40% is the share while a run is open, not the share of the month.

## One-click routes, in one place

Three providers have a true click-and-go route for at least one of these jobs: Agent 37, Lizard and Cloudflare. Two of them solve the same job (n8n).

| Use case | Provider | Route | What the click does |
| --- | --- | --- | --- |
| Workflow automation | Lizard | One-click n8n template | Creates the n8n app and a Managed Postgres database, wires the connection, gives a public HTTPS address. |
| Workflow automation | Agent 37 | `agent37-n8n` system template | Creates an always-on n8n instance from the official image with a public editor URL and SQLite on the persistent disk. |
| Discord/Slack bot | Agent 37 | OpenClaw or Hermes personal plan | A working LLM chat agent, connectable to your own Discord or Slack account on Basic and above; not a custom-coded bot. |
| Claude Code team | Agent 37 | `agent37-claude-code` template | One Claude Code instance on the developer's own Anthropic account; team roles need the Max plan. |
| Scheduled scraper | Lizard | n8n template + Schedule Trigger | A non-coder can build the schedule in n8n and keep results in Postgres. |
| MCP server | Cloudflare | Deploy to Workers button | Creates a remote MCP server at `*.workers.dev/mcp` from a template. |

Everything else is a documented guide, a preinstalled binary, or a manual install. The distinction matters: a guide still needs a terminal, and a preinstalled binary still needs a login.

## Provider capabilities that decide these jobs

These are the four features that repeatedly decide whether a provider fits: a scheduler, waking on an inbound request, a custom hostname, and a stable outbound address. "Not published" or "not documented" means the provider's pages inspected did not state it; it is not proof the feature is absent.

| Provider | Cron / scheduled runs | Wake on HTTP | Custom domain | Static egress IP | Quote proves |
| --- | --- | --- | --- | --- | --- |
| Agent 37 | Yes (agent instances) | Yes (webhook wakes it) | Yes | Not published | cron |
| Blaxel | Yes | Yes (standby restores in <25 ms) | Yes ($0.25/domain/mo) | Yes (free during beta) | static egress IP |
| Boat | No (timer inside only) | No (a stop ends the machine) | No | No | custom domain |
| boxd | Yes | Yes (scheduler wakes it) | Yes | Not published | cron and wake |
| Cloudflare Sandbox | Yes (Workers cron) | n/a (a Worker is always routed) | Yes (Worker route) | No | custom domain |
| Daytona | No | Not documented | Via your own proxy | Not published | custom domain (proxy) |
| E2B | No | Not documented (resume via SDK) | Via your own proxy | No | custom domain (proxy) |
| InstaBox | No | Yes (on use) | No | No (shared NAT) | wake on HTTP |
| Lizard | No (sandbox); via n8n | Yes (sleep when idle) | Yes (app services) | No | custom domain |
| Modal | Yes | n/a (web endpoints) | Yes (Team and Enterprise) | Yes (Proxy, Team+) | static egress IP |
| Morph | No | Yes | Not published | Not published | wake on HTTP |
| Runtime | Yes (jobs) | Yes (autoWake) | Yes | Yes ($5/mo dedicated IPv4) | static egress IP |
| Sandboxer | No | Yes | No | No | wake on HTTP |
| Sprites | No | Yes | Not published | Not published | wake on HTTP |
| Vercel Sandbox | Yes (Vercel Cron) | n/a (functions) | Not published for sandbox ports | Not published | cron |

**Evidence, one quote per provider, for the capability in the last column.** The other cells rest on the provider's documentation linked in that row and in the five provider tables above.

> "A platform cron is outside the instance: it fires whether the instance is awake or asleep"
> — [Agent 37](https://www.agent37.com/docs/agents-api/crons)

> "Dedicated egress IP addresses that route any protocol: HTTP, PostgreSQL, TCP, and beyond."
> — [Blaxel](https://blaxel.ai/pricing)

> "boat does not support custom domains."
> — [Boat](https://docs.boat.dev/hosting)

> "The platform holds the next time any `every(...)` on the machine is due and wakes a sleeping machine, on standby or hibernated, shortly before it."
> — [boxd](https://docs.boxd.sh/guides/automations/jobs)

> "A wildcard DNS record and the route `*.example-previews.com/*` send every preview hostname to your Worker."
> — [Cloudflare Sandbox](https://developers.cloudflare.com/sandbox/previews/serve-previews-on-their-own-hostnames/)

> "**Custom domain**: host your proxy under your own domain (e.g., `preview.yourcompany.com`)"
> — [Daytona](https://www.daytona.io/docs/en/custom-preview-proxy)

> "We will set up a GCP VM running Caddy server with Docker and Cloudflare DNS to proxy the requests to the Sandboxes."
> — [E2B](https://docs.e2b.dev/network/custom-domain)

> "Commands, files, SSH and a visit to one of its public port URLs resume it by themselves."
> — [InstaBox](https://instabox.sh/docs/concepts)

> "lizard domain app.example.com --service web"
> — [Lizard](https://lizard.build/docs/networking.md)

> "Proxies are a secure tunnel between Apps and exit nodes with static IPs."
> — [Modal](https://modal.com/docs/guide/proxy-ips)

> "When a request comes in through HTTP or an SSH-backed access path, the instance automatically resumes"
> — [Morph](https://cloud.morph.so/docs/documentation/instances/wake-on)

> "A dedicated IPv4 address costs $5 per 30-day month."
> — [Runtime](https://withruntime.com/docs/pricing)

> "**Wake on use.** A sandbox paused for being idle resumes by itself:"
> — [Sandboxer](https://sandboxer.com/docs/long-running)

> "When a request hits your Sprite's URL, it wakes automatically."
> — [Sprites](https://docs.fly.io/sprites/working-with-sprites.md)

> "Cron jobs are time-based scheduling tools used to automate repetitive tasks."
> — [Vercel Sandbox](https://vercel.com/docs/cron-jobs)

Two cautions. A cron that lives inside the machine is not a platform schedule: it stops when the machine sleeps. And a custom domain is not the same as a static egress IP: the first is how clients reach you, the second is how the outside world identifies you.

## Cross-cutting notes

### The receiving mechanism decides the lifecycle

| Use case | Always-on? | What drives it |
| --- | --- | --- |
| Workflow automation | Yes | Inbound webhook or an internal timer |
| Discord/Slack bot | Yes for a gateway or Socket Mode bot; no for an HTTP-style bot | A persistent socket, or an inbound request |
| Claude Code team | No | A developer starts a session |
| Scheduled scraper | No, if the scheduler is outside the machine | A platform cron |
| MCP server | Yes, unless the host wakes on HTTP | An inbound tool call |

### A cron inside a sleeping machine is not a schedule

This is the most common mistake in this comparison. A timer inside a sandbox only advances while the sandbox runs. Agent 37, boxd, Vercel, Cloudflare, Runtime, Blaxel and Modal all put the scheduler outside the machine for exactly this reason. If a provider only offers a timer inside the machine, the machine has to stay on.

### Disk persistence is about identity and output

For n8n, the disk is the database and the encryption key. For a chat bot, it is the token and the conversation history. For Claude Code, it is the repository and `~/.claude/.credentials.json`. For a scraper, it is the results, which should not be on the machine at all. For an MCP server, it is usually nothing.

### One credential shared by every sandbox is not a team setup

Some sandbox platforms attach a single model credential to the account, so every sandbox can use it. That is convenient for one person and wrong for a team that wants per-person usage, revocation or attribution. Lizard states the model directly: "Credentials belong to your Lizard account, not to a project, and every sandbox you start can use them." — [Run Claude Code in a sandbox](https://lizard.build/docs/sandboxes/guides/claude-code). Claude's own Team plan is the opposite: each member logs in with their own account, and the admin gets central billing and SSO.

### Browser and Docker are optional except where they are the point

n8n, a chat bot, Claude Code and an MCP server do not need a browser to run. A scraper needs one only when the page renders with JavaScript. Docker is the documented n8n install, is common for a coding agent's test dependencies, and is optional everywhere else. A database is mandatory for n8n, recommended for a bot's history, and optional for the other three.

### GPU is not part of any of these workloads

All five call models over an API. A GPU is only relevant if you run the model yourself, which none of these proposals does.

### What Battleships adds, and what it does not

Battleships is useful for the shape and duty cycle: `employees` for the always-on jobs, `fullstack` for coding sessions, `scrape` for browser visits. It has no preset for a workflow server or an MCP server, and its presets are fleet-scale. Use the per-machine shape and the CPU average, then scale the machine count to your team.

### Open questions

- **n8n self-host sizing:** n8n publishes Cloud plan limits, not a self-host floor. The 640 MiB minimum and 4 GiB recommendation are anchored on Cloud, not on a self-host table.
- **Chat bot sizing:** neither Discord nor Slack publishes a host sizing guide. The 1 GiB minimum is inferred.
- **MCP server sizing:** no vendor publishes one. The shape depends entirely on what the tools do.
- **Scraper sizing:** Playwright publishes operating-system requirements, not memory. The 2 GiB figure comes from Battleships' per-visit shape.
- **Claude Code disk:** Anthropic publishes no disk minimum. The 30 GiB hosted ceiling and the 20 GiB Battleships preset are the only anchors.
- **n8n on sandboxes:** none of the fifteen providers is named in n8n's own hosting docs, so every route except Lizard's and Agent 37's templates is an inference from the provider's general-purpose machine.

## Sources consulted

- https://battleships.dev/data/presets.json
- https://battleships.dev/data/rankings/employees.json
- https://battleships.dev/data/rankings/fullstack.json
- https://battleships.dev/data/rankings/scrape.json
- https://claude.com/docs/connectors/building
- https://claude.com/pricing
- https://cloud.morph.so/docs/examples/claude-code
- https://code.claude.com/docs/en/authentication
- https://code.claude.com/docs/en/claude-code-on-the-web
- https://code.claude.com/docs/en/cloud-environments
- https://code.claude.com/docs/en/mcp
- https://code.claude.com/docs/en/overview
- https://code.claude.com/docs/en/sandbox-environments
- https://code.claude.com/docs/en/setup
- https://developers.cloudflare.com/agents/model-context-protocol/guides/remote-mcp-server/
- https://developers.cloudflare.com/sandbox/coding-agents/claude-code/
- https://developers.cloudflare.com/workers/configuration/cron-triggers/
- https://developers.cloudflare.com/workers/platform/pricing/
- https://discord.com/developers/docs/interactions/overview
- https://discord.com/developers/docs/topics/gateway
- https://docs.blaxel.ai/Functions/Create-MCP-server
- https://docs.blaxel.ai/Sandboxes/Schedules
- https://docs.blaxel.ai/Tutorials/Claude-Code
- https://docs.boat.dev/integrated-agents/harnesses-and-models
- https://docs.boat.dev/long-running-tasks/always-on-services
- https://docs.boxd.sh/guides/automations/jobs
- https://docs.boxd.sh/use-cases/coding-agents
- https://docs.boxd.sh/use-cases/personal-assistants
- https://docs.e2b.dev/agents/claude-code
- https://docs.e2b.dev/mcp-gateway
- https://docs.fly.io/sprites/concepts/services.md
- https://docs.fly.io/sprites/integrations/remote-mcp.md
- https://docs.n8n.io/
- https://docs.n8n.io/deploy/host-n8n/configure-n8n/basic-configuration/use-environment-variables/database
- https://docs.n8n.io/deploy/host-n8n/configure-n8n/scaling/enable-queue-mode
- https://docs.n8n.io/deploy/host-n8n/install-options/install-using-docker-compose
- https://docs.n8n.io/deploy/use-n8n-cloud/configure-cloud/manage-your-data/
- https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.scheduletrigger
- https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook
- https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-langchain.mcptrigger
- https://docs.openclaw.ai/channels/discord
- https://docs.slack.dev/apis/events-api/using-http-request-urls
- https://docs.slack.dev/apis/events-api/using-socket-mode
- https://github.com/n8n-io/n8n
- https://instabox.sh/docs/limits
- https://lizard.build/deploy/n8n--n8n
- https://lizard.build/docs/guides/deploy-mcp-server
- https://lizard.build/docs/guides/discord-bot
- https://lizard.build/docs/sandboxes/guides/claude-code
- https://modal.com/docs/examples/discord_bot
- https://modal.com/docs/examples/mcp_server_stateless
- https://modal.com/docs/guide/cron
- https://modelcontextprotocol.io/specification/2025-06-18/basic/transports
- https://n8n.io/pricing/
- https://render.com/pricing
- https://sandboxer.com/docs/machines
- https://sandboxer.com/guides/run-each-mcp-server-in-its-own-sandbox
- https://vercel.com/docs/agent-harnesses/claude-code
- https://vercel.com/docs/cron-jobs
- https://vercel.com/docs/cron-jobs/usage-and-pricing
- https://withruntime.com/docs/jobs
- https://withruntime.com/llms.txt
- https://www.activepieces.com/docs/install/overview
- https://www.activepieces.com/pricing
- https://www.agent37.com/docs/agents-api/crons
- https://www.agent37.com/docs/agents-api/n8n
- https://www.agent37.com/docs/agents-api/templates
- https://www.agent37.com/personal
- https://www.daytona.io/docs/en/guides/claude/claude-code-run-cli-sandbox
- https://www.daytona.io/docs/en/mcp
- https://www.windmill.dev/docs/advanced/self_host

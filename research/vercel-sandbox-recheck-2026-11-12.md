# Vercel Sandbox — provider recheck

- Provider ID: `vercel-sandbox`
- Repo revision: `4432d00` (`origin/main`), worktree clean at start
- Previous provider date: 2026-10-28; previous rate-card date: 2026-10-30
- Recheck date: 2026-11-12 (Asia/Calcutta)
- Scope: desk research only. No Vercel account, login, sandbox, snapshot, drive or paid resource was created. Documentation claims are not measured behaviour.
- Sources: official docs, pricing, changelog, status page, SLA, terms, DPA, compliance page, Container Registry limits, Vercel MCP tools reference, REST API reference, GitHub SDK/CLI repo and universal-image README.
- Retrieval: Context `web_scrape` with `maxAgeMs: 0` for the pricing page (fresh, `dateModified` 2026-09-10 in page JSON-LD; table present in returned Markdown); TinyFish `fetch_content` with `ttl: 0` for pricing, REST API and MCP pages; TinyFish `search` for company facts; `curl` for Vercel's own `.md` documentation endpoints and for status-page JSON. No Amp native web tool was used.
- Cache note: the `.md` docs endpoints are the provider's published Markdown, not a search-agent index. Every page used returned a `# heading` and body, not a JavaScript shell. The pricing table was independently seen in all three routes (Context, TinyFish, curl `.md`) with identical figures.

## Bottom line

**Five capability verdicts should move: two because a documented surface appeared, three because the previous rows missed facts that were already on Vercel's site.**

- **New since the last check:** `rest-api` no→yes and `mcp-server` no→yes. The Sandboxes REST reference pages carry `last_updated: 2026-11-12`, and the official Vercel MCP server now documents a Sandboxes tool group that wraps the same endpoints. No changelog entry announces either.
- **Baseline misses, not November launches:** `mount-buckets` no→yes (FUSE/S3 how-to published 3 July, last updated 23 September), `static-ip` not-published→partly (Secure Compute for Sandbox announced 30 September), `no-card` not-published→yes (the current Pro-trial page, last updated 14 September, documents a start path with no payment method and says charges apply only if one exists).

**No published rate, plan fee, allowance or free-tier figure changed.** The material new things are the REST API and MCP surfaces, plus two performance changes (snapshot creation up to 10× faster on 9 November, drives startup up to 2.4× faster on 2 November). The site also understates incidents: there are **3** Sandbox incidents from 6 August to 12 November, not 2 to 4 November.

The one judgment call is `no-card`. The trial page never uses the words "no credit card required", but its start steps do not ask for a card and it says charges apply only if a payment method exists. I read that as `yes`; a strict quote-matching reviewer could keep `not-published` and add the same note.

## Features (16)

| # | Feature | Verdict | Specifics | Evidence (URL — quote) | Changed? |
|---|---|---|---|---|---|
| 1 | isolation | partly | Firecracker microVM with dedicated kernel, full root, Docker/container engines, FUSE mounts. systemd and nested virtualisation are still not published. GPU is covered separately. | https://vercel.com/docs/sandbox/concepts — "each sandbox runs in its own Firecracker microVM with a dedicated kernel." | No |
| 2 | sizes-regions | yes | 1 or even vCPUs 2–32 (Hobby 4, Pro 8, Enterprise 32), exactly 2 GB RAM per vCPU, 64 GB ephemeral NVMe, 15 open ports, 19 regions, `iad1` default. Pro/Enterprise add ordered failover regions; Hobby cannot. | https://vercel.com/docs/sandbox/pricing#resource-limits — "Vercel Sandbox is available in 19 regions. The default region is `iad1`." | Source URL only (quote is on pricing, not concepts) |
| 3 | billing-models | partly | Active CPU $0.128/vCPU-hour (I/O wait excluded) + provisioned memory $0.0212/GB-hour for the whole session, 1-minute memory minimum. Creations $0.60/1M; transfer 20 GB Hobby / Flat Rate CDN Pro / $0.15 GB Enterprise; snapshot $0.08/GB-month; drive $0.05/GB-month + $0.0015/GB reads + $0.004/GB writes. New adjacent charge: Container Registry image storage $0.10/GB (unit as published). | https://vercel.com/docs/sandbox/pricing#pricing — "Sandbox Active CPU \| 5 hours/month \| $0.128/hour \| $0.128/hour" | Note only; rates unchanged |
| 4 | trials-free-tiers | partly | Hobby: 5 Active-CPU h, 420 GB-h memory, 5,000 creations, 20 GB transfer per month, plus 15 GB snapshot and 15 GB drive storage **lifetime**; non-commercial only; creation pauses at the cap. Pro: 14-day trial with $20 credit; no standing free credit. | https://vercel.com/docs/plans/pro-plan/trials — "The trial plan includes a $20 credit" | Quote/source corrected (old Hobby sentence removed) |
| 5 | custom-domains | not-published | No documented way to attach your own hostname to a sandbox port. Vercel Domains remain a deployment feature; an external proxy is your own build. | https://vercel.com/docs/sandbox/working-with-sandbox#expose-a-port — "Each exposed port gets its own public URL." | No |
| 6 | idle-timers | partly | A wall-clock `timeout`, default 5 minutes, extendable with `extendTimeout()`; max session 45 min Hobby, 24 h Pro/Enterprise. No idle-activity timer and no per-plan configurable idle setting. | https://vercel.com/docs/sandbox/concepts — "The default timeout is 5 minutes" | No |
| 7 | lifecycle | partly | Stop ends the session. Persistent (default) saves the filesystem, restores it into a **new** session; RAM and processes do not survive. `onResume` restarts services. Sandboxes that cannot resume from a snapshot are deleted after 14 days of inactivity. | https://vercel.com/docs/sandbox/concepts/persistent-sandboxes — "Persistent sandboxes automatically save their filesystem state when stopped and restore it when resumed." | No |
| 8 | snapshots-forks | partly | Filesystem snapshots only; 30-day default expiry after last use, configurable (including never); keep last 1–10. Manual `snapshot()` stops the source. Fork is seeded from the source's current snapshot, else a fresh create from its image; fork inherits env, region, failover and Secure Compute network. Snapshot creation is now up to 10× faster (2026-11-09). | https://vercel.com/docs/sandbox/concepts/snapshots — "Snapshots capture the state of a running sandbox, including the filesystem and installed packages." | Detail only (speed); verdict same |
| 9 | storage | partly | 64 GB ephemeral NVMe per sandbox; Drives are separate persistent storage billed on logical used size, 1 TiB default (1 GiB Hobby), 16 TiB quota, 4 per sandbox, one read-write mount, read-only snapshot mounts for sharing. FUSE lets you mount S3 yourself. | https://vercel.com/docs/sandbox/concepts/drives — "Only one sandbox at a time can mount a given drive as read-write" | Detail only (baseline missed the July S3/FUSE page) |
| 10 | outbound-network | yes | Firewall defaults to allow-all; per-sandbox allow/deny domain and CIDR rules, deny-all mode, credentials brokering and request transforms. Static egress IPs now exist through an Enterprise Secure Compute network. | https://vercel.com/docs/sandbox/pricing#network — "Data your sandbox sends to the internet, plus all traffic to and from exposed ports, is billable and measured in GB." | Detail only (baseline missed 30 Sep Secure Compute) |
| 11 | reaching-it | partly | Up to 15 exposed ports per sandbox, each on a public HTTPS URL; no token/login in front; no general raw TCP, standard SSH, tunnel or custom domain published. Dashboard Connect tab gives an in-browser terminal. | https://vercel.com/docs/sandbox/working-with-sandbox#expose-a-port — "Anyone with the URL can reach the server" | No |
| 12 | keys-secrets | yes | Credentials brokering injects secrets into egressing traffic, so values never enter the guest. Ordinary env vars are still visible to guest code if you pass them; Vercel Connect adds short-lived OAuth/API tokens as a separate product. | https://vercel.com/docs/sandbox/concepts/firewall#credentials-brokering — "Credentials brokering injects credentials into egressing traffic. The secrets never enter the sandbox" | No |
| 13 | ways-to-drive | partly | Dashboard (Connect terminal, stop/resume, snapshot — no create), CLI, JS SDK, Python SDK, documented REST API (`api.vercel.com/v2`–`/v4/sandboxes`), and official Vercel MCP Sandboxes tools. Still no standard SSH client or desktop. | https://vercel.com/docs/rest-api/sandboxes — "Endpoints in the Sandboxes group of the Vercel REST API Reference." | **Yes** — REST API and MCP added |
| 14 | built-in-agents | partly | Universal image ships Claude Code, Codex, OpenCode and Pi; `sandbox create <agent>` launches one. No prompt/agent-run API — you drive a terminal yourself. | https://vercel.com/docs/sandbox — "coding agents, and common utilities" | Detail only (agent list sharpened) |
| 15 | teams-accounts | partly | Vercel teams with Owner/Member/Viewer roles and unlimited free Viewer seats; SAML SSO $300/month; Spend Management alerts and project pause; audit logs Enterprise-only; no fine-grained Sandbox key scope or contractual residency. | https://vercel.com/docs/plans/pro-plan#paid-add-ons — "SAML Single Sign-On: $300/month" | No |
| 16 | company | yes | Vercel Inc., Delaware, founded 2015 by Guillermo Rauch. $300M Series F at $9.3B (Sep 2025), still the latest round. Sandbox announced Jun 2025, GA Jan 2026. Status: Sandbox Operational, no Sandbox-specific percentage. 99.99% Enterprise SLA does not name Sandbox; Pro/Hobby no SLA. SOC 2 Type 2 + ISO 27001 platform-level; Sandbox scope not published. **3 Sandbox incidents 6 Aug–12 Nov**, latest 10 Nov (18 min, iad1). April 2026 security incident (third-party AI-tool OAuth) closed 16 Oct 2026. | https://vercel.com/legal/sla#services-availability — "available 99.99% of the time, excluding any Excused Downtime events" | **Yes** — incident count 2→3; security incident added |

### Feature notes

- `sizes-regions`: the 19-region sentence is on the **pricing** page, not `concepts`; the row's source URL should move. The regions page lists 19 including five EU (`arn1`, `cdg1`, `dub1`, `fra1`, `lhr1`).
- `trials-free-tiers`: the old Hobby-page sentence "Unlock the full potential of Vercel Pro during your 14-day trial with $20 in credits." is **no longer present** (checked 2026-11-12). The trial page now says "The trial plan includes a $20 credit" and "Your trial finishes after 14 days". Verdict unchanged, quote must move.
- `billing-models`: no numeric change. The only new money-bearing surface attached to Sandbox is Container Registry image storage ($0.10/GB, unit as published — the page does not say "/month"), which is billed separately from sandbox compute.
- `snapshots-forks`: the 10× snapshot-speed changelog is a performance claim, not a measured result here. It does not make snapshots memory-inclusive, so the verdict stays `partly`.
- `storage`: the S3 mount is a manual FUSE setup (install `mount-s3`, pass AWS credentials to the mount command). It is a real outside-filesystem mount, so `mount-buckets` moves to `yes`, but it is not a managed bucket attachment. The how-to is dated 23 September and the FUSE changelog 3 July, so this is a **baseline gap**, not a November launch.
- `reaching-it`: the 15-port cap is plan-wide, not a separate Hobby/Pro/Enterprise difference.
- `company`: the status page's own incident text says the 10 Nov event was "reported retroactively" and lasted 18 minutes (19:16–19:34 UTC), so the count is from the status page, not a monitoring claim.


## Capabilities (78)

**Verdict changes: 5** — `mount-buckets` no→yes, `static-ip` not-published→partly, `rest-api` no→yes, `mcp-server` no→yes, `no-card` not-published→yes.

Legend for the last column: **YES** = verdict changed; **source only** = evidence URL and/or quote refreshed, verdict unchanged; **detail only** = figure/note refreshed, verdict unchanged; **—** = no material change to verdict or evidence.

Evidence moved (same verdict): `docker-inside`, `nested-virt`, `public-url`, `private-url`, `tunnel`, `raw-tcp`, `free-credit`, `live-resize`, `schedules`, `scoped-keys`, `secrets-store`, `spend-cap`, `open-source`. Figure/detail changes (same verdict): `agents-preinstalled`, `custom-image`, `soc2`, `hosts-other-agents`.

### Isolation and privileges

| Capability | Verdict | Specifics | Evidence (URL — quote) | Changed? |
|---|---|---|---|---|
| `own-vm` | yes | Firecracker microVM | https://vercel.com/docs/sandbox/concepts — "each sandbox runs in its own Firecracker microVM with a dedicated kernel." | — |
| `root` | yes | full root | https://vercel.com/docs/sandbox/concepts — "Provides full root access to install any package or binary" | — |
| `docker-inside` | yes | Docker inside | https://vercel.com/docs/sandbox/concepts/security — "Run Docker and other container engines to build images or run containerized workloads." | source only |
| `nested-virt` | not-published | Vercel's sandbox docs do not mention nested virtual machines or /dev/kvm. | https://vercel.com/docs/sandbox/concepts/security — "Run Docker and other container engines to build images or run containerized workloads." | source only |
| `custom-image` | yes | custom image or snapshot — Push an OCI image to Vercel Container Registry, then create from it. Sandbox does not run the image ENTRYPOINT or CMD. VCR allows 2 GB compressed layers and 15 GB total images; image storage is $0.10/GB. | https://vercel.com/docs/sandbox/concepts — "store the image in Vercel Container Registry (VCR) and create the sandbox with a custom image" | detail only |

### Sizes, GPU and regions

| Capability | Verdict | Specifics | Evidence (URL — quote) | Changed? |
|---|---|---|---|---|
| `any-size` | partly | 1 or even vCPUs, 2 GB each — vCPU counts are 1 or even numbers and each one carries exactly 2 GB, so CPU and RAM cannot be picked independently. | https://vercel.com/docs/sandbox/pricing — "Each vCPU includes 2 GB of memory." | — |
| `big-machines` | partly | 32 cores on Enterprise only — Machines above 8 cores and 16 GB need the Enterprise plan; the self-serve plans stop there. | https://vercel.com/docs/sandbox/pricing — "You can provision 1 or an even number of vCPUs between 2 and 32 depending on your plan." | — |
| `live-resize` | no | fixed for the session — Resource changes are saved for later sessions; they do not resize the running VM. | https://vercel.com/docs/sandbox/sdk-reference#sandbox.update — "Resource, mount, region, and Secure Compute network changes apply to later sessions; they don't resize or move the running VM." | source only |
| `gpu` | no | no GPU — Inferred: no GPU appears in the pricing table or the size limits. | https://vercel.com/docs/sandbox/pricing — "Each vCPU includes 2 GB of memory." | — |
| `choose-region` | yes | 19 regions | https://vercel.com/docs/sandbox/pricing — "Vercel Sandbox is available in 19 regions. The default region is iad1." | — |
| `eu-region` | yes | 5 EU regions — Frankfurt, Paris, Dublin, London and Stockholm; a snapshot stays in the region it was made in. | https://vercel.com/docs/sandbox/concepts/regions — "Frankfurt, Germany" | — |

### Lifecycle and pause

| Capability | Verdict | Specifics | Evidence (URL — quote) | Changed? |
|---|---|---|---|---|
| `pause-memory` | no | Stopping saves the files but not what was running; the next start is a new session. | https://vercel.com/docs/sandbox/concepts/persistent-sandboxes — "Persistent sandboxes automatically save their filesystem state when stopped and restore it when resumed." | — |
| `warm-pool` | no | No pool of pre-started machines. | https://vercel.com/docs/sandbox/concepts/persistent-sandboxes — "Each time you resume a sandbox, a new session starts from the last saved state." | — |
| `fast-start` | yes | Sub-second — The claim is a line in the concepts table. | https://vercel.com/docs/sandbox/concepts — "Milliseconds (Firecracker optimized for fast boot)" | — |

### Snapshots, forks and templates

| Capability | Verdict | Specifics | Evidence (URL — quote) | Changed? |
|---|---|---|---|---|
| `snapshot-files` | yes | 30-day default — Snapshots are made automatically at every stop unless you opt out. | https://vercel.com/docs/sandbox/concepts/snapshots — "Snapshots capture the state of a running sandbox, including the filesystem and installed packages." | — |
| `snapshot-memory` | no | A snapshot never includes memory; the next session starts the programs again. | https://vercel.com/docs/sandbox/concepts/persistent-sandboxes — "a new session boots from that snapshot with a fresh session timeout" | — |
| `fork-running` | partly | A fork starts from a snapshot of the current state, and taking one stops the session it copies. | https://vercel.com/docs/sandbox/sdk-reference#sandbox.fork — "Sandbox.fork() creates a new sandbox seeded from the current snapshot of an existing one." | — |
| `older-snapshot` | yes | Keep last 1–10 — You choose how many to keep, and how long each lasts. | https://vercel.com/docs/sandbox/concepts/persistent-sandboxes — "Keep only the N (1–10) most recent snapshots" | — |
| `templates` | yes | A sandbox boots a managed image, your own image, or a saved snapshot. | https://vercel.com/docs/sandbox/concepts — "This microVM boots an Ubuntu 26.04 image, a custom image from VCR, or a saved snapshot." | — |
| `backups` | partly | On every stop — A copy is saved each time the machine stops, but there is no schedule and only the last few are kept. | https://vercel.com/docs/sandbox/concepts/snapshots — "snapshots are created automatically whenever a session stops" | — |

### Storage and volumes

| Capability | Verdict | Specifics | Evidence (URL — quote) | Changed? |
|---|---|---|---|---|
| `files-survive-stop` | yes | Persistence is the default for new sandboxes. | https://vercel.com/docs/sandbox/concepts/persistent-sandboxes — "Persistence is the default." | — |
| `volumes` | yes | A drive outlives the sandbox and can be attached to another. | https://vercel.com/docs/sandbox/concepts/drives — "Files written to a drive persist after the sandbox stops." | — |
| `shared-volume` | partly | Only one machine can write a drive; others get a read-only copy taken when they mount it. | https://vercel.com/docs/sandbox/concepts/drives — "Only one sandbox at a time can mount a given drive as read-write: use snapshots for shared access." | — |
| `mount-buckets` | yes | S3 via FUSE — Install Mountpoint for Amazon S3 in the guest and mount a bucket at a path. The how-to passes AWS credentials to the mount command; it is a real outside-filesystem mount, not a managed bucket attachment. | https://vercel.com/docs/sandbox/mount-remote-storage — "Mount an external object store such as Amazon S3 into a sandbox and work with remote files as if they were local." | YES |
| `big-disk` | yes | 1 TiB drive — A drive defaults to 1 TiB, with a 16 TiB quota; the sandbox's own disk is 64 GB. | https://vercel.com/docs/sandbox/concepts/drives — "A drive defaults to 1 TiB when you do not set a size (1 GiB for Hobby). The default maximum quota is 16 TiB." | — |

### Idle timers

| Capability | Verdict | Specifics | Evidence (URL — quote) | Changed? |
|---|---|---|---|---|
| `stay-on` | partly | 45 min Hobby, 24 h Pro — A single session cannot last beyond 45 minutes on the free plan or 24 hours on paid plans. | https://vercel.com/docs/sandbox/pricing — "45 minutes \| 24 hours \| 24 hours" | — |
| `choose-idle` | no | There is only a session length, not an idle timer you can set. | https://vercel.com/docs/sandbox/pricing — "45 minutes \| 24 hours \| 24 hours" | — |
| `wake-on-request` | yes | The call that arrives starts a new session and then retries. | https://vercel.com/docs/sandbox/concepts/persistent-sandboxes — "If a persistent sandbox is stopped and you call `runCommand`, `writeFiles`, or other SDK methods on it, the SDK automatically starts a new session and retries…" | — |
| `schedules` | yes | A schedule calls a function or route, which can then start a sandbox. | https://vercel.com/docs/schedules — "Run code on a recurring cron schedule or once at a specific time" | source only |

### Reaching it

| Capability | Verdict | Specifics | Evidence (URL — quote) | Changed? |
|---|---|---|---|---|
| `public-url` | yes | Exposed ports — Every exposed port answers on a public address with no lock of its own. | https://vercel.com/docs/sandbox/concepts/security — "Exposed ports are accessible via a public URL, so be mindful of what services you run." | source only |
| `private-url` | no | Public link only — An exposed port is open to anyone with the URL; there is no token or login in front of it. | https://vercel.com/docs/sandbox/working-with-sandbox — "Anyone with the URL can reach the server" | source only |
| `ssh` | partly | SSH-like shell — The command line is the provider's own tool that feels like SSH; a standard SSH client cannot connect. | https://vercel.com/docs/sandbox/working-with-sandbox — "Connect to a running sandbox for interactive debugging with an SSH-like experience" | — |
| `web-terminal` | yes | Dashboard tab — The dashboard's Connect tab runs commands in the browser. | https://vercel.com/changelog/connect-to-and-manage-sandboxes-from-the-dashboard — "Run commands, browse the filesystem, upload and download files, and inspect open ports without leaving the browser." | — |
| `tunnel` | no | No port forwarding — There is no local-forward command in the CLI or SDK; you use the sandbox's public URL instead. | https://vercel.com/docs/sandbox/concepts/security — "Exposed ports are accessible via a public URL, so be mindful of what services you run." | source only |
| `raw-tcp` | no | Web ports only — Ports are reached over an HTTP(S) public URL; no raw TCP mapping is documented for a database or game server. | https://vercel.com/docs/sandbox/concepts/security — "Exposed ports are accessible via a public URL, so be mindful of what services you run." | source only |

### Custom domains

| Capability | Verdict | Specifics | Evidence (URL — quote) | Changed? |
|---|---|---|---|---|
| `custom-domain` | not-published | No hostname attachment — Each port gets a provider-generated public URL; no way to attach your own domain is published. | https://vercel.com/docs/sandbox — "Run untrusted or agent-generated code in isolated Linux microVMs." | — |
| `auto-https` | not-published | No customer domain — Provider URLs are HTTPS, but with no custom-domain feature there is no certificate to manage for your name. | https://vercel.com/docs/sandbox — "Run untrusted or agent-generated code in isolated Linux microVMs." | — |

### Outbound network

| Capability | Verdict | Specifics | Evidence (URL — quote) | Changed? |
|---|---|---|---|---|
| `egress-included` | partly | 20 GB Hobby; Pro CDN — Hobby includes 20 GB/month, Pro bundles sandbox transfer into the Flat Rate CDN rather than a Sandbox-specific allowance, Enterprise pays $0.15/GB. | https://vercel.com/docs/sandbox/pricing — "Sandbox Data Transfer 20 GB/month Included in Flat Rate CDN $0.15/GB" | — |
| `egress-allowlist` | yes | Domain or address list — A network policy can allow only listed domains or address ranges, and an empty policy blocks everything. | https://vercel.com/docs/sandbox/concepts/firewall — "a policy with no allowed domains or CIDR ranges blocks all outbound traffic, including DNS" | — |
| `no-internet` | yes | deny-all — A firewall policy can be set to block all outbound traffic. | https://vercel.com/docs/sandbox/concepts/firewall — "Use the explicit `deny-all` mode when you intend to block all traffic" | — |
| `static-ip` | partly | Enterprise add-on — Fixed outbound IPs need an Enterprise Secure Compute network, which is custom-priced; a sandbox without one leaves from shared Vercel addresses. | https://vercel.com/docs/sandbox/concepts/secure-compute — "Its public-internet traffic then exits through the network's static IPs" | YES |

### Keys and secrets

| Capability | Verdict | Specifics | Evidence (URL — quote) | Changed? |
|---|---|---|---|---|
| `secrets-store` | partly | Passed each time — There is no saved list of secrets for a sandbox; you pass the values in `env` each time you create or run one. | https://vercel.com/docs/sandbox/sdk-reference — "Default environment variables for commands run in this sandbox." | quote only |
| `hidden-secrets` | yes | Outside the machine — Keys are added to outgoing traffic and never enter the machine, so code inside cannot copy them. | https://vercel.com/docs/sandbox/concepts/firewall — "Credentials brokering injects credentials into egressing traffic. The secrets never enter the sandbox" | — |
| `scoped-keys` | partly | Team tokens — Tokens are limited to a team, but no read-only or sandbox-only scope is published. | https://vercel.com/docs/sandbox/concepts/authentication — "A Vercel access token with access to the team" | source only |

### Ways to drive it

| Capability | Verdict | Specifics | Evidence (URL — quote) | Changed? |
|---|---|---|---|---|
| `dashboard-create` | no | The dashboard can stop or delete a sandbox but the docs give no way to create one there. | https://vercel.com/docs/sandbox/concepts/persistent-sandboxes — "From the dashboard you can stop the current session or permanently remove the sandbox." | — |
| `cli` | yes | `sandbox` (alias `sbx`) creates sandboxes and connects to them. | https://vercel.com/docs/sandbox/cli-reference — "Use the Sandbox CLI to run coding agents, manage sandboxes, execute commands, and copy files from your terminal." | — |
| `python-sdk` | yes | A separate Python SDK reference. | https://vercel.com/docs/sandbox — "Manage sandboxes through the CLI, JS SDK, or Python SDK." | — |
| `ts-sdk` | yes | The JS SDK is the reference client. | https://vercel.com/docs/sandbox — "Manage sandboxes through the CLI, JS SDK, or Python SDK." | — |
| `rest-api` | yes | api.vercel.com v2-v4 — Documented Sandboxes group: list/create/get/update/delete, sessions, commands and stdin, file read/write/mkdir, snapshots, fork and network policy. Create exists at v2, v3 and v4; the list page is v2. | https://vercel.com/docs/rest-api/sandboxes — "Endpoints in the Sandboxes group of the Vercel REST API Reference." | YES |
| `mcp-server` | yes | Vercel MCP — The official remote Vercel MCP server exposes a Sandboxes tool group built on the same API: create/list/get sandboxes, run and kill commands, stream logs, read and write files, snapshot, and extend session timeouts. | https://vercel.com/docs/agent-resources/vercel-mcp/tools/sandboxes — "Create sandboxes to run commands and work with files in isolated environments." | YES |
| `pty` | yes | `sandbox connect` starts an interactive shell in a sandbox. | https://vercel.com/docs/sandbox/cli-reference — "`connect`: Start an interactive shell in an existing sandbox." | — |
| `file-api` | yes | `readFile` and `writeFiles` on the sandbox object. | https://vercel.com/docs/sandbox/sdk-reference — "sandbox.readFile()" | — |

### Built-in agents

| Capability | Verdict | Specifics | Evidence (URL — quote) | Changed? |
|---|---|---|---|---|
| `agents-preinstalled` | yes | Claude Code, Codex, OpenCode, Pi — The universal image installs four coding agents (opencode, Claude Code, Codex, pi) plus Node, Python and common utilities; the CLI can launch any of them with `sandbox create <agent>`. | https://vercel.com/docs/sandbox — "which includes the current Node.js LTS, Python 3.14, coding agents, and common utilities." | detail only |
| `prompt-api` | no | No prompt endpoint — You run commands or launch an agent in a terminal; there is no API that takes a prompt and does the work. | https://vercel.com/docs/sandbox — "Manage sandboxes through the CLI, JS SDK, or Python SDK." | source only |
| `one-click-hermes` | no | Terminal backend, not a button — Hermes is pointed at Sandbox with `hermes config set terminal.backend vercel_sandbox` after installing the CLI. | https://vercel.com/docs/sandbox/ecosystem/hermes — "hermes config set terminal.backend vercel_sandbox" | source only |
| `one-click-openclaw` | no | Manual walkthrough — The official guide installs the Sandbox CLI, then OpenClaw with `npm install -g openclaw`, then runs the onboarding wizard. | https://vercel.com/kb/guide/running-openclaw-in-vercel-sandbox — "npm install -g openclaw" | source only |
| `browser` | no | No browser in the image — The universal image has Node, Python, four coding agents and utilities; Chromium/Playwright is not installed, so you add it. | https://vercel.com/docs/sandbox — "coding agents, and common utilities" | source only |
| `desktop` | no | No desktop — There is no VNC, X display or computer-use API published for a graphical session. | https://vercel.com/docs/sandbox — "Manage sandboxes through the CLI, JS SDK, or Python SDK." | source only |
| `hosts-other-agents` | yes | Cursor, Devin, OpenAI Agents — First-party ecosystem pages document each platform using Sandbox as its execution machine. | https://vercel.com/docs/sandbox/ecosystem — "Cursor Cloud Agents on Self-Hosted Machines" | detail only |

### Teams and accounts

| Capability | Verdict | Specifics | Evidence (URL — quote) | Changed? |
|---|---|---|---|---|
| `team-workspace` | yes | A Vercel team holds members, seats and billing, with unlimited free viewer seats. | https://vercel.com/docs/plans/pro-plan — "Unlimited free Viewer seats with read-only access" | — |
| `roles` | yes | Team roles include a free read-only Viewer seat. | https://vercel.com/docs/plans/pro-plan — "Unlimited free Viewer seats with read-only access" | — |
| `sso` | partly | $300/month — SAML single sign-on is a paid add-on at $300 a month. | https://vercel.com/docs/plans/pro-plan — "SAML Single Sign-On: $300/month" | — |
| `spend-cap` | partly | Spend Management can pause projects at an amount you set, but it is a project pause rather than a sandbox stop. | https://vercel.com/docs/spend-management — "pause all your projects" | source only |
| `usage-alerts` | yes | Spend Management sends alerts at amounts you set, and can also pause projects. | https://vercel.com/docs/sandbox/pricing — "receive alerts or pause projects when you reach a specified amount." | — |
| `audit-log` | partly | Audit Logs are a Vercel Enterprise feature; Sandbox-specific coverage is not established. | https://vercel.com/docs/audit-log — "Audit Logs are available on Enterprise plans" | — |

### Billing models

| Capability | Verdict | Specifics | Evidence (URL — quote) | Changed? |
|---|---|---|---|---|
| `per-second` | partly | memory rounds to a minute — Memory is counted in whole minutes, so a 20-second task is charged for a full minute of memory. | https://vercel.com/docs/sandbox/pricing — "Provisioned memory is billed in 1 minute minimum increments to account for sandbox lifecycle management." | — |
| `active-cpu` | yes | active CPU only — Memory is still charged for the whole time the sandbox runs, including while it waits. | https://vercel.com/docs/sandbox/pricing — "Time spent waiting for I/O (such as network requests, database queries, or AI model calls) does not count toward Active CPU." | — |
| `cheap-pause` | yes | compute stops — A saved copy of the disk bills as snapshot storage after it stops. | https://vercel.com/docs/sandbox — "Stop a sandbox when work is done to end CPU and memory charges." | — |
| `no-monthly-fee` | partly | Hobby free; Pro $20 — The free Hobby plan is for personal projects only; commercial use needs the $20-a-month Pro plan. | https://vercel.com/docs/plans/pro-plan — "$20/month Pro platform fee" | — |
| `flat-price` | no | active CPU plus memory | https://vercel.com/docs/sandbox/pricing — "$0.128/hour" | — |

### Trials and free tiers

| Capability | Verdict | Specifics | Evidence (URL — quote) | Changed? |
|---|---|---|---|---|
| `free-tier` | partly | Hobby, personal use only — The free Hobby plan is limited to personal projects and stops creating sandboxes when its allowance runs out. | https://vercel.com/docs/plans/hobby — "the Hobby plan restricts users to non-commercial, personal use only." | — |
| `free-credit` | partly | $20 in a 14-day trial — The credit is part of a 14-day Pro trial, not a standing signup credit. | https://vercel.com/docs/plans/pro-plan/trials — "The trial plan includes a $20 credit" | source only |
| `no-card` | yes | Trial starts card-free — The Pro trial start steps never ask for a payment method, and Vercel says charges apply only if you have one; Hobby is free. | https://vercel.com/docs/plans/pro-plan/trials — "Charges apply only if you have a payment method." | YES |

### Company and compliance

| Capability | Verdict | Specifics | Evidence (URL — quote) | Changed? |
|---|---|---|---|---|
| `status-page` | yes | Sandbox appears as a component, listed as operational, without its own percentage. | https://www.vercel-status.com — "Sandbox Operational" | — |
| `sla` | partly | 99.99%, Enterprise — The 99.99% Enterprise SLA covers the platform and does not name Sandbox. | https://vercel.com/legal/sla — "available 99.99% of the time, excluding any Excused Downtime events" | — |
| `soc2` | partly | Platform attestation, scope unstated — Vercel holds SOC 2 Type 2; the Sandbox security model says sandboxes run on infrastructure that maintains it, but the report's product scope is not published. | https://vercel.com/docs/security/compliance — "Vercel has a SOC 2 Type 2 attestation for Security, Confidentiality, and Availability." | detail only |
| `dpa` | yes | A public DPA applies to Enterprise and Pro customers. | https://vercel.com/legal/dpa — "This Addendum applies to Vercel's Processing of Personal Data as a Processor under the Agreement for Customers who are on Enterprise and Pro plans." | — |
| `open-source` | no | Hosted runtime only — The JS/Python SDK and CLI are Apache-2.0, but the Firecracker service has no self-hosted edition. | https://github.com/vercel/sandbox/blob/main/LICENSE — "Apache License" | source + detail |

## Rate-card inputs (original units)

### Plans and fees

| Plan | Fee | Credit / allowance | Session cap | Size cap | Concurrency | vCPU allocation |
|---|---|---|---|---|---|---|
| Hobby | $0 | 5 Active-CPU h/mo; 420 GB-h memory/mo; 5,000 creations/mo; 20 GB transfer/mo; 15 GB snapshot storage **lifetime**; 15 GB drive storage **lifetime**; 30 GB drive reads/mo; 30 GB drive writes/mo | 45 min | 4 vCPU / 8 GB / 64 GB disk / 15 ports | 10 | 20/min start, 40/min max |
| Pro | $20/mo | $20/mo usage credit, expires monthly, usable across infrastructure; transfer included in Flat Rate CDN (no per-GB Sandbox rate) | 24 h | 8 vCPU / 16 GB / 64 GB disk / 15 ports | 10,000 | 150/min start, +500/min per minute, 5,000/min max |
| Enterprise | Custom | Custom; public unit rates shown for reference; transfer $0.15/GB | 24 h | 32 vCPU / 64 GB / 64 GB disk / 15 ports | 10,000 (higher by sales) | 150/min start, +500/min per minute, 5,000/min max |

### Unit rates (default `iad1`)

| Meter | Published rate | Original unit | Notes |
|---|---|---|---|
| Active CPU | $0.128 | per vCPU-hour | Excludes time waiting on I/O (network, DB, model calls) |
| Provisioned memory | $0.0212 | per GB-hour | Billed for the whole session; 1-minute minimum increments |
| Sandbox creations | $0.60 | per 1,000,000 creations | One per `Sandbox.create()`, regardless of duration |
| Sandbox data transfer | $0.15 | per GB | Enterprise; Hobby has 20 GB/mo; Pro bundled in Flat Rate CDN |
| Snapshot storage | $0.08 | per GB-month | Same rate in all regions; 30-day default expiry after last use |
| Drive storage | $0.05 | per GB-month | Hourly on logical used size, not provisioned size; varies by region |
| Drive reads | $0.0015 | per GB | Logical bytes read; varies by region |
| Drive writes | $0.004 | per GB | Logical bytes written; varies by region |

### What changed in the rate card

**No published numeric rate, plan fee, recurring allowance, or free-tier figure changed.** The pricing page's `dateModified` is still 2026-09-10; the rate-card file was last checked 2026-10-30. The following are additions or clarifications, not price moves:

- **Container Registry image storage: $0.10/GB** (unit exactly as published; the page does not add "/month"). Applies only if you build custom Sandbox images. VCR limits: 2 GB per compressed layer, 15 GB total image, 2,000,000 entries per image, 5,000 repositories/project on Enterprise.
- **Secure Compute: Enterprise add-on, custom-priced**, with **Private Data Transfer $0.15/GB** for traffic that leaves the private network via the public internet; VPC-peering traffic to AWS is free. This is the first way to give a sandbox a fixed outbound IP.
- **Vercel Connect** (adjacent credential product): Hobby includes 500 token requests/mo; Pro $3.00 per 1,000 token requests; triggers 1,000/mo Hobby, $0.95 per 1,000 Pro. Only relevant if an agent uses Connect instead of passing secrets.
- **Observability Plus** is required for custom CPU/memory monitors on Sandbox; queries incur data-scanned charges. The built-in Sandbox observability cards are not separately priced.
- **Box Mount** is a Box private-preview integration, not a Vercel meter; Box's own pricing applies.
- **Static IPs (Advanced Networking)** are listed at $100/month per project plus Private Data Transfer, but that is the deployment static-IP product, not the Sandbox Secure Compute meter. Do not add it to a sandbox card.

### Arithmetic inputs that did not move

- A: 2 vCPU / 4 GB, 1,000 × 10 min = 166.667 h, 10% CPU. Memory 4 × 166.667 × $0.0212 = $14.133; CPU 2 × 166.667 × 0.10 × $0.128 = $4.267; creations 1,000 × $0.60/1M = $0.0006. **$18.40 before credit.**
- B: 4 vCPU / 8 GB, 730 h, 10% CPU. Memory 8 × 730 × $0.0212 = $123.808; CPU 4 × 730 × 0.10 × $0.128 = $37.376. **$161.18 before credit**, running-equivalent because a session caps at 24 h.
- C: 2 vCPU / 4 GB, 90 running h, 10% CPU. Memory 4 × 90 × $0.0212 = $7.632; CPU 2 × 90 × 0.10 × $0.128 = $2.304. **$9.94 before credit**, plus drive/snapshot storage.
- Disk model: `disk.stopped` 0.000109589 = $0.08/GB-month ÷ 730; `maxDisk` 64 GB; `ramWholeMinutes` true. Unchanged.

## Contradictions and first-party tensions

1. **Hobby reset rule (still two sentences on the same pricing page).** Top section: "Once you exceed your included limit on Hobby, sandbox creation is paused until the next billing cycle." Hobby section: "Once you exceed the quotas, sandbox creation is paused until 30 days have passed since you first used the feature." The model uses the 30-day wording because it is the specific Hobby rule; the billing-cycle sentence is the generic summary. Both URLs are the same page with different fragments.
2. **Docs hub vs reference surfaces (new).** Sandbox overview still says: "Manage sandboxes through the CLI, JS SDK, or Python SDK." It does not mention an HTTP API or MCP. Yet `https://vercel.com/docs/rest-api/sandboxes` documents 28 Sandbox endpoints, and `https://vercel.com/docs/agent-resources/vercel-mcp/tools/sandboxes` documents a Sandboxes tool group with `create_sandboxes_v2/v3/v4`. The model treats REST and MCP as supported, with the overview page lagging.
3. **"No manual snapshot management" vs billable automatic snapshots.** Overview: "Persistence is the default. No manual snapshot management needed." Persistence: "Each automatic snapshot consumes Snapshot Storage, which is billed separately from compute." Both are true; the model bills automatic snapshots and does not read "no manual management" as "no storage charge".
4. **Free downloads vs billable exposed-port traffic.** Pricing: "Data your sandbox downloads from the internet, such as packages, Git repositories, artifacts, and datasets, is free." Same page: "Data your sandbox sends to the internet, plus all traffic to and from exposed ports, is billable." Model: outbound-initiated downloads are free; inbound requests to an exposed port and the responses are billable, as are outbound sends.
5. **"1 or an even number of vCPUs between 2 and 32."** The sentence is internally odd (1 is not between 2 and 32). The size table and examples show 1, 2, 4, 8, … 32. Model uses 1, then even numbers 2–32; memory is fixed at 2 GB per vCPU, so 4 GB means 2 vCPU.
6. **Hobby "monthly allotment" vs lifetime storage.** Pricing intro: "On each billing cycle, Hobby plans receive a monthly allotment of Sandbox usage." Table: Snapshot Storage and Drive Storage are "15 GB (lifetime)". Model treats CPU, memory, creations, transfer and drive I/O as monthly; snapshot and drive storage as lifetime. This is the most buyer-relevant ambiguity on the page.
7. **Support terms lost the explicit Pro/Hobby exclusion.** The old sentence "Our Pro and Hobby tiers are not covered by a support plan or SLA" is no longer present in the current support terms (last updated 2026-06-12); the page now says only Enterprise customers get committed response times, and the SLA document is titled "Enterprise Service Level Agreement". The conclusion (no Pro/Hobby SLA) still holds, but the quote used in older notes is stale.

## Important products/features the 16×78 matrix misses

1. **Sandbox REST API** — `https://api.vercel.com/v2/sandboxes` and sessions/commands/files/snapshots/forks, v2–v4 create. This is a control plane any language can call, not just the JS/Python SDKs. Reference pages carry `last_updated: 2026-11-12`; no changelog entry was found. The MCP tools wrap the same endpoints.
2. **Vercel MCP Sandboxes tool group** — official remote MCP server with create/list/get, exec/kill, logs/stdin, file read/write/mkdir, snapshot, fork, network-policy and timeout tools. This is a control-plane MCP, not an MCP server running inside the sandbox.
3. **Secure Compute for Sandbox** — dedicated VPC, two static egress IPs, AWS VPC peering, active/passive region failover. Enterprise add-on. The static-IP capability only captures the address; private networking/VPC peering is a separate buyer feature.
4. **Vercel Container Registry (VCR)** — custom images, 2 GB compressed layers, 15 GB total image, 2,000,000 entries, $0.10/GB storage. `custom-image` captures the capability but not the registry limits or the separate storage meter.
5. **Multi-Agent Sandboxes** — several agents in one sandbox, each a Linux user with a private home; groups share a workspace. JS SDK only. This is isolation *inside* a sandbox, which `own-vm`/`root` do not express.
6. **Tags** — up to five key-value tags per sandbox, set/update at will, filter on list. No capability for labels/organisation.
7. **Region failover** — Pro/Enterprise can set an ordered failover list; Hobby/Pro-trial cannot (`payment_required`). Snapshots and drives are loaded cross-region for failover. `choose-region` captures choice, not resilience.
8. **Observability** — CPU, memory, data transfer, running sandboxes/sessions; `vercel metrics`; custom monitors need Pro/Enterprise + Observability Plus and incur data-scanned charges. No capability for metrics/alerts.
9. **Box Mount** — Box as a mounted filesystem in Sandbox, private preview, sync and agent run as separate sandbox users so Box credentials stay out of the agent workspace. `mount-buckets` only covers S3-style object stores.
10. **Vercel Connect** — short-lived OAuth/API tokens for Slack, GitHub, Microsoft, Snowflake, etc., without storing provider secrets; priced per token request/trigger. Adjacent to `hidden-secrets`/`secrets-store`.
11. **stdin for commands** — TypeScript SDK `stdin: true` + `detached: true`, `writeStdin()`/`closeStdin()`; CLI `sandbox exec --stdin`. Makes interactive REPLs and pipes possible; `pty` only captured the shell.
12. **Vercel Schedules (public beta)** — replaces the legacy Cron Jobs framing: recurring cron or one-off time, can call a route, private function or Queue, and schedules can be created at runtime. The `schedules` capability still points at `/docs/cron-jobs`, which now calls Cron Jobs legacy.
13. **Performance changes** — snapshot creation median 4.4 s → under 0.4 s (up to 10×), restore p50 500 ms → 250 ms (2026-11-09); Drives sandbox creation median 1.7 s → 0.7 s, p95 2.2 s → 1.6 s (2026-11-02). These strengthen `fast-start` but do not change its verdict.
14. **April 2026 security incident** — first-party bulletin: "We've identified a security incident that involved unauthorized access to certain internal Vercel systems." Origin was a compromised third-party AI tool (Context.ai) used by an employee, then the employee's Google Workspace and Vercel account; some non-sensitive environment variables were read and decrypted. Remediation closed 2026-10-16. The provider profile's company row does not mention it.
15. **Harbor / Terminal-Bench / SWE-bench and Scale AI AgentEnv** — first-party eval-harness integrations; `ecosystem` lists them, but no capability covers benchmark harnesses.
16. **Revenue scale (third-party)** — The Information/Dealroom reported about $600M annualized revenue in October 2026, up ~148% year over year. Third-party only; the site's company row uses funding and headcount, not ARR.

## Evidence and link drift found

- `site/src/data/docs.json` → `isolation` points at `https://vercel.com/docs/sandbox/concepts#isolation-architecture`. That heading no longer exists on `concepts`; the section moved to `https://vercel.com/docs/sandbox/concepts/security#isolation-architecture`.
- `site/src/data/docs.json` → `reaching-it` points at `https://vercel.com/docs/sandbox/concepts#network-access`. That heading also moved to `concepts/security#network-access` (and the practical how-to is `working-with-sandbox#expose-a-port`).
- `docker-inside` and `nested-virt` cite `concepts` but their quotes now live on `concepts/security` (the old "Container runtimes" bullet was removed from `concepts`; the deprecated `concepts/runtimes` page still has a variant).
- `public-url`, `private-url`, `tunnel`, `raw-tcp` cite `concepts` for "Exposed ports are accessible via a public URL"; that sentence now lives on `concepts/security`.
- `trials-free-tiers` and `free-credit` cite `plans/hobby` for "Unlock the full potential of Vercel Pro during your 14-day trial with $20 in credits." The sentence is gone; the trial page now says "The trial plan includes a $20 credit."
- `sizes-regions` cites `concepts` but quotes the pricing page's "19 regions" sentence. The quote is live on `pricing`, not on `concepts`.
- `schedules` cites `/docs/cron-jobs`; that page now opens with "Cron Jobs are a legacy feature" and points at Schedules. The capability still works, but the current product page is `/docs/schedules`.
- `ssh` cites `working-with-sandbox` and the "SSH-like experience" sentence is still there; the CLI also aliases `connect` to `ssh`, but it is not a standard SSH server.
- `scoped-keys` cites the overview; the authentication page is the better evidence ("A Vercel access token with access to the team") and still shows team-level, not per-sandbox, scope.
- `status-page`: the component is operational but still has no Sandbox-specific percentage. The status page now also lists a separate "Secure Compute" component.
- `sla`: the Enterprise SLA is still dated July 18, 2024 and still does not name Sandbox. The support terms are dated June 12, 2026; the terms of service are dated October 19, 2026; the DPA is dated March 17, 2026 (effective March 31, 2026).

## Source and method log

- Context `web_scrape` on `https://vercel.com/docs/sandbox/pricing` with `maxAgeMs: 0`, `formats.markdown`, `responseMode: full`: succeeded. Page metadata `dateModified` 2026-09-10T22:32:01Z; returned the full pricing table, regional selector, billing sections, resource/runtime/concurrency/API quotas, snapshot expiry and regions. A second `responseMode: compact` call also succeeded and returned the same table.
- TinyFish `fetch_content` with `ttl: 0` on the pricing page, `https://vercel.com/docs/rest-api/sandboxes` and `https://vercel.com/docs/agent-resources/vercel-mcp/tools/sandboxes`: succeeded, rendered Markdown. The REST URL resolves to the "List sandboxes" endpoint page (`GET https://api.vercel.com/v2/sandboxes`), confirming a live API reference rather than a docs stub.
- TinyFish `search`: succeeded for company funding/headcount and for the April 2026 incident; used only for third-party context and discovery, not for first-party claims.
- `curl` of Vercel's own `.md` endpoints: 23/23 Sandbox pages returned HTTP 200 `text/markdown` with a `last_updated` frontmatter field. `sandbox/ecosystem` is the newest at 2026-10-23; `sandbox` 2026-09-22; `pricing` 2026-09-10; `concepts` 2026-08-25. No Sandbox page's `last_updated` moved after the 2026-10-28 check except the new REST API reference pages (`2026-11-12`) and the MCP tools page (which carries the default `2018-10-20` placeholder).
- `curl` of status-page JSON: `components.json` and `incidents.json` both 200. Sandbox component `operational`, updated 2026-11-10T21:09:04Z. Incidents found on 2026-09-04, 2026-10-06 and 2026-11-10; the 2026-11-10 entry is retroactive (created 21:04Z for an 19:16–19:34Z event).
- `curl` of legal pages: SLA, terms, DPA, support terms, compliance all 200. Dates and quoted clauses checked in the rendered HTML.
- `curl` of `raw.githubusercontent.com/vercel/sandbox/main/images/universal/{README.md,Dockerfile}`: 200. README lists opencode, Claude Code, Codex and pi; Dockerfile installs `opencode-ai`, `@anthropic-ai/claude-code`, `@openai/codex`, `@earendil-works/pi-coding-agent`. No Chromium/Playwright/Firefox package found.
- `curl` of `raw.githubusercontent.com/vercel/sandbox/main/LICENSE`: 200, Apache License 2.0.
- Changelog: `https://vercel.com/changelog/sitemap.md` (188 KB) filtered for `sandbox`; dates cross-checked against the RSS/Atom feed (`/changelog/rss.xml`, updated 2026-11-11). The feed covers 100 entries back to 2026-10-19, so the 2026-10-28→2026-11-12 window is complete. No changelog entry announces the REST API or the MCP Sandboxes tools.
- Not used: Amp native `web_search` / `read_web_page`. Context and TinyFish both succeeded, so no fallback was needed.
- Not verified: regional rates other than `iad1` (interactive selector); actual sandbox behaviour/latency (no account); whether Vercel requires a card on a Hobby signup that is not a Pro trial; whether the MCP Sandboxes tools are enabled for every plan (the tools reference says team permissions and OAuth grants affect access); whether Sandbox is inside the SOC 2 audit boundary (report scope not published); whether the April 2026 incident touched Sandbox data (bulletin says non-sensitive environment variables, not Sandbox-specific).
## Integration notes for the parent thread

### Verdicts to change

| Capability | Old | New | Figure | Shortfall (required for `partly`) |
|---|---|---|---|---|
| `mount-buckets` | no | yes | S3 via FUSE | — |
| `static-ip` | not-published | partly | Enterprise add-on | Fixed outbound IPs need an Enterprise Secure Compute network, which is custom-priced; a sandbox without one leaves from shared Vercel addresses. |
| `rest-api` | no | yes | api.vercel.com v2-v4 | — |
| `mcp-server` | no | yes | Vercel MCP | — |
| `no-card` | not-published | yes | Trial starts card-free | — (note that the evidence is the documented trial path, not a "no credit card" marketing line) |

`static-ip` and `no-card` are the only rows whose `shortfall`/`note` must be added or replaced in a way that changes the buyer-facing sentence. `mount-buckets`, `rest-api` and `mcp-server` can drop any old "not documented" caveat.

### Detail-only edits

- `agents-preinstalled`: figure to `Claude Code, Codex, OpenCode, Pi`; note that the universal image installs all four.
- `custom-image`: add VCR limits (2 GB compressed layer, 15 GB total image, 2,000,000 entries) and the separate $0.10/GB image-storage charge.
- `soc2`: note the Sandbox security-model sentence ("Sandboxes run on Vercel's infrastructure, which maintains SOC 2 Type II certification") but keep `partly`, because the report's product scope is still not published.
- `hosts-other-agents`: keep `yes`; note Cursor Cloud Agents, Devin Outposts and the OpenAI Agents API. Claude Managed Agents also has a first-party changelog but is not in the ecosystem table.
- `live-resize`: replace the inferred note with the explicit SDK sentence; verdict stays `no`.
- `schedules`: repoint to `/docs/schedules` (Cron Jobs is now labelled legacy); verdict stays `yes`.

### Feature rows

- `ways-to-drive`: verdict stays `partly`, but the note/scenario must add the REST API and Vercel MCP Sandboxes tools; the dashboard still cannot create a sandbox, and there is still no standard SSH or desktop. This is the one feature row where the *specifics* materially change.
- `trials-free-tiers`: verdict stays `partly`; move the source quote to `https://vercel.com/docs/plans/pro-plan/trials` — "The trial plan includes a $20 credit" — and keep "Your trial finishes after 14 days" in the note. The old Hobby-page sentence is gone.
- `sizes-regions`: verdict stays `yes`; the "19 regions" quote belongs to `https://vercel.com/docs/sandbox/pricing`, not `concepts`. If the row keeps `concepts`, use "Vercel Sandbox is available in 19 regions. The default region is `iad1`." only with the pricing URL.
- `billing-models`: verdict stays `partly`; rates unchanged. If the row mentions adjacent charges, add Container Registry image storage at $0.10/GB (published unit has no "/month").
- `storage`: verdict stays `partly`; mention that S3-style buckets can be mounted manually with a FUSE driver, while Drives remain the managed path and one read-write mount is the limit.
- `outbound-network`: verdict stays `yes`; mention Secure Compute as the Enterprise route to fixed egress IPs and VPC peering.
- `snapshots-forks`: verdict stays `partly`; the 10× snapshot-creation and 50% restore improvements are worth a note but do not add memory snapshots.
- `company`: verdict stays `yes`; update the incident fact and add the April 2026 security incident. Do not turn the incident into a verdict change: it is a platform breach, not a Sandbox availability event.

### Provider profile

- `whatItIs`: "managed through a CLI, JavaScript SDK or Python SDK" → add "a documented REST API and an official MCP server".
- `sizes`: add that Pro/Enterprise can configure ordered failover regions; Hobby cannot.
- `billing.meter`: the list "creations, data transfer, snapshots and drives" is still correct for Sandbox meters; add Container Registry image storage only if the profile is meant to include custom-image costs.
- `billing.minimum`: still correct (memory 1-minute minimum; no CPU minimum published).
- `usability.dashboard`: update from "can stop or delete" to "can connect a browser terminal, stop/resume, snapshot and delete; creation is still CLI/SDK/API only".
- `company.facts[Recent incidents]`: replace the 2-incident value with the 3-incident value and the 10 November incident.
- `company.facts[Certification]`: optionally add the security-model sentence; keep the scope caveat.
- `company.facts[Headcount]`: no first-party update. Forbes still says 600 (Sep 2025); third-party 2026 estimates range roughly 800–1,024. Do not replace the dated Forbes figure with an undated estimate; if adding, label the estimate and its date.
- `strengths`: add "REST API and MCP control plane", "fixed egress IPs and VPC peering on Enterprise", "S3 mounts via FUSE", "per-agent Linux users in one sandbox".
- `caveats`: add "Hobby's snapshot and drive storage are 15 GB lifetime, not monthly" if the profile does not already make that clear; add "static IPs and VPC peering are Enterprise-only".

### docs.json

| Feature | Current | Suggested |
|---|---|---|
| `isolation` | `https://vercel.com/docs/sandbox/concepts#isolation-architecture` | `https://vercel.com/docs/sandbox/concepts/security#isolation-architecture` |
| `reaching-it` | `https://vercel.com/docs/sandbox/concepts#network-access` | `https://vercel.com/docs/sandbox/concepts/security#network-access` (or `working-with-sandbox#expose-a-port` for the how-to) |
| `ways-to-drive` | `https://vercel.com/docs/sandbox/sdk-reference` | keep, or add `https://vercel.com/docs/rest-api/sandboxes` as the API reference; the schema has one URL per feature, so keep SDK and mention REST/MCP in prose |
| `idle-timers` | `pricing#runtime-limits` | keep |
| `custom-domains` | `https://vercel.com/docs/sandbox` | keep (no dedicated page); note it is a "not published" answer |
| `built-in-agents` | `ecosystem` | keep; ecosystem now lists Cursor, Devin, Herdr, Hermes, OpenCode, Paseo and the eval harnesses |

### Dates

- Provider `checkedOn`: advance to `2026-11-12` (profile pages, pricing, changelog, status, terms, DPA, SLA and compliance reread).
- Pricing `checkedOn`: advance to `2026-11-12` (pricing page reread fresh; no rate change). The site-wide "oldest rate card" date may not move if another provider is older.
- `capabilities.json.checkedOn` / `usecases.json.checkedOn`: these are whole-dataset dates. A single-provider recheck does **not** justify moving them; record `vercel-sandbox` coverage on 2026-11-12 in the research notes instead.
- `site.json.checkedOn`: leave alone; it is profile/method metadata, not a provider research date.
- `changes.json`: add one entry dated 2026-11-12 for the REST API/MCP finding and the three corrections. Do not invent a launch date for the REST API or MCP tools; the observation date is the only date the evidence supports. If the parent prefers product-change entries only, fold this into the provider's research-note date and skip `changes.json`.

### Price baseline and tests

- Run `npm run check-rates` from `site/` after any source-URL edits. New money-bearing URLs that may need baseline entries: `https://vercel.com/docs/container-registry/limits-and-pricing` ($0.10/GB), `https://vercel.com/docs/sandbox/concepts/secure-compute` ($0.15/GB Private Data Transfer), `https://vercel.com/docs/connect/pricing` ($3.00/1,000 token requests, $0.95/1,000 triggers), `https://vercel.com/docs/networking/static-ips` ($100/month per project).
- No A/B/C total changes. Do not rewrite `cost.test.ts` expectations. If a test fails, the cause is an unrelated edit, not this recheck.
- The `RateCard` still cannot express: regional rates other than `iad1`, the Pro "included in Flat Rate CDN" transfer (no per-GB number), Hobby's lifetime storage caps, the 15-port/4-drive limits, VCR storage, Secure Compute private transfer, or the 14-day inactivity deletion. These remain model limitations in the research notes; none should be forced into a numeric field.

## Verification performed

- 94/94 rows present: 16 features + 78 capabilities, each capability ID exactly once, each feature ID exactly once.
- Quote audit: every one of the 94 evidence quotes was mechanically matched against the fetched text of its cited URL (whitespace, Markdown emphasis/link syntax, backticks, escaped table pipes and rendered-HTML tag boundaries normalized). Result: **94/94 present**. The only non-literal cases are Markdown table rows (the session-duration and `keepLastSnapshots` quotes), where the source uses `|` cell separators; those are declared normalizations, not paraphrases.
- Pricing freshness: Context `maxAgeMs: 0` + TinyFish `ttl: 0` + curl `.md` all returned the same table; page JSON-LD `dateModified` is 2026-09-10. No rate changed between 2026-10-30 and 2026-11-12.
- Link check: 11 representative docs/legal/status URLs returned HTTP 200; all 23 Sandbox `.md` endpoints returned 200. `docs.json` anchors were checked against the rendered HTML ids: `isolation-architecture` and `network-access` exist on `concepts/security`, not on `concepts`.
- Status check: `components.json` says Sandbox `operational` (updated 2026-11-10T21:09:04Z); `incidents.json` has 3 Sandbox incidents in the window.
- Worktree: no repo data files edited, nothing committed or pushed. Only this scratchpad file was written.

## Residual unknowns

- Exact launch date of the Sandbox REST API and the MCP Sandboxes tools. The reference pages are dated 2026-11-12, but that may be a docs regeneration; no changelog entry exists.
- Whether the MCP Sandboxes tools are enabled on Hobby or only on paid teams. The tools reference says team permissions and OAuth grants affect access, not plan.
- Whether a Hobby signup (not the Pro trial) ever asks for a card. The trial path is documented as card-free; Hobby signup itself is not described step by step.
- Regional rates other than `iad1`. The selector is interactive; the `.md` exposes only the default table. Do not present `iad1` rates as global.
- Whether Sandbox is inside the SOC 2 Type 2 audit boundary and the ISO 27001 certificate scope. The security page says the infrastructure maintains SOC 2 Type II; the report scope is not published.
- Whether the April 2026 security incident touched any Sandbox data. The bulletin describes non-sensitive environment variables on Vercel generally; Sandbox is not named.
- The billing period for VCR's "$0.10 per GB" (monthly storage vs transfer). The page gives no period; treat it as storage with a caveat.

## Copy-ready snippets

### Provider company fact — Recent incidents

```json
{
  "label": "Recent incidents",
  "value": "By this guide's count, the status page lists 3 Sandbox incidents from 6 August to 12 November 2026: elevated Sandbox error rates in Paris on 6 October (about 24 minutes), slow VCR, Blob and Sandbox APIs on 4 September (about 76 minutes), and elevated Sandbox and Blob request latency and errors in iad1 on 10 November (18 minutes, reported retroactively). The largest was 4 September, resolved at 20:27 UTC.",
  "source": {
    "url": "https://www.vercel-status.com/incidents/5m8qxy05bly7",
    "quote": "On November 10, 2026, between 19:16 and 19:34 UTC, some Sandbox and Blob API requests in iad1 region experienced elevated latency and errors.",
    "confidence": "docs-confirmed"
  }
}
```

### Provider company fact — Security incident (optional, new)

```json
{
  "label": "Security incident",
  "value": "An April 2026 incident involved unauthorised access to certain internal Vercel systems after a third-party AI tool used by an employee was compromised; some non-sensitive environment variables were read and decrypted. Vercel closed all remediation actions on 16 October 2026. Sandbox is not named in the bulletin.",
  "source": {
    "url": "https://vercel.com/kb/bulletin/vercel-april-2026-security-incident",
    "quote": "We've identified a security incident that involved unauthorized access to certain internal Vercel systems.",
    "confidence": "docs-confirmed"
  }
}
```

### docs.json

```json
{
  "isolation": {
    "title": "Sandbox security model: isolation architecture",
    "url": "https://vercel.com/docs/sandbox/concepts/security#isolation-architecture"
  },
  "reaching-it": {
    "title": "Sandbox security model: network access and exposed ports",
    "url": "https://vercel.com/docs/sandbox/concepts/security#network-access"
  }
}
```

### Capability rows (changed)

```json
[
  {
    "provider": "vercel-sandbox",
    "verdict": "yes",
    "figure": "S3 via FUSE",
    "note": "Install Mountpoint for Amazon S3 in the guest and mount a bucket at a path; credentials are passed to the mount command. Documented first-party, not a managed bucket attachment.",
    "source": {
      "url": "https://vercel.com/docs/sandbox/mount-remote-storage",
      "quote": "Mount an external object store such as Amazon S3 into a sandbox and work with remote files as if they were local.",
      "confidence": "docs-confirmed"
    }
  },
  {
    "provider": "vercel-sandbox",
    "verdict": "partly",
    "figure": "Enterprise add-on",
    "shortfall": "Fixed outbound IPs need an Enterprise Secure Compute network, which is custom-priced; a sandbox without one leaves from shared Vercel addresses.",
    "note": "A Secure Compute network carries two static IPs. Attach at create with networkId, or later with update; the change takes effect on the next session. The same network gives VPC peering to AWS.",
    "source": {
      "url": "https://vercel.com/docs/sandbox/concepts/secure-compute",
      "quote": "Its public-internet traffic then exits through the network's static IPs",
      "confidence": "docs-confirmed"
    }
  },
  {
    "provider": "vercel-sandbox",
    "verdict": "yes",
    "figure": "api.vercel.com v2-v4",
    "note": "Documented Sandboxes group: list/create/get/update/delete, sessions, commands and stdin, file read/write/mkdir, snapshots, fork and network policy. Create exists at v2, v3 and v4; the list page is v2.",
    "source": {
      "url": "https://vercel.com/docs/rest-api/sandboxes",
      "quote": "Endpoints in the Sandboxes group of the Vercel REST API Reference.",
      "confidence": "docs-confirmed"
    }
  },
  {
    "provider": "vercel-sandbox",
    "verdict": "yes",
    "figure": "Vercel MCP",
    "note": "The official remote Vercel MCP server exposes a Sandboxes tool group built on the same API: create/list/get sandboxes, run and kill commands, stream logs, read and write files, snapshot, and extend session timeouts.",
    "source": {
      "url": "https://vercel.com/docs/agent-resources/vercel-mcp/tools/sandboxes",
      "quote": "Create sandboxes to run commands and work with files in isolated environments.",
      "confidence": "docs-confirmed"
    }
  },
  {
    "provider": "vercel-sandbox",
    "verdict": "yes",
    "figure": "Trial starts card-free",
    "note": "The Pro trial start steps never ask for a payment method, and Vercel says charges apply only if you have one; Hobby is free. No page states a card is required.",
    "source": {
      "url": "https://vercel.com/docs/plans/pro-plan/trials",
      "quote": "Charges apply only if you have a payment method.",
      "confidence": "docs-confirmed"
    }
  }
]
```

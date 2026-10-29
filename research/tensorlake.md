# Tensorlake: open questions and contradictions

Research done 2026-10-29 against `docs.tensorlake.ai` (108 pages in its `llms.txt` index), the
marketing site, the Terms, the Trust Center and the status page. Every quote in the four JSON files
was checked against the page it cites.

## Contradictions inside Tensorlake's own material

1. **Does Pro's $250 include usage?** The pricing page says yes: "Includes 25,000 CU ($250 of
   usage) per billing cycle." The billing docs table says "**Pro** | \$250 / month + usage" and the
   pricing FAQ says "Pro is \$250 per month plus metered usage." The rate card follows the pricing
   page (fee $250, credit $250) because it is the more specific statement, but a buyer should get
   this in writing. If the docs are right, every Pro figure in this repo is $250 too low.

2. **Are resources fixed at creation or resizable?** The lifecycle page: "These are fixed when the
   sandbox is created and cannot be changed afterwards." The live-resize page: "A sandbox can change
   its CPU, memory, and root disk allocation while it runs." Live resize has its own page, SDK
   method, CLI flag and error type, so the lifecycle sentence looks stale, but it is the sentence a
   reader hits first.

3. **Two names for one plan.** Docs, dashboard and pricing page say "Usage Credits"; the Terms say
   the plans are "On-Demand, Pro and Enterprise" and never mention Usage Credits. Probably the same
   tier renamed, but nothing states it.

4. **Free credits.** The Harbor guide says "New accounts include free credits, enough to run a full
   Terminal-Bench sweep before you pay for anything." The pricing page describes a $0 free tier with
   no card and prepaid packs starting at $5, with no signup credit. Either there is a promotion the
   pricing page omits, or the Harbor page is out of date.

5. **HIPAA.** Pricing: "HIPAA compliant with a BAA on Pro and above." Introduction: "Tensorlake is
   HIPAA and SOC 2 Type II compliant." The Trust Center shows a SOC 2 badge only, and the Terms
   forbid storing protected health information unless a written agreement is in place. Treat HIPAA
   as a contract term, not a product property.

## Open questions

1. **The "5M-per-project ceiling."** The pricing page says every tier runs on "the same Firecracker
   microVMs, the same APIs, and the same 5M-per-project ceiling." Nothing in the docs says what the
   5M counts — sandboxes, compute units, requests. Worth asking before a large rollout.

2. **Regions.** The introduction claims EU data residency. There is no region parameter, no region
   list, no console control, and the BYOC walkthrough defaults to `us-east-1`. Which plans get EU
   placement, and whether it is a separate cluster, is unpublished.

3. **Snapshot storage size.** The rate is $0.07 per GB-month, but the snapshot page says "Users are
   only billed for unique bytes in their images and snapshots." A suspended sandbox's stored size is
   therefore not its disk size. The calculator models it as the disk size, so workload C's $1.23 of
   storage is an upper bound.

4. **GB or GiB.** Plan limits and rates are written in GB; `disk_mb` is MiB and the API treats 10,240
   MiB as "10 GB". The two differ by 7%. The rate card treats them as equal, like the rest of the
   site.

5. **Active-CPU metering.** "CPU usage is billed from active runtime execution when active metering
   is available" and falls back to allocated vCPU time "if an active CPU sample is unavailable or
   untrustworthy". How often that happens, and whether it is visible per sandbox, is not documented.
   This is the single biggest lever on a Tensorlake bill.

6. **Whether the console can create a sandbox.** The console has a Sandboxes list with a Logs tab,
   and the docs walk through opening it. No page shows a Create button, and every quickstart is a
   CLI or SDK call. The `ways-to-drive` row says "not documented" rather than "no".

7. **Free tier and repeated resume.** Free sessions are capped at 2 hours, and a named sandbox
   suspends rather than terminating at its timeout. Whether a free user can resume the same sandbox
   indefinitely, and whether that counts against "unmetered sessions", is not stated.

8. **The npm incident.** The Trust Center records "Malicious `tensorlake@0.5.144` published to npm"
   on 8 October 2026, with a GitHub advisory. No page says what was in it or how long it was
   installable. Anyone pinning the JavaScript SDK should read the advisory first.

9. **Custom domains in BYOC.** The BYOC page says you own the endpoint and its domain, and requires
   an ACM certificate and a public DNS zone. Whether one certificate can cover a wildcard for all
   sandboxes, and who renews it, is left to the reader.

10. **Memory snapshot restore limits.** A memory snapshot carries its own image and resources and
    cannot change them at restore time, though the restored sandbox can be resized afterwards. The
    practical effect — a snapshot taken at 16 vCPU restores at 16 vCPU and bills accordingly — is
    easy to miss.

## Company facts that disagree across third parties

- Founded 2023 (Indexed.vc, and consistent with the founder's December 2023 "I am starting a
  company" post) versus 2022 (StartupHub).
- Seed round dated January 2024 (Indexed.vc, marked "est.") versus January 2025 (StartupHub). Both
  agree on $8M and on Artisanal Ventures and Plug and Play; Indexed.vc adds Hawk Hill Ventures.
- Headcount 14 (Exa's company record) versus 11–50 (Indexed.vc band).
- Tensorlake publishes no funding announcement, about page or careers salary data that would settle
  any of this. The provider file marks all of it third-party.

## Crabbox and OpenClaw

Crabbox is "an open-source command-line interface (CLI) from OpenClaw", and Tensorlake documents a
Crabbox provider. It is **not** an OpenClaw route: Crabbox warms a sandbox, syncs `git ls-files` and
runs a test suite through `tensorlake sbx exec`. It does not host the OpenClaw Gateway, and
`docs.openclaw.ai` has no Tensorlake page. The OpenClaw row in `usecase-routes.json` is therefore
`manual`, with Crabbox named in the text as a related tool rather than a route.

## Coverage notes

- 108 pages are indexed; the sandbox section is 42 of them. I read all 42 plus billing,
  authentication, access control, SSO, security, the AWS BYOC page, the pricing FAQ and the
  applications and filesystems introductions.
- Pages cited but not in `llms.txt` (`platform/access-control`, `platform/sso`, `platform/security`,
  `faqs/pricing-limits-faq`) were fetched directly and exist.
- Not read: the webhook configuration, event and signature pages (skimmed for the overview only),
  the orchestration pages beyond the sandbox patterns, and the GitHub Actions pages beyond their
  index entries. None of the sixteen features depends on them.
- The pricing page renders a calculator with sample figures; those were ignored in favour of the
  published rates.

# Tensorlake: capabilities the sixteen features do not cover

Each entry is a plain-language definition, then the Tensorlake page that documents it. Everything
below was read on 2026-10-29 and is quoted or paraphrased from those pages.

## Compute and hardware

**GPUs.** Sandboxes with an attached NVIDIA GPU for CUDA, PyTorch, vLLM or SGLang work. They are
not self-serve: you ask on Slack for access. They run on gVisor rather than a VM, so CPU and memory
cannot be resized live and Tensorlake volumes cannot be mounted into them. Managed images ship for
CUDA 13.3, vLLM 0.26 and SGLang 0.5, without model weights.
Docs: https://docs.tensorlake.ai/sandboxes/gpu

**Live resize.** Change a running sandbox's vCPUs, memory and root disk without restarting it, so a
build that runs out of memory does not lose its work. CPU moves up or down, memory grows freely but
shrinks only as far as the guest can release, and disk only grows. Each resize is a numbered
generation whose status you can poll. GPU sandboxes can only grow their disk.
Docs: https://docs.tensorlake.ai/sandboxes/live-resize

**Nested virtualisation.** Run a virtual machine inside the sandbox, because the guest exposes
`/dev/kvm`. This is what makes Android emulators, Kata containers or a QEMU test rig possible;
snapshot and restore still work with the inner VM running. GPU sandboxes do not support it.
Docs: https://docs.tensorlake.ai/sandboxes/nested-virt

**Docker inside a sandbox.** Run `docker`, `docker compose` and systemd services inside the
sandbox. It needs the `tensorlake/ubuntu-systemd` image, because the default image has no systemd,
and Docker itself is installed from Ubuntu's repository in a setup step.
Docs: https://docs.tensorlake.ai/sandboxes/docker

## Starting and scaling

**Warm pools.** A pool keeps a set number of sandboxes pre-booted from one template (image,
resources, entrypoint, timeout, network policy). Creating a sandbox from the pool claims a warm one
instead of cold-booting, and the pool boots a replacement. `max_containers` caps the pool, and at
the cap new sandboxes wait as `pending`.
Docs: https://docs.tensorlake.ai/sandboxes/pools

**Queued sandboxes.** Create a sandbox without waiting for it to start (`wait=False`), then poll it.
`pending_reason` says what it is waiting for — scheduling, no host with room, pool at capacity, a
snapshot in another region, or the image being fetched. `max_pending_secs` bounds the wait, and a
batch of ten thousand sandboxes costs one list call per poll rather than ten thousand.
Docs: https://docs.tensorlake.ai/sandboxes/queued-sandboxes

**Snapshots as a cache.** A snapshot is not only a backup: build an environment once with its apt
and pip installs, snapshot it, and restore it for every later trial, which is how Tensorlake sells
itself to evaluation and RL workloads.
Docs: https://docs.tensorlake.ai/sandboxes/snapshots

**Sandbox images.** Build an image from a Dockerfile, the Python SDK or the TypeScript SDK, or
import an existing OCI image from a registry (private registries work through `docker login`), then
launch sandboxes from the registered name. Images use a content-addressed streaming format, so a
sandbox starts before its image has finished downloading. `EXPOSE`, `VOLUME`, `HEALTHCHECK` and
`LABEL` are accepted at build time but have no effect at run time.
Docs: https://docs.tensorlake.ai/sandboxes/images

**Managed images.** `tensorlake/ubuntu-minimal` (the default, no systemd), `ubuntu-systemd`,
`debian-minimal` and `ubuntu-vnc` (XFCE, TigerVNC, Firefox, Chrome). All run as `tl-user`, a
non-root user with passwordless sudo, and non-interactive commands start in `/`, so relative paths
fail unless you pass a working directory.
Docs: https://docs.tensorlake.ai/sandboxes/tensorlake-images

## Storage and state

**Mounted filesystems (Cloud Volumes).** A durable directory you mount into one or many sandboxes
as an ordinary POSIX path. Reads stream in lazily, writes replicate to durable storage on their own,
and you can snapshot the volume, roll it back to a point in time, or hand the same files to a fleet
read-only. Mounts can be read-only, prefetched, pinned to a permanent snapshot, or presented as a
chosen guest user. Up to eight per sandbox.
Docs: https://docs.tensorlake.ai/filesystems/introduction

**Hosted Git repositories.** Tensorlake-hosted Git that scales, per its own claim, to tens of
millions of repositories. Use it as ordinary Git over smart HTTP, or mount a branch into a sandbox
without cloning and promote the result with a compare-and-swap that copies no bytes.
Docs: https://docs.tensorlake.ai/git/introduction

**Repository mounts.** Stream a branch into a sandbox as a directory, autosave private changes,
snapshot them into commits and promote to a shared branch — without a checkout.
Docs: https://docs.tensorlake.ai/git/workspace-mounts

**Time travel.** Restore a volume to an earlier snapshot, or fork it from that point, which is how
an agent's working state gets versioned without the agent learning Git.
Docs: https://docs.tensorlake.ai/filesystems/core-concepts

## Reaching in

**Local tunnels.** Forward a port inside a sandbox to `localhost` on your machine over an
authenticated WebSocket, for protocols the HTTP proxy cannot carry — VNC, Postgres, MySQL, Redis,
MongoDB, arbitrary binary — without exposing the port publicly.
Docs: https://docs.tensorlake.ai/sandboxes/tunnels

**PTY sessions.** A programmatic terminal: create a session over HTTPS, attach over a WebSocket,
send input, resize, detach and reattach by token. This is what a browser terminal is built on.
Idle sessions with no client are killed after 300 seconds.
Docs: https://docs.tensorlake.ai/sandboxes/pty-sessions

**SSH and Remote-SSH.** A standard SSH endpoint where the sandbox ID is the username and a key
registered once with your account authenticates it, with `scp`, `sftp`, `rsync` and all four
port-forwarding modes. VS Code, Cursor and JetBrains Gateway connect over Remote-SSH and keep
`~/.vscode-server` across suspends.
Docs: https://docs.tensorlake.ai/sandboxes/pty-sessions

**Sandbox as a dev environment.** A named sandbox as a portable workstation: SSH in, work, walk
away, and resume weeks later with shell history, installed packages, tmux sessions and the editor
server exactly where they were.
Docs: https://docs.tensorlake.ai/sandboxes/remote-dev

**Process logs.** Retained stdout and stderr for every sandbox process, browsable, searchable and
filterable in the console by level, process and text, with JSON lines parsed into structured
attributes.
Docs: https://docs.tensorlake.ai/sandboxes/process-logs

## Desktop and browser

**Computer use.** A managed desktop image (`tensorlake/ubuntu-vnc`) whose XFCE session you drive
from Python or JavaScript: screenshots, mouse move, click, double-click, scroll, key down/up, typed
text. The SDK reaches it through the authenticated proxy, so port 5901 never has to be public.
Docs: https://docs.tensorlake.ai/sandboxes/computer-use

**Chrome over CDP.** Start Chrome on the desktop display with `--remote-debugging-port=9222`, tunnel
9222 to localhost, and point Playwright, Puppeteer, `chrome-remote-interface` or the
`chrome-devtools-mcp` server at it. Two clients can drive different tabs of the same browser, so an
agent and a human reviewer can share one window.
Docs: https://docs.tensorlake.ai/sandboxes/chrome-cdp

**noVNC.** Put a live desktop in a browser by bridging the tunnel to a WebSocket endpoint and
pointing noVNC at it, keeping the API key on your backend while an agent loop uses the SDK desktop
client in parallel.
Docs: https://docs.tensorlake.ai/sandboxes/computer-use#use-novnc-in-the-browser

## Agent integrations

**Claude Managed Agents.** Anthropic runs the agent loop; your orchestrator creates one Tensorlake
sandbox per session and a worker inside it executes each tool call. The recommended mode runs the
webhook receiver in its own sandbox with port 5051 exposed, so nothing stays running on your
machine.
Docs: https://docs.tensorlake.ai/sandboxes/claude-managed-agents

**Cursor Cloud Agents.** Cursor keeps the agent loop and the model; each Cursor request gets a
Tensorlake worker sandbox, and the orchestrator runs in a sandbox too. Self-hosted pools need a
Cursor Enterprise team and a service-account key; a personal key can run one long-lived worker.
Docs: https://docs.tensorlake.ai/sandboxes/cursor-cloud-agents

**Devin Outposts.** Cognition keeps the agent loop; the session machine is a Tensorlake sandbox you
own, which is how an outpost gets private CA certificates, preinstalled toolchains and access to
internal services. Linux only, one orchestrator per outpost.
Docs: https://docs.tensorlake.ai/sandboxes/devin-outposts

**OpenCode.** A plugin (`tensorlake-opencode`) intercepts OpenCode's bash, read, write, edit,
multiedit, apply_patch, ls, glob and grep tools and runs them in a sandbox, while the TUI and the
model loop stay local. The sandbox is created lazily on the first intercepted tool call.
Docs: https://docs.tensorlake.ai/sandboxes/opencode

**Crabbox.** OpenClaw's open-source CLI that warms a sandbox, syncs a git diff and runs a test
suite; its Tensorlake provider shells out to the `tl` CLI. Tensorlake publishes a `tl-crabbox` image
because the stock images run as `tl-user`, who cannot create Crabbox's default `/workspace` workdir.
Docs: https://docs.tensorlake.ai/sandboxes/crabbox

**Harbor.** Tensorlake is an `--env` provider in Harbor, the evaluation framework from the
Terminal-Bench authors: one clean sandbox per trial, the task's real Docker image imported rather
than replayed, and the verifier's reward file written where the agent cannot reach it.
Docs: https://docs.tensorlake.ai/sandboxes/harbor

**Skills in sandboxes.** Pre-load Tensorlake skill files into an image so a coding agent discovers
them at startup instead of being told about the API.
Docs: https://docs.tensorlake.ai/sandboxes/skills-in-sandboxes

**Tool calls.** The general pattern for exposing a sandbox to any model as a `run_code` tool, with
Claude, OpenAI and OpenAI Agents SDK examples, and advice to reuse one sandbox per session.
Docs: https://docs.tensorlake.ai/sandboxes/tool-calls

**Scale AI AgentEnv.** Tensorlake is a built-in sandbox provider in Scale AI's AgentEnv, with one
sandbox holding the whole environment. Listed on the homepage; no Tensorlake doc page covers it.
Docs: https://www.tensorlake.ai/

## Platform extras

**Orchestration.** A durable-function layer on top of the sandboxes: `@application` and `@function`
decorators, parallel futures, map-reduce, retries, cron, crash recovery that skips completed work,
and application endpoints callable over HTTP. It is a separate product from the sandbox API, sold
by the same company.
Docs: https://docs.tensorlake.ai/applications/introduction

**Sandboxes inside orchestration.** Two documented patterns: the agent runs inside a function, or
the agent runs in a function and creates sandboxes as tools, which keeps API keys out of the
untrusted code.
Docs: https://docs.tensorlake.ai/applications/sandboxes

**Webhooks.** Signed, project-scoped notifications for sandbox and application lifecycle events
(such as `sandbox.running` and `sandbox.failed`), verified with a Svix signature, which replaces
polling when you create sandboxes in bulk.
Docs: https://docs.tensorlake.ai/platform/webhooks/overview

**BYOC on AWS.** Run the executors, and optionally the ingress, in your own AWS account: your code,
snapshots and capacity stay in your VPC and S3 bucket while Tensorlake Cloud remains the control
plane. Needs bare-metal `i7i.metal-24xl` or `i7i.metal-48xl` capacity.
Docs: https://docs.tensorlake.ai/platform/self-hosted-compute/aws

**GitHub Actions runners.** Run workflow jobs on Tensorlake runners with a chosen size and a
dependency cache shared across runs. Separate from the sandbox product.
Docs: https://docs.tensorlake.ai/github-actions/quickstart

**CI and data-analysis recipes.** Two worked examples of the sandbox as a build runner and as a
fan-out for parallel model benchmarks, both using snapshots to avoid reinstalling dependencies.
Docs: https://docs.tensorlake.ai/sandboxes/cicd-build and https://docs.tensorlake.ai/sandboxes/data-analysis

**SSO.** OIDC or SAML 2.0 for an organisation, configured by an org admin, gated on SSO being
enabled for that organisation.
Docs: https://docs.tensorlake.ai/platform/sso

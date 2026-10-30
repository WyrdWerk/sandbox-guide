# InstaBox (instabox.sh, by InsForge) — provider profile

Disclosure: battleships.dev, cited in this document, is built by the Boat team; Boat is one of the providers compared here. It is used as a cross-check, never as the sole source of a rate or verdict.

Research date: **2026-10-28**. Desk research only: no account was created, no sandbox was started, nothing was billed.

Claim tags used throughout (the five requested categories):

| Tag | Meaning |
|---|---|
| **[docs-confirmed]** | Stated by the provider itself, with the URL and an exact quote in the claim. Covers the docs pages, `llms.txt`/`llms-full.txt`, the OpenAPI 3.1 document at <https://api.instabox.sh/v1/openapi.json>, the changelog at <https://instabox.sh/changelog>, and the Terms at <https://instabox.sh/terms>. The URL in each claim says which one; where the source is the OpenAPI document, the claim names the schema or field it comes from. |
| **[pricing-page]** | Stated on <https://instabox.sh/pricing> or <https://instabox.sh/docs/pricing> (plan names, prices, unit rates, billing meter, calculator). |
| **[third-party]** | Independent or competitor source, not the vendor: battleships.dev, a hands-on review, launch coverage. |
| **[inferred]** | My reasoning from the cited evidence; not stated by anyone. |
| **[not-published]** | The provider does not state it; no guess is offered. |

Everything tagged `docs-confirmed`, `pricing-page` or `third-party` carries its own source URL and a short verbatim quote. `inferred` and `not-published` claims are labelled precisely because no quote exists, and each names the evidence it reasons from or the gap it fills.

Two vocabulary notes before anything else, because they cause most of the confusion on this site:

- The product is called **InstaBox**; the company is **InsForge AI, Inc.** The API, CLI and docs call a sandbox a **machine** (`/v1/machines`, `machineId`, `machines:read`). The OpenAPI document says so itself: *"Paths, fields and scopes call a sandbox a machine"* **[docs-confirmed]** <https://api.instabox.sh/v1/openapi.json>. Marketing pages say "sandbox", "machine" and "box" interchangeably; the Terms define *"a virtual machine provisioned through the Services, also called a machine or a box"* **[docs-confirmed]** <https://instabox.sh/terms>.
- **InstaBox is not InstaCloud.** InstaCloud (docs.instacloud.com) is InsForge's managed-backend product (Postgres, Redis, buckets, deploys). InstaBox is a separate product with a separate API host (`api.instabox.sh`) and a separate key prefix (`ibk_`). The InstaBox Terms define it as *"InsForge's proprietary cloud computer platform for AI Agents, marketed as InstaBox, including Sandboxes with persistent storage, pause and resume, Snapshots, public ports, virtual desktops, workspaces, and Secrets"* **[docs-confirmed]** — <https://instabox.sh/terms>.

---

## 1. What it is, who it is for, product lines

**One paragraph.** InstaBox sells full Linux virtual machines, one per AI agent, that boot in about a second, keep their disk between sessions, and can be paused with their memory and running processes intact. Each machine is a Firecracker microVM running Debian 13 with its own kernel, root, systemd and Docker, so an agent can install anything a normal Linux box can run rather than being confined to a language runtime or a container filesystem. You drive it from a web dashboard, a CLI, a TypeScript SDK or plain HTTP, and you can watch or take over its graphical desktop. The intended buyer is a team running coding or computer-use agents that need a real machine per task, not a single shared dev box.

Each sentence of that paragraph is evidenced below; nothing in it is inference.

| Sentence claim | Tag | Source + exact quote |
|---|---|---|
| One Linux VM per agent | [docs-confirmed] | <https://instabox.sh/docs> — "InstaBox gives each agent a Linux machine of its own in the cloud." |
| Boots in about a second | [docs-confirmed] | <https://instabox.sh/docs/integrate> — "carries on where it left off, usually in about a second"; the cold-boot "<1 second" figure is vendor marketing repeated by launch coverage, not a measured number **[third-party]** <https://www.founderland.ai/articles/instabox-launches-cloud-computers-for-ai-agents-in-1-second-mvb8hewn> |
| Keeps its disk between sessions | [docs-confirmed] | <https://instabox.sh/docs/concepts> — "Files under `/data` (home is `/data/home`) and the software you install stay." |
| Pause keeps memory and processes | [docs-confirmed] | <https://instabox.sh/docs/api/lifecycle> — "Pauses a running machine, keeping its memory and running programs." |
| Firecracker microVM, Debian 13, own kernel | [docs-confirmed] | <https://instabox.sh/docs/limits> — "Debian 13 (trixie), amd64, with systemd, on Linux 6.18.54 … in a Firecracker microVM" |
| Root, systemd, Docker | [docs-confirmed] | <https://instabox.sh/docs/limits> — "passwordless `sudo` with apt for anything else"; "Docker with Compose"; <https://instabox.sh/> — "A whole machine, with its own kernel." |
| Dashboard, CLI, TypeScript SDK, HTTP | [docs-confirmed] | <https://instabox.sh/docs/keys-sdk> — "The TypeScript SDK, plain HTTP, the CLI and SSH all accept one." |
| Watch or take over the desktop | [docs-confirmed] | <https://instabox.sh/docs/desktop> — "Click the desktop to take control; it goes back to the agent after a minute idle." |
| Buyer: teams running coding/computer-use agents | [inferred] | From the default template's contents (<https://instabox.sh/docs/limits> — "Claude Code, Codex … the desktop (VNC, Xfce, Chromium)") and the one-command onboarding (<https://instabox.sh/docs/start> — "npx instabox@latest sh") |

| Claim | Tag | Source + exact quote |
|---|---|---|
| Marketed as cloud computers for AI agents | [docs-confirmed] | <https://instabox.sh/> — "Cloud Computers for AI Agents" / "Full Linux VMs for long-running agents." |
| Built for coding agents specifically | [docs-confirmed] | <https://api.instabox.sh/v1/openapi.json> — "Linux computers in the cloud that keep their files and software, for coding agents such as Claude Code, Codex and OpenCode." |
| Made by InsForge; Delaware corporation | [docs-confirmed] | <https://instabox.sh/terms> — "InsForge AI, Inc., a Delaware corporation ("InsForge," "we," or "us"), which operates InstaBox." |
| YC-backed, San Francisco | [third-party] | <https://x.com/insforge> (search snippet) — "The creators of InstaBox, cloud computers for AI agents (YC P26)" |
| Live scale claim (dynamic, unverifiable) | [docs-confirmed] | <https://instabox.sh/> — "7,701 machines running" |

**Product lines** (all one product, sold as capabilities):

1. **Machines (sandboxes)** — the core VM. Templates: `agent-browser` (default), `universal`, `t3`, `herdr`, `orca`, `ci` **[docs-confirmed]** — <https://instabox.sh/docs/limits>.
2. **Snapshots** — saved machine images you start new machines from **[docs-confirmed]** — <https://instabox.sh/docs/snapshots>.
3. **Public ports** — an HTTPS URL per port **[docs-confirmed]** — <https://instabox.sh/docs/ports>.
4. **Desktop / computer use** — Xfce + Chromium + VNC, plus an in-machine computer-use MCP **[docs-confirmed]** — <https://instabox.sh/docs/desktop>.
5. **SSH / mosh gateway**, **web terminal**, **file and exec API** **[docs-confirmed]** — <https://instabox.sh/docs/ssh>.
6. **Org Secrets** — a credential proxy for outbound HTTPS **[docs-confirmed]** — <https://instabox.sh/docs/secrets>.
7. **Webhooks** — signed state-change events **[docs-confirmed]** — <https://instabox.sh/docs/webhooks>.
8. **CI** — GitHub Actions jobs on InstaBox runners, or the CLI from any CI **[docs-confirmed]** — <https://instabox.sh/docs/ci>.
9. **Agent skills** — the quick start installs InstaBox skills into `~/.claude/skills` and `~/.agents/skills` **[docs-confirmed]** — <https://instabox.sh/docs/start> — "installs the `instabox` CLI and the instabox agent skills (in `~/.claude/skills` and `~/.agents/skills`)".

**Who it is for.** Teams and individuals running agents that need a persistent, general-purpose Linux box with a browser and a desktop — coding agents, browser-automation agents, "computer use" agents — and who are comfortable with a CLI or an API. It is *not* positioned as a web host, a CI-only runner, or a no-code agent product **[inferred]** from the absence of any hosting, dedicated-runner or agent-run product surface in the docs index (<https://instabox.sh/docs>) and the OpenAPI path list (<https://api.instabox.sh/v1/openapi.json>). The strongest evidence for the intended user is the default template's contents (Claude Code, Codex, Docker, Chromium) **[docs-confirmed]** — <https://instabox.sh/docs/limits> — and the one-command onboarding, `npx instabox@latest sh` **[docs-confirmed]** — <https://instabox.sh/docs/start>.

---

## 2. Isolation technology and what it allows

| Claim | Tag | Source + exact quote |
|---|---|---|
| Firecracker microVM, not a container or gVisor | [docs-confirmed] | <https://instabox.sh/docs/limits> — "on Linux 6.18.54 (`uname -r`: `6.18.54-instabox`) in a Firecracker microVM" |
| Own kernel, root access | [docs-confirmed] | <https://instabox.sh/> — "A whole machine, with its own kernel." and "Root Access" |
| Passwordless sudo | [docs-confirmed] | <https://instabox.sh/docs/limits> — "passwordless `sudo` with apt for anything else" |
| systemd present and usable | [docs-confirmed] | <https://instabox.sh/docs/limits> — "Debian 13 (trixie), amd64, with systemd" |
| Docker preinstalled with Compose | [docs-confirmed] | <https://instabox.sh/docs/limits> — "Docker with Compose" (in the `agent-browser` template row) |
| Docker absent on `herdr` and `orca` | [docs-confirmed] | <https://instabox.sh/docs/limits> — "no Docker, uv, Go, Rust or C toolchain" |
| Rebooting from inside works and keeps disks | [docs-confirmed] | <https://instabox.sh/docs/machines> — "A reboot from inside (`sudo reboot`, `systemctl reboot`, `shutdown -r`) reboots the machine: it shows Starting, then Running again on the same disks, with new processes." |
| OS/arch | [docs-confirmed] | <https://instabox.sh/docs/limits> — "Every template but `ci` (Ubuntu 24.04) is Debian 13 (trixie), amd64" |

**What this practically allows** **[inferred]**: anything that needs a real kernel — Docker and Docker Compose, systemd units, `apt`, cgroup and namespace work, a desktop stack (X/Wayland), and nested services like Postgres or a browser. A third-party tester confirms the everyday case: *"Debian 13, systemd, sudo all work"* and they ran *"Network experiments (Tailscale, exit routing)"* on it **[third-party]** — <https://dev.to/samsam4060/instabox-free-cloud-sandboxes-for-ai-agents-honest-notes-after-a-week-of-testing-47ld>. battleships.dev additionally records kernel features (`eBPF`, mounts, `cgroups`) and FUSE mounts as present, but that is a third-party assertion, not a vendor claim **[third-party]** — <https://battleships.dev/data/providers/instabox.md>.

**What is not published or not allowed:**

- **Nested virtualisation** (running KVM/Firecracker inside): **[not-published]**. No docs page mentions it; battleships.dev records `"nested_virt": null` **[third-party]** <https://battleships.dev/data/providers/instabox.md>.
- **Bring-your-own kernel / custom OCI image**: not offered. You choose a template or a snapshot, not an image **[docs-confirmed]** — <https://instabox.sh/docs/limits> ("`instabox templates` … lists the templates you can create from"); battleships records `image_oci: false` **[third-party]**.
- **Root disk control**: the OS disk is the template's and only admins grow it — *"The operating system and the template's software sit on a separate system disk the template sizes; it is not counted in the disk and only admins grow it"* **[docs-confirmed]** — <https://instabox.sh/docs/limits>.
- **CPU oversubscription**: the company says it oversubscribes on purpose, but publishes no ratio — *"When idle machines pause, their CPU and RAM go back to the pool and other people can use them. That keeps utilization on our servers high and lets us safely oversubscribe our hardware."* **[docs-confirmed]** <https://instabox.sh/blog/instabox-pricing>. The overcommit factor is **[not-published]**; do not assume dedicated cores.

---

## 3. Lifecycle: every state, what survives, idle and length limits

### States

The API's state enum is `creating, starting, running, stopping, stopped, suspending, suspended, resuming, deleting, deleted, error` **[docs-confirmed]** <https://api.instabox.sh/v1/openapi.json> — `MachineState`. The dashboard uses human labels for the same states: *"Creating, Starting, Running, Stopping, Stopped, Pausing, Paused, Resuming, Deleting, Failed"* **[docs-confirmed]** — <https://instabox.sh/docs/machines>.

The docs are explicit that "pause" and "suspend" are the same thing: *"The API and CLI say `suspend`, `suspending` and `suspended` for pause, Pausing and Paused, and `error` for Failed."* **[docs-confirmed]** — <https://instabox.sh/docs/concepts>.

### What survives what

| Action | Disk (`/data` + root) | Memory | Running processes | Tag / quote |
|---|---|---|---|---|
| **Create** | fresh from template or snapshot | fresh | fresh | [docs-confirmed] <https://instabox.sh/docs/concepts> "New machines can start from it." |
| **Stop** | kept | lost | lost | [docs-confirmed] <https://instabox.sh/docs/api/lifecycle> "Shuts a running machine down: programs end, files are kept." |
| **Start** (from stopped) | kept | fresh | fresh | [docs-confirmed] <https://instabox.sh/docs/api/lifecycle> "Boots a stopped machine." |
| **Pause** (`suspend`) | kept | **kept** | **kept** | [docs-confirmed] <https://instabox.sh/docs/api/lifecycle> — "Pauses a running machine, keeping its memory and running programs." |
| **Resume** | kept | kept | kept, *or* fresh if restore fails | [docs-confirmed] <https://instabox.sh/docs/machines> "If that is not possible it starts fresh: files are kept, processes are not." |
| **Restart / recover** | kept | lost | lost | [docs-confirmed] <https://instabox.sh/docs/machines> "power-cycles a machine that stopped answering: stop, then start." |
| **Archive** (scheduled) | kept | lost (it is a stop) | lost | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> "the sandbox is stopped then if it is running" |
| **Delete** | gone | gone | gone | [docs-confirmed] <https://instabox.sh/docs/integrate> "deletes the machine and its disks" |

Sources: <https://instabox.sh/docs/concepts>, <https://instabox.sh/docs/api/lifecycle>, <https://instabox.sh/docs/machines>, <https://instabox.sh/docs/integrate>.

### Asymmetries that matter

- **You cannot stop a paused machine.** *"A paused machine cannot be stopped: resume or delete it."* **[docs-confirmed]** — <https://instabox.sh/docs/machines>. Over HTTP this is `409 operation_conflict` **[docs-confirmed]**.
- **`start` on a paused machine means resume**, not a cold boot **[docs-confirmed]** — <https://instabox.sh/docs/api/lifecycle> — "On a paused one it resumes it, or boots fresh if its programs cannot be brought back."
- **Resume is not guaranteed to preserve processes.** The API reports it: `runtime.processesPreserved` is *"False means the paused programs could not be brought back and the sandbox booted fresh (files are kept)"* **[docs-confirmed]** <https://api.instabox.sh/v1/openapi.json>.
- **One operation at a time** per machine; a second change returns `409 operation_conflict` **[docs-confirmed]** — <https://instabox.sh/docs/api>.
- **A shutdown from inside stops the machine**: *"A shutdown from inside (`sudo poweroff`, `halt`, `shutdown -h`) stops it until a start."* **[docs-confirmed]** — <https://instabox.sh/docs/machines>. A machine that *"reboots more than 5 times in 10 minutes is left stopped"* **[docs-confirmed]**, same page.

### Idle auto-stop (they call it auto-pause)

| Claim | Tag | Source + quote |
|---|---|---|
| Default idle pause is 30 minutes | [docs-confirmed] | <https://instabox.sh/docs/concepts> — "A new machine pauses once it has been idle for 30 minutes." |
| Paid plans choose 5–30 min, or off | [docs-confirmed] | <https://instabox.sh/docs/machines> — "On a paid plan (Pro, Team, Enterprise) you choose 5, 10, 15, 20, 25 or 30 minutes … or `0` to turn it off." |
| Free plan is fixed at 30 min | [docs-confirmed] | <https://instabox.sh/docs/limits> — "Free: 30 minutes, fixed. Paid plans: 5 to 30 minutes, or off" |
| Values round up, never silently replaced | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> | `AutoSuspendAfterSeconds` — "a time between the plan's choices … rounded up to the next … A refused create makes no sandbox." |
| What counts as activity | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> | "Real work (exec, files, terminal traffic and preview requests) and task activity leases also prevent idle suspension." |
| A manual pause/stop is never auto-undone | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> | "Manual pause/stop and archive are never automatically undone." |
| Idle-paused machines wake on use | [docs-confirmed] | <https://instabox.sh/docs/concepts> — "Commands, files, SSH and a visit to one of its public port URLs resume it by themselves." |

### Max session length / TTL

This is the least obvious part of the product, and two different limits exist.

| Claim | Tag | Source + quote |
|---|---|---|
| Paid machines have **no lifetime timeout** | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> | "Sandboxes have no lifetime timeout: they pause when idle" |
| **Free machines have a maximum continuous runtime of 480 minutes (8 h)** | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> | `MaxRunMinutes` — "Free machines default to 480 and only an admin session can change them." |
| Paid machines default to unlimited | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> | "Paid machines default to -1 and their users can change this setting." |
| Hitting it triggers a cooldown that blocks wake | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> | "Max-run suspension starts a server-configured cooldown (default 10 minutes), returning 409 machine_cooldown with Retry-After on every wake path." |
| Optional self-destruct and archive timers at create | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> | `deleteAfterSeconds` — "60-86400 … the sandbox is then deleted, whatever its state, so it cannot outlive a client that died"; `archiveSeconds` — "60-86400 … the sandbox is stopped then if it is running" |
| Independent third party observed the same 8-hour cap | [third-party] | <https://dev.to/samsam4060/...-47ld> — "there is a max continuous run of ~8 hours — it is a workbench, not a 24/7 server" |

The 8-hour free-tier cap is **not on any docs page** — it appears only in the OpenAPI schema **[docs-confirmed]** <https://api.instabox.sh/v1/openapi.json> — "Free machines default to 480 and only an admin session can change them." A reader of the pricing page alone would not know it exists **[inferred]** from checking all 26 docs pages and the pricing page for `maxRunMinutes`, which return no mention.

### Published start/resume times

| Claim | Tag | Source + quote |
|---|---|---|
| Resume "usually in about a second" | [docs-confirmed] | <https://instabox.sh/docs/integrate> — "carries on where it left off, usually in about a second" |
| Sub-second boot claim (marketing) | [third-party] | The vendor site itself states no number; the "<1 second" phrasing appears in launch coverage — <https://www.founderland.ai/articles/instabox-launches-cloud-computers-for-ai-agents-in-1-second-mvb8hewn> |
| Fork timing, stated honestly | [docs-confirmed] | <https://instabox.sh/docs/snapshots> — "It is snapshot save plus create, so it takes about as long as those two." |
| Cold-start measurement | [not-published] | No number with a method is published; the only figures are "usually about a second" and marketing "<1 second". |

---

## 4. State tools: snapshots, fork/clone, templates, volumes

### Snapshots — disk only

| Claim | Tag | Source + quote |
|---|---|---|
| Contents: installed software + `/data` | [docs-confirmed] | <https://instabox.sh/docs/snapshots> — "A snapshot holds a machine's installed software and its files under `/data`: home, workspace and saved sign-ins (gh, Claude, Codex, git, SSH)." |
| **No memory, no processes** | [docs-confirmed] | <https://instabox.sh/docs/snapshots> — "It does not hold memory or running processes." |
| Saving may stop the machine first | [docs-confirmed] <https://instabox.sh/docs/snapshots> | "Saving stops a running or paused machine first: processes end, files are kept." |
| Live snapshot possible where the server allows it | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> | "Where the server allows live snapshots, you can also snapshot a running sandbox: the request answers 202 with the snapshot in `status: pending`." |
| Live snapshot is crash-consistent, not clean | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> | "The copy is like the state after a sudden power cut: data that programs had not written to disk yet is not included." |
| System-files-only variant | [docs-confirmed] | <https://instabox.sh/docs/snapshots> — "`--root-only` saves the installed software only: machines from it start with an empty home and workspace" |
| Snapshots are private to you (or your org) | [docs-confirmed] | <https://instabox.sh/docs/snapshots> — "Snapshots are private to you." / [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> "A snapshot belongs to its source sandbox's org: every member of the org uses it." |
| Deleting a machine keeps its snapshots | [docs-confirmed] | <https://instabox.sh/docs/snapshots> — "Deleting a machine keeps its snapshots; deleting a snapshot does not affect machines made from it." |
| Snapshot files readable without booting | [docs-confirmed] | <https://instabox.sh/docs/snapshots> — "`instabox snapshot files dev-base /etc` lists its files without starting a machine." |

**Practical consequence** **[inferred]** from the three rows above (<https://instabox.sh/docs/snapshots> — "It does not hold memory or running processes."): a snapshot captures "what is installed and what is on disk", not "what was running". Any agent session state held in RAM — a REPL, an in-memory browser profile, a half-finished build — is gone.

### Fork / clone — snapshot plus create, not a live fork

| Claim | Tag | Source + quote |
|---|---|---|
| `fork` = save snapshot → create N machines → delete snapshot | [docs-confirmed] | <https://instabox.sh/docs/snapshots> — "`fork` (or `clone`) saves a snapshot of the machine, creates one machine (or `--count`, up to 5 …) from it with the same template and size, waits until they run, then deletes the snapshot" |
| It is not instant | [docs-confirmed] | <https://instabox.sh/docs/snapshots> — "It is snapshot save plus create, so it takes about as long as those two." |
| Source machine is untouched | [docs-confirmed] | <https://instabox.sh/docs/snapshots> — "The source machine is not changed." |
| Marketing contradicts this | [docs-confirmed] | <https://instabox.sh/> — "Fork a machine, mid-run" / "Copy a running machine in seconds." with bullets "Running Processes", "Files", "Disk" |
| No memory fork | [third-party] | <https://battleships.dev/data/providers/instabox.md> — "live fork (no pause)" listed under **No** |

**This is the single biggest marketing-vs-docs gap on the site** **[inferred from the two rows above]**. The homepage says a fork copies "Running Processes" mid-run "in seconds" (<https://instabox.sh/> — "Fork a machine, mid-run" / "Copy a running machine in seconds."); the docs say fork is snapshot-save-plus-create (<https://instabox.sh/docs/snapshots> — "It is snapshot save plus create, so it takes about as long as those two."), and a snapshot explicitly does not hold processes (same page — "It does not hold memory or running processes."). A running machine can be snapshotted live on some servers (<https://api.instabox.sh/v1/openapi.json> — "Where the server allows live snapshots, you can also snapshot a running sandbox"), but the result is crash-consistent disk, still without memory.

### Templates

Six templates, all versioned (`id@version`, e.g. `universal@2026-10-15.4`) **[docs-confirmed]** — <https://instabox.sh/docs/limits>:

| Template | Base | Root disk | Notes |
|---|---|---|---|
| `agent-browser` (default) | Debian 13 | 16 GiB | gh, Node 22, pnpm, Yarn, Bun, uv, Go, Rust, gcc/make, Docker+Compose, **Claude Code, Codex**, desktop (VNC, Xfce, Chromium) |
| `universal` | Debian 13 | 16 GiB | same tools; desktop installs on first use (~30 s) |
| `t3` | Debian 13 | 16 GiB | universal + T3 Code server on port 3774 |
| `herdr` | Debian 13 | 8 GiB | gh, Node, Claude Code, Codex, desktop, herdr; **no Docker/uv/Go/Rust/C toolchain** |
| `orca` | Debian 13 | 8 GiB | gh, Node, Claude Code, Codex, desktop, Orca runtime; **no Docker/uv/Go/Rust/C toolchain** |
| `ci` | Ubuntu 24.04 | 16 GiB | GitHub Actions runner, Docker buildx/Compose, git-lfs, gh, Python 3, Node 22, Rust, gcc/make/cmake; **no desktop or coding agents** |

- Free plan can only create `agent-browser` or `ci` (or from a snapshot) **[docs-confirmed]** — <https://instabox.sh/docs/limits> — "The free plan creates from `agent-browser` or `ci` only."
- Template versions are pinned and immutable; you can name a version at create **[docs-confirmed]** <https://api.instabox.sh/v1/openapi.json> — `templateVersion`.

### Volumes

**There are no volumes.** A machine has exactly one persistent disk, `/data`, sized at create and growable later; there is no way to attach a second disk or share a disk between machines **[docs-confirmed]** — <https://instabox.sh/docs/limits> — "A machine has one disk, `/data` (home is `/data/home`)". battleships agrees: `"volumes": false` **[third-party]** <https://battleships.dev/data/providers/instabox.md>.

---

## 5. Machine sizes, GPU, architecture, regions

### Sizes (vCPU / RAM), by plan

| Plan | Sizes offered | Tag / quote |
|---|---|---|
| Free | **4 vCPU / 8 GiB only** | [docs-confirmed] <https://instabox.sh/docs/limits> — "4 vCPUs and 8 GiB of memory by default, the only size on the free plan" |
| Pro ($20) | 2/4, 4/8 (default), 8/16 | [docs-confirmed] <https://instabox.sh/docs/limits> — "Pro: 2/4, 4/8 or 8/16" |
| Builder ($100) | 2/4 up to 16/32 | [pricing-page] <https://instabox.sh/pricing> — "Up to 16 vCPU / 32 GiB"; [docs-confirmed] <https://instabox.sh/llms.txt> — "Builder 2/4 up to 16/32" |
| Team ($500) | 2/4 up to 32/64 | [docs-confirmed] <https://instabox.sh/docs/limits> — "Team: 2/4 up to 32 vCPUs / 64 GiB" |
| Enterprise | custom CPU/RAM | [pricing-page] <https://instabox.sh/pricing> — "Custom machines CPU and RAM" |

Sizes are fixed **pairs**, not arbitrary combinations: *"name memMiB too when two of them have this many vCPUs. Anything else is refused with `400 spec_not_allowed`"* **[docs-confirmed]** <https://api.instabox.sh/v1/openapi.json>. You cannot ask for 3 vCPU / 12 GiB.

Resizing vCPU/RAM is **stopped-only and applied at next boot**: *"A paid machine moves to another size of its plan while stopped … applied at its next start"* **[docs-confirmed]** — <https://instabox.sh/docs/machines>. There is no live resize of CPU/RAM. Disk *can* grow live (see §10).

### Disk

| Claim | Tag | Source + quote |
|---|---|---|
| One disk, 20 GiB by default, ext4 | [docs-confirmed] | <https://instabox.sh/docs/limits> — "a 20 GiB persistent ext4 disk at `/data` (`/dev/vdb`; home is `/data/home`)" |
| Root disk is template-sized, not counted | [docs-confirmed] <https://instabox.sh/docs/limits> | "The operating system and the template's software sit on a separate system disk the template sizes; it is not counted in the disk" |
| Disk cannot be chosen at create | [docs-confirmed] <https://instabox.sh/docs/limits> | "at create, leave `persistentDiskGiB` out … any other disk size is `400 spec_not_allowed`" |
| Grows live; shrinks only stopped | [docs-confirmed] <https://instabox.sh/docs/limits> | "**Grow** a running machine and it grows right away, no restart, processes keep running" / "**Shrink** only a stopped machine" |
| Max disk by plan | [docs-confirmed] <https://instabox.sh/docs/limits> | "at most 200 GiB on Pro, 500 on Builder, 1024 GiB on Team and Enterprise" |
| Free disk fixed | [docs-confirmed] <https://instabox.sh/docs/limits> | "a free machine's disk is fixed (`400 spec_not_allowed`, running or stopped)" |

### GPU, architecture, regions

| Question | Answer | Tag / source |
|---|---|---|
| GPU | **None offered.** No GPU anywhere in docs, pricing, or OpenAPI (zero occurrences of "gpu" in the 286 KB spec). battleships: `"gpu": false` | [not-published] / [third-party] <https://battleships.dev/data/providers/instabox.md> |
| CPU arch | **x86_64 (amd64) only** | [docs-confirmed] <https://instabox.sh/docs/limits> — "amd64"; [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> — template field `"arch": "x86_64"` |
| ARM | Not offered | [inferred] from x86_64-only templates |
| Regions | **Not published.** No region selector in the API or docs. Terms say US only. Third party observed a US AWS address | [not-published] / [docs-confirmed] <https://instabox.sh/terms> — "stored and processed in the United States" / [third-party] <https://dev.to/samsam4060/instabox-free-cloud-sandboxes-for-ai-agents-honest-notes-after-a-week-of-testing-47ld> — "a US AWS address"; <https://dealroom.co/news/158042-insforge-raises-8m-seed-to-build-cloud-infrastructure-for-ai-agents/> — "has not disclosed … regional availability beyond US East" |
| Multi-region / region choice | Not offered as a user-facing setting | [not-published] |
| Windows / macOS guests | Not offered | [inferred] all templates are Linux |

---

## 6. Networking

### Inbound

| Capability | Status | Tag / quote |
|---|---|---|
| HTTPS URL per port | Yes | [docs-confirmed] <https://instabox.sh/docs/ports> — "Give a web server in a machine an HTTPS URL." URL shape `https://<port>-<machine id without m_>.<domain>/` |
| Auth on those URLs | **None** | [docs-confirmed] <https://instabox.sh/docs/ports> — "It is not a secret: once published, anyone can reach the whole service until you unpublish it." |
| Port count | 16 per machine | [docs-confirmed] <https://instabox.sh/docs/ports> — "Up to 16 public ports per machine." |
| Port range | 1024–65535; 5901 and 6768 reserved | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> — "Desktop port 5901 and Orca port 6768 … are reserved." (`minimum: 1024`) |
| Custom domains | **Not published.** No CNAME/domain feature in docs or API | [not-published] |
| Raw TCP inbound | **No.** Inbound is HTTPS via the gateway, or SSH/mosh | [third-party] <https://dev.to/samsam4060/instabox-free-cloud-sandboxes-for-ai-agents-honest-notes-after-a-week-of-testing-47ld> — "No public inbound IPv4 of your own; inbound is only via their HTTPS gateway links or SSH gateway." [docs-confirmed] <https://instabox.sh/docs/ports> — "Give a web server in a machine an HTTPS URL." |
| SSH | Yes, via a gateway with short-lived certificates or tokens | [docs-confirmed] <https://instabox.sh/docs/ssh> — "The instabox gateway terminates SSH: `ssh -p <port> <machine-id>@<host>`, with a short-lived user certificate" |
| mosh | Yes, relayed through the same gateway | [docs-confirmed] <https://instabox.sh/docs/ssh> — "It relays mosh's UDP too, so only the gateway has to be reachable." |
| Local port-forward (private) | Yes, `-L` only | [docs-confirmed] <https://instabox.sh/docs/ssh> — "It is `ssh -N -L` with the instabox certificate … only you can use it" |
| Remote forwarding (`-R`), agent forwarding, X11 | **No** | [docs-confirmed] <https://instabox.sh/docs/ssh> — "Not supported: agent forwarding, X11, remote forwarding." |
| Preview URL wakes an idle-paused machine | Yes | [docs-confirmed] <https://instabox.sh/docs/ports> — "A visit wakes a machine that paused itself for being idle (the 30-minute idle pause): the request waits for it to resume" |
| …but the OpenAPI says the opposite | Contradiction | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> — "Preview links remain offline until resumed." See §14 |

### Outbound

| Capability | Status | Tag / quote |
|---|---|---|
| Open internet by default | Yes, in practice | [inferred] No allowlist or egress firewall is documented for normal traffic; [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> `SecretHosts` — "This scopes credential use, not all sandbox network access." |
| Egress allowlists | **Not published** as a feature. The only host scoping is per-Secret | [not-published]; [docs-confirmed] <https://instabox.sh/docs/secrets> — a Secret's `hosts` "scopes credential use, not all sandbox network access" (<https://api.instabox.sh/v1/openapi.json>) |
| Static / dedicated egress IP | **No.** Shared NAT, per a third party | [third-party] <https://dev.to/samsam4060/instabox-free-cloud-sandboxes-for-ai-agents-honest-notes-after-a-week-of-testing-47ld> — "All machines share one NAT egress IP (a US AWS address, clean reputation but clearly a datacenter IP)." |
| Ingress billing | Free | [pricing-page] <https://instabox.sh/pricing> — "Ingress is always free." |
| Egress billing | Metered per GiB | [pricing-page] <https://instabox.sh/pricing> — "Egress" … "$0.02000" / GiB |
| Abuse filtering | Exists, undocumented in detail | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> suspend reason enum includes `abuse_pool` — "paused because the sandbox tried to reach a blocked address, such as a crypto-mining pool" |

### Secret / credential injection

Two independent stores, with very different semantics.

**Org Secrets (current, recommended)** **[docs-confirmed]** — <https://instabox.sh/docs/secrets>:

- Two delivery modes: `proxy` and `env`.
  - `proxy`: *"`NAME=ibsec_...`, a sandbox-specific placeholder"*; the real value appears *"Only in HTTPS request headers (port 443) to the Secret's `hosts`, where the outbound proxy swaps it in. Never in the sandbox, URLs or request bodies."*
  - `env`: *"`NAME=<real value>`"*; *"Inside the sandbox: any process there can read and copy it. No host restriction applies."*
- Host scoping: up to 32 exact hostnames or `*`; *"Partial wildcards such as `*.example.com` are not supported."*
- Hard limits: *"Version one supports HTTPS on port 443; URL parameters and request bodies are not substituted."* WebSocket upgrades unsupported; intercepted connections to private addresses are closed.
- Blast radius with `*`: *"any process in an enrolled sandbox can send the Secret to any public HTTPS destination, including a host it controls."*
- Login shells only: values land in `/run/instabox/secrets/env` and load via `/etc/profile.d/zz-instabox-secrets.sh`, so *"Processes that skip the profile (systemd units, cron, `bash -c` without `-l`) do not"* get them.
- Rotation keeps the placeholder: *"Rotating an existing value keeps its placeholder, so applications need no restart."*

**Vault (legacy, per-user)** — *"The per-user Vault continues to support environment variables, home files and metadata selectors alongside Org Secrets. Upgrading does not migrate items or enroll existing sandboxes in Secrets."* **[docs-confirmed]** — <https://instabox.sh/docs/machines>.

**Consequence for the explainer** **[inferred]** from the two delivery modes above: "secret injection" here most often means *the credential is never in the box*, only a placeholder that a proxy swaps into an HTTPS header. That is a materially stronger guarantee than pasting an API key into an env var, and a materially weaker one than a per-request secret broker (no body/URL substitution, no non-HTTPS, no WebSockets).

---

## 7. Interfaces

| Interface | Status | Tag / quote |
|---|---|---|
| REST API | Yes, `/v1`, JSON, OpenAPI 3.1 | [docs-confirmed] <https://instabox.sh/docs/api> — "The full machine-readable description … is at https://api.instabox.sh/v1/openapi.json" |
| TypeScript SDK | Yes, `@insforge/instabox-sdk` v0.5.0 | [docs-confirmed] <https://instabox.sh/docs/sdk> — "Version 0.5.0 of `@insforge/instabox-sdk`." |
| Python SDK | **Mentioned once, no docs, no package name** | [docs-confirmed] <https://instabox.sh/docs/limits> — "the Python SDK's `persistent_disk_gib`" |
| Go SDK | No public SDK; OpenAPI only | [inferred] |
| CLI | Yes, `instabox` (`npx instabox@latest`, `curl … install.sh`) | [docs-confirmed] <https://instabox.sh/docs/cli> — "Every command. Add --help to any of them for the details." |
| MCP server (for the InstaBox API) | **Not published.** No MCP docs page; docs index has none | [not-published] |
| MCP inside the machine (computer use) | Yes — a computer-use MCP drives the desktop | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> `Desktop.actions` — "The computer-use MCP's last tool calls"; [docs-confirmed] <https://instabox.sh/docs/desktop> — "driven by the computer-use MCP" |
| Agent skills | Yes — installed into Claude Code / agents skill dirs | [docs-confirmed] <https://instabox.sh/docs/start> — "installs the `instabox` CLI and the instabox agent skills (in `~/.claude/skills` and `~/.agents/skills`)" |
| SSH | Yes, certificates or `ibssh_…` tokens | [docs-confirmed] <https://instabox.sh/docs/ssh> — "`instabox ssh dev` # certificate, known_hosts and ssh in one step"; "Create token gives one `ssh ibssh_…@<host>` line" |
| mosh | Yes | [docs-confirmed] <https://instabox.sh/docs/cli> — "`instabox mosh dev`" |
| Web terminal | Yes, WebSocket PTY, persistent session | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> `/v1/machines/{id}/terminal` — "carrying a PTY (xterm-256color) of a login shell" |
| Desktop / VNC | Yes, Xfce + Chromium, VNC over WebSocket, shareable link | [docs-confirmed] <https://instabox.sh/docs/desktop> — "Machines from the `agent-browser` template (shown as **standard**) have a Linux desktop with a browser." |
| Browser automation | Yes — Chromium in the box; drive it by desktop coordinates or by installing Playwright yourself | [docs-confirmed] <https://instabox.sh/docs/desktop> — "a real Linux desktop with a browser"; [inferred] for Playwright |
| Webhooks | Yes, Standard Webhooks signatures | [docs-confirmed] <https://instabox.sh/docs/webhooks> — "Requests follow Standard Webhooks, so its libraries verify them." |
| GitHub Actions runner | Yes, `runs-on: instabox-medium` (early access) | [docs-confirmed] <https://instabox.sh/docs/ci> — "**Early access:** `runs-on: instabox-medium` is open to a few accounts for now" |
| Dashboard | Yes | [docs-confirmed] <https://instabox.sh/docs/start> — "In the dashboard, **Create machine** on the **Machines** page does what `instabox create` does." (the other pages are named in §15) |

Limits worth knowing: **8 open terminals or VNC sessions per user**, **32 concurrent exec/file/desktop/port-forward calls per user**, **20 active API keys**, **32 labels per machine** **[docs-confirmed]** — <https://instabox.sh/docs/limits>.

---

## 8. Agent features

| Feature | Status | Tag / quote |
|---|---|---|
| Preinstalled coding agents | **Claude Code and Codex** in `agent-browser`, `universal`, `t3`, `herdr`, `orca`; **not** in `ci` | [docs-confirmed] <https://instabox.sh/docs/limits> — "Claude Code, Codex" / "no desktop or coding agents" |
| Agent sign-ins persist | Yes, because home is `/data/home` | [docs-confirmed] <https://instabox.sh/docs/snapshots> — "saved sign-ins (gh, Claude, Codex, git, SSH)" |
| Agent-run API ("run agent X with prompt Y") | **No.** No hosted agent-run endpoint | [not-published]; [inferred] from the full OpenAPI surface (machines, exec, desktop, snapshots only) |
| What you get instead | `exec` (10-min cap), background jobs, desktop computer-use API, SSH | [docs-confirmed] <https://instabox.sh/docs/limits> — "32 requests at once across your sandboxes" … "10 minutes per command" |
| One-shot job helper | `instabox run` — create, run, delete | [docs-confirmed] <https://instabox.sh/docs/keys-sdk> — "`instabox run -- uname -a` # one-shot: create, run, delete" |
| Agent-aware idle detection | Yes, on templates with the `activity` capability | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> — "`activity`: it ships activity probes for its agents, so pausing when idle … sees them working" |
| Activity leases | Yes — an agent can hold the machine awake | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> — "task activity leases also prevent idle suspension" |
| AI credential handling | Org Secrets (proxy/env) and Vault; **no model-key marketplace or AI gateway** | [docs-confirmed] <https://instabox.sh/docs/secrets> |
| Human takeover of an agent's desktop | Yes, with control returning to the agent | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> — "`takeover` gives the caller control of the desktop … refuses input tools until `handback` returns it to the agent" |
| Agent-visible docs | `llms.txt` / `llms-full.txt`, `.md` on every page | [docs-confirmed] <https://instabox.sh/docs> — "Add `.md` to any page URL for its Markdown." |

Note the important negative **[inferred]**: InstaBox gives you the *computer* for an agent, not an agent service. There is no prompt-in, result-out API — the OpenAPI path list is machines, exec, files, snapshots, ports, desktop, secrets, webhooks, orgs, keys and usage, with no agent or prompt endpoint (<https://api.instabox.sh/v1/openapi.json>). Your code (or Claude Code/Codex running inside the box) is the agent.

---

## 9. Accounts, orgs, keys, limits, compliance

| Topic | Status | Tag / quote |
|---|---|---|
| Orgs / workspaces | Yes; every user gets a personal org; workspaces with members, invites, roles | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> — "`GET /v1/orgs` … you must be a member"; `role` on `Org` |
| Members per plan | Personal org: 1; plan member caps exist | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> `maxMembers` — "Members the org may have … 0: no limit (a personal org: 1)" |
| Seats / per-user pricing | **Not published.** No per-seat line item anywhere | [not-published] |
| API key scopes | `machines:read/write/delete`, `images:read/write/delete` (snapshots keep the old `images:*` names), legacy `machines:ssh`, `machines:exec` | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> — "A key carries scopes: read, write and delete for each resource."; the six names and their routes are listed at <https://instabox.sh/docs/keys-sdk> |
| Scope semantics | Write/delete include read | [docs-confirmed] <https://instabox.sh/docs/keys-sdk> — "Write and delete include read." |
| Workspace admin keys | `workspace:admin` scope, session-only creation | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> — "Without `scopes`, a workspace key carries the `workspace:admin` scope" |
| Keys can create keys? | No | [docs-confirmed] <https://instabox.sh/docs/keys-sdk> — "Keys cannot create keys." |
| Key expiry | 1–365 days or never; 20 active per org | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> — "A key expires after `expiresInDays` (1-365) or, without it, never" |
| Spend limits | Yes — monthly overage cap | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> — "`spendCapUSD` caps this month's usage beyond the org's allowance: once reached, the org's sandboxes are stopped (`trigger: spend_cap`) and cannot run until next month" |
| Usage / overage alerts | Yes, email to owners/admins | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> — `overageAlert`: "Whether a paid org's owner and admins are emailed once a month when usage goes beyond what the month includes"; `usageAlertPercent`: "the usage alert's share of what the month includes" |
| Audit logs | **Enterprise plan only** as a customer feature; an internal audit log exists and records events | [pricing-page] <https://instabox.sh/pricing> — "Audit logs" under Enterprise; [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> — "Writes `org.spend_cap` to the audit log." |
| SSO / SAML / SCIM | **Enterprise only** | [pricing-page] <https://instabox.sh/pricing> — "SSO / SAML and SCIM" under Enterprise |
| Data residency | **United States** | [docs-confirmed] <https://instabox.sh/terms> — "Sandboxes, their disks and Snapshots, Secrets, and the metadata about Customer's account, workspaces, and resources are stored and processed in the United States." |
| Compliance certifications | Not stated on the site; a Trust Center is linked | [docs-confirmed] <https://instabox.sh/terms> — "available through the InsForge Trust Center" (<https://app.vanta.com/insforge.dev/trust/9dxtxcntvvv5ow2tx7e4dm>) |
| SLA | 99.9% on Enterprise only | [pricing-page] <https://instabox.sh/pricing> — "99.9% SLA" under Enterprise |
| HIPAA | BAA on Enterprise only | [pricing-page] <https://instabox.sh/pricing> — "HIPAA BAA" |
| BYOC / dedicated pool | Enterprise only | [pricing-page] <https://instabox.sh/pricing> — "Dedicated pool or BYOC" |
| Invite gate | Code exists; whether it is switched on is unknown | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> — "With the server's invite gate on … every other route answers `403 invite_required`"; [third-party] <https://dev.to/samsam4060/instabox-free-cloud-sandboxes-for-ai-agents-honest-notes-after-a-week-of-testing-47ld> — "It is currently an invite-based beta." |

---

## 10. Pricing, exactly

### Plans (subscriptions)

| Plan | Price | What the fee includes | Tag |
|---|---|---|---|
| Free | **$0** | 1 machine (4 vCPU / 8 GiB, 20 GiB disk), 5 snapshots, 100 GiB egress/month; never billed | [pricing-page] <https://instabox.sh/pricing> — "1 machine, 4 vCPU / 8 GiB"; "5 snapshots"; "100 GiB egress / month" |
| Pro | **$20/month** | "$20 / month free credits", max 100 concurrent machines, up to 8 vCPU / 16 GiB, 20 GiB disk up to 200 GiB, unlimited snapshots, 1 TiB egress/month, email support | [pricing-page] <https://instabox.sh/pricing> — "Max 100 concurrent machines"; "Up to 8 vCPU / 16 GiB"; "1 TiB egress / month" |
| Builder | **$100/month** | "$100 / month free credits", max 200 concurrent, up to 16 vCPU / 32 GiB, disk up to 500 GiB, 5 TiB egress, email support | [pricing-page] <https://instabox.sh/pricing> — "Max 200 concurrent machines"; "Up to 16 vCPU / 32 GiB"; "5 TiB egress / month" |
| Team | **$500/month** | "$500 / month free credits", 500 concurrent, unlimited machines, custom CPU/RAM, disk up to 1 TiB, 50 TiB egress, priority support & SLAs | [pricing-page] <https://instabox.sh/pricing> — "500 concurrent machines"; "Unlimited machines"; "50 TiB egress / month" |
| Enterprise | **Custom** | 99.9% SLA, SSO/SAML+SCIM, audit logs, dedicated pool or BYOC, HIPAA BAA, dedicated support | [pricing-page] <https://instabox.sh/pricing> — "99.9% SLA"; "SSO / SAML and SCIM"; "Dedicated pool or BYOC" |

Machine-count nuance: the pricing page gives a *concurrent* number for Pro/Builder, while the docs give both totals and running counts — Pro is **500 machines total, 100 running**; Builder **1,000 total, 200 running**; Team **unlimited, 500 running** **[docs-confirmed]** — <https://instabox.sh/llms.txt>.

### The billing meter

| Resource | Per hour | Per second (page toggle) | Tag |
|---|---|---|---|
| vCPU | **$0.00400** / vCPU / hour | **$0.000001111** / vCPU / sec | [pricing-page] <https://instabox.sh/pricing> |
| Memory | **$0.00225** / GiB / hour | **$0.000000625** / GiB / sec | [pricing-page] <https://instabox.sh/pricing> |
| Storage | **$0.00011** / GiB / hour | **$0.000000031** / GiB / sec | [pricing-page] <https://instabox.sh/pricing> |
| Egress | **$0.02000** / GiB | $0.02000 / GiB (no time base) | [pricing-page] <https://instabox.sh/pricing> |

How the meter works, in plain words:

- **Runtime is per second, and only while running.** *"Runtime is metered by the second, only while a machine is running."* **[pricing-page]** <https://instabox.sh/docs/pricing>. There is no published minimum charge, no per-start fee, and no rounding increment for runtime **[not-published]** for a minimum; per-second is stated.
- **You pay for the size you asked for, not the usage you generated.** *"While a machine is running, you pay for the vCPUs and memory you gave it."* **[pricing-page]** <https://instabox.sh/pricing>. An idle-but-running 8 vCPU box costs the same as a busy one.
- **Paused or stopped: runtime stops, storage continues.** *"Pause it, and you just pay for storage."* **[pricing-page]** <https://instabox.sh/pricing>. Memory is not billed while paused, and — importantly — paused memory does not even count as stored data: *"Paused sandboxes' saved memory does not count."* **[docs-confirmed]** <https://api.instabox.sh/v1/openapi.json> `storedBytes`.
- **Storage is GiB-hours on everything you keep**: the machine's `/data`, anything written to the root disk, and snapshots. *"`storedBytes` … What they take up once compressed, with shared data counted once and the templates' own content … not counted"* **[docs-confirmed]** <https://api.instabox.sh/v1/openapi.json>. Measurement cadence is *"measured about hourly"* **[docs-confirmed]** <https://instabox.sh/docs/api/account>, so sub-hour changes are effectively sampled hourly **[inferred]**.
- **Egress is per GiB, with a monthly allowance per plan**; ingress free **[pricing-page]** <https://instabox.sh/pricing>.
- **Credits = included usage equal to the fee, not a prepaid wallet.** *"Usage comes out of your included credits first, then you pay as you go. Credits reset every month."* **[pricing-page]** <https://instabox.sh/pricing>. There is no top-up wallet published; `OrgBilling.funding` is either `stripe` or `credits` (server-renewed) **[docs-confirmed]** <https://api.instabox.sh/v1/openapi.json>. For the free tier, `monthlyCreditUSD` is *"Always 0 (kept for older clients); the free sandbox has hours, not a credit."* **[docs-confirmed]** <https://api.instabox.sh/v1/openapi.json> — the free allowance is expressed in *hours* (`freeSandboxHours`), and the cap is *"0: no cap"* i.e. server-set and **not published**.
- **Overage can be charged mid-month**: *"Usage beyond what the month includes is charged to the card each time what is not charged yet reaches this [threshold]"* **[docs-confirmed]** <https://api.instabox.sh/v1/openapi.json> `thresholdBillingUSD`. The threshold value is **[not-published]**.
- **Spend cap** can stop everything: `spendCapUSD` 0 means *"nothing beyond the allowance"*, and at the cap sandboxes are stopped until next month **[docs-confirmed]** <https://api.instabox.sh/v1/openapi.json>.
- **No charge for**: public ports, snapshots as a line item (they are storage), SSH, desktop, API calls, machines while deleted **[inferred]** from the absence of any such line item on the pricing page.

### Free tier caveats

- 1 machine **in any state** — paused and stopped ones count **[docs-confirmed]** <https://instabox.sh/docs/limits>.
- 5 snapshots, 200 GB stored data cap **[docs-confirmed]** <https://instabox.sh/docs/limits>.
- Idle pause fixed at 30 minutes, cannot be changed **[docs-confirmed]** <https://instabox.sh/docs/limits>.
- **8-hour maximum continuous run** (OpenAPI only) **[docs-confirmed]** <https://api.instabox.sh/v1/openapi.json>.
- **A card may be required even on free.** `Org.cardMissingAt`: *"On the free tier its sandboxes then answer `402 payment_method_required` and running ones are paused"* **[docs-confirmed]** <https://api.instabox.sh/v1/openapi.json>. Whether a brand-new free account starts in that state is **[not-published]** — see §14.
- Pre-Oct-20 accounts keep 5 free machines until Dec 1 **[docs-confirmed]** <https://instabox.sh/changelog> — *"Accounts activated before October 20 keep five free machines until December 1."*

---

## 11. Worked cost examples

All arithmetic uses only the published unit prices above. Storage is computed separately from runtime because the pricing page's own calculator omits it (see §14). Egress is excluded and assumed within the plan allowance.

Rates **[pricing-page]** <https://instabox.sh/pricing> — vCPU "$0.00400" / vCPU / hour, memory "$0.00225" / GiB / hour, storage "$0.00011" / GiB / hour, egress "$0.02000" / GiB.

### (A) 1,000 agent tasks a month, 10 minutes each, 2 vCPU / 4 GiB, deleted after each

This size (2/4) exists on Pro, Builder and Team — **not on Free**, which is 4/8 only **[docs-confirmed]** <https://instabox.sh/docs/limits> — "4 vCPUs and 8 GiB of memory by default, the only size on the free plan"; "Pro: 2/4, 4/8 or 8/16".

```
Running hours   = 1,000 × 10 min ÷ 60        = 166.667 h
vCPU            = 2 × $0.004 × 166.667       = $1.33
Memory          = 4 × $0.00225 × 166.667     = $1.50
Storage (20 GiB)= 20 × $0.00011 × 166.667    = $0.37   (only while each disk exists)
                                          -------------
Usage subtotal                                = $3.20
```

- **On Pro ($20/month):** usage of ~$3.20 is absorbed by the $20 monthly credit, so the bill is **$20.00/month**. No overage.
- **If you deleted instantly and storage rounded to nothing**, the runtime alone is **$2.83/month** — still inside the credit.
- **On Free ($0):** the size does not exist; the nearest is 4/8, which would be `4 × $0.004 × 166.667 = $2.67` + `8 × $0.00225 × 166.667 = $3.00` = **$5.67** of usage — but the plan is *"never billed"* **[docs-confirmed]** <https://api.instabox.sh/v1/openapi.json> `Machine.free` — so **$0**, subject to 1 machine total, 5 snapshots, and the per-minute machine-start limit (`startsPerMinute`, value **[not-published]**). 1,000 tasks means 1,000 machine starts; if starts are rate-limited per minute this workload needs pacing **[inferred]**.

### (B) One always-on dev box, 4 vCPU / 8 GiB / 50 GiB, 730 h/month

50 GiB is within Pro's 200 GiB ceiling; 4/8 is available on every paid plan and is the Free size **[docs-confirmed]** <https://instabox.sh/docs/limits> — "at most 200 GiB on Pro"; "Pro: 2/4, 4/8 or 8/16".

```
vCPU            = 4 × $0.004  × 730 h        = $11.68
Memory          = 8 × $0.00225 × 730 h       = $13.14
Storage (50 GiB)= 50 × $0.00011 × 730 h      = $ 4.02
                                          -------------
Usage total                                   = $28.84
```

- **On Pro:** $20 fee + ($28.84 − $20 credit) = **$28.84/month**.
- Cross-check against the vendor's own calculator: 4 vCPU / 8 GiB / 1 machine / 730 h shows **"$24.82"** **[pricing-page]** <https://instabox.sh/pricing>, which is exactly `$11.68 + $13.14` — i.e. the calculator leaves out the 50 GiB of storage. Add $4.02 and you get $28.84. The calculator agrees with my arithmetic and disagrees with a "total cost" reading of its own label.
- "Always-on" requires turning idle auto-pause off, which Pro allows **[docs-confirmed]** — <https://instabox.sh/docs/machines>.
- Egress beyond 1 TiB is $0.02/GiB extra.

### (C) One persistent box, 2 vCPU / 4 GiB / 20 GiB, 3 h/day for 30 days, stopped otherwise

```
Running hours   = 3 × 30                     = 90 h
vCPU            = 2 × $0.004  × 90 h         = $0.72
Memory          = 4 × $0.00225 × 90 h        = $0.81
Storage (20 GiB)= 20 × $0.00011 × 730 h      = $1.61   (disk persists all month)
                                          -------------
Usage total                                   = $3.14
```

- **On Pro:** absorbed by the $20 credit → **$20.00/month**.
- **On Free:** 2/4 is not offered. Nearest is 4/8: `4 × $0.004 × 90 = $1.44` + `8 × $0.00225 × 90 = $1.62` + `$1.61` storage = **$4.67** of usage, billed at **$0**.
- Note what actually happens on Free with "stopped otherwise": the machine will not stay stopped — it *pauses* after 30 idle minutes **[docs-confirmed]** <https://instabox.sh/docs/machines>, which is the behaviour you want (memory not billed, storage only), but it stays as your one allowed machine and it resumes on any visit to a public port URL.

**What is missing from all three:** egress overage, the $20/$100/$500 subscription itself (folded in above), any per-start fee (none published), and taxes. All are **[not-published]** or **[inferred]** as noted.

---

## 12. Same word, different meaning

| Word | What it means at InstaBox | What people often assume | Practical consequence | Evidence |
|---|---|---|---|---|
| **Snapshot** | Disk only: template software + `/data` (home included). No memory, no processes. | A full machine save, including what was running | A restored box has your files and installs, not your session. Live snapshots are crash-consistent | [docs-confirmed] <https://instabox.sh/docs/snapshots> — "It does not hold memory or running processes." |
| **Pause / suspend** | Memory **and** running processes kept; billed for storage only; resumes in ~1 s | "Stopped but still listed" | You can pause a long agent run and come back to the same process tree — this is the product's best trick | [docs-confirmed] <https://instabox.sh/docs/api/lifecycle> — "Pauses a running machine, keeping its memory and running programs." |
| **Stop** | Power off. Files kept, processes and memory gone. Cannot stop a paused machine | Same as pause | Stop is a hard reset; you lose the session. Use pause to preserve work-in-progress | [docs-confirmed] <https://instabox.sh/docs/machines> — "A paused machine cannot be stopped: resume or delete it." |
| **Fork / clone** | Snapshot save → create N machines → delete snapshot. Source unchanged. Takes as long as both steps | An instant copy-on-write clone of a live machine | Homepage says "in seconds … Running Processes"; docs say otherwise. Budget for a save+create | [docs-confirmed] <https://instabox.sh/docs/snapshots> — "It is snapshot save plus create, so it takes about as long as those two." |
| **Persistent** | One disk, `/data` (20 GiB default, home = `/data/home`), kept across stop/pause/start. Root disk is template-owned | A separate attachable volume, or the whole filesystem being yours | No volumes, no second disk, no shared disk. Anything outside `/data` may be reset by a new template version | [docs-confirmed] <https://instabox.sh/docs/limits> — "A machine has one disk, `/data`" |
| **Machine / sandbox / box** | The same VM | Different products | API paths and scopes say `machine`; marketing says `sandbox`; Terms say "also called a machine or a box" | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> "Paths, fields and scopes call a sandbox a machine" |
| **Template** | A versioned OS image with preinstalled software (`agent-browser@2026-10-13.10`) | A container image you can bring | You cannot bring your own OCI image; you pick a template or a snapshot | [docs-confirmed] <https://instabox.sh/docs/limits> — "`instabox templates` … lists the templates you can create from."; [third-party] <https://battleships.dev/data/providers/instabox.md> — `"image_oci": false` |
| **Archive** | A *scheduled stop* (`archiveAt`), not a separate cold-storage tier | An archived state with cheaper storage | After `archiveAt` passes, the machine is simply stopped; files kept; resume doesn't clear the deadline | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> "the sandbox is stopped then if it is running" |
| **Resume** | On a stopped machine, this is a cold start | Only valid for paused machines | `start` and `resume` overlap; `start` on a paused machine resumes it | [docs-confirmed] <https://instabox.sh/docs/api/lifecycle> — "On a paused one it resumes it, or boots fresh" |
| **Credits** | Included usage equal to the monthly fee, reset monthly | Prepaid wallet you top up | You cannot bank credits; unused credit expires at month end | [pricing-page] <https://instabox.sh/pricing> — "Credits reset every month." |
| **Free plan** | $0, 1 machine, 8 h max continuous run, 30-min idle pause, server-capped hours | "Free tier like a small VPS" | Not a 24/7 host. A free machine cannot run longer than 8 h without a pause | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> "Free machines default to 480" |
| **Public port** | An unauthenticated HTTPS URL to one port | A URL you can put auth in front of at the edge | Anyone with the URL reaches the service; there is no built-in auth or custom domain | [docs-confirmed] <https://instabox.sh/docs/ports> — "It is not a secret: once published, anyone can reach the whole service" |
| **Secret** | By default a **placeholder** swapped into HTTPS headers by a proxy | An env var with the real key | Works only for HTTPS on 443, headers only, no WebSockets; `env` mode is opt-in and exposes the value | [docs-confirmed] <https://instabox.sh/docs/secrets> — "Version one supports HTTPS on port 443; URL parameters and request bodies are not substituted." |
| **Exec** | One command, ≤10 minutes, output capped at 1 MiB per stream | A shell session | Long jobs need `--background`, tmux, or SSH | [docs-confirmed] <https://instabox.sh/docs/limits> — "10 minutes per command" |
| **Restart** | Stop then start (power cycle); disks kept | A reboot that preserves the session | Processes and memory are lost | [docs-confirmed] <https://instabox.sh/docs/machines> — "stop, then start. The root disk and `/data` are kept; processes and memory are not." |

---

## 13. Glossary candidates

Concepts a newcomer needs before this provider's docs make sense. Each definition below restates a term as the cited section defines it; the definitional sources are <https://instabox.sh/docs/concepts> ("The few words the dashboard, the CLI and the API use"), <https://instabox.sh/docs/machines>, <https://instabox.sh/docs/snapshots>, <https://instabox.sh/docs/secrets>, <https://instabox.sh/docs/desktop> and <https://api.instabox.sh/v1/openapi.json>.

1. **MicroVM / Firecracker** — a lightweight virtual machine with its own kernel, booting in ~1 s. Stronger isolation than a container, cheaper than a full VM.
2. **Sandbox / machine / box** — here, one Linux VM. The API calls it a machine.
3. **Template** — a versioned starting image with software preinstalled. Not a container image.
4. **Snapshot** — a saved copy of disks (not memory).
5. **Fork** — snapshot + create, in this product's vocabulary.
6. **Pause / suspend vs stop** — memory-kept vs powered-off.
7. **Resume vs start** — overlapping operations; `start` on a paused box resumes it.
8. **Operation** — the async job object every lifecycle change returns (`queued → running → succeeded/failed`).
9. **Idempotency key** — a header that makes a retried create/delete safe.
10. **Idle auto-pause** — the timer that pauses an unused machine (30 min default).
11. **`maxRunMinutes`** — a *separate* continuous-runtime cap (8 h on Free, unlimited on paid).
12. **`archiveAt` / `deleteAt`** — optional self-stop and self-destruct deadlines set at create.
13. **Public port / preview URL** — an unauthenticated HTTPS door into one port.
14. **SSH certificate vs SSH token** — short-lived key-based cert vs a paste-anywhere `ibssh_…` login string.
15. **mosh** — a roaming-friendly shell protocol relayed by the same gateway.
16. **VNC / desktop / computer use** — a real Xfce desktop, viewable, drivable by coordinates, and shareable by link.
17. **Computer-use MCP** — an MCP server inside the box that turns "click at 640,400" into tool calls; a human takeover pauses it.
18. **Org / workspace** — the billing and sharing boundary; keys and secrets belong to one org.
19. **Scope** — a permission string on an API key (`machines:write`, `images:read`).
20. **Org Secret (proxy vs env)** — placeholder-swapped-by-proxy vs real value in the environment.
21. **Vault** — the older, per-user secret store; not migrated into Secrets.
22. **Egress / ingress** — outbound vs inbound traffic; ingress free, egress metered.
23. **vCPU-hour / GiB-hour** — the billing units; cost = size × time, not usage.
24. **Stored data (`storedBytes`)** — compressed bytes of disks and snapshots; excludes paused memory.
25. **Spend cap** — a hard monthly ceiling that stops machines when hit.
26. **Root disk vs `/data`** — template-owned OS disk vs your one persistent disk.

---

## 14. Gaps, gotchas, contradictions

### Not published (do not guess)

- **Regions / region choice** — no selector, no list. Only "United States" in the Terms.
- **GPU** — none offered, none mentioned.
- **ARM** — x86_64 only.
- **Custom domains on public ports** — no feature, no docs.
- **Static or dedicated egress IP** — none; third party says shared NAT.
- **Inbound raw TCP** — none beyond HTTPS gateway and SSH/mosh.
- **Auth on preview URLs** — none by design.
- **Free tier monthly hour cap** (`freeSandboxHours`) — schema says "when the server caps it", value not shown.
- **Minimum billing increment / minimum charge** — runtime is per-second; no minimum stated.
- **Overage charge threshold** (`thresholdBillingUSD`) — field exists, value not published.
- **`startsPerMinute`** — a plan limit exists, value not published.
- **CPU overcommit / dedicated cores** — not stated.
- **Cold-start and resume percentiles** — only "usually in about a second".
- **SOC 2 / ISO 27001** — not stated on site; a Vanta Trust Center is linked from the Terms.
- **Status page** — `status.instabox.sh` does not resolve; `instabox.sh/status` serves the app shell, not a status page. **No public status page found.**
- **Per-seat pricing** — no seat line item; member caps exist per plan.
- **Data-processing addendum / sub-processor list** — delegated to the Trust Center.
- **Nested virtualisation, kernel module support** — unstated.

### Contradictions between the provider's own pages

1. **Free plan size.** Pricing and docs say Free is 4 vCPU / 8 GiB only — *"the only size on the free plan"* **[docs-confirmed]** <https://instabox.sh/docs/limits>. The Oct 20 changelog says Free sizes are *"2 vCPU / 4 GiB, 4 / 8"* and shows `instabox create --vcpus 2 --mem-mib 4096` as valid *"On Free or Pro"* **[docs-confirmed]**. Current behaviour is almost certainly 4/8-only (docs + OpenAPI agree), so the changelog is stale — but a reader cannot tell which is authoritative.
2. **Fork.** Homepage: *"Fork a machine, mid-run … Copy a running machine in seconds … Running Processes"* **[docs-confirmed]** <https://instabox.sh/>. Docs: fork is snapshot-save-plus-create and a snapshot *"does not hold memory or running processes"* **[docs-confirmed]** <https://instabox.sh/docs/snapshots>. The homepage claim is wrong as written.
3. **Preview URLs and wake.** Docs/ports: *"A visit wakes a machine that paused itself for being idle"* **[docs-confirmed]**. OpenAPI: *"Preview links remain offline until resumed."* **[docs-confirmed]** <https://api.instabox.sh/v1/openapi.json>. These cannot both be true; the docs page is more specific and newer-looking, but this matters for anyone designing a webhook-to-preview flow.
4. **Free plan requires a card?** Pricing: Free **$0**, "Get started". OpenAPI `cardMissingAt`: *"On the free tier its sandboxes then answer `402 payment_method_required`"* **[docs-confirmed]** <https://api.instabox.sh/v1/openapi.json>. Unresolved: possibly only applies to workspaces that once had a paid plan.
5. **Builder plan missing from reference pages.** `docs/limits` and `docs/machines` list only Free/Pro/Team sizes; Builder appears only on the pricing page and in `llms.txt`. A reader of the Limits page would conclude Builder does not exist.
6. **Storage rate rounding.** Per-second display is `$0.000000031`/GiB/s; `$0.00011 ÷ 3600 = $0.0000000306`. The toggle rounds up ~1.5%. Immaterial at small scale, but the two numbers on the same page are not exact reciprocals.
7. **Calculator omits storage.** "Estimated monthly cost $24.82" for 4 vCPU / 8 GiB / 730 h equals vCPU+memory only; the 20 GiB disk adds $1.61 **[pricing-page]** <https://instabox.sh/pricing>. The label does not say storage is excluded.
8. **"Invite-only beta" vs open signup.** Pricing page offers Free with a "Get started" button and the changelog describes public plans; a third-party review on Oct 25 calls it *"currently an invite-based beta"* and tells readers to *"get on the invite list"* **[third-party]** <https://instabox.sh/pricing>. The OpenAPI contains an invite gate that may or may not be enabled. Treat signup friction as uncertain.
9. **Free tier: "no usage limit" vs an 8-hour cap.** The pricing announcement says the free machine has no limit — *"Q1: Is there a usage limit on the free machine? No. Use it as much as you want."* **[docs-confirmed]** <https://instabox.sh/blog/instabox-pricing> — while the OpenAPI caps a free machine at 480 minutes of continuous runtime **[docs-confirmed]** <https://api.instabox.sh/v1/openapi.json> — "Free machines default to 480". Both can be true only if "usage limit" means monthly hours rather than continuous session length, which the blog does not say. A reader planning an overnight free job will be surprised.

### Discrepancies with battleships.dev (secondary source)

`https://battleships.dev/data/providers/instabox.json` / `.md` appears to describe InstaBox **before the Oct 20–27 pricing and feature releases** **[inferred from the dated changelog entries at <https://instabox.sh/changelog> and the current pages below]**, and several of its statements are now wrong:

| battleships.dev says | Current provider state | Verdict |
|---|---|---|
| "Invite-only beta (no published price)"; "Free until we figure it out" | Five published plans with unit prices and a per-second meter **[pricing-page]** <https://instabox.sh/pricing> | **Stale** |
| "One fixed size for everyone: 4 vCPU / 8 GB / 20 GB storage … other sizes are refused" | 2/4, 4/8, 8/16 on Pro; up to 32/64 on Team **[docs-confirmed]** <https://instabox.sh/docs/limits> | **Stale** |
| "Max 5 machines counting paused and stopped ones" | Free is **1** machine; Pro 500 (100 running) **[docs-confirmed]** <https://instabox.sh/docs/limits> | **Stale** (5 was the pre-Oct-20 free allowance) |
| `"snapshot_mem": true` (memory snapshots) | "It does not hold memory or running processes" **[docs-confirmed]** <https://instabox.sh/docs/snapshots> | **Wrong** — this is the single most misleading entry |
| "Snapshots and forks … need a stopped machine" | Live snapshots allowed where the server supports them **[docs-confirmed]** <https://api.instabox.sh/v1/openapi.json> | **Outdated** |
| "Public port URLs … go offline while the machine is paused … a visit does not wake it" | A visit wakes an idle-paused machine **[docs-confirmed]** <https://instabox.sh/docs/ports> | **Wrong** for idle pauses; still true for manual pause/stop |
| "No: SSO" | SSO/SAML/SCIM on Enterprise **[pricing-page]** <https://instabox.sh/pricing> | **Stale** |
| "No: secret proxy" | Org Secrets proxy shipped Oct 24 **[docs-confirmed]** <https://instabox.sh/changelog> — "InstaBox now stores API keys as encrypted Secrets and adds them to outgoing HTTPS request headers." | **Stale** |
| "Unknown: … regions, SLA, compliance" | Still unpublished for regions; SLA and HIPAA exist on Enterprise **[pricing-page]** <https://instabox.sh/pricing> | Partly stale |
| "Category: agent-sandbox · Isolation: firecracker" | Correct **[docs-confirmed]** <https://instabox.sh/docs/limits> | **Correct** |
| "Marketing-only claims: 'spun up in <1s'" | Still marketing-only; docs say resume "usually in about a second" **[docs-confirmed]** <https://instabox.sh/docs/integrate> | **Correct** |

**Use battleships.dev only for the isolation category and the historical caveats; do not cite it for price, sizes, snapshot semantics, or SSO.**

### Gotchas worth calling out to readers

- **A paused machine is still your one free machine**, and it counts against plan machine limits **[docs-confirmed]** <https://instabox.sh/docs/limits> — *"1, in any state (paused and stopped ones count)"*.
- **Pause is not free of consequence**: it holds RAM on a host; if the host cannot restore it, you silently get a fresh boot with `processesPreserved: false` **[docs-confirmed]** <https://api.instabox.sh/v1/openapi.json> — "False means the paused programs could not be brought back and the sandbox booted fresh (files are kept)."
- **`stop` on a paused machine is an error**, so "just stop it" scripts break after an idle pause **[docs-confirmed]** <https://instabox.sh/docs/machines> — "A paused machine cannot be stopped: resume or delete it."
- **Public ports are unauthenticated**, and they wake idle machines — an unlisted URL is the only protection **[docs-confirmed]** <https://instabox.sh/docs/ports> — "It is not a secret: once published, anyone can reach the whole service until you unpublish it."
- **Secrets are placeholders, not values**: a `systemd` unit or `bash -c` without `-l` will not see them **[docs-confirmed]** <https://instabox.sh/docs/secrets> — "Processes that skip the profile (systemd units, cron, `bash -c` without `-l`) do not".
- **Snapshots contain credentials** — home is `/data/home`, so `gh`, Claude, Codex, git and SSH logins travel into every machine built from the snapshot **[docs-confirmed]** <https://instabox.sh/docs/snapshots> — *"saved sign-ins (gh, Claude, Codex, git, SSH)"*.
- **`exec` is not a shell**: 10-minute cap, 1 MiB per stream, non-zero exit is still HTTP 200 **[docs-confirmed]** <https://instabox.sh/docs/limits> — "10 minutes per command"; <https://instabox.sh/llms.txt> — "each stream is cut at 1 MiB"; <https://instabox.sh/docs/api/commands> — "A non-zero exit code is still a `200` result."
- **Disk is billed while the machine is stopped**; deleting is the only way to stop paying for it **[inferred]** from the GiB-hour storage meter (<https://instabox.sh/pricing> — "Storage | $0.00011 | per GiB-hour") and `storedBytes` counting saved disks (<https://api.instabox.sh/v1/openapi.json> — "Its saved disks' share of storedBytes").
- **The free plan's 8-hour cap is invisible on the pricing page** **[docs-confirmed]** <https://api.instabox.sh/v1/openapi.json> — "Free machines default to 480 and only an admin session can change them."
- **Legal responsibility for agent spend is explicitly yours**: *"Because AI Agents can create and run Sandboxes directly, Customer is responsible for the usage charges those actions generate"* **[docs-confirmed]** <https://instabox.sh/terms>.

---

## 15. Non-technical usability

The audience for this section: someone who understands what they want ("a computer my agent can use") but does not write code. Short version: **there is a real dashboard, and you can get to a working desktop without a terminal — but nothing here is a no-code agent product, and most of the vocabulary assumes Linux familiarity.**

### Is there a web dashboard?

**Yes.** `dashboard.instabox.sh` is a full console, and the docs reference its pages by name throughout **[docs-confirmed]** <https://instabox.sh/docs> — "In the dashboard, **Create machine** on the **Machines** page does what `instabox create` does.":

| Dashboard area | What a non-engineer can do there | Tag / quote |
|---|---|---|
| **Machines** | Create a machine from a template with a button; start/stop/pause; rename; delete | [docs-confirmed] <https://instabox.sh/docs/start> — "In the dashboard, **Create machine** on the **Machines** page does what `instabox create` does." |
| **Computer** tab | See the Linux desktop, click into it to take control; control returns to the agent after a minute idle | [docs-confirmed] <https://instabox.sh/docs/desktop> — "Click the desktop to take control; it goes back to the agent after a minute idle." |
| **Playground** | Start a machine, install things in its terminal, then "Save as snapshot" | [docs-confirmed] <https://instabox.sh/docs/snapshots> — "In the **Playground**, start a machine, install your tools … then **Save as snapshot**." |
| **Ports** tab | Publish/unpublish a port and copy its URL | [docs-confirmed] <https://instabox.sh/docs/ports> — "In the dashboard, a machine's **Ports** tab publishes and unpublishes them." |
| **Snapshots** page | See snapshots, start a new machine from one | [docs-confirmed] <https://instabox.sh/docs/snapshots> — "**New machine from it**, now or later on the **Snapshots** page" |
| **Metrics** tab | CPU, memory, network, disk I/O charts for the last hour/day | [docs-confirmed] <https://instabox.sh/changelog> — "Every sandbox now has a Metrics tab in the dashboard" |
| **Secrets** page | Add a credential with name, allowed hosts, value | [docs-confirmed] <https://instabox.sh/changelog> — "Create a Secret on the dashboard's Secrets page." |
| **Webhooks** page | Add an endpoint, see a delivery log | [docs-confirmed] <https://instabox.sh/changelog> — "Add an endpoint on the dashboard's Webhooks page" |
| **Billing** page | Subscribe with a card, see usage | [docs-confirmed] <https://instabox.sh/changelog> — "Subscribe with a card on the Billing page in the dashboard." |
| **Support** page | Open a ticket and read replies | [docs-confirmed] <https://instabox.sh/changelog> — "The dashboard now has a Support page where you open a ticket and read the team's replies." |
| **API keys** page | Create a key (only needed for code) | [docs-confirmed] <https://instabox.sh/docs/keys-sdk> — "On **API keys** in the dashboard sidebar, choose **Create Key**." |

So the answer is not "API-only" **[inferred]** from the dashboard surfaces in the table above, each documented at the cited page: create a machine (<https://instabox.sh/docs/start> — "In the dashboard, **Create machine** on the **Machines** page does what `instabox create` does."), open its desktop (<https://instabox.sh/docs/desktop> — "Click the desktop to take control"), publish a port (<https://instabox.sh/docs/ports> — "In the dashboard, a machine's **Ports** tab publishes and unpublishes them."), and read a bill (<https://instabox.sh/changelog> — "Subscribe with a card on the Billing page in the dashboard.").

### Can someone use it without writing code?

**Partly — and this is the sharpest limit in the product.**

- **Yes:** create a machine, open the desktop, use Chromium, run a terminal in the browser, save a snapshot, start another machine from it. All point-and-click **[docs-confirmed]** <https://instabox.sh/docs/desktop>.
- **Yes, sort of:** the default template has **Claude Code and Codex preinstalled** **[docs-confirmed]** <https://instabox.sh/docs/limits>, so a non-engineer can open the web terminal and type a plain-English request into an agent that is already installed. That is the closest thing to a "one-click agent".
- **No:** there is **no hosted agent product** — no "pick an agent, give it a task, get a result" screen, no agent-run API, no gallery of one-click agent apps **[not-published]**; the OpenAPI surface is machines, exec, files, snapshots, ports, desktop, secrets — no agent endpoint.
- **No:** templates are *machines*, not workflows. Choosing `agent-browser` gives you a box with tools; it does not give you a task.

**[inferred]** For a non-technical buyer, the realistic path is "create a machine → open Computer → use the browser or ask Claude Code in the terminal". Anything beyond that (automating a recurring job, connecting an app, publishing a service) needs the CLI or API.

### What signup takes

| Question | Answer | Tag |
|---|---|---|
| Sign-in method | GitHub or Google via WorkOS | [docs-confirmed] <https://instabox.sh/docs/keys-sdk> — "Signing in with GitHub or Google is for people, to use the dashboard and to create keys." |
| Email/password signup | Not offered | [inferred] from the login URL (`/auth/workos/login`) |
| Credit card for Free | **Unclear.** Pricing says $0 and "Get started"; the API has a `cardMissingAt` state that blocks free-tier sandboxes with `402 payment_method_required` | [pricing-page] + [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> — see §14 |
| Credit card for paid | Yes, Stripe; subscribe on the Billing page | [docs-confirmed] <https://instabox.sh/changelog> — "Subscribe with a card on the Billing page in the dashboard." |
| Waitlist / invite code | **Uncertain.** An invite gate exists in the server config; a third-party review calls it invite-based; the site itself advertises open signup | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> — "With the server's invite gate on … a new account must then redeem an invite code"; [third-party] <https://dev.to/samsam4060/instabox-free-cloud-sandboxes-for-ai-agents-honest-notes-after-a-week-of-testing-47ld> — "It is currently an invite-based beta." |
| Team invite | Yes — workspace invites, roles, member caps | [docs-confirmed] <https://api.instabox.sh/v1/openapi.json> — "members, invites, invite code"; `maxMembers` |

### Docs, support, status

| Surface | Assessment | Tag / quote |
|---|---|---|
| Docs quality | **Unusually good for agents, decent for humans.** 26 pages (16 guides/reference + 10 API pages), each available as Markdown, plus a single-file `llms-full.txt` (~143 KB) and an `llms.txt` index. Every page states limits and failure modes, not just happy paths | [docs-confirmed] <https://instabox.sh/docs> — "Add `.md` to any page URL for its Markdown." |
| Docs gap | No page covers the free tier's 8-hour cap, and the blog is JavaScript-only (`/blog.md` is 404) | [inferred] from searching all 26 docs pages for the cap and from fetching <https://instabox.sh/blog.md> (returns "The page could not be found") |
| Support | Email support on Pro/Builder, priority email + SLA on Team, dedicated support on Enterprise; **no free-plan support commitment published** | [pricing-page] <https://instabox.sh/pricing> |
| Community | Discord | [docs-confirmed] <https://instabox.sh/> — the site footer links to `https://discord.gg/instabox` |
| In-product support | Ticket center in the dashboard, also fed from CLI and Discord | [docs-confirmed] <https://instabox.sh/changelog> |
| Status page | **None found.** `status.instabox.sh` does not resolve; `/status` returns the app shell | [inferred] from live DNS/HTTP checks |
| Trust / compliance page | Vanta Trust Center linked from the Terms | [docs-confirmed] <https://instabox.sh/terms> |

### What would trip up a non-engineer

1. **The quick start is a terminal command.** The very first instruction is `npx instabox@latest sh`, which requires Node and a terminal **[docs-confirmed]** <https://instabox.sh/docs>. The dashboard is the alternative, but the docs lead with the CLI.
2. **Two different "off" states.** "Pause" keeps the session, "stop" does not, and you cannot stop a paused machine. Most people expect one off switch **[docs-confirmed]** <https://instabox.sh/docs/machines>.
3. **"Snapshot" does not save the session.** Restoring a snapshot gives files, not the app you had open **[docs-confirmed]** <https://instabox.sh/docs/snapshots>.
4. **"Fork" is not instant**, despite the homepage **[docs-confirmed]** <https://instabox.sh/docs/snapshots>.
5. **Sizes are Linux vocabulary**: vCPU, GiB, `/data`, root disk. The pricing calculator asks for "vCPU" and "RAM" with sliders; nothing explains what 2 vs 8 vCPU means for a browsing agent **[pricing-page]** <https://instabox.sh/pricing>.
6. **The free machine is not a server.** 30-minute idle pause **[docs-confirmed]** <https://instabox.sh/docs/limits> — "Free: 30 minutes, fixed." — and an 8-hour continuous cap **[docs-confirmed]** <https://api.instabox.sh/v1/openapi.json> — "Free machines default to 480" — mean it will go to sleep in the middle of things **[inferred]**.
7. **Public URLs have no password.** Publishing a port exposes the service to anyone with the link **[docs-confirmed]** <https://instabox.sh/docs/ports>.
8. **Secrets are placeholders.** Pasting a key into a config file works, but the "right" way produces a value that looks like `ibsec_…` and only works through the proxy **[docs-confirmed]** <https://instabox.sh/docs/secrets>.
9. **Billing units are unfamiliar.** vCPU-hours and GiB-hours, per second, plus a subscription that is also a credit. The calculator's total excludes storage **[pricing-page]** <https://instabox.sh/pricing>.
10. **"Machine" vs "sandbox" vs "box"** in the same product, and "suspend" in the API for "pause" in the UI **[docs-confirmed]** <https://api.instabox.sh/v1/openapi.json> — "Paths, fields and scopes call a sandbox a machine"; <https://instabox.sh/docs/concepts> — "The API and CLI say `suspend`, `suspending` and `suspended` for pause".
11. **No status page** means an outage looks like a broken account to a non-engineer **[inferred]**.
12. **Agent spend is the customer's liability**, explicitly, including spend an agent triggers on its own **[docs-confirmed]** <https://instabox.sh/terms>.

---

## 17. The company behind it

InstaBox is a product of **InsForge AI, Inc.**, a Delaware company whose main product is a backend platform (InsForge / InstaCloud). InstaBox is the newer, second product line: it launched publicly on **14 October 2026**, priced itself five days later, and shares the company's YC Spring 2026 backing. The company publishes almost nothing about itself on instabox.sh — no about page, no team page, no press page — so most of this section comes from the Terms, the Privacy Policy, InsForge's own site and blog, and YC's directory. Every claim in that paragraph is evidenced in the tables below.

### Legal entity and registration

| Claim | Tag | Source + quote |
|---|---|---|
| Legal entity is InsForge AI, Inc., a Delaware corporation | [docs-confirmed] | <https://instabox.sh/terms> — "InsForge AI, Inc., a Delaware corporation ("InsForge," "we," or "us"), which operates InstaBox" |
| Delaware is also the governing law, with AAA arbitration | [docs-confirmed] | <https://instabox.sh/terms> — "This Agreement will be governed by the internal substantive laws of the State of Delaware"; "final and binding individual arbitration administered by the American Arbitration Association" |
| The product is explicitly a product, not a separate company | [docs-confirmed] | <https://instabox.sh/terms> — "InsForge's proprietary cloud computer platform for AI Agents, marketed as InstaBox" |
| Registered address, registered agent, or company number | [not-published] | No address or registration number appears on instabox.sh, insforge.dev, the Terms, or the Privacy Policy. Searched all four plus the Vanta Trust Center |
| Parent company or holding company | [not-published] | Nothing above InsForge AI, Inc. is disclosed; the Terms name it as the contracting party and the Privacy Policy names it as data controller ("InsForge AI, Inc. ("InsForge," "we," "our," or "us")") |
| Ownership changes, mergers, acquisitions | [not-published] | No mention in the Terms, Privacy Policy, changelog, InsForge blog or YC listing. Absence of a disclosure is not evidence that none happened |

### Founders and leadership

| Person | Role | Tag | Source + quote |
|---|---|---|---|
| **Hang Huang** | Co-founder & CEO | [docs-confirmed] | <https://instabox.sh/blog/instabox-pricing> — byline "Hang Huang", "CEO & Co-Founder" |
| Hang Huang (background) | Ex-Amazon PM, Yale MBA | [third-party] | <https://www.ycombinator.com/companies/insforge-instacloud> — "Co-founder & CEO at InsForge (YC P26). Ex-Amazon PM, Yale MBA. Former professional League of Legends player." |
| **Tony Chang** | Co-founder & CTO | [third-party] | <https://www.ycombinator.com/companies/insforge-instacloud> — "Co-founder & CTO at InsForge. Previously Software Engineer at Databricks(Networking Infra)." |
| Both are the only named founders | — | [third-party] | <https://www.ycombinator.com/companies/insforge-instacloud> — the "Active Founders" block lists exactly these two, with LinkedIn links |
| Other named staff (blog authors) | Can Lyu, Junwen Feng, Carmen Dou | [docs-confirmed] | <https://insforge.dev/blog> — post bylines "Can Lyu", "Junwen Feng", "Carmen Dou" |
| Headcount | **6** | [third-party] | <https://www.ycombinator.com/companies/insforge-instacloud> — "Team Size: 6"; independently, <https://dealroom.co/news/158042-insforge-raises-8m-seed-to-build-cloud-infrastructure-for-ai-agents/> — "The six-person team joined Y Combinator's Spring 2026 batch." |
| Location | San Francisco | [third-party] | <https://www.ycombinator.com/companies/insforge-instacloud> — "Location: San Francisco" |
| Executive team beyond CEO/CTO | [not-published] | — | No leadership page exists on either site; YC lists only the two founders |

### Founding and launch dates

| Event | Date | Tag | Source + quote |
|---|---|---|---|
| Company founded | **2025** | [third-party] | <https://www.ycombinator.com/companies/insforge-instacloud> — "Founded: 2025" |
| YC batch | **Spring 2026** | [third-party] | same page — "Batch: Spring 2026"; the company's own blog says "we finally got in" — <https://insforge.dev/blog/getting-into-yc-after-6-tries> (22 Mar 2026) |
| InstaBox public launch | **14 October 2026** | [docs-confirmed] | <https://instabox.sh/blog/instabox-pricing> — "Since we launched on Oct 14, beta users have been using InstaBox for free." |
| InstaBox launch (independent confirmation) | 14 October 2026 | [third-party] | <https://cube.computer/vs/instabox/> — "InstaBox, from InsForge, launched on 14 October 2026" |
| InstaBox pricing went live | **19 October 2026** | [docs-confirmed] | <https://instabox.sh/blog/instabox-pricing> — page dated "Oct 19, 2026"; "Today we're releasing InstaBox pricing." |
| An exact incorporation date | [not-published] | — | The Terms are effective on acceptance, not incorporation; no filing date is disclosed |

The sequencing matters for a buyer: InstaBox is roughly **two weeks old as a paid product** at the time of this research, while the company itself is about a year old and had shipped a different product (InsForge) since 2025 **[inferred from the dates above]**.

### Funding

| Claim | Tag | Source + quote |
|---|---|---|
| **$8M seed round**, announced 29 September 2026 | [third-party] | <https://dealroom.co/news/158042-insforge-raises-8m-seed-to-build-cloud-infrastructure-for-ai-agents/> — "InsForge raises $8M seed"; <https://www.forgevertical.com/articles/insforge-instacloud-site-performance-monitoring.html> — "On September 29 2026, Hang Huang — co-founder and CEO of InsForge — announced on X that the company had raised an $8 million seed round" |
| The round was announced by the CEO himself, on X | [third-party] | <https://dealroom.co/news/158042-insforge-raises-8m-seed-to-build-cloud-infrastructure-for-ai-agents/> — ""We just raised an $8M seed round to kill AWS, GCP, and Azure," Huang wrote" (Dealroom quoting his X post; the post itself was not fetchable) |
| **Investors in the seed are not disclosed** | [third-party] | <https://dealroom.co/news/158042-insforge-raises-8m-seed-to-build-cloud-infrastructure-for-ai-agents/> — "As of September 30, 2026, no investors or valuation details are public for the round." |
| One aggregator names **Pioneer Fund** in the seed | [third-party] | <https://www.forgevertical.com/articles/insforge-instacloud-site-performance-monitoring.html> — "Pioneer Fund joined as an investor." Single source, not confirmed by the company |
| A 2025 pre-seed round existed | [third-party] | <https://dealroom.co/news/158042-insforge-raises-8m-seed-to-build-cloud-infrastructure-for-ai-agents/> — "InsForge raised US$970.6K pre-seed in 2025, led by MindWorks Capital with participation from Baidu Ventures." |
| Pre-seed amount corroborated at ~$970K | [third-party] | <https://www.forgevertical.com/articles/insforge-instacloud-site-performance-monitoring.html> — "$970K pre-seed raise" — which agrees with Dealroom's "US$970.6K". An earlier search-result snippet claiming $1.5M did not survive a full-text check and is discarded |
| Accelerator: **Y Combinator, Spring 2026** | [third-party] | <https://www.ycombinator.com/companies/insforge-instacloud> — "Batch: Spring 2026"; "Status: Active" |
| "Backed by Y Combinator" badge — on **insforge.dev**, not on instabox.sh | [docs-confirmed] | <https://insforge.dev/> — hero badge text "Backed by Y Combinator". The InstaBox homepage does **not** contain that phrase: I fetched the rendered HTML of <https://instabox.sh/> and searched it for "Combinator", "Y Combinator" and "backed" — zero matches |
| Valuation, Series A, other rounds | [not-published] | No valuation is stated anywhere; Dealroom says none is public |
| Total raised: **~$8.97M** | [third-party] | <https://www.fastaijobs.com/companies/insforge> — "with $8.97M in total disclosed funding. Its most recent round was a $8M Seed in Sep 2026" |

**On the "Backed by Combinator" wording:** the claim is true of the company and is displayed on InsForge's own homepage, but it is **not** on instabox.sh. If the explainer puts a YC badge on the InstaBox page, attribute it to InsForge AI, Inc. and to the company site, not to the InstaBox homepage **[inferred from the two fetches above]**.

### Status page and uptime

| Claim | Tag | Source |
|---|---|---|
| **No public status page, and no published uptime figure** | [not-published] | See the four checks below |
| `status.instabox.sh` does not exist | [inferred] | DNS returns no record (`getent hosts` → NXDOMAIN), so there is nothing to serve |
| `status.insforge.dev` resolves but serves the status-vendor's marketing page | [inferred] | DNS points at `hostedstatus.com`; fetching `http://status.insforge.dev/` returns the **Status.io** homepage ("Status Pages & Incident Communications"), not a status page. An unclaimed or inactive page |
| `instabox.statuspage.io` is unclaimed | [inferred] | Fetching it returns Atlassian's Statuspage marketing site, not an InstaBox page |
| No status link anywhere on the marketing site | [inferred] | Fetched <https://instabox.sh/> and <https://instabox.sh/pricing> and searched for any `status.*` link: none. The footer links only Discord, X, Terms and Privacy |
| Per-machine metrics exist, but they are not platform uptime | [docs-confirmed] | <https://instabox.sh/changelog> — "Every sandbox now has a Metrics tab in the dashboard, with CPU, memory, network and disk I/O for the last hour or day." |

**Practical consequence** **[inferred]**: a buyer cannot check historical availability before committing, and cannot point at a public incident history during an outage. The only availability signal is the vendor's own marketing counter ("7,701 machines running" on the homepage) and whatever the dashboard shows in the moment.

### SLA

| Claim | Tag | Source + quote |
|---|---|---|
| **99.9% SLA on Enterprise only** | [pricing-page] | <https://instabox.sh/pricing> — "99.9% SLA" under Enterprise |
| Team mentions "SLAs" with no figure | [pricing-page] | <https://instabox.sh/pricing> — "Priority email support & SLAs" under Team |
| Pro and Builder: no SLA | [pricing-page] | <https://instabox.sh/pricing> — those plans list "Email support" and nothing about availability |
| Free: no SLA and no support commitment | [pricing-page] | <https://instabox.sh/pricing> — the Free card lists only machine, disk, snapshot and egress limits |
| The Terms disclaim uninterrupted service | [docs-confirmed] | <https://instabox.sh/terms> — "INSFORGE DOES NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE, THAT A SANDBOX OR ITS DATA WILL NOT BE LOST, OR THAT ALL ERRORS CAN OR WILL BE CORRECTED." |
| Liability is capped at 12 months of fees | [docs-confirmed] | <https://instabox.sh/terms> — "EACH PARTY'S TOTAL AGGREGATE LIABILITY … WILL NOT EXCEED THE TOTAL AMOUNTS PAID OR PAYABLE BY CUSTOMER TO INSFORGE IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM." |
| Service credits, measurement method, exclusions | [not-published] | No SLA document, credit schedule or measurement definition is published. The only SLA statement is the three-word pricing bullet |
| Fees are non-refundable | [docs-confirmed] | <https://instabox.sh/terms> — "except as required by law, are non-refundable" |

**Read the SLA bullet with the Terms open** **[inferred]**: a 99.9% availability promise with no published credits, no measurement method, an explicit "does not warrant … uninterrupted" clause and a 12-month fee cap is a commitment with limited commercial teeth. For anyone below Enterprise, there is no availability commitment at all.

### Support channels

| Channel | Who gets it | Tag | Source + quote |
|---|---|---|---|
| Email support | Pro and Builder | [pricing-page] | <https://instabox.sh/pricing> — "Email support" |
| Priority email support & SLAs | Team | [pricing-page] | <https://instabox.sh/pricing> — "Priority email support & SLAs" |
| Dedicated support | Enterprise | [pricing-page] | <https://instabox.sh/pricing> — "Dedicated support" |
| `support@instabox.sh` | Everyone; also the address for account closure and deletion requests | [docs-confirmed] | <https://instabox.sh/terms> — "Customer may terminate at any time by closing its account through support@instabox.sh"; <https://instabox.sh/privacy> — "Email support@instabox.sh with the subject line "Data Deletion Request."" |
| Dashboard ticket center | Signed-in users | [docs-confirmed] | <https://instabox.sh/changelog> — "The dashboard now has a Support page where you open a ticket and read the team's replies." |
| Discord | Public community | [docs-confirmed] | <https://instabox.sh/> — footer links `https://discord.gg/instabox` |
| `info@insforge.dev` | General and privacy escalation; arbitration opt-out | [docs-confirmed] | <https://instabox.sh/privacy> — "**General inquiries:** info@insforge.dev"; <https://instabox.sh/terms> — "by emailing info@insforge.dev with the subject line "Arbitration Opt-Out"" |
| Phone, live chat, published response times | [not-published] | — | No phone number, chat widget, support-hours statement or response-time target appears on either site or in the Terms |

### Security and compliance claims

**What the InsForge Trust Center actually lists** (fetched 2026-10-28):

| Item | What is actually there | Tag |
|---|---|---|
| Identity | Titled "InsForge", described as "an AI‑native Backend‑as‑a‑Service platform" — the Trust Center does not mention InstaBox at all | [docs-confirmed] — <https://app.vanta.com/insforge.dev/trust/9dxtxcntvvv5ow2tx7e4dm> — "InsForge is an AI‑native Backend‑as‑a‑Service platform that provides pre‑built backend components like databases, authentication, storage, serverless functions, and AI integrations." |
| Compliance badges | **HIPAA only.** No SOC 2 badge, no ISO 27001, no PCI, no GDPR badge is displayed under "Compliance" | [docs-confirmed] — <https://app.vanta.com/insforge.dev/trust/9dxtxcntvvv5ow2tx7e4dm> — the page's "Compliance" section contains one item, "HIPAA", and nothing else |
| Resources | **One item: an "Engagement Letter"** (a Vanta-branded template). No SOC 2 report, no penetration-test summary, no DPA, no sub-processor list | [docs-confirmed] — <https://app.vanta.com/insforge.dev/trust/9dxtxcntvvv5ow2tx7e4dm/resources> — "Engagement Letter" … "Vanta branded Engagement Letter" |
| Controls | 5 categories with roughly 30 controls: Infrastructure security (9), Organizational security, Product security, Internal security procedures, Data and privacy | [docs-confirmed] — <https://app.vanta.com/insforge.dev/trust/9dxtxcntvvv5ow2tx7e4dm>/controls — "Updated 21 minutes ago" with sections "Infrastructure security", "Organizational security", "Product security", "Internal security procedures", "Data and privacy" |
| SOC 2 | Appears only as a **control name** ("SOC 2 - System Description") under Internal security procedures, not as a report or a badge | [docs-confirmed] — <https://app.vanta.com/insforge.dev/trust/9dxtxcntvvv5ow2tx7e4dm/controls> — "SOC 2 - System Description" |
| Sub-processors | The Terms delegate the list to the Trust Center, which does not contain one | [docs-confirmed] — <https://instabox.sh/terms> — "InsForge maintains a current list of sub-processors through its Trust Center"; the Trust Center's Resources page lists only the Engagement Letter |

**Security claims the vendor makes in its own policies**:

| Claim | Tag | Source + quote |
|---|---|---|
| TLS in transit, encryption at rest | [docs-confirmed] | <https://instabox.sh/privacy> — "Encryption of data in transit over TLS and of data at rest" |
| Per-VM kernel isolation | [docs-confirmed] | <https://instabox.sh/privacy> — "Each machine is a virtual machine of its own, with its own kernel, isolated from other customers'" |
| Secrets encrypted with AES-256-GCM and never written into the machine | [docs-confirmed] | <https://instabox.sh/privacy> — "Secrets encrypted with AES-256-GCM, and deliverable to a machine without being written into it" |
| RBAC and MFA on internal systems | [docs-confirmed] | <https://instabox.sh/privacy> — "Role-based access controls and multi-factor authentication for internal systems" |
| Regular assessments, vulnerability scanning, incident response, audit logging, staff training | [docs-confirmed] | <https://instabox.sh/privacy> — "Regular security assessments and vulnerability scanning"; "Incident response procedures with defined escalation paths"; "Audit logging and monitoring of access to personal information"; "Employee security awareness training" |
| Breach notification within 72 hours where GDPR applies | [docs-confirmed] | <https://instabox.sh/privacy> — "such as 72 hours for authority notification under the GDPR" |
| HIPAA BAA available | [pricing-page] | <https://instabox.sh/pricing> — "HIPAA BAA" under Enterprise |
| Data stored and processed in the US | [docs-confirmed] | <https://instabox.sh/terms> — "stored and processed in the United States" |
| SOC 2 Type II report, ISO 27001 certificate, pen-test summary, public DPA | [not-published] | None of these is available at the Trust Center or on either site; only the HIPAA badge and one Engagement Letter are published |
| Independent security audit of InstaBox specifically | [not-published] | The Trust Center covers InsForge's BaaS; nothing addresses the InstaBox sandbox platform separately |

### Terms that matter to a buyer

| Topic | What the contract says | Tag | Source + quote |
|---|---|---|---|
| **Price-change notice** | 30 days' notice, effective at the start of the next billing period | [docs-confirmed] | <https://instabox.sh/terms> — "InsForge may change its plan charges, usage rates, and paid plan limits with at least thirty (30) days' notice, effective at the start of Customer's next billing period." |
| **Cancellation** | Customer terminates by closing the account through support email; accrued fees still owed | [docs-confirmed] | <https://instabox.sh/terms> — "Customer may terminate at any time by closing its account through support@instabox.sh." |
| **Data on cancellation — contract** | Export on request "for a limited period", then deletion "in the ordinary course of operations" | [docs-confirmed] | <https://instabox.sh/terms> §7(e) — "InsForge will, on Customer's request, make Customer Data available for export for a limited period and will thereafter delete Customer Data in the ordinary course of operations" |
| **Data on cancellation — policy** | Machines and snapshots deleted from active systems **within 30 days** of account deletion; backups overwritten within **90 days** | [docs-confirmed] | <https://instabox.sh/privacy> — "Upon account deletion they are deleted from our active systems within 30 days. Backup copies may persist for up to 90 days before being overwritten." |
| **Deletion request handling** | Acknowledged in 5 business days, completed within 30 days of verification, up to 90 days for complex requests | [docs-confirmed] | <https://instabox.sh/privacy> §6 — "We will acknowledge your request within 5 business days and complete the deletion within 30 days of verification." |
| Account contact data after closure | Kept 60 days for account recovery | [docs-confirmed] | <https://instabox.sh/privacy> §5 — "Upon account closure we retain contact information for 60 days to allow for account recovery, after which it is deleted from our active systems." |
| Payment records | Kept ~7 years | [docs-confirmed] | <https://instabox.sh/privacy> §5 — "typically 7 years from the date of the transaction" |
| Agent/API/CLI activity logs | Kept up to 12 months | [docs-confirmed] | <https://instabox.sh/privacy> §5 — "Retained for up to 12 months for service quality, billing dispute resolution, security, and debugging" |
| **Liability cap** | 12 months of fees; no indirect or consequential damages | [docs-confirmed] | <https://instabox.sh/terms> — "WILL NOT EXCEED THE TOTAL AMOUNTS PAID OR PAYABLE BY CUSTOMER TO INSFORGE IN THE TWELVE (12) MONTHS PRECEDING THE EVENT" |
| **Data loss explicitly not warranted** | "AS IS", with an explicit disclaimer that data may be lost | [docs-confirmed] | <https://instabox.sh/terms> — "THAT A SANDBOX OR ITS DATA WILL NOT BE LOST" |
| Dispute resolution | Delaware law, AAA individual arbitration, class-action waiver, 30-day opt-out by email | [docs-confirmed] | <https://instabox.sh/terms> — "final and binding individual arbitration administered by the American Arbitration Association"; "Customer may opt out of this Arbitration Agreement within thirty (30) days" |
| Renewal and cancellation mechanics | Stripe subscription with `cancelAtPeriodEnd`; a failed charge keeps the plan until `graceUntil` (15 days) | [docs-confirmed] | <https://api.instabox.sh/v1/openapi.json> — "When an unpaid subscription ends (15 days after the failed charge)"; `cancelAtPeriodEnd`: "The subscription ends at periodEnd." |
| Governing-law venue for court claims | Delaware | [docs-confirmed] | <https://instabox.sh/terms> — "governed by the internal substantive laws of the State of Delaware" |
| Uptime credit schedule | [not-published] | — | No credits, no measurement definition, no exclusions list |

**The practical reading** **[inferred]**: cancellation is a support email, not a button you can be sure of; your data is deleted within 30 days of account deletion and backups within 90; the vendor's liability is capped at what you paid in the last year, and the contract explicitly does not warrant that your sandbox data will not be lost. For an agent platform that stores credentials in `/data/home`, that combination is worth stating plainly on the comparison page.

### Custom domains (the gap, checked)

**Verdict: no custom-domain support is published, and the API has no field for one.** [not-published]

| What I checked | Result | Tag |
|---|---|---|
| The public-ports guide, the only place a URL shape is defined | Fixed vendor subdomain, no bring-your-own-domain option | [docs-confirmed] — <https://instabox.sh/docs/ports> — "The URL is `https://<port>-<machine id without m_>.<domain>/`." |
| The 26-page docs corpus (`llms-full.txt`) for "domain", "custom domain", "CNAME" | **One** occurrence of "domain", the URL template above; zero for "custom domain" and "CNAME" | [inferred] from a full-text search |
| The OpenAPI document for `customDomain`, `cname`, `hostname` fields | No `customDomain` or `cname` anywhere; the public-port object has only `port`, `name`, `url`, `machineId` | [docs-confirmed] — <https://api.instabox.sh/v1/openapi.json> — the `PublicPort` object's properties are "port", "name", "url", "machineId" |
| The changelog for a domain feature | No mention of domains at all | [inferred] from a full-text search of <https://instabox.sh/changelog> |
| The dashboard Ports tab description | Publish/unpublish and copy the URL only | [docs-confirmed] — <https://instabox.sh/docs/ports> — "In the dashboard, a machine's **Ports** tab publishes and unpublishes them." |
| A roadmap entry for custom domains | No InstaBox roadmap is published (the InsForge roadmap at <https://feedback.insforge.dev/roadmap> covers the BaaS product, not sandboxes) | [not-published] |

**What you can do instead** **[inferred]**: put your own reverse proxy or CDN in front of the `instabox.tech` URL and point your domain at that proxy. That works because the port URL is plain HTTPS, but it adds a hop, and the vendor's wake-on-visit behaviour and TLS are then your proxy's problem, not theirs. For anything customer-facing, this is the difference between "publish a port" and "host a service", and it belongs in the comparison.

---

## Sources

Primary (vendor), all fetched 2026-10-28:

- <https://instabox.sh/> — homepage
- <https://instabox.sh/pricing> — plans, unit prices (both time bases), calculator, FAQ
- <https://instabox.sh/docs> and the 19 docs pages under `/docs/*`, plus `/docs/*.md`
- <https://instabox.sh/llms.txt> and <https://instabox.sh/llms-full.txt> — agent-oriented full corpus
- <https://instabox.sh/changelog> — Oct 19–27, 2026 entries (plans, secrets, webhooks, metrics, support)
- <https://instabox.sh/terms> — Terms of Service, last updated 2026-10-22
- <https://api.instabox.sh/v1/openapi.json> — OpenAPI 3.1, 286 KB (source of the free-tier 8-hour cap, `spendCapUSD`, `cardMissingAt`, `storedBytes` semantics)
- <https://instabox.sh/privacy> — Privacy Policy, last updated 2026-10-21 (retention, deletion, security claims)
- <https://instabox.sh/blog/instabox-pricing> — InstaBox pricing announcement, 19 Oct 2026 (launch date, free-tier rationale, oversubscription)
- <https://insforge.dev/> — InsForge homepage ("Backed by Y Combinator")
- <https://insforge.dev/blog> and <https://insforge.dev/blog/getting-into-yc-after-6-tries> — company blog, 22 Mar 2026
- <https://app.vanta.com/insforge.dev/trust/9dxtxcntvvv5ow2tx7e4dm> (and `/controls`, `/resources`) — InsForge Trust Center

Secondary:

- <https://battleships.dev/data/providers/instabox.json> and `.md` — cost-comparison dataset; treated as historical, see §14
- <https://dev.to/samsam4060/instabox-free-cloud-sandboxes-for-ai-agents-honest-notes-after-a-week-of-testing-47ld> — one-week hands-on review, 2026-10-25
- <https://cube.computer/vs/instabox/> — competitor comparison page (not relied on for facts)
- <https://www.founderland.ai/articles/instabox-launches-cloud-computers-for-ai-agents-in-1-second-mvb8hewn> — launch coverage (source of the "<1 second" claim)
- <https://www.ycombinator.com/companies/insforge-instacloud> — YC company directory (founding year, batch, team size, founders, location)
- <https://dealroom.co/news/158042-insforge-raises-8m-seed-to-build-cloud-infrastructure-for-ai-agents/> — funding report, 30 Sep 2026
- <https://www.forgevertical.com/articles/insforge-instacloud-site-performance-monitoring.html> — funding aggregator (pre-seed investors, Pioneer Fund)
- <https://www.fastaijobs.com/companies/insforge> — funding database (total disclosed funding)
- <https://x.com/insforge> — company X account (YC P26 in bio, per search snippet)

### Research tool log

| Tool | Used for | Result |
|---|---|---|
| **Context.dev** (`web_map`, `web_scrape`) | Site map, full docs and pricing extraction (incl. clicking the per-second toggle), Terms, Privacy Policy, InstaBox blog, Vanta Trust Center, battleships.md/.json, dev.to review | **Succeeded** — primary source for almost everything here. Transient failures on four URLs were retried and succeeded, except where noted below |
| **TinyFish** (`TINYFISH_SEARCH_WEB`, `TINYFISH_FETCH_URLS`) | Third-party discovery; funding research; and fetching Dealroom, which returns 403 to `curl` | **Succeeded** — 10 results per query, and the Dealroom full text, which is what corrected the pre-seed figure from a wrong search snippet ($1.5M) to the article's actual "US$970.6K" |
| **Composio · Exa** (`EXA_SEARCH`) | Semantic search for launch/review coverage | **Succeeded** — surfaced founderland.ai and the dev.to review |
| **Composio · Firecrawl** (`FIRECRAWL_SCRAPE`) | JS-rendered homepage/docs/pricing/changelog, battleships JSON+MD | **Succeeded** for 6 of 7 calls; one action-click call failed (`SCRAPE_ACTION_ERROR`, element not found) and was redone with Context.dev |
| Plain HTTP (`curl`) | `llms.txt`, `llms-full.txt`, `openapi.json`, DNS/HTTP checks for a status page, and the YC / insforge.dev / OpenAPI pages for quote verification | **Succeeded** for JSON and static pages; the instabox.sh marketing pages are a JavaScript shell under `curl`, so those were verified through Context.dev. Dealroom returns 403 |
| Composio · Parallel / Tavily | — | Not needed; earlier tools answered every question |
| Amp native `web_search` / `read_web_page` | — | Not used |

### Quote verification

Every quoted string added in §17 (and the two corrected claims in §5 and §14) was re-fetched on 2026-10-28 and matched against the live page text: **68 distinct quotes checked, 68 matched**. Two failures during the pass were real and were fixed rather than papered over — Dealroom's pre-seed figure (a search snippet said $1.5M; the article says "US$970.6K") and YC's rendered spacing ("Founded: 2025", not "Founded:2025").

No sandbox was created, started, or billed; no API key was read, printed, or stored.

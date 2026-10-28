# Boat (boat.dev, formerly ASCII Box) — provider profile

Research date: **2026-10-28**. All quotes were read from the live docs that day unless marked otherwise.
Desk research only: no sandbox was created, started, resumed or billed.

**Tag legend**

| Tag | Meaning |
|---|---|
| `docs-confirmed` | Stated on a docs.boat.dev page (guides, concepts, API overview). |
| `pricing-page` | Stated on the pricing page or another page whose subject is money. |
| `third-party` | Not from Boat: battleships.dev, YC, terms-of-service analysis, etc. |
| `inferred` | My reading of documented behaviour, not a sentence the docs state. |
| `not-published` | Boat does not say; no number or answer is given anywhere I could find. |

A tag applies to the sentence or row it sits on, and its evidence is the quote immediately below it
(or the row's own Quote cell). Where a sentence is my reading rather than a source's words, it is tagged
`inferred` and the evidence it rests on is named in the same sentence.

**Source-freshness warning.** `docs.boat.dev/<page>.md` is served through a cache that can return an
older revision. A cached `/pricing.md` I first received listed disks of 12/50/125/251 GB and a
credit-pack billing model; the live page (last modified 2026-10-28) says 51/51/111/251 GB and a
dollar wallet. Everything below comes from cache-busted refetches (`?x=<timestamp>`) of the live pages.
Anyone re-checking these numbers should do the same.

---

## 1. What it is

Boat sells **whole Linux virtual machines, one per "sandbox", priced per second**, aimed at running
coding agents and agent-generated code. `docs-confirmed`

> "boat gives you full Ubuntu virtual machines (sandboxes) for AI agents and code, billed per second."
> — [Quickstart](https://docs.boat.dev/quickstart)

> "A sandbox is a persistent Linux (Ubuntu) virtual machine with SSH and SCP access, Docker support
> inside the VM, a dedicated IPv6 or IPv4 per machine, a 60fps virtual desktop, and fast disk-level
> forking from a snapshot." — [boat.dev](https://boat.dev/)

**Who it is for.** Three audiences recur across the pages: people running agents on their own work,
platforms that give each end user their own machine, and teams that want an always-available dev box.
`inferred`, resting on the two quotes below plus the platform guide's opening.

The "agent factories" phrase is Boat's own. `docs-confirmed`

> "boat is the cheapest, most powerful sandbox for agents, built for agent factories." — [boat.dev](https://boat.dev/)

> "This guide is for builders of products like Lovable, Devin, or agent platforms. In these products,
> your product makes a sandbox for each of your own users." — [platform-guide](https://docs.boat.dev/platform-guide)

**Product lines.** Each row is a documented capability; that they form one product rather than separate
SKUs is my reading. `inferred`, with the per-row quotes as evidence.

| Line | What it is | Quote | Source |
|---|---|---|---|
| Sandboxes | Four fixed sizes of Ubuntu VM, `small` → `xlarge` | "These four sizes are the only sizes." | [machines](https://docs.boat.dev/machines) |
| Integrated agents | Seven coding-agent harnesses preinstalled and promptable over API/CLI | "Every sandbox has seven coding-agent harnesses, installed and ready" | [integrated-agents](https://docs.boat.dev/integrated-agents) |
| Saved snapshots | Named disk images used as templates | "A snapshot that you save under a name. It never expires." | [concepts](https://docs.boat.dev/concepts) |
| Environments | Versioned bundle of repos, secrets and credential flags a sandbox starts with | "An **environment** is the set of settings that a new sandbox gets when it starts." | [environments](https://docs.boat.dev/environments) |
| Public URLs | HTTPS route per port on `*.on.boat.dev` | "boat gives it a stable public HTTPS URL" | [hosting](https://docs.boat.dev/hosting) |
| Desktop streaming | Browser-visible Linux desktop (Moonlight/WebRTC or VNC) | "Each sandbox has a Linux desktop that you open in your browser." | [desktop-streaming](https://docs.boat.dev/desktop-streaming) |
| AI credentials proxy | Keeps real model keys out of sandboxes via placeholder keys | "a sandbox gets placeholder keys, and the real keys stay with boat" | [ai-credentials](https://docs.boat.dev/ai-credentials) |
| Windows apps | Running Windows applications under Wine inside the Linux VM | "A sandbox runs Windows programs on its Linux desktop through Wine." | [windows-apps](https://docs.boat.dev/windows-apps) |

**Company.** The contracting entity is Dedale AI, Corp., and the Terms are governed by Delaware law.
`docs-confirmed` (provider-owned Terms, read directly)

> "a legal agreement between you and Dedale AI, Corp." — [boat.dev/terms](https://boat.dev/terms)

> "governed by the laws of the State of Delaware" — [boat.dev/terms](https://boat.dev/terms)

Battleships.dev reports Y Combinator Fall 2026, Paris, 3 people, no priced round found. `third-party`

> "Battleships is made by boat.dev" — [battleships.dev boat.md](https://battleships.dev/data/providers/boat.md)

> "Boat Founded: 2024 Batch: Fall 2026 Team Size: 3 Status: Active Location: Paris, France"
> — [battleships.dev boat.json](https://battleships.dev/data/providers/boat.json), quoting YC

---

## 2. Isolation technology

**It is a full virtual machine per sandbox, with its own kernel.** `docs-confirmed`

> "Each sandbox is its own virtual machine, with its own kernel, disk and IP address." — [security](https://docs.boat.dev/security)

> "Each sandbox is a full Linux virtual machine with its own kernel." — [machines](https://docs.boat.dev/machines)

That it is not a container, and not a microVM abstraction the user can see, is my reading: the docs
describe a VM with its own kernel and never present a microVM, but they also never name the hypervisor.
`inferred`, resting on the quotes above and on the absence of any hypervisor name in 60 docs pages.

> "Every sandbox runs on a dedicated AMD Ryzen 9 9950X (Zen 5) host. The CPU virtualization extensions
> are passed through." — [machines/virtualization](https://docs.boat.dev/machines/virtualization)

**Boat does not name its own hypervisor.** `not-published`

Firecracker, gVisor and "microVM" appear only as things you can run *inside* a sandbox, never as Boat's
isolation layer; the KVM passthrough statement is consistent with KVM-based VMs, but that is my
inference, not a documented fact. `inferred`, resting on the quote below and on the absence of any
hypervisor name across the pages I read.

> "Every sandbox has nested virtualization. `/dev/kvm` is there, so QEMU/KVM, Firecracker and the
> Android emulator run at full speed." — [machines/virtualization](https://docs.boat.dev/machines/virtualization)

**What that practically allows.** Every row below carries its own quote. `docs-confirmed`

| Capability | Status | Quote |
|---|---|---|
| root / sudo | Yes, passwordless | "Passwordless `sudo` gives full root." ([machines](https://docs.boat.dev/machines)) |
| systemd | Real systemd, services survive stop/resume | "Real `systemd`: services, timers, `journalctl`" ([machines](https://docs.boat.dev/machines)) |
| Docker inside | Yes, with BuildKit and Compose, non-root docker | "Docker with BuildKit and Compose, on the sandbox's own kernel." ([machines](https://docs.boat.dev/machines)) |
| Nested KVM | Yes, no flag | "You do not need a flag or a permission." ([machines/virtualization](https://docs.boat.dev/machines/virtualization)) |
| Custom kernel | No | "boat has one image for all customers, so you cannot get another kernel." ([faq](https://docs.boat.dev/faq)) |
| GPU | No | "No size has a GPU." ([pricing](https://docs.boat.dev/pricing)) |
| Kernel features (eBPF, cgroups, mounts) | Not stated as a list; implied by root plus an own kernel (`inferred`) | "You have root in the sandbox, so you add rules with `ufw` or `iptables`." ([hosting/firewall](https://docs.boat.dev/hosting/firewall)) |

**The boundary is the VM, not the container.** Containers inside one sandbox are not isolated from each
other by Boat, and Boat does not wipe a sandbox between users. `docs-confirmed`

> "Containers inside one sandbox share its kernel, so boat does not isolate them from each other. boat
> also does not clean a sandbox between your users." — [security](https://docs.boat.dev/security)

**Dedicated host, shared vCPU.** The host is described as dedicated; the vCPUs are shared with other
sandboxes on it. `docs-confirmed`

> "Sandboxes share vCPUs with other sandboxes on the same host, so a busy host can make a run slower."
> — [faq](https://docs.boat.dev/faq)

---

## 3. Lifecycle

### States

| User-facing (CLI, dashboard) | API and webhooks | Meaning | Billed | Quote |
|---|---|---|---|---|
| `provisioning` | `provisioning` | Machine being allocated | No | “\| `provisioning` \| `provisioning` \| Wait (see below) \| No \|” ([readiness](https://docs.boat.dev/readiness)) |
| `starting` | `provisioned` | Machine up, environment being applied | **Yes** | "At `provisioned`, the machine is up, but boat still applies your environment, secrets and repositories." ([readiness](https://docs.boat.dev/readiness)) |
| `cloning` | `cloning` | Restoring disk | Yes | “\| `cloning` \| `cloning` \| Wait (see below) \| Yes \|” ([readiness](https://docs.boat.dev/readiness)) |
| `ready` / `idle` / `running` | same | Commands work | Yes | "A sandbox is **ready** when the API reports its state as `ready`, `idle` or `running`." ([readiness](https://docs.boat.dev/readiness)) |
| `stopping` | `archiving` | Final disk save | No | "A stop saves the disk, then removes the machine." ([snapshots/stop](https://docs.boat.dev/snapshots/stop)) |
| `stopped` | `archived` | Disk saved, machine gone | No | "The API reports a stopped sandbox as `archived`." ([data-retention](https://docs.boat.dev/data-retention)) |
| `error` | `error` | Machine lost; disk held 3 days | No | "A sandbox in `error` can also resume." ([snapshots/resume-and-fork](https://docs.boat.dev/snapshots/resume-and-fork)); "Held for 3 days" ([concepts](https://docs.boat.dev/concepts)) |
| — | — | Deleted: gone from lists, data erased | No | "Gone from lists at once. boat erases the stored data in the background" ([data-retention](https://docs.boat.dev/data-retention)) |

`docs-confirmed` — [concepts](https://docs.boat.dev/concepts), [readiness](https://docs.boat.dev/readiness)

> "The API calls a stopped sandbox `archived`. It is the same state. Nothing is moved or deleted."
> — [concepts](https://docs.boat.dev/concepts)

Billing starts at `provisioned`, before `ready`. `docs-confirmed`

> "Starting | `provisioning`, `provisioned`, `cloning` … From `provisioned`" — [concepts](https://docs.boat.dev/concepts)

That the meter therefore runs while your environment is still being applied is my inference from the two
quotes in this subsection. `inferred`

> "At `provisioned`, the machine is up, but boat still applies your environment, secrets and
> repositories." — [readiness](https://docs.boat.dev/readiness)

### What each operation keeps

| Operation | Disk | Memory | Running processes | Same id | Quote |
|---|---|---|---|---|---|
| create | fresh base image | — | — | new | "A new sandbox, made with `boat new` and no `--from`, restores nothing." ([readiness](https://docs.boat.dev/readiness)) |
| stop | whole disk saved | **lost** | **lost**; Docker containers and enabled systemd units restart | yes | "A stop keeps the disk. It does not keep memory or running programs." ([snapshots/stop](https://docs.boat.dev/snapshots/stop)) |
| auto-stop | same as stop | lost | lost | yes | "At the deadline, the sandbox stops the same as with `boat stop`." ([auto-stop](https://docs.boat.dev/long-running-tasks/auto-stop)) |
| resume | restored | none | none; new machine, new IP | yes | "A resume brings a stopped sandbox back on a new machine. The sandbox keeps its id and its disk." ([snapshots/resume-and-fork](https://docs.boat.dev/snapshots/resume-and-fork)) |
| fork | copied | none | none | new id | "A fork copies a sandbox into a new sandbox. The source keeps running, and boat does not change it." ([snapshots/resume-and-fork](https://docs.boat.dev/snapshots/resume-and-fork)) |
| delete | erased | — | — | — | "boat erases the sandbox content, its unshared snapshots and its machine data." ([data-retention](https://docs.boat.dev/data-retention)) |

`docs-confirmed` — [snapshots/stop](https://docs.boat.dev/snapshots/stop), [snapshots/whats-saved](https://docs.boat.dev/snapshots/whats-saved)

**There is no pause.** It is stated in the stop page, the concepts glossary and the FAQ. `docs-confirmed`

> "There is no pause. A stop removes the virtual machine and keeps a copy of the disk. A resume starts
> a new machine with that disk." — [snapshots/stop](https://docs.boat.dev/snapshots/stop)

> "**Can I pause a sandbox?** … There is no pause. A stop removes the machine and keeps the disk."
> — [faq](https://docs.boat.dev/faq)

That this is the most consequential lifecycle fact for a comparison site is my judgement. `inferred`,
resting on the quotes above.

### Stop mechanics

> "A stop saves the disk, then removes the machine." — [snapshots/stop](https://docs.boat.dev/snapshots/stop)

Order of operations, as the stop page lists them: pre-stop hook → Docker containers get 30 s to exit →
final disk snapshot → machine removed. `docs-confirmed`

> "Each container gets 30 seconds to exit." — [snapshots/stop](https://docs.boat.dev/snapshots/stop)

> "boat does not shut down the operating system. Only Docker containers get a stop signal. Your other
> programs get no signal." — [snapshots/stop](https://docs.boat.dev/snapshots/stop)

There is a 10-minute window where a resume takes back the *same* machine with no restore, unbilled:
`docs-confirmed`

> "boat also keeps the machine for 10 minutes after the sandbox reads `stopped`. A plain `boat resume`
> in those 10 minutes takes back the same machine, with no restore. These 10 minutes are not billed."
> — [snapshots/stop](https://docs.boat.dev/snapshots/stop)

If the final snapshot fails, the stop is **refused** and the sandbox keeps running, with the meter
paused, for up to 3 days before a forced stop. `docs-confirmed`

> "If the save fails, boat refuses the stop. The sandbox keeps running, so the unsaved work stays on
> its disk." — [snapshots/stop](https://docs.boat.dev/snapshots/stop)

> "You do not pay while the stop waits." — [snapshots/stop](https://docs.boat.dev/snapshots/stop)

> "After 3 days of failed saves, boat does a forced stop by itself." — [snapshots/stop](https://docs.boat.dev/snapshots/stop)

### Idle, TTL, maximum session

| Question | Answer | Source |
|---|---|---|
| Idle auto-stop? | **No.** The timer counts from create or last resume, not activity | "The timer counts from creation or from the last resume, not from your last activity." ([auto-stop](https://docs.boat.dev/long-running-tasks/auto-stop)) |
| Default TTL | 1 hour | "The default is 1 hour." ([auto-stop](https://docs.boat.dev/long-running-tasks/auto-stop)) |
| Maximum | 30 days, or off | "The maximum is 30 days, or no auto-stop at all." ([auto-stop](https://docs.boat.dev/long-running-tasks/auto-stop)) |
| Exception | A running agent prompt pushes the deadline out by one TTL, repeatedly | "When the deadline comes while a prompt runs or waits, boat moves the deadline to one TTL later." ([auto-stop](https://docs.boat.dev/long-running-tasks/auto-stop)) |
| Trial cap | 2 h, auto-stop mandatory | "Auto-stop … Required, 2 hours maximum" ([free-trial](https://docs.boat.dev/free-trial)) |
| Extend | `boat extend --hours N` sets now+N, not start+N | "The new deadline is **now plus the TTL**, not the start time plus the TTL." ([auto-stop](https://docs.boat.dev/long-running-tasks/auto-stop)) |

### Published start / resume times

Boat publishes qualitative timings and no cold-start number in milliseconds. `not-published` for the
number; the wording is `docs-confirmed`.

> "A resume, a fork or a deploy is ready in **a few seconds, whatever the size of the disk**."
> — [readiness](https://docs.boat.dev/readiness)

> "A few seconds, whatever the sandbox holds." — [faq](https://docs.boat.dev/faq)

The only hard number is for the fail-fast path when no machine is free: about 1.5 s to get an answer.
`docs-confirmed`

> "Get an answer in about 1.5 seconds when no machine of your size is ready." — [machines](https://docs.boat.dev/machines)

Battleships records no cold-start number and says Boat is absent from the ComputeSDK benchmark set.
`third-party`

> "boat is not in the ComputeSDK benchmarks: cold_start_ms, burst_tti_ms, dax_s unknown."
> — [battleships.dev boat.md](https://battleships.dev/data/providers/boat.md)

---

## 4. State tools: snapshots, fork, templates, volumes

### Snapshots are automatic, disk-only, and only the newest one matters

`docs-confirmed`

> "boat saves the disk every minute while the sandbox runs." — [snapshots](https://docs.boat.dev/snapshots)

> "Memory and running programs are not in a snapshot. A stop is not a hibernate." — [snapshots](https://docs.boat.dev/snapshots)

> "Resume and fork always use the newest snapshot. You cannot go back to an older one." — [snapshots](https://docs.boat.dev/snapshots)

**No point-in-time restore exists.** `docs-confirmed`

> "You cannot resume or fork an older snapshot. There is no point-in-time restore."
> — [snapshots/resume-and-fork](https://docs.boat.dev/snapshots/resume-and-fork)

**What a snapshot contains.** The two lists below quote the page directly. `docs-confirmed` — [snapshots/whats-saved](https://docs.boat.dev/snapshots/whats-saved)

Saved, in the docs' words: "`/home/user`: your code, files and settings", "Every other home folder
under `/home`", "Folders that you create at `/`, for example `/code` or `/data`", "Docker **named
volumes**", "**Your changes** in `/etc`, `/usr`, `/opt`, `/root`, `/srv` and `/var`".

Not saved: "The operating system and the tools that come with every machine", "The identity of the
machine: hostname, IP address, network settings, SSH host keys", "`/tmp`, the journal logs
(`/var/log/journal`) and Docker internals other than volumes", "Your cache folder `~/.cache`",
"Running programs, memory and open ports", "The Docker **build cache**, and images that no container or
Compose project uses". All from [snapshots/whats-saved](https://docs.boat.dev/snapshots/whats-saved).

> "A snapshot saves the parts of the disk that you changed. It does not save the operating system that
> every machine already has." — [snapshots/whats-saved](https://docs.boat.dev/snapshots/whats-saved)

> "A snapshot does not save `~/.cache`." — [snapshots/whats-saved](https://docs.boat.dev/snapshots/whats-saved)

A restore behaves like a reboot. `docs-confirmed`

> "When a sandbox comes back from a snapshot, it is like a server that restarts." — [snapshots/whats-saved](https://docs.boat.dev/snapshots/whats-saved)

> "**Systemd services that you enabled start again by themselves.**" — [snapshots/whats-saved](https://docs.boat.dev/snapshots/whats-saved)

> "Programs that you started by hand are not running." — [snapshots/whats-saved](https://docs.boat.dev/snapshots/whats-saved)

### Saved snapshots (the "template" object)

The docs call these "saved snapshots" throughout. `docs-confirmed`

That this is the only durable image primitive is my reading of the docs, which offer no other image
object. `inferred`.

> "**Saved snapshot** | A snapshot that you save under a name. It never expires. Start new sandboxes
> from it with `boat new --from <name>`." — [concepts](https://docs.boat.dev/concepts)

> **Template** | Not a separate object. "Use a saved snapshot as a template" means: start many
> sandboxes from one saved snapshot. — [concepts](https://docs.boat.dev/concepts)

Pricing and limits on saved snapshots `pricing-page`:

> "Saved snapshots included with your plan: **10 for every $20 of plan per seat**, never fewer than 10."
> — [pricing](https://docs.boat.dev/pricing)

> "Each saved snapshot above the included count costs $0.056 a day ($1.68 for 30 days)."
> — [snapshots/templates](https://docs.boat.dev/snapshots/templates)

They can be shared across accounts with a `bsh_...` code. `docs-confirmed`

> "Run `boat snapshot share <name>` and give the `bsh_...` code." — [faq](https://docs.boat.dev/faq)

The receiving account does not get the owner's credentials. `docs-confirmed`

> "boat removes your logins, keys, secret files and repository clones first." — [faq](https://docs.boat.dev/faq)

### Fork

A fork is a **new sandbox from the newest snapshot of another sandbox**. The source is not paused and
not modified. `docs-confirmed`

> "A fork copies a sandbox into a new sandbox. The source keeps running, and boat does not change it."
> — [snapshots/resume-and-fork](https://docs.boat.dev/snapshots/resume-and-fork)

It is not a live memory fork, and a fork of a *running* sandbox can be up to a minute stale. `docs-confirmed`

> "A fork of a **running** sandbox uses its last background snapshot. boat takes one each minute.
> Writes from the last minute or so can be missing from the fork." — [snapshots/resume-and-fork](https://docs.boat.dev/snapshots/resume-and-fork)

> "A fork of a **stopped** sandbox has everything, because the stop took the last snapshot."
> — [snapshots/resume-and-fork](https://docs.boat.dev/snapshots/resume-and-fork)

A fork does **not** inherit the source's TTL — it gets 1 hour unless you pass one. `docs-confirmed`

> "The lifetime of the source. A fork stops after 1 hour by default, even if the source has auto-stop
> turned off." — [snapshots/resume-and-fork](https://docs.boat.dev/snapshots/resume-and-fork)

### Volumes and images

- **No volumes.** Disk is fixed per size; no attachable or shared volume appears anywhere. `not-published`,
  based on absence across 60 docs pages, plus `third-party` battleships: "volumes": false,
  "volume_attach": false ([boat.json](https://battleships.dev/data/providers/boat.json)).
- **No custom image or Dockerfile.** `docs-confirmed`

  > "No. boat has no custom image and no Dockerfile build. Install your tools in a sandbox, save it as
  > a saved snapshot, then start each sandbox with `boat new --from <name>`." — [faq](https://docs.boat.dev/faq)

- **No extra disk purchase.** `docs-confirmed` — disk is a property of the size.

  > "These four sizes are the only sizes. boat has no custom size and no size above `xlarge`."
  > — [machines](https://docs.boat.dev/machines)

---

## 5. Machine sizes

`pricing-page` — [pricing](https://docs.boat.dev/pricing) and [machines](https://docs.boat.dev/machines), identical as of 2026-10-28; each row quotes the pricing table.

| Size | $/hour | vCPU | RAM | Disk (your files) | Quote from the pricing table |
|---|---|---|---|---|---|
| `small` | **$0.018** | 2 | 4 GB | 51 GB | “\| `small` \| **$0.018** \| 2 vCPU \| 4 GB \| 51 GB \|” |
| `default` | **$0.036** | 4 | 8 GB | 51 GB | “\| `default` \| **$0.036** \| 4 vCPU \| 8 GB \| 51 GB \|” |
| `large` | **$0.072** | 8 | 16 GB | 111 GB | “\| `large` \| **$0.072** \| 8 vCPU \| 16 GB \| 111 GB \|” |
| `xlarge` | **$0.200** | 16 | 32 GB | 251 GB | “\| `xlarge` \| **$0.200** \| 16 vCPU \| 32 GB \| 251 GB \|” |

All four rows: [pricing](https://docs.boat.dev/pricing), identical on [machines](https://docs.boat.dev/machines).

> "`default` is the size that other providers call medium." — [pricing](https://docs.boat.dev/pricing)

> "Disk" is the space for your own files. The OS and the pre-installed tools are not in it.
> — [pricing](https://docs.boat.dev/pricing)

> "All sizes are x86_64. No size has a GPU." — [machines](https://docs.boat.dev/machines)

| Property | Value | Quote |
|---|---|---|
| GPU | None, at any price | "No size has a GPU." ([pricing](https://docs.boat.dev/pricing)) |
| CPU arch | x86_64 only | "All sizes are x86_64." ([machines](https://docs.boat.dev/machines)) |
| OS | Ubuntu 24.04 LTS, Linux 6.8 | "Ubuntu 24.04 LTS, Linux 6.8, x86_64." ([machines](https://docs.boat.dev/machines)) |
| Regions | Germany, Finland, France | "Sandboxes run on machines in Germany, Finland and France." ([compliance](https://docs.boat.dev/compliance)) |
| Region selection | Not offered | No region choice is documented in the CLI or API; `not-published` |
| Resize | Stop, then resume with a new `--type` | "To change the size, stop the sandbox first. Then resume with `--type`." ([snapshots/resume-and-fork](https://docs.boat.dev/snapshots/resume-and-fork)) |
| `xlarge` gate | $100 plan or higher | "`xlarge` needs the $100 plan or higher." ([pricing](https://docs.boat.dev/pricing)) |
| vCPU class | Shared | "Sandboxes share vCPUs with other sandboxes on the same host." ([faq](https://docs.boat.dev/faq)) |

Latency from outside the EU is documented as 100–200 ms round trip. `docs-confirmed`

> "Round trips take about 100 to 200 ms." — [faq](https://docs.boat.dev/faq)

---

## 6. Networking

### Inbound

| Path | How | Auth | Quote |
|---|---|---|---|
| HTTPS per port | `host <port>` / `POST /sandboxes/{id}/host` | `_token` query param by default | "boat gives it a stable public HTTPS URL" ([hosting](https://docs.boat.dev/hosting)) |
| URL shape | `https://<subdomain>-<port>.on.boat.dev` | same token | "`https://<sandbox-subdomain>-<port>.on.boat.dev`" ([hosting](https://docs.boat.dev/hosting)) |
| Ports per sandbox | Up to 50 | — | “Ports per sandbox \| Up to 50” ([hosting](https://docs.boat.dev/hosting)) |
| Ungated URL | `--public` clears the token | none | "To get a URL without a token, add `--public`" ([hosting](https://docs.boat.dev/hosting)) |
| Custom subdomain | Rename the sandbox subdomain via `PATCH /sandboxes/{id}` | — | "Every sandbox has one subdomain." ([hosting](https://docs.boat.dev/hosting)) |
| Custom domain | **Not supported** | — | "boat does not support custom domains." ([hosting](https://docs.boat.dev/hosting)) |
| Raw TCP / UDP | Open the port with `ufw`, connect to the sandbox IP | none (firewall only) | "open the port in the sandbox firewall and connect to the sandbox IP address" ([hosting](https://docs.boat.dev/hosting)) |
| SSH | Port 22 as `user` | SSH key | "Run `boat ssh <id>` for a shell." ([ssh-access](https://docs.boat.dev/ssh-access)) |

> "boat does not support custom domains." — [hosting](https://docs.boat.dev/hosting)

> "A CNAME record to an `on.boat.dev` name does not work. boat routes and issues TLS certificates only
> for `on.boat.dev` names." — [hosting](https://docs.boat.dev/hosting)

> "The public URL carries HTTPS and WebSockets only. For another protocol, open the port in the sandbox
> firewall and connect to the sandbox IP address." — [hosting](https://docs.boat.dev/hosting)

**The token is the only gate.** Anyone with the full URL gets in; there is no Boat login on that URL.
`docs-confirmed`

> "Anyone with the full URL. No boat sign-in." — [security](https://docs.boat.dev/security)

Default inbound is closed apart from SSH and Boat's own ports (22, 6080, 8090, 8911, 47984–48010).
`docs-confirmed`

> "Ports that boat uses | 22, 6080, 8090, 8911, 47984 to 48010. Do not run your app on them."
> — [hosting](https://docs.boat.dev/hosting)

> "The firewall refuses inbound connections by default." — [hosting/firewall](https://docs.boat.dev/hosting/firewall)

**IPv4 is not guaranteed.** `docs-confirmed`

> "Every sandbox has a public IPv6 address and outbound IPv4. Some sandboxes have no IPv4 address of
> their own." — [faq](https://docs.boat.dev/faq)

That this limits raw-TCP inbound to IPv6-only clients on those machines is my reading of the hosting
page. `inferred`

> "Some sandboxes have no public IPv4 address. Then `boat info` shows `sshEndpoint`, and `ip` is an
> IPv6 address. Only clients with IPv6 can reach a raw port there." — [hosting](https://docs.boat.dev/hosting)

### Outbound

| Property | Value | Quote |
|---|---|---|
| Default | Open internet | "Outbound … Open to the internet" ([security](https://docs.boat.dev/security)) |
| Allowlists / egress rules API | None | "boat has no API setting for network rules." ([hosting/firewall](https://docs.boat.dev/hosting/firewall)) |
| In-sandbox control | `ufw` / `iptables`, as root | "You have root in the sandbox, so you add rules with `ufw` or `iptables`." ([hosting/firewall](https://docs.boat.dev/hosting/firewall)) |
| Rules survive resume? | No | "Snapshots do not keep firewall rules." ([hosting/firewall](https://docs.boat.dev/hosting/firewall)) |
| Static egress IP | Not offered | `not-published`; no mention anywhere |
| Egress billing | Not billed | "Network traffic. boat does not bill egress." ([pricing](https://docs.boat.dev/pricing)) |

### Secret and credential injection

Three mechanisms, all documented:

1. **Environment variables and secret files**, versioned per environment, injected at start.
   `docs-confirmed`

   > "boat injects two types of secret when a sandbox starts." — [environments/secrets](https://docs.boat.dev/environments/secrets)

2. **"Safe for third parties"** switch that withholds *everything* of yours: variables, secret files,
   GitHub, credentials, repository setup scripts. `docs-confirmed`

   > "Nothing of yours: no variables, no secret files, no GitHub, no credentials, no repository setup
   > scripts" — [environments](https://docs.boat.dev/environments)

3. **AI credentials proxy**: the sandbox gets placeholder keys and a proxy base URL; the real key stays
   with Boat. `docs-confirmed`

   > "With the proxy on, the real keys never enter the sandbox." — [ai-credentials](https://docs.boat.dev/ai-credentials)

   > "A placeholder is worthless outside boat. It does not contain the real key."
   > — [ai-credentials](https://docs.boat.dev/ai-credentials)

---

## 7. Interfaces

| Interface | Offered? | Detail | Quote |
|---|---|---|---|
| REST API | Yes | `https://boat.dev/api/v1`, envelope `{ok, type, …}` | "The base URL is `https://boat.dev/api/v1`." ([api/v1](https://docs.boat.dev/api/v1)) |
| Python SDK | Yes | `boat-sdk` on PyPI | "`boat-sdk` on PyPI" ([sdks/overview](https://docs.boat.dev/sdks/overview)) |
| TypeScript/JS SDK | Yes | `@boatdev/sdk` on npm | "`@boatdev/sdk` on npm" ([sdks/overview](https://docs.boat.dev/sdks/overview)) |
| Other languages | OpenAPI only | generate a client from the OpenAPI file | "boat publishes SDKs for Python and TypeScript only." ([sdks/overview](https://docs.boat.dev/sdks/overview)) |
| CLI | Yes | `curl -fsSL https://boat.dev/install \| sh` | "Install the boat CLI on macOS, Linux or Windows" ([quickstart](https://docs.boat.dev/quickstart)) |
| MCP server | **Docs only** | `https://docs.boat.dev/mcp` | "It can search the docs and read pages." ([ai-tools](https://docs.boat.dev/ai-tools)); no control-plane MCP is documented (`not-published`) |
| SSH / SCP | Yes | `boat ssh`, `boat scp`, any SSH client with an authorized key | "Run `boat ssh <id>` for a shell." ([ssh-access](https://docs.boat.dev/ssh-access)) |
| Web terminal | No product feature | No browser terminal is documented on any page I read; the desktop is the browser surface | `not-published` |
| Desktop / VNC | Yes | Moonlight/WebRTC 1920x1080 60 fps, or VNC over HTTPS | "The full desktop over Moonlight (WebRTC), 1920x1080 at 60 fps" ([desktop-streaming](https://docs.boat.dev/desktop-streaming)) |
| Browser automation | Yes, by installation | Chrome 151 preinstalled, `lux`, Cua `computer` MCP | “`lux` \| Desktop and browser automation with demo recording” ([machines/tools](https://docs.boat.dev/machines/tools)) |
| Webhooks | Yes, 10 per account | events `sandbox.ready`, `.hydrated`, `.error`, `.archived`, `.degraded`, `.recovered` | “Webhooks \| 10 per account” ([limits](https://docs.boat.dev/limits)); "`sandbox.ready`", "`sandbox.hydrated`", "`sandbox.error`", "`sandbox.archived`", "`sandbox.degraded`", "`sandbox.recovered`" ([webhooks](https://docs.boat.dev/webhooks)) |
| Dashboard | Yes | browser sign-in | "one-off work, and the things that must not be automatable" ([account](https://docs.boat.dev/account)) |

> "boat publishes SDKs for Python and TypeScript only." — [sdks/overview](https://docs.boat.dev/sdks/overview)

Idempotency on create and fork is a documented header, kept 24 h. `docs-confirmed`

> "Send an `Idempotency-Key` header on create and fork. A retry with the same key then never makes a
> second sandbox, and it does not spend a start." — [limits](https://docs.boat.dev/limits)

> "boat keeps keys for 24 hours." — [api/v1](https://docs.boat.dev/api/v1)

---

## 8. Agent features

**Seven harnesses are preinstalled**, and are addressable by name through one API call. `docs-confirmed`

> "Every sandbox has seven coding-agent harnesses, installed and ready: **Claude Code, Codex, pi,
> OpenCode, Prime Agent, Kimi Code, and Mistral Vibe**." — [integrated-agents](https://docs.boat.dev/integrated-agents)

> "boat updates these to their latest release when it prepares each machine." — [machines/tools](https://docs.boat.dev/machines/tools)

| Feature | Detail | Quote |
|---|---|---|
| Agent-run API | `POST /sandboxes/{id}/prompt` with `provider`, `model`, `fast`, `prompt` | "Queue a natural-language work item for an agent harness" ([api reference](https://docs.boat.dev/api/reference/agent/prompt-sandbox-agent)) |
| Steering | Send a message into a running turn without stopping it | "Send a new message to a turn that is already running" ([api reference](https://docs.boat.dev/api/reference/agent/steer-a-running-turn)) |
| Interrupt | Stop one conversation or all of them | "Interrupt running agent work." ([api reference](https://docs.boat.dev/api/reference/agent/interrupt-running-agent-work)) |
| Conversations | Multiple parallel conversations per sandbox, each with its own history | "A Sandbox runs many conversations in parallel" ([api reference](https://docs.boat.dev/api/reference/agent/list-sandbox-events)) |
| Event stream | `GET /sandboxes/{id}/events`, all conversations by default | "Return Sandbox work, lifecycle, and progress events" ([api reference](https://docs.boat.dev/api/reference/agent/list-sandbox-events)) |
| Model switching | Change model or reasoning level mid-conversation | "You can change the model or the thinking level on any prompt." ([harnesses-and-models](https://docs.boat.dev/integrated-agents/harnesses-and-models)) |
| Computer use | Cua Driver exposed as an MCP server named `computer` to all harnesses | "It is registered as an MCP server named `computer` for all seven harnesses" ([computer-use](https://docs.boat.dev/integrated-agents/computer-use)) |
| Credential profiles | Named sets of AI keys/sign-ins, several accounts per provider, switchable | "A credential profile is a named set of AI credentials." ([ai-credentials](https://docs.boat.dev/ai-credentials)) |
| Fast mode | Codex "Fast" tier or Opus fast mode, billed by the model provider | "Fast mode runs the same model with faster output." ([harnesses-and-models](https://docs.boat.dev/integrated-agents/harnesses-and-models)) |
| Bring your own agent | Any CLI agent can be installed and run; nothing is locked | "You can install and run any other CLI agent yourself." ([faq](https://docs.boat.dev/faq)) |

**AI credential handling is the part most worth understanding.** Boat can hold your Claude/ChatGPT
subscription logins and API keys server-side, renew them, and give sandboxes placeholders.
`docs-confirmed`; that it is distinctive is my judgement (`inferred`).

> "boat renews Claude, ChatGPT and Grok sign-ins behind the proxy. The sandbox never sees a renew
> token." — [ai-credentials](https://docs.boat.dev/ai-credentials)

The in-sandbox API key is deliberately weak: it can operate its own sandbox and nothing else.
`docs-confirmed`

> "The key works on **that sandbox** only." — [api-keys/scopes](https://docs.boat.dev/api-keys/scopes)

---

## 9. Accounts

| Topic | What Boat offers | Quote |
|---|---|---|
| Sign-in | GitHub, Google, email 6-digit code, AgentID (for agents) | "There are four ways to sign in" ([account](https://docs.boat.dev/account)) |
| Agent self-signup | `auth.md` flow, agent registers, human claims it, then Stripe checkout | "An AI agent can sign up for boat without a human who pastes an API key." ([agent-auth](https://docs.boat.dev/agent-auth)) |
| Organizations | Owner / admin / member; email invites; one plan, one wallet | "It has one plan, one wallet, and members who run sandboxes on it."; "The owner invites people by email." ([organizations](https://docs.boat.dev/organizations)) |
| Billing wallet per sandbox | The wallet a create names | "A new sandbox bills the wallet that the request names." ([active-wallet](https://docs.boat.dev/organizations/active-wallet)) |
| Seats | One plan price per seat; adds included time, and 20% of limits below $2000, full limits on $2000 | "One seat costs the plan price."; "20% of the plan limits" ([seats](https://docs.boat.dev/organizations/seats-and-limits)) |
| Per-member caps | Usage cap and concurrency cap, org-billed sandboxes only | "Both caps are unlimited by default."; "Usage cap \| That member's organization-billed machine time per billing window" ([seats](https://docs.boat.dev/organizations/seats-and-limits)) |
| API keys | Scoped action set + sandbox/environment set + expiry | "boat grants a request only when **both** of these are true"; "The default is deny." ([scopes](https://docs.boat.dev/api-keys/scopes)) |
| Key presets | `read-only`, `full-sandbox`, `ci`, `admin` | "`read-only` \| Inspect sandboxes, files, snapshots, environments"; "A key keeps the actions that it had when you created it." ([scopes](https://docs.boat.dev/api-keys/scopes)) |
| Key lifetime | 90 days default, 365 max, or never | "Lifetime 90 days by default, 365 days maximum, or never expires" ([limits](https://docs.boat.dev/limits)) |
| Spend limits | **No dollar cap on a personal account**; org member caps only | "A personal account has no dollar cap." ([billing](https://docs.boat.dev/billing)) |
| Audit log | Not documented | `not-published`: no audit-log feature appears on any page I read |
| SSO / SAML | Not documented | `not-published`: no SSO or SAML page, flag or CLI command |
| HIPAA / BAA | Not documented | `not-published`: no mention anywhere |
| SOC 2 | In progress | "SOC 2 in progress. 99.95% measured sandbox uptime." ([security](https://docs.boat.dev/security)) |
| Data residency | Germany, Finland, France | "Sandboxes run on machines in Germany, Finland and France." ([compliance](https://docs.boat.dev/compliance)); no other region is documented (`not-published`) |
| Snapshot copies | Can leave the EU | "Snapshot copies can be stored outside the EU." ([compliance](https://docs.boat.dev/compliance)) |
| Zero data retention | Per account, deletes data at stop | "boat deletes a sandbox's data when it stops" ([data-retention](https://docs.boat.dev/data-retention)) |
| Command history retention | 90 days; other process output 72 h | “Command history: `boat exec` and API commands, with output \| 90 days” ([data-retention](https://docs.boat.dev/data-retention)) |
| Uptime claim | 99.95% measured sandbox uptime | "Sandboxes have an uptime of 99.95%." ([compliance](https://docs.boat.dev/compliance)) |

**One org caveat worth quoting**, because it is a real footgun for teams: start budgets are pooled.
`docs-confirmed`

> "The included time, start-rate and concurrency numbers of the plan are **one shared pool for the
> whole organization**." — [organizations/seats-and-limits](https://docs.boat.dev/organizations/seats-and-limits)

---

## 10. Pricing, exactly

### The meter

- **Per second, only while running**, billed from `provisioned` and not while `stopping`. `pricing-page` for the rate; `docs-confirmed` for the state billing

  > "You pay per second, only while a sandbox runs. A stopped sandbox costs no machine time."
  > — [pricing](https://docs.boat.dev/pricing)

  > "Starting … From `provisioned`"; "Stopping … No" — [concepts](https://docs.boat.dev/concepts)

- **No published minimum charge, rounding rule, or start fee inside limits.** `not-published`
  (docs only say "per second"; battleships models `min_billed_seconds: 0` as an assumption `third-party`).
- **Stopped = $0 machine time**, disk kept 14 days free. `pricing-page`

  > "A stopped sandbox keeps its disk for 14 days." — [pricing](https://docs.boat.dev/pricing)
- **Size multipliers**: `small` 0.5×, `default` 1×, `large` 2×, `xlarge` 5.56× of default-time.
  `pricing-page` — [pricing](https://docs.boat.dev/pricing)

  > "Each size uses VM time at its own rate" — [pricing](https://docs.boat.dev/pricing)

### Size prices

| Size | $/hour | $/month at 730 h |
|---|---|---|
| `small` | $0.018 | $13.14 |
| `default` | $0.036 | $26.28 |
| `large` | $0.072 | $52.56 |
| `xlarge` | $0.200 | $146.00 |

Docs round these: "One `default` sandbox that runs a full month (730 h) costs $26." `pricing-page`

### Plans

A plan is **prepaid machine time plus limits**, not a fee. `pricing-page`

> "A plan is a monthly price that your card pays. **It is not a fee.** Every dollar comes back as VM
> time at the rates above." — [pricing](https://docs.boat.dev/pricing)

> "Included VM time expires at the end of the billing period. boat does not carry it over."
> — [pricing](https://docs.boat.dev/pricing)

| Plan | Concurrent | Starts / min · h · day | Included VM time | Saved snapshots included | Quote (pricing table row) |
|---|---|---|---|---|---|
| $20/mo | 100 | 12 · 60 · 200 | 555 h default ($20) | 10 | “\| $20/mo \| 100 \| 12 / 60 / 200 \| 555 h of `default` ($20) \| 10 \|” |
| $100/mo | 300 | 30 · 210 · 840 | 2,777 h ($100) | 50 | “\| $100/mo \| 300 \| 30 / 210 / 840 \| 2,777 h of `default` ($100) \| 50 \|” |
| $500/mo | 1,000 | 65 · 420 · 1,680 | 13,888 h ($500) | 250 | “\| $500/mo \| 1,000 \| 65 / 420 / 1,680 \| 13,888 h of `default` ($500) \| 250 \|” |
| $2000/mo | 2,000 | 90 · 600 · 2,400 | 55,555 h ($2000) | 1,000 | “\| $2000/mo \| 2,000 \| 90 / 600 / 2,400 \| 55,555 h of `default` ($2000) \| 1,000 \|” |

All four rows: [pricing](https://docs.boat.dev/pricing).

### The wallet (overage)

`pricing-page` — [pricing](https://docs.boat.dev/pricing), [billing](https://docs.boat.dev/billing)

> "Each account and each organization has one wallet, in dollars. The wallet never pays the plan."
> — [pricing](https://docs.boat.dev/pricing)

| Overage item | Price | Quote |
|---|---|---|
| VM time past included | $0.036/h default, $0.018 small, $0.072 large, $0.200 xlarge | "VM time past the included time \| $0.036 per hour of `default`" ([pricing](https://docs.boat.dev/pricing)) |
| Saved snapshots past included | $0.056 per snapshot per day ($1.68 per 30 days) | "Saved snapshots past the included count \| $0.056 per snapshot per day ($1.68 for 30 days)" ([pricing](https://docs.boat.dev/pricing)) |
| Starts past a limit | $0.03 (≤1.5×), $0.05 (≤2×), $0.07 (≤3×) | "\$0.03 up to 1.5x the limit, \$0.05 up to 2x, \$0.07 up to 3x. Paid starts stop at 3x" ([pricing](https://docs.boat.dev/pricing)) |
| AI credentials proxy | $1 per UTC day on, plus $1 per 1,000 proxied requests | "\$1 for each day it is on, plus \$1 per 1,000 requests" ([pricing](https://docs.boat.dev/pricing)) |

Wallet top-ups run from $15 to $100,000, with a bonus from 2% at $200 to 25% at $10,000.
`pricing-page`

> "Whole dollars, from \$15 to \$100,000." — [billing](https://docs.boat.dev/billing)

> "A payment of \$200 or more gets a bonus. … from 2% at \$200 to 25% at \$10,000."
> — [billing](https://docs.boat.dev/billing)

Auto top-up refills when the balance drops below 10% of the chosen amount (never below $5), and turns
itself off after 3 declined charges. `pricing-page`

> "boat charges your card when the wallet drops below 10% of the amount, and never below \$5. …
> After 3 declined charges in a row, auto top-up turns itself off." — [billing](https://docs.boat.dev/billing)

### Paid starts (bursting)

Start-rate limits are soft up to 3×, paid from the wallet. `pricing-page`

> "You can burst above your start limits, up to 3x." — [pricing](https://docs.boat.dev/pricing)

| Plan | Starts/day included | With bursting | Cost of a full 3× day | Quote (pricing table row) |
|---|---|---|---|---|
| $20 | 200 | 600 | $22 | “\| $20/mo \| 200 \| 600 \| $22 \|” |
| $100 | 840 | 2,520 | $92.40 | “\| $100/mo \| 840 \| 2,520 \| $92.40 \|” |
| $500 | 1,680 | 5,040 | $184.80 | “\| $500/mo \| 1,680 \| 5,040 \| $184.80 \|” |
| $2000 | 2,400 | 7,200 | $264 | “\| $2000/mo \| 2,400 \| 7,200 \| $264 \|” |

All four rows: [pricing](https://docs.boat.dev/pricing).

> "Paid starts stop at 3x each limit: 36 / 180 / 600 starts per minute / hour / day on the $20 plan."
> — [limits](https://docs.boat.dev/limits)

### Free trial

`pricing-page` — [free-trial](https://docs.boat.dev/free-trial)

> "There is no free tier. Your first plan starts with a free 7-day trial, and checkout asks for a card."
> — [faq](https://docs.boat.dev/faq)

| Trial rule | Value | Quote |
|---|---|---|
| Length | 7 days, then Stripe charges the chosen plan | "7 days, then Stripe charges the plan" ([free-trial](https://docs.boat.dev/free-trial)) |
| Compute | 25 h total, all sandboxes together | "25 hours in total, all sandboxes together" ([free-trial](https://docs.boat.dev/free-trial)) |
| Concurrent | 2 | “Sandboxes at once \| 2” ([free-trial](https://docs.boat.dev/free-trial)) |
| Starts | 5 / min, 25 / h, 75 / day | "5 per minute, 25 per hour, 75 per day" ([free-trial](https://docs.boat.dev/free-trial)) |
| Auto-stop | Mandatory, 2 h max | "Required, 2 hours maximum" ([free-trial](https://docs.boat.dev/free-trial)) |
| Sizes | `small`, `default` only | "`small` and `default`" ([free-trial](https://docs.boat.dev/free-trial)) |
| Saved snapshots | Cannot create new ones | "You cannot save new ones." ([free-trial](https://docs.boat.dev/free-trial)) |

### What is not charged

- Egress: "Network traffic. boat does not bill egress." `pricing-page` — [pricing](https://docs.boat.dev/pricing)
- Public IPv6 and outbound IPv4: "A public IPv6 address on every sandbox, and outbound IPv4." `pricing-page` — [pricing](https://docs.boat.dev/pricing)
- Automatic snapshots: "Automatic snapshots of your sandboxes, with no count limit." `pricing-page` — [pricing](https://docs.boat.dev/pricing)
- Public URLs for ports: "Public URLs for the ports of a sandbox." `pricing-page` — [pricing](https://docs.boat.dev/pricing)
- Create, fork and resume inside your limits: "Starts inside your start limits cost nothing." `pricing-page` — [pricing](https://docs.boat.dev/pricing)

### What changed recently (matters for an explainer)

Credit packs and auto-refill are **gone**, replaced by the dollar wallet. `docs-confirmed`

> "**Where did credit packs and auto-refill go?** … One dollar wallet replaces them."
> — [faq](https://docs.boat.dev/faq)

Seat math changed on 2026-10-28: extra seats now add 20% of plan limits below the $2000 plan, with
grandfathering for existing multi-seat orgs. `pricing-page`

> "Organizations that had more than one seat on 28 October 2026 keep the full limits for those seats."
> — [organizations/seats-and-limits](https://docs.boat.dev/organizations/seats-and-limits)

---

## 11. Worked cost examples

All arithmetic uses only the published prices above, each quoted in §10. Plan credit is assumed spent
first, as documented ("boat uses the included amounts first. Then the wallet pays."). The arithmetic is mine.

### (A) 1,000 agent tasks a month, 10 minutes each, 2 vCPU / 4 GiB, deleted after each

- Size: `small` is exactly 2 vCPU / 4 GB. **Exact fit, no substitution needed.**
- Time: 10 min = 600 s per task → 1,000 × 600 s = 600,000 s = **166.67 h**.
- Compute: 166.67 h × $0.018/h = **$3.00** (i.e. $0.003 per task).
- Plan: the $20 plan includes $20 of VM time (555 h of `default`, or ≈1,111 h of `small`), so $3.00 is
  fully covered. **Cash: $20 for the month**; $17 of included time expires.
- Wallet: $0 if starts stay inside limits.
- Starts: 1,000 creates = 1,000 machine starts.
  - Spread over the month (≈33/day): inside the $20 plan's 200/day, 60/h, 12/min. **$0 extra.**
  - All in one day: the $20 plan allows 600/day with bursting, so **start 601 fails**
    (`rate_limited`). Starts 201–600 would cost 100×$0.03 + 100×$0.05 + 200×$0.07 = **$22**.
    On the $100 plan (840/day included) the same day costs 160 paid starts × $0.03 = **$4.80** from
    the wallet, and compute stays inside the $100 credit.
- Deletion: deleting each sandbox removes it and its snapshots. `docs-confirmed`

  > "boat erases the sandbox content, its unshared snapshots and its machine data." — [data-retention](https://docs.boat.dev/data-retention)

  No storage charge applies while a sandbox is stopped (`inferred` from "A stopped sandbox costs no
  machine time").

**Reading:** the compute is trivial ($3); the binding constraint is **start rate**, not money.

### (B) One always-on dev box, 4 vCPU / 8 GiB / 50 GiB disk, 730 h/month

- Size: `default` is exactly 4 vCPU / 8 GB, and 51 GB disk covers 50 GiB. **Exact fit.**
- Compute: 730 h × $0.036/h = **$26.28**.
- Plan: $20 plan includes $20 of VM time, i.e. 555.6 h of `default`. $26.28 − $20.00 = **$6.28**
  from the wallet (the remaining 174.4 h at $0.036/h).
- Cash: $20 plan + a wallet top-up. The minimum top-up is $15 ("Whole dollars, from \$15 to
  \$100,000"), so the first month costs **$35** with **$8.72** left in the wallet, or $20 + auto top-up.
  `inferred` from the quoted top-up range and the $6.28 overage.
- Auto-stop: must be turned off (`--no-auto-stop`) or the box stops after 1 h. `docs-confirmed` —
  "The default is 1 hour." ([auto-stop](https://docs.boat.dev/long-running-tasks/auto-stop))
- Docs state the same result rounded: "One `default` sandbox 24/7 | 730 h × $0.036 = **$26**: the
  $20 plan plus $6 from the wallet." `pricing-page`

### (C) One persistent box, 2 vCPU / 4 GiB / 20 GiB, 3 h/day for 30 days, stopped otherwise

- Size: `small` is 2 vCPU / 4 GB with **51 GB** disk, so 20 GiB fits. **Exact fit, no substitution.**
- Window: 30 days = **720 h** total.
- Running: 3 h × 30 = **90 h**.
- Compute: 90 h × $0.018/h = **$1.62**.
- Stopped: 720 − 90 = **630 h** at **$0**. Disk is kept free.
- Plan: covered by the $20 plan. **Cash: $20**, with $18.38 of included time unused and expiring.
- Starts: 30 resumes = 30 starts ("Create, fork and resume each count as one start."), far inside
  200/day. `docs-confirmed`
- Risk: the disk is deleted on day 14 of an uninterrupted stop, so a long gap between uses needs a
  saved snapshot ($0.056/day beyond the 10 included, or free within them). `docs-confirmed` —
  "boat keeps its disk for 14 days" ([concepts](https://docs.boat.dev/concepts))
- If someone used `default` instead (e.g. because they read the older cached disk figure of 12 GB for
  `small`), the same 90 h costs 90 × $0.036 = **$3.24**, still inside the $20 plan.

### Cross-check against Boat's own examples

| Boat's example | Boat's result | My arithmetic |
|---|---|---|
| One `default`, 8 h/day, 22 days | $6.34 | 176 × 0.036 = $6.336 ✔ |
| One `default` 24/7 | $26 | 730 × 0.036 = $26.28 ✔ |
| 50 `default`, 4 h/day, 22 days | $158 | 4,400 × 0.036 = $158.40 ✔ |
| 200 `small`, 1 h each | $3.60 | 200 × 0.018 = $3.60 ✔ |

The left two columns are Boat's own table. `pricing-page`

> "One `default` sandbox 24/7 | 730 h × \$0.036 = **\$26**" — [pricing](https://docs.boat.dev/pricing)

---

## 12. "Same word, different meaning"

Boat publishes its own translation table for E2B/Daytona/Modal. `docs-confirmed`

> "Other providers use some of the same words for other things." — [concepts](https://docs.boat.dev/concepts)

The "what people usually expect" column is my general knowledge of other providers, not Boat's words.
`inferred`, resting on Boat's own comparison table quoted at the end of this section.

| Word | At Boat | Boat's own words | What people usually expect | Practical consequence |
|---|---|---|---|---|
| **snapshot** | Automatic, per-sandbox, **disk only**, taken every minute; only the newest is usable | "A snapshot is a saved copy of the disk of your sandbox." | A saved image you can name, keep and boot later (E2B template, Daytona snapshot) | You cannot roll back in time. To keep a state you must create a *saved snapshot*. |
| **pause** | **Does not exist.** Marketing says "pause billing" | "There is no pause." | Memory preserved, process resumes where it left off | Every resume is a reboot: hand-started processes are gone, IP changes, Docker containers restart. |
| **stop** | Save disk, delete the machine. API calls it `archived` | "Save the disk, then remove the machine." | Graceful shutdown of the OS | No shutdown sequence; only Docker gets SIGTERM. Apps holding state in RAM lose it. |
| **persistent** | Whole disk survives a stop, **for 14 days**, minus `/tmp`, `~/.cache`, journal, Docker build cache | "boat keeps its disk for 14 days" | Storage that lasts indefinitely | A box untouched for two weeks is unrecoverable (`409 snapshot_data_expired`). |
| **fork** | New sandbox from the newest snapshot; source keeps running; a running source's fork can miss the last minute | "Make a new sandbox that copies the newest snapshot of another sandbox." | Instant copy-on-write clone of a live machine, memory included | "Fork then test" may test a slightly older disk. Fork a stopped sandbox or save a snapshot for exactness. |
| **template** | Not an object; means "start many sandboxes from one saved snapshot" | "Not a separate object." | A first-class image/template resource with versions | No template gallery, no versioned template object; naming discipline is yours. |
| **environment** | Versioned *settings* (repos, secrets, credential flags), not a VM image | "the set of settings that a new sandbox gets when it starts" | A machine image or a container | Two different concepts share the word "environment" across providers; at Boat it is config, and a saved snapshot is the image. |
| **machine start** | Any create, fork **or resume** | "Create, fork and resume each count as one start." | A cold boot of new hardware | A stop/start-heavy design burns the same budget as creating fresh sandboxes. |
| **always on** | Auto-stop turned off | "A sandbox with auto-stop turned off." | A reserved/committed instance | No discount, no reservation: it just bills 730 h/month. |
| **dedicated** | Dedicated *host*, shared vCPUs | "Sandboxes share vCPUs with other sandboxes on the same host" | Dedicated cores | Noisy-neighbour variance is acknowledged in the FAQ. |
| **egress free** | Not billed at all (current docs) | "boat does not bill egress." | Free up to a cap, then metered | Older copies of the docs and battleships still cite a 2 TB/sandbox/month cap. See §14. |
| **saved snapshot** | The durable image primitive; the closest thing to an image or template | "A snapshot that you save under a name." | — | No separate template object exists, so naming and versioning are yours. |

> "Stop (disk kept, memory not kept) | Pause in filesystem mode. A default pause keeps memory, a boat
> stop does not" — Boat's own comparison table, [concepts](https://docs.boat.dev/concepts)

---

## 13. Glossary candidates

Terms a newcomer needs before the rest of this profile makes sense:

- **Sandbox** — one Ubuntu VM with its own kernel, disk, IP and `bx_...` id.
- **Machine** — the physical host a sandbox currently sits on; a resume or fork lands on a new one.
- **Size / type** — `small`, `default`, `large`, `xlarge`; fixed bundles of vCPU, RAM and disk.
- **Snapshot** — Boat's automatic, disk-only, per-minute save of changed blocks.
- **Saved snapshot** — a named snapshot that never expires; the closest thing to an image or template.
- **Stop** — save disk, destroy machine, stop billing.
- **Resume** — start a new machine from the newest snapshot, same sandbox id, new IP.
- **Fork** — new sandbox copied from another's newest snapshot.
- **Auto-stop / TTL** — a countdown from create or resume, not from activity; default 1 h, max 30 days.
- **Always on** — a sandbox with auto-stop disabled.
- **Hydrated** — all file content has finished streaming after a resume; files are readable before that.
- **Environment** — versioned settings a sandbox starts with: repos, env vars, secret files, credential flags.
- **Setup script** — commands run at start; repository scripts run on every start, `--setup-file` runs once.
- **Public URL / host** — an HTTPS route for one port, `https://<subdomain>-<port>.on.boat.dev`, token-gated by default.
- **Machine start** — the metered event of create, fork or resume, counted against start-rate limits.
- **Plan** — monthly prepayment that becomes VM time and sets limits; expires monthly.
- **Wallet** — dollar balance that pays overage only; never expires; bonuses on large top-ups.
- **Paid start** — a start above the plan's rate limit, bought from the wallet, capped at 3×.
- **Seat** — a paid member place in an organization; adds plan price, included time and (partly) limits.
- **Active wallet** — which account or organization a new sandbox bills.
- **Safe for third parties** — an environment flag that withholds every credential of yours.
- **AI credentials proxy** — server-side key swap so sandboxes hold placeholders, not real keys.
- **Harness** — a coding-agent CLI Boat has preinstalled and can prompt (`claude`, `codex`, `pi`, …).
- **ZDR** — zero data retention: delete a sandbox's data when it stops.

---

## 14. Gaps, contradictions, and discrepancies with battleships.dev

### Contradictions inside Boat's own material

| # | Issue | Evidence |
|---|---|---|
| 1 | **API rate limit is stated twice with different numbers on the same page**: table says 1,000 requests/min per IP; the error row and header example say 10,000 requests per 60 s. | "API requests … 1,000 per minute from one IP address" vs "More than 10,000 API requests in 60 seconds from one IP address" ([limits](https://docs.boat.dev/limits)) |
| 2 | **Homepage still says "three sizes"** and "pause billing", and calls the VM "persistent" without the 14-day limit. | "sandboxes come in three sizes"; "boat stop : snapshot and pause billing" ([boat.dev](https://boat.dev/)) |
| 3 | **Snapshot retention: 14 days (docs, FAQ) vs ~30 days (Terms).** | "boat keeps the disk for 14 days after the stop" ([faq](https://docs.boat.dev/faq)); "generally retained for a limited period, currently up to approximately 30 days" ([terms](https://boat.dev/terms)) |
| 4 | **IPv4 wording drifts.** | "A public IPv6 address on every sandbox, and outbound IPv4" ([pricing](https://docs.boat.dev/pricing)); "Public IPv4 or IPv6" ([machines](https://docs.boat.dev/machines)); "Some sandboxes have no IPv4 address of their own" ([faq](https://docs.boat.dev/faq)) |
| 5 | **Saved-snapshot allowance is stated two ways.** Current pricing says 10 for every $20 of plan per seat; an older cached copy of the limits page said 10 flat per account or organization. | "10 for every \$20 of plan per seat" ([pricing](https://docs.boat.dev/pricing)); "10 included for every \$20 of plan per seat" ([limits](https://docs.boat.dev/limits)) |
| 6 | **`xlarge` access**: pricing says "You do not need to contact us"; a cached copy of the billing page said it needs "a bare-metal allocation from an Ascii operator". Current billing no longer says that. | [pricing](https://docs.boat.dev/pricing) |
| 7 | **Seat limits changed on 2026-10-28.** | "20% of the plan limits"; "Organizations that had more than one seat on 28 October 2026 keep the full limits for those seats" ([organizations/seats-and-limits](https://docs.boat.dev/organizations/seats-and-limits)) |
| 8 | **Egress cap disappeared.** Older cached copies of billing/FAQ said "up to 2 TB per sandbox per month"; current pages say only that egress is not billed. | "boat does not bill egress." ([pricing](https://docs.boat.dev/pricing)); "egress are included" ([faq](https://docs.boat.dev/faq)) |
| 9 | **`/pricing.md` and other `.md` endpoints serve stale revisions** through a cache (disk sizes, credit packs). Re-fetch with a cache-buster before quoting. | `inferred` from direct observation on 2026-10-28: the same URL returned two different price tables minutes apart, one matching an older revision |

### Discrepancies with battleships.dev

Battleships is built by the Boat team and labels itself as such, but its Boat record is dated
2026-09-30 and has drifted from today's docs. The first column below gives battleships' literal field
values or phrases (`boat.json`, `boat.md`); the second gives the current docs. `third-party`

> "Battleships is made by boat.dev; boat.dev's numbers come from its public docs and are held to the
> same standard as every other provider." — [battleships.dev boat.md](https://battleships.dev/data/providers/boat.md)

| battleships says | Current docs say | Why it matters |
|---|---|---|
| Disks 12 / 50 / 125 / 251 GB | 51 / 51 / 111 / 251 GB | Understates `small` by 39 GB and overstates `large` by 14 GB; changes which size a workload needs. |
| Egress free up to 2 TB/sandbox/month | "boat does not bill egress" (no cap stated) | Cost model differs for heavy transfer. |
| `snapshot` kept "for the life of the sandbox" | 14 days after stop | Overstates durability of a stopped box. |
| `fork_running: true`, "live fork (no pause)" | Fork of a running sandbox uses the last per-minute snapshot; writes can be missing | "Live" is true only in the sense that the source is not paused. |
| `pause_resume: true` | "There is no pause." | The flag means stop/resume; the word invites the wrong mental model. |
| `mcp_server: false` | A docs MCP server exists at `docs.boat.dev/mcp` | True for a *control-plane* MCP; false as a blanket statement. |
| `public_ipv4: false` | "Public IPv4 or IPv6" per machine; IPv4 not guaranteed | Both are partly right; the docs contradict each other here (see the table above). |
| `xlarge` needs "operator allocation on request" | "You do not need to contact us." | Blocks a buyer who believes they must ask. |
| `custom_image: false`, no OCI | Correct | Consistent. |
| `sso: false`, `audit_logs: false`, `soc2: false` | Not documented anywhere; SOC 2 "in progress" | Consistent, but "false" overstates certainty versus "not published". |
| Capacity fallback to older Hetzner machines at the same price, no `/dev/kvm` | Removed from the pricing page; docs now say "That boat row is the machine every sandbox runs on." | Either the fallback ended or the docs stopped disclosing it. **Unresolved.** |

### Genuinely unpublished

- Cold-start / resume latency in milliseconds (only "a few seconds").
- Minimum billed increment, rounding, and whether `provisioning` time is billed (billing starts at `provisioned`).
- Egress ceiling or throttling behaviour, if any.
- Any static egress IP or IP allowlist.
- SSO/SAML, audit logs, HIPAA/BAA, DPA terms.
- Behaviour above 3× start limits other than "start fails".
- Refund policy beyond "does not refund unused time in general".
- What happens to `xlarge` availability when capacity is short.

---

## 15. Non-technical usability

This section answers "could a capable non-engineer actually use this?" The short answer, which is my
judgement rather than a Boat statement: **they can watch and drive agents, but they cannot get started
without a terminal.** `inferred`, resting on the surfaces quoted below.

### Is there a dashboard?

Yes. `boat.dev/dashboard` returns HTTP 200 with the title "boat dashboard"; it is a client-rendered app
and I could not inspect it without an account, so the tab inventory below comes from the docs.
`inferred` for the HTTP observation; `docs-confirmed` for each tab, quoted per row.

| Dashboard tab | Documented use | Quote |
|---|---|---|
| Sandboxes | See each sandbox, its **Type** and **Cost**, open the desktop, delete it | "The dashboard Sandboxes page shows the size of each sandbox in the **Type** column." ([machines](https://docs.boat.dev/machines)); "The **Sandboxes** page has a **Cost** column" ([billing](https://docs.boat.dev/billing)) |
| Snapshots | Delete snapshots | "Delete all snapshots of a sandbox" ([data-retention](https://docs.boat.dev/data-retention)) |
| Environment | Turn **Safe for third parties** on/off, edit repository setup scripts | "Open Dashboard > Environment." ([setup](https://docs.boat.dev/setup)); "You can change this at any time in Dashboard > Environment." ([account](https://docs.boat.dev/account)) |
| Agents & Proxying | Sign in to Claude/ChatGPT/Kimi, paste API keys, turn the AI proxy on | "Open Agents & Proxying and sign in to Claude or ChatGPT, or paste an API key." ([integrated-agents](https://docs.boat.dev/integrated-agents)); "open **Agents & Proxying**, then the **Proxying** tab" ([ai-credentials](https://docs.boat.dev/ai-credentials)) |
| Organization | Invite members, change roles, set per-member caps | "use the Organization tab of the dashboard" ([organizations](https://docs.boat.dev/organizations)) |
| Billing | Plan, **Pay**, auto top-up, cost by sandbox | "open the Billing tab, enter an amount and click **Pay**"; "choose an amount and turn on **Auto top-up**" ([billing](https://docs.boat.dev/billing)) |
| Account | Sign-in connections | "Dashboard > Account lists them." ([account](https://docs.boat.dev/account)) |

> "**Dashboard** | one-off work, and the things that must not be automatable" — [account](https://docs.boat.dev/account)

> "You can also open the desktop from the [Sandboxes](https://boat.dev/dashboard?tab=sandboxes) tab of
> the dashboard while the sandbox runs." — [desktop-streaming](https://docs.boat.dev/desktop-streaming)

### Can someone use it without writing code?

Partly. `inferred`, from documented surfaces:

- **Watching and using a machine:** yes — open the desktop from the dashboard and use a real Linux
  desktop with Chrome, a terminal and GUI apps.
- **Connecting an AI subscription:** yes — the Agents & Proxying tab is a sign-in flow, not code.
- **Configuring what new sandboxes get:** yes — repositories and setup scripts are edited in the
  Environment tab.
- **Creating and prompting a sandbox:** effectively no. The quickstart's only path is the CLI
  (`boat new`, `boat prompt`); the docs describe no "New sandbox" wizard, no template gallery and no
  one-click agent. `not-published`

> `boat new`, then `boat prompt bx_23456789 "add tests"` — the entire getting-started path,
> [quickstart](https://docs.boat.dev/quickstart)

### What signup takes

- **A card.** No free tier; the 7-day trial runs through Stripe Checkout. `docs-confirmed`
  > "There is no free tier. Your first plan starts with a free 7-day trial, and checkout asks for a card."
  > — [faq](https://docs.boat.dev/faq)
- **A terminal**, because the installer is `curl … | sh` (or a PowerShell one-liner). `docs-confirmed`

  > "Install the boat CLI on macOS, Linux or Windows" — [quickstart](https://docs.boat.dev/quickstart)

- **No waitlist or invite** for individuals; organizations are created in-app and members invited by
  email. `not-published` for the absence of a waitlist; `docs-confirmed` for the email invite
  ("The owner invites people by email.").
- **An agent can sign itself up** through `boat.dev/auth.md`, but a human still claims it and still
  enters a card. `docs-confirmed`

  > "An AI agent can sign up for boat without a human who pastes an API key." — [agent-auth](https://docs.boat.dev/agent-auth)

  > "The free trial still needs a human to enter a card in Stripe Checkout." — [agent-auth](https://docs.boat.dev/agent-auth)

### Docs, support, status

| Surface | What it is | Quote |
|---|---|---|
| Docs | Mintlify site, ~100 guide pages (my count of the sitemap), every page also as `.md`, plus `llms.txt` and an MCP docs server | "Add `.md` to any page URL" ([ai-tools](https://docs.boat.dev/ai-tools)) |
| Support | Email `support@ascii.dev` and a Discord server | "Email [support@ascii.dev](mailto:support@ascii.dev) … [Discord](https://discord.gg/Y3TFTmE89g)" ([support](https://docs.boat.dev/support)) |
| Status | `status.ascii.dev`, titled "boat status" | "Platform status \| Live on status.ascii.dev" ([compliance](https://docs.boat.dev/compliance)) |
| Troubleshooting | A dedicated page plus a long FAQ | "A sandbox stopped or does not answer?" ([support](https://docs.boat.dev/support)) |

> "Email support@ascii.dev … Discord" — [support](https://docs.boat.dev/support)

The docs are unusually good for an engineer and unusually dense for anyone else: the pricing page alone
carries a four-row plan table, a four-bracket paid-start table, a seven-row bonus table and four worked examples.

### What would trip up a non-engineer

1. **The first step is a shell command.** There is no "create account and click Launch" path in the docs.
2. **The default 1-hour auto-stop kills work mid-session.** "A sandbox with a 1 hour TTL stops one hour
   after it starts, even in the middle of your own commands." ([auto-stop](https://docs.boat.dev/long-running-tasks/auto-stop))
3. **"Persistent" is 14 days, not forever.** A holiday-length gap loses the disk unless a saved snapshot exists.
4. **"Stop" is not "off".** It is a snapshot-plus-destroy; nothing in RAM survives, and the IP changes.
5. **The plan is not a subscription you can idle on cheaply.** $20/month buys $20 of time that expires;
   a light month still costs $20.
6. **Money lives in two places** — plan credit (expires) and wallet (does not). Overages, extra saved
   snapshots and paid starts silently draw from the wallet.
7. **API keys, scopes and presets** are unavoidable for anything beyond the dashboard, and the
   in-sandbox key is deliberately limited (it cannot create sandboxes).
8. **No custom domain.** Sharing a preview means sharing an `on.boat.dev` URL with a `_token` that is
   effectively a password.
9. **It is a Linux desktop, not a Mac or Windows machine.** Windows apps only via Wine, documented app
   by app. No GPU, so no local model inference or heavy graphics.
10. **EU-only regions**, 100–200 ms round trip from the Americas.
11. **Docs and marketing disagree in places** (§14), so a non-engineer reading the homepage will form a
    slightly wrong model of stop/pause and of how many sizes exist.

---

## 16. Disclosure: who publishes battleships.dev

Battleships.dev, the cost-comparison site this profile cross-checks against, is published by the Boat
team. Readers should weigh it accordingly. `third-party` (I keep that tag because it is a separate
editorial site, not Boat's documentation, and every claim taken from it is cross-checked against docs or
the Terms).

> "⚓ Built by boat.dev, not for it. Same engine and rules for boat.dev." — [battleships.dev](https://battleships.dev)

> "Battleships is made by boat.dev; boat.dev's numbers come from its public docs and are held to the same
> standard as every other provider." — [battleships.dev boat.md](https://battleships.dev/data/providers/boat.md)

The site also says it runs the same pricing engine for every provider, Boat included, and publishes its
code and data. `third-party`

> "One pipeline and one set of rules for every provider, boat.dev included." — [battleships.dev](https://battleships.dev)

That does not make it independent: it is the vendor grading itself. Treat its Boat row as a convenience
summary of Boat's docs, dated 2026-09-30, and use the docs for anything that matters. `inferred`

---

## 17. The company behind it

### Legal entity and registration

`docs-confirmed` — provider-owned Terms and Privacy Policy, read in full on 2026-10-28.

> "boat is provided by Dedale AI, Corp., a Delaware corporation." — [Terms](https://boat.dev/terms)

> "Our mailing address is 1111B S Governors Avenue, Dover, Delaware, United States." — [Terms](https://boat.dev/terms)

> "Dedale is a Delaware company." — [Privacy Policy](https://boat.dev/privacy)

The card statement shows the legal name, not the product name. `docs-confirmed`

> "Statements show **DEDALE AI**, the company behind boat." — [billing/plan-changes](https://docs.boat.dev/billing/plan-changes)

"Ascii" is a brand the same entity owns, not a separate company. `docs-confirmed`

> "boat, Ascii, the sandbox website, software, APIs, CLI, documentation, design, names, logos, marks,
> infrastructure, and related technology are owned by Dedale or its licensors." — [Terms](https://boat.dev/terms)

Delaware is the state of incorporation and the governing law, and disputes are arbitrated there.
`docs-confirmed`

> "These Terms are governed by the laws of the State of Delaware" — [Terms](https://boat.dev/terms)

> "The arbitration will occur in Delaware, remotely, or in another location the parties agree to."
> — [Terms](https://boat.dev/terms)

There is no registered company number, VAT number or EU establishment published on the site.
`not-published`: no imprint, legal or company page exists (`boat.dev/legal`, `/imprint` and `/dpa` all
return 404).

### Founders and leadership

Two founders, both listed on the Y Combinator company profile. `third-party`

> "Anicet Nougaret … Founder/CEO" — [Y Combinator](https://www.ycombinator.com/companies/boat)

> "Kirill … Founder/CTO" — [Y Combinator](https://www.ycombinator.com/companies/boat)

YC lists the CTO by first name only. A third-party profile gives his surname and role. `third-party`

> "Kirill Makarov Co-founder and CTO" — [EveryDev](https://www.everydev.ai/developers/ascii-dev)

The CTO describes himself as CTO of the product and names the co-founder. `third-party` (read through
TinyFish's fetch on 2026-10-28; LinkedIn blocks direct fetches)

> "im Kirill, the CTO of box" — [LinkedIn](https://fr.linkedin.com/in/luaroncrew)

> "Currently, with my co-founder Anicet Nougaret we're building the best computer for agents: box."
> — [LinkedIn](https://fr.linkedin.com/in/luaroncrew)

No other executives, board or advisors are published. `not-published`

### Founding and launch dates

Y Combinator gives the founding year as 2024. `third-party`

> "Founded: 2024" — [Y Combinator](https://www.ycombinator.com/companies/boat)

A second database also gives 2024. `third-party`

> "Founded 2024" — [EveryDev](https://www.everydev.ai/developers/ascii-dev)

The founders' own account says they started the company in 2025, in Finland. `third-party` (read through
TinyFish's fetch on 2026-10-28; LinkedIn blocks direct fetches)

> "we started Ascii in the middle of Finland in 2025." — [LinkedIn](https://fr.linkedin.com/in/luaroncrew)

**These conflict and I cannot resolve them.** The plausible reading is that the company or the idea dates
from 2024 and the founders' full-time work from 2025, but neither Boat nor YC says that. `inferred`

The product launched as "box" in July 2026. `third-party`

> "Launch date July 23, 2026" — [Kingy launch tracker](https://kingy.ai/ai-launch-tracker/box-by-ascii-persistent-virtual-machines-for-coding-agents-2026-07-23/)

The rename to Boat is documented by Boat. `docs-confirmed`

> "Box became **boat** on September 15, 2026." — [migrating-from-box](https://docs.boat.dev/migrating-from-box)

> "**2026-09-15** | boat ships. Box surfaces keep working. They now answer with `Deprecation` and
> `Sunset` headers." — [migrating-from-box](https://docs.boat.dev/migrating-from-box)

The docs also say the 2026-10-31 Sunset date is a warning, not a shutdown. `docs-confirmed`

> "The Sunset date that boat shows now. boat has not decided if or when legacy endpoints, binaries,
> packages or hosted URLs retire." — [migrating-from-box](https://docs.boat.dev/migrating-from-box)

### Funding

Boat is a Y Combinator Fall 2026 company. `third-party`

> "Batch: Fall 2026" — [Y Combinator](https://www.ycombinator.com/companies/boat)

Boat publishes no funding announcement, round size, valuation or investor list. `not-published`: there is
no press, about or investors page (`boat.dev/press`, `/about` and `/company` return 404).

The only round I could find is a pre-seed, reported by a Nordic startup database. `third-party`

> "Ascii raised $500k in pre-seed funding from Entrepreneurs First (EF) and Founders, Inc." — [Nordic9](https://nordic9.com/news/ascii-raised-500k-in-pre-seed-funding-from-entrepreneurs-first-ef-and-founders-inc/)

> "01 April 2026" — [Nordic9](https://nordic9.com/news/ascii-raised-500k-in-pre-seed-funding-from-entrepreneurs-first-ef-and-founders-inc/)

> "Total investments received (USD): 1m" — [Nordic9](https://nordic9.com/news/ascii-raised-500k-in-pre-seed-funding-from-entrepreneurs-first-ef-and-founders-inc/)

The same database lists the investors. `third-party`

> "Round investors: Entrepreneur First Founders Inc Guillaume Roux-Romestaing" — [Nordic9](https://nordic9.com/news/ascii-raised-500k-in-pre-seed-funding-from-entrepreneurs-first-ef-and-founders-inc/)

A second database lists the backers but no amount. `third-party`

> "Total Funding Backed by Founders, Inc. and accepted into Y Combinator's Fall 2026 batch"
> — [EveryDev](https://www.everydev.ai/developers/ascii-dev)

The CTO says he raised money at Founders, Inc. for "my infra company"; whether that is this round or an
earlier one is not clear. `inferred`, resting on the quote below.

> "raised money at Founders, Inc. for my infra company last year" — [LinkedIn](https://fr.linkedin.com/in/luaroncrew)

No Series A, priced seed round or later round is published anywhere I could find. `not-published`

### Ownership

No parent company, acquisition or ownership change is disclosed. `not-published`; the Terms name only
Dedale AI, Corp., and no page mentions a parent.

The Privacy Policy anticipates a future transfer, which is standard language rather than an event.
`docs-confirmed`

> "We may also disclose information if required by law, to protect Dedale, users, or providers, to
> enforce the Terms, or in connection with a merger, financing, or sale of the business."
> — [Privacy Policy](https://boat.dev/privacy)

Battleships records the ownership as independent. `third-party`

> `"ownership": { "value": "independent", "parent": null` — [battleships.dev boat.json](https://battleships.dev/data/providers/boat.json)

### Headcount

Boat publishes no headcount. Two third-party sources agree on three people. `third-party`

> "Team Size: 3" — [Y Combinator](https://www.ycombinator.com/companies/boat)

> "3 Employees" — [EveryDev](https://www.everydev.ai/developers/ascii-dev)

The CTO described a team of two at an earlier point. `third-party`

> "we're just a team of 2" — [LinkedIn](https://fr.linkedin.com/in/luaroncrew)

**Reading:** three today, two at an earlier point. `inferred` from the three quotes above.

### Status page and recent uptime

There is a public status page at `status.ascii.dev`, titled "boat status". It probes eight components.
`docs-confirmed` for the page's existence; the component data below is read from its own JSON.

> "Platform status | Live on status.ascii.dev" — [compliance](https://docs.boat.dev/compliance)

> `"status": "operational"` — [status.json](https://status.ascii.dev/status.json)

The eight components, as the page renders them: Boat API, Sandbox Creation, Sandbox SSH, Sandbox Desktop
Streaming, Sandbox Stop + Resume, Sandbox Stop + Resume (extreme edge cases suite), Sandbox Fork, Boat
Dashboard. `inferred` from rendering the page on 2026-10-28; the JSON behind it still uses the old "Box"
and "Ascii" names.

**Recent figure.** Over the page's default window (Oct 15–28, 2026), it displayed 100.00% uptime for
seven components — the internal test suite included — and 99.89% for the dashboard. `inferred`: the
percentage is computed in the browser from `history.json`, and I read it from the rendered page rather
than from a server-rendered number.

**Longer window.** The same page's 90-day history (`history.json`, one-hour blocks), recomputed with its
own formula — only "red" blocks count as downtime, degraded hours do not — gives the figures below.
The percentages are floored to two decimals, as the page's formatter does — "Floor, never round up"
([script.js](https://status.ascii.dev/script.js)) — so they can sit a hundredth below naive rounding. `inferred`, computed on 2026-10-28 12:44 UTC; the window
rolls, so the numbers move.

| Component (as rendered) | Kind | Observed hours | 90-day uptime |
|---|---|---|---|
| Boat API | customer-facing | 2,149 | 99.86% |
| Sandbox Creation | customer-facing | 2,149 | 99.88% |
| Sandbox SSH | customer-facing | 2,146 | 100.00% |
| Sandbox Desktop Streaming | customer-facing | 2,146 | 99.97% |
| Sandbox Stop + Resume | customer-facing | 746 | 99.66% |
| Sandbox Fork | customer-facing | 2,149 | 98.83% |
| Boat Dashboard | customer-facing | 2,149 | 99.96% |
| Sandbox Stop + Resume (extreme edge cases suite) | internal test suite | 2,149 | 97.11% |

**True range: 97.11%–100.00% across all eight components, and 98.83%–100.00% across the seven
customer-facing ones.** `inferred`

The pooled figure is consistent with those rows: 96.25 bad hours over 15,783 observed hours is 99.39%
across all eight. Excluding the internal test suite, it is 34.25 bad hours over 13,634 observed hours,
or 99.74%. `inferred`

Two cautions for anyone quoting these. The extreme-edge-cases suite is an internal test harness, not a
customer-facing component, so its 97.11% should not be presented as platform uptime. And "Sandbox Stop +
Resume" has only 746 observed hours against 2,149 for the others, so its figure covers roughly a third
of the window. `inferred`

Boat's docs make a different, broader claim. `docs-confirmed`

> "Sandboxes have an uptime of 99.95%. boat measures this over the history of all sandboxes."
> — [compliance](https://docs.boat.dev/compliance)

The two numbers are not the same measure: 99.95% is Boat's own sandbox-level statistic, while the status
page reports synthetic probes per component. `inferred`

### SLA

No SLA is published, on any plan. `not-published`. The FAQ asks the question and answers without one.
`docs-confirmed`

> "**Do you have compliance certifications or an SLA?** … SOC 2 is in progress. Sandboxes have a measured
> uptime of 99.95%." — [FAQ](https://docs.boat.dev/faq)

The Terms disclaim uptime and availability warranties outright. `docs-confirmed`

> boat is provided "as is" and "as available." — [Terms](https://boat.dev/terms)

> "Dedale disclaims all warranties … including warranties of … availability, uptime, security, accuracy,
> data retention, performance, and error-free operation." — [Terms](https://boat.dev/terms)

> "We do not guarantee that sandbox will be uninterrupted" — [Terms](https://boat.dev/terms)

Liability is capped. `docs-confirmed`

> "our total liability for all claims relating to boat or these Terms will not exceed the greater of $100
> or the amounts you paid to Dedale for boat in the three months before the event giving rise to the
> claim." — [Terms](https://boat.dev/terms)

There are no service credits for downtime. The automatic refunds Boat lists cover billing situations and a
refused stop, not availability. `docs-confirmed`

> "A stop is refused because a snapshot failed | No charge for that time. You do not need to ask."
> — [billing/plan-changes](https://docs.boat.dev/billing/plan-changes)

### Support channels

`docs-confirmed`

> "Email support@ascii.dev … Discord" — [support](https://docs.boat.dev/support)

> "The support address is on `ascii.dev`, the mail domain of the company behind boat." — [support](https://docs.boat.dev/support)

No phone line, live chat, ticket portal or named support tiers are documented. `not-published`. The docs
ask for the account email, sandbox id, the command, the full error text and the `requestId`. `docs-confirmed`

> "The `requestId` from the API error, if you have one." — [support](https://docs.boat.dev/support)

### Security and compliance claims

`docs-confirmed` — all from Boat's own pages, none independently audited as far as I can find.

> "SOC 2 in progress" — [security](https://docs.boat.dev/security)

> "Sandboxes run on machines in Germany, Finland and France." — [compliance](https://docs.boat.dev/compliance)

> "Snapshot copies can be stored outside the EU." — [compliance](https://docs.boat.dev/compliance)

Account data can leave the EU even though sandboxes do not. `docs-confirmed`

> "Account, billing, email, and identity data may be processed in the United States and other countries
> where we or our providers operate." — [Privacy Policy](https://boat.dev/privacy)

Stored credentials are encrypted at rest, and the product offers zero data retention and a snapshots-off
mode. `docs-confirmed`

> "boat encrypts it at rest." — [ai-credentials](https://docs.boat.dev/ai-credentials)

> "boat deletes a sandbox's data when it stops" — [data-retention](https://docs.boat.dev/data-retention)

No HIPAA/BAA, SSO/SAML, audit log, ISO 27001 or pen-test report is published. `not-published`, checked
against 60 docs pages and the Terms.

### Terms that matter to a buyer

**1. Retention: 14 days in the docs, "approximately 30 days" in the Terms.** The docs are specific and
operational; the Terms are looser and control legally. `docs-confirmed` for both.

> "boat keeps its disk for 14 days" — [concepts](https://docs.boat.dev/concepts)

> "boat snapshots are generally retained for a limited period, currently up to approximately 30 days,
> unless deleted earlier or retained longer" — [Terms](https://boat.dev/terms)

**2. Closing the account cancels immediately and forfeits prepaid value.** `docs-confirmed`

> "It cancels your subscription **immediately**, not at the end of the period. You lose the remaining
> included time and the money in your wallet." — [close-account](https://docs.boat.dev/data-retention/close-account)

> "Up to **30 days** | Closed but you can get it back." — [close-account](https://docs.boat.dev/data-retention/close-account)

> "After 30 days | boat purges the sandbox data permanently." — [close-account](https://docs.boat.dev/data-retention/close-account)

There is also an immediate, irreversible erasure path for GDPR requests. `docs-confirmed`

> "It does not wait 30 days. It erases the data and your identity when the sandboxes finish stopping."
> — [close-account](https://docs.boat.dev/data-retention/close-account)

**3. Cancelling the plan is not closing the account.** Sandboxes keep running on wallet money, or stop
with their disks kept, and there is no refund of the rest of the month. `docs-confirmed`

> "At the end of the paid month, with an empty wallet | boat stops your running sandboxes. Their disks
> stay." — [billing/plan-changes](https://docs.boat.dev/billing/plan-changes)

> "boat does not refund the rest of the month after a cancel." — [billing/plan-changes](https://docs.boat.dev/billing/plan-changes)

**4. No price-change notice period.** The Terms let Boat change pricing for future use, and the only
notice promise is for material changes to the Terms, effective when posted. `docs-confirmed`

> "We may change limits, features, machine types, regions, networking, included usage, quotas, APIs, and
> pricing for future use." — [Terms](https://boat.dev/terms)

> "The updated Terms will be effective when posted or when stated in the notice." — [Terms](https://boat.dev/terms)

A plan change you request applies at once and starts a new billing month. `docs-confirmed`

> "A change applies at once, up or down" — [billing/plan-changes](https://docs.boat.dev/billing/plan-changes)

**5. Payments are non-refundable by default; the docs list three cases where Boat refunds by itself.**
`docs-confirmed`

> "Payments are non-refundable except where required by law or where we approve a refund case by case."
> — [Terms](https://boat.dev/terms)

> "boat does not refund unused time in general. boat refunds by itself in these cases" — [billing/plan-changes](https://docs.boat.dev/billing/plan-changes)

**6. It is explicitly not a dedicated hosting contract.** `docs-confirmed`

> "boat is a managed cloud service, not a dedicated hosting contract." — [Terms](https://boat.dev/terms)

**7. Disputes are individual arbitration under Delaware law, with a 30-day opt-out.** `docs-confirmed`

> "disputes … will be resolved by binding individual arbitration administered by the American Arbitration
> Association" — [Terms](https://boat.dev/terms)

> "You may opt out of arbitration by emailing … within 30 days after you first accept these Terms"
> — [Terms](https://boat.dev/terms)

---

## Appendix: research method, quote audit, and tool log

### Quote audit (2026-10-28)

Every quote in this file was extracted mechanically together with the URL cited beside it, then checked
against a cache-busted refetch of that URL:

- **279 quote/URL pairs extracted, 279 matched** their live source verbatim (after normalising
  whitespace, markdown emphasis, backticks and escaped characters). Zero unmatched at the end of the audit.
- Method: each `docs.boat.dev` page URL is fetched as `<url>.md?x=<timestamp>`; `boat.dev` and
  `battleships.dev` pages are fetched as HTML and reduced to text. A quote matches only if it appears as
  a substring, with `…` splitting a quote into parts that must each appear.
- Quotes taken from cached copies rather than the live page are labelled as such in the text (the
  `xlarge` "bare-metal allocation" line and the "2 TB per sandbox" cap). They are historical evidence of
  what the docs said, not current claims.
- Four claims were wrong when first written and were corrected during the audit: the concepts page says
  "calls", not "reports", a stopped sandbox; the FAQ says "Round trips take about 100 to 200 ms", not
  "are around"; the resume page says "stop the sandbox first. Then resume"; and "List named snapshots"
  now redirects to "List saved snapshots", so the mid-rename claim was removed.
- 60 docs pages and API-reference pages were re-fetched cache-busted for this audit, plus the homepage,
  the Terms, the Privacy Policy, and every company, press and database source cited in §16 and §17.
- Two sources need a non-default route. LinkedIn blocks direct fetches, so its five quotes were read
  through TinyFish's fetch and checked against that copy. The status page computes its percentages in the
  browser from `status.json`/`history.json`, so its uptime figures are reported as `inferred` and were
  read from a rendered page, not from server-rendered text.

### Worked-example recomputation

Recomputed independently from the quoted prices with exact decimal arithmetic:

| Case | Inputs | Result |
|---|---|---|
| A | 1,000 × 600 s = 600,000 s = 166.667 h; × $0.018 | **$3.00** ($0.003 per task) |
| B | 730 h × $0.036 = $26.28; minus $20 included | **$6.28** from the wallet, $26.28 total |
| C | 30 days = 720 h window; 3 h/day = 90 h running, 630 h stopped; 90 × $0.018 | **$1.62**, $20 plan floor |

Cross-checks: $20 / $0.036 = 555.6 h; $20 / $0.018 = 1,111.1 h; 730 h at each size = $13.14 / $26.28 /
$52.56 / $146.00; burst cost on the $20 plan for a full 3× day = 100×$0.03 + 100×$0.05 + 200×$0.07 = $22.

### Tool log

Order used: TinyFish and Context.dev first, Composio second, Amp native web tools not used.

| Tool / route | Used for | Result |
|---|---|---|
| **TinyFish Fetch** (direct REST, `api.fetch.tinyfish.ai`) | First pass over 45+ docs pages, `boat.dev`, `boat.dev/terms` | **Succeeded** on every call (HTTP 200, per-URL OK). Returned a stale cached `/pricing.md` once — the reason every page was later refetched with a cache-buster. |
| **Context.dev MCP** (`web_scrape`) | `battleships.dev/data/providers/boat.json` and `boat.md` | **Succeeded** (full markdown body for both). |
| **Composio** `COMPOSIO_SEARCH_TOOLS`, `COMPOSIO_GET_TOOL_SCHEMAS`, `COMPOSIO_MANAGE_CONNECTIONS` | Tool discovery; confirming active Firecrawl / Exa / Parallel / Tavily / TinyFish connections | **Succeeded** (all five have an active default account). |
| **Composio → Firecrawl** `FIRECRAWL_MAP_MULTIPLE_URLS_BASED_ON_OPTIONS` | Sitemap inventory of docs.boat.dev | **Succeeded** once; a second call returned no links. |
| **Composio → Firecrawl** `FIRECRAWL_CRAWL_V2` | Bounded crawl from `/pricing` (limit 10, links format) | **Succeeded**; surfaced three pricing sections the cached `.md` lacked. |
| **Composio → Firecrawl** `FIRECRAWL_SCRAPE` | Full markdown of `/pricing` | **Partly failed**: the MCP layer returned only a truncated preview, unusable for quoting. |
| **Firecrawl direct REST** (`api.firecrawl.dev/v2/scrape`) | Same page, full markdown | **Succeeded** (144 KB); used to detect the stale `.md`. |
| `curl` | `sitemap.xml`, cache-busted `.md` refetches, the 279-quote audit, HTTP status checks | **Succeeded**; this is how the stale-cache problem was found, fixed, and audited. |
| Exa, Parallel, Tavily | Not needed | Not called. |
| Amp `web_search` / `read_web_page` | Not needed | Not called. |

**Coverage:** the full 100-path sitemap was enumerated; 60 pages were re-fetched cache-busted, including
every page that carries a price, limit, lifecycle or isolation claim and the API-reference pages used for
agent claims; the marketing homepage, the Terms, and both battleships files were read in full.

**Not verified by execution:** nothing was created, started, resumed or billed. Dashboard contents,
actual start latency, and real-world snapshot restore behaviour are documented only.

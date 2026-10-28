# boxd (boxd.sh) — provider profile

**Researched:** 28 October 2026. Desk research only; no machine was created, started, or billed.
**Primary sources:** docs.boxd.sh (all pages, via `llms-full.txt` plus individual `.md` pages), boxd.sh/pricing (both currency toggles, rendered), boxd.sh/faq, boxd.sh homepage, boxd.sh/terms, app.boxd.sh sign-in page.
**Secondary:** battleships.dev provider record for boxd, everydev.ai listing, Hacker News search, Wayback Machine snapshot of the pricing page, tech.eu, a KvK-derived company listing, GitHub repository metadata, gritt.io, The SaaS News.
**Quote audit (28 Oct 2026):** every quotation below was checked mechanically against the page it cites — 436 long quotes matched a live source, 359 of them verified against the exact page cited on that line, plus 57 short fragments checked by hand; 0 mismatches. Quotes are taken from the **per-page `.md`** version of each doc, not from `llms-full.txt`: the bulk export lags the pages and sometimes carries different wording (§14, item 10).
**Tags (exactly five):** `docs-confirmed` = stated on a provider-owned surface — docs.boxd.sh, the published gRPC proto, the FAQ, the homepage, the Terms, the sign-in page · `pricing-page` = stated on boxd.sh/pricing · `third-party` = someone other than boxd · `inferred` = my reading of the evidence, with that evidence named · `not-published` = absent from every boxd surface I checked. Provider claims are still the vendor's own words, so they are quoted verbatim and the URL shows which page they come from.

> **Price warning up front.** boxd's rate card changed between 9 and 28 October 2026: the 9 Oct Wayback capture shows €0.049/vCPU-h, €0.015/GiB-h RAM, €0.0001/GiB-h disk and "50 machines included"; the live page today shows €0.039, €0.012, €0.00008 and "100 machines included" (USD list $0.047 / $0.014 / $0.000096). Every figure below uses **today's** live list and is dated. Any cost number in an explainer needs a date stamp.

---

## 1. What it is, who it is for, product lines

**One paragraph.** boxd sells persistent Linux virtual machines — each one a KVM guest with its own kernel, root, systemd and a 100 GB copy-on-write disk — that boot in milliseconds, can be copied while running, and park themselves when idle. You compose one machine by hand (install tools, sign into agents, leave a service running), save it as a *snapshot*, and then stamp out as many identical machines from it as you want. The pitch is that you get the three things sandbox products usually trade against each other at once: persistence, fast start, and a hardware isolation boundary. *(Synthesis of the sourced claims in this section — `inferred` as a paragraph; each element is tagged where it appears.)*

- "boxd machines are persistent, hardware-isolated Linux computers that boot in milliseconds, fork, snapshot and hibernate when idle." — [docs index](https://docs.boxd.sh/) · `docs-confirmed`
- "Composable computers for Devs and Agents" — [boxd.sh](https://boxd.sh/) · `docs-confirmed` (marketing page; it is the positioning claim)
- "a full computer in<10ms" — [boxd.sh](https://boxd.sh/) · `docs-confirmed` (the page's own spacing)

**Who it is for.** The docs name the audiences explicitly as use cases: development workspaces, preview environments, CI runners, coding agents, personal assistants, sandboxes for untrusted code, agentic SaaS (one machine per customer), reproducible RL environments, agent swarms, plus integrations with Anthropic's and OpenAI's managed-agent products. — [docs index](https://docs.boxd.sh/) · `docs-confirmed`

- "Give every user of your product their own machine, created and managed through the SDK." — [use-cases/agentic-saas](https://docs.boxd.sh/use-cases/agentic-saas) · `docs-confirmed`

**Product lines.** One product, sold three ways:

| Line | What it is | Evidence |
|---|---|---|
| Pay as you go | Prepaid credits, no plan fee, no seats | "Credit-based. You buy credits and your organization's machines draw them down at the rate card" — [pricing](https://boxd.sh/pricing) · `pricing-page` |
| Custom | Bigger machines, volume pricing, SSO + audit logs, dedicated support | "Bigger machines and higher quotas… SSO + audit logs" — [pricing](https://boxd.sh/pricing) · `pricing-page` |
| Self-host / BYOC | The whole platform as one Rust binary on your own hardware | "a single Rust binary you run in your own VPC, datacenter, or country" — [pricing](https://boxd.sh/pricing) · `pricing-page` |

Adjacent capabilities that are part of the same product rather than separate SKUs: integrations and scheduled/event-driven automations (`*.run.ts` jobs) — "A `*.run.ts` file can run against them on a schedule or when something happens." [docs index](https://docs.boxd.sh/) · `docs-confirmed`; an in-browser desktop per machine — "Every machine has a display." [guides/desktop](https://docs.boxd.sh/guides/desktop) · `docs-confirmed`; and org-wide env vars/secrets — "Set an environment variable or a secret **once** for your organization, and boxd injects it into the machines in the var's scope." [guides/env-secrets](https://docs.boxd.sh/guides/env-secrets) · `docs-confirmed`.

**Company.** "boxd.sh is operated by Azin Tech Holding (Amsterdam, Netherlands…)" with a €2M pre-seed led by BlueYard Capital, September 2026 — [battleships.dev](https://battleships.dev/data/providers/boxd.md) · `third-party`. boxd's own site no longer carries the funding banner (checked 28 Oct 2026), so the round rests on the third-party record alone · `third-party`. Funding is not a feature; it is context for how stable the platform is.

---

## 2. Isolation technology, and what it actually allows

**It is a KVM virtual machine with its own kernel — not a shared-kernel container and not gVisor. Whether it runs on Firecracker is simply not documented.**

- "Every boxd machine is a KVM microVM with its own kernel, network stack, and disk." — [use-cases/sandboxes](https://docs.boxd.sh/use-cases/sandboxes) · `docs-confirmed`
- "Every machine is a KVM virtual machine with its own Linux kernel — not container namespaces, not gVisor, not a shared host kernel. A CVE on one VM's kernel doesn't breach the host or its neighbours." — [boxd.sh/faq](https://boxd.sh/faq/) · `docs-confirmed` (vendor FAQ; same claim in docs)
- The orchestrator underneath is open source: "boxd is built on Ignition, an open-source microVM orchestrator that laid the foundation for what boxd is now." — [guides/suspend-resume](https://docs.boxd.sh/guides/suspend-resume) · `docs-confirmed`; repo `github.com/lttle-cloud/ignition`.
- "The hypervisor boundary is the same one your laptop uses to run VMs." — [use-cases/sandboxes](https://docs.boxd.sh/use-cases/sandboxes) · `docs-confirmed`
- **Firecracker use is not documented.** The word appears nowhere in the docs corpus, FAQ, pricing page or proto I checked · `not-published`. That is not evidence against it: Firecracker is itself a KVM-based microVM monitor, so a "KVM microVM" claim is compatible with Firecracker underneath. What boxd does commit to is the boundary: "Every machine is a KVM virtual machine with its own Linux kernel — not container namespaces, not gVisor, not a shared host kernel." — [boxd.sh/faq](https://boxd.sh/faq/) · `docs-confirmed`. Battleships classifies the isolation as "full VM (own kernel)" without naming a monitor — [battleships.dev](https://battleships.dev/data/providers/boxd.md) · `third-party` (its feature list reads "gVisor or VM (no shared kernel)").

**What that permits inside the guest** — unusually permissive for a sandbox product (`inferred` from the quotes below):

- "Code in the sandbox can run Docker, load kernel modules, restart `systemd`, edit `/etc`, open ports, and break the OS completely, and the damage stays inside that one machine." — [use-cases/sandboxes](https://docs.boxd.sh/use-cases/sandboxes) · `docs-confirmed`
- Docker is preinstalled and running: "Docker Engine, Compose, and Buildx come pre-installed on every machine, with the daemon already running." — [guides/run-docker](https://docs.boxd.sh/guides/run-docker) · `docs-confirmed`
- "Every boxd machine ships with **Docker Engine**, the **Compose plugin**, and **Buildx** pre-installed." and "Containers, networks, volumes, and builds all behave normally, on the machine's own kernel rather than inside another container." — [guides/run-docker](https://docs.boxd.sh/guides/run-docker) · `docs-confirmed`
- Root: "You get a normal shell on the machine, as the `boxd` user with passwordless sudo." — [quickstart](https://docs.boxd.sh/quickstart) · `docs-confirmed`

**What it forbids / does not offer**

- Nested virtualisation: `not-published` in boxd's docs; battleships records it as "No" — [battleships.dev](https://battleships.dev/data/providers/boxd.md) · `third-party`.
- Reaching your other machines from a sandbox: blocked by an explicit flag (see §12, *isolated*). "A sandbox created with `--isolated` is cut off from all of that from birth." — [use-cases/sandboxes](https://docs.boxd.sh/use-cases/sandboxes) · `docs-confirmed`
- No shared kernel means no cross-tenant kernel attack surface — "A CVE on one VM's kernel doesn't breach the host or its neighbours." [boxd.sh/faq](https://boxd.sh/faq/) · `docs-confirmed`. The corollary that memory is per-VM and therefore billed rather than shared is `inferred` from "Every machine is a KVM virtual machine with its own Linux kernel" plus the resident-memory meter in §10.

**Practical reading for a non-specialist** (`inferred` from the quotes above): this behaves like *a small server of your own*, not like *a jailed process*. Anything you could do on a Linux box — install a database, run Docker, break the bootloader — you can do here, and it stays inside that one machine.

---

## 3. Lifecycle: every state, what survives, and the timers

**Four states, and the CLI/API use different words for one of them.**

| State | Memory | Wake time | Billed for | Source |
|---|---|---|---|---|
| running | "Live in RAM" | "Already running" | "vCPU, memory in use, disk written" | [guides/suspend-resume](https://docs.boxd.sh/guides/suspend-resume) · `docs-confirmed` |
| standby | "Kept in RAM" | "Sub-millisecond" | "Memory in use, disk written" | same page · `docs-confirmed` |
| hibernated | "Written to disk" | "About 85ms" | "Disk written" | same page · `docs-confirmed` |
| stopped | not kept | a fresh boot | "Disk written" | [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed` |

- "A machine moves between these states on its own, based on network traffic." — [guides/suspend-resume](https://docs.boxd.sh/guides/suspend-resume) · `docs-confirmed`
- **The naming trap, now stated by boxd itself:** "The CLI prints `standby`. The API and the SDKs return `suspended` for the same state." — same page · `docs-confirmed`
- Stopped is a manual state: "A fourth state, `stopped`, is a machine you shut down with `boxd machine stop`. It keeps its disk and loses its memory and running processes, and `boxd machine start` boots it again." — same page · `docs-confirmed`
- Destroy: "`boxd machine remove myapp -y # destroy (requires -y or --confirm; alias: rm)`" — [cli/commands](https://docs.boxd.sh/cli/commands) · `docs-confirmed`; "Deleting a machine removes its checkpoints too, so cleanup is automatic and billing ends with the machine." — [guides/checkpoints](https://docs.boxd.sh/guides/checkpoints) · `docs-confirmed`

**What survives what**

| Action | Disk | Processes / memory | Identity | Evidence |
|---|---|---|---|---|
| pause → standby | yes | yes, frozen | yes | "They freeze the VMM process and keep memory, running processes, and open sockets intact." — [cli/commands](https://docs.boxd.sh/cli/commands) · `docs-confirmed` |
| hibernate → wake | yes | yes, restored from the memory image | yes | "Waking from hibernation takes **about 85ms** and loads the memory image back into RAM." — [guides/suspend-resume](https://docs.boxd.sh/guides/suspend-resume) · `docs-confirmed` |
| stop → start | yes | no | yes | "It keeps its disk and loses its memory and running processes" — same page · `docs-confirmed` |
| reboot | yes | no | yes | the pause-vs-reboot table lists Memory as "Preserved" vs "Lost", and "Use `reboot` when you need a cold kernel or config restart." — same page · `docs-confirmed` |
| checkpoint restore | rewound | rewound | yes | "The machine keeps its name, HTTPS domain, SSH port, and IP." — [guides/checkpoints](https://docs.boxd.sh/guides/checkpoints) · `docs-confirmed` |
| snapshot → new machine | copied | copied | new name/URL/SSH port | "Each machine gets its own name, URL, and SSH port, and comes up exactly where the snapshot was taken." — [guides/snapshots](https://docs.boxd.sh/guides/snapshots) · `docs-confirmed` |
| destroy | gone | gone | gone | "Deleting a machine removes its checkpoints too" — [guides/checkpoints](https://docs.boxd.sh/guides/checkpoints) · `docs-confirmed` |

**Idle auto-stop.** Two timers. Both count network traffic *in both directions* — this changed from the earlier docs, which counted inbound only:

- "The idle timers count TCP/UDP traffic in both directions, so outbound traffic (polling an API, downloading packages, calling an LLM) keeps a machine awake just as an incoming request does." — [guides/suspend-resume](https://docs.boxd.sh/guides/suspend-resume) · `docs-confirmed`
- Auto-suspend: "**Off by default.** When enabled, a machine goes to standby after N seconds without TCP/UDP traffic in either direction. Memory, running processes, and open sockets are all preserved." — same page · `docs-confirmed`
- Auto-hibernate: "**On by default, set to 4 hours.** After 4 hours without TCP/UDP traffic in either direction, boxd hibernates the machine: a memory image is written to disk and its memory is released." — same page · `docs-confirmed`
- "With the defaults a machine goes straight from running to hibernated, without passing through standby." — same page · `docs-confirmed`
- The CPU trap survives: "**The idle timers watch network traffic, not CPU.** A long training run, batch job, file encode, or cron-driven task that doesn't touch the network looks idle." — same page · `docs-confirmed`
- "Clocks also stop while a machine is asleep, so cron and systemd timers won't fire until the next inbound packet arrives." — same page · `docs-confirmed`
- Both timers are per machine and settable to `0`: "`boxd machine config set myapp auto-hibernate.timeout 0 # never hibernate this machine`" — same page · `docs-confirmed`
- Waking: "Waking a sleeping machine takes an inbound connection." — same page · `docs-confirmed`

**Max session length / TTL.**

- "Runtime | Unlimited" — [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed`. No maximum session, no forced expiry, no published TTL cap · `not-published`.
- The SDK exposes `autoDestroyTimeout` — `auto_destroy_timeout=0` in the create call — [reference/python-sdk](https://docs.boxd.sh/reference/python-sdk) · `docs-confirmed` (field exists; semantics beyond the name `not-published`).
- Scheduled deletion is now documented: "A delete-after timer permanently deletes a machine at a set time." and "boxd enforces the timer, not the machine. It fires whatever state the machine is in" — [guides/delete-after](https://docs.boxd.sh/guides/delete-after) · `docs-confirmed`.

**Published start/resume times**

| Transition | Claim | Source |
|---|---|---|
| Cold boot (new machine) | "Under 10ms"; example shows `"boot": "6ms"` | [docs index](https://docs.boxd.sh/), [guides/snapshots](https://docs.boxd.sh/guides/snapshots) · `docs-confirmed` |
| Boot from snapshot | `"boot": "6ms"` | [guides/snapshots](https://docs.boxd.sh/guides/snapshots) · `docs-confirmed` |
| Fork | "up in under 200ms"; example `"boot": "160ms"` | [guides/fork](https://docs.boxd.sh/guides/fork) · `docs-confirmed` |
| Resume from standby | "Sub-millisecond"; example `"resume_us":840` | [guides/suspend-resume](https://docs.boxd.sh/guides/suspend-resume) · `docs-confirmed` |
| Wake from hibernate | "About 85ms" | same page · `docs-confirmed` |
| Reboot | "About 2 seconds" | the pause-vs-reboot table, same page · `docs-confirmed` |

No independent benchmark of these numbers exists: battleships states "No benchmark data for boxd in benchmarks.json" — [battleships.dev](https://battleships.dev/data/providers/boxd.md) · `third-party`.

## 4. State tools: snapshots, checkpoints, backups, forks, images, disks

boxd has **four** state tools plus a copy operation and standalone disks. This is the part of the product most likely to be misread by someone coming from another sandbox provider, because three of the four are usually called "snapshot" elsewhere.

**Snapshot — memory + disk, named, reusable, outlives the machine.**
- "A snapshot is a saved copy of a specific machine. It captures the disk and the memory, so a machine created from the snapshot is already running whatever the source machine was running when the snapshot was saved." — [guides/snapshots](https://docs.boxd.sh/guides/snapshots) · `docs-confirmed`
- "The machine has to be `running` when you save." — same page · `docs-confirmed`
- "A machine created from a snapshot resumes in the state you captured. Nothing boots." — same page · `docs-confirmed`
- Versioned by name: saving over a name captures a new version and the older one is retired — same page · `docs-confirmed`; the exact sentence is "the older version is cleaned up" · `not-published` (that phrasing is no longer on the live page, so the versioning behaviour rests on the page's "Saving again makes a new version" section).
- Storage price: `not-published` (see §10).
- New machines get "its own name, URL, and SSH port" — same page · `docs-confirmed`.

**Checkpoint — memory + disk, in place, private to one machine, dies with it.**
- "A checkpoint is a save point for a single machine: its full **memory and disk** captured at a moment in time. It stays on the machine, and you restore it **in place**, rolling that same machine back to exactly the captured state." — [guides/checkpoints](https://docs.boxd.sh/guides/checkpoints) · `docs-confirmed`
- "Checkpoints | 10 per machine" — [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed`
- "Deleting a machine removes its checkpoints too, so cleanup is automatic and billing ends with the machine." — [guides/checkpoints](https://docs.boxd.sh/guides/checkpoints) · `docs-confirmed`
- Restore discards later writes: "The machine keeps its name, HTTPS domain, SSH port, and IP." — same page · `docs-confirmed`, and it is a reboot into the captured state · `docs-confirmed`.

**Backup — disk only, off-cluster object storage, for disaster recovery.**
- "Backups protect the data **on** a machine: a bad migration, a deleted database, corruption you only notice a day later." — [guides/disaster-recovery](https://docs.boxd.sh/guides/disaster-recovery) · `docs-confirmed`
- "boxd uploads the machine's disk to object storage for you, off the cluster that runs the machine." — same page · `docs-confirmed`
- "Memory and running state are not part of a backup" — same page · `docs-confirmed`
- Schedule floor: "down to one backup every 15 minutes" — same page · `docs-confirmed`. Default retention 7 days. Price `not-published`.

**Fork — a live copy, memory and disk, no pause required.**
- "A fork is a copy of a machine, the source machine. The copy includes the disk, **the memory, and every running process**, and carries on with its own name, URL, and ports from that point onwards." — [guides/fork](https://docs.boxd.sh/guides/fork) · `docs-confirmed`
- "It shares the source machine's disk and memory through copy-on-write, so the new machine is up in under 200ms." — same page · `docs-confirmed`
- "A running source machine pauses for a fraction of a second to hand its live memory to the copy, then carries on." — same page · `docs-confirmed`
- "A fork keeps the source machine's size." — same page · `docs-confirmed`
- **Automations are the exception to everything carrying over:** "the fork inherits them **paused**" — same page · `docs-confirmed`.

**Templates / images.**
- Machines boot from a container image reference — `image="ubuntu:24.04"` in the create call — [reference/python-sdk](https://docs.boxd.sh/reference/python-sdk) · `docs-confirmed`.
- There is no public template catalogue. An earlier version of the proto comment said templates were operator-managed and that there was no public API to create, list or delete them; that comment is **no longer on the live proto page** (checked 28 Oct 2026) · `not-published`. No template list, create, or create-from-template command appears in the CLI reference either · `not-published`.
- Custom base images: the FAQ used to say boxd would set one up with you; that answer is no longer on the live page (checked 28 Oct 2026), and no current page documents a bring-your-own base image · `not-published`. Machines do take an `image` ref (`image="ubuntu:24.04"`) — [reference/python-sdk](https://docs.boxd.sh/reference/python-sdk) · `docs-confirmed`.
- In practice **snapshots are the image mechanism**: "Install your app on one machine, snapshot it, and keep the snapshot fresh on every push to main." — [guides/golden-image](https://docs.boxd.sh/guides/golden-image) · `docs-confirmed`

**Disks — standalone storage that outlives the machine.**
- "A disk is standalone storage that outlives the machine it is attached to." — [guides/disks](https://docs.boxd.sh/guides/disks) · `docs-confirmed`
- Created and attached by name and size: `boxd disks new data --size 10G`, `boxd disks attach data myapp --mount-path /mnt/data` — same page · `docs-confirmed`.
- "One attachment at a time." — same page · `docs-confirmed`
- "A machine created from a snapshot cannot take a disk at creation, since it is rebuilt from exactly what was captured." — same page · `docs-confirmed`
- Host affinity is the catch: "A disk lives on one host, and a machine can only mount a disk on the host it runs on." — same page · `docs-confirmed`
- Price: `not-published`; the page documents sizes only by example (`10G`) with no size list.

## 5. Machine sizes, GPU, architecture, regions

**Four sizes, chosen by naming either dimension.**

| vCPUs | Memory | Note |
|---|---|---|
| 1 | 4 GiB | |
| 2 | 8 GiB | "the default" |
| 4 | 16 GiB | |
| 8 | 32 GiB | |

— [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed`

- "Naming either dimension picks the size, so `--vcpu 1` means 1 vCPU with 4 GiB." — same page · `docs-confirmed`
- Disk is not a size choice: "Disk | 100 GB, fixed (copy-on-write)" — same page · `docs-confirmed`.
- Per-machine ceiling: "This is the largest size a single machine may have, 8 vCPU / 32 GiB unless the boxd team raised it for your org." — [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed`
- **Contradiction:** the homepage says 8 vCPU is not self-serve — "Machines come in 1 vCPU / 4 GiB, 2 vCPU / 8 GiB (the default) and 4 vCPU / 16 GiB… For 8 vCPU / 32 GiB or larger, email contact@boxd.sh." — [boxd.sh](https://boxd.sh/) · `docs-confirmed`. The docs table lists 8 vCPU as a size you can name — "8 | 32 GiB" — [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed` — and the pricing calculator offers an 8 vCPU / 32 GiB button — [pricing](https://boxd.sh/pricing) · `pricing-page`. Unresolved; see §14.
- Resize exists and reboots: "A running machine reboots to apply it, so its disk persists and running processes are lost." — [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed`

**GPU:** none. GPU appears nowhere as a product feature; the only mention in the entire docs corpus is a use-case sentence about "keeps your GPUs busy" in an RL example, which refers to the customer's own hardware — [use-cases/reproducible-rl-environments](https://docs.boxd.sh/use-cases/reproducible-rl-environments) · `not-published` (no GPU shape, price, or availability). Battleships records GPU as "No" — [battleships.dev](https://battleships.dev/data/providers/boxd.md) · `third-party`.

**CPU architecture:** guests run Ubuntu 24.04 on boxd's own x86-64 hosts — "a real KVM virtual machine running Ubuntu 24.04" — [boxd.sh/faq](https://boxd.sh/faq/) · `docs-confirmed`. Guest architecture is not stated anywhere (`not-published`; x86-64 is `inferred` from the Ubuntu image and the x86-only `x86_64` install paths in the CLI docs). No ARM guest option is published; battleships lists "arm64" under its No features · `third-party`. The *CLI* runs on "macOS (Apple Silicon) and Linux" (x86_64 and arm64) — [cli/installation](https://docs.boxd.sh/cli/installation) · `docs-confirmed` — which is about your laptop, not the machines.

**Regions:** one, in Europe.

- "On bare-metal servers in Germany, so your machines and their data stay in the EU. A US region is coming." — [boxd.sh](https://boxd.sh/) · `docs-confirmed`
- "In the EU by default, on European hardware, with no US cloud dependency. Data stays in Europe." — [boxd.sh/faq](https://boxd.sh/faq/) · `docs-confirmed`
- "All inter-node control traffic runs over a private OVH vRack — workers have no public IP." — [boxd.sh/faq](https://boxd.sh/faq/) · `docs-confirmed` (the only public mention of the underlying host provider)
- US: "Europe is open. We're opening a cluster in the US." — [boxd.sh/us-waitlist](https://boxd.sh/us-waitlist/) · `docs-confirmed`
- Self-hosting is the region story: "a single Rust binary you run in your own VPC, datacenter, or country" — [pricing](https://boxd.sh/pricing) · `pricing-page`

---

## 6. Networking

**Inbound — every machine gets a public HTTPS name, with a bot check in front of sleeping machines and no authentication in front of running ones.**

- "Every machine gets a domain at `.boxd.sh`. The boxd proxy terminates TLS and forwards HTTP requests to your machine." — [guides/https](https://docs.boxd.sh/guides/https) · `docs-confirmed`
- Default target port: "the port your app listens on (8000 if none is detected)" — same page · `docs-confirmed`.
- Subdomain proxies per port: "As many subdomain proxies as you want" — [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed`.
- **The URLs are public.** "The machine's `https://.boxd.sh` URL is already public to the internet." — [guides/share-a-vm](https://docs.boxd.sh/guides/share-a-vm) · `docs-confirmed`. No authentication, token, or IP allowlist for the URL itself is documented · `not-published`.
- **Bot protection is on by default and is a gate, not auth.** "When a request would wake a sleeping machine, boxd first asks the visitor to pass a quick browser check." and "**On by default** for every machine." — [guides/bot-protection](https://docs.boxd.sh/guides/bot-protection) · `docs-confirmed`. The consequence for automation: "A webhook sender, API client, `curl` or uptime monitor that hits a sleeping machine gets the check page with a `503` instead of your app, and the machine doesn't wake." — same page · `docs-confirmed`. It applies only to the machine's main address, never to subdomain proxies or single-machine custom domains — same page · `docs-confirmed`.
- Custom domains, self-serve: "Point one domain you own at a single machine" or "Delegate a wildcard subdomain to your whole organization"; "boxd verifies your DNS and issues TLS certificates automatically." — [guides/custom-domains](https://docs.boxd.sh/guides/custom-domains) · `docs-confirmed`.
- WebSockets pass through: "The proxy detects the `Upgrade: websocket` header and forwards the connection." — [guides/https](https://docs.boxd.sh/guides/https) · `docs-confirmed`.
- Raw TCP/UDP: "The public port is allocated for you from the **40000 to 60000** range." — [guides/port-forwarding](https://docs.boxd.sh/guides/port-forwarding) · `docs-confirmed`; "Raw TCP/UDP port forwards | 3" — [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed`.
- SSH: "a dedicated SSH port on boxd's shared proxy IP" — [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed`.
- **No dedicated public IPv4.** "Every machine's domain points at the proxy's shared public IP." — [guides/https](https://docs.boxd.sh/guides/https) · `docs-confirmed`. This contradicts boxd's own FAQ — see §14.

**Outbound — open by default, restrictable per machine.**

- "A machine starts unrestricted. Give it an allowlist and it can reach only the hostnames, wildcards, IPv4 addresses and ranges on it" — [guides/egress](https://docs.boxd.sh/guides/egress) · `docs-confirmed`
- "An allowlist of just `none` cuts the machine off from the internet entirely. DNS follows the allowlist: a lookup of a name the machine may not reach is refused, so it can't carry data out either." — same page · `docs-confirmed`
- "A change takes effect within a second on a running machine, without a restart." — same page · `docs-confirmed`
- Enforcement is outside the guest: "Both are set from outside the machine and enforced outside it, so nothing running inside (root included) can loosen them" — same page · `docs-confirmed`
- Entry rules now live on a separate page: "Entries are bare hosts and addresses, without a scheme, port, or path. An allowlist holds at most 256 entries." — [guides/egress-allowlist](https://docs.boxd.sh/guides/egress-allowlist) · `docs-confirmed`; "IPv6 is refused too, because machines have no IPv6 egress." — same page · `docs-confirmed`.
- Static egress IP: `not-published`. No boxd page mentions a dedicated or static outbound address. Battleships lists "static egress IP" among its Yes features — [battleships.dev](https://battleships.dev/data/providers/boxd.md) · `third-party`; I could not confirm it (see §14).
- Egress price/allowance: `not-published` (see §10).

**Secret and credential injection.**

- Two mechanisms. Plain env vars and sealed secrets: "Set an environment variable or a secret **once** for your organization, and boxd injects it into the machines in the var's scope." — [guides/env-secrets](https://docs.boxd.sh/guides/env-secrets) · `docs-confirmed`
- Values arrive "in login shells, in the environment your `boxd machine exec` commands and coding agents run in, and in services your machine starts at boot" — same page · `docs-confirmed`.
- Host-bound secrets, where the machine never holds the value: "The machine only ever holds a placeholder, and the real value is inserted into HTTPS requests on their way out, only to the hosts you name." — [guides/egress](https://docs.boxd.sh/guides/egress) · `docs-confirmed`
- Inside the guest: "Inside the machine `STRIPE_KEY` is an opaque string starting with `bxds_`." — same page · `docs-confirmed`
- Scope per secret: `shared` (the default, org shared machines), `private`, `all` — [guides/env-secrets](https://docs.boxd.sh/guides/env-secrets) · `docs-confirmed`.
- Isolated machines get account-level vars "in `exec` and SSH sessions only, never at boot" — same page · `docs-confirmed`.

**Private networking between your own machines.**

- "A machine you own can create and drive other machines. Every machine ships with an in-machine `boxd` CLI, and from inside a machine it authenticates automatically, with nothing to configure first." — [guides/vm-to-vm](https://docs.boxd.sh/guides/vm-to-vm) · `docs-confirmed`
- Named networks narrow reachability; changes apply "in real time, without a reboot" — [use-cases/sandboxes](https://docs.boxd.sh/use-cases/sandboxes) · `docs-confirmed`.
- Tailscale and NetBird put machines on a private network of your own — [guides/tailscale](https://docs.boxd.sh/guides/tailscale), [guides/netbird](https://docs.boxd.sh/guides/netbird) · `docs-confirmed`; traffic over either is exempt from bot protection — [guides/bot-protection](https://docs.boxd.sh/guides/bot-protection) · `docs-confirmed`.

## 7. Interfaces

| Interface | Status | Evidence |
|---|---|---|
| **REST API** | **None.** | Docs offer "Raw gRPC access to the boxd public API, for any language with a protoc plugin." and never describe an HTTP/JSON endpoint — [reference/grpc-api](https://docs.boxd.sh/reference/grpc-api) · `docs-confirmed`; the absence of a REST surface is `inferred` from that, and stated outright in our internal notes — [using-boxd-api skill](../../.agents/skills/using-boxd-api/SKILL.md) · `third-party` |
| **gRPC API** | Yes, the only wire API | "Service. `boxd.api.v1.BoxdApi`." and "Server reflection is on" — [reference/grpc-api](https://docs.boxd.sh/reference/grpc-api) · `docs-confirmed` |
| **TypeScript SDK** | Yes | "The `@boxd-sh/sdk` package… Promise-only, ESM-only. Runs on Node 20+, Bun, and Deno." — [reference/typescript-sdk](https://docs.boxd.sh/reference/typescript-sdk) · `docs-confirmed` |
| **Python SDK** | Yes, sync and async | "Programmatic access to boxd machines from Python, sync and async" — [reference/python-sdk](https://docs.boxd.sh/reference/python-sdk) · `docs-confirmed` |
| **CLI** | Yes, the primary surface | "The boxd CLI manages machines from your local terminal." — [cli/installation](https://docs.boxd.sh/cli/installation) · `docs-confirmed`; also a pre-authenticated CLI inside every VM |
| **MCP server** | **No boxd control MCP server published** | `not-published`; the only MCP in docs is a `chrome-devtools` MCP registered for coding agents — [guides/client-utilities](https://docs.boxd.sh/guides/client-utilities) · `docs-confirmed`. Homepage says "The MCP server installs straight into Claude Code, Codex or opencode" under Integrations — [boxd.sh](https://boxd.sh/) · `docs-confirmed` (ambiguous; see §14) |
| **SSH** | Yes, real SSH on a dedicated port | "It is real SSH, so `scp`, `rsync`, `ssh -L` and your editor's Remote-SSH all work too." — [quickstart](https://docs.boxd.sh/quickstart) · `docs-confirmed` |
| **Web terminal** | Yes, via the console | "a console terminal" is named as a session type — [guides/client-utilities](https://docs.boxd.sh/guides/client-utilities) · `docs-confirmed`; the desktop also has a Terminal app |
| **Desktop / VNC-like view** | Yes, browser-based | "Every machine has a display. Desktop opens it in a separate browser window: a real desktop you can watch and control" — [guides/desktop](https://docs.boxd.sh/guides/desktop) · `docs-confirmed` |
| **Browser automation** | Yes, preinstalled | "Every machine ships `agent-browser`, a browser-automation CLI built for agents, backed by a Chromium build with anti-bot fingerprinting." — [guides/launch-a-browser](https://docs.boxd.sh/guides/launch-a-browser) · `docs-confirmed` |
| **Machine specs** | Yes, declarative machines in code | "A machine spec describes a machine in one value: what it boots from, its size, labels, networks, isolation, egress allowlist, env vars, the secrets it gets, the integrations and agent logins it needs, and the shell commands it runs on its first boot." — [guides/machine-specs](https://docs.boxd.sh/guides/machine-specs) · `docs-confirmed` |
| **Webhooks** | **No general webhook product** | `not-published`. The only webhook surface is inbound GitHub App events consumed by automation scripts: "`githubApp.on("pull_request.opened", { repo: "acme/widgets" }, handler)` subscribes to typed webhook events" — [guides/automations/scripts](https://docs.boxd.sh/guides/automations/scripts) · `docs-confirmed`. No feature that calls a URL you supply when a machine changes state (`not-published`). Battleships also records webhooks as "No" · `third-party` |

Console: a web app at `boxd.sh/app`, referenced throughout the docs (Machines page, Backups tab, Domains page, console terminal) — see §15 for the quotes · `docs-confirmed`.

---

## 8. Agent features

**Preinstalled coding agents, already configured for the platform.**

- "Every boxd machine ships with three coding agents: **Claude Code** (`claude`), **Codex** (`codex`), and **OpenCode** (`opencode`)." — [use-cases/coding-agents](https://docs.boxd.sh/use-cases/coding-agents) · `docs-confirmed`
- "Each machine carries an instructions file that every agent reads through its own convention: `~/.claude/CLAUDE.md`… It tells the agent about the environment: the in-VM `boxd` CLI, the default proxy on port 8000, and how to create sibling machines" — same page · `docs-confirmed`
- "The in-VM `boxd` CLI is pre-authenticated ([how](/guides/vm-to-vm)), so any of the three agents can create machines, exec into them, and expose ports without a token or key setup." — same page · `docs-confirmed`

**Agent credential handling** — three different models, worth separating in an explainer:

| Agent | Login model | Quote |
|---|---|---|
| Claude Code | Account-level, injected at boot | "Sign in once on any machine, and every machine you touch afterwards already has you logged in… The credential is stored encrypted on your account and injected at boot" |
| Codex | Per machine, on disk | "need a one-time `codex` / `opencode` login per machine. The login persists on the machine's disk and carries into its forks" |
| OpenCode | Per machine | same sentence as Codex |

— all [use-cases/coding-agents](https://docs.boxd.sh/use-cases/coding-agents) · `docs-confirmed`

- API keys instead of subscriptions: "Set `ANTHROPIC_API_KEY`… as an env var or secret and the same binaries use it." — same page · `docs-confirmed`
- Sharing a machine wipes personal agent logins: "Sharing a machine wipes the agent logins on it the moment it goes shared" — [guides/share-a-vm](https://docs.boxd.sh/guides/share-a-vm) · `docs-confirmed`

**Agent-run APIs.** No hosted agent loop of boxd's own is published (`not-published`; battleships lists "hosted agent API (their own agent)" under its No features · `third-party`). Instead boxd positions machines as the execution half of other vendors' managed agents:

- Claude Managed Agents: "Anthropic runs the agent loop. Every tool call runs inside a boxd machine you control." — [use-cases/claude-managed-agents](https://docs.boxd.sh/use-cases/claude-managed-agents) · `docs-confirmed`
- OpenAI Agents API: "OpenAI runs the Codex harness. Every command runs inside a boxd machine you control." — [use-cases/openai-agents-api](https://docs.boxd.sh/use-cases/openai-agents-api) · `docs-confirmed`
- Both pages are written against beta vendor APIs — `AGENT_ID=$(ant beta:agents create < agent.yaml --transform id -r)` — [use-cases/claude-managed-agents](https://docs.boxd.sh/use-cases/claude-managed-agents) · `docs-confirmed`; `type: self_hosted` — [use-cases/openai-agents-api](https://docs.boxd.sh/use-cases/openai-agents-api) · `docs-confirmed`. Treat availability as dependent on those vendors (`inferred`).
- Hosted agent API of boxd's own: `not-published`; battleships lists "hosted agent API (their own agent)" under its No features · `third-party`.

**Automations as an agent-adjacent feature.** A `*.run.ts` file on a machine can register triggers and schedules; boxd wakes the machine, delivers events, retries failures, and shows each run in the console — [guides/automations/jobs](https://docs.boxd.sh/guides/automations/jobs) · `docs-confirmed`. Note the interaction with idle timers: "A sleeping machine's own clock is frozen, so a timer inside it would never fire." — [guides/delete-after](https://docs.boxd.sh/guides/delete-after) · `docs-confirmed`.

**Agent-oriented distribution.** boxd ships a skill for coding agents: "The boxd installer offers one skill for your laptop, **`boxd-cli`**. It teaches the agent how to drive the boxd CLI." — [reference/skills](https://docs.boxd.sh/reference/skills) · `docs-confirmed`; the docs themselves publish `llms.txt` and per-page `.md` for machine reading — [docs index](https://docs.boxd.sh/) · `docs-confirmed`.

---

## 9. Accounts, orgs, keys, controls

**Every account is an org.**
- "Every account is an organization. Invite your team, share machines, and draw from one credit balance." — [pricing](https://boxd.sh/pricing) · `pricing-page`
- "An org has three roles: **owner**, **admin**, and **member**." — [cli/commands](https://docs.boxd.sh/cli/commands) · `docs-confirmed`
- Billing model inside an org: "creates a machine **billed to the org but private to you**. Add `--shared` to make it visible to the whole org" — same page · `docs-confirmed`

**API keys.**
- Fenced to one org: "Every key is fenced to **one organization** and never grants account-wide access." — [cli/authentication](https://docs.boxd.sh/cli/authentication) · `docs-confirmed`
- Two kinds: "`--kind member` (the default) acts as you within that org. `--kind org` is a userless service credential limited to the org's shared machines" — same page · `docs-confirmed`
- Optional expiry (`--expires-in-secs`), shown once, revocable; "API keys | 25 per user" — [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed`
- No published scope/permission system beyond member vs org kind, and no per-key resource restrictions — `not-published`.

**Quotas and caps.**

| Limit | Value | Source |
|---|---|---|
| Machines per org | 50 (docs, FAQ) / 100 (pricing page) — **contradiction** | [guides/resources](https://docs.boxd.sh/guides/resources), [pricing](https://boxd.sh/pricing) |
| Machines without a payment method | 2 | "An org without a payment method is capped at 2 machines" — [guides/resources](https://docs.boxd.sh/guides/resources) |
| Hibernated/stopped machines | count toward the cap | "Every machine counts toward the cap, hibernated and stopped ones included." — same page |
| API keys | 25 per user | same page |
| Custom domains | 25 per user | same page |
| Checkpoints | 10 per machine | "Checkpoints \| 10 per machine" — [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed` |
| Raw TCP/UDP forwards | 3 per machine | "Raw TCP/UDP port forwards \| 3" — [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed` |
| Egress allowlist entries | 256 per machine | "An allowlist holds at most 256 entries." — [guides/egress-allowlist](https://docs.boxd.sh/guides/egress-allowlist) · `docs-confirmed` |

**Spend limits / budgets:** `not-published`. No budget, cap, or alert feature appears in docs, pricing, FAQ, CLI reference, or the proto. The only spend control is auto top-up: "auto top-up adds $20 at a time from that card… You can change the amount or switch it off under Billing." — [pricing](https://boxd.sh/pricing) · `pricing-page`. What happens at zero balance with auto top-up off is `not-published`.

**Audit.** No general audit log is documented for the self-serve tier; the FAQ's answer is SSH-based: "Every command lands over SSH, which gives a built-in audit trail." — [boxd.sh/faq](https://boxd.sh/faq/) · `docs-confirmed`. Real audit logs are a Custom/Enterprise line item: "SSO + audit logs" — [pricing](https://boxd.sh/pricing) · `pricing-page`.

**SSO.** "SAML SSO is available on Enterprise — talk to us." — [boxd.sh/faq](https://boxd.sh/faq/) · `docs-confirmed`. Not self-serve, price `not-published`.

**Data residency.** EU by default, on German bare metal; self-host to pin elsewhere (§5). "Does boxd offer EU data residency? Yes." — [boxd.sh/faq](https://boxd.sh/faq/) · `docs-confirmed`.

**Compliance certifications.** SOC 2 and HIPAA are not claimed anywhere I looked (`not-published`); battleships lists "SOC 2" and "HIPAA" under its No features — [battleships.dev](https://battleships.dev/data/providers/boxd.md) · `third-party`. The self-host pitch leans on customer compliance instead: "It works for a two-person startup as well as for a bank's DORA / NIS2 review." — [pricing](https://boxd.sh/pricing) · `pricing-page`.

---

## 10. Pricing, exactly

### The meter

Three resources, each metered on a different basis. This is the single most important thing to explain correctly, because two of the three are billed on *usage* rather than *size*.

| Resource | Rate (USD list) | Rate (EUR list) | Billed on | When |
|---|---|---|---|---|
| vCPU | **$0.047 / vCPU-hour** | **€0.039 / vCPU-hour** | "on the machine's size" | only while running |
| RAM | **$0.014 / GiB-hour** | **€0.012 / GiB-hour** | "in use, not the 8 GiB provisioned" | running **or standby** |
| Disk | **$0.000096 / GiB-hour** | **€0.00008 / GiB-hour** | "written to, not the 100 GiB provisioned" | every state |

Each rate line, verbatim from the rendered page (USD toggle):
- "$0.047 / vCPU-hour, on the machine's size, only while it runs."
- "$0.014 / GiB-hour in use, not the 8 GiB provisioned."
- "$0.000096 / GiB-hour written to, not the 100 GiB provisioned."

— [boxd.sh/pricing](https://boxd.sh/pricing), USD toggle, 28 Oct 2026 · `pricing-page`. EUR toggle, same page and date: "€0.039 / vCPU-hour, on the machine's size, only while it runs." · "€0.012 / GiB-hour in use, not the 8 GiB provisioned." · "€0.00008 / GiB-hour written to, not the 100 GiB provisioned." · `pricing-page`

- "vCPU is the one component billed on the machine's size: its full vCPU count while it runs, nothing in standby, hibernated or stopped." — [pricing FAQ](https://boxd.sh/pricing) · `pricing-page`
- "RAM bills on the memory a machine actually has resident, sampled every second, while it is running or in standby" — same page · `pricing-page`
- "Disk bills on the disk you have written to, in every state" — same page · `pricing-page`

**Granularity and rounding.** "Usage is metered every second and settled every 15 minutes: each settlement adds up your organization's vCPU, RAM and disk for that window and charges each of the three rounded up to the next millionth of your currency" — [pricing FAQ](https://boxd.sh/pricing) · `pricing-page`. So: per-second metering, 15-minute settlement windows, sub-cent rounding, "There is no minimum charge per machine" — same page.

**Currency.** Two published lists behind a toggle: EUR and USD, with the USD list about 1.2× the EUR list on every line ($0.047/€0.039 = 1.205; $0.014/€0.012 = 1.167; $0.000096/€0.00008 = 1.2). "Prices exclude VAT." — [pricing](https://boxd.sh/pricing) · `pricing-page`. Which list you get appears fixed per organization — battleships records it as "Currency is fixed per organization at creation" — [battleships.dev](https://battleships.dev/data/providers/boxd.md) · `third-party`.

**What each state costs, in words**

- **Running:** all three meters.
- **Standby (paused, memory held in RAM):** no vCPU, but RAM *is* billed. "a machine in standby pays for RAM and disk" — [pricing FAQ](https://boxd.sh/pricing) · `pricing-page`.
- **Hibernated (memory written to disk):** disk only. "A hibernated machine writes memory to disk and bills disk only." — same page · `pricing-page`.
- **Stopped:** disk only.
- **Deleted:** nothing; snapshots/backups are separate storage that is `not-published` in price.

**Free tier / credits.** "€30 of credits when you add a payment method. Nothing is charged when you add the card" (USD: $30) — [pricing FAQ](https://boxd.sh/pricing) · `pricing-page`. There is no free plan: without a card you are capped at 2 machines, and the credit requires the card. Note the homepage's looser phrasing, "Every new account starts with €30 of free credits" — [boxd.sh](https://boxd.sh/) · `docs-confirmed` — which omits the card requirement.

**Plans / subscriptions.** "There is no monthly plan and no per-seat fee." — [pricing FAQ](https://boxd.sh/pricing) · `pricing-page`. Custom is a contract with unpublished pricing; self-host is "annual license" with no published price — [pricing](https://boxd.sh/pricing) · `pricing-page`.

**Prepaid wallet.** Credits are bought up front and drawn down; auto top-up in $20/€20 increments. Refunds: "Fees already incurred for Services already provided are not refundable, except as required by mandatory law." — [boxd.sh/terms](https://boxd.sh/terms) §5.6 · `docs-confirmed` (vendor legal terms).

**Extra charges — published and not**

| Item | Price | Status |
|---|---|---|
| Egress / bandwidth | — | `not-published` on pricing, FAQ, and the egress guide. Battleships: "Egress price not published… Not assumed free." · `third-party` |
| Named snapshot storage | — | `not-published` |
| Checkpoint storage | — | `not-published` |
| Backup storage (object storage) | — | `not-published`; docs only say "Uploads are sparse-aware." — [guides/disaster-recovery](https://docs.boxd.sh/guides/disaster-recovery) |
| Extra disk / volumes | — | `not-published` |
| Dedicated IP | — | Not offered (shared proxy IP) |
| Seats | none | "no per-seat fee" — [pricing FAQ](https://boxd.sh/pricing) |
| Custom domains | included, 25/user | [guides/resources](https://docs.boxd.sh/guides/resources) |
| VAT | excluded | "Prices exclude VAT." — [pricing](https://boxd.sh/pricing) |

**The model in plain words** (restates the tagged figures above; no new claims). You prepay a balance. While a machine is awake you pay for its CPU size, for the memory it is actually holding, and for the bytes it has written. When it goes to sleep you keep paying only for the disk it has written. There is no subscription and no per-user charge, and a machine that is off costs no CPU and no memory — only the disk it has written. Two things surprise people: memory is charged even while the machine is paused-but-warm, and the "written disk" meter runs in every state, so a box you never delete keeps costing a little forever.

---

## 11. Worked cost examples

All arithmetic uses **today's USD list** ($0.047/vCPU-h, $0.014/GiB-h RAM, $0.000096/GiB-h disk) from [boxd.sh/pricing](https://boxd.sh/pricing), USD toggle, 28 Oct 2026 · `pricing-page`, with EUR equivalents at €0.039 / €0.012 / €0.00008 from the same page, EUR toggle · `pricing-page`.

**The one ambiguity that moves every number: RAM is billed on use, not on the size you bought.** boxd says it twice:

- "RAM bills on the memory a machine actually has resident, sampled every second, while it is running or in standby, not on the 8 GiB it was provisioned with." — [pricing FAQ](https://boxd.sh/pricing) · `pricing-page`
- The rate card restates it per line: "$0.014 / GiB-hour in use, not the 8 GiB provisioned." — [pricing](https://boxd.sh/pricing) · `pricing-page`
- vCPU is the exception: "vCPU is the one component billed on the machine's size: its full vCPU count while it runs, nothing in standby, hibernated or stopped." — [pricing FAQ](https://boxd.sh/pricing) · `pricing-page`

So a 4 vCPU / 16 GiB machine holding 8 GiB pays for 8 GiB — *if* it really holds only 8 GiB. Because "resident" includes page cache and anything a JVM, database or Docker pulls in, the honest answer is a range. Every example below gives both ends: the brief's RAM figure as resident, and the full allocation of the shape you would have to buy. Where the brief names a shape boxd does not sell, the nearest one is named.

### (A) 1,000 agent tasks a month, 10 minutes each, 2 vCPU / 4 GiB, then deleted

**Shape:** boxd has no 2 vCPU / 4 GiB machine. Its four sizes are 1 vCPU / 4 GiB, 2 vCPU / 8 GiB, 4 vCPU / 16 GiB and 8 vCPU / 32 GiB — [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed`. Nearest for 2 vCPU is **2 vCPU / 8 GiB**; the 4 GiB figure becomes the *resident* memory the task is assumed to hold.

Cost per running hour, 4 GiB resident, 2 GiB written:
- vCPU: 2 × $0.047 = **$0.094/h**
- RAM: 4 GiB × $0.014 = **$0.056/h**
- Disk: 2 GiB × $0.000096 = **$0.000192/h**
- Total: **$0.150192/h**

Per task (10 min = 1/6 h): $0.150192 ÷ 6 = **$0.025032**
1,000 tasks: $0.025032 × 1,000 = **≈ $25.03/month**

| Variant | Hourly | Per task | 1,000 tasks |
|---|---|---|---|
| 4 GiB resident (brief's figure) | $0.150192 | $0.025032 | **$25.03** |
| 8 GiB resident (task fills the shape) | $0.206192 | $0.034365 | **$34.37** |
| EUR list, 4 GiB resident | €0.12616 | €0.021027 | **€21.03** |
| EUR list, 8 GiB resident | €0.17416 | €0.029027 | **€29.03** |

Also: 10 s of setup per task adds 1,000 × (10/3600) h × $0.150192 = **$0.42**; boot itself is negligible (6 ms × 1,000 = 6 seconds); deletion leaves nothing to bill.

### (B) One always-on dev box, 4 vCPU / 8 GiB / 50 GiB disk, 730 h a month

**Shape:** the 4 vCPU machine is **4 vCPU / 16 GiB** — [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed`. You cannot buy 4 vCPU with 8 GiB allocated, but you are billed on resident memory, so the 8 GiB in the brief is the assumed working set, not the purchase.

Cost per running hour at 8 GiB resident, 50 GiB written:
- vCPU: 4 × $0.047 = **$0.188/h**
- RAM: 8 GiB × $0.014 = **$0.112/h**
- Disk: 50 GiB × $0.000096 = **$0.0048/h**
- Total: **$0.3048/h**

730 h: $0.3048 × 730 = **≈ $222.50/month**

| Variant | Hourly | 730 h |
|---|---|---|
| 8 GiB resident (brief's figure) | $0.3048 | **$222.50** |
| 16 GiB resident (shape full, e.g. page cache) | $0.4168 | **$304.26** |
| EUR list, 8 GiB resident | €0.256 | **€186.88** |
| EUR list, 16 GiB resident | €0.352 | **€256.96** |

Sensitivity — if the box is allowed to hibernate 8 h a day (243 h/month idle, 487 h running): 487 × $0.3048 = $148.44 plus 243 × $0.0048 = $1.17 → **$149.60** at 8 GiB resident, or 487 × $0.4168 = $202.98 + $1.17 = **$204.15** at 16 GiB. A genuinely always-on box never hibernates, because the timer needs 4 h without network traffic — [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed`.

### (C) One persistent box, 2 vCPU / 4 GiB / 20 GiB disk, 3 h a day for 30 days, stopped otherwise

**Shape:** again no 2 vCPU / 4 GiB; nearest is **2 vCPU / 8 GiB**, with 4 GiB as the resident working set. **Period: 30 days = 720 h, of which 90 h run (3 h × 30) and 630 h are stopped.**

Running hours (90):
- vCPU: 2 × $0.047 = $0.094/h
- RAM: 4 GiB × $0.014 = $0.056/h
- Disk: 20 GiB × $0.000096 = $0.00192/h
- Total: **$0.15192/h** × 90 = **$13.67**

Stopped hours (630): disk only, $0.00192/h × 630 = **$1.21**

**Total ≈ $14.88/month**

| Variant | Running (90 h) | Idle (630 h) | Total |
|---|---|---|---|
| 4 GiB resident, stopped when idle | $13.67 | $1.21 | **$14.88** |
| 8 GiB resident, stopped when idle | $18.71 | $1.21 | **$19.92** |
| 4 GiB resident, left to idle hibernate | $31.90 | $0.98 | **$32.88** |
| 8 GiB resident, left to idle hibernate | $43.66 | $0.98 | **$44.64** |
| 4 GiB resident, parked in standby | $13.67 | $36.49 | **$50.16** |
| 8 GiB resident, parked in standby | $18.71 | $71.77 | **$90.48** |
| EUR list, 4 GiB resident, stopped | €11.48 | €1.01 | **€12.49** |
| EUR list, 8 GiB resident, stopped | €15.80 | €1.01 | **€16.81** |

The two "left to" rows are the real-world traps. Relying on the default 4-hour idle hibernate bills about 4 extra running hours a day (7 h/day = 210 h running, 510 h idle): 210 × $0.15192 = $31.90 + 510 × $0.00192 = $0.98. Parking in standby keeps billing RAM for all 630 idle hours: 630 × ($0.056 + $0.00192) = $36.49. Stopping explicitly is what produces the $14.88.

**What these examples cannot include:** egress, snapshot/backup/volume storage, and Custom or self-host pricing — none has a published price (§10). They also assume no minimum charge, which boxd states: "There is no minimum charge per machine" — [pricing FAQ](https://boxd.sh/pricing) · `pricing-page`.

## 12. Same word, different meaning

Each row: the word, what boxd means by it (quoted from the live page), what a reader may assume from other providers, and the consequence. The middle column is `inferred` — it describes how the word is commonly used elsewhere, not a claim about boxd.

| Word | What boxd means (quoted) | What people often assume elsewhere (`inferred`) | Practical consequence |
|---|---|---|---|
| **snapshot** | Memory **and** disk, named and versioned. "A snapshot is a saved copy of a specific machine. It captures the disk and the memory, so a machine created from the snapshot is already running whatever the source machine was running when the snapshot was saved." — [guides/snapshots](https://docs.boxd.sh/guides/snapshots) · `docs-confirmed` | A disk-only image; boot it and the service starts cold | Restoring is instant: "A machine created from a snapshot resumes in the state you captured. Nothing boots." — same page · `docs-confirmed` — but the copy gets "its own name, URL, and SSH port" · `docs-confirmed` |
| **fork** | A **live** copy: memory, disk and processes. "A fork is a copy of a machine, the source machine." and "A running source machine pauses for a fraction of a second to hand its live memory to the copy, then carries on." — [guides/fork](https://docs.boxd.sh/guides/fork) · `docs-confirmed` | Requires stopping the source first, or means *clone the repo* | You can branch a running agent mid-task. A fork is a *machine*, not a git operation, so it costs money while it exists (`inferred` from the billing model in §10) |
| **pause / suspend / standby** | One state, three words: frozen in host RAM. "The CLI prints `standby`. The API and the SDKs return `suspended` for the same state." — [guides/suspend-resume](https://docs.boxd.sh/guides/suspend-resume) · `docs-confirmed` | Paused means not billing | It keeps billing: the state table lists standby as billed for "Memory in use, disk written" — same page · `docs-confirmed` |
| **hibernate** | Memory written to disk, RAM released. "a memory image is written to disk and its memory is released" — [guides/suspend-resume](https://docs.boxd.sh/guides/suspend-resume) · `docs-confirmed` | Hibernate means shut down, state lost | This is the cheap idle state: "A hibernated machine bills only for the disk it has written." — same page · `docs-confirmed` |
| **checkpoint** | In-place undo point on one machine. "It stays on the machine, and you restore it **in place**" — [guides/checkpoints](https://docs.boxd.sh/guides/checkpoints) · `docs-confirmed`; "Checkpoints \| 10 per machine" — [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed` | Checkpoint ≈ snapshot | You cannot boot a second machine from one, and it dies with the machine: "Deleting a machine removes its checkpoints too" — [guides/checkpoints](https://docs.boxd.sh/guides/checkpoints) · `docs-confirmed` |
| **backup** | Disk only, off-cluster. "Memory and running state are not part of a backup" — [guides/disaster-recovery](https://docs.boxd.sh/guides/disaster-recovery) · `docs-confirmed` | Backup includes memory | "one command rewrites the disk from any backup you still have" — same page · `docs-confirmed` — a cold boot, no processes |
| **persistent** | The whole machine, including processes. "Running processes, open files, and shell state all survive between sessions." — [boxd.sh](https://boxd.sh/) · `docs-confirmed` | Persistent means one mounted folder survives | Persistence is the default: "boxd machines are persistent by default. A sandbox lives as long as you keep it, disk and all" — [use-cases/sandboxes](https://docs.boxd.sh/use-cases/sandboxes) · `docs-confirmed` |
| **isolated** (`--isolated`) | Cut off from your own organization, not from the internet. "A sandbox created with `--isolated` is cut off from all of that from birth." — [use-cases/sandboxes](https://docs.boxd.sh/use-cases/sandboxes) · `docs-confirmed` | Isolated means no internet | It keeps outbound internet and its public URL: "boxd leaves out everything that could reach into the rest of your organization" — same page · `docs-confirmed` |
| **machine** | A KVM VM with its own kernel. "Every boxd machine is a KVM microVM with its own kernel, network stack, and disk." — [use-cases/sandboxes](https://docs.boxd.sh/use-cases/sandboxes) · `docs-confirmed` | A container with a shell | Docker, systemd and breaking the OS are all allowed (§2, quoted there) |
| **template / image** | A snapshot is the image mechanism; there is no public template catalogue · `not-published` | Bring your own Docker image | An `image` ref is accepted — `image="ubuntu:24.04"` — [reference/python-sdk](https://docs.boxd.sh/reference/python-sdk) · `docs-confirmed`; reusable setups are snapshots ("Install your app on one machine, snapshot it" — [guides/golden-image](https://docs.boxd.sh/guides/golden-image) · `docs-confirmed`) |
| **free tier** | Credit after a card, not a free plan. "€30 of credits when you add a payment method. Nothing is charged when you add the card" — [pricing](https://boxd.sh/pricing) · `pricing-page` | A free plan with limits | "An org without a payment method is capped at 2 machines" — [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed` |
| **credits** | Prepaid wallet. "Credit-based." and "You buy credits and your organization's machines draw them down at the rate card" — [pricing](https://boxd.sh/pricing) · `pricing-page` | A discount coupon | Spent credit is money: "Fees already incurred for Services already provided are not refundable" — [boxd.sh/terms](https://boxd.sh/terms) · `docs-confirmed` |
| **unlimited runtime** | No maximum session length. "Runtime \| Unlimited" — [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed` | It will run until I stop it | The idle timer still sleeps it, and "Clocks also stop while a machine is asleep" — [guides/suspend-resume](https://docs.boxd.sh/guides/suspend-resume) · `docs-confirmed` |
| **public URL** | Open to the internet. "The machine's `https://.boxd.sh` URL is already public to the internet." — [guides/share-a-vm](https://docs.boxd.sh/guides/share-a-vm) · `docs-confirmed` | Preview URLs are private or tokenised | No authentication is documented for the URL itself · `not-published`; a bot check sits in front of *sleeping* machines only — [guides/bot-protection](https://docs.boxd.sh/guides/bot-protection) · `docs-confirmed` |
| **sharing** | Teammates get a shell; the URL was already public. "Sharing makes one of your machines reachable by every member of your organization." — [guides/share-a-vm](https://docs.boxd.sh/guides/share-a-vm) · `docs-confirmed` | Sharing publishes the URL | Sharing instead wipes logins: "Sharing a machine wipes the agent logins on it the moment it goes shared" — same page · `docs-confirmed` |

## 13. Glossary candidates

Two groups. The first is boxd's own vocabulary, where the word is doing work in the product and each definition is quoted from boxd. The second is standard computing vocabulary a newcomer needs, which is general knowledge rather than a claim about boxd — those are tagged `inferred` and carry no vendor quote, because none is required and inventing one would misrepresent the source.

### 13.1 boxd's own terms (quoted)

| Term | What it means here | Quote and source | Tag |
|---|---|---|---|
| **machine** | A whole virtual computer you own, not a container or a shell | "Every boxd machine is a KVM microVM with its own kernel, network stack, and disk." — [use-cases/sandboxes](https://docs.boxd.sh/use-cases/sandboxes) | `docs-confirmed` |
| **snapshot** | Named, versioned copy of memory **and** disk, kept after the machine is gone | "A snapshot is a saved copy of a specific machine." — [guides/snapshots](https://docs.boxd.sh/guides/snapshots) | `docs-confirmed` |
| **checkpoint** | In-place save point on one machine; cannot be used to make a second machine | "A checkpoint is a save point for a single machine: its full **memory and disk** captured at a moment in time." — [guides/checkpoints](https://docs.boxd.sh/guides/checkpoints) | `docs-confirmed` |
| **backup** | Disk only, stored off the cluster, for disaster recovery | "Backups protect the data **on** a machine" — [guides/disaster-recovery](https://docs.boxd.sh/guides/disaster-recovery) | `docs-confirmed` |
| **fork** | A live copy of a running machine, memory and processes included | "A fork is a copy of a machine, the source machine." — [guides/fork](https://docs.boxd.sh/guides/fork) | `docs-confirmed` |
| **standby / suspend / pause** | Frozen with memory intact in host RAM; resumes in under a millisecond; still billed for memory | "| **standby** | Kept in RAM | Sub-millisecond | Memory in use, disk written |" — [guides/suspend-resume](https://docs.boxd.sh/guides/suspend-resume) | `docs-confirmed` |
| **hibernate** | Memory written to disk, RAM released, wakes in about 85 ms | "a memory image is written to disk and its memory is released" — [guides/suspend-resume](https://docs.boxd.sh/guides/suspend-resume) | `docs-confirmed` |
| **stopped** | Shut down; disk kept, running state lost | "It keeps its disk and loses its memory and running processes" — [guides/suspend-resume](https://docs.boxd.sh/guides/suspend-resume) | `docs-confirmed` |
| **isolated** | Cut off from the rest of *your own organization*, not from the internet | "A sandbox created with `--isolated` is cut off from all of that from birth." — [use-cases/sandboxes](https://docs.boxd.sh/use-cases/sandboxes) | `docs-confirmed` |
| **golden image** | A snapshot of a fully set-up machine, used as the template for new ones | "Install your app on one machine, snapshot it, and keep the snapshot fresh on every push to main." — [guides/golden-image](https://docs.boxd.sh/guides/golden-image) | `docs-confirmed` |
| **proxy** | The public HTTPS front door for one port inside a machine | "The boxd proxy terminates TLS and forwards HTTP requests to your machine." — [guides/https](https://docs.boxd.sh/guides/https) | `docs-confirmed` |
| **raw port forward** | A non-HTTP port exposed through the same public address | "A raw port forward opens a TCP or UDP port on the machine's public address and sends it straight to a port inside the machine." — [guides/port-forwarding](https://docs.boxd.sh/guides/port-forwarding) | `docs-confirmed` |
| **egress allowlist** | The list of hosts a machine may reach; everything else is blocked | "The hosts and addresses one machine may reach. Everything else is blocked." — [guides/egress](https://docs.boxd.sh/guides/egress) | `docs-confirmed` |
| **host-bound secret** | A credential the machine never holds; boxd substitutes the real value only on the way to named hosts | "The machine only ever holds a placeholder, and the real value is inserted into HTTPS requests on their way out, only to the hosts you name." — [guides/egress](https://docs.boxd.sh/guides/egress) | `docs-confirmed` |
| **org / org context** | The billing and sharing unit; your personal account is itself an org | "Your default org is a normal org in the list" — [cli/authentication](https://docs.boxd.sh/cli/authentication) | `docs-confirmed` |
| **sharing** | Giving teammates a shell on your machine; the public URL is unaffected | "Sharing makes one of your machines reachable by every member of your organization." — [guides/share-a-vm](https://docs.boxd.sh/guides/share-a-vm) | `docs-confirmed` |
| **credit** | Prepaid balance drawn down per second | "Credit-based." — [pricing](https://boxd.sh/pricing) | `pricing-page` |
| **resident memory** | The RAM actually in use right now, which is what you are billed for | "the memory a machine actually has resident, sampled every second" — [pricing](https://boxd.sh/pricing) | `pricing-page` |
| **idle timer** | The rule that sleeps a machine; it watches network traffic, not CPU | "The idle timers watch network traffic, not CPU." — [guides/suspend-resume](https://docs.boxd.sh/guides/suspend-resume) | `docs-confirmed` |
| **delete-after** | A timer that destroys the machine at a set time, even while it sleeps | "A delete-after timer permanently deletes a machine at a set time." — [guides/delete-after](https://docs.boxd.sh/guides/delete-after) | `docs-confirmed` |
| **automation / job** | A `*.run.ts` script that runs on a schedule or event, with retries and durable state | "How a script becomes a background job: states, retries, waiting on a connection, sleep and wake, forks" — [guides/automations/jobs](https://docs.boxd.sh/guides/automations/jobs) | `docs-confirmed` |
| **desktop** | A browser window showing the machine's real graphical display | "a real desktop you can watch and control" — [guides/desktop](https://docs.boxd.sh/guides/desktop) | `docs-confirmed` |
| **gRPC** | The binary protocol boxd's API speaks; there is no REST alternative | "Raw gRPC access to the boxd public API, for any language with a protoc plugin." — [reference/grpc-api](https://docs.boxd.sh/reference/grpc-api) | `docs-confirmed` |

### 13.2 Standard computing terms (plain-language, not boxd claims)

Definitions in this list are general knowledge, written for a non-engineer. They are tagged `inferred` as a group: they are not statements about boxd, and boxd is not their source. Where boxd's own wording anchors the term, the anchor is given.

- **VM (virtual machine)** — a whole computer, operating system included, simulated in software on a bigger computer. `inferred`
- **hypervisor** — the layer that runs VMs and keeps them apart; boxd calls its boundary "the same one your laptop uses to run VMs" — [use-cases/sandboxes](https://docs.boxd.sh/use-cases/sandboxes) · `docs-confirmed` for the comparison, `inferred` for the definition
- **KVM** — the virtualisation feature built into Linux; boxd's isolation is described as "not container namespaces, not gVisor, not a shared host kernel" — [boxd.sh/faq](https://boxd.sh/faq/) · `docs-confirmed`
- **microVM** — a VM kept small and fast to start, still with its own kernel; boxd uses the term for its own machines — [use-cases/sandboxes](https://docs.boxd.sh/use-cases/sandboxes) · `docs-confirmed`
- **guest / host** — the VM you control versus the physical server it runs on. `inferred`
- **kernel** — the core of an operating system; "its own kernel" is the basis of boxd's isolation claim — [use-cases/sandboxes](https://docs.boxd.sh/use-cases/sandboxes) · `docs-confirmed` for the claim
- **container** — a process isolated by a *shared* kernel; boxd draws the contrast explicitly: "Containers share the host's kernel, which is exactly the surface untrusted code attacks." — [use-cases/sandboxes](https://docs.boxd.sh/use-cases/sandboxes) · `docs-confirmed`
- **root / sudo** — full administrator rights inside the machine; "as the `boxd` user with passwordless sudo" — [quickstart](https://docs.boxd.sh/quickstart) · `docs-confirmed`
- **systemd** — the standard Linux service manager; "a real kernel and a real `systemd`" — [use-cases/sandboxes](https://docs.boxd.sh/use-cases/sandboxes) · `docs-confirmed`
- **copy-on-write (CoW)** — copies share unchanged data until one of them writes; "The fork gets its own 100 GB disk, copy-on-write against the source" — [guides/fork](https://docs.boxd.sh/guides/fork) · `docs-confirmed` for the mechanism, `inferred` for the definition
- **vCPU** — a virtual CPU core; billed "on the machine's size", not on utilisation — [pricing](https://boxd.sh/pricing) · `pricing-page`
- **GiB-hour** — one gibibyte held for one hour; the unit for RAM and disk — [pricing](https://boxd.sh/pricing) · `pricing-page`
- **TLS / SNI** — the encryption layer under HTTPS, and the field in the handshake that says which site is wanted; "The proxy routes HTTPS by SNI (the domain in the TLS handshake)" — [guides/https](https://docs.boxd.sh/guides/https) · `docs-confirmed`
- **SSH** — the standard encrypted remote-shell protocol; "It is real SSH, so `scp`, `rsync`, `ssh -L` and your editor's Remote-SSH all work too." — [quickstart](https://docs.boxd.sh/quickstart) · `docs-confirmed`
- **MCP** — a standard way to give AI agents tools; boxd's only documented MCP is a `chrome-devtools` server registered for coding agents — [guides/client-utilities](https://docs.boxd.sh/guides/client-utilities) · `docs-confirmed`
- **tailnet** — a private network between your own devices, run by Tailscale; boxd can put machines on yours — [guides/tailscale](https://docs.boxd.sh/guides/tailscale) · `docs-confirmed`
- **PTY** — a pseudo-terminal, i.e. an interactive shell session rather than a one-shot command; boxd's `streamExec()` is the PTY path — [reference/typescript-sdk](https://docs.boxd.sh/reference/typescript-sdk) · `docs-confirmed` for the distinction, `inferred` for the definition

## 14. Gaps, contradictions and gotchas

### Unpublished facts (do not guess in the explainer)

For each item: what I searched, and what boxd does say instead.

1. **Egress price and allowance.** Searched the pricing page, its FAQ block, the egress guide and the CLI reference. The rate card has three meters only — "each settlement adds up your organization's vCPU, RAM and disk for that window" — [pricing](https://boxd.sh/pricing) · `pricing-page` — and the egress guide is about control, not billing: "Decide what a machine may reach on the internet" — [guides/egress](https://docs.boxd.sh/guides/egress) · `docs-confirmed`. No transfer price or allowance anywhere · `not-published`.
2. **Storage prices for snapshots, checkpoints, backups and extra disks.** Same three-meter sentence above; no storage line item exists on any page · `not-published`. Battleships reaches the same conclusion for snapshots and backups · `third-party`.
3. **GPU.** No GPU shape on the sizes table — "vCPUs | 2 by default (1, 2, 4 or 8, see Machine sizes)" — [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed` — and no GPU price or availability anywhere in the docs corpus, FAQ or pricing · `not-published`. The only "GPU" string in the docs is the RL example quoted in §5.
4. **ARM guests.** The sizes table names no architecture; the only arm64 mention is the CLI installer — "It supports macOS (Apple Silicon) and Linux" (x86_64 and arm64) — [cli/installation](https://docs.boxd.sh/cli/installation) · `docs-confirmed`. No ARM machine option · `not-published`.
5. **Maximum session length.** "Runtime | Unlimited" — [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed`; no cap documented · `not-published`.
6. **Spend limits, budgets or alerts.** Searched the CLI reference, the proto's billing messages and the pricing FAQ. The only spend control is auto top-up: "auto top-up adds $20 at a time from that card so your machines keep running. You can change the amount or switch it off under Billing." — [pricing](https://boxd.sh/pricing) · `pricing-page`. No budget or cap feature · `not-published`.
7. **Audit log contents** for self-serve. The only audit claim is SSH-level — "Every command lands over SSH, which gives a built-in audit trail." — [boxd.sh/faq](https://boxd.sh/faq/) · `docs-confirmed` — plus "SSO + audit logs" as a Custom line item — [pricing](https://boxd.sh/pricing) · `pricing-page`. No log schema, retention or export documented · `not-published`.
8. **Self-host and Custom prices.** "annual license" — [pricing](https://boxd.sh/pricing) · `pricing-page` — and "Volume pricing" as a Custom bullet, same page · `pricing-page`. No numbers · `not-published`.
9. **Volume/disk sizes and prices.** Now documented: "A disk is standalone storage that outlives the machine it is attached to." — [guides/disks](https://docs.boxd.sh/guides/disks) · `docs-confirmed`. Sizes appear by example only (`--size 10G`), and no disk price is published · `not-published`.
10. **What happens at zero balance** with auto top-up switched off. The pricing FAQ explains top-up but not exhaustion — "You can change the amount or switch it off under Billing." — [pricing](https://boxd.sh/pricing) · `pricing-page` · `not-published`.
11. **Nested virtualisation.** No statement either way in boxd's docs, FAQ, proto or pricing · `not-published`; battleships lists "nested virtualization" under its No features · `third-party`.
12. **No status page.** `status.boxd.sh` does not resolve (DNS failure), `boxd.sh/status` returns 404, and no status link appears in the site footer — checked 28 Oct 2026 · `not-published`.

### Contradictions between boxd's own pages

| # | Conflict | Both sides |
|---|---|---|
| 1 | **Machine quota: 50 vs 100** | Docs: "Machines \| 50 per organization (your default org included)" — [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed`. FAQ: "Each organization starts with a quota of 50 machines" — [boxd.sh/faq](https://boxd.sh/faq/) · `docs-confirmed`. Pricing page, both currencies, today: "100 machines included, raiseable on request" — [pricing](https://boxd.sh/pricing) · `pricing-page`. |
| 2 | **Price list moved within 19 days** | 9 Oct Wayback capture of the same page: "€0.049 / vCPU-hour", "€0.015 / GiB-hour", "€0.0001 / GiB-hour", "50 machines included" — [Wayback 20261009152053](http://web.archive.org/web/20261009152053/https://boxd.sh/pricing) · `third-party`. Today: "€0.039 / vCPU-hour", "€0.012 / GiB-hour", "€0.00008 / GiB-hour", "100 machines included" — [pricing](https://boxd.sh/pricing) · `pricing-page`. A ~20% cut and a doubled quota, or a revert. |
| 3 | **Is standby "near zero" or billed as RAM?** | **Resolved in the docs.** The state table now bills standby for "Memory in use, disk written" — [guides/suspend-resume](https://docs.boxd.sh/guides/suspend-resume) · `docs-confirmed` — matching "a machine in standby pays for RAM and disk" — [pricing](https://boxd.sh/pricing) · `pricing-page`. The earlier "near zero" wording is gone (checked 28 Oct 2026). |
| 4 | **Hibernate wake time: 85 ms or sub-millisecond?** | Docs: "| **hibernated** | Written to disk | About 85ms | Disk written |" — [guides/suspend-resume](https://docs.boxd.sh/guides/suspend-resume) · `docs-confirmed`. Pricing: "memory is written to disk and resumes in sub-millisecond when traffic arrives" — [pricing](https://boxd.sh/pricing) · `pricing-page`. The sub-millisecond figure belongs to standby in the docs. |
| 5 | **Is 8 vCPU self-serve?** | Docs list it as a size and as the per-machine quota: "8 | 32 GiB" and "8 vCPU / 32 GiB unless the boxd team raised it for your org" — [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed`. Homepage: "For 8 vCPU / 32 GiB or larger, email contact@boxd.sh." — [boxd.sh](https://boxd.sh/) · `docs-confirmed`. The pricing calculator offers an 8 vCPU / 32 GiB button — [pricing](https://boxd.sh/pricing) · `pricing-page`. |
| 6 | **"Public IPv4"?** | FAQ: "persistent, forkable Linux VMs with their own kernel, **a public IPv4**, and an automatic HTTPS domain" — [boxd.sh/faq](https://boxd.sh/faq/) · `docs-confirmed`. Docs: "Every machine's domain points at the proxy's shared public IP" — [guides/https](https://docs.boxd.sh/guides/https) · `docs-confirmed` — and "a dedicated SSH port on boxd's shared proxy IP" — [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed`. No dedicated IPv4 is offered. Battleships flags the same conflict · `third-party`. |
| 7 | **Free credits** | Pricing: "€30 of credits when you add a payment method. Nothing is charged when you add the card" — [pricing](https://boxd.sh/pricing) · `pricing-page`. Homepage: "Every new account starts with €30 of free credits" — [boxd.sh](https://boxd.sh/) · `docs-confirmed` — which omits the card requirement. |
| 8 | **Idle trigger wording** | Docs: "After 4 hours without TCP/UDP traffic in either direction, boxd hibernates the machine" — [guides/suspend-resume](https://docs.boxd.sh/guides/suspend-resume) · `docs-confirmed`. Pricing: "A machine hibernates automatically when its network activity stops" — [pricing](https://boxd.sh/pricing) · `pricing-page` — same idea, but the pricing page omits the 4-hour window, which reads as "immediately". |
| 9 | **MCP server** | Homepage: "The MCP server installs straight into Claude Code, Codex or opencode." — [boxd.sh](https://boxd.sh/) · `docs-confirmed`. Docs contain no boxd-control MCP server; the only MCP named is `chrome-devtools` — [guides/client-utilities](https://docs.boxd.sh/guides/client-utilities) · `docs-confirmed`. Unclear whether the homepage means integrations exposed to agents. |
| 10 | **The bulk export lags the pages** | `llms-full.txt` and the per-page `.md` disagree on the same table. Bulk export: "| Concurrent machines | 50 per organization (your personal context counts as its own org) |" — [llms-full.txt](https://docs.boxd.sh/llms-full.txt) · `docs-confirmed`. Per-page: "| Machines | 50 per organization (your default org included) |" — [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed`. Other pages differ in wording too (e.g. "come preinstalled" in the bulk export vs "come pre-installed" on [guides/run-docker](https://docs.boxd.sh/guides/run-docker)). Anyone quoting the bundle rather than the page can end up with text the site no longer shows. |

### Discrepancies with battleships.dev

battleships.dev is a useful cross-check, but its price row is already behind today's page, and it carries two claims I could not confirm on any boxd surface (`inferred`; comparisons below). Its feature list is a single comma-separated line under "Yes:" and another under "No:", so the quoted fragments are items from those lines rather than key-value pairs.

- Its "Yes:" line opens: "Yes: snapshots, memory snapshots, fork/clone, pause/resume, persistent disk, whole disk survives a stop, volumes, idle auto-stop, ≥24 h sessions" — [battleships.dev](https://battleships.dev/data/providers/boxd.md) · `third-party`
- Its "No:" line opens: "No: your own Docker/OCI image, nested virtualization, computer-use API, code interpreter, browser + desktop control, CAPTCHA solving, residential IPs, public IPv4" — same source · `third-party`

| battleships item | Live boxd evidence | Verdict |
|---|---|---|
| Its running-PAYG row: "$0.059 / vCPU-h (€0.049); $0.018 / GiB-h resident RAM (€0.015); $0.00012 / GiB-h written disk (€0.0001)" — [battleships.dev](https://battleships.dev/data/providers/boxd.md) · `third-party` | $0.047 / $0.014 / $0.000096 live (28 Oct) | **Stale by ~20%.** Its USD numbers match the 9 Oct page, which read "€0.049 / vCPU-hour" — [Wayback 20261009152053](http://web.archive.org/web/20261009152053/https://boxd.sh/pricing) · `third-party` |
| "50 machines per org" (its regime table) | "Machines | 50 per organization" in docs, but "100 machines included" on the pricing page | **Unresolved on boxd's side** (§14 contradictions) |
| lists "MCP server" among its Yes features | No boxd-control MCP server is documented; the only MCP named is `chrome-devtools` — [guides/client-utilities](https://docs.boxd.sh/guides/client-utilities) · `docs-confirmed` | **Unconfirmed** |
| lists "static egress IP" among its Yes features | No mention of a static or dedicated egress address anywhere in boxd's docs, FAQ or pricing · `not-published` | **Unconfirmed** |
| [battleships](https://battleships.dev/data/providers/boxd.md) lists "anti-bot stealth" among its Yes features · `third-party` | Documented for the *browser* — "backed by a Chromium build with anti-bot fingerprinting" — [guides/launch-a-browser](https://docs.boxd.sh/guides/launch-a-browser) · `docs-confirmed` — and separately as a proxy gate, "Bot protection" — [guides/bot-protection](https://docs.boxd.sh/guides/bot-protection) · `docs-confirmed` | **True on both counts**, but they are two different features |
| [battleships](https://battleships.dev/data/providers/boxd.md) lists "volumes" and "extra volumes" among its Yes features · `third-party` | Documented: "A disk is standalone storage that outlives the machine it is attached to." — [guides/disks](https://docs.boxd.sh/guides/disks) · `docs-confirmed`. No price · `not-published` | **True**; sizes appear only by example |
| [battleships](https://battleships.dev/data/providers/boxd.md) lists "custom image (Docker or snapshot)" in Yes and "your own Docker/OCI image" in No · `third-party` | An `image` ref is accepted — `image="ubuntu:24.04"` — [reference/python-sdk](https://docs.boxd.sh/reference/python-sdk) · `docs-confirmed`; no current page documents bring-your-own base images · `not-published` | **Both defensible**; treat snapshots as the image path |
| lists "live resize" in No | Resize exists but reboots: "A running machine reboots to apply it, so its disk persists and running processes are lost." — [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed` | **Agree**, with the nuance that resize exists, just not live |
| lists "public IPv4" in No | FAQ says "a public IPv4"; docs say "the proxy's shared public IP" | **battleships matches the docs**, contradicts the FAQ |

Other third-party errors worth knowing: a tools directory says "Free tier includes 10 VMs at 2 vCPU / 8 GB RAM / 100 GB disk each" — [thecloudrain.org](https://www.thecloudrain.org/free-tools) · `third-party` (verified verbatim on that page, 28 Oct 2026). That is wrong on every count: the allowance is "€30 of credits when you add a payment method" — [pricing](https://boxd.sh/pricing) · `pricing-page` — and "An org without a payment method is capped at 2 machines" — [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed`.

### Operational gotchas (the ones that bite)

1. **Idle timers watch the network, not the CPU.** A 6-hour compile that makes no TCP/UDP traffic gets hibernated at hour 4; outbound calls count as activity, but local CPU work does not; its clock freezes, so cron and systemd timers miss their slots — "Clocks also stop while a machine is asleep, so cron and systemd timers won't fire until the next inbound packet arrives." [guides/suspend-resume](https://docs.boxd.sh/guides/suspend-resume) · `docs-confirmed`.
2. **Paused ≠ free.** "a machine in standby pays for RAM and disk" — [pricing](https://boxd.sh/pricing) · `pricing-page`. The cheap idle state is hibernate or stop — [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed`.
3. **Written disk bills forever.** "Disk bills on the disk you have written to, in every state" — [pricing](https://boxd.sh/pricing) · `pricing-page`; "Every machine counts toward the cap, hibernated and stopped ones included." — [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed`.
4. **Preview URLs are public.** "The machine's `https://.boxd.sh` URL is already public to the internet." — [guides/share-a-vm](https://docs.boxd.sh/guides/share-a-vm) · `docs-confirmed`; no auth option is documented, only the sleeping-machine bot check · `not-published`.
5. **Sharing a machine logs agents out.** "Don't share a machine while an agent is working inside it." [guides/share-a-vm](https://docs.boxd.sh/guides/share-a-vm) · `docs-confirmed`
6. **Re-saving a snapshot name replaces the old version** — "Saving over a name you already used captures a new version that replaces the previous one" — [guides/snapshots](https://docs.boxd.sh/guides/snapshots) · `docs-confirmed`. There is no way to keep both versions (`inferred` from that sentence).
7. **Restores are destructive.** Checkpoint and backup restore both discard later writes with no undo — "Anything written after the checkpoint… is discarded" [guides/checkpoints](https://docs.boxd.sh/guides/checkpoints) · `docs-confirmed`; "`backup restore` overwrites the machine's current disk… there is no undo" [guides/disaster-recovery](https://docs.boxd.sh/guides/disaster-recovery) · `docs-confirmed`.
8. **No REST API.** Only gRPC is documented — "Raw gRPC access to the boxd public API" [reference/grpc-api](https://docs.boxd.sh/reference/grpc-api) · `docs-confirmed`; absence of a REST surface is `inferred` from the docs and confirmed by our internal notes · `third-party`. If your tooling speaks REST/OpenAPI, you write a gRPC client or shell out to the CLI.
9. **Egress control is no longer SDK-only.** The current table lists a laptop CLI form, `boxd machine egress`, beside the SDK calls — [guides/egress](https://docs.boxd.sh/guides/egress) · `docs-confirmed`; the earlier caveat that these were not settable from the laptop CLI is gone.
10. **`--isolated` is permanent.** "set at creation and cannot be changed afterward" — [use-cases/sandboxes](https://docs.boxd.sh/use-cases/sandboxes) · `docs-confirmed`.
11. **A snapshot does not carry an allowlist.** "A machine created from a snapshot starts unrestricted, unless its machine spec lists `egress`" — [guides/egress](https://docs.boxd.sh/guides/egress) · `docs-confirmed` — so a locked-down golden image does not stay locked down unless it was defined as a machine spec (`inferred`).
12. **Prices are moving.** Any cost table needs a retrieval date; see the Wayback comparison above.

---

## 15. Non-technical usability

Written for the reader of the explainer who is deciding *could I actually use this?*, not *is the API well designed?*. Every factual line below carries a source; the judgments are marked `inferred`.

**Is there a web dashboard, or is it CLI/API only?**

There is a web console at `boxd.sh/app`. The docs name its pages directly — "On the Machines page, open a machine's **Open** menu and choose **Desktop**." — [guides/desktop](https://docs.boxd.sh/guides/desktop) · `docs-confirmed`; "the **Delete** button on the console's Backups tab" — [guides/disaster-recovery](https://docs.boxd.sh/guides/disaster-recovery) · `docs-confirmed`; "the Domains page of the console" — [guides/custom-domains](https://docs.boxd.sh/guides/custom-domains) · `docs-confirmed`; and "the console terminal" as a session type — [guides/integrations/quickstart](https://docs.boxd.sh/guides/integrations/quickstart) · `docs-confirmed`.

It is real but secondary (`inferred`, with evidence): the documented first step for every task is a CLI command. "Install the CLI and create your first machine." — [docs index](https://docs.boxd.sh/) · `docs-confirmed`; "The boxd CLI manages machines from your local terminal." — [cli/installation](https://docs.boxd.sh/cli/installation) · `docs-confirmed`; and the sign-in page's own headline action is "Download the CLI" — [app.boxd.sh](https://app.boxd.sh), observed 28 Oct 2026 · `docs-confirmed`. Most guides I read open with a `boxd …` command rather than a console step; the Desktop guide is the clearest exception, opening with "On the Machines page, open a machine's **Open** menu and choose **Desktop**" (`inferred` from reading all 60+ docs pages, with that counter-example) — [guides/desktop](https://docs.boxd.sh/guides/desktop) · `docs-confirmed`.

I could not inspect the signed-in console without creating an account, which this task excluded, so I can confirm the pages exist by name but not how complete they are. `inferred`: expect a viewer/administrator for machines you already created, not a builder.

**Can someone use it without writing code?**

Partly, and less than the marketing suggests (`inferred`).

- The sign-in page offers a button that copies a prompt to hand to an AI agent: "Or hand it to your clanker: copy the prompt" — [app.boxd.sh](https://app.boxd.sh), observed 28 Oct 2026 · `docs-confirmed`. That is the closest thing to a no-code on-ramp: you paste a prompt into a coding agent and it drives the CLI for you (`inferred`).
- The Desktop is genuinely point-and-click: "a real desktop you can watch and control" — [guides/desktop](https://docs.boxd.sh/guides/desktop) · `docs-confirmed`. Once a machine exists, a non-technical person can watch an agent work and take over (`inferred`).
- There is **no template gallery, no one-click agent, and no app catalogue** (`inferred` from the absence of any such page in the docs index or the console references). Templates are not a public feature: no template list, create, or create-from-template command appears in the CLI reference, and the proto comment that used to say so is gone (checked 28 Oct 2026) — [reference/grpc-proto](https://docs.boxd.sh/reference/grpc-proto) · `not-published`.
- The substitutes are a snapshot you made yourself — [guides/golden-image](https://docs.boxd.sh/guides/golden-image) · `docs-confirmed` — and machine specs, which are code but produce the hand-over-a-ready-machine effect: "That makes a spec the way to hand someone a machine that is ready to work." — [guides/machine-specs](https://docs.boxd.sh/guides/machine-specs) · `docs-confirmed`. A teammate can be handed one; they still need the CLI or console to open it (`inferred`).
- Preinstalled agents still need a terminal to start: "`boxd connect myapp` … `claude`" — [use-cases/coding-agents](https://docs.boxd.sh/use-cases/coding-agents) · `docs-confirmed`.
- **Verdict** (`inferred`): a non-coder can *use* a machine someone else set up (desktop, browser, files), and can *ask an AI* to set one up, but cannot self-serve a first machine from the website alone.

**What does signup take?**

- Identity: "Continue with GitHub" or "Continue with Google" — [app.boxd.sh](https://app.boxd.sh), observed 28 Oct 2026 · `docs-confirmed`. No email/password field was present (`inferred` from the page's controls). GitHub is also the identity behind SSH access: "Identity is your SSH public-key fingerprint, linked to your account via GitHub OAuth on first connect" — [boxd.sh/faq](https://boxd.sh/faq/) · `docs-confirmed`.
- Card: required for the credit and for more than 2 machines. "€30 of credits when you add a payment method. Nothing is charged when you add the card" — [pricing](https://boxd.sh/pricing) · `pricing-page`; "An org without a payment method is capped at 2 machines" — [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed`.
- Waitlist: only for the **US region**. "Europe is open. We're opening a cluster in the US." — [boxd.sh/us-waitlist](https://boxd.sh/us-waitlist/) · `docs-confirmed`. EU signup being open self-serve is `inferred` from that page plus the working sign-in flow.
- Team invite: not required to start; "your personal account counts as an organization of its own" — [cli/authentication](https://docs.boxd.sh/cli/authentication) · `docs-confirmed`. Invites happen later at `/app/organizations` — [cli/commands](https://docs.boxd.sh/cli/commands) · `docs-confirmed`.
- Onboarding: "Every account starts with a 25-minute call where we provision your first machine with you" — [boxd.sh/faq](https://boxd.sh/faq/) · `docs-confirmed`.

**Docs, support, status.**

- Docs platform and machine-readability: "This documentation is built and hosted on Mintlify, a developer documentation platform." and "If you're an AI agent reading this, fetch llms-full.txt, the complete docs in one file." — [docs index](https://docs.boxd.sh/) · `docs-confirmed`. Coverage is broad: CLI reference, gRPC proto, two SDK references, and per-page `.md` — [docs index](https://docs.boxd.sh/) · `docs-confirmed`.
- Register: the docs assume familiarity with SSH, proxies, and snapshots — e.g. "The boxd proxy terminates TLS and forwards HTTP requests to your machine" is stated without explanation — [guides/https](https://docs.boxd.sh/guides/https) · `docs-confirmed` for the sentence, `inferred` for the reading that the docs assume familiarity.
- Support: "Who do I talk to when something breaks? A founder… There is no ticket queue and nobody working from a first-line script." — [boxd.sh/faq](https://boxd.sh/faq/) · `docs-confirmed`. Contact is `contact@boxd.sh` and a form at [boxd.sh/contact](https://boxd.sh/contact/) (page returns HTTP 200, 28 Oct 2026) · `docs-confirmed`.
- Status page: **none found.** `status.boxd.sh` does not resolve, `boxd.sh/status` returns 404, and the site footer links only Docs, Contact, Terms and Privacy — checked 28 Oct 2026 · `not-published`.
- Legal: Terms and Privacy are linked from sign-in; Terms §5.6 — "Fees already incurred for Services already provided are not refundable, except as required by mandatory law." — [boxd.sh/terms](https://boxd.sh/terms) · `docs-confirmed`.

**What would trip up a non-engineer**

1. **The first step is a terminal command.** "Install the `boxd` CLI (`curl -fsSL https://boxd.sh/downloads/install.sh | sh`), run `boxd auth login`, then `boxd machine new my-app`" — [boxd.sh/faq](https://boxd.sh/faq/) · `docs-confirmed`. Everything else follows from that.
2. **"Machine" sounds like a physical computer you rent.** It is a VM that sleeps. The mental model that matters is *a computer that pauses itself and keeps charging a little for its disk* — `inferred` from the state table in [guides/resources](https://docs.boxd.sh/guides/resources) · `docs-confirmed` for the table.
3. **The pricing vocabulary is engineer-facing.** "in use, not the 8 GiB provisioned" and "written to, not the 100 GiB provisioned" — [pricing](https://boxd.sh/pricing) · `pricing-page`. The gap between the headline ~$0.12/h and a real bill is invisible without reading that FAQ (`inferred`, quantified in §11).
4. **The headline hourly price assumes a light workload.** boxd's own monthly examples price 2 GiB resident and 20 GiB written; its "Always on" figure of $90.46 is exactly 730 h × $0.12392 — [pricing](https://boxd.sh/pricing) · `pricing-page`; the arithmetic is mine (`inferred`).
5. **Public URLs surprise people.** "The machine's `https://.boxd.sh` URL is already public to the internet." — [guides/share-a-vm](https://docs.boxd.sh/guides/share-a-vm) · `docs-confirmed`.
6. **Sleep is invisible and can break things.** "a crontab entry or a systemd timer silently misses its slot" — [guides/integrations/overview](https://docs.boxd.sh/guides/integrations/overview) · `docs-confirmed`.
7. **Nothing is ephemeral by default.** "boxd machines are persistent by default. A sandbox lives as long as you keep it, disk and all" — [use-cases/sandboxes](https://docs.boxd.sh/use-cases/sandboxes) · `docs-confirmed`.
8. **Two currencies, two numbers.** €0.039 vs $0.047 per vCPU-hour on the same page, a fixed ~1.2× ratio rather than a live FX conversion — [pricing](https://boxd.sh/pricing), both toggles · `pricing-page`; the ratio being a fixed markup rather than live FX is `inferred` from the arithmetic.
9. **No status page** means an outage has no public place to check — `not-published`, checked 28 Oct 2026.
10. **The 25-minute founder call is the support model** — great for a team, awkward for someone who wanted to swipe a card and try it at midnight (`inferred` from [boxd.sh/faq](https://boxd.sh/faq/) · `docs-confirmed`).

## 17. The company behind it

> Numbered 17 as requested; the profile currently has no §16.

**Legal entity and where it is registered.** Boxd is a trading name, not a company. The contracting party is a Dutch private limited company in Amsterdam.

- "“Boxd”, “we”, “us” or “our” means Azin Tech Operating Company B.V. (KvK 99718340, RSIN 869104743, VAT NL869104743B01), with its corporate seat in Amsterdam and its registered office at Westerstraat 246-2, 1015 MT Amsterdam." — [Terms](https://boxd.sh/terms/) §2.3 · `docs-confirmed`
- "Boxd is a trading name of Azin Tech Operating Company B.V. (KvK 99718340, VAT NL869104743B01), registered office at Westerstraat 246-2, 1015 MT Amsterdam, the Netherlands." — [Privacy Notice](https://boxd.sh/privacy/), last updated 1 September 2026 · `docs-confirmed`
- Registration date 5 February 2026: "Azin Tech Operating Company B.V." / "Oprichtingsdatum: 05-02-2026KvK nr: 99718340" — [Drimble, KvK-derived listing](https://drimble.nl/bedrijf/amsterdam/000057849749/melchior-holding-bv.html) · `third-party`. Boxd publishes no founding date of its own · `not-published`.
- **Cross-check mismatch:** battleships calls the operator "Azin Tech Holding" — [battleships.dev](https://battleships.dev/data/providers/boxd.md) · `third-party`. The binding documents name Azin Tech **Operating Company** B.V., which is the one that matters for a contract.

**Founders and leadership.** Three co-founders, named in the funding coverage, with the announcement itself bylined to one of them; no executive titles are published anywhere I could find.

- "Founded by Michiel Voortman, Laurentiu Ciobanu and Hidde Kehrer, Boxd is building infrastructure that provides virtual machines for developers and AI agents" — [tech.eu, 16 Sep 2026](https://tech.eu/2026/09/16/boxd-raises-2m-to-build-cloud-infrastructure-for-ai-coding-agents) · `third-party`
- The funding announcement is bylined and schema-tagged to one of them: `"datePublished":"2026-09-16"`, `"author":{"@type":"Person","name":"Hidde Kehrer"}` — [boxd blog](https://boxd.sh/blog/we-raised-2m-to-kill-localhost/) (page source, 28 Oct 2026) · `docs-confirmed`
- The blog counts three authors — "Authors 3" — and its posts are bylined to Michiel Voortman and Laurentiu Ciobanu, with the funding post by Hidde Kehrer — [boxd.sh/blog](https://boxd.sh/blog/) · `docs-confirmed`
- His title in the announcement is co-founder, not chief executive: "said Hidde Kehrer, co-founder of Boxd" — [tech.eu](https://tech.eu/2026/09/16/boxd-raises-2m-to-build-cloud-infrastructure-for-ai-coding-agents) · `third-party`. Who holds which executive title (CEO, CTO) is `not-published`.

**Founding and public launch.** Three dates, none of them a launch announcement:

| Event | Date | Source |
|---|---|---|
| Company registered at KvK | 5 Feb 2026 | [Drimble](https://drimble.nl/bedrijf/amsterdam/000057849749/melchior-holding-bv.html) · `third-party` |
| Earliest public blog post ("boxd 101", by Michiel Voortman) | 14 Aug 2026 | [boxd.sh/blog](https://boxd.sh/blog/) · `docs-confirmed` |
| Funding announced | 16 Sep 2026 | [blog](https://boxd.sh/blog/we-raised-2m-to-kill-localhost/) · `docs-confirmed`; [tech.eu](https://tech.eu/2026/09/16/boxd-raises-2m-to-build-cloud-infrastructure-for-ai-coding-agents) · `third-party` |

No page states a launch date · `not-published`. Third-party databases disagree on the founding year (gritt.io says "boxd was founded in 2025" — [gritt.io](https://www.gritt.io/company/boxdsh/) · `third-party`; The SaaS News says "Founded in 2026 by Michiel Voortman, Laurentiu Ciobanu, and Hidde Kehrer" — [thesaasnews.com](https://www.thesaasnews.com/news/boxd-raises-2m-pre-seed/) · `third-party`), which is what happens when a company is registered in February and starts publishing in August.

**Funding: one disclosed round.**

- "boxd has raised €2 million in pre-seed funding led by BlueYard Capital, with participation from Antler, OVNI, s20, Script Capital and a group of angels who have built developer infrastructure before." — [boxd blog, 16 Sep 2026](https://boxd.sh/blog/we-raised-2m-to-kill-localhost/) · `docs-confirmed`
- "The round was led by BlueYard Capital, with participation from OVNI Capital, Antler, S20 and Script Capital, alongside business angels from General Intuition and other technology companies." — [tech.eu](https://tech.eu/2026/09/16/boxd-raises-2m-to-build-cloud-infrastructure-for-ai-coding-agents) · `third-party`
- Stage: pre-seed. Amount: €2M (boxd) / "$2 million" (tech.eu). No later round, valuation, or total-raised figure is published · `not-published`.
- Accelerator: Antler is named as an investor, not as a programme. Battleships says "Antler backed the company pre-product (exact accelerator batch not disclosed)" — [battleships.dev](https://battleships.dev/data/providers/boxd.md) · `third-party`. A batch or cohort is `not-published`.
- Battleships converts the round to "$2.2M … at an approximate EUR/USD rate of 1.08" — [battleships.dev](https://battleships.dev/data/providers/boxd.md) · `third-party`. That conversion is theirs; boxd states €2 million.

**Ownership, acquisitions, parent companies.** Nothing is disclosed by boxd: no acquisition, merger, subsidiary list, or parent-company statement appears on the site, in the Terms, or in the Privacy Notice · `not-published`.

- A second, near-identically named entity is registered on the same day at the same address: "Azin Tech Holding Company B.V." / "Oprichtingsdatum: 05-02-2026KvK nr: 99712768" — [Drimble](https://drimble.nl/bedrijf/amsterdam/000057849749/melchior-holding-bv.html) · `third-party`. Two entities registered together, one named "Holding" and one "Operating Company", is the ordinary Dutch holdco/opco pattern, so the holding company most likely sits above the contracting entity — but boxd never says so, so that structure is `inferred`, not confirmed. Same-address companies also include "Left Eye Tech B.V." and "Right Eye Tech B.V." (both 05-02-2026) · `third-party`.

**Headcount.** `not-published`. The careers page lists values and a "See open roles" link but no team size — [boxd.sh/careers](https://boxd.sh/careers/) · `docs-confirmed`. The blog counts "Authors 3", which is a floor, not a headcount · `docs-confirmed` for the count, `inferred` for the reading. Third-party trackers give small, conflicting numbers, and I could not load a quotable figure (PitchBook's profile is gated; LinkedIn shows followers, not employees) · `not-published`.

**Status page and uptime.** There is none, so there is no published uptime figure.

- `status.boxd.sh` does not resolve; `boxd.sh/status` returns 404; `boxd.statuspage.io` and `boxd.instatus.com` both redirect to the vendors' own homepages rather than to a boxd page; no status link appears in the site footer — checked 28 Oct 2026 · `not-published`.
- Consequence for a buyer: you cannot independently check availability, and there is no incident history to point at during a dispute (`inferred`).

**SLA.** `not-published`. I searched the Terms, the pricing page and the FAQ: no service-level commitment, availability target, credit regime, or support-response target appears in any of them. What the Terms do say is a liability cap and a termination right:

- "Boxd’s total aggregate liability to Customer arising out of or in connection with the Agreement, whether in contract, tort or otherwise, is limited to the total Fees paid by Customer to Boxd in the twelve (12) months immediately preceding the event giving rise to the claim." — [Terms](https://boxd.sh/terms/) §11.2 · `docs-confirmed`
- "Either party may terminate the Agreement for convenience, at any time, given the usage-based nature of the Services, unless the parties have agreed otherwise (e.g. a fixed-term contract)." — [Terms](https://boxd.sh/terms/) §9.1 · `docs-confirmed`
- An SLA may exist inside Custom/Enterprise contracts; nothing public says so · `not-published`.

**Support channels.**

- "Talk to a founder" and "We'll walk you through boxd, answer questions about your setup, and help you figure out if it's the right fit." — [boxd.sh/contact](https://boxd.sh/contact/) · `docs-confirmed`; "Prefer email? Reach out at contact@boxd.sh" — same page · `docs-confirmed`
- "Every account starts with a 25-minute call where we provision your first machine with you" — [boxd.sh/faq](https://boxd.sh/faq/) · `docs-confirmed`
- "post them in the Slack channel you share with the boxd team" — [guides/tailscale](https://docs.boxd.sh/guides/tailscale) · `docs-confirmed`
- Privacy requests: "If you have questions, contact us at privacy@boxd.sh." — [Privacy Notice](https://boxd.sh/privacy/) · `docs-confirmed`
- No ticket portal, phone number, community forum, or published support hours · `not-published`. The FAQ's own framing is "There is no ticket queue and nobody working from a first-line script." — [boxd.sh/faq](https://boxd.sh/faq/) · `docs-confirmed`

**Security and compliance claims.**

- Isolation: "Every machine is a KVM virtual machine with its own Linux kernel — not container namespaces, not gVisor, not a shared host kernel. A CVE on one VM's kernel doesn't breach the host or its neighbours." — [boxd.sh/faq](https://boxd.sh/faq/) · `docs-confirmed`
- Transport: "Traffic to your machine goes over SSH or HTTPS (TLS terminated at the boxd proxy, with automatic HTTP→HTTPS redirect and HSTS)." — same page · `docs-confirmed`
- Residency: "Managed boxd runs on EU hardware with no US cloud dependency, GDPR / DSGVO by default, and no exposure to US subpoenas." — same page · `docs-confirmed` — **but see the contradiction below.**
- DPA: referenced but not published — "that processing is governed by our Data Processing Agreement, not this notice" — [Privacy Notice](https://boxd.sh/privacy/) · `docs-confirmed`; `boxd.sh/dpa` returns 404 (checked 28 Oct 2026) · `not-published`.
- **No SOC 2, ISO 27001, HIPAA, PCI, or trust centre is claimed anywhere** on boxd.sh, docs.boxd.sh, the FAQ, the Terms or the Privacy Notice; `boxd.sh/security` and `trust.boxd.sh` do not exist — checked 28 Oct 2026 · `not-published`. Battleships lists SOC 2 and HIPAA as "No" · `third-party`.
- SSO exists only on the top tier: "SAML SSO is available on Enterprise — talk to us." — [boxd.sh/faq](https://boxd.sh/faq/) · `docs-confirmed`
- **Two vendor pages contradict each other on hosting and regions.** The FAQ says "no US cloud dependency… no exposure to US subpoenas", while the Privacy Notice describes two clusters and a US infrastructure vendor: "Latitude.sh LLC (Delaware, United States): bare-metal server infrastructure for our European Union and United States clusters." and "If you choose our United States Cluster… your data may be transferred to and processed in the United States." — [Privacy Notice](https://boxd.sh/privacy/) · `docs-confirmed`. The FAQ also still credits a different host: "All inter-node control traffic runs over a private OVH vRack" — [boxd.sh/faq](https://boxd.sh/faq/) · `docs-confirmed`. For a buyer this matters more than any badge: the residency answer depends on which page you read (`inferred`).

**Terms that matter to a buyer.**

| Question | What the contract says | Source |
|---|---|---|
| What happens to my data when I cancel? | "Boxd may delete Customer Content after a reasonable retention period of thirty (30) days" | [Terms](https://boxd.sh/terms/) §9.4 · `docs-confirmed` |
| Notice before a price change? | None: "Boxd may adjust its published rates at any time, effective for usage from the date of the change onward", with a consumer carve-out — "Where Customer is a Consumer, Boxd will not increase its rates within the first three months after the Effective Date without giving Customer the right to terminate" | [Terms](https://boxd.sh/terms/) §5.5 · `docs-confirmed` |
| Notice before the Terms themselves change? | "at least thirty (30) days prior notice of any material change" | [Terms](https://boxd.sh/terms/) §15.2 · `docs-confirmed` |
| Refunds? | "Fees already incurred for Services already provided are not refundable, except as required by mandatory law." | [Terms](https://boxd.sh/terms/) §5.6 · `docs-confirmed` |
| Liability ceiling? | Fees paid in the previous 12 months | [Terms](https://boxd.sh/terms/) §11.2 · `docs-confirmed` |
| Which law and courts? | "The Agreement is governed by the laws of the Netherlands" and "the competent court in Amsterdam" | [Terms](https://boxd.sh/terms/) §18.1–18.2 · `docs-confirmed` |
| Can they suspend me without notice? | Yes, where "Boxd reasonably believes this is necessary to: (a) prevent harm to Boxd, other customers, or third parties" | [Terms](https://boxd.sh/terms/) §9.3 · `docs-confirmed` |

The practical reading: cancellation gives you 30 days before deletion, price changes take effect immediately for new usage with no notice period, and the only notice commitment is the 30 days on changes to the Terms themselves (`inferred` from the clauses above).

**The Ignition / lttle-cloud relationship.** boxd's own docs credit an outside open-source project as the foundation of the platform, and that is as far as the published record goes.

- "boxd is built on Ignition, an open-source microVM orchestrator that laid the foundation for what boxd is now." — [guides/suspend-resume](https://docs.boxd.sh/guides/suspend-resume) · `docs-confirmed`
- "Ignition is open source. Read the code and architecture:" — same page · `docs-confirmed`
- The repository is `lttle-cloud/ignition`, described as "tiny clouds inc.", licensed AGPL-3.0, created 25 Dec 2024, last pushed 2 Nov 2025, homepage `lttle.cloud` — GitHub API metadata: `"full_name":"lttle-cloud/ignition"`, `"description":"tiny clouds inc."`, `"spdx_id":"AGPL-3.0"`, `"created_at":"2024-12-25T20:24:34Z"`, `"pushed_at":"2025-11-02T13:16:27Z"` — [api.github.com/repos/lttle-cloud/ignition](https://api.github.com/repos/lttle-cloud/ignition) · `third-party` (GitHub is not boxd).
- The README introduces itself as "lttle.cloud | Ignition" and describes the project without mentioning boxd: "Ignition is an all-in-one solution for this problem: an orchestrator, a microVM manager built on KVM, and a TCP/TLS proxy" — [github.com/lttle-cloud/ignition](https://github.com/lttle-cloud/ignition) · `third-party`
- `lttle.cloud` itself did not respond when checked on 28 Oct 2026 · `not-published`.
- What is **not** published: any statement that lttle-cloud is a boxd subsidiary, that boxd employs its maintainers, or that boxd owns the Ignition code. The docs' phrasing — "laid the foundation for what boxd is now" — reads as lineage rather than current ownership, and the repository's last push (Nov 2025) predates the company's registration (Feb 2026) (`inferred` from the two dates).
- Why a buyer should care: Ignition is AGPL-3.0. That licence governs the upstream project, not boxd's hosted service, but anyone taking up boxd's self-host offer should establish with boxd what they are licensing, because no page says whether the self-hosted binary is the AGPL project or a separate proprietary build (`inferred`; the self-host page says only "a single Rust binary you run in your own VPC" — [pricing](https://boxd.sh/pricing) · `pricing-page`).

**The company in one line.** A Dutch BV registered in February 2026, founded by three engineers, with one €2M pre-seed round and a founder-led support model — credible and fast-moving, but with no SLA, no status page, no independent security certification, and two of its own pages disagreeing about where your data is hosted (`inferred`, from the quotes above).

## Appendix: sources and how they were retrieved

| Source | URL | Retrieved | Note |
|---|---|---|---|
| Docs corpus (all pages) | https://docs.boxd.sh/llms-full.txt | 28 Oct 2026 | 414k chars; used for §2–§9 |
| Docs index | https://docs.boxd.sh/llms.txt | 28 Oct 2026 | Page inventory |
| Individual doc pages | e.g. https://docs.boxd.sh/guides/snapshots | 28 Oct 2026 | `.md` variants for pages missing from llms-full |
| Pricing (EUR + USD toggles) | https://boxd.sh/pricing | 28 Oct 2026 | Rendered in a browser and read from DOM text; both toggles |
| Vendor FAQ | https://boxd.sh/faq/ | 28 Oct 2026 | Public IPv4, regions, SSO, support model |
| Homepage | https://boxd.sh/ | 28 Oct 2026 | Positioning, size availability, region |
| US waitlist | https://boxd.sh/us-waitlist/ | 28 Oct 2026 | Region roadmap |
| Terms | https://boxd.sh/terms | 28 Oct 2026 | Entity, price-change, deletion, liability, governing-law clauses (§17) |
| Privacy Notice | https://boxd.sh/privacy/ | 28 Oct 2026 | Entity, KvK/VAT, clusters, sub-processors, DPA reference (§17) |
| Careers and contact | https://boxd.sh/careers/, https://boxd.sh/contact/ | 28 Oct 2026 | No headcount; founder-led support (§17) |
| Funding announcement | https://boxd.sh/blog/we-raised-2m-to-kill-localhost/ (page source for `datePublished` and author) | 28 Oct 2026 | Round, investors, byline (§17) |
| tech.eu | https://tech.eu/2026/09/16/boxd-raises-2m-to-build-cloud-infrastructure-for-ai-coding-agents | 28 Oct 2026 | Independent funding write-up and founder names (§17) |
| KvK-derived listing | https://drimble.nl/bedrijf/amsterdam/000057849749/melchior-holding-bv.html | 28 Oct 2026 | Registration dates and the same-address entities (§17); third-party aggregation of KvK data |
| GitHub repo metadata | https://api.github.com/repos/lttle-cloud/ignition | 28 Oct 2026 | Licence, owner, created/pushed dates (§17) |
| Ignition README | https://github.com/lttle-cloud/ignition | 28 Oct 2026 | Project description; no mention of boxd (§17) |
| gritt.io, The SaaS News | https://www.gritt.io/company/boxdsh/, https://www.thesaasnews.com/news/boxd-raises-2m-pre-seed/ | 28 Oct 2026 | Conflicting founding years (§17) |
| Sign-in page | https://app.boxd.sh | 28 Oct 2026 | GitHub/Google, CLI-first onboarding |
| Pricing, 9 Oct 2026 | http://web.archive.org/web/20261009152053/https://boxd.sh/pricing | 28 Oct 2026 | Prior rate card and 50-machine quota |
| battleships.dev record | https://battleships.dev/data/providers/boxd.md and `.json` | 28 Oct 2026 | Secondary; price stale, two unconfirmed claims |
| everydev.ai listing | https://www.everydev.ai/tools/boxd | 28 Oct 2026 | Independent description: "a real KVM virtual machine running Ubuntu" |
| Hacker News | https://hn.algolia.com/api/v1/search?query=boxd.sh | 28 Oct 2026 | **No substantive discussion found**; only incidental mentions |
| Internal skill notes | .agents/skills/using-boxd-api/SKILL.md | 2026-10-22 | Live gRPC verification; used only where marked `third-party` |

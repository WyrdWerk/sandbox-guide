# Freestyle recheck — 12 November 2026

- **Target:** `freestyle` — https://www.freestyle.sh
- **Repository:** `sandbox-guide`, `origin/main` `4432d00`
- **Previous check:** 2026-10-30 (profile and rate card both `checkedOn: 2026-10-30`)
- **This check:** 2026-11-12, Asia/Calcutta
- **Scope:** desk research only. No account, no credential, no VM, nothing billed.
- **Baseline read:** `site/src/data/providers/freestyle.json`, its 16 feature rows in `site/src/data/features/*.json`, all 78 rows in `site/src/data/capabilities.json`, `site/src/data/pricing/freestyle.json`, `site/src/data/docs.json`, `research/freestyle.md`, `research/capabilities-NOTES-*.md`, `site/src/lib/cost.ts` and `cost.test.ts`.
- **No repo data file was edited.** This is the research artifact for the parent.

## Headline

- **5 capability verdict changes, 0 feature verdict changes.**
- **No rate-card number changed.** Same plans, unit rates, allowances, free tier, egress and $1 card check. A/B/C inputs are unchanged.
- **3 baseline corrections:** Terms of Service *are* published (at `dash.freestyle.sh/terms`, effective 30 Aug 2026); the dashboard *does* host an interactive terminal; teams *do* have Owner/Member roles.
- **2 products that appear new since 30 Oct:** the official remote MCP server (privacy policy updated 5 Nov 2026) and FIDO/passkey virtual security keys (docs index 92 → 94 pages; both pages absent on 15 Oct).
- **Several products the baseline missed** (some predate 30 Oct): stable public IPv6 per VM, physical hardware in VPCs, anti-affinity placement, VM display streaming, automatic restart on failure, total provisioned resource budgets, Postgres/IMAPS ingress, Tailscale/IKEv2 tunnels, customer records, background requests, and the outbound-mail port block.
- **The biggest buyer-facing finds** are the MCP server (the "no MCP server" claim is now wrong), the dashboard terminal (the "no hosted browser terminal" claim is wrong), published Terms (the "terms not published" claim is wrong), Owner/Member roles, outbound mail being blocked on 25/465/587, and the plan-wide total vCPU/memory/disk budgets that make disk — not the saved-VM count — the binding fleet limit.

## How this was checked

| Route | What it did | Result |
|---|---|---|
| Context `web_scrape` | `/pricing` with `maxAgeMs: 0`, `responseMode: "full"`; `/status`; `/changelog`; `/terms` on `dash`; `/yc` | Succeeded. Pricing response `cache_metadata.status = "miss"`, `age_ms = 0` (fresh). |
| TinyFish `fetch_content` | `/yc`, YC company page, third-party MCP directory | Succeeded. |
| TinyFish `search` | `site:freestyle.sh MCP`, `"mcp.freestyle.sh"`, MCP discovery queries | Succeeded; found the Nov 4 directory entry and the docs MCP. |
| `curl` | `pricing.md`, `about.md`, `docs/llms.txt`, `docs/llms-full.txt`, every cited docs `.md`, `openapi.json`, `yc.md`, privacy HTML, dashboard HTML + JS chunks, HTTP headers, Wayback CDX/archives | Succeeded. |
| Amp native `read_web_page` / `web_search` | — | Not used; Composio routes worked. |

**Freshness of money pages.** The rendered `/pricing` page was fetched through Context with `maxAgeMs: 0` (cache miss, age 0). I independently fetched the same page and `pricing.md` with `curl`, then read the rate table out of the raw HTML rather than a scraper. The current rendered page is byte-identical to the Wayback snapshot of 5 Nov 2026, and its rates, plans and limits are identical to the 24 Sep 2026 snapshot. So the numbers below are not a cached or re-rendered approximation.

**Quote check.** Every quote in the existing 78 capability rows was fetched from its cited URL on 12 Nov 2026 and matched after collapsing whitespace, removing Markdown emphasis/backticks/links and ignoring spaces before punctuation. 76 of 78 still match. The two stale ones were `tunnel` (the old sentence is gone; the page now describes WireGuard, IKEv2 and Tailscale) and `dashboard-create` (the cited JS bundle hash now 404s). Both are corrected below. The quotes in this file are copied verbatim from the live page; where a quote is JSON, the JSON string value is quoted, not the escaped wire form.

## Verdict changes

| Capability | Old | New | Evidence |
|---|---|---|---|
| `mcp-server` | `not-published` | **`yes`** | `https://mcp.freestyle.sh/mcp` answers 401 with OAuth protected-resource metadata (`resource_name: "Freestyle"`, scopes `freestyle:read` and `freestyle:write`); the dashboard has an MCP OAuth consent screen; the privacy policy (updated 5 Nov 2026) describes connecting an AI assistant "through our Model Context Protocol (MCP) integration". |
| `web-terminal` | `partly` | **`yes`** | The VM page in `dash.freestyle.sh` has a Terminal tab that imports xterm.js and connects to the VM PTY over WebSocket (`/api/accounts/.../vms/.../pty`). |
| `roles` | `not-published` | **`partly`** | The team page has Owner and Member roles: an owner "will be able to manage members, invitations and team settings — including removing you"; a member "keeps access to the account's resources but can no longer manage the team." No read-only or resource-scoped role. |
| `backups` | `not-published` | **`no`** | Terms §5: "Nothing here is a backup service. Snapshots and VM disks live on infrastructure that can fail, and a VM can be restarted or replaced. Keep your own copies of anything you cannot lose." Snapshots are manual. |
| `schedules` | `not-published` | **`no`** | 9 Sep 2026 changelog: "We've deprecated the standalone Git, code execution, web deployment, and scheduled trigger APIs." Current platform list is VMs, snapshots, networking, domains, identities; cron inside a VM stops when it pauses. |

## Specifics changed, verdict unchanged

| Capability | What changed |
|---|---|
| `tunnel` | Now WireGuard (default), IKEv2 for Apple devices, and a Tailscale managed subnet router — not WireGuard only. |
| `static-ip` | Each VM now has a **stable public IPv6** assigned at create and kept for life. Outbound IPv4 is still one shared account address the API calls optional and does not promise. Verdict stays `partly`, but the shortfall must say IPv6 is stable and IPv4 is not. |
| `raw-tcp` | Direct TCP/UDP ingress over the VM's public IPv6 is possible with a firewall rule; TLS passthrough on 443 remains. Postgres (5432) and IMAPS (993) are new protocol fronts. |
| `ssh` | Native SSH through a CLI login (`--real-ssh`), local port forwarding (`freestyle vm port-forward`), and VS Code/Cursor/cmux editor URLs are now documented, in addition to scoped-token SSH. |
| `custom-image` | Still snapshot-only, but the 17 Apr changelog says "Create snapshots from Dockerfiles directly on the snapshots page"; current docs only describe configure/build-inside-then-snapshot, and the current dashboard chunks have no Dockerfile UI. Contradiction recorded; verdict stays `partly`. |
| `free-credit` | The YC deal now documents a 12-month credit expiry and **Hobby for 6 months**, alongside $5,000 credits and a 1:1 match up to $25,000. Still YC-only. |
| `dpa` | Privacy policy was re-read; updated 5 Nov 2026, still no DPA, subprocessor list or trust centre. Contact is `founders@freestyle.sh`; Terms use `support@freestyle.sh`. |
| `dashboard-create` | The old `index-BLwRVluh.js` is 404; current bundle is `index-DycbFWV8.js` and still contains `/vms/create` and `/vms/create-many`. |
| `files-survive-stop` | Still `yes`, but the API warns "Some plans cap how long an unused VM is kept" and Terms says Free resources may be reclaimed after inactivity. The cap length is not published. |
| `stay-on` | Still `yes`, but Terms says maintenance can restart VMs; "run forever" is not "never restarted". |
| `browser`, `desktop` | Still `partly` (not in the base image), but the dashboard now has a Displays tab that streams the VM framebuffer and sends keyboard/pointer input, so a buyer need not build noVNC. |
| `hosts-other-agents` | Guide list expanded: OpenAI Agents SDK, Mastra, Jev and OpenClaw are documented; Codex is preinstalled without a guide; Cursor cloud agents, Devin and Claude Managed Agents remain undocumented. |
| `one-click-openclaw` | Still `no`, but OpenClaw *is* preinstalled in the base image; the guide still configures it with npm, a token, allowed origins and a systemd unit. |

## Features (16)

Each line is the current row: verdict, the specifics that matter, the best first-party URL, a verbatim quote, and whether the row changed. **No feature verdict changes.**

- **`isolation` — yes** · Full Linux VM with its own kernel, root, systemd, Docker at boot, nested virtualisation, FUSE and eBPF; GPU and colocated bare metal are private enterprise offers, not public plans. · https://www.freestyle.sh/about.md · "supporting nested virtualization, FUSE, eBPF, full Linux networking and more" · **unchanged**.
- **`sizes-regions` — partly** · Any size up to the plan caps (Free 4 vCPU / 8 GiB / 32 GB; Hobby 8 / 16 / 64; Pro 32 / 64 / 256), default VM is 4 vCPU / 8 GiB / 32 GB, CPU and memory resize live and all three dimensions grow only; no region or EU choice. **New:** plan-wide total budgets (Free 40 vCPU / 80 GiB / 320 GB; Hobby 800 / 1.6 TiB / 3,125 GB; Pro 16,000 / 31.25 TiB / 62,500 GB) and disk is the binding budget on paid plans (Hobby fits ~48 VMs at 64 GB, not 200). · https://www.freestyle.sh/docs/vms/pricing-and-limits · "Every plan can create a VM at any valid size up to its CPU, memory, and disk maximums." · **note changed; verdict unchanged**.
- **`lifecycle` — yes** · 65 ms API-to-ready, pause keeps memory and processes, stop keeps disk and drops memory, live fork; `ttlSeconds` / `maxRunSeconds` / `maxRunTotalSeconds` optional. **New:** `automaticRestart` defaults to `true` — a VM that stops from a VMM crash, kernel panic or host power loss boots again; a user shutdown, pause, `poweroff` or idle timeout leaves it off. · https://www.freestyle.sh/products/vms · "VMs provision in about 65ms from API request to ready machine." · **note changed; verdict unchanged**.
- **`snapshots-forks` — yes** · Snapshots capture memory and disk, are private by default, boot in about a second, are kept until deleted and can be forked from a running VM without pausing. **New:** Terms says snapshots are billed "while they exist"; no scheduled backups. · https://www.freestyle.sh/products/vms · "Clone a running VM without pausing it — get full copies in milliseconds." · **note changed; verdict unchanged**.
- **`storage` — partly** · Persistent VM keeps its disk across a stop, ephemeral VM is deleted; files readable while paused; 16 GiB per file; S3 bucket mountable with FUSE; no separate block volume and no shared Freestyle disk. **New:** snapshot storage is billed (Terms) but the billable size/basis is not published. · https://www.freestyle.sh/docs/vms/files · "no size limit short of 16 GiB per file" · **note changed; verdict unchanged**.
- **`idle-timers` — yes** · `idleTimeoutSeconds` pauses after no network activity; `-1` never; next start or next traffic resumes. No scheduler; cron inside the VM stops when it pauses. · https://www.freestyle.sh/docs/vms/lifecycle · "A VM paused this way resumes on its next start, or on the next traffic that reaches it." · **unchanged**.
- **`reaching-it` — yes** · Public HTTPS with managed certificates, TLS passthrough for non-HTTP, SSH, PTY API, WireGuard/IKEv2/Tailscale tunnels. **New:** dashboard Terminal tab (xterm.js over PTY) and Displays tab (framebuffer + keyboard/pointer); public Postgres (5432) and IMAPS (993) fronts; direct TCP/UDP over the VM's stable public IPv6. · https://www.freestyle.sh/docs/vms/network/tls-inbound · "Use inbound rules to give services on your VM a public domain." · **note changed; verdict unchanged**.
- **`custom-domains` — yes** · Free `style.dev` subdomain with no DNS or certificate work; own domain needs TXT verification, CNAME to `beta-web.freestyle.sh`, `_acme-challenge` delegation; single-label wildcards supported. · https://www.freestyle.sh/docs/vms/domains · "HTTPS is provisioned automatically, once `_acme-challenge` is delegated" · **unchanged**.
- **`outbound-network` — partly** · Default deny; allow by CIDR, VM, VPC, tunnel or exact TLS domain; 50 GB Free / 500 GB paid included, then $0.02/GB; one shared account IPv4 not promised to stay; per-VM stable IPv6. **New catches:** outbound TCP 25/465/587 is blocked (mail must go through an `smtp` TLS rule); SOCKS5 proxy egress is available; domain-specific TLS grants work without broad public egress. · https://www.freestyle.sh/docs/vms/network/firewall · "A VM cannot open TCP 25, 465, or 587 to the public Internet." · **note changed; verdict unchanged**.
- **`keys-secrets` — yes** · Credentials are injected at the edge into HTTP headers, Postgres auth and S3 requests; the VM holds placeholders, not keys; scoped identity tokens limit an end user to named VMs and Linux users. **New:** scoped S3 signing, request-specific JSON Patch transforms, and an experimental **virtual FIDO security key** that lets native passkey clients such as `tsh` approve with a browser passkey. · https://www.freestyle.sh/docs/vms/network/tls-outbound · "Credential injection lets the VM authenticate without receiving the real API key or database password." · **note changed; verdict unchanged**.
- **`ways-to-drive` — yes** · Dashboard, `freestyle` CLI, TypeScript SDK (`npm install freestyle@latest`), OpenAPI 3.1, PTY/file APIs, and an official remote **MCP server** at `mcp.freestyle.sh` (OAuth, read/write scopes). Python remains the older Sandboxes SDK. · https://www.freestyle.sh/docs/cli · "Use the `freestyle` CLI for interactive administration, debugging, and automation scripts." · **note changed; verdict unchanged**.
- **`built-in-agents` — partly** · Claude Code, Codex, opencode and OpenClaw are preinstalled in the Ubuntu image and on PATH; no prompt API; Hermes has no image/template/guide; OpenClaw has a terminal guide, not one-click; browser and GNOME desktop come from guides. · https://www.freestyle.sh/docs/vms/base-snapshots · "claude, codex, opencode, and openclaw, also installed in the shared Node tree" · **unchanged**.
- **`teams-accounts` — partly** · Teams, invites, team switching, team-scoped API keys and per-VM identities exist. **Correction:** the team page has **Owner** and **Member** roles (owner manages members/invitations/settings; member keeps resource access but cannot manage the team). No read-only role, dollar spend cap or usage alert; SAML SSO/SCIM and audit logs are Enterprise-only. · https://dash.freestyle.sh/assets/accounts._accountId.team-DqfbRWf0.js · "will be able to manage members, invitations and team settings — including removing you." · **note changed; verdict unchanged**.
- **`billing-models` — partly** · Per-second meter on allocated vCPU, memory and storage; monthly allowances on every plan; Hobby $50 and Pro $500 are minimums usable as usage; no flat machine price; measured CPU is Enterprise-only. **New:** plan-wide total vCPU/memory/disk budgets cap fleets; disk is the binding budget on Hobby/Pro. · https://www.freestyle.sh/docs/vms/pricing-and-limits · "The Hobby and Pro monthly fees are a usage credit, not a surcharge" · **note changed; verdict unchanged**.
- **`trials-free-tiers` — yes** · Free is an ongoing tier: 200 vCPU-h, 400 GiB-h memory, 60,000 GiB-h storage and 50 GB transfer a month, no card, hard stop rather than overage. YC founders get $5,000 credits, a 1:1 match up to $25,000, 12-month expiry and Hobby for 6 months; no general signup credit. **New caveat:** Free resources may be reclaimed after inactivity (period unpublished). · https://www.freestyle.sh/products/vms · "No credit card required." · **note changed; verdict unchanged**.
- **`company` — partly** · Freestyle Cloud Inc., founded 2024, YC Summer 2024, 5 employees in San Francisco; status page all operational on 12 Nov 2026; 99.99% SLA Enterprise-only; no SOC 2 report, trust centre or DPA page. **Correction:** Terms of Service are published at `dash.freestyle.sh/terms` (effective 30 Aug 2026, version 2026-08-30); privacy policy updated 5 Nov 2026. · https://www.freestyle.sh/status · "All Systems Operational" · **note changed; verdict unchanged**.

## Capabilities (78)

All 78 rows, grouped by feature. `Specifics` is the current figure/note; `Catch` is the required plain-language shortfall for a `partly`. The URL and quote are the evidence to keep (or the new evidence where marked). **unchanged** means the verdict, specifics and quote still match the live page on 12 Nov 2026; it does not mean the provider has not shipped other things.

### Isolation (`isolation`)
- **`own-vm` — yes** · Full VM, own kernel — A hardware-virtualised Linux VM with systemd, not a shared-kernel container. · https://www.freestyle.sh/docs/vms · "Freestyle VMs are full Linux virtual machines designed for long-running, complex tasks." · unchanged
- **`root` — yes** · root via vm.linuxUser — The default ubuntu user has passwordless sudo; vm.linuxUser("root") runs as root. · https://www.freestyle.sh/docs/onboard.md · "Freestyle provides real Linux VMs with full root, live forking, and pause/resume" · unchanged
- **`docker-inside` — yes** · Docker preinstalled — Docker Engine, Compose and Buildx are in every Ubuntu base snapshot and start at boot. · https://www.freestyle.sh/docs/guides/run-docker-in-a-sandbox · "Docker is already installed in all Ubuntu base snapshots" · unchanged
- **`nested-virt` — yes** · Full KVM — The company says the platform supports nested virtualisation, FUSE and eBPF. · https://www.freestyle.sh/about.md · "supporting nested virtualization, FUSE, eBPF, full Linux networking and more" · unchanged
- **`custom-image` — partly** · Snapshot only. Catch: No image import: configure a VM or build a Docker image inside it, then snapshot; the Apr 17 changelog claims Dockerfile snapshots but current docs and dashboard do not show them. Base images are Ubuntu, Kali and BusyBox; a custom base is a snapshot of a configured VM. · https://www.freestyle.sh/docs/vms/base-snapshots · "Start from a base snapshot, set it up however you want, resize if you need more, and capture its exact memory and disk." · same verdict; **Dockerfile contradiction recorded**

### Sizes and regions (`sizes-regions`)
- **`any-size` — yes** · Any size to plan cap — CPU and memory are chosen freely up to the plan maximum; no fixed shape list. · https://www.freestyle.sh/pricing.md · "Every plan can create a VM at any valid size up to its CPU, memory, and disk maximums." · unchanged
- **`big-machines` — yes** · 32 vCPU / 64 GiB (Pro) — The 64 vCPU / 128 GiB image needs custom Enterprise limits. · https://www.freestyle.sh/products/vms · "Full Linux VMs with up to 32 vCPUs, 64 GB RAM, instant startup, and live forking." · unchanged
- **`live-resize` — yes** · CPU/RAM live; disk grow-only — All three dimensions only grow; shrinking means creating a new VM. · https://www.freestyle.sh/docs/vms/lifecycle · "Resizing happens live. On a running VM the new CPU and memory come online without a reboot, and the disk grows in place while the guest keeps running." · unchanged
- **`gpu` — partly** · Catch: GPUs are a private enterprise offer with no published price or self-serve route. · https://www.freestyle.sh/about.md · "GPU Sandboxes: Freestyle offers private GPU sandboxes for enterprise customers" · unchanged
- **`choose-region` — no** · No region or location field appears in the create-VM request; placement is described as internal. · https://www.freestyle.sh/openapi.json · "Placement and topology internals (hosting manager, VXLAN ids, node-local network allocation) are not part of this contract." · unchanged
- **`eu-region` — not-published** · No EU region or data-residency option is published anywhere in the docs or API. · https://www.freestyle.sh/openapi.json · "Placement and topology internals (hosting manager, VXLAN ids, node-local network allocation) are not part of this contract." · unchanged

### Lifecycle (`lifecycle`)
- **`pause-memory` — yes** · Memory and processes — A paused VM keeps open files, processes and memory; start resumes in place. · https://www.freestyle.sh/docs/vms/lifecycle · "Pausing freezes the VM and saves its memory." · unchanged
- **`warm-pool` — not-published** · No pool of pre-started machines is documented; VMs and base snapshots start in about a second. · https://www.freestyle.sh/docs/vms/base-snapshots · "Boot a base snapshot by passing its slug as snapshotId. They start in about a second" · unchanged
- **`fast-start` — yes** · 65 ms; p99 < 400 ms — The marketing page says 65 ms; the docs claim p99 under 400 ms. · https://www.freestyle.sh/products/vms · "VMs provision in about 65ms from API request to ready machine." · unchanged

### Snapshots and forks (`snapshots-forks`)
- **`snapshot-files` — yes** · Snapshot disk — A snapshot captures the disk and can boot a new VM. · https://www.freestyle.sh/docs/vms/base-snapshots · "Start from a base snapshot, set it up however you want, resize if you need more, and capture its exact memory and disk." · unchanged
- **`snapshot-memory` — yes** · Memory + disk — Snapshots copy the VM's exact memory and disk state. · https://www.freestyle.sh/about.md · "These snapshots can be used to create new VMs in the exact state of the original VM (memory and disk)." · unchanged
- **`fork-running` — yes** · Live fork — A running VM can be cloned without pausing it, memory included. · https://www.freestyle.sh/products/vms · "Clone a running VM without pausing it — get full copies in milliseconds." · unchanged
- **`older-snapshot` — yes** · Snapshots are kept until deleted and can be booted by id or slug, so an older one can be chosen. · https://www.freestyle.sh/docs/vms/pricing-and-limits · "snapshots are kept until you delete them" · unchanged
- **`templates` — yes** · Custom snapshots — A configured VM becomes a private snapshot that many new VMs can boot from. · https://www.freestyle.sh/docs/vms/base-snapshots · "New snapshots are private, and snapshot() returns once the snapshot is fully materialized and ready to boot." · unchanged
- **`backups` — no** · Manual snapshots. Snapshots are taken when you ask and kept until deleted; the Terms disclaim a backup service and tell you to keep your own copies. · https://dash.freestyle.sh/terms · "Nothing here is a backup service." · **CHANGED: not-published → no** (Terms §5)

### Storage (`storage`)
- **`files-survive-stop` — yes** · Persistent VM keeps disk. A persistent VM keeps its disk across a stop; an ephemeral VM is deleted. Some plans cap how long an unused VM is kept, and the cap is not published. · https://www.freestyle.sh/docs/vms/lifecycle · "A stopped VM keeps its disk but discards its memory." · same verdict; **plan-cap caveat added**
- **`volumes` — partly** · Catch: No separate volume: files outlive a VM only as a snapshot you boot a new VM from. · https://www.freestyle.sh/docs/vms/base-snapshots · "Start from a base snapshot, set it up however you want, resize if you need more, and capture its exact memory and disk." · unchanged
- **`shared-volume` — partly** · Catch: No shared volume; several VMs can share an S3 bucket mounted with FUSE. · https://www.freestyle.sh/docs/guides/mount-s3-object-storage-in-a-sandbox · "Mount an S3 bucket at a path in a sandbox so that any process reads and writes it like a local directory." · unchanged
- **`mount-buckets` — yes** · S3 via FUSE — An S3-compatible bucket mounts at a path with rclone; a cache stays on the VM disk. · https://www.freestyle.sh/docs/guides/mount-s3-object-storage-in-a-sandbox · "Mount an S3 bucket at a path in a sandbox so that any process reads and writes it like a local directory." · unchanged
- **`big-disk` — yes** · 256 GB (Pro) — Free stops at 32 GB, Hobby at 64 GB, Pro at 256 GB. · https://www.freestyle.sh/pricing.md · "| Max disk per VM | 32 GB | 64 GB | 256 GB |" · unchanged

### Idle timers (`idle-timers`)
- **`stay-on` — yes** · No default run limit. Run limits are optional (ttlSeconds, maxRunSeconds, maxRunTotalSeconds); none is set by default. Terms says maintenance can restart VMs, and autoDeleteSeconds may be capped by plan. · https://www.freestyle.sh/about.md · "Freestyle VMs can run forever" · same verdict; **maintenance/cap caveat added**
- **`choose-idle` — yes** · idleTimeoutSeconds; −1 never — The timeout is set per VM and can be removed with −1. · https://www.freestyle.sh/docs/vms/lifecycle · "Configure an idle timeout to let Freestyle pause VMs that have no network activity." · unchanged
- **`wake-on-request` — yes** · Traffic wakes it — The next start or the next request that reaches a paused VM resumes it. · https://www.freestyle.sh/docs/vms/lifecycle · "A VM paused this way resumes on its next start, or on the next traffic that reaches it." · unchanged
- **`schedules` — no** · No scheduler. The old scheduled-trigger API is deprecated; the current platform is VMs, snapshots, networking, domains and identities. Cron inside a VM stops when it pauses. · https://www.freestyle.sh/changelog · "We've deprecated the standalone Git, code execution, web deployment, and scheduled trigger APIs." · **CHANGED: not-published → no** (Sep 9 changelog)

### Reaching it (`reaching-it`)
- **`public-url` — yes** · style.dev or own domain — A TLS rule routes a hostname to a VM port over HTTPS. · https://www.freestyle.sh/docs/vms/network/tls-inbound · "Use inbound rules to give services on your VM a public domain." · unchanged
- **`private-url` — partly** · Catch: You must run your own authorizer; forward auth gates a public URL but there is no built-in share link. · https://www.freestyle.sh/docs/vms/forward-auth · "Forward auth lets your application decide whether each public HTTP request may reach a VM." · unchanged
- **`ssh` — yes** · beta-ssh; port forwarding. Standard SSH to beta-ssh.freestyle.sh with a CLI login or scoped identity token; local port forwarding; VS Code/Cursor/cmux editor URLs. · https://www.freestyle.sh/docs/vms/ssh · "Freestyle VMs accept SSH through `beta-ssh.freestyle.sh`." · same verdict; **specifics expanded** (port-forward, editors)
- **`web-terminal` — yes** · Dashboard terminal. The VM page in dash.freestyle.sh has a Terminal tab that loads xterm.js and connects to the VM PTY over WebSocket; the SDK also has browser clients with scoped tokens. · https://dash.freestyle.sh/assets/accounts._accountId.vms._vmId-Bxu2tT9k.js · "Terminal is offline" · **CHANGED: partly → yes** (dashboard bundle; baseline said no hosted terminal)
- **`tunnel` — yes** · WireGuard, IKEv2, Tailscale. Default WireGuard tunnel into a VPC; Apple devices can use IKEv2; a tailscale tunnel runs a managed subnet router in your tailnet. Attach/detach networks without re-downloading config. · https://www.freestyle.sh/docs/vms/network/tunnels · "The default tunnel type uses WireGuard; a `tailscale` tunnel runs a managed subnet router in your tailnet." · same verdict; **specifics changed** (old WireGuard-only quote gone)
- **`raw-tcp` — yes** · TLS passthrough; public IPv6. TLS passthrough on 443 for any protocol, Minecraft/IMAP/Postgres protocol fronts, and direct TCP/UDP inbound over the VM stable public IPv6 if the firewall allows it. · https://www.freestyle.sh/docs/vms/network/tls-inbound · "Set `protocol: "tcp"` and the edge matches the name in the client's ClientHello and splices the connection to the VM without terminating it." · same verdict; **specifics expanded** (public IPv6, Postgres)

### Custom domains (`custom-domains`)
- **`custom-domain` — yes** · Verified domain — A verified domain routes to a VM port; single-label wildcards are supported. · https://www.freestyle.sh/docs/vms/domains · "Any unused subdomain of style.dev is yours to take, with no verification, no DNS records, and no certificate of your own." · unchanged
- **`auto-https` — yes** · Managed certificate — Freestyle terminates HTTPS and issues the certificate once the ACME challenge is delegated. · https://www.freestyle.sh/docs/vms/domains · "HTTPS is provisioned automatically, once _acme-challenge is delegated" · unchanged

### Outbound network (`outbound-network`)
- **`egress-included` — yes** · 50 GB free; 500 GB paid — Beyond the allowance, transfer is $0.02 per GB; VPC-internal traffic is not billed. · https://www.freestyle.sh/pricing.md · "Free includes 50 GB a month, and Hobby and Pro include 500 GB before transfer is priced." · unchanged
- **`egress-allowlist` — yes** · Domain or CIDR rules — Firewall rules and per-domain TLS grants limit what a VM can reach; broad public grants can be left off. · https://www.freestyle.sh/docs/vms/network/tls-outbound · "To allow only these domains, leave broad public-egress firewall grants unset." · unchanged
- **`no-internet` — yes** · Default deny — A VM with no rules reaches nothing; internet access needs an explicit allow rule. · https://www.freestyle.sh/openapi.json · "A VM gets nothing implicitly — no outbound Internet, no inbound" · unchanged
- **`static-ip` — partly** · Stable IPv6; shared IPv4. Catch: Outbound IPv4 is one account-wide address the API calls optional and does not promise; the per-VM IPv6 is stable, but many services only whitelist IPv4. Each VM gets a stable public IPv6 assigned at create and kept for life; outbound IPv4 is shared across the account and not guaranteed. · https://www.freestyle.sh/openapi.json · "The VM's stable public IPv6 address — assigned at create and kept for the VM's life, across restarts and moves between machines." · same verdict; **shortfall updated** (stable IPv6 added)

### Keys and secrets (`keys-secrets`)
- **`secrets-store` — no** · Credentials are injected into outbound requests at the edge; they are not put into the guest as environment variables. · https://www.freestyle.sh/docs/vms/network/tls-outbound · "Credential injection lets the VM authenticate without receiving the real API key or database password." · unchanged
- **`hidden-secrets` — yes** · Edge header injection — Stored header values are encrypted and read back as "***"; the VM sends a placeholder. · https://www.freestyle.sh/docs/vms/network/tls-outbound · "Credential injection lets the VM authenticate without receiving the real API key or database password." · unchanged
- **`scoped-keys` — yes** · Per-VM identity tokens — An identity token is limited to the VMs and Linux users granted to it; the account key stays server-side. · https://www.freestyle.sh/docs/vms/client-sessions · "Freestyle identities let an end user or agent operate an existing VM without receiving your team API key." · unchanged

### Ways to drive (`ways-to-drive`)
- **`dashboard-create` — yes** · dash.freestyle.sh. The dashboard bundle includes /vms/create (and /vms/create-many); the VM list has a create flow. · https://dash.freestyle.sh/assets/index-DycbFWV8.js · "/vms/create" · same verdict; **old bundle URL 404, new hash**
- **`cli` — yes** · freestyle CLI — The CLI covers VMs, snapshots, VPCs, tunnels, firewall, TLS, domains, identities and tokens. · https://www.freestyle.sh/docs/cli · "Use the freestyle CLI for interactive administration, debugging, and automation scripts." · unchanged
- **`python-sdk` — partly** · Catch: The published Python package is the older Sandboxes SDK (0.0.17); current VM docs are TypeScript-only. · https://pypi.org/pypi/freestyle/json · "Freestyle Sandboxes Python SDK" · unchanged
- **`ts-sdk` — yes** · npm freestyle — The TypeScript SDK is the documented client and includes the CLI. · https://www.freestyle.sh/docs/quickstart · "npm install freestyle@latest" · unchanged
- **`rest-api` — yes** · OpenAPI 3 — A full OpenAPI document is served at /openapi.json. · https://www.freestyle.sh/openapi.json · "Documentation: [freestyle.sh/docs](https://freestyle.sh/docs)" · unchanged
- **`mcp-server` — yes** · mcp.freestyle.sh. Official remote MCP endpoint at https://mcp.freestyle.sh/mcp over HTTPS, OAuth with freestyle:read and freestyle:write scopes; the tool list requires sign-in and is not in the docs index. · https://www.freestyle.sh/privacy · "connect an AI assistant to Freestyle through our Model Context Protocol (MCP) integration" · **CHANGED: not-published → yes** (privacy policy updated 5 Nov 2026; endpoint metadata live)
- **`pty` — yes** · PTY over WebSocket — A PTY survives disconnects and can be reattached by id or slug. · https://www.freestyle.sh/docs/vms/pty · "A PTY (pseudo-terminal) is an interactive process inside a VM." · unchanged
- **`file-api` — yes** · 16 GiB per file — Reads, writes, directory listing and ranged reads work, including while the VM is paused. · https://www.freestyle.sh/docs/vms/files · "no size limit short of 16 GiB per file" · unchanged

### Built-in agents (`built-in-agents`)
- **`agents-preinstalled` — yes** · Claude Code, Codex, opencode — OpenClaw is installed too; the agents live in the shared Node tree and are on PATH. · https://www.freestyle.sh/docs/vms/base-snapshots · "claude, codex, opencode, and openclaw, also installed in the shared Node tree" · unchanged
- **`prompt-api` — no** · You run the agent yourself; there is no prompt endpoint or managed agent loop. · https://www.freestyle.sh/docs/guides/run-claude-code-in-a-sandbox · "Bake Claude Code into a VM snapshot, then run it over PTY, one-off prompts, or the Claude Agent SDK." · unchanged
- **`one-click-hermes` — no** · The preinstalled agent list is Claude Code, Codex, opencode and OpenClaw; there is no Hermes image, template or guide. · https://www.freestyle.sh/docs/vms/base-snapshots · "claude, codex, opencode, and openclaw, also installed in the shared Node tree" · unchanged
- **`one-click-openclaw` — no** · Terminal guide. OpenClaw is preinstalled in the base image, but the guide installs/configures it through npm, a token, allowed origins and a systemd unit; there is no one-click template. · https://www.freestyle.sh/docs/guides/run-openclaw-in-a-sandbox · "Install the `openclaw` CLI with `npm` and pick the default agent model" · same verdict; **preinstalled but not one-click**
- **`browser` — partly** · Install Chromium. Catch: Chromium is not in the base image; a guide installs it and drives it over CDP. The dashboard can stream the display, but the browser is yours to install. Headless or headed Chromium via guide; CDP control; noVNC or dashboard Displays for a human. · https://www.freestyle.sh/docs/guides/run-chromium-and-chrome-in-a-sandbox · "The base VM is intentionally small, and browser installs pull many GTK, font, and media packages." · same verdict; **display surface noted**
- **`desktop` — partly** · Build GNOME. Catch: No desktop in the base image; a guide builds GNOME with TigerVNC/noVNC. The dashboard can stream and control the display, but you still install the desktop. GNOME Shell 48 on Debian 13, TigerVNC + noVNC; dashboard Displays tab can show and control a framebuffer. · https://www.freestyle.sh/docs/guides/run-gnome-in-a-sandbox · "Build a GNOME desktop with TigerVNC, Chromium, and noVNC, then snapshot and reuse it." · same verdict; **display surface noted**
- **`hosts-other-agents` — partly** · 8 agent guides. Catch: Guides cover Claude Code, Copilot, t3, Omnara, OpenAI Agents SDK, Mastra, Jev and OpenClaw; Codex is preinstalled without a guide. Cursor cloud agents, Devin and Claude Managed Agents are not documented. First-party guides cover several agent platforms, but not every named platform. · https://www.freestyle.sh/docs/guides/give-your-openai-agent-a-sandbox · "Give an OpenAI Agents SDK agent a fresh Linux VM by implementing SandboxClient." · same verdict; **guide list expanded**

### Teams and accounts (`teams-accounts`)
- **`team-workspace` — yes** · Teams and team keys — A CLI login can list and switch teams; an API key belongs to one team. · https://www.freestyle.sh/docs/cli · "freestyle team list" · unchanged
- **`roles` — partly** · Owner/member. Catch: Only two team roles: an owner manages members, invitations and settings, while a member keeps full resource access; there is no read-only or resource-scoped role. The team page distinguishes owner and member and lets an owner promote or demote; the docs still do not describe roles. · https://dash.freestyle.sh/assets/accounts._accountId.team-DqfbRWf0.js · "will be able to manage members, invitations and team settings — including removing you." · **CHANGED: not-published → partly** (dashboard role controls)
- **`sso` — partly** · Catch: SAML SSO and SCIM are Enterprise-only. — No SSO option is published for Free, Hobby or Pro. · https://www.freestyle.sh/pricing.md · "Enterprise plans add custom usage limits, SAML SSO & SCIM, audit logs, a 99.99% SLA, and dedicated support" · unchanged
- **`spend-cap` — not-published** · Free stops at its allowance, but no account-level dollar cap is published for Hobby or Pro. · https://www.freestyle.sh/pricing.md · "On Free, they are hard allowances and usage does not continue into paid overage." · unchanged
- **`usage-alerts` — not-published** · The wallet charts estimated daily usage; no alert threshold or email is documented. · https://www.freestyle.sh/changelog · "The wallet now charts estimated daily usage by vCPU, memory, storage, and data transfer" · unchanged
- **`audit-log` — partly** · Catch: Audit logs are Enterprise-only. — No audit log is listed for Free, Hobby or Pro. · https://www.freestyle.sh/pricing.md · "Enterprise plans add custom usage limits, SAML SSO & SCIM, audit logs, a 99.99% SLA, and dedicated support" · unchanged

### Billing models (`billing-models`)
- **`per-second` — yes** · Per-second meter — Usage is metered per second, then billed by the hour of resource used. · https://www.freestyle.sh/docs/vms/pricing-and-limits · "Compute is metered per second and billed per hour of resource used." · unchanged
- **`active-cpu` — partly** · Catch: Public plans bill allocated vCPU whether busy or not; measured CPU is an Enterprise option. · https://www.freestyle.sh/pricing.md · "Active CPU pricing — bill on measured CPU time rather than allocated vCPU" · unchanged
- **`cheap-pause` — yes** · Storage only — Pausing releases the compute reservation; storage keeps billing. · https://www.freestyle.sh/docs/vms/pricing-and-limits · "A paused VM holds no compute reservation, so it bills only for storage while it sleeps." · unchanged
- **`no-monthly-fee` — partly** · Catch: Free has no fee but hard caps; paid use starts at a $50 monthly minimum. · https://www.freestyle.sh/pricing.md · "| **Hobby** | $50/month minimum, including $50 usage | Up to 40 |" · unchanged
- **`flat-price` — no** · Plans are minimums, not flat machine prices; usage above the minimum is metered. · https://www.freestyle.sh/docs/vms/pricing-and-limits · "The Hobby and Pro monthly fees are a usage credit, not a surcharge" · unchanged

### Trials and free tiers (`trials-free-tiers`)
- **`free-tier` — yes** · 200 vCPU-h/month — Free also includes 400 GiB-hours of memory, 60,000 GiB-hours of storage and 50 GB of transfer each month. · https://www.freestyle.sh/pricing.md · "| Hour of vCPU | $0.04032 | 200 per month |" · unchanged
- **`free-credit` — partly** · $5k YC + 6mo Hobby. Catch: Only YC founders: no general signup credit. $5,000 credits plus a 1:1 match on up to $25,000 of spend; credits last 12 months and include Hobby for 6 months. · https://www.freestyle.sh/yc.md · "The credits last 12 months and include the Hobby plan for 6 months." · same verdict; **specifics expanded** (12-month expiry, 6 months Hobby)
- **`no-card` — yes** · Free plan, no card — Adding a card to a Free account triggers a $1 verification that is refunded. · https://www.freestyle.sh/products/vms · "No credit card required." · unchanged

### Company (`company`)
- **`status-page` — yes** · freestyle.sh/status — Shows VMs, API and dashboard status; all operational and last updated 12 November 2026. · https://www.freestyle.sh/status · "All Systems Operational" · same verdict; **status date updated**
- **`sla` — partly** · Catch: The 99.99% SLA is Enterprise-only; no SLA is published for Free, Hobby or Pro. · https://www.freestyle.sh/pricing.md · "Enterprise plans add custom usage limits, SAML SSO & SCIM, audit logs, a 99.99% SLA, and dedicated support" · unchanged
- **`soc2` — not-published** · No SOC 2 report or trust centre is published; the Enterprise list names SSO, audit logs and an SLA but no audit report. · https://www.freestyle.sh/pricing.md · "Enterprise plans add custom usage limits, SAML SSO & SCIM, audit logs, a 99.99% SLA, and dedicated support" · unchanged
- **`dpa` — not-published** · No DPA, subprocessor list or trust centre. Privacy (updated 5 Nov 2026) gives founders@freestyle.sh; Terms give support@freestyle.sh; neither mentions a DPA. · https://www.freestyle.sh/privacy · "please contact us at founders@freestyle.sh" · same verdict; **privacy re-read 12 Nov**
- **`open-source` — no** · Hosted only; no self-hosted edition or platform licence is published. The CLI repository has no licence file. · https://www.freestyle.sh/about.md · "Freestyle builds and maintains its own custom virtualization solutions" · unchanged


## Rates and plan inputs (original units)

**No numeric rate-card input changed.** The current money pages were read fresh and agree with the 30 Oct card. The only additions are plan-wide limits and documentation detail, not prices.

### Plans

| Plan | Price | Concurrent VMs | Saved VMs | Snapshots | Max vCPU / VM | Max RAM / VM | Max disk / VM | Total vCPU | Total RAM | Total disk |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Free | $0 | 10 | 10 | 10 | 4 | 8 GiB | 32 GB | 40 | 80 GiB | 320 GB |
| Hobby | $50/month minimum, including $50 usage | 40 | 200 | 1,000 | 8 | 16 GiB | 64 GB | 800 | 1.56 TiB | 3,125 GB |
| Pro | $500/month minimum, including $500 usage | 400 | 4,000 | 12,000 | 32 | 64 GiB | 256 GB | 16,000 | 31.25 TiB | 62,500 GB |
| Enterprise | Custom | Custom | Custom | Custom | Custom | Custom | Custom | Custom | Custom | Custom |

Quote: "| **Hobby** | $50/month minimum, including $50 usage | Up to 40 |" — https://www.freestyle.sh/pricing.md

Quote: "Your VMs draw on a resource budget in vCPU, memory, and disk." — https://www.freestyle.sh/docs/vms/pricing-and-limits

### Unit rates

| Resource | Rate | Free included (monthly) |
|---|---:|---:|
| vCPU-hour | $0.04032 | 200 |
| GiB-hour of memory | $0.0129 | 400 |
| GiB-hour of storage | $0.000086 | 60,000 |
| GB of data transfer | $0.02 | 50 on Free; 500 on Hobby and Pro |

Quote: "| Hour of vCPU | $0.04032 | 200 per month |" — https://www.freestyle.sh/pricing.md

The meter is **allocated**, not active: "vCPU, memory and storage are all billed on the amount allocated to the VM for the time it is allocated — a reserved core is yours whether or not the guest is busy." — https://www.freestyle.sh/docs/vms/pricing-and-limits

### Free tier

- $0, no recurring charge, no credit card. A card, if added, gets a **$1 USD verification** charge that is automatically refunded in full; it adds no credit.
- 10 concurrent VMs, 10 saved VMs, 10 snapshots, 4 vCPU / 8 GiB / 32 GB per VM, 40 vCPU / 80 GiB / 320 GB total.
- 200 vCPU-hours, 400 GiB-hours of memory, 60,000 GiB-hours of storage and 50 GB of transfer each month.
- Hard stop: exhausting a compute allowance **pauses** affected VMs until you resume them after the reset; it does not bill overage.
- Terms: "Free-tier resources may be reclaimed after a period of inactivity." The inactivity period is not published.

### What changed in the rate-card inputs

- **Plans:** unchanged (Free $0, Hobby $50 minimum incl. $50 usage, Pro $500 minimum incl. $500 usage, Enterprise custom).
- **Unit rates:** unchanged ($0.04032 / $0.0129 / $0.000086 / $0.02).
- **Monthly allowances:** unchanged (200 / 400 / 60,000; transfer 50 Free, 500 Hobby/Pro).
- **Free tier:** unchanged (no card, hard stop, same caps). Terms adds a reclamation caveat.
- **Egress:** unchanged; VPC-internal traffic is still not billed.
- **$1 card verification:** unchanged.
- **YC credit:** same $5,000 + 1:1 match up to $25,000, but the offer page now documents **12-month expiry** and **Hobby for 6 months**.
- **New non-rate limits:** total vCPU / memory / disk budgets per plan; default VM 4 vCPU / 8 GiB / 32 GB; snapshots 10 / 1,000 / 12,000; saved VMs 10 / 200 / 4,000.
- **New billing statement:** Terms §4: "stored disks and snapshots are billed while they exist." This confirms snapshot storage is billable but does not publish the billable size or a separate rate.

### A/B/C

**No A/B/C input changed.** The shapes, hours, CPU-busy assumptions, disk-retention assumptions, plan choice and allowances are the same as 30 Oct. The site's existing totals therefore stand: A $50.00 on Hobby, B $179.85 on Hobby, C $50.00 on Hobby (the C flag about Free persistence is still the only open interpretation; under the docs' `✓` Free would be $0.00, under the pricing page's `✗` Free it is $50.00 on Hobby). The new total-resource budgets do not bind any of the three single-VM cases: A uses 2/40 vCPU, B 4/800, C 2/40 on Hobby, all far below the 800 vCPU / 1.56 TiB / 3,125 GB Hobby budget.

### Rate-card model limitations

- `RateCard` has no field for the plan-wide **total vCPU / memory / disk budgets**; a fleet can hit the disk budget before the saved-VM count. The three presets are single-VM and are unaffected.
- `RateCard` has no field for the **default VM size** (4 vCPU / 8 GiB / 32 GB). The engine always uses an explicit shape, so this is a documentation gap rather than a pricing error.
- **Snapshot storage** is billed per Terms but has no published billable size or separate rate. The card cannot add it; the notes must say so.
- **Free persistence** is still a two-sided first-party claim; the card follows the stricter `/pricing` page (`noKeep: true`), so C is priced on Hobby.
- **Outbound mail** is blocked on 25/465/587, but an `smtp` TLS rule can broker it. No price is attached to the rule, so the card treats mail as ordinary transfer.
- **Measured-CPU / node-based / commitment** pricing is Enterprise-only and unpublished; the card uses allocated vCPU.

## Contradictions between first-party pages (both sides kept)

### 1. Free persistence — docs say yes, pricing page says no (still open)

- Docs plan table: "Persistent VMs ✓ ✓ ✓"; prose: "**Persistent VMs** keep their disk once stopped, so they can start again." — https://www.freestyle.sh/docs/vms/pricing-and-limits
- Pricing page limit table: "Persistent VMs ✗ ✓ ✓" and "Persistent Snapshots ✗ ✓ ✓". — https://www.freestyle.sh/pricing
- Same docs page, downgrade paragraph: "If a plan is downgraded while a running VM is too large or uses persistence the new plan does not allow, that VM is paused with its disk and memory preserved." This implies some plans do **not** allow persistence.
- Terms: "Free-tier resources may be reclaimed after a period of inactivity." — https://dash.freestyle.sh/terms

**Interpretation used by the site:** Free can keep a stopped disk only within an unpublished reclamation window, not indefinitely; the calculator follows the stricter `/pricing` page, so a stopped-and-kept machine is priced on Hobby ($50). If the docs table is right, C is $0 on Free. The Terms reclamation clause and the downgrade sentence lean toward the pricing page, so the conservative choice is now better supported, but the contradiction is not resolved.

### 2. Disk units — GB in the docs, GiB on the pricing page (still open)

- Docs: "| Max disk per VM | 32 GB | 64 GB | 256 GB |" and total disk "320 GB | 3,125 GB | 62,500 GB". — https://www.freestyle.sh/pricing.md
- Pricing page: "Max Disk per VM 32 GiB 64 GiB 256 GiB" and "Total Disk 320 GiB 3,125 GiB 62,500 GiB". — https://www.freestyle.sh/pricing

**Interpretation used:** GiB, because the meter is explicitly per GiB-hour and the base images list GiB. The difference is about 7% at the cap; it does not affect A/B/C, but it does affect the fleet budget table.

### 3. Paused billing — storage only vs "pay nothing" (still open)

- Pricing docs: "A paused VM holds no compute reservation, so it bills only for storage while it sleeps." — https://www.freestyle.sh/docs/vms/pricing-and-limits
- Product page: "Hibernate VMs and resume exactly where you left off — pay nothing while paused." — https://www.freestyle.sh/products/vms
- A Telegram guide repeats: "a paused VM bills nothing" — https://www.freestyle.sh/docs/guides/run-a-telegram-bot-in-a-sandbox

**Interpretation used:** storage keeps billing while paused; CPU and memory stop. The tariff lists storage as a metered resource, the changelog charts storage separately, and the pricing docs are the specific billing page. The marketing lines are shorthand for "no compute charge". Terms now adds: "stored disks and snapshots are billed while they exist" — which supports the storage interpretation.

### 4. Command timeout — five minutes vs 24 hours (still open, explained by agent version)

- VMs page: "The maximum timeout is five minutes" — https://www.freestyle.sh/docs/vms
- 14 Oct changelog: "On VMs with an updated guest agent, `vm.exec()` supports timeouts up to 24 hours. ... older agents retain the five-minute limit." — https://www.freestyle.sh/changelog

**Interpretation used:** both are current for different VMs; the VMs page has not been updated. Not material to any verdict.

### 5. Production positioning — Pro is "for production applications", the company says VMs are not for production applications

- Pricing page, Pro plan: "For teams and production applications." — https://www.freestyle.sh/pricing
- About page: "**Sole Application Hosting**: Freestyle VMs are designed as workbenches for development, experimentation and task execution. Not for hosting production applications." — https://www.freestyle.sh/about.md

**Interpretation used:** the pricing line means "teams building production agent products", not "host your production app on the VM". The profile's `fits.badly` keeps "Production application hosting" with the about-page quote, but the pricing line is a live ambiguity a buyer will notice.

### 6. Deletion — "cannot be recovered" vs asynchronous backup cleanup

- Terms §9: "Deletion starts a grace period, after which your VMs, snapshots, and account data are permanently deleted and cannot be recovered." — https://dash.freestyle.sh/terms
- Privacy: "Backup copies of deleted VM data are removed asynchronously through a cleanup queue; removal is not immediate and its timing depends on queue processing." — https://www.freestyle.sh/privacy

**Interpretation used:** active data is deleted after the grace period; backup copies linger until the cleanup queue reaches them. "Cannot be recovered" is the user-facing promise, not a guarantee of instant purge. The grace-period length is not published. Material for data-sensitive buyers.

### 7. Custom images — changelog says Dockerfile snapshots, current docs/dashboard do not

- 17 Apr changelog: "Create snapshots from Dockerfiles directly on the snapshots page." — https://www.freestyle.sh/changelog
- Base snapshots docs: "Start from a base snapshot, set it up however you want, resize if you need more, and capture its exact memory and disk." — https://www.freestyle.sh/docs/vms/base-snapshots
- Current dashboard chunks have no Dockerfile control; the docs migration table maps an E2B `fromDockerfile` step to "Build and run your Docker image inside the VM".

**Interpretation used:** the Dockerfile snapshot flow was a legacy Sandboxes/dashboard feature or has been removed; the current VM flow is build-inside-then-snapshot. `custom-image` stays `partly` (no image import), and the changelog claim is preserved as a dated contradiction.

### 8. Snapshot billing — Terms says billed, tariff gives no basis

- Terms §4: "Metered resources accrue while they are allocated ... stored disks and snapshots are billed while they exist." — https://dash.freestyle.sh/terms
- Pricing docs: the tariff lists only "Hour of vCPU", "Hour of GiB memory", "Hour of GiB storage" and "GB of data transfer"; no snapshot line, and the billable size of a snapshot is not published. — https://www.freestyle.sh/docs/vms/pricing-and-limits

**Interpretation used:** snapshots are billable at the storage rate, but the billable size (disk only? memory too? compressed?) is unknown, so the calculator adds nothing. This is an omission, not a contradiction; the Terms sentence is the strongest first-party confirmation that the omission is real.

### 9. MCP — documented in the privacy policy, absent from the docs index

- Privacy: "connect an AI assistant to Freestyle through our Model Context Protocol (MCP) integration" — https://www.freestyle.sh/privacy
- Docs index: 94 pages, none about MCP; `https://www.freestyle.sh/docs/mcp` is 404. — https://www.freestyle.sh/docs/llms.txt

**Interpretation used:** the MCP server is real and first-party (`mcp.freestyle.sh`, OAuth, read/write scopes) but undocumented in the product docs. The capability is `yes`; the tool list is not published and requires sign-in.

### 10. Create-time sizing — docs imply a size request, OpenAPI has no size field

- Pricing docs: "When you create a VM without requesting a specific size, it boots with: 4 vCPUs, 8 GiB memory, 32 GB disk" and "Every plan can create a VM at any valid size up to its CPU, memory, and disk maximums." — https://www.freestyle.sh/docs/vms/pricing-and-limits
- OpenAPI `CreateVmRequest`: no `cpu`, `memory` or `storage`; `snapshotId` says "Omit for the platform default." Size changes go through `PUT /v5/vms/{vmIdOrSlug}/resize`, which is grow-only. — https://www.freestyle.sh/openapi.json

**Interpretation used:** size comes from the snapshot; arbitrary size is create-from-a-smaller-image then resize. `any-size` stays `yes` (every size from 1 vCPU / 128 MiB upward is reachable), but the docs' "request a size at create" wording does not match the published schema. Not a pricing change.

### 11. "No credit card required" vs the $1 verification (not a contradiction)

- Product page: "No credit card required." — https://www.freestyle.sh/products/vms
- Pricing docs: "Adding a card to a Free account charges **$1 USD for verification**, then Freestyle automatically issues a full refund to that card." — https://www.freestyle.sh/docs/vms/pricing-and-limits

**Interpretation used:** the card is optional on Free; if you add one, the $1 is a refunded verification, not a plan payment or credit. The baseline already treated it this way.

### 12. Terms "not published" (baseline correction)

The 30 Oct profile said Terms were not published because `freestyle.sh/terms`, `/legal/terms`, `/legal/tos` and `/terms-of-service` all 404'd. The Terms are at **`https://dash.freestyle.sh/terms`**, effective 30 Aug 2026, version 2026-08-30. They are linked from the dashboard app, not the marketing footer. The marketing-site 404s are still 404s; the "not published" conclusion was wrong, not the URLs.

## Important products the 16 features and 78 capabilities miss

### Material

| Product / change | Evidence | Why a buyer cares | Covered by |
|---|---|---|---|
| **Official remote MCP server** | `https://mcp.freestyle.sh/mcp` returns 401 + OAuth metadata; `resource_name: "Freestyle"`, scopes `freestyle:read`, `freestyle:write`; dashboard has `/handler/mcp-auth-confirm`; privacy updated 5 Nov 2026 | Claude/ChatGPT/Cursor can drive Freestyle VMs without a custom integration. The capability row now says `yes`; the *use-case* text still says there is no such server. | `mcp-server` (updated), `ways-to-drive` note |
| **FIDO / passkey virtual security keys** | "Run native FIDO clients such as `tsh` inside a VM and approve their requests with a passkey in your browser." "This feature is experimental and must be enabled for your account. Its API is hidden from OpenAPI." | Hardware-key MFA for GitHub, AWS, Teleport etc. inside an agent VM, without a physical key. No other sandbox provider in the matrix documents this. | None; new product |
| **Dashboard Displays** | VM page has a Displays tab; `/vms/displays/create|list|delete|resize|frame`, WebSocket frame stream, keyboard/pointer input, "Nothing is drawn on this display yet." | A first-party computer-use surface: no noVNC/TigerVNC needed to see and click a VM. The guest still needs a desktop/browser installed. | `desktop`/`browser` (partly; note) |
| **Stable public IPv6 per VM** | "The VM's stable public IPv6 address — assigned at create and kept for the VM's life, across restarts and moves between machines." | Direct inbound TCP/UDP without a domain or TLS front; a whitelistable egress address even though IPv4 is shared. | `static-ip`/`raw-tcp` (specifics) |
| **Anti-affinity placement** | `VmPlacement.antiAffinity`, topology `node` = "not on the same host machine"; guide: "Anti-affinity keeps them off the same host — two routers on one machine is one machine." | Spread HA routers/workers across hosts; max 8 rules per VM. | None; new scheduling feature |
| **Physical hardware in VPCs** | `GET /v5/hardware` "List the physical machines attached to your private networks"; `HardwareServer` with MAC, IPv4/IPv6, `publicIpv6`, DHCP state, power control; `POST /v5/hardware/{id}/power` on/off/cycle | The colocated bare-metal offer is now an API object on your private network, with real power control (rate-limited). | None; enterprise product |
| **Automatic restart on failure** | `automaticRestart` "Boot the VM again if it stops without you asking it to — the VMM crashes, the guest kernel panics, the machine it runs on loses power. Defaults to `true`." | Long jobs survive host failures, but a crash loop keeps billing until you pause/delete. | `lifecycle` note; no capability |
| **Plan-wide total resource budgets** | Free 40 vCPU / 80 GiB / 320 GB; Hobby 800 / 1.6 TiB / 3,125 GB; Pro 16,000 / 31.25 TiB / 62,500 GB; "disk is therefore the binding budget" | The saved-VM count is not usable at max disk: Hobby fits ~48 × 64 GB, not 200; Pro ~244 × 256 GB, not 4,000. | None; `sizes-regions` note |
| **Postgres and IMAPS ingress fronts** | 'Set protocol: "postgres" and the rule is served by the edge’s Postgres front on **5432**.' '`imap` ... **993** ... `imaps` ... splices to a server holding its own certificate on 993.' | Publish a database or mailbox at a domain with managed TLS, not just HTTP/Minecraft. | `raw-tcp` (specifics) |
| **Tailscale and IKEv2 tunnels** | "Apple devices can connect with their built-in IKEv2 VPN client. The default tunnel type uses WireGuard; a `tailscale` tunnel runs a managed subnet router in your tailnet." | Reach a VPC from an iPhone/Mac without installing WireGuard; join an existing tailnet. | `tunnel` (specifics) |
| **Customer records** | `POST /v5/customers` "Create or update a customer in your account"; fields include email, phone, GitHub ID, OAuth identities, Stripe customer ID, country, IP, signup time; "No billing is activated." | Multi-tenant apps can keep end-customer identity next to VMs without a separate store. | None; new API resource |
| **Background requests** | `GET /v5/background-requests/{requestId}`; `x-freestyle-background-after-secs` returns 202 + requestId, poll for the original response; results expire 10 minutes after completion. | Long VM operations without holding an HTTP connection. | None; new API ergonomic |
| **Outbound mail block** | "A VM cannot open TCP 25, 465, or 587 to the public Internet. The connection is dropped whatever your rules say." Mail goes through an `smtp` TLS rule. | Agents that send email need the SMTP rule; direct SMTP is impossible. | `outbound-network` note |
| **SOCKS5 proxy egress** | "A VM's outbound sessions leave through a SOCKS5 proxy you supply." Catch-all sets `all_proxy`/`ALL_PROXY`; credentials held at the edge. | Bring-your-own egress proxy without putting credentials in the VM. | `outbound-network` note |
| **Scoped S3 signing + JSON Patch transforms** | Edge signs S3 requests; scope to bucket, prefix, operations, multipart; JSON Patch can set/change request body fields. | The VM never holds the storage key; per-request least privilege. | `hidden-secrets` note |
| **MFA / active sessions / connected accounts** | Dashboard Settings: "Multi-factor authentication", "Authenticator app (TOTP)", "Active sessions", "Connected accounts". | Account security beyond team roles; useful for a buyer's security review. | `company`/`teams-accounts` (not a capability) |

### Minor or already covered

- **Kali 2026.3** and **BusyBox 128 MiB** base snapshots (Kali is a security workbench; BusyBox is the smallest size). Already in the base image list; no capability row.
- **Android 15 emulator guide** with noVNC + adb for computer-use agents. A guide, not a built-in desktop.
- **Native SSH** (`--real-ssh`), **local port forwarding**, **VS Code/Cursor/cmux editor URLs**. Covered by `ssh`; specifics updated.
- **24-hour `vm.exec()` timeout** on updated guest agents, **16 GiB files**, **persistent PTY** sessions, **browser terminal** with `connectXterm`. Covered by `pty`/`file-api`/`web-terminal`.
- **Domain-specific outbound TLS** and **request-specific transforms**. Covered by `egress-allowlist`/`hidden-secrets`.
- **Wildcard certificate API** (`POST /v5/certificates/wildcard`, NS delegation). Covered by `custom-domain`/`auto-https`.
- **`automaticRestart`**, **`metadata`**, **`customer`/`customerId`**, **`reassignSlug`** create fields. Only automatic restart and customer records are material.
- **`autoDeleteSeconds` plan caps** and **Free reclamation**. Covered by `files-survive-stop`/`free-tier` caveats; the cap length is unpublished.
- **Terms of Service** and **privacy policy update**. Company facts; not a product capability.

## Integration delta for the parent

Nothing below was applied to the repo. It is the proposed reconciliation of this recheck with the existing data.

### Provider profile — `site/src/data/providers/freestyle.json`

- `checkedOn`: `2026-10-30` → **`2026-11-12`**. The profile, pricing, docs, status and legal pages were reread.
- `whatItIs` / `whoFor` / `isolation` / `sizes`: keep, except add the stable public IPv6 and the plan-wide total budgets if the prose is being refreshed. The isolation paragraph should not change: still a hardware-virtualised VM with its own kernel.
- `billing.model` / `billing.meter` / `billing.planFee` / `billing.minimum`: **unchanged**. The numbers still match.
- `billing.stopped`: keep the storage-only statement and the "pay nothing while paused" contradiction. Terms now adds "stored disks and snapshots are billed while they exist", which supports the storage interpretation; quote it if the caveat is expanded.
- `cost.A/B/C`: **unchanged** (no input changed). Keep the C flag and the $0-on-Free alternative.
- `company.facts`:
  - **Legal entity**: keep `Freestyle Cloud Inc.`; change the contact sentence to "Privacy gives founders@freestyle.sh; Terms give support@freestyle.sh."
  - **Founded and team**: keep; optionally add "YC Summer 2024" (third-party YC page).
  - **Status**: change to "All systems operational on 12 November 2026; the page was last updated 12 November 2026." Quote "All Systems Operational".
  - **Uptime promise**: keep the Enterprise 99.99% quote; add Terms §8 "The Service is provided on an as-available basis. We do not promise a level of uptime unless you have a written agreement with us that says we do." (the SLA is that written agreement).
  - **Terms of service**: replace "Not published..." with: "Published at dash.freestyle.sh/terms, effective 30 August 2026 (version 2026-08-30). The marketing site's /terms is still 404. Covers acceptable use, metered billing, suspension/termination, data deletion, refunds at Freestyle's discretion, no uptime promise without a written agreement, and 'Nothing here is a backup service.'" Source: `https://dash.freestyle.sh/terms`, quote "Effective August 30, 2026" or "Nothing here is a backup service.", `docs-confirmed`.
  - **Certification**: keep "No SOC 2 report, trust centre or DPA page..." but the privacy policy is now dated 5 Nov 2026; add "No DPA or subprocessor list in the privacy policy or Terms."
  - **New fact — Privacy**: "Privacy policy updated 5 November 2026. Adds a Model Context Protocol (MCP) integration section, says logs are kept for one month, VM deletion removes active content while backup copies are cleaned asynchronously, and snapshots remain until deleted." Source: privacy, quote "We retain logs for one month." or the MCP sentence.
- `fits.well`: add
  - "Driving VMs from an AI assistant: an official remote MCP server at mcp.freestyle.sh with read/write OAuth scopes."
  - "Agents that need hardware-key MFA: an experimental virtual FIDO key lets a browser passkey approve `tsh`-style sign-ins inside the VM."
  - "Computer-use agents: the dashboard can stream a VM display and send keyboard/pointer input, and every VM has a stable public IPv6 for direct TCP/UDP."
  - "Multi-tenant fleets that need spread: anti-affinity placement keeps selected VMs off the same host."
- `fits.badly`: add
  - "Agents that send mail directly: outbound TCP 25/465/587 is blocked; mail must go through an `smtp` TLS rule."
  - "Large fleets at maximum disk: the plan-wide disk budget binds before the saved-VM count (Hobby ~48 × 64 GB, not 200)."
  - "Buyers who need a DPA, SOC 2 or a read-only team role: none is published."
- `usability.dashboard`: change to "dash.freestyle.sh lists and creates VMs, shows state and wallet usage, manages domains, and has a VM page with Terminal and Displays tabs; the docs also point at admin.freestyle.sh for API keys."
- `usability.withoutCode`: change to "The dashboard can create a VM, open a terminal and show its display; installing packages and running an agent can be done there, but publishing a port still needs a TLS rule (dashboard or API)." The current "still needs the SDK, CLI or API" is too strong.
- `usability.signup`: keep; $1 verification refunded.
- `usability.docs`: add "The MCP server and the VM Displays API are not in the docs index; FIDO has a page."
- `usability.tripsUp`: keep the existing five; add "Outbound mail is blocked on 25/465/587 unless you add an SMTP TLS rule." and "The plan-wide disk budget, not the saved-VM count, is the fleet limit."
- `caveats`:
  - **Paused billing** — keep, unchanged.
  - **Free persistence** — keep, expand with the Terms reclamation sentence and the docs downgrade sentence; still a contradiction.
  - **Disk units** — keep, expand to the total disk row (320 GB vs 320 GiB; 3,125 GB vs 3,125 GiB; 62,500 GB vs 62,500 GiB).
  - **Command timeout** — keep, unchanged.
  - **Snapshot storage** — update: Terms confirms "stored disks and snapshots are billed while they exist"; the billable size/basis is still unpublished, so the calculator adds nothing.
  - **No published security report or DPA** — keep; privacy updated 5 Nov but still no DPA/subprocessors/trust centre.
  - **Team controls** — update: "Owner and Member roles exist in the dashboard; there is no read-only role, dollar spend cap or usage alert. SSO and audit logs are Enterprise-only."
  - **New: Outbound mail is closed** — status open; quote the firewall sentence; consequence for email agents.
  - **New: Plan-wide total resource budgets** — status open; quote the pricing docs; consequence for fleet sizing; disk is binding.
  - **New: MCP server is undocumented** — status open; quote privacy + endpoint; tool list requires sign-in; no docs page.
  - **New: Production positioning is stated two ways** — status contradiction; pricing Pro "For teams and production applications." vs about "Not for hosting production applications."
  - **New: Deletion and backup retention** — status open; Terms "cannot be recovered" vs privacy async backup cleanup; grace period length unpublished.
  - **New: Custom images / Dockerfile** — status contradiction; Apr changelog "Create snapshots from Dockerfiles..." vs current docs snapshot-only and no Dockerfile UI.
  - **New: Free reclamation period** — status open; Terms says Free resources may be reclaimed after inactivity; length unpublished.
- `strengths`: add "Official remote MCP server for assistant-driven VMs.", "Experimental passkey-backed FIDO key for hardware-key MFA inside the VM.", "Dashboard terminal and display streaming, so a VM can be driven without a local client.", "Stable public IPv6 per VM and anti-affinity placement.", "Terms, privacy and a status page are published."
- `sources`: add `https://dash.freestyle.sh/terms`, `https://www.freestyle.sh/docs/vms/security-keys`, `https://www.freestyle.sh/docs/vms/network/tunnels`, `https://www.freestyle.sh/yc.md`, `https://mcp.freestyle.sh/.well-known/oauth-protected-resource/mcp`, `https://www.freestyle.sh/privacy`; keep the existing pricing/docs/status links.

### Rate card — `site/src/data/pricing/freestyle.json` and `research/rates/freestyle.json`

- `checkedOn`: `2026-10-30` → **`2026-11-12`** in both. The money pages were reread fresh and the figures are unchanged.
- No numeric field changes. `cpu.rate`, `ram.rate`, `disk.running`, `disk.stopped`, `maxDisk`, `maxVcpu`, `maxRam`, `egress.perGiB`, `egress.included`, plan fees/credits/allowances/`max*`/`noKeep` all stay.
- Add to `notes`:
  - "Plan-wide total vCPU/memory/disk budgets (Free 40 / 80 GiB / 320 GB; Hobby 800 / 1.6 TiB / 3,125 GB; Pro 16,000 / 31.25 TiB / 62,500 GB) are not modelled; disk is the binding budget for saved VMs."
  - "Default VM is 4 vCPU / 8 GiB / 32 GB; the engine always uses an explicit preset shape."
  - "Terms says stored disks and snapshots are billed while they exist; the billable size of a snapshot is still unpublished, so the card adds nothing."
  - "Outbound TCP 25/465/587 is blocked; mail uses an `smtp` TLS rule. No separate price."
- Add sources: `https://dash.freestyle.sh/terms` and `https://www.freestyle.sh/docs/vms/pricing-and-limits` (already present).

### Capabilities — `site/src/data/capabilities.json`

Apply the five verdict changes and the specifics changes above. The exact new rows are in the capability section of this file. In particular:

- `mcp-server`: `yes`, figure `mcp.freestyle.sh`, note, source privacy + MCP quote, `docs-confirmed`.
- `web-terminal`: `yes`, figure `Dashboard terminal`, note, source VM bundle + "Terminal is offline", `inferred`; remove `shortfall`.
- `roles`: `partly`, figure `Owner/member`, shortfall, note, source team bundle + owner quote, `docs-confirmed`.
- `backups`: `no`, figure `Manual snapshots`, note, source Terms + "Nothing here is a backup service.", `docs-confirmed`.
- `schedules`: `no`, figure `No scheduler`, note, source changelog + deprecation quote, `docs-confirmed`.
- Specifics-only: `tunnel`, `static-ip`, `raw-tcp`, `ssh`, `custom-image`, `free-credit`, `dpa`, `dashboard-create`, `files-survive-stop`, `stay-on`, `browser`, `desktop`, `hosts-other-agents`, `one-click-openclaw`.

Do **not** advance `capabilities.json.checkedOn` (2026-10-29) for this one provider; record the 2026-11-12 coverage in `research/freestyle.md`. If the whole 16-provider fan-out completes today, the parent can advance the dataset date once for all rows.

### Features — `site/src/data/features/*.json`

No verdict changes. Update the notes/scenarios as in the feature section. The material ones:

- `ways-to-drive`: note "No MCP server" → "Official remote MCP server at mcp.freestyle.sh (OAuth read/write; tool list needs sign-in)." Consider changing the source to the privacy MCP quote, because the old CLI source no longer supports the corrected claim.
- `teams-accounts`: note "named roles not documented" → "Owner and Member roles in the dashboard; no read-only role, dollar spend cap or usage alert; SSO/audit Enterprise-only." Consider the team bundle as source.
- `reaching-it`: note "no hosted browser terminal" → "Dashboard Terminal tab (xterm.js/PTY); dashboard Displays tab; SSH; PTY API." Keep the TLS-inbound source or use the PTY doc.
- `outbound-network`: note add "outbound mail blocked on 25/465/587" and "SOCKS5 proxy egress". The firewall page is the best source.
- `keys-secrets`: note add FIDO security keys and scoped S3 signing/JSON Patch. The tls-outbound page supports the injection part; the security-keys page supports FIDO.
- `sizes-regions`: note add total budgets and default 4/8/32; disk binds on Hobby/Pro. The pricing-and-limits page supports it.
- `lifecycle`: note add `automaticRestart` default true.
- `snapshots-forks` / `storage`: note add snapshots billed while they exist; billable size unpublished.
- `billing-models`: note add plan-wide total budgets.
- `trials-free-tiers`: note add 12-month expiry / 6 months Hobby; Free reclamation caveat.
- `company`: note add Terms effective 30 Aug 2026 and privacy updated 5 Nov 2026; no SOC 2/DPA.
- `custom-domains`, `idle-timers`, `isolation`, `built-in-agents`: no note change needed.

### Docs — `site/src/data/docs.json`

All 16 feature URLs and both extra keys return 200 on 12 Nov 2026. The anchors `#idle-timeout` and `#whats-installed` are present. **No change required.** The MCP server, Displays API, hardware API and anti-affinity placement have no docs page; do not invent one. FIDO has a page but no feature key; it is linked from `keys-secrets` only in the research ledger.

### Use cases and situations

- `usecases.json` → `mcp-server`:
  - Standfirst: add Freestyle to "Daytona, Sprites, Runtime and E2B" (or rephrase "Daytona, Sprites, Runtime, E2B and Freestyle").
  - Freestyle route `what`: replace "There is no MCP template and no MCP server for controlling Freestyle." with "There is no MCP template, but Freestyle publishes an MCP server for controlling its VMs at mcp.freestyle.sh — that is not a host for your own server."
  - Tier stays `manual`; price stays "$50/month on Hobby at the 1 vCPU / 1 GiB preset"; link stays inbound TLS.
- `usecases.json` → `claude-code-team` Freestyle pick `watch`: change "No documented team roles or dollar spend cap" to "Only Owner/Member roles; no read-only role or dollar spend cap. SSO is Enterprise-only."
- `usecases.json` → `coding-agent` Freestyle route `what`: optionally add "the dashboard also has a Terminal tab" after "does not host a chat".
- `situations.json` → `one-per-customer` Freestyle `watch`: change "No region choice and no documented team roles." to "No region choice; only Owner/Member team roles, with no read-only role." Optionally add "customer records" to the `why`.
- `usecases.json` → `mcp-server` Sandboxer pick: its "dashboard terminal" differentiator is no longer unique to Sandboxer (Freestyle has one, but at $50). The pick's price case still holds; consider "a dashboard terminal on a $20 plan" if the parent wants to keep the comparison precise. This is a shared-prose edit, not a Freestyle route change.
- No route tier changes. Freestyle remains `manual` for the MCP-server use case (hosting your own server), `preinstalled` for coding agents, `guide` for browser/OpenClaw, `backend` for code interpreter.

### Comparison, counts and copy

- `compare/side-by-side.astro` `kinds.freestyle = "Full VM"`: still accurate; no VPS label.
- Provider count 16, features 16, capabilities 78, use cases 10: unchanged. No static count edits.
- `README.md` / `site/README.md` / `site.json`: no provider-count or method change. Do not advance `site.json.checkedOn` for this one thread; the parent owns the fan-out date.
- `changes.json`: recommend one dated correction entry (date = when the guide checked, 2026-11-12), not a launch date. Suggested:
  - title: "Correction: Freestyle has an MCP server, a dashboard terminal, team roles and published terms"
  - what: "This guide's Freestyle listing said there was no MCP server, no hosted browser terminal, no named team roles and no published terms. Freestyle now documents an MCP endpoint at mcp.freestyle.sh (OAuth, read/write scopes), the VM page in dash.freestyle.sh has Terminal and Displays tabs, the team page has Owner and Member roles, and Terms of Service are at dash.freestyle.sh/terms (effective 30 August 2026). It also documents an experimental FIDO security key, a stable public IPv6 per VM, outbound mail blocked on 25/465/587, and plan-wide total resource budgets. The date is when this guide checked it, not a launch date."
  - sources: privacy MCP quote; Terms "Effective August 30, 2026"; security-keys FIDO quote; pricing-and-limits total-budget quote; dashboard team quote; dashboard VM terminal quote.
  - Alternatively split into two entries: "Correction: terms, terminal, roles" and "Freestyle adds an MCP server and passkey-backed VM keys". The split is cleaner for readers; the parent should choose.
- `site/scripts/price-baseline.json`: no freestyle money figure changed. `npm run check-rates` printed no freestyle line. Do **not** run `--update` for this recheck; it would bless unrelated CHANGED lines (Daytona, E2B, Hetzner, Hostinger, HostUp, Lightsail, Lizard, Modal, OVHcloud, Sandboxer, Scaleway, Sprites, Tensorlake, Vultr). If the parent wants a baseline refresh, do it as a separate price-only pass.
- `site/src/lib/cost.test.ts`: no expectation changes. `npm test` passes 70/70 on the untouched tree.
- `research/freestyle.md`: append a dated "Recheck, 2026-11-12" section with the five verdict changes, the terms/terminal/roles corrections, the MCP/FIDO/IPv6/budget/mail findings, the contradictions above, and the retrieval log. Preserve the 2026-10-30 section as history; mark superseded claims explicitly (terms not published; no MCP server; no hosted terminal; no named roles; WireGuard-only tunnels; "snapshot storage not priced" now "billed, basis unpublished").
- `research/rates/freestyle.json`: `checkedOn` 2026-11-12; add the total-budget, default-spec, snapshot-billing and outbound-mail notes; keep all numbers.
- `research/capabilities-NOTES-*.md`: no new shard decisions; this is a single-provider recheck. If the parent records one, note that `mcp-server` is now `yes` and `web-terminal` is now `yes` in the access/running groups.

## Verification and limitations

- **78/78 capability quotes** were fetched live and machine-checked on 12 Nov 2026. 76 matched unchanged; `tunnel` and `dashboard-create` were stale and are corrected. The check normalises whitespace, Markdown emphasis/backticks/links and spaces before punctuation; it does not prove meaning, only presence. I read the surrounding context for every changed row.
- **16/16 feature quotes** were checked the same way; all matched, including the OpenAPI quotes that only fail a naive JSON-text check because of `\n` escaping.
- **Pricing freshness:** Context `/pricing` with `maxAgeMs: 0` returned `cache_metadata.status = "miss"`, `age_ms = 0`. `curl` fetched `/pricing` and `/pricing.md` independently. The rendered page is byte-identical to the 5 Nov Wayback snapshot and its rates/plans/limits are identical to the 24 Sep snapshot. `npm run check-rates` printed **no freestyle line** (no money-figure change against the baseline).
- **Docs links:** all 16 `docs.json` URLs and the two extras returned HTTP 200 on 12 Nov 2026; `#idle-timeout` and `#whats-installed` are present.
- **No account, no VM.** The dashboard terminal, Displays tab, roles and MCP consent screen are evidenced from first-party JavaScript bundles and the OAuth metadata, not from using the UI. The MCP tool list is behind sign-in and was **not** enumerated; `mcp-server` is `yes` on the existence of the official endpoint and its read/write scopes, not on a verified tool-by-tool match.
- **FIDO is experimental and account-gated.** The docs say "must be enabled for your account" and the API is hidden from OpenAPI. It is a real first-party product, but a buyer may not see it without asking.
- **Hardware/bare metal has no published price.** The API object is real; the commercial terms are Enterprise.
- **No A/B/C recomputation.** No input changed; the existing totals stand. The only open interpretation is Free persistence, which is unchanged and flagged.
- **Dating.** Wayback shows the 15 Oct docs index (85 pages) and the 15 Oct OpenAPI. The 30 Oct research counted 92 docs pages; the current index has 94. The two-page FIDO section is the only new pair and is absent from the 15 Oct index, so it is inferred new since 30 Oct. The privacy policy was last updated 15 Jun 2025 until the 5 Nov 2026 version, which is the first to mention MCP; the MCP integration is therefore dated 5 Nov 2026. The dashboard terminal, roles, Displays, IPv6, hardware, anti-affinity, automatic restart, total budgets, Postgres/IMAPS ingress and the mail block are **not dated** — some were already in the 15 Oct OpenAPI or pricing page, so they are baseline misses, not launches. Do not put a launch date on them.
- **Not verified:** a real sign-in, a real MCP tool call, a real passkey ceremony, a real display stream, a real hardware power action, a real Free reclamation, a real 24-hour `vm.exec()`, a real snapshot bill. All are documentation/UI claims.

### Retrieval log (what actually succeeded)

| Tool | Calls | Result |
|---|---|---|
| Context `web_scrape` | `/pricing` (fresh, markdown), `/status` (fresh), `/changelog` (fresh), `dash.freestyle.sh/terms` (fresh, rendered), `/yc` (fresh) | Succeeded. `/pricing` cache miss/age 0. |
| TinyFish `fetch_content` | `/yc`, YC company page, Agent MCP Directory Freestyle entry | Succeeded. |
| TinyFish `search` | `site:freestyle.sh MCP`, `"mcp.freestyle.sh"`, Freestyle MCP queries | Succeeded; found the 4 Nov directory verification. |
| `curl` | `pricing.md`, `about.md`, `docs/llms.txt`, `docs/llms-full.txt`, 20 docs `.md` pages, `openapi.json`, `yc.md`, `privacy`, `changelog`, `status`, `products/vms`, `dash` HTML + JS chunks, HTTP headers, sitemaps, Wayback CDX/archives | Succeeded. |
| `npm run check-rates` | All rate cards | Succeeded; no freestyle line; 23 unrelated pages to look at. |
| `npm test` | Cost-engine suite | 70/70 pass on the untouched tree. |
| Amp native `web_search` / `read_web_page` | — | Not needed. |

**Failures/fallbacks:** the first `code_exec` call omitted the `context` import and errored (`web_scrape is not defined`); re-run with `import { web_scrape } from "context"` succeeded. `docs.freestyle.sh/api/mcp/mcp` (the legacy docs-site MCP advertised on `docs.freestyle.sh/v2`) is 404; it is not the control-plane endpoint. `dash.freestyle.sh/assets/index-BLwRVluh.js` (the old cited bundle) is 404; the current bundle is `index-DycbFWV8.js`. No Composio route failed for a page I needed; no native web fallback was used for evidence.

## Bottom line

Freestyle's prices did not move: the same $50 Hobby minimum, $500 Pro minimum, $0.04032/vCPU-hour, $0.0129/GiB-hour memory, $0.000086/GiB-hour storage, $0.02/GB transfer, 200/400/60,000 monthly allowances and 50/500 GB transfer allowances. The recheck changes what the guide says Freestyle *is*, not what it costs. It now has an official MCP server, a dashboard terminal and display viewer, Owner/Member team roles, published Terms, an experimental passkey-backed FIDO key, a stable public IPv6 per VM, anti-affinity placement, physical hardware in VPCs, automatic restart on failure, Postgres/IMAPS ingress, Tailscale/IKEv2 tunnels and plan-wide total resource budgets. It also blocks direct outbound mail on 25/465/587 and does not sell a DPA, SOC 2 report, read-only role or dollar spend cap. The only rate-card risk is still the Free-persistence contradiction; the Terms' reclamation clause makes the conservative $50-Hobby reading easier to defend, but it does not resolve it.

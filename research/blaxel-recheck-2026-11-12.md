# Blaxel recheck — 2026-11-12

Provider `blaxel` (https://blaxel.ai), repo `sandbox-guide` at `origin/main` **4432d00**. Baseline: provider profile checked **2026-10-28**, rate card **2026-10-30**. This recheck read the live docs, pricing, changelog, terms, compliance portal, status page and marketing pages. Desk research only: no account, no credentials, no billable sandbox.

## How this was checked

- **Context MCP** `web_scrape` for `https://blaxel.ai/pricing` with `maxAgeMs: 0`; response `cache_metadata` was `{"status":"miss","age_ms":0}`, i.e. an origin fetch, not a cached scrape. Used for every money figure below.
- **curl** for the provider's own Markdown: `docs.blaxel.ai/llms.txt`, every cited `*.md` page, `docs.blaxel.ai/changelog.md`, `status.blaxel.ai` HTML + `/api/v2/incidents.json`, `blaxel.ai/legal/terms`, the terms PDF, `blaxel.ai/platform/sandboxes`, `blaxel.ai/platform/networking`, `blaxel.ai/company/security`, `blaxel.ai/company/about`, `blaxel.ai/blog/...`, `ycombinator.com/companies/blaxel`.
- **GitHub API** (`blaxel-ai/sandbox`, `blaxel-ai/docs`) to date the prebuilt images, the Tailscale tutorial, the best-practices page and every docs edit after 2026-10-28.
- **agent-browser** for the Probo compliance portal at `compliance.blaxel.ai/en` (client-rendered; curl returns a shell).
- `npm run check-rates` (read-only) to compare the live pricing page with `site/scripts/price-baseline.json`.
- Amp native web tools: **not used**. No Composio tool errored.

**Quote check.** Every one of the 94 existing Blaxel quotes in `site/src/data/` (16 features + 78 capabilities) was re-checked as a substring of a fresh fetch after normalising whitespace, HTML entities, Markdown links, backticks and curly apostrophes. 92 matched verbatim; the 2 exceptions are the Baseten sentence (page not in the corpus) and the status-page URL (an `href`, not text). So no existing quote has drifted. Quotes below are copied from the fetched text; `code` markers are removed in the ledger but present on the page.

**Headline:** no plan, unit rate, allowance or free-tier change since 2026-10-30; `check-rates` printed nothing for `blaxel.ai/pricing`. No changelog entry after **2026-10-13**; docs commits after 2026-10-28 are housekeeping plus one small API addition (`auth.md`, Python venv, Omnara tutorial, process-timeout wording, CLI/API auto-updates, Baseten model provider, `kernelPreview`). **Eight capability verdicts were wrong or under-specified**, and one feature's idle-timer framing conflates two different timers. The status page's uptime and incident feed also moved.

## Verdict changes at a glance

| Capability | Was | Now | Why |
|---|---|---|---|
| `browser` | no | **yes** | First-party `blaxel/chromium`, `playwright-chromium`, `playwright-firefox`, `lightpanda` images |
| `desktop` | no | **yes** | First-party `blaxel/xfce-vnc` and `blaxel/cua-xfce` images; CUA adds screenshot/mouse/keyboard API |
| `agents-preinstalled` | no | **yes** | First-party `blaxel/claude-code` and `blaxel/codex` images, alongside a bare base image |
| `ssh` | no | **partly** | Documented `blaxel/tailscale` image + `tailscale ssh` / `ssh root@<tailnet-ip>` |
| `no-internet` | not-published | **yes** | `DELETE /network/tunnel`: "the sandbox will lose all outbound internet connectivity (no egress)" |
| `warm-pool` | no | **partly** | Best-practices documents a pre-warmed pool you keep and refill yourself |
| `big-disk` | not-published | **partly** | Local disk is a share of RAM (10–95%); 256 GB custom machine or expandable volume gives ≥100 GiB |
| `open-source` | no | **partly** | In-VM sandbox API is MIT open source; control plane/scheduler are not, and BYO metal still uses Blaxel's control plane |

No feature verdict changes. Several feature notes need edits; the material ones: `idle-timers` (the 15-minute figure is a socket-idle rule, not the general idle timer), `outbound-network` (marketing claims deny-by-default; docs say opt-in), `company` (uptime 99.33% → 98.45%).

**Judgement calls to review before integrating.** `warm-pool` reverses an explicit earlier decision: `capabilities-NOTES-2` says Blaxel has "no pool concept at all" and marks it `no` while marking Modal/Runtime's do-it-yourself pattern `partly`; the current best-practices page documents exactly that pattern, so consistency favours `partly`. `ssh` counts a first-party image plus *your own* tailnet, not a Blaxel SSH endpoint. `no-internet` is a sandbox-API call, not a console switch. `open-source` follows the Cloudflare precedent (an open-source component beside a hosted platform = `partly`), not E2B's self-hostable runtime. `big-disk` follows the `big-machines` precedent (100 GiB only on a custom 256 GB machine = `partly`), not a published maximum.

---

## 1. Features — current verdicts

### isolation — partly — unchanged
- **Specifics:** MicroVM per sandbox with its own kernel; everything runs as `root` by default; an unprivileged user is optional; the default kernel refuses module loading and kernel tracing to every process including root; iptables is off unless enabled at creation; `kernelPreview` (mk3.1, added 3 Nov) turns iptables on but cannot be combined with landlock or NFS; `kernelExtensions` (modules/eBPF) only with the Android kernel on Carbon.
- **Source:** https://docs.blaxel.ai/Sandboxes/Non-root-user.md — "the microVM boundary remains the isolation guarantee between your sandbox and everything else." (docs-confirmed)

### sizes-regions — partly — unchanged (new CPU-mapping contradiction)
- **Specifics:** Memory drives CPU: 8 GB → 4 cores, 16 GB → 6 cores. API reference instead gives `cores = MB / 2048`, which makes 16 GB → 8 cores. 4 regions (Oregon, North Virginia, London, Frankfurt) plus `auto`; not all self-service. Custom up to 256 GB RAM. No GPU model or price.
- **Source:** https://docs.blaxel.ai/Sandboxes/Overview.md — "a sandbox with 8 GB memory is allocated 4 CPU cores, while one with 16 GB memory is allocated 6 CPU cores." (docs-confirmed)
- **Contradiction:** https://docs.blaxel.ai/api-reference/compute/create-sandbox.md — "CPU cores = memory in MB / 2048, e.g., 4096MB = 2 CPUs".

### billing-models — partly — unchanged
- **Specifics:** Active compute billed on allocated RAM per second, CPU included: $0.0000115/GB-second. Snapshot storage $0.20/GB-month, images $0.045/GB-month, volumes $0.12/GB-month. Standby stops memory charges but keeps snapshot/volume storage. Tiers are wallet top-ups, not subscriptions.
- **Source:** https://blaxel.ai/pricing — "$0.0000115 / GB RAM · second" (pricing-page)

### lifecycle — yes — unchanged
- **Specifics:** Standby snapshots processes + filesystem and preserves memory, drops external sockets; archive keeps filesystem only, restarts processes with new IDs; delete is unrecoverable. Archive is private preview and needs a workspace feature flag (API returns 403 until enabled).
- **Source:** https://docs.blaxel.ai/Sandboxes/Overview.md — "The snapshot preserves process and filesystem state, but not external network connections" (docs-confirmed)
- **New detail:** https://docs.blaxel.ai/Sandboxes/Archive.md — "This feature is currently in private preview ... It requires a feature flag on your workspace".

### snapshots-forks — partly — unchanged
- **Specifics:** Snapshot captures filesystem, processes and memory; survives and stays forkable after the source is deleted; no expiry or pruning. Restore is in place; fork creates a new sandbox. Whole feature is private preview, not for production.
- **Source:** https://docs.blaxel.ai/Sandboxes/Fork.md — "This feature is currently in private preview and is not recommended for production use." (docs-confirmed)

### storage — yes — unchanged (new limits)
- **Specifics:** Volumes survive sandbox deletion; one volume per sandbox, one sandbox per volume; attach only at creation; **cannot detach**; resize **up only**; billed on provisioned size. Agent Drive is the shared POSIX+S3 filesystem, private preview in `us-was-1` only.
- **Source:** https://docs.blaxel.ai/Sandboxes/Volumes.md — "Blaxel Volumes provide persistent storage that survives sandbox destruction and recreation." (docs-confirmed)
- **New limits:** "At this time, you cannot detach a volume from a sandbox."; "Currently, it is only possible to increase the volume size (not decrease it)." — https://docs.blaxel.ai/Volumes/Overview.md

### idle-timers — partly — **framing changed**
- **Specifics:** No active connection → warm standby in **~15 s** (docs). An open but idle WebSocket/TCP connection → standby after **15 min**. Pricing says **~5 s** and, in the hero, "the second they're idle". Best-practices says **15 s**. Resume claimed **<25 ms**.
- **Source:** https://docs.blaxel.ai/Sandboxes/Overview.md — "If a sandbox does not have an active connection, it automatically transitions to a warm standby mode ... This transition happens in approximately 15 seconds." and "there is a 15-minute idle timeout for such a connection."
- **Changed:** the old figure "15 min idle (docs); 5 s (pricing)" presented 15 minutes as the docs' general idle timer. The docs give **~15 s** for a sandbox with no active connection and reserve **15 min** for an idle WebSocket/TCP socket. Pricing gives ~5 s (FAQ) or "the second" (hero). Verdict stays `partly`; figure/note should become "~15 s (docs); ~5 s (pricing)" with the 15-minute socket rule in the note.

### reaching-it — partly — unchanged
- **Specifics:** Multiple preview URLs per sandbox; each public or private; private needs `bl_preview_token` query param or `X-Blaxel-Preview-Token` header; 15-minute connection timeout; custom domains; ports 80/443/8080 reserved. Default ingress auth still not published. No native SSH (see `ssh` row: Tailscale image is the documented route).
- **Source:** https://docs.blaxel.ai/Sandboxes/Preview-url.md — "This preview URL can be either public (does not require you to be authenticated to access it) or private" (docs-confirmed)

### custom-domains — yes — unchanged
- **Specifics:** Register a domain, get wildcard subdomains, managed TLS per domain, DNS or HTTP validation, domain pinned to one region, shareable read-only across workspaces. $0.25/domain-month; wildcard $20/domain-month.
- **Source:** https://docs.blaxel.ai/Infrastructure/Custom-domains.md — "Blaxel issues a TLS certificate for each custom domain." (docs-confirmed)

### outbound-network — partly — unchanged (new contradiction)
- **Specifics:** Domain allow/deny lists with method, path, wildcard and negation patterns; managed egress proxy injects secrets; optional network-level `firewall: {rulesets: ["proxy"]}` enforcement; dedicated egress IPs private preview. Internet egress included. Enforcement is **opt-in**, and firewalled sandboxes run on Mark 3.0, not Carbon.
- **Source:** https://docs.blaxel.ai/Sandboxes/Proxy-domains.md — "Traffic from tools that ignore proxy environment variables will not be filtered unless domain filter enforcement is enabled." (docs-confirmed)
- **Contradiction:** the networking marketing page says "Every workload starts closed" and "New workloads ship locked down", while the docs say an empty allowlist allows everything and enforcement must be switched on.

### keys-secrets — yes — unchanged
- **Specifics:** Workspace variables + secrets injected at sandbox start; proxy injects headers, body fields and secrets into outbound HTTPS server-side, with dynamic values (UUID, timestamp, nonce) per request. Proxy is public preview; tools that ignore proxy env vars bypass filtering unless firewall enforcement is on.
- **Source:** https://docs.blaxel.ai/Sandboxes/Proxy-secrets-injection.md — "The Blaxel proxy intercepts outbound HTTPS requests from the sandbox and injects headers, body fields, and secrets server-side." (docs-confirmed)

### ways-to-drive — yes — unchanged
- **Specifics:** Console (create, terminal, snapshots), `bl` CLI, Python/TypeScript/Go SDKs, HTTP API for every resource, per-sandbox MCP server, client-side session tokens, plus `bl skills install` which wires Blaxel MCP/skills into Claude Code, Codex, Cursor, Windsurf and others.
- **Source:** https://blaxel.ai/pricing — "Python, TypeScript, and Go SDKs for Blaxel" (docs-confirmed)

### built-in-agents — partly — unchanged
- **Specifics:** Agents Hosting is documented as available (serverless HTTP endpoints for your own Python/TS agent; sync max 100 s, async max 10–15 min). Prebuilt `claude-code`, `codex`, `chromium`, `cua-xfce` images exist. Agent Runtime (session-first, stateful, no execution timeouts) is still a waitlist for a private preview that has not opened, and its compute rate is "Coming soon".
- **Source:** https://blaxel.ai/pricing — "Coming soon" (pricing-page); https://blaxel.ai/platform/agent-runtime — "Apply to get access when the private preview opens."
- **Contradiction:** docs root table says async agents max "10 mins"; https://docs.blaxel.ai/Agents/Overview.md says "maximum runtime of 15 minutes".

### teams-accounts — partly — unchanged
- **Specifics:** Account → multiple workspaces; three roles (admin/member/viewer) with viewer unable to open a terminal; service accounts with workspace-scoped keys; SAML SSO + SCIM behind a `SAML` feature flag and a verified domain; MFA for all login methods except SAML; 90%-of-quota email to admins. No hard spend cap, no customer-facing audit log. Baseten-managed workspaces take membership/roles from Baseten and cannot be edited in Blaxel.
- **Source:** https://docs.blaxel.ai/Security/Workspace-access-control.md — "There are three roles that a user or service account can have in a workspace" (docs-confirmed)

### trials-free-tiers — partly — unchanged (note needs a fix)
- **Specifics:** Pay-as-you-go is $0 + usage; up to $200 one-off promotional credits; "no credit card required" advertised. Tier 0 is free with 10 sandboxes; Tier 1 $20/month top-up → 50; Tier 2 $50 → 200; Tier 9 contact → 100,000+. Tiers are a rolling **30-day top-up volume**, not a fee; promotional credits do not unlock tiers; a drop downgrades the workspace. **Tier 0 cannot request a quota increase without adding a payment method and moving to Tier 1.**
- **Source:** https://blaxel.ai/pricing — "Up to $200 in free credits" (pricing-page); https://docs.blaxel.ai/Security/Quotas.md — "Promotional credits do not unlock tiers"; https://docs.blaxel.ai/knowledge-base/troubleshooting/sandbox-limits-and-quota-exceeded-errors.md — "Tier 0 users must add a payment method and upgrade to Tier 1 before requesting an increase."
- **Note fix:** the existing note says "expiry and card requirement are not published". The site advertises no card, and the standard terms say "Unused Service Credits expire one year after the date of purchase or issuance" (§10.2). What is unpublished is the size of the promotional grant and whether promo credits count as Service Credits.

### company — partly — **status fact changed**
- **Specifics:** Blaxel, Inc. (formerly Beamlit), Delaware, San Francisco; acquired by Baseten on 10 September 2026, product continues; terms last amended 10 December 2025 still name Blaxel; $7.3M seed led by First Round; 12 employees per YC; SOC 2 + HIPAA + ISO 27001 claims; no standard SLA; status page now **Sandboxes 98.45%, Platform 98.42%** for **14 Aug–12 Nov 2026**.
- **Source:** https://status.blaxel.ai/ — "Sandboxes uptime from Aug 14, 2026 to Nov 12, 2026: 98.45%. Partial outage on 14 days. Degraded performance on 12 days. Under maintenance on 3 days." (docs-confirmed)
- **Changed:** baseline quoted 99.33% Sandboxes / 99.30% Platform for Jul–Oct 2026. The rolling 90-day window moved and uptime fell ~0.9 points.

---

## 2. Capabilities — all 78

Format: **id** — verdict — specifics — verbatim quote — source. `unchanged` means the baseline verdict and evidence still hold; `note` means the verdict holds but the note/shortfall needs an edit.

### Isolation (5)

- **own-vm** — yes — microVM; each sandbox has its own kernel; module loading refused by default. "the microVM boundary remains the isolation guarantee between your sandbox and everything else." — https://docs.blaxel.ai/Sandboxes/Non-root-user.md — unchanged
- **root** — yes — root by default; optional unprivileged user via image `USER` + `BL_SANDBOX_USER_ENABLED`. "By default, everything inside a sandbox runs as `root`." — https://docs.blaxel.ai/Sandboxes/Non-root-user.md — unchanged
- **docker-inside** — yes — `blaxel/docker-in-sandbox` image with Docker CLI, Compose and `iptables-legacy`. "Blaxel provides a ready-to-use sandbox image (`blaxel/docker-in-sandbox`) with everything you need to build and run Docker images." — https://docs.blaxel.ai/Tutorials/Docker.md — unchanged
- **nested-virt** — not-published — no `/dev/kvm`, nested-VM or VM-in-VM statement anywhere in docs, tutorials, pricing or changelog; the Android option is an "Android-compatible kernel for running Android in a container", not a VM. "Without `kernelExtensions`, the sandbox's kernel refuses module loading and kernel tracing to every process, including root" — https://docs.blaxel.ai/Sandboxes/Overview.md — unchanged
- **custom-image** — yes — Dockerfile images built/pushed with `bl push` / `bl deploy`; library images cannot be used directly. "Create reusable sandbox images with pre-configured tools, languages, and frameworks using Dockerfiles." — https://docs.blaxel.ai/Sandboxes/Templates.md — unchanged

### Sizes and regions (7)

- **any-size** — partly — memory-only sizing; cores derived. **Note update:** the API reference states a formula, which conflicts with the Overview's 16 GB example. Shortfall stays "You set the memory and the number of cores is decided for you…". "Memory allocation in megabytes. Also determines CPU allocation (CPU cores = memory in MB / 2048, e.g., 4096MB = 2 CPUs)." — https://docs.blaxel.ai/api-reference/compute/create-sandbox.md — unchanged verdict, note
- **big-machines** — partly — custom up to 256 GB RAM; standard documented examples stop at 16 GB. "Up to 256 GB RAM per sandbox or job" — https://blaxel.ai/pricing — unchanged
- **live-resize** — partly — change memory/image via `PUT /sandboxes/{name}`; memory or image change resets sandbox state; no in-place resize. "Updates a sandbox's configuration. Note that certain changes (like image or memory) may reset the sandbox state." — https://docs.blaxel.ai/api-reference/compute/update-sandbox.md — unchanged
- **gpu** — not-published — "Custom hardware options" advertised; no GPU model, count, driver or price. "Custom hardware options" — https://blaxel.ai/pricing — unchanged
- **choose-region** — partly — four Mark 3 regions plus `auto`; "All regions are not necessarily available in self-service by default." — https://docs.blaxel.ai/Infrastructure/Regions.md — unchanged
- **eu-region** — yes — Frankfurt (`eu-fra-1`), Germany; London also available but not EU. "Frankfurt" — https://docs.blaxel.ai/Infrastructure/Regions.md — unchanged
- **big-disk** — **partly (CHANGED from not-published)** — local filesystem is 10–95% of RAM (default 50%, `diskPercent`, mk3.1 only, immutable); volumes are user-sized in MB and expandable upward, with no published maximum; a 256 GB custom machine therefore exposes ≥128 GB local disk at the default, and a volume can be larger. Shortfall: "A 100 GiB disk means a 256 GB custom machine or a volume above your quota tier; no disk or volume maximum is published." "Maximum share of the sandbox memory its filesystem can use, in percent (10-95)." — https://docs.blaxel.ai/api-reference/compute/create-sandbox.md — **CHANGED**

### Lifecycle (3)

- **pause-memory** — yes — standby keeps processes + entire filesystem + memory; sockets die. Shortfall (network only) still valid. "Memory state is maintained even after scaling down, including the running processes and entire filesystem." — https://docs.blaxel.ai/Sandboxes/Overview.md — unchanged
- **warm-pool** — **partly (CHANGED from no)** — the best-practices page documents a pool you keep and refill: create spares, assign one per task, replenish in the background to a target size. There is still no pool object, size setting or API; you run it yourself. Shortfall: "You keep and refill the spare sandboxes yourself; there is no pool setting or API." "For workloads with heavy images, you can maintain a pool of pre-warmed sandboxes to serve requests with near-zero latency." — https://docs.blaxel.ai/Sandboxes/best-practices.md — **CHANGED**
- **fast-start** — yes — resume <25 ms; a brand-new sandbox still boots ("Boot in milliseconds", "connect under one second"). "Sandboxes resume from standby in under 25 milliseconds and automatically scale to zero after a few seconds of inactivity." — https://docs.blaxel.ai/Sandboxes/Overview.md — unchanged

### Snapshots and forks (6)

- **snapshot-files** — partly — private preview. "This feature is currently in private preview and is not recommended for production use." — https://docs.blaxel.ai/Sandboxes/Fork.md — unchanged
- **snapshot-memory** — partly — captures filesystem, processes and memory; private preview. "A snapshot captures the state of a sandbox at a point in time: its filesystem, its running processes, and its memory." — https://docs.blaxel.ai/Sandboxes/Fork.md — unchanged
- **fork-running** — partly — `fork()` snapshots the live source automatically; private preview. "Calling `fork()` automatically snapshots the source sandbox's current state and forks from it." — https://docs.blaxel.ai/Sandboxes/Fork.md — unchanged
- **older-snapshot** — yes — named snapshots, workspace-level IDs, survive source deletion, no expiry; restore any of them. "A snapshot outlives the sandbox it was captured from: it stays usable, and forkable, after that sandbox is deleted." — https://docs.blaxel.ai/Sandboxes/Fork.md — unchanged
- **templates** — yes — Dockerfile images, volume templates, and fork-from-snapshot. "It is also possible to build your own custom images to create sandboxes with a consistent, customized set of tools, configurations, or entrypoint scripts." — https://docs.blaxel.ai/Sandboxes/Overview.md — unchanged (volume templates are an extra route)
- **backups** — no — standby snapshots are for fast resume, not disaster recovery; no schedule, retention policy or restore-point list. Agent Drive is replicated and "separately backed up", but that is storage redundancy, not machine backups. "Automatic deletion differs from the automatic standby (*scale-to-zero*) which happens to **all sandboxes** when inactive…" — https://docs.blaxel.ai/Sandboxes/Expiration.md — unchanged

### Storage (4)

- **files-survive-stop** — yes — standby keeps everything; archive keeps files and restarts processes with new IDs. "Unarchiving it starts the sandbox again from its image and writes the archived filesystem back over it, so you get the same sandbox back with its files." — https://docs.blaxel.ai/Sandboxes/Overview.md — unchanged
- **volumes** — yes — block storage survives sandbox deletion; one per sandbox; attach at creation; **cannot detach**; resize up only; billed on provisioned capacity. "Blaxel Volumes provide persistent storage that survives sandbox destruction and recreation." — https://docs.blaxel.ai/Sandboxes/Volumes.md — unchanged verdict, note (detach/resize limits)
- **shared-volume** — partly — Agent Drive is the shared POSIX+S3 filesystem, but it is **private preview, `us-was-1` only, size not configurable, and not available on Carbon**. Shortfall update: "Shared storage is Agent Drive, a private preview in us-was-1 only: you cannot set its size, and it is not available on Carbon." "This feature is currently in private preview. During the preview, the Agent Drive feature is only available in the `us-was-1` region." — https://docs.blaxel.ai/Agent-drive/Overview.md — unchanged verdict, note
- **mount-buckets** — no — external S3-style buckets cannot be mounted as volumes; Agent Drive exposes an S3-compatible API but is not a mount of your bucket. "Blaxel also does not support mounting external storage (such as S3 buckets) as volumes." — https://docs.blaxel.ai/Volumes/Overview.md — unchanged

### Idle timers (4)

- **stay-on** — partly — Tier 0 deletes after 7 days, Tier 1 after 30; higher tiers unlimited; TTL/lifecycle policies can delete earlier; `ttl` minimum 5m, `ttl-idle` minimum 1m. "Some quota tiers enforce expiration dates (Tier 0 and 1, with respectively up to 7 and 30 days). In higher tiers, unlimited persistence is permitted." — https://docs.blaxel.ai/Sandboxes/Expiration.md — unchanged
- **choose-idle** — no — no stop/start or idle-timeout setting; standby is automatic; you can only keep a process alive or hold a connection. "There are no built-in stop or start functions available in the SDKs to manage standby mode." — https://docs.blaxel.ai/Sandboxes/Standby-control.md — unchanged
- **wake-on-request** — yes — reconnect or request resumes from standby. "Reconnecting to the sandbox transitions it back to active mode." — https://docs.blaxel.ai/Sandboxes/Overview.md — unchanged
- **schedules** — yes — cron, `at`, `sleep`; 100 schedules per sandbox; execution history ring buffer (default 100); `keepAlive` defaults true. "A sandbox can hold up to 100 schedules." — https://docs.blaxel.ai/Sandboxes/Schedules.md — unchanged

### Reaching it (6)

- **public-url** — yes — preview URL maps to a port; can be public or token-private; multiple per sandbox. "This preview URL can be either public (does not require you to be authenticated to access it) or private" — https://docs.blaxel.ai/Sandboxes/Preview-url.md — unchanged
- **private-url** — yes — per-preview token in `bl_preview_token` query param or `X-Blaxel-Preview-Token` header. "When you create a private preview URL a token is required to access the URL." — https://docs.blaxel.ai/Sandboxes/Preview-url.md — unchanged
- **ssh** — **partly (CHANGED from no)** — no SSH address, key management or sshd in the base image; the documented route is the first-party `blaxel/tailscale` image, which joins your tailnet and supports `tailscale ssh root@<name>` or plain `ssh root@<tailnet-ip>` from an authorised device. Needs a Tailscale account + auth key, and a tailnet policy. Shortfall: "No SSH address or keys from Blaxel; SSH comes only from the blaxel/tailscale image, which joins your own tailnet and needs a Tailscale auth key." "Once authenticated, the sandbox is reachable via SSH from any device on your Tailscale network:" — https://docs.blaxel.ai/Tutorials/Tailscale.md — **CHANGED**
- **web-terminal** — yes — Console → sandbox → Terminal tab. "selecting the **Terminal** tab" — https://docs.blaxel.ai/Sandboxes/Overview.md — unchanged
- **tunnel** — not-published — `bl connect sandbox` is an interactive terminal, not local port forwarding; no `ssh -L`/`-R` or tunnel command documented. Tailscale gives a tailnet IP, which is direct reachability rather than a localhost tunnel. "bl connect sandbox your-sandbox-name" — https://docs.blaxel.ai/Sandboxes/Overview.md — unchanged (Tailscale noted)
- **raw-tcp** — not-published — the Ports page calls them "TCP ports" but every access path is HTTP(S): `https://sbx-…bl.run/port/{n}` or a preview URL. No host:port or protocol endpoint is published. Tailscale is the only documented non-HTTP path. "You can have multiple preview URLs per sandbox." — https://docs.blaxel.ai/Sandboxes/Preview-url.md — unchanged (judgement call)

### Custom domains (2)

- **custom-domain** — yes — register a domain, wildcard subdomains, one region per domain, shareable read-only. "Blaxel issues a TLS certificate for each custom domain." — https://docs.blaxel.ai/Infrastructure/Custom-domains.md — unchanged
- **auto-https** — yes — certificate per domain, DNS validation default, HTTP validation private preview; validation method fixed at creation. "Blaxel issues a TLS certificate for each custom domain." — https://docs.blaxel.ai/Infrastructure/Custom-domains.md — unchanged

### Outbound network (4)

- **egress-included** — yes — internet egress "Included"; no per-GB tariff or allowance. "Internet egress traffic Outbound traffic from your workloads to the internet. Included" — https://blaxel.ai/pricing — unchanged
- **egress-allowlist** — partly — allowlist/denylist with method, path, wildcard and negation patterns; **network-level enforcement exists but is opt-in** (`network.firewall.rulesets: ["proxy"]`), is set only at creation, and runs only on Mark 3.0 (not Carbon). Without it, only tools that honour `HTTP_PROXY`/`HTTPS_PROXY` are filtered. Shortfall: "Filtering is opt-in: tools that ignore the proxy variables get out until you enable the firewall ruleset, and that enforcement is unavailable on Carbon." "Traffic from tools that ignore proxy environment variables will not be filtered unless domain filter enforcement is enabled." — https://docs.blaxel.ai/Sandboxes/Proxy-domains.md — unchanged verdict, note (new enforcement + Carbon gap)
- **no-internet** — **yes (CHANGED from not-published)** — the sandbox network API has `DELETE /network/tunnel`: stopping the tunnel removes **all** outbound internet while inbound keeps working; `PUT /network/tunnel/config` re-establishes it. This is an API call, not a console switch, but it is a documented, reversible no-egress mode. "After disconnecting, the sandbox will lose all outbound internet connectivity (no egress). Inbound connections to the sandbox will still work." — https://docs.blaxel.ai/api-reference/network/disconnect-tunnel.md — **CHANGED**
- **static-ip** — partly — dedicated egress gateways, private preview, sandboxes only, assigned at creation, one IP per 32,000 sandboxes, free during beta. "This feature is currently in private preview and is not intended for production use." — https://docs.blaxel.ai/Infrastructure/Dedicated-egress-gateways.md — unchanged

### Keys and secrets (3)

- **secrets-store** — yes — workspace variables and secrets injected at start; secrets encrypted/masked. "Configure environment variables and secrets in Blaxel sandboxes" — https://docs.blaxel.ai/Sandboxes/Variables-and-secrets.md — unchanged
- **hidden-secrets** — partly — proxy injects headers/body/secrets server-side; public preview; tools that ignore proxy env vars bypass it unless firewall enforcement is on. "The Blaxel proxy intercepts outbound HTTPS requests from the sandbox and injects headers, body fields, and secrets server-side." — https://docs.blaxel.ai/Sandboxes/Proxy-secrets-injection.md — unchanged
- **scoped-keys** — partly — personal keys span every workspace; service-account keys are limited to one workspace but have no narrower permission scopes. Client-side sessions are the one narrower credential: time-limited, sandbox-API-only. Shortfall: "A service-account key is limited to one workspace but has no narrower permissions; only short-lived client sessions are scoped tighter." "a service account's API key or client-credentials token only grants access to the single workspace that service account belongs to" — https://docs.blaxel.ai/Security/Access-tokens.md — unchanged verdict, note (sessions)

### Ways to drive (10)

- **dashboard-create** — yes — "+Create sandbox → Deploy from console", choosing image, resources, TTL, region; browser terminal. "Click **+Create sandbox** -> **Deploy from console**." — https://docs.blaxel.ai/Sandboxes/Overview.md — unchanged
- **cli** — yes — `bl` manages sandboxes, agents, MCP servers, jobs; `bl connect`, `bl push`, `bl deploy`, `bl skills install`. "Install the Blaxel CLI (bl) to manage sandboxes, agents, MCP servers, jobs, and other resources from your terminal" — https://docs.blaxel.ai/cli-reference/introduction.md — unchanged
- **python-sdk** — yes — official `blaxel` Python package. "Python, TypeScript, and Go SDKs for Blaxel" — https://blaxel.ai/pricing — unchanged
- **ts-sdk** — yes — official `@blaxel/core` TypeScript package. "Python, TypeScript, and Go SDKs for Blaxel" — https://blaxel.ai/pricing — unchanged
- **rest-api** — yes — every resource has an HTTP API; sandbox API at `https://sbx-…bl.run`. "HTTP API for every Blaxel resource" — https://blaxel.ai/pricing — unchanged
- **mcp-server** — yes — per-sandbox MCP at `/mcp`, streamable HTTP, bearer key; tools for files, processes, ports, previews. "Every Blaxel sandbox exposes a built-in MCP server so agents can operate the sandbox using tool calls for files, processes, ports, and previews." — https://docs.blaxel.ai/llms.txt — unchanged
- **pty** — yes — interactive terminal from Console or `bl connect`; the process API also distinguishes TTY from pipe. "You can explore the contents of a sandbox with an interactive terminal." — https://docs.blaxel.ai/Sandboxes/Overview.md — unchanged
- **file-api** — yes — read/write/list/delete via SDK, MCP or REST. "Read, write, list, and delete files inside a Blaxel sandbox using a simple file system interface from the SDK, MCP server, or REST API." — https://docs.blaxel.ai/Sandboxes/Filesystem.md — unchanged
- **prompt-api** — no — no prompt endpoint; Agents Hosting runs your deployed agent code; Agent Runtime (the product that would run a session) is "Soon" and on the waitlist for a private preview. "Session-first, stateful runtime for long-running agents." — https://blaxel.ai/company/security — unchanged
- **one-click-hermes** — no — no Hermes mention in `llms.txt`, tutorials, images or changelog; you would install it yourself. (Absence checked 2026-11-12; the only coding-agent harness page is OpenClaw's.) "Deploy and run OpenClaw, an open-source coding agent harness, inside a Blaxel sandbox" — https://docs.blaxel.ai/llms.txt — unchanged
- **one-click-openclaw** — no — OpenClaw has a tutorial and a plugin repo, but setup is manual: create a sandbox, install the SDK, run a Python script, configure a model key. "OpenClaw can be manually installed and configured to run inside a Blaxel sandbox." — https://docs.blaxel.ai/Tutorials/OpenClaw.md — unchanged

### Built-in agents (5)

- **agents-preinstalled** — **yes (CHANGED from no)** — first-party images ship the CLIs: `blaxel/claude-code` ("Claude Code CLI environment with Node.js 24 (slim)") and `blaxel/codex` ("Codex CLI environment with Node.js 24 (slim)"), alongside a bare `blaxel/base-image` (Node 22 + Python 3.12). Same pattern as Lizard's `claude`/`codex` templates and Agent 37's agent templates, both `yes`. Figure: "Claude Code / Codex images". "Blaxel provides a library of pre-built container images for common needs." — https://docs.blaxel.ai/Sandboxes/Templates.md — **CHANGED**
- **browser** — **yes (CHANGED from no)** — first-party headless images: `blaxel/chromium` (Chromium 124, CDP on 8081 via nginx), `blaxel/playwright-chromium` (Playwright + Chromium, Node 20), `blaxel/playwright-firefox`, and `blaxel/lightpanda`. No browser in the bare base image, but you no longer build your own. "Headless Chromium environment with Chrome 124 (Alpine)" — https://docs.blaxel.ai/Sandboxes/Templates.md — **CHANGED**
- **desktop** — **yes (CHANGED from no)** — first-party XFCE images: `blaxel/xfce-vnc` (TigerVNC 5901 + noVNC 6901) and `blaxel/cua-xfce` (same plus trycua computer-server on 8000 with screenshots, mouse and keyboard for agents). "XFCE desktop environment with CUA" — https://docs.blaxel.ai/Sandboxes/Templates.md — **CHANGED**
- **hosts-other-agents** — yes — documented recipes for Claude Managed Agents (self-host the execution layer), OpenAI Agents API/SDK, Codex, Amp, OpenClaw, Herdr, DeepSeek Harness, Omnara, NVIDIA OpenShell. "Self-host the Claude Managed Agents (CMA) sandbox execution layer on Blaxel while Anthropic runs the agent loop" — https://docs.blaxel.ai/Tutorials/Claude-Managed-Agents.md — unchanged (more recipes)

### Teams and accounts (6)

- **team-workspace** — yes — account → multiple workspaces; members, service accounts, shared resources. "There are three roles that a user or service account can have in a workspace" — https://docs.blaxel.ai/Security/Workspace-access-control.md — unchanged
- **roles** — yes — admin / member / viewer; viewer is read-only and cannot open a terminal; service-account tokens are workspace-scoped. "There are three roles that a user or service account can have in a workspace: **admin**, **member** and **viewer**." — https://docs.blaxel.ai/Security/Workspace-access-control.md — unchanged
- **sso** — partly — SAML SSO + SCIM directory sync, but both need a `SAML` feature flag enabled by Blaxel and a verified domain; SAML becomes the only login method for that domain. "require the **SAML** feature flag on your account" — https://docs.blaxel.ai/Security/SSO-Directory-sync.md — unchanged
- **spend-cap** — not-published — no budget, hard cap or auto-stop; quota tiers limit sandbox counts/sizes, and auto top-up adds funds automatically. "Monitor usage alerts" is the only control documented. — https://docs.blaxel.ai/Security/Quotas.md — unchanged
- **usage-alerts** — yes — email to workspace admins at 90% of the tier quota. "Blaxel automatically dispatches an email notification to workspace administrators when your infrastructure usage reaches 90% of your current tier's quota." — https://docs.blaxel.ai/Security/Quotas.md — unchanged
- **audit-log** — not-published — no customer-facing audit/event log in console, API, CLI or docs; the compliance portal describes internal audit logging, not an export. "under role-based access and audit logging" — https://compliance.blaxel.ai/en — unchanged

### Billing models (5)

- **per-second** — yes — active compute metered per GB-second. "$0.0000115 / GB RAM · second" — https://blaxel.ai/pricing — unchanged
- **active-cpu** — no — meter is allocated RAM while active; CPU is included, not separately metered, so an idle CPU still bills the RAM. "billed by its allocated memory (CPU scales automatically)" — https://blaxel.ai/pricing — unchanged
- **cheap-pause** — yes — standby stops memory charges; snapshot storage ($0.20/GB-month) and volumes ($0.12/GB-month) continue. "You are not charged for memory while a sandbox is in standby mode." — https://docs.blaxel.ai/Sandboxes/Overview.md — unchanged
- **no-monthly-fee** — yes — pay-as-you-go is $0.00 + usage; no subscription. "Usage-based pricing with infinite scalability." — https://blaxel.ai/pricing — unchanged
- **flat-price** — no — no fixed monthly machine price; bill follows GB-seconds and storage. "$0.0000115 / GB RAM · second" — https://blaxel.ai/pricing — unchanged

### Trials and free tiers (3)

- **free-tier** — no — no recurring monthly free allowance; the only free usage is a one-off promotional credit (up to $200). "Up to $200 in free credits" — https://blaxel.ai/pricing — unchanged
- **free-credit** — yes — up to $200 promotional credits advertised; actual grant not published. "Up to $200 in credits, no credit card required." — https://blaxel.ai/company/security — unchanged
- **no-card** — yes — signup advertises no card. Catch: Tier 0 cannot request a quota increase until a payment method is added and the account moves to Tier 1. "Up to $200 in credits, no credit card required." — https://blaxel.ai/company/security — unchanged verdict, note (Tier 0 quota catch)

### Company (5)

- **status-page** — yes — status.blaxel.ai; components for Sandboxes, Previews, Platform, Agents, MCP, Jobs, Model API, Console, Website; 90-day rolling uptime and a 25-item incident feed. "Sandboxes uptime from Aug 14, 2026 to Nov 12, 2026: 98.45%." — https://status.blaxel.ai/ — unchanged verdict, note (window/cap)
- **sla** — partly — only "Custom SLAs" on the Custom plan; no published numeric uptime commitment, exclusions or service credits for pay-as-you-go. "Custom SLAs" — https://blaxel.ai/pricing — unchanged
- **soc2** — yes — SOC 2 Type 2 report listed on the compliance portal, request-access gated; ISO 27001 certificate viewable; HIPAA claimed with a $250/month BAA add-on. "SOC 2, HIPAA, ISO 27001" — https://blaxel.ai/company/security — unchanged
- **dpa** — not-published — no DPA link on terms, privacy, security, pricing or the 15-document compliance portal (SOC 2, ISO 27001, HIPAA plus 9 policies, 2 cookie policies and a privacy policy). "Documents (15)" — https://compliance.blaxel.ai/en — unchanged (stronger check)
- **open-source** — **partly (CHANGED from no)** — the in-VM sandbox API is MIT-licensed open source (`blaxel-ai/sandbox`, Go, `sandbox-api/`), and the marketing page says so. The microVM host, scheduler, console and billing are not published, so the service is not self-hostable; "Bring your own metal" is a custom deployment that still connects to Blaxel's control plane. Shortfall: "Only the in-VM sandbox API is MIT open source; the scheduler and console are not, so you still cannot run the service yourself." "Blaxel's sandbox API is fully open-source." — https://blaxel.ai/platform/sandboxes — **CHANGED**

---

## 3. Rate-card inputs

Fresh retrieval: Context `web_scrape` of `https://blaxel.ai/pricing` with `maxAgeMs: 0` returned `cache_metadata {"status":"miss","age_ms":0}`. The same figures are present in the raw server HTML fetched by curl (server-rendered, not only in the client bundle). `cd site && npm run check-rates` printed **no `blaxel` line at all** — no `CHANGED`, `NEW`, `BLOCKED` or `OLD` — against the baseline seen 2026-10-30.

### What the card holds (unchanged)

| Card field | Current value | Published original unit |
|---|---|---|
| `ram.rate` | 0.0414 | **$0.0000115 per GB of allocated RAM per second** (×3,600 = $0.0414/GB-hour) |
| `disk.persistentMonthly` | 0.12 | **$0.12 per GB-month**, provisioned volume capacity, whether written or not |
| `between` | `"kept"` | standby keeps memory + filesystem; memory not billed, snapshot storage billed |
| `egress.perGiB` | 0 | **"Included"** — internet egress has no per-GB tariff or allowance |
| `plans` | `[{Pay as you go, fee 0}]` | **$0.00 + usage**; no subscription |
| `ramForVcpu` | 4→8, 6→16 | 8 GB gets 4 cores; 16 GB gets 6 cores (Overview) |
| free credit | up to $200 | one-off promotional credit, not recurring |

**No plan, unit rate, allowance or free-tier input changed.** The only ambiguity in the card is `ramForVcpu`'s 6→16 point: the Overview's 16 GB → 6 cores conflicts with the API reference's `cores = MB/2048` (16 GB → 8 cores). 4→8 is consistent in both. A/B/C are unaffected because they use 4 GB→2 cores and 8 GB→4 cores, which both pages agree on.

### Published tariffs the card does not model (all unchanged)

- **Snapshots** $0.20/GB-month (standby state, size not published); **images** $0.045/GB-month.
- **Custom domains** $0.25/domain-month; wildcard $20/domain-month.
- **Support add-ons:** email $800/month + 3% of usage; dedicated $1,600/month + 10%; **HIPAA** $250/month (includes BAA).
- **Batch Jobs** $0.000006/GB-second; **MCP Hosting** $0.000007/GB-second; **Agent Runtime** "Coming soon" (no rate).
- **Agents Hosting** (the documented serverless agent-endpoint product) has **no pricing row at all** on the page; only Agent Runtime is listed as coming soon. Do not price it as free or as sandboxes until Blaxel publishes a rate.
- **Dedicated egress IPs**, egress-gateway runtime, **proxy data**, **Agent Drive** storage/operations: "Free during beta".
- **Internal traffic** and **internet egress**: "Included".
- **Quota tiers:** Tier 0 free, 10 sandboxes; Tier 1 $20/month top-up, 50; Tier 2 $50/month, 200; … Tier 9 contact, 100,000+. Rolling **30-day** top-up volume; promotional credits do not count; a falling balance downgrades the tier.
- **Minimums:** sandbox `ttl`/`ttl-max-age` 5m, `ttl-idle` 1m; terminated-record retention defaults 5m. No minimum billed duration is published.
- **Local disk:** `diskPercent` 10–95% of RAM, default 50, mk3.1 only, immutable after creation. Volume resize is increase-only; volumes cannot be detached.

### A / B / C — inputs unchanged, one feasibility caveat and two arithmetic slips

- **A** $27.60: 4 GB × 600,000 s × $0.0000115. Unchanged. **New feasibility caveat:** the preset's 10 GiB disk does not fit the default local filesystem on mk3.1 (50% of 4 GB = ~2 GiB; Mark 3.0's fixed disk size is not published). If the task needs 10 GiB at once, add an ~11 GB volume (~$0.30 for 166⅔ hours at $0.12/GB-month) or raise memory (11.3 GB at 95% ≈ $78, 20 GB at 50% = $138). The $27.60 assumes the working set fits in ~2 GiB.
- **B** $247.78: 8 GB × 2,628,000 s × $0.0000115 = $241.776, + 50 GB × $0.12 = $6.00. Unchanged. Local disk defaults to ~4 GiB, so the 50 GB volume is doing real work.
- **C** $17.30 + snapshot: 4 GB × 324,000 s = $14.904, + 20 GB × $0.12 = $2.40. Unchanged. Snapshot term is S × $0.20 × 630/730 in the card, but C is 90 running + **640** stopped hours (730 − 90); 630 is a slip. With 640 it is S × $0.20 × 640/730.

### Two errors in the provider profile's cost block (not rate changes)

1. **C shape label** says "4 vCPU / 8 GiB, 20 GB volume" but C is the 2 vCPU / 4 GiB preset and the line items use 4 GB. The label should read 2 vCPU / 4 GiB.
2. **C standby hours** say "630 standby" and the note uses `630/730`; 730 − 90 = **640**. The active-compute and volume lines are unaffected; only the unknown snapshot term is scaled wrong.

Both are in `site/src/data/providers/blaxel.json` at baseline and should be fixed while the file is open.

---

## 4. Contradictions between first-party pages

### 4.1 Idle timing — 5 s vs 15 s vs 15 min vs "the second"

- **Pricing hero:** "Because Blaxel scales sandboxes to zero the second they're idle and resumes the full memory state in just 25 milliseconds, teams run up to 70% more cost-effectively in practice." — https://blaxel.ai/pricing
- **Pricing FAQ:** "Sandboxes scale to zero after about 5 seconds of inactivity and resume from standby in roughly 25ms, even after months of being suspended." — https://blaxel.ai/pricing
- **Sandbox overview:** "If a sandbox does not have an active connection, it automatically transitions to a warm standby mode (also called *scale-to-zero*). This transition happens in approximately 15 seconds." — https://docs.blaxel.ai/Sandboxes/Overview.md
- **Same page, sockets:** "If a sandbox has an ongoing WebSocket/TCP connection, there is a 15-minute idle timeout for such a connection." — https://docs.blaxel.ai/Sandboxes/Overview.md
- **Best practices:** "Auto-suspend happens automatically after 15s of inactivity." — https://docs.blaxel.ai/Sandboxes/best-practices.md
- **Docs root:** "Automatic scale-to-zero after 5s inactivity, resume from standby under 25ms even after weeks." — https://docs.blaxel.ai/Overview.md

**Reading:** these are two different timers, not one. With no open connection, the sandbox overview and best practices say ~15 s, the docs root and pricing FAQ say ~5 s, the pricing hero says "the second". With an open but idle WebSocket/TCP connection, the socket is cut after **15 minutes**, then standby. The site's old "15 min (docs) vs 5 s (pricing)" framing put the socket rule against the general timer. For a buyer, the practical idle bill is ~5–15 s of silence after the last client disconnects, and up to 15 minutes if a socket is left open but unused.

### 4.2 CPU at 16 GB — 6 cores vs 8

- "a sandbox with 8 GB memory is allocated 4 CPU cores, while one with 16 GB memory is allocated 6 CPU cores." — https://docs.blaxel.ai/Sandboxes/Overview.md
- "CPU cores = memory in MB / 2048, e.g., 4096MB = 2 CPUs" — https://docs.blaxel.ai/api-reference/compute/create-sandbox.md

8 GB → 4 cores agrees. 16 GB → 6 (Overview) vs 8 (formula). The rate card follows the Overview (6→16). A/B/C are unaffected.

### 4.3 Egress is "closed by default" on the marketing page, opt-in in the docs

- **Networking page:** "Every workload starts closed. You define the allow-list, and Blaxel enforces it at the network layer, not inside the runtime where a clever agent could route around it." / "Deny by default" / "New workloads ship locked down, so an unreviewed dependency cannot phone home." — https://blaxel.ai/platform/networking
- **Docs:** "An empty `allowedDomains` allows everything that is not in `forbiddenDomains`." / "Enforcement is not enabled automatically when a proxy is configured — you must opt in with the `firewall` config." / "Firewalled sandboxes run on Mark 3.0 infrastructure; this feature is not yet available on Carbon (Mark 3.1)." — https://docs.blaxel.ai/Sandboxes/Proxy-domains.md

**Reading:** the default sandbox is open; the marketing copy describes the recommended locked-down configuration (or a future default). The `egress-allowlist` shortfall still stands, and enforcement is additionally unavailable on Carbon, which the non-root page says is the default generation for new US workspaces.

### 4.4 Which generation is default?

- "Carbon is enabled by default for new workspaces in the `us-pdx-1` and `us-was-1` regions, and is rolling out progressively to existing workspaces." — https://docs.blaxel.ai/Sandboxes/Non-root-user.md
- "Carbon is currently in private preview and is rolling out progressively by region and by workspace, so it isn't yet the default everywhere." and "By default, deployed workloads run on Mark 3.0 infrastructure." — https://docs.blaxel.ai/Infrastructure/Gens.md

Not a strict contradiction ("not everywhere" ≠ "not in the US"), but the two pages give opposite first impressions. The specific new-workspace statement is the better guide. Consequence: a new US workspace may be on Carbon, where **Agent Drive, firewalling and dedicated egress IPs are unavailable**, while **snapshots/forking (the Carbon layer) and non-root isolation** are Carbon features.

### 4.5 Agents Hosting maximum runtime — 10 vs 15 minutes

- Docs root product table, Agents Hosting async row: "a few minutes (**maximum 10 mins**)" — https://docs.blaxel.ai/Overview.md
- Agents page: "Agents deployed on Blaxel Agents Hosting have a maximum runtime of 15 minutes." — https://docs.blaxel.ai/Agents/Overview.md

Use 15 minutes (product page). This limit explicitly does **not** apply to sandboxes or batch jobs.

### 4.6 "Fully open-source" vs no self-hosted edition

- "Blaxel's sandbox API is fully open-source." — https://blaxel.ai/platform/sandboxes
- The MIT repo contains the in-VM `sandbox-api` (Go) and image templates, not the microVM host, scheduler, console or billing. The only self-hosting-shaped option is Custom "Bring your own compute"/"Bring-your-own-metal", which still connects to Blaxel's control plane. — https://github.com/blaxel-ai/sandbox

**Reading:** component open source, not a self-hostable platform. The `open-source` row should say which.

### 4.7 HIPAA document is the SOC 2 report

The compliance portal lists a "HIPAA" document whose filename is "Blaxel SOC 2 Type 2 Report.pdf" — the same file as the SOC 2 entry. There is no separate HIPAA report or certificate in the 15 documents. — https://compliance.blaxel.ai/en

**Reading:** the HIPAA claim rests on the BAA add-on plus SOC 2 controls, not a distinct HIPAA attestation. The site's "Claims SOC 2, HIPAA and ISO 27001" is accurate as a claim; do not imply three separate reports.

---

## 5. Products the 16 features / 78 capabilities miss

Ordered by how much a buyer would care. "Age" is from the changelog or docs repo; **none of these is new since 2026-10-28** except where noted.

1. **Applications (Application Runtime)** — private preview. "Serve AI-generated code as publicly accessible endpoints with revision management and custom URLs." Deploy from source, image or a **forked sandbox**; immutable revisions (max 5 kept); blue-green, rollback; per-app custom domains. This is the production counterpart to a sandbox preview and has **no feature or capability row**. No published rate. — https://docs.blaxel.ai/Applications/Overview.md
2. **Agent Runtime** — waitlist for a private preview that has not opened; "Soon" in nav and pricing. "Session-first, stateful runtime for long-running agents"; "No execution timeouts"; multi-agent primitives (atomic lock, borrow, handover, copy-on-write forks, shared context drives). The only capability that gestures at it is `prompt-api` = no. — https://blaxel.ai/platform/agent-runtime
3. **Agents Hosting** — documented as available (no preview banner) serverless HTTP hosting for your own Python/TS agent code, sync ≤100 s, async ≤15 min, revisions, tracing. Not a sandbox capability; `built-in-agents` covers it only in passing. — https://docs.blaxel.ai/Agents/Overview.md
4. **Batch Jobs** — parallel tasks across isolated sandboxes, 24 h max, cron included, $0.000006/GB-second. No capability row; `schedules` is about a single sandbox's cron, not a batch product. — https://blaxel.ai/pricing
5. **MCP Hosting** — deploy MCP servers as first-class serverless workloads at $0.000007/GB-second, 10 min max, private network to your agents. The `mcp-server` row is the *sandbox's own* MCP server, a different product. — https://docs.blaxel.ai/Functions/Overview.md
6. **Model Gateway / Model APIs** — one endpoint per provider, centralized keys, telemetry, governance policies, fallback; Baseten appears as a provider in the docs (added 30 Oct 2026). No capability row; model spend is separate from sandbox spend. — https://docs.blaxel.ai/Models/Overview.md
7. **Agent Drive S3-compatible endpoint** — every drive exposes an S3 API (AWS CLI, boto3, SigV4), so shared storage is reachable without mounting. `mount-buckets` is about mounting *external* buckets and stays `no`; this is the reverse direction and has no row. — https://docs.blaxel.ai/Agent-drive/S3-endpoint.md
8. **Volume templates** — pre-populated filesystem snapshots used to initialise new volumes; a faster "known-good state" than copying files. `templates` covers images and snapshots, not volume templates. — https://docs.blaxel.ai/Volumes/Volumes-templates.md
9. **Client-side sessions** — backend mints a time-limited token scoped to one sandbox's API; a browser can then drive files/processes directly with no proxy and no workspace key. The closest row is `scoped-keys` (partly); sessions are a different credential. — https://docs.blaxel.ai/Sandboxes/Sessions.md
10. **Lifecycle signals** — SIGTERM before deletion and SIGUSR2 before standby, with configurable grace (`terminationGracePeriodSeconds`, `standbyGracePeriodSeconds`; both default 0). No capability row; matters for checkpointing on scale-to-zero. — https://docs.blaxel.ai/Sandboxes/Lifecycle-signals.md
11. **Bring-your-own-metal / private networking** — bare metal in your VPC connected privately to Blaxel's control plane; VPC peering; "data stays on your hardware during execution". Custom plan only. Relevant to `isolation`, `eu-region` and `company`, but not modelled. — https://blaxel.ai/pricing
12. **Skills + MCP for coding agents** — `bl skills install` gives Claude Code, Codex, Cursor, Windsurf, etc. Blaxel skills and MCP servers so the assistant can create/deploy resources; `bl setup` wires it automatically. A new "ways to drive" surface (agent-driven, zero code). — https://docs.blaxel.ai/skills-mcp.md
13. **Billing Explorer API** — programmatic cost/usage with multi-dimension `groupBy` (up to 3), current period/30d/7d/24h. No capability row for cost export. — https://docs.blaxel.ai/Security/Billing-Explorer-API.md
14. **Domain capture + MFA** — verify a company email domain to control login methods and auto-onboard users; TOTP/SMS MFA for all methods except SAML. `sso`/`teams-accounts` only partly cover this. — https://docs.blaxel.ai/Security/Domain-capture.md
15. **Zero Data Retention (ZDR)** — native ZDR claim when a sandbox is deleted without standby; root filesystem in memory; no row for data-retention guarantees. — https://blaxel.ai/company/security

Also post-baseline but smaller: `auth.md` (machine-readable auth guide for agents, 10 Nov), Baseten appearing as a model provider in the Model APIs docs (30 Oct), and the Omnara tutorial update (3 Nov). The NVIDIA OpenShell (26 Sep) and n8n (Apr) tutorials predate the baseline.

---

## 6. Company, status and legal — what moved

### Status page (changed)

The 90-day window rolled from Jul–Oct to **14 Aug–12 Nov 2026**. Current figures, from the page's `aria-label`s:

- **Sandboxes 98.45%** — "Partial outage on 14 days. Degraded performance on 12 days. Under maintenance on 3 days."
- **Platform 98.42%** — "Full outage on 1 day. Partial outage on 13 days. Degraded performance on 12 days. Under maintenance on 3 days."
- Model API 99.79%, Agents 99.70%, MCP 99.70%, Jobs 99.73%, Previews 99.82%, Console 100%, Website 100%.
- Header: "We're fully operational".

Baseline said Sandboxes 99.33%, Platform 99.30% for Jul–Oct. The company feature row and the profile's "Status and SLA" fact both need the new numbers and period.

### Incident feed (method correction)

`/api/v2/incidents.json` returns **exactly 25 records**; `page=1/2`, `per_page=100`, `limit=100`, `offset=25` and a `start`/`end` range all returned the same 25. Current 25 span **2026-09-04 → 2026-11-11** (68 days), not a 90-day window.

- 22 of the 25 name sandboxes, workloads, drives, volumes, previews, deployment or creation.
- Longest: **12 h 00 m**, "Some sandboxes are unavailable in us-was-1", 29 Oct 2026.
- Next: 6 h 39 m "Increase in volume errors", 28 Oct; 6 h 18 m "Increased mount and connection errors with Agent Drives in us-was-1", 29 Sep.
- The 1 Sep 16-hour incident in the baseline fact has aged out of the feed.

**Correction:** the baseline research note says "25 records, 2026-08-25 to 2026-11-03 … That is below the 50-record cap, so the list is complete." The cap is **25**, not 50, and the list is a rolling latest-25, so a 90-day count cannot be read from it. The profile's "25 incidents from 6 August to 4 November" is the feed size, not a count of incidents in that window; and it now reads "25 incidents, 4 September to 11 November". Either refresh the fact with the new range and "latest 25" wording, or count from incident pages over a fixed window.

### Terms and entity (unchanged)

- Terms page: "Last updated December 10, 2025"; PDF: "Last amended on December 10, 2025"; party "Blaxel, Inc (formerly known as Beamlit, Inc.), a Delaware corporation, d/b/a Blaxel".
- §12.4: "No Customer Data will be retained for more than 90 days after expiration or termination of this Agreement", with backup/legal exceptions; §12.4 also says Blaxel "may delete the applicable Customer Data at any time in its sole discretion".
- §10.1 renewal at "then-current rates"; §10.2 "Unused Service Credits expire one year after the date of purchase or issuance"; §12.2 30-day non-renewal notice for 12-month terms.
- No DPA among the 15 compliance-portal documents; privacy policy now lives on the portal (`https://compliance.blaxel.ai/en`), not `blaxel.ai/legal/privacy`.
- About page: "In 2026, Blaxel joined Baseten…"; "$7.3M seed round led by First Round"; SOC 2/HIPAA/ISO 27001. It does not list founders; the seed blog still names all six, and YC still says "Blaxel has 12 employees based in San Francisco."
- Baseten post (10 Sep 2026) still says "Blaxel is continuing", "The product doesn't change, and features will keep shipping", "Over time, Baseten will add new products based on Blaxel's primitives, starting with Sandboxes."

---

## 7. Use-case knock-on

- **`coding-agent`** — Blaxel's route is `guide`, "An official tutorial runs Claude Code in a sandbox against a codebase in a second sandbox…". The first-party `blaxel/claude-code` image (and `blaxel/codex`) now makes this a **`preinstalled`** route, like Lizard's "Choose the claude or codex template when creating a sandbox." You still sign in with your own Anthropic account. Suggest: "Choose the `claude-code` or `codex` image when creating a sandbox; sign in with your own account."
- **`claude-code-team`** — route is `guide`, "A written tutorial … with command-line and code steps." The image gives a preinstalled CLI, and each sandbox logs in separately, so per-developer credentials are possible. Candidate for **`preinstalled`**; the catch is there is no team-specific guide and a volume-mounted `~/.claude` could be reused. Parent should decide.
- **`browser-agent`** — already `preinstalled` and names `playwright-chromium`, `chromium`, `cua-xfce`, `xfce-vnc`. This matches the docs; no change.
- **`hermes-agent`** — the route note says "Blaxel's agent hosting caps a run at 15 minutes, so it is not the place for an always-on assistant." The docs say the 15-minute cap applies to **Agents Hosting** and "does not apply to Sandboxes". Hermes in a sandbox is not capped; the tier (`manual`) is still right, but the reason is wrong and should be reworded (e.g. "no Hermes template; install it by hand in a sandbox").
- **`workflow-automation`** — route already correctly says n8n's Blaxel page is n8n *calling* a Blaxel agent, not hosting n8n. The n8n tutorial is still that direction. No change.
- **`scheduled-scraper`** — `guide`; sandbox schedules + batch jobs exist, but no scraper template. No change.
- **`mcp-server`** — `guide`; MCP Hosting is a real product but deployment is CLI/one command, so `guide` still fits.

---

## 8. Baseline errors vs provider changes

Everything in the verdict table above was already true on **2026-10-28**; the docs repo dates prove it:

| Claim | File | Last docs-repo edit |
|---|---|---|
| Prebuilt Chromium, Playwright, XFCE, CUA, Claude Code, Codex images | `Sandboxes/Templates.mdx` | 2026-10-13 |
| Tailscale image + SSH | `Tutorials/Tailscale.mdx` | 2026-08-12 |
| Pre-warmed pool recipe, 15 s auto-suspend | `Sandboxes/best-practices.mdx` | 2026-09-09 |
| Carbon default in us-pdx-1/us-was-1 | `Sandboxes/Non-root-user.mdx` | 2026-10-27 |
| Firewall opt-in, Carbon gap | `Sandboxes/Proxy-domains.mdx` | 2026-09-25 |
| Carbon missing Agent Drive/firewall/egress IPs | `Infrastructure/Gens.mdx` | 2026-09-24 |
| Rolling 30-day tier window | `Security/Quotas.mdx` | 2026-06-22 |
| `diskPercent` 10–95%, default 50, mk3.1 | `api-reference/controlplane.yml` | present 2026-10-27; reworded 3 Nov |
| `DELETE /network/tunnel` cuts all egress | `sandbox-api/docs/openapi.yml` | present 2026-10-27 |
| MIT `sandbox-api/` source | `blaxel-ai/sandbox` | MIT since repo creation, 2025 |

So this is **not** a "Blaxel shipped eight things last week" report. It is a recheck that found the listing under-described, plus a status-page move. The only genuinely post-baseline changes are docs housekeeping: `auth.md` (10 Nov), Python-venv install (6 Nov), Omnara tutorial update (3 Nov), process `timeout` semantics (3 Nov), CLI/API auto-updates (3 Nov), Baseten model provider (30 Oct). The 3 Nov API refresh also added a `kernelPreview` option (mk3.1 preview kernel, iptables included), documented preview-header caps (20 headers / 8 KiB) and image-cleanup `dryRun`/`keepLatest` flags. No price, plan or product launch.

Two of those post-baseline edits are worth a sentence in the notes:

- **Process `timeout` now kills the process.** The page changed from "Set `timeout` to bound how long the call waits" to "Set `timeout` to limit how long the command can run: if it's still running when the timeout expires, the process is killed and the call fails." Buyers using long builds should know.
- **Baseten appears as a model provider** in the Model APIs docs (30 Oct commit), consistent with the acquisition.

---

## 9. Verification, tools and limitations

**Succeeded:** Context `web_scrape` (pricing, fresh), curl (docs `.md`, `llms.txt`, changelog, status HTML + JSON, terms PDF, marketing HTML, YC), `uv run --with pypdf` (terms text), GitHub REST API (repo trees, commits, licenses), agent-browser (Probo compliance portal, 15 documents enumerated), `npm run check-rates` (read-only, no Blaxel diff).

**Failed / fallback:** none material. The Probo portal is client-rendered, so curl returned only a shell; agent-browser was used and is reported as such. YC's team-size value is client-rendered, but the meta description contains "Blaxel has 12 employees based in San Francisco." The docs repo has no per-page "last updated" field, so GitHub commit dates were used.

**Not verified (desk research):**

- No account, no sandbox, no resume timing, no snapshot, no desktop, no SSH over Tailscale, no tunnel disconnect. All provider claims.
- GPU and nested virtualisation remain unpublished; `Custom hardware options` is not evidence of either.
- Actual snapshot size per GB of RAM (the C total's unknown) is still not published.
- The 25-item incident cap could be a UI choice rather than a hard API cap; every parameter tried returned 25.
- The DPA absence is from the 15 listed documents; a gated document could exist without a listing.
- The `open-source` verdict reads "sandbox API" as the in-VM API because the repo's `sandbox-api/` directory is that Go service. If Blaxel means the whole platform, the claim is overstated.
- Whether promotional credits count as "Service Credits" under the terms is not stated; the 1-year expiry is therefore a caveat, not a confirmed promo expiry.
- Carbon's exact default scope (new workspaces vs new sandboxes, US only vs all regions) is stated two ways; the non-root page is more specific but not reconciled.

**Recommended integration (parent):**

1. Change the 8 capability verdicts; add shortfalls for the new `partly` rows. Update feature notes: `idle-timers` (split the two timers), `outbound-network` (deny-by-default contradiction, Carbon gap), `company` (98.45% / Aug–Nov), `built-in-agents` (prebuilt agent, browser and CUA images; Agent Runtime waitlist), `storage` (Agent Drive private preview in us-was-1; volumes cannot detach), `sizes-regions` (CPU formula conflict), `trials-free-tiers` (no card, 1-year service-credit expiry, Tier 0 quota catch), `billing-models` (rolling 30-day top-up).
2. Advance `providers/blaxel.json.checkedOn` and `pricing/blaxel.json.checkedOn` to **2026-11-12**; do **not** advance `capabilities.json.checkedOn` or `usecases.json.checkedOn` for a single-provider recheck (record 2026-11-12 coverage in `research/blaxel.md` instead).
3. Fix the C shape label (2 vCPU / 4 GiB) and the 630 → 640 standby hours in the provider cost block.
4. Refresh the company status fact to 98.45% / 98.42% for 14 Aug–12 Nov, and reword the incident fact as "latest 25, 4 Sep–11 Nov".
5. Consider `coding-agent` → `preinstalled`, `claude-code-team` → `preinstalled`, and the Hermes caveat rewrite.
6. Add a `changes.json` **correction** entry dated 2026-11-12 (not a provider launch date): prebuilt browser/desktop/agent images, SSH via Tailscale, MIT sandbox API, status uptime restated. No price-baseline update needed — `check-rates` is clean.

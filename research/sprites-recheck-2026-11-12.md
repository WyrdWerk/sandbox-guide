# Sprites (Fly.io) recheck — 2026-11-12

Repo `sandbox-guide`, baseline `origin/main` @ `4432d00`. Provider id `sprites`, profile last checked **2026-10-28**, rate card **2026-10-29**.
Desk research only: no account, no login, no Sprite created. Docs were read as Markdown twins; no claim here is a measured result.

## Bottom line for the parent

- **14 capability verdicts change**, one figure changes, **2 feature verdicts change** (`built-in-agents` no→partly, `ways-to-drive` partly→yes) and one feature figure changes (`trials-free-tiers` $30→$1/7 days).
- **No unit rate changed**: CPU $0.0385/CPU-hour, RAM $0.021875/GB-hour, hot storage $0.000683/GB-hour, cold $0.000027/GB-hour, 8 vCPU / 16 GB / 100 GB, 0.0625 CPU floor, unmetered egress. A/B/C totals are therefore unchanged **except** that the rate card now omits a published 20 GB/org/month free cold-storage allowance and the $1 (not $30) trial credit.
- The biggest product changes since 28 Oct: **preinstalled coding agents**, a **hosted MCP server**, **Python/Go/Elixir SDKs**, **Cursor/Claude/Gemini managed-agent backends**, **automatic checkpoints**, and an **eight-tier plan ladder**.
- Several repo quotes are now **stale**: the pricing page no longer says "No plans and no tiers, and nothing charged per Sprite." and the Sprites page no longer says "$30 trial credit". See "Stale quotes to replace".

## Method and tools (what actually worked)

| Route | Result |
|---|---|
| **Context MCP `web_scrape`** | Succeeded. Fetched `https://fly.io/pricing/` with `maxAgeMs: 0`, `responseMode: "full"`. Response `cache_metadata` was `{"status":"miss","age_ms":0}`, i.e. a fresh fetch, not a cache hit. Used to confirm the live pricing page still shows the four Sprites rates and now says "$1 free to start. No credit card needed." |
| **TinyFish MCP `search`** | Succeeded, repeatedly (plan ladder, dashboard creation, SSO, spend limits, audit log, custom domain, static egress IP, fork, cron). Used for discovery only; every claim below was then read on the first-party page. |
| **`curl`** | Succeeded for Fly's Markdown twins (`fly.io/sprites.md`, `fly.io/pricing.md`, `fly.io/sprites/release-notes.md`, `fly.io/sprites/checkpoint-restore.md`, `fly.io/auth.md`, `fly.io/about.md`, `fly.io/sprites/agent-ready.md`, `fly.io/sprites/ecosystem.md`, `fly.io/changelog/<slug>.md`), the docs corpus (`docs.fly.io/sprites/**/*.md`, 30 pages incl. 7 integration pages and 3 policy API pages), the OpenAPI spec (`api.sprites.dev/openapi.json`), the changelog RSS (`fly.io/changelog.xml`), legal pages, and the status-page JSON APIs (`status.flyio.net/api/v2/{summary,incidents,components}.json`). |
| Exa / Parallel / Tavily / Firecrawl | Not needed; not called. |
| Amp native `web_search` / `read_web_page` | Not used (no fallback needed). |

Freshness notes:
- `docs.fly.io/sprites/...` and `docs.sprites.dev/...` both return HTTP 200 with identical content; every fetched page carries the header "Fetch the complete documentation index at: https://docs.fly.io/llms.txt", and internal links point at `docs.fly.io`. **`docs.fly.io` is the canonical host**; keep existing docs.json URLs.
- `sprites.dev/` 301s to `https://fly.io/sprites/`; `sprites.dev/pricing` 301s to `https://fly.io/pricing/`; `sprites.dev/release-notes` 301s to `https://fly.io/sprites/release-notes/`; `sprites.dev/docs` 301s to `https://docs.fly.io/sprites`. There is **no** `sprites.dev/terms` (404) — Fly's legal pages are the terms.
- The docs index now has **77 Sprites URLs**, up from ~35 at the last check: new `keeping-sprites-running`, `sprite-maintenance`, 11 `integrations/*` pages, 10 `api/*` policy and service pages, plus `openapi.json` and `asyncapi.json`.

## The 16 features

Format: **verdict** (old → new if changed) · figure · evidence URL · verbatim quote · what changed.

1. **billing-models — partly (unchanged)** · `$0.0385/CPU-hour` · https://fly.io/pricing/ · "Cumulative CPU usage measured by cpu.stat" · **Changed: note + evidence.** Rates are unchanged, but the plan story is now: the rendered pricing page does not mention plans at all, its Markdown twin says "No plans to pick up front on Machines or Sprites", and the Sprites FAQ sells a seven-tier ladder. Add the $1/7-day trial, the 20 GB/org/month free cold storage and the under-$5 personal-org waiver. The existing scenario sentence ("so a waiting Sprite is cheap but not free") is still right.
2. **built-in-agents — no → partly** · `Claude, Codex, Gemini, Cursor` (was "None; plugins only") · https://docs.fly.io/sprites/working-with-sprites.md · "**AI/CLI Tools**: Claude CLI, Gemini CLI, OpenAI Codex, Cursor" · **Changed verdict.** The default image ships four coding-agent CLIs; the provider still runs no agent loop and exposes no prompt endpoint, so this is "installed, not managed" — the same shape as Vercel (`partly`, "Agents in image; no API"), not Boat/Sandboxer (`yes`, prompt API). Move Sprites out of the "Bring your own" split paragraph and into "Installed, not managed"; update the `splits` prose that currently says "Sprites offers plugins and SDK integrations rather than a hosted agent."
3. **company — partly (unchanged)** · `Fly.io, Inc.; 99.9% Enterprise` · https://fly.io/legal/sla-uptime/ · "will apply to the Services for Customers with an Enterprise plan during the applicable Subscription Term" · **Unchanged.** Entity, CEO, founder role, Series D, status component, platform-scope SOC 2, $99 compliance package, DPA and 30/90-day deletion all re-read and still present. New dated facts: Terms effective **29 April 2026**, Privacy effective **24 October 2026**, security questionnaire last updated **2026-10-26**. Headcount still not published. No new Sprites-named incident.
4. **custom-domains — not-published (unchanged)** · `Not published` · https://docs.fly.io/sprites/concepts/networking.md · "A Sprite URL is private by default." · **Unchanged.** Networking still documents only `https://<name>-<org-id>.sprites.app`; URL settings expose only `auth` (`sprite`/`public`) and `private_access` (`admins`/`organization`). No domain or certificate field anywhere in the CLI, REST API or OpenAPI schema. The April 2026 community report remains the only statement, and it is still a report of absence.
5. **idle-timers — yes (unchanged)** · `30 s warm pause` · https://docs.fly.io/sprites/concepts/lifecycle.md · "When the activity stops, a short idle window passes (about 30 seconds today) and the Sprite pauses." · **Unchanged verdict; note refresh.** Add: the Tasks API hold is capped at one hour per task and must be heartbeated ("the maximum lifetime per task", https://docs.fly.io/sprites/keeping-sprites-running.md), and since February a web request to a stopped Sprite waits up to 10 s for the start instead of failing. The warm→cold window is still unpublished.
6. **isolation — partly (unchanged)** · `microVM; no systemd` · https://docs.fly.io/sprites/concepts/services.md · "Sprites don't run systemd; the log files and the create/start streams are how you see service output." · **Unchanged verdict; note refresh.** Add the stronger first-party isolation quote "Sprites execute code in Firecracker VMs." (https://fly.io/sprites/checkpoint-restore/) and the current base OS, Ubuntu 26.04 LTS (changelog 2026-07-08). Docker is still only a community report, not a documented guarantee.
7. **keys-secrets — yes (unchanged)** · `No, gateway` · https://docs.fly.io/sprites/concepts/connectors.md · "Connectors solve this by storing the credential once, in your organization, and routing API calls through the Sprites gateway. Sprites never see the token." · **Unchanged verdict; note improves.** Two capability rows move: `hidden-secrets` partly→yes (the Custom API connector wraps any token-authenticated HTTP API, so it is no longer catalogue-only) and `scoped-keys` not-published→yes (restricted tokens by count, name prefix, label and expiry, plus `sprites:read`/`sprites:write` OAuth scopes). `secrets-store` stays not-published: there is still no provider-held env-var secret.
8. **lifecycle — yes (unchanged)** · `Warm pause; 100–500 ms` · https://docs.fly.io/sprites/concepts/lifecycle.md · "The VM is suspended with everything in memory frozen in place. Compute billing stops. The next request resumes it in 100–500ms" · **Unchanged.** Warm keeps processes, cold (1–2 s) drops them, open TCP connections die either way, disk survives both. New supporting detail: services restart on cold boot and crash, and the Tasks API can hold a Sprite active; neither changes the verdict.
9. **outbound-network — yes (unchanged)** · `Not metered` · https://docs.fly.io/sprites/concepts/networking.md · "By default, a Sprite's outbound is unrestricted: it can resolve and reach any domain." · **Unchanged verdict; note refresh.** The allowlist is DNS-based, applied from outside, read-only inside (`/.sprite/policy/network.json`), with `defaults` presets, exact/wildcard precedence, live reload, raw-IP and private-IP blocking. Egress is still unmetered, still no static IP. **New first-party contradiction:** the product page calls the same feature "Layer 3 network policies" (see Contradictions #4).
10. **reaching-it — partly (unchanged)** · `Org token` · https://docs.fly.io/sprites/concepts/networking.md · "A Sprite URL is private by default. It's reachable only by members of your org, through the browser or with an org token" · **Unchanged verdict; note refresh.** Every Sprite has an HTTPS URL (port 8080 by default, one HTTP service can claim another port), a local TCP proxy, and SSH only by installing `sshd` and tunnelling via `sprite proxy -W :22`. Add `private_access`: `admins` (the release note and API example call this the default) or `organization` (the CLI docs call org membership the default) — the pages disagree, so say "default is admin-only per the April release note, org members per the CLI reference."
11. **sizes-regions — partly (unchanged)** · `8 vCPU; no choice` · https://docs.fly.io/sprites/concepts/lifecycle.md · "The vCPU count and the storage ceiling are fixed; memory is handled automatically." · **Unchanged verdict; note improves.** Memory now starts at **2 GB** and autoscales to **16 GB** (release note 2026-03-25), and the Resources Policy API can set `limit_mb` and toggle autoscaling per Sprite — but CPU (8) and disk (100 GB) remain fixed, there is no region picker, no GPU, and no published CPU architecture. Still one shape.
12. **snapshots-forks — partly (unchanged)** · `Filesystem only` · https://docs.fly.io/sprites/concepts/checkpoints.md · "A checkpoint snapshots the writable filesystem overlay: everything you've added on top of the base image." · **Unchanged verdict; note refresh.** New: automatic checkpoints are on by default (after continuous work, on idle and on graceful shutdown; `auto-` IDs; pruned over time), the last five are mounted read-only at `/.sprite/checkpoints/`, and checkpoints are ~300 ms / copy-on-write. Still no memory snapshot and still no public fork or create-from-checkpoint: `sprite create` has no `--from` and the create API accepts only `name` + `url_settings`. A storage fork exists on Fly's internal admin page (see New items), not in the customer API.
13. **storage — yes (unchanged)** · `100 GB cap; bytes written` · https://docs.fly.io/sprites/concepts/lifecycle.md · "you pay for the bytes you actually write, not the full 100 GB" · **Unchanged verdict; note refresh.** Storage is tiered: NVMe working cache over durable object storage, 100 GB ceiling, no volumes or mounts. The January changelog now explains the two rates precisely: **cold bills for all data**, **hot bills only for the "working data set" cached on NVMe** while awake — so hot is additional, not an alternative, and the same bytes can carry both. **20 GB of cold storage per org per month is free** (March changelog), which the rate card does not model.
14. **teams-accounts — partly (unchanged)** · `Not published` · https://docs.fly.io/security/sso.md · "Fly.io supports Google and GitHub as Identity Providers, and you can use one or both." · **Unchanged verdict; note improves.** SSO is now documented first-party but only Google Workspace or GitHub (no SAML/OIDC). Roles are org admin vs member, and `private_access` makes the distinction visible. Restricted API tokens (count, prefix, label, expiry) now exist. Audit log is still explicitly absent, spend caps still unpublished, and billing alerts are explicitly unsupported — so `partly` stands.
15. **trials-free-tiers — partly (unchanged verdict)** · **`$30 one-off` → `$1, 7 days`** · https://docs.fly.io/about/free-trial.md · "New accounts get **$1 of free credit**, with no credit card required." · **Changed figure and note.** No card is needed; the credit is personal-org only, lasts 7 days or until spent, and the trial is capped at **3 Sprites at a time**; without a card Fly says it "may delete your trial resources" (the page lists Machines, Volumes and Sprites). After a card, a personal org's monthly bill under $5 is waived (team orgs are not), and every org gets 20 GB of free cold storage. Still not an ongoing compute free tier.
16. **ways-to-drive — partly → yes** · `Dashboard, CLI, 4 SDKs, MCP` · https://docs.fly.io/sprites/integrations/index.md · "Sprites can be used through the hosted MCP server, a client plugin, an SDK adapter, or a platform's sandbox backend." · **Changed verdict.** The old "No; CLI" figure is obsolete: there is a Sprites dashboard (Sprites page, Integrations tab, Connectors, tokens, usage, plan & billing), a CLI, a documented REST API, official JavaScript/TypeScript (`@fly/sprites`), Python (`sprites-py`), Go (`sprites-go`) and Elixir (`sprites`) SDKs, a hosted MCP server at `https://sprites.dev/mcp`, and plugins for ten agent clients. What is still missing is a browser terminal — that is one capability row (`web-terminal`, not-published), not a reason to keep the whole feature at `partly`.

## The 78 capabilities

Format: `id` — **verdict** — figure — source URL — "verbatim quote" — change flag.
`unchanged` means verdict and figure still hold; `note` means only the wording/shortfall should move; `CHANGED` means verdict and/or figure.

### isolation (1–5)

- `own-vm` — **yes** — microVM — https://fly.io/sprites/checkpoint-restore/ — "Sprites execute code in Firecracker VMs." — note (better quote; verdict same)
- `root` — **yes** — sudo — https://docs.fly.io/sprites/working-with-sprites.md — "sudo apt install -y openssh-server" — unchanged
- `docker-inside` — **partly** — Docker, with limits — https://community.fly.io/t/27956 — "will fail for any container whose PID 1 is non-root" — unchanged (still a community report; no first-party Docker doc)
- `nested-virt` — **not-published** — — https://docs.fly.io/sprites/index.md — "Sprites are persistent, hardware-isolated Linux environments for running arbitrary code." — unchanged (privileges policy has a device list, but no `/dev/kvm` statement)
- `custom-image` — **no** — fixed base image — https://docs.fly.io/sprites/sprite-maintenance.md — "New Sprites run on a fresh install of Ubuntu 26.04." — unchanged (create request accepts only `name` + `url_settings`)

### sizes-regions (6–11)

- `any-size` — **no** — one shape — https://docs.fly.io/sprites/concepts/lifecycle.md — "The vCPU count and the storage ceiling are fixed; memory is handled automatically." — note (memory can now be capped 2–16 GB via policy, but CPU is still fixed at 8)
- `big-machines` — **no** — 8 cores / 16 GB — https://fly.io/sprites/checkpoint-restore/ — "up to 8 CPUs and 16GB of RAM for any given run" — unchanged
- `live-resize` — **no** — one fixed shape — https://docs.fly.io/sprites/concepts/lifecycle.md — "The vCPU count and the storage ceiling are fixed" — unchanged
- `gpu` — **no** — no GPU — https://fly.io/learn/fly-vs-modal/ — "Sprites are not a GPU environment. Fly.io sells GPU Machines separately" — unchanged
- `choose-region` — **no** — placement automatic — https://community.fly.io/t/where-do-sprites-dev-sprites-live-as-in-which-fly-io-region-is-it/26775 — "it's not currently possible to specify a region when creating a sprite" — unchanged (third-party, Jan 2026)
- `eu-region` — **partly** — EU possible, not chosen — same thread — "sprites are created in a Fly.io region close to you" — unchanged (third-party)

### lifecycle (12–18)

- `pause-memory` — **yes** — 100–500 ms — https://docs.fly.io/sprites/concepts/lifecycle.md — "The VM is suspended with everything in memory frozen in place." — unchanged
- `warm-pool` — **no** — — https://docs.fly.io/sprites/concepts/lifecycle.md — "A Sprite is not a server that runs until you turn it off." — unchanged (the "warm pool" in the release notes is Fly's pool of *paused* Sprites resuming, not spare capacity handed to a new create)
- `fast-start` — **yes** — 100–500 ms — https://docs.fly.io/sprites/concepts/lifecycle.md — "The next request resumes it in 100–500ms" — unchanged (cold 1–2 s)
- `stay-on` — **partly** — 30 s idle; 1 h hold — https://docs.fly.io/sprites/keeping-sprites-running.md — "A single task expires after at most an hour, so anything that needs to run longer uses a heartbeat" — note (you can run for weeks by refreshing a task, but there is still no off switch for the idle pause; the current row's shortfall should say "hold it with a renewable one-hour task" rather than imply it cannot stay up)
- `choose-idle` — **no** — — https://docs.fly.io/sprites/concepts/lifecycle.md — "You don't choose between them and you can't see the transition." — unchanged
- `wake-on-request` — **yes** — — https://docs.fly.io/sprites/working-with-sprites.md — "When a request hits your Sprite's URL, it wakes automatically." — unchanged
- `schedules` — **no** — — https://docs.fly.io/sprites/concepts/lifecycle.md — "A Sprite is not a server that runs until you turn it off." — unchanged (a January forum answer still says a hibernating Sprite cannot wake itself; an external scheduler is the workaround)

### snapshots-forks (19–24)

- `snapshot-files` — **yes** — — https://docs.fly.io/sprites/concepts/checkpoints.md — "A checkpoint snapshots the writable filesystem overlay" — unchanged
- `snapshot-memory` — **no** — — https://docs.fly.io/sprites/concepts/checkpoints.md — "it does not capture anything that only lives in memory" — unchanged; **note the contradiction** (working-with-sprites lists "In-memory state" as saved)
- `fork-running` — **no** — — https://community.fly.io/t/feature-request-native-fork-sprite-from-checkpoint/28191 — "Today restore is in-place only (POST /v1/sprites/{sprite}/checkpoints/{id}/restore) and sprite create has no --from-checkpoint." — unchanged (Fly's internal admin page can fork storage at a timestamp; no customer API or CLI flag)
- `older-snapshot` — **yes** — v0, v1, v2… — https://docs.fly.io/sprites/concepts/checkpoints.md — "IDs are sequential (`v0`, `v1`, `v2`, and so on)." — unchanged
- `templates` — **no** — — same community thread — "Today restore is in-place only" — unchanged (the admin fork is the closest thing; not a published template)
- `backups` — **no → partly** — automatic checkpoints — https://fly.io/sprites/ — "A Sprite checkpoints itself after a stretch of continuous work, when it goes idle, and on graceful shutdown, keeping a tiered history rather than every snapshot forever." — **CHANGED**
  - shortfall: "Automatic checkpoints exist but older ones are pruned on an unpublished schedule, and there is no off-platform backup or export."
  - note: `sprite checkpoint list --include-auto` shows them; they are restorable like any checkpoint.

### storage (25–29)

- `files-survive-stop` — **yes** — 100 GB — https://docs.fly.io/sprites/concepts/lifecycle.md — "The split is simple: disk persists, memory does not." — unchanged
- `volumes` — **no** — — same — "The split is simple: disk persists, memory does not." — unchanged
- `shared-volume` — **no** — — same — "The split is simple: disk persists, memory does not." — unchanged
- `mount-buckets` — **no** — — same — "The split is simple: disk persists, memory does not." — unchanged (the "S3 Block Device" backend is internal storage, not a user-mountable bucket)
- `big-disk` — **yes** — 100 GB — https://docs.fly.io/sprites/concepts/lifecycle.md — "Every Sprite starts with 100 GB of storage." — unchanged

### reaching-it (30–35)

- `public-url` — **yes** — public or org-only — https://docs.fly.io/sprites/concepts/networking.md — "Public means no authentication: anyone with the URL reaches whatever the HTTP service serves." — unchanged
- `private-url` — **yes** — org or admins — https://docs.fly.io/sprites/concepts/networking.md — "A Sprite URL is private by default." — note (`private_access` = `admins` or `organization`; the default is disputed, see Contradictions #5)
- `ssh` — **partly** — install a server — https://docs.fly.io/sprites/working-with-sprites.md — "Sprites don't expose SSH directly—you'll need to install an SSH server on your" — unchanged
- `web-terminal` — **not-published** — — https://docs.fly.io/sprites/quickstart.md — "Open an interactive shell" — unchanged (that shell is the local CLI; no browser terminal is documented)
- `tunnel` — **yes** — sprite proxy — https://docs.fly.io/sprites/concepts/networking.md — "it maps a remote port onto your machine" — unchanged
- `raw-tcp` — **partly** — through your computer — same — "it maps a remote port onto your machine" — unchanged (proxy is "Any TCP", but there is no public non-HTTP address)

### custom-domains (36–37)

- `custom-domain` — **not-published** — — https://docs.fly.io/sprites/concepts/networking.md — "A Sprite URL is private by default." — unchanged (no domain field in CLI, REST or OpenAPI)
- `auto-https` — **not-published** — — same — "A Sprite URL is private by default." — unchanged (the provider-managed `sprites.app` URL is HTTPS automatically, but that is not your own domain)

### outbound-network (38–41)

- `egress-included` — **yes** — Not metered — https://fly.io/sprites/ — "No. Sprites bandwidth isn't metered today." — unchanged
- `egress-allowlist` — **yes** — Domain list — https://docs.fly.io/sprites/concepts/networking.md — "a DNS-based allowlist that decides which domains a Sprite is allowed to reach" — note (add `defaults` preset, wildcard precedence, live reload, private-IP block)
- `no-internet` — **partly** — Deny every domain — https://docs.fly.io/sprites/concepts/networking.md — "**Raw IP connections are blocked** unless the IP was resolved from an allowed domain." — note (still DNS-level; the guest keeps its network stack; `{ "rules": [] }` means *no* enforcement, so deny-all has to be written explicitly)
- `static-ip` — **not-published** — — same — "By default, a Sprite's outbound is unrestricted" — unchanged (Fly has static egress IPs for **apps**, not Sprites; do not borrow that price)

### keys-secrets (42–44)

- `secrets-store` — **not-published** — — https://docs.fly.io/sprites/concepts/connectors.md — "storing the credential once, in your organization" — unchanged (connectors hold credentials, but they are not injected as env vars; `sprite exec --env` is per-command)
- `hidden-secrets` — **partly → yes** — Custom API connector — https://docs.fly.io/sprites/concepts/connectors.md — "**Custom API** is the fallback for anything without a dedicated connector: give it a base URL, a token, and where the token goes, and it wraps any token-authenticated HTTP API." — **CHANGED**
  - note: the old shortfall ("only the services in its catalogue are covered") is gone; arbitrary header/query/path token APIs now go through the gateway. Non-HTTP protocols (a database connection, raw TCP) still cannot.
- `scoped-keys` — **not-published → yes** — count, prefix, label, expiry — https://fly.io/sprites/release-notes/ — "You can now create API tokens with restrictions like maximum sprite count, required name prefixes, and label-based access control. Tokens can also have expiration dates." — **CHANGED**
  - note: MCP OAuth scopes are `sprites:read` and `sprites:write` (https://fly.io/auth.md), and the consent screen sets a name prefix and creation cap. Plain tokens are org-scoped but can be restricted and expired.

### ways-to-drive (45–52)

- `dashboard-create` — **no → yes** — dashboard form — https://docs.fly.io/sprites/integrations/cursor-cloud-agents.md — "The dashboard creates the Sprite, installs the worker service, starts it" — **CHANGED**
  - note: the documented form is **Sprites → Integrations → Cursor Cloud Agents** (paste a Cursor API key, name the machine, tick Computer use, "Create Cursor machine"); it makes a real Sprite named `cursor-<name>`. A *blank* Sprite is still created from the CLI or API — say that in the note so the reader is not surprised.
- `cli` — **yes** — — https://docs.fly.io/sprites/cli/commands.md — "sprite create - Create a new sprite" — unchanged (now also `sprite config`, `sprite file`, `sprite sessions`, `sprite api`)
- `python-sdk` — **no → yes** — `sprites-py` — https://fly.io/sprites.md — "Python (`sprites-py`):" / "pip install sprites-py" — **CHANGED**
  - note: official, `github.com/superfly/sprites-py`, also used by the Hermes plugin (`sprites-py>=0.5.0,<0.6`).
- `ts-sdk` — **yes** — `@fly/sprites` — https://fly.io/sprites.md — "npm install @fly/sprites" — unchanged
- `rest-api` — **yes** — — https://fly.io/sprites.md — "Every Sprite is a resource under `https://api.sprites.dev/v1/sprites/`" — unchanged (OpenAPI 3.1 at `api.sprites.dev/openapi.json`, version 0.1.12)
- `mcp-server` — **no → yes** — hosted remote MCP — https://docs.fly.io/sprites/integrations/remote-mcp.md — "Sprites runs a hosted MCP server." — **CHANGED**
  - note: `https://sprites.dev/mcp`, OAuth, tools `list_sprites` / `create_sprite` / `destroy_sprite` plus exec, checkpoints, network policy, services. Fly also ships a beta umbrella server at `https://mcp.fly.io/` that manages "machines, volumes, apps, and sprites" (changelog 2026-10-23). Do not use the old "Run every MCP server in its own Sprite" quote as proof of absence.
- `pty` — **yes** — — https://docs.fly.io/sprites/cli/commands.md — "Opens an interactive shell with a TTY allocated." — unchanged (WebSocket exec/attach is documented in the API)
- `file-api` — **yes** — — https://docs.fly.io/sprites/cli/commands.md — "`--file <source:dest>` - Upload file before exec (repeatable)" — unchanged (plus `/v1/sprites/{name}/fs/*` read/write/list/copy/chmod/chown)

### built-in-agents (53–59)

- `agents-preinstalled` — **no → yes** — Claude, Codex, Gemini, Cursor — https://docs.fly.io/sprites/working-with-sprites.md — "**AI/CLI Tools**: Claude CLI, Gemini CLI, OpenAI Codex, Cursor" — **CHANGED**
  - note: in the base image; the connectors page also says the `sprite-api-gateway` skill is pre-installed "for Claude Code, Cursor, Codex, and Gemini". They still need the user's own login or API key.
- `prompt-api` — **no** — — https://docs.fly.io/sprites/integrations/claude-managed-agents.md — "let Anthropic run the agent loop and the model" (the subject is a link to Claude Managed Agents) — unchanged (Anthropic/Google/Cursor run the loop; Fly supplies the computer)
- `one-click-hermes` — **no** — — https://docs.fly.io/sprites/integrations/agent-plugins.md — "git clone https://github.com/NousResearch/hermes-plugin-sprites.git ~/.hermes/plugins/sprites" — unchanged (still a terminal plugin install; it is a **backend**, not hosting)
- `one-click-openclaw` — **no** — — https://fly.io/sprites/ — "Hermes, Pi, OpenClaw… whatever your flavour" — unchanged (OpenClaw is named on the marketing page but has no plugin, template or doc page)
- `browser` — **no → partly** — Chrome via Cursor — https://docs.fly.io/sprites/integrations/cursor-cloud-agents.md — "the dashboard installs an Xfce desktop, Google Chrome" (the sentence continues "and Cursor's [computer use](…) support on the Sprite") — **CHANGED**
  - shortfall: "Chrome is installed only when you tick Computer use on a Cursor Cloud Agents machine; the default image has no browser."
- `desktop` — **no → partly** — Xfce via Cursor — same URL — "the dashboard installs an Xfce desktop, Google Chrome, and Cursor's computer use support" — **CHANGED**
  - shortfall: "The Xfce desktop exists only inside the Cursor computer-use setup; there is no documented VNC address or general desktop for other agents."
- `hosts-other-agents` — **no → yes** — Cursor, Claude, Gemini — https://docs.fly.io/sprites/integrations/cursor-cloud-agents.md — "Turn a Sprite into a Cursor self-hosted machine" — **CHANGED**
  - note: also Claude Managed Agents self-hosted environment (https://docs.fly.io/sprites/integrations/claude-managed-agents.md) and Gemini Managed Agents Bring Your Own Sandbox (https://docs.fly.io/sprites/integrations/gemini-managed-agents.md). The old "Its ecosystem lists coding tools, not another platform's cloud agents" is now false.

### teams-accounts (60–65)

- `team-workspace` — **yes** — — https://docs.fly.io/sprites/cli/authentication.md — "Sprites uses your Fly.io account for authentication" — unchanged (Fly organisations; per-org sprites, tokens, billing)
- `roles` — **yes** — admin vs member — https://docs.fly.io/sprites/api/sprites/update-a-sprite.md — "Who may access a sprite-authenticated URL." (`admins` | `organization`) — unchanged verdict, better evidence; no read-only role is published, so the note should not promise one
- `sso` — **not-published → partly** — Google or GitHub — https://docs.fly.io/security/sso.md — "Fly.io supports Google and GitHub as Identity Providers, and you can use one or both." — **CHANGED**
  - shortfall: "SSO is Google Workspace or GitHub only; there is no SAML or generic identity-provider option."
- `spend-cap` — **not-published** — — https://docs.fly.io/about/cost-management.md — "Free allowances don't cap your bill." — unchanged (prepaid credit is the only published brake; no documented hard cap or auto-stop)
- `usage-alerts` — **not-published → no** — None — https://docs.fly.io/about/cost-management.md — "We don't support billing alerts (yet), so budget accordingly." — **CHANGED**
- `audit-log` — **no** — — https://fly.io/legal/security-questionnaire/ — "There is no customer-facing audit log of organization activity or staff access." — unchanged

### billing-models (66–70)

- `per-second` — **yes** — per second — https://fly.io/sprites/checkpoint-restore/ — "All compute resources are billed per second." — unchanged (storage is hourly, aggregated monthly — the pricing page still says "All resources are billed hourly", see Contradictions #6)
- `active-cpu` — **yes** — actual CPU — https://fly.io/pricing/ — "Cumulative CPU usage measured by cpu.stat" — unchanged (minimum 0.0625 CPU and 256 MB RAM while running still published on the checkpoint-restore page)
- `cheap-pause` — **yes** — compute stops — https://docs.fly.io/sprites/concepts/lifecycle.md — "Compute billing stops." — unchanged (disk still bills cold; 20 GB/org/month free)
- `no-monthly-fee` — **yes** — none on PAYG — https://fly.io/pricing.md — "No plans to pick up front on Machines or Sprites" (the sentence continues "; Managed Postgres is sized by cluster plan") — **note: replace the stale quote**; verdict stands because pay-as-you-go has no fee, but the page no longer says "nothing charged per Sprite"
- `flat-price` — **no** — actual use — https://fly.io/pricing/ — "$0.0385 / CPU-hour" — unchanged (the plan ladder is a flat *fee*, not a flat machine price; usage above the allowance still bills)

### trials-free-tiers (71–73)

- `free-tier` — **no → partly** — 20 GB cold; under-$5 waiver — https://docs.fly.io/about/free-waiver.md — "if your monthly bill comes to less than $5, we waive it" — **CHANGED**
  - shortfall: "There is no free compute tier: a personal org's bill is waived only while the whole bill stays under $5, and a $5 bill is charged in full; team orgs get no waiver. Every org does get 20 GB of cold storage free each month."
  - note: Fly's own FAQ says "No. There's no free tier or monthly free usage allowance." The `partly` rests on the recurring waiver plus the storage allowance, not on a free plan.
- `free-credit` — **yes** — **$1, 7 days** (was $30) — https://docs.fly.io/about/free-trial.md — "New accounts get **$1 of free credit**, with no credit card required." — **CHANGED figure**
  - note: personal org only; expires after 7 days or when spent; trial capped at **3 Sprites at a time**; Fly says it "may delete your trial resources" (the page lists Machines, Volumes and Sprites) if no card is added.
- `no-card` — **not-published → yes** — $1 trial, no card — https://docs.fly.io/about/free-trial.md — "with no credit card required" — **CHANGED**

### company (74–78)

- `status-page` — **yes** — — https://status.flyio.net/ — page payload `"display_uptime":false,"hidden":false,"name":"Sprites"` — unchanged (Sprites is a component; uptime display is off, so still no numeric figure. No Sprites-named incident in the recent list on 12 Nov; the open item is a **LAX region outage**, unrelated.)
- `sla` — **partly** — — https://fly.io/legal/sla-uptime/ — "will apply to the Services for Customers with an Enterprise plan during the applicable Subscription Term" — unchanged (99.9%; credits claimed within 30 days; not refunds; Sprites not named)
- `soc2` — **partly** — — https://fly.io/legal/security-questionnaire/ — "does not name individual products such as Sprites" — unchanged (Type 2, Aprio, 1 Aug 2025–31 Jul 2026, issued 3 Sep 2026; NDA + paid Compliance Package)
- `dpa` — **yes** — — https://fly.io/legal/security-questionnaire/ — "The DPA is available to every organization on every plan" — unchanged (self-service Trust Center; covers Sprites; pre-signed)
- `open-source` — **no** — — https://docs.fly.io/sprites/cli/authentication.md — "Sprites uses your Fly.io account for authentication" — unchanged (SDKs and docs repos are public; the service and runtime are not self-hostable)

## Rate-card inputs

### Unit rates: all unchanged

Re-read on the rendered page (Context fresh scrape, `maxAgeMs: 0`, cache miss) and on the Markdown twin (direct HTTPS). The four figures appear in both, in the same units.

| Input | Original unit | Value | Source quote |
|---|---|---|---|
| CPU | USD per CPU-hour | **0.0385** | "$0.0385 / CPU-hour" |
| Memory | USD per GB-hour | **0.021875** | "$0.021875 / GB-hour" |
| Hot storage | USD per GB-hour | **0.000683** | "$0.000683 / GB-hour" |
| Cold storage | USD per GB-hour | **0.000027** | "$0.000027 / GB-hour" |
| Hot storage, monthly | USD per GB-month | **0.50** (≈ 0.000683 × 730) | "$0.50" |
| Cold storage, monthly | USD per GB-month | **0.02** (≈ 0.000027 × 730) | "$0.02" |
| CPU floor | vCPU while running | **0.0625** | "Minimum 0.0625 CPU while running." |
| RAM floor | GB while running | **0.25** (256 MB) | "Minimum 256MB RAM while running." |
| Max vCPU | vCPU | **8** | "8 vCPUs" |
| Max RAM | GB | **16** | "up to 8 CPUs and 16GB of RAM for any given run" |
| Max disk | GB | **100** | "Every Sprite starts with 100 GB of storage." |
| Egress | USD per GiB | **0** (not metered) | "No. Sprites bandwidth isn't metered today." |
| Compute granularity | — | **per second** | "All compute resources are billed per second." |
| Storage granularity | — | **hourly, aggregated monthly** | "Storage is billed hourly but aggregated monthly." |
| Month convention | hours | **730** | "Per-month figures are the hourly rate over a 730-hour month." |

`disk.running` stays **0.00071** = 0.000683 hot + 0.000027 cold; `disk.stopped` stays **0.000027**. Neither arithmetic nor the rates moved.

### Rate-card inputs that did change

1. **Trial credit: $30 → $1, 7 days.** "New accounts get **$1 of free credit**, with no credit card required." It is personal-org only, lasts "7 days or until you use it up", and covers Machines, Sprites and Managed Postgres. The old "$30 per user and per org" wording is gone. The card's note "A one-time $30 trial credit is not subtracted" must become $1 (still not subtracted).
2. **Trial concurrency cap: 3 Sprites.** "**Sprites:** up to 3 at a time". New limit; relevant to the `limits` block and to any workload that assumes more.
3. **Trial deletion risk.** Without a card, "may delete your trial resources" (the page lists Machines, Volumes and Sprites). New buyer-facing fact; the old card said card requirement was unpublished.
4. **Under-$5 invoice waiver.** Personal org, Pay As You Go, card on file: a bill under $5 is waived; $5 or more is charged **in full** ("The first $5 isn't taken off"). Team orgs get no waiver. New; do not model as a credit.
5. **20 GB/org/month free cold storage.** "all current and future orgs have been/will be given 20GB of Sprites cold storage for free each month!" Every org, every month. New allowance; not in the card.
6. **Full plan ladder** (previously only Hero and Mythic were named). Original units, per month:

| Plan | Fee | Concurrent | Warm | CPU-hours | RAM GB-hours | Storage GB-months | Support |
|---|---:|---:|---:|---:|---:|---:|---|
| Adventurer (Level 20) | $20 | 20 | 20 | 450 | 1,800 | 50 | Community |
| Veteran (Level 50) | $50 | 50 | 50 | 800 | 3,200 | 100 | Community |
| Hero (Level 100) | $100 | 100 | 100 | 1,200 | 4,800 | 150 | Standard |
| Champion (Level 200) | $200 | 200 | 200 | 1,800 | 7,200 | 225 | Standard |
| Legend (Level 500) | $500 | 500 | 500 | 3,200 | 12,500 | 400 | Standard |
| Epic (Level 1000) | $1,000 | 1,000 | 1,000 | 4,800 | 18,750 | 600 | Premium |
| Mythic (Level 2000) | $2,000 | 2,000 | 2,000 | 7,200 | 28,000 | 900 | Premium |
| Guild | Custom | Custom | Custom | Custom | Custom | Custom | Custom |

   - Source: Fly changelog 2026-01-16, https://fly.io/changelog/new-sprites-plans/ (author Jacob Fenton, Fly), table headed "Plan | Price/month | Max Concurrent Active Sprites | Max Warm Sprites | CPU/hours | RAM/hours | Storage/GB-months | Support". Hero and Mythic are independently corroborated on the live product page ("Hero ($100/mo) includes 1,200 CPU-hours, 4,800 RAM GB-hours, and 150 GB of storage"; "Mythic's 28,000 included RAM GB-hours, but at $2,000/mo").
   - Billing: plans are billed **up front**; upgrades are immediate and pro-rated, downgrades apply at the end of the current month (https://fly.io/changelog/sprites-plan-upgrades-downgrades/, 2026-02-25).
   - Unpublished: which storage tier the "Storage GB-months" allowance covers (cold is the only tier every byte pays, so cold is the likely reading, but Fly does not say); whether seats are included in the fee; per-seat price, if any. A release note calls them "seat-based plans" but no seat count or seat price is published.
   - The executable card still lists only `Pay as you go`. Adding the ladder is a modelling choice, not a rate correction: `price()` picks the cheapest feasible plan, and Hero's 4,800 RAM GB-hours is below B's 8 GB × 730 h = 5,840 GB-hours, so B would become "Hero + 1,040 GB-hours overage" rather than PAYG. Decide deliberately and re-run the hand-worked cases.
7. **Creation-rate and concurrency limits** (from the FAQ, not previously in the card): 10 sprites/minute on PAYG; 60/minute on Adventurer rising to 240/minute on Mythic; Hero 100 concurrently running and 100 warm; cold unlimited; "max sprites per org exceeded" on provision. Per-org, not per-user.
8. **Memory range**: 2 GB start, autoscale to 16 GB (release note 2026-03-25). The card's `maxRam` 16 already matches; the *starting* figure and the autoscale behaviour are new. No rate change.
9. **Task hold**: one hour maximum per task, renewable by heartbeat. New published limit; no rate change.
10. **Cold web-request wait**: a request to a stopped Sprite now waits up to 10 s for the start instead of failing immediately (release note 2026-02-02). Behavioural, not a rate.
11. **Storage model clarified**: cold bills on **all** data, hot is **additional** and bills only the "working data set" cached on NVMe. This does not change the rates but does change how the hot line should be described, and it resolves the old same-bytes ambiguity in the direction the site already assumed (additive).
12. **S3 Block Device (sbd)**: newer storage backend in early access, opt-in per organisation at https://fly.io/early-access; checkpoints become block-level and use "very little additional space". No published price difference. New Sprites default to it; old ones upgrade in place.

### A/B/C: which inputs moved

The task says not to recompute totals; these are the input deltas.

- **A** (2 vCPU / 4 GiB / 10 GiB, deleted each run): no unit-rate change, no disk retained, trial credit never subtracted. **No input change.**
- **B** (4 vCPU / 8 GiB / 50 GiB, 730 h kept): no unit-rate change. Two inputs move:
  - the **20 GB free cold** allowance means 30 GB of the 50 GB cold is billable, not 50 — the cold component falls by 20 × 730 × 0.000027 = **$0.39/month**;
  - the **hot** rate now applies explicitly to the *working set*, whose size is unpublished. The current line charges hot on all 50 GB, which is now an **upper bound**, not a definition.
  - (The plan ladder is a third, optional input: at 8 GB × 730 h = 5,840 GB-hours, B exceeds Hero's 4,800, so a plan would carry overage; at lower average RAM Hero could be cheaper than PAYG.)
- **C** (2 vCPU / 4 GiB / 20 GiB, 90 running + 640 stopped): no unit-rate change. The **20 GB free cold** covers C's entire retained disk, so the cold component is **$0**, not $0.39. The hot component (90 h × 20 GB × 0.000683 = $1.23) is unaffected. This is the one case where the missing allowance is visible as a whole line item.
- **All three**: the trial credit is now $1, not $30 — still not subtracted (it is a signup credit, not a recurring allowance). The under-$5 waiver does not reach any of these totals.

### Model limitations to state, not hide

- `RateCard.disk.included` cannot express a **cold-only** allowance: setting `included: 20` would also remove 20 GB from the hot charge, and `includedRunningOnly` only narrows it to running, not to the cold component. `Plan.allowance.diskHours` is valued at `disk.running` (0.00071), so it over-credits a cold allowance by ~26×. The honest options are a one-line note ("cold storage includes 20 GB per org per month; totals here ignore it") or a new `disk.includedCold` field with a test.
- The under-$5 personal-org waiver is a **cliff**, not a credit: a $4.99 bill is $0 and a $5.00 bill is $5.00. It cannot be modelled as "$5 free".
- The **hot working-set size** is unpublished. Charging hot on all retained GB is conservative.
- Plan **storage tier** and **seats** are unpublished.
- Fly quotes **GB**, not GiB; the engine's existing Sprites convention treats them as numerically equal for illustration. Keep that caveat.
- The status page exposes no numeric uptime for Sprites (`display_uptime: false`), and the incidents JSON does not tag components, so per-Sprites incident counts still have to be read off the page, not computed.

## Contradictions between first-party pages

Each pair is quoted; the interpretation the model should use is stated.

1. **Plans exist / do not exist.**
   - https://fly.io/pricing.md — "No plans to pick up front on Machines or Sprites; Managed Postgres is sized by cluster plan."
   - https://fly.io/sprites.md — "**I'm on a plan. Why am I still seeing usage charges?** Plans bundle an allowance of CPU-hours, RAM GB-hours, and storage GB, not unlimited usage." and "Example: Hero ($100/mo) includes 1,200 CPU-hours, 4,800 RAM GB-hours, and 150 GB of storage".
   - https://fly.io/sprites.md also says "Plans with included hours, every tier and what each includes: https://fly.io/pricing.md", but `pricing.md` contains no tier table.
   - **Use:** PAYG is the priced default; the plan ladder is real but priced only in the changelog/FAQ. The rendered pricing page is *silent* on plans, so do not write "the pricing page says there are no plans" any more — write "the pricing page's Markdown twin says no plans are picked up front, while the Sprites FAQ sells eight tiers."

2. **Ubuntu 25.10 or 26.04.**
   - https://docs.fly.io/sprites/working-with-sprites.md — "Sprites run Ubuntu 25.10 with common tools preinstalled:"
   - https://docs.fly.io/sprites/sprite-maintenance.md — "New Sprites run on a fresh install of Ubuntu 26.04. Older Sprites created with Ubuntu 25.04 or 25.10 must upgrade"
   - https://fly.io/changelog/sprites-ubuntu-26-04/ (2026-07-08) — "newly created Sprites run Ubuntu 26.04 LTS" (link text; the raw Markdown wraps it in a link to the release notes)
   - **Use:** 26.04 LTS for new Sprites; the environment section of `working-with-sprites` is stale. Do not claim 25.10.

3. **What a checkpoint contains, and how long it takes.**
   - https://docs.fly.io/sprites/working-with-sprites.md — "**What gets saved:**" followed by the bullets "Running processes (they stop during checkpoint creation)" and "In-memory state"; and "Creation takes 10–30 seconds depending on data size".
   - https://docs.fly.io/sprites/concepts/checkpoints.md — "it does not capture anything that only lives in memory" and "It runs copy-on-write, so it's fast and doesn't interrupt the Sprite."
   - https://fly.io/sprites/checkpoint-restore/ — "Checkpoints are transactional metadata. They take about 300ms and your Sprite environment won't even notice."
   - **Use:** filesystem only, ~300 ms, no interruption (two specific pages plus the product page beat one generic bullet list). `snapshot-memory` stays `no`.

4. **Egress: DNS allowlist or layer 3.**
   - https://docs.fly.io/sprites/concepts/networking.md — "a **network policy**, a DNS-based allowlist that decides which domains a Sprite is allowed to reach" and "**Raw IP connections are blocked** unless the IP was resolved from an allowed domain."
   - https://fly.io/sprites/checkpoint-restore/ — "Layer 3 network policies restrict outbound connections." and "Since these are enforced at L3, apps can use the full range of TCP and UDP protocols available to them."
   - **Use:** the docs' DNS-based model for the capability wording (it is the procedural page, and it explains `REFUSED`, raw-IP and private-IP behaviour); mention the product page's L3 claim in the note rather than resolving it. `no-internet` stays `partly`.

5. **Who can open a private URL by default.**
   - https://docs.fly.io/sprites/concepts/networking.md — "A Sprite URL is private by default. It's reachable only by members of your org, through the browser or with an org token".
   - https://fly.io/sprites/release-notes/ (2026-04-21) — "You can now set `private_access` on a sprite's URL settings to allow all org members — not just admins — to access private sprite URLs. The default remains admin-only."
   - https://docs.fly.io/sprites/cli/commands.md — "Private URL access type" (the raw Markdown escapes the underscore in `org_users`) and "Require org membership (default)".
   - OpenAPI `UrlSettings.private_access` example — `"example": "admins"`.
   - **Use:** private by default; the default *audience* is admins per the release note and the API example, org members per the networking/CLI prose. Say both and prefer "admin-only unless opened to the org" for the buyer-facing sentence. The capability verdict is still `yes` either way.

6. **Billing granularity.**
   - https://fly.io/pricing/ — "Metered per hour of active use." and the Sprites storage subhead "Billed hourly, with nothing to pick up front".
   - https://fly.io/sprites/checkpoint-restore/ — "All compute resources are billed per second. Storage is billed hourly but aggregated monthly."
   - **Use:** per-second compute, hourly storage aggregated monthly. The per-second statement is the finer one; `per-second` stays `yes`. Note the conflict.

7. **Is memory autoscaling on by default.**
   - https://docs.fly.io/sprites/concepts/lifecycle.md — "the platform can autoscale it: when a workload comes under memory pressure, the runtime grows the Sprite's memory in response".
   - https://fly.io/sprites/release-notes/ (2026-03-25) — "Sprites now start with 2 GB of memory and can autoscale up to 16 GB based on demand".
   - OpenAPI `ResourcesPolicyMemory.autoscale` — "Enable dynamic memory autoscaling (default: false)".
   - **Use:** platform-managed autoscaling is the documented default behaviour; the policy schema's `false` describes the default value of a *user-set* policy field (setting a limit turns autoscale off unless you also set `autoscale: true`). Flag as an ambiguity, not a contradiction that changes `any-size`/`live-resize` (both stay `no`).

8. **Does memory persist between runs.**
   - https://docs.fly.io/sprites/index.md — "Sprites keep their filesystem and memory between runs."
   - https://docs.fly.io/sprites/concepts/lifecycle.md — "The split is simple: disk persists, memory does not." and cold wake "starts processes fresh".
   - **Use:** warm pause keeps memory, cold does not. The index sentence is shorthand; lifecycle is precise. (Already in the 28 Oct ledger; still true.)

9. **Cold start: under 1 s or 1–2 s.**
   - https://fly.io/sprites/checkpoint-restore/ — "even a "cold start" request will typically take less than 1s."
   - https://docs.fly.io/sprites/concepts/lifecycle.md — "The next wake takes 1–2s".
   - **Use:** 1–2 s (docs, twice); the product page's "typically less than 1s" is marketing and conflicts with its own docs. `fast-start` stays `yes` on 100–500 ms warm.

10. **Release notes vs changelog freshness (not a product contradiction, but a source-of-truth one).**
    - https://fly.io/sprites/release-notes/ — newest entry "April 30, 2026", described as "dated and newest first".
    - https://fly.io/changelog/ — Sprites entries on 2026-11-09, 2026-11-03, 2026-10-23, 2026-08-03, 2026-07-08, 2026-03-09, 2026-02-25, 2026-01-20, 2026-01-16.
    - **Use:** the changelog for product changes; the release notes only for API/SDK detail up to April. Do not conclude "nothing shipped since April" from the release-notes page.

11. **Who gets the under-$5 waiver.**
    - https://fly.io/pricing/ and https://fly.io/pricing.md — "Invoices under $5 are waived." (no qualifier; repeated on the signup line).
    - https://docs.fly.io/about/free-waiver.md — "The waiver applies to your personal organization, the one we create when you sign up." and "Other organizations you create or join don't get the waiver, so their bills are charged in full."
    - **Use:** the docs page is the precise one. A team org pays in full; the pricing page's unqualified line is the marketing shorthand. Do not tell a team buyer their sub-$5 months are free.

## New products the 16 features and 78 capabilities miss

Dates are the provider's own where a changelog entry exists; "undated" means the page is live but carries no date. None of these is a launch date invented from a docs edit.

1. **Connectors as a platform, not just a secret trick** (undated; API gateway shipped 2026-03-03). Nearly 40 providers, including GitHub (OAuth), OpenRouter (managed or BYO key), Slack, Pushover, ZeroGPU and **Custom API**. Per-sprite access by name prefix, label or allow-all; endpoint allow/block lists with block-wins precedence; a Gateway Playground; a usage strip that rolls into the Sprites bill; community-authored connectors in `github.com/superfly/sprites-connectors`. Quote: "These join the nearly 40 connectors that are already available for your sprites." Why it matters: the guide's `keys-secrets` feature reduces this to "secrets the agent cannot read", but the buyer-facing product is **integrations you do not have to code**. It also creates a second bill line (managed OpenRouter spend) that A/B/C does not include.
2. **Link Agent Payments** (2026-11-09). Stripe Link wallet connector; the agent asks for a one-time virtual card for a named merchant and amount, the human approves in the Link app, the card is capped and expires after 12 hours. US and Canada, $500 cap per request. Quote: "Now you can connect Link, Stripe's wallet, to your Sprites". Why it matters: an agent sandbox that can **buy things** is a different risk and billing category; no capability row covers payments or human-approved spend.
3. **6PN / private network membership** (2026-11-09). A WireGuard-scoped Fly token held in a connector lets a Sprite add itself as a peer on the organisation's private network, via a small userspace WireGuard service. Quote: "A WireGuard-scoped token in a Sprites connector lets a sprite add itself as a peer on your organization's private network." Why it matters: `reaching-it`/`outbound-network` only describe the public HTTPS URL, the local proxy and the DNS allowlist. Reaching a private Postgres or an internal API is a distinct buying question. **It is a community recipe, not a managed feature** — the author says "here's something that's worked for me" and "I haven't run any serious workloads on it yet". Do not present it as one-click.
4. **Fly Machines API connector** (2026-08-03). A Custom API connector with the Machines API base URL, so a Sprite can deploy Fly Machines without a Fly token inside it. Quote: "Connect Sprites to the Fly Machines API without putting a Fly token inside the Sprite." Why it matters: it closes the "agent builds an app, then where does it run?" loop inside one provider.
5. **Managed-agent backends**: Cursor Cloud Agents (undated), Claude Managed Agents (undated; the docs use Anthropic's `managed-agents-2026-04-01` beta header), Gemini Managed Agents (undated), QM by Y Combinator (undated). Quotes: "Turn a Sprite into a Cursor self-hosted machine"; "Run Claude Managed Agents tool calls in a per-session Sprite"; "Run Gemini Managed Agents shell and file tools in a Sprite". Why it matters: this is the `hosts-other-agents` row, and it is the strongest "the sandbox is the product, the agent is someone else's" story in the guide.
6. **Computer use** (Cursor integration, undated). Xfce + Google Chrome + a wrapper that detaches the browser, plus a `~/.cursor/rules` note; screenshots available to the agent. Quote: "the dashboard installs an Xfce desktop, Google Chrome, and Cursor's computer use support on the Sprite, so the agent can click, type, and take screenshots." Why it matters: `browser` and `desktop` were `no`; they are now `partly`, and the catch is that it is Cursor-only and opt-in.
7. **Privileges policy** (undated, API 0.1.12). Capability profile `minimal` / `standard` / `privileged`, a device-node allowlist, and `noNewPrivileges`. Quote: "Capability profile: `minimal`, `standard` or `privileged`. Empty means unrestricted". Why it matters: a buyer running untrusted code can restrict what root can do; no capability row captures it. It is also the natural place a GPU or `/dev/kvm` device would be granted, but no such grant is documented.
8. **Resources policy** (undated, API 0.1.12). Per-Sprite `limit_mb` memory cap plus `autoscale`. Quote: "Enable dynamic memory autoscaling (default: false)". Why it matters: `any-size` stays `no`, but memory is no longer wholly unmanageable — you can bound it, which bounds the RAM bill.
9. **Automatic checkpoints and in-guest restore tooling** (undated docs; automatic behaviour is the current default). `auto-` IDs, tiered history, last five mounted read-only at `/.sprite/checkpoints/`, `sprite-env checkpoints` inside the guest, `/.sprite/llm.txt` for the agent. Quote: "Agents and scripts running inside a Sprite can manage their own checkpoints". Why it matters: `backups` moves to `partly`, and "the agent can undo its own mistake without the host" is a real differentiator.
10. **Labels and label-scoped access** (CLI + Go SDK, 2026-04-21). `sprite create --label`, `sprite config update --label`, and tokens restricted by label. Quote: "You can now set, update, and clear labels on sprites using the Go SDK." Why it matters: fleet organisation and per-team tokens; `roles`/`scoped-keys` now have a mechanism.
11. **S3 Block Device (sbd) storage backend** (early access, undated). Presents an object-storage bucket as a block device and runs ext4 on it; checkpoints become block-level. Quote: "A newer storage backend, in early access." Why it matters: checkpoint speed/space and the storage-upgrade path; no price difference published.
12. **Tiered storage, explained** (2026-01-20). NVMe working cache over durable object storage; cold bills on all data, hot on the working set only. Quote: "Since all of a Sprite's data is kept in Tigris, you're always paying cold storage for all your Sprite's data." Why it matters: it resolves the old hot/cold overlap ambiguity and explains why "free when idle" is compute-only.
13. **MPP prepaid credit** (undated; on `fly.io/pricing.md` and `fly.io/agents.md`). An agent can buy Fly credit over HTTP 402 with Stripe Link: `POST https://fly.io/api/v1/mpp/credits`, amounts 5/10/25/50/100 USD. Quote: "Agents can load credit into an org with MPP, the Machine Payments Protocol". Why it matters: agent-native top-up is a billing model the guide does not describe.
14. **Agent feedback API** (2026-11-04). Agents can file feedback/bugs through an API instead of a human form. Quote: "Agents can now send us feedback". Minor, but a signal about the agent-as-customer posture.
15. **Startup program and custom plan** (undated). Up to $15,000 in credit for eligible early-stage companies; committed-spend/custom contracts. Quote: "Up to $15,000 in credit for eligible early-stage companies". Commercial, not a sandbox capability; mention only if the guide tracks startup credits.
16. **Smaller surfaces**: `sprite api` (raw API call from the CLI), `sprite sessions` (detachable TTY sessions), `sprite file edit/push/pull`, SSHFS mount recipe, `sprite proxy -W :22`, `--skip-console`, `sprite upgrade`, shell completions, exit codes, `SPRITE_*` environment variables, OpenAPI 3.1 + AsyncAPI specs, and Ubuntu 26.04 LTS.

## Stale quotes and text to replace

The quote check took 69 unique Sprites quotes from the repo, normalized whitespace and Markdown, and matched them against a 604 KB corpus of the live pages: **65 matched, 4 missed**. Three misses are real staleness; the fourth (the cold-storage row) is formatting.

| Where | Current text | Why it fails | Replacement |
|---|---|---|---|
| `capabilities.json` `free-tier` row | "Each user can grant one $30 trial credit, and each org can receive at most one." | No longer on `fly.io/sprites/`; the page now says $1 / 7 days | https://docs.fly.io/about/free-trial.md — "New accounts get **$1 of free credit**, with no credit card required." (strip the bold markers for the check) |
| `capabilities.json` `no-monthly-fee` row | "No plans and no tiers, and nothing charged per Sprite." | Sentence removed | https://fly.io/pricing/ — "Billed hourly, with nothing to pick up front" (HTML subhead), or https://fly.io/pricing.md — "No plans to pick up front on Machines or Sprites" (the sentence continues "; Managed Postgres is sized by cluster plan") |
| `providers/sprites.json` `caveats[0].evidence[0]` | same "No plans and no tiers…" | same | same as above |
| `providers/sprites.json` `caveats[2].evidence[1]` | "Cold Bills for as long as you keep it" | Now two table cells: `Cold` / `Bills for as long as you keep it`; not contiguous text | https://fly.io/pricing/ — "Cold storage bills until you delete the data." |

Text (not quote) that is now wrong:

- `providers/sprites.json` → `billing.minimum`: "$30 trial credit per user and per organisation" → **$1 per new Fly.io account (personal org), 7 days, no card; 3 Sprites at a time; trial Sprites may be deleted if no card is added.**
- `providers/sprites.json` → `billing.planFee`: "The pricing page says there are no plans" → **the rendered pricing page is silent on plans; its Markdown twin says none are picked up front; the Sprites FAQ sells eight tiers.**
- `providers/sprites.json` → `caveats[0].detail`: "Pricing says there are no plans and nothing charged per Sprite" → **"Pricing's Markdown twin says no plans are picked up front; the Sprites FAQ sells Adventurer through Mythic plus Guild."**
- `providers/sprites.json` → `caveats[0].evidence[0].url`: keep `https://fly.io/pricing/` but quote the current subhead; add `https://fly.io/changelog/new-sprites-plans/` as the second side.
- `providers/sprites.json` → `usability.signup`: "Card requirement, waitlist and trial duration are not published." → **"No card for the $1 trial, which lasts 7 days; a card lifts the 3-Sprite cap and unlocks the under-$5 monthly waiver. No waitlist."**
- `providers/sprites.json` → `usability.dashboard`: connector setup only → **"A Sprites dashboard manages connectors, tokens, usage, plan and billing, and creates Cursor computer-use machines; a blank Sprite still starts from the CLI."**
- `providers/sprites.json` → `fits.badly[2]`: "the URL is private to the organisation and needs an org token" → **"private by default, and admin-only unless the org opens it to members"** (see Contradictions #5).
- `pricing/sprites.json` → `notes[0]`: "$30 trial credit" → **$1, 7 days, personal org, 3-Sprite cap.**
- `pricing/sprites.json` → `notes[2]`: "Hero ($100) and Mythic ($2,000)" → **the full eight-tier ladder; the pricing page is silent, the FAQ sells it.**
- `pricing/sprites.json` → `summary`: still accurate, but "hot storage while awake" should say **hot storage for the working set**.
- `research/rates/sprites.json` → `plans[0].quote` and `notes`; `plans` array → the full ladder; `compute.floor` → keep; `increment.conflict` → keep; `storage.billedWhileStopped` → keep, add the 20 GB allowance; `other` → add the $5 waiver, the $1 trial and the 3-Sprite cap.
- `research/sprites.md` → append a dated "Recheck 2026-11-12" section; do not rewrite the 28 Oct ledger. Mark section 10's plan quotes superseded, section 3's checkpoint bullets superseded by #3, section 5's memory statement superseded by the 2→16 GB autoscale, section 7's "SDKs" list superseded (Python/Go/Elixir), and section 15's signup unknowns now answered.
- `research/capabilities-NOTES-1-machine-money.md` lines 40–41 (`Sprites — plans`), line 67 (`docker-inside`), line 69 (`choose-region`/`eu-region`): the plans quote is stale; Docker and region are still community-only and still correctly flagged.
- `research/capabilities-NOTES-2-state-staying-on.md` line 40 (`templates` = no): still no public template, but add "Fly's admin page can fork a Sprite's storage at a timestamp; `sprite create` has no `--from`."
- `research/capabilities-NOTES-3-access.md` line 34 (URL auth): add `private_access`; line 46 (plans quote) is stale.
- `research/capabilities-NOTES-4-running-company.md` line 65 (`python-sdk` = no for Sprites): now **yes** — `sprites-py`; supersede.

`docs.json` improvements (the existing URLs all still load; these are better targets):

- `trials-free-tiers`: `https://fly.io/sprites/` → `https://docs.fly.io/about/free-trial.md` (title "Fly.io free trial — $1, 7 days, 3 Sprites").
- `ways-to-drive`: `cli/commands.md` → `https://docs.fly.io/sprites/integrations/index.md` (title "Integrations — CLI, SDKs, plugins, hosted MCP").
- `built-in-agents`: `https://fly.io/sprites/` → `https://docs.fly.io/sprites/working-with-sprites.md` (title "Your environment — Claude CLI, Gemini CLI, Codex, Cursor").
- `sizes-regions`: keep the lifecycle URL; title could say "8 vCPU, 100 GB, 2–16 GB memory autoscale; no region selection".
- `keys-secrets`: keep connectors.
- `snapshots-forks`: keep checkpoints.
- `billing-models`/`pricing`: keep `fly.io/pricing/`; add `https://fly.io/changelog/new-sprites-plans/` only if the UI supports one URL per topic (it does not, so leave it).

## Use cases and situations

Ten use-case guides and eight situations were reviewed against the new material; only two routes move, and both because the base image now ships agents.

| Use case | Route | Change |
|---|---|---|
| `coding-agent` | `manual` → **`preinstalled`** | The "what" says "Install Claude Code yourself in a Sprite… No Claude Code guide." Now: "Claude Code, Codex, Gemini CLI and Cursor are in the base image; sign in with your own account." `noTerminal` stays `no`. This matches Boat, Boxd, Sandboxer, InstaBox, Lizard and Freestyle. |
| `claude-code-team` | `manual` → **`preinstalled`** | "Installing it in a Sprite is by hand" is no longer true of Claude Code. Keep `noTerminal: no`: one machine per developer and per-developer sign-in are still manual, and the docs' Claude *Managed Agents* page is a different product. |
| `browser-agent` | `manual` (unchanged) | Update the text: the only built-in browser path is the Cursor Cloud Agents "Computer use" tick (Xfce + Chrome), not a general Playwright image. Still manual. |
| `hermes-agent` | `backend` (unchanged) | Correct: the docs' Hermes section is a terminal-backend plugin, not hosting. |
| `mcp-server` | `manual` (unchanged) | Sprites' own MCP server is for controlling Sprites; hosting yours is still a service on a port. |
| `openclaw`, `workflow-automation`, `chat-bot`, `code-interpreter`, `scheduled-scraper` | unchanged | No new template, scheduler, chat transport or interpreter route. |
| `situations.gpu-work` | unchanged | Sprites still not a GPU environment; GPU Machines are a separate product. |

Use-case prose that needs a sentence, not a tier change: `coding-agent`'s standfirst says "Several providers ship Claude Code…" — Sprites now belongs in that list, so the count/claim may need rechecking. `claude-code-team`'s standfirst says "Six providers ship it preinstalled" — if Sprites is added, that becomes seven. **Recount before editing.**

## Suggested profile edits (for the parent)

- `checkedOn`: **2026-11-12**. `oneLiner` unchanged.
- `whatItIs`: add "New Sprites boot Ubuntu 26.04 with Claude Code, Codex, Gemini CLI and Cursor already installed; older ones upgrade in place."
- `isolation`: "Dedicated **Firecracker** microVM with hardware-level isolation" (the product page's own words), and Ubuntu 26.04 LTS.
- `sizes`: "One fixed shape: 8 vCPUs, 2 GB of memory that autoscales to 16 GB, and 100 GB of storage. No region selection, GPU or ARM option."
- `billing.stopped`: add "20 GB of cold storage per organisation is free each month."
- `billing.planFee`: rewrite as in Stale quotes.
- `billing.minimum`: rewrite as in Stale quotes.
- `cost.B.notes`: replace the "not unambiguous" sentence with "Cold bills on all 50 GB; hot bills only the working set, so charging hot on all 50 GB is an upper bound. The first 20 GB of cold storage is free, so the cold line is $0.40 lower than shown if the allowance is modelled."
- `cost.C.notes`: "The entire 20 GB cold disk falls inside the free 20 GB/org/month allowance, so only hot storage bills."
- `caveats[2]`: keep as a wording contradiction (FAQ "cold (not billed)" vs pricing "Cold storage bills until you delete the data."), but note the changelog resolves the intent: cold bills, compute does not.
- `caveats[3]`: add "Fly's internal admin page can fork a Sprite's storage at a timestamp (2026-04-02); the public CLI/API still has no `--from-checkpoint`."
- `caveats[4]`: still open; add "CPU architecture still unpublished; memory is 2–16 GB autoscaled, not a fixed SKU."
- `company.facts[3]`: unchanged (status/SLA). `company.facts[5]`: unchanged (SOC 2). No new funding.
- `strengths`: add "Coding agents already installed", "A hosted MCP server that can create and drive Sprites", "Connectors cover any token-authenticated HTTP API". Keep the existing five.

## What I could not verify

- **The dashboard itself.** No account was created (desk research), so "Create from the website" rests on the Cursor integration page's statement that "The dashboard creates the Sprite", plus the release notes' "sprite detail page" and "org dashboard". If the parent reads the capability as "a blank Sprite from a button", downgrade it to `partly` with "the documented dashboard form makes a Cursor machine; a blank Sprite is CLI/API". I would keep `yes` and put the qualification in the note.
- **A browser terminal.** No doc mentions one. `web-terminal` stays `not-published`, not `no`.
- **The default for `private_access`.** First-party pages disagree (Contradictions #5). No account, so not observed.
- **Region list, EU residency, CPU architecture.** Still no first-party statement; `eu-region` remains `partly` on a January community answer. Do not borrow Fly Machines' 18 regions.
- **Docker.** Still a single community report; no first-party page. `partly` stands.
- **Nested virtualisation.** No `/dev/kvm` statement. The privileges device list is a restriction mechanism, not evidence that KVM is available.
- **Custom domain.** Absence across networking, CLI, REST, OpenAPI and the release notes is strong, but it is still an absence. `not-published` stands.
- **Working-set size.** Unpublished; the hot line is an upper bound.
- **Plan storage tier and seats.** Unpublished.
- **Per-component incident history.** The status API's incidents carry no component field; "no new Sprites incident" is based on the visible recent list, not a filter.
- **Status page uptime.** `display_uptime: false` for Sprites; the "100% uptime" figures on the page belong to other components (Management Plane etc.). Do not attribute one to Sprites.

## Bottom line

Sprites is still the same meter — $0.0385/CPU-hour, $0.021875/GB-hour, $0.000683/GB-hour hot, $0.000027/GB-hour cold, 8 vCPU / 16 GB / 100 GB, 30-second idle pause — and none of the A/B/C unit inputs moved. What moved is the product around the meter: the default image now ships Claude Code, Codex, Gemini CLI and Cursor; there is a hosted MCP server and official Python/Go/Elixir SDKs; Cursor, Claude and Gemini can use a Sprite as their own agent's computer; checkpoints are automatic; connectors cover any token-authenticated HTTP API; and the plan ladder is published in full ($20 Adventurer to $2,000 Mythic) even though the pricing page still will not admit it exists. The two rate-card corrections the parent must make are the **trial credit ($30 → $1, 7 days, no card, 3 Sprites)** and the **20 GB/org/month free cold storage** (worth ≈$0.39–$0.40 a month on B and the whole $0.39 cold line on C). The two stale sentences to replace (in three places) are `$30 trial credit` and `No plans and no tiers, and nothing charged per Sprite.`

State: **file written, nothing committed, nothing pushed, no data files edited.** Verification: quote check of 69 unique Sprites quotes, 65 matched and the 4 listed above flagged; Context fresh scrape cache-miss at `maxAgeMs: 0`; `npm run check-rates` run read-only and reports `CHANGED sprites: https://fly.io/pricing/ now shows $1 $5`; `npm run build`/`npm test` not run because no repo data changed.


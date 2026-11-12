# Runtime (withruntime.com) recheck — 12 November 2026

Baseline: `origin/main` `4432d00`, provider `runtime`, site last checked **2026-10-28** (rate card 2026-10-30).
This is desk research only: no account, key, sandbox or billable resource was used.

**Headline.** The sandbox unit rates did not change. The entry terms did: on **10 November 2026** Runtime became **pay first** — a new account must add credit (from $10) before its first sandbox, and the old never-paid 100-hour allowance is gone for accounts opened after that date. That changes two feature rows (`trials-free-tiers`, `built-in-agents`) and four capability rows (`free-tier`, `no-card`, `prompt-api`, `ssh`). It also exposes a first-party contradiction: the same included-usage page and `llms.txt` still describe a never-paid account getting free usage once in its first 30 days. Separately, Runtime now has a substantial private-beta product surface — hosted **Agents**, **Apps**, **Functions**, **CI/CD**, **Containers**, standalone **Desktops** — that the public 20-product list, docs index and price page do not show.

## Tools, freshness and method

- **Context MCP (`web_scrape`, `maxAgeMs: 0`) succeeded** on `/pricing`, `/docs/pricing`, `/docs/included-usage`, `/status`, `/docs/changelog`, `/legal/terms`, `/docs/editors`, `/docs/sandbox-environment`, `/docs/trust`, `/docs/products`, `/docs/storage`, `/docs/networking`. Every response carried `cache_metadata: {"status":"miss","age_ms":0}`, so these were fresh retrievals, not cache hits.
- `/pricing` rendered **“Updated 2026-11-10”** and its JSON-LD `dateModified` is `2026-11-10`; the fresh scrape still shows $0.025 / $0.0075 and the pay-first FAQ. The fresh `/docs/changelog` begins at **10 November 2026** and has no 11 or 12 November entries.
- **curl succeeded** for the provider’s own Markdown/`llms.txt`: `/llms.txt`, `/llms-full.txt`, `/docs/*.md`, `/pricing.md`, `/about.md`, `/status.md`, `/status.json`, `/legal/raw/terms`, `/legal/raw/dpa`, `/legal/raw/subprocessors`, `/sitemap.xml`, and the public OpenAPI at `https://api.withruntime.com/v1/openapi.json`. Cache-busting query strings were used; Vercel’s edge still serves these with `x-vercel-cache: HIT` (age ~35–40 h at the last deploy), so the fresh Context scrapes above are the price/terms/status authority.
- **npm/unpkg succeeded** for the official `withruntime@0.50.0` package (published 2026-10-31) and its product type declarations; **GitHub API** for repository facts.
- TinyFish and Amp-native `web_search`/`read_web_page` were **not needed** and not used. No tool failed.
- Quote check: all 78 stored capability quotes were tested as normalized substrings of the freshly fetched Markdown. **76 matched**; `no-card`’s “with no card” is gone (the change), and `dashboard-create`’s stored quote has a stray space around Markdown emphasis (the sentence is still present). Changed rows below carry new quotes.

---

## 1. Feature rows (16)

“Changed” is about the row’s current truth, not just its verdict. Only two feature **verdicts** move.

| Feature | Verdict now | Verdict before | Current specifics | Evidence (URL + verbatim quote) | Changed |
|---|---|---|---|---|---|---|
| `billing-models` | partly | partly | Measured active CPU above a 50-millicore floor, plus reserved memory, plus storage while paused/stopped; no plan fee. **Pay first**: credit from $10 before the first sandbox, first $10 matched. Hosted Agents (beta) bill at different rates: $0.03/active vCPU-hour, $0.01/GiB-hour. | https://withruntime.com/docs/pricing — “You pay for the CPU your code uses, not the CPUs it holds: $0.025 per active vCPU-hour and $0.0075 per reserved GiB-hour of memory.” | NOTE: pay-first; Agents rates |
| `built-in-agents` | partly | no | Default image still has **no** coding agent. But Runtime’s hosted **Agents** product (private beta) runs Claude Code, Codex or Gemini CLI in a sandbox of its own per session, on your model key, with triggers, memory and budgets. | https://unpkg.com/withruntime@0.50.0/dist/products/agents.d.ts — “In a private beta: outside it every call is refused with `product_in_beta`.” | **VERDICT no→partly** |
| `company` | partly | partly | Runtime LLC, Denver; no named founder/executive; funding not published; public since 18 Sep 2026. API checks **100% over 7 days, 97.85% over 30** (12 Nov); **4 Nov passed only 61.38%**. 99% API promise, 10% credit, paid accounts. SOC 2/ISO certificates are its data centre’s, not Runtime’s. | https://withruntime.com/docs/pricing — “Paid accounts are promised 99% API uptime every calendar month.” | NOTE: status figures; 4 Nov |
| `custom-domains` | yes | yes | A sandbox web port at your hostname with HTTPS; DNS TXT proof; Let’s Encrypt; 50 domains/account, 20 added/day. | https://withruntime.com/docs/networking — “**Custom domain:** a sandbox's web port at your own hostname, with HTTPS.” | — |
| `idle-timers` | yes | yes | Default 300 s; `idlePauseSeconds` 60–86,400 or 0; `persistent: true` disables. New: a pending process timer wakes an idle sandbox (only timers due within 29 min, and pending the whole idle time); `wakeOnTimers: false` turns that off. | https://withruntime.com/docs/pricing — “A sandbox pauses itself after 300 seconds with nothing happening in it” | NOTE: timer wakes |
| `isolation` | yes | yes | Firecracker microVM with its own Linux kernel and disk; `/dev/kvm` on new sandboxes; AMD EPYC x86-64; no GPU, no ARM. | https://withruntime.com/llms.txt — “Runtime Cloud is a cloud for AI agents' code: Linux sandboxes, each a Firecracker microVM” | — |
| `keys-secrets` | yes | yes | Placeholder secrets for HTTPS headers; OIDC identity tokens; GitHub App tokens; secret versions. New: `exposed` secrets give the machine the real value for database passwords, SSH keys or service-account JSON, scoped by sandbox/App id. | https://withruntime.com/docs/security — “The machine sees a placeholder. The value is added only to HTTPS requests to the hosts you name.” | NOTE: exposed secrets |
| `lifecycle` | yes | yes | Pause keeps RAM/processes; stop keeps files and drops memory; both bill storage until delete. New: `evictable: true` lets Runtime delete a paused/stopped sandbox after 15 min when its server needs the disk; `unreachable` state; `switch-image`; `getOrCreate`. | https://withruntime.com/docs/sandbox-environment — “`wake`: it carries on where it was” | NOTE: evictable/unreachable/switch-image |
| `outbound-network` | yes | yes | `internet: false`; allow/deny lists (deny wins); $5/mo dedicated IPv4 **with IPv6**; $5/mo WireGuard; Tailscale; private names. Paid sandboxes reach every port and move 500 GiB/day; no-credit sandboxes reach 80/443 only and move 1 GiB/day. | https://withruntime.com/pricing — “Dedicated IPv4 | $5 | per 30-day month” | NOTE: IPv6, Tailscale, limits |
| `reaching-it` | yes | yes | Closed until opened: token-gated previews (16 per sandbox), custom domains, TCP ports (5/sandbox, 20/account), WireGuard or Tailscale, SSH over the API, browser **sandbox sessions**. Public previews need a kept top-up. | https://withruntime.com/docs/sandbox-environment — “Nothing on the internet can connect in to a sandbox. These are the ways in. You open each one yourself” | NOTE: sessions, 16 previews |
| `sizes-regions` | partly | partly | Any vCPU/memory/disk inside **16 vCPU / 64 GiB / 400 GiB** on a paid account; **2 / 4 / 10** without credit. One region, Virginia (`us-east`). Shared CPU default; `cpu: "reserved"` bills every vCPU as busy. | https://withruntime.com/docs/api — “At least 128; at most 65,536 (64 GiB) on a paid sandbox, 4,096 without credit” | NOTE: without-credit bounds |
| `snapshots-forks` | yes | yes | Snapshot defaults to memory + disk (files, memory, running processes); disk-only opt-in. Fork copies files/memory/processes and freezes the source while capturing. A sandbox with volumes cannot be snapshotted. | https://withruntime.com/docs/javascript — “Snapshots default to `mode: \"memory\"`. That mode keeps files, memory and running processes.” | — |
| `storage` | yes | yes | Up to 4 volumes per sandbox; `rw` one writer, `snapshot` read-only multi-attach; S3/R2/GCS bucket mounts; daily volume backups (default 7 days). First 3 images and first 10 GiB of volumes stored free. | https://withruntime.com/docs/storage — “A create attaches up to four volumes, each at a path such as `/data`” | NOTE: free images/volumes |
| `teams-accounts` | yes | yes | 4 roles, compartments, per-key daily spend limits, per-sandbox lifetime cap; SSO/SCIM and 400-day audit log free on every account. | https://withruntime.com/docs/pricing — “read-only keys, a daily spending limit per key, and compartments” | NOTE: plans-page contradiction |
| `trials-free-tiers` | partly | yes | **Pay first.** New account adds credit from $10 before its first sandbox; the first $10 is matched, so it starts with $20. After paying, 100 GiB-hours memory + 25 vCPU-hours active CPU return each calendar month, with hard size/concurrency caps. No card-free trial. | https://withruntime.com/pricing — “Once an account has paid, 100 free hours of a 1 GB machine is included every month, renewed on the 1st: 100 GiB-hours of memory and 25 vCPU-hours of active CPU.” | **VERDICT yes→partly** |
| `ways-to-drive` | yes | yes | REST, JS/TS, Python, Go, Ruby and Java SDKs; CLI; hosted MCP; SSH; desktop; webhooks; OpenTelemetry; browser session tokens. Hosted **Agents** beta adds a prompt/session API. | https://withruntime.com/docs/mcp — “The endpoint is `https://api.withruntime.com/mcp`, over MCP Streamable HTTP.” | NOTE: Go/Ruby/Java, sessions, Agents |

### Feature detail — what actually moved

**`trials-free-tiers` (yes → partly).** The old row said “Recurring free usage with no card: 100 hours of a 1 GB machine… Accounts that never pay get it once across 30 days.” The no-card part is gone. The current pricing FAQ is explicit:

> “No free usage before you pay. You add credit by card from $10, and credit a new account adds within 30 days of signing up is matched, up to $1,000 in total. Once an account has paid, 100 free hours of a 1 GB machine is included every month, renewed on the 1st: 100 GiB-hours of memory and 25 vCPU-hours of active CPU.”
> — https://withruntime.com/pricing

The changelog dates the change:

> “**New accounts add credit before their first sandbox.** A new account now runs sandboxes once it holds credit, from $10.”
> — https://withruntime.com/docs/changelog, 10 November 2026

Proposed row: verdict `partly`, figure **“100 h/mo after $10”**, scenario “Pay $10, get $10 matched, then 100 hours of a 1 GB machine a month; nothing runs before the first payment.” The shortfall is the $10 gate and the loss of the card-free trial.

**`built-in-agents` (no → partly).** The default image still has no agent; the old row’s claim is now incomplete because Runtime sells a hosted agent harness. The SDK type declaration is the clearest public source:

> “Agents: a coding or support agent's harness (Claude Code, Codex, Gemini CLI, or your own code on an agents SDK) in a sandbox of its own per session, on your own model key.”
> — https://unpkg.com/withruntime@0.50.0/dist/products/agents.d.ts

> “In a private beta: outside it every call is refused with `product_in_beta`.”
> — same

Proposed row: verdict `partly`, figure **“Agents beta”**, scenario “The default image has no coding agent; Runtime’s private-beta Agents product runs Claude Code, Codex or Gemini CLI in a sandbox per session.” The catch is the beta gate and the absence of a public guide or price-page entry.

**`company` (partly, numbers changed).** The status figures in the row and the shared split are stale. Fresh `status.md` at 10:04 UTC on 12 Nov:

> “| Last 7 days | 100% | 5010 |”
> “| Last 30 days | 97.85% | 21568 |”
> “| 2026-11-04 | 61.38% | 720 of 720 |”
> — https://withruntime.com/status.md

The 4 November day is ~9.3 hours of failed 2-minute checks (278 of 720 failed). The incident section still says:

> “No incidents recorded.”
> — https://withruntime.com/status.md

So the “no incidents” line is literally true but no longer tells a buyer the whole story; the caveat should carry the 61.38% day. The 99% promise, 10% credit and paid-account scope are unchanged.

**`billing-models` (partly, note changed).** The sandbox meter is unchanged, but the entry is now pay-first and the hosted Agents product has its own meter. Do not fold the Agents rate into the sandbox card; it is a separate product with a separate session.

**`idle-timers` (yes, note changed).** Timer wakes are a new, material behaviour. The default is on, so a sandbox with a `sleep 600` loop can wake itself and bill an ordinary wake; `wakeOnTimers: false` turns it off. The 300 s idle default and `persistent` switch are unchanged.

**`keys-secrets` (yes, note changed).** The placeholder/OIDC story is unchanged. `exposed: true` is an opt-in second kind of secret for values the machine must read (DB password, SSH key, service-account JSON); it is scoped by sandbox/App id and the value is still sealed at rest. Do not describe it as “the agent cannot read” — in exposed mode it can.

**`lifecycle` (yes, note changed).** `evictable: true` is a new cost/availability trade: Runtime may delete a sandbox after it has been paused or stopped for 15 minutes when the server needs the disk; a running sandbox is never evicted. `unreachable` is a new reported state (with `agent_not_answering`, `disk_stalled` or `host_quarantined`), and `switch-image` moves a sandbox to another image while keeping `/workspace`.

**`outbound-network` (yes, note changed).** The dedicated address now includes IPv6, Tailscale is a supported private path, and the paid/no-credit network limits are much more explicit (500 GiB/day vs 1 GiB/day; all ports vs 80/443). The $5 IPv4 and $5 WireGuard prices are unchanged.

**`reaching-it` (yes, note changed).** Add sandbox **sessions** (a short-lived token lets a browser reach one sandbox without a key) and the 16-preview-per-sandbox cap. Public previews need a **kept top-up**, not merely granted credit.

**`sizes-regions` (partly, note changed).** The paid bounds are unchanged; add the explicit without-credit bounds (2 vCPU / 4 GiB / 10 GiB disk) and the 190 s wake allowance for a 64 GiB sandbox.

**`storage` (yes, note changed).** The four-volume limit and backup model are unchanged. Add the permanent free storage (first 3 images, first 10 GiB of volumes) and the 7-day default backup retention (1–365 settable).

**`teams-accounts` (yes, note changed).** The row is still yes, but the **plans** page now says a plan “turns on features such as single sign-on, roles and the audit log” while pricing and security say those are free on every account. See Contradictions. The buyer-facing consequence is: treat SSO/SCIM/roles/audit as free; the plans page is stale or refers to a different packaging.

**`ways-to-drive` (yes, note changed).** Add Go, Ruby and Java SDKs (the baseline only named JS/Python), browser session tokens, and the hosted Agents API (private beta). The CLI/MCP/REST paths are unchanged.

---

## 2. Capability rows (78)

Every row is the current verdict, with the stored quote re-checked against the live page on 12 November 2026. `VERDICT` means the verdict moved; `NOTE` means the same verdict needs a new figure, catch or evidence; `—` means the row and its evidence stand. Long stored quotes are truncated at a word boundary with `…`; the full quote is in `capabilities.json` and matched live.


### isolation

| Capability | Verdict | Figure | Verbatim quote | Source | Changed |
|---|---|---|---|---|---|
| own-vm | yes | Firecracker microVM | "Every sandbox is a Firecracker microVM. It has its own Linux kernel and disk." | https://withruntime.com/docs/sandbox-environment | — |
| root | yes | sudo, then root | "sudo works without a password. You are root inside your own sandbox." | https://withruntime.com/docs/sandbox-environment | — |
| docker-inside | yes | enable-docker | "enable-docker installs Docker Engine, Buildx and Compose from Ubuntu's archive, and starts them." | https://withruntime.com/docs/sandbox-environment | — |
| nested-virt | yes | /dev/kvm | "expose /dev/kvm" | https://withruntime.com/docs/changelog | — |
| custom-image | yes | custom images | "You can build an image from any Dockerfile." | https://withruntime.com/docs/images | — |

### sizes-regions

| Capability | Verdict | Figure | Verbatim quote | Source | Changed |
|---|---|---|---|---|---|
| any-size | yes | any combination in bounds | "At most 16 on a paid sandbox, 2 without credit" | https://withruntime.com/docs/api | — |
| big-machines | yes | 16 cores / 64 GiB | "at most 65,536 (64 GiB) on a paid sandbox" | https://withruntime.com/docs/api | — |
| live-resize | partly | memory, while paused | "resize this one while it is paused" | https://withruntime.com/docs/sandbox-environment | — |
| gpu | no | no GPU | "No GPU sandboxes, so our model evaluations cannot move" | https://withruntime.com/docs/feedback-and-support | — |
| choose-region | no | one region | "Everything runs in one region, in Virginia, United States" | https://withruntime.com/docs/trust | — |
| eu-region | no | US only | "Everything runs in one region, in Virginia, United States" | https://withruntime.com/docs/trust | — |

### lifecycle

| Capability | Verdict | Figure | Verbatim quote | Source | Changed |
|---|---|---|---|---|---|
| pause-memory | yes | — | "A pause keeps its memory and processes." | https://withruntime.com/docs/sandbox-environment | — |
| warm-pool | partly | Spare paused boxes | "For many short tasks, such as fetching one page each, keep spare browsers paused." | https://withruntime.com/docs/javascript | NOTE reservations |
| fast-start | yes | ~0.1 s wake | "await spare.wake(); // about 0.1 s" | https://withruntime.com/docs/javascript | NOTE create median |

### snapshots-forks

| Capability | Verdict | Figure | Verbatim quote | Source | Changed |
|---|---|---|---|---|---|
| snapshot-files | yes | — | "Snapshots accept `mode: "memory"` (the default) or `mode: "disk"` in `POST /v1/sandboxes/{id}:snapshot`." | https://withruntime.com/docs/api | — |
| snapshot-memory | yes | — | "Snapshots default to `mode: "memory"`. That mode keeps files, memory and running processes." | https://withruntime.com/docs/javascript | — |
| fork-running | yes | — | "A fork is a copy of a sandbox as it is now. It has the same files, memory and running processes." | https://withruntime.com/docs/javascript | — |
| older-snapshot | yes | — | "Each sandbox created from it boots fresh, without the saved processes." | https://withruntime.com/docs/javascript | — |
| templates | yes | — | "**Custom images** from a package list, any public or private image, or a Dockerfile (multi-stage,…" | https://withruntime.com/llms.txt | — |
| backups | yes | Daily, or your cron | "A volume is backed up off its server every day, and whenever you ask." | https://withruntime.com/docs/storage | — |

### storage

| Capability | Verdict | Figure | Verbatim quote | Source | Changed |
|---|---|---|---|---|---|
| files-survive-stop | yes | — | "A stop keeps the disk." | https://withruntime.com/docs/sandbox-environment | — |
| volumes | yes | Up to 4 | "A create attaches up to four volumes, each at a path such as `/data`, in one of two modes" | https://withruntime.com/docs/storage | — |
| shared-volume | partly | — | "**`"rw"`** (the default): read-write, attached to one sandbox at a time." | https://withruntime.com/docs/storage | — |
| mount-buckets | yes | — | "You can mount your own buckets inside a sandbox, and the sandbox never holds their keys." | https://withruntime.com/docs/storage | — |
| big-disk | yes | 400 GiB | "It can be at most 400 GiB." | https://withruntime.com/docs/jobs | — |

### idle-timers

| Capability | Verdict | Figure | Verbatim quote | Source | Changed |
|---|---|---|---|---|---|
| stay-on | yes | — | "**Busy time is never cut off on a clock.**" | https://withruntime.com/docs/pricing | — |
| choose-idle | yes | 300 s, or never | "A sandbox pauses itself after **300 seconds** of idle time." | https://withruntime.com/docs/javascript | — |
| wake-on-request | yes | — | "A paused sandbox wakes by itself when a request needs it." | https://withruntime.com/docs/javascript | — |
| schedules | yes | Cron + once | "A job runs a command in a fresh sandbox. It runs once, at a time you choose, or on a cron schedule." | https://withruntime.com/docs/jobs | NOTE credit gate; agent schedules |

### reaching-it

| Capability | Verdict | Figure | Verbatim quote | Source | Changed |
|---|---|---|---|---|---|
| public-url | yes | Kept top-up | "Public previews need a kept top-up" | https://withruntime.com/docs/included-usage | NOTE wording |
| private-url | yes | Token by default | "It is private, with a token, by default." | https://withruntime.com/docs/sandbox-environment | — |
| ssh | yes | <id>.runtime | "It writes a `Host *.runtime` entry and includes it from `~/.ssh/config`, so every sandbox is the host `<id>.runtime`, or `<name>.runtime`, to anything that uses OpenSSH" | https://withruntime.com/docs/editors | VERDICT partly→yes |
| web-terminal | yes | Console | "Terminal is a shell in the browser" | https://withruntime.com/docs/products | — |
| tunnel | yes | Through the API | "All of it goes through Runtime's API, authenticated with your key, over one WebSocket per connection." | https://withruntime.com/docs/editors | — |
| raw-tcp | yes | 5/machine; 20/account | "TCP ports \| 5 a sandbox, 20 an account" | https://withruntime.com/docs/limits | NOTE caps |

### custom-domains

| Capability | Verdict | Figure | Verbatim quote | Source | Changed |
|---|---|---|---|---|---|
| custom-domain | yes | 50/account; 20/day | "Custom domains \| 50 an account, 20 added a day" | https://withruntime.com/docs/limits | NOTE caps |
| auto-https | yes | Let's Encrypt | "Custom domain: a sandbox's web port at your own hostname, with HTTPS." | https://withruntime.com/docs/networking | — |

### outbound-network

| Capability | Verdict | Figure | Verbatim quote | Source | Changed |
|---|---|---|---|---|---|
| egress-included | yes | 100 GiB a month | "each account's first 100 GiB out a month is free" | https://withruntime.com/pricing | — |
| egress-allowlist | yes | Allow list | "`internet: false` refuses every outbound connection. With an `allow` list, it is allow-list only." | https://withruntime.com/docs/sandbox-environment | — |
| no-internet | yes | internet: false | "`internet: false` refuses every outbound connection." | https://withruntime.com/docs/sandbox-environment | — |
| static-ip | yes | $5/mo; IPv6 incl. | "A dedicated IPv4 address or a WireGuard tunnel costs $5 per 30-day month each." | https://withruntime.com/pricing | NOTE IPv6 |

### keys-secrets

| Capability | Verdict | Figure | Verbatim quote | Source | Changed |
|---|---|---|---|---|---|
| secrets-store | yes | Placeholder or exposed | "Store an API key once. Your sandboxes use it without holding it." | https://withruntime.com/docs/security | NOTE exposed kind |
| hidden-secrets | yes | Placeholder default | "The machine sees a placeholder. The value is added only to HTTPS requests to the hosts you name." | https://withruntime.com/docs/security | NOTE exposed opt-in |
| scoped-keys | yes | Read-only + compartments | "read-only keys, a daily spending limit per key, and compartments" | https://withruntime.com/docs/pricing | NOTE reach |

### ways-to-drive

| Capability | Verdict | Figure | Verbatim quote | Source | Changed |
|---|---|---|---|---|---|
| dashboard-create | yes | Credit first | "Search or create, or ⌘K (Ctrl+K), opens one search box. It goes to any page or resource and starts anything." | https://withruntime.com/docs/products | NOTE credit gate |
| cli | yes | — | "The CLI runs every Runtime Cloud product from a terminal or a script." | https://withruntime.com/docs/cli | — |
| python-sdk | yes | Python; Go/Ruby/Java | "One API, one CLI, one MCP server and SDKs for JavaScript, Python, Go, Ruby and Java cover every Runtime product." | https://withruntime.com/docs/start | NOTE SDK set |
| ts-sdk | yes | JS/TS; Go/Ruby/Java | "One API, one CLI, one MCP server and SDKs for JavaScript, Python, Go, Ruby and Java cover every Runtime product." | https://withruntime.com/docs/start | NOTE SDK set |
| rest-api | yes | — | "The HTTP API is at `https://api.withruntime.com/v1`" | https://withruntime.com/about | — |
| mcp-server | yes | — | "The endpoint is `https://api.withruntime.com/mcp`, over MCP Streamable HTTP." | https://withruntime.com/docs/mcp | — |
| pty | yes | — | "runtime sandboxes spawn "${id}" --pty -- htop" | https://withruntime.com/docs/cli | — |
| file-api | yes | Files + watches + links | "await sbx.files.upload(project, "/workspace/project");" | https://withruntime.com/docs/javascript | NOTE watches/links |

### built-in-agents

| Capability | Verdict | Figure | Verbatim quote | Source | Changed |
|---|---|---|---|---|---|
| agents-preinstalled | no | None preinstalled | "Tools install the usual way and run by name: `npm install -g @anthropic-ai/claude-code`" | https://withruntime.com/llms.txt | NOTE evidence |
| prompt-api | partly | Agents beta | "In a private beta: outside it every call is refused with `product_in_beta`." | https://unpkg.com/withruntime@0.50.0/dist/products/agents.d.ts | VERDICT no→partly |
| one-click-hermes | no | — | "One API, one CLI, one MCP server and SDKs for JavaScript, Python, Go, Ruby and Java cover every…" | https://withruntime.com/docs/start | — |
| one-click-openclaw | no | — | "One API, one CLI, one MCP server and SDKs for JavaScript, Python, Go, Ruby and Java cover every…" | https://withruntime.com/docs/start | — |
| browser | yes | Chromium + CDP | "`sbx.browser.start()` runs Chromium in the sandbox. It returns `cdpUrl`, the address that Playwright, Puppeteer, browser-use and Stagehand connect to." | https://withruntime.com/docs/javascript | NOTE Browsers product |
| desktop | yes | Linux desktop | "A Linux desktop runs in the sandbox. You drive it as a person would." | https://withruntime.com/docs/javascript | NOTE Desktops beta |
| hosts-other-agents | yes | Frameworks + Agents | "Use Runtime with your AI framework" | https://withruntime.com/docs/frameworks | NOTE more frameworks |

### teams-accounts

| Capability | Verdict | Figure | Verbatim quote | Source | Changed |
|---|---|---|---|---|---|
| team-workspace | yes | — | "One Runtime account can have as many people as you need." | https://withruntime.com/docs/teams | — |
| roles | yes | 4 roles | "Each is an owner, admin, developer or billing member." | https://withruntime.com/docs/products | — |
| sso | yes | SAML/OIDC free | "Single sign-on over SAML or OIDC" | https://withruntime.com/pricing | NOTE plans contradiction |
| spend-cap | yes | Key + lifetime | "read-only keys, a daily spending limit per key, and compartments" | https://withruntime.com/docs/pricing | NOTE lifetime cap |
| usage-alerts | partly | Fixed credit warnings | "credit or free usage about to run out" | https://withruntime.com/docs/products | NOTE fixed thresholds |
| audit-log | yes | 400 days | "Every change to members, keys, money and security settings is recorded in an audit log" | https://withruntime.com/docs/teams | NOTE 400-day purge |

### billing-models

| Capability | Verdict | Figure | Verbatim quote | Source | Changed |
|---|---|---|---|---|---|
| per-second | yes | per second | "Sandboxes you run bill as usual, per second." | https://withruntime.com/docs/reservations | — |
| active-cpu | yes | measured, 50 mcore floor | "the same sandbox costs $0.03125 an hour, for memory plus the default CPU floor of 50 millicores" | https://withruntime.com/docs/pricing | — |
| cheap-pause | yes | storage only | "A paused sandbox keeps its files and memory for $0.08 per decimal GB per 30-day month." | https://withruntime.com/docs/pricing | — |
| no-monthly-fee | yes | None | "There is no plan fee." | https://withruntime.com/docs/pricing | NOTE plans beta |
| flat-price | no | measured parts | "the same sandbox costs $0.03125 an hour, for memory plus the default CPU floor of 50 millicores" | https://withruntime.com/docs/pricing | — |

### trials-free-tiers

| Capability | Verdict | Figure | Verbatim quote | Source | Changed |
|---|---|---|---|---|---|
| free-tier | partly | 100 h/mo after $10 | "Once an account has paid, 100 free hours of a 1 GB machine is included every month, renewed on the 1st: 100 GiB-hours of memory and 25 vCPU-hours of active CPU." | https://withruntime.com/pricing | VERDICT yes→partly |
| free-credit | partly | Matched credit | "Credit your organization adds within 30 days of signing up is matched with credit, up to $1,000 in total." | https://withruntime.com/docs/pricing | NOTE no match on wallet |
| no-card | partly | Credit first; USDC | "No free usage before you pay. You add credit by card from $10" | https://withruntime.com/pricing | VERDICT yes→partly |

### company

| Capability | Verdict | Figure | Verbatim quote | Source | Changed |
|---|---|---|---|---|---|
| status-page | yes | API + sandbox checks | "The status page publishes the API's uptime, checked from outside every two minutes" | https://withruntime.com/docs/trust | NOTE p95/history |
| sla | yes | 99% API | "Paid accounts are promised 99% API uptime every calendar month." | https://withruntime.com/docs/pricing | — |
| soc2 | partly | — | "SOC 1, SOC 2 and SOC 3 Type 2; ISO 27001" | https://withruntime.com/docs/trust | — |
| dpa | yes | — | "A data processing addendum that is part of the terms for every account" | https://withruntime.com/docs/pricing | — |
| open-source | no | Hosted only; SDK Apache-2.0 | "Runtime runs every sandbox in its own Firecracker virtual machine on dedicated servers" | https://withruntime.com/docs/trust | NOTE SDK licence |

---

## 3. Capability verdict changes (4)

### `ssh`: partly → yes

The old row said “Through the CLI” and its shortfall was “The connection goes through the provider’s own command rather than a plain SSH address.” The current editors page documents a standard OpenSSH host and the usual clients:

> “It writes a `Host *.runtime` entry and includes it from `~/.ssh/config`, so every sandbox is the host `<id>.runtime`, or `<name>.runtime`, to anything that uses OpenSSH:”
> — https://withruntime.com/docs/editors

> “**ssh, scp and rsync:** `ssh web.runtime`, `scp app.tar web.runtime:`.”
> — same

The setup is still `runtime sandboxes ssh config --install`, and the transport is Runtime’s API over a WebSocket rather than a public TCP port. But the capability asks for a standard SSH client, and `ssh web.runtime`, VS Code Remote-SSH and JetBrains Gateway all use one. Proposed: verdict `yes`, figure **`<id>.runtime`**, no shortfall; note the one-time config install and the API transport. This also resolves the uncertainty recorded in `research/capabilities-NOTES-3-access.md` (“not confirmed that a plain `ssh` client works”).

### `prompt-api`: no → partly

The old row said Runtime has no agent-run API. It now has a hosted **Agents** product, documented in the official SDK types (private beta):

> “Agents: a coding or support agent's harness (Claude Code, Codex, Gemini CLI, or your own code on an agents SDK) in a sandbox of its own per session, on your own model key.”
> — https://unpkg.com/withruntime@0.50.0/dist/products/agents.d.ts

> “In a private beta: outside it every call is refused with `product_in_beta`.”
> — same

The call is `runtime.agents.start("support", { input: "Hi!", key: "customer:42" })`; events stream `input`, `answer`, `reply`, `ask`, `status`, `result`, `error`, `note`, `child`, `turn`, `tool` and `tool_call`. An agent definition carries `instructions`, a harness `command`, model, secrets/pool, MCP servers, volumes, network rules, idle/max session seconds, concurrency, per-session and per-day dollar budgets, memory scope, an advisor model, tool permissions, and subagent limits. Triggers are `slack`, `github`, `schedule` and `webhook`. There are templates for Claude Code, Codex, Gemini CLI, the Claude Agent SDK, the OpenAI Agents SDK, a review agent, a judge and a browser agent.

Proposed: verdict `partly`, figure **“Agents beta”**, shortfall “Hosted Agents are a private beta: outside it every call is refused with `product_in_beta`, and there is no public guide or price-page entry.” Do not change `agents-preinstalled` to yes: the default sandbox image still has no coding agent.

### `free-tier`: yes → partly

The old row said “100 hours a month” and its note said “An account that never pays gets the free hours once, across its first 30 days.” The allowance is still 100 GiB-hours of memory + 25 vCPU-hours of active CPU + 10 GB saved copies + 5 GB volumes, renewed on the 1st UTC, no rollover. What changed is the gate:

> “No free usage before you pay. You add credit by card from $10, and credit a new account adds within 30 days of signing up is matched, up to $1,000 in total. Once an account has paid, 100 free hours of a 1 GB machine is included every month, renewed on the 1st: 100 GiB-hours of memory and 25 vCPU-hours of active CPU.”
> — https://withruntime.com/pricing

> “Runtime is pay first. A new account adds credit before it runs a sandbox, any amount from $10… Once an account has paid (bought credit), it gets 100 free hours of a 1 GB machine **every calendar month**.”
> — https://withruntime.com/docs/included-usage

Proposed: verdict `partly`, figure **“100 h/mo after $10”**, shortfall “The 100 free hours return every month, but only after you have bought at least $10 of credit; a new account gets nothing before it pays.” Note: “Accounts opened before 10 November 2026 keep any free hours they had left. New accounts start with none.”

### `no-card`: yes → partly

The old row quoted “with no card” from the old pricing page. That sentence is gone. The current FAQ says:

> “No free usage before you pay. You add credit by card from $10…”
> — https://withruntime.com/pricing

A card-free path still exists, but it is a **paid** path, not a trial:

> “An agent working with no person can open its own account this way. There is no sign-in, no browser and no card, and no free trial.”
> — https://withruntime.com/docs/pricing#pay-with-stablecoins

The account pays in USDC on Base, Solana or Tempo; the key arrives when the payment lands; a person can take it over later. Until takeover it earns no welcome match and no referral reward.

Proposed: verdict `partly`, figure **“Credit first; USDC”**, shortfall “A new account must add credit, from $10, before its first sandbox; the only card-free route pays in USDC, and it has no free trial or welcome match until a person takes the account over.” A case can be made for `no` if the capability is read as “try it without a card”; `partly` is the more literal reading because a card-free purchase exists.

---

## 4. Capability rows that keep their verdict but need a new figure, catch or evidence

These are the `NOTE` rows in the table; the rest are genuinely unchanged.

- **`agents-preinstalled` (no).** The old quote “No bridge harness (Claude Code, Codex) has run on Runtime yet” is from the Vercel AI SDK page’s “What was verified” section, not a product statement. It is still true of that test, but a weak basis for the row. Better evidence is the install instruction in `llms.txt`: “Tools install the usual way and run by name: `npm install -g @anthropic-ai/claude-code` (with or without `sudo`)”. The default image also now ships `bwrap` “from its next build” for Codex’s own sandboxing, but not Codex. Verdict stays `no`; note that the separate Agents beta does install a harness per session.
- **`fast-start` (yes).** The 0.1 s figure is a **wake** (`await spare.wake(); // about 0.1 s`), not a new create. The status page’s measured create-to-running median was **1.7 s over 24 h, 609 ms over 7 days and 325 ms over 30 days** on 12 Nov. Keep `yes` on the wake evidence, but say which start is under a second. The 24 h figure is worse than “under a second”.
- **`warm-pool` (partly).** Still no pool to size or refill. Reservations hold **room**, not pre-started machines; Agents sessions start from a CI/CD warm **snapshot**, but still create. You keep spare paused boxes yourself.
- **`public-url` (yes).** Figure should say **“Kept top-up”**, not “Paid top-up”. “A top-up counts once it is paid… only while it is not refunded or charged back in full”; credit Runtime gave does not count. With pay-first, the first card payment is a kept top-up, so this is available immediately after paying.
- **`raw-tcp` (yes).** Exact caps: **5 per sandbox, 20 per account** (`docs/limits`). The old figure “5 per machine” was incomplete.
- **`custom-domain` (yes).** Exact caps: **50 per account, 20 added a day**. The old figure “Your hostname” was not wrong, just incomplete.
- **`static-ip` (yes).** “A dedicated IPv4 address or a WireGuard tunnel costs $5 per 30-day month each.” The dedicated address now includes **IPv6**; one IPv4 per account; prorated to funded time.
- **`secrets-store` (yes).** Two kinds now: placeholder (the default) and `exposed` real value. The machine can read an exposed value; it is still sealed at rest and scoped by sandbox/App id. Secrets have versions and `expectedVersion` writes.
- **`hidden-secrets` (yes).** True for the default placeholder kind, and for the seven credential headers. **False for an `exposed` secret**: code in the machine gets the value itself. The note must say the default is placeholder and exposed is opt-in.
- **`scoped-keys` (yes).** Read-only keys, selected-actions keys, compartments, `reach: agent|account`, and a daily dollar limit per key. A key can never exceed its maker.
- **`dashboard-create` (yes).** The console path now says “Start a sandbox on Home **once you have added credit**”. The `Search or create` quote had a stray space around the Markdown emphasis; use “**Search or create**, or ⌘K (Ctrl+K), opens one search box.”
- **`python-sdk` / `ts-sdk` (yes).** Add Go, Ruby and Java to the figure/note: “SDKs for JavaScript, Python, Go, Ruby and Java”.
- **`file-api` (yes).** Add file watches (create/write/remove/rename/chmod/access; 16 at once) and upload links (`POST /v1/sandboxes/{id}/files:link`, 5 GiB).
- **`browser` (yes).** Still true via `sbx.browser.start()`, and now also a standalone **Browsers** resource at `/v1/browsers` (1 vCPU / 2 GiB default, headless, CDP, idle pause). The console has a Browsers list.
- **`desktop` (yes).** Still true via `sbx.desktop.start()`, and now also a standalone **Desktops** private beta at `/v1/desktops` (its own sandbox, billed at sandbox rates, private live view, computer use, MP4 recordings).
- **`hosts-other-agents` (yes).** The frameworks page now covers the OpenAI Agents SDK, Vercel AI SDK, Claude Agent SDK, LangChain, Deep Agents, Mastra, CrewAI, Google ADK, LlamaIndex, Pydantic AI and “any other framework”; the Agents product has templates for Claude Code, Codex, Gemini CLI, Claude Agent SDK, OpenAI Agents SDK, review, judge and browser.
- **`schedules` (yes).** Jobs are still cron/once with timezone, output and exit code. They **do not run without credit** (`blockedReason: credits`). Agents add `schedule` triggers.
- **`sso` (yes).** Still free on every account. The plans page contradicts this; see Contradictions. Do not downgrade on the stale plans copy.
- **`spend-cap` (yes).** Per-key daily limit; per-sandbox `maxTotalCostMicros` lifetime cap (`stopReason: lifetime_cap`); plans can raise limits. Note the cap is lifetime, not monthly.
- **`usage-alerts` (partly).** The console’s “Needs you” warns when credit or free usage is about to run out (credit five days ahead at this month’s pace), and `credit.low` / `credit.empty` webhooks fire at the same moments. There is still **no user-set threshold**.
- **`audit-log` (yes).** Kept at least 400 days; since 20 October, entries older than 400 days are removed. So “400 days” is a floor and a ceiling in practice.
- **`no-monthly-fee` (yes).** No plan fee, seat price or commitment. Plans are a private beta: “A plan is a monthly fee that comes back as usage”, so the fee is usage, not a surcharge.
- **`free-credit` (partly).** The match is unchanged: credit added in the first 30 days is doubled, up to $1,000. A wallet account earns **no** match until a person takes it over; a referral match replaces the welcome match, never both. First $10 becomes $20.
- **`status-page` (yes).** Now publishes API uptime for 24 h / 7 d / 30 d / since 23 Sep, a daily table, median and p95 sandbox starts, speed history and a rivals list. The incident list is separate and can say “No incidents recorded” while a day shows 61.38%.
- **`open-source` (no).** The platform is hosted only; no self-hosted edition. But the SDK/CLI/MCP package is **Apache-2.0** (`withruntime@0.50.0`, `github.com/withruntime/runtime`), so “open-source” is true of the client and false of the service. Say which.

---

## 5. Rate-card inputs

### 5.1 Sandbox card — original units, unchanged

| Input | Current value (original unit) | Source | Changed? |
|---|---|---|---|
| Active CPU | **$0.025 per active vCPU-hour**, measured | https://withruntime.com/docs/pricing | No |
| CPU floor | **50 millicores (0.05 vCPU) per sandbox**, `cpuFloorMillis` default; up to `vcpu × 1000`; 250 without credit | https://withruntime.com/pricing, https://withruntime.com/docs/api | No |
| Reserved CPU | **$0.025 per vCPU-hour**, every vCPU billed as if always busy | https://withruntime.com/docs/pricing | No |
| Memory | **$0.0075 per reserved GiB-hour** | https://withruntime.com/docs/pricing | No |
| Disk, running and paused/stopped | **$0.08 per decimal GB (10⁹ bytes) per 30-day month**; 119 microdollars per GiB-hour | https://withruntime.com/docs/pricing | No |
| Disk inclusion | First **10 GiB** of a running sandbox’s disk; only blocks the disk alone holds past that | https://withruntime.com/docs/pricing | No |
| Volume | **153 microdollars per GiB-hour**, about **$0.11 per GiB per 30-day month**; full created size | https://withruntime.com/docs/pricing | No |
| Volume backup | **$0.02 per decimal GB per 30-day month**; backups made before the price change keep $0.012 until 7 Nov 2026 | https://withruntime.com/docs/pricing | No |
| Egress | First **100 GiB per account per month** free; then **$0.02 per decimal GB** | https://withruntime.com/docs/pricing | No |
| Inbound / same-region sandbox traffic | Free | https://withruntime.com/docs/pricing | No |
| Dedicated IPv4 | **$5 per 30-day month**; IPv6 included | https://withruntime.com/pricing | No |
| WireGuard tunnel | **$5 per 30-day month**, up to 16 peers | https://withruntime.com/pricing | No |
| Custom domains, TCP ports, IPv6, Tailscale | Included (kept top-up gates some) | https://withruntime.com/pricing | No |
| Plan fee / seats / commitment | **None**; plans are a private beta | https://withruntime.com/pricing | No |
| Top-up range | **$10 to $10,000** per purchase | https://withruntime.com/docs/pricing | No |
| Auto top-up bonus | **5% extra credit** per automatic top-up | https://withruntime.com/docs/pricing | No |
| Welcome match | **100%** of credit added in first 30 days, up to **$1,000** | https://withruntime.com/docs/pricing | No |
| Monthly included usage (after paying) | **100 GiB-hours memory**, **25 vCPU-hours active CPU**, **10 GB saved copies**, **5 GB volumes** | https://withruntime.com/docs/included-usage | Amounts no; gate yes |
| Free storage | First **3 images** and first **10 GiB of volumes**, for as long as kept | https://withruntime.com/docs/pricing | Newly recorded |
| Reservation, unused room | **$0.001875 per GiB-hour** (a quarter of the memory rate), no CPU charge | https://withruntime.com/docs/reservations | New to card (was in research/rates) |

### 5.2 What changed

1. **Free-tier gate (the material change).** Before 10 Nov 2026: a never-paid account got 100 hours of a 1 GB machine **once**, across its first 30 days; a paying account got them every calendar month. From 10 Nov 2026: a **new account runs nothing until it buys credit**, from $10; once it has paid, the 100 hours return every calendar month. The numeric allowance (100 GiB-hours + 25 vCPU-hours) did **not** change. The “never-paid, one-off 100 hours” path is gone for new accounts; accounts opened before 10 Nov keep what is left.
2. **First-purchase minimum.** A $10 minimum purchase is now a precondition for the first sandbox, not just the smallest top-up. The $10 is prepaid usage, not a fee, and the first $10 is matched, so the practical opening balance is $20. There is still no minimum billing period and no commitment.
3. **New product tariff: hosted Agents (private beta).** A session’s sandbox is billed at **$0.03 per active vCPU-hour** and **$0.01 per GiB-hour of memory**; a waiting session’s sandbox is paused. No session fee, no seats. This is **not** the sandbox card’s $0.025 / $0.0075 and is not on the pricing page. Do not fold it into A/B/C.
4. **New product tariff: Reservations.** Booked room that no sandbox uses costs **$0.001875 per GiB-hour**, with no CPU charge; cancel at least an hour before the start and it costs nothing. It was already in `research/rates/runtime.json`; it is now also in the public reservations guide.
5. **New programmes, not unit rates.** Referrals: both sides get up to **$1,000** matched, then the referrer gets **10%** of the referred company’s spend for **12 months** (cap $50,000/year). Runtime for Startups: **10,000 startup hours** (2 vCPU / 4 GB), **20,000 vCPU-hours**, **40,000 GiB-hours**, **100 GB saved copies**, **100 GB volumes**, **1,000 sandboxes** on request, 12 months. Wallet accounts: no free trial, no welcome match until takeover.
6. **Unchanged:** CPU, RAM, disk, volume, volume-backup and egress unit rates; the 50-millicore floor; the 10 GiB running-disk inclusion; 100 GiB free egress; $5 IPv4 and $5 WireGuard; no plan fee; $10–$10,000 top-ups; 5% auto top-up; $1,000 welcome match; the 25 vCPU-hour / 100 GiB-hour monthly allowance.

### 5.3 A/B/C — do not recompute

No numeric input in `presets.a/b/c` changed. A is still 166⅔ task-hours at 50% CPU busy with a 2 vCPU / 4 GiB / 10 GiB shape deleted after each run; B is 730 uninterrupted hours at 10% on 4 vCPU / 8 GiB / 50 GiB; C is 90 running + 640 stopped hours at 10% on 2 vCPU / 4 GiB / 20 GiB. The CPU rate, floor, RAM rate, disk rate, 10 GiB inclusion, decimal-GB conversion, 25 vCPU-hour and 100 GiB-hour allowances are all unchanged, so the existing totals and the hand-worked tests stand.

The only modelling change is **eligibility**: the allowance is now for an account that has bought credit, not for a never-paid account. A/B/C already assume a paid account in the cost notes (“An account that has bought credit gets…”), so the totals remain valid. If the parent wants to show “what it costs to start”, say **$10 prepaid, matched to $20**, separately from A/B/C; do not add $10 to a monthly usage total.

The new **Agents** rate ($0.03 / $0.01) is a separate product case. If the parent adds a D case for a hosted agent session, work it from the Agents definition (default 4 vCPU / 8 GiB, `maxSessionSeconds` 86,400, idle pause 60 s, default session budget $5, day budget $100), not from the sandbox card.

---

## 6. First-party contradictions (both sides quoted)

### 6.1 Pay first vs “a never-paid account gets it once” — the important one

**Side A (current top of page):**

> “Runtime is pay first. A new account adds credit before it runs a sandbox, any amount from $10, and credit it adds within 30 days of signing up is matched, up to $1,000 in total.”
> — https://withruntime.com/docs/included-usage

> “No free usage before you pay.”
> — https://withruntime.com/pricing (FAQ, “Is there a free tier?”)

> “**New accounts add credit before their first sandbox.** A new account now runs sandboxes once it holds credit, from $10.”
> — https://withruntime.com/docs/changelog, 10 November 2026

**Side B (same page, lower down, and `llms.txt`):**

> “`trial` is the machine time a new sandbox without credit can still run, in milliseconds: `availableMs`, with `offer` (`monthly`, or `hours` for an account given free hours before 5 October 2026) and `renewsAt`.”
> — https://withruntime.com/docs/included-usage

> “`freeUntil` (when the free usage ends for an account that has never paid; null once it has paid).”
> — same

> “`included_usage_unavailable` | The account has no free usage: it goes once to each verified email address…; or the account was opened from a data-centre or VPN network, where it comes with credit”
> — same

> “an account that has never paid has it once, in its first 30 days”
> — https://withruntime.com/llms.txt, in the `included_usage_used_up` explanation

**Reconciliation.** Side B is the **legacy** model, still true for accounts opened before 10 November 2026. The only sentence that says so is:

> “An account given free hours or free usage before 10 November 2026 keeps what is left of them.”
> — https://withruntime.com/docs/included-usage

A new account has **no** `trial` machine time before it pays; `trial.availableMs` is 0 or the field is null, and the create is refused with a credit refusal, not `included_usage_used_up`. The error text and the `trial` field description were not rewritten, so an agent reading `llms.txt` will tell a new user “you get 100 free hours once in your first 30 days” and be wrong. **Use Side A for new accounts; mention the legacy exception only for accounts opened before 10 Nov.**

### 6.2 “No free usage before you pay” vs storage free for every account

> “No free usage before you pay.”
> — https://withruntime.com/pricing

> “Saved copies and disks are monthly for every account: … Saved copies (snapshots, images, backups) 10 GB … Disks (volumes) 5 GB”
> — https://withruntime.com/docs/included-usage

**Reconciliation:** “free usage” in the pricing FAQ means **machine time**; the 10 GB / 5 GB storage allowances are separate and are available even to an account that has not paid. They do not let a new account run a sandbox. Not material to a compute buyer, but it is why “no free usage” and “monthly for every account” both appear.

### 6.3 Plans page vs pricing/security on SSO, roles and audit log

**Plans page:**

> “It turns on features such as single sign-on, roles and the audit log.”
> — https://withruntime.com/docs/plans

**Pricing page:**

> “Single sign-on, SCIM, audit log, roles | Free on every account”
> — https://withruntime.com/pricing

> “No. Single sign-on over SAML or OIDC, SCIM directory sync, the four roles, the audit log, two-step sign-in and the data processing addendum are free on every account, with no seat fee.”
> — same

**Security page:**

> “It is free on every account.”
> — https://withruntime.com/docs/security#single-sign-on

**Reconciliation:** pricing and security are specific and current; the plans page is stale copy from before SSO/roles/audit were made free (plans themselves are a private beta). Treat `sso`, `roles` and `audit-log` as **yes/free**; do not tell a buyer a plan is needed. Flag the plans sentence for correction.

### 6.4 Status page: “No incidents recorded” vs 4 November at 61.38%

> “## Incidents
>
> No incidents recorded.”
> — https://withruntime.com/status.md

> “| 2026-11-04 | 61.38% | 720 of 720 |”
> — same page, daily table

61.38% of 720 two-minute checks passed = 442 passed, **278 failed ≈ 9.3 hours** of failed API checks. It is the worst day in the record (worse than 25 October’s 75.00% and 8 October’s 93.47%). The incident list has no entry for it.

**Reconciliation:** the daily table is automatic; the incident list is human-declared and only covers incidents someone wrote up. “No incidents recorded” means “no incident **posts**”, not “no failed checks”. A buyer should read the daily table, not the incident count. The site’s “Recent incidents” fact (“The status page lists no incidents at all”) is literally true but should not be read as a clean month; add the 4 Nov figure to the caveat.

### 6.5 “20 products are available today” vs the SDK’s product surface

> “20 products are available today: Sandboxes, Code interpreter, Network rules, Secrets, Images, Volumes, Snapshots, Previews, Desktop, Metrics, Webhooks, OpenTelemetry, Bucket mounts, MCP servers, Custom domains, TCP ports, Dedicated addresses, Private networks, Identity tokens and Single sign-on.”
> — https://withruntime.com/about

The official `withruntime@0.50.0` package also ships product modules and types for **Agents**, **Apps**, **Functions**, **CI/CD**, **Containers**, **Desktops**, **Browsers**, **Balancers**, **Queues**, **Streams**, **Uptime**, **Reservations**, **Referrals**, **Plans**, **Signed requests**, **Private network**, **Tailscale**, **File watches** and **Wallet**.

**Reconciliation:** “available” means public/GA; the rest are private beta, private-until-launch, or features inside a public product. The count is not a completeness claim, but the docs index and the price page are incomplete: a buyer cannot find Agents, CI/CD, Apps, Functions, Containers or standalone Desktops there. Do not infer absence from the 20-product list.

### 6.6 “There is no plan fee” vs “A plan is a monthly fee”

> “There is no plan fee, no seat price and no commitment.”
> — https://withruntime.com/pricing

> “A plan is a monthly fee that comes back as usage”
> — https://withruntime.com/docs/plans

> “Plans are in a private beta. Only the organizations in it can see or choose one.”
> — same

**Reconciliation:** no **mandatory** plan fee; optional private-beta plans charge a monthly fee that is returned as usage at the same measured prices, so the fee is not a surcharge. A non-plan account pays $0 fee. The two statements are compatible if “no plan fee” is read as “no plan is required”, but the wording invites confusion. Use “no mandatory plan fee; optional plans are prepaid usage”.

### 6.7 Stale trial wording

> “Trial sandboxes are not charged for traffic.”
> — https://withruntime.com/pricing, network FAQ

> “A sandbox without credit has free traffic, and it uses none of the allowance.”
> — https://withruntime.com/docs/pricing, network products

There are no new “trial sandboxes” after 10 Nov, and a new account cannot run a sandbox without credit. These sentences now describe only legacy free-usage sandboxes or a paid account that has spent its credit. Do not quote them as a current free-egress promise. Egress is free for the first 100 GiB per account per month, then $0.02/GB; a no-credit sandbox (legacy) does not consume the allowance.

### 6.8 Latency presentation (not a contradiction, but a trap)

> “Both checks passed their last run. At the median, the API answers in 11 ms and a sandbox starts in 1.7 s.”
> — https://withruntime.com/status

> “`await spare.wake(); // about 0.1 s`”
> — https://withruntime.com/docs/javascript

These measure different things: **1.7 s** is create-to-running for a new 2 vCPU / 4 GiB sandbox over the last 24 hours (30-day median 325 ms, 7-day 609 ms); **0.1 s** is a paused sandbox’s wake. Do not put “starts in 0.1 s” next to a create benchmark, or “starts in 1.7 s” next to a wake claim.

---

## 7. Important products the 16 features and 78 capabilities miss

Two different things are true here. Some products are **new since the 28 October check**; others existed then but were **not in the public 20-product list, docs index or price page**, so the baseline profile missed them. The SDK (`withruntime@0.50.0`, published 31 October) is the most complete public map; the docs index is not.

### 7.1 Material products

| Product | Status | What it is | First-party evidence | Site coverage |
|---|---|---|---|---|
| **Agents** | Private beta | A coding or support agent’s harness (Claude Code, Codex, Gemini CLI, Claude Agent SDK, OpenAI Agents SDK or your own) in a sandbox of its own **per session**, on your model key. Sessions stream replies/asks/results; triggers are API, Slack, GitHub, schedule and webhook; memory, advisor, permissions, subagents, workflows and dollar budgets. | “Agents: a coding or support agent's harness (Claude Code, Codex, Gemini CLI, or your own code on an agents SDK) in a sandbox of its own per session, on your own model key.” — https://unpkg.com/withruntime@0.50.0/dist/products/agents.d.ts | **Missed.** `prompt-api` was `no`; now `partly`. `built-in-agents` was `no`; now `partly`. No feature describes session triggers, memory or budgets. |
| **CI/CD** | Beta | Checks every push and pull request of a connected GitHub repository in sandboxes. Warm snapshots, layered `setup:`, test splitting (`touched`, `own`), `pushes:` for non-PR branches, undo/revert, release ordering, “Could not run” reasons. Configured in `.runtime/checks.yml` / `runtime.yml`. | “`client.CI` reads CI/CD. It checks every push and pull request of a connected GitHub repository in sandboxes.” — https://withruntime.com/docs/go#cicd-beta | **Missed.** No capability for CI, GitHub checks, warm snapshots, test splitting or undo. |
| **Apps** | Private beta | Deploy an image to a URL; versions, rollback, `releaseWatch` (`alert`/`rollback`/`off`), CDN on/off, min/max copies, concurrency, spares, health path, custom domains, logs, volumes. | “On the client as runtime.apps for Apps' private beta: an account outside it is refused with product_in_beta.” — https://unpkg.com/withruntime@0.50.0/dist/products/apps.d.ts | **Missed.** `reaching-it` covers ports, not app hosting with releases and rollback. |
| **Functions** | Private beta | Serverless functions beside Apps: create, deploy, list, read, update, roll back, delete; releases, versions, copies, logs. | “Functions in the CLI and the console (private beta). `runtime functions` creates, deploys, lists, reads, updates, rolls back and deletes Functions” — https://withruntime.com/docs/changelog (19 Oct 2026) | **Missed.** No function-as-a-service capability. |
| **Containers** | Private beta | One OCI image’s process on its own microVM at `/v1/containers`; billed at sandbox rates. | “Containers: one OCI image's process on its own microVM, billed at the sandbox rates … at /v1/containers. In a private beta” — https://unpkg.com/withruntime@0.50.0/dist/products/containers.d.ts | **Partly covered** by `docker-inside` (you can run Docker *inside* a sandbox), but this is the inverse: run an OCI image *as* the sandbox. |
| **Desktops (standalone)** | Private beta | A Linux desktop on its own sandbox at `/v1/desktops`, private live view, computer use (screenshot and act), billed at sandbox rates. | “Desktops: a Linux desktop on its own sandbox, billed at the sandbox rates … with a private live view and computer use: screenshot and act. In a private beta” — https://unpkg.com/withruntime@0.50.0/dist/products/desktops.d.ts | `desktop` capability covers the in-sandbox desktop; the standalone resource is new. |
| **Browsers (standalone)** | Separate API, no beta header | `/v1/browsers`: 1 vCPU / 2 GiB default, 1,024–16,384 MiB, headless or visible, timeout, idle pause, CDP. The console has a Browsers list. | “The server defaults to 1 vCPU.” … “Defaults to true; false requests a visible browser.” — https://unpkg.com/withruntime@0.50.0/dist/products/browsers.d.ts | `browser` capability covers Chromium in a sandbox; the standalone Browsers resource is new. |
| **Reservations** | Public | Book room for 1–10,000 sandboxes of one size, one region, up to 24 h, starting within 14 days; creates inside the window are never refused for capacity or quota. Unused room costs $0.001875/GiB-hour; cancel ≥1 h ahead for free. Standing room for a pool. | “Up to 10,000 sandboxes of one size, in one region.” … “Booked room that none of them uses costs a quarter of the memory rate, $0.001875 per GiB-hour” — https://withruntime.com/docs/reservations | `warm-pool` is `partly`: reservations hold **room**, not pre-started machines. This is the closest thing to a pool. |
| **Wallet accounts** | Public | An agent with no person opens an account and pays in USDC on Base, Solana or Tempo; no sign-in, browser or card; key on payment; no free trial or welcome match until takeover. | “An agent working with no person can open its own account this way. There is no sign-in, no browser and no card, and no free trial.” — https://withruntime.com/docs/pricing#pay-with-stablecoins | `no-card` now `partly`; no capability for agent-owned billing. |
| **Referrals** | Public | Both sides get up to $1,000 matched on the referred company’s first 30 days, then the referrer gets 10% of its spend for 12 months (cap $50,000/year). | “Refer a company, and you both get up to $1,000. After that, you get 10% of what it spends, for 12 months” — https://withruntime.com/docs/pricing | `free-credit` covers the welcome match, not referrals. |
| **Runtime for Startups** | Public | 10,000 startup hours (2 vCPU / 4 GB each), 20,000 vCPU-hours, 40,000 GiB-hours, 100 GB saved copies, 100 GB volumes, 8 builds at once, up to 1,000 sandboxes; 12 months; no card. | “10,000 startup hours, each an hour of a 2 vCPU, 4 GB sandbox, given once” — https://withruntime.com/docs/pricing | `trials-free-tiers` covers the general allowance, not this programme. |
| **Queues / Streams / Balancers / Uptime** | Private until launch / no public guide | SQS-compatible queues (`sqs` URL), Kafka-compatible streams (`kafka.bootstrap`), load balancers plus inbound firewall, uptime checks from nine regions. | “Private until launch. This is the proposed management contract, not an installed API route. SQS clients use the returned sqs URL…” — https://unpkg.com/withruntime@0.50.0/dist/products/queues.d.ts; “Kafka clients use kafka.bootstrap and kafka.topic unchanged.” — `streams.d.ts`; “Private until launch: load balancers and the inbound firewall” — `balancers.d.ts` | **Missed.** These are infrastructure products beyond sandboxes. |

### 7.2 Smaller products and controls that are also outside the 78

| Item | What it is | Evidence | Site gap |
|---|---|---|---|
| **Code interpreter** | Stateful notebook session in a sandbox: Python, JavaScript, TypeScript, R, Java, Bash, Go; contexts, restart, interrupt, results files. | “A notebook-style Python or JavaScript session in a sandbox” / `POST /v1/sandboxes/{id}/interpreter:run` — https://withruntime.com/docs/api | No capability. `browser`/`desktop` are different. |
| **Observability** | Per-sandbox CPU/memory metrics, event log, signed webhooks, OpenTelemetry export over OTLP/HTTP. | “Metrics, events, webhooks and OpenTelemetry export are in [metrics and webhooks].” — https://withruntime.com/docs/api | No capability. `ways-to-drive` mentions OpenTelemetry in passing. |
| **Sandbox sessions** | Short-lived token so a browser reaches one sandbox directly, no key; 1 h default, 24 h max, origins allowlist, cannot create/stop/pause. | “A session is a short-lived token. A browser uses it to reach one sandbox without your key.” — https://withruntime.com/docs/api | No capability. |
| **Signed requests** | Your sandboxes sign requests as Runtime’s agents; `GET/PUT /v1/networks/signed-requests`. | “Your sandboxes sign requests as Runtime's agents” — https://withruntime.com/docs/api | No capability. |
| **Private network by name** | Sandboxes reach each other at `<name>.sandbox.internal` or `<id>.sandbox.internal`, free, no tunnel. | “Your sandboxes reach each other by name” — https://withruntime.com/docs/api; “`<name>.sandbox.internal`, free. It needs no tunnel.” — https://withruntime.com/docs/networking | `outbound-network` covers egress, not east-west. |
| **Tailscale** | A paid sandbox joins your tailnet as a machine of its own, with an auth key stored as a secret. | “Your Tailscale network: a sandbox joins your tailnet as a machine of its own” — https://withruntime.com/docs/networking | No capability. |
| **File watches** | Watch a directory for create/write/remove/rename/chmod/access; up to 16 at once; cursor/stream. | “Watch a directory: `{path, recursive, events, include, exclude, batchMs, timeoutMs}`” — https://withruntime.com/docs/api | `file-api` covers read/write, not events. |
| **Upload/download links** | A URL for one file, no key; GET or PUT; 5 GiB; optional wake; archive a folder. | “A file link is an address for one file in a sandbox. It works with no API key.” — https://withruntime.com/docs/api | `file-api` covers API calls, not links. |
| **Evictable sandboxes** | `evictable: true` lets Runtime delete a paused/stopped sandbox after 15 min when the server needs the disk; running is never evicted. | “An evictable sandbox that has been paused or stopped for at least 15 minutes may be deleted when its server needs the disk.” — https://withruntime.com/docs/api | `lifecycle` note; new 30 Oct. |
| **Timer wakes** | A pending process timer wakes an idle sandbox; `wakeOnTimers: false` disables. | “A process due on a timer wakes it when it paused for being idle” — https://withruntime.com/docs/api | `idle-timers` note; new 29 Oct. |
| **Switch image** | Move a sandbox to another image, keeping id/name/`/workspace`/volumes/previews/ports; processes restart; other disk lost. | “`POST /v1/sandboxes/{id}:switch-image` … moves a sandbox to another image.” — https://withruntime.com/docs/api | `custom-image`/`lifecycle`; no capability. |
| **`getOrCreate`** | A create with a name returns the holder, wakes it or restarts it; same name is one sandbox under concurrency. | “With `getOrCreate: true`, the create returns the holder instead.” — https://withruntime.com/docs/api | No capability; important for per-user sandboxes. |
| **`spreadFrom`** | Start on a server none of 1–16 named sandboxes/snapshots is on. | “One to 16 ids of your own sandboxes or snapshots: it starts on a server none of them is on” — https://withruntime.com/docs/api | No capability; high availability. |
| **`unreachable` state** | A running sandbox that stops responding reports `unreachable` with `since` and `reason` (`agent_not_answering`, `disk_stalled`, `host_quarantined`). | “A running sandbox that stops responding now returns `unreachable`, with `since` and `reason`” — https://withruntime.com/docs/changelog (29 Oct) | The canonical state list caveat is still open; this adds a state. |
| **`leaseSeconds`** | Fund a no-time-limit sandbox up to 12 h ahead; renewal at half; only owner/admin/account-wide key. | “With no time limit, how far ahead each renewal funds it: from its first lease (1,800 seconds…) to 43,200 seconds (12 hours).” — https://withruntime.com/docs/api | No capability. |
| **`maxTotalCostMicros`** | Lifetime spend cap per sandbox; stops with `stopReason: lifetime_cap`. | “The most the sandbox may cost over its whole life” — https://withruntime.com/docs/api | `spend-cap` covers it, but not as a separate product. |
| **Compartments** | A key-scope boundary; other keys get 404; own namespace for names; can hold Apps and Functions. | “A compartment separates a group of keys from the rest of the account.” — https://withruntime.com/docs/security | `scoped-keys` partly covers it; no separate capability. |
| **Read-only keys + daily limits** | Read-only key sees everything but changes/spends nothing; daily dollar limit per key; `spending_limit_reached` 402. | “Read-only key. Choose Read only when you create a key…” — https://withruntime.com/docs/security | `scoped-keys`/`spend-cap` partly. |
| **Plans** | Private-beta monthly fee returned as usage at the same measured prices; higher limits, features, support; yearly = 10 months; trial. | “A plan is a monthly fee that comes back as usage” — https://withruntime.com/docs/plans | `billing-models` says “plans are in a private beta”; no plan detail. |
| **Desktop recordings** | Record the desktop to MP4, at most 8 GiB per sandbox, 4 Mbit/s, low-priority encoder. | “Record the desktop. `sbx.desktop.recordings` records the screen to MP4” — https://withruntime.com/docs/changelog | `desktop` covers the desktop, not recordings. |
| **MCP catalog** | Servers from Runtime’s catalog run in a sandbox at private URLs; `GET /v1/mcp/catalog`. | “GET /v1/mcp/catalog; POST, GET, DELETE /v1/sandboxes/{id}/mcp — MCP servers” — https://withruntime.com/docs/api | `mcp-server` covers Runtime’s own MCP server, not the catalog. |
| **Bucket mounts** | S3, R2 or GCS bucket as a folder; key never enters the sandbox. | “You can mount your own buckets inside a sandbox, and the sandbox never holds their keys.” — https://withruntime.com/docs/storage | `mount-buckets` covers it. |
| **Identity tokens** | Short-lived OIDC token naming the sandbox; AWS/GCP role assumption with no stored key. | “A sandbox asks Runtime for a short-lived OIDC token.” — https://withruntime.com/docs/security | `keys-secrets` covers it. |
| **GitHub App secrets** | A GitHub App private key stored as a secret; Runtime mints installation tokens, narrowed by repo/permission. | “The value is the App's private key (PEM). Our servers sign the App's token request.” — https://withruntime.com/docs/security | `secrets-store` covers it generically. |

### 7.3 What this means for the model

- The **16 features** are still the right axes; the gap is in the **78 capabilities**, which are sandbox-shaped. A buyer comparing “agent infrastructure” now needs rows for **hosted agent sessions**, **CI checks**, **app hosting**, **functions**, **containers**, **observability** and **capacity reservations**. Adding all of them is a schema/product decision, not a Runtime recheck.
- If the parent adds only one, add **`prompt-api`** (already a capability) and **`built-in-agents`** (already a feature); that captures the Agents product without new IDs.
- If the parent adds a second, add **`ci-cd`** or **`app-hosting`** as a capability; Runtime’s CI/CD is the most distinctive beta (warm snapshots, test splitting, undo) and is not represented anywhere.
- Do **not** mark Runtime as “20 products” in prose without saying “20 public products”; the SDK exposes at least 12 more private/beta products.

---

## 8. Downstream integration notes

Nothing in `site/src/data` was edited in this thread (research-only). These are the edits the parent should make, in the order the checklist uses.

### 8.1 `site/src/data/providers/runtime.json`

- `checkedOn`: `2026-10-28` → **`2026-11-12`**.
- `oneLiner`: consider **“Firecracker microVMs billed on measured CPU, paid up front, with the strongest secret handling in this set.”** The old line is still true but omits the entry gate that now defines the product.
- `whatItIs[1]`: add “after a $10 first purchase” to the measured-CPU pitch.
- `whatItIs[2]`: keep “Twenty products…”, add “A further set — hosted Agents, Apps, Functions, CI/CD, Containers, standalone Desktops and Browsers, Queues, Streams, Balancers, Uptime, Reservations — is private beta or private until launch and is not in the public product list, docs index or price page.”
- `whoFor`: add “teams that want a hosted coding-agent harness as well as raw sandboxes (private beta)”; update the drop-in list to E2B, Daytona, Vercel, Blaxel, Morph, Modal, Cloudflare and Fly.
- `billing.model`: **“Prepaid credit, no plan fee, no seats and no commitment. Pay first: credit from $10 before the first sandbox; the first $10 is matched.”**
- `billing.meter`: keep the sandbox meter; add “Hosted Agents sessions bill separately at $0.03 per active vCPU-hour and $0.01 per GiB-hour.”
- `billing.stopped`: unchanged.
- `billing.planFee`: unchanged (“None publicly; plans are a private beta”).
- `billing.minimum`: **“No minimum billing period. A new account must buy at least $10 of credit before its first sandbox; the first $10 is matched, so it starts with $20. Top-ups are $10 to $10,000, and an automatic top-up earns 5% extra credit.”**
- `cost.A/B/C`: **do not recompute.** Add one sentence to the notes: “The $10 first purchase is prepaid credit, not a fee; it is not added to these totals. The monthly allowance is available only after that purchase.” If the parent prefers, put it in `billing.minimum` and a new caveat instead of repeating it three times.
- `company.facts`:
  - Status and SLA: “API checks passed **100%** over 7 days and **97.85%** over 30, against a 99% monthly promise with a 10% credit for paid accounts.” Quote the 12 Nov `status.md` rows.
  - Recent incidents: “The status page records no incidents, but **4 November 2026 passed only 61.38%** of API checks (278 of 720 failed, about 9.3 hours); its record begins 23 September 2026.” Quote “No incidents recorded.” and the 4 Nov row.
  - Sandbox starts: “Its own checks show sandbox starts succeeding **96.89%** of the time over the last 30 days (4,319 runs), median **325 ms**, p95 **2.2 s**, measured on 12 November 2026.” Quote the 30-day row.
  - Certification, legal entity, leadership, history, funding: unchanged.
  - Optional new fact: “The SDK/CLI/MCP package is Apache-2.0; the platform is hosted only.” Quote the npm licence or `LICENSE`.
- `fits.well`: keep the three. Optional fourth: “The first $10 is matched, so the entry cost buys $20 of usage.”
- `fits.badly`: add **“A buyer who wants to try before paying: there is no free tier; the first sandbox needs $10 of credit, matched to $20.”** and **“A buyer who needs published docs and a price for hosted agents, app hosting, functions, containers or CI/CD: they are private betas, refused with `product_in_beta` and absent from the price page.”**
- `usability.dashboard`: add “beta accounts also get Apps, Agents, Browsers and Desktops lists.”
- `usability.withoutCode`: **“Partly, and only for the first step: one click on Home starts a sandbox with a shell in the page once you have added credit. There are no app templates; the documented no-code path is pasting its `llms.txt` link into Claude Code, Codex or Cursor, and a private-beta hosted Agents product runs a coding agent for you.”**
- `usability.signup`: **“Google or email sign-in, no waitlist, but credit from $10 before the first sandbox. A card is the normal route; an agent can open a wallet account and pay in USDC. Email sign-ups need a domain older than 90 days unless it is a major provider, and one account per inbox.”**
- `usability.docs`: add “the docs index omits the private-beta products the SDK exposes (Agents, Apps, Functions, CI/CD, Containers, standalone Desktops, Queues, Streams, Balancers, Uptime), and some pages still describe the pre-10-Nov free trial.”
- `usability.tripsUp`: add “Nothing runs until you have paid: the first sandbox needs $10 of credit, matched to $20.”; “The docs and the SDK disagree about what exists.”; “The status page can say ‘No incidents recorded’ while a day shows 61.38%.” Keep the six existing.
- `caveats`:
  - Keep “A stopped sandbox keeps billing”.
  - Update “Uptime was below the published promise”: “97.85% over 30 days and 61.38% on 4 November, against a 99% monthly promise; 7 days is 100%.” Status `open`.
  - Replace “Free hours: every month or once?” with **“Free usage needs a purchase”**: “A new account runs nothing until it buys credit from $10. The 100 GiB-hours / 25 vCPU-hours return monthly only after that. The old never-paid 100 hours are gone for new accounts.” Status `open`.
  - Add **“The free-usage docs still describe a legacy trial”** with both quotes (top of included-usage vs `trial`/`freeUntil` and `llms.txt`), status `contradiction`.
  - Keep “The canonical state list is not published”; add `unreachable` to the names and note the list is still absent.
  - Keep “One region, in Virginia”.
  - Update “Very young”: “A seven-week-old repository (26 September 2026) with 1 star and 0 forks; SDK 0.50.0; daily changelog including breaking changes; the private-beta Agents/Apps/Functions/CI/CD surface is not in the public docs.”
  - Add **“Private-beta products have no public price”**: Agents $0.03/$0.01 from the SDK types; Apps, Functions, CI/CD, Containers, standalone Desktops, Queues, Streams, Balancers, Uptime have no price-page entry and refuse non-beta accounts with `product_in_beta`.
  - Add **“Plans page contradicts free SSO/roles/audit”** with both quotes, status `contradiction`.
  - Add **“Status page says no incidents while 4 November was 61.38%”** with both quotes, status `contradiction`.
- `strengths`: add “The first $10 is matched, so the entry cost buys $20 of usage.” and “Hosted Agents beta runs Claude Code, Codex or Gemini CLI per session with memory, budgets and Slack/GitHub/schedule/webhook triggers.” Keep the existing five.
- `sources`: add `Docs: included usage`, `Docs: changelog`, `Docs: plans`, `Docs: reservations`, `Docs: referrals`, `SDK: hosted Agents (private beta)`.

### 8.2 `site/src/data/pricing/runtime.json`

- `checkedOn`: `2026-10-30` → **`2026-11-12`**.
- Numeric fields: **unchanged** (`cpu.rate 0.025`, `floor 0.05`, `ram.rate 0.0075`, `disk.running/stopped 0.00011111111111111112`, `included 10`, `includedRunningOnly true`, `decimalGB true`, `between "kept"`, `egress.perGiB 0.0215`, `included "100 GiB a month per account"`).
- `plans[0].note`: replace “A new account's one-time free hours are separate and not counted here.” with **“A new account must buy at least $10 of credit before it runs; accounts opened before 10 November 2026 keep any one-time free hours they had left. The monthly 25 vCPU-hours and 100 GiB-hours are available only after that purchase.”**
- `notes`: add **“Pay first: nothing runs before the first $10 purchase; the first $10 is matched, so the practical opening balance is $20.”** and **“Hosted Agents (private beta) bill a session's sandbox at $0.03 per active vCPU-hour and $0.01 per GiB-hour; that is a separate product, not this card.”**
- `sources`: consider adding `https://withruntime.com/pricing` (the canonical price page, updated 2026-11-10) alongside `https://withruntime.com/docs/pricing`. If added, run `npm run check-rates -- --update` and inspect the diff; the checker will mark it `NEW` because it is not in `price-baseline.json`.
- `upkeep`: unchanged.

### 8.3 `site/src/data/features/*.json`

**Verdict changes (2):**

- `built-in-agents.json`: `runtime.verdict` `no` → **`partly`**; figure **`Agents beta`**; scenario “The default image has no coding agent, but Runtime’s private-beta Agents product runs Claude Code, Codex or Gemini CLI in a sandbox per session.”; note as in §1; source `https://unpkg.com/withruntime@0.50.0/dist/products/agents.d.ts`, quote “In a private beta: outside it every call is refused with `product_in_beta`.”, confidence `docs-confirmed`.
- `trials-free-tiers.json`: `runtime.verdict` `yes` → **`partly`**; figure **`100 h/mo after $10`**; scenario “Pay $10, get $10 matched, then 100 hours of a 1 GB machine a month; nothing runs before the first payment.”; note as in §1; source `https://withruntime.com/pricing`, quote “Once an account has paid, 100 free hours of a 1 GB machine is included every month, renewed on the 1st: 100 GiB-hours of memory and 25 vCPU-hours of active CPU.”, confidence `pricing-page`.

**Row note changes (same verdict):**

- `company.json`: update status figures and the 4 Nov day; keep `partly`.
- `billing-models.json`: add pay-first and the Agents meter; keep `partly`.
- `idle-timers.json`: add timer wakes / `wakeOnTimers`; keep `yes`.
- `keys-secrets.json`: add `exposed` secrets and GitHub App tokens; keep `yes`.
- `lifecycle.json`: add `evictable`, `unreachable`, `switch-image`; keep `yes`.
- `outbound-network.json`: add IPv6, Tailscale, 500 GiB/day vs 1 GiB/day; keep `yes`.
- `reaching-it.json`: add sandbox sessions and 16 previews; keep `yes`.
- `sizes-regions.json`: add 2 vCPU / 4 GiB / 10 GiB without credit; keep `partly`.
- `storage.json`: add first 3 images / 10 GiB volumes free and 7-day default backup retention; keep `yes`.
- `teams-accounts.json`: add the plans-page contradiction; keep `yes`.
- `ways-to-drive.json`: add Go/Ruby/Java SDKs and browser session tokens; keep `yes`.

**Shared prose changes:**

- `company.json` split 1 body 1: “96.37% … 98.87%” → “100% … 97.85%, though 4 November passed only 61.38%”.
- `built-in-agents.json` split 2 body 0: replace “Runtime does not preinstall agents, and its own docs say no bridge harness has run on it yet.” with “Runtime does not preinstall an agent in its default image, but its private-beta Agents product runs Claude Code, Codex or Gemini CLI in a sandbox of its own per session.”
- `trials-free-tiers.json`:
  - split 0 body 0: “Runtime’s allowance” → “Runtime’s matched credit and monthly allowance”.
  - split 1 body 0: replace “Runtime’s free usage caps at 2 vCPU / 4 GiB / 10 GiB, four sandboxes at once and 50 created a day.” with “Runtime’s no-credit limits cap a paid account that has spent its credit at 2 vCPU / 4 GiB / 10 GiB, four sandboxes at once and 50 created a day; a new account cannot run anything until it pays.”
- `ways-to-drive.json` split 1 body 0: “boxd, Boat and Sandboxer expose real SSH… Runtime carries it over its API.” → include Runtime in the real-SSH group, with the one-time config install.
- `idle-timers.json` split 1 body 1: add “Runtime also wakes an idle sandbox when a process timer is due, unless `wakeOnTimers` is false.”

### 8.4 `site/src/data/capabilities.json`

- **Verdicts (4):** `ssh` `partly`→`yes` (drop shortfall, new figure/quote); `prompt-api` `no`→`partly` (new shortfall); `free-tier` `yes`→`partly` (new shortfall/figure/quote); `no-card` `yes`→`partly` (new shortfall/figure/quote).
- **Notes/figures (same verdict):** the `NOTE` rows in §4 — at minimum `agents-preinstalled`, `fast-start`, `warm-pool`, `public-url`, `raw-tcp`, `custom-domain`, `static-ip`, `secrets-store`, `hidden-secrets`, `scoped-keys`, `dashboard-create`, `python-sdk`, `ts-sdk`, `file-api`, `browser`, `desktop`, `hosts-other-agents`, `schedules`, `sso`, `spend-cap`, `usage-alerts`, `audit-log`, `no-monthly-fee`, `free-credit`, `status-page`, `open-source`.
- `capabilities.json.checkedOn` is the whole-dataset date (`2026-10-29`). **Do not advance it for this one-provider recheck** unless the parent is treating the recheck as a full dataset audit; the skill says record per-provider coverage in the research notes when the schema has no finer date. If the parent does advance it, every other provider looks newly checked, which is false.

### 8.5 `site/src/data/docs.json`

No URL changes needed. All 16 mapped URLs still load the intended page. `built-in-agents` stays `null` (there is no public Agents guide; the SDK type file is not a docs page). `idle-timers` could point at `https://withruntime.com/docs/sandbox-environment#timers-wake-an-idle-sandbox` instead of `docs/pricing` to cover the new timer behaviour, but the pricing page still explains idle-as-paused-time; either is defensible. `trials-free-tiers` stays `docs/included-usage`.

### 8.6 `site/src/data/usecases.json` (10 guides)

- **`claude-code-team`**: route `manual` → **`guide`**, `noTerminal` stays `no`; link `https://withruntime.com/integrations/claude-code`; what “A first-party guide installs Claude Code from npm in a microVM, keeps the key in a host-side secret and returns the diff; each developer needs their own sandbox and credentials. Runtime’s private-beta Agents product can also run a Claude Code session per prompt.” This removes the current contradiction with `coding-agent`, which already cites the same guide.
- **`code-interpreter`**: pick watch “free tier capped at four sandboxes at once” → “**no free tier: credit from $10 before anything runs**, then four sandboxes at once without credit”. The $13/month why is still the usage cost.
- **`hermes-agent`**: pick watch add “credit from $10 before the first sandbox”. The $25/month why is unchanged.
- **`openclaw`**: route what add “after adding credit”.
- **`scheduled-scraper`**: pick watch add “credit is prepaid from $10”; the $0.50/month figure is usage, not the entry cost.
- **`chat-bot`**, **`workflow-automation`**, **`mcp-server`**: same $10-entry caveat in the watch; no tier change.
- **`coding-agent`**: optionally mention the hosted Agents beta as an alternative to the guide; keep tier `guide`.
- **`browser-agent`**: optionally mention the standalone Browsers resource; keep tier `guide`.
- **`openclaw`/`hermes-agent`** routes stay `manual`; there is still no first-party guide.

### 8.7 `site/src/data/situations.json`

- **`stay-available`** why: “`persistent: true` disables the idle pause, and measured CPU with a 50-millicore floor **plus reserved memory** makes a waiting **4 GiB** agent cost about $0.03 an hour.” The current sentence attributes the whole $0.03 to CPU; the CPU floor alone is $0.00125/h, the 4 GiB memory is $0.03/h.
- **`stay-available`** watch: add “**no free trial: $10 of credit before the first sandbox**”; keep “no preinstalled agent” (the hosted Agents beta is a separate product, not a preinstall).
- **`answer-when-asked`** why: same CPU/memory attribution fix; “an idle-but-running box costs about $0.03 an hour” is true for 4 GiB but not for every size.
- **`one-per-customer`** unchanged.

### 8.8 `site/src/data/changes.json`

Add one dated entry (observation date 2026-11-12; provider change 2026-11-10). Suggested:

```json
{
  "date": "2026-11-12",
  "title": "Runtime now charges before the first sandbox, and its free hours need a purchase",
  "provider": "runtime",
  "what": "Runtime became pay first on 10 November 2026: a new account adds credit from $10 before its first sandbox, and the first $10 is matched, so it starts with $20. The 100 free hours of a 1 GB machine (100 GiB-hours of memory, 25 vCPU-hours of active CPU) still return every calendar month, but only after the account has bought credit; accounts opened before 10 November keep any free hours they had left. The sandbox unit rates did not change. The guide's Runtime rows now say partly for trials and free tiers, and the no-card catch is that the only card-free route pays in USDC.",
  "sources": [
    {"url": "https://withruntime.com/pricing", "quote": "No free usage before you pay. You add credit by card from $10", "confidence": "pricing-page"},
    {"url": "https://withruntime.com/docs/changelog", "quote": "New accounts add credit before their first sandbox.", "confidence": "docs-confirmed"},
    {"url": "https://withruntime.com/docs/included-usage", "quote": "An account given free hours or free usage before 10 November 2026 keeps what is left of them.", "confidence": "docs-confirmed"}
  ]
}
```

The quote is a substring after stripping the bold markers; if the checker is literal, use “**New accounts add credit before their first sandbox.** A new account now runs sandboxes once it holds credit, from $10.”.

### 8.9 `site/scripts/price-baseline.json` and `npm run check-rates`

- `npm run check-rates` from `site/` reported **no Runtime change**. The only Runtime URL in the baseline is `https://withruntime.com/docs/pricing`, and its money tokens are the same. Do **not** run `--update` for Runtime alone; if the parent runs it for another provider, inspect the diff and do not bless unrelated pages.
- `https://withruntime.com/pricing` is now the canonical price page (updated 2026-11-10) and carries the pay-first FAQ, but it is **not** in the rate-card sources or the baseline. If the parent adds it to `pricing/runtime.json.sources`, the checker will print `NEW`; add a baseline entry after reading the live page. This is a judgment call: the current card is correct without it, but the FAQ is the best evidence for the free-tier change.

### 8.10 `site/src/lib/cost.test.ts`

No change needed: CPU, RAM, disk, floor, inclusion and 25/100 allowance are unchanged, and the Runtime A/B/C expectations should still pass. I ran the suite: **70/70 pass**. If the parent models the $10 first purchase, add a **separate** test for the “cash needed” boundary, not to A/B/C: A/B/C are usage, and the $10 is prepaid credit that is spent, not a fee. If the parent adds an Agents case, add a new fixture at $0.03/$0.01 and do not reuse the sandbox card.

### 8.11 `compare/side-by-side.astro`, counts and README

- The manual `kinds` map needs **no change**: Runtime is still a microVM, not a VPS.
- Provider/feature/capability/use-case counts are unchanged: **29 providers, 16 features, 78 capabilities, 10 use cases** (29 = 16 sandbox + 13 VPS; the “16 researched providers” in AGENTS.md is the older sandbox count, not today’s total).
- `README.md` / `site/README.md` have no Runtime free-tier claim to update; the provider list and counts stand.

### 8.12 Research ledger

- `research/withruntime.md` is the historical ledger. Append a **12 November 2026** section rather than rewriting the 28 October section; the old dates and quotes are still valid history.
- `research/rates/runtime.json` has `checkedOn: 2026-10-29`; update to 2026-11-12 and add the pay-first note, the Agents rate, and the free-tier gate. Keep the original units.
- `research/capabilities-NOTES-*.md`:
  - `capabilities-NOTES-3-access.md` says Runtime `ssh` = partly “not confirmed that a plain ssh client works”. Supersede: the editors page now documents `ssh web.runtime` and `Host *.runtime`.
  - `capabilities-NOTES-4-running-company.md` says `prompt-api` stays `no` for Blaxel; add a Runtime note that its `prompt-api` moved to `partly` via the private-beta Agents product.
  - `capabilities-NOTES-1-machine-money.md` says no price change on 28 Oct; record the 10 Nov **eligibility** change (not a unit-rate change) and the 4 Nov status dip.
  - `capabilities-NOTES-2-state-staying-on.md` should record `evictable`, `wakeOnTimers`, `unreachable`, `switch-image`, `leaseSeconds`, `spreadFrom`, `getOrCreate`, file watches and upload links.

---

## 9. Verification, limitations and delivery state

**What was checked**

- Fresh Context `web_scrape` with `maxAgeMs: 0` on `/pricing`, `/docs/pricing`, `/docs/included-usage`, `/status`, `/docs/changelog`, `/legal/terms`, `/docs/editors`, `/docs/sandbox-environment`, `/docs/trust`, `/docs/products`, `/docs/storage`, `/docs/networking`; every response had `cache_metadata: {"status":"miss","age_ms":0}`.
- Fresh curl of `/llms.txt`, `/llms-full.txt`, `/pricing.md`, `/about.md`, `/status.md`, `/status.json`, `/docs/*.md`, `/legal/raw/terms`, `/legal/raw/dpa`, `/legal/raw/subprocessors`, `/sitemap.xml`, `/docs/llms.txt`, and `https://api.withruntime.com/v1/openapi.json`.
- Fresh npm/unpkg of `withruntime@0.50.0` (published 2026-10-31) and its `dist/products/*.d.ts`; npm registry metadata; GitHub API repository facts.
- Stored quote check: all 78 Runtime capability quotes tested as normalized substrings of the fresh Markdown; **76 matched**, `no-card` is the intended change, `dashboard-create` is a whitespace/emphasis artifact in the stored quote (the sentence is live). Changed rows use new quotes.
- Structural audit: **29 providers, 16 features, 78 capabilities, 10 use cases**; Runtime has **16/16** feature rows and **78/78** capability rows.
- `cd site && npm test`: **70/70 pass**, 0 fail.
- `cd site && npm run build`: **170 pages**, complete, no errors.
- `cd site && npm run check-rates`: no Runtime change; many other providers changed (not this thread’s scope; do not bless them).
- `git status --short`: no repo data edits; only this scratchpad file (gitignored or untracked).
- No visual check: research-only, no site UI or data edit. If the parent integrates, the normal provider/feature/capability/use-case render check applies.

**Limitations**

- Desk research only: no Runtime account, key, sandbox or API call with credentials. The Agents/Apps/Functions/CI/CD/Containers/Desktops/Queues/Streams/Balancers/Uptime products are documented in the published SDK types and changelog, but **not exercised**; private-beta behaviour outside the beta is the SDK’s `product_in_beta` refusal.
- The public docs index and sitemap omit the beta products, so “not published” there is not “does not exist”. The SDK types are the source of truth for the surface; the pricing page is not.
- Status numbers move every minute. The figures here are pinned to the 12 November 2026 ~10:04 UTC `status.md` and ~10:26 UTC `status.json`. The 7-day/30-day percentages and medians will drift; re-read before publishing if the date changes.
- The pricing page HTML is fresh (Context cache miss) but the `.md` endpoints sit behind Vercel’s edge cache with `age` ~35–40 h. The fresh HTML and the `.md` agree on every rate checked; the `.md` is still not a cache-bypass proof on its own.
- The `plans` page and `pricing`/`security` contradiction is recorded, not resolved by the vendor. I use the pricing/security statement (free on every account) because it is more specific, repeated and current; a future plans change could make the plans page right.
- The `no-card` verdict is a judgment: `partly` because a USDC purchase exists without a card but is not a free trial. A parent who reads the capability as “free trial without a card” may prefer `no`; the shortfall supports either.
- The Agents rates ($0.03/$0.01) come from the SDK type documentation, not a price page. They may be beta pricing and may change without a price-page edit.
- The `ssh` upgrade to `yes` relies on the editors page’s `Host *.runtime` / `ssh web.runtime` instructions. The transport is still Runtime’s API; a buyer who requires a public `host:22` will read it as `partly`. The capability’s plain text is about the **client**, so `yes` is the better fit.

**Delivery state:** scratchpad report only. No provider/feature/capability/pricing/docs/usecase/situation/changes/price-baseline/test files were edited. No commit, push, PR or deployment. The parent integrates.

---

## 10. Source index (all retrieved 12 November 2026)

**Vendor — pricing and included usage**

- https://withruntime.com/pricing (HTML, Context fresh; “Updated 2026-11-10”)
- https://withruntime.com/pricing.md
- https://withruntime.com/docs/pricing
- https://withruntime.com/docs/pricing.md
- https://withruntime.com/docs/included-usage
- https://withruntime.com/docs/included-usage.md
- https://withruntime.com/docs/plans
- https://withruntime.com/docs/plans.md
- https://withruntime.com/docs/reservations
- https://withruntime.com/docs/reservations.md
- https://withruntime.com/docs/referrals
- https://withruntime.com/docs/referrals.md
- https://withruntime.com/startups
- https://withruntime.com/pricing/agent-sandbox-price-index
- https://withruntime.com/pricing/agent-sandbox-price-index.md

**Vendor — docs, changelog, status, legal**

- https://withruntime.com/llms.txt
- https://withruntime.com/llms-full.txt
- https://withruntime.com/docs
- https://withruntime.com/docs/llms.txt
- https://withruntime.com/docs/start
- https://withruntime.com/docs/products
- https://withruntime.com/docs/sandbox-environment
- https://withruntime.com/docs/security
- https://withruntime.com/docs/networking
- https://withruntime.com/docs/storage
- https://withruntime.com/docs/jobs
- https://withruntime.com/docs/egress
- https://withruntime.com/docs/images
- https://withruntime.com/docs/editors
- https://withruntime.com/docs/limits
- https://withruntime.com/docs/mcp
- https://withruntime.com/docs/cli
- https://withruntime.com/docs/api
- https://withruntime.com/docs/javascript
- https://withruntime.com/docs/python
- https://withruntime.com/docs/go
- https://withruntime.com/docs/ruby
- https://withruntime.com/docs/java
- https://withruntime.com/docs/frameworks
- https://withruntime.com/docs/vercel-ai-sdk
- https://withruntime.com/docs/teams
- https://withruntime.com/docs/single-sign-on
- https://withruntime.com/docs/trust
- https://withruntime.com/docs/observability
- https://withruntime.com/docs/identity-tokens
- https://withruntime.com/docs/migrate
- https://withruntime.com/docs/versioning
- https://withruntime.com/docs/feedback-and-support
- https://withruntime.com/docs/speed
- https://withruntime.com/docs/changelog
- https://withruntime.com/changelog (dated entries, sitemap)
- https://withruntime.com/status
- https://withruntime.com/status.md
- https://withruntime.com/status.json
- https://withruntime.com/about
- https://withruntime.com/about.md
- https://withruntime.com/trust
- https://withruntime.com/sitemap.xml
- https://withruntime.com/legal/terms
- https://withruntime.com/legal/raw/terms
- https://withruntime.com/legal/sla
- https://withruntime.com/legal/raw/sla
- https://withruntime.com/legal/dpa
- https://withruntime.com/legal/raw/dpa
- https://withruntime.com/legal/privacy
- https://withruntime.com/legal/subprocessors
- https://withruntime.com/legal/raw/subprocessors
- https://withruntime.com/legal/acceptable-use
- https://withruntime.com/.well-known/security.txt

**Vendor — SDK / product surface**

- https://registry.npmjs.org/withruntime/latest
- https://registry.npmjs.org/withruntime
- https://unpkg.com/withruntime@0.50.0/dist/products/agents.d.ts
- https://unpkg.com/withruntime@0.50.0/dist/products/apps.d.ts
- https://unpkg.com/withruntime@0.50.0/dist/products/functions.d.ts
- https://unpkg.com/withruntime@0.50.0/dist/products/ci.d.ts
- https://unpkg.com/withruntime@0.50.0/dist/products/containers.d.ts
- https://unpkg.com/withruntime@0.50.0/dist/products/desktops.d.ts
- https://unpkg.com/withruntime@0.50.0/dist/products/browsers.d.ts
- https://unpkg.com/withruntime@0.50.0/dist/products/reservations.d.ts
- https://unpkg.com/withruntime@0.50.0/dist/products/referrals.d.ts
- https://unpkg.com/withruntime@0.50.0/dist/products/plans.d.ts
- https://unpkg.com/withruntime@0.50.0/dist/products/queues.d.ts
- https://unpkg.com/withruntime@0.50.0/dist/products/streams.d.ts
- https://unpkg.com/withruntime@0.50.0/dist/products/balancers.d.ts
- https://unpkg.com/withruntime@0.50.0/dist/products/uptime.d.ts
- https://unpkg.com/withruntime@0.50.0/dist/products/watch.d.ts
- https://unpkg.com/withruntime@0.50.0/dist/products/signed-requests.d.ts
- https://unpkg.com/withruntime@0.50.0/dist/products/private-network.d.ts
- https://unpkg.com/withruntime@0.50.0/dist/products/tailscale.d.ts
- https://unpkg.com/withruntime@0.50.0/dist/products/billing.d.ts
- https://api.withruntime.com/v1/openapi.json
- https://github.com/withruntime/runtime
- https://api.github.com/repos/withruntime/runtime
- https://api.github.com/orgs/withruntime

**Baseline and repo**

- `site/src/data/providers/runtime.json` (checked 2026-10-28)
- `site/src/data/pricing/runtime.json` (checked 2026-10-30)
- `site/src/data/capabilities.json` (78 rows, checked 2026-10-29)
- `site/src/data/features/*.json` (16 rows)
- `site/src/data/docs.json` (runtime entry)
- `site/src/data/usecases.json` (10 guides)
- `site/src/data/situations.json` (8 groups)
- `research/withruntime.md`
- `research/rates/runtime.json`
- `research/capabilities-NOTES-1..4`
- `site/scripts/price-baseline.json`
- `origin/main` `4432d00`

---

## 11. Bottom line

**Runtime’s sandbox prices did not move, but its front door did.** Since 10 November 2026 a new account must add at least **$10 of credit before its first sandbox runs**; the first $10 is matched, so it starts with $20 of usage. The old “100 free hours, no card, once in your first 30 days” is gone for new accounts. The **100 GiB-hours of memory and 25 vCPU-hours of active CPU still return every month**, but only after the account has paid. That is why `trials-free-tiers`, `free-tier` and `no-card` move from yes to partly, and why the profile’s “no card” claim and the old free-hours contradiction both need rewriting.

**Two more verdict changes are evidence corrections, not price changes.** Runtime now documents **standard OpenSSH** at `<id>.runtime` after a one-time config install, so `ssh` moves from partly to yes. It also sells a **private-beta hosted Agents** product that runs Claude Code, Codex or Gemini CLI in a sandbox per session from a prompt, so `prompt-api` and `built-in-agents` move from no to partly.

**The unit rates are untouched:** $0.025 per active vCPU-hour with a 50-millicore floor, $0.0075 per reserved GiB-hour, $0.08 per decimal GB per 30-day month for disk with the first 10 GiB of a running disk included, $0.02 per decimal GB of egress after 100 GiB, $5 per month for a dedicated IPv4 or a WireGuard tunnel. The A/B/C totals and the 70 cost tests stand; only the **eligibility** of the monthly allowance changed, not its size. The new **Agents** meter is separate: $0.03 per active vCPU-hour and $0.01 per GiB-hour.

**The public docs understate the product.** The about page says 20 products; the SDK also ships **Agents, Apps, Functions, CI/CD, Containers, standalone Desktops, Browsers, Reservations, Wallet accounts, Referrals, Startup hours, Queues, Streams, Balancers and Uptime**. Most are private beta or private until launch, refused with `product_in_beta` outside it, and absent from the price page. The guide should say “20 public products” and name the beta surface; it should not imply the 20 are everything.

**Two first-party contradictions are worth preserving.** The included-usage page and `llms.txt` still describe a never-paid account getting free usage once in its first 30 days, while the top of the same page and the pricing FAQ say pay first; the reconciliation is the 10 November date, which the API text does not state. And the status page says “No incidents recorded” while 4 November passed only **61.38%** of API checks — about 9.3 hours down, the worst day in the record. A buyer reading only the incident count will think November was clean.

**What to do next:** integrate the two feature rows and four capability rows, update the status figures and caveats, add the 12 November `changes.json` entry, fix the `claude-code-team` route (it says there is no Claude Code guide; there is), correct the “$0.03 an hour in CPU” phrasing in the situations picks (that is memory plus the floor), and decide whether to add a capability for CI/CD or app hosting. No push or deployment has been made; every push to `main` deploys botperch.com, so the owner’s approval still applies.

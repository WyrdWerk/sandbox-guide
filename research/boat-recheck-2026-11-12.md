# Boat recheck — 2026-11-12

Provider `boat` (https://boat.dev, docs https://docs.boat.dev). Baseline: `origin/main` **4432d00**, profile
`checkedOn` **2026-10-28**, rate card `checkedOn` **2026-10-30**. Desk research only: no account, credential,
sandbox, resume or billable resource. Nothing in the repo's data files was edited.

**Disclosure:** battleships.dev is built by the Boat team. It is cited only as a cross-check, never as the sole
source of a rate or verdict.

## Method and freshness

- Read `AGENTS.md`, `.agents/skills/maintaining-providers/SKILL.md`, `reference/provider-checklist.md`,
  `research/boat.md`, `research/rates/boat.json`, the four `research/capabilities-NOTES-*.md`, all 16
  `site/src/data/features/*.json` rows for Boat, all 78 `site/src/data/capabilities.json` rows, `docs.json`,
  `sources`, `usecases.json`, `situations.json`, `changes.json` and the price baseline.
- Enumerated **219** URLs from `https://docs.boat.dev/sitemap.xml` (100 guides + 119 API references) and fetched
  every page as Markdown with a cache-buster (`?x=<epoch>`) on **2026-11-12**. All 219 returned HTTP 200.
  Saved under `.amp/in/scratchpad/boat-pages/` for this thread; `boat-sitemap.txt` is the URL list.
- Checked every existing quote mechanically against **the page it cites** (not a pooled corpus):
  94 Boat rows (16 feature + 78 capability). **88 matched exactly**; 4 had been reworded
  (`files-survive-stop`, `cheap-pause`, `storage`, `snapshots-forks`), 1 is a quote-choice/contiguity issue
  (`ways-to-drive`), 1 is only curly-vs-straight quotes (`mount-buckets`). The other 88 rows' evidence is
  unchanged on the live page.
- Pricing was retrieved **fresh** with Context `web_scrape` and `maxAgeMs: 0`:
  `cache_metadata = {"status":"miss","age_ms":0}`, page `dateModified = 2026-11-09T06:58:40.483Z`.
  The same text was then read from a cache-busted `https://docs.boat.dev/pricing.md?x=<epoch>` and from the
  rendered page in Chromium; all three agreed on every rate. Limits, stop and data-retention were each checked with
  Context fresh plus a cache-busted `.md`; terms and privacy additionally in Chromium (Cloudflare challenge);
  status in Chromium because its numbers are computed client-side from JSON.
- `docs.boat.dev/<page>.md` was recorded on 2026-10-28 as sometimes serving an older revision through its cache.
  I kept the cache-buster on every fetch. On 2026-11-12, plain and `?x=<epoch>` responses were **byte-identical**
  for `pricing`, `limits` and `snapshots/stop` (checked with `cmp`), so the problem may be intermittent or fixed;
  every money/lifecycle quote still has a second route (Context fresh scrape or Chromium).
- Tools that actually succeeded: **Context.dev MCP** `web_scrape` (primary, fresh mode), **curl** of the
  provider's own `llms.txt`, `sitemap.xml`, `.md` pages and JSON feeds, **agent-browser** (Chromium) for
  `status.ascii.dev`, `boat.dev/terms`, `boat.dev/privacy`, the dashboard bundle and rendered cross-checks,
  and **Amp `read_web_page`** was not needed. **TinyFish** was not needed this pass (the prior thread used it
  for LinkedIn, which was not re-read). No Composio Parallel/Exa/Tavily/Firecrawl call was made because the
  provider's own Markdown index and the Context scrape covered every page; that is a deliberate route choice,
  not a failure.
- Third-party sources re-read: Y Combinator company page (founded/batch/team/location) and battleships.dev
  `boat.json` (dated 2026-09-30, disclosed as Boat-built). No other third party was needed.

## Bottom line

**No price changed.** Every Boat unit rate, plan price, included hour, snapshot fee, egress charge and trial
cap is the same on 2026-11-12 as on 2026-10-28/30. What changed is the **shape of the offer**: a stop now keeps
the machine — and usually its memory, processes, terminals and IP — for **ten minutes**, the disk is promised
for **at least** 14 days with the deletion job still **report-only in production**, and paid starts now run to
**6×** the hourly/daily limit (1,200 starts/day on the $20 plan) with an **invoice** option as well as the wallet.

Two capability verdicts move: `pause-memory` **no → partly** and `warm-pool` **no → partly**. One feature verdict
moves: `lifecycle` **no → partly**. `web-terminal` is recommended **not-published → partly** (terminal inside
the streamed desktop), but that is an inference from two pages rather than a single sentence, so it is flagged
for the integrator. The profile's "docs vs Terms, 14 vs 30 days" contradiction is **resolved** (Terms now say
14 days); its "three sizes" marketing contradiction is **resolved** (homepage now lists four); its "no pause at
all" one-liner and several shared feature sentences are now **stale**.

### Changes at a glance

| Row / field | Old | New | Evidence |
|---|---|---|---|
| `pause-memory` | `no` | **`partly`**, "10 min window" | stop: "A stop keeps the disk. A resume within 10 minutes usually gets the same machine back, with memory and running programs. Do not count on it." |
| `warm-pool` | `no` | **`partly`**, "Usually <1 s" | fail-fast: "These four calls put the sandbox on a machine that is already running and waiting:" / "They usually get a machine in less than one second." / "A burst can use all the ready machines of one size." |
| `lifecycle` feature | `no` | **`partly`**, "10 min, best effort" | same two pages + concepts table |
| `web-terminal` | `not-published` | **`partly`** (recommended, inference) | homepage: Ghostty preinstalled; desktop is browser-streamed |
| `files-survive-stop` | yes, "14 days" | yes, **"At least 14 days"** | stop/faq/pricing: "at least 14 days" |
| `cheap-pause` | yes, "nothing for 14 days" | yes, **"nothing while stopped"** | faq: "for free for at least 14 days" |
| `ssh` | yes, "Port 22" | yes, **"Port 22 or proxy"** | ssh-access: `sshEndpoint` when no public IPv4 |
| `tunnel` | yes, "ssh -L" | yes, **"boat forward"** | ssh-access: "Use `boat forward`…" |
| `agents-preinstalled` | yes, "7 harnesses" | yes, **"10 agents; 7 promptable"** | tools table lists Hermes, OpenClaw, Cursor CLI too |
| `big-machines` | yes, "16 cores / 32 GB" | yes, **"16 vCPU / 32 GB"** | machines: 16 vCPU, shared, "not dedicated physical cores" |
| `spend-cap` note | cap blocks new sandboxes | cap **stops** that member's org sandboxes | seats-and-limits: "boat snapshots and stops the member's organization sandboxes within about a minute" |
| `usage-alerts` note | no alerts | **no spend alert**, but 85%/95% disk emails + plan nudge | faq/limits: "boat emails you at 85% and at 95% disk use" |
| `audit-log` note | no audit feature | no **customer-facing** log; internal "Security audit events" kept | data-retention: "Security audit events." |
| `company` note | Founded 2026; 98.83–100%, 99.74% | **YC Founded 2024**; 99.45–100%, 99.84%; incidents feed | YC + history.json + incidents.json |
| profile caveat 2 | 14 days vs Terms ~30 days | **resolved** — both 14 days, report-only | terms/privacy/data-retention |
| profile caveat 3 | three sizes vs four | **resolved** — homepage lists four; memory wording remains | boat.dev transcript |
| `cost.A.flag` | 201–600 cost $22, 601 fails | **1,000 fits; 800 extra starts cost $50; 1,201 fails** | limits extra-starts table |
| `research/rates/boat.json` | 3× start ceiling | **6× hour/day, 3× minute; invoice option** | limits |

---

## 1. Features — current verdict, specifics, evidence, change

Legend: **Δ** = needs an edit; **=** = evidence re-read and still supports the row as written; **fix** = prose
correction outside the row itself (shared `idea`/`splits`/`turn`/situation/use-case).

### isolation — `yes` — **=** (one precision fix)

Full Ubuntu 24.04 VM per sandbox, own kernel, root/sudo, Docker, SSH/SCP, 60 fps desktop, nested `/dev/kvm`.
Host is dedicated to Boat; vCPUs are shared with other sandboxes and are not physical cores. Boat does **not
name its hypervisor**; the profile's "KVM virtual machine" is an inference, and the docs now name two CPU
models in the fleet.

- URL: https://docs.boat.dev/machines — quote: "Each sandbox is a full Linux virtual machine with its own kernel."
- URL: https://docs.boat.dev/security — quote: "Each sandbox is its own virtual machine, with its own kernel, disk and IP address."
- URL: https://docs.boat.dev/faq — quote: "Sandboxes run on physical hosts dedicated to boat. They share vCPUs with other sandboxes on the same host, so a busy host can make a run slower."
- URL: https://docs.boat.dev/machines/virtualization — quote: "The fleet includes AMD Ryzen 7 9700X and Ryzen 9 9950X hosts."
- URL: https://docs.boat.dev/security — quote: "Containers inside one sandbox share its kernel, so boat does not isolate them from each other."

**Fix:** profile `isolation` says "Full Ubuntu 24.04 KVM virtual machine". The docs never name KVM as Boat's
hypervisor; they say `/dev/kvm` is available *inside* for nested VMs and that CPU virtualisation extensions are
passed through. Change to "Full Ubuntu 24.04 virtual machine (hypervisor not named)" or tag KVM as `inferred`.
The capability `own-vm` is correctly `yes`.

### sizes-regions — `partly` — **Δ quote only**

Four fixed sizes, no custom size, no extra disk, no volumes; `small`/`default` 51 GB, `large` 111 GB,
`xlarge` 251 GB; 2/4/8/16 vCPU, 4/8/16/32 GB; all x86-64, no GPU, no ARM. `large` needs the first payment
(the trial cannot use it); `xlarge` needs the $100 plan. Regions: Germany, Finland, France; no region choice.

- URL: https://docs.boat.dev/machines — quote: "These four sizes are the only sizes. boat has no custom size and no size above `xlarge`."
- URL: https://docs.boat.dev/machines — quote: "`large` needs your first payment. The [free trial](https://docs.boat.dev/free-trial.md) cannot use it."
- URL: https://docs.boat.dev/pricing — quote: "`xlarge` needs the $100 plan or higher."
- URL: https://docs.boat.dev/compliance — quote: "Sandboxes run on machines in Germany, Finland and France."
- URL: https://docs.boat.dev/faq — quote: "You cannot pick a region."

**Δ:** the row's quote "| `xlarge` | **$0.200** | 16 vCPU | 32 GB | 251 GB |" is no longer exact — the live table
marks `xlarge` with `*` (the $100-plan footnote). Replace with the live row or the `machines` sentence.
**Fix:** the feature's shared split says "Boat attaches 51 GB to its smallest three sizes and 111 or 251 GB to
the larger ones." Only **two** sizes have 51 GB (`small`, `default`); `large` has 111 GB. Correct to
"`small` and `default` 51 GB, `large` 111 GB, `xlarge` 251 GB."

### lifecycle — `partly` (was `no`) — **Δ verdict, figure, quote, note, scenario turn**

There is still **no pause state**. But a stop now keeps the machine for **10 minutes, unbilled**; a plain
`boat resume` in that window "usually" takes back the same machine with **memory, running programs, open
terminals and the same IP**. Boat can release the machine early; after 10 minutes a resume always boots a new
machine from the disk with a new IP. The snapshot itself remains disk-only.

- URL: https://docs.boat.dev/snapshots/stop — quote: "There is no pause. A stop removes the virtual machine and keeps a copy of the disk."
- URL: https://docs.boat.dev/snapshots/stop — quote: "A stop keeps the disk. A resume within 10 minutes usually gets the same machine back, with memory and running programs. Do not count on it."
- URL: https://docs.boat.dev/snapshots/stop — quote: "Memory, running programs, open terminals and the IP address are then still there."
- URL: https://docs.boat.dev/snapshots/stop — quote: "boat can release the machine early. The resume then starts a new machine from the snapshot, like a reboot."
- URL: https://docs.boat.dev/concepts — quote: "Stop (disk kept, memory kept only for a resume within 10 minutes)"

**Recommended row:** verdict `partly`; figure "10 min, best effort"; scenario "Awake at 00:20, because the
10-minute window is best effort and counts from the stop, not from use: a resume inside it usually returns the
same machine with memory, terminals and IP; after it, a new machine and a fresh boot."; note "There is no pause,
but a stop keeps the machine for 10 minutes unbilled, so a quick resume usually keeps memory, running programs,
open terminals and the IP. Boat can release it sooner, and after 10 minutes the disk is all that survives."
Source quote: "A stop keeps the disk. A resume within 10 minutes usually gets the same machine back, with memory and running programs. Do not count on it."
The old "no pause at all" reading is no longer supported by the provider's own words; if the integrator prefers
to keep the feature `no` because there is no pause *verb*, the note must still say the 10-minute window exists,
and `pause-memory` should be `partly`. (Consistency with Sandboxer's `partly` for a 2-minute window favours
`partly` here.)

### snapshots-forks — `partly` — **Δ quote wording only**

Automatic snapshots every minute while running and once at stop; disk-only; **newest is used by resume/fork**,
older automatic snapshots are not restorable in place but can be listed and their files downloaded (usually
kept less than a day). Named "saved snapshots" never expire on a schedule, can be started from many times, and
can be shared across accounts. Fork of a running sandbox uses the last per-minute snapshot, so the last
minute can be missing; fork of a stopped sandbox is exact. A fork does not inherit the source's TTL (1 h
default).

- URL: https://docs.boat.dev/snapshots — quote: "boat saves the disk every minute while the sandbox runs."
- URL: https://docs.boat.dev/snapshots — quote: "Resume and fork always use the newest snapshot. You cannot go back to an older one."
- URL: https://docs.boat.dev/snapshots/resume-and-fork — quote: "A fork of a **running** sandbox uses its last background snapshot. boat takes one each minute. Writes from the last minute or so can be missing from the fork."
- URL: https://docs.boat.dev/snapshots/templates — quote: "A saved snapshot does not expire."
- URL: https://docs.boat.dev/snapshots/download-and-delete — quote: "You can read the files of a snapshot without starting the sandbox. The sandbox can be stopped."

**Δ:** the row quote "Resume and fork always use the newest snapshot. You cannot go back to an older one." is
now "… **You cannot resume or fork an older snapshot.** There is no point-in-time restore." (meaning unchanged;
update quote). **Fix:** the shared line "only the newest is usable" / "Whether you can choose an older
snapshot; Boat cannot" is true for *restore*, but Boat now lets you **download files** from an older automatic
snapshot while it is still in the list (usually < 1 day) and from any saved snapshot. Say "you cannot restore an
older point in place; you can pull files from an older saved snapshot, or from an older automatic one while it
is still listed."

### storage — `partly` — **Δ quote, note, shortfall**

Whole disk persists, including `/var/lib`, `/etc`, `/usr`, `/opt`, `/root`, `/srv`, `/var`; `/tmp`, `~/.cache`
(except Playwright/Deno), journal, Docker build cache and untagged images do not. 51/51/111/251 GB, no volume
product. A stopped disk is now promised for **at least 14 days**; after that it is *eligible* for automated
retention cleanup, but **the job is report-only in production today** ("The 14-day rule does not yet trigger
deletion there"). The Terms and Privacy Policy now say the same 14 days and the same report-only caveat. A
saved snapshot has no scheduled expiry; unpaid extras can be deleted 7 days after the wallet is empty.

- URL: https://docs.boat.dev/snapshots/stop — quote: "boat keeps the disk of a stopped sandbox for at least 14 days."
- URL: https://docs.boat.dev/data-retention — quote: "The retention cleanup runs automatically when enabled. It currently reports eligible stopped sandboxes without deleting them in production. The 14-day rule does not yet trigger deletion there."
- URL: https://boat.dev/terms — quote: "Data from a stopped sandbox is eligible for automated retention cleanup 14 days after the stop. That job currently reports candidates without deleting them in production."
- URL: https://boat.dev/privacy — quote: "Data from a stopped sandbox is eligible for automated retention cleanup after 14 days. That job currently reports candidates without deleting them in production."

**Δ:** row quote "boat keeps the disk for 14 days after the stop" is now "… for at least 14 days …". Figure
"14 days after stop" → "At least 14 days". Shortfall "The disk is deleted 14 days after a stop unless you saved
it" → "After 14 days the disk is eligible for cleanup; in production the job only reports candidates today, so
nothing is deleted at day 14 yet. A saved snapshot is the only durable copy." **Fix:** the shared storage split
"Boat keeps a stopped sandbox's disk for 14 days, then deletes it" and the scenario turn "a 14-day window turns a
long weekend into data loss" need the same "at least / not yet deleting" nuance. The Terms' old "approximately
30 days" sentence is gone, so the profile's docs-vs-Terms contradiction is **resolved**.

### idle-timers — `partly` — **=** (prose nuance)

No idle detection. A hard auto-stop counts from **create or last resume**, default **1 hour**, maximum
**30 days**, or off; a running agent prompt pushes the deadline one TTL later, ordinary work does not. Trial:
mandatory 2 h maximum. `boat extend --hours N` sets now+N. A stopped sandbox has **no wake-on-request path**;
you call resume.

- URL: https://docs.boat.dev/long-running-tasks/auto-stop — quote: "The timer counts from creation or from the last resume, not from your last activity."
- URL: https://docs.boat.dev/long-running-tasks/auto-stop — quote: "The default is 1 hour. The maximum is 30 days, or no auto-stop at all."
- URL: https://docs.boat.dev/long-running-tasks/auto-stop — quote: "When the deadline comes while a prompt runs or waits, boat moves the deadline to one TTL later."
- URL: https://docs.boat.dev/faq — quote: "boat has no idle timer."

**Fix:** the shared split says "Boat cannot wake on a URL at all, because a stop destroyed the machine." For
10 minutes the machine is not destroyed; say "because a stop has no wake path — the URL does not resume a
stopped sandbox, whether the machine is still held or not." Also "Boat charges nothing while stopped and keeps
the disk for 14 days" → "at least 14 days".

### reaching-it — `partly` — **=** (specifics richer)

HTTPS per port on `*.on.boat.dev`, up to **50 ports**, token (`?_token=`) by default, `--public` removes it;
anyone with the full URL gets in, no Boat login. The URL and token survive stop/resume; the app must be
restarted. SSH is a real port: `machineIp:22` when the sandbox has a public IPv4, otherwise the API returns
`sshEndpoint` (`host:port`). `boat forward` is a documented local/remote TCP tunnel (reconnects, `--reverse`,
bind address). Raw TCP/UDP: open the port in the sandbox firewall and connect to the sandbox IP; some sandboxes
have **only IPv6**, so only IPv6 clients reach a raw port there; `boat host <port> --public` also opens the TCP
port and reopens it after a resume. Custom domains are not supported.

- URL: https://docs.boat.dev/hosting — quote: "Anyone who has the full URL with `_token` can open it."
- URL: https://docs.boat.dev/hosting — quote: "| Ports per sandbox | Up to 50 |"
- URL: https://docs.boat.dev/hosting — quote: "After a stop and resume | The URL stays the same. Start your app again."
- URL: https://docs.boat.dev/ssh-access — quote: "Connect to `sshEndpoint` when it is set. Else connect to `machineIp` on port 22."
- URL: https://docs.boat.dev/ssh-access — quote: "Use `boat forward` to reach a port of the sandbox on your own computer. Nothing becomes public."
- URL: https://docs.boat.dev/hosting — quote: "Some sandboxes have no public IPv4 address. Then `boat info` shows `sshEndpoint`, and `ip` is an IPv6 address. Only clients with IPv6 can reach a raw port there."
- URL: https://docs.boat.dev/hosting — quote: "boat does not support custom domains."

**Fix:** profile note "SSH on port 22" → "SSH on port 22 when the sandbox has a public IPv4; otherwise an
`sshEndpoint` host:port". Add `boat forward` as the tunnel. The `raw-tcp` capability's figure "IPv6 only
sometimes" is right; its note should add the `--public` TCP behaviour.

### custom-domains — `no` — **=**

Explicitly unsupported. A CNAME to `on.boat.dev` does not work because Boat routes and issues TLS only for
`on.boat.dev`; an A record to the sandbox IP breaks at the next resume because the IP changes. A reverse proxy
or CDN in front is the documented workaround.

- URL: https://docs.boat.dev/hosting — quote: "boat does not support custom domains."
- URL: https://docs.boat.dev/hosting — quote: "A CNAME record to an `on.boat.dev` name does not work. boat routes and issues TLS certificates only for `on.boat.dev` names."
- URL: https://docs.boat.dev/hosting — quote: "An A record to the sandbox IP address breaks at the next resume, because the IP address changes."

**Fix (minor):** the row shortfall says "a redirect from your domain to the provider's name does not work
either." A **reverse proxy** does work; only a CNAME/redirect does not. Say "a CNAME or redirect does not work;
you must run a proxy or CDN in front."

### outbound-network — `partly` — **=** (new tunnel constraint)

Outbound open by default. **No API for network rules**; `ufw`/`iptables` inside the sandbox, as root, is the
control; snapshots do not keep rules. Egress is **not billed**, no cap published. No static egress IP published.
New in the docs: Boat itself reaches the sandbox through **inbound TCP 8911** and an **outbound WireGuard**
tunnel that carries public URLs and the agent. Blocking all outbound for `user` breaks public URLs; the
documented recipe blocks a separate Linux account (or allows the tunnel endpoint first).

- URL: https://docs.boat.dev/hosting/firewall — quote: "boat has no API setting for network rules."
- URL: https://docs.boat.dev/hosting/firewall — quote: "Snapshots do not keep firewall rules."
- URL: https://docs.boat.dev/hosting/firewall — quote: "boat reaches the sandbox in two ways. A rule that blocks either one marks the sandbox degraded."
- URL: https://docs.boat.dev/hosting/firewall — quote: "Do not block all outbound traffic for `user`."
- URL: https://docs.boat.dev/pricing — quote: "Network traffic. boat does not bill egress."

**Fix:** profile note "Outbound is open by default … ufw inside the sandbox is the control" should add "public
URLs ride an outbound WireGuard tunnel; the documented no-internet recipe blocks a separate account, not
`user`." The `no-internet` and `egress-allowlist` verdicts stay `partly`; the shortfalls should mention the
tunnel constraint and that rules are lost on restore.

### keys-secrets — `yes` — **=** (expanded)

Environment variables and secret files, versioned per environment, injected at start; **Safe for third
parties** withholds every one of yours (variables, files, GitHub, credentials, setup scripts); **AI credentials
proxy** gives sandboxes placeholder model keys while the real key stays with Boat; **scoped API keys** with
action sets, sandbox/environment sets and expiry. New depth: **credential profiles** (named sets of AI
credentials, several accounts per provider, custom APIs, usage, block/unblock), and org environment/profile
access lists.

- URL: https://docs.boat.dev/environments/secrets — quote: "boat injects two types of secret when a sandbox starts."
- URL: https://docs.boat.dev/environments — quote: "Nothing of yours: no variables, no secret files, no GitHub, no credentials, no repository setup scripts"
- URL: https://docs.boat.dev/ai-credentials — quote: "With the AI credentials proxy on, a sandbox gets placeholder keys, and the real keys stay with boat."
- URL: https://docs.boat.dev/ai-credentials — quote: "A placeholder is worthless outside boat. It does not contain the real key."
- URL: https://docs.boat.dev/api-keys/scopes — quote: "boat grants a request only when **both** of these are true"

**Fix (minor):** the row figure "No, proxy + switch" answers a figure label; keep. Add "credential profiles,
several accounts per provider, custom APIs" to the note; the proxy now covers more than model keys but still
only AI credentials, so `hidden-secrets` stays `partly`.

### ways-to-drive — `yes` — **=** (broader)

CLI (`boat`, one installer for macOS/Linux/Windows), REST API (`https://boat.dev/api/v1`, OpenAPI file),
Python SDK (`boat-sdk`), TypeScript SDK (`@boatdev/sdk`), SSH/SCP, a 60 fps desktop, a browser-only Chrome view,
and a dashboard. **MCP is documentation-only** (`https://docs.boat.dev/mcp`); there is no control-plane MCP
server. New since the last check: `boat forward` port forwarding, `boat run` one-job create/copy/run/cost/delete,
signed file upload/download URLs (15 min, up to 1 h), GitHub Actions runners (`runs-on: boat`, `boat ci`), and an
official skill pack for coding agents.

- URL: https://docs.boat.dev/sdks/overview — quote: "Each SDK covers the full [HTTP API](https://docs.boat.dev/api/v1.md): sandboxes, commands, files, public URLs, snapshots, saved snapshots, environments, integrated agents, webhooks and API keys."
- URL: https://docs.boat.dev/quickstart — quote: "Install the boat CLI on macOS, Linux or Windows"
- URL: https://docs.boat.dev/ai-tools — quote: "the boat CLI, the docs MCP server, llms.txt, skills"
- URL: https://docs.boat.dev/ssh-access — quote: "Use `boat forward` to reach a port of the sandbox on your own computer."
- URL: https://docs.boat.dev/ci — quote: "Each job gets a fresh sandbox, billed per second, deleted when the job ends."

**Δ quote:** the row's quote "`boat new`, then `boat prompt bx_23456789 \"add tests\"`" is no longer contiguous
on the quickstart (it was split when the agent section was rewritten). Replace with
"`boat new` prints the id of the sandbox" or "Install the boat CLI on macOS, Linux or Windows". **Note:** add
`boat forward`, `boat run`, signed file URLs, CI runners; keep "the MCP server is documentation-only".

### built-in-agents — `yes` — **=** (ten CLIs, seven promptable)

Seven harnesses are installed **and promptable by name** through `boat prompt` / `POST /prompt`: Claude Code,
Codex, pi, OpenCode, Prime Agent, Kimi Code, Mistral Vibe. Three more agent CLIs are installed but not on the
seven-harness prompt list: **Hermes**, **OpenClaw**, **Cursor CLI** (`agent`/`cursor-agent`). One API call queues
a prompt with steering, interrupts, parallel conversations, an event stream, model/harness switching mid-thread,
and a `computer` MCP server exposing the desktop to all seven. Conversations survive a stop (session files are
on the disk) and can be resumed with `boat prompt --resume <id>`.

- URL: https://docs.boat.dev/integrated-agents — quote: "Every sandbox has seven coding-agent harnesses, installed and ready: **Claude Code, Codex, pi, OpenCode, Prime Agent, Kimi Code, and Mistral Vibe**."
- URL: https://docs.boat.dev/machines/tools — quote: "| `hermes` | Hermes Agent by Nous Research. Browser tools are not pre-installed: `hermes` offers to add them. |"
- URL: https://docs.boat.dev/machines/tools — quote: "| `openclaw` | OpenClaw CLI. The gateway does not start by itself: run `openclaw gateway`. |"
- URL: https://docs.boat.dev/machines/tools — quote: "| `agent` / `cursor-agent` | Cursor CLI agent |"
- URL: https://docs.boat.dev/integrated-agents/conversations — quote: "A resumed or forked sandbox gets them back. So `--resume <id>` continues with full memory."
- URL: https://docs.boat.dev/api/reference/agent/prompt-sandbox-agent — quote: "Queue a natural-language work item for an agent harness"

**Δ note:** "Seven harnesses preinstalled" is right for the promptable set but understates the image: ten
agent CLIs are installed (the seven plus Hermes, OpenClaw, Cursor). Add conversation resume and harness/model
switching.

### teams-accounts — `partly` — **=** (more surfaces)

Organisations with owner/admin/member roles, email invites, **one plan and one wallet**, **seats** at the plan
price (each seat adds included time; full limits on $2000, 20% below; grandfathered pre-2026-10-28 seats),
**shared sandboxes** (org-paid sandboxes visible to every member; shared unless the creator made them private or
they hold personal logins), **shared environments and credential profiles** with owner/admin access lists,
per-member **usage cap** and **concurrency cap** (the only spend caps; a personal account has none), scoped API
keys, and wallet switching. Still no SSO/SAML/OIDC, no customer-facing audit log, and no usage/spend alert you
can set.

- URL: https://docs.boat.dev/organizations — quote: "It has one plan, one wallet, and members who run sandboxes on it."
- URL: https://docs.boat.dev/organizations — quote: "**One seat costs the plan price.** A 5-seat organization on the $20 plan pays $100 a month."
- URL: https://docs.boat.dev/organizations/seats-and-limits — quote: "The included time, start-rate and concurrency numbers of the plan are **one shared pool for the whole organization**."
- URL: https://docs.boat.dev/organizations/seats-and-limits — quote: "Both caps are unlimited by default."
- URL: https://docs.boat.dev/organizations — quote: "Every member uses them, unless an owner or admin [limits who can use them](#limit-who-can-use-an-environment-or-profile)."
- URL: https://docs.boat.dev/organizations — quote: "The owner invites people by email."

**Δ note:** add shared sandboxes, environment/profile access lists, seats (20%/full), and that a member cap
stops that member's running org sandboxes within about a minute, not just new ones. `sso` stays `not-published`,
`audit-log` stays `not-published`, `usage-alerts` stays `not-published` (no spend threshold; see capability).

### billing-models — `partly` — **Δ note only; no rate change**

Flat hourly rate per fixed size, billed **per second** while the sandbox runs, from `provisioned` (not
`provisioning`) until `stopping`; stopped = **no machine time**. A **$20/month minimum plan** whose dollars come
back as VM time; unused included time expires monthly. One dollar **wallet** pays overage, extra saved snapshots,
paid starts and the AI proxy; the wallet does not expire and never pays the plan. Egress **$0**. Automatic
snapshots free. Saved snapshots **$0.056/day** above the included count. New: wallet can go **negative for a
24-hour grace period** before sandboxes stop; **extra starts on invoice** as an alternative to the wallet.

- URL: https://docs.boat.dev/pricing — quote: "You pay per second, only while a sandbox runs. A stopped sandbox costs no machine time."
- URL: https://docs.boat.dev/pricing — quote: "A plan is a monthly price that your card pays. **It is not a fee.** Every dollar comes back as VM time at the rates above."
- URL: https://docs.boat.dev/billing — quote: "You get a **24-hour grace period**."
- URL: https://docs.boat.dev/billing — quote: "During the grace period, the wallet goes below zero"
- URL: https://docs.boat.dev/limits — quote: "| Up to 6 times | $0.07 | 401 to 1,200 |"

**Fix:** "the disk is kept 14 days" → "at least 14 days (cleanup report-only today)"; "paid starts" → up to
**6×** hour/day (3× minute), **$0.03/$0.05/$0.07**, or on invoice with **$80/$400/$1,500 per seat/month** caps;
add the 24-hour negative-wallet grace and the per-sandbox usage/cost API.

### trials-free-tiers — `partly` — **=** (more restrictions)

7-day trial, card at Stripe Checkout, **25 h** total compute, **2** sandboxes at once, starts **5/min · 25/h ·
75/day**, mandatory auto-stop **≤2 h**, sizes **`small`/`default`** only, **no new saved snapshots**, then the
chosen plan charges. No free tier. One trial per person/identity; **organizations get no trial**; an org plan is
paid from day one. Cancelling the trial in the dashboard ends it with no charge; cancelling in the Stripe portal
runs it to the end date. `trial_blocked` if the identity looks like a repeat sign-up.

- URL: https://docs.boat.dev/free-trial — quote: "There is no free tier. Your first plan starts with a free 7-day trial, and checkout asks for a card."
- URL: https://docs.boat.dev/free-trial — quote: "25 hours in total, all sandboxes together"
- URL: https://docs.boat.dev/free-trial — quote: "| Sizes | `small` and `default` | All sizes. `xlarge` needs the $100 plan or higher. |"
- URL: https://docs.boat.dev/free-trial — quote: "Organizations get no trial. An organization plan is paid from the first day."
- URL: https://docs.boat.dev/free-trial — quote: "A person gets one trial."

**Δ note:** add "organizations get no trial", "one trial per person", "no saved snapshots", "large blocked".
The trial cannot test an always-on agent (2 h auto-stop) — already in the shared idea; keep.

### company — `partly` — **Δ note (founded date, status numbers, incidents feed)**

Contracting entity **Dedale AI, Corp.**, a Delaware corporation, Dover mailing address, Delaware law and
arbitration; `boat`, `Ascii` and the sandbox marks are owned by Dedale. **YC Fall 2026**, **founded 2024** per
YC (the prior pass recorded the founders saying they started Ascii in 2025 — LinkedIn, not re-read today; a
launch tracker dates box to July 2026, while Boat's own dashboard metrics date its launch week to 18 May 2026;
box became boat on 15 September 2026), **3 people**, Paris. Reported **$500k pre-seed** from Entrepreneur First
and Founders, Inc. (Nordic9, prior pass; not re-read today); no priced round published. **No SLA**; Terms disclaim uptime and availability; liability capped at the greater
of $100 or 3 months' payments. **SOC 2 in progress**, no report; no ISO 27001, HIPAA/BAA, SSO or audit log
published. **DPA** by email to support@ascii.dev. Support is email + Discord; status at `status.ascii.dev`.
Closing the account cancels **immediately**, forfeits remaining included time and wallet; 30-day reopen window;
GDPR erasure immediate and irreversible. Terms may change limits/features/pricing **for future use** with no
notice period. **battleships.dev is built by the Boat team** (disclose when cited).

- URL: https://boat.dev/terms — quote: "boat is provided by Dedale AI, Corp., a Delaware corporation."
- URL: https://boat.dev/terms — quote: "We do not guarantee that sandbox will be uninterrupted"
- URL: https://www.ycombinator.com/companies/boat — quote: "Founded:2024  Batch:Fall 2026  Team Size:3  Status:  Active  Location:Paris, France"
- URL: https://docs.boat.dev/security — quote: "SOC 2 in progress."
- URL: https://docs.boat.dev/compliance — quote: "Sandboxes have an uptime of 99.95%. boat measures this over the history of all sandboxes."
- URL: https://status.ascii.dev/history.json — quote: "\"windowDays\": 90, \"blockHours\": 1"
- URL: https://status.ascii.dev/incidents.json — quote: "\"retentionDays\": 90"
- URL: https://docs.boat.dev/data-retention/close-account — quote: "It cancels your subscription **immediately**, not at the end of the period. You lose the remaining included time and the money in your wallet."

**Δ note:** change "Founded 2026" → **"YC lists it as founded 2024; the prior pass recorded the founders
saying they started Ascii in 2025 (LinkedIn, not re-read today)"**; update the 90-day status range/pooled figure; add the incidents feed; add "3 people, Paris"; add
"organizations get no trial" if relevant. The verdict stays `partly` (entity + no SLA + no certification).

**Status detail (computed 2026-11-12 from `history.json`, 2026-08-15 → 2026-11-12, page's own method
`1 − red badSeconds / observed seconds`; orange "degraded" seconds are not counted, matching the page):**

JSON names are `Ascii API` / `Box …`; the rendered page renames them `Boat API` / `Sandbox …`. The rows below use
the JSON names so they can be matched to the feed; map them 1:1 when editing the site.

| Component | Observed h | Red s | 90-day uptime |
|---|---:|---:|---:|
| Ascii API | 2,147 | 1,007 | 99.99% |
| Box Creation | 2,147 | 12,856 | 99.83% |
| Box SSH | 2,144 | 0 | 100.00% |
| Box Desktop Streaming | 2,145 | 1,798 | 99.98% |
| Box Stop + Resume | 742 | 12,856 | 99.52% |
| Box Stop + Resume (extreme edge cases suite) | 2,147 | 120,387 | 98.44% (internal, not customer) |
| Box Fork | 2,147 | 42,462 | 99.45% |
| Box Dashboard | 2,147 | 7,123 | 99.91% |

Customer-facing range **99.45%–100.00%**, pooled **99.84%** (21.7 bad hours / 13,619 observed hours). Lowest is
**Box Fork**, not Stop + Resume; Stop + Resume covers 742/2,147 = **34.6%** of the window. By the cruder
"a red hour is a whole hour down" method the range is **99.12%–100%**, pooled **99.72%**; the page's own
displayed 14-day figures are **99.64%–100%** (Creation and Stop + Resume 99.64%, Fork 99.83%, Dashboard 99.77%,
API 99.91%). Use the page-method numbers and say which method.

**Incidents feed:** `status.ascii.dev/incidents.json` now returns **315 dated component entries** (90-day
retention, generated 2026-11-12T09:59Z): **215 customer-facing** (182 degraded, **33 outage**) and 100 from the
internal extreme-edge suite. Union of customer-facing windows: **87.2 h** across **172 windows** in 90 days;
outage union **25.2 h** across 31 windows. Since 2026-10-29: **43 entries**, union **7.7 h** across 31 windows.
By component: Fork 102 entries / 58.1 h (max 119 min), Creation 41 / 18.2 h, Desktop 27 / 11.5 h, Dashboard 31 /
3.8 h, API 14 / 5.8 h. The page's `script.js` does **not** fetch this feed and renders no prose list, so
"no incident history is published" is wrong as written but right about the *rendered page*. Reword to: "The
status page renders uptime bars and metrics, not a dated incident list; a separate `incidents.json` feed
publishes 315 probe entries over 90 days (33 outages)."

---

## 2. Capabilities — 78 rows

Format: **id — verdict — figure/specifics** — cited URL — verbatim quote — disposition.
`=` re-read and the row stands (quote still on its own page). `Δ` needs an edit; the reason follows.
Every quote below was matched against **its own cited page** on 2026-11-12, not a pooled corpus.

### Isolation (5)

- **own-vm — yes — "full VM, own kernel"** — https://docs.boat.dev/machines — "Each sandbox is a full Linux virtual machine with its own kernel." — **=**
- **root — yes — "passwordless sudo"** — https://docs.boat.dev/machines — "Passwordless `sudo` gives full root." — **=**
- **docker-inside — yes — "Docker, Compose, BuildKit"** — https://docs.boat.dev/machines — "Docker with BuildKit and Compose, on the sandbox's own kernel." — **=**
- **nested-virt — yes — "/dev/kvm, no flag"** — https://docs.boat.dev/machines/virtualization — "Every sandbox has nested virtualization." — **=** (add: `/dev/kvm` is there; QEMU/KVM, Firecracker, Android emulator run)
- **custom-image — no — "one image for everyone"** — https://docs.boat.dev/faq — "No. boat has no custom image and no Dockerfile build." — **=** (note: you can still run your own **Docker** image *inside* the sandbox; the shortfall is about the VM image/OCI boot image)

### Sizes and regions (6)

- **any-size — no — "4 fixed sizes"** — https://docs.boat.dev/machines — "These four sizes are the only sizes. boat has no custom size and no size above `xlarge`." — **=**
- **big-machines — yes — "16 vCPU / 32 GB"** (was "16 cores / 32 GB") — https://docs.boat.dev/pricing — "| `xlarge` * | **$0.200** | 16 vCPU | 32 GB | 251 GB |" — **Δ figure unit** (`vCPU`, not cores; they are shared vCPUs, "not dedicated physical cores", per machines/virtualization). Note "$100-a-month plan" is correct.
- **live-resize — no — "stop first"** — https://docs.boat.dev/machines — "To change the size, stop the sandbox, then resume it with `--type`." — **=**
- **gpu — no — "no GPU"** — https://docs.boat.dev/machines — "No size has a GPU." — **=**
- **choose-region — no — "no region choice"** — https://docs.boat.dev/compliance — "Sandboxes run on machines in Germany, Finland and France." — **=** (inferred: no region option in CLI/API; YC says "more regions are coming" — future, not a choice)
- **eu-region — yes — "Germany, Finland, France"** — https://docs.boat.dev/compliance — "Sandboxes run on machines in Germany, Finland and France." — **=** (note: "Snapshot copies can be stored outside the EU." — compute is EU, copies are not guaranteed EU; see contradiction 4)

### Lifecycle (3)

- **pause-memory — partly — "10 min window"** (was `no`, figure empty) — https://docs.boat.dev/snapshots/stop — "A plain `boat resume` in those 10 minutes usually takes back the same machine, with no restore." — **Δ verdict, figure, shortfall.** Shortfall: "There is no pause state. A stop keeps the machine for 10 minutes unbilled, so a quick resume usually returns memory and running programs; boat can release it early, and after 10 minutes it boots fresh from the disk." Supporting quote: "Memory, running programs, open terminals and the IP address are then still there."
- **warm-pool — partly — "Usually <1 s"** (was `no`, note "No pool of pre-started machines.") — https://docs.boat.dev/machines/fail-fast — "These four calls put the sandbox on a machine that is already running and waiting:" — **Δ verdict, figure, shortfall.** The four calls are create, deploy from a saved snapshot, fork, resume; "They usually get a machine in less than one second." But "A burst can use all the ready machines of one size. Then the next calls wait while boat builds new machines." The pool is real and pre-warmed, but not sized or guaranteed by the customer — the same `partly` calibration as Sandboxer's provider-kept pool. Shortfall: "The ready pool is not sized or guaranteed: a burst can exhaust a size, and the next calls wait for a new machine to boot."
- **fast-start — no — "A few seconds"** — https://docs.boat.dev/readiness — "A resume, a fork or a deploy is ready in **a few seconds, whatever the size of the disk**." — **=** but **Δ note**: the *machine* is usually assigned in **under one second** (fail-fast page), and status metrics show create→running avg ~1 s; "ready" (environment applied, commands work) is a few seconds. Keep `no`; distinguish assignment from readiness.

### Snapshots and forks (6)

- **snapshot-files — yes — "Every minute"** — https://docs.boat.dev/snapshots/resume-and-fork — "Every stop makes the snapshot that a resume needs: `boat stop`, auto-stop, and a stop for an empty wallet." — **=** (also every minute while running, from snapshots page)
- **snapshot-memory — no — ""** — https://docs.boat.dev/snapshots — "Memory and running programs are not in a snapshot." — **=** (a **resume** within 10 min can keep them because the machine is held, not because the snapshot has them; keep the distinction in the note)
- **fork-running — yes — ""** — https://docs.boat.dev/snapshots/resume-and-fork — "A fork copies a sandbox into a new sandbox. The source keeps running, and boat does not change it." — **=** (shortfall: "The copy has the same files, but nothing that was running keeps running." Still true: the fork boots cold. Add: a fork of a running source can miss writes from the last minute.)
- **older-snapshot — partly — ""** — https://docs.boat.dev/snapshots/resume-and-fork — "Resume and fork always use the newest snapshot. **You cannot resume or fork an older snapshot.** There is no point-in-time restore." — **=** (note: older automatic snapshots stay listable "usually less than a day" and their files can be **downloaded** without resuming, so this is no longer "newest only" for file recovery, only for restore)
- **templates — yes — ""** — https://docs.boat.dev/snapshots/templates — "Use a saved snapshot as a template: install your tools one time, then start many sandboxes from it." — **=**
- **backups — partly — "Every minute"** — https://docs.boat.dev/snapshots/templates — "boat, every minute and at each stop" — **=** (same host/cluster, newest only, at least 14 days; not disaster recovery)

### Storage (5)

- **files-survive-stop — yes — "At least 14 days"** (was "14 days") — https://docs.boat.dev/snapshots/resume-and-fork — "boat keeps the snapshot of a stopped sandbox for at least 14 days." — **Δ quote, figure, shortfall.** Shortfall: "After 14 days the disk is eligible for automated cleanup; in production that job only reports candidates today, so nothing is deleted at day 14 yet. A saved snapshot is the only durable copy." (Also `boat snapshot pull` can export files without resuming.)
- **volumes — no — ""** — https://docs.boat.dev/snapshots/templates — "A saved snapshot is a copy of a sandbox disk that you save under a name." — **=** (no separate volume product; Docker named volumes live on the one disk)
- **shared-volume — no — ""** — https://docs.boat.dev/snapshots/templates — same — **=** (no disk attaches to two machines; forks/saved snapshots are copies)
- **mount-buckets — no — ""** — https://docs.boat.dev/machines — "\"Disk\" is the maximum size of your own files." — **=** but **Δ note**: no *managed* mount; root + FUSE means you can install `s3fs`/`rclone` yourself. Say "no managed bucket mount; you can install a FUSE client."
- **big-disk — yes — "251 GB"** — https://docs.boat.dev/machines — "251 GB" — **=**

### Idle timers (4)

- **stay-on — yes — ""** — https://docs.boat.dev/snapshots/resume-and-fork — "boat resume bx_f7k2q9hd --no-auto-stop    # runs until you stop it" — **=** (no maximum lifetime once auto-stop is off; trial still caps 2 h)
- **choose-idle — partly — "1 h from start"** — https://docs.boat.dev/long-running-tasks/auto-stop — "Each resume sets the deadline again." — **=** (TTL from create/resume, not activity; 1 h default, 30 d max; prompt extends one TTL)
- **wake-on-request — no — ""** — https://docs.boat.dev/snapshots/stop — "There is no pause. A stop removes the virtual machine and keeps a copy of the disk." — **=** (no URL/HTTP wake path; you call resume; the 10-min same-machine window does not change this)
- **schedules — no — ""** — https://docs.boat.dev/snapshots/resume-and-fork — "For example, save one each day from cron:" — **=** (no provider scheduler; cron inside a running machine or an external trigger)

### Reaching it (6)

- **public-url — yes — "Up to 50 ports"** — https://docs.boat.dev/hosting — "| Ports per sandbox | Up to 50 |" — **=**
- **private-url — yes — "Token in link"** — https://docs.boat.dev/hosting — "A new URL is protected by default and includes a `_token` query parameter" — **=**
- **ssh — yes — "Port 22 or proxy"** (was "Port 22") — https://docs.boat.dev/ssh-access — "Connect to `sshEndpoint` when it is set. Else connect to `machineIp` on port 22." — **Δ figure/note.** When the sandbox has no public IPv4, SSH is a provider `sshEndpoint` (`host:port`), not port 22.
- **web-terminal — partly — "In the desktop"** (was `not-published`) — https://boat.dev/ — "Docker, VS Code, Chrome, Ghostty, the GitHub CLI, Rust, Node.js, and Bun come pre-installed." — **Δ verdict (recommended, inference).** There is no dedicated web terminal, but the browser-streamed Linux desktop has Ghostty (a terminal emulator) preinstalled; desktop-streaming says the desktop is for "Control GUI tools that are hard to use over SSH." Shortfall: "No dedicated browser terminal; you open the streamed desktop and use its terminal app. The docs never say 'terminal' in the browser." If the integrator wants only explicitly documented browser terminals, keep `not-published` — but then fix the profile's usability line that says the desktop has "a terminal".
- **tunnel — yes — "boat forward"** (was "ssh -L") — https://docs.boat.dev/ssh-access — "Use `boat forward` to reach a port of the sandbox on your own computer. Nothing becomes public." — **Δ figure/note.** Supports `--remote`, `--local`, `--reverse`, `--bind` (default 127.0.0.1), reconnects after a network drop; `ssh -L` also works.
- **raw-tcp — yes — "IPv6 only sometimes"** — https://docs.boat.dev/hosting — "The public URL carries HTTPS and WebSockets only. For another protocol, open the port in the sandbox firewall and connect to the sandbox IP address." — **=** but **Δ note**: `boat host <port> --public` also opens that TCP port on the IP and reopens it after a resume; some sandboxes have no public IPv4, so only IPv6 clients reach it.

### Custom domains (2)

- **custom-domain — no — ""** — https://docs.boat.dev/hosting — "boat does not support custom domains." — **=**
- **auto-https — no — ""** — https://docs.boat.dev/hosting — "boat does not support custom domains." — **=** (no domain of yours to certify; `on.boat.dev` is HTTPS by default)

### Outbound network (4)

- **egress-included — yes — "$0"** — https://docs.boat.dev/pricing — "Network traffic. boat does not bill egress." — **=** (no cap published)
- **egress-allowlist — partly — "Firewall inside"** — https://docs.boat.dev/hosting/firewall — "boat has no API setting for network rules." — **=** but **Δ shortfall**: rules are root-editable and lost on restore; also public URLs ride an **outbound WireGuard** tunnel, so a blanket outbound block breaks them. The documented allowlist is `iptables` owner-match rules inside the guest.
- **no-internet — partly — "Firewall inside"** — https://docs.boat.dev/hosting/firewall — "Do not block all outbound traffic for `user`." — **Δ shortfall** (was a generic root/loss line): to keep Boat working, block a **separate Linux account**, not `user`; the agent has root and can undo it; rules do not survive a snapshot. Verdict stays `partly`.
- **static-ip — not-published — ""** — https://docs.boat.dev/pricing — "A public IPv6 address on every sandbox, and outbound IPv4. The IP address can change when a sandbox resumes." — **=** (no fixed egress address; outbound IPv4 is shared/NAT, unpublished)

### Keys and secrets (3)

- **secrets-store — yes — "Variables and files"** — https://docs.boat.dev/environments/secrets — "boat injects two types of secret when a sandbox starts." — **=** (env vars + secret files under `/home/user`, per environment; versions and upgrades)
- **hidden-secrets — partly — "AI keys only"** (was "Model keys only") — https://docs.boat.dev/ai-credentials — "A placeholder is worthless outside boat. It does not contain the real key." — **=** but **Δ shortfall**: only **AI provider** credentials (model keys, Claude/ChatGPT sign-ins, custom AI APIs) go through the proxy; other API keys are ordinary variables/files the agent can read. Credential profiles now hold several accounts per provider and custom APIs, but the boundary is still AI credentials.
- **scoped-keys — yes — "Action sets"** — https://docs.boat.dev/api-keys/scopes — "boat grants a request only when **both** of these are true" — **=** (actions + sandbox/environment set + expiry; presets `read-only`, `full-sandbox`, `ci`, `admin`; in-sandbox key works on its own sandbox only)

### Ways to drive it (8)

- **dashboard-create — no — ""** — https://docs.boat.dev/account — "| **[Dashboard](https://boat.dev/dashboard)** | one-off work, and the things that must not be automatable | browser sign-in |" — **=** (`inferred`; the docs never show a create button, and the dashboard bundle's sandbox empty state offers no "New" control. **Fix the `claude-code-team` use-case route**, which says "from the dashboard or command line" — the dashboard cannot create.)
- **cli — yes — ""** — https://docs.boat.dev/quickstart — "Install the boat CLI on macOS, Linux or Windows" — **=** (new subcommands: `boat forward`, `boat run`, `boat ci`, `boat telemetry`, `boat wallet`, `boat billing extra-starts`, `boat data-retention`)
- **python-sdk — yes — ""** — https://docs.boat.dev/sdks/overview — "`boat-sdk` on PyPI" — **=**
- **ts-sdk — yes — ""** — https://docs.boat.dev/sdks/overview — "`@boatdev/sdk` on npm" — **=**
- **rest-api — yes — ""** — https://docs.boat.dev/api/v1 — "The base URL is `https://boat.dev/api/v1`." — **=** (OpenAPI file at `/openapi/boat-v1.yaml`; idempotency keys 24 h)
- **mcp-server — no — ""** — https://docs.boat.dev/ai-tools — "the boat CLI, the docs MCP server, llms.txt, skills" — **=** (docs-only MCP at `https://docs.boat.dev/mcp`; no control-plane MCP. A `computer` MCP exists *inside* each sandbox for desktop control, and harnesses can add their own MCP servers — neither manages sandboxes)
- **pty — yes — ""** — https://docs.boat.dev/ssh-access — "Run `boat ssh <id>` for a shell." — **=** (a real SSH PTY; note there is **no stdin/PTY field** in the HTTP command API — one-shot only. If the capability means "PTY over the HTTP API", this should be `partly`; if "a program can open a live shell", `yes` stands.)
- **file-api — yes — ""** — https://docs.boat.dev/account — "reading and writing files in a sandbox without SSH" — **=** (read/write/delete/list/info/search/find/folder/move/permissions/replace; JSON ≤5 MiB; signed upload/download URLs 15 min–1 h; absolute paths restricted to `/home/user` and `/tmp`)

### Built-in agents (7)

- **agents-preinstalled — yes — "7 promptable + 3 CLIs"** (was "7 harnesses") — https://docs.boat.dev/integrated-agents — "Every sandbox has seven coding-agent harnesses, installed and ready" — **Δ figure/note**: the seven are Claude Code, Codex, pi, OpenCode, Prime Agent, Kimi Code, Mistral Vibe; the image also ships **Hermes**, **OpenClaw** and **Cursor CLI** (`agent`/`cursor-agent`), which are not on the `boat prompt` list. Say "10 agents; 7 promptable" if the figure is about installed software, or keep "7 harnesses" and add the three CLIs in the note.
- **prompt-api — yes — ""** — https://docs.boat.dev/api/reference/agent/prompt-sandbox-agent — "Queue a natural-language work item for an agent harness" — **=** (steering, interrupt, conversations, event stream, model/harness switch, attachments)
- **one-click-hermes — partly — ""** — https://docs.boat.dev/machines/tools — "Hermes Agent by Nous Research. Browser tools are not pre-installed" — **=** (installed; still needs `hermes setup`/gateway in a terminal, and browser tools are an add-on)
- **one-click-openclaw — partly — ""** — https://docs.boat.dev/machines/tools — "OpenClaw CLI. The gateway does not start by itself: run `openclaw gateway`." — **=**
- **browser — yes — "Chrome 151"** — https://docs.boat.dev/machines/tools — "| `google-chrome-stable` | Chrome 151 |" — **=**
- **desktop — yes — "1080p 60 fps"** — https://docs.boat.dev/desktop-streaming — "The full desktop over Moonlight (WebRTC), 1920x1080 at 60 fps" — **=** (browser-only Chrome view too; VNC over HTTPS)
- **hosts-other-agents — no — ""** — https://docs.boat.dev/integrations/harbor — "Run Harbor agent trials and evals on Boat sandboxes" — **=** but **Δ note**: "Its integrations are Harbor and Eve adapters, which are evaluation frameworks" is wrong — **Harbor** is an eval harness, **Eve** is a TypeScript *agent framework* that uses Boat as a sandbox backend, and **AgentEnv** (Scale AI's RL environment framework) has a built-in Boat provider. None is a hosted agent platform like Cursor/Devin/Claude Managed Agents, so `no` still fits; say "agent/eval frameworks, not hosted agent platforms".

### Teams and accounts (6)

- **team-workspace — yes — ""** — https://docs.boat.dev/organizations — "It has one plan, one wallet, and members who run sandboxes on it." — **=** (add: seats, shared sandboxes, shared environments/credential profiles)
- **roles — yes — ""** — https://docs.boat.dev/organizations — "Every member uses them, unless an owner or admin" — **=** (owner/admin/member; owner-only rename/transfer/seats/owner caps; admins cap members and restrict environments)
- **sso — not-published — ""** — https://docs.boat.dev/organizations — "The owner invites people by email." — **=** (no SAML/OIDC/SCIM page, flag or command)
- **spend-cap — partly — ""** — https://docs.boat.dev/billing — "A personal account has no dollar cap." — **=** but **Δ note**: org usage cap **and** concurrency cap; over either, Boat snapshots and stops that member's org sandboxes "within about a minute", not merely blocks new ones. A personal account has no cap at all; the wallet can go negative for 24 h.
- **usage-alerts — not-published — ""** — https://docs.boat.dev/billing — "A personal account has no dollar cap." — **=** but **Δ note**: Boat *does* email at 85% and 95% disk use, and can email a once-per-period plan nudge; there is still **no spend threshold you set**. The `Alerts` dashboard tab turns those emails off. So "no usage alerts at all" is wrong; "no spend alert" is right.
- **audit-log — not-published — ""** — https://docs.boat.dev/account — "Webhook delivery history" — **=** but **Δ note**: Boat says it keeps "Security audit events" as records after content deletion (data-retention), and `boat ci`/`boat usage` expose per-job/per-sandbox history, but there is **no customer-facing account audit log**. Say that.

### Billing models (5)

- **per-second — yes — "per second"** — https://docs.boat.dev/pricing — "You pay per second, only while a sandbox runs." — **=** (from `provisioned`; not while `provisioning`/`stopping`; no published minimum or rounding)
- **active-cpu — no — "flat rate per size"** — https://docs.boat.dev/pricing — "You pay per second, only while a sandbox runs." — **=** (a running box costs the same whether busy or waiting; shared vCPUs)
- **cheap-pause — yes — "nothing while stopped"** (was "nothing for 14 days") — https://docs.boat.dev/faq — "A stopped sandbox keeps its disk for free for at least 14 days." — **Δ quote/figure/note**: stopped = $0 machine time; disk free for **at least** 14 days, cleanup report-only today. Saved snapshots above the included count ($0.056/day) and the AI proxy ($1/day) still charge while stopped.
- **no-monthly-fee — no — "$20 minimum plan"** — https://docs.boat.dev/pricing — "A plan is a monthly price that your card pays." — **=** (the $20 plan is a floor; no free plan)
- **flat-price — yes — "$26 a month for default"** — https://docs.boat.dev/pricing — "One `default` sandbox that runs a full month (730 h) costs $26." — **=** (730 h × $0.036 = $26.28; $20 plan + $6.28 wallet)

### Trials and free tiers (3)

- **free-tier — no — "trial only"** — https://docs.boat.dev/faq — "There is no free tier." — **=** (organizations get no trial either)
- **free-credit — no — "none"** — https://docs.boat.dev/free-trial — "25 hours in total, all sandboxes together" — **=** (25 h of compute inside a 7-day trial, not a dollar credit; one trial per person)
- **no-card — no — "card at checkout"** — https://docs.boat.dev/free-trial — "Checkout asks for a card." — **=**

### Company (5)

- **status-page — yes — ""** — https://docs.boat.dev/compliance — "Platform status | Live on [status.ascii.dev](https://status.ascii.dev)" — **=** but **Δ note**: 8 components (7 customer-facing + 1 internal extreme-edge suite), 14-day rendered bars over 90 days of `history.json`, new metrics (provisioning, stop, resume, restore read speed, snapshot throughput), and a separate `incidents.json` feed (315 entries / 90 days). Uptime is red-time only; "degraded" orange does not reduce the displayed percentage.
- **sla — no — ""** — https://boat.dev/terms — "We do not guarantee that sandbox will be uninterrupted" — **=** (no SLA on any plan; no service credits; 99.95% is a measured claim, not a promise)
- **soc2 — no — ""** — https://docs.boat.dev/security — "SOC 2 in progress." — **=** (no report to request; no ISO 27001, HIPAA/BAA, pen-test report or trust center)
- **dpa — partly — ""** — https://boat.dev/terms — "To request a data processing agreement, contact support@ascii.dev." — **=** (email request; the Privacy Policy says it is not itself an Article 28 DPA)
- **open-source — no — ""** — https://docs.boat.dev/compliance — "Sandboxes run on machines in Germany, Finland and France." — **=** (hosted only; no self-host edition, no source for the platform. SDKs/skill pack are separate and do not make the service self-hostable)

---

## 3. Rate-card inputs — original units, 2026-11-12

Fresh pricing page (`dateModified 2026-11-09T06:58:40.483Z`, Context cache miss) and fresh
`https://docs.boat.dev/limits.md?x=<epoch>`; numbers cross-checked against `machines`, `faq`, `free-trial`,
`billing`, `organizations/seats-and-limits` and the rendered pages. **Every Boat unit rate is unchanged from
2026-10-28/30.** No A/B/C total moves; no cost test needs a new expectation.

### Shapes — unchanged

| Size | $/hour | vCPU (shared) | RAM | Disk (your files) | $/730 h | Plan gate |
|---|---:|---:|---:|---:|---:|---|
| `small` | **0.018** | 2 | 4 GB | 51 GB | 13.14 | — |
| `default` | **0.036** | 4 | 8 GB | 51 GB | 26.28 | — |
| `large` | **0.072** | 8 | 16 GB | 111 GB | 52.56 | first payment (no trial) |
| `xlarge` | **0.200** | 16 | 32 GB | 251 GB | 146.00 | **$100/mo plan or higher** |

- Disk is "the space for your own files"; OS/tools are outside it. No custom size, no extra disk, no volume.
- x86-64 only; no GPU on any size; vCPUs shared, not physical cores; fleet is Ryzen 7 9700X + Ryzen 9 9950X.
- Regions: Germany, Finland, France; **no region choice**. Snapshot copies can leave the EU.
- Billing increment: per second, from `provisioned`; no published minimum charge, rounding or start fee.
- `between`: disk kept — **at least 14 days** after stop (was "14 days"); cleanup job report-only in production.

### Plans — unchanged prices, same included time/limits

| Plan | $/mo | Concurrent | Starts /min | /h | /d | Max starts/day (6×) | Included VM time | Saved snapshots |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Free trial | 0 | 2 | 5 | 25 | 75 | 75 | 25 h total | 0 (cannot create) |
| $20 | 20 | 100 | 12 | 60 | 200 | **1,200** | 555 h `default` ($20) | 10 |
| $100 | 100 | 300 | 30 | 210 | 840 | **5,040** | 2,777 h ($100) | 50 |
| $500 | 500 | 1,000 | 65 | 420 | 1,680 | **10,080** | 13,888 h ($500) | 250 |
| $2,000 | 2,000 | 2,000 | 90 | 600 | 2,400 | **14,400** | 55,555 h ($2,000) | 1,000 |

- A plan is **prepaid VM time + limits**, not a fee. Included time resets each billing period; unused time expires.
- Create, fork and resume each count as one start. A resume that takes back the kept machine (the 10-minute window)
  does **not** count. Starts use rolling 60 s / 60 min / 24 h windows; no midnight reset.
- Seats: one seat = one plan price; adds the plan's included time; adds **full limits on $2,000**, **20% below**,
  capped at the next plan's limits. Seats held before 2026-10-28 keep full limits. Orgs get no trial.
- xlarge needs $100+; `large` needs the first payment; no custom plan below $2,000 (custom above only).

### Overage, wallet and extras

| Item | Price / rule | Changed? |
|---|---|---|
| VM time past included | same as the size: **$0.018 / $0.036 / $0.072 / $0.200 per hour** | no |
| Saved snapshot past included | **$0.056 per snapshot per day** ($1.68 / 30 d); included **10 per $20 of plan per seat**, min 10 | no |
| Extra start, 1–1.5× included | **$0.03** | no |
| Extra start, 1.5–2× | **$0.05** | no |
| Extra start, 2–**6×** | **$0.07** | **yes — bracket was 2–3×; now 2–6×** |
| Extra starts ceiling | **6×** per hour and per day; **3×** per minute; above 6× fails | **yes — was 3× hour/day** |
| $20 plan max starts/day | **1,200** (was 600) | **yes** |
| $100 / $500 / $2,000 max starts/day | **5,040 / 10,080 / 14,400** (was 2,520 / 5,040 / 7,200) | **yes** |
| Extra starts on invoice | `boat billing extra-starts on`; off by default; caps **$80/$400/$1,500 per seat/month** on $20/$100/above; trial/past-due/ending plan cannot use | **new** |
| AI credentials proxy | **$1 per UTC day on** + **$1 per 1,000 proxied requests** | no |
| Egress | **$0**; no cap published | no |
| Public IPv6 + outbound IPv4 | $0 | no |
| Public URLs for ports | $0 | no |
| Automatic snapshots | $0, no count limit | no |
| Wallet top-up | whole dollars, **$15–$100,000** | no |
| Wallet bonus | **+2% at $200 → +25% at $10,000** (25% also at $100,000) | no |
| Auto top-up | at **10%** of the amount, never below **$5**; 3 declined charges turns it off | no |
| Wallet floor | can go **negative for a 24-hour grace period**; next payment covers it; then sandboxes stop | **new detail (billing page 2026-11-07)** |
| Unpaid saved snapshots | extras can be **deleted after 7 days** with an empty wallet | **now stated** |
| Free trial | **7 days**, card, **25 h** total, **2** at once, **5/25/75** starts, **≤2 h** auto-stop, `small`/`default`, **no saved snapshots**, **no org trial**, **one per person** | no rate change; org/no-second-trial restrictions were not in the profile |
| Minimum | **$20/mo**; no free tier; no signup credit | no |

**Cost implications of the start change (do not recompute A/B/C totals — they do not move):**
- Case A spread over a month: 1,000 starts ≈ 33/day → still free; total **$20**. Unchanged.
- Case A **all in one day**: 1,000 starts now **succeeds**; extra starts = 100×$0.03 + 100×$0.05 + 600×$0.07 =
  **$3 + $5 + $42 = $50**; bill **$70**, not "starts 601 fails". The old flag and its $22 arithmetic are obsolete.
- A **full 1,200-start day** on $20: 100×$0.03 + 100×$0.05 + 800×$0.07 = **$64**; bill **$84**.
  The old "full 3× day = $22" table is gone from the pricing page (the price checker flags its removal).
- Case B/C starts are far inside limits: unchanged **$26.28** / **$1.62** usage, **$20** cash floor.

**`research/rates/boat.json` edits (research artifact, not the executable card):** `checkedOn` 2026-10-29 →
2026-11-12; `storage.billedWhileStoppedNote` and `quote` → "at least 14 days … cleanup report-only today";
`automaticSnapshots.retention/quote` → "at least 14 days after a stop; cleanup can delete later once enabled";
`other["Starts above a plan's start limit"]` → `"0.03 up to 1.5x, 0.05 up to 2x, 0.07 up to 6x"` and the live
"Above 6 times fails / 3× per minute" wording; add the invoice option + caps; `diffs.storage.stoppedRetentionDays.live`
→ "at least 14 days; eligible for cleanup, job report-only today". No numeric field in the executable
`site/src/data/pricing/boat.json` changes except notes: `between`, `egress`, shapes, plans, credits are all still
correct. Its note "the disk is kept free for 14 days" and the "paid starts" line should say "at least 14 days /
report-only" and "up to 6× (3× per minute)".

### Price-baseline / checker

`npm run check-rates` (read-only, run 2026-11-12) reports **CHANGED https://docs.boat.dev/pricing**:

```
now shows $0 $0.026 $0.047 $0.105 $0.164 $0.205 $0.210 $0.238 $0.329 $0.420 $0.476 $0.48 $0.658 $0.76 $0.840 $0.952 $1.90 $13.63 $14.96 $16.75 $19.71 $3.21 $4.28 $5.10 $7.19 $8.30;
no longer shows $0.05 $0.053 $0.091 $0.112 $0.140 $0.201 $0.235 $0.244 $0.280 $0.315 $0.380 $0.384 $0.560 $0.568 $0.630 $1.12 $1.26 $1.52 $14.61 $184.80 $2.52 $22 $22.07 $264 $3 $3.04 $4.95 $7.62 $8.19 $92.40
```

This is **not** a Boat rate change. It is (a) the new "Compared to others" table, re-priced against exe.dev,
Novita, Freestyle, Fly.io Sprites, E2B, Daytona, Blaxel, Cloudflare, AWS AgentCore, Modal, Islo, Runloop, Vercel,
Railway at **2026-11-08** list prices, (b) the new StarSling performance table ($0.36 per million runs etc.),
and (c) removal of the old **3× paid-start** table ($22 / $92.40 / $184.80 / $264) now that limits are 6×.
`$0.05` is gone from *pricing* because extra starts are quoted as a range "$0.03 to $0.07"; `$0.05` is still the
middle bracket on `limits`. Boat's own $0.018/$0.036/$0.072/$0.200/$20/$100/$500/$2000/$0.056/$1/$1,000/$15/
$100,000/2%/25% all still extract. **Review the baseline diff, then `npm run check-rates -- --update`; do not
bless the other providers' CHANGED lines** (agent37, boxd, daytona, e2b, hetzner, contabo BLOCKED in this run).
Add **https://docs.boat.dev/limits** to the rate card's `sources` (it now carries $0.03/$0.05/$0.07, $80/$400/
$1,500 and $0.056), then let `--update` write its baseline entry. `pricing` is the only Boat page the checker
fetches today because it is the only Boat URL in `pricing/boat.json.sources`.

---

## 4. First-party contradictions (both sides quoted)

1. **Does a stop keep memory?** — **Marketing:** "Memory and running programs are not saved." (https://boat.dev/,
   limits transcript) and "Files stay across stop and resume; memory does not." (https://boat.dev/compare).
   **Docs:** "Memory, running programs, open terminals and the IP address are then still there." (stop page);
   "Stop (disk kept, memory kept only for a resume within 10 minutes)" (concepts). **Interpretation used:**
   the *snapshot* is disk-only; the *machine* is held for 10 minutes, so a quick resume usually keeps memory.
   The marketing sentence is true after 10 minutes, false inside the window. The profile should use the docs
   and say the window is best-effort.

2. **How long is a stopped disk kept?** — **Docs/pricing/FAQ/Terms/Privacy:** "at least 14 days" and "the job
   currently reports candidates without deleting them in production" (stop, pricing, data-retention, terms,
   privacy). **CLI reference and Harbor adapter:** "keeps its disk for 14 days" / "for 14 days" — absolute, no
   "at least", no report-only caveat. **Interpretation:** 14 days is the **minimum promise**; the production
   cleanup is **report-only today**, so the effective life can be longer, but a buyer must not rely on it.
   The old Terms "approximately 30 days" sentence is **gone** (effective date still 2026-10-12, so the revision
   is undated on the page). The profile's "docs say 14, Terms say 30" contradiction is **resolved**.

3. **IPv4 or not?** — **Pricing:** "A public IPv6 address on every sandbox, and outbound IPv4." **Machines:**
   "Public IPv4 or IPv6 plus outbound internet." **FAQ:** "Some sandboxes have no IPv4 address of their own."
   **Interpretation:** IPv6 is guaranteed; a public IPv4 is sometimes present; outbound IPv4 works. Raw
   inbound TCP is IPv6-only on machines without a public IPv4. Unchanged from 2026-10-28 (the drift is still
   there), but the FAQ is the most specific and should be the model's wording.

4. **Where do snapshots live?** — **Compliance:** "Snapshot copies can be stored outside the EU."
   **Privacy:** "sandboxes and their snapshots run in the EU (currently Germany, Finland, and France)."
   **Interpretation:** the primary snapshot is in the EU; *copies* (backup/replication) may leave. Do not claim
   full EU data residency; say "EU compute and primary storage; snapshot copies may be stored outside the EU."
   This is a new contradiction (the privacy wording was not in the 2026-10-28 ledger).

5. **How fast is a resume?** — **Readiness:** "A resume, a fork or a deploy is ready in **a few seconds, whatever
   the size of the disk**." **Boat's own 15 GB status probe:** full restore 726–2,358 s (median 987 s ≈ 16.5 min)
   across 54 runs; the latest, 2026-11-11, "restore 1405s". The probe's *ready* number is fast (resume → running
   avg 0.9 s, SSH ready avg 2.3 s), because "ready" means the API state, not all bytes hydrated. **Interpretation:**
   "ready" ≠ "hydrated"; the headline is true for the state and misleading for a workload that reads the whole
   disk. Add the hydration caveat and the 15 GB numbers to the profile. Boat's status message also says
   "1.0% of user-box snapshots missed the 30 min budget in the last hour (527/55107)" — snapshot/stop is not
   always quick either.

6. **When was it founded / launched?** — **YC:** "Founded:2024" (Fall 2026, 3 people, Paris). **Founders' own
   LinkedIn (prior pass; not re-read today):** "we started Ascii in the middle of Finland in 2025." **Boat dashboard metrics bundle:**
   "series start at Boat launch week (2026-05-18)" and "Boat + ascii (our agent product, built on Boat), from the
   Boat launch week (May 18, 2026)". **Kingy launch tracker:** "Launch date July 23, 2026" for box. **Docs:**
   "Box became **boat** on September 15, 2026." **Interpretation:** company 2024/2025; first paid/launch week
   2026-05-18; public box launch 2026-07-23; rename 2026-09-15. The company feature's "Founded 2026" is wrong
   either way. Do not invent a single launch date; label which date is which.

7. **What is Ascii?** — **Terms:** "boat, Ascii, the sandbox website, software, APIs, CLI, documentation, design,
   names, logos, marks, infrastructure, and related technology are owned by Dedale" (brand). **Dashboard metrics
   bundle:** "Boat + ascii (our agent product, built on Boat)" (product). **ascii.dev:** HTTP 301 → boat.dev.
   **Interpretation:** Ascii is the legacy brand/product name, now folded into Boat; not a separate company.
   Low materiality, but the profile's "Ascii is a brand" is incomplete.

8. **API rate limit (resolved).** The 2026-10-28 research recorded a 1,000/min table row vs a 10,000/60 s error
   row. The live `limits` page now has only "API requests | 10,000 per 60 seconds from one IP address" and the
   error text "More than 10,000 API requests in 60 seconds"; the `RateLimit-Policy` example is `q=10000;w=60`.
   **Resolved** — no contradiction left. Do not carry the old 1,000/min caveat forward.

9. **99.95% uptime vs the status page.** — **Compliance:** "Sandboxes have an uptime of 99.95%. boat measures this
   over the history of all sandboxes." **Status page (90 days, page method):** 99.45%–100% per customer-facing
   component, 99.84% pooled; Fork 99.45%, Stop+Resume 99.52%. **Interpretation:** different denominators
   (sandbox-level history vs synthetic per-component probes), not a contradiction. Report both and say which
   is which; do not average them into one number.

### Resolved since 2026-10-28 (remove from the caveat list)

- **Three sizes vs four:** homepage no longer says "three sizes"; it lists `small/default/large/xlarge` with the
  right disks. (The "pause billing" phrase remains, but it is billing language, not a paused state.)
- **API limit 1,000 vs 10,000:** now one figure, 10,000/60 s.
- **Saved-snapshot allowance 10 flat vs 10 per $20:** pricing and limits both say "10 for every $20 of plan per
  seat, never fewer than 10".
- **xlarge "operator allocation" vs self-serve:** pricing says "You do not need to contact us"; the cached
  bare-metal line is gone.
- **Egress 2 TB cap vs no cap:** no cap appears anywhere now; "does not bill egress" is the only statement.
- **14 vs ~30 days retention:** Terms/Privacy now say 14 days with the report-only caveat (see #2).

### Still contradictory / unresolved

- **`sizes`** in the profile says "Four fixed sizes, all with 51 GB of disk except the largest: … large … (111 GB)".
  It contradicts itself in one sentence; only `small` and `default` have 51 GB.
- **`isolation`** says "KVM virtual machine" but the docs never name the hypervisor (see §1).
- **`dashboard-create` vs the `claude-code-team` use-case route**: capability says no dashboard create; route says
  "from the dashboard or command line". The dashboard bundle has no create control; the route is the odd one out.
- **`web-terminal` vs `usability`**: capability says no browser command line; the profile says the desktop has
  "a terminal". Both can be true (a desktop app, not a web terminal), but the wording should be consistent.

---

## 5. Products and surfaces the 16 features / 78 capabilities miss

`page lastmod` is the sitemap's revision date, **not** a launch date. "Pre-check" means the page was already at
that revision on 2026-10-28 (so the original pass missed it); "post-check" means it was revised after 2026-10-28
(so it may be new or just newly documented).

| # | Surface | What it is (verbatim) | URL | Page date | Post/pre-check |
|---|---|---|---|---|---|
| 1 | **GitHub Actions runners** | "Each job gets a fresh sandbox, billed per second, deleted when the job ends." `runs-on: boat`, labels `boat-small`/`boat`/`boat-large`/`boat-xlarge`, options `/from=<saved-snapshot>` and `/debug`; needs the **$20 plan**; 6 h GitHub cap; public repos off by default; start limits apply; `boat ci` shows wait/run/cost/logs. | https://docs.boat.dev/ci | 2026-11-11 | **post-check** (API refs 2026-10-27) |
| 2 | **OpenTelemetry export** | "boat pushes your account's telemetry to one OTLP/HTTP endpoint that you choose. You do not install an agent in your sandboxes." Metrics every 60 s, lifecycle events as OTLP logs; no traces, prompts, tool calls or token data. | https://docs.boat.dev/opentelemetry | 2026-10-19 | **pre-check, missed** |
| 3 | **Snapshot download / pull** | "You can read the files of a snapshot without starting the sandbox. The sandbox can be stopped." Whole home, one folder, one file, or a changed system file by absolute path; file tree API; no resume. | https://docs.boat.dev/snapshots/download-and-delete | 2026-11-10 | **post-check** (API 2026-11-01) |
| 4 | **Snapshots off / monitoring off** | "boat never captures a sandbox with snapshots off." A stop erases it; cannot resume/fork/save. Monitoring off keeps no command output, process list or CPU/RAM samples. Per sandbox or whole account. | https://docs.boat.dev/data-retention/snapshots-and-monitoring-off | 2026-10-23 | **pre-check, missed** |
| 5 | **Zero data retention (ZDR)** | "With zero data retention (ZDR), boat deletes the data of each sandbox when it stops." Account setting; needs a browser session and the phrase "delete archived sandbox data" to change. | https://docs.boat.dev/data-retention/zero-data-retention | 2026-10-25 | pre-check (expanded) |
| 6 | **Shared sandboxes / share & unshare** | "Every member can use them. A sandbox is shared when it holds no personal logins and its creator did not make it private." `boat share` / `boat unshare`, org default visibility; personal sandboxes stay hidden. | https://docs.boat.dev/organizations/shared-sandboxes | 2026-10-23 | **pre-check, missed** |
| 7 | **Environment & credential-profile access lists** | "An owner or admin can limit an environment to a list of members." Everyone vs only-listed; `403 environment_forbidden`; same for AI credential profiles. | https://docs.boat.dev/organizations | 2026-10-30 | **post-check** |
| 8 | **AgentID sign-in / agent self-signup** | "AgentID, for an AI agent that has its own AgentMail inbox." Fourth sign-in method; an agent can register itself via `auth.md`, a human claims it and enters the card. | https://docs.boat.dev/account | 2026-10-19 (agent-auth 2026-10-21) | **pre-check, missed** |
| 9 | **`boat forward` tunnels** | "Use `boat forward` to reach a port of the sandbox on your own computer. Nothing becomes public." `--remote`, `--local`, `--reverse`, `--bind`, reconnects; `ssh` action. | https://docs.boat.dev/ssh-access | 2026-10-19 | **pre-check, missed** |
| 10 | **`boat run` one-job command** | "`boat run` creates the sandbox, copies the checkout in, runs the tests, prints the cost and deletes the sandbox. It exits with the exit code of the tests." | https://docs.boat.dev/cli-reference | 2026-11-10 | **post-check** |
| 11 | **Signed file upload/download URLs** | "A URL works for one path and one direction (download or upload)." Expires in 15 min, up to 1 h; bytes go straight to the sandbox; no Authorization header; 5 MiB JSON limit bypassed. | https://docs.boat.dev/ssh-access | 2026-10-19 | **pre-check, missed** |
| 12 | **Windows apps via Wine** | "A sandbox runs Windows programs on its Linux desktop through Wine." Tested-app list, install script, recipes for Steam/Paint.NET/Direct3D, agent drive + fork. | https://docs.boat.dev/windows-apps | 2026-10-18 | **pre-check, missed** |
| 13 | **Harbor / Eve / AgentEnv adapters** | "Run Harbor agent trials and evals on Boat sandboxes"; "Eve is a TypeScript framework for coding agents … boat is a cloud sandbox"; "AgentEnv has a built-in `boat` sandbox provider." | https://docs.boat.dev/integrations/harbor · /eve · /agentenv | 10-23 / 10-23 / **10-29** | Harbor+Eve pre-check, missed; AgentEnv **post-check** |
| 14 | **Credential profiles: multi-account, custom APIs, usage, block** | "A credential profile is a named set of AI credentials." Several Claude/ChatGPT/OpenAI accounts per provider, switch when credits run out; custom APIs with `NAME_BASE_URL`; `boat ai usage`; `boat ai block/unblock`; org access lists. | https://docs.boat.dev/ai-credentials | 2026-11-09 | **post-check** |
| 15 | **Extra starts on invoice** | "`boat billing extra-starts on`" — pay paid starts on the next invoice instead of the wallet; caps **$80/$400/$1,500 per seat/month**; off by default; no trial/past-due/ending plan. | https://docs.boat.dev/limits | 2026-11-08 | **post-check** |
| 16 | **Per-sandbox usage / cost API** | "Every sandbox meters its own machine time." `boat usage <id>`, `GET /sandboxes/{id}/usage?since=&until=`, `include=cost,deletedCost`; dashboard Cost column and Cost-by-sandbox. | https://docs.boat.dev/billing | 2026-11-07 | **post-check** |
| 17 | **24-hour grace / negative wallet** | "You get a **24-hour grace period**." Wallet can show `-$3.20`; next payment covers it; sandboxes stop after 24 h or when new debt exceeds 25% of plan/$50. | https://docs.boat.dev/billing | 2026-11-07 | **post-check** |
| 18 | **Fail-fast + ready-machine pool** | "These four calls put the sandbox on a machine that is already running and waiting" … "They usually get a machine in less than one second." `failFast` / `--fail-fast` returns `503 no_ready_machine` without starting, billing or spending a start. | https://docs.boat.dev/machines/fail-fast | 2026-10-23 | **pre-check, missed** |
| 19 | **Agent conversations survive a stop** | "A resumed or forked sandbox gets them back. So `--resume <id>` continues with full memory." Session files live on the disk; switch harness/model mid-thread; parallel conversations per sandbox. | https://docs.boat.dev/integrated-agents/conversations | 2026-10-19 | **pre-check, missed** |
| 20 | **Environment versions / upgrades** | "Each saved change makes a new environment version. A sandbox moves to it only when you upgrade." Create/rename/upgrade/delete, org-shared, access lists. | https://docs.boat.dev/environments/versions | 2026-10-19 | pre-check, missed |

**Also present, lower materiality:** `boat snapshot pull` of a whole home folder; `boat ci` dashboard tab and
`boat ci job/logs`; webhook events `sandbox.degraded`/`sandbox.recovered`; custom plans
above $2,000; `boat org migrate` for moving a personal plan; `boat ai profile` custom APIs; `boat data-retention
status/enable`; `boat telemetry set/unset`; `boat browser` (Chrome-only stream); desktop background PNG; desktop
MP4 recording; Windows-app licence rules; `boat run` (one job); `boat scp` large files; `--no-snapshots` per
sandbox; `--fail-fast`; `--no-env`; `boat env access`; `boat share/unshare`; `boat org default-visibility`.

**What is *not* there (do not invent):** no managed database, object storage, queue, GPU, ARM, Windows VM, macOS,
custom domain, region selector, private network/VPC, static egress IP, audit log, SSO/SAML, HIPAA/BAA, SOC 2
report, SLA, provider scheduler, warm pool you can size, or custom VM image. The MCP server is docs-only.

---

## 6. Profile corrections — `site/src/data/providers/boat.json`

Only the fields that need a decision are listed. Proposed text is plain-language and keeps the existing voice.
Quotes below are live on 2026-11-12.

| Field | Current | Proposed / why |
|---|---|---|
| `checkedOn` | `2026-10-28` | **`2026-11-12`** — every cited source re-read today. |
| `oneLiner` | "Ubuntu VMs in the EU, billed per second, with seven coding agents preinstalled and no pause at all." | **"Ubuntu VMs in the EU, billed per second, with ten coding-agent CLIs and no true pause: a stop keeps the machine, memory and IP for ten minutes."** Or shorter: "…with seven promptable coding agents and a ten-minute stop window." "No pause at all" is no longer accurate. |
| `whatItIs[0]` | "Seven coding-agent harnesses are preinstalled on every machine and can be prompted by name through one API call." | **"Ten agent CLIs are preinstalled; seven of them — Claude Code, Codex, pi, OpenCode, Prime Agent, Kimi Code and Mistral Vibe — can be prompted by name through one API call."** |
| `isolation` | "Full Ubuntu 24.04 KVM virtual machine…" | **"Full Ubuntu 24.04 virtual machine with its own kernel, root, Docker and SSH; Boat does not name its hypervisor. Shared vCPUs on a host dedicated to Boat. Nested /dev/kvm. No GPU and no ARM: x86-64 only."** The docs only say `/dev/kvm` is available *inside* and CPU virtualisation extensions are passed through. |
| `sizes` | "Four fixed sizes, all with 51 GB of disk except the largest: small … default … large 8 / 16 (111 GB), xlarge …" | **"Four fixed sizes: small 2 vCPU / 4 GB and default 4 / 8 with 51 GB; large 8 / 16 with 111 GB; xlarge 16 / 32 with 251 GB. No custom size, no extra disk, no volumes. large needs the first payment; xlarge needs the $100 plan."** The current sentence contradicts its own list. |
| `billing.meter` | "Per second while the machine exists…" | **"Per second while the sandbox runs, from `provisioned` until `stopping`…"** A stopped machine does not exist and is not billed; "exists" is ambiguous. |
| `billing.stopped` | "Zero machine time, and the disk is kept free for 14 days. After that the data is gone unless you saved a snapshot." | **"Zero machine time. The machine is held for 10 minutes unbilled, so a quick resume usually keeps memory, processes, terminals and the IP. The disk is promised for at least 14 days; after that it is eligible for the automated cleanup, which is report-only in production today, so nothing is deleted at day 14 yet. Saved snapshots are the durable copy."** |
| `billing.planFee` | "$20 buys $20 of VM time, but unused plan time expires monthly." | **=** (still exact). Add: seats multiply the plan price and included time; orgs get no trial. |
| `billing.minimum` | "$20 a month, and there is no free tier. The 7-day trial needs a card and is capped at 25 hours of compute." | **=** Add "one trial per person; organizations get no trial". |
| `cost.A.flag` | "All 1,000 tasks in one day would hit the start limit: starts 201–600 cost $22 from the wallet, and 601 fails." | **"All 1,000 tasks in one day now fit: 1,200 starts a day on the $20 plan. The 800 starts above the 200 included cost about $50 on the day bracket (100 × $0.03 + 100 × $0.05 + 600 × $0.07), so the day bills about $70; compressing them into a few hours can add a few dollars on the hourly bracket. 1,201 fails."** |
| `cost.A.notes[1]` | "The binding constraint is starts, not money: 33 creates a day is inside the 200-a-day limit." | **=** but add "spread over a month, starts are free; the $50 only applies if the whole 1,000 lands in one day". |
| `cost.B.notes` | "$35 cash … $8.72 left" | **=** (the $15 minimum top-up and $6.28 overage are unchanged). |
| `cost.C.notes[1]` | "The disk is kept free for 14 days after a stop; a longer gap needs a saved snapshot." | **"The disk is promised for at least 14 days after a stop; today the cleanup is report-only, so a longer gap survives in practice but is not guaranteed. A saved snapshot is the only guarantee."** |
| `company.facts[Recent incidents]` | "No incident history is published: the status page shows per-component uptime and latency over a rolling 90-day window, but no list of dated outages." | **"The status page renders 14-day uptime bars over 90 days of data and a metrics panel, not a dated incident list; a separate `incidents.json` feed publishes 315 probe entries over 90 days — 215 customer-facing, 33 outage entries, and 87.2 hours with at least one customer-facing component degraded. Customer-facing 90-day uptime is 99.45%–100% by the page's red-time method (99.84% pooled); Box Fork is lowest, Stop + Resume covers 34.6% of the window. Boat's own 15 GB probe reports full restores of 726–2,358 s."** |
| `company.facts[History]` | "Launched as box in July 2026 and renamed boat on 15 September 2026; box surfaces still answer." | **"YC lists it as founded 2024; the prior pass recorded the founders saying they started Ascii in 2025 (LinkedIn); the dashboard's metrics export dates 'Boat launch week' to 18 May 2026; a launch tracker dates box to 23 July 2026; box became boat on 15 September 2026. Box surfaces still answer."** Keep the `docs-confirmed` quote for the rename; tag the rest `third-party`/`inferred`. |
| `fits.badly[0]` | "A workload that needs to resume mid-process: there is no pause, and every resume is a reboot with a new IP." | **"A workload that needs to resume mid-process after more than ten minutes: there is no pause, and the machine is gone after the ten-minute grace, so the resume is a reboot with a new IP."** |
| `fits.badly[1]` | "Point-in-time recovery: snapshots are newest-only and disk-only." | **"Point-in-time restore: resume and fork use only the newest snapshot; older automatic snapshots can be downloaded for files (usually for under a day) but not booted."** |
| `usability.dashboard` | "…sandboxes with type, monthly cost and a desktop button, snapshots you can browse and download, environment settings, AI sign-ins, organisation, billing and account." | **=** Add "CI tab (jobs, wait, run time, cost, logs)", "per-sandbox usage sparklines", "webhooks & OTel", "data & privacy (ZDR, snapshots off, monitoring off)". |
| `usability.signup` | "A card, and a terminal for the installer… Agents can sign themselves up through `auth.md`…" | **=** Add "four sign-in methods incl. AgentID; one trial per person; organizations get no trial". |
| `usability.docs` | "About 100 Mintlify pages, each also as Markdown…" | **"100 guide pages and 119 API-reference pages (219 total), each also as Markdown, plus `llms.txt`, `llms-full.txt`, a docs MCP server and an agent skill pack."** |
| `usability.tripsUp[2]` | "Persistent means 14 days, not forever." | **"Persistent means at least 14 days — and the cleanup job is not deleting yet, so the 14 days is a promise, not an observed expiry."** |
| `usability.tripsUp[3]` | "Stop is not off: it saves the disk, destroys the machine, and changes the IP." | **"Stop is not off: it saves the disk and destroys the machine — a resume within ten minutes usually gets the same machine, memory and IP back, but after that it is a reboot."** |
| `usability.tripsUp[5]` | "Money lives in two places, plan credit and wallet, with different expiry rules." | **=** Add "the wallet can go negative for 24 hours before sandboxes stop". |
| `caveats[0]` | "There is no pause … Every resume is a reboot with a new IP…" | **"There is no pause state. A stop keeps the machine for ten minutes unbilled, so a quick resume usually keeps memory, open terminals, running programs and the IP; boat can release it early, and after ten minutes every resume is a reboot with a new IP. Docker containers and enabled systemd units come back either way."** |
| `caveats[2]` | "The disk expires 14 days after a stop … Docs and FAQ say 14 days; the Terms say up to about 30 days. A box untouched for two weeks returns `409 snapshot_data_expired`." | **Resolved.** Rewrite as: **"The disk is promised for at least 14 days; the automated cleanup is report-only in production today, so a box untouched for two weeks still resumes. The Terms now say the same 14 days (the old 'approximately 30 days' sentence is gone); after cleanup is enabled, resume/fork will fail with `409 snapshot_data_expired`."** Status: `open` (policy not yet enforced), not `contradiction`. |
| `caveats[3]` | "Its docs and marketing disagree on stop and on the number of sizes … homepage still says three sizes …" | **"Its docs and marketing disagree on stop: the homepage says 'Memory and running programs are not saved' and 'Files stay across stop and resume; memory does not', while the stop page says a resume within 10 minutes usually returns the same machine 'with memory and running programs'. The 'three sizes' line is gone (the homepage now lists four)."** Keep status `contradiction`; update both quotes. |
| `strengths[0]` | "…cheapest always-on 4 vCPU box with 50 GB of disk at $26.28." | **=** (51 GB; 50 GiB fits). |
| `strengths[1]` | "Seven coding agents preinstalled and promptable over the API." | **"Ten agent CLIs preinstalled; seven promptable over the API."** |
| `strengths[2]` | "An AI credentials proxy so sandboxes hold placeholders, not model keys." | **=** Add "multi-account credential profiles, custom AI APIs, usage, block/unblock". |
| `sources` | 7 entries | Add `https://docs.boat.dev/limits`, `/free-trial`, `/organizations`, `/security`, `/compliance`, `/data-retention`, `/ci`, `/opentelemetry`, `/ai-credentials`, `/terms`, `https://status.ascii.dev`, `https://www.ycombinator.com/companies/boat`. Keep the existing 7. |

**Minor wording fixes:**
- `whatItIs[0]`: "a dedicated IPv6 (sometimes IPv4)" → "a public IPv6 (sometimes also a public IPv4)".
- `billing.model`: "Monthly plan that is prepaid machine time plus limits" — fine; add "one plan price per seat in an organization".
- `fits.well[2]`: "EU hosting with no egress bill" — add "compute and primary storage in the EU; snapshot copies can leave".
- `caveats[1]`: "Snapshots are disk-only and newest-only" — keep, but "newest-only" applies to **restore**, not to the snapshot list (older automatic ones are listable/downloadable for a short time).
- `caveats[3]` (battleships drift): the battleships card is still dated 2026-09-30 and still disagrees on disks/egress/`pause_resume`/`xlarge`; keep the disclosure and the warning. It is not a source for any rate.

### `research/boat.md` edits

- Header date → 2026-11-12; keep 2026-10-28 as the prior pass.
- §3 "There is no pause": add the 10-minute same-machine window (memory, programs, terminals, IP), the
  early-release caveat, and the fact that a resume during `stopping` takes the same machine.
- §4 "Snapshots … only the newest one matters": add `boat snapshot pull` and file-tree/single-file download;
  older automatic snapshots are listable/downloadable for a short time even though resume/fork ignore them.
- §5 sizes: fix "all with 51 GB except the largest"; large 111 GB.
- §6 Networking: add `boat forward`; SSH `machineIp:22` vs `sshEndpoint`; raw TCP `--public` reopens after resume;
  the WireGuard tunnel in the firewall page.
- §7 Interfaces: add `boat run`, `boat ci`, signed file URLs, the skill pack, AgentID; MCP still docs-only.
- §8 Agents: ten CLIs (seven promptable); conversations survive stop; harness/model switch; `computer` MCP.
- §9 Accounts: seats, shared sandboxes, env/profile access lists, org no trial, one trial per person.
- §10 Pricing: extra-start 6× brackets and invoice option; 24 h grace/negative wallet; saved-snapshot 7-day
  deletion with empty wallet; "at least 14 days" + report-only cleanup. Keep the A/B/C arithmetic; update the
  A flag and C retention note. No rate totals change.
- §14 contradictions: remove #1 (API limit resolved), #2 three sizes (resolved), #3 14 vs 30 (resolved), #5
  saved-snapshot allowance (resolved), #6 xlarge bare-metal (resolved); add memory marketing-vs-docs, 14-day
  absolute-vs-at-least, IPv4 drift (still), EU snapshot residency, resume-speed vs 15 GB probe, launch dates.
- §15 usability: dashboard now has CI, usage, webhooks/OTel, data & privacy; docs 219 pages; signup AgentID;
  trips-up 14 days/stop wording.
- §17: founders/funding unchanged; add YC "Founded 2024, Team Size 3, Paris"; status/uptime numbers; incidents
  feed; Ascii redirect; Terms version/effective date and the removed 30-day sentence.
- Appendix: redo the quote audit; 88/94 rows still exact, 6 need new quotes. The 279-pair count is historical —
  do not present it as today's audit.

---

## 7. Shared prose, situations and use cases (outside the Boat row)

These are **not** provider-specific rows, but the parent owns them and they now contradict the live docs.

### `site/src/data/features/*.json` — `splits` / `scenario.turn` / `watchFor`

| File | Current string | Problem | Proposed |
|---|---|---|---|
| `lifecycle.json` | split heading **"No pause at all"**, body: "Boat has no paused state. A stop removes the virtual machine and keeps a copy of the disk; every resume is a new machine with that disk. The disk itself is kept for fourteen days, after which a resume fails and the work is gone." | Every clause is now wrong or overstated. | Heading **"A ten-minute grace, then no pause"**; body: "Boat has no paused state. A stop removes the virtual machine and keeps a copy of the disk — but keeps the machine itself for ten minutes, unbilled. A resume inside that window usually returns the same machine with memory, open terminals and the IP; after it, every resume is a new machine with that disk. The disk is promised for at least 14 days, and the cleanup job is report-only in production today, so a resume does not fail at day 14 yet." |
| `lifecycle.json` | `scenario.turn`: "Twelve of the sixteen sandbox providers can restore memory in at least one mode … **Boat and Cloudflare keep nothing**, …" | Boat keeps memory for 10 min (best effort). | "… **Cloudflare keeps nothing, and Boat keeps memory only for a ten-minute, best-effort window**; …" |
| `lifecycle.json` | `idea`: "… Boat's API calls a stopped sandbox archived, and its homepage still says “pause billing” even though the docs state there is no pause." | Still true, but incomplete: the docs now define a 10-minute memory window. | "… Boat's API calls a stopped sandbox archived, its homepage still says “pause billing”, and the docs say there is no pause — but a stop keeps the machine for ten minutes, so a quick resume usually keeps memory, terminals and IP." |
| `storage.json` | split "Retention is where “persistent” ends": "Boat keeps a stopped sandbox's disk for 14 days, then deletes it." | It does not delete at day 14 today. | "Boat promises a stopped sandbox's disk for at least 14 days; the automated cleanup is report-only in production today, so the 14 days is a floor rather than an observed deletion date." |
| `storage.json` | `scenario.turn`: "… a 14-day window turns a long weekend into data loss." | A long weekend is fine; the 14-day *floor* is the risk. | "… a 14-day floor is not storage: a long weekend survives, but a month-long gap is only as safe as the provider's cleanup policy — and Boat's cleanup is report-only today, which is a promise, not a guarantee." |
| `idle-timers.json` | split "Sleep can be automatic and invisible": "Boat cannot wake on a URL at all, because a stop destroyed the machine." | A 10-minute window keeps the machine. | "Boat cannot wake on a URL at all: a stop has no wake path, and after ten minutes the machine is gone." |
| `idle-timers.json` | split "The idle hour is where the bill lives": "Boat charges nothing while stopped and keeps the disk for 14 days." | "at least". | "Boat charges nothing while stopped and keeps the disk for at least 14 days (cleanup report-only today)." |
| `billing-models.json` | split "What is still charged while stopped": "Boat charges nothing and keeps the disk for 14 days." | "at least". | "Boat charges nothing and keeps the disk for at least 14 days (cleanup report-only today)." |
| `company.json` | split "What the status number measures": "seven customer-facing components range from 98.83% (Sandbox Fork) to 100%, and pooled across the seven the figure is 99.74%." | Window rolled; current 90-day figures are 99.45%–100%, pooled 99.84% (red-time method). Also "Sandbox Fork" is now "Box Fork". | "seven customer-facing components range from 99.45% (Box Fork) to 100%, and pooled across the seven the figure is 99.84% (page method, red time only; a cruder whole-red-hour count gives 99.12%–100% and 99.72%)." |
| `sizes-regions.json` | split "Disk is part of the shape": "Boat attaches 51 GB to its smallest three sizes and 111 or 251 GB to the larger ones." | Only two sizes have 51 GB. | "Boat attaches 51 GB to `small` and `default`, 111 GB to `large` and 251 GB to `xlarge`." |
| `sizes-regions.json` | split "Regions and hardware": "Boat and boxd are EU-only." | Compute is EU; snapshot copies/account data can leave. | "Boat's machines and boxd are EU-only; Boat's snapshot copies can be stored outside the EU." |
| `reaching-it.json` | split "Raw TCP and SSH are a separate capability": "Runtime, boxd and Boat support a raw TCP path; **Boat's depends on IPv4, which is not guaranteed**." | Boat's raw path works on IPv6 too; what is not guaranteed is a *public IPv4*. | "Runtime, boxd and Boat support a raw TCP path; Boat's works on the sandbox's public IP, but some sandboxes have only IPv6, which IPv4-only clients cannot reach." |
| `reaching-it.json` | split "A sleeping machine changes the answer": "Boat cannot wake on a URL at all, because a stop removed the machine." | Same nuance. | "Boat cannot wake on a URL at all: a stop has no wake path, and after ten minutes the machine is gone." |
| `snapshots-forks.json` | split "A snapshot with memory is not a backup": "Boat's snapshots are automatic, disk-only and taken every minute, but only the newest is usable." | Older ones are downloadable for files. | "Boat's snapshots are automatic, disk-only and taken every minute; only the newest can be resumed or forked, though older ones can be downloaded for files while they are still listed." |
| `snapshots-forks.json` | `watchFor`: "Whether you can choose an older snapshot; Boat cannot." | Cannot *restore* an older one; can *pull files* from one. | "Whether you can choose an older snapshot to restore; Boat cannot (it can only pull files from an older one while it is still listed)." |
| `teams-accounts.json` | split "SSO, audit and residency": "Boat and boxd are EU-only." | Same residency nuance. | "Boat's machines and boxd are EU-only; Boat's snapshot copies can leave the EU." |
| `built-in-agents.json` | split "Installed and promptable": "Boat installs seven harnesses and exposes a prompt endpoint…" | Ten CLIs are installed; seven are promptable. | "Boat installs ten agent CLIs, prompts seven of them through one endpoint, and exposes steering, interrupts and multiple conversations." |
| `trials-free-tiers.json` | split "The one that converts itself": "Boat's trial ends by charging the plan chosen at checkout." | True; add the org/one-per-person restrictions. | "Boat's trial ends by charging the plan chosen at checkout; organizations get no trial, and one person gets one." |

### `site/src/data/situations.json` — four Boat `watch` strings

1. `/situations[1]/providers[0]` (always-on / cheap): `"The disk is deleted 14 days after a stop."` →
   **"The disk is promised for at least 14 days after a stop; the cleanup job is report-only today, so do not
   treat day 14 as an observed deletion."**
2. `/situations[4]/providers[1]` (desktop): `"… and the disk is kept 14 days."` → **"… and the disk is kept for
   at least 14 days (cleanup report-only today)."**
3. `/situations[5]/providers[0]` (per-customer): `"… and a stop destroys the machine, so each customer's address
   is an on.boat.dev name."` → **"… and a stop destroys the machine after a ten-minute grace, so each customer's
   address is an on.boat.dev name."**
4. `/situations[7]/providers[0]` (EU): unchanged except "EU-only" → "EU compute; snapshot copies can leave the EU"
   if the row claims residency.

### `site/src/data/usecases.json`

- `claude-code-team` route: **"Create one per developer from the dashboard or command line, then run claude."**
  The dashboard cannot create (`dashboard-create = no`; the dashboard bundle has no create control). Change to
  **"Create one per developer from the CLI or API, then run `claude`."** (Tier stays `preinstalled`, noTerminal
  `partly`.)
- `browser-agent` price: "About $90 of usage at 30,000 ten-minute sessions; the $100 plan covers it" — 30,000 ×
  10 min = 5,000 h; at `small` $0.018 = **$90**; at `default` $0.036 = **$180**. Say which size. If the route
  means the smallest size, keep $90 and add "on `small`"; if it means `default`, fix to $180. (The $100 plan
  covers $90, not $180.)
- `mcp-server` route links to `pricing` for public URLs; `hosting` is the better page. Optional.
- `scheduled-scraper` route says "something outside has to start a sandbox per run" — true; add that a `cron`
  inside a **running** box works and the box bills 730 h/month if always on (already in `what`).
- No Boat route for **CI** or **evals** exists. If the site wants a CI/evals use case, Boat now has a real
  `runs-on: boat` route and Harbor/AgentEnv adapters; if not, leave it. Do not add a route just because a product
  exists.

### `site/src/data/docs.json`

All 17 Boat `docs.json` URLs (15 feature topics + `quickstart` + `pricing`; `company` has no docs key, by the
same pattern as every other provider) still resolve (200) and are the best page for the topic. Optional improvements:
`lifecycle` → `https://docs.boat.dev/snapshots/stop` (more precise than `/concepts`); `storage` →
`https://docs.boat.dev/data-retention` (already); `outbound-network` → `/hosting/firewall` (already);
`ways-to-drive` → `/sdks/overview` (already). If the parent adds a "CI" or "observability" topic, use `/ci` and
`/opentelemetry`; the current 16-feature schema has no slot for them.

### `site/src/pages/compare/side-by-side.astro`

`boat: "Full VM"` is still right; the manual `kinds` map and the "Sixteen features" / provider counts do not
change (Boat is already listed, 16 features, 78 capabilities). No edit needed.

### `site/src/data/changes.json` — suggested entries (observation date, not launch date)

1. **2026-11-12 — "Boat keeps a stopped machine's memory for ten minutes"**
   `what`: "Boat's stop page now says a stop keeps the machine for 10 minutes unbilled, so a resume inside the
   window usually returns the same machine with memory, running programs, open terminals and the IP; after
   10 minutes it boots from the disk with a new IP. The status page's 15 GB probe still takes 726–2,358 s to
   restore in full, so 'ready' is not 'hydrated'. The date is when this guide checked it, not a launch date."
   sources: stop (`A stop keeps the disk. A resume within 10 minutes usually gets the same machine back, with memory and running programs.`),
   concepts (`Stop (disk kept, memory kept only for a resume within 10 minutes)`), status (`Resume → running state (15 GB suite)`).
2. **2026-11-12 — "Boat's disk cleanup is report-only, and the Terms now say 14 days"**
   `what`: "Pricing, FAQ, data-retention, Terms and Privacy now promise a stopped disk for at least 14 days and
   say the automated cleanup currently reports candidates without deleting them in production. The Terms'
   older 'approximately 30 days' sentence is gone, so the guide's 14-vs-30 contradiction is resolved — but the
   14 days is now a floor, not an observed expiry."
   sources: pricing (`A stopped sandbox keeps its disk for at least 14 days.`), terms (`Data from a stopped sandbox is eligible for automated retention cleanup 14 days after the stop.`),
   data-retention (`The 14-day rule does not yet trigger deletion there.`).
3. **2026-11-12 — "Boat raises paid starts to 6× and adds invoice billing"**
   `what`: "The $20 plan now allows 1,200 starts a day (was 600); the $0.07 bracket runs to 6× the limit (was 3×);
   the minute cap stays 3×. Extra starts can also go on the invoice (`boat billing extra-starts on`) with
   $80/$400/$1,500 per-seat monthly caps. A 1,000-start day now costs $50 extra and succeeds, where 601 used to
   fail."
   sources: limits (`| Up to 6 times | $0.07 | 401 to 1,200 |`), limits (`The cap per seat per month is $80 on the $20 plan, $400 on the $100 plan, and $1,500 above.`),
   pricing (`a start costs $0.03 to $0.07`).
4. **2026-11-12 — "Boat adds GitHub Actions runners, OpenTelemetry and snapshot download"**
   `what`: "Boat now documents `runs-on: boat` GitHub Actions runners (fresh sandbox per job, $20 plan, 6 h cap),
   an OTLP/HTTP OpenTelemetry export (metrics every 60 s, lifecycle events, no traces), and `boat snapshot pull`
   for reading a stopped sandbox's files without resuming. These are surfaces the 16 features and 78
   capabilities do not model."
   sources: ci (`Each job gets a fresh sandbox, billed per second, deleted when the job ends.`),
   opentelemetry (`boat pushes your account's telemetry to one OTLP/HTTP endpoint that you choose.`),
   snapshots/download-and-delete (`You can read the files of a snapshot without starting the sandbox.`).

Use one or two entries, not four, if the parent prefers a quiet changes log. Entry 1 and 2 are the material
corrections; 3 is a pricing/limit change; 4 is new-surface news.

### `site/scripts/price-baseline.json`

Add `https://docs.boat.dev/limits` to `pricing/boat.json.sources` (money-bearing now) and refresh
`https://docs.boat.dev/pricing` after review.
Do **not** hand-edit; run `npm run check-rates -- --update` from `site/`, then inspect the diff for all providers.
The Boat figures that disappear (`$22`, `$92.40`, `$184.80`, `$264`, `$3`, `$3.04`, `$4.95`, `$7.62`, `$8.19`,
`$14.61`, `$22.07`, `$2.52`, `$0.05`, `$0.053`, `$0.091`, `$0.112`, `$0.140`, `$0.201`, `$0.235`, `$0.244`,
`$0.280`, `$0.315`, `$0.380`, `$0.384`, `$0.560`, `$0.568`, `$0.630`, `$1.12`, `$1.26`, `$1.52`) are explained by
the removed 3× burst table and the rewritten competitor/performance tables; no Boat tariff is among them.

---

## 8. Verification, coverage and limits

### What was checked

- **Sitemap coverage:** 219/219 URLs fetched (100 guides + 119 API references), HTTP 200, cache-busted `.md`.
  The 17 `docs.json` URLs and the 10 `sources` URLs are all in that set and all return 200.
- **Row coverage:** 16/16 feature rows and 78/78 capability rows have a verdict, a figure/specific, a cited
  URL, a verbatim quote and a change disposition in this file. The ID set matches
  `site/src/data/capabilities.json` exactly (no extra, no missing) — checked by script.
- **Quote audit:** 94 rows (16 features + 78 capabilities) mechanically matched against the page each row
  cites, after normalising whitespace, Markdown emphasis/backticks, link syntax and the docs' `\$` escapes:
  **88 exact**, 4 reworded (`files-survive-stop`, `cheap-pause`, `storage`, `snapshots-forks`), 1 quote-choice
  (`ways-to-drive`), 1 curly-quote-only (`mount-buckets`). Every new quote in this file was then re-read in
  context, not just matched.
- **Freshness:** pricing fetched with Context `maxAgeMs: 0` (`cache_metadata.status = "miss"`, `age_ms = 0`,
  `dateModified 2026-11-09T06:58:40.483Z`), re-read cache-busted and rendered; limits/stop/data-retention/terms/
  privacy/status the same. No cached scrape was used for a price. The prior thread's warning about stale
  `docs.boat.dev/*.md` is still true; every quote here is from a `?x=<epoch>` fetch.
- **Arithmetic:** A/B/C were not recomputed as totals (no rate moved). The only new arithmetic is the extra-start
  brackets: 1,000-in-a-day ≈ $50 (day bracket; $50–$52 if compressed), full 1,200 day = $64, full 6× day by plan = $64 / $268.80 / $537.60 / $768.
  Cross-checked by hand from the limits table. `cost.test.ts` fixtures `["boat","a",20]`, `["boat","b",26.28]`
  and `price(card("boat"), task(16,32,60)) == 100` still describe the live card.
- **Repo state:** no repo data file was edited, staged or committed by this thread. Only
  `.amp/in/scratchpad/boat-recheck.md` and the `.amp/in/scratchpad/boat-pages/` fetch cache were written.
  Baseline `origin/main` **4432d00**; worktree was clean at the start.

### What was not verified (desk research)

- No account, API key, dashboard session, sandbox, command, resume, fork, snapshot, CI job or bill. Dashboard
  tab inventory is from docs plus the logged-out JS bundle; the bundle's strings are strong evidence but not a
  rendered logged-in page.
- No latency measured. "A few seconds", "usually under one second", the 15 GB restore range and the 99.95%
  uptime are **provider claims/probes**, not this guide's measurements.
- No provider-announced dates for the changes. Sitemap `lastmod` is a page revision date, not a launch date;
  the report says "changed by <date>" only where that is literally what the sitemap shows, and never invents an
  announcement date.
- The status page's percentages are computed client-side from `history.json`; `incidents.json` is a public feed
  that the page's `script.js` does not fetch. The incident counts are this thread's tally from the JSON, not a
  provider-published number.
- `battleships.dev` is dated **2026-09-30** and still disagrees with the docs on disks (12/50/125/251), egress
  (2 TB cap), `pause_resume`, `custom_image`, `sdk`/`mcp_server`, `soc2`, `spend_limits`, `eu_data_residency` and
  `xlarge` access. It is disclosed as Boat-built and was used only as a cross-check; no rate or verdict here
  rests on it alone.
- The Terms page says "Effective: October 12, 2026 / Version: 2026-10-12" but its retention sentence differs
  from the one the 2026-10-28 pass recorded ("approximately 30 days"). Either the page was revised without a
  version bump or the earlier pass read a cached copy. The current text is what is quoted; the revision date is
  **not published**.
- `docs.boat.dev` has **no changelog page** in its 219-URL sitemap (`/changelog` and `/changelog.md` also 404), `/blog` has three posts
  (Jun 30, Aug 8, Aug 11, 2026) and no product-release feed. Sitemap `lastmod` is the only change signal. The
  request's "changelog" check therefore = blog (no new post) + sitemap dates (many pages revised after 10-28).

### Tool log (what actually succeeded)

| Tool / route | Used for | Result |
|---|---|---|
| **Context.dev MCP `web_scrape`** (`maxAgeMs: 0`) | pricing, limits, stop, terms, privacy, homepage, YC | **Succeeded**; `cache_metadata {"status":"miss","age_ms":0}`, full Markdown, `dateModified` present. Primary route. |
| **curl** | `llms.txt`, `sitemap.xml`, 219 cache-busted `.md` pages, `status.json`, `history.json`, `incidents.json`, dashboard JS | **Succeeded** on every call (219/219 200). |
| **agent-browser (Chromium)** | `status.ascii.dev` rendered text/percentages, `boat.dev/terms`, `boat.dev/privacy`, homepage links, screenshots | **Succeeded**; needed for the Cloudflare challenge on `boat.dev/terms` and the JS-rendered status page. |
| **Amp `read_web_page`** | not needed | Not called. |
| **TinyFish** | not needed this pass (LinkedIn was not re-read) | Not called. |
| **Composio Parallel / Exa / Tavily / Firecrawl** | not needed; the provider's own Markdown index covered every page | Not called. The prior thread used them; this pass did not. |
| **`npm run check-rates`** | read-only price-baseline comparison | **Succeeded**; one `CHANGED` for Boat, explained above. |
| **battleships.dev** | cross-check only, disclosed | Read; dated 2026-09-30; not used as sole evidence. |
| **Y Combinator** | company facts | Read; founded/batch/team/location. |

### Coverage checklist (from `reference/provider-checklist.md`)

- `research/<id>.md` — claim ledger read; **needs the §3/§4/§5/§6/§7/§8/§9/§10/§14/§15/§17 updates in §6 above**.
- `research/rates/<id>.json` — read; **needs `checkedOn`, retention quotes, extra-start brackets, invoice caps**.
- `research/usecases*.json` / `capabilities-NOTES-*` — read; no Boat shard decision is overridden except
  `warm-pool` (the shard never considered the fail-fast page) and `backups` (the shard said `yes`; the site's
  `partly` is the better reading and should stay).
- `site/src/data/providers/boat.json` — audited field by field in §6; **not edited**.
- `site/src/data/pricing/boat.json` — audited; **no numeric change**, notes need the 14-day/6× wording.
- `site/src/data/docs.json` — all 16 URLs load; no change required.
- `site/src/data/features/*.json` — 16 rows audited; 1 verdict change (`lifecycle`), 2 quote changes
  (`sizes-regions`, `snapshots-forks`), 1 quote-choice (`ways-to-drive`); shared prose in §7.
- `site/src/data/capabilities.json` — 78 rows audited; **2 verdict changes** (`pause-memory` → partly, `warm-pool` → partly),
  1 recommended (`web-terminal`); several note/figure corrections; all `partly` rows keep a shortfall.
- `site/src/data/usecases.json` — 10 routes reviewed; **`claude-code-team` dashboard wording is wrong**;
  `browser-agent` price needs the size named. No tier change justified by this pass.
- `site/src/data/situations.json` — 8 groups reviewed; 4 Boat `watch` strings need the 14-day/10-minute wording.
- `site/src/pages/compare/side-by-side.astro` — `boat: "Full VM"` still right; counts unchanged.
- `site/src/data/changes.json` — suggested entries in §7.
- `site/scripts/price-baseline.json` — `pricing` CHANGED (competitor/performance tables + removed 3× table);
  add `limits`; update after review.
- `site/src/lib/cost.test.ts` — **no change**; A/B and the xlarge gate still pass. No C fixture for Boat
  (C is usage $1.62, below the $20 floor; adding one would test the floor, not a new rate — optional).
- `README.md` / `site/README.md` / `site/src/data/site.json` — counts unchanged (16 providers, 16 features,
  78 capabilities, 10 use cases); no edit needed. The only stale copy is the provider prose.
- `site/src/data/models.json` — untouched (no model-price refresh in this pass).

### Bottom line (plain language)

Boat still costs the same: $0.018 / $0.036 / $0.072 / $0.200 an hour for the four sizes, a $20-a-month minimum,
free egress, and 10 included saved snapshots per $20 of plan. The biggest correction is that a **stop is not
quite the destroy-and-reboot** the guide describes: Boat holds the machine for **ten minutes** without billing
you, and a resume in that window usually comes back with its memory, open programs, terminals and the same IP.
After ten minutes it is a fresh boot with a new IP, as before. The disk is now promised for **at least** 14 days
rather than exactly 14, and Boat's own cleanup job is **not deleting anything in production yet** — so the
guide's "your disk is gone on day 15" line is too strong today, though the 14-day promise is still the number to
plan around. Paid starts also got more generous: **1,200 a day** on the $20 plan (was 600), with the top
$0.07 bracket running to **6×** the limit, and you can now put them on the invoice instead of the wallet.
Everything else that matters for a buyer — no pause state, no GPU/ARM, EU-only, no custom domain, no SSO or audit
log, no SLA, SOC 2 still in progress — is unchanged. **Action for the owner:** integrate the verdict/prose
changes above, decide whether to call the 10-minute window "partly" (my recommendation, consistent with
Sandboxer) or keep "no" and only fix the wording, and review the price-baseline diff before `--update`.

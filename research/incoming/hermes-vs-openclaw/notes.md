# Hermes Agent vs OpenClaw: research notes

Checked 2026-10-29 against `origin/main` at `911a347`. Artifacts in this folder:

- `facts.json`: 16 dimensions, 63 sourced facts (array of `{dimension, hermes, openclaw, sources[]}`).
- `notes.md`: this file.

This is desk research for a comparison page about the two agents. It deliberately does **not** repeat
what `site/src/data/usecases.json` already covers for `hermes-agent` and `openclaw`: machine size for
hosting, whether the agent must stay on, what must survive a restart, and per-provider setup routes.
Those pages stay the source of truth for hosting choices; this page is for someone choosing between
the agents themselves.

## Method

1. **Discovery.** Parallel `web_fetch` for the Hermes docs home and GitHub repo, then Exa
   `web_fetch_exa` for two Hermes pages. Both docs sites publish `llms.txt` and `llms-full.txt`
   (Hermes 6.0 MB, OpenClaw 30.3 MB); these were used to find the right page for each topic and to
   locate candidate passages.
2. **Verbatim check.** Every quoted sentence was then re-fetched from the cited page over plain HTTP
   (the docs are static HTML), converted to text, whitespace-normalised, and matched mechanically
   against the stored quote. 63 of 63 quotes matched on 2026-10-29. Quotes were copied from the live
   page, not from the `llms-full.txt` digest, and markdown emphasis was avoided inside quotes so the
   match is against rendered prose.
3. **Counters.** Stars, forks, creation dates and release dates come from the GitHub REST API
   (`gh api`), tagged `third-party`. Star counts move continuously: the values are a snapshot, not a
   fixed property (Hermes moved by 3 stars during this session). OpenClaw's current npm version came
   from the npm registry (`npm view openclaw`), also `third-party`.
4. **Release counts.** `gh api repos/<repo>/releases` with `per_page=100`, counted by `published_at`
   in the 30 and 90 days to 2026-10-29. These counts are derived, not quoted, so they appear in the
   dimension text only; the quote attached to that dimension is the latest release's name.

### Tools and spend

- Parallel Search: 1 `web_fetch` call (5 URLs). Exa: 1 `web_fetch_exa` call (2 URLs).
- Direct HTTP GET (curl / Python `urllib`) for every cited page and for the two READMEs and LICENSE
  files. GitHub CLI for repository and release metadata. npm CLI for the OpenClaw package version.
- No TinyFish or Context calls were needed; both docs sites expose static HTML and `llms.txt`.
- Estimated paid spend **under $0.05** (two extraction calls, a handful of URLs), well inside the
  $0.50 cap. Exact billing is not visible from the orb, so treat this as an estimate.

## What the facts say, dimension by dimension

| Dimension | Hermes Agent | OpenClaw |
| --- | --- | --- |
| Maker and licence | Nous Research, MIT | OpenClaw Foundation (independent 501(c)(3)), MIT |
| Chat apps | 28-row platform table: Telegram, Discord, Slack, WhatsApp, Signal, SMS, email, iMessage via BlueBubbles/Photon, Teams, Matrix, Google Chat, IRC, SimpleX, and more | Core plus official-plugin channels: Discord, Google Chat, iMessage, Mattermost, Signal, Slack, Telegram, WebChat, WhatsApp, QQ Bot, Feishu, IRC, LINE, Matrix, Teams, SMS, WeChat, X, Zalo, and more |
| Models / BYOK | Any provider; Nous Portal is the recommended route (300+ models plus tools); bring-your-own keys supported | Model-agnostic; bundled provider plugins (OpenAI, Anthropic, Gemini, Z.AI, OpenRouter, Bedrock, xAI, NVIDIA, MiniMax) plus Ollama/vLLM/LM Studio; keys in the auth store or Gateway env |
| Memory | Two capped files: `MEMORY.md` 2,200 chars, `USER.md` 1,375 chars; no auto-compaction | Markdown files in the workspace (`MEMORY.md`, `memory/YYYY-MM-DD.md`); "the limit is your storage"; pre-compaction flush |
| Skills and plugins | `~/.hermes/skills`, agentskills.io standard, agent can create/edit/delete; MCP for external tools | `SKILL.md` folders, workspace and `~/.openclaw/skills` overrides, ClawHub registry; separate plugin packages |
| Scheduled tasks | `cronjob_manage` tool, natural language or cron, script-only jobs, webhook triggers; gateway ticks every 60 s | Built-in "Automations" scheduler; `openclaw automations`, `openclaw cron` alias; delivers to chat, webhook or nowhere |
| Browser and computer use | `browser_exec` on packaged Chromium or cloud browsers; desktop control through `cua-driver` on macOS/Windows/Linux | Dedicated agent-only Chrome/Brave/Edge profile; `computer` tool on Gateway or paired node desktops (Peekaboo/CUA) |
| Multi-user and teams | Allowlists, Discord role lists, DM pairing; per-user session isolation; Bot Mode is multiple agents, not multiple human accounts | First-class multi-user mode: creator, assignable owner, participants, presence; but one gateway is one trust domain |
| Install | `install.sh`, `install.ps1`, desktop DMG/MSIX, Docker, Nix, Termux APT | `install.sh`, `install.ps1`, npm, Docker, Nix, macOS menu-bar app, Windows Hub |
| OS support | Tier 1: macOS Apple Silicon, Windows 10/11, Linux/WSL2, Docker. Intel macOS not supported for desktop | macOS, Linux, Windows (native Hub, PowerShell installer or WSL2); pages for iOS, Android, ChromeOS |
| Machine size | 1 GB / 1 core / 500 MB minimum; 2–4 GB and 2 cores recommended; 2 GB with browser | 1 vCPU / 1 GB / ~500 MB minimum; 1–2 vCPU and 2 GB+ recommended |
| Security | Eight layers: user authorization, command approval (smart/manual/off), file-write safety, container isolation, MCP credential filtering, context scanning, session isolation, input sanitization | Sandboxing off by default (Docker/Podman/SSH/OpenShell/Crabbox); permission modes read-only/guarded/workspace/full; loopback bind, DM pairing, allowlisted groups |
| Hosting | Hermes Cloud (Nous Portal) or self-hosting | No first-party hosted service; docs publish VPS guides (Fly.io, Hetzner, DigitalOcean, GCP, Azure, …) |
| Releases | v0.22.5 on 2026-10-23; 8 releases in 30 days, 21 in 90 | 2026.10.9 on 2026-10-29; 29 releases in 30 days, 49 in 90; stable/extended-stable/beta/dev channels |
| GitHub | about 258,474 stars, 56,761 forks; created 2025-07-22 | about 393,376 stars, 82,688 forks; created 2025-11-24 |

## Differences worth building the page around

These are factual contrasts, not a ranking:

- **Commercial shape.** Hermes has a commercial parent product: Nous Portal subscriptions and Hermes
  Cloud. OpenClaw's README says the Foundation has "no paid tier, hosted service, or token".
- **Memory design.** Hermes caps memory at roughly 3,600 characters across two files and refuses
  writes past the cap. OpenClaw treats memory as ordinary Markdown files on disk.
- **Sandbox default.** OpenClaw's docs say sandboxing is off by default and call it "not a perfect
  security boundary". Hermes ships an approval system with three modes and container isolation as
  one of eight listed layers.
- **Team model.** OpenClaw documents multi-user sessions with owners and presence, then warns the
  gateway is one trust domain. Hermes documents allowlists and per-user sessions but no equivalent
  ownership model; its "Bot Mode" is a roster of agents.
- **Breadth vs depth of channels.** Hermes lists 28 platform rows in one table, including regional
  apps (DingTalk, Feishu, WeCom, Weixin, QQ, Yuanbao, LINE). OpenClaw spreads channels across core
  and official/external plugins, with a comparable long tail.
- **Release rhythm.** OpenClaw ships far more often (29 releases in 30 days vs 8), and its docs
  describe a beta-first promotion path; Hermes ships roughly one or two releases a week.

## Gaps and cautions

- **No hands-on testing.** Nothing here was installed or run. The task was desk research, and the
  repo's rules forbid creating accounts or billable sandboxes without authorisation.
- **Docs-only claims.** Every statement is a documentation claim, not a measured result. Where the
  docs describe behaviour ("sandboxing is off by default"), the page should attribute it to the docs.
- **Stars drift.** The GitHub counters change minute to minute; the values are a 2026-10-29 snapshot.
  If the page shows them, it should show the date and probably round them.
- **Platform counts conflict slightly.** Hermes' `llms.txt` says "21+ messaging platforms", while the
  messaging page table lists 28 rows (including variants such as WhatsApp Cloud API and WeCom
  Callback). The page should say "the platform table lists 28 entries" or avoid a hard number.
- **OpenClaw channel counts.** The README says "20+ more" channels; the docs catalogue is the better
  source for a specific list.
- **Hermes Cloud details are thin.** The docs confirm it exists and is managed from the Portal; they
  do not publish prices or machine sizes in the pages read here. Do not infer them.
- **OpenClaw release cadence has no single docs statement.** The cadence figure is derived from
  GitHub release timestamps; the docs only describe the channels.
- **Pricing of the agents themselves is out of scope.** Both are free to install; model usage is
  billed by the provider. The site's existing cost engine and rate cards do not model either agent.
- **Version numbers age fast.** Re-check `releases/latest` and the npm dist-tags before publishing.

## Known issues the docs themselves state

Hermes:

- One Hermes home serves one agent process; two writers compound each other's memory entries.
- Each profile needs its own WhatsApp number/session; profiles cannot share one number.
- Memory writes fail at the character cap until the agent consolidates.
- Intel macOS is not a supported platform for the desktop installer.
- `hermes update` does not work for Docker installs; update by pulling a new image.

OpenClaw:

- One gateway is one trust domain; ownership and presence are not security boundaries.
- Sandboxing is off by default and is described as damage limitation, not a hardened boundary.
- The default Docker image is security-first and excludes system packages, Homebrew and browsers.
- Memory persists on disk, but session context is still limited by the model window.
- The `dev` channel "may contain incomplete features or breaking changes" and is not for production.

## Source inventory

Official docs and repositories only, plus GitHub/npm counters:

- Hermes: docs home, installation, platform support, messaging, security, memory, skills, cron,
  browser, computer use, providers, Docker, Bot Mode, FAQ, Discord messaging, Hermes Cloud guide;
  GitHub repo, LICENSE, releases and repo API.
- OpenClaw: docs home sections for install, VPS, channels, models, memory, skills, cron, browser,
  computer use, multi-user, sandboxing, security, permission modes, development channels, FAQ pages;
  GitHub repo, LICENSE, releases and repo API; npm registry.

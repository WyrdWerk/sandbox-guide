# Search demand and trends for Botperch

- **Collected:** 2026-10-29 between 19:10 and 20:15 UTC (2026-10-30 00:40 to 01:45 IST)
- **Written:** 2026-10-30 01:50 IST (2026-10-29 20:20 UTC)
- **Tools:** treg MCP, team `wyrdwerk-2`. Total spend **$0.304**: SE Ranking volume $0.2381
  (four calls), Serpstat volume and keyword ideas $0.0555 (five calls), DataForSEO trends $0.0048
  (four calls), DataForSEO SERP $0.006 (three calls). One batch failed on a connection timeout; the
  treg balance ($5.7475 → $5.5461 before the retry) showed it was not billed, and the retry used
  idempotency keys.
- **Market:** United States, English, Google. Monthly searches are the providers' estimates.
- **Raw rows:** [2026-10-30-search-demand.json](2026-10-30-search-demand.json)

## How to read these numbers

- Sources disagree on volume: Serpstat put "openclaw" at 246,000 a month, SE Ranking at 33,100.
  Compare direction and order of magnitude, not exact counts.
- SE Ranking's month-by-month history is noisy (it shows n8n at 470 in Nov 2025 and 165,000 in
  Oct 2026), so it is not used for growth claims. Growth below comes from DataForSEO's trends
  index, which is relative within each group of five keywords (0 to 100), averaged over the first
  and last 13 weeks of Nov 2025 to Oct 2026.
- "Not found" means the provider has no estimate, usually because volume is too small to track. It
  does not mean nobody searches it.
- "daytona" is mostly Daytona Beach and "code sandbox" mostly CodeSandbox; both overstate interest.

## Findings

1. **Demand follows the agent, not the word "sandbox".** Claude Code (368k to 550k), n8n (165k),
   MCP server (47.5k), Gemini CLI (40.5k), Manus (40.5k), OpenClaw (33k to 246k) and Hermes agent
   (27k) dwarf every sandbox term ("ai sandbox" 1,000; "ai agent sandbox" 110; "cloud sandbox" 170).
2. **Fastest growth** (trends index, first 13 weeks → last 13 weeks): Codex 18 → 70, Claude Code
   25 → 36, Hermes agent 0 → 6, OpenClaw 1 → 5, MCP server 3 → 4. Manus 2 → 3. E2B, Daytona,
   Modal and "cloud sandbox" were flat.
3. **Hosting intent exists and is underserved:** "openclaw hosting" 590 (KD 33), "remote mcp
   server" 390, "n8n hosting" 390 (KD 1, $156 CPC), "n8n self hosted" 720, "host mcp server" 170,
   "computer use agent" 660, "codex cloud" 660, "claude code web" 1,900, "openclaw setup" 440.
4. **Readers compare against general hosting, not only sandboxes:** Replit 246k, Render 90.5k,
   Railway 40.5k, Hetzner 22.2k, Hostinger VPS 3,600, DigitalOcean Droplet 1,000. Hostinger and
   OVH already rank for "openclaw hosting".
5. **Sandbox providers by name are small:** E2B 2,400 to 3,600, Cloudflare Sandbox 720, Runloop
   590 (KD 18), Koyeb 1,100, Beam 170, Steel 140, Morph 40. No estimate for Vercel Sandbox,
   Northflank, Browserbase, Blaxel, Sprites, exe.dev, Modal (as a sandbox).
6. **Security is a valuable cluster:** "prompt injection" 1,900, "mcp security" 590 ($14 CPC),
   "secrets management" 540, "agent security" 390 ($8.38 CPC), "claude code security" 2,900,
   "api key security" 70 ($12.65 CPC), "yolo mode" 320 (KD 7).
7. **Model cost is searched:** "openrouter" 96,200, "claude api pricing" 5,400, "llm api pricing"
   170. The calculator and chooser already estimate model cost; the static short answers and
   Markdown files do not yet carry a model figure.

## Who ranks today (DataForSEO SERP, US, top organic results)

| Query | Results |
| --- | --- |
| openclaw hosting | docs.openclaw.ai, reddit.com, hostinger.com, xcloud.host, openclawai.io, ovhcloud.com |
| ai agent sandbox | medium.com, reddit.com, windmill.dev, github.com, luiscardoso.dev, blaxel.ai, northflank.com, kdnuggets.com |
| remote mcp server | mcpservers.org, reddit.com, mcp.so, github.com, lobehub.com |

No neutral price comparison ranks for any of the three; Reddit ranks for all three.

## What was built from this (same night)

Search-worded titles, short answers, structured data and an About page (`f2a4e10`); head-to-head
and alternatives pages for E2B, Daytona, Modal, Vercel Sandbox and Cloudflare Sandbox, IndexNow
and dated provider descriptions (`7b521a2`).

## Open next steps

Claude Code safety guide; Hermes vs OpenClaw; model figure in static short answers; security
pages; managed-hosting and VPS routes on the OpenClaw, Hermes and n8n guides; VPS providers as a
category; a monthly treg trend check into this folder.

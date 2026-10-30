# Missing use-case route rows: research notes

Research date: 2026-10-30. Desk research only: no provider account, sandbox, credential or purchase was used. Artifact: `research/incoming/routes/routes.json` (35 rows).

## Scope checked against the live data

`site/src/data/usecases.json` was read before research. It has 10 guides and 21 providers. `hermes-agent` and `openclaw` already have all 21 routes. The other eight guides were short by exactly the rows in the brief:

| Guide | Routes before | Missing |
| --- | ---: | ---: |
| coding-agent | 16 | 5 (blaxel, modal, morph, runtime, sprites) |
| code-interpreter | 11 | 10 (agent37, blaxel, boat, boxd, instabox, lizard, morph, runtime, sandboxer, sprites) |
| browser-agent | 6 | 15 (agent37, blaxel, boat, boxd, cloudflare-sandbox, daytona, e2b, instabox, lizard, modal, morph, runtime, sandboxer, sprites, vercel-sandbox) |
| workflow-automation | 20 | 1 (tensorlake) |
| chat-bot | 20 | 1 (tensorlake) |
| claude-code-team | 20 | 1 (tensorlake) |
| scheduled-scraper | 20 | 1 (tensorlake) |
| mcp-server | 20 | 1 (tensorlake) |

A script compared the provider files with each guide's existing `routes`; all eight differences matched the brief exactly. The 35 written rows therefore bring every guide to 21 routes. No duplicate `useCase`/`provider` pair exists in the artifact.

## Method and tools

- Discovery: Exa search over provider documentation and `llms.txt` indexes. Exa was the first search tool used; TinyFish and Context were used later for the absence cross-checks, not at the start.
- Page retrieval and quote checking: Firecrawl `scrape` on the live pages (rendered Markdown), plus Firecrawl for the pricing pages.
- Gap cross-check: Context `web_search` and TinyFish `search` for the two cases where the row says a page does not exist (Tensorlake MCP hosting, Sprites browser docs).
- No native Amp web tools were used. Tavily and Parallel were not used because Exa and Firecrawl returned usable pages.
- Every quote was matched mechanically against the fetched page after normalization: Markdown links reduced to their text, emphasis and backticks removed, table escapes (`\|`, `\$`) removed, whitespace collapsed. The quote text in the artifact is the visible sentence, not the raw Markdown. A plain `curl` check was also run and missed 11 JS-rendered pages; those were rechecked through Firecrawl, which renders them. All 47 evidence entries were checked.
- `checkedOn` is 2026-10-30 for every entry. It is the date the page was read, not a provider announcement date.

## Tier calls

- `guide` means the provider publishes a page that shows running code, a coding agent or a browser from its API. For code-interpreter this follows the existing rows: e2b, daytona, modal, vercel and cloudflare are `guide` because the sandbox API is documented, even where there is no separate "interpreter" product. Agent37 is `backend` because the product is an agent host and `exec` is documented as an escape hatch, not a sandbox API.
- `preinstalled` in browser-agent means the browser or desktop is in a provider image or template: blaxel, boat, boxd, instabox, lizard, sandboxer and agent37. `partly` for no-terminal means the dashboard can open or watch the desktop, but building or driving the agent still needs code or a template build.
- `manual` means there is no browser or desktop image and no guide: cloudflare-sandbox, sprites and vercel-sandbox. For Sprites, Fly's own blog says Playwright "doesn’t (currently) come preinstalled", and the docs index says the image is a full Linux with "install any tools".
- `manual` for Modal on coding-agent: there is no Claude Code guide and a sandbox ends after at most 24 hours, but Modal documents mounting a Volume into a sandbox and filesystem snapshots. A developer can keep the repository and `~/.claude` on a Volume and start a fresh sandbox each session; that is a build-it-yourself route, not a documented one. An earlier draft called this `none`; that was wrong because the use case needs eight-hour sessions with persistence, not a continuously running machine.

## Absence claims and how they were checked

These rows say a guide or image is missing. Each was checked against the provider's own documentation index and a site-restricted search:

- Tensorlake: `docs.tensorlake.ai/llms.txt` has no n8n, Discord/Slack bot or MCP-hosting page. Its only MCP material is `chrome-devtools-mcp` attaching to a sandboxed Chrome (`sandboxes/chrome-cdp`), which is the opposite direction: an MCP client, not hosting the reader's server. Context and TinyFish searches returned the same two pages.
- Sprites: `docs.fly.io/sprites` has no Claude Code or browser page. The browser claim rests on Fly's first-party blog, tagged `inferred` because it is not documentation, plus the docs index for "install any tools".
- Vercel Sandbox: no browser page in the Sandbox docs. Vercel Labs' `agent-browser` example installs Chromium and its dependencies in a Vercel sandbox; the row links the official run-commands page, which documents `--sudo` installs.
- Cloudflare Sandbox: no browser or desktop page. Cloudflare's browser product is Browser Run, documented separately. A Cloudflare maintainer declined a Chromium base image in the sandbox SDK and pointed users to Browser Rendering or a custom image (https://github.com/cloudflare/sandbox-sdk/pull/506); that PR comment is not used as the row's evidence.
- Agent37: no code-interpreter product; `exec` is documented as "the escape hatch for anything the API does not wrap as its own call".

## Prices

- Only one new row carries a price: boat in browser-agent. The browser preset is 30,000 ten-minute sessions = 5,000 machine-hours on 2 vCPU / 4 GB; the small shape is $0.018 an hour, so about $90 of usage, which the $100 plan covers. The quote and rate are from `docs.boat.dev/pricing`.
- Other new rows have `price: null`. The existing code-interpreter rows leave sandbox prices null (e2b, daytona, modal, vercel, cloudflare, tensorlake), so the new sandbox rows follow that. The calculator still prices every provider from its rate card and the matching preset; no new figures were invented.
- The site's rate cards were used as the source of the workload and shapes. No rate was copied from a neighbouring provider.

## Standfirst and count review

No standfirst needs to change. The numeric claims are unaffected by these rows:

- workflow-automation: "Three providers set it up in one click" — Tensorlake is manual, so still three.
- chat-bot: "No provider hosts your own bot in one click; one provider's guide stands out" — Tensorlake is manual and has no bot guide.
- claude-code-team: "Six providers ship it preinstalled and one sets it up in one click" — Tensorlake is manual, so still six and one.
- mcp-server: "One provider deploys one in a click, a few publish guides" — Tensorlake is manual, so the count stands.
- coding-agent, code-interpreter and browser-agent have no numeric route claims; scheduled-scraper has none either.

## Gaps and judgment calls the parent should review

1. **Tensorlake n8n / chat-bot / MCP-server** are `manual` because the capability exists but no guide does. A named sandbox suspends after `timeout_secs` of no proxied traffic (600 s default), so a schedule or an idle gateway stops. The rows link `sandboxes/commands`, `sandboxes/networking` and `sandboxes/lifecycle`; the parent may prefer a single lifecycle link for all three.
2. **Tensorlake scheduled-scraper** is `guide` because the cron scheduler is real and first-party, but it triggers an orchestration endpoint, not a sandbox directly. The `what` says the application starts the sandbox; the parent should keep that distinction.
3. **Tensorlake claude-code-team** is `manual` over SSH/VS Code. The coding-agent guide uses the OpenCode plugin; there is no team-specific guide and no per-developer Claude role.
4. **Modal coding-agent** is `manual`, not `none`. A sandbox ends after at most 24 hours, but the use case needs eight-hour sessions with the repository kept, not a machine that stays awake. Modal documents mounting a Volume into a sandbox and filesystem snapshots, so the route is a Volume for the repository and `~/.claude`, a fresh sandbox per session, and an optional snapshot for installed tools. There is no Claude Code guide, so the tier is manual. This row was reclassified after review; the earlier `none` draft was wrong.
5. **Agent37 browser-agent** is `preinstalled` / `partly`, not `one-click`: the stock Hermes template has a browser, but a custom desktop needs a template build. The Personal product is one-click for a ready-made agent, not for the reader's own harness.
6. **Cloudflare Sandbox browser-agent** is `manual`; the separate Browser Run product is not the Sandbox product the calculator prices. If the parent prefers, this could be `none` with a note that Browser Run is the right Cloudflare product, but the sandbox can run a custom Chromium image.
7. **Vercel and Sprites browser-agent** are `manual`; both have a credible install path but no browser image. The Vercel row relies on the documented `--sudo` install path; the Sprites row relies on Fly's blog plus the docs index.
8. **Lizard browser-agent** links the sandboxes overview rather than a desktop-specific page; the overview names the `desktop` and `desktop-camoufox` templates and the Chromium desktop. Lizard also has a code-interpreter page, which the code-interpreter row uses.
9. **Boat price** is the only computed figure. It is the browser preset, not a measured workload; the row says "about".

## Tool spend

- Firecrawl: 117 credits consumed during the run (410 remaining before, 293 after, on a 1,000-credit period allowance). The API response does not expose a dollar rate, so I cannot prove a sub-$1 charge from the response alone; it is about 12% of the period's credits.
- Exa, Context and TinyFish: calls succeeded; their responses showed no per-call dollar charge. No paid Tavily or Parallel calls, and no provider purchases or accounts.

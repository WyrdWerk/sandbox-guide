# Group 3 — recent incidents, 6 August to 4 November 2026

Read-only desk research. No site data, schema or pricing was edited; nothing was committed or pushed.
Window: **2026-08-06 00:00 UTC to 2026-11-04 23:59 UTC** (the 90 days ending 4 November 2026).
Only each provider's own status page or incident history was used as evidence. StatusGator, Reddit, X, forums and archives were not consulted.

## Runtime — 0 incidents

- Status page: <https://withruntime.com/status>; machine-readable <https://withruntime.com/status.json> and <https://withruntime.com/status.md>.
- `status.json` has `"incidents": []`. The HTML page renders "None recorded since September 23, 2026." and the Markdown page "No incidents recorded."
- **The record begins 2026-09-23** (`"record_begins":"2026-09-23"`), so the page cannot speak to 6 August–22 September. The zero is a real zero for 23 September–4 November only.
- Measured uptime as of 2026-11-04 06:51 UTC (the page's own windows):
  - API: 97.34% last 24 hours (715 readings), **99.58% last 7 days** (5,035), **98.84% last 30 days** (21,588), 99.11% since 23 September (29,944).
  - Sandbox starts: 97.91% last 24 hours (144 runs), **98.80% last 7 days** (1,008), **98.42% last 30 days** (4,317), 98.75% since 23 September (5,963).
- At fetch time the API check had just failed (last reading 06:48 UTC, state "down") and the sandbox-start check was mid-run ("Starting"). That is a snapshot, not an incident entry; the page records no incident for it.
- The company fact says only "no incidents, record begins 23 September" because that is what the quoted sentence supports; the uptime numbers above are recorded in the JSON entry's `method` field and in this note.

## Scaleway — 8 incidents naming Instances or Block Storage

Counted from `history.json` (November, October, September on page 1; August on page 2) plus each incident page. 175 incident pages were fetched for August–November; 168 started inside the window. Component lists exist on only some incidents, so the filter is: the title, or the page's "This incident affected/affects" line, names Instances or Block Storage. Managed-database "instances" (PostgreSQL, MongoDB) and scheduled maintenance are excluded.

Most significant (verbatim titles):

1. **"[fr-par-1] Latencies spikes during the day following capacity increase in one of block storage cluster"** — started 2026-10-29 11:01 UTC, **still open on 4 November** (last update 30 October 21:32 UTC, status "identified"). Affects Block Storage, Databases and Instances. <https://status.scaleway.com/incidents/l35th3qpv30h>
2. **"[INSTANCE][FR-PAR-2] Outbound connectivity issues"** — page says it began 15 September at 5:00 p.m. UTC+1 (16:00 UTC) and resolved 16 September 09:57 CEST (07:57 UTC), about 15 h 57 min; first status update was 16 September 08:22 CEST. Affects Instances, fr-par-2. <https://status.scaleway.com/incidents/7f4txhwpnhjv>
3. **"[FR-PAR-1] - Failure in cooling system"** — 2026-10-16 17:22–18:24 UTC (1 h 2 min), room 108; "Servers in room 108 experience temperature increase. This lead to CPU throttling and may result into unreachable instance." Affects Instances, fr-par-1. <https://status.scaleway.com/incidents/wnnrzjjcvt0h>

The other five: "Temporary Traffic Loss on partial FR-PAR-2 instances" (27 Aug, 9 min), "[Block Storage] [fr-par-2] - Block Storage control plane issue during upgrade" (21 Oct, 5 min), "[Instances] - AMS1 / Room Hall6 / Rack 6.12.32 - ams1dc1-net-f02lf75.ams1 crashes multiple time" (19 Oct, 2 min), "[VPCL] - [WAW2] - Some Instances were not reachable using VPC on PL-WAW-2" (17 Aug, single update), "[Instances] - not all resolvers updated with new subnet  78.232.0.0/21" (16 Sep, single update).

Notes and gaps:
- Excluded maintenance: "[Scheduled] Scheduled Maintenance - Instances Control Plane (Milan)", 14 October, 11:08–12:40 CEST (completed).
- The 21 October Block Storage page states the outage ran 12:23–12:28 UTC but stamps its only update at 14:00 CEST (12:00 UTC); the body text was used.
- Incidents with a single update publish no end time, so their duration is unknown, not zero.
- A network or datacentre incident that degraded Instances without naming them in the title or component list would be missed; Scaleway does not publish components for most incidents.
- Page timestamps are CET/CEST and were converted to UTC.

## Sprites (Fly.io) — 5 incidents

Parsed from the embedded history payload of <https://status.flyio.net/history> (incident.io page; component "Sprites" = `01KZSP42XPHFN5EEJMRJ433Y83`), cross-checked against `feed.atom` and two incident pages. The payload's oldest incident is 2026-08-05T20:26Z, so the window is covered.

Most significant:

1. **"Partial Sprites outage"** — 2026-09-23 18:44:21 UTC to 2026-09-24 02:12:43 UTC, **7 h 28 min**, component Sprites. Started as intermittent API failures near SJC, then spread to other regions. <https://status.flyio.net/incidents/01M37TXDN856S591W41YPEB22M>
2. **"Sprites API Partial Outage"** — 2026-09-02 23:03:57 to 2026-09-03 00:41:41 UTC, **1 h 38 min**, component Sprites. <https://status.flyio.net/incidents/01M1J5TSVGA1QX4GJGW9QA85J7>
3. **"Sprite hosting outage"** — 2026-10-11 23:30 to 2026-10-12 00:45 UTC, **75 min**; hosted sprites on `*.sprites.app` unavailable "due to a certificate error". No component is marked on the page. <https://status.flyio.net/incidents/01M4PS8CZW07R4EMEJK22H23NY>

The other two: "Sprite creates failing" (8 Oct, 28 min 41 s, Sprites) and "Sprite deletion jobs failing" (30 Aug, 47 min as stated in the update; no component marked).

Gaps: two of the five have no component on the page and are counted because their titles name Sprites. A Fly platform incident that degraded Sprites without naming it is not counted. Page times render in the viewer's timezone; UTC values come from the embedded payload.

The fact quotes the 11–12 October hosting outage rather than the longer September incident because Fly's incident pages state no duration in prose; this one publishes its exact window ("from approximately 2026-10-11 23:30 UTC through 2026-10-12 00:45 UTC"), so the quote itself carries the 75 minutes. The 7 h 28 min partial outage remains the longest in the incident list and in the notes above.

## Vercel Sandbox — 2 incidents

From <https://www.vercel-status.com/api/v2/incidents.json> (50 incidents back to 2026-05-25, so the window is fully covered), filtered on the Sandbox component.

1. **"Elevated latency in VCR, Blob, and Sandbox API"** — 2026-09-04 19:11:44 to 20:27:26 UTC, **1 h 16 min**, components Sandbox and Blob. <https://www.vercel-status.com/incidents/b6s5qz7tj35w> (shortlink <https://stspg.io/qjy1j78m6ssc>)
2. **"Elevated Sandbox error rates in Paris (cdg1)"** — 2026-10-06 09:12:06 to 09:36:55 UTC, **24 min 49 s**, component Sandbox, region cdg1. <https://www.vercel-status.com/incidents/xr8lx0kncx0g> (shortlink <https://stspg.io/sgzd0v141vpk>)

Gaps: only incidents with Sandbox tagged as a component are counted; the JSON endpoint keeps 50 incidents, which is enough here.

The fact quotes the history entry's published window ("Sep 4, 19:11 - 20:27 UTC") rather than the incident title, so the quote carries the duration; the title and affected components (Sandbox, Blob) come from the same history entry and its incident page.

## Vultr — count not readable

Vultr publishes **no incident history**. Its three documented status endpoints — `status.json`, `alerts.json`, `alerts.rss` — carry only current outages, current alerts and upcoming scheduled maintenance. On 4 November 2026 `alerts.json` held 48 alerts dated 24 September to 2 November, 47 `ongoing` and one `resolved`, and the HTML page has no history or archive section. An incident that started and resolved before 24 September is invisible, so the count is recorded as `null`, not zero.

This is a limitation of the provider's page, not a finding that Vultr had no incidents.

## Fetch log

| Provider | URL | Tool | HTTP | Result |
| --- | --- | --- | --- | --- |
| Runtime | <https://withruntime.com/status.json> | curl | 200 | `incidents: []`, uptime tables |
| Runtime | <https://withruntime.com/status> | curl | 200 | "None recorded since September 23, 2026." |
| Runtime | <https://withruntime.com/status.md> | curl | 200 | "No incidents recorded." |
| Scaleway | <https://status.scaleway.com/api/v2/incidents.json> | curl | 200 | 50 most recent incidents (back to 16 Oct) |
| Scaleway | <https://status.scaleway.com/history.json> | curl | 200 | Nov, Oct, Sep 2026 |
| Scaleway | <https://status.scaleway.com/history.json?page=2> | curl | 200 | Aug, Jul, Jun 2026 |
| Scaleway | <https://status.scaleway.com/history.json?page=3> | curl | 200 | May, Apr, Mar 2026 (not needed) |
| Scaleway | <https://status.scaleway.com/incidents/{code}> | curl, 175 pages | 200 each | titles, components, update times |
| Scaleway | <https://status.scaleway.com/api/v2/incidents/unresolved.json> | curl | 200 | confirmed 29 Oct incident still open |
| Scaleway | <https://status.scaleway.com/history.atom>, `/history.rss` | curl | 200 | 25 entries each; not used for the count |
| Fly | <https://status.flyio.net/> | curl | 200 | current page |
| Fly | <https://status.flyio.net/history> | curl | 200 | embedded payload with all incidents |
| Fly | <https://status.flyio.net/feed.atom> | curl | 200 | 60 entries back to 9 Aug |
| Fly | <https://status.flyio.net/incidents/{id}> | curl, 2 pages | 200 | verbatim titles, component notes |
| Vercel | <https://www.vercel-status.com/api/v2/incidents.json> | curl | 200 | 50 incidents back to 25 May |
| Vercel | <https://www.vercel-status.com/history.json> | curl | 200 | per-incident published time ranges, e.g. "Sep 4, 19:11 - 20:27 UTC" |
| Vercel | <https://www.vercel-status.com/history>, `/history.rss` | curl | 200 | cross-check only (25 RSS entries) |
| Vercel | <https://stspg.io/qjy1j78m6ssc>, <https://stspg.io/sgzd0v141vpk> | curl | 200 | redirect to the two incident pages |
| Vultr | <https://status.vultr.com/> | curl | 403 | Cloudflare challenge |
| Vultr | <https://status.vultr.com/> | Context.dev `web_scrape` | 200 | cache miss, request `fa239bd3-e40e-4298-b7fe-ec205062d4eb` |
| Vultr | <https://status.vultr.com/> | Context.dev `web_crawl` (depth 1, 60 URLs) | 200 | 70/71 URLs fetched, request `93d50afa-4fe2-42af-80b7-09a41a65624d` |
| Vultr | <https://status.vultr.com/status.json>, `/alerts.json`, `/alerts.rss` | curl (browser UA) | 200 | 48 current alerts, 24 Sep–2 Nov |
| Vultr | <https://docs.vultr.com/vultr-server-status-json-endpoints/> | Context.dev `web_scrape` | 200 | documents the three current-only endpoints |

Paid spend: three Context.dev calls (two scrapes, one shallow crawl) plus one scrape of Vultr's docs. No Parallel, Exa, Tavily, Firecrawl or TinyFish calls were needed; no provider account or billable sandbox was touched.

## Quote verification

Each quote was re-fetched fresh at check time and matched mechanically as a substring after normalisation. Normalisation applied, and nothing else: for JSON sources the file is parsed first so JSON escapes (`\u003c` etc.) become real characters; then HTML tags removed (script/style dropped), HTML entities decoded, Markdown `**`/`__`/backticks stripped, curly quotes and apostrophes converted to straight, whitespace collapsed to single spaces, and spaces before `, . ; : ! ?` removed. No words, numbers or punctuation were changed.

| Provider | Quote | Page | Present |
| --- | --- | --- | --- |
| Runtime | "No incidents recorded." | <https://withruntime.com/status.md> | yes |
| Scaleway | "[fr-par-1] Latencies spikes during the day following capacity increase in one of block storage cluster" | <https://status.scaleway.com/incidents/l35th3qpv30h> | yes |
| Sprites | "From approximately 2026-10-11 23:30 UTC through 2026-10-12 00:45 UTC some or all hosted sprites on the *.sprites.app subdomain were unavailable due to a certificate error." | <https://status.flyio.net/incidents/01M4PS8CZW07R4EMEJK22H23NY> | yes |
| Vercel | "Sep 4, 19:11 - 20:27 UTC" | <https://www.vercel-status.com/history.json> | yes |
| Vultr | "This endpoint includes all current outages, alerts, and upcoming scheduled maintenance." | <https://status.vultr.com/> | yes (Context.dev Markdown; curl gets 403) |

The Vercel quote is stored with `<var data-var='date'>` / `<var data-var='time'>` tags around the numbers; stripping HTML tags (as described above) yields the quoted string exactly. The Sprites quote is a rendered sentence from the incident page; its `*` is the literal wildcard in the provider's text.

All five quotes are tagged `docs-confirmed`: each is the provider's own status page or incident page, read live on 4 November 2026.

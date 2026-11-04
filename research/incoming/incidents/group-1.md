# Recent incidents, group 1 — blaxel, boat, cloudflare-sandbox, contabo, digitalocean

Desk research, read-and-report only. Window: **6 August to 4 November 2026** (90 days ending 4 November, inclusive). Evidence is limited to each provider's own status page or incident history. No site data was edited, nothing was committed or pushed.

Machine-readable file: `research/incoming/incidents/group-1.json`.

Headline counts (as listed today):

| Provider | Incidents in window | Longest | Note |
| --- | --- | --- | --- |
| blaxel | 25 | 15h 59m, us-was-1 workloads unreachable, 1 Sep | 22 of 25 hit Sandboxes |
| boat | none published | — | uptime/metrics only; no incident list |
| cloudflare-sandbox | 58 (Workers/Containers/DO only) | 56h 16m, Workers Cron Triggers, 9–12 Sep | 258 incidents total in window |
| contabo | 6 | CEPH degradation, posted 8 Sep, 900-minute estimate | no end times published |
| digitalocean | 15 | 25h 49m open, Cloud Control Panel and API, 24–25 Aug | postmortem counts 3.5h of impact |

---

## blaxel — 25 incidents

Source: `https://status.blaxel.ai` (Atlassian Statuspage). The API returns 25 incidents, from 2026-08-25 to 2026-11-03, so every one of them falls inside the window. That is below the 50-record cap, so the list is complete.

Components (read from each incident page): Sandboxes 22, Previews 6, Agents 6, MCP 6, Jobs 3, Model API 3, Console 1, no component 1. Regions appear only in titles: us-was-1 13, us-pdx-1 5, eu-fra-1 1.

Most significant:

| Title (verbatim) | Start | End | Duration | Component | Permalink |
| --- | --- | --- | --- | --- | --- |
| Some workloads unreachable in us-was-1 | 2026-09-01 00:24 UTC | 2026-09-01 16:24 UTC | 15h 59m | Sandboxes, Previews | https://status.blaxel.ai/incidents/01M1D5NBHMTGZKRHEAJD94CP7D |
| Some sandboxes are unavailable in us-was-1 | 2026-10-29 05:03 UTC | 2026-10-29 17:01 UTC | 11h 58m | Sandboxes | https://status.blaxel.ai/incidents/01M630MEXHGA4J5505K026WJ76 |
| Increase in volume errors | 2026-10-28 17:45 UTC | 2026-10-29 00:25 UTC | 6h 39m | Sandboxes | https://status.blaxel.ai/incidents/01M61SWT8R9HYR75TJBF34N9WR |

Incident detail pages are client-rendered (Next.js). The title is in `<title>` and the affected components are in the embedded RSC payload, matched against `/api/v2/components.json` ids. The API has no per-incident JSON endpoint (`/api/v2/incidents/<id>.json` returns 404).

The fact quote therefore comes from `/api/v2/incidents.json`, where the incident's name, `created_at` and `resolved_at` sit in one contiguous run of JSON. The rendered page shows the same span only in local time and split across update entries (start "Mon, Aug 31, 2026, 05:24 PM", resolved "Tue, Sep 1, 2026, 09:24 AM", America/Los_Angeles), so no single string on the HTML page carries both ends of the incident.

Gap: the 10 October incident "Elevated sandbox creation failures in us-was-1" marks no affected component, and region is only ever in the title.

## boat — no incident list published

Source: `https://status.ascii.dev`. The page renders a current status per component plus a 90-day block history and latency metrics. `script.js` fetches only `status.json` and `history.json`; there is no incident view, no incident titles and no dated outage entries anywhere on the page.

The host also serves `/incidents.json` (344 records, `retentionDays: 90`, generated 2026-11-04T06:51:01Z), but the page neither links nor renders it. Those records are automated probe failures, not incident reports: 41 are `outage`, 303 `degraded`, across Box Stop + Resume (extreme edge cases suite) 89, Box Fork 116, Box Creation 46, Ascii API 34, Box Dashboard 30, Box Desktop Streaming 24, Box SSH 5. The longest is a 174-hour run of the stop/resume edge-case probe (6–13 August), which is a repeatedly failing test of an extreme scenario, not a customer outage. Reporting it as an incident would mislead a buyer, so it is not in the fact or the incidents array.

Fact therefore says no incident history is published, and the count is `null` with the probe numbers recorded separately in `countNote`.

Gap: individual outages cannot be looked up by name or duration; only the uptime blocks show when something was down.

## cloudflare-sandbox — 58 incidents

Source: `https://www.cloudflarestatus.com`. The documented v2 API is capped at the 50 most recent incidents, which only reaches back to 19 October, so I used the endpoint the page's own History view calls: `/api/v3/history?type=incident&per_page=25`, paged by cursor from 4 November back to 31 July (11 pages, 275 records, no duplicates).

- 258 incidents start in the window.
- 58 of those name Workers, Containers, Sandbox or Durable Objects (case-insensitive). No incident names "Sandbox".
- Component appearances across those 58, for the Workers/Containers/DO side: Durable Objects 25, Workers 11, Workers Builds 9, Containers 8, Workers Assets 7, Workers AI 4, Workers KV 3, Workers Observability 1 (the same incidents also list Workflows 10, D1 9, R2 6, Artifacts 6 and a few locations).
- Scheduled maintenance (`type=maintenance`) is excluded, since the brief asks for incidents.

Most significant:

| Title (verbatim) | Start | End | Duration | Component | Permalink |
| --- | --- | --- | --- | --- | --- |
| Workers Cron Triggers degraded | 2026-09-09 19:17 UTC | 2026-09-12 03:34 UTC | 56h 16m | Workers | https://www.cloudflarestatus.com/incidents/sjs8s0q2x4hw |
| Issues with Workers Build failing to start | 2026-10-03 05:54 UTC | 2026-10-05 07:28 UTC | 49h 33m | Workers Builds | https://www.cloudflarestatus.com/incidents/q2bck6r39bzk |
| Cloudflare Workers build delays | 2026-09-30 15:33 UTC | 2026-10-01 21:27 UTC | 29h 54m | Workers Builds | https://www.cloudflarestatus.com/incidents/4m03612lprhr |

The sandbox-relevant entries are smaller: "Cloudflare Container Issues" (3 Nov, 1h 11m, https://www.cloudflarestatus.com/incidents/n5mvqjs26jg9) and "Unable to start containers in Asia-Pacific" (21 Sep, 41m, https://www.cloudflarestatus.com/incidents/rxmmx07ys7qg). The widest was "Elevated Errors for R2 and Durable Objects in ENAM" (21 Oct, major, 2h 07m, Durable Objects and R2).

Gap: "Workers" is a family name, so Workers AI, Workers KV, Workers Builds and Workers Assets incidents are all counted; a reader wanting only the sandbox runtime should read the two Containers entries plus the Durable Objects set.

## contabo — 6 incidents

Source: `https://contabo-status.com/` (single page, no archive) plus its Atom feed `/rss` (`rss.php`), read with Context.dev `web_scrape` (markdown) and curl. Six entries, ids 226, 225, 224, 223, 221, 213.

Times below are the page's own local clock labels, which it marks "(UTC+1)". The feed's `<updated>` stamps carry `+02:00` for October dates, so the offset the page prints is off by an hour for late-October and early-November entries; starts are shown as published and updates are shown in UTC from the feed.

| # | Title (verbatim) | Posted (as published) | Last update | Scope |
| --- | --- | --- | --- | --- |
| 226 | Patching of internal systems (CVE-2026-98432) | 3 Nov 2026, 00:00 (UTC+1) | in progress at fetch | Webspace, network boot, DNS resolvers, blog, backup servers |
| 225 | Issue with Auto Backup in the EU region | 2 Nov 2026, 15:48 (UTC+1) | 2 Nov 2026, 14:51 UTC | Auto Backup, EU |
| 224 | Customer Control Panel Synchronization Issue | 1 Nov 2026, 16:48 (UTC+1) | 3 Nov 2026, 09:44 UTC | Control Panel, account balances, new orders |
| 223 | Object Storage (EU region) – Service Disruption | 26 Oct 2026, 15:00 (UTC+1) | 2 Nov 2026, 16:03 UTC | Object Storage, EU |
| 221 | PHP security advisory (CVE-2026-115560): mitigation recommended | 23 Oct 2026, 14:00 (UTC+1) | 23 Oct 2026, 12:21 UTC | Webspace / PHP (advisory, mitigation) |
| 213 | Degraded Performance - CEPH Cluster: non-critical | 8 Sep 2026, 11:00 (UTC+1) | 14 Oct 2026, 12:28 UTC | Object Storage / CEPH cluster (APAC after 14 Oct) |

Most significant: #213 (oldest entry still listed, first posted 8 September, last updated 14 October, with a published estimate of 900 minutes), #223 (Object Storage EU, open 26 October into November), #226 (patching in progress on 4 November). The fact value quotes the #213 line in full — date, title and estimate — so it claims only what that line says; the 14 October last update is not part of the quote.

Excluded per the owner's instruction: the 26 October "unauthorized access" notice. **No such notice appears on the status page.** The 26 October entry is the Object Storage disruption above and is counted; nothing was dropped.

Gaps: no end times are published for any entry except the 900-minute estimate on #213, so durations cannot be computed. The page is not an archive — it lists six current entries and nothing older, so an incident closed and removed before 4 November would be invisible and the true 90-day total cannot be established. Per-incident URLs such as `/226` return a domain-parking 404; the only permalinks are the `#id` anchors on the main page.

## digitalocean — 15 incidents

Source: `https://status.digitalocean.com` (Atlassian Statuspage). The API's 50 most recent incidents run from 2026-04-28 to 2026-11-03, so the window is fully covered without pagination. 15 incidents start in the window.

Components: API, Cloud Control Panel, Support Center, NYC1/NYC3, MKC1, Global, ATL1, FRA1, Bangalore/BLR1, plus product-level entries (Functions, App Platform, Container Registry and Spaces, VPC Networking, DNS for Managed Kubernetes, Kubernetes cluster management).

Most significant:

| Title (verbatim) | Start | End | Duration | Component | Permalink |
| --- | --- | --- | --- | --- | --- |
| Cloud Control Panel and API | 2026-08-24 17:14 UTC | 2026-08-25 19:04 UTC | 25h 49m open | API, Cloud Control Panel | https://status.digitalocean.com/incidents/4qwm6pzlx1z3 |
| Support Portal Service Disruption | 2026-09-16 09:48 UTC | 2026-09-16 21:09 UTC | 11h 21m | Support Center | https://status.digitalocean.com/incidents/grb2v0td1nq5 |
| Managed Databases Creation | 2026-08-23 05:11 UTC | 2026-08-23 14:33 UTC | 9h 21m | NYC1, NYC3 | https://status.digitalocean.com/incidents/r96y45y5sx59 |

The 25h 49m figure is how long the case stayed open, not how long customers were affected. Its postmortem says the event ran "Between 16:56 UTC and 23:09 UTC on August 24, 2026" with "two distinct windows totaling 3.5 hours of active degradation within a 6-hour span", peaking at 25% error rates on the Cloud Control Panel, Public API and dependent product management. The fact value uses the postmortem's 3.5 hours rather than the open window.

Also significant on breadth: "Major Service Interruption in MKC1" (19 Aug, critical, 8h 24m, https://status.digitalocean.com/incidents/qd8v4wddyqjr).

Gap: four of the 15 have a resolution timestamp identical to their creation timestamp (0m): "Multiple Services Availability" (6 Aug), "Volume Attach/Detach events in FRA1" (13 Aug), "A Network Disruption in BLR1 Region Impacted Multiple Products (Resolved)" (3 Oct), "App Platform Deployments" (13 Oct). They look imported or backfilled rather than live incidents. Counted as listed, flagged here.

---

## Quote verification

Each fact quote now carries the timing that the value claims, and was re-fetched after the files were written and matched mechanically:

- **HTML sources** (cloudflare-sandbox, contabo, digitalocean): remove tags, unescape HTML entities, map `&nbsp;`/U+00A0 to a space, collapse all whitespace runs to one space, trim. The quote must then appear as a contiguous substring.
- **JSON sources** (blaxel, boat): collapse whitespace runs in the raw response body and require the literal fragment. No re-serialisation, so key order and spacing must match the server's bytes.

Result (all HTTP 200):

```
blaxel               MATCH  '"name":"Some workloads unreachable in us-was-1","status":"resolved","created_at":"2026-09-01T00:24:47Z","updated_at":"2026-09-01T16:24:46Z","resolved_at":"2026-09-01T16:24:46Z"'
boat                 MATCH  '"windowDays": 90, "blockHours": 1'
cloudflare-sandbox   MATCH  'Workers Cron Triggers degraded Started Sep 9, 2026, 19:17 UTC Resolved Sep 12, 2026, 03:34 UTC'
contabo              MATCH  '08.09.2026 11:00 am (UTC+1) Degraded Performance - CEPH Cluster: non-critical Estimated duration: 900 minutes'
digitalocean         MATCH  'Between 16:56 UTC and 23:09 UTC on August 24, 2026, customers using DigitalOcean’s Cloud Control Panel, Public API, and dependent product management systems experienced elevated request error rates, peaking at 25%, in two distinct windows totaling 3.5 hours of active degradation within a 6-hour span.'
```

All 12 incident permalinks in the JSON returned HTTP 200 and carried the expected title (or, for Contabo, the expected anchor on the main page).

What each quote proves, and what it does not:

- **blaxel:** the quote holds the incident name plus `created_at` and `resolved_at`, so the 16-hour span is readable from the quoted string itself. It is a JSON fragment rather than prose because the HTML page splits the start and resolution across separate updates and prints them in local time.
- **cloudflare-sandbox:** the quote holds the incident name and both UTC timestamps ("Started … Resolved …"), so the 56-hour span is readable from it.
- **contabo:** the quote holds the posting date, the title and the published 900-minute estimate. It does not cover the 14 October last update, so that date lives in the incident record and notes, not in the fact.
- **digitalocean:** the quote holds the date and the postmortem's own 3.5-hour figure. The 25h 49m open window is in the incident record, not the fact, because the postmortem says impact was confined to two windows inside a 6-hour span.
- **boat:** the quote establishes the rolling 90-day, one-hour-block window. The absence of an incident list is an observation about the page, not a quotable sentence.

## Fetch log

All fetches were direct `curl`/Python `urllib` against the providers' own hosts, except the Contabo page, which was also read through Context.dev. No search engine, aggregator, forum or archive was used. No paid tool spend beyond the existing Context.dev allowance.

| URL | Tool | HTTP | Notes |
| --- | --- | --- | --- |
| https://status.blaxel.ai/ | curl | 200 | HTML, 3.6 KB shell |
| https://status.blaxel.ai/api/v2/incidents.json | curl | 200 | 25 incidents, 2026-08-25 → 2026-11-03 |
| https://status.blaxel.ai/api/v2/components.json | curl | 200 | 8 components |
| https://status.blaxel.ai/api/v2/incidents/<id>.json | curl | 404 | no per-incident JSON |
| https://status.blaxel.ai/incidents/<id> (×25) | Python urllib | 200 each | title + RSC payload parsed |
| https://status.ascii.dev/ | curl | 200 | HTML shell |
| https://status.ascii.dev/script.js?v=boat-3 | curl | 200 | loads status.json + history.json only |
| https://status.ascii.dev/status.json | curl | 200 | current component status |
| https://status.ascii.dev/history.json | curl | 200 | 90-day blocks + metrics, 2.7 MB |
| https://status.ascii.dev/incidents.json | curl | 200 | 344 probe records, unlinked |
| https://status.ascii.dev/summary.json | curl | 404 | not an instatus page |
| https://status.ascii.dev/history | curl | 404 | no history route |
| https://www.cloudflarestatus.com/api/v2/incidents.json | curl | 200 | 50 records only, back to 19 Oct |
| https://www.cloudflarestatus.com/api/v2/incidents.json?page=2 | curl | 200 | same page; paging not supported |
| https://www.cloudflarestatus.com/api/v3/history?type=incident&per_page=25 | curl | 200 | ×11 cursor pages, 275 records |
| https://www.cloudflarestatus.com/history | curl | 200 | HTML, 25 visible entries |
| https://www.cloudflarestatus.com/history.rss | curl | 200 | 25 items only |
| https://www.cloudflarestatus.com/api | curl | 200 | API docs; confirms 50-incident cap |
| https://contabo-status.com/ | curl + Context.dev `web_scrape` | 200 / success | six entries, Atom feed linked |
| https://contabo-status.com/rss | curl | 200 | Atom (rss.php), 6 entries |
| https://contabo-status.com/226 | curl | 404 | domain-parking page |
| https://status.digitalocean.com/api/v2/incidents.json | curl | 200 | 50 records, 2026-04-28 → 2026-11-03 |
| https://status.digitalocean.com/incidents/<id> (×3) | curl | 200 | title + timeline text |
| https://stspg.io/8l5c24cxh3hr | curl | 200 | redirects to /incidents/4qwm6pzlx1z3 |

## What could not be read

- **boat:** no incident list at all; no titles, dates or durations for outages. Only uptime blocks and probe records.
- **contabo:** no end times, no archive, and no working per-incident URLs. The 90-day count is whatever six entries the page currently shows.
- **cloudflare-sandbox:** the documented v2 API cannot reach 6 August; the v3 history endpoint is undocumented but is what the page itself calls. No "Sandbox" component exists, so sandbox coverage is inferred from Containers, Workers and Durable Objects names.
- **blaxel:** one incident lists no affected component; regions are only in titles.
- **digitalocean:** four zero-duration entries cannot be distinguished from imported records.

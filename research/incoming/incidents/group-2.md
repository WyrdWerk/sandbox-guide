# Recent incidents, group 2: e2b, hetzner, hostinger, linode, ovhcloud

Desk research, 4 November 2026. Window: 6 August 2026 to 4 November 2026 inclusive.
Sources are limited to each provider's own status page and incident pages. No StatusGator,
Reddit, forums or archives were used.

Machine-readable output: `research/incoming/incidents/group-2.json`.

## Method and conventions

- **What counts as an incident.** Entries the status page lists as disruptions. Planned
  maintenance is excluded everywhere (Atlassian `impact: maintenance` or `[Scheduled]`
  titles on OVHcloud, `incidentType: maintenance` on Hetzner, "Scheduled maintenance"
  entries on Hostinger and Linode). Maintenance totals are reported separately where the
  page exposes them. Where a provider's page lists a security advisory as an incident but
  names no affected component, it is excluded and noted.
- **Component filter.** Only the products this site lists: E2B sandboxes; Hetzner Cloud
  servers and their storage/network; Hostinger VPS; Akamai/Linode compute, LKE and
  block/object storage; OVHcloud VPS and Public Cloud.
- **Times.** UTC, ISO 8601. E2B uses the earliest/latest `display_at` in each incident's
  updates because `created_at` is a backfill time on some records. Linode uses
  `started_at`/`resolved_at`. Hetzner uses the incident page's `startTime`/`endTime`.
  OVHcloud uses the "Start time :" / "End time :" fields inside each incident's final
  message, **not** the list timestamp: the list timestamp is the update-posting window and
  can be days or weeks away from the impact window (the Managed Private Registry entry is
  listed as 18 September but its body gives 26 August to 6 October).
- **Tooling.** All fetches were public JSON, Atom or server-rendered HTML endpoints read
  with `curl`. The `searching-and-fetching-web` skill was loaded; no Composio, Context.dev
  or TinyFish call was needed for these machine-readable feeds, so none is claimed.
- **Quote check.** Every `fact.source.quote` and every incident title was re-fetched on
  4 November 2026 and matched against the page text after this normalisation: remove
  `<script>`/`<style>` blocks, replace remaining tags with a space, HTML-unescape entities,
  collapse all whitespace runs to one space, trim, then case-sensitive substring match.
  All 5 quotes and all 14 incident titles matched (see the check table at the end).

## e2b

Status page: <https://status.e2b.dev/> (Instatus; `statuspage.incident.io` permalinks).

- **Count: 14 incidents** in the window. The `/api/v2/incidents.json` feed holds 25
  incidents back to 15 June 2026, so the window is complete.
- **Components:** `Sandbox Pause/Resume/Create`, `Sandbox Network Traffic`,
  `Template Builds` and `Persistent Volumes` in the five regions. 13 of the 14 touch
  US-West-1; one is EU-West-1 only (`EU region sandbox traffic connection issues`,
  21 August); one is cross-region (`Template builds failing`, 21 October, four regions).
  US-East-1 had no incidents in the window.
- **Most significant:**
  1. `Elevated error rates when creating sandboxes from snapshots` — 15 September
     16:53-21:38 UTC, 4h 45m, US-West-1 / Sandbox Pause/Resume/Create.
  2. `Elevated error rates for sandbox operations` — 20 August 16:25-20:27 UTC, 4h 2m,
     US-West-1 / Sandbox Pause/Resume/Create.
  3. `Template builds failing` — 21 October 14:03-14:06 UTC, 3m but the widest: Template
     Builds in US-West-1, US-West-2, EU-West-1 and AP-Southeast-1.
- **Per-region uptime, window stated on the page as "Aug 5, 2026 to Nov 3, 2026":**
  US-East-1 100%, US-West-1 99.79%, US-West-2 99.98%, EU-West-1 99.98%,
  AP-Southeast-1 99.997%. US-West-1 shows "Full outage on 1 day. Partial outage on 4 days.
  Degraded performance on 8 days." The page also publishes per-component uptime for
  Sandbox Pause/Resume/Create, Sandbox Network Traffic, Persistent Volumes and Template
  Builds in each region.
- **Gaps:** the incidents API carries no component list, so regions and components were
  read from each incident page's "Affected components" block. The uptime window ends
  3 November, one day before the requested end date.

## hetzner

Status page: <https://status.hetzner.com/> (Next.js; state in `__NEXT_DATA__`).

- **The page lists only the 15 most recent resolved entries**, oldest 5 August 2026, with
  no archive, pagination or API. Of those, 14 are dated inside the window: **3 outages and
  11 planned-maintenance entries**.
- **Count: 3 outages** affecting Cloud or the network its servers sit on. The 11
  maintenance entries are UPS tests and rack/network work in FSN1, HEL1, NBG1 and the
  Load Balancer system.
- **Most significant (all three):**
  1. `Fault report for Cloud DNS API and reverse DNS APIs (Primary IP, Floating IPs,
     Cloud Server, Load Balancer)` — 3 November 08:58:00-09:55:47 UTC, 57m 47s, Cloud.
  2. `Cloud Resource Creation Delay` — 3 November 12:03:26-12:48:31 UTC, 45m 5s, Cloud.
  3. `DHCP degraded in FSN1 and NBG1` — 28 October 20:06-20:32 UTC, 26m,
     Datacenter-Infrastructure / DHCP.
- **Gaps:** a complete 6 August to 4 November count **cannot be read**. Everything between
  6 August and 26 October is absent from the page, which is consistent with a 15-entry cap
  rather than a quiet quarter. The Atom feed (`/en.atom`) carries eight announcements and
  notices, not incident history. `Outage of DENIC services` (5 August) falls outside the
  window and is excluded.

## hostinger

Status page: <https://statuspage.hostinger.com/> (Atlassian Statuspage).

- **Count: not readable.** The API returns exactly 50 incidents (22 October 10:21 UTC to
  4 November 04:05 UTC) and ignores `page`, `per_page` and `limit`. The `/history`,
  `/history?page=1`, `/history?page=2` and `/uptime` pages all render the navigation and
  footer with no incident or uptime data. A 90-day count cannot be established, and a
  VPS-only count cannot either.
- **What is visible:** 43 of the 50 entries carry no component. The page's 97 components
  contain no VPS group; the only VPS-labelled component is `Hostinger VPS API`. One entry
  is tagged to it: `Emergency Server BOS-1335 Maintenance`, 1 November
  21:24:03-22:27:55 UTC (1h 4m), text "We are performing an emergency maintenance on
  server BOS-1335, located in the United States."
- **Gaps:** no 90-day history; no VPS node/region components, so VPS-affecting incidents
  cannot be separated from shared-hosting ones; the single VPS tag sits on a server
  maintenance notice whose body talks about "client services hosted there", so the tag's
  meaning is uncertain. The fact therefore states the absence of a VPS history rather than
  a number.

## linode

Status page: <https://status.linode.com/> (Atlassian Statuspage).

- **Count: 16 incidents** touching compute regions, Block Storage, Object Storage or LKE.
  The page lists 28 incidents in the window in total; the other 12 are Cloud Manager-only
  notices, DNS, security advisories (CVE-2026-99999 PwnEscape, PHP RCE, F5/NGINX) or
  platform notices with no compute/storage/LKE component. The 50-record feed reaches back
  to 3 December 2025, so the window is complete.
- **Most significant:**
  1. `Emerging Service Issue - Cloud Manager and API` — 21 September 17:13:35 to
     23 September 03:26:27 UTC, 1d 10h 12m, Cloud Manager and API with all 43 region
     components marked affected.
  2. `Connectivity Issue - Dallas Data Center (IPv6 Traffic to Google)` — 23 October
     09:21:06-20:38:09 UTC, 11h 17m, US-Central (Dallas).
  3. `Issue in creating new LKE Enterprise cluster across regions` — 20 October
     12:29:25-21:42:59 UTC, 9h 13m, LKE across 31 regional components.
- **Open entries:** two incidents are still listed as `monitoring` with no `resolved_at`,
  so no duration is claimed: `Service Issue - Block Storage (BR-GRU)` (opened 28 October)
  and `Connectivity Issue between ID-CGK (Jakarta) and SG-SIN-2 (Singapore 2)` (opened
  25 October).
- **Gaps:** postmortem-style entries can carry `started_at` equal to the posting time; the
  22 October LKE incident is one (its text gives about 11:10-12:50 UTC). It is not among
  the three longest either way.

## ovhcloud

Two status pages: <https://bare-metal-servers.status-ovhcloud.com/> for VPS and
<https://public-cloud.status-ovhcloud.com/> for Public Cloud. Both are Atlassian
Statuspage; their `/history?page=N` pages embed month-by-month JSON.

- **VPS: 18 incidents.** Every non-maintenance entry on the Bare Metal Cloud page whose
  title names Virtual Private Servers or VPS, 6 August to 4 November.
- **Public Cloud: 72 incidents.** Every non-maintenance entry on the Public Cloud page:
  storage 22, compute 18, network 10, Public Cloud 8, containers/Kubernetes 6, and 8 across
  AI, databases, analytics and identity.
- **Most significant VPS:**
  1. `[EU-SOUTH-LZ-MAD][Virtual Private Servers] - Some VPS incident notification` —
     14 August 08:45 to 18 August 10:15 UTC, 4d 1h 30m.
  2. `[Global][Dedicated Servers/Virtual Private Servers] - Delivery incident
     notification` — 28 September 18:00 to 29 September 08:13 UTC, 14h 13m.
  3. `[GRA][Virtual Private Servers] - VPS incident notification` — 24 October 14:54 to
     25 October 00:45 UTC, 9h 51m.
- **Most significant Public Cloud:**
  1. `[EU-SOUTH-MIL][Containers & Orchestration] -  Managed Private Registry incident
     notification` — 26 August 15:00 to 6 October 07:00 UTC, 40d 16h.
  2. `[GLOBAL][Databases] - MongoDB incident notification` — 25 August 00:00 to
     3 September 13:00 UTC, 9d 13h.
  3. `[EU-WEST-PAR][Storage] - Object Storage incident notification` — 27 October 20:00 to
     3 November 09:43 UTC, 6d 13h 43m.
- **Gaps:** VPS has no status page of its own, so the VPS count depends on titles that name
  VPS. The Public Cloud page mixes compute with AI, database and analytics services. The
  main `status-ovhcloud.com` page is a JavaScript shell with no incident data, and
  `vms.status-ovhcloud.com` shows only per-datacenter real-time state, not history.
  `vps.status-ovhcloud.com` does not resolve.

## Fetch log

All requests were `curl` (HTTP GET), 4 November 2026. Statuses are the final status after
redirects.

| URL | HTTP | Result |
| --- | --- | --- |
| `https://status.e2b.dev/` | 200 | Rendered page; per-region uptime `aria-label`s |
| `https://status.e2b.dev/api/v2/incidents.json` | 200 | 25 incidents, back to 15 June 2026 |
| `https://status.e2b.dev/api/v2/components.json` | 200 | 23 components |
| `https://status.e2b.dev/incidents/<id>` (14) | 200 | Affected components per incident |
| `https://status.e2b.dev/summary.json` | 404 | Not available |
| `https://status.e2b.dev/api/v2/incidents/<id>.json` | 404 | No per-incident JSON |
| `https://status.hetzner.com/` | 200 | `__NEXT_DATA__` with 15 resolved entries |
| `https://status.hetzner.com/incident/<uuid>` (15) | 200 | startTime, endTime, type, system |
| `https://status.hetzner.com/en.atom` | 200 | 8 announcements, no incident history |
| `https://status.hetzner.com/api/v2/incidents.json` | 404 | No API |
| `https://status.hetzner.com/{sitemap.xml,incidents,history,robots.txt}` | 404 | No archive |
| `https://statuspage.hostinger.com/` | 200 | Page shell |
| `https://statuspage.hostinger.com/api/v2/incidents.json` | 200 | 50 incidents, 22 Oct-4 Nov |
| `https://statuspage.hostinger.com/api/v2/components.json` | 200 | 97 components |
| `https://statuspage.hostinger.com/history` | 200 | No incident list rendered |
| `https://statuspage.hostinger.com/history?page=1..2` | 200 | No incident list rendered |
| `https://statuspage.hostinger.com/uptime` | 200 | No uptime data rendered |
| `.../api/v2/incidents.json?page=2`, `?per_page=100`, `?limit=100` | 200 | Same 50 records; cap not bypassable |
| `https://statuspage.hostinger.com/incidents/4361g2mpp2s2` | 200 | VPS-tagged maintenance notice |
| `https://status.linode.com/api/v2/incidents.json` | 200 | 50 incidents, back to 3 Dec 2025 |
| `https://status.linode.com/api/v2/components.json` | 200 | 250 components |
| `https://status.linode.com/history?page=1..2` | 200 | Cross-check of the incident list |
| `https://status.linode.com/incidents/<id>` (3) | 200 | Incident pages |
| `https://public-cloud.status-ovhcloud.com/api/v2/incidents.json` | 200 | 50 most recent |
| `https://public-cloud.status-ovhcloud.com/api/v2/components.json` | 200 | 658 components |
| `https://public-cloud.status-ovhcloud.com/history?page=1..4` | 200 | Months Dec 2025-Nov 2026 |
| `https://bare-metal-servers.status-ovhcloud.com/api/v2/incidents.json` | 200 | 50 most recent |
| `https://bare-metal-servers.status-ovhcloud.com/api/v2/components.json` | 200 | 237 components |
| `https://bare-metal-servers.status-ovhcloud.com/history?page=1..3` | 200 | Months Mar-Nov 2026 |
| `https://www.status-ovhcloud.com/` | 200 | JavaScript shell, no incident data |
| `https://vms.status-ovhcloud.com/` | 200 | Per-datacenter real-time state only |
| `https://vps.status-ovhcloud.com/` | DNS failure | Host does not resolve |

## Quote and title check

Re-fetched 4 November 2026; normalisation as described above.

| Provider | Source | Quote found | Incident titles found |
| --- | --- | --- | --- |
| e2b | incident page | yes | 3/3 |
| hetzner | incident page | yes | 3/3 |
| hostinger | incident page | yes | 1/1 |
| linode | incident page | yes | 3/3 |
| ovhcloud | incident page | yes | 6/6 |

## What could not be read

- **Hostinger:** any incident older than 22 October 2026, and any VPS-specific incident
  history. The status page publishes neither.
- **Hetzner:** any resolved incident older than 5 August 2026. The page keeps 15 entries.
- **OVHcloud VPS:** incidents that affected VPS but do not name VPS or Virtual Private
  Servers in the title.
- **Linode:** durations for the two incidents still in `monitoring`.

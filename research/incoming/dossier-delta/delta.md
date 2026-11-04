# Provider reliability dossiers vs the site: delta report

**Date:** 4 November 2026. **Repo:** `WyrdWerk/sandbox-guide` at `38f711c`. **Scope:** read-only comparison. No site data, commit or push was made.

## What was compared

The 27 dossiers that correspond to site providers, out of the 29 under [Sandbox Guide](https://app.notion.com/p/40d6e471db42815297b6efc852125b0d) (HostHatch and TierHive skipped: not on the site). For each provider I read the dossier through the Notion MCP, then the site's `site/src/data/providers/<id>.json` (company facts, caveats, fits.badly, strengths), `site/src/data/reviews.json`, the `status-page`, `sla` and `soc2` rows in `site/src/data/capabilities.json`, `site/src/data/features/company.json` and `research/<id>.md`.

The dossiers were written 3–4 November 2026, so they are one to six days newer than most site `checkedOn` dates (26–30 October). Some "differences" below are therefore drift rather than error; I mark those separately from real contradictions.

## Spot-checks against cited sources

Ten Context.dev calls (searches and scrapes; Composio was not used because the Context MCP covered every check). No paid research product was used and the spend stayed well under the $0.50 ceiling.

| Claim checked | Result |
| --- | --- |
| Tensorlake Terms §5: 99.9% control-plane SLA, credit tiers, P1 4 h, chronic-failure exit | **Confirmed verbatim.** "4 hours, 24×7"; "99.50% to 99.89% \| 10%"; "Below 95.00% \| 50%"; "applies them automatically to Customer's next invoice"; chronic failure at "two (2) consecutive months". |
| Tensorlake durability credit (dossier: loss of a sealed volume or snapshot counts as P1) | **Confirmed.** §5.3: "treated as a P1 incident and earns an additional Service Credit of 50% of that month's Fees", plus an RCA "within ten (10) business days". |
| Cloudflare Enterprise Subscription SLA "100% Uptime" (dossier) vs site's 99.99% Workers SLA | **Both documents exist.** Enterprise Subscription SLA §2.2: "The Service will serve Customer Content globally 100% of the time." It does not name Containers or Sandbox. The site quotes a different, Workers-specific document. |
| Contabo Oct 26 "unauthorized access to systems hosting VDS" | **Archive only.** The live status page no longer carries it; Pingoru's mirror reproduces the notice verbatim with a `contabo-status.com#222` link. Not currently confirmable first-party. |
| Contabo forced host reboots, October 2026 | **Confirmed first-party, and missing from the site.** Help article: "patching can't wait for a regular maintenance window, and we can't send individual advance notices." |
| OVHcloud July 2026 CVE-2026-53359 ("Januscape") mass reboot | **Confirmed first-party (French blog).** "environ un million de machines virtuelles"; "données corrompues sur plusieurs VMs réparties sur 3 clusters"; Nova/Neutron "HTTP 503 pendant environ deux heures". |
| Blaxel acquisition by Baseten | Not re-checked: the site already cites Baseten's own blog (`docs-confirmed`), which is stronger than the dossier's X-only sourcing. |

## Reconciliation with the research notes

The first draft compared the dossiers against the buyer-facing profile (`providers/<id>.json`, `reviews.json`, the three capability rows) and named `research/<id>.md` as a source without opening most of those files. Having now read all 27, a meaningful minority of the "gaps" are already in the research ledger and only need surfacing; the rest are genuinely new. The table records which is which, so an integration pass does not re-research what is already evidenced.

| Provider | Already in `research/<id>.md` | Genuinely new in the dossier, or a correction |
| --- | --- | --- |
| agent37 | The 20 Oct 2026 "Temporary interruption to US sandboxes / Degraded for 21 minutes" incident, and the observation that the US component shows both "100% uptime" and that degradation (§17.7). | The 29 Oct creation incident. The profile still prints "100% over 30, 60 and 90 days" without the research caveat, so this is an internal inconsistency to fix rather than missing research. |
| blaxel | Status page read on 28 Oct: Sandboxes 99.33%, Platform 99.30% for Jul–Oct. | The 32-incident record, the us-was-1 concentration, the 1 Sep 16-hour outage and the benchmark ban. **Correction:** the site's 99.33% is the Sandboxes component, so it is not contradicted by the dossier's Platform 98.54%; the two are different components and windows. |
| boat | The full 90-day component table (98.83%–100%, pooled 99.74%), the 97.11% internal test suite, and the 746-hour Stop + Resume coverage. | The 14-day window (creation 99.69%, stop + resume 99.69%, fork 99.96%), the 292 s average stop, and the 29–31 Oct outages. |
| boxd | No status page, no SLA, no uptime figure. | The immediate-suspension clause. |
| cloudflare-sandbox | The Workers SLA scope ("applies to use of Workers only"), the 404 on a Containers SLA, the self-serve suspension clause, and a 28 Oct "Partial System Outage" with an IAD incident. | The Enterprise Subscription SLA's "100% Uptime", and the 2–3 Nov Containers/Workers incidents. |
| contabo | The 99.9% annual physical-connectivity promise with no credit formula. | The 26 Oct VDS notice, the CVE-2026-99999 forced reboots, CEPH 49 days, Auto-Backup 96 days, and the status-page blind spot. |
| daytona | The SLA mechanics in full — "commercially reasonable efforts", 30-day claim, 60-day payment, 50% cap, Tier 4+ — and the 31 Jul Windows Runners outage. | The 29–30 Oct US runner incidents. |
| digitalocean | The 99.99% per-Droplet promise. | Credit scope (affected Droplet only, future bills) and the Oct incidents. |
| e2b | The US-West-1 99.78% figure and the "may suspend … without notice" disclaimer. | The other four regions' figures, the five dated incidents, and the "any or no reason" clause. |
| freestyle | That no Terms page exists (all URLs 404 except `/privacy`). | The founder's capacity-refusal quote and the 50-concurrent-VM default. |
| hetzner | The SLA quote, including "commercially reasonable efforts". | HEL1 Object Storage (9 Sep–22 Oct), the 21 Oct FSN outage, and the DDoS exclusion. |
| hostinger | The 5% credit and the maintenance exclusion. | "As solely determined by us", the 30-day claim, the 11 exclusions, the abuse-suspension cluster, and the unacknowledged Oct outages. |
| hostup | The business-only SLA and the 10/25/50% credit tiers. | Paid critical tickets, the 50%-of-base-fee cap, the 7-day maintenance notice, and §19.5's backup duty. |
| instabox | The 8-hour maximum continuous run and the 30-minute idle pause. | The "cooling down" pauses and the 3 Nov terms update. |
| lightsail | "Commercially reasonable efforts" and credits starting below 99.5%. | The credit tiers, the 2-AZ condition for the region figure, §51.3, and the burst-CPU pattern. |
| linode | The 99.99%/99% split. | The 30-day claim, the 24-hour maintenance exclusion, the Jul 2025 multi-region outage, and the Oct 2026 incidents. |
| lizard | No reliability section; the profile carries the status page. | Regional 99.88% figures, the "no incidents reported" contradiction, and the terms. |
| modal | The 100%/99.983%/99.989% figures and a "Dashboard and sandbox outage — Down for 14 minutes" entry. | The 5 Oct sandbox-execution incident, the HF endpoint incident, and the suspension clause. |
| morph | The 30-day price notice, the 60-day notice above 15%, and the ban on publishing public benchmarks without consent. | The suspension-with-restoration clause, the no-material-reduction/pro-rata refund clause, and the "does not monitor instance contents" statement. |
| ovhcloud | The 99.9% VPS SLA and the status page. | Januscape, the SBG fire, the 47/28 incident counts, and the backup freezes. |
| runtime | 96.37% (7 days) and 98.87% (30 days), the 99% promise, the 10% credit, and `"incidents": []`. | Sandbox starts at 98.42%, the 25 Oct 75% day, and the inferred October figure. |
| sandboxer | Sandboxes 99.45% over 30 days, website 99.79%, and the deletion/termination terms. | The 90-day 99.80% figure and the abuse-suspension clause. |
| scaleway | 99% for BASIC, 99.5% for dedicated, no SLO for DEV1/GP1/PLAY2/PRO2. | COPARM1/ENT1, the voucher remedy, the log-file evidence requirement, the Oct incidents, and the forced migration. |
| sprites | The 11–12 Oct Sprite hosting outage and the 30-day claim window. | The 29 Oct "Storage not ready" report, the Nov platform incidents, and the "WITH ALL FAULTS" terms. |
| tensorlake | A one-line note that `tensorlake@0.5.144` was published maliciously. | The window, scope, provenance detail, fix version and payload; and the whole credit/chronic-failure schedule. |
| vercel-sandbox | "Commercially reasonable efforts", 99.99%, Excused Downtime, and that the SLA does not name Sandbox. | The 6 Oct cdg1 incident and the $1M security challenge. |
| vultr | The 100% SLA quote and a 30 Oct status-page observation (31 regions "Planned Service", Singapore impacted). | The SLA's scope and credit tiers, the 3-day claim and 1-year expiry, and the Tokyo/Dallas "green while down" reports. |

Two corrections to the first pass follow from this. **Agent 37** is not a case of missing research: `research/agent37.md` already records the 20 October incident and calls the 100% figure internally inconsistent; the profile then repeats the 100% figure without the caveat. **Blaxel** is not a figure contradiction: the site quotes the Sandboxes component (99.33%) and the dossier quotes Platform (98.54%) over a later window.

## Cross-provider summary

**1. The site describes status-page machinery; the dossiers record events.** The research notes catch some of this — Agent 37's 20 October degradation, Boat's component table, Daytona's Windows runners, Modal's 14-minute outage, Sprites' 11–12 October outage — but the buyer-facing profile almost never carries it. Nineteen of the 27 dossiers add dated 2026 incidents (Agent 37 Oct 20/29, Blaxel 32 incidents Aug–Nov, Boat Oct 29–31, Cloudflare Containers Nov 3, Contabo Oct 26, Daytona Oct 29/30, DigitalOcean DOKS Oct 27, E2B Sep 15/Oct 29, Hetzner HEL1 Sep 9–Oct 22, Hostinger ~25 entries Oct 30–Nov 4, HostUp Oct 30, Linode Oct–Nov, Modal Oct 5, Morph mid-Aug user reports, OVHcloud 47 in October, Runtime Oct 25, Scaleway Oct 29–30, Sprites Oct 11–12, Vercel Oct 6). The site's `company.facts` gives components and percentages but almost never a date, a duration or whether the vendor acknowledged it. This is the largest single gap and the one a buyer weighing "is it reliable" needs most.

**2. The site gives the SLA number; the dossiers give the remedy.** Some mechanics are already in the research ledger (Daytona's 30-day claim and 50% cap, Hetzner's "commercially reasonable efforts", HostUp's credit tiers, Vercel's Excused Downtime), but the capability rows and company facts drop them. Missing from the profile almost everywhere are claim windows, credit tiers, caps, exclusions and what is *not* covered: Hostinger's "as solely determined by us" and 11 exclusions, HostUp's 50%-of-base-fee cap, Lightsail's credit tiers and 2-AZ condition, Linode's unpublished formula, Vultr's 3-day claim and 1-year expiry, Scaleway's log-file evidence requirement. Tensorlake is an outright error: the `sla` capability row says there is no uptime promise while the same profile and the Terms say there is.

**3. Suspension, deletion and account-lock rules are the thinnest area.** The word "abuse" appears in no provider JSON. Dossiers supply first-party clauses for Hostinger (abuse suspensions), InstaBox (may stop or pause a sandbox), Runtime and Sandboxer (suspend immediately), E2B ("for any or no reason"), Vultr (§16.2 undue resource stress), Contabo (third-party complaints) and boxd (immediate suspension without notice). The site's `features/company.json` covers deletion and cancellation for six providers, but no provider JSON says when an account or a sandbox may be suspended.

**4. Security incidents are under-covered, and one dossier claim needs care.** Tensorlake's npm compromise is a one-line caveat with no window, scope or fix version. Contabo's October event, OVHcloud's Januscape reboot, Modal's Hugging Face endpoint incident and Linode's PwnEscape advisory are absent. Conversely, the Contabo "breach" should not be imported as written: its only source is an archived status post, it sits alongside a confirmed kernel-patching event, and one reader flagged the entry as an extractor artefact.

**5. Support is treated as a channel, not a contract.** The dossiers add paid critical tickets (HostUp), support-request-gated features (Daytona webhooks), a 4-hour P1 (Tensorlake) against the site's 24-hour P1, and bot/AI-first escalation patterns (Hostinger, Contabo, DigitalOcean, Vultr).

**6. Review coverage is uneven.** The site reads Trustpilot well but rarely HostAdvice or whtop. The dossiers add whtop scores (Contabo 2.6/10, Hetzner 3.6/10, Linode 4.2/10, OVHcloud 3.1/10) and HostAdvice counts, and they are more explicit about which clusters look solicited.

**7. Dossier sourcing is weakest exactly where the claims are most dramatic.** Recurring patterns: Reddit "search extracts" that were not opened, single X posts, vendor-authored threads, competitor-authored comparisons (the five-provider Reddit test is by the Ascii Box/Boat team), and affiliate review pages. Those are fine as leads, not as site evidence under the repo's URL + verbatim quote + confidence + date rule.

## Ten highest-value additions, ranked

1. **Tensorlake — correct the SLA row and the P1 target, add the credit schedule.** `sla` says "no"; the Terms give 99.9% with 10/20/35/50% credits, automatic application, a 50% cap, carry-forward, a durability P1 with an extra 50% credit, and a chronic-failure exit. P1 is 4 hours, not 24. *Highest priority: the site currently contradicts itself and the contract.*
2. **Contabo — add the October security and patching events, and the status-page blind spot.** Oct 26 VDS unauthorized-access notice (archived), CVE-2026-99999 forced reboots with no individual notice, CEPH degraded 49 days, Auto-Backup delays 96 days, and repeated single-host outages absent from the status page.
3. **OVHcloud — add the Januscape mass reboot and the SBG fire.** ~1 million VMs rebooted without individual agreement, data corruption on VMs in 3 clusters, ~2 h of Paris API 503s, 11 days; plus the 2021 fire that destroyed a datacentre including same-site backups.
4. **Hostinger — add abuse suspensions and the unacknowledged outages.** Six Reddit threads, an HN report of $200k lost, X reports; StatusGator found Oct 20 (3 h 18 m) and Oct 27 (56 m) outages the vendor never posted.
5. **Hetzner — add the six-week HEL1 Object Storage degradation and the SLA exclusions.** Sep 9–Oct 22, 2026, fixed by bucket migrations; Oct 21 FSN outage not on the status page at the time; SLA is "commercially reasonable efforts" with DDoS excluded.
6. **Vultr — add the SLA's real scope and the "green while down" pattern.** 100% covers network and host node only, 12–672 h credits, 3-day claim, 1-year expiry, GPU excluded; Tokyo Sep 6 and Dallas Aug 17, 2026 are repeated 2026 examples.
7. **Blaxel — add the Platform figure and the incident record beside the Sandboxes figure.** 32 incidents Aug 7–Nov 3, 16 in us-was-1, a 16-hour outage on Sep 1, recurring Drive failures, Platform 98.54%; plus the terms' ban on publishing benchmarks.
8. **Linode — add the July 2025 multi-region outage and the October 2026 advisories.** Newark/LKE spread to six regions with 27 h+ for some users; PwnEscape guest-to-host KVM advisory Oct 15–30; LKE and Object Storage repeatedly called less stable than compute.
9. **Runtime — replace "uptime was below the promise" with the measured numbers.** Sandbox starts 98.42% over 30 days, Oct 25 at 75% (≈6 h), and an inferred October figure of 98.97% that should have triggered the automatic 10% credit.
10. **E2B — add the per-region table and the suspension clause.** US-West-1 99.78% against 99.98–100% elsewhere, five dated incidents, and terms allowing suspension "for any or no reason" with or without notice.

Runners-up: DigitalOcean's DOKS record, Cloudflare's Containers incidents and the second SLA document, HostUp's paid critical tickets, Freestyle having no published Terms at all, and Daytona's support-gated webhooks.

---

## Per-provider findings

**How to read "Gaps".** It means absent from the buyer-facing profile — `providers/<id>.json`, `reviews.json` or the three capability rows — not necessarily absent from `research/<id>.md`. The reconciliation table above records which items the research notes already hold; where they do, the integration work is surfacing an existing quote, not new research.

### agent37 — Agent 37

**Gaps.** The profile carries no dated incident, although `research/agent37.md` §17.7 already records the 20 October degradation (21 minutes) and flags the US component as showing both "100% uptime" and that degradation. The dossier adds a second incident, creations degraded 1 h 5 m on 29 October. The founder's own HN answer on density is a first-party operational fact the site does not carry: "If a host reaches critical memory, then it will start restarting memory heavy sandboxes." The terms allow suspension for material breach, past-due accounts or risky workloads, and data is deleted after termination; the site's `company.facts` says only "No SLA unless agreed in writing".

**Contradiction inside the site.** The profile says "Status components reported 100% over 30, 60 and 90 days at check"; the research ledger already records a 21-minute degradation on 20 October and calls the 100% figure internally inconsistent. The dossier adds a 29 October incident. The fix is to carry the research caveat into the profile, and to name the component and window.

**Weak.** The 4.5 Trustpilot score is consistent with the site's 4.5, but the site's claim that "all 16 reviews are five stars" cannot be reconciled with a 4.5 TrustScore by simple averaging (Trustpilot weights, so it is not proof of error). The viral X launch comparison ($4.76 vs Vercel's $249) was disputed by Vercel's CEO and is marketing.

**Where it goes.** New `company.facts` entry "Recent incidents"; eviction risk into `caveats[]` or `fits.badly[]`; suspension/deletion into `company.facts` "Terms".

### blaxel — Blaxel

**Gaps.** The incident record: 32 incidents plus two maintenances between 7 August and 3 November 2026, 16 naming us-was-1 and 8 us-pdx-1, a 16-hour outage on 1 September, ~12 hours on 29 October, and recurring Drive mount/write failures on 30 October and 3 November. Terms §2.6(f) forbids publishing benchmarks or performance information — a material term for anyone who publishes evaluations. Suspension grounds are also absent.

**Component mismatch, not a contradiction.** Site: "Sandboxes 99.33% over July–October 2026"; `research/blaxel.md` records both Sandboxes 99.33% and Platform 99.30% for Jul–Oct. Dossier: "Platform 98.54%" over 90 days to 3 November. The site's number is the Sandboxes component, so it stands; what is missing is the Platform figure, the window, and the incident record.

**Weak.** The acquisition is sourced only to X posts and the dossier says so ("I haven't confirmed this with a press release"). The site is already better here: it cites Baseten's blog as `docs-confirmed`. Do not downgrade the site to the dossier's sourcing.

**Where it goes.** `company.facts` "Recent incidents" and "Terms"; `capabilities.sla` figure needs the component named.

### boat — Boat

**Gaps.** Dated outages are missing: user reports on 29, 30 and 31 October, and the vendor's own reply on 30 October — "~10 minute downtime tonight due to scaling too fast, no data was lost". The status page now publishes performance metrics the site does not mention: stop on the 15 GB suite averaged 292 s (p99 634 s) on 4 November, restore read 46 MB/s. The terms let Boat "modify, rate limit, throttle, queue, migrate, archive, delete, stop, suspend" resources and accounts.

**Window difference, not a contradiction.** Site: seven components "range from 98.83% (Sandbox Fork) to 100%, and pooled across the seven the figure is 99.74%" over 90 days. Dossier, 22 October–4 November: creation 99.69%, stop + resume 99.69%, fork 99.96%, dashboard 99.61%. Fork at 99.96% against 98.83% is a window difference; the site's 90-day figure still stands and the dossier's 14-day window cannot replace it.

**Weak.** The 3 November CI I/O regression (cache restore 78 s → 160 s, builds 111 s → 397 s, no support reply) is one user. Lizard's "can't pause with memory" criticism is a competitor's. The founder's "7 figures run rate" is vendor marketing. The dossier correctly discloses that WyrdWerk is a customer and that battleships.dev is Boat's; the site already discloses the latter in `how-we-checked` and `site.json`.

**Where it goes.** `company.facts` "Recent incidents"; slow-stop metric into the status-page note; suspension language into `company.facts` "Terms".

### boxd — boxd

**Gaps.** The terms allow suspension of a VM "immediately and without prior notice" for operational, security or legal reasons, with liability capped. The site's `company.facts` covers price changes and the 30-day deletion window but not suspension.

**Weak.** "Three founders and a €2M pre-seed (repo profile)" is recycled from the site's own research, not new evidence. The "peak larp" X critique is an opinion. No status page and no SLA are already on the site, correctly.

**Where it goes.** `company.facts` "Terms".

### cloudflare-sandbox — Cloudflare Sandbox

**Gaps.** Dated platform incidents that would have hit sandboxes: "Cloudflare Container Issues" 30 minutes on 3 November, Worker deployments delayed 50 minutes on 2 November, Gateway DNS-over-TLS 2 h 20 m on 2 November, APJC network performance on 3 November. HostAdvice (47 reviews) and whtop (4/10 from 3 users) are not in the site's review record.

**Contradiction.** Trustpilot: site "1.5 stars from 1,331 reviews"; dossier "1.4/5 'Bad'". Minor and likely refresh.

**Second SLA document (gap, not conflict).** Site says "The 99.99% Workers SLA covers Workers only", which is true of that document, but Cloudflare also publishes an Enterprise Subscription SLA whose §2.2 reads "The Service will serve Customer Content globally 100% of the time." I confirmed both pages exist. The site's conclusion (no sandbox SLA) survives, but the site states one of two first-party figures and should say which document it means.

**Weak.** "Second Cloudflare outage within a week" is one X user. HostAdvice's negative reviews are 2021–22 and about the CDN, not Sandbox.

**Where it goes.** `company.facts` "Recent incidents"; `capabilities.sla` note to name both documents; `reviews.json` `caveats` for the HostAdvice/whtop gap.

### contabo — Contabo

**Gaps.** The October security events are absent. (a) 26 October, 12:30 UTC: a status notice said "We detected unauthorized access to systems hosting VDS… rotate SSH keys, passwords, and API tokens", resolved after 3 h 11 m, with customers reporting 24 h to 4+ days down. (b) The confirmed, first-party event the dossier underplays: urgent patching for CVE-2026-99999, where Contabo's own help article says "patching can't wait for a regular maintenance window, and we can't send individual advance notices." Also missing: CEPH degraded 49 days from 8 September, Auto-Backup delays 96 days, the control panel 13 h 45 m outage on 4 September, and the pattern of single-host outages the status page never lists (a 125-hour dedicated-server outage in March 2026 with zero incidents posted).

**Contradiction.** None on facts the site states; the site simply omits all of this. Its SLA row ("99.9%, no credits") is correct.

**Weak.** The "unauthorized access" notice is only available through Pingoru's archive; the live page no longer lists it, and the dossier itself notes a reader claiming the entry was fabricated by an extractor. The safe site statement is the CVE-2026-99999 patching and unannounced reboots (first-party), with the 26 October notice tagged `third-party` and attributed to the archived status post — not "Contabo was breached".

**Where it goes.** New `caveats[]` entry "Forced host reboots and a VDS security notice, October 2026" with both sources and their confidence; `company.facts` "Recent incidents"; `reviews.json` theme already covers multi-day outages and can take the dates.

### daytona — Daytona

**Gaps.** SLA mechanics: "commercially reasonable efforts", claim within 30 days, credit capped at 50% of monthly fees, applied to future usage, Tier 4+. Dated incidents: US runner degradation 29 October, degraded subset of US runners 30 October, Windows runners down 3 h 50 m on 31 July. Webhooks need a support request to enable — a real product limitation absent from the site.

**Contradiction.** None substantive. The site's "99.95%, Tier 4+" is right but incomplete.

**Weak.** Trustpilot: the site says "none" (no profile); the dossier hit a captcha and says it is unknown whether a profile exists. The dossier's own five-provider comparison is by the Ascii Box/Boat team and is correctly flagged as biased.

**Where it goes.** `capabilities.sla` note; `company.facts` "Recent incidents"; `fits.badly[]` for webhooks.

### digitalocean — DigitalOcean

**Gaps.** Dated incidents: DOKS down 2 h 29 m on 27 October, support portal disrupted 11 h 20 m on 16 September, VPC networking 25 minutes on 5 October, DOKS DNS on 11 October, console outage 24 August. SLA scope: credits apply only to the affected Droplet's charges and go toward future bills. HostAdvice (106 reviews) and whtop (2/10 from 2 users) are missing from the review record.

**Wording gap.** Site: "99.99% monthly uptime per Droplet, with a 100% service credit if missed." Dossier: "credits apply only to the affected Droplet's charges and go toward future bills." "100%" is the size of the credit, not its scope; the site reads as if the whole bill is credited. Worth rewording rather than correcting.

**Weak.** The "6 years experience" 8-hour outage is one anecdote; LET recommendation threads carry affiliate links.

**Where it goes.** `company.facts` "Uptime promise" wording; "Recent incidents"; `reviews.json` caveat.

### e2b — E2B

**Gaps.** The per-region picture: US-West-1 99.78%, US-West-2 99.98%, EU-West-1 99.98%, US-East-1 100%, AP-Southeast-1 99.997%. Five dated incidents (3 September 30 min; 15 September 4 h 15 m plus 35 m; 2 October 25 min; 27 October 3 min; 29 October 1 h 20 m). The terms say services are "AS IS" and "AS AVAILABLE" and E2B may suspend or terminate "for any or no reason" with or without notice.

**Contradiction.** None. The site's US-West-1 figure matches.

**Weak.** The five-provider comparison is competitor-authored; the long-running-state thread is a search extract. The "sessions time out" theme is already on the site.

**Where it goes.** `company.facts` "Status and SLA" to carry the region table; "Recent incidents"; "Terms" for suspension.

### freestyle — Freestyle

**Gaps.** There is no published Terms of Service at all: four URLs return 404 as of 4 November, so suspension and deletion rules cannot be checked. The site says no SOC 2, trust centre or DPA, but not that the contract itself is missing. Capacity failure mode, from the founder: forks either succeed or fail fully, and "We can run out of space on a Node and just say no". The 50-concurrent-VM default limit came up at launch.

**Contradiction.** None. The site correctly limits the 99.99% SLA to Enterprise and notes the status page was last updated 25 October.

**Weak.** The founder's 3 November X claim that "We're now doing SLAs as good as AWS" is not reflected on the pricing page; the site is right to ignore it. Reddit and X are staff-dominated.

**Where it goes.** `caveats[]` "No published Terms of Service"; `fits.badly[]` or `caveats[]` for node-capacity refusals; `company.facts` "Terms".

### hetzner — Hetzner Cloud

**Gaps.** HEL1 Object Storage was partially degraded from 9 September 12:00 UTC to 22 October 13:34 UTC — about six weeks — fixed by bucket migrations. An FSN outage on 21 October 12:24–12:42 was reported on HN with nothing on the status page at the time. The SLA is "commercially reasonable efforts" with DDoS excluded, not an absolute promise. The account-verification and deactivation pattern (KYC, passport checks, country risk) is a company-level risk the site only carries as review themes.

**Contradiction.** None. The site's 99.9% and Cloud Credit remedy are correct; only the qualifiers are missing.

**Weak.** The 3 November FSN1 X alert is explicitly unconfirmed in the dossier and should not be added. Reddit text is from search extracts; LET recommendation threads carry affiliate links.

**Where it goes.** `company.facts` "Recent incidents" and "Uptime promise" qualifiers; `caveats[]` for Object Storage; `features/company.json` for the KYC pattern.

### hostinger — Hostinger

**Gaps.** About 25 "Emergency Server Maintenance" or "Degraded Server Performance" entries between 30 October and 4 November. StatusGator caught outages Hostinger never acknowledged: 20 October 3 h 18 m, 27 October 56 m, 30 August 3 h 6 m. The abuse-suspension pattern is well evidenced (six r/Hostinger threads, an HN report of a $200k loss in March 2025, a February 2026 permanent suspension, X reports in October–November) and appears nowhere in the site's provider JSON — the word "abuse" is absent. SLA fine print: 5% credit "as solely determined by us", future purchases only, claim within 30 days, 11 exclusions including DDoS, GPU excluded.

**Contradiction.** None; the site's 5% and maintenance exclusion are right but incomplete.

**Weak.** HostAdvice's 9.5/10 expert review is affiliate-built and appears as a paid placement on other providers' pages; whtop's 8.7/10 is similarly discounted. Reddit bodies were not readable, only titles.

**Where it goes.** `caveats[]` "Abuse suspensions take the whole VPS offline"; `company.facts` "Recent incidents" and SLA detail; a new `reviews.json` theme.

### hostup — HostUp

**Gaps.** Critical on-call tickets cost a prepaid support credit, refunded only if HostUp is at fault — a support limit a buyer should know. SLA scope: §20.1 covers only Business Customers' paid VPS and web hosting, not object storage (beta) or domains; credits are 10/25/50% capped at 50% of the base fee; maintenance announced seven days ahead is excluded; §1.5 disclaims liability outside the SLA; §19.5 puts backups on the customer. A 14-day money-back window (2 days outside the EU/EEA) is also absent.

**Contradiction (drift).** Site: "99.992% on 2026-10-30". Dossier, 3 November: "99.993% uptime over 90 days". Same source, later date; refresh rather than error.

**Weak.** The July 2026 report of a silent plan change from Ryzen 9 9950X to EPYC 7B13 is one Swedish user from a search extract.

**Where it goes.** `company.facts` "Support" and "Uptime promise"; `capabilities.sla` note.

### instabox — InstaBox

**Gaps.** "Cooling down" pauses: one user on 31 October — "Cooling down until XYZ. Waking is unavailable until then." — and a Korean user on 3 November whose VM is "stopped for 1–2 hours a day in the name of cool down". The site's review summary carries only the invite-code and scam-check posts. The terms (updated 3 November 2026) let InsForge suspend or limit the service including "stopping or pausing a Sandbox", blocking traffic or lowering limits, and deleting a sandbox or snapshot is irreversible.

**Contradiction.** None. The site's "free plan always pauses at 30 idle minutes" is consistent; the 1–2 hour daily block is a different, stronger constraint.

**Weak.** The oversubscription explanation is the dossier's inference. X volume is inflated by invite and referral links.

**Where it goes.** `caveats[]` or a `reviews.json` theme for cooling-down pauses; `company.facts` "Terms".

### lightsail — Amazon Lightsail

**Gaps.** SLA credit tiers: 10% below 99.5%, 30% below 99%, 100% below 95%; the 99.99% region figure applies only when deployed across two or more availability zones; block storage carries 99.9%. Service Terms §51.3 lets AWS throttle or suspend an instance used to avoid data-transfer fees, which matters for proxy workloads. The burst-credit pattern is well evidenced (three Reddit threads between November 2025 and March 2026 where an instance became unresponsive after a CPU burst), and the site's `fits.badly` does not mention CPU throttling.

**Contradiction.** None. The site's 99.5% and 99.99% figures are right; the conditions are missing.

**Weak.** The PHP2Shell blueprint complaint is a single HN comment; the "no renewal price jumps" line comes from a comparison site (HostingDive) with an affiliate motive.

**Where it goes.** `capabilities.sla` note; `caveats[]` for §51.3 and burst CPU; `company.facts` "Recent incidents" (none in 2026 is itself the finding).

### linode — Akamai Cloud (Linode)

**Gaps.** The July 2025 Newark/LKE outage spread to Dallas, Fremont, Sydney, Tokyo 2, Toronto and Washington, with 27 h+ down for at least one user. October–November 2026 incidents: FR-PAR-2 connectivity 2 November, IN-MAA 1 November, BR-GRU Block Storage 28 October, LKE Enterprise provisioning failures in all regions 20 October, Cloud Manager/API problems 9–13 October, and a "PwnEscape" guest-to-host KVM escape advisory running 15–30 October. LKE and Object Storage are repeatedly described as less stable than plain compute. SLA: pro-rata with no published formula, maintenance with 24 h notice excluded, 99% for limited-availability plans.

**Contradiction.** None. The site's 99.99% and 30-day claim are right; the exclusions and the missing formula are gaps.

**Weak.** `vendorwatch` calling Linode "most incident-prone" is an outage-monitoring vendor's marketing; the `@uptimeprj` monitor is one sample. HostAdvice user reviews did not render.

**Where it goes.** `company.facts` "Recent incidents" and "Uptime promise"; `caveats[]` for the KVM advisory; `features/company.json` for LKE/Object Storage.

### lizard — Lizard

**Gaps.** Regional figures the site does not carry: EU West 99.88% and US East 99.88% (deploys 99.88–99.89%, S3 99.94%), with "No incidents reported" on every day listed — which implies roughly 1 % unposted downtime. Terms: you may not re-register after termination, aggregated usage data may be used for "benchmarking", and "We do not delete data because of a pause".

**Contradiction (drift).** Site: "99.95% platform uptime". Dossier, 4 November: "Platform 99.96%". Minor refresh.

**Weak.** The dossier's own finding is the important one: a cluster of near-identical promotional X posts looks coordinated. The site already says "astroturf-like marketing"; it should not add the quoted posts as evidence.

**Where it goes.** `company.facts` "Status and SLA"; `company.facts` "Terms"; `reviews.json` caveat.

### modal — Modal

**Gaps.** Dated incidents: 5 October 2026 Function and Sandbox execution degraded (worker networking), 15 January Volumes access intermittent ~21 h, 8 September 2025 GPU scheduling degraded ~4 h, 8 February 2026 Redis saturation ~45 min. The 29 July 2026 security context: a Hugging Face agent intrusion used a customer's unauthenticated public Sandbox endpoint; Modal says isolation was not breached. Terms: no uptime percentage, and suspension when "reasonably necessary" with prior notice.

**Contradiction.** None. The site's 100%/99.983%/99.989% figures match.

**Weak.** The 3 November X claim that Modal "announced hourly price increases" was not verified on the pricing page — the dossier flags it, and the site should not use it.

**Where it goes.** `company.facts` "Recent incidents"; `caveats[]` for public-endpoint exposure; `company.facts` "Terms".

### morph — Morph

**Gaps.** The status page shows one incident (4 December 2025) and none since, while X users reported downtime in mid-August 2026 and a user saying it "didn't work" two weeks earlier — a status-page credibility question, not a proven outage. The terms are unusually buyer-friendly and absent from the site: suspension with notice and restoration, 30 days' price-change notice (60 days above a 15% increase in 12 months), no material reduction of core functionality without a workaround or pro-rata refund, and a statement that Morph does not monitor instance contents.

**Contradiction.** None. The site's "100% for the Cloud API over its 90-day chart" is consistent with one old incident outside the chart.

**Weak.** Both August reports are single X users, one of them the same enthusiastic customer; the links were not re-found. Treat as a lead to re-check, not a fact.

**Where it goes.** `company.facts` "Terms" (a rare positive); `caveats[]` "status page shows no incidents" with the caveat that the reports are unverified.

### ovhcloud — OVHcloud VPS

**Gaps.** The July 2026 CVE-2026-53359 ("Januscape") emergency patch: tens of thousands of hypervisor hosts carrying "environ un million de machines virtuelles" were rebooted without individual customer agreement; some VMs did not return (a libvirt-guests/Nova conflict); data was corrupted on VMs across 3 clusters; Paris Nova/Neutron returned HTTP 503 for about two hours; the campaign ran about 11 days. Also missing: 47 incidents in October 2026 and 28 in September, a VPS host outage on 3 November (5 h), the 2026 automated-backup freezes (15 April, 19 June, ticket open two months), and the 2021 SBG2 fire that destroyed a datacentre including same-site backups.

**Contradiction.** None on stated facts. The site's 99.9% and credit tiers are right; "commercially reasonable efforts" is missing.

**Weak.** The 11-day duration and some customer counts come from French trade press search extracts. The vendor blog is candid and is the right primary source for the reboot, corruption and API numbers.

**Where it goes.** `caveats[]` "Mass reboot for CVE-2026-53359"; `company.facts` "Recent incidents"; `features/company.json` for the SBG fire as a cross-provider backup lesson.

### runtime — Runtime

**Gaps.** The measured record: API 98.91% over 30 days (21,349 of 21,584 checks), sandbox starts 98.42% (4,249 of 4,317), 25 October at 75% (about 6 hours of failures), 8 October at 93.47%, median start 495 ms. The dossier's computed October figure of about 98.97% sits below the 99% promise, so the automatic 10% credit should apply — that computation is the dossier's, not a published number. Terms: suspension "immediately and without notice" on reasonable belief of abuse, and "Deleted data cannot be recovered".

**Contradiction (drift).** Site: "96.37% over 7 days and 98.87% over 30". Dossier: 98.91% over 30 days. Later read, same direction; refresh.

**Weak.** The October percentage is inferred from a daily table and must be labelled `inferred` if used. HN coverage is three self-promotional posts.

**Where it goes.** `company.facts` "Status and SLA"; `caveats[]` "Uptime was below the published promise" can carry the dates and numbers; `company.facts` "Terms".

### sandboxer — Sandboxer

**Gaps.** Status detail: website/dashboard 99.93%, sandboxes 99.80% (create, run, pause, resume) and preview/SSH 99.80% over 90 days, with "No incidents in the last 90 days" — roughly 4.3 hours of unposted sandbox failures. Terms: suspension immediately on reasonable belief of abuse, auto-stop and suspension on detected abuse, and expired sandboxes are deleted and cannot be resumed.

**Window difference.** Site: "API 100% and sandboxes 99.45% over 30 days". Dossier: sandboxes 99.80% over 90 days. Different windows; the 30-day figure is worse and should be kept, with the 90-day figure added.

**Weak.** Every visible signal is vendor-authored; the dossier says so. No independent evidence exists.

**Where it goes.** `company.facts` "Status and SLA"; "Terms"; `capabilities.status-page` note.

### scaleway — Scaleway Instances

**Gaps.** SLA remedy detail: a voucher of 10%, 25% or 100% of that month's fee, claimed within 30 days with your own log files; no SLO for DEV1, GP1, PLAY2, PRO2, COPARM1, ENT1 or Development instances (the site names four of the seven). Dated incidents: Serverless SQL all databases unavailable in fr-par 29–30 October, Kapsule nodes failing 26–28 October, block-storage latency 29 October, support ticket and call delays logged 8–26 October, VPC Metadata API slowdown 3 November. Price increases from 1 June 2026 and VC1/START1/X64 forced onto DEV1 on 31 May 2026.

**Contradiction (drift).** Trustpilot: site 1.5 (360 reviews); dossier 1.4. Minor.

**Weak.** The May 2026 fr-par power outage detail is a search summary only. HostAdvice leads with paid placements for other hosts.

**Where it goes.** `capabilities.sla` note; `company.facts` "Recent incidents" and "Uptime promise"; `caveats[]` for the forced migration.

### sprites — Sprites

**Gaps.** The research ledger already records the 11–12 October hosting outage (23:30–00:45 UTC, some or all hosted sprites), but the profile does not carry it. New from the dossier: "Sprite creates failing" on 8 October and a 29 October user report where a Sprite returned "503 Storage not ready" and exec, checkpoint listing and protective snapshots all failed. Fly platform incidents in November: ARN machine-start failures, IAD emergency maintenance, outbound IPv4 failures for 2 h 10 m. SLA wording: 99.9% "Actual Availability", credits from 10% once reported, Enterprise only. Terms: "AS IS", "AS AVAILABLE", "WITH ALL FAULTS".

**Contradiction.** None. The site's "component on Fly's status page with no numeric uptime figure" and Enterprise-only SLA are right.

**Weak.** The 29 October write-up is one user's gist; it does not establish data loss. "Auto-sleep prevents scheduled jobs" is one Reddit user from a search extract.

**Where it goes.** `company.facts` "Recent incidents"; `company.facts` "Terms"; `fits.badly[]` for scheduled jobs.

### tensorlake — Tensorlake

**Gaps.** The credit schedule (10% at 99.50–99.89%, 20% at 99.00–99.49%, 35% at 95.00–98.99%, 50% below 95%), automatic application, a 50% monthly cap, carry-forward, a durability P1 that earns an extra 50% credit and a 10-business-day RCA, a chronic-failure exit (below 99.5% in two consecutive months or three in six), and maintenance exclusions (72 h notice, max 4 h a month). The npm compromise detail: a compromised maintainer account published through Tensorlake's own release workflow with valid provenance, live about 1 h 40 m (01:12–02:54 UTC on 8 October), npm only, fix in 0.5.145, payload a preinstall credential stealer including a `gh-token-monitor` that deletes the home directory if the stolen GitHub token is revoked. Status 99.90% for sandboxes over the 90 days to 4 November.

**Contradictions.** (a) The site contradicts itself. `capabilities.sla`: "no — The only published SLA is a 24-hour response to a P1 support ticket, not an uptime promise." `company.facts`: "99.9% monthly availability for the control plane, with service credits capped at 50% of the month's fees". The Terms confirm the company fact; the capability row is wrong. (b) P1 target: site "24-hour P1"; Terms §5.7 "4 hours, 24×7". (c) Minor drift: site 99.89% to 29 October; dossier 99.90% to 4 November.

**Weak.** "TaskletAI runs 50k+ sandboxes" is the CEO on X; the Harbor maintainer's praise is one post; Reddit is vendor-run. The incident detail is strong because the advisory and The Register are first-party and third-party respectively — that part is not weak.

**Where it goes.** `capabilities.sla` verdict and figure; `company.facts` "SLA" and "Support"; `caveats[]` "A malicious npm release shipped in October 2026" expanded; `reviews.json` theme expanded.

### vercel-sandbox — Vercel Sandbox

**Gaps.** Sandbox-specific and platform incidents: 6 October elevated Sandbox error rates in Paris (cdg1) for 25 minutes; 12 October build/deploy failures for 6 h 40 m; 10 October iad1 observability delays. SLA wording: "commercially reasonable efforts" toward 99.99%, excluding Excused Downtime, credits as a percentage of monthly fees once claimed, and Sandbox is not named. The $1M public security challenge for Sandbox (August 2026) is a positive signal the site does not mention.

**Contradiction.** None. The site's 99.99% Enterprise figure and "does not name Sandbox" are right; the "commercially reasonable efforts" qualifier is missing.

**Weak.** The CEO's 2 November X post that Sandbox is "beautifully delivering on SLOs" is marketing. The 0.7 s median start claim comes from a third-party X post.

**Where it goes.** `company.facts` "Recent incidents" and "Uptime promise"; `strengths[]` for the security challenge.

### vultr — Vultr

**Gaps.** SLA mechanics: 100% applies per item to network and host node only (not API, panel or DNS), GPU excluded; credits run from 12 hours (under 9 minutes of downtime) to 672 hours (420+ minutes); you must open a ticket and expressly request credit within 3 days under ToS §18; credits expire after a year. The "status page green while down" pattern is repeated in 2026: Tokyo on 6 September (03:53–07:53 UTC), Dallas on 17 August, Tokyo 4–5 May (18.5 h), and four Amsterdam incidents in 45 days. Terms: "AS IS", no refunds on cancellation, liability capped at six months of fees, suspension for undue resource stress (§16.2). The 2024 perpetual-rights controversy, later removed, is also absent.

**Contradiction.** None. The site's 100% and ticket-request wording are right; the scope, tiers and deadlines are missing.

**Weak.** Reddit text is from search extracts; X is full of Vultr marketing; the cause of the 2 November outage is unverified.

**Where it goes.** `capabilities.sla` note; `company.facts` "Recent incidents" and "Uptime promise"; `caveats[]` for §16.2.

---

## Method limits

- The dossiers are one to six days newer than most site `checkedOn` dates, so several figures differ by drift. I marked those separately and did not treat them as errors.
- I read the site's `company.facts`, `caveats`, `fits.badly`, `strengths`, review record and three capability rows, plus the research file where I needed it. I did not re-read every `whatItIs` or `billing` sentence, so a gap marked "not on the site" means "not in the buyer-facing company, caveat, fit or review fields I compared".
- Five live sources were opened (Tensorlake Terms, Cloudflare Enterprise SLA, Contabo status, Contabo help article, Pingoru archive, OVHcloud blog). I did not re-verify the Reddit, X, LET or Trustpilot items the dossiers cite; those remain dossier claims, and the weak-claim notes say which ones need a first-party source before the site can state them.
- No site data was edited, and nothing was committed or pushed.

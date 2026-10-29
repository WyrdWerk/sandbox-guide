# Notes: state and staying-on capability index

Checked 2026-10-29. 18 capabilities × 16 providers = 288 rows. Every quote in the JSON was checked
against the live page it cites on this date, not against `research/*.md`.

Counts: 144 yes, 54 partly, 83 no, 7 not-published.

## Contradictions between pages

**Blaxel, how fast a machine goes to sleep.** The sandbox docs say standby happens "in approximately
15 seconds" without an active connection, and that an open WebSocket/TCP connection gets a 15-minute
idle timeout. The pricing page says Blaxel "scales sandboxes to zero the second they're idle". I used
the docs for the verdict and did not put a number in `choose-idle` (it is `no`, because the SDKs have
no stop or start call to control standby at all).

**Cloudflare, whether there is a default inactivity timeout.** The same lifetime page says an instance
keeps running for the time set with `setInactivityTimeout()`, up to 6 hours, and then says "Without a
timeout, Cloudflare stops the instance shortly after the Durable Object becomes inactive." So there is
no default *number*, but there is default behaviour. The row says `partly` with the 6-hour ceiling.

**Boat, pause.** The homepage still says "pause billing"; the docs say "There is no pause." The API
calls a stopped sandbox `archived`. Verdict follows the docs.

**Sandboxer, create time.** The live page (checked today) reports 0.18 s median from a create to
`ready`, measured 2026-10-28. Firecrawl returned a cached copy of the same page reporting 0.69 s
measured 2026-10-27, and a different description of the pool ("each node keeps a few small and default
sandboxes" rather than "each region keeps sandboxes already booted"). The JSON uses the live figure.
Firecrawl's default cache is two days, so a Firecrawl-only check would have shipped the stale number.

**Daytona, disk.** The organisation ceiling is documented as 10 GB per sandbox, but the Windows
presets list 50 GiB. Both are below 100 GiB, so the verdict is `no` either way.

## Verdicts I am unsure of

- **Daytona `wake-on-request` = no.** Nothing says a preview request starts a stopped sandbox, and
  every lifecycle path requires an explicit start. This is an absence, not a statement, so it is
  marked `inferred`.
- **Sandboxer `volumes` = no.** There is no attachable volume product, but Docker named volumes inside
  the machine are mentioned in guides. A reader could count those. I did not.
- **Sprites `templates` = no.** You can restore a checkpoint over the same Sprite, but starting a new
  Sprite from one is not documented.
- **Blaxel and Morph `big-disk` = not-published.** Neither publishes a maximum disk or volume size.
- **Lizard `warm-pool` = not-published.** The quickstart mentions a `poolSize` option in passing and
  the sandbox page mentions "pool capacity", but nothing documents a pool you can create.
- **Warm pools generally.** Tensorlake is the only provider with a pool you configure. Daytona has one
  but it is switched on by support. Sandboxer keeps pools but you cannot size them. Modal and Runtime
  document a do-it-yourself pattern (keep spares, reuse them) and are marked `partly`. Blaxel, whose
  sandboxes wait in standby indefinitely, is marked `no` because it has no pool concept at all — that
  is a judgement call a reader may disagree with.
- **`backups` for Boat and Sandboxer = yes.** Both take automatic disk snapshots on a timer (every
  minute, every ten minutes), but both keep them on the same machine or cluster. They are scheduled
  copies, not disaster recovery. The notes on those rows say so.
- **Cloudflare `shared-volume` = partly.** Several sandboxes can mount the same R2 prefix, but the
  docs never say so outright and there is no locking.
- **InstaBox `stay-on` = yes.** The older research recorded an 8-hour cap on free machines. That
  sentence is no longer in the docs; the current page says there is no forced TTL. The 30-minute idle
  pause on the free plan still applies and is recorded under `choose-idle`.

## Changed since 2026-10-28

- **boxd now documents detachable disks** (`docs.boxd.sh/guides/disks`: "A disk is standalone storage
  that outlives the machine it is attached to"). The site's research said there was no guide, size list
  or price. `volumes` moves from partly to yes; `shared-volume` stays no because a disk takes one
  machine at a time.
- **Daytona published warm pools** (`docs.daytona.io/docs/en/warm-pools`), gated behind a support
  request. New since the research; nothing in `site/src/data` covers it.
- **Cloudflare snapshots are now labelled public beta** on the lifetime page, with the same 20 GB and
  30-day limits.
- **Vercel `pause-memory` moves from partly to no.** The docs are explicit that a stop saves the
  filesystem only and the next start is a new session. The site's row said partly.
- **Lizard `templates` moves from "fixed catalogue only" to yes.** A snapshot restores into a new
  sandbox, so a set-up machine can be reused even though the template catalogue itself is fixed.
- **InstaBox free-plan runtime cap** is no longer documented (see above).
- **Tensorlake is new** and has no entry in `site/src/data`. It is the strongest provider in this
  group on pools, snapshots with memory and shared volumes, and the weakest on scheduled runs.

## Method

- Bulk pages were fetched from the providers' own docs and converted to text; every quote in the JSON
  is a substring of the live page fetched on 2026-10-29 (whitespace and Markdown emphasis normalised).
- Composio Firecrawl was used for spot checks of table-shaped quotes (Cloudflare limits, InstaBox
  concepts) and for the Sandboxer page, where its cached copy differed from the live page.
- `figure` carries a number only where one helps (size, time, price, count). Short labels such as
  "private preview" live in `shortfall` or `note` instead.
- battleships.dev was not used at all in this pass.
